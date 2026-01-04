// ==UserScript==
// @name         CSDN
// @namespace    https://c332030.github.io
// @version      1.1
// @description  CSDN优化
// @author       c332030
// @match        https://*.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378126/CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/378126/CSDN.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  /*
    自动展开
  */
  try {
    document.getElementById("btn-readmore").click();
  } catch(err) {}

  /*
    自动选择博客分类和博客类型
  */
  try {
    document.getElementById("selType").value = '1';
    document.getElementById("radChl").value = '16';
  } catch(err) {}

})();