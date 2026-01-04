// ==UserScript==
// @name         Awesome Research: Remove Drone System Message
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Removes elements with class 'system-message_wrapper__LBz-2'
// @author       You
// @match        https://drone.awesome-research.finance/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484218/Awesome%20Research%3A%20Remove%20Drone%20System%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/484218/Awesome%20Research%3A%20Remove%20Drone%20System%20Message.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const elements = document.querySelectorAll('.system-message_wrapper__LBz-2');
        elements.forEach(el => el.remove());
    });
})();