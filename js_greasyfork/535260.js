// ==UserScript==
// @name          Prompt Gallery
// @namespace     https://greasyfork.org/zh-CN/users/1375382-ryanli
// @version       3.6
// @description   高效的提示词库选择器
// @author        Ryanli
// @match         https://chatgpt.com/*
// @match         *://claude.ai/*
// @match         *://www.doubao.com/*
// @match         https://kimi.moonshot.cn/*
// @match         https://chatglm.cn/*
// @match         https://tongyi.aliyun.com/*
// @match         https://web.chatboxai.app/*
// @match         https://gemini.google.com/*
// @match         https://www.deepseek.com/*
// @match         https://chatglm.cn/*
// @match         https://yiyan.baidu.com/*
// @match         https://poe.com/*
// @match         https://www.perplexity.ai/*
// @match         https://copilot.microsoft.com/*
// @grant         GM_getValue
// @grant         GM_setValue
// @run-at        document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535260/Prompt%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/535260/Prompt%20Gallery.meta.js
// ==/UserScript==


(function () {
    "use strict";
    const site = /([^.]+)\.[^.]+$/.exec(location.hostname)[1]
    if (document.querySelector("#promptTool")) {
        return;
    }
    var defaultPrompts = [
        [
            "Act as a Friend",
            "I want you to act as my friend. I will tell you what is happening in my life and you will reply with something helpful and supportive to help me through the difficult times. Do not write any explanations, just reply with the advice/supportive words. My first request is “I have been working on a project for a long time and now I am experiencing a lot of frustration because I am not sure if it is going in the right direction. Please help me stay positive and focus on the important things.”\n",
        ],
        [
            "Act as an English Translator and Improver",
            "I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. My first sentence is “istanbulu cok seviyom burada olmak cok guzel”\n",
        ],

    ];

    // 保存函数
    function savePrompts() {
        GM_setValue('prompts', prompts);
    }

    // 读取函数
    function readPrompts() {
        return GM_getValue('prompts', null);
    }

    // 从存储中加载快捷提示库
    var storedPrompts = readPrompts();
    let prompts = storedPrompts != null ? storedPrompts : defaultPrompts;

    var rootEle = document.createElement("div");
    rootEle.id = "promptTool";
    rootEle.innerHTML =
        '<div id="promptBar" style="position: fixed; top: 50%; right: 0; z-index: 1999999; cursor: pointer; padding: 12px; background-color: #333; color: white; transform: translateY(0); transition: transform 0.3s; border-top-left-radius: 15px; border-bottom-left-radius: 15px; box-shadow: -2px 2px 5px rgba(0,0,0,0.3); background-image: linear-gradient(to right, #333, #111); font-size: 16px;">Prompt Gallery<br></div>' +

        '<div id="promptBoard" style="position: fixed; top: 0; right: 0; z-index: 1999999; bottom: 0; padding: 8px; width: 400px; color: #D1D5DB; background-color: #111111; transform: translateX(120%); transition: transform 0.3s; border-top-left-radius: 15px; border-bottom-left-radius: 15px; box-shadow: -2px 2px 5px rgba(0,0,0,0.3); font-size: 16px; font-family: Arial;">' +
        '<div style="display: flex; align-items: center;">' +
        '<button id="toggleFixButton" style="margin: 8px; padding: 0px; z-index: 2000000; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; color: white; font-size: 16px; background-color: green;">' +
        'T' +
        '</button>' +
        '<span style="flex-grow: 1; display: flex; justify-content: center; align-items: center; text-align: center; margin-right: 38px;">' +
        '<a style="color: #D1D5DB; font-size: 16px; font-family: Arial;">' +
        'Prompter (Ctrl+Shift+F)' +
        '</a>' +
        '</span>' +
        '</div>' +
        '<ul id="promptList" style="height: 80%; flex-wrap: nowrap; gap: 6px; overflow-y: scroll; -ms-overflow-style: none; scrollbar-width: none; margin:8px; padding: 8px; border-top: 1px solid #D1D5DB; border-bottom: 1px solid #D1D5DB; font-size: 14px; color: #D1D5DB;">' +
        prompts.map(function (_a) {
            var label = _a[0],
                value = _a[1];
            return `<li style="list-style-type: disc; line-height: 1.5; margin: 8px; padding: 8px 12px; border-radius: 6px; cursor: pointer; background-color: #111111; border: 1px solid #D1D5DB; font-size: 16px; font-family: Arial;">
                <span class="promptText" style="line-height: 1.5; cursor: pointer; margin: 0px; padding: 0px; color: #D1D5DB; word-wrap: break-word; " data-value="${encodeURI(value)}">${label}</span>
                <button class="deletePrompt" style="line-height: 1.5; background: none; border: none; color: #D1D5DB; cursor: pointer;">×</button>
            </li>`;
        }).join("") +
        '</ul>' +

        // 添加搜索框以及搜索结果的展示区域
        '<div style="position: relative; display: flex; justify-content: space-between; align-items: center; margin: 8px 0;">' +
        '<input id="searchPrompts" type="text" placeholder="Search Prompt" style="font-size: 14px; flex-grow: 1; padding: 8px; border-radius: 6px; border: 1px solid #D1D5DB; background-color: #f9fafb; color: #111111;"/>' +
        '<button id="clearSearch" style="z-index: 1999999; padding: 8px; border-radius: 6px; cursor: pointer; transition: background-color 0.3s; background-color: #f56565; color: #D1D5DB; display: none;">Clear</button>' +
        '<ul id="searchResults" style="word-wrap: break-word; margin: 8px; padding: 8px; line-height: 1.0; position: absolute; bottom: 40px; left: 0; right: 0; z-index: 1999999; background-color: #111111; border: 1px solid #D1D5DB; border-buttom: none; border-top-left-radius: 6px; border-top-right-radius: 6px; display: none; overflow: hidden; max-height: 200px; overflow-y: auto; font-size: 14px; font-family: Arial;"></div>' +
        '</ul>' +

        '<div style="display: flex; justify-content: space-between; position: fixed; bottom: 0; width: calc(100% - 20px); background-color: #111111; font-size: 16px;">' +
        '<span id="addPrompt" style="margin:8px; padding: 8px; height:40px; border-radius: 6px; cursor: pointer; transition: background-color 0.3s; background-color: #48bb78; color: #D1D5DB; display: flex; justify-content: center; align-items: center;">Add Prompt</span>' +
        '<span id="closeBoardButton" style="margin:8px; padding: 8px; height:40px; border-radius: 6px; cursor: pointer; transition: background-color 0.3s; background-color: #f56565; color: #D1D5DB; display: flex; justify-content: center; align-items: center;">Close</span>' +
        '</div>' +

        // 添加prompts添加界面
        '<div id="promptInput" style="z-index: 1999999; font-size: 16px; font-family: Arial; display: flex; flex-direction: column; justify-content: space-between; display:none; position:fixed; top: 40%; left: 50%; width: 300px; background-color: rgba(0, 0, 0, 0.8); padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5); transform: translate(-50%, -50%);">' +
        '<div id="promptInputHeader" style="user-select: none; cursor: move; display: flex; color: white; font-size: 16px; font-family: Arial; justify-content: center; align-items: center; padding-bottom: 8px;">Input new prompt</div>' +

        '<input id="promptName" type="text" placeholder="Prompt Name" style="font-size: 12px; font-family: Arial; width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #D1D5DB; background-color: #f9fafb; color: #111111;"/>' +
        '<textarea id="promptValue" placeholder="Prompt Content" rows="4" style="font-size: 12px; font-family: Arial; width: 100%; min-width: 100%; max-width: 100%; margin: 8px 0px; padding: 8px; border-radius: 6px; border: 1px solid #D1D5DB; background-color: #f9fafb; color: #111111;"></textarea>' +

        '<div style="display: flex; justify-content: space-between; align-items: center; bottom: 0; width: 100%; padding: 8px;">' +
        '<button id="submitPrompt" style="padding: 8px; border-radius: 6px; cursor: pointer; transition: background-color 0.3s; background-color: #48bb78; color: #D1D5DB;">Add</button>' +
        '<button id="cancelPrompt" style="padding: 8px; border-radius: 6px; cursor: pointer; transition: background-color 0.3s; background-color: #f56565; color: #D1D5DB;">Cancel</button>' +
        '</div>' +

        '</div>';
    document.body.appendChild(rootEle);
    var promptBoard = document.querySelector("#promptBoard");
    var promptBoardIsOpen = false;

    // 定义一个函数来封装搜索逻辑
    function performSearch(e) {
        const searchQuery = e.target.value.toLowerCase();
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = ''; // 清空搜索结果

        if (searchQuery) {
            document.getElementById('clearSearch').style.display = 'inline-block';
            const titleMatches = prompts.filter(prompt =>
                prompt[0].toLowerCase().includes(searchQuery)
            );
            const contentMatches = prompts.filter(prompt =>
                prompt[1].toLowerCase().includes(searchQuery)
            );
            // 合并 titleMatches 和 contentMatches，同时去重，并确保顺序
            const matches = [...new Set([...titleMatches, ...contentMatches])];

            matches.forEach((match, index) => {
                const li = document.createElement('li');
                li.textContent = match[0];
                li.style.cssText = "line-height: 1.0; margin: 8px; padding: 8px; border-radius: 6px; cursor: pointer; background-color: #111111; border: 1px solid #D1D5DB; font-size: 16px; font-family: Arial;";
                li.style.cursor = 'pointer';
                li.setAttribute('data-value', encodeURI(match[1]));
                li.addEventListener('click', () => {
                    // 这里可以插入将选择的prompt插入到聊天框的代码
                    simulateInputAtCursor(decodeURI(match[1]));
                    copyToCliper(decodeURI(match[1]));
                    // 关闭助手面板
                    closeOrOpenBoard('close');
                    // console.log('Selected:', match[1]);
                    resultsContainer.style.display = 'none'; // 隐藏搜索结果
                });
                resultsContainer.appendChild(li);
            });

            if (matches.length > 0) {
                resultsContainer.style.display = 'block'; // 显示搜索结果
            } else {
                resultsContainer.style.display = 'none'; // 没有匹配时隐藏
            }
        } else {
            document.getElementById('clearSearch').style.display = 'none';
            resultsContainer.style.display = 'none';
        }
    }

    // 添加 focus 事件监听器
    document.getElementById('searchPrompts').addEventListener('focus', performSearch);

    // 如果你也想在用户输入时实时更新搜索结果，可以添加 input 事件监听器
    document.getElementById('searchPrompts').addEventListener('input', performSearch);


    document.getElementById('searchPrompts').addEventListener('keydown', function (e) {
        // 如果用户按下回车键，选择第一个搜索结果
        if (e.key === 'Enter') {
            e.preventDefault(); // 阻止默认行为，如表单提交
            const resultsContainer = document.getElementById('searchResults');
            if (resultsContainer.children.length > 0) {
                resultsContainer.children[0].click();
            }
            // 让光标离开搜索框
            this.blur();
        }
    });

    document.getElementById('clearSearch').addEventListener('click', function () {
        event.stopPropagation(); // 阻止事件冒泡到父元素
        document.getElementById('searchPrompts').value = '';
        document.getElementById('searchResults').style.display = 'none';
        document.getElementById('searchResults').innerHTML = '';
        this.style.display = 'none';
    });







    // 处理点击prompt列表事件
    document.querySelector("#promptList").addEventListener("click", function (event) {
        var target = event.target;
        // console.log(target);
        // console.log(target.nodeName);
        if ((target.nodeName === "LI" || target.nodeName === "SPAN") && target.nodeName != "BUTTON") {
            var value = target.nodeName === 'SPAN' ? target.getAttribute("data-value") : target.querySelector(".promptText").getAttribute("data-value");
            // console.log(1000);
            // console.log(decodeURI(value));
            if (value) {
                simulateInputAtCursor(decodeURI(value));
                copyToCliper(decodeURI(value));
                // console.log({site});
                // 关闭助手面板
                closeOrOpenBoard('close');
            }
        }
    });

    // 复制prompt到剪贴板
    function copyToCliper(message) {
        // 添加复制到剪切板的功能
        navigator.clipboard.writeText(decodeURI(message)).then(() => {
            // console.log('文本已复制到剪切板');
        }).catch(err => {
            // console.error('复制到剪切板时出现错误：', err);
        });
    }

    // 模拟执行粘贴，尝试所有的可能方式，每0.5秒钟检查一次是否有可输入的焦点元素，持续5s
    function simulateInputAtCursor(message) {
        const maxWaitTime = 5000; // 最大等待时间（毫秒）
        const checkInterval = 500; // 检查间隔（毫秒）

        let attempts = 0;
        const interval = setInterval(() => {
            const activeElement = document.activeElement;

            if (activeElement && (
                activeElement instanceof HTMLInputElement ||
                activeElement instanceof HTMLTextAreaElement ||
                (activeElement.isContentEditable && activeElement.contentEditable === 'true')
            )) {
                clearInterval(interval);
                activeElement.focus();

                // 方式一：尝试使用 document.execCommand 插入文本
                if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
                    try {
                        document.execCommand('insertText', false, message);
                        // console.log('粘贴成功（方式一）');
                        return;
                    } catch (e) {
                        // console.warn('方式一失败，尝试其他方法');
                    }
                }

                // 方式二：如果 execCommand 失败，尝试直接设置值
                if (activeElement.setSelectionRange) {
                    const start = activeElement.selectionStart;
                    const end = activeElement.selectionEnd;
                    activeElement.value = activeElement.value.substring(0, start) + message + activeElement.value.substring(end);
                    activeElement.setSelectionRange(start + message.length, start + message.length);
                    // console.log('粘贴成功（方式二）');
                    return;
                }

                // 方式三：如果是 contenteditable 元素
                if (activeElement.isContentEditable) {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        range.deleteContents();
                        const textNode = document.createTextNode(message);
                        range.insertNode(textNode);
                        range.setEndAfter(textNode);
                        range.collapse(false);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        // console.log('粘贴成功（方式三）');
                        return;
                    }
                }

                // 方式四：如果 setSelectionRange 和 contenteditable 也不支持，尝试模拟按键事件
                for (let i = 0; i < message.length; i++) {
                    const keyEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: message[i] });
                    activeElement.dispatchEvent(keyEvent);
                    const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true, data: message[i] });
                    activeElement.dispatchEvent(inputEvent);
                }
                // console.log('粘贴成功（方式四）');
            } else {
                // 如果还没有超过最大等待时间，继续检查
                attempts++;
                if (attempts * checkInterval >= maxWaitTime) {
                    // 超过最大等待时间，停止查找并打印错误信息
                    clearInterval(interval);
                    // console.error('在五秒内未找到可输入的焦点元素，放弃执行粘贴动作。');
                }
            }
        }, checkInterval);
    }

    // 更新界面
    function updateULContent() {
        const promptList = document.getElementById('promptList');
        promptList.innerHTML = prompts.map(function (_a) {
            var label = _a[0],
                value = _a[1];
            return `<li style="list-style-type: disc; line-height: 1.5; margin: 8px; padding: 8px 12px; border-radius: 6px; cursor: pointer; background-color: #111111; border: 1px solid #D1D5DB; font-size: 16px; font-family: Arial;">
                <span class="promptText" style="line-height: 1.5; cursor: pointer; margin: 0px; padding: 0px; color: #D1D5DB; word-wrap: break-word; " data-value="${encodeURI(value)}">${label}</span>
                <button class="deletePrompt" style="line-height: 1.5; background: none; border: none; color: #D1D5DB; cursor: pointer;">×</button>
            </li>`;
        }).join("");
    }


    // 删除prompt
    document.querySelector("#promptList").addEventListener("click", function (event) {
        // 判断是否点击的是删除按钮
        if (event.target.classList.contains("deletePrompt")) {
            event.stopPropagation(); // 阻止事件向上冒泡
            var li = event.target.parentElement; // 获取当前 LI 元素
            li.remove(); // 删除当前提示
            // 更新列表
            prompts = Array.from(document.querySelectorAll("#promptList li")).map(li => [
                li.querySelector(".promptText").textContent,
                decodeURI(li.querySelector(".promptText").getAttribute("data-value"))
            ]);
            // 保存到存储
            savePrompts();
        }
    });

    // 添加prompt
    document.getElementById("addPrompt").addEventListener("click", function () {
        document.getElementById("promptInput").style.display = "block"; // 显示输入框
    });

    // 提交prompt
    document.getElementById("submitPrompt").addEventListener("click", function () {
        var label = document.getElementById("promptName").value.trim();
        var value = document.getElementById("promptValue").value;
        if (label && value) {
            var newLi = document.createElement("li");
            newLi.innerHTML = `<li style="list-style-type: disc; line-height: 1.5; margin: 8px; padding: 8px 12px; border-radius: 6px; cursor: pointer; background-color: #111111; border: 1px solid #D1D5DB; font-size: 16px; font-family: Arial;">
                <span class="promptText" style="line-height: 1.5; cursor: pointer; margin: 0px; padding: 0px; color: #D1D5DB; word-wrap: break-word; " data-value="${encodeURI(value)}">${label}</span>
                <button class="deletePrompt" style="line-height: 1.5; background: none; border: none; color: #D1D5DB; cursor: pointer;">×</button>
            </li>`;
            document.querySelector("#promptList").appendChild(newLi);
            document.getElementById("promptInput").style.display = "none"; // 隐藏输入框
            document.getElementById("promptName").value = ''; // 清空输入框
            document.getElementById("promptValue").value = '';
            // 更新存储
            prompts.push([label, value]);
            savePrompts(); // 保存更新后的提示
            updateULContent()

            // 清空输入框
            document.getElementById("promptName").value = '';
            document.getElementById("promptValue").value = '';
        } else {
            alert("请填写名称和提示内容。");
        }
    });

    // 取消添加prompt
    document.getElementById("cancelPrompt").addEventListener("click", function () {
        document.getElementById("promptInput").style.display = "none"; // 隐藏输入框
        document.getElementById("promptName").value = ''; // 清空输入框
        document.getElementById("promptValue").value = '';
    });

    // 处理打开和关闭promptBoard的相关任务
    function closeOrOpenBoard(action, force = false) {
        // console.log(367);
        // console.log(action);
        // console.log(isBoardFixed);
        if (force === true) {
            promptBoard.style.transform = "translateX(120%)";
            promptBoardIsOpen = false;
            // 让光标离开搜索框
            document.getElementById('searchPrompts').blur();
        } else if (action === 'open') {
            promptBoard.style.transform = "translateX(0)";
            promptBoardIsOpen = true;
            // 让光标进入搜索框
            document.getElementById('searchPrompts').focus();
        } else if (action === 'close' && isBoardFixed == false) {
            promptBoard.style.transform = "translateX(120%)";
            promptBoardIsOpen = false;
            // 让光标离开搜索框
            document.getElementById('searchPrompts').blur();
        }
    }


    // 固定promptBar按钮
    var isBoardFixed = false; // 标记promptBoard是否固定
    let toggleButton = document.getElementById("toggleFixButton");
    toggleButton.addEventListener('click', function () {
        isBoardFixed = !isBoardFixed;

        if (isBoardFixed) {
            // 如果固定，显示红色，并禁止关闭功能
            toggleButton.style.backgroundColor = '#f56565'; // 红色
            document.removeEventListener('click', closePromptBoardOnClickOutside);
        } else {
            // 如果未固定，显示绿色，恢复关闭功能
            toggleButton.style.backgroundColor = 'green'; // 绿色
            document.addEventListener('click', closePromptBoardOnClickOutside);
        }
    });

    // 点击空白处关闭面板的功能
    function closePromptBoardOnClickOutside(event) {
        if (promptBoardIsOpen && !promptBoard.contains(event.target) && !document.querySelector("#promptBar").contains(event.target)) {
            closeOrOpenBoard('close');
        }
    }

    // 默认开启点击空白处关闭面板的功能
    document.addEventListener('click', closePromptBoardOnClickOutside);

    // 处理打开助手面板
    document.querySelector("#promptBar").addEventListener("click", function () {
        closeOrOpenBoard('open');

    });

    // 处理关闭助手面板
    document.querySelector("#closeBoardButton").addEventListener("click", function () {
        closeOrOpenBoard('close', true);
    });

    // 处理快捷键事件
    document.addEventListener("keydown", function (event) {
        // 判断是否按下特定组合键
        if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.code === "KeyF") {
            const promptBar = document.getElementById("promptBar");
            // console.log(promptBar.style.transform);
            // 如果 promptBar 未显示，则显示 promptBar，不显示 promptBoard
            if (promptBar.style.transform == 'translateX(120%)') {
                promptBar.style.transform = 'translateX(0)';
            } else {
                // 如果 promptBar 已显示，再判断 promptBoard 的显示状态
                if (!promptBoardIsOpen) {
                    closeOrOpenBoard('open');
                } else {
                    closeOrOpenBoard('close');
                }
            }
        } else if (event.code === "Escape") {
            closeOrOpenBoard('close');
        }
    });

    // 悬浮显示prompt内容
    // 为每个 li 元素添加鼠标进入和离开事件监听器
    const liElements = document.querySelectorAll("#promptList li");
    liElements.forEach(li => {
        let timer;
        li.addEventListener("mouseenter", function () {
            timer = setTimeout(() => {
                const value = decodeURI(li.querySelector(".promptText").getAttribute("data-value"));
                const tooltip = document.createElement("div");
                tooltip.classList.add('prompt-tooltip');
                tooltip.textContent = value;
                li.appendChild(tooltip);
            }, 1000);
        });
        li.addEventListener("mouseleave", function () {
            clearTimeout(timer);
            const tooltip = li.querySelector(".prompt-tooltip");
            if (tooltip) {
                tooltip.remove();
            }
        });
    });

    // 使用 CSS 来美化提示框的样式
    const style = document.createElement('style');
    style.textContent = `
    .prompt-tooltip {
        line-height: 1.5;
        position: absolute;
        background-color: rgba( 45, 46, 54, 0.99);
        color: #f1f1f1;
        padding: 8px;
        border-radius: 8px;
        font-size: 14px;
        box-shadow: 0 2px 4px rgba(150, 150, 150, 0.2);
        z-index: 1;
        max-width: 300px;
        word-wrap: break-word;
        border: 1px solid #D1D5DB;
    }`;
    document.head.appendChild(style);

    // 关闭promptBar
    // 创建关闭按钮
    const closeBarButton = document.createElement('div');
    closeBarButton.textContent = '×';
    closeBarButton.style.cssText = `
    position: absolute;
    left: 6px; /* 相对于promptBar的左边定位 */
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: white;
    background-color: rgba(255, 0, 0, 0.8);
    font-size: 24px;
    box-shadow: -2px 2px 5px rgba(255, 0, 0, 0.5);
    display: none; /* 默认隐藏 */
    width: 30px; /* 设置固定的宽度 */
    height: 30px; /* 设置固定的高度 */
    line-height: 30px; /* 垂直居中文本，值应与高度相同 */
    text-align: center; /* 水平居中文本 */
    border-radius: 15px; /* 可选：使按钮变成圆形 */
    `;

    // 添加关闭按钮到promptBar
    document.getElementById("promptBar").appendChild(closeBarButton);

    // 为promptBar添加鼠标进入和离开事件监听器
    document.getElementById("promptBar").addEventListener('mouseenter', function () {
        let timer = setTimeout(() => {
            // 显示关闭按钮
            closeBarButton.style.display = 'block';
        }, 1000);
        this.timer = timer;
    });

    document.getElementById("promptBar").addEventListener('mouseleave', function () {
        clearTimeout(this.timer);
        closeBarButton.style.display = 'none'; // 隐藏关闭按钮
    });

    // 为关闭按钮添加点击事件监听器
    closeBarButton.addEventListener('click', function () {
        event.stopPropagation(); // 阻止事件冒泡到父元素
        document.getElementById("promptBar").style.transform = 'translateX(120%)';
    });


    // 获取promptInput元素
    var promptInput = document.querySelector("#promptInput");

    // 当鼠标按下的时候设置为true
    var isDragging = false;
    var offsetX, offsetY;

    // 鼠标按下时触发
    document.querySelector("#promptInputHeader").addEventListener('mousedown', function (e) {
        isDragging = true;
        // 计算鼠标相对于提示框左上角的偏移
        offsetX = e.clientX - promptInput.offsetLeft;
        offsetY = e.clientY - promptInput.offsetTop;
    });

    // 鼠标移动时触发
    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            // 设置新的位置
            promptInput.style.left = (e.clientX - offsetX) + 'px';
            promptInput.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    // 鼠标释放时触发
    document.addEventListener('mouseup', function () {
        isDragging = false;
    });


})();