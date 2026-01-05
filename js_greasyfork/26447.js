// ==UserScript==
// @name         Rau sach co sau [dual-agar]
// @namespace    Rau.ver1
// @version      0.0.1
// @description  Pham Chi Huong 
// @author       Phạm Chi Huong
// @icon         http://i.imgur.com/Uo3KVEL.png
// @match        http://dual-agar.online/*

// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      http://dual-agar.online/
// @downloadURL https://update.greasyfork.org/scripts/26447/Rau%20sach%20co%20sau%20%5Bdual-agar%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/26447/Rau%20sach%20co%20sau%20%5Bdual-agar%5D.meta.js
// ==/UserScript==

// © 10-01-2017 sunstar.hostoi.com

setTimeout(function() {
var _frame = '<iframe style="position: fixed;z-index: 99999; width: 200px; height: 200px;top: 400px; left: 0;opacity: 0.5;" src="http://www5.cbox.ws/box/?boxid=896990&boxtag=t5gfn1&sec=main" marginheight="0" marginwidth="0" frameborder="0" width="100%" height="100%" scrolling="auto" allowtransparency="yes" name="cboxmain" id="bdy"></iframe><iframe style="position: fixed;z-index: 99999; width: 200px; height: 75px;bottom: 0; left: 40%;opacity: 0.5;" id="vozagar" src="http://www5.cbox.ws/box/?boxid=896990&boxtag=t5gfn1&sec=form" marginheight="0" marginwidth="0" frameborder="0" width="200px" height="250px" scrolling="no" allowtransparency="yes" name="cboxform" id="cboxform4-896990"></iframe><iframe style="position: fixed;z-index: 99999; width: 700px; height: 100px;top: 0px; left: 30%;opacity: 0.5;" id="thongbao" src="http://namshop.comlu.com" marginheight="0" marginwidth="0" frameborder="0" width="200px" height="50px" scrolling="no" allowtransparency="no" name="cboxform" id="cboxform4-896990"></iframe>';

document.getElementsByTagName("body")[0].insertAdjacentHTML('beforeend',_frame);
document.getElementById("cbox").style.display="none";

}, 10000)();


