// ==UserScript==
// @name         N诺错题本刷题
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.4.4
// @description  Navigate through error list with floating panel, keyboard shortcuts, auto-navigation, and error list update notifications
// @author       You
// @match        https://noobdream.com/Practice/*
// @resource      noobdream-errorlist https://noobdream.com/Practice/pro_err_list/
// @grant        GM_getResourceText
// @grant GM_setValue
// @grant GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541864/N%E8%AF%BA%E9%94%99%E9%A2%98%E6%9C%AC%E5%88%B7%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/541864/N%E8%AF%BA%E9%94%99%E9%A2%98%E6%9C%AC%E5%88%B7%E9%A2%98.meta.js
// ==/UserScript==


//this is a userscript for tampermonkey
//it will run on the page https://noobdream.com/Practice/error_list/*

(function () {
    "use strict";
    // 使用正确的变量声明
    const translate = {
        数据结构: "datastruct",
        操作系统: "system",
        计算机网络: "network",
        计算机组成原理: "organization",
    };

    const myHeaders = ()=>{
        var myHeader = new Headers();
        myHeader.append(
            "Cookie",
            //   "csrftoken=kSI1aO9DwC2H6YDRwvyfjluYPJnyC1ByoPIRXBrFyaFX0b4MggnLUD6xjb4zQksf"
            //get cookie "csrftoken" from current page
            "csrftoken=" +
            document.cookie
            .split("; ")
            .find((row) => row.startsWith("csrftoken="))
            .split("=")[1]
        );
        return myHeader;
    }


    const shuffle = (array, seed) => {
        let currentIndex = array.length, temporaryValue, randomIndex;
        seed = seed || 1;
        let random = function() {
            var x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    const refresh_tuples = () => {
        const pro_error_list = new DOMParser().parseFromString(
            GM_getResourceText("noobdream-errorlist"),
            "text/html"
        );
        if (!pro_error_list) return;

        // Get all elements with class "tag" inside the container
        const tags = Array.from(pro_error_list.querySelectorAll(".tag"));

        // Collect tuples
        const tuples = [];
        for (let i = 0; i < tags.length; i += 3) {
            if (tags[i] && tags[i + 1]) {
                const problem_id = tags[i].textContent.trim();
                const problem_class = tags[i + 1].textContent.trim();
                tuples.push([problem_id, translate[problem_class]]);
            }
        }

        return shuffle(tuples,tuples.legth);
    };

    // 获取题目列表
    const tuples = refresh_tuples() || [];

    // 检查错题本是否有更新
    const currentErrorCount = tuples.length;
    const cachedErrorCount = GM_getValue("error_table_ver", -1);
    const hasUpdates =
          cachedErrorCount !== -1 && cachedErrorCount !== currentErrorCount;

    // 如果是首次使用，初始化错题数量缓存
    if (cachedErrorCount === -1) {
        GM_setValue("error_table_ver", currentErrorCount);
    }

    // 获取当前题目和索引
    let current = GM_getValue("current_error_id", tuples[0] || ["", ""]);
    let current_index = tuples.findIndex(
        (tuple) => tuple[0] === current[0] && tuple[1] === current[1]
    );

    // 如果找不到当前题目，重置为第一个
    if (current_index === -1 && tuples.length > 0) {
        current_index = 0;
        current = tuples[0];
        GM_setValue("current_error_id", current);
    }

    // 用于存储跳转链接
    let gotopage = "#";

    // 创建控制面板 - 移动到右下角
    const controlPanel = document.createElement("div");
    controlPanel.style.position = "fixed";
    controlPanel.style.bottom = "20px"; // 改为底部定位
    controlPanel.style.left = "20px";
    controlPanel.style.backgroundColor = "white";
    controlPanel.style.padding = "12px";
    controlPanel.style.border = "1px solid #ccc";
    controlPanel.style.zIndex = "1000";
    controlPanel.style.fontSize = "14px";
    controlPanel.style.fontFamily = "Arial, sans-serif";
    controlPanel.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    controlPanel.style.borderRadius = "8px";
    controlPanel.style.display = "flex";
    controlPanel.style.flexDirection = "column";
    controlPanel.style.alignItems = "center";
    controlPanel.style.gap = "8px";
    controlPanel.style.minWidth = "200px";
    controlPanel.style.opacity = "0.9";
    controlPanel.style.transition = "opacity 0.3s";

    // 鼠标悬停时增加不透明度
    controlPanel.addEventListener("mouseenter", () => {
        controlPanel.style.opacity = "1";
    });

    controlPanel.addEventListener("mouseleave", () => {
        controlPanel.style.opacity = "0.9";
    });
    // 创建按钮样式函数
    const styleButton = (button) => {
        button.style.padding = "6px 12px";
        button.style.cursor = "pointer";
        button.style.backgroundColor = "#f0f0f0";
        button.style.border = "1px solid #ccc";
        button.style.borderRadius = "4px";
        button.style.margin = "0 4px";
        button.style.transition = "background-color 0.2s";
        button.addEventListener("mouseenter", () => {
            button.style.backgroundColor = "#e0e0e0";
        });
        button.addEventListener("mouseleave", () => {
            button.style.backgroundColor = "#f0f0f0";
        });
        return button;
    };

    // 创建当前题目显示
    const currentDisplay = document.createElement("div");
    currentDisplay.textContent =
        tuples.length > 0
        ? `Current: ${current[0]} (${current[1]})`
      : "No problems found";
    currentDisplay.style.margin = "8px 0";
    currentDisplay.style.fontWeight = "bold";
    currentDisplay.style.textAlign = "center";
    currentDisplay.style.width = "100%";

    // 创建剩余题目显示
    const remainDisplay = document.createElement("div");
    remainDisplay.textContent =
        tuples.length > 0
        ? `Remain: ${tuples.length - current_index - 1}`
      : "No problems";
    remainDisplay.style.margin = "5px 0";
    remainDisplay.style.fontSize = "12px";
    remainDisplay.style.color = "#666";

    // 更新显示函数
    const updateDisplay = (autoNavigate = false) => {
        if (tuples.length === 0) return;

        fetch(
            `https://noobdream.com/Practice/${
        tuples[current_index][1]
            }/?keyname=${tuples[current_index][0].replace("P", "")}`,
            {
                method: "GET",
                headers: myHeaders(),
                redirect: "follow",
            }
        )
            .then((response) => response.text())
            .then((text) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            var link = doc.querySelector(
                "body > div:nth-child(2) > div:nth-child(9) > div.OjInfo > div > div:nth-child(3) > a"
            );

            if (!link) {
                //link=text.search(/Practice\/article\/121\/)
                var reg = /\/Practice\/article\/\d+/
                //var reg = /\d+/
                link = reg.exec(text)[0].trim()
                gotopage=link
                if(!link){
                    alert("Link not found in the fetched page.\n"+link );
                    currentDisplay.textContent = `Error: ${current[0]} (${current[1]})`;
                    currentDisplay.style.color = "red";
                    return;
                }
            }else{
            gotopage = link ? link.href : "#";
            }

            // 如果设置了自动导航，直接跳转到题目页面
            if (autoNavigate && gotopage !== "#") {
                window.location.href = gotopage;
                return;
            }

            currentDisplay.textContent = `Current: ${current[0]} (${current[1]})`;
            currentDisplay.style.color = "#0066cc";
            currentDisplay.style.cursor = "pointer";
            console.log("gotopage:", gotopage);
            currentDisplay.onclick = () => {
                window.location.href = gotopage; // 在当前标签页打开
            };
            remainDisplay.textContent = `Remain: ${
          tuples.length - current_index - 1
        }`;
        })
            .catch((err) => {
            alert("Error fetching problem page:", err);
            currentDisplay.textContent = `Error: ${current[0]} (${current[1]})`;
            currentDisplay.style.color = "red";
        });
    };

    // 创建上一题按钮
    const previousButton = styleButton(document.createElement("button"));
    previousButton.textContent = "Previous [";
    previousButton.title = "快捷键: [";
    previousButton.addEventListener("click", () => {
        if (tuples.length > 0) {
            current_index = (current_index - 1 + tuples.length) % tuples.length;
            current = tuples[current_index];
            GM_setValue("current_error_id", current);
            updateDisplay(true); // 自动跳转
        }
    });

    // 创建下一题按钮
    const nextButton = styleButton(document.createElement("button"));
    nextButton.textContent = "Next ]";
    nextButton.title = "快捷键: ]";
    nextButton.addEventListener("click", () => {
        if (tuples.length > 0) {
            current_index = (current_index + 1) % tuples.length;
            current = tuples[current_index];
            GM_setValue("current_error_id", current);
            updateDisplay(true); // 自动跳转
        }
    });

    // 创建重置按钮
    const resetButton = styleButton(document.createElement("button"));
    resetButton.textContent = "Reset";
    resetButton.style.fontSize = "12px";
    resetButton.style.padding = "4px 8px";
    resetButton.addEventListener("click", () => {
        if (tuples.length > 0) {
            current_index = 0;
            const newTuples = refresh_tuples();
            current = tuples[0];
            GM_setValue("current_error_id", current);
            if (newTuples && newTuples.length > 0) {
                tuples.length = 0;
                tuples.push(...newTuples);

                // 更新错题数量缓存
                GM_setValue("error_table_ver", newTuples.length);

                // 隐藏更新提醒
                if (updateNotification) {
                    updateNotification.style.display = "none";
                }
            }
            updateDisplay();
        }
    });

    // 创建按钮容器
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.width = "100%";
    buttonContainer.appendChild(previousButton);
    buttonContainer.appendChild(nextButton);

    // 创建更新提醒
    const updateNotification = document.createElement("div");
    updateNotification.style.display = hasUpdates ? "block" : "none";
    updateNotification.style.backgroundColor = "#fff3cd";
    updateNotification.style.color = "#856404";
    updateNotification.style.padding = "6px";
    updateNotification.style.borderRadius = "4px";
    updateNotification.style.fontSize = "12px";
    updateNotification.style.textAlign = "center";
    updateNotification.style.width = "100%";
    updateNotification.style.marginBottom = "8px";
    updateNotification.style.border = "1px solid #ffeeba";
    updateNotification.textContent = `错题本存在更新！当前: ${currentErrorCount}, 缓存: ${cachedErrorCount}`;

    // 创建更新缓存按钮
    const updateCacheButton = styleButton(document.createElement("button"));
    updateCacheButton.textContent = "更新缓存";
    updateCacheButton.style.fontSize = "12px";
    updateCacheButton.style.padding = "4px 8px";
    updateCacheButton.addEventListener("click", () => {
        GM_setValue("error_table_ver", currentErrorCount);
        updateNotification.style.display = "none";
        alert(`缓存已更新！当前错题数量: ${currentErrorCount}`);
    });

    // 创建底部容器
    const bottomContainer = document.createElement("div");
    bottomContainer.style.display = "flex";
    bottomContainer.style.justifyContent = "space-between";
    bottomContainer.style.alignItems = "center";
    bottomContainer.style.width = "100%";
    bottomContainer.appendChild(remainDisplay);

    // 创建右侧按钮容器
    const rightButtonsContainer = document.createElement("div");
    rightButtonsContainer.style.display = "flex";
    rightButtonsContainer.style.gap = "4px";
    rightButtonsContainer.appendChild(updateCacheButton);
    rightButtonsContainer.appendChild(resetButton);
    bottomContainer.appendChild(rightButtonsContainer);

    // 将元素添加到控制面板
    controlPanel.appendChild(currentDisplay);
    if (hasUpdates) {
        controlPanel.appendChild(updateNotification);
    }
    controlPanel.appendChild(buttonContainer);
    controlPanel.appendChild(bottomContainer);

    // 将控制面板添加到文档
    document.body.appendChild(controlPanel);

    // 添加键盘事件监听器
    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "[": {
                // 视觉反馈
                previousButton.style.backgroundColor = "#d0d0d0";
                setTimeout(() => {
                    previousButton.style.backgroundColor = "#f0f0f0";
                }, 200);

                // 直接调用逻辑而不是点击按钮，避免重复触发
                if (tuples.length > 0) {
                    current_index = (current_index - 1 + tuples.length) % tuples.length;
                    current = tuples[current_index];
                    GM_setValue("current_error_id", current);
                    updateDisplay(true); // 自动跳转
                }
                break;
            }
            case "]": {
                // 视觉反馈
                nextButton.style.backgroundColor = "#d0d0d0";
                setTimeout(() => {
                    nextButton.style.backgroundColor = "#f0f0f0";
                }, 200);

                // 直接调用逻辑而不是点击按钮，避免重复触发
                if (tuples.length > 0) {
                    current_index = (current_index + 1) % tuples.length;
                    current = tuples[current_index];
                    GM_setValue("current_error_id", current);
                    updateDisplay(true); // 自动跳转
                }
                break;
            }
        }
    });

    // 初始化显示
    if (tuples.length > 0) {
        updateDisplay();
    }
})();
