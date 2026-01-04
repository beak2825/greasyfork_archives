// ==UserScript==
// @name         jupyter运行快捷健(alt+R)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Sirius
// @include        http://localhost:8888/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384561/jupyter%E8%BF%90%E8%A1%8C%E5%BF%AB%E6%8D%B7%E5%81%A5%28alt%2BR%29.user.js
// @updateURL https://update.greasyfork.org/scripts/384561/jupyter%E8%BF%90%E8%A1%8C%E5%BF%AB%E6%8D%B7%E5%81%A5%28alt%2BR%29.meta.js
// ==/UserScript==

var run=document.getElementsByClassName("toolbar-btn-label");
document.onkeydown = function(e) {
    if (82 == e.keyCode && e.altKey)
    {
        run.click();
    }
}