// ==UserScript==
// @name         Steam Redirect INR
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect steam currency to inr
// @author       kenshin.rorona
// @match        https://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470440/Steam%20Redirect%20INR.user.js
// @updateURL https://update.greasyfork.org/scripts/470440/Steam%20Redirect%20INR.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const region = "cc=in";
    var processedUrl = "";
    setInterval(function(){
        var url = window.location.toString();
        if (processedUrl == url) {return;}
        if (url.includes(region)) {return;}
        processedUrl = window.location.toString();
        if (url.includes("?")) {
            url += `&${region}`;
        } else {
            url += `?${region}`;
        }
        console.log("URL:", window.location, url);
        window.location.replace(url);
    }, 1500);
})();