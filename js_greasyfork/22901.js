// ==UserScript==
// @name        Diep.io rMod (evergreen)
// @namespace   diepiormod
// @description Auto Respawn + Autofire + Dark Theme + Team Changer + Kill Counter + Class Tree + MORE!
// @version     50
// @author      condoriano
// @icon        http://i.imgur.com/T074JpV.png
// @include     http://diep.io/*
// @include     https://diep.io/*
// @connect     greasyfork.org
// @connect     diep.io
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22901/Diepio%20rMod%20%28evergreen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/22901/Diepio%20rMod%20%28evergreen%29.meta.js
// ==/UserScript==

var js;

var httpReq = new XMLHttpRequest();
httpReq.onreadystatechange = function() {
	if(httpReq.readyState == 4 && httpReq.status == 200) {
        js=httpReq.responseText.trim();
        js = js.replace(/tiny.cc\/diep/g, "Scoreboard");
        js = js.replace("modDiv.appendChild(scoreboardDiv);", "");
        js = js.replace("Made by keyzint.", "");
        js = js.replace(" | ", "");
        js = js.replace("Userscript", "");
        js = js.replace("Extension", "");
        js = js.replace('<img src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" alt="" height="1" border="0" width="1">', "");
        js = js.replace('<input style="height: 11px; vertical-align: bottom; margin-left: 5px;" name="submit" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" alt="PayPal btn" border="0" type="image">', "");
        js = js.replace("count && adData.counter < 4 && !isFirefox", "false");
        var script = document.createElement('script');
        script.innerHTML=js;
        document.head.appendChild(script);
	}
};

httpReq.open('GET', 'https://greasyfork.org/scripts/22243-diepiomod/code/diepiomod.js');
httpReq.send();