// ==UserScript==
// @name         USTC icourse reviews enhanced
// @namespace    http://tampermonkey.net/
// @version      2024-04-32
// @description  USTC icourse fold reviews and expand control
// @author       liuly
// @match        https://icourse.club/course/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493753/USTC%20icourse%20reviews%20enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/493753/USTC%20icourse%20reviews%20enhanced.meta.js
// ==/UserScript==

function addStyle(aCss){
    'use strict';
    let head = document.getElementsByTagName('head')[0];
    if (head) {
      let style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = aCss;
      head.appendChild(style);
      return style;
    }
    return null;
}

addStyle(`
.folded {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 20;
    overflow: hidden;
}
.display-folded .review-content {
    -webkit-line-clamp: unset !important;
}
.read-more {
    display: block;
    margin-top: 10px;
}
.display-folded .read-more {
    display: none !important;
}
.fold-button {
    display: none;
}
.display-folded .fold-button {
    display: inline !important;
}
.fixed-bottom-bar {
    position: fixed;
    width: 100%;
    bottom: 0;
    padding-top: 15px;
    background-color: #fff;
}
`);

(function() {
    'use strict';

    let requestId;

    // 为所有过长评论默认折叠，并在内容末尾增加“打开”文字按钮；在底栏增加“折叠”文字按钮
    function initFoldedElements() {
        const reviewContents = document.querySelectorAll('.review-content');

        for (const reviewContent of reviewContents) {
            const reviewContentHeight = reviewContent.scrollHeight;
            if (reviewContentHeight < 30 * parseFloat(window.getComputedStyle(reviewContent).lineHeight)) {
                continue;
            }
            const wrapperDiv = document.createElement('div');
            wrapperDiv.className = 'review-wrapper';

            // 移动到 wrapper 内，限制行数
            reviewContent.parentNode.insertBefore(wrapperDiv, reviewContent);
            wrapperDiv.appendChild(reviewContent);
            reviewContent.classList.add('folded');

            // 查看更多
            const readMoreButton = document.createElement('button');
            readMoreButton.classList.add('read-more');
            readMoreButton.textContent = '查看更多';
            readMoreButton.addEventListener('click', () => {
                wrapperDiv.parentNode.classList.add('display-folded');
            });
            wrapperDiv.appendChild(readMoreButton);

            // 折叠
            const foldButton = document.createElement('button');
            foldButton.classList.add('fold-button');
            foldButton.textContent = '折叠';
            foldButton.addEventListener('click', () => {
                wrapperDiv.parentNode.classList.remove('display-folded');
                window.scrollTo({top: wrapperDiv.offsetTop, left: 0});
            });
            wrapperDiv.nextElementSibling.appendChild(foldButton);
        }
    }

    // 在每一帧中执行的函数
    function checkContentPosition() {
        // 获取所有可能折叠的评课内容元素
        const reviewContents = document.querySelectorAll('.review-wrapper');

        // 获取页面底部位置信息
        const pageBottom = window.innerHeight;

        // 遍历评课内容元素
        reviewContents.forEach(reviewContent => {
            // 获取评课内容元素的位置信息
            const reviewContentRect = reviewContent.getBoundingClientRect();
            const reviewContentTop = reviewContentRect.top;
            const reviewContentBottom = reviewContentRect.bottom;

            const bottomBar = reviewContent.nextElementSibling;
            // 如果评课内容元素出现，且处在打开状态
            const isOpen = reviewContent.parentNode.classList.contains('display-folded');
            if (reviewContentTop < pageBottom && reviewContentBottom > pageBottom && isOpen) {
                // 设置底栏元素的 fixed bottom 样式
                bottomBar.classList.add('fixed-bottom-bar');
            } else {
                bottomBar.classList.remove('fixed-bottom-bar');
            }
        });

        // 继续在下一帧中执行
        requestId = window.requestAnimationFrame(checkContentPosition);
    }

    // 在页面加载完成后执行
    window.addEventListener('load', () => {
        initFoldedElements();
        // 在每一帧中检查评课内容元素的位置并设置底栏样式
        requestId = window.requestAnimationFrame(checkContentPosition);
    });
})();