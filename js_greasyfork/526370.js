// ==UserScript==
// @name            Gandi 手机版
// @name:en         Gandi Mobile support
// @namespace       http://tampermonkey.net/
// @version         2025-3-20-1
// @description     优化 Gandi 编辑器在手机端的体验
// @description:en  Optimize the Gandi editor experience on mobile
// @author          白猫(wit_cat)
// @match           https://www.ccw.site/gandi*
// @match           https://www.cocrea.world*
// @match           https://www.cocrea.world/gandi*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=ccw.site
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/526370/Gandi%20%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/526370/Gandi%20%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const eyesSVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-xg_idx="15"><path d="M9 6 6 9H18m-2 8 3-3H6" stroke="#9CA3AF" stroke-width="1.60013" stroke-linecap="round" stroke-linejoin="round" data-xg_idx="15"></path></svg>';
    const pinSVG1 = '<svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 1 15 6 13 6 9 10 9 12 7 10 1 15 6 9 4 7 6 7 10 3 10 1" fill="var(--theme-color-g400)"></path></svg>'
    const pinSVG2 = '<svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 1 15 6 13 6 9 10 9 12 7 10 1 15 6 9 4 7 6 7 10 3 10 1" fill="#0000" stroke="var(--theme-color-g400)"></path></svg>'
    let fixationBar = false; //是否固定面板
    let isTouchEnabled = true; // 初始状态默认支持触摸

    function disableTouch() {
        document.querySelector('.fixationBar').style.display = 'none';
        if (isTouchEnabled) {
            isTouchEnabled = false;
        }
    }

    function disableMouse() {
        document.querySelector('.fixationBar').style.display = 'flex';
        if (!isTouchEnabled) {
            isTouchEnabled = true;
        }
    }

    //加上第三方devtool
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/eruda';
    script.onload = function () {
        eruda.init();
        var devtoolStyle = document.createElement("style");
        devtoolStyle.innerHTML = `
        .luna-console-log-content {
            display: flex !important;
            flex-direction: column !important;
        }
    `;
        document.querySelector('#eruda')?.shadowRoot.appendChild(devtoolStyle);
        const text = `
 /$$   /$$           /$$ /$$                  /$$$$$$                            /$$ /$$
| $$  | $$          | $$| $$                 /$$__  $$                          | $$|__/
| $$  | $$  /$$$$$$ | $$| $$  /$$$$$$       | $$  \\__/  /$$$$$$  /$$$$$$$   /$$$$$$$ /$$
| $$$$$$$$ /$$__  $$| $$| $$ /$$__  $$      | $$ /$$$$ |____  $$| $$__  $$ /$$__  $$| $$
| $$__  $$| $$$$$$$$| $$| $$| $$  \\ $$      | $$|_  $$  /$$$$$$$| $$  \\ $$| $$  | $$| $$
| $$  | $$| $$_____/| $$| $$| $$  | $$      | $$  \\ $$ /$$__  $$| $$  | $$| $$  | $$| $$
| $$  | $$|  $$$$$$$| $$| $$|  $$$$$$/      |  $$$$$$/|  $$$$$$$| $$  | $$|  $$$$$$$| $$
|__/  |__/ \\_______/|__/|__/ \\______/        \\______/  \\_______/|__/  |__/ \\_______/|__/
`;

        function generateBlueToWhiteGradient(n) {
            const colors = [];
            for (let i = 0; i < n; i++) {
                const lightness = 30 + (i / (n - 1)) * 70; // 亮度从30%增加到100%
                colors.push(`color: hsl(240, 100%, ${lightness}%);`); // HSL中的240是纯蓝色
            }
            return colors;
        }

        const colors = generateBlueToWhiteGradient(10);

        // 按行分割
        const lines = text.split("\n");

        // 生成格式化字符串
        let logString = "";
        let styles = [];

        lines.forEach((line, index) => {
            if (line.trim() !== "") { // 过滤掉空行
                logString += `%c${line}\n`;
                styles.push(colors[index % colors.length]); // 让颜色循环使用
            }
        });

        // 统一输出，不会被 `console.log` 自动分割
        console.log(logString, ...styles);
        console.log('欢迎使用 Gandi 手机版 插件，让您的移动设备编程体验更上一层楼！');
        console.log('有任何问题可以加Q群：760188536 与我们一起交流！');
    };
    document.body.appendChild(script);
    //计算屏幕缩放比例
    function pluginCalculateScale() {
        const bodyHeight = document.body.clientHeight;
        const a = 0.00219;
        const b = -0.13146;
        const scale = a * bodyHeight + b;
        return Math.min(scale, 1); // 确保结果不超过 1
    }
    function pageCalculateScale() {
        const screenHeight = window.innerHeight;
        const a = 0.00161;
        const b = -0.091;
        return Math.min(1, a * screenHeight + b);
    }
    let pluginScale = pluginCalculateScale(),pageScale = pageCalculateScale(); //计算插件缩放
    document.documentElement.style.setProperty('--plugin-scale', pluginScale);
    document.documentElement.style.setProperty('--page-scale', pageScale);

    window.addEventListener('resize', () => {
        pluginScale = pluginCalculateScale();
        pageScale = pageCalculateScale();
        document.documentElement.style.setProperty('--plugin-scale', pluginScale);
        document.documentElement.style.setProperty('--page-scale', pageScale);
    });

    //禁用自动放大
    var meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    document.head.appendChild(meta);

    // 修改所有输入框的样式，防止自动放大
    var style = document.createElement("style");
    style.innerHTML = `
        input, textarea {
            font-size: 16px !important;  /* 避免 iOS 自动放大 */
            touch-action: manipulation; /* 禁用双击放大 */
        }
        .react-draggable {
            transform-origin: left top;
        }
        .MuiDialogTitle-root {
            padding: 1vh !important;
        }
        .MuiDialogActions-root {
            padding: 1vh !important;
        }
        .close-button-11FHp {
            padding: 0px !important;
        }
        .title-3Gkc- {
            margin: 0px !important;
        }
        .MuiDialogContent-root {
            margin: 0px !important;
        }
        .gandi_setting-modal_scroller_2rlIe {
            zoom: var(--page-scale) !important;
        }
        .gandi_bulletin-modal_modal-overlay_TBAhj {
            zoom: var(--page-scale) !important;
        }
        .css-8ipe1d {
            zoom: var(--page-scale) !important;
            height: 100% !important;
        }
        .gandi_setting-modal_menu_2IwVr {
            overflow: scroll;
            zoom: var(--page-scale) !important;
        }
        .gandi_teamwork-log_mini-log-wrapper_2jVbu {
            zoom: var(--page-scale) !important;
        }
        .panel-10ig7 {
            position: fixed;
        }
        .gandi_notify_messages-wrapper_30XPC {
            position: fixed;
            right: 10px;
        }
        .menu-wrapper-2kfeg {
            max-height: 80vh;
            overflow: scroll;
        }
        .gandi_teamwork_description_1GGb- {
            position: fixed !important;
            right: 10px !important;
        }
        .layout-2pe9s {
            zoom:var(--page-scale);
        }
        .gandi_modal_modal-overlay_1Lcbx {
            zoom: var(--page-scale)!important;
        }
    `;
    document.head.appendChild(style);

    function ToolBar() {
        const scratchCategoryMenu = document.querySelector('.scratchCategoryMenu');
        const toolboxSwitchButton = document.querySelector('.toolboxSwitchButton');

        if (scratchCategoryMenu && toolboxSwitchButton) {

            let touchTimer = null;

            scratchCategoryMenu.addEventListener('touchstart', (event) => {
                if((!fixationBar && isTouchEnabled)){
                    touchTimer = setTimeout(() => {
                        touchTimer = null; // 超时不触发
                    }, 200);
                }
            });

            scratchCategoryMenu.addEventListener('touchend', (event) => {
                if (touchTimer) {
                    clearTimeout(touchTimer);
                    touchTimer = null;

                    const parent = toolboxSwitchButton?.parentElement?.parentElement;
                    if (parent && parent.classList.contains('collapsed')) {
                        toolboxSwitchButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));

                    }else{
                        toolboxSwitchButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));

                    };
                }
            });

            scratchCategoryMenu.addEventListener('touchmove', () => {
                clearTimeout(touchTimer);
                touchTimer = null; // 移动手指则取消触发
            });

            scratchCategoryMenu.addEventListener('touchcancel', () => {
                clearTimeout(touchTimer);
                touchTimer = null; // 取消触摸时也不触发
            });
        }
    }

    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect(); // 先停止观察，等待元素移除
                waitForRemoval(element, ()=>{
                    const toolboxSwitchButton = document.querySelector('.toolboxSwitchButton');
                    const parent = toolboxSwitchButton?.parentElement?.parentElement;
                    if (parent && !parent.classList.contains('collapsed')) {
                        toolboxSwitchButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                    }
                    //天杀的scratch切换角色怎么还移除积木栏啊啊啊啊
                    let wasRemoved = false; // 记录积木区是否曾被删除

                    const ToolBarObserver = new MutationObserver((mutationsList) => {
                        for (const mutation of mutationsList) {
                            mutation.removedNodes.forEach(node => {
                                if (node.classList?.contains('scratchCategoryMenu')) {
                                    wasRemoved = true;
                                }
                            });

                            mutation.addedNodes.forEach(node => {
                                if (node.classList?.contains('scratchCategoryMenu') && wasRemoved) {
                                    wasRemoved = false;
                                    ToolBar();
                                }
                            });
                        }
                    });

                    ToolBarObserver.observe(document.body, { childList: true, subtree: true });


                    // 注入插件区域，兼容小屏手机
                    const pluginsRoot = document.querySelector('.gandi_plugins_plugins-root_xA3t3');

                    if (pluginsRoot) {
                        // 设置样式
                        Object.assign(pluginsRoot.style, {
                            height: 'calc(100% - 128px)',
                            overflowY: 'scroll',
                            width: '36px',
                            left: '-43px',
                        });

                        // 统一应用缩放
                        function applyZoomToChildren() {
                            pluginsRoot.childNodes.forEach(child => {
                                if (child.nodeType === 1) { // 确保是元素节点
                                    child.style.zoom = 'var(--plugin-scale)';
                                }
                            });
                        }

                        // 先给已有的插件应用缩放
                        applyZoomToChildren();

                        // 监听新增插件
                        const observer = new MutationObserver(mutations => {
                            mutations.forEach(mutation => {
                                mutation.addedNodes.forEach(node => {
                                    if (node.nodeType === 1) { // 只处理元素节点
                                        node.style.zoom = 'var(--plugin-scale)';
                                    }
                                });
                            });
                        });

                        observer.observe(pluginsRoot, { childList: true }); // 监听子元素的变化
                    }

                });
                callback();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function waitForRemoval(element, callback) {
        const observer = new MutationObserver(() => {
            if (!document.body.contains(element)) {
                observer.disconnect();
                callback();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForElement('.gandi_loader_background_2DPrW', () => {
        init();
    });

    function init() {
        // 监听触摸事件（启用触摸，禁用鼠标）
        document.addEventListener("touchstart", disableMouse, { capture: true, passive: true });

        // 监听鼠标移动事件（启用鼠标，禁用触摸）
        document.addEventListener("mousemove", disableTouch);

        setTimeout(()=> window.dispatchEvent(new Event('resize')), 2000);
        //注入监听积木栏自动折叠
        const ToolBarObserver = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                const toolboxSwitchButton = document.querySelector('.toolboxSwitchButton');
                const parent = toolboxSwitchButton?.parentElement?.parentElement;
                if (parent && !parent.classList.contains('collapsed') && (!fixationBar && isTouchEnabled)) {
                    if ([...mutation.addedNodes].some(node => node.classList?.contains('blocklyInsertionMarker'))) {
                        toolboxSwitchButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                        break;
                    }
                }
            }
        });
        ToolBarObserver.observe(document.body, { childList: true, subtree: true });

        //监听变量同步弹窗
        const observeModalPadding = () => {
            const observer = new MutationObserver(() => {
                const modalContent = document.querySelector('.gandi_dialog_modal-content_3k_LP');
                const content = document.querySelector('.gandi_sync-variables_variables_2KdIr');
                if(content){
                    content.style.height = '100vh';
                    content.style.maxHeight = 'calc(90vh - 163px)';
                }
                const contents = document.querySelector('.gandi_sync-variables_variablesTable_OrxQn');
                if(contents){
                    contents.style.maxWidth = '90vw';
                }
                if (modalContent && modalContent.firstElementChild) {
                    modalContent.style.maxWidth = '90vw';
                    Array.from(modalContent.firstElementChild.children).forEach(child => {
                        child.style.padding = '0px';
                    });
                }
            });

            // 监听整个 body 以检测对话框的插入
            observer.observe(document.body, { childList: true, subtree: true });
        };

        // 调用监听函数
        observeModalPadding();


        //一些基础元素样式
        function hideScrollbar(domElement) {
            if (domElement) {
                // 适用于一般浏览器
                domElement.style.scrollbarWidth = 'none';
                domElement.style.msOverflowStyle = 'none';
                domElement.classList.add('hide-scrollbar');

                // 适用于 WebKit（Chrome、Safari）
                const style = document.createElement('style');
                style.textContent = `
            ${domElement.className}::-webkit-scrollbar {
                display: none;
            }
        `;
                document.head.appendChild(style);
            }
        }

        hideScrollbar(document.querySelector('.gandi_target-pane_target-list_10PNw'))
        hideScrollbar(document.querySelector('.gandi_plugins_plugins-root_xA3t3'));
        document.querySelector('.gandi_stage-header_stage-menu-wrapper_15JJt')?.style.setProperty('height', '100%', 'important');
        document.querySelector('.gandi_editor-wrapper_tabPanelWrapper_Fb3KY')?.style.setProperty('overflow', 'scroll', 'important');
        document.querySelector('.publish-button-2RcKQ')?.style.setProperty('min-width', '126px', 'important');
        document.querySelector('.publish-button-2RcKQ')?.style.setProperty('max-width', '126px', 'important');
        document.querySelector('.publish-button-2RcKQ')?.style.setProperty('flex-grow', '1', 'important');
        document.querySelector('.gandi_menu-bar_main-menu_3wjWH')?.style.setProperty('min-width', '460px', 'important');
        document.querySelector('.gandi_menu-bar_menu-bar_JcuHF')?.style.setProperty('overflow', 'scroll', 'important');
        document.querySelector('.gandi_menu-bar_menu-bar_JcuHF').style.width = '100vw'; //针对cocrea的优化
        const StageBar = document.querySelector('.xg-stage-menu-wrapper');
        StageBar?.style.setProperty('min-height', '0px', 'important');
        StageBar?.style.setProperty('max-height', '60px', 'important');
        StageBar?.style.setProperty('flex', '1', 'important');
        StageBar?.parentElement?.style.setProperty('height', '100%', 'important');
        StageBar?.parentElement?.style.setProperty('display', 'flex', 'important');
        StageBar?.parentElement?.style.setProperty('flex-direction', 'column', 'important');
        const verticalBar = document.querySelector('.gandi_vertical-bar_bar_Tsvpu');
        hideScrollbar(verticalBar);
        verticalBar?.style.setProperty('height', 'calc(100vh - 60px)', 'important');
        verticalBar?.style.setProperty('overflow-y', 'scroll', 'important');

        //固定面板
        const toolboxHeader = document.querySelector('.toolboxHeader');

        if (toolboxHeader) {
            // 创建新的 div 元素
            const newIcon = document.createElement('div');
            newIcon.className = 'addons_tip-icon_oy8QS addons_icon_cqmhL fixationBar';
            newIcon.style.right = '24px';
            newIcon.innerHTML = pinSVG2;

            // 确保 toolboxHeader 至少有一个子元素，插入为第二个
            if (toolboxHeader.children.length > 1) {
                toolboxHeader.insertBefore(newIcon, toolboxHeader.children[1]);
            } else {
                toolboxHeader.appendChild(newIcon); // 如果没有足够的子元素，则追加
            }

            // 绑定点击事件
            newIcon.addEventListener('click', () => {
                // 这里可以添加你的逻辑
                if(fixationBar){
                    fixationBar = false;
                    newIcon.innerHTML = pinSVG2;
                } else {
                    fixationBar = true;
                    newIcon.innerHTML = pinSVG1;
                }
            });
        }


        //针对画板和声音界面的优化
        document.querySelectorAll('.gandi_editor-wrapper_tab_2OPuA').forEach((tab, index) => {
            tab.addEventListener('click', () => {
                const sideBar = document.querySelector('.gandi_vertical-bar_bar_Tsvpu');
                const pluginsRoot = document.querySelector('.gandi_plugins_plugins-root_xA3t3');
                const headBar = document.querySelector('.gandi_menu-bar_menu-bar_JcuHF');

                if (!sideBar || !pluginsRoot||!headBar) return; // 防止报错

                if (index === 0) {
                    // **第一个Tab被点击**
                    sideBar.style.width = '72px';
                    sideBar.style.padding = '12px 11px';
                    sideBar.style.borderRight = '1px solid var(--theme-color-200)';
                    pluginsRoot.style.display = 'flex';
                    headBar.style.borderBottom = '1px solid var(--theme-color-200)';
                    headBar.style.height = '60px';
                } else if (index === 1 || index === 2) {
                    // **第二个或第三个Tab被点击**
                    sideBar.style.width = '0';
                    sideBar.style.padding = '0';
                    sideBar.style.borderRight = '0px';
                    pluginsRoot.style.display = 'none';
                    headBar.style.borderBottom = '0px';
                    headBar.style.height = '0px';
                }
            });
        });

        let collapsibleBoxes = document.querySelectorAll('.gandi_collapsible-box_collapsible-box_1_329');
        if (collapsibleBoxes.length > 1) {
            collapsibleBoxes[0].style.top = '10px';
            collapsibleBoxes[0].style.height = 'calc(100% - 15px)';
            collapsibleBoxes[0].style.transition = 'all 0.2s ease-out';
            collapsibleBoxes[0].style.transition = 'all 0.2s ease-out';
            collapsibleBoxes[0].style.maxHeight = '330px';
            collapsibleBoxes[1].style.top = '10px';
            collapsibleBoxes[1].style.height = 'calc(100% - 15px)';
            collapsibleBoxes[1].style.transition = 'all 0.2s ease-out';
            collapsibleBoxes[1].lastChild.style.overflow = 'hidden';
        }

        let switchButtons = document.querySelectorAll('.gandi_collapsible-box_switch-button_2A5kM');
        switchButtons.forEach(button => {
            let parent = button.parentElement?.parentElement;
            if (parent && !parent.classList.contains('gandi_collapsible-box_collapsed_oQuU1')) {
                setTimeout(() => button.click(), 100);
            }
        });

        let headers = document.querySelectorAll('.gandi_collapsible-box_header_dc9Es');

        if (headers.length > 1) {
            let newButton = document.createElement('span');
            newButton.className = 'gandi_collapsible-box_switch-button_2A5kM';
            newButton.setAttribute('data-xg_idx', '4');
            newButton.innerHTML = eyesSVG;

            newButton.addEventListener('click', () => {
                let target = collapsibleBoxes[1];
                if(target.style.height === '28px'){
                    if (target) {
                        target.style.height = 'calc(100% - 15px)';
                    }
                    let addScript = document.querySelectorAll('.gandi_action-menu_menu-container_3a6da');
                    addScript = addScript[addScript.length - 1];
                    if(addScript) {
                        addScript.style.transform = 'unset';
                    }
                }else{
                    if (target) {
                        target.style.height = '28px';
                    }
                    let addScript = document.querySelectorAll('.gandi_action-menu_menu-container_3a6da');
                    addScript = addScript[addScript.length - 1];
                    if(addScript) {
                        addScript.style.transform = 'scale(0)';
                    }
                }
            });
            headers[1].appendChild(newButton);
        }
        function hideStage() {
            const firstButton = document.querySelectorAll('.gandi_collapsible-box_switch-button_2A5kM');
            const parent = firstButton[0]?.parentElement?.parentElement;
            const parents = firstButton[1]?.parentElement?.parentElement;
            if (parent && parents && (parent.classList.contains('gandi_collapsible-box_collapsed_oQuU1') === parents.classList.contains('gandi_collapsible-box_collapsed_oQuU1'))) {
                firstButton[0]?.click();
            }
        }
        function monitorFirstSwitchButton() {
            const firstElement = document.querySelectorAll('.gandi_collapsible-box_switch-button_2A5kM');
            if (firstElement[1]) {
                firstElement[1].addEventListener('click', () => {
                    hideStage();
                });
            }
        }

        monitorFirstSwitchButton();

        //禁止右上角头像的点击跳转
        document.querySelector('.user-avatar-3n9pt')?.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        //删除影响点击的元素（我不知道为什么sb Gandi插件一旦被关闭窗口马上创建一个覆盖全页面的寄吧元素不让点击）
        //貌似只有部分内核的浏览器受影响，目前没发现有移动设备受影响，但是windows edge的devtools模拟环境会有
        const blackBard = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('addons_interlayer_lVD80')) {
                        node.remove();
                    }
                });
            }
        });

        blackBard.observe(document.body, { childList: true, subtree: true });
        //将所有的插件页面缩小
        const plugin = new MutationObserver(mutationsList => {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.classList.contains('react-draggable')) {
                        const transform = target.style.transform || '';
                        const scaleRegex = /scale\(?[^)]+\)/;
                        const newScale = `scale(${pluginScale})`;

                        if (scaleRegex.test(transform)) {
                            target.style.transform = transform.replace(scaleRegex, newScale);
                        } else {
                            target.style.transform = `${transform} ${newScale}`;
                        }
                    }
                }
            });
        });

        // 监听所有 react-draggable 元素
        const observeDraggableElements = () => {
            document.querySelectorAll('.react-draggable').forEach(el => {
                const transform = el.style.transform || '';
                const scaleRegex = /scale\(?[^)]+\)/;
                const newScale = `scale(${pluginScale})`;

                if (scaleRegex.test(transform)) {
                    el.style.transform = transform.replace(scaleRegex, newScale);
                } else {
                    el.style.transform = `${transform} ${newScale}`;
                }
                plugin.observe(el, { attributes: true, attributeFilter: ['style'] });
            });
        };

        // 初次运行
        observeDraggableElements();

        // 监听新元素的插入，确保后续添加的 react-draggable 也被监听
        const domObserver = new MutationObserver(() => observeDraggableElements());
        domObserver.observe(document.body, { childList: true, subtree: true });

        //监听代码编辑器
        const codeEditorObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                const target = document.querySelector('#codeEditor')?.firstElementChild?.firstElementChild;
                if (target) {
                    target.style.width = '10vw';
                }
            }
        });

        codeEditorObserver.observe(document.body, { childList: true, subtree: true });
    }
})();
