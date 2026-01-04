// ==UserScript==
// @name        LSE Drill Metric Viewer
// @namespace   http://tampermonkey.net/
// @match       https://quip-amazon.com/*/BJS-DCEO-weekly-meeting*
// @match       https://w.amazon.com/bin/view/G_China_Infra_Ops/BJSPEK/DCEO/LSE*
// @grant       GM_xmlhttpRequest
// @license     MIT
// @version     2.15
// @author      xiongwev
// @description To help DCEO view LSE drill in quip
// @downloadURL https://update.greasyfork.org/scripts/502249/LSE%20Drill%20Metric%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/502249/LSE%20Drill%20Metric%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url1 = 'https://rdwf2-prod.corp.amazon.com/api/lsedrill/sites/cluster/BJS';
    var url2 = 'https://rdwf2-prod.corp.amazon.com/api/lsedrill/sites/cluster/PEK';
    var url3 = 'https://rdwf2-prod.corp.amazon.com/api/lsedrill/sites/cluster/PKX';

    var url4 = 'https://rdwf2-prod.corp.amazon.com/api/rackdowndrill/users/cluster/BJS';
    var url5 = 'https://rdwf2-prod.corp.amazon.com/api/rackdowndrill/users/cluster/PEK';
    var url6 = 'https://rdwf2-prod.corp.amazon.com/api/rackdowndrill/users/cluster/PKX';

    var currentURL = document.URL;
    var isScriptExecuted = false;
    var newWindow;

    // 检查是否进行SSO认证
    GM_xmlhttpRequest({
        method: 'GET',
        url: url1,
        onload: function(response) {
            const check = JSON.parse(response.responseText);
            if (check.message === 'More authentication needed.') {
                window.open('https://midway-auth.amazon.com/login?reauth=1#midway', 'floatingWindow', `width=600,height=400`);
            }
        }
    });

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
                console.log(`Element ${selector} not found after ${maxTries} attempts`);
            }
        }

        check();
    }

    document.addEventListener('DOMContentLoaded', function() {
        const urlquip = /https:\/\/quip-amazon\.com\/.*\/BJS-DCEO-weekly-meeting.*/;
        const urlwiki = /https:\/\/w.amazon\.com\/bin\/view\/G_China_Infra_Ops\/BJSPEK\/DCEO\/LSE.*/;

        if (urlquip.test(document.URL)) {
            // Quip页面：等待特定元素
            waitForElement('.section.allows-caret', () => {
                addButtonAndTable();
                addRDButtonAndTable();
            });
        } else if (urlwiki.test(document.URL)) {
            // Wiki页面：等待页面基本结构加载完成
            waitForElement('body', () => {
                addButtonAndTable();
                addRDButtonAndTable();
            }, 10, 500); // 较短的等待时间
        }
    });

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

    // LSE Drill
    function addButtonAndTable() {
        console.log('开始创建按钮元素');
        const urlquip = /https:\/\/quip-amazon\.com\/.*\/BJS-DCEO-weekly-meeting.*/;
        const urlwiki = /https:\/\/w.amazon\.com\/bin\/view\/G_China_Infra_Ops\/BJSPEK\/DCEO\/LSE.*/;

        if (urlquip.test(document.URL)) {
            var divs = document.getElementsByClassName('section allows-caret');
        } else if (urlwiki.test(document.URL)) {
            var divs = document.getElementsByClassName('xcontent thisIsAPageView');
        }

        // 检查是否已经存在按钮
        var existingButton = document.getElementById('BUTTON');
        if (existingButton) {
            return; // 如果按钮已经存在,则直接返回
        }

        // 添加调试信息
        console.log("Found divs:", divs.length);

        let container = null;
        // 遍历所有 div 元素,检查文本内容
        for (let i = 0; i < divs.length; i++) {
            if (divs[i].textContent && divs[i].textContent.includes('Site Compliance Metric')) {
                container = divs[i];
                console.log("Found container:", container);
                break;
            }
        }

        // 如果没有找到容器，退出函数
        if (!container) {
            console.log("Container not found, waiting for next attempt");
            return;
        }

        // 创建按钮容器
        var buttonContainer = document.createElement("div");
        buttonContainer.id = "BUTTON";
        buttonContainer.style.display = "flex";

        // 添加按钮
        var getMetricButton = document.createElement("button");
        getMetricButton.textContent = "获取LSE Metrics";
        buttonContainer.appendChild(getMetricButton);
        getMetricButton.onclick = CreateTable;

        // 添加删除表格按钮
        var removeTableButton = document.createElement("button");
        removeTableButton.textContent = "隐藏表格";
        removeTableButton.onclick = removeTable;
        buttonContainer.appendChild(removeTableButton);

        try {
            // 统一使用找到的container，无论是哪个页面
            container.appendChild(buttonContainer);

            if (urlquip.test(document.URL)) {
                console.log("Button added to quip container");
            } else if (urlwiki.test(document.URL)) {
                console.log("Button added to wiki container");
            }
        } catch (error) {
            console.error("Error adding button:", error);
        }
    }

    // 从API获取数据
    function processData(callback) {
        Promise.all([fetchData(url1), fetchData(url2), fetchData(url3)])
            .then(([data1, data2, data3]) => {
            // 将数据进行合并
            const data = [...data1, ...data2, ...data3];
            var result = data.filter(item => item.active === true)
            .map(item => {
                // 获取最近一次drill的完成时间
                const lastDrillDate = item.lse_drills && item.lse_drills.length > 0
                ? new Date(item.lse_drills[0].completed_at)
                : null;

                // 计算下下次due day (最近完成时间 + 90天)
                const nextNextDueDate = lastDrillDate
                ? new Date(lastDrillDate.getTime() + (91 * 24 * 60 * 60 * 1000))
                : null;

                return {
                    site: item.site,
                    compliance_status: item.lse_compliance,
                    next_drill_due: item.lse_next_drill_due.slice(0, 10),
                    next_next_due: nextNextDueDate
                    ? nextNextDueDate.toISOString().slice(0, 10)
                    : 'N/A'
                };
            });

            result.sort((a, b) => {
                const aDate = new Date(a.next_drill_due);
                const bDate = new Date(b.next_drill_due);
                const currentDate = new Date();
                const aDiff = aDate.getTime() - currentDate.getTime();
                const bDiff = bDate.getTime() - currentDate.getTime();
                return aDiff - bDiff;
            });

            callback(result);
        })
            .catch(error => {
            console.error(error);
        });
    }

    // 创建表格
    function CreateTable(){
        var existingTable = document.getElementById('table-container');
        const button = document.getElementById('BUTTON');
        const loadingIndicator = document.getElementById('loading-indicator');

        // 如果表格存在,则移除它
        button.style.display = 'none';
        if (existingTable) {
            existingTable.parentNode.removeChild(existingTable);
        }

        button.disabled = true;
        if (loadingIndicator) {
            loadingIndicator.style.display = 'inline-block';
        }
        // 显示提示消息
        const message = document.createElement('div');
        message.id = 'loading-message';
        message.textContent = '正在生成表格，请等待...';
        message.style.color = 'blue';
        message.style.marginTop = '10px';
        button.parentNode.insertBefore(message, button.nextSibling);

        processData(result => {
            const tableContainer = document.createElement('div');
            tableContainer.id = 'table-container';

            // 处理 result 数据
            const table = document.createElement('table');
            table.id = 'my-custom-table';

            // 创建表头行
            const headerRow = table.insertRow();
            headerRow.classList.add('table-header');
            const siteHeader = headerRow.insertCell();
            siteHeader.textContent = 'Site';
            const complianceHeader = headerRow.insertCell();
            complianceHeader.textContent = 'Compliance Status';
            const nextDrillHeader = headerRow.insertCell();
            nextDrillHeader.textContent = 'Next Drill Due';
            const nextNextDrillHeader = headerRow.insertCell(); // 添加新列
            nextNextDrillHeader.textContent = 'Next Next Due';

            // 创建数据行
            result.forEach(item => {
                const row = table.insertRow();
                const siteCell = row.insertCell();
                siteCell.textContent = item.site;
                const complianceCell = row.insertCell();
                complianceCell.textContent = item.compliance_status;
                const nextDrillCell = row.insertCell();
                nextDrillCell.textContent = item.next_drill_due;
                const nextNextDrillCell = row.insertCell(); // 添加新列
                nextNextDrillCell.textContent = item.next_next_due;

                // 计算距离当前时间的天数
                const dueDate = new Date(item.next_drill_due);
                const currentDate = new Date();
                const timeDiff = dueDate.getTime() - currentDate.getTime();
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

                // 添加警告颜色
                if (daysDiff < 7) {
                    nextDrillCell.classList.add('critical-cell');
                } else if(daysDiff < 14) {
                    nextDrillCell.classList.add('warning-cell');
                }
            });

            // 添加数据更新日期行
            const updateRow = table.insertRow();
            const updateCell = updateRow.insertCell();
            updateCell.colSpan = 4; // 合并单元格
            updateCell.textContent = `Updated on: ${new Date().toLocaleDateString()}`;
            updateCell.classList.add('update-row'); // 添加样式类

            const style = document.createElement('style');
            style.innerHTML = `
  #table-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  }

  #my-custom-table {
    border-collapse: collapse; /* 合并单元格边框 */
    width: 60%
  }

  #my-custom-table th, #my-custom-table td {
    border: 1px solid black; /* 为所有单元格添加边框 */
    text-align: center; /* 所有单元格内容居中对齐 */
    padding: 5px; /* 为单元格添加内边距,调整内容与边框的距离 */
    color: black;
    width: 25%;
  }

  .table-header {
    font-weight: bold; /* 为表头单元格加粗 */
    background-color: #93afaa;
    font-size: 16px;
  }

  .warning-cell {
    background-color: yellow; /* 设置警告单元格的背景色为黄色 */
  }

  .critical-cell {
  background-color: #ff8c00; /* 设置临近到期单元格的背景色为深橙色 */
  }

  .update-row {
  font-style: italic; /* 使用斜体字样式 */
  text-align: right; /* 右对齐文本 */
  padding-right: 10px; /* 为右侧添加一些内边距 */
  }
`;
            document.head.appendChild(style);

            // 将表格添加到表格容器中
            tableContainer.appendChild(table);

            // 选择按钮所在的容器元素
            var ButtonContainer = document.getElementById('BUTTON');
            if (ButtonContainer) {
                ButtonContainer.parentNode.insertBefore(tableContainer, ButtonContainer.nextSibling);
            }
            // 恢复按钮状态，隐藏加载指示器和消息
            button.style.display = 'inline-block';

            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            const loadingMessage = document.getElementById('loading-message');
            if (loadingMessage) {
                loadingMessage.parentNode.removeChild(loadingMessage);
            }
        });
    }




    // RD Drill
    // 从API获取数据
    function processRDData(callback) {
        Promise.all([fetchData(url4), fetchData(url5), fetchData(url6)])
            .then(([data4, data5, data6]) => {
            const data = [...data4, ...data5, ...data6];

            // 处理 trainer 数据
            const trainerData = data
            .filter(item => item.team === 'DCEO' && item.trainer === true)
            .map(item => ({
                name: item.full_name,
                network_certified: item.network_certified ? "Yes" : "No",
                network_expire: item.network_certified_until ? item.network_certified_until.slice(0, 10) : "N/A",
                power_certified: item.power_certified ? "Yes" : "No",
                power_expire: item.power_certified_until ? item.power_certified_until.slice(0, 10) : "N/A",
                isTrainer: true
            }));

            // 处理非 trainer 数据
            const nonTrainerLogins = data
            .filter(item =>
                    item.team === 'DCEO' &&
                    (!item.hasOwnProperty('trainer') || item.trainer === false)
                   )
            .map(item => item.login);

            const historyPromises = nonTrainerLogins.map(login =>
                                                         fetchData(`https://rdwf.corp.amazon.com/api/rackdowndrill/drills/login/${login}`)
                                                        );

            return Promise.all(historyPromises)
                .then(historiesResults => {
                const nonTrainerData = data
                .filter(item =>
                        item.team === 'DCEO'&&
                        (!item.hasOwnProperty('trainer') || item.trainer === false)
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

                // 分别对 trainer 和非 trainer 数据进行排序
                const sortedTrainerData = trainerData.sort((a, b) => {
                    return new Date(a.network_expire) - new Date(b.network_expire);
                });

                const sortedNonTrainerData = nonTrainerData.sort((a, b) => {
                    return new Date(a.next_drill_due) - new Date(b.next_drill_due);
                });

                const result2 = [...sortedTrainerData, ...sortedNonTrainerData];
                callback(result2);
            });
        })
            .catch(error => {
            console.error(error);
        });
    }

    function getCurrentQuarter() {
        const now = new Date();
        const currentMonth = now.getMonth(); // 0-11
        const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
        const quarterStart = new Date(now.getFullYear(), quarterStartMonth, 1);
        return {
            start: quarterStart,
            end: now
        };
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

    // 根据日期添加警告颜色
    function addWarningColorByDate(cell, dateStr) {
        if (dateStr === 'N/A') return;

        const dueDate = new Date(dateStr);
        const currentDate = new Date();
        const daysDiff = Math.ceil((dueDate - currentDate) / (1000 * 3600 * 24));

        if (daysDiff < 2) {
            cell.classList.add('warning3-cell');
        } else if (daysDiff < 7) {
            cell.classList.add('warning2-cell');
        } else if (daysDiff < 14) {
            cell.classList.add('warning-cell');
        }
    }

    function addRDButtonAndTable() {
        // 获取所有 div 元素
        const divs = document.getElementsByClassName('section allows-caret');

        // 检查是否已经存在按钮
        var existingButton = document.getElementById('RDBUTTON');
        if (existingButton) {
            return; // 如果按钮已经存在,则直接返回
        }

        let RDcontainer = null;
        // 遍历所有 div 元素,检查文本内容
        for (let i = 0; i < divs.length; i++) {
            if (divs[i].textContent && divs[i].textContent.includes('RD Compliance Metrics')) {
                RDcontainer = divs[i];
                console.log("Found RD container:", RDcontainer);
                break;
            }
        }

        // 如果没有找到容器，退出函数
        if (!RDcontainer) {
            console.log("RD Container not found, waiting for next attempt");
            return;
        }

        // 创建按钮容器
        var RDbuttonContainer = document.createElement("div");
        RDbuttonContainer.id = "RDBUTTON"
        RDbuttonContainer.style.display = "flex";

        // 添加按钮
        var getMetricButton = document.createElement("button");
        getMetricButton.textContent = "获取RD Metrics";
        RDbuttonContainer.appendChild(getMetricButton);
        getMetricButton.onclick = CreateRDTable;

        // 添加删除表格按钮
        var removeTableButton = document.createElement("button");
        removeTableButton.textContent = "隐藏表格";
        removeTableButton.onclick = removeTable;
        RDbuttonContainer.appendChild(removeTableButton);

        const urlquip = /https:\/\/quip-amazon\.com\/.*\/BJS-DCEO-weekly-meeting.*/;

        if (urlquip.test(document.URL)){
            // 将按钮容器添加到目标容器中
            RDcontainer.appendChild(RDbuttonContainer);
        } else {
            console.log('未找到RD按钮添加位置')
        }
    }

    function CreateRDTable(){
        var existingTable2 = document.getElementById('table-container2');
        if (existingTable2) {
            return;
        }

        const button = document.getElementById('RDBUTTON');
        const loadingIndicator = document.getElementById('loading-indicator');

        // 如果表格存在,则直接返回
        button.style.display = 'none';

        button.disabled = true;
        if (loadingIndicator) {
            loadingIndicator.style.display = 'inline-block';
        }
        // 显示提示消息
        const message = document.createElement('div');
        message.id = 'loading-message';
        message.textContent = '正在生成表格，请等待...';
        message.style.color = 'blue';
        message.style.marginTop = '10px';
        button.parentNode.insertBefore(message, button.nextSibling);

        processRDData(result2 => {
            const RDtableContainer = document.createElement('div');
            RDtableContainer.id = 'table-container';

            const table = document.createElement('table');
            table.id = 'my-custom-table2';

            let currentGroup = null;

            result2.forEach(item => {
                if (currentGroup !== item.isTrainer) {
                    currentGroup = item.isTrainer;

                    // 添加分组标题行
                    const groupRow = table.insertRow();
                    const groupCell = groupRow.insertCell();
                    groupCell.colSpan = item.isTrainer ? 5 : 4;
                    groupCell.textContent = item.isTrainer ? 'DCEO Trainers' : 'DCEO First Responder';
                    groupCell.classList.add('group-header');

                    // 添加表头行
                    const headerRow = table.insertRow();
                    headerRow.classList.add('table-header');

                    if (item.isTrainer) {
                        headerRow.classList.add('trainer');
                    } else {
                        headerRow.classList.add('first-responder');
                    }

                    if (item.isTrainer) {
                        ['Name', 'Network Certified', 'Network Expire Date',
                         'Power Certified', 'Power Expire Date'].forEach(header => {
                            const cell = headerRow.insertCell();
                            cell.textContent = header;
                            cell.style.width = '20%'; // 确保每列占20%宽度
                        });
                    } else {
                        ['Name', 'Job Title', 'Compliance Status', 'Next Drill Due',
                         'Quarter Emergent TOR Replacement'].forEach(header => {
                            const cell = headerRow.insertCell();
                            cell.textContent = header;
                            cell.style.width = '20%'; // 改为5列，每列20%
                        });
                        groupCell.colSpan = 5; // 修改colSpan为5
                    }
                }

                // 添加数据行
                const row = table.insertRow();
                if (item.isTrainer) {
                    row.classList.add('trainer');
                } else {
                    row.classList.add('first-responder');
                }
                if (item.isTrainer) {
                    // Trainer数据行
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
                    // First Responder数据行
                    row.insertCell().textContent = item.name;
                    row.insertCell().textContent = item.job;
                    row.insertCell().textContent = item.compliance_status;
                    const nextDrillCell = row.insertCell();
                    nextDrillCell.textContent = item.next_drill_due;
                    const torCell = row.insertCell();
                    torCell.textContent = item.current_quarter_tor;

                    addWarningColorByDate(nextDrillCell, item.next_drill_due);
                    // 只对非N/A的情况添加警告颜色
                    if (item.current_quarter_tor === 'No') {
                        torCell.classList.add('warning2-cell');
                    }
                }
            });

            // 添加数据更新日期行
            const updateRow = table.insertRow();
            const updateCell = updateRow.insertCell();
            updateCell.colSpan = 5; // 合并单元格
            updateCell.textContent = `Updated on: ${new Date().toLocaleDateString()}`;
            updateCell.classList.add('update-row'); // 添加样式类

            const style = document.createElement('style');
            style.innerHTML = `
    #table-container {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

    #my-custom-table2 {
        border-collapse: collapse;
        width: 90%;
        margin: 0 auto;
        table-layout: fixed;
    }

    #my-custom-table2 td {
        border: 1px solid black;
        text-align: center;
        padding: 5px;
        color: black;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .table-header {
        font-weight: bold;
        background-color: #93afaa;
        font-size: 14px;
    }

    .table-header td {
        white-space: normal !important;
        word-wrap: break-word;
        height: 40px;
        vertical-align: middle;
    }

    .group-header {
        background-color: #4a6ea9;
        color: white;
        font-weight: bold;
        text-align: left;
        padding: 8px;
        font-size: 16px;
        width: 100%;
    }

    .first-responder td {
        width: 25%;
    }

    .trainer td {
        width: 20%;
    }

  .warning-cell {
    background-color: yellow; /* 设置警告单元格的背景色为黄色 */
  }

  .warning2-cell {
  background-color: #ff8c00; /* 设置临近到期单元格的背景色为深橙色 */
  }

  .warning3-cell {
  background-color: #ed1f0b; /* 设置临近到期单元格的背景色为红色 */
  }

  .update-row {
  font-style: italic; /* 使用斜体字样式 */
  text-align: right; /* 右对齐文本 */
  padding-right: 10px; /* 为右侧添加一些内边距 */
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

            // 将表格添加到表格容器中
            RDtableContainer.appendChild(table);

            // 选择按钮所在的容器元素
            var RDButtonContainer = document.getElementById('RDBUTTON');
            if (RDButtonContainer) {
                RDButtonContainer.parentNode.insertBefore(RDtableContainer, RDButtonContainer.nextSibling);
            }
            // 恢复按钮状态，隐藏加载指示器和消息
            button.style.display = 'inline-block';

            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            const loadingMessage = document.getElementById('loading-message');
            if (loadingMessage) {
                loadingMessage.parentNode.removeChild(loadingMessage);
            }
        });
    }




    // 监听 URL 变化事件
    window.addEventListener('hashchange', urlChanged);
    window.addEventListener('popstate', urlChanged);
    window.history.replaceState = new Proxy(window.history.replaceState, {
        apply: function(target, thisArg, argArray) {
            var result = Reflect.apply(target, thisArg, argArray);
            urlChanged();
            return result;
        }

    });

    function urlChanged() {
        var newURL = document.URL;
        var urlPattern = /https:\/\/quip-amazon\.com\/.*\/BJS-DCEO-weekly-meeting.*/;
        if (newURL !== currentURL && urlPattern.test(newURL)) {
            currentURL = newURL;
            isScriptExecuted = false; // 重置执行状态
            executeScript();
        }
    }

    function executeScript() {
        if (!isScriptExecuted) {
            isScriptExecuted = true;
            addButtonAndTable();
            addRDButtonAndTable();
        }
    }

    function removeTable() {
        var existingTable = document.getElementById('my-custom-table');
        var existingTable2 = document.getElementById('my-custom-table2');
        // 如果表格存在,则移除它
        if (existingTable) {
            existingTable.parentNode.removeChild(existingTable);
        }
        if (existingTable2) {
            existingTable2.parentNode.removeChild(existingTable2);
        }
    }

    // 在脚本末尾添加
    function initializeScript() {
        const urlquip = /https:\/\/quip-amazon\.com\/.*\/BJS-DCEO-weekly-meeting.*/;
        const urlwiki = /https:\/\/w.amazon\.com\/bin\/view\/G_China_Infra_Ops\/BJSPEK\/DCEO\/LSE.*/;

        if (urlquip.test(document.URL) || urlwiki.test(document.URL)) {
            console.log("Initializing script for URL:", document.URL);
            addButtonAndTable();
            addRDButtonAndTable();
        }
    }

    // 页面加载完成后直接尝试初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        // 如果页面已经加载完成，直接执行
        initializeScript();
    }

    // 同时保留原有的监听器作为备选
    setTimeout(initializeScript, 2000); // 2秒后再次尝试
})();
