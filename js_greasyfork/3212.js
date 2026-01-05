// ==UserScript==
// @name          Endor Mic
// @version        0.1
// @description    A key triggers Mic S key triggers play D key triggers submit  
// @author         Cristo
// @include        https://www.google.com/evaluation/endor*
// @copyright    2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/3212/Endor%20Mic.user.js
// @updateURL https://update.greasyfork.org/scripts/3212/Endor%20Mic.meta.js
// ==/UserScript==

var wig = document.getElementById("widget");
var kid = wig.getElementsByTagName("div")[0];
var rec = kid.getElementsByTagName("div")[0].firstChild.firstChild;
var play = kid.getElementsByTagName("div")[5].firstChild.firstChild;
document.addEventListener( "keydown", kas, false);
function kas(i) {
    if (i.keyCode == 65) { //A
        var trig = document.createEvent("MouseEvents");
        trig.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        rec.dispatchEvent(trig);
    }
    if (i.keyCode == 83) { //S
        var trig1 = document.createEvent("MouseEvents");
        trig1.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        play.dispatchEvent(trig1);
    }
    if (i.keyCode == 68) { //D
        document.getElementById("submitButton").click();
    }  
}
