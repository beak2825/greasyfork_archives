// ==UserScript==
// @name         SexInSex自动点击支持楼主(by某作者）
// @namespace    sexinsex.phygelus.first
// @version      0.1
// @description  自动点击SexInSex的支持楼主按钮
// @author       phygelus
// @match        http*://*.sexinsex.net/*/thread-*
// @match        http*://*.sexinsex.net/*/viewthread*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT License  //共享规则
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/513687/SexInSex%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%94%AF%E6%8C%81%E6%A5%BC%E4%B8%BB%28by%E6%9F%90%E4%BD%9C%E8%80%85%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/513687/SexInSex%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%94%AF%E6%8C%81%E6%A5%BC%E4%B8%BB%28by%E6%9F%90%E4%BD%9C%E8%80%85%EF%BC%89.meta.js
// ==/UserScript==


// 代码开始
(function() {

  /*自动点击支持楼主*/
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var tid = urlParams.get('tid');
  if (tid == null) {
      var sd_href=window.location.href;
      tid = sd_href.substring(sd_href.indexOf('-')+1,sd_href.indexOf('-',sd_href.indexOf('-')+1));
  };
  ajaxget('thanks.php?tid='+tid, 'thanksdiv');

})();

