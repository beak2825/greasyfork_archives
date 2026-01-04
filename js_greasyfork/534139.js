// allianceChat.js

Tabs.AllianceChat = {
    tabOrder: 2150,
    tabLabel: 'Alliance Chat',
    tabColor: 'green',
    myDiv: null,
    chatHistory: [],
    maxHistory: 300,

    init: function(div) {
        var t = Tabs.AllianceChat;
        t.myDiv = div;
        t.paint();
    },

    paint: function() {
        var t = Tabs.AllianceChat;
        var m = `
            <div class="divHeader" align="center">Enhanced Alliance Chat</div>
            <br>
            <div align="center">
                <textarea id="allianceChatInput" rows="3" cols="50" class="btInput" placeholder="Enter message..."></textarea>
                <br>
                <button id="allianceSendButton" class="buttonv2 std blue">Send</button>
                <br><br>
                <div id="allianceChatDisplay" style="height: 400px; overflow-y: scroll;"></div>
            </div>
        `;

        t.myDiv.innerHTML = m;

        // Event listeners (using jQuery)
        $("#allianceSendButton").click(function() { t.sendMessage(); });
    },

    sendMessage: function() {
        var t = Tabs.AllianceChat;
        var message = $("#allianceChatInput").val().trim();
        if (!message) { // Check for empty message
            return;
        }

        // Send message (using your existing chat functions or BotChat)
        // Example using BotChat:
        BotChat.sendAlliance(message);

        t.addMessage(Seed.player.name, message);
        t.displayChat();
        $("#allianceChatInput").val(""); // Clear input
    },

    addMessage: function(sender, message) {
        var t = Tabs.AllianceChat;
        t.chatHistory.push({ sender: sender, message: message, timestamp: Date.now() });
        if (t.chatHistory.length > t.maxHistory) {
            t.chatHistory.shift();
        }
        t.saveChatHistory();
    },

    displayChat: function() {
        var t = Tabs.AllianceChat;
        var chatDisplay = $("#allianceChatDisplay");
        chatDisplay.empty();

        for (var i = 0; i < t.chatHistory.length; i++) {
            var msg = t.chatHistory[i];
            var messageElement = $("<div></div>");
            messageElement.html(`[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.sender}: ${msg.message}`);
            chatDisplay.append(messageElement);
        }
        chatDisplay.scrollTop(chatDisplay[0].scrollHeight);
    },

    saveChatHistory: function() {
        var t = Tabs.AllianceChat;
        GM_setValue("AllianceChatHistory", JSON.stringify(t.chatHistory)); // Example using GM_setValue
    },

    loadChatHistory: function() {
        var t = Tabs.AllianceChat;
        var savedHistory = GM_getValue("AllianceChatHistory"); // Example using GM_setValue
        if (savedHistory) {
            try {
                t.chatHistory = JSON.parse(savedHistory);
            } catch (e) {
                console.error("Error loading chat history:", e);
            }
        }
    },

    show: function() {
        var t = Tabs.AllianceChat;
        t.loadChatHistory();
        t.displayChat();
    },

    hide: function() {} // Nothing to do on hide
};
