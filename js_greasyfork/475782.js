// ==UserScript==
// @name         bilbili使得edge浏览器从搜索引擎进入时能自动跳转到播放页
// @description  点击搜索引擎出现的b站页面时能够直接进入视频详情页
// @version      0.4
// @namespace  youfeng1024
// @match      https://www.bilibili.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475782/bilbili%E4%BD%BF%E5%BE%97edge%E6%B5%8F%E8%A7%88%E5%99%A8%E4%BB%8E%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%BF%9B%E5%85%A5%E6%97%B6%E8%83%BD%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%92%AD%E6%94%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/475782/bilbili%E4%BD%BF%E5%BE%97edge%E6%B5%8F%E8%A7%88%E5%99%A8%E4%BB%8E%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%BF%9B%E5%85%A5%E6%97%B6%E8%83%BD%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%92%AD%E6%94%BE%E9%A1%B5.meta.js
// ==/UserScript==

var url = new URL(location.href);  
if(url.searchParams.has("bvid")) //例子https://www.bilibili.com/?bvid=BV{bv号}&spm_id_from=123.12
{
    window.stop();// 停止加载当前页面
    url.pathname = '/video/' + url.searchParams.get('bvid') + '/';
    url.searchParams.delete('bvid');
    location.replace(url.href);  //先链接https://www.bilibili.com/video/BV123456&spm_id_from=123.12
}

if(url.searchParams.has("aid")) //例子https://www.bilibili.com/?aid=123456&spm_id_from=123.12
{
    window.stop();// 停止加载当前页面
    url.pathname = '/video/' + 'av' + url.searchParams.get('aid') + '/';
    url.searchParams.delete('aid');
    location.replace(url.href);  
}