// ==UserScript==
// @name         処刑台用
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  nubesuko
// @author       eringo216
// @match        https://www2.x-feeder.info/*
// @icon         data:image/x-icon;base64,AAABAAEAICACAAEAAQAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH0AAAAAAP/////////////////AAf//AAB//AAAP/gH8B/wH/wP8H/+B+D//wPB//+Dwf//w8P//+P//////8fj///H4///x+P//8fj///H4///x+P//8fj///H4///x+P//8fj///H4///x+P//////////////////////////////////////////////////8AB//8AAH/8AAA/+AfwH/Af/A/wf/4H4P//A8H//4PB///Dw///4///////x+P//8fj///H4///x+P//8fj///H4///x+P//8fj///H4///x+P//8fj///H4/////////////////////////////////8=
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458710/%E5%87%A6%E5%88%91%E5%8F%B0%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/458710/%E5%87%A6%E5%88%91%E5%8F%B0%E7%94%A8.meta.js
// ==/UserScript==

'use strict';
var player = document.querySelectorAll('[title = "Niconico video player"]','[class = "yt_viewer"]');

for(var i=0; i<=player.length; i++){
player[i].remove();
}
