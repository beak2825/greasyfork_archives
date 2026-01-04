// ==UserScript==
// @name         GitHub.io一键直达仓库
// @namespace    https://viayoo.com/
// @version      1.0
// @description  访问GitHub.io时点击按钮即可直达对应GitHub主页，目前脚本可能不完善。
// @author       孤独散人
// @homepageURL https://ghidgdsr.github.io/test
// @run-at       document-start
// @match        *://*.github.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463318/GitHubio%E4%B8%80%E9%94%AE%E7%9B%B4%E8%BE%BE%E4%BB%93%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/463318/GitHubio%E4%B8%80%E9%94%AE%E7%9B%B4%E8%BE%BE%E4%BB%93%E5%BA%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
  var GitBtn = document.createElement("INPUT");
  GitBtn.setAttribute("type", "button");
  GitBtn.setAttribute("value", "GitHub");
  GitBtn.style.position = "absolute";
  GitBtn.style.right = "0%";
  GitBtn.style.bottom = "0%";
  GitBtn.style.height = "3%";
  GitBtn.style.width = "6%";
  GitBtn.style.border = "none";
  GitBtn.style.color = "#FFFFFF";
   GitBtn.setAttribute("onclick","javascript:url=location.host;url=url.replace('.github.io','');url='https://github.com/'+url+location.pathname;location.replace(url)");
  GitBtn.style.backgroundColor = "#000000";
  document.body.appendChild(GitBtn);
})();