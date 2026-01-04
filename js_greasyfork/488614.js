// ==UserScript==
// @name         Trendyol.com Large User Review Images
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a link to full size product images uploaded by users.
// @author       nexus99
// @match        https://www.trendyol.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trendyol.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/488614/Trendyolcom%20Large%20User%20Review%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/488614/Trendyolcom%20Large%20User%20Review%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        const nodeList = document.querySelectorAll(".item.review-image");
        console.log("Found " + nodeList.length + " items");

        for (let i = 0; i < nodeList.length; i++) {
            const link = document.createElement("a");
            link.text = "Large";
            var linkURL = nodeList[i].style.backgroundImage.replace("url(\"", "").replace("\")", "").replace(/mnresize\/[^\/]*\/[^\/]*\//, "");
            link.href = linkURL;
            link.style.position = "relative";
            link.style.color = "white";
            link.style.backgroundColor = "black";
            nodeList[i].style.textAlign = "center";
            nodeList[i].appendChild(link);
        }
    }, false);


})();