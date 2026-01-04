// ==UserScript==
// @name         ICT Times Patch For Chrome
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Make you able to use times on chrome
// @author       zhou.feng
// @match        https://srv5.ehrms.jp/*
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/40893/ICT%20Times%20Patch%20For%20Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/40893/ICT%20Times%20Patch%20For%20Chrome.meta.js
// ==/UserScript==
(function (window) {
    window.modalReturnData = null;

    async function waitDataOpenWindow() {
        return new Promise(function (resolve) {
            waitInterval = setInterval(
                function () {
                    if (!window.currentModalDialog || window.currentModalDialog.closed) {
                        window.currentModalDialog = null;
                        clearInterval(waitInterval);
                        resolve();
                    }
                }, 100
            )
        });
    }

    updateData = function (pageID, data) {
        window.modalReturnData = data;
    };

    window.showModalDialog = async function (url, mixedVar, features) {
        if (window.hasOpenedModalDialog) {
            window.currentModalDialog.focus();
            return;
        }
        window.modalReturnData = null;
        window.hasOpenedModalDialog = true;
        if (features) {
            features = features.replace(/(dialog)|(px)/ig, "").replace(/;/g, ',').replace(/\:/g, "=");
        }
        var left = (window.screen.width - parseInt(features.match(/width[\s]*=[\s]*([\d]+)/i)[1])) / 2;
        var top = (window.screen.height - parseInt(features.match(/height[\s]*=[\s]*([\d]+)/i)[1])) / 2;

        window.currentModalDialog = window.open(url, "_blank", features);
        await waitDataOpenWindow();
        window.hasOpenedModalDialog = false;
        return window.modalReturnData;
    };

    var pathList = window.location.pathname.split('/');
    var page = pathList[pathList.length - 1];
    keyGroup = /(DAILY_SUBMISSION|MY_PROJECT_ACTION|PROJECT_SEARCH|ACTIVITY_SEARCH)/g.exec(page);
    if (keyGroup) {
        page = keyGroup[1];
    } else {
        page = "";
    }


    if (typeof (showMyProject) != "undefined") {
        eval("showMyProject = async " + showMyProject.toString()
            .replace("showModalDialog", "await showModalDialog")
            .replace(/function +showMyProject *\(/g, "function \("));
    }
    if (typeof (projectSearch) != "undefined") {
        eval("projectSearch = async " + projectSearch.toString()
            .replace("showModalDialog", "await showModalDialog")
            .replace(/function +projectSearch *\(/g, "function \("));
    }
    if (typeof (activitySearch) != "undefined") {
        eval("activitySearch = async " + activitySearch.toString()
            .replace("showModalDialog", "await showModalDialog")
            .replace(/function +activitySearch *\(/g, "function \("));
    }
    switch (page) {
        case "DAILY_SUBMISSION":
            break;
        case "MY_PROJECT_ACTION":
            $('tr.selectable').unbind("dblclick");
            $('tr.selectable').unbind("click");
            $('tr.selectable').click(
                function () {
                    var c = $(this).children('td').children('input[type=checkbox]');

                    if (c.prop('checked')) {
                        $(this).removeClass('myProSelected');
                        c.prop('checked', false);
                    } else {
                        $(this).addClass('myProSelected');
                        c.prop('checked', true);
                    }
                }
            );

            $('tr.selectable').dblclick(
                function () {

                    if (!$(this).children('td').children('input[type=checkbox]').prop('checked')) {
                        $(this).click();
                    }

                    selectClicked();
                }
            );
        case "PROJECT_SEARCH":
        case "ACTIVITY_SEARCH":
            if (typeof (selectClicked) != "undefined") {
                selectClickedBk = selectClicked;
                selectClicked = function (...args) {
                    selectClickedBk(...args);
                    window.opener.updateData(page, window.returnValue);
                };
            }
            if (typeof (directReturn) != "undefined") {
                directReturnBk = directReturn;
                directReturn = function (...args) {
                    directReturnBk(...args);
                    window.opener.updateData(page, window.returnValue);
                };
            }
            break;
        default:
            return;
    }
})(unsafeWindow);