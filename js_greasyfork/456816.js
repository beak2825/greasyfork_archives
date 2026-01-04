// ==UserScript==
// @name         修改GPT头像
// @namespace    changeChatGPTAvatar
// @version      1.3
// @description  替换ChatGPT里的ai头像
// @author       mei
// @match        https://chatgpt.com
// @match        https://chatgpt.com/c/*
// @icon         https://s3.bmp.ovh/imgs/2024/10/28/9f08b1db7997ec74.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456816/%E4%BF%AE%E6%94%B9GPT%E5%A4%B4%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/456816/%E4%BF%AE%E6%94%B9GPT%E5%A4%B4%E5%83%8F.meta.js
// ==/UserScript==

//头像地址（你可以自己提供一个图片的链接来替换它。如果你希望使用某张本地图片，可以选择上传到图床，并用图床的链接替换它。要检查链接是否有效，可以直接将链接复制到地址栏并回车查看是否有图片显示。）
var userImageUrl = "https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com";
var gptImageUrl = "https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com";

//控制单个头像的更换 更换请用true 不更换请用false
var processUser = true; // 是否生成用户头像
var processGpt = true; // 是否更换GPT的图像】

//在Gpt对话的右侧添加空白区域以保持对齐 （这会导致Gpt回复的文本区域缩小，最好配合修改对话区域使用。）
var addSpace = true;

//修改对话区域 修改请用true 不修改请用false
var editChatDivWidth = true;
var chatDivWidth = '50rem'; //对话区域大小 默认为40rem，要修改请只修改数字

//脚本部分
(function() {
    'use strict';
    const observer = new MutationObserver(() => {
        const h5sronlyMessages = document.querySelectorAll('h5.sr-only');
        const h6sronlyMessages = document.querySelectorAll('h6.sr-only');
        if (processUser){
            h5sronlyMessages.forEach(message => {
                if (message.textContent.trim() === '您说：') {
                    checkUserChat(message);
                }
            });
        }
        if(processGpt){
            h5sronlyMessages.forEach(message => {
                if (message.textContent.trim() === '') {
                    checkGPTChat(message);
                }
            });
            h6sronlyMessages.forEach(message => {
                if (message.textContent.trim() === 'ChatGPT 说：') {
                    checkGPTChat(message);
                }
            });
        }
    });

    const avatarTemplate = document.createElement('template');
    avatarTemplate.innerHTML = `
        <div class="flex-shrink-0 flex flex-col relative items-end">
            <div class="gizmo-bot-avatar flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
                <div class="relative p-0 rounded-sm flex items-center justify-center bg-token-main-surface-primary text-token-text-primary h-8 w-8">
                </div>
            </div>
        </div>
    `;
    const placeholderTemplate = document.createElement('template');
    placeholderTemplate.innerHTML = `
        <div class="flex-shrink-0 flex flex-col relative items-end">
            <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background-color: transparent;">
            </div>
        </div>
    `;
    const checkUserChat = (message) => {
        const userMessageContainer = message.parentNode.querySelector('.mx-auto.flex.flex-1.gap-4.text-base.md\\:gap-5.lg\\:gap-6.md\\:max-w-3xl.lg\\:max-w-\\[40rem\\].xl\\:max-w-\\[48rem\\]');
        if (userMessageContainer){
            if (editChatDivWidth){
                userMessageContainer.style.maxWidth = chatDivWidth;
            }
            if (!userMessageContainer.querySelector('.flex-shrink-0')) {
                const avatarClone = createAvatarNode(userImageUrl);
                userMessageContainer.appendChild(avatarClone);
            }
        }
    }
    const checkGPTChat = (message) => {
        const gptMessageContainer = message.parentNode.querySelector('.mx-auto.flex.flex-1.gap-4.text-base.md\\:gap-5.lg\\:gap-6.md\\:max-w-3xl.lg\\:max-w-\\[40rem\\].xl\\:max-w-\\[48rem\\]');
        if (gptMessageContainer){
            if (editChatDivWidth){
                gptMessageContainer.style.maxWidth = chatDivWidth;
            }
            if (!gptMessageContainer.querySelector('.flex-shrink-0')) {
                const avatarClone = createAvatarNode(gptImageUrl);
                gptMessageContainer.prepend(avatarClone);
                if(addSpace){
                    const avatarCloneSpace = createAvatarNode('');
                    gptMessageContainer.appendChild(avatarCloneSpace);
                }
            }
        }
    }
    const createAvatarNode = (imageUrl) => {

        if(imageUrl != ''){
            const avatarNode = avatarTemplate.content.firstElementChild.cloneNode(true);
            const img = document.createElement('img');
            img.src = imageUrl; // 使用传入的图像链接
            img.alt = 'Custom Avatar';
            img.style.width = '32px'; // 设置宽度
            img.style.height = '32px'; // 设置高度
            img.style.borderRadius = '50%'; // 圆形边框
            img.style.margin = '0'; // 重置外边距
            img.style.padding = '0'; // 重置内边距
            img.style.display = 'block'; // 确保没有行内元素造成的偏移

            const innerDiv = avatarNode.querySelector('.relative');
            innerDiv.appendChild(img);
            return avatarNode;
        }else{
            const avatarNode = placeholderTemplate.content.firstElementChild.cloneNode(true);
            return avatarNode;
        }
    };

    // 开始观察
    observer.observe(document.body, { childList: true, subtree: true });
})();

