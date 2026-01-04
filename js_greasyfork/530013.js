// ==UserScript==
// @name         Anime Academy Debugger
// @namespace    http://tampermonkey.net/
// @version      1.15.2
// @description  Log chat events with spam module and socket ID display
// @author       Asriel
// @license      MIT
// @match        https://anime.academy/chat*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530013/Anime%20Academy%20Debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/530013/Anime%20Academy%20Debugger.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let spamInterval = null;

    // Main Debugger Container
    const debugContainer = document.createElement('div');
    Object.assign(debugContainer.style, {
        position: 'fixed', bottom: '10px', right: '10px', width: '800px', height: '450px',
        backgroundColor: '#1e1e1e', color: '#f0f0f0', border: '1px solid #333',
        borderRadius: '5px', padding: '10px', zIndex: '10000', overflow: 'hidden', resize: 'both',
        display: 'flex', flexDirection: 'column'
    });

    // Draggable Title Bar
    const titleBar = document.createElement('div');
    Object.assign(titleBar.style, {
        padding: '5px', backgroundColor: '#333', color: '#f0f0f0', fontWeight: 'bold',
        textAlign: 'center', flexShrink: 0, borderBottom: '1px solid #555', cursor: 'grab'
    });
    titleBar.innerHTML = 'Anime Academy Debugger (Drag to Move)';
    debugContainer.appendChild(titleBar);

    // Dragging Logic
    let isDragging = false, startX, startY, startLeft, startTop;

    titleBar.onmousedown = (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = debugContainer.offsetLeft;
        startTop = debugContainer.offsetTop;
        document.onmousemove = (e) => {
            if (isDragging) {
                debugContainer.style.left = `${startLeft + (e.clientX - startX)}px`;
                debugContainer.style.top = `${startTop + (e.clientY - startY)}px`;
            }
        };
        document.onmouseup = () => {
            isDragging = false;
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    // Content Wrapper
    const contentWrapper = document.createElement('div');
    Object.assign(contentWrapper.style, {
        display: 'flex', flexDirection: 'row', gap: '10px', flexGrow: 1, overflow: 'hidden', padding: '10px'
    });

    // Logger Section
    const logSection = document.createElement('div');
    Object.assign(logSection.style, { flex: '1', overflow: 'auto', borderRight: '1px solid #555', paddingRight: '10px' });

    const logContent = document.createElement('div');
    Object.assign(logContent.style, { display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'auto', height: '100%' });

    ['DOM', 'EMIT', 'RECV'].forEach(type => {
        const section = document.createElement('div');
        Object.assign(section.style, { borderTop: '1px solid #555', paddingTop: '5px' });

        const header = document.createElement('div');
        Object.assign(header.style, { fontWeight: 'bold', marginBottom: '4px' });
        header.textContent = `${type} Events:`;
        section.appendChild(header);

        const content = document.createElement('pre');
        Object.assign(content.style, {
            whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: '0', maxHeight: '100px', overflowY: 'auto', padding: '4px', backgroundColor: '#2a2a2a', borderRadius: '3px'
        });
        content.setAttribute('data-type', type);
        section.appendChild(content);
        logContent.appendChild(section);
    });

    logSection.appendChild(logContent);

    // Socket ID Display Inside Debugger (Below RECV Events)
    const socketIdField = document.createElement('div');
    Object.assign(socketIdField.style, {
        marginTop: '10px', padding: '5px',
        backgroundColor: '#2a2a2a', color: '#ffffff', fontWeight: 'bold',
        textAlign: 'center', borderRadius: '3px', border: '1px solid #555'
    });
    socketIdField.textContent = 'Socket ID: Waiting...';
    logSection.appendChild(socketIdField);

    contentWrapper.appendChild(logSection);

    // Spam Control Section
    const spamControls = document.createElement('div');
    Object.assign(spamControls.style, { flex: '1', paddingLeft: '10px' });

    const msgInput = document.createElement('input');
    msgInput.placeholder = 'Your spam message here';
    Object.assign(msgInput.style, { width: '100%', boxSizing: 'border-box', marginBottom: '5px' });

    const startSpamBtn = document.createElement('button');
    startSpamBtn.textContent = 'Start Spam';
    Object.assign(startSpamBtn.style, { width: '48%', marginTop: '5px', backgroundColor: '#f00', color: '#fff' });

    const stopSpamBtn = document.createElement('button');
    stopSpamBtn.textContent = 'Stop Spam';
    Object.assign(stopSpamBtn.style, { width: '48%', marginTop: '5px', backgroundColor: '#555', color: '#fff' });

    startSpamBtn.onclick = () => {
        if (spamInterval) return;
        spamInterval = setInterval(() => sendSpamMessage(), 500); // Adjust speed here
    };

    stopSpamBtn.onclick = () => {
        clearInterval(spamInterval);
        spamInterval = null;
    };

    function sendSpamMessage() {
        if (!window.mySocket) return alert('Socket connection not found.');

        const message = {
            chatLine: msgInput.value || 'Spam Message',
            timestamp: Date.now()
        };
        window.mySocket.emit('newChatLine', message);
    }

    spamControls.append(msgInput, startSpamBtn, stopSpamBtn);
    contentWrapper.appendChild(spamControls);

    debugContainer.appendChild(contentWrapper);
    document.body.appendChild(debugContainer);

    function updateSocketId() {
        if (window.mySocket && window.mySocket.id) {
            socketIdField.textContent = `Socket ID: ${window.mySocket.id}`;
        } else {
            socketIdField.textContent = 'Socket ID: Not Connected';
        }
    }

    function initializeSocket() {
        if (!window.io || !window.io.connect) {
            console.error("Socket.IO not found!");
            return;
        }

        if (!window.mySocket) {
            console.log("Creating new socket instance...");
            window.mySocket = io.connect();

            window.mySocket.on('connect', () => {
                console.log("Socket connected, updating ID...");
                updateSocketId();
            });

            window.mySocket.on('disconnect', () => {
                console.log("Socket disconnected...");
                updateSocketId();
            });
        }
    }

    if (window.io && window.io.Socket && window.io.sockets) {
        window.mySocket = window.io.sockets[Object.keys(window.io.sockets)[0]];
    }

    setTimeout(initializeSocket, 2000);
    setInterval(updateSocketId, 1000);

    function logEvent(message, type = 'INFO') {
        const content = logContent.querySelector(`pre[data-type="${type}"]`);
        const time = new Date().toLocaleTimeString();
        content.textContent += `[${time}] ${message}\n`;
    }

    const origEmit = window.io.Socket.prototype.emit;
    window.io.Socket.prototype.emit = function (event, ...args) {
        if (!window.mySocket) window.mySocket = this;
        logEvent(`Emit: ${event}, Args: ${JSON.stringify(args)}`, 'EMIT');
        updateSocketId();
        return origEmit.apply(this, [event, ...args]);
    };

    const origOn = window.io.Socket.prototype.on;
    window.io.Socket.prototype.on = function (event, callback) {
        return origOn.call(this, event, function (...args) {
            logEvent(`Receive: ${event}, Data: ${JSON.stringify(args)}`, 'RECV');
            updateSocketId();
            callback.apply(this, args);
        });
    };

})();
