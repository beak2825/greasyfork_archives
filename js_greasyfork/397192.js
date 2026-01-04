// ==UserScript==
// @name         修正ant.design、CSDN、百度知道、简书、慕课网、知乎、猿问、微信开发、w3cschool、html中文网网站的字颜色太淡的问题
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  修正一些网站的字颜色太淡看久了会伤眼睛的问题。为了更好的上网体验，不兼容低版本浏览器和IE浏览器。大家如有发现一些网站的文字颜色淡，请点击页面上的反馈按钮把网站信息提交上去，我会更新脚本，谢谢。
// @author       You
// @match        *://www.w3cschool.cn/*
// @match        *://developers.weixin.qq.com/*
// @match        *.zhihu.com/*
// @match        *://www.imooc.com/*
// @match        *://www.html.cn/*
// @match        *www.jianshu.com/*
// @match        *zhidao.baidu.com/question/*
// @match        *opt2.uletm.com/*
// @match        *m.imooc.com/wenda/*
// @match        *blog.csdn.net/*
// @match        *://mobile.ant.design/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397192/%E4%BF%AE%E6%AD%A3antdesign%E3%80%81CSDN%E3%80%81%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%81%E6%85%95%E8%AF%BE%E7%BD%91%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81%E7%8C%BF%E9%97%AE%E3%80%81%E5%BE%AE%E4%BF%A1%E5%BC%80%E5%8F%91%E3%80%81w3cschool%E3%80%81html%E4%B8%AD%E6%96%87%E7%BD%91%E7%BD%91%E7%AB%99%E7%9A%84%E5%AD%97%E9%A2%9C%E8%89%B2%E5%A4%AA%E6%B7%A1%E7%9A%84%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/397192/%E4%BF%AE%E6%AD%A3antdesign%E3%80%81CSDN%E3%80%81%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%81%E6%85%95%E8%AF%BE%E7%BD%91%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81%E7%8C%BF%E9%97%AE%E3%80%81%E5%BE%AE%E4%BF%A1%E5%BC%80%E5%8F%91%E3%80%81w3cschool%E3%80%81html%E4%B8%AD%E6%96%87%E7%BD%91%E7%BD%91%E7%AB%99%E7%9A%84%E5%AD%97%E9%A2%9C%E8%89%B2%E5%A4%AA%E6%B7%A1%E7%9A%84%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const d=document.createDocumentFragment();
    const s = document.createElement('style');
    s.innerHTML='body, .content-intro, .htmledit_views, .bd-wrap, .q-content, .wgt-best, .aside-container, #qb-side{font-family:"Microsoft YaHei"!important}'
    d.appendChild(s);
    document.head.appendChild(d);
})();