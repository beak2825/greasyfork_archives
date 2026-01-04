// ==UserScript==
// @name         小说网站通用快捷翻页
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  键盘左右键或A/D键模拟点击页面中【上一页|上一章】【下一页|下一章】按钮，双击只点击【上一章】【下一章】按钮；按下G键加入书签；自动聚焦验证码，按下R键刷新验证码；自动刷新未加载的网页。适配偶然中文网及其套娃网站，其他类似布局网站也通用。
// @author       coccvo
// @match        https://www.or77.net/*
// @match        https://www.69shuba.pro/*
// @match        https://69shuba.cx/*
// @match        https://tieba.baidu.com/*
// @match        https://www.5xw.net/*
// @match        https://www.123du.vip/*
// @match        https://www.binzhousz.com/*
// @match        https://www.or7.net/*
// @match        https://www.qu7.net/*
// @match        https://www.1bqg.net/*
// @match        https://www.nchdzx.com/*
// @match        https://www.wolaido.com/*
// @match        https://www.cnyxfs.com/*
// @match        https://www.qiqidu.net/*
// @match        https://www.bokank.com/*
// @match        https://www.2pzw.com/*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAB60lEQVR42m2SyUtbURTGT0tXbbF/QaGULoJd2C66kLYKom4UBQVnECcQMbpwEUWCA4a4CahIIk5RUYTgTkF04YSKIA44PVDEIULACVEDMUafv/AeiYqPj8c99/6+c88994r61ldamIveXJJXsff2tiAzedcliAEhky6XKz0qvjSviPCF4fL8ND8tBlTdFLTf8oGwq9ue/z56TxqWpApP2HB47M5KiDzrE3XqnXfW6p2zMsDTnGECxYBSDLG6QVGUnJhvXocA+Vad2iSD4YHG5ZWtg9gePOxDbcLCwuJCWfRn1SYPI1/8+2OhPVcqymc6HRd3j3jYx2g0Mink1mjfsOHueOM5Pf9Drso/4uEYDGoiPwEL7dPoh6uTIBhwq6eO3apiaHea8B9KSqSEI7sBD7BQujNb6hoa9cz3E3DLX1/Q9MNUXQ0GLNTXZLGEDOSGVv7I+k/p/y0cGgPth0HAAkSMIUSDarStRJYmHL7AI0sAYPpNezwe4pvtaWgtvd0g0FwCTQsZwMIGU62ZQyupf8nd+l0oN3gnvYKBtsIAhA1ch7O2kncxOdhmzf43WyGqTRfbuq9VPH1NZjDdwCNbs/xCO+3//WNxJA5rNM4/XoACHVFguoHu1idHoLrMoMxFEeYyxECf0Va1B/8EoujxAC7mNZQAAAAASUVORK5CYII=
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493235/%E5%B0%8F%E8%AF%B4%E7%BD%91%E7%AB%99%E9%80%9A%E7%94%A8%E5%BF%AB%E6%8D%B7%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/493235/%E5%B0%8F%E8%AF%B4%E7%BD%91%E7%AB%99%E9%80%9A%E7%94%A8%E5%BF%AB%E6%8D%B7%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 自动点击刷新
    function checkAndReload() {
        var refreshDiv = document.querySelector('div[style="font-size:26px; color:#00F; cursor:hand; text-align:center;"][onclick="location.reload();"]');
        if (refreshDiv) {
            console.log("Refresh div found. Will reload the page after 2 seconds...");

            // 添加延迟
            setTimeout(function() {
                console.log("Performing reload now...");
                location.reload();
            }, 500);
        } else {
            console.log("Refresh div not found.");
        }
    }
    // 页面加载完成后检查
    window.addEventListener('load', checkAndReload);
    // 页面从后台切换到前台时检查
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            checkAndReload();
        }
    });

    // 自动聚焦验证码
    function autoFocusYZM() {
        const yzmInput = document.getElementById('yzm');

        if (yzmInput && !yzmInput.disabled) {
            yzmInput.focus();
            return true;
        }
        return false;
    }
    if (!autoFocusYZM()) {
        // 如果初始未找到，设置监听器
        const observer = new MutationObserver(function(mutations) {
            if (autoFocusYZM()) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        // 2秒后自动停止监听
        setTimeout(() => observer.disconnect(), 2000);
    }

    // 模拟点击函数
    function simulateClickByText(textContent) {
        const links = document.querySelectorAll('a');
        for (let i = 0; i < links.length; i++) {
            if (links[i].textContent.trim() === textContent) {
                links[i].click();
                return true;
            }
        }
        return false;
    }

    // 检测页面按钮
    function hasNextPageButton() {
        return simulateClickByText('下一页') || simulateClickByText('下一页>');
    }
    function hasLastPageButton() {
        return simulateClickByText('上一页') || simulateClickByText('上一页>');
    }

    // 书签功能
    function simulateBookmarkClick() {
        const bookmarkButton = document.querySelector('span[onclick*="AddShuQian"]');
        if (bookmarkButton) {
            bookmarkButton.click();
            console.log('Bookmark button clicked');
        }
    }

    // 验证码刷新
    function refreshCaptcha() {
        const captchaImg = document.getElementById('yzmImg');
        if (captchaImg) {
            captchaImg.src = captchaImg.src.split('?')[0] + '?' + Math.random();
            console.log('验证码已刷新');
            setTimeout(autoFocusYZM, 300);
        }
    }

    // 双击检测变量
    let clickTimer = null;

    // 检测页面按钮
    function findButtonToClick(texts) {
        const links = document.querySelectorAll('a');
        for (let i = 0; i < links.length; i++) {
            const linkText = links[i].textContent.trim();
            if (texts.includes(linkText)) {
                links[i].click();
                return true;
            }
        }
        return false;
    }

    // 处理页面导航
    function handlePageNavigation(direction) {
        if (clickTimer == null) {
            clickTimer = setTimeout(() => {
                const isPrev = direction === 'prev';
                if (isPrev ? hasLastPageButton() : hasNextPageButton()) {
                    if (isPrev) {
                        simulateClickByText('上一页') || simulateClickByText('<上一页');
                    } else {
                        simulateClickByText('下一页') || simulateClickByText('下一页>');
                    }
                } else {
                    simulateClickByText(isPrev ? '上一章' : '下一章');
                }
                clickTimer = null;
            }, 300);
        } else {
            clearTimeout(clickTimer);
            clickTimer = null;
            simulateClickByText(direction === 'prev' ? '上一章' : '下一章');
        }
    }

    // 统一按键处理
    function handleKeyEvents(e) {
         // 忽略组合键
    if (e.ctrlKey || e.altKey || e.shiftKey) return;
    const target = e.target;
    // 忽略原生输入控件
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
    }
    // 忽略 contenteditable 元素及其内部
    if (target.isContentEditable || target.closest('[contenteditable="true"]')) {
        return;
    }
        switch(e.key.toLowerCase()) {
            case 'arrowleft':
            case 'a':
                handlePageNavigation('prev');
                break;
            case 'arrowright':
            case 'd':
                handlePageNavigation('next');
                break;
            case 'g':
                simulateBookmarkClick();
                break;
            case 'r':
                refreshCaptcha();
                break;
        }
    }
    document.addEventListener('keydown', handleKeyEvents);
})();