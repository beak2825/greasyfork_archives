// ==UserScript==
// @name         论坛小说内容保存
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  获取某会所论坛的小说帖内容，转换为普通文字并进行正则处理，整理为简单的TXT小说格式，提供预览和下载功能。
// @author       羽
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sexinsex.net
// @match        *://sexinsex.net/bbs/*
// @match        *://sis001.com/forum/*
// @match        *://*/bbs/*
// @match        *://*/luntan/*
// @match        *://*/forum/thread*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        unsafeWindow

// @license      MIT License

// @downloadURL https://update.greasyfork.org/scripts/533025/%E8%AE%BA%E5%9D%9B%E5%B0%8F%E8%AF%B4%E5%86%85%E5%AE%B9%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/533025/%E8%AE%BA%E5%9D%9B%E5%B0%8F%E8%AF%B4%E5%86%85%E5%AE%B9%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const CONFIG = {
        panel: { // 面板最大值
            maxWidth: 400, // 文字区域
            maxHeight: 200,
            minWidth: 150, // 最小宽度
            minHeight: 100, // 最小高度
            minContentCount: 2000, // 可判定为文章的最低字符数量
            hideDelay: 300 // 隐藏延迟时间（毫秒）
        },
        position: {
            base: {
                x: window.innerWidth - 70,
                y: 100
            },
            relative: {
                previewPanel: { x: -200, y: 60 }, // 预览面板相对于预览按钮的位置
                previewButton: { x: 0, y: 30 }, // 预览按钮的相对于下载按钮的位置
                downloadButton: { x: 0, y: 0 } // 下载按钮相对于公共位置的位置
            }
        }
    };
    // 默认设置
    const defaultSettings = {
        regular:[
            {
                enable: true,
                description: "去除开头介绍",
                pattern: /^作者[\S\s]+(字数|发表|作者加油)[ \S]+\n\n/gm,
                replacement: ''
            },
            {
                enable: true,
                description: "去除末尾",
                pattern: /\s*\[\]$/gm,
                replacement: ''
            },
            {
                enable: true,
                description: "同段落拼接",
                pattern: /$\r?\n(\S)/gm,
                replacement: '$1'
            },
            {
                enable: true,
                description: "去除分割线",
                pattern: /[ 　\*\-\+\=_—~～]{5,}$/gm,
                replacement: ''
            },
            {
                enable: true,
                description: "去除空行",
                pattern: /(\r?\n){2,}/g,
                replacement: '\n'
            },
            {
                enable: true,
                description: "处理章节名称（例如：0章 -> 第0章）",
                pattern: /^[\s　]*([０-９0-9零一二三四五六七八九十百千万]+[章节回集幕][ \S]*[\S章]+)\s*$/gm,
                replacement: '第$1'
            },
            {
                enable: true,
                description: "处理章节名称（例如：0 -> 第0章）",
                pattern: /^[\s　]*([０-９0-9一二三四五六七八九十百千万]+)[\.、\-]?\s*$/gm,
                replacement: '第$1章'
            },
            {
                enable: true,
                description: "处理章节名称（例如：0 章节名称 -> 第0章 章节名称）",
                pattern: /^[\s　]*[（\[\(]?([０-９0-9零一二三四五六七八九十百千万]+)[ 　\.、\-）\]\)]*([^\s）点个只块头匹人条棵颗朵片张本件间座辆副把台项顶根支首面幅双对堆批群帮伙户家层处所栋扇口声场阵趟顿份次遍番样种列组队字下生世纪年月日夜天时分秒]{1,15})[\s）]*$/gm,
                replacement: '第$1章 $2'
            },
            {
                enable: true,
                description: "章节名称上下间距",
                pattern: /^[\s　]*([\(\[（]?第[０-９0-9零一二三四五六七八九十百千万\s]+[章节回集幕][ \S]*[\S章]+)\s*$/gm,
                replacement: '\n\n\n$1\n'
            },
        ],
    };
    // // 获取当前设置
    let currentSettings = getSettings();
    // 获取保存的位置或使用默认位置
    let pos = GM_getValue('panelPosition', { x: 0, y: 0 });

    // 标题及内容
    let title_content = "暂无标题"; // 默认显示
    let plainText = "暂无内容";
    let pages = 0;
    // 面板状态管理
    let panelState = {
        showAlways: false,
        hideTimeout: null,
        width: CONFIG.panel.maxWidth,
        height: CONFIG.panel.minHeight,
    };
    // 拖动状态参数
    let dragState = {
        isDragging: false,
        lastX: 0,
        lastY: 0,
        currentX: pos.x? pos.x : 0,
        currentY: pos.y? pos.y : 0,
        initialX: 0,
        initialY: 0,
    };

    // 内容处理模块
    const ContentProcessor = {
        // 提取标题
        extractTitle() {
            try {
                let title = "暂无标题";
                // 尝试从 h1 获取标题
                const h1Element = document.querySelector('h1');
                if (h1Element) {
                    title = h1Element.textContent.trim();
                } else {
                    console.warn('未找到 h1 元素。');
                    // 尝试从 header 获取标题
                    const headerDiv = document.querySelector('td.header');
                    if(headerDiv){
                        const titleElement = headerDiv.querySelector('div.title');
                        if(titleElement){
                            title = titleElement.textContent.trim();
                        }
                    }
                }
                // 如果找到了内容且标题不为默认值，尝试从内容区获取标题
                const contentDiv = document.querySelector('div.postmessage.defaultpost');
                if (contentDiv && title != "暂无标题") {
                    const h2Element = contentDiv.querySelector('h2');
                    if (h2Element) {
                        title = h2Element.textContent.trim();
                    }
                } else {
                    console.warn('未找到带有 postmessage defaultpost 类名的 div 元素。');
                }

                return title.length >= 2 ? title : "暂无标题";
            } catch (error) {
                console.error('提取标题时发生错误:', error);
                return "暂无标题";
            }
        },
        // 提取内容
        extractContent() {
            try {
                const selectors = [ 'div.t_msgfont.noSelect', '.message', 'div.t_msgfont' ];
                let elements = null;
                for (const selector of selectors) {
                    elements = document.querySelectorAll(selector);
                    if (elements.length > 0) break;
                }
                if (elements.length < 1) {
                    console.warn('未找到内容元素');
                    return { text: '错误：未找到指定的内容元素！', pages: 0 };
                }
                const textList = [];
                let pageCount = 0;
                elements.forEach(element => {
                    const text = this.processElement(element);
                    if (text.length > CONFIG.panel.minContentCount) {
                        textList.push(text);
                        pageCount++;
                    }
                });
                return {
                    text: textList.length > 0 ? textList.join('\n\n') : '错误：未找到达到字数要求的内容！',
                    pages: pageCount
                };
            } catch (error) {
                console.error('提取内容时发生错误:', error);
                return { text: '错误：提取内容时发生异常！', pages: 0 };
            }
        },
        // 处理单个元素
        processElement(element) {
            const clone = element.cloneNode(true);
            // 移除干扰标签
            const tagsToRemove = ['.dateline', 'strong', 'table', 'i', 'a'];
            tagsToRemove.forEach(tag => {
                const elements = clone.querySelectorAll(tag);
                elements.forEach(el => el.remove());
            });
            // 转换为纯文本
            const tempDiv = document.createElement('div');
            tempDiv.textContent = clone.innerHTML; // 将<br>或<br/>替换为回车
            let text = tempDiv.textContent || tempDiv.innerText || '';
            // 解析并处理文本
            const parser = new DOMParser();
            const doc = parser.parseFromString(`<!doctype html><body>${text}`, 'text/html');
            text = doc.body.textContent;
            // 正则格式化文本
            return processText(text);
        }
    };

    initializeContent(true);

    // 创建一个容器并附加 Shadow DOM
    const container = document.createElement('div');
    container.id = 'tm-container';
    const shadowRoot = container.attachShadow({ mode: 'closed' });

    // 创建悬浮面板并添加调试代码
    const panel = document.createElement('div');
    panel.id = 'floatingPanel';
    panel.className = 'floating-panel';
    panel.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    // 创建预览面板
    const previewPanel = createPreviewPanel();

    // 创建预览按钮
    const previewButton = document.createElement('button');
    previewButton.innerHTML = '预览';
    previewButton.className = 'preview-button';
    previewButton.classList.add('floating-button');

    const downloadButton = document.createElement('button');
    downloadButton.innerHTML = '下载';
    downloadButton.className = 'download-button';
    downloadButton.classList.add('floating-button');

    panel.appendChild(previewPanel);
    panel.appendChild(previewButton);
    panel.appendChild(downloadButton);
    // 将面板添加到 Shadow DOM 中
    shadowRoot.appendChild(panel);
    // 将容器添加到文档中
    document.body.appendChild(container);

    // 添加调试代码
    console.log('悬浮面板已创建:', panel);

    // 拖拽事件处理
    previewButton.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // 预览事件处理
    previewButton.addEventListener('mouseover', () => {
        togglePanelVisibility(true);
        isPanelAtEdge();
        // console.log('悬浮面板已显示',previewPanel.offsetWidth, previewPanel.offsetHeight);
    });
    panel.addEventListener('mouseout', (e) => {
        // 如果鼠标移出了悬浮面板，且悬浮面板不显示，则隐藏预览面板
        if (!e.relatedTarget || panel.contains(e.relatedTarget) || panelState.showAlways) return;
        togglePanelVisibility(false);
    });
    // 下载按钮处理
    downloadButton.addEventListener('click', () => {
        try {
            const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            // downloadButton.style.backgroundColor = '#75B700';
            downloadButton.classList.add('download');
            a.href = url;
            a.download = title_content + '.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            alert('下载失败：' + error.message);
        }
    });
    const previewContent = shadowRoot.querySelector('.preview-content');


    // 初始化内容
    function initializeContent (first = false) {
        // 检查是否有panel-content控件，有则更新内容
        title_content = ContentProcessor.extractTitle();
        const content = ContentProcessor.extractContent();
        plainText = content.text;
        pages = content.pages;
        // 检查是否有panel-content控件，有则更新内容
        if (!first && previewContent) { previewContent.textContent = plainText; }
    };
    // 面板拖拽开始事件处理
    function dragStart(e) {
        dragState.initialX = e.clientX - pos.x;
        dragState.initialY = e.clientY - pos.y;
        dragState.isDragging = true;
    }
    // 面板拖拽事件处理
    function drag(e) {
        if (!dragState.isDragging) return;
        // 阻止默认的拖拽行为
        e.preventDefault();
        // 更新面板位置
        dragState.lastX = dragState.currentX;
        dragState.lastY = dragState.currentY;
        dragState.currentX = e.clientX - dragState.initialX;
        dragState.currentY = e.clientY - dragState.initialY;
        isPanelAtEdge();
    }
    // 面板拖拽结束事件处理
    function dragEnd() {
        if (!dragState.isDragging) return;
        dragState.isDragging = false;
        // 保存位置
        GM_setValue('panelPosition', pos);
    }
    // 面板活动范围边缘判定
    function isPanelAtEdge() {
        // 限定主面板活动范围，并更新位置
        if (!panel) return;
        dragState.currentX = Math.max(5, Math.min(dragState.currentX, window.innerWidth - panel.offsetWidth-20));
        dragState.currentY = Math.max(5, Math.min(dragState.currentY, window.innerHeight - panel.offsetHeight-10));
        pos = { x: dragState.currentX, y: dragState.currentY };
        panel.style.transform = `translate(${dragState.currentX}px, ${dragState.currentY}px)`;
        // 限定预览面板活动范围，并更新位置
        if (!previewPanel) return;
        // 如果贴近边缘，则移动预览面板，保持面板位于窗口内
        const prePanelHalfWidth = previewPanel.offsetWidth/2+5;
        const prePanelHalfMaxWidth = CONFIG.panel.maxWidth/2;
        const panelHalfWidth = panel.offsetWidth/2 ;
        const leftDistance = dragState.currentX-5;
        const rightDistance = window.innerWidth - dragState.currentX - panel.offsetWidth - 20;

        // console.log('当前位置',dragState.currentX,dragState.currentY,
        //     '面板尺寸',previewPanel.offsetWidth,previewPanel.offsetHeight,
        //     '实际尺寸',previewPanel.getBoundingClientRect(),
        //     '面板位置',panelState.width,panelState.height,
        //     '面板状态',previewPanel.classList,
        // );
        let subWidth = 0;
        let subX = 0;
        // 判断高度调整面板位置
        if(dragState.currentY < previewPanel.offsetHeight + 10){
            previewPanel.classList.add('under');
        }else{
            previewPanel.classList.remove('under');
        }
        // 计算面板的宽度
        if (dragState.currentX < prePanelHalfMaxWidth) {
            subWidth = prePanelHalfMaxWidth-dragState.currentX;
        }else if (prePanelHalfMaxWidth > rightDistance) {
            subWidth = prePanelHalfMaxWidth-rightDistance;
        }
        // 计算面板的位置
        if (leftDistance+panelHalfWidth < prePanelHalfWidth) {
            subX = (prePanelHalfWidth-leftDistance-panelHalfWidth);
        }else if (prePanelHalfWidth > rightDistance+panelHalfWidth) {
            subX = rightDistance+panelHalfWidth-prePanelHalfWidth;
        }
        // subWidth = subWidth<0 ? Math.floor(subWidth) : Math.ceil(subWidth);
        subWidth = subWidth<0 ? Math.ceil(subWidth) : Math.floor(subWidth);
        // subWidth = Math.round(subWidth);
        // console.log('面板宽度位移变化',subWidth,subX);
        // 更新面板宽度减去绝对值
        if (previewContent && CONFIG.panel.minWidth<previewPanel.offsetWidth) {
            panelState.width = CONFIG.panel.maxWidth - Math.abs(subWidth);
            previewContent.style.width = panelState.width + 'px';
        }
        previewPanel.style.transform = `translateX(${subX}px)`;
    }
    // 修改预览面板的显示/隐藏逻辑
    function togglePanelVisibility(show, immediate = false) {
        const panel = previewPanel;
        if (!panel) return;
        // 如果正在拖动或设置为始终显示，则保持显示
        if (dragState.isDragging || panelState.showAlways) {
            show = true;
        }
        // 清除之前的隐藏定时器
        if (panelState.hideTimeout) {
            clearTimeout(panelState.hideTimeout);
            panelState.hideTimeout = null;
        }
        if (show) {
            panel.classList.add('show');
            isPanelAtEdge();
        } else if (!immediate) {
            // 延迟隐藏
            panelState.hideTimeout = setTimeout(() => {
                if (!dragState.isDragging && !panelState.showAlways) {
                    panel.classList.remove('show');
                }
            }, CONFIG.panel.hideDelay);
        } else {
            // 立即隐藏
            panel.classList.remove('show');
        }
    }
    // 创建预览面板
    function createPreviewPanel() {
        const panel = document.createElement('div');
        panel.id = 'previewPanel';
        panel.className = 'preview-panel';
        // 创建标题行
        const titleBar = document.createElement('div');
        titleBar.className = 'preview-title-bar';
        titleBar.classList.add('preview-sub');
        // 固定按钮
        const fixedButton = document.createElement('button');
        fixedButton.className = 'fixed-button';
        fixedButton.classList.add('preview-sub');
        fixedButton.classList.add('letter-button');
        fixedButton.textContent = '🔒︎';
        fixedButton.title = '固定'; // tooltip
        // 固定事件
        fixedButton.addEventListener('click', () => {
            panelState.showAlways = !panelState.showAlways;
            fixedButton.classList.toggle('on', panelState.showAlways);
            togglePanelVisibility(true);
        });
        // 标题
        const title = document.createElement('span');
        title.className = 'preview-title';
        title.classList.add('preview-sub');
        title.textContent = title_content;
        title.title = title_content; // tooltip
        // 状态块
        const statePart = document.createElement('span');
        statePart.className = 'state-part';
        statePart.classList.add('preview-sub');
        // 字数统计
        const wordCount = document.createElement('span');
        wordCount.textContent = `字数：${plainText.length}`;
        wordCount.className = 'word-count';
        const pageCount = document.createElement('span');
        pageCount.textContent = `页数：${pages}`;
        pageCount.className = 'page-count';
        // 设置按钮
        const settingButton = document.createElement('button');
        settingButton.className = 'setting-button';
        settingButton.classList.add('preview-sub');
        settingButton.classList.add('letter-button');
        settingButton.textContent = '⚙';
        settingButton.title = '设置'; // tooltip
        settingButton.addEventListener('click', showSettingsPanel);

        // 将标题和字数添加到标题行
        titleBar.appendChild(fixedButton);
        titleBar.appendChild(title);
        titleBar.appendChild(statePart);
        statePart.appendChild(wordCount);
        statePart.appendChild(pageCount);
        statePart.appendChild(settingButton);

        // 创建内容区域
        const content = document.createElement('div');
        content.className = 'preview-content';
        content.classList.add('preview-sub');
        content.textContent = plainText;
        content.contentEditable = true;
        // 检查内容变化
        content.addEventListener('mouseout', () => {
            if(content.textContent!=plainText){
                var isSave = confirm("内容已改变，是否保存修改？");
                if(isSave){
                    plainText = content.textContent;
                    previewButton.classList.add('saved');
                }else{
                    content.textContent = plainText;
                }
            }
        });

        // 将标题行和内容添加到面板
        panel.appendChild(titleBar);
        panel.appendChild(content);
        return panel;
    };

    // 创建设置面板
    const createSettingsPanel = (tempSettings) => {
        if (!tempSettings) {
            tempSettings = settingsToObject();
        }
        // 创建一份当前设置的深拷贝
        const panel = document.createElement('div');
        panel.id = 'settingsPanel';
        panel.className = 'settings-panel';

        // 创建标题栏
        const titleBar = document.createElement('div');
        titleBar.className = 'settings-title-bar';

        const title = document.createElement('span');
        title.textContent = '正则处理设置（注意先后顺序↓）';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '⨉';
        closeBtn.className = 'close-button';
        closeBtn.onclick = () => cleanupPanel(panel);

        titleBar.appendChild(title);
        titleBar.appendChild(closeBtn);
        panel.appendChild(titleBar);

        // 创建内容区域
        const content = document.createElement('div');
        content.className = 'settings-content';

        // 创建正则规则列表
        tempSettings.regular.forEach((rule, index) => {
            const ruleContainer = document.createElement('div');
            ruleContainer.className = 'rule-container';
            // 创建规则头部（标题行）
            const ruleHeader = document.createElement('div');
            ruleHeader.className = 'rule-header';

            // 拖动图标
            const dragHandle = document.createElement('span');
            dragHandle.className = 'drag-handle';
            dragHandle.innerHTML = '⋮⋮';
            dragHandle.title = '拖动排序';
            dragHandle.draggable = true;

            // 启用开关
            const enableCheckbox = document.createElement('input');
            enableCheckbox.type = 'checkbox';
            enableCheckbox.checked = rule.enable;
            enableCheckbox.title = '启用/禁用规则';
            enableCheckbox.onchange = () => {rule.enable = enableCheckbox.checked};

            // 说明输入框
            const descripInput = document.createElement('input');
            descripInput.className = 'descrip';
            descripInput.id = `rule-descrip-${index + 1}`;
            descripInput.value = rule.description;
            descripInput.placeholder = "请输入说明";
            descripInput.readOnly = true;
            descripInput.onchange = () => {rule.description = descripInput.value};

            // 编辑按钮
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-button';
            editBtn.innerHTML = '✎';
            editBtn.title = '编辑说明';

            // 展开/折叠按钮
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'toggle-button';
            toggleBtn.innerHTML = '▼';

            // 删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-button';
            deleteBtn.innerHTML = '✕';
            deleteBtn.title = '删除规则';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                if (confirm('确定要删除这条规则吗？')) {
                    tempSettings.regular.splice(index, 1);
                    ruleContainer.remove();
                }
            };

            // 将元素添加到标题行
            ruleHeader.appendChild(dragHandle);
            ruleHeader.appendChild(enableCheckbox);
            ruleHeader.appendChild(descripInput);
            ruleHeader.appendChild(editBtn);
            ruleHeader.appendChild(toggleBtn);
            ruleHeader.appendChild(deleteBtn);

            // ===创建规则内容区域===
            const ruleContent = document.createElement('div');
            ruleContent.className = 'rule-content';

            // 正则表达式输入
            const patternLabel = document.createElement('label');
            patternLabel.textContent = '正则表达式：';
            const patternInput = document.createElement('textarea');
            patternInput.className = 'pattern-input';
            patternInput.id = `pattern-input-${index + 1}`;
            patternInput.value = rule.pattern;
            patternInput.placeholder = "请输入JS正则表达式，基本格式：/正则表达式主体/修饰符(可选)";
            verifyRegExp(patternInput, ruleHeader);
            // 替换内容输入
            const replacementLabel = document.createElement('label');
            replacementLabel.textContent = '替换为：';
            const replacementInput = document.createElement('input');
            replacementInput.className = 'replace-input';
            replacementInput.id = `replace-input-${index + 1}`;
            replacementInput.type = 'text';
            replacementInput.value = rule.replacement;
            replacementInput.placeholder = "请输入替换内容，可空";
            replacementInput.onchange = () => {rule.replacement = replacementInput.value};

            // 添加到内容区域
            ruleContent.appendChild(patternLabel);
            ruleContent.appendChild(patternInput);
            ruleContent.appendChild(replacementLabel);
            ruleContent.appendChild(replacementInput);
            // 将标题行和内容区域添加到规则容器
            ruleContainer.appendChild(ruleHeader);
            ruleContainer.appendChild(ruleContent);
            content.appendChild(ruleContainer);

            // 说明输入框点击展开/折叠编辑区域
            descripInput.addEventListener('click', (e) => {
                if(descripInput.readOnly) {
                    const isExpanded = ruleContent.classList.contains('expanded');
                    ruleContent.classList.toggle('expanded');
                    toggleBtn.innerHTML = isExpanded ? '▼' : '▲';
                }
            });
            // 编辑按钮点击编辑说明
            editBtn.onclick = (e) => {
                e.stopPropagation();
                if(descripInput.readOnly) {
                    descripInput.readOnly = false;
                    descripInput.focus();
                    editBtn.innerHTML = '✓';
                    editBtn.title = '保存说明';
                    editBtn.style.color = 'orange';
                    editBtn.style.fontWeight = 'bold';
                    descripInput.style.border = '2px solid orange';
                } else {
                    descripInput.readOnly = true;
                    editBtn.innerHTML = '✎';
                    editBtn.title = '编辑说明';
                    editBtn.style.color = 'black';
                    editBtn.style.fontWeight = 'normal';
                    descripInput.style.border = 'none';
                }
            };
            // 正则输入框变化时验证正则表达式
            patternInput.onchange = () => {
                if (verifyRegExp(patternInput, ruleHeader)){ rule.pattern = patternInput.value; };
            };
            // 拖动按钮拖动排序
            dragHandle.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
                ruleContainer.classList.add('dragging');
            });
            dragHandle.addEventListener('dragend', () => {
                ruleContainer.classList.remove('dragging');
                // 获取所有规则容器
                const containers = Array.from(document.querySelectorAll('.rule-container'));
                // 获取当前拖动元素的新位置
                const newIndex = containers.indexOf(ruleContainer);
                // 如果位置发生变化，更新数据
                if (newIndex !== index && newIndex !== -1) {
                    // 从原位置删除一个元素，并获取该元素
                    const rule = tempSettings.regular.splice(index, 1)[0];
                    // 将元素插入到新位置，删除元素不会影响原数组的索引
                    tempSettings.regular.splice(newIndex, 0, rule);
                }
            });
            ruleContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingElement = shadowRoot.querySelector('.dragging');
                if (draggingElement !== ruleContainer) {
                    const rect = ruleContainer.getBoundingClientRect();
                    if (e.clientY < rect.top + rect.height / 2) {
                        ruleContainer.parentNode.insertBefore(draggingElement, ruleContainer);
                    } else {
                        ruleContainer.parentNode.insertBefore(draggingElement, ruleContainer.nextSibling);
                    }
                }
            });
        });

        // ====创建底部按钮区域====
        const buttonArea = document.createElement('div');
        buttonArea.className = 'button-area';
        // 添加新规则按钮
        const addButton = document.createElement('button');
        addButton.textContent = '新增规则';
        addButton.onclick = () => {
            tempSettings.regular.push({
                enable: true,
                description: '新规则',
                pattern: '',
                replacement: ''
            });
            cleanupPanel(panel);
            showSettingsPanel(new Event('click'), tempSettings);
        };
        // 恢复默认按钮
        const resetButton = document.createElement('button');
        resetButton.textContent = '恢复默认';
        resetButton.onclick = () => {
            if (confirm('确定要恢复所有规则为默认设置吗？')) {
                // 修改为直接更新数组内容
                tempSettings.regular = settingsToObject(defaultSettings).regular;
                cleanupPanel(panel);
                showSettingsPanel(new Event('click'), tempSettings);
            }
        };
        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.onclick = () => {
            // 检查正则表达输入框是否有错误
            const errorInputs = shadowRoot.querySelectorAll('.pattern-input.error');
            if (errorInputs.length > 0) {
                alert('请检查更改的正则表达式是否有错误！');
                return;
            }
            // 只在保存时更新原始设置
            saveSettings(tempSettings);
            cleanupPanel(panel);
        };
        // 取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.onclick = () => cleanupPanel(panel);
        // 将按钮添加到按钮区域
        buttonArea.appendChild(addButton);
        buttonArea.appendChild(resetButton);
        buttonArea.appendChild(saveButton);
        buttonArea.appendChild(cancelButton);
        // 将内容区域和按钮区域添加到面板
        panel.appendChild(content);
        panel.appendChild(buttonArea);

        return panel;
    }
    // 点击按钮显示设置面板
    function showSettingsPanel(e, tempSettings) {
        // 阻止事件冒泡
        e.stopPropagation();
        // 检查是否已存在面板
        const settingsPanel = shadowRoot.getElementById('settingsPanel');
        if (settingsPanel) {
            cleanupPanel(settingsPanel);
        }
        const panel = createSettingsPanel(tempSettings);
        shadowRoot.appendChild(panel);
    }
    // 清理设置面板
    function cleanupPanel(panel) {
        // 清理所有事件监听器
        panel.removeEventListener('mouseover', () => togglePanelVisibility(true));
        panel.removeEventListener('mouseout', () => togglePanelVisibility(false));
        const content = panel.querySelector('.panel-content');
        if (content) {
            content.removeEventListener('mouseout', () => {});
            content.removeEventListener('click', () => {});
        }
        // 移除面板
        panel.remove();
    }
    // 验证设置项中的正则表达式格式
    function verifyRegExp(regInput, regHeader) {
        if (!regInput || !regHeader) return false;
        try {
            stringToRegExp(regInput.value);
            regInput.classList.remove('error');
            regHeader.classList.remove('error');
            regInput.title = '';
            return true;
        } catch (e) {
            regInput.classList.add('error');
            regHeader.classList.add('error');
            regInput.title = `正则表达式错误：${e.message}`;
            return false;
        }
    }
    // 保存当前设置
    function saveSettings(settings) {
        try {
            if (!settings) {
                settings = settingsToObject();
            }
            GM_setValue('regular', settings.regular);
            currentSettings = getSettings();
            initializeContent();
        } catch (error) {
            console.error('保存设置失败:', error);
            alert('保存设置失败，请重试！');
        }
    }
    // 获取当前设置并将字符串转回正则表达式
    function getSettings() {
        let storedSettings = GM_getValue('regular');
        console.log('获取设置',storedSettings);
        let settings = {};
        if (!storedSettings || storedSettings.length === 0) {
            return defaultSettings;
        }
        try {
            settings = {
                regular: storedSettings.map(rule => ({
                    ...rule,
                    pattern: stringToRegExp(rule.pattern), // 转换为正则表达式
                }))
            };
        } catch (error) {
            console.error('获取设置失败:', error);
            return defaultSettings;
        }
        return settings;
    }
    // 处理文本的函数
    function processText(text) {
        text = text.trim();
        currentSettings.regular.forEach(rule => {
            if (rule.enable) {
                text = text.replace(rule.pattern, rule.replacement);
            }
        });
        text = text.trim();
        return text;
    }
    // 字符串转正则
    function stringToRegExp(str) {
        if (!str) {
            throw new Error('正则表达式不能为空');
        }
        try {
            if (!str.startsWith('/') || str.lastIndexOf('/') <= 0) {
                throw new Error('无效的正则表达式格式');
            }
            const pattern = str.slice(1, str.lastIndexOf('/'));
            const flags = str.slice(str.lastIndexOf('/') + 1);
            // 验证标志的有效性
            if (flags && !/^[gimsuy]*$/.test(flags)) {
                throw new Error('无效的正则表达式标志');
            }
            return new RegExp(pattern, flags);
        } catch (error) {
            console.error('正则表达式转换错误:', error);
            throw error;
        }
    }
    // 将正则对象转换为字符串进行存储
    function settingsToObject(settings) {
        if (!settings) {
            settings = currentSettings;
        }
        const settingsToStore = {
            regular: settings.regular.map(rule => ({
                ...rule,
                pattern: rule.pattern.toString(), // 转换为字符串
            }))
        };
        return settingsToStore;
    }


    const style = document.createElement('style');
    style.textContent =`
        /* 悬浮面板样式 */
        .floating-panel {
            top: 0px;
            left: 0px;
            position: fixed;
            display: flex;           /* flex 布局 */
            flex-direction: column;  /* 设置垂直方向排列 */
            align-items: center;     /* 水平居中 */
            justify-content: center; /* 垂直居中 */
            user-select: none;       /* 无法选中文本 */
            border-radius: 7px;
            z-index: 999999;
            font: normal;
            font-family: auto;
            background-color: transparent;
        }
        /* 悬浮面板按钮样式 */
        .floating-button {
            display: block;
            background-color:rgb(73, 134, 209);
            color: white;
            padding: 3px 10px;
            border: none;
            border-radius: 7px;
            margin: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .floating-button:hover {
            background-color:rgb(52, 104, 150);
        }
        .preview-button:hover {
            cursor: move;
        }
        .preview-button.saved {
            background-color:rgb(229, 182, 11);
            transition: background-color 0.3s ease;
            transition: left 0.01s ease-out, bottom 0.01s ease-out;
        }
        .download-button.download {
            background-color: #75B700;
            transition: background-color 0.3s ease;
            transition: left 0.01s ease-out, bottom 0.01s ease-out;
        }

        /* 符号按钮样式 */
        .letter-button {
            background: none;
            border: none;
            padding: 0;
            margin: 0;
            cursor: pointer;
            line-height: 0;
            font-size: 16px;
            font-weight: bold;
            color:rgb(75, 75, 75);
            background-color: transparent;
        }
        .letter-button:hover {
            color:rgba(0, 123, 255, 0.87);
            background-color: transparent;
        }

        /* 预览面板样式 */
        .preview-panel {
            display: block;
            position: absolute;
            bottom: 150%;
            top: unset;
            scale: 0;
            border-radius: 7px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            background-color: transparent;
            transition: all 0.2s;
        }
        .preview-panel:hover,
        .preview-panel.show {
            background-color: #fff;
            transition: all 0.2s;
            bottom: 100%;
            top: unset;
            scale: 1;
        }
        .preview-panel.under {
            top: 100%;
            bottom: unset;
        }
        /* 预览子元素样式 */
        .preview-panel:hover .preview-sub,
        .preview-panel.show .preview-sub {
            scale: 1;
        }
        .preview-sub {
            scale: 0;
        }
        /* 标题栏样式 */
        .preview-title-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2px;
            border-radius: 7px 7px 0 0;
            background-color: #f0f0f0;
            border-bottom: 1px solid #ccc;
            max-height: 40px;
            /*transition: all 0.3s;*/
        }
        /* 固定按钮样式 */
        .fixed-button {
            margin-left: 5px;
            font-size: 12px;
            color:rgb(150, 150, 150);
        }
        .fixed-button.on {
            color:rgb(75, 75, 75);
        }
        .fixed-button.on:hover  {
            color:rgb(229, 182, 11);
        }
        /* 标题文本样式 */
        .preview-title {
            padding: 0 5px;
            flex: 1;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
            font-weight: bold;
            font-size: 12px;
            color: #000000;
            background-color: transparent;
            /*transition: all 0.3s;*/
        }

        /* 统计块样式 */
        .state-part {
            color: #666;
            padding-right: 5px;
            display: grid;
            grid-template-rows: repeat(2, auto);
            grid-template-columns: repeat(3,auto);
            grid-template-areas: 'a a a' 'b b c';
            column-gap: 5px;
            /*white-space: pre-wrap;*/
            /*transition: all 0.3s;*/
            font-size: 10px;
            font-weight: normal;
            color: gray;
            background-color: transparent;
        }
        .word-count {
            grid-area: a;
        }
        .page-count {
            grid-area: b;
        }
        /* 设置按钮样式 */
        .setting-button {
            grid-area: c;
            top: 30px;
            right: 7px;
            font-size: 16px;
            color: dimgray;
            /*transition: all 0.3s;*/
        }

        /* 内容区域样式 */
        .preview-content {
            min-width: ${CONFIG.panel.minWidth}px;
            min-height: ${CONFIG.panel.minHeight}px;
            max-width: ${CONFIG.panel.maxWidth}px;
            max-height: ${CONFIG.panel.maxHeight}px;
            padding: 5px 5px 5px 10px;
            margin: 0;
            border-radius: 0 0 7px 7px;
            overflow-y: auto;
            overflow-wrap: break-word;    /* 允许在单词内换行 */
            word-break: break-all;        /* 允许在任意字符间换行 */
            /*width: max-content;*/           /* 容器宽度适应内容最大宽度 */
            /*width: fit-content;*/           /* 容器宽度适应内容 */
            font-size: 12px;
            font-weight: normal;
            line-height: 1.4;
            white-space: pre-wrap;
            /*transition: all 0.3s;*/
            color: #000000;
            background-color: #ffffff;
        }
        .preview-content:hover {

        }

        /* 设置界面容器 */
        .settings-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 15px;
            border-radius: 8px;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
        }
        /* 设置界面标题栏样式 */
        .settings-title-bar {
            color: #333333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        /* 关闭按钮 */
        .close-button {
            background: none;
            border: none;
            font-size: 20px;
            padding: 0 5px;
            font-weight: bold;
        }
        .close-button:hover {
            color:rgb(180, 26, 52);
        }
        /* 设置界面区域样式 */
        .settings-content {
            overflow-y: auto;
            padding-right: 10px;
        }
        /* 规则容器样式 */
        .rule-container {
            border-radius: 4px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #fff;
        }
        .rule-container.dragging {
            border: 2px dashed #666;
            opacity: 0.5;
        }
        /* 规则标题说明 */
        .rule-header {
            color: #333333;
            display: flex;
            align-items: center;
            padding: 8px;
            background: #f5f5f5;
            user-select: none;
        }
        .rule-header.error {
            background-color: #ffe6e6;
            border-color:rgb(255, 143, 143);
        }
        /* 表单内容区 */
        .rule-content {
            color: #333333;
            padding: 0px 15px 0px 10px;
            border-top: 1px solid #ddd;
            max-height: 0;
            overflow: hidden;
            transition: all 0.3s ease-out;
        }
        .rule-content.expanded {
            max-height: 320px; /* 设置一个足够大的高度 */
            padding: 10px 15px 10px 10px;
        }
        /* 拖动按钮 */
        .drag-handle {
            cursor: move;
            padding: 0 8px;
            color: #666;
        }
        /* 删除按钮 */
        .delete-button {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            padding: 0 8px;
        }
        .delete-button:hover {
            color: #ff4444;
        }
        /* 折叠按钮 */
        .toggle-button {
            background: none;
            border: none;
            padding: 0 8px;
            color: #666;
        }
        /* 说明编辑按钮 */
        .edit-button {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            padding: 0 8px;
        }
        .edit-button:hover {
            color: #007BFF;
        }
        /* 正则输入框 */
        .pattern-input {
            width: 100%;
            height: 20px;
            max-height: 231px;
            min-height: 20px;
            margin: 5px 0;
            display: flex;
            resize: vertical;
            color: #333333;
            font-family: monospace;
            background-color: #f8f8f8;
            border: 1px solid #ddd;
        }
        .pattern-input.error {
            border-color: red;
            background-color: #fff0f0;
        }
        /* 替换文本输入框 */
        input[type="text"] {
            width: 100%;
            margin: 5px 0;
            padding-right: 0;
            padding: 3px;
            background-color: #f8f8f8;
            border: 1px solid #ddd;
        }
        /* 说明文本输入框 */
        .descrip {
            margin: 5px 0;
            padding: 1px 3px;
            background-color: transparent;
            border: none;
            flex: 1;
            margin: 0 10px;
            color: #333333;
            outline: none; /* 去除选中状态边框 */
        }
        .descrip[readonly] {
            background-color: transparent;
            cursor: pointer;
            padding: 3px 3px;
        }
        /* 设置按钮区域样式 */
        .button-area {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #eee;
        }
        .button-area button {
            padding: 0 10px;
            border-radius: 5px;
            border: none;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s ease;
            background-color:rgb(73, 134, 209);
        }
        .button-area button:hover {
            background-color:rgb(43, 83, 119);
        }

        /* WebKit 浏览器滚动条样式 */
        .preview-content::-webkit-scrollbar,
        .settings-content::-webkit-scrollbar {
            width: 8px; /* 滚动条宽度 */
            height: 8px; /* 水平滚动条高度 */
            cursor: default;
        }
        .preview-content::-webkit-scrollbar-track,
        .settings-content::-webkit-scrollbar-track {
            background: #f1f1f1; /* 轨道背景色 */
            border-radius: 4px; /* 圆角 */
            cursor: default;
        }
        .preview-content::-webkit-scrollbar-thumb,
        .settings-content::-webkit-scrollbar-thumb {
            background: #888; /* 滑块背景色 */
            border-radius: 4px; /* 圆角 */
            cursor: default;
        }
        .preview-content::-webkit-scrollbar-thumb:hover,
        .settings-content::-webkit-scrollbar-thumb:hover {
            background: #555; /* 悬停时的背景色 */
            cursor: pointer;
            cursor: default;
        }
        /* Firefox 滚动条兼容样式 */
        .preview-content {
            scrollbar-width: thin; /* 设置滚动条宽度 */
            scrollbar-color: #888 #f1f1f1; /* 滑块颜色和轨道颜色 */
        }
    `;
    shadowRoot.appendChild(style);
    // 初始化
    isPanelAtEdge();
    initializeContent();
    // 监听窗口大小变化
    window.addEventListener('resize', isPanelAtEdge);
})();