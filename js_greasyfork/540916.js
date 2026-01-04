// ==UserScript==
// @name         摸鱼派聊天室《谁是卧底》
// @namespace    http://tampermonkey.net/
// @version      1.98
// @description  在摸鱼派聊天室谁是卧底游戏
// @author       drda
// @match        https://fishpi.cn/cr*
// @icon         https://fishpi.cn/images/favicon.png
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540916/%E6%91%B8%E9%B1%BC%E6%B4%BE%E8%81%8A%E5%A4%A9%E5%AE%A4%E3%80%8A%E8%B0%81%E6%98%AF%E5%8D%A7%E5%BA%95%E3%80%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/540916/%E6%91%B8%E9%B1%BC%E6%B4%BE%E8%81%8A%E5%A4%A9%E5%AE%A4%E3%80%8A%E8%B0%81%E6%98%AF%E5%8D%A7%E5%BA%95%E3%80%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //开头中 @match        https://fishpi.cn/cr*  中https://fishpi.cn/cr*是运行脚本的地址，需要可自定义（注意地址后面需要加*）

    GM_registerMenuCommand("开始游戏", () => { showGameModal() });
    GM_registerMenuCommand("游戏榜单", () => { showRankModal(); });

    let roomsInfo = []//房间信息
    let sessionlocaid = null //会话标识
    let isOne = true
    // 添加拖拽功能变量
    let isDragging = false;
    let length = 0;
    let offsetX, offsetY;
    let tipWord = null

    // let httpHost="https://undercover.gakkiyomi.blog"
    let httpHost = "https://undercover.aweoo.com"//新域名
    let wssHost = "wss://undercover.aweoo.com"


    //默认头像
    let avatar = "https://tupian.li/images/2025/03/27/67e513485d95d.png";
    //获取鱼排网页头像
    let avatarHtml = document.getElementsByClassName('avatar-small')
    const urlMatch = avatarHtml.length > 0 ? avatarHtml[0].outerHTML.match(/url\('([^']+)'\)/) : null;
    avatar = urlMatch ? urlMatch[1] : avatar;


    // 创建游戏按钮和UI元素
    // const gameBtn = document.createElement('button');
    // gameBtn.className = 'undercover-btn cover-btn';
    // gameBtn.textContent = '谁是卧底';
    // gameBtn.onclick = showGameModal;

    // 创建游戏模态框
    const modal = document.createElement('div');
    modal.className = 'undercover-modal';
    modal.innerHTML = `
       <div class="modal-header" style="cursor: move;background: #BBC2C9; border-radius: 8px 8px 0 0;width:40px;color:#fff;font-size:12px;text-align: center;">
        <div style="position: absolute; left: 10px; top: 8px; cursor: pointer;border-radius: 8px 8px 0 0;"><div style="background:url(${avatar});background-size:cover; background-position:center; background-repeat:no-repeat;width:20px;height:20px;border-radius: 5px ;"></div></div>
        <div style="position: absolute; right: 35px; top: 8px; cursor: pointer;border-radius: 8px 8px 0 0;" id='chang-bg-btn'">🌗</div>
        <div style="position: absolute; right:12px;top: 5px; cursor: pointer;" id='close-bg-btn' class='closeBtn'>x</div>
         </div>
        <h2 style="margin: 0 0 0px; text-align: center; color: #7a8da1;">谁是卧底 <span id="cd"></span></h2>
        <span style="margin: 0 0 0px; text-align: center; color: #7a8da1;" id="tipword"></span>
        <div id="game-content"></div>
    `;


    //创建模态遮罩层（默认不加）
    const overlay = document.createElement('div');
    overlay.className = 'undercover-overlay';
    overlay.onclick = closeGameModal;//点击遮罩层关闭

    // document.body.appendChild(gameBtn);
    document.body.appendChild(modal);
    // document.body.appendChild(overlay);//添加遮罩层



    // 获取URL参数
    function getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // 监控URL参数变化
    function watchUrlParams() {
        const sessionId = getUrlParam('session_id');
        if (sessionId) {
            localStorage.setItem('fishpi_session_id', sessionId);
            sessionlocaid = sessionId
            // 移除URL中的session_id参数
            const newUrl = window.location.href.replace(/[?&]session_id=[^&]+/, '');
            window.history.replaceState({}, document.title, newUrl);
            // 自动验证会话
            // autoValidateSession(sessionId);
            showGameModal()
        }
    }

    // 获取房间状态
    async function getRoomsStatus(sessionId) {
        try {
            let response = await fetch(`${httpHost}/rooms/status`);
            const data = await response.json();
            roomsInfo = data
            if (roomsInfo.success) {
                showRooms();
            }
        } catch (error) {
            console.error('获取房间失败:', error);
            showNotification('获取房间失败', 'error');
        }

    }

    // 显示游戏模态框
    function showGameModal() {
        modal.classList.add('show');
        overlay.classList.add('show');
        // 添加弹出动画
        setTimeout(() => {
            modal.classList.add('active');
        }, 10); // 小延迟确保CSS过渡生效
        initGame();
    }

    // 关闭游戏模态框
    function closeGameModal() {
        // 添加关闭动画
        modal.classList.remove('active');

        // 动画结束后完全隐藏
        setTimeout(() => {
            modal.classList.remove('show');
            overlay.classList.remove('show');

            let cd = document.getElementById('cd');
            if (tipWord) tipWord.innerText = '';
            if (cd) cd.innerText = '';

            if (window.gameWs) {
                window.gameWs.close();
                window.gameWs = null;
            }
        }, 300); // 动画持续时间300ms
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'game-notification';
        notification.textContent = message;
        notification.style.backgroundColor = type === 'error' ? '#e74c3c' : 'rgba(0,0,0,0.8)';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // 初始化游戏
    async function initGame() {
        //切换主题
        const changBgBtn = document.getElementById('chang-bg-btn');
        const closeBgBtn = document.getElementById('close-bg-btn');

        if (changBgBtn) {
            changBgBtn.onclick = toggleDarkMode;
            closeBgBtn.onclick = closeGameModal;
        }
        const gameContent = document.getElementById('game-content');
        gameContent.innerHTML = '<p style="text-align: center;">正在连接游戏服务器...</p>';

        try {
            const sessionId = localStorage.getItem('fishpi_session_id');
            if (sessionId) {
                const user = await validateSession(sessionId);
                if (user) {
                    localStorage.setItem('undercover_user_id', user.id);
                    localStorage.setItem('undercover_user_name', user.username);

                    getRoomsStatus(sessionId)
                    return;
                }
            }

            // 获取登录URL，携带当前页面URL作为回调地址
            const loginUrl = await getLoginUrl();
            if (loginUrl) {
                gameContent.innerHTML = `
                    <div style="text-align: center;">
                        <p style="margin-bottom: 20px;">请先登录摸鱼派账号</p>
                        <button class="undercover-btn" onclick="window.location.href='${loginUrl}'">
                            使用摸鱼派账号登录
                        </button>
                    </div>
                `;
            } else {
                throw new Error('获取登录URL失败');
            }
        } catch (error) {
            gameContent.innerHTML = `
                <div style="text-align: center;">
                    <p style="color: #e74c3c; margin-bottom: 20px;">
                        连接游戏服务器失败: ${error.message}
                    </p>
                    <button class="undercover-btn" id='closegame'>
                        关闭
                    </button>
                </div>
            `;

            var closeGame = document.getElementById('closegame');
            if (closeGame) {
                closeGame.onclick = closeGameModal;
            }
        }
    }

    // 获取登录URL
    async function getLoginUrl() {
        try {
            const callbackUrl = encodeURIComponent(window.location.href);
            const response = await fetch(`${httpHost}/auth/login?callback_url=${callbackUrl}`);
            const data = await response.json();
            if (data.success) {
                return data.login_url;
            }
            throw new Error(data.error || '获取登录URL失败');
        } catch (error) {
            console.error('获取登录URL失败:', error);
            throw error;
        }
    }

    // 验证会话
    async function validateSession(sessionId) {
        try {
            const response = await fetch(
                `${httpHost}/auth/validate?session_id=${sessionId}`
            );
            const data = await response.json();
            return data.success ? data.user : null;
        } catch (error) {
            console.error('验证会话失败:', error);
            return null;
        }
    }

    // 连接WebSocket并获取房间状态
    function connectWebSocket(sessionId, roomId = null) {
        const wsUrl = `${wssHost}/ws?session_id=${sessionId}${roomId ? `&room_id=${roomId}` : ''}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket游戏连接已建立');
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message)
            handleWebSocketMessage(message);

        };

        ws.onerror = (error) => {
            console.error('WebSocket错误:', error);
            showNotification('连接游戏服务器失败，请稍后重试', 'error');
        };

        ws.onclose = () => {
            console.log('WebSocket连接已关闭');
            isOne = true
        };

        window.gameWs = ws;
        return ws;
    }

    // 显示所有房间
    function showRooms() {
        const gameContent = document.getElementById('game-content');
        const roomsDiv = document.createElement('div');
        let roomInfoHtml = '';
        if (roomsInfo.rooms.length > 0) {
            roomsInfo.rooms.forEach(item => {
                roomInfoHtml += `
             <div class="room-info" style="display:flex;justify-content: space-between;align-items:center;margin-bottom: 16px; padding: 10px; background: #bbc2c9; border-radius: 8px; text-align: center;">
               <div  style="display:flex;align-items: flex-start;flex-direction: column;">
                 <span style="margin-left: 16px;font-weight: bold; color: #2980b9;">房间号：${item.room_id || item.id}</span>
                 <span style="margin-left: 16px; font-weight: bold; color: #d4e5ef;">现有人数：${item.player_count}/12</span>
               </div>
               <div>
               <button  class="undercover-btn join-add-room-btn" data-add-room-id="${item.room_id || item.id}" style="background-color: #e8a8a2;height:35px">
                        参与
               </button>
               <button  class="undercover-btn join-view-room-btn" data-view-room-id="${item.room_id || item.id}" style="background-color: #b3c4e6;height:35px">
                        观战
               </button>
               </div>
            </div>
             `;
            })
        } else {
            roomInfoHtml = `<span style="color:#666">暂无房间</span>`
            // roomsDiv.insertAdjacentHTML('beforeend',`<span>暂无房间</span>`)
        }

        gameContent.innerHTML = `
            <div class="game-room" style="width:450px;word-wrap: break-word;">
                 <h3 style="margin: 0 0 10px; color: #7a8da1;">当前房间数量${roomsInfo.rooms.length}</h3>
                <div class="player-list">
                 ${roomInfoHtml}
                </div>
                <div style="text-align: center; margin: 20px 0;">
                    <button id="creat-room-btn" class="undercover-btn">
                        创建自己房间
                    </button>
                </div>
            </div>
        `;

        // 绑定事件
        document.getElementById('creat-room-btn').onclick = creatGameRoom;
        // 为所有加入房间按钮绑定事件
        document.querySelectorAll('.join-add-room-btn').forEach(button => {
            button.onclick = function () {
                const roomId = this.getAttribute('data-add-room-id');
                joinGameRoom(roomId, "false"); // 调用加入房间函数
            };
        });
        // 为所有加入房间按钮绑定事件
        document.querySelectorAll('.join-view-room-btn').forEach(button => {
            button.onclick = function () {
                const roomId = this.getAttribute('data-view-room-id');
                joinGameRoom(roomId, "true"); // 调用加入房间函数
            };
        });
        tipWord = document.getElementById('tipword');

    }

    // 创建自己的房间
    function creatGameRoom() {
        let useName = localStorage.getItem('undercover_user_name')
        let fishpi_session_id = localStorage.getItem('fishpi_session_id')

        if (roomsInfo.rooms.length == 0) {
            fetchCreatRoom(fishpi_session_id, useName)
        } else {
            let index = roomsInfo.rooms.filter(item => item.room_id == useName || item.id == useName)
            if (index.length > 0) {
                showNotification("已经有自己id命名的房间，已随机命名新建一个房间")
                fetchCreatRoom(fishpi_session_id)
            } else {
                fetchCreatRoom(fishpi_session_id, useName)
            }
        }
    }

    // 请求创建房间函数
    async function fetchCreatRoom(sessionid, roomid) {
        try {
            const response = await fetch(`${httpHost}/rooms/create?session_id=${sessionid}${roomid ? `&room_id=${roomid}` : ''}`);
            const data = await response.json();
            if (data.success) {
                getRoomsStatus(sessionid)
            }
        } catch (error) {
            console.log("创建房间失败", error)
            showNotification("创建房间失败", "error")

        }

    }

    // 加入游戏房间
    function joinGameRoom(roomId, is_spectator) {
        console.log('is_spectator', is_spectator)
        let fishpi_session_id = localStorage.getItem('fishpi_session_id')
        localStorage.setItem('fishpi_is_spectator', is_spectator)
        connectWebSocket(fishpi_session_id, roomId)//加入房间
        if (window.gameWs) {
            showGameRoom()
            window.gameWs.onopen = () => {
                window.gameWs.send( //加入游戏
                    JSON.stringify({
                        type: 'join',
                        data: {
                            player_id: localStorage.getItem('undercover_user_id'),
                            player_name: localStorage.getItem('undercover_user_name')
                        }
                    })
                );
            };
        }
    }

    // 显示加入的游戏房间
    function showGameRoom() {
        const gameContent = document.getElementById('game-content');
        gameContent.innerHTML = `
            <div class="game-room" style="width:450px;word-wrap: break-word;">
                <div id="desc"></div>
                <div class="player-list">
                    <h3 style="margin: 0 0 10px; color: #7a8da1;">玩家列表</h3>
                    <div id="players"></div>
                </div>
                <div style="text-align: center; margin: 20px 0;" id="option_btn">
                    <button id="ready-btn" class="undercover-btn">
                        准备
                    </button>
                    <button id="leave-btn" class="undercover-btn" style="background-color: #e8a8a2;">
                        离开房间
                    </button>
                </div>
                <div class="chat-container">
                    <div id="chat-messages" class="chat-messages"></div>
                    <!-- 聊天输入区域 -->
                    <div class="chat-input-container" id="chat-input-area">
                        <input type="text" id="chat-input" class="chat-input" placeholder="输入聊天内容...">
                        <button id="send-btn" class="undercover-btn">发送</button>
                    </div>

                    <!-- 描述输入区域 (默认隐藏) -->
                    <div class="chat-input-container" id="description-input-area" style="display: none;">
                        <input type="text" id="description-input" class="chat-input" placeholder="请描述你的词条...">
                        <button id="submit-description-btn" class="undercover-btn">发送</button>
                    </div>
                </div>
            </div>
        `;
        // 绑定事件
        document.getElementById('ready-btn').onclick = toggleReady;

        document.getElementById('leave-btn').onclick = leaveGame;
        document.getElementById('send-btn').onclick = sendChat;
        document.getElementById('chat-input').onkeypress = (e) => {
            if (e.key === 'Enter') sendChat();
        };

        document.getElementById('submit-description-btn').onclick = submitDescription;
        document.getElementById('description-input').onkeypress = (e) => {
            if (e.key === 'Enter') submitDescription();
        };

        if (localStorage.getItem('fishpi_is_spectator') == "true") {
            document.getElementById('ready-btn').style.display = 'none'
        }

    }

    // 准备/取消准备
    window.toggleReady = function () {
        if (window.gameWs) {
            window.gameWs.send(
                JSON.stringify({
                    type: 'ready',
                    data: {
                        player_id: localStorage.getItem('undercover_user_id')
                    }
                })
            );
        }
    };

    // 处理WebSocket消息
    function handleWebSocketMessage(message) {
        switch (message.type) {
            case 'state_update':
                if (message.data.descriptions && message.data.descriptions.length > 0) {
                    addDescription(message.data);
                }

                updateGameState(message.data);
                break;
            case 'notification':
                if (message.data.ready_count && message.data.ready_count > 0) {
                    showNotification('当前已有：' + message.data.ready_count + ' 名玩家准备');
                } else {
                    if (message.data.message) {
                        showNotification(message.data.message);
                        addDescription({ sys: "系统消息", msg: message.data.message });
                    }
                }

                if (message.data.descriptions && message.data.descriptions.length > 0) {
                    addDescription(message.data);
                }
                break;
            case 'descriptions_update':
                if (message.data.descriptions && message.data.descriptions.length > 0) {
                    addDescription(message.data);
                }
                break;
            case 'chat':
                addDescription(message.data);
                break;
            case 'eliminated_chat':
                if (localStorage.getItem('undercover_player_alive') == "false") {
                    addDescription(message.data);
                }
                break;
            case 'vote':
                updateVotes(message.data);
                break;
            case 'error':
                showNotification(message.data.message, 'error');
                break;
            case 'kicked':
                if (message.data.message) {
                    showNotification(message.data.message);
                    addDescription({ sys: "提示", msg: message.data.message });
                    addDescription({ sys: "提示", msg: `点击"离开房间"重新加入房间` });
                }
                break;
            case 'room_list':
                roomsInfo.rooms = message.data.rooms
                showRooms()
                break;
            case 'switch_mode_response':
                isOne = false
                break;
            case 'countdown':
                //定时器
                var countdown = document.getElementById('cd');
                if (countdown) {
                    countdown.innerText = message.data.seconds
                }
                break;
        }
    }

    // 更新游戏状态
    function updateGameState(state) {
        const playerList = document.getElementById('players');
        const currentUserId = localStorage.getItem('undercover_user_id');
        const isHost = state.host === currentUserId;
        if (playerList) {
            playerList.innerHTML = state.players.map((player) => {
                // 检查是否为当前用户
                const isCurrentUser = player.id === currentUserId;
                // 检查是否显示踢出按钮（房主且不是自己）
                const showKickButton = isHost && !isCurrentUser && player.id !== state.host;

                return `
                    <div class="player ${player.is_ready == true ? 'ready' : player.is_ready == false ? 'unready' : ''} ${player.is_alive ? 'alive' : 'dead'}" >
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                            <div>
                                ${player.nickname || player.name}
                                ${player.is_ready ? '(已准备)' : ''}
                                ${!player.is_alive && !player.is_spectator ? '(已淘汰)' : (player.is_alive || !player.is_alive) && player.is_spectator ? '<span style="background-color:#91ade6;width:30px;height:20px;padding:5px;color:#fff;font-size:10px;margin-left:10px;">观战</span>' : ''}
                                ${state.host === player.id ? '<span style="background-color:green;width:30px;height:20px;padding:5px;color:#fff;font-size:10px;margin-left:10px;">房主</span>' : ''}
                            </div>
                            ${showKickButton ?
                    `<button class="kick-btn" data-player-id="${player.id}" style="background: #e74c3c; color: white; border: none; border-radius: 3px; padding: 3px 8px; font-size: 12px; cursor: pointer;">
                                    踢出
                                </button>` :
                ''
            }
                        </div>
                    </div>
                `;
            }).join('');
            // 为踢出按钮绑定事件
            document.querySelectorAll('.kick-btn').forEach(button => {
                button.onclick = function () {
                    const playerId = this.getAttribute('data-player-id');
                    kickPlayer(playerId);
                };
            });
        }

        const readyBtn = document.getElementById('ready-btn');
        if (readyBtn) {
            const currentPlayer = state.players.find(
                (p) => p.id === localStorage.getItem('undercover_user_id')
            );
            if (currentPlayer && currentPlayer.is_ready) {
                readyBtn.classList.add('ready');
                readyBtn.textContent = '取消准备';
            } else {
                readyBtn.classList.remove('ready');
                readyBtn.textContent = '准备';
            }
        }

        // 根据游戏状态更新界面
        updateGamePhase(state);
    }

    // 更新游戏阶段
    function updateGamePhase(state) {
        const gameContent = document.getElementById('game-content');
        const currentPlayer = state.players.find(
            (p) => p.id === localStorage.getItem('undercover_user_id')
        );
        localStorage.setItem('undercover_player_alive', currentPlayer.is_alive)
        if (localStorage.getItem('fishpi_is_spectator') == "true" && isOne) {
            switchMode()
        }
        if (currentPlayer.is_spectator) {
            isOne = false
        }

        const describeContainer = document.getElementById('desc');
        describeContainer.style.textAlign = 'center';
        describeContainer.style.margin = '20px 0';

        const chatInputArea = document.getElementById('chat-input-area');
        const descInputArea = document.getElementById('description-input-area');

        // 默认显示聊天输入框，隐藏描述输入框
        if (chatInputArea) chatInputArea.style.display = 'flex';
        if (descInputArea) descInputArea.style.display = 'none';

        switch (state.state) {
            case 'DescribePhase':
                if (tipWord) {
                    tipWord.innerText = currentPlayer.word ? '你要描述的词条：' + currentPlayer.word : ''
                }
                if (state.current_player === localStorage.getItem('undercover_user_id')) {
                    // 隐藏聊天输入框，显示描述输入框
                    if (chatInputArea) chatInputArea.style.display = 'none';
                    if (descInputArea) descInputArea.style.display = 'flex';

                    // 清空描述输入框
                    const descInput = document.getElementById('description-input');
                    if (descInput) descInput.value = '';

                    // 显示描述提示
                    describeContainer.innerHTML = `
                            <div style="
                                background: linear-gradient(135deg, #ff9a9e, #fad0c4);
                                padding: 15px;
                                border-radius: 8px;
                                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                                margin-bottom: 15px;
                            ">
                                <p style="
                                    font-size: 18px;
                                    font-weight: bold;
                                    color: #d63031;
                                    margin: 0 0 10px;
                                ">
                                    轮到你的回合！
                                </p>
                                <p style="margin: 0;">
                                    请描述你的词条：<strong>${currentPlayer.word}</strong>
                                </p>
                            </div>
                        `;
                }
                else {
                    describeContainer.innerHTML = `
                        <div style="
                            background: #f0f7ff;
                            padding: 10px;
                            border-radius: 8px;
                            margin-bottom: 10px;
                        ">
                            <p style="margin: 0;">
                                等待 <strong>${state.players.find((p) => p.id === state.current_player).nickname || state.players.find((p) => p.id === state.current_player).name}</strong> 描述词条...
                            </p>
                        </div>
                    `;
                }
                break;

            case 'VotePhase':
                // 确保显示聊天输入框
                if (chatInputArea) chatInputArea.style.display = 'flex';
                if (descInputArea) descInputArea.style.display = 'none';

                if (currentPlayer && currentPlayer.is_alive) {
                    describeContainer.innerHTML = `
                        <p style="margin-bottom: 10px;">请投票选出你认为的卧底</p>
                        <div class="vote-buttons">
                            ${state.players
                        .filter((p) => p.is_alive && p.id !== currentPlayer.id)
                        .map(
                        (player) => `
                                    <button   class="undercover-btn vote-player-btn" data-vote-id="${player.id}"
                                        style="margin: 5px;">
                                        ${player.nickname || player.name}
                                    </button>
                                `
                            )
                        .join('')}
                        </div>
                    `;
                    // 为所有玩家按钮绑定事件
                    document.querySelectorAll('.vote-player-btn').forEach(button => {
                        if (localStorage.getItem('fishpi_is_spectator') == "false") {
                            button.onclick = function () {
                                const playerId = this.getAttribute('data-vote-id');
                                vote(playerId); // 调用投票函数
                            };
                        }
                    });
                }
                break;

            case 'GameOver':
                // 确保显示聊天输入框
                if (localStorage.getItem('fishpi_is_spectator') == "true") {
                    if (chatInputArea) chatInputArea.style.display = 'none';
                    if (descInputArea) descInputArea.style.display = 'none';
                } else {
                    if (chatInputArea) chatInputArea.style.display = 'flex';
                    if (descInputArea) descInputArea.style.display = 'none';
                }

                if (state.winner) {
                    var resultContainer = document.createElement('div');
                    var countdown = document.getElementById('cd');
                    resultContainer.style.textAlign = 'center';
                    resultContainer.style.margin = '20px 0';
                    describeContainer.innerHTML = `
                    <h3 style="color: #7a8da1; margin-bottom: 15px;">
                        游戏结束！${state.winner}胜利！
                    </h3>
                     <h3 style="color: #7a8da1; margin-bottom: 15px;">
                        卧底词条${state.undercover_word}，平民词条${state.civilian_word}。
                    </h3>

                `;
                    length = 0
                    if (tipWord) {
                        tipWord.innerText = ''
                    }
                    if (countdown) {
                        countdown.innerText = ''
                    }
                } else {
                    describeContainer.innerHTML = `<p style="margin-bottom: 10px;">点击准备可复活，开始下一局...</p>`;
                }
                break;
        }
    }

    // 踢出玩家函数
    function kickPlayer(playerId) {
        if (window.gameWs) {
            window.gameWs.send(
                JSON.stringify({
                    type: 'kick',
                    data: {
                        player_id: localStorage.getItem('undercover_user_id'),
                        target_id: playerId
                    }
                })
            );
        }
    }

    // 提交描述
    function submitDescription() {
        const input = document.getElementById('description-input');

        if (input && input.value.trim() && window.gameWs) {
            window.gameWs.send(
                JSON.stringify({
                    type: 'describe',
                    data: {
                        player_id: localStorage.getItem('undercover_user_id'),
                        content: input.value.trim()
                    }
                })
            );
            input.value = '';
            // 提交后切换回聊天输入框
            const chatInputArea = document.getElementById('chat-input-area');
            const descInputArea = document.getElementById('description-input-area');
            if (chatInputArea) chatInputArea.style.display = 'flex';
            if (descInputArea) descInputArea.style.display = 'none';
        }
    };

    // 投票
    function vote(targetId) {
        if (window.gameWs) {
            window.gameWs.send(
                JSON.stringify({
                    type: 'vote',
                    data: {
                        player_id: localStorage.getItem('undercover_user_id'),
                        target_id: targetId
                    }
                })
            );
        }
    };

    // 观战模式
    function switchMode() {
        if (window.gameWs) {
            window.gameWs.send(
                JSON.stringify({
                    type: 'switch_mode',
                    data: {
                        player_id: localStorage.getItem('undercover_user_id'),
                        is_spectator: true
                    }
                })
            );
        }
    };

    // 发送聊天消息
    function sendChat() {
        const input = document.getElementById('chat-input');
        const content = input.value.trim();
        if (content && window.gameWs) {
            window.gameWs.send(
                JSON.stringify({
                    type: 'chat',
                    data: {
                        player_id: localStorage.getItem('undercover_user_id'),
                        content: content
                    }
                })
            );
            input.value = '';
        }
    }

    // 离开游戏
    function leaveGame() {
        let cd = document.getElementById('cd');
        if (tipWord) tipWord.innerText = ''
        if (cd) cd.innerText = ''
        if (window.gameWs) {
            window.gameWs.send(
                JSON.stringify({
                    type: 'leave',
                    data: {
                        player_id: localStorage.getItem('undercover_user_id')
                    }
                })
            );
            window.gameWs.close();
            window.gameWs = null;
        }
        isOne = true
        initGame();
    }

    // 添加描述到聊天区域
    function addDescription(data) {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            const message = document.createElement('div');
            if (data.sys) {
                message.style.color = data.sys == '提示' ? '#e74c3c' : '#666'
                message.style.marginBottom = '5px';
                message.style.paddingBottom = '2px';
                message.style.fontSize = data.sys == '提示' ? '14px' : '10px';
                message.style.textAlign = 'center';
                message.style.borderBottom = '1px solid #999e9e';
                message.textContent = `${data.msg}`;
            } else if (data.descriptions) {
                if (length !== data.descriptions.length) {
                    length = data.descriptions.length
                    message.style.padding = '5px';
                    message.style.marginBottom = '5px';
                    message.style.background = 'linear-gradient(62deg,#ada996,#f2f2f2,#dbdbdb,#eaeaea)';
                    message.style.fontSize = '12px';
                    message.style.borderRadius = '4px';
                    message.textContent = `${data.descriptions[data.descriptions.length - 1].player_nickname || data.descriptions[data.descriptions.length - 1].player_name}描述: ${data.descriptions[data.descriptions.length - 1].description}`;
                }
            } else {
                message.style.padding = '5px';
                message.style.marginBottom = '5px';
                message.style.backgroundColor = data.player_id == localStorage.getItem('undercover_user_id') ? '#f1f8e9' : '#f0e9f8';
                message.style.borderRadius = '4px';
                message.textContent = `${data.player_nickname || data.player_name}: ${data.content}`;
            }
            chatMessages.appendChild(message);
            chatMessages.scrollTop = chatMessages.scrollHeight;

        }
    }

    // 更新投票信息
    function updateVotes(data) {
        showNotification(`${data.voter_name} 投票给了 ${data.target_name}`);
    }
    // ========== 游戏榜单相关 ==========

    // 创建榜单模态框
    const rankModal = document.createElement('div');
    rankModal.className = 'undercover-modal';
    rankModal.style.display = 'none';
    rankModal.innerHTML = `
   <div class="modal-header" style="cursor: move;background: #BBC2C9; border-radius: 8px 8px 0 0;width:40px;color:#fff;font-size:12px;text-align: center;">
    <div style="position: absolute; left: 10px; top: 8px; cursor: pointer;border-radius: 8px 8px 0 0;"><div style="background:url(${avatar});background-size:cover; background-position:center; background-repeat:no-repeat;width:20px;height:20px;border-radius: 5px ;"></div></div>
    <div style="position: absolute; right: 35px; top: 8px; cursor: pointer;border-radius: 8px 8px 0 0;" id='chang-bg-btn2'">🌗</div>
    <div style="position: absolute; right:12px;top: 5px; cursor: pointer;" id='close-rank-btn' class='closeBtn'>x</div>
     </div>
    <h2 style="margin: 0 0 0px; text-align: center; color: #7a8da1;">谁是卧底 - 游戏榜单</h2>
    <div id="rank-content"></div>
`;
    document.body.appendChild(rankModal);

    // 显示榜单模态框
    function showRankModal() {
        rankModal.style.display = 'block';
        rankModal.classList.add('show');
        setTimeout(() => {
            rankModal.classList.add('active');
        }, 10);
        initRank();
    }

    // 关闭榜单模态框
    function closeRankModal() {
        rankModal.classList.remove('active');
        setTimeout(() => {
            rankModal.classList.remove('show');
            rankModal.style.display = 'none';
        }, 300);
    }
    rankModal.querySelector('#close-rank-btn').onclick = closeRankModal;
    rankModal.querySelector('#chang-bg-btn2').onclick = toggleDarkMode;

    // 初始化榜单流程
    async function initRank() {
        const rankContent = document.getElementById('rank-content');
        rankContent.innerHTML = '<p style="text-align: center;">正在连接服务器...</p>';
        try {
            const sessionId = localStorage.getItem('fishpi_session_id');
            if (sessionId) {
                const user = await validateSession(sessionId);
                if (user) {
                    localStorage.setItem('undercover_user_id', user.id);
                    localStorage.setItem('undercover_user_name', user.username);
                    showRankPage();
                    return;
                }
            }
            // 获取登录URL，携带当前页面URL作为回调地址
            const loginUrl = await getLoginUrl();
            if (loginUrl) {
                rankContent.innerHTML = `
                <div style="text-align: center;">
                    <p style="margin-bottom: 20px;">请先登录摸鱼派账号</p>
                    <button class="undercover-btn" onclick="window.location.href='${loginUrl}'">
                        使用摸鱼派账号登录
                    </button>
                </div>
            `;
            } else {
                throw new Error('获取登录URL失败');
            }
        } catch (error) {
            rankContent.innerHTML = `
            <div style="text-align: center;">
                <p style="color: #e74c3c; margin-bottom: 20px;">
                    连接服务器失败: ${error.message}
                </p>
                <button class="undercover-btn" id='close-rank'>
                    关闭
                </button>
            </div>
        `;
            var closeRank = document.getElementById('close-rank');
            if (closeRank) closeRank.onclick = closeRankModal;
        }


    }

    // 榜单主页面
    async function showRankPage() {
        const rankContent = document.getElementById('rank-content');
        rankContent.innerHTML = `
        <div style="text-align:center;margin-bottom:10px;">
            <input type="text" id="rank-search-input" class="chat-input" placeholder="输入玩家名称查询..." style="width:200px;">
            <button id="rank-search-btn" class="undercover-btn">查询</button>
        </div>
        <div id="rank-list"></div>
        <div id="rank-player-detail" style="display:none;"></div>
    `;
        document.getElementById('rank-search-btn').onclick = async function () {
            const name = document.getElementById('rank-search-input').value.trim();
            if (name) {
                await showPlayerRank(name);
            }
        };
        await fetchRankList();
    }

    // 获取前十名榜单
    async function fetchRankList() {
        const rankListDiv = document.getElementById('rank-list');
        const detailDiv = document.getElementById('rank-player-detail');
        if (detailDiv) detailDiv.style.display = 'none';
        if (rankListDiv) rankListDiv.style.display = '';
        rankListDiv.innerHTML = '<p style="text-align:center;">加载中...</p>';
        try {
            const response = await fetch(`${httpHost}/rank?multi_sort=wins:desc,total_games:desc&limit=10`);
            const data = await response.json();
            if (data.success && data.data.length > 0) {
                rankListDiv.innerHTML = `
                <div class="rank-table-wrapper">
                <table class="undercover-rank-table">
                    <thead>
                        <tr>
                            <th>排名</th>
                            <th>玩家</th>
                            <th>总局数</th>
                            <th>胜利</th>
                            <th>失败</th>
                            <th>胜率</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.data.map((item, idx) => {
                    const winRate = item.win_rate.toString().split('.').length > 1 ? (item.win_rate * 1000 / 1000).toFixed(2) : item.win_rate;
                    return `
                            <tr>
                                <td><span class="rank-badge-table">${idx + 1}</span></td>
                                <td>${item.player_nickname !== item.player_name ? item.player_nickname + ' (' + item.player_name + ')' : item.player_name}</td>
                                <td>${item.total_games}</td>
                                <td class="wins">${item.wins}</td>
                                <td class="losses">${item.losses}</td>
                                <td class="win-rate">${winRate}%</td>
                                <td><button class="undercover-btn show-info-btn" data-info-id="${item.player_name}">详情</button></td>
                            </tr>
                            `;
                }).join('')}
                    </tbody>
                </table>
                </div>
            `;
                document.querySelectorAll('.show-info-btn').forEach(button => {
                    button.onclick = function () {
                        const player_name = this.getAttribute('data-info-id');
                        showPlayerRank(player_name);
                    };
                });
            } else {
                rankListDiv.innerHTML = '<p style="text-align:center;">暂无数据</p>';
            }
        } catch (e) {
            rankListDiv.innerHTML = '<p style="color:red;text-align:center;">获取榜单失败</p>';
        }
    }
    //详情
    async function showPlayerRank(name) {
        document.getElementById('rank-search-input').value = name;
        // 隐藏榜单，显示详情
        const rankListDiv = document.getElementById('rank-list');
        const detailDiv = document.getElementById('rank-player-detail');
        if (rankListDiv) rankListDiv.style.display = 'none';
        if (detailDiv) {
            detailDiv.style.display = '';
            detailDiv.innerHTML = `<div style="text-align:left;margin-bottom:10px;"><button id="back-to-rank-list" class="undercover-btn">← 返回榜单</button></div>`;
        }
        await fetchPlayerRank(name);
        // 绑定返回按钮
        const backBtn = document.getElementById('back-to-rank-list');
        if (backBtn) {
            backBtn.onclick = function () {
                // 隐藏详情，显示榜单
                document.getElementById('rank-search-input').value = "";
                if (detailDiv) detailDiv.style.display = 'none';
                if (rankListDiv) rankListDiv.style.display = '';
            };
        }
    }

    // 查询单个玩家
    async function fetchPlayerRank(name) {
        const detailDiv = document.getElementById('rank-player-detail');
        // 若有返回按钮，保留，详情内容插入其后
        let hasBackBtn = detailDiv && detailDiv.querySelector('#back-to-rank-list');
        let backBtnHtml = hasBackBtn ? detailDiv.innerHTML : '';
        detailDiv.innerHTML = (backBtnHtml ? backBtnHtml : '') + '<div class="loading-spinner"><div class="spinner"></div><p>查询中...</p></div>';
        try {
            const response = await fetch(`${httpHost}/${encodeURIComponent(name)}/status`);
            const data = await response.json();
            if (data.success && data.data) {
                const item = data.data;
                const winRate = item.win_rate.toString().split('.').length > 1 ? (item.win_rate * 1000 / 1000).toFixed(2) : item.win_rate;
                const currentStreakText = item.current_streak >= 0 ? `当前连胜：${item.current_streak}` : `当前连败：${Math.abs(item.current_streak)}`;
                const currentStreakClass = item.current_streak >= 0 ? 'streak-win' : 'streak-lose';
                detailDiv.innerHTML = (backBtnHtml ? backBtnHtml : '') + `
                <div class="player-detail-card">
                    <div class="player-header">
                        <div class="player-avatar">
                            <div class="avatar-placeholder">${(item.player_nickname || item.player_name).charAt(0).toUpperCase()}</div>
                        </div>
                        <div class="player-info">
                            <h3 class="player-name">${item.player_nickname ? item.player_nickname + ' (' + item.player_name + ')' : item.player_name}</h3>
                            <div class="player-stats-summary">
                                <span class="stat-item">
                                    <span class="stat-label">总局数</span>
                                    <span class="stat-value">${item.total_games}</span>
                                </span>
                                <span class="stat-item">
                                    <span class="stat-label">胜率</span>
                                    <span class="stat-value win-rate">${winRate}%</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon">🏆</div>
                            <div class="stat-content">
                                <div class="stat-title">胜利</div>
                                <div class="stat-number wins">${item.wins}</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">💔</div>
                            <div class="stat-content">
                                <div class="stat-title">失败</div>
                                <div class="stat-number losses">${item.losses}</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🔥</div>
                            <div class="stat-content">
                                <div class="stat-title">最佳连胜</div>
                                <div class="stat-number best-streak">${item.best_streak}</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">📉</div>
                            <div class="stat-content">
                                <div class="stat-title">最差连败</div>
                                <div class="stat-number worst-streak">${item.worst_streak}</div>
                            </div>
                        </div>
                    </div>
                    <div class="current-streak ${currentStreakClass}">
                        <span class="streak-icon">${item.current_streak >= 0 ? '🔥' : '❄️'}</span>
                        <span class="streak-text">${currentStreakText}</span>
                    </div>
                    <div class="time-stats">
                        <div class="time-stat">
                            <span class="time-label">本周游戏</span>
                            <span class="time-value">${item.games_this_week} 场</span>
                        </div>
                        <div class="time-stat">
                            <span class="time-label">本月游戏</span>
                            <span class="time-value">${item.games_this_month} 场</span>
                        </div>
                    </div>
                    <div class="last-update">
                        <div class="update-item">
                            <span class="update-label">最后游戏</span>
                            <span class="update-time">${item.last_game_time}</span>
                        </div>
                        <div class="update-item">
                            <span class="update-label">数据更新</span>
                            <span class="update-time">${item.last_updated}</span>
                        </div>
                    </div>
                </div>
            `;
            } else {
                detailDiv.innerHTML = (backBtnHtml ? backBtnHtml : '') + `
                <div class="error-message">
                    <div class="error-icon">❌</div>
                    <p>${data.message || '未查询到该玩家'}</p>
                </div>
                `;
            }
        } catch (e) {
            detailDiv.innerHTML = (backBtnHtml ? backBtnHtml : '') + `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <p>查询失败，请稍后重试</p>
            </div>
            `;
        }
    }
    // ========== 游戏榜单相关 END ==========


    // 添加拖拽事件处理函数
    function startDrag(e) {
        if (e.target.closest('.modal-header')) {
            isDragging = true;
            const rect = modal.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            modal.style.cursor = 'grabbing';
            // 添加防文本选择类
            document.body.classList.add('no-select-during-drag');
        }
    }

    function drag(e) {
        if (!isDragging) return;

        // 计算新位置
        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;

        // 限制在视口内
        const maxLeft = window.innerWidth - modal.offsetWidth;
        const maxTop = window.innerHeight - modal.offsetHeight;

        left = Math.max(0, Math.min(left, maxLeft));
        top = Math.max(0, Math.min(top, maxTop));

        modal.style.left = `${left}px`;
        modal.style.top = `${top}px`;
        modal.style.transform = 'none'; // 移除原来的居中transform
    }

    function endDrag() {
        isDragging = false;
        modal.style.cursor = '';
        // 移除防文本选择类
        document.body.classList.remove('no-select-during-drag');
    }

    // 添加事件监听
    modal.addEventListener('mousedown', startDrag);
    rankModal.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // 切换暗黑模式函数
    function toggleDarkMode() {
        document.body.classList.toggle('undercover-dark');
        // 可选：保存用户偏好到localStorage
        localStorage.setItem('undercover_dark_mode', document.body.classList.contains('undercover-dark') ? '1' : '0');
    }
    // 页面加载时自动应用用户偏好
    if (localStorage.getItem('undercover_dark_mode') === '1') {
        document.body.classList.add('undercover-dark');
    }

    // 在页面加载时检查URL参数
    window.addEventListener('load', watchUrlParams);

    // 在页面关闭时清理WebSocket连接
    window.addEventListener('beforeunload', () => {
        if (window.gameWs) {
            window.gameWs.close();
        }
    });


    GM_addStyle(`
    #tipword.pulse {
        animation: pulse 1s infinite;
    }

    /* 添加踢出按钮样式 */
    .kick-btn {
        transition: all 0.3s ease;
    }

    .kick-btn:hover {
        background-color: #c0392b !important;
        transform: translateY(-1px);
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .kick-btn:active {
        transform: translateY(0);
    }
    /* 添加弹出动画 */
    .undercover-modal {
       display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.95); /* 减小缩放幅度 */
        opacity: 0;
        background-color: white;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        min-width: 320px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

       -webkit-font-smoothing: antialiased;
       -moz-osx-font-smoothing: grayscale;
       text-rendering: optimizeLegibility;
       transform: translateZ(0); /* 触发GPU加速 */
       backface-visibility: hidden;
       filter: blur(0); /* 确保没有模糊效果 */
       font-smooth: always; /* 确保字体平滑 */
    }
      /* 防止拖拽时选中文本 */
    .no-select-during-drag {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }

    .undercover-modal.show {
        display: block;
    }

    .undercover-modal.active {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }

    /* 遮罩层动画 */
    .undercover-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        z-index: 1000;
        backdrop-filter: blur(2px);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .undercover-overlay.show {
        display: block;
        opacity: 1;
    }

    /* 关闭按钮动画 */
    .closeBtn {
        background-color: rgba(255, 255, 255, 0);
        color: #386a70;
        border: none;
        font-size: 16px;
        transition: transform 0.2s ease, color 0.2s ease;
    }

    .closeBtn:hover {
        background-color: rgba(255, 255, 255, 0);
        color: red;
        transform: scale(1.2);
    }

    /* 添加按钮悬停动画 */
    .undercover-btn {
        display: inline-block;
        padding: 8px 16px;
        margin: 5px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        font-weight: 500;
        transform: translateY(0);
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .undercover-btn:hover {
        background-color: #2980b9;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .undercover-btn:active {
        transform: translateY(0);
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    /* 添加房间卡片动画 */
    .room-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding: 10px;
        background: #bbc2c9;
        border-radius: 8px;
        text-align: center;
        transition: all 0.3s ease;
        transform: translateX(0);
    }

    .room-info:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        background: #a8b0b8;
    }

    /* 玩家卡片动画 */
    .player {
        padding: 8px 12px;
        margin: 5px 0;
        border-radius: 4px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    }

    // .player:hover {
    //     transform: scale(1.02);
    //     box-shadow: 0 3px 6px rgba(0,0,0,0.15);
    // }

    /* 添加聊天消息动画 */
    .chat-messages div {
        animation: messageAppear 0.3s ease;
    }

    @keyframes messageAppear {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* 添加倒计时动画 */
    #cd {
        display: inline-block;
        animation: pulse 1s infinite alternate;
    }

    @keyframes pulse {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(1.2);
            color: #e74c3c;
        }
    }

    /* 其他样式保持不变... */
    .closeBtn {
        background-color: rgba(255, 255, 255, 0);
        color:#386a70;
        border:none;
        font-size:16px;
    }
    .closeBtn:hover{
        background-color: rgba(255, 255, 255, 0);
        color:red ！important
    }
    body{
        position: relative;
    }
    .cover-btn{
        position: fixed;
        top:100px;
    }
    .undercover-btn.ready {
        background-color: #317B50;
    }
    .undercover-btn.ready:hover {
        background-color: #27ae60;
    }
    .game-notification {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0,0,0,0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        z-index: 1002;
        animation: notificationSlideUp 0.3s ease;
    }
    .player-list {
        height:350px;
        overflow-y: auto;
        margin: 15px 0;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 8px;
    }
    .player.ready {
        border-left: 10px solid #abcfba !important;
    }
    .player.unready {
        border-left: 10px solid #ed776b !important;
    }
    .player.alive {
        border-top: 4px solid #abcfba !important;
        border-bottom: 4px solid #abcfba !important;
        border-right:4px solid #abcfba !important;
    }
    .player.dead {
        border-top: 4px solid #ed776b !important;
        border-bottom: 4px solid #ed776b !important;
        border-right: 4px solid #ed776b !important;
    }
    .chat-container {
        margin-top: 15px;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 8px;
    }
    .chat-messages {
        height: 200px;
        height: 280px;
        overflow-y: auto;
        padding: 10px;
        background-color: white;
        border-radius: 4px;
        margin-bottom: 10px;
    }
    .chat-input-container {
        display: flex;
        gap: 8px;
    }
    .chat-input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        outline: none;
        transition: border-color 0.2s ease;
    }
    .chat-input:focus {
        border-color: #3498db;
    }
    @keyframes notificationSlideUp {
        from { transform: translate(-50%, 100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }

    /* 暗黑模式CSS */
    body.undercover-dark .undercover-modal {
        background: #23272f;
        color: #847d78;
    }
    body.undercover-dark .undercover-btn {
        background: #444a5a;
        color: #f1f1f1;
    }
    body.undercover-dark .undercover-btn:hover {
        background: #22242a;
    }
    body.undercover-dark .undercover-overlay {
        background: rgba(20,20,20,0.7);
    }
    .player{
        background-color: #fff6f630;
        color: #22242a;
    }
    body.undercover-dark .player-list,
    body.undercover-dark .chat-container {
        background: #23272f;
        color: #22242a;
    }
    body.undercover-dark .chat-messages {
        background: #181a20;
        color:#22242a;
    }
    body.undercover-dark .chat-input {
        background: #23272f;
        color: #f1f1f1;
        border-color: #444a5a;
    }
    body.undercover-dark .room-info {
        background: #181a20;
        color: #22242a;
    }

    /* 玩家详情卡片样式 - 浅色简约风格 */
    .player-detail-card {
        background: #fff;
        border-radius: 16px;
        padding: 24px;
        margin: 16px auto;
        max-width: 480px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        color: #222;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(6px);
        border: 1px solid #e3e8ee;
    }
    .player-detail-card::before {
        display: none;
    }
    .player-header {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
        gap: 16px;
    }
    .player-avatar {
        flex-shrink: 0;
    }
    .avatar-placeholder {
        width: 60px;
        height: 60px;
        background: #e3e8ee;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        color: #3b4a5a;
        border: 2px solid #d1d9e6;
    }
    .player-info {
        flex: 1;
    }
    .player-name {
        margin: 0 0 8px 0;
        font-size: 20px;
        font-weight: 600;
        color: #3b4a5a;
    }
    .player-stats-summary {
        display: flex;
        gap: 16px;
    }
    .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .stat-label {
        font-size: 12px;
        opacity: 0.8;
        margin-bottom: 4px;
    }
    .stat-value {
        font-size: 16px;
        font-weight: 600;
    }
    .win-rate {
        color: #e6b800;
    }
    .stats-grid, .rank-stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 20px;
    }
    .stat-card {
        background: #f3f6fa;
        border-radius: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 1px solid #e3e8ee;
        transition: all 0.3s ease;
    }
    .stat-card:hover {
        transform: translateY(-2px);
        background: #eaf2fb;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .stat-icon {
        font-size: 24px;
        flex-shrink: 0;
    }
    .stat-content {
        flex: 1;
    }
    .stat-title {
        font-size: 12px;
        opacity: 0.8;
        margin-bottom: 4px;
    }
    .stat-number {
        font-size: 18px;
        font-weight: 600;
    }
    .wins {
        color: #3bb273;
    }
    .losses {
        color: #e57373;
    }
    .best-streak {
        color: #e6b800;
    }
    .worst-streak {
        color: #a0a7b8;
    }
    .current-streak {
        background: #f3f6fa;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        border: 1px solid #e3e8ee;
        font-weight: 600;
        font-size: 16px;
        color: #3b4a5a;
    }
    .streak-win {
        background: #eafbf3;
        border-color: #b6e9d0;
        color: #3bb273;
    }
    .streak-lose {
        background: #fbeaea;
        border-color: #f3b6b6;
        color: #e57373;
    }
    .streak-icon {
        font-size: 20px;
    }
    .time-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 20px;
    }
    .time-stat {
        background: #f3f6fa;
        border-radius: 8px;
        padding: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #e3e8ee;
    }
    .time-label {
        font-size: 12px;
        opacity: 0.8;
    }
    .time-value {
        font-size: 14px;
        font-weight: 600;
    }
    .last-update {
        background: #f3f6fa;
        border-radius: 12px;
        padding: 16px;
        border: 1px solid #e3e8ee;
    }
    .update-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }
    .update-item:last-child {
        margin-bottom: 0;
    }
    .update-label {
        font-size: 12px;
        opacity: 0.8;
    }
    .update-time {
        font-size: 12px;
        font-weight: 500;
    }
    /* 暗黑模式适配 */
    body.undercover-dark .player-detail-card {
        background: #23272f;
        color: #f1f1f1;
        border: 1px solid #353b47;
    }
    body.undercover-dark .avatar-placeholder {
        background: #353b47;
        color: #bfc9d8;
        border-color: #23272f;
    }
    body.undercover-dark .player-name {
        color: #bfc9d8;
    }
    body.undercover-dark .stat-card {
        background: #2d323c;
        border-color: #353b47;
    }
    body.undercover-dark .stat-card:hover {
        background: #23272f;
    }
    body.undercover-dark .wins {
        color: #4ade80;
    }
    body.undercover-dark .losses {
        color: #f87171;
    }
    body.undercover-dark .best-streak {
        color: #fbbf24;
    }
    body.undercover-dark .worst-streak {
        color: #a78bfa;
    }
    body.undercover-dark .current-streak {
        background: #2d323c;
        border-color: #353b47;
        color: #bfc9d8;
    }
    body.undercover-dark .streak-win {
        background: #23382d;
        border-color: #3bb273;
        color: #4ade80;
    }
    body.undercover-dark .streak-lose {
        background: #382323;
        border-color: #e57373;
        color: #f87171;
    }
    body.undercover-dark .time-stat {
        background: #2d323c;
        border-color: #353b47;
    }
    body.undercover-dark .last-update {
        background: #2d323c;
        border-color: #353b47;
    }

    /* 加载动画 */
    .loading-spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        color: #7a8da1;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* 错误消息样式 */
    .error-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        text-align: center;
        color: #e74c3c;
    }

    .error-icon {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.8;
    }

    .error-message p {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
    }

    /* 美化排行榜表格 - 浅色简约风格 */
    .rank-table-wrapper {
        width: 100%;
        margin: 0 auto 20px auto;
        overflow-x: auto;
        padding: 0 0 10px 0;
    }
    .undercover-rank-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        overflow: hidden;
        color: #222;
        margin: 0 auto;
        font-size: 15px;
        backdrop-filter: blur(6px);
    }
    .undercover-rank-table thead tr {
        background: #f3f6fa;
    }
    .undercover-rank-table th, .undercover-rank-table td {
        padding: 12px 10px;
        text-align: center;
    }
    .undercover-rank-table th {
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 1px;
        border-bottom: 2px solid #e3e8ee;
        color: #3b4a5a;
        background: #f3f6fa;
    }
    .undercover-rank-table tbody tr {
        background: #f8fafc;
        transition: background 0.2s;
    }
    .undercover-rank-table tbody tr:hover {
        background: #eaf2fb;
    }
    .undercover-rank-table td {
        border-bottom: 1px solid #e3e8ee;
    }
    .undercover-rank-table tr:last-child td {
        border-bottom: none;
    }
    .rank-badge-table {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #e3e8ee;
        color: #3b4a5a;
        font-weight: bold;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        border: 2px solid #d1d9e6;
    }
    .undercover-rank-table .wins {
        color: #3bb273;
        font-weight: 600;
    }
    .undercover-rank-table .losses {
        color: #e57373;
        font-weight: 600;
    }
    .undercover-rank-table .win-rate {
        color: #e6b800;
        font-weight: 600;
    }
    .undercover-rank-table .undercover-btn {
        margin: 0;
        padding: 4px 14px;
        font-size: 14px;
        border-radius: 8px;
        background: #eaf2fb;
        color: #3b4a5a;
        border: 1px solid #d1d9e6;
        transition: background 0.2s, color 0.2s;
    }
    .undercover-rank-table .undercover-btn:hover {
        background: #d1e3fa;
        color: #1a2a3a;
    }
    /* 暗黑模式适配 */
    body.undercover-dark .undercover-rank-table {
        background: #23272f;
        color: #f1f1f1;
        box-shadow: 0 4px 24px rgba(0,0,0,0.18);
    }
    body.undercover-dark .undercover-rank-table thead tr {
        background: #2d323c;
    }
    body.undercover-dark .undercover-rank-table th {
        color: #bfc9d8;
        background: #2d323c;
        border-bottom: 2px solid #353b47;
    }
    body.undercover-dark .undercover-rank-table tbody tr {
        background: #23272f;
    }
    body.undercover-dark .undercover-rank-table tbody tr:hover {
        background: #2d323c;
    }
    body.undercover-dark .undercover-rank-table td {
        border-bottom: 1px solid #353b47;
    }
    body.undercover-dark .rank-badge-table {
        background: #353b47;
        color: #bfc9d8;
        border-color: #23272f;
    }
    body.undercover-dark .undercover-rank-table .undercover-btn {
        background: #353b47;
        color: #bfc9d8;
        border: 1px solid #23272f;
    }
    body.undercover-dark .undercover-rank-table .undercover-btn:hover {
        background: #23272f;
        color: #fff;
    }

    /* 新增卡片样式 */
    .rank-cards-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 15px;
        padding: 10px;
    }

    .rank-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 16px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        transition: all 0.3s ease;
        color: white;
        position: relative;
        overflow: hidden;
    }

    .rank-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }

    .rank-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background-color: rgba(255,255,255,0.2);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        color: white;
        border: 2px solid rgba(255,255,255,0.5);
        z-index: 1;
    }

    .rank-card-header {
        display: flex;
        align-items: center;
        gap: 15px;
        width: 100%;
        margin-bottom: 15px;
    }

    .rank-avatar {
        flex-shrink: 0;
    }

    .rank-player-info {
        flex: 1;
    }

    .rank-player-name {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 5px;
    }

    .rank-player-stats {
        display: flex;
        gap: 10px;
        font-size: 14px;
        opacity: 0.9;
    }

    .rank-stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        width: 100%;
        margin-bottom: 15px;
    }

    .rank-card-action {
        width: 100%;
        text-align: center;
    }
`);
})();