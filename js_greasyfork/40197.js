// ==UserScript==
// @name        Script for BountyFollowers
// @namespace   BountyFollowers
// @description нажатие всех кнопок подписки разом
// @description click all buttons with one click
// @include     http*://www.bountyfollowers.com/*
// @version     0.13
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40197/Script%20for%20BountyFollowers.user.js
// @updateURL https://update.greasyfork.org/scripts/40197/Script%20for%20BountyFollowers.meta.js
// ==/UserScript==


(function() {
'use strict';

setTimeout (function () {
var infoText = document.getElementsByClassName('ng-binding')[0];
var button = document.createElement('button');
var otherButtons = document.getElementsByClassName('btn btn-sm btn-primary pull-right ng-binding ng-scope');

  
button.innerHTML = 'Нажать все!';
infoText.after(button);

button.style.cssText = 'background-color: #1ab394; border-color: #1ab394; color: #FFFFFF; font-size: 13px; padding: 10px 10px; font-weight: 600; border-radius: 5px';

function clickAll() {
for (var i=0; i<=9; i++) {
otherButtons[0].click();
}}

button.onclick = clickAll; 
}, 5000);  

})();