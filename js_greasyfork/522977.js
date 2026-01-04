// ==UserScript==
// @name         HQU 评教脚本
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  hqu一键评教
// @author       Drifter
// @match        http://jwapp-hqu-edu-cn-s.w.hqu.edu.cn:8118/jwapp/sys/pjapp/*
// @match        *://jwapp.hqu.edu.cn/*pjapp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hqu.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522977/HQU%20%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/522977/HQU%20%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    const CLICK_INTERVAL = 5000; // 按钮点击间隔

    //#region 工具函数

    /**
     * 获取一个用于延时的 promise
     * @param {int} ms 延时毫秒
     * @returns 用于延时的 promise
     */
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function checkSingles() {
        // 单选
        const singles = document.querySelectorAll(".jqx-radiobutton-text"); // 获取全部单选框
        let randint; // 单选偏移量
        let target; // 最终点击目标
        for (let i = 0; i < singles.length; i = i + 5) {
            randint = Math.floor(Math.random() * 2); // 随机偏移量
            target = i + randint;
            singles[target].click(); // 点击单选框
        }

        // 单选部分完成
        // 滚动到页面底部
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    }

    function checkMutis() {
        // 多选
        const mutis = document.querySelectorAll(
            '.wjtxQuestionOptionItem div[role="checkbox"]'
        ); // 获取全部多选框
        const flags = [1, 1, 1, 1];
        for (let i = 0; i < Math.floor(1 + Math.random() * 3); i++) {
            randint = Math.floor(Math.random() * 4); // 随机抽选项点
            if (flags[randint]) {
                flags[randint] = 0;
                const checkbox = mutis[randint];
                if (typeof $(checkbox).jqxCheckBox === "function") {
                    $(checkbox).jqxCheckBox("check");
                }
            }
            console.log(randint);
        }
    }

    // 主观题
    function fillText() {
        const textareas = $("textarea.jqx-text-area-element");
        textareas.each(function () {
            $(this).jqxTextArea("val", "好"); // 设置值
            let changeEvent = new Event("change", {
                bubbles: true,
                cancelable: true,
            });
            this.dispatchEvent(changeEvent);
        });
    }

    /**
     * 根据内容返回一个按钮
     * @param {string} content 按钮内容
     * @returns 按钮对象
     */
    function getBtnByContent(content) {
        return Array.from(document.querySelectorAll("button, a")).find(
            (el) => el.textContent.trim() === content
        );
    }

    /**
     * 评教一次
     */
    async function judgeOne() {
        checkSingles();
        checkMutis();
        fillText();

        getBtnByContent("提交").click();
        await sleep(CLICK_INTERVAL);
        getBtnByContent("确认").click();
    }

    async function judgeAll() {
        while (getBtnByContent("立刻评教")) {
            getBtnByContent("立刻评教").click();
            await sleep(CLICK_INTERVAL);
            await judgeOne();
            await sleep(CLICK_INTERVAL);
        }
    }

    //#endregion

    // 创建一个可拖动的控制面板
    function createControlPanel() {
        // 创建控制面板div
        const panel = document.createElement("div");
        panel.id = "control-panel";
        panel.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 5px;
        width: 250px;
        padding: 0;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 10000;
    `;

        // 创建拖动区域
        const dragHandle = document.createElement("div");
        dragHandle.style.cssText = `
        background-color: #4a4a4a;
        color: white;
        padding: 8px 12px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        font-weight: bold;
        cursor: move;
        user-select: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
        dragHandle.innerHTML = "<span>锐评连接 trashbin, 发誓要变 211</span>";

        // 创建按钮容器
        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 15px;
    `;

        // 创建judgeALL按钮
        const judgeAllBtn = document.createElement("button");
        judgeAllBtn.textContent = "自动评价所有课程";
        judgeAllBtn.style.cssText = `
        padding: 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.2s;
    `;
        judgeAllBtn.addEventListener("mouseover", () => {
            judgeAllBtn.style.backgroundColor = "#3e8e41";
        });
        judgeAllBtn.addEventListener("mouseout", () => {
            judgeAllBtn.style.backgroundColor = "#4CAF50";
        });
        judgeAllBtn.addEventListener("click", judgeAll);

        // 创建judgeOne按钮
        const judgeOneBtn = document.createElement("button");
        judgeOneBtn.textContent = "评价当前课程";
        judgeOneBtn.style.cssText = `
        padding: 10px;
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.2s;
    `;
        judgeOneBtn.addEventListener("mouseover", () => {
            judgeOneBtn.style.backgroundColor = "#0b7dda";
        });
        judgeOneBtn.addEventListener("mouseout", () => {
            judgeOneBtn.style.backgroundColor = "#2196F3";
        });
        judgeOneBtn.addEventListener("click", judgeOne);

        // 添加按钮到容器
        buttonContainer.appendChild(judgeAllBtn);
        buttonContainer.appendChild(judgeOneBtn);

        // 添加拖动区域和按钮容器到面板
        panel.appendChild(dragHandle);
        panel.appendChild(buttonContainer);

        // 添加面板到页面
        document.body.appendChild(panel);

        // 实现拖动功能（只针对拖动区域）
        makeDraggable(panel, dragHandle);
    }

    // 实现元素可拖动
    function makeDraggable(element, dragHandle) {
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

        dragHandle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 获取鼠标初始位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // 鼠标移动时调用elementDrag函数
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算新位置
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置
            element.style.top = element.offsetTop - pos2 + "px";
            element.style.left = element.offsetLeft - pos1 + "px";
        }

        function closeDragElement() {
            // 停止移动
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 初始化控制面板
    function initControlPanel() {
        // 等待页面加载完成
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", createControlPanel);
        } else {
            createControlPanel();
        }
    }

    // 调用初始化函数
    initControlPanel();
})();
