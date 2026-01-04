// ==UserScript==
// @name         Fetch Data from XTRF views for further processing
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Fetch paginated data from XTRF views, extract specific columns, and provide options to download as Excel or JSON.
// @author       Floyd
// @match        https://langlinking.s.xtrf.eu/xtrf/faces/*/browse*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      langlinking.s.xtrf.eu
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @connect      update.greasyfork.org
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512339/Fetch%20Data%20from%20XTRF%20views%20for%20further%20processing.user.js
// @updateURL https://update.greasyfork.org/scripts/512339/Fetch%20Data%20from%20XTRF%20views%20for%20further%20processing.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function checkForUpdates() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://update.greasyfork.org/scripts/512339/Fetch%20Data%20from%20XTRF%20views%20for%20further%20processing.meta.js",
            onload: function (response) {
                const latestVersionMatch = /@version\s+([0-9.]+)/.exec(response.responseText);
                if (latestVersionMatch) {
                    const latestVersion = latestVersionMatch[1];
                    const currentVersion = GM_info.script.version;
                    if (latestVersion > currentVersion) {
                        alert("XTRF View Data Extractor 有新版本可用: " + latestVersion + "\n请点击OK更新");
                        window.location.href = "https://greasyfork.org/en/scripts/512339-fetch-data-from-xtrf-views-for-further-processing";
                    }
                }
            },
            onerror: function (error) {
                console.error('Error checking for updates:', error);
            }
        });
    }

    // Configuration
    let collectedRows = [];
    let headers = [];
    let cachedData = null;
    let dataFetched = false;
    let selectedColumns = []; // Store selected columns
    // const googleScriptUrl = "https://script.google.com/macros/s/AKfycbw7ycuaIK20xHdIZ9TCZAKFf7VbWTEmAPbYC3Pikj0QAMnHt2L2674dClXwBVrkmqcN/exec"; // Replace with your Google Apps Script URL

    // Function to extract parameters from URL
    function extractParameters(url) {
        const params = new URL(url).searchParams;
        let queryString = '';
        for (const [key, value] of params.entries()) {
            if (key === 'filters') {
                let splittedFiltersValue = [];
                let depth = 0;
                let currentPart = '';

                for (let char of value) {
                    if (char === '(') {
                        depth++;
                    } else if (char === ')') {
                        depth--;
                    }

                    if (char === ';' && depth === 0) {
                        splittedFiltersValue.push(currentPart);
                        currentPart = '';
                    } else {
                        currentPart += char;
                    }
                }

                if (currentPart) {
                    splittedFiltersValue.push(currentPart);
                }

                for (const filter of splittedFiltersValue) {
                    const [field, val] = filter.split(':');
                    if (field && val) {
                        queryString += `&q.${field}=${encodeURIComponent(val)}`;
                    }
                }
            }
        }
        return queryString;
    }

    // Function to reset data before fetching
    function resetData() {
        collectedRows = [];
        headers = [];
        cachedData = null;
        dataFetched = false;
        selectedColumns = [];
    }

    // Function to fetch paginated data
    function fetchData() {
        resetData();
        showLoadingProgress(true);

        const currentUrl = window.location.href;
        let viewId = new URL(currentUrl).searchParams.get('viewId');
        let queryString = '';
        let initialUrl = '';

        if (!viewId) {
            viewId = prompt('未检测到 viewId，请输入 viewId:');
            if (!viewId) {
                alert('未输入 viewId，操作取消。');
                showLoadingProgress(false);
                return;
            }
            // Use only page=0&maxRows=0 when user inputs viewId manually
            queryString = 'page=0&maxRows=0';
            initialUrl = `https://langlinking.s.xtrf.eu/home-api/browser?${queryString}&viewId=${encodeURIComponent(viewId)}`;
        } else {
            queryString = extractParameters(currentUrl);
            initialUrl = `https://langlinking.s.xtrf.eu/home-api/browser?page=1${queryString}&useDeferredColumns=multipleRequests&viewId=${encodeURIComponent(viewId)}`;
        }

        fetchPaginatedData(initialUrl);
    }

    // Function to fetch paginated data recursively
    function fetchPaginatedData(url) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                if (response.status !== 200) {
                    console.error(`Error fetching data: Received non-200 status code ${response.status} for url ${url}, response: ${response.responseText}`);
                    showLoadingProgress(false);
                    return;
                }

                try {
                    const json = JSON.parse(response.responseText);
                    const rows = json.rows;
                    const columns = json.header.columns;
                    const nextPage = json.header.pagination.links.nextPage;

                    // Extract headers and rows
                    if (headers.length === 0 && columns) {
                        headers = columns.map(col => col.fullHeader);
                    }

                    if (rows) {
                        collectedRows.push(...Object.values(rows).map(row => row.columns));
                    }

                    // If there is another page, fetch it
                    if (nextPage) {
                        fetchPaginatedData(nextPage);
                    } else {
                        cachedData = { headers, rows: collectedRows };
                        dataFetched = true;
                        showLoadingProgress(false);
                        showColumnSelection();
                    }
                } catch (e) {
                    console.error('Error parsing response:', e);
                    showLoadingProgress(false);
                }
            },
            onerror: function (error) {
                console.error('Error fetching data:', error);
                showLoadingProgress(false);
            }
        });
    }

    // Function to download JSON data
    function downloadJsonData() {
        if (!dataFetched || !cachedData) {
            alert('没有可用的数据，请先获取数据。');
            return;
        }

        if (selectedColumns.length === 0) {
            alert('没有选中的列，请先选择列。');
            return;
        }

        const jsonData = cachedData.rows.map(row => {
            const obj = {};
            selectedColumns.forEach((col) => {
                obj[col] = row[headers.indexOf(col)];
            });
            return obj;
        });

        const jsonContent = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonData, null, 2));
        const link = document.createElement('a');
        link.setAttribute('href', jsonContent);
        link.setAttribute('download', 'data.json');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Function to download Excel data
    function downloadExcelData() {
        if (!dataFetched || !cachedData) {
            alert('没有可用的数据，请先获取数据。');
            return;
        }

        if (selectedColumns.length === 0) {
            alert('没有选中的列，请先选择列。');
            return;
        }

        const data = [selectedColumns];
        cachedData.rows.forEach(row => {
            const rowData = selectedColumns.map(col => row[headers.indexOf(col)]);
            data.push(rowData);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Function to display column selection UI
    function showColumnSelection() {
        if (!dataFetched || !cachedData) {
            alert('没有可用的数据，请先获取数据。');
            return;
        }

        // Remove existing column selection if it's already open
        const existingSelectionContainer = document.getElementById('column-selection');
        if (existingSelectionContainer) {
            existingSelectionContainer.remove();
        }

        const selectionContainer = document.createElement('div');
        selectionContainer.id = 'column-selection';
        selectionContainer.style.position = 'fixed';
        selectionContainer.style.top = '55px';
        selectionContainer.style.left = 'calc(50% + 285px)';
        selectionContainer.style.transform = 'translateX(-50%)';
        selectionContainer.style.backgroundColor = '#f9f9f9';
        selectionContainer.style.padding = '20px';
        selectionContainer.style.border = '1px solid #ccc';
        selectionContainer.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
        selectionContainer.style.zIndex = '1001';
        selectionContainer.style.maxHeight = '50vh';
        selectionContainer.style.overflowY = 'auto';
        selectionContainer.style.borderRadius = '8px';

        const titleContainer = document.createElement('div');
        titleContainer.style.display = 'flex';
        titleContainer.style.justifyContent = 'space-between';
        titleContainer.style.alignItems = 'center';
        titleContainer.style.marginBottom = '10px';

        const title = document.createElement('h3');
        title.innerText = '选择列';
        title.style.margin = '0';

        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '24px';
        closeButton.style.lineHeight = '1';
        closeButton.onclick = () => {
            selectionContainer.remove();
        };

        titleContainer.appendChild(title);
        titleContainer.appendChild(closeButton);
        selectionContainer.appendChild(titleContainer);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginBottom = '2px';

        const selectAllButton = document.createElement('button');
        selectAllButton.innerText = '全选';
        selectAllButton.style.marginRight = '10px';
        selectAllButton.onclick = () => {
            document.querySelectorAll('#column-selection input[type=checkbox]').forEach(checkbox => checkbox.checked = true);
        };
        buttonContainer.appendChild(selectAllButton);

        const deselectAllButton = document.createElement('button');
        deselectAllButton.innerText = '取消全选';
        deselectAllButton.style.marginRight = '10px';
        deselectAllButton.onclick = () => {
            document.querySelectorAll('#column-selection input[type=checkbox]').forEach(checkbox => checkbox.checked = false);
        };
        buttonContainer.appendChild(deselectAllButton);

        const confirmButton = document.createElement('button');
        confirmButton.innerText = '确认选择';
        confirmButton.style.marginRight = '10px';
        confirmButton.onclick = () => {
            selectedColumns = getSelectedColumns(); // Store selected columns
            selectionContainer.remove();
            showDataTable();
        };
        buttonContainer.appendChild(confirmButton);

        selectionContainer.appendChild(buttonContainer);

        const columnsContainer = document.createElement('div');
        columnsContainer.style.display = 'grid';
        columnsContainer.style.gridTemplateColumns = '1fr';

        headers.forEach(header => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.fontSize = '12px';
            label.style.padding = '2px';
            label.style.border = '1px solid #ccc';
            label.style.borderRadius = '4px';
            label.style.backgroundColor = '#fff';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = header;
            checkbox.checked = selectedColumns.length > 0 ? selectedColumns.includes(header) : true;
            checkbox.style.marginRight = '5px';

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(header));
            columnsContainer.appendChild(label);
        });

        selectionContainer.appendChild(columnsContainer);
        document.body.appendChild(selectionContainer);
    }

    // Function to show data table
    function showDataTable() {
        if (!dataFetched || !cachedData) {
            alert('没有可用的数据，请先获取数据。');
            return;
        }

        // Remove existing data table if it's already open
        const existingTableContainer = document.getElementById('data-table-container');
        if (existingTableContainer) {
            existingTableContainer.remove();
        }

        const tableContainer = document.createElement('div');
        tableContainer.id = 'data-table-container';
        tableContainer.style.position = 'fixed';
        tableContainer.style.top = '50%';
        tableContainer.style.left = '50%';
        tableContainer.style.transform = 'translate(-50%, -50%)';
        tableContainer.style.backgroundColor = '#fff';
        tableContainer.style.padding = '20px';
        tableContainer.style.border = '1px solid #ccc';
        tableContainer.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
        tableContainer.style.zIndex = '1001';
        tableContainer.style.maxHeight = '60vh';
        tableContainer.style.overflowY = 'auto';
        tableContainer.style.borderRadius = '8px';
        tableContainer.style.width = '80%';

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.position = 'sticky';
        buttonContainer.style.top = '0';
        buttonContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // 背景透明
        buttonContainer.style.zIndex = '1002';
        buttonContainer.style.padding = '10px 0';

        const copyButton = document.createElement('button');
        copyButton.innerText = '复制表格内容';
        copyButton.style.marginRight = '10px';
        copyButton.onclick = () => {
            copyTableContent(table);
            alert('表格内容已复制到剪贴板。');
        };
        buttonContainer.appendChild(copyButton);

        const downloadExcelButton = document.createElement('button');
        downloadExcelButton.innerText = '下载 Excel 表格文件';
        downloadExcelButton.style.marginRight = '10px';
        downloadExcelButton.onclick = downloadExcelData;
        buttonContainer.appendChild(downloadExcelButton);

        const downloadJsonButton = document.createElement('button');
        downloadJsonButton.innerText = '下载 JSON 数据';
        downloadJsonButton.style.marginRight = '10px';
        downloadJsonButton.onclick = downloadJsonData;
        buttonContainer.appendChild(downloadJsonButton);

        const closeButton = document.createElement('button');
        closeButton.innerText = '关闭';
        closeButton.onclick = () => {
            tableContainer.remove();
        };
        buttonContainer.appendChild(closeButton);

        tableContainer.appendChild(buttonContainer);

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        selectedColumns.forEach(header => {
            const th = document.createElement('th');
            th.innerText = header;
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.backgroundColor = '#f2f2f2';
            th.style.textAlign = 'left';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        cachedData.rows.forEach(row => {
            const tr = document.createElement('tr');
            selectedColumns.forEach(col => {
                const td = document.createElement('td');
                td.innerText = row[headers.indexOf(col)];
                td.style.border = '1px solid #ddd';
                td.style.padding = '8px';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        tableContainer.appendChild(table);
        document.body.appendChild(tableContainer);
    }

    // Function to copy table content
    function copyTableContent(table) {
        const range = document.createRange();
        range.selectNode(table);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Failed to copy table content:', err);
        }
        selection.removeAllRanges();
    }

    // Function to get selected columns
    function getSelectedColumns() {
        const checkboxes = document.querySelectorAll('#column-selection input[type=checkbox]');
        return Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    }

    // Function to show or hide loading progress
    function showLoadingProgress(show) {
        let loadingElement = document.getElementById('loading-progress');
        if (show) {
            if (!loadingElement) {
                loadingElement = document.createElement('div');
                loadingElement.id = 'loading-progress';
                loadingElement.style.position = 'fixed';
                loadingElement.style.top = '0';
                loadingElement.style.left = '0';
                loadingElement.style.width = '100%';
                loadingElement.style.height = '100%';
                loadingElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                loadingElement.style.display = 'flex';
                loadingElement.style.alignItems = 'center';
                loadingElement.style.justifyContent = 'center';
                loadingElement.style.zIndex = '1001';

                const loadingText = document.createElement('div');
                loadingText.style.backgroundColor = '#fff';
                loadingText.style.padding = '20px';
                loadingText.style.borderRadius = '8px';
                loadingText.style.textAlign = 'center';
                loadingText.style.fontSize = '18px';
                loadingText.innerText = '数据加载中，请稍候...';

                loadingElement.appendChild(loadingText);
                document.body.appendChild(loadingElement);
            }
        } else {
            if (loadingElement) {
                loadingElement.remove();
            }
        }
    }

    // Create dropdown menu button
    const dropdownContainer = document.createElement('div');
    dropdownContainer.style.position = 'fixed';
    dropdownContainer.style.top = '50px'; // 调整后的值，将按钮向上移动
    dropdownContainer.style.left = '50%';   // Center horizontally
    dropdownContainer.style.transform = 'translateX(-50%)'; // Center adjustment
    dropdownContainer.style.zIndex = '1000';
    dropdownContainer.style.userSelect = 'none';

    const dropdownButton = document.createElement('button');
    dropdownButton.id = 'my-dropdown-button';
    dropdownButton.style.backgroundColor = '#007bff';
    dropdownButton.style.color = 'white';
    dropdownButton.style.padding = '8px 16px'; // 减少按钮内边距
    dropdownButton.style.border = 'none';
    dropdownButton.style.cursor = 'pointer';
    dropdownButton.style.borderRadius = '5px';
    dropdownButton.style.fontSize = '14px'; // 调整字体大小
    dropdownButton.innerHTML = '视图数据操作 &#9662;';
    // dropdownButton.onmouseover = () => dropdownButton.style.backgroundColor = '#0069d9';
    // dropdownButton.onmouseout = () => dropdownButton.style.backgroundColor = '#007bff';
    dropdownButton.style.backgroundImage = 'none';
    dropdownContainer.appendChild(dropdownButton);

    // Create dropdown content container
    const dropdownContent = document.createElement('div');
    dropdownContent.style.display = 'none';
    dropdownContent.style.position = 'absolute';
    dropdownContent.style.top = '100%';
    dropdownContent.style.left = '0';
    dropdownContent.style.backgroundColor = 'white';
    dropdownContent.style.minWidth = '200px';
    dropdownContent.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
    dropdownContent.style.zIndex = '1001';
    dropdownContent.style.borderRadius = '5px';
    dropdownContent.style.overflow = 'hidden';
    dropdownContent.style.border = '1px solid #ccc';
    dropdownContent.style.marginTop = '5px';

    // Add actions to dropdown content
    const menuItemStyle = {
        padding: '12px 16px',
        cursor: 'pointer',
        backgroundColor: '#fff',
        color: '#333',
        textDecoration: 'none',
        display: 'block',
        fontSize: '14px'
    };

    function createMenuItem(text, onClick) {
        const item = document.createElement('div');
        Object.assign(item.style, menuItemStyle);
        item.innerText = text;
        item.onmouseover = () => item.style.backgroundColor = '#f1f1f1';
        item.onmouseout = () => item.style.backgroundColor = '#fff';
        item.onclick = () => {
            onClick();
            dropdownContent.style.display = 'none';
        };
        return item;
    }

    const fetchDataItem = createMenuItem('获取数据', fetchData);
    dropdownContent.appendChild(fetchDataItem);

    // New "Select Columns" menu item
    const selectColumnsItem = createMenuItem('选择列', showColumnSelection);
    dropdownContent.appendChild(selectColumnsItem);

    const showDataTableItem = createMenuItem('显示表格', showDataTable);
    dropdownContent.appendChild(showDataTableItem);

    dropdownContainer.appendChild(dropdownContent);
    document.body.appendChild(dropdownContainer);

    // Toggle dropdown content display
    dropdownButton.onclick = (e) => {
        e.stopPropagation();
        dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
    };

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdownContainer.contains(e.target)) {
            dropdownContent.style.display = 'none';
        }
    });

    checkForUpdates();
})();
