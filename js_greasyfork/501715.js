// ==UserScript==
// @name         【夸克百科】获取编辑链接
// @namespace    http://tampermonkey.net/
// @version      2025/12/02-00:24:38
// @description  【夸克百科】获取编辑链接。
// @author       SuCloudPlus、Qwen3、DeepSeek-v3
// @match        https://baike.quark.cn/dashboard/task/detail?task_id=2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quark.cn
// @grant        none
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/501715/%E3%80%90%E5%A4%B8%E5%85%8B%E7%99%BE%E7%A7%91%E3%80%91%E8%8E%B7%E5%8F%96%E7%BC%96%E8%BE%91%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/501715/%E3%80%90%E5%A4%B8%E5%85%8B%E7%99%BE%E7%A7%91%E3%80%91%E8%8E%B7%E5%8F%96%E7%BC%96%E8%BE%91%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 清空当前页面内容
    document.body.innerHTML = '';

    // 创建冻结的顶部区域
    const header = document.createElement('div');
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.left = '0';
    header.style.width = '100%';
    header.style.backgroundColor = '#fff';
    header.style.zIndex = '9999';
    header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    header.style.padding = '10px 20px';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.gap = '10px';
    header.style.fontSize = '16px';

    const textarea = document.createElement('textarea');
    textarea.placeholder = '需要登录夸克百科账号\n每行输入格式为：词条名\t义项名（可缺）';
    textarea.rows = 3;
    textarea.style.width = '600px';
    textarea.style.fontSize = '16px';
    textarea.style.resize = 'none';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '确认输入';
    confirmBtn.style.height = '40px';
    confirmBtn.style.fontSize = '18px';
    confirmBtn.style.backgroundColor = '#007BFF';
    confirmBtn.style.color = '#fff';
    confirmBtn.style.border = 'none';
    confirmBtn.style.borderRadius = '4px';
    confirmBtn.style.minWidth = '100px';

    const clearBtn = document.createElement('button');
    clearBtn.textContent = '清空输入';
    clearBtn.style.height = '40px';
    clearBtn.style.fontSize = '18px';
    clearBtn.style.backgroundColor = '#6c757d';
    clearBtn.style.color = '#fff';
    clearBtn.style.border = 'none';
    clearBtn.style.borderRadius = '4px';
    clearBtn.style.minWidth = '100px';

    const copyAllBtn = document.createElement('button');
    copyAllBtn.textContent = '复制链接';
    copyAllBtn.style.height = '40px';
    copyAllBtn.style.fontSize = '18px';
    copyAllBtn.style.backgroundColor = '#28a745';
    copyAllBtn.style.color = '#fff';
    copyAllBtn.style.border = 'none';
    copyAllBtn.style.borderRadius = '4px';
    copyAllBtn.style.minWidth = '140px';

    header.appendChild(textarea);
    header.appendChild(confirmBtn);
    header.appendChild(clearBtn);
    header.appendChild(copyAllBtn);
    document.body.appendChild(header);

    // 内容容器（偏移顶部高度）
    const contentContainer = document.createElement('div');
    contentContainer.style.marginTop = '150px';
    contentContainer.style.padding = '20px';
    document.body.appendChild(contentContainer);

    // 存储最终结果
    let finalResults = [];

    // 存储原始输入行信息
    let originalInputs = [];

    // 存储每个词条名的选中项（用于第二段代码）
    const selectedItems = {};

    // 存储已加载的 iframe
    const iframeCache = {};

    // 清空按钮事件
    clearBtn.addEventListener('click', () => {
        textarea.value = '';
        contentContainer.innerHTML = '';
        finalResults = [];
        originalInputs = [];
        for (const key in iframeCache) {
            delete iframeCache[key];
        }
    });

    // 复制所有链接 - 修改后的版本
    copyAllBtn.addEventListener('click', () => {
        if (finalResults.length === 0) {
            alert('没有可复制的内容');
            return;
        }

        // 获取当前所有手动选择的项
        const manualSelections = document.querySelectorAll('[data-sense-item][style*="background-color: rgb(224, 247, 250)"]');

        // 更新手动选择的项到最终结果
        manualSelections.forEach(item => {
            const wrapper = item.closest('[data-original-index]');
            if (wrapper) {
                const originalIndex = wrapper.dataset.originalIndex;
                if (item.dataset.itemType === 'sense') {
                    const senseId = item.dataset.senseId;
                    const lemmaName = wrapper.dataset.lemmaName;

                    // 查找对应的iframe数据
                    const iframeKey = `${lemmaName}-${senseId}`;
                    const iframe = iframeCache[iframeKey];

                    if (iframe && originalIndex >= 0 && originalIndex < finalResults.length) {
                        const senseData = JSON.parse(iframe.dataset.sense);
                        finalResults[originalIndex] = buildEditUrl(senseData.lemmaData, senseData);
                        console.log(finalResults[originalIndex])
                    }
                } else if (item.dataset.itemType === 'new') {
                    if (originalIndex >= 0 && originalIndex < finalResults.length) {
                        finalResults[originalIndex] = '';
                        console.log(finalResults[originalIndex])
                    }
                }
            }
        });

        // 生成要复制的文本
        const outputText = finalResults
        .map((result, index) => {
            const input = originalInputs[index];
            return result === "null" || result === ""
                ? ``
            : result;
        })
        .join('\n');

        navigator.clipboard.writeText(outputText).then(() => {
            const originalText = copyAllBtn.textContent;
            copyAllBtn.textContent = '已复制';
            setTimeout(() => {
                copyAllBtn.textContent = originalText;
            }, 1000);
        });
    });

    // 第一段代码的处理函数
    async function processFirstStage(lines) {
        originalInputs = lines.map(line => {
            const parts = line.split('\t');
            return {
                keyword: parts[0].trim(),
                lemmaDesc: parts[1] ? parts[1].trim() : null,
                originalLine: line
            };
        });

        const promises = originalInputs.map((input, index) => {
            if (input.keyword) {
                let quark_url = null;

                return fetch("https://baike.quark.cn/api/lemma/sense/get", {
                    "headers": {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "content-type": "application/json;charset=UTF-8",
                        "priority": "u=1, i",
                        "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-csrf-token": ""
                    },
                    "referrer": "https://baike.quark.cn/dashboard/create",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": `[\"${input.keyword}\"]`,
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                })
                    .then(response => response.json())
                    .then(data => {
                    if (input.lemmaDesc) {
                        // 精确匹配
                        for (let value of data.res.data.lemma_senses) {
                            if (value.sense_name === input.lemmaDesc) {
                                quark_url = buildEditUrl(data.res.data, value);
                                break;
                            }
                            // 12任务
                            if (
                                (["网络流行语", "网络流行词", "网络热词", "网络用语", "网络用词"].includes(value.sense_name) &&
                                 ["网络流行语", "网络流行词", "网络热词", "网络用语", "网络用词"].includes(input.lemmaDesc))) {
                                // 通过判定的代码
                                quark_url = buildEditUrl(data.res.data, value);
                                break;
                            }
                        }
                    }

                    return {
                        index,
                        input,
                        result: quark_url === null ? "null" : (quark_url || "")
                    };
                })
                    .catch(error => {
                    return { index, input, result: "" };
                });
            }
            return { index, input: { keyword: "", lemmaDesc: "" }, result: "" };
        });

        const results = await Promise.all(promises);
        const sortedResults = results.sort((a, b) => a.index - b.index);

        // 保存第一段结果
        finalResults = sortedResults.map(item => item.result);

        // 找出需要第二段处理的条目
        const toProcess = sortedResults
        .filter(item => item.result === "null" && item.input.keyword)
        .map(item => item.input);

        return toProcess;
    }

    // 构建编辑URL
    function buildEditUrl(lemmaData, sense) {
        const editUrl =  `https://baike.quark.cn/editor/create?model=edit&lemma_name=${
        encodeURIComponent(lemmaData.lemma_name)
        }&lemma_id=${
        sense.lemma_id
        }&sense_id=${
        sense.sense_id
        }&sense_name=${
        encodeURIComponent(sense.sense_name)
        }`;
        return editUrl;
    }

    // 第二段代码的处理函数
    // 在函数外部定义一组颜色数组
    const colorPalette = [
        '#bbdefb',  // 较深的蓝色
        '#c8e6c9',  // 较深的绿色
        '#ffecb3',  // 较深的橙色
        '#f8bbd0',  // 较深的粉色
        '#e1bee7',  // 较深的紫色
        '#b2ebf2',  // 较深的青色
        '#fff9c4',  // 较深的黄色
        '#d7ccc8'   // 较深的棕色
    ];

    async function processSecondStage(inputsToProcess) {
        if (inputsToProcess.length === 0) return;

        contentContainer.innerHTML = '<h3>以下条目需要手动选择匹配的义项：</h3>';

        // 添加颜色索引计数器
        let colorIndex = 0;

        for (const input of inputsToProcess) {
            const { keyword: lemmaName, lemmaDesc: senseDescription } = input;
            if (!lemmaName) continue;

            try {
                const res = await fetch("https://baike.quark.cn/api/lemma/sense/get", {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        "User-Agent": "Mozilla/5.0"
                    },
                    body: JSON.stringify([lemmaName])
                });

                const data = await res.json();
                const senses = data.res?.data?.lemma_senses || [];

                // 构建词条区块
                const lemmaWrapper = document.createElement('div');
                lemmaWrapper.style.border = '1px solid #ddd';
                lemmaWrapper.style.padding = '15px';
                lemmaWrapper.style.borderRadius = '8px';
                // 使用循环颜色，超出数组长度时循环使用
                lemmaWrapper.style.backgroundColor = colorPalette[colorIndex % colorPalette.length];
                lemmaWrapper.dataset.lemmaName = lemmaName;
                lemmaWrapper.dataset.originalIndex = originalInputs.findIndex(item =>
                                                                              item.keyword === lemmaName && item.lemmaDesc === senseDescription
                                                                             );

                // 增加颜色索引
                colorIndex++;

                // 创建标题行容器
                const titleRow = document.createElement('div');
                titleRow.style.display = 'flex';
                titleRow.style.alignItems = 'center';
                titleRow.style.marginBottom = '10px';
                titleRow.style.gap = '20px';
                titleRow.style.flexWrap = 'wrap'; // 允许换行

                // 创建词条名框 (宽度比例1)
                const lemmaNameBox = document.createElement('div');
                lemmaNameBox.textContent = `${lemmaName}`;
                lemmaNameBox.style.padding = '8px 12px';
                lemmaNameBox.style.border = '2px solid #4a90e2';
                lemmaNameBox.style.borderRadius = '6px';
                lemmaNameBox.style.backgroundColor = '#f0f7ff';
                lemmaNameBox.style.fontSize = '18px';
                lemmaNameBox.style.fontWeight = 'bold';
                lemmaNameBox.style.cursor = 'pointer';
                lemmaNameBox.style.transition = 'all 0.3s ease';
                lemmaNameBox.style.flex = '1'; // 占比1份
                lemmaNameBox.style.minWidth = '200px';

                // 添加点击复制功能
                lemmaNameBox.addEventListener('click', () => {
                    navigator.clipboard.writeText(lemmaName).then(() => {
                        lemmaNameBox.style.backgroundColor = '#e1f5fe';
                        lemmaNameBox.style.borderColor = '#0288d1';
                        setTimeout(() => {
                            lemmaNameBox.style.backgroundColor = '#f0f7ff';
                            lemmaNameBox.style.borderColor = '#4a90e2';
                        }, 500);
                    });
                });

                // 创建义项描述框 (宽度比例3)
                let descriptionBox = null;
                if (senseDescription) {
                    descriptionBox = document.createElement('div');
                    descriptionBox.textContent = `${senseDescription}`;
                    descriptionBox.style.padding = '8px 12px';
                    descriptionBox.style.border = '2px solid #66bb6a';
                    descriptionBox.style.borderRadius = '6px';
                    descriptionBox.style.backgroundColor = '#e8f5e9';
                    descriptionBox.style.fontSize = '18px';
                    descriptionBox.style.cursor = 'pointer';
                    descriptionBox.style.transition = 'all 0.3s ease';
                    descriptionBox.style.flex = '3'; // 占比3份
                    descriptionBox.style.minWidth = '300px'; // 按比例调整最小宽度

                    // 添加点击复制功能
                    descriptionBox.addEventListener('click', () => {
                        navigator.clipboard.writeText(senseDescription).then(() => {
                            descriptionBox.style.backgroundColor = '#c8e6c9';
                            descriptionBox.style.borderColor = '#43a047';
                            setTimeout(() => {
                                descriptionBox.style.backgroundColor = '#e8f5e9';
                                descriptionBox.style.borderColor = '#66bb6a';
                            }, 500);
                        });
                    });
                }

                // 将元素添加到DOM
                titleRow.appendChild(lemmaNameBox);
                if (descriptionBox) {
                    titleRow.appendChild(descriptionBox);
                }

                const itemsContainer = document.createElement('div');
                itemsContainer.style.display = 'flex';
                itemsContainer.style.flexWrap = 'wrap';
                itemsContainer.style.gap = '20px';

                // 添加"新建"选项
                const newItem = createSenseElement({
                    lemmaName,
                    senseDescription,
                    type: 'new',
                    label: '新建',
                    isSelected: false,
                    onClick: () => handleItemSelect(lemmaName, senseDescription, { type: 'new' }, lemmaWrapper)
                });

                const newWrapper = document.createElement('div');
                newWrapper.style.width = '240px';
                newWrapper.appendChild(newItem);
                itemsContainer.appendChild(newWrapper);

                // 自动选择逻辑
                let bestMatch = null;
                let bestScore = -1;

                if (senseDescription) {
                    // 如果有义项描述，优先匹配义项
                    for (const sense of senses) {
                        const score = stringSimilarity(senseDescription, sense.sense_name);
                        if (score > bestScore) {
                            bestScore = score;
                            bestMatch = sense;
                        }
                    }
                } else {
                    // 如果没有义项描述，匹配词条名
                    for (const sense of senses) {
                        const score = stringSimilarity(lemmaName, sense.sense_name);
                        if (score > bestScore) {
                            bestScore = score;
                            bestMatch = sense;
                        }
                    }
                }

                // 添加每个 sense 项
                for (const sense of senses) {
                    const isBestMatch = bestMatch && sense.sense_id === bestMatch.sense_id;
                    const isSelected = isBestMatch; // 自动选中最佳匹配

                    const item = createSenseElement({
                        lemmaName,
                        senseDescription,
                        type: 'sense',
                        sense,
                        lemmaData: data.res.data,
                        isSelected,
                        onClick: () => handleItemSelect(lemmaName, senseDescription, {
                            type: 'sense',
                            data: { ...sense, lemmaData: data.res.data }
                        }, lemmaWrapper)
                    });

                    const itemWrapper = document.createElement('div');
                    itemWrapper.style.width = '240px';
                    itemWrapper.style.display = 'flex';
                    itemWrapper.style.flexDirection = 'column';
                    itemWrapper.style.gap = '10px';

                    itemWrapper.appendChild(item);

                    const iframeKey = `${lemmaName}-${sense.sense_id}`;

                    // 创建或获取缓存的iframe
                    let iframe;
                    if (iframeCache[iframeKey]) {
                        iframe = iframeCache[iframeKey].cloneNode(true);
                    } else {
                        iframe = document.createElement('iframe');
                        iframe.style.width = '100%';
                        iframe.style.height = '320px';
                        iframe.style.border = '1px solid #ccc';
                        iframe.id = iframeKey;
                        iframe.dataset.sense = JSON.stringify({
                            ...sense,
                            lemmaData: data.res.data
                        });
                        iframeCache[iframeKey] = iframe;

                        // 立即开始加载iframe内容
                        loadIframeContent(iframe, sense);
                    }

                    itemWrapper.appendChild(iframe);
                    itemsContainer.appendChild(itemWrapper);

                    // 如果是最佳匹配且分数足够高，自动选择
                    if (isBestMatch && bestScore > 0.5) {
                        handleItemSelect(lemmaName, senseDescription, {
                            type: 'sense',
                            data: { ...sense, lemmaData: data.res.data }
                        }, lemmaWrapper);
                    }
                }

                lemmaWrapper.appendChild(titleRow);
                lemmaWrapper.appendChild(itemsContainer);
                contentContainer.appendChild(lemmaWrapper);

            } catch (err) {
                console.error(err);
                alert(`请求失败：${lemmaName}`);
            }
        }
    }

    // 加载iframe内容
    async function loadIframeContent(iframe, sense) {
        try {
            const previewRes = await fetch("https://baike.quark.cn/api/revision/preview/add", {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                body: JSON.stringify([{ senseId: sense.sense_id, revisionId: sense.current_revision }])
            });

            const previewData = await previewRes.json();
            const url = previewData.res?.url || '#';
            iframe.src = url;
        } catch (error) {
            console.error('加载iframe失败:', error);
        }
    }

    // 处理选项选择
    function handleItemSelect(lemmaName, senseDescription, selectedItem, wrapper) {
        const originalIndex = wrapper.dataset.originalIndex;
        if (originalIndex === undefined || originalIndex < 0) return;

        // 更新选中状态
        const items = wrapper.querySelectorAll('[data-sense-item]');
        items.forEach(item => {
            const itemType = item.dataset.itemType;
            const itemSenseId = item.dataset.senseId || '';
            const isSelected = (
                (selectedItem.type === 'new' && itemType === 'new') ||
                (selectedItem.type === 'sense' && itemType === 'sense' &&
                 selectedItem.data.sense_id === itemSenseId)
            );

            item.style.backgroundColor = isSelected ? '#e0f7fa' : '#fff';
            item.style.borderColor = isSelected ? '#007BFF' : '#ccc';
            item.style.borderWidth = isSelected ? '2px' : '1px';
        });

        // 更新最终结果
        if (selectedItem.type === 'sense') {
            const lemmaData = selectedItem.data.lemmaData;
            finalResults[originalIndex] = buildEditUrl(lemmaData, selectedItem.data);
        } else {
            finalResults[originalIndex] = '';
        }
    }

    // 创建 sense 元素
    function createSenseElement({ lemmaName, senseDescription, type, sense, lemmaData, label, isSelected, onClick }) {
        const item = document.createElement('div');
        item.style.border = '1px solid #ccc';
        item.style.padding = '10px';
        item.style.cursor = 'pointer';
        item.style.transition = 'background-color 0.3s';
        item.style.backgroundColor = isSelected ? '#e0f7fa' : '#fff';
        item.style.borderColor = isSelected ? '#007BFF' : '#ccc';
        item.style.borderWidth = isSelected ? '2px' : '1px';

        item.dataset.senseItem = 'true';
        item.dataset.itemType = type;
        if (type === 'sense') {
            item.dataset.senseId = sense.sense_id;
        }

        if (type === 'new') {
            item.innerHTML = `
                <strong>${label}</strong><br>
                不关联任何词条
            `;
        } else {
            item.innerHTML = `
                <strong>${sense.sense_name}</strong><br>
                sense_id: ${sense.sense_id}<br>
                revision: ${sense.current_revision}
            `;
        }

        item.addEventListener('click', onClick);

        return item;
    }

    // 改进的字符串相似度计算函数
    function stringSimilarity(a, b) {
        if (!a || !b) return 0;

        a = a.toLowerCase().replace(/\s+/g, '');
        b = b.toLowerCase().replace(/\s+/g, '');

        // 完全匹配
        if (a === b) return 1;

        // 包含关系
        if (b.includes(a)) return 0.9;
        if (a.includes(b)) return 0.9;

        // 计算公共子序列
        const matrix = [];
        for (let i = 0; i <= a.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= b.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost = a[i-1] === b[j-1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i-1][j] + 1,
                    matrix[i][j-1] + 1,
                    matrix[i-1][j-1] + cost
                );
            }
        }

        const distance = matrix[a.length][b.length];
        const maxLength = Math.max(a.length, b.length);
        return 1 - distance / maxLength;
    }

    // 确认按钮事件
    confirmBtn.addEventListener('click', async () => {
        const lines = textarea.value.split('\n').map(line => line.trim()).filter(line => line);
        if (lines.length === 0) return;

        contentContainer.innerHTML = '<p>正在处理中...</p>';

        try {
            // 先运行第一段代码
            const toProcess = await processFirstStage(lines);

            // 如果有需要处理的条目，运行第二段代码
            if (toProcess.length > 0) {
                await processSecondStage(toProcess);
            } else {
                contentContainer.innerHTML = '<p>所有条目已自动处理完成，可直接复制链接。</p>';
            }
        } catch (error) {
            console.error(error);
            contentContainer.innerHTML = `<p style="color:red">处理过程中出错: ${error.message}</p>`;
        }
    });
})();