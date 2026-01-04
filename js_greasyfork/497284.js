// ==UserScript==
// @name         Auto Refresh for RawChat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically refreshes the RawChat page every 3 minutes
// @author       YourName
// @match        https://chat.rawchat.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497284/Auto%20Refresh%20for%20RawChat.user.js
// @updateURL https://update.greasyfork.org/scripts/497284/Auto%20Refresh%20for%20RawChat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        window.location.reload(true);
    }, 180000); // 180000 milliseconds = 3 minutes
})();
