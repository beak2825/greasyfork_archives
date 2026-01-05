// ==UserScript==
// @name         auto click 
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  auto click skip button
// @match        http://www.ebesucher.com/surfbar/*
// @match        http://www.ebesucher.de/surfbar/*
// @author       peter
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23253/auto%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/23253/auto%20click.meta.js
// ==/UserScript==

setTimeout(beginclick,20000);

function beginclick()
{
  setInterval(autoClick,5000);
}
function autoClick(){
    $("#skip").click();
}
function autoClickPausebutton(){
  $("#pausebutton").click();
}