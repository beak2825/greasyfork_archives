// ==UserScript==
// @name         Komica Gmail Style
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  把Komica改成Gmail樣式
// @author       Yun
// @license      GNU GPLv3
// @icon         https://i.ibb.co/bscXhHh/icon.png
// @match        https://komica.org/*
// @match        https://*.komica.org/*
// @match        https://*.komica1.org/*
// @match        https://*.komica2.cc/*
// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/511958/Komica%20Gmail%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/511958/Komica%20Gmail%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clickCount = 0;
    let clickTimeout;

    // 監聽滑鼠按鈕點擊事件
    document.addEventListener('mousedown', function(event) {
        // 只檢測中鍵 (滑鼠中間滾輪按鈕)
        if (event.button === 1) {
            clickCount++;

            if (clickTimeout) {
                clearTimeout(clickTimeout);
            }

            clickTimeout = setTimeout(function() {
                if (clickCount === 2) {
                    // 中鍵連續點擊兩次，跳轉到指定 URL（本地打開）
                    window.location.href = 'https://gita.komica1.org/00b/index.htm?';
                } else if (clickCount === 3) {
                    // 中鍵連續點擊三次，跳轉到 Pornhub
                    window.open('https://www.pornhub.com/');
                } else if (clickCount === 4) {
                    // 中鍵連續點擊四次，跳轉到 Xvideos
                    window.open('https://www.xvideos.com/');
                } else if (clickCount === 5) {
                    // 中鍵連續點擊五次，跳轉到 Jable
                    window.open('https://jable.tv/');
                } else if (clickCount === 6) {
                    // 中鍵連續點擊六次，跳轉到 Pornhub Gay
                    window.open('https://www.pornhub.com/gayporn');
                }
                clickCount = 0;
            }, 300); // 300 毫秒的時間間隔來偵測連擊
        }
    });

    // 添加滑鼠左鍵點擊監聽器
    document.addEventListener('click', function(event) {
        clickCount++;

        if (clickTimeout) {
            clearTimeout(clickTimeout);
        }

        clickTimeout = setTimeout(function() {
            if (clickCount === 2) {
                // 連續點擊兩次，切換圖片顯示/隱藏
                const images = document.querySelectorAll('img');
                images.forEach(img => {
                    img.style.display = img.style.display === 'none' ? 'block' : 'none';
                });
            } else if (clickCount === 3) {
                // 連續點擊三次，在新視窗打開 Gmail
                window.open('https://mail.google.com/mail/', '_blank');
            }
            clickCount = 0;
        }, 300); // 300 毫秒的時間間隔來偵測連擊
    });

    'use strict';

    // 添加 Gmail 樣式
    GM_addStyle(`
        body, html {
            background-color: #f6f8fc !important;
            font-family: 'Roboto', Arial, sans-serif !important;
            margin: 0;
            padding: 0;
        }

        /* 修改主要內容區域 */
        #contents {
            background-color: #ffffff !important;
            border-radius: 16px !important;
            box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15) !important;
            margin: 16px !important;
            padding: 16px !important;
        }

        /* 修改回覆窗格 */
        form {
            background-color: #f1f3f4 !important;
            border: 1px solid #dadce0 !important;
            border-radius: 8px !important;
            padding: 16px !important;
            margin-top: 16px !important;
        }

        /* 修改字體顏色 */
        body, .thread, .reply {
            color: #202124 !important;
        }

        /* 修改連結顏色 */
        a {
            color: #1a73e8 !important;
            text-decoration: none !important;
        }

        /* 修改 h1 標題樣式 */
        h1 {
            color: #202124 !important;
            font-size: 24px !important;
            font-weight: 400 !important;
            margin-bottom: 16px !important;
        }

        /* 修改發文按鈕樣式 */
        input[type="submit"], button {
            background-color: #1a73e8 !important;
            color: #ffffff !important;
            border: none !important;
            cursor: pointer !important;
            padding: 8px 16px !important;
            border-radius: 4px !important;
        }

        input[type="submit"]:hover, button:hover {
            background-color: #1765cc !important;
        }

        /* 隱藏原有的 logo */
        img[src*="title2.gif"] {
            display: none !important;
        }

        /* 修改回覆區域樣式 */
        .reply {
            background-color: #ffffff !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 8px !important;
            padding: 12px !important;
            margin-bottom: 12px !important;
        }

        /* 修改 popup_area 顏色 */
        .popup_area {
            background-color: #f1f3f4 !important;
            border-color: #dadce0 !important;
        }

        /* 修改 quickreply 顏色 */
        #quickreply {
            background-color: #f1f3f4 !important;
            border-color: #dadce0 !important;
        }

        /* 修改 divTable blueTable 顏色 */
        .divTable.blueTable {
            background-color: #ffffff !important;
        }

        .divTable.blueTable .divTableHeading {
            background-color: #f6f8fc !important;
        }

        /* 修改 Form_bg 顏色 */
        .Form_bg {
            background-color: #f1f3f4 !important;
        }

        /* 修改 popup active 顏色 */
        .popup.active {
            background-color: #ffffff !important;
            border-color: #dadce0 !important;
            box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15) !important;
        }

        /* 隱藏/顯示按鈕樣式 */
        #toggleImagesBtn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #1a73e8;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 20px;
            cursor: pointer;
            display: none; /* 預設隱藏 */
            z-index: 1000;
        }

        #toggleImagesBtn:hover {
            background-color: #1765cc;
        }

        /* 按鈕顯示時 */
        #toggleImagesBtn.show {
            display: block;
        }

        /* Gmail 樣式側邊欄 */
        .gmail-sidebar {
            width: 256px;
            height: 100vh;
            background-color: #f6f8fc;
            padding: 8px 0;
            box-sizing: border-box;
            overflow-y: auto;
        }

        .gmail-sidebar-item {
            display: flex;
            align-items: center;
            padding: 0 12px 0 26px;
            height: 32px;
            cursor: pointer;
            color: #202124;
            font-size: 14px;
            border-radius: 0 16px 16px 0;
        }

        .gmail-sidebar-item:hover {
            background-color: #e8eaed;
        }

        .gmail-sidebar-item.active {
            background-color: #d3e3fd;
            font-weight: bold;
        }

        .gmail-sidebar-icon {
            margin-right: 18px;
            width: 20px;
            height: 20px;
            fill: #5f6368;
        }

        .gmail-sidebar-item.active .gmail-sidebar-icon {
            fill: #1a73e8;
        }
    `);

    // 檢查是否在右側內容區域顯示按鈕
    // 檢查是否在右側內容區域顯示按鈕
if (window.name !== 'menu') {
    const btn = document.createElement('button');
    btn.id = 'toggleImagesBtn';
    btn.innerText = '🖼️'; // 按鈕顯示一個簡單的圖示
    document.body.appendChild(btn);

    // 當按鈕被點擊時，切換圖片顯示
    btn.addEventListener('click', function() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.display = img.style.display === 'none' ? 'block' : 'none';
        });
    });

    // 顯示按鈕
    document.getElementById('toggleImagesBtn').classList.add('show');

    // CSS 設置按鈕樣式
    const style = document.createElement('style');
    style.innerHTML = `
        #toggleImagesBtn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #007BFF; /* 背景顏色 */
            color: white;
            font-size: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%; /* 使按鈕圓形 */
            border: none;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s, transform 0.3s;
        }

        #toggleImagesBtn:hover {
            background-color: #0056b3; /* 滑鼠懸停時改變顏色 */
            transform: scale(1.1); /* 當懸停時，按鈕稍微放大 */
        }

        #toggleImagesBtn:focus {
            outline: none; /* 移除焦點樣式 */
        }
    `;
    document.head.appendChild(style);
}


    // 只有當 window.name 是 'menu' 時才顯示 Gmail 樣式側邊欄
   if (window.name === 'menu') {
    const sidebarHTML = `
        <div class="gmail-sidebar">
            <div class="gmail-sidebar-item active">
                <a href="https://komica1.org/" target="_top" style="text-decoration: none; color: inherit; display: flex; align-items: center; width: 100%;">
                    <svg class="gmail-sidebar-icon" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path><path d="M7 12h2v5H7zm8-5h2v10h-2zm-4 7h2v3h-2zm0-4h2v2h-2z"></path></svg>
                    回首頁
                </a>
            </div>
            <div class="gmail-sidebar-item">
                <a href="https://gita.komica1.org/00b/pixmicat.php?mode=search" target="cont" style="text-decoration: none; color: inherit; display: flex; align-items: center; width: 100%;">
                    <svg class="gmail-sidebar-icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"></path></svg>
                    搜尋
                </a>
            </div>
            <div class="gmail-sidebar-item">
                <a href="https://gita.komica1.org/00b/pixmicat.php?mode=module&load=mod_threadlist" target="cont" style="text-decoration: none; color: inherit; display: flex; align-items: center; width: 100%;">
                    <svg class="gmail-sidebar-icon" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path></svg>
                    檔案區
                </a>
            </div>
            <div class="gmail-sidebar-item">
                <a href="https://gita.komica1.org/00b/pixmicat.php?mode=module&load=mod_catalog" target="cont" style="text-decoration: none; color: inherit; display: flex; align-items: center; width: 100%;">
                    <svg class="gmail-sidebar-icon" viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></svg>
                    相簿
                </a>
            </div>
            <div class="gmail-sidebar-item">
                <a href="https://gita.komica1.org/00b/catlist.php" target="cont" style="text-decoration: none; color: inherit; display: flex; align-items: center; width: 100%;">
                    <svg class="gmail-sidebar-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"></path></svg>
                    趨勢
                </a>
            </div>
            <div class="gmail-sidebar-item">
                <a href="https://gita.komica1.org/00b/pixmicat.php?mode=admin" target="cont" style="text-decoration: none; color: inherit; display: flex; align-items: center; width: 100%;">
                    <svg class="gmail-sidebar-icon" viewBox="0 0 24 24"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></svg>
                    管理區
                </a>
            </div>
            <div class="gmail-sidebar-item">
                <a href="https://gita.komica1.org/00b/index.htm?" target="cont" style="text-decoration: none; color: inherit; display: flex; align-items: center; width: 100%;">
                    <svg class="gmail-sidebar-icon" viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></svg>
                    重新整理
                </a>
            </div>
        </div>
    `;

    document.body.innerHTML = sidebarHTML;

        GM_addStyle(`
            body::before {
                content: '';
                display: block;
                width: 109px;
                height: 40px;
                background-image: url('https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png');
                background-repeat: no-repeat;
                background-size: contain;
                margin: 16px 0 16px 26px;
            }
            .gmail-sidebar-item a {
            text-decoration: none;
            color: inherit;
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;
        }

        .gmail-sidebar-item:hover {
            background-color: #e8eaed;
        }

        .gmail-sidebar-item.active a {
            color: #1a73e8;
            font-weight: bold;
        }

        .gmail-sidebar-item.active {
            background-color: #d3e3fd;
        }
        `);
    }

    // 監聽 DOM 變化並應用樣式
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            const addedNodes = Array.from(mutation.addedNodes);
            addedNodes.forEach(node => {
                if (node.nodeType === 1) { // 檢查是否為元素節點
                    node.style.backgroundColor = '#ffffff';
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 移除原有的框架結構
    if (window.top === window.self) {
        const frameset = document.querySelector('frameset');

        if (frameset) {
            // 修改 frameset 的 cols 屬性
            frameset.setAttribute('cols', '280,*');

            // 或者將 frameset 結構替換為 div 結構，並手動設置寬度
            document.body.innerHTML = document.body.innerHTML.replace(/<frameset[\s\S]*?<\/frameset>/gi, '<div id="contents"></div>');

            // 加載原本在框架中的內容
            fetch(window.location.href)
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const menuFrame = doc.querySelector('frame[name="menu"]');
                    const contFrame = doc.querySelector('frame[name="cont"]');

                    if (menuFrame && contFrame) {
                        const menuSrc = menuFrame.getAttribute('src');
                        const contSrc = contFrame.getAttribute('src');

                        const contents = document.getElementById('contents');
                        contents.innerHTML = `
                            <iframe src="${menuSrc}" style="width:256px;height:100vh;border:none;"></iframe>
                            <iframe src="${contSrc}" style="width:calc(100% - 256px);height:100vh;border:none;"></iframe>`;
                    }
                });
        }
    }

})();
