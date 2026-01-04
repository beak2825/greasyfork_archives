// ==UserScript==
// @name         展示自动化用例id，支持拖拽到文本，支持复制
// @namespace    http://tampermonkey.net/
// @version      1.9.3
// @description  展示用例id，支持拖拽到文本，支持复制（整合重复代码）
// @author       lulu
// @match        https://octopuses.myshopline.com/*/*
// @grant        none
// @run-at      document-interactive
// @require https://update.greasyfork.org/scripts/548898/1716021/Toast%E7%BB%84%E4%BB%B6%E6%A8%A1%E5%9D%97.js
// @downloadURL https://update.greasyfork.org/scripts/539530/%E5%B1%95%E7%A4%BA%E8%87%AA%E5%8A%A8%E5%8C%96%E7%94%A8%E4%BE%8Bid%EF%BC%8C%E6%94%AF%E6%8C%81%E6%8B%96%E6%8B%BD%E5%88%B0%E6%96%87%E6%9C%AC%EF%BC%8C%E6%94%AF%E6%8C%81%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/539530/%E5%B1%95%E7%A4%BA%E8%87%AA%E5%8A%A8%E5%8C%96%E7%94%A8%E4%BE%8Bid%EF%BC%8C%E6%94%AF%E6%8C%81%E6%8B%96%E6%8B%BD%E5%88%B0%E6%96%87%E6%9C%AC%EF%BC%8C%E6%94%AF%E6%8C%81%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const style = document.createElement('style');
    style.textContent = `
       .domain-row {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 16px;
            width: 100%;
        }
        
        /* 调整每个输入项的宽度和间距 */
        .domain-item {
            flex: 1;
            margin-right: 16px;
            display: flex;
            align-items: center;
        }
        
        .domain-item:last-child {
            margin-right: 0;
        }
        
        /* 标签样式调整 */
        .domain-label {
            display: inline-block;
            width: 60px;
            margin-right: 8px;
            text-align: right;
        }
        
        /* 输入框样式 */
        .domain-input {
            flex: 1;
            min-width: 0;
        }
        
        /* 备注项特殊样式 */
        .remark-item .domain-label {
            width: 50px;
        }
                        /* 提示容器：相对定位，用于控制文案位置 */
            .tooltip-container {
                position: relative;
                display: inline-block;
                margin-left: 8px; /* 与标题保持间距 */
                cursor: help; /* 鼠标悬停时显示问号指针 */
            }

            /* 提示图标：使用警告色增强视觉提示 */
            .tooltip-icon {
                color: #faad14; /* 蚂蚁设计警告色 */
                vertical-align: middle; /* 与文字垂直居中对齐 */
            }

            /* 提示文案：默认隐藏，绝对定位在图标下方 */
            .tooltip-text {
                visibility: hidden;
                position: absolute;
                bottom: 100%; /* 显示在图标上方 */
                left: 50%;
                transform: translateX(-50%); /* 水平居中 */
                white-space: nowrap; /* 不换行 */
                padding: 4px 8px;
                font-size: 12px;
                color: #fff;
                background-color: rgba(0, 0, 0, 0.7); /* 半透明黑底 */
                border-radius: 2px;
                margin-bottom: 6px; /* 与图标保持间距 */
                z-index: 100; /* 确保不会被其他元素遮挡 */
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* 轻微阴影增强层次感 */
            }

            /* 添加上三角箭头（可选） */
            .tooltip-text::after {
                content: '';
                position: absolute;
                top: 100%; /* 箭头指向图标 */
                left: 50%;
                transform: translateX(-50%);
                border-width: 4px;
                border-style: solid;
                border-color: rgba(0, 0, 0, 0.7) transparent transparent transparent;
            }

            /* 鼠标悬停时显示提示文案 */
            .tooltip-container:hover .tooltip-text {
                visibility: visible;
            }
        `;

    // 提取方括号内内容的函数
    function extractBracketContent(title) {
        const matches = title.match(/\[([^\]]+)\]/);
        return matches ? matches[1] : null;
    }

    // 查找最近的输入框子元素
    function findInputElement(element) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            return element;
        }
        const input = element.querySelector('input, textarea');
        return input || null;
    }

    // 移除copy文案
    function removeTheCopyText(str) {
        const startWithCopyRegex = /^\[复制\]+/;
        // 正则：匹配所有[复制]（用于全局移除）
        const allCopyRegex = /\[复制\]/g;
        
        // 判断是否以连续多个[复制]开头
        const isStartWithMultipleCopy = startWithCopyRegex.test(str);
        
        // 移除所有[复制]字符
        const result = str.replace(allCopyRegex, '');
        
        return result;
    }
    // 更新用例名称
    function updateCaseName(envName=''){
        const caseName = document.querySelector("#case_tabs > div.ant-tabs-content.ant-tabs-content-no-animated.ant-tabs-top-content.ant-tabs-card-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.__vuescroll.hasVBar > div.__panel > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > span.ant-input-affix-wrapper.ant-input-affix-wrapper-textarea-with-clear-btn > textarea")
        if (caseName !=null){
            console.log("caseName1:",caseName.value);
            if (caseName.value.startsWith('[复制]')) {
                caseName.value = removeTheCopyText(caseName.value);
                caseName.dispatchEvent(new Event('input', { bubbles: true })); 
            }
            console.log("caseName2:",caseName.value);
            if(envName!=null && envName != ''){
                caseName.value = caseName.value + '-' + envName;
                caseName.dispatchEvent(new Event('input', { bubbles: true })); 
            }   
        }
        
    }
    // 自动添加后缀
    function caseNameAddText(url){
        const oldDomain = localStorage.getItem('oldDomain');
        // const newDomain = localStorage.getItem('newDomain');
        const oldRemark = localStorage.getItem('oldDomainRemark');
        const newRemark = localStorage.getItem('newDomainRemark'); 
        if (oldDomain && url.includes(normalizedOldDomain)) {
            return oldRemark || '';
        }
        return newRemark || '';
    }

    // 添加点击事件监听（整个页面范围内）
    // document.addEventListener('click', debounce(updateCaseName, 300)); // 防抖时间300ms

    // 防抖函数（避免短时间内多次触发）
    function debounce(func, wait) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, wait);
        };
    }

    // 解除限制
    function enableTargetButton() {
        document.querySelectorAll('button.ant-btn.ant-btn-primary[disabled]').forEach(button => {
            button.removeAttribute('disabled');
        });
    }


    // 删除特定内容且具有特定属性的div元素
    function removeTargetDivs() {
        const targetText = '请输入所依赖的前置用例的ID或名称进行搜索并选择';
        const divs = document.querySelectorAll('div[unselectable="on"]');
        divs.forEach(div => {
            if (div.textContent.trim() === targetText) {
                div.remove();
                console.log('已删除匹配的div元素');
            }
        });
    }

    // 为元素添加拖拽和复制功能
    function setupDraggableAndCopy(element, getContent, no_draggable) {
        if (no_draggable) {
            element.draggable = true;
        }; // 避免重复绑定


        // 拖拽事件处理
        element.addEventListener('dragstart', function (e) {
            const content = getContent();
            if (content) {
                e.dataTransfer.setData('text/plain', content);
                // 临时样式（不覆盖原有样式）
                element.style.cursor = 'grabbing';
                element.style.opacity = '0.7';
                element.style.transform = 'scale(1.05)';
            }
        });

        element.addEventListener('dragend', function () {
            console.log('dragend事件已触发');
            element.style.cursor = '';
            element.style.opacity = '';
            element.style.transform = '';
        });

        // 双击复制功能
        element.addEventListener('dblclick', function () {
            const content = getContent();
            if (content) {
                const style = window.getComputedStyle(element);
                navigator.clipboard.writeText(content)
                    .then(() => {
                        element.style.backgroundColor = "green";
                        const originalBg = element.style.backgroundColor;
                        const originalColor = element.style.color;
                        setTimeout(() => {
                            MonkeyToast.show('名称/id已复制到剪贴板');
                            // 保存原有样式
                            element.style.backgroundColor = "#f0f0f0";
                            element.style.color = "#333";
                        }, 1000);
                    })
                    .catch(err => {
                        console.error('复制失败: ', err);
                        alert('复制失败，请手动复制: ' + content);
                    });
            }
        });
    }
    // 处理oneTree_开头的a标签
    function setupOneTreeATags() {
        const aElements = document.querySelectorAll('a[id^="oneTree_"]');
        aElements.forEach(aElement => {
            const title = aElement.getAttribute('title');
            if (title) {
                const bracketContent = extractBracketContent(title);
                if (!bracketContent) return;

                const existingSpan = aElement.previousElementSibling;
                if (existingSpan && existingSpan.classList.contains('oneTree-title-span')) {
                    existingSpan.textContent = bracketContent;
                    return;
                }

                // 创建新的span元素
                const spanElement = document.createElement('span');
                spanElement.textContent = bracketContent;
                spanElement.className = 'oneTree-title-span';
                spanElement.title = '双击复制内容，拖拽到输入框粘贴';
                spanElement.style.cssText = `
                    display: inline-block;
                    margin-right: 8px;
                    padding: 2px 6px;
                    background-color: #f0f0f0;
                    color: #333;
                    border-radius: 3px;
                    font-size: 12px;
                    vertical-align: middle;
                    cursor: grab;
                    transition: all 0.2s;
                    user-select: none;
                `;

                // 添加拖拽和复制功能
                setupDraggableAndCopy(spanElement, () => bracketContent, true);

                aElement.parentNode.insertBefore(spanElement, aElement);
            }
        });
    }

    function setupDynamicSpanDraggable() {
        // 匹配两类元素（保留原有ID选择器，同时添加class条件）
        const dynamicSpans1 = document.querySelectorAll('span[id^="oneTree_"][id$="_switch"].button.switch.noline_docu');
        const dynamicSpans2 = document.querySelectorAll('span[id^="oneTree_"][id$="_span"]');

        // console.log("dynamicSpans1：",dynamicSpans1);
        // console.log("dynamicSpans2:",dynamicSpans2);

        // SVG图标代码（添加内联样式优化显示）
        const svgIcon = `
        <svg width="14" height="14" viewBox="0 0 48 48" fill="none" 
            style="display: inline-block; vertical-align: middle; margin-right: 4px;">
            <path d="M20 14L34 24L20 34" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10 24H20" stroke="#333" stroke-width="3" stroke-linecap="round" />
        </svg>`;

        // 构建ID映射表
        const idMap = new Map();
        dynamicSpans2.forEach(span2 => {
            const id = span2.id;
            if (id) {
                const commonId = id.replace(/_span$/, '');
                idMap.set(commonId, span2);
            }
        });

        // 为dynamicSpans1添加图标和功能
        dynamicSpans1.forEach(span1 => {
            const id = span1.id;
            if (id) {
                const commonId = id.replace(/_switch$/, '');
                const targetSpan2 = idMap.get(commonId);

                // if (targetSpan2) {
                // 保存原始文本并插入图标
                const originalText = span1.textContent || '';
                span1.innerHTML = svgIcon + originalText;

                // 保留原有样式，微调间距
                span1.style.paddingLeft = '2px';
                span1.style.cursor = 'pointer';

                // 添加拖拽和复制功能
                setupDraggableAndCopy(span1, () => targetSpan2.textContent.trim(), true);

                // 增强交互提示
                span1.title = `双击复制: ${targetSpan2.textContent.trim()}`;
                // }
            }
        });
    }

    // 分离处理节点的逻辑
    function handleNode(node) {
        if (node.nodeType === 1) { // 只处理元素节点
            // 检查子节点
            if (node.querySelectorAll) {
                // 处理span元素
                const spanElements = node.querySelectorAll('span[id^="oneTree_"][id$="_span"]');
                if (spanElements.length > 0) {
                    spanElements.forEach(span => {
                        setupDynamicSpanDraggable(span);
                        // console.log("打印3333，处理span:", span.id);
                    });
                }

                // 处理a元素
                const aElements = node.querySelectorAll('a[id^="oneTree_"]');
                if (aElements.length > 0) {
                    aElements.forEach(a => {
                        // console.log("打印4444，处理a:", a.id);
                        setupOneTreeATags(a);
                    });
                }
            }
        }
    }
    // 子元素监听初始化
    function observerInit() {
        // DOM变化监听
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // 观察子节点变化和属性变化
                if ((mutation.type === 'childList' && mutation.addedNodes.length > 0) ||
                    (mutation.type === 'attributes' && mutation.attributeName === 'id')) {
                    removeTargetDivs();
                    updateCaseName();
                    // 处理新增节点
                    const addedNodes = Array.from(mutation.addedNodes);
                    addedNodes.forEach(node => {
                        handleNode(node);
                        
                    });

                    // 处理现有节点（如果有属性变化）
                    if (mutation.type === 'attributes' && mutation.target.nodeType === 1) {
                        handleNode(mutation.target);
                        
                    }
                }
            });
        });

        // 配置观察器，观察子节点和属性变化
        observer.observe(document.body, {
            childList: true,
            attributes: true,
            subtree: true,
            attributeFilter: ['id'] // 只观察id属性变化
        });

        return observer;
    }
    // 拖拽事件初始化
    function dragoverinit() {
        // 拖拽目标高亮效果
        let currentDropTarget = null;
        document.addEventListener('dragover', function (e) {
            const input = findInputElement(e.target);
            if (input) {
                e.preventDefault();
                e.stopPropagation();
                if (currentDropTarget !== input) {
                    if (currentDropTarget) currentDropTarget.style.outline = '';
                    currentDropTarget = input;
                    input.style.outline = '2px solid #2196F3';
                }
            }
        });

        // 其他事件处理保持不变
        document.addEventListener('dragleave', function (e) {
            if (!e.target.contains(e.relatedTarget)) {
                if (currentDropTarget) {
                    currentDropTarget.style.outline = '';
                    currentDropTarget = null;
                }
            }
        });

        document.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const input = findInputElement(e.target);
            if (input) {
                const data = e.dataTransfer.getData('text/plain');
                const start = input.selectionStart;
                const end = input.selectionEnd;
                input.value = input.value.substring(0, start) + data + input.value.substring(end);
                input.selectionStart = input.selectionEnd = start + data.length;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.style.backgroundColor = '#E8F5E9';
                setTimeout(() => {
                    input.style.backgroundColor = input.getAttribute('data-original-bg') || '';
                }, 300);
                if (currentDropTarget) {
                    currentDropTarget.style.outline = '';
                    currentDropTarget = null;
                }

                // 拖拽成功后删除特定div元素
                removeTargetDivs();
            }
        });

    }
    // 添加环境按钮
    function addEvnButton(id,name) {
        const firstButton = document.querySelector("#app > section > section > main > div > div > div > div > div.ant-pro-page-header-wrap-page-header-warp > div > div > div.ant-page-header-heading > span.ant-page-header-heading-extra > button:nth-child(1)");
        const newButtonId = `#${id}`
        if (document.querySelector(newButtonId)) {
            // console.log('自定义按钮已存在，跳过添加');
            return null;
        }
        else {
            // console.log("开始初始化",firstButton)
            const newButton = firstButton.cloneNode(true);
            newButton.id = id;
            newButton.textContent = name;
            newButton.addEventListener('click', () => {
                // 在这里添加切换环境的逻辑
                switchToGoEnv(newButtonId);
            });
            // 在目标按钮前插入新按钮
            firstButton.parentNode.insertBefore(newButton, firstButton);
        }
    }
    //切换go环境
    function switchToGoEnv(id) {
        if (document.querySelector('#go-env-div')) {
            return; // 避免重复创建
        }

        // 关闭模态框的处理函数（提前定义，确保作用域正确）
        function handleClose(e) {
            e.stopPropagation(); // 阻止事件冒泡到父元素
            const modal = document.getElementById('go-env-div'); // 注意ID匹配
            if (modal) {
                // 淡出动画
                modal.style.opacity = '0';
                modal.style.transition = 'opacity 0.5s ease';
                // 动画结束后移除
                setTimeout(() => modal.remove(), 300);
            }
        }

        // 绑定关闭事件（修正选择器和时机）
        function setupCloseEvent() {
            // 1. 直接通过ID获取关闭图标（最可靠）
            const closeIcon = document.getElementById('custom-close-icon');
            if (closeIcon) {
                closeIcon.addEventListener('click', handleClose);
            } else {
                console.warn('关闭图标未找到，尝试备选方案');
            }
            // 2. 通过模态框ID定位关闭按钮容器（备选方案，确保选择器正确）
            const closeButton = document.querySelector('#go-env-div .ant-modal-close');
            if (closeButton) {
                closeButton.addEventListener('click', handleClose);
            } else {
                console.warn('关闭按钮容器未找到');
            }

            // 3. 为遮罩层添加点击关闭（增强用户体验）
            const mask = document.querySelector('#go-env-div .ant-modal-mask');
            if (mask) {
                mask.addEventListener('click', handleClose);
            }
        }


        // 添加保存按钮事件
        function setupSaveEvent() {
            const saveBtn = document.getElementById('save-domain-btn');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    const oldDomain = document.getElementById('old-domain-input').value;
                    const newDomain = document.getElementById('new-domain-input').value;
                    // 获取备注信息
                    const oldRemark = document.getElementById('old-domain-remark').value;
                    const newRemark = document.getElementById('new-domain-remark').value;

                    if (!oldDomain || !newDomain || !oldRemark || !newRemark) {
                        MonkeyToast.show('请输入完整的信息');
                        return;
                    }
                    
                    // 保存配置逻辑，包括备注信息
                    localStorage.setItem('oldDomain', oldDomain);
                    localStorage.setItem('newDomain', newDomain);
                    localStorage.setItem('oldDomainRemark', oldRemark);
                    localStorage.setItem('newDomainRemark', newRemark);

                    // 显示保存成功提示
                    MonkeyToast.show('配置保存成功');

                    // 关闭模态框
                    handleClose({ stopPropagation: () => { } });
                });
            }
        }

        // 回显保存的数据，包括备注信息
        function loadSavedDomains() {
            const oldDomain = localStorage.getItem('oldDomain');
            const newDomain = localStorage.getItem('newDomain');
            const oldRemark = localStorage.getItem('oldDomainRemark');
            const newRemark = localStorage.getItem('newDomainRemark');

            if (oldDomain) {
                document.getElementById('old-domain-input').value = oldDomain;
            }

            if (newDomain) {
                document.getElementById('new-domain-input').value = newDomain;
            }
            
            // 回显备注信息
            if (oldRemark) {
                document.getElementById('old-domain-remark').value = oldRemark;
            }

            if (newRemark) {
                document.getElementById('new-domain-remark').value = newRemark;
            }
        }
        // 在setupCloseEvent之后添加保存事件绑定
        function setupEvents() {
            setupCloseEvent();
            setupSaveEvent();
            loadSavedDomains(); // 加载保存的数据
        }
        // 模态框HTML结构（注意外层ID是go-env-div）
        const modalHTML = `
            <div id="go-env-div" class="ant-modal-root">
                <div class="ant-modal-mask"></div>
                <div tabindex="-1" role="dialog" aria-labelledby="customDialogTitle0" class="ant-modal-wrap ant-modal-centered">
                    <div role="document" class="ant-modal" style="width: 800px; transform-origin: center center;">
                        <div tabindex="0" aria-hidden="true" style="width: 0px; height: 0px; overflow: hidden;"></div>
                        <div class="ant-modal-content">
                        
                            <button type="button" aria-label="Close" class="ant-modal-close">
                                <span class="ant-modal-close-x">
                                    <i aria-label="图标: close" class="anticon anticon-close ant-modal-close-icon">
                                        <svg id="custom-close-icon" viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
                                            <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                                        </svg>
                                    </i>
                                </span>
                            </button>
                            <div class="ant-modal-header">
                                <div id="customDialogTitle0" class="ant-modal-title">
                                    替换转go域名
                                    <!-- 提示图标容器（使用相对定位包裹SVG和提示文案） -->
                                    <div class="tooltip-container">
                                        <svg viewBox="64 64 896 896" data-icon="exclamation-circle" width="0.8em" height="0.8em" fill="#faad14" aria-hidden="true" focusable="false" class="tooltip-icon">
                                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path>
                                        </svg>
                                        <!-- 提示文案（默认隐藏，hover时显示） -->
                                        <div class="tooltip-text">请确保环境中已配置变量</div>
                                    </div>
                                </div>
                            </div>
                            <div class="ant-modal-body">
                                <div class="domain-config-container">
                                    <!-- 原域名及备注（横向排列） -->
                                    <div class="domain-row">
                                        <div class="domain-item">
                                            <label class="domain-label">原域名:</label>
                                            <input type="text" class="ant-input domain-input" id="old-domain-input" placeholder="请输入原域名环境变量格式，如：\${java_host}">
                                        </div>
                                        <div class="domain-item remark-item">
                                            <label class="domain-label">备注:</label>
                                            <input type="text" class="ant-input domain-input" id="old-domain-remark" placeholder="请输入原域名的服务类型:java">
                                        </div>
                                    </div>
                                    
                                    <!-- 新域名及备注（横向排列） -->
                                    <div class="domain-row">
                                        <div class="domain-item">
                                            <label class="domain-label">新域名:</label>
                                            <input type="text" class="ant-input domain-input" id="new-domain-input" placeholder="请输入新域名环境变量格式，如：\${go_host}">
                                        </div>
                                        <div class="domain-item remark-item">
                                            <label class="domain-label">备注:</label>
                                            <input type="text" class="ant-input domain-input" id="new-domain-remark" placeholder="请输入原域名的服务类型:go">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="ant-modal-footer">
                                <button type="button" id="save-domain-btn" class="ant-btn ant-btn-primary">
                                    保存配置
                                </button>
                            </div>
                        </div>
                        <div tabindex="0" aria-hidden="true" style="width: 0px; height: 0px; overflow: hidden;"></div>
                    </div>
                </div>
            </div>
            `;
        // 插入模态框到页面
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.head.appendChild(style);
        // 关键修复：使用setTimeout确保DOM已渲染完成再绑定事件
        setTimeout(setupEvents, 0);
    }

    // 等待 Vue 对象加载
    function waitForVue() {
        return new Promise(resolve => {
            if (window.Vue) {
                resolve(window.Vue);
                return;
            }

            // 监听 script 标签加载
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.tagName === 'SCRIPT' && window.Vue) {
                            observer.disconnect();
                            resolve(window.Vue);
                            return;
                        }
                    }
                }
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        });
    }

    // 监听 Vue 实例挂载
    function watchVueInstances() {
        // 检查现有元素
        checkExistingElements();

        // 监听新元素添加
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // 元素节点
                        checkElement(node);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 检查现有元素
    function checkExistingElements() {
        document.querySelectorAll('*').forEach(el => checkElement(el));
    }

    // 检查元素是否是 Vue 实例
    function checkElement(el) {
        // Vue 2.x 实例
        if (el.__vue__) {
            handleVueInstance(el.__vue__);
            return;
        }

        // Vue 3.x 实例（通过 appContext 检测）
        const appContext = el.__vue_app__;
        if (appContext) {
            handleVueInstance(appContext.config.globalProperties);
            return;
        }

        // 检查元素属性是否包含 Vue 特征
        if (el.hasAttribute('vue-app') || el.hasAttribute('v-app')) {
            // 等待 Vue 实例挂载
            setTimeout(() => {
                if (el.__vue__) {
                    handleVueInstance(el.__vue__);
                }
            }, 100);
        }
    }

    // 处理找到的 Vue 实例
    function handleVueInstance(vm) {
        // console.log('找到 Vue 实例:', vm);

        // 如果是组件实例，监听其挂载完成
        if (vm.$el && vm.$el.parentNode) {
            // console.log('Vue 组件已挂载');
            // 执行你的脚本逻辑
            initializePage(vm);
        }

        // 对于 Vue 3，监听 app.mount()
        if (vm._instance && vm._instance.isMounted) {
            console.log('Vue 3 应用已挂载');
            initializePage(vm);
        }
    }

    function replaceUrlFromLocalStorage(storageKeyA, storageKeyB, url) {
        // 1. 从localStorage读取两个变量
        const valueA = localStorage.getItem(storageKeyA);
        const valueB = localStorage.getItem(storageKeyB);

        // 2. 校验缓存数据是否存在且为字符串
        if (valueA === null || valueB === null) {
            console.warn(`localStorage中缺少键：${!valueA ? storageKeyA : storageKeyB}`);
            return url;
        }
        if (typeof valueA !== 'string' || typeof valueB !== 'string') {
            console.warn('localStorage中的变量必须是字符串类型');
            return url;
        }

        // 3. 判断URL是否包含valueA，若包含则替换为valueB
        if (url.includes(valueA)) {
            const newUrl = url.replace(valueA, valueB);
            console.log(`URL替换完成：将"${valueA}"替换为"${valueB}"`, {
                原始URL: url,
                新URL: newUrl
            });
            return newUrl;
        }
        if (url.includes(valueB)) {
            const newUrl = url.replace(valueB, valueA);
            console.log(`URL替换完成：将"${valueB}"替换为"${valueA}"`, {
                原始URL: url,
                新URL: newUrl
            });
            return newUrl;
        }
        // 4. 不包含则返回原始URL
        return url;
    }

    function setupInterceptor() {
        let caseId = null;
        const OriginalXHR = window.XMLHttpRequest;

        // 完全重写XMLHttpRequest构造函数
        window.XMLHttpRequest = function() {
            const xhr = new OriginalXHR();
            const self = this;
            
            // 存储请求信息
            let method, url;
            let requestId = Math.random().toString(36).substr(2, 9);
            
            // 存储修改后的响应和内部状态
            let modifiedResponse = null;
            let responseProcessed = false;
            // 使用内部变量存储状态，避免直接修改XHR属性
            let internalState = {
                readyState: 0,
                status: 0,
                statusText: ''
            };

            // 代理所有属性访问
            const proxyProperties = ['responseText', 'response', 'status', 'statusText', 'readyState'];
            proxyProperties.forEach(prop => {
                Object.defineProperty(this, prop, {
                    get: function() {
                        // 对于responseText和response，返回修改后的值
                        if (prop === 'responseText' && responseProcessed && modifiedResponse) {
                            return modifiedResponse;
                        }
                        if (prop === 'response' && responseProcessed && modifiedResponse) {
                            try {
                                return JSON.parse(modifiedResponse);
                            } catch (e) {
                                return modifiedResponse;
                            }
                        }
                        // 对于状态属性，返回内部存储的值
                        if (['readyState', 'status', 'statusText'].includes(prop)) {
                            return internalState[prop];
                        }
                        // 其他情况返回原始值
                        return xhr[prop];
                    },
                    // 不提供setter，避免尝试修改只读属性
                    configurable: true
                });
            });

            // 代理open方法
            this.open = function() {
                method = arguments[0];
                url = arguments[1];
                // 重置状态
                modifiedResponse = null;
                responseProcessed = false;
                internalState = {
                    readyState: 0,
                    status: 0,
                    statusText: ''
                };
                return xhr.open.apply(xhr, arguments);
            };

            // 代理send方法
            this.send = function() {
                return xhr.send.apply(xhr, arguments);
            };

            // 代理事件监听
            this.addEventListener = function(type, listener) {
                // 拦截readystatechange事件
                if (type === 'readystatechange') {
                    xhr.addEventListener(type, function() {
                        // 更新内部状态，而不是直接修改XHR属性
                        internalState.readyState = xhr.readyState;
                        internalState.status = xhr.status;
                        internalState.statusText = xhr.statusText;

                        // 当响应完成时处理
                        if (xhr.readyState === 4 && !responseProcessed) {
                            processResponse();
                        }

                        // 调用原始监听器，绑定到代理对象
                        listener.apply(self, arguments);
                    });
                } else {
                    // 其他事件直接代理
                    xhr.addEventListener(type, function(event) {
                        // 创建新事件，将target指向代理对象
                        const newEvent = new Event(type);
                        Object.assign(newEvent, event);
                        newEvent.target = self;
                        listener.call(self, newEvent);
                    });
                }
            };

            // 处理onreadystatechange属性
            Object.defineProperty(this, 'onreadystatechange', {
                get: function() {
                    return xhr.onreadystatechange;
                },
                set: function(cb) {
                    xhr.onreadystatechange = function() {
                        // 更新内部状态
                        internalState.readyState = xhr.readyState;
                        internalState.status = xhr.status;
                        internalState.statusText = xhr.statusText;

                        // 当响应完成时处理
                        if (xhr.readyState === 4 && !responseProcessed) {
                            processResponse();
                        }

                        // 调用原始回调，绑定到代理对象
                        if (cb) cb.apply(self, arguments);
                    };
                }
            });

            // 其他常用方法代理
            ['abort', 'getAllResponseHeaders', 'getResponseHeader', 'overrideMimeType', 'setRequestHeader'].forEach(method => {
                this[method] = function() {
                    return xhr[method].apply(xhr, arguments);
                };
            });

            // 处理响应的核心函数
            function processResponse() {
                try {
                    // 处理绑定关系接口
                    if (url.includes("/autotest/cases/case/relation/bind")) {
                        updateCaseName('-gogogogogo')
                        const responseData = JSON.parse(xhr.responseText);
                        console.log(`[XHR拦截 #${requestId}] 绑定接口响应:`, responseData);
                        caseId = responseData.data?.caseId || null;
                        modifiedResponse = xhr.responseText; // 不修改此接口响应
                    }
                    // 处理用例详情接口
                    else if (caseId && url.includes(`api/autotest/cases/case?id=${caseId}`)) {
                        const responseData = JSON.parse(xhr.responseText);
                        console.log(`[XHR拦截 #${requestId}] 原始响应:`, responseData);
                        
                        // 修改地址
                        if (responseData.data && responseData.data.address) {
                            responseData.data.address = replaceUrlFromLocalStorage(
                                'oldDomain',
                                'newDomain',
                                responseData.data.address
                            );
                        }
                        
                        modifiedResponse = JSON.stringify(responseData);
                        console.log(`[XHR拦截 #${requestId}] 修改后响应:`, responseData);
                    }
                    // 其他请求不修改
                    else {
                        modifiedResponse = xhr.responseText;
                    }
                } catch (e) {
                    console.error(`[XHR拦截 #${requestId}] 处理响应出错:`, e);
                    modifiedResponse = xhr.responseText; // 出错时使用原始响应
                } finally {
                    responseProcessed = true;
                }
            }

            return this;
        };

        console.log('修复readyState错误的XHR拦截器已启动');
    }

    // 初始化页面逻辑
    function initializePage(vueInstance) {
        // 在这里执行你的脚本逻辑
        // console.log('页面初始化完成，Vue 版本:', 
        // vueInstance.constructor.version || '未知');

        if (vueInstance.$route && vueInstance.$route.path == '/interface/caselist') {
            // console.log('当前路由:', vueInstance.$route.path);
            addEvnButton('go-evn-button1','创建go环境变量1');
            addEvnButton('go-evn-button2','创建go环境变量2');// 添加一个按钮
        }
    }
    // 主函数
    async function main() {
        try {
            // 等待 Vue 加载
            const Vue = await waitForVue();
            console.log('Vue 已加载，版本:', Vue.version);
            // 开始监听 Vue 实例
            watchVueInstances();
        } catch (error) {
            console.error('脚本执行出错:', error);
        }
    }
    setupInterceptor();
    dragoverinit(); // 添加拖拽事件
    observerInit(); // 监听子元素变化
    // 启动脚本
    main();


})();
