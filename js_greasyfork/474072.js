// ==UserScript==
// @license      MIT
// @name         安全人员小助手
// @namespace    http://key08.com/
// @version      0.9
// @description  安全人员小助手,安全人员必备的工具
// @author       huoji
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/474072/%E5%AE%89%E5%85%A8%E4%BA%BA%E5%91%98%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/474072/%E5%AE%89%E5%85%A8%E4%BA%BA%E5%91%98%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";
    function build_html (document) {
        // 创建自定义的右键菜单
        let customContextMenu = document.createElement('div');
        customContextMenu.id = 'huoji_tip_custom-context-menu';
        customContextMenu.style.display = 'none';
        customContextMenu.style.position = 'fixed';
        customContextMenu.style.zIndex = '10000';
        customContextMenu.style.backgroundColor = '#f8f9fa';
        customContextMenu.style.border = '1px solid #ced4da';
        customContextMenu.style.padding = '5px';
        customContextMenu.style.borderRadius = '0.25rem';
        customContextMenu.style.boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';

        let buttonStyle = `
                            style="
                                display: block;
                                width: 100%;
                                padding: 3px 20px;
                                margin-bottom: 2px;
                                font-size: 14px;
                                border: none;
                                color: #212529;
                                background-color: transparent;
                                text-align: left;
                                cursor: pointer;
                                text-decoration: none;
                            "
                        `;

        let buttonsData = [
            { id: "copy-button", text: "复制到剪切板" },
            { id: "use-chatgpt", text: "使用GPT进行介绍" },
            { id: "use-chatgpt-translate", text: "使用GPT进行翻译" },
            { id: "send-to-tip-button", text: "进行KSN云查" },
            { id: "vt-search-button", text: "发送到VirusTotal" },
            { id: "wb-search-button", text: "发送到微步" },
            { id: "change-ksn-key-button", text: "修改KSN密钥" },
            { id: "enable-chatgpt", text: "激活GPT模式" },
            { id: "change-chatgpt-apikey", text: "修改GPT的key(为空走免费路线)" }
        ];

        customContextMenu.innerHTML = buttonsData.map(button => `<button id="${button.id}" ${buttonStyle}>${button.text}</button>`).join('');

        document.body.appendChild(customContextMenu);

        // 添加悬停高亮效果
        buttonsData.forEach(button => {
            let btn = document.getElementById(button.id);
            btn.addEventListener('mouseover', function () {
                this.style.backgroundColor = '#e9ecef'; // 淡灰色背景
            });
            btn.addEventListener('mouseout', function () {
                this.style.backgroundColor = 'transparent';
            });
        });
        document.body.appendChild(customContextMenu);

        // 创建气泡提示
        let bubble = document.createElement("div");
        bubble.id = "huoji_tip_bubble";
        bubble.style.display = "none";
        bubble.style.position = "fixed";
        bubble.style.zIndex = "10001";
        bubble.style.padding = "10px";
        bubble.style.borderRadius = "5px";
        bubble.style.color = "#fff";
        bubble.style.maxWidth = "80%";
        bubble.style.overflow = "auto";
        bubble.style.wordWrap = "break-word";
        document.body.appendChild(bubble);

        // 创建加载动画
        let loader = document.createElement("div");
        loader.id = "huoji_tip_loader";
        loader.style.display = "none";
        loader.style.borderRadius = "50%";
        loader.style.animation = "spin 2s linear infinite";
        loader.style.border = "8px solid #f3f3f3"; // 减小边框大小
        loader.style.borderTop = "8px solid #3498db"; // 顶部边框保持颜色，但大小减半
        loader.style.width = "60px"; // 宽度减半
        loader.style.height = "60px"; // 高度减半

        document.body.appendChild(loader);

        // 添加CSS动画
        let style = document.createElement("style");
        style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        `;
        document.head.appendChild(style);
    }
    if (document == null) {
        document = window.document;
    }
    function PrintKsnResult (result, e) {
        let zone = result.zone;
        let hitcount = result.hitcount;
        switch (zone) {
            case "Green":
                showBubble(
                    e.clientX,
                    e.clientY,
                    "白文件 流行度:" + hitcount.toString(),
                    "#888"
                );
                break;
            case "Yellow":
                showBubble(
                    e.clientX,
                    e.clientY,
                    "广告文件 流行度:" + hitcount.toString(),
                    "#888"
                );
                break;
            case "Grey":
                showBubble(
                    e.clientX,
                    e.clientY,
                    "未知文件 流行度:" + hitcount.toString(),
                    "#888"
                );
                break;
            case "Red":
                showBubble(
                    e.clientX,
                    e.clientY,
                    "病毒文件 流行度:" + hitcount.toString(),
                    "#f00"
                );
                break;
        }
    }
    function PushMsgToGPT (text, thePrompt, e) {
        if (enableGPT == false) {
            alert("GPT模式没有开启,请刷新页面");
            return;
        }
        if (text == "huoji" || text.length <= 0) {
            alert("没有选中需要介绍的段落");
            return;
        }
        let apiKey = GM_getValue("gpt_apiKey");
        let loader = document.getElementById("huoji_tip_loader");
        loader.style.position = "fixed";
        loader.style.left = e.clientX + "px"; // 使用鼠标点击时的坐标
        loader.style.top = e.clientY + "px";
        loader.style.display = "block";
        loader.style.zIndex = "9999";
        GM_xmlhttpRequest({
            method: "POST",
            url: apiKey ? "https://api.openai.com/v1/chat/completions" : "https://ai.fakeopen.com/v1/chat/completions",
            headers: {
                Authorization: apiKey ? "Bearer " + apiKey : "Bearer pk-this-is-a-real-free-pool-token-for-everyone",
                "Content-Type": "application/json",
                model: "gpt-3.5-turbo",
            },
            data: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content:
                            "From now on, you are an assistant of a senior Safety engineer. You have mastered many skills and techniques related to network security. You are proficient in assembly and reverse. Your responsibility is to help the questioner analyze the function of code, explain the purpose of code, guess code and analyze code",
                    },
                    {
                        role: "user",
                        // 使用谢谢能bypass一些GPT的道德伦理限制
                        content:
                            thePrompt
                            +
                            text,
                    },
                ],
            }),
            onload: function (response) {
                loader.style.display = "none";

                if (response.status === 200) {
                    let result = JSON.parse(response.responseText);
                    if ("choices" in result) {
                        let answer = result.choices[0].message.content;
                        showBubble(e.clientX, e.clientY, answer, "#888");
                    }
                } else {
                    showBubble(
                        e.clientX,
                        e.clientY,
                        "GPT服务器异常,请确认网络连通性以及密钥是否正确(如果是免费路线,可以设置APIKEY走私有的会稳定)...",
                        "#888"
                    );
                }
            },
        });
        document.getElementById(
            "huoji_tip_custom-context-menu"
        ).style.display = "none"; // 关闭菜单
    };
    build_html(document);
    let ksnQueryCache = {};
    let enableGPT = false;
    let stopDisVisible = false;
    function showMenu (text, e) {
        let md5Pattern = /^[a-f0-9]{32}$/i;
        let sha1Pattern = /^[a-f0-9]{40}$/i;
        let ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        let domainPattern = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/i;

        let customContextMenu = document.getElementById(
            "huoji_tip_custom-context-menu"
        );
        let sendToTipButton = document.getElementById("send-to-tip-button");
        let copyButton = document.getElementById("copy-button");
        let vtSearchButton = document.getElementById("vt-search-button");
        let wbSearchButton = document.getElementById("wb-search-button");
        let changeKsnKeyButton = document.getElementById("change-ksn-key-button");
        let loader = document.getElementById("huoji_tip_loader");
        let enableChatgptButton = document.getElementById("enable-chatgpt");
        let useChatgptButton = document.getElementById("use-chatgpt");
        let changeGPTkeyButton = document.getElementById("change-chatgpt-apikey");
        let useChatGPTtranslateButton = document.getElementById("use-chatgpt-translate");
        if (
            changeKsnKeyButton == null ||
            wbSearchButton == null ||
            vtSearchButton == null ||
            copyButton == null ||
            sendToTipButton == null ||
            customContextMenu == null ||
            loader == null ||
            enableChatgptButton == null ||
            useChatgptButton == null ||
            changeGPTkeyButton == null ||
            useChatGPTtranslateButton == null
        ) {
            build_html(document);
        }
        if (
            md5Pattern.test(text) ||
            sha1Pattern.test(text) ||
            ipPattern.test(text) ||
            domainPattern.test(text) ||
            enableGPT == true ||
            // yes... lazy
            text == "huoji"
        ) {
            customContextMenu.style.left = e.clientX + "px";
            customContextMenu.style.top = e.clientY + "px";
            customContextMenu.style.display = "block";

            e.preventDefault();
            useChatgptButton.style.display = enableGPT == false ? "none" : "block";
            useChatGPTtranslateButton.style.display = enableGPT == false ? "none" : "block";

            if (md5Pattern.test(text) || sha1Pattern.test(text)) {
                sendToTipButton.style.display = "block";
                vtSearchButton.style.display = "block";
                changeKsnKeyButton.style.display = "block";
                wbSearchButton.style.display = "none";
                changeGPTkeyButton.style.display = "none";
            } else if (ipPattern.test(text) || domainPattern.test(text)) {
                sendToTipButton.style.display = "none";
                vtSearchButton.style.display = "none";
                changeKsnKeyButton.style.display = "none";
                wbSearchButton.style.display = "block";
                changeGPTkeyButton.style.display = "none";
            } else {
                sendToTipButton.style.display = "none";
                vtSearchButton.style.display = "none";
                changeKsnKeyButton.style.display = "none";
                wbSearchButton.style.display = "none";
                changeGPTkeyButton.style.display = "block";
            }
            if (text == "huoji") {
                copyButton.style.display = "none";
            } else {
                copyButton.style.display = "block";
            }
            sendToTipButton.onclick = function () {
                if (md5Pattern.test(text) == false && sha1Pattern.test(text) == false) {
                    alert("请输入正确的MD5或SHA1哈希值");
                    return;
                }
                let apiKey = GM_getValue("apiKey");
                if (!apiKey) {
                    apiKey = prompt(
                        "第一次使用需要填KSN密钥, 请输入您的KSN API密钥:",
                        ""
                    );
                    if (apiKey == null) {
                        return;
                    }
                    GM_setValue("apiKey", apiKey);
                }
                // 显示加载动画
                let loader = document.getElementById("huoji_tip_loader");
                loader.style.position = "fixed";
                loader.style.left = e.clientX + "px"; // 使用鼠标点击时的坐标
                loader.style.top = e.clientY + "px";
                loader.style.display = "block";
                loader.style.zIndex = "9999";
                if (text in ksnQueryCache) {
                    PrintKsnResult(ksnQueryCache[text], e);
                    loader.style.display = "none";
                } else {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url:
                            "https://opentip.kaspersky.com/api/v1/search/hash?request=" +
                            text,
                        headers: {
                            "x-api-key": apiKey,
                        },
                        onload: function (response) {
                            loader.style.display = "none";

                            if (response.status === 404) {
                                showBubble(e.clientX, e.clientY, "找不到hash", "#888");
                            } else if (response.status === 200) {
                                let result = JSON.parse(response.responseText);
                                ksnQueryCache[text] = {
                                    zone: result.Zone,
                                    hitcount: 'HitsCount' in result.FileGeneralInfo ? result.FileGeneralInfo.HitsCount : 0,
                                };
                                PrintKsnResult(ksnQueryCache[text], e);
                            } else if (response.status === 401) {
                                let userChoice = confirm("KSN API密钥错误,你想更换密钥吗?");
                                if (userChoice == true) {
                                    apiKey = prompt("重新输入密钥:", "");
                                    GM_setValue("apiKey", apiKey);
                                }
                            } else if (response.status === 403) {
                                let userChoice = confirm(
                                    "密钥超过一天配额,换密钥或者明天再用,你想更换密钥吗?"
                                );
                                if (userChoice == true) {
                                    apiKey = prompt("重新输入密钥:", "");
                                    GM_setValue("apiKey", apiKey);
                                }
                            } else if (response.status === 400) {
                                alert("!MD5或者sha1不正确!");
                            }
                        },
                    });
                }
                customContextMenu.style.display = "none"; // 关闭菜单
            };

            copyButton.onclick = function () {
                GM_setClipboard(text);
                customContextMenu.style.display = "none"; // 关闭菜单
            };
            vtSearchButton.onclick = function () {
                if (md5Pattern.test(text) == false && sha1Pattern.test(text) == false) {
                    alert("请输入正确的MD5或SHA1哈希值");
                    return;
                }
                window.open("https://www.virustotal.com/gui/file/" + text, "_blank");
                customContextMenu.style.display = "none"; // 关闭菜单
            };
            changeKsnKeyButton.onclick = function () {
                GM_setValue("apiKey", prompt("重新输入密钥:", ""));
            };
            wbSearchButton.onclick = function () {
                if (md5Pattern.test(text) || sha1Pattern.test(text)) {
                    alert("请输入域名或者IP地址");
                    return;
                } else if (ipPattern.test(text)) {
                    window.open("https://x.threatbook.com/v5/ip/" + text, "_blank");
                } else if (domainPattern.test(text)) {
                    window.open("https://x.threatbook.com/v5/domain/" + text, "_blank");
                }
                customContextMenu.style.display = "none"; // 关闭菜单
            };
            enableChatgptButton.onclick = function () {
                enableGPT = !enableGPT;
                //change button text
                if (enableGPT == false) {
                    enableChatgptButton.innerHTML = "开启GPT模式";
                    changeKsnKeyButton.style.display = "block";
                } else {
                    enableChatgptButton.innerHTML = "关闭GPT模式";
                    changeKsnKeyButton.style.display = "none";
                }
            };
            changeGPTkeyButton.onclick = function () {
                let apiKey = prompt("重新输入密钥(设置为空走免费路径):", "");
                GM_setValue("gpt_apiKey", apiKey);
            };
            useChatGPTtranslateButton.onclick = function () {
                PushMsgToGPT(text, "我需要把这些翻译成中文,谢谢:\n", e);
            };
            useChatgptButton.onclick = function () {
                PushMsgToGPT(text, "请帮我解释一下这段信息,回复不要太长(小于64个字),猜测一下可能的情况,输出中文,谢谢: \n", e);
            };
        }
    }
    // 当用户右击页面时，如果选中的是MD5或SHA1哈希值，则显示自定义的右键菜单
    document.oncontextmenu = function (e) {
        let text = window.getSelection().toString();
        if (text.length > 3) {
            showMenu(text, e);
        }
    };

    // 点击其他地方关闭菜单和气泡提示
    document.onclick = function (e) {
        if (
            e.target.id !== "send-to-tip-button" &&
            e.target.id !== "copy-button" &&
            e.target.id !== "vt-search-button" &&
            e.target.id !== "wb-search-button" &&
            e.target.id !== "use-chatgpt" &&
            e.target.id !== "use-chatgpt-translate"
        ) {
            let customContextMenu = document.getElementById(
                "huoji_tip_custom-context-menu"
            );
            if (customContextMenu && stopDisVisible == false) {
                customContextMenu.style.display = "none";
            }
            stopDisVisible = false;

            let bubble = document.getElementById("huoji_tip_bubble");
            if (bubble) {
                bubble.style.display = "none";
            }
        }
    };

    // 显示气泡提示
    function showBubble (x, y, message, color) {
        let bubble = document.getElementById("huoji_tip_bubble");
        if (bubble) {
            bubble.textContent = message;
            bubble.style.backgroundColor = color;
            bubble.style.display = "block";

            // 调整气泡位置以确保不超出屏幕
            let bubbleRect = bubble.getBoundingClientRect();
            if (x + bubbleRect.width > window.innerWidth) {
                x = window.innerWidth - bubbleRect.width;
            }
            if (y + bubbleRect.height > window.innerHeight) {
                y = window.innerHeight - bubbleRect.height;
            }

            bubble.style.left = x + "px";
            bubble.style.top = y + "px";
        }
    }

    let pressTimer = null;
    let moved = false;
    let startX, startY;
    // 监听mousedown事件
    document.addEventListener('mousedown', function (e) {
        pressTimer = null;
        moved = false;
        startX = e.clientX;  // 记录鼠标按下时的位置
        startY = e.clientY;
        // 开始计时
        pressTimer = window.setTimeout(function () {
            if (!moved) {  // 只有当鼠标没有移动时才显示菜单
                stopDisVisible = true;
                showMenu("huoji", e);
            }
        }, 1000);  // 这里设置长按的时间，单位是毫秒
    });

    // 监听mousemove事件
    document.addEventListener('mousemove', function (e) {
        if (pressTimer == null) {
            return;
        }
        let moveX = e.clientX;
        let moveY = e.clientY;

        // 如果鼠标移动距离大于5px, 则认为是移动
        if (Math.abs(moveX - startX) > 5 || Math.abs(moveY - startY) > 5) {
            moved = true;  // 如果鼠标移动，就将moved设为true
            clearTimeout(pressTimer);  // 并取消计时器
        }
    });

    // 监听mouseup事件
    document.addEventListener('mouseup', function () {
        if (pressTimer != null) {
            clearTimeout(pressTimer);
        }
    });

})();
