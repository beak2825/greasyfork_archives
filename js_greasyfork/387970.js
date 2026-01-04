// ==UserScript==
// @name 多吉搜索重定向
// @description 重定向多吉未完成的功能到谷歌搜索
// @namespace Violentmonkey Scripts
// @match https://www.dogedoge.com/results
// @require https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @run-at document-body
// @version 0.0.1.20190729044109
// @downloadURL https://update.greasyfork.org/scripts/387970/%E5%A4%9A%E5%90%89%E6%90%9C%E7%B4%A2%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/387970/%E5%A4%9A%E5%90%89%E6%90%9C%E7%B4%A2%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==
(function(){
  var GoogleRoot='https://www.google.com/search?q=';
  var keyword=window.location.search.split('=')[1];
  $("a[data-zci-link='images']").attr('href',GoogleRoot+keyword+'&tbm=isch').attr('target','_blank');
  $("a[data-zci-link='videos']").attr('href',GoogleRoot+keyword+'&tbm=lnms').attr('target','_blank');
  $("a[data-zci-link='news']").attr('href',GoogleRoot+keyword+'&tbm=nws').attr('target','_blank');
})();