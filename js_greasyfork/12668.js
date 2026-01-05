// ==UserScript==
// @name        新标签打开链接
// @author      daysv
// @namespace   http://daysv.github.com
// @description 链接强制在新建标签中打开 Open a URL in background new tab
// @version     0.3.0
// @include     *
// @run-at      document-start
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/12668/%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/12668/%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function (win) {
    win.addEventListener('click', function (e) {
        if (e.target.href && e.target.tagName === 'A' && e.which === 1) {
            e.preventDefault();
            GM_openInTab(e.target.href, true);
        }
    }, true);
})(window);