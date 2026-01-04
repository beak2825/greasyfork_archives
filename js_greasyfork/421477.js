// ==UserScript==
// @name         手机百度跳转
// @namespace    baidu
// @version      1.0.1
// @description  使用手机百度时自动跳转，去除app下载提示
// @author       xiaohan231
// @license      MIT
// @include      https://www.baidu.com/*
// @include      https://m.baidu.com/ssid=*
// @include      https://m.baidu.com/s?word=*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421477/%E6%89%8B%E6%9C%BA%E7%99%BE%E5%BA%A6%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/421477/%E6%89%8B%E6%9C%BA%E7%99%BE%E5%BA%A6%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.leaveBaidu){
        return;
    }
    window.leaveBaidu=true;
    const srcKey='word=';
    const destUrl='https://m.baidu.com/from=1001192y/s?word=';
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