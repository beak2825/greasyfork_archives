// ==UserScript==
// @name         Kong One Bot
// @namespace    http://alphaoverall.com
// @version      0.8.4
// @description  Kong One Userscript Bot
// @author       AlphaOverall
// @include      *://www.kongregate.com/games/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35784/Kong%20One%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/35784/Kong%20One%20Bot.meta.js
// ==/UserScript==

// Check for holodeck then init
function check() {
    if (!holodeck) { setTimeout(check, 1000);}
    else {
        console.log("[KOne Bot]: Holodeck loaded");
        setTimeout(init, 5000);
    }
} check();

// Check if users are online
function checkUsersOnline(messager, list, index) {
    if (index >= list.length) index = 0;
    if (list[index]) {
        messager.queueMessage("ping", "If you can see this, reply STOP or contact AlphaOverall for help", list[index++].name, "bot");
        messager.startSending();
    }
    setTimeout(function() { checkUsersOnline(messager, list, index); }, 60000 / 8);
}

// Messenging object
function KongOneMessenger() {
    this.CHAT_LIMIT = 60000 / 8;
    this.messageList = [];
    this.interval = null;
    this.sending = false;
    holodeck._last_message = new Date(Date.now() - this.CHAT_LIMIT);
}
KongOneMessenger.prototype = {
    queueMessage: function(type, data, recipient, user) {
        // Only send message once (applies more to ping, but also don't want to spam a user)
        if (this.messageList.filter(function(message) {
            return message.type === type && message.data === data && message.recipient === recipient && message.user === user;
        }).length) {
            return false;
        }
        this.messageList.push({ type: type, data: data, recipient: recipient, user: user });
    },
    stackMessage: function(type, data, recipient, user) {
        this.messageList.unshift({ type: type, data: data, recipient: recipient, user: user });
    },
    startSending: function() {
        if (!holodeck._active_dialogue ||
            !holodeck._active_dialogue._user_manager ||
            !holodeck._active_dialogue._user_manager.sendPrivateMessage) {
            setTimeout(function() {
                this.startSending();
            }.bind(this), 500);
        }
        else if ((!this.sending || this.timeout !== null) && this.messageList.length) {
            this.sending = true;
            this.sendMessage();
        }
    },
    stopSending: function() {
        this.sending = false;
        cancelTimeout(this.timeout);
        return !sending;
    },
    sendMessage: function() {
        if (!this.sending) {
            return false;
        }
        if (this.messageList.length && new Date() - holodeck._last_message > this.CHAT_LIMIT) {
            var message = this.messageList.shift();
             holodeck._active_dialogue._user_manager.sendPrivateMessage(message.recipient, JSON.stringify(
                 {
                     type: message.type,
                     data: message.data,
                     user: message.user
                 }
             ));
            holodeck._last_message = new Date();
        }
        if (this.messageList.length) {
            this.timeout = setTimeout(function() {
                this.sendMessage();
            }.bind(this), (holodeck._last_message - new Date()) + this.CHAT_LIMIT);
        } else {
            this.sending = false;
        }
    }
};

// Send a kong message to the user list given
function sendKongOneMessage(messager, type, message, userList, user, priority) {
    if (!user) user = "bot";
    if (!userList.length) return;
    userList.forEach(function(username) {
        if (priority) {
            messager.stackMessage(type, message, username, user);
        } else {
            messager.queueMessage(type, message, username, user);
        }
    });
    messager.startSending();
}

// Update a user in array
function updateUser(user, online, userAgent) {
    var koneUser = holodeck.kongOneUsers.filter(function(u) {
        return u.name === user;
    });
    // Add user if not exist
    if (!koneUser.length) {
        // Add user to list
        holodeck.kongOneUsers.push({
            name: user,
            online: online || false,
            userAgents: [userAgent]
        });
    } else {
        koneUser = koneUser[0];
        // Add a useragent if not in array
        if (userAgent && koneUser.userAgents.indexOf(userAgent) < 0) {
            koneUser.userAgents.push(userAgent);
        }
        // Change online status if different
        if (koneUser.online !== online && typeof online == "boolean") {
            koneUser.online = online;
        }
    }
    localStorage.setItem("kongOneUsers", JSON.stringify(holodeck.kongOneUsers));
}

// Get count of online users
function onlineUserCount() {
    return holodeck.kongOneUsers.filter(function(user) {
        return user.online;
    }).length;
}

// Get a name array of online users
function onlineUsers() {
    return holodeck.kongOneUsers.filter(function(user) {
        return user.online;
    }).map(function(user) {
        return user.name;
    });
}

// Check if admin/mod
function isAdmin(user) {
    return holodeck.kongOneAdmins.indexOf(user) > -1;
}
function isMod(user) {
    return holodeck.kongOneMods.concat(holodeck.kongOneAdmins).indexOf(user) > -1;
}

