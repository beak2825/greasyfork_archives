// ==UserScript==
// @name         TitanTV Ad Removal
// @version      1.0
// @namespace    https://titantv.com
// @description  Remove ads from TitanTV programming grid
// @author       David K johnson
// @license      MIT License
// @match        https://titantv.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464704/TitanTV%20Ad%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/464704/TitanTV%20Ad%20Removal.meta.js
// ==/UserScript==

(function() {
    var topads = document.getElementsByClassName("gC");
    for (let i = 0; i < topads.length; i++) {
        if (topads.item(i).innerHTML == "sponsored") {
            topads.item(i).style.display = "none";
        }
    }
    var sideads = document.getElementsByClassName("gC gAd");
    for (let i = 0; i < sideads.length; i++) {
        sideads.item(i).style.display = "none";
    }
    document.getElementById("stnvidplyr").style.display = "none";
    document.getElementById("ctl00_atop_bt").style.display = "none";
    document.getElementById("sidebox").style.display = "none";
    document.getElementById("ctl00_pb").style.display = "none";
    var moreads = document.getElementsByClassName("connatixTotal");
    for (let i = 0; i < moreads.length; i++) {
        moreads.item(i).style.display = "none";
    }
    var bottomads = document.getElementsByClassName("fixed-ad-wrapper");
    for (let i = 0; i < bottomads.length; i++) {
        bottomads.item(i).style.display = "none";
    }
    var video = document.getElementsByTagName("video");
    for (let i = 0; i < video.length; i++) {
        video.item(i).style.display = "none";
    }
})();