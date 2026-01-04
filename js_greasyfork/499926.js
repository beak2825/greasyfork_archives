// ==UserScript==
// @name         推特授权和发布关注Like
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动点击Twitter的授权关注点赞转发
// @author       YourName
// @match        *://*.x.com/*
// @match        *://*.discord.com/*
// @match        *://*.twitter.com/*
// @license MIT
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499926/%E6%8E%A8%E7%89%B9%E6%8E%88%E6%9D%83%E5%92%8C%E5%8F%91%E5%B8%83%E5%85%B3%E6%B3%A8Like.user.js
// @updateURL https://update.greasyfork.org/scripts/499926/%E6%8E%A8%E7%89%B9%E6%8E%88%E6%9D%83%E5%92%8C%E5%8F%91%E5%B8%83%E5%85%B3%E6%B3%A8Like.meta.js
// ==/UserScript==
(function() {
    let followClickedCount = 0;
    window.addEventListener('load', function() {
        const observer = new MutationObserver(() => {
            if (window.location.href.includes("https://x.com/")) {
                const popup = document.querySelector('div[data-testid="confirmationSheetDialog"]');
                if (popup) {
                    try {
                        const repostButton = Array.from(popup.querySelectorAll('*')).find(el => el.innerHTML.trim().includes('Repost'));
                        if (repostButton) {
                            console.log("Clicking repost button:", repostButton);
                            repostButton.click();
                        }
                    } catch (error) {
                        console.error("点击弹窗按钮时出错:", error);
                    }
                }
            }
            const allElements = Array.from(document.querySelectorAll('*'));
            allElements.forEach(el => {
                const buttonText = el.innerHTML.trim();
                if (['Repost', 'Authorize app', '授权', 'Post', 'Like', 'Follow'].includes(buttonText) && el.tagName === 'BUTTON') {
                    console.log("Clicking button:", buttonText);
                    el.click();
                }
            });
            const authorizeSpan = allElements.find(span => span.innerHTML.trim() === 'Authorize app' && span.tagName === 'SPAN');
            if (authorizeSpan) {
                const button = authorizeSpan.closest('button');
                if (button) {
                    console.log("Clicking button:", button);
                    button.click();
                } else {
                    console.log("No button found for the span.");
                }
            }
            const followButton = allElements.find(el =>['Follow', 'Authorize app', 'Repost', 'Post', 'Like'].some(text => el.innerHTML.trim().includes(text)) && el.tagName === 'BUTTON');
            if (followButton) {
                console.log("Clicking follow button:", followButton);
                followButton.click();
            }
            const followInput = allElements.find(input =>input.tagName === 'INPUT' && input.type === 'submit' && ['Follow', 'Authorize app', 'Repost', 'Post', 'Like'].includes(input.value.trim()));
            if (followInput) {
                console.log("Clicking input button:", followInput);
                followInput.click();
                observer.disconnect();
            }

            const specificInput = allElements.find(input => input.tagName === 'INPUT' && input.type === 'submit' && input.value === "Authorize app");
            if (specificInput) {
                alert(1);
                console.log("Clicking specific input button:", specificInput);
                specificInput.click();
                observer.disconnect();
            }
        });

        // 开始观察 DOM 变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();