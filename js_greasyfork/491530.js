// ==UserScript==
// @name         三叉戟-发版管理-表格增强
// @namespace    http://tampermonkey.net/
// @version      1.0.11
// @description  发版管理页面，相关功能的增强实现
// @author       CloudS3n
// @match        https://poseidon.cisdigital.cn/app/devops*
// @icon         https://poseidon.cisdigital.cn/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491530/%E4%B8%89%E5%8F%89%E6%88%9F-%E5%8F%91%E7%89%88%E7%AE%A1%E7%90%86-%E8%A1%A8%E6%A0%BC%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/491530/%E4%B8%89%E5%8F%89%E6%88%9F-%E5%8F%91%E7%89%88%E7%AE%A1%E7%90%86-%E8%A1%A8%E6%A0%BC%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const releaseUrlPrefix =
        "https://poseidon.cisdigital.cn/app/devops/releases?";
    let isFirstLoad = true;
    let projectName;
    let productName;
    let productDisplayName;
    const observer = new MutationObserver((mutations, me) => {
        console.log("[三叉戟] 版本管理页面dom发生变化");
        if (isPageLoaded()) {
            console.log("[三叉戟] 页面加载完毕");
            observer.disconnect();
            console.log("[三叉戟] 停止监听版本管理页面");
            let projectDisplayName = document.querySelectorAll(
                "#base-app > div > div.header-container > div.header > div.left > div.base-selector.base-selector > span.selector-item-wrap.selector-project > div > div.el-select-dropdown.el-popper.base-selector-dropdown > div > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > ul.el-select-group__wrap.recent-group > li:nth-child(2) > ul > li.el-select-dropdown__item.selected"
            )[0].textContent;
            let defaultProductDisplayName = document.querySelectorAll(
                "#base-app > div > div.header-container > div.header > div.left > div.base-selector.base-selector > span.selector-item-wrap.selector-product > div > div.el-select-dropdown.el-popper.base-selector-dropdown > div > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > ul.el-select-group__wrap.recent-group > li:nth-child(2) > ul > li.el-select-dropdown__item.selected"
            )[0]?.textContent;
            let selectProductDisplayName = document.querySelectorAll(
                "body > div.el-select-dropdown.el-popper.base-selector-dropdown > div > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > ul:nth-child(2) > li:nth-child(2) > ul > li.el-select-dropdown__item.selected"
            )[0]?.textContent;
            productDisplayName = defaultProductDisplayName ? defaultProductDisplayName : selectProductDisplayName;
            if (!productDisplayName) {
                console.error(
                    `[三叉戟] 获取项目和产品信息失败，projectDisplayName=${productDisplayName}, productDisplayName=${productDisplayName}`
                );
                return;
            }
            fetchProjectList()
                .then((projectList) => {
                    if (projectList && projectList.length > 0) {
                        projectList.forEach((project) => {
                            if (project.display_name === projectDisplayName) {
                                projectName = project.name;
                                project.products.forEach((product) => {
                                    if (
                                        product.display_name === productDisplayName
                                    ) {
                                        productName = product.name;
                                    }
                                });
                            }
                        });
                    }
                    if (projectName && productName) {
                        console.log(`[三叉戟] project=${projectName}, product=${productName}`);
                        addIdColumn();
                        removeColumn('新建时间');
                        removeColumn('ID');
                        removeEditButtons();
                        addReleaseNoteButton();
                        fetchReleaseList()
                            .then((data) => {
                                updateTableWithRealIds(data);
                            })
                            .catch((error) => {
                                console.error(`[三叉戟] Error fetching data: ${error}`);
                            });
                    } else {
                        console.error(
                            `[三叉戟] 获取项目和产品信息失败，project=${projectName}, product=${productName}`
                        );
                    }
                })
                .catch((error) => {
                    console.error(`[三叉戟] Error fetching data: ${error}`);
                });
        }
    });

    initial();

    function initial() {
        // vue单页面框架，需要根据URL的变化执行相应的操作
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (isFirstLoad || url !== lastUrl) {
                lastUrl = url;
                onUrlChange();
                isFirstLoad = false;
            }
        }).observe(document, {subtree: true, childList: true});
    }

    function onUrlChange() {
        const currUrl = location.href;
        console.log("[三叉戟] URL changed!", currUrl);
        if (currUrl.startsWith(releaseUrlPrefix)) {
            enableTableObserver();
        }
    }

    function enableTableObserver() {
        console.log("[三叉戟] 开始监听版本管理页面");
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    function isPageLoaded() {
        const headerRow = document.querySelector(
            ".el-table__header-wrapper .el-table__header thead tr"
        );
        const bodyRows = document.querySelectorAll(
            ".el-table__body-wrapper .el-table__body tbody tr"
        );
        const project = document.querySelectorAll(
            "#base-app > div > div.header-container > div.header > div.left > div.base-selector.base-selector > span.selector-item-wrap.selector-project > div > div.el-select-dropdown.el-popper.base-selector-dropdown > div > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > ul.el-select-group__wrap.recent-group > li:nth-child(2) > ul > li.el-select-dropdown__item.selected"
        )[0];
        const defaultProduct = document.querySelectorAll(
            "#base-app > div > div.header-container > div.header > div.left > div.base-selector.base-selector > span.selector-item-wrap.selector-product > div > div.el-select-dropdown.el-popper.base-selector-dropdown > div > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > ul.el-select-group__wrap.recent-group > li:nth-child(2) > ul > li.el-select-dropdown__item.selected"
        )[0];
        const product = document.querySelectorAll(
            "body > div.el-select-dropdown.el-popper.base-selector-dropdown > div > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > ul:nth-child(2) > li:nth-child(2) > ul > li.el-select-dropdown__item.selected"
        )[0];
        return (
            headerRow &&
            bodyRows &&
            bodyRows.length > 0 &&
            project &&
            (defaultProduct || product)
        );
    }

    function addReleaseNoteDom(releaseId, taskList) {
        addModalStyles();
        document.getElementById("release-log-modal")?.remove();
        const modalHtml = buildModalContent(releaseId, taskList);
        document.body.insertAdjacentHTML("beforeend", modalHtml);
        setupModal();
    }

    function getCookie(cookieName) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (cookieName == arr[0]) {
                return arr[1];
            }
        }
        return "";
    }

    function removeColumn(columnName) {
        for (let i = 0; i++; i < 2) {
            const headers = document.querySelectorAll(
                `.el-table__${
                    i == 0 ? "fixed-" : ""
                }header-wrapper .el-table__header thead th`
            );
            let columnIndex = -1;
            headers.forEach((th, index) => {
                if (th.textContent.trim() === columnName) {
                    columnIndex = index;
                    th.remove();
                }
            });

            if (columnIndex !== -1) {
                const cols = document.querySelector(
                    `.el-table__${
                        i == 0 ? "fixed-" : ""
                    }header-wrapper .el-table__header colgroup col`
                );
                if (cols[columnIndex]) {
                    cols[columnIndex].remove();
                }
                const bodyCols = document.querySelectorAll(
                    `.el-table__${
                        i == 0 ? "fixed-" : ""
                    }body-wrapper .el-table__body colgroup col`
                );
                if (bodyCols[columnIndex]) {
                    bodyCols[columnIndex].remove();
                }
            }

            const rows = document.querySelectorAll(
                `.el-table__${
                    i == 0 ? "fixed-" : ""
                }body-wrapper .el-table__body tbody tr`
            );
            rows.forEach((row) => {
                const cells = row.querySelectorAll("td");
                if (cells[columnIndex]) {
                    cells[columnIndex].remove();
                }
            });
        }
    }

    function removeEditButtons() {
        const actionGroups = document.querySelectorAll(".table-action-group");
        if (actionGroups && actionGroups.length > 0) {
            actionGroups.forEach((group) => {
                const actionItems = group.querySelectorAll(".table-action-item");
                actionItems.forEach((item) => {
                    const buttonText = Array.from(
                        item.querySelectorAll("button, button *")
                    )
                        .map((e) => e.textContent.trim())
                        .join("");
                    if (buttonText.includes("编辑")) {
                        item.remove();
                        console.log("删除编辑按钮");
                    }
                });
            });
        }
    }

    function addIdColumn() {
        console.log("[三叉戟] 添加ID列");
        const headerRow = document.querySelector(
            ".el-table__header-wrapper .el-table__header thead tr"
        );
        const colgroup = document.querySelector(
            ".el-table__header-wrapper .el-table__header colgroup"
        );
        const bodyColgroup = document.querySelector(
            ".el-table__body-wrapper .el-table__body colgroup"
        );
        const colgroupFixed = document.querySelector(
            ".el-table__fixed-header-wrapper .el-table__header colgroup"
        );
        const bodyColgroupFixed = document.querySelector(
            ".el-table__fixed-body-wrapper .el-table__body colgroup"
        );
        const newCol = document.createElement("col");
        newCol.style.width = "240px";
        if (colgroup.firstChild) {
            colgroup.insertBefore(newCol, colgroup.firstChild);
        } else {
            colgroup.appendChild(newCol);
        }
        if (bodyColgroup.firstChild) {
            bodyColgroup.insertBefore(
                newCol.cloneNode(true),
                bodyColgroup.firstChild
            );
        } else {
            bodyColgroup.appendChild(newCol.cloneNode(true));
        }

        if (colgroupFixed.firstChild) {
            colgroupFixed.insertBefore(
                newCol.cloneNode(true),
                colgroupFixed.firstChild
            );
        } else {
            colgroupFixed.appendChild(newCol.cloneNode(true));
        }
        if (bodyColgroupFixed.firstChild) {
            bodyColgroupFixed.insertBefore(
                newCol.cloneNode(true),
                bodyColgroupFixed.firstChild
            );
        } else {
            bodyColgroupFixed.appendChild(newCol.cloneNode(true));
        }
        const idHeader = document.createElement("th");
        idHeader.innerHTML = '<div class="cell">ID</div>';
        headerRow.insertBefore(idHeader, headerRow.firstChild);
        document
            .querySelectorAll(
                ".el-table__fixed-body-wrapper .el-table__body tbody tr"
            )
            .forEach((row) => {
                const idCell = document.createElement("td");
                idCell.innerHTML = '<div class="cell"></div>';
                row.insertBefore(idCell, row.firstChild);
            });
        document
            .querySelectorAll(".el-table__body-wrapper .el-table__body tbody tr")
            .forEach((row) => {
                const idCell = document.createElement("td");
                idCell.innerHTML = '<div class="cell"></div>';
                row.insertBefore(idCell, row.firstChild);
            });
    }

    function addReleaseNoteButton() {
        console.log("[三叉戟] 添加发版日志按钮");

        document
            .querySelectorAll(
                ".el-table__fixed-body-wrapper .el-table__body tbody tr"
            )
            .forEach((row) => {
                const actionGroup = row.querySelector(
                    "td:last-child .table-action-group"
                );
                if (actionGroup) {
                    const actionItem = document.createElement("div");
                    actionItem.className = "table-action-item";
                    const btn = document.createElement("button");
                    btn.setAttribute("type", "button");
                    btn.style.cssText =
                        "margin-top:-10px; vertical-align:middle; color:var(--cs-color_primary)";
                    btn.className =
                        "el-button table-action-button table-action-item el-button--text";
                    btn.innerHTML = "<span>发版日志</span>";
                    btn.addEventListener("click", function () {
                        let releaseId = row.querySelector("td:first-child .cell").innerText;
                        if (!releaseId) return;
                        let env = "dev";
                        fetchReleaseDetailData(releaseId)
                            .then((releaseDetial) => {
                                if (releaseDetial && releaseDetial.env) env = releaseDetial.env;
                                fetchTaskList(releaseId, env)
                                    .then((taskList) => {
                                        addReleaseNoteDom(releaseDetial, taskList);
                                        const modal = document.getElementById("release-log-modal");
                                        modal.style.display = "block";
                                    })
                                    .catch((error) => {
                                        console.error(`[三叉戟] Error fetching data: ${error}`);
                                    });
                            })
                            .catch((error) => {
                                console.error(`[三叉戟] Error fetching data: ${error}`);
                            });
                    });
                    actionItem.appendChild(btn);
                    actionGroup.appendChild(actionItem);
                }
            });
    }

    function fetchProjectList() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://poseidon.cisdigital.cn/api/projects/`,
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    authorization: `Bearer ${getCookie("poseidon_user_token")}`,
                    referer:
                        "https://poseidon.cisdigital.cn/app/devops/releases?project=ciip-private&product=datakits",
                },
                onload: function (response) {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 0 && Array.isArray(result.data)) {
                        console.log(
                            `[三叉戟] 获取项目数据: ${JSON.stringify(result.data)}`
                        );
                        resolve(result.data);
                    } else {
                        reject(
                            new Error(
                                "[三叉戟] API call failed or returned an unexpected structure"
                            )
                        );
                    }
                },
                onerror: function (error) {
                    reject(new Error(`API call failed: ${error}`));
                },
            });
        });
    }

    function fetchReleaseList() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://poseidon.cisdigital.cn/devops/api/releases/?page=1&page_size=100&archived=0&search=",
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    authorization: `Bearer ${getCookie("poseidon_user_token")}`,
                    referer:
                        "https://poseidon.cisdigital.cn/app/devops/releases?project=ciip-private&product=datakits",
                    "x-poseidon-product": `${productName}`,
                    "x-poseidon-project": `${projectName}`,
                },
                onload: function (response) {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 0 && Array.isArray(result.data)) {
                        console.log(
                            `[三叉戟] 获取版本管理数据: ${JSON.stringify(result.data)}`
                        );
                        resolve(result.data);
                    } else {
                        reject(
                            new Error(
                                "[三叉戟] API call failed or returned an unexpected structure"
                            )
                        );
                    }
                },
                onerror: function (error) {
                    reject(new Error(`API call failed: ${error}`));
                },
            });
        });
    }

    function fetchReleaseDetailData(releaseId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://poseidon.cisdigital.cn/devops/api/releases/${releaseId}/`,
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    authorization: `Bearer ${getCookie("poseidon_user_token")}`,
                    referer:
                        "https://poseidon.cisdigital.cn/app/devops/releases?project=ciip-private&product=datakits",
                    "x-poseidon-product": `${productName}`,
                    "x-poseidon-project": `${projectName}`,
                },
                onload: function (response) {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 0 && result.data) {
                        console.log(
                            `[三叉戟] 获取版本详情数据: ${JSON.stringify(result.data)}`
                        );
                        resolve(result.data);
                    } else {
                        reject(
                            new Error(
                                "[三叉戟] API call failed or returned an unexpected structure"
                            )
                        );
                    }
                },
                onerror: function (error) {
                    reject(new Error(`API call failed: ${error}`));
                },
            });
        });
    }

    function fetchTaskList(releaseId, env) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://poseidon.cisdigital.cn/devops/api/releases/${releaseId}/tasks/?env=${env}`,
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    authorization: `Bearer ${getCookie("poseidon_user_token")}`,
                    referer:
                        "https://poseidon.cisdigital.cn/app/devops/releases?project=ciip-private&product=datakits",
                    "x-poseidon-product": `${productName}`,
                    "x-poseidon-project": `${projectName}`,
                },
                onload: function (response) {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 0 && Array.isArray(result.data)) {
                        console.log(
                            `[三叉戟] 获取版本任务数据: ${JSON.stringify(result.data)}`
                        );
                        resolve(result.data);
                    } else {
                        reject(
                            new Error(
                                "[三叉戟] API call failed or returned an unexpected structure"
                            )
                        );
                    }
                },
                onerror: function (error) {
                    reject(new Error(`API call failed: ${error}`));
                },
            });
        });
    }

    function updateTableWithRealIds(data) {
        const nameIdMap = data.reduce((acc, curr) => {
            acc[curr.name] = curr.id;
            return acc;
        }, {});

        const bodyRows = document.querySelectorAll(
            ".el-table__body-wrapper .el-table__body tbody tr"
        );
        const bodyRowsFixed = document.querySelectorAll(
            ".el-table__fixed-body-wrapper .el-table__body tbody tr"
        );
        console.log("[三叉戟] 填充ID列");
        bodyRows.forEach((row) => {
            const versionCell = row.querySelector("td:nth-child(2)");
            if (versionCell) {
                const versionText = versionCell.textContent.trim();
                const realId = nameIdMap[versionText];
                if (realId !== undefined) {
                    const idCell = row.querySelector("td:first-child .cell");
                    if (idCell) {
                        idCell.textContent = realId;
                    }
                }
            }
        });
        bodyRowsFixed.forEach((row) => {
            const versionCell = row.querySelector("td:nth-child(2)");
            if (versionCell) {
                const versionText = versionCell.textContent.trim();
                const realId = nameIdMap[versionText];
                if (realId !== undefined) {
                    const idCell = row.querySelector("td:first-child .cell");
                    if (idCell) {
                        idCell.textContent = realId;
                    }
                }
            }
        });
    }

    function addModalStyles() {
        GM_addStyle(`
        .modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgb(0,0,0);
            background-color: rgba(0,0,0,0.4);
            padding-top: 60px;
        }

        .modal-content {
            background-color: #fefefe;
            margin: 5% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
        }

        .close {
            color: #aaaaaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        .close:hover,
        .close:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
        }

        #release-note-table {
            width: 100%;
            border-collapse: collapse;
        }

        #release-note-table > thead > tr > th, td {
            border: 1px solid #ddd;
            text-align: left;
            padding: 8px;
        }

        #release-note-table > thead > tr > th {
            background-color: #f2f2f2;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
        }

        #release-note-table > tbody > tr > td.sub-title {
          font-size: 18px;
          font-weight: bold;
          background-color: #f2f2f2;
        }

        #release-note-table > tbody > tr.third-title > td {
          font-size: 16px;
          font-weight: bold;
        }

        #release-note-table > tbody > tr.item-list:nth-child(odd) {
          background-color: #e0f2f1;
        }

        .multi-line-clamp {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 500; /* 定义最大显示的行数 */
          overflow: hidden;
          text-overflow: ellipsis; /* 当内容溢出时显示... */
          word-break: break-word; /* 使得单词在必要时可以断行 */
          max-height: 20em; /* 根据行高和最大行数调整 */
          line-height: 1em; /* 设置行高 */
        }

        code {
          white-space: pre-wrap; /* 维持空格的格式，同时允许内容自动换行 */
          word-wrap: break-word; /* 在长单词或 URL 地址内部进行断行 */
        }
    `);
    }

    // 弹窗逻辑
    function setupModal() {
        const modal = document.getElementById("release-log-modal");
        const closeBtn = modal.querySelector(".close");
        const singleExportBtnList = document.querySelectorAll('#release-note-table > tbody > tr > td > button.singe-export-btn');
        const batchExportBtn = document.getElementById("batch-export-button");
        const excelExportBtn = document.getElementById("export-excel-button");
        const copyAppBtn = document.getElementById("copy-app-button");

        // 点击关闭按钮隐藏弹窗
        closeBtn.onclick = function () {
            modal.style.display = "none";
        };

        // 点击批量导出按钮触发批量导出功能
        batchExportBtn.addEventListener('click', function() {
            batchExportImages();
        });

        // 点击导出Excel功能
        excelExportBtn.addEventListener('click', function() {
            onExcelExport();
        });

        // 点击复制应用功能
        copyAppBtn.addEventListener('click', function() {
            copyAppInfoToColipBoard();
        });

        // 点击窗口外部区域隐藏弹窗
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };

        // 单个导出按钮
        singleExportBtnList.forEach(button => {
            button.addEventListener('click', handleSingleExportButtonClick);
        });
    }

    function addElementToKey(myMap, key, element) {
        if (myMap.has(key)) {
            let currentList = myMap.get(key);
            currentList.push(element);
            myMap.set(key, currentList);
        } else {
            myMap.set(key, [element]);
        }
    }

    function encodeHtml(html) {
        return html.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function buildModalContent(releaseDetail, taskList) {
        // 生成任务列表HTML
        const bodyMap = new Map();
        const exportButtonHtml = '<button class="el-button el-button--primary" id="batch-export-button" style="margin-right: 10px;">批量导出</button>';
        const exportExcelHtml = '<button class="el-button el-button--primary" id="export-excel-button" style="margin-right: 10px;">导出Excel</button>';
        const copyAppHtml = '<button class="el-button el-button--primary" id="copy-app-button" style="margin-right: 10px;">复制应用信息</button>';

        taskList
            ?.sort((a, b) => a.order - b.order)
            .forEach((task) => {
                switch (task.task_type) {
                    case 1: {
                        // 前端或后端服务
                        const serverHtml = `
            <tr class="item-list">
            <td colspan="1" width="20%">${task.task.app.name}</td>
            <td colspan="1" width="10%">${task.task.tag.replace('-release', '')}</td>
            <td colspan="1" width="20%">${task.task.digest}</td>
            <td colspan="1" width="45%">${task.task.description.replace(
                            /\n/g,
                            "<br>"
                        )}</td>
            <td colspan="1" width="5%"><button type="button" class="el-button table-action-button table-action-item el-button--text singe-export-btn" style="color:var(--cs-color_primary)">导出</button></td>
            </tr>
        `;
                        if (task.task.app.name.startsWith("fe-")) {
                            addElementToKey(bodyMap, "frontEndBody", serverHtml);
                        } else {
                            addElementToKey(bodyMap, "backEndBody", serverHtml);
                        }
                        break;
                    }
                    case 2: {
                        // 需要执行的sql
                        addElementToKey(
                            bodyMap,
                            "sqlBody",
                            `
              <tr class="item-list">
              <td colspan="1">${task.task.middleware}-${task.task.database}</td>
              <td colspan="1">${task.task.name}</td>
              <td colspan="3"><textarea style="width: 100%; height: 200px; resize: vertical; overflow-y: auto; white-space: pre-wrap;">${encodeHtml(task.task.content)}</textarea></td>
              </tr>
        `
                        );
                        break;
                    }
                    case 4: {
                        // 需要人工确认的事项
                        addElementToKey(
                            bodyMap,
                            "manualBody",
                            `<tr class="item-list"><td colspan="5" style="white-space: pre-wrap">${task.task.content}</td></tr>`
                        );
                        break;
                    }
                    default:
                        return "";
                }
            });

        return `
    <div id="release-log-modal" class="modal">
        <div id="modal-content" class="modal-content">
            <span class="close">&times;</span>
            ${exportButtonHtml}
            ${exportExcelHtml}
            ${copyAppHtml}
            <table id="release-note-table">
              <thead>
                <tr>
                    <th colspan="5">${releaseDetail.description}-发版日志-<span id="product-version">${
            releaseDetail.name
        }</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="5" class="sub-title">1.需要人工确认的事项</td>
                </tr>
                ${
            bodyMap.get("manualBody")
                ? bodyMap.get("manualBody").join("")
                : ""
        }
                <tr>
                  <td colspan="5" class="sub-title">2.SQL变动</td>
                </tr>
                <tr class="third-title">
                  <td colspan="1">数据库</td>
                  <td colspan="1">描述</td>
                  <td colspan="3">执行sql</td>
                </tr>
                ${bodyMap.get("sqlBody") ? bodyMap.get("sqlBody").join("") : ""}
                <tr>
                  <td colspan="5" class="sub-title">3.前端服务</td>
                </tr>
                <tr class="third-title">
                    <td colspan="1">服务名</td>
                    <td colspan="1">镜像tag</td>
                    <td colspan="1">镜像摘要</td>
                    <td colspan="1">升级描述</td>
                    <td colspan="1">导出</td>
                </tr>
                ${
            bodyMap.get("frontEndBody")
                ? bodyMap.get("frontEndBody").join("")
                : ""
        }
                <tr>
                  <td colspan="5" class="sub-title">4.后端服务</td>
                </tr>
                <tr class="third-title">
                    <td colspan="1">服务名</td>
                    <td colspan="1">镜像tag</td>
                    <td colspan="1">镜像摘要</td>
                    <td colspan="1">升级描述</td>
                    <td colspan="1">导出</td>
                </tr>
                ${
            bodyMap.get("backEndBody")
                ? bodyMap.get("backEndBody").join("")
                : ""
        }
              </tbody>
          </table>
        </div>
    </div>
    `;
    }

    function handleSingleExportButtonClick(event) {
        const row = event.target.closest('tr.item-list');
        const appName = row.cells[0].textContent.trim();
        const tag = row.cells[1].textContent.trim();
        const digest = row.cells[2].textContent.trim();
        const token = getCookie("poseidon_user_token");

        const exportData = {
            spec: JSON.stringify({
                images: [{
                    app: appName,
                    images: [{tag, digest}]
                }]
            }),
            description: "导出镜像",
            meta_type: 2
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://poseidon.cisdigital.cn/devops/api/migration/exports/",
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": `Bearer ${token}`,
                "content-type": "application/json",
                "origin": "https://poseidon.cisdigital.cn",
                "referer": "https://poseidon.cisdigital.cn/app/devops/import-export",
                "x-poseidon-product": `${productName}`,
                "x-poseidon-project": `${projectName}`,
            },
            data: JSON.stringify(exportData),
            onload: function (response) {
                const result = JSON.parse(response.responseText);
                if (result.code === 0 && result.data) {
                    console.log(
                        `[三叉戟] 成功触发导出单个镜像: ${appName}-${tag}-${digest}`
                    );
                    const url = `https://poseidon.cisdigital.cn/app/devops/import-export?project=${projectName}&product=${productName}`;
                    window.open(url, '_blank');
                } else {
                    window.alert(`[三叉戟] 触发导出单个镜像失败: ${JSON.stringify(result)}`)
                }
            },
            onerror: function (error) {
                window.alert(`[三叉戟] 触发导出单个镜像API call failed: ${error}`)
            },
        });
    }

    function batchExportImages() {
        const tbody = document.querySelector("#release-note-table tbody");
        const rows = tbody.querySelectorAll("tr");
        let currentSection = '';
        const images = [];

        rows.forEach(row => {
            const subtitleCell = row.querySelector('td.sub-title');
            if (subtitleCell) {
                const subtitleText = subtitleCell.textContent.trim();
                if (subtitleText.startsWith('3.前端服务')) {
                    currentSection = 'frontend';
                } else if (subtitleText.startsWith('4.后端服务')) {
                    currentSection = 'backend';
                } else {
                    currentSection = ''; // Reset when it's not our targeted section
                }
            } else if (row.classList.contains('item-list') && (currentSection === 'frontend' || currentSection === 'backend')) {
                const appName = row.cells[0].textContent.trim();
                const tag = row.cells[1].textContent.trim();
                const digest = row.cells[2].textContent.trim();
                images.push({ app: appName, tag: tag, digest: digest, section: currentSection });
            }
        });

        const exportData = {
            spec: JSON.stringify({
                images: images.map(img => ({
                    app: img.app,
                    images: [{ tag: img.tag, digest: img.digest }]
                }))
            }),
            description: "批量导出镜像",
            meta_type: 2
        };

        console.log(`导出的镜像信息为：${JSON.stringify(exportData)}`)

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://poseidon.cisdigital.cn/devops/api/migration/exports/",
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": `Bearer ${getCookie("poseidon_user_token")}`,
                "content-type": "application/json",
                "origin": "https://poseidon.cisdigital.cn",
                "referer": "https://poseidon.cisdigital.cn/app/devops/import-export",
                "x-poseidon-product": `${productName}`,
                "x-poseidon-project": `${projectName}`,
            },
            data: JSON.stringify(exportData),
            onload: function (response) {
                const result = JSON.parse(response.responseText);
                if (result.code === 0 && result.data) {
                    console.log(`[三叉戟] 成功触发批量导出镜像`);
                    const url = `https://poseidon.cisdigital.cn/app/devops/import-export?project=${projectName}&product=${productName}`;
                    window.open(url, '_blank');
                } else {
                    window.alert(`[三叉戟] 触发批量导出镜像失败: ${JSON.stringify(result)}`)
                }
            },
            onerror: function (error) {
                window.alert(`[三叉戟] 触发批量导出镜像API call failed: ${error}`);
            },
        });
    }

    function onExcelExport() {
        const table = document.getElementById('release-note-table');
        const exportTable = prepareTableForExport(table)
        var workbook = XLSX.utils.table_to_book(exportTable, {sheet:"发版日志"});
        var ws = workbook.Sheets[workbook.SheetNames[0]];
        ws['!cols'] = [
            { wch: 50 }, // 设置第一列的宽度
            { wch: 50 }, // 设置第二列的宽度
            { wch: 50 }, // 设置第三列的宽度
            { wch: 50 }, // 设置第四列的宽度
            { wch: 50 }  // 设置第五列的宽度
        ];
        XLSX.writeFile(workbook, '发版日志.xlsx');
    }

    function prepareTableForExport(originalTable) {
        let clonedTable = originalTable.cloneNode(true); // 克隆原始表格，包括所有子节点
        let textareas = clonedTable.getElementsByTagName('textarea'); // 获取所有textarea元素

        Array.from(textareas).forEach(textarea => {
            let content = textarea.value;
            let lines = content.split('\n'); // 根据换行符分割内容
            let parentTd = textarea.parentNode; // 获取包含textarea的td元素
            let parentTr = parentTd.parentNode; // 获取包含td的tr元素
            let databaseCell = parentTr.cells[0]; // 假设“数据库”是第一列
            let descriptionCell = parentTr.cells[1]; // 假设“描述”是第二列

            // 设置 rowspan 等于 lines 的数量
            databaseCell.setAttribute('rowspan', lines.length);
            descriptionCell.setAttribute('rowspan', lines.length);

            // 移除原始的包含textarea的td
            parentTd.remove();

            // 为每一行创建新的td元素并插入到新的或现有的tr中
            lines.forEach((line, index) => {
                if (index === 0) {
                    let newTd = document.createElement('td');
                    newTd.textContent = line;
                    newTd.setAttribute('colspan', '3');
                    parentTr.appendChild(newTd);
                } else {
                    let newRow = document.createElement('tr');
                    let newTd = document.createElement('td');
                    newTd.textContent = line;
                    newTd.setAttribute('colspan', '3');
                    newRow.appendChild(newTd);
                    parentTr.parentNode.insertBefore(newRow, parentTr.nextSibling);
                    parentTr = newRow; // 更新parentTr到新行，以便后续行正确插入
                }
            });
        });

        return clonedTable;
    }

    function copyAppInfoToColipBoard() {
        let modal = document.getElementById('release-log-modal');

        if (!modal) {
            console.error('Modal element with ID "release-log-modal" not found.');
            alert('Modal element not found. Cannot copy text.');
            return;
        }

        let rows = [];
        let startAdding = false;

        modal.querySelectorAll('#release-note-table tr').forEach(row => {
            if (!startAdding) {
                if (row.querySelector('td.sub-title')) {
                    let subTitleText = row.querySelector('td.sub-title').textContent.trim();
                    if (subTitleText === '3.前端服务' || subTitleText === '4.后端服务') {
                        startAdding = true;
                    }
                }
            } else {
                rows.push(row);
            }
        });

        if (rows.length === 0) {
            console.warn('No rows found after the specified sub-title.');
            alert('No rows found after the specified sub-title.');
            return;
        }

        let text = '';

        rows.forEach(row => {
            let serviceName = row.querySelector('td:nth-child(1)')?.textContent.trim();
            let imageTag = row.querySelector('td:nth-child(2)')?.textContent.trim();
            if (serviceName !== '服务名' && serviceName !== '4.后端服务') {
                text += serviceName + '\t' + imageTag + '\n';
            }
        });

        // 创建text area
        let textArea = document.createElement("textarea");
        textArea.value = text;
        // 使text area不在viewport，同时设置不可见
        textArea.style.position = "absolute";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // 执行复制命令并移除文本框
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
            alert('成功复制应用信息到粘贴板');
        });
    }
})();
