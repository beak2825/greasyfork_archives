// ==UserScript==
// @name         Jouw Mening Question skipper
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @author       Yurki Montero Montero
// @match        https://www.jouwmening.nu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425433/Jouw%20Mening%20Question%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/425433/Jouw%20Mening%20Question%20skipper.meta.js
// ==/UserScript==

function skipQuestion(){
    document.getElementsByClassName("btn btn-primary col-xs-offset-2 col-xs-5 col-xs-offset-6 col-sm-3 pull-right")[0].disabled = false
    document.getElementsByClassName("btn btn-primary col-xs-offset-2 col-xs-5 col-xs-offset-6 col-sm-3 pull-right")[0].click()
}

window.onload = skipQuestion()