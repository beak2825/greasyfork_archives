// ==UserScript==
// @name                福利吧论坛页面替换为按发帖时间排序
// @namespace           dadaewqq
// @version             3.7
// @author              https://github.com/dadaewqq/fun
// @description         直接替换链接而不是二次跳转（适配新论坛链接），去掉了广告区
// @match               https://www.wnflb99.com/*
// @match               https://www.wnflb2023.com/*
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/455873/%E7%A6%8F%E5%88%A9%E5%90%A7%E8%AE%BA%E5%9D%9B%E9%A1%B5%E9%9D%A2%E6%9B%BF%E6%8D%A2%E4%B8%BA%E6%8C%89%E5%8F%91%E5%B8%96%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/455873/%E7%A6%8F%E5%88%A9%E5%90%A7%E8%AE%BA%E5%9D%9B%E9%A1%B5%E9%9D%A2%E6%9B%BF%E6%8D%A2%E4%B8%BA%E6%8C%89%E5%8F%91%E5%B8%96%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var all = document.querySelectorAll('[href^="https://www.wnflb2023.com/forum-"], [href^="forum-"]');
  var num = all.length;
  for (var i = 0; i < num; i++) {
    var fid = all[i].href.split("-")[1];
    var newhref = "forum.php?mod=forumdisplay&fid=" + fid + "&filter=author&orderby=dateline";
    all[i].href = newhref;
  }

  document.querySelector(".wp.cl").style.display = "none";
})();
