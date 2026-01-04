// ==UserScript==
// @name         227229 bot
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  很喜欢jg的一句话，明天下午东南亚单排
// @author       Reesedog
// @match        https://www.douyu.com/227229*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475997/227229%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/475997/227229%20bot.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 弹幕模板部分 ==============================================================================================================
    // 定义弹幕模板
    const templates = [
        "一直为这些五千分的细节沾沾自喜，我",
        "（不可思议）（假装自责），（自暴自弃）（切屏封人）",
        "下一个搞 吗，收到鸡哥收到",
        "第一天，第二天，第三天，4000+",
        "唔，",
        // 根据需要添加更多模板
        // todo: "(emoji+词语)x5",
    ];

    const cosplayGroups = {
        "CP组": ["烈女不怕死丶"],
        "偶像组": ["徐志雷Burning"],
        "仇人组": ["yyfyyf", "yyfyyf", "LGD_y", "LGD_Faithbian", "张宁xiao8", "Maybeee222"],
        "皮套组": ["七海nana7mi", "阿梓梓梓梓丶"],
        "mdy组：": ["ameame", "SetsuRy", "kaka胡良智", "inflame丶hyz", "ctyzzz", "September猫", "Ori曾焦阳","节奏魔王oldeLeVeN", "嘟嘟Lzk", "阿发ava", "xmxm211"],
        "永远幻念": ["幻像踩花", "AI猫雷"]
    };


    // 创建浮动窗口
    let floatWindow = document.createElement("div");
    floatWindow.style.display = "flex";
    floatWindow.style.position = "fixed";
    floatWindow.style.top = "30%";
    floatWindow.style.right = "0";
    floatWindow.style.transform = "translateY(-50%)";
    floatWindow.style.backgroundColor = "white";
    floatWindow.style.border = "1px solid black";
    floatWindow.style.padding = "10px";
    floatWindow.style.zIndex = "10000";
    floatWindow.style.flexDirection = "column"; // 添加这一行来使元素竖向排列

    document.body.appendChild(floatWindow);

    // 创建模板下拉菜单
    let templateMenu = document.createElement("select");
    templateMenu.style.width = "323px";

    // 添加模板占位符选项
    let placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "弹幕模板";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    templateMenu.appendChild(placeholderOption);

    // 添加模板选项
    templates.forEach((template) => {
        let option = document.createElement("option");
        option.value = template;
        option.textContent = template;
        templateMenu.appendChild(option);
    });

    // 创建cosplay下拉菜单
    let cosplay = document.createElement("select");
    cosplay.style.width = "323px";

    // 添加cosplay占位符选项
    let cosplayPlaceHolder = document.createElement("option");
    cosplayPlaceHolder.value = "";
    cosplayPlaceHolder.textContent = "cosplay";
    cosplayPlaceHolder.disabled = true;
    cosplayPlaceHolder.selected = true;
    cosplay.appendChild(cosplayPlaceHolder);

    // 添加分组和选项
    for (let group in cosplayGroups) {
        let optgroup = document.createElement("optgroup");
        optgroup.label = group;
        cosplayGroups[group].forEach((username) => {
            let option = document.createElement("option");
            option.value = username;
            option.textContent = username;
            optgroup.appendChild(option);
        });
        cosplay.appendChild(optgroup);
    }
    // contentContainer.appendChild(cosplay);
    // contentContainer.appendChild(templateMenu);


    // 创建输入框
    let inputField = document.createElement("textarea");
    inputField.rows = 4;
    inputField.cols = 70;

    inputField.style.width = "200px";
    // inputField.style.marginLeft = "10px";
    // contentContainer.appendChild(inputField);

    // 创建发送按钮
    let sendButton = document.createElement("button");
    sendButton.textContent = "发送";
    sendButton.style.marginLeft = "10px";
    sendButton.style.paddingLeft = "10px";
    sendButton.style.paddingRight = "10px";
    sendButton.style.border = "1px solid black";
    // contentContainer.appendChild(sendButton);

    // 创建折叠/展开按钮
    let toggleButton = document.createElement("button");
    toggleButton.textContent = "🤡";
    toggleButton.style.backgroundColor = "orange";
    toggleButton.style.border = "none";
    toggleButton.style.color = "white";
    toggleButton.style.fontSize = "16px";
    toggleButton.style.padding = "0px 10px 5px 10px";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.marginLeft = "10px";
    floatWindow.appendChild(toggleButton);

    // 定义发送弹幕的函数
    function sendDanmu(content) {
        let textarea = document.querySelector("textarea.ChatSend-txt");
        if (textarea) {
            textarea.value = content;
            textarea.focus();
            let sendButton = document.querySelector(".ChatSend-button");
            if (sendButton) {
                sendButton.click(); // 点击发送按钮提交弹幕
            }
        }
    }

    // 发送按钮点击事件
    sendButton.onclick = function () {
        if(cosplay.value!=""){
            sendDanmu("@" + cosplay.value + "：" + inputField.value);
        }else{
            sendDanmu(inputField.value);
        }
    };

    sendButton.addEventListener("click", function() {
        window.scrollTo(0, 0); // 滚动到页面顶部
    });

    // 下拉菜单变更事件
    templateMenu.onchange = function () {
        inputField.value = templateMenu.value;
    };

    // 折叠/展开按钮点击事件
    toggleButton.onclick = function () {
        if (contentContainer.style.display === "none") {
            contentContainer.style.display = "block";
            toggleButton.textContent = "×";
        } else {
            contentContainer.style.display = "none";
            toggleButton.textContent = "🤡";
        }
    };

    // 创建浮窗容器
    let contentContainer = document.createElement("div");
    contentContainer.style.paddingTop = "5px";
    contentContainer.style.display = "none";
    floatWindow.appendChild(contentContainer);

    // 创建表格
    let table = document.createElement("table");
    contentContainer.appendChild(table);

    // 创建第一行：Cosplay下拉菜单
    let row1 = document.createElement("tr");
    let cell1_1 = document.createElement("td");
    cell1_1.textContent = "Cosplay：";
    row1.appendChild(cell1_1);

    let cell1_2 = document.createElement("td");
    cell1_2.appendChild(cosplay);
    row1.appendChild(cell1_2);

    table.appendChild(row1);

    // 创建第二行：弹幕模板下拉菜单
    let row2 = document.createElement("tr");
    let cell2_1 = document.createElement("td");
    cell2_1.textContent = "弹幕模板：";
    row2.appendChild(cell2_1);

    let cell2_2 = document.createElement("td");
    cell2_2.appendChild(templateMenu);
    row2.appendChild(cell2_2);

    table.appendChild(row2);


    // 创建第三行：输入框和发送按钮
    let row3 = document.createElement("tr");

    let cell3_1 = document.createElement("td");
    cell3_1.textContent = "输入弹幕：";
    row3.appendChild(cell3_1);

    let cell3_2 = document.createElement("td");
    cell3_2.style.display = "flex";
    cell3_2.appendChild(inputField);

    inputField.style.marginRight = "10px";
    cell3_2.appendChild(sendButton);

    row3.appendChild(cell3_2);
    table.appendChild(row3);

    // 拖动逻辑
    let isDragging = false;
    let mouseDownX, mouseDownY, initX, initY;
    let mouse_throttle_flag = false;
    let mouse_throttle;

    floatWindow.onmousedown = function (e) {
        if (contentContainer.style.display === "none") {
            // 如果窗口是折叠状态，允许拖动
            isDragging = true;
            mouseDownX = e.pageX;
            mouseDownY = e.pageY;
            initX = floatWindow.offsetLeft;
            initY = floatWindow.offsetTop;

            // 禁止文本选择
            document.body.style.userSelect = "none";

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        }
    };

    function onMouseMove(e) {
        if (isDragging) {
            if (!mouse_throttle_flag) {
                mouse_throttle_flag = true;
                mouse_throttle = setTimeout(() => {
                    mouse_throttle_flag = false;
                    let mouseMoveX = e.pageX,
                        mouseMoveY = e.pageY;
                    floatWindow.style.right =
                        window.innerWidth - mouseMoveX + mouseDownX - initX - 70 + "px";
                    floatWindow.style.top = mouseMoveY - mouseDownY + initY + "px";
                    floatWindow.style.transform = "none";
                }, 5);
            }
        }
    }

    function onMouseUp() {
        isDragging = false;

        // 恢复文本选择
        document.body.style.userSelect = "";

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    // +1 部分 ==============================================================================================================
    function addButtonToContainer() {
        // 查找按钮容器
        let container = document.querySelector(".btnscontainer-4e2ed0");
        if (!container) return;

        // 检查容器中是否已经存在 +1 按钮
        if (container.querySelector(".plus-one-button")) return;

        // 创建一个分隔符
        let separator = document.createElement("p");
        separator.className = "sugun-e3fbf6";
        separator.textContent = "|";
        container.appendChild(separator);

        // 以与现有按钮相同的样式创建 +1 按钮
        let button = document.createElement("div");
        button.className = "labelfisrt-407af4 plus-one-button"; // 为 +1 按钮添加一个特定的类名
        button.textContent = "+1";
        container.appendChild(button);

        // 为 +1 按钮设置点击事件
        button.onclick = function () {
            let textContent =
                hoveredElement.querySelector(".text-edf4e7").textContent;
            sendDanmu(textContent);
        };

        button.addEventListener("click", function() {
            window.scrollTo(0, 0); // 滚动到页面顶部
        });
    }

    let hoveredElement = null;

    // 当鼠标悬停在具有特定类的元素上时，显示 +1 按钮
    document.addEventListener("mouseover", function (event) {
        // 检查容器中是否已经存在 +1 按钮，防止hoverElement不一致
        let container = document.querySelector(".btnscontainer-4e2ed0");
        if (!container) return;
        if (container.querySelector(".plus-one-button")) return;

        if (event.target.classList.contains("danmuItem-f8e204")) {
            hoveredElement = event.target;
            addButtonToContainer();
        }
    });

    // 防复读部分 ==============================================================================================================
    // 创建一个数组用于维护弹幕的顺序
    const danmuArray = [];

    // 初始化弹幕屏蔽状态
    let blockDanmu = false;

    // 创建按钮
    const button = document.createElement("div");
    button.style.position = "fixed";
    button.style.right = "0";
    button.style.bottom = "40%";
    button.style.backgroundColor = "orange";
    button.style.padding = "10px";
    button.style.cursor = "pointer";
    button.style.zIndex = "10000";
    button.textContent = "屏蔽复读";
    document.body.appendChild(button);

    // 为按钮添加点击事件监听器
    button.addEventListener("click", () => {
        blockDanmu = !blockDanmu;
        button.textContent = blockDanmu ? "开启复读" : "屏蔽复读";
    });

    // 定义一个函数，用于开始观察弹幕容器
    function observeDanmuContainer() {
        const danmuContainer = document.querySelector(".comment-37342a");
        if (danmuContainer) {
            // 创建 MutationObserver 实例，用于观察弹幕容器的变化
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const textElement = node.querySelector(".text-edf4e7");
                            if (textElement) {
                                const danmuText = textElement.textContent;
                                if (blockDanmu && danmuArray.includes(danmuText)) {
                                    // 如果弹幕已经出现过，则隐藏该弹幕
                                    node.style.display = "none";
                                } else {
                                    // 如果 danmuArray 的长度达到了 50，则删除最旧的弹幕
                                    if (danmuArray.length >= 50) {
                                        danmuArray.shift();
                                    }
                                    // 将新弹幕添加到数组中
                                    danmuArray.push(danmuText);
                                }
                            }
                        }
                    });
                });
            });

            // 配置观察器选项
            const config = { childList: true, subtree: true, attributes: true };

            // 开始观察弹幕容器
            observer.observe(danmuContainer, config);

            // 清除定时器，停止尝试观察
            clearInterval(intervalId);
        }
    }

    // 每隔一秒尝试开始观察弹幕容器
    const intervalId = setInterval(observeDanmuContainer, 1000);

    // 折跃部分 ==============================================================================================================

    // 创建折跃按钮
    const tpButton = document.createElement("div");
    tpButton.style.position = "fixed";
    tpButton.style.right = "0";
    tpButton.style.bottom = "33%";
    tpButton.style.backgroundColor = "orange";
    tpButton.style.padding = "10px";
    tpButton.style.cursor = "pointer";
    tpButton.style.zIndex = "10000";
    tpButton.textContent = "下播折跃";
    document.body.appendChild(tpButton);

    // 发送弹幕，和主播说一声再见
    tpButton.addEventListener("click", () => {
        sendDanmu("下播4000+");
    });

    // 转到白石直播间，听鸡哥RPG求饶
    tpButton.addEventListener("click", function() {
        setTimeout(function() {
            window.location.href = "https://live.bilibili.com/859376";
        }, 500);
    });

})();