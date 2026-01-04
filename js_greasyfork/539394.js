Tabs.APCityTracker = {
    tabOrder: 2190,
    tabLabel: 'AP & City Tracker',
    tabDisabled: false,
    myDiv: null,
    targets: [],
    timer: null,
    checkInterval: 5 * 60 * 1000, // Check every 5 minutes

    init: function(div) {
        var t = Tabs.APCityTracker;
        t.myDiv = div;

        if (!Options.APCityTrackerOptions) {
            Options.APCityTrackerOptions = {
                targets: [],
                alertSound: true,
                chatAlert: true,
                notifyMinutes: 30
            };
        }

        t.targets = Options.APCityTrackerOptions.targets || [];
        t.paint();
    },

    paint: function() {
        var t = Tabs.APCityTracker;
        var m = '<DIV class="divHeader" align="center">AP Status & City Location Tracker</div>';

        m += '<div style="padding:10px;">';
        m += '<table width="100%">';
        m += '<tr><td width="30%">Player Name or UID:</td>';
        m += '<td><input type="text" id="apCityTrackerTarget" style="width:200px" class="btInput"></td></tr>';
        m += '<tr><td colspan="2" align="center"><input type="button" id="addAPCityTarget" value="Add Target" class="buttonv2 std green"></td></tr>';
        m += '</table>';

        m += '<div style="max-height:300px; overflow-y:auto; margin-top:10px;">';
        m += '<table width="100%" id="apCityTrackerTable" class="xtab">';
        m += '<tr><th width="20%">Player</th><th width="20%">AP Status</th><th width="40%">City Locations</th><th width="20%">Actions</th></tr>';
        m += '</table></div>';

        m += '<div style="margin-top:10px; border-top:1px solid #888; padding-top:10px;">';
        m += '<table width="100%">';
        m += '<tr><td width="50%"><input type="checkbox" id="apCityTrackerSound" ' + (Options.APCityTrackerOptions.alertSound ? 'checked' : '') + '> Play sound alert</td>';
        m += '<td><input type="checkbox" id="apCityTrackerChat" ' + (Options.APCityTrackerOptions.chatAlert ? 'checked' : '') + '> Send chat alert</td></tr>';
        m += '<tr><td colspan="2">Notify when AP has <input type="text" id="apCityTrackerMinutes" size="3" value="' + Options.APCityTrackerOptions.notifyMinutes + '" class="btInput"> minutes remaining</td></tr>';
        m += '</table></div>';

        m += '</div>';

        t.myDiv.innerHTML = m;

        document.getElementById('addAPCityTarget').addEventListener('click', t.addTarget, false);
        document.getElementById('apCityTrackerSound').addEventListener('change', function () {
            Options.APCityTrackerOptions.alertSound = this.checked;
            saveOptions();
        }, false);
        document.getElementById('apCityTrackerChat').addEventListener('change', function () {
            Options.APCityTrackerOptions.chatAlert = this.checked;
            saveOptions();
        }, false);
        document.getElementById('apCityTrackerMinutes').addEventListener('change', function () {
            Options.APCityTrackerOptions.notifyMinutes = parseInt(this.value) || 30;
            saveOptions();
        }, false);

        t.displayTargets();

        // Start monitoring
        if (t.timer) clearTimeout(t.timer);
        t.timer = setTimeout(t.checkStatus, 10000);
    },

    addTarget: function() {
        var t = Tabs.APCityTracker;
        var input = document.getElementById('apCityTrackerTarget').value.trim();
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
                    alert('This player is already in your tracker list!');
                    return;
                }
            }

            t.targets.push({
                uid: targetInfo.uid,
                name: targetInfo.name,
                lastCheck: 0,
                apEnd: 0,
                cities: [],
                notified: false
            });

            Options.APCityTrackerOptions.targets = t.targets;
            saveOptions();
            t.displayTargets();
            document.getElementById('apCityTrackerTarget').value = '';

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
        var t = Tabs.APCityTracker;
        var table = document.getElementById('apCityTrackerTable');
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

            // AP status
            cell = row.insertCell(1);
            if (target.apEnd > 0) {
                var timeLeft = target.apEnd - unixTime();
                if (timeLeft > 0) {
                    cell.innerHTML = 'Active: ' + timeFormatShort(timeLeft);
                    if (timeLeft < Options.APCityTrackerOptions.notifyMinutes * 60) {
                        cell.style.color = 'red';
                        cell.style.fontWeight = 'bold';
                    }
                } else {
                    cell.innerHTML = 'Expired';
                }
            } else {
                cell.innerHTML = 'Unknown';
            }

            // City locations
            cell = row.insertCell(2);
            if (target.cities && target.cities.length > 0) {
                var cityHtml = '';
                for (var c = 0; c < target.cities.length; c++) {
                    var city = target.cities[c];
                    cityHtml += 'City ' + city.id + ': (' + city.x + ',' + city.y + ')';
                    if (city.name) {
                        cityHtml += ' - ' + city.name;
                    }
                    cityHtml += '<br>';
                }
                cell.innerHTML = cityHtml;
            } else {
                cell.innerHTML = 'No cities found';
            }

            // Actions
            cell = row.insertCell(3);
            cell.innerHTML = '<a href="#" onclick="Tabs.APCityTracker.removeTarget(' + i + '); return false;">Remove</a> | ' +
                '<a href="#" onclick="Tabs.APCityTracker.checkTargetNow(' + i + '); return false;">Check Now</a>';
        }
    },

    removeTarget: function(index) {
        var t = Tabs.APCityTracker;
        if (index >= 0 && index < t.targets.length) {
            t.targets.splice(index, 1);
            Options.APCityTrackerOptions.targets = t.targets;
            saveOptions();
            t.displayTargets();
        }
    },

    checkTargetNow: function(index) {
        var t = Tabs.APCityTracker;
        if (index >= 0 && index < t.targets.length) {
            var target = t.targets[index];

            // Make API call to get player AP status
            t.fetchPlayerAPStatus(target.uid, function (apStatus) {
                if (apStatus) {
                    t.targets[index].apEnd = apStatus.apEnd;
                    t.targets[index].lastCheck = unixTime();
                    
                    // Now fetch city locations
                    t.fetchPlayerCities(target.uid, function (cities) {
                        if (cities && cities.length > 0) {
                            t.targets[index].cities = cities;
                        }
                        
                        Options.APCityTrackerOptions.targets = t.targets;
                        saveOptions();
                        t.displayTargets();
                        
                        // Check for notifications
                        t.checkNotifications(index);
                    });
                }
            });
        }
    },

    fetchPlayerAPStatus: function(uid, callback) {
        // Make API call to get player's AP status
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
                            apEnd: 0
                        };

                        // Parse AP status
                        if (data.ap && data.ap.et) {
                            status.apEnd = data.ap.et;
                        }

                        callback(status);
                    } else {
                        callback(null);
                    }
                } catch (e) {
                    logit("Error parsing player AP status: " + e);
                    callback(null);
                }
            },
            onFailure: function () {
                logit("Failed to fetch player AP status");
                callback(null);
            }
        });
    },

    fetchPlayerCities: function(uid, callback) {
        // Make API call to get player's city locations
        var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
        params.uid = uid;

        new Ajax.Request(unsafeWindow.g_ajaxpath + "ajax/viewPlayerInfo.php" + unsafeWindow.g_ajaxsuffix, {
            method: "post",
            parameters: params,
            onSuccess: function (transport) {
                try {
                    var data = eval("(" + transport.responseText + ")");
                    if (data.ok) {
                        var cities = [];
                        
                        // Parse city data
                        if (data.cities) {
                            for (var cityId in data.cities) {
                                var city = data.cities[cityId];
                                cities.push({
                                    id: cityId.substr(1), // Remove the 'c' prefix
                                    x: city.x,
                                    y: city.y,
                                    name: city.n || null
                                });
                            }
                        }
                        
                        callback(cities);
                    } else {
                        callback([]);
                    }
                } catch (e) {
                    logit("Error parsing player cities: " + e);
                    callback([]);
                }
            },
            onFailure: function () {
                logit("Failed to fetch player cities");
                callback([]);
            }
        });
    },

    checkNotifications: function(index) {
        var t = Tabs.APCityTracker;
        if (index >= 0 && index < t.targets.length) {
            var target = t.targets[index];
            
            // Check AP expiration
            if (target.apEnd > 0) {
                var timeLeft = target.apEnd - unixTime();
                if (timeLeft > 0 && timeLeft < Options.APCityTrackerOptions.notifyMinutes * 60 && !target.notified) {
                    // AP is about to expire, send notification
                    var message = target.name + "'s Attack Protection expires in " + timeFormatShort(timeLeft);
                    
                    // Sound alert
                    if (Options.APCityTrackerOptions.alertSound) {
                        AudioManager.play('boing');
                    }
                    
                    // Chat alert
                    if (Options.APCityTrackerOptions.chatAlert) {
                        sendChat("/" + Seed.player.name + " " + message);
                    }
                    
                    // Mark as notified
                    t.targets[index].notified = true;
                    Options.APCityTrackerOptions.targets = t.targets;
                    saveOptions();
                }
                
                // Reset notification flag if AP has been renewed
                if (timeLeft > Options.APCityTrackerOptions.notifyMinutes * 60 && target.notified) {
                    t.targets[index].notified = false;
                    Options.APCityTrackerOptions.targets = t.targets;
                    saveOptions();
                }
            }
        }
    },

    checkStatus: function() {
        var t = Tabs.APCityTracker;
        var now = unixTime();
        
        // Check each target
        for (var i = 0; i < t.targets.length; i++) {
            // Check if it's been more than checkInterval since last check
            if (now - t.targets[i].lastCheck > t.checkInterval / 1000) {
                t.checkTargetNow(i);
            }
        }
        
        // Schedule next check
        t.timer = setTimeout(t.checkStatus, t.checkInterval);
    }
};