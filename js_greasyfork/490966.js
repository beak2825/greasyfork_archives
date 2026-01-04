// ==UserScript==
// @name         洛曦-直播弹幕监听助手 转发至本地WS服务端，巨量百应商品自动弹窗
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  观察指定 DOM 节点的变化以将数据发送到连接的WebSocket服务端
// @description  Github：https://github.com/Ikaros-521/AI-Vtuber/tree/main/Scripts/%E7%9B%B4%E6%92%ADws%E8%84%9A%E6%9C%AC
// @author       Ikaros
// @match        https://www.douyu.com/*
// @match        https://live.kuaishou.com/u/*
// @match        https://mobile.yangkeduo.com/*
// @match        https://live.1688.com/zb/play.html*
// @match        https://tbzb.taobao.com/live*
// @match        https://redlive.xiaohongshu.com/*
// @match        https://channels.weixin.qq.com/platform/live/*
// @match        https://buyin.jinritemai.com/dashboard/live/control*
// @match        https://ark.xiaohongshu.com/live_center_control*
// @match        https://www.tiktok.com/@*/live*
// @match        https://eos.douyin.com/livesite/live/current*
// @grant        none
// @namespace    https://greasyfork.org/scripts/490966
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/490966/%E6%B4%9B%E6%9B%A6-%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%A9%E6%89%8B%20%E8%BD%AC%E5%8F%91%E8%87%B3%E6%9C%AC%E5%9C%B0WS%E6%9C%8D%E5%8A%A1%E7%AB%AF%EF%BC%8C%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%E5%95%86%E5%93%81%E8%87%AA%E5%8A%A8%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/490966/%E6%B4%9B%E6%9B%A6-%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%A9%E6%89%8B%20%E8%BD%AC%E5%8F%91%E8%87%B3%E6%9C%AC%E5%9C%B0WS%E6%9C%8D%E5%8A%A1%E7%AB%AF%EF%BC%8C%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%E5%95%86%E5%93%81%E8%87%AA%E5%8A%A8%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
    "use strict";


    let wsUrl = "ws://127.0.0.1:5001";

    // 在文件开头添加一个函数，用于创建和显示消息框
    function showMessage(message, type = 'info') {
        const messageBox = document.createElement('div');
        messageBox.className = `message-box ${type}`;
        messageBox.innerText = message;

        // 设置样式，消息上方居中
        messageBox.style.position = 'fixed';
        messageBox.style.right = '40%';
        messageBox.style.transform = 'translateX(-50%)';
        messageBox.style.top = `${10 + (document.querySelectorAll('.message-box').length * 60)}px`; // 每个消息框之间的间距
        messageBox.style.zIndex = '9999';
        messageBox.style.padding = '10px';
        // 设置info、success、error、warning等多个颜色，要好看，参考element-ui
        messageBox.style.backgroundColor = type === 'info' ? '#409EFF' : type === 'success' ? '#67C23A' : type === 'warning' ? '#E6A23C' : '#F56C6C';
        messageBox.style.color = 'white';
        messageBox.style.borderRadius = '5px';
        messageBox.style.marginBottom = '10px';
        messageBox.style.transition = 'opacity 0.5s ease';
        // 字体要大
        messageBox.style.fontSize = '16px';

        document.body.appendChild(messageBox);

        // 自动消失
        setTimeout(() => {
            messageBox.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(messageBox);
            }, 500);
        }, 3000); // 3秒后消失

        // 限制消息框数量
        const messageBoxes = document.querySelectorAll('.message-box');
        if (messageBoxes.length > 5) { // 限制最多显示5个消息框
            document.body.removeChild(messageBoxes[0]);
        }
    }

    showMessage("洛曦-直播弹幕监听助手 启动中，请稍等...", 'info');

    setTimeout(function () {
        let my_socket = null;
        let targetNode = null;
        let my_observer = null;

        const hostname = window.location.hostname;

        if (hostname === "www.douyu.com") {
            console.log("当前直播平台：斗鱼");
            showMessage("当前直播平台：斗鱼");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "live.kuaishou.com") {
            console.log("当前直播平台：快手");
            showMessage("当前直播平台：快手");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "mobile.yangkeduo.com") {
            console.log("当前直播平台：拼多多");
            showMessage("当前直播平台：拼多多");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "live.1688.com") {
            console.log("当前直播平台：1688");
            showMessage("当前直播平台：1688");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "tbzb.taobao.com") {
            console.log("当前直播平台：淘宝");
            showMessage("当前直播平台：淘宝");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "redlive.xiaohongshu.com" || hostname === "ark.xiaohongshu.com") {
            console.log("当前直播平台：小红书");
            showMessage("当前直播平台：小红书");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "channels.weixin.qq.com") {
            console.log("当前直播平台：微信视频号");
            showMessage("当前直播平台：微信视频号");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "buyin.jinritemai.com") {
            console.log("当前直播平台：巨量百应");
            showMessage("当前直播平台：巨量百应");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "www.tiktok.com") {
            console.log("当前直播平台：TikTok");
            showMessage("当前直播平台：TikTok");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "eos.douyin.com") {
            console.log("当前直播平台：抖音");
            showMessage("当前直播平台：抖音");
            wsUrl = "ws://127.0.0.1:5001";
        }

        function connectWebSocket() {
            // 创建 WebSocket 连接，适配服务端
            my_socket = new WebSocket(wsUrl);

            // 当连接建立时触发
            my_socket.addEventListener("open", (event) => {
                console.log("ws连接打开");

                // 向服务器发送一条消息
                const data = {
                    type: "info",
                    content: "ws连接成功",
                };
                console.log(data);
                my_socket.send(JSON.stringify(data));
            });

            // 当收到消息时触发
            my_socket.addEventListener("message", (event) => {
                console.log("收到服务器数据:", event.data);
                showMessage("收到服务器数据: " + event.data);
            });

            // 当连接关闭时触发
            my_socket.addEventListener("close", (event) => {
                console.log("WS连接关闭");
                showMessage("WS连接关闭", 'error');
                // 重连
                setTimeout(() => {
                    connectWebSocket();
                }, 1000); // 延迟 1 秒后重连
            });
        }

        if (hostname != "buyin.jinritemai.com") {
            // 初始连接
            connectWebSocket();
        }

        // 配置观察选项
        const config = {
            childList: true,
            subtree: true,
        };

        let timeoutId = null; // 定时器ID
        let cycleTimeoutId = null; // 循环周期定时器ID

        // 创建配置界面
        function createConfigUI() {
            const configDiv = document.createElement('div');
            configDiv.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #ffffff80;
                border-radius: 8px;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
                padding: 15px;
                z-index: 1000;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            `;

            configDiv.innerHTML = `
                <button id="toggleConfig" style="
                    width: 100%;
                    padding: 8px 15px;
                    background: #409EFF;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.3s;
                ">展开配置</button>
                <div id="configPanel" style="
                    display: none;
                    margin-top: 10px;
                ">
                    <!-- WS监听配置 -->
                    <div style="
                        margin-bottom: 20px;
                        padding: 15px;
                        border: 1px solid #DCDFE6;
                        border-radius: 4px;
                        background: #F5F7FA;
                    ">
                        <h3 style="
                            margin: 0 0 15px 0;
                            color: #303133;
                            font-size: 16px;
                            font-weight: 500;
                        ">WS监听配置</h3>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; color: #606266; font-size: 14px;">
                                WebSocket 地址:
                            </label>
                            <input type="text" id="wsUrl" value="${wsUrl}" style="
                                width: 100%;
                                padding: 8px;
                                border: 1px solid #DCDFE6;
                                border-radius: 4px;
                                box-sizing: border-box;
                                font-size: 14px;
                                transition: border-color 0.3s;
                            "/>
                        </div>
                        <button id="saveConfig" style="
                            width: 100%;
                            padding: 8px 15px;
                            background: #409EFF;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 14px;
                            transition: background-color 0.3s;
                        ">保存WS配置</button>
                    </div>

                    <!-- 商品弹窗配置 -->
                    <div style="
                        padding: 15px;
                        border: 1px solid #DCDFE6;
                        border-radius: 4px;
                        background: #F5F7FA;
                    ">
                        <h3 style="
                            margin: 0 0 15px 0;
                            color: #303133;
                            font-size: 16px;
                            font-weight: 500;
                        ">商品弹窗配置</h3>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; color: #606266; font-size: 14px;">
                                商品编号 (空格分隔):
                            </label>
                            <input type="text" id="itemIndices" style="
                                width: 100%;
                                padding: 8px;
                                border: 1px solid #DCDFE6;
                                border-radius: 4px;
                                box-sizing: border-box;
                                font-size: 14px;
                                transition: border-color 0.3s;
                            "/>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; color: #606266; font-size: 14px;">
                                每次触发延迟 (毫秒):
                            </label>
                            <input type="number" id="delay" value="5000" style="
                                width: 100%;
                                padding: 8px;
                                border: 1px solid #DCDFE6;
                                border-radius: 4px;
                                box-sizing: border-box;
                                font-size: 14px;
                                transition: border-color 0.3s;
                            "/>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; color: #606266; font-size: 14px;">
                                循环周期延迟 (毫秒):
                            </label>
                            <input type="number" id="cycleDelay" value="5000" style="
                                width: 100%;
                                padding: 8px;
                                border: 1px solid #DCDFE6;
                                border-radius: 4px;
                                box-sizing: border-box;
                                font-size: 14px;
                                transition: border-color 0.3s;
                            "/>
                        </div>
                        <button id="applyConfig" style="
                            width: 100%;
                            padding: 8px 15px;
                            background: #67C23A;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 14px;
                            transition: background-color 0.3s;
                        ">启动自动弹窗</button>
                    </div>
                </div>
            `;
            document.body.appendChild(configDiv);

            // 添加悬停效果
            const buttons = configDiv.getElementsByTagName('button');
            for (let button of buttons) {
                button.addEventListener('mouseover', function() {
                    this.style.opacity = '0.8';
                });
                button.addEventListener('mouseout', function() {
                    this.style.opacity = '1';
                });
            }

            // 添加输入框焦点效果
            const inputs = configDiv.getElementsByTagName('input');
            for (let input of inputs) {
                input.addEventListener('focus', function() {
                    this.style.borderColor = '#409EFF';
                });
                input.addEventListener('blur', function() {
                    this.style.borderColor = '#DCDFE6';
                });
            }

            document.getElementById('toggleConfig').addEventListener('click', () => {
                const configPanel = document.getElementById('configPanel');
                configPanel.style.display = configPanel.style.display === 'none' ? 'block' : 'none';
            });

            document.getElementById('applyConfig').addEventListener('click', applyConfig);
            document.getElementById('saveConfig').addEventListener('click', saveConfig);
        }

        // 保存监听配置
        function saveConfig() {
            const newWsUrl = document.getElementById('wsUrl').value;

            // 检查WebSocket地址格式
            if (!newWsUrl.startsWith('ws://') && !newWsUrl.startsWith('wss://')) {
                showMessage('WebSocket地址格式错误，必须以ws://或wss://开头', 'error');
                return;
            }

            try {
                new URL(newWsUrl);
                wsUrl = newWsUrl; // 更新 WebSocket 地址
                showMessage('配置保存成功', 'success');
            } catch (error) {
                showMessage('WebSocket地址格式无效', 'error');
            }
        }

        // 应用配置
        function applyConfig() {
            const itemIndicesInput = document.getElementById('itemIndices').value;
            if (!itemIndicesInput.trim()) {
                showMessage('请输入商品编号', 'warning');
                return;
            }

            const delay = parseInt(document.getElementById('delay').value, 10);
            const cycleDelay = parseInt(document.getElementById('cycleDelay').value, 10);

            // 验证延迟时间
            if (delay < 0 || isNaN(delay)) {
                showMessage('触发延迟时间必须大于0', 'warning');
                return;
            }
            if (cycleDelay < 0 || isNaN(cycleDelay)) {
                showMessage('循环周期延迟时间必须大于0', 'warning');
                return;
            }

            const itemIndices = itemIndicesInput.split(' ')
                .filter(str => str.trim() !== '')
                .map(str => parseInt(str.trim(), 10));

            // 验证商品编号
            if (itemIndices.some(index => isNaN(index) || index <= 0)) {
                showMessage('商品编号必须为正整数', 'warning');
                return;
            }

            const applyBtn = document.getElementById('applyConfig');
            const isRunning = applyBtn.textContent === '停止自动弹窗';

            if (isRunning) {
                // 如果当前正在运行,则停止
                stopLoop();
                applyBtn.textContent = '启动自动弹窗';
                applyBtn.style.backgroundColor = '#67C23A';
                showMessage('自动弹窗已停止', 'info');
            } else {
                // 如果当前已停止,则启动
                startLoop(itemIndices, delay, cycleDelay);
                applyBtn.textContent = '停止自动弹窗';
                applyBtn.style.backgroundColor = '#F56C6C';
                showMessage('自动弹窗已启动', 'success');
            }
        }

        // 启动循环
        function startLoop(itemIndices, delay, cycleDelay) {
            if (itemIndices.length === 0) return;

            const triggerNext = (index = 0) => {
                if (index >= itemIndices.length) {
                    // 结束一轮后等待循环周期延迟再开始下一轮
                    cycleTimeoutId = setTimeout(() => triggerNext(0), cycleDelay);
                    return;
                }

                const itemIndex = itemIndices[index] - 1;
                if (isNaN(itemIndex) || itemIndex < 0) {
                    console.error(`商品编号 ${itemIndex + 1} 无效`);
                    triggerNext(index + 1);
                    return;
                }
                const buttonIndex = 3 + 6 * itemIndex;

                try {
                    const buttons = document.getElementsByClassName("lvc2-grey-btn");
                    if(buttons[buttonIndex]) {
                        buttons[buttonIndex].click();
                        console.log(`已触发商品编号 ${itemIndex + 1} 的弹窗`);
                    } else {
                        console.error("无法找到指定的按钮！");
                    }
                } catch (error) {
                    console.error("触发弹窗时发生错误：", error);
                }

                timeoutId = setTimeout(() => triggerNext(index + 1), delay);
            };

            triggerNext();
        }

        // 停止循环
        function stopLoop() {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            if (cycleTimeoutId !== null) {
                clearTimeout(cycleTimeoutId);
                cycleTimeoutId = null;
            }
        }

        // 巨量百应
        if (hostname === "buyin.jinritemai.com") {
            // 初始化
            createConfigUI();
        }

        // 添加重试观察的函数，支持最大重试次数和指数退避
        let observeRetryCount = 0;
        const maxObserveRetries = 50; // 最大重试次数
        const baseRetryDelay = 10000; // 基础重试延迟时间(ms)

        // 初始化观察器和目标节点
        function initObserver() {
            // 清理之前的资源
            if (my_observer) {
                try {
                    my_observer.disconnect();
                } catch (e) {
                    console.error("断开旧观察器连接失败:", e);
                }
            }

            if (my_socket && hostname != "buyin.jinritemai.com") {
                try {
                    my_socket.close();
                } catch (e) {
                    console.error("关闭旧WebSocket连接失败:", e);
                }
                // 重新连接WebSocket
                connectWebSocket();
            }

            // 重置变量
            my_observer = null;
            targetNode = null;

            // 根据平台初始化对应的目标节点和观察器
            const platformConfig = {
                "www.douyu.com": {
                    selector: ".Barrage-list",
                    nodeClass: "Barrage-listItem",
                    usernameClass: "Barrage-nickName",
                    contentClass: "Barrage-content"
                },
                "live.kuaishou.com": {
                    selector: ".chat-history"
                },
                "mobile.yangkeduo.com": {
                    selector: ".MYFlHgGu"
                },
                "live.1688.com": {
                    selector: ".pc-living-room-message"
                },
                "tbzb.taobao.com": {
                    selector: "#liveComment"
                },
                "redlive.xiaohongshu.com": {
                    selector: ".comments"
                },
                "ark.xiaohongshu.com": {
                    selector: ".comments"
                },
                "channels.weixin.qq.com": {
                    selector: ".vue-recycle-scroller comment__list scroller ready direction-vertical"
                },
                "buyin.jinritemai.com": {
                    selector: "#comment-list-wrapper"
                },
                "www.tiktok.com": {
                    selector: ".flex-1"
                },
                "eos.douyin.com": {
                    selector: ".list-gdqoHn"
                }
            };

            // 获取当前平台配置
            const platform = platformConfig[hostname] ||
                             (hostname === "ark.xiaohongshu.com" ? platformConfig["redlive.xiaohongshu.com"] : null);

            if (!platform) {
                console.error("未知平台:", hostname);
                return false;
            }

            // 获取目标节点
            targetNode = document.querySelector(platform.selector);
            if (!targetNode) {
                console.warn("未找到目标DOM节点，可能页面未完全加载");
                return false;
            }

            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            // 由于各平台处理逻辑不同，这里简化为通用监听
                            // 实际生产中需要根据不同平台实现完整的处理逻辑
                            processDanmaku(node);
                        });
                    }
                });
            });

            return true;
        }

        // 处理弹幕消息的通用函数
        function processDanmaku(node) {
            try {
                let username = "";
                let content = "";
                let messageType = "comment"; // 默认为评论类型
                let additionalData = {};

                // 根据不同平台解析弹幕内容
                if (hostname === "www.douyu.com" && node.classList.contains("Barrage-listItem")) {
                    // 斗鱼直播弹幕处理
                    const spans = node.getElementsByTagName("span");
                    for (let span of spans) {
                        if (span.classList.contains("Barrage-nickName")) {
                            const tmp = span.textContent.trim().slice(0, -1);
                            if (tmp) username = tmp;
                        } else if (span.classList.contains("Barrage-content")) {
                            content = span.textContent.trim();
                        }
                    }
                } else if (hostname === "live.kuaishou.com") {
                    // 快手直播弹幕处理
                    if (node.querySelector(".comment-cell")) {
                        const commentCells = node.querySelectorAll(".comment-cell");

                        commentCells.forEach((cell) => {
                            const usernameElement = cell.querySelector(".username");
                            const commentElement = cell.querySelector(".comment");
                            const giftCommentElement = cell.querySelector(".gift-comment");
                            const likeElement = cell.querySelector(".like");

                            if (usernameElement && giftCommentElement) {
                                // 礼物消息
                                username = usernameElement.textContent.trim().replace("：", "");
                                content = giftCommentElement.textContent.trim();
                                messageType = "gift";
                                additionalData = { gift: content };
                            } else if (usernameElement && likeElement) {
                                // 点赞消息
                                username = usernameElement.textContent.trim().replace("：", "");
                                content = "点了个赞";
                                messageType = "like";
                            } else if (usernameElement && commentElement) {
                                // 评论消息
                                username = usernameElement.textContent.trim().replace("：", "");

                                // 提取评论内容（包括表情图片的替换）
                                const extractContent = (element) => {
                                    let text = "";
                                    element.childNodes.forEach((child) => {
                                        if (child.nodeType === Node.TEXT_NODE) {
                                            text += child.textContent.trim();
                                        } else if (child.nodeType === Node.ELEMENT_NODE) {
                                            if (child.tagName === "IMG" && child.classList.contains("emoji")) {
                                                text += child.getAttribute("alt") || "[表情]";
                                            } else {
                                                text += extractContent(child);
                                            }
                                        }
                                    });
                                    return text;
                                };

                                content = extractContent(commentElement);
                            }
                        });
                    }
                } else if (hostname === "mobile.yangkeduo.com" && node.classList.contains("_24Qh0Jmi")) {
                    // 拼多多直播弹幕处理
                    const usernameElement = node.querySelector(".t6fCgSnz");
                    const commentElement = node.querySelector("._16_fPXYP");

                    if (usernameElement && commentElement) {
                        username = usernameElement.textContent.trim().slice(0, -1);
                        content = commentElement.textContent.trim();
                    }
                } else if (hostname === "live.1688.com" && node.classList.contains("comment-message")) {
                    // 1688直播弹幕处理
                    const usernameElement = node.querySelector(".from");
                    const commentElement = node.querySelector(".msg-text");

                    if (usernameElement && commentElement) {
                        username = usernameElement.textContent.trim().slice(0, -1);
                        content = commentElement.textContent.trim();
                    }
                } else if (hostname === "tbzb.taobao.com" && node.classList.contains("itemWrap--EcN_tFIg")) {
                    // 淘宝直播弹幕处理
                    const spans = node.getElementsByTagName("span");

                    for (let span of spans) {
                        if (span.classList.contains("authorTitle--_Dl75ZJ6")) {
                            const tmp = span.textContent.trim().slice(0, -1);
                            if (tmp) username = tmp;
                        } else if (span.classList.contains("content--pSjaTkyl")) {
                            content = span.textContent.trim();
                        }
                    }
                } else if ((hostname === "redlive.xiaohongshu.com" || hostname === "ark.xiaohongshu.com") &&
                          node.classList.contains("comment-list-item")) {
                    // 小红书直播弹幕处理
                    const spans = node.getElementsByTagName("span");

                    for (let i = 0; i < spans.length; i++) {
                        // 有些消息带有标签信息
                        if (spans[i].classList.contains("live-tag")) {
                            additionalData.tag = spans[i].textContent.trim().slice(0, -1);
                        }

                        // 通常用户名和内容是最后两个span
                        if (i == (spans.length - 2)) {
                            username = spans[i].textContent.trim().slice(0, -1);
                        } else if (i == (spans.length - 1)) {
                            content = spans[i].textContent.trim();
                        }
                    }
                } else if (hostname === "channels.weixin.qq.com" &&
                          node.classList.contains("vue-recycle-scroller__item-view")) {
                    // 微信视频号直播弹幕处理
                    const spans = node.getElementsByTagName("span");
                    let messageTypeElement = node.querySelector(".message-type");

                    if (messageTypeElement) {
                        const messageTypeText = messageTypeElement.textContent.trim();
                        if (messageTypeText.includes("礼物")) {
                            messageType = "gift";
                        } else if (messageTypeText.includes("点赞")) {
                            messageType = "like";
                        }
                    }

                    for (let i = 0; i < spans.length; i++) {
                        if (i == (spans.length - 2)) {
                            username = spans[i].textContent.trim().slice(0, -1);
                        } else if (i == (spans.length - 1)) {
                            content = spans[i].textContent.trim();
                        }
                    }
                } else if (hostname === "buyin.jinritemai.com" && node.classList.contains("commentItem-AzWZJ8")) {
                    // 巨量百应直播弹幕处理
                    const nicknameDiv = node.querySelector(".nickname-H277c7");
                    const descriptionDiv = node.querySelector(".description-ml2w_d");

                    if (nicknameDiv) {
                        // 获取用户名 - 排除头衔div，只获取直接文本
                        let textContent = '';
                        nicknameDiv.childNodes.forEach(node => {
                            // 只处理文本节点
                            if (node.nodeType === Node.TEXT_NODE) {
                                textContent += node.textContent;
                            }
                        });
                        // 清理文本
                        username = textContent.trim();
                        if (username.endsWith('：')) {
                            username = username.slice(0, -1);
                        }
                    }

                    if (descriptionDiv) {
                        content = descriptionDiv.textContent.trim();
                    }
                } else if (hostname === "www.tiktok.com" && node.classList.contains("break-words")) {
                    const nicknameDiv = node.querySelector(".truncate");
                    const commentDiv = node.querySelector(".align-middle");

                    if (nicknameDiv) {
                        // 获取用户名 - 排除头衔div，只获取直接文本
                        let textContent = '';
                        nicknameDiv.childNodes.forEach(node => {
                            // 只处理文本节点
                            if (node.nodeType === Node.TEXT_NODE) {
                                textContent += node.textContent;
                            }
                        });
                        // 清理文本
                        username = textContent.trim();
                    }

                    if (commentDiv) {
                        content = commentDiv.textContent.trim();
                    }
                } else if (hostname === "eos.douyin.com" && node.classList.contains("item-x_bazm")) {
                    // 拼多多直播弹幕处理
                    const usernameElement = node.querySelector(".item-name-qalgHb");
                    const commentElement = node.querySelector(".item-content-kHjdRK");

                    if (usernameElement && commentElement) {
                        username = usernameElement.textContent.trim().slice(0, -1);
                        content = commentElement.textContent.trim();
                    }
                }

                // 如果解析成功，发送消息
                if (username && content) {
                    // 根据消息类型显示不同类型的提示
                    let messageIcon, messageColor;
                    if (messageType === "gift") {
                        messageIcon = "[礼物消息]";
                        messageColor = "success";
                    } else if (messageType === "like") {
                        messageIcon = "[点赞消息]";
                        messageColor = "info";
                    } else {
                        messageIcon = "[弹幕消息]";
                        messageColor = "info";
                    }

                    if (content == "送" && hostname === "live.kuaishou.com") {
                        // 过滤
                    } else {
                        console.log(`${username}: ${content} (${messageType})`);
                        showMessage(`${messageIcon} ${username}: ${content}`, messageColor);

                        // 构造数据
                        const data = {
                            type: messageType,
                            username: username,
                            content: content,
                            data: additionalData
                        };

                        // 发送到WebSocket服务器
                        if (my_socket && my_socket.readyState === WebSocket.OPEN) {
                            my_socket.send(JSON.stringify(data));
                        }
                    }
                }
            } catch (error) {
                console.error("处理弹幕时出错:", error);
            }
        }

        function retryObserve() {
            try {
                // 尝试初始化观察器和目标节点
                if (!targetNode || !my_observer) {
                    console.log("初始化观察所需变量...");
                    if (!initObserver()) {
                        throw new Error("初始化失败，将在延迟后重试");
                    }
                }

                // 开始观察
                my_observer.observe(targetNode, config);

                // 重置重试计数
                observeRetryCount = 0;
                console.log("观察成功启动！");
                showMessage("观察成功启动！", 'success');
            } catch (error) {
                console.error("观察失败:", error);
                showMessage("观察失败: " + error.message, 'error');

                // 增加重试计数
                observeRetryCount++;

                if (observeRetryCount <= maxObserveRetries) {
                    // 使用更平滑的指数退避
                    const retryDelay = Math.min(
                        baseRetryDelay * (1 + (observeRetryCount - 1) * 0.5),
                        30000 // 最大延迟不超过30秒
                    );

                    console.log(`第${observeRetryCount}次重试失败，${retryDelay/1000}秒后将再次尝试...`);
                    showMessage(`第${observeRetryCount}次重试失败，${retryDelay/1000}秒后将再次尝试...`, 'warning');

                    setTimeout(retryObserve, retryDelay);
                } else {
                    console.error(`已达到最大重试次数(${maxObserveRetries})，观察启动失败！`);
                    showMessage(`已达到最大重试次数(${maxObserveRetries})，观察启动失败！如需继续，请刷新页面重试。`, 'error');
                }
            }
        }

        // 初始化观察
        retryObserve();

    }, 10000);
})();
