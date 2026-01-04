// ==UserScript==
// @name         Hvg.hu remove breaking news in header
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  On hvg.hu if you close the breaking news banner in the header it will still appear. This script will hide this banner.
// @author       wirhock
// @license      MIT
// @match        *://hvg.hu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hvg.hu
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440023/Hvghu%20remove%20breaking%20news%20in%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/440023/Hvghu%20remove%20breaking%20news%20in%20header.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let breaking = $('.header-breaking');
    breaking.hide();
})();