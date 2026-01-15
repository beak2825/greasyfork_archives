// ==UserScript==
// @name        LSE Drill Metric Viewer
// @namespace   http://tampermonkey.net/
// @match       https://w.amazon.com/bin/view/G_China_Infra_Ops/BJSPEK/DCEO/LSE*
// @match       https://amazon.sharepoint.com/*BJS-DCEO-Team*
// @grant       GM_xmlhttpRequest
// @license     MIT
// @version     3.01
// @author      xiongwev
// @description To help DCEO view LSE drill metrics
// @downloadURL https://update.greasyfork.org/scripts/502249/LSE%20Drill%20Metric%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/502249/LSE%20Drill%20Metric%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[LSE Drill] 脚本开始加载");
    console.log("[LSE Drill] 当前URL:", document.URL);

    // API URLs
    const url1 = 'https://rdwf2-prod.corp.amazon.com/api/lsedrill/sites/cluster/BJS';
    const url2 = 'https://rdwf2-prod.corp.amazon.com/api/lsedrill/sites/cluster/PEK';
    const url3 = 'https://rdwf2-prod.corp.amazon.com/api/lsedrill/sites/cluster/PKX';
    const url4 = 'https://rdwf2-prod.corp.amazon.com/api/rackdowndrill/users/cluster/BJS';
    const url5 = 'https://rdwf2-prod.corp.amazon.com/api/rackdowndrill/users/cluster/PEK';
    const url6 = 'https://rdwf2-prod.corp.amazon.com/api/rackdowndrill/users/cluster/PKX';

    // URL 匹配正则
    const urlwiki = /https:\/\/w\.amazon\.com\/bin\/view\/G_China_Infra_Ops\/BJSPEK\/DCEO\/LSE/;
    const urlsharepoint = /amazon\.sharepoint\.com.*file=BJS%20DCEO%20weekly%20meeting/i;

    // SSO 认证检查
    GM_xmlhttpRequest({
        method: 'GET',
        url: url1,
        onload: function(response) {
            try {
                const check = JSON.parse(response.responseText);
                if (check.message === 'More authentication needed.') {
                    window.open('https://midway-auth.amazon.com/login?reauth=1#midway', 'floatingWindow', 'width=600,height=400');
                }
            } catch (e) {
                console.log("[LSE Drill] SSO检查响应解析失败");
            }
        }
    });

    // ==================== 通用函数 ====================

    function fetchData(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    resolve(JSON.parse(response.responseText));
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    function processData(callback) {
        Promise.all([fetchData(url1), fetchData(url2), fetchData(url3)])
            .then(([data1, data2, data3]) => {
            const data = [...data1, ...data2, ...data3];
            var result = data.filter(item => item.active === true)
            .map(item => {
                const lastDrillDate = item.lse_drills && item.lse_drills.length > 0
                ? new Date(item.lse_drills[0].completed_at)
                : null;
                const nextNextDueDate = lastDrillDate
                ? new Date(lastDrillDate.getTime() + (91 * 24 * 60 * 60 * 1000))
                : null;
                return {
                    site: item.site,
                    compliance_status: item.lse_compliance,
                    next_drill_due: item.lse_next_drill_due.slice(0, 10),
                    next_next_due: nextNextDueDate ? nextNextDueDate.toISOString().slice(0, 10) : 'N/A'
                };
            });

            result.sort((a, b) => {
                const aDate = new Date(a.next_drill_due);
                const bDate = new Date(b.next_drill_due);
                return aDate.getTime() - bDate.getTime();
            });

            callback(result);
        })
            .catch(error => console.error(error));
    }

    function processRDData(callback) {
        Promise.all([fetchData(url4), fetchData(url5), fetchData(url6)])
            .then(([data4, data5, data6]) => {
            const data = [...data4, ...data5, ...data6];

            const trainerData = data
            .filter(item =>
                    item.team === 'DCEO' &&
                    item.trainer === true &&
                    item.rackdown_compliance !== 'not_required'
                   )
            .map(item => ({
                name: item.full_name,
                network_certified: item.network_certified ? "Yes" : "No",
                network_expire: item.network_certified_until ? item.network_certified_until.slice(0, 10) : "N/A",
                power_certified: item.power_certified ? "Yes" : "No",
                power_expire: item.power_certified_until ? item.power_certified_until.slice(0, 10) : "N/A",
                isTrainer: true
            }));

            const nonTrainerLogins = data
            .filter(item => item.team === 'DCEO' && (!item.hasOwnProperty('trainer') || item.trainer === false) && item.rackdown_compliance !== 'not_required')
            .map(item => item.login);

            const historyPromises = nonTrainerLogins.map(login =>
                                                         fetchData(`https://rdwf.corp.amazon.com/api/rackdowndrill/drills/login/${login}`)
                                                        );

            return Promise.all(historyPromises)
                .then(historiesResults => {
                const nonTrainerData = data
                .filter(item =>
                        item.team === 'DCEO' &&
                        (!item.hasOwnProperty('trainer') || item.trainer === false) &&
                        item.rackdown_compliance !== 'not_required'
                       )
                .map((item, index) => ({
                    name: item.full_name,
                    job: item.job_title,
                    compliance_status: item.rackdown_compliance,
                    next_drill_due: item.rackdown_next_drill_due.slice(0, 10),
                    current_quarter_tor: item.job_title === 'DCEO Engr 3'
                    ? checkTORReplacementInCurrentQuarter(historiesResults[index]) ? "Yes" : "No"
                    : "N/A",
                    isTrainer: false
                }));

                const sortedTrainerData = trainerData.sort((a, b) => {
                    return new Date(a.network_expire) - new Date(b.network_expire);
                });

                const sortedNonTrainerData = nonTrainerData.sort((a, b) => {
                    return new Date(a.next_drill_due) - new Date(b.next_drill_due);
                });

                callback([...sortedTrainerData, ...sortedNonTrainerData]);
            });
        })
            .catch(error => console.error(error));
    }

    function getCurrentQuarter() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
        const quarterStart = new Date(now.getFullYear(), quarterStartMonth, 1);
        return { start: quarterStart, end: now };
    }

    function checkTORReplacementInCurrentQuarter(drillHistory) {
        const quarter = getCurrentQuarter();
        return drillHistory.some(drill => {
            const drillDate = new Date(drill.completed_at);
            return drill.failure_type === "Emergent TOR Replacement" &&
                drill.certified === true &&
                drillDate >= quarter.start &&
                drillDate <= quarter.end;
        });
    }

    function getWarningClass(dateStr, prefix = '') {
        if (!dateStr || dateStr === 'N/A') return '';
        const daysDiff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 3600 * 24));
        if (daysDiff < 2) return prefix + 'danger';
        if (daysDiff < 7) return prefix + 'critical';
        if (daysDiff < 14) return prefix + 'warning';
        return '';
    }

    // ==================== SharePoint 浮动面板 ====================

    function addFloatingPanel() {
        console.log("[DEBUG] 添加浮动面板");

        if (document.getElementById('lse-floating-panel')) {
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'lse-floating-panel';
        panel.classList.add('lse-collapsed'); // 默认折叠
        panel.innerHTML = `
        <div id="lse-panel-header">
            <span>📊 Drill Metrics</span>
            <div id="lse-panel-buttons">
                <button id="lse-panel-toggle" title="展开/折叠">+</button>
                <button id="lse-panel-close" title="关闭">×</button>
            </div>
        </div>
        <div id="lse-panel-content">
            <div id="lse-btn-group">
                <button id="lse-btn-lse">LSE Metrics</button>
                <button id="lse-btn-rd">RD Metrics</button>
            </div>
            <div id="lse-table-container"></div>
        </div>
    `;

        const style = document.createElement('style');
        style.textContent = `
        #lse-floating-panel {
            position: fixed;
            top: 80px;
            right: 10px;
            width: 580px;
            max-height: 85vh;
            background: white;
            border: 1px solid #0078d4;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 99999;
            font-family: Arial, sans-serif;
            font-size: 12px;
            overflow: hidden;
        }

        #lse-panel-header {
            background: #0078d4;
            color: white;
            padding: 6px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            font-weight: bold;
            font-size: 13px;
        }

        #lse-panel-buttons {
            display: flex;
            gap: 5px;
        }

        #lse-panel-toggle,
        #lse-panel-close {
            background: transparent;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            width: 24px;
            height: 24px;
            line-height: 24px;
            padding: 0;
            border-radius: 3px;
        }

        #lse-panel-toggle:hover,
        #lse-panel-close:hover {
            background: rgba(255,255,255,0.2);
        }

        #lse-panel-close:hover {
            background: #c42b1c;
        }

        #lse-panel-content {
            padding: 8px;
            max-height: 75vh;
            overflow-y: auto;
        }

        #lse-btn-group {
            margin-bottom: 8px;
        }

        #lse-btn-group button {
            background: #0078d4;
            color: white;
            border: none;
            padding: 5px 12px;
            margin-right: 5px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }

        #lse-btn-group button:hover {
            background: #005a9e;
        }

        #lse-btn-group button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        #lse-table-container table {
            border-collapse: collapse;
            width: 100%;
            font-size: 11px;
        }

        #lse-table-container th,
        #lse-table-container td {
            border: 1px solid #ddd;
            padding: 4px 6px;
            text-align: center;
        }

        #lse-table-container th {
            background: #93afaa;
            font-weight: bold;
            font-size: 11px;
        }

        .lse-warning { background-color: yellow !important; }
        .lse-critical { background-color: #ff8c00 !important; }
        .lse-danger { background-color: #ed1f0b !important; color: white !important; }

        /* 折叠状态 */
        .lse-collapsed #lse-panel-content {
            display: none;
        }

        .lse-collapsed {
            width: auto !important;
        }

        #lse-loading {
            color: #0078d4;
            font-style: italic;
            padding: 8px;
            font-size: 12px;
        }

        .lse-group-header {
            background: #4a6ea9 !important;
            color: white !important;
            font-weight: bold;
            text-align: left !important;
            padding: 6px !important;
        }

        .lse-update-row {
            font-style: italic;
            text-align: right !important;
            color: #666;
            font-size: 10px;
        }

        /* 重新打开按钮 */
        #lse-reopen-btn {
            position: fixed;
            top: 80px;
            right: 10px;
            background: #0078d4;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            z-index: 99998;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            display: none;
        }

        #lse-reopen-btn:hover {
            background: #005a9e;
        }
    `;
        document.head.appendChild(style);
        document.body.appendChild(panel);

        // 创建重新打开按钮
        const reopenBtn = document.createElement('button');
        reopenBtn.id = 'lse-reopen-btn';
        reopenBtn.textContent = '📊 LSE Drill Viewer';
        reopenBtn.onclick = function() {
            panel.style.display = 'block';
            this.style.display = 'none';
        };
        document.body.appendChild(reopenBtn);

        // 绑定折叠/展开事件
        document.getElementById('lse-panel-toggle').onclick = function() {
            panel.classList.toggle('lse-collapsed');
            this.textContent = panel.classList.contains('lse-collapsed') ? '+' : '−';
        };

        // 绑定关闭事件
        document.getElementById('lse-panel-close').onclick = function() {
            panel.style.display = 'none';
            document.getElementById('lse-reopen-btn').style.display = 'block';
        };

        document.getElementById('lse-btn-lse').onclick = createLSETableForPanel;
        document.getElementById('lse-btn-rd').onclick = createRDTableForPanel;

        // 拖拽功能
        makeDraggable(panel, document.getElementById('lse-panel-header'));
    }
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function createLSETableForPanel() {
        const container = document.getElementById('lse-table-container');
        container.innerHTML = '<div id="lse-loading">正在加载 LSE 数据...</div>';

        processData(result => {
            let html = `<table>
                <tr>
                    <th>Site</th>
                    <th>Status</th>
                    <th>Next Due</th>
                    <th>Next Next Due</th>
                </tr>`;

            result.forEach(item => {
                const cellClass = getWarningClass(item.next_drill_due, 'lse-');
                html += `<tr>
                    <td>${item.site}</td>
                    <td>${item.compliance_status}</td>
                    <td class="${cellClass}">${item.next_drill_due}</td>
                    <td>${item.next_next_due}</td>
                </tr>`;
            });

            html += `<tr><td colspan="4" class="lse-update-row">Updated: ${new Date().toLocaleDateString()}</td></tr>`;
            html += '</table>';
            container.innerHTML = html;
        });
    }

    function createRDTableForPanel() {
        const container = document.getElementById('lse-table-container');
        container.innerHTML = '<div id="lse-loading">正在加载 RD 数据...</div>';

        processRDData(result => {
            let html = '';
            let currentGroup = null;

            result.forEach(item => {
                if (currentGroup !== item.isTrainer) {
                    currentGroup = item.isTrainer;
                    if (html) html += '</table><br>';

                    html += `<table>`;
                    html += `<tr><td colspan="5" class="lse-group-header">
                        ${item.isTrainer ? 'DCEO Trainers' : 'DCEO First Responder'}
                    </td></tr>`;

                    if (item.isTrainer) {
                        html += `<tr>
                            <th>Name</th>
                            <th>Net Cert</th>
                            <th>Net Expire</th>
                            <th>Pwr Cert</th>
                            <th>Pwr Expire</th>
                        </tr>`;
                    } else {
                        html += `<tr>
                            <th>Name</th>
                            <th>Job</th>
                            <th>Status</th>
                            <th>Next Due</th>
                            <th>Qtr TOR</th>
                        </tr>`;
                    }
                }

                if (item.isTrainer) {
                    const netClass = getWarningClass(item.network_expire, 'lse-');
                    const powClass = getWarningClass(item.power_expire, 'lse-');
                    html += `<tr>
                        <td>${item.name}</td>
                        <td>${item.network_certified}</td>
                        <td class="${netClass}">${item.network_expire}</td>
                        <td>${item.power_certified}</td>
                        <td class="${powClass}">${item.power_expire}</td>
                    </tr>`;
                } else {
                    const dueClass = getWarningClass(item.next_drill_due, 'lse-');
                    const torClass = item.current_quarter_tor === 'No' ? 'lse-critical' : '';
                    html += `<tr>
                        <td>${item.name}</td>
                        <td>${item.job}</td>
                        <td>${item.compliance_status}</td>
                        <td class="${dueClass}">${item.next_drill_due}</td>
                        <td class="${torClass}">${item.current_quarter_tor}</td>
                    </tr>`;
                }
            });

            html += `<tr><td colspan="5" class="lse-update-row">Updated: ${new Date().toLocaleDateString()}</td></tr>`;
            html += '</table>';
            container.innerHTML = html;
        });
    }

    // ==================== Wiki 页面功能 ====================

    function waitForElement(selector, callback, maxTries = 20, interval = 1000) {
        let tries = 0;

        function check() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                return;
            }
            tries++;
            if (tries < maxTries) {
                setTimeout(check, interval);
            } else {
                console.log(`[DEBUG] Element ${selector} not found after ${maxTries} attempts`);
            }
        }
        check();
    }

    function addButtonAndTableForWiki() {
        console.log("[DEBUG] addButtonAndTableForWiki 函数开始执行");

        var divs = document.getElementsByClassName('xcontent thisIsAPageView');

        if (document.getElementById('BUTTON')) {
            return;
        }

        console.log("Found divs:", divs.length);

        let container = null;
        for (let i = 0; i < divs.length; i++) {
            if (divs[i] && divs[i].textContent && divs[i].textContent.includes('Site Compliance Metric')) {
                container = divs[i];
                console.log("Found container:", container);
                break;
            }
        }

        if (!container) {
            console.log("Container not found");
            return;
        }

        var buttonContainer = document.createElement("div");
        buttonContainer.id = "BUTTON";
        buttonContainer.style.display = "flex";

        var getMetricButton = document.createElement("button");
        getMetricButton.textContent = "获取LSE Metrics";
        buttonContainer.appendChild(getMetricButton);
        getMetricButton.onclick = CreateTableForWiki;

        var removeTableButton = document.createElement("button");
        removeTableButton.textContent = "隐藏表格";
        removeTableButton.onclick = removeTable;
        buttonContainer.appendChild(removeTableButton);

        container.appendChild(buttonContainer);
        console.log("Button added to wiki container");
    }

    function CreateTableForWiki() {
        var existingTable = document.getElementById('table-container');
        const button = document.getElementById('BUTTON');

        button.style.display = 'none';
        if (existingTable) {
            existingTable.parentNode.removeChild(existingTable);
        }

        const message = document.createElement('div');
        message.id = 'loading-message';
        message.textContent = '正在生成表格，请等待...';
        message.style.color = 'blue';
        message.style.marginTop = '10px';
        button.parentNode.insertBefore(message, button.nextSibling);

        processData(result => {
            const tableContainer = document.createElement('div');
            tableContainer.id = 'table-container';

            const table = document.createElement('table');
            table.id = 'my-custom-table';

            const headerRow = table.insertRow();
            headerRow.classList.add('table-header');
            ['Site', 'Compliance Status', 'Next Drill Due', 'Next Next Due'].forEach(text => {
                const cell = headerRow.insertCell();
                cell.textContent = text;
            });

            result.forEach(item => {
                const row = table.insertRow();
                row.insertCell().textContent = item.site;
                row.insertCell().textContent = item.compliance_status;

                const nextDrillCell = row.insertCell();
                nextDrillCell.textContent = item.next_drill_due;

                const dueDate = new Date(item.next_drill_due);
                const daysDiff = Math.ceil((dueDate - new Date()) / (1000 * 3600 * 24));
                if (daysDiff < 7) {
                    nextDrillCell.classList.add('critical-cell');
                } else if (daysDiff < 14) {
                    nextDrillCell.classList.add('warning-cell');
                }

                row.insertCell().textContent = item.next_next_due;
            });

            const updateRow = table.insertRow();
            const updateCell = updateRow.insertCell();
            updateCell.colSpan = 4;
            updateCell.textContent = `Updated on: ${new Date().toLocaleDateString()}`;
            updateCell.classList.add('update-row');

            addWikiStyles();
            tableContainer.appendChild(table);

            var ButtonContainer = document.getElementById('BUTTON');
            if (ButtonContainer) {
                ButtonContainer.parentNode.insertBefore(tableContainer, ButtonContainer.nextSibling);
            }

            button.style.display = 'inline-block';
            const loadingMessage = document.getElementById('loading-message');
            if (loadingMessage) {
                loadingMessage.parentNode.removeChild(loadingMessage);
            }
        });
    }

    function addRDButtonAndTableForWiki() {
        console.log("[DEBUG] addRDButtonAndTableForWiki 函数开始执行");

        var divs = document.getElementsByClassName('xcontent thisIsAPageView');

        if (document.getElementById('RDBUTTON')) {
            return;
        }

        let RDcontainer = null;
        for (let i = 0; i < divs.length; i++) {
            if (divs[i] && divs[i].textContent && divs[i].textContent.includes('RD Compliance Metric*')) {
                RDcontainer = divs[i];
                console.log("Found RD container:", RDcontainer);
                break;
            }
        }

        if (!RDcontainer) {
            console.log("RD Container not found");
            return;
        }

        var RDbuttonContainer = document.createElement("div");
        RDbuttonContainer.id = "RDBUTTON";
        RDbuttonContainer.style.display = "flex";

        var getMetricButton = document.createElement("button");
        getMetricButton.textContent = "获取RD Metrics";
        RDbuttonContainer.appendChild(getMetricButton);
        getMetricButton.onclick = CreateRDTableForWiki;

        var removeTableButton = document.createElement("button");
        removeTableButton.textContent = "隐藏表格";
        removeTableButton.onclick = removeTable;
        RDbuttonContainer.appendChild(removeTableButton);

        RDcontainer.appendChild(RDbuttonContainer);
    }

    function CreateRDTableForWiki() {
        var existingTable2 = document.getElementById('table-container2');
        if (existingTable2) {
            return;
        }

        const button = document.getElementById('RDBUTTON');
        button.style.display = 'none';

        const message = document.createElement('div');
        message.id = 'loading-message';
        message.textContent = '正在生成表格，请等待...';
        message.style.color = 'blue';
        message.style.marginTop = '10px';
        button.parentNode.insertBefore(message, button.nextSibling);

        processRDData(result2 => {
            const RDtableContainer = document.createElement('div');
            RDtableContainer.id = 'table-container2';

            const table = document.createElement('table');
            table.id = 'my-custom-table2';

            let currentGroup = null;

            result2.forEach(item => {
                if (currentGroup !== item.isTrainer) {
                    currentGroup = item.isTrainer;

                    const groupRow = table.insertRow();
                    const groupCell = groupRow.insertCell();
                    groupCell.colSpan = 5;
                    groupCell.textContent = item.isTrainer ? 'DCEO Trainers' : 'DCEO First Responder';
                    groupCell.classList.add('group-header');

                    const headerRow = table.insertRow();
                    headerRow.classList.add('table-header');

                    if (item.isTrainer) {
                        ['Name', 'Network Certified', 'Network Expire Date', 'Power Certified', 'Power Expire Date'].forEach(header => {
                            headerRow.insertCell().textContent = header;
                        });
                    } else {
                        ['Name', 'Job Title', 'Compliance Status', 'Next Drill Due', 'Quarter Emergent TOR Replacement'].forEach(header => {
                            headerRow.insertCell().textContent = header;
                        });
                    }
                }

                const row = table.insertRow();
                if (item.isTrainer) {
                    row.insertCell().textContent = item.name;
                    row.insertCell().textContent = item.network_certified;
                    const networkExpireCell = row.insertCell();
                    networkExpireCell.textContent = item.network_expire;
                    row.insertCell().textContent = item.power_certified;
                    const powerExpireCell = row.insertCell();
                    powerExpireCell.textContent = item.power_expire;

                    addWarningColorByDate(networkExpireCell, item.network_expire);
                    addWarningColorByDate(powerExpireCell, item.power_expire);
                } else {
                    row.insertCell().textContent = item.name;
                    row.insertCell().textContent = item.job;
                    row.insertCell().textContent = item.compliance_status;
                    const nextDrillCell = row.insertCell();
                    nextDrillCell.textContent = item.next_drill_due;
                    const torCell = row.insertCell();
                    torCell.textContent = item.current_quarter_tor;

                    addWarningColorByDate(nextDrillCell, item.next_drill_due);
                    if (item.current_quarter_tor === 'No') {
                        torCell.classList.add('warning2-cell');
                    }
                }
            });

            const updateRow = table.insertRow();
            const updateCell = updateRow.insertCell();
            updateCell.colSpan = 5;
            updateCell.textContent = `Updated on: ${new Date().toLocaleDateString()}`;
            updateCell.classList.add('update-row');

            addWikiStyles();
            RDtableContainer.appendChild(table);

            var RDButtonContainer = document.getElementById('RDBUTTON');
            if (RDButtonContainer) {
                RDButtonContainer.parentNode.insertBefore(RDtableContainer, RDButtonContainer.nextSibling);
            }

            button.style.display = 'inline-block';
            const loadingMessage = document.getElementById('loading-message');
            if (loadingMessage) {
                loadingMessage.parentNode.removeChild(loadingMessage);
            }
        });
    }

    function addWarningColorByDate(cell, dateStr) {
        if (dateStr === 'N/A') return;
        const dueDate = new Date(dateStr);
        const daysDiff = Math.ceil((dueDate - new Date()) / (1000 * 3600 * 24));

        if (daysDiff < 2) {
            cell.classList.add('warning3-cell');
        } else if (daysDiff < 7) {
            cell.classList.add('warning2-cell');
        } else if (daysDiff < 14) {
            cell.classList.add('warning-cell');
        }
    }

    function addWikiStyles() {
        if (document.getElementById('wiki-custom-styles')) return;

        const style = document.createElement('style');
        style.id = 'wiki-custom-styles';
        style.innerHTML = `
            #table-container, #table-container2 {
                display: flex;
                justify-content: center;
                margin-top: 20px;
            }

            #my-custom-table, #my-custom-table2 {
                border-collapse: collapse;
                width: 90%;
            }

            #my-custom-table th, #my-custom-table td,
            #my-custom-table2 th, #my-custom-table2 td {
                border: 1px solid black;
                text-align: center;
                padding: 5px;
                color: black;
            }

            .table-header {
                font-weight: bold;
                background-color: #93afaa;
                font-size: 14px;
            }

            .warning-cell { background-color: yellow; }
            .warning2-cell { background-color: #ff8c00; }
            .warning3-cell { background-color: #ed1f0b; color: white; }
            .critical-cell { background-color: #ff8c00; }

            .update-row {
                font-style: italic;
                text-align: right;
                padding-right: 10px;
            }

            .group-header {
                background-color: #4a6ea9;
                color: white;
                font-weight: bold;
                text-align: left;
                padding: 8px;
                font-size: 16px;
            }
        `;
        document.head.appendChild(style);
    }

    function removeTable() {
        var existingTable = document.getElementById('my-custom-table');
        var existingTable2 = document.getElementById('my-custom-table2');
        if (existingTable) existingTable.parentNode.removeChild(existingTable);
        if (existingTable2) existingTable2.parentNode.removeChild(existingTable2);
    }

    // ==================== 初始化 ====================

    function initializeScript() {
        console.log("[DEBUG] initializeScript 执行");
        console.log("[DEBUG] URL匹配测试:");
        console.log("  - Wiki:", urlwiki.test(document.URL));
        console.log("  - SharePoint:", urlsharepoint.test(document.URL));

        if (urlwiki.test(document.URL)) {
            console.log("[DEBUG] Wiki 页面，初始化 Wiki 功能");
            waitForElement('.xcontent.thisIsAPageView', () => {
                addButtonAndTableForWiki();
                addRDButtonAndTableForWiki();
            }, 10, 500);
        } else if (urlsharepoint.test(document.URL)) {
            console.log("[DEBUG] SharePoint 页面，初始化浮动面板");
            addFloatingPanel();
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

    // 备用延迟初始化
    setTimeout(initializeScript, 2000);

})();