// ==UserScript==
// @name         自动取消
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不计入成交不卖的的取消申请一律通过;
// @author       LiYuan
// @match        https://gsp.aliexpress.com/apps/order/detail?*orderId=*
//@require https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405170/%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88.user.js
// @updateURL https://update.greasyfork.org/scripts/405170/%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
  window.onload=function(event) {
      findBt();
  };
  //  setTimeout(findBt,4000)

    // Your code here...
})();
function findBt(){
    var a=$('button');
    var b=$('.next-message-content span');
    var c=b.text();
    var day=$('.countdown-format .delimiter').length;

    /* .text()*/
   if(a==undefined|c==undefined|b.length==0){
        setTimeout(findBt,2000);
    }else
    {


        if(c=="其他原因"|c=="买家现在不想购买"|c=="备货期不满足买家期望值")
        {
            a[1].click();
            setTimeout(cl,200);

        }else{

        if(day<3){

        a[0].click();
    setTimeout(setReason,200);


        }

        }


    }


}

function setReason(){
 var text=$('textarea');
    text.focus();


}



function cl(){

      var m=$('body > div.next-overlay-wrapper.opened > div.next-dialog.next-closeable.next-overlay-inner.dialog-form > div.next-dialog-footer.next-align-center > button.next-btn.next-medium.next-btn-normal.dada-btn.undefined');
    m.click();

}