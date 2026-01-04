// ==UserScript==
// @name         Bilibili Comment UID Reader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Read UIDs from Bilibili comments
// @author       You
// @match        *https://www.bilibili.com/video*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488044/Bilibili%20Comment%20UID%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/488044/Bilibili%20Comment%20UID%20Reader.meta.js
// ==/UserScript==

(function() {
    'use strict';
const sidebarCss = `
#customSidebar {
    position: fixed;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    z-index: 1000;
    background-color: white;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
}
`;

const styleElement = document.createElement('style');
styleElement.type = 'text/css';
styleElement.appendChild(document.createTextNode(sidebarCss));
document.head.appendChild(styleElement);

const sidebar = document.createElement('div');
sidebar.id = 'customSidebar';
document.body.appendChild(sidebar);

const displayUsersBtn = document.createElement('button');
displayUsersBtn.innerText = '显示所有用户及其组别';
displayUsersBtn.onclick = displayAllUsersAndGroups;
sidebar.appendChild(displayUsersBtn);
sidebar.appendChild(document.createElement('br')); 

const clearGroupsBtn = document.createElement('button');
clearGroupsBtn.innerText = '清除所有组';
clearGroupsBtn.onclick = function() { clearSpecificGroup(null); };
sidebar.appendChild(clearGroupsBtn);
sidebar.appendChild(document.createElement('br'));

const clearAllBtn = document.createElement('button');
clearAllBtn.innerText = '完全清除';
clearAllBtn.onclick = clearAllData;
sidebar.appendChild(clearAllBtn);
    const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1 && node.classList.contains('user-info')) {
                addSpecialAttentionButton(node.querySelector('.user-name'));
            }
            else if (node.nodeType === 1) {
const userInfoElements = node.querySelectorAll('.user-info .user-name');
userInfoElements.forEach(userInfoElement => {
    const userId = userInfoElement.getAttribute('data-user-id');
    const userName = userInfoElement.textContent;
    addSpecialAttentionButton(userInfoElement, userId, userName);
});
            }
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });
    function addSpecialAttentionButton(userInfoElement, userId, userName) {
    const { currentGroupName } = getUserCurrentGroup(userId);

    let groupIndicator;
    if (currentGroupName) {
        groupIndicator = document.createElement('span');
        groupIndicator.textContent = `组别: ${currentGroupName}`;
        groupIndicator.style.border = '1px solid black';
        groupIndicator.style.padding = '2px';
        userInfoElement.parentNode.insertBefore(groupIndicator, userInfoElement.nextSibling);
    }
    const buttonText = currentGroupName ? '更改关注组' : '特别关注';
    const specialAttentionButton = document.createElement('button');
    specialAttentionButton.textContent = buttonText;
    userInfoElement.parentNode.appendChild(specialAttentionButton);

    specialAttentionButton.addEventListener('click', function() {
const groupSelect = document.getElementById('group-select-' + userId);
        if (groupSelect && groupSelect.style.display !== 'none') {
            const groupName = groupSelect.value;
            if (groupName) {
                addUserToGroup(userId, userName, groupName);
                groupSelect.style.display = 'none';
                document.getElementById('new-group-input-' + userId).style.display = 'none';
                document.getElementById('add-group-btn-' + userId).style.display = 'none';
            } else {
                alert('请选择一个组，或创建一个新组！');
            }
        } else {
            showGroupSelect(userInfoElement, userId, userName);
        }
        if (groupIndicator) {
            groupIndicator.textContent = `组别: ${groupSelect.value}`;
        }
    });
}
function getUserCurrentGroup(userId) {
    const groups = JSON.parse(localStorage.getItem('userGroups')) || {};
    for (const [groupName, users] of Object.entries(groups)) {
        const userInGroup = users.find(user => user.userId === userId);
        if (userInGroup) {
            return { currentGroupName: groupName };
        }
    }
    return { currentGroupName: null };
}

function updateGroupSelect(select) {
    const groups = JSON.parse(localStorage.getItem('userGroups')) || {};
    select.innerHTML = '<option value="">请选择一个组...</option>';
    select.innerHTML += '<option value="无组别">无组别</option>';

    Object.keys(groups).forEach(groupName => {
        const option = document.createElement('option');
        option.value = groupName;
        option.textContent = groupName;
        select.appendChild(option);
    });
}

