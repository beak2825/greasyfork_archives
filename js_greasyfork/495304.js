// ==UserScript==
// @name         全球购应付账-实销实结销售单
// @namespace    http://tampermonkey.net/
// @version      2024-08-07
// @description  用于全球购应付账-实销实结销售单查询导出明细
// @author       阿黄
// @match        https://vcf.jd.com/finance/expense/list/global
// @require      https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js
// @require      https://unpkg.com/layui@2.9.9/dist/layui.js
// @resource customCSS  https://unpkg.com/layui@2.9.9/dist/css/layui.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495304/%E5%85%A8%E7%90%83%E8%B4%AD%E5%BA%94%E4%BB%98%E8%B4%A6-%E5%AE%9E%E9%94%80%E5%AE%9E%E7%BB%93%E9%94%80%E5%94%AE%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/495304/%E5%85%A8%E7%90%83%E8%B4%AD%E5%BA%94%E4%BB%98%E8%B4%A6-%E5%AE%9E%E9%94%80%E5%AE%9E%E7%BB%93%E9%94%80%E5%94%AE%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 添加自定义CSS样式
    const css = GM_getResourceText("customCSS");
    GM_addStyle(css);

    // API请求的URL
    const API_BASE_URL = "/api/finance/expense/expenseDetail";
    // 订单类型
    const BIZ_TYPE = "8";
    // 渲染页面的时间间隔
    const RENDERING_INTERVAL = 5000;
    // 请求单据明细的间隔时间
    const REQUEST_INTERVAL = 1000;
    // 存储所有单据明细
    const allDetails = [];

    // 添加导出明细按钮
    appendExportDetailBtn();

    /**
     * 在页面中添加一个导出单据明细按钮
     */
    function appendExportDetailBtn() {
        // 查找页面上的操作栏，并添加导出明细按钮
        const actionBar = document.querySelector(
            ".ant-pro-query-filter .ant-space-item > .ant-space"
        );

        //检查操作栏是否存在，如果不存在，则延迟100毫秒后尝试添加导出详情按钮。
        if (!actionBar) {
            setTimeout(appendExportDetailBtn, 100);
            return;
        }

        // 检查导出按钮是否存在，如果不存在，则延迟100毫秒后尝试添加导出详情按钮。
        const exportBtn = actionBar.querySelector(
            ".ant-space-item:nth-child(3)"
        );
        if (!exportBtn) {
            setTimeout(appendExportDetailBtn, 100);
            return;
        }

        // 创建导出明细按钮
        const exportDetailBtn = exportBtn.cloneNode(true);
        exportDetailBtn.querySelector("span:nth-child(2)").innerText =
            "导出明细";

        // 点击导出明细按钮时，执行导出功能
        exportDetailBtn.addEventListener("click", async () => {
            try {
                await exportDetails();
            } catch (error) {
                layer.alert("导出明细失败：" + error);
            }
        });

        // 将导出明细按钮添加到操作栏
        actionBar.appendChild(exportDetailBtn);
    }

    /**
     * 导出单据明细功能主函数
     */
    async function exportDetails() {
        // 获取所有页的单据明细
        await fetchAllPagesDetails();

        // 导出明细到Excel
        await exportDetailsToExcel();
    }

    /**
     * 获取所有页的单据明细
     */
    async function fetchAllPagesDetails() {
        // 显示加载提示
        const loadIndex = layer.msg("正在查询单据明细...", {
            icon: 16,
            shade: 0.01,
            time: 0,
        });
        // 获取总页数
        const paginationTotalPage = await getPaginationTotalPage();
        // 分页获取所有明细
        await paginateAndFetchDetails(paginationTotalPage);
        // 关闭加载提示
        layer.close(loadIndex);
    }

    /**
     * 计算有多少页单据需要获取明细
     */
    async function getPaginationTotalPage() {
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
     */
    async function paginateAndFetchDetails(paginationTotalPage) {
        // 获取跳转下一页按钮
        const paginationNext = document.querySelector(".ant-pagination-next");
        if (!paginationNext) {
            throw new Error("跳转下一页按钮未找到");
        }

        // 遍历所有页， 获取所有页的单据明细
        for (let i = 1; i <= paginationTotalPage; i++) {
            // 获取当前页的单据明细
            await fetchCurrentPageDetails();

            // 如果是最后一页，跳出循环
            if (i === paginationTotalPage) break;

            // 点击下一页按钮
            paginationNext.click();

            // 延迟，等待页面渲染完成
            await delay(RENDERING_INTERVAL);
        }
    }

    /**
     * 获取当前页的单据明细
     */
    async function fetchCurrentPageDetails() {
        // 获取当前页的所有单据ID
        const expenseIDs = document.querySelectorAll(
            ".ant-table-body .ant-table-row .ant-table-cell:nth-child(1)"
        );
        if (!expenseIDs || expenseIDs.length === 0) {
            throw new Error("单据ID未找到");
        }

        // 遍历所有单据ID，获取明细
        for (const expenseID of expenseIDs) {
            // 获取当前单据的明细
            const currentRowDetails = await fetchCurrentRowDetails(
                expenseID.innerText
            );

            // 将明细添加到allDetails中
            allDetails.push(...currentRowDetails);

            // 延迟，避免请求频率过快
            await delay(REQUEST_INTERVAL);
        }
    }

    /**
     * 延时函数
     * @param {number} milliseconds 毫秒数
     */
    async function delay(milliseconds) {
        // 校验`milliseconds`是否为正数
        if (typeof milliseconds !== "number" || milliseconds <= 0) {
            console.error("Expected milliseconds to be a positive number");
            return;
        }

        // 使用固定的随机倍数，而不是直接使用`Math.random()`，以提高可预测性
        const randomFactor = 0.5;
        const duration = milliseconds * (1 + Math.random() * randomFactor);

        // 随机延迟，避免请求频率过快
        return new Promise((resolve) => setTimeout(resolve, duration));
    }

    /**
     * 根据单据ID获取明细
     * @param {string} expenseID 单据ID
     */
    async function fetchCurrentRowDetails(expenseID) {
        // 构建请求参数
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify([{ bizType: BIZ_TYPE, code: expenseID }]),
        };

        // 发送请求
        try {
            // 使用fetch进行异步请求
            const response = await fetch(API_BASE_URL, options);

            // 检查响应是否成功
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            // 解析响应为JSON格式
            const result = await response.json();

            // 处理响应明细数据
            return processResponseDetails(result);
        } catch (error) {
            // 重新抛出错误以供上层捕获
            throw error;
        }
    }

    /**
     * 处理响应明细数据
     * @param {Object} result 响应明细数据
     */
    function processResponseDetails(result) {
        // 使用 safeAccess 函数来确保安全访问
        const returnNoteCode = safeAccess(
            result,
            "data",
            "data",
            "infoValues",
            "returnNoteCode"
        );
        const dataList = safeAccess(
            result,
            "data",
            "data",
            "productInfos",
            "dataList"
        );

        // 校验数据类型
        if (typeof returnNoteCode !== "string") {
            throw new Error(
                `Expected a string for returnNoteCode, but received ${returnNoteCode}`
            );
        }
        if (!Array.isArray(dataList)) {
            throw new Error(
                `Expected an array for dataList, but received ${dataList}`
            );
        }

        // 遍历数组，处理每一项数据
        return dataList.map((item) => ({
            returnNoteCode: convertIfUndefined(returnNoteCode),
            proReturnBarcode: convertIfUndefined(item.proReturnBarcode),
            skuPrice: convertIfUndefined(item.skuPrice),
        }));
    }

    /**
     * 辅助函数，用于简化对 undefined 的检查和转换逻辑
     * @param {*} value 值
     */
    function convertIfUndefined(value) {
        return typeof value === "undefined" ? "" : String(value);
    }

    /**
     * 辅助函数，用于简化对数字的转换逻辑
     * @param {*} value 值
     */
    function convertToNumber(value) {
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    }

    /**
     * 辅助函数，用于简化对对象属性的访问逻辑
     * @param {Object} obj 对象
     * @param {...string} keys 属性名
     */
    function safeAccess(obj, ...keys) {
        return keys.reduce(
            (acc, key) => (acc && acc[key] != null ? acc[key] : null),
            obj
        );
    }

    /**
     * 将明细导出为Excel文件
     */
    async function exportDetailsToExcel() {
        // 显示加载提示
        const loadIndex = layer.msg("正在导出单据明细...", {
            icon: 16,
            shade: 0.01,
            time: 0,
        });
        // 创建工作簿和工作表
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(allDetails);

        // 添加表头
        XLSX.utils.sheet_add_aoa(
            worksheet,
            [["售后退货单号", "备件条码", "退货价"]],
            { origin: "A1" }
        );

        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(workbook, worksheet, "备件退货单");
        // 导出为excel文件
        await XLSX.writeFile(workbook, "备件退货单.xlsx", {
            compression: true,
        });
        // 关闭加载提示
        layer.close(loadIndex);
        // 显示成功提示
        layer.msg("导出成功", { icon: 6 });
    }
})();
