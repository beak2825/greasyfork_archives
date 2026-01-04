// ==UserScript==
// @name         動畫瘋 自動展開「留言板」之前留言
// @version      1.2
// @description  當滾動到頁面底部時，自動點擊展開之前留言按鈕。
// @author       movwei
// @license      MIT
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @namespace https://greasyfork.org/users/1041101
// @downloadURL https://update.greasyfork.org/scripts/498104/%E5%8B%95%E7%95%AB%E7%98%8B%20%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8B%E3%80%8C%E7%95%99%E8%A8%80%E6%9D%BF%E3%80%8D%E4%B9%8B%E5%89%8D%E7%95%99%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/498104/%E5%8B%95%E7%95%AB%E7%98%8B%20%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8B%E3%80%8C%E7%95%99%E8%A8%80%E6%9D%BF%E3%80%8D%E4%B9%8B%E5%89%8D%E7%95%99%E8%A8%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let expanding = false;

    function simulateClick(element) {
        if (element) {
            var event = new Event('click', {
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(event);
        }
    }

    function isPageBottom() {
        return (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2;
    }

    function checkAndClick() {
        if (isPageBottom() && !expanding) {
            var expandButton = document.querySelector('.c-msg-item.c-more-msg[data-evt-morecomment]');
            if (expandButton) {
                expanding = true;
                simulateClick(expandButton);
                console.log('已點擊展開按鈕');

                // 使用 MutationObserver 監控內容變化
                var observer = new MutationObserver(() => {
                    expanding = false;
                });
                observer.observe(document.body, { childList: true, subtree: true });
            } else {
                console.log('未找到展開按鈕');
            }
        }
    }

    window.addEventListener('scroll', checkAndClick);

})();