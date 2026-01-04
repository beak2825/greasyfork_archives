// ==UserScript==
// @name         Remove zone name from tab title for topic list
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.41
// @description  Remove zone name from the tab title in the topic list
// @author       Milan
// @match        https://*.websight.blue/threads/*
// @icon         https://lore.delivery/static/blueshi.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463628/Remove%20zone%20name%20from%20tab%20title%20for%20topic%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/463628/Remove%20zone%20name%20from%20tab%20title%20for%20topic%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.title = document.title.replace(/^.*- /,'');
})();