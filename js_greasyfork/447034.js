// ==UserScript==
// @name         iAm Beta
// @namespace    iAm Beta
// @version      1.0.0
// @description  Play YouTube videos from the chat box and/or add custom commands to StumbleChat
// @author       elaw
// @match        https://stumblechat.com/room/eyecandytv*
// @downloadURL https://update.greasyfork.org/scripts/447034/iAm%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/447034/iAm%20Beta.meta.js
// ==/UserScript==
 
// Track the last hour we sent the 4:20 message
let lastSentHour = -1;
// Flag to control sending message only once
let shouldSendMessage = false;
 
// Check every second if it's time to send the 4:20 message
setInterval(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
 
    // If it's exactly HH:20:00 and we haven't sent it this hour
    if (currentMinute === 20 && currentSecond === 0 && lastSentHour !== currentHour && !shouldSendMessage) {
        lastSentHour = currentHour;     // Update the last hour
        shouldSendMessage = true;       // Set flag to trigger message
    }
}, 1000);
 
// Immediately invoked function expression to set up WebSocket behavior and bot logic
(function() {
    // Load saved user nicknames from localStorage or initialize empty object
    let userNicknames = JSON.parse(localStorage.getItem('userNicknames')) || {};
 
    // Save original WebSocket send method
    WebSocket.prototype._send = WebSocket.prototype.send;
 
    // Override WebSocket send method
    WebSocket.prototype.send = function(data) {
        this._send(data); // Send the original data as normal
 
        // Attach listener to handle incoming messages
        this.addEventListener('message', handleMessage.bind(this), false);
 
        // Redefine send to catch subscriptions separately
        this.send = function(data) {
            console.log('send:', data);
            const sendData = safeJSONParse(data);
 
            if (sendData && sendData['stumble'] === 'subscribe') {
                console.log('subscribe caught');
            } else {
                this._send(data);
            }
        };
    };
 
    // Handler for incoming WebSocket messages
    function handleMessage(msg) {
        console.log('<<', msg.data);
        const wsmsg = safeJSONParse(msg.data);
        console.log(wsmsg);
 
        // Track user info when they join the room
        if (wsmsg['stumble'] === 'join' && wsmsg['nick'] && wsmsg['username'] && wsmsg['handle']) {
            const username = wsmsg['username'];
            let nickname = wsmsg['nick'];
            const handle = wsmsg['handle'];
 
            // If name is "guest-####", use username instead
            if (/^guest-\d+$/i.test(nickname)) {
                nickname = username;
            }
 
            // Welcome back message or first-time message
            if (userNicknames[username]) {
                respondWithMessage.call(this, `Welcome back, ${nickname || username} so glad that you returned!`);
            } else {
                respondWithMessage.call(this, `Hiigh, ${nickname || username}!`);
            }
 
            // Store nickname and user data by username and handle
            userNicknames[username] = {
                handle: handle,
                username: username,
                nickname: nickname || username,
                modStatus: wsmsg['mod'] ? "Moderator" : "Regular"
            };
            userNicknames[handle] = {
                handle: handle,
                username: username,
                nickname: nickname || username,
                modStatus: wsmsg['mod'] ? "Moderator" : "Regular"
            };
 
            // Save updated nicknames back to localStorage
            localStorage.setItem('userNicknames', JSON.stringify(userNicknames));
        }
 
        // Send 4:20 message if the flag is set
        if (shouldSendMessage) {
            shouldSendMessage = false; // Reset flag immediately
 
            setTimeout(() => {
                this._send('{"stumble":"msg","text": "🌲 It\'s 4:20 somewhere! Yeen Rolled Up Yet?! Smoke em if you got em! 💨"}');
            }, 1000); // Send message 1 second later
        }
 
        //------------------------------------------------------------------------------------------------------------------
        // Custom Bot Commands
        //------------------------------------------------------------------------------------------------------------------
 
        // .yt command: play YouTube video
        if (wsmsg['text'].startsWith(".yt ")) {
            const query = wsmsg['text'].slice(4).trim();
            if (query) {
                this._send(`{"stumble": "youtube","type": "add","id": "${query}","time": 0}`);
            }
        }
 
        // .me command: say something with your nickname
        if (wsmsg['text'].startsWith(".me ")) {
            const handle = wsmsg['handle'];
            const nickname = userNicknames[handle]?.nickname || "User";
            const message = wsmsg['text'].slice(4).trim();
            respondWithMessage.call(this, `${nickname} ${message}`);
        }
 
        // .commands command: list available bot commands
        if (wsmsg['text'] === ".commands") {
            const commandsList = [
                "- .yt [query] - Play a YouTube video",
                "- .me [message] - Send a message as yourself",
                "- .commands - List all commands"
            ];
 
            // Send each command one at a time
            commandsList.forEach((command, index) => {
                setTimeout(() => {
                    respondWithMessage.call(this, command);
                }, index * 1000);
            });
        }
 
        // ping command: respond with "PONG"
        if (wsmsg['text'] === "ping") {
            setTimeout(() => {
                respondWithMessage.call(this, "PONG");
            }, 1000);
        }
    }
 
    // Example placeholder for future message handling logic
    function handleChatMessage(wsmsg) {
        const { text, handle } = wsmsg;
 
        // Example bot command: .command (does nothing currently)
        if (text === ".command") {
            respondWithMessage.call(this, "result");
        }
    }
 
    // Helper to send a message using the bot
    function respondWithMessage(text) {
        this._send(JSON.stringify({
            stumble: 'msg',
            text
        }));
    }
 
    // Safe JSON parsing with error catching
    function safeJSONParse(jsonString) {
        try {
            return JSON.parse(jsonString); // Try to parse JSON
        } catch (error) {
            console.error('Error parsing JSON:', error); // Log parsing error
            return null; // Return null if invalid JSON
        }
    }
})();