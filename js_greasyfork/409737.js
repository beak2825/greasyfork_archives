// ==UserScript==
// @name        jieshu
// @namespace   Violentmonkey Scripts
// @match       http://edulib.winsharelib.com:7093/admin/circulation/checkout
// @grant       none
// @version     3.0
// @author      -
// @description 2005/1/20 下午9:25:12
// @downloadURL https://update.greasyfork.org/scripts/409737/jieshu.user.js
// @updateURL https://update.greasyfork.org/scripts/409737/jieshu.meta.js
// ==/UserScript==
var kaishi =2000;
var renshu = 1200;
var jishu =2000;
var buling1= "";
var xianzai = kaishi-1;
var j = 0;
var zeng = new Array(7,3,5,9,4);
var i = 0;
var v = jQuery.Event("keydown");
v.keyCode = 13;
v.which = 13; 
setTimeout(fn,0);
function fn(){
if (i<renshu){
    i = i+1; 
    xianzai = xianzai+1;
    buling1= "0".repeat(6-String(xianzai).length)+String(xianzai);
    $("#usercode").val(buling1);    
  if(i>1) { $("#barcode").trigger(v); 
           $("#usercode").trigger(v); }else{
    $("#usercode").trigger(v); 
  }
  function sleep3(ms) {
                return new Promise(function(resolve, reject) {
                    setTimeout(resolve, ms)
                })
            }
               async function init() {
                await sleep3(500);
            }
            init().then(() => {        
       jishu=jishu+zeng[0];
       buling1= "0".repeat(7-String(jishu).length)+String(jishu);
       $("#barcode").val(buling1);
       $("#barcode").trigger(v); 
              jishu=jishu+zeng[1];
       buling1= "0".repeat(7-String(jishu).length)+String(jishu);
       $("#barcode").val(buling1);
       $("#barcode").trigger(v); 
              jishu=jishu+zeng[2];
       buling1= "0".repeat(7-String(jishu).length)+String(jishu);
       $("#barcode").val(buling1);
       $("#barcode").trigger(v); 
              jishu=jishu+zeng[3];
       buling1= "0".repeat(7-String(jishu).length)+String(jishu);
       $("#barcode").val(buling1);
       $("#barcode").trigger(v); 
              jishu=jishu+zeng[4];
       buling1= "0".repeat(7-String(jishu).length)+String(jishu);
       $("#barcode").val(buling1);
       $("#barcode").trigger(v); 
                setTimeout(fn,200);
            })
   }}