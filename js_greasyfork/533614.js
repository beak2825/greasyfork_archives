// ==UserScript==
// @name         Auto-E-Learning
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Auto Learning
// @author       By ShengYang with Gemini
// @match        https://elearn.hrd.gov.tw/*
// @match        https://*.elearn.hrd.gov.tw/*
// @match        https://mohw.elearn.hrd.gov.tw/learn/questionnaire/exam_start.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=elearn.hrd.gov.tw
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533614/Auto-E-Learning.user.js
// @updateURL https://update.greasyfork.org/scripts/533614/Auto-E-Learning.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = new URL(window.location.href);
    console.log('🚀 Auto-E-Learning 腳本已啟動，當前 URL:', window.location.href, '路徑:', url.pathname);

    if (url.pathname === "/learn/path/pathtree.php") {
        const skipBtn = document.createElement('button');
        skipBtn.innerText = '點擊開始掛網';
        Object.assign(skipBtn.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '9999',
            width: '150px',
            padding: '5px 20px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#007BFF',
            color: '#fff',
            fontSize: '13px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'background 0.3s'
        });
        skipBtn.onmouseover = () => skipBtn.style.backgroundColor = '#0056b3';
        skipBtn.onmouseout = () => skipBtn.style.backgroundColor = '#007BFF';

        skipBtn.onclick = () => {
            if (typeof pTicket !== 'undefined' && typeof cid !== 'undefined') {
                window.parent.parent.location.href = `/mooc/index.php?ticket=${pTicket}&cid=${cid}`;
            } else {
                alert('找不到 ticket 或 cid，無法跳過課程');
            }
        };

        document.body.appendChild(skipBtn);
    }

    if (url.pathname === "/mooc/index.php") {
        const params = new URLSearchParams(window.location.search);
        const ticket = params.get('ticket');
        const cid = params.get('cid');

        if (ticket && cid) {
            document.body.innerHTML = `
<div id="center-message" style="
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Noto Sans TC', sans-serif;
    font-size: 20px;
    color: #333;
    background-color: #f9f9f9;
    padding: 30px 40px;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.25);
    font-weight: bold;
    text-align: center;
    z-index: 9999;
    max-width: 90%;
    line-height: 1.6;
">
    <h1 style="margin-bottom: 10px; font-size: 24px;">自動上課中，請勿關閉本分頁</h1>
    <p style="font-size: 14px; margin-bottom: 20px;">請確保 電腦不會自動休眠 及 瀏覽器分頁被釋放記憶體 <br>設定 > 效能 > 【一律啟用這些網站】裡 新增白名單 <br> elearn.hrd.gov.tw 和 *.elearn.hrd.gov.tw </p>

    <div style="margin-bottom: 20px;">
        <a href="https://elearn.hrd.gov.tw/mooc/user/learn_dashboard.php?tab=1"
           style="display: inline-block; padding: 10px 20px;
                  background-color: #28a745; color: white; text-decoration: none;
                  border-radius: 6px; font-weight: 700; font-size: 14px;">
            回課程列表首頁
        </a>
    </div>

    <div style="font-size: 16px; margin-bottom: 15px;">
        <button class="timer-btn" data-minutes="30" style="margin: 0 5px 8px;">30 分鐘</button>
        <button class="timer-btn" data-minutes="60" style="margin: 0 5px 8px;">60 分鐘</button>
        <button class="timer-btn" data-minutes="90" style="margin: 0 5px 8px;">90 分鐘</button>
        <button class="timer-btn" data-minutes="120" style="margin: 0 5px 8px;">120 分鐘</button>
    </div>

    <div id="current-target" style="margin-bottom: 10px; font-size: 14px; color: #007BFF;"></div>
    <div id="countdown" style="margin-bottom: 10px; font-size: 14px;"></div>

    <div id="progress-bar" style="
        width: 100%;
        height: 12px;
        background: #e0e0e0;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
    ">
        <div id="progress" style="
            height: 100%;
            width: 0%;
            background: #007BFF;
            transition: width 0.3s ease;
        "></div>
    </div>
</div>
`;

            let targetTimestamp = null;
            let targetDuration = 0;
            let remainingTime = 0;

            const currentTargetDiv = document.getElementById('current-target');
            const countdownDiv = document.getElementById('countdown');
            const progressDiv = document.getElementById('progress');

            document.querySelectorAll('.timer-btn').forEach(btn => {
                btn.style.margin = '5px';
                btn.style.padding = '8px 16px';
                btn.style.border = 'none';
                btn.style.borderRadius = '6px';
                btn.style.backgroundColor = '#007BFF';
                btn.style.color = '#fff';
                btn.style.cursor = 'pointer';
                btn.style.fontSize = '14px';

                btn.addEventListener('click', () => {
                    const minutes = parseInt(btn.dataset.minutes);
                    const newDuration = minutes * 60 * 1000;
                    const now = new Date().getTime();

                    targetDuration = newDuration;
                    remainingTime = newDuration;
                    targetTimestamp = now + newDuration;
                    currentTargetDiv.innerText = `預計上課時間：${minutes} 分鐘`;
                    progressDiv.style.width = '0%';
                });
            });

            const countdownInterval = setInterval(() => {
                if (!targetTimestamp || targetDuration === 0) return;

                const now = new Date().getTime();
                remainingTime = targetTimestamp - now;

                if (remainingTime <= 0) {
                    clearInterval(countdownInterval);
                    window.location.href = "https://elearn.hrd.gov.tw/mooc/user/learn_dashboard.php?tab=2";
                } else {
                    const mins = Math.floor(remainingTime / 60000);
                    const secs = Math.floor((remainingTime % 60000) / 1000);
                    countdownDiv.innerText = `剩餘時間：${mins} 分 ${secs < 10 ? '0' + secs : secs} 秒`;

                    const percent = Math.min(100, Math.max(0, ((targetDuration - remainingTime) / targetDuration) * 100));
                    progressDiv.style.width = `${percent.toFixed(1)}%`;
                }
            }, 1000);

            window.setInterval(() => {
                fetch("/mooc/controllers/course_record.php?actype=end", {
                    headers: {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body: `action=setReading&type=end&ticket=${ticket}&enCid=${cid}`,
                    method: "POST"
                });
                console.log("✅ 打卡成功");
            }, 10000);
        }
    }



    // Capture exam title from pre-start page and store in localStorage
    if (url.pathname.includes("/learn/questionnaire/exam_start.php") || url.pathname.includes("/learn/exam/exam_start.php")) {
        console.log('🔍 Auto-E-Learning 腳本已載入，當前 URL:', window.location.href);
        window.addEventListener('load', () => {
            // Try to find and store the exam title from the pre-start page
            const labelTd = Array.from(document.querySelectorAll('td')).find(td => td.textContent.includes('測驗名稱'));
            if (labelTd && labelTd.nextElementSibling) {
                const title = labelTd.nextElementSibling.textContent.trim();
                if (title) {
                    localStorage.setItem('examTitle', title);
                    console.log('✅ 儲存測驗名稱到 localStorage:', title);
                }
            }
        });
    }

    // Enhanced exam page handling - ONLY for exam pages, not questionnaire
    if (url.pathname.includes("/learn/exam/exam_start.php")) {
        // Defer UI creation until the page is fully loaded to avoid interfering with native scripts
        window.addEventListener('load', () => {
            // Show reminder to user
            //alert('⚠️ 提醒：請將測驗題目複製貼上到左側搜尋框，即可快速找到答案！');
            // Create left pane for answer searcher as an overlay
            const leftPane = document.createElement('div');
            leftPane.style.position = 'fixed';
            leftPane.style.top = '0';
            leftPane.style.left = '0';
            leftPane.style.width = '30%';
            leftPane.style.height = '100vh';
            leftPane.style.overflowY = 'auto';
            leftPane.style.borderRight = '2px solid #ccc';
            leftPane.style.padding = '10px';
            leftPane.style.background = '#fff';
            leftPane.style.zIndex = '9999';
            // Push the main content to the right to avoid overlap
            document.body.style.marginLeft = '30%';
            document.body.style.boxSizing = 'border-box';
            // Search UI
            const searchBox = document.createElement('input');
            searchBox.type = 'text';
            searchBox.placeholder = '輸入課程標題(用關鍵字搜且不要有特殊符號)';
            searchBox.style.width = '65%';
            searchBox.style.padding = '10px';
            searchBox.style.border = '1px solid #ccc';
            searchBox.style.borderRadius = '4px';
            // Try to auto‑populate with exam title if available
            function setExamTitleRetry(attempt = 0) {
                // Limit retries to avoid infinite loop
                if (attempt > 10) {
                    // If still not found, try to read from localStorage
                    const storedTitle = localStorage.getItem('examTitle');
                    if (storedTitle) {
                        searchBox.value = storedTitle;
                        console.log('✅ 從 localStorage 讀取測驗名稱:', storedTitle);
                    }
                    return;
                }
                let title = '';
                // Find the <td> label "測驗名稱" and get its sibling text
                const labelTd = Array.from(document.querySelectorAll('td')).find(td => td.textContent.includes('測驗名稱'));
                if (labelTd && labelTd.nextElementSibling) {
                    title = labelTd.nextElementSibling.textContent.trim();
                    console.log('✅ 找到測驗名稱:', title);
                }
                // Fallback to generic selectors if not found
                if (!title) {
                    const possibleSelectors = ['h1', '.exam-title', '.title', '#examTitle', '.questionnaire-title'];
                    for (const sel of possibleSelectors) {
                        const el = document.querySelector(sel);
                        if (el && el.textContent.trim()) { title = el.textContent.trim(); break; }
                    }
                }
                if (title) {
                    searchBox.value = title;
                    localStorage.setItem('examTitle', title);
                } else {
                    // Try to read from localStorage first
                    const storedTitle = localStorage.getItem('examTitle');
                    if (storedTitle) {
                        searchBox.value = storedTitle;
                        console.log('✅ 從 localStorage 讀取測驗名稱:', storedTitle);
                    } else {
                        // Retry after a short delay
                        setTimeout(() => setExamTitleRetry(attempt + 1), 300);
                    }
                }
            }
            // Start the retry process after UI is ready
            setExamTitleRetry();

            searchBox.style.fontSize = '14px';
            searchBox.style.boxSizing = 'border-box';
            const searchBtn = document.createElement('button');
            searchBtn.textContent = '搜尋';
            searchBtn.style.padding = '10px 16px';
            searchBtn.style.marginTop = '20px';  // Add clear spacing between search box and button
            searchBtn.style.background = '#007BFF';
            searchBtn.style.color = '#fff';
            searchBtn.style.border = 'none';
            searchBtn.style.borderRadius = '4px';
            searchBtn.style.cursor = 'pointer';
            searchBtn.style.fontSize = '14px';
            searchBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            const resultsDiv = document.createElement('div');
            resultsDiv.style.marginTop = '10px';
            leftPane.appendChild(searchBox);
            leftPane.appendChild(searchBtn);
            leftPane.appendChild(resultsDiv);
            document.body.appendChild(leftPane);
            // Inject CSS for answer items and highlight
            const styleEl = document.createElement('style');
            styleEl.textContent = `
    .answer-item {
        border: 1px solid #e0e0e0;
        margin: 4px 0;
        padding: 8px 12px;
        border-radius: 6px;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 13px;
        line-height: 1.5;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        transition: all 0.2s ease;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    .answer-item:hover {
        box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        transform: translateY(-1px);
        border-color: #007BFF;
    }
    .answer-item.highlight {
        background: linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%);
        border-color: #ffc107;
        box-shadow: 0 2px 8px rgba(255,193,7,0.25);
    }
    .answer-item strong {
        color: #007BFF;
        font-weight: 600;
    }
    #resultsTitle {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 12px 0 8px 0;
        padding-bottom: 6px;
        border-bottom: 2px solid #007BFF;
    }
`;
            document.head.appendChild(styleEl);
            // Search box to locate answers within left pane
            const locateContainer = document.createElement('div');
            locateContainer.style.position = 'fixed';
            locateContainer.style.top = '5%';
            locateContainer.style.left = '31%';  // At the boundary between left pane and right pane
            locateContainer.style.transform = 'translateY(-50%)';
            locateContainer.style.display = 'flex';
            locateContainer.style.flexDirection = 'column';
            locateContainer.style.alignItems = 'flex-start';
            locateContainer.style.gap = '8px';
            locateContainer.style.zIndex = '10000';
            locateContainer.style.paddingLeft = '10px';  // Small offset from the edge
            const locateBox = document.createElement('input');
            locateBox.type = 'text';
            locateBox.placeholder = '快速模糊文字搜尋！';
            locateBox.style.width = '150px';
            locateBox.style.padding = '8px 10px';
            locateBox.style.border = '1px solid #ccc';
            locateBox.style.borderRadius = '4px';
            locateBox.style.fontSize = '13px';
            locateBox.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            locateContainer.appendChild(locateBox);
            leftPane.appendChild(locateContainer);

            // Real-time locate functionality
            const performLocate = () => {
                const query = locateBox.value.trim().toLowerCase();
                const items = resultsDiv.querySelectorAll('.answer-item');
                let firstMatch = null;
                items.forEach(item => {
                    if (item.textContent.toLowerCase().includes(query) && query) {
                        item.classList.add('highlight');
                        if (!firstMatch) firstMatch = item;
                    } else {
                        item.classList.remove('highlight');
                    }
                });
                if (firstMatch) firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            };

            // Trigger search on input (typing) and paste events for real-time search
            locateBox.addEventListener('input', performLocate);
            locateBox.addEventListener('paste', () => {
                // Use setTimeout to ensure paste content is available
                setTimeout(performLocate, 10);
            });
            locateBox.addEventListener('keypress', e => { if (e.key === 'Enter') { e.preventDefault(); performLocate(); } });

            // Search functionality (same as before)
            function performSearch(query) {
                resultsDiv.innerHTML = '搜尋中...';
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://roddayeye.pixnet.net/blog/post/325785090',
                    onload: function (response) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const links = Array.from(doc.querySelectorAll('a')).filter(a => a.textContent.includes(query));
                        if (links.length === 0) {
                            resultsDiv.innerHTML = '未找到相關課程。';
                            return;
                        }
                        const firstLink = links[0].href;
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: firstLink,
                            onload: function (ansResp) {
                                const ansDoc = parser.parseFromString(ansResp.responseText, 'text/html');
                                const rows = ansDoc.querySelectorAll('tr');
                                let html = '<h3 id="resultsTitle">📝 答案預覽</h3>';
                                rows.forEach(row => {
                                    const text = row.innerText.trim();
                                    // Skip empty rows and rows with only whitespace
                                    if (text && text.length > 1) {
                                        // Check if this is a question (contains Q)
                                        if (text.startsWith('Q') || text.includes('問題')) {
                                            html += '<div class="answer-item"><strong>🔹 ' + text + '</strong></div>';
                                        } else {
                                            html += '<div class="answer-item">' + text + '</div>';
                                        }
                                    }
                                });
                                resultsDiv.innerHTML = html;
                            },
                            onerror: function () { resultsDiv.innerHTML = '取得答案失敗。'; }
                        });
                    },
                    onerror: function () { resultsDiv.innerHTML = '搜尋失敗。'; }
                });
            }
            searchBtn.addEventListener('click', () => { const q = searchBox.value.trim(); if (q) performSearch(q); });
            searchBox.addEventListener('keypress', e => { if (e.key === 'Enter') { e.preventDefault(); searchBtn.click(); } });
        });
    }

    // Auto-fill and submit for questionnaire pages ONLY
    if (url.pathname.includes('/learn/questionnaire/exam_start.php')) {
        window.addEventListener('load', () => {
            function autoFillAndSubmit() {
                window.confirm = (msg) => { console.log('✅ 攔截 confirm 並自動點選確定:', msg); return true; };
                let alertCount = 0;
                window.alert = (msg) => { alertCount++; console.log(`✅ 攔截第 ${alertCount} 次 alert，訊息為:`, msg); };
                const radios = document.querySelectorAll('input[type="radio"]');
                const radioGroups = {};
                radios.forEach(r => { if (!radioGroups[r.name]) radioGroups[r.name] = []; radioGroups[r.name].push(r); });
                Object.values(radioGroups).forEach(g => { const sel = g.find(r => r.value === 'C') || g[2]; if (sel) sel.checked = true; });
                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                const checkboxGroups = {};
                checkboxes.forEach(b => { if (!checkboxGroups[b.name]) checkboxGroups[b.name] = []; checkboxGroups[b.name].push(b); });
                Object.values(checkboxGroups).forEach(g => { g.slice(0, 3).forEach(b => b.checked = true); });
                const submitBtn = document.querySelector('input[type="submit"], button[type="submit"], input[value="送出"]');
                if (submitBtn) setTimeout(() => submitBtn.click(), 1000);
            }
            setTimeout(autoFillAndSubmit, 500);
        });
    }
})();
