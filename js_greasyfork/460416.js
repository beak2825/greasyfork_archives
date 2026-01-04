// ==UserScript==
// @name         Disable Show Typing
// @description  disable typing when you write
// @version      0.2
// @namespace    http://tampermonkey.net/
// @author       Toil
// @license      MIT
// @namespace    lztDisableShowTyping
// @match        *://*.lolz.guru/*
// @match        *://*.lolz.live/*
// @match        *://*.zelenka.guru/*
// @match        *://*.lzt.market/*
// @match        *://*.lolz.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @supportURL   https:/zelenka.guru/toil
// @homepageURL  https:/zelenka.guru/toil
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460416/Disable%20Show%20Typing.user.js
// @updateURL https://update.greasyfork.org/scripts/460416/Disable%20Show%20Typing.meta.js
// ==/UserScript==

(function() {
        if (document.querySelector('body').innerText.length && document.querySelector('head > title') && document.querySelector('head > title').innerText.length) {
            console.log('Запускаем Disable Show Typing...');
            XenForo.hasOwnProperty('threadNotify') && XenForo.threadNotify.hasOwnProperty('shareTypingActivity') ? XenForo.threadNotify.shareTypingActivity = 0 : null;
            XenForo.hasOwnProperty('ChatboxRTC') && XenForo.ChatboxRTC.hasOwnProperty('Start') ? XenForo.ChatboxRTC.Start.prototype.sendTypingMessage = () => {return} : null;
            console.log('Расширение Disable Show Typing запущено');
        }
})();