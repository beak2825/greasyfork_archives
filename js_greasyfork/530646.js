// ==UserScript==
// @name         MWI Friend Helper/好友助手
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  Add group and note features to the friends page in MWI game/为MWI游戏的朋友页面添加分组和备注功能
// @author       shykai
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/530646/MWI%20Friend%20Helper%E5%A5%BD%E5%8F%8B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530646/MWI%20Friend%20Helper%E5%A5%BD%E5%8F%8B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isZHInGameSetting = localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith("zh"); // 获取游戏内设置语言
    let isZH = isZHInGameSetting; // 本身显示的语言默认由游戏内设置语言决定

    // 添加样式
    GM_addStyle(`
        .mwi-helper-controls {
            margin: 10px 0;
            padding: 10px;
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
        }
        .mwi-helper-group-selector {
            margin-right: 10px;
            padding: 5px;
            border-radius: 3px;
        }
        .mwi-helper-ctl-group {
            padding: 5px 10px;
            border-radius: 3px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        .mwi-helper-ctl-group:hover {
            background-color: #45a049;
        }
        .mwi-friend-note {
            font-size: 0.8em;
            color: #888;
            font-style: italic;
            margin-top: 2px;
        }
        .mwi-friend-group-tag {
            display: inline-block;
            font-size: 0.7em;
            background-color: #3498db;
            color: white;
            padding: 2px 5px;
            border-radius: 3px;
            margin-right: 3px;
            margin-top: 2px;
        }
        .mwi-friend-actions {
            margin-top: 5px;
        }
        .mwi-friend-action-btn {
            font-size: 0.8em;
            padding: 2px 5px;
            margin-right: 5px;
            border-radius: 3px;
            cursor: pointer;
            border: none;
        }
        .mwi-edit-btn {
            background-color: #f39c12;
            color: white;
        }
        .mwi-edit-btn:hover {
            background-color: #e67e22;
        }
        .mwi-group-btn {
            background-color: #3498db;
            color: white;
        }
        .mwi-group-btn:hover {
            background-color: #2980b9;
        }
        .mwi-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
        }
        .mwi-modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border-radius: 5px;
            width: 300px;
            color: #333;
        }
        .mwi-modal-close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        .mwi-modal-close:hover {
            color: black;
        }
        .mwi-modal input, .mwi-modal select {
            width: 100%;
            padding: 8px;
            margin: 8px 0;
            box-sizing: border-box;
        }
        .mwi-modal button {
            padding: 8px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-top: 10px;
        }
        .mwi-modal button:hover {
            background-color: #45a049;
        }
        .mwi-group-checkbox {
            margin-right: 5px;
            max-width: 30px;
        }
        .mwi-group-list {
            max-height: 150px;
            overflow-y: auto;
            margin: 10px 0;
        }
        .mwi-group-item {
            margin: 5px 0;
        }
        .mwi-edit-mode-toggle {
            margin-left: 10px;
            padding: 5px 10px;
            border-radius: 3px;
            background-color: #9b59b6;
            color: white;
            border: none;
            cursor: pointer;
        }
        .mwi-edit-mode-toggle:hover {
            background-color: #8e44ad;
        }
        .mwi-edit-mode-on {
            background-color: #e74c3c;
        }
        .mwi-edit-mode-on:hover {
            background-color: #c0392b;
        }
        .mwi-hidden {
            display: none !important;
        }
        .mwi-group-tags-container {
            margin: 10px 0;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        }
        .mwi-filter-group-tag {
            display: inline-block;
            font-size: 0.8em;
            background-color: #3498db;
            color: white;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;
            user-select: none;
        }
        .mwi-filter-group-tag:hover {
            background-color: #2980b9;
        }
        .mwi-filter-group-tag.active {
            background-color: #e74c3c;
        }
        .mwi-reset-filter {
            display: inline-block;
            font-size: 0.8em;
            background-color: #95a5a6;
            color: white;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 5px;
        }
        .mwi-reset-filter:hover {
            background-color: #7f8c8d;
        }
    `);

    // 存储数据结构
    let friendsData = GM_getValue('mwiFriendsData', {
        friends: {},  // 格式: {friendName: {note: "备注", groups: ["组1", "组2"]}}
        groups: isZH ? ["默认", "公会", "副本", "交易"] : ["Default", "Guild", "Dungeon", "Trade"]  // 默认分组
    });

    // 编辑模式状态
    let editMode = false;

    // 保存数据
    function saveData() {
        GM_setValue('mwiFriendsData', friendsData);
    }

    // 添加新分组
    function addGroup(groupName) {
        if (groupName && !friendsData.groups.includes(groupName)) {
            friendsData.groups.push(groupName);
            saveData();
            return true;
        }
        return false;
    }

    // 更新好友信息
    function updateFriend(friendName, note, groups) {
        if (!friendsData.friends[friendName]) {
            friendsData.friends[friendName] = {
                note: "",
                groups: []
            };
        }

        if (note !== undefined) {
            friendsData.friends[friendName].note = note;
        }

        if (groups !== undefined) {
            friendsData.friends[friendName].groups = groups;
        }

        saveData();
        updateUserGroupsAndNote();
    }

    // 按多个分组筛选好友
    function filterFriendsByGroups(groupNames) {
        const friendRows = document.querySelectorAll('.SocialPanel_friendsTable__3uOAL tbody tr');

        friendRows.forEach(row => {
            const nameCell = row.querySelector('.SocialPanel_name__1cCQ1');
            if (!nameCell) return;

            const nameElement = nameCell.querySelector('.CharacterName_name__1amXp');
            if (!nameElement) return;

            const friendName = nameElement.getAttribute('data-name');
            const friendInfo = friendsData.friends[friendName];

            // 检查好友是否属于任一选中的分组
            let shouldShow = false;
            if (friendInfo && friendInfo.groups) {
                for (const group of groupNames) {
                    if (friendInfo.groups.includes(group)) {
                        shouldShow = true;
                        break;
                    }
                }
            }

            row.style.display = shouldShow ? '' : 'none';
        });
    }

    // 按分组筛选好友
    function filterFriendsByGroup(groupName) {
        const friendRows = document.querySelectorAll('.SocialPanel_friendsTable__3uOAL tbody tr');

        friendRows.forEach(row => {
            const nameCell = row.querySelector('.SocialPanel_name__1cCQ1');
            if (!nameCell) return;

            const nameElement = nameCell.querySelector('.CharacterName_name__1amXp');
            if (!nameElement) return;

            const friendName = nameElement.getAttribute('data-name');

            if (groupName === 'all') {
                row.style.display = '';
                return;
            }

            const friendInfo = friendsData.friends[friendName];
            if (friendInfo && friendInfo.groups && friendInfo.groups.includes(groupName)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    // 创建控制面板
    function createControlPanel(container) {
        const controlPanel = document.createElement('div');
        controlPanel.className = 'mwi-helper-controls';

        // 创建分组标签容器
        const groupTagsContainer = document.createElement('div');
        groupTagsContainer.className = 'mwi-group-tags-container';

        // 添加重置筛选按钮
        const resetFilter = document.createElement('span');
        resetFilter.className = 'mwi-reset-filter';
        resetFilter.textContent = isZH ? '显示全部' : 'Show All';
        resetFilter.addEventListener('click', function () {
            // 移除所有分组标签的active状态
            const groupTags = groupTagsContainer.querySelectorAll('.mwi-filter-group-tag');
            groupTags.forEach(tag => {
                tag.classList.remove('active');
            });
            // 显示所有好友
            filterFriendsByGroup('all');
        });
        groupTagsContainer.appendChild(resetFilter);

        // 为每个分组创建可点击的标签
        friendsData.groups.forEach(group => {
            const groupTag = document.createElement('span');
            groupTag.className = 'mwi-filter-group-tag';
            groupTag.textContent = group;
            groupTag.dataset.group = group;

            groupTag.addEventListener('click', function () {
                // 切换active状态
                this.classList.toggle('active');

                // 如果有active的标签，则按这些标签筛选
                const activeTags = groupTagsContainer.querySelectorAll('.mwi-filter-group-tag.active');
                if (activeTags.length > 0) {
                    const activeGroups = Array.from(activeTags).map(tag => tag.dataset.group);
                    filterFriendsByGroups(activeGroups);
                } else {
                    // 如果没有active的标签，显示所有好友
                    filterFriendsByGroup('all');
                }
            });

            groupTagsContainer.appendChild(groupTag);
        });

        controlPanel.appendChild(groupTagsContainer);

        // 添加分组按钮
        const addGroupBtn = document.createElement('button');
        addGroupBtn.className = 'mwi-helper-ctl-group';
        addGroupBtn.textContent = isZH ? '添加' : 'Add';
        addGroupBtn.classList.add('mwi-hidden'); // 默认隐藏
        addGroupBtn.addEventListener('click', function () {
            showAddGroupModal();
        });

        // 删除分组按钮
        const deleteGroupBtn = document.createElement('button');
        deleteGroupBtn.className = 'mwi-helper-ctl-group';
        deleteGroupBtn.textContent = isZH ? '删除' : 'Delete';
        deleteGroupBtn.style.backgroundColor = '#e74c3c';
        deleteGroupBtn.style.marginLeft = '5px';
        deleteGroupBtn.classList.add('mwi-hidden'); // 默认隐藏
        deleteGroupBtn.addEventListener('click', function () {
            showDeleteGroupModal();
        });

        // 重命名分组按钮
        const renameGroupBtn = document.createElement('button');
        renameGroupBtn.className = 'mwi-helper-ctl-group';
        renameGroupBtn.textContent = isZH ? '重命名' : 'Rename';
        renameGroupBtn.style.backgroundColor = '#f39c12';
        renameGroupBtn.style.marginLeft = '5px';
        renameGroupBtn.classList.add('mwi-hidden'); // 默认隐藏
        renameGroupBtn.addEventListener('click', function () {
            showRenameGroupModal();
        });

        // 编辑模式切换按钮
        const editModeBtn = document.createElement('button');
        editModeBtn.className = 'mwi-edit-mode-toggle';
        editModeBtn.textContent = isZH ? '进入编辑模式' : 'Enter Edit Mode';
        editModeBtn.addEventListener('click', function () {
            toggleEditMode();
            updateEditModeUI();
        });

        // 导出按钮
        const exportBtn = document.createElement('button');
        exportBtn.className = 'mwi-helper-ctl-group';
        exportBtn.textContent = isZH ? '导出' : 'Export';
        exportBtn.style.backgroundColor = '#1abc9c';
        exportBtn.style.marginLeft = '5px';
        exportBtn.classList.add('mwi-hidden');
        exportBtn.addEventListener('click', function () {
            exportFriendsData();
        });

        // 导入按钮
        const importBtn = document.createElement('button');
        importBtn.className = 'mwi-helper-ctl-group';
        importBtn.textContent = isZH ? '导入' : 'Import';
        importBtn.style.backgroundColor = '#16a085';
        importBtn.style.marginLeft = '5px';
        importBtn.classList.add('mwi-hidden');
        importBtn.addEventListener('click', function () {
            showImportModal();
        });

        controlPanel.appendChild(addGroupBtn);
        controlPanel.appendChild(deleteGroupBtn);
        controlPanel.appendChild(renameGroupBtn);
        controlPanel.appendChild(exportBtn);
        controlPanel.appendChild(importBtn);
        controlPanel.appendChild(editModeBtn);

        container.insertBefore(controlPanel, container.firstChild);
    }

    // 切换编辑模式
    function toggleEditMode() {
        editMode = !editMode;
    }

    // 更新编辑模式UI
    function updateEditModeUI() {
        // 更新编辑模式按钮
        const editModeBtn = document.querySelector('.mwi-edit-mode-toggle');
        if (editModeBtn) {
            if (editMode) {
                editModeBtn.textContent = isZH ? '退出编辑模式' : 'Exit Edit Mode';
                editModeBtn.classList.add('mwi-edit-mode-on');
            } else {
                editModeBtn.textContent = isZH ? '进入编辑模式' : 'Enter Edit Mode';
                editModeBtn.classList.remove('mwi-edit-mode-on');
            }
        }

        // 更新分组控制按钮
        const ctlGroupBtn = document.querySelectorAll('.mwi-helper-ctl-group');
        ctlGroupBtn.forEach(btn => {
            if (editMode) {
                btn.classList.remove('mwi-hidden');
            } else {
                btn.classList.add('mwi-hidden');
            }
        });

        // 更新所有好友操作按钮
        const actionButtons = document.querySelectorAll('.mwi-friend-actions');
        actionButtons.forEach(actionDiv => {
            if (editMode) {
                actionDiv.classList.remove('mwi-hidden');
            } else {
                actionDiv.classList.add('mwi-hidden');
            }
        });
    }

    // 按分组筛选好友
    function filterFriendsByGroup(groupName) {
        const friendRows = document.querySelectorAll('.SocialPanel_friendsTable__3uOAL tbody tr');

        friendRows.forEach(row => {
            const nameCell = row.querySelector('.SocialPanel_name__1cCQ1');
            if (!nameCell) return;

            const nameElement = nameCell.querySelector('.CharacterName_name__1amXp');
            if (!nameElement) return;

            const friendName = nameElement.getAttribute('data-name');

            if (groupName === 'all') {
                row.style.display = '';
                return;
            }

            const friendInfo = friendsData.friends[friendName];
            if (friendInfo && friendInfo.groups && friendInfo.groups.includes(groupName)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // 显示添加分组的模态框
    function showAddGroupModal() {
        const modal = document.createElement('div');
        modal.className = 'mwi-modal';
        modal.style.display = 'block';

        const modalContent = document.createElement('div');
        modalContent.className = 'mwi-modal-content';

        const closeBtn = document.createElement('span');
        closeBtn.className = 'mwi-modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = function () {
            document.body.removeChild(modal);
        };

        const title = document.createElement('h3');
        title.textContent = isZH ? '添加新分组' : 'Add New Group';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = isZH ? '输入分组名称' : 'Enter group name';

        const submitBtn = document.createElement('button');
        submitBtn.textContent = isZH ? '添加' : 'Add';
        submitBtn.onclick = function () {
            const groupName = input.value.trim();
            if (groupName) {
                if (addGroup(groupName)) {
                    // 刷新页面以显示更新
                    const friendsTable = document.querySelector('.SocialPanel_friendsTable__3uOAL');
                    if (friendsTable) {
                        const container = friendsTable.parentElement;
                        const oldPanel = container.querySelector('.mwi-helper-controls');
                        if (oldPanel) {
                            container.removeChild(oldPanel);
                        }
                    }
                    enhanceFriendsPanel();
                    document.body.removeChild(modal);
                } else {
                    alert(isZH ? '分组已存在或名称无效' : 'Group already exists or invalid name');
                }
            }
        };

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(input);
        modalContent.appendChild(submitBtn);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    // 删除分组
    function deleteGroup(groupName) {
        if (groupName && friendsData.groups.includes(groupName)) {
            // 从分组列表中删除
            const index = friendsData.groups.indexOf(groupName);
            if (index > -1) {
                friendsData.groups.splice(index, 1);
            }

            // 从所有好友中删除该分组
            Object.keys(friendsData.friends).forEach(friendName => {
                const friend = friendsData.friends[friendName];
                if (friend.groups && friend.groups.includes(groupName)) {
                    const groupIndex = friend.groups.indexOf(groupName);
                    if (groupIndex > -1) {
                        friend.groups.splice(groupIndex, 1);
                    }
                }
            });

            saveData();
            updateUserGroupsAndNote();
            return true;
        }
        return false;
    }

    // 显示删除分组的模态框
    function showDeleteGroupModal() {
        const modal = document.createElement('div');
        modal.className = 'mwi-modal';
        modal.style.display = 'block';

        const modalContent = document.createElement('div');
        modalContent.className = 'mwi-modal-content';

        const closeBtn = document.createElement('span');
        closeBtn.className = 'mwi-modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = function () {
            document.body.removeChild(modal);
        };

        const title = document.createElement('h3');
        title.textContent = isZH ? '删除分组' : 'Delete Group';

        const groupList = document.createElement('div');
        groupList.className = 'mwi-group-list';

        // 为每个分组创建单选按钮
        friendsData.groups.forEach(group => {
            const groupItem = document.createElement('div');
            groupItem.className = 'mwi-group-item';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.className = 'mwi-group-checkbox';
            radio.name = 'deleteGroup';
            radio.value = group;

            const label = document.createElement('label');
            label.textContent = group;

            groupItem.appendChild(radio);
            groupItem.appendChild(label);
            groupList.appendChild(groupItem);
        });

        const warningText = document.createElement('p');
        warningText.textContent = isZH ? '警告：删除分组将会从所有好友中移除该分组标签！' : 'Warning: Deleting the group will remove the tag from all friends!';
        warningText.style.color = '#e74c3c';
        warningText.style.fontWeight = 'bold';

        const submitBtn = document.createElement('button');
        submitBtn.textContent = isZH ? '删除' : 'Delete';
        submitBtn.style.backgroundColor = '#e74c3c';
        submitBtn.onclick = function () {
            const selectedRadio = groupList.querySelector('input[name="deleteGroup"]:checked');
            if (selectedRadio) {
                const groupName = selectedRadio.value;
                if (deleteGroup(groupName)) {
                    // 刷新页面以显示更新
                    const friendsTable = document.querySelector('.SocialPanel_friendsTable__3uOAL');
                    if (friendsTable) {
                        const container = friendsTable.parentElement;
                        const oldPanel = container.querySelector('.mwi-helper-controls');
                        if (oldPanel) {
                            container.removeChild(oldPanel);
                        }
                    }
                    enhanceFriendsPanel();
                    document.body.removeChild(modal);
                } else {
                    alert(isZH ? '删除分组失败' : 'Failed to delete the group');
                }
            } else {
                alert(isZH ? '请选择要删除的分组' : 'Please select the group to delete');
            }
        };

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(warningText);
        modalContent.appendChild(groupList);
        modalContent.appendChild(submitBtn);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }


    // 重命名分组
    function renameGroup(oldName, newName) {
        if (!oldName || !newName || oldName === newName || !friendsData.groups.includes(oldName) || friendsData.groups.includes(newName)) {
            return false;
        }

        // 更新分组列表
        const index = friendsData.groups.indexOf(oldName);
        if (index > -1) {
            friendsData.groups[index] = newName;
        }

        // 更新所有好友的分组
        Object.keys(friendsData.friends).forEach(friendName => {
            const friend = friendsData.friends[friendName];
            if (friend.groups && friend.groups.includes(oldName)) {
                const groupIndex = friend.groups.indexOf(oldName);
                if (groupIndex > -1) {
                    friend.groups[groupIndex] = newName;
                }
            }
        });

        saveData();
        updateUserGroupsAndNote();
        return true;
    }

    // 显示重命名分组的模态框
    function showRenameGroupModal() {
        const modal = document.createElement('div');
        modal.className = 'mwi-modal';
        modal.style.display = 'block';

        const modalContent = document.createElement('div');
        modalContent.className = 'mwi-modal-content';

        const closeBtn = document.createElement('span');
        closeBtn.className = 'mwi-modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = function () {
            document.body.removeChild(modal);
        };

        const title = document.createElement('h3');
        title.textContent = isZH ? '重命名分组' : 'Rename Group';

        const groupList = document.createElement('div');
        groupList.className = 'mwi-group-list';

        // 为每个分组创建单选按钮
        friendsData.groups.forEach(group => {
            const groupItem = document.createElement('div');
            groupItem.className = 'mwi-group-item';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.className = 'mwi-group-checkbox';
            radio.name = 'renameGroup';
            radio.value = group;

            const label = document.createElement('label');
            label.textContent = group;

            groupItem.appendChild(radio);
            groupItem.appendChild(label);
            groupList.appendChild(groupItem);
        });

        const newNameInput = document.createElement('input');
        newNameInput.type = 'text';
        newNameInput.placeholder = '输入新的分组名称';

        const submitBtn = document.createElement('button');
        submitBtn.textContent = isZH ? '重命名' : 'Rename';
        submitBtn.style.backgroundColor = '#f39c12';
        submitBtn.onclick = function () {
            const selectedRadio = groupList.querySelector('input[name="renameGroup"]:checked');
            if (!selectedRadio) {
                alert(isZH ? '请选择要重命名的分组' : 'Please select the group to rename');
                return;
            }

            const oldName = selectedRadio.value;
            const newName = newNameInput.value.trim();

            if (!newName) {
                alert(isZH ? '请输入新的分组名称' : 'Please input the new group name');
                return;
            }

            if (friendsData.groups.includes(newName)) {
                alert(isZH ? '该分组名称已存在' : 'Group name already exists');
                return;
            }

            if (renameGroup(oldName, newName)) {
                // 刷新页面以显示更新
                const friendsTable = document.querySelector('.SocialPanel_friendsTable__3uOAL');
                if (friendsTable) {
                    const container = friendsTable.parentElement;
                    const oldPanel = container.querySelector('.mwi-helper-controls');
                    if (oldPanel) {
                        container.removeChild(oldPanel);
                    }
                }
                enhanceFriendsPanel();
                document.body.removeChild(modal);
            } else {
                alert(isZH ? '重命名分组失败' : 'Failed to rename the group');
            }
        };

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(groupList);
        modalContent.appendChild(document.createElement('br'));
        modalContent.appendChild(newNameInput);
        modalContent.appendChild(submitBtn);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    // 导出好友数据
    function exportFriendsData() {
        const json = JSON.stringify(friendsData, null, 2);
        navigator.clipboard.writeText(json).then(() => {
            alert(isZH ? '好友数据已复制到剪贴板！' : 'Friends data copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback: show in modal or alert
            const textarea = document.createElement('textarea');
            textarea.value = json;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                alert(isZH ? '好友数据已复制到剪贴板！' : 'Friends data copied to clipboard!');
            } catch (err) {
                 alert(isZH ? '复制失败，请手动复制' : 'Failed to copy, please copy manually');
                 console.log(json);
            }
            document.body.removeChild(textarea);
        });
    }

    // 显示导入好友数据的模态框
    function showImportModal() {
        const modal = document.createElement('div');
        modal.className = 'mwi-modal';
        modal.style.display = 'block';

        const modalContent = document.createElement('div');
        modalContent.className = 'mwi-modal-content';

        const closeBtn = document.createElement('span');
        closeBtn.className = 'mwi-modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = function () {
            document.body.removeChild(modal);
        };

        const title = document.createElement('h3');
        title.textContent = isZH ? '导入好友数据' : 'Import Friends Data';

        const textarea = document.createElement('textarea');
        textarea.placeholder = isZH ? '请粘贴JSON数据' : 'Paste JSON data here';
        textarea.style.width = '100%';
        textarea.style.height = '150px';
        textarea.style.resize = 'vertical';

        const warningText = document.createElement('p');
        warningText.textContent = isZH ? '警告：导入将覆盖当前所有数据！' : 'Warning: Import will overwrite all current data!';
        warningText.style.color = '#e74c3c';
        warningText.style.fontSize = '0.9em';

        const submitBtn = document.createElement('button');
        submitBtn.textContent = isZH ? '导入' : 'Import';
        submitBtn.style.backgroundColor = '#e74c3c'; // Red for caution
        submitBtn.onclick = function () {
            const jsonStr = textarea.value.trim();
            if (!jsonStr) return;

            try {
                const newData = JSON.parse(jsonStr);
                
                // Simple validation
                if (newData && typeof newData === 'object' && newData.friends && Array.isArray(newData.groups)) {
                    if (confirm(isZH ? '确定要覆盖所有数据吗？' : 'Are you sure you want to overwrite all data?')) {
                        friendsData = newData;
                        saveData();
                        
                        // Refresh UI
                        const friendsTable = document.querySelector('.SocialPanel_friendsTable__3uOAL');
                        if (friendsTable) {
                            const container = friendsTable.parentElement;
                            const oldPanel = container.querySelector('.mwi-helper-controls');
                            if (oldPanel) {
                                container.removeChild(oldPanel);
                            }
                        }
                        enhanceFriendsPanel();
                        document.body.removeChild(modal);
                        alert(isZH ? '导入成功' : 'Import successful');
                    }
                } else {
                    alert(isZH ? '数据格式错误' : 'Invalid data format');
                }
            } catch (e) {
                alert((isZH ? 'JSON解析失败: ' : 'JSON parse failed: ') + e.message);
            }
        };

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(textarea);
        modalContent.appendChild(warningText);
        modalContent.appendChild(submitBtn);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    // 显示编辑好友备注的模态框
    function showEditNoteModal(friendName) {
        const friendInfo = friendsData.friends[friendName] || { note: "", groups: [] };

        const modal = document.createElement('div');
        modal.className = 'mwi-modal';
        modal.style.display = 'block';

        const modalContent = document.createElement('div');
        modalContent.className = 'mwi-modal-content';

        const closeBtn = document.createElement('span');
        closeBtn.className = 'mwi-modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = function () {
            document.body.removeChild(modal);
        };

        const title = document.createElement('h3');
        title.textContent = isZH ? '编辑好友备注' : 'Edit Friend Note';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = isZH ? '输入备注' : 'Input note';
        input.value = friendInfo.note || '';

        const submitBtn = document.createElement('button');
        submitBtn.textContent = isZH ? '保存' : 'Save';
        submitBtn.onclick = function () {
            const note = input.value.trim();
            updateFriend(friendName, note);
            enhanceFriendsPanel();
            document.body.removeChild(modal);
        };

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(input);
        modalContent.appendChild(submitBtn);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    // 显示管理好友分组的模态框
    function showManageGroupsModal(friendName) {
        const friendInfo = friendsData.friends[friendName] || { note: "", groups: [] };

        const modal = document.createElement('div');
        modal.className = 'mwi-modal';
        modal.style.display = 'block';

        const modalContent = document.createElement('div');
        modalContent.className = 'mwi-modal-content';

        const closeBtn = document.createElement('span');
        closeBtn.className = 'mwi-modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = function () {
            document.body.removeChild(modal);
        };

        const title = document.createElement('h3');
        title.textContent = isZH ? '管理好友分组' : 'Manage Friend Groups';

        const groupList = document.createElement('div');
        groupList.className = 'mwi-group-list';

        // 为每个分组创建复选框
        friendsData.groups.forEach(group => {
            const groupItem = document.createElement('div');
            groupItem.className = 'mwi-group-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'mwi-group-checkbox';
            checkbox.value = group;
            checkbox.checked = friendInfo.groups && friendInfo.groups.includes(group);

            const label = document.createElement('label');
            label.textContent = group;

            groupItem.appendChild(checkbox);
            groupItem.appendChild(label);
            groupList.appendChild(groupItem);
        });

        const submitBtn = document.createElement('button');
        submitBtn.textContent = isZH ? '保存' : 'Save';
        submitBtn.onclick = function () {
            const selectedGroups = [];
            const checkboxes = groupList.querySelectorAll('.mwi-group-checkbox');
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedGroups.push(checkbox.value);
                }
            });

            updateFriend(friendName, undefined, selectedGroups);
            enhanceFriendsPanel();
            document.body.removeChild(modal);
        };

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(groupList);
        modalContent.appendChild(submitBtn);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }


    // 更新用户分组和备注
    function updateUserGroupsAndNote() {
        const friendsTable = document.querySelector('.SocialPanel_friendsTable__3uOAL');
        if (!friendsTable) return;

        const container = friendsTable.parentElement;
        const oldPanel = container.querySelector('.mwi-helper-controls');
        if (!oldPanel) {
            return;
        }

        // 增强好友列表
        const friendRows = friendsTable.querySelectorAll('tbody tr');

        friendRows.forEach(row => {
            const nameCell = row.querySelector('.SocialPanel_name__1cCQ1');
            if (!nameCell) return;

            const nameElement = nameCell.querySelector('.CharacterName_name__1amXp');
            if (!nameElement) return;

            const friendName = nameElement.getAttribute('data-name');
            const friendInfo = friendsData.friends[friendName] || { note: "", groups: [] };

            // 添加备注显示
            const noteDiv = row.querySelector('div.mwi-friend-note');
            if (noteDiv) {
                noteDiv.textContent = friendInfo.note || '';
            }

            // 添加分组标签
            const groupsContainer = nameCell.querySelector('div.mwi-friend-groups');
            if (groupsContainer) {
                while (groupsContainer.firstChild) {
                    groupsContainer.removeChild(groupsContainer.firstChild);
                }

                friendInfo.groups.forEach(group => {
                    const groupTag = document.createElement('span');
                    groupTag.className = 'mwi-friend-group-tag';
                    groupTag.textContent = group;
                    groupsContainer.appendChild(groupTag);
                });
            }
        });

        console.log("updateUserGroupsAndNote");
    }

    // 增强好友面板
    function enhanceFriendsPanel() {
        const friendsTable = document.querySelector('.SocialPanel_friendsTable__3uOAL');
        if (!friendsTable) return;

        // 添加控制面板
        const container = friendsTable.parentElement;
        const oldPanel = container.querySelector('.mwi-helper-controls');
        if (oldPanel) {
            return;
        }
        createControlPanel(container);

        // 增强好友列表
        const friendRows = friendsTable.querySelectorAll('tbody tr');

        friendRows.forEach(row => {
            const nameCell = row.querySelector('.SocialPanel_name__1cCQ1');
            if (!nameCell) return;

            // 检查是否已经增强过
            if (nameCell.querySelector('.mwi-friend-note')) return;

            const charNameElement = nameCell.querySelector('.SocialPanel_characterName__13xRA');
            if (!charNameElement) return;

            const nameElement = charNameElement.querySelector('.CharacterName_name__1amXp');
            if (!nameElement) return;

            const friendName = nameElement.getAttribute('data-name');
            const friendInfo = friendsData.friends[friendName] || { note: "", groups: [] };

            // 添加备注显示
            const noteDiv = document.createElement('div');
            noteDiv.className = 'mwi-friend-note';
            noteDiv.style.marginLeft = "10px";
            noteDiv.style.display = "inline-block";
            noteDiv.style.marginTop = "0";
            noteDiv.textContent = friendInfo.note || '';
            nameCell.appendChild(noteDiv);

            charNameElement.style.display = "inline-block"; //补成一行


            // 添加分组标签
            const groupsContainer = document.createElement('div');
            groupsContainer.className = 'mwi-friend-groups';
            if (friendInfo.groups && friendInfo.groups.length > 0) {
                friendInfo.groups.forEach(group => {
                    const groupTag = document.createElement('span');
                    groupTag.className = 'mwi-friend-group-tag';
                    groupTag.textContent = group;
                    groupsContainer.appendChild(groupTag);
                });
            }
            nameCell.appendChild(groupsContainer);

            // 添加操作按钮
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'mwi-friend-actions';
            // 默认隐藏操作按钮
            if (!editMode) {
                actionsDiv.classList.add('mwi-hidden');
            }

            const editBtn = document.createElement('button');
            editBtn.className = 'mwi-friend-action-btn mwi-edit-btn';
            editBtn.textContent = '编辑备注';
            editBtn.onclick = function (e) {
                e.stopPropagation();
                showEditNoteModal(friendName);
            };

            const groupBtn = document.createElement('button');
            groupBtn.className = 'mwi-friend-action-btn mwi-group-btn';
            groupBtn.textContent = '管理分组';
            groupBtn.onclick = function (e) {
                e.stopPropagation();
                showManageGroupsModal(friendName);
            };

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(groupBtn);
            nameCell.appendChild(actionsDiv);
        });

        // 更新编辑模式UI
        updateEditModeUI();

        console.log("enhanceFriendsPanel");
    }

    function handleTooptipnameActionMenu(div) {
        // 检查是否已经增强过
        if (div.querySelector('.mwi-friend-note')) return;

        const nameElement = div.querySelector('.CharacterName_name__1amXp');
        if (!nameElement) return;

        const friendName = nameElement.getAttribute('data-name');
        const friendInfo = friendsData.friends[friendName] || { note: "", groups: [] };

        // 添加备注显示
        const noteDiv = document.createElement('div');
        noteDiv.className = 'mwi-friend-note';
        noteDiv.textContent = friendInfo.note || '';
        if (noteDiv.textContent === '') {
            noteDiv.style.display = 'none';
        }
        div.insertBefore(noteDiv, div.childNodes[div.childNodes.length - 1]);


        // 添加分组标签
        const groupsContainer = document.createElement('div');
        groupsContainer.className = 'mwi-friend-groups';
        if (friendInfo.groups && friendInfo.groups.length > 0) {
            friendInfo.groups.forEach(group => {
                const groupTag = document.createElement('span');
                groupTag.className = 'mwi-friend-group-tag';
                groupTag.textContent = group;
                groupsContainer.appendChild(groupTag);
            });
        }
        if (groupsContainer.childNodes.length === 0) {
            groupsContainer.style.display = 'none';
        }
        div.insertBefore(groupsContainer, div.childNodes[div.childNodes.length - 1]);
    }

    // 监听DOM变化，当好友面板出现时增强它
    function observeDOM() {
        const observer = new MutationObserver(mutations => {
            // 检查是否有好友面板
            const friendsTable = document.querySelector('.SocialPanel_friendsTable__3uOAL');
            if (friendsTable) {
                enhanceFriendsPanel();
            }

            const toolsTip = document.querySelector('div.MuiTooltip-tooltip');
            if (toolsTip && toolsTip.childNodes.length > 0 && toolsTip.childNodes[0].className.includes("nameActionMenu")) {
                handleTooptipnameActionMenu(toolsTip.childNodes[0]);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化
    function init() {
        // 检查是否已经有好友面板
        const friendsTable = document.querySelector('.SocialPanel_friendsTable__3uOAL');
        if (friendsTable) {
            enhanceFriendsPanel();
        }

        // 开始观察DOM变化
        observeDOM();
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

