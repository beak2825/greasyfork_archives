// ==UserScript==
// @name         MooMoo.io - start with more resources
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  p
// @author       nebb
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411399/MooMooio%20-%20start%20with%20more%20resources.user.js
// @updateURL https://update.greasyfork.org/scripts/411399/MooMooio%20-%20start%20with%20more%20resources.meta.js
// ==/UserScript==
setInterval(() => window.follmoo && follmoo(), 10);