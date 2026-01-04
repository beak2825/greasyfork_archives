Tabs.TruceMonitor = {
    tabOrder: 2180,
    tabLabel: 'Truce Monitor',
    tabDisabled: false,
    myDiv: null,
    targets: [],
    timer: null,
    checkInterval: 5 * 60 * 1000, // Check every 5 minutes

    init: function(div) {
        var t = Tabs.TruceMonitor;
        t.myDiv = div;

        if (!Options.TruceMonitorOptions) {
            Options.TruceMonitorOptions = {
                targets: [],
                alertSound: true,
                chatAlert: true,
                notifyMinutes: 30
            };
        }

        t.targets = Options.TruceMonitorOptions.targets || [];
        t.paint();
    },

    paint: function() {
        var t = Tabs.TruceMonitor;
        var m = '<DIV class="divHeader" align="center">Truce Monitor</div>';

        m += '<div style="padding:10px;">';
        m += '<table width="100%">';
        m += '<tr><td width="30%">Player Name or UID:</td>';
        m += '<td><input type="text" id="truceMonitorTarget" style="width:200px" class="btInput"></td></tr>';
        m += '<tr><td colspan="2" align="center"><input type="button" id="addTruceTarget" value="Add Target" class="buttonv2 std green"></td></tr>';
        m += '</table>';

        m += '<div style="max-height:300px; overflow-y:auto; margin-top:10px;">';
        m += '<table width="100%" id="truceMonitorTable" class="xtab">';
        m += '<tr><th width="40%">Player</th><th width="40%">Truce Status</th><th width="20%">Actions</th></tr>';
        m += '</table></div>';

        m += '<div style="margin-top:10px; border-top:1px solid #888; padding-top:10px;">';
        m += '<table width="100%">';
        m += '<tr><td width="50%"><input type="checkbox" id="truceMonitorSound" ' + (Options.TruceMonitorOptions.alertSound ? 'checked' : '') + '> Play sound alert</td>';
        m += '<td><input type="checkbox" id="truceMonitorChat" ' + (Options.TruceMonitorOptions.chatAlert ? 'checked' : '') + '> Send chat alert</td></tr>';
        m += '<tr><td colspan="2">Notify when <input type="text" id="truceMonitorMinutes" size="3" value="' + Options.TruceMonitorOptions.notifyMinutes + '" class="btInput"> minutes remain</td></tr>';
        m += '</table></div>';

        m += '</div>';

        t.myDiv.innerHTML = m;

        document.getElementById('addTruceTarget').addEventListener('click', t.addTarget, false);
        document.getElementById('truceMonitorSound').addEventListener('change', function () {
            Options.TruceMonitorOptions.alertSound = this.checked;
            saveOptions();
        }, false);
        document.getElementById('truceMonitorChat').addEventListener('change', function () {
            Options.TruceMonitorOptions.chatAlert = this.checked;
            saveOptions();
        }, false);
        document.getElementById('truceMonitorMinutes').addEventListener('change', function () {
            Options.TruceMonitorOptions.notifyMinutes = parseInt(this.value) || 30;
            saveOptions();
        }, false);

        t.displayTargets();

        // Start monitoring
        if (t.timer) clearTimeout(t.timer);
        t.timer = setTimeout(t.checkStatus, 10000);
    },

    addTarget: function() {
        var t = Tabs.TruceMonitor;
        var input = document.getElementById('truceMonitorTarget').value.trim();
        if (!input) return;

        // Check if input is a UID (number) or name
        var isUID = !isNaN(input);
        var targetInfo = null;

        if (isUID) {
            // Search by UID
            targetInfo = t.findPlayerByUID(input);
        } else {
            // Search by name
            targetInfo = t.findPlayerByName(input);
        }

        if (targetInfo) {
            // Check if already in list
            for (var i = 0; i < t.targets.length; i++) {
                if (t.targets[i].uid == targetInfo.uid) {
                    alert('This player is already in your monitor list!');
                    return;
                }
            }

            t.targets.push({
                uid: targetInfo.uid,
                name: targetInfo.name,
                lastTruceCheck: 0,
                truceEnd: 0,
                notified: false
            });

            Options.TruceMonitorOptions.targets = t.targets;
            saveOptions();
            t.displayTargets();
            document.getElementById('truceMonitorTarget').value = '';

            // Check the new target immediately
            t.checkTargetNow(t.targets.length - 1);
        } else {
            alert('Player not found. Please check the name or UID.');
        }
    },

    findPlayerByUID: function(uid) {
        // This function searches the game data for a player with this UID
        for (var p in Seed.players) {
            if (p == uid) {
                return { uid: p, name: Seed.players[p].n };
            }
        }
        return null;
    },

    findPlayerByName: function(name) {
        // Search for player by name
        // Case insensitive search
        name = name.toLowerCase();

        for (var p in Seed.players) {
            if (Seed.players[p].n.toLowerCase() == name) {
                return { uid: p, name: Seed.players[p].n };
            }
        }
        return null;
    },

    displayTargets: function() {
        var t = Tabs.TruceMonitor;
        var table = document.getElementById('truceMonitorTable');
        if (!table) return;

        // Keep the header row
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        for (var i = 0; i < t.targets.length; i++) {
            var target = t.targets[i];
            var row = table.insertRow(-1);

            // Player name
            var cell = row.insertCell(0);
            cell.innerHTML = target.name;

            // Truce status
            cell = row.insertCell(1);
            if (target.truceEnd > 0) {
                var timeLeft = target.truceEnd - unixTime();
                if (timeLeft > 0) {
                    cell.innerHTML = 'Active: ' + timeFormatShort(timeLeft);
                    if (timeLeft < Options.TruceMonitorOptions.notifyMinutes * 60) {
                        cell.style.color = 'red';
                        cell.style.fontWeight = 'bold';
                    }
                } else {
                    cell.innerHTML = 'Expired';
                }
            } else {
                cell.innerHTML = 'Unknown';
            }

            // Actions
            cell = row.insertCell(2);
            cell.innerHTML = '<a href="#" onclick="Tabs.TruceMonitor.removeTarget(' + i + '); return false;">Remove</a> | ' +
                '<a href="#" onclick="Tabs.TruceMonitor.checkTargetNow(' + i + '); return false;">Check Now</a>';
        }
    },

    removeTarget: function(index) {
        var t = Tabs.TruceMonitor;
        if (index >= 0 && index < t.targets.length) {
            t.targets.splice(index, 1);
            Options.TruceMonitorOptions.targets = t.targets;
            saveOptions();
            t.displayTargets();
        }
    },

    checkTargetNow: function(index) {
        var t = Tabs.TruceMonitor;
        if (index >= 0 && index < t.targets.length) {
            var target = t.targets[index];

            // Make API call to get player status
            t.fetchPlayerStatus(target.uid, function (status) {
                if (status) {
                    t.updateTargetStatus(index, status);
                    t.displayTargets();
                }
            });
        }
    },

    fetchPlayerStatus: function(uid, callback) {
        // Make API call to get player's truce status
        var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
        params.pid = uid;
        params.tab = 1;

        new Ajax.Request(unsafeWindow.g_ajaxpath + "ajax/viewCourt.php" + unsafeWindow.g_ajaxsuffix, {
            method: "post",
            parameters: params,
            onSuccess: function (transport) {
                try {
                    var data = eval("(" + transport.responseText + ")");
                    if (data.ok) {
                        var status = {
                            truceEnd: 0
                        };

                        // Parse truce status
                        if (data.truce && data.truce.et) {
                            status.truceEnd = data.truce.et;
                        }

                        callback(status);
                    } else {
                        callback(null);
                    }
                } catch (e) {
                    logit("Error parsing player status: " + e);
                    callback(null);
                }
            },
            onFailure: function () {
                logit("Failed to fetch player status");
                callback(null);
            }
        });
    },

    updateTargetStatus: function(index, status) {
        var t = Tabs.TruceMonitor;
        if (index >= 0 && index < t.targets.length) {
            var now = unixTime();
            var target = t.targets[index];
            
            target.truceEnd = status.truceEnd;
            target.lastTruceCheck = now;
            
            // Reset notification flag if status has changed
            if (target.truceEnd > 0 && target.truceEnd - now > Options.TruceMonitorOptions.notifyMinutes * 60) {
                target.notified = false;
            }
            
            Options.TruceMonitorOptions.targets = t.targets;
            saveOptions();
        }
    },

    checkStatus: function() {
        var t = Tabs.TruceMonitor;
        var now = unixTime();
        
        // Check each target
        for (var i = 0; i < t.targets.length; i++) {
            var target = t.targets[i];
            
            // Check if truce is about to expire
            if (target.truceEnd > 0) {
                var timeLeft = target.truceEnd - now;
                if (timeLeft > 0 && timeLeft <= Options.TruceMonitorOptions.notifyMinutes * 60 && !target.notified) {
                    // Notify user
                    var minutesLeft = Math.ceil(timeLeft / 60);
                    var message = target.name + "'s truce will expire in " + minutesLeft + " minutes!";
                    
                    if (Options.TruceMonitorOptions.alertSound) {
                        AudioManager.play('boing');
                    }
                    
                    if (Options.TruceMonitorOptions.chatAlert) {
                        if (Tabs.chatPane) {
                            Tabs.chatPane.addToChat({
                                msg: message,
                                sender: "TruceMonitor",
                                alliance: false,
                                notification: true
                            });
                        }
                    }
                    
                     // Mark as notified
                    target.notified = true;
                    Options.TruceMonitorOptions.targets = t.targets;
                    saveOptions();
                }
            }
            
            // Check if we need to refresh the status
            var lastCheckTime = target.lastTruceCheck || 0;
            if (now - lastCheckTime > t.checkInterval) {
                // Time to check this target again
                t.checkTargetNow(i);
            }
        }
        
        // Update display if tab is visible
        if (t.myDiv.style.display != 'none') {
            t.displayTargets();
        }
        
        // Schedule next check
        if (t.timer) clearTimeout(t.timer);
        t.timer = setTimeout(t.checkStatus, t.checkInterval);
    }
};