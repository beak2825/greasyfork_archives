// ==UserScript==
// @name           Button audio figuccio
// @author         figuccio
// @namespace      https://greasyfork.org/users/237458
// @version        0.3
// @description    suono mp3 al click button
// @match          *://*/*
// @noframes
// @icon           https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/464176/Button%20audio%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/464176/Button%20audio%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
var audio = document.createElement("BUTTON");
audio.innerHTML = "Suono!";
document.body.appendChild(audio);
audio.style.position = "fixed";
audio.setAttribute('style',"position:fixed;top:100px;right:140px;background:red;color:lime;padding:3px 6px;border:1px solid yellow;border-radius:9px;cursor:pointer;");
//nitrito cavallo su faceboonon funziona
var Sound = new Audio("https://www.w3schools.com/jsref/horse.mp3");
audio.onclick = function () {
Sound.play();
};
})();
