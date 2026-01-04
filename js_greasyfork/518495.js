// ==UserScript==
// @name         哔哩哔哩直播间开播提醒脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  当你指定的主播开播时，进行及时的系统提醒
// @author       伊吹dv子
// @match        https://t.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518495/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E5%BC%80%E6%92%AD%E6%8F%90%E9%86%92%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/518495/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E5%BC%80%E6%92%AD%E6%8F%90%E9%86%92%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const targetRoomIds = [33989, 42062, 5085, 17961, 5252, 24371440]; // 需要检测的直播间房间号
    const roomNames = {
        33989: "诶嘿酱",
        42062: "牛子豪",
        5085: "小智",
        17961: "赫萝",
        5252: "天堂",
        24371440: "测试"
    }; // 房间号对应主播名字



    const checkInterval = 10000; // 检测间隔时间为10秒

    // 从 localStorage 读取直播状态
    function loadRoomLiveStatus() {
        let status = localStorage.getItem('roomLiveStatus');
        try {
            return JSON.parse(status) || {};
        } catch (e) {
            console.error('localStorage 读取失败，重置状态:', e);
            return {};
        }
    }

    // 保存直播状态到 localStorage
    function saveRoomLiveStatus(status) {
        try {
            localStorage.setItem('roomLiveStatus', JSON.stringify(status));
        } catch (e) {
            console.error('localStorage 保存失败:', e);
        }
    }

    // 初始化直播状态
    let roomLiveStatus = loadRoomLiveStatus();
    targetRoomIds.forEach(roomId => {
        if (!roomLiveStatus[roomId]) {
            roomLiveStatus[roomId] = { notified: false, status: 'offline' }; // 默认状态为未提醒且离线
        }
    });

    // 检查某个房间的直播状态
    async function checkRoomStatus(roomId) {
        try {
            const apiUrl = `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data.data) {
                const isLive = data.data.live_status === 1;

                // 如果主播直播且未提醒过，发送提醒
                if (isLive && roomLiveStatus[roomId].status === 'offline' && !roomLiveStatus[roomId].notified) {
                    notifyUser(roomId); // 发送提醒
                    roomLiveStatus[roomId] = { notified: true, status: 'live' }; // 更新状态为直播且已提醒
                    saveRoomLiveStatus(roomLiveStatus); // 保存状态
                }

                // 如果主播下播，重置提醒状态
                if (!isLive && roomLiveStatus[roomId].status === 'live') {
                    roomLiveStatus[roomId] = { notified: false, status: 'offline' }; // 更新状态为离线
                    saveRoomLiveStatus(roomLiveStatus); // 保存状态
                }
            }
        } catch (error) {
            console.error(`获取房间 ${roomId} 的直播状态失败:`, error);
        }
    }

    // 通知用户
    function notifyUser(roomId) {
        const roomUrl = `https://live.bilibili.com/${roomId}`;
        const roomName = roomNames[roomId] || `直播间${roomId}`; // 获取主播名字，找不到时显示房间号

        if (Notification.permission === 'granted') {
            const notification = new Notification('主播已开播！', {
                body: `哔哩哔哩直播间：【${roomName}】正在直播！`,
                icon: 'https://i0.hdslb.com/bfs/live/cb040181b80e61b94473b2e42d39fa06de09ae2a.png'
            });

            // 点击通知跳转到直播间
            notification.onclick = () => {
                window.open(roomUrl, '_blank'); // 打开直播间
            };
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    const notification = new Notification('主播已开播！', {
                        body: `哔哩哔哩直播间：【${roomName}】正在直播！`,
                        icon: 'https://i0.hdslb.com/bfs/live/cb040181b80e61b94473b2e42d39fa06de09ae2a.png'
                    });

                    // 点击通知跳转到直播间
                    notification.onclick = () => {
                        window.open(roomUrl, '_blank'); // 打开直播间
                    };
                }
            });
        }
    }

    // 定时检查所有房间的状态
    function checkLiveStatus() {
        targetRoomIds.forEach(roomId => {
            checkRoomStatus(roomId);
        });
    }

    // 定时循环监控，使用 setTimeout 控制检查间隔
    function startMonitoring() {
        checkLiveStatus();
        setTimeout(startMonitoring, checkInterval); // 每10秒检测一次
    }

    // 请求通知权限并开始监控
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    // 延迟3秒后开始监控，避免页面刚加载时增加压力
    setTimeout(() => startMonitoring(), 3000);

})();
