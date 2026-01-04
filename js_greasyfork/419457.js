// ==UserScript==
// @name         Wowhead English
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes Wowhead German Subdomain .de to English
// @author       isitLoVe
// @match        https://de.classic.wowhead.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419457/Wowhead%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/419457/Wowhead%20English.meta.js
// ==/UserScript==

location.hostname = "classic.wowhead.com";