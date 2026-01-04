// ==UserScript==
// @name         AutoIndexer
// @namespace    http://tampermonkey.net/
// @version      2024-03-30
// @description  IndexEZ
// @author       VS
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grepolis.com
// @include      https://*.grepolis.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491436/AutoIndexer.user.js
// @updateURL https://update.greasyfork.org/scripts/491436/AutoIndexer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var reportsButtonUI = document.querySelector("#ui_box > div.nui_main_menu");
    reportsButtonUI.addEventListener('click', StartBodyListener);

})();

function ClickIndex() {

    var button = document.querySelector("#gd_index_rep_");

    if (button) {

        button.click();
        console.log('Click succeed!');
    }

}

function StartBodyListener() {

    document.body.addEventListener('click', CheckForReportWindow);

}

function CheckForReportWindow() {
    var menuWindow = document.querySelector('body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-draggable.js-window-main-container');

    if (menuWindow) {

        setTimeout(ClickIndex, 1000);

    }

    else {
        document.body.removeEventListener('click', CheckForReportWindow);
        var reportsButtonUI = document.querySelector("#ui_box > div.nui_main_menu");
        reportsButtonUI.addEventListener('click', StartBodyListener);
    }
}