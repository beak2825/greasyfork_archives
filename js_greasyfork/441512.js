// ==UserScript==
// @name         谷歌搜索免重定向打开链接
// @namespace    https://github.com/vicrack/
// @version      0.1.1
// @description  谷歌搜索免重定向打开链接, 网址直达加快打开速度, 采用模糊匹配谷歌搜索的网址
// @author       https://greasyfork.org/zh-CN/users/306433
// @supportURL   https://greasyfork.org/zh-CN/users/306433
// @homepageURL  https://greasyfork.org/zh-CN/users/306433
// @match        *://*/search?q=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441512/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E5%85%8D%E9%87%8D%E5%AE%9A%E5%90%91%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/441512/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E5%85%8D%E9%87%8D%E5%AE%9A%E5%90%91%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
    "use strict";

    if ((document.title && document.title.includes(" - Google ")) || document.querySelector("img[alt='Google']") != null || document.getElementById("gsr") != null) {
        let fake = function () {
            return true;
        };

        let handle = function (link) {
            if (window.rwt && window.rwt != fake) {
                delete window.rwt;
                Object.defineProperty(window, "rwt", { value: fake, writable: false });
            }

            if (link.hasAttribute("onmousedown")) {
                link.removeAttribute("onmousedown");
                link.setAttribute("target", "_blank");
            }
            
            // 避免泄露来源
            let rel = link.getAttribute("rel");
            if (rel != null) {
                if (!rel.includes("noreferrer")) {
                    link.setAttribute("rel", rel + " noreferrer");
                }
            } else {
                link.setAttribute("rel", "noreferrer");
            }
            // image jsaction="J9iaEb;mousedown:npT2md; touchstart:npT2md;"
        };

        const mutationObserver = new MutationObserver((mutationsList, observer) => {
            mutationsList.forEach((mutation) => {
                const newNodes = mutation.addedNodes;
                newNodes.forEach((node) => {
                    let links = node.getElementsByTagName("a");
                    for (let i = 0; i < links.length; ++i) {
                        handle(links[i]);
                    }
                });
            });
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        var links = document.getElementsByTagName("a");
        for (var i = 0; i < links.length; ++i) {
            handle(links[i]);
        }
    }
})();
