// ==UserScript==
// @name         遗弃百度，拥抱必应
// @namespace    gogogoghost
// @version      0.4
// @description  使用百度时自动携带搜索参数跳转去必应
// @author       $(ghost)
// @license     MIT
// @match        https://www.baidu.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387338/%E9%81%97%E5%BC%83%E7%99%BE%E5%BA%A6%EF%BC%8C%E6%8B%A5%E6%8A%B1%E5%BF%85%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/387338/%E9%81%97%E5%BC%83%E7%99%BE%E5%BA%A6%EF%BC%8C%E6%8B%A5%E6%8A%B1%E5%BF%85%E5%BA%94.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.leaveBaidu){
        return;
    }
    window.leaveBaidu=true;
    const srcKey='wd=';
    const destUrl='https://cn.bing.com/search?q=';
    let search=window.location.search;
    let indexStart=search.indexOf(srcKey);
    if(indexStart>0){
        indexStart+=srcKey.length-1;
        let indexEnd=search.indexOf('&',indexStart);
        if(indexEnd<0){
            indexEnd=search.length;
        }
        let keyword=search.substring(indexStart+1,indexEnd);
        window.location.href=destUrl+keyword;
    }
})();