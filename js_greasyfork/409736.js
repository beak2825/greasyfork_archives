// ==UserScript==
// @name        huanshu
// @namespace   Violentmonkey Scripts
// @match       http://edulib.winsharelib.com:7093/admin/circulation/checkin
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant       none
// @version     4.0
// @author      -
// @description 2012/2/12 下午9:25:12
// @downloadURL https://update.greasyfork.org/scripts/409736/huanshu.user.js
// @updateURL https://update.greasyfork.org/scripts/409736/huanshu.meta.js
// ==/UserScript==
var jishu =20000;
var benshu=6000;
var buling1= "";
var e = jQuery.Event("keydown");
e.keyCode = 13;
e.which = 13; 
var j = 0;
var zeng = new Array(7,3,5,9,4);
var i=0;
function fn() {
    if(i<benshu){
           i=i+1;
           jishu=jishu+zeng[j];
           buling1= "0".repeat(7-String(jishu).length)+String(jishu);
           $("#barcode").val(buling1);
           $('#barcode').trigger(e);        
           j=j+1;
            if (j>4) {
           j=0;
            }
          setTimeout(fn,0);
    }
}
setTimeout(fn,10);