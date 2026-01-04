// ==UserScript==
// @name         破解超星作业和考试编辑器粘贴限制
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       fcwys
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   safari
// @description  破解超星作业和考试编辑器粘贴限制,基于https://github.com/zxf1023818103/enable-chaoxing-editor-paste修改而来。
// @license      MIT
// @match        *://mooc1*.chaoxing.com/mooc-ans/work/doHomeWorkNew*
// @match        *://mooc1*.chaoxing.com/mooc-ans/mooc2/work/dowork*
// @match        *://mooc1*.chaoxing.com/exam-ans/exam/test/reVersionTestStartNew*
// @match        *://mooc1*.chaoxing.com/work/doHomeWorkNew*
// @match        *://mooc1*.chaoxing.com/exam/test/reVersionTestStartNew*
// @grant        auto
// @downloadURL https://update.greasyfork.org/scripts/398649/%E7%A0%B4%E8%A7%A3%E8%B6%85%E6%98%9F%E4%BD%9C%E4%B8%9A%E5%92%8C%E8%80%83%E8%AF%95%E7%BC%96%E8%BE%91%E5%99%A8%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/398649/%E7%A0%B4%E8%A7%A3%E8%B6%85%E6%98%9F%E4%BD%9C%E4%B8%9A%E5%92%8C%E8%80%83%E8%AF%95%E7%BC%96%E8%BE%91%E5%99%A8%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

var isFuck=false;
function pasteOK(){
  for (var editorName in UE.instants) { UE.instants[editorName].__allListeners.beforepaste = null }
  isFuck=true;
}

(function() {
  /*定时器轮询解决新版考试界面无效问题*/
  var pTimer=setInterval(function(){
    isFuck||pasteOK();
    isFuck&&clearInterval(pTimer);
  }, 500)
})();