// Remove admin/mod/user
function removeUser(user) {
    var index = holodeck.kongOneUsers.map(function(u) { return u.name; }).indexOf(user);
    if (index >= 0) {
        holodeck.kongOneUsers.splice(index, 1);
    }
    localStorage.setItem("kongOneUsers", JSON.stringify(holodeck.kongOneUsers));
}

// Initialize
function init() {
    holodeck.updateUser = updateUser;
    holodeck.removeUser = removeUser;
    // Array of users who have connected to bot in chat (stored with online flag)
    holodeck.kongOneUsers = [];
    // Array of errors encountered
    holodeck.kongOneErrors = [];
    // Set admins and mods
    holodeck.kongOneAdmins = ["AlphaOverall"];
    holodeck.kongOneMods = ["NomuitJargon"];
    try {
        holodeck.kongOneUsers = JSON.parse(localStorage.getItem("kongOneUsers")) || [];
        holodeck.kongOneAdmins = JSON.parse(localStorage.getItem("kongOneAdmins")) || ["AlphaOverall"];
        holodeck.kongOneMods = JSON.parse(localStorage.getItem("kongOneMods")) || ["NomuitJargon"];
        holodeck.kongOneErrors = JSON.parse(localStorage.getItem("kongOneErrors")) || [];
    } catch(ex) {}


    // Init messager
    holodeck.kongOneMessager = new KongOneMessenger();

    // Verify commands
    if(!ChatDialogue.prototype.reply) {
        ChatDialogue.prototype.reply = function(a) {};
    }
    if(!ChatDialogue.prototype.showReceivedPM) {
        ChatDialogue.prototype.showReceivedPM = ChatDialogue.prototype.receivedPrivateMessage;
    }

    // Start a ping cycle to make sure users are online
    checkUsersOnline(holodeck.kongOneMessager, holodeck.kongOneUsers, 0);

    // Add pm received function
    ChatDialogue.prototype.receivedPrivateMessage = function(a) {
        // Usually unsuccessful when trying to send to offline users
        if (!a.data.success && a.data.from == "KOneBot") {
            // Set attempted connection to offline
            updateUser(a.data.to, false);
            return false;
        }
        // Incoming messages
        else if (a.data.success) {
            var msg = a.data.message, user = a.data.from;
            // Add a removal
            if (msg.toLowerCase() == "stop") {
                removeUser(user);
                return false;
            }
            try {
                console.log(msg);
                msg = JSON.parse(msg);
                var data = msg.data;
                var type = msg.type;

                // If error, save to array and log
                if (type == "error") {
                    holodeck.kongOneErrors.push({
                        user: user,
                        error: data,
                        userAgent: msg.userAgent
                    });
                    console.log(data, msg.userAgent);
                }
                // If event check for event type
                else if (type == "event") {
                    // Set user online if enter
                    if (data == "enter") {
                        updateUser(user, true, msg.userAgent);
                    }
                    // Set user offline if exit
                    else if (data == "exit") {
                        updateUser(user, false, msg.userAgent);
                    }
                    // Send user online count if admin
                    else if (data == "usercount" && isMod(user)) {
                        sendKongOneMessage(holodeck.kongOneMessager, "usercount", onlineUserCount(), [user], null, true);
                    }
                }
                // If admin and message type, send message
                else if (type == "message" && isAdmin(user)) {
                    sendKongOneMessage(holodeck.kongOneMessager, "message", data, onlineUsers(), null, true);
                } else if (type == "reload" && isAdmin(user)) {
                    localStorage.setItem("kongOneUsers", JSON.stringify(holodeck.kongOneUsers));
                    localStorage.setItem("kongOneAdmins", JSON.stringify(holodeck.kongOneAdmins));
                    localStorage.setItem("kongOneMods", JSON.stringify(holodeck.kongOneMods));
                    localStorage.setItem("kongOneErrors", JSON.stringify(holodeck.kongOneErrors));
                    location.reload();
                } else if (type == "admin" && isAdmin(user)) {
                    var index = holodeck.kongOneAdmins.indexOf(data);
                    if (index >= 0) {
                        holodeck.kongOneAdmins.splice(index, 1);
                    } else {
                        holodeck.kongOneAdmins.push(data);
                    }
                    localStorage.setItem("kongOneAdmins", JSON.stringify(holodeck.kongOneAdmins));
                } else if (type == "mod" && isAdmin(user)) {
                    var index = holodeck.kongOneMods.indexOf(data);
                    if (index >= 0) {
                        holodeck.kongOneMods.splice(index, 1);
                    } else {
                        holodeck.kongOneMods.push(data);
                    }
                    localStorage.setItem("kongOneMods", JSON.stringify(holodeck.kongOneMods));
                }
            }
            catch (e) {
                return;
            }
        }
        this.showReceivedPM(a);
    };
}