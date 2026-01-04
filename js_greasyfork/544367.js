// ==UserScript==
// @name         ykd专注模式
// @version      2.1
// @description  专注模式
// @author       liuminghao123
// @match        https://learn.youkeda.com/*
// @icon         https://apps.youkeda.com/favicon.ico
// @namespace https://greasyfork.org/users/1337323
// @downloadURL https://update.greasyfork.org/scripts/544367/ykd%E4%B8%93%E6%B3%A8%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/544367/ykd%E4%B8%93%E6%B3%A8%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const style = document.createElement('style');
    document.head.appendChild(style);
    const sheet = style.sheet;
    const rule1 = '.hover-red:hover { color: #029f6a; font-weight: 900 }';
    const rule2 = '.hover-red:active { background-color: rgb(234,234,234) }';
    sheet.insertRule(rule1, 0);
    sheet.insertRule(rule2, 1);

    let isClickAttention = false;
    let dragIntervalControl = null;
    let dragTimeOutControl = null;
    let attentionDOM = document.createElement("li");
    let recoveryDOM = document.createElement("li");
    let dragDOM = document.createElement("div");
    let listDOM = null;
    let mediumDOM = null;
    let mediumWidth = 560;
    let dragLeft = innerWidth * 1.0 / 2 + 275;
    let serverStartDOM = null;
    let dadDOM = null;
    let videoMTKDOM = null;
    let zoomInOrOutBtn = null;
    let videoDOM = null;
    let lastInnerWidth = innerWidth;

    dragDOM.style.position = "absolute";
    dragDOM.style.height = "100vh"
    dragDOM.style.left = dragLeft + "px"
    dragDOM.style.width = "10px";
    //dragDOM.style.backgroundColor = "rgba(42, 165, 116, 0.295)";
    dragDOM.style.pointerEvents = 'none'

    const localStorageMediumWidth = localStorage.getItem('mediumWidth');
    if (localStorageMediumWidth) {
        mediumWidth = parseInt(localStorageMediumWidth);  // 如果有保存的宽度值，使用它
        dragLeft = mediumWidth * 1.0 / 2 - 5 + innerWidth * 1.0 / 2;
        dragDOM.style.left = dragLeft + "px"
    }

    attentionDOM.classList.add("list-none", "select-none", "w-full", "flex", "flex-col", "items-center", "justify-center", "relative", "mb-1", "cursor-pointer");
    attentionDOM.style.height = "59px";
    attentionDOM.innerHTML = `<img src="https://assets.programcx.cn/lmh/attention.png" alt class="mb-1w-5" style="width:20px;height:20px;margin:0 0 4px"><span>专注</span>`;

    recoveryDOM.classList.add("list-none", "select-none", "w-full", "flex", "flex-col", "items-center", "justify-center", "relative", "mb-1", "cursor-pointer", "hover-red");
    recoveryDOM.style.height = "59px";
    recoveryDOM.innerHTML = `<img src="https://assets.programcx.cn/lmh/recovery.png" alt class="mb-1w-5" style="width:20px;height:20px;margin:0 0 4px"><span>恢复</span>`;


    let intervalId = setInterval(() => {
        listDOM = document.querySelector(".flex-none.flex.flex-col.items-center.bg-gray-50.text-sm.relative.z-30");
        serverStartDOM = document.querySelector(".max-w-md.w-full.bg-white.shadow-lg.rounded-lg.pointer-events-auto.flex.ring-1.ring-black.ring-opacity-5");

        if (listDOM) {
            videoDOM = document.querySelector(".relative.bg-white.px-4.pt-6.rounded-lg.shadow-lg.flex.flex-col.items-center.justify-center");

            videoMTKDOM = document.querySelector(".transform.z-50.absolute.left-0.top-0.bottom-0.bg-black.bg-opacity-30.flex.items-center.justify-center")
            videoMTKDOM.style.position = "fixed";
            videoMTKDOM.style.width = "100vw";

            zoomInOrOutBtn = document.querySelector(".text-blue-400.m-2");
            // 如果元素存在，执行操作
            zoomInOrOutBtn.addEventListener("click", () => {
                videoMTKDOM = document.querySelector(".transform.z-50.absolute.left-0.top-0.bottom-0.bg-black.bg-opacity-30.flex.items-center.justify-center");
                videoMTKDOM.style.position = "fixed";
                videoMTKDOM.style.width = "100vw";

                if (videoMTKDOM.innerHTML.slice(-14, -10) === "放大播放") {
                    videoDOM.style.width = "45%";
                } else {
                    videoDOM.style.width = "95%";
                }
            })

            listDOM.style.height = "100vh";
            listDOM.insertBefore(recoveryDOM, listDOM.firstChild.nextSibling);
            listDOM.insertBefore(attentionDOM, recoveryDOM);

            recoveryDOM.style.display = "none";

            dadDOM = document.querySelector(".w-full.h-full.flex.relative");
            dadDOM.style.display = 'flex';
            dadDOM.style.justifyContent = "center";

            mediumDOM = document.querySelector(".flex-none.bg-white.flex.flex-col.transition-all.doc-content")

            mediumDOM.style.position = "relative";
            mediumDOM.style.width = "560px";
            mediumDOM.style.margin = "0"

            mediumDOM.insertAdjacentElement("afterend", dragDOM)

            serverStartDOM = document.querySelector(".max-w-md.w-full.bg-white.shadow-lg.rounded-lg.pointer-events-auto.flex.ring-1.ring-black.ring-opacity-5");

            listDOM.addEventListener('mousemove', (e) => {
                if (isClickAttention === false) {
                    return;
                }
                const mouseY = e.clientY;
                // 如果鼠标距离浏览器左侧小于等于50px，并且距离浏览器下侧大于等于60px时则显示 listDOM，否则隐藏
                if (mouseY <= document.body.clientHeight - 60 && videoMTKDOM.style.display === "none") {
                    listDOM.style.opacity = "1";
                } else {
                    listDOM.style.opacity = "0";
                }
            });

            listDOM.addEventListener("mouseleave", () => {
                ////console.log("123123123123123")
                if (isClickAttention === false) {
                    return;
                }
                listDOM.style.opacity = "0";
            })

            // 执行完后清除 interval
            clearInterval(intervalId);
        }
    }, 20) // 每 20 毫秒检查一次

    attentionDOM.addEventListener("click", () => {
        if (isClickAttention === false) {
            mediumDOM.style.border = "1px solid #c6c6c6"
            clickAttentionFn();
        } else {
            mediumDOM.style.border = "0"
            notClickAttentionFn();
        }
        isClickAttention = !isClickAttention;

    });

    recoveryDOM.addEventListener("click", () => {
        mediumDOM.style.width = "560px";
        if (dragIntervalControl !== null) {
            clearInterval(dragIntervalControl);
            dragIntervalControl = null;
            ////console.log("定时器已停止");
        }
        dragDOM.style.left = "calc(50vw + 275px)";
        localStorage.setItem("mediumWidth", 560)
    })

    let isResizing = false;

    document.addEventListener("mouseup", () => {
        isResizing = false;
        document.body.style.cursor = "default";
        document.body.style.userSelect = "";

    })

    function clickAttentionFn() {
        recoveryDOM.style.display = "flex";

        dadDOM.style.background = "#000";

        serverStartDOM.style.visibility = "hidden";

        dragDOM.style.cursor = "ew-resize";
        dragDOM.style.pointerEvents = 'auto';

        listDOM.style.position = "absolute";
        listDOM.style.left = "0";

        attentionDOM.style.background = "rgb(234,234,234)";
        attentionDOM.style.fontWeight = "900";
        attentionDOM.style.color = "red";
        if (listDOM) {
            // 获取所有子元素
            let children = listDOM.children;

            // 遍历并设置第 4, 5, 6, 7, 8 个子元素的 cursor 样式
            for (let i = 3; i <= 7; i++) {
                if (children[i]) {
                    children[i].style.display = "none";
                }
            }
        }
        let rightDOM = document.querySelector(".w-full.h-full.flex-1.coder.relative");
        rightDOM.style.display = "none";
        let mediumDOM = document.querySelector(".flex-none.bg-white.flex.flex-col.transition-all.doc-content");
        mediumDOM.style.width = mediumWidth + "px";

        //以下为新增功能！！！！！！！！！
        let isDragging = false;
        let isDraggingDragDOM = false;
        let offsetX = 0;
        let offsetY = 0;

        // 监听鼠标按下事件
        dragDOM.addEventListener("mousedown", (e) => {
            isDragging = true;
            isDraggingDragDOM = true;
            // 记录鼠标点击位置相对于 div 的偏移量
            offsetX = e.clientX - dragDOM.getBoundingClientRect().left;
            offsetY = e.clientY - dragDOM.getBoundingClientRect().top;

            // 禁止文本选择，避免拖动时文本被选中
            document.body.style.userSelect = "none";

            if (dragTimeOutControl !== null) {
                clearTimeout(dragTimeOutControl)
            }

            if (dragIntervalControl === null) {
                dragIntervalControl = setInterval(() => {
                    // 获取 mediumDOM 的当前宽度并将其转换为数字
                    mediumDOM.style.width = Math.floor(Math.abs(parseFloat(mediumDOM.style.width.slice(0, -2)) + (dragDOM.getBoundingClientRect().left - (mediumDOM.getBoundingClientRect().left + parseFloat(mediumDOM.style.width.slice(0, -2)))) * 2) + 10 + 0.5) + "px"
                    //console.log("定时器工作中...");
                    //console.log(mediumDOM.style.width)
                }, 100);
            }

        });

        // 监听鼠标移动事件
        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                // 计算新的 div 位置
                let newX = e.clientX - offsetX;

                document.body.style.cursor = "ew-resize"

                // 限制拖动范围，仅能在屏幕右侧移动
                if (newX < innerWidth / 2 + 275) {
                    newX = innerWidth / 2 + 275;  // 限制左边界
                }

                // 更新 div 位置
                dragDOM.style.left = newX + "px";

                if (dragTimeOutControl !== null) {
                    clearTimeout(dragTimeOutControl)
                }

                if (dragIntervalControl === null) {
                    dragIntervalControl = setInterval(() => {
                        // 获取 mediumDOM 的当前宽度并将其转换为数字
                        mediumDOM.style.width = Math.floor(Math.abs(parseFloat(mediumDOM.style.width.slice(0, -2)) + (dragDOM.getBoundingClientRect().left - (mediumDOM.getBoundingClientRect().left + parseFloat(mediumDOM.style.width.slice(0, -2)))) * 2) + 10 + 0.5) + "px"
                        //console.log("定时器工作中...");
                        //console.log(mediumDOM.style.width)
                    }, 100);
                }
            }
        });

        // 监听鼠标松开事件
        document.addEventListener("mouseup", () => {
            isDragging = false;
            document.body.style.cursor = "default";
            document.body.style.userSelect = "";  // 恢复文本选择

            if (isClickAttention === false) {
                return;
            }

            if (isDraggingDragDOM === false) {
                return;
            }
            isDraggingDragDOM = false;

            localStorage.setItem("mediumWidth", parseInt((parseFloat(dragDOM.style.left.slice(0, -2)) + 5 - innerWidth * 1.0 / 2) * 2 +0.5))

            if (dragTimeOutControl !== null) {
                clearTimeout(dragTimeOutControl)
            }

            if (dragIntervalControl === null) {
                dragIntervalControl = setInterval(() => {

                    // 获取 mediumDOM 的当前宽度并将其转换为数字
                    mediumDOM.style.width = Math.floor(Math.abs(parseFloat(mediumDOM.style.width.slice(0, -2)) + (dragDOM.getBoundingClientRect().left - (mediumDOM.getBoundingClientRect().left + parseFloat(mediumDOM.style.width.slice(0, -2)))) * 2) + 10 + 0.5) + "px"
                    //console.log("定时器工作中...");
                    //console.log(mediumDOM.style.width)
                }, 100);
            }

            dragTimeOutControl = setTimeout(() => {
                if (dragIntervalControl !== null) {
                    clearInterval(dragIntervalControl);
                    dragIntervalControl = null;
                    //console.log("定时器已停止");
                }
            }, 1500)


        });
    }

    function notClickAttentionFn() {
        if (dragIntervalControl !== null) {
            clearInterval(dragIntervalControl);
            dragIntervalControl = null;
            //console.log("定时器已停止");
        }

        recoveryDOM.style.display = "none";

        serverStartDOM.style.visibility = "visible";

        mediumWidth = mediumDOM.offsetWidth + parseFloat(window.getComputedStyle(mediumDOM).marginLeft) + parseFloat(window.getComputedStyle(mediumDOM).marginRight);

        dragDOM.style.cursor = "default";
        dragDOM.style.pointerEvents = 'none'

        listDOM.style.position = "relative"

        attentionDOM.style.background = "rgb(249, 250, 251)";
        attentionDOM.style.fontWeight = "500";
        attentionDOM.style.color = "#000";
        if (listDOM) {
            // 获取所有子元素
            let children = listDOM.children;

            // 遍历并设置第  4, 5, 6, 7, 8 的子元素的 cursor 样式
            for (let i = 3; i <= 7; i++) {
                if (children[i]) {
                    children[i].style.display = "flex";
                }
            }
        }

        let rightDOM = document.querySelector(".w-full.h-full.flex-1.coder.relative");

        rightDOM.style.display = "block";

        mediumDOM.style.width = "560px"
    }

    window.addEventListener("resize", function () {
        dragDOM.style.left = parseFloat(dragDOM.style.left.slice(0, -2)) + (innerWidth - lastInnerWidth) * 1.0 / 2 + "px";
        lastInnerWidth = innerWidth;
    });

})();