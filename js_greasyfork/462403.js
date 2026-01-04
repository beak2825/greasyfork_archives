// ==UserScript==
// @license      MIT
// @name         wblinkable
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  让网页版微博的链接可以在新标签页打开
// @author       xiongchengqing
// @match        https://m.weibo.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.cn
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462403/wblinkable.user.js
// @updateURL https://update.greasyfork.org/scripts/462403/wblinkable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 让 github.com 的文本可以点击
    function makeGithubTextLinkable(node) {
        const REGEX = /(((https?:)?\/?\/\/)?([0-9a-z_\-]+\.)?[0-9a-z_\-]+\.[0-9a-z_\-]+\/[0-9a-z_\-\/\.]*)/ig;
        let innerHTMLCopy = node.innerHTML
        let res;

        while((res = REGEX.exec(node.innerHTML)) !== null) {
            if (
                !res[0].startsWith('https://') &&
                !res[0].startsWith('http://') &&
                !res[0].startsWith('//') &&
                !res[0].startsWith('://')
            ) {
                innerHTMLCopy = innerHTMLCopy.replace(res[0], `<a href="https://${res[0]}" target="_blank">${res[0]}</a>`);
            }
        };

        node.innerHTML = innerHTMLCopy;
        node.classList.add('handled');
    }

    // 扫描微博文本并处理
    function curryHandleTweet() {
        let nodes = null;
        let id = null;

        return function() {
            if (id) return;
            const promise = new Promise((resolve) => {
                id = setInterval(() => {
                    nodes = document.querySelectorAll('.weibo-text');
                    if (nodes && nodes.length) {
                        nodes = Array.from(nodes).filter(node => !node.classList.contains('handled'));
                        if (nodes.length) {
                            for (const item of nodes) {
                                makeGithubTextLinkable(item);
                            }
                        }
                    }

                    if (!nodes.length) resolve();
                }, 100);
            }).then(() => {
                clearInterval(id);
                id = null;
            });
        };
    }

    const handleTweet = curryHandleTweet();

    window.addEventListener('scroll', handleTweet);
    window.addEventListener('pushState', handleTweet);
    window.addEventListener('popstate', handleTweet);
    handleTweet();
})(window);