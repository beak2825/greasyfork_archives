// ==UserScript==
// @name         SYOJ热补丁
// @namespace    http://oj.sdshiyan.cn/
// @version      0.5
// @description  N怎么又在咕咕咕
// @author       NLDL
// @match        http://oj.sdshiyan.cn/*
// @icon         https://tse2-mm.cn.bing.net/th/id/OIP-C.q8wp-6RcvzhW0_Dx0YUEewAAAA?pid=ImgDet&rs=1
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/482862/SYOJ%E7%83%AD%E8%A1%A5%E4%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/482862/SYOJ%E7%83%AD%E8%A1%A5%E4%B8%81.meta.js
// ==/UserScript==
// update log:
// 2023.10.19 创建文件
// 2023.10.19 更换了镜像源
// 2023.12.21 加入了更换latex源的功能

(function() {
    'use strict';
    console.log("OK");
    let text=document.getElementsByClassName("media-object img-thumbnail d-block mx-auto");
    for(let i=0;i<text.length;++i){
        let yuan=text[i].getAttribute("src");
        yuan=yuan.replace("cn.gravatar.com/avatar/","cdn.v2ex.com/gravatar/");
        text[i].setAttribute("src",yuan);
        text[i].setAttribute("height",256);
        text[i].setAttribute("width",256);
    }
    text=document.getElementsByClassName("media-object img-rounded");
    for(let i=0;i<text.length;++i){
        let yuan=text[i].getAttribute("src");
        yuan=yuan.replace("cn.gravatar.com/avatar/","cdn.v2ex.com/gravatar/");
        text[i].setAttribute("src",yuan);
        text[i].setAttribute("height",64);
        text[i].setAttribute("width",64);
    }
    text=document.getElementsByTagName('head')[0];
    for(let i=0;i<text.children.length;++i){
        let ch=text.children[i];
        if(ch.hasAttribute("src")){
            let tmp=ch.getAttribute("src")
            if(tmp=="//cdn.bootcss.com/mathjax/2.6.0/MathJax.js?config=TeX-AMS_HTML"){
                tmp="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.6.0/MathJax.js?config=TeX-AMS_HTML";
                ch.setAttribute("src",tmp);
            }
            else if(tmp=="http://cdn.bootcss.com/mathjax/2.6.0/config/TeX-AMS_HTML.js?rev=2.6.0"){
                tmp="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.6.0/config/TeX-AMS_HTML.js?rev=2.6.0";
                ch.setAttribute("src",tmp);
            }
        }
    }
    // text.getAttribute("src").replace("cdn.bootcss.com/mathjax/2.6.0/MathJax.js?config=TeX-AMS_HTML","cdnjs.cloudflare.com/ajax/libs/mathjax/2.6.0/MathJax.js?config=TeX-AMS_HTML");
    // https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.6.0/MathJax.js?config=TeX-AMS_HTML
})();