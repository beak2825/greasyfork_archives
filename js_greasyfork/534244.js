// ==UserScript==
// @name         微果AI无人直播-弹幕监听助手
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  微果AI无人直播-弹幕监听助手接入场控系统
// @author         CN-P5
// @contributor    CN-P5
// @match        *://www.douyu.com/*
// @match        *://live.kuaishou.com/u/*
// @match        *://live.kuaishou.com/u/*
// @match        *://mobile.yangkeduo.com/*
// @match        *://live.1688.com/zb/play.html*
// @match        *://tbzb.taobao.com/live*
// @match        *://redlive.xiaohongshu.com/*
// @match        *://www.xiaohongshu.com/livestream/*
// @match        *://channels.weixin.qq.com/platform/live/*
// @match        *://buyin.jinritemai.com/dashboard/live/control*
// @match        *://ark.xiaohongshu.com/live_center_control*
// @grant        none
// @namespace    https://greasyfork.org/scripts/490966
// @supportURL   https://docs.des8.com
// @homepageURL  https://docs.des8.com
// @license      GPL-3.0
// @icon           data: image / png; base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8 / 9hAAAASUlEQVQ4jWNgoCYwMTH5b2Ji8p9ceZwKidZIsY2kYhQDSAW0MYAUg8h2AbJltA8DWGiTZQB6lJHlApK8QFFCghlCMMmSoZYgAAAvUMVwhox / egAAAABJRU5ErkJggg ==
// @downloadURL https://update.greasyfork.org/scripts/534244/%E5%BE%AE%E6%9E%9CAI%E6%97%A0%E4%BA%BA%E7%9B%B4%E6%92%AD-%E5%BC%B9%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/534244/%E5%BE%AE%E6%9E%9CAI%E6%97%A0%E4%BA%BA%E7%9B%B4%E6%92%AD-%E5%BC%B9%E5%B9%95%E7%9B%91%E5%90%AC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    "use strict";
    let wsUrl = "ws://127.0.0.1:8889";
    var tip = [];
    var live_name = '';
    var live_avatar = '';
    // 在文件开头添加一个函数，用于创建和显示消息框
    function showMessageBox(message, type = 'info') {
        const messageBox = document.createElement('div');
        messageBox.className = `message-box ${type}`;
        messageBox.innerText = message;
        // 设置样式，消息上方居中
        messageBox.style.position = 'fixed';
        messageBox.style.left = '45%';
        messageBox.style.transform = 'translateX(-50%)';
        messageBox.style.top = `45%`; // 每个消息框之间的间距
        messageBox.style.zIndex = '9999';
        messageBox.style.padding = '10px';
        // 设置info、success、error、warning等多个颜色，要好看，参考element-ui
        messageBox.style.backgroundColor = type === 'info' ? '#409EFF' : type === 'success' ? '#67C23A' : type === 'warning' ? '#E6A23C' : '#F56C6C';
        messageBox.style.backgroundColor = 'rgb(235 48 48 / 78%)';
        messageBox.style.color = 'white';
        messageBox.style.borderRadius = '5px';
        messageBox.style.marginBottom = '10px';
        messageBox.style.transition = 'opacity 0.5s ease';
        // 字体要大
        messageBox.style.fontSize = '16px';
        document.body.appendChild(messageBox);
        // 自动消失
        // setTimeout(() => {
        //     messageBox.style.opacity = '0';
        //     setTimeout(() => {
        //         document.body.removeChild(messageBox);
        //     }, 500);
        // }, 3000); // 3秒后消失
        // 限制消息框数量
        const messageBoxes = document.querySelectorAll('.message-box');
        if (messageBoxes.length > 5) { // 限制最多显示5个消息框
            document.body.removeChild(messageBoxes[0]);
        }
    }
    function showMessageToConsole(message, type = 'info') {
        console.log('弹幕助手', type, message)
    }
    showMessageBox('直播弹幕监听助手中...', 'info');

    setTimeout(function () {
        let my_socket = null;
        let targetNode = null;
        let my_observer = null;
        const hostname = window.location.hostname;
        if (hostname === "www.douyu.com") {
            console.log("当前直播平台：斗鱼");
            showMessageToConsole("当前直播平台：斗鱼");
        } else if (hostname === "live.kuaishou.com") {
            console.log("当前直播平台：快手");
            showMessageToConsole("当前直播平台：快手");
        } else if (hostname === "mobile.yangkeduo.com") {
            console.log("当前直播平台：拼多多");
        } else if (hostname === "live.1688.com") {
            console.log("当前直播平台：1688");
            showMessageToConsole("当前直播平台：1688");
        } else if (hostname === "tbzb.taobao.com") {
            console.log("当前直播平台：淘宝");
            showMessageToConsole("当前直播平台：淘宝");
        } else if (hostname === "redlive.xiaohongshu.com" || hostname === "ark.xiaohongshu.com") {
            console.log("当前直播平台：小红书");
            showMessageToConsole("当前直播平台：小红书");
        } else if (hostname === "channels.weixin.qq.com") {
            console.log("当前直播平台：微信视频号");
            showMessageToConsole("当前直播平台：微信视频号");
        } else if (hostname === "buyin.jinritemai.com") {
            console.log("当前直播平台：巨量百应");
            showMessageToConsole("当前直播平台：巨量百应");
        }
        var page_videos = document.getElementsByTagName('video');
        for (var i = 0; i < page_videos.length; i++) {
            page_videos[i].pause();
            page_videos[i].volume = 0;
        }
        if (tip.length >= 1) {
            var tip_str = '';
            tip.forEach((one_tip) => {
                if (one_tip) {
                    tip_str = tip_str + one_tip.text + "\r\n";
                }
            });
            if (typeof messageBox === undefined) {
                document.body.removeChild(messageBox);
            }
            showMessageBox(tip_str, 'info');
        }
        function connectWebSocket() {
            // 创建 WebSocket 连接，适配服务端
            my_socket = new WebSocket(wsUrl);
            // 当连接建立时触发
            my_socket.addEventListener("open", (event) => {
                console.log("ws连接打开");
                var hint = setInterval(function () {
                    if (live_name && live_avatar) {
                        // 向服务器发送一条消息
                        const data = {
                            type: "info",
                            content: "ws连接成功",
                            name: live_name,
                            avatar: live_avatar
                        };
                        console.log(data);
                        my_socket.send(JSON.stringify(data));
                        clearInterval(hint)
                    } else {
                        if (hostname != "buyin.jinritemai.com") { }
                        if (hostname === "www.douyu.com") { }
                        else if (hostname === "live.kuaishou.com") {
                            live_name = document.querySelector('.name-group > .name').innerText;
                            live_avatar = document.querySelector('img.avatar').src;
                        } else if (hostname === "redlive.xiaohongshu.com" || hostname === "ark.xiaohongshu.com" || hostname === "www.xiaohongshu.com") {
                            live_name = document.querySelector('.author > .name').innerText;
                            live_avatar = document.querySelector('.author-wrapper > img.avatar').src;
                        }
                    }
                }, 1000);
            });
            // 当收到消息时触发
            my_socket.addEventListener("message", (event) => {
                console.log("收到服务器数据:", event.data);
                showMessageToConsole("收到服务器数据: " + event.data);
            });
            // 当连接关闭时触发
            my_socket.addEventListener("close", (event) => {
                console.log("WS连接关闭");
                showMessageToConsole("WS连接关闭", 'error');
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
        if (hostname === "www.douyu.com") {
            // 选择需要观察变化的节点
            targetNode = document.querySelector(".Barrage-list");
            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的弹幕消息
                            if (node.classList.contains("Barrage-listItem")) {
                                // 新增的动态DOM元素处理
                                // console.log('Added node:', node);
                                const spans = node.getElementsByTagName("span");
                                let username = "";
                                let content = "";
                                for (let span of spans) {
                                    //console.log(span);
                                    if (span.classList.contains("Barrage-nickName")) {
                                        const targetSpan = span;
                                        // 获取用户名
                                        let tmp = targetSpan.textContent.trim().slice(0, -1);
                                        if (tmp != "")
                                            username = targetSpan.textContent.trim().slice(0, -1);
                                    } else if (span.classList.contains("Barrage-content")) {
                                        const targetSpan = span;
                                        // 获取弹幕内容
                                        content = targetSpan.textContent.trim();
                                    }
                                }
                                console.log(username + ":" + content);
                                showMessageToConsole("[弹幕消息] " + username + ":" + content, 'info');
                                // 获取到弹幕数据
                                if (username != "" && content != "") {
                                    const data = {
                                        type: "comment",
                                        username: username,
                                        content: content,
                                        data: {}
                                    };
                                    console.log(data);
                                    my_socket.send(JSON.stringify(data));
                                }
                            }
                        });
                    }
                });
            });
        } else if (hostname === "live.kuaishou.com") {
            if (live_name && live_avatar) {
                // 向服务器发送一条消息
                const data = {
                    type: "info",
                    content: "直播间信息",
                    name: live_name,
                    avatar: live_avatar
                };
                console.log(data);
                my_socket.send(JSON.stringify(data));
            }
            // 选择需要观察变化的节点
            targetNode = document.querySelector(".chat-history");

            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    console.log('观察效果', mutation);
                    // console.log(mutation.type);
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的消息节点
                            if (node.querySelector(".comment-cell")) {
                                const commentCells = node.querySelectorAll(".comment-cell");

                                commentCells.forEach((cell) => {
                                    const usernameElement = cell.querySelector(".username");
                                    const commentElement = cell.querySelector(".comment");
                                    const emojiElement = cell.querySelector("img.emoji");
                                    const giftCommentElement = cell.querySelector(".gift-comment");
                                    const likeElement = cell.querySelector(".like");

                                    if (usernameElement && giftCommentElement) {
                                        // 礼物处理逻辑
                                        const username = usernameElement.textContent.trim().replace("：", "");
                                        const giftContent = giftCommentElement.textContent.trim();

                                        console.log(`${username}送出了礼物: ${giftContent}`);
                                        showMessageToConsole(`[礼物消息] ${username}送出了礼物: ${giftContent}`, 'success');

                                        // 如果 my_socket 已经初始化，可以发送礼物数据
                                        if (my_socket) {
                                            const data = {
                                                type: "gift",
                                                username: username,
                                                gift: giftContent,
                                                data: {}
                                            };
                                            console.log(data);
                                            my_socket.send(JSON.stringify(data));
                                        }
                                    } else if (usernameElement && likeElement) {
                                        // 点赞处理逻辑
                                        const username = usernameElement.textContent.trim().replace("：", "");

                                        console.log(`${username}点了个赞`);
                                        showMessageToConsole(`[点赞消息] ${username}点了个赞`, 'info');

                                        // 如果 my_socket 已经初始化，可以发送点赞数据
                                        if (my_socket) {
                                            const data = {
                                                type: "like",
                                                username: username,
                                                data: {}
                                            };
                                            console.log(data);
                                            my_socket.send(JSON.stringify(data));
                                        }
                                    } else if (usernameElement && commentElement) {
                                        // 弹幕处理逻辑
                                        const username = usernameElement.textContent.trim().replace("：", "");
                                        let content = "";

                                        // 提取评论内容（包括表情图片的替换）
                                        function extractCommentContent(element) {
                                            let content = "";
                                            element.childNodes.forEach((child) => {
                                                if (child.nodeType === Node.TEXT_NODE) {
                                                    content += child.textContent.trim();
                                                } else if (child.nodeType === Node.ELEMENT_NODE) {
                                                    if (child.tagName === "IMG" && child.classList.contains("emoji")) {
                                                        content += child.getAttribute("alt") || "[表情]";
                                                    } else {
                                                        content += extractCommentContent(child);
                                                    }
                                                }
                                            });
                                            return content;
                                        }

                                        content = extractCommentContent(commentElement);

                                        if (username && content) {
                                            console.log(`${username}: ${content}`);
                                            showMessageToConsole(`[弹幕消息] ${username}: ${content}`, 'info');

                                            // 构造弹幕数据
                                            const data = {
                                                type: "comment",
                                                username: username,
                                                content: content,
                                                data: {}
                                            };
                                            console.log(data);

                                            // 如果 my_socket 已经初始化，可以发送数据
                                            if (my_socket) {
                                                my_socket.send(JSON.stringify(data));
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            });
        } else if (hostname === "mobile.yangkeduo.com") {
            // 选择需要观察变化的节点
            targetNode = document.querySelector(".MYFlHgGu");

            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的弹幕消息
                            if (node.classList.contains("_24Qh0Jmi")) {
                                // 新增的动态DOM元素处理
                                console.log("Added node:", node);

                                const usernameElement = node.querySelector(".t6fCgSnz");
                                const commentElement = node.querySelector("._16_fPXYP");

                                if (
                                    usernameElement &&
                                    commentElement
                                ) {
                                    const username = usernameElement.textContent.trim().slice(0, -1);
                                    const content = commentElement.textContent.trim();

                                    console.log(username + ":" + content);
                                    showMessageToConsole("[弹幕消息] " + username + ":" + content, 'info');


                                    // 获取到弹幕数据
                                    if (username !== "" && content !== "") {
                                        const data = {
                                            type: "comment",
                                            username: username,
                                            content: content,
                                            data: {}
                                        };
                                        console.log(data);
                                        // 如果 my_socket 已经初始化，可以在这里发送数据
                                        if (my_socket) {
                                            my_socket.send(JSON.stringify(data));
                                        }
                                    }
                                }
                            }
                        });
                    }
                });
            });
        } else if (hostname === "live.1688.com") {
            // 选择需要观察变化的节点
            targetNode = document.querySelector(".pc-living-room-message");

            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的弹幕消息
                            if (node.classList.contains("comment-message")) {
                                // 新增的动态DOM元素处理
                                console.log("Added node:", node);

                                const usernameElement = node.querySelector(".from");
                                const commentElement = node.querySelector(".msg-text");

                                if (
                                    usernameElement &&
                                    commentElement
                                ) {
                                    const username = usernameElement.textContent.trim().slice(0, -1);
                                    const content = commentElement.textContent.trim();

                                    console.log(username + ":" + content);
                                    showMessageToConsole("[弹幕消息] " + username + ":" + content, 'info');


                                    // 获取到弹幕数据
                                    if (username !== "" && content !== "") {
                                        const data = {
                                            type: "comment",
                                            username: username,
                                            content: content,
                                            data: {}
                                        };
                                        console.log(data);
                                        // 如果 my_socket 已经初始化，可以在这里发送数据
                                        if (my_socket) {
                                            my_socket.send(JSON.stringify(data));
                                        }
                                    }
                                }
                            }
                        });
                    }
                });
            });
        } else if (hostname === "tbzb.taobao.com") {
            targetNode = document.querySelector("#liveComment");

            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {

                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的弹幕消息
                            if (node.classList.contains("itemWrap--EcN_tFIg")) {
                                // 新增的动态DOM元素处理
                                console.log('Added node:', node);

                                const spans = node.getElementsByTagName("span");

                                let username = "";
                                let content = "";

                                for (let span of spans) {
                                    //console.log(span);
                                    if (span.classList.contains("authorTitle--_Dl75ZJ6")) {
                                        const targetSpan = span;
                                        // 获取用户名
                                        let tmp = targetSpan.textContent.trim().slice(0, -1);
                                        if (tmp != "")
                                            username = targetSpan.textContent.trim().slice(0, -1);
                                    } else if (span.classList.contains("content--pSjaTkyl")) {
                                        const targetSpan = span;
                                        // 获取弹幕内容
                                        content = targetSpan.textContent.trim();
                                    }
                                }

                                console.log(username + ":" + content);
                                showMessageToConsole("[弹幕消息] " + username + ":" + content, 'info');


                                // 获取到弹幕数据
                                if (username != "" && content != "") {
                                    const data = {
                                        type: "comment",
                                        username: username,
                                        content: content,
                                        data: {}
                                    };
                                    console.log(data);
                                    my_socket.send(JSON.stringify(data));
                                }
                            }
                        });
                    }
                });
            });
        } else if (hostname === "redlive.xiaohongshu.com" || hostname === "ark.xiaohongshu.com" || hostname === "www.xiaohongshu.com") {
            if (live_name && live_avatar) {
                // 向服务器发送一条消息
                const data = {
                    type: "info",
                    content: "直播间信息",
                    name: live_name,
                    avatar: live_avatar
                };
                console.log(data);
                my_socket.send(JSON.stringify(data));
            }
            // 选择需要观察变化的节点
            targetNode = document.querySelector(".comment-list");
            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    console.log(mutation);
                    // console.log(mutation.type);
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的弹幕消息
                            if (node.classList.contains("comment-item")) {
                                // 新增的动态DOM元素处理
                                console.log("Added node:", node);
                                const spans = node.getElementsByTagName("span");
                                let live_tag = "";
                                let username = "";
                                let content = "";
                                const usernameElement = node.querySelector("span.nickname");
                                const CommentElement = node.querySelector("span.desc");
                                if (usernameElement && CommentElement) {
                                    username = usernameElement.textContent.trim().replace(":", "");
                                    content = CommentElement.textContent.trim();
                                }
                                // console.log(spans.length);
                                console.log(username + ":" + content);
                                showMessageToConsole("[弹幕消息] " + username + ":" + content, 'info');


                                // 获取到弹幕数据
                                if (username != "" && content != "") {
                                    const data = {
                                        type: "comment",
                                        username: username,
                                        content: content,
                                        data: {}
                                    };
                                    console.log(data);
                                    my_socket.send(JSON.stringify(data));
                                }
                            }
                        });
                    }
                });
            });
        } else if (hostname === "channels.weixin.qq.com") {
            // 选择需要观察变化的节点
            targetNode = document.querySelector(".comment__list");

            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    console.log(mutation);
                    // console.log(mutation.type);
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的弹幕消息
                            if (node.classList.contains("vue-recycle-scroller__item-view")) {
                                // 新增的动态DOM元素处理
                                console.log("Added node:", node);

                                const spans = node.getElementsByTagName("span");

                                let message_type = "";
                                let username = "";
                                let content = "";

                                console.log(spans.length);

                                for (let i = 0; i < spans.length; i++) {
                                    if (spans[i].classList.contains("message-type")) {
                                        const targetSpan = spans[i];
                                        // 获取用户名
                                        let tmp = targetSpan.textContent.trim().slice(0, -1);
                                        if (tmp != "")
                                            message_type = targetSpan.textContent.trim().slice(0, -1);
                                    }

                                    if (i == (spans.length - 2)) {
                                        const targetSpan = spans[i];
                                        // 获取用户名
                                        let tmp = targetSpan.textContent.trim().slice(0, -1);
                                        if (tmp != "")
                                            username = tmp;
                                    } else if (i == (spans.length - 1)) {
                                        const targetSpan = spans[i];
                                        // 获取弹幕
                                        let tmp = targetSpan.textContent.trim();
                                        if (tmp != "")
                                            content = tmp;
                                    }
                                }

                                console.log(username + ":" + content);
                                showMessageToConsole("[弹幕消息] " + username + ":" + content, 'info');

                                // 获取到弹幕数据
                                if (username != "" && content != "") {
                                    const data = {
                                        type: "comment",
                                        username: username,
                                        content: content,
                                        data: {}
                                    };
                                    console.log(data);
                                    my_socket.send(JSON.stringify(data));
                                }
                            }
                        });
                    }
                });
            });
        } else if (hostname === "buyin.jinritemai.com") {
            // 选择需要观察变化的节点
            targetNode = document.querySelector("#comment-list-wrapper");

            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    console.log(mutation);
                    // console.log(mutation.type);
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的弹幕消息
                            if (node.classList.contains("commentItem-AzWZJ8")) {
                                // 新增的动态DOM元素处理
                                console.log('Added node:', node);

                                const nicknameDiv = node.querySelector(".nickname-H277c7");
                                const descriptionDiv = node.querySelector(".description-ml2w_d");

                                let username = "";
                                let content = "";

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
                                    // 获取弹幕内容
                                    content = descriptionDiv.textContent.trim();
                                }

                                console.log(username + ":" + content);
                                showMessageToConsole("[弹幕消息] " + username + ":" + content, 'info');

                                // 获取到弹幕数据
                                if (username != "" && content != "") {
                                    const data = {
                                        type: "comment",
                                        username: username,
                                        content: content,
                                        data: {}
                                    };
                                    console.log(data);
                                    my_socket.send(JSON.stringify(data));
                                }
                            }
                        });
                    }
                });
            });
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
                button.addEventListener('mouseover', function () {
                    this.style.opacity = '0.8';
                });
                button.addEventListener('mouseout', function () {
                    this.style.opacity = '1';
                });
            }

            // 添加输入框焦点效果
            const inputs = configDiv.getElementsByTagName('input');
            for (let input of inputs) {
                input.addEventListener('focus', function () {
                    this.style.borderColor = '#409EFF';
                });
                input.addEventListener('blur', function () {
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
                showMessageToConsole('WebSocket地址格式错误，必须以ws://或wss://开头', 'error');
                return;
            }

            try {
                new URL(newWsUrl);
                wsUrl = newWsUrl; // 更新 WebSocket 地址
                showMessageToConsole('配置保存成功', 'success');
            } catch (error) {
                showMessageToConsole('WebSocket地址格式无效', 'error');
            }
        }

        // 应用配置
        function applyConfig() {
            const itemIndicesInput = document.getElementById('itemIndices').value;
            if (!itemIndicesInput.trim()) {
                showMessageToConsole('请输入商品编号', 'warning');
                return;
            }

            const delay = parseInt(document.getElementById('delay').value, 10);
            const cycleDelay = parseInt(document.getElementById('cycleDelay').value, 10);

            // 验证延迟时间
            if (delay < 0 || isNaN(delay)) {
                showMessageToConsole('触发延迟时间必须大于0', 'warning');
                return;
            }
            if (cycleDelay < 0 || isNaN(cycleDelay)) {
                showMessageToConsole('循环周期延迟时间必须大于0', 'warning');
                return;
            }

            const itemIndices = itemIndicesInput.split(' ')
                .filter(str => str.trim() !== '')
                .map(str => parseInt(str.trim(), 10));

            // 验证商品编号
            if (itemIndices.some(index => isNaN(index) || index <= 0)) {
                showMessageToConsole('商品编号必须为正整数', 'warning');
                return;
            }

            const applyBtn = document.getElementById('applyConfig');
            const isRunning = applyBtn.textContent === '停止自动弹窗';

            if (isRunning) {
                // 如果当前正在运行,则停止
                stopLoop();
                applyBtn.textContent = '启动自动弹窗';
                applyBtn.style.backgroundColor = '#67C23A';
                showMessageToConsole('自动弹窗已停止', 'info');
            } else {
                // 如果当前已停止,则启动
                startLoop(itemIndices, delay, cycleDelay);
                applyBtn.textContent = '停止自动弹窗';
                applyBtn.style.backgroundColor = '#F56C6C';
                showMessageToConsole('自动弹窗已启动', 'success');
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
                    if (buttons[buttonIndex]) {
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

        try {
            // 开始观察
            my_observer.observe(targetNode, config);
        } catch (error) {
            console.error("观察失败:", error);
            showMessageToConsole("观察失败: " + error.message, 'error');
            setTimeout(() => {
                console.log("10S后尝试重新开始观察...");
                // 开始观察
                my_observer.observe(targetNode, config);
            }, 10000);
        }

    }, 10000);
})();
