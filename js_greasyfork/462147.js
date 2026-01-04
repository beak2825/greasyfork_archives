// ==UserScript==
// @name         Kick x Twitch Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes the background color of the chat so you're not blinded.
// @author       Edge
// @match        https://kicktools.ayybabz.com/kickchat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ayybabz.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462147/Kick%20x%20Twitch%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/462147/Kick%20x%20Twitch%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByTagName('body')[0].style.backgroundColor = '#1C1C1C';
    console.log('Background color changed');
})();