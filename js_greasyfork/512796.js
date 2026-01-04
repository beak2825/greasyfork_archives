// ==UserScript==
// @name         泛微E9-管理员助手
// @namespace    #
// @homepageURL  #
// @version      1.0.0
// @description  让你维护泛微OA系统更方便!
// @author       华仔
// @match        http*://*/wui/*
// @match        http*://*/spa/*
// @match        http*://*/security/monitor/*
// @icon         https://www.weaver.com.cn/img/favicon.ico
// @grant        none
// @run-at       document-end
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/512796/%E6%B3%9B%E5%BE%AEE9-%E7%AE%A1%E7%90%86%E5%91%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/512796/%E6%B3%9B%E5%BE%AEE9-%E7%AE%A1%E7%90%86%E5%91%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        ecode: true,
        engineerNavigation: true,
        dataDictionary: true,
        iconLibrary: true,
        goFeedback: true,
        mobilePage: true,
        securityMonitor: true,
        cacheMonitor: true,
        selectList: true
    };

    const targetHashPath = '#/workflowengine/path/pathSet/pathDetail/formManage/editField';

    // 监控hash变化并触发事件
    function checkHashAndTriggerEvent() {
        const currentHash = window.location.hash;
        if (currentHash.includes(targetHashPath)) {
            console.log('Target hash path detected:', currentHash);
            setupMutationObserver();  // 初始化MutationObserver
            appendIDToFieldPosition(); // 初次加载表格时添加ID到字段位置列后
        }
    }

    // 监听哈希变化
    window.addEventListener('hashchange', function() {
        checkHashAndTriggerEvent();
    });

    // 初次加载页面时检查一次哈希
    checkHashAndTriggerEvent();

    // 等待表格加载的函数
    function waitForTableLoad() {
        const targetNode = document.querySelector('.wea-new-table');

        if (!targetNode) {
            // console.log('Table container not found, checking again in 500ms.');
            setTimeout(waitForTableLoad, 500);
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const tableHeader = document.querySelector('.ant-table thead tr');
            const tableBodyRows = document.querySelectorAll('.ant-table tbody tr');

            if (tableHeader && tableBodyRows.length > 0) {
                // console.log('Table structure found, executing code.');
                appendIDToFieldPosition();
                setupMutationObserver();  // 初始化MutationObserver，监控后续翻页等操作
                obs.disconnect();  // 观察器不再需要，断开连接
            }
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }

    // 调用等待表格加载的函数
    waitForTableLoad();

    // 将ID值附加到字段位置列值后的函数
    function appendIDToFieldPosition() {
        const tableBodyRows = document.querySelectorAll('.ant-table tbody tr');

        tableBodyRows.forEach((row) => {
            const fieldPositionTd = row.querySelector('td:nth-child(3)'); // 第四列为字段位置列
            const idTd = row.querySelector('td:last-child'); // 最后一列为ID列

            if (fieldPositionTd && idTd && !fieldPositionTd.innerText.includes('(')) {
                const idValue = "field" + idTd.getAttribute('stsdata');
                fieldPositionTd.innerText += ` (${idValue})`;
            }
        });

        // console.log('ID appended to Field Position column successfully.');
    }

    // 设置MutationObserver监控翻页或数据变化
    function setupMutationObserver() {
        const tableBody = document.querySelector('.ant-table tbody');

        if (!tableBody) {
            // console.log('Table body not found for MutationObserver.');
            return;
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // console.log('Table content changed, appending ID to Field Position column.');
                    appendIDToFieldPosition();
                }
            });
        });

        observer.observe(tableBody, { childList: true, subtree: true });

        console.log('MutationObserver set up successfully.');
    }

    function addCssIfNotExists(url) {
        const urlWithoutQuery = url.split('?')[0];
        const links = document.head.getElementsByTagName('link');
        for (let i = 0; i < links.length; i++) {
            const linkHrefWithoutQuery = links[i].href.split('?')[0];
            if (linkHrefWithoutQuery.includes(urlWithoutQuery)) {
                return;
            }
        }
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = url;
        document.head.appendChild(linkElement);
    }

    function checkPathhash(fullPath) {
        if (fullPath.includes('/spa/workflow/static4engine/engine.html#/main/workflowengine/form/selectList')) {
            antd.message.info("点击你想查看id的 选择框 即可查看~",10);
        }
    }

    function addStyle(css) {
         const style = document.createElement('style');
         style.textContent = css;
         document.head.appendChild(style);
    }

    window.addEventListener('load', function() {
        // console.log("ccccccccc");
        var pathname = window.location.pathname;
        var hash = window.location.hash;
        var fullPath = pathname + hash;
        checkPathhash(fullPath);
    });


    function initSecurityMonitorFeatures() {
        // console.log("aaaaaaaaa");
        var tableContainer = (document.querySelector(".listTable")? document.querySelector(".listTable").parentElement:(document.querySelector("iframe").contentDocument.querySelector(".listTable")? document.querySelector("iframe").contentDocument.querySelector(".listTable").parentElement:null));
        var messageDiv = document.createElement("div");
        messageDiv.style.textAlign = "left";
        messageDiv.style.marginBottom = "10px";
        messageDiv.style.fontSize = "14px";
        messageDiv.style.color = "#333";
        messageDiv.style.display = "flex";
        messageDiv.style.justifyContent = "space-between";
        messageDiv.style.alignItems = "center";
        messageDiv.innerHTML = '<strong>提示：点击可疑次数、可疑时间可进行排序——泛微ecology9-IT助手</strong>';
        tableContainer.parentElement.insertBefore(messageDiv, tableContainer);

        var checkboxContainer = document.createElement("div");
        checkboxContainer.style.display = "flex";
        checkboxContainer.style.gap = "10px";
        messageDiv.appendChild(checkboxContainer);

        var hideIPCheckbox = createCheckbox("hideIPCheckbox", "隐藏已禁止IP", true);
        checkboxContainer.appendChild(hideIPCheckbox);

        var hideChinaIPCheckbox = createCheckbox("hideChinaIPCheckbox", "隐藏中国IP", true);
        checkboxContainer.appendChild(hideChinaIPCheckbox);

        var table = document.querySelector(".listTable")?document.querySelector(".listTable"):document.querySelector("iframe").contentDocument.querySelector(".listTable");
        var headers = table.querySelectorAll("th");
        var tbody = table.querySelector("tbody");

        addSortFunction(headers[2], tbody, 3, 'number');
        addSortFunction(headers[3], tbody, 4, 'date');

        function toggleIPs() {
            var rows = tbody.querySelectorAll("tr");
            rows.forEach(function(row) {
                var ipCell = row.querySelector("td:first-child span");
                var locationCell = row.querySelector("td:nth-child(2)");
                var isBanned = ipCell.style.backgroundColor === "rgb(240, 87, 87)";
                var isChina = locationCell.textContent.includes("中国");

                if ((isBanned && hideIPCheckbox.querySelector("input").checked) ||
                    (isChina && hideChinaIPCheckbox.querySelector("input").checked)) {
                    row.style.display = "none";
                } else {
                    row.style.display = "";
                }
            });
        }

        hideIPCheckbox.querySelector("input").addEventListener("change", toggleIPs);
        hideChinaIPCheckbox.querySelector("input").addEventListener("change", toggleIPs);
        toggleIPs();
        headers[2].click();
    }

    function createCheckbox(id, labelText, checked) {
        var container = document.createElement("div");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.checked = checked;
        var label = document.createElement("label");
        label.htmlFor = id;
        label.appendChild(document.createTextNode(labelText));
        container.appendChild(checkbox);
        container.appendChild(label);
        return container;
    }

    function addSortFunction(header, tbody, colIndex, type) {
        header.style.cursor = "pointer";
        header.addEventListener("click", function() {
            var rows = Array.from(tbody.querySelectorAll("tr"));
            var isAscending = header.classList.contains("asc");
            rows.sort(function(a, b) {
                var aValue = getValue(a, colIndex, type);
                var bValue = getValue(b, colIndex, type);
                return isAscending ? aValue - bValue : bValue - aValue;
            });
            tbody.innerHTML = "";
            rows.forEach(function(row) {
                tbody.appendChild(row);
            });
            header.classList.toggle("asc", !isAscending);
            header.classList.toggle("desc", isAscending);
        });
    }

    function getValue(row, colIndex, type) {
        var cellValue = row.querySelector(`td:nth-child(${colIndex})`).innerText.trim();
        if (type === 'number') {
            return parseInt(cellValue);
        } else if (type === 'date') {
            return new Date(cellValue).getTime();
        }
    }


    function interceptNetworkRequests() {
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this.addEventListener('readystatechange', function() {
                // console.log("XHR",method,url);
                if (this.readyState === 4 && this.status === 200 && url.includes('/api/ec/dev/table/datas')) {
                    const dataKey = new URLSearchParams(this.responseURL).get('dataKey');
                    if (dataKey) {
                        displayDebugButton(dataKey);
                    }
                }
            });
            return originalXHROpen.apply(this, [method, url, ...args]);
        };

        const originalFetch = window.fetch;
        window.fetch = function(resource, config) {
            // console.log("aabbb",resource,"bbaaa",config);
            if (config && config.method === 'POST' && config.headers) {
                const params = new URLSearchParams(config.body);
                const dataKey = params.get('dataKey');
                if (dataKey) {
                    displayDebugButton(dataKey);
                }
            }

            return originalFetch.apply(this, arguments)
                .then(response => {
                // console.log("response",response);
                if (response.url.includes('/api/ec/dev/table/datas') && response.status === 200) {
                    response.clone().text().then(text => {
                        const params = new URLSearchParams(text);
                        const dataKey = params.get('dataKey');
                        if (dataKey) {
                            displayDebugButton(dataKey);
                        }
                    });
                }else if (response.url.includes('/api/workflow/formManage/publicselect/editselectItem') && response.status === 200) {
                    response.clone().json().then(data => {
                        displayTable(data.datas);
                    }).catch(e => {
                        console.error('Failed to parse response JSON', e);
                    });
                }
                return response;
            });
        };
    }

    function displayDebugButton(dataKey) {
        const debugButton = document.getElementById('debugButton');
        debugButton.onclick = () => window.open(`/api/ec/dev/table/getxml?dataKey=${dataKey}`, '_blank');

        debugButton.style.backgroundColor = '#2196F3';
        debugButton.style.cursor = 'pointer';

        let count = 0;
        const blinkInterval = setInterval(() => {
            debugButton.style.backgroundColor = count % 2 === 0 ? 'gray' : '#2196F3';
            count++;
            if (count >= 10) {
                clearInterval(blinkInterval);
            }
        }, 400);

        setTimeout(() => {
            debugButton.onclick = null;
            debugButton.style.cursor = 'not-allowed';
            debugButton.style.backgroundColor = 'gray';
        }, 10000);
    }

    function makeDraggable(element) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(element.id + "header")) {
            document.getElementById(element.id + "header").onmousedown = dragMouseDown;
        } else {
            element.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function displayTable(datas) {
        if (!Array.isArray(datas)) {
            console.error('Expected an array of datas');
            return;
        }
        const datasCopy = datas.slice();
        const sortedById = datasCopy.sort((a, b) => a.id - b.id);
        const idToSid = {};
        sortedById.forEach((data, index) => {
            idToSid[data.id] = index;
        });

        const container = document.createElement('div');
        container.className = 'onestool-draggable';
        container.id = 'draggableContainer';
        const closeButton = document.createElement('div');
        closeButton.textContent = 'X';
        closeButton.className = 'onestool-close';
        closeButton.onclick = function() { container.remove(); };
        container.appendChild(closeButton);

        const table = document.createElement('table');
        table.className = 'onestool-table';
        container.appendChild(table);

        const header = table.createTHead();
        const headerRow = header.insertRow();
        const headers = ['id', 'sid', 'optiontext', 'canel'];
        headers.forEach(text => {
            const cell = document.createElement('th');
            cell.textContent = text;
            headerRow.appendChild(cell);
        });

        const tbody = table.createTBody();
        datas.forEach(data => {
            const row = tbody.insertRow();
            headers.forEach(key => {
                const cell = row.insertCell();
                cell.textContent = key === 'sid' ? idToSid[data.id] : data[key];
            });
        });

        document.body.appendChild(container);
        makeDraggable(container);
    }




    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = onClick;
        Object.assign(button.style, {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        });
        return button;
    }

    function createIconLibraryButton() {
        const button = document.createElement('button');
        button.textContent = '图标库';
        Object.assign(button.style, {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        });
        button.addEventListener('click', showIcons);
        return button;
    }

    function showIcons() {
        const modal = document.createElement('div');
        modal.className = 'onestool-icon-modal';

        const tabContainer = document.createElement('div');
        tabContainer.className = 'onestool-tab-container';

        const weviconTab = createTabButton('Wevicon', true);
        const ecComiconTab = createTabButton('EcComicon', false);

        tabContainer.appendChild(weviconTab);
        tabContainer.appendChild(ecComiconTab);

        const iconContainer = document.createElement('div');
        iconContainer.id = 'icon-container';

        modal.appendChild(tabContainer);
        modal.appendChild(iconContainer);

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.className = 'onestool-close-button';
        closeButton.addEventListener('click', () => document.body.removeChild(modal));
        modal.appendChild(closeButton);

        document.body.appendChild(modal);

        loadIcons('wevicon');

        weviconTab.addEventListener('click', () => {
            setActiveTab(weviconTab, ecComiconTab);
            loadIcons('wevicon');
        });

        ecComiconTab.addEventListener('click', () => {
            setActiveTab(ecComiconTab, weviconTab);
            loadIcons('ecComicon');
        });
    }

    function createTabButton(text, isActive) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `onestool-tab-button ${isActive ? 'active' : ''}`;
        return button;
    }

    function setActiveTab(activeTab, inactiveTab) {
        activeTab.classList.add('active');
        inactiveTab.classList.remove('active');
    }

    function loadIcons(iconType) {
        const url = iconType === 'wevicon' ? '/spa/theme/static/index.css' : '/cloudstore/resource/pc/com/v1/ecCom.min.css';
        const iconRegex = iconType === 'wevicon' ? /\.wevicon-[^:]+:before\s*\{/g : /\.icon-[a-zA-Z0-9-]+:before\s*\{[^\}]*content\s*:\s*"\\[a-fA-F0-9]+"[^\}]*\}/g;

        fetch(url)
            .then(response => response.text())
            .then(css => {
                let match;
                let iconsHtml = '<div class="onestool-icon-grid">';

                while ((match = iconRegex.exec(css)) !== null) {
                    const iconClass = match[0].split(':')[0].slice(1);

                    iconsHtml += `
                        <div class="onestool-icon-item">
                            <i class="${iconClass} onestool-con-display"></i>
                            <div class="onestool-icon-name">${iconClass.replace(iconType === 'wevicon' ? 'wevicon-' : 'icon-', '')}</div>
                        </div>
                    `;
                }

                iconsHtml += '</div>';

                document.getElementById('icon-container').innerHTML = iconsHtml;
            })
            .catch(error => {
                console.error('Failed to fetch icon CSS:', error);
                alert('Failed to load icon definitions.');
            });
    }

    function createInfoCard(userInfo, workflowInfo, modeInfo) {
        const card = document.createElement('div');
        Object.assign(card.style, {
            position: 'fixed',
            bottom: '100px',
            right: '10px',
            width: '300px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            zIndex: '1000'
        });

        const createSection = (title, data) => {
            const section = document.createElement('div');

            const sectionTitle = document.createElement('h3');
            sectionTitle.textContent = title;
            section.appendChild(sectionTitle);

            const sectionContent = document.createElement('div');
            sectionContent.style.overflowY = 'auto';

            if (data) {
                for (const [key, value] of Object.entries(data)) {
                    const infoItem = document.createElement('p');
                    infoItem.textContent = `${key}: ${value}`;
                    sectionContent.appendChild(infoItem);
                }
            } else {
                const infoItem = document.createElement('p');
                infoItem.textContent = '无可用信息';
                sectionContent.appendChild(infoItem);
            }

            section.appendChild(sectionContent);
            return section;
        };

        if (userInfo) {
            card.appendChild(createSection('用户信息', {
                '部门ID.deptid': userInfo.deptid,
                '部门名称.deptname': userInfo.deptname,
                '分部ID.subcompanyid': userInfo.subcompanyid,
                '分部名称.subcompanyname': userInfo.subcompanyname,
                '用户语言.userLanguage': userInfo.userLanguage,
                '用户ID.userid': userInfo.userid,
                '用户名.username': userInfo.username
            }));
        }

        if (workflowInfo) {
            card.appendChild(createSection('流程信息', {
                '请求ID.requestid': workflowInfo.requestid,
                '流程ID.workflowid': workflowInfo.workflowid,
                '节点ID.nodeid': workflowInfo.nodeid,
                '表单ID.formid': workflowInfo.formid
            }));
        }

        if (modeInfo) {
            card.appendChild(createSection('建模信息', {
                '数据ID.billid': modeInfo.billid,
                '显示类型.type': modeInfo.type,
                '模块ID.modeId': modeInfo.modeId,
                '表单ID.formId': modeInfo.formId,
                '模块名称.modeName': modeInfo.modeName,
                '模块标题.modeTitle': modeInfo.modeTitle
            }));
        }

        if (!userInfo && !workflowInfo && !modeInfo) {
            card.appendChild(createSection('无可用信息', null));
        }

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        Object.assign(closeButton.style, {
            width: '100%',
            padding: '10px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
        });

        closeButton.onclick = () => {
            document.body.removeChild(card);
        };

        card.appendChild(closeButton);
        document.body.appendChild(card);
    }

    function main() {
        addCssIfNotExists('/spa/theme/static/index.css');
        addCssIfNotExists('/cloudstore/resource/pc/com/v1/ecCom.min.css');

        const togglecard = document.createElement('div');
        Object.assign(togglecard.style, {
            position: 'fixed',
            bottom: '50px',
            right: '10px',
            width: '200px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            zIndex: '1000',
            display: 'none'
        });

        if (config.ecode) {
            togglecard.appendChild(createButton('打开ecode', () => window.open('/ecode', '_blank')));
        }

        if (config.mobilePage) {
            togglecard.appendChild(createButton('打开移动端', () => window.open('/spa/portal/static4mobilelogin/index.html', '_blank')));
        }

        if (config.securityMonitor) {
            togglecard.appendChild(createButton('安全包监控', () => window.open('/security/monitor/Monitor.jsp', '_blank')));
        }

        if (config.cacheMonitor) {
            togglecard.appendChild(createButton('SQL缓存管理', () => window.open('/commcache/cacheMonitor.jsp', '_blank')));
        }

        if (config.selectList) {
            togglecard.appendChild(createButton('公共选框ID', () => window.open('/spa/workflow/static4engine/engine.html#/main/workflowengine/form/selectList', '_blank')));
        }

        if (config.engineerNavigation) {
            togglecard.appendChild(createButton('工具箱导航', () => window.open('https://huahan.cc', '_blank')));
        }

        if (config.dataDictionary) {
            togglecard.appendChild(createButton('数据字典', () => window.open('https://oneszhang.com/E9Sql/', '_blank')));
        }

        if (config.iconLibrary) {
            togglecard.appendChild(createIconLibraryButton());
        }

//        if (config.goFeedback) {
//            togglecard.appendChild(createButton('留言反馈', () => window.open('https://oneszhang.com/onestool.html', '_blank')));
//        }

        if (window.location.pathname.includes('/security/monitor')) {
            if (document.getElementById('updateRulesForm')) {
                initSecurityMonitorFeatures();
            }
            if (typeof window.resetbanner === 'function') {
                const originalResetBanner = window.resetbanner;
                window.resetbanner = function(objid) {
                    originalResetBanner(objid);
                    if (objid === 4) {
                        const iframe = document.getElementById('iframeAlert');
                        iframe.addEventListener('load', function() {
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                            if (iframeDoc.querySelector('.listTable')) {
                                initSecurityMonitorFeatures();
                            }
                        });
                    }
                };
            }
        }

        const allButtonContainer = document.createElement('div');
        Object.assign(allButtonContainer.style, {
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1001'
        });

        const toggleButton = document.createElement('div');
        const toggleiconElement = document.createElement('i');
        toggleiconElement.className = 'icon-New-Flow-menu';
        toggleButton.appendChild(toggleiconElement);

        Object.assign(toggleButton.style, {
            width: '30px',
            height: '30px',
            backgroundColor: '#4CAF50',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            cursor: 'pointer',
            marginLeft: '10px'
        });
        toggleButton.onclick = () => togglecard.style.display = togglecard.style.display === 'none' ? 'block' : 'none';

        const debugButton = document.createElement('div');
        const debugiconElement = document.createElement('i');
        debugiconElement.className = 'wevicon-menu-2--5731';
        debugButton.appendChild(debugiconElement);

        debugButton.id = 'debugButton';
        Object.assign(debugButton.style, {
            width: '30px',
            height: '30px',
            backgroundColor: 'gray',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            cursor: 'not-allowed',
            marginLeft: '10px'
        });

        const infoButton = document.createElement('div');
        const infoiconElement = document.createElement('i');
        infoiconElement.className = 'icon-coms02-Version';
        infoButton.appendChild(infoiconElement);

        infoButton.id = 'infoButton';
        Object.assign(infoButton.style, {
            width: '30px',
            height: '30px',
            backgroundColor: '#14b8a6',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            cursor: 'pointer',
            marginLeft: '10px'
        });

        infoButton.onclick = () => {
            const userInfo = JSON.parse(localStorage.getItem('theme-account'));
            const workflowInfo = (typeof wfform !== 'undefined' && wfform !== null && typeof wfform.getBaseInfo === 'function') ? wfform.getBaseInfo() : null;
            const modeInfo = (typeof ModeForm !== 'undefined' && ModeForm !== null && typeof ModeForm.getCardUrlInfo === 'function') ? ModeForm.getCardUrlInfo() : null;
            createInfoCard(userInfo, workflowInfo, modeInfo);
        };


        allButtonContainer.appendChild(debugButton);
        allButtonContainer.appendChild(infoButton);
        allButtonContainer.appendChild(toggleButton);

        document.body.appendChild(togglecard);
        document.body.appendChild(allButtonContainer);

        interceptNetworkRequests();
    }

    addStyle(`
        .onestool-icon-button {
            position: fixed;
            left: 10px;
            bottom: 10px;
            z-index: 9999;
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        }
        .onestool-icon-button:hover {
            background-color: #45a049;
        }
        .onestool-icon-modal {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            width: 90%;
            height: 90%;
            overflow: auto;
            z-index: 10000;
        }
        .onestool-icon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 10px;
        }
        .onestool-icon-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 5px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            transition: box-shadow 0.3s;
            height: 80px;
        }
        .onestool-icon-item:hover {
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .onestool-con-display {
            font-size: 24px;
            margin-bottom: 5px;
        }
        .onestool-icon-name {
            font-size: 10px;
            text-align: center;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            white-space: nowrap;
        }
        .onestool-close-button {
            position: absolute;
            right: 10px;
            top: 10px;
            background-color: #f44336;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .onestool-close-button:hover {
            background-color: #d32f2f;
        }
        .onestool-tab-container {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }
        .onestool-tab-button {
            padding: 10px 20px;
            background-color: #f0f0f0;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .onestool-tab-button:hover {
            background-color: #e0e0e0;
        }
        .onestool-tab-button.active {
            background-color: #4CAF50;
            color: white;
        }
        .onestool-table {
            border-collapse: collapse;
            width: 100%;
        }
        .onestool-table, .onestool-table th, .onestool-table td {
            border: 1px solid black;
            padding: 5px;
        }
        .onestool-draggable {
            position: absolute;
            top: 10%;
            left: 10%;
            width: 80%;
            background: white;
            border: 1px solid black;
            z-index: 10000;
        }
        .onestool-close {
            cursor: pointer;
            position: absolute;
            top: 0;
            right: 0;
            padding: 5px 10px;
        }
    `);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();
