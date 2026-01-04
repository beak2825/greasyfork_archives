// ==UserScript==
// @name         猫耳迎宾机器人
// @version      1.7.7.3
// @description  一个简单的迎宾机器人
// @author       洋子
// @match        https://fm.missevan.com/live/*
// @match        https://www.xinglai.com/horoscope/*/daily/current.html
// @icon         https://static.maoercdn.com/avatars/202408/25/2bf1715cfc845d8b4da511d8f5345fec210801.jpg?x-oss-process=style/avatar
// @grant        none
// @namespace    https://greasyfork.org/users/1357490
// @require      https://cdn.jsdelivr.net/npm/pinyin-pro@3.18.2/dist/index.js
// @downloadURL https://update.greasyfork.org/scripts/505115/%E7%8C%AB%E8%80%B3%E8%BF%8E%E5%AE%BE%E6%9C%BA%E5%99%A8%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/505115/%E7%8C%AB%E8%80%B3%E8%BF%8E%E5%AE%BE%E6%9C%BA%E5%99%A8%E4%BA%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 星座对应的英文名称映射
    const zodiacMap = {
        "白羊": "aries",
        "金牛": "taurus",
        "双子": "gemini",
        "巨蟹": "cancer",
        "狮子": "leo",
        "处女": "virgo",
        "天秤": "libra",
        "天蝎": "scorpio",
        "射手": "sagittarius",
        "摩羯": "capricorn",
        "水瓶": "aquarius",
        "双鱼": "pisces"
    };

    // 从当前网址获取房间号
    let roomId = window.location.pathname.split("/").pop();

    // 欢迎用户列表
    let welcomedUsers = [];

    // 存储已处理的消息 ID
    let processedMsgIds = new Set();

    // 全局变量，用于存储歌曲列表
    let songList = [];
    let isWelcomingEnabled = true;
    let isHistoryFetchingEnabled = true;

    // 打卡数据文件
    const checkInDataKey = "checkInData";

    // DP 字符数据文件
    const dpLibraryKey = "dpLibrary";

    // 欢迎词数据文件
    const welcomeMessagesKey = "welcomeMessages";

    // 字符编号
    let nextDpId = parseInt(localStorage.getItem('nextDpId') || '0', 10);

    let isFetching = false; // 标志变量，表示是否正在获取数据

    // 定义 MutationObserver 来监听消息列表的变化
    const targetNode = document.querySelector('.prelude-scrollable.prelude-css-scrollbar.prelude-vertical.content');

    // 配置观察器的选项：观察子节点的变化
    const config = { childList: true, subtree: true };

    // 创建可隐藏的控制面板和按钮的容器
    function createControlPanelContainer() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.left = '10px'; // 从左侧展开
        container.style.zIndex = '10000';

        const panel = document.createElement('div');
        panel.style.backgroundColor = '#f0f0f0';
        panel.style.border = '1px solid #ccc';
        panel.style.width = '400px'; // 调整宽度
        panel.style.height = '300px'; // 调整高度
        panel.style.display = 'none'; // 默认隐藏
        panel.style.position = 'relative'; // 使面板在容器内定位
        panel.style.display = 'flex'; // 使用flex布局

        // 左侧菜单
        const menu = document.createElement('div');
        menu.style.width = '100px'; // 左侧菜单的宽度
        menu.style.borderRight = '1px solid #ccc';
        menu.style.padding = '10px';
        menu.style.display = 'flex';
        menu.style.flexDirection = 'column';

        // 创建左侧菜单项
        const createMenuButton = (text) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.marginBottom = '5px';
            button.style.backgroundColor = 'transparent';  // 隐藏按钮背景
            button.style.border = 'none';  // 隐藏按钮边框
            button.style.cursor = 'pointer';  // 设置为手型指针
            return button;
        };

        const indexTab = createMenuButton('主 页');
        const basicSettingsTab = createMenuButton('基本设置');
        const dpSettingsTab = createMenuButton('灯牌设置');
        const welcomeSettingsTab = createMenuButton('欢迎设置');
        const ShortcutsTab = createMenuButton('快捷工具');
        const imageDownloadTab = createMenuButton('图片下载');

        // 将菜单项添加到菜单容器
        menu.appendChild(document.createElement('hr'));  // 创建横线
        menu.appendChild(indexTab);
        menu.appendChild(document.createElement('hr'));  // 创建横线
        menu.appendChild(basicSettingsTab);
        menu.appendChild(document.createElement('hr'));  // 创建横线
        menu.appendChild(dpSettingsTab);
        menu.appendChild(document.createElement('hr'));  // 创建横线
        menu.appendChild(welcomeSettingsTab);
        menu.appendChild(document.createElement('hr'));  // 创建横线
        menu.appendChild(ShortcutsTab);
        menu.appendChild(document.createElement('hr'));  // 创建横线
        menu.appendChild(imageDownloadTab);
        menu.appendChild(document.createElement('hr'));  // 创建横线

        // 右侧内容区
        const contentArea = document.createElement('div');
        contentArea.style.flex = '1';
        contentArea.style.padding = '10px';
        contentArea.style.overflowY = 'auto'; // 允许滚动

        const indexContent = `
<h3>主页</h3>
<hr>
<p>本脚本无偿提供给所有猫耳FM主播使用，内容不定时更新。</p>
<p>作者：S洋子 | Mid：3368718</p>
<p>发布地址/历史更新：<a href="https://greasyfork.org/zh-CN/scripts/505115-%E7%8C%AB%E8%80%B3%E8%BF%8E%E5%AE%BE%E6%9C%BA%E5%99%A8%E4%BA%BA/versions?version=1444876" target="_blank">点击跳转</a></p>
<p>说明书：<a href="https://docs.qq.com/doc/DRmFyTHZDTHdPaW1H" target="_blank">点击跳转</a></p>
`;

        const basicSettingsContent = `
<h3>基本设置</h3>
<hr>
<div>
    <label for="roomIdInput">房间号:</label>
    <input type="text" id="roomIdInput" value="${roomId}">
</div>
<div>
    <label for="welcomeToggle">启用/禁用欢迎用户功能:</label>
    <input type="checkbox" id="welcomeToggle" ${isWelcomingEnabled ? 'checked' : ''}>
</div>
<div>
    <label for="historyToggle">启用/禁用信息回应功能:</label>
    <input type="checkbox" id="historyToggle" ${isHistoryFetchingEnabled ? 'checked' : ''}>
</div>
<button id="saveSettingsBtn">保存设置</button>
`;

        const dpSettingsContent = `
<h3>灯牌设置</h3>
<hr>
<div>
    <label for="dpInput">灯牌字符:</label>
    <textarea id="dpInput" rows="4" cols="50" placeholder="输入多行 DP 字符..."></textarea>
</div>
<div>
    <label for="dpId">灯牌编号:</label>
    <input type="number" id="dpId" min="0">
</div>
<div>
    <label for="dpDesc">灯牌描述:</label>
    <input type="text" id="dpDesc">
</div>
<button id="saveDpBtn">保存灯牌</button>
`;

        // 欢迎设置内容
        const welcomeSettingsContent = `
<h3>欢迎设置</h3>
<hr>
<div>
<label for="welcomeMessagesInput">欢迎词:</label>
<textarea id="welcomeMessagesInput" rows="4" cols="50" placeholder="输入多个欢迎词，使用/n/分隔..."></textarea>
</div>
<button id="saveWelcomeMessagesBtn">保存欢迎词</button>
<p style="font-size: 16px;">多行示例：</p>
<p style="font-size: 14px;">欢迎 {username}</p>
<p style="font-size: 14px;">拼音是 {pinyin}</p>
<p style="font-size: 14px;">加入时间是 {date}</p>
<p style="font-size: 14px;">/n/</p>
<p style="font-size: 16px;">单行行示例：</p>
<p style="font-size: 14px;">嗨 {username}，拼音：{pinyin}，今天是 {date}，欢迎加入！/n/</p>
<hr>
<p style="font-size: 16px;">用法：</p>
<p style="font-size: 14px;"><p style="font-size: 14px;"><p style="font-size: 14px;">每段欢迎词以/n/符号隔开</p>
<p style="font-size: 14px;"><p style="font-size: 14px;">{username}代表要欢迎的用户名，{pinyin}代表用户名的拼音，{date}代表加入直播间的日期</p>
<p style="font-size: 16px;">注：/n/分隔符号不可少 {username} {pinyin} {date}一定要切换成英文输入法输入，或者直接复制</p>
<hr>
<p style="font-size: 16px;">看不明白的可以直接复制上面的示例</p>
`;

        const ShortcutsContent = `
<h3>快捷工具</h3>
<hr>
<button id="jumpButton">音频投稿</button>
`;

        // 创建图片下载内容
        const imageDownloadContent = `
<h3>图片下载</h3>
<hr>
<div id="imageGallery" style="display: flex; flex-wrap: wrap;"></div>
`;

        // 默认显示主页内容
        contentArea.innerHTML = indexContent;

        const resetButtonStyles = () => {
            indexTab.style.fontWeight = 'normal';
            basicSettingsTab.style.fontWeight = 'normal';
            dpSettingsTab.style.fontWeight = 'normal';
            welcomeSettingsTab.style.fontWeight = 'normal';
            ShortcutsTab.style.fontWeight = 'normal';
            imageDownloadTab.style.fontWeight = 'normal';
        };


        // 切换到主页
        indexTab.addEventListener('click', () => {
            contentArea.innerHTML = indexContent;
            resetButtonStyles();
            indexTab.style.fontWeight = 'bold';
        });

        // 切换到基本设置
        basicSettingsTab.addEventListener('click', () => {
            contentArea.innerHTML = basicSettingsContent;
            resetButtonStyles();
            basicSettingsTab.style.fontWeight = 'bold';

            document.getElementById('saveSettingsBtn').addEventListener('click', () => {
                roomId = document.getElementById('roomIdInput').value;
                isWelcomingEnabled = document.getElementById('welcomeToggle').checked;
                isHistoryFetchingEnabled = document.getElementById('historyToggle').checked;
                alert("设置已保存！");
            });
        });

        // 切换到 DP 设置
        dpSettingsTab.addEventListener('click', () => {
            contentArea.innerHTML = dpSettingsContent;
            resetButtonStyles();
            dpSettingsTab.style.fontWeight = 'bold';

            document.getElementById('saveDpBtn').addEventListener('click', () => {
                const dpId = parseInt(document.getElementById('dpId').value.trim(), 10);
                const dpChar = document.getElementById('dpInput').value.trim();
                const dpDesc = document.getElementById('dpDesc').value.trim();

                if (dpId >= 0 && dpChar && dpDesc) {
                    dpLibrary.set(dpId, { char: dpChar, desc: dpDesc });
                    saveDpLibrary();
                    alert("DP 字符已保存！");
                    document.getElementById('dpId').value = '';
                    document.getElementById('dpInput').value = '';
                    document.getElementById('dpDesc').value = '';
                } else {
                    alert("请填写正确的 DP 编号、字符和描述！");
                }
            });
        });

        // 切换到快捷工具设置
        ShortcutsTab.addEventListener('click', () => {
            contentArea.innerHTML = ShortcutsContent;
            resetButtonStyles();
            ShortcutsTab.style.fontWeight = 'bold';

            document.getElementById('jumpButton').onclick = () => window.open('https://www.missevan.com/msound/create', '_blank');

        });


        // 加载用户自定义欢迎词并显示在输入框中
        const loadCustomWelcomeMessages = () => {
            const messages = localStorage.getItem('customWelcomeMessages');
            return messages ? messages.split('/n/') : [];
        };

        // 在欢迎设置选项卡中添加事件监听
        welcomeSettingsTab.addEventListener('click', () => {
            contentArea.innerHTML = welcomeSettingsContent;
            resetButtonStyles();
            welcomeSettingsTab.style.fontWeight = 'bold';

            // 加载并显示欢迎词
            const customMessages = loadCustomWelcomeMessages();
            document.getElementById('welcomeMessagesInput').value = customMessages.join('/n/');

            // 保存按钮事件
            document.getElementById('saveWelcomeMessagesBtn').addEventListener('click', () => {
                let newMessages = document.getElementById('welcomeMessagesInput').value;

                // 去掉每条消息前后的空格或多余的换行符
                let cleanedMessages = newMessages.split('/n/').map(message => message.trim());

                // 将清理后的欢迎词重新组合并保存
                localStorage.setItem('customWelcomeMessages', cleanedMessages.join('/n/'));

                alert("欢迎词已保存！");
            });

        });

        // 在图片下载选项卡中添加事件监听
        imageDownloadTab.addEventListener('click', () => {
            contentArea.innerHTML = imageDownloadContent;
            resetButtonStyles();
            imageDownloadTab.style.fontWeight = 'bold';

            const imageGallery = document.getElementById('imageGallery');
            imageGallery.innerHTML = ''; // 清空当前图片库

            // 获取网页内所有图片
            const images = document.querySelectorAll('img');
            images.forEach((img, index) => {
                addImageToGallery(img, index);
            });

            // 创建观察者以检测新增图片
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach(node => {
                            if (node.tagName === 'IMG') {
                                const newIndex = imageGallery.children.length; // 计算新图片的索引
                                addImageToGallery(node, newIndex);
                            }
                        });
                    }
                });
            });

            // 观察整个文档的子节点变化
            observer.observe(document.body, { childList: true, subtree: true });
        });

        // 将图片添加到画廊
        function addImageToGallery(img, index) {
            const imageGallery = document.getElementById('imageGallery');
            const imageContainer = document.createElement('div');
            imageContainer.style.position = 'relative';
            imageContainer.style.margin = '10px';

            const imageElement = document.createElement('img');
            imageElement.src = img.src;
            imageElement.style.width = '150px'; // 设置图片宽度
            imageElement.style.height = 'auto'; // 保持比例

            const downloadButton = document.createElement('button');
            downloadButton.textContent = '下载';
            downloadButton.style.position = 'absolute';
            downloadButton.style.bottom = '10px';
            downloadButton.style.right = '10px';
            downloadButton.style.backgroundColor = '#007BFF';
            downloadButton.style.color = '#fff';
            downloadButton.style.border = 'none';
            downloadButton.style.cursor = 'pointer';
            downloadButton.style.padding = '5px 10px';

            // 设置下载按钮事件
            downloadButton.addEventListener('click', (event) => {
                event.stopPropagation(); // 阻止事件冒泡
                const a = document.createElement('a');
                a.href = img.src;
                a.download = `image_${index + 1}`; // 设置下载文件名
                document.body.appendChild(a);
                a.click(); // 模拟点击下载
                document.body.removeChild(a); // 移除临时链接
            });

            // 点击图片时在新标签页打开
            imageElement.addEventListener('click', () => {
                window.open(img.src, '_blank'); // 在新标签页打开图片
            });

            imageContainer.appendChild(imageElement);
            imageContainer.appendChild(downloadButton);
            imageGallery.appendChild(imageContainer);
        }

        panel.appendChild(menu);
        panel.appendChild(contentArea);

        // 创建控制面板按钮
        const toggleButton = document.createElement('button');
        toggleButton.style.background = 'url(https://static.maoercdn.com/avatars/202408/25/2bf1715cfc845d8b4da511d8f5345fec210801.jpg?x-oss-process=style/avatar) no-repeat center center';
        toggleButton.style.backgroundSize = 'cover';
        toggleButton.style.border = 'none';
        toggleButton.style.width = '50px';
        toggleButton.style.height = '50px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.textContent = ''; // 默认显示文字，便于访问性

        container.appendChild(toggleButton);
        container.appendChild(panel);
        document.body.appendChild(container);

        // 切换控制面板显示
        toggleButton.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        });

        return container;
    }

    // 创建并添加控制面板容器到页面
    createControlPanelContainer();




    // 从 localStorage 读取打卡数据
    function loadCheckInData() {
        const data = localStorage.getItem(checkInDataKey);
        return data ? JSON.parse(data) : {};
    }

    // 保存打卡数据到 localStorage
    function saveCheckInData() {
        localStorage.setItem(checkInDataKey, JSON.stringify(Object.fromEntries(checkInData)));
    }

    // 初始化打卡数据
    const checkInData = new Map(Object.entries(loadCheckInData()));

    // 从 localStorage 读取 DP 字符库
    function loadDpLibrary() {
        const data = localStorage.getItem(dpLibraryKey);
        const dpLibraryData = data ? JSON.parse(data) : {};

        // 恢复 DP 字符库
        return new Map(Object.entries(dpLibraryData).map(([id, { char, desc }]) => [parseInt(id, 10), { char, desc }]));
    }

    // 保存 DP 字符库到 localStorage
    function saveDpLibrary() {
        // 将 dpLibrary 转换为对象
        const dpLibraryData = Object.fromEntries(dpLibrary);
        localStorage.setItem(dpLibraryKey, JSON.stringify(dpLibraryData));
    }

    // 初始化 DP 字符库
    let dpLibrary = loadDpLibrary();

    // 从 localStorage 读取欢迎词库
    function loadWelcomeMessages() {
        const data = localStorage.getItem(welcomeMessagesKey);
        const welcomeMessagesData = data ? JSON.parse(data) : {};

        // 恢复欢迎词
        return welcomeMessagesData.messages || [];
    }

    // 保存欢迎词库到 localStorage
    function saveWelcomeMessages(welcomeMessages) {
        const welcomeMessagesObj = { messages: welcomeMessages };
        localStorage.setItem(welcomeMessagesKey, JSON.stringify(welcomeMessagesObj));
    }

    // 初始化欢迎词库
    let welcomeMessages = loadWelcomeMessages();



    // 过滤消息中的屏蔽词
    function filterMessage(message, filterWords) {
        filterWords.forEach(word => {
            let regex = new RegExp(word, 'g');
            message = message.replace(regex, '***');
        });
        return message;
    }

    // 屏蔽词数组示例
    let filterWords = ["不良词1", "不良词2"];

    // 生成UUID v4
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // 封装的发送消息函数
    async function sendMessage(message, retries = 3) {
        let filteredMessage = filterMessage(message, filterWords);
        const maxLength = 200 // 每段消息的最大字符数
        const url = 'https://fm.missevan.com/api/chatroom/message/send';

        // 将消息分段
        let messageChunks = [];
        for (let i = 0; i < filteredMessage.length; i += maxLength) {
            messageChunks.push(filteredMessage.slice(i, i + maxLength));
        }

        const sendChunk = async (chunk) => {
            const data = {
                room_id: roomId,
                message: chunk,
                uuid: generateUUID()
            };

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-agent': navigator.userAgent,
                    'cookie': document.cookie,
                    'origin': 'missevan.com',
                    'referer': `https://fm.missevan.com/live/${roomId}`
    },
                body: JSON.stringify(data)
            };

            for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                    const response = await fetch(url, options);
                    const responseData = await response.json();
                    if (responseData.code === 0) {
                        console.log('消息发送成功:', responseData);
                        return true; // 成功退出
                    } else {
                        console.error('发送失败:', responseData);
                        if (attempt === retries) {
                            console.error('达到最大重试次数，消息未发送');
                            await sendMessage('达到最大重试次数，消息未发送');
                        }
                    }
                } catch (error) {
                    console.error('请求错误:', error);
                    if (attempt === retries) {
                        console.error('达到最大重试次数，消息未发送');
                        await sendMessage('达到最大重试次数，消息未发送');
                    }
                }
            }
            return false; // 发送失败
        };

        // 按顺序发送每个分段
        for (let chunk of messageChunks) {
            let success = await sendChunk(chunk);
            if (!success) {
                console.error('部分消息发送失败，停止发送剩余分段');
                break; // 如果某个分段发送失败，停止发送
            }
        }
    }


    // 预存的欢迎消息
    const defaultWelcomeMessages = [
        '|欢迎@{username}\n|[拼音]:{pinyin}\n|日期:{date}',
        '欢迎@{username} 在 {date}加入直播间！\n拼音：{pinyin}，'
    ];

    // 从 localStorage 读取用户自定义欢迎词
    function loadCustomWelcomeMessages() {
        const customMessages = localStorage.getItem('customWelcomeMessages');
        return customMessages ? customMessages.split('/n/') : [];
    }

    // 生成欢迎消息
    function getWelcomeMessage(username, pinyinUsername, formattedDate) {
        const customMessages = loadCustomWelcomeMessages();
        const messagesToUse = customMessages.length > 0 ? customMessages : defaultWelcomeMessages;

        const randomWelcomeMessage = messagesToUse[Math.floor(Math.random() * messagesToUse.length)];
        return randomWelcomeMessage.replace('{username}', username)
            .replace('{pinyin}', pinyinUsername)
            .replace('{date}', formattedDate);
    }

    // 每秒检测用户加入
    setInterval(() => {
        if (!isWelcomingEnabled) return;

        const appElement = document.querySelector('app');
        if (appElement) {
            const doc = new DOMParser().parseFromString(appElement.innerHTML, 'text/html');
            const chatboxDiv = doc.querySelector('div#Room');
            if (chatboxDiv) {
                chatboxDiv.querySelectorAll('div.join-queue-effect.show.clickable').forEach(userDiv => {
                    const username = userDiv.querySelector('.username')?.textContent.trim() || '';
                    if (username && !welcomedUsers.includes(username)) {
                        welcomedUsers.push(username);
                        const formattedDate = new Date().toLocaleString('zh-CN', {
                            year: 'numeric', month: '2-digit', day: '2-digit',
                            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                        });
                        const pinyinUsername = pinyinPro.pinyin(username, { style: pinyinPro.STYLE_NORMAL });
                        sendMessage(getWelcomeMessage(username, pinyinUsername, formattedDate));
                        console.log(`用户 ${username} (${pinyinUsername}) 已加入并发送欢迎消息`);
                    }
                });
            } else {
                console.log('未找到 id 为 Room 的 div');
            }
        } else {
            console.log('未找到 <app> 标签');
        }
    }, 1000); // 每秒检测一次




    // 每秒获取一次历史消息并检查内容
    let previousElementCount = 0;

    async function checkNewElements() {
        // 获取目标 div 元素
        const targetDiv = document.querySelector('.prelude-scrollable.prelude-css-scrollbar.prelude-vertical.content');

        if (targetDiv) {
            // 获取 div 下的子元素数量
            const currentElementCount = targetDiv.children.length;

            // 如果当前子元素数量比之前记录的多，说明有新元素加入
            if (currentElementCount > previousElementCount) {
                const addedElementsCount = currentElementCount - previousElementCount;
                console.log(`增加了 ${addedElementsCount} 条元素`);
                await HistoryFetching();
            }

            // 更新记录的子元素数量
            previousElementCount = currentElementCount;
        }
    }

    // 每秒检查一次元素
    setInterval(checkNewElements, 500);


    // 每秒获取一次历史消息并检查内容
    async function HistoryFetching() {
        if (!isHistoryFetchingEnabled) return;

        const url = `https://fm.missevan.com/api/v2/chatroom/history/message?room_id=${roomId}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.code === 0 && data.info && data.info.history) {
                const currentTimestamp = Date.now(); // 获取当前时间戳

                data.info.history.forEach(async messageData => {
                    const { msg_id, create_time, message, user } = messageData;
                    const timeDiff = currentTimestamp - create_time;

                    // 检查时间差，若在 1 秒内则处理
                    if (timeDiff <= 1000 && !processedMsgIds.has(msg_id)) {


                        // 检测用户输入 DP 字符
                        if (message.startsWith("dp ")) {
                            const dpInput = message.substring(3).trim();
                            const dpId = parseInt(dpInput, 10);

                            if (!isNaN(dpId) && dpLibrary.has(dpId)) {
                                const dpData = dpLibrary.get(dpId);
                                await sendMessage(`${dpData.char}`);
                            }
                        }

                        if (message === "dp") {
                            // 随机发送一个 DP 字符
                            const dpIds = Array.from(dpLibrary.keys());
                            if (dpIds.length >= 0) {
                                const randomId = dpIds[Math.floor(Math.random() * dpIds.length)];
                                const dpData = dpLibrary.get(randomId);
                                await sendMessage(`${dpData.char}`);
                            } else {
                                await sendMessage("DP 字符库为空！");
                            }
                        }

                        if (message === "dp列表") {
                            // 发送所有 DP 字符的编号和描述
                            if (dpLibrary.size > 0) {
                                let response = "DP 字符列表:\n";
                                // 按编号排序
                                const sortedDpLibrary = Array.from(dpLibrary.entries()).sort((a, b) => a[0] - b[0]);
                                sortedDpLibrary.forEach(([id, value]) => {
                                    response += `编号: ${id} - 描述: ${value.desc}\n\n`;
                                });
                                await sendMessage(response.trim());
                            } else {
                                await sendMessage("DP 字符库为空！");
                            }
                        }

                        // 处理 DP 字符添加命令
                        if (message.startsWith("dp添加 ") || message.startsWith("dp+ ")) {
                            const dpInput = message.substring(6).trim();
                            if (dpInput) {
                                // 使用递增的编号
                                const dpId = nextDpId++;
                                dpLibrary.set(dpId, { char: dpInput, desc: '' });

                                // 保存 DP 字符库和更新编号
                                saveDpLibrary();
                                localStorage.setItem('nextDpId', nextDpId.toString());

                                await sendMessage(`DP 字符已添加：编号 ${dpId}\n字符: ${dpInput}`);
                            } else {
                                await sendMessage("请提供 DP 字符！");
                            }
                        }

                        // 处理删除命令
                        if (message.startsWith("dp删除 ") || message.startsWith("dp- ")) {
                            const dpId = parseInt(message.substring(4).trim(), 10);
                            if (dpLibrary.has(dpId)) {
                                dpLibrary.delete(dpId);
                                saveDpLibrary(); // 保存更新后的 DP 字符库
                                await sendMessage(`编号 ${dpId} 的 DP 字符已删除！`);
                            } else {
                                await sendMessage(`编号 ${dpId} 的 DP 字符不存在！`);
                            }
                        }

                        // 检查是否匹配到“我是谁”信息
                        if (message === "我是谁") {
                            const userId = user.user_id;
                            const username = user.username;
                            const level = user.titles.find(title => title.type === 'level')?.level;

                            console.log('匹配到“我是谁”信息:');
                            console.log('用户ID:', userId);
                            console.log('用户名:', username);
                            console.log('等级:', level);

                            // 将用户ID、用户名和等级传递给fetchPageData函数
                            await fetchPageData(userId, username, level);
                        }

                        if (message === "发送头像") {
                            const { user_id, username, titles, iconurl } = user; // 获取头像链接
                            await sendMessage(`复制到浏览器网址栏查看:\n${iconurl}`);

                        }

                        // 检查用户是否输入了 "直播间" 命令
                        if (message === "直播间") {
                            console.log('用户请求直播间信息');

                            // 调用 zhibojian 函数并传递 roomId
                            await zhibojian(roomId);
                        }

                        if (message === "答案之书") {
                            await sendMessage('正在获取请等待...');
                            const username = user.username;
                            await fetchContent(username);
                        }

                        if (message === "求签") {
                            await qiuqian();
                        }

                        if (message.startsWith("星座 ")) {
                            await sendMessage('正在获取请等待...');
                            const zodiacChinese = message.substring(3).trim(); // 提取用户输入的星座
                            const zodiacEnglish = zodiacMap[zodiacChinese];    // 获取星座的英文名称

                            if (zodiacEnglish) {
                                // 生成星座页面的 URL
                                const originalUrl = `https://www.xinglai.com/horoscope/${zodiacEnglish}/daily/current.html`;
                                const proxyUrl = 'https://api.allorigins.win/raw?url=';
                                const finalUrl = proxyUrl + encodeURIComponent(originalUrl); // 确保URL编码

                                await fetchZodiacPage(finalUrl); // 通过 CORS 代理访问页面
                            } else {
                                console.log("未知的星座，请输入正确的星座名称！");
                            }
                        }


                        //点歌功能
                        if (message.startsWith("点歌 ")) {
                            const songName = message.substring(3).trim();
                            requestSong('add', songName);
                            requestSong('show');
                        } else if (message.startsWith("删歌 ")) {
                            const songName = message.substring(3).trim();
                            requestSong('delete', songName);
                            requestSong('show');
                        } else if (message === "歌单") {
                            requestSong('show');
                        }

                        // 打卡功能
                        if (message === "dd" || message === "打卡") {
                            const username = user.username;
                            const currentDate = new Date();
                            const checkInTime = currentDate.toLocaleString(); // 打卡时间

                            // 从打卡数据中获取用户信息
                            if (checkInData.has(username)) {
                                const userData = checkInData.get(username);

                                // 解析最后打卡时间
                                const lastCheckInDate = new Date(userData.lastCheckInTime);

                                // 比较日期（只比较年月日）
                                const lastCheckInDay = lastCheckInDate.toISOString().split('T')[0];
                                const currentDay = currentDate.toISOString().split('T')[0];

                                if (lastCheckInDay === currentDay) {
                                    // 用户今天已经打过卡
                                    await sendMessage(`用户 ${username}，今天已经打过卡了！`);
                                } else {
                                    // 用户未打过卡，添加新打卡记录
                                    userData.count += 1;
                                    userData.lastCheckInTime = checkInTime;
                                    checkInData.set(username, userData);

                                    // 构建打卡完成消息
                                    let message = `打卡成功！\n\n| 用户名: ${username}\n| 打卡次数: ${userData.count}\n| 打卡时间: ${userData.lastCheckInTime}`;

                                    // 调用 sendMessage 函数发送消息
                                    await sendMessage(message);

                                    // 保存打卡数据至 localStorage
                                    saveCheckInData();
                                }
                            } else {
                                // 用户不在打卡数据中，初始化打卡记录
                                checkInData.set(username, { count: 1, lastCheckInTime: checkInTime });

                                // 构建打卡完成消息
                                let message = `打卡成功！\n\n| 用户名: ${username}\n| 打卡次数: 1\n| 打卡时间: ${checkInTime}`;

                                // 调用 sendMessage 函数发送消息
                                await sendMessage(message);

                                // 保存打卡数据至 localStorage
                                saveCheckInData();
                            }
                        }



                        // 查看所有打卡数据功能
                        if (message === "查看打卡数据") {
                            if (checkInData.size > 0) {
                                // 构建查看打卡数据的消息
                                let message = `所有用户的打卡数据:\n\n`;

                                checkInData.forEach((userData, username) => {
                                    message += `| 用户名: ${username}\n| 打卡次数: ${userData.count}\n| 最后打卡时间: ${userData.lastCheckInTime}\n\n`;
                                });

                                // 调用 sendMessage 函数发送所有打卡数据
                                await sendMessage(message);
                            } else {
                                // 如果没有任何打卡数据
                                await sendMessage(`没有任何打卡数据。`);
                            }
                        }

                        //帮助
                        if (message === "帮助") {
                            sendMessage(`请访问:https://docs.qq.com/doc/DRmFyTHZDTHdPaW1H`);
                        }

                        processedMsgIds.add(msg_id); // 将处理过的消息 ID 添加到集合中
                    }
                });
            } else {
                console.error('无法获取消息历史:', data);
            }
        } catch (error) {
            console.error('请求失败:', error);
        }
    }; // 每秒请求一次

    // 获取并解析星座页面内容
    async function fetchZodiacPage(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('网络响应失败');
            }
            const data = await response.text(); // 返回页面的 HTML 内容

            // 使用 DOMParser 来解析 HTML 并提取内容
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const zodiacContent = doc.querySelectorAll('.well-large p'); // 获取 .well-large 下的所有 p 标签

            // 创建一个数组来存储内容
            const contentArray = [];

            zodiacContent.forEach(p => {
                const trimmedText = p.textContent.trim(); // 去除空白字符
                if (trimmedText) { // 只添加非空内容
                    console.log('星座运势内容:', trimmedText); // 打印内容
                    contentArray.push(trimmedText); // 将内容添加到数组
                }
            });

            // 将数组中的内容合并为一个字符串
            const message = `星座运势内容:\n${contentArray.join('\n')}`;

            // 在这里调用 sendMessage 函数发送合并后的消息
            await sendMessage(message); // 发送消息
        } catch (error) {
            console.error('获取星座数据时出错:', error);
        }
    }

    //求签



    //答案之书
    async function fetchContent(username) {
        if (isFetching) {
            console.log("数据正在获取中，请稍后再试。");
            return; // 如果正在获取数据，则直接返回
        }

        isFetching = true; // 设置标志为true，表示正在获取数据
        const proxyUrl = 'https://api.allorigins.win/raw?url='; // 使用指定的CORS代理
        const apiUrl = 'https://answer.hi2future.com/Book/get_answer?lang=zh-CN';
        const finalUrl = proxyUrl + encodeURIComponent(apiUrl); // 编码URL

        try {
            const response = await fetch(finalUrl);
            if (!response.ok) {
                throw new Error('网络响应失败');
            }

            const data = await response.json(); // 解析响应为JSON
            const content = data.result.answer.content; // 提取content字段
            // 输出和发送内容整合
            const message = `@${username}: ${content}`; // 创建消息字符串
            console.log(message); // 输出内容
            await sendMessage(message); // 发送消息
            // 获取完成后重置标志
            isFetching = false;
            return content; // 如果需要，可以返回内容
        } catch (error) {
            console.error('获取数据时出错:', error);
            isFetching = false; // 发生错误时也重置标志
        }
    }
    // 修改fetchPageData函数以接受userId、username和level参数
    async function fetchPageData(userId, username, level) {
        try {
            // 使用模板字符串动态插入 userId
            const url = `https://www.missevan.com/${userId}/`;
            console.log('Fetching URL:', url);

            const response = await fetch(url);
            const html = await response.text();

            // 创建一个 DOMParser 来解析 HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 提取信息
            const botText = doc.querySelector('#t_u_n_a')?.textContent.trim();
            const followCount = doc.querySelector('.home-follow span')?.textContent.trim();
            const fanCount = doc.querySelector('.home-fans span')?.textContent.trim();

            // 提取注册日期，使用正则从 span 中提取日期部分
            const timeSpan = doc.querySelector('.time')?.textContent.trim();
            const dateMatch = timeSpan?.match(/注册于 (\d{4}-\d{2}-\d{2})/);
            const date = dateMatch ? dateMatch[1] : '未找到日期';

            // 提取鱼干数量
            const fishCount = doc.querySelector('.fish')?.textContent.trim();

            // 格式化消息内容
            let message = `|用户名: ${username}\n|等级: ${level}\n|个性签名: ${botText}\n|关注人数: ${followCount}\n|粉丝人数: ${fanCount}\n|鱼干: ${fishCount}`;

            // 调用 sendMessage 函数发送消息
            await sendMessage(message);

        } catch (error) {
            console.error('网页抓取失败:', error);
        }
    }

    async function zhibojian(roomid) {
        const url = `https://fm.missevan.com/api/v2/live/${roomid}`;

        try {
            // 发送请求并获取响应
            const response = await fetch(url);
            const data = await response.json();

            // 提取房间信息
            const room_info = data['info']['room'];
            const room_name = room_info['name'];
            const room_id = room_info['room_id'];
            const accumulation = room_info['statistics']['accumulation'];
            const online = room_info['statistics']['online'];
            const attention_count = room_info['statistics']['attention_count'];
            const vip_status = room_info['statistics']['vip'];
            const score = room_info['statistics']['score'];
            const open_time_timestamp = room_info['status']['open_time'];

            // 将时间戳转换为 Date 对象
            const open_time = new Date(open_time_timestamp);

            // 获取当前时间
            const current_time = new Date();

            // 计算时间差
            const time_diff = current_time - open_time;

            // 计算天、小时、分钟和秒数
            const days = Math.floor(time_diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((time_diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((time_diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((time_diff % (1000 * 60)) / 1000);

            // 格式化开播时间和时长
            const open_time_str = `${open_time.getFullYear()}-${(open_time.getMonth() + 1).toString().padStart(2, '0')}-${open_time.getDate().toString().padStart(2, '0')} ${open_time.getHours().toString().padStart(2, '0')}:${open_time.getMinutes().toString().padStart(2, '0')}`;
            const time_diff_str = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            // 发送消息
            const message = `|房间名称: ${room_name}\n|房间ID: ${room_id}\n|在线人数: ${online}\n|累积人数: ${accumulation}\n|关注人数: ${attention_count}\n|贵族人数: ${vip_status}\n|热度: ${score}\n|开播时间: ${open_time_str}\n|开播时长: ${time_diff_str}`;
            // 调用 sendMessage 函数发送消息
            await sendMessage(message);

        } catch (error) {
            console.error('Error fetching room data:', error);
        }
    }


    // 点歌功能实现
    function requestSong(action, songName = null) {
        try {
            if (action === 'add' && songName) {
                // 添加歌曲
                if (!songList.includes(songName)) {
                    songList.push(songName);
                    sendMessage(`已添加歌曲: ${songName}`);
                } else {
                    sendMessage(`歌曲: ${songName} 已在列表中`);
                }
            } else if (action === 'delete' && songName) {
                // 删除歌曲
                const index = songList.indexOf(songName);
                if (index !== -1) {
                    songList.splice(index, 1);
                    sendMessage(`已删除歌曲: ${songName}`);
                } else {
                    sendMessage(`歌曲: ${songName} 不在列表中`);
                }
            } else if (action === 'show') {
                // 显示歌曲列表
                if (songList.length > 0) {
                    const songListStr = songList.join('\n');
                    sendMessage(`<本场点歌歌曲列表>\n${songListStr}`);
                } else {
                    sendMessage("歌曲列表为空");
                }
            }
        } catch (error) {
            console.error(`点歌功能发生异常: ${error}`);
        }
    }

})();
