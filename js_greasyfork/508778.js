// ==UserScript==
// @name         Firefox/ChatGPT: Fix Disabled Chat Box
// @namespace    https://greasyfork.org/en/users/1337417-mevanlc
// @version      0.3
// @description  Re-enabled the ChatGPT chatbox under Firefox
// @author       https://greasyfork.org/en/users/1337417-mevanlc
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508778/FirefoxChatGPT%3A%20Fix%20Disabled%20Chat%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/508778/FirefoxChatGPT%3A%20Fix%20Disabled%20Chat%20Box.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function userscriptMain() {
        let parent = getChatBoxParent();
        if (!parent) {
            ulog(`chatbox parent not found, setting poll timer`);
            setTimeout(userscriptMain, 150);
        } else {
            onGetChatBoxParent(parent);
        }
    }

    function getChatBoxParent() {
        const child = document.querySelector("#prompt-textarea");
        return child ? child.parentElement : null;
    }

    function onGetChatBoxParent(parent) {
        parent.classList.remove('default-browser');
        parent.classList.add('firefox');
        ulog('Chatbox enabled by changing classes.');
    }


    if (document.readyState !== 'loading') {
        ulog('document is already ready, calling userscript()');
        userscriptMain();
    } else {
        ulog('will run userscript() on DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', userscriptMain);
    }

    function ulog(...args) {
        typeof args[0] === 'string' ?
          console.log(`${GM.info.script.name}: ${args[0]}`, ...args.slice(1))
          : console.log(GM.info.script.name, ...args);
    }

})();
