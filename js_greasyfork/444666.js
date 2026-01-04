// ==UserScript==
// @name         Scratch Message Notifier
// @author       Hans5958
// @namespace    Hans5958
// @description  Notifies every message, checks every 2 seconds (Deprecated)
// @include      http*://scratch.mit.edu/*
// @version      1.3.1.2
// @grant        none
// @icon         https://raw.githubusercontent.com/Hans5958/userscripts/master/Scratch/Message%20Notifier/icon.png
// @run-at       document-idle
// @license      MIT
// @homepageURL  https://github.com/Hans5958/userscripts
// @supportURL   https://github.com/Hans5958/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/444666/Scratch%20Message%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/444666/Scratch%20Message%20Notifier.meta.js
// ==/UserScript==

function MSGLog(log) {
    console.log("[MSG] " + log);
}
MSGLog("Preparing...");
var originalTitle = document.title;
var originalCount = 0;
var count = 0;
var player = document.createElement('audio');
player.src = 'https://raw.githubusercontent.com/Hans5958/message-notifier/master/Message%20Notifier/notificationsound.wav';

function getCount() {
    try {
        return $('.notificationsCount').html();
    } catch (e) {
        return document.getElementsByClassName("message-count")[0].innerHTML;
    }
}

var ico = $('<link id="favicon" rel="icon" type="image/x-icon" href="/favicon.ico" />');
ico.appendTo(document.head);

function createIcon() {
    var canvas = document.createElement('canvas'),
        ctx,
        img = document.createElement('img');
    canvas.height = canvas.width = 32;
    ctx = canvas.getContext('2d');
    img.onload = function () {
        ctx.drawImage(this, 0, 0);
        ctx.font = 'bold 21px "helvetica", sans-serif';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        if (count > 99) {
            ctx.strokeText('99+', 0, 31);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText('99+', 0, 31);
        } else {
            ctx.strokeText(count + '', 0, 31);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(count + '', 0, 31);
        }
        ico.attr({
            'type': 'image/png',
            'href': canvas.toDataURL('image/png')
        });
    };
    img.src = '/favicon.ico';
}

if (getCount() !== undefined) {
    MSGLog("Starting...");
    setInterval(function () {
            count = getCount();
            if (count == 0) {
                document.title = originalTitle;
                ico.attr({
                    'type': 'image/x-icon',
                    'href': '/favicon.ico'
                });
                originalCount = 0;
            } else {
                if (originalCount != count) {
                    document.title = '(' + count + ') New message!';
                    player.play();
                    originalCount = count;
                    createIcon();
                } else {
                    document.title = '(' + count + ') ' + originalTitle;
                }
            }
        },
        2000);
} else {
    MSGLog("User not logged in.");
}