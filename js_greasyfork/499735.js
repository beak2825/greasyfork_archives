// ==UserScript==
// @name         linux.do小黑屋
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @icon         https://cdn.linux.do/uploads/default/original/3X/f/0/f0eec44920f273f0d066c9acb9ee814f53187e22.png
// @description  隐藏用户的评论
// @author       hibao
// @match        https://linux.do/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499735/linuxdo%E5%B0%8F%E9%BB%91%E5%B1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/499735/linuxdo%E5%B0%8F%E9%BB%91%E5%B1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BLOCK_BUTTON_CLASS = 'rm-bt';
    const BLOCKED_USERS_KEY = 'blockedUserIds';
    const MODAL_ID = 'block-user-modal';
    const MANAGE_BUTTON_ID = 'manage-block-button';
    let modal = null;
    let manageButton = null;
    let blockButtonFlag = true;

    // 初始化脚本
    function init() {
        ensureBlockedUsersData();
        updateBlockedUsers();
        createManageBlockButton();
        observeDOMChanges();
    }

    // 确保被屏蔽用户的数据存在
    function ensureBlockedUsersData() {
        if (!GM_getValue(BLOCKED_USERS_KEY)) {
            GM_setValue(BLOCKED_USERS_KEY, []);
        }
    }

    // 更新页面上的被屏蔽用户
    function updateBlockedUsers() {
        const blockedUserIds = GM_getValue(BLOCKED_USERS_KEY);
        const userElements = document.querySelectorAll('[data-user-id]');

        userElements.forEach(userElement => {
            const userId = userElement.getAttribute('data-user-id');
            if(userElement.getAttribute('id') === 'post_1') return;
            if (blockedUserIds.includes(userId)) {
                toggleUserVisibility(userElement, true);
            } else {
                toggleUserVisibility(userElement, false);
                addUserBlockButton(userElement);
            }
        });
    }

    // 添加屏蔽按钮
    function addUserBlockButton(userElement) {
        if (userElement.tagName === 'A' || userElement.querySelector(`.${BLOCK_BUTTON_CLASS}`)) return;

        const blockButton = document.createElement('div');
        blockButton.className = BLOCK_BUTTON_CLASS;
        blockButton.textContent = '屏蔽';
        blockButton.style.cssText = 'color: grey; margin-left: 10px; cursor: pointer;';
        userElement.querySelector('.names.trigger-user-card').appendChild(blockButton);

        blockButton.addEventListener('click', () => {
            blockUser(userElement);
            updateBlockedUsers();
        });
    }

    // 屏蔽用户
    function blockUser(userElement) {
        const userId = userElement.getAttribute('data-user-id');
        let blockedUserIds = GM_getValue(BLOCKED_USERS_KEY);

        if (!blockedUserIds.includes(userId)) {
            blockedUserIds.push(userId);
            GM_setValue(BLOCKED_USERS_KEY, blockedUserIds);
            saveUserDetails(userElement);
            toggleUserVisibility(userElement, true);
        }
    }

    // 切换用户可见性
    function toggleUserVisibility(userElement, hidden) {
        try{
            userElement.parentElement.hidden = hidden;
        }catch(e){
            console.log('报错啦，没关系')
        }

    }

    // 保存用户详情
    function saveUserDetails(userElement) {
        const userId = userElement.getAttribute('data-user-id');
        const userImage = userElement.querySelector('img').src;
        const username = userElement.querySelector('[data-user-card]').getAttribute('data-user-card');
        const userCards = userElement.querySelectorAll('[data-user-card]');
        let name ;
        for(let i = 1;i<userCards.length ; i++){
            let userCard = userCards[i];
            if( userCard.parentElement.classList.contains('first')){
                let _username = userCard.getAttribute('data-user-card');
                if(_username !== username) continue;
                try{
                    name = userCard.text;
                }catch(e) {
                    console.log('报错啦')
                }
            }
            if(name) break;
        }
        let user_name = username;
        if(name && name !== username){
            user_name = name + '('+username+')';
        }
        const userDetails = { userId, username:user_name, img: userImage };

        GM_setValue(userId.toString(), userDetails);
    }

    // 创建管理屏蔽按钮
    function createManageBlockButton() {
        manageButton = document.createElement('div');
        manageButton.id = MANAGE_BUTTON_ID;
        manageButton.innerText = '小黑屋';
        manageButton.style.cssText = 'position: fixed; top: 95%; left: 95%; z-index: 1000; padding: 10px 20px; background-color: #007BFF; color: #FFF; border: none; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); cursor: pointer;';
        document.body.appendChild(manageButton);

        manageButton.addEventListener('mousedown', function(event) {
            const shiftX = event.clientX - manageButton.getBoundingClientRect().left;
            const shiftY = event.clientY - manageButton.getBoundingClientRect().top;

            function onMouseMove(event) {
                blockButtonFlag = false
                let newX = event.clientX - shiftX;
                let newY = event.clientY - shiftY;

                const rightEdge = document.documentElement.clientWidth - manageButton.offsetWidth;
                const bottomEdge = document.documentElement.clientHeight - manageButton.offsetHeight;

                if (newX < 0) newX = 0;
                if (newY < 0) newY = 0;
                if (newX > rightEdge) newX = rightEdge;
                if (newY > bottomEdge) newY = bottomEdge;

                manageButton.style.left = newX + 'px';
                manageButton.style.top = newY + 'px';
                if (modal) {
                    modal.style.display = 'none';
                }
            }

            document.addEventListener('mousemove', onMouseMove);

            document.addEventListener('mouseup', function() {
                document.removeEventListener('mousemove', onMouseMove);
            }, { once: true });
        });

        manageButton.addEventListener('click', () => {
            if(!blockButtonFlag){
                blockButtonFlag = true
                return;
            } ;
            if (modal) {
                document.body.removeChild(modal);
            }
            createBlockUserModal(manageButton.getBoundingClientRect());
        });
    }

    // 创建屏蔽用户弹窗
    function createBlockUserModal(buttonRect) {
        modal = document.createElement('div');
        modal.id = MODAL_ID;
        modal.style.cssText = `display: block; position: fixed; top: ${buttonRect.top + buttonRect.height + 10}px; left: ${buttonRect.left}px; width: 300px; max-height: 300px; padding: 20px; background-color: #FFF; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); z-index: 1001; overflow-y: auto;`;

        const titleContainer = document.createElement('div');
        titleContainer.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
        const title = document.createElement('h3');
        title.innerText = '小黑子';
        title.style.cssText = 'margin: 0 0 10px 0; padding: 0; color: #333;';
        titleContainer.appendChild(title);

        const clearAllButton = document.createElement('button');
        clearAllButton.innerText = '移除全部';
        clearAllButton.style.cssText = 'background-color: #DC3545; color: #FFF; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer;';
        clearAllButton.addEventListener('click',()=>{
            const oldHeigth = modal.offsetHeight
            clearAllBlockedUsers();
            modifyModalTop(oldHeigth,modal.offsetHeight );
        } );
        titleContainer.appendChild(clearAllButton);

        modal.appendChild(titleContainer);

        const list = document.createElement('ul');
        list.style.cssText = 'list-style: none; padding: 0; margin: 0;';
        modal.appendChild(list);

        buildBlockedUserList(list);

        document.body.appendChild(modal);

        // 限制弹窗显示区域
        const rightEdge = document.documentElement.clientWidth - modal.offsetWidth;
        const bottomEdge = document.documentElement.clientHeight - modal.offsetHeight;
        if (buttonRect.left > rightEdge) {
            modal.style.left = `${rightEdge}px`;
        }
        if (buttonRect.top + buttonRect.height + modal.offsetHeight > bottomEdge) {
            modal.style.top = `${buttonRect.top - modal.offsetHeight - 10}px`;
        }

        // 点击弹窗外任意区域关闭弹窗
        document.addEventListener('click', function closeModal(event) {
            if (!modal.contains(event.target) && event.target.id !== MANAGE_BUTTON_ID) {
                modal.style.display = 'none';
                document.removeEventListener('click', closeModal);
            }
        });
    }


    // 构建被屏蔽用户列表
    function buildBlockedUserList(list) {
        const blockedUserIds = GM_getValue(BLOCKED_USERS_KEY);

        blockedUserIds.forEach(userId => {
            const userDetails = GM_getValue(userId.toString());
            if (userDetails) {
                addBlockedUserListItem(list, userDetails);
            }
        });
    }

    // 添加被屏蔽用户列表项
    function addBlockedUserListItem(list, user) {
        const listItem = document.createElement('li');
        listItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 5px 0;';

        const img = document.createElement('img');
        img.alt = '';
        img.width = 30;
        img.height = 30;
        img.src = user.img;
        img.ariaHidden = 'true';
        img.loading = 'lazy';
        img.tabIndex = '-1';
        img.className = 'avatar';
        listItem.appendChild(img);

        const username = document.createElement('span');
        username.innerText = user.username;
        username.style.flex = '1';
        listItem.appendChild(username);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = '删除';
        deleteButton.style.cssText = 'background-color: #DC3545; color: #FFF; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer;';
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            removeBlockedUser(user.userId);
            const oldHeigth = modal.offsetHeight;
            list.removeChild(listItem);
            modifyModalTop(oldHeigth,modal.offsetHeight );
        });

        listItem.appendChild(deleteButton);
        list.appendChild(listItem);
    }
    function modifyModalTop(oldHeigth,newHeigth){
        if(manageButton && modal ){
            const motop = parseInt(modal.style.top);
            const matop = parseInt(manageButton.style.top);
            if(motop < matop && oldHeigth !== newHeigth){
                modal.style.top =`${motop + (oldHeigth - newHeigth)}px`
            }
        }

    }

    // 移除被屏蔽用户
    function removeBlockedUser(userId) {
        let blockedUserIds = GM_getValue(BLOCKED_USERS_KEY);
        blockedUserIds = blockedUserIds.filter(id => id !== userId);
        GM_setValue(BLOCKED_USERS_KEY, blockedUserIds);
        toggleUserVisibility(document.querySelector(`[data-user-id="${userId}"]`), false);
    }

    // 清除所有被屏蔽用户
    function clearAllBlockedUsers() {
        GM_setValue(BLOCKED_USERS_KEY, []);
        updateBlockedUsers();
        if (modal) {
            modal.querySelector('ul').innerHTML = '';
        }
    }

    // 观察DOM变化
    function observeDOMChanges() {
        const observer = new MutationObserver(() => {
            updateBlockedUsers();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();
