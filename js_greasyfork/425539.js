// ==UserScript==
// @name         jt
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  this is remove watermark
// @author       y
// @match        https://www.jtthink.com/course/*
// @include      *.www.jtthink.com/course/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @icon         https://www.google.com/s2/favicons?domain=oschina.net
// @grant        none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/425539/jt.user.js
// @updateURL https://update.greasyfork.org/scripts/425539/jt.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        var pvideo_html = document.getElementsByClassName("pv-video-wrap")[0];

        // style标签数量统计
        var style_num = pvideo_html.getElementsByTagName("style").length;
        // 获取2个style标签
        var styleAll = pvideo_html.getElementsByTagName("style");
        console.log("发现"+style_num+"个style标签");

        // 尝试捕捉异常
        try {
            console.log('开始移除style标签......')
            for (var i = 0; i < 2; i++) {
                if (styleAll.length == 1) {
                    console.log(pvideo_html.removeChild(styleAll[0]));
                }else{
                    console.log(pvideo_html.removeChild(styleAll[i]));
                }
        }
        console.log("移除完毕......")
    } catch {
        console.log('发生错误，请重新执行,并检查程序');
    }

    }, 1000);
})();