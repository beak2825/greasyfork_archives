// ==UserScript==
// @name         所有链接在新标签页打开（智能排除登录页面）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  智能判断并强制普通链接在新标签页打开，避免登录异常等问题。
// @match        *://*/*
// @grant        none
// @license      MIT
// @author       rmj7yc
// @downloadURL https://update.greasyfork.org/scripts/542691/%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%EF%BC%88%E6%99%BA%E8%83%BD%E6%8E%92%E9%99%A4%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542691/%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%EF%BC%88%E6%99%BA%E8%83%BD%E6%8E%92%E9%99%A4%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function shouldSkip(link) {
        const href = link.getAttribute('href');

        if (!href) return true;

        
        if (href.startsWith('javascript:')) return true;

       
        if (link.getAttribute('target') === '_self') return true;

       
        if (link.hasAttribute('onclick')) return true;

        
        const skipKeywords = ['login', 'logout', 'sign-in', 'signin', 'signout', 'btn-submit'];
        const classId = (link.className + ' ' + link.id).toLowerCase();

        if (skipKeywords.some(keyword => classId.includes(keyword))) return true;

        return false;
    }

    function setLinksTargetBlank() {
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            if (!shouldSkip(link)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    
    setLinksTargetBlank();

   
    const observer = new MutationObserver(() => {
        setLinksTargetBlank();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
