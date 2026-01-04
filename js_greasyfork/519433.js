// ==UserScript==
// @name         飞向未来摆烂计划
// @namespace    http://182.43.19.5:9999
// @version      2.6
// @description  实现飞向未来摆烂计划的功能模块化管理，并支持按键组合管理
// @author       Kinle+GPT
// @match        http://182.43.19.5:9999/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519433/%E9%A3%9E%E5%90%91%E6%9C%AA%E6%9D%A5%E6%91%86%E7%83%82%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/519433/%E9%A3%9E%E5%90%91%E6%9C%AA%E6%9D%A5%E6%91%86%E7%83%82%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let popupVisible = false;
    let popupElement = null;
    let autoTreePanel = null; // 自动撸树控制面板
    let currentStyle = 'dark'; // 默认样式

    // 模块注册表
    const modules = {};

    // 注册模块
    function registerModule(name, initFunction) {
        modules[name] = { initialized: false, init: initFunction };
    }

    function initializeModule(name) {
        if (modules[name] && !modules[name].initialized) {
            modules[name].init();
            modules[name].initialized = true;
            console.log(`模块 "${name}" 已初始化`);
        }
    }

    // 按键组合管理
    const keyBindings = {};

    function registerKeyBinding(name, binding, callback) {
        keyBindings[name] = { binding, action: callback };
    }

    function handleKeyCombination(event) {
        for (const key in keyBindings) {
            const binding = keyBindings[key];
            if (binding.binding.ctrl === event.ctrlKey &&
                binding.binding.alt === event.altKey &&
                binding.binding.shift === event.shiftKey &&
                (binding.binding.key === event.key || !binding.binding.key)) {
                event.preventDefault();
                binding.action(event);
            }
        }
    }

    // 注册按键组合
    registerKeyBinding("togglePopup", { ctrl: true, alt: false, shift: false, key: "b" }, togglePopup);
    registerKeyBinding("maximizeUpgrade", { ctrl: false, alt: false, shift: false, key: "a" }, handleMaximizeUpgrade);
    registerKeyBinding("supplementMaxPopulation", { ctrl: true, alt: false, shift: false, key: "a" }, handleSupplementMaxPopulation);

    document.addEventListener("DOMContentLoaded", function () {
        console.log("页面已完全加载，脚本已激活");
    });

    document.addEventListener("keydown", handleKeyCombination);

    function createPopup() {
        popupElement = document.createElement("div");
        popupElement.id = "fly-to-future-popup";
        popupElement.style.position = "fixed";
        popupElement.style.top = "10px";
        popupElement.style.right = "10px";
        popupElement.style.width = "400px"; // 增加主窗口宽度
        popupElement.style.backgroundColor = "rgba(34, 34, 34, 0.8)";
        popupElement.style.borderRadius = "5px";
        popupElement.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        popupElement.style.zIndex = "10000";
        popupElement.style.padding = "10px";
        popupElement.style.display = "none";
        popupElement.style.userSelect = "none"; // 禁止文字选中
        popupElement.style.backdropFilter = "blur(10px)";

        const titleBar = document.createElement("div");
        titleBar.style.display = "flex";
        titleBar.style.justifyContent = "space-between";
        titleBar.style.alignItems = "center";
        titleBar.style.cursor = "move"; // 使标题栏可拖动

        const title = document.createElement("span");
        title.textContent = "飞向未来摆烂计划";
        title.style.fontWeight = "bold";
        title.style.fontSize = "16px";
        title.style.color = "#fff";
        titleBar.appendChild(title);

        const closeButton = document.createElement("button");
        closeButton.textContent = "关闭窗口";
        closeButton.style.background = "transparent";
        closeButton.style.border = "1px solid #f00";
        closeButton.style.borderRadius = "5px";
        closeButton.style.padding = "2px 5px";
        closeButton.style.color = "#f00";
        closeButton.style.fontSize = "10px";
        closeButton.style.cursor = "pointer";
        closeButton.addEventListener("click", togglePopup);
        titleBar.appendChild(closeButton);

        popupElement.appendChild(titleBar);

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "grid";
        buttonContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
        buttonContainer.style.gap = "10px";

        for (let i = 1; i <= 8; i++) {
            const button = document.createElement("button");
            button.textContent = i === 1 ? "全自动撸树" : (i === 5 ? "建筑五列" : (i === 8 ? "切换样式" : `待添加 ${i}`));
            button.style.backgroundColor = "rgba(60, 60, 60, 0.9)";
            button.style.border = "1px solid rgba(0, 0, 0, 0.5)";
            button.style.borderRadius = "5px";
            button.style.padding = "10px";
            button.style.color = "#fff";
            button.style.fontSize = "14px";
            button.style.cursor = "pointer";
            button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.5)";
            button.style.userSelect = "none"; // 禁止文字选中
            button.addEventListener("click", () => {
                if (button.textContent === "切换样式") {
                    toggleStyle();
                } else {
                    initializeModule(button.textContent);
                }
            });
            buttonContainer.appendChild(button);
        }

        popupElement.appendChild(buttonContainer);
        document.body.appendChild(popupElement);
    }

    function togglePopup() {
        if (!popupElement) createPopup();
        popupVisible = !popupVisible;
        popupElement.style.display = popupVisible ? "block" : "none";
    }

    // 切换样式模块
    function toggleStyle() {
        const styles = {
            light: {
                background: "rgba(255, 255, 255, 0.9)",
                buttonColor: "rgba(200, 200, 200, 0.9)",
                titleColor: "#000",
                textColor: "#000"
            },
            dark: {
                background: "rgba(34, 34, 34, 0.8)",
                buttonColor: "rgba(60, 60, 60, 0.9)",
                titleColor: "#fff",
                textColor: "#fff"
            },
            colorful: {
                background: "rgba(255, 200, 200, 0.9)",
                buttonColor: "rgba(200, 255, 200, 0.9)",
                titleColor: "#000",
                textColor: "#000"
            }
        };

        currentStyle = (currentStyle === 'dark') ? 'light' : (currentStyle === 'light') ? 'colorful' : 'dark';
        const current = styles[currentStyle];

        // 更新主窗口样式
        popupElement.style.backgroundColor = current.background;

        // 更新每个按钮样式
        const buttons = popupElement.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.backgroundColor = current.buttonColor;
            button.style.color = current.textColor;
        });

        // 更新标题样式
        const title = popupElement.querySelector('span');
        title.style.color = current.titleColor;

        console.log(`样式已切换为 ${currentStyle}`);
    }

    function handleMaximizeUpgrade() {
        document.addEventListener("click", function mouseClickHandler(e) {
            if (e.button === 0) {
                console.log("最大化升级功能已触发");
                document.removeEventListener("click", mouseClickHandler);
            }
        }, { once: true });
    }

    function handleSupplementMaxPopulation() {
        document.addEventListener("click", function mouseClickHandler(e) {
            if (e.button === 0) {
                console.log("补充最多人口功能已触发");
                document.removeEventListener("click", mouseClickHandler);
            }
        }, { once: true });
    }

    // 注册模块：全自动撸树
    registerModule("全自动撸树", function () {
        let autoClicking = false; // 是否自动点击
        let clickInterval; // 定时器引用
        let clickFrequency = 500; // 默认点击频率，单位：毫秒

        // 切换自动点击状态
        const toggleAutoClicking = () => {
            autoClicking = !autoClicking; // 切换状态
            if (autoClicking) {
                startAutoClicking(); // 开始自动点击
                console.log('自动撸树已启动，频率：' + clickFrequency + ' 毫秒');
            } else {
                stopAutoClicking(); // 停止自动点击
                console.log('自动撸树已停止');
            }
        };

        // 开始自动点击
        const startAutoClicking = () => {
            clickInterval = setInterval(clickTree, clickFrequency); // 设置定时器
        };

        // 停止自动点击
        const stopAutoClicking = () => {
            clearInterval(clickInterval); // 清除定时器
        };

        // 点击“一只大树🌳”的逻辑
        const clickTree = () => {
            document.querySelectorAll('.building .name').forEach(nameElement => {
                if (nameElement.textContent.trim() === "一只大树🌳") {
                    const buildingDiv = nameElement.closest('.building'); // 获取目标元素
                    if (buildingDiv) {
                        const rect = buildingDiv.getBoundingClientRect();
                        const mouseX = rect.left + rect.width / 2;
                        const mouseY = rect.top + rect.height / 2;

                        const mouseEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            clientX: mouseX,
                            clientY: mouseY,
                        });

                        buildingDiv.dispatchEvent(mouseEvent); // 模拟点击
                        console.log('已点击“一只大树🌳”');
                    }
                }
            });
        };

        // 创建控制面板
        const createControlPanel = () => {
            const panel = document.createElement('div');
            panel.style.cssText = `
                position: fixed; bottom: 20px; right: 20px;
                width: 250px; background-color: rgba(34, 34, 34, 0.8);
                border: 1px solid #000; z-index: 9999; padding: 10px;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); border-radius: 10px;
                user-select: none; // 禁止文字选中
            `;

            // 添加标题
            const title = document.createElement('h4');
            title.innerText = '自动撸树控制面板';
            title.style.margin = '0 0 10px 0';
            title.style.textAlign = 'center';
            title.style.color = "#fff"; // 标题白色
            panel.appendChild(title);

            // 添加启动/停止按钮
            const startButton = document.createElement('button');
            startButton.innerText = '启动/停止';
            startButton.style.cssText = `
                width: 100%; padding: 10px; margin-bottom: 10px;
                background-color: #4CAF50; color: white; border: none;
                border-radius: 5px; cursor: pointer;
            `;
            startButton.addEventListener('click', toggleAutoClicking);
            panel.appendChild(startButton);

            // 添加关闭面板按钮
            const closeButton = document.createElement('button');
            closeButton.innerText = '关闭面板';
            closeButton.style.cssText = `
                width: 100%; padding: 10px; background-color: #f44336;
                color: white; border: none; border-radius: 5px; cursor: pointer;
            `;
            closeButton.addEventListener('click', () => {
                panel.remove(); // 关闭面板
                console.log('控制面板已关闭');
            });
            panel.appendChild(closeButton);

            // 添加频率选择下拉框
            const dropdown = document.createElement('select');
            dropdown.style.cssText = `
                width: 100%; padding: 10px; margin-bottom: 10px;
                border: 1px solid #ccc; border-radius: 5px;
            `;

            // 预设频率选项
            const frequencies = [
                { value: 250, label: '250 毫秒' },
                { value: 300, label: '300 毫秒' },
                { value: 400, label: '400 毫秒' },
                { value: 500, label: '500 毫秒 (默认)' },
            ];

            frequencies.forEach(freq => {
                const option = new Option(freq.label, freq.value);
                dropdown.add(option);
            });

            // 监听频率选择变化
            dropdown.addEventListener('change', (event) => {
                clickFrequency = Number(event.target.value);
                console.log('点击频率设置为：' + clickFrequency + ' 毫秒');
                if (autoClicking) {
                    stopAutoClicking(); // 停止当前定时器
                    startAutoClicking(); // 按新频率重启
                }
            });

            panel.appendChild(dropdown);

            // 将面板添加到页面
            document.body.appendChild(panel);
        };

        createControlPanel(); // 创建控制面板
        console.log('全自动撸树模块已执行');
    });

    // 注册模块：建筑五列
    registerModule("建筑五列", function () {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
            .building-box .building {
                width: calc(20% - 0.35rem) !important;
            }
        `;
        document.head.appendChild(styleElement);
        console.log("建筑五列模块已执行");
    });

    // 添加拖动功能
    function dragElement(element, titleBar) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        titleBar.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

})();
