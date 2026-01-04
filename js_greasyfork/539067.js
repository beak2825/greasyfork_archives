Tabs.AutoPorterBlocker = {
    tabOrder: 910, // Place after Chat tab
    tabLabel: 'Auto Porter Blocker',
    tabDisabled: false,
    myDiv: null,
    blockedPlayers: [],

    init: function(div) {
        var t = Tabs.AutoPorterBlocker;
        t.myDiv = div;
        t.createUI();
        t.loadBlockedPlayers();
    },

    createUI: function() {
        var t = Tabs.AutoPorterBlocker;
        var m = '<DIV class=divHeader align=center>' + tx('Auto Porter Blocker') + '</div>';

        m += '<p>Enter player names to block from automatically receiving resources via auto-porters (one name per line):</p>';
        m += '<textarea id="pbBlockedPlayersInput" style="width: 100%; height: 200px;"></textarea><br>';
        m += '<button id="pbSaveBlockedPlayers">Save Blocked Players</button>';

        t.myDiv.innerHTML = m;

        ById('pbSaveBlockedPlayers').addEventListener('click', function() { t.saveBlockedPlayers(); });
    },

    loadBlockedPlayers: function() {
        var t = Tabs.AutoPorterBlocker;
        // Load blocked players from local storage
        var storedPlayers = localStorage.getItem('pbBlockedPlayers');
        if (storedPlayers) {
            t.blockedPlayers = JSON.parse(storedPlayers);
            ById('pbBlockedPlayersInput').value = t.blockedPlayers.join('\n');
        }
    },

    saveBlockedPlayers: function() {
        var t = Tabs.AutoPorterBlocker;
        // Save blocked players to local storage
        var playerNames = ById('pbBlockedPlayersInput').value.split('\n').map(function(name) {
            return name.trim();
        }).filter(function(name) {
            return name !== ''; // Remove empty names
        });

        t.blockedPlayers = playerNames;
        localStorage.setItem('pbBlockedPlayers', JSON.stringify(t.blockedPlayers));
        alert('Blocked players saved!');
    },

    isPlayerBlocked: function(playerName) {
        var t = Tabs.AutoPorterBlocker;
        return t.blockedPlayers.includes(playerName);
    },

    // You'll need to hook into the game's auto-porter logic here
    // This is a placeholder function that shows how you might use the isPlayerBlocked function
    handleAutoPorterTransfer: function(resource, targetPlayer) {
        var t = Tabs.AutoPorterBlocker;
        if (t.isPlayerBlocked(targetPlayer)) {
            console.log('Auto-porter transfer to ' + targetPlayer + ' blocked!');
            return false; // Prevent the transfer
        } else {
            console.log('Auto-porter transfer to ' + targetPlayer + ' allowed.');
            return true; // Allow the transfer
        }
    }
};