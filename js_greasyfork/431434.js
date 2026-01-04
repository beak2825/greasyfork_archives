// ==UserScript==
// @name         Twitch Point Collector
// @namespace    https://www.youtube.com/watch?v=ia6MnXKM8oE
// @version      3.0.2
// @description  Auto collect twitch point + Auto reload stream when it crash.
// @author       TheGeogeo
//
// @match        https://www.twitch.tv/
// @match        https://www.twitch.tv/*
//
// @icon         https://i.imgur.com/dM2dEZF.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431434/Twitch%20Point%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/431434/Twitch%20Point%20Collector.meta.js
// ==/UserScript==

window.addEventListener('load', function () {

    let collectCount = 0;
    let countDown = "Waiting chest | ";
    let url = encodeURIComponent(location.href);
    let chatButtonClassName = document.getElementsByClassName("bFxzAY");
    let pointButtonClassName = document.getElementsByClassName("bTXTVH fEpwrH");
    let streamReloadButtonClassName = document.getElementsByClassName("bSHCMy");

    (function () {
        setInterval(function () {
            if (/directory/.test(window.location.href) || /settings/.test(window.location.href) || /drops/.test(window.location.href) || /subscriptions/.test(window.location.href) || /wallet/.test(window.location.href)) return;

            if (streamReloadButtonClassName.length > 0) streamReloadButtonClassName[0].click();

            if (countDown != "Waiting chest | " && countDown > 0) {
                chatButtonClassName[chatButtonClassName.length - 1].innerHTML = countDown + " sec next chest | " + collectCount;
                countDown--;
            } else {
                chatButtonClassName[chatButtonClassName.length - 1].innerHTML = "Waiting chest | " + collectCount;
            }

            if (url != encodeURIComponent(location.href)) {
                chatButtonClassName[chatButtonClassName.length - 1].innerHTML = "Waiting chest | " + collectCount;
            }

            if (pointButtonClassName.length > 0) {
                pointButtonClassName[0].click()
                collectCount++;
                countDown = 900;
            }
        }, 1000);
    })();


}, false);
