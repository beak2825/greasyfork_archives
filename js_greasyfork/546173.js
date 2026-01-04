// ==UserScript==
// @name         Volt Quest Redirect to Knolix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects automatically from volt.quest to knolix.com
// @author       Rubystance
// @license      MIT
// @match        https://volt.quest/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546173/Volt%20Quest%20Redirect%20to%20Knolix.user.js
// @updateURL https://update.greasyfork.org/scripts/546173/Volt%20Quest%20Redirect%20to%20Knolix.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    window.location.href = "https://knolix.com/";
})();
