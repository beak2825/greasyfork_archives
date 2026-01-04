// ==UserScript==
// @name         Chat Limit bypass to Free GPT-4/GPT-3.5 Providers
// @version      1.1
// @license MIT
// @description  Simple script to clear local storage for the Chat website for unlimited use.
// @author       Pro-Fessional
// @match        *://chat.forefront.ai/*
// @match        *://liaobots.com/*
// @match        *://chat-gpt.org/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1090501
// @downloadURL https://update.greasyfork.org/scripts/467859/Chat%20Limit%20bypass%20to%20Free%20GPT-4GPT-35%20Providers.user.js
// @updateURL https://update.greasyfork.org/scripts/467859/Chat%20Limit%20bypass%20to%20Free%20GPT-4GPT-35%20Providers.meta.js
// ==/UserScript==

(function () {
    'use strict';
    localStorage.clear();
     sessionStorage.clear();
})();
