// ==UserScript==
// @name         马帮发货统计展示（平板友好版-底部横条+自动刷新）
// @namespace    https://www.taobaimei.com
// @version      2.7
// @description  在马帮ERP底部展示发货统计数据，支持中/英/缅/泰语言切换，支持展开、收起和自动刷新
// @match        https://www.mabangerp.com/index.php?mod=main.gotoApp*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      www.taobaimei.com
// @connect      api.mabangerp.com
// @license All Rights Reserved

// @downloadURL https://update.greasyfork.org/scripts/528506/%E9%A9%AC%E5%B8%AE%E5%8F%91%E8%B4%A7%E7%BB%9F%E8%AE%A1%E5%B1%95%E7%A4%BA%EF%BC%88%E5%B9%B3%E6%9D%BF%E5%8F%8B%E5%A5%BD%E7%89%88-%E5%BA%95%E9%83%A8%E6%A8%AA%E6%9D%A1%2B%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528506/%E9%A9%AC%E5%B8%AE%E5%8F%91%E8%B4%A7%E7%BB%9F%E8%AE%A1%E5%B1%95%E7%A4%BA%EF%BC%88%E5%B9%B3%E6%9D%BF%E5%8F%8B%E5%A5%BD%E7%89%88-%E5%BA%95%E9%83%A8%E6%A8%AA%E6%9D%A1%2B%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const LANGUAGES = ['EN', 'CN', 'MM', 'TH'];
    let currentLang = localStorage.getItem('reportLang') || 'EN';
    let panelExpanded = JSON.parse(localStorage.getItem('panelExpanded') || 'false');

    const translations = {
        EN: { title: 'Shipping Stats', date: 'Date', orders: 'Orders', items: 'Items', errors: 'Errors', score: 'Score', loading: 'Loading...', dataParseFail: 'Data Parsing Failed', requestFail: 'Request Failed', toggleButton: '▲', collapseButton: '▼', top3: 'Top 3' },
        CN: { title: '发货统计', date: '日期', orders: '单数', items: '件数', errors: '出错数', score: '评分', loading: '加载中...', dataParseFail: '数据解析失败', requestFail: '请求失败', toggleButton: '▲', collapseButton: '▼', top3: '前3名' },
        MM: { title: 'သင်္ဘောအချက်အလက်', date: 'နေ့စွဲ', orders: 'အော်ဒါ', items: 'ပစ္စည်း', errors: 'အမှား', score: 'အဆင့်သတ်မှတ်ချက်', loading: 'ဖတ်နေသည်...', dataParseFail: 'ဒေတာဖွင့်မရနိုင်ပါ', requestFail: 'တောင်းဆိုမှုမအောင်မြင်ပါ', toggleButton: '▲', collapseButton: '▼', top3: 'ထိပ်ဆုံး ၃' },
        TH: { title: 'สถิติการจัดส่ง', date: 'วันที่', orders: 'คำสั่งซื้อ', items: 'ชิ้น', errors: 'ข้อผิดพลาด', score: 'คะแนน', loading: 'กำลังโหลด...', dataParseFail: 'การแปลงข้อมูลล้มเหลว', requestFail: 'การร้องขอล้มเหลว', toggleButton: '▲', collapseButton: '▼', top3: '3 อันดับแรก' }
    };

    GM_addStyle(`
    #userIdInput {
    width: 100px;
    color: blue;
    font-weight: bold;
    margin-right: 5px;
    text-align: center;
}

        #customReportPanel {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 96%;
            background: white;
            box-shadow: 0 -2px 5px rgba(0,0,0,0.3);
            z-index: 9999;
            height: ${panelExpanded ? '400px' : '185px'};
            overflow: hidden;
            transition: height 0.3s;
        }
        #reportHeader {
            background: #007bff;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
            font-size: 14px;
        }
        #languageSelector, #refreshButton, #toggleButton {
            padding: 2px 5px;
            font-size: 12px;
            cursor: pointer;
            border: 1px solid white;
            background: white;
            color: #007bff;
            margin-left: 5px;
        }
        #reportSection {
            padding: 5px;
            overflow-y: auto;
            height: calc(100% - 50px);
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0;
        }
        table, th, td {
            border: 1px solid #ccc;
        }
        th, td {
            padding: 3px;
            text-align: center;
        }
            #countdownTimer {
        font-size: 14px;
        color: white;
        margin-right: 5px;
        width: 45px;
        text-align: center;
    }
        #top3, #todayStats {
            padding: 5px;
            font-size: 14px;
        }
    #sideButton {
        position: fixed;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background: #007bff;
        color: white;
        border: none;
        padding: 5px 10px;
        font-size: 16px;
        cursor: pointer;
        z-index: 10000;
        display: none;  // 默认隐藏，等需要时再显示
    }
    `);

    function syncEmployeeToServer(employeeId, nickname, avatar) {
    const payload = {
        employee_id: employeeId,
        nickname: nickname,
        avatar: avatar
    };

    GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://www.taobaimei.com/thailand/sync_employee_info.php',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(payload),
        onload: function(response) {
            console.log('员工信息同步成功:', response.responseText);
        },
        onerror: function(err) {
            console.error('员工信息同步失败:', err);
        }
    });
}


