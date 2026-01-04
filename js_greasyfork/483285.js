// ==UserScript==
// @name        有手就行的页面字符统计工具
// @namespace   Violentmonkey Scripts
// @grant       GM_addStyle
// @require     https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @match       *://*/*
// @license     AGPL-2.0-or-later
// @version     1.1
// @author      猎隼丶止戈
// @description 2023/12/28 12:37:19
// @downloadURL https://update.greasyfork.org/scripts/483285/%E6%9C%89%E6%89%8B%E5%B0%B1%E8%A1%8C%E7%9A%84%E9%A1%B5%E9%9D%A2%E5%AD%97%E7%AC%A6%E7%BB%9F%E8%AE%A1%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/483285/%E6%9C%89%E6%89%8B%E5%B0%B1%E8%A1%8C%E7%9A%84%E9%A1%B5%E9%9D%A2%E5%AD%97%E7%AC%A6%E7%BB%9F%E8%AE%A1%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function () {
    'use strict';

    GM_addStyle('div.char-count{position: fixed;bottom: 5px;right: 5px;background: #e2e3e9;width: 100px;} div.char-count ul{margin: 5px;list-style: none;}');

    function countWords(str) {
      const chinese = Array.from(str).filter(ch => /[\u4e00-\u9fa5]/.test(ch)).length;
      const english = Array.from(str).filter(ch => /[a-zA-Z]/.test(ch)).length;
      const num = Array.from(str).filter(ch => /\d/.test(ch)).length;
      return {'cn': chinese, 'en': english, 'num': num};
    }

    $(function() {
      let text = $('body').text().replaceAll(/\t|\r|\n|\s/g, '');
      let script = $('script').text().replaceAll(/\t|\r|\n|\s/g, '');
      let content = text.replaceAll(script, '')
      let countObj = countWords(content);
      $('script').before(`<div class="char-count"><div>有手就行！</div><ul><li>中文：${countObj.cn}</li><li>英文：${countObj.en}</li><li>数字：${countObj.num}</li><ul></div>`);
    });
})();