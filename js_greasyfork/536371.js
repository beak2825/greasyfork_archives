// truceMonitor.js (New Tab for Truce/AP Monitoring)

Tabs.TruceMonitor = {
    tabOrder: 2180, // Adjust order as needed
    tabLabel: "Truce Monitor",
    tabColor: "grey", // Or another suitable color
    myDiv: null,
    targets: [], // Array to store monitored players/cities

    init(div) {
        this.myDiv = div;
        this.paint();
    },

    paint() {
        // ... (UI for adding and removing targets to monitor) ...
        // This could be a text input for player names/UIDs or a more
        // sophisticated system using a searchable list.

        const m = `
            <div class="divHeader" align="center">Truce/AP Monitor</div>
            <br>
            <div align="center">
                <label for="targetInput">Player Name/UID:</label>
                <input type="text" id="targetInput" class="btInput">
                <button id="addTargetButton" class="buttonv2 std blue">Add Target</button>
                <br><br>
                <div id="targetList"></div> <br>
                <div id="truceMonitorStatus"></div>
            </div>
        `;

        this.myDiv.innerHTML = m;

        // Event listeners
        $("#addTargetButton").click(() => this.addTarget());
    },

    addTarget() {
        const targetInput = $("#targetInput").val().trim();
        if (targetInput === "") {
            return;
        }

        // ... (Your logic to resolve player name/UID to a Player object) ...
        // This might involve using your existing player search functionality
        // or making an API request to get player information.

        // Example (assuming you have a Player class):
        getPlayerInfo(targetInput)  // Your function to get player info
            .then(player => {
                if (player) {
                    this.targets.push(player);
                    this.saveTargets(); // Save targets to storage
                    this.displayTargetList();
                    this.updateStatus(tx("Target added."));
                } else {
                    this.updateStatus(tx("Player not found."));
                }
            });


        $("#targetInput").val(""); // Clear input field
    },

    displayTargetList() {
        // ... (Display the list of monitored targets in the #targetList div) ...
    },

    checkTrucesAndAP() {
        this.targets.forEach(target => {
            // ... (Your logic to check truce and AP expiration for the target) ...
            // This might involve fetching player data using the API or
            // monitoring the game UI for changes.

            // Example (assuming you have functions to check truce and AP):
            const truceEnds = getTruceEndTime(target);
            const apEnds = getAPEndTime(target);

            if (truceEnds) {
                this.displayTruceInfo(target, truceEnds);
            }

            if (apEnds) {
                this.displayAPInfo(target, apEnds);
            }
        });
    },

    displayTruceInfo(target, endTime) {
        // ... (Display truce information for the target, including end time) ...
        const timeLeft = endTime - unixTime();
        if (timeLeft <= 0) { // Truce has ended
            this.notifyTruceEnded(target);
        } else {
            // ... (Display time remaining) ...
        }
    },

    displayAPInfo(target, endTime) {
        // ... (Display AP information for the target, including end time) ...
        const timeLeft = endTime - unixTime();
        if (timeLeft <= 0) { // AP has ended
            this.notifyAPEnded(target);
        } else {
            // ... (Display time remaining) ...
        }
    },

    notifyTruceEnded(target) {
        // ... (Notify the user that the target's truce has ended) ...
        // This could be a chat message, sound alert, or other notification.
        this.updateStatus(`Target ${target.name}'s truce has ended!`);
    },

    notifyAPEnded(target) {
        // ... (Notify the user that the target's AP has ended) ...
        this.updateStatus(`Target ${target.name}'s AP has ended!`);
    },


    updateStatus(message) {
        $("#truceMonitorStatus").html(message);
    },

    // ... (Implement saveTargets and loadTargets using GM_setValue or IndexedDB) ...

    show() {
        this.loadTargets(); // Load saved targets
        this.displayTargetList();
    },

    hide() {
        // ...
    },

    EverySecond: function() {
        this.checkTrucesAndAP();
    }
};