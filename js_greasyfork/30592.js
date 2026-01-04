// ==UserScript==
// @name VOZ-Sun tool chat starve.io
// @namespace PhamChiHuong
// @version 0.0.6
// @description Pham Chi Huong 
// @author Phạm Chi Huong
// @icon http://i.imgur.com/Uo3KVEL.png
// @match http://starve.io/*
// @run-at document-start
// @grant GM_xmlhttpRequest
// @connect http://starve.io/
// @downloadURL https://update.greasyfork.org/scripts/30592/VOZ-Sun%20tool%20chat%20starveio.user.js
// @updateURL https://update.greasyfork.org/scripts/30592/VOZ-Sun%20tool%20chat%20starveio.meta.js
// ==/UserScript==
// © 11-06-2017 sunstar.uphero.com

setTimeout(function() {
var _frame = '<iframe style="position: fixed;z-index: 99999; width: 240px; height: 520px;bottom: 0px; right: 0;opacity: 1;" src="https://iuh.000webhostapp.com/test.html" marginheight="0" marginwidth="0" frameborder="0" width="100%" height="100%" scrolling="auto" allowtransparency="yes" name="cboxmain" id="body"></iframe>';

document.getElementsByTagName("body")[0].insertAdjacentHTML('beforeend',_frame);
document.getElementById("cbox").style.display="none";

}, 10000)();
 