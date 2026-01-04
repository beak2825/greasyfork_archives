// ==UserScript==
// @name         拉勾教育文章阅读纯净器
// @namespace    tingke9035
// @version      0.3
// @description  去除拉勾教育顶部导航栏，左侧菜单栏，便于最大化阅读
// @author       tingke9035
// @match        https://kaiwu.lagou.com/course/courseInfo.htm*
// @license      GPL License
// @grant        unsafeWindow
// @grant        GM_addStyle(css)
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/418664/%E6%8B%89%E5%8B%BE%E6%95%99%E8%82%B2%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E7%BA%AF%E5%87%80%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/418664/%E6%8B%89%E5%8B%BE%E6%95%99%E8%82%B2%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E7%BA%AF%E5%87%80%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var closedFlag = false;

    function addButton(){
        var html = $(`<button id="beautify" name="beautify" style='position:fixed;border-radius:25px;right:20px; bottom:30px; width:50px; height:50px; font-size:18px; background-color:#d5dadf; z-index:9999;'>美化</button>`);
        $("#app").append(html);
        $("#beautify").on("click", () => {
            if($(".right-content-wrap").length < 1) {
                return;
            }
            if(closedFlag){
              showMenu();
              closedFlag = false;
              $("#beautify").text("美化");
            }else{
              closeMenu();
              closedFlag = true;
              $("#beautify").text("恢复");
            }
        });
    }

    //开启菜单栏目
    function showMenu(){
       $(".wrap.pc-header").show();
       $(".pub-header").show();
       $(".left-content-wrap").show();
       $(".right-content-wrap").css("margin-top:","80px").css("margin-left","384px").css("margin","").css("height","90%");
    }

    //关闭多余菜单栏目，纯净阅读
    function closeMenu(){
        $(".wrap.pc-header").hide();
        $(".pub-header").hide();
        $(".left-content-wrap").hide();
        $(".right-content-wrap").css("margin-top","0px").css("margin","auto").css("height","100%");
    }

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    // 加入了100毫秒的延迟执行，避免页面没有加载出来，程序先执行，无效果的情况
    sleep(100).then(() => {
        addButton();
    })
})();