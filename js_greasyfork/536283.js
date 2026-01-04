// crossDomainChat.js (New Tab for Cross-Domain Chat)

Tabs.CrossDomainChat = {
    tabOrder: 2140, // Adjust order as needed
    tabLabel: "Cross-Domain Chat",
    tabColor: "orange",
    myDiv: null,
    chatHistory: [], // Store chat history
    maxHistory: 200, // Maximum number of messages to store
    domains: [], // List of domains to chat with

    init(div) {
        this.myDiv = div;
        this.paint();
    },

    paint() {
        const m = `
            <div class="divHeader" align="center">Cross-Domain Chat</div>
            <br>
            <div align="center">
                <label for="chatDomains">Domains (comma-separated):</label>
                <input type="text" id="chatDomains" class="btInput" value="${this.domains.join(', ')}">
                <br><br>
                <textarea id="chatInput" rows="3" cols="50" class="btInput" placeholder="Enter message..."></textarea>
                <br>
                <button id="sendButton" class="buttonv2 std blue">Send</button>
                <br><br>
                <div id="chatDisplay" style="height: 400px; overflow-y: scroll;"></div>
            </div>
        `;

        this.myDiv.innerHTML = m;

        // Event listeners
        $("#sendButton").click(() => this.sendMessage());
        $("#chatDomains").change(() => this.updateDomains());
    },

    updateDomains() {
        const domainsInput = $("#chatDomains").val();
        this.domains = domainsInput.split(',').map(d => d.trim()).filter(d => d !== ""); // Clean up domains
        this.saveDomains(); // Save domains to storage (using GM_setValue or similar)
    },

    sendMessage() {
        const message = $("#chatInput").val().trim();
        if (message === "" || this.domains.length === 0) {
            return;
        }

        // Add message to chat history
        this.addMessage(Seed.player.name, message, getServerId()); // Add sender's domain
        this.displayChat();

        // Send message to other domains (implementation omitted)
        // This would involve sending cross-domain messages or using a shared server.
        // You'll need to devise a secure and reliable communication method.

        $("#chatInput").val(""); // Clear input field
    },


    addMessage(sender, message, domain) {
        this.chatHistory.push({ sender, message, timestamp: Date.now(), domain });
        if (this.chatHistory.length > this.maxHistory) {
            this.chatHistory.shift(); // Remove oldest message
        }
        this.saveChatHistory(); // Save chat history to storage
    },

    displayChat() {
        const chatDisplay = $("#chatDisplay");
        chatDisplay.empty(); // Clear previous messages

        this.chatHistory.forEach(msg => {
            const messageElement = $("<div></div>");
            messageElement.html(`[${new Date(msg.timestamp).toLocaleTimeString()}] [${msg.domain}] ${msg.sender}: ${msg.message}`);
            chatDisplay.append(messageElement);
        });

        // Scroll to bottom
        chatDisplay.scrollTop(chatDisplay[0].scrollHeight);
    },

    // ... (Implement saveDomains and saveChatHistory using GM_setValue or similar) ...

    show() {
        this.loadDomains(); // Load saved domains
        this.loadChatHistory(); // Load saved chat history
        this.displayChat();
    },

    hide() {
        // ... (Any logic to run when the tab is hidden) ...
    }
};