// ==UserScript==
// @name         友盟自定义事件显示完整名称
// @namespace    https://www.qicodetech.com/
// @version      0.0.1
// @description  友盟自定义事件显示完整名称，而不是只展示缩略名称
// @author       AbelHu
// @match        https://mobile.umeng.com/platform/*/function/events/dashboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384393/%E5%8F%8B%E7%9B%9F%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%8B%E4%BB%B6%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/384393/%E5%8F%8B%E7%9B%9F%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%8B%E4%BB%B6%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setTimeout(function() {
        var items = document.getElementsByClassName("um-ui-text-stick");
        for (var item of items){
            item.style.cssText="max-width:5000px;"
        }
    }, 2 * 1000)
})();