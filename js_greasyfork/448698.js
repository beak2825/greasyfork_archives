// ==UserScript==
// @name         xmair门户手册下载插件
// @namespace    http://xiamenair.com.cn/
// @version      0.4
// @description  用于下载xmair门户手册，开启后将激活手册阅读页面的下载功能。帮你下载门户手册，就是这么洒脱
// @author       Johnson-62117
// @match        http://ekp.xiamenair.com.cn/ekp/resource/pdf/file/viewer.jsp?*
// @match        http://portal.xiamenair.com.cn/ekp/resource/pdf/file/viewer.jsp?*
// @match        http://manual.xiamenair.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiamenair.com.cn
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/448698/xmair%E9%97%A8%E6%88%B7%E6%89%8B%E5%86%8C%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/448698/xmair%E9%97%A8%E6%88%B7%E6%89%8B%E5%86%8C%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentUrl = window.location.href;
    // 检查是否为新版手册系统
    if (currentUrl.indexOf("http://manual.xiamenair.com.cn/pdfjs-2.0.943-dist/web/") != -1) {
        noPrint=false
        $("#openFile").css("display", "").css("filter", "brightness(0.2)");
        //$("#print").css("display", "").css("filter", "brightness(0.2)");
        $("#download").css("display", "").css("filter", "brightness(0.2)");
        $(document).ready(function () {
            setInterval(function(){
                        $(".cover").css("display", "none");
                        },2000);
        });

}
    else{
        //旧版本手册阅读系统
        $(".toolbarButton.download.hiddenMediumView").css("display","inline")
    }
})();