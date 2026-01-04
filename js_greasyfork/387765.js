// ==UserScript==
// @name         OGame Board : correctif temps écoulé
// @namespace    http://tampermonkey.net/
// @version      1.5
// @author       Xanatos
// @description  Corrige les erreurs du forum du type "{if $days > 1}{$day}{else}Hier{/if}, {$time}"
// @match        https://board.fr.ogame.gameforge.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/387765/OGame%20Board%20%3A%20correctif%20temps%20%C3%A9coul%C3%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/387765/OGame%20Board%20%3A%20correctif%20temps%20%C3%A9coul%C3%A9.meta.js
// ==/UserScript==


function elapsedTime() {
    let items = document.querySelectorAll('time.datetime'),
        now = new Date(),
        nowTimestamp = Math.floor(now.valueOf() / 1000),
        yesterdayStep = (now.getSeconds() + now.getMinutes() * 60 + now.getHours() * 3600) + 86400;

    for (let i = 0; i < items.length; i++) {
        let item = items[i],
            itemTimestamp = parseInt(item.getAttribute('data-timestamp'), 10),
            diff = nowTimestamp - itemTimestamp,
            text = undefined;

        if (diff < 60) { // 1 minute
            text = `Il y a ${diff} seconde${(diff > 1) ? 's' : ''}`;

        } else if (diff < 3600) { // 1 heure
            let minutes = Math.floor(diff / 60);
            text = `Il y a ${minutes} minute${(minutes > 1) ? 's' : ''}`;

        } else if (diff < 86400) { // 1 jour
            let hours = Math.floor(diff / 3600);
            text = `Il y a ${hours} heure${(hours > 1) ? 's' : ''}`;

        } else if (diff < yesterdayStep) { // hier
            let time = item.getAttribute('data-time');
            text = `Hier, ${time}`;

        } else {
            text = item.getAttribute('title');
        }

        item.innerHTML = text;
    }
}

function haveError() {
    let items = document.querySelectorAll('time.datetime'),
        regex = /{if/,
        state = false;

    for (let i = 0; i < items.length; i++) {
        let item = items[i];

        if (regex.test(item.innerHTML) || item == undefined) {
            state = true;
        }
    }

    return state;
}

window.onload = function() {
    var interval = setInterval(function () {
        if (haveError()) {
            elapsedTime();
        }
    }, 500);
};