Tabs.Chat = {
    tabOrder: 900,
    tabLabel: 'Chat',
    tabDisabled: false,
    myDiv: null,
    
    init: function(div) {
        var t = Tabs.Chat;
        t.myDiv = div;
        
        // Create the tab UI
        t.createUI();
        
        // Set up event handlers
        t.setupEventHandlers();
    },
    
    show: function() {
        // Called when tab is shown
    },
    
    hide: function() {
        // Called when tab is hidden
    },
    
    createUI: function() {
        var t = Tabs.Chat;
        var m = '<div class="divHeader" align="center">CHAT</div>';
        
        // Chat type selection
        m += '<div style="padding:5px; background-color:#eee; border-bottom:1px solid #999;">';
        m += '<select id="pbChatType" style="width:150px;">';
        m += '<option value="global">Global Chat</option>';
        m += '<option value="alliance">Alliance Chat</option>';
        m += '<option value="private">Private Chat</option>';
        m += '</select>';
        m += '</div>';
        
        // Chat display area
        m += '<div id="pbChatDisplay" style="height:300px; overflow-y:auto; padding:5px; background-color:#fff; border:1px solid #ccc; margin:5px;"></div>';
        
        // Chat input area
        m += '<div style="padding:5px;">';
        m += '<textarea id="pbChatInput" style="width:100%; height:60px; margin-bottom:5px;"></textarea>';
        m += '<div style="display:flex; justify-content:space-between;">';
        m += '<button id="pbSendChat" class="buttonGreen">Send Message</button>';
        m += '<button id="pbClearChat" class="buttonRed">Clear Chat</button>';
        m += '</div>';
        m += '</div>';
        
        // Quick message buttons
        m += '<div style="padding:5px; border-top:1px solid #ccc; margin-top:5px;">';
        m += '<div style="font-weight:bold; margin-bottom:5px;">Quick Messages:</div>';
        m += '<div style="display:flex; flex-wrap:wrap; gap:5px;">';
        m += '<button class="pbQuickMsg">Hello!</button>';
        m += '<button class="pbQuickMsg">Need help!</button>';
        m += '<button class="pbQuickMsg">Thanks!</button>';
        m += '<button class="pbQuickMsg">Good game!</button>';
        m += '</div>';
        m += '</div>';
        
        t.myDiv.innerHTML = m;
    },
    
    setupEventHandlers: function() {
        var t = Tabs.Chat;
        
        // Send button click handler
        document.getElementById('pbSendChat').addEventListener('click', function() {
            t.sendChatMessage();
        });
        
        // Clear button click handler
        document.getElementById('pbClearChat').addEventListener('click', function() {
            document.getElementById('pbChatDisplay').innerHTML = '';
        });
        
        // Quick message buttons
        var quickMsgs = document.getElementsByClassName('pbQuickMsg');
        for (var i = 0; i < quickMsgs.length; i++) {
            quickMsgs[i].addEventListener('click', function() {
                var input = document.getElementById('pbChatInput');
                input.value = this.textContent;
                t.sendChatMessage();
            });
        }
        
        // Enter key in textarea
        document.getElementById('pbChatInput').addEventListener('keypress', function(e) {
            if (e.keyCode === 13 && !e.shiftKey) {
                e.preventDefault();
                t.sendChatMessage();
            }
        });
    },
    
    sendChatMessage: function() {
        var t = Tabs.Chat;
        var input = document.getElementById('pbChatInput');
        var message = input.value.trim();
        var chatType = document.getElementById('pbChatType').value;
        
        if (message) {
            // Display the message in our chat window
            t.displayMessage('You', message);
            
            // Send the message to the game
            t.sendToGame(chatType, message);
            
            // Clear the input
            input.value = '';
        }
    },
    
    displayMessage: function(sender, message) {
        var display = document.getElementById('pbChatDisplay');
        var time = new Date();
        var timeStr = time.getHours().toString().padStart(2, '0') + ':' + 
                     time.getMinutes().toString().padStart(2, '0');
        
        var msgDiv = document.createElement('div');
        msgDiv.className = 'chatMessage';
        msgDiv.innerHTML = '<span style="color:#999;">[' + timeStr + ']</span> ' +
                          '<span style="font-weight:bold; color:#00c;">' + sender + ':</span> ' +
                          message;
        
        display.appendChild(msgDiv);
        display.scrollTop = display.scrollHeight;
    },
    
    sendToGame: function(chatType, message) {
        // This function would integrate with the game's chat system
        // For now, we'll just log the message
        console.log('Sending ' + chatType + ' message: ' + message);
        
        // In a real implementation, you would call the game's chat functions
        // For example:
        // if (chatType === 'global') {
        //     unsafeWindow.Chat.sendGlobalMessage(message);
        // } else if (chatType === 'alliance') {
        //     unsafeWindow.Chat.sendAllianceMessage(message);
        // }
        
        // Simulate receiving a response
        setTimeout(function() {
            var responses = [
                "Thanks for your message!",
                "I received your message.",
                "Message acknowledged.",
                "Got it!"
            ];
            var randomResponse = responses[Math.floor(Math.random() * responses.length)];
            Tabs.Chat.displayMessage('System', randomResponse);
        }, 1000);
    }
};