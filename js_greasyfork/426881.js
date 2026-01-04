// ==UserScript==
// @name okfree下载助手
// @namespace https://www.okfree.men
// @description 提取okfree音声下载链接
// @match *://www.okfree.men/file-*.html
// @version 0.0.1.20210522174633
// @downloadURL https://update.greasyfork.org/scripts/426881/okfree%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/426881/okfree%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
!function () {
  'use strict';
  const result = document.querySelector('.file_item').innerHTML.match(/soundFile: "(.+?)"/);
  if (result != null && result.length > 1) {
    document.getElementById('f_view').value = result[1];
  }
}();