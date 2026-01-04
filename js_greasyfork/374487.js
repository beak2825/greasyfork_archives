// ==UserScript==
// @name         Restart button ingame
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Respawn button in game
// @author       Zimek
// @match        *://*.alis.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374487/Restart%20button%20ingame.user.js
// @updateURL https://update.greasyfork.org/scripts/374487/Restart%20button%20ingame.meta.js
// ==/UserScript==

console.log("%cRestart button ingame Extension by Zimek", "background: #222; color: red; padding: 5px;font-size: 15px;");


$(`
<div style="float: right;padding: 5px;margin-right: 60px;margin-top: 345px;"><button onclick="return respawn(),!1" id="respawn1" style="position:absolute;background-color: transparent;border: 0px solid transparent;"><div id="zimekrestartwrite" class="zimekrestartwrite" style="position:absolute;margin-top: 15px;margin-left: -60px;"><font color="red">RESTART</font></div><img class="zimekrestart zimekrestartimg" id="zimekrestartimg" src="https://i.imgur.com/v0LOrN2.png" width="50px" height="50px"></button>
`).insertAfter("#div_lb");

$(`<style>
.zimekrestart{background-color: rgba(0,0,0,0.7);border-radius: 100px;padding: 5px;margin-top: -5px;margin-left: 3px;}
.zimekrestart:hover{border: 5px solid red;transition-duration: 0.2s;}
#zimekrestartwrite{display: none;}
</style>`).appendTo('head');
