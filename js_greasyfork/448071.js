// ==UserScript==
// @name         Quickerbase - Dev
// @version      0.2
// @description  Improves navigation within Quickbase
// @license      MIT
// @author       samjones5
// @match        *.quickbase.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quickbase.com
// @grant        none

// @namespace srjones.quickbase.com/quickerbase
// @downloadURL https://update.greasyfork.org/scripts/448071/Quickerbase%20-%20Dev.user.js
// @updateURL https://update.greasyfork.org/scripts/448071/Quickerbase%20-%20Dev.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Running")
    var curLocation = window.location.href;
    var realm = (curLocation.split(".")[0]) + ".quickbase.com/";
    var curDbid = (curLocation.split("db/")[1]).split("?")[0];
    var appDbid = gReqAppDBID;

    var addButt = document.getElementsByClassName(" ButtonText")
    var bonusLinkColor = getComputedStyle(addButt[0]).color;

    var bonusLinksArray = [];
    var importUrl = [curLocation.split("=")[0] + "=ImportList&dbid=" + curDbid + "&confMsg=", "Imports"];
    bonusLinksArray.push(importUrl)
    var fieldsUrl = [curLocation.split("=")[0] + "=listfields", "Fields"];
    bonusLinksArray.push(fieldsUrl)
    var rShipUrl = [curLocation.split("=")[0] + "=Relationships", "RShips"];
    bonusLinksArray.push(rShipUrl)

    var relDiagramUrl = [realm + "db/"+ appDbid + "?a=reldiagram", "RelDiagram"];
    bonusLinksArray.push(relDiagramUrl)


    var bonusLinks = ""

    function addLink (url, index) {
        if(bonusLinks!="") {
            bonusLinks += " <span style='color: " + bonusLinkColor + "';>|</span> ";
        }
        bonusLinks += "<a style='text-decoration: none; color: " + bonusLinkColor + ";' href='" + url[0] + "'>" + url[1] + "</a>";
    }
    bonusLinksArray.forEach(addLink);

    var customText = document.getElementById("globalAddRecordButton");

    console.log(bonusLinks);

    customText.insertAdjacentHTML("beforebegin","<span style='line-height:24px; margin-right: 5px;'>" + bonusLinks + "</span>");




})();

