// ==UserScript==
// @name         ZCMU的教学评价(学评教)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ZCMU的教学评价(半自动学评教，比手动要快，按Esc键可以加速)
// @author       Drophair
// @match        http://jwmk.zcmu.edu.cn/jwglxt/xspjgl/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      http://cdn.bootcss.com/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445840/ZCMU%E7%9A%84%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%28%E5%AD%A6%E8%AF%84%E6%95%99%29.user.js
// @updateURL https://update.greasyfork.org/scripts/445840/ZCMU%E7%9A%84%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%28%E5%AD%A6%E8%AF%84%E6%95%99%29.meta.js
// ==/UserScript==

(function() {
    $('.mui-table-view-cell:first').click();
    //console.log("开始学评教");
    alert("开始学评教，按下Esc键即可完成单次学评教");
    setTimeout(()=>{
        $('.cs').each(function(){if($(this).attr('data-dyf') == 95 || $(this).attr('data-dyf') == 0) {$(this).click()}});$('#submit').click();
        $('#py').text("老师讲的很好");
        setTimeout(()=>{
        //    $('#btn_ok').click();
        },100);
    },100);
})();