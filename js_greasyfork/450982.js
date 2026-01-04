// ==UserScript==
// @name            Htp增加序号
// @description     Htp操作步骤和预期结果前增加序号方便对应
// @match           https://htp.hellobike.cn/*
// @version 0.0.1.20220908110454
// @namespace https://greasyfork.org/users/956038
// @downloadURL https://update.greasyfork.org/scripts/450982/Htp%E5%A2%9E%E5%8A%A0%E5%BA%8F%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/450982/Htp%E5%A2%9E%E5%8A%A0%E5%BA%8F%E5%8F%B7.meta.js
// ==/UserScript==

/* jshint esversion:6 */
(function(){
    if (location.hash === '#/task/myTask') {
      const style = document.createElement('style');
      const css20 = [...Array(20)].map((_, idx) => `
      .table-box>.case-ul .second-ul>li:nth-child(6)>span:nth-child(${idx+1})::before,
      .table-box>.case-ul .second-ul>li:nth-child(7)>span:nth-child(${idx+1})::before { 
        content: '${idx+1}. ';
      }`).join('');
      style.appendChild(document.createTextNode(css20));
      document.head.appendChild(style);
    }
})();