// ==UserScript==
// @name         figma copy params
// @namespace    http://meitu.com/
// @version      1.0
// @description  Figma Copy Params
// @author       zcj2@meitu.com
// @match        *://www.figma.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=figma.com
// @grant        GM_setClipboard
// @license      MIT
// @grant        GM_registerMenuCommand
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL https://update.greasyfork.org/scripts/494388/figma%20copy%20params.user.js
// @updateURL https://update.greasyfork.org/scripts/494388/figma%20copy%20params.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("🚀 Figma Copy Params script loaded");

    /***************************
     * 🧩 初始化 GM_config 配置界面
     ***************************/
    GM_config.init({
        id: 'FigmaCopyParamsConfig',
        title: '⚙️ Figma Copy Params 设置',
        fields: {
            iconPrefix: {
                label: 'Icon 前缀（例如：roboneo_icon_）',
                type: 'text',
                default: 'poprock_icon_'
            }
        },
        css: `
            #FigmaCopyParamsConfig { 
                background: #fff; color: #333; font-size:14px; 
                padding: 10px;
            }
            #FigmaCopyParamsConfig_saveBtn { background: #007aff; color: white; }
        `,
        events: {
            save: function () {
                // ✅ 保存后自动关闭窗口
                this.close();
                toast("保存成功~");
            }
        }
    });

    function getIconPrefix() {
        return GM_config.get('iconPrefix') || 'poprock_icon_';
    }


    GM_registerMenuCommand('🧩 icon前缀配置', () => {
        GM_config.open();
    });



    // 显示一个Toast，提示消息
    var toast = (content, time) => {
        return new Promise((resolve, reject) => {
            let elAlertMsg = document.querySelector("#fehelper_alertmsg");
            if (!elAlertMsg) {
                let elWrapper = document.createElement('div');
                elWrapper.innerHTML = '<div id="fehelper_alertmsg" style="position:fixed;top:50%;left:50%;right:0;z-index:100">' +
                    '<p style="background:#000;display:inline-block;color:#fff;text-align:center;' +
                    'padding:10px 10px;margin:0 auto;font-size:14px;border-radius:4px;">' + content + '</p></div>';
                elAlertMsg = elWrapper.childNodes[0];
                document.body.appendChild(elAlertMsg);
            } else {
                elAlertMsg.querySelector('p').innerHTML = content;
                elAlertMsg.style.display = 'block';
            }

            window.setTimeout(function () {
                elAlertMsg.style.display = 'none';
                resolve && resolve();
            }, time || 1000);
        });
    };

    // 获取所有属性值的函数
    function extractAllPropertyValues() {
        // 使用模糊匹配查找属性行，提高兼容性
        let propertyRows = document.querySelectorAll("[class*='component_props_list--propertyRow']");
        let propertyValues = {};

        // 遍历每个属性行元素
        propertyRows.forEach(function (propertyRow) {
            // 获取属性名元素
            let propertyNameElement = propertyRow.querySelector("[class*='component_props_list--propertyName']");
            // 获取属性值元素
            let propertyValueElement = propertyRow.querySelector("[class*='component_props_list--propertyValue']");
            // 如果找到了属性名和属性值元素
            if (propertyNameElement && propertyValueElement) {
                // 获取属性名和属性值
                let propertyName = propertyNameElement.textContent.trim();
                let propertyValue = propertyValueElement.textContent.trim();
                // 将属性名和属性值存入对象
                propertyValues[propertyName] = propertyValue;
            }
        });

        return propertyValues;
    }

    // 创建新按钮的函数
    function createNewButton() {
        // 查找按钮的父元素，使用模糊匹配
        let playgroundButtonContainer = document.querySelector("[class*='component_props_list--playgroundButtonContainer']");

        // 如果找到了父元素
        if (playgroundButtonContainer && !document.getElementById("copyFieldValuesButton")) {
            // 获取按钮样式
            let buttonStyle = window.getComputedStyle(playgroundButtonContainer.querySelector('button') || playgroundButtonContainer);

            // 创建新按钮元素
            let newButton = document.createElement('button');
            newButton.id = 'copyFieldValuesButton'; // 添加唯一的 ID
            newButton.innerText = '复制字段值';
            // Try to keep original class, but it might be broken too. 
            newButton.className = 'button-reset__buttonReset__zO1D7 button__button__-U-QJ button__wideSize__fyONU button__secondary__8YIhr';
            newButton.style.color = buttonStyle.color;
            newButton.style.backgroundColor = buttonStyle.backgroundColor;
            newButton.style.border = buttonStyle.border;

            // 添加使文字居中的样式
            newButton.style.display = 'block'; // 确保按钮是块级元素
            newButton.style.textAlign = 'center'; // 使文字居中

            // 给按钮添加点击事件监听器
            newButton.addEventListener('click', function () {

                // 输出属性值到控制台
                console.log(extractAllPropertyValues());

                // 提取所有属性的值
                let allPropertyValues = extractAllPropertyValues();
                let clipboardText = '';

                // 遍历属性值对象，将每个属性值转换为要复制到剪贴板的格式
                for (let key in allPropertyValues) {
                    let values = allPropertyValues[key]
                    if (values == "false" || values == "true") {
                        continue;
                    }
                    if (key == "Icon") {
                        clipboardText += `app:popRock${key}="@string/${getIconPrefix()}${values}"\n`;
                    } else {
                        clipboardText += `app:popRock${key}="${values}"\n`;
                    }

                }

                copyText(clipboardText);

            });

            return newButton;
        }
    }

    function copyText(text) {
        GM_setClipboard(text, {
            type: 'text',
            mimetype: 'text/plain'
        });
        toast("拷贝成功~");
    }

    // 在 "在 Playground 中打开" 按钮之后插入新按钮
    function insertNewButton() {
        // 找到 "在 Playground 中打开" 按钮，使用模糊匹配
        let playgroundButtonContainer = document.querySelector("[class*='component_props_list--playgroundButtonContainer']");

        if (!playgroundButtonContainer) {
            return;
        }

        // 创建新按钮
        let newButton = createNewButton();

        // 如果找到了新按钮和 "在 Playground 中打开" 按钮
        if (newButton && playgroundButtonContainer) {
            // 插入新按钮到 "在 Playground 中打开" 按钮之后
            playgroundButtonContainer.insertBefore(newButton, null);
            console.log("✅ insertNewButton: Button inserted successfully.");
        }
    }

    /**
     * 🔍 通用元素查找函数
     * @param {string} selectorPart - 类名的一部分，用于模糊匹配
     * @returns {NodeList} - 匹配的元素列表
     */
    function findTargetElements(selectorPart) {
        return document.querySelectorAll(`[class*='${selectorPart}']`);
    }

    /**
     * 🔍 通用父元素查找函数
     * @param {HTMLElement} element - 当前元素
     * @param {string} selectorPart - 父元素类名的一部分
     * @returns {HTMLElement|null} - 找到的父元素
     */
    function findGrandparent(element, selectorPart) {
        // 1. 尝试直接 closest 模糊匹配
        let grandparent = element.closest(`[class*='${selectorPart}']`);

        // 2. 如果找不到，尝试更宽泛的匹配（去掉前缀等）
        if (!grandparent) {
            // 假设 selectorPart 格式为 'prefix--name'，尝试只用 'name'
            const parts = selectorPart.split('--');
            if (parts.length > 1) {
                grandparent = element.closest(`[class*='${parts[1]}']`);
            }
        }

        // 3. 最后的尝试：假设父元素的父元素是行容器
        if (!grandparent && element.parentElement && element.parentElement.parentElement) {
            // 简单的层级回溯，适用于结构稳定的情况
            // grandparent = element.parentElement.parentElement; 
            // ⚠️ 暂时禁用此回退，以免误伤其他结构
        }

        return grandparent;
    }

    /**
     * ➕ 通用按钮注入函数
     * @param {HTMLElement} grandparent - 按钮要插入的容器（行元素）
     * @param {HTMLElement} element - 包含文本的目标元素
     * @param {Object} options - 配置项
     * @param {Function} options.transformText - 文本转换函数
     * @param {string} options.position - 插入位置 'start' | 'end' | 'absolute'
     * @param {string} options.absoluteRight - 绝对定位时的 right 值
     */
    function injectCopyButton(grandparent, element, options) {
        // 检查是否已存在按钮
        if (grandparent.querySelector('.draggable_list--addButton--D0q--')) {
            return;
        }

        const newButton = createCopyButton();

        // 样式配置
        newButton.style.flexShrink = '0';

        if (options.position === 'absolute') {
            // 确保父容器有相对定位
            if (window.getComputedStyle(grandparent).position === 'static') {
                grandparent.style.position = 'relative';
            }
            newButton.style.position = 'absolute';
            newButton.style.right = options.absoluteRight || '60px';
            newButton.style.top = '50%';
            newButton.style.transform = 'translateY(-50%)';
            newButton.style.zIndex = '10';
        } else if (options.position === 'start') {
            newButton.style.marginLeft = '0px';
            newButton.style.marginRight = '8px';
        } else {
            // default 'end' or normal flow
            newButton.style.marginLeft = '8px';
        }

        // 点击事件
        newButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const originalText = element.textContent.trim();
            const transformedText = options.transformText(originalText);
            copyText(transformedText);
        });

        // 插入 DOM
        if (options.position === 'absolute') {
            grandparent.appendChild(newButton);
        } else if (options.position === 'start') {
            grandparent.insertBefore(newButton, grandparent.firstChild);
        } else {
            // 尝试插入到文本节点之后
            let targetNode = element;
            while (targetNode.parentElement && targetNode.parentElement !== grandparent) {
                targetNode = targetNode.parentElement;
            }
            if (targetNode.nextSibling) {
                grandparent.insertBefore(newButton, targetNode.nextSibling);
            } else {
                grandparent.appendChild(newButton);
            }
        }
    }

    function createCopyButton() {
        const newButton = document.createElement('button');
        // 保留原有类名以复用 Figma 样式，但移除可能导致冲突的部分
        newButton.className = 'draggable_list--addButton--D0q-- raw_components--iconButtonEnabled--WmVk5 raw_components--_iconButton---ybo6';
        newButton.tabIndex = 0;
        newButton.ariaLabel = 'Copy Params';
        newButton.innerHTML = '<span class="svg-container"><svg t="1715682202434" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15510" width="16" height="16"><path d="M761.088 715.3152a38.7072 38.7072 0 0 1 0-77.4144 37.4272 37.4272 0 0 0 37.4272-37.4272V265.0112a37.4272 37.4272 0 0 0-37.4272-37.4272H425.6256a37.4272 37.4272 0 0 0-37.4272 37.4272 38.7072 38.7072 0 1 1-77.4144 0 115.0976 115.0976 0 0 1 114.8416-114.8416h335.4624a115.0976 115.0976 0 0 1 114.8416 114.8416v335.4624a115.0976 115.0976 0 0 1-114.8416 114.8416z" p-id="15511" fill="#1296db"></path><path d="M589.4656 883.0976H268.1856a121.1392 121.1392 0 0 1-121.2928-121.2928v-322.56a121.1392 121.1392 0 0 1 121.2928-121.344h321.28a121.1392 121.1392 0 0 1 121.2928 121.2928v322.56c1.28 67.1232-54.1696 121.344-121.2928 121.344zM268.1856 395.3152a43.52 43.52 0 0 0-43.8784 43.8784v322.56a43.52 43.52 0 0 0 43.8784 43.8784h321.28a43.52 43.52 0 0 0 43.8784-43.8784v-322.56a43.52 43.52 0 0 0-43.8784-43.8784z" p-id="15512" fill="#1296db"></path></svg></span>';
        return newButton;
    }

    // 🎨 处理颜色部分
    function processColors() {
        // 查找颜色名称元素 (truncated_text--root)
        const elements = findTargetElements('truncated_text--root');
        
        elements.forEach((element) => {
            // 查找颜色行容器 (colors_inspect_panel--styleNameContainer)
            const grandparent = findGrandparent(element, 'colors_inspect_panel--styleNameContainer');
            
            if (grandparent) {
                injectCopyButton(grandparent, element, {
                    position: 'start', // 颜色按钮放在最前面
                    transformText: (text) => {
                        const currentPrefix = "color_";
                        return `?attr/${currentPrefix}${text.replace(/[/\-]/g, '_')}`;
                    }
                });
            }
        });
    }

    // 🖼️ 处理 Icon 部分
    function processIcons() {
        // 查找 Icon 名称元素 (asset_panel--assetName)
        const elements = findTargetElements('asset_panel--assetName');

        elements.forEach((element) => {
            // 查找 Icon 行容器 (asset_panel--assetRow)
            const grandparent = findGrandparent(element, 'asset_panel--assetRow');

            if (grandparent) {
                injectCopyButton(grandparent, element, {
                    position: 'absolute', // Icon 按钮使用绝对定位
                    absoluteRight: '60px',
                    transformText: (text) => {
                        return `@string/${getIconPrefix()}${text}`;
                    }
                });
            }
        });
    }


    // 监听DOM变化
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // 当"在 Playground 中打开" 按钮或其父元素发生变化时，重新插入新按钮
            if (!document.getElementById("copyFieldValuesButton")) {
                let targetClass = mutation.target.className;
                if (typeof targetClass === 'string' &&
                    (targetClass.includes('component_props_list--playgroundButtonContainer') ||
                        mutation.target.querySelector("[class*='component_props_list--playgroundButtonContainer']"))) {
                    insertNewButton();
                }
            }
            
            // 批量处理
            processColors();
            processIcons();
        });
    });

    // 监听根节点的子节点变化
    observer.observe(document.documentElement, { childList: true, subtree: true });

})();