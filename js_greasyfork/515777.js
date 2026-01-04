// ==UserScript==
// @name         B站评论选中修复
// @name:en      Bilibili Comment Selection Fix
// @description  让评论的选中复制更容易，通过重载三击事件实现
// @description:en   Make it easier to select and copy comments by reloading the triple-click event.
// @author       remarry
// @license      MIT
// @version      0.1.2
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    https://greasyfork.org/en/users/1391145-remarry
// @supportURL   https://greasyfork.org/en/scripts/515777-b%E7%AB%99%E8%AF%84%E8%AE%BA%E9%80%89%E4%B8%AD%E4%BF%AE%E5%A4%8D/feedback
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/515777/B%E7%AB%99%E8%AF%84%E8%AE%BA%E9%80%89%E4%B8%AD%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/515777/B%E7%AB%99%E8%AF%84%E8%AE%BA%E9%80%89%E4%B8%AD%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

"use strict";
(() => {
    function getRootComment(threadRenderer) {
        const commentRenderer = threadRenderer.shadowRoot?.querySelector("bili-comment-renderer") ??
            void 0;
        if (commentRenderer === void 0) {
            return void 0;
        }
        const richText = commentRenderer.shadowRoot?.querySelector("bili-rich-text") ??
            void 0;
        if (richText === void 0) {
            return void 0;
        }
        const contents = richText.shadowRoot?.querySelector("#contents") ?? void 0;
        return contents;
    }
    function* getReplies(threadRenderer) {
        const repliesElement = threadRenderer?.shadowRoot?.querySelector("#replies") ?? void 0;
        if (repliesElement !== void 0) {
            const replyRenderers = repliesElement
                ?.querySelector("bili-comment-replies-renderer")
                ?.shadowRoot?.querySelectorAll("bili-comment-reply-renderer") ?? void 0;
            if (replyRenderers !== void 0) {
                for (const replyRenderer of replyRenderers) {
                    const replyContentSelector = replyRenderer?.shadowRoot
                        ?.querySelector("bili-rich-text")
                        ?.shadowRoot?.querySelector("#contents") ?? void 0;
                    if (replyContentSelector !== void 0) {
                        yield replyContentSelector;
                    }
                }
            }
        }
    }
    class Stream {
        constructor(iterable) {
            this.iterator = iterable[Symbol.iterator]();
        }
        forEach(operation) {
            for (let item = this.iterator.next(); !item.done; item = this.iterator.next()) {
                operation(item.value);
            }
        }
        filter(predicate) {
            const self = this;
            return new Stream({
                [Symbol.iterator]: function* () {
                    for (let item = self.iterator.next(); !item.done; item = self.iterator.next()) {
                        if (predicate(item.value)) {
                            yield item.value;
                        }
                    }
                },
            });
        }
        [Symbol.iterator]() {
            return this.iterator;
        }
    }
    function* getAllCommentsAndReplies() {
        const biliComments = document.querySelector("bili-comments");
        if (biliComments !== null && biliComments.shadowRoot) {
            const threadRenderers = biliComments.shadowRoot.querySelectorAll("bili-comment-thread-renderer");
            for (const threadRenderer of threadRenderers) {
                const rootComment = getRootComment(threadRenderer);
                if (rootComment !== void 0) {
                    const replies = getReplies(threadRenderer);
                    yield {
                        root: rootComment,
                        replies: replies,
                    };
                }
            }
        }
    }
    function processComments() {
        const predicate = (element) => element instanceof HTMLElement;
        new Stream(getAllCommentsAndReplies()).forEach((comments) => {
            const root_comment = comments.root;
            if (predicate(root_comment)) {
                addTripleClickEvent(root_comment);
            }
            new Stream(comments.replies)
                .filter(predicate)
                .forEach((reply) => addTripleClickEvent(reply));
        });
    }
    const tripleClickRegisteredAttr = "triple-click-registered";
    function isTripleClickEventRegistered(element) {
        return element.getAttribute(tripleClickRegisteredAttr) === "true";
    }
    function addTripleClickEvent(element) {
        function handle(event) {
            if (event.detail === 3) {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(element);
                if (selection !== null) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }
        if (!isTripleClickEventRegistered(element)) {
            element.addEventListener("click", handle);
            element.setAttribute(tripleClickRegisteredAttr, "true");
        }
    }
    function main() {
        processComments();
        const observer = new MutationObserver(processComments);
        observer.observe(document.body, { childList: true, subtree: true });
        setInterval(processComments, 2000);
    }
    main();
})();