// ==UserScript==
// @name          4chan Post Sort by quote
// @namespace     4chan-post-sort-by-quote
// @description   Sorts posts in a 4chan thread by quote. Origin Author:asdaa
// @license       MIT
// @include       http://boards.4chan.org/*/*
// @include       https://boards.4chan.org/*/*
// @grant         GM_registerMenuCommand
// @version       1.0.1
// @author        TomoeMami
// @icon          https://4chan.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/523552/4chan%20Post%20Sort%20by%20quote.user.js
// @updateURL https://update.greasyfork.org/scripts/523552/4chan%20Post%20Sort%20by%20quote.meta.js
// ==/UserScript==

function sortPosts() {
// 获取所有 replyContainer 元素
const replyContainers = document.querySelectorAll('.replyContainer');

// 遍历每个 replyContainer
replyContainers.forEach(container => {
    // 查找 class 为 backlink 的 div
    const backlinkDiv = container.querySelector('.backlink');
    if (backlinkDiv) {
        // 查找 backlink div 中的所有 quotelink 子元素
        const quotelinks = backlinkDiv.querySelectorAll('.quotelink');
    // 遍历每个 quotelink
    quotelinks.forEach(quotelink => {
        // 获取 quotelink 的文本内容
        const text = quotelink.textContent.trim();

        // 检查是否包含 "OP"
        if (text.includes("OP")) {
            // 如果包含 "OP"，跳过处理
            return;
        }

        // 去除前两个符号并提取 ID
        const linkedId = text.slice(2);

        // 查找对应的 replyContainer
        let linkedContainer = null;
        replyContainers.forEach(c => {
            // 查找 title 为 "Reply to this post" 的 <a> 元素
            const replyLink = c.querySelector('a[title="Reply to this post"]');
            if (replyLink && replyLink.textContent.trim() === linkedId) {
                linkedContainer = c;
            }
        });

        // 如果找到对应的 replyContainer，将其移动到当前 container 之后
        if (linkedContainer) {
            container.insertAdjacentElement('afterend', linkedContainer);
        }
    });
    };
});
}

var sortBtn = document.createElement('a');
sortBtn.href = 'javascript:;';
sortBtn.innerText = 'Sort by Quote';
document.querySelector(".navLinks.desktop").appendChild(sortBtn)
sortBtn.insertAdjacentText('beforebegin', ' [');
sortBtn.insertAdjacentText('afterend', ']');
sortBtn.addEventListener("click", function() {
    console.log('Button clicked');
    sortPosts();
}, false);

GM_registerMenuCommand('Sort Posts by Quote', sortPosts);