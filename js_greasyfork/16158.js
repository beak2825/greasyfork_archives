// ==UserScript==
// @name         Asana Expand Projects
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  automatically expand the project list in the asana left sidebar
// @author       Matija Erceg
// @match        https://app.asana.com/*
// @grant        none
// @run-at       document-end
// @require      http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.8.0.js
// @downloadURL https://update.greasyfork.org/scripts/16158/Asana%20Expand%20Projects.user.js
// @updateURL https://update.greasyfork.org/scripts/16158/Asana%20Expand%20Projects.meta.js
// ==/UserScript==

var tid = setInterval(showprojects, 1000);

function showprojects() {
    $("a.navigationDockProjectGroupView-more").trigger('click');
}

setTimeout(function(){ clearInterval(tid);} , 30000);