function hideYSFButtonWithCheck() {
    const interval = setInterval(() => {
        const ysfButton = document.getElementById('YSF-CUSTOM-ENTRY-1');
        if (ysfButton) {
            ysfButton.style.display = 'none';
            clearInterval(interval);  // 找到并隐藏后，就停止轮询
        }
    }, 500);  // 每0.5秒检查一次，直到找到
}
function fetchUserIdWithRetry() {
    let attempts = 0;

    const possibleTexts = [
        '马帮WMS系统',         // 中文
        'Mabang WMS system',   // 英文
        'MABANG ระบบ WMS'      // 泰文
    ];

    const timer = setInterval(() => {
        const wmsLink = [...document.querySelectorAll('a')].find(a =>
            possibleTexts.includes(a.textContent.trim())
        );

        if (wmsLink) {
            clearInterval(timer);  // 找到就停止
            extractEmployeeIdFromLink(wmsLink);
        } else {
            attempts++;
            if (attempts > 10) {  // 最多检查10次（10秒）
                clearInterval(timer);
                console.error('未找到“马帮WMS系统”链接，可能用户未登录或页面结构有变');
            }
        }
    }, 1000);
}


function extractEmployeeIdFromLink(link) {
    const urlParams = new URL(link.href).searchParams;
    const employeeId = urlParams.get('employeeid');

    if (employeeId) {
        document.getElementById('userIdInput').value = employeeId;
                // 获取昵称和头像
        const nickname = getNickname();
        const avatar = getUserAvatar();

        // 同步到服务器
        syncEmployeeToServer(employeeId, nickname, avatar);
        console.log('获取到employeeId:', employeeId);
        reloadPanel();  // 自动刷新
    } else {
        console.error('链接中未找到employeeid参数');
    }
}
function getNickname() {
    const mbUserDiv = document.getElementById('mb-user');
    if (!mbUserDiv) return '未知用户';

    const nameP = mbUserDiv.querySelector('p.name');
    return nameP ? nameP.textContent.trim() : '未知用户';
}

function getUserAvatar() {
    const userDiv = document.getElementById('mb-user');
    if (!userDiv) return '';  // 如果找不到mb-user，返回空

    const img = userDiv.querySelector('img');
    return img ? img.src : '';  // 返回第一个img的src
}

    function t(key) {
        return translations[currentLang][key];
    }
function hidePanelToSide() {
    const panel = document.getElementById('customReportPanel');
    panel.style.width = '20px';  // 缩到极窄
    panel.style.overflow = 'hidden';
    panel.style.transform = 'translateX(0)';  // 其实translateX可以不要，保持居左
    localStorage.setItem('panelHiddenToSide', 'true');
    showSideButton();
}

