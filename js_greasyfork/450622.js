// ==UserScript==
// @name         Oto Play
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Otomatik Play
// @author       Joseph
// @icon         https://i.hizliresim.com/3yyq40p.png
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/450622/Oto%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/450622/Oto%20Play.meta.js
// ==/UserScript==

setInterval(function(){
if(document.body.innerText.indexOf("#") !== -1){
var rate = document.getElementsByClassName('btYellowBig ic-playHome')[0];
rate.click();

}
},1600);