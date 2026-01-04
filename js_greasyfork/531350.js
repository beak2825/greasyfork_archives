// ==UserScript==
// @name         Manwa.me 漫画信息导入Notion
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  从manwa.me提取漫画信息并一键导入Notion数据库
// @author       YourName
// @match        https://manwa.me/book/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @connect      notion.com
// @connect      api.notion.com
// @downloadURL https://update.greasyfork.org/scripts/531350/Manwame%20%E6%BC%AB%E7%94%BB%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5Notion.user.js
// @updateURL https://update.greasyfork.org/scripts/531350/Manwame%20%E6%BC%AB%E7%94%BB%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5Notion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Notion配置
    const NOTION_CONFIG = {
        apiKey: "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",
        databaseId: "1a8a720b00a68033af07d33d6a1c11a1"
    };

    // 主函数
    async function main() {
        // 添加导入按钮
        addImportButton();

        // 使按钮可拖动
        makeButtonDraggable();
    }

    // 添加透明悬浮按钮
    function addImportButton() {
        const button = document.createElement('div');
        button.id = 'import-to-notion-btn';
        button.style.position = 'fixed';
        button.style.width = '40px';
        button.style.height = '40px';
        button.style.borderRadius = '50%';
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        button.style.border = '1px solid rgba(0, 0, 0, 0.3)';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';
        button.style.bottom = '100px';
        button.style.right = '30px';
        button.style.display = 'flex';
        button.style.justifyContent = 'center';
        button.style.alignItems = 'center';
        button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        button.style.userSelect = 'none';

        // 添加点击事件
        button.addEventListener('click', async () => {
            await handleImport();
        });

        // 添加悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        });

        document.body.appendChild(button);
    }

    // 使按钮可拖动
    function makeButtonDraggable() {
        const button = document.getElementById('import-to-notion-btn');
        let isDragging = false;
        let offsetX, offsetY;

        button.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - button.getBoundingClientRect().left;
            offsetY = e.clientY - button.getBoundingClientRect().top;
            button.style.cursor = 'grabbing';
            e.preventDefault(); // 防止文本选择
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            button.style.left = (e.clientX - offsetX) + 'px';
            button.style.top = (e.clientY - offsetY) + 'px';
            button.style.right = 'auto';
            button.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            button.style.cursor = 'pointer';
        });
    }

    // 处理导入逻辑
    async function handleImport() {
        try {
            // 提取漫画数据
            const comicData = extractComicData();
            const sourceURL = window.location.href;

            // 检查是否已存在相同链接的条目
            const existingPageId = await checkExistingPage(sourceURL);

            // 发送到Notion
            let result;
            if (existingPageId) {
                result = await updateNotionPage(existingPageId, comicData, sourceURL);
            } else {
                result = await createNotionPage(comicData, sourceURL);
            }

            // 显示结果
            showResult(result);
        } catch (error) {
            console.error('导入失败:', error);
            Swal.fire({
                icon: 'error',
                title: '导入失败',
                text: error.message,
                confirmButtonColor: '#2563eb',
                timer: 2000
            });
        }
    }

    // 检查是否有别名字段
    function hasAliasField() {
        const aliasLabel = document.querySelector('p:nth-of-type(1) span.detail-main-info-author-field');
        return aliasLabel?.textContent?.includes('别名');
    }

    // 从页面提取漫画数据
    function extractComicData() {
        const result = {};
        const shouldAdjust = !hasAliasField(); // 如果没有别名字段，需要调整选择器数字

        // 书名
        const titleEl = document.querySelector('h1.detail-main-info-title');
        result['书名'] = cleanText(titleEl?.textContent || "无");

        // 作者 (合并多个作者)
        const authorEls = document.querySelectorAll('.detail-main-info-value a');
        result['作者'] = Array.from(authorEls)
            .map(el => cleanText(el.textContent))
            .filter(Boolean)
            .join('，') || "无";

        // 别名
        const aliasIndex = shouldAdjust ? 0 : 1; // 如果没有别名字段，则p:nth-of-type(1)是其他字段
        const aliasEl = document.querySelector(`p:nth-of-type(${aliasIndex}) span.detail-main-info-value`);
        result['别名'] = cleanText(aliasEl?.textContent?.replace(/\n+/g, "，") || "无");

        // 更新状态 (调整数字)
        const statusIndex = shouldAdjust ? 2 : 3;
        const statusEl = document.querySelector(`p:nth-of-type(${statusIndex}) span.detail-main-info-value`);
        result['更新状态'] = cleanText(statusEl?.textContent || "状态未知");

        // 最新章节 (调整数字)
        const latestChapterIndex = shouldAdjust ? 3 : 4;
        const latestChapterEl = document.querySelector(`p:nth-of-type(${latestChapterIndex}) span.detail-main-info-value`);
        result['最新章节'] = cleanText(latestChapterEl?.textContent || "无");

        // 地区 (调整数字)
        const regionIndex = shouldAdjust ? 5 : 6;
        const regionEl = document.querySelector(`p:nth-of-type(${regionIndex}) span.detail-main-info-value`);
        result['地区'] = convertRegion(cleanText(regionEl?.textContent || "其他"));

        // 类型 (调整数字)
        const typeIndex = shouldAdjust ? 6 : 7;
        const typeEl = document.querySelector(`p:nth-of-type(${typeIndex}) span.detail-main-info-value`);
        result['类型'] = cleanText(typeEl?.textContent || "其他");

        // 简介
        const descEl = document.querySelector('p.detail-desc');
        result['简介'] = cleanText(descEl?.textContent || "无简介");

        // 封面
        const coverEl = document.querySelector('.detail-main-cover .lazy');
        result['封面'] = coverEl?.dataset?.original || coverEl?.src || "";

        // 追更 (获取最后一个active章节)
        const chapterItems = document.querySelectorAll('a.chapteritem.active');
        result['追更'] = chapterItems.length > 0
            ? cleanText(chapterItems[chapterItems.length - 1].textContent)
            : "无";

        return result;
    }

    // 检查是否已存在相同链接的条目
    async function checkExistingPage(url) {
        const query = {
            filter: {
                property: "链接",
                rich_text: {
                    equals: url
                }
            }
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://api.notion.com/v1/databases/${NOTION_CONFIG.databaseId}/query`,
                headers: {
                    "Authorization": `Bearer ${NOTION_CONFIG.apiKey}`,
                    "Content-Type": "application/json",
                    "Notion-Version": "2022-06-28"
                },
                data: JSON.stringify(query),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const data = JSON.parse(response.responseText);
                        if (data.results.length > 0) {
                            resolve(data.results[0].id);
                        } else {
                            resolve(null);
                        }
                    } else {
                        const error = JSON.parse(response.responseText);
                        reject(new Error(`${error.code || '未知错误'}: ${error.message || '查询失败'}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`查询失败: ${error.message}`));
                }
            });
        });
    }

    // 创建新Notion页面
    async function createNotionPage(comicData, sourceURL) {
        const properties = buildNotionProperties(comicData, sourceURL);
        const pageData = {
            parent: { database_id: NOTION_CONFIG.databaseId },
            properties
        };

        if (comicData.封面) {
            pageData.cover = {
                type: "external",
                external: { url: comicData.封面 }
            };
        }

        return sendNotionRequest("POST", "https://api.notion.com/v1/pages", pageData);
    }

    // 更新现有Notion页面
    async function updateNotionPage(pageId, comicData, sourceURL) {
        const properties = buildNotionProperties(comicData, sourceURL);
        const pageData = { properties };

        if (comicData.封面) {
            pageData.cover = {
                type: "external",
                external: { url: comicData.封面 }
            };
        }

        return sendNotionRequest("PATCH", `https://api.notion.com/v1/pages/${pageId}`, pageData);
    }

    // 构建Notion属性对象
    function buildNotionProperties(comicData, sourceURL) {
        return {
            "书名": {
                title: [{
                    text: {
                        content: comicData.书名
                    }
                }]
            },
            "链接": {
                rich_text: [{
                    text: {
                        content: sourceURL,
                        link: { url: sourceURL }
                    }
                }]
            },
            "简介": formatRichText(comicData.简介),
            "追更": formatRichText(comicData.追更),
            "作者": formatRichText(comicData.作者),
            "别名": formatRichText(comicData.别名),
            "最新章节": formatRichText(comicData.最新章节),
            "地区": formatSelect(comicData.地区, "pink"),
            "类型": formatSelect(comicData.类型, "pink"),
            "更新状态": formatSelect(comicData.更新状态, "default")
        };
    }

    // 发送Notion API请求
    function sendNotionRequest(method, url, data) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                headers: {
                    "Authorization": `Bearer ${NOTION_CONFIG.apiKey}`,
                    "Content-Type": "application/json",
                    "Notion-Version": "2022-06-28"
                },
                data: JSON.stringify(data),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const result = JSON.parse(response.responseText);
                        resolve({
                            success: true,
                            isUpdate: method === "PATCH",
                            title: data.properties.书名.title[0].text.content,
                            url: result.url
                        });
                    } else {
                        const error = JSON.parse(response.responseText);
                        reject(new Error(`${error.code || '未知错误'}: ${error.message || '请求失败'}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`请求失败: ${error.message}`));
                }
            });
        });
    }

    // 显示结果
    function showResult(result) {
        Swal.fire({
            icon: 'success',
            title: '导入成功',
            text: `漫画 "${result.title}" ${result.isUpdate ? '已更新' : '已添加'}`,
            confirmButtonColor: '#2563eb',
            timer: 1500,
            showConfirmButton: false
        });
    }

    // 辅助函数：清洗文本
    function cleanText(str) {
        return String(str || "")
            .replace(/[\u200B-\u200D\uFEFF]/g, '') // 移除零宽字符
            .replace(/\([^)]*\)/g, '')  // 移除 (括号内容)
            .replace(/\[[^\]]*\]/g, '') // 移除 [括号内容]
            .replace(/\{[^}]*\}/g, '')  // 移除 {括号内容}
            .trim(); // 去除头尾空格
    }

    // 辅助函数：转换地区
    function convertRegion(region) {
        const map = { "韩国": "韩漫", "日本": "日漫" };
        return map[region] || region || "其他";
    }

    // 辅助函数：格式化富文本
    function formatRichText(content) {
        return {
            rich_text: [{
                text: { content: content || "无信息" }
            }]
        };
    }

    // 辅助函数：格式化选择属性
    function formatSelect(name, color = "default") {
        return {
            select: {
                name: name || "未知",
                color: color
            }
        };
    }

    // 启动脚本
    main();
})();