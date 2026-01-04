// ==UserScript==
// @name         Purge Steam Group Members
// @namespace    https://greasyfork.org/en/users/2205
// @version      0.1
// @description  Remove all members from a steam group that you admin/moderate
// @license      Apache-2.0
// @author       Rudokhvist
// @match        https://steamcommunity.com/groups/*/membersManage
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/470085/Purge%20Steam%20Group%20Members.user.js
// @updateURL https://update.greasyfork.org/scripts/470085/Purge%20Steam%20Group%20Members.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let workingDialog;
    let steamIDs = [];
    let selfID;
    let groupLink;
    let webLimiter = 300;

    function KickMember(userindex) {

        workingDialog.Dismiss();
        workingDialog = unsafeWindow.ShowBlockingWaitDialog( 'Purge in progress', 'Please wait, ' + (steamIDs.length-userindex) +' members left' );
        if (userindex >= steamIDs.length) {
            workingDialog.Dismiss();
            unsafeWindow.ShowAlertDialog("SUCCESS","Group purged");
            unsafeWindow.location.reload();
            return;
        }
        if (steamIDs[userindex].textContent.trim() === selfID) {
            KickMember(userindex+1);
        }
        let xhr = new XMLHttpRequest();
        xhr.open("POST", groupLink + "/membersManage", true);
        xhr.responseType = "document";
        xhr.onload = function () {
            setTimeout(
                (function (userindex) {
                    return function () {
                        KickMember(userindex);
                    };
                })(userindex+1),
                webLimiter
            );
        };
        xhr.onerror = function () {
            unsafeWindow.ShowAlertDialog("ERROR","Failed to remove member " + steamIDs[userindex].textContent.trim());
            setTimeout(
                (function (userindex) {
                    return function () {
                        KickMember(userindex);
                    };
                })(userindex+1),
                webLimiter
            );
        };
        let body = new FormData();
        body.append("sessionID",unsafeWindow.g_sessionID);
        body.append("action","kick");
        body.append("memberId",steamIDs[userindex].textContent.trim());
        body.append("queryString","");
        xhr.send(body);
    }

    function PurgeGroup () {
        unsafeWindow.ShowConfirmDialog('WARNING', 'Are you sure you want to remove all users from the group?').done(function(){
            let profileRegex = /(http[s]?:\/\/steamcommunity.com\/groups\/[^\/]*)\/membersManage.*/g;
            let result = profileRegex.exec(document.location);
            if (result) {
                groupLink = result[1];
                selfID = unsafeWindow.g_steamID;
                let xhr = new XMLHttpRequest();
                xhr.open("GET", groupLink + "/memberslistxml?xml=1", true);
                xhr.responseType = "document";
                xhr.onload = function () {
                    steamIDs = xhr.responseXML.documentElement.getElementsByTagName("steamID64");

                    console.log(steamIDs.length);
                    console.log(steamIDs);

                    workingDialog = unsafeWindow.ShowBlockingWaitDialog( 'Purge in progress', 'Please wait, ' + steamIDs.length +' members left' );
                    KickMember(0);
                };
                xhr.onerror = function () {
                    unsafeWindow.ShowAlertDialog("ERROR","Unable to load member list");
                };
                xhr.send();
            } else {
                unsafeWindow.ShowAlertDialog("ERROR","Unable to parse group name");
            }
        });
    }

    //main

    let buttonText = `<div id="asf_stm_stop" class="btn_darkred_white_innerfade btn_medium_thin" style="float: right; margin-left: 10px;" title="Purge group">
                        <span>🧹</span>
                      </div>`;
    let templateElement = document.createElement("template");
    templateElement.innerHTML = buttonText.trim();
    let button = templateElement.content.firstChild;
    let splitter = document.querySelector("#searchAreaClear")
    splitter.parentElement.insertBefore(button,splitter);
    button.addEventListener("click", PurgeGroup);
})();