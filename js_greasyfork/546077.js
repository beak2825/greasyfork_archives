// ==UserScript==
// @name         Avatar Açıcılı Çoklu Oda İzleme çalışan
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds watch buttons and room codes to rooms on gartic.io, allows multiple room viewing in non-resizable iframes, resizes chat to a specific size, makes canvas and answers visible, positions user list on the far left, removes logo elements, tools, events, time, hint, denounce button, and mobile-posts. Also opens avatar images in a new tab when clicked.
// @author       schvester
// @match        https://gartic.io/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546077/Avatar%20A%C3%A7%C4%B1c%C4%B1l%C4%B1%20%C3%87oklu%20Oda%20%C4%B0zleme%20%C3%A7al%C4%B1%C5%9Fan.user.js
// @updateURL https://update.greasyfork.org/scripts/546077/Avatar%20A%C3%A7%C4%B1c%C4%B1l%C4%B1%20%C3%87oklu%20Oda%20%C4%B0zleme%20%C3%A7al%C4%B1%C5%9Fan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Styles with refresh button, updated chat, canvas, answers, user list, hint visible with black letters, SOHBET aligned with CEVAPLAR, and answer sized like chat
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        /* Hide unnecessary elements */
        .logo,
        header.game .logo {
            display: none !important;
        }
        #tools,
        .users-tools #tools {
            display: none !important;
        }
        #events,
        #time,
        .denounce,
        #mobile-posts {
            display: none !important;
        }

        /* Ensure hint is visible with black letters */
        #hint {
            display: block !important;
            position: relative;
            background: transparent;
            font-family: 'Baloo Bhaijaan 2', sans-serif;
        }
        #hint button {
            background-color: rgba(26, 26, 45, 0.9);
            color: #0ff;
            border: 2px solid #0ff;
            border-radius: 8px;
            padding: 4px 8px;
            font-size: 14px;
            cursor: pointer;
            text-shadow: 0 0 5px #0ff;
            transition: all 0.3s ease;
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
            font-size: 16px;
            font-weight: bold;
            text-shadow: 0 0 5px #242323;
            margin: 0 2px;
        }
        #hint .line .word span.active {
            color: #000;
            text-shadow: 0 0 5px #0ff, 0 0 10px #0ff;
        }

        /* Chat styling - resized but keeping original layout */
        #chat {
            width: 250px !important;
            height: 225px !important;
            position: relative !important;
            overflow: auto;
            background: transparent;
            border: none;
        }
        #chat .history {
            height: calc(100% - 50px);
            overflow-y: auto;
        }
        #chat .textGame {
            width: 100%;
            box-sizing: border-box;
        }

        /* Answer styling - sized like chat */
        #answer {
            width: 250px !important;
            height: 225px !important;
            position: relative !important;
            overflow: auto;
            background: transparent;
            border: none;
        }
        #answer .history {
            height: calc(100% - 50px);
            overflow-y: auto;
        }

        /* Align SOHBET with CEVAPLAR */
        #screenRoom .ctt #interaction #chat h5,
        #screenRoom .ctt #interaction #answer h5 {
            margin: 0;
            padding: 8px;
            font-size: 16px;
            font-family: 'Baloo Bhaijaan 2', sans-serif;
            color: #fff;
            text-shadow: 0 0 5px #242323;
            background-color: #242323;
            border-radius: 8px 8px 0 0;
            text-align: center;
            line-height: 1.2;
            display: inline-block;
            width: 100%;
            box-sizing: border-box;
        }

        /* Ensure canvas and answers are visible */
        #canvas,
        #drawing,
        #screenRoom .ctt #interaction #answer {
            display: block !important;
        }

        /* User list moved to the left */
        #screenRoom .ctt .users-tools #users {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 200px !important;
            height: 100vh !important;
            z-index: 1100;
            background: rgba(26, 26, 45, 0.9);
            overflow-y: auto;
        }

        /* General body styling */
        body {
            background-image: url('https://www.colorhexa.com/161624.png');
            background-size: cover;
            background-repeat: no-repeat;
            background-attachment: fixed;
            font-family: 'Baloo Bhaijaan 2', sans-serif;
            margin: 0;
            padding: 0;
        }

        /* Room watch buttons */
        .roomwatch {
            border: 2px solid #0ff;
            border-radius: 12px;
            padding: 4px 8px;
            font-size: 14px;
            background-color: rgba(26, 26, 45, 0.9);
            color: #0ff;
            cursor: pointer;
            text-shadow: 0 0 5px #0ff;
            transition: all 0.3s ease;
        }
        .roomwatch:hover {
            background-color: #0ff;
            color: #1a1a2d;
            box-shadow: 0 0 10px #0ff, 0 0 20px #0ff;
        }

        /* Room list styling */
        .rooms .scroll a:not(.emptyList):not(.loading) {
            background-color: #fff0;
            border: 3px solid #242323;
            border-radius: 8px;
            box-shadow: 0 0 10px #242323;
            transition: all 0.3s ease;
            position: relative;
        }
        .rooms .scroll a:not(.emptyList):not(.loading):hover {
            border-color: rgba(0,121,255,0.7);
            box-shadow: 0 0 15px #242323, 0 0 30px #242323;
            transform: scale(1.02);
            background-color: #fff0;
        }
        .rooms .scroll a:not(.emptyList):not(.loading) h5,
        .rooms .scroll a:not(.emptyList):not(.loading) h5 strong,
        .rooms .scroll a:not(.emptyList):not(.loading) .infosRoom > div span:not(.tooltip) {
            color: #fff;
            font-family: 'Baloo Bhaijaan 2', sans-serif;
            text-shadow: 0 0 5px #242323;
        }
        .rooms .scroll a:not(.emptyList):not(.loading).bgEmptyRoom {
            background-color: #fff0;
            border-color: #fff0;
        }
        .rooms .scroll a:not(.emptyList):not(.loading).bgEmptyRoom.selected {
            border-color: #242323;
        }
        .rooms .scroll a:not(.emptyList):not(.loading).bgEmptyRoom:hover {
            border-color: #242323;
        }
        .rooms .scroll a:not(.emptyList):not(.loading) h5 strong {
            margin-right: 5px;
            font-size: 19px;
        }

        /* Room code snippet */
        .room-code-snippet {
            position: absolute;
            top: 5px;
            left: 5px;
            color: #0ff;
            font-family: 'Baloo Bhaijaan 2', sans-serif;
            font-size: 14px;
            font-weight: bold;
            text-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff;
            z-index: 10;
            background: rgba(26, 26, 45, 0.9);
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid #0ff;
            margin: 0;
        }

        /* Interaction area */
        #screenRoom .ctt #interaction {
            margin: 25px 0 0 23px;
            grid-area: c;
            -ms-grid-row: 2;
            -ms-grid-column: 2;
            min-height: 0;
            min-width: 0;
            position: relative;
            display: flex;
            flex-direction: row;
            background-color: transparent;
            border: 1px solid #979797;
            border-radius: 12px;
            box-shadow: 0 1px 4px 0 rgba(0,0,0,.5);
        }
        #screenRoom .ctt #interaction #chat .msg {
            color: #403b3b;
            font-size: 16px;
            line-height: 16px;
            word-break: break-all;
            word-break: break-word;
        }
        @media screen and (max-height: 641px), screen and (max-width: 1151px) {
            #screenRoom .ctt #interaction #chat .msg {
                font-size: 12px;
                line-height: 15px;
            }
        }

        /* User list styling */
        #screenRoom .ctt .users-tools #users .user .infosPlayer .nick {
            color: #fff;
            font-family: 'Baloo Bhaijaan 2', sans-serif;
            font-size: 22px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 1.2;
        }
        #screenRoom .ctt .users-tools #users .user .infosPlayer .points {
            color: #242323;
            font-size: 20px;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-family: 'Baloo Bhaijaan 2', sans-serif;
        }
        #screenRoom .ctt .users-tools #users .user.turn .infosPlayer .nick,
        #screenRoom .ctt .users-tools #users .user.turn .infosPlayer .points {
            color: #242323;
        }
        #screenRoom .ctt .users-tools #users .user.turn::before {
            color: #242323;
        }
        #screenRoom .ctt .users-tools #users .user .avatar {
            box-shadow: 0 0 0 4px #fff;
        }

        /* Other UI elements */
        #screens > div {
            background-color: transparent;
            border: 2px solid #fff;
        }
        #screens .content.bg {
            background-color: transparent;
            border: 1px solid #5d8899;
            border-radius: 15px;
        }
        .scrollElements {
            background-image: url('https://www.colorhexa.com/1e2a38.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
        #background::before {
            display: none;
        }
        h3 {
            color: #242323;
        }
        .home .anonymus .fieldset label::before,
        .home .anonymus .fieldset span::before,
        .home .logged .fieldset label::before,
        .home .logged .fieldset span::before {
            color: #242323;
            font-size: 24px;
            margin: 0 10px 0 0;
        }
        .home .anonymus .containerForm span,
        .home .logged .containerForm span {
            font-family: NunitoBold;
            font-size: 15px;
            color: #fff;
            padding: 0 15px 0 0;
        }
        .home .login .advantagesLogin span p,
        .home .or span,
        .legend,
        #screens .title .filter .language,
        #screens .title .filter .subject,
        #screens .title .filter .language strong,
        #screens .title .filter .subject strong {
            color: #fff;
        }
        #screens .title .filter .language:hover,
        #screens .title .filter .subject:hover,
        #screens .title .filter .language:hover strong,
        #screens .title .filter .subject:hover strong {
            color: #fff;
        }
        #screens .title .filter .optionsFilter > div {
            background-color: #000000e5;
            border: 0px solid #868d96;
            box-shadow: 0 7px 5px 0 rgba(0,0,0,.2);
            border-radius: 10px;
        }
        #screens .title .filter .optionsFilter > div .hotOnes .choice button.active,
        #screens .title .filter .optionsFilter > div .hotOnes .choice button:hover,
        #screens .title .filter .optionsFilter > div .regularOnes .choice button.active,
        #screens .title .filter .optionsFilter > div .regularOnes .choice button:hover {
            background-color: #242323;
        }
        .home .exit,
        .btAdd button,
        .btAdd input[type="submit"] {
            background-color: #242323;
            border: none;
        }
        .home .exit:hover,
        .btAdd button:hover,
        .btAdd input[type="submit"]:hover {
            background-color: #242323;
        }
        .createRoom .globalSettings,
        .createRoom .themes .subject,
        .suggestion {
            background-color: #000000b8;
        }
        .createRoom .themes .selectTheme ul li:not(.emptyList) {
            background-color: #000000a8;
            border: 0px solid #fff;
        }
        .createRoom .themes .selectTheme ul li:not(.emptyList):hover {
            border: 2px solid #fff;
            background-color: #000000a8;
        }
        .createRoom .globalSettings .legend {
            flex: 1;
            font-family: NunitoBold;
            font-size: 14px;
            color: #fff;
            margin: 0 10px 0 0;
        }
        .createRoom .globalSettings .fieldset::before {
            color: #242323;
        }
        .switchFieldCheck input[type="checkbox"]:checked + label {
            background-color: #242323;
        }
        .home .anonymus .fieldset.nick input,
        .home .logged .fieldset.nick input,
        .select select {
            background-color: #00000063;
            color: #fff;
        }
        input[type="email"],
        input[type="text"] {
            border: 1px solid #fff;
            font-family: NunitoBold;
            font-size: 18px;
            background-color: #0000;
            color: #fff;
        }
        input[type="email"]:placeholder-shown,
        input[type="text"]:placeholder-shown {
            background-color: #0000;
        }
        input[type="email"]:disabled,
        input[type="text"]:disabled {
            background-color: #fff0;
        }
        .home .lastRooms > div ul li:not(.emptyList):not(.empty).bgEmptyRoom {
            background-color: #000000c7;
            border-color: #0000;
        }
        .home .lastRooms > div ul li:not(.emptyList):not(.empty) > span {
            background-color: rgba(0, 0, 0, 0.76);
            color: #242323;
        }
        .home .lastRooms > div ul li:not(.emptyList):not(.empty) {
            background-color: #00000063;
            border: 2px solid #fff;
        }
        #popUp .content {
            background-color: #000000b0;
            border: 1px solid #979797;
        }
        #popUp .content.profile .contentPopup .nick {
            color: #242323;
        }
        .contribute {
            display: none;
        }

        /* Viewer window styling */
        .viewer-initialized body {
            background-color: #0d0e1c;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
            margin: 0;
            padding: 0;
            overflow: auto;
        }
        .resizable-iframe {
            position: relative;
            width: 870px;
            height: 560px;
            border: 2px solid #242323;
            border-radius: 8px;
            box-shadow: 0 0 10px #242323, 0 0 20px #242323;
        }
        .resizable-iframe iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        .close-button {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 24px;
            height: 24px;
            background-color: #242323;
            color: #fff;
            text-align: center;
            line-height: 24px;
            font-size: 18px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10;
            text-shadow: 0 0 5px #fff;
            border: 1px solid #fff;
        }
        .close-button:hover {
            background-color: #242323;
            color: #fff;
            box-shadow: 0 0 10px #242323;
        }
        .room-code {
            position: absolute;
            bottom: 5px;
            left: 5px;
            color: #fff;
            font-family: 'Baloo Bhaijaan 2', sans-serif;
            font-size: 16px;
            font-weight: bold;
            text-shadow: 0 0 5px #242323, 0 0 10px #242323, 0 0 15px #242323;
            z-index: 10;
        }
        .room-sidebar {
            position: fixed;
            right: 0;
            top: 0;
            width: 250px;
            height: 100vh;
            background: rgba(26, 26, 45, 0.9);
            z-index: 1200;
            overflow-y: auto;
            padding: 10px;
            box-shadow: -5px 0 10px rgba(0, 0, 0, 0.5);
            font-family: 'Baloo Bhaijaan 2', sans-serif;
        }
        .room-sidebar h3 {
            color: #0ff;
            text-shadow: 0 0 5px #0ff;
            font-size: 18px;
            margin: 10px 0;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .room-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
            margin: 5px 0;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid #0ff;
            border-radius: 5px;
        }
        .room-item span {
            color: #fff;
            font-size: 14px;
            text-shadow: 0 0 3px #0ff;
        }
        .room-item .viewer-btn {
            border: 2px solid #0ff;
            border-radius: 8px;
            padding: 2px 6px;
            font-size: 12px;
            background-color: rgba(26, 26, 45, 0.9);
            color: #0ff;
            cursor: pointer;
            text-shadow: 0 0 5px #0ff;
            transition: all 0.3s ease;
        }
        .room-item .viewer-btn:hover {
            background-color: #0ff;
            color: #1a1a2d;
            box-shadow: 0 0 10px #0ff;
        }
        .refresh-btn {
            border: 2px solid #0ff;
            border-radius: 8px;
            padding: 2px 6px;
            font-size: 12px;
            background-color: rgba(26, 26, 45, 0.9);
            color: #0ff;
            cursor: pointer;
            text-shadow: 0 0 5px #0ff;
            transition: all 0.3s ease;
        }
        .refresh-btn:hover {
            background-color: #0ff;
            color: #1a1a2d;
            box-shadow: 0 0 10px #0ff;
        }

        /* Scrollbar styles */
        ::-webkit-scrollbar {
            width: 10px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: rgb(30, 42, 56);
            border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgb(30, 42, 56);
        }
        scrollbar-width: thin;
        scrollbar-color: rgb(30, 42, 56) transparent;

        /* Custom anima style */
        .anima {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100px;
            height: 100px;
            background: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80') no-repeat center;
            background-size: contain;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2000;
        }
    `;
    document.head.appendChild(style);

    // Add numbering to userlist avatars
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
                            left: -25px;
                            color: #fff;
                            font-family: 'Baloo Bhaijaan 2', sans-serif;
                            font-size: 18px;
                            font-weight: bold;
                            text-shadow: 0 0 5px #242323;
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
    setInterval(updateUserList, 1000); // Update every second to catch dynamic changes

    // Add room watch buttons and code snippets on main page
    setInterval(function() {
        const scrollElements = document.getElementsByClassName("scrollElements")[0];
        if (!scrollElements) return;

        for (let x of scrollElements.getElementsByTagName("a")) {
            if (!x.querySelector(".roomwatch")) {
                const roomLink = x.href;
                x.innerHTML += `<input class="roomwatch" type="button" value="watch" onclick="openViewerWindow('${roomLink}/viewer')">`;
            }
            if (!x.querySelector(".room-code-snippet")) {
                const roomCode = x.href.match(/gartic\.io\/([a-zA-Z0-9]+)/)?.[1] || 'Unknown';
                const roomCodeElement = document.createElement('h5');
                roomCodeElement.className = 'room-code-snippet';
                roomCodeElement.textContent = `ODA KODU: ${roomCode}`;
                roomCodeElement.setAttribute('data-ignore', 'true');
                x.style.position = 'relative';
                x.insertBefore(roomCodeElement, x.firstChild);
            }
        }
    }, 1000);

    // Updated openViewerWindow with refresh button
    window.openViewerWindow = function(url) {
        const viewerWindow = window.open('', 'viewerWindow') || window;
        if (viewerWindow) {
            if (!viewerWindow.document.body.classList.contains('viewer-initialized')) {
                viewerWindow.document.body.innerHTML = `
                    <div id="viewerContainer" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(870px, 1fr)); gap: 10px; padding: 10px 260px 10px 10px; height: 100vh; margin: 0;"></div>
                    <div id="roomSidebar" class="room-sidebar">
                        <h3>Oda Listesi</h3>
                        <button class="refresh-btn">Yenile</button>
                        <div id="roomList"></div>
                    </div>
                `;
                const viewerStyle = viewerWindow.document.createElement('style');
                viewerStyle.innerHTML = `
                    body {
                        background-color: #0d0e1c;
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                        background-attachment: fixed;
                        margin: 0;
                        padding: 0;
                        overflow: auto;
                        position: relative;
                        zoom: 67% !important;
                        -moz-transform: scale(0.67);
                        -moz-transform-origin: top left;
                    }
                    body::before {
                        content: "";
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        z-index: -1;
                    }
                    .resizable-iframe {
                        position: relative;
                        width: 870px;
                        height: 560px;
                        border: 2px solid #242323;
                        border-radius: 8px;
                        box-shadow: 0 0 10px #242323, 0 0 20px #242323;
                    }
                    .resizable-iframe iframe {
                        width: 100%;
                        height: 100%;
                        border: none;
                    }
                    .close-button {
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        width: 24px;
                        height: 24px;
                        background-color: #242323;
                        color: #fff;
                        text-align: center;
                        line-height: 24px;
                        font-size: 18px;
                        border-radius: 50%;
                        cursor: pointer;
                        z-index: 10;
                        text-shadow: 0 0 5px #fff;
                        border: 1px solid #fff;
                    }
                    .close-button:hover {
                        background-color: #242323;
                        color: #fff;
                        box-shadow: 0 0 10px #242323;
                    }
                    .room-code {
                        position: absolute;
                        bottom: 5px;
                        left: 5px;
                        color: #fff;
                        font-family: 'Baloo Bhaijaan 2', sans-serif;
                        font-size: 16px;
                        font-weight: bold;
                        text-shadow: 0 0 5px #242323, 0 0 10px #242323, 0 0 15px #242323;
                        z-index: 10;
                    }
                    .room-sidebar {
                        position: fixed;
                        right: 0;
                        top: 0;
                        width: 250px;
                        height: 100vh;
                        background: rgba(26, 26, 45, 0.9);
                        z-index: 1200;
                        overflow-y: auto;
                        padding: 10px;
                        box-shadow: -5px 0 10px rgba(0, 0, 0, 0.5);
                        font-family: 'Baloo Bhaijaan 2', sans-serif;
                    }
                    .room-sidebar h3 {
                        color: #0ff;
                        text-shadow: 0 0 5px #0ff;
                        font-size: 18px;
                        margin: 10px 0;
                        text-align: center;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .room-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 5px;
                        margin: 5px 0;
                        background: rgba(0, 0, 0, 0.5);
                        border: 1px solid #0ff;
                        border-radius: 5px;
                    }
                    .room-item span {
                        color: #fff;
                        font-size: 14px;
                        text-shadow: 0 0 3px #0ff;
                    }
                    .room-item .viewer-btn {
                        border: 2px solid #0ff;
                        border-radius: 8px;
                        padding: 2px 6px;
                        font-size: 12px;
                        background-color: rgba(26, 26, 45, 0.9);
                        color: #0ff;
                        cursor: pointer;
                        text-shadow: 0 0 5px #0ff;
                        transition: all 0.3s ease;
                    }
                    .room-item .viewer-btn:hover {
                        background-color: #0ff;
                        color: #1a1a2d;
                        box-shadow: 0 0 10px #0ff;
                    }
                    .refresh-btn {
                        border: 2px solid #0ff;
                        border-radius: 8px;
                        padding: 2px 6px;
                        font-size: 12px;
                        background-color: rgba(26, 26, 45, 0.9);
                        color: #0ff;
                        cursor: pointer;
                        text-shadow: 0 0 5px #0ff;
                        transition: all 0.3s ease;
                    }
                    .refresh-btn:hover {
                        background-color: #0ff;
                        color: #1a1a2d;
                        box-shadow: 0 0 10px #0ff;
                    }
                    /* Scrollbar styles */
                    ::-webkit-scrollbar {
                        width: 10px;
                    }
                    ::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: rgb(30, 42, 56);
                        border-radius: 5px;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: rgb(30, 42, 56);
                    }
                    scrollbar-width: thin;
                    scrollbar-color: rgb(30, 42, 56) transparent;
                `;
                viewerWindow.document.head.appendChild(viewerStyle);
                viewerWindow.document.body.classList.add('viewer-initialized');

                // Define openViewerWindow inside the viewerWindow context
                viewerWindow.openViewerWindow = function(url) {
                    const roomCode = url.split('/').slice(-2)[0];
                    const viewerContainer = viewerWindow.document.getElementById('viewerContainer');
                    const iframeContainer = viewerWindow.document.createElement('div');
                    iframeContainer.className = 'resizable-iframe';
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

                // Add refresh functionality
                const refreshButton = viewerWindow.document.querySelector('.refresh-btn');
                if (refreshButton) {
                    refreshButton.addEventListener('click', function() {
                        const roomList = viewerWindow.document.getElementById('roomList');
                        if (roomList && window.location.hostname === 'gartic.io') {
                            const scrollElements = document.getElementsByClassName("scrollElements")[0];
                            if (scrollElements) {
                                const rooms = scrollElements.getElementsByTagName("a");
                                roomList.innerHTML = ''; // Clear existing list
                                for (let x of rooms) {
                                    const roomCode = x.href.match(/gartic\.io\/([a-zA-Z0-9]+)/)?.[1] || 'Unknown';
                                    const roomItem = viewerWindow.document.createElement('div');
                                    roomItem.className = 'room-item';
                                    roomItem.innerHTML = `
                                        <span>${roomCode}</span>
                                        <button class="viewer-btn" onclick="openViewerWindow('https://gartic.io/${roomCode}/viewer')">Viewer</button>
                                    `;
                                    roomList.appendChild(roomItem);
                                }
                            }
                        }
                    });
                }
            }

            // Initial room load
            const roomCode = url.split('/').slice(-2)[0];
            viewerWindow.openViewerWindow(url);

            // Populate sidebar with room codes
            const roomList = viewerWindow.document.getElementById('roomList');
            if (roomList && window.location.hostname === 'gartic.io') {
                const scrollElements = document.getElementsByClassName("scrollElements")[0];
                if (scrollElements) {
                    const rooms = scrollElements.getElementsByTagName("a");
                    roomList.innerHTML = ''; // Clear existing list
                    for (let x of rooms) {
                        const roomCode = x.href.match(/gartic\.io\/([a-zA-Z0-9]+)/)?.[1] || 'Unknown';
                        const roomItem = viewerWindow.document.createElement('div');
                        roomItem.className = 'room-item';
                        roomItem.innerHTML = `
                            <span>${roomCode}</span>
                            <button class="viewer-btn" onclick="openViewerWindow('https://gartic.io/${roomCode}/viewer')">Viewer</button>
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