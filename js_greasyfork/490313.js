// ==UserScript==
// @name         新标签打开第三方链接，当前标签打开第一方链接
// @version      1.3
// @author       ChatGPT
// @description  新标签打开第三方链接，当前标签打开第一方链接。
// @match        *://*/*
// @run-at       document-end
// @namespace    https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/490313/%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E7%AC%AC%E4%B8%89%E6%96%B9%E9%93%BE%E6%8E%A5%EF%BC%8C%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E7%AC%AC%E4%B8%80%E6%96%B9%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/490313/%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E7%AC%AC%E4%B8%89%E6%96%B9%E9%93%BE%E6%8E%A5%EF%BC%8C%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E7%AC%AC%E4%B8%80%E6%96%B9%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

function handleLinks() {
    const currentDomain = window.location.hostname;

    // 处理外部链接
    document.querySelectorAll('a').forEach(link => {
        if (link.href.startsWith("http") && new URL(link.href).hostname !== currentDomain) {
            link.setAttribute('target', '_blank');
        } else {
            link.setAttribute('target', '_self');
        }
    });

    // 处理内部链接
    document.querySelectorAll('a[href^="/"]').forEach(link => {
        link.setAttribute('target', '_self');
    });
}

// 执行函数
handleLinks();

(function() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(addedNode => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        handleLinks();
                    }
                });
            }
        });
    });

    const config = { childList: true, subtree: true };

    observer.observe(document.body, config);
})();
