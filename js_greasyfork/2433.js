// ==UserScript==
// @name       贴吧 — 只显示楼主 精简界面
// @namespace  http://userscripts.org/users/499502
// @version    0.3
// @description  用于贴吧 【只看楼主】 页面，清理无用部分。
// @match      http://tieba.baidu.com/p/*?see_lz=1*
// @copyright  2014+, G yc
// @downloadURL https://update.greasyfork.org/scripts/2433/%E8%B4%B4%E5%90%A7%20%E2%80%94%20%E5%8F%AA%E6%98%BE%E7%A4%BA%E6%A5%BC%E4%B8%BB%20%E7%B2%BE%E7%AE%80%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/2433/%E8%B4%B4%E5%90%A7%20%E2%80%94%20%E5%8F%AA%E6%98%BE%E7%A4%BA%E6%A5%BC%E4%B8%BB%20%E7%B2%BE%E7%AE%80%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==


function clearpage() {

    
    //删除分享
    $(".share_btn_wrapper").remove();
    //回复
    $(".core_reply_tail").remove();
    $(".j_lzl_container").remove();
    
    //作者
    $(".d_author").remove();
    
    //右侧
    $(".right_section").remove();
    $(".tbui_aside_float_bar").remove();
    
    
    //沙发移除
    $("#sofa_post").remove();
    
    
    
}		


clearpage();


$(document).ready(function(){
       

    
  $(document).scroll(function() {
     clearpage();
  });
});