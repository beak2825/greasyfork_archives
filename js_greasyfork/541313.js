// ==UserScript==
// @name         API信息批量提取器
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  专为Apifox设计的API接口信息批量提取工具，支持自动监听、数据预览和批量导出
// @description:en  Batch API information extractor tool designed for Apifox, supports auto-monitoring, data preview and batch export
// @author       xiaoma
// @license      MIT
// @homepage     https://github.com/api-extractor/userscript
// @supportURL   https://github.com/api-extractor/userscript/issues
// @match        https://app.apifox.com/*
// @match        https://*.apifox.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNDA5RUZGIi8+Cjwvc3ZnPgo=
// @grant        none
// @run-at       document-end
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/541313/API%E4%BF%A1%E6%81%AF%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541313/API%E4%BF%A1%E6%81%AF%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局常量定义
    const STORAGE_KEY = 'api_extractor_data';
    const POSITION_STORAGE_KEY = 'api_extractor_panel_position';
    const FILTER_CONFIG_KEY = 'api_extractor_filter_config';
    const UI_CONTAINER_ID = 'api-extractor-control-panel';

    // 全局状态管理
    let extractedApiDataCollection = [];
    let isAutoExtracting = false;
    let currentApiUrl = '';
    let apiUrlObserver = null;
    let existDialog = false;

    // 默认过滤的响应字段列表
    const DEFAULT_FILTER_FIELDS = [
        'code',      // 错误代码
        'extend',    // 扩展信息
        'indexId',   // 滚动id
        'msg',       // 错误消息
        'pageIndex', // 页码
        'pageSize',  // 分页大小
        'reqId',     // 请求id
        'ret',       // 结果编码
        'shareToken',// 分享token
        'time',      // 系统时间
        'total'      // 分页记录总数
    ];

    // 当前配置的过滤字段
    let currentFilterFields = [...DEFAULT_FILTER_FIELDS];

    /**
     * 初始化脚本
     */
    function initScript() {
        try {

            loadSavedData();
            loadFilterConfig();
            createUIControlPanel();
        } catch (errorInfo) {
            // 初始化失败时静默处理
        }
    }

    function deleteHeaderElement() {
        //ui-card ui-card-bordered ui-card-small parameters__card-RgO9Bm
        const headerElements = document.querySelectorAll('.ui-card.ui-card-bordered.ui-card-small.parameters__card-RgO9Bm');
        console.log(`找到 ${headerElements.length} 个匹配的卡片节点`);

        let deletedCount = 0;
        headerElements.forEach((headerElement) => {
            // 检查是否包含 "Header 参数" 标题
            const titleElement = headerElement.querySelector('.ui-card-head-title');
            if (titleElement && titleElement.textContent.trim() === 'Header 参数') {
                headerElement.remove();
                deletedCount++;
                console.log('已删除 Header 参数节点');
            } else {
                console.log(`跳过节点，标题为: "${titleElement ? titleElement.textContent.trim() : '未找到标题'}"`);
            }
        });

        console.log(`总共删除了 ${deletedCount} 个 Header 参数节点`);
    }
    /**
     * 加载本地存储的数据
     */
    function loadSavedData() {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            extractedApiDataCollection = storedData ? JSON.parse(storedData) : [];
        } catch (errorInfo) {
            extractedApiDataCollection = [];
        }
    }

    /**
     * 保存数据到本地存储
     */
    function saveDataToLocalStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(extractedApiDataCollection));
        } catch (errorInfo) {
            // 保存失败时静默处理
        }
    }

    /**
     * 加载过滤配置
     */
    function loadFilterConfig() {
        try {
            const savedConfig = localStorage.getItem(FILTER_CONFIG_KEY);
            if (savedConfig) {
                currentFilterFields = JSON.parse(savedConfig);
            }
        } catch (errorInfo) {
            currentFilterFields = [...DEFAULT_FILTER_FIELDS];
        }
    }

    /**
     * 保存过滤配置
     */
    function saveFilterConfig() {
        try {
            localStorage.setItem(FILTER_CONFIG_KEY, JSON.stringify(currentFilterFields));
        } catch (errorInfo) {
            // 保存失败时静默处理
        }
    }

    /**
     * 创建UI控制面板
     */
    function createUIControlPanel() {
        // 检查是否已存在控制面板
        if (document.getElementById(UI_CONTAINER_ID)) return;

        // 获取保存的位置
        const savedPosition = getSavedPanelPosition();

        const controlPanelContainer = document.createElement('div');
        controlPanelContainer.id = UI_CONTAINER_ID;
        controlPanelContainer.style.cssText = `
            position: fixed;
            top: ${savedPosition.top}px;
            left: ${savedPosition.left}px;
            z-index: 9999;
            background: #fafbfc;
            border: 1px solid #e1e8ed;
            border-radius: 6px;
            padding: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            width: 300px;
            cursor: move;
            user-select: none;
            transition: opacity 0.2s;
        `;

        // 标题栏
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 500;
            color: #536471;
            margin-bottom: 8px;
            font-size: 13px;
            padding-bottom: 6px;
        `;

        const titleText = document.createElement('span');
        titleText.textContent = 'API提取器';
        titleText.style.cssText = 'flex: 1; text-align: center;';

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            background: transparent;
            border: none;
            color: #8a9ba6;
            cursor: pointer;
            font-size: 14px;
            padding: 2px 6px;
            border-radius: 3px;
            line-height: 1;
            transition: all 0.2s;
        `;

        // 关闭按钮悬停效果
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.background = '#f0f3f6';
            closeButton.style.color = '#536471';
        });

        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.background = 'transparent';
            closeButton.style.color = '#8a9ba6';
        });

        // 关闭面板功能
        closeButton.addEventListener('click', () => {
            if (confirm('确定要关闭API提取器吗？')) {
                controlPanelContainer.remove();
            }
        });

        titleBar.appendChild(document.createElement('span')); // 占位元素保持平衡
        titleBar.appendChild(titleText);
        titleBar.appendChild(closeButton);

        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; flex-direction: column; gap: 6px;';

        // 提取当前API按钮
        const extractButton = createButton('提取当前API', '#9373ee', handleExtractCurrentApi);

        // 配置过滤字段按钮
        const configFilterButton = createButton('配置过滤字段', '#7c3aed', handleConfigureFilter);

        // 下载全部按钮
        const downloadButton = createButton(`下载全部(${extractedApiDataCollection.length})`, '#9373ee', handleDownloadAllData);

        // 预览数据按钮
        const previewButton = createButton('预览数据', '#ef6820', handlePreviewData);

        // 清空数据按钮
        const clearButton = createButton('清空数据', '#dc3545', handleClearAllData);

        // 自动提取按钮
        const autoExtractButton = createButton('自动提取', '#1890ff', handleAutoExtract);

        // 组装UI
        buttonContainer.appendChild(extractButton);
        buttonContainer.appendChild(configFilterButton);
        buttonContainer.appendChild(downloadButton);
        buttonContainer.appendChild(previewButton);
        buttonContainer.appendChild(autoExtractButton);
        buttonContainer.appendChild(clearButton);

        // 存储按钮引用
        window.autoExtractButtonRef = autoExtractButton;

        // 信息显示区域
        const infoArea = document.createElement('div');
        infoArea.id = 'api-extractor-info';
        infoArea.style.cssText = `
            background: #f8f9fa;
            border: 1px solid #e1e8ed;
            border-radius: 4px;
            padding: 8px;
            margin-top: 8px;
            margin-bottom: 8px;
            font-size: 12px;
            color: #536471;
            min-height: 20px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            line-height: 1.3;
            white-space: pre-wrap;
            word-wrap: break-word;
        `;
        infoArea.textContent = '就绪';

        controlPanelContainer.appendChild(titleBar);
        controlPanelContainer.appendChild(infoArea);
        controlPanelContainer.appendChild(buttonContainer);

        document.body.appendChild(controlPanelContainer);

        // 存储按钮引用以便后续更新
        window.downloadButtonRef = downloadButton;

        // 添加拖拽功能
        makePanelDraggable(controlPanelContainer);
    }

    /**
     * 创建通用按钮
     */
    function createButton(buttonText, backgroundColor, clickHandler) {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = buttonText;
        buttonElement.style.cssText = `
            background: white;
            color: ${backgroundColor};
            border: 1px solid ${backgroundColor};
            border-radius: 4px;
            padding: 6px 10px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 400;
            transition: all 0.2s ease;
            line-height: 1.2;
        `;

        // 鼠标悬停效果
        buttonElement.addEventListener('mouseenter', () => {
            buttonElement.style.transform = 'translateY(-1px)';
            buttonElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            buttonElement.style.background = backgroundColor;
            buttonElement.style.color = 'white';
        });

        buttonElement.addEventListener('mouseleave', () => {
            buttonElement.style.transform = 'translateY(0)';
            buttonElement.style.boxShadow = 'none';
            buttonElement.style.background = 'white';
            buttonElement.style.color = backgroundColor;
        });

        buttonElement.addEventListener('click', clickHandler);
        return buttonElement;
    }

    /**
     * 获取保存的面板位置
     */
    function getSavedPanelPosition() {
        try {
            const savedPosition = localStorage.getItem(POSITION_STORAGE_KEY);
            if (savedPosition) {
                return JSON.parse(savedPosition);
            }
        } catch (error) {
        }

        // 默认位置：视口正上方居中
        return {
            top: 20,
            left: Math.max(20, (window.innerWidth - 300) / 2)
        };
    }

    /**
     * 保存面板位置
     */
    function savePanelPosition(top, left) {
        try {
            const position = { top, left };
            localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position));
        } catch (error) {
        }
    }

    /**
     * 使面板可拖拽
     */
    function makePanelDraggable(panel) {
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        panel.addEventListener('mousedown', function(e) {
            // 防止在按钮上开始拖拽
            if (e.target.tagName === 'BUTTON') return;

            isDragging = true;

            // 设置拖拽时的半透明效果
            panel.style.opacity = '0.7';

            // 计算鼠标相对于面板的偏移
            const rect = panel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;

            // 阻止文本选择
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            // 计算新位置
            let newLeft = e.clientX - dragOffsetX;
            let newTop = e.clientY - dragOffsetY;

            // 边界检查，确保面板不会超出视口
            const maxLeft = window.innerWidth - panel.offsetWidth;
            const maxTop = window.innerHeight - panel.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            // 更新面板位置
            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
        });

        document.addEventListener('mouseup', function() {
            if (!isDragging) return;

            isDragging = false;

            // 恢复不透明度
            panel.style.opacity = '1';

            // 保存当前位置
            const rect = panel.getBoundingClientRect();
            savePanelPosition(rect.top, rect.left);
        });
    }

    /**
     * 处理提取当前API
     */
    async function handleExtractCurrentApi() {
        try {
            const apiData = await extractCurrentPageApiInfo();

            if (!apiData.apiName) {
                showInfoInPanel('未检测到有效的API接口信息');
                return;
            }

            // 根据当前配置决定是否过滤响应字段
            if (currentFilterFields.length > 0) {
                apiData.responseInfo = filterResponseFields(apiData.responseInfo, currentFilterFields);
            }

            // 检查是否已存在相同API
            const existingIndex = extractedApiDataCollection.findIndex(item =>
                item.apiName === apiData.apiName && item.apiUrl === apiData.apiUrl
            );

            const statusText = currentFilterFields.length > 0 ? '已提取(已过滤)' : '已提取';
            const updateText = currentFilterFields.length > 0 ? '已更新(已过滤)' : '已更新';

            if (existingIndex !== -1) {
                // 更新现有数据
                extractedApiDataCollection[existingIndex] = apiData;
                showInfoInPanel(`${updateText}: ${apiData.apiName}`);
            } else {
                // 添加新数据
                extractedApiDataCollection.push(apiData);
                showInfoInPanel(`${statusText}: ${apiData.apiName}`);
            }

            saveDataToLocalStorage();
            updateDownloadButtonText();

        } catch (errorInfo) {
            showInfoInPanel('提取失败: ' + errorInfo.message);
        }
    }

    /**
     * 处理配置过滤字段
     */
    async function handleConfigureFilter() {
        try {
            const filterFields = await showFilterFieldsDialog();
            if (filterFields !== null) {
                currentFilterFields = filterFields;
                saveFilterConfig();

                const configStatus = filterFields.length > 0
                    ? `已配置过滤 ${filterFields.length} 个字段`
                    : '已关闭字段过滤';
                showInfoInPanel(configStatus);
            }
        } catch (errorInfo) {
            showInfoInPanel('配置失败: ' + errorInfo.message);
        }
    }

    /**
     * 执行页面滚动操作
     */
         async function performPageScroll() {

        // 首先查找正确的tabpanel滚动容器
        const tabpanelContainer = document.querySelector('[role="tabpanel"].ui-tabs-tabpane-active');

        if (tabpanelContainer && tabpanelContainer.scrollHeight > tabpanelContainer.clientHeight) {
            tabpanelContainer.scrollTop = tabpanelContainer.scrollHeight;
        } else {
            // 备用滚动容器
            const scrollContainers = [
                document.querySelector('[role="tabpanel"]'),
                document.querySelector('.HttpApiTab-view'),
                document.querySelector('.mainTabsPane-jfI3Sh'),
                document.documentElement,
                document.body,
                document.querySelector('.ui-layout-content'),
                document.querySelector('[data-testid="main-content"]'),
                document.querySelector('main'),
                document.querySelector('#root'),
                document.querySelector('.app-container')
            ].filter(Boolean);

            // 尝试滚动每个可能的容器
            scrollContainers.forEach(container => {
                if (container && container.scrollHeight > container.clientHeight) {
                    container.scrollTop = container.scrollHeight;
                }
            });

            // 最后的备用滚动方法
            window.scrollTo(0, Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            ));
        }

        // 等待内容加载完成
        await new Promise(resolve => setTimeout(resolve, 400));

        // 展开所有折叠的参数以显示完整结构
        await expandAllCollapsedParams();

        // 再次等待，确保所有内容都加载完成
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    /**
     * 提取当前页面的API信息
     */
    async function extractCurrentPageApiInfo() {
        const apiInfo = {
            apiName: '',
            apiUrl: '',
            requestMethod: '',
            requestParams: [],
            responseInfo: []
        };

        // 1. 首先执行滚动操作
        await performPageScroll();

        // 2. 删除Header参数元素
        deleteHeaderElement();

        // 3. 提取接口名称
        apiInfo.apiName = safeExtractText('.name-text-nO_wGQ .copyable-NYoI4L');

        // 4. 提取请求方式和URL
        const pathInfoContainer = document.querySelector('.base-info-path-lbh3Yn');
        if (pathInfoContainer) {
            apiInfo.requestMethod = safeExtractText('.base-info-path-lbh3Yn code', pathInfoContainer);
            apiInfo.apiUrl = safeExtractText('.base-info-path-lbh3Yn .copyable-NYoI4L', pathInfoContainer);
        }

        // 5. 提取请求参数
        apiInfo.requestParams = extractRequestParamsStructure();

        // 6. 提取响应信息
        apiInfo.responseInfo = await extractResponseStructureSimplified();

        return apiInfo;
    }

    /**
     * 安全提取文本内容
     */
    function safeExtractText(selector, parentElement = document) {
        try {
            const element = parentElement.querySelector(selector);
            return element ? element.textContent.trim() : '';
        } catch (error) {
            return '';
        }
    }

    /**
     * 提取参数结构（包含子参数）
     */
    function extractRequestParamsStructure() {
        // 查找所有的mx-5 mx-5容器
        const mx5Containers = document.querySelectorAll('.mx-5.mx-5');

        // 第二个容器是请求参数（索引为1）
        if (mx5Containers.length < 2) {
            return [];
        }

        const requestContainer = mx5Containers[1];

        // 在请求参数容器中查找JsonSchemaViewer
        const requestSchemaViewer = requestContainer.querySelector('.JsonSchemaViewer');

        if (!requestSchemaViewer) {
            return [];
        }

        // 构建请求参数层级结构
        const hierarchy = buildParameterHierarchyByDataLevel(requestSchemaViewer);

        return hierarchy;
    }

    /**
     * 基于data-level属性构建参数层级结构
     */
    function buildParameterHierarchyByDataLevel(container) {
        // 获取所有带data-level属性的容器，按照出现顺序排列
        const allLevelContainers = Array.from(container.querySelectorAll('[data-level]'));

        const result = [];
        let i = 0;

        while (i < allLevelContainers.length) {
            const currentContainer = allLevelContainers[i];
            const currentLevel = parseInt(currentContainer.getAttribute('data-level'));

            if (currentLevel === 0) {
                // 处理一级参数
                const level0Params = extractParametersFromContainer(currentContainer);

                // 简化逻辑：直接按顺序分配子参数容器给一级参数
                const level1ContainersAfterCurrent = [];
                let j = i + 1;
                while (j < allLevelContainers.length) {
                    const container = allLevelContainers[j];
                    const level = parseInt(container.getAttribute('data-level'));
                    if (level === 1) {
                        level1ContainersAfterCurrent.push(container);
                        j++;
                    } else if (level === 0) {
                        break;
                    } else {
                        j++;
                    }
                }

                // 分配子参数容器给一级参数（基于参数类型判断）
                let level1Index = 0;
                level0Params.forEach((param) => {
                    // array和object类型的参数都可能有子参数
                    if ((param.paramType === 'array' || param.paramType === 'object') && level1Index < level1ContainersAfterCurrent.length) {
                        const targetContainer = level1ContainersAfterCurrent[level1Index];
                        const children = extractParametersFromContainer(targetContainer);

                        if (children.length > 0) {
                            param.children = children;

                            // 递归处理更深层级的子参数
                            const currentContainerIndex = allLevelContainers.indexOf(targetContainer);
                            assignDeeperChildren(children, allLevelContainers, currentContainerIndex);
                        }

                        level1Index++;
                    }
                });

                result.push(...level0Params);

                // 跳过已处理的子参数容器
                let nextIndex = i + 1;
                while (nextIndex < allLevelContainers.length &&
                       parseInt(allLevelContainers[nextIndex].getAttribute('data-level')) > 0) {
                    nextIndex++;
                }
                i = nextIndex;
            } else {
                // 跳过非一级参数容器（它们会被上面的逻辑处理）
                i++;
            }
        }

        return result;
    }



    /**
     * 为子参数分配更深层级的子参数
     */
    function assignDeeperChildren(parentParams, allContainers, startIndex) {
        let nextContainerIndex = startIndex + 1;

        // 为每个可能有子参数的参数分配深层容器
        parentParams.forEach(param => {
            // array 和 object 类型的参数可能有子参数
            if ((param.paramType === 'array' || param.paramType === 'object') && nextContainerIndex < allContainers.length) {
                // 查找下一个更深层级的容器
                const deeperContainer = findNextDeeperContainer(allContainers, nextContainerIndex);

                if (deeperContainer.container) {
                    const children = extractParametersFromContainer(deeperContainer.container);

                    if (children.length > 0) {
                        param.children = children;

                        // 递归处理更深层级
                        assignDeeperChildren(children, allContainers, deeperContainer.index);
                    }

                    nextContainerIndex = deeperContainer.index + 1;
                }
            }
        });
    }

    /**
     * 查找下一个更深层级的容器
     */
    function findNextDeeperContainer(allContainers, startIndex) {
        if (startIndex >= allContainers.length) {
            return { container: null, index: -1 };
        }

        // 获取当前容器的层级，期望找到下一层级
        const currentLevel = startIndex > 0 ?
            parseInt(allContainers[startIndex - 1].getAttribute('data-level')) : 0;
        const expectedLevel = currentLevel + 1;

        for (let i = startIndex; i < allContainers.length; i++) {
            const container = allContainers[i];
            const level = parseInt(container.getAttribute('data-level'));

            if (level === expectedLevel) {
                return { container, index: i };
            } else if (level <= currentLevel) {
                // 遇到同级或更高级别的容器，停止搜索
                break;
            }
        }

        return { container: null, index: -1 };
    }

    /**
     * 从容器中提取所有参数
     */
    function extractParametersFromContainer(container) {
        const params = [];
        const dataLevel = container.getAttribute('data-level');

        if (dataLevel === '0') {
            // 处理一级参数：查找 style="margin-left: 0px;" 的容器内的参数节点
            const topLevelElements = container.querySelectorAll('[style*="margin-left: 0px"]');

            topLevelElements.forEach((element) => {
                const paramNode = element.querySelector('.index_node__G6-Qx');
                if (paramNode) {
                    const paramInfo = parseBasicParamInfo(paramNode);
                    if (paramInfo.paramName) {
                        params.push(paramInfo);
                    }
                }
            });
        } else {
            // 处理子参数：查找 .index_child-stack__WPMqo 元素
            const childStacks = container.querySelectorAll('.index_child-stack__WPMqo');

            childStacks.forEach((stack) => {
                const paramNode = stack.querySelector('.index_node__G6-Qx');
                if (paramNode) {
                    const paramInfo = parseBasicParamInfo(paramNode);
                    if (paramInfo.paramName) {
                        params.push(paramInfo);
                    }
                }
            });
        }

        return params;
    }

    /**
     * 简化的响应体结构提取（滚动操作已在前面执行）
     */
    async function extractResponseStructureSimplified() {
        // 查找所有的mx-5 mx-5容器
        const mx5Containers = document.querySelectorAll('.mx-5.mx-5');

        // 第三个容器是响应体（索引为2）
        if (mx5Containers.length < 3) {
            return [];
        }

        const responseContainer = mx5Containers[2];

        // 在响应体容器中查找JsonSchemaViewer
        const responseSchemaViewer = responseContainer.querySelector('.JsonSchemaViewer');

        if (!responseSchemaViewer) {
            return [];
        }

        // 构建响应体参数层级结构
        const responseHierarchy = buildParameterHierarchyByDataLevel(responseSchemaViewer);

        const filteredHierarchy = filterErrorData(responseHierarchy);

        // 清理重复的兄弟节点（子参数被错误识别为兄弟参数的情况）
        const cleanedHierarchy = removeDuplicateSiblingNodes(filteredHierarchy);

        return cleanedHierarchy;
    }

    /**
     * 提取响应体结构（保留原函数用于兼容性）
     */
    async function extractResponseStructure() {
        // 直接调用简化版本，因为滚动操作应该在调用前完成
        return await extractResponseStructureSimplified();
    }

    /**
     * 展开所有折叠的参数
     */
    async function expandAllCollapsedParams() {
        // 最多展开4轮，确保深层嵌套都能展开
        for (let round = 1; round <= 4; round++) {
            // 查找所有的折叠按钮
            const collapseButtons = document.querySelectorAll('[aria-label="collapse button"]');

            if (collapseButtons.length === 0) {
                break;
            }

            // 统计需要点击的按钮数量
            let needClickCount = 0;

            collapseButtons.forEach((button) => {
                try {
                    if (button.offsetParent !== null) {
                        const svg = button.querySelector('svg');
                        if (svg) {
                            const transform = svg.style.transform;
                            // 只点击折叠状态的按钮 (270deg)
                            if (transform && transform.includes('270deg')) {
                                needClickCount++;
                                button.click();
                            }
                        }
                    }
                } catch (error) {
                }
            });

            // 如果没有按钮需要点击，说明全部展开完成
            if (needClickCount === 0) {
                break;
            }

            // 等待展开动画完成和新内容加载，减少等待时间
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    /**
     * 清理重复的兄弟节点
     * 如果某个参数的子参数被错误识别为其兄弟参数，则删除这些重复的兄弟参数
     */
    function removeDuplicateSiblingNodes(hierarchy) {
        if (!hierarchy || !Array.isArray(hierarchy)) {
            return hierarchy;
        }

        return cleanHierarchyLevel(hierarchy);
    }

    /**
     * 清理单个层级的参数数组
     */
    function cleanHierarchyLevel(params) {
        if (!params || !Array.isArray(params)) {
            return params;
        }

        // 收集所有有子参数的参数的子参数名称
        const allChildParamNames = new Set();

        params.forEach(param => {
            if (param.children && Array.isArray(param.children)) {
                collectAllChildNames(param.children, allChildParamNames);
            }
        });

        // 过滤掉与子参数同名的兄弟参数
        const filteredParams = params.filter(param => {
            return !allChildParamNames.has(param.paramName);
        });

        // 递归处理每个参数的子参数
        const processedParams = filteredParams.map(param => {
            if (param.children && Array.isArray(param.children)) {
                return {
                    ...param,
                    children: cleanHierarchyLevel(param.children)
                };
            }
            return param;
        });

        return processedParams;
    }

    /**
     * 递归收集所有子参数名称
     */
    function collectAllChildNames(children, nameSet) {
        if (!children || !Array.isArray(children)) {
            return;
        }

        children.forEach(child => {
            nameSet.add(child.paramName);

            // 递归收集子参数的子参数名称
            if (child.children && Array.isArray(child.children)) {
                collectAllChildNames(child.children, nameSet);
            }
        });
    }

    /**
     * 过滤掉errorData参数
     */
    function filterErrorData(hierarchy) {
        const filteredResponse = hierarchy.filter(param => {
            if (param.paramName === 'errorData') {
                return false;
            }
            return true;
        });

        return filteredResponse;
    }

    /**
     * 过滤响应字段
     * @param {Array} responseHierarchy - 响应体层级结构
     * @param {Array} filterFields - 要过滤的字段名数组
     * @returns {Array} 过滤后的响应体结构
     */
    function filterResponseFields(responseHierarchy, filterFields) {
        if (!responseHierarchy || !Array.isArray(responseHierarchy)) {
            return responseHierarchy;
        }

        return filterHierarchyFields(responseHierarchy, filterFields);
    }

    /**
     * 递归过滤层级结构中的字段
     * @param {Array} hierarchy - 当前层级的参数数组
     * @param {Array} filterFields - 要过滤的字段名数组
     * @returns {Array} 过滤后的参数数组
     */
    function filterHierarchyFields(hierarchy, filterFields) {
        if (!hierarchy || !Array.isArray(hierarchy)) {
            return hierarchy;
        }

        return hierarchy
            .filter(param => {
                // 如果字段名在过滤列表中，则过滤掉
                return !filterFields.includes(param.paramName);
            })
            .map(param => {
                // 如果有子参数，递归过滤子参数
                if (param.children && Array.isArray(param.children)) {
                    return {
                        ...param,
                        children: filterHierarchyFields(param.children, filterFields)
                    };
                }
                return param;
            });
    }

    /**
     * 解析基本参数信息
     */
    function parseBasicParamInfo(node) {
        const paramInfo = {
            paramName: '',
            paramType: '',
            isRequired: false,
            paramDescription: ''
        };

        try {
            // 获取参数名
            const paramNameElement = node.querySelector('.propertyName-Zh4tse .copyable-NYoI4L');
            paramInfo.paramName = paramNameElement ? paramNameElement.textContent.trim() : '';

            // 获取参数类型
            const typeElement = node.querySelector('.sl-type span');
            paramInfo.paramType = typeElement ? typeElement.textContent.trim() : '';

            // 判断是否必填
            const optionalFlag = node.querySelector('.index_optional__O33wK');
            paramInfo.isRequired = !optionalFlag;

            // 获取参数描述 - 优先从 json-schema-viewer__description 获取
            let paramDescription = '';

            // 首先尝试从描述区域获取
            const descriptionElement = node.querySelector('.json-schema-viewer__description p');
            if (descriptionElement && descriptionElement.textContent.trim()) {
                paramDescription = descriptionElement.textContent.trim();
            }
            // 如果没有，尝试从 title 属性获取
            else {
                const titleElement = node.querySelector('.index_additionalInformation__title__cjvSn[title]');
                if (titleElement && titleElement.getAttribute('title')) {
                    paramDescription = titleElement.getAttribute('title');
                }
                // 最后尝试从 titleElement 的文本内容获取
                else if (titleElement && titleElement.textContent.trim()) {
                    paramDescription = titleElement.textContent.trim();
                }
            }

            paramInfo.paramDescription = paramDescription;

        } catch (error) {
        }

        return paramInfo;
    }

    /**
     * 处理下载全部数据
     */
    function handleDownloadAllData() {
        if (extractedApiDataCollection.length === 0) {
            showInfoInPanel('暂无数据可下载');
            return;
        }

        try {
            const exportData = {
                exportTime: new Date().toLocaleString('zh-CN'),
                dataCount: extractedApiDataCollection.length,
                apiList: extractedApiDataCollection
            };

            const dataString = JSON.stringify(exportData, null, 2);
            const fileName = `API接口数据_${new Date().toISOString().slice(0,10)}.json`;

            downloadJsonFile(dataString, fileName);
            showInfoInPanel(`已下载 ${extractedApiDataCollection.length} 条API数据`);

        } catch (errorInfo) {
            showInfoInPanel('下载失败: ' + errorInfo.message);
        }
    }

    /**
     * 下载JSON文件
     */
    function downloadJsonFile(dataContent, fileName) {
        const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataContent);
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = fileName;
        downloadLink.style.display = 'none';

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    /**
     * 处理清空所有数据
     */
    function handleClearAllData() {
        if (extractedApiDataCollection.length === 0) {
            showInfoInPanel('暂无数据需要清空');
            return;
        }

        if (confirm(`确定要清空所有 ${extractedApiDataCollection.length} 条API数据吗？`)) {
            const clearedCount = extractedApiDataCollection.length;
            extractedApiDataCollection = [];
            saveDataToLocalStorage();
            updateDownloadButtonText();
            showInfoInPanel(`已清空 ${clearedCount} 条API数据`);
        }
    }

    /**
     * 处理预览数据
     */
    function handlePreviewData() {
        if (extractedApiDataCollection.length === 0) {
            showInfoInPanel('暂无数据可预览');
            return;
        }

        const previewData = {
            exportTime: new Date().toLocaleString('zh-CN'),
            dataCount: extractedApiDataCollection.length,
            apiList: extractedApiDataCollection
        };

        showJsonPreviewModal(previewData);
    }

    /**
     * 处理自动提取
     */
    function handleAutoExtract() {
        if (!isAutoExtracting) {
            // 开始自动提取
            startAutoExtract();
        } else {
            // 停止自动提取
            stopAutoExtract();
        }
    }

    /**
     * 开始自动提取
     */
    function startAutoExtract() {
        isAutoExtracting = true;

        // 获取当前接口URL
        const pathInfoContainer = document.querySelector('.base-info-path-lbh3Yn');
        currentApiUrl = pathInfoContainer ? safeExtractText('.base-info-path-lbh3Yn .copyable-NYoI4L', pathInfoContainer) : '';

        // 更新按钮状态
        updateAutoExtractButton();

        // 先提取当前页面
        setTimeout(async () => {
            try {
                await handleExtractCurrentApi();
            } catch (error) {
                showInfoInPanel('初始提取失败: ' + error.message);
            }
        }, 500);

        // 开始监听接口URL变化
        startApiUrlMonitoring();

        showInfoInPanel('自动提取已开启，正在监听接口变化');
    }

    /**
     * 停止自动提取
     */
    function stopAutoExtract() {
        isAutoExtracting = false;

        // 更新按钮状态
        updateAutoExtractButton();

        // 停止接口URL监听
        stopApiUrlMonitoring();

        showInfoInPanel('自动提取已停止');
    }

    /**
     * 更新自动提取按钮状态
     */
    function updateAutoExtractButton() {
        if (window.autoExtractButtonRef) {
            if (isAutoExtracting) {
                window.autoExtractButtonRef.textContent = '停止提取';
                window.autoExtractButtonRef.style.background = 'white';
                window.autoExtractButtonRef.style.color = '#dc3545';
                window.autoExtractButtonRef.style.border = '1px solid #dc3545';
            } else {
                window.autoExtractButtonRef.textContent = '自动提取';
                window.autoExtractButtonRef.style.background = 'white';
                window.autoExtractButtonRef.style.color = '#1890ff';
                window.autoExtractButtonRef.style.border = '1px solid #1890ff';
            }
        }
    }

    /**
     * 开始监听接口URL变化
     */
    function startApiUrlMonitoring() {
        const targetContainer = document.querySelector('.base-info-path-lbh3Yn');
        if (!targetContainer) {
            showInfoInPanel('未找到接口信息容器，无法开启自动提取');
            stopAutoExtract();
            return;
        }

        // 使用MutationObserver监听DOM变化
        apiUrlObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData' || mutation.type === 'subtree') {
                    handleApiUrlChange();
                }
            });
        });

        // 开始观察目标容器及其子元素
        apiUrlObserver.observe(targetContainer, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: false
        });

        // 备用定时检查
        window.apiUrlCheckInterval = setInterval(() => {
            if (isAutoExtracting) {
                handleApiUrlChange();
            }
        }, 100);
    }

    /**
     * 停止监听接口URL变化
     */
    function stopApiUrlMonitoring() {
        // 停止MutationObserver
        if (apiUrlObserver) {
            apiUrlObserver.disconnect();
            apiUrlObserver = null;
        }

        // 清除定时器
        if (window.apiUrlCheckInterval) {
            clearInterval(window.apiUrlCheckInterval);
            window.apiUrlCheckInterval = null;
        }
    }

    /**
     * 处理接口URL变化
     */
    function handleApiUrlChange() {
        if (!isAutoExtracting) return;

        const pathInfoContainer = document.querySelector('.base-info-path-lbh3Yn');
        if (!pathInfoContainer) return;

        const newApiUrl = safeExtractText('.base-info-path-lbh3Yn .copyable-NYoI4L', pathInfoContainer);

        if (newApiUrl && newApiUrl !== currentApiUrl) {
            currentApiUrl = newApiUrl;

            // 延迟提取，确保页面内容完全更新
            setTimeout(async () => {
                if (isAutoExtracting) {
                    try {
                        await handleExtractCurrentApi();
                    } catch (error) {
                        showInfoInPanel('自动提取失败: ' + error.message);
                    }
                }
            }, 800);
        }
    }

    /**
     * 更新下载按钮文本
     */
    function updateDownloadButtonText() {
        if (window.downloadButtonRef) {
            window.downloadButtonRef.textContent = `下载全部(${extractedApiDataCollection.length})`;
        }
    }

    /**
     * 在面板中显示信息
     */
    function showInfoInPanel(content) {
        const infoArea = document.getElementById('api-extractor-info');

        if (!infoArea) return;

        // 更新内容
        infoArea.textContent = content;
    }

    /**
     * 清除所有模态框
     */
    function clearAllModals() {
        // 移除所有可能的模态框
        const modalSelectors = [
            '#json-preview-modal',
            '[id$="-modal"]',
            '[class*="modal"]',
            '[style*="z-index: 10001"]'
        ];

        modalSelectors.forEach(selector => {
            const modals = document.querySelectorAll(selector);
            modals.forEach(modal => modal.remove());
        });

        // 重置弹窗状态
        existDialog = false;
    }

    /**
     * 显示JSON预览模态框
     */
    function showJsonPreviewModal(data) {
        // 如果已存在弹窗，先销毁
        if (existDialog) {
            clearAllModals();
        }

        // 设置弹窗存在标记
        existDialog = true;

        // 创建模态框容器
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'json-preview-modal';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(2px);
        `;

        // 创建模态框内容
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #ffffff;
            border-radius: 8px;
            padding: 20px;
            max-width: 90%;
            max-height: 80%;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            min-width: 600px;
        `;

        // 标题栏
        const modalHeader = document.createElement('div');
        modalHeader.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e9ecef;
        `;
        modalHeader.innerHTML = `
            <h3 style="margin: 0; color: #536471; font-size: 15px; font-weight: 500;">JSON数据预览 (${data.dataCount}条)</h3>
            <div>
                <button id="copy-json-btn" style="
                    background: white;
                    color: #17b26a;
                    border: 1px solid #17b26a;
                    border-radius: 4px;
                    padding: 6px 12px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-right: 6px;
                    font-weight: 400;
                ">复制</button>
                <button id="close-modal-btn" style="
                    background: white;
                    color: #9aa0a6;
                    border: 1px solid #9aa0a6;
                    border-radius: 4px;
                    padding: 6px 12px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 400;
                ">关闭</button>
            </div>
        `;

        // JSON内容区域
        const jsonContent = document.createElement('pre');
        jsonContent.style.cssText = `
            background: #f8f9fa;
            border: 1px solid #e1e8ed;
            border-radius: 4px;
            padding: 12px;
            margin: 0;
            overflow: auto;
            flex: 1;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            color: #536471;
            white-space: pre-wrap;
            word-wrap: break-word;
        `;
        jsonContent.textContent = JSON.stringify(data, null, 2);

        // 组装模态框
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(jsonContent);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        // 绑定事件
        const closeBtn = document.getElementById('close-modal-btn');
        const copyBtn = document.getElementById('copy-json-btn');

        // 添加悬停效果
        copyBtn.addEventListener('mouseenter', () => {
            copyBtn.style.background = '#17b26a';
            copyBtn.style.color = 'white';
        });
        copyBtn.addEventListener('mouseleave', () => {
            copyBtn.style.background = 'white';
            copyBtn.style.color = '#17b26a';
        });

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = '#9aa0a6';
            closeBtn.style.color = 'white';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'white';
            closeBtn.style.color = '#9aa0a6';
        });

        closeBtn.addEventListener('click', () => {
            modalOverlay.remove();
            existDialog = false;
        });

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
                showInfoInPanel('JSON数据已复制到剪贴板');
            }).catch(() => {
                showInfoInPanel('复制失败，请手动选择复制');
            });
        });

        // 点击背景关闭
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
                existDialog = false;
            }
        });

        // ESC键关闭
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modalOverlay.remove();
                existDialog = false;
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    /**
     * 显示字段过滤配置对话框
     * @returns {Promise<Array|null>} 返回要过滤的字段数组，如果用户取消则返回null
     */
    function showFilterFieldsDialog() {
        return new Promise((resolve) => {
            // 如果已存在弹窗，先销毁
            if (existDialog) {
                clearAllModals();
            }

            // 设置弹窗存在标记
            existDialog = true;

            // 创建模态框容器
            const modalOverlay = document.createElement('div');
            modalOverlay.id = 'filter-fields-modal';
            modalOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(2px);
            `;

            // 创建模态框内容
            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: #ffffff;
                border-radius: 8px;
                padding: 20px;
                max-width: 500px;
                width: 90%;
                max-height: 80%;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
            `;

            // 标题栏
            const modalHeader = document.createElement('div');
            modalHeader.style.cssText = `
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #e9ecef;
            `;
            modalHeader.innerHTML = `
                <h3 style="margin: 0; color: #536471; font-size: 15px; font-weight: 500;">配置过滤字段</h3>
                <p style="margin: 8px 0 0 0; color: #8a9ba6; font-size: 12px;">选择要在响应体中过滤掉的字段名，每行一个</p>
            `;

            // 字段输入区域
            const inputArea = document.createElement('textarea');
            inputArea.id = 'filter-fields-input';
            inputArea.value = currentFilterFields.join('\n');
            inputArea.style.cssText = `
                width: 100%;
                height: 200px;
                border: 1px solid #e1e8ed;
                border-radius: 4px;
                padding: 10px;
                font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
                font-size: 12px;
                line-height: 1.4;
                resize: vertical;
                margin-bottom: 15px;
                box-sizing: border-box;
            `;
            inputArea.placeholder = '请输入要过滤的字段名，每行一个\n例如：\ncode\nmsg\nret\nextend\n\n留空则不过滤任何字段';

            // 按钮区域
            const buttonArea = document.createElement('div');
            buttonArea.style.cssText = `
                display: flex;
                justify-content: flex-end;
                gap: 8px;
            `;

            // 取消按钮
            const cancelButton = document.createElement('button');
            cancelButton.textContent = '取消';
            cancelButton.style.cssText = `
                background: white;
                color: #9aa0a6;
                border: 1px solid #9aa0a6;
                border-radius: 4px;
                padding: 8px 16px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 400;
            `;

            // 确定按钮
            const confirmButton = document.createElement('button');
            confirmButton.textContent = '确定';
            confirmButton.style.cssText = `
                background: white;
                color: #7c3aed;
                border: 1px solid #7c3aed;
                border-radius: 4px;
                padding: 8px 16px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 400;
            `;

            // 重置按钮
            const resetButton = document.createElement('button');
            resetButton.textContent = '重置为默认';
            resetButton.style.cssText = `
                background: white;
                color: #ef6820;
                border: 1px solid #ef6820;
                border-radius: 4px;
                padding: 8px 16px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 400;
                margin-right: auto;
            `;

            // 添加按钮悬停效果
            const addButtonHoverEffects = (button, bgColor) => {
                button.addEventListener('mouseenter', () => {
                    button.style.background = bgColor;
                    button.style.color = 'white';
                });
                button.addEventListener('mouseleave', () => {
                    button.style.background = 'white';
                    button.style.color = bgColor;
                });
            };

            addButtonHoverEffects(cancelButton, '#9aa0a6');
            addButtonHoverEffects(confirmButton, '#7c3aed');
            addButtonHoverEffects(resetButton, '#ef6820');

            // 组装模态框
            buttonArea.appendChild(resetButton);
            buttonArea.appendChild(cancelButton);
            buttonArea.appendChild(confirmButton);

            modalContent.appendChild(modalHeader);
            modalContent.appendChild(inputArea);
            modalContent.appendChild(buttonArea);
            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);

            // 事件处理
            const cleanup = () => {
                modalOverlay.remove();
                existDialog = false;
            };

            // 取消按钮事件
            cancelButton.addEventListener('click', () => {
                cleanup();
                resolve(null);
            });

            // 确定按钮事件
            confirmButton.addEventListener('click', () => {
                const inputValue = inputArea.value.trim();
                const filterFields = inputValue
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);

                cleanup();
                resolve(filterFields);
            });

            // 重置按钮事件
            resetButton.addEventListener('click', () => {
                inputArea.value = DEFAULT_FILTER_FIELDS.join('\n');
            });

            // 点击背景关闭
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    cleanup();
                    resolve(null);
                }
            });

            // ESC键关闭
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    resolve(null);
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);

            // 聚焦到输入框
            setTimeout(() => inputArea.focus(), 100);
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }

})();
