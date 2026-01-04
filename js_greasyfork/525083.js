// ==UserScript==
// @name         Team Capacity
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  The script is used to extract app info to display it on the page
// @author       You
// @match        https://jiraent.staples.com/secure/RapidBoard.jspa?rapidView=22485*
// @match        https://jiraent.staples.com/secure/RapidBoard.jspa?projectKey=P2PTEAM&rapidView=22485*
// @match        https://jiraent.staples.com/browse/P2PTEAM*
// @match        https://jiraent.staples.com/projects/P2PTEAM*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=staples.com
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/525083/Team%20Capacity.user.js
// @updateURL https://update.greasyfork.org/scripts/525083/Team%20Capacity.meta.js
// ==/UserScript==

const css = `
    .individual-capacity {
        margin-left: 4px;
    }
    .automation-icon {
        margin-right: 4px;
        font-size: 10px;
    }

`;

(function(history) {
    'use strict';
    GM_addStyle(css);
    console.log(`team capacity: start`);
    const sprintData = {
        "60189": 81,
        "60190": 79,
        "60191": 73,
        "60192": 71,
        "60193": 68,
        "60194": 71
    };

    function removeAnnouncementBanner() {
        const announcementBanner = document.querySelector('.aui-banner-announcement');
        if (announcementBanner) {
            announcementBanner.remove();
        }
    }



    const ajaxInterceptor = initAjaxInterceptor();


    let isObserverActive = false;
    const observeBacklog = () => {
        const backlogObserver = new MutationObserver(() => {
            Object.keys(sprintData).forEach((sprintId) => {
                // Try to find the target element for each sprint ID
                const targetDiv = document.querySelector(`div[data-sprint-id="${sprintId}"] .ghx-stat-total`);
                console.log(`team capacity: ${targetDiv}`);

                if (targetDiv) {
                    const element = Array.from(targetDiv.querySelectorAll('.ghx-label')).find(el => el.textContent.trim() === 'Team Capacity');
                    if (element != null) {
                        //
                        // When switching between people, Jenkins has to load the data of the person switching into and then the UI is refreshed
                        // So if the "Team Capacity" element is previously present, wait until it is removed and re-rendered on the screen
                        //
                        console.log(`team capacity: "Team Capacity" element is still present. Skipping now for another retry later`);
                        return;
                    }
                    backlogObserver.disconnect();
                    console.log(`team capacity: backlogObserver is disconnected`);
                    isObserverActive = false;
                    console.log(`team capacity: targetDiv available`);
                    // Create and configure the <span> if it doesn't already exist
                    const spanElement = document.createElement('span');
                    spanElement.className = 'ghx-label';

                    // Add value from predefined data
                    spanElement.textContent = `Team Capacity`;

                    // Create and configure the <aui-badge>
                    const badgeElement = document.createElement('aui-badge');
                    badgeElement.className = '';
                    badgeElement.title = `Team Capacity ${sprintData[sprintId]}`;
                    badgeElement.textContent = sprintData[sprintId];

                    // Prepend the <span> to the target div
                    targetDiv.prepend(spanElement);
                    spanElement.insertAdjacentElement('afterend', badgeElement);


                    //
                    // Additional script (Not related to team capacity)
                    //
                    removeAnnouncementBanner();
                    //
                    //
                    //
                }
            });
        });

        // Observe the entire document for changes
        backlogObserver.observe(document.body, { childList: true, subtree: true });
        isObserverActive = true;
    }

    observeBacklog();

    ajaxInterceptor.addResponseCallback((xhr) => {
        const { status, responseURL } = xhr;
        let responseText = '{}';
        if ((xhr.responseType === 'text' || xhr.responseType === '') && xhr.responseText) {
            responseText = xhr?.responseText || '{}';
        }

        const pattern = '/plan/backlog/data.json?rapidViewId=12160';
        const found = responseURL.indexOf(pattern) > 0;
        console.log(`team capacity: Found matched URL pattern: ${found}`);
        if (found && !isObserverActive) {
            console.log('team capacity: debug - observer is INACTIVE, registering backlog observer from ajax interceptor');
            observeBacklog();
        }
    });

    /*
     * NOT NEEDED ANYMORE - REPLACED BY AJAX Interceptor logic *
    const registerHistory = () => {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        function onUrlChange() {
            const params = new URLSearchParams(window.location.search);
            console.log('team capacity: debug Query param changed:', params.toString());
            if (!isObserverActive) {
                console.log('team capacity: debug - observer is INACTIVE, registering backlog observer from url change');
                observeBacklog();
            }
        }

        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            onUrlChange();
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args);
            onUrlChange();
        };

        window.addEventListener('popstate', onUrlChange);
    };
    */

    // registerHistory();

    // -----------------------------------------------------------

    let isDialogHandled = false;
    const yearAndQuater = '2025Q3';

    // Sprint data
    const sprintDataPerPerson = {
        Steffi: [6.4, 6.4, 4.4, 6.4, -3.6, 6.4],
        Sanik: [5.6, 4.6, 3.6, 4.6, 4.6, 4.6],
        Vishal: [7, 6, 7, 7, 7, 6],
        Muniyasamy: [7, 7, 7, 6, 8, 7],
        Suraj: [6, 8, 8, 3, 3, 6],
        Brian: [8, 8, 3, 7, 8, 3],
        Naveen: [8, 8, 7, 3, 8, 8],
        Mohammad: [4, 4, 1, 4, 4, 4],
        Nivetha: [7, 7, 8, 6, 8, 6],
        Frank: [7, 7, 8, 8, 7, 7],
        Shilpa: [7, 7, 8, 8, 7, 6],
        Vinayk: [8, 8, 8, 8, 8, 8]
    };


    const sprintDataAutomationPerPerson = {
        Vinayak: [0, 2, 2, 2, 2, 2]
    };

    const observeDialogBox = () => {
        const dialogOpenObserver = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                if (mutation.type === 'childList' && !isDialogHandled) {
                    const dialogBox = document.getElementById('assigned-work-dialog');
                    if (dialogBox) {
                        handleDialogOpen(dialogBox, dialogOpenObserver);
                    }
                }
            });
        });

        dialogOpenObserver.observe(document.body, { childList: true, subtree: true });
    };

    const handleDialogOpen = (dialogBox, dialogOpenObserver) => {
        isDialogHandled = true;
        console.log('team capacity: Dialog box opened:', dialogBox);

        dialogOpenObserver.disconnect();

        const dialogCloseObserver = new MutationObserver(() => {
            if (!document.body.contains(dialogBox)) {
                console.log('Dialog box closed');
                dialogCloseObserver.disconnect();
                isDialogHandled = false;

                dialogOpenObserver.observe(document.body, { childList: true, subtree: true });
            }
        });
        dialogCloseObserver.observe(document.body, { childList: true, subtree: true });

        processDialogContent(dialogBox);
    };

    const processDialogContent = (dialogBox) => {
        const headingElement = dialogBox.querySelector('h2');
        console.log('team capacity: checking heading element presence');
        if (headingElement) {
            console.log('team capacity: heading element present');
            const sprintText = headingElement.innerText; // Example: "Sprint 3"
            const sprintMatch = sprintText.match(new RegExp(`REORDER ${yearAndQuater} Sprint (\\d+)`));

            if (sprintMatch) {
                const sprintNumber = parseInt(sprintMatch[1], 10) - 1; // Convert to zero-based index
                const rows = dialogBox.querySelectorAll('table tbody tr');

                rows.forEach((row) => {
                    const personNameCell = row.querySelectorAll('td')[0];
                    // Get the text content of the cell excluding the text inside <span> and <img>
                    const personName = personNameCell
                        ? [...personNameCell.childNodes]
                            .filter((node) => node.nodeType === Node.TEXT_NODE) // Only get text nodes (exclude elements like span and img)
                            .map((node) => node.textContent.trim()) // Trim whitespace
                            .join('') // Join the remaining text
                            .replace(/,/g, '') // Remove comma between person full name
                            .split(' ')[0] // Extract the first name
                        : null;
                    console.log(`team capacity: personName: ${personName}`);

                    if (personName && sprintDataPerPerson[personName]) {
                        const badgeElement = getBadgeElement(sprintDataPerPerson[personName][sprintNumber], 'individual-capacity');
                        personNameCell.appendChild(badgeElement);
                    }
                    if (personName && sprintDataAutomationPerPerson[personName]) {
                        const automationIconElement = document.createElement('span');
                        automationIconElement.className = 'automation-icon';
                        automationIconElement.textContent = '🤖';
                        const automationText = `${sprintDataAutomationPerPerson[personName][sprintNumber]}`;
                        const badgeElement = getBadgeElement(automationText, 'individual-capacity');
                        badgeElement.prepend(automationIconElement);
                        personNameCell.appendChild(badgeElement);
                    }
                });
            }
        }
    };

    observeDialogBox();
    removeAnnouncementBanner();

    function getBadgeElement(text, className = '') {
        const badgeElement = document.createElement('aui-badge');
        badgeElement.className = className
        badgeElement.textContent = text;
        return badgeElement;
    }

    ajaxInterceptor.wire();

})(window.history);


//
// ajax-interceptor BEGINS
//

function initAjaxInterceptor() {
    const COMPLETED_READY_STATE = 4;

    const RealXHRSend = XMLHttpRequest.prototype.send;

    const requestCallbacks = [];
    const responseCallbacks = [];
    let wired = false;

    function arrayRemove(array,item) {
        var index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        } else {
            throw new Error("Could not remove " + item + " from array");
        }
    }


    function fireCallbacks(callbacks,xhr) {
        for( var i = 0; i < callbacks.length; i++ ) {
            callbacks[i](xhr);
        }
    }

    function fireResponseCallbacksIfCompleted(xhr) {
        if( xhr.readyState === COMPLETED_READY_STATE ) {
            fireCallbacks(responseCallbacks,xhr);
        }
    }

    function proxifyOnReadyStateChange(xhr) {
        var realOnReadyStateChange = xhr.onreadystatechange;
        if ( realOnReadyStateChange ) {
            xhr.onreadystatechange = function() {
                fireResponseCallbacksIfCompleted(xhr);
                realOnReadyStateChange();
            };
        }
    }

    function addResponseCallback(callback) {
        responseCallbacks.push(callback);
    };

    function wire() {
        if ( wired ) throw new Error("Ajax interceptor already wired");

        // Override send method of all XHR requests
        XMLHttpRequest.prototype.send = function() {

            // Fire request callbacks before sending the request
            fireCallbacks(requestCallbacks,this);

            // Wire response callbacks
            if( this.addEventListener ) {
                var self = this;
                this.addEventListener("readystatechange", function() {
                    fireResponseCallbacksIfCompleted(self);
                }, false);
            }
            else {
                proxifyOnReadyStateChange(this);
            }

            RealXHRSend.apply(this, arguments);
        };
        wired = true;
    };

    function isWired() {
        return wired;
    }

    function unwire() {
        if ( !wired ) throw new Error("Ajax interceptor not currently wired");
        XMLHttpRequest.prototype.send = RealXHRSend;
        wired = false;
    };

    return {
        addResponseCallback,
        wire,
        unwire,
        isWired
    }
}