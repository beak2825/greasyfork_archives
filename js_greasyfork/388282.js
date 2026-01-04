// ==UserScript==
// @name         2. 위메프 첫항목 클릭과 구매
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match        https://mw.wemakeprice.com/product/*
// @match        https://mw.wemakeprice.com/deal/*
// @match        http://m.wemakeprice.com/m/deal/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388282/2%20%EC%9C%84%EB%A9%94%ED%94%84%20%EC%B2%AB%ED%95%AD%EB%AA%A9%20%ED%81%B4%EB%A6%AD%EA%B3%BC%20%EA%B5%AC%EB%A7%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/388282/2%20%EC%9C%84%EB%A9%94%ED%94%84%20%EC%B2%AB%ED%95%AD%EB%AA%A9%20%ED%81%B4%EB%A6%AD%EA%B3%BC%20%EA%B5%AC%EB%A7%A4.meta.js
// ==/UserScript==

(function() {
    $('.btn.red_large:first').trigger('click');
    if($('.frm_slt .opt_list').length == 0){
        $('.opt_list li a').not('.disabled a').eq(0).trigger('click');
    }
    if($('.set_op').length == 1){
        $('.set_op .opt_list li a').eq(0).trigger('click');
    }
    setTimeout(function() {
        var optlen = $('.frm_slt .opt_list').length
        for(var i=0;i<optlen;i++){
            $('.frm_slt .opt_list').eq(i).find("li a").trigger('click');
        }
    }, 150);
   setTimeout(function() {
        $('.btn.sky_mid').trigger('click');
    }, 1000);


   var macro = setInterval(function() {
       if(!$('button[data-gtm-label="구매하기"]').is(":disabled")){
           $('button[data-gtm-label="구매하기"]').trigger('click');
           clearInterval(macro);
       }
   }, 50);
})();

