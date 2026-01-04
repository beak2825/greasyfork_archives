// ==UserScript==
// @name         Chat聊天
// @namespace    http://your.homepage/
// @version      1.2
// @description  Linux.do chat聊天室，请你尽情发挥
// @require      https://update.greasyfork.org/scripts/488179/1360581/showdown.js
// @author       unique
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @run-at document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493830/Chat%E8%81%8A%E5%A4%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/493830/Chat%E8%81%8A%E5%A4%A9.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    let username = '';//用户名，最好设置成自己的用户名

    let flag = false;//开关
    let flagTwo = false;//开关2
    let topicId = '';//刷新帖子使用
    let newArray = []; // 帖子数组,用于阅读帖子
    let imgUrl = [];
    const getCsrfToken = () => {
        const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
        return csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : null;
    };

    const getUsername = async () => {
        if (username === '') {
            const headers = new Headers();
            headers.append('X-Csrf-Token', getCsrfToken());
            const response = await fetch('https://linux.do/my/summany.json', {
                method: 'GET',
                headers: headers
            });
            const newURL = response.url;
            const urlObj = new URL(newURL);
            const pathParts = urlObj.pathname.split('/');
            username = pathParts[2];
        }
    };

    //定时任务
    setInterval(async () => {
        if (flag) {
            console.log('Refreshing content'); // 添加日志
            await newReplyMsg(topicId);
        }
    }, 5000);

    const userRecentChat = async () => {
        const response = await fetch(`https://linux.do/topics/private-messages-sent/${username}.json`);
        if (!response.ok) throw new Error('Failed to fetch recent reply.');

        const jsonData = await response.json();
        if (jsonData.length === 0) {
            console.error('No recent actions found');
            return null;
        }
        const filteredTopics = jsonData.topic_list.topics.filter(topic => {
            const participants = topic.participants || [];
            return participants.some(participant => [-111, -113, -110].includes(participant.user_id));
        });
        return filteredTopics;
    };

    const createChatDrawer = (chatData) => {
        const chatDrawer = document.createElement('div');
        chatDrawer.setAttribute('id', 'chat-draw');
        chatDrawer.classList.add('chat-drawer', 'is-expanded');
        chatDrawer.style.width = '400px';
        chatDrawer.style.height = '530px'; // 将高度设置为固定值
        chatDrawer.style.position = 'fixed';
        chatDrawer.style.bottom = '0'; // 将 chatDrawer 放在底部
        chatDrawer.style.right = '1%'; // 将 chatDrawer 放在右边屏幕的 5% 左右
        chatDrawer.style.zIndex = '9999';
        chatDrawer.style.resize = 'both'; // 启用resize属性
        chatDrawer.style.overflow = 'auto'; // 添加溢出滚动

        const chatDrawerContainer = document.createElement('div');
        chatDrawerContainer.classList.add('chat-drawer-container');
        chatDrawerContainer.setAttribute('id', 'chat-draw-container');

        // 标题栏
        const navbarElement = navbar();
        chatDrawerContainer.appendChild(navbarElement);
        addDraggableFeature(chatDrawer, navbarElement);

        // 聊天列表
        const channelsList = createChannelList(chatData);
        chatDrawerContainer.appendChild(channelsList);
        chatDrawer.appendChild(chatDrawerContainer);

        let isResizing = false;
        let startX;
        let startY;

        chatDrawer.addEventListener('mousedown', function (event) {
            if (event.target.style.resize === 'both') {
                isResizing = true;
                startX = event.clientX;
                startY = event.clientY;
            }
        });

        window.addEventListener('mousemove', function (event) {
            if (isResizing) {
                const width = chatDrawer.offsetWidth + (event.clientX - startX);
                const height = chatDrawer.offsetHeight + (event.clientY - startY);
                chatDrawer.style.width = width + 'px';
                chatDrawer.style.height = height + 'px';
                startX = event.clientX;
                startY = event.clientY;
            }
        });

        window.addEventListener('mouseup', function () {
            isResizing = false;
        });

        return chatDrawer;
    };


    function addDraggableFeature(target, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        const dragMouseDown = function (e) {
            if (e.target.tagName.toUpperCase() === 'INPUT' || e.target.tagName.toUpperCase() === 'TEXTAREA' || e.target.tagName.toUpperCase() === 'BUTTON') {
                return;
            }
            e = e || window.event;
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };

        const elementDrag = function (e) {
            e = e || window.event;
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            target.style.top = (target.offsetTop - pos2) + "px";
            target.style.left = (target.offsetLeft - pos1) + "px";
            target.style.bottom = '';
            target.style.right = '';
        };

        const closeDragElement = function () {
            document.onmouseup = null;
            document.onmousemove = null;
        };

        // 在标题栏上添加mousedown事件监听器
        handle.onmousedown = dragMouseDown;
    }

    const fetchChatDetails = async (chatId) => {
        const postTopicResponse = await fetch(`https://linux.do/t/topic/${chatId}.json`);
        const postTopicJsonData = await postTopicResponse.json();
        let difference = Math.abs(postTopicJsonData.highest_post_number - postTopicJsonData.last_read_post_number);
        for (let i = 1; i <= difference; i++) {
            const newValue = postTopicJsonData.last_read_post_number + i;
            if (!newArray.includes(newValue)) {
                newArray.push(newValue);
            }
        }
        const postResponse = await fetch(`https://linux.do/t/topic/${chatId}/${postTopicJsonData.highest_post_number}.json`, {
            headers: {
                'X-CSRF-Token': getCsrfToken()
            }
        });
        const postJsonData = await postResponse.json();
        const posts = postJsonData.post_stream.posts;
        const lastTenPosts = posts.map(post => ({
            id: post.id,//帖子id
            user_id: post.user_id,//用户id
            name: post.name,//用户名
            username: post.username,//用户名
            avatar_template: post.avatar_template,//头像
            cooked: post.cooked,//帖子内容
            date: post.created_at,//时间
        }));
        return lastTenPosts; // 返回最近的聊天消息数组
    };

    function createChatNavbar() {
        const navbarTitleText = document.querySelector('.c-navbar__title-text');
        navbarTitleText.textContent = '返回';
        const navbarTitle = document.querySelector('.c-navbar__title');
        // 创建返回按钮
        const backButton = document.createElement('div');
        backButton.innerHTML = '<a id="ember106" class="ember-view ember-transitioning-in c-navbar__back-button no-text btn-transparent btn" title="返回">\n' +
            '          <svg class="fa d-icon d-icon-chevron-left svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#chevron-left"></use></svg>\n' +
            '      </a>';
        // 将返回按钮添加到标题容器中
        navbarTitle.innerHTML = ''; // 清空标题容器
        navbarTitle.appendChild(backButton);
        // 返回按钮点击事件处理程序
        backButton.addEventListener('click', async () => {
            try {
                flagTwo = false;
                await refreshChatList();
            } catch (error) {
                console.error('Failed to fetch recent chat:', error);
            }
        });
    }

    const refreshChatList = async () => {
        const chatDrawer = document.getElementById('chat-draw');
        // 将聊天消息的 HTML 结构添加到弹框中
        const chatData = await userRecentChat(); // 获取最近的聊天数据
        const newChannelsList = createChannelList(chatData);
        const chatDrawerContainer = document.getElementById('chat-draw-container');
        chatDrawerContainer.innerHTML = '';
        const navbarElement = navbar();
        chatDrawerContainer.appendChild(navbarElement);
        chatDrawerContainer.appendChild(newChannelsList);
        addDraggableFeature(chatDrawer, navbarElement);
        topicId = '';
        flag = false;
        chatDrawerContainer.style.paddingBottom = '0px';
    }

    function getRandomWidth() {
        return Math.floor(Math.random() * 80) + 5; // 生成 5 到 80 之间的随机数
    }

    const createChannelList = (chatData) => {
        const channelsList = document.createElement('div');
        channelsList.classList.add('channels-list');

        const topicList = document.createElement('ul');
        topicList.classList.add('topic-list');

        // 创建聊天列表项
        chatData.forEach(chat => {
            const listItem = document.createElement('a');
            listItem.classList.add('ember-view', 'chat-channel-row', 'can-leave');
            listItem.setAttribute('tabindex', '0');
            listItem.setAttribute('data-chat-channel-id', chat.id);
            // 修改为在点击时调用函数而不是直接跳转
            listItem.addEventListener('click', async () => {
                flagTwo = true;//用于检测是否到达聊天内容列表
                createChatNavbar();
                displayChatComposer(chat.id);
                try {
                    const chatDrawer = document.getElementById('chat-draw');
                    const channelsList = chatDrawer.querySelector('.channels-list');

                    // 清空 channelsList
                    channelsList.innerHTML = '';

                    // 创建加载指示器
                    const loadingContainer = document.createElement('div');
                    loadingContainer.classList.add('animate-pulse', 'space-y-4', 'p-4');
                    const numOfBoxes = 5; // 生成 5 个盒子
                    loadingContainer.innerHTML = `<div class="placeholder-container">
                                                    ${generateRandomBoxes(numOfBoxes)}
                                                  </div>`;
                    // 将加载指示器添加到 channelsList 中
                    channelsList.appendChild(loadingContainer);
                    await newReplyMsg(chat.id);
                    topicId = chat.id;
                    flag = true;
                    channelsList.scrollTop = channelsList.scrollHeight;

                    // 加载完成后隐藏加载指示器
                    loadingContainer.remove();
                } catch (error) {
                    console.error('Error creating chat message HTML:', error);
                }
                await sendRead(chat.id);
            });

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('chat-channel-row__content', 'is-dm');

            const iconDiv = document.createElement('div');
            iconDiv.classList.add('chat-channel-icon');

            const avatarDiv = document.createElement('div');
            avatarDiv.classList.add('chat-channel-icon', '--avatar');

            const userAvatarDiv = document.createElement('div');
            userAvatarDiv.classList.add('chat-user-avatar');

            const avatarContainerSpan = document.createElement('span');
            avatarContainerSpan.classList.add('chat-user-avatar__container');

            const avatarImg = document.createElement('img');
            avatarImg.setAttribute('loading', 'lazy');
            avatarImg.setAttribute('width', '22');
            avatarImg.setAttribute('height', '22');

            // 匹配头像
            switch (chat.last_poster_username) {
                case 'gpt3.5_bot':
                    avatarImg.setAttribute('src', 'https://cdn.linux.do/user_avatar/linux.do/gpt3.5_bot/288/58230_2.png');
                    break;
                case 'gpt4_bot':
                    avatarImg.setAttribute('src', 'https://cdn.linux.do/user_avatar/linux.do/gpt4_bot/288/54312_2.png');
                    break;
                case 'gpt4t_bot':
                    avatarImg.setAttribute('src', 'https://cdn.linux.do/user_avatar/linux.do/gpt4t_bot/288/54457_2.png');
                    break;
                default:
                    // 默认头像
                    avatarImg.setAttribute('src', 'https://cdn.linux.do/uploads/default/original/288/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b.png');
                    break;
            }

            avatarImg.classList.add('avatar');
            avatarImg.setAttribute('title', chat.last_poster_username);
            avatarImg.style.padding = '0';

            avatarContainerSpan.appendChild(avatarImg);
            userAvatarDiv.appendChild(avatarContainerSpan);
            avatarDiv.appendChild(userAvatarDiv);

            contentDiv.appendChild(iconDiv);
            contentDiv.appendChild(avatarDiv);

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('chat-channel-row__info');

            const nameDiv = document.createElement('div');
            nameDiv.classList.add('chat-channel-name');

            const nameLabelSpan = document.createElement('span');
            nameLabelSpan.classList.add('chat-channel-name__label');
            nameLabelSpan.textContent = chat.title;

            nameDiv.appendChild(nameLabelSpan);

            const metadataDiv = document.createElement('div');
            metadataDiv.classList.add('chat-channel__metadata');

            const metadataDateDiv = document.createElement('div');
            metadataDateDiv.classList.add('chat-channel__metadata-date');
            const date = new Date(chat.last_posted_at);
            const dateString = date.toLocaleDateString();
            const timeString = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
            metadataDateDiv.textContent = `${dateString} ${timeString}`;
            metadataDiv.appendChild(metadataDateDiv);
            infoDiv.appendChild(nameDiv);
            infoDiv.appendChild(metadataDiv);
            contentDiv.appendChild(infoDiv);
            listItem.appendChild(contentDiv);

            // 添加关闭按钮
            const closeButton = document.createElement('button');
            closeButton.classList.add('btn', 'no-text', 'btn-icon', 'toggle-channel-membership-button', '-leave', 'btn-flat', 'chat-channel-leave-btn');
            closeButton.title = '归档聊天';
            closeButton.type = 'button';
            closeButton.innerHTML = '<svg class="fa d-icon d-icon-times svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#times"></use></svg>&ZeroWidthSpace;';
            listItem.appendChild(closeButton);

            closeButton.addEventListener('click', async () => {
                // 阻止事件冒泡到列表项
                event.stopPropagation();
                try {
                    await fetchArchive(chat.id);
                    // 将聊天消息的 HTML 结构添加到弹框中
                    await refreshChatList();
                } catch (error) {
                    console.error('Error archiving topic:', error);
                }
            });

            topicList.appendChild(listItem);

            topicList.appendChild(listItem);
            // 鼠标悬停事件，显示用户名
            avatarImg.addEventListener('mouseover', () => {
                avatarImg.setAttribute('title', chat.last_poster_username);
            });
            // 鼠标离开事件，恢复原标题
            avatarImg.addEventListener('mouseout', () => {
                avatarImg.setAttribute('title', '');
            });
        });
        channelsList.appendChild(topicList);
        channelsList.style.overflow = 'auto';
        return channelsList;
    }

    function generateRandomBoxes(numOfBoxes) {
        let result = '';
        for (let i = 0; i < numOfBoxes; i++) {
            const numOfCuLines = Math.floor(Math.random() * 2) + 1; // 生成 1 到 2 之间的随机数，用来确定 cu-line 的数量
            const numOfLines = Math.floor(Math.random() * 4) + 1; // 生成 1 到 4 之间的随机数，用来确定 line 的数量
            let cuLinesHTML = '';
            let linesHTML = '';
            for (let j = 0; j < numOfCuLines; j++) {
                if (Math.random() < 0.5) { // 50% 的概率生成单个 cu-line
                    cuLinesHTML += `<div class="cu-line placeholder" style="width:${getRandomWidth()}%;"></div>`;
                } else { // 50% 的概率生成一对 cu-line
                    cuLinesHTML += `
                <div class = "message-wrapper">
                    <div class="cu-line placeholder" style="width:${getRandomWidth()}%; "></div>
                    <div class="cu-line placeholder" style="width:${getRandomWidth()}%; margin-left: 10px;"></div>
                </div>`;
                }
            }
            for (let k = 0; k < numOfLines; k++) {
                linesHTML += `<div class="line placeholder" style="width:${getRandomWidth()}%;"></div>`;
            }
            result += `
        <div class="message">
            <div class="pl-avatar placeholder"></div>
            <div class="content">
                ${cuLinesHTML}
                ${linesHTML}
            </div>
         </div>`;
        }
        return result;
    }

    // 创建 <style> 标签
    const styleElement = document.createElement('style');

    // 添加 CSS 代码
    styleElement.innerHTML = `
        .placeholder-container {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: none;
          border-radius: 8px;
          overflow: hidden;
           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .message {
        margin-top: 13px;
          display: flex;
          margin-bottom: 13px;
        }

        .pl-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: #e9e9e9;
          margin-right: 10px;
          margin-left: 19px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .content {
          flex: 1;
        }

        .line {
          height: 12px;
          margin-top: 5px;
          margin-bottom: 5px;
          background-color: #e9e9e9;
          border-radius: 3px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .cu-line {
          height: 25px;
          margin-top: 5px;
          margin-bottom: 10px;
          background-color: #e9e9e9;
          border-radius: 3px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .message-wrapper {
            display: flex;
            flex-direction: row;
        }
        .pl-avatar, .line, .cu-line {
          animation: loading 0.7s ease-in-out infinite alternate;
        }

        @keyframes loading {
          0% {
            opacity: 0.7;
          }
          25%{
            opacity: 0.6;
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 0.7;
          }
        }
        `
    // 将 <style> 标签添加到文档头部
    document.head.appendChild(styleElement);

    const newReplyMsg = async (chatId) => {
        const chatDrawer = document.getElementById('chat-draw');
        const channelsList = chatDrawer.querySelector('.channels-list');
        const chatDetails = await fetchChatDetails(chatId);
        channelsList.innerHTML = ''; // 清空弹框中的内容
        // 遍历 chatDetails 集合，并逐个创建并显示聊天消息的 HTML 结构
        chatDetails.forEach(chatDetail => {
            const chatMessageHTML = createChatMessageHTML(chatDetail);
            // 将聊天消息的 HTML 结构添加到弹框中
            channelsList.appendChild(chatMessageHTML);
        });
    }

    const navbar = () => {
        const navbarContainer = document.createElement('div');
        navbarContainer.classList.add('c-navbar-container', '-clickable');
        const navbar = document.createElement('nav');
        navbar.classList.add('c-navbar');

        const navbarTitle = document.createElement('div');
        navbarTitle.setAttribute('title', 'chat聊天');
        navbarTitle.classList.add('c-navbar__title');

        const navbarTitleText = document.createElement('span');
        navbarTitleText.classList.add('c-navbar__title-text');
        navbarTitleText.textContent = 'chat聊天';
        navbarTitle.appendChild(navbarTitleText);

        const navbarActions = document.createElement('nav');
        navbarActions.classList.add('c-navbar__actions');

        // 创建关闭按钮
        const closeDrawerButton = document.createElement('button');
        closeDrawerButton.classList.add('btn', 'no-text', 'btn-icon', 'btn-flat', 'no-text', 'c-navbar__close-drawer-button');
        closeDrawerButton.setAttribute('title', '关闭');

        const closeDrawerButtonSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        closeDrawerButtonSvg.setAttribute('class', 'fa d-icon d-icon-times svg-icon svg-string');
        const use3 = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use3.setAttribute('href', '#times');
        closeDrawerButtonSvg.appendChild(use3);
        closeDrawerButton.appendChild(closeDrawerButtonSvg);

        // 将关闭按钮添加到导航栏操作中
        navbarActions.appendChild(closeDrawerButton);

        // 添加点击事件监听器
        closeDrawerButton.addEventListener('click', () => {
            // 获取聊天抽屉元素
            const chatDrawer = document.getElementById('chat-draw');
            // 如果抽屉是显示的，则隐藏抽屉
            chatDrawer.style.display = 'none';
            if (flagTwo) {
                flag = false;
            }
        });
        // 组合元素
        navbarTitle.appendChild(navbarTitleText);
        navbar.appendChild(navbarTitle);
        navbar.appendChild(navbarActions);
        navbarActions.appendChild(closeDrawerButton);
        navbarContainer.appendChild(navbar);
        return navbarContainer;
    }

    const createChatMessageHTML = (message) => {
        const chatMessageContainer = document.createElement('div');
        chatMessageContainer.classList.add('chat-message-container', '-persisted', '-processed');
        chatMessageContainer.dataset.id = message.id;

        const chatMessage = document.createElement('div');
        chatMessage.classList.add('chat-message');

        const chatMessageAvatar = document.createElement('div');
        chatMessageAvatar.classList.add('chat-message-avatar');

        const userAvatarDiv = document.createElement('div');
        userAvatarDiv.classList.add('chat-user-avatar');
        userAvatarDiv.dataset.username = message.username;

        const avatarContainer = document.createElement('a');
        avatarContainer.classList.add('chat-user-avatar__container');
        avatarContainer.href = `/u/${message.username}`;
        avatarContainer.dataset.userCard = message.username;

        const avatarImg = document.createElement('img');
        avatarImg.setAttribute('loading', 'lazy');
        avatarImg.setAttribute('alt', '');
        avatarImg.setAttribute('width', '48');
        avatarImg.setAttribute('height', '48');
        const avatarSrc = message.avatar_template.replace("{size}", "144");
        avatarImg.src = avatarSrc;
        avatarImg.classList.add('avatar');
        avatarImg.title = message.username;
        avatarImg.style.padding = '0px';

        avatarContainer.appendChild(avatarImg);
        userAvatarDiv.appendChild(avatarContainer);
        chatMessageAvatar.appendChild(userAvatarDiv);

        const chatMessageContent = document.createElement('div');
        chatMessageContent.classList.add('chat-message-content');

        const chatMessageInfo = document.createElement('div');
        chatMessageInfo.classList.add('chat-message-info');

        const usernameSpan = document.createElement('span');
        usernameSpan.classList.add('chat-message-info__username', 'is-username', 'clickable');
        usernameSpan.dataset.userCard = message.username;

        const usernameNameSpan = document.createElement('span');
        usernameNameSpan.classList.add('chat-message-info__username__name');
        usernameNameSpan.textContent = message.name;

        usernameSpan.appendChild(usernameNameSpan);

        const dateSpan = document.createElement('span');
        dateSpan.classList.add('chat-message-info__date');

        // 格式化日期
        const formattedDate = new Date(message.date).toLocaleTimeString();

        const dateLink = document.createElement('a');
        dateLink.classList.add('chat-time');
        dateLink.title = formattedDate;
        dateLink.tabIndex = -1;
        dateLink.textContent = formattedDate;

        dateSpan.appendChild(dateLink);
        chatMessageInfo.appendChild(usernameSpan);
        chatMessageInfo.appendChild(dateSpan);

        const chatMessageText = document.createElement('div');
        chatMessageText.classList.add('chat-message-text');

        // 将 Markdown 内容转换为 HTML
        const markdownConverter = new showdown.Converter();
        let htmlContent = '';
        if (message.cooked === "") {
            // 如果消息内容为空，表示正在输入中
            htmlContent = '<em style="font-size: 0.8em;">正在输入中...</em>';
        } else {
            htmlContent = markdownConverter.makeHtml(message.cooked);
        }
        chatMessageText.innerHTML = htmlContent;

        chatMessageContent.appendChild(chatMessageInfo);
        chatMessageContent.appendChild(chatMessageText);

        chatMessage.appendChild(chatMessageAvatar);
        chatMessage.appendChild(chatMessageContent);
        chatMessageContainer.appendChild(chatMessage);
        return chatMessageContainer;
    };


    // 创建聊天输入框的HTML结构
    const createChatComposerHTML = (chatId) => {
        const chatComposerContainer = document.createElement('div');
        chatComposerContainer.setAttribute('id','fix-input')
        chatComposerContainer.setAttribute('role', 'region');
        chatComposerContainer.setAttribute('aria-label', '聊天输入框');
        chatComposerContainer.classList.add('chat-composer', 'is-send-disabled', 'is-enabled', 'is-draft-saved');
        chatComposerContainer.style.backgroundColor = '#f8f8f8';
        // 设置聊天输入框容器样式
        chatComposerContainer.style.position = 'absolute'; // 设置为绝对定位
        chatComposerContainer.style.bottom = '0'; // 将其固定在底部
        chatComposerContainer.style.width = '100%'; // 宽度占满父容器的100%

        const outerContainer = document.createElement('div');
        outerContainer.classList.add('chat-composer__outer-container');

        const innerContainer = document.createElement('div');
        innerContainer.classList.add('chat-composer__inner-container');

        // 添加按钮
        const plusButton = document.createElement('button');
        plusButton.classList.add('btn', 'no-text', 'btn-icon', 'fk-d-menu__trigger', 'chat-composer-dropdown__trigger-btn', 'btn-flat');
        plusButton.setAttribute('aria-expanded', 'false');
        plusButton.setAttribute('data-trigger', '');
        plusButton.setAttribute('title', '切换工具栏');
        plusButton.setAttribute('type', 'button');
        plusButton.setAttribute('id', 'ember111');
        plusButton.setAttribute('data-identifier', 'chat-composer-dropdown__menu');
        plusButton.innerHTML = `<svg class="fa d-icon d-icon-plus svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#plus"></use></svg>&ZeroWidthSpace;`;
        plusButton.addEventListener('click', handleFileUpload);

        const inputContainer = document.createElement('div');
        inputContainer.classList.add('chat-composer__input-container');


        // 添加输入框
        const inputTextarea = document.createElement('textarea');
        inputTextarea.setAttribute('rows', '1');
        inputTextarea.setAttribute('placeholder', '聊天室');
        inputTextarea.setAttribute('autocorrect', 'on');
        inputTextarea.setAttribute('autocapitalize', 'sentences');
        inputTextarea.setAttribute('id', 'channel-composer');
        inputTextarea.classList.add('ember-text-area', 'ember-view', 'chat-composer__input');
        inputTextarea.setAttribute('data-chat-composer-context', 'channel');
        inputTextarea.setAttribute('type', 'text');
        inputTextarea.style.height = '22px';
        // 监听输入框的聚焦事件
        inputTextarea.addEventListener('focus', () => {
            // 添加 'is-focused' 类名
            chatComposerContainer.classList.add('is-focused');
        });

        const sendButtonWrapper = document.createElement('div');
        sendButtonWrapper.classList.add('chat-composer-button__wrapper');

        const sendButton = document.createElement('button');
        sendButton.classList.add('chat-composer-button', '-send');
        sendButton.setAttribute('title', '发送');
        sendButton.setAttribute('disabled', '');
        sendButton.setAttribute('tabindex', '-1');
        sendButton.setAttribute('type', 'button');
        sendButton.innerHTML = `<svg class="fa d-icon d-icon-paper-plane svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#paper-plane"></use></svg>`;

        // 添加上传文件的按钮盒子
        const uploadsContainer = document.createElement('div');
        uploadsContainer.setAttribute('id', 'upload-contain');
        uploadsContainer.classList.add('chat-composer-uploads', 'ember-view');
        uploadsContainer.style.marginTop = '5px';
        uploadsContainer.style.marginBottom = '5px';

        // 监听输入框的输入事件
        inputTextarea.addEventListener('input', () => {
            // 如果输入框有内容
            if (inputTextarea.value.trim() !== '') {
                // 添加 'is-focused' 类名
                chatComposerContainer.classList.add('is-focused');
                // 将 sendButton 的 tabindex 设置为 0，使其可聚焦
                sendButton.setAttribute('tabindex', '0');
                // 切换类名为 is-send-enabled
                chatComposerContainer.classList.remove('is-send-disabled');
                chatComposerContainer.classList.add('is-send-enabled');
                sendButton.setAttribute('tabindex', '0');
                sendButton.removeAttribute('disabled');
            } else {
                // 将 sendButton 的 tabindex 设置为 -1，使其不可聚焦
                sendButton.setAttribute('tabindex', '-1');
                // 切换类名为 is-send-disabled
                chatComposerContainer.classList.remove('is-send-enabled');
                chatComposerContainer.classList.add('is-send-disabled');
                sendButton.setAttribute('disabled', '');
            }
        });

        // 将按钮添加到按钮容器中
        sendButtonWrapper.appendChild(sendButton);
        // 添加点击事件监听器到按钮容器上
        sendButtonWrapper.addEventListener('click', async () => {
            // 获取文本框内容
            const inputTextarea = document.getElementById('channel-composer');
            const content = inputTextarea.value;
            const url = imgUrl.length > 0 ? imgUrl.join('\n') : '';
            const postData = url ? url + content  : content;
            // 调用 sendNewPost 函数发送内容
            try {
                await sendNewPost(postData, chatId);
                // 发送成功后，清空文本框内容
                inputTextarea.value = '';
                imgUrl.length = 0;
                const uploadsContainer = document.getElementById('upload-contain');
                const chatDrawerContainer = document.getElementById('chat-draw-container');
                const composerContainer = document.getElementById('fix-input');
                uploadsContainer.innerHTML ='';
                chatDrawerContainer.style.paddingBottom = `${composerContainer.clientHeight}px`;
                sendButton.setAttribute('disabled', '');
                sendButton.setAttribute('tabindex', '-1');
                chatComposerContainer.classList.remove('is-send-enabled');
            } catch (error) {
                console.error('Error sending new post:', error);
            }
            //刷新列表内容
            await newReplyMsg(chatId);
            const chatDrawer = document.getElementById('chat-draw');
            const channelsList = chatDrawer.querySelector('.channels-list');
            channelsList.scrollTop = channelsList.scrollHeight;
        });
        // 添加键盘事件监听器到 inputTextarea 上
        inputTextarea.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault();
                sendButton.click();
            }
        });
        // 将元素添加到容器中
        innerContainer.appendChild(plusButton);
        innerContainer.appendChild(inputContainer);
        inputContainer.appendChild(inputTextarea);
        innerContainer.appendChild(sendButtonWrapper);
        outerContainer.appendChild(innerContainer);
        chatComposerContainer.appendChild(outerContainer);
        chatComposerContainer.appendChild(uploadsContainer); // 将上传文件的盒子添加到主容器中
        return chatComposerContainer;
    };

    // 在弹框中显示聊天输入框
    const displayChatComposer = (chatId) => {
        const chatDrawerContainer = document.getElementById('chat-draw-container');
        // 检查是否已经存在输入框
        if (!document.getElementById('channel-composer')) {
            // 如果不存在，则创建新的输入框
            const composerContainer = createChatComposerHTML(chatId);
            chatDrawerContainer.appendChild(composerContainer);
            // 将输入框置于列表下方
            chatDrawerContainer.style.paddingBottom = `${composerContainer.clientHeight}px`;
        }
    };

    const sendNewPost = async (content, chatId) => {
        const url = 'https://linux.do/posts';
        const csrfToken = getCsrfToken();
        if (!csrfToken) return;
        const headers = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://linux.do',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-Token': csrfToken
        };
        const formData = new URLSearchParams({
            'raw': content,
            'unlist_topic': 'false',
            'topic_id': chatId,
            'is_warning': 'false',
            'archetype': 'regular',
            'featured_link': '',
            'whisper': false,
            'shared_draft': 'false',
            'draft_key': `topic_${chatId}`,
            'nested_post': 'true'
        });
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData,
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to send new post.');
        } catch (error) {
            console.error('Error sending new post:', error);
        }
    };

    const fetchArchive = (chatId) => {
        const csrfToken = getCsrfToken();
        return fetch(
            `https://linux.do/t/${chatId}/archive-message`,
            {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Origin': 'https://linux.do',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': csrfToken
                },
                method: "PUT",
                credentials: "include",
            }
        );
    };

    // 定义用于计算文件哈希值的函数
    async function getFileHash(file) {
        const buffer = await file.arrayBuffer(); // 将文件转换为 ArrayBuffer
        // 创建一个 SubtleCrypto 实例
        const crypto = window.crypto || window.msCrypto;
        const subtleCrypto = crypto.subtle || crypto.webkitSubtle;
        if (!subtleCrypto) {
            throw new Error('SubtleCrypto API not available');
        }
        // 计算文件的 SHA-1 哈希值
        const hashBuffer = await subtleCrypto.digest('SHA-1', buffer);
        // 将哈希值转换为十六进制字符串
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // 定义处理文件上传的函数
    function handleFileUpload() {
        const fileInput = document.createElement('input'); // 创建文件输入框元素
        fileInput.type = 'file'; // 设置类型为文件输入
        fileInput.style.display = 'none'; // 隐藏文件输入框
        fileInput.id = 'file-input'; // 设置文件输入框的 ID
        document.body.appendChild(fileInput); // 添加文件输入框到页面

        fileInput.addEventListener('change', function () { // 监听文件输入框的变化
            const uploadFile = fileInput.files && fileInput.files[0];
            if (uploadFile) {
                const uploadFileChecksum = getFileHash(uploadFile);
                const csrfToken = getCsrfToken();
                const formData = new FormData();
                formData.append('upload_type', 'composer');
                formData.append('relativePath', 'null');
                formData.append('name', uploadFile.name);
                formData.append('type', '"image/png"');
                formData.append('sha1_checksum', uploadFileChecksum);
                formData.append('file', uploadFile, uploadFile.name);
                fetch('https://linux.do/uploads.json?client_id=bddb80db355c49e1b0a68a47fbabf1a9', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                    headers: {
                        accept: '*/*',
                        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-origin',
                        'x-csrf-token': csrfToken,
                    },
                })
                    .then(serverPromise => {
                    return serverPromise.json();
                })
                    .then(res => {
                    console.log(res);
                    imgUrl.push('\n'+ res.url +'\n');
                    const chatDrawer = document.getElementById('chat-draw');
                    const channelsList = chatDrawer.querySelector('.channels-list');
                    const chatDrawerContainer = document.getElementById('chat-draw-container');
                    const composerContainer = document.getElementById('fix-input');
                    const chatImgUpload = document.getElementById('chat-composer-img');
                    if (!chatImgUpload) {
                        chatDrawerContainer.style.paddingBottom = `calc(${composerContainer.clientHeight}px + 80px)`;
                    }
                    channelsList.scrollTop = channelsList.scrollHeight;
                    const uploadsContainer = document.getElementById('upload-contain');
                    const chatComposerUpload = document.createElement('div');
                    chatComposerUpload.classList.add('chat-composer-upload', 'chat-composer-upload--image');
                    chatComposerUpload.setAttribute("id", "chat-composer-img");
                    const preview = document.createElement('div');
                    preview.classList.add('preview');
                    const imgElement = document.createElement('img');
                    imgElement.classList.add('preview-img');
                    imgElement.src = res.url; // 设置图片的src属性
                    preview.appendChild(imgElement);
                    const dataSpan = document.createElement('span');
                    dataSpan.classList.add('data');
                    const bottomData = document.createElement('div');
                    bottomData.classList.add('bottom-data');
                    dataSpan.appendChild(bottomData);
                    const removeButton = document.createElement('button');
                    removeButton.classList.add('btn', 'no-text', 'btn-icon', 'btn-flat', 'chat-composer-upload__remove-btn');
                    removeButton.setAttribute('title', '移除文件');
                    removeButton.setAttribute('type', 'button');
                    removeButton.addEventListener('click', function () {
                        // 移除当前图片的 URL
                        const index = imgUrl.indexOf('\n'+ res.url +'\n');
                        if (index !== -1) {
                            imgUrl.splice(index, 1);
                        }
                        console.log(imgUrl.length)
                        // 移除当前图片预览和移除按钮
                        chatComposerUpload.remove();
                        // 如果 imgUrl 没有数据，则恢复 chatDrawerContainer 的 paddingBottom
                        if (imgUrl.length === 0) {
                            chatDrawerContainer.style.paddingBottom = `${composerContainer.clientHeight}px`;
                        }
                    });
                    const removeButtonSVG = document.createElement('svg');
                    removeButtonSVG.classList.add('fa', 'd-icon', 'd-icon-times', 'svg-icon', 'svg-string');
                    removeButtonSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    removeButtonSVG.innerHTML = '<use href="#times"></use>&ZeroWidthSpace;';
                    removeButton.appendChild(removeButtonSVG);
                    chatComposerUpload.appendChild(preview);
                    chatComposerUpload.appendChild(dataSpan);
                    chatComposerUpload.appendChild(removeButton);
                    uploadsContainer.appendChild(chatComposerUpload);

                })
                    .catch(err => {
                    console.error('上传失败：', err);
                });
            }
        });
        // 触发文件输入框的点击事件，以打开文件选择对话框
        fileInput.click();
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const sendRead = async (chatId) => {
        const postDataArray = [];
        const randomTime = getRandomInt(60000, 61000);
        for (let i = 0; i < newArray.length; i++) {
            postDataArray.push(`timings%5B${newArray[i]}%5D=${randomTime}`);
        }
        const postData = postDataArray.concat([
            `topic_time=${randomTime}`,
            `topic_id=${chatId}`
        ]).join('&');
        try {
            await fetch("https://linux.do/topics/timings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-CSRF-Token": getCsrfToken(),
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: postData,
                credentials: "include"
            });
            console.log(`Timing for posts processed successfully.`);
        } catch (error) {
            console.error(`Error processing timing for posts:`, error);
        }
        // 所有请求执行完毕后清空数组
        newArray = [];
    };

    const createButton = () => {
        const button = document.createElement('button');
        button.id = 'chat-btn';
        button.className='icon btn-flat';


        // 创建 SVG 图标的 HTML 内容
        const svgIconHTML = `
    <svg width="26" height="26" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
        <path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="#919191"/>
    </svg>
`;
        // 将 SVG 图标的 HTML 内容设置为 button 元素的 innerHTML
        button.innerHTML = svgIconHTML;
        document.body.appendChild(button);
        button.addEventListener('click', async () => {
            if (flagTwo) {
                flag = true;
            } else {
                await getUsername(); // 获取用户名
            }
            let chatDrawer = document.getElementById('chat-draw');
            try {
                const chatData = await userRecentChat(); // 获取最近的聊天数据
                if (chatData) {
                    if (!chatDrawer) {
                        chatDrawer = createChatDrawer(chatData);
                        document.body.appendChild(chatDrawer);
                    } else {
                        if (!flag) {
                            await refreshChatList();
                        }
                        chatDrawer.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('Failed to fetch recent chat:', error);
            }
        });
        return button;
    };

   function setupChatBtn() {
        if (!document.getElementById('chat-btn')) {
            const ul = document.querySelector("#ember5 > header > div > div > div.panel > ul");
            if (ul) {
                const button = createButton();
                const li = document.createElement('li');
                li.className = 'header-dropdown-toggle';
                li.appendChild(button);
                ul.appendChild(li);
                console.log('Chat button added successfully');
                return true;
            }
        }
        return false;
    }

    function initializeChatButton() {
        let attempts = 0;
        const maxAttempts = 10;
        const attemptInterval = 100; // 100ms between attempts

        function attemptSetup() {
            if (setupChatBtn()) {
                console.log('Chat button initialized successfully');
                startObserving();
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(attemptSetup, attemptInterval);
            } else {
                console.log('Failed to add chat button after multiple attempts');
                startObserving(); // 即使失败也开始观察，以便之后可以添加
            }
        }

        // 使用 requestAnimationFrame 来确保 DOM 已经更新
        requestAnimationFrame(() => {
            // 给页面一个很短的时间来完成任何最后的更改
            setTimeout(attemptSetup, 50);
        });
    }

    function startObserving() {
        const header = document.querySelector("#ember5 > header");
        if (header) {
            // 使用 MutationObserver 监视 DOM 变化
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        // 检查是否有节点被移除
                        const removedNodes = Array.from(mutation.removedNodes);
                        const wasButtonRemoved = removedNodes.some(node =>
                            node.contains && node.contains(document.getElementById('chat-btn'))
                        );

                        if (wasButtonRemoved || !document.getElementById('chat-btn')) {
                            setupChatBtn();
                        }
                    }
                });
            });

            // 配置 observer
            const config = { childList: true, subtree: true };

            // 开始观察目标节点
            observer.observe(header, config);

            // 额外的定期检查
            setInterval(() => {
                if (!document.getElementById('chat-btn')) {
                    setupChatBtn();
                }
            }, 5000); // 每5秒检查一次
        }
    }

    // 如果 DOM 已经加载，立即初始化；否则等待 DOMContentLoaded 事件
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChatButton);
    } else {
        initializeChatButton();
    }
})();