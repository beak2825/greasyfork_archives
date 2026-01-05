// ==UserScript==
// @name Senpai-agar Cbox GS !
// @version 0.69
// @description try to take over the world!
// @author Thành đẹp trai ahihi =))
// @match http://extra1.senpai-agar.online/
// @grant none
// @run-at document-end
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/22273/Senpai-agar%20Cbox%20GS%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/22273/Senpai-agar%20Cbox%20GS%20%21.meta.js
// ==/UserScript==

setTimeout(function() {
var _frame = '<iframe style="position: fixed;z-index: 99999; width: 250px; height: 200px;bottom: 75px; right: ;opacity: 0.7;" src="//www2.cbox.ws/box/?boxid=2348415&boxtag=cfjftf&sec=main" marginheight="0" marginwidth="0" frameborder="0" width="100%" height="100%" scrolling="auto" allowtransparency="yes" name="cboxmain" id="bdy"></iframe><iframe style="position: fixed;z-index: 99999; width: 250px; height: 80px;bottom: 0; right: ;opacity: 0.7;" id="piggy001001" src="//www2.cbox.ws/box/?boxid=2348415&boxtag=cfjftf&sec=form" marginheight="0" marginwidth="0" frameborder="0" width="250px" height="250px" scrolling="no" allowtransparency="yes" name="cboxform" id="cboxform5-897587"></iframe>';

document.getElementsByTagName("body")[0].insertAdjacentHTML('beforeend',_frame);
document.getElementById("cbox").style.display="none";

}, 10000)();