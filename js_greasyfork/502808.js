// ==UserScript==
// @name         实销实结明细-实销实结销售单
// @namespace    http://tampermonkey.net/
// @version      2024-08-07
// @description  用于实销实结明细-实销实结销售单查询导出明细
// @author       阿黄
// @match        https://vcf.jd.com/finance/saleBill/list/global
// @require      https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js
// @require      https://unpkg.com/layui@2.9.9/dist/layui.js
// @resource customCSS  https://unpkg.com/layui@2.9.9/dist/css/layui.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502808/%E5%AE%9E%E9%94%80%E5%AE%9E%E7%BB%93%E6%98%8E%E7%BB%86-%E5%AE%9E%E9%94%80%E5%AE%9E%E7%BB%93%E9%94%80%E5%94%AE%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/502808/%E5%AE%9E%E9%94%80%E5%AE%9E%E7%BB%93%E6%98%8E%E7%BB%86-%E5%AE%9E%E9%94%80%E5%AE%9E%E7%BB%93%E9%94%80%E5%94%AE%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 添加自定义CSS样式
    const css = GM_getResourceText("customCSS");
    GM_addStyle(css);

    // 操作栏选择器
    const ACTION_BAR_SELECTOR =
        ".ant-pro-query-filter-actions .ant-space-item > .ant-space";
    // 刷新间隔
    const REFRESH_DELAY = 1000;

    // 添加导出明细按钮
    addExportDetailsButton();

    /**
     * 在页面中添加一个导出单据明细按钮
     */
    async function addExportDetailsButton() {
        // 等待操作栏加载完成
        const actionBar = await waitForActionBar();

        // 创建导出按钮
        const exportButton = createExportButton();

        // 导出按钮绑定导出逻辑
        bindExportButtonClickHandler(exportButton);

        // 添加导出按钮到操作栏
        appendExportButtonToActionBar(actionBar, exportButton);
    }

    /**
     * 等待操作栏加载完成
     * @returns {Promise<Element>}
     */
    async function waitForActionBar() {
        return await waitForElement(ACTION_BAR_SELECTOR);
    }

    /**
     * 等待元素加载完成
     * @param {string} selector 选择器
     * @param {number} timeout 超时时间（毫秒）
     */
    async function waitForElement(selector, timeout = 0) {
        if (selector === null || selector === undefined) {
            reject(new Error("selector不能为空"));
        }
        if (timeout < 0) {
            reject(new Error("timeout不能小于0"));
        }

        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
            }, 100);

            if (timeout > 0) {
                setTimeout(() => {
                    clearInterval(interval);
                    reject(new Error(`${timeout}ms后元素未找到: ${selector}`));
                }, timeout);
            }
        });
    }

    /**
     * 创建导出明细按钮
     * @returns {Promise<Element>}
     */
    function createExportButton() {
        // 创建导出明细按钮
        const exportButtonHtml = `
            <div class="ant-space-item" style="">
                <button
                    clstag="h|keycount|yip_finance_1638449421010|20"
                    type="button"
                    class="ant-btn ant-btn-default"
                >
                    <span role="img" aria-label="download" class="anticon anticon-download"
                        ><svg
                            viewBox="64 64 896 896"
                            focusable="false"
                            data-icon="download"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            aria-hidden="true"
                            data-darkreader-inline-fill=""
                            style="--darkreader-inline-fill: currentColor"
                        >
                            <path
                                d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"
                            ></path></svg></span
                    ><span>导出</span>
                </button>
            </div>
        `;

        const exportButton = createDOMFromHTML(exportButtonHtml)[0];

        return exportButton;
    }

    /**
     * 将HTML字符串转换为DOM元素
     * @param {string} htmlString HTML字符串
     * @returns {Element[]} 转换后的DOM元素数组
     */
    function createDOMFromHTML(htmlString) {
        const tempDiv = document.createElement("div");
        tempDiv.insertAdjacentHTML("beforeend", htmlString);
        // 返回所有子节点数组
        return Array.from(tempDiv.childNodes).filter(
            (node) => node.nodeType === Node.ELEMENT_NODE
        );
    }

    /**
     * 导出按钮绑定导出逻辑
     * @param {Element} exportButton 导出按钮元素
     */
    function bindExportButtonClickHandler(exportButton) {
        exportButton.addEventListener("click", async () => {
            // 获取所有页的单据明细
            const allDetails = await fetchAllPagesDetails();

            // 导出明细到Excel
            await exportDetailsToExcel(allDetails);
        });
    }

    /**
     * 获取所有页的单据明细
     * @returns {Promise<Array<string>>} 所有页的单据明细
     */
    async function fetchAllPagesDetails() {
        // 显示加载提示
        const loadIndex = layer.msg("正在查询单据明细...", {
            icon: 16,
            shade: 0.01,
            time: 0,
        });

        // 获取总页数
        const paginationTotalPage = getPaginationTotalPage();

        // 分页获取所有明细
        const allDetails = await paginateAndFetchDetails(paginationTotalPage);

        // 关闭加载提示
        layer.close(loadIndex);

        return allDetails;
    }

    /**
     * 计算有多少页单据需要获取明细
     * @returns {number} 总页数
     */
    function getPaginationTotalPage() {
        const paginationTotalText = document.querySelector(
            ".ant-pagination-total-text"
        );
        if (!paginationTotalText) {
            throw new Error("总页数未找到");
        }
        const paginationTotal = parseInt(
            paginationTotalText.innerText.match(/总共\s(\d+)\s条/)[1]
        );
        if (isNaN(paginationTotal)) {
            throw new Error("总页数计算错误");
        }

        const paginationSizeText = document.querySelector(
            ".ant-pagination-options-size-changer .ant-select-selection-item"
        );
        if (!paginationSizeText) {
            throw new Error("页大小未找到");
        }
        const paginationSize = parseInt(paginationSizeText.innerText);
        if (isNaN(paginationSize)) {
            throw new Error("页大小计算错误");
        }

        const paginationTotalPage = Math.ceil(paginationTotal / paginationSize);
        return paginationTotalPage;
    }

    /**
     * 分页获取所有明细
     * @param {number} paginationTotalPage 总页数
     * @returns {Promise<Array<string>>} 明细列表
     */
    async function paginateAndFetchDetails(paginationTotalPage) {
        // 获取跳转下一页按钮
        const paginationNext = document.querySelector(".ant-pagination-next");
        if (!paginationNext) {
            throw new Error("跳转下一页按钮未找到");
        }

        // 所有明细
        const allDetails = [];
        // 遍历所有页， 获取所有页的单据明细
        for (
            let pageNumber = 1;
            pageNumber <= paginationTotalPage;
            pageNumber++
        ) {
            // 添加当前页的单据明细
            allDetails.push(...fetchCurrentPageDetails());

            // 如果是最后一页，跳出循环
            if (pageNumber === paginationTotalPage) break;

            // 否则点击下一页按钮
            paginationNext.click();

            // 等待表格刷新完成
            const QUERY_BUTTON_SELECTOR = `${ACTION_BAR_SELECTOR} > .ant-space-item:nth-child(1) > button`;
            await waitForTableRefresh(QUERY_BUTTON_SELECTOR);

            // 延迟，防止太快
            await sleep(REFRESH_DELAY);
        }

        // 返回所有明细
        return allDetails;
    }

    /**
     * 获取当前页的单据明细
     * @returns {Array<string>} 当前页的单据明细
     */
    function fetchCurrentPageDetails() {
        // 获取当前页的表格行
        const rows = document.querySelectorAll(
            ".ant-table-tbody .ant-table-row"
        );
        if (!rows || rows.length === 0) {
            throw new Error("表格行未找到");
        }

        // 当前页明细
        const details = [];
        // 遍历每一行数据，提取详细信息
        for (const row of rows) {
            // 初始化一个空数组，用于存储当前行的详细信息
            const detail = [];
            // 获取当前行中所有的列元素
            const columns = Array.from(row.querySelectorAll(".ant-table-cell"));

            // 遍历每一列，提取列中的内容
            for (let i = 0; i < columns.length; i++) {
                const cell = columns[i];
                // 如果cell.title存在就使用title，否则使用innerText
                detail.push(cell.title || cell.innerText);
            }
            // 将当前行的明细添加到details中
            details.push(detail);
        }

        // 返回所有行的明细
        return details;
    }

    /**
     * 模拟延迟
     * @param {number} milliseconds 毫秒数
     */
    async function sleep(milliseconds) {
        // 校验`milliseconds`是否为正数
        if (typeof milliseconds !== "number" || milliseconds <= 0) {
            console.error("预期毫秒为正值");
            return;
        }

        // 使用固定的随机倍数，而不是直接使用`Math.random()`，以提高可预测性
        const randomFactor = 0.5;
        const duration = milliseconds * (1 + Math.random() * randomFactor);

        // 随机延迟，避免请求频率过快
        return new Promise((resolve) => setTimeout(resolve, duration));
    }

    /**
     * 等待表格刷新完成
     * @param {string} buttonSelector - 按钮的选择器
     * @param {number} [timeout=5000] - 超时时间（毫秒）
     * @returns {Promise} - 解析为按钮元素或拒绝
     */
    function waitForTableRefresh(buttonSelector, timeout = 0) {
        return new Promise((resolve, reject) => {
            // 创建 MutationObserver 实例
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (
                        mutation.type === "attributes" &&
                        mutation.attributeName === "class"
                    ) {
                        const button = mutation.target;
                        if (isTableRefreshing(button)) {
                            // 开始刷新
                            console.log("表格刷新开始。");
                        } else if (isTableRefreshed(button)) {
                            // 刷新结束
                            console.log("表格刷新完成。");
                            resolve(button);
                            observer.disconnect(); // 停止观察
                        }
                    }
                }
            });

            // 获取按钮元素
            const button = document.querySelector(buttonSelector);

            if (!button) {
                // 如果未找到按钮，则拒绝 Promise
                reject(new Error("未找到按钮元素。"));
                return;
            }

            // 开始观察
            observer.observe(button, {
                attributes: true,
                attributeFilter: ["class"],
            });

            // 创建一个定时器，如果超过指定时间（timeout）仍未找到按钮，则停止观察并拒绝 Promise
            if (timeout > 0) {
                setTimeout(() => {
                    observer.disconnect();
                    reject(new Error("表格刷新超时。"));
                }, timeout);
            }
        });
    }

    /**
     * 检查表格是否正在刷新
     * @param {HTMLElement} buttonElement - 按钮元素
     * @returns {boolean} - 表格是否正在刷新
     */
    function isTableRefreshing(buttonElement) {
        return buttonElement.classList.contains("ant-btn-loading");
    }

    /**
     * 检查表格是否刷新完成
     * @param {HTMLElement} buttonElement - 按钮元素
     * @returns {boolean} - 表格是否刷新完成
     */
    function isTableRefreshed(buttonElement) {
        return !buttonElement.classList.contains("ant-btn-loading");
    }

    /**
     * 将明细导出为Excel文件
     * @param {Array<string>} allDetails 所有明细
     */
    async function exportDetailsToExcel(allDetails) {
        // 显示加载提示
        const loadIndex = layer.msg("正在导出单据明细...", {
            icon: 16,
            shade: 0.01,
            time: 0,
        });
        // 创建工作簿和工作表
        const workbook = XLSX.utils.book_new();

        // 添加表头
        const headers = Array.from(
            document.querySelectorAll(".ant-table-thead th")
        ).map((cell) => cell.innerText);

        // 将表头和数据合并为一个二维数组
        const dataWithHeaders = [headers, ...allDetails];

        // 将数组转换为工作表
        const worksheet = XLSX.utils.aoa_to_sheet(dataWithHeaders);

        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(workbook, worksheet, "实销实结销售单");

        // 导出为excel文件
        await XLSX.writeFile(workbook, "实销实结销售单.xlsx", {
            compression: true,
        });

        // 关闭加载提示
        layer.close(loadIndex);

        // 显示成功提示
        layer.msg("导出成功", { icon: 6 });
    }

    /**
     * 添加导出按钮到操作栏
     * @param {Element} actionBar 操作栏元素
     * @param {Element} exportButton 导出按钮元素
     * @returns {Promise<void>}
     */
    function appendExportButtonToActionBar(actionBar, exportButton) {
        // 获取最后一个子元素
        const lastChild = actionBar.lastElementChild;

        // 如果存在最后一个子元素，则插入 exportButton
        if (lastChild) {
            // 将 exportButton 插入到最后一个子元素之前
            actionBar.insertBefore(exportButton, lastChild);
        } else {
            // 如果不存在最后一个子元素，则直接追加到末尾
            actionBar.appendChild(exportButton);
        }
    }
})();
