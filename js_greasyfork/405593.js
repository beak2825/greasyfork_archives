// ==UserScript==
// @name         iframeを絶対sandoboxにする
// @namespace    https://armedpatriot.blog.fc2.com/
// @version      1.0.1
// @description  iframe要素に設定可能な機能ポリシー(allow)とsandboxをリセットするスクリプトです。
// @author       Patriot
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/405593/iframe%E3%82%92%E7%B5%B6%E5%AF%BEsandobox%E3%81%AB%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/405593/iframe%E3%82%92%E7%B5%B6%E5%AF%BEsandobox%E3%81%AB%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const nodeObserver = new MutationObserver((nodeMutations) => {
        let iframeElements = [];
        const iframeAttributeObserver = new MutationObserver((iframeMutations) => {
            const attributeName = iframeMutations.attributeName;
            if(attributeName == "sandbox" || attributeName == "allow") {
                iframeMutations.target.setAttribute(attributeName, "");
            }
        });

        nodeMutations.addedNodes.forEach((node) => {
            if(node.tagName == "iframe") {
                iframeElements.push(node);
            }
        });

        iframeAttributeObserver.observe(iframeElements, { subTree: true });
    });

    // 現在のDOMにあるiframeをsandboxにする
    document.querySelectorAll("iframe").forEach((iframeElement) => {
        if(iframeElement.hasAttribute("sandbox")) {
            iframeElement.setAttribute("sandbox", "");
        }
        if(iframeElement.hasAttribute("allow")) {
            iframeElement.setAttribute("allow", "");
        }
    });

    // DOMを監視してiframeを絶対sandboxにする
    nodeObserver.observe(document.documentElement, { childList: true, subTree: true });
})();