// ==UserScript==
// @name         Dynmap automatic site reload
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  reload the dynmap site automatically, for no inactive page ever.
// @author       High
// @match        https://map.docm77.de/*
// @icon         https://map.docm77.de/images/AlphaDoc.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418395/Dynmap%20automatic%20site%20reload.user.js
// @updateURL https://update.greasyfork.org/scripts/418395/Dynmap%20automatic%20site%20reload.meta.js
// ==/UserScript==

setInterval(function(){
   window.location.reload(1);
}, 1740000);