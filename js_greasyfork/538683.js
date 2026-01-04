Tabs.Chat = {
    tabOrder: 900,
    tabLabel: 'Chat',
    tabDisabled: false,
    myDiv: null,
    chatDiv: null,
    userListDiv: null,
    inputDiv: null,
    currentChatType: 'global',
    globalChatDiv: null,
    allianceChatDiv: null,
    globalChatMessages: [],
    allianceChatMessages: [],

    init: function(div) {
        var t = Tabs.Chat;
        t.myDiv = div;
        t.createMainDiv();
        t.hookGameChat();
        t.updateUserList();
    },

    createMainDiv: function() {
        var t = Tabs.Chat;
        var m = '<DIV class=divHeader align=center>' + tx('CHAT ROOM') + '</div>';

        // Chat type selection buttons
        m += '<div style="display:flex;">';
        m += '<button id="pbGlobalChatTab" class="tabActive" style="flex:1;">Global Chat</button>';
        m += '<button id="pbAllianceChatTab" style="flex:1;">Alliance Chat</button>';
        m += '</div>';

        m += '<div id="pbChatRoom" style="display:flex; height:500px; border:1px solid #888;">';
        m += '<div id="pbUserList" style="width:150px; border-right:1px solid #888; overflow-y:auto;"></div>';
        m += '<div style="flex-grow:1; display:flex; flex-direction:column;">';
        m += '<div id="pbGlobalChatContent" style="flex-grow:1; overflow-y:auto; padding:10px;"></div>';
        m += '<div id="pbAllianceChatContent" style="flex-grow:1; overflow-y:auto; padding:10px; display: none;"></div>'; // Hidden by default
        m += '<div id="pbChatInput" style="border-top:1px solid #888; padding:10px;"></div>';
        m += '</div>';
        m += '</div>';

        t.myDiv.innerHTML = m;

        t.globalChatDiv = ById('pbGlobalChatContent');
        t.allianceChatDiv = ById('pbAllianceChatContent');
        t.userListDiv = ById('pbUserList');
        t.inputDiv = ById('pbChatInput');

        ById('pbGlobalChatTab').addEventListener('click', function() { t.switchChatType('global'); });
        ById('pbAllianceChatTab').addEventListener('click', function() { t.switchChatType('alliance'); });

        t.cloneGameChatInput();
        t.updateChat('global'); // Initial update for global chat
        t.updateChat('alliance'); // Initial update for alliance chat
    },

    hookGameChat: function() {
        var t = Tabs.Chat;
        var gameGlobalChatContainer = document.querySelector('#mod_comm_list1');
        var gameAllianceChatContainer = document.querySelector('#mod_comm_list2');

        if (gameGlobalChatContainer && gameAllianceChatContainer) {
            var observerGlobal = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                t.addChatMessage(node.innerHTML, 'global');
                            }
                        });
                    }
                });
            });

            var observerAlliance = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                t.addChatMessage(node.innerHTML, 'alliance');
                            }
                        });
                    }
                });
            });

            observerGlobal.observe(gameGlobalChatContainer, { childList: true, subtree: true });
            observerAlliance.observe(gameAllianceChatContainer, { childList: true, subtree: true });
        } else {
            console.error('Could not find game chat containers');
        }
    },

    addChatMessage: function(messageHTML, chatType) {
        var t = Tabs.Chat;
        var messageDiv = document.createElement('div');
        messageDiv.innerHTML = messageHTML;

        if (chatType === 'global') {
            t.globalChatMessages.push(messageDiv);
        } else {
            t.allianceChatMessages.push(messageDiv);
        }

        t.updateChat(chatType);
    },

    updateChat: function(chatType) {
        var t = Tabs.Chat;
        var targetDiv = (chatType === 'global') ? t.globalChatDiv : t.allianceChatDiv;
        var messages = (chatType === 'global') ? t.globalChatMessages : t.allianceChatMessages;

        if (targetDiv) {
            targetDiv.innerHTML = ''; // Clear existing messages
            messages.forEach(function(messageDiv) {
                targetDiv.appendChild(messageDiv);
            });
            targetDiv.scrollTop = targetDiv.scrollHeight;
        }
    },

    cloneGameChatInput: function() {
        var t = Tabs.Chat;
        var gameChatInput = document.querySelector('#mod_comm_input');
        if (gameChatInput) {
            var inputClone = gameChatInput.cloneNode(true);
            t.inputDiv.appendChild(inputClone);

            var chatTextArea = t.inputDiv.querySelector('textarea');
            var sendButton = t.inputDiv.querySelector('button');

            if (chatTextArea && sendButton) {
                chatTextArea.style.width = '100%';
                sendButton.style.width = '100%';
                sendButton.style.marginTop = '5px';

                chatTextArea.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        t.sendChat();
                    }
                });

                sendButton.addEventListener('click', function() {
                    t.sendChat();
                });
            }
        } else {
            console.error('Could not find game chat input');
        }
    },

    sendChat: function() {
        var t = Tabs.Chat;
        var chatTextArea = t.inputDiv.querySelector('textarea');
        var gameChatTextArea = document.querySelector('#mod_comm_input textarea');
        var gameSendButton = document.querySelector('#mod_comm_input button');
        var gameChatTypeSelector = document.querySelector('#mod_comm_tabs');

        if (chatTextArea && gameChatTextArea && gameSendButton && gameChatTypeSelector) {
            var message = chatTextArea.value.trim();
            if (message !== '') {
                // Set the correct chat type in the game's interface
                if (t.currentChatType === 'global') {
                    gameChatTypeSelector.selectedIndex = 0; // Assuming 0 is for global chat
                } else if (t.currentChatType === 'alliance') {
                    gameChatTypeSelector.selectedIndex = 1; // Assuming 1 is for alliance chat
                }

                gameChatTextArea.value = message;
                gameSendButton.click();
                chatTextArea.value = '';
            }
        } else {
            console.error('Could not find necessary elements to send chat');
        }
    },

    updateUserList: function() {
        var t = Tabs.Chat;
        // This is a placeholder function. You'll need to implement the actual user list retrieval
        // based on how your game manages online users.
        var onlineUsers = ['User1', 'User2', 'User3']; // Replace with actual online users

        var userListHTML = '<div class="divHeader">Online Users</div>';
        onlineUsers.forEach(function(user) {
            userListHTML += '<div class="chatUser">' + user + '</div>';
        });

        t.userListDiv.innerHTML = userListHTML;

        // Update the user list periodically
        setTimeout(t.updateUserList, 60000); // Update every minute
    },

    switchChatType: function(chatType) {
        var t = Tabs.Chat;
        t.currentChatType = chatType;

        if (chatType === 'global') {
            t.globalChatDiv.style.display = 'block';
            t.allianceChatDiv.style.display = 'none';
            ById('pbGlobalChatTab').className = 'tabActive';
            ById('pbAllianceChatTab').className = '';
        } else {
            t.globalChatDiv.style.display = 'none';
            t.allianceChatDiv.style.display = 'block';
            ById('pbGlobalChatTab').className = '';
            ById('pbAllianceChatTab').className = 'tabActive';
        }

        t.updateChat(chatType); // Update the chat display when switching types
    }
};