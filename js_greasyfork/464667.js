// ==UserScript==
// @name         new Bing 样式美化
// @namespace    https://www.bing.com/
// @version      0.3
// @description  让newbing的界面更人性化
// @author       You
// @match        *://www.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/464667/new%20Bing%20%E6%A0%B7%E5%BC%8F%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/464667/new%20Bing%20%E6%A0%B7%E5%BC%8F%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setInterval(() => {
        if (document.getElementsByTagName("cib-serp").length > 0) {
            const pops = document.getElementsByTagName("cib-serp")[0].shadowRoot.getRootNode().getElementById("cib-conversation-main").shadowRoot.getRootNode().getElementById("cib-chat-main").children
            // console.log("pops", pops)
            for (let pop of pops) {
                if (pop.tagName === "CIB-CHAT-TURN") {
                    const children = pop.shadowRoot.getRootNode().children
                    for (let child of children) {
                        if (child.tagName === "CIB-MESSAGE-GROUP") {
                            if (child.getAttribute("source") === "user") {
                                const textBlock = child.shadowRoot.getRootNode().children[0].shadowRoot.getRootNode().children[0].children[0]
                                textBlock.style.whiteSpace = "break-spaces"
                            } else {
                                const blocks = child.shadowRoot.getRootNode().children
                                for (let block of blocks) {
                                    if (block.getAttribute("type") === "text") {
                                        for (let messageBolck of block.shadowRoot.getRootNode().children) {
                                            if (messageBolck.tagName === "CIB-SHARED") {
                                                const textBlock = messageBolck.children[0]
                                                textBlock.style.whiteSpace = "break-spaces"
                                                const sups = textBlock.getElementsByTagName("sup")
                                                for (let sup of sups) {
                                                    sup.style.userSelect = "none"
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, 1000);
})();