// ==UserScript==
// @name         Userscript+-- : Show Site All UserJS num 显示适用的UserJS脚本数及跳转
// @name:zh      UserScript+--: 显示适用的UserJS脚本数及跳转
// @name:zh-CN   UserScript+--: 显示适用的UserJS脚本数及跳转
// @name:zh-TW   UserScript+--: 显示適用的UserJS脚本数及跳转
// @namespace    https://github.com/ultranity/Userscript-Plus--
// @version      1.0.0
// @description        在脚本菜单显示适用于当前网站的油猴脚本数及跳转 Show the num of all Tampermonkey scripts for the current site.
// @description:zh      在脚本菜单显示适用于当前网站的油猴脚本数及跳转
// @description:zh-CN   在脚本菜单显示适用于当前网站的油猴脚本数及跳转
// @description:zh-TW   在脚本菜单顯示適用於當前網站的油猴腳本数及跳转
// @author       momoos
// @include        *
// @resource     siteData  https://greasyfork.org/scripts/by-site.json
// @run-at       document-idle
// @noframes
// @grant        GM_xmlHttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        unsafeWindow
// @connect      greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/409727/Userscript%2B--%20%3A%20Show%20Site%20All%20UserJS%20num%20%E6%98%BE%E7%A4%BA%E9%80%82%E7%94%A8%E7%9A%84UserJS%E8%84%9A%E6%9C%AC%E6%95%B0%E5%8F%8A%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/409727/Userscript%2B--%20%3A%20Show%20Site%20All%20UserJS%20num%20%E6%98%BE%E7%A4%BA%E9%80%82%E7%94%A8%E7%9A%84UserJS%E8%84%9A%E6%9C%AC%E6%95%B0%E5%8F%8A%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

/* #eslint-disable no-undef */
(function() {
  'use strict';

  // ==============================参数配置
  let thisDomain =  document.domain.split('.').slice(-2).join('.').toLowerCase();

  // 检查域名对应的脚本数量
  let getDomainCount = function(domain) {
      let siteData = GM_getResourceText('siteData');
      siteData = JSON.parse(siteData);
      let count = 0;
      if (siteData.hasOwnProperty(domain)) {
          count = siteData[domain];
      }
      return count;
  };

  function goGreasyfork() {
      let url = `https://greasyfork.org/zh-CN/scripts/by-site/${thisDomain}?filter_locale=0`;
      GM_openInTab(url, {
          active: true
      });
  }

  function goOpenuserJS() {
      let url = `https://openuserjs.org/?q=${thisDomain}`;
      GM_openInTab(url, {
          active: true
      });
  }
  // END

  // ############### 开始

  // 检查当前域名是否有对应油猴脚本
  let domainCount = getDomainCount(thisDomain);
 // if (domainCount === 0) return;

  GM_registerMenuCommand('Greasyfork:'+domainCount, goGreasyfork); // 设置油猴插件的菜单
  GM_registerMenuCommand('OpenuserJS', goOpenuserJS) // 设置油猴插件的菜单
  // ########
})();
