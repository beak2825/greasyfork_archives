// ==UserScript==
// @version         0.20
// @name            Phone Tool: Org Chart
// @namespace       https://phonetool.amazon.com
// @description     Updated phone tool org chart - supporting the new redesigned phone tool (Dec 14th, 2017)
// @include         https://phonetool.amazon.com/people/*
// @include         https://phonetool.amazon.com/users/*
// @include         https://connect.amazon.com/people/*
// @include         https://connect.amazon.com/users/*
// @run-at          document-start
// @grant           GM.setClipboard
// @grant           GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/475053/Phone%20Tool%3A%20Org%20Chart.user.js
// @updateURL https://update.greasyfork.org/scripts/475053/Phone%20Tool%3A%20Org%20Chart.meta.js
// ==/UserScript==

// GreaseMonkey 4.0 removes the document-body possibility for run-at, so we have to integrate this ourselves by adding the script directly.

/*
REVISION HISTORY:
0.8  - 2018-01-08 - lepine@ - Fix information for non-blue-badges
0.9  - 2018-11-22 - tnakada@ - Add login to org chart (avoids an extra click) and sorts managers first
0.10 - 2019-03-12 - lepine@ - Update Virtual Location handling (remove requirement for space)
0.11 - 2019-09-16 - lepine@ - Shorten tenure (abbreviation for days, months, years) 
0.12 - 2020-06-02 - lepine@ - Add support for alternate Phone Tool URL (connect.amazon.com)
0.13 - 2020-06-03 - lepine@ - Add mutually exclusive execution of scripts
0.14 - 2020-06-10 - lepine@ - Support connect and phonetool in fetching the information
0.15 - 2020-12-17 - lepine@ - Add deprecation notice for SAPP
0.16 - 2020-12-17 - lepine@ - New default version post SAPP
0.17 - 2020-12-17 - lepine@ - Add (copy) to the alias in the org view
0.18 - 2020-12-17 - lepine@ - Allow SAPP autoupdate
0.20 - 2022-02-18 - lepine@ - Remove JQuery dependency / Align all scripts on 0.20
*/

'use strict';

const copy = typeof(GM_setClipboard) == "function" ? GM_setClipboard : GM.setClipboard;

const orgChartScriptContent = `
class UpgradePhoneToolOrgChartExtender {
    constructor(addUserAttributesCallback) {
        this.addUserAttributesCallback = addUserAttributesCallback;
        this.tenureById = {};
        this.levelById = {};
        this.managerById = {};
        this.sortUsers = this.sortUsers.bind(this);
    }

    GetUsersInfoUri(userIds) {
        // Support phonetool.amazon.com and connect.amazon.com by removing hostname
        return "/users.json?ids=" + encodeURIComponent(userIds.join(','));
    }

    getReadableDate(when) {
        try
        {
            const year = when.getUTCFullYear();
            const month = when.getUTCMonth();
            const day = when.getUTCDate();
            let result = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ][month] + " ";
            result += day;
            if(day >= 10 && day <= 20) {
                result += "th";
            } else if((day % 10) == 1) {
                result += "st";
            } else if((day % 10) == 2) {
                result += "nd";
            } else if((day % 10) == 3) {
                result += "rd";
            } else {
                result += "th";
            }
            result += ", " + year;
            return result;
        } catch(e) {
            console.error("Unable to format date", dateStr, e);
            return "now";
        }
    }
    
    onUsersLoaded(userIds) {
        const successCallback = this.handleUserData.bind(this);
        const url = this.GetUsersInfoUri(userIds);
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: successCallback,
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("An error occured calling resource: ", textStatus, errorThrown);
            }
        });
    }

    handleUserData(data) {
        try {
            data.users.forEach((user) => {
                this.managerById[user.id] = user.is_manager ? 1 : 0;
                this.tenureById[user.id] = user.tenure_days;
                this.levelById[user.id] = user.job_level == 99 ? 0: user.job_level;
            });
            const userAttributes = data.users.map((user) => {
                let attrs = [];
                if((user.login !== null) && (user.login !== "")) {
                    attrs.push({ label: '@', value: user.login });
                }
                if((user.job_level !== null) && (user.job_level !== 99)) {
                    attrs.push({ label: 'Level', value: user.job_level });
                }
                if(((user.hire_date_iso !== null) && (user.hire_date_iso !== "")) && ((user.total_tenure_formatted !== null) && (user.total_tenure_formatted !== "") && (user.total_tenure_formatted !== 0))) {
                    attrs.push({ label: 'Tenure', value: user.total_tenure_formatted.replace(/ years?/,"y").replace(/ months?/,"m").replace(/ days?/,"d") + " (" + this.getReadableDate(new Date(user.hire_date_iso + "T00:00:00Z")) + ")" });
                } else if((user.hire_date_iso !== null) && (user.hire_date_iso !== "")) {
                    attrs.push({ label: 'Tenure', value: this.getReadableDate(new Date(user.hire_date_iso + "T00:00:00Z")) });
                } else if((user.total_tenure_formatted !== null) && (user.total_tenure_formatted !== "") && (user.total_tenure_formatted !== 0)) {
                    attrs.push({ label: 'Tenure', value: user.total_tenure_formatted.replace(/ years?/,"y").replace(/ months?/,"m").replace(/ days?/,"d") });
                }
                if((user.city !== null) && (user.city !== "")) {
                    attrs.push({ label: 'City', value: (user.city.startsWith("Virtual Location") ? "Virtual" : user.city) + " (" + user.country + ")" });
                } else if((user.building !== null) && (user.building !== "")) {
                    attrs.push({ label: 'City', value: (user.building.startsWith("Virtual Location") ? "Virtual" : user.building) + " (" + user.country + ")" });
                }
                return {
                    id: user.id,
                    additionalAttributes: attrs
                }
            });
            this.addUserAttributesCallback(userAttributes);
        } catch(e) {
            console.error("An error occured processing response: ", e, data);
        }
    }

    // sorts by level, then tenure, then default
    sortUsers(a, b) {
        try {
            if(this.managerById[b.user.id] !== this.managerById[a.user.id]) {
                return this.managerById[b.user.id] - this.managerById[a.user.id];
            }
            if(this.levelById[b.user.id] !== this.levelById[a.user.id]) {
                return this.levelById[b.user.id] - this.levelById[a.user.id];
            }
            if(this.tenureById[b.user.id] !== this.tenureById[a.user.id]) {
                return this.tenureById[b.user.id] - this.tenureById[a.user.id];
            }
        } catch(e) {
            console.error("An error sorting objects: ", e, a, b);
        }
        return OrgChart.DefaultSort(a, b);
    }
}

window.OrgChartExtender = UpgradePhoneToolOrgChartExtender;`;

