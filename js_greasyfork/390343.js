// ==UserScript==
// @name         kizi popup
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  totally awesome, open kizi with the click of a button. On the webpage your on.
// @author       twarped
// @match        http*://*/*
// @exclude      *kizi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390343/kizi%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/390343/kizi%20popup.meta.js
// ==/UserScript==

var body=`<a id="close" href="javascript:var kizi = document.getElementById('iframe');kizi.remove();" style="position:fixed; z-index: 2000; top:0">x</a>
<button id="open" style="position: fixed; z-index: 1998; top:0;" onclick='javascript:var iframe = document. createElement("iframe"); iframe. src = "https://kizi.com"; iframe. id="iframe"; iframe.style = "width:100%;height:100%;position: fixed;z-index: 1999;margin-left: auto;margin-right: auto; top:0;"; var div = document. getElementById("div"); div. appendChild(iframe);'>create</button>`;
var buttons = document.createElement('div');
buttons.innerHTML= body;
buttons.id = "div";
document.body.appendChild(buttons);