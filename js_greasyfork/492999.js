// ==UserScript==
// @name         话题聊天室
// @namespace    http://tampermonkey.net/
// @version      4.1.1
// @description  Linux.do话题聊天室，在浏览其他帖子时，仍可以观察之前帖子的动态
// @author       unique
// @match        https://linux.do/*
// @grant        none
// @license MIT
// @icon https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @downloadURL https://update.greasyfork.org/scripts/492999/%E8%AF%9D%E9%A2%98%E8%81%8A%E5%A4%A9%E5%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/492999/%E8%AF%9D%E9%A2%98%E8%81%8A%E5%A4%A9%E5%AE%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //若需要固定话题聊天，只需要将下面的值进行替换对应的话题id，如//let fixTopicId = 1，不填入该值则为你最近回复的话题
    let fixTopicId = '';
    let homeTopic_id = '';
    let homeNumber = '';
    //用户名设置
    let username = '';
    //回复帖子id
    let reply_to_post_number = '';
    //回复默认头像
    let reply_avater = 'https://cdn.linux.do/uploads/default/original/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b.png';
    //新消息提醒
    let newMsg = false;
    //楼主展示
    let adminFloor = '';
    let imgUrl = [];
    // 生成数组
    let newArray = [];
    //获取csrfToken
    const getCsrfToken = () => {
        const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
        return csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : null;
    };

    // 添加拖动功能
    function addDraggableFeature(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const dragMouseDown = function (e) {
            // 检查事件的目标是否是输入框或隐藏的按钮
            if (e.target.tagName.toUpperCase() === 'INPUT' || e.target.tagName.toUpperCase() === 'TEXTAREA' || e.target.tagName.toUpperCase() === 'BUTTON') {
                return; // 如果是，则不执行拖动逻辑
            }
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };
        const elementDrag = function (e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            // 为了避免与拖动冲突，在此移除bottom和right样式
            element.style.bottom = '';
            element.style.right = '';
        };
        const closeDragElement = function () {
            document.onmouseup = null;
            document.onmousemove = null;
        };
        element.onmousedown = dragMouseDown;
    }

    const getUsername = async () => {
        if (username === '') {
            // 构建带有 CSRF token 的请求头
            const headers = new Headers();
            headers.append('X-Csrf-Token', getCsrfToken());
            // 发起带有 CSRF token 的请求
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

    const userRecentReply = async () => {
        const response = await fetch(`https://linux.do/user_actions.json?offset=0&username=${username}&filter=5`);
        if (!response.ok) throw new Error('Failed to fetch recent reply.');

        const jsonData = await response.json();
        if (jsonData.length === 0) {
            console.error('No recent actions found');
            return null;
        }
        return jsonData.user_actions[0];
    }
    const fetchMostRecentReply = async () => {
        try {
            if (fixTopicId === '') {
                const recentPost = await userRecentReply();
                homeTopic_id = recentPost.topic_id;
            } else {
                homeTopic_id = fixTopicId;
            }
            const postTopicResponse = await fetch(`https://linux.do/t/topic/${homeTopic_id}.json`);
            const postTopicJsonData = await postTopicResponse.json();
            adminFloor = postTopicJsonData.user_id;
            let difference = Math.abs(postTopicJsonData.highest_post_number - postTopicJsonData.last_read_post_number);
            for (let i = 1; i <= difference; i++) {
                const newValue = postTopicJsonData.last_read_post_number + i;
                if (!newArray.includes(newValue)) {
                    newArray.push(newValue);
                }
            }
            let postNumber = Math.max(postTopicJsonData.last_read_post_number, postTopicJsonData.highest_post_number);
            newMsg = postTopicJsonData.highest_post_number > postTopicJsonData.last_read_post_number;
            buttonController().setButtonColor(newMsg);
            homeNumber = postNumber;
            const postResponse = await fetch(`https://linux.do/t/topic/${homeTopic_id}/${postNumber}.json`, {
                headers: {
                    'X-CSRF-Token': getCsrfToken()
                }
            });
            const postJsonData = await postResponse.json();
            const posts = postJsonData.post_stream.posts;
            const lastTenPosts = posts.map(post => ({
                id: post.id,
                user_id: post.user_id,
                name: post.name,
                username: post.username,
                avatar_template: post.avatar_template,
                cooked: post.cooked,
                reaction_users_count: post.reaction_users_count,
                current_user_used_main_reaction: post.current_user_reaction,
                reply_to_user: post.reply_to_user,
                date: post.created_at,
                floor: post.post_number
            }));
            return {topicId: homeTopic_id, mostRecentReply: lastTenPosts};
        } catch (error) {
            console.error('Error fetching recent reply:', error);
            return null;
        }
    };
    const createAndAppendElement = (tag, attributes, textContent, parent) => {
        const element = document.createElement(tag);
        if (attributes) {
            Object.keys(attributes).forEach(key => {
                element.setAttribute(key, attributes[key]);
            });
        }
        if (textContent) {
            element.textContent = textContent;
        } else {
            element.innerHTML = attributes && attributes.innerHTML ? attributes.innerHTML : '';
        }
        if (parent) {
            parent.appendChild(element);
        }
        return element;
    };

    const fetchPutLikePost = (postID) => {
        const csrfToken = getCsrfToken();
        return fetch(
            `https://linux.do/discourse-reactions/posts/${postID}/custom-reactions/heart/toggle.json`,
            {
                headers: {
                    "x-csrf-token": csrfToken,
                },
                method: "PUT",
                credentials: "include",
            }
        );
    };

    const sendRead = async (itemIndex) => {
        if (itemIndex < newArray.length) {
            const randomTime = getRandomInt(60000, 61000);
            const item = newArray[itemIndex];
            const postData = [
                `timings%5B${item}%5D=${randomTime}`,
                `topic_time=${randomTime}`,
                `topic_id=${homeTopic_id}`
            ].join('&');

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
                console.log(`Timing for post ${item} processed successfully.`);
            } catch (error) {
                console.error(`Error processing timing for post ${item}:`, error);
            }
            // 延迟0.2秒后执行下一个请求
            setTimeout(() => {
                sendRead(itemIndex + 1);
            }, 200);
        } else {
            // 所有请求执行完毕后清空数组
            newArray = [];
        }
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const sendNewPost = async (content, topicId) => {
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
            'topic_id': topicId,
            'is_warning': 'false',
            'archetype': 'regular',
            'featured_link': '',
            'whisper': false,
            'shared_draft': 'false',
            'draft_key': `topic_${topicId}`,
            'nested_post': 'true',
            'reply_to_post_number': reply_to_post_number
        });
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData,
                credentials: 'include'
            });
            reply_to_post_number = '';
            const avatarImg = document.getElementById('quick-reply-avatar');
            // 更新头像的 src 属性
            avatarImg.src = 'https://cdn.linux.do/uploads/default/original/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b.png';
            if (!response.ok) throw new Error('Failed to send new post.');
        } catch (error) {
            console.error('Error sending new post:', error);
        }
    };
    // 初始化弹框样式
    const initPopupStyle = () => {
        return 'display: none;position: fixed; bottom: 2px; right: 5px; z-index: 9999; width: 385px; height: 520px;padding: 8px; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
    };
    let scrollPosition = 0;
    const createTitle = async (popup) => {
        try {
            const container = createAndAppendElement('div', {style: 'display: flex; justify-content: space-between; align-items: center; font-weight: bold; margin-bottom: 2px;width:375px'}, null, popup);
            // Create title div
            const title = createAndAppendElement('div', null, null, container);
            // Create SVG icon
            const svgIcon = `
                  <svg class="fa d-icon d-icon-d-chat svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
                    <use href="#comment" style="fill: #0088cc;"></use>
                  </svg>
                `;
            const svgElement = createAndAppendElement('span', null, null, title);
            svgElement.innerHTML = svgIcon;
            // Add text
            createAndAppendElement('span', null, '最近回复', title);
            // Create button element
            const button = createAndAppendElement('button', {style: 'border: none; background: none;float: right;width:25px'}, null, container);
            button.innerHTML = `
              <button class="btn no-text btn-icon btn-flat no-text c-navbar__close-drawer-button" title="关闭" type="button">
                 <svg class="fa d-icon d-icon-times svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#times"></use></svg>&ZeroWidthSpace;
              </button>
            `;
            button.addEventListener('click', () => {
                const popup = document.getElementById('quick-reply-popup');
                popup.style.display = 'none';
                // 更新头像的 src 属性
                const avatarImg = document.getElementById('quick-reply-avatar');
                avatarImg.src = 'https://cdn.linux.do/uploads/default/original/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b.png';
                const openButton = document.getElementById('quick-reply-open');
                openButton.style.pointerEvents = 'block';
                buttonController().setButtonColor(false);
                const recentReplyContent = document.getElementById('recent-reply-content')
                // 在关闭滑动框时记录滚动位置
                scrollPosition = recentReplyContent.scrollTop;
            });
        } catch (e) {
        }
    };
    const createCard = (reply, popup) => {
        const truncatedName = reply.name.length > 10 ? reply.name.substring(0, 10) + '...' : reply.name;
        const avatarSrc = reply.avatar_template.replace("{size}", "144");
        const shareIcon = reply.reply_to_user ? `<span style="vertical-align: middle;">
        <svg class="fa d-icon d-icon-share svg-icon svg-node" style="vertical-align: middle; width: 12px; height: 10px;">
            <use xlink:href="#share"></use>
        </svg>
        <img src="https://cdn.linux.do${reply.reply_to_user.avatar_template.replace('{size}', '48')}" alt="Avatar" style="width: 18px; height: 18px; border-radius: 50%; margin-right: 4px;padding-bottom: 0px;" />
    </span>` : '';

        const cardHtml = `
        <div style="display: flex; align-items: start; padding: 7px; background-color: #f8f8f8; border-radius: 16px; margin-bottom: 12px; max-width: 356px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <img src="${avatarSrc}" alt="" width="45" height="45" class="avatar" loading="lazy" style="border-radius: 50%; margin-right: 6px; object-fit: cover;" />
            <div style="flex-grow: 1; overflow: hidden;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
    <div style="color: #646464; font-weight: bold; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${truncatedName}">
        ${truncatedName.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
    </div>
    <div style="color: #777; font-size: 12px;">
        ${shareIcon}
        ${formatDate(reply.date)}
    </div>
</div>
<div style="color: #555; word-wrap: break-word; font-size: 16px; font-family: 'Microsoft YaHei'; position: relative;">
    ${reply.cooked}
    ${reply.user_id === adminFloor ? '<div class="ownerBox" style ="margin-left:190px">TOPIC OWNER</div>' : ''}
</div>

<style>
    .ownerBox {
        position: relative;
        margin-top: 10px; /* 调整盒子和 replyContent 之间的距离 */
        font-size: xx-small;
        color: #00aeff;
        font-style: italic;
        font-weight: 700;
    }
</style>

                <div style="display: flex; align-items: center;">
                    <span style="color: #b6b6b6; font-size: 13px;">楼层: ${reply.floor}</span>
                    <div style="flex-grow: 1;"></div>
                    <button class="heart-button" style="border: none;background-color: transparent; padding-top: 2px;">
                        <span style="color: #b6b6b6; font-size: 16px; margin-left: 4px;padding-bottom: 1px">${reply.reaction_users_count}</span>
                        <svg class="fa d-icon d-icon-far-heart svg-icon svg-node" aria-hidden="true">
    <use xlink:href="#far-heart" style="fill: ${reply.current_user_used_main_reaction ? 'red' : '#b6b6b6'};"></use>
</svg>
                    </button>
                    <button class="widget-button btn-flat reply create fade-out btn-icon-text" style="margin-left: 1px;">
                        <svg class="fa d-icon d-icon-reply svg-icon svg-node" aria-hidden="true">
                            <use xlink:href="#reply"></use>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
        const card = document.createElement('div');
        card.innerHTML = cardHtml;

        function formatDate(dateString) {
            const date = new Date(dateString);
            const hours = ('0' + date.getHours()).slice(-2);
            const minutes = ('0' + date.getMinutes()).slice(-2);
            return `${hours}:${minutes}`;
        }

        const avatarImg = card.querySelector('.avatar');

        let hoverTimeout;
        avatarImg.addEventListener('mouseover', () => {
            // 设置延迟0.5秒执行的动作，并将其存储在 hoverTimeout 中
            hoverTimeout = setTimeout(async () => {
                const isOnline = await checkLastSeenWithinFiveMinutes(reply.username);
                if (isOnline) {
                    // 如果用户在线，给头像添加绿色边框并覆盖原有样式
                    avatarImg.style.border = '2px solid green !important'; // 覆盖原有边框样式
                } else {
                    // 如果用户不在线，给头像添加灰色边框并覆盖原有样式
                    avatarImg.style.border = '2px solid gray !important'; // 覆盖原有边框样式
                }
            }, 500); // 0.5秒
        });

        avatarImg.addEventListener('mouseout', () => {
            // 鼠标离开头像时，取消之前设置的定时器
            clearTimeout(hoverTimeout);
            // 鼠标离开头像时将边框恢复为原来的状态
            avatarImg.style.border = ''; // 清除边框样式
        });
        // 为按钮添加点击事件监听器
        const button = card.querySelector('.widget-button');
        button.addEventListener('click', function () {
            const floor = reply.floor;
            reply_avater = reply.avatar_template.replace("{size}", "144");
            reply_to_post_number = floor;
            // 获取头像元素
            const avatarImg = document.getElementById('quick-reply-avatar');
            // 更新头像的 src 属性
            avatarImg.src = reply_avater;
        });
        const heartbutton = card.querySelector('.heart-button');
        heartbutton.addEventListener('click', function () {
            fetchPutLikePost(reply.id);
            createContent(popup);
        });
        heartbutton.addEventListener('mouseover', async () => {
            console.log(1);
        });
        // Check for images in the reply and add click event to open them in a new tab
        const images = card.querySelectorAll('img');
        images.forEach(image => {
            image.style.cursor = 'pointer';
            image.addEventListener('click', (event) => {
                event.preventDefault();
                window.open(image.src, '_blank');
                image.style.maxWidth = image.style.maxWidth === '100%' ? '' : '100%';
            });
        });
        return card;
    };

    const createContent = async (popup) => {
        try {
            const recentReplyContent = document.getElementById('recent-reply-content');
            // 检查是否已经存在这个元素
            if (!recentReplyContent) {
                // 如果不存在，创建元素
                const recentReplyContent = document.createElement('div');
                recentReplyContent.id = 'recent-reply-content';
                recentReplyContent.style.cssText = 'overflow-y: auto; height: 85%; margin-bottom: 0px; scrollbar-width: thin; scrollbar-color: #888 #f0f0f0;width: 390px;';
                popup.appendChild(recentReplyContent);
            }

            scrollPosition = recentReplyContent.scrollTop;
            const mostRecentReply = await fetchMostRecentReply(); // 等待获取最近回复数据
            recentReplyContent.innerHTML = '';
            if (!mostRecentReply) return;

            const {mostRecentReply: replies} = mostRecentReply;
            const fragment = document.createDocumentFragment();
            replies.forEach(reply => {
                reply.name = (reply.name === reply.username) ? reply.username : reply.name + ' ' + reply.username;
                const cardElement = createCard(reply, popup);
                fragment.appendChild(cardElement);
            });
            recentReplyContent.appendChild(fragment);
            // 每次滚动时更新滚动位置并保存
            recentReplyContent.addEventListener('scroll', () => {
                scrollPosition = recentReplyContent.scrollTop;
            });
        } catch (error) {
            console.error('Error creating content:', error);
        }
    };

    async function checkLastSeenWithinFiveMinutes(username) {
        try {
            const csrfToken = getCsrfToken();
            // 构建URL
            const url = `https://linux.do/u/${username}/card.json`;
            // 构建请求头
            const headers = new Headers();
            // 添加需要的请求头，例如认证信息等
            headers.append('Accept', 'application/json, text/javascript, */*; q=0.01');
            headers.append('Discourse-Logged-In', 'true');
            headers.append('Discourse-Present', 'true');
            headers.append('Referer', 'https://linux.do');
            headers.append('Sec-Ch-Ua', '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"');
            headers.append('Sec-Ch-Ua-Mobile', '?0');
            headers.append('Sec-Ch-Ua-Platform', '"Windows"');
            headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
            headers.append('X-Csrf-Token', csrfToken);
            headers.append('X-Requested-With', 'XMLHttpRequest');
            // 发送请求
            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
            });
            const userData = await response.json();
            // 解析最后看到的时间
            const lastSeenTime = new Date(userData.user.last_seen_at);
            // 获取当前时间
            const currentTime = new Date();
            // 计算时间差（单位：毫秒）
            const timeDifference = currentTime - lastSeenTime;
            // 将时间差转换成分钟
            const minutesDifference = timeDifference / (1000 * 60);
            // 检查时间差是否小于等于五分钟
            return minutesDifference <= 5;
        } catch (error) {
        }
    }

    function extracted(inputContainer) {
        const line = createAndAppendElement('div', {
            className: 'composer-separator',
            style: 'width: 1px;margin:0.25rem;box-sizing: border-box;background: var(--primary-low-mid);height: 26px;display: flex;'
        }, null, inputContainer);
    }

    // 创建输入框和发送按钮
    const createInputAndSendButton = (popup, sendAction) => {
        // 创建一个容器用于放置输入框、发送按钮和图片预览
        const container = createAndAppendElement('div', {
            style: 'position: absolute; bottom: 0px; right:0px; width:97%; background-color: #f0f0f0;padding:6px;'
        }, null, popup);

        // 创建输入框容器
        const inputContainer = createAndAppendElement('div', {
            style: 'display: flex; align-items: center; background-color: #ffffff; padding: 1px; border-radius: 8px; justify-content: space-between; border: 1px solid #494949;', // 已添加 justify-content 用于分隔元素
        }, null, container);

        // 创建图片预览容器
        const imagePreviewContainer = createAndAppendElement('div', {
            id: 'uploaded-image-preview-container',
            style: 'background-color: #f0f0f0;',
        }, null, container);
        // 创建 SVG 字符串
        const svgContent = `
         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="28" viewBox="0 0 24 24" fill="none"style="margin-top: 5px;">
           <path d="M11.286 21.7001C11.286 21.7001 11.2862 21.7004 12 21C12.7138 21.7004 12.7145 21.6997 12.7145 21.6997C12.5264 21.8913 12.2685 22 12 22C11.7315 22 11.474 21.8918 11.286 21.7001Z" fill="#494949"/>
           <path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7ZM11 10C11 9.44772 11.4477 9 12 9C12.5523 9 13 9.44772 13 10C13 10.5523 12.5523 11 12 11C11.4477 11 11 10.5523 11 10Z" fill="#494949"/>
           <path fill-rule="evenodd" clip-rule="evenodd" d="M11.286 21.7001L12 21L12.7145 21.6997L12.7204 21.6937L12.7369 21.6767L12.7986 21.6129C12.8521 21.5574 12.9296 21.4765 13.0277 21.3726C13.2239 21.1649 13.5029 20.8652 13.8371 20.4938C14.5045 19.7523 15.3968 18.7198 16.2916 17.5608C17.1835 16.4056 18.0938 15.104 18.7857 13.8257C19.4617 12.5767 20 11.2239 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 11.2239 4.53828 12.5767 5.21431 13.8257C5.90617 15.104 6.81655 16.4056 7.70845 17.5608C8.60322 18.7198 9.49555 19.7523 10.1629 20.4938C10.4971 20.8652 10.7761 21.1649 10.9723 21.3726C11.0704 21.4765 11.1479 21.5574 11.2014 21.6129L11.2631 21.6767L11.2796 21.6937L11.286 21.7001ZM6 10C6 6.68629 8.68629 4 12 4C15.3137 4 18 6.68629 18 10C18 10.7091 17.6633 11.6978 17.0268 12.8737C16.4062 14.0204 15.5665 15.2272 14.7084 16.3386C13.8532 17.4464 12.9955 18.4391 12.3504 19.156C12.2249 19.2955 12.1075 19.4244 12 19.5414C11.8925 19.4244 11.7751 19.2955 11.6496 19.156C11.0045 18.4391 10.1468 17.4464 9.29155 16.3386C8.43345 15.2272 7.59383 14.0204 6.9732 12.8737C6.33672 11.6978 6 10.7091 6 10Z" fill="#494949"/>
         </svg>
        `;
        // 创建并添加点击按钮
        const iconButton = createAndAppendElement('button', {
            id: 'quick-reply-icon',
            style: 'border: none; flex-shrink: 0; background-color: transparent;  cursor: pointer; outline: none; padding: 0; margin-left: 2px;maragin-bottom:0px;height:40px;'
        }, null, inputContainer);
        extracted(inputContainer);
        iconButton.innerHTML = svgContent;
        // 添加点击事件监听器
        iconButton.addEventListener('click', function () {
            // 当前标签页打开网址
            window.location.href = `https://linux.do/t/topic/${homeTopic_id}/${homeNumber}`;
        });

        // 创建包含图片的按钮，并添加点击事件监听器
        const avatarButton = createAndAppendElement('button', {
            id: 'quick-reply-avatar-button',
            style: 'border: none; background: none; padding: 0;height:40px;margin-left: 2px;width: 30px;'
        }, null, inputContainer);

        // 创建 img 元素，用于显示头像，并设置为圆形
        const avatarImg = createAndAppendElement('img', {
            id: 'quick-reply-avatar',
            src: reply_avater,
            width: '28',
            height: '28', // 将高度与宽度保持一致以确保正方形
            style: 'border-radius: 50%; object-fit: cover;margin-bottom: 2px;margin-right: 6px;margin-bottom: 0px;'
        }, null, avatarButton);

        // 添加点击事件监听器
        avatarButton.addEventListener('click', function () {
            // 在点击时更改 reply_avater 的值为新的头像地址
            reply_avater = 'https://cdn.linux.do/uploads/default/original/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b.png';
            // 更新图片的 src 属性为新的头像地址
            avatarImg.src = reply_avater;
            reply_to_post_number = '';
        });
        extracted(inputContainer);
        // 创建按钮元素
        const uploadButton = createAndAppendElement('div', {
            id: 'quick-reply-refresh',
        }, null, inputContainer);

        uploadButton.innerHTML = `
        <button class="btn no-text btn-icon fk-d-menu__trigger chat-composer-dropdown__trigger-btn btn-flat" aria-expanded="false" data-trigger="" type="button" id="ember419" data-identifier="chat-composer-dropdown__menu" style="padding-left: 2px; padding-right: 2px;" >
<svg class="fa d-icon d-icon-plus svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#plus"></use></svg>&ZeroWidthSpace;
    </button>
    `;

        // 给按钮添加点击事件监听器
        uploadButton.addEventListener('click', handleFileUpload);
        // 创建文本输入框，调整了一些样式以适应内嵌的布局
        const replyBox = createAndAppendElement('textarea', {
            id: 'quick-reply-box',
            style: 'whiteSpace = pre-wrap; flex-grow: 1;padding-left: 5px;paddimh-right:10px;padding-top:10px;padding-bottom:10px;background-color: rgb(255, 255, 255);border: 1px solid transparent;border-radius: 0px 0px 0px 0px;resize: none;font-size: 14px;line-height: 1.2;outline: none;height: 40px;margin-right: 0px;margin-bottom: 0px;' // 调整了边框半径和右边距
        }, null, inputContainer);
        replyBox.style.overflow = 'hidden';
        // 创建发送按钮，调整了一些样式以适应内嵌的布局
        const sendButton = createAndAppendElement('button', {
            id: 'quick-reply-send',
            style: 'background-color: transparent; margin-bottom:0px; color: white; border: none; border-radius: 0 9px 9px 0; cursor: pointer; font-size: 14px; line-height: 1; outline: none; padding: 10px 16px 8px 5px; height: 40px; width: 40px;'
        }, '发送', inputContainer);


        const sendContent = `
<svg class="fa d-icon d-icon-paper-plane svg-icon svg-string" xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="height: 20px;width: 17px;padding-left: 5px;">
  <use href="#paper-plane" fill="#494949"></use>
</svg>
       `;
        sendButton.innerHTML = sendContent;
        sendButton.addEventListener('click', async () => {
            const content = replyBox.value;
            const url = imgUrl.length > 0 ? imgUrl.join('\n') : '';
            const postData = url ? url + content : content;
            sendAction(postData);
            replyBox.value = '';
            imgUrl.length = 0;
            const imagePreviewContainer = document.getElementById("uploaded-image-preview-container");
            imagePreviewContainer.innerHTML = '';
        });
        replyBox.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault();
                sendButton.click();
            }
        });
    };

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
                        // 移除"content-type"，让浏览器自动设置
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-origin',
                        'x-csrf-token': csrfToken, // 确保替换为有效的CSRF令牌
                    },
                })
                    .then(serverPromise => {
                    return serverPromise.json();
                })
                    .then(res => {
                    console.log(res);
                    imgUrl.push('\n' + res.url + '\n'); // 设置 textarea 的 value 属性
                    const imagePreviewContainer = document.getElementById("uploaded-image-preview-container");
                    const chatUpload = document.getElementById("chat-composer-img");
                    if (!chatUpload) {
                        const recentReplyContent = document.getElementById('recent-reply-content');
                        recentReplyContent.style.height = '72%';
                        // 在关闭滑动框时记录滚动位置
                        recentReplyContent.scrollTop = recentReplyContent.scrollHeight - recentReplyContent.clientHeight;
                    }
                    const chatComposerUpload = document.createElement('div');
                    chatComposerUpload.classList.add('chat-composer-upload', 'chat-composer-upload--image');
                    chatComposerUpload.setAttribute("id", "chat-composer-img");
                    chatComposerUpload.style.marginTop ='6px';
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
                        const index = imgUrl.indexOf('\n' + res.url + '\n');
                        if (index !== -1) {
                            imgUrl.splice(index, 1);
                        }
                        // 移除当前图片预览和移除按钮
                        chatComposerUpload.remove();
                        if (imgUrl.length === 0) {
                            const recentReplyContent = document.getElementById('recent-reply-content');
                            recentReplyContent.style.height = '85%';
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
                    imagePreviewContainer.appendChild(chatComposerUpload);
                })
                    .catch(err => {
                    console.error('上传失败：', err);
                });
            }
        });
        // 触发文件输入框的点击事件，以打开文件选择对话框
        fileInput.click();
    }

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

    const indicatorStyle = `
    -webkit-user-select: none;
    user-select: none;
    cursor: default;
    width: 14px;
    height: 14px;
    border-radius: 1em;
    box-sizing: content-box;
    -webkit-touch-callout: none;
    background: var(--tertiary-med-or-tertiary);
    color: var(--secondary);
    font-size: var(--font-down-2);
    text-align: center;
    transition: border-color linear .15s;
    border: 2px solid var(--header_background);
    position: absolute;
    top: 0px;
    right: 3px;
`;

    const buttonController = () => {
        return {
            setButtonColor: function (newMsgRemind) {
                try {
                    const buttonWrapper = document.getElementById('quick-reply-open'); // 获取按钮容器元素
                    const indicator = buttonWrapper.querySelector('.chat-indicator'); // 获取指示器元素
                    if (newMsgRemind) {
                        // 如果有新消息，并且指示器不存在，则创建并添加未读指示器
                        if (!indicator) {
                            // 创建指示器元素
                            const indicatorElement = document.createElement('div');
                            indicatorElement.classList.add('chat-indicator');
                            // 应用样式
                            indicatorElement.style.cssText = indicatorStyle;
                            // 将指示器元素添加到按钮容器中
                            buttonWrapper.appendChild(indicatorElement);
                        }
                    } else {
                        // 如果没有新消息，并且指示器存在，则移除指示器
                        if (indicator) {
                            indicator.remove();
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        };
    };


    // 初始化
    const init = async () => {
        try {
            await getUsername();
            // 创建并设置弹框样式
            const popup = createAndAppendElement('div', {
                id: 'quick-reply-popup',
                style: initPopupStyle()
            }, null, document.body);
            await createTitle(popup);
            await createContent(popup);
            // 调用 createInputAndSendButton 方法，并将更新头像的函数传递给它
            createInputAndSendButton(popup, async (message) => {
                // 发送消息
                await sendNewPost(message, homeTopic_id);
                // 重新填充最近回复内容
                await createContent(popup);
            });
            const buttonWrapper = createAndAppendElement('div', {
                title: "聊天室",
                style: `position: fixed;
            top: 1.4%;
            right: 18.5%;
            transform: translate(50%, 0);
            z-index: 9999;
            cursor: move;
            width: 42.33px;
            height: 42.33px;
            display: flex;
            justify-content: center;
            align-items: center;`
            }, null, document.body);


            const openButton = createAndAppendElement('button', {
                id: 'quick-reply-open',
                style: 'border: none; cursor: pointer; background: none;width:42.33px;height: 42.33px;'
            }, null, buttonWrapper);

            const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgIcon.setAttribute("class", "fa d-icon d-icon-d-regular svg-icon svg-string");
            svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svgIcon.setAttribute("style", "width: 26px; height: 26px;fill: #d0d0d0;"); // 设置样式调整大小
            svgIcon.innerHTML = '<use href="#far-bell"></use>';

            openButton.appendChild(svgIcon);

            // 获取按钮元素
            const openStyleButton = document.getElementById('quick-reply-open');
            // 添加鼠标悬停事件监听器
            openStyleButton.addEventListener('mouseover', function () {
                // 应用指定的样式
                openStyleButton.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'; // 添加半透明的背景色
                openStyleButton.style.borderTop = '1px solid transparent';
                openStyleButton.style.borderLeft = '1px solid transparent';
                openStyleButton.style.borderRight = '1px solid transparent';
                openStyleButton.style.borderRadius = '4px'; // 添加圆角
                // 获取SVG图标元素
                const svgIcon = openStyleButton.querySelector('svg');
                if (svgIcon) {
                    // 设置SVG图标的线条颜色为更深的颜色
                    svgIcon.querySelector('use').setAttribute('fill', '#919191');
                }
            });

            // 添加鼠标离开事件监听器
            openStyleButton.addEventListener('mouseleave', function () {
                openStyleButton.style.background = 'none';
                openStyleButton.style.border = 'none';
                openStyleButton.style.cursor = 'pointer';
                const svgIcon = openStyleButton.querySelector('svg');
                if (svgIcon) {
                    // 恢复SVG图标的线条颜色为默认颜色
                    svgIcon.querySelector('use').setAttribute('fill', '#d0d0d0');
                }
            });

            // 初始化时设置按钮颜色
            buttonController();
            openButton.addEventListener('click', async () => {
                const popup = document.getElementById('quick-reply-popup');
                if (popup.style.display === 'none') {
                    popup.style.display = 'block';
                    // 在打开最近回复弹窗时获取数据
                    await createContent(popup);
                    await sendRead(0);
                    const recentReplyContent = document.getElementById('recent-reply-content')
                    recentReplyContent.scrollTop = scrollPosition;
                }
            });
            addDraggableFeature(popup);
            setInterval(async () => {
                const replyBox = document.getElementById('quick-reply-box');
                if (!replyBox.value.trim()) {
                    console.log('Refreshing content'); // 添加日志
                    await createContent(popup);
                    const recentReplyContent = document.getElementById('recent-reply-content');
                    recentReplyContent.scrollTop = scrollPosition;
                }
            }, 5000);
        } catch (error) {
            console.error('Error initializing script:', error);
        }
    };
    // 调用初始化函数
    init();
})();