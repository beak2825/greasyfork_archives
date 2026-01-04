// ==UserScript==
// @name        影视工厂去广告
// @author      robot
// @namespace   robot
// @description 去广告
// @version     1.3
// @require     https://code.jquery.com/jquery-1.9.0.min.js
// @include     https://www.ysgc*.*
// @run-at      document-body
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/458282/%E5%BD%B1%E8%A7%86%E5%B7%A5%E5%8E%82%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/458282/%E5%BD%B1%E8%A7%86%E5%B7%A5%E5%8E%82%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

function addStyle(css,css2) {
    var pi2 = document.createProcessingInstruction(
        'xml-stylesheet',
        'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css2) + '"'
    );
    var pi = document.createProcessingInstruction(
        'xml-stylesheet',
        'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
    );
    var pi3 = document.createProcessingInstruction(
        'xml-stylesheet',
        'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent("#syad2{display:none;}") + '"'
    );
    var pi4 = document.createProcessingInstruction(
        'xml-stylesheet',
        'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent("#xqad{display:none;}") + '"'
    );

    document.insertBefore(pi, document.documentElement);
    document.insertBefore(pi2, document.documentElement);
    document.insertBefore(pi3, document.documentElement);
    document.insertBefore(pi4, document.documentElement);
    setTimeout(function(){
        document.getElementById("HMRichBox").style.display="none";
        document.getElementById("bfad2").style.display="none";
        document.getElementById("bfad1").style.display="none";
        var b = document.getElementById("player-sidebar-is");
        if(b != null){
            b.click();
        }
        },800);

    setTimeout(function(){
        var elevideo = document.getElementById("adv_wrap_hh");
        if(elevideo != null){
            var a = elevideo.getElementsByTagName("a")[0];
            elevideo.removeChild(a);
        }
        },2000);
    return;
}
var box = /www.ysgc*.*/;
if(box.test(location.host)){
    addStyle("#fix_bottom_dom{display:none;}","#syad1{display:none;}");
}
