// ==UserScript==
// @name         WME Close Map Update Requests
// @description  Closes Map Update Requests depending on their comments (number, date) and description existence.
// @namespace    https://greasyfork.org/users/gad_m/wme_close_mur
// @version      1.0.24
// @author       gad_m
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @require      https://greasyfork.org/scripts/28502-jquery-ui-v1-11-4/code/jQuery%20UI%20-%20v1114.js?version=187735
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        GM_xmlhttpRequest
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/412662/WME%20Close%20Map%20Update%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/412662/WME%20Close%20Map%20Update%20Requests.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */
/* global WazeWrap */
/* global I18n */

(function() {

    'use strict';
    let wmeCloseMur_csrfToken;
    let requestToCloseWasSent = [];
    const SCRIPT_ID = "close_mur";
    const NEVER_STR = 'Never';
    const LOCAL_STORAGE_PREFIX = 'wme-close-mur_';
    const LOCAL_STORAGE_HISTORY = LOCAL_STORAGE_PREFIX + 'History';
    const LOCAL_STORAGE_USER_PREF_ACTIVE = LOCAL_STORAGE_PREFIX + 'user_preferences_Active';
    const LOCAL_STORAGE_USER_PREF_CLOSE_IF_DESC = LOCAL_STORAGE_PREFIX + 'user_preferences_CloseIfDesc';
    const LOCAL_STORAGE_USER_PREF_NUM_OF_COMMENTS_TO_CLOSE = LOCAL_STORAGE_PREFIX + 'user_preferences_NumOfCommentsToClose';
    const LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_CLOSE = LOCAL_STORAGE_PREFIX + 'user_preferences_NumOfDaysToClose';
    const LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_CLOSE_OLD = LOCAL_STORAGE_PREFIX + 'user_preferences_NumOfDaysToCloseOld';
    const LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_KEEP_HISTORY = LOCAL_STORAGE_PREFIX + 'user_preferences_NumOfDaysToKeepHistory';
    //const ALL_LOCAL_STORAGE = [LOCAL_STORAGE_USER_PREF_CLOSE_IF_DESC, LOCAL_STORAGE_USER_PREF_ACTIVE, LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_KEEP_HISTORY, LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_CLOSE, LOCAL_STORAGE_HISTORY];
    const TIME_OPTIONS = {hour:'2-digit', minute: '2-digit', second: '2-digit', hour12: false, hourCycle: 'h23', timeZone: "Asia/Jerusalem"};

    if (typeof W !== 'undefined' && W['userscripts'] && W['userscripts']['state'] && W['userscripts']['state']['isReady']) {
        console.debug('wme-close-mur: WME is ready.');
        waitForWazeWrap(1);
    } else {
        console.debug('wme-close-mur: WME is not ready. adding event listener.');
        document.addEventListener("wme-ready", function () {
            console.debug('wme-close-mur: Got "wme-ready" event.');
            waitForWazeWrap(1);
        }, {
            once: true,
        });
    }

    function waitForWazeWrap(numOfRetries) {
        console.debug('wme-close-mur: waitForWazeWrap() retry #' + numOfRetries);
        if (WazeWrap && WazeWrap.Geometry) {
            console.debug('wme-close-mur: waitForWazeWrap() WazeWrap loaded.');
            init();
        } else {
            if (numOfRetries <= 100) {
                console.debug('wme-close-mur: waitForWazeWrap() WazeWrap not loaded. retrying.');
                setTimeout(function () {
                    waitForWazeWrap(++numOfRetries);
                }, 50);
            }
        }
    }

    function init() {
        console.info('wme-close-mur: init()');
        setDefaultValues();
        getCsrfToken(function (csrfToken) {
            wmeCloseMur_csrfToken = csrfToken;
            handleHistory();
            let registerSidebarTabResult = registerSidebarTab();
            W['userscripts'].waitForElementConnected(registerSidebarTabResult['tabLabel']).then(() => {
                registerSidebarTabResult['tabLabel'].innerText = "Close";
            });
            W['userscripts'].waitForElementConnected(registerSidebarTabResult['tabPane']).then(() => {
                handleUI(registerSidebarTabResult['tabPane']);
                processAllMur();
            });
        });
    }

    function isCountryManager() {
        return W['loginManager'].user.isCountryManager();
    }

    function registerSidebarTab() {
        console.debug('wme-close-mur: registerSidebarTab()');
        try {
            W['userscripts'].removeSidebarTab(SCRIPT_ID);
            console.debug('wme-close-mur: registerSidebarTab() removeSidebarTab() succeeded.');
        } catch (e) {
            console.debug('wme-close-mur: registerSidebarTab() failed [OK] if not registered yet. Original error: ' + e);
        }
        return W['userscripts'].registerSidebarTab(SCRIPT_ID);
    }

    function setDefaultValues() {
        // delete history from troubleshooting
        /*ALL_LOCAL_STORAGE.forEach(item => {
            localStorage.removeItem(item);
        });*/
        let active = localStorage.getItem(LOCAL_STORAGE_USER_PREF_ACTIVE);
        if (active === null) {
            localStorage.setItem(LOCAL_STORAGE_USER_PREF_ACTIVE, "false");
        }
        let closeIfDesc = localStorage.getItem(LOCAL_STORAGE_USER_PREF_CLOSE_IF_DESC);
        if (closeIfDesc === null) {
            localStorage.setItem(LOCAL_STORAGE_USER_PREF_CLOSE_IF_DESC, "false");
        }
        let numOfCommentsToClose = localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_COMMENTS_TO_CLOSE);
        if (!numOfCommentsToClose) {
            localStorage.setItem(LOCAL_STORAGE_USER_PREF_NUM_OF_COMMENTS_TO_CLOSE, "1");
        }
        let numOfDaysToClose = localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_CLOSE);
        if (!numOfDaysToClose) {
            localStorage.setItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_CLOSE, "5");
        }
        let numOfDaysToCloseOld = localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_CLOSE_OLD);
        if (!numOfDaysToCloseOld) {
            localStorage.setItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_CLOSE_OLD, NEVER_STR);
        }
        let numOfDaysToKeepHistory = localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_KEEP_HISTORY);
        if (!numOfDaysToKeepHistory) {
            localStorage.setItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_KEEP_HISTORY, "3");
        }
    }

    function handleUI(tabPane) {
        console.info('wme-close-mur: handleUI()');
        let aSection = document.createElement('section');
        aSection.id = 'close-mur';
        aSection.className = 'tab-pane';
        let section = document.createElement('p');
        aSection.appendChild(section);
        let userPrefActiveStr = localStorage.getItem(LOCAL_STORAGE_USER_PREF_ACTIVE) === "true" ? ' checked' : '';
        let closeForCountryManager = isCountryManager()?'------------------------------------------<br/>Close if no comments after:&nbsp;<select id="WME_close_mur_numOfDays_old"><option value="'+NEVER_STR+'">'+NEVER_STR+'</option><option value="30">30</option><option value="60">60</option><option value="180">180</option><option value="365">365</option></select>&nbsp;days.<br/>':'';
        let userPrefDeleteIfDescStr = localStorage.getItem(LOCAL_STORAGE_USER_PREF_CLOSE_IF_DESC) === "true" ? ' checked' : '';
        section.innerHTML = '<b>When active, automatically closes Map Update Requests with comment(s) added by current user only.</b><br/>' +
            '<br/>Active:&nbsp;<input type="checkbox" id="WME_close_mur_active"' + userPrefActiveStr + '/><br/>' +
            '<br/><b>Close If:</b><br/>' +
            '- Has <select id="WME_close_mur_numOfComments"><option value="1">1</option><option value="1.5">1 or 2</option><option value="2">2</option><option value="3">3</option></select>&nbsp;comment(s).<br/>' +
            '- Last comment older than: <select id="WME_close_mur_numOfDays"><option value="3">3</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="12">12</option><option value="14">14</option></select>&nbsp;days.<br/>' +
            '- There is a description:&nbsp;<input type="checkbox" id="WME_close_mur_closeIfDescription"' + userPrefDeleteIfDescStr + '/><br/>' +
            closeForCountryManager +
            '------------------------------------------<br/>Keep history for <select id="WME_close_mur_numOfDaysToKeepHistory"><option value="1">1</option><option value="3">3</option><option value="5">5</option><option value="7">7</option><option value="10">10</option><option value="14">14</option></select>&nbsp;days.<br/>' +
            'History: <br/><div id="WME_close_mur_history"></div>';

        tabPane.append(aSection);
        jQuery("#WME_close_mur_active").on("change", murActiveChange);
        let numOfCommentsItem = jQuery("#WME_close_mur_numOfComments");
        numOfCommentsItem.val(localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_COMMENTS_TO_CLOSE));
        numOfCommentsItem.on("change", numOfCommentsChange);
        let numOfDaysItem = jQuery("#WME_close_mur_numOfDays");
        numOfDaysItem.val(localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_CLOSE));
        numOfDaysItem.on("change", numOfDaysChange);
        let numOfDaysItemOld = jQuery("#WME_close_mur_numOfDays_old");
        numOfDaysItemOld.val(localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_CLOSE_OLD));
        numOfDaysItemOld.on("change", numOfDaysOldChange);
        jQuery("#WME_close_mur_closeIfDescription").on("change", murDescriptionChange);
        let numOfDaysToKeepHistoryItem = jQuery("#WME_close_mur_numOfDaysToKeepHistory");
        numOfDaysToKeepHistoryItem.val(localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_KEEP_HISTORY));
        numOfDaysToKeepHistoryItem.on("change", numOfHistoryChange);
        setHistoryUI();
        console.info('wme-close-mur: handleUI() done');
    }

    function murActiveChange() {
        console.info('wme-close-mur: murActiveChange() new value: ' + this.checked);
        localStorage.setItem(LOCAL_STORAGE_USER_PREF_ACTIVE, this.checked);
        processAllMur();
    }

    function numOfDaysChange() {
        console.info('wme-close-mur: numOfDaysChange() new value: ' + this.value);
        localStorage.setItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_CLOSE, this.value);
        processAllMur();
    }

    function numOfDaysOldChange() {
        console.info('wme-close-mur: numOfDaysOldChange() new value: ' + this.value);
        localStorage.setItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_CLOSE_OLD, this.value);
        processAllMur();
    }

    function numOfCommentsChange() {
        console.info('wme-close-mur: numOfCommentsChange() new value: ' + this.value);
        localStorage.setItem(LOCAL_STORAGE_USER_PREF_NUM_OF_COMMENTS_TO_CLOSE, this.value);
        processAllMur();
    }

    function murDescriptionChange() {
        console.info('wme-close-mur: murDescriptionChange() new value: ' + this.checked);
        localStorage.setItem(LOCAL_STORAGE_USER_PREF_CLOSE_IF_DESC, this.checked);
        processAllMur();
    }

    function numOfHistoryChange() {
        console.info('wme-close-mur: numOfHistoryChange() new value: ' + this.value);
        localStorage.setItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_KEEP_HISTORY, this.value);
        handleHistory();
        setHistoryUI();
    }

    function setHistoryUI() {
        let result = '';
        let history = getHistory();
        let historyItems = Object.values(history);
        let historyItemsSorted = historyItems.sort(function(a,b){
            return new Date(b.closedDate) - new Date(a.closedDate);
        });
        historyItemsSorted.forEach(mur => {
            let murID = mur.id;
            let date = new Date(mur.closedDate);
            result += '<a href="' + composePermalink(murID, mur.x, mur.y) + '" target="_blank">' + murID + '</a>&nbsp;Closed At:&nbsp;' + date.toLocaleDateString('he-IL') + '&nbsp;' + date.toLocaleTimeString('he-IL', TIME_OPTIONS) + '<br/>';
        });
        jQuery("#WME_close_mur_history").html(result);
    }

    function handleHistory() {
        if (!(localStorage.getItem(LOCAL_STORAGE_USER_PREF_ACTIVE) === 'true')) {
            console.info('wme-close-mur: handleHistory() active=false. will do nothing');
            return;
        }
        console.info('wme-close-mur: handleHistory() delete from history items older than ' + localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_KEEP_HISTORY) + ' days.');
        let now = (new Date()).getTime();
        let daysToKeepHistory = parseInt(localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_KEEP_HISTORY) || 5);
        let history = getHistory();
        Object.keys(history).forEach(murID => {
            let mur = history[murID];
            let closedDate = mur.closedDate;
            let shouldDelete = (now - closedDate) > 1000 * 60 * 60 * 24 * daysToKeepHistory;
            if (shouldDelete) {
                console.info('wme-close-mur: handleHistory() deleting: ' + murID);
                delete history[murID];
            }
        });
        setHistory(history);
    }

    function getHistory() {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_HISTORY) || "{}");
    }
    function setHistory(obj) {
        console.info('wme-close-mur: setHistory()');
        localStorage.setItem(LOCAL_STORAGE_HISTORY, JSON.stringify(obj?obj:{}));
    }

    function getCsrfToken(cb) {
        console.debug('wme-close-mur: getCsrfToken()');
        let url = "https://" + document.location.host + W['Config'].paths['configurationInfo'];
        console.debug('wme-close-mur: getCsrfToken() url: ' + url);
        GM_xmlhttpRequest({
            url: url,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/javascript, */*; q=0.01"            },
            onload: function(response) {
                console.debug('wme-close-mur: getCsrfToken() response.status: ' + response.status);
                if (response.status === 200) {
                    let cookies = response['responseHeaders'].match(/_csrf_token=(.*); Path/i);
                    if (cookies && cookies.length >= 2) {
                        let csrfToken = cookies[1];
                        console.debug('wme-close-mur: getCsrfToken() returning: ' + csrfToken);
                        cb(csrfToken);
                    } else {
                        console.error('wme-close-mur: getCsrfToken() responseHeaders: ' + response['responseHeaders']);
                    }
                } else {
                    console.error('wme-close-mur: getCsrfToken() response status: ' + response.status);
                }
            }
        });
    }


    function processAllMur() {
        if (!(localStorage.getItem(LOCAL_STORAGE_USER_PREF_ACTIVE) === 'true')) {
            console.info('wme-close-mur: processAllMur() active=false. will do nothing');
            return;
        }
        document.removeEventListener("wme-map-data-loaded", processAllMur);
        let numOfDaysToClose = parseInt(localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_CLOSE));
        let closeOld = localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_CLOSE_OLD);
        let numOfDaysToCloseOld = isCountryManager()?(closeOld === NEVER_STR?0:parseInt(closeOld)):-1;
        console.info('wme-close-mur: processAllMur() will close if has ' + localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_COMMENTS_TO_CLOSE) + ' comments and older than ' + localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_CLOSE) + '. Close even if there is a description: ' + localStorage.getItem(LOCAL_STORAGE_USER_PREF_CLOSE_IF_DESC) + (numOfDaysToCloseOld>0?'. Will close older than ' + numOfDaysToCloseOld + ' even if there are no comments':''));
        if (W.model.mapUpdateRequests && W.model.mapUpdateRequests.objects) {
            let murs = W.model.mapUpdateRequests.objects;
            let murIDs = Object.keys(murs);
            console.info('wme-close-mur: processAllMur() processing: ' + murIDs.length + " map update requests.");
            let furtherCheck = [];
            let oldToClose = [];
            let now = (new Date()).getTime();
            Object.keys(murs).forEach(id => {
                //console.info('wme-close-mur: processAllMur() id: ' + id);
                let mur = murs[id];
                let editable = mur.editable;
                let hasComments = mur.attributes['hasComments'];
                let permissions = mur.attributes.permissions !== 0;
                let description = mur.attributes.description || '';
                let hasAutoDescription = (mur.attributes.description === 'Reported from AAOS' || mur.attributes.description === 'Reported map issue');
                let closeForDescription = hasAutoDescription || description.length === 0 || localStorage.getItem(LOCAL_STORAGE_USER_PREF_CLOSE_IF_DESC) === 'true';
                let createdMoreThanXDaysAgo = (now - mur.attributes['updatedOn']) > 1000 * 60 * 60 * 24 * numOfDaysToClose;
                let driveDateMoreThanXDaysAgo = (now - mur.attributes['driveDate']) > 1000 * 60 * 60 * 24 * numOfDaysToCloseOld;
                if (editable && hasComments && closeForDescription && createdMoreThanXDaysAgo && permissions) {
                    furtherCheck.push(id);
                } else if (editable && !hasComments && driveDateMoreThanXDaysAgo && numOfDaysToCloseOld > 0 && permissions) {
                    oldToClose.push(id);
                } else {
                    console.debug('wme-close-mur: processAllMur() does not meet condition to close. \'editable\' should be true, value is: ' + editable + ', AND should \'hasComments\'. value is: ' + hasComments + ', AND should be older than ' + numOfDaysToClose + ' days, this condition value is: ' + createdMoreThanXDaysAgo + '. AND (should have no description, description is: \'' + mur.attributes.description + '\', OR user preferred to delete also if there is description, value is: ' + localStorage.getItem(LOCAL_STORAGE_USER_PREF_CLOSE_IF_DESC) + ') AND permissions should not be equals to 0, value is: ' + mur.attributes.permissions + ' ' + composePermalink(id, mur.attributes['geometry'].x, mur.attributes['geometry'].y));
                }
            });
            console.info('wme-close-mur: processAllMur() will check ' + furtherCheck.length + ' murs');
            console.info('wme-close-mur: processAllMur() will close ' + oldToClose.length + ' old murs');
            if (furtherCheck.length > 0) {
                console.debug('wme-close-mur: processAllMur() will check:\n' + furtherCheck);
            }
            if (oldToClose.length > 0) {
                console.debug('wme-close-mur: processAllMur() will close old:\n' + oldToClose);
            }
            getMurDetails(furtherCheck, oldToClose);
        } else {
            afterDoneClosing();
        }
    }

    function allCommentsByCurrentUser(comments, numOfCommentsToClose) {
        let result = true;
        if (isInt(numOfCommentsToClose)) {
            result &= (comments.length === numOfCommentsToClose);
        } else {
            result &= ((comments.length === Math.floor(numOfCommentsToClose)) || (comments.length === Math.ceil(numOfCommentsToClose)));
        }
        for (let i=0; i<comments.length; i++) {
            result &= (comments[i]['userID'] === (W['loginManager'].user.id || W['loginManager'].user['attributes'].id));
        }
        return result;
    }

    function isInt(n) {
        return n % 1 === 0;
    }

    function getMurDetails(murIDs, oldToClose) {
        console.debug('wme-close-mur: getMurDetails()');
        if (murIDs && murIDs.length > 0) {
            let url = "https://" + document.location.host + W['Config'].paths['updateRequestSessions'] + "?ids=" + murIDs.join(',');
            console.info('wme-close-mur: getMurDetails() url: ' + url);
            jQuery.ajax({method: "GET", url:url, success: function (data) {
                    let murs = data['updateRequestSessions'].objects;
                    console.info('wme-close-mur: getMurDetails() got details for ' + murs.length + ' murs.');
                    let numOfCommentsToClose = parseFloat(localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_COMMENTS_TO_CLOSE));
                    let mursToClose = [];
                    let now = (new Date()).getTime();
                    for (let i=0; i<murs.length; i++) {
                        let mur = murs[i];
                        if (mur.open && mur.comments && allCommentsByCurrentUser(mur.comments, numOfCommentsToClose)) {
                            let commentCreatedOn = mur.comments[0].createdOn;
                            let numOfDays = parseInt(localStorage.getItem(LOCAL_STORAGE_USER_PREF_NUM_OF_DAYS_TO_CLOSE));
                            let olderThanDays = (now - commentCreatedOn) > 1000 * 60 * 60 * 24 * numOfDays;
                            if (olderThanDays) {
                                console.debug('wme-close-mur: getMurDetails() found candidate to close: ' + mur.id);
                                mursToClose.push(mur.id);
                            } else {
                                console.info('wme-close-mur: getMurDetails() will not close \'' + mur.id + '\' as mur last comment is not older than:' + numOfDays + ' days: ' + olderThanDays);
                            }
                        } else {
                            console.debug('wme-close-mur: getMurDetails() will not close \'' + mur.id + '\' as mur open status is: \'' + mur.open + '\' (should be true) or has more than ' + numOfCommentsToClose + ' comment: ' + mur.comments.length + ' or one of the comments is not of current user');
                        }
                    }
                    closeMurs(mursToClose.concat(oldToClose));
                }, error: function () {
                    console.info('wme-close-mur: getMurDetails() error');
                }
            });
        } else {
            console.debug('wme-close-mur: getMurDetails() no further check needed, closing old murs: ' + oldToClose);
            closeMurs(oldToClose);
        }
    }

    function closeMurs(murIDs) {
        console.info('wme-close-mur: closeMurs() ' + murIDs.length);
        if (murIDs && murIDs.length > 0) {
            murIDs.forEach(murID => {
                let mur = W.model.mapUpdateRequests.objects[murID];
                if (mur) {
                    console.info('wme-close-mur: closeMurs() will close: ' + composePermalink(mur.attributes.id, mur.attributes['geometry'].x, mur.attributes['geometry'].y));
                } else {
                    console.warn('wme-close-mur: closeMurs() will close: ' + murID + " didn't find its object");
                }
            });
            let payload = composePayload(murIDs);
            if (payload.actions._subActions.length > 0) {
                sendCloseRequest(payload, function (successfullyClosedMurIDs) {
                    hideMurs(successfullyClosedMurIDs);
                    afterDoneClosing();
                });
            }
        } else {
            afterDoneClosing();
        }
    }

    function afterDoneClosing() {
        console.info('wme-close-mur: afterDoneClosing()');
        document.addEventListener("wme-map-data-loaded", processAllMur);
    }

    function composePayload(murIDs) {
        let closeMurPayload = {
            "actions": {
                "name": "DESCARTES_SERIALIZATION",
                "_subActions": [
                ]
            }
        };
        murIDs.forEach(id => {
            if (!requestToCloseWasSent.includes(id)) {
                requestToCloseWasSent.push(id);
                let subAction = {
                    "name": "UPDATE_MAP_PROBLEM",
                    "_objectType": "mapUpdateRequest",
                    "action": "UPDATE",
                    "attributes": {
                        "id": id,
                        "open": false,
                        "resolution": 1
                    }
                };
                closeMurPayload.actions._subActions.push(subAction);
            }
        });
        console.debug('wme-close-mur: postCloseRequest() payload: ' + JSON.stringify(closeMurPayload));
        return closeMurPayload;
    }

    function sendCloseRequest(payload, cb) {
        console.info('wme-close-mur: sendCloseRequest()');
        let url = "https://" + document.location.host + W['Config'].paths.features;
        jQuery.ajax({
            method: "POST",
            url:url,
            headers: {
                "X-CSRF-Token":wmeCloseMur_csrfToken,
                "Content-Type":"application/json",
                "Accept":"application/json, text/javascript, */*; q=0.01"
            },
            dataType: 'json',
            data: JSON.stringify(payload),
            contentType: "application/json; charset=UTF-8",
            success: function (data) {
                let murs = data.mapUpdateRequests;
                let successfullyClosed = [];
                Object.keys(murs).forEach(murID => {
                    if (murs[murID].open === false) {
                        successfullyClosed.push(murID);
                    }
                });
                console.info('wme-close-mur: sendCloseRequest() success. Successfully closed:\n' + successfullyClosed);
                cb(successfullyClosed);
            }, error: function (data) {
                console.error('wme-close-mur: sendCloseRequest() error. Response:\n' + data.responseText);
            }
        });
    }

    function hideMurs(murIDs) {
        if (murIDs) {
            let now = new Date().getTime();
            let historyItems = {};
            murIDs.forEach(murID => {
                // hide:
                try {
                    console.debug('wme-close-mur: hideMurs() hiding in UI: ' + murID);
                    let murDiv = jQuery( "div[data-id='" + murID +"']" );
                    if (murDiv.length === 1) {
                        murDiv.hide();
                        console.info('wme-close-mur: hideMur() mur ' + murID + ' was hidden successfully.');
                    } else {
                        console.error('wme-close-mur: hideMurs() div not found for mur: ' + murID + '. # of div(s): ' + murDiv.length);
                    }
                } catch (e) {
                    console.error('wme-close-mur: hideMurs() failed to hide: ' + murID + ". Error:\n" + e);
                }
                console.debug('wme-close-mur: hideMurs() adding to history: ' + murID);
                // add to history UI:
                let mur = W.model.mapUpdateRequests.objects[murID];
                if (mur) {
                    historyItems[murID] = {x:mur.attributes['geometry'].x, y:mur.attributes['geometry'].y,closedDate:now,id:murID};
                } else {
                    console.error('wme-close-mur: hideMurs() failed adding to history: ' + murID + ' as not found in Waze model');
                }
                console.debug('wme-close-mur: hideMurs() removing form objects: ' + murID );
                W.model.mapUpdateRequests.remove(W.model.mapUpdateRequests.objects[murID]);
            });
            updateHistoryWithClosedMurs(historyItems);
        }
    }

    function updateHistoryWithClosedMurs(historyItems) {
        let history = getHistory();
        Object.assign(history, historyItems);
        setHistory(history);
        setHistoryUI();
    }

    function composePermalink(murID, geometryX, geometryY) {
        let result = 'https://' + document.location.host + '/';
        if (I18n.locale !== 'en') {
            result += I18n.locale + '/';
        }
        let convertTo4326 = WazeWrap.Geometry.ConvertTo4326(geometryX, geometryY);
        result += 'editor/?env=il&lon=' + convertTo4326.lon.toFixed(6) + '&lat=' + convertTo4326.lat.toFixed(6) + '&zoomLevel=18&mapUpdateRequest=' + murID;
        return result;
    }

}.call(this));
