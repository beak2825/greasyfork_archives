// ==UserScript==
// @name         移动叔叔全局去广告 ROM极速下载脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       YDSS
// @match        https://blog.csdn.net/jayandchuxu/article/details/79113755
// @grant        none
// @include     http://bbs.ydss.cn*
// @resource http://cdn.static.runoob.com/libs/bootstrap/3.3.7/css/bootstrap.min.css
// @require  http://code.jquery.com/jquery-1.4.1.min.js
// @require  https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @require  http://cdn.bootcss.com/bootstrap/3.3.0/js/bootstrap.min.js"
// @downloadURL https://update.greasyfork.org/scripts/368297/%E7%A7%BB%E5%8A%A8%E5%8F%94%E5%8F%94%E5%85%A8%E5%B1%80%E5%8E%BB%E5%B9%BF%E5%91%8A%20ROM%E6%9E%81%E9%80%9F%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/368297/%E7%A7%BB%E5%8A%A8%E5%8F%94%E5%8F%94%E5%85%A8%E5%B1%80%E5%8E%BB%E5%B9%BF%E5%91%8A%20ROM%E6%9E%81%E9%80%9F%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

$(function(){



    $('#mn_N4f88').remove();

    $('.bml').remove();
    $('#jdAdBox').remove();
    $('#mn_N59f2').remove();
    //去除右侧 微信 qq悬浮窗
    $('#wechat_float_qrcod').remove();
    //去除 关注大神 按钮
    $("a[id*='followmod']").remove();
    $('#qqSendPay').remove();

    //评论区的广告去除
    $('#jdAdBox').remove();
    $('.lk').remove();
    $('.flg').remove();
    $('.zuixinsj').remove();
    $('.zuixinsjs').remove();
    $('#jd_ad').empty();
    $('.a_pt').empty();

    $('#qmenu').remove();
    //底部申明删除
    $('#flk').remove();
    $('body').attr("background-color","red");
    //下载按钮修改
    $('#down_url').html("直接极速下载");
    $("#down_url").attr('onclick','');  //此方法如不起作用，可使用“ $(this).unbind('click');”  代替\
    $("#down_url").one("click",function(){
        location.href = $('#down_url').attr("dataurl");
    });

    $("#nv_forum").css("font-family",  "黑体" );
    //帖子列表 图片附件 图片删除
    $('.common img').remove();
    //最后发表 删除
    $('.by').empty();
    //$("#nv_forum,#hd").css("background-color","#78909c");
    // $('#nv').empty();
    $("#nv").append("<button type='submit' class='btn btn-primary‘>Submit</button>");
    //swal("恭喜", "已经全局去广告", "success");
});



