// ==UserScript==
// @name         BDWM-Hide
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  北大未名，屏蔽版面或用户
// @author       lanvent
// @match        https://bbs.pku.edu.cn/v2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pku.edu.cn
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484350/BDWM-Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/484350/BDWM-Hide.meta.js
// ==/UserScript==


let blockBlocks = [];
let blockUsers = [];

async function setblockBlocks(str){
    blockBlocks = str.replace('，',',').split(',').map(word => word.trim()).filter(word => word.length > 0);
    await GM.setValue('BDWM_blockBlocks', blockBlocks);
    if( blockBlocks.length == 0){
        return;
    }
    removeBoardBlocks();
    removeTitles();
}

async function setblockUsers(str){
    blockUsers = str.replace('，',',').split(',').map(word => word.trim()).filter(word => word.length > 0);
    await GM.setValue('BDWM_blockUsers', blockUsers);
    if( blockUsers.length == 0){
        return;
    }
    removePostCards();
    removePosts();
}

async function setblockBlocksPrompt() {
    const userInput = prompt('请输入要屏蔽的版面名称，用逗号分隔:', blockBlocks.join(', '));
    if (userInput !== null) {
        await setblockBlocks(userInput);
    }
}

async function setblockUsersPrompt() {
    const userInput = prompt('请输入要屏蔽的用户名称，用逗号分隔:', blockUsers.join(', '));
    if (userInput !== null) {
        await setblockUsers(userInput);
    }
}

function addSettingsButton() {
    const container = document.querySelector('div.extend-menu.setting-extend-menu > div.content');
    if(container == null || container.querySelector('a[name="blockBlocks-button"]')){
        return;
    }
    const logoutButton = container.querySelector('a.btn-logout');
    let settingsButton = document.createElement('a');
    settingsButton.textContent = '屏蔽版面设置';
    settingsButton.name = 'blockBlocks-button';
    settingsButton.addEventListener('click', async function(event) {
        event.preventDefault();
        await setblockBlocksPrompt();
    });
    container.insertBefore(settingsButton,logoutButton);
    settingsButton = document.createElement('a');
    settingsButton.textContent = '屏蔽用户设置';
    settingsButton.name = 'blockUsers-button';
    settingsButton.addEventListener('click', async function(event) {
        event.preventDefault();
        await setblockUsersPrompt();
    });
    container.insertBefore(settingsButton,logoutButton);
}

function addCustomSettingRow() {
    const form = document.getElementById('preference-form');
    if(form==null || form.querySelector('input[name="blockBlocks-keywords"]')){
        return;
    }
    const submitButtonRow = form.querySelector('.extra-margin-top');
    // 版面
    let settingRow = document.createElement('div');
    settingRow.className = 'form-row';
    settingRow.innerHTML = `
            <label>屏蔽版面名称</label>
            <div style="display: inline-block">
                    <input type="text" name="blockBlocks-keywords" placeholder="输入版面名称，用逗号分隔" style="margin: 1px 0;
    padding: 0 0 0 0px;
    height: 28px;
    line-height: 28px;
    width: 338px;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    text-indent: 10px"/>
            </div>
        `;
    form.insertBefore(settingRow, submitButtonRow);
    const blocksKeywordInput = settingRow.querySelector('input[name="blockBlocks-keywords"]');
    blocksKeywordInput.value = blockBlocks.join(', ');
    // 用户
    settingRow = document.createElement('div');
    settingRow.className = 'form-row';
    settingRow.innerHTML = `
            <label>屏蔽用户名称</label>
            <div style="display: inline-block">
                    <input type="text" name="blockUsers-keywords" placeholder="输入用户名，用逗号分隔" style="margin: 1px 0;
    padding: 0 0 0 0px;
    height: 28px;
    line-height: 28px;
    width: 338px;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    text-indent: 10px"/>
            </div>
        `;
    form.insertBefore(settingRow, submitButtonRow);
    const usersKeywordInput = settingRow.querySelector('input[name="blockUsers-keywords"]');
    usersKeywordInput.value = blockUsers.join(', ');
    const applyButton = form.querySelector('.orange-large-btn');
    applyButton.addEventListener('click', function(event){
        setblockBlocks(blocksKeywordInput.value);
        setblockUsers(usersKeywordInput.value);
    });
}

