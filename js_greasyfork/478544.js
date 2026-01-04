// ==UserScript==
// @name         煎蛋手机版简单优化
// @namespace    https://github.com/RstursOC/
// @version      0.3.0
// @description  图片加速，自动展开原图，GIF滚动到页面自动加载
// @author       RstursOC
// @match        i.jandan.net/pic
// @match        i.jandan.net/pic/*
// @match        jandan.net/pic
// @match        jandan.net/pic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jandan.net
// @grant        none
// @website      https://github.com/RstursOC
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478544/%E7%85%8E%E8%9B%8B%E6%89%8B%E6%9C%BA%E7%89%88%E7%AE%80%E5%8D%95%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/478544/%E7%85%8E%E8%9B%8B%E6%89%8B%E6%9C%BA%E7%89%88%E7%AE%80%E5%8D%95%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
};

$(document).ready(function () {
    'use strict';

    // 替换图片链接
    var img = document.getElementsByTagName('img');
    for(var i=0;i<img.length;i++){

        img[i].src = "https://image.baidu.com/search/down?url=" + img[i].src.replace(/moyu.im/g,'sinaimg.cn');
        if(img[i].getAttribute("org_src") != null)
        {
            img[i].setAttribute("org_src","https://image.baidu.com/search/down?url=https:" + img[i].getAttribute("org_src").replace(/moyu.im/g,'sinaimg.cn'));
        }
        // 自动展开图片
        if(img[i].getAttribute("style") && img[i].getAttribute("style").indexOf("max-width: 100%;") >= 0){
            img[i].setAttribute("style", "max-width: 100%; max-height: none;");
        }

        // 添加图片加载错误事件处理
        img[i].onerror = function() {
             retry(this)
        }
    }

    // 替换查看原图链接
    var link = document.getElementsByClassName("view_img_link");
    for(var y=0;y<link.length;y++){
        if(link[y].getAttribute("href") != null)
        {
            link[y].setAttribute("href","https://image.baidu.com/search/down?url=https:" + link[y].getAttribute("href").replace(/moyu.im/g,'sinaimg.cn'));
        }
    }

    // 监听是否滚动到GIF
    $(window).on("resize scroll", function() {
        $(".gif-mask").each(function() {
            if ($(this).isInViewport()) {
                this.parentElement.getElementsByClassName("gif-mask")[0].click();
            }
        });
    });
});

function retry(imgObj) {
    // 取消图片加速
    imgObj.src = imgObj.src.replaceAll("https://image.baidu.com/search/down?url=", "").replace(/sinaimg.cn/g,'moyu.im');
    if(imgObj.getAttribute("org_src") != null)
    {
        imgObj.setAttribute("org_src", imgObj.getAttribute("org_src").replace("https://image.baidu.com/search/down?url=https:", "").replace(/sinaimg.cn/g,'moyu.im'));
    }

    // 取消监听
    imgObj.onerror = null
}