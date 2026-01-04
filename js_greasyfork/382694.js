// ==UserScript==
// @name         煎蛋网图片浏览增强
// @namespace    http://tampermonkey.net/
// @version      0.6
// @icon         http://cdn.jandan.net/static/img/favicon.ico
// @description  在煎蛋网上，增强浏览图片时的体验。
// @description  试着增加了新功能：1.鼠标经过GIF图时，自动触发点击播放。
// @description  2.图片加载失败时，尝试重新加载。
// @author       水西瓜
// @match        http*://*.jandan.net/ooxx*
// @match        http*://*.jandan.net/pic*
// @match        http*://*.jandan.net/top*
// @match        http*://*.jandan.net/zoo*
// @match        http*://*.jandan.net/zhoubian*
// @match        http*://*.jandan.net/pond*
// @match        https://bh.sb/post/*
// @match        https://qingniantuzhai.com/qing-nian-tu-zhai*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382694/%E7%85%8E%E8%9B%8B%E7%BD%91%E5%9B%BE%E7%89%87%E6%B5%8F%E8%A7%88%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/382694/%E7%85%8E%E8%9B%8B%E7%BD%91%E5%9B%BE%E7%89%87%E6%B5%8F%E8%A7%88%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.addEventListener("error", function (e) {
        var elem = e.target;
        if (elem.tagName.toLowerCase() == "img") {
            var err = elem.getAttribute("errcnt");
            if (null != err) {
                if (err > 3) {
                    return;
                }
            } else {
                err = 0;
            }
            var imgSrc = elem.src;
            elem.src = imgSrc;
            err = err + 1;
            elem.setAttribute("errcnt", err);
        }
    }, true);
    $('.row').each(function(){
        $(this).hover(function(){
            $(this).find(".gif-mask").hover(function(){
                $(this).click();
            });
        });
    });
})();