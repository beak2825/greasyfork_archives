// ==UserScript==
// @name         南昌大学 iptv 多开脚本
// @description  一键多开
// @version      0.1.0
// @author       Viki (or vikiboss) (https://github.com/vikiboss)
// @create       2020/12/4
// @lastmodified 2020/12/4
// @feedback-url https://github.com/Vikiboss/ncu-iptv-script/issues
// @github       https://github.com/vikiboss/ncu-iptv-script
// @namespace    ncu-iptv-script
// @license      MIT
// @run-at       document-end
// @grant        none
// @include      *://wyjx.ncu.edu.cn/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/425278/%E5%8D%97%E6%98%8C%E5%A4%A7%E5%AD%A6%20iptv%20%E5%A4%9A%E5%BC%80%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/425278/%E5%8D%97%E6%98%8C%E5%A4%A7%E5%AD%A6%20iptv%20%E5%A4%9A%E5%BC%80%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var userDiv = $(".user-tools")[0];
  userDiv.style.width = "480px";

  var box = $("<button>多开</button>")[0];
  box.style.width = "60px";
  box.style.height = "20px";
  box.style.border = "1px solid #3af";
  box.style.marginLeft = "12px";
  box.style.borderRadius = "3px";

  const url = "http://wyjx.ncu.edu.cn/SPM/PC/themes/default/live.aspx";
  var ids = [4, 46, 47, 6, 41, 48, 49, 12, 8, 13, 14, 22, 2];

  box.onclick = () => {
    for (const id of ids) window.open(`${url}?id=${id}`);
  };

  userDiv.append(box);
})();
