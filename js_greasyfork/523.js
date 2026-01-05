// ==UserScript==
// @name        Niresh12495 Cleaner
// @namespace   http://userscripts.org/
// @description Anti-Anti_adblock + remove some stuff
// @include     http://*niresh12495.*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/523/Niresh12495%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/523/Niresh12495%20Cleaner.meta.js
// ==/UserScript==

var ad = document.getElementById("document_modal");
var ad2 = document.getElementById("some_ad_block_key_popup");
var msg = document.getElementById("stickymsg");
var box = document.getElementsByClassName('ipsBox')[0];
var ad3 = document.getElementsByClassName('ipsAd')[0];
ad.parentElement.removeChild(ad);
ad2.parentElement.removeChild(ad2);
msg.parentElement.removeChild(msg);
box.parentElement.removeChild(box);
ad3.parentElement.removeChild(ad3);