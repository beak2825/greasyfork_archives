// ==UserScript==
// @name         DistractionType
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  prompt a typing test before visiting distracting sites
// @author       dook
// @match        https://*.reddit.com/*
// @match        https://*.twitter.com/*
// @match        https://*.facebook.com/*

// @match        https://monkeytype.com/

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451744/DistractionType.user.js
// @updateURL https://update.greasyfork.org/scripts/451744/DistractionType.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //Companion script
    if (window.location.href === "https://monkeytype.com/") {
        const minWPM = 60;
        const sessionTime = 10 * 60 * 1000; //todo global session valid for 10 minutes before another test

        function GM_sendMessage(label) {
            GM_setValue(label, Array.from(arguments).slice(1));
        }

        let checkTimer = setInterval(function () {
            console.log('checking wpm...');
            const wpm = document.querySelector('#result > div:nth-child(1) > div.group.wpm > div.bottom').innerText;
            try {
                parseInt(wpm);
            } catch (e) { }

            if (wpm >= minWPM) {
                GM_sendMessage('unlock', Math.random());
                clearInterval(checkTimer); //stop checking
                window.close();
            }

        }, 3000);
    }
    else { //Blocking script (fb, twitter etc.)
        console.log('running distracted monkey');
        let locked = null; //the holy variable

        function popupwindow(url, title, w, h) {
            var left = (screen.width / 2) - (w / 2);
            var top = (screen.height / 2) - (h / 2);
            return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
        }

        //Main code, run on page load
        function run() {
            locked = true;
            document.querySelector('body').style.filter = 'blur(6px)';
            popupwindow('https://monkeytype.com/', 'Type time cunt', 800, 1200);
        }
        window.addEventListener('load', run, false);

        //disable clicks lmao
        function handler(e) {
            if (!locked) return;
            e.stopPropagation();
            e.preventDefault();
        }
        document.addEventListener("click", handler, true);

        //Get message from typing tab that the test has been finished
        GM_addValueChangeListener("unlock", () => {
            locked = false;
            document.querySelector('body').style.filter = 'none';
        });
    }
})();