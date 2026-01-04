// ==UserScript==
// @name         t66y.com 屏蔽关键词、作者，高亮显示喜爱的关键词
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  屏蔽关键词、作者，高亮显示喜爱的关键词
// @author       橘子🍊
// @match        *://t66y.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_download
// @license      GPL-3.0
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/531892/t66ycom%20%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D%E3%80%81%E4%BD%9C%E8%80%85%EF%BC%8C%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E5%96%9C%E7%88%B1%E7%9A%84%E5%85%B3%E9%94%AE%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/531892/t66ycom%20%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D%E3%80%81%E4%BD%9C%E8%80%85%EF%BC%8C%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E5%96%9C%E7%88%B1%E7%9A%84%E5%85%B3%E9%94%AE%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const defaultConfig = {
        localKeywords: [],
        localAuthors: [],
        highlightKeywords: [],
        subscriptions: [
            {
                name: "示例关键词订阅",
                url: "",
                type: "keywords",
                enabled: true,
                updateInterval: 24
            },
            {
                name: "示例作者订阅",
                url: "",
                type: "authors",
                enabled: true,
                updateInterval: 24
            }
        ],
        lastUpdated: 0
    };

    // 加载配置
    let config = GM_getValue('config', JSON.parse(JSON.stringify(defaultConfig)));

    // 获取去重后的合并列表（不区分大小写）
    function getMergedKeywords() {
        const allKeywords = [...config.localKeywords, ...getAllRemoteKeywords()];
        const uniqueKeywords = [];
        const seen = new Set();

        for (const keyword of allKeywords) {
            const lowerKeyword = keyword.toLowerCase();
            if (!seen.has(lowerKeyword)) {
                seen.add(lowerKeyword);
                uniqueKeywords.push(keyword);
            }
        }

        return uniqueKeywords;
    }

    function getMergedAuthors() {
        const allAuthors = [...config.localAuthors, ...getAllRemoteAuthors()];
        const uniqueAuthors = [];
        const seen = new Set();

        for (const author of allAuthors) {
            const lowerAuthor = author.toLowerCase();
            if (!seen.has(lowerAuthor)) {
                seen.add(lowerAuthor);
                uniqueAuthors.push(author);
            }
        }

        return uniqueAuthors;
    }

    let mergedKeywords = getMergedKeywords();
    let mergedAuthors = getMergedAuthors();

    // 初始化菜单
    function initMenu() {
        GM_registerMenuCommand('📝 编辑完整配置', showConfigEditor);
        GM_registerMenuCommand('🔍 查看当前订阅', showCurrentLists);
        GM_registerMenuCommand('🔄 立即更新订阅', fetchAllRemoteLists);
        GM_registerMenuCommand('⚙️ 本地屏蔽关键词设置', () => editList('localKeywords', '本地屏蔽关键词'));
        GM_registerMenuCommand('⚙️ 本地屏蔽作者设置', () => editList('localAuthors', '本地屏蔽作者'));
        GM_registerMenuCommand('❤️ 本地高亮关键词设置', () => editList('highlightKeywords', '高亮关键词'));
        GM_registerMenuCommand('📥 导出配置', exportConfig);
        GM_registerMenuCommand('📤 导入配置', importConfig);
        GM_registerMenuCommand('⭕ 重置为默认配置', resetConfig);
    }

    // 获取所有远程关键词
    function getAllRemoteKeywords() {
        return config.subscriptions
            .filter(sub => sub.enabled && sub.type === 'keywords' && sub.data)
            .flatMap(sub => sub.data);
    }

    // 获取所有远程作者
    function getAllRemoteAuthors() {
        return config.subscriptions
            .filter(sub => sub.enabled && sub.type === 'authors' && sub.data)
            .flatMap(sub => sub.data);
    }

    // 显示配置编辑器
    function showConfigEditor() {
        const editor = document.createElement('div');
        editor.style.position = 'fixed';
        editor.style.top = '50px';
        editor.style.left = '50px';
        editor.style.right = '50px';
        editor.style.bottom = '50px';
        editor.style.backgroundColor = 'white';
        editor.style.zIndex = '9999';
        editor.style.padding = '20px';
        editor.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
        editor.style.overflow = 'auto';

        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = '80%';
        textarea.style.fontFamily = 'monospace';
        textarea.value = JSON.stringify(config, null, 4);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.textAlign = 'center';

        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.onclick = () => {
            try {
                const newConfig = JSON.parse(textarea.value);
                config = newConfig;
                GM_setValue('config', config);
                updateMergedLists();
                editor.remove();
                GM_notification({
                    title: '配置已保存',
                    text: '配置已成功更新并应用',
                    timeout: 3000
                });
                location.reload();
            } catch (e) {
                alert('配置格式错误: ' + e.message);
            }
        };

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.marginLeft = '10px';
        cancelButton.onclick = () => editor.remove();

        const testButton = document.createElement('button');
        testButton.textContent = '测试格式';
        testButton.style.marginLeft = '10px';
        testButton.onclick = () => {
            try {
                JSON.parse(textarea.value);
                alert('配置格式正确');
            } catch (e) {
                alert('配置格式错误: ' + e.message);
            }
        };

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(testButton);

        editor.appendChild(textarea);
        editor.appendChild(buttonContainer);

        document.body.appendChild(editor);
    }

    // 编辑简单列表
    function editList(key, name) {
        const current = config[key].join(', ');
        const newList = prompt(`请输入${name}，用逗号分隔:`, current);
        if (newList !== null) {
            config[key] = newList.split(',').map(item => item.trim()).filter(item => item);
            GM_setValue('config', config);
            updateMergedLists();
            location.reload();
        }
    }

    // 更新合并后的列表
    function updateMergedLists() {
        mergedKeywords = getMergedKeywords();
        mergedAuthors = getMergedAuthors();
    }

    // 显示当前列表
    function showCurrentLists() {
        const message = [
            '=== 当前配置 ===',
            `最后更新时间: ${new Date(config.lastUpdated).toLocaleString()}`,
            '',
            '=== 订阅列表 ===',
            ...config.subscriptions.map((sub, i) =>
                `${i+1}. ${sub.name} (${sub.type}) - ${sub.enabled ? '✅' : '❌'} - 每${sub.updateInterval}小时`
            )
        ].join('\n');

        alert(message);
    }

    // 获取所有远程列表
    function fetchAllRemoteLists() {
        const now = Date.now();
        let completed = 0;
        const total = config.subscriptions.filter(sub => sub.enabled && sub.url).length;
        let hasUpdates = false;

        if (total === 0) {
            GM_notification({
                title: '无有效订阅',
                text: '没有启用或配置URL的订阅',
                timeout: 3000
            });
            return;
        }

        config.subscriptions.forEach((sub, index) => {
            if (!sub.enabled || !sub.url) {
                completed++;
                checkCompletion();
                return;
            }

            // 处理GitHub URL - 转换为raw.githubusercontent.com
            let fetchUrl = sub.url;
            if (fetchUrl.includes('github.com') && !fetchUrl.includes('raw.githubusercontent.com')) {
                fetchUrl = fetchUrl.replace('github.com', 'raw.githubusercontent.com')
                                  .replace('/blob/', '/');
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: fetchUrl,
                onload: function(response) {
                    try {
                        const content = response.responseText;

                        // 检查是否是HTML内容（错误响应）
                        if (content.trim().startsWith('<!DOCTYPE html>') ||
                            content.trim().startsWith('<html') ||
                            content.includes('<head>')) {
                            throw new Error('获取到HTML内容而不是纯文本，请检查URL是否正确');
                        }

                        let data = content.split('\n')
                            .map(line => line.trim())
                            .filter(line => line && !line.startsWith('#'));

                        if (data.length > 0) {
                            config.subscriptions[index].data = data;
                            config.subscriptions[index].lastFetched = now;
                            hasUpdates = true;
                            GM_notification({
                                title: `订阅更新成功: ${sub.name}`,
                                text: `成功更新 ${data.length} 条数据`,
                                timeout: 3000
                            });
                        }
                    } catch (e) {
                        console.error(`处理订阅 ${sub.name} 失败:`, e);
                        GM_notification({
                            title: `订阅处理失败: ${sub.name}`,
                            text: `错误: ${e.message}\n将保持原有数据不变`,
                            timeout: 5000
                        });
                    } finally {
                        completed++;
                        checkCompletion();
                    }
                },
                onerror: function(error) {
                    console.error(`获取订阅 ${sub.name} 失败:`, error);
                    GM_notification({
                        title: `订阅更新失败: ${sub.name}`,
                        text: `网络错误: ${error.statusText}\n将保持原有数据不变`,
                        timeout: 5000
                    });
                    completed++;
                    checkCompletion();
                }
            });
        });

        function checkCompletion() {
            if (completed === total) {
                if (hasUpdates) {
                    config.lastUpdated = now;
                    GM_setValue('config', config);
                    updateMergedLists();
                }
                GM_notification({
                    title: '订阅更新完成',
                    text: `已完成 ${completed} 个订阅源的处理`,
                    timeout: 5000
                });
                location.reload();
            }
        }
    }

    // 自动检查更新
    function checkAutoUpdate() {
        const now = Date.now();
        const needsUpdate = config.subscriptions.some(sub =>
            sub.enabled && sub.url &&
            (!sub.lastFetched || (now - sub.lastFetched) > sub.updateInterval * 3600000)
        );

        if (needsUpdate) {
            if (confirm('检测到订阅需要更新，是否立即更新？')) {
                fetchAllRemoteLists();
            }
        }
    }

    // 导出配置
    function exportConfig() {
        const configStr = JSON.stringify(config, null, 2);
        const blob = new Blob([configStr], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        GM_download({
            url: url,
            name: 't66y_filter_config.json',
            saveAs: true,
            onload: () => URL.revokeObjectURL(url)
        });
    }

    // 导入配置
    function importConfig() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const newConfig = JSON.parse(event.target.result);
                    if (confirm('确定要导入此配置吗？当前配置将被覆盖。')) {
                        config = newConfig;
                        GM_setValue('config', config);
                        updateMergedLists();
                        GM_notification({
                            title: '导入成功',
                            text: '配置已成功导入',
                            timeout: 3000
                        });
                        location.reload();
                    }
                } catch (e) {
                    alert('配置文件解析错误: ' + e.message);
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    // 重置配置
    function resetConfig() {
        if (confirm('确定要重置为默认配置吗？所有当前设置将丢失。')) {
            config = JSON.parse(JSON.stringify(defaultConfig));
            GM_setValue('config', config);
            updateMergedLists();
            GM_notification({
                title: '重置成功',
                text: '已恢复为默认配置',
                timeout: 3000
            });
            location.reload();
        }
    }

    // 高亮标题中的关键词
    function highlightTitle(titleElement) {
        if (!titleElement || config.highlightKeywords.length === 0) return;

        const originalText = titleElement.textContent;
        let newHTML = originalText;
        const lowerOriginal = originalText.toLowerCase();

        config.highlightKeywords.forEach(keyword => {
            const lowerKeyword = keyword.toLowerCase();
            let index = lowerOriginal.indexOf(lowerKeyword);

            while (index !== -1) {
                const matchedText = originalText.substr(index, keyword.length);
                newHTML = newHTML.replace(
                    matchedText,
                    `<span style="background-color: yellow; font-weight: bold;">${matchedText}</span>`
                );
                index = lowerOriginal.indexOf(lowerKeyword, index + keyword.length);
            }
        });

        if (newHTML !== originalText) {
            titleElement.innerHTML = newHTML;
        }
    }

    // 处理帖子屏蔽和高亮
    function processPosts() {
        const posts = document.querySelectorAll('tr.tr3.t_one.tac');

        posts.forEach(post => {
            const titleElement = post.querySelector('td:nth-child(2) h3 a, th:nth-child(2) h3 a');
            const authorElement = post.querySelector('td:nth-child(5) a, td:nth-child(3) a');

            let shouldBlock = false;

            // 检查标题关键词
            if (titleElement) {
                const title = titleElement.textContent.toLowerCase();
                shouldBlock = mergedKeywords.some(keyword =>
                    title.includes(keyword.toLowerCase())
                );
            }

            // 检查作者
            if (!shouldBlock && authorElement) {
                const author = authorElement.textContent.toLowerCase();
                shouldBlock = mergedAuthors.some(authorName =>
                    author.includes(authorName.toLowerCase())
                );
            }

            if (shouldBlock) {
                post.style.display = 'none';
            } else if (titleElement) {
                highlightTitle(titleElement);
            }
        });
    }

    // 初始化
    initMenu();
    checkAutoUpdate();

    // 使用requestAnimationFrame优化性能
    function runSafely() {
        requestAnimationFrame(() => {
            try {
                if (document.readyState === 'complete') {
                    processPosts();
                } else {
                    window.addEventListener('load', processPosts);
                }
            } catch (e) {
                console.error('脚本执行出错:', e);
            }
        });
    }

    // 启动脚本
    runSafely();

    // 监听内容变化
    const observer = new MutationObserver(mutations => {
        requestAnimationFrame(() => {
            const hasAddedNodes = mutations.some(mutation =>
                mutation.addedNodes && mutation.addedNodes.length > 0
            );
            if (hasAddedNodes) {
                processPosts();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();