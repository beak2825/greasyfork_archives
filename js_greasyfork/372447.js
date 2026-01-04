// ==UserScript==
// @name         copyright
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  修改为仅仅去除所有网站复制带来的小尾巴数据、破解复制权限
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372447/copyright.user.js
// @updateURL https://update.greasyfork.org/scripts/372447/copyright.meta.js
// ==/UserScript==

(function () {
  'use strict';

  [].slice.call(document.getElementsByTagName('*')).forEach((ele) => {
    ele.addEventListener("copy", function (t) {
      t.clipboardData.setData("text", getMySelection())
      t.preventDefault()
    })
  })

  function getMySelection() {
    let e = window.getSelection().getRangeAt(0).cloneContents().textContent
    return e
  }
  // M.copyright.config = {}
  // csdn.copyright.init($("article")[0], '', '');
  // let host = window.location.host
  // if (host === 'blog.csdn.net') {
  //  document.getElementById('btn-readmore').click()
  // }
})();