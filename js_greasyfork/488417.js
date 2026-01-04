// ==UserScript==
// @name         XTRF VP Jobs Batch Confirm
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Add a dropdown list of jobs with checkboxes and a confirm button to the job title.
// @author       LangLink-Floyd
// @match        https://langlinking.s.xtrf.eu/vendors/*
// @match        https://xtrf.vengacorp.com/vendors/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488417/XTRF%20VP%20Jobs%20Batch%20Confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/488417/XTRF%20VP%20Jobs%20Batch%20Confirm.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function checkForUpdates() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://update.greasyfork.org/scripts/488417/LangLink%20XTRF%20VP%20Jobs%20Confirm.meta.js",
            onload: function (response) {
                const latestVersion = /@version\s+([0-9.]+)/.exec(response.responseText)[1];
                const currentVersion = GM_info.script.version;
                if (latestVersion > currentVersion) {
                    alert("XTRF VP Jobs Batch Confirm 有新版本可用: " + latestVersion + "\n请点击OK更新");
                    window.location.href = "https://greasyfork.org/en/scripts/488417-langlink-xtrf-vp-jobs-confirm";
                }
            },
            onerror: function (error) {
                console.error('Error checking for updates:', error);
            }
        });
    }


    let jobsData = [];
    let baseUrl = "";
    if (window.location.href.includes("langlinking")) {
        baseUrl = "https://langlinking.s.xtrf.eu/vendors/";
    } else if (window.location.href.includes("vengacorp")) {
        baseUrl = "https://xtrf.vengacorp.com/vendors/";
    }

    const dropdownContent = document.createElement('div');
    const selectedCountButton = document.createElement('button'); // 创建选中数量显示按钮

    // 设置选中数量显示按钮样式
    selectedCountButton.style.backgroundColor = 'transparent';
    selectedCountButton.style.border = 'none';
    selectedCountButton.style.pointerEvents = 'none';

    async function fetchData() {

        if (!baseUrl) {
            console.error(`Could not determine the base URL.`);
            return;
        }

        try {
            const response = await fetch(`${baseUrl}jobs?statuses=IN_PROGRESS,IN_PROGRESS_AWAITING_CORRECTIONS,PENDING`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const allJobsData = await response.json();
            // 筛选出状态为IN_PROGRESS的作业，并按projectName排序
            jobsData = allJobsData.filter(job => job.overview.status === "IN_PROGRESS")
                .sort((a, b) => a.overview.projectName.localeCompare(b.overview.projectName));
            populateDropdown();
        } catch (error) {
            console.error(`Fetching data failed: ${error}`);
        }
    }

    function updateSelectedCount() {
        const selectedCount = document.querySelectorAll('.dropdown-content input[type="checkbox"]:checked').length;
        selectedCountButton.textContent = `选中 ${selectedCount} 项`;
    }

    function createDropdownContainer() {
        // 创建下拉列表的容器
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'dropdown-container';
        dropdownContainer.style.marginLeft = '1100px';
        dropdownContainer.style.display = 'inline-block';

        dropdownContent.className = 'dropdown-content';
        dropdownContent.style.display = 'none';
        dropdownContent.style.position = 'absolute';
        dropdownContent.style.overflowY = 'auto';
        dropdownContent.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
        dropdownContent.style.zIndex = '1';
        dropdownContent.style.maxWidth = '500px';
        dropdownContent.style.maxHeight = '400px';
        dropdownContent.style.backgroundColor = 'white';

        let isAllSelected = false;  // 用于跟踪全选状态

        // 创建全选按钮
        const selectAllButton = document.createElement('button');
        selectAllButton.style.marginRight = '5px';
        selectAllButton.textContent = '全选';

        selectAllButton.onclick = () => {
            isAllSelected = !isAllSelected; // 切换状态
            let selectedJobIds = [];
            document.querySelectorAll('.dropdown-content tr').forEach(row => {
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (row.style.display !== 'none') {
                    checkbox.checked = isAllSelected;
                    if (isAllSelected) {
                        selectedJobIds.push(checkbox.value);
                    } else {
                        selectedJobIds = selectedJobIds.filter(id => id !== checkbox.value);
                    }
                }
            });

            console.log(`Selected job IDs after select all: ${selectedJobIds}`);
            updateSelectedCount();
            selectAllButton.textContent = isAllSelected ? '取消全选' : '全选';

        };

        // 创建筛选框
        const filterInput = document.createElement('input');
        filterInput.style.marginRight = '5px';
        filterInput.type = 'text';
        filterInput.placeholder = '筛选...';
        filterInput.oninput = () => {
            const filterValue = filterInput.value.toLowerCase();
            document.querySelectorAll('.dropdown-content tr').forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(filterValue) ? '' : 'none';
            });
        };

        // 创建清除筛选按钮
        const clearFilterButton = document.createElement('button');
        clearFilterButton.style.marginRight = '5px';
        clearFilterButton.textContent = '清除筛选';
        clearFilterButton.onclick = () => {
            filterInput.value = '';
            document.querySelectorAll('.dropdown-content tr').forEach(row => {
                row.style.display = '';
            });
        };

        const controlsContainer = document.createElement('div');
        controlsContainer.style.display = 'flex';
        controlsContainer.style.marginTop = '5px';

        // 将按钮和输入框添加到controlsContainer中
        controlsContainer.appendChild(selectAllButton);
        controlsContainer.appendChild(selectedCountButton); // 添加选中数量显示元素到全选按钮后
        controlsContainer.appendChild(filterInput);
        controlsContainer.appendChild(clearFilterButton);

        // 创建触发下拉的按钮
        const dropdownButton = document.createElement('button');
        dropdownButton.style.marginRight = '5px';
        dropdownButton.textContent = '展示列表';
        dropdownButton.onclick = () => {
            dropdownButton.textContent = dropdownContent.style.display === 'none' ? '隐藏列表' : '展示列表';
            dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
        };

        // 创建确认按钮
        const confirmButton = document.createElement('button');
        confirmButton.textContent = '批量确认所选任务';
        confirmButton.addEventListener('click', () => confirmSelection());

        // 将控制按钮放在下拉内容上方

        dropdownContainer.appendChild(dropdownButton);
        dropdownContainer.appendChild(confirmButton);
        dropdownContainer.appendChild(controlsContainer);
        dropdownContainer.appendChild(dropdownContent);

        return dropdownContainer;
    }

    function populateDropdown() {
        dropdownContent.innerHTML = ''; // 清空现有内容
        if (jobsData.length > 0) {
            const table = document.createElement('table');
            table.style.width = '100%'; // 表格宽度占满容器
            table.style.margin = '5px'; // 增加内边距以增加可点击区域

            const fragment = document.createDocumentFragment(); // 创建文档片段

            jobsData.forEach(job => {
                const row = table.insertRow();
                row.style.verticalAlign = 'middle'; // 确保行内容垂直居中

                // 创建复选框单元格
                const checkboxCell = row.insertCell();
                checkboxCell.style.verticalAlign = 'middle';
                checkboxCell.style.textAlign = 'left';
                checkboxCell.style.paddingRight = '5px';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = job.id;
                checkbox.style.margin = 'auto 0'; // 增加水平外边距自动，垂直对齐中间
                checkbox.style.display = 'block'; // 使复选框块级显示以响应垂直对齐
                checkbox.addEventListener('change', updateSelectedCount); // 添加事件监听器以更新选中计数

                checkboxCell.appendChild(checkbox);

                // 创建文本节点单元格
                const textCell = row.insertCell();
                textCell.style.verticalAlign = 'middle';
                textCell.style.textAlign = 'left';

                let displayText = `${job.overview.idNumber} - ${job.overview.projectName}`;
                const maxChars = 80;
                if (displayText.length > maxChars) {
                    displayText = `${displayText.substring(0, maxChars - 3)}...`;
                }

                const textNode = document.createTextNode(displayText);
                textCell.appendChild(textNode);

                fragment.appendChild(row); // 将行添加到文档片段
            });

            table.appendChild(fragment); // 一次性将所有行添加到表格中
            dropdownContent.appendChild(table);
        }
        updateSelectedCount(); // 初始化选中计数
    }


    function initializeUI() {
        const dropdownContainer = createDropdownContainer();

        // 尝试找到<header>元素并追加下拉列表和确认按钮
        const headerElement = document.querySelector('header');
        if (headerElement) {
            headerElement.appendChild(dropdownContainer);
        } else {
            console.error(`Could not find the header element.`);
            // 作为后备方案，可以选择添加到body或其他元素
            document.body.appendChild(dropdownContainer);
        }
    }

    function confirmSelection() {
        const selectedJobIds = Array.from(document.querySelectorAll('.dropdown-content input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
        console.log(`Selected job IDs: ${selectedJobIds}`);

        const requests = selectedJobIds.map(jobId => {
            // 在jobsData数组中找到对应的job对象
            const job = jobsData.find(j => j.id.toString() === jobId);
            if (!job) {
                console.error(`Job not found for ID: ${jobId}`);
                return;
            }

            // 检查job对象中是否有smartJobId属性来决定是classic还是smart
            const isSmartJob = !("smartJobId" in job);

            const url = `${baseUrl}jobs/${isSmartJob ? "smart" : "classic"}/${jobId}/finish`;

            return fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 包含凭证，例如Cookies
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text().then(text => text ? JSON.parse(text) : {});
                });
        });

        Promise.all(requests)
            .then(results => {
                console.log(`All jobs have been successfully processed: ${results}`);
                window.location.reload();
            })
            .catch(error => {
                console.error(`An error occurred: ${error}`);
            });
    }


    function waitForHeader() {
        const observer = new MutationObserver((mutations, obs) => {
            const header = document.querySelector('header');
            if (header) {
                initializeUI();
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    fetchData();
    checkForUpdates();
    waitForHeader();
})();
