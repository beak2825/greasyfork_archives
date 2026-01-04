// ==UserScript==
// @name         ⭐网页瞬间加载/跳过进度条直接加载网页（附重定向链接优化）⭐ 
// @namespace    fenda
// @version      1.0.15
// @description  任何链接内容跳过进度条秒加载，并优化删除重定向链接（解决95%的重定向问题,如知乎，微博等），所有参数可高度自定义
// @icon         data:image/png;base64,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
// @author       fenda
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/493851/%E2%AD%90%E7%BD%91%E9%A1%B5%E7%9E%AC%E9%97%B4%E5%8A%A0%E8%BD%BD%E8%B7%B3%E8%BF%87%E8%BF%9B%E5%BA%A6%E6%9D%A1%E7%9B%B4%E6%8E%A5%E5%8A%A0%E8%BD%BD%E7%BD%91%E9%A1%B5%EF%BC%88%E9%99%84%E9%87%8D%E5%AE%9A%E5%90%91%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96%EF%BC%89%E2%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/493851/%E2%AD%90%E7%BD%91%E9%A1%B5%E7%9E%AC%E9%97%B4%E5%8A%A0%E8%BD%BD%E8%B7%B3%E8%BF%87%E8%BF%9B%E5%BA%A6%E6%9D%A1%E7%9B%B4%E6%8E%A5%E5%8A%A0%E8%BD%BD%E7%BD%91%E9%A1%B5%EF%BC%88%E9%99%84%E9%87%8D%E5%AE%9A%E5%90%91%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96%EF%BC%89%E2%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 添加一个新的样式标签到文档的头部，如果已有同名ID的标签则不执行添加。
     * 
     * @param {string} styleId - 样式标签的ID，用于检查是否已经存在具有相同ID的样式。
     * @param {string} cssRules - 要添加的CSS规则的字符串表示，用于设置style标签的内容。
     */
    function addStyle(styleId, cssRules) {
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.setAttribute('type', 'text/css');
            style.innerHTML = cssRules;
            document.head.appendChild(style);
        }
    }

    function createElementWithStylesAndAttributes(tag, styles, attributes) {
        let element = document.createElement(tag);
        if (styles) {
            Object.assign(element.style, styles);
        }
        if (attributes) {
            for (const key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    if (key in element) {
                        element[key] = attributes[key];
                    } else {
                        element.setAttribute(key, attributes[key]);
                    }
                }
            }
        }
        return element;
    }

    /* ------------------------------- 以下是脚本的设置面板函数 ------------------------------- */

    /**
     * 主动画循环。
     */
    function animate() {
        if (loadingPanel.style.display === 'block') {
            stats.update();
        }
        requestAnimationFrame(animate);
    }
    /**
     * 检查是否有更新。
     */
    function checkForUpdates() {
        var lastCheckedTime = GM_getValue('lastCheckedTime', 0);
        var currentTime = Date.now();

        if (currentTime - lastCheckedTime >= 3600000) {
            GM_setValue('lastCheckedTime', currentTime);
            var updateURL = "https://update.greasyfork.org/scripts/493851/%E2%AD%90%E7%BD%91%E9%A1%B5%E7%9E%AC%E9%97%B4%E5%8A%A0%E8%BD%BD%E8%B7%B3%E8%BF%87%E8%BF%9B%E5%BA%A6%E6%9D%A1%E7%9B%B4%E6%8E%A5%E5%8A%A0%E8%BD%BD%E7%BD%91%E9%A1%B5%E2%AD%90.meta.js";

            fetch(updateURL).then(function(response) {
                response.text().then(function(text) {
                    var latestVersion = text.match(/@version\s+([^\n]+)/)[1];
                    if (latestVersion) {
                        GM_setValue('latestVersion', latestVersion);
                    }
                });
            }).catch(function(error) {
                console.error('An error occurred while checking for updates:', error);
            });
        }
    }

    /**
     * 创建特性列表项。
     *
     * @param {Array} features - 特性描述列表。
     * @returns {Array} - 转换为HTML元素列表的数组。
     */
    function createFeatureListItems(features) {
        return features.map(feature => {
            let parts = feature.split(',').map(part => part.trim());
            let listItem = createElementWithStylesAndAttributes('div', { width: '85px', height: '32px', lineHeight: '32px', backgroundColor: '#E0E5EC', margin: '3px 0', borderRadius: '5px', boxShadow: 'inset 2px 2px 4px #BECBD8, inset -2px -2px 4px #FFFFFF', textAlign: 'center', userSelect: 'none', whiteSpace: 'nowrap', fontSize: '14px', }, { innerText: parts[0] });
            let featureContainer = createElementWithStylesAndAttributes('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 'calc(100% - 6px)', marginTop: '3px', marginLeft: '3px', marginRight: '3px', boxSizing: 'border-box' });
            featureContainer.appendChild(listItem);
            if (parts.includes('information')) {
                function parseMarkdown(mdText) {
                    let htmlText = mdText;
                    htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // 加粗
                    htmlText = htmlText.replace(/\*(.*?)\*/g, "<em>$1</em>"); // 斜体
                    htmlText = htmlText.replace(/##(.*?)\n/g, "<h2>$1</h2>"); // 标题
                    htmlText = htmlText.replace(/\n/g, "<br>"); // 换行
                    htmlText = htmlText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>'); // 链接
                    return htmlText;
                }
                let infoIcon = createElementWithStylesAndAttributes("div", { position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'left', justifyContent: 'center' }, { innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>` });
                let infoBox = createElementWithStylesAndAttributes("div", { width: "300px", height: "auto", overflow: "auto", display: "none", position: "absolute", transform: "translateX(-50%)", backgroundColor: "#E0E5EC", borderRadius: "12px", boxShadow: "2px 2px 4px #AEBEC7, -2px -2px 4px #FFFFFF", zIndex: "2000" });
                let parsedContent = parseMarkdown(parts[4]);
                let infoText = createElementWithStylesAndAttributes("div", { padding: "10px", margin: "0", fontSize: "15px", fontWeight: "bold", textAlign: "left", textShadow: "2px 2px 3px rgba(0, 0, 0, 0.2)", color: "#4B5563" }, { innerHTML: parsedContent });

                infoBox.appendChild(infoText);
                document.body.appendChild(infoBox);
                document.addEventListener('mousemove', function(e) {
                    const mouseX = e.pageX;
                    const mouseY = e.pageY;
                    const offsetX = 20;
                    const offsetY = 20;
                    infoBox.style.left = `${mouseX + offsetX}px`;
                    infoBox.style.top = `${mouseY + offsetY}px`;
                });
                featureContainer.appendChild(infoIcon);
                infoIcon.addEventListener('mouseover', function() {
                    infoBox.style.display = 'block';
                });
                infoIcon.addEventListener('mouseout', function() {
                    infoBox.style.display = 'none';
                });
            }
            if (parts.includes('styleSelector')) {
                addStyle("neumorphic-checkbox-style", `
                    .neumorphic-checkbox { -webkit-appearance: none; appearance: none; background-color: #e0e5ec; margin: 0; font: inherit; color: currentColor; width: 30px; height: 30px; border: 2px solid #d1d9e6; border-radius: 4px; transform: translateY(-0.075em); display: grid; place-content: center; }
                    .neumorphic-checkbox { background-color: #ff3b3b; /* red for false */ }
                    .neumorphic-checkbox:checked { background-color: #3bff3b; /* green for true */ border-color: #28a745; box-shadow: inset 3px 3px 5px #b8c4d8, inset -3px -3px 5px #ffffff; }
                    .neumorphic-checkbox + span { vertical-align: middle; }
                `);

                let Selector = GM_getValue(parts[6]);
                let styleSelectorCheckbox = createElementWithStylesAndAttributes("input", {}, {
                    type: "checkbox",
                    checked: Selector || false,
                    className: "neumorphic-checkbox"
                });

                styleSelectorCheckbox.addEventListener("change", function() {
                    GM_setValue(parts[6], styleSelectorCheckbox.checked);

                    // 将背景颜色设置为红色或绿色取决于复选框的状态
                    styleSelectorCheckbox.style.backgroundColor = styleSelectorCheckbox.checked ? '#3bff3b' : '#ff3b3b';
                });

                // 设置初始背景颜色
                styleSelectorCheckbox.style.backgroundColor = Selector ? '#3bff3b' : '#ff3b3b';

                let checkboxContainer = createElementWithStylesAndAttributes("label", { display: 'flex', alignItems: 'center', justifyContent: 'space-between' });
                checkboxContainer.appendChild(styleSelectorCheckbox);
                featureContainer.appendChild(checkboxContainer);
            };

            if (parts.includes('settingButton')) {

                const settingButtonContainer = createElementWithStylesAndAttributes('div', { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '32px', margin: '5px 0' });

                const settingButton = createElementWithStylesAndAttributes('div', { cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', }, { innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" height="1.5em" fill="currentColor" viewBox="0 0 512 512"><path d="M 188 37 Q 192 20 205 10 L 205 10 Q 218 0 235 0 L 277 0 Q 294 0 307 10 Q 320 20 324 37 L 332 71 L 333 71 L 363 53 Q 378 44 394 46 Q 410 48 422 60 L 452 90 Q 464 102 466 118 Q 468 134 459 149 L 441 179 L 441 180 L 475 188 Q 492 192 502 205 Q 512 218 512 235 L 512 277 Q 512 294 502 307 Q 492 320 475 324 L 441 332 L 441 333 L 459 363 Q 468 378 466 394 Q 464 410 452 422 L 422 452 Q 410 464 394 466 Q 378 468 363 459 L 333 441 L 332 441 L 324 475 Q 319 492 307 502 Q 294 512 277 512 L 235 512 Q 218 512 205 502 Q 192 492 188 475 L 180 441 L 179 441 L 149 459 Q 134 468 118 466 Q 102 464 90 452 L 60 422 Q 48 410 46 394 Q 44 378 53 363 L 72 333 L 71 332 L 37 324 Q 20 320 10 307 Q 0 294 0 277 L 0 235 Q 0 218 10 205 Q 20 192 37 188 L 71 180 L 71 179 L 53 149 Q 44 134 46 118 Q 48 102 60 90 L 90 60 Q 102 48 118 46 Q 134 44 149 53 L 179 72 L 180 71 L 188 37 L 188 37 Z M 277 48 L 235 48 L 224 95 Q 220 107 208 112 Q 198 115 188 120 Q 176 125 165 119 L 124 94 L 94 124 L 119 165 Q 126 176 120 188 Q 115 198 112 208 Q 107 220 95 224 L 48 235 L 48 277 L 95 288 Q 107 292 112 304 Q 115 314 120 324 Q 125 336 119 347 L 94 388 L 124 418 L 165 393 Q 176 387 188 392 Q 198 397 208 400 Q 220 405 224 417 L 235 464 L 277 464 L 288 417 Q 292 405 304 400 Q 314 397 324 392 Q 336 387 347 393 L 388 418 L 418 388 L 393 347 Q 387 336 392 324 Q 397 314 400 304 Q 405 292 417 288 L 464 277 L 464 235 L 417 224 Q 405 220 400 208 Q 397 198 392 188 Q 387 176 393 165 L 418 124 L 388 94 L 347 119 Q 336 126 324 120 Q 314 115 304 112 Q 292 107 288 95 L 277 48 L 277 48 Z M 292 163 L 260 355 Q 255 373 237 372 Q 219 367 220 349 L 252 157 Q 257 139 275 140 Q 293 145 292 163 L 292 163 Z M 198 230 L 172 256 L 198 282 Q 210 296 198 310 Q 184 322 170 310 L 130 270 Q 118 256 130 242 L 170 202 Q 184 190 198 202 Q 210 216 198 230 L 198 230 Z M 342 202 L 382 242 Q 394 256 382 270 L 342 310 Q 328 322 314 310 Q 302 296 314 282 L 340 256 L 314 230 Q 302 216 314 202 Q 328 190 342 202 L 342 202 Z" /></svg>` });


                settingButton.addEventListener('click', function() {
                    document.body.style.overflow = 'hidden';
                    const settingParametersPanel = createElementWithStylesAndAttributes('div', { display: 'none', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', flexDirection: 'column', background: '#E0E5EC', border: '1px solid #BECBD8', borderRadius: '10px', boxShadow: '2px 2px 8px #BECBD8, -2px -2px 8px #FFFFFF', width: '300px', height: '300px', zIndex: '1500' });
                    const settingTitle = createElementWithStylesAndAttributes('div', { fontSize: '16px', fontWeight: 'bold', margin: '10px 0', textAlign: 'center' }, { innerHTML: '重定向调试菜单' });
                    const settingOptions = createElementWithStylesAndAttributes('div', { userSelect: 'none', fontSize: '14px', padding: '10px', textAlign: 'left', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' });
                    const siteLinksOption = createElementWithStylesAndAttributes('div', { cursor: 'pointer', fontSize: '14px', padding: '10px', textAlign: 'left', whiteSpace: 'nowrap', borderBottom: '1px solid #BECBD8' }, { innerHTML: '本站链接' });
                    const parametersOption = createElementWithStylesAndAttributes('div', { cursor: 'pointer', fontSize: '14px', padding: '10px', textAlign: 'left', whiteSpace: 'nowrap' }, { innerHTML: '参数设置' });
                    let count = 1;
                    let preloadedLinks = GM_getValue('preloadedLinks', []);
                    const settingInputBox = createElementWithStylesAndAttributes('div', { fontSize: '13px', id: 'redirectConversionLinks', padding: '10px', flex: '1 1', height: '230px', resize: 'none', borderRadius: '10px', boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff', overflow: 'auto' }, { innerHTML: preloadedLinks.map(linkData => { return `<div class="styledPanel"> <strong>${count++}.</strong> <br>原链接：${linkData.url} <br>优化后：${linkData.optimizedUrl || linkData.url} <br>重定向参数: ${linkData.redirectParameter} </div> `; }).join('') });
                    addStyle('customDisplayStyles', ` .styledPanel { width: 100%; margin: 5px 0; padding: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); white-space: pre-line; /* 允许长单词换行 */ word-wrap: break-word; } `);
                    const settingOptionsContainer = createElementWithStylesAndAttributes('div', { display: 'flex', flexDirection: 'row', overflow: 'hidden', alignItems: 'top', marginRight: '15px' });
                    const settingCloseButton = createElementWithStylesAndAttributes('div', { cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', position: 'absolute', top: '0', right: '0', margin: '10px 0 20px 10px' }, { innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="currentColor" viewBox="0 0 334 334"><path d="M 320 48 Q 334 31 320 14 Q 303 0 286 14 L 167 133 L 48 14 Q 31 0 14 14 Q 0 31 14 48 L 133 167 L 14 286 Q 0 303 14 320 Q 31 334 48 320 L 167 201 L 286 320 Q 303 334 320 320 Q 334 303 320 286 L 201 167 L 320 48 L 320 48 Z" /></svg>` });
                    settingOptionsContainer.appendChild(settingOptions);
                    settingOptionsContainer.appendChild(settingInputBox);
                    settingParametersPanel.appendChild(settingTitle);
                    settingParametersPanel.appendChild(settingOptionsContainer);
                    settingParametersPanel.appendChild(settingCloseButton);
                    document.body.appendChild(settingParametersPanel);
                    settingCloseButton.addEventListener('click', function() {
                        const newQueryItemsText = document.getElementById('queryItemsList').value.split(',');
                        console.log(newQueryItemsText);
                        if (newQueryItemsText) {
                            GM_setValue('queryItemsList', newQueryItemsText);
                            showAlert("重定向参数保存成功");
                            console.log(GM_getValue('queryItemsList'));
                        } else {
                            showAlert("请确保输入参数后再保存！");
                        }
                        settingParametersPanel.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    });
                    const originalContent = settingInputBox.innerHTML;
                    siteLinksOption.addEventListener('click', function() {
                        settingInputBox.innerHTML = originalContent;
                    });
                    parametersOption.addEventListener('click', function() {
                        settingInputBox.innerHTML = '';
                        console.log(GM_getValue('queryItemsList'));
                        const joinQueryItems = GM_getValue('queryItemsList').join(',');
                        settingInputBox.innerHTML = `<textarea id="queryItemsList" class="styledPanel" style="height: calc(100% - 20px); width: calc(100%-10px); overflow: auto ;">${joinQueryItems}</textarea>`;
                    });
                    settingParametersPanel.style.display = 'flex';
                    settingOptions.appendChild(siteLinksOption);
                    settingOptions.appendChild(parametersOption);
                });



                settingButtonContainer.appendChild(settingButton);
                featureContainer.appendChild(settingButtonContainer);
            }
            parts.slice(1).forEach((componentType, idx) => {
                let component;
                let defaultValue;
                switch (componentType) {
                    case 'numberPicker':
                        defaultValue = GM_getValue(parts[idx + 2]);
                        component = createUIComponent('numberPicker', { value: defaultValue, min: 0, max: 100, step: 1, key: parts[idx + 2] });
                        break;
                    case 'inputBox':
                        defaultValue = GM_getValue(parts[idx + 2]);
                        component = createUIComponent('inputBox', { type: 'text', value: defaultValue, key: parts[idx + 2] });
                        break;
                    case 'selector':
                        defaultValue = GM_getValue(parts[idx + 2]);
                        component = createUIComponent('selector', { options: optionsArray, key: parts[idx + 2] });
                        break;
                    case 'switch':
                        defaultValue = GM_getValue(parts[idx + 2]);
                        component = createUIComponent('switch', { checked: defaultValue, key: parts[idx + 2] });
                        break;
                    case 'shortcutKeySetting':
                        defaultValue = GM_getValue(parts[idx + 2]);
                        component = createUIComponent('shortcutKeySetting', { value: defaultValue, key: parts[idx + 2] });
                        break;
                    default:
                        break;
                }
                if (component) {
                    featureContainer.appendChild(component);
                }
            });



            return featureContainer;
        });
    }

    /**
     * 创建并初始化特色功能面板。
     *
     * @param {string} id - 该面板的HTML元素ID。
     * @param {number} translateX - 初始移动位置的距离。
     * @returns {HTMLElement} - 创建的特色功能面板元素。
     */
    function createShowcaseFeaturesPanel(id, translateX) {
        let showcaseFeatures = createElementWithStylesAndAttributes('div', { position: "absolute", width: "250px", height: "270px", borderRadius: "15px", display: "flex", alignItems: "flex-start", flexDirection: "column", justifyContent: "flex-start", background: "#E0E5EC", boxShadow: "2px 2px 8px #BECBD8, -2px -2px 8px #FFFFFF", transition: "transform 0.5s ease", transform: `translateX(${translateX}px)`, overflow: "hidden" });
        showcaseFeatures.id = id;
        return showcaseFeatures;
    }

    /**
     * 创建不同的UI组件。
     *
     * @param {string} type - 组件类型。
     * @param {Object} options - 用于创建组件的选项。
     * @param {string} [options.value] - 组件的当前值。
     * @param {Object} options.min - 组件的最小值。
     * @param {Object} options.max - 组件的最大值。
     * @param {Object} options.step - 组件的步长值。
     * @param {Array} options.options - 下拉选项。
     * @param {boolean} options.checked - 开关的选中状态。
     * @returns {HTMLElement} - 相应类型的行内UI组件。
     */
    function createUIComponent(type, options, ) {

        if (type === 'switch') {
            addStyle('optimized-switch-style', `
                .optimizedswitchcontainer input[type="checkbox"] {  width: 0; height: 0; opacity: 0; }
                .optimizedswitchcontainer { position: relative; display: inline-block; width: 34px; height: 14px; }
                .optimizedswitchslider { position: absolute; cursor: pointer; top: 0; bottom: 0; left: 0; right: 0; background-color: #ccc; transition: .4s; }
                .optimizedswitchslider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 0; bottom: -3px; background-color: white; transition: .4s; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
                .optimizedswitchcontainer input:checked + .optimizedswitchslider { background-color: #00FF00; }
                .optimizedswitchcontainer input:focus + .optimizedswitchslider { box-shadow: 0 0 1px #2196F3; }
                .optimizedswitchcontainer input:checked + .optimizedswitchslider:before { transform: translateX(18px); }
            `);
            let switchContainer = createElementWithStylesAndAttributes("label", {}, {
                className: "optimizedswitchcontainer"
            });

            let switchInput = createElementWithStylesAndAttributes("input", {}, {
                type: "checkbox",
                checked: options.checked || false,
            });

            switchInput.addEventListener("change", function() {
                GM_setValue(options.key, this.checked);
            });

            let switchSlider = createElementWithStylesAndAttributes("span", {}, {
                className: "optimizedswitchslider"
            });

            switchContainer.appendChild(switchInput);
            switchContainer.appendChild(switchSlider);

            return switchContainer;
        } else if (type === 'inputBox') {
            addStyle("neumorphic-style",
                `.neu-display-box { font-size: 14px; background: #e0e5ec; border-radius: 10px; box-shadow: 2px 2px 4px #a3b1c6, -2px -2px 4px #ffffff; transition: all 0.3s; display: flex; justify-content: center; align-items: center; cursor: pointer; width: 80px; height: 30px; overflow: hidden; white-space: nowrap; }
                .neu-input-modal { width: 200px;height: 300px; display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #e0e5ec; border-radius: 10px; box-shadow: 2px 2px 4px #a3b1c6, -2px -2px 4px #ffffff; width: 280px; box-sizing: border-box; justify-content: center; align-items: center; flex-direction: column;z-index: 1500; }
                .neu-text-input, .button-row button { border: none; background: none; outline: none; }
                .neu-text-input { padding: 10px;width: 250px; height: 200px; resize: none; margin-bottom: 10px; border-radius: 10px; box-shadow: inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff; }
                .button-row { display: flex; justify-content: space-between; width: calc(100% - 34px); }
                .button-row button { width: 95px; cursor: pointer; background: #e0e5ec; border-radius: 5px;  box-shadow: 2px 2px 4px #a3b1c6, -2px -2px 4px #ffffff; }
                .button-row button:hover { box-shadow: inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff; }
            `);

            let modal = createElementWithStylesAndAttributes("div", {}, {
                className: "neu-input-modal",
            });

            let textInput = createElementWithStylesAndAttributes("textarea", {}, {
                className: "neu-text-input",
                value: GM_getValue(options.key) || "",
            });

            let valueDisplay = options.value.join(',').length > 5 ? options.value.join(',').substring(0, 5) + '...' : options.value.join(',') || "点击输入";
            let displayBox = createElementWithStylesAndAttributes("div", { id: "displayBox" }, {
                className: "neu-display-box",
                innerHTML: valueDisplay,
                onclick: function() {
                    modal.style.display = 'flex';
                    textInput.focus();
                    var textLength = textInput.value.length;
                    textInput.setSelectionRange(textLength, textLength);
                }
            });

            let buttonRow = createElementWithStylesAndAttributes("div", {}, {
                className: "button-row",
            });


            let saveButton = createElementWithStylesAndAttributes("button", {}, {
                innerHTML: '保存',
                onclick: function() {
                    modal.style.display = 'none';
                    let userInput = textInput.value.trim();
                    let userDomains = userInput ? userInput.split(',') : [];
                    GM_setValue(options.key, userDomains);
                    updateDomainLists();
                    displayBox.textContent = userDomains.join(',').length > 5 ? userDomains.join(',').substring(0, 5) + '...' : userDomains.join(',') || "点击输入";
                    showAlert('域名已保存！');
                }
            });


            let addDomainButton = createElementWithStylesAndAttributes("button", {}, {
                innerHTML: '添加当前域名到输入框',
                onclick: function() {
                    var domain = window.location.hostname;
                    var domainList = GM_getValue(options.key, []);
                    if (!domainList.includes(domain)) {
                        domainList.push(domain);
                        GM_setValue(options.key, domainList);
                        updateDomainLists();
                        modal.style.display = 'none';
                        textInput.value = domainList.join(',');
                        displayBox.textContent = domainList.join(',').length > 5 ? domainList.join(',').substring(0, 5) + '...' : domainList.join(',');
                        showAlert('域名已保存！');
                    } else {
                        showAlert('域名已存在！');
                    }
                }
            });

            buttonRow.appendChild(saveButton);
            buttonRow.appendChild(addDomainButton);

            modal.appendChild(textInput);
            modal.appendChild(buttonRow);

            document.body.appendChild(modal);

            return displayBox;
        } else if (type === 'selector') {
            addStyle("neumorphic-selector-modal-style",
                `.neu-selector-display {  font-size: 14px; line-height: 32px;height: 32px; width: 80px; background: #e0e5ec; border-radius: 10px; box-shadow: 2px 2px 4px #a3b1c6, -2px -2px 4px #ffffff;cursor: pointer; user-select: none; position: relative; text-align: center; }
                .neu-selector-modal { display: none; position: absolute; background: #e0e5ec; box-shadow: 2px 2px 4px #a3b1c6, -2px -2px 4px #ffffff; border-radius: 10px; z-index: 1000; flex-direction: column; }
                .neu-selector-modal-open { display: flex; }
                .neu-selector-option { font-size: 18px;margin-bottom: 2px;white-space: nowrap; cursor: pointer; user-select: none; text-align: center; width: 70px; box-sizing: border-box; }
                .neu-selector-option:hover { background-color: #d1d9e6; }
            `);

            let selectorDisplay = createElementWithStylesAndAttributes("div", {}, {
                className: "neu-selector-display"
            });

            let modal = createElementWithStylesAndAttributes("div", {}, {
                className: "neu-selector-modal"
            });

            let container = document.createElement("div");
            container.style.position = "relative";

            function selectOption(option) {
                GM_setValue(options.key, option);
                selectorDisplay.textContent = GM_getValue(options.key);
                modal.className = "neu-selector-modal";
            }

            optionsArray.forEach((option) => {
                let optionElement = createElementWithStylesAndAttributes("div", {}, {
                    className: "neu-selector-option",
                    textContent: option,
                    onclick: () => selectOption(option)
                });
                modal.appendChild(optionElement);
            });

            selectorDisplay.addEventListener("click", function(event) {
                event.stopPropagation();
                modal.className = modal.className.includes("neu-selector-modal-open") ? "neu-selector-modal" : "neu-selector-modal neu-selector-modal-open";
                let modalRect = modal.getBoundingClientRect();
                modal.style.left = `-${selectorDisplay.offsetWidth}px`;
                modal.style.top = `${(selectorDisplay.offsetHeight - modalRect.height) / 2}px`;
            });
            document.addEventListener("click", function() {
                modal.className = "neu-selector-modal";
            });
            container.appendChild(selectorDisplay);
            container.appendChild(modal);
            selectorDisplay.textContent = GM_getValue(options.key);

            return container;
        } else if (type === 'shortcutKeySetting') {
            addStyle("shortcutKeySetting-style", `
                .shortcutKeySetting-displayBox { width: 80px; height: 32px; overflow:auto ;background: #e0e5ec; border-radius: 5px; box-shadow: inset 2px 2px 4px #BECBD8, inset -2px -2px 4px #FFFFFF; border: none;  margin: 5px 0; flex: 1; text-align: center; outline: none; width: 80px; }
                .shortcutKeySetting-button { width: 60px; height: 32px; margin-left: 10px; background: #e0e5ec; border-radius: 10px; box-shadow: 2px 2px 4px #a3b1c6, -2px -2px 4px #ffffff; border: none; cursor: pointer; user-select: none; }
                .shortcutKeySetting-container { display: flex; justify-content: space-between; align-items: center; box-sizing: border-box;  }
            `);

            let container = createElementWithStylesAndAttributes('div', {}, {
                className: "shortcutKeySetting-container"
            });

            let shortcutKeyValue = GM_getValue(options.key);
            let displayPlaceholder = shortcutKeyValue ? shortcutKeyValue.toUpperCase() : '快捷键';

            let displayBox = createElementWithStylesAndAttributes('input', {}, {
                type: 'text',
                readOnly: true,
                placeholder: displayPlaceholder,
                className: "shortcutKeySetting-displayBox"
            });

            let setButton = createElementWithStylesAndAttributes('button', {}, {
                innerText: '设定',
                className: "shortcutKeySetting-button"
            });

            setButton.addEventListener('click', function() {
                displayBox.value = '按下任意键...';
                displayBox.disabled = false;
                let keySequence = [];

                let keyDownEvent = function(event) {
                    event.preventDefault();
                    let key = event.key.toLowerCase();
                    if (!keySequence.includes(key)) {
                        keySequence.push(key);
                        displayBox.value = keySequence.join('+').toUpperCase();
                        GM_setValue(options.key, keySequence.join('+'));
                        console.log(GM_getValue(options.key));
                    }
                };

                let keyUpEvent = function() {
                    document.removeEventListener('keydown', keyDownEvent);
                    displayBox.disabled = true;
                    document.removeEventListener('keyup', keyUpEvent);
                };

                document.addEventListener('keydown', keyDownEvent);
                document.addEventListener('keyup', keyUpEvent);
            });

            container.appendChild(displayBox);
            container.appendChild(setButton);

            return container;
        } else if (type === 'numberPicker') {
            addStyle("neumorphic-numberPicker-style",
                `.neu-numberPicker-container { max-width: 121px;width: 100%; height: 32px; display: flex; align-items: center; justify-content: space-between; background: #e0e5ec; border-radius: 10px; box-shadow: 2px 2px 4px #a3b1c6, -2px -2px 4px #ffffff; }
                 .neu-numberPicker-button { background: #e0e5ec; border: none; border-radius: 100%; box-shadow: 2px 2px 4px #a3b1c6, -2px -2px 4px #ffffff; width: 30px; height: 30px; cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center; user-select: none; min-width: 30px;}
                 .neu-numberPicker-button:active {box-shadow: inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff; }
                 .neu-numberPicker-value {width: 40px; text-align: center; font-size: 16px; background: transparent; border: none; outline: none; margin: 0 auto;  
            }`);

            let container = createElementWithStylesAndAttributes("div", {}, {
                className: "neu-numberPicker-container"
            });

            let intervalId = null;

            const updateValue = (increment) => {
                let currentValue = parseInt(valueDisplay.value, 10) || 0;
                let newValue = increment ? currentValue + 1 : currentValue - 1;
                if (newValue < 1) {
                    newValue = 1; // 最小值限制
                    showAlert('亲，“1”难道还不够小嘛');
                }
                valueDisplay.value = newValue;
                GM_setValue(options.key, valueDisplay.value);
            };

            const createContinuousButton = (innerHTML, increment) => {
                let button = createElementWithStylesAndAttributes("button", {}, {
                    innerHTML: innerHTML,
                    className: "neu-numberPicker-button"
                });

                button.addEventListener("mousedown", function() {
                    updateValue(increment);
                    intervalId = setInterval(() => updateValue(increment), 200);
                });

                ['mouseup', 'mouseleave'].forEach(event => {
                    button.addEventListener(event, function() {
                        clearInterval(intervalId);
                    });
                });

                return button;
            };

            let currentValue = GM_getValue(options.key, 0);

            let valueDisplay = createElementWithStylesAndAttributes("input", {}, {
                type: "text",
                value: currentValue,
                className: "neu-numberPicker-value",
                oninput: function() {
                    this.value = this.value.replace(/[^0-9]/g, '');
                    GM_setValue(options.key, this.value);
                }
            });

            let minusButton = createContinuousButton('➖', false);
            let plusButton = createContinuousButton('➕', true);

            container.appendChild(minusButton);
            container.appendChild(valueDisplay);
            container.appendChild(plusButton);

            return container;
        } else {
            throw new Error('不支持的UI组件类型');
        }
    }

    /**
     * 创建显示版本信息的元素，并添加到页面中。
     *
     * @returns {HTMLElement} - 包含版本信息和更新日志按钮的元素。
     */
    function createVersionInfoElement() {
        const versionInfo = createElementWithStylesAndAttributes('div', {
            position: 'relative',
            left: '20px',
            width: 'auto',
            bottom: `5px`,
            fontSize: '10px',
            color: '#666',
            display: 'flex',
            marginTop: '10px',
        });

        const currentVersion = '1.0.15';
        versionInfo.innerHTML = `<strong>当前版本：${currentVersion}（最新版本：${GM_getValue('latestVersion', '1.0.15')}）</strong>`;

        const updateLogButton = document.createElement('button');
        updateLogButton.innerHTML = '更新日志';
        updateLogButton.style.cssText = 'display: flex; flex-direction: row; flex-wrap: wrap; position: relative; right: 0px; background-color: #e0e5ec; border: none; border-radius: 10px; cursor: pointer;';

        if (updateLogButton) {
            updateLogButton.onclick = fetchAndDisplayVersionHistory;
        }

        versionInfo.appendChild(updateLogButton);

        return versionInfo;
    }

    /**
     * 显示版本历史面板。
     *
     * @param {string} versionHistory - 版本历史内容的HTML字符串。
     */
    function displayVersionHistoryPanel(versionHistory) {
        let versionHistoryPanel = document.getElementById('versionHistoryPanel');
        if (!versionHistoryPanel) {
            versionHistoryPanel = document.createElement('div');
            versionHistoryPanel.id = 'versionHistoryPanel';
            document.body.appendChild(versionHistoryPanel);
        } else {

            versionHistoryPanel.style.display = 'block';
        }
        versionHistoryPanel.innerHTML = `
            <div id="versionHistoryContent" style="padding: 10px; position: relative; width: 300px; height: 300px; overflow: auto; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #e0e5ec; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4), 0 6px 20px 0 rgba(0,0,0,0.19); border-radius: 15px; box-sizing: border-box; z-index: 10000; display: block; font-family: Arial, sans-serif;">
                <button id="closeVersionHistory" style="position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer;">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" fill="currentColor" viewBox="0 0 334 334"><path d="M 320 48 Q 334 31 320 14 Q 303 0 286 14 L 167 133 L 48 14 Q 31 0 14 14 Q 0 31 14 48 L 133 167 L 14 286 Q 0 303 14 320 Q 31 334 48 320 L 167 201 L 286 320 Q 303 334 320 320 Q 334 303 320 286 L 201 167 L 320 48 L 320 48 Z" /></svg>
                </button>
                <h2 style="text-align: center; font-size: 20px; font-weight: bold; color: #333; margin-bottom: 20px; text-shadow: 1px 1px 2px #888;">更新日志</h2>
                ${versionHistory}
            </div>
        `;

        document.getElementById('closeVersionHistory').addEventListener('click', function() {
            versionHistoryPanel.style.display = 'none';
        });
    }

    /**
     * 通过Greasy Fork网站获取版本历史信息并显示在自定义面板中。
     */
    async function fetchAndDisplayVersionHistory() {
        const url = 'https://greasyfork.org/zh-CN/scripts/493851-%E7%BD%91%E9%A1%B5%E7%9E%AC%E9%97%B4%E5%8A%A0%E8%BD%BD-%E8%B7%B3%E8%BF%87%E8%BF%9B%E5%BA%A6%E6%9D%A1%E7%9B%B4%E6%8E%A5%E5%8A%A0%E8%BD%BD%E7%BD%91%E9%A1%B5/versions';

        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const versionHistory = doc.querySelector('.history_versions');
            if (versionHistory) {
                displayVersionHistoryPanel(versionHistory.innerHTML);
            } else {
                throw new Error('无法找到更新历史信息的元素');
            }
        } catch (error) {
            console.error('Failed to fetch version history', error);
            showAlert('无法获取更新历史，请稍后重试。');
        }
    }

    /**
     * 初始化默认设置并存储。
     */
    function initializeDefaultSettings() {
        const defaultSettings = {
            backToThePreviousPage: "shift+r",
            blacklistDomains: [],
            blackSelector: true,
            concurrentLoadingNumber: 5,
            forward: "shift+f",
            goToTheCorrespondingPage: "shift+e",
            lazyLoadImages: false,
            loadedStyle: "下划线",
            manipulatorBall: true,
            mobileGestures: true,
            previewHoverWindow: false,
            redirectOptimization: true,
            setShortcuts: "shift+s",
            asynchronousResources: true,
            whitelistDomains: [],
            whiteSelector: false,
            maxContentSize: 5,
            maxStorageItems: 100,
            dataCleanupInterval: 1,
            is_loadedStyle: true,
            monitorRefresh: 2,
        };

        Object.keys(defaultSettings).forEach((key) => {
            let currentValue = GM_getValue(key);
            if (currentValue === undefined || currentValue === null) {
                GM_setValue(key, defaultSettings[key]);
            }
        });
    }

    function replaceDownloadLink() {
        if (/lanz/.test(window.location.hostname)) {
            let downloadLinks = document.querySelectorAll('a');
            downloadLinks.forEach(link => {
                if (link.textContent.includes('立即下载')) {
                    let scripts = document.querySelectorAll('script');
                    scripts.forEach(script => {
                        let match = script.textContent.match(/var link = '(.*?)';/);
                        if (match) {
                            let newLink = window.location.hostname + '/' + match[1] + "##";
                            console.log(newLink);
                            link.href = '//' + newLink;
                        }
                    });
                } else if (/下载\(\s*[\d\.]+\s*K\s*\)/.test(link.textContent)) {
                    let scripts = document.querySelectorAll('script');
                    let vkjxld, hyggid;

                    scripts.forEach(script => {
                        let match_vk = script.textContent.match(/var vkjxld = '(.*?)';/);
                        let match_hy = script.textContent.match(/var hyggid = '(.*?)';/);

                        if (match_vk) {
                            vkjxld = match_vk[1];
                        }

                        if (match_hy) {
                            hyggid = match_hy[1];
                        }
                    });

                    if (vkjxld && hyggid) {
                        let newLink = vkjxld + hyggid;
                        console.log(newLink);
                        link.href = newLink;
                    }
                }
            });
        }
    }



    /**
     * 设置当前激活的面板，并对动画进行处理。
     *
     * @param {string} activePanelId - 要激活的面板ID。
     */
    function setActivePanel(activePanelId) {
        if (isAnimating) return;
        isAnimating = true;
        updateActiveIndicator(activePanelId);

        const panelIds = ['panel1', 'panel2', 'panel3']; // 面板ID列表按顺序
        const currentActiveIndex = panelIds.indexOf(currentActivePanelId);
        const targetActiveIndex = panelIds.indexOf(activePanelId);
        const direction = targetActiveIndex > currentActiveIndex ? -1 : 1; // 目标在右边则向左(-1), 否则向右(1)

        // 根据目标和当前激活的面板，计算出移动距离
        let moveDistance = direction * Math.abs(targetActiveIndex - currentActiveIndex) * 290; // 每个面板间隔250px宽度

        // 创建移动函数，面板根据方向和距离移动
        const animatePanel = (panelId, distance) => {
            const panel = document.getElementById(panelId);
            let currentTranslateX = parseFloat(panel.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
            panel.style.transform = `translateX(${currentTranslateX + distance}px)`;
        };

        panelIds.forEach(id => {
            animatePanel(id, moveDistance);
        });

        // 动画结束后，重置面板位置并只显示目标面板
        setTimeout(() => {
            panelIds.forEach(id => {
                const panel = document.getElementById(id);
                panel.style.transform = `translateX(${(panelIds.indexOf(id) - targetActiveIndex) * 270}px)`;
            });
            currentActivePanelId = activePanelId;
            isAnimating = false;
        }, 500);
    }

    /**
     * 在屏幕上显示一段提示信息。
     *
     * @param {string} message - 需要展示的消息。
     */
    function showAlert(message) {
        let alertBox = createElementWithStylesAndAttributes("div", { width: "300px", position: "fixed", bottom: "10px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#E0E5EC", borderRadius: "5px", boxShadow: "2px 2px 2px #AEBEC7, -2px -2px 2px #FFFFFF", zIndex: "2000" });
        let alertText = createElementWithStylesAndAttributes("div", { margin: "0", fontSize: "16px", fontWeight: "bold", textAlign: "center", textShadow: "2px 2px 3px rgba(0, 0, 0, 0.2)", color: "#4B5563" }, { innerText: message });
        alertBox.appendChild(alertText);
        document.body.appendChild(alertBox);

        setTimeout(function() {
            alertBox.style.opacity = "1";
        }, 10);

        setTimeout(function() {
            alertBox.style.opacity = "0";
            alertBox.addEventListener('transitionend', function() {
                document.body.removeChild(alertBox);
            }, { once: true });
        }, 1500);
    }

    /**
     * 性能分析工具的主要类。
     */
    var Stats = function() {
        var currentMode = 0;
        var container = createElementWithStylesAndAttributes('div', { position: 'fixed', bottom: '10px', right: '10px', left: '10px', cursor: 'pointer', opacity: '0.9', zIndex: '10000' });
        container.addEventListener('click', function(event) {
            event.preventDefault();
            showPanel(++currentMode % container.children.length);
        }, false);
        // 初始化性能监视计时
        var startTime = (performance || Date).now(),
            prevTime = startTime;
        var frames = 0;
        // 创建并添加面板
        var fpsPanel = addPanel(new Stats.Panel('FPS', '#0ff', '#002'));
        var msPanel = addPanel(new Stats.Panel('MS', '#0f0', '#020'));
        var memPanel;
        // 判断performance.memory是否可用以监视内存使用
        if (self.performance && self.performance.memory) {
            memPanel = addPanel(new Stats.Panel('MB', '#f08', '#201'));
        }

        showPanel(0);

        function addPanel(panel) {
            container.appendChild(panel.dom);
            return panel;
        }

        function showPanel(mode) {
            for (var i = 0; i < container.children.length; i++) {
                container.children[i].style.display = i === mode ? 'block' : 'none';
            }
            currentMode = mode;
        }
        return {
            dom: container,
            addPanel: addPanel,
            showPanel: showPanel,
            begin: function() {
                startTime = (performance || Date).now();
            },
            end: function() {
                frames++;
                var time = (performance || Date).now();
                msPanel.update(time - startTime, 200);

                if (time > prevTime + GM_getValue('monitorRefresh', 2) * 1000) {
                    fpsPanel.update((frames * 1000) / (time - prevTime), 100);
                    prevTime = time;
                    frames = 0;
                    if (memPanel) {
                        var memory = performance.memory;
                        memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
                    }
                }
                return time;
            },
            update: function() {
                startTime = this.end();
            }
        };
    };

    /**
     * Stats中的Panel类，用来展示性能数据。
     *
     * @param {string} name - 面板显示的标题。
     * @param {string} fg - 前景色。
     * @param {string} bg - 背景色。
     */
    Stats.Panel = function(name, fg, bg) {
        var min = Infinity,
            max = 0;
        var round = Math.round;
        var pixelRatio = round(window.devicePixelRatio || 1);
        var width = 80 * pixelRatio,
            height = 48 * pixelRatio;
        var textPadding = 3 * pixelRatio,
            textHeight = 2 * pixelRatio;
        var graphX = 3 * pixelRatio,
            graphY = 15 * pixelRatio;
        var graphWidth = 74 * pixelRatio,
            graphHeight = 30 * pixelRatio;
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.cssText = 'width:80px;height:48px';
        var context = canvas.getContext('2d');
        context.font = 'bold ' + (9 * pixelRatio) + 'px Helvetica,Arial,sans-serif';
        context.textBaseline = 'top';
        context.fillStyle = bg;
        context.fillRect(0, 0, width, height);
        context.fillStyle = fg;
        context.fillText(name, textPadding, textHeight);
        context.fillRect(graphX, graphY, graphWidth, graphHeight);
        context.fillStyle = bg;
        context.globalAlpha = 0.9;
        context.fillRect(graphX, graphY, graphWidth, graphHeight);

        return {
            dom: canvas,
            update: function(value, maxValue) {
                min = Math.min(min, value);
                max = Math.max(max, value);
                context.fillStyle = bg;
                context.globalAlpha = 1;
                context.fillRect(0, 0, width, graphY);
                context.fillStyle = fg;
                context.fillText(round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')', textPadding, textHeight);
                context.drawImage(canvas, graphX + pixelRatio, graphY, graphWidth - pixelRatio, graphHeight, graphX, graphY, graphWidth - pixelRatio, graphHeight);
                context.fillRect(graphX + graphWidth - pixelRatio, graphY, pixelRatio, graphHeight);
                context.fillStyle = bg;
                context.globalAlpha = 0.9;
                context.fillRect(graphX + graphWidth - pixelRatio, graphY, pixelRatio, round((1 - value / maxValue) * graphHeight));
            }

        };
    };

    /**
     * 更新当前激活面板的指示器样式。
     *
     * @param {string} activePanelId - 当前激活的面板ID。
     */
    function updateActiveIndicator(activePanelId) {
        // 首先重置所有按钮的样式
        [settingsParameters, additionalFeatures, shortcutKeys].forEach(button => {
            button.style.fontSize = "20px";
            button.style.textShadow = "none";
        });

        // 根据当前激活的面板ID，将对应按钮的字体放大并添加立体效果
        if (activePanelId === 'panel1') {
            settingsParameters.style.fontSize = "24px";
            settingsParameters.style.textShadow = "1px 1px #888888";
        } else if (activePanelId === 'panel2') {
            additionalFeatures.style.fontSize = "24px";
            additionalFeatures.style.textShadow = "1px 1px #888888";
        } else if (activePanelId === 'panel3') {
            shortcutKeys.style.fontSize = "24px";
            shortcutKeys.style.textShadow = "1px 1px #888888";
        }
    }

    /*-------------以下为重定向优化的具体实现函数-------------*/

    /**
     * 重定向优化的主要参数，每个参数代表重定向的查询参数名称(基本涵盖95%的重定向链接)。
     */
    const queryItems = [
        'url', 'target', 'href', 'tid', 'u', 'goto', 'link',
        'remoteUrl', 'to', 'redirect', 'iv', 'safecheck', 'black',
        'sinaurl', 'newredirectconfirmcgi', 'view', 'go.shtml', 'link',
        'linkout', 'link2', 'go-wild', 'id', 'jump', 'jump.php', 'web',
        'security', 'r', 'redirect_link', 'youtube.com/redirect',
    ];



    if (typeof GM_getValue === 'function') {
        var queryItemsList = GM_getValue('queryItemsList', []);
        var queryItemsLists = [...new Set([...queryItemsList, ...queryItems])];
        GM_setValue('queryItemsList', queryItemsLists);

    }

    /**
     * 额外的重定向判断条件。
     * @param {string} urlObj 
     * @param {HTMLAnchorElement} linkElement 
     * @returns 
     */
    function extractTargetUrl(urlObj, linkElement) {
        if (urlObj.pathname.includes('jump.php')) {
            extractFromJumpPhp(urlObj, linkElement);
            return;
        }

        for (const item of queryItemsList) {
            try {
                const target = urlObj.searchParams.get(item);

                if (target && isValidHttpUrl(decodeURIComponent(target))) {
                    updateLink(target, linkElement, item);
                    return;
                }
            } catch (e) {
                console.error('URI 解码错误:', e);
            }
        }
    }

    /**
     * 单独对jump.php的处理。
     * @param {string} urlObj 
     * @param {HTMLAnchorElement} linkElement 
     */
    function extractFromJumpPhp(urlObj, linkElement) {
        const fullUrl = urlObj.href;
        const targetUrl = fullUrl.substring(fullUrl.indexOf('jump.php?') + 9);
        updateLink(targetUrl, linkElement);
    }

    let preloadedLinks = [];

    /**
     * 对链接优化的主要函数
     * @param {string} target 
     * @param {HTMLAnchorElement} linkElement 
     * @param {string} item
     */
    function updateLink(target, linkElement, item) {
        const originalHref = linkElement.href;
        const linkName = linkElement.textContent || linkElement.innerText;
        try {
            const targetUrl = decodeURIComponent(target);
            if (isValidHttpUrl(targetUrl)) {
                linkElement.href = targetUrl;
                console.log('优化的重定向链接:', originalHref, 'to:', targetUrl);
                preloadedLinks.push({ redirectParameter: item, name: linkName, url: originalHref, optimizedUrl: targetUrl });
                GM_setValue('preloadedLinks', preloadedLinks);
            }
        } catch (e) {
            console.error('URI 解码错误:', e);
        }
    }

    function isValidHttpUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
            return false;
        }
    }

    function optimizeRedirects() {
        document.querySelectorAll('a[href]').forEach(link => {
            if (link.dataset.optimized) return;
            try {
                const urlObj = new URL(link.href);
                extractTargetUrl(urlObj, link);
                link.dataset.optimized = true;
            } catch (e) {
                console.error('错误处理链接：', link.href, '; Error:', e);
            }
        });
    }
    /**
     * 初始化重定向链接
     */
    function init() {
        if (GM_getValue('redirectOptimization')) {
            window.addEventListener('load', () => {
                optimizeRedirects();
                replaceDownloadLink();
                setInterval(replaceDownloadLink, 200); // 每0.5秒执行一次
            });
            const observer = new MutationObserver(() => {
                optimizeRedirects();
                replaceDownloadLink();
            });
            observer.observe(document.body, { childList: true, subtree: true });
            window.addEventListener('beforeunload', () => observer.disconnect());
        }
    }

    init();

    /* ----------------------------- 以下为预加载链接的具体代码实现 ---------------------------- */

    /**
     * 为链接添加视觉提醒，指示其已被预加载。
     *
     * @param {HTMLElement} element - 链接元素。
     */
    function addAVisualLinkReminder(element) {
        var href = element.href;
        try {
            var linkURL = new URL(href);
            var currentOrigin = window.location.origin;
            if (linkURL.origin === currentOrigin) {
                if (element.dataset.preloaded && GM_getValue('is_loadedStyle')) {
                    switch (GM_getValue('loadedStyle', "下划线")) {
                        case '下划线':
                            element.style.textDecoration = 'underline';
                            element.style.textDecorationSkipInk = 'none';
                            break;
                        case '高亮':
                            element.style.backgroundColor = 'yellow';
                            break;
                        case '品红':
                            element.style.color = '#FF00FF';
                            break;
                        case '加粗':
                            element.style.fontWeight = 'bold';
                            break;
                        case '边框':
                            element.style.border = '2px solid red';
                            element.style.borderRadius = '4px';
                            break;
                        default:
                            break;
                    }
                }
            }
        } catch (e) {
            console.error('Error adding visual link reminder:', e);
        }
    }

    /**
     * 添加可拖动的图标到页面上。
     */
    function addDraggableIcon() {
        var svgHTML = '<svg id="draggableIcon" style="position: fixed; top: 50%; right: -20px; transform: translateY(-50%); cursor: pointer; z-index: 9999999;" width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M3.464 20.536C4.93 22 7.286 22 12 22c4.714 0 7.071 0 8.535-1.465C22 19.072 22 16.714 22 12s0-7.071-1.465-8.536C19.072 2 16.714 2 12 2S4.929 2 3.464 3.464C2 4.93 2 7.286 2 12c0 4.714 0 7.071 1.464 8.535" opacity=".5"/><path fill="currentColor" d="M12.03 9.53a.75.75 0 0 0-1.06-1.06l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06L9.56 12z"/><path fill="currentColor" d="M16.03 9.53a.75.75 0 0 0-1.06-1.06l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06L13.56 12z"/></svg>',
            div = document.createElement('div');
        div.innerHTML = svgHTML;
        document.body.appendChild(div.firstChild);

        function onDrag(e, move) {
            var startX = ('touches' in e ? e.touches[0] : e).clientX - dragIcon.getBoundingClientRect().left,
                startY = ('touches' in e ? e.touches[0] : e).clientY - dragIcon.getBoundingClientRect().top;

            function dragging(ev) {
                var clientX = ('touches' in ev ? ev.touches[0] : ev).clientX,
                    clientY = ('touches' in ev ? ev.touches[0] : ev).clientY;
                dragIcon.style.left = clientX - startX + 'px';
                dragIcon.style.top = clientY - startY + 'px';
            }

            function endDrag() {
                document.removeEventListener(move ? 'mousemove' : 'touchmove', dragging);
                document.removeEventListener(move ? 'mouseup' : 'touchend', endDrag);
                document.body.style.overflow = '';
                dragIcon.style.transition = '';
                GM_setValue('iconPosition', { left: dragIcon.style.left, top: dragIcon.style.top });
            }
            document.addEventListener(move ? 'mousemove' : 'touchmove', dragging);
            document.addEventListener(move ? 'mouseup' : 'touchend', endDrag);
            document.body.style.overflow = 'hidden';
            dragIcon.style.transition = 'none';
            if (!move) {
                dragIcon.dataset.pressTimer = setTimeout(endDrag, 500);
            }
        }

        var dragIcon = document.getElementById('draggableIcon');
        dragIcon.style.display = 'none';
        var savedPosition = GM_getValue('iconPosition');
        savedPosition && (dragIcon.style.left = savedPosition.left, dragIcon.style.top = savedPosition.top);

        dragIcon.ontouchstart = function(e) {
            onDrag(e, false);
        };
        dragIcon.ontouchend = function() {
            clearTimeout(dragIcon.dataset.pressTimer);
        };
        dragIcon.onmousedown = function(e) {
            e.preventDefault();
            onDrag(e, true);
        };
    }

    /**
     * 将一个链接添加到预加载队列中。
     *
     * @param {string} url - 链接的地址。
     * @param {HTMLElement} element - 对应的链接元素。
     */
    function addToPreloadQueue(url, element) {
        // 增加了对集合中存在性的检查
        if (isInViewport(element) && !preloadSet.has(url)) {
            preloadSet.add(url);
            preloadQueue.push({ url: url, element: element });
        }
    }

    /**
     * 将二进制大对象（blob）转换为Base64编码的字符串。
     *
     * @param {Blob} blob - 需要转换的blob对象。
     * @returns {Promise<string>} - 包含Base64编码字符串的Promise。
     */
    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = e => reject(e);
            reader.readAsDataURL(blob);
        });
    }

    /**
     * 取消一个指定链接的预加载。
     *
     * @param {string} url - 需要取消预加载的链接URL。
     */
    function cancelPreload(url) {
        if (abortControllers[url]) {
            abortControllers[url].abort();
            delete abortControllers[url]; // 删除abortController实例的引用以防内存泄露
            console.log("Preload cancelled for link out of viewport:", url);
            currentPreloads--; // 更新计数
            preloadNext(); // 尝试开始下一个预加载
        }
        // 从预加载队列中移除链接
        preloadQueue = preloadQueue.filter(item => item.url !== url);
        preloadSet.delete(url); // 从预加载集合中移除链接
    }

    /**
     * 检查预加载的锚点链接并添加相应的视觉提醒。
     */
    function checkAndAddBulletsForPreloadedLinks() {
        var links = document.querySelectorAll('a');
        links.forEach(function(link) {
            if (link.dataset.preloaded) {
                addAVisualLinkReminder(link);
            }
        });
    }

    /**
     * 清理预加载队列，移出不符合条件的链接。
     */
    function cleanPreloadQueue() {
        // 清理已经预加载或者不在视口内的链接
        preloadQueue = preloadQueue.filter(item => {
            if (!(isInViewport(document.querySelector(`a[href="${item.url}"]`)) && !document.querySelector(`a[href="${item.url}"]`).dataset.preloaded)) {
                preloadSet.delete(item.url); // 如果不满足条件，则从集合中删除
                return false;
            }
            return true;
        });
    }

    /**
     * 清理已经超时或已经中止的AbortController实例。
     */
    function cleanAbortControllers() {
        // 获取当前时间
        var now = Date.now();

        // 遍历abortControllers对象的属性
        for (var url in abortControllers) {
            // 如果请求已经很久没有响应，那么我们认为它可能已经失效，需要删除控制器
            // 或如果请求已经被中止，亦应删除
            var controller = abortControllers[url];
            if ((controller.timestamp && now - controller.timestamp > 30000) || controller.signal.aborted) { // 30秒或已中止
                delete abortControllers[url];
            }
        }
    }

    /**
     * 防抖函数，用于延迟执行并防止函数在短时间内多次触发。
     *
     * @param {Function} func - 需要防抖的函数。
     * @param {number} wait - 延迟执行的时间，单位为毫秒。
     * @param {boolean} immediate - 是否立即执行。
     * @returns 防抖处理后的函数。
     */
    function debounce(func, wait, immediate) {
        var timeout, called = false;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate && !called) func.apply(context, args);
                called = false; // 重置调用标志
            };
            var callNow = immediate && !timeout;
            if (callNow) {
                func.apply(context, args);
                called = true; // 立即执行时，设置调用标志
            }
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * 从IndexedDB数据库中删除旧内容。
     */
    function deleteOldContentFromDB() {
        const now = Date.now();
        const transaction = db.transaction([dbStoreName], 'readwrite');
        const store = transaction.objectStore(dbStoreName);

        var contentRequest = store.getAll();

        contentRequest.onsuccess = function() {
            var contents = contentRequest.result;
            // 如有必要，根据最后访问时间进行排序
            contents.sort((a, b) => b.timestamp - a.timestamp);

            // 判断记录是否超出最大存储量或者是否过期，然后执行删除
            contents.forEach((content, index) => {
                if (now - content.timestamp > dataCleanupInterval || index >= maxStorageItems) { // 检查每一项是否过期或超出容量限制
                    store.delete(content.url);
                }
            });
        };

        contentRequest.onerror = function(event) {
            console.error("Error fetching contents from IndexedDB", event.target.error);
        };
    }

    /**
     * 显示预加载的内容。
     *
     * @param {string} base64Content - 预加载内容的Base64编码。
     * @param {string} url - 内容对应的链接地址。
     */
    function displayPreloadedContent(base64Content, url) {
        if (base64Content.startsWith('data:')) {
            var binary = atob(base64Content.split(',')[1]);
            var array = new Uint8Array(binary.length);
            for (var i = 0; i < binary.length; i++) {
                array[i] = binary.charCodeAt(i);
            }
            var documentEncoding = document.characterSet || 'UTF-8';
            var blobContent = new Blob([array], { type: `text/html;charset=${documentEncoding}` });

            var reader = new FileReader();
            reader.onload = function() {
                var existingFullPageDiv = document.getElementById('fullPageDiv');
                if (existingFullPageDiv) {
                    existingFullPageDiv.parentNode.removeChild(existingFullPageDiv);
                    existingFullPageDiv.remove();
                }

                var fullPageDiv = document.createElement('div');
                fullPageDiv.id = 'fullPageDiv';
                fullPageDiv.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    z-index: 1000;
                    background: white;
                `;
                fullPageDiv.innerHTML = reader.result;
                toggleDragIconVisibility(true);
                document.body.style.overflow = 'hidden';
                document.body.appendChild(fullPageDiv);
                if (GM_getValue('asynchronousResources')) {
                    var iframe = document.createElement('iframe');
                    iframe.style.cssText = ' top: 0; left: 0; width: 100%; height: 100%; display: block; visibility: hidden;';
                    iframe.src = url;
                    document.body.appendChild(iframe);

                    fullPageDiv.onscroll = function() {
                        if (iframe.contentWindow) {
                            iframe.contentWindow.scrollTo(0, fullPageDiv.scrollY);
                            iframe.contentWindow.scrollTo(0, fullPageDiv.scrollTop);
                        }
                    };

                    iframe.onload = function() {
                        iframe.contentWindow.onscroll = function() {
                            var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                            fullPageDiv.innerHTML = iframeDocument.documentElement.outerHTML; // 更新内容
                        };
                    }
                }
            };
            reader.readAsText(blobContent, documentEncoding);
        }
    }


    /**
     * 初始化IndexedDB数据库。
     *
     * @param {Function} success - 数据库就绪后执行的回调函数。
     */
    function initDB(success) {
        if (!dbReady) {
            openDB(success);
        } else if (typeof success === 'function') {
            success();
        }
    }

    /**
     * 判断一个元素是否在视口内。
     *
     * @param {HTMLElement} element - 需要判断的HTML元素。
     * @returns {boolean} - 元素是否在视口内。
     */
    function isInViewport(element) {
        var rect = element.getBoundingClientRect();
        var inViewport = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );

        if (!inViewport && element.dataset.preloaded) {
            cancelPreload(element.href); // 如果链接不在视窗中并且已被标记为预加载，取消它的预加载
            element.dataset.preloaded = false; // 移除预加载标记
        }

        return inViewport;
    }

    /**
     * 判断当前设备是否为移动设备。
     *
     * @returns {boolean} - 是否为移动设备。
     */
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * 使用MutationObserver监听DOM变化。
     */
    function observeDOMChanges() {
        var handledLinks = new Set(); // 用于储存处理过的链接

        var config = { childList: true, subtree: true };
        var callback = function(mutationsList, observer) {
            requestAnimationFrame(function() {
                mutationsList.forEach(debounce(function(mutation) {
                    if (mutation.type == 'childList' && mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1 && node.matches('a[href]')) {
                                var href = node.getAttribute('href');
                                if (!preloadSet.has(href) && !handledLinks.has(href)) {
                                    preloadLink(href, node);
                                    handledLinks.add(href); // 将链接添加到 handledLinks 中进行标记
                                    preloadSet.add(href); // 将链接添加到 preloadSet 中
                                }
                            }
                        });
                    }
                }, 250));
                preloadVisibleLinks();
            });
        };

        var observer = new MutationObserver(callback);
        observer.observe(document.body, config);
    }

    /**
     * 打开IndexedDB数据库。
     *
     * @param {Function} callback - 数据库打开成功的回调函数。
     */
    function openDB(callback) {
        if (dbInitializationPromise) { // 如果存在初始化的Promise，直接返回它并添加回调
            dbInitializationPromise.then(callback).catch(err => console.error('IndexedDB init error:', err));
            return;
        }

        // 新建一个Promise来处理初始化过程
        dbInitializationPromise = new Promise((resolve, reject) => {
            var request = indexedDB.open(dbName, dbVersion);

            request.onupgradeneeded = function(event) {
                var db = event.target.result;
                if (!db.objectStoreNames.contains(dbStoreName)) {
                    db.createObjectStore(dbStoreName, { keyPath: 'url' });
                }
            };

            request.onsuccess = function(event) {
                db = event.target.result;
                dbReady = true;
                console.log('IndexedDB database opened successfully');
                db.onerror = function(event) {
                    console.error("Database error: " + event.target.error.message);
                };
                resolve(db);
            };

            request.onerror = function(event) {
                console.error('IndexedDB database open error:', event.target.errorCode);
                dbInitializationPromise = null; // 如果Promise失败，我们重置这个变量
                reject(event.target.error);
            };
        });

        // 调用传入的回调函数
        dbInitializationPromise.then(callback).catch(err => console.error('IndexedDB init error:', err));
    }

    /**
     * 将一个链接的属性值视为适当。
     *
     * @param {string} url - 链接的URL地址。
     * @returns {string} - 适当的属性值。
     */
    function appropriateAsAttributeValue(url) {
        if (url.endsWith('.css')) {
            return 'style';
        } else if (url.endsWith('.js')) {
            return 'script';
        } else if (url.match(/(.jpg|.jpeg|.png|.gif)$/)) {
            return 'image';
        } else if (url.endsWith('.json')) {
            return 'fetch';
        } else {
            return 'fetch';
        }
    }

    /**
     * 预加载指定的链接。
     *
     * @param {string} url - 需要预加载的链接URL。
     * @param {HTMLElement} element - 对应的链接元素。
     */
    function preloadLink(url, element) {
        try {
            var linkURL = new URL(url);

            if (linkURL.protocol !== 'http:' && linkURL.protocol !== 'https:') {
                console.log('Not preloading: Non-HTTP link:', url);
                return;
            }
            if (isBlacklistModeEnabled && blacklistDomains.includes(linkURL.hostname)) {
                console.log('Not preloading: Blacklisted domain:', linkURL.hostname);
                return;
            }
            // 跳过与当前页面相同或者跨域的URL
            if (linkURL.hostname !== window.location.hostname || linkURL.href === window.location.href) {
                console.warn('Not preloading: Same page or cross-origin link:', url);
                return;
            }
            if (preloadSet.has(url) || element.dataset.preloaded) {
                console.log('Not preloading: Already preloaded or enqueued for preload:', url);
                return;
            }

            if (currentPreloads < maxConcurrentPreloads) {
                currentPreloads++;
                let options = {
                    cache: "force-cache", // 使用force-cache可以帮助减少不必要的网络请求
                    as: appropriateAsAttributeValue(url), // 根据不同的链接类型，为 'as' 属性设置适当的值
                    credentials: "include",
                    headers: new Headers(window.headers)
                };

                if (element.rel && (element.rel.includes('noreferrer') || element.rel.includes('noopener'))) {
                    options.referrerPolicy = 'no-referrer';
                }

                // 创建一个新的abortController实例，并将signal传给fetch
                var controller = new AbortController();
                controller.timestamp = Date.now();
                var signal = controller.signal;
                options.signal = signal; // 将signal添加到fetch选项中
                abortControllers[url] = controller;

                fetch(linkURL.href, options).then(function(response) {
                    if (!response.ok) {
                        throw new Error('HTTP error, status = ' + response.status);
                    }
                    return response.blob();
                }).then(function(blob) {
                    saveContentToDB(url, blob);
                    addAVisualLinkReminder(element);
                }).catch(function(error) {
                    console.error('Preload failed for ', url, ':', error.message);
                }).finally(function() {
                    currentPreloads--;
                    preloadNext();
                    delete abortControllers[url];
                });
            } else {
                addToPreloadQueue(url, element);
                return;
            }
        } catch (e) {
            console.error('Error preloading link:', e.message);
        }
    }

    /**
     * 继续预加载队列中的下一个链接。
     */
    function preloadNext() {
        if (preloadQueue.length > 0 && currentPreloads < maxConcurrentPreloads) {
            var nextPreload = preloadQueue.shift();
            preloadLink(nextPreload.url, nextPreload.element);
            delete abortControllers[nextPreload.url];
        }
    }

    /**
     * 预加载所有可见的链接。
     */
    function preloadVisibleLinks() {
        if (!isMobileDevice()) {
            return;
        }
        var links = document.querySelectorAll('a');

        var visibleLinks = Array.from(links).filter(function(link) {
            var href = link.href;
            return isInViewport(link) && !link.dataset.preloaded && (shouldPreloadMapping[href] !== false);
        });

        visibleLinks.sort(function(a, b) {
            var aRect = a.getBoundingClientRect();
            var bRect = b.getBoundingClientRect();
            return (window.innerHeight - aRect.bottom) - (window.innerHeight - bRect.bottom);
        });

        var preloadLimit = Math.min(visibleLinks.length, maxConcurrentPreloads - currentPreloads);

        for (var i = 0; i < preloadLimit; i++) {
            (function(linkElement) {
                var href = linkElement.href;
                if (shouldPreloadMapping[href] === undefined) {
                    // 如果该链接的预加载状态尚未决定，则发起检查
                    shouldPreload(linkElement.href).then(function(should) {
                        shouldPreloadMapping[href] = should;
                        if (should && isInViewport(linkElement)) {
                            preloadLink(linkElement.href, linkElement);
                            linkElement.dataset.preloaded = true;
                        }
                    });
                } else if (shouldPreloadMapping[href]) {
                    // 如果已经确定需要预加载，则直接预加载，无需重复检查
                    preloadLink(linkElement.href, linkElement);
                    linkElement.dataset.preloaded = true;
                }
            })(visibleLinks[i]);
        }
    }

    /**
     * 处理数据库写入队列。
     */
    function processDBWriteQueue() {
        if (dbWriteInProgress || dbWriteQueue.length === 0) {
            return;
        }

        dbWriteInProgress = true;
        var item = dbWriteQueue.shift();

        blobToBase64(item.blob).then(base64data => {
            var transaction = db.transaction([dbStoreName], 'readwrite');
            var objectStore = transaction.objectStore(dbStoreName);

            // 处理事务完成
            return new Promise((resolve, reject) => {
                var request = objectStore.put({ url: item.url, htmlContent: base64data, timestamp: Date.now() });
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }).then(() => {
            console.log('Page content saved to IndexedDB for', item.url);
            dbWriteInProgress = false;
            processDBWriteQueue(); // 递归处理队列中的下一项
        }).catch(error => {
            console.error('IndexedDB save operation failed for', item.url, error);
            dbWriteQueue.unshift(item); // 发生错误时重新将项目放入队列
            dbWriteInProgress = false;
            setTimeout(processDBWriteQueue, 1000); // 延迟重试
        });
    }

    /**
     * 从数据库中读取内容。
     *
     * @param {string} url - 内容的URL。
     * @param {Function} callback - 读取到内容后的回调函数。
     */
    function readContentFromDB(url, callback) {
        var transaction = db.transaction([dbStoreName], 'readonly');
        var objectStore = transaction.objectStore(dbStoreName);
        var request = objectStore.get(url);

        request.onsuccess = function(event) {
            callback(event.target.result);
        };

        request.onerror = function(event) {
            console.error('IndexedDB read failed for', url);
            callback(null);
        };
    }

    /**
     * 将内容保存到IndexedDB数据库中。
     *
     * @param {string} url - 内容的URL。
     * @param {Blob} blob - 包含要保存内容的Blob对象。
     */
    function saveContentToDB(url, blob) {
        if (!dbReady) {
            console.error('IndexedDB is not ready for writing data.');
            return;
        }

        if (blob.size > maxContentSize) {
            console.log('Content size exceeds the maxContentSize limit. Not saving to IndexedDB');
            return;
        }

        dbWriteQueue.push({ url, blob });

        if (!dbWriteInProgress) {
            processDBWriteQueue();
        }
    }


    /**
     * 安排下一次数据库内容清理。
     */
    function scheduleNextCleanup() {
        // 删除旧内容后，再次调用此函数以依据当前间隔设定继续调度
        setTimeout(function() {
            deleteOldContentFromDB();
            scheduleNextCleanup();
        }, dataCleanupInterval);
    }

    /**
     * 设置鼠标悬停预加载行为。
     */
    function setupMouseHoverPreload() {
        document.addEventListener('mouseover', function(event) {
            var target = event.target.closest('a');
            if (target && !target.dataset.preloaded) {

                // 判断链接是否指向图片，如果是，就不进行预加载处理
                var href = target.getAttribute('href');

                // 更新正则表达式来匹配 Greasy Fork 的特定图片链接模式
                if (href.match(/\.(jpeg|jpg|gif|png|webp)$/i) ||
                    href.includes("active_storage/blobs/redirect")) {
                    console.log('Skip preloading for image link', href);
                    return; // 如果链接指向图片，直接返回，不设置预加载
                }

                // 鼠标悬停65毫秒以上就启动预加载
                target.dataset.hoverTimeout = setTimeout(function() {
                    shouldPreload(target.href).then(function(shouldPreloadResult) {
                        if (shouldPreloadResult && !target.dataset.preloaded) {
                            preloadLink(target.href, target);
                            target.dataset.preloaded = true; // 设置链接已预加载
                            addAVisualLinkReminder(target); // 添加小圆球指示器
                        }
                    });
                }, 65);
            }
        });

        document.addEventListener('mouseout', function(event) {
            var target = event.target.closest('a');
            if (target && target.dataset.hoverTimeout) {
                // 当鼠标移开时清除定时器
                clearTimeout(target.dataset.hoverTimeout);
                target.dataset.hoverTimeout = null;
            }
        });
    }

    /**
     * 判断一个链接是否应该被预加载。
     *
     * @param {string} url - 需要判断的链接URL。
     * @returns {Promise<boolean>} - 是否应该预加载该链接。
     */
    function shouldPreload(url) {
        if (!(url instanceof URL)) {
            var linkURL = new URL(url);
        }

        if (signoutLinks.some(link => linkURL.pathname.includes(link))) {
            console.log('Not preloading: Signout link:', url);
            return Promise.resolve(false);
        }

        var domain = new URL(url).hostname;

        if (isWhitelistModeEnabled && !whitelistDomains.includes(domain)) {
            return Promise.resolve(false);
        }

        if (isBlacklistModeEnabled && blacklistDomains.includes(domain)) {
            return Promise.resolve(false);
        }
        return fetch(url, { method: 'GET', mode: 'no-cors' })
            .then(function(response) {
                return response.text();
            })
            .then(function(html) {
                // 检查页面是否包含跳转脚本
                var redirectRegex = /window\.location\.href\s*=\s*['"]([^'"]+)['"]/;
                var match = redirectRegex.exec(html);
                if (match && match[1]) {
                    // 页面有跳转，打印消息并返回 false
                    console.log('The page has a redirect script. Skipping preload for:', url);
                    return false;
                }
                // 页面没有跳转，返回 true
                return true;
            })
            .catch(function(error) {
                console.error('Error fetching page for preload check:', error);
                return false;
            });
    }

    /**
     * 切换可拖动图标的显示状态。
     *
     * @param {boolean} show - 是否显示图标。
     */
    function toggleDragIconVisibility(show) {
        var dragIcon = document.getElementById('draggableIcon');
        if (dragIcon) {
            dragIcon.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * 开始预加载链接。
     */
    function startLinkPreloading() {
        initDB(preloadVisibleLinks);
    }

    /**
     * 处理回退导航。
     */
    function handleBackNavigation() {
        if (currentPreviewIndex > 0) {
            currentPreviewIndex -= 1;
            var prevURL = clickedLinks[currentPreviewIndex];

            readContentFromDB(prevURL, function(data) {
                if (data) {
                    displayPreloadedContent(data.htmlContent, prevURL);
                } else {
                    location.href = prevURL;
                }
            });
        } else {
            var fullPageDiv = document.getElementById('fullPageDiv');

            if (fullPageDiv) {
                fullPageDiv.remove();
                toggleDragIconVisibility(false);
                document.body.style.overflow = '';
            }

            clickedLinks = [];
            currentPreviewIndex = -1;
        }
    }

    /**
     * 处理前进导航。
     */
    function handleForwardNavigation() {
        if (currentPreviewIndex < clickedLinks.length - 1) {
            currentPreviewIndex += 1;
            var nextURL = clickedLinks[currentPreviewIndex];

            readContentFromDB(nextURL, function(data) {
                if (data) {
                    displayPreloadedContent(data.htmlContent, nextURL);
                } else {
                    location.href = nextURL;
                }
            });
        }
    }

    /**
     * 导航到URL。
     */
    function navigateToURL() {
        if (clickedLinks.length > 0 && currentPreviewIndex >= 0) {
            var currentURL = clickedLinks[currentPreviewIndex];
            window.location.href = currentURL;
        }
    }

    /*-------------以下为设置面板的具体代码初始化代码-------------*/

    initializeDefaultSettings();
    checkForUpdates();
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var dbVersion = 1;
    var dbName = 'preloadedPagesDB';
    var dbStoreName = 'preloadedPages';

    var maxConcurrentPreloads = GM_getValue('concurrentLoadingNumber', 5);
    var dataCleanupInterval = GM_getValue('dataCleanupInterval', 1) * 3600000;
    var maxContentSize = GM_getValue('maxContentSize', 5) * 1024 * 1024;
    var maxStorageItems = GM_getValue('maxStorageItems', 100);
    var isWhitelistModeEnabled = GM_getValue('whiteSelector', false);
    var isBlacklistModeEnabled = GM_getValue('blackSelector', true);
    var defaultBlacklistDomains = [
        'www.bilibili.com',
        'www.bing.com',
        'www.huya.com',
        'www.vimeo.com',
        'www.tiktok.com',
        'www.twitch.tv',
        'www.youtube.com',
        'www.dailymotion.com',
        'www.liveleak.com',
        'www.metacafe.com',
        'www.youku.com',
        'www.iqiyi.com',
        'www.netflix.com',
        'www.hulu.com',
        'www.primevideo.com'
    ];
    const signoutLinks = [
        '/sign_out', // 一般的 sign out 链接
        '/logout', // 常见的登出链接
        '/signoff', // 另一个常见的退出链接
        '/signout', // 没有下划线的 signout 链接
        '/logoff', // log off 形式的退出链接
        '/exit', // exit 链接
        '/user/logout', // 用户目录下的 logout 链接
        '/account/signout', // 帐户目录下的 signout 链接
        '/users/sign_out', // 复数形式 users 的 sign out 链接
        '/session/logout', // session 目录下的 logout 链接
        '/auth/logout', // 认证目录下的 logout 链接
        '/disconnect', // disconnect 形式的退出链接
        '/member/signout', // 会员目录下的 signout 链接
        '/user/sign_out', // 单个用户的 sign out 链接
        '/users/logout', // 复数形式 users 的 logout 链接
        '/sessions/signout', // sessions 目录下的 signout 链接
        '/api/logout', // API 目录下的 logout 链接
        '/app/logout', // APP 目录下的 logout 链接
        '/dashboard/logout', // 仪表盘目录下的 logout 链接
        '/home/logout', // 主页目录下的 logout 链接
        '/profile/logout', // 个人资料目录下的 logout 链接
        '/log_out', // 带下划线的 log out 链接
        '/signoff_user', // 带下划线的 sign off user 链接
    ];

    if (typeof GM_getValue === 'function') {
        var storedBlacklistDomains = GM_getValue('blacklistDomains', []);
        var blacklistDomains = [...new Set([...storedBlacklistDomains, ...defaultBlacklistDomains])]; //将检索到的黑名单与默认黑名单合并，确保没有重复项
        GM_setValue('blacklistDomains', blacklistDomains);

        var whitelistDomains = GM_getValue('whitelistDomains', []);
    }

    function updateDomainLists() {
        blacklistDomains = GM_getValue('blacklistDomains', []);
        whitelistDomains = GM_getValue('whitelistDomains', []);
    }

    var currentPreloads = 0;
    var preloadQueue = [];
    var preloadSet = new Set();
    var abortControllers = {};
    var db;
    var dbReady = false;
    var clickedLinks = [];
    var currentPreviewIndex = -1;
    var dbWriteQueue = [];
    var dbWriteInProgress = false;
    var shouldPreloadMapping = {};
    let touchStartX = 0;
    let touchStartY = 0;
    let iconVisible = false;
    const svgBack = '<svg id="sliderBIcon" style="position: fixed; top: 50%; left: 100%; transform: translateY(-50%); cursor: pointer; z-index: 9999999;" width="100" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.53 7.53a.75.75 0 0 0-1.06-1.06l-5 5a.75.75 0 0 0 0 1.06l5 5a.75.75 0 1 0 1.06-1.06L10.06 12l4.47-4.47Z"/><path fill-rule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75 22.75 17.937 22.75 12 17.937 1.25 12 1.25ZM2.75 12a9.25 9.25 0 1 1 18.5 0 9.25 9.25 0 0 1-18.5 0Z"/></svg>';
    const svgForward = '<svg id="sliderFIcon" style="position: fixed; top: 50%; right: 100%; transform: translateY(-50%); cursor: pointer; z-index: 9999999;" width="100" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.53 6.47a.75.75 0 1 0-1.06 1.06L13.94 12l-4.47 4.47a.75.75 0 1 0 1.06 1.06l5-5a.75.75 0 0 0 0-1.06l-5-5Z"/><path fill-rule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75 22.75 17.937 22.75 12 17.937 1.25 12 1.25ZM2.75 12a9.25 9.25 0 1 1 18.5 0 9.25 9.25 0 0 1-18.5 0Z"/></svg>';
    const divBack = document.createElement('div');
    const divForward = document.createElement('div');
    divBack.innerHTML = svgBack;
    divForward.innerHTML = svgForward;
    document.body.appendChild(divBack);
    document.body.appendChild(divForward);
    var dbInitializationPromise = null;

    let currentActivePanelId = 'panel1';
    let isAnimating = false;
    let loadingPanel = createElementWithStylesAndAttributes('div', { position: "fixed", width: "305px", height: "auto", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: "1001", backgroundColor: "#E0E5EC", borderRadius: "15px", boxShadow: "2px 2px 8px #BECBD8, -2px -2px 8px #FFFFFF", display: "none", flexDirection: "column" }, { className: 'loadingPanel customFontStyle' });
    let showcaseFeaturesPanel = createElementWithStylesAndAttributes('div', { position: "relative", width: "275px", height: "300px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", margin: "10px auto", overflowY: "hidden", overflowX: "hidden", flexWrap: "wrap", background: "#E0E5EC", boxShadow: "inset 9px 9px 16px #BABEC6, inset -9px -9px 16px #FFFFFF" }, { className: "showcaseFeaturesPanel" });
    const versionInfoElement = createVersionInfoElement();
    let font_style = `.customFontStyle *:not([class*='icon']):not(.fa):not(.fas):not(i) { font-family: 'PingFang SC', 'Heiti SC', 'myfont', 'Microsoft YaHei', 'Source Han Sans SC', 'Noto Sans CJK SC', 'HanHei SC', 'sans-serif' ,'icomoon','Icons' ,'brand-icons' ,'FontAwesome','Material Icons','Material Icons Extended','Glyphicons Halflings' !important; text-shadow: 1px 1px 10px #c3c3c3 !important; font-weight: bold !important; }`;
    const parameterFunction = [
        "并发加载数,numberPicker,concurrentLoadingNumber,information,⑴设计原则: 限制同时加载的页面数量，防止某些网页限制了并发数网站限制如：吾爱破解论坛。\n⑵功能: 应对网页限制策略",
        "最大内存项,numberPicker,maxContentSize,information,单位：（MB）\n⑴设计原则: 防止单个预加载页面占用过多内存资源，避免浏览器崩溃或响应缓慢。\n⑵功能: 允许用户设定每个页面预加载内容的内存使用上限，优化资源管理。",
        "最大储存项,numberPicker,maxStorageItems,information,⑴设计原则: 限制缓存预加载内容的数量，以防数据库溢出或过度占用存储空间。\n⑵功能: 用户可自定义预加载内容储存数量上限，以维护存储空间的有效利用。",
        "加载完样式,selector,loadedStyle,information,开关关闭则无提示样式\n⑴设计原则: 增强用户界面友好性，通过视觉反馈让用户明确知晓哪些内容已经被预加载。\n⑵功能: 提供多种可选样式（如下划线、高亮等），用户可以根据个人偏好设置预加载成功后元素的显示方式。,styleSelector,is_loadedStyle",
        "黑名单列表,inputBox,blacklistDomains,information,⑴设计原则: 考虑到不同网页对动态内容加载的特殊要求，通过设定黑名单避免兼容性问题。\n⑵功能: 用户可以指定脚本不适用的网页域名，防止在这些网页上执行可能导致冲突的操作。,styleSelector,blackSelector",
        "白名单列表,inputBox,whitelistDomains,information,⑴设计原则: 为了专注资源和优化特定网站的加载速度，通过白名单机制确保仅在指定域名上启用功能。\n⑵功能: 用户可设定脚本只在特定的网站或页面上运行，从而提高脚本的运行效率和兼容性。,styleSelector,whiteSelector",
    ];

    const additionalFeaturesFunction = [
        "清理间隔项,numberPicker,dataCleanupInterval,information,单位：（小时）\n⑴设计原则: 通过定期清理过期或不常用的缓存数据，减少对存储资源的占用率，防止存储溢出和数据膨胀。⑵功能: 网页长时间不用则自动清理内存缓存，节省存储空间。",
        "异步の资源,switch,asynchronousResources,information,建议电脑开启\n⑴设计原则: 对于异步加载的资源进行实时更新，比如：动态加载的图片等。\n⑵功能: 在本模式下，可以加载出一些异步资源，如果你关闭，那么久不会异步加载资源，但是加载会更流畅。",
        "图片懒加载,switch,lazyLoadImages,information,未完善状态,由于效果并不是特别明显，暂且搁置\n⑴设计原则: 一种提高网页加载速度的技术，通过延迟加载图片，只加载当前可见区域的图片，提高页面加载速度。\n⑵功能: 当用户滚动页面时，提前加载屏幕外一个屏幕距离的图片，提升页面整体加载速度。",
        "重定向优化,switch,redirectOptimization,information,⑴设计原则: 无疑重定向链接是重要的，但它有很多问题如：SEO影响、性能影响、重定循环（恶意钓鱼）等。\n⑵基于此，本选项提供删除重定向的功能，默认的重定向参数已经涵盖95%的重定向链接，你可以快捷方便地自己添加参数,settingButton",
        "监控器刷新,numberPicker,monitorRefresh,information,单位：（秒）\n下方性能监控器点击可切换监控内容\n⑴设计原则: 决定下方的网页性能监控的刷新间隔，保证性能\n⑵功能: 设定刷新监控的间隔时间"
    ];

    const shortcutKeysFunction = [
        "跳转对应页,shortcutKeySetting,goToTheCorrespondingPage",
        "返回上一页,shortcutKeySetting,backToThePreviousPage",
        "设置快捷键,shortcutKeySetting,setShortcuts",
        "前进快捷键,shortcutKeySetting,forward",
        "手势指示器,switch,mobileGestures,information,⑴移动端手势:本插件提供便捷操作方式，如左向右滑动后退，右向左滑动前进。且会显示一个指示器，关闭此选项后，手势操作仍然有效，但不再显示指示器占用屏幕空间",
        "启用操作球,switch,manipulatorBall,information,操作球显示在屏幕右方且仅在预加载页面显示。\n⑴手机用户默认开启手势\n⑵电脑用户默认启用操作球"
    ];

    const optionsArray = ['下划线', '无样式', '高亮', '品红', '加粗', '边框'];
    const title = createElementWithStylesAndAttributes('h1', { color: "#4B5563", textAlign: "center", marginBottom: "10px", marginTop: "10px", fontSize: "24px", fontWeight: "bold", textShadow: "2px 2px 3px rgba(0, 0, 0, 0.2)", userSelect: "none" }, { className: 'title', innerText: '网页瞬间加载' });
    const closeSetting = createElementWithStylesAndAttributes('span', { cursor: 'pointer', marginLeft: '30px', width: '11px', height: '11px', display: 'inline-block', verticalAlign: 'middle' }, { innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="currentColor" viewBox="0 0 334 334"><path d="M 320 48 Q 334 31 320 14 Q 303 0 286 14 L 167 133 L 48 14 Q 31 0 14 14 Q 0 31 14 48 L 133 167 L 14 286 Q 0 303 14 320 Q 31 334 48 320 L 167 201 L 286 320 Q 303 334 320 320 Q 334 303 320 286 L 201 167 L 320 48 L 320 48 Z" /></svg>` });
    const settingsParameters = createElementWithStylesAndAttributes('div', { color: "#4B5563", textAlign: "center", marginBottom: "10px", fontSize: "24px", textShadow: "1px 1px #888888", fontWeight: "bold", cursor: "pointer", userSelect: "none" }, { className: 'settingsParameters', innerText: '参数' });
    const additionalFeatures = createElementWithStylesAndAttributes('div', { color: "#4B5563", textAlign: "center", marginBottom: "10px", fontSize: "20px", fontWeight: "bold", cursor: "pointer", userSelect: "none" }, { className: 'additionalFeatures', innerText: '高级' });
    const shortcutKeys = createElementWithStylesAndAttributes('div', { color: "#4B5563", textAlign: "center", marginBottom: "10px", fontSize: "20px", fontWeight: "bold", cursor: "pointer", userSelect: "none" }, { className: 'shortcutKeys', innerText: '操作' });
    const selectTheContainer = createElementWithStylesAndAttributes('div', { display: "flex", justifyContent: "space-around" }, {});
    const showcaseFeaturesPanel1 = createShowcaseFeaturesPanel('panel1', 0);
    const showcaseFeaturesPanel2 = createShowcaseFeaturesPanel('panel2', 280);
    const showcaseFeaturesPanel3 = createShowcaseFeaturesPanel('panel3', 560);

    createFeatureListItems(parameterFunction).forEach(featureElement => {
        showcaseFeaturesPanel1.appendChild(featureElement);
    });
    createFeatureListItems(additionalFeaturesFunction).forEach(featureElement => {
        showcaseFeaturesPanel2.appendChild(featureElement);
    });
    createFeatureListItems(shortcutKeysFunction).forEach(featureElement => {
        showcaseFeaturesPanel3.appendChild(featureElement);
    });

    settingsParameters.addEventListener('click', () => setActivePanel('panel1'));
    additionalFeatures.addEventListener('click', () => setActivePanel('panel2'));
    shortcutKeys.addEventListener('click', () => setActivePanel('panel3'));
    closeSetting.addEventListener('click', () => { loadingPanel.style.display = 'none'; });

    addStyle('custom-font-style', font_style);

    var stats = new Stats();
    stats.dom.style.cssText = 'position: absolute; display: block; bottom: 10px; left: 10px; ';
    showcaseFeaturesPanel2.appendChild(stats.dom);
    stats.showPanel(0);


    settingsParameters.addEventListener('click', () => setActivePanel('panel1'));
    additionalFeatures.addEventListener('click', () => setActivePanel('panel2'));
    shortcutKeys.addEventListener('click', () => setActivePanel('panel3'));
    loadingPanel.appendChild(title);
    title.appendChild(closeSetting);
    selectTheContainer.appendChild(settingsParameters);
    selectTheContainer.appendChild(additionalFeatures);
    selectTheContainer.appendChild(shortcutKeys);
    loadingPanel.appendChild(selectTheContainer);
    loadingPanel.appendChild(showcaseFeaturesPanel);
    loadingPanel.appendChild(versionInfoElement);
    showcaseFeaturesPanel.appendChild(showcaseFeaturesPanel1);
    showcaseFeaturesPanel.appendChild(showcaseFeaturesPanel2);
    showcaseFeaturesPanel.appendChild(showcaseFeaturesPanel3);
    document.body.appendChild(loadingPanel);


    GM_registerMenuCommand('显示/隐藏 参数与功能设置菜单', function() {
        loadingPanel.style.display = loadingPanel.style.display === 'none' ? 'block' : 'none';
    });
    animate();


    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });

    if (GM_getValue('mobileGestures', true)) {
        document.addEventListener('touchmove', function(e) {
            let touchMoveX = e.changedTouches[0].screenX;
            let touchMoveY = e.changedTouches[0].screenY;
            let moveRightDistance = touchMoveX - touchStartX;
            let moveLeftDistance = touchStartX - touchMoveX;
            let moveYDistance = Math.abs(touchMoveY - touchStartY);
            if (moveYDistance > 100) {
                iconVisible = false;
                divForward.firstChild.style.right = '100%';
                divBack.firstChild.style.left = '100%';
                return;
            }
            if (moveRightDistance > 50 && !iconVisible) {
                iconVisible = true;
                divBack.firstChild.style.left = '-20px';
            } else if (moveRightDistance <= 50 && iconVisible) {
                iconVisible = false;
                divBack.firstChild.style.left = '100%';
            }
            if (iconVisible && moveRightDistance <= 100) {
                divBack.firstChild.style.left = `${0.8 * (moveRightDistance - 50)}px`;
            } else if (moveRightDistance > 100) {
                divBack.firstChild.style.left = '-20px';
            }

            if (moveLeftDistance > 50 && !iconVisible) {
                iconVisible = true;
                divForward.firstChild.style.right = '-20px';
            } else if (moveLeftDistance <= 50 && iconVisible) {
                iconVisible = false;
                divForward.firstChild.style.right = '100%';
            }
            if (iconVisible && moveLeftDistance <= 100) {
                divForward.firstChild.style.right = `${0.8 * (moveLeftDistance - 50)}px`;
            } else if (moveLeftDistance > 100) {
                divForward.firstChild.style.right = '-20px';
            }
        });
    }

    document.addEventListener('touchend', function(e) {
        let touchEndX = e.changedTouches[0].screenX;
        let touchEndY = e.changedTouches[0].screenY;
        let touchDistance = touchEndX - touchStartX;
        let touchYDistance = Math.abs(touchEndY - touchStartY);

        if (touchYDistance > 100) {
            return;
        }
        if (touchDistance > 150) {
            handleBackNavigation();
        }
        if (touchDistance < -150) {
            handleForwardNavigation();
        }

        iconVisible = false;
        divBack.firstChild.style.left = '100%';
        divForward.firstChild.style.right = '100%';
    });

    document.addEventListener('keydown', function(e) {
        var returnShortcutKeyString = GM_getValue('backToThePreviousPage', 'shift+r').toLowerCase();
        var returnShortcutKeys = returnShortcutKeyString.split('+').map(key => key.toLowerCase());

        var directShortcutKeyString = GM_getValue('goToTheCorrespondingPage', 'shift+e').toLowerCase();
        var directShortcutKeys = directShortcutKeyString.split('+').map(key => key.toLowerCase());

        var forwardShortcutKey = GM_getValue('forward', 'shift+f').toLowerCase();
        var forwardShortcutKeys = forwardShortcutKey.split('+').map(key => key.toLowerCase());
        var loadingShortcutKey = GM_getValue('setShortcuts', 'shift+s').toLowerCase();
        var loadingShortcutKeys = loadingShortcutKey.split('+').map(key => key.toLowerCase());
        var keyPressed = {
            'alt': e.altKey,
            'shift': e.shiftKey,
            'control': e.ctrlKey,
            'meta': e.metaKey // 对于 Mac 的 Command 键
        };
        keyPressed[e.key.toLowerCase()] = true;

        var returnKeysPressed = returnShortcutKeys.every(key => keyPressed[key]);
        var directKeysPressed = directShortcutKeys.every(key => keyPressed[key]);
        var forwardKeysPressed = forwardShortcutKeys.every(key => keyPressed[key]);
        var loadingKeysPressed = loadingShortcutKeys.every(key => keyPressed[key]);
        if (returnKeysPressed) {
            handleBackNavigation(); // 对应的操作函数
        }
        if (directKeysPressed) {
            navigateToURL(); // 对应的操作函数
        }
        if (forwardKeysPressed) {
            handleForwardNavigation(); // 对应的操作函数
        }
        if (loadingKeysPressed) {
            loadingPanel.style.display = loadingPanel.style.display === 'none' ? 'block' : 'none';
        }
    });

    var debouncedScrollHandler = debounce(function() {
        cleanPreloadQueue();
        cleanAbortControllers();
        preloadVisibleLinks();
        checkAndAddBulletsForPreloadedLinks();
    }, 10);

    var debouncedScrollHandlerPC = debounce(function() {
        cleanPreloadQueue();
        cleanAbortControllers();
        checkAndAddBulletsForPreloadedLinks();
    }, 10);


    document.addEventListener('click', function(event) {
        var target = event.target.closest('a');
        if (target && target.href) {
            event.preventDefault();
            if (event.ctrlKey && !event.shiftKey) {
                // 用户按下了Ctrl键并点击了链接 - 在后台新标签页中打开
                window.open(target.href);
            } else if (event.shiftKey) {
                // 用户按下了Shift键并点击了链接 - 在前台新标签页中打开
                window.open(target.href, '_blank');
            } else {
                // 正常点击 - 不打开新标签页，遵循预加载逻辑以下或直接导航到链接地址
                if (!clickedLinks.includes(target.href)) {
                    clickedLinks.push(target.href);
                }
                currentPreviewIndex = clickedLinks.indexOf(target.href);

                if (target.dataset.preloaded) {
                    readContentFromDB(target.href, function(data) {
                        if (data) {
                            displayPreloadedContent(data.htmlContent, target.href);
                        } else {
                            location.href = target.href;
                        }
                    });
                } else {
                    location.href = target.href;
                }
            }
        }
    });

    observeDOMChanges();
    openDB();
    startLinkPreloading();
    initDB(function() {
        deleteOldContentFromDB();
        scheduleNextCleanup();
    });
    if (isMobileDevice()) {
        GM_setValue('mobileGestures', false);
        window.addEventListener('touchend', debouncedScrollHandler);
        if (GM_getValue('manipulatorBall')) {
            addDraggableIcon();
            document.getElementById('draggableIcon').onclick = handleBackNavigation;
        }
    } else {
        window.addEventListener('scroll', debouncedScrollHandlerPC);
        setupMouseHoverPreload();
        if (GM_getValue('manipulatorBall', true)) {
            addDraggableIcon();
            document.getElementById('draggableIcon').onclick = handleBackNavigation;
        }
    }


})();