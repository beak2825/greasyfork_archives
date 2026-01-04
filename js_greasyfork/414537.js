// ==UserScript==
// @name        huanshu3
// @namespace   Violentmonkey Scripts
// @match       http://edulib.winsharelib.com:7093/admin/circulation/checkin
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant       none
// @version     1.0
// @author      -
// @description 2012/2/12 下午9:25:12
// @downloadURL https://update.greasyfork.org/scripts/414537/huanshu3.user.js
// @updateURL https://update.greasyfork.org/scripts/414537/huanshu3.meta.js
// ==/UserScript==
var mybooks=["0019576",,"0010099"]
var e = jQuery.Event("keydown");
e.keyCode = 13;
e.which = 13;
var i=0;
function fn() {
    if(i<mybooks.length){
        $("#barcode").val(mybooks[i]);
        $('#barcode').trigger(e);
        setTimeout(fn,10);
        i=i+1;
    }
}
setTimeout(fn,10);