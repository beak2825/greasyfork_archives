// ==UserScript==
// @name         Chat Improvements
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @license      GPL-3.0
// @description  Simple chat quality improvements
// @author       kamarov
// @match        https://tanktrouble.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://update.greasyfork.org/scripts/482092/1297984/TankTrouble%20Development%20Library.js
// @downloadURL https://update.greasyfork.org/scripts/527132/Chat%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/527132/Chat%20Improvements.meta.js
// ==/UserScript==

GM_addStyle(`
@keyframes disappear {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.clearChat-button {
    cursor: pointer;
    position: absolute;
    top: 40px;
    right: -15px;
    background: none;
    box-shadow: none;
}
.muteGlobalChat-button {
    cursor: pointer;
    position: absolute;
    top: 70px;
    right: -15px;
    background: none;
    box-shadow: none;
}
.commands-button {
    cursor: pointer;
    position: absolute;
    top: 100px;
    right: -15px;
    background: none;
    box-shadow: none;
}
.plus-button {
    cursor: pointer;
    position: absolute;
    top: 160px;
    left: 267px;
}
.minus-button {
    cursor: pointer;
    position: absolute;
    top: 177px;
    left: 267px;
}
#chat:not(.open) .clearChat-button,
#chat:not(.open) .muteGlobalChat-button,
#chat:not(.open) .commands-button,
#chat:not(.open) .plus-Button,
#chat:not(.open) .minus-Button {
    animation: disappear 0.3s cubic-bezier(0.79, 0.02, 0.32, 0.98) forwards;
}
#chat:is(.opening, .open) .clearChat-button,
#chat:is(.opening, .open) .muteGlobalChat-button,
#chat:is(.opening, .open) .commands-button,
#chat:is(.opening, .open) .plus-Button,
#chat:is(.opening, .open) .minus-Button {
    animation: appear 0.3s cubic-bezier(0.79, -0.02, 0.32, 0.98) forwards;
}

`);

(function() {
    whenContentInitialized().then(() => {
        const container = document.querySelector('#chat');
        if (!container) return;

        const clearButton = createButton('clearChat-button', 'https://i.imgur.com/f0bzcXU.png', 'Clear Chat');
        const muteButton = createButton('muteGlobalChat-button', 'https://i.imgur.com/yJR2Mma.png', 'Mute Global Chat');
        const ignoreButton = createButton('commands-button', 'https://i.imgur.com/PA2XOf0.png', 'Commands');

        //const plusButton = createButton('plus-button', 'https://i.imgur.com/G9so5yS.png', '+');
        //const minusButton = createButton('minus-button', 'https://i.imgur.com/AJ9FuAn.png', '-');

        // Append buttons to the container
        container.appendChild(clearButton);
        container.appendChild(muteButton);
        container.appendChild(ignoreButton);


        // Add event listeners for each button
        clearButton.addEventListener('click', clearChat);
        muteButton.addEventListener('click', toggleMuteGlobalChat);
        ignoreButton.addEventListener('click', showCommands);

        // Mute chat state variable
        let isGlobalMuted = false;

        // Function to create button elements dynamically
        function createButton(className, imageUrl, altText) {
            const button = document.createElement('div');
            button.classList.add(className);
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = altText;
            img.style.width = '30px';
            img.style.height = '28px';
            button.appendChild(img);
            return button;
        }

        // Function to mute global chat
        function toggleMuteGlobalChat() {
            const globalMuteElement = document.getElementById("globalMuteSupport");

            if (isGlobalMuted) {
                if (globalMuteElement) {
                    globalMuteElement.innerHTML = "";
                    globalMuteElement.remove();
                }
                const globalMuteSupport = document.createElement("script");
                globalMuteSupport.innerHTML = `
                    TankTrouble.ChatBox.addGlobalChatMessage=function(from,message,chatMessageId){
                        var playerIds=from;
                        this._lookUpUsernamesAndAddChatMessage(from,null,false,"#68c5ff","#333333",message,chatMessageId);
                    };
                    TankTrouble.ChatBox.addSystemMessage(0, "Global chat unmuted");
                `;
                globalMuteSupport.id = "globalMuteSupport";
                document.head.appendChild(globalMuteSupport);
                isGlobalMuted = false;
            } else {
                if (globalMuteElement) {
                    globalMuteElement.innerHTML = "";
                    globalMuteElement.remove();
                }
                const globalMuteSupport = document.createElement("script");
                globalMuteSupport.innerHTML = `
                    TankTrouble.ChatBox.addGlobalChatMessage=function(from,message,chatMessageId){
                        console.log(String(from)+": "+message);
                    };
                    TankTrouble.ChatBox.addSystemMessage(0, "Global chat muted");
                `;
                globalMuteSupport.id = "globalMuteSupport";
                document.head.appendChild(globalMuteSupport);
                isGlobalMuted = true;
            }

            // Toggle mute button icon
            const muteImg = muteButton.querySelector('img');
            if (muteImg.src === 'https://i.imgur.com/yJR2Mma.png') {
                muteImg.src = 'https://i.imgur.com/pIVI6lx.png';
            } else {
                muteImg.src = 'https://i.imgur.com/yJR2Mma.png';
            }
        }

        // Function to show existing commands
        function showCommands() {
            TankTrouble.ChatBox.addSystemMessage(0, " /u - Undo ignore command");
            TankTrouble.ChatBox.addSystemMessage(0, " /i - Ignore command");
            TankTrouble.ChatBox.addSystemMessage(0, "Commands:");
        }

        // Function to clear chat
        function clearChat() {
            const chatMessages = document.querySelectorAll('.chatMessage');
            chatMessages.forEach((message) => {
                message.style.transition = 'opacity 0.1s';
                message.style.opacity = '0';
                setTimeout(() => {
                    message.remove();
                }, 300);
            });
            TankTrouble.ChatBox.addSystemMessage(0, "Chat cleared");
        }

        // Update button visibility based on chat state
        const chatElement = document.querySelector('#chat');
        updateButtonVisibility();

        setInterval(() => {
            updateButtonVisibility();
        }, 600);

        function updateButtonVisibility() {
            if (chatElement.classList.contains('open')) {
                clearButton.style.display = 'block';
                muteButton.style.display = 'block';
                ignoreButton.style.display = 'block';
            } else {
                clearButton.style.display = 'none';
                muteButton.style.display = 'none';
                ignoreButton.style.display = 'none';
            }
        }
    });
})();
