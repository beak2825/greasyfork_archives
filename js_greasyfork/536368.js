Tabs.ChatAssistant = {
    init: function() {
        var div = document.createElement('div');
        div.className = 'tabContent';
        div.style.display = 'none';
        return div;
    },

    paint: function() {
        // Create response options
        var responseOptions = Object.keys(this.cannedResponses).map(key => `
            <option value="${key}">${this.cannedResponses[key]}</option>
        `).join('');

        var m = `
            <div class="divHeader" align="center">Chat Assistant</div>
            <br>
            <div align="center">
                <select id="cannedResponseSelect" class="btInput">
                    <option value="">-- Select Response --</option>
                    ${responseOptions}
                </select>
                <br><br>
                <textarea id="chatInput" rows="3" cols="50" class="btInput"></textarea>
                <br>
                <button id="sendButton" class="buttonv2 std blue">Send to Global</button>
            </div>
        `;

        // Create div if it doesn't exist
        if (!this.myDiv) {
            this.myDiv = document.createElement('div');
            this.myDiv.className = 'tabContent';
        }
        this.myDiv.innerHTML = m;

        // Event listeners
        var self = this;
        $("#cannedResponseSelect").change(function() {
            self.insertCannedResponse();
        });
        $("#sendButton").click(function() {
            self.sendMessage();
        });
    },

    insertCannedResponse: function() {
        var selectedKey = $("#cannedResponseSelect").val();
        var cannedResponse = this.cannedResponses[selectedKey] || "";
        $("#chatInput").val(cannedResponse);
    },

    sendMessage: function() {
        var message = $("#chatInput").val().trim();
        if (message === "") {
            return;
        }

        // Send message to global chat
        unsafeWindow.cm.sendGlobalChat(message);

        $("#chatInput").val(""); // Clear input
    },

    // Canned responses
    cannedResponses: {
        "help": translate("I need help with..."),
        "resources": translate("I'm looking for resources.  Does anyone have..."),
        // ... other canned responses ...
    }
};