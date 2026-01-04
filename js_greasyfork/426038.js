// ==UserScript==
// @name                Disable tabs auto close
// @name:zh-CN          禁止标签页自动关闭
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://www.sailboatweb.com
// @version             1.0.0
// @description         Disable tabs auto close event.
// @description:zh-CN   禁止标签页自动关闭的事件。
// @author              pana
// @license             GNU General Public License v3.0 or later
// @match               *://*/*
// @grant               none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/426038/Disable%20tabs%20auto%20close.user.js
// @updateURL https://update.greasyfork.org/scripts/426038/Disable%20tabs%20auto%20close.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.close = () => {
    console.warn('disabled window.close()');
  };
})();