function showGroupSelect(userNameDiv, userId, userName) {
    let existingSelect = document.getElementById('group-select-' + userId);
    if (existingSelect) {

        return;
    }

    let select = document.getElementById('group-select-' + userId) || document.createElement('select');
    select.id = 'group-select-' + userId;
    select.style.display = ''; 

    let newGroupInput = document.getElementById('new-group-input-' + userId) || document.createElement('input');
    newGroupInput.id = 'new-group-input-' + userId;
    newGroupInput.style.display = '';

    let addGroupBtn = document.getElementById('add-group-btn-' + userId);
if (!addGroupBtn) {
    addGroupBtn = document.createElement('button');
    addGroupBtn.id = 'add-group-btn-' + userId;
    addGroupBtn.textContent = '新增组类别'; 
    userNameDiv.parentNode.appendChild(addGroupBtn); 
}
addGroupBtn.style.display = ''; 
    updateGroupSelect(select);
    userNameDiv.parentNode.appendChild(select);
    userNameDiv.parentNode.appendChild(newGroupInput);
    userNameDiv.parentNode.appendChild(addGroupBtn);
    addGroupBtn.addEventListener('click', function() {
        const newGroupName = newGroupInput.value.trim();
        if (newGroupName) {
            addNewGroup(newGroupName);
            newGroupInput.value = '';
            updateGroupSelect(select);
        } else {
            alert('组名不能为空！');
        }
    });
}

function addNewGroup(groupName) {
    const groups = JSON.parse(localStorage.getItem('userGroups')) || {};
    if (groups[groupName]) {
        alert('该组已存在！');
        return;
    }
    groups[groupName] = [];
    localStorage.setItem('userGroups', JSON.stringify(groups));
    alert(`新组 "${groupName}" 已成功创建。`);
}
function displayAllUsersAndGroups() {
    const groups = JSON.parse(localStorage.getItem('userGroups')) || {};
    let message = '所有用户及其组别:\n';

    for (const [groupName, users] of Object.entries(groups)) {
        users.forEach(({ userId, userName }) => { 
            message += `用户名: ${userName}, 用户ID: ${userId}, 组别: ${groupName}\n`;
        });
    }

    alert(message);
}

    function clearAllData() {
    const isConfirmed = confirm("确定要完全清除所有数据吗？这将包括所有用户的特别关注组信息。");

    if (isConfirmed) {
        localStorage.removeItem('userGroups');
        alert("所有数据已被成功清除。");
    }
}
function addUserToGroup(userId, userName, groupName) {
    const groups = JSON.parse(localStorage.getItem('userGroups')) || {};
    Object.keys(groups).forEach(group => {
        groups[group] = groups[group].filter(user => user.userId !== userId);
    });
    if (groupName !== "无组别") {
        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        const isUserInGroup = groups[groupName].some(user => user.userId === userId);
        if (!isUserInGroup) {
            groups[groupName].push({ userId, userName });
        }
    }
    localStorage.setItem('userGroups', JSON.stringify(groups));
    alert(`用户 ${userName} (${userId}) 的组别已更新。`);
}

    function clearSpecificGroup(groupNameToClear) {
    const groups = JSON.parse(localStorage.getItem('userGroups')) || {};
    if (groupNameToClear && groups[groupNameToClear]) {
        if (!groups['臨時組']) groups['臨時組'] = [];
        groups['臨時組'] = groups['臨時組'].concat(groups[groupNameToClear]);
        delete groups[groupNameToClear];
    } else if (!groupNameToClear) {
        groups['臨時組'] = [];
        for (const groupName in groups) {
            if (groupName !== '臨時組') {
                groups['臨時組'] = groups['臨時組'].concat(groups[groupName]);
                delete groups[groupName];
            }
        }
    }

    localStorage.setItem('userGroups', JSON.stringify(groups));
    displayAllUsersAndGroups();
}
document.getElementById('add-group-btn').addEventListener('click', function() {
    const groupName = document.getElementById('new-group-name').value.trim();
    if (!groupName) {
        alert('關注組名稱不能為空！');
        return;
    }
    const groups = JSON.parse(localStorage.getItem('userGroups')) || {};
    if (groups[groupName]) {
        alert('該關注組已存在！');
        return;
    }
    groups[groupName] = [];
    localStorage.setItem('userGroups', JSON.stringify(groups));
    document.getElementById('new-group-name').value = '';
    updateGroupSelect();
});
    document.getElementById('assign-group-btn').addEventListener('click', function() {
        const uid = document.getElementById('user-uid').value;
        const groupName = document.getElementById('group-select').value;
    });
    updateGroupSelect();
})();