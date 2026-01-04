// ==UserScript==
// @name         维基百科移动域名自动跳转&自动选择大陆简体
// @version      0.06
// @description  用于维基百科移动域名自动跳转为pc域名并且自动选择大陆简体，选择大陆简体版本仅限于检测到出现多中文版本的时候才会启用
// @namespace    https://greasyfork.org/en/users/30-opsomh
// @include      https://zh.m.wikipedia.org/*
// @include      https://zh.wikipedia.org/*
// @grant        none
// @inject-into  auto
// @run-at       document-start
// @license      暂无
// @downloadURL https://update.greasyfork.org/scripts/445578/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E7%A7%BB%E5%8A%A8%E5%9F%9F%E5%90%8D%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E5%A4%A7%E9%99%86%E7%AE%80%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/445578/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E7%A7%BB%E5%8A%A8%E5%9F%9F%E5%90%8D%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E5%A4%A7%E9%99%86%E7%AE%80%E4%BD%93.meta.js
// ==/UserScript==
var url;
function getStr(str) { //取中间字符
     var res = str.match(new RegExp(`https://zh.(.*?)wikipedia.org/(.*?)/(.*?)$`));
     return res ? res : -1;
 }
urla=getStr(window.location.href)[1];
urlb=getStr(window.location.href)[2];
console.log(urla);
console.log(urlb);
if(urla == `m.` || urlb == `zh-hans` || urlb == `zh`){
    window.stop();
    url=window.location.href.replace(urla, '').replace(/wikipedia.org\/.*?\//, 'wikipedia.org/zh-cn/');
    console.log(url);
    location.assign(url);
}