function setupOrgChartLinks() {
    function addText(attrs) {
        if(attrs.getAttribute("data-alias-link-added") === "added") {
            return;
        }
        const content = attrs.innerHTML.split(/ /);
        var login = '';
        for (var i = 0; i < content.length; ++i) {
            if ((content[i] === '@:') && (i < content.length-1)) {
                login = content[i+1];
                content[i+1] = ` <a href="/users/${login}" title="click to copy alias">${login} (copy)</a>`;
                break;
            }
        }
        if(login !== '') {
            attrs.setAttribute("data-alias-link-added", "added");
            attrs.innerHTML = content.join(' ');
            attrs.querySelector(":scope a").addEventListener('click', function(evt) {
                evt.preventDefault();
                copy(login);
            });
        } else {
            console.error("Org Chart Userscript, unable to find the login for element", attrs.innerHTML);
        }
    }

    function textAdded(mutationsList, observer) {
        for(const mutation of mutationsList) {
            addText(mutation.target);
        }
        observer.disconnect();
    }

    function contentAdded(mutationsList, _observer) {
        for(const mutation of mutationsList) {
            for(const target of mutation.addedNodes) {
                if((target.tagName === 'DIV') && (target.classList.contains("org-chart-row"))) {
                    const attrs = target.querySelector(":scope span.additional-attributes");
                    if(attrs !== null) {
                        if(attrs.innerHTML.length > 0) {
                            addText(attrs);
                        } else {
                            const observer = new MutationObserver(textAdded);
                            observer.observe(attrs, { subtree: false, childList: true });
                        }
                    } else {
                        console.error("Org Chart Userscript, unable to find the 'additional-attributes' <span/> element in the org chart widget");
                    }
                }
            }
        }
    }

    function bindToWidget() {
        console.log("Org Chart Userscript, initializing");
        const observer = new MutationObserver(contentAdded);
        const orgChart = document.documentElement.querySelector("div.org-chart");
        if(orgChart !== null) {
            // Execute if already done
            const entries = orgChart.querySelectorAll(":scope div.org-chart-row");
            if(entries.length > 0) {
                contentAdded([{addedNodes: entries}], null);
            }
            // Observe if not done
            observer.observe(orgChart, { subtree: true, childList: true });
        } else {
            console.error("Org Chart Userscript, unable to find the Org Chart Widget");
        }
    }

    window.addEventListener('load', bindToWidget);
}

if (typeof(window.customPhoneToolScripts) !== 'object') {
    window.customPhoneToolScripts = {};
}
if (window.customPhoneToolScripts.orgChartExtender !== true) {
    window.customPhoneToolScripts.orgChartExtender = true;
    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.appendChild(document.createTextNode(orgChartScriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);
    setupOrgChartLinks();
}