function removeBoardBlocks() {
    //版面
    let boardBlocks = document.querySelectorAll('.boards-wrapper.list > div.set');
    if(boardBlocks!=null){
        boardBlocks.forEach(block => {
            let content = block.querySelector('span.name')?.textContent;
            if (content && blockBlocks.some(word => word===content)){
                console.log("remove block "+content,block);
                block.remove();
            }
        });
    }
    boardBlocks = document.querySelectorAll('.boards-wrapper.hots > div.board-block');
    if(boardBlocks!=null){
        boardBlocks.forEach(block => {
            let content = block.querySelector('span.name')?.textContent;
            if (content && blockBlocks.some(word => word===content)){
                console.log("remove block "+content,block);
                block.remove();
            }
        });
    }
}

function removeTitles() {
    //主页榜单
    let titles = document.querySelectorAll('li');
    if(titles){
        titles.forEach(title => {
            let content = title.querySelector('a.post-link')?.textContent;
            if (content && blockBlocks.some(word => content.startsWith(word+' '))){
                console.log("remove block "+content.substr(0,content.lastIndexOf(' ')),title);
                title.remove();
            }
            content = title.querySelector('a.topic-link')?.textContent;
            if (content && blockBlocks.some(word => content.startsWith('['+word+']'))){
                console.log("remove block "+content.substr(1,content.lastIndexOf(']')-1),title);
                title.remove();
            }
        });
    }
    //主页榜单更多
    titles = document.querySelectorAll('div.list-item');
    if(titles){
        titles.forEach(title => {
            let content = title.querySelector('div.board-cont > div.board')?.textContent;
            if (blockBlocks.some(word => content.startsWith(word))){
                console.log("remove block "+content.substr(1,content.lastIndexOf(']')-1),title);
                title.remove();
                return;
            }
            let author = title.querySelector('div.author > div.name')?.textContent;
            if (author && blockUsers.some(word => word===author)){
                console.log("remove user " + author ,title);
                title.remove();
            }
        });
    }
    titles = document.querySelectorAll('p > a.topic-link');
    if(titles){
        titles.forEach(title => {
            let content = title.textContent;
            if (blockBlocks.some(word => title.textContent.startsWith('['+word+']'))){
                console.log("remove block "+content.substr(1,content.lastIndexOf(']')-1),title);
                title.remove();
            }
        });
    }
    titles = document.querySelectorAll('a.inline-link');
    if(titles){
        titles.forEach(title => {
            let content = title.textContent;
            if (blockBlocks.some(word => title.textContent.startsWith('['+word+']'))){
                console.log("remove block "+content.substr(1,content.lastIndexOf(']')-1),title);
                title.remove();
            }
        });
    }
}

function removePostCards() {
    //帖子内
    let postCards = document.querySelectorAll('div.card-list > .post-card');
    if(postCards){
        postCards.forEach(postcard => {
            let content = postcard.querySelector('p.username > a')?.textContent;
            if (content && blockUsers.some(word => word===content)){
                console.log("remove user " + content ,postcard);
                postcard.remove();
                return;
            }
            //删除引用部分
            let quote = postcard.querySelector('p.quotehead')
            content = quote?.attributes['data-username']?.textContent;
            if (content && blockUsers.some(word => word===content)){
                console.log("remove user quote " + content ,postcard);
                quote.remove();
                postcard.querySelectorAll('p.blockquote').forEach(bq => bq.remove());
            }
        });
    }
}

function removePosts() {
    //版面帖子列表
    let posts = document.querySelectorAll('#list-content > .list-item');
    if(posts){
        posts.forEach(post => {
            let content = post.querySelector('.author > .name')?.textContent;
            if (content && blockUsers.some(word => word===content)){
                console.log("remove user " + content ,post);
                post.remove();
            }
        });
    }
}

(async function() {
    'use strict';
    blockBlocks = await GM.getValue('BDWM_blockBlocks', []);
    blockUsers = await GM.getValue('BDWM_blockUsers', []);
    const config = { childList: true, subtree: true };
    addSettingsButton();
    addCustomSettingRow();
    removeBoardBlocks();
    removeTitles();
    removePostCards();
    removePosts();
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                observer.disconnect();
                addSettingsButton();
                addCustomSettingRow();
                observer.observe(document.body, config);
                removeBoardBlocks();
                removeTitles();
                removePostCards();
                removePosts();
            }
        });
    });
    observer.observe(document.body, config);
})();