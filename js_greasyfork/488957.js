// ==UserScript==
// @name         Shadertoy Pager
// @name:zh-CN   Shadertoy 翻页器
// @namespace    http://tampermonkey.net/
// @version      2024-03-04
// @description  Make Shadertoy browsing easier.
// @description:zh-CN  使 Shadertoy 浏览更轻松
// @author       lixiaolin94
// @match        https://www.shadertoy.com/results*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shadertoy.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488957/Shadertoy%20Pager.user.js
// @updateURL https://update.greasyfork.org/scripts/488957/Shadertoy%20Pager.meta.js
// ==/UserScript==

(function () {
  'use strict';
  document.addEventListener('keydown', function (e) {
    if (e.keyCode === 37) { // 左键
      const currentPage = parseInt(getParameterByName('from'));
      if (currentPage > 0) {
        const previousPage = currentPage - 12;
        window.location.href = window.location.href.replace('from=' + currentPage, 'from=' + previousPage);
      }
    } else if (e.keyCode === 39) { // 右键
      const currentPage = parseInt(getParameterByName('from'));
      const nextPage = currentPage + 12;
      window.location.href = window.location.href.replace('from=' + currentPage, 'from=' + nextPage);
    }
  });

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
})();