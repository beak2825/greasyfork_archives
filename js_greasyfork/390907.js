// ==UserScript==
// @name         TORN: MPSSE
// @namespace    dekleinekobini.mpsse
// @version      1.10.9
// @author       DeKleineKobini
// @description  For MPSSE agents.
// @match        https://www.torn.com/*
// @require      https://greasyfork.org/scripts/392610-dkk-torn-utilities-development/code/DKK%20Torn%20Utilities%20DEVELOPMENT.js?version=752567
// @require      https://cdnjs.cloudflare.com/ajax/libs/ismobilejs/0.4.1/isMobile.js
// @connect      api.torn.com
// @connect      mpsse.epizy.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/390907/TORN%3A%20MPSSE.user.js
// @updateURL https://update.greasyfork.org/scripts/390907/TORN%3A%20MPSSE.meta.js
// ==/UserScript==

initScript({
    name: "MPSSE",
    logging: "ALL"
});

{
    GM_addStyle(
        "a.button {-webkit-appearance: button; -moz-appearance: button; appearance: button; text-decoration: none; } "
        + ".comphelp-lime { color: lime }"
        + ".comphelp-green { color: green }"
        + ".comphelp-red { color: red }"
        + ".comphelp-white { color: white }"
        + ".color-orangered { color: orangered }"
        + ".comphelp-widget { margin-top: 10px; }"
        + ".comphelp-widget_header, .comphelp-widget_header--error { background-image: linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.07) 0px); background-size: 4px; display: flex; align-items: center; color: rgb(255, 255, 255); font-size: 13px; letter-spacing: 1px; text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px; padding: 6px 10px; border-radius: 5px 5px 0 0; } "
        + ".comphelp-widget_header { background-color: rgb(40, 41, 138); }"
        + ".comphelp-widget_header--error { background-color: rgb(251, 0, 25); }"
        + ".comphelp-widget_title { flex-grow: 1; box-sizing: border-box; }"
        + ".comphelp-widget-message { text-align: center; line-height: 1.4; }"
        + ".comphelp-widget_body { display: flex; padding: 0px; line-height: 1.4; background-color: rgb(242, 242, 242); border-radius: 0 0 10px 10px; }"
        + ".comphelp-panel-left, .comphelp-panel-right { flex: 1 0 0px; }"
        + ".comphelp-panel-left { border-left: 1px solid transparent; }"
        + ".comphelp-panel-right { border-left: 1px solid rgb(204, 204, 204); display: flex-direction: column; border-radius: 0 0 5px 5px; }"
        + ".comphelp-data-table { width: 100%; border-collapse: separate; text-align: left; }"
        + ".comphelp-data-table_header, .comphelp-widget-message { white-space: nowrap; text-overflow: ellipsis; font-weight: 700; padding: 2px 10px; border-top: 1px solid rgb(255, 255, 255); border-bottom: 1px solid rgb(204, 204, 204); background: linear-gradient(rgb(255, 255, 255), rgb(215, 205, 220)); }"
        + ".comphelp-data-table_cell { padding: 2px 10px; border-top: 1px solid rgb(255, 255, 255); border-right: 1px solid rgb(204, 204, 204); border-bottom: 1px solid rgb(204, 204, 204); }"
        + ".comphelp-textarea { resize: none; width: 99%; }"
        + ".comphelp-button, .comphelp-headbutton { text-shadow: rgba(0, 0, 0, 0.05) 1px 1px 2px; cursor: pointer; font-weight: 400; text-transform: none; position: relative; text-align: center; line-height: 1.2; box-shadow: rgba(255, 255, 255, 0.5) 0px 1px 1px 0px inset, rgba(0, 0, 0, 0.25) 0px 1px 1px 1px; border-width: initial; border-style: none; border-color: initial; border-image: initial; padding: 2px 10px; border-radius: 4px; }"
        + ".comphelp-last { margin-top: 1px; margin-bottom: 3px; }"
        + ".comphelp-headbutton { background-color: rgba(255, 255, 255, 0.15); color: rgb(255, 255, 255); }"
        + ".comphelp-highlight-red { background-color: #F76B6B; }"
        + ".comphelp-highlight-orange { background-color: #FBB124; }"
        + ".comphelp-highlight-green { background-color: #60D438; }"
        + ".comphelp-highlight-red_hover:hover { background-color: #FF9F9F !important; }"
        + ".comphelp-highlight-orange_hover:hover { background-color: #FCCF3E !important; }"
        + ".comphelp-highlight-green_hover:hover { background-color: #88D969 !important; }"
        + ".comphelp-highlight-off { background-color: #f2f2f2; }"
        + ".comphelp-sidebar { background-image: linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.07) 0px); background-size: 4px; background-color: rgb(40, 41, 138) !important; color: rgb(255, 255, 255) !important; }"
        + ".comphelp-sidebar span { color: rgb(255, 255, 255); }"
        + ".mpsse_toggle-hidden { display: none; }"
        + ".mpsse_icon svg { display: block; height: 16px; fill: currentColor; cursor: pointer; }"
        + ".mpsse_icon { width: 16px; }"
        + ".mpsse-toggeable > .comphelp-widget_header { cursor: pointer; }"
    );
}

