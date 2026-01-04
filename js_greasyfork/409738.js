// ==UserScript==
// @name        huanshu2
// @namespace   Violentmonkey Scripts
// @match       http://edulib.winsharelib.com:7093/admin/circulation/checkin
// @grant       none
// @version     3.0
// @author      -
// @description 2001/4/20 下午1:25:12
// @downloadURL https://update.greasyfork.org/scripts/409738/huanshu2.user.js
// @updateURL https://update.greasyfork.org/scripts/409738/huanshu2.meta.js
// ==/UserScript==
var jishu =20000;
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
           jishu=jishu+zeng[j];
           buling1= "0".repeat(7-String(jishu).length)+String(jishu);
           $("#barcode").val(buling1);
           $('#barcode').trigger(e);        
           j=j+1;
            if (j>4) {
           j=0;
            }
           i=i+1;
          setTimeout(fn,10);
    }
}
setTimeout(fn,500);