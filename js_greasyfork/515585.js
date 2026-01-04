// ==UserScript==
// @name         icoremail.net 校园邮箱自动选择域名
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动选择你学校的域名免除烦恼，默认为 xiaoyou.hust.edu.cn，请按需修改脚本
// @author       Ryan
// @match        https://edu.icoremail.net/coremail/index.jsp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icoremail.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515585/icoremailnet%20%E6%A0%A1%E5%9B%AD%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E5%9F%9F%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/515585/icoremailnet%20%E6%A0%A1%E5%9B%AD%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E5%9F%9F%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const domain = 'xiaoyou.hust.edu.cn';

    function setDomain() {
        const m = document.querySelector(`[data-id="${domain}"]`);
        if (m) {
            m.click();
            return true;
        }
        return false; // Element not found
    }

    // Initial attempt to set domain
    if (!setDomain()) {
        // If element is not found, use MutationObserver to monitor changes
        const observer = new MutationObserver((mutationsList, observer) => {
            if (setDomain()) {
                observer.disconnect(); // Stop observing once the element is found and updated
            }
        });

        // Start observing the document for added nodes
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
