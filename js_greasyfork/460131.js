// ==UserScript==
// @name         煎蛋无聊图图片加载加速
// @version      1.0
// @description  通过百度图片搜索功能中转无聊图实现快速加载。
// @author       丧心病狂的章鱼夫
// @license      MIT
// @match        https://jandan.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jandan.net
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @run-at       document-start
// @namespace https://greasyfork.org/users/1028216
// @downloadURL https://update.greasyfork.org/scripts/460131/%E7%85%8E%E8%9B%8B%E6%97%A0%E8%81%8A%E5%9B%BE%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/460131/%E7%85%8E%E8%9B%8B%E6%97%A0%E8%81%8A%E5%9B%BE%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

$(document).ready(function(){
    // 替换图片链接
    var img = document.getElementsByTagName('img');
    for(var i=0;i<img.length;i++){
        img[i].src = "https://image.baidu.com/search/down?url=" + img[i].src.replace(/moyu.im/g,'sinaimg.cn');
        if(img[i].getAttribute("org_src") != null)
        {
            img[i].setAttribute("org_src","https://image.baidu.com/search/down?url=https:" + img[i].getAttribute("org_src").replace(/moyu.im/g,'sinaimg.cn'));
        }
    }

    // 替换查看原图链接
    var link = document.getElementsByClassName("view_img_link");
    for(var i=0;i<link.length;i++){
        if(link[i].getAttribute("href") != null)
        {
            link[i].setAttribute("href","https://image.baidu.com/search/down?url=https:" + link[i].getAttribute("href").replace(/moyu.im/g,'sinaimg.cn'));
        }
    }
});