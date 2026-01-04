// ==UserScript==
// @name         Xero Ticket Notify
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  notifies you as soon as there is a new ticket!
// @author       Swaight
// @match        https://xero.gg/neocortex/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/410919/Xero%20Ticket%20Notify.user.js
// @updateURL https://update.greasyfork.org/scripts/410919/Xero%20Ticket%20Notify.meta.js
// ==/UserScript==

(function() {
    'use strict';
if (localStorage.getItem("notifications-enabled") == null) {
    localStorage.setItem("notifications-enabled", "1");
}

if (Notification.permission != 'granted') {
    localStorage.setItem("notifications-enabled", "0");
}

var updateTimes = [];
var username = document.getElementById('avatar-settings').childNodes[3].innerHTML;
var interval = null;
var intervalDelay = 60000;

if (localStorage.getItem("notifications-enabled") == '1' && interval == null) {
    interval = setInterval(function () { CheckTickets(); }, intervalDelay);
}

addButton();
setInterval(function () { CheckNotificationStatus(); }, 100);

function CheckNotificationStatus() {
    try {
        if (localStorage.getItem("notifications-enabled") == '1') {
            if (interval == null) {
                interval = setInterval(function () { CheckTickets(); }, intervalDelay);
            }

            if ($("#btnNotificationToggle").html() == "Activate Notifications") {
                $("#btnNotificationToggle").html("Disable Notifications");
            }
        }
        else {
            if (interval != null) {
                clearInterval(interval);
                interval = null;
            }

            if ($("#btnNotificationToggle").html() == "Disable Notifications") {
                $("#btnNotificationToggle").html("Activate Notifications");
            }
        }
    }
    catch (e) { }
}

async function addButton() {
    await sleep(1000);
    try {
        $(".twitter-typeahead").css("width", "68%");

        var btn = document.createElement("BUTTON");
        btn.innerHTML = "Disable Notifications";
        btn.className = "btn btn-primary btn-sm";
        btn.id = "btnNotificationToggle";
        document.getElementsByTagName("nav")[0].insertBefore(btn, document.getElementsByTagName("nav")[0].children[2]);
        var button = $("#btnNotificationToggle");
        button.css("position", "absolute");
        button.css("right", "295px");
        setInterval(function () { CheckNotificationStatus(); }, 100);

        btn.onclick = function () {
            if (btn.innerHTML == 'Disable Notifications') {
                btn.innerHTML = 'Activate Notifications';
                clearInterval(interval);
                interval = null;
                localStorage.setItem("notifications-enabled", "0");
            }
            else {
                btn.innerHTML = 'Disable Notifications';
                if (Notification.permission != 'granted') {
                    Notification.requestPermission().then(function (p) {
                        if (p === 'granted') {
                            var notify = new Notification('Success', {
                                body: 'You successfully enabled notifications!',
                                icon: 'https://xero.gg/assets/img/favicon/xero/favicon.ico',
                            });
                        }
                    });
                }
                if (interval == null) {
                    interval = setInterval(function () { CheckTickets(); }, intervalDelay);
                    localStorage.setItem("notifications-enabled", "1");
                }
            }
        };
    }
    catch (e) { }
}


function CheckTickets() {
    $.ajax({
        data: {},
        type: "GET",
        url: "https://xero.gg/neocortex/support/tickets?type=personalOpen",
        success: function (response) {
            var html = '<div>' + response + '</div>';
            html = html.replace('&raquo;', '');
            var doc = new DOMParser().parseFromString(html, "text/html");
            var tbody = doc.getElementsByTagName("tbody")[0];
            if (tbody == null) {
                localStorage.removeItem("updateTimes");
                return;
            }

            for (var i = 0; i < tbody.children.length; i++) {
                try {                  
                    if (tbody.children[i].childNodes[11].childNodes[1].innerText == username) {
                        var subject = tbody.children[i].childNodes[5].childNodes[1].innerHTML;
                        var ticketLink = tbody.children[i].childNodes[5].childNodes[1].href;
                        var fromUser = tbody.children[i].childNodes[7].childNodes[1].innerText;
                        var time = tbody.children[i].childNodes[13].childNodes[0].nodeValue;
                        var storage = JSON.parse(localStorage.getItem("updateTimes"));
                        if (storage != null) {
                            updateTimes = storage;
                        }
                        else {
                            updateTimes = [];
                        }
                        if (updateTimes.includes(time)) {
                            continue;
                        }
                        updateTimes.push(time);
                        localStorage.setItem("updateTimes", JSON.stringify(updateTimes));
                        SendNotification(fromUser, subject, ticketLink);
                        return;
                    }
                }
                catch (e) { }
            }
        }
    });
}

function SendNotification(fromUser, subject, ticketId) {
    if (!window.Notification) {
        console.log('Browser does not support notifications.');
    } else {
        if (Notification.permission === 'granted') {
            var notify = new Notification('There is a new ticket!', {
                body: '"' + subject + '" from ' + fromUser,
                icon: 'https://xero.gg/assets/img/favicon/xero/favicon.ico',
            });
            notify.onclick = function () {
                var win = window.open(ticketId, '_blank');
                win.focus();
            };
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
})();