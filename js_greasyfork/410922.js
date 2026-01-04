// ==UserScript==
// @name         Xero Live View Auto Refresh
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  Button for Auto Refresh
// @author       Swaight
// @match        https://xero.gg/neocortex/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/410922/Xero%20Live%20View%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/410922/Xero%20Live%20View%20Auto%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

var isActive = false;
var interval = null;

async function addButton() {
    await sleep(500);
    try {
        var btn = document.createElement("BUTTON");
        btn.innerHTML = "Auto Refresh";
        btn.className = "btn btn-success btn-sm";
        btn.id = "btnAutoRefresh";

        btn.onclick = function () {
            ToggleRefresh();
        }

        document.getElementsByTagName("nav")[0].insertBefore(btn, document.getElementsByTagName("nav")[0].children[2]);
        var button = $('#btnAutoRefresh');
        button.css("position", "absolute");
        button.css("right", "445px");
        button.addClass('invisible');
    }
    catch (e) {

    }
}

function SetButtonVisibility() {
    try {

        var url = window.location.href.toLowerCase();
        var button = $('#btnAutoRefresh');
        if (url.includes('/live')) {
            button.removeClass('invisible');
        }
        else {
            button.addClass('invisible');
            if (isActive) {
                ToggleRefresh();
            }
        }
    }
    catch (e) { }
}

function ToggleRefresh() {
    try {

        if (isActive) {
            clearInterval(interval);
            interval = null;
        }
        else if (interval == null && !isActive) {
            interval = setInterval(Refresh, 2000);
        }

        isActive = !isActive;
        var button = $('#btnAutoRefresh');
        button.removeClass(isActive ? 'btn-success' : 'btn-danger');
        button.addClass(isActive ? 'btn-danger' : 'btn-success');
    }
    catch (e) {

    }
}

function Refresh() {
    try {
        if ($(".dropdown-toggle").is(":focus")) {
            return;
        }
        else if ($("#gameRoomStateChangeTrigger").is(":focus")) {
            return;
        }
        else if ($("#gameRoomBroadcastType").is(":focus")) {
            return;
        }
        else if ($("#gameRoomBroadcastMessage").is(":focus") || $("#gameRoomBroadcastMessage").val().length > 0) {
            return;
        }
        else if($("#gameKickModal2").hasClass("show")) {
            return;
        }

        $('.refresh')[0].click();
        $('#nprogress').css("display", "none");
    }
    catch (e) {
        ToggleRefresh();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

setInterval(SetButtonVisibility, 100);
addButton();
})();