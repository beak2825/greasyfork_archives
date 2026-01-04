// ==UserScript==
// @name         ProtonDB link for Steam
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a link to the protondb page in the steam store page
// @author       Agamenon
// @match        https://store.steampowered.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418807/ProtonDB%20link%20for%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/418807/ProtonDB%20link%20for%20Steam.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    var subStr = url.split('/');
    var pageID = subStr[4]; // This sub-string contains the id we want
    var mainContainer = document.querySelector(".user_reviews");
    var div = document.createElement("div");
    div.setAttribute("class", "dev_row");
    var subtitle = document.createElement("div");
    var summary = document.createElement("div");
    subtitle.setAttribute("class", "subtitle column");
    summary.setAttribute("class", "summary column");
    var subtitleTxt = document.createTextNode("Links: ");
    subtitle.appendChild(subtitleTxt);
    var link = document.createElement("a");
    var linkTxt = document.createTextNode("ProtonDB");
    link.appendChild(linkTxt);
    link.setAttribute("href", "https://www.protondb.com/app/" + pageID); // Setting the link to the corresponding url
    link.setAttribute("target", "_blank");
    summary.appendChild(link);
    div.appendChild(subtitle);
    div.appendChild(summary);
    mainContainer.appendChild(div);
})();