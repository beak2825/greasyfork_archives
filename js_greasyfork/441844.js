// ==UserScript==
// @name        meiyouad
// @version      0.1
// @description  为页面添加一个按钮，通过GM_addStyle方法添加css控制按钮的样式为蓝底白字
// @author       examplecode
// @match        www.meiyouad.com
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/889747
// @downloadURL https://update.greasyfork.org/scripts/441844/meiyouad.user.js
// @updateURL https://update.greasyfork.org/scripts/441844/meiyouad.meta.js
// ==/UserScript==

(function() {
    GM_addStyle('.swal2-container.swal2-center.swal2-backdrop-show {display: none !important;}')
})();