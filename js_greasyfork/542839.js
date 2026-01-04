// ==UserScript==
// @name         贝壳房源信息收集器 (成交/在售三模式)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  在浏览贝壳(ke.com)时，自动收集成交列表页、在售列表页和在售详情页的房源信息，并提供独立的、动态命名的CSV下载功能。
// @author       CodeDust
// @match        https://*.ke.com/chengjiao/*
// @match        https://*.ke.com/ershoufang/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542839/%E8%B4%9D%E5%A3%B3%E6%88%BF%E6%BA%90%E4%BF%A1%E6%81%AF%E6%94%B6%E9%9B%86%E5%99%A8%20%28%E6%88%90%E4%BA%A4%E5%9C%A8%E5%94%AE%E4%B8%89%E6%A8%A1%E5%BC%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542839/%E8%B4%9D%E5%A3%B3%E6%88%BF%E6%BA%90%E4%BF%A1%E6%81%AF%E6%94%B6%E9%9B%86%E5%99%A8%20%28%E6%88%90%E4%BA%A4%E5%9C%A8%E5%94%AE%E4%B8%89%E6%A8%A1%E5%BC%8F%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 全局配置 ---
    const STORAGE_KEYS = {
        CHENGJIAO: 'beike_chengjiao_data',
        ERSHOUFANG: 'beike_ershoufang_data',
        ERSHOUFANG_LIST: 'beike_ershoufang_list_data'
    };

    /**
     * 主函数，脚本的入口
     */
    function main() {
        console.log('贝壳房源信息收集脚本 (v2.3) 已启动！');
        createUI();
        routePage();
    }

    /**
     * 页面路由，根据当前URL决定执行哪个函数
     */
    function routePage() {
        const url = window.location.href;
        if (url.includes('/chengjiao/')) {
            console.log('进入成交列表页模式');
            handleChengjiaoListPage();
        } else if (url.includes('/ershoufang/') && url.endsWith('.html')) {
            console.log('进入在售详情页模式');
            // 在售详情页，通过点击按钮来保存
        } else if (url.includes('/ershoufang/') && !url.endsWith('.html')) {
            console.log('进入在售列表页模式');
            // 在售列表页，通过点击按钮来保存
        }
    }

    // ==================================================================
    //                  在售(ershoufang)页面处理逻辑
    // ==================================================================
    /**
     * 点击“一键保存”按钮时触发的函数
     */
    function saveErshoufangDetail() {
        console.log('开始抓取在售房源详情...');

        // 辅助函数，用于安全地获取元素文本
        const getText = (selector) => document.querySelector(selector)?.innerText.trim() || '';
        // 辅助函数，用于从“基本属性”和“交易属性”列表中提取信息
        const getFromInfoList = (label) => {
            const allLi = document.querySelectorAll('.base .content li, .transaction .content li');
            for (const li of allLi) {
                if (li.querySelector('.label')?.innerText === label) {
                    const clone = li.cloneNode(true);
                    clone.querySelector('.label').remove();
                    return clone.innerText.trim();
                }
            }
            return '';
        };

        // 1. 抓取原始数据
        const rawData = {
            title: getText('h1.main'),
            totalPrice: getText('.price .total'),
            unitPrice: getText('.unitPriceValue'),
            community: getText('.communityName > a.info'),
            fullArea: getText('.areaName > .info'),
            tags: Array.from(document.querySelectorAll('.tags .content .tag')).map(el => el.innerText.trim()).join(' | '),
            followerCount: getText('#favCount'),
            // 从基本属性列表中提取
            layout: getFromInfoList('房屋户型'),
            floor: getFromInfoList('所在楼层'),
            grossArea: getFromInfoList('建筑面积'),
            structure: getFromInfoList('户型结构'),
            buildingType: getFromInfoList('建筑类型'),
            direction: getFromInfoList('房屋朝向'),
            decoration: getFromInfoList('装修情况'),
            elevatorRatio: getFromInfoList('梯户比例'),
            // 从交易属性列表中提取
            listDate: getFromInfoList('挂牌时间'),
            ownership: getFromInfoList('交易权属'),
            lastTrade: getFromInfoList('上次交易'),
            usage: getFromInfoList('房屋用途'),
            propertyAge: getFromInfoList('房屋年限'),
            propertyRight: getFromInfoList('产权所属'),
            mortgage: getFromInfoList('抵押信息'),
            // 从另一个位置获取更准确的年代和建筑类型
            yearAndBuildTypeFromSubInfo: getText('.houseInfo .area .subInfo'),
        };

        // 2. 解析和格式化数据
        const formatted = {};
        formatted['标题'] = rawData.title;
        formatted['小区'] = rawData.community;

        const areaParts = rawData.fullArea.split(/\s+/).filter(Boolean);
        formatted['区域'] = areaParts[0] || 'N/A';
        formatted['商圈'] = areaParts[1] || 'N/A';

        formatted['总价(万)'] = parseFloat(rawData.totalPrice) || 'N/A';
        formatted['单价(元/平)'] = parseInt(rawData.unitPrice) || 'N/A';
        formatted['户型'] = rawData.layout;
        formatted['建筑面积(㎡)'] = parseFloat(rawData.grossArea) || 'N/A';
        formatted['朝向'] = rawData.direction;
        formatted['装修'] = rawData.decoration;
        formatted['楼层'] = rawData.floor ? rawData.floor.split('咨询楼层')[0].trim() : 'N/A';

        if (rawData.yearAndBuildTypeFromSubInfo) {
            const yearMatch = rawData.yearAndBuildTypeFromSubInfo.match(/(\d{4})年建/);
            formatted['年代'] = yearMatch ? parseInt(yearMatch[1]) : 'N/A';
            const buildTypeMatch = rawData.yearAndBuildTypeFromSubInfo.match(/建\/(.+)/);
            formatted['建筑类型'] = buildTypeMatch ? buildTypeMatch[1].trim() : 'N/A';
        } else {
            formatted['年代'] = 'N/A';
            formatted['建筑类型'] = rawData.buildingType;
        }

        formatted['户型结构'] = rawData.structure;
        formatted['梯户比例'] = rawData.elevatorRatio;
        formatted['挂牌时间'] = rawData.listDate;
        formatted['交易权属'] = rawData.ownership;
        formatted['上次交易'] = rawData.lastTrade;
        formatted['房屋用途'] = rawData.usage;
        formatted['房屋年限'] = rawData.propertyAge;
        formatted['产权所属'] = rawData.propertyRight;
        formatted['抵押信息'] = rawData.mortgage.replace(/\s*查看详情\s*/g, '').trim();
        formatted['房源标签'] = rawData.tags;
        formatted['关注人数'] = parseInt(rawData.followerCount) || 0;
        formatted['详情链接'] = window.location.href;

        // 3. 保存数据
        let allData = JSON.parse(GM_getValue(STORAGE_KEYS.ERSHOUFANG) || '{}');
        allData[window.location.href] = formatted;
        GM_setValue(STORAGE_KEYS.ERSHOUFANG, JSON.stringify(allData));

        // 4. 更新UI反馈
        const count = Object.keys(allData).length;
        updateButtonCount('ershoufang', count);
        const saveBtn = document.getElementById('gemini-save-ershoufang-btn');
        saveBtn.innerText = '已保存!';
        saveBtn.style.backgroundColor = '#67c23a'; // 绿色表示成功
        setTimeout(() => {
            saveBtn.innerText = '一键保存本页信息';
            saveBtn.style.backgroundColor = '#409EFF';
        }, 1500);

        console.log('在售房源保存成功:', formatted);
    }

    // ==================================================================
    //                  成交(chengjiao)页面处理逻辑 (无变动)
    // ==================================================================
    function handleChengjiaoListPage() {
        let allCollectedData = JSON.parse(GM_getValue(STORAGE_KEYS.CHENGJIAO) || '{}');
        const items = document.querySelectorAll('ul.listContent > li');
        if (items.length === 0) return;

        console.log(`在成交列表找到 ${items.length} 个房源，开始处理...`);
        items.forEach(item => {
            const titleElement = item.querySelector('div.info > div.title > a');
            if (!titleElement) return;

            const getText = (selector) => item.querySelector(selector)?.innerText.trim() || '';
            const rawHouseData = {
                title: getText('div.info > div.title > a'),
                detailUrl: titleElement.href,
                houseInfo: getText('div.houseInfo'),
                positionInfo: getText('div.positionInfo'),
                dealDate: getText('div.dealDate'),
                totalPrice: getText('div.totalPrice span.number'),
                unitPrice: getText('div.unitPrice span.number'),
                dealCycleInfo: getText('div.dealCycleeInfo .dealCycleTxt')
            };

            const formattedData = parseChengjiaoData(rawHouseData);
            allCollectedData[formattedData.详情链接] = formattedData;
        });

        GM_setValue(STORAGE_KEYS.CHENGJIAO, JSON.stringify(allCollectedData));
        const finalCount = Object.keys(allCollectedData).length;
        console.log(`处理完毕！目前总共收集了 ${finalCount} 条成交房源信息。`);
        updateButtonCount('chengjiao', finalCount);
    }

    function parseChengjiaoData(rawData) {
        const formatted = {
            '小区名称': 'N/A', '户型': 'N/A', '面积(㎡)': 'N/A', '详情链接': rawData.detailUrl,
            '成交日期': rawData.dealDate, '成交总价(万)': rawData.totalPrice, '成交单价(元/平)': rawData.unitPrice,
            '朝向': 'N/A', '装修': 'N/A', '楼层信息': 'N/A', '建成年代': 'N/A',
            '房屋结构': 'N/A', '挂牌价(万)': 'N/A', '成交周期(天)': 'N/A'
        };

        if (rawData.title) {
            const titleParts = rawData.title.split(/\s+/).filter(Boolean);
            if (titleParts.length >= 3) {
                formatted['面积(㎡)'] = parseFloat(titleParts[titleParts.length - 1]) || 'N/A';
                formatted['户型'] = titleParts[titleParts.length - 2];
                formatted['小区名称'] = titleParts.slice(0, -2).join(' ');
            } else { formatted['小区名称'] = rawData.title; }
        }
        if (rawData.houseInfo && rawData.houseInfo.includes('|')) {
            const parts = rawData.houseInfo.split('|');
            formatted['朝向'] = parts[0] ? parts[0].trim() : 'N/A';
            formatted['装修'] = parts[1] ? parts[1].trim() : 'N/A';
        } else { formatted['朝向'] = rawData.houseInfo; }
        if (rawData.positionInfo) {
            const parts = rawData.positionInfo.split(/\s+/).filter(Boolean);
            formatted['楼层信息'] = parts[0] || 'N/A';
            const yearAndStructurePart = parts.find(p => p.includes('年'));
            if (yearAndStructurePart) {
                const yearMatch = yearAndStructurePart.match(/(\d{4})年/);
                if (yearMatch) formatted['建成年代'] = parseInt(yearMatch[1]);
                const structureMatch = yearAndStructurePart.match(/年(.+)/);
                if (structureMatch) formatted['房屋结构'] = structureMatch[1].trim();
            }
        }
        if (rawData.dealCycleInfo) {
            let match;
            match = rawData.dealCycleInfo.match(/挂牌(\d+\.?\d*)万/);
            if (match) formatted['挂牌价(万)'] = parseFloat(match[1]);
            match = rawData.dealCycleInfo.match(/成交周期(\d+)天/);
            if (match) formatted['成交周期(天)'] = parseInt(match[1]);
        }
        return formatted;
    }


    // ==================================================================
    //                  在售列表页(ershoufang list)页面处理逻辑
    // ==================================================================
    /**
     * 点击"一键保存"按钮时触发的函数 - 在售列表页
     */
    function saveErshoufangListPage() {
        console.log('开始抓取在售列表页房源...');

        let allCollectedData = JSON.parse(GM_getValue(STORAGE_KEYS.ERSHOUFANG_LIST) || '{}');
        const items = document.querySelectorAll('ul.sellListContent > li.clear');

        if (items.length === 0) {
            alert('未找到房源信息！');
            return;
        }

        console.log(`在在售列表找到 ${items.length} 个房源，开始处理...`);

        items.forEach(item => {
            const titleElement = item.querySelector('div.info > div.title > a');
            if (!titleElement) return;

            const getText = (selector) => item.querySelector(selector)?.innerText.trim() || '';

            // 抓取原始数据
            const rawData = {
                title: getText('div.info > div.title > a'),
                detailUrl: titleElement.href,
                community: getText('div.address .positionInfo a'),
                houseInfo: getText('div.houseInfo'),
                followInfo: getText('div.followInfo'),
                totalPrice: getText('div.priceInfo .totalPrice span:not(i)'),
                unitPrice: getText('div.priceInfo .unitPrice span'),
                tags: Array.from(item.querySelectorAll('div.tag span')).map(el => el.innerText.trim()).join(' | ')
            };

            const formattedData = parseErshoufangListData(rawData);
            allCollectedData[formattedData.详情链接] = formattedData;
        });

        GM_setValue(STORAGE_KEYS.ERSHOUFANG_LIST, JSON.stringify(allCollectedData));
        const finalCount = Object.keys(allCollectedData).length;
        console.log(`处理完毕！目前总共收集了 ${finalCount} 条在售列表房源信息。`);

        // 调试信息：输出第一条数据的解析结果
        if (items.length > 0) {
            const firstItem = items[0];
            const debugHouseInfo = firstItem.querySelector('div.houseInfo')?.innerText.trim();
            console.log('调试信息 - 第一条房源的houseInfo:', debugHouseInfo);
            if (debugHouseInfo) {
                const debugParts = debugHouseInfo.split('|').map(p => p.trim());
                console.log('调试信息 - 分割后的部分:', debugParts);
            }
        }

        // 更新UI反馈
        updateButtonCount('ershoufang-list', finalCount);
        const saveBtn = document.getElementById('gemini-save-ershoufang-list-btn');
        saveBtn.innerText = '已保存!';
        saveBtn.style.backgroundColor = '#67c23a';
        setTimeout(() => {
            saveBtn.innerText = '一键保存本页房源';
            saveBtn.style.backgroundColor = '#409EFF';
        }, 1500);
    }

    /**
     * 解析在售列表页房源数据
     * 房屋信息格式: 楼层 | 年代 | 户型 | 面积 | 朝向
     * 例如: "中楼层 (共18层) | 2016年 | 2室2厅 | 146.21平米 | 南"
     */
    function parseErshoufangListData(rawData) {
        const formatted = {
            '标题': rawData.title,
            '小区': rawData.community,
            '总价(万)': 'N/A',
            '单价(元/平)': 'N/A',
            '户型': 'N/A',
            '建筑面积(㎡)': 'N/A',
            '朝向': 'N/A',
            '楼层': 'N/A',
            '年代': 'N/A',
            '关注人数': 'N/A',
            '发布时间': 'N/A',
            '房源标签': rawData.tags,
            '详情链接': rawData.detailUrl
        };

        // 解析总价
        if (rawData.totalPrice) {
            formatted['总价(万)'] = parseFloat(rawData.totalPrice) || 'N/A';
        }

        // 解析单价
        if (rawData.unitPrice) {
            const unitPriceMatch = rawData.unitPrice.match(/(\d+,?\d*)/);
            if (unitPriceMatch) {
                formatted['单价(元/平)'] = parseInt(unitPriceMatch[1].replace(',', '')) || 'N/A';
            }
        }

        // 解析房屋信息 (楼层 | 年代 | 户型 | 面积 | 朝向)
        if (rawData.houseInfo) {
            const parts = rawData.houseInfo.split('|').map(p => p.trim());

            // 楼层信息 (如: "中楼层 (共18层)")
            if (parts[0]) {
                formatted['楼层'] = parts[0].replace(/\s*\(.*?\)\s*/, '').trim();
            }

            // 年代 (如: "2016年")
            if (parts[1]) {
                const yearMatch = parts[1].match(/(\d{4})年/);
                if (yearMatch) {
                    formatted['年代'] = parseInt(yearMatch[1]);
                }
            }

            // 户型 (如: "2室2厅")
            if (parts[2]) {
                const layoutMatch = parts[2].match(/(\d+室\d+厅)/);
                if (layoutMatch) {
                    formatted['户型'] = layoutMatch[1];
                } else {
                    formatted['户型'] = parts[2];
                }
            }

            // 面积 (如: "146.21平米")
            if (parts[3]) {
                const areaMatch = parts[3].match(/(\d+\.?\d*)平米/);
                if (areaMatch) {
                    formatted['建筑面积(㎡)'] = parseFloat(areaMatch[1]);
                } else {
                    // 如果没有"平米"字样，尝试直接解析数字
                    const numMatch = parts[3].match(/(\d+\.?\d*)/);
                    if (numMatch) {
                        formatted['建筑面积(㎡)'] = parseFloat(numMatch[1]);
                    }
                }
            }

            // 朝向 (如: "南")
            if (parts[4]) {
                formatted['朝向'] = parts[4];
            }
        }

        // 解析关注信息 (如: "10人关注 / 9月前发布")
        if (rawData.followInfo) {
            const followMatch = rawData.followInfo.match(/(\d+)人关注/);
            if (followMatch) {
                formatted['关注人数'] = parseInt(followMatch[1]);
            }

            const publishMatch = rawData.followInfo.match(/\/\s*(.+?)发布/);
            if (publishMatch) {
                formatted['发布时间'] = publishMatch[1].trim();
            }
        }

        return formatted;
    }

    // ==================================================================
    //                  UI 和通用功能函数
    // ==================================================================
    /**
     * 创建界面元素
     */
    function createUI() {
        const url = window.location.href;
        const container = document.createElement('div');
        let buttonsHtml = '';

        // 根据页面类型显示不同的按钮组合
        if (url.includes('/ershoufang/') && url.endsWith('.html')) {
            // 在售详情页
            buttonsHtml = `
                <div id="gemini-ershoufang-panel">
                    <button class="gemini-save-btn" id="gemini-save-ershoufang-btn">一键保存本页信息</button>
                    <div class="gemini-main-btn" id="gemini-download-ershoufang-btn" title="点击下载已收集的在售详情信息">
                        <span>在售详情</span>
                        <span class="gemini-data-count" id="gemini-ershoufang-count">0</span>
                    </div>
                    <button class="gemini-clear-btn" id="gemini-clear-ershoufang-btn" title="清空所有已收集的在售详情数据">清空</button>
                </div>`;
        } else if (url.includes('/ershoufang/') && !url.endsWith('.html')) {
            // 在售列表页
            buttonsHtml = `
                <div id="gemini-ershoufang-list-panel">
                    <button class="gemini-save-btn" id="gemini-save-ershoufang-list-btn">一键保存本页房源</button>
                    <div class="gemini-main-btn" id="gemini-download-ershoufang-list-btn" title="点击下载已收集的在售列表信息">
                        <span>在售列表</span>
                        <span class="gemini-data-count" id="gemini-ershoufang-list-count">0</span>
                    </div>
                    <button class="gemini-clear-btn" id="gemini-clear-ershoufang-list-btn" title="清空所有已收集的在售列表数据">清空</button>
                </div>`;
        } else if (url.includes('/chengjiao/')) {
            buttonsHtml = `
                <div id="gemini-chengjiao-panel">
                    <div class="gemini-main-btn" id="gemini-download-chengjiao-btn" title="点击下载已收集的成交信息">
                        <span>成交</span>
                        <span class="gemini-data-count" id="gemini-chengjiao-count">0</span>
                    </div>
                    <button class="gemini-clear-btn" id="gemini-clear-chengjiao-btn" title="清空所有已收集的成交数据">清空</button>
                </div>`;
        }

        container.innerHTML = buttonsHtml;
        document.body.appendChild(container);

        // 动态绑定事件
        if (url.includes('/ershoufang/') && url.endsWith('.html')) {
            // 在售详情页
            document.getElementById('gemini-save-ershoufang-btn').addEventListener('click', saveErshoufangDetail);
            document.getElementById('gemini-download-ershoufang-btn').addEventListener('click', () => downloadData('ershoufang'));
            document.getElementById('gemini-clear-ershoufang-btn').addEventListener('click', () => clearData('ershoufang'));
            updateButtonCount('ershoufang', Object.keys(JSON.parse(GM_getValue(STORAGE_KEYS.ERSHOUFANG) || '{}')).length);
        } else if (url.includes('/ershoufang/') && !url.endsWith('.html')) {
            // 在售列表页
            document.getElementById('gemini-save-ershoufang-list-btn').addEventListener('click', saveErshoufangListPage);
            document.getElementById('gemini-download-ershoufang-list-btn').addEventListener('click', () => downloadData('ershoufang-list'));
            document.getElementById('gemini-clear-ershoufang-list-btn').addEventListener('click', () => clearData('ershoufang-list'));
            updateButtonCount('ershoufang-list', Object.keys(JSON.parse(GM_getValue(STORAGE_KEYS.ERSHOUFANG_LIST) || '{}')).length);
        } else if (url.includes('/chengjiao/')) {
            document.getElementById('gemini-download-chengjiao-btn').addEventListener('click', () => downloadData('chengjiao'));
            document.getElementById('gemini-clear-chengjiao-btn').addEventListener('click', () => clearData('chengjiao'));
            updateButtonCount('chengjiao', Object.keys(JSON.parse(GM_getValue(STORAGE_KEYS.CHENGJIAO) || '{}')).length);
        }

        GM_addStyle(`
            #gemini-chengjiao-panel, #gemini-ershoufang-panel, #gemini-ershoufang-list-panel { display: flex; align-items: center; position: fixed; right: 20px; bottom: 20px; z-index: 9999; }
            .gemini-main-btn, .gemini-clear-btn, .gemini-save-btn {
                border: none; border-radius: 8px; cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 14px;
                display: flex; align-items: center; justify-content: center;
                transition: all 0.2s ease; margin-left: 10px; height: 40px; color: white; padding: 0 15px;
            }
            .gemini-main-btn { background-color: #00AE66; }
            .gemini-main-btn:hover { background-color: #00995a; }
            .gemini-clear-btn { background-color: #F56C6C; width: 50px; }
            .gemini-clear-btn:hover { background-color: #d32f2f; }
            .gemini-save-btn { background-color: #409EFF; font-weight: bold; }
            .gemini-save-btn:hover { background-color: #3a8ee6; }
            .gemini-data-count {
                background-color: white; color: #00AE66; padding: 2px 6px;
                border-radius: 10px; margin-left: 8px; font-weight: bold; font-size: 12px;
            }
        `);
    }

    function updateButtonCount(type, count) {
        const countElement = document.getElementById(`gemini-${type}-count`);
        if (countElement) countElement.innerText = count;
    }

    function getAreaName() {
        const url = window.location.href;
        let areaName = '未知区域';
        if (url.includes('/chengjiao/')) {
            areaName = document.querySelector('div.deal-bread a:nth-last-child(2)')?.innerText.replace('二手房成交', '') || '成交房源';
        } else if (url.includes('/ershoufang/') && url.endsWith('.html')) {
            // 在售详情页
            const areaElements = document.querySelectorAll('.areaName .info a');
            if (areaElements.length > 1) {
                areaName = areaElements[areaElements.length - 1].innerText;
            } else if (areaElements.length === 1) {
                areaName = areaElements[0].innerText;
            }
        } else if (url.includes('/ershoufang/') && !url.endsWith('.html')) {
            // 在售列表页 - 从筛选条件中获取区域名称
            const selectedArea = document.querySelector('.m-filter .position a.selected');
            if (selectedArea && selectedArea.innerText !== '区域') {
                areaName = selectedArea.innerText;
            } else {
                // 从URL路径中提取区域名称
                const pathMatch = url.match(/\/ershoufang\/([^\/]+)\//);
                if (pathMatch) {
                    areaName = pathMatch[1];
                }
            }
        }
        return areaName;
    }

    function downloadData(type) {
        let storageKey, typeName;
        if (type === 'chengjiao') {
            storageKey = STORAGE_KEYS.CHENGJIAO;
            typeName = '成交房源';
        } else if (type === 'ershoufang') {
            storageKey = STORAGE_KEYS.ERSHOUFANG;
            typeName = '在售详情房源';
        } else if (type === 'ershoufang-list') {
            storageKey = STORAGE_KEYS.ERSHOUFANG_LIST;
            typeName = '在售列表房源';
        }

        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const areaName = getAreaName();
        const fileName = `${date}_${areaName}_${typeName}.csv`;

        const rawData = GM_getValue(storageKey);
        if (!rawData || rawData === '{}') {
            alert(`尚未收集到任何“${typeName}”信息！`);
            return;
        }
        const data = Object.values(JSON.parse(rawData));
        if (data.length === 0) {
            alert('数据为空，无法下载。');
            return;
        }

        const headers = Object.keys(data[0]);
        let csvContent = headers.join(',') + '\n';
        data.forEach(row => {
            const values = headers.map(header => {
                let value = row[header] === undefined || row[header] === null ? '' : row[header];
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvContent += values.join(',') + '\n';
        });

        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function clearData(type) {
        let storageKey, typeName;
        if (type === 'chengjiao') {
            storageKey = STORAGE_KEYS.CHENGJIAO;
            typeName = '成交';
        } else if (type === 'ershoufang') {
            storageKey = STORAGE_KEYS.ERSHOUFANG;
            typeName = '在售详情';
        } else if (type === 'ershoufang-list') {
            storageKey = STORAGE_KEYS.ERSHOUFANG_LIST;
            typeName = '在售列表';
        }
        if (confirm(`您确定要清空所有已收集的“${typeName}”房源信息吗？此操作不可撤销。`)) {
            GM_setValue(storageKey, '{}');
            updateButtonCount(type, 0);
            alert(`“${typeName}”数据已清空！`);
        }
    }

    main();
})();