function showSideButton() {
    let sideButton = document.getElementById('sideButton');
    if (!sideButton) {
        sideButton = document.createElement('button');
        sideButton.id = 'sideButton';
        sideButton.textContent = '↪';
        sideButton.style.position = 'fixed';
        sideButton.style.left = '0';
        sideButton.style.top = '85%';
        sideButton.style.transform = 'translateY(-85%)';
        sideButton.style.background = '#007bff';
        sideButton.style.color = 'white';
        sideButton.style.zIndex = '10000';
        sideButton.style.border = 'none';
        sideButton.style.cursor = 'pointer';
        sideButton.style.padding = '5px 10px';

        sideButton.addEventListener('click', restorePanelFromSide);
        document.body.appendChild(sideButton);
    }
    sideButton.style.display = 'block';
}

function restorePanelFromSide() {
    const panel = document.getElementById('customReportPanel');
    panel.style.width = '96%';  // 恢复原宽度
    panel.style.overflow = 'visible';
    panel.style.transform = 'translateX(0)';  // 回到原位
    localStorage.setItem('panelHiddenToSide', 'false');
    document.getElementById('sideButton').style.display = 'none';
}

function initPanelPosition() {
    const isHiddenToSide = localStorage.getItem('panelHiddenToSide') === 'true';
    if (isHiddenToSide) {
        document.getElementById('customReportPanel').style.transform = 'translateX(-96%)';
        showSideButton();
    }
}

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'customReportPanel';

    const avatarUrl = getUserAvatar();  // 获取头像地址
        const nickname = getNickname();     // 获取昵称
        panel.innerHTML = `
            <div id="reportHeader">
            <div style="display: flex; align-items: center;">
                <img id="userAvatar" src="${avatarUrl}" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px; object-fit: cover;">
                <span id="userNickname" style="font-size: 16px; font-weight: bold; color: white; margin-right: 15px;">${nickname}</span>
            </div>
                <span id="todayStats" style="font-size:20px;">${t('loading')}</span>
                <div>
                <button id="clearCacheButton">🔃</button>
                    <input type="text" id="userIdInput" placeholder="User ID">
                    <span id="countdownTimer">15:00</span>
                    <button id="refreshButton">Refresh</button>
                    <select id="languageSelector">
                        ${LANGUAGES.map(lang => `<option value="${lang}" ${lang === currentLang ? 'selected' : ''}>${lang}</option>`).join('')}
                    </select>
                    <button id="toggleButton">${panelExpanded ? t('collapseButton') : t('toggleButton')}</button>
                    <button id="hideButton">❌</button>  <!-- 新增这个按钮 -->
                </div>
            </div>
            <div id="reportSection" ${panelExpanded ? '' : 'style="display:none;"'}>
                <div id="weeklyReport">
                    <h4>${t('title')} - Last 7 Days</h4>
                    <div id="weeklyData">${t('loading')}</div>
                </div>
                <div id="monthlyReport">
                    <h4>${t('title')} - Monthly</h4>
                    <div id="monthlyData">${t('loading')}</div>
                </div>
            </div>
            <div id="top3">${t('loading')}</div>
        `;

        document.body.appendChild(panel);
        document.getElementById('clearCacheButton').addEventListener('click', () => {
            //localStorage.removeItem('employeeId');  // 清除缓存
            console.log('手动触发重新获取ID');
            fetchUserIdWithRetry();
        });

        document.getElementById('languageSelector').addEventListener('change', (e) => {
            currentLang = e.target.value;
            localStorage.setItem('reportLang', currentLang);
            reloadPanel();
        });

        document.getElementById('refreshButton').addEventListener('click', reloadPanel);
        document.getElementById('toggleButton').addEventListener('click', () => {
            panelExpanded = !panelExpanded;
            localStorage.setItem('panelExpanded', panelExpanded);
            updatePanelVisibility();
        });
document.getElementById('hideButton').addEventListener('click', hidePanelToSide);

        updatePanelVisibility();
        initPanelPosition();  // 初始化面板位置

    }

    function updatePanelVisibility() {
        const section = document.getElementById('reportSection');
        const toggleButton = document.getElementById('toggleButton');
        document.getElementById('customReportPanel').style.height = panelExpanded ? '400px' : '185px';
        section.style.display = panelExpanded ? 'block' : 'none';
        toggleButton.textContent = panelExpanded ? t('collapseButton') : t('toggleButton');
    }

    function fetchData(url, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload: (response) => callback(JSON.parse(response.responseText)),
            onerror: () => callback({ error: t('requestFail') })
        });
    }

    function renderWeeklyData(data) {
        data.sort((a, b) => b.date.localeCompare(a.date));
        document.getElementById('weeklyData').innerHTML = buildTable(data);
        updateTodayStats(data);
    }

    function renderMonthlyData(data) {
        document.getElementById('monthlyData').innerHTML = buildTable(data, true);
        updateTop3(data);
    }
