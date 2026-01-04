// ==UserScript==
// @name         反廣告攔截腳本阻擋工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  此腳本針對某些網站來阻擋反廣告腳本載入
// @author       Stars Shine
// @match        https://dl.pgl823.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543419/%E5%8F%8D%E5%BB%A3%E5%91%8A%E6%94%94%E6%88%AA%E8%85%B3%E6%9C%AC%E9%98%BB%E6%93%8B%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/543419/%E5%8F%8D%E5%BB%A3%E5%91%8A%E6%94%94%E6%88%AA%E8%85%B3%E6%9C%AC%E9%98%BB%E6%93%8B%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tampermonkey: 反廣告攔截腳本阻擋工具 已啟動。');

    // 廣告相關的域名列表
    const adDomains = [
        'googlesyndication.com',
        'googletagservices.com',
        'adservice.google.com',
        'doubleclick.net',
        'ad.doubleclick.net',
        'pagead2.googlesyndication.com',
        'tpc.googlesyndication.com',
        'googleads.g.doubleclick.net',
        // 您可以根據需要添加更多常見的廣告域名
        // 例如：'cdn.ads.example.com', 'tracker.example.com'
    ];

    // 檢查 URL 是否包含廣告域名
    function isAdUrl(url) {
        return adDomains.some(domain => url.includes(domain));
    }

    // 輔助函式：清除 #aBlock 上的所有類別
    function clearABlockClasses() {
        const aBlock = document.getElementById('aBlock');
        if (aBlock && aBlock.className !== '') {
            aBlock.className = ''; // 直接清空所有類別
            console.log('Tampermonkey: 移除了 #aBlock 上的所有類別。');
        }
    }

    // 1. 覆寫 window.onload 屬性，防止其他腳本設定它
    // 這會在原始腳本設定 window.onload 之前執行
    Object.defineProperty(window, 'onload', {
        get: function() {
            return function() {}; // 返回一個空函式
        },
        set: function(newValue) {
            console.log('Tampermonkey: 嘗試設定 window.onload 被阻止。');
        },
        configurable: true // 允許屬性被重新定義
    });

    // 2. 覆寫原始的 checkAdVisibility 函式為一個空函式
    // 這會阻止原始函式內的邏輯執行
    window.checkAdVisibility = function() {
        console.log('Tampermonkey: checkAdVisibility 函式被 Tampermonkey 腳本阻擋。');
        clearABlockClasses(); // 確保 aBlock 元素上的所有類別都被移除
    };

    // 3. 阻擋 Google AdSense 相關的全局變數和腳本載入
    // 覆寫 window.adsbygoogle 陣列，防止 AdSense 腳本初始化
    // 這樣 AdSense 腳本在執行時會發現 adsbygoogle 已經被控制，無法正常推送廣告單元
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.length = 0; // 清空可能已存在的內容
    window.adsbygoogle.push = function() {
        console.log('Tampermonkey: window.adsbygoogle.push 被阻擋。');
    };

    // 4. 覆寫 document.createElement 方法，阻止廣告腳本和 iframe 的創建和載入
    // 儲存原始的 createElement 方法，以便在非廣告情況下使用
    const originalCreateElement = document.createElement;

    document.createElement = function(tagName) {
        // 呼叫原始的 createElement 方法創建元素
        const element = originalCreateElement.apply(this, arguments);

        const lowerTagName = tagName.toLowerCase();
        // 如果創建的是 <script> 或 <iframe> 標籤
        if (lowerTagName === 'script' || lowerTagName === 'iframe') {
            // 在元素被添加到 DOM 之前，檢查其 src 屬性
            // 使用 Object.defineProperty 來攔截 src 屬性的設置
            Object.defineProperty(element, 'src', {
                get: function() {
                    return this._src || '';
                },
                set: function(value) {
                    // 檢查是否為廣告相關的腳本或 iframe URL
                    if (isAdUrl(value)) {
                        console.log(`Tampermonkey: 偵測到廣告 ${lowerTagName} 載入嘗試，已阻擋:`, value);
                        // 阻止設置 src，使其無法載入
                        this._src = ''; // 清空 src
                        if (lowerTagName === 'script') {
                            this.type = 'text/plain'; // 阻止腳本執行，可以通過設置 type 為非 JavaScript 類型
                        }
                        return; // 阻止繼續設置 src
                    }
                    this._src = value; // 設置正常的 src
                },
                configurable: true // 允許屬性被重新定義
            });
        }
        return element; // 返回創建的元素
    };

    // 5. 攔截 XMLHttpRequest 請求
    const originalXHRopen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (isAdUrl(url)) {
            console.log('Tampermonkey: 偵測到廣告 XHR 請求，已阻擋:', url);
            // 阻止請求發送，或者讓它指向一個無害的地址
            // 這裡我們直接返回一個空的 open 函式，阻止真正的請求被配置
            return;
        }
        // 呼叫原始的 open 方法
        return originalXHRopen.apply(this, arguments);
    };

    // 6. 攔截 Fetch API 請求
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        let url;
        if (typeof input === 'string') {
            url = input;
        } else if (input instanceof Request) {
            url = input.url;
        } else {
            // 處理其他類型的輸入，儘管通常是字串或 Request 物件
            url = String(input);
        }

        if (isAdUrl(url)) {
            console.log('Tampermonkey: 偵測到廣告 Fetch 請求，已阻擋:', url);
            // 返回一個空的 Promise.reject 或 Promise.resolve，模擬請求失敗或成功但無內容
            // 這裡返回一個被拒絕的 Promise，模擬網路錯誤
            return Promise.reject(new TypeError('Failed to fetch (blocked by Tampermonkey)'));
            // 或者可以返回一個成功的 Promise，但內容為空：
            // return Promise.resolve(new Response('', { status: 200 }));
        }
        // 呼叫原始的 fetch 方法
        return originalFetch.apply(this, arguments);
    };

    // 7. 移除頁面上已存在的或動態添加的廣告元素，並持續監控 #aBlock 類別
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 處理新增節點
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // 確保是元素節點
                        // 移除 .adsbygoogle 類別的元素
                        node.querySelectorAll('.adsbygoogle').forEach(function(adElement) {
                            console.log('Tampermonkey: 偵測到並移除 .adsbygoogle 元素。', adElement);
                            adElement.remove();
                        });
                        // 移除常見的廣告 iframe
                        node.querySelectorAll('iframe[src*="googlesyndication.com"], iframe[src*="doubleclick.net"]').forEach(function(iframe) {
                            console.log('Tampermonkey: 偵測到並移除廣告 iframe。', iframe);
                            iframe.remove();
                        });
                        // 如果新增的節點是 #aBlock 或包含 #aBlock，則清除其類別
                        if (node.id === 'aBlock' || node.querySelector('#aBlock')) {
                            clearABlockClasses();
                        }
                    }
                });
            }
            // 處理屬性變化 (特別針對 #aBlock 的 class 屬性)
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (mutation.target.id === 'aBlock') {
                    // 如果 #aBlock 的 class 屬性被修改了，立即清空它
                    clearABlockClasses();
                }
            }
        });
    });

    // 開始觀察整個文檔的子節點變化 (childList) 和子樹 (subtree)
    // 同時也觀察屬性變化 (attributes)，這樣可以捕捉到 className 的直接賦值
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true, // 監控屬性變化
        attributeFilter: ['class'] // 只監控 class 屬性的變化
    });

    // 在 DOMContentLoaded 時執行一次清理，以確保移除初始載入的廣告元素
    window.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.adsbygoogle').forEach(function(adElement) {
            console.log('Tampermonkey: DOMContentLoaded 時偵測到並移除 .adsbygoogle 元素。', adElement);
            adElement.remove();
        });
        document.querySelectorAll('iframe[src*="googlesyndication.com"], iframe[src*="doubleclick.net"]').forEach(function(iframe) {
            console.log('Tampermonkey: DOMContentLoaded 時偵測到並移除廣告 iframe。', iframe);
            iframe.remove();
        });
        // 在 DOMContentLoaded 時也檢查並移除 aBlock 上的所有類別
        clearABlockClasses();
    });

    // 8. 嘗試在頁面載入前注入 CSS 來隱藏廣告元素
    // 這種方法可以在 JavaScript 執行之前就提供視覺上的阻擋
    const style = document.createElement('style');
    style.textContent = `
        .adsbygoogle,
        [id*="google_ads_iframe"], /* 針對 AdSense 的 iframe ID 模式 */
        iframe[src*="googlesyndication.com"],
        iframe[src*="doubleclick.net"] {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
            visibility: hidden !important;
            pointer-events: none !important; /* 阻止任何互動 */
        }
    `;
    // 將 style 標籤添加到文檔的頭部或根元素，使其盡早生效
    document.documentElement.appendChild(style);


    // 9. 阻止 #aBlock 元素重新添加 'hidden' 或 'ad-block' 類別
    // 覆寫 setAttribute 方法
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (this.id === 'aBlock' && name.toLowerCase() === 'class') {
            const newClasses = value.split(' ').filter(cls => cls !== 'hidden' && cls !== 'ad-block').join(' ');
            if (newClasses !== value) {
                console.log(`Tampermonkey: 阻止 #aBlock 設置 class 屬性，移除了 'hidden'/'ad-block'。原始值: "${value}", 新值: "${newClasses}"`);
                return originalSetAttribute.call(this, name, newClasses);
            }
        }
        return originalSetAttribute.apply(this, arguments);
    };

    // 覆寫 classList.add 方法
    const originalClassListAdd = DOMTokenList.prototype.add;
    DOMTokenList.prototype.add = function() {
        if (this.ownerElement && this.ownerElement.id === 'aBlock') {
            const classesToAdd = Array.from(arguments);
            const filteredClasses = classesToAdd.filter(cls => cls !== 'hidden' && cls !== 'ad-block');

            if (filteredClasses.length < classesToAdd.length) {
                console.log(`Tampermonkey: 阻止 #aBlock 添加 'hidden'/'ad-block' 類別。嘗試添加: "${classesToAdd.join(' ')}", 實際添加: "${filteredClasses.join(' ')}"`);
            }
            if (filteredClasses.length > 0) {
                return originalClassListAdd.apply(this, filteredClasses);
            }
            return; // 不添加任何類別
        }
        return originalClassListAdd.apply(this, arguments);
    };

    // 覆寫 classList.remove 方法，確保它能正常移除其他類別
    const originalClassListRemove = DOMTokenList.prototype.remove;
    DOMTokenList.prototype.remove = function() {
        return originalClassListRemove.apply(this, arguments);
    };

    // 覆寫 classList.toggle 方法
    const originalClassListToggle = DOMTokenList.prototype.toggle;
    DOMTokenList.prototype.toggle = function(token, force) {
        if (this.ownerElement && this.ownerElement.id === 'aBlock' && (token === 'hidden' || token === 'ad-block')) {
            console.log(`Tampermonkey: 阻止 #aBlock 執行 toggle 'hidden'/'ad-block' 類別。`);
            return false; // 返回 false 表示沒有添加/移除
        }
        return originalClassListToggle.apply(this, arguments);
    };

    // 10. 立即執行一次清理，以防 #aBlock 在腳本載入時就存在並帶有類別
    // 由於 @run-at document-start，這會盡可能早地執行
    clearABlockClasses();

})();
