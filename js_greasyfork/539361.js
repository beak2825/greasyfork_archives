Tabs.Chat = {
    tabOrder: 900,
    tabLabel: 'Chat',
    tabDisabled: false,
    myDiv: null,
    chatDiv: null,
    inputDiv: null,
    controlsDiv: null,
    currentChatType: 'global',
    originalInputContainer: null,
    originalControlsContainer: null,

    init: function (div) {
        var t = Tabs.Chat;
        t.myDiv = div;
        t.createMainDiv();
        t.hookGameChat();
        t.setupChatTabs();
    },

    createMainDiv: function () {
        var t = Tabs.Chat;
        var m = '<DIV class=divHeader align=center>CHAT</div>';

        // Create tab buttons similar to the game's interface
        m += '<div style="background-color:#e8d6b0; padding:5px; border-bottom:1px solid #886;">';
        m += '<button id="pbGlobalChatTab" class="tab selected" style="margin-right:5px;">Global Chat</button>';
        m += '<button id="pbAllianceChatTab" class="tab">Alliance Chat</button>';
        m += '</div>';

        // Chat content area
        m += '<div id="pbChatContent" style="height:380px; overflow-y:auto; background-color:#f9f2dd; padding:5px;"></div>';
        
        // Chat rules
        m += '<div id="pbChatRules" style="padding:5px; background-color:#f9f2dd; border-top:1px solid #886;">';
        m += 'Chat Rules: No bad language. No personal attacks. No links. Use /username to whisper to another player. Respect the mods and each other and most importantly, have fun!';
        m += '</div>';
        
        // Chat input area - we'll create our own input here
        m += '<div id="pbChatInput" style="padding:5px; background-color:#e8d6b0;">';
        m += '<div style="display:flex; align-items:center;">';
        m += '<textarea id="pbChatTextarea" style="flex-grow:1; margin-right:5px; height:40px; width:100%;"></textarea>';
        m += '<button id="pbChatSend" style="height:40px;">Chat</button>';
        m += '</div>';
        m += '</div>';
        
        // Chat controls area - for emoticons, settings, report buttons
        m += '<div id="pbChatControls" style="padding:5px; background-color:#e8d6b0; border-top:1px solid #886;">';
        m += '<button id="pbEmoticons" style="margin-right:10px;">Emoticons</button>';
        m += '<button id="pbChatSettings" style="margin-right:10px;">Chat Settings</button>';
        m += '<button id="pbReport">Report</button>';
        m += '</div>';

        t.myDiv.innerHTML = m;

        t.chatDiv = ById('pbChatContent');
        t.inputDiv = ById('pbChatInput');
        t.controlsDiv = ById('pbChatControls');

        // Add CSS to fix chat message display
        var style = document.createElement('style');
        style.textContent = `
            #pbChatContent > div {
                display: block !important;
                margin-bottom: 5px !important;
                clear: both !important;
            }
            #pbChatContent img {
                float: left;
                margin-right: 5px;
            }
        `;
        document.head.appendChild(style);

        // Set up our chat functionality
        t.setupChatFunctionality();
    },

    setupChatTabs: function() {
        var t = Tabs.Chat;
        
        ById('pbGlobalChatTab').addEventListener('click', function() {
            t.switchChatType('global');
        });
        
        ById('pbAllianceChatTab').addEventListener('click', function() {
            t.switchChatType('alliance');
        });
        
        // Initialize with global chat
        t.switchChatType('global');
    },

    switchChatType: function(chatType) {
        var t = Tabs.Chat;
        t.currentChatType = chatType;
        
        // Update tab styling
        if (chatType === 'global') {
            ById('pbGlobalChatTab').className = 'tab selected';
            ById('pbAllianceChatTab').className = 'tab';
        } else {
            ById('pbGlobalChatTab').className = 'tab';
            ById('pbAllianceChatTab').className = 'tab selected';
        }
        
        // Switch to the appropriate chat tab in the game
        var gameChatTabs = document.querySelector('#mod_comm_tabs');
        if (gameChatTabs) {
            if (chatType === 'global') {
                gameChatTabs.selectedIndex = 0;
            } else {
                gameChatTabs.selectedIndex = 1;
            }
            // Trigger any events that might be needed
            var event = new Event('change');
            gameChatTabs.dispatchEvent(event);
        }
        
        // Update the chat content
        t.updateChat();
    },

    hookGameChat: function () {
        var t = Tabs.Chat;
        
        // Find the game's chat containers
        var globalChatContainer = document.querySelector('#mod_comm_list1');
        var allianceChatContainer = document.querySelector('#mod_comm_list2');

        if (globalChatContainer && allianceChatContainer) {
            // Set up observers for both chat types
            var observer = new MutationObserver(function(mutations) {
                t.updateChat();
            });

            // Observe both chat containers
            observer.observe(globalChatContainer, { childList: true, subtree: true });
            observer.observe(allianceChatContainer, { childList: true, subtree: true });

            // Initial update
            t.updateChat();
        } else {
            console.log('Could not find game chat containers, trying again in 1 second');
            
            // Try again in a second - the game might not have loaded the chat yet
            setTimeout(function() {
                t.hookGameChat();
            }, 1000);
        }
    },

    updateChat: function () {
        var t = Tabs.Chat;
        
        // Get the appropriate chat container based on current chat type
        var chatSelector = (t.currentChatType === 'global') ? '#mod_comm_list1' : '#mod_comm_list2';
        var gameChatContainer = document.querySelector(chatSelector);
        
        if (gameChatContainer && t.chatDiv) {
            // Clear the current chat content
            t.chatDiv.innerHTML = '';
            
            // Clone each chat message individually
            var chatMessages = gameChatContainer.children;
            for (var i = 0; i < chatMessages.length; i++) {
                var messageClone = chatMessages[i].cloneNode(true);
                
                // Force block display for each message
                messageClone.style.display = 'block';
                messageClone.style.marginBottom = '5px';
                messageClone.style.clear = 'both';
                
                // Make sure images float left
                var img = messageClone.querySelector('img');
                if (img) {
                    img.style.float = 'left';
                    img.style.marginRight = '5px';
                }
                
                t.chatDiv.appendChild(messageClone);
            }
            
            // Scroll to bottom
            t.chatDiv.scrollTop = t.chatDiv.scrollHeight;
        }
    },

    setupChatFunctionality: function() {
        var t = Tabs.Chat;
        
        // Get our chat elements
        var textarea = ById('pbChatTextarea');
        var sendButton = ById('pbChatSend');
        
        // Set up emoticons button
        ById('pbEmoticons').addEventListener('click', function() {
            // Find and click the game's emoticons button
            var gameEmoticonsButton = document.querySelector('.chat_controls a:nth-child(1)');
            if (gameEmoticonsButton) {
                gameEmoticonsButton.click();
            }
        });
        
        // Set up chat settings button
        ById('pbChatSettings').addEventListener('click', function() {
            // Find and click the game's chat settings button
            var gameChatSettingsButton = document.querySelector('.chat_controls a:nth-child(2)');
            if (gameChatSettingsButton) {
                gameChatSettingsButton.click();
            }
        });
        
        // Set up report button
        ById('pbReport').addEventListener('click', function() {
            // Find and click the game's report button
            var gameReportButton = document.querySelector('.chat_controls a:nth-child(3)');
            if (gameReportButton) {
                gameReportButton.click();
            }
        });
        
        // Set up send button
        sendButton.addEventListener('click', function() {
            t.sendChat();
        });
        
        // Set up Enter key handler
        textarea.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                t.sendChat();
            }
        });
    },
    
    sendChat: function() {
        var t = Tabs.Chat;
        var textarea = ById('pbChatTextarea');
        var message = textarea.value.trim();
        
        if (message === '') return;
        
        // Find the game's chat input and send button
        var gameChatTextarea = document.querySelector('#mod_comm_input textarea');
        var gameSendButton = document.querySelector('#mod_comm_input button');
        
        if (!gameChatTextarea || !gameSendButton) {
            console.log('Game chat elements not found. Trying alternative selectors...');
            
            // Try alternative selectors
            gameChatTextarea = document.querySelector('.comm_textarea');
            gameSendButton = document.querySelector('.comm_send');
            
            if (!gameChatTextarea || !gameSendButton) {
                console.log('Could not find game chat input elements. Chat functionality may not work.');
                return;
            }
        }
        
        // Make sure the correct chat tab is selected in the game
        var gameChatTabs = document.querySelector('#mod_comm_tabs');
        if (gameChatTabs) {
            if (t.currentChatType === 'global') {
                gameChatTabs.selectedIndex = 0;
            } else {
                gameChatTabs.selectedIndex = 1;
            }
            
            // Trigger change event
            try {
                var event = new Event('change', { bubbles: true });
                gameChatTabs.dispatchEvent(event);
            } catch (e) {
                console.log('Error dispatching change event:', e);
            }
        }
        
        // Set the message in the game's textarea
        try {
            gameChatTextarea.value = message;
            
            // Trigger input event
            var inputEvent = new Event('input', { bubbles: true });
            gameChatTextarea.dispatchEvent(inputEvent);
            
            // Also try focus
            gameChatTextarea.focus();
        } catch (e) {
            console.log('Error setting message in game textarea:', e);
        }
        
        // Try multiple approaches to send the message
        
        // Approach 1: Click the game's send button
        try {
            gameSendButton.click();
        } catch (e) {
            console.log('Error clicking game send button:', e);
        }
        
        // Approach 2: Try to access the game's chat send function directly
        try {
            if (typeof Chat !== 'undefined' && typeof Chat.sendChat === 'function') {
                Chat.sendChat();
            }
        } catch (e) {
            console.log('Error calling Chat.sendChat directly:', e);
        }
        
      }
};