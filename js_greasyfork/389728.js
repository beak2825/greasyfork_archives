// ==UserScript==
// @name         Khan SAT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Study for SAT on your phone
// @author       Seth Miller
// @match        https://www.khanacademy.org/mission/sat/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389728/Khan%20SAT.user.js
// @updateURL https://update.greasyfork.org/scripts/389728/Khan%20SAT.meta.js
// ==/UserScript==

window.onload = function() {
    document.body.innerHTML = '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0">' + document.body.innerHTML;
    var styles = ".perseus-renderer  { width: 90vw !important; }";
    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
};