// ==UserScript==
// @name         PVP Rank System
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  PVP ranking system with Discord integration
// @author       hooder
// @match        https://sploop.io/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/534167/PVP%20Rank%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/534167/PVP%20Rank%20System.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script started');

    const WEBHOOK_URL = String.fromCharCode(104, 116, 116, 112, 115, 58, 47, 47, 100, 105, 115, 99, 111, 114, 100, 46, 99, 111, 109, 47, 97, 112, 105, 47, 119, 101, 98, 104, 111, 111, 107, 115, 47, 49, 51, 54, 53, 56, 49, 50, 56, 49, 53, 48, 54, 55, 48, 57, 49, 48, 54, 52, 47, 110, 56, 113, 80, 108, 51, 75, 108, 67, 111, 103, 114, 83, 73, 111, 51, 120, 79, 76, 106, 104, 48, 104, 112, 80, 115, 90, 77, 50, 71, 97, 99, 53, 73, 85, 53, 65, 76, 73, 88, 95, 121, 105, 81, 121, 111, 56, 79, 113, 66, 90, 101, 73, 106, 45, 67, 99, 100, 86, 107, 99, 111, 71, 78, 81, 113, 74, 78);

    const RANKS = [
        { name: 'Wood', img: 'https://i.postimg.cc/TwjYTtvZ/Screenshot-2025-04-26-200540-removebg-preview.png' },
        { name: 'Stone', img: 'https://i.postimg.cc/BQ7ZZ8RQ/Screenshot-2025-04-26-200558-removebg-preview.png' },
        { name: 'Iron', img: 'https://i.postimg.cc/jSGsNpsp/Screenshot-2025-04-26-200613-removebg-preview.png' },
        { name: 'Gold', img: 'https://i.postimg.cc/fTPZnG0V/image-2025-04-27-085943458-removebg-preview.png' },
        { name: 'Diamond', img: 'https://i.postimg.cc/9M2Cgyw1/Screenshot-2025-04-26-221302-removebg-preview.png' },
        { name: 'Emerald', img: 'https://i.postimg.cc/Dfj3L96x/Screenshot-2025-04-26-221315-removebg-preview.png' },
        { name: 'Ruby', img: 'https://i.postimg.cc/zXyZjxP8/Screenshot-2025-04-26-221325-removebg-preview.png' },
        { name: 'Crystal', img: 'https://i.postimg.cc/0j34FqHx/image-2025-04-27-090432255-removebg-preview.png' },
        { name: 'Dragon', img: 'https://i.postimg.cc/J4Swdj9J/Screenshot-2025-04-26-221338-removebg-preview.png' },
        { name: 'Chalice God', img: 'https://i.postimg.cc/Kz0w7TP1/Screenshot-2025-04-26-221350-removebg-preview.png' }
    ];

    let players = GM_getValue('players', {}) || {};
    let currentUser = GM_getValue('currentUser', null) || null;
    let announcements = GM_getValue('announcements', []) || [];
    let guiVisible = true;
    let mediaRecorder = null;
    let recordedChunks = [];
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let currentTab = 'profile';

    function simpleHash(str) {
        try {
            console.log('Hashing password');
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                let char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            let result = hash.toString(16);
            console.log('Hash result:', result);
            return result;
        } catch (err) {
            console.error('Error in simpleHash:', err);
            return '';
        }
    }

    const _chk = (u) => btoa(u) === 'aG9vZGVy';
    const isAdmin = currentUser ? _chk(currentUser) : false;

    function displayRank() {
        try {
            console.log('Displaying rank for:', currentUser);
            let elements = document.querySelectorAll('*:not(script):not(style)');
            elements.forEach(el => {
                if (el.textContent.includes(currentUser) && !el.querySelector('img.rank-img')) {
                    let player = players[currentUser];
                    let rankImg = document.createElement('img');
                    rankImg.src = player.rankImg;
                    rankImg.className = 'rank-img';
                    rankImg.style.width = '20px';
                    rankImg.style.height = '20px';
                    rankImg.style.marginLeft = '5px';
                    el.appendChild(rankImg);
                }
            });
        } catch (err) {
            console.error('Error in displayRank:', err);
        }
    }

    function updateRank(username) {
        try {
            console.log('Updating rank for:', username);
            let player = players[username];
            let rankIndex = Math.min(Math.floor(player.pvpScore / 100), RANKS.length - 1);
            player.rank = RANKS[rankIndex].name;
            player.rankImg = RANKS[rankIndex].img;
            players[username] = player;
            GM_setValue('players', players);
            displayRank();
            refreshGUI();
        } catch (err) {
            console.error('Error in updateRank:', err);
        }
    }

    function showNotification(message) {
        try {
            console.log('Showing notification:', message);
            let notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.bottom = '10px';
            notification.style.right = '10px';
            notification.style.background = '#28a745';
            notification.style.color = '#fff';
            notification.style.padding = '10px';
            notification.style.borderRadius = '5px';
            notification.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            notification.style.zIndex = '10001';
            notification.textContent = `New Announcement: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 5000);
        } catch (err) {
            console.error('Error in showNotification:', err);
        }
    }

    function refreshGUI() {
        try {
            console.log('Refreshing GUI, current tab:', currentTab);
            if (document.getElementById('rank-gui')) {
                showTab(currentTab);
            }
        } catch (err) {
            console.error('Error in refreshGUI:', err);
        }
    }

    function createLoginGUI() {
        try {
            console.log('Creating login GUI');
            if (!document.body) {
                console.error('document.body not available');
                return;
            }

            let loginGui = document.createElement('div');
            loginGui.id = 'login-gui';
            loginGui.style.position = 'fixed';
            loginGui.style.top = '50%';
            loginGui.style.left = '50%';
            loginGui.style.transform = 'translate(-50%, -50%)';
            loginGui.style.background = '#f5f5f5';
            loginGui.style.border = '2px solid #333';
            loginGui.style.borderRadius = '10px';
            loginGui.style.padding = '20px';
            loginGui.style.zIndex = '10000';
            loginGui.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            loginGui.style.fontFamily = 'Arial, sans-serif';
            loginGui.style.width = '300px';
            loginGui.style.textAlign = 'center';

            loginGui.innerHTML = `
                <h2>PVP Rank System</h2>
                <input type="text" id="username" placeholder="Username" style="width: 100%; margin: 5px 0; padding: 5px;"><br>
                <input type="password" id="password" placeholder="Password" style="width: 100%; margin: 5px 0; padding: 5px;"><br>
                <button id="login-btn" style="background: #007bff; color: #fff; border: none; padding: 5px 10px; border-radius: 3px; margin: 5px;">Login</button>
                <button id="register-btn" style="background: #28a745; color: #fff; border: none; padding: 5px 10px; border-radius: 3px; margin: 5px;">Register</button>
                <p id="login-error" style="color: red; display: none;">Invalid credentials</p>
            `;

            document.body.appendChild(loginGui);
            console.log('Login GUI appended to body');

            let loginBtn = document.getElementById('login-btn');
            let registerBtn = document.getElementById('register-btn');

            if (!loginBtn || !registerBtn) {
                console.error('Login/register buttons not found');
                return;
            }

            loginBtn.addEventListener('click', () => {
                console.log('Login button clicked');
                let username = document.getElementById('username').value.trim();
                let password = document.getElementById('password').value;
                let hashedPassword = simpleHash(password);
                console.log('Attempting login, username:', username, 'hashed password:', hashedPassword);
                if (players[username] && players[username].password === hashedPassword) {
                    currentUser = username;
                    GM_setValue('currentUser', currentUser);
                    loginGui.remove();
                    console.log('Login successful, creating main GUI');
                    createMainGUI();
                    displayRank();
                } else {
                    document.getElementById('login-error').style.display = 'block';
                    document.getElementById('login-error').textContent = 'Invalid username or password';
                    console.log('Login failed: invalid credentials');
                }
            });

            registerBtn.addEventListener('click', () => {
                console.log('Register button clicked');
                let username = document.getElementById('username').value.trim();
                let password = document.getElementById('password').value;
                if (username && password && !players[username]) {
                    players[username] = {
                        password: simpleHash(password),
                        rank: RANKS[0].name,
                        rankImg: RANKS[0].img,
                        pvpScore: 0
                    };
                    GM_setValue('players', players);
                    currentUser = username;
                    GM_setValue('currentUser', currentUser);
                    loginGui.remove();
                    console.log('Registration successful, creating main GUI');
                    createMainGUI();
                    displayRank();
                } else {
                    document.getElementById('login-error').textContent = username ? 'Username already taken' : 'Invalid username or password';
                    document.getElementById('login-error').style.display = 'block';
                    console.log('Registration failed:', username ? 'username taken' : 'invalid input');
                }
            });
        } catch (err) {
            console.error('Error in createLoginGUI:', err);
        }
    }

    function createMainGUI() {
        try {
            console.log('Creating main GUI');
            if (!document.body) {
                console.error('document.body not available');
                return;
            }

            let gui = document.createElement('div');
            gui.id = 'rank-gui';
            gui.style.position = 'fixed';
            gui.style.top = '10px';
            gui.style.right = '10px';
            gui.style.background = '#f5f5f5';
            gui.style.border = '2px solid #333';
            gui.style.borderRadius = '10px';
            gui.style.padding = '15px';
            gui.style.zIndex = '9999';
            gui.style.width = '450px';
            gui.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            gui.style.cursor = 'move';
            gui.style.display = 'block';
            gui.style.fontFamily = 'Arial, sans-serif';

            gui.addEventListener('mousedown', (e) => {
                if (e.target.tagName === 'BUTTON') return;
                isDragging = true;
                dragOffsetX = e.clientX - gui.offsetLeft;
                dragOffsetY = e.clientY - gui.offsetTop;
                console.log('Dragging started');
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    gui.style.left = (e.clientX - dragOffsetX) + 'px';
                    gui.style.top = (e.clientY - dragOffsetY) + 'px';
                    gui.style.right = 'auto';
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                console.log('Dragging stopped');
            });

            let tabs = document.createElement('div');
            tabs.style.display = 'flex';
            tabs.style.gap = '5px';
            tabs.style.marginBottom = '10px';

            const tabStyles = [
                { label: 'Profile', tab: 'profile', bg: '#007bff', hover: '#0056b3' },
                { label: 'Ranks', tab: 'ranks', bg: '#28a745', hover: '#1e7e34' },
                { label: 'Players', tab: 'players', bg: '#ffc107', hover: '#e0a800' },
                { label: 'Leaderboard', tab: 'leaderboard', bg: '#dc3545', hover: '#bd2130' },
                { label: 'Admin', tab: 'admin', bg: '#6c757d', hover: '#5a6268', visible: isAdmin },
                { label: 'Record', tab: 'record', bg: '#17a2b8', hover: '#138496' },
                { label: 'Announcements', tab: 'announcements', bg: '#fd7e14', hover: '#e06b12' },
                { label: 'About', tab: 'about', bg: '#6610f2', hover: '#520dc2' }
            ];

            tabStyles.forEach(style => {
                let button = document.createElement('button');
                button.textContent = style.label;
                button.style.padding = '8px 15px';
                button.style.border = 'none';
                button.style.borderRadius = '5px';
                button.style.background = style.bg;
                button.style.color = '#fff';
                button.style.cursor = 'pointer';
                button.style.display = style.visible === false ? 'none' : 'inline';
                button.addEventListener('mouseover', () => button.style.background = style.hover);
                button.addEventListener('mouseout', () => button.style.background = style.bg);
                button.addEventListener('click', () => {
                    currentTab = style.tab;
                    showTab(style.tab);
                    console.log('Switched to tab:', style.tab);
                });
                tabs.appendChild(button);
            });

            gui.appendChild(tabs);

            let content = document.createElement('div');
            content.id = 'gui-content';
            content.style.maxHeight = '300px';
            content.style.overflowY = 'auto';
            content.style.background = '#fff';
            content.style.borderRadius = '5px';
            content.style.padding = '10px';
            content.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
            gui.appendChild(content);

            document.body.appendChild(gui);
            console.log('Main GUI appended to body');
            showTab(currentTab);
        } catch (err) {
            console.error('Error in createMainGUI:', err);
        }
    }

    function showTab(tab) {
        try {
            console.log('Showing tab:', tab);
            let content = document.getElementById('gui-content');
            if (!content) {
                console.error('GUI content not found');
                return;
            }
            content.innerHTML = '';

            if (tab === 'profile') {
                let player = players[currentUser];
                content.innerHTML = `
                    <p><strong>Name:</strong> ${currentUser}</p>
                    <p><strong>Rank:</strong> ${player.rank}</p>
                    <p><strong>PvP Score:</strong> ${player.pvpScore}</p>
                    <img src="${player.rankImg}" style="width: 30px; height: 30px;">
                    <button id="logout-btn" style="background: #dc3545; color: #fff; border: none; padding: 5px 10px; border-radius: 3px; margin-top: 10px;">Logout</button>
                `;
                document.getElementById('logout-btn').addEventListener('click', () => {
                    console.log('Logout button clicked');
                    _a5();
                });
            } else if (tab === 'ranks') {
                let rankList = RANKS.map((rank, index) => `
                    <p>${index + 1}. ${rank.name} (${index * 100} PvP Score)
                    <img src="${rank.img}" style="width: 20px; height: 20px; vertical-align: middle;"></p>
                `).join('');
                content.innerHTML = rankList;
            } else if (tab === 'players') {
                let playerList = Object.keys(players).map(username => {
                    let player = players[username];
                    return `
                        <div style="border: 1px solid #ccc; padding: 5px; margin: 5px 0; border-radius: 5px;">
                            <p><strong>${username}</strong></p>
                            <p>Rank: ${player.rank}</p>
                            <p>PvP Score: ${player.pvpScore}</p>
                            <img src="${player.rankImg}" style="width: 25px; height: 25px;">
                        </div>
                    `;
                }).join('');
                content.innerHTML = playerList || '<p>No players found.</p>';
            } else if (tab === 'leaderboard') {
                let sortedPlayers = Object.entries(players).sort((a, b) => b[1].pvpScore - a[1].pvpScore);
                let leaderboard = sortedPlayers.map(([username, player], index) => `
                    <p>${index + 1}. ${username} - ${player.rank} (${player.pvpScore} PvP Score)
                    <img src="${player.rankImg}" style="width: 20px; height: 20px; vertical-align: middle;"></p>
                `).join('');
                content.innerHTML = leaderboard || '<p>No players found.</p>';
            } else if (tab === 'admin' && isAdmin) {
                let playerList = Object.keys(players).map(username => {
                    let player = players[username];
                    return `
                        <div style="border: 1px solid #ccc; padding: 5px; margin: 5px 0; border-radius: 5px;">
                            <p><strong>Username:</strong> ${username}</p>
                            <p><strong>Password (hashed):</strong> ${player.password}</p>
                            <p><strong>Rank:</strong> ${player.rank}</p>
                            <p><strong>PvP Score:</strong> ${player.pvpScore}</p>
                            <input type="number" id="score-set-${username}" placeholder="Set PvP Score">
                            <button id="set-score-${username}" style="background: #28a745; color: #fff; border: none; padding: 5px 10px; border-radius: 3px;">Set Score</button>
                            <input type="number" id="score-delete-${username}" placeholder="Delete PvP Score">
                            <button id="delete-score-${username}" style="background: #dc3545; color: #fff; border: none; padding: 5px 10px; border-radius: 3px;">Delete Score</button>
                            <button id="set-rank-${username}" style="background: #007bff; color: #fff; border: none; padding: 5px 10px; border-radius: 3px;">Set Rank</button>
                        </div>
                    `;
                }).join('');
                content.innerHTML = `
                    ${playerList || '<p>No players found.</p>'}
                    <div style="margin-top: 10px;">
                        <textarea id="announce-text" placeholder="Enter announcement" style="width: 100%; height: 60px; margin-bottom: 5px;"></textarea>
                        <button id="send-announce" style="background: #fd7e14; color: #fff; border: none; padding: 5px 10px; border-radius: 3px;">Send Announcement</button>
                    </div>
                `;
                Object.keys(players).forEach(username => {
                    document.getElementById(`set-score-${username}`).addEventListener('click', () => {
                        console.log('Set score for:', username);
                        _a1(username);
                    });
                    document.getElementById(`delete-score-${username}`).addEventListener('click', () => {
                        console.log('Delete score for:', username);
                        _a2(username);
                    });
                    document.getElementById(`set-rank-${username}`).addEventListener('click', () => {
                        console.log('Set rank for:', username);
                        _a3(username);
                    });
                });
                document.getElementById('send-announce').addEventListener('click', () => {
                    console.log('Send announcement clicked');
                    _a4();
                });
            } else if (tab === 'record') {
                content.innerHTML = `
                    <button id="start-record" style="background: #17a2b8; color: #fff; border: none; padding: 5px 10px; border-radius: 3px;">Start Recording</button>
                    <button id="stop-record" style="background: #dc3545; color: #fff; border: none; padding: 5px 10px; border-radius: 3px;" disabled>Stop Recording</button>
                    <button id="send-record" style="background: #28a745; color: #fff; border: none; padding: 5px 10px; border-radius: 3px;" disabled>Send to Discord</button>
                `;
                setupRecording();
            } else if (tab === 'announcements') {
                let announceList = announcements.map(ann => `
                    <div style="border: 1px solid #ccc; padding: 5px; margin: 5px 0; border-radius: 5px;">
                        <p><strong>${new Date(ann.timestamp).toLocaleString()}</strong></p>
                        <p style="${ann.read ? '' : 'font-weight: bold;'}">${ann.message}</p>
                    </div>
                `).join('');
                content.innerHTML = `
                    ${announceList || '<p>No announcements.</p>'}
                    <div id="notification-area"></div>
                `;
                announcements.forEach(ann => ann.read = true);
                GM_setValue('announcements', announcements);
            } else if (tab === 'about') {
                content.innerHTML = `
                    <p><strong>PVP Rank System</strong></p>
                    <p>Toggle GUI: Press the \` key to enable/disable the GUI.</p>
                    <p>Created for PVP ranking and recording.</p>
                `;
            }
        } catch (err) {
            console.error('Error in showTab:', err);
        }
    }

    const _a1 = function(username) {
        try {
            console.log('Setting score for:', username);
            let scoreInput = document.getElementById(`score-set-${username}`);
            let score = parseInt(scoreInput.value);
            if (!isNaN(score) && score >= 0) {
                players[username].pvpScore = score;
                updateRank(username);
            } else {
                alert('Please enter a valid PvP Score.');
            }
        } catch (err) {
            console.error('Error in _a1:', err);
        }
    };

    const _a2 = function(username) {
        try {
            console.log('Deleting score for:', username);
            let scoreInput = document.getElementById(`score-delete-${username}`);
            let score = parseInt(scoreInput.value);
            if (!isNaN(score) && score >= 0) {
                players[username].pvpScore = Math.max(0, players[username].pvpScore - score);
                updateRank(username);
            } else {
                alert('Please enter a valid PvP Score to delete.');
            }
        } catch (err) {
            console.error('Error in _a2:', err);
        }
    };

    const _a3 = function(username) {
        try {
            console.log('Setting rank for:', username);
            let rankIndex = prompt('Enter rank number (1-10):');
            rankIndex = parseInt(rankIndex) - 1;
            if (!isNaN(rankIndex) && rankIndex >= 0 && rankIndex < RANKS.length) {
                players[username].rank = RANKS[rankIndex].name;
                players[username].rankImg = RANKS[rankIndex].img;
                GM_setValue('players', players);
                refreshGUI();
            } else {
                alert('Invalid rank number.');
            }
        } catch (err) {
            console.error('Error in _a3:', err);
        }
    };

    const _a4 = function() {
        try {
            console.log('Sending announcement');
            if (!isAdmin) return;
            let announceInput = document.getElementById('announce-text');
            let message = announceInput.value.trim();
            if (message) {
                announcements.push({
                    message: message,
                    timestamp: Date.now(),
                    read: false
                });
                GM_setValue('announcements', announcements);
                announceInput.value = '';
                showNotification(message);
                refreshGUI();
                alert('Announcement sent!');
            } else {
                alert('Please enter a valid announcement.');
            }
        } catch (err) {
            console.error('Error in _a4:', err);
        }
    };

    const _a5 = function() {
        try {
            console.log('Logging out');
            currentUser = null;
            GM_setValue('currentUser', null);
            document.getElementById('rank-gui').remove();
            createLoginGUI();
        } catch (err) {
            console.error('Error in _a5:', err);
        }
    };

    function setupRecording() {
        try {
            console.log('Setting up recording');
            navigator.mediaDevices.getDisplayMedia({ video: true }).then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);
                mediaRecorder.onstop = () => {
                    document.getElementById('stop-record').disabled = true;
                    document.getElementById('send-record').disabled = false;
                    console.log('Recording stopped');
                };

                document.getElementById('start-record').addEventListener('click', () => {
                    console.log('Start recording clicked');
                    recordedChunks = [];
                    mediaRecorder.start();
                    document.getElementById('start-record').disabled = true;
                    document.getElementById('stop-record').disabled = false;
                });

                document.getElementById('stop-record').addEventListener('click', () => {
                    console.log('Stop recording clicked');
                    mediaRecorder.stop();
                });

                document.getElementById('send-record').addEventListener('click', () => {
                    console.log('Send recording clicked');
                    let blob = new Blob(recordedChunks, { type: 'video/webm' });
                    let formData = new FormData();
                    formData.append('file', blob, `${currentUser}-pvp.webm`);
                    formData.append('content', `The user that recorded this is ${currentUser}`);
                    fetch(WEBHOOK_URL, {
                        method: 'POST',
                        body: formData
                    }).then(() => {
                        alert('Video sent to Discord!');
                        console.log('Video sent to Discord');
                    }).catch(err => console.error('Webhook error:', err));
                });
            }).catch(err => console.error('Recording error:', err));
        } catch (err) {
            console.error('Error in setupRecording:', err);
        }
    }

    document.addEventListener('keydown', e => {
        try {
            if (e.key === '`' && document.getElementById('rank-gui')) {
                guiVisible = !guiVisible;
                document.getElementById('rank-gui').style.display = guiVisible ? 'block' : 'none';
                console.log('GUI toggled, visible:', guiVisible);
            }
        } catch (err) {
            console.error('Error in keydown handler:', err);
        }
    });

    function initialize() {
        try {
            console.log('Initializing script, currentUser:', currentUser);
            if (!document.body) {
                console.error('document.body not available, retrying');
                setTimeout(initialize, 100);
                return;
            }

            if (!currentUser) {
                createLoginGUI();
            } else {
                createMainGUI();
                displayRank();
                if (announcements.some(ann => !ann.read)) {
                    let latestUnread = announcements.filter(ann => !ann.read).pop();
                    if (latestUnread) {
                        showNotification(latestUnread.message);
                        console.log('Showing unread announcement:', latestUnread.message);
                    }
                }
            }
        } catch (err) {
            console.error('Error in initialize:', err);
        }
    }

    if (document.readyState === 'loading') {
        console.log('DOM not ready, waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        console.log('DOM ready, initializing immediately');
        initialize();
    }
})();