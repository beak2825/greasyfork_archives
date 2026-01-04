// ==UserScript==
// @name         SharepointOpenFile
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://jacobsengineering.sharepoint.com/sites/CPAMBP06ATMN/JTransmittals/Forms/*
// @match        https://jacobsengineering.sharepoint.com/sites/CPAMBP06ATMN/CTransmittals/Forms/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377871/SharepointOpenFile.user.js
// @updateURL https://update.greasyfork.org/scripts/377871/SharepointOpenFile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var LocalFolder="D:\\OneDrive\\Jacobs\\Atimonan 2 x 600MW Ultra Super Critical Power Plant - CTransmittals\\";
    var CTransElement=document.querySelector("div#idDocSetPropertiesWebPart a[href^='https://jacobsengineering.sharepoint.com/sites/CPAMBP06ATMN/CTransmittals/']");
    var ParentElement=CTransElement.parentElement;
    var TargetAddress="sharepointopenfile://" + LocalFolder + CTransElement.innerText;
    ParentElement.innerHTML=ParentElement.innerHTML + "&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"" + TargetAddress + "\">Open Local Folder</a>";
})();