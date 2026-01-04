// ==UserScript==
// @namespace    y7Greasy
// @name         去除百家号聚合框
// @description  百度搜索时去除百家号聚合信息框
// @version      0.0.0.1
// @grant        none
// @author       y7
// @license         MIT
// @create          2019-04-09
// @connect         www.baidu.com
// @include         *://ipv6.baidu.com/*
// @include         *://www.baidu.com/*
// @include         *://m.baidu.com/*
// @include         *://xueshu.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/381557/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%AE%B6%E5%8F%B7%E8%81%9A%E5%90%88%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/381557/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%AE%B6%E5%8F%B7%E8%81%9A%E5%90%88%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var divTpl = getElementByAttr("div","tpl","sp_realtime_bigpic5")[0];
    if(divTpl)
        divTpl.style.display = "none";

    function getElementByAttr(tag,attr,value)
    {
        var aElements=document.getElementsByTagName(tag);
        var aEle=[];
        for(var i=0;i<aElements.length;i++)
        {
            if(aElements[i].getAttribute(attr)==value)
                aEle.push( aElements[i] );
        }
        return aEle;
    }
})();