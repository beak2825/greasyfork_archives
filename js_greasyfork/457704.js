// ==UserScript==
// @name         微店-确认
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!111
// @author       You
// @match        https://weidian.com/buy/add-order/index.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457704/%E5%BE%AE%E5%BA%97-%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/457704/%E5%BE%AE%E5%BA%97-%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

//防止文档在完全加载（就绪）之前运行 jQuery 代码，即在 DOM 加载完成后才可以对 DOM 进行操作。
//可以用尝试一下
//window.onload = function () {
    // 执行代码
//}
$(document).ready(function(){    //在页面加载完，自动执行定义js代码
   if($(".address_recent").length > 0) {
    // 刷新这页
    window.location.reload();
   }
    else{
       var time_seed = 50;
      setTimeout(myinput1, time_seed);
      setTimeout(myinput2, time_seed + 10);
      setTimeout(myinput3, time_seed + 20);
      setTimeout(myinput4, time_seed + 30);
      setTimeout(tick, time_seed + 40);
     setTimeout(remake,time_seed + 80);
    }
});
 function myinput1(){
        //身份证（姓名）
        var ele1 = document.getElementsByClassName('custom_item_input')[0].firstChild
        ele1.value = '410724199805186030';
        ele1.focus();
        var event1 = document.createEvent('HTMLEvents');
        event1.initEvent("input", true, true);
        event1.eventType = 'message';
        ele1.dispatchEvent(event1);
        //ele1.focus();
    }
    function myinput2(){
        var ele2 = document.getElementsByClassName('custom_item_input')[1].firstChild
        ele2.setAttribute('value', '410724199805186030')          //410724199805186030
        ele2.focus();
        var event2 = document.createEvent('HTMLEvents')
        event2.initEvent("input", true, true)
        event2.eventType = 'message'
        ele2.dispatchEvent(event2)
    }
    function myinput3(){
        var ele3 = document.getElementsByClassName('custom_item_input')[2].firstChild;
        ele3.focus();
        ele3.setAttribute('value', '成都');
        var event3 = document.createEvent('HTMLEvents');
        event3.initEvent("input", true, true);
        event3.eventType = 'message';
        ele3.dispatchEvent(event3)
    }
     function myinput4(){
        var ele4 = $("#express_name_input").val("1");
        ele4.focus();
    }
    function tick(){
        $("#pay_btn > span").click();
    }
    function remake(){
        $("body > div.wd-messagebox > footer > span:nth-child(2)").click();
    }
