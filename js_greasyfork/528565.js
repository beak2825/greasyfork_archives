// ==UserScript==
// @name         YouTube Theater Mode Maximizer
// @name:zh-TW   YouTube 劇場模式 網頁全螢幕
// @name:zh-CN   YouTube 剧场模式 网页全萤幕
// @namespace    http://tampermonkey.net/
// @homepageURL  https://github.com/kevinboy666/YouTube-Maximizer
// @license     MIT
// @version      1.10
// @description  Maximizes the YouTube player in theater mode to fill the entire viewport.
// @description:zh-TW 自動將 YouTube 劇院模式最大化，並關閉 Premium 廣告。
// @description:zh-CN 自动将 YouTube 剧院模式最大化，并关闭 Premium 广告。
// @author       sharlxeniy <sharlxeniy@gmail.com>
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528565/YouTube%20%E5%8A%87%E5%A0%B4%E6%A8%A1%E5%BC%8F%20%E7%B6%B2%E9%A0%81%E5%85%A8%E8%9E%A2%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/528565/YouTube%20%E5%8A%87%E5%A0%B4%E6%A8%A1%E5%BC%8F%20%E7%B6%B2%E9%A0%81%E5%85%A8%E8%9E%A2%E5%B9%95.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 定义样式表
    const videoStyleSheet = `
        #page-manager {
            margin-top: 0 !important;
        }
        #full-bleed-container {
            height: 100vh !important; /* 填滿螢幕 */
            max-height: 100vh !important;
        }
        #movie_player {
            width: 100vw !important; /* 影片寬度全螢幕 */
            height: 100vh !important; /* 影片高度全螢幕 */
        }
    `;

    const liveStyleSheet = `
        #page-manager {
            margin-top: 0 !important;
        }
        #full-bleed-container {
            height: 100vh !important; /* 填滿螢幕 */
            max-height: 100vh !important;
        }
        #movie_player {
            width: 70vw !important; /* 影片寬度全螢幕 */
            height: 100vh !important; /* 影片高度全螢幕 */
        }
    `;
    // 定義隱藏和顯示 navbar 的樣式
    const navbarClassStyle = `
#masthead-container.navbar-hidden {
    opacity: 0 !important;
    pointer-events: none !important;
    transition: opacity 0.3s ease;
}
#masthead-container.navbar-visible {
    opacity: 1 !important;
    pointer-events: auto !important;
    transition: opacity 0.3s ease;
}
`;

    function addVideoStyles() {
        if (!document.querySelector('#custom-youtube-style')) {
            const style = document.createElement('style');
            style.id = 'custom-youtube-style';
            style.textContent = videoStyleSheet;
            document.head.appendChild(style);
        }
    }

    function addLiveStyles() {
        if (!document.querySelector('#custom-youtube-style')) {
            const style = document.createElement('style');
            style.id = 'custom-youtube-style';
            style.textContent = liveStyleSheet;
            document.head.appendChild(style);
        }
    }

    function removeStyles() {
        const style = document.querySelector('#custom-youtube-style');
        if (style) style.remove();
    }

    function removeNavbarStyle() {
        const navbar = document.querySelector('#masthead-container');
        if (navbar) {
            navbar.classList.remove('navbar-hidden', 'navbar-visible');
        }
    }

    function isWatchPage() {
        return location.pathname === '/watch';
    }


    function updateStyles() {
        window.removeEventListener('scroll', handleScroll);
        if(document.cookie.includes('wide=1')){
            // 先處理直播聊天室情況
            if (isLive) {
                handleScroll();
                if (document.querySelector('#show-hide-button[hidden]')) {
                    // 聊天室可見 → 縮小影片避免擋住
                    console.log("聊天室可見");
                    removeStyles();
                    addLiveStyles();
                    console.log("使用直播");
                } else {
                    // 聊天室隱藏 → 恢復全寬
                    console.log("聊天室隱藏");
                    removeStyles();
                    addVideoStyles();
                    console.log("使用影片");
                }
                window.addEventListener('scroll', handleScroll);
            }
            else if (isWatchPage()) {
                handleScroll();
                addVideoStyles();
                window.addEventListener('scroll', handleScroll);
                console.log("使用影片");
            } else {
                removeStyles();
                removeNavbarStyle();
                console.log("不是影片，移除樣式");
                window.removeEventListener('scroll', handleScroll);
            }
        }
        else {
            removeStyles();
            removeNavbarStyle();
            console.log("劇院關閉，移除樣式")
            window.removeEventListener('scroll', handleScroll);
        }
    }

    function addNavbarClassStyles() {
        if (!document.querySelector('#navbar-class-style')) {
            const style = document.createElement('style');
            style.id = 'navbar-class-style';
            style.textContent = navbarClassStyle;
            document.head.appendChild(style);
        }
    }
    addNavbarClassStyles();

    function handleScroll() {
        const navbar = document.querySelector('#masthead-container');
        if (!navbar) return;

        if (window.scrollY > 0) {
            navbar.classList.add('navbar-visible');
            navbar.classList.remove('navbar-hidden');
        } else {
            navbar.classList.add('navbar-hidden');
            navbar.classList.remove('navbar-visible');
        }
    }

    function dismissPromo() {
        const dismissButton = document.querySelector('#dismiss-button button');
        if (dismissButton) {
            console.log('發現Premium廣告，自動關閉');
            dismissButton.click();
        }
    }

    function isLiveStream() {
        if (window.ytInitialPlayerResponse &&
            window.ytInitialPlayerResponse.videoDetails) {
            return !!window.ytInitialPlayerResponse.videoDetails.isLiveContent;
        }
        return false;
    }

    let isLive = false;
    function checkIsLiveStream() {
        if (window.ytInitialPlayerResponse) {
            isLive = isLiveStream();
            console.log("是否為直播：", isLive);
        } else {
            // 如果還沒有載入，稍後再試
            setTimeout(checkIsLiveStream, 500);
        }
    }
    checkIsLiveStream();


    const observer = new MutationObserver(() => {
        updateStyles();
        dismissPromo();
    });


    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['hidden']
        //attributeFilter: ['style', 'class', 'hidden', 'display', 'visibility']
    });
    
})();