// const CACHE_RECRUITMENT = new Storage("mpsse-recruitmentdetail", "GM");

// CACHE_RECRUITMENT.get().then(c => dkklog.debug("CACHE TEST", c));

const USER = new CurrentUser();

const API = new TornAPI(() => {}, "2rRvmaBDayXQGNGO");

const _settings = {
    name: "MPSSE",
    text: {
        filter: {
            orange: "Highlight uncertain recruits",
            red: "Highlight hard recruits"
        },
        recruitment: {
            recommend: "Would recommend recruiting",
            dontRecommend: "Would not recommend recruiting from",
            mpsse: "Owned by MPSSE"
        }
    },
    sidebar: {
        icon: {
            color: "#FFF",
        }
    },
    data: {
        caution: {
            red: [],
            orange: []
        },
        mpsse: {
            ids: [],
            names: []
        },
        maxLevel: {}
    },
    cache: {
        recruitmentdetails: 1000 * 60 * 60 * 24, // 24 hour
        companydetails: 1000 * 60 * 60 * 24, // 24 hour
    },
    api: {
        base: "http://mpsse.epizy.com/"
    }
}
const _html = {
    sidebar: {
        icon: `<svg xmlns='http://www.w3.org/2000/svg' class='default___3oPC0' fill='${_settings.sidebar.icon.color}' stroke='transparent' stroke-width='0' width='16' height='13.33' viewBox='0 1 16 13.33'><path d='M16,14.33H0v-10H16ZM6,1A1.33,1.33,0,0,0,4.67,2.33V3.67H6v-1a.34.34,0,0,1,.33-.34H9.67a.34.34,0,0,1,.33.34v1h1.33V2.33A1.33,1.33,0,0,0,10,1Z'></path></svg>`
    },
    toggle: {
        icons: {
            open: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 32'><path d='M4 6l-4 4 6 6-6 6 4 4 10-10L4 6z'></path></svg>",
            close: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 32'><path d='M16 10l-6 6-6-6-4 4 10 10 10-10-4-4z'></path></svg>"
        }
    }
}

var href = window.location.href;
href = href.substring(href.indexOf(".com/") + 5, href.indexOf(".php"));

var paramsSpecial = new URLSearchParams(getSpecialSearch());
var params = (new URL(document.location)).searchParams;

showSidebar();

if (href == "profiles") showProfile();
else if (href == "companies") showCompany();
else if (href == "joblist") showCompanyOverview();
else if (href == "page" && params.get("sid") == "UserList") showSearch();
else return;

