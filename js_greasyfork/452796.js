// ==UserScript==
// @name         企业微信审批打印
// @version      1.2
// @description  null
// @author       taylorsweeft
// @match        https://app.work.weixin.qq.com/wework_admin/approval/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @namespace https://greasyfork.org/users/968667
// @downloadURL https://update.greasyfork.org/scripts/452796/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E5%AE%A1%E6%89%B9%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/452796/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E5%AE%A1%E6%89%B9%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".approval_print_data_title_center[colspan='2']").each(function(){
        if($(this).text().indexOf("同意")!= -1){
           $(this).text("已同意")
       }
    });
    $(".approval_print_info_date").hide();
    $(".approval_print_qr_image_wrap").hide();
    $(".approval_print_qr_text").hide();
    $(".approval_print_info_user").hide();
    $(".approval_print_data_value").each(function(){
        if($(this).text().indexOf(":")!= -1){
            console.log($(this).text())
            let htmlTxt = $(this).text()
            $(this).text(htmlTxt.replace(/[0-2][0-9]:[0-9][0-9]/,""))
       }
    });
})();