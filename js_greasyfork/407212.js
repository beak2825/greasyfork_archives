// ==UserScript==
// @name         风车动漫滚动到当前集数
// @namespace    gqqnbig
// @version      0.1
// @description  播放列表滚动到当前集数
// @author       gqqnbig
// @match        http://www.doubao.cc/v/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407212/%E9%A3%8E%E8%BD%A6%E5%8A%A8%E6%BC%AB%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BD%93%E5%89%8D%E9%9B%86%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/407212/%E9%A3%8E%E8%BD%A6%E5%8A%A8%E6%BC%AB%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BD%93%E5%89%8D%E9%9B%86%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let path=location.pathname;
    let p=path.lastIndexOf('/');
    if(p==-1)
        return;

    path=path.substr(p+1);
    let targetElement= $(".movurls li>a[href$='"+path+"']");
    let container=targetElement.closest('ul');
    if(targetElement.length>0 && container.length>0)
    {
        container[0].scrollTo(0,targetElement[0].offsetTop-container[0].offsetTop);
    }
})();