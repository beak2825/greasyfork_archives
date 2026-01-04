// ==UserScript==
// @name                天翼云盘 - 复制"文件分享"的访问码
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://www.sailboatweb.com
// @version             1.0.1
// @description         处理由于缺少 Flash 而导致的在"文件分享"里复制访问码失效的问题
// @author              pana
// @license             GNU General Public License v3.0 or later
// @match               *://cloud.189.cn/main.action
// @icon                https://cloud.189.cn/logo.ico
// @require             https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @grant               GM_setClipboard
// @compatible          chrome
// @compatible          firefox
// @downloadURL https://update.greasyfork.org/scripts/424202/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%20-%20%E5%A4%8D%E5%88%B6%22%E6%96%87%E4%BB%B6%E5%88%86%E4%BA%AB%22%E7%9A%84%E8%AE%BF%E9%97%AE%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/424202/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%20-%20%E5%A4%8D%E5%88%B6%22%E6%96%87%E4%BB%B6%E5%88%86%E4%BA%AB%22%E7%9A%84%E8%AE%BF%E9%97%AE%E7%A0%81.meta.js
// ==/UserScript==

(function () {
  'use strict';
  /* global GM_setClipboard, application */

  function myShowTips(type, message = '') {
    if (typeof application === 'object' && typeof application.showNotify === 'function') {
      application.showNotify({
        type,
        message,
      });
    } else {
      alert(message);
    }
  }

  function myCopyText(content = '') {
    if (content) {
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(content, 'text');
        myShowTips('success', '复制成功');
      } else {
        navigator.clipboard
          .writeText(content)
          .then(() => {
            myShowTips('success', '复制成功');
          })
          .catch(err => {
            console.error(err);
            myShowTips('error', '复制失败');
          });
      }
    } else {
      myShowTips('error', '内容为空');
    }
  }

  document.arrive('.JC_CopyShareCode', ele => {
    ele.addEventListener('click', e => {
      e.stopPropagation();
      myCopyText(e.target.dataset.clipboardText);
      return false;
    });
  });
})();
