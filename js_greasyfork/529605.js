// ==UserScript==
// @name         To not4pcdn
// @namespace    http://tampermonkey.net/
// @version      2025-03-12
// @description  Change to i.not4pcdn.org
// @author       hangjeff
// @match        https://i.4pcdn.org/*
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529605/To%20not4pcdn.user.js
// @updateURL https://update.greasyfork.org/scripts/529605/To%20not4pcdn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.href =  window.location.href.replace("https://i.4pcdn.org/", "https://i.not4pcdn.org/");
    // Your code here...
})();