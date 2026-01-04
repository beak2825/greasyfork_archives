// ==UserScript==
// @name         直播吧a标签添加title
// @namespace    jrkan
// @version      0.1
// @description  a标签添加title，不用点击进入详情即可查看完整标题
// @author       ss
// @match        https://www.zhibo8.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466415/%E7%9B%B4%E6%92%AD%E5%90%A7a%E6%A0%87%E7%AD%BE%E6%B7%BB%E5%8A%A0title.user.js
// @updateURL https://update.greasyfork.org/scripts/466415/%E7%9B%B4%E6%92%AD%E5%90%A7a%E6%A0%87%E7%AD%BE%E6%B7%BB%E5%8A%A0title.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var links = document.getElementsByTagName("a");

    for(var i = 0; i < links.length; i++) {
      var link = links[i];
      link.title = link.innerHTML;
    }
})();