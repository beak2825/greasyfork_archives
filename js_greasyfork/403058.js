// ==UserScript==
// @name 思迅天店运营平台美化
// @namespace MoeHero
// @version 0.1
// @description 天店运营平台美化
// @run-at document-end
// @match *://admin.td365.com.cn/*
// @require http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/403058/%E6%80%9D%E8%BF%85%E5%A4%A9%E5%BA%97%E8%BF%90%E8%90%A5%E5%B9%B3%E5%8F%B0%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/403058/%E6%80%9D%E8%BF%85%E5%A4%A9%E5%BA%97%E8%BF%90%E8%90%A5%E5%B9%B3%E5%8F%B0%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

var J = jQuery.noConflict(true);

if(location.pathname.startsWith('/Account/Login')) {
  J('#CompanyCode').val('106719');
  J('#UserName').val('100001');
  J('#Password').val('123456');
  setTimeout(() => {
    J('button').click();
  }, 0);
}
