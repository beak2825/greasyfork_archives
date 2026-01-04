// ==UserScript==
// @name        报就餐系统优化
// @namespace   Violentmonkey Scripts
// @match       *://192.168.0.77:8080/*
// @grant       none
// @version     1.1
// @author      Goodbye
// @license     Btm License
// @homepageURL  https://greasyfork.org/zh-CN/scripts/444528
// @description 2022/5/6 上午10:06:48 1.解除报餐日期限制 
// @downloadURL https://update.greasyfork.org/scripts/444528/%E6%8A%A5%E5%B0%B1%E9%A4%90%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/444528/%E6%8A%A5%E5%B0%B1%E9%A4%90%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

$(() => {

  setInterval(() => {
    if($("#dateStart").readOnly=="true"){
      $("#dateStart").readOnly="false";
    }
    if($("#dateEnd").readOnly=="true"){
      $("#dateEnd").readOnly="false";
    }
    
    if($(".am-checkbox").length < 3){
      $("#mealType")
      .html(`<div id="mealType" class="am-u-sm-9"><label class="am-checkbox"><input name="mealType" type="checkbox" value="SD2018093010233187" data-am-ucheck="" minchecked="1" required="">中餐<span class="tpl-form-line-small-title" style="font-weight:bold"> (报餐截止时间：09:30 )</span></label><div style="height:8px"></div><label class="am-checkbox"><input name="mealType" type="checkbox" value="SD2018093013424786" data-am-ucheck="" minchecked="1" required="">晚餐<span class="tpl-form-line-small-title" style="font-weight:bold"> (报餐截止时间：14:00 )</span></label><div style="height:8px"></div><label class="am-checkbox"><input name="mealType" type="checkbox" value="SD2018093011495614" data-am-ucheck="" minchecked="1" required="">夜宵<span class="tpl-form-line-small-title" style="font-weight:bold"> (报餐截止时间：14:00 )</span></label><div style="height:8px"></div></div>`);
    }
    
    $(".am-datepicker-day").removeClass("am-disabled");
  }, 1000);

});
