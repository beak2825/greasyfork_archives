// ==UserScript==
// @name         1688链接精简
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       hendeliao
// @match        https://detail.1688.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419198/1688%E9%93%BE%E6%8E%A5%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/419198/1688%E9%93%BE%E6%8E%A5%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.history.pushState({},0,window.location.href.split("?")[0]);
    
})();