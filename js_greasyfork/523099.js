// ==UserScript==
// @name         屏蔽bilibili直播间
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  屏蔽选定直播间并记录该房间号和昵称，后续可恢复屏蔽的直播间
// @author       buding
// @match        *://live.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/523099/%E5%B1%8F%E8%94%BDbilibili%E7%9B%B4%E6%92%AD%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/523099/%E5%B1%8F%E8%94%BDbilibili%E7%9B%B4%E6%92%AD%E9%97%B4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("脚本已运行");

    // 获取和保存记录的工具函数
    function getDeletedRooms() {
        return GM_getValue('deletedRooms', []); // 默认值为空数组
    }

    function saveDeletedRoom(roomId, nickname) {
        const deletedRooms = getDeletedRooms();
        if (!deletedRooms.some(room => room.roomId === roomId)) {
            deletedRooms.push({ roomId, nickname });
            GM_setValue('deletedRooms', deletedRooms);
            console.log('保存删除的房间号和昵称:', roomId, nickname);
        }
    }

    function clearDeletedRooms() {
        GM_setValue('deletedRooms', []);
        console.log('已清空删除记录');
    }

    // 从 URL 中提取房间号的函数
    function extractRoomId(url) {
        const match = url.match(/\/(\d+)(?:\?|$)/); // 匹配纯数字部分
        return match ? match[1] : null;
    }

    // 删除指定房间号的直播间
    function removeRoomByRoomId(roomId) {
        const liveRooms = document.querySelectorAll('.index_item_JSGkw');
        liveRooms.forEach((room) => {
            const roomLink = room.querySelector('a')?.href;
            const extractedRoomId = extractRoomId(roomLink);
            if (extractedRoomId === roomId) {
                room.remove();
                console.log('自动屏蔽直播间：', roomId);
            }
        });
    }

    // 自动屏蔽已记录的房间号
    function autoRemoveDeletedRooms() {
        const deletedRooms = getDeletedRooms();
        deletedRooms.forEach(({ roomId }) => {
            removeRoomByRoomId(roomId);
        });
    }

    // 获取房间昵称的函数
    function getRoomNickname(room) {
        const nicknameElement = room.querySelector('.index_item_JSGkw > a > .Item_card-item-ctnr_FaYcr > .Item_lowerRow_Uzu_b > .Item_right__RSaW > .Item_flex_JuFzL > .Item_nickName_KO2QE');
        return nicknameElement ? nicknameElement.textContent.trim() : '未知昵称';
    }

    // 添加样式
    GM_addStyle(`
        .delete-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            background: red;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            z-index: 10;
            display: none;
        }
        .index_item_JSGkw:hover .delete-btn {
            display: block;
        }
        .index_item_JSGkw {
            position: relative;
        }
        #recordPopup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            z-index: 9999;
            padding: 20px;
            display: none;
        }
        #recordPopup h3 {
            margin-top: 0;
        }
        #recordPopup button {
            margin: 10px 5px;
            padding: 8px 15px;
            border: none;
            background: #007bff;
            color: white;
            border-radius: 4px;
            cursor: pointer;
        }
        #recordPopup button:hover {
            background: #0056b3;
        }
        #recordPopup textarea {
            width: 100%;
            height: 150px;
            margin-bottom: 10px;
            resize: none;
        }
    `);

    // 创建记录弹窗
    const recordPopupHtml = `
        <div id="recordPopup">
            <h3>已屏蔽的直播间</h3>
            <textarea id="deletedRoomsText"></textarea>
            <button id="saveRecordsButton">保存</button>
            <button id="clearRecordsButton">清空记录</button>
            <button id="closeRecordsButton">关闭</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', recordPopupHtml);

    const recordPopup = document.getElementById('recordPopup');
    const deletedRoomsText = document.getElementById('deletedRoomsText');
    const saveRecordsButton = document.getElementById('saveRecordsButton');
    const clearRecordsButton = document.getElementById('clearRecordsButton');
    const closeRecordsButton = document.getElementById('closeRecordsButton');

    // 显示记录弹窗
    function showRecordPopup() {
        const deletedRooms = getDeletedRooms();
        deletedRoomsText.value = deletedRooms.map(room => `${room.roomId} - ${room.nickname}`).join('\n');
        recordPopup.style.display = 'block';
    }

    // 隐藏记录弹窗
    function hideRecordPopup() {
        recordPopup.style.display = 'none';
    }

    // 保存修改后的记录
    function saveModifiedRecords() {
        const lines = deletedRoomsText.value.trim().split('\n');
        const updatedRooms = lines.map(line => {
            const [roomId, nickname] = line.split(' - ');
            return { roomId, nickname };
        }).filter(room => room.roomId); // 过滤掉空行或无效行

        GM_setValue('deletedRooms', updatedRooms); // 更新存储
        console.log('已保存新的屏蔽记录:', updatedRooms);
        autoRemoveDeletedRooms(); // 重新屏蔽已保存的直播间
    }

    // 清空记录
    clearRecordsButton.addEventListener('click', () => {
        clearDeletedRooms();
        deletedRoomsText.value = '';
    });

    // 关闭记录弹窗
    saveRecordsButton.addEventListener('click', saveModifiedRecords);
    closeRecordsButton.addEventListener('click', hideRecordPopup);

    // 为直播间卡片添加删除按钮
    function addDeleteButtons() {
        const liveRooms = document.querySelectorAll('.index_item_JSGkw'); // 根据具体的直播间卡片类名修改

        liveRooms.forEach((room) => {
            // 检查是否已经添加了按钮
            if (room.querySelector('.delete-btn')) {
                return;
            }

            // 创建删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '删除';

            // 点击事件，删除当前直播间并记录房间号
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                const roomLink = room.querySelector('a')?.href;
                const roomId = extractRoomId(roomLink); // 提取纯房间号
                const nickname = getRoomNickname(room); // 获取昵称
                if (roomId) {
                    saveDeletedRoom(roomId, nickname);
                }
                room.remove();
                console.log('手动删除直播间：', roomId, nickname);
            });

            // 将按钮添加到直播间卡片中
            room.appendChild(deleteBtn);
        });
    }

    // 动态监听 DOM 变化
    const observer = new MutationObserver(() => {
        addDeleteButtons();
        autoRemoveDeletedRooms(); // 检测到 DOM 变化时自动屏蔽记录的房间
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 初始执行一次
    addDeleteButtons();
    autoRemoveDeletedRooms();

    // 添加“查看记录”按钮
    const recordButton = document.createElement('button');
    recordButton.textContent = '查看屏蔽记录';
    recordButton.style.position = 'fixed';
    recordButton.style.bottom = '20px';
    recordButton.style.left = '20px';
    recordButton.style.zIndex = 9999;
    recordButton.style.padding = '10px 20px';
    recordButton.style.background = '#007bff';
    recordButton.style.color = '#fff';
    recordButton.style.border = 'none';
    recordButton.style.borderRadius = '4px';
    recordButton.style.cursor = 'pointer';
    document.body.appendChild(recordButton);

    recordButton.addEventListener('click', showRecordPopup);

    // 判断当前环境是否为直播间播放页
    function isLiveRoom() {
        // 提取主路径部分（忽略查询参数）
        const path = window.top.location.pathname;

        // 正则匹配主直播间路径（纯数字或 "/blanc/{数字}" 格式）
        const liveRoomRegex = /^\/(\d+)\/?$/;

        // 判断是否符合直播间路径
        if (path.match(liveRoomRegex)) {
            return true;
        }

        // 检查 iframe 场景（如嵌入其他页面）
        if (window.frameElement && window.top.location.hostname === "live.bilibili.com") {
            try {
                // 检查父窗口 URL 的路径
                const parentPath = window.top.location.pathname;
                if (liveRoomRegex.test(parentPath)) {
                    return true;
                }
            } catch (e) {
                // 忽略跨域 iframe
            }
        }

        return false;
    }


    // 根据当前环境决定是否显示按钮
    if (isLiveRoom()) {
        recordButton.style.display = "none";
    } else {
        recordButton.style.display = "block";
    }
})();
