// ==UserScript==
// @name         監理服務網 - 靚號控制面板(自用) v5.4
// @namespace    none
// @version      5.4
// @description  靚號控制面板、自訂號碼、統計、提示框、自動翻頁、閃爍高亮、hover顯示規則、折疊拖曳
// @author       hongyu
// @match        https://www.mvdis.gov.tw/m3-emv-plate/webpickno/queryPickNo*
// @icon         https://www.mvdis.gov.tw/stheader2.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406214/%E7%9B%A3%E7%90%86%E6%9C%8D%E5%8B%99%E7%B6%B2%20-%20%E9%9D%9A%E8%99%9F%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF%28%E8%87%AA%E7%94%A8%29%20v54.user.js
// @updateURL https://update.greasyfork.org/scripts/406214/%E7%9B%A3%E7%90%86%E6%9C%8D%E5%8B%99%E7%B6%B2%20-%20%E9%9D%9A%E8%99%9F%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF%28%E8%87%AA%E7%94%A8%29%20v54.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---------------- 自訂號碼與規則 ---------------- */
    let defaultOptions = [{
            key: 'allSwitch',
            name: '全選',
            type: 'switch',
            enabled: true
        },
        {
            key: 'twoSame',
            name: '兩兩相同(AABB)',
            color: '#FF7F50',
            enabled: true,
            type: 'rule'
        },
        {
            key: 'consecutiveTwo',
            name: '相連二個相同',
            color: '#1E90FF',
            enabled: true,
            type: 'rule'
        },
        {
            key: 'consecutiveThree',
            name: '相連三個相同',
            color: '#FF0000',
            enabled: true,
            type: 'rule'
        },
        {
            key: 'consecutiveFour',
            name: '相連四個相同',
            color: '#8A2BE2',
            enabled: true,
            type: 'rule'
        },
        {
            key: 'nonConsecutiveTwo',
            name: '不相連二個相同',
            color: '#32CD32',
            enabled: true,
            type: 'rule'
        },
        {
            key: 'nonConsecutiveThree',
            name: '不相連三個相同',
            color: '#FFD700',
            enabled: true,
            type: 'rule'
        },
        {
            key: 'incTwo',
            name: '二個連續數字',
            color: '#FF69B4',
            enabled: true,
            type: 'rule'
        },
        {
            key: 'incThree',
            name: '三個連續數字',
            color: '#FF4500',
            enabled: true,
            type: 'rule'
        },
        {
            key: 'incFour',
            name: '四個連續數字',
            color: '#00CED1',
            enabled: true,
            type: 'rule'
        },
        {
            key: 'custom',
            name: '自訂號碼',
            color: '#8B4513',
            enabled: true,
            type: 'custom',
            numbers: []
        }
    ];

    /* ---------------- localStorage ---------------- */
    let savedData = JSON.parse(localStorage.getItem('mvdisOptions') || '{}');
    if (savedData.options) {
        defaultOptions.forEach(opt => {
            if (savedData.options[opt.key] !== undefined) opt.enabled = savedData.options[opt.key];
        });
    }
    let autoNextSaved = localStorage.getItem('mvdisAutoNext') === 'true';

    /* ---------------- 控制面板 ---------------- */
    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        width: '240px',
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid #ccc',
        padding: '10px',
        zIndex: 9999,
        fontSize: '14px',
        boxShadow: '2px 2px 6px rgba(0,0,0,0.3)',
        borderRadius: '6px',
        userSelect: 'none'
    });

    // ---------------- 標題 + 拖曳 + 折疊 ----------------
    const headerDiv = document.createElement('div');
    Object.assign(headerDiv.style, {
        textAlign: 'center',
        cursor: 'move',
        fontWeight: 'bold'
    });
    headerDiv.textContent = '靚號控制面板(自用)';
    panel.appendChild(headerDiv);

    // 可折疊內容區
    const contentDiv = document.createElement('div');
    contentDiv.style.marginTop = '6px';
    panel.appendChild(contentDiv);

    // 折疊狀態
    let collapsed = false;

    // 拖曳變數
    let isDragging = false,
        startX = 0,
        startY = 0,
        moved = false,
        origX = 0,
        origY = 0;

    // mousedown 開始拖曳
    headerDiv.addEventListener('mousedown', e => {
        e.preventDefault();
        isDragging = true;
        moved = false;
        startX = e.clientX;
        startY = e.clientY;
        origX = panel.offsetLeft;
        origY = panel.offsetTop;
    });

    // mousemove 拖曳
    document.addEventListener('mousemove', e => {
        if (isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true; // 超過 5px 才算拖曳
            panel.style.left = (origX + dx) + 'px';
            panel.style.top = (origY + dy) + 'px';
        }
    });

    // mouseup 結束拖曳
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // click 折疊（拖曳後不觸發）
    headerDiv.addEventListener('click', () => {
        if (!moved) { // 只有沒有拖曳才折疊
            collapsed = !collapsed;
            contentDiv.style.display = collapsed ? 'none' : 'block';
        }
    });


    /* ---------------- checkbox & 自訂號碼 ---------------- */
    defaultOptions.forEach(opt => {
        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.cursor = 'pointer';
        label.title = opt.name;
        if (opt.type === 'rule' || opt.type === 'custom') {
            const colorBox = document.createElement('span');
            Object.assign(colorBox.style, {
                display: 'inline-block',
                width: '12px',
                height: '12px',
                marginRight: '4px',
                backgroundColor: opt.color
            });
            label.appendChild(colorBox);
        }
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.dataset.opt = opt.key;
        cb.checked = opt.enabled;
        label.appendChild(cb);
        label.appendChild(document.createTextNode(' ' + opt.name));
        contentDiv.appendChild(label);
    });

    const customInput = document.createElement('input');
    customInput.type = 'text';
    customInput.id = 'customInput';
    customInput.placeholder = '輸入號碼, 空格或逗號分隔';
    Object.assign(customInput.style, {
        width: '220px',
        marginTop: '4px'
    });
    if (savedData.options && savedData.options.customNumbers) customInput.value = savedData.options.customNumbers.join(',');
    contentDiv.appendChild(customInput);

    /* ---------------- 統計區 ---------------- */
    const statsDiv = document.createElement('div');
    Object.assign(statsDiv.style, {
        marginTop: '8px',
        fontSize: '12px',
        maxHeight: '120px',
        overflowY: 'auto',
        background: 'rgba(250,250,250,0.9)',
        border: '1px solid #ccc',
        padding: '4px',
        borderRadius: '4px'
    });
    const statTitle = document.createElement('b');
    statTitle.textContent = '本頁統計:';
    const statContent = document.createElement('div');
    statContent.id = 'statContent';
    statContent.textContent = '載入中...';
    statsDiv.appendChild(statTitle);
    statsDiv.appendChild(statContent);
    contentDiv.appendChild(statsDiv);

    /* ---------------- 自動翻頁 ---------------- */
    const autoPageDiv = document.createElement('div');
    Object.assign(autoPageDiv.style, {
        marginTop: '6px'
    });
    const autoNextCheckbox = document.createElement('input');
    autoNextCheckbox.type = 'checkbox';
    autoNextCheckbox.id = 'autoNextPage';
    autoNextCheckbox.checked = autoNextSaved;
    autoPageDiv.appendChild(autoNextCheckbox);
    autoPageDiv.appendChild(document.createTextNode(' 自動翻頁（本頁有靚號或自訂號碼時提示）'));
    contentDiv.appendChild(autoPageDiv);
    autoNextCheckbox.addEventListener('change', () => {
        localStorage.setItem('mvdisAutoNext', autoNextCheckbox.checked);
    });

    /* ---------------- 按鈕 ---------------- */
    const btnDiv = document.createElement('div');
    btnDiv.style.marginTop = '6px';
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '重新標記';
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '上一頁';
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '下一頁';
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '複製靚號';
    [refreshBtn, prevBtn, nextBtn, copyBtn].forEach(b => {
        b.style.marginRight = '4px';
        btnDiv.appendChild(b);
    });
    contentDiv.appendChild(btnDiv);

    /* ---------------- 載入時間 ---------------- */
    const timeDiv = document.createElement('div');
    Object.assign(timeDiv.style, {
        marginTop: '6px',
        fontSize: '12px',
        textAlign: 'center'
    });
    const nowDate = new Date();
    timeDiv.textContent = `載入時間: ${nowDate.getFullYear()}/${nowDate.getMonth()+1}/${nowDate.getDate()} ${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`;
    contentDiv.appendChild(timeDiv);

    document.body.appendChild(panel);

    /* ---------------- 數字元素 ---------------- */
    const numberElements = document.querySelectorAll('.number');
    if (!numberElements.length) return;

    /* ---------------- 標記函數 ---------------- */
    function markSpecial(el, color, ruleName) {
        el.style.backgroundColor = color;
        el.dataset.rules = el.dataset.rules ? el.dataset.rules + ',' + ruleName : ruleName;
        el.title = el.dataset.rules;
        let count = 0;
        const interval = setInterval(() => {
            el.style.opacity = el.style.opacity === '0.5' ? '1' : '0.5';
            count++;
            if (count >= 6) clearInterval(interval);
        }, 200);
    }

    function markFilter(el) {
        const ruleName = '自訂號碼';
        el.style.backgroundColor = defaultOptions.find(o => o.key === 'custom').color;
        el.dataset.rules = el.dataset.rules ? el.dataset.rules + ',' + ruleName : ruleName;
        el.title = el.dataset.rules;
    }

    /* ---------------- 標記頁面 ---------------- */
    function markPage() {
        numberElements.forEach(el => {
            el.style.backgroundColor = '';
            delete el.dataset.rules;
            el.title = '';
        });
        const special_number = {};
        defaultOptions.filter(o => o.type === 'rule').forEach(o => special_number[o.key] = []);
        const customNumbers = customInput.value.split(/[, ]+/).filter(n => /^\d{4}$/.test(n));
        defaultOptions.find(o => o.key === 'custom').numbers = customNumbers;
        const filter_number = [];

        numberElements.forEach(el => {
            const car_number_full = el.textContent.trim();
            const car_number = car_number_full.split('-')[1];
            if (!car_number) return;
            const digits = car_number.split('').map(d => parseInt(d));
            const [a, b, c, d] = digits;
            let consecutiveFlag = false;

            const rulesMap = {
                consecutiveTwo: () => {
                    if (a === b || b === c || c === d) {
                        markSpecial(el, '#1E90FF', '相連二個相同');
                        special_number.consecutiveTwo.push(car_number);
                        consecutiveFlag = true;
                    }
                },
                consecutiveThree: () => {
                    if ((a === b && b === c) || (b === c && c === d)) {
                        markSpecial(el, '#FF0000', '相連三個相同');
                        special_number.consecutiveThree.push(car_number);
                        consecutiveFlag = true;
                    }
                },
                consecutiveFour: () => {
                    if (a === b && b === c && c === d) {
                        markSpecial(el, '#8A2BE2', '相連四個相同');
                        special_number.consecutiveFour.push(car_number);
                        consecutiveFlag = true;
                    }
                },
                twoSame: () => {
                    if (a === b && c === d && a !== c) {
                        markSpecial(el, '#FF7F50', '兩兩相同(AABB)');
                        special_number.twoSame.push(car_number);
                    }
                },
                nonConsecutiveTwo: () => {
                    if (!consecutiveFlag) {
                        const posMap = {};
                        digits.forEach((d, i) => {
                            if (!posMap[d]) posMap[d] = [];
                            posMap[d].push(i);
                        });
                        let flagged = false;
                        Object.values(posMap).forEach(arr => {
                            if (arr.length >= 2) {
                                for (let i = 0; i < arr.length - 1; i++) {
                                    if (arr[i + 1] - arr[i] > 1) flagged = true;
                                }
                            }
                        });
                        if (flagged) {
                            markSpecial(el, '#32CD32', '不相連二個相同');
                            special_number.nonConsecutiveTwo.push(car_number);
                        }
                    }
                },
                nonConsecutiveThree: () => {
                    if (!consecutiveFlag) {
                        const posMap = {};
                        digits.forEach((d, i) => {
                            if (!posMap[d]) posMap[d] = [];
                            posMap[d].push(i);
                        });
                        let flagged = false;
                        Object.values(posMap).forEach(arr => {
                            if (arr.length >= 3) {
                                for (let i = 0; i < arr.length - 2; i++) {
                                    if (arr[i + 2] - arr[i] > 2) flagged = true;
                                }
                            }
                        });
                        if (flagged) {
                            markSpecial(el, '#FFD700', '不相連三個相同');
                            special_number.nonConsecutiveThree.push(car_number);
                        }
                    }
                },
                incTwo: () => {
                    if (Math.abs(a - b) === 1 || Math.abs(b - c) === 1 || Math.abs(c - d) === 1) {
                        markSpecial(el, '#FF69B4', '二個連續數字');
                        special_number.incTwo.push(car_number);
                    }
                },
                incThree: () => {
                    if ((b === a + 1 && c === b + 1) || (c === b + 1 && d === c + 1)) {
                        markSpecial(el, '#FF4500', '三個連續數字');
                        special_number.incThree.push(car_number);
                    }
                },
                incFour: () => {
                    if (b === a + 1 && c === b + 1 && d === c + 1) {
                        markSpecial(el, '#00CED1', '四個連續數字');
                        special_number.incFour.push(car_number);
                    }
                },
            };

            Object.keys(rulesMap).forEach(k => {
                if (defaultOptions.find(o => o.key === k).enabled) rulesMap[k]();
            });

            if (defaultOptions.find(o => o.key === 'custom').enabled && customNumbers.includes(car_number)) {
                markFilter(el);
                filter_number.push(car_number);
            }
        });

        // 統計
        let html = '';
        Object.keys(special_number).forEach(k => {
            if (special_number[k].length > 0) html += `${defaultOptions.find(o=>o.key===k).name}: ${special_number[k].join(', ')}\n`;
        });
        if (filter_number.length > 0) html += `自訂號碼: ${filter_number.join(', ')}`;
        statContent.textContent = html || '本頁無靚號或自訂號碼';
        console.log('本頁靚號統計:' + html);

        // 自動翻頁提示
        const anyRuleEnabled = defaultOptions.filter(o => o.type === 'rule').some(o => o.enabled) || (defaultOptions.find(o => o.key === 'custom').enabled && customNumbers.length > 0);
        if (autoNextCheckbox.checked && anyRuleEnabled) {
            if (Object.values(special_number).some(arr => arr.length > 0) || filter_number.length > 0) pagePrompt.style.display = 'block';
            else goNextPage();
        }
    }

    /* ---------------- 翻頁函數 ---------------- */
    function goNextPage(delay = 500) {
        const btn = document.getElementsByName('imgNext')[0];
        if (btn) setTimeout(() => btn.click(), delay);
    }

    function goPrevPage(delay = 500) {
        const btn = document.getElementsByName('imgPrev')[1];
        if (btn) setTimeout(() => btn.click(), delay);
    }

    /* ---------------- 提示框 ---------------- */
    const pagePrompt = document.createElement('div');
    Object.assign(pagePrompt.style, {
        position: 'fixed',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid #ccc',
        padding: '8px',
        zIndex: 9999,
        display: 'none'
    });
    const promptText = document.createElement('span');
    promptText.id = 'promptText';
    promptText.textContent = '本頁有靚號或自訂號碼';
    const promptPrevBtn = document.createElement('button');
    promptPrevBtn.id = 'promptPrevBtn';
    promptPrevBtn.textContent = '上一頁';
    const promptNextBtn = document.createElement('button');
    promptNextBtn.id = 'promptNextBtn';
    promptNextBtn.textContent = '下一頁';
    const promptKeepBtn = document.createElement('button');
    promptKeepBtn.id = 'promptKeepBtn';
    promptKeepBtn.textContent = '保留本頁';
    [promptText, promptPrevBtn, promptNextBtn, promptKeepBtn].forEach(el => pagePrompt.appendChild(el));
    document.body.appendChild(pagePrompt);
    promptNextBtn.addEventListener('click', () => {
        pagePrompt.style.display = 'none';
        goNextPage();
    });
    promptPrevBtn.addEventListener('click', () => {
        pagePrompt.style.display = 'none';
        goPrevPage();
    });
    promptKeepBtn.addEventListener('click', () => {
        pagePrompt.style.display = 'none';
    });

    /* ---------------- checkbox 事件 ---------------- */
    contentDiv.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        const key = cb.dataset.opt;
        const opt = defaultOptions.find(o => o.key === key);
        if (!opt) return;
        cb.checked = opt.enabled;
        cb.addEventListener('change', () => {
            opt.enabled = cb.checked;
            if (key === 'allSwitch') {
                defaultOptions.forEach(o => {
                    if (o.key !== 'allSwitch') {
                        o.enabled = cb.checked;
                        const c = contentDiv.querySelector(`input[data-opt="${o.key}"]`);
                        if (c) c.checked = cb.checked;
                    }
                });
            }
            saveData();
            markPage();
        });
    });

    /* ---------------- 複製靚號 ---------------- */
    copyBtn.addEventListener('click', () => {
        const special_number = {};
        defaultOptions.filter(o => o.type === 'rule').forEach(o => special_number[o.key] = []);
        const filter_number = [];
        numberElements.forEach(el => {
            if (!el.dataset.rules) return;
            const rules = el.dataset.rules.split(',');
            rules.forEach(r => {
                if (r === '自訂號碼') filter_number.push(el.textContent.trim());
                else {
                    const key = defaultOptions.find(o => o.name === r)?.key;
                    if (key) special_number[key].push(el.textContent.trim());
                }
            });
        });
        let text = '';
        Object.keys(special_number).forEach(k => {
            if (special_number[k].length > 0) text += `${defaultOptions.find(o=>o.key===k).name}: ${special_number[k].join(', ')}\n`;
        });
        if (filter_number.length > 0) text += `自訂號碼: ${filter_number.join(', ')}`;
        navigator.clipboard.writeText(text).then(() => alert('已複製靚號'));
    });

    /* ---------------- 自訂號碼事件 ---------------- */
    customInput.addEventListener('input', () => {
        const arr = customInput.value.split(/[, ]+/).filter(n => n); // 只去掉空字串，其他不限制
        defaultOptions.find(o => o.key === 'custom').numbers = arr;
        saveData();
        markPage();
    });

    /* ---------------- 按鈕事件 ---------------- */
    refreshBtn.addEventListener('click', () => markPage());
    nextBtn.addEventListener('click', () => goNextPage());
    prevBtn.addEventListener('click', () => goPrevPage());

    /* ---------------- 儲存 ---------------- */
    function saveData() {
        const optionsData = {};
        defaultOptions.forEach(o => {
            optionsData[o.key] = o.enabled;
            if (o.type === 'custom') optionsData.customNumbers = o.numbers;
        });
        localStorage.setItem('mvdisOptions', JSON.stringify({
            options: optionsData
        }));
    }

    markPage();
})();