// ==UserScript==
// @name         Serveme.tf Auto-reset idle timer
// @namespace    http://sk1llb0x.cf/
// @version      0.2
// @description  lazyness
// @author       Sk1LLb0X
// @match        *://na.serveme.tf/reservations/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13531/Servemetf%20Auto-reset%20idle%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/13531/Servemetf%20Auto-reset%20idle%20timer.meta.js
// ==/UserScript==

function doit() {
    if (/(\d+){2}\/30m/.test($("a.btn.btn-xs.btn-primary[title='Idle reset'").text())) {
        $("a.btn.btn-xs.btn-primary[title='Idle reset'").click()
    }
}

setInterval(function() {
    location.reload();
    setTimeout(function() {
        doit();
    }, 5000);
}, 60000);