Tabs.AutoRoyalConquestTab = {
    tabOrder: 8002,
    tabLabel: 'Auto Royal Conquest',
    tabColor: 'green',
    myDiv: null,
    isInitialized: false,
    autoAttackInterval: null,
    troopTypes: [
        { name: "Supply Troop", id: "supplyTroop" },
        { name: "Militiaman", id: "militiaman" },
        { name: "Scout", id: "scout" },
        { name: "Pikeman", id: "pikeman" },
        { name: "Swordsman", id: "swordsman" },
        { name: "Archer", id: "archer" },
        { name: "Supply Wagon", id: "supplyWagon" },
        { name: "Ballista", id: "ballista" },
        { name: "Battering Ram", id: "batteringRam" },
        { name: "Catapult", id: "catapult" },
        { name: "Heavy Cavalry", id: "heavyCavalry" }
    ],

    init: function(div) {
        var t = this;
        t.myDiv = div;
        t.myDiv.style.display = 'none';
        t.isInitialized = true;
        t.updateStatus('Ready to automate Royal Conquest');
    },

    paint: function() {
        var t = this;
        if (!t.isInitialized) {
            t.updateStatus('Please initialize first');
            return;
        }

        var troopInputs = t.troopTypes.map(function(troop) {
            return `
                <div class="inputGroup">
                    <label for="troop_${troop.id}">${troop.name}:</label>
                    <input type="number" id="troop_${troop.id}" class="btInput troopInputBox" value="0" min="0" />
                </div>
            `;
        }).join('');

        var m = `
            <div class="divHeader" align="center">Auto Royal Conquest</div>
            <div class="monitorContainer">
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${troopInputs}
                </div>
                <div class="inputGroup" style="margin-top: 15px;">
                    <button id="startAutoAttack" class="buttonv2 std green">Start Auto</button>
                    <button id="stopAutoAttack" class="buttonv2 std red">Stop</button>
                </div>
                <div id="autoConquestStatus" class="statusMessage"></div>
            </div>
        `;

        t.myDiv.innerHTML = m;

        $("#startAutoAttack", t.myDiv).click(function() {
            t.startAutoAttack();
        });
        $("#stopAutoAttack", t.myDiv).click(function() {
            t.stopAutoAttack();
        });
    },

    show: function() {
        var t = this;
        t.myDiv.style.display = 'block';
        t.paint();
        t.updateStatus('Ready to automate Royal Conquest');
    },

    hide: function() {
        var t = this;
        t.myDiv.style.display = 'none';
        t.stopAutoAttack();
        t.updateStatus('');
    },

    updateStatus: function(message) {
        var t = this;
        var statusEl = $("#autoConquestStatus", t.myDiv);
        statusEl.html(message);
        statusEl.css({
            'color': message.includes('Error') ? '#dc3545' : '#28a745',
            'background-color': message.includes('Error') ? '#f8d7da' : '#d4edda'
        });
    },

    startAutoAttack: function() {
        var t = this;
        if (t.autoAttackInterval) {
            t.updateStatus('Auto attack is already running');
            return;
        }
        t.updateStatus('Auto attack started');
        t.autoAttackInterval = setInterval(function() {
            try {
                t.performAttack();
            } catch (e) {
                t.updateStatus('Error: ' + e.message);
            }
        }, 5000); // Attack every 5 seconds (adjust as needed)
    },

    stopAutoAttack: function() {
        var t = this;
        if (t.autoAttackInterval) {
            clearInterval(t.autoAttackInterval);
            t.autoAttackInterval = null;
            t.updateStatus('Auto attack stopped');
        }
    },

    performAttack: function() {
        var t = this;
        // Gather troop values from the UI
        var troopValues = t.troopTypes.map(function(troop) {
            var val = parseInt($("#troop_" + troop.id, t.myDiv).val(), 10);
            return isNaN(val) ? 0 : val;
        });

        // Set values in the game's troop input fields
        // Assumes the order of .btInput fields in the DOM matches troopTypes
        var gameInputs = $(".btInput").filter(function() {
            // Only select visible troop input boxes in the Royal Conquest UI
            return $(this).is(":visible") && $(this).closest('.monitorContainer').length === 0;
        });

        troopValues.forEach(function(val, idx) {
            if (gameInputs[idx]) {
                $(gameInputs[idx]).val(val);
            }
        });

        // Click the attack button
        var attackBtn = $("button:contains('Attack')");
        if (attackBtn.length) {
            attackBtn[0].click();
            t.updateStatus('Attack sent with selected troops');
        } else {
            t.updateStatus('Error: Attack button not found');
        }
    }
};
