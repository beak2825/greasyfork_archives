// ==UserScript==
// @name         自动重定向
// @namespace    http://tampermonkey.net/
// @version      4.0.3
// @description  替换重定向的链接
// @author       share121
// @match        *://*/*
// @run-at       document-start
// @license      MIT
// @connect      *
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/459130/%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/459130/%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(() => {
    let changAttr = (() => {
        let finalUrls = new Set(),
            fetchUrls = [];
        return (ele, attr) => {
            try {
                let attrOldVal = ele.getAttribute(attr);
                if (attrOldVal) {
                    if (
                        !finalUrls.has(attrOldVal) &&
                        !fetchUrls.includes(attrOldVal)
                    ) {
                        fetchUrls.push(attrOldVal);
                        GM_xmlhttpRequest({
                            method: "HEAD",
                            url: new URL(attrOldVal, location.href).toString(),
                            onload(response) {
                                if (attrOldVal === ele.getAttribute(attr)) {
                                    if (
                                        new URL(response.finalUrl).host !==
                                        new URL(attrOldVal, location.href).host
                                    ) {
                                        finalUrls.add(response.finalUrl);
                                        ele.setAttribute(
                                            attr,
                                            response.finalUrl
                                        );
                                    } else {
                                        finalUrls.add(attrOldVal);
                                    }
                                }
                                fetchUrls = fetchUrls.filter(
                                    (e) => e !== attrOldVal
                                );
                            },
                            onerror() {
                                fetchUrls = fetchUrls.filter(
                                    (e) => e !== attrOldVal
                                );
                            },
                            onabort() {
                                fetchUrls = fetchUrls.filter(
                                    (e) => e !== attrOldVal
                                );
                            },
                        });
                    }
                }
            } catch { }
        };
    })();
    new MutationObserver((mutationList) => {
        mutationList.forEach((e) => {
            if (e.type === "attributes") {
                changAttr(e.target, e.attributeName);
            } else {
                e.addedNodes.forEach((ele) => {
                    try {
                        [ele, ...ele.querySelectorAll("*")].forEach((ele) => {
                            changAttr(ele, "href");
                            changAttr(ele, "src");
                        });
                    } catch { }
                });
            }
        });
    }).observe(document, {
        subtree: true,
        childList: true,
        attributeFilter: ["href", "src"],
    });
    window.addEventListener("mouseover", (e) => {
        let ele = e.target;
        while (ele !== document) {
            changAttr(e.target, "href");
            changAttr(e.target, "src");
            ele = ele.parentNode;
        }
    });
    window.addEventListener("touchstart", (e) => {
        let ele = e.target;
        while (ele !== document) {
            changAttr(e.target, "href");
            changAttr(e.target, "src");
            ele = ele.parentNode;
        }
    });
    document.querySelectorAll("*").forEach((e) => {
        changAttr(e, "href");
        changAttr(e, "src");
    });
})();
