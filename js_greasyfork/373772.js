// ==UserScript==
// @name         企业微信
// @namespace    caca
// @version      0.16
// @description  企业微信修改
// @author       caca
// @match        https://app.work.weixin.qq.com/wework_admin/shenpi_detail_print?*
// @match        https://app.work.weixin.qq.com/wework_admin/shenpi/common/shenpi_get_print_by_token?*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373772/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/373772/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1.meta.js
// ==/UserScript==

$(function(){
	
    $(".approval_print_title").html($(".approval_print_title").html().replace(/上海前沿实业有限公司(.*)/g,"$1申请单"));
    $(".approval_print_title").html($(".approval_print_title").html().replace(/前沿智能机器人(.*)/g,"$1申请单"));
    $(".approval_print_qr").hide();
    $(".approval_print_info").hide();
    $("tr:eq(2)").hide();


    $(".approval_print_data_value").each(function(index) {


        $(this).html($(this).html().replace(/已同意.*/g,""));
        $(this).html($(this).html().replace(/上海前沿实业有限公司\//g,""));
        $(this).html($(this).html().replace(/苏州前沿工程有限公司\//g,""));
        $(this).html($(this).html().replace(/ \d{2}:\d{2}:\d{2}/g,""));
        $(this).html($(this).html().replace(/ \d{2}:\d{2}/g,""));
        $(this).html($(this).html().replace(/\d{12}/g,""));
    });


    $(".approval_print_data_title").each(function(index) {

        $(this).html($(this).html().replace(/审批意见/g,"签字"));
        $(this).html($(this).html().replace(/操作记录/g,"时间"));
        $(this).html($(this).html().replace(/审批编号/g,""));
        $(this).html($(this).html().replace(/提交时间/g,"申请日期"));


    });


	
	
})