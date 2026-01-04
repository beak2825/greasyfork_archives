// ==UserScript==
// @name         微信懒人翻书
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  实现微信读书自动翻书功能
// @author       yuankaiyu
// @match        https://weread.qq.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492212/%E5%BE%AE%E4%BF%A1%E6%87%92%E4%BA%BA%E7%BF%BB%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/492212/%E5%BE%AE%E4%BF%A1%E6%87%92%E4%BA%BA%E7%BF%BB%E4%B9%A6.meta.js
// ==/UserScript==

const primaryColor =
      "linear-gradient(45deg, rgb(44, 106, 255),rgb(48, 173, 254))";

const createBtn = (innerText, id, style, fn) => {
    const btn = document.createElement("button");
    btn.innerText = innerText;
    btn.id = id;
    btn.style.marginRight = "5px";
    btn.style.cursor = "pointer";
    btn.style.color = "white";
    btn.style.backgroundColor = "transparent";
    btn.style.border = "none";
    btn.style.fontSize = "18px";
    btn.style.lineHeight = "18px";
    btn.addEventListener("click", function (event) {
        fn();
    });
    return btn;
};

const minus = (speedEle) => {
    let speed = +speedEle.innerText;
    speed -= 0.1;
    speed = Math.round(speed * 100) / 100;
    speedEle.innerText = speed;
};

const add = (speedEle) => {
    let speed = +speedEle.innerText;
    speed += 0.1;
    speed = Math.round(speed * 100) / 100;
    speedEle.innerText = speed;
};

(function () {
    "use strict";
    const createBox = () => {
        const box = document.createElement("div");
        box.style.position = "fixed";
        box.style.top = "24px";
        box.style.left = "100px";
        box.style.fontSize = "16px";
        box.style.background = primaryColor;
        box.style.padding = "10px";
        box.style.borderRadius = "5px";
        box.style.boxShadow = "4px 4px 20px rgba(0, 0, 0, 0.4)";
        box.style.cursor = "grab";
        box.style.color = "white";
        return box;
    };
    const createHeader = () => {
        const divEle = document.createElement("div");
        divEle.style.fontSize = "18px";
        divEle.style.fontWeight = "bold";
        var titleNode = document.createTextNode("懒人翻书");
        divEle.appendChild(titleNode);
        divEle.addEventListener("click", function (event) {
            scrollAuto();
        });
        divEle.onclick = "scrollAuto()";
        return divEle;
    };
    const box = createBox();
    const header = createHeader();
    box.appendChild(header);
    const createContentArea = () => {
        const div = document.createElement("div");
        div.style.cssText =
            "display: flex; flex-direction: column; align-items: flex-start; align-content: flex-start; padding-top: 10px;";
        return div;
    };
    const contentArea = createContentArea();
    box.appendChild(contentArea);
    const createSpeedController = () => {
        const speedController = document.createElement("div");
        speedController.id = "speedController";

        const speedEle = document.createElement("span");
        speedEle.id = "speed";
        speedEle.innerText = "0.5";
        speedEle.style.cssText =
            "display: inline-block; width: 26px; text-align: center;";
        const minusBtn = createBtn("-", "minusBtn", "", () => minus(speedEle));
        const addBtn = createBtn("+", "addBtn", "", () => add(speedEle));
        speedController.appendChild(minusBtn);
        speedController.appendChild(speedEle);
        speedController.appendChild(addBtn);
        return { speedEle, speedController };
    };
    const { speedEle, speedController } = createSpeedController();
    contentArea.appendChild(speedController);

    const hint1 = document.createElement("div");
    hint1.innerText = "Min 0.1";
    hint1.style.cursor = "pointer";
    hint1.addEventListener("click", function (event) {
        speedEle.innerText = 0.1;
    });
    const hint2 = document.createElement("div");
    hint2.innerText = "Max 2";
    hint2.style.cursor = "pointer";
    hint2.addEventListener("click", function (event) {
        speedEle.innerText = 2;
    });
    contentArea.appendChild(hint1);
    contentArea.appendChild(hint2);
    document.body.appendChild(box);
    let animationFrameId;
    let scrollPosition = 0;
    // 为元素添加keydown事件监听器
    document.addEventListener("keydown", function (event) {
        // 检查按下的键是否是空格键
        if (event.key === " " || event.keyCode === 32) {
            event.preventDefault();
            scrollAuto();
        }
    });

    function scrollAuto() {
        const scrollDistance = +speedEle.innerText; // 每次滚动的距离
        const renderTargetContainer = document.querySelector(
            ".renderTargetContainer"
        );
        scrollPosition = window.scrollY;
        async function smoothScroll() {
            cancelAnimationFrame(animationFrameId);
            scrollPosition += scrollDistance;
            window.scrollTo(0, scrollPosition);
            // 当你想要停止滚动时，清除这个间隔
            if (isScrolledToBottom()) {
                console.log("滚动到底部了");
                // cancelAnimationFrame(animationFrameId);
                scrollPosition = 0
                // 模拟按下右方向键
                function simulateRightArrowKeyPress() {
                    // 创建一个键盘事件
                    var event = new KeyboardEvent('keydown', {
                        bubbles: true, // 是否冒泡
                        cancelable: true, // 是否可以取消
                        key: 'ArrowRight', // 键名
                        code: 'ArrowRight', // 键的代码
                        keyCode: 39, // 按键的keyCode值（非标准，但为了兼容旧浏览器）
                        which: 39 // 按键的which值
                    });

                    // 派发事件到document，模拟按键
                    document.dispatchEvent(event);
                }

                // 调用函数模拟按下右方向键
                simulateRightArrowKeyPress();
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve()
                    }, 2000)
                })
                // return;
            }
            animationFrameId = requestAnimationFrame(smoothScroll);
        }
        // 空格键被按下，执行相应的操作
        if (animationFrameId) {
            console.log("清除");
            animationFrameId = cancelAnimationFrame(animationFrameId);
        } else {
            // 在这里你可以添加你想要执行的代码
            animationFrameId = requestAnimationFrame(smoothScroll);
        }
    }
    function isScrolledToBottom() {
        return window.scrollY + window.innerHeight >= document.body.scrollHeight-5;
    }

    // 键盘按下加减键
    document.addEventListener("keydown", function (event) {
        // 检查按下的键的键码
        if (event.key === "+") {
            console.log("加号键被按下");
            add(speedEle);
            // 这里可以添加加号键的响应逻辑
        } else if (event.key === "-") {
            console.log("减号键被按下");
            minus(speedEle);
            // 这里可以添加减号键的响应逻辑
        }
    });

    // 给组件增加拖拽功能
    const dragHandle = () => {
        const draggable = box;
        let offsetX,
            offsetY,
            drag = false;
        draggable.onmousedown = function (e) {
            offsetX = e.clientX - draggable.getBoundingClientRect().left;
            offsetY = e.clientY - draggable.getBoundingClientRect().top;
            drag = true;
        };
        document.onmousemove = function (e) {
            if (drag) {
                draggable.style.left = e.clientX - offsetX + "px";
                draggable.style.top = e.clientY - offsetY + "px";
            }
        };
        document.onmouseup = function () {
            drag = false;
        };
    };
    dragHandle();
    // Your code here...
})();