function loadRecruitmentDetails() {
    getCache("mpsse-recruitmentdetails", false).then(c => {
        if (c) {
            dkklog.debug("recruitmentdetails cache");
            processData(c);
        } else {
            dkklog.debug("recruitmentdetails NO cache");
            new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${_settings.api.base}api.php?api_key=${API.key}&action=company_types`,
                    onreadystatechange: res => {
                        if (res.readyState > 3 && res.status === 200) {
                            dkklog.debug("MP API - Response received for 'company_types'.", res.response)
                            var json = JSON.parse(res.response);

                            if (!json.error) {
                                resolve(json);
                            } else {
                                reject(`Received '${json.error}'`);
                                dkklog.error("MP API - Error while receiving.", json.error);
                            }
                        }
                    },
                    onerror: err => {
                        dkklog.error("MP API - Error while sending.", err);
                        reject(`server error: ${err}`);
                    }
                });
            }).then(json => {
                setCache("mpsse-recruitmentdetails", json, _settings.cache.recruitmentdetails, false);
                processData(json);
            });
        }
    });

    function processData(data) {
        for (let cid in data) {
            let company = data[cid];

            let name = company.name;
            let caution = company.recruit_caution_level;
            let maxLevel = company.maximum_star_should_recruit;

            if (caution == 1) _settings.data.caution.orange.push(name);
            else if (caution == 2) _settings.data.caution.red.push(name);

            _settings.data.maxLevel[name] = maxLevel;
        }
    }
}

function loadCompanyDetails() {
    getCache("mpsse-companydetails", false).then(c => {
        if (c) processData(c);
        else {
            new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${_settings.api.base}api.php?api_key=${API.key}&action=companies`,
                    onreadystatechange: res => {
                        if (res.readyState > 3 && res.status === 200) {
                            debug("MP API - Response received for 'companies'.", res.response)
                            var json = JSON.parse(res.response);

                            if (!json.error) {
                                resolve(json);
                            } else {
                                reject(`Received '${json.error}'`);
                                debug("MP API - Error while receiving.");
                            }
                        }
                    },
                    onerror: err => {
                        log("MP API - Error while sending.", err);
                        reject(`server error: ${err}`);
                    }
                });
            }).then(json => {
                setCache("mpsse-companydetails", json, _settings.cache.companydetails, false);
                processData(json);
            });
        }
    });

    function processData(data) {
        for (let cid in data) {
            let company = data[cid];

            let name = company.name;

            _settings.data.mpsse.ids.push(cid);
            _settings.data.mpsse.names.push(name);
        }
    }
}

function showSidebar() {
    let user = getScriptUser();
    if (user.isTravelling) return;

    let elementJob = $("#sidebar > div[class]:eq(1) div[class^='toggle-content'] > div:eq(3)");
    if (!elementJob.length) return;

    let elementJobRow = elementJob.find("div:eq(0)");
    let elementJobLink = elementJobRow.find("a");
    let elementJobIcon = elementJobLink.find("span:eq(0)");

    let classArea = elementJob.attr("class").split(/\s+/)[0];
    let classRow = elementJobRow.attr("class");
    let classLink = elementJobLink.attr("class");
    let classIcon = elementJobIcon.attr("class");

    $("#sidebar > div:eq(0)").after(`<div class='toggle-content___3XKOC'><div class='${classArea}'><div class='${classRow} comphelp-sidebar'><a href='${_settings.api.base}' target='_blank' class='${classLink}'><span class='${classIcon}'>${_html.sidebar.icon}</span><span>${_settings.name}</span></a></div></div></div>`);
}

