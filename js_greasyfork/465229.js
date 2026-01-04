// ==UserScript==
// @name         Bing Set Region to Taiwan
// @namespace    https://www.bing.com/
// @version      0.1
// @description  Set Bing's region to Taiwan when visiting Bing
// @author       Your Name
// @match        https://www.bing.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465229/Bing%20Set%20Region%20to%20Taiwan.user.js
// @updateURL https://update.greasyfork.org/scripts/465229/Bing%20Set%20Region%20to%20Taiwan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set Bing's region to Taiwan
    function setRegionToTaiwan() {
        var regionParam = "setmkt=zh-TW";
        var url = window.location.href;

        if (url.indexOf("setmkt=") === -1) {
            if (url.indexOf("?") === -1) {
                url += "?" + regionParam;
            } else {
                url += "&" + regionParam;
            }
            window.location.href = url;
        }
    }

    // Call the function to set region to Taiwan
    setRegionToTaiwan();
})();
