// ==UserScript==
// @name         Avatar Açıcılı Çoklu Oda İzleme
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds watch buttons and room codes, allows multiple room viewing in iframes, resizes chat and answers, repositions user list, removes unnecessary elements, and opens avatars in new tabs on click.
// @author       123123
// @match        https://gartic.io/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546080/Avatar%20A%C3%A7%C4%B1c%C4%B1l%C4%B1%20%C3%87oklu%20Oda%20%C4%B0zleme.user.js
// @updateURL https://update.greasyfork.org/scripts/546080/Avatar%20A%C3%A7%C4%B1c%C4%B1l%C4%B1%20%C3%87oklu%20Oda%20%C4%B0zleme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Mobile-optimized styles
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        /* Hide unnecessary elements */
        .logo, header.game .logo, #tools, .users-tools #tools, #events, #time, .denounce, #mobile-posts {
            display: none !important;
        }

        /* Hint styling */
        #hint {
            display: block !important;
            position: relative;
            background: transparent;
            font-family: 'Baloo Bhaijaan 2', sans-serif;
            font-size: 3vw;
        }
        #hint button {
            background-color: rgba(26, 26, 45, 0.9);
            color: #0ff;
            border: 2px solid #0ff;
            border-radius: 8px;
            padding: 2vw 4vw;
            font-size: 3vw;
            cursor: pointer;
            text-shadow: 0 0 5px #0ff;
            transition: all 0.3s ease;
            touch-action: manipulation;
        }
        #hint button:hover {
            background-color: #0ff;
            color: #1a1a2d;
            box-shadow: 0 0 10px #0ff;
        }
        #hint button:disabled {
            background-color: rgba(26, 26, 45, 0.5);
            color: #666;
            border: 2px solid #666;
            cursor: not-allowed;
        }
        #hint .line .word span {
            color: #000;
            font-size: 3vw;
            font-weight: bold;
            text-shadow: 0 0 5px #242323;
            margin: 0 1vw;
        }
        #hint .line .word span.active {
            color: #000;
            text-shadow: 0 0 5px #0ff, 0 0 10px #0ff;
        }

        /* Chat styling */
        #chat {
            width: 90vw !important;
            height: 30vh !important;
            position: relative !important;
            overflow: auto;
            background: transparent;
            border: none;
            margin: 2vw auto;
        }
        #chat .history {
            height: calc(100% - 10vw);
            overflow-y: auto;
        }
        #chat .textGame {
            width: 100%;
            box-sizing: border-box;
            font-size: 3vw;
        }

        /* Answer styling */
        #answer {
            width: 90vw !important;
            height: 30vh !important;
            position: relative !important;
            overflow: auto;
            background: transparent;
            border: none;
            margin: 2vw auto;
        }
        #answer .history {
            height: calc(100% - 10vw);
            overflow-y: auto;
        }

        /* Align SOHBET and CEVAPLAR */
        #screenRoom .ctt #interaction #chat h5,
        #screenRoom .ctt #interaction #answer h5 {
            margin: 0;
            padding: 2vw;
            font-size: 3.5vw;
            font-family: 'Baloo Bhaijaan 2', sans-serif;
            color: #fff;
            text-shadow: 0 0 5px #242323;
            background-color: #242323;
            border-radius: 8px 8px 0 0;
            text-align: center;
            line-height: 1.2;
            width: 100%;
            box-sizing: border-box;
        }

        /* Ensure canvas and answers are visible */
        #canvas, #drawing, #screenRoom .ctt #interaction #answer {
            display: block !important;
        }

        /* User list styling */
        #screenRoom .ctt .users-tools #users {
            position: relative !important;
            width: 100% !important;
            max-height: 20vh !important;
            background: rgba(26, 26, 45, 0.9);
            overflow-y: auto;
            padding: 2vw;
            margin-bottom: 2vw;
        }
        #screenRoom .ctt .users-tools #users .user .infosPlayer .nick {
            color: #fff;
            font-size: 3.5vw;
            line-height: 1.2;
        }
        #screenRoom .ctt .users-tools #users .user .infosPlayer .points {
            color: #242323;
            font-size: 3vw;
        }
        #screenRoom .ctt .users-tools #users .user.turn .infosPlayer .nick,
        #screenRoom .ctt .users-tools #users .user.turn .infosPlayer .points {
            color: #242323;
        }
        #screenRoom .ctt .users-tools #users .user .avatar {
            box-shadow: 0 0 0 2px #fff;
            width: 8vw;
            height: 8vw;
        }

        /* Room watch buttons */
        .roomwatch {
            border: 2px solid #0ff;
            border-radius: 8px;
            padding: 2vw 4vw;
            font-size: 3vw;
            background-color: rgba(26, 26, 45, 0.9);
            color: #0ff;
            cursor: pointer;
            text-shadow: 0 0 5px #0ff;
            transition: all 0.3s ease;
            touch-action: manipulation;
        }
        .roomwatch:hover {
            background-color: #0ff;
            color: #1a1a2d;
            box-shadow: 0 0 10px #0ff;
        }

        /* Room list styling */
        .rooms .scroll a:not(.emptyList):not(.loading) {
            background-color: #fff0;
            border: 2px solid #242323;
            border-radius: 8px;
            box-shadow: 0 0 5px #242323;
            margin: 2vw;
            padding: 2vw;
        }
        .rooms .scroll a:not(.emptyList):not(.loading):hover {
            border-color: rgba(0,121,255,0.7);
            box-shadow: 0 0 10px #242323;
        }
        .rooms .scroll a:not(.emptyList):not(.loading) h5,
        .rooms .scroll a:not(.emptyList):not(.loading) h5 strong,
        .rooms .scroll a:not(.emptyList):not(.loading) .infosRoom > div span:not(.tooltip) {
            color: #fff;
            font-size: 3vw;
            text-shadow: 0 0 3px #242323;
        }

        /* Room code snippet */
        .room-code-snippet {
            position: absolute;
            top: 1vw;
            left: 1vw;
            color: #0ff;
            font-size: 2.5vw;
            font-weight: bold;
            text-shadow: 0 0 5px #0ff;
            background: rgba(26, 26, 45, 0.9);
            padding: 1vw 2vw;
            border-radius: 4px;
            border: 1px solid #0ff;
        }

        /* Viewer window styling */
        .viewer-initialized body {
            background-color: #0d0e1c;
            margin: 0;
            padding: 0;
            overflow: auto;
        }
        .resizable-iframe {
            width: 95vw;
            height: 50vh;
            border: 2px solid #242323;
            border-radius: 8px;
            margin: 2vw auto;
            box-shadow: 0 0 5px #242323;
        }
        .resizable-iframe iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        .close-button {
            position: absolute;
            top: 1vw;
            right: 1vw;
            width: 6vw;
            height: 6vw;
            background-color: #242323;
            color: #fff;
            text-align: center;
            line-height: 6vw;
            font-size: 4vw;
            border-radius: 50%;
            cursor: pointer;
            border: 1px solid #fff;
            touch-action: manipulation;
        }
        .close-button:hover {
            background-color: #242323;
            box-shadow: 0 0 5px #242323;
        }
        .room-code {
            position: absolute;
            bottom: 1vw;
            left: 1vw;
            color: #fff;
            font-size: 3vw;
            font-weight: bold;
            text-shadow: 0 0 5px #242323;
        }
        .room-sidebar {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 25vh;
            background: rgba(26, 26, 45, 0.9);
            z-index: 1200;
            overflow-y: auto;
            padding: 2vw;
            box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.5);
        }
        .room-sidebar h3 {
            color: #0ff;
            font-size: 4vw;
            margin: 2vw 0;
            text-align: center;
        }
        .room-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2vw;
            margin: 1vw 0;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid #0ff;
            border-radius: 5px;
        }
        .room-item span {
            color: #fff;
            font-size: 3vw;
            text-shadow: 0 0 3px #0ff;
        }
        .room-item .viewer-btn, .refresh-btn {
            border: 2px solid #0ff;
            border-radius: 8px;
            padding: 1vw 2vw;
            font-size: 2.5vw;
            background-color: rgba(26, 26, 45, 0.9);
            color: #0ff;
            cursor: pointer;
            text-shadow: 0 0 3px #0ff;
            touch-action: manipulation;
        }
        .room-item .viewer-btn:hover, .refresh-btn:hover {
            background-color: #0ff;
            color: #1a1a2d;
            box-shadow: 0 0 5px #0ff;
        }

        /* Scrollbar styles */
        ::-webkit-scrollbar {
            width: 2vw;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: rgb(30, 42, 56);
            border-radius: 2vw;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgb(30, 42, 56);
        }
        scrollbar-width: thin;
        scrollbar-color: rgb(30, 42, 56) transparent;

        /* Body styling */
        body {
            background-image: url('https://www.colorhexa.com/161624.png');
            background-size: cover;
            background-repeat: no-repeat;
            background-attachment: fixed;
            font-family: 'Baloo Bhaijaan 2', sans-serif;
            margin: 0;
            padding: 0;
        }
    `;
    document.head.appendChild(style);

    // Update user list with numbering
    function updateUserList() {
        const userList = document.querySelector('#screenRoom .ctt .users-tools #users');
        if (userList) {
            const users = userList.getElementsByClassName('user');
            for (let i = 0; i < users.length; i++) {
                const avatar = users[i].querySelector('.avatar');
                if (avatar) {
                    let numberElement = users[i].querySelector('.user-number');
                    if (!numberElement) {
                        numberElement = document.createElement('span');
                        numberElement.className = 'user-number';
                        numberElement.style.cssText = `
                            position: absolute;
                            left: -5vw;
                            color: #fff;
                            font-size: 3vw;
                            font-weight: bold;
                            text-shadow: 0 0 3px #242323;
                        `;
                        avatar.parentNode.insertBefore(numberElement, avatar);
                    }
                    numberElement.textContent = (i + 1).toString();
                }
            }
        }
    }

    // Run updateUserList on page load and periodically
    window.addEventListener('load', updateUserList);
    setInterval(updateUserList, 1000);

    // Add room watch buttons and code snippets
    setInterval(function() {
        const scrollElements = document.getElementsByClassName("scrollElements")[0];
        if (!scrollElements) return;

        for (let x of scrollElements.getElementsByTagName("a")) {
            if (!x.querySelector(".roomwatch")) {
                const roomLink = x.href;
                x.innerHTML += `<input class="roomwatch" type="button" value="izle" onclick="openViewerWindow('${roomLink}/viewer')">`;
            }
            if (!x.querySelector(".room-code-snippet")) {
                const roomCode = x.href.match(/gartic\.io\/([a-zA-Z0-9]+)/)?.[1] || 'Unknown';
                const roomCodeElement = document.createElement('h5');
                roomCodeElement.className = 'room-code-snippet';
                roomCodeElement.textContent = `ODA KODU: ${roomCode}`;
                x.style.position = 'relative';
                x.insertBefore(roomCodeElement, x.firstChild);
            }
        }
    }, 1000);

    // Viewer window function
    window.openViewerWindow = function(url) {
        const viewerWindow = window.open('', 'viewerWindow') || window;
        if (viewerWindow) {
            if (!viewerWindow.document.body.classList.contains('viewer-initialized')) {
                viewerWindow.document.body.innerHTML = `
                    <div id="viewerContainer" style="display: flex; flex-direction: column; gap: 2vw; padding: 2vw; height: 100vh; margin: 0;"></div>
                    <div id="roomSidebar" class="room-sidebar">
                        <h3>Oda Listesi <button class="refresh-btn">Yenile</button></h3>
                        <div id="roomList"></div>
                    </div>
                `;
                const viewerStyle = viewerWindow.document.createElement('style');
                viewerStyle.innerHTML = `
                    body {
                        background-color: #0d0e1c;
                        margin: 0;
                        padding: 0;
                        overflow: auto;
                        font-family: 'Baloo Bhaijaan 2', sans-serif;
                    }
                    .resizable-iframe {
                        width: 95vw;
                        height: 50vh;
                        border: 2px solid #242323;
                        border-radius: 8px;
                        margin: 2vw auto;
                        box-shadow: 0 0 5px #242323;
                    }
                    .resizable-iframe iframe {
                        width: 100%;
                        height: 100%;
                        border: none;
                    }
                    .close-button {
                        position: absolute;
                        top: 1vw;
                        right: 1vw;
                        width: 6vw;
                        height: 6vw;
                        background-color: #242323;
                        color: #fff;
                        text-align: center;
                        line-height: 6vw;
                        font-size: 4vw;
                        border-radius: 50%;
                        cursor: pointer;
                        border: 1px solid #fff;
                        touch-action: manipulation;
                    }
                    .close-button:hover {
                        background-color: #242323;
                        box-shadow: 0 0 5px #242323;
                    }
                    .room-code {
                        position: absolute;
                        bottom: 1vw;
                        left: 1vw;
                        color: #fff;
                        font-size: 3vw;
                        font-weight: bold;
                        text-shadow: 0 0 5px #242323;
                    }
                    .room-sidebar {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 25vh;
                        background: rgba(26, 26, 45, 0.9);
                        z-index: 1200;
                        overflow-y: auto;
                        padding: 2vw;
                        box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.5);
                    }
                    .room-sidebar h3 {
                        color: #0ff;
                        font-size: 4vw;
                        margin: 2vw 0;
                        text-align: center;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .room-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 2vw;
                        margin: 1vw 0;
                        background: rgba(0, 0, 0, 0.5);
                        border: 1px solid #0ff;
                        border-radius: 5px;
                    }
                    .room-item span {
                        color: #fff;
                        font-size: 3vw;
                        text-shadow: 0 0 3px #0ff;
                    }
                    .room-item .viewer-btn, .refresh-btn {
                        border: 2px solid #0ff;
                        border-radius: 8px;
                        padding: 1vw 2vw;
                        font-size: 2.5vw;
                        background-color: rgba(26, 26, 45, 0.9);
                        color: #0ff;
                        cursor: pointer;
                        text-shadow: 0 0 3px #0ff;
                        touch-action: manipulation;
                    }
                    .room-item .viewer-btn:hover, .refresh-btn:hover {
                        background-color: #0ff;
                        color: #1a1a2d;
                        box-shadow: 0 0 5px #0ff;
                    }
                    ::-webkit-scrollbar {
                        width: 2vw;
                    }
                    ::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: rgb(30, 42, 56);
                        border-radius: 2vw;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: rgb(30, 42, 56);
                    }
                    scrollbar-width: thin;
                    scrollbar-color: rgb(30, 42, 56) transparent;
                `;
                viewerWindow.document.head.appendChild(viewerStyle);
                viewerWindow.document.body.classList.add('viewer-initialized');

                // Define openViewerWindow inside viewerWindow
                viewerWindow.openViewerWindow = function(url) {
                    const roomCode = url.split('/').slice(-2)[0];
                    const viewerContainer = viewerWindow.document.getElementById('viewerContainer');
                    const iframeContainer = viewerWindow.document.createElement('div');
                    iframeContainer.className = 'resizable-ifframe';
                    iframeContainer.innerHTML = `
                        <iframe src="${url}"></iframe>
                        <div class="close-button">×</div>
                        <div class="room-code">${roomCode}</div>
                    `;
                    viewerContainer.appendChild(iframeContainer);

                    const closeButton = iframeContainer.querySelector('.close-button');
                    if (closeButton) {
                        closeButton.addEventListener('click', function() {
                            iframeContainer.remove();
                        });
                    }
                };

                // Refresh button functionality
                const refreshButton = viewerWindow.document.querySelector('.refresh-btn');
                if (refreshButton) {
                    refreshButton.addEventListener('click', function() {
                        const roomList = viewerWindow.document.getElementById('roomList');
                        if (roomList && window.location.hostname === 'gartic.io') {
                            const scrollElements = document.getElementsByClassName("scrollElements")[0];
                            if (scrollElements) {
                                const rooms = scrollElements.getElementsByTagName("a");
                                roomList.innerHTML = '';
                                for (let x of rooms) {
                                    const roomCode = x.href.match(/gartic\.io\/([a-zA-Z0-9]+)/)?.[1] || 'Unknown';
                                    const roomItem = viewerWindow.document.createElement('div');
                                    roomItem.className = 'room-item';
                                    roomItem.innerHTML = `
                                        <span>${roomCode}</span>
                                        <button class="viewer-btn" onclick="openViewerWindow('https://gartic.io/${roomCode}/viewer')">İzle</button>
                                    `;
                                    roomList.appendChild(roomItem);
                                }
                            }
                        }
                    });
                }
            }

            // Initial room load
            viewerWindow.openViewerWindow(url);

            // Populate sidebar with room codes
            const roomList = viewerWindow.document.getElementById('roomList');
            if (roomList && window.location.hostname === 'gartic.io') {
                const scrollElements = document.getElementsByClassName("scrollElements")[0];
                if (scrollElements) {
                    const rooms = scrollElements.getElementsByTagName("a");
                    roomList.innerHTML = '';
                    for (let x of rooms) {
                        const roomCode = x.href.match(/gartic\.io\/([a-zA-Z0-9]+)/)?.[1] || 'Unknown';
                        const roomItem = viewerWindow.document.createElement('div');
                        roomItem.className = 'room-item';
                        roomItem.innerHTML = `
                            <span>${roomCode}</span>
                            <button class="viewer-btn" onclick="openViewerWindow('https://gartic.io/${roomCode}/viewer')">İzle</button>
                        `;
                        roomList.appendChild(roomItem);
                    }
                }
            }
        }
    };

    // Avatar click to open in new tab
    document.addEventListener("click", function(event) {
        let target = event.target;
        if (target.classList.contains("avatar")) {
            let computedStyle = window.getComputedStyle(target);
            let backgroundImage = computedStyle.backgroundImage;
            if (backgroundImage.includes("url")) {
                let avatarUrl = backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                window.open(avatarUrl, "_blank");
            }
        }
    });
})();