function showCompanyOverview() {
    loadRecruitmentDetails();
    loadCompanyDetails();

    USER.update();
    dkklog.trace("USER", USER);
    if (USER.isJailed || USER.isHospitalized || USER.isTravelling) {
        if (USER.isJailed || USER.isHospitalized){
            ajax((page, json, uri) => {
                if (page != "joblist" || !uri) return;

                show();
            });
        }
        else if ($(".content-wrapper > .info-msg-cont .msg").length) setTimeout(show, 100);
        else observeMutations(document, ".content-wrapper > .info-msg-cont .msg", true, show, { childList: true, subtree: true});

        function show() {
            if ($(".comphelp-widget").length) return;

            let searchType, id;
            if (paramsSpecial.has("userID")) {
                searchType = "player"
                id = paramsSpecial.get("userID");
            } else if (paramsSpecial.has("ID")) {
                searchType = "company"
                id = paramsSpecial.get("ID");
            }

            $(".content-wrapper > .info-msg-cont").eq(0).after(
                `<div><article class='comphelp-widget'><header class='comphelp-widget_header border-round'><span class='comphelp-widget_title'>${_settings.name}</span>
<a id='companyLookup' class='button comphelp-headbutton' target='_blank' href='${_settings.api.base}company_viewer.php?company_or_player=${searchType}&search_torn_id=${id}'>View Company</a></header><div id='messagebox' class='comphelp-widget-message' hidden></div></article></div>`
            );
        }
    } else {
        var currentPage = -1;

        if (isRightPage()) waitToShow();
        xhrIntercept((page, json, uri) => {
            if (page != "joblist" || !uri) return;

            if (isRightPage()) waitToShow();
        });

        function isRightPage() {
            paramsSpecial = new URLSearchParams(getSpecialSearch());

            return paramsSpecial.get("p") == "corpinfo" || (paramsSpecial.get("p") == "corp" && paramsSpecial.get("ID") == "14");
        }

        function waitToShow() {
            paramsSpecial = new URLSearchParams(getSpecialSearch());

            if (paramsSpecial.get("p") == "corpinfo") {
                if ($(".info > li:eq(0)").length) show();
                else observeMutations(document, ".info > li:eq(0)", true, show, { childList: true, subtree: true });
            } else if (paramsSpecial.get("p") == "corp" && paramsSpecial.get("ID") == "14") {
                setTimeout(() => {
                    $(".company-list > li").each((index, element) => {
                        let row = $(element);

                        let name = row.find(".company").html();

                        if (_settings.data.mpsse.names.includes(name)) row.addClass("comphelp-highlight-green");
                    });
                    dkklog.debug("Company Name", $(".company-list > li:eq(0) .company").html());
                }, 100);
            }
        }

        function show() {
            let stars = $(".ranks > .active").length;
            let type = $(".m-title > span:eq(1)").html();

            if (!_settings.data.maxLevel[type]) {
                setTimeout(show, 1000);
                return;
            }

            let name = $("#icon27").attr("title").split("<br>")[1];
            name = name.substring(name.indexOf(" of ") + 4, name.indexOf(" ("));
            let isMPSSE = _settings.data.mpsse.names.includes(name);
            let shouldRecruit = _settings.data.maxLevel[type] >= stars;
            dkklog.debug(`${stars}* ${type}`, {
                max: _settings.data.maxLevel[type],
                bool: shouldRecruit
            });

            let clazz, message_color, message;
            if (isMPSSE) {
                message_color = "comphelp-lime";
                message = _settings.text.recruitment.mpsse;
            } else if (shouldRecruit) {
                message_color = "comphelp-lime";
                message = _settings.text.recruitment.recommend;
            } else {
                message_color = "color-orangered";
                message = _settings.text.recruitment.dontRecommend;
            }

            $(".content-wrapper > .company-details").eq(0).before(
                `<div><article class='comphelp-widget'><header class='comphelp-widget_header border-round'><span class='comphelp-widget_title'>${_settings.name}</span><span class='${message_color}'>${message}</span></header><div id='messagebox' class='comphelp-widget-message' hidden></div></article></div>`
            );
        }
    }
}

function showCompany() {
    var _body = $("body");
    var _contentWrapper = $("#mainContainer > .content-wrapper");

    observeMutations(document, ".manage-company > .company-tabs", true, (mut, obs) => {
        observeMutationsFull($(".manage-company > .company-tabs")[0], (mut, obs) => {
            let tab = $(".manage-company > .company-tabs > li[aria-selected='true']").attr("aria-controls");
            if (tab == "sell-company") {
                observeMutations($("#sell-company")[0], "#sell-company > div", true, (mut, obs) => {
                    let worthSelc = $("#sell-company > div > p:eq(1) > span");

                    if (worthSelc.length == 0) return;

                    let worth = stripCurrencyFormatting(worthSelc.html());
                    let balance = stripCurrencyFormatting($(".company-info > li:eq(0) > .details-wrap:eq(2)").html().split("\n")[2]);

                    worthSelc.html(`<strike>${worthSelc.html()}</strike> ${formatCurrency(worth - balance)}`);
                });
            }
        }, { childList: true, subtree: true, attributes: true, attributeFilter: [ "aria-selected" ] });
    }, { childList: true, subtree: true });

    stockAutofill();
}