function updateTodayStats(data) {
    if (data.length === 0) {
        document.getElementById('todayStats').innerText = `${t('loading')}`;
        return;
    }

    const latestData = data[0];  // 因为你已经对data做了降序排序，data[0]就是最新的

    const todayText = `${latestData.date} | ${latestData.order_count ?? 0} ${t('orders')} | ${latestData.item_count ?? 0} ${t('items')} | ${latestData.error_count ?? '*'} ${t('errors')} | ${latestData.score ?? '*'}`;

    document.getElementById('todayStats').innerText = todayText;
}




function updateTop3(data) {
    const top3 = data.sort((a, b) => b.total_orders - a.total_orders).slice(0, 3);

    let html = `<table style="width: 100%; border-collapse: collapse; margin: 5px 0;">
        <tr>
            <th>${t('date')}</th>
            <th>${t('orders')}</th>
            <th>${t('items')}</th>
            <th>${t('errors')}</th>
            <th>${t('score')}</th>
        </tr>`;

    top3.forEach(d => {
        html += `
            <tr>
                <td>${d.expressOperId}</td>
                <td>${d.total_orders ?? 0}</td>
                <td>${d.total_items ?? 0}</td>
                <td>${d.error_count ?? '*'}</td>
                <td>${d.score ?? '*'}</td>
            </tr>`;
    });

    html += `</table>`;

    document.getElementById('top3').innerHTML = html;
}


    function buildTable(rows, isMonthly = false) {
        let html = `<table><tr>${isMonthly ? `<th>Shipper ID</th>` : `<th>${t('date')}</th>`}<th>${t('orders')}</th><th>${t('items')}</th><th>${t('errors')}</th><th>${t('score')}</th></tr>`;
        rows.forEach(row => {
            html += `<tr><td>${isMonthly ? row.expressOperId : row.date}</td><td>${row.order_count ?? row.total_orders ?? 0}</td><td>${row.item_count ?? row.total_items ?? 0}</td><td>${row.error_count || '*'}</td><td>${row.score || '*'}</td></tr>`;
        });
        return html + '</table>';
    }

function reloadPanel() {
    const userId = document.getElementById('userIdInput').value.trim();
    if (!userId) {
        console.log('Please enter User ID');
        return;
    }
    fetchData(`https://www.taobaimei.com/thailand/get_weekly_report.php?expressOperId=${userId}`, renderWeeklyData);
    fetchData("https://www.taobaimei.com/thailand/get_monthly_report.php", renderMonthlyData);
}

window.addEventListener('load', () => {
    hideYSFButtonWithCheck();
    fetchUserIdWithRetry();  // 替换掉原来的fetchUserId()

});
        createPanel();
    reloadPanel();
    setInterval(reloadPanel, 600000);

let countdown = 900;  // 15分钟=900秒
let countdownTimer = null;

function startCountdown() {
    if (countdownTimer) clearInterval(countdownTimer);  // 清除已有计时器
    countdown = 900;  // 重新开始15分钟
    updateCountdownDisplay();

    countdownTimer = setInterval(() => {
        countdown--;
        updateCountdownDisplay();

        if (countdown <= 0) {
            clearInterval(countdownTimer);
            reloadPanel();  // 刷新数据
            startCountdown();  // 关键点：倒计时重新开始
        }
    }, 1000);
}

function updateCountdownDisplay() {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    document.getElementById('countdownTimer').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// 刷新按钮也要重置倒计时
document.getElementById('refreshButton').addEventListener('click', () => {
    reloadPanel();
    startCountdown();  // 手动刷新后也重新倒计时
});

// 页面加载时开始倒计时
startCountdown();

})();
