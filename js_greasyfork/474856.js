// ==UserScript==
// @name         论坛列表显示图片
// @namespace    form_show_images_in_list
// @version      1.5.2
// @description  论坛列表显示图片，同时支持discuz搭建的论坛（如吾爱破解）以及phpwind搭建的论坛（如south plus）等
// @license MIT
// @author       Gloduck
// @note         discuz路径匹配
// @match        *://*/forum-*.html
// @match        *://*/forum-*.html?*
// @match        *://*/forum.php
// @match        *://*/forum.php?*
// @match        *://*/*/forum-*.html
// @match        *://*/*/forum-*.html?*
// @match        *://*/*/forum.php
// @match        *://*/*/forum.php?*
// @note         phpwind路径匹配
// @match        *://*/*/thread.php
// @match        *://*/*/thread.php?*
// @match        *://*/thread.php
// @match        *://*/thread.php?*
// @note         1024路径匹配
// @match        *://*/*/thread0806.php*
// @match        *://*/thread0806.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/474856/%E8%AE%BA%E5%9D%9B%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/474856/%E8%AE%BA%E5%9D%9B%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(`
        .zoomable-image {
            cursor: pointer;
        }

        .zoomable-image.zoomed {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
        }
    `);


    // 默认设置
    const defaultSettings = {
        enabled: false,
        lazyLoad: true,
        maxImageDisplayCount: 3,
        requestMaxDelay: 3000,
        ignoredImagePattern: []
    };

    // 当前设置变量
    let currentSettings = {};

    // 使用固定的UA，防止请求解析不正确
    const defaultUa = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    const settingsItems = [
        {
            label: '启用脚本',
            name: 'enabled',
            type: 'checkbox'
        },
        {
            label: '懒加载',
            name: 'lazyLoad',
            type: 'checkbox'
        },
        {
            label: '最大图片显示数量',
            name: 'maxImageDisplayCount',
            type: 'number',
            extraAttrs: 'min="1" max="10"'
        },
        {
            label: '请求最大延迟(ms)',
            name: 'requestMaxDelay',
            type: 'number',
            extraAttrs: 'min="0" max="10000"'
        },
        {
            label: '忽略图片',
            name: 'ignoredImagePattern',
            type: 'textarea',
            extraAttrs: 'rows="5" placeholder="一行输入一个，支持URL模式匹配..."',
            serializeValue: (value) => {
                return value.trim().split('\n').filter(line => line.trim() !== '');
            },
            deserializeValue: (value) => {
                return value ? value.join('\n') : '';
            }
        }
    ];

    const typeHandlers = [
        {
            // 类型名称
            name: "discuz",
            parseArticleElements: () => {
                return document.querySelectorAll('tbody[id^="normalthread_"]');
            },
            parseContentLink: (articleElement) => {
                return articleElement.querySelector('a[onclick="atarget(this)"]')?.href;
            },
            parsePostImage: (link, response) => {
                const images = [];
                const pageContent = new DOMParser().parseFromString(response, 'text/html');
                const postContent = pageContent.querySelector('div[id^="post_"] .plc .pct .pcb');
                if (!postContent) {
                    return images;
                }
                const imgElements = postContent.querySelectorAll('img[id^="aimg_"]');
                imgElements.forEach(img => {
                    let imageLink = null;
                    imageLink = img.getAttribute('file');
                    if (!imageLink) {
                        imageLink = img.getAttribute('src');
                    }
                    if (imageLink) {
                        images.push(convertPathToAccessible(imageLink, link));
                    }
                });
                return images;
            },
            insertImageContainer: (articleElement, imageContainer) => {
                const tbody = document.createElement("tbody");
                const tr = document.createElement("tr");
                tr.appendChild(imageContainer);
                tbody.appendChild(tr);
                insertElementBelow(articleElement, tbody);
            },
            urlPattern: [
                "*://*/forum-*.html",
                "*://*/forum-*.html?*",
                "*://*/forum.php",
                "*://*/forum.php?*",
                "*://*/*/forum-*.html",
                "*://*/*/forum-*.html?*",
                "*://*/*/forum.php",
                "*://*/*/forum.php?*"
            ],
            ignoredImagePattern: [
                "*://*/*/uc_server/images/*",
                "*://*/*/static/image/*",
                "*://*/*/data/avatar/*"
            ]
        },
        {
            name: "phpwind",
            parseArticleElements: () => {
                return document.querySelectorAll('#ajaxtable tbody:last-of-type tr[align=center]');
            },
            parseContentLink: (articleElement) => {
                return articleElement.querySelector('td a')?.href;
            },
            parsePostImage: (link, response) => {
                const images = [];
                const pageContent = new DOMParser().parseFromString(response, 'text/html');
                const postContent = pageContent.querySelector('.tpc_content');
                if (!postContent) {
                    return images;
                }
                const imgElements = postContent.querySelectorAll('img');
                imgElements.forEach(img => {
                    images.push(convertPathToAccessible(img.src, link));
                });
                return images;
            },
            insertImageContainer: (articleElement, imageContainer) => {
                let tr = document.createElement("tr");
                tr.align = "center";
                let td = document.createElement("td");
                td.colSpan = 5;
                tr.appendChild(td);
                td.appendChild(imageContainer);
                insertElementBelow(articleElement, tr);
            },
            urlPattern: [
                "*://*/*/thread.php",
                "*://*/*/thread.php?*",
                "*://*/thread.php",
                "*://*/thread.php?*"
            ],
            ignoredImagePattern: [
                "*://*/images/post/smile/*",
            ]
        },
        {
            name: "1024",
            parseArticleElements: () => {
                return document.querySelectorAll('tbody[id="tbody"] tr');
            },
            parseContentLink: (articleElement) => {
                return articleElement.querySelector('.tal h3 a')?.href;
            },
            parsePostImage: (link, response) => {
                const images = [];
                const pageContent = new DOMParser().parseFromString(response, 'text/html');
                const postContent = pageContent.querySelector('#conttpc');
                if (!postContent) {
                    return images;
                }
                const imgElements = postContent.querySelectorAll('img');
                imgElements.forEach(img => {
                    let imageLink = null;
                    imageLink = img.getAttribute('ess-data');
                    if (!imageLink) {
                        imageLink = img.getAttribute('src');
                    }
                    if (imageLink) {
                        images.push(convertPathToAccessible(imageLink, link));
                    }
                });
                return images;
            },
            insertImageContainer: (articleElement, imageContainer) => {
                let tr = document.createElement("tr");
                tr.align = "center";
                let td = document.createElement("td");
                td.colSpan = 5;
                tr.appendChild(td);
                td.appendChild(imageContainer);
                insertElementBelow(articleElement, tr);
            },
            urlPattern: [
                "*://*/*/thread0806.php*",
                "*://*/thread0806.php*"
            ],
            ignoredImagePattern: [
            ]
        }
    ];

    function chooseActiveHandler() {
        for (let handler of typeHandlers) {
            if (handler.urlPattern.some(pattern => matchUrl(window.location.href, pattern))) {
                console.log(`激活的配置为：${handler.name}`);
                return handler;
            }
        }
        return null;
    }

    function adjustDefaultSetting(handler) {
        if (handler.ignoredImagePattern) {
            defaultSettings.ignoredImagePattern = handler.ignoredImagePattern;
        }
    }

    function enhancementByHandler(handler, settings) {
        const articleList = handler.parseArticleElements();
        articleList.forEach(element => {
            if (settings.lazyLoad) {
                lazyEnhancement(element, handler, settings);
            } else {
                immediateEnhancement(element, handler, settings);
            }
        })
    }

    function lazyEnhancement(element, handler, settings) {
        window.addEventListener('scroll', throttle(function () {
            const targetElementRect = element.getBoundingClientRect();
            if (targetElementRect.top < window.innerHeight) {
                handleSingleArticle(element, handler, settings);

            }
        }, 200, 500));
    }

    function immediateEnhancement(element, handler, settings) {
        handleSingleArticle(element, handler, settings);
    }

    async function handleSingleArticle(element, handler, settings) {
        if (element.getAttribute("has_enhanced")) {
            return;
        }
        element.setAttribute("has_enhanced", "true");
        let link = handler.parseContentLink(element);
        if (link == null) {
            throw new Error("无法解析文章连接");
        }
        link = convertPathToAccessible(link, window.location.href);
        const articleContent = await httpGetRequest(link, settings.requestMaxDelay);
        if (!articleContent) {
            throw new Error("无法获取文章内容");
        }
        let images = handler.parsePostImage(link, articleContent);
        images = filterArticleImages(images, settings.ignoredImagePattern, settings.maxImageDisplayCount);
        const imageContainer = generateImageContainer(images);
        handler.insertImageContainer(element, imageContainer);
    }

    function generateImageContainer(images) {
        const imageDiv = document.createElement("div");
        imageDiv.style = "display: flex;";
        imageDiv.className = "image_list";
        images.forEach(value => {
            const imgElement = document.createElement("img");
            imgElement.src = value;
            imgElement.style = "max-width: 300px;max-height: 300px;margin-right: 10px"
            imageDiv.appendChild(imgElement);
            imgElement.addEventListener('click', function () {
                var zoomedImg = document.createElement('img');
                zoomedImg.src = imgElement.src;

                zoomedImg.classList.add('zoomable-image', 'zoomed');

                zoomedImg.addEventListener('click', function () {
                    document.body.removeChild(zoomedImg);
                });

                document.body.appendChild(zoomedImg);
            });
        })
        const htmlDivElement = document.createElement("div");
        htmlDivElement.appendChild(imageDiv);
        return htmlDivElement;
    }

    function filterArticleImages(images, ignoredImagePattern, showCount) {
        return images.filter(img => {
            return !ignoredImagePattern.some(pattern => {
                return matchUrl(img, pattern)
            });
        }).slice(0, showCount);
    }

    function convertPathToAccessible(path, currentPath) {
        var url = new URL(path, currentPath);
        return url.href;
    }

    function insertElementBelow(targetElement, newElement) {
        var parentElement = targetElement.parentNode;
        parentElement.insertBefore(newElement, targetElement.nextSibling);
    }



    function httpGetRequest(url, maxDelay) {
        return new Promise((resolve, reject) => {
            const delay = Math.random() * maxDelay;
            setTimeout(() => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'User-Agent': defaultUa
                    },
                    onload: function (response) {
                        resolve(response.responseText);
                    },
                    onerror: function (error) {
                        reject(error);
                    }
                });
            }, delay);
        });
    }



    function matchUrl(url, pattern) {
        if (typeof url !== 'string' || typeof pattern !== 'string' || !pattern) {
            return false;
        }

        // 解析URL
        let parsedUrl;
        try {
            const urlObj = new URL(url);
            parsedUrl = {
                protocol: urlObj.protocol,
                domain: urlObj.hostname,
                path: urlObj.pathname + urlObj.search + urlObj.hash
            };
        } catch (e) {
            return false; // URL解析失败
        }

        // 验证模式格式
        if (!/^([*]|https?):\/\//.test(pattern)) {
            return false;
        }

        // 转换模式为正则表达式
        let regexStr = pattern
            .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // 转义正则特殊字符
            .replace(/\*/g, '.*?') // 将*替换为非贪婪匹配
            .replace(/^(\*):\/\//, '(http|https):\/\/'); // 处理*://的情况

        // 创建正则表达式并添加锚点
        const regex = new RegExp(`^${regexStr}$`);

        // 组合URL各部分并执行匹配
        const fullUrl = parsedUrl.protocol + '//' + parsedUrl.domain + parsedUrl.path;
        return regex.test(fullUrl);
    }

    /**
     * 节流
     * @param func {function} 回调函数
     * @param wait 延迟执行时间(ms)
     * @param mustRun 必须执行时间(ms)
     * @returns {(function(): void)|*}
     */
    function throttle(func, wait, mustRun) {
        var timeout,
            startTime = new Date();

        return function () {
            var context = this,
                args = arguments,
                curTime = new Date();

            clearTimeout(timeout);
            // 如果达到了规定的触发时间间隔，触发 handler
            if (curTime - startTime >= mustRun) {
                func.apply(context, args);
                startTime = curTime;
                // 没达到触发间隔，重新设定定时器
            } else {
                timeout = setTimeout(func, wait);
            }
        };
    };

    // 初始化设置
    function initSettings() {
        const saveSettings = GM_getValue(getSettingName()) ?? {};
        settingsItems.forEach(item => {
            const savedValue = saveSettings[item.name];
            currentSettings[item.name] = savedValue !== undefined ? savedValue : defaultSettings[item.name];
        });
        console.log(`当前脚本设置：${JSON.stringify(currentSettings)}`);
    }

    function getSettingName() {
        return window.location.host + '_settings';
    }

    // 创建设置项（支持所有类型）
    function createSettingItem(labelText, name, type, value, extraAttrs = '', options = []) {
        const container = document.createElement('div');
        container.style.marginBottom = '1.5rem';

        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '8px';
        label.style.fontWeight = '500';
        label.textContent = labelText;
        container.appendChild(label);

        switch (type) {
            case 'checkbox-group': {
                const group = document.createElement('div');
                options.forEach(option => {
                    const wrapper = document.createElement('div');
                    wrapper.style.marginBottom = '6px';

                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    input.name = `${name}[${option.value}]`;
                    input.id = `${name}_${option.value}`;
                    input.checked = value[option.value] === true;
                    input.style.marginRight = '8px';

                    const optLabel = document.createElement('label');
                    optLabel.htmlFor = `${name}_${option.value}`;
                    optLabel.textContent = option.text;

                    wrapper.append(input, optLabel);
                    group.appendChild(wrapper);
                });
                container.appendChild(group);
                break;
            }

            case 'radio-group': {
                const group = document.createElement('div');
                options.forEach(option => {
                    const wrapper = document.createElement('div');
                    wrapper.style.marginBottom = '6px';

                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = name;
                    input.id = `${name}_${option.value}`;
                    input.value = option.value;
                    input.checked = value === option.value;
                    input.style.marginRight = '8px';

                    const optLabel = document.createElement('label');
                    optLabel.htmlFor = `${name}_${option.value}`;
                    optLabel.textContent = option.text;

                    wrapper.append(input, optLabel);
                    group.appendChild(wrapper);
                });
                container.appendChild(group);
                break;
            }

            case 'select': {
                const select = document.createElement('select');
                options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option.value;
                    opt.textContent = option.text;
                    opt.selected = option.value === value;
                    select.appendChild(opt);
                });
                select.name = name;
                select.id = name;
                select.style.width = '100%';
                select.style.padding = '6px';
                select.style.border = '1px solid #ddd';
                select.style.borderRadius = '4px';
                container.appendChild(select);
                break;
            }

            case 'textarea': {
                const textarea = document.createElement('textarea');
                textarea.name = name;
                textarea.id = name;
                textarea.value = value;
                applyExtraAttrs(textarea, extraAttrs);
                textarea.style.width = '100%';
                textarea.style.padding = '6px';
                textarea.style.border = '1px solid #ddd';
                textarea.style.borderRadius = '4px';
                container.appendChild(textarea);
                break;
            }

            default: {
                // 处理所有input类型
                const input = document.createElement('input');
                input.type = type;
                input.name = name;
                input.id = name;

                if (type === 'checkbox') {
                    input.checked = value;
                } else {
                    input.value = value;
                }

                applyExtraAttrs(input, extraAttrs);

                // 滑块特殊处理
                if (type === 'range') {
                    const wrapper = document.createElement('div');
                    wrapper.style.display = 'flex';
                    wrapper.style.alignItems = 'center';

                    input.style.width = '80%';
                    input.style.marginRight = '10px';

                    const valueDisplay = document.createElement('span');
                    valueDisplay.textContent = value;
                    valueDisplay.style.width = '20%';
                    valueDisplay.style.textAlign = 'center';

                    input.addEventListener('input', () => {
                        valueDisplay.textContent = input.value;
                    });

                    wrapper.append(input, valueDisplay);
                    container.appendChild(wrapper);
                } else {
                    input.style.width = '100%';
                    input.style.padding = '6px';
                    input.style.border = '1px solid #ddd';
                    input.style.borderRadius = '4px';

                    if (type === 'checkbox') {
                        input.style.width = 'auto';
                        input.style.marginRight = '8px';
                        const wrapper = document.createElement('div');
                        wrapper.style.display = 'flex';
                        wrapper.style.alignItems = 'center';
                        wrapper.append(input, label);
                        container.innerHTML = '';
                        container.appendChild(wrapper);
                    } else {
                        container.appendChild(input);
                    }
                }
            }
        }

        return container;
    }

    // 应用额外属性
    function applyExtraAttrs(element, attrsStr) {
        if (!attrsStr) return;
        attrsStr.split(' ').forEach(attr => {
            const [key, val] = attr.split('=');
            if (key && val) {
                element.setAttribute(key, val.replace(/"/g, ''));
            }
        });
    }


    function showAlert(type, message, closeTime = 0) {
        // 类型样式映射
        const styleMap = {
            success: { bg: '#4CAF50', icon: '✓' },
            error: { bg: '#F44336', icon: '✕' },
            warning: { bg: '#FFC107', icon: '!' }
        };

        // 默认使用警告样式
        const style = styleMap[type] || styleMap.warning;

        // 创建提示框元素
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        background: ${style.bg};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 15px rgba(0,0,0,0.3);
        z-index: 999999;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: Arial, sans-serif;
        animation: slideDown 0.3s ease-out;
    `;

        // 构建内容（根据是否自动关闭决定是否显示关闭按钮）
        let content = `<span style="font-weight: bold; font-size: 1.2em;">${style.icon}</span>
                   <span>${message}</span>`;

        // 当不自动关闭时才显示关闭按钮
        if (closeTime <= 0) {
            content += `<button style="margin-left: 15px; background: rgba(255,255,255,0.3); border: none; color: white; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; transition: background 0.2s;">×</button>`;
        }

        alertDiv.innerHTML = content;

        // 添加到页面
        document.body.appendChild(alertDiv);

        // 关闭按钮事件（仅当存在关闭按钮时）
        const closeBtn = alertDiv.querySelector('button');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeAlert(alertDiv));
            // 按钮悬停效果
            closeBtn.addEventListener('mouseover', () => {
                closeBtn.style.background = 'rgba(255,255,255,0.5)';
            });
            closeBtn.addEventListener('mouseout', () => {
                closeBtn.style.background = 'rgba(255,255,255,0.3)';
            });
        }

        // 自动关闭功能
        if (closeTime > 0) {
            setTimeout(() => closeAlert(alertDiv), closeTime);
        }

        if (!document.getElementById('custom-alert-animations')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'custom-alert-animations';
            styleSheet.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
            document.head.appendChild(styleSheet);
        }
    }

    function closeAlert(alertDiv) {
        alertDiv.style.opacity = '0';
        alertDiv.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => alertDiv.remove(), 300);
    }

    // 创建设置菜单
    function createSettingsMenu() {
        let menu = document.getElementById('tampermonkey-settings-menu');
        if (menu) return menu;

        menu = document.createElement('div');
        menu.id = 'tampermonkey-settings-menu';
        menu.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 9999;
        min-width: 300px;
        max-width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        display: none;
    `;

        const title = document.createElement('h3');
        title.textContent = '脚本设置';
        title.style.cssText = `margin: 0 0 1.5rem 0; text-align: center; padding-bottom: 0.5rem; border-bottom: 1px solid #eee;`;
        menu.appendChild(title);

        const form = document.createElement('form');
        form.id = 'settings-form';
        settingsItems.forEach(item => {
            const saveValue = currentSettings[item.name];
            const parseValue = item.deserializeValue ? item.deserializeValue(saveValue) : saveValue;
            form.appendChild(createSettingItem(
                item.label,
                item.name,
                item.type,
                parseValue,
                item.extraAttrs,
                item.options
            ));
        });

        // 创建按钮容器，使按钮同排显示
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
        display: flex;
        gap: 10px;
        margin-top: 1rem;
    `;

        // 保存按钮
        const saveBtn = document.createElement('button');
        saveBtn.type = 'submit';
        saveBtn.textContent = '保存';
        saveBtn.style.cssText = `
        flex: 1;
        padding: 8px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;
        buttonContainer.appendChild(saveBtn);

        // 重置按钮
        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.textContent = '重置';
        resetBtn.style.cssText = `
        flex: 1;
        padding: 8px;
        background: #ffc107;
        color: #212529;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;
        resetBtn.addEventListener('click', (e) => {
            if (resetToDefault()) {
                hideMenu();
            }
        });
        buttonContainer.appendChild(resetBtn);

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
        flex: 1;
        padding: 8px;
        background: #6c757d;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;
        closeBtn.addEventListener('click', hideMenu);
        buttonContainer.appendChild(closeBtn);

        form.appendChild(buttonContainer);
        menu.appendChild(form);
        document.body.appendChild(menu);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (saveSettings()) {
                hideMenu();
            };
        });

        return menu;
    }

    function resetToDefault() {
        const confirmReset = confirm('确定要将所有设置恢复到默认值吗？此操作不可撤销。');

        if (!confirmReset) {
            return false;
        }
        GM_deleteValue(getSettingName());
        initSettings();
        showAlert('success', '设置已重置', 3000);
        return true;
    }


    // 保存设置
    function saveSettings() {
        const form = document.getElementById('settings-form');
        const toSaveSettings = {};
        for (const key in settingsItems) {
            const item = settingsItems[key];
            let rawValue;

            switch (item.type) {
                case 'checkbox-group':
                    rawValue = [];
                    item.options.forEach(option => {
                        if (form.elements[`${item.name}[${option.value}]`]?.checked) {
                            rawValue.push(option.value);
                        }
                    });
                    break;
                case 'radio-group':
                    rawValue = form.elements[item.name].value;
                    break;
                case 'checkbox':
                    rawValue = form.elements[item.name].checked;
                    break;
                default:
                    rawValue = form.elements[item.name].value;
            }
            if (item.validValue) {
                const msg = item.validValue(rawValue);
                if (msg) {
                    showAlert('warning', msg, 5000);
                    return false;
                }
            }
            const saveValue = item.serializeValue ? item.serializeValue(rawValue) : rawValue;
            toSaveSettings[item.name] = saveValue;
        }
        Object.keys(toSaveSettings).forEach(key => {
            currentSettings[key] = toSaveSettings[key];
        });
        GM_setValue(getSettingName(), currentSettings);
        showAlert('success', '设置已保存', 3000);
        return true;
    }

    // 显示/隐藏菜单
    function showMenu() {
        createSettingsMenu().style.display = 'block';
    }

    function hideMenu() {
        document.getElementById('tampermonkey-settings-menu')?.remove();
    }

    // 初始化
    const handler = chooseActiveHandler();
    if (handler == null) {
        return;
    }
    adjustDefaultSetting(handler);
    initSettings();
    GM_registerMenuCommand('脚本设置', showMenu, 's');
    if (!currentSettings.enabled) {
        return;
    }
    enhancementByHandler(handler, currentSettings);
})();
