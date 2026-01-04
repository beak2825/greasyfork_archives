// ==UserScript==
// @name         maersk ticket simple
// @version      1.0.0
// @namespace    pengfei wang
// @description  订票
// @author       pengfei wang
// @match        *://*.maersk.com.cn/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_setValue
// @license      MIT
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/426362/maersk%20ticket%20simple.user.js
// @updateURL https://update.greasyfork.org/scripts/426362/maersk%20ticket%20simple.meta.js
// ==/UserScript==

var setting = {
    priceOwnerReference: '合约方',
    speed: 500,
    refresh: 5000,
    wait: 1000,
    autoSubmit: 0
};
var url=location.pathname;var param=location.search;var href=location.href;var $=window.$;(function(){if(url=="/instantPrice/quotes"||url=="/instantPrice/"){var timer2=setInterval(function(){if($(".vueperslides__track-inner").length>0){var hasSpot=false;$.each($(".vueperslides__track-inner").children(),function(index,item){if($(item).find(".slide-inside--price").text().indexOf("USD")>=0){$(item).find(".slide-inside--date").click();$(".rate-details-card .cardContent .button")[0].click();console.info("page1 select");clearInterval(timer2);$(".cardContent .button.button--primary").click();console.info("page1 click");hasSpot=true;return false}});if(!hasSpot){setTimeout(function(){clearInterval(timer2);console.info("page1 refresh");location.reload()},setting.refresh)}}},setting.speed);if(param=="?edit=true"){var timer0=setInterval(function(){if($(".button.button--primary").length>0&&$('.form-input__field[placeholder="输入商品"]').val()!=""){clearInterval(timer0);setTimeout(function(){console.info("page0 click");$(".button.button--primary").click()},setting.wait)}},setting.speed)}}if(url=="/ibooking/"){var timer3=setInterval(function(){if($("#priceOwnerReference").not(".input-disabled").length>0){$("#priceOwnerReference").val(setting.priceOwnerReference);console.info("page2 input");clearInterval(timer3);setTimeout(function(){$("#continue").click();console.info("page2 cilck")},setting.wait)}else{if($(".card__action.update-price-owner").length>0&&$("input#container-item-0").val()!=""){$(".card__action.update-price-owner").click();console.info("page2 add owner")}}},setting.speed);var timer4=setInterval(function(){if($(".price-owner-select").length>0){$(".price-owner-select").click();clearInterval(timer4);console.info("page2 select owner")}},setting.speed);var timer5=setInterval(function(){if($("#resultsServiceContract").length>0){$("#resultsServiceContract #noSC").click();clearInterval(timer5);console.info("page2 noSC")}},setting.speed);var timer6=setInterval(function(){if($("#sc-continue").not('[disabled="disabled"]').length>0){$("#sc-continue").click();clearInterval(timer6);console.info("page2 noSC submit");var timer7=setInterval(function(){if(location.href=="https://www.maersk.com.cn/ibooking/#select-sailing"){var els=$("#sailing-routes-details .offer-book-button");var elrs=els.not('[disabled="disabled"]');if(els.length>0){if(elrs.length>0){clearInterval(timer7);console.info("page3 select spot");elrs[0].click();var timer8=setInterval(function(){if(location.href=="https://www.maersk.com.cn/ibooking/#required-details"){var datePicker=$("#pseudo-date-input-haulageDate0");if(datePicker.length>0){clearInterval(timer8);datePicker.trigger("focus");datePicker.trigger("mouseup");console.info("page3 open day");var timer9=setInterval(function(){var dateEL=$('.ui-datepicker-calendar td[data-event="click"]');if(dateEL.length>0){clearInterval(timer9);dateEL[0].click();console.info("page3 select day");var timer10=setInterval(function(){if($(".description-card__parties").length>0){clearInterval(timer10);console.info("page3 check submit");$("#review-booking").click()}},setting.speed);var timer11=setInterval(function(){if(location.href=="https://www.maersk.com.cn/ibooking/#review-booking"){var accrptEl=$("#acceptTermsAndCondition");if(accrptEl.length>0){console.info("page4 accept terms");clearInterval(timer11);setTimeout(function(){accrptEl.trigger("click");if(setting.autoSubmit==1){console.info("page4 all done");$("#submit-booking").click()}},setting.wait*2)}}},setting.speed)}else{location.href="https://www.maersk.com.cn/instantPrice/?edit=true"}},setting.speed)}}},setting.speed)}else{location.href="https://www.maersk.com.cn/instantPrice/?edit=true"}}}},setting.speed)}},setting.speed)}})();