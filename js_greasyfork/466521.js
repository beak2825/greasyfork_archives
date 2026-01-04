// ==UserScript==
// @name         Auto_Link_Quote_by_el9in
// @namespace    Auto_Link_Quote_by_el9in
// @version      0.3
// @description  Auto Link Quote
// @author       el9in
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        unsafeWindow
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/466521/Auto_Link_Quote_by_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/466521/Auto_Link_Quote_by_el9in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const button = document.querySelector('button.lzt-fe-se-sendMessageButton');
    const div = document.querySelector('div.fr-element.fr-view.fr-element-scroll-visible');
    if (button && div) {
        button.addEventListener('click', function() {
            if (div) {
                const elements = [];
                const childElements = div.children;
                for (var i = 0; i < childElements.length; i++) {
                    console.log(true,childElements[i]);
                    if (childElements[i].hasAttribute('data-source')) {
                        const element = childElements[i];
                        const dataSource = element.getAttribute('data-source');
                        const postId = dataSource.split(':')[1];
                        const outerHTML = element.outerHTML;
                        const paragraph = element.querySelector('p');
                        const innerText = paragraph.innerText;
                        const currentUrl = document.location.href;
                        const pageRegex = /page-(\d+)/;
                        const pageCommentRegex = /post_comment/;
                        const threadIdRegex = /threads\/(\d+)/;
                        const match = currentUrl.match(pageRegex);
                        const matchThread = currentUrl.match(threadIdRegex);
                        const matchComment = dataSource.match(pageCommentRegex);
                        if (match && matchComment) {
                            const pageNumber = match[1];
                            paragraph.innerText = `[URL=https://zelenka.guru/posts/comments/${postId.substr(1)}]` + innerText + `[/URL]`;
                        } else if (match && matchThread) {
                            const pageNumber = match[1];
                            const threadId = matchThread[1];
                            paragraph.innerText = `[URL=https://zelenka.guru/threads/${threadId}/page-${pageNumber}#post-${postId.substr(1)}]` + innerText + `[/URL]`;
                        } else if(matchThread) {
                            const threadId = matchThread[1];
                             paragraph.innerText = `[URL=https://zelenka.guru/threads/${threadId}/#post-${postId.substr(1)}]` + innerText + `[/URL]`;
                        }
                    }
                }
            }
        });
    }
})();