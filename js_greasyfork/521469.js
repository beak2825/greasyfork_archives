// ==UserScript==
// @name         清空百度搜索框|必应搜索框(cn.bing.com才会有)| 必应热点 恶心的新闻广告和热点
// @namespace    https://github.com/zuiyuewentian/ClearBaiduAd
// @version      0.2
// @description  在访问百度或者bing时，清空百度搜索框|必应搜索框(cn.bing.com才会有)| 必应热点 恶心的新闻广告和热点
// @author       chen cheng
// @match        *://*.baidu.com
// @match        *://cn.bing.com/*
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/521469/%E6%B8%85%E7%A9%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%A1%86%7C%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E6%A1%86%28cnbingcom%E6%89%8D%E4%BC%9A%E6%9C%89%29%7C%20%E5%BF%85%E5%BA%94%E7%83%AD%E7%82%B9%20%E6%81%B6%E5%BF%83%E7%9A%84%E6%96%B0%E9%97%BB%E5%B9%BF%E5%91%8A%E5%92%8C%E7%83%AD%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/521469/%E6%B8%85%E7%A9%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%A1%86%7C%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E6%A1%86%28cnbingcom%E6%89%8D%E4%BC%9A%E6%9C%89%29%7C%20%E5%BF%85%E5%BA%94%E7%83%AD%E7%82%B9%20%E6%81%B6%E5%BF%83%E7%9A%84%E6%96%B0%E9%97%BB%E5%B9%BF%E5%91%8A%E5%92%8C%E7%83%AD%E7%82%B9.meta.js
// ==/UserScript==

this.sentinel||function(e,n){var a,o,r,s,l,f;sentinel=(s=Array.isArray,l={},f={},{on:function(e,i){if(i){if(!a){var n=document,t=n.head;n.addEventListener("animationstart",function(e,n,t,i){if(n=f[e.animationName])for(e.stopImmediatePropagation(),t=n.length,i=0;i<t;i++)n[i](e.target)},!0),a=n.createElement("style"),t.insertBefore(a,t.firstChild),o=a.sheet,r=o.cssRules}(s(e)?e:[e]).map(function(e,n,t){(n=l[e])||(t="!"==e[0],l[e]=n=t?e.slice(1):"sentinel-"+Math.random().toString(16).slice(2),r[o.insertRule("@keyframes "+n+"{from{transform:none;}to{transform:none;}}",r.length)]._id=e,t||(r[o.insertRule(e+"{animation-duration:0.0001s;animation-name:"+n+";}",r.length)]._id=e),l[e]=n),(f[n]=f[n]||[]).push(i)})}},off:function(e,a){(s(e)?e:[e]).map(function(e,n,t,i){if(n=l[e]){if(t=f[n],a)for(i=t.length;i--;)t[i]===a&&t.splice(i,1);else t=[];if(!t.length){for(i=r.length;i--;)r[i]._id==e&&o.deleteRule(i);delete l[e],delete f[n]}}})},reset:function(){l={},f={},a&&a.parentNode.removeChild(a),a=0}}),(n=e.createEvent("HTMLEvents")).initEvent?n.initEvent("sentinel-load",!1,!1):n=new Event("sentinel-load"),e.dispatchEvent(n)}(document);

(function() {
    'use strict';

    sentinel.on('#kw:placeholder-shown:not([placeholder=""])', function(el) {
        el.placeholder = ''
    });

     sentinel.on('#index-kw:placeholder-shown:not([placeholder=""])', function(el) {
        el.placeholder = ''
    });

    sentinel.on('.sb_form_placeholder_query', function(el) {
        el.style.display = 'none';
    });

    sentinel.on('#tobPrompt', function(el) {
        // 设置 div 不显示
        el.style.display = 'none';
    });
})();