/*
Source found at https://openuserjs.org/scripts/PapaAndreas/Stock_Autofill/source
*/
function stockAutofill() {
    $(document).ajaxComplete((event, jqXHR, ajaxObj) => {
        if (!ajaxObj.url.includes("/companies.php")) return;
        if (!jqXHR.responseText.trim().startsWith('<div id="stock_message"')) return;

        $(".order").after("<span class='order btn-wrap silver'><span class='btn disable'><button class='wai-btn button-btn' id='autofill'>Autofill</button></span></span>");
        $("#autofill").click(function() {
            API.sendRequest("company", null, "detailed,stock").then(response => {
                let storageSpace = response.company_detailed.upgrades.storage_space;
                let storageSpaceAvailable = storageSpace;

                let totalSold = 0;
                $.each(response.company_stock, function(index, value) {
                    totalSold += value.sold_amount;

                    let stock = value.on_order + value.in_stock;
                    if (stock > 0) storageSpaceAvailable -= stock;
                });

                let totalStocksNeeded = 0;
                $.each(response.company_stock, function(index, value) {
                    let sellingPercentage = value.sold_amount / totalSold;

                    let stocksNeeded = (sellingPercentage * storageSpace) - (value.on_order + value.in_stock);
                    if (stocksNeeded > 0) totalStocksNeeded += stocksNeeded;
                });

                let freeSpaceFactor = storageSpaceAvailable / totalStocksNeeded;
                $.each(response.company_stock, function(index, value) {
                    let sellingPercentage = value.sold_amount / totalSold;

                    let stocksNeeded = (sellingPercentage * storageSpace) - (value.on_order + value.in_stock);
                    if (stocksNeeded > 0) {
                        stocksNeeded *= freeSpaceFactor;
                        $('div:contains("'+ index +'")').last().parent().find("input").val(Math.floor(stocksNeeded)).change();
                    }
                });
            });
        });
    });
}

function showProfile() {
    loadRecruitmentDetails();
    observeMutations(document, ".user-profile > .profile-wrapper > .basic-information", false, (mut, obs) => {

        let playerId = $("a.profile-image-wrapper").attr("href");
        if (playerId) obs.disconnect();
        else return;

        playerId = playerId.substring(playerId.indexOf("XID=") + 4);

        let oldurl;
        USER.update();
        dkklog.trace("USER", USER);
        if (USER.isJailed || USER.isHospitalized || USER.isTravelling) {
            let elCompanyUrl = $("span[title*='joblist'] > a, span[title*='companies']> a");
            oldurl = elCompanyUrl.attr("href");
            elCompanyUrl.attr("href", `${_settings.api.base}company_viewer.php?company_or_player=player&search_torn_id=${playerId}`);
            elCompanyUrl.attr("target", "_blank");
        }

        let request = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `${_settings.api.base}api.php?api_key=${API.key}&action=profile&torn_id=${playerId}`,
                onreadystatechange: res => {
                    if (res.readyState > 3 && res.status === 200) {
                        dkklog.debug("MP API - Response received.")
                        var json = JSON.parse(res.response);

                        if (!json.error) {
                            resolve(json);
                        } else {
                            reject(`Received '${json.error}'`);
                            dkklog.error("MP API - Error while receiving.", json.error);
                        }
                    }
                },
                onerror: err => {
                    dkklog.error("MP API - Error while sending.", err);
                    reject(`server error: ${err}`);
                }
            });
        });
        request.then(json => {
            $(".user-profile > .profile-wrapper").eq(1).before(
                `<div><article class='comphelp-widget mpsse-toggeable'><header class='comphelp-widget_header'><span class='comphelp-widget_title'>${_settings.name}</span>
<span id='recruitmentMessage'></span><span id='toggleIconClose' class='mpsse_icon'>${_html.toggle.icons.close}</span><span id='toggleIconOpen' class='mpsse_icon mpsse_toggle-hidden'>${_html.toggle.icons.open}</span>
</header><div id='messagebox-enemies' class='comphelp-widget-message' hidden></div><div id='messagebox' class='comphelp-widget-message' hidden></div><div class='comphelp-widget_body'>
<div id='panelBlacklist' class='comphelp-panel-right'><table class='comphelp-data-table'><tr><th class='comphelp-data-table_header'>Blacklist</th></tr><tr><th id='lastmodified' class='comphelp-data-table_cell'></th></tr><tr><th class='comphelp-data-table_cell'>Blacklisted: <input type="checkbox" id="checkboxPlayerDontRecruit"></th></tr>
<tr><th class='comphelp-data-table_cell'>Notes: <br><textarea class="comphelp-textarea" rows="5" cols="${isMobile.phone ? 40 : 105}" maxlength="475" name="notes" id="notes"></textarea><br><button id='saveNotes' class='comphelp-button comphelp-last'>Save Notes</button></th></tr></table></div></div></article></div>`
            );
            let messageboxEnemies = $("#messagebox-enemies");
            let messagebox = $("#messagebox");
            let checkboxPlayerDontRecruit = $("#checkboxPlayerDontRecruit");

            let basiclist = $(".profile-container > .basic-list > li");
            let friends = parseInt(basiclist.eq(8).find("div > span").eq(1).html());
            let enemies = parseInt(basiclist.eq(9).find("div > span").eq(1).html());
            let friendRatio = friends / enemies;

            let playerType = json.player_type;

            if (oldurl && playerType == "agent") {
                $("span[title*='joblist'] > a, span[title*='companies']> a").attr("href", oldurl).attr("target", "");
                $(".mpsse_icon").remove();
                $(".mpsse-toggeable").removeClass("mpsse-toggeable");
            }

            if (playerType == "agent" || (json.message && json.message != null)) {
                let msg;
                if (json.message) msg = json.message;
                else if (playerType == "agent") msg = "This is a MPSSE agent.";

                _showMessage(messageboxEnemies, msg, false);
                $("#panelBlacklist").remove();
            } else if ((enemies > 100 && friendRatio < 1.25) || (enemies > 5 && friendRatio < 0.75)) _showMessage(messageboxEnemies, "Warning: This person has a lot of enemies.", true);

            let isBlacklisted = false;
            let note = "";
            let lastModified = "unknown";
            if (json.blacklist) {
                isBlacklisted = json.blacklist.blacklisted;
                note = json.blacklist.note;

                let lastModifiedOnDate = new Date(json.blacklist.last_modified_datetime + " GMT");

                let lastModifiedOn = json.blacklist.last_modified_datetime;
                lastModified = getLastModified(json.blacklist.last_modified_agent.torn_name, json.blacklist.last_modified_agent.torn_id, lastModifiedOn, timeSince(lastModifiedOnDate));
            } else lastModified = getLastModified();


            checkboxPlayerDontRecruit.prop("checked", isBlacklisted);
            $("#notes").val(textFix(note, false));
            $("#lastmodified").html(lastModified)

            $(document).on("click", "#saveNotes", () => {
                let newNote = textFix($("#notes").val(), true);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${_settings.api.base}api.php?api_key=${API.key}&action=set_blacklist_note&torn_id=${playerId}&note=${newNote}`,
                    onreadystatechange: res => {
                        if (res.readyState > 3 && res.status === 200) {
                            if (!isJsonString(res.response)) {
                                _showMessage(messagebox, "Saved the note.", false);
                                $("#lastmodified").html(getLastModified("you"));
                            } else {
                                var json = JSON.parse(res.response);
                                if (!json.error) _showMessage(messagebox, "Saved the note.", false);
                                else _showMessage(messagebox, "Error while saving: " + json.error, true);
                            }
                        }
                    },
                    onerror: err => {
                        log("MP API - Error while sending.", err);
                        _showMessage(messagebox, "Error while saving.", true);
                    }
                });
            });
            $(document).on("click", "#checkboxPlayerDontRecruit", () => {
                debug("GM_xmlhttpRequest", {
                    id: playerId,
                    blacklist: checkboxPlayerDontRecruit.prop("checked") ? 1 : 0,
                    request: {
                        method: "GET",
                        url: `${_settings.api.base}api.php?api_key=${API.key}&action=set_blacklist_blacklisted&torn_id=${playerId}&blacklisted=${checkboxPlayerDontRecruit.prop("checked") ? 1 : 0}`,
                    }
                });
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${_settings.api.base}api.php?api_key=${API.key}&action=set_blacklist_blacklisted&torn_id=${playerId}&blacklisted=${checkboxPlayerDontRecruit.prop("checked") ? 1 : 0}`,
                    onreadystatechange: res => {
                        if (res.readyState > 3 && res.status === 200) {
                            if (!isJsonString(res.response)) {
                                _showMessage(messagebox, "Saved the blacklist.", false);
                                $("#lastmodified").html("Last Modified <strong>just now</strong> by <strong>you</strong>");
                            } else {
                                var json = JSON.parse(res.response);
                                if (!json.error) _showMessage(messagebox, "Saved the blacklist.", false);
                                else _showMessage(messagebox, "Error while saving: " + json.error, true);
                            }
                        }
                    },
                    onerror: err => {
                        log("MP API - Error while sending.", err);
                        _showMessage(messagebox, "Error while saving.", true);
                    }
                });
            });

            if (!json.message) {
                $(".mpsse-toggeable > .comphelp-widget_header").click(() => toggleWidgetBody());
                if (!isBlacklisted && note == "") toggleWidgetBody();
            } else {
                $(".mpsse_icon").addClass("mpsse_toggle-hidden");
                $(".mpsse-toggeable").removeClass("mpsse-toggeable");
            }
        }, error => {
            dkklog.error(`An error occured: ${error}`);
            $(".user-profile > .profile-wrapper").eq(1).before(
                `<div><article class='comphelp-widget'><header class='comphelp-widget_header--error'><span class='comphelp-widget_title'>${_settings.name}</span></header><div class='comphelp-widget_body'><div class='comphelp-panel-left'><table class='comphelp-data-table'><tr><th class='comphelp-data-table_header'>Error</th></tr><tr><th class='comphelp-data-table_cell'>${error}</th></tr></table></div></div></article></div>`
            );
        });
    }, { childList: true, subtree: true});

    function toggleWidgetBody(force, state) { // state false hides the element
        let body = $(".comphelp-widget_body");
        if (!force) state = body.hasClass("mpsse_toggle-hidden");

        if (state) {
            // show
            $(".comphelp-widget_body").removeClass("mpsse_toggle-hidden");
            $(".comphelp-widget_header").removeClass("border-round");
            $("#toggleIconOpen").addClass("mpsse_toggle-hidden");
            $("#toggleIconClose").removeClass("mpsse_toggle-hidden");
        } else {
            // hide
            $(".comphelp-widget_body").addClass("mpsse_toggle-hidden");
            $(".comphelp-widget_header").addClass("border-round");
            $("#toggleIconOpen").removeClass("mpsse_toggle-hidden");
            $("#toggleIconClose").addClass("mpsse_toggle-hidden");
        }
    }

    function textFix(message, fix) {
        let chars = {
            newline: {
                old: "\n",
                new: "/n"
            },
            apostrophe: {
                old: "'",
                new: "{apos}"
            },
            ampersand: {
                old: "&",
                new: "{amp}"
            },
            quote: {
                old: "\"",
                new: "{quot}"
            }
        }
        if (fix) {
            for (let name in chars) {
                message = message.replaceAll(chars[name].old, chars[name].new);
            }
        } else {
            for (let name in chars) {
                message = message.replaceAll(chars[name].new, chars[name].old);
            }
        }
        return message;
    }

    function getLastModified(name, id, date, dateRelative) {
        if (!name) return "No previous blacklist.";
        else if (name == "you") return "Last modified <strong>just now</strong> by <strong>you</strong>";

        return `Last modified on <strong>${date} (${dateRelative})</strong> by <a id='lastmodified-agent-url' target='_blank' href='https://www.torn.com/profiles.php?XID=${id}'><strong id="lastmodified-agent">${name} [${id}]</strong></a>`
    }
}

function showSearch() {
    loadRecruitmentDetails();
    loadCompanyDetails();
    $(".content-title").eq(0).after(
        `<div><article class='comphelp-widget'><header class='comphelp-widget_header border-round'><span class='comphelp-widget_title'>${_settings.name}</span><input type="checkbox" id="highlightOrange">&nbsp;${_settings.text.filter.orange}&nbsp;<input type="checkbox" id="highlightRed">&nbsp;${_settings.text.filter.red}</header><div id='messagebox' class='comphelp-widget-message' hidden></div></article></div>`
    );
    // comphelp-highlight-red_hover
    $("#highlightRed").prop("checked", getCache("mpsse-highlightRed") || false);
    $("#highlightOrange").prop("checked", getCache("mpsse-highlightOrange") || false);

    $("#highlightRed").click(() => {
        setCache("mpsse-highlightRed", true, -1, false);
        if ($("#highlightRed").prop("checked")) {
            $(".comphelp-highlight-red").addClass("comphelp-highlight-red_hover").removeClass("comphelp-highlight-off");
        } else {
            $(".comphelp-highlight-red").removeClass("comphelp-highlight-red_hover").addClass("comphelp-highlight-off");
        }
    });
    $("#highlightOrange").click(() => {
        setCache("mpsse-highlightOrange", $("#highlightOrange").prop("checked"), -1, false);
        if ($("#highlightOrange").prop("checked")) {
            $(".comphelp-highlight-orange").addClass("comphelp-highlight-orange_hover").removeClass("comphelp-highlight-off");
        } else {
            $(".comphelp-highlight-orange").removeClass("comphelp-highlight-orange_hover").addClass("comphelp-highlight-off");
        }
    });

    observeMutations(document, ".userlist-wrapper > .user-info-list-wrap > li:has(.iconShow[title])", true, show, { childList: true, subtree: true});
    xhrIntercept((page, json, uri) => {
        if (page != "userlist" && !json) return;

        if ($( ".userlist-wrapper > .user-info-list-wrap > li:has(.iconShow[title])").length) show();
        else observeMutations(document, ".userlist-wrapper > .user-info-list-wrap > li:has(.iconShow[title])", true, show, { childList: true, subtree: true});
    });

    function show() {
        $(".userlist-wrapper > .user-info-list-wrap > li:has(.iconShow)").each((index, element) => {
            let row = $(element);

            let iconCompany = row.find(".iconShow[title*='Company']");
            let iconCityjob = row.find(".iconShow[title*='Job']");

            if (!(iconCompany.length || iconCityjob.length)) return;

            let titleCompany, titleCityjob;
            let information = {};

            if (iconCompany.length) {
                titleCompany = iconCompany.attr("title").split("<br>")[1];

                let name = titleCompany.substring(titleCompany.indexOf(" of ") + 4, titleCompany.indexOf(" ("));
                let position = titleCompany.split(" ")[0];
                let type = titleCompany.split("(");
                type = type[type.length - 1];
                type = type.substring(0, type.length - 1);

                information.company = {
                    name: name,
                    position: position,
                    type: type
                };
            } else if (iconCityjob.length) {
                titleCityjob = iconCityjob.attr("title").split("<br>")[1];

                information.cityjob = {
                    title: titleCityjob
                };
            }

            let color = getHighlightStatus(information);

            if (!color || color == "none") return;

            row.addClass(`comphelp-highlight-${color} comphelp-highlight-${color}_hover comphelp-highlight`);
            row.addClass("comphelp-highlight");

            switch (color) {
                case "red":
                    if (!$("#highlightRed").prop("checked")) row.removeClass("comphelp-highlight-red_hover").addClass("comphelp-highlight-off");
                    break;
                case "orange":
                    if (!$("#highlightOrange").prop("checked")) row.addClass("comphelp-highlight-off").removeClass("comphelp-highlight-orange_hover");
                    break;
                case "green":
                    break;
            }
        });
    }
}

function getHighlightStatus(information) {
    let color;

    if (information.company) {
        if (_settings.data.mpsse.names.includes(information.company.name)) color = "green"
        else if (information.company.position == "Director") color = "red";
        else if (_settings.data.caution.orange.includes(information.company.type)) color = "orange";
        else if (_settings.data.caution.red.includes(information.company.type)) color = "red";
    } else if (information.cityjob) {
        switch (information.cityjob.title) {
            case "General in the Army":
            case "Brain surgeon at the Hospital":
                color = "orange";
                break;
        }
    }

    return color;
}

function _showMessage(messagebox, message, isError) {
    messagebox.show();
    messagebox.html(message);
    messagebox.addClass(isError ? "comphelp-red" : "comphelp-green");
    messagebox.removeClass(isError ? "comphelp-green" : "comphelp-red");
}

function stripCurrencyFormatting(formatted) {
    return parseInt(formatted.trim().replaceAll(",", "").replaceAll("$", ""))
    // return parseInt(replaceAll(replaceAll(formatted.trim(), ",", ""), "$", ""))
}

function formatCurrency(x) {
    return "$" + x.format();
}