// ==UserScript==
// @name         全供应商待审量采集PRO-12.18
// @namespace    http://tampermonkey.net/
// @version      2.3
// @author       刚学会做蛋饼（优化 by Qwen）
// @license      MIT
// @description  自动设为100条/页，提取全部队列待审量，写入 GM 与 localStorage
// @match        https://wanx.myapp.com/aop/audit/platelist*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543683/%E5%85%A8%E4%BE%9B%E5%BA%94%E5%95%86%E5%BE%85%E5%AE%A1%E9%87%8F%E9%87%87%E9%9B%86PRO-1218.user.js
// @updateURL https://update.greasyfork.org/scripts/543683/%E5%85%A8%E4%BE%9B%E5%BA%94%E5%95%86%E5%BE%85%E5%AE%A1%E9%87%8F%E9%87%87%E9%9B%86PRO-1218.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const NAME_MAPPING = {
"先发后审": "商品-先发后审",
"临时(大闸蟹专项)": "商品-临时(大闸蟹专项)",
"高风险曝光召回": "商品-高风险曝光召回",
"低风险曝光召回": "商品-低风险曝光召回",
"API爆量迁移审核": "商品-API爆量迁移审核",
"黑图标注": "黑图标注",
"拆单队列": "商品审核-拆单队列",
"智能-模型优化": "智能发品-模型优化",
"智能-属性标注": "智能发品-属性标注",
"智能-主图标注": "智能发品-主图标注",
"商品审核-全字段": "商品审核-全字段",
"商品审核-资质类目": "商品审核-资质类目",
"商品审核-标题图片": "商品审核-标题图片",
"试运类目先审": "商品-试运类目先审",
"试运类目先发": "商品-试运类目先发",
"试运类目曝光召回": "商品-试运类目曝光召回",
"试运类目曝光召回复审": "商品-试运类目曝光召回复审",
"保健品": "商品-保健品先审",
"成人用品": "商品-成人用品",
"本地2.0API爆量迁移审核": "商品-本地2.0API爆量迁移审核",
"召回-本地生活2.0": "商品-召回-本地生活2.0",
"试运类目先发复审": "商品-试运类目先发复审",
"召回-酒类": "商品-召回-酒类",
"召回-服饰钟表": "商品-召回-服饰钟表",
"召回-文玩": "商品-召回-文玩",
"召回-珠宝首饰": "商品-召回-珠宝首饰",
"召回-宠物农资": "商品-召回-宠物农资",
"召回-家清家装日用": "商品-召回-家清家装日用",
"召回-电子数码": "商品-召回-电子数码",
"召回-本地生活": "商品-召回-本地生活",
"召回-食品生鲜": "商品-召回-食品生鲜",
"召回-图书潮玩": "商品-召回-图书潮玩",
"召回-美妆个护": "商品-召回-美妆个护",
"召回-教育培训": "商品-召回-教育培训",
"召回-成人用品": "商品-召回-成人用品",
"召回-保健品": "商品-召回-保健品",
"商品打标板块": "商品打标板块",
"无": "商品-回扫",
"酒": "商品-酒类",
"高热召回": "商品-高热召回",
"教育培训": "商品-教育培训",
"电子数码": "商品-电子数码",
"珠宝": "商品-珠宝首饰",
"文玩": "商品-文玩",
"美妆个护": "商品-美妆个护",
"宠物农资": "商品-宠物农资",
"图书潮玩": "商品-图书潮玩",
"食品生鲜": "商品-食品生鲜",
"家清家装日用": "商品-家清家装日用",
"服饰钟表": "商品-服饰钟表",
"好店": "商店-好店",
"本地生活2.0": "商品-本地生活2.0",
"先发后审-复审": "商品-先发后审-复审",
"达人专属": "商品-达人专属"
    };

    const UPDATE_INTERVAL = 1 * 60 * 1000; // 5分钟更新一次

    // ⏳ 工具函数：延迟
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 🖱 模拟点击“100条/页”
    async function setPageSizeTo100(maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            console.log(`🔄 尝试设置分页为100条/页（第 ${attempt} 次）...`);

            // 查找分页下拉框（使用更稳定的 class 选择器）
            const selectInput = document.querySelector('.el-pagination .el-select input');
            if (!selectInput) {
                console.warn("⚠️ 未找到分页下拉框，等待...");
                await sleep(1000);
                continue;
            }

            // 点击打开下拉
            selectInput.click();
            await sleep(500);

            // 查找“100条/页”选项
            const option = Array.from(document.querySelectorAll('.el-select-dropdown__item'))
                .find(li => li.textContent.trim() === '100 条/页' || li.textContent.includes('100'));

            if (option) {
                option.click();
                console.log("✅ 成功设置为 100 条/页");
                await sleep(1500); // 等待表格重新加载
                return true;
            } else {
                console.warn("⚠️ 未找到 '100条/页' 选项，重试...");
                await sleep(1000);
            }
        }
        console.error("❌ 设置 100 条/页 失败，放弃");
        return false;
    }

    // 🔍 提取数据
    function extractData() {
        const data = {};
        const rows = document.querySelectorAll('table tbody tr');

        for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length < 2) continue;

            const nameCell = cells[0]?.textContent?.trim();
            const countText = cells[1]?.textContent?.trim();

            for (const [customName, realName] of Object.entries(NAME_MAPPING)) {
                if (nameCell === realName) {
                    const num = parseInt(countText?.replace(/,/g, '') || '0', 10);
                    data[customName] = isNaN(num) ? 0 : num;
                }
            }
        }
        return data;
    }

    // 💾 保存数据（兼容原脚本）
    function saveData(data) {
        GM_setValue("pendingData", JSON.stringify(data));
        localStorage.setItem("supplier_pending_data", JSON.stringify({
            updatedAt: new Date().toISOString(),
            data
        }));
        console.log(`✅ [${new Date().toLocaleString()}] 数据已更新：`, data);
    }

    // 🔄 单次完整流程：设100条 → 采集 → 保存
    async function runOnce() {
        console.log("🟟 开始执行采集流程...");

        // 步骤1：设置分页为100条
        const success = await setPageSizeTo100();
        if (!success) {
            console.error("🚫 无法设置分页，跳过本次采集");
            return;
        }

        // 步骤2：提取数据
        const data = extractData();
        if (Object.keys(data).length === 0) {
            console.warn("⚠️ 未采集到任何匹配队列，请检查 NAME_MAPPING");
        }

        // 步骤3：保存
        saveData(data);
    }

    // 🕒 启动主逻辑
    async function start() {
        // 首次执行
        await runOnce();

        // 定时执行（每5分钟）
        setInterval(runOnce, UPDATE_INTERVAL);
    }

    // 🚀 启动（等 DOM 就绪）
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();