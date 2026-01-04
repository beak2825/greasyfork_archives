// ==UserScript==
// @name         简书显示图片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Ericwyn
// @date 2019-06-05
// @description  6月初的时候简书没法显示图片，使用这个脚本可以让图片重新显示~
// @match        https://www.jianshu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384549/%E7%AE%80%E4%B9%A6%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/384549/%E7%AE%80%E4%B9%A6%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let doms = document.getElementsByClassName("image-view");
    for(let i = 0;i < doms.length; i ++){
        let src = doms[i].getElementsByTagName("img")[0].getAttribute("data-original-src");
        doms[i].style.background = "url('"+src+"')";
    }
    setTimeout(function () {
        for(let i = 0;i < doms.length; i ++){
            doms[i].classList.remove("image-view-maintain");
        }
    },1000)

    // Your code here...
})();
