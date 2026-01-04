// ==UserScript==
// @name         漫画信息导入Notion (自定义配置)
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  从manwa.me和boylove.cc提取漫画信息并一键导入Notion数据库，支持自定义网站配置
// @author       YourName
// @match        https://manwa.me/book/*
// @match        https://boylove.cc/*
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @connect      notion.com
// @connect      api.notion.com
// @downloadURL https://update.greasyfork.org/scripts/531258/%E6%BC%AB%E7%94%BB%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5Notion%20%28%E8%87%AA%E5%AE%9A%E4%B9%89%E9%85%8D%E7%BD%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531258/%E6%BC%AB%E7%94%BB%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5Notion%20%28%E8%87%AA%E5%AE%9A%E4%B9%89%E9%85%8D%E7%BD%AE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Notion配置
    const NOTION_CONFIG = {
        apiKey: "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",
        databaseId: "1a8a720b00a68033af07d33d6a1c11a1"
    };

    // 繁简转换映射表
    const TRADITIONAL_TO_SIMPLE = {
        "繁体": "繁体", "简体": "简体", "台湾": "台湾", "香港": "香港", "澳门": "澳门",
        "着": "着", "么": "么", "里": "里", "为": "为", "后": "后", "于": "于",
        "与": "与", "并": "并", "这": "这", "个": "个", "们": "们", "说": "说",
        "见": "见", "过": "过", "还": "还", "来": "来", "时": "时", "会": "会",
        "对": "对", "样": "样", "动": "动", "国": "国", "产": "产", "学": "学",
        "发": "发", "现": "现", "实": "实", "际": "际", "电": "电", "话": "话",
        "体": "体", "制": "制", "计": "计", "画": "画", "图": "图", "书": "书",
        "写": "写", "读": "读", "卖": "卖", "买": "买", "网": "网", "页": "页",
        "载": "载", "连": "连", "结": "结", "续": "续", "剧": "剧", "场": "场",
        "报": "报", "导": "导", "师": "师", "资": "资", "讯": "讯", "问": "问",
        "题": "题", "请": "请", "谢": "谢", "认": "认", "识": "识", "语": "语",
        "言": "言", "风": "风", "云": "云", "飞": "飞", "龙": "龙", "凤": "凤",
        "鸟": "鸟", "鱼": "鱼", "虫": "虫", "兽": "兽", "贝": "贝", "车": "车",
        "门": "门", "马": "马", "骨": "骨", "鬼": "鬼", "卤": "卤", "鹿": "鹿",
        "麦": "麦", "麻": "麻", "黄": "黄", "黍": "黍", "黑": "黑", "默": "默",
        "鼓": "鼓", "鼠": "鼠", "鼻": "鼻", "齐": "齐", "齿": "齿", "龟": "龟"
    };

    // 默认站点配置
    const DEFAULT_SITE_CONFIGS = {
        'manwa.me': {
            selectors: {
                简介: "p.detail-desc",
                漫画名: "h1.detail-main-info-title",
                作者: ".detail-main-info-value a",
                最新章节: "p:nth-of-type(4) span.detail-main-info-value",
                更新状态: "p:nth-of-type(3) span.detail-main-info-value",
                封面: ".detail-main-cover .lazy",
                追更: "a.chapteritem.active",
                别名: "p:nth-of-type(1) span.detail-main-info-value",
                地区: "p:nth-of-type(6) span.detail-main-info-value",
                类型: "p:nth-of-type(7) span.detail-main-info-value"
            },
            mergeKeys: ["作者"],
            adjustSelectors: function() {
                const hasAlias = document.querySelector('p:nth-of-type(1) span.detail-main-info-author-field')?.textContent?.includes('别名');
                return !hasAlias;
            }
        },
        'boylove.cc': {
            selectors: {
                简介: "p.book-desc",
                漫画名: "p.book-title",
                作者: ".info a",
                最新章节: "li:nth-of-type(6) span",
                更新状态: ".pl-0 li:nth-of-type(2)",
                封面: "div.cover img",
                追更: ".seen",
                类型: "", // 固定为BL
                地区: ".tag span", // 需要特殊处理
                别名: "" // boylove.cc没有别名字段
            },
            mergeKeys: ["作者"],
            adjustSelectors: function() { return false; }
        }
    };

    // 主函数
    async function main() {
        try {
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                await addButtons();
            } else {
                document.addEventListener('DOMContentLoaded', async () => {
                    await addButtons();
                });
                setTimeout(async () => {
                    if (!document.getElementById('notion-import-btn-container')) {
                        await addButtons();
                    }
                }, 2000);
            }
        } catch (error) {
            console.error('初始化失败:', error);
            showError('脚本初始化失败: ' + error.message);
        }
    }

    // 添加按钮函数
    async function addButtons() {
        if (document.getElementById('notion-import-btn-container')) return;

        const customConfigs = loadCustomConfigs();
        const allConfigs = {...DEFAULT_SITE_CONFIGS, ...customConfigs};
        const currentHost = window.location.hostname;
        const hasConfig = Object.keys(allConfigs).some(host => currentHost.includes(host));

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'notion-import-btn-container';
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.bottom = '100px';
        buttonContainer.style.right = '30px';
        buttonContainer.style.zIndex = '9999';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.alignItems = 'flex-end';

        // 主导入按钮
        const importButton = document.createElement('div');
        importButton.id = 'import-to-notion-btn';
        importButton.style.width = '40px';
        importButton.style.height = '40px';
        importButton.style.borderRadius = '50%';
        importButton.style.backgroundColor = hasConfig ? 'rgba(255, 255, 255, 0.7)' : 'rgba(250, 152, 190, 1)';
        importButton.style.border = '0px solid rgba(0, 0, 0, 0.3)';
        importButton.style.cursor = 'pointer';
        importButton.style.display = 'flex';
        importButton.style.justifyContent = 'center';
        importButton.style.alignItems = 'center';
        importButton.style.userSelect = 'none';
        importButton.title = hasConfig ? '导入到Notion' : '配置网站规则';
        importButton.style.color = 'white';

        const icon = document.createElement('span');
        icon.textContent = '+';
        icon.style.fontSize = '18px';
        importButton.appendChild(icon);

        importButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
                if (hasConfig) {
                    await handleImport();
                } else {
                    showConfigDialog();
                }
            } catch (error) {
                console.error('按钮点击处理失败:', error);
                showError('操作失败: ' + error.message);
            }
        });

        // 配置按钮
        const configButton = document.createElement('div');
        configButton.id = 'config-site-btn';
        configButton.style.width = '30px';
        configButton.style.height = '30px';
        configButton.style.borderRadius = '50%';
        configButton.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        configButton.style.border = '0.5px solid rgba(0, 0, 0, 0.2)';
        configButton.style.cursor = 'pointer';
        configButton.style.display = 'flex';
        configButton.style.justifyContent = 'center';
        configButton.style.alignItems = 'center';
        configButton.title = '配置网站规则';

        const configIcon = document.createElement('span');
        configIcon.textContent = '';
        configIcon.style.fontSize = '10px';
        configButton.appendChild(configIcon);

        configButton.addEventListener('click', (e) => {
            e.stopPropagation();
            try {
                showConfigDialog();
            } catch (error) {
                console.error('配置按钮点击失败:', error);
                showError('打开配置失败: ' + error.message);
            }
        });

        buttonContainer.appendChild(importButton);
        buttonContainer.appendChild(configButton);
        document.body.appendChild(buttonContainer);

        makeButtonDraggable(buttonContainer);
    }

    // 加载用户自定义配置
    function loadCustomConfigs() {
        const customConfigs = {};
        const savedConfigs = GM_listValues().filter(key => key.startsWith('site_config_'));

        savedConfigs.forEach(key => {
            const host = key.replace('site_config_', '');
            try {
                customConfigs[host] = GM_getValue(key);
            } catch (error) {
                console.error(`加载配置 ${key} 失败:`, error);
            }
        });

        return customConfigs;
    }

    // 保存用户自定义配置
    function saveCustomConfig(host, config) {
        try {
            GM_setValue(`site_config_${host}`, config);
            return true;
        } catch (error) {
            console.error('保存配置失败:', error);
            showError('保存配置失败: ' + error.message);
            return false;
        }
    }

    // 删除用户自定义配置
    function deleteCustomConfig(host) {
        try {
            GM_deleteValue(`site_config_${host}`);
            return true;
        } catch (error) {
            console.error('删除配置失败:', error);
            showError('删除配置失败: ' + error.message);
            return false;
        }
    }

    // 显示配置对话框
    function showConfigDialog() {
        const currentHost = window.location.hostname;
        const customConfigs = loadCustomConfigs();
        const existingConfig = customConfigs[currentHost] || DEFAULT_SITE_CONFIGS[currentHost] || {
            selectors: {
                简介: "", 漫画名: "", 作者: "", 最新章节: "", 更新状态: "",
                封面: "", 追更: "", 别名: "", 地区: "", 类型: ""
            },
            mergeKeys: [],
            adjustSelectors: function() { return false; }
        };

        // 创建配置表单
        const form = document.createElement('div');
        form.style.maxHeight = '70vh';
        form.style.overflowY = 'auto';
        form.style.padding = '10px';

        const info = document.createElement('p');
        info.textContent = '为当前网站配置CSS选择器来提取漫画信息:';
        info.style.marginBottom = '15px';
        info.style.fontSize = '14px';
        form.appendChild(info);

        const fields = [
            '漫画名', '作者', '简介', '最新章节', '更新状态',
            '封面', '追更', '别名', '地区', '类型'
        ];

        fields.forEach(field => {
            const fieldContainer = document.createElement('div');
            fieldContainer.style.marginBottom = '10px';

            const label = document.createElement('label');
            label.textContent = field;
            label.style.display = 'block';
            label.style.marginBottom = '5px';
            label.style.fontSize = '13px';
            label.style.fontWeight = 'bold';

            const input = document.createElement('input');
            input.type = 'text';
            input.value = existingConfig.selectors[field] || '';
            input.style.width = '100%';
            input.style.padding = '5px';
            input.style.border = '1px solid #ddd';
            input.style.borderRadius = '3px';
            input.dataset.field = field;
            input.placeholder = '留空表示不提取此字段';

            const testButton = document.createElement('button');
            testButton.textContent = '测试';
            testButton.style.marginLeft = '5px';
            testButton.style.marginTop = '5px';
            testButton.style.padding = '3px 8px';
            testButton.style.fontSize = '12px';
            testButton.style.backgroundColor = '#f0f0f0';
            testButton.style.border = '1px solid #ccc';
            testButton.style.borderRadius = '3px';
            testButton.style.cursor = 'pointer';

            testButton.addEventListener('click', () => {
                const selector = input.value;

                document.querySelectorAll('.selector-highlight').forEach(el => {
                    el.classList.remove('selector-highlight');
                    el.style.outline = '';
                });

                if (!selector) {
                    showNotification('选择器为空，此字段将留空', 'info');
                    return;
                }

                try {
                    const elements = document.querySelectorAll(selector);
                    if (elements.length > 0) {
                        elements.forEach(el => {
                            el.classList.add('selector-highlight');
                            el.style.outline = '2px solid #ff72a6';
                            el.style.outlineOffset = '2px';

                            setTimeout(() => {
                                if (el.classList.contains('selector-highlight')) {
                                    el.classList.remove('selector-highlight');
                                    el.style.outline = '';
                                }
                            }, 3000);
                        });

                        const firstElement = elements[0];
                        const textContent = firstElement.textContent.trim().substring(0, 50) +
                            (firstElement.textContent.trim().length > 50 ? '...' : '');
                        showNotification(`找到 ${elements.length} 个匹配元素。第一个元素内容: "${textContent}"`, 'success');
                    } else {
                        showNotification('没有找到匹配的元素', 'error');
                    }
                } catch (error) {
                    showNotification('选择器无效: ' + error.message, 'error');
                }
            });

            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);
            fieldContainer.appendChild(testButton);
            form.appendChild(fieldContainer);
        });

        // 添加合并字段配置
        const mergeContainer = document.createElement('div');
        mergeContainer.style.marginBottom = '15px';

        const mergeLabel = document.createElement('label');
        mergeLabel.textContent = '需要合并的字段（多个作者等，用逗号分隔）';
        mergeLabel.style.display = 'block';
        mergeLabel.style.marginBottom = '5px';
        mergeLabel.style.fontSize = '13px';
        mergeLabel.style.fontWeight = 'bold';

        const mergeInput = document.createElement('input');
        mergeInput.type = 'text';
        mergeInput.value = existingConfig.mergeKeys?.join(', ') || '';
        mergeInput.style.width = '100%';
        mergeInput.style.padding = '5px';
        mergeInput.style.border = '1px solid #ddd';
        mergeInput.style.borderRadius = '3px';

        mergeContainer.appendChild(mergeLabel);
        mergeContainer.appendChild(mergeInput);
        form.appendChild(mergeContainer);

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '15px';

        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存配置';
        saveButton.style.padding = '8px 15px';
        saveButton.style.backgroundColor = '#ff72a6';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';

        saveButton.addEventListener('click', () => {
            const newConfig = {
                selectors: {},
                mergeKeys: mergeInput.value.split(',').map(item => item.trim()).filter(Boolean),
                adjustSelectors: function() { return false; }
            };

            fields.forEach(field => {
                const input = form.querySelector(`input[data-field="${field}"]`);
                newConfig.selectors[field] = input.value.trim();
            });

            if (saveCustomConfig(currentHost, newConfig)) {
                showNotification('配置已保存！', 'success');

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });

        // 删除按钮（如果有自定义配置）
        if (customConfigs[currentHost]) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '删除配置';
            deleteButton.style.padding = '8px 15px';
            deleteButton.style.backgroundColor = '#f44336';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '4px';
            deleteButton.style.cursor = 'pointer';

            deleteButton.addEventListener('click', () => {
                if (deleteCustomConfig(currentHost)) {
                    showNotification('配置已删除！', 'success');

                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
            });

            buttonContainer.appendChild(deleteButton);
        }

        // 取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.padding = '8px 15px';
        cancelButton.style.backgroundColor = '#e0e0e0';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';

        cancelButton.addEventListener('click', () => {
            document.getElementById('config-dialog')?.remove();
        });

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(saveButton);
        form.appendChild(buttonContainer);

        // 创建对话框容器
        const dialog = document.createElement('div');
        dialog.id = 'config-dialog';
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = 'white';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        dialog.style.zIndex = '10000';
        dialog.style.width = '90%';
        dialog.style.maxWidth = '500px';
        dialog.style.maxHeight = '90vh';
        dialog.style.overflow = 'hidden';
        dialog.style.display = 'flex';
        dialog.style.flexDirection = 'column';

        // 添加标题栏（用于拖动）
        const titleBar = document.createElement('div');
        titleBar.textContent = `配置 ${currentHost} 的抓取规则`;
        titleBar.style.marginTop = '0';
        titleBar.style.marginBottom = '15px';
        titleBar.style.color = '#333';
        titleBar.style.fontWeight = 'bold';
        titleBar.style.cursor = 'move';
        titleBar.style.padding = '5px 0';
        titleBar.style.userSelect = 'none';

        dialog.appendChild(titleBar);
        dialog.appendChild(form);

        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '0';
        closeButton.style.width = '30px';
        closeButton.style.height = '30px';

        closeButton.addEventListener('click', () => {
            dialog.remove();
        });

        dialog.appendChild(closeButton);
        document.body.appendChild(dialog);

        // 使对话框可拖动
        makeDialogDraggable(dialog, titleBar);

        dialog.addEventListener('click', (e) => e.stopPropagation());
    }

    // 使对话框可拖动
    function makeDialogDraggable(dialog, handle) {
        let isDragging = false;
        let offsetX, offsetY;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - dialog.getBoundingClientRect().left;
            offsetY = e.clientY - dialog.getBoundingClientRect().top;
            dialog.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            dialog.style.left = (e.clientX - offsetX) + 'px';
            dialog.style.top = (e.clientY - offsetY) + 'px';
            dialog.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            dialog.style.cursor = '';
        });
    }

    // 使按钮可拖动
    function makeButtonDraggable(container) {
        if (!container) return;

        let isDragging = false;
        let offsetX, offsetY;

        container.addEventListener('mousedown', (e) => {
            if (e.target.id === 'import-to-notion-btn' || e.target.id === 'config-site-btn' ||
                e.target.tagName === 'SPAN' || e.target.parentElement.id === 'import-to-notion-btn' ||
                e.target.parentElement.id === 'config-site-btn') {
                return;
            }

            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
            container.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            container.style.left = (e.clientX - offsetX) + 'px';
            container.style.top = (e.clientY - offsetY) + 'px';
            container.style.right = 'auto';
            container.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = '';
        });
    }

    // 获取当前站点配置
    function getSiteConfig() {
        const hostname = window.location.hostname;
        const customConfigs = loadCustomConfigs();

        for (const host in customConfigs) {
            if (hostname.includes(host)) {
                return customConfigs[host];
            }
        }

        if (hostname.includes('boylove.cc')) {
            return DEFAULT_SITE_CONFIGS['boylove.cc'];
        }
        if (hostname.includes('manwa.me')) {
            return DEFAULT_SITE_CONFIGS['manwa.me'];
        }

        return {
            selectors: {},
            mergeKeys: [],
            adjustSelectors: function() { return false; }
        };
    }

    // 处理导入逻辑
    async function handleImport() {
        try {
            const comicData = extractComicData();
            const sourceURL = window.location.href;

            const existingPageId = await checkExistingPage(sourceURL);

            let result;
            if (existingPageId) {
                result = await updateNotionPage(existingPageId, comicData, sourceURL);
            } else {
                result = await createNotionPage(comicData, sourceURL);
            }

            showResult(result);
        } catch (error) {
            console.error('导入失败:', error);
            showError(error.message);
        }
    }

    // 繁简转换函数
    function convertToSimplified(text) {
        if (!text) return text;
        let result = text;
        for (const [traditional, simple] of Object.entries(TRADITIONAL_TO_SIMPLE)) {
            result = result.replace(new RegExp(traditional, 'g'), simple);
        }
        return result;
    }

    // 标准化更新状态
    function normalizeStatus(status) {
        if (!status) return status;
        if (/连载|连载|更新中|连更|连更/i.test(status)) return "连载中";
        if (/完结|完结|已完|已完结|完更/i.test(status)) return "已完结";
        return status;
    }

    // 从页面提取漫画数据
    function extractComicData() {
        const siteConfig = getSiteConfig();
        const result = {};
        const shouldAdjust = siteConfig.adjustSelectors ? siteConfig.adjustSelectors() : false;

        // 漫画名 (移除所有括号内容)
        if (siteConfig.selectors['漫画名']) {
            const titleEl = document.querySelector(siteConfig.selectors['漫画名']);
            result['漫画名'] = convertToSimplified(cleanTitle(titleEl?.textContent || ""));
        } else {
            result['漫画名'] = "";
        }

        // 作者 (合并多个作者)
        if (siteConfig.selectors['作者']) {
            const authorEls = document.querySelectorAll(siteConfig.selectors['作者']);
            result['作者'] = convertToSimplified(Array.from(authorEls)
                .map(el => cleanText(el.textContent))
                .filter(Boolean)
                .join('，') || "");
        } else {
            result['作者'] = "";
        }

        // 简介
        if (siteConfig.selectors['简介']) {
            const descEl = document.querySelector(siteConfig.selectors['简介']);
            result['简介'] = convertToSimplified(cleanText(descEl?.textContent || ""));
        } else {
            result['简介'] = "";
        }

        // 封面
        if (siteConfig.selectors['封面']) {
            const coverEl = document.querySelector(siteConfig.selectors['封面']);
            result['封面'] = coverEl?.dataset?.original ||
                            coverEl?.dataset?.src ||
                            coverEl?.src ||
                            coverEl?.getAttribute('data-original') ||
                            coverEl?.getAttribute('data-src') ||
                            "";

            // 如果是相对路径，转换为绝对路径
            if (result['封面'] && !result['封面'].startsWith('http')) {
                result['封面'] = new URL(result['封面'], window.location.href).href;
            }
        } else {
            result['封面'] = "";
        }

        // 追更 (获取最后一个匹配项)
        if (siteConfig.selectors['追更']) {
            const chapterItems = document.querySelectorAll(siteConfig.selectors['追更']);
            result['追更'] = convertToSimplified(chapterItems.length > 0
                ? cleanText(chapterItems[chapterItems.length - 1].textContent)
                : "");
        } else {
            result['追更'] = "";
        }

        // 特殊处理boylove.cc的字段
        if (window.location.hostname.includes('boylove.cc')) {
            // 类型固定为BL
            result['类型'] = "BL";

            // 地区从标签中检测
            if (siteConfig.selectors['地区']) {
                const tagEls = document.querySelectorAll(siteConfig.selectors['地区']);
                const tags = Array.from(tagEls).map(el => convertToSimplified(el.textContent.trim()));
                result['地区'] = "";
                if (tags.includes("韩漫")) result['地区'] = "韩漫";
                else if (tags.includes("日漫")) result['地区'] = "日漫";
                else if (tags.includes("国漫")) result['地区'] = "国漫";
            } else {
                result['地区'] = "";
            }

            // 最新章节
            if (siteConfig.selectors['最新章节']) {
                const latestChapterEl = document.querySelector(siteConfig.selectors['最新章节']);
                result['最新章节'] = convertToSimplified(cleanText(latestChapterEl?.textContent || ""));
            } else {
                result['最新章节'] = "";
            }

            // 更新状态
            if (siteConfig.selectors['更新状态']) {
                const statusEl = document.querySelector(siteConfig.selectors['更新状态']);
                result['更新状态'] = normalizeStatus(convertToSimplified(cleanText(statusEl?.textContent || "")));
            } else {
                result['更新状态'] = "";
            }

            // boylove.cc没有别名字段
            result['别名'] = "";
        }
        // 处理manwa.me的字段
        else if (window.location.hostname.includes('manwa.me')) {
            // 别名
            const aliasIndex = shouldAdjust ? 0 : 1;
            const aliasSelector = `p:nth-of-type(${aliasIndex}) span.detail-main-info-value`;
            if (siteConfig.selectors['别名'] || aliasSelector) {
                const aliasEl = document.querySelector(siteConfig.selectors['别名'] || aliasSelector);
                result['别名'] = convertToSimplified(cleanText(aliasEl?.textContent?.replace(/\n+/g, "，") || ""));
            } else {
                result['别名'] = "";
            }

            // 更新状态
            const statusIndex = shouldAdjust ? 2 : 3;
            const statusSelector = `p:nth-of-type(${statusIndex}) span.detail-main-info-value`;
            if (siteConfig.selectors['更新状态'] || statusSelector) {
                const statusEl = document.querySelector(siteConfig.selectors['更新状态'] || statusSelector);
                result['更新状态'] = normalizeStatus(convertToSimplified(cleanText(statusEl?.textContent || "")));
            } else {
                result['更新状态'] = "";
            }

            // 最新章节
            const latestChapterIndex = shouldAdjust ? 3 : 4;
            const latestChapterSelector = `p:nth-of-type(${latestChapterIndex}) span.detail-main-info-value`;
            if (siteConfig.selectors['最新章节'] || latestChapterSelector) {
                const latestChapterEl = document.querySelector(siteConfig.selectors['最新章节'] || latestChapterSelector);
                result['最新章节'] = convertToSimplified(cleanText(latestChapterEl?.textContent || ""));
            } else {
                result['最新章节'] = "";
            }

            // 地区
            const regionIndex = shouldAdjust ? 5 : 6;
            const regionSelector = `p:nth-of-type(${regionIndex}) span.detail-main-info-value`;
            if (siteConfig.selectors['地区'] || regionSelector) {
                const regionEl = document.querySelector(siteConfig.selectors['地区'] || regionSelector);
                result['地区'] = convertRegion(convertToSimplified(cleanText(regionEl?.textContent || "")));
            } else {
                result['地区'] = "";
            }

            // 类型
            const typeIndex = shouldAdjust ? 6 : 7;
            const typeSelector = `p:nth-of-type(${typeIndex}) span.detail-main-info-value`;
            if (siteConfig.selectors['类型'] || typeSelector) {
                const typeEl = document.querySelector(siteConfig.selectors['类型'] || typeSelector);
                result['类型'] = convertToSimplified(cleanText(typeEl?.textContent || ""));
            } else {
                result['类型'] = "";
            }
        }
        // 处理自定义网站的字段
        else {
            // 别名
            if (siteConfig.selectors['别名']) {
                const aliasEl = document.querySelector(siteConfig.selectors['别名']);
                result['别名'] = convertToSimplified(cleanText(aliasEl?.textContent || ""));
            } else {
                result['别名'] = "";
            }

            // 更新状态
            if (siteConfig.selectors['更新状态']) {
                const statusEl = document.querySelector(siteConfig.selectors['更新状态']);
                result['更新状态'] = normalizeStatus(convertToSimplified(cleanText(statusEl?.textContent || "")));
            } else {
                result['更新状态'] = "";
            }

            // 最新章节
            if (siteConfig.selectors['最新章节']) {
                const latestChapterEl = document.querySelector(siteConfig.selectors['最新章节']);
                result['最新章节'] = convertToSimplified(cleanText(latestChapterEl?.textContent || ""));
            } else {
                result['最新章节'] = "";
            }

            // 地区
            if (siteConfig.selectors['地区']) {
                const regionEl = document.querySelector(siteConfig.selectors['地区']);
                result['地区'] = convertRegion(convertToSimplified(cleanText(regionEl?.textContent || "")));
            } else {
                result['地区'] = "";
            }

            // 类型
            if (siteConfig.selectors['类型']) {
                const typeEl = document.querySelector(siteConfig.selectors['类型']);
                result['类型'] = convertToSimplified(cleanText(typeEl?.textContent || ""));
            } else {
                result['类型'] = "";
            }
        }

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
            "漫画名": {
                title: [{
                    text: {
                        content: comicData.漫画名 || "未命名漫画"
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
                            title: data.properties.漫画名.title[0].text.content,
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

    // 显示通知
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = type === 'success' ? '#4caf50' :
                                          type === 'error' ? '#f44336' : '#2196F3';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '10000';
        notification.style.animation = 'fadeIn 0.3s';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, 3000);

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(20px); }
            }
            .selector-highlight {
                transition: outline 0.2s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // 显示结果
    function showResult(result) {
        const existingNotification = document.getElementById('import-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'import-notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        notification.style.color = 'rgba(0, 0, 0, 0.8)';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '8px';
        notification.style.zIndex = '10000';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.transition = 'opacity 0.3s ease';
        notification.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        notification.style.maxWidth = '300px';
        notification.style.wordBreak = 'break-word';
        notification.style.border = '1px solid rgba(0, 0, 0, 0.1)';
        notification.style.fontFamily = 'system-ui, -apple-system, sans-serif';

        const icon = document.createElement('span');
        icon.innerHTML = '✓';
        icon.style.marginRight = '10px';
        icon.style.fontSize = '18px';
        icon.style.color = '#ff72a6';
        icon.style.fontWeight = 'bold';
        notification.appendChild(icon);

        const text = document.createElement('span');
        text.textContent = `"${result.title}" ${result.isUpdate ? '已更新' : '已添加'}`;
        text.style.fontSize = '14px';
        notification.appendChild(text);

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // 显示错误
    function showError(message) {
        const existingNotification = document.getElementById('import-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'import-notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        notification.style.color = 'rgba(0, 0, 0, 0.8)';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '8px';
        notification.style.zIndex = '10000';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.transition = 'opacity 0.3s ease';
        notification.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        notification.style.maxWidth = '300px';
        notification.style.wordBreak = 'break-word';
        notification.style.border = '1px solid rgba(0, 0, 0, 0.1)';
        notification.style.fontFamily = 'system-ui, -apple-system, sans-serif';

        const icon = document.createElement('span');
        icon.innerHTML = '✗';
        icon.style.marginRight = '10px';
        icon.style.fontSize = '18px';
        icon.style.color = '#ffc4da';
        icon.style.fontWeight = 'bold';
        notification.appendChild(icon);

        const text = document.createElement('span');
        text.textContent = `导入失败: ${message}`;
        text.style.fontSize = '14px';
        notification.appendChild(text);

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // 辅助函数：清洗标题(移除所有括号内容)
    function cleanTitle(str) {
        return String(str || "")
            .replace(/\([^)]*\)/g, '')  // 移除 (括号内容)
            .replace(/\[[^\]]*\]/g, '') // 移除 [括号内容]
            .replace(/\{[^}]*\}/g, '')  // 移除 {括号内容}
            .replace(/（[^）]*）/g, '')  // 移除 （中文括号内容）
            .replace(/【[^】]*】/g, '')  // 移除 【中文括号内容】
            .trim();
    }

    // 辅助函数：清洗文本
    function cleanText(str) {
        return String(str || "")
            .replace(/[\u200B-\u200D\uFEFF]/g, '') // 移除零宽字符
            .trim();
    }

    // 辅助函数：转换地区
    function convertRegion(region) {
        const map = { "韩国": "韩漫", "日本": "日漫", "中国": "国漫" };
        return map[region] || region || "";
    }

    // 辅助函数：格式化富文本
    function formatRichText(content) {
        return content ? {
            rich_text: [{
                text: { content: content }
            }]
        } : {
            rich_text: []
        };
    }

    // 辅助函数：格式化选择属性
    function formatSelect(name, color = "default") {
        return name ? {
            select: {
                name: name,
                color: color
            }
        } : {
            select: null
        };
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();