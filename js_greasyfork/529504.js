// ==UserScript==
// @name         微信读书自动翻滚
// @namespace    http://tampermonkey.net/
// @version      20250311
// @description  操作手册：①空格启停滚动；②A减速，D加速；③点击重置恢复速度为“2”。基于@yuankaiyu “微信懒人翻书”制作，修改内容：①使用新的滚动逻辑，可以在自动翻滚的同时手动翻滚；②调整操作台样式，新增交互效果；③新增速度记忆功能。
// @author       EuSky
// @match        https://weread.qq.com/web/reader/*
// @icon         https://weread.qq.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/529504/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E8%87%AA%E5%8A%A8%E7%BF%BB%E6%BB%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/529504/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E8%87%AA%E5%8A%A8%E7%BF%BB%E6%BB%9A.meta.js
// ==/UserScript==

const primaryColor = "linear-gradient(45deg, rgb(44, 106, 255),rgb(48, 173, 254))";

// 创建带样式的按钮（新增美化样式）
const createBtn = (innerText, id, style, fn) => {
    const btn = document.createElement("button");
    btn.innerText = innerText;
    btn.id = id;
    // 样式优化：圆形按钮/悬停效果/居中
    btn.style.cssText = `
        margin: 0 3px;
        cursor: pointer;
        color: white;
        background: transparent;
        border: none;
        font-size: 16px;
        line-height: 1;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        transition: all 0.2s;
    `;
    // 交互效果：悬停和点击动画
    btn.addEventListener('mouseover', () => btn.style.background = 'rgba(255,255,255,0.1)');
    btn.addEventListener('mouseout', () => btn.style.background = 'transparent');
    btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.9)');
    btn.addEventListener('mouseup', () => btn.style.transform = 'scale(1)');
    btn.addEventListener('click', fn);
    return btn;
};

// 在加减速函数中限制最小值
const minSpeed = 1.1;

const minus = (speedEle) => {
    let speed = +speedEle.innerText;
    speed = Math.max(minSpeed, speed - 0.1);
    speedEle.innerText = speed.toFixed(1);
    GM_setValue("speed", speed);
};

const add = (speedEle) => {
    let speed = +speedEle.innerText;
    speed += 0.1;
    speedEle.innerText = speed.toFixed(1);
    GM_setValue("speed", speed);
};

(function () {
    "use strict";
    // 创建主容器（样式优化：阴影/圆角/最小宽度）
    const createBox = () => {
        const box = document.createElement("div");
        box.style.cssText = `
            position: fixed;
            top: 20px;
            left: 100px;
            font-size: 16px;
            background: ${primaryColor};
            padding: 4px 0;
            border-radius: 8px;
            box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.4);
            cursor: grab;
            color: white;
            min-width: 100px;
            display: flex;
            flex-direction: column;
            align-items: center;
        `;
        return box;
    };

    // 创建翻书按钮（居中对齐）
    const createHeader = () => {
        const divEle = document.createElement("div");
        divEle.style.cssText = `
            cursor: pointer;
            width: 50%;
            font-size: 16px;
            text-align: center;
            padding: 2px 0;
            transition: background 0.2s;
            border-radius: 4px;
        `;
        divEle.textContent = "翻书";
        // 翻书按钮交互效果
        divEle.addEventListener('mouseover', () => divEle.style.background = 'rgba(255,255,255,0.1)');
        divEle.addEventListener('mouseout', () => divEle.style.background = 'transparent');
        divEle.addEventListener("click", scrollAuto);
        return divEle;
    };

    const box = createBox();
    const header = createHeader();
    box.appendChild(header);

    // 创建内容区域（Flex纵向布局）
    const createContentArea = () => {
        const div = document.createElement("div");
        div.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 4px 6px;
        `;
        return div;
    };

    const contentArea = createContentArea();
    box.appendChild(contentArea);

    // 创建速度控制器（水平居中布局）
    const createSpeedController = () => {
        const speedController = document.createElement("div");
        speedController.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 2px 0;
        `;

        const speedEle = document.createElement("div");
        speedEle.id = "speed";
        const initialSpeed = GM_getValue("speed", 2).toFixed(1);
        speedEle.textContent = initialSpeed;
        // 速度显示样式优化
        speedEle.style.cssText = `
            width: 20px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            margin: 0 6px;
            letter-spacing: -1px; // 补偿字体间距
            transform: translateX(-0px); // 微调位置
        `;

        speedController.appendChild(createBtn("-", "minusBtn", "", () => minus(speedEle)));
        speedController.appendChild(speedEle);
        speedController.appendChild(createBtn("+", "addBtn", "", () => add(speedEle)));
        return { speedEle, speedController };
    };

    const { speedEle, speedController } = createSpeedController();
    contentArea.appendChild(speedController);

    // 创建重置按钮（全宽居中样式）
    const hint1 = document.createElement("div");
    hint1.textContent = "重置";
    hint1.style.cssText = `
        cursor: pointer;
        width: 54%;
        text-align: center;
        padding: 2px 0;
        font-size: 16px;
        transition: background 0.2s;
        border-radius: 4px;
    `;
    // 重置按钮交互效果
    hint1.addEventListener('mouseover', () => hint1.style.background = 'rgba(255,255,255,0.1)');
    hint1.addEventListener('mouseout', () => hint1.style.background = 'transparent');
    hint1.addEventListener('click', () => {
        speedEle.innerText = '2.0';
        GM_setValue("speed", 2);
    });
    contentArea.appendChild(hint1);

    document.body.appendChild(box);

    // 自动滚动控制逻辑
    let animationFrameId;
    let fractionalY = 0;

    // 核心滚动逻辑
    function scrollAuto() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        } else {
            animationFrameId = requestAnimationFrame(smoothScroll);
        }
    }

    function smoothScroll() {
        if (isScrolledToBottom()) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            fractionalY = 0;
            return;
        }

        const scrollDistance = +speedEle.innerText;
        fractionalY += scrollDistance;

        const delta = Math.floor(fractionalY);
        if (delta !== 0) {
            window.scrollBy(0, delta);
            fractionalY -= delta;
        }

        animationFrameId = requestAnimationFrame(smoothScroll);
    }

    function isScrolledToBottom() {
        return window.scrollY + window.innerHeight >= document.body.scrollHeight - 5;
    }

    // 事件监听器（保留原有功能）
    document.addEventListener("keydown", function (event) {
        // 空格键控制启停
        if (event.key === " " || event.keyCode === 32) {
            event.preventDefault();
            scrollAuto();
        }
        // A/D 键控制速度
        if (event.key === "d" || event.key === "D") add(speedEle);
        if (event.key === "a" || event.key === "A") minus(speedEle);
    });

    // 拖拽功能（保留原有实现）
    const dragHandle = () => {
        const draggable = box;
        let offsetX, offsetY, drag = false;
        draggable.onmousedown = (e) => {
            offsetX = e.clientX - draggable.getBoundingClientRect().left;
            offsetY = e.clientY - draggable.getBoundingClientRect().top;
            drag = true;
        };
        document.onmousemove = (e) => {
            if (drag) {
                draggable.style.left = `${e.clientX - offsetX}px`;
                draggable.style.top = `${e.clientY - offsetY}px`;
            }
        };
        document.onmouseup = () => drag = false;
    };
    dragHandle();
})();