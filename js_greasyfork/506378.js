// ==UserScript==
// @name        安全微伴选课列表自动下一课脚本
// @namespace   http://tampermonkey.net/
// @version     1.0.1
// @license     GPL-3.0
// @description 自动点击“下一课”，并配合另一脚本刷课。
// @author      117Ryan
// @match       https://weiban.mycourse.cn/*
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/506378/%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%E9%80%89%E8%AF%BE%E5%88%97%E8%A1%A8%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/506378/%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%E9%80%89%E8%AF%BE%E5%88%97%E8%A1%A8%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  

    const isTargetPage = () => window.location.href.includes('/wk/comment?courseId');

    const findAndClickNextLesson = () => {
        const buttons = Array.from(document.querySelectorAll('.comment-wklist .comment-wklist-item .comment-wklist-btn'));

       

        const nextLessonButton = buttons.find(button => button.textContent.trim() === '下一课');
        if (nextLessonButton) {
            
            nextLessonButton.parentElement.click();
           
        } else {
           
            promptUserToReturnToList();
        }
    };

    const promptUserToReturnToList = () => {
        if (confirm('当前小节已完善，点击“确定”返回列表选择其他小节。')) {
            const returnButton = document.querySelector('.comment-footer .comment-footer-button');
            if (returnButton) {
                returnButton.click();
               
            }
        }
    };

    const setupTipsAndObserver = () => {
        const tipLeft = document.createElement('div');
        tipLeft.textContent = '选课界面';
        tipLeft.style.cssText = 'font-size:30px;position:fixed;left:10px;top:10px;z-index:9999;padding:5px 10px;background:#fff;';
        document.body.appendChild(tipLeft);

        const tipRight = document.createElement('div');
        tipRight.textContent = '即将自动跳转';
        tipRight.style.cssText = 'font-size:30px;position:fixed;right:10px;top:10px;z-index:9999;padding:5px 10px;background:#fff;';
        document.body.appendChild(tipRight);

        setTimeout(() => {
            document.body.removeChild(tipLeft);
            document.body.removeChild(tipRight);
            findAndClickNextLesson();
        }, 3000);
    };

    const observeDOMChanges = () => {
        const observer = new MutationObserver((mutations) => {
            if (isTargetPage()) {
                setupTipsAndObserver();
                observer.disconnect(); // 停止观察，防止内存泄漏
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    const onUrlChange = () => {
        if (isTargetPage()) {
            setupTipsAndObserver();
        }
    };

    window.addEventListener('popstate', onUrlChange);
    window.addEventListener('hashchange', onUrlChange);

    if (isTargetPage()) {
        setupTipsAndObserver();
    } else {
        observeDOMChanges();
    }
})();
