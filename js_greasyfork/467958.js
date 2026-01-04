// ==UserScript==
// @name         流水线 通用变量 存储 reversion
// @namespace    http://tampermonkey.net/
// @version      7
// @description  用于公司 流水线 通用变量 存储 reversion
// @author       You
// @match        https://flow.aliyun.com/pipelines/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyun.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467958/%E6%B5%81%E6%B0%B4%E7%BA%BF%20%E9%80%9A%E7%94%A8%E5%8F%98%E9%87%8F%20%E5%AD%98%E5%82%A8%20reversion.user.js
// @updateURL https://update.greasyfork.org/scripts/467958/%E6%B5%81%E6%B0%B4%E7%BA%BF%20%E9%80%9A%E7%94%A8%E5%8F%98%E9%87%8F%20%E5%AD%98%E5%82%A8%20reversion.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function h(e, t) {
        let o = e.value;
        e.value = t;
        let l = new Event("input", { bubbles: !0 });
        l.simulated = !0;
        let n = e._valueTracker;
        if(n) {
            n.setValue(o);
            e.dispatchEvent(l);
        }
    }
    const u = (e, t, o = document) =>
    Array.from(o.querySelectorAll(e)).find((l) => {
        if (!t || (t && t === l.textContent)) return l;
    });

    const versionKey = "user__input__version__" + location.pathname.replace(/\D+/g, "");

    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            const dom = Array.from(mutation.addedNodes);
            if (dom.length > 0 && dom[0]) {
                const input = dom[0].querySelector("#reversion") || dom[0].querySelector("#revision");
                const version = localStorage.getItem(versionKey);
                if (input && version) {
                    h(input, version);
                }

                const okButton = u(
                    ".next-dialog-footer .isTwoToThreeCNCharBtn",
                    "运行",
                    dom[0]
                );

                if (okButton) {
                    okButton.addEventListener("click", () => {
                        const value = input.value;
                        localStorage.setItem(versionKey, value);
                    });
                }

                const cancelButton = u(
                    ".next-dialog-footer .isTwoToThreeCNCharBtn",
                    "取消",
                    dom[0]
                );

                if (cancelButton) {
                    cancelButton.addEventListener("click", () => {
                        const value = input.value;
                        localStorage.setItem(versionKey, value);
                    });
                }
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();