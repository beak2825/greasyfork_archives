// ==UserScript==
// @name         小智知识检索日志查看插件
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  将指定的JSON数据以浮层表单的形式展示在网页底部
// @author       dingding
// @match        https://salesmind.sankuai.com/app/*/logs
// @match        https://salesmind.ai.test.sankuai.com/app/*/logs
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521719/%E5%B0%8F%E6%99%BA%E7%9F%A5%E8%AF%86%E6%A3%80%E7%B4%A2%E6%97%A5%E5%BF%97%E6%9F%A5%E7%9C%8B%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/521719/%E5%B0%8F%E6%99%BA%E7%9F%A5%E8%AF%86%E6%A3%80%E7%B4%A2%E6%97%A5%E5%BF%97%E6%9F%A5%E7%9C%8B%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 配置部分
    const logDetailsSelector = 'div.grow.bg-white.h-0.overflow-y-auto.rounded-b-2xl.\\!bg-gray-50 > div > div';
    const copyButtonSelector = 'div.flex.justify-between.items-center.h-7.pt-1.pl-3.pr-2 > div.flex.items-center > svg';
    const formContainerId = "tampermonkey-json-form-container"; // 用于标识已添加的表单
    const listItemSelector = 'body > div.flex.flex-col.h-full.overflow-y-auto > div > div.flex.overflow-hidden > div.bg-white.grow.overflow-hidden > div > div > div > div > div.overflow-x-auto > table > tbody > tr';


    /**
     * 根据JSON数据渲染表单并附加到指定的父元素
     * @param {Object} data - JSON数据
     * @param {Element} parentElement - 要附加表单的父元素
     */
    function renderForm(data, parentElement) {
        // 检查表单是否已存在，防止重复添加
        let container = parentElement.querySelector(`#${formContainerId}`);
        if (container) {
            console.log("表单已存在，更新内容。");
            container.innerHTML = ''; // 清空现有内容
        } else {
            // 创建表单容器
            container = document.createElement('div');
            container.id = formContainerId;
            // 设置样式，使表单以隐藏浮层的形式展示在日志详情模块内部
            container.style.display = "none"; // 初始隐藏
            container.style.border = "1px solid #ccc";
            container.style.padding = "15px";
            container.style.backgroundColor = "#f9f9f9";
            container.style.borderRadius = "8px";
            container.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            container.style.marginTop = "20px";
            container.style.maxWidth = "100%";
            container.style.overflowY = "auto"; // 内容超出时可滚动

            // 创建切换按钮
            const toggleButton = document.createElement('button');
            toggleButton.innerText = "显示/隐藏 JSON 内容";
            toggleButton.style.marginBottom = "10px";
            toggleButton.style.padding = "6px 10px";
            toggleButton.style.border = "none";
            toggleButton.style.borderRadius = "4px";
            toggleButton.style.backgroundColor = "#007BFF";
            toggleButton.style.color = "#fff";
            toggleButton.style.cursor = "pointer";
            toggleButton.style.fontSize = "14px";
            toggleButton.onclick = () => {
                container.style.display = container.style.display === "none" ? "block" : "none";
            };
            parentElement.appendChild(toggleButton);

            // 创建表单内容容器
            const formContent = document.createElement('div');
            formContent.id = "tampermonkey-form-content";
            container.appendChild(formContent);

            // 将容器附加到日志详情模块
            parentElement.appendChild(container);
            console.log("表单容器已创建并附加到日志详情模块。");
        }

        // 创建表单内容
        createFormContent(data, container.querySelector('#tampermonkey-form-content'));
        console.log("表单内容已渲染。");

        // 默认显示表单
        container.style.display = "block";
    }

    /**
     * 创建表单的具体内容
     * @param {Object} data - JSON数据
     * @param {Element} container - 表单内容容器
     */
    function createFormContent(data, container) {
        // 清空现有内容
        container.innerHTML = '';

        // 创建Answer部分
        const answerDiv = document.createElement('div');
        answerDiv.style.marginBottom = "15px";

        const answerTitle = document.createElement('h2');
        answerTitle.innerText = "Answer(经过LLM后的最终回答)";
        answerTitle.style.fontSize = "14px"; // 调整字体大小
        answerTitle.style.marginBottom = "5px";
        answerTitle.style.fontWeight = "bold";

        const answerContent = document.createElement('p');
        answerContent.innerText = data.answer || "暂无回答内容.";
        answerContent.style.fontSize = "12px"; // 调整字体大小
        answerContent.style.backgroundColor = "#e9ecef";
        answerContent.style.padding = "6px"; // 调整内边距
        answerContent.style.borderRadius = "4px";
        answerContent.style.margin = "0";

        answerDiv.appendChild(answerTitle);
        answerDiv.appendChild(answerContent);

        // 创建Docs部分
        const docsDiv = document.createElement('div');

        const docsTitle = document.createElement('h2');
        docsTitle.innerText = "召回文档信息";
        docsTitle.style.fontSize = "14px"; // 调整字体大小
        docsTitle.style.marginBottom = "5px";
        docsTitle.style.fontWeight = "bold";

        const docsList = document.createElement('ul');
        docsList.style.listStyleType = "none";
        docsList.style.padding = "0";

        if (data.docs && data.docs.length > 0) {
            data.docs.forEach((doc, index) => {
                const docItem = document.createElement('li');
                docItem.style.border = "1px solid #ddd";
                docItem.style.padding = "10px";
                docItem.style.marginBottom = "10px";
                docItem.style.borderRadius = "5px";
                docItem.style.backgroundColor = "#fff";

                // Doc Header
                const docHeader = document.createElement('div');
                docHeader.style.display = "flex";
                docHeader.style.justifyContent = "space-between";
                docHeader.style.alignItems = "center";
                docHeader.style.marginBottom = "8px";

                const docTitle = document.createElement('strong');
                docTitle.innerText = `文档 ${index + 1}: ${doc.metadata.document_name}`;
                docTitle.style.fontSize = "13px"; // 调整字体大小

                const docLink = document.createElement('a');
                docLink.href = doc.metadata.wiki_url || "#";
                docLink.target = "_blank";
                docLink.style.fontSize = "13px";
                docLink.innerText = "文档详情";
                docLink.style.textDecoration = "none";
                docLink.style.color = "#007BFF";

                docHeader.appendChild(docTitle);
                docHeader.appendChild(docLink);

                // Metadata 列表
                const metadataList = document.createElement('ul');
                metadataList.style.listStyleType = "none";
                metadataList.style.padding = "0";
                metadataList.style.fontSize = "12px"; // 调整字体大小
                metadataList.style.color = "#555";
                // 段落跳转链接逻辑
                const datasetId = doc.metadata.dataset_id;
                const documentId = doc.metadata.document_id;
                const segmentUrl = `${window.location.origin}/datasets/${datasetId}/documents/${documentId}`;

                // 遍历 metadata 并排除 _source、position 和 retriever_from
                for (const [key, value] of Object.entries(doc.metadata)) {
                    if (key === "_source" || key === "position" || key === "retriever_from" || key === "wiki_name") continue;

                    const metadataItem = document.createElement('li');

                    if (key === "wiki_url") {
                        const label = document.createElement('strong');
                        label.innerText = "段落（切片）链接: ";
                        metadataItem.appendChild(label);

                        const link = document.createElement('a');
                        link.href = segmentUrl;
                        link.target = "_blank";
                        link.innerText = "点击访问";
                        link.style.color = "#007BFF";
                        link.style.textDecoration = "none";
                        metadataItem.appendChild(link);
                    } else {
                        const label = document.createElement('strong');
                        label.innerText = `${mapMetadataKey(key)}: `;
                        metadataItem.appendChild(label);
                        metadataItem.innerHTML += `${value}`;
                    }

                    metadataList.appendChild(metadataItem);
                }

                // Question部分
                const questionDiv = document.createElement('div');
                questionDiv.style.marginTop = "5px";
                questionDiv.style.fontSize="12px";

                const questionLabel = document.createElement('strong');
                questionLabel.innerText = "问题: ";
                questionDiv.appendChild(questionLabel);

                const questionContent = document.createElement('span');
                questionContent.innerText = doc.question || "暂无问题内容.";
                questionDiv.appendChild(questionContent);

                // Content部分
                const contentDiv = document.createElement('div');
                contentDiv.style.marginTop = "3px";
                contentDiv.style.fontSize="12px";

                const contentLabel = document.createElement('strong');
                contentLabel.innerText = "内容: ";
                contentDiv.appendChild(contentLabel);

                const contentContent = document.createElement('span');
                contentContent.innerText = doc.content || "暂无内容.";
                contentDiv.appendChild(contentContent);

                docItem.appendChild(docHeader);
                docItem.appendChild(questionDiv);
                docItem.appendChild(contentDiv);
                docItem.appendChild(metadataList);


                docsList.appendChild(docItem);
            });
        } else {
            const noDocs = document.createElement('p');
            noDocs.innerText = "暂无相关文档。";
            noDocs.style.fontSize = "12px"; // 调整字体大小
            noDocs.style.color = "#555";
            docsList.appendChild(noDocs);
        }

        docsDiv.appendChild(docsTitle);
        docsDiv.appendChild(docsList);

        // 将Answer和Docs添加到容器中
        container.appendChild(answerDiv);
        container.appendChild(docsDiv);
    }

    /**
     * 映射 metadata 键为中文名称
     * @param {string} key - metadata 的键
     * @returns {string} - 对应的中文名称
     */
    function mapMetadataKey(key) {
        const mapping = {
            "_source": "_来源",
            "position": "位置",
            "dataset_id": "数据集ID",
            "dataset_name": "数据集名称",
            "document_id": "文档ID",
            "document_name": "文档名称",
            "segment_id": "段落ID",
            "segment_position": "段落位置",
            "wiki_name": "Wiki名称",
            "wiki_url": "WikiURL",
            "semantic_score": "语义评分",
            "full_text_score": "全文评分"
        };
        return mapping[key] || key;
    }

    /**
     * 当“日志详情”出现时，查找并点击“复制按钮”，然后处理JSON数据
     * @param {Element} logDetailsElement - “日志详情”元素
     */
    async function handleLogDetails(logDetailsElement) {
        try {
            // 查找复制按钮的可点击容器
            const copyButtonContainer = logDetailsElement.querySelector(copyButtonSelector);
            if (copyButtonContainer) {
                console.log("复制按钮容器已找到。");

                // 找到可点击的父元素（例如 button、a、div、span, svg）
                const clickableElement = copyButtonContainer.closest('button, a, div, span, svg');
                if (clickableElement) {
                    console.log("找到可点击的父元素");

                    // 使用更全面的点击事件模拟用户行为
                    const event = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    clickableElement.dispatchEvent(event);
                    console.log("点击事件已触发。");
                } else {
                    console.error("无法找到可点击的父元素来触发复制操作。");
                    return;
                }

                // 重试机制：尝试多次读取剪贴板，直到获取到最新的数据
                const maxTries = 5;
                const delay = 2000; // 每次尝试的延迟时间（毫秒）
                let tries = 0;
                let clipboardText = '';
                let parsedData = null;

                while (tries < maxTries && !parsedData) {
                    try {
                        // 使用标准的剪贴板 API
                        clipboardText = await navigator.clipboard.readText();
                        console.log(`尝试 ${tries + 1}: 从剪贴板获取的文本: ${clipboardText}`);

                        // 尝试解析JSON
                        parsedData = JSON.parse(clipboardText);
                        console.log("解析后的JSON数据:", parsedData);
                    } catch (error) {
                        console.error(`尝试 ${tries + 1}: 读取或解析剪贴板内容时出错:`, error);
                        // 等待一段时间后重试
                        await new Promise(resolve => setTimeout(resolve, delay));
                        tries++;
                    }
                }

                if (parsedData) {
                    // 渲染表单
                    renderForm(parsedData, logDetailsElement);
                } else {
                    console.error("未能在多次尝试后获取到有效的JSON数据。");
                }
            } else {
                console.error("未找到复制按钮容器。");
            }
        } catch (error) {
            console.error("处理日志详情时出错:", error);
        }
    }

    // 创建一个MutationObserver来监控“日志详情”元素的出现
    const observer = new MutationObserver((mutationsList, observerInstance) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查当前节点是否匹配“日志详情”选择器
                        if (node.matches(logDetailsSelector)) {
                            console.log("“日志详情”元素已找到，开始处理...");
                            handleLogDetails(node);
                        } else {
                            // 检查子节点中是否有匹配的元素
                            const logDetailsElement = node.querySelector(logDetailsSelector);
                            if (logDetailsElement) {
                                console.log("“日志详情”元素已找到，开始处理...");
                                handleLogDetails(logDetailsElement);
                            }
                        }
                    }
                });
            }
        }
    });

    // 启动观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log("Tampermonkey 脚本已启动，正在监控“日志详情”元素的出现...");

})();
