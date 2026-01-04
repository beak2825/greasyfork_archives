// ==UserScript==
// @name         脚本托管运行(大版本)
// @namespace    http://tampermonkey.net/
// @version      10.0.2
// @description  托管定时执行一些代码
// @author       You
// @match        https://*/*
// @match        http://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_log
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/433781/%E8%84%9A%E6%9C%AC%E6%89%98%E7%AE%A1%E8%BF%90%E8%A1%8C%28%E5%A4%A7%E7%89%88%E6%9C%AC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433781/%E8%84%9A%E6%9C%AC%E6%89%98%E7%AE%A1%E8%BF%90%E8%A1%8C%28%E5%A4%A7%E7%89%88%E6%9C%AC%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加必要的CSS样式
    GM_addStyle(`
        @keyframes breathing {
            0% { text-shadow: 0 0 4px rgba(255,255,255,0.4); }
            50% { text-shadow: 0 0 10px rgba(255,255,255,0.8); }// 修改这里的12px调整阴影大小
            100% { text-shadow: 0 0 4px rgba(255,255,255,0.4); }
        }

        .tm-breathing-highlight {
            animation: breathing 2s ease-in-out infinite;
            display: inline-block;
            transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .tm-hover-enlarge {
            transform: scale(1.15);// 修改1.15值调整放大比例
        }
    `);

    // *** 常量定义
    const JSON_DATA = '{"text":[' +
          '{"name":"审批表管理","url":"/sp/workflow/workflow_setting/pathdef/list/company"},' +
          '{"name":"业务表单","url":"/formreport/forms"},' +
          '{"name":"动作流","url":"/info/esb/application"},' +
          '{"name":"e-Builder","url":"/sp/ebdapp/home"},' +
          '{"name":"审批监控","url":"/workflow/list/monitor"},' +
          '{"name":"表单引擎","url":"/info/app_form/form-manage"},' +
          '{"name":"后台管理中心","url":"/info/org/departmentSetting"}' +
          ']}';
    const JSON_URL = `[
        {"name": "云端 E10", "url": "https://weapp.eteams.cn"},
        {"name": "鲲鹏系统", "url": "http://39.104.75.218:9111/"},
        {"name": "仓颉科技云端系统", "url": "https://office.cangjieit.cn:8443/"},
        {"name": "仓颉科技", "url": "http://101.43.174.72:6041"}
    ]`; // 此脚本应用于何处

    // *** 变量声明
    const MENU_ID = "开启新页面";
    const DIALOG_ID = "dialog17699059661";
    const SHED_ID = "shed17699059661";
    const TEMP_TITLE_KEY = "tempTitle";
    let titleObserver = null; // 初始化title保护的一个观察者
    let protectedTitle = '';
    const page_load_complete_delay = 2000; // 页面加载完成检测延迟（毫秒）
    let lastMousePosition = { x: 0, y: 0 }; // 存储鼠标位置

    let objJsonParse = JSON.parse(JSON_DATA);
    let finalTitle = "";
    let isScriptRunning = false;

    // *** 初始化函数
    function initializeScript() {
        log("开始初始化脚本");

        const url = window.location.href;
        const jsonData = JSON.parse(JSON_URL);
        let isMatched = jsonData.some(item => url.includes(item.url));

        if (!isMatched) {
            log("不是已知系统，退出脚本");
            return;
        }

        // 读取初始化的保护标题
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('custom_protected_title')) {
            titleFixed(urlParams.get('custom_protected_title')); // 设置保护标题
        }

        if (url.includes("/sp/") && url.includes("formId=") && url.includes("formdesigner")) {
            removeTipBar();
            log("表单设计器，移除页面的tipBar");
            return;
        }

        // 检查是否已创建菜单
        if (!document.getElementById(DIALOG_ID)) {
            createMenu();
        }

        // 页面加载状态检测
        let timer = null;
        const observer = new MutationObserver((mutationsList, observer) => {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                observer.disconnect();
                log("页面加载完成");

                if (url.includes("/esb/application") || url.includes("app_form/form-manage")) {
                    removeLeftBar();
                    log("动作流或者表单引擎页面，移除左侧bar");
                }

                if(document.getElementsByClassName("custom_xiaoe_assistant_drag_btn ui-m-quick-menu-drag-btn react-draggable")[0]){
                    // 移除小e
                    document.getElementsByClassName("custom_xiaoe_assistant_drag_btn ui-m-quick-menu-drag-btn react-draggable")[0].remove();
                }

                // 检查是否已创建菜单
                if (!document.getElementById(DIALOG_ID)) {
                    createMenu();
                }
            }, page_load_complete_delay);
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // *** 程序入口点
    document.addEventListener('DOMContentLoaded', function() {
        log("DOMContentLoaded 事件触发");
        initializeScript();
    });

    window.addEventListener('load', function() {
        log("window load 事件触发");
        initializeScript();
    });

    // 监听SPA路由变化
    if (window.history && window.history.pushState) {
        window.addEventListener('popstate', function() {
            log("路由变化检测");
            setTimeout(initializeScript, 500);
        });
    }

    function createMenu() {
        // 检查导航栏是否存在
        const menuElement = document.getElementsByClassName("e10header-menu-item-name")[0];
        if (menuElement) {
            log("找到导航栏元素，开始创建菜单");
            headerCreate();
            hideDialog();
            // toast("准备就绪", true, 1000);
            // menuElement.style.color='red';

            // 添加呼吸灯效果
            menuElement.classList.add('tm-breathing-highlight');
            // 添加悬停放大效果
            const parentItem = menuElement.closest('.e10header-menu-item');
            if (parentItem) {
                // 使用一次性事件监听器避免重复添加
                const mouseEnterHandler = () => {
                    menuElement.classList.add('tm-hover-enlarge');
                };

                const mouseLeaveHandler = () => {
                    menuElement.classList.remove('tm-hover-enlarge');
                };

                parentItem.addEventListener('mouseenter', mouseEnterHandler);
                parentItem.addEventListener('mouseleave', mouseLeaveHandler);
            }

            // 添加右键菜单事件监听（修改为绑定到父元素）
            document.addEventListener('contextmenu', function(e) {
                // 检查是否点击在菜单项上
                if (e.target.closest('.e10header-menu-item')) {
                    e.preventDefault();
                    log("右键点击菜单项");
                    lastMousePosition = { x: e.clientX, y: e.clientY };
                    showDialogAtMouse();
                }
            }, true);
        } else {
            log("未找到导航栏元素");
            // toast("未找到导航栏", false, 1000);
        }
    }

    function removeTipBar() { // 移除表单设计器的顶部提示按钮
        if (document.querySelectorAll('.wf-form-design-tip')[0] != null) {
            log("找到了 wf-form-design-tip");
            document.querySelectorAll('.wf-form-design-tip')[0].style.display = "none";
            return;
        }
        setTimeout(removeTipBar, 100);
    }

    function headerCreate() {
        let dialog = document.createElement("div");
        dialog.id = DIALOG_ID;
        dialog.style.textAlign = "left"; // 添加全局左对齐
        dialog.style.width = "30%"; // 宽度从20%改为30%

        let head = document.createElement("div");
        head.style.cssText = "border-bottom: 1px solid gray; font-size: 24px; padding: 10px; text-align: center;"; // 标题居中
        head.innerText = "请选择";
        dialog.append(head); // 加入dialog的标题

        objJsonParse.text.forEach((option, index, array) => {
            let div = document.createElement("div");
            if (index !== array.length - 1) {
                div.style.borderBottom = "1px solid gray";
            }

            let optionDiv = createOptionDiv(option);
            div.append(optionDiv);
            dialog.appendChild(div);
        });
        document.body.appendChild(dialog);

        let shed = document.createElement("div");
        shed.id = SHED_ID;
        // 修改为fixed定位实现全屏覆盖
        shed.style.cssText = "width: 100%; height: 100%; background-color: rgb(0, 0, 0); position: fixed; left: 0px; top: 0px; z-index: 2000; opacity: 0.2;";
        shed.onclick = hideDialog;
        document.body.appendChild(shed);
    }

    function createMenuOption(text, onClickHandler) {
        let option = document.createElement("div");
        option.style.cssText = "padding: 8px; font-size: 22px;";
        option.innerText = text;
        option.onclick = onClickHandler;
        return option;
    }

    function createOptionDiv(option) {
        let optionDiv = document.createElement("div");
        optionDiv.id = "option";
        optionDiv.innerText = option.name;
        optionDiv.style.padding = "10px"; // 增加内边距
        optionDiv.style.cursor = "pointer";
        optionDiv.setAttribute("name", option.name);
        optionDiv.setAttribute("url", option.url);
        optionDiv.onmouseover = () => { optionDiv.style.backgroundColor = "#f0f0f0"; };
        optionDiv.onmouseleave = () => { optionDiv.style.backgroundColor = ""; };
        optionDiv.onclick = () => {
            // 构建带参数的URL
            const url = new URL(window.location.origin + option.url);
            url.searchParams.set('custom_protected_title', option.name);
            window.open(url.toString());
            hideDialog();
        };
        return optionDiv;
    }

    function hideDialog() {
        log("开始隐藏");
        document.getElementById(DIALOG_ID).style.display = "none";
        document.getElementById(SHED_ID).style.display = "none";
    }

    function showDialog() {
        log("开始显示");
        setTimeout(function() {
            var dialog = document.getElementById(DIALOG_ID);
            dialog.style.cssText = "position: absolute; z-index: 9999; font-size: 20px; border-radius: 7px; background-color: rgb(255,255,255); overflow: auto; left: 0%; top: 0%; text-align: left; padding: 10px;"; // 文本左对齐
            dialog.style.width = "20%"; // 宽度改为原来的约一半
            dialog.style.marginTop = `${document.querySelector(".e10header-menu").offsetHeight}px`;
            document.getElementById(DIALOG_ID).style.display = "";
            document.getElementById(SHED_ID).style.display = "";
        }, 500);
    }

    // 在鼠标位置显示对话框
    function showDialogAtMouse() {
        log("在鼠标位置显示对话框");
        var dialog = document.getElementById(DIALOG_ID);

        // 设置对话框样式（宽度改为30%）
        dialog.style.cssText = `
            position: fixed;
            z-index: 9999;
            font-size: 20px;
            border-radius: 7px;
            background-color: white;
            overflow: auto;
            text-align: left;
            padding: 10px;
            display: block;
            width: 30%;
            max-height: 70vh;
            overflow-y: auto;
        `;

        // 计算位置 - 右下角显示
        const dialogWidth = dialog.offsetWidth;
        const dialogHeight = dialog.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 计算位置，确保在窗口内
        let left = lastMousePosition.x + 10;
        let top = lastMousePosition.y + 10;

        // 调整位置防止超出右边界
        if (left + dialogWidth > windowWidth) {
            left = windowWidth - dialogWidth - 10;
        }

        // 调整位置防止超出下边界
        if (top + dialogHeight > windowHeight) {
            top = windowHeight - dialogHeight - 10;
        }

        dialog.style.left = `${left}px`;
        dialog.style.top = `${top}px`;

        // 显示遮罩
        document.getElementById(SHED_ID).style.display = "";
    }

    //******************************************************************************   移除动作流左侧菜单  *******************************************************************************
    function removeLeftBar() {
        // 改进的移除左侧菜单逻辑
        const targetClassName = "ui-layout-side layout-box-block side-outer-left-col";

        // 尝试立即执行一次
        tryRemoveLeftBar();

        // 如果未成功，设置重试机制
        let attempts = 0;
        const maxAttempts = 10;
        const interval = 500; // 500毫秒重试一次

        const retryInterval = setInterval(() => {
            if (tryRemoveLeftBar() || attempts >= maxAttempts) {
                clearInterval(retryInterval);
            }
            attempts++;
        }, interval);

        function tryRemoveLeftBar() {
            try {
                const leftCols = document.getElementsByClassName(targetClassName);

                // 检查是否找到目标元素
                if (leftCols.length >= 2) {
                    // 移除第一个左侧栏
                    leftCols[0].remove();

                    // 查找并点击隐藏按钮
                    const buttons = document.getElementsByClassName("ui-layout-box-show-btn show-btn-left is-outer custom-layout-box-hidden-btn");
                    if (buttons.length > 0) {
                        buttons[0].click();
                    }

                    log("成功移除左侧菜单");
                    return true;
                }
            } catch (e) {
                log("移除左侧菜单时出错: " + e.message);
            }
            return false;
        }
    }

    //******************************************************************************   设置保护标题  *******************************************************************************

    function titleFixed(title) {
        log("进入标题保护函数: " + title);
        if (title === "请输入") {
            title = prompt("请输入新标题");
            if (!title) return; // 用户取消输入
        }

        // 设置新标题
        protectedTitle = title;
        document.title = title;
        log("标题被设置为: " + title);

        // 如果观察者不存在，创建新的观察者
        if (!titleObserver) {
            const titleElement = document.querySelector('title');
            if (!titleElement) {
                log("未找到标题元素");
                return;
            }

            titleObserver = new MutationObserver(() => {
                if (document.title !== protectedTitle) {
                    log("检测到标题变化: " + document.title + " -> " + protectedTitle);
                    document.title = protectedTitle;
                }
            });

            titleObserver.observe(titleElement, { childList: true });
            log("标题观察者已启动");
        }
    }

    //******************************************************************************   公共方法  *******************************************************************************
    function log(msg) {
        console.log("tampermonkey - " + msg);
    }

    function getValue(key) {
        let value = GM_getValue(key);
        return value;
    }

    function setValue(key, value) {
        GM_setValue(key, value);
    }

    function deleteValue(key) {
        log("删除数据：key = " + key + " value = " + getValue(key));
        GM_deleteValue(key);
    }

    function toast(msg, type, duration = 3000) {
        // 移除已有的Toast
        const existingToast = document.getElementById("toast17699059661");
        if (existingToast) existingToast.remove();

        // 创建Toast容器
        const toast = document.createElement("div");
        toast.id = "toast17699059661";
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            color: white;
            background-color: ${type ? '#4CAF50' : '#F44336'};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.4s ease;
        `;

        // 添加图标
        const icon = document.createElement("span");
        icon.style.cssText = `
            margin-right: 10px;
            font-size: 18px;
            vertical-align: middle;
        `;
        icon.innerHTML = type ? '✓' : '✕';

        // 添加文本
        const text = document.createElement("span");
        text.innerText = msg;

        toast.appendChild(icon);
        toast.appendChild(text);
        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateX(-50%) translateY(0)";
        }, 10);

        // 自动消失
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(-50%) translateY(20px)";

            // 移除元素
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, duration);
    }
})();