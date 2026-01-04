// ==UserScript==
// @name         Flash你妈死了_超星
// @namespace    https://www.zhihu.com/people/qinlili233
// @version      0.1
// @description  强制使用H5播放器播放超星视频
// @author       琴梨梨
// @match      *://*.chaoxing.com/ananas/modules/video/*
// @grant        none
//@run-at document-start

// @downloadURL https://update.greasyfork.org/scripts/397455/Flash%E4%BD%A0%E5%A6%88%E6%AD%BB%E4%BA%86_%E8%B6%85%E6%98%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/397455/Flash%E4%BD%A0%E5%A6%88%E6%AD%BB%E4%BA%86_%E8%B6%85%E6%98%9F.meta.js
// ==/UserScript==



(function(){
  window.frameElement.setAttribute('data',window.frameElement.getAttribute('data').replace(/"danmaku":1/, "\"danmaku\":0"));

})();