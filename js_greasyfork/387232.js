// ==UserScript==
// @name         强制神木林(林子堂)为中文界面
// @namespace    smlin
// @version      0.6
// @description  强制神木林(林子堂)为中文界面，如果有新网址及时反馈
// @author       XXX
// @include        *://23.99.118.146/smloft/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387232/%E5%BC%BA%E5%88%B6%E7%A5%9E%E6%9C%A8%E6%9E%97%28%E6%9E%97%E5%AD%90%E5%A0%82%29%E4%B8%BA%E4%B8%AD%E6%96%87%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/387232/%E5%BC%BA%E5%88%B6%E7%A5%9E%E6%9C%A8%E6%9E%97%28%E6%9E%97%E5%AD%90%E5%A0%82%29%E4%B8%BA%E4%B8%AD%E6%96%87%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

var srcs = document.links;
var i
var joiner

for (i=0; i<srcs.length; i++)
{
    if ((!srcs[i].href.includes("javascript"))&&(!srcs[i].href.includes("lang=zh-cn")))
    {
        joiner=srcs[i].href.includes("?")?"&":"?"
        srcs[i].href = srcs[i].href+joiner+'lang=zh-cn';
    }
}

//first time visit it
if (!window.location.href.includes("lang=zh-cn"))
{
    joiner=window.location.href.includes("?")?"&":"?"
    window.location.href=window.location.href+joiner+'lang=zh-cn'
}