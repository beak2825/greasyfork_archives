// ==UserScript==
// @name        Remove chat background image - threema.ch
// @namespace   Violentmonkey Scripts
// @match       https://web.threema.ch/
// @description      Remove chat background image in Threema Web
// @description:de   Entferne das Hintergrundbild im Chat in Threema Web
// @grant       none
// @version     1.1
// @author      mauriceKA
// @license MIT
// @description 25.2.2022, 13:40:51
// @downloadURL https://update.greasyfork.org/scripts/440594/Remove%20chat%20background%20image%20-%20threemach.user.js
// @updateURL https://update.greasyfork.org/scripts/440594/Remove%20chat%20background%20image%20-%20threemach.meta.js
// ==/UserScript==
var bgImgTimer = setInterval(function() {
  //console.log("next try");
  var c = document.getElementById("conversation");
  if (c) {
    c.style.background = 'none';
    //clearInterval(bgImgTimer);
  }
},250);  