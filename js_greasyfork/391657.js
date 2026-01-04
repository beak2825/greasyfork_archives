// ==UserScript==
// @name         自定义字体为云林黑体并加阴影
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  效果比较满意了
// @subaobao_ok
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/391657/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AD%97%E4%BD%93%E4%B8%BA%E4%BA%91%E6%9E%97%E9%BB%91%E4%BD%93%E5%B9%B6%E5%8A%A0%E9%98%B4%E5%BD%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/391657/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AD%97%E4%BD%93%E4%B8%BA%E4%BA%91%E6%9E%97%E9%BB%91%E4%BD%93%E5%B9%B6%E5%8A%A0%E9%98%B4%E5%BD%B1.meta.js
// ==/UserScript==

(
    function()
    {
    'use strict';
    GM_addStyle("body,input,button,select,textarea{font:12px'云林黑体'!important;}");
    document.getElementsByTagName('body')[0].style.textShadow = '0.03em 0.03em 0.03em #666666';
    }
)();