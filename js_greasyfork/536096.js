// ==UserScript==
// @name        Bible.com iframe specific styles
// @namespace   Violentmonkey Scripts
// @match       *://www.bible.com/*
// @grant       none
// @version     2.0b
// 改善字體大細个調整成功率、增加單節頁面／歸章頁面連結撳鈕
// @author      Aiuanyu x Gemini
// @description Adds a class to html if bible.com is in an iframe. Adjusts font size of parallel versions to fit the left column. Accepts parent scrolling messages.
// @description:zh-TW 當 bible.com 在 iframe 裡時，給 <html> 加個 class。調整並列版本个字體大小，讓佇左邊个欄位內看起來較好。接受上層網頁共下捲動个命令。
// @downloadURL https://update.greasyfork.org/scripts/536096/Biblecom%20iframe%20specific%20styles.user.js
// @updateURL https://update.greasyfork.org/scripts/536096/Biblecom%20iframe%20specific%20styles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const multiVersionLinkId = 'multi-version-link'; // Define globally within the IIFE
    let topWindowObserver = null; // To hold the observer for the top window
    let lastCheckedHrefForPolling = location.href; // For URL polling

    if (window.self !== window.top) {
        document.documentElement.classList.add('is-in-iframe');
        console.log('Bible.com 在 iframe 內，已為 <html> 加入 "is-in-iframe" class。');

        // 當 iframe 內容載入完成後，嘗試調整並列版本个字體大小
        window.addEventListener('load', function () {
            // 等待所有字體載入完成 (e.g., web fonts used by bible.com itself)
            document.fonts.ready.then(function () {
                // Add a small delay AFTER fonts are ready and page is loaded,
                // to give bible.com's own scripts more time to render dynamic content
                // before we start measuring heights.
                const initialAdjustmentDelay = 1500; // 1.5 秒
                console.log(`所有字體載入完成。等待 ${initialAdjustmentDelay}ms 後嘗試調整字體。`);
                setTimeout(function() {
                    adjustParallelFontSize();
                }, initialAdjustmentDelay);
            }).catch(function (error) {
                console.warn('字體載入錯誤或超時，仍嘗試調整字體：', error);
                setTimeout(function() { adjustParallelFontSize(); }, 1500); // 若有錯誤，也延遲一下再試
            });
        });
        
        // 監聽來自父視窗 (index.html) 的訊息
        window.addEventListener('message', function(event) {
            // 為著安全，可以檢查訊息來源 event.origin
            // 但因為 index.html 可能係 file:// 協定，event.origin 會係 'null'
            // 所以，檢查 event.source 是不是 window.top 會較穩當
            // if (event.source !== window.top) { // 暫時允許任何來源，方便本地測試
            //     console.log('Userscript: Message ignored, not from top window or expected origin.');
            //     return;
            // }

            if (event.data && event.data.type === 'SYNC_SCROLL_TO_PERCENTAGE') {
                const percentage = parseFloat(event.data.percentage);
                if (isNaN(percentage) || percentage < 0 || percentage > 1) {
                    console.warn('Userscript: 收到無效个捲動百分比：', event.data.percentage);
                    return;
                }

                const de = document.documentElement;
                const scrollableDistance = de.scrollHeight - de.clientHeight;
                
                if (scrollableDistance <= 0) {
                    // console.log('Userscript: 內容毋需捲動。');
                    return; 
                }
                
                const scrollToY = scrollableDistance * percentage;
                // console.log(`Userscript: Scrolling to ${percentage*100}%, ${scrollToY}px. Scrollable: ${scrollableDistance}, Total: ${de.scrollHeight}, Visible: ${de.clientHeight}`);
                window.scrollTo({ top: scrollToY, behavior: 'auto' }); // 'auto' 表示立即捲動
            }
        });

    } else {
        console.log('Bible.com 為頂層視窗。');
        // 當 bible.com 在頂層視窗時，執行个邏輯 (等待 DOM 載入完成)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', mainTopWindowLogic);
        } else {
            mainTopWindowLogic(); // DOM 已載入
        }
    }

    function mainTopWindowLogic() {
        console.log('DOM 已就緒，初始化頂層視窗个多版本連結邏輯。');
        // 初次嘗試加入/更新連結
        addOrUpdateMultiVersionLink();

        // 設定 MutationObserver 來監測 DOM 變化
        if (topWindowObserver) {
            topWindowObserver.disconnect();
        }
        topWindowObserver = new MutationObserver((mutations) => {
            // 任何 DOM 變化都可能影響目標或 URL，所以重新執行檢查邏輯
            // console.log('偵測到 Body 內容變動，重新評估連結狀態。'); // 這訊息可能會太頻繁
            addOrUpdateMultiVersionLink();
        });

        // 監測 body 元素个子節點列表及子樹變化
        topWindowObserver.observe(document.body, { childList: true, subtree: true });

        // 監聽瀏覽歷史變化事件
        window.addEventListener('popstate', () => { console.log('popstate 事件觸發，重新評估連結狀態。'); addOrUpdateMultiVersionLink(); });
        window.addEventListener('hashchange', () => { console.log('hashchange 事件觸發，重新評估連結狀態。'); addOrUpdateMultiVersionLink(); });

        // 定時檢查 URL 變化 (作為 pushState 等事件个備援方案)
        setInterval(() => {
            if (location.href !== lastCheckedHrefForPolling) {
                console.log(`偵測到 URL 變化 (輪詢)：${lastCheckedHrefForPolling} -> ${location.href}，重新評估連結狀態。`);
                lastCheckedHrefForPolling = location.href;
                addOrUpdateMultiVersionLink();
            }
        }, 1000); // 每秒檢查一次
    }

    // 取得書卷个中文顯示名稱 (Hakka/Traditional Chinese)
    function getBookDisplayName(bookCode) {
        const bookMap = {
            // Old Testament - 舊約
            "GEN": "創世記", "EXO": "出埃及記", "LEV": "利未記", "NUM": "民數記", "DEU": "申命記",
            "JOS": "約書亞記", "JDG": "士師記", "RUT": "路得記", "1SA": "撒母耳記上", "2SA": "撒母耳記下",
            "1KI": "列王紀上", "2KI": "列王紀下", "1CH": "歷代志上", "2CH": "歷代志下", "EZR": "以斯拉記",
            "NEH": "尼希米記", "EST": "以斯帖記", "JOB": "約伯記", "PSA": "詩篇", "PRO": "箴言",
            "ECC": "傳道書", "SNG": "雅歌", "ISA": "以賽亞書", "JER": "耶利米書", "LAM": "耶利米哀歌",
            "EZK": "以西結書", "DAN": "但以理書", "HOS": "何西阿書", "JOL": "約珥書", "AMO": "阿摩司書",
            "OBA": "俄巴底亞書", "JON": "約拿書", "MIC": "彌迦書", "NAM": "那鴻書", "HAB": "哈巴谷書",
            "ZEP": "西番雅書", "HAG": "哈該書", "ZEC": "撒迦利亞書", "MAL": "瑪拉基書",
            // New Testament - 新約
            "MAT": "馬太福音", "MRK": "馬可福音", "LUK": "路加福音", "JHN": "約翰福音", "ACT": "使徒行傳",
            "ROM": "羅馬書", "1CO": "哥林多前書", "2CO": "哥林多後書", "GAL": "加拉太書", "EPH": "以弗所書",
            "PHP": "腓立比書", "COL": "歌羅西書", "1TH": "帖撒羅尼迦前書", "2TH": "帖撒羅尼迦後書",
            "1TI": "提摩太前書", "2TI": "提摩太後書", "TIT": "提多書", "PHM": "腓利門書", "HEB": "希伯來書",
            "JAS": "雅各書", "1PE": "彼得前書", "2PE": "彼得後書", "1JN": "約翰一書", "2JN": "約翰二書",
            "3JN": "約翰三書", "JUD": "猶大書", "REV": "啟示錄"
        };
        return bookMap[bookCode.toUpperCase()] || bookCode; // 若尋無對應，就用原底个 bookCode
    }

    function addOrUpdateMultiVersionLink() {
        const url = window.location.href;
        // Regex to capture book (e.g., PSA), chapter (e.g., 18), and verse (e.g., 2)
        const singleVerseRegex = /\/bible\/\d+\/([A-Z1-3]{3})\.(\d+)\.(\d+)/;
        // Regex for chapter page: book.chapter (potentially followed by version info, but not another verse number)
        const chapterPageRegex = /\/bible\/\d+\/([A-Z1-3]{3})\.(\d+)/;

        const singleVerseMatch = url.match(singleVerseRegex);
        const targetDivSelector = 'div.flex.flex-col.md\\:flex-row.items-center.gap-2.mbs-3';
        const existingInlineLink = document.getElementById(multiVersionLinkId); // 修正變數名稱
        const floatingButtonId = 'multi-version-chapter-float-btn'; // 新增浮動撳鈕个 ID
        const existingFloatingButton = document.getElementById(floatingButtonId);

        if (singleVerseMatch) {
            // 係單節經文頁面
            const book = singleVerseMatch[1];
            const chapter = singleVerseMatch[2];
            const bookNameToDisplay = getBookDisplayName(book);
            const targetDiv = document.querySelector(targetDivSelector);

            // 移除可能存在个浮動章節連結
            if (existingFloatingButton) {
                console.log('單節經文頁面，移除浮動章節連結。');
                existingFloatingButton.remove();
            }

            if (!targetDiv) {
                if (existingInlineLink) {
                    console.log('單節經文頁面，目標 <div> 未尋到，移除可能殘留个內嵌連結。');
                    existingInlineLink.remove();
                }
                return;
            }

            const expectedHref = `https://aiuanyu.github.io/6BibleVersions/?book=${book}&chapter=${chapter}`;
            const expectedTextContent = `4 語言 6 版本對照讀 ${bookNameToDisplay} ${chapter}`;

            if (existingInlineLink) {
                // 內嵌連結已存在，檢查並更新
                let updated = false;
                // 檢查係毋係在正確个位置 (第一個子元素)
                if (existingInlineLink.parentElement !== targetDiv || existingInlineLink !== targetDiv.firstChild) {
                    targetDiv.insertBefore(existingInlineLink, targetDiv.firstChild);
                    updated = true;
                }
                if (existingInlineLink.href !== expectedHref) {
                    existingInlineLink.href = expectedHref;
                    updated = true;
                }
                const pElement = existingInlineLink.querySelector('p');
                if (pElement && pElement.textContent !== expectedTextContent) {
                    pElement.textContent = expectedTextContent;
                    updated = true;
                }
                if (updated) console.log(`內嵌連結已更新: ${bookNameToDisplay} ${chapter}`);
            } else {
                // 內嵌連結毋存在，建立並加入
                const newLink = document.createElement('a');
                newLink.className = "overflow-hidden font-bold ease-in-out duration-100 focus:outline-2 focus:outline-info-light dark:focus:outline-info-dark hover:shadow-light-2 disabled:text-gray-50 dark:disabled:bg-gray-40 dark:disabled:text-white disabled:hover:shadow-none disabled:opacity-50 disabled:bg-gray-10 disabled:cursor-not-allowed w-full max-w-fit bg-gray-15 dark:bg-gray-35 text-gray-50 dark:text-white hover:bg-gray-10 dark:hover:bg-gray-30 active:bg-gray-20 dark:active:bg-gray-40 rounded-3 text-xs pis-2 pie-3 h-6 cursor-pointer flex md:w-min items-center group static no-underline";
                newLink.href = expectedHref;
                newLink.target = '_blank';
                newLink.rel = 'noopener noreferrer';
                newLink.id = multiVersionLinkId;

                const svgString = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 mie-0.5" size="24">
                        <path d="M16 3H5C3.89543 3 3 3.89543 3 5V16H5V5H16V3Z" style="--darkreader-inline-fill: currentColor;" data-darkreader-inline-fill=""></path>
                        <path d="M20 7H9C7.89543 7 7 7.89543 7 9V20C7 21.1046 7.89543 22 9 22H20C21.1046 22 22 21.1046 22 20V9C22 7.89543 21.1046 7 20 7ZM20 20H9V9H20V20Z" style="--darkreader-inline-fill: currentColor;" data-darkreader-inline-fill=""></path>
                    </svg>`;
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = svgString.trim();
                const svgElement = tempDiv.firstChild;
                if (svgElement) newLink.appendChild(svgElement);

                const textSpan = document.createElement('span');
                textSpan.className = 'truncate';
                const pElement = document.createElement('p');
                pElement.className = 'text-text-light dark:text-text-dark font-aktiv-grotesk mis-1';
                pElement.textContent = expectedTextContent;
                textSpan.appendChild(pElement);
                newLink.appendChild(textSpan);

                requestAnimationFrame(() => {
                    const currentTargetDiv = document.querySelector(targetDivSelector);
                    if (currentTargetDiv && !document.getElementById(multiVersionLinkId)) {
                        currentTargetDiv.insertBefore(newLink, currentTargetDiv.firstChild);
                        console.log(`已為 ${bookNameToDisplay} ${chapter} 加入內嵌連結。`);
                    }
                });
            }
        } else {
            // 非單節經文頁面，檢查敢係歸章个頁面
            const chapterMatch = url.match(chapterPageRegex);
            if (chapterMatch) {
                // 檢查 BOOK.CHAPTER 後面个部分，確保毋係數字 (代表經節)
                const pathPartAfterChapterMatch = url.substring(chapterMatch.index + chapterMatch[0].length);
                const isTrueChapterPage = !pathPartAfterChapterMatch.startsWith('.') || isNaN(parseInt(pathPartAfterChapterMatch.substring(1).split('.')[0]));

                if (isTrueChapterPage) {
                    // 係歸章个頁面
                    const book = chapterMatch[1];
                    const chapter = chapterMatch[2];

                    // 移除可能存在个內嵌連結
                    if (existingInlineLink) {
                        console.log('章節頁面，移除內嵌連結。');
                        existingInlineLink.remove();
                    }
                    // 加入或更新浮動撳鈕
                    addOrUpdateFloatingChapterButton(book, chapter, floatingButtonId);
                } else {
                    // 雖然符合 chapterPageRegex，但其實係單節經文頁面 (例如 /PSA.23.1)
                    // 這情況照理愛由 singleVerseMatch 處理，這係一個額外个防護
                    if (existingInlineLink) existingInlineLink.remove();
                    if (existingFloatingButton) existingFloatingButton.remove();
                }
            } else {
                // 非單節經文頁面，也非歸章个頁面 (例如首頁)
                if (existingInlineLink) {
                    console.log('非經文頁面，移除內嵌連結。');
                    existingInlineLink.remove();
                }
                if (existingFloatingButton) {
                    console.log('非經文頁面，移除浮動章節連結。');
                    existingFloatingButton.remove();
                }
            }
        }
    }

    function addOrUpdateFloatingChapterButton(book, chapter, buttonId) {
        const bookNameToDisplay = getBookDisplayName(book);
        let button = document.getElementById(buttonId);
        const expectedHref = `https://aiuanyu.github.io/6BibleVersions/?book=${book}&chapter=${chapter}`;
        const expectedText = "4 語 6 版"; // 撳鈕文字

        if (button) {
            // 浮動撳鈕已存在，檢查並更新
            let updated = false;
            if (button.href !== expectedHref) {
                button.href = expectedHref;
                updated = true;
            }
            if (button.textContent !== expectedText) {
                button.textContent = expectedText;
                updated = true;
            }
            // 檢查樣式，確保佢還係浮動个 (雖然較少機會分改忒)
            if (button.style.position !== 'fixed') {
                button.style.position = 'fixed';
                updated = true;
            }
            if (updated) console.log(`浮動章節連結已更新: ${bookNameToDisplay} ${chapter}`);
        } else {
            // 浮動撳鈕毋存在，建立佢
            button = document.createElement('a');
            button.id = buttonId;
            button.href = expectedHref;
            button.textContent = expectedText;
            button.target = '_blank';
            button.rel = 'noopener noreferrer';
            button.classList.add('custom-floating-bible-link'); // 加一個 class 方便未來調整

            // 設定浮動樣式
            button.style.position = 'fixed';
            button.style.top = '80px'; // 考慮到 bible.com 本身个頂部 header
            button.style.right = '20px';
            button.style.zIndex = '10000'; // 確保在最上層
            button.style.padding = '8px 12px';
            button.style.backgroundColor = 'rgba(90, 90, 90, 0.85)'; // 深灰色半透明背景
            button.style.color = 'white';
            button.style.textDecoration = 'none';
            button.style.borderRadius = '5px';
            button.style.fontSize = '14px';
            button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            button.style.transition = 'background-color 0.3s ease'; // 加一息仔滑鼠移過个效果

            button.onmouseover = () => { button.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; };
            button.onmouseout = () => { button.style.backgroundColor = 'rgba(90, 90, 90, 0.85)'; };


            document.body.appendChild(button);
            console.log(`已為 ${bookNameToDisplay} ${chapter} 加入浮動章節連結。`);
        }
    }

    function adjustParallelFontSize(retryAttempt = 0) {
        const MAX_RETRIES = 10; // 增加重試次數
        const RETRY_DELAY = 1200; // 每次重試之間等 1.2 秒鐘
        const MIN_COLUMN_HEIGHT_THRESHOLD = 50; // px, 用來判斷內容敢有顯示出來个基本高度

        try { // try...catch 包住整個函數个內容
            const params = new URLSearchParams(window.location.search);
            const parallelVersionId = params.get('parallel');

            if (!parallelVersionId) {
                console.log('網址中無尋到並列版本 ID，跳過字體調整。');
                return;
            }

            // 取得左欄主要版本个 ID
            const pathSegments = window.location.pathname.match(/\/bible\/(\d+)\//);
            if (!pathSegments || !pathSegments[1]) {
                console.log('無法從路徑中提取主要版本 ID，跳過字體調整。');
                return;
            }
            const mainVersionId = pathSegments[1];

            const leftDataVidSelector = `[data-vid="${mainVersionId}"]`;
            const rightDataVidSelector = `[data-vid="${parallelVersionId}"]`;

            // 找出並列閱讀个主要容器 (根據先前个 HTML 結構)
            const parallelContainer = document.querySelector('div.grid.md\\:grid-cols-2, div.grid.grid-cols-1.md\\:grid-cols-2');
            if (!parallelContainer) {
                console.log('並列容器 (例如 div.grid.md:grid-cols-2) 未尋到。');
                return;
            }

            const columns = Array.from(parallelContainer.children).filter(el => getComputedStyle(el).display !== 'none');
            if (columns.length < 2) {
                console.log('在並列容器中尋到少於兩个可見欄位。');
                return;
            }

            const leftColumnEl = columns[0];
            const rightColumnEl = columns[1];

            const leftVersionDiv = leftColumnEl.querySelector(leftDataVidSelector);
            const rightVersionDiv = rightColumnEl.querySelector(rightDataVidSelector);

            if (!leftVersionDiv || !rightVersionDiv) {
                console.log(`左欄 (${leftDataVidSelector}) 或右欄 (${rightDataVidSelector}) 个內容 div 未尋到。`);
                if (retryAttempt < MAX_RETRIES -1) { // 為元素搜尋保留一些重試次數
                    console.warn(`在 ${RETRY_DELAY}ms 後重試元素搜尋 (嘗試 ${retryAttempt + 1}/${MAX_RETRIES})`);
                    setTimeout(() => adjustParallelFontSize(retryAttempt + 1), RETRY_DELAY);
                } else {
                    console.error('內容 div 元素搜尋在最大重試次數後失敗。中止字體調整。');
                }
                return; // 若元素無尋到，愛 return 避免錯誤
            }

            // At this point, elements are found. Now check if they have rendered content.
            // Force reflow before measurement
            leftVersionDiv.offsetHeight;
            rightVersionDiv.offsetHeight; // Ensure reflow before measurement
            const currentLeftHeight = leftVersionDiv.offsetHeight;

            if (currentLeftHeight < MIN_COLUMN_HEIGHT_THRESHOLD && retryAttempt < MAX_RETRIES) { // 若左欄高度無夠
                console.warn(`左欄高度 (${currentLeftHeight}px) 低於門檻值 (${MIN_COLUMN_HEIGHT_THRESHOLD}px)。內容可能尚未完全渲染。在 ${RETRY_DELAY}ms 後重試 (嘗試 ${retryAttempt + 1}/${MAX_RETRIES})`);
                setTimeout(() => adjustParallelFontSize(retryAttempt + 1), RETRY_DELAY);
                return;
            }
            if (currentLeftHeight < MIN_COLUMN_HEIGHT_THRESHOLD && retryAttempt >= MAX_RETRIES) { // 重試了後還係無夠高
                console.error(`左欄高度 (${currentLeftHeight}px) 在 ${MAX_RETRIES} 次重試後仍低於門檻值。中止字體調整。`);
                return; // 放棄調整
            }

            console.log('尋到左欄版本 Div:', leftVersionDiv, '尋到右欄版本 Div:', rightVersionDiv);

            // 使用 requestAnimationFrame 來確保 DOM 操作和測量是在瀏覽器準備好繪製下一幀之前進行
            // If we reach here, elements are found and left column has some content.
            requestAnimationFrame(() => {
                // 開始調整字體
                let currentFontSize = 90; // 初始字體大小
                rightVersionDiv.style.fontSize = currentFontSize + '%';

                // The leftHeight from *before* rAF (currentLeftHeight) should be the reference.
                let leftHeight = currentLeftHeight;
                // Ensure right column also reflows with its new font size
                let rightHeight = rightVersionDiv.offsetHeight; // 獲取初始高度

                console.log(`初始檢查字體 ${currentFontSize}%：右欄高度 ${rightHeight}px，左欄高度 ${leftHeight}px (參考值)`);

                // 如果初始字體大小就已經讓右邊內容不比左邊長，就不用調整了
                if (rightHeight <= leftHeight) {
                    console.log('初始字體大小 ' + currentFontSize + '% 已足夠或更短。');
                    return;
                }

                // 如果初始字體大小讓右邊內容比左邊長，就開始縮小字體
                // 預設使用最小个測試字體 (50%)，假使所有測試過个字體都還係分右邊太長。
                let bestFitFontSize = 50;
                let foundOptimalAdjustment = false;

                for (let testSize = currentFontSize - 1; testSize >= 50; testSize--) { // 從比初始值小1%開始，最細到 50%
                    rightVersionDiv.style.fontSize = testSize + '%';
                    rightHeight = rightVersionDiv.offsetHeight; // 每次改變字體大小後，重新獲取高度 (強制 reflow)

                    if (rightHeight > leftHeight) {
                        // 這隻 testSize 還係分右邊太長，繼續試較細个字體。
                        // 假使這係迴圈最後一次 (testSize == 50) 而且還係太長，
                        // bestFitFontSize 會維持在 50%。
                    } else {
                        // 這隻 testSize 分右邊內容變到毋比左邊長了 (<=)。
                        // 照你个要求，𠊎等愛用前一隻字體大細 (testSize + 1)，
                        // 因為該隻字體大細會分右邊「略略仔長過左邊」。
                        bestFitFontSize = testSize + 1;
                        foundOptimalAdjustment = true;
                        console.log(`右欄內容在 ${testSize}% 時變短/相等 (高度 ${rightHeight}px)。套用前一個較大个字體 ${bestFitFontSize}%。`);
                        break; // 尋到臨界點了，跳出迴圈
                    }
                }

                if (!foundOptimalAdjustment && currentFontSize > 50) {
                    // 假使迴圈跑完，foundOptimalAdjustment 還係 false，
                    // 表示從 (currentFontSize - 1) 到 50% 所有字體都還係分右邊太長。
                    // 在這情況下，bestFitFontSize 已經係 50%。
                    console.log(`所有測試過个字體 (從 ${currentFontSize - 1}% 到 50%) 仍使右欄內容過長。使用最小測試字體：50%。`);
                }

                // 迴圈結束後，將字體設定為決定好个大小
                rightVersionDiv.style.fontSize = bestFitFontSize + '%';
                // 為著準確記錄最終狀態，重新量一次高度
                const finalRightHeight = rightVersionDiv.offsetHeight;
                console.log('' + rightDataVidSelector + ' 最終調整後字體大小為 ' + bestFitFontSize + '%。最終右欄內容高度：' + finalRightHeight + 'px，左欄內容高度：' + leftHeight + 'px');
            });
        } catch (error) {
            console.error('調整字體大小期間發生錯誤：', error);
        }
    }
})();
