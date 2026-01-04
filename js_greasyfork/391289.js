// ==UserScript==
// @name         图片链接转换
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  错误图片链接转换
// @author       You
// @match         http*://hggard.com/*
// @connect      hggard.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391289/%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/391289/%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let imgs = document.getElementsByTagName('img');
    for(var img of imgs ){
        if(/static\.gmgard\.com/.test(img.src)){
            img.src = img.src.replace(/static\.gmgard\.com/,'static.hggard.com') ;
        }

        if(img.attributes['data-src'] && /static\.gmgard\.com/.test(img.attributes['data-src'].nodeValue)){
            img.attributes['data-src'].nodeValue = img.attributes['data-src'].nodeValue.replace(/static\.gmgard\.com/,'static.hggard.com') ;
        }
    }

    let alink = document.getElementsByTagName('a');
    for(var link of alink ){
        if(/static\.gmgard\.com/.test(link.href) && link.hasAttribute('data-img-href')){
            link.href = link.href.replace(/static\.gmgard\.com/,'static.hggard.com') ;
        }
    }


    // Your code here...
})();