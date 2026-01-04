// ==UserScript==
// @name         知乎阅读模式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Long
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408528/%E7%9F%A5%E4%B9%8E%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/408528/%E7%9F%A5%E4%B9%8E%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    $(".AppHeader").hide();  //隐藏主页上部分
    $(".GlobalSideBar").hide();  //隐藏右侧
    $(".QuestionHeader-footer-inner").hide();  //隐藏问题中  关注问题、写回答、邀请回答等字
    $(".Question-sideColumn").hide();  //隐藏右侧作者介绍\
    $("link[rel='shortcut icon']")[0].href = 'https://gitee.com/static/images/logo-black.svg?t=158106664';  //更换title图标
    $('body').css("background", "black");  //改变背景色
    $('body').css("background-image", "url(https://csdnimg.cn/release/phoenix/template/themes_skin/skin-blackboard/images/bg.jpg)");  //背景图片
    $('.ContentItem-more').click();  //打开阅读全文
    for (let i = 0; i < $(".RichContent").length; i++) {
        //console.log($(".RichContent")[i].innerText);
    }
    var x=0;
    //window.location.reload();
     $("body").click(function() {
     console.log(x+=1);
  });
    function tishi() {
        $("title").html('Flask in Web');
    }

    setTimeout(tishi, 1000);

})();