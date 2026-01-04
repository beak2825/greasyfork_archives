// ==UserScript==
// @name         Tinychat Enhancement Suite (TES)
// @namespace    https://greasyfork.org/en/users/1235961-420
// @version      2024.20.01v3
// @description  Fixes some Tinychat room shortcomings and adds useful features.
// @author       MutationObserver, phuein, legend, Lil Jim/420
// @match        https://tinychat.com/room/*
// @match        https://tinychat.com/*
// @exclude      https://tinychat.com/room/*?1
// @exclude      https://tinychat.com/settings/*
// @exclude      https://tinychat.com/subscription/*
// @exclude      https://tinychat.com/promote/*
// @exclude      https://tinychat.com/gifts/*
// @exclude      https://tinychat.com/home
// @exclude      https://tinychat.com/coins/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/482589/Tinychat%20Enhancement%20Suite%20%28TES%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482589/Tinychat%20Enhancement%20Suite%20%28TES%29.meta.js
// ==/UserScript==
/* jshint -W097 */

TESwsParser ``;
var waitingForDom = 0;
var initInterval = setInterval(function () {
    if (document.querySelector("tinychat-webrtc-app") && document.querySelector("tinychat-webrtc-app").shadowRoot) TESapp = runTES ``;
    else if(waitingForDom < 3) {
        tcl("Waiting for DOM...");
        waitingForDom += 1;
    }
}, 500);

function triggerMouseEvent(node, eventType='click', button=0) {
    let mouseEvent = new MouseEvent(eventType, {'button': button});
    node.dispatchEvent(mouseEvent);
}

function triggerKeyEvent(node, eventType, key, code) {
    var keyboardEvent = new KeyboardEvent(eventType, {
        code: key,
        key: key,
        charKode: code,
        keyCode: code
    });
    node.dispatchEvent(keyboardEvent);
}

var currentPageURLValidName = window.location.href.replace(/[\/:.]/g, '');

var settingMentions = [];
var settingIgnoredUsers = {};
var settingBannedUsers = {};
var settingSuperBannedUsers = {};
var pmHistory = [];
var pmHistoryNicks = [];
var lastPMReceivedNick;
var newChatboxUserScrolled = false;
var maxInputCharactersLimit = 500;
var myNick;
var BOT_MODE = false;
var autoMinRoomVol = 5;
var autoMinCamVol = 5;
var hiddenVideoOnly = [];

function runTES() {
    clearInterval(initInterval);

    try {
        /* Begin main function */
        var tinychat = TinychatApp.getInstance();
        var packetWorker = tinychat.defaultChatroom.packetWorker;
        var userlist = tinychat.defaultChatroom.userlist;
        var chatlog = tinychat.defaultChatroom.chatlog;

        // packetWorker.tcSocket.chatRoom._chatlog.chatroom._videolist.needToBlurOtherVids = false;
        packetWorker.tcSocket.chatRoom._chatlog.chatroom._videolist.blurOtherVids = function () {};

        var bodyElem = document.querySelector("body");

        bodyElem.style.overflow = "hidden"; // NOTE: Any issues with this??

        var webappOuter = document.querySelector("tinychat-webrtc-app");
        var webappElem = webappOuter.shadowRoot;
        var chatlogElem = webappElem.querySelector("tc-chatlog").shadowRoot;
        var titleElem = webappElem.querySelector("tc-title").shadowRoot;
        var sidemenuElem = webappElem.querySelector("tc-sidemenu").shadowRoot;
        var videomoderationElem = sidemenuElem.querySelector("tc-video-moderation").shadowRoot;
        var videolist = webappElem.querySelector("tc-videolist");
        var videolistElem = webappElem.querySelector("tc-videolist").shadowRoot;
        var videosHeaderMute = videolistElem.querySelector("#videos-header-sound-mute");
        var videosHeaderVolume = videolistElem.querySelector("#videos-header-volume");
        var videosHeaderVolumeLevel = videolistElem.querySelector("#videos-header-volume-level");
        var videosHeaderVolumeLevelChild = videolistElem.querySelector("#videos-header-volume-level > div");

        var chatlistElem = sidemenuElem.querySelector("tc-chatlist").shadowRoot;
        var userlistElem = sidemenuElem.querySelector("tc-userlist").shadowRoot;
        var userContextmenuElem = userlistElem.querySelector("tc-user-contextmenu").shadowRoot;

        var chatlogCSS = chatlogElem.querySelector("#chat-wrapper");
        var sidemenuCSS = sidemenuElem.querySelector("#sidemenu");
        var videomoderationCSS = videomoderationElem.querySelector("#moderatorlist");
        var webappCSS = webappElem.querySelector("#room");
        var chatlistCSS = chatlistElem.querySelector("#chatlist");
        var userlistCSS = userlistElem.querySelector("#userlist");
        var userContextmenuCSS = userContextmenuElem.querySelector("#main");
        var titleCSS = titleElem.querySelector("#room-header");
        var videolistCSS = videolistElem.querySelector("#videolist");
        var bodyCSS = document.querySelector("body");

        var userinfoCont = sidemenuElem.querySelector("#user-info > div");
        var scrollbox = chatlogElem.querySelector("#chat");
        //var unreadbubble = chatlogElem.querySelector("#input-unread");

        var resourceDirectory = document.querySelector('link[rel="manifest"]').getAttribute("href").split("manifest")[0]; // \/([\d\.\-])+\/
        var audioPop = new Audio(resourceDirectory + 'sound/pop.mp3');
        var giftsElemWidth = 127;
        var messageHeight;
        var chatboxHeight;
        var totalScrolledUp = 0;
        var freshInstall = (GM_listValues().length == 0);
        var isModerator = (!userlistElem.querySelector("#button-banlist").classList.contains("hidden"));
        var isPaidAccount = (sidemenuElem.querySelector("#sidemenu-wider"));

        var browserFirefox = navigator.userAgent.includes("Firefox/");
        var urlAddress = new URL(window.location.href);
        var urlPars = urlAddress.searchParams;
        var modder = 'memes'

        // Auto reload bot mode, after delay.
        if (GM_getValue("tes-BOT_MODE")) {
            setTimeout(() => {toggleBotMode()}, 4000);
        }

        var known_spam_text = [
            'PornPy',
            'SpankBang',
            'camhub.cc',
            'cutt.ly',
            'jihadology.net',
            'puursia',
            'the-white-house-washington',
            'Spuunkymomas',
            '30V1GnU',
            'yourpornowiki.com',
            'mehrnoosheskandari2',
            '░░░░░░░░█▒░░░░▄▀------',
            '\n\n\n\n\n'
        ];

        var messageQueryString = "#chat-content .message";
        var camQueryString = ".videos-items > div:not([id='youtube'])";

        var userCount = 0;
        var messageCount = 0;
        var camMaxedCurrent = null;
        //var autoScrollStatus = true;
        //var userScrolledChat = false;
        var roomName = webappOuter.getAttribute("roomname");
        var joinTime = getFormattedDateTime(new Date(), "time");
        var joinDate = getFormattedDateTime(new Date());

        var updBaLi = ()=>{tinychat.defaultChatroom.Banlist(()=>{})}
        var BaLi = ()=>{return tinychat.defaultChatroom.banlist};
        var unB = (a)=>{packetWorker.send(tinychat.defaultChatroom.tcPkt_Unban(a.id, ()=>{}))};

        // Black cams fix from Cosmo.
        TinychatApp.BLL.MediaConnection.prototype.Close = function() {
            if (this.rtc !== null) {
                let a = this.rtc;
                this.rtc = null;
                if (this.mediaStream !== null) {
                    if (this.mediaStream.active && a.signalingState !== "closed" && typeof a.removeStream === "function" && a.removeStream(this.mediaStream)) {
                        this.mediaStream.stop();
                        this.mediaStream = null;
                    }
                } else {
                    this.videolist.RemoveVideoRemote(this.handle);
                }
                if (a.signalingState !== "closed" && a.close()) {
                    console.log("MediaConnection.SignalingState: " + a.signalingState + " ->>> Close");
                }
            }
        };

        // Automatically reconnect if the disconnected popup appears.
        /*
        setInterval(function() {
            try {
                var reconnectPopup = document.querySelector("#content").shadowRoot.querySelector("#reconnect").shadowRoot.querySelector("#modal-content-reconnect > input[type=submit]");
                setTimeout(() => {
                    try {
                        reconnectPopup.click();
                        tcl('Automatically reconnecting to the room from popup...');

                        // Reload webcam if dropped.
                        var footerBroadcast = videolistElem.querySelector("#videos-footer-broadcast");
                        if (footerBroadcast.innerText !== "Start Broadcast") {
                            setTimeout(()=>{
                                footerBroadcast.click();
                                // Again.
                                setTimeout(()=>{
                                    footerBroadcast.click();
                                }, 1000);
                            }, 10000);
                        }
                    } catch(e) {}
                }, 1000)
            } catch(e) {}
        }, 10000)*/

        // Add new chatbox.
        var nodeChatbox = document.createElement("div");
        nodeChatbox.id = "chat-content-new";
        nodeChatbox.style.display = 'none';
        var nodeChatboxParent = chatlogElem.querySelector('#chat');
        nodeChatboxParent.appendChild(nodeChatbox);

        // Add new chat input.
        var nodeInput = document.createElement("div");
        nodeInput.id = "input-new";
        nodeInput.style.display = 'none';
        chatlogElem.querySelector('#chat-position').appendChild(nodeInput);
        var nodeInputSpan = document.createElement("span");
        nodeInputSpan.id = "input-new-span";
        nodeInput.appendChild(nodeInputSpan);
        nodeInputSpan.contentEditable = "true";
        nodeInputSpan.setAttribute("data-ph", "Type a message...");
        // Remove formatting from paste.
        nodeInputSpan.addEventListener("paste", function(e) {
            e.preventDefault();
            var text = e.clipboardData.getData("text/plain");
            document.execCommand("insertHTML", false, text);
        });

        // Track chat input box.
        var inputBox = chatlogCSS.querySelector('div#chat-position > form#input > textarea');
        // Limit characters to avoid disconnection.
        maxInputCharactersLimit = inputBox.maxLength - 5;

        // Setup new chat input.
        nodeInputSpan.onkeyup = function(e) {
            if (e.key == "Enter" && !e.ctrlKey) {
                e.preventDefault();
                e.stopPropagation();

                // Cut to max character limit.
                if (nodeInputSpan.innerText.length > maxInputCharactersLimit) {
                    nodeInputSpan.innerText = nodeInputSpan.innerText.substr(0, maxInputCharactersLimit);
                }

                // Pass event to original input form.
                inputBox.value = nodeInputSpan.innerText;

                // Emulate Enter press for text-changing events.
                // Extra press to catch events before form element sends.
                triggerKeyEvent(inputBox, "keydown", "Control", 17);
                triggerKeyEvent(inputBox, "keyup", "Control", 17);
                triggerKeyEvent(inputBox, "keydown", "Enter", 13);
                triggerKeyEvent(inputBox, "keyup", "Enter", 13);

                nodeInputSpan.innerText = '';

                // Scroll down on Enter basically.
                updateScroll(true);

                return;
            }

            if (e.key == "Enter" && e.ctrlKey) {
                e.preventDefault();
                e.stopPropagation();

                // Add newline.
                document.execCommand('insertHTML', false, '<br><br>');

                return;
            }

            // Cut to max character limit.
            if (nodeInputSpan.innerText.length > maxInputCharactersLimit) {
                nodeInputSpan.innerText = nodeInputSpan.innerText.substr(0, maxInputCharactersLimit);
            }
        }

        // Animate new chatbox toggle button border color,
        // to encourage users to use it!
        /*var annoyingflashycountchattoggle = 0;
        var annoyingflashycountchattoggletimer = setInterval(function() {
            if (chatlogElem.querySelector('#chat-position > #input').style.display !== 'none') {
                chatlogElem.querySelector("#tes-chatToggle").style.borderColor = 'purple';
                chatlogElem.querySelector("#tes-chatToggle").style.borderWidth = '2px';

                setTimeout(function() {
                    chatlogElem.querySelector("#tes-chatToggle").style.borderColor = '';
                    chatlogElem.querySelector("#tes-chatToggle").style.borderWidth = '';
                }, 2000)
            }

            // Stop after a while.
            annoyingflashycountchattoggle += 1;
            if (annoyingflashycountchattoggle === 20) {
                clearInterval(annoyingflashycountchattoggletimer);
            }
        }, 2000);*/

        // New chatbox inputbox overrides.
        nodeInputSpan.onkeydown = function(e) {
            if (e.key == "Enter" && !e.ctrlKey) {
                // Don't add a newline when submitting.
                e.preventDefault();
                e.stopPropagation();
            }
        }

        var chatContent = chatlogElem.querySelector('#chat-content');
        var chatContentNew = chatlogElem.querySelector('#chat-content-new');

        // Load previously used chatbox, after a delay to avoid error.
        var toggleDefaultChatTry = setInterval(()=>{
            try {
                if (GM_getValue("defaultChat") === false) toggleDefaultChat();

                clearInterval(toggleDefaultChatTry);

                // Load chat log for new chatbox.
                var newChatboxLog = GM_getValue(currentPageURLValidName + "newChatboxLog") || '';
                nodeChatbox.innerHTML = newChatboxLog;
                nodeChatbox.scrollIntoView(false);
            } catch(e) {}
        }, 1000)

        // Toggle to normal chat when clicking a PM.
        // Toggle back after closing it.
        var toggledNewChatboxForPM = false;
        (function() {
            var proxied = chatlog.selectChat;
            chatlog.selectChat = function() {
                // New chatbox is showing, while clicking a PM.
                if (chatContent.style.display == 'none') {
                    toggleDefaultChat(true);
                    toggledNewChatboxForPM = true;
                }

                return proxied.apply(this, arguments);
            };
        })();

        (function() {
            var proxied = chatlog.selectPublic;
            chatlog.selectPublic = function() {
                // Old chatbox is showing, and PM was clicked while new chatbox was showing.
                if (chatContent.style.display != 'none' && toggledNewChatboxForPM) {
                    toggleDefaultChat();
                    toggledNewChatboxForPM = false;
                }

                return proxied.apply(this, arguments);
            };
        })();

        // Track user scroll to prevent autoscroll.
        var newChatboxCheckIfUserScrolled = function(e) {
            if (nodeChatboxParent.scrollHeight - nodeChatboxParent.scrollTop - nodeChatboxParent.clientHeight < 1) {
                newChatboxUserScrolled = false;
            } else {
                newChatboxUserScrolled = true;
            }
        }
        nodeChatboxParent.onmousewheel = newChatboxCheckIfUserScrolled;
        nodeChatboxParent.onmouseup = newChatboxCheckIfUserScrolled;

        // Remember ignored users.
        var manuallyIgnored = GM_getValue("manuallyIgnored") || [];
        // TODO BUGFIX: testing why it's not working reliably.
        console.log('TES manuallyIgnored:', manuallyIgnored);
        // Ignore from saved list.
        setTimeout(()=>{
            for (let i=0; i < userlist.items.length; i++) {
                let u = userlist.items[i];
                let nick = u.nickname;
                //let username = u.username;

                ignoreFromManualList(nick, u);
            }
        }, 2000)

        var ignoreOriginal = userlist.ignore;
        userlist.ignore = function() {
            let a = arguments[0];

            let b = a.nickname.toUpperCase();
            let c = a.isUsername ? a.username.toUpperCase() : '';

            ignoreOriginal.apply(this, arguments);

            let i = manuallyIgnored.indexOf(b);
            let j = manuallyIgnored.indexOf(c);

            // Add ignored.
            if (userlist.isIgnored(a)) {
                // Don't add "guest", too generic.
                if (i === -1 && b !== 'GUEST') {
                    manuallyIgnored.push(b);
                }

                if (j === -1 && c !== '') {
                    manuallyIgnored.push(c);
                }

                GM_setValue("manuallyIgnored", manuallyIgnored);
                //console.log('added to TES ignored list: ' + b)
            }
        }

        var unignoreOriginal = userlist.unignore;
        userlist.unignore = function() {
            let a = arguments[0];

            let b = a.nickname.toUpperCase();
            let c = a.isUsername ? a.username.toUpperCase() : '';

            unignoreOriginal.apply(this, arguments);

            let i = manuallyIgnored.indexOf(b);
            let j = manuallyIgnored.indexOf(c);

            // Remove unignored.
            if (!userlist.isIgnored(a) && i > -1) {
                if (i > -1) {
                    manuallyIgnored.splice(i);
                }

                if (j > -1 && c !== '') {
                    manuallyIgnored.splice(j);
                }

                GM_setValue("manuallyIgnored", manuallyIgnored);
                //console.log('removed from TES ignored list: ' + b)
            }
        }

        var showToast = tinychat.defaultChatroom.app.showToast;
        function ignoreFromManualList(nick, u=null) {
            try {
                if (!u) {
                    u = userlist.getByNickname(nick);
                }

                // Only if not already ignored.
                if (userlist.isIgnored(u)) return;

                let username = u.username || '';
                username = username.toUpperCase();

                nick = nick.toUpperCase();

                let i = manuallyIgnored.indexOf(username);
                let j = manuallyIgnored.indexOf(nick);

                // Always ignore by username, but only ignore nickname if there is no username.
                // if (i > -1 || (j > -1 && !username)) {

                // Ignore by username and nickname, for spammers that change accounts.
                if ( (i !== '' && i > -1) || (j !== '' && j > -1) ) {
                    // Temporary disable the annoying toast popup notification.
                    tinychat.defaultChatroom.app.showToast = ()=>{};
                    userlist.ignore(u);
                    tinychat.defaultChatroom.app.showToast = showToast;
                    tcl('Autoignoring ' + nick + ' (' + username + ')')
                }
            } catch (e) {
                tcl("error ignoreFromManualList: " + e.message);
            }
        }

        document.title = roomName + " - Tinychat";
        declareGlobalVars();
        var settingsWaitInterval = setInterval(waitForSettings, 1000);
        // Except data that needs to be loaded into var immediately,
        // as it used by async events in the UI.
        ignoredManager('load', true);

        injectCSS();
        injectElements();

        titleElem.querySelector("#tes-header-grabber").addEventListener('mouseup', function() {
            settingsQuick["ToggleHeader"] = !settingsQuick["ToggleHeader"];
            GM_setValue("tes-ToggleHeader", settingsQuick["ToggleHeader"]);
        });

        if (userinfoCont.hasAttribute("title")) {
            bodyCSS.classList.add("logged-in");
            sidemenuElem.querySelector("#sidemenu").classList.add("logged-in");
        }
        if (isModerator) {
            userlistElem.querySelector("#userlist").classList.add("tes-mod");
            chatlistElem.querySelector("#chatlist").classList.add("tes-mod");
        }

        // Add open-mic option by pressing middle-mouse button on mic button.
        var talkBtn = videolistElem.querySelector("#videos-footer-push-to-talk");
        var micTalking = false;
        talkBtn.addEventListener("mouseup", function (e) {
            if (e.which == 2) {
                e.preventDefault();
                e.stopPropagation();

                triggerMouseEvent(talkBtn, "mousedown");
            }
        });
        // Ignore further events relating to this click.
        talkBtn.addEventListener("mouseup", function (e) {
            if (e.which == 2) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
        talkBtn.addEventListener("click", function (e) {
            if (e.which == 2) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
        // Add instructions in title (tooltip.)
        talkBtn.setAttribute("title", "Wheel-Click to talk freely.");

        // Add talking tracking.
        setInterval(function () {
            for (let i = 0; i < 12; i++) {
                try {
                    let audioLevel = packetWorker.tcSocket.chatRoom._chatlog.chatroom._videolist.items[i].audiolevel;
                    let nick = packetWorker.tcSocket.chatRoom._chatlog.chatroom._videolist.items[i].userentity.nickname;
                    let indicator = videolistElem.querySelector('div#videolist > div#videos-content > div#videos > div.videos-items:last-child > div#camUser-' + nick +
                        ' > tc-video-item').shadowRoot.querySelector('div.video > div > div.overlay > .icon-tes-talking');

                    indicator.style.opacity = audioLevel;
                } catch (e) {
                    // pass
                }
            }
        }, 250);

        // Catch a chat message before it's sent.
        let msgHistory = [];
        var msgHistoryTracker;
        // Track the currently typed message that wasn't sent.
        var msgHistoryTyping = '';
        inputBox.onkeydown = function(e) {
            if (!inputBox.value) return;

            if (e.key == "Enter") {
                var v = inputBox.value.trim();

                // Ignore value repetitions.
                //if (v && msgHistory[msgHistory.length-1] === v) return;

                msgHistory.push(v);

                // Limit size of history.
                if (msgHistory.length > 100) {
                    msgHistory.shift();
                }

                // Point tracker at next message index.
                msgHistoryTracker = msgHistory.length;

                // Override for PM format, if applicable.
                if (v.startsWith('/')) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (v.startsWith('/<')) {
                        // Respond to last received PM.
                        if (!lastPMReceivedNick || lastPMReceivedNick === myNick) {
                            inputBox.value = '';
                            return;
                        }

                        v = v.replace('/<', '/' + lastPMReceivedNick);
                    } else if (v.startsWith('/>')) {
                        // PM again to the same user used last.
                        var lastNick = pmHistoryNicks[pmHistoryNicks.length-1];

                        if (!lastNick || lastNick === myNick) {
                            inputBox.value = '';
                            return;
                        }

                        v = v.replace('/>', '/' + lastNick);
                    }

                    let sent = sendPM(v, true);

                    // IMPORTANT! Don't let messages accidentally get sent to public chat!
                    inputBox.value = '';

                    return;
                }
            }

            if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
                e.preventDefault();
                e.stopPropagation();
            }
        }

        function sendPM(msg, silentFail=false) {
            let m = msg.slice(1);
            let i = m.search(/\s/);
            let parts = [m.slice(0,i), m.slice(i+1)];

            // Must have message.
            if (!parts[1]) return;

            let nick = parts[0];
            m = parts[1];

            // Remove previous failed sending identifier character.
            if (m.startsWith('⠀')) m = m.slice(1);

            try {
                let u = tinychat.defaultChatroom.userlist.getByNickname(nick);
                let selfuser = tinychat.defaultChatroom.selfUser();

                if (!u) {
                    //tinychat.defaultChatroom.SendMessagePrivate('⠀' + m, selfuser, selfuser);
                    tinychat.defaultChatroom.chatlog.SendMessage(selfuser, '⠀' + m);
                    return;
                }

                //tinychat.defaultChatroom.SendMessagePrivate(m, selfuser, u);
                tinychat.defaultChatroom.chatlog.SendMessage(u, m);

                // chatContent.style.display != 'none'
                // tinychat.defaultChatroom.chatlog.openprivate(u);
                //tinychat.defaultChatroom.packetWorker.send(tinychat.defaultChatroom.tcPkt_Msg_Private(m, u.handle, tinychat.defaultChatroom.onSendMessagePrivateCallback));

                return true;
            } catch(err) {
               silentFail || tcl(`Failed to PM user ${nick} - ERROR: ${err}`);
            }
        }

        var advert = "BIG CAMS - MIC INDICATOR - REMEMBER VOLUMES - RESTORE CHAT: https://greasyfork.org/en/scripts/389657-tinychat-enhancement-suite-tes";
        var discord = "Don't lose contact with your chat friends! https://discord.gg/Me4xZ5W - Cause we all get banned sometimes. Use your chat name.";
        var inputBoxHeight = inputBox.clientHeight;
        //var lastInputBoxHeight = inputBoxHeight;

        var toastLength = 3000;
        inputBox.onkeyup = function(e) {
            let v = inputBox.value.trim();

            /*
            // Load previous message sent.
            if (e.key === 'ArrowUp') {
                // Keep currently typed message.
                if (msgHistoryTracker === msgHistory.length) {
                    msgHistoryTyping = inputBox.value;
                }

                if (msgHistoryTracker > 0) {
                    msgHistoryTracker -= 1;
                    inputBox.value = msgHistory[msgHistoryTracker];
                }
                return;
            }
            // Or scroll forward in message history.
            // Clears text if done.
            if (e.key === 'ArrowDown') {
                if (msgHistoryTracker < msgHistory.length-1) {
                    msgHistoryTracker += 1;
                    inputBox.value = msgHistory[msgHistoryTracker];
                } else if (msgHistoryTracker === msgHistory.length-1) {
                    msgHistoryTracker += 1;
                    inputBox.value = msgHistoryTyping;
                }
                return;
            }*/

            // Clear on Escape.
            if (e.key === 'Escape') {
                inputBox.value = '';
                return;
            }

            if (!inputBox.value) {
                // Restore height if text deleted.
                inputBox.style.height = inputBoxHeight + "px";

                // Scroll down on Enter basically.
                updateScroll(true);
            }

            // Advertise the extension.
            if (v === '/ad') {
                inputBox.value = advert;
                return;
            }

            // Advertise the discord.
            if (v === '/discord') {
                inputBox.value = discord;
                return;
            }

            // Clean manual-ignore list.
            if (v === '/ignores') {
                inputBox.value = '';

                GM_setValue("manuallyIgnored", []);
                manuallyIgnored = [];
                return;
            }

            // Kick all users.
            if (v === '/nuke') {
                inputBox.value = '';

                if (!tinychat.defaultChatroom.isOperator()) return;

                try {
                    for (let i=0; i < userlist.items.length; i++) {
                        let user = userlist.items[i];

                        if (user.isOperator) continue;

                        userlist.kick(user);
                    }
                } catch(e) { tcl('autokicker nuke: ' + e); }

                return;
            }

            // Unban all users.
            if (v === '/unban') {
                inputBox.value = '';

                if (!tinychat.defaultChatroom.isOperator()) return;

                try {
                    // Load and clear banlist.
                    updBaLi();

                    setTimeout(() => {
                        let bl = BaLi();

                        for (let i=0; i < bl.length; i++) {
                            let user = bl[i];
                            unB(user);
                        }

                        tcl("Done clearing the banlist!");
                    }, 2000);
                } catch(e) { tcl('clear banlist: ' + e); }

                return;
            }

            // Unban speecific user by nickname.
            if (v.startsWith('/unban')) {
                // Grab first arg.
                let username = v.split(' ')[1];

                inputBox.value = '';

                if (!tinychat.defaultChatroom.isOperator()) return;

                // Load the banlist.
                updBaLi();

                setTimeout(() => {
                    let bl = BaLi();

                    if (!bl) {
                        tcl('unban user: Banlist is empty!');
                        return;
                    }

                    try {
                        // Get banlist item by account name.
                        let user = bl.filter(item => item.username === username);

                        // If not found, try nickname.
                        if (!user.length) user = bl.filter(item => item.nickname === username);

                        // Not found.
                        if (!user.length) {
                            tcl('unban user: User "'+username+'" not found in the banlist!')
                            return;
                        }

                        // Should only return 1 match.
                        user = user[0];

                        // Uban user.
                        tinychat.defaultChatroom.Unban(user);
                        tcl('unban user: Unbanned user "'+username+'"')

                    } catch(e) { tcl('unban user: ' + e); }
                }, 2000);

                return;
            }

            // Clear new chatbox.
            if (v === '/clear' || v === '/empty') {
                inputBox.value = '';

                try {
                    chatlogElem.querySelector('#chat-content-new').innerHTML = '';
                    // Clear auto reloaded log.
                    GM_setValue(currentPageURLValidName + "newChatboxLog", '');
                } catch(e) { tcl('clear new chatbox:', e); }

                return;
            }
        };

        // Load room volume.
        var roomVolume = GM_getValue(currentPageURLValidName + "roomVolume", 100);

        if (roomVolume !== 100) {
            videolist.volume = roomVolume;
            tcl('Room volume set to: '+roomVolume);
        }

        var videosHeaderVolumeLevelFunction = function(e) {
            // Middle mouse click to lower volume.
            if (e.which === 2) {
                videolist.volume = autoMinRoomVol;
            }

            GM_setValue(currentPageURLValidName + "roomVolume", videolist.volume);

            // Also update room mute.
            if (roomMuted) {
                roomMuted = !roomMuted;
                GM_setValue(currentPageURLValidName + "roomMuted", roomMuted);
            }
        }

        videosHeaderVolumeLevel.onmouseup = videosHeaderVolumeLevelFunction;
        videosHeaderVolume.onwheel = videosHeaderVolumeLevelFunction;

        // Remember room mute setting.
        var roomMuted = GM_getValue(currentPageURLValidName + "roomMuted", false);

        if (roomMuted) {
            videolist._volMuteToggle();
        }

        videosHeaderMute.onclick = function(e) {
            roomMuted = !roomMuted;
            GM_setValue(currentPageURLValidName + "roomMuted", roomMuted);
        }

        // Load user cam volume.
        var camsVolume = GM_getValue("camsVolume", {});

        var videosCamVolumeLevelFunction = function(e, camItem, volume) {
            let cam_names = getCamUsername(camItem);

            var camName = cam_names[0];
            var userName = cam_names[1];

            // Prefer username.
            let name = camName;
            if (userName) name = userName;

            if (volume === -1) delete camsVolume[name]
            else camsVolume[name] = volume;

            GM_setValue("camsVolume", camsVolume);
        }

        var playCams = function() {
            document.querySelector("#content").shadowRoot.querySelector("#room-content > tc-chatlog").shadowRoot.querySelector("#textarea").onclick = null;
            document.querySelector("#content").shadowRoot.querySelector("#room-content > tc-chatlog").shadowRoot.querySelector("#input-new-span").onclick = null;

            videolistElem.querySelectorAll('tc-video-item').forEach(item => {
                let video = item.shadowRoot.querySelector('video');
                video.play();

                let camItemShadowroot = item.shadowRoot;

                let names = getCamUsername(item);

                let camName = names[0];
                let userName = names[1];

                // Optionally hide all cams.
                if (settingsQuick["HideAllCams"] === "true" || urlPars.get("hideallcams") === "") {
                    camItemShadowroot.querySelector("button.icon-visibility").click();
                    camItemShadowroot.querySelector("button.icon-visibility").click();
                    return;
                }

                // Hide ignored user.
                if (settingsQuick["IgnoredMonitor"]) {
                    if (settingIgnoredUsers.hasOwnProperty(userName.toUpperCase()) || settingIgnoredUsers.hasOwnProperty(camName.toUpperCase())) {
                        camItemShadowroot.querySelector("button.icon-visibility").click();
                        camItemShadowroot.querySelector("button.icon-visibility").click();
                        return;
                    }
                }

                // Hide all new cams.
                if (settingsQuick["HideNewCams"]) {
                    camItemShadowroot.querySelector("button.icon-visibility").click();
                    camItemShadowroot.querySelector("button.icon-visibility").click();
                    return;
                }
            });
        }

        // FF needs user approval for cams.
        if (browserFirefox) {
            document.querySelector("#content").shadowRoot.querySelector("#room-content > tc-chatlog").shadowRoot.querySelector("#textarea").onclick = playCams;
            document.querySelector("#content").shadowRoot.querySelector("#room-content > tc-chatlog").shadowRoot.querySelector("#input-new-span").onclick = playCams;
        }

        // Settings.
        var settingsQuick = {
            "RememberIgnore": (GM_getValue("tes-RememberIgnore") == "true" || GM_getValue("tes-RememberIgnore") == undefined),
            "MentionsMonitor": (GM_getValue("tes-MentionsMonitor") == "true" || GM_getValue("tes-MentionsMonitor") == undefined),
            "NotificationsOff": (GM_getValue("tes-NotificationsOff") == "true"),
            "ChangeFont": (GM_getValue("tes-ChangeFont") == "true" || GM_getValue("tes-ChangeFont") == undefined),
            "NightMode": (GM_getValue("tes-NightMode") == "true"),
            "NightModeBlack": (GM_getValue("tes-NightModeBlack") == "true" || GM_getValue("tes-NightModeBlack") == undefined),
            "TextColorOverride": (GM_getValue("tes-TextColorOverride")),
            "Spotlight": (GM_getValue("tes-Spotlight") == "true" || GM_getValue("tes-Spotlight") == undefined),
            "MaxedCamLeft": (GM_getValue("tes-MaxedCamLeft") == "true" || GM_getValue("tes-MaxedCamLeft") == undefined),
            "BorderlessCams": (GM_getValue("tes-BorderlessCams") == "true"),
            "HideNewCams": (GM_getValue("tes-HideNewCams") == "true"),
            "Ignored": (GM_getValue("tes-Ignored") == "true"),
            "IgnoredMonitor": (GM_getValue("tes-IgnoredMonitor") == "true" || GM_getValue("tes-IgnoredMonitor") == undefined),
            "Banned": (GM_getValue("tes-Banned") == "true"),
            "BannedMonitor": (GM_getValue("tes-BannedMonitor") == "true"),
            "BannedMonitorWhitelist": (GM_getValue("tes-BannedMonitorWhitelist") == "true"),
            "ToggleHiddenMsgs": (GM_getValue("tes-ToggleHiddenMsgs") == "true" || GM_getValue("tes-ToggleHiddenMsgs") == undefined),
            "ToggleHeader": (GM_getValue("tes-ToggleHeader")),
        };

        if (settingsQuick["ChangeFont"]) bodyElem.classList.add("tes-changefont");
        if (settingsQuick["NightMode"]) nightmodeToggle(true);
        if (settingsQuick["MaxedCamLeft"]) videolistCSS.classList.add("tes-leftcam");
        if (settingsQuick["BorderlessCams"]) borderlessCamsToggle(true);
        if (settingsQuick["ToggleHeader"]) titleElem.querySelector("#tes-header-grabber").click();

        setTimeout(function() {
            if (settingsQuick["TextColorOverride"]) textColorOverride(settingsQuick["TextColorOverride"]);

            if (GM_getValue("tes-sidemenuCollapsed")) sidemenuGrabber();
        }, 2000);

        if (browserFirefox && 1 == 2) {
            titleElem.querySelector("#room-header-info").insertAdjacentHTML("afterend", `
	<div id="tes-firefoxwarning" class="style-scope tinychat-title"
	style="font-size: .75em; background: white; color: grey; width: 200px; padding: 5px; line-height: 13px;vertical-align: middle;border: #ddd 1px solid;border-width: 0px 1px 0px 1px;">
		<div class="style-scope tinychat-title" style="display: table;height: 100%;">
			<span style="display: table-cell; vertical-align: middle;top: 16%;" class="style-scope tinychat-title">
			Tinychat Enhancement Suite requires Chrome. Other browsers only have autoscroll & cam maxing.
			</span>
		</div>
	</div>
	`);
        }

let is420EventTriggered = false; // Flag to track if the event has occurred
   const countdownText = document.createElement('span');
countdownText.id = 'countdownText';
countdownText.style.position = 'absolute';
countdownText.style.bottom = '36px';
countdownText.style.right = '420px';
countdownText.style.margin = '2px';
countdownText.style.color = '#ffffff';
countdownText.style.fontSize = '25px';
countdownText.style.fontWeight = 'bold';
countdownText.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)';
countdownText.style.backgroundColor = '#333333';
countdownText.style.padding = '10px';
countdownText.style.borderRadius = '10px';
countdownText.textContent = '';

const v420FooterYoutube = videolistElem.querySelector("#videos-footer");
const v420FooterParent = v420FooterYoutube.parentElement;

if (v420FooterParent) {
  v420FooterParent.appendChild(countdownText);
  updateCountdown(); // Call the updateCountdown function immediately
  setInterval(updateCountdown, 1000); // Update the countdown every second
}

function updateCountdown() {
  const currentDateTime = new Date();
  const minutes = currentDateTime.getMinutes();
  const seconds = currentDateTime.getSeconds();
    // Check if event is already triggered and in the process of fading out
  if (is420EventTriggered) {
    return; // Stop updating the countdown
  }
  if (minutes === 20 && seconds === 0) {
    countdownText.style.display = 'block';
    countdownText.style.right = '380px';
    countdownText.textContent = "Cheers, Happy 420!";
    fadeOut(countdownText, 61000); // Fade out after 2 minutes
    is420EventTriggered = true; // Set the flag to true
  } else if ((minutes >= 17 && minutes < 20) || (minutes === 20 && seconds > 0)) {
    countdownText.style.display = 'block';
    const remainingMinutes = 19 - minutes;
    const remainingSeconds = 60 - seconds;
    countdownText.style.right = '420px';
    countdownText.textContent = `You have ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''} until 420!`;
  } else {
    countdownText.textContent = ""; // Default text when not within the desired time range
    countdownText.style.opacity = ''; // Reset opacity style
    countdownText.style.display = 'none'; // Hide the element
    is420EventTriggered = false; // Reset the flag
  }
}

function fadeOut(element, duration) {
  let opacity = 1;
  const interval = 1000; // Fade out interval in milliseconds (now 1 second for smoother fade)
  const steps = duration / interval;
  const opacityStep = opacity / steps;

  const fadeOutInterval = setInterval(() => {
    if (opacity > 0) {
      opacity -= opacityStep;
      element.style.opacity = opacity.toFixed(2);
    } else {
      clearInterval(fadeOutInterval);
      element.style.opacity = ''; // Reset opacity style
      element.style.display = 'none'; // Hide the element
      element.textContent = ''; // Clear the countdown text after fading out
      is420EventTriggered = false; // Reset the flag
    }
  }, interval);
}


        // Define variables for drag functionality
let isDragging = false;
let startX = 0;
let startY = 0;
let startLeft = 0;
let startTop = 0;

// Create a button element for the watch party
const watchPartyButton = document.createElement('button');
watchPartyButton.id = 'watchPartyButton';

// Set the CSS styles for positioning the button
watchPartyButton.style.position = 'block';
watchPartyButton.style.bottom = '55px';
watchPartyButton.style.left = '25px';

        // Insert the watch party button after the #videos-footer-youtube element
const videosFooterYoutube = videolistElem.querySelector("#videos-footer-youtube");
        const videosFooterYoutubeb = videolistElem.querySelector("#videos-footer-broadcast");
if (videosFooterYoutube) {
   videosFooterYoutube.style.display = 'none';
}

// Append the watch party button to the #videos-footer-youtube parent element
const videosFooterParent = videosFooterYoutubeb.parentElement;
if (videosFooterParent) {
  videosFooterYoutubeb.insertAdjacentElement('beforebegin', watchPartyButton);
}

// Define the function to handle mousemove event during dragging
function handleMouseMove(e) {
  if (isDragging) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const container = document.querySelector('#watchPartyContainer');
    container.style.left = startLeft + dx + 'px';
    container.style.top = startTop + dy + 'px';
  }
}

// Define the function to handle mouseup event to stop dragging
function handleMouseUp() {
  isDragging = false;
}

// Define the function to handle mousedown event to start dragging
function handleMouseDown(e) {
  const container = document.querySelector('#watchPartyContainer');

  if (e.target === container) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = container.offsetLeft;
    startTop = container.offsetTop;
  }
}

// Define the function to handle input event for adjusting size
function handleSizeInput(e) {
  const value = e.target.value;
  const container = document.querySelector('#watchPartyContainer');
  const iframe = document.querySelector('#watchPartyFrame');

// Calculate new width and height based on the input value
const aspectRatio = 16 / 9; // Set the desired aspect ratio, such as 16:9
const maxWidth = 1920; // Set the maximum width of the box
const maxHeight = 1080; // Set the maximum height of the box
const minWidth = 128; // Set the minimum width of the box
const minHeight = 72; // Set the minimum height of the box

const widthRange = maxWidth - minWidth;
const heightRange = maxHeight - minHeight;

const newWidth = value * widthRange + minWidth;
const newHeight = (value * widthRange) / aspectRatio + minHeight;

container.style.width = newWidth + 'px';
container.style.height = newHeight + 'px';
iframe.style.width = newWidth + 'px';
iframe.style.height = newHeight + 'px';
}

// Define the function to open the watch party link
function openWatchParty() {
  const roomName = extractRoomName(window.location.href);
  // Create a container div for the iframe with a border
  const container = document.createElement('div');
  container.id = 'watchPartyContainer';
  container.style.position = 'fixed';
  container.style.top = '20px';
  container.style.left = '20px';
  container.style.width = '1280px';
  container.style.height = '720px';
  container.style.border = '3px solid #ccc';
  container.style.zIndex = '9999';
  container.style.cursor = 'move';

  // Create an iframe element for the Watch Party webpage
  const watchPartyFrame = document.createElement('iframe');
  watchPartyFrame.id = 'watchPartyFrame';
  watchPartyFrame.src = `https://www.watchparty.me/r/${roomName}`;
  watchPartyFrame.style.width = '100%';
  watchPartyFrame.style.height = '100%';
  watchPartyFrame.style.border = 'none';

  // Append the iframe to the container
  container.appendChild(watchPartyFrame);

  // Create a scale/bar element for adjusting size
  const sizeScale = document.createElement('input');
  sizeScale.type = 'range';
  sizeScale.min = '0';
  sizeScale.max = '1';
  sizeScale.step = '0.01';
  sizeScale.value = '0.5';
  sizeScale.style.width = '100%';
  sizeScale.style.marginTop = '10px';

  // Add an input event listener to handle size adjustment
  sizeScale.addEventListener('input', handleSizeInput);

  // Append the size scale to the container
  container.appendChild(sizeScale);

  // Create a button element for closing the watch party container
  const closeButton = document.createElement('button');
  closeButton.innerText = 'Close';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '5px';
  closeButton.style.right = '5px';

  // Function to extract the room name from the URL
function extractRoomName(url) {
  const regexPattern = /tinychat\.com\/(?:room\/)?(\w+)/;
  const match = url.match(regexPattern);
  return match ? match[1] : 'defaultRoom'; // Return a default room name if no match is found
}
  // Define the function to handle the close button click event
  function closeWatchParty() {
    container.remove();
  }

  // Append the close button to the container
  container.appendChild(closeButton);

  // Add a click event listener to the close button
  closeButton.addEventListener('click', closeWatchParty);

  // Define variables for drag functionality
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  // Define the function to handle mousemove event during dragging
  function handleMouseMove(e) {
    if (isDragging) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      container.style.left = startLeft + dx + 'px';
      container.style.top = startTop + dy + 'px';
    }
  }

  // Define the function to handle mouseup event to stop dragging
  function handleMouseUp() {
    isDragging = false;
  }

  // Define the function to handle mousedown event to start dragging
  function handleMouseDown(e) {
    if (e.target === container) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = container.offsetLeft;
      startTop = container.offsetTop;
    }
  }

  // Add event listeners for drag functionality
  container.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  // Append the container to the document body
  document.body.appendChild(container);
}

// Add a click event listener to the button
watchPartyButton.addEventListener('click', openWatchParty);

function updateNotifcation(){

  fetch('https://gist.githubusercontent.com/420Scripts/e2148719ff1df7ff3a4081f799987681/raw/fdff50a32c3a4799490d8c3675fd692773f19aeb/Updates.txt')
    .then(response => response.text())
    .then(textContent => {
        const spanElement = titleElem.querySelector('#tes-updateNotifier span');
          console.log(spanElement.textContent);
          spanElement.textContent = textContent;
    })
    .catch(error => {
      console.log('Error:', error);
    });

}

        function waitForSettings() {
            try {
                settingsVisible = false;
                if (titleElem.querySelector("#room-header-gifts") != null) {
                    clearInterval(settingsWaitInterval);

                    giftsElemWidth = titleElem.querySelector("#room-header-gifts").offsetWidth;
                    if (titleElem.querySelector("#room-header-gifts-items") == null) {
                        giftsElemWidth1000 = giftsElemWidth + 45;
                    } else {
                        giftsElemWidth1000 = giftsElemWidth;
                    }
                    if (titleCSS.querySelector("#titleCSS")) {
                        titleCSS.querySelector("#titleCSS").innerHTML += `
				#tes-settings {
					right: ` + giftsElemWidth + `px;
				}
			`;
                    }

                    var sidemenuFakeBorder = document.createElement("span");
                    sidemenuFakeBorder.setAttribute("id", "tes-sidemenufakeborder");
                    sidemenuCSS.insertAdjacentElement("beforeend", sidemenuFakeBorder);

                    settingsElem = titleElem.querySelector("#room-header-gifts").insertAdjacentHTML("beforebegin", `
		<div id="tes-settings">
			<div id="tes-settingsBox" class="hidden">
				<p id="title"><a href="https://greasyfork.org/en/scripts/32964-tinychat-enhancement-suite" target="_blank">Tinychat Enhancement Suite</a></p>
				<div id="tes-settings-mentions" class="tes-setting-container">
					<input type="checkbox">
					<span class="label">
						Alert phrases
						<span class="info" data-title='A comma-separated list of phrases to alert/highlight for. Example of 3 phrases: "hello, Google Chrome, sky"'>?</span>
					</span>
					<div class="inputcontainer">
						<input class="text" placeholder="enter alert phrases here"><button class="save blue-button">save</button>
					</div>
				</div>
				<div id="tes-settings-rememberignore" class="tes-setting-container" style="display: none;">
					<input type="checkbox">
					<span class="label">
						Remember Ignore
					</span>
				</div>
				<div id="tes-settings-notifications" class="tes-setting-container">
					<input type="checkbox">
					<span class="label">
						Hide notifications
					</span>
				</div>
				<div id="tes-settings-changefont" class="tes-setting-container">
					<input type="checkbox">
					<span class="label">
						Improve font
						<span class="info" data-title='The default font is too thin in some browsers'>?</span>
					</span>
				</div>
				<div id="tes-settings-nightmode" class="tes-setting-container">
					<input type="checkbox">
					<span class="label">
						Night mode
					</span>
					<span id="black" class="colorCont"><input type="radio" class="nightmode-colors"><span class="sublabel">Black</span></span>
					<span id="gray" class="colorCont"><input type="radio" class="nightmode-colors"><span class="sublabel">Gray</span></span>
				</div>
                <div id="tes-settings-spotlight" class="tes-setting-container">
					<input type="checkbox">
					<span class="label">
						Spotlight
					</span>
                    <span class="info" data-title='Allow a spotlight webcam'>?</span>
                    <span id="textcolor" class="colorCont"><input type="color" class="nightmode-colors" checked><span class="sublabel">Text Color</span></span>
				</div>
				<div id="tes-settings-maxcamposition" class="tes-setting-container right">
					<input type="checkbox">
					<span class="label">Maxed cam on left
					</span>
				</div>
				<div id="tes-settings-borderlesscams" class="tes-setting-container right">
					<input type="checkbox">
					<span class="label">Remove cam spacing
					</span>
				</div>
                <div id="tes-settings-hidenewcams" class="tes-setting-container right">
					<input type="checkbox">
					<span class="label">Auto hide all cams
					</span>
				</div>
                <div id="tes-settings-ignored" class="tes-setting-container rightright">
					<input type="checkbox">
					<span class="label">
						Cam auto-hide users
						<span class="info" data-title='A comma-separated list of users to auto-hide their cam. Example of 3 users: "bob, mike, jim"'>?</span>
					</span>
					<div class="inputcontainer">
						<input class="text" placeholder="enter nicknames here"><button class="save blue-button">save</button>
					</div>
				</div>
                <div id="tes-settings-banned" class="tes-setting-container rightright">
					<input type="checkbox">
					<span class="label">
						Auto-ban
						<span class="info" data-title='A comma-separated list of users to auto-ban on join. Example of 3 users: "bob, mike, jim"'>?</span>
					</span>
                    <input type="checkbox">
                    <span class="label" style="margin: 0;">
						Whitelist
					</span>
					<div class="inputcontainer">
						<input class="text" placeholder="enter nicknames here"><button class="save blue-button">save</button>
					</div>
				</div>
                <!-- BROKEN <div id="tes-settings-togglehiddenmsgs" class="tes-setting-container rightright">
					<input type="checkbox">
					<span class="label">Hide spam chat messages
					</span>
				</div> -->
				<!--
					<div id="tes-settings-messageanim" class="tes-setting-container">
						<input type="checkbox">
						<span class="label">
							Disable message animation
						</span>
					</div>
				-->
			</div>
			<div id="tes-updateNotifier"><a class="tes-closeButtonSmall">✕</a><span>...</span></div>
			<div id="tes-settingsGear" title="Tinychat Enhancement Suite settings"><span>✱</span></div>
		</div>
		`);

                    titleElem.getElementById("tes-settingsGear").addEventListener("mouseup", toggleSettingsDisplay);
                    titleElem.querySelector("#tes-updateNotifier .tes-closeButtonSmall").addEventListener("click", function () {
  const updateNotifier = titleElem.querySelector("#tes-updateNotifier");
  updateNotifier.classList.add("hidden");
});
                    if (!freshInstall && GM_getValue("tes-updateNotifSeen") != "2019.03.16v64") titleElem.getElementById("tes-updateNotifier").classList.add("visible");

                    titleElem.querySelector("#tes-settings #tes-settings-mentions button.save").addEventListener("click", function () {
                        mentionsManager("save");
                    });
                    mentionsManager("load");

                    titleElem.querySelector("#tes-settings #tes-settings-ignored button.save").addEventListener("click", function () {
                        ignoredManager("save");
                    });
                    ignoredManager("load");

                    titleElem.querySelector("#tes-settings #tes-settings-banned button.save").addEventListener("click", function () {
                        bannedManager("save");
                    });
                    bannedManager("load", true);

                    settingsCheckboxUpdate();
                    titleElem.querySelector("#tes-settings-rememberignore input").addEventListener("click", function () {
                        settingsCheckboxUpdate("tes-settings-rememberignore");
                    });
                    titleElem.querySelector("#tes-settings-mentions input:first-of-type").addEventListener("click", function () {
                        settingsCheckboxUpdate("tes-settings-mentions");
                    });
                    titleElem.querySelector("#tes-settings-notifications input:first-of-type").addEventListener("click", function () {
                        settingsCheckboxUpdate("tes-settings-notifications");
                    });
                    titleElem.querySelector("#tes-settings-changefont input").addEventListener("click", function () {
                        settingsCheckboxUpdate("tes-settings-changefont");
                    });
                    titleElem.querySelector("#tes-settings-nightmode input").addEventListener("click", function () {
                        settingsCheckboxUpdate("tes-settings-nightmode");
                    });
                    titleElem.querySelector("#tes-settings-nightmode #black").addEventListener("click", function () {
                        settingsCheckboxUpdate("tes-settings-nightmode-black");
                    });
                    titleElem.querySelector("#tes-settings-nightmode #gray").addEventListener("click", function () {
                        settingsCheckboxUpdate("tes-settings-nightmode-gray");
                    });
                    titleElem.querySelector("#tes-settings-spotlight #textcolor input").addEventListener("change", function () {
                        settingsCheckboxUpdate("tes-settings-spotlight-textcolor");
                    });
                    titleElem.querySelector("#tes-settings-spotlight input").addEventListener("click", function () {
                        settingsCheckboxUpdate("tes-settings-spotlight");
                    });
                    titleElem.querySelector("#tes-settings-maxcamposition input").addEventListener("click", function () {
                        settingsCheckboxUpdate("tes-settings-maxcamposition");
                    });
                    titleElem.querySelector("#tes-settings-borderlesscams input").addEventListener("click", function () {
                        settingsCheckboxUpdate("tes-settings-borderlesscams");
                    });
                    titleElem.querySelector("#tes-settings-hidenewcams input").addEventListener("click", function () {
                        settingsCheckboxUpdate("tes-settings-hidenewcams");
                    });
                    titleElem.querySelector("#tes-settings-ignored input:first-of-type").addEventListener("click", function () {
                        settingsCheckboxUpdate("tes-settings-ignored");
                    });
                    titleElem.querySelector("#tes-settings-banned input:first-of-type").addEventListener("click", function () {
                        settingsCheckboxUpdate("tes-settings-banned");
                    });
                    titleElem.querySelector("#tes-settings-banned input:nth-of-type(2)").addEventListener("click", function () {
                        settingsCheckboxUpdate("tes-settings-banned-whitelist");
                    });
                    /*titleElem.querySelector("#tes-settings-togglehiddenmsgs input").addEventListener("click", function () {
                        settingsCheckboxUpdate("tes-settings-togglehiddenmsgs");
                    });*/

                    notificationHider();
                    newUserAdded();
                    newMessageAdded();
                    updateNotifcation();
                    setTimeout(messageParserCheckCSS, 2000);
                }
            } catch (e) {
                tcl("error waitForSettings: " + e.message);
            }
        }

        function nightmodeToggle(arg) {
            try {
                var nightmodeClasses = ["tes-nightmode"];

                if (settingsQuick["NightModeBlack"]) nightmodeClasses.push("blacknight");

                if (arg == true) {
                    bodyElem.classList.add(...nightmodeClasses);
                    titleCSS.classList.add(...nightmodeClasses);
                    sidemenuCSS.classList.add(...nightmodeClasses);
                    userlistCSS.classList.add(...nightmodeClasses);
                    webappCSS.classList.add(...nightmodeClasses);
                    videolistCSS.classList.add(...nightmodeClasses);
                    videomoderationCSS.classList.add(...nightmodeClasses);
                    chatlistCSS.classList.add(...nightmodeClasses);
                    chatlogCSS.classList.add(...nightmodeClasses);
                    chatlogElem.querySelector("#chat-wider").classList.add(...nightmodeClasses);
                    // Messages:
                    if (chatlogElem.querySelector(messageQueryString) != null) {
                        var messageElems = chatlogElem.querySelectorAll(messageQueryString);
                        for (var i = 0; i < messageElems.length; i++) {
                            var messageItem = messageElems[i].querySelector("tc-message-html").shadowRoot;
                            var messageItemCSS = messageItem.querySelector(".message");
                            //messageItemCSS.classList.add(...nightmodeClasses);
                            messageItem.appendChild(messageParserAddCSSNightmode());
                            if (settingsQuick["NightModeBlack"]) messageItem.appendChild(messageParserAddCSSBlacknight());
                        }
                    }
                    // Cams:
                    if (videolistElem.querySelector(camQueryString) != null) {
                        var camElems = videolistElem.querySelectorAll(camQueryString);
                        for (var i = 0; i < camElems.length; i++) {
                            var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
                            var camItemCSS = camItem.querySelector(".video");
                            camItemCSS.classList.add(...nightmodeClasses);

                            camItem.appendChild(camParserAddCSSNightmode());
                            if (settingsQuick["NightModeBlack"]) camItem.appendChild(camParserAddCSSBlacknight());

                            if (camItemCSS.querySelector("#camItemCSS") == null) camItemCSS.insertAdjacentHTML("afterbegin", camItemCSShtml);
                        }
                    }
                }
                if (arg == false) {
                    if (!settingsQuick["NightModeBlack"] && settingsQuick["NightMode"]) nightmodeClasses = ["blacknight"];

                    bodyElem.classList.remove(...nightmodeClasses);
                    titleCSS.classList.remove(...nightmodeClasses);
                    sidemenuCSS.classList.remove(...nightmodeClasses);
                    userlistCSS.classList.remove(...nightmodeClasses);
                    webappCSS.classList.remove(...nightmodeClasses);
                    videolistCSS.classList.remove(...nightmodeClasses);
                    videomoderationCSS.classList.remove(...nightmodeClasses);
                    chatlistCSS.classList.remove(...nightmodeClasses);
                    chatlogCSS.classList.remove(...nightmodeClasses);
                    chatlogElem.querySelector("#chat-wider").classList.remove(...nightmodeClasses);
                    // Messages:
                    if (chatlogElem.querySelector(messageQueryString) != null) {
                        var messageElems = chatlogElem.querySelectorAll(messageQueryString);
                        for (i = 0; i < messageElems.length; i++) {
                            var messageItem = messageElems[i].querySelector("tc-message-html").shadowRoot;
                            //var messageItemCSS = messageItem.querySelector(".message");
                            //messageItemCSS.classList.remove(...nightmodeClasses);

                            var child = messageItem.getElementById("messageCSSNightmode");
                            if (child) {
                                messageItem.removeChild(child);
                            }
                            child = messageItem.getElementById("messageCSSBlacknight");
                            if (child) {
                                messageItem.removeChild(child);
                            }
                        }
                    }
                    // Cams:
                    if (videolistElem.querySelector(camQueryString) != null) {
                        var camElems = videolistElem.querySelectorAll(camQueryString);
                        for (var i = 0; i < camElems.length; i++) {
                            var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
                            var camItemCSS = camItem.querySelector(".video");
                            camItemCSS.classList.remove(...nightmodeClasses);

                            var child = camItem.getElementById("camItemCSShtmlNightmode");
                            if (child) {
                                camItem.removeChild(child);
                            }

                            var child = camItem.getElementById("camItemCSShtmlBlacknight");
                            if (child) {
                                camItem.removeChild(child);
                            }
                        }
                    }
                }
            } catch (e) {
                tcl("error nightmodeToggle: " + e.message);
            }
        }

        function textColorOverride(color=null) {
            try {
                if (!color) {
                    chatlogCSS.style.color = '';
                    settingsQuick["TextColorOverride"] = null;
                    GM_setValue("tes-TextColorOverride", null);
                    document.documentElement.style.setProperty('--textcolor-override', 'gray');
                    titleElem.querySelector("#tes-settings-spotlight #textcolor input").value = '#000000';
                } else {
                    chatlogCSS.style.color = color;
                    document.documentElement.style.setProperty('--textcolor-override', color);
                    titleElem.querySelector("#tes-settings-spotlight #textcolor input").value = color;
                }
            } catch(e) {
                tcl("error textColorOverride: " + e.message);
            }
        }

        function showUpdateNotifier(text) {
            try {

                var updateNotifier = titleElem.querySelector("#tes-updateNotifier");
                updateNotifier.querySelector("span").innerHTML = text;
                updateNotifier.classList.add("visible");
                if (settingsVisible == true) toggleSettingsDisplay();

            } catch (e) {
                tcl("error showUpdateNotifier: " + e.message);
            }
        }

        function toggleBotMode() {
            let settings_gear = titleElem.querySelector("#tes-settingsGear > span");

            if (!BOT_MODE) {
                settings_gear.style.color = 'orange';
                BOT_MODE = true;
            } else {
                settings_gear.style.color = '';
                BOT_MODE = false;
            }

            GM_setValue("tes-BOT_MODE", BOT_MODE);
        }

        function toggleSettingsDisplay(e, arg) {
            if (e.which === 1) {
                try {
                    if (arg == "updateNotifier") {
                        titleElem.querySelector("#tes-updateNotifier").classList.remove("visible");
                        GM_setValue("tes-updateNotifSeen", "2019.03.16v64");
                    }

                    if (settingsVisible == true) {
                        titleElem.getElementById("tes-settingsBox").classList.add("hidden");
                        titleElem.getElementById("tes-settings").classList.remove("tes-open");
                        settingsVisible = false;
                    } else {
                        titleElem.getElementById("tes-settingsBox").classList.remove("hidden");
                        titleElem.getElementById("tes-settings").classList.add("tes-open");
                        settingsVisible = true;
                    }
                } catch (e) {
                    tcl("error toggleSettingsDisplay: " + e.message);
                }
            } else if (e.which === 2) {
                // BOT MODE.
                toggleBotMode();
            }
        }

        function settingsCheckboxUpdate(settingName = null, value = null) {
            try {
                if (settingName == null && value == null) {
                    titleElem.getElementById("tes-settings-rememberignore").querySelector("input").checked = settingsQuick["RememberIgnore"];
                    titleElem.getElementById("tes-settings-mentions").querySelector("input").checked = settingsQuick["MentionsMonitor"];
                    titleElem.getElementById("tes-settings-notifications").querySelector("input").checked = settingsQuick["NotificationsOff"];
                    titleElem.getElementById("tes-settings-changefont").querySelector("input").checked = settingsQuick["ChangeFont"];
                    titleElem.getElementById("tes-settings-nightmode").querySelector("input").checked = settingsQuick["NightMode"];
                    titleElem.getElementById("tes-settings-spotlight").querySelector("input").checked = settingsQuick["Spotlight"];
                    titleElem.getElementById("tes-settings-maxcamposition").querySelector("input").checked = settingsQuick["MaxedCamLeft"];
                    titleElem.getElementById("tes-settings-borderlesscams").querySelector("input").checked = settingsQuick["BorderlessCams"];
                    titleElem.getElementById("tes-settings-hidenewcams").querySelector("input").checked = settingsQuick["HideNewCams"];
                    titleElem.getElementById("tes-settings-ignored").querySelector("input").checked = settingsQuick["IgnoredMonitor"];
                    titleElem.getElementById("tes-settings-banned").querySelector("input:first-of-type").checked = settingsQuick["BannedMonitor"];
                    titleElem.getElementById("tes-settings-banned").querySelector("input:nth-of-type(2)").checked = settingsQuick["BannedMonitorWhitelist"];
                    //titleElem.getElementById("tes-settings-togglehiddenmsgs").querySelector("input").checked = settingsQuick["ToggleHiddenMsgs"];

                    titleElem.querySelector("#tes-settings-nightmode #black input").checked = settingsQuick["NightModeBlack"];
                    titleElem.querySelector("#tes-settings-nightmode #gray input").checked = (settingsQuick["NightModeBlack"] == false);

                    return;
                }
                if (settingName == "tes-settings-rememberignore") {
                    if (value == null) {
                        let newValue = titleElem.getElementById("tes-settings-rememberignore").querySelector("input").checked;
                        settingsQuick["RememberIgnore"] = newValue;
                        GM_setValue("tes-RememberIgnore", newValue.toString());
                    }
                }
                if (settingName == "tes-settings-mentions") {
                    if (value == null) {
                        let newValue = titleElem.getElementById("tes-settings-mentions").querySelector("input:first-of-type").checked;
                        // if (newValue) {
                        // titleElem.getElementById("tes-settings-mentions").getAttribute("class").includes("setting-disabled");
                        // }
                        settingsQuick["MentionsMonitor"] = newValue;
                        GM_setValue("tes-MentionsMonitor", newValue.toString());
                    }
                }
                if (settingName == "tes-settings-ignored") {
                    if (value == null) {
                        let newValue = titleElem.getElementById("tes-settings-ignored").querySelector("input:first-of-type").checked;
                        // if (newValue) {
                        // titleElem.getElementById("tes-settings-ignored").getAttribute("class").includes("setting-disabled");
                        // }
                        settingsQuick["IgnoredMonitor"] = newValue;
                        GM_setValue("tes-IgnoredMonitor", newValue.toString());
                    }
                }
                if (settingName == "tes-settings-banned") {
                    if (value == null) {
                        let newValue = titleElem.getElementById("tes-settings-banned").querySelector("input:first-of-type").checked;
                        settingsQuick["BannedMonitor"] = newValue;
                        GM_setValue("tes-BannedMonitor", newValue.toString());
                        // If switched on, then toggle off whitelist.
                        let whitelist = titleElem.getElementById("tes-settings-banned").querySelector("input:nth-of-type(2)");
                        if (newValue && whitelist.checked) whitelist.click();
                    }
                }
                if (settingName == "tes-settings-banned-whitelist") {
                    if (value == null) {
                        let newValue = titleElem.getElementById("tes-settings-banned").querySelector("input:nth-of-type(2)").checked;
                        settingsQuick["BannedMonitorWhitelist"] = newValue;
                        GM_setValue("tes-BannedMonitorWhitelist", newValue.toString());
                        // If switched on, then toggle off blacklist.
                        let blacklist = titleElem.getElementById("tes-settings-banned").querySelector("input:first-of-type");
                        if (newValue && blacklist.checked) blacklist.click();
                    }
                }
                if (settingName == "tes-settings-notifications") {
                    if (value == null) {
                        let newValue = titleElem.getElementById("tes-settings-notifications").querySelector("input").checked;
                        settingsQuick["NotificationsOff"] = newValue;
                        GM_setValue("tes-NotificationsOff", newValue.toString());
                        notificationHider();
                    }
                }
                if (settingName == "tes-settings-changefont") {
                    if (value == null) {
                        let newValue = titleElem.getElementById("tes-settings-changefont").querySelector("input").checked;
                        settingsQuick["ChangeFont"] = newValue;
                        GM_setValue("tes-ChangeFont", newValue.toString());
                        fontToggle(newValue);
                    }
                }
                if (settingName == "tes-settings-nightmode") {
                    if (value == null) {
                        let newValue = titleElem.getElementById("tes-settings-nightmode").querySelector("input").checked;
                        settingsQuick["NightMode"] = newValue;
                        GM_setValue("tes-NightMode", newValue.toString());
                        nightmodeToggle(newValue);
                        // Reset text color override.
                        textColorOverride();
                    }
                }
                if (settingName == "tes-settings-nightmode-black") {
                    if (value == null) {
                        let newValue = titleElem.querySelector("#tes-settings-nightmode #black input").checked;
                        titleElem.querySelector("#tes-settings-nightmode #gray input").checked = (!newValue);
                        settingsQuick["NightModeBlack"] = newValue;
                        GM_setValue("tes-NightModeBlack", newValue.toString());
                        //nightmodeToggle(newValue);
                        //nightmodeToggle(true);
                        // Reset text color override.
                        textColorOverride();

                        if (titleElem.querySelector("#tes-settings-nightmode #black input").checked || titleElem.querySelector("#tes-settings-nightmode #gray input").checked) {
                            titleElem.querySelector("#tes-settings-nightmode > input").checked = true;
                            GM_setValue("tes-NightMode", true.toString());
                            settingsQuick["NightMode"] = true;
                            nightmodeToggle(false);
                            nightmodeToggle(true);
                        }
                    }
                }
                if (settingName == "tes-settings-nightmode-gray") {
                    if (value == null) {
                        let newValue = (!titleElem.querySelector("#tes-settings-nightmode #gray input").checked);
                        titleElem.querySelector("#tes-settings-nightmode #black input").checked = newValue;
                        settingsQuick["NightModeBlack"] = newValue;
                        GM_setValue("tes-NightModeBlack", newValue.toString());
                        //nightmodeToggle(newValue);
                        // Reset text color override.
                        textColorOverride();

                        if (titleElem.querySelector("#tes-settings-nightmode #black input").checked || titleElem.querySelector("#tes-settings-nightmode #gray input").checked) {
                            titleElem.querySelector("#tes-settings-nightmode > input").checked = true;
                            GM_setValue("tes-NightMode", true.toString());
                            settingsQuick["NightMode"] = true;
                            nightmodeToggle(false);
                            nightmodeToggle(true);
                        }
                    }
                }
                if (settingName == "tes-settings-spotlight-textcolor") {
                    if (value == null) {
                        let newValue = titleElem.querySelector("#tes-settings-spotlight #textcolor input").value;
                        settingsQuick["TextColorOverride"] = newValue;
                        GM_setValue("tes-TextColorOverride", newValue);
                        document.documentElement.style.setProperty('--textcolor-override', newValue);
                        textColorOverride(newValue);
                    }
                }
                if (settingName == "tes-settings-spotlight") {
                    if (value == null) {
                        let newValue = titleElem.getElementById("tes-settings-spotlight").querySelector("input").checked;
                        settingsQuick["Spotlight"] = newValue;
                        GM_setValue("tes-Spotlight", newValue.toString());
                        // TODO: Actually move the spotlight cam around.
                    }
                }
                if (settingName == "tes-settings-maxcamposition") {
                    if (value == null) {
                        let newValue = titleElem.getElementById("tes-settings-maxcamposition").querySelector("input").checked;
                        settingsQuick["MaxedCamLeft"] = newValue;
                        GM_setValue("tes-MaxedCamLeft", newValue.toString());
                        maxCamPositionToggle(newValue);
                    }
                }
                if (settingName == "tes-settings-borderlesscams") {
                    if (value == null) {
                        let newValue = titleElem.getElementById("tes-settings-borderlesscams").querySelector("input").checked;
                        settingsQuick["BorderlessCams"] = newValue;
                        GM_setValue("tes-BorderlessCams", newValue.toString());
                        borderlessCamsToggle(newValue);
                    }
                }
                if (settingName == "tes-settings-hidenewcams") {
                    if (value == null) {
                        let newValue = titleElem.getElementById("tes-settings-hidenewcams").querySelector("input").checked;
                        settingsQuick["HideNewCams"] = newValue;
                        GM_setValue("tes-HideNewCams", newValue.toString());
                        // And hide all current cams too.
                        if (newValue) {
                            videolistElem.querySelectorAll("tc-video-item").forEach(function(camItem) {
                                // Only cams that are showing.
                                let query = camItem.shadowRoot.querySelector(".not-visible");

                                if (!query) {
                                    //camItem.onHide();
                                    //camItem.hidden = !camItem.hidden;
                                    camItem.shadowRoot.querySelector("button.icon-visibility").click();
                                    tcl("Hiding all visible cams.");
                                }
                            });
                        }
                    }
                }
                /*if (settingName == "tes-settings-togglehiddenmsgs") {
                    if (value == null) {
                        let newValue = titleElem.getElementById("tes-settings-togglehiddenmsgs").querySelector("input").checked;
                        settingsQuick["ToggleHiddenMsgs"] = newValue;
                        GM_setValue("tes-ToggleHiddenMsgs", newValue.toString());

                        // Toggle display of all elements with relevant class.
                        //var elems = chatlogElem.querySelectorAll(".hideSpamChat");
                        //console.log('elems', elems)
                        //if (elems) {
                            // Get state from checkbox.
                            //var state = 'block';
                            //console.log('checkbox', settingsQuick["ToggleHiddenMsgs"], newValue)
                            //if (settingsQuick["ToggleHiddenMsgs"]) {
                            //    state = 'none';
                            //}

                            //for (var i = 0; i < elems.length; i++) {
                            //    var el = elems[i];
                            //    el.style.display = state;
                            //}
                        //}

                        if (newValue) {
                            messageParserAddCSSSpam(true)
                        } else {
                            messageParserAddCSSSpam(false)
                        }

                    }
                }*/
            } catch (e) {
                tcl("error settingsCheckboxUpdate: " + e.message);
            }
        }

        function fontToggle(arg) {
            try {
                arg ? bodyElem.classList.add("tes-changefont") : bodyElem.classList.remove("tes-changefont");
            } catch (e) {
                tcl("error fontToggle: " + e.message);
            }
        }

        function borderlessCamsToggle(arg) {
            try {
                if (videolistElem.querySelector(camQueryString) != null) {
                    var camElems = videolistElem.querySelectorAll(camQueryString);
                    for (i = 0; i < camElems.length; i++) {
                        var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
                        var camElem = camItem.querySelector(".video");
                        arg ? camElem.classList.add("tes-borderlesscams") : camElem.classList.remove("tes-borderlesscams");

                        if (arg) {
                            camItem.appendChild(camParserAddCSSBorderless());
                        } else {
                            var child = camItem.getElementById("camItemCSShtmlBorderless");
                            if (child) {
                                camItem.removeChild(child);
                            }
                        }
                    }
                }
                arg ? videolistCSS.classList.add("tes-borderlesscams") : videolistCSS.classList.remove("tes-borderlesscams");
            } catch (e) {
                tcl("error borderlessCamsToggle: " + e.message);
            }
        }

        function maxCamPositionToggle(arg) {
            try {
                arg ? videolistCSS.classList.add("tes-leftcam") : videolistCSS.classList.remove("tes-leftcam");
            } catch (e) {
                tcl("error maxCamPositionToggle: " + e.message);
            }
        }

        function notificationHider() {
            try {
                chatlogContainer = chatlogElem.querySelector("#chat-content");
                settingsQuick["NotificationsOff"] ? chatlogContainer.classList.add("tes-notif-off") : chatlogContainer.classList.remove("tes-notif-off");
            } catch (e) {
                tcl("error notificationHider: " + e.message);
            }
        }

        function copyChatlog(opt = null) {
            try {
                if (opt == "close") {
                    chatlogDisplayElem.classList.remove("show");
                    chatlogDisplayClose.classList.remove("show");
                    setTimeout(function () {
                        chatlogDisplayCont.classList.remove("show");
                    }, 300);
                    return;
                }

                var filename = "tinychat_" + roomName + "_" + joinDate + "_" + joinTime.replace(/:/g, ".") + "-chatlog.log";
                var chatlogText = "Tinychat room " + roomName + " on " + joinDate + " " + joinTime + newline + "Users (" + usersCountInitial + "): " + userlistInitial + newline + chatlogMain;

                var downloadLink = 'data:text/plain;charset=utf-8,' + encodeURIComponent(chatlogText);
                var downloadElem = document.createElement('a');
                downloadElem.setAttribute("href", downloadLink);

                downloadElem.setAttribute("download", filename);

                if (opt == "download") {
                    // if (browserFirefox) showUpdateNotifier("Chat log downloading doesn't work in Firefox yet.");
                    // else downloadElem.click();
                    downloadElem.click();
                }
                if (opt == "view" || opt == null) {
                    if (typeof chatlogDisplayCont == "undefined") {
                        chatlogDisplayCont = chatlogElem.querySelector("#tes-chatlogDisplay");
                        chatlogDisplayElem = chatlogDisplayCont.querySelector("textarea");
                        chatlogDisplayClose = chatlogDisplayCont.querySelector("#close");
                    }
                    chatlogDisplayElem.value = chatlogText;
                    chatlogDisplayCont.classList.add("show");
                    setTimeout(function () {
                        chatlogDisplayElem.classList.add("show");
                        chatlogDisplayClose.classList.add("show");
                    }, 50);
                    //chatlogDisplayElem.scrollTop = chatlogDisplayElem.scrollHeight;
                    chatlogDisplayElem.scrollIntoView(false);
                }
            } catch (e) {
                tcl("error copyChatlog: " + e.message);
            }
        }

        // Toggle between old chatbox and new one.
        function toggleDefaultChat(temporaryChange=false) {
            if (chatContent.style.display != 'none') {
                // New chatbox.
                chatContent.style.display = 'none';
                chatContentNew.style.display = '';
                !temporaryChange && GM_setValue("defaultChat", false);
                // Button highlight.
                chatlogElem.querySelector("#tes-chatToggle").classList.add('border-highlight');
                chatlogElem.querySelector("#tes-chatToggle").classList.remove('border-glow');
                // Chat input.
                chatlogElem.querySelector('#chat-position > #input').style.display = 'none';
                chatlogElem.querySelector('#chat-position > #input-new').style.display = '';

                // Scroll down.
                chatContentNew.scrollIntoView(false);
            } else {
                // Old chatbox.
                chatContent.style.display = '';
                chatContentNew.style.display = 'none';
                !temporaryChange && GM_setValue("defaultChat", true);
                // Button highlight.
                chatlogElem.querySelector("#tes-chatToggle").classList.remove('border-highlight');
                chatlogElem.querySelector("#tes-chatToggle").classList.add('border-glow');
                // Chat input.
                chatlogElem.querySelector('#chat-position > #input').style.display = '';
                chatlogElem.querySelector('#chat-position > #input-new').style.display = 'none';

                // Scroll down.
                chatContent.scrollIntoView(false);
            }
        }

        function getFormattedDateTime(d, opt = null) {
            try {
                if (opt == "time") return d.toLocaleTimeString('en-US', {
                    hour12: false
                });
                else return d.toLocaleDateString('zh-CN', {
                    'year': 'numeric',
                    'month': '2-digit',
                    'day': '2-digit'
                }).replace(/\//g, "-");
            } catch (e) {
                tcl("error getFormattedDateTime: " + e.message);
            }
        }

        function mentionsManager(mode) {
            try {
                var inputElem = titleElem.querySelector("#tes-settings #tes-settings-mentions input.text");
                // phrases = inputElem.value.split(",");
                var phrase = inputElem.value;
                if (phrase.endsWith(",")) {
                    phrase = phrase.slice(0, -1);
                }
                if (phrase.startsWith(",")) {
                    phrase = phrase.slice(1);
                }

                if (mode == "save") {
                    GM_setValue("tes-Mentions", phrase);
                    settingMentions = phrase.split(",").map(x => x.trim());
                    inputElem.value = phrase;
                }
                if (mode == "load") {
                    var loadedMentions = GM_getValue("tes-Mentions");
                    if (loadedMentions != undefined) {
                        inputElem.value = loadedMentions;
                        settingMentions = loadedMentions.split(",").map(x => x.trim());
                    }
                }

                /*var phrase = phrase.toString();
                if (mode == "save") {
                    settingMentions.push(phrases);
                    GM_setValue("tes-Mentions", JSON.stringify(setting_Mentions));
                }
                if (mode == "load") {
                    var mentions = JSON.parse(GM_getValue("tes-Mentions"));
                    settingMentions = mentions;
                    inputElem.value = settingMentions.join();
                }*/
            } catch (e) {
                tcl("error mentionsManager: " + e.message);
            }
        }

        function ignoredManager(mode, early=false) {
            try {
                if (!early) {
                    var inputElem = titleElem.querySelector("#tes-settings #tes-settings-ignored input.text");
                    // phrases = inputElem.value.split(",");
                    var phrase = inputElem.value;
                    if (phrase.endsWith(",")) {
                        phrase = phrase.slice(0, -1);
                    }
                    if (phrase.startsWith(",")) {
                        phrase = phrase.slice(1);
                    }
                }

                if (mode == "save") {
                    GM_setValue("tes-IgnoredUsers", phrase);
                    settingIgnoredUsers = {};
                    let names = phrase.split(",").map(x => x.trim().toUpperCase());

                    for (let i=0; i < names.length; i++) {
                        let name = names[i];
                        settingIgnoredUsers[name] = 1;
                    }

                    inputElem.value = phrase;
                }
                if (mode == "load") {
                    var loadedIgnoredUsers = GM_getValue("tes-IgnoredUsers");

                    if (loadedIgnoredUsers !== undefined) {
                        if (!early) inputElem.value = loadedIgnoredUsers;

                        settingIgnoredUsers = {};
                        let names = loadedIgnoredUsers.split(",").map(x => x.trim().toUpperCase());

                        for (let i=0; i < names.length; i++) {
                            let name = names[i];

                            if (name.charAt(0) === '#') continue;

                            settingIgnoredUsers[name] = 1;
                        }
                    }
                }
            } catch (e) {
                tcl("error ignoredManager: " + e.message);
            }
        }

        function bannedManagerRequest(phrase) {
            // Load whitelist from file.
            GM_xmlhttpRequest({
                method: "GET",
                url: phrase,
                onload: function(res) {
                    if (res.responseText) {
                        let users = res.responseText.replace(/\n/g, ', ');
                        tcl('Loaded '+users.split(',').length+' users into banlist/whitelist from file: '+phrase);
                        tcl(users);
                        GM_setValue("tes-BannedUsers", phrase);
                        bannedManager('load', false, users);
                    }
                }
            });
        }

        function bannedManager(mode, start=false, users=null) {
            try {
                var inputElem = titleElem.querySelector("#tes-settings #tes-settings-banned input.text");
                // phrases = inputElem.value.split(",");
                var phrase = inputElem.value;
                if (phrase.endsWith(",")) {
                    phrase = phrase.slice(0, -1);
                }
                if (phrase.startsWith(",")) {
                    phrase = phrase.slice(1);
                }

                if (mode === "save") {
                    GM_setValue("tes-BannedUsers", phrase);

                    inputElem.value = phrase;

                    if (phrase.startsWith('http')) {
                        bannedManagerRequest(phrase);
                    } else {
                        settingBannedUsers = {};
                        settingSuperBannedUsers = {};

                        let names = phrase.split(",").map(x => x.trim().toUpperCase());

                        for (let i=0; i < names.length; i++) {
                            let name = names[i];

                            if (name.charAt(0) === '#') continue;

                            if (name.charAt(0) === '!') {
                                name = name.slice(1);
                                settingSuperBannedUsers[name] = 1;
                            } else {
                                settingBannedUsers[name] = 1;
                            }
                        }
                    }
                }

                if (mode === "load") {
                    var loadedBannedUsers = GM_getValue("tes-BannedUsers");

                    if (loadedBannedUsers !== undefined) {
                        inputElem.value = loadedBannedUsers;

                        // Override with given users list from file.
                        if (users) {
                            loadedBannedUsers = users;
                        }

                        // Mimick clicking the save button, to load from file.
                        if (start && loadedBannedUsers.startsWith('http')) {
                            titleElem.querySelector("#tes-settings #tes-settings-banned button.save").click();
                            return;
                        }

                        settingBannedUsers = {};
                        settingSuperBannedUsers = {};

                        let names = loadedBannedUsers.split(",").map(x => x.trim().toUpperCase());

                        for (let i=0; i < names.length; i++) {
                            let name = names[i];

                            if (name.charAt(0) === '#') continue;

                            if (name.charAt(0) === '!') {
                                name = name.slice(1);
                                settingSuperBannedUsers[name] = 1;
                            } else {
                                settingBannedUsers[name] = 1;
                            }
                        }
                    }
                }
            } catch (e) {
                tcl("error bannedManager: " + e.message);
            }
        }

        function declareGlobalVars() {
            try {
                globalCSS = `:root {
		--textcolor: black;
		--bgcolor: white;

		--nightmode-bgcolor: #2d373a;
		--nightmode-trimcolor: #3c4a4e;
		--nightmode-textcolor: #9faaad;
		--nightmode-textSecondarycolor: #4e5f65;
		--nightmode-headerButtonscolor: #3986a7;

		--nightmodeBlack-bgcolor: black;
		--nightmodeBlack-trimcolor: #222;

        --mention-textcolor: #f91302;

        --textcolor-override: gray;
	}

	* {
	  scrollbar-color: #ccc transparent;
	  /*scrollbar-width: thin;*/
	}
	.tes-nightmode * { scrollbar-color: #242C2E transparent; }
	.tes-nightmode.blacknight * { scrollbar-color: #111 transparent; }

	.list-item > span[data-status="gold"] {
		color: unset !important;
	}

	.list-item > span[data-status="extreme"] {
		color: unset !important;
	}

	.list-item > span[data-status="pro"] {
		color: unset !important;
	}

    #toast, #notify-bar, #input-unread {
        display: none;
    }

    .mention {
        color: var(--mention-textcolor);
    }

    .border-highlight {
        border: 1px solid #9c9cff !important;
    }
	`;

                camItemCSShtml = `
		<style id="camItemCSS">` + globalCSS + `
			.icon-tes-max {
				position: absolute;
				top: -40%;
				right: 0;
				z-index: 9;
				background: none;
				border: 0;
			}
			.icon-tes-max:hover { cursor: pointer; }
			.icon-tes-max path { fill: #04caff; }

			.video:hover .icon-tes-max {
				top: 40%;
				transition: top .2s ease .2s,
						left .2s ease .2s,
						right .2s ease .2s,
						opacity .2s;
				}

			/* Disable cam border
			.video:after { border: none; }
			.video > div { background-color: unset; }
			video,
			.video > div > .overlay {
				border-radius: 10px;
			}
			*/
			.video { transition: .4s; }
			.tes-borderlesscams.video { padding: 0; }
			.tes-borderlesscams.video:after { display: none; }

			.tes-nightmode.video:after { border-color: var(--nightmode-bgcolor); }
					.tes-nightmode.blacknight.video:after { border-color: var(--nightmodeBlack-bgcolor); }
			.tes-nightmode.blacknight.video > div > .waiting { background: #111; }
			.tes-nightmode.blacknight.video > div { background-color: #111; }

            /* Fix pro blur. */
            div.video > div > div.blured {
                display: none !important;
            }

            div.video > div > video {
                filter: none !important;
            }

            .icon-resize {opacity: 0 !important;} /* Original resize is unused now. */

            /* Remove special icons. */
            .video > div.gold:after {
                background-image: none;
            }

            .video > div.extreme:after {
                background-image: none;
            }

            .video > div.pro:after {
                background-image: none;
            }
		</style>
	`;

                camItemCSShtmlNightmode = `.video:after { border-color: var(--nightmode-bgcolor); }`;
                camItemCSShtmlBlacknight = `
    		.video:after { border-color: var(--nightmodeBlack-bgcolor); }
			.video > div > .waiting { background: #111; }
			.video > div { background-color: #111; }
    `;
                camItemCSShtmlBorderless = `
			.video { padding: 0; }
			.video:after { display: none; }
    `;

                // Includes talking indicator css.
                camMaxCSShtml = `
	<style id="camMaxCSS">` + globalCSS + `
		.tes-max .js-video {
			width: 15%!important;
			z-index: 1;
		}
		.tes-leftcam .tes-max .js-video {
			float: right;
			order: 2;
		}
		.tes-leftcam .tes-max .tes-maxedCam {
			float: left;
			order: 1;
		}
.tes-maxedCam {
  border: 4px solid #fff; /* Border color and thickness */
  box-shadow: 0 0 0 4px #fff; /* Border color and thickness */
  transition: border-color 0.2s, box-shadow 0.2s; /* Add transition effect */
}

.tes-maxedCam:hover {
  border-color: #f00; /* Change border color on hover */
  box-shadow: 0 0 0 4px #f00; /* Change border color on hover */
}
		div[data-video-count="5"] .tes-max .js-video:not(.tes-maxedCam),
		div[data-video-count="6"] .tes-max .js-video:not(.tes-maxedCam),
		div[data-video-count="7"] .tes-max .js-video:not(.tes-maxedCam)
		{ width: 20%!important; }
		.tes-max.tes-camCount2 .js-video { width: 30%!important; }
		.tes-max.tes-camCount10-11 .js-video { width: 16%!important; }
		.tes-max.tes-camCount12 .js-video { width: 14%!important; }

		:not(.hidden) + .tes-max.tes-camCount12 .js-video,
		:not(.hidden) + .tes-max.tes-camCount10-11 .js-video,
		:not(.hidden) + .tes-max .js-video
		{ width: 30%!important; }
		:not(.hidden) + .tes-max.tes-camCount2 .js-video { width: 60%!important; }

		.tes-max .js-video.tes-maxedCam,
		:not(.hidden) + .tes-max .js-video.tes-maxedCam { width: 32%!important; }

		@media screen and (max-width: 1400px) {
			.tes-max .js-video { width: 20%!important; }

			.tes-max.tes-camCount2 .js-video { width: 40%!important; }
			.tes-max.tes-camCount10-11 .js-video { width: 18%!important; }
			.tes-max.tes-camCount12 .js-video { width: 15%!important; }

			.tes-max .js-video.tes-maxedCam,
			:not(.hidden) + .tes-max .js-video.tes-maxedCam { width: 25%!important; }
		}
	</style>
	`;

                camMaxButtonHtml = `
		<button class="icon-tes-max" id="maxbutton-camName">
			<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path d="M14.37 12.95l3.335 3.336a1.003 1.003 0 1 1-1.42 1.42L12.95 14.37a8.028 8.028 0 1 1 1.42-1.42zm-6.342 1.1a6.02 6.02 0 1 0 0-12.042 6.02 6.02 0 0 0 0 12.042zM6.012 9.032a.996.996
				0 0 1-.994-1.004c0-.554.452-1.003.994-1.003h4.033c.55 0 .994.445.994 1.003 0 .555-.454 1.004-.995 1.004H6.012z" fill-rule="evenodd"></path>
				<path d="M0 .99C0 .445.444 0 1 0a1 1 0 0 1 1 .99v4.02C2 5.555 1.556 6 1 6a1 1 0 0 1-1-.99V.99z" transform="translate(7 5)" fill-rule="evenodd"></path>
			</svg>
		</button>
	`;

 camTalkingIndicatorHtml = `
  <div class="icon-tes-talking" id="micIndicator-camName">
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
      <path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2zm0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm8 9v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13v-2h-2v2h-4v2h10v-2h-4z"/>
    </svg>
  </div>
  <style>
    .icon-tes-talking {
      position: absolute;
      height: 25px;
      width: 25px;
      top: 8px;
      padding: 0;
      border: none;
      background-color: transparent;
      cursor: pointer;
      opacity: 0;
      transition: .05s;

      left: 50%;
      margin-left: -11px;
    }

    .icon-tes-talking > svg {
      fill: white; /* Set initial color to red */
      filter: drop-shadow(0px 0px 2px black);
    }

    /* Additional CSS classes for different audio levels */
    .icon-tes-talking.low-level > svg {
      fill: green; /* Low audio level, set color to green */
    }

    .icon-tes-talking.high-level > svg {
      fill: red; /* High audio level, set color to red */
    }
  </style>
`;
            } catch (e) {
                tcl("error declareGlobalVars: " + e.message);
            }
        }

        function injectCSS(cssName = null) {
            try {
                // Indenting is purposely wrong, for readability
                var insertPosition = "beforeend";
                headElem = document.querySelector("head");
                browserSpoofedChrome = (headElem.innerHTML.includes("Shady DOM styles for") ? true : false);
                if (browserSpoofedChrome) tcl("browserSpoofedChrome");
                var firefoxCSS = "";

                { // titleCSS
                    if (browserFirefox) var firefoxCSS = `
		.nightmode-colors:after { display: none; }

		#tes-settings-nightmode > span {
			position: relative;
			top: -4px;
		}
		#tes-settings-nightmode .label { margin-right: 3px; }
		.sublabel {
			margin-left: unset;
			position: relative;
			top: -2px;
		}
		.colorCont {
			position: relative;
			top: -2px;
		}
	`;

                    titleCSShtml = `
	<style id="titleCSS" scope="tinychat-title">` + globalCSS + `
		@keyframes ease-to-left {
			0% {right: -50px; opacity: 0;}
			100% {right: 0; opacity: 1;}
		}
		@keyframes ease-to-right {
			0% {right:auto;}
			100% {right:0;}
		}
		@keyframes ease-to-bottom-21px {
			0% {top:-300px; opacity: 0;}
			100% {top:0; opacity: 1;}
		}
		#tes-header-grabber {
		    position: absolute;
			top: 88px;
			right: 50%;
			background: white;
			width: 60px;
			height: 20px;
			border: #ddd 1px solid;
			border-radius: 19px;
			text-align: center;
			color: #b4c1c5;
			cursor: pointer;
			transition: .4s;
		}
		#tes-header-grabber:hover {
			background: #e9eaea;
			z-index: 1;
			border-bottom: 0px;
            animation: smoke 4s infinite;
		}
		.tes-headerCollapsed #tes-header-grabber {
			top: 9px;
			background: #f6f6f6;
			border-top: 0;
			z-index: 9;
			border-radius: 11px;
			line-height: 11px;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			height: 12px;
		}
		.tes-headerCollapsed:hover #tes-header-grabber {
			height: 29px;
			line-height: 43px;
		}
		input {
			border: 1px solid #c4d4dc;
			line-height: 16px;
			padding-left: 3px;
		}
		.label ~ input {
			border-bottom-left-radius: 6px;
			border-top-left-radius: 6px;
		}
		input ~ button {
			border-bottom-right-radius: 6px;
			border-top-right-radius: 6px;
		}
		input[type="button"], button {
			display: inline;
			padding: 0 15px;
			border: 0;
			box-sizing: border-box;
			letter-spacing: 1px;
			font-size: 12px;
			font-weight: bold;
			line-height: 20px;
			text-align: center;
			transition: .2s;
			outline: none;
		}
		.blue-button {
			color: #fff;
			background-color: #41b7ef;
		}
		.blue-button:hover {
		    background-color: #54ccf3;
		}
		.blue-button:active {
		    background-color: #38a8dd;
		}
		.tes-setting-container {
			line-height: initial;
		}
		#tes-settings { color: var(--textcolor); }
		#tes-settings > div {
			/*animation: ease-to-bottom-21px .2s ease 0s 1;*/
			position: relative;
			top: 0;
			height: 100px;
		}
		@media screen and (max-width: 1000px) {
			#tes-settings > div {
				height: 92px;
			}
		}
		#tes-settings .hidden { display: none; }
		#tes-settings #title {
			font-weight: bold;
			margin-top: 6px;
            width: 600px;
		}
		#tes-settings {
			transition: all .4s ease-in-out;
			animation: ease-to-bottom-21px .2s ease 0s 1;
			/*max-height: 10%;*/
			font-size: 11px;
			flex: none;
			overflow: hidden;
			z-index: 7;
			position: absolute;
			top: -2px;
			right: ` + (giftsElemWidth + 10).toString() + `px;
		}
		@media screen and (max-width: 1000px) {
			#tes-settings {
				right: 37px!important;
				top: -20px;
			}
			#tes-settings.tes-open {
				top: 6px;
			}
			#tes-settingsGear {
				font-size: 52px!important;
			}
			#room-header-gifts-buttons > #give-gift {
				width: 102px;
			}
		}
		@media screen and (max-width: 600px) {
			#tes-settings {
				right: -4px!important;
    			top: 19px;
			}
		}
		#tes-settings:hover {
			overflow: visible;
		}
        #tes-settings-mentions {
            max-width: 360px;
        }
		#tes-settings-mentions .inputcontainer {
			float: right;
			position: relative;
			top: -3px;
		}
        #tes-settings-ignored {
            max-width: 360px;
            top: 54px;
        }
		#tes-settings-ignored .inputcontainer {
			float: right;
			position: relative;
			top: 3px;
		}
        #tes-settings-banned {
            max-width: 360px;
            top: 8px;
        }
		#tes-settings-banned .inputcontainer {
			float: right;
			position: relative;
			top: 3px;
		}
		#tes-settingsGear {
			font-size: 70px;
			color: #38cd57;
			color: #53b6ef;
			float: right;
		}
		#tes-settingsGear:hover {
			cursor: pointer;
			color: #7ccefe;
		}
		.tes-open #tes-settingsGear {
			background: white;
			border-bottom-right-radius: 15px;
			border-top-right-radius: 15px;
			border: #ddd 1px solid;
			border-left: 0;
			/*transition: all .2s linear;*/
			}
		#tes-settingsGear span {
			display: block;
			transition: transform 0.4s ease-in-out;
		}
		.tes-open #tes-settingsGear span {
			transform: rotate(-90deg);
		}
		#tes-settingsBox {
			background: white;
			padding: 0px 10px 0px 10px;
			float: left;
			border: #53b6ef 1px solid;
			border-top-left-radius: 12px;
			border-bottom-left-radius: 12px;
			animation: ease-to-left .2s ease 0s 1;
			right: 0;
		}
		#tes-settingsBox.hidden {
			animation: ease-to-right .2s ease 0s 1;
			display: visible;
			/*position: relative; right: -1000px;*/
		}

		.nightmode-colors {
			width: 0px;
			height: 0px;
		}
		.nightmode-colors:after {
			content: " ";
			border-radius: 3px;
			height: 11px;
			width: 11px;
			margin-left: 3px;
			top: -9px;
			position: relative;
			display: block;
		}
		.nightmode-colors:checked:after {
			border: #41a9c1 1px solid;
		}
		#black .nightmode-colors:after { background: black; }
		#gray .nightmode-colors:after { background: #575e60; }
        #textcolor .nightmode-colors:after { background: var(--textcolor-override); top: -11px; }
		.sublabel { margin-left: 15px; }

		/*** Inline with header ***/
		#tes-settingsBox {
			border-bottom-width: 0;
			border-top-left-radius: 0px;
			border-bottom-left-radius: 0px;
		}
		#tes-settingsGear {
			display: table;
		}
		#tes-settingsGear span {
			display: table-cell;
			vertical-align: middle;
		}
		/*** *************   ***/

		#tes-settings .tes-setting-container > input[type=checkbox]:first-child {
			margin: 0;
			margin-right: 1px;
			float: left;
			position: absolute;
			left: 8px;
		}
		#tes-settings .right {
			position: absolute;
			left: 210px;
		}
        #tes-settings .rightright {
			position: absolute;
			left: 380px;
		}
        .hideSpamChat {
            display: none;
        }
		#tes-settings-maxcamposition { top: 54px; }
		#tes-settings-borderlesscams { top: 67px; }
        #tes-settings-hidenewcams { top: 80px; }
        #tes-settings-togglehiddenmsgs { top: 41px; }
		#tes-settings .label {
			margin-right: 4px;
			margin-left: 16px;
		}
		#tes-settings .right .label, #tes-settings .rightright .label {
			margin-left: 24px;
		}
		#tes-settings .info{
			margin-left: 3px;
            margin-right: 4px;
			color: #0d94e3;
			font-weight: bold;
			font-family: Arial;
			border: #0d94e3 1px solid;
			border-radius: 16px;
			height: 1em;
			width: 1em;
			text-align: center;
			display: inline-block;
		}
		#tes-settings .info:hover:after{
			font-weight: normal;
			padding: 4px 7px 4px 7px;
			border-radius: 7px;
			color: white;
			background: #61787f;
			content: attr(data-title);
			display: inline-block;
			position: absolute;
			top: 52px;
			left: 0;
			z-index: 9;
		}
		/*#tes-settings .label:hover:before{
			border: solid;
			border-color: #61787f transparent;
			border-width: 0px 6px 6px 6px;
			top: 10px;
			content: "";
			left: 8%;
			position: relative;
			display: inline-block;
		}*/

		#tes-settings a:visited, #tes-settings a:link {
			text-decoration: none;
			color: inherit;
		}
		#tes-settings a:hover {
			color: #53b6ef;
		}

		#room-header {
			height: 100px;
			max-height: unset;
			min-height: unset;
			transition: all .4s ease-in-out;
		}
		#room-header.tes-headerCollapsed {
			height: 10px;
		}
		#room-header.tes-headerCollapsed:hover {
			height: 27px;
		}
		@media screen and (max-width: 600px) {
			#room-header {
				min-height: inherit;
				max-height: inherit;
			}
		}
		#room-header-info {
			padding: 0;
			padding-right: 45px;
		}
        #room-header-info > h1 {
            user-select: text;
        }
		#room-header-info-text {
			height: auto;
            user-select: text;
		}
        #room-header-info-details, #room-header-info-details * {
            user-select: text;
		}
		@media screen and (max-width: 600px) {
			#room-header-info-text {
				height: inherit;
			}
		}
		#room-header-avatar {
			margin: 2px 10px 0 35px;
			height: 90px;
			min-width: 90px;
			max-width: 90px;
			transition: all .5s linear;
		}
		#room-header-avatar:hover {
			border-radius: unset;
			z-index: 10000;
			width: 150px;
			height: 100px;
			overflow: unset;
		}
		.tes-headerCollapsed:hover #room-header-avatar:hover {
			z-index: 9;
		}
		#room-header-gifts {
			padding: 10px 10px;
		}

		.tes-headerCollapsed #tes-settingsGear {
			font-size: 33px;
		}
		.tes-headerCollapsed #tes-settings > div {
		    height: fit-content;
		}
		.tes-headerCollapsed #tes-settingsBox {
			border-width: 1px;
			border-radius: 7px;
			border-top-right-radius: 0;
			padding-bottom: 7px;
		}
		.tes-headerCollapsed #tes-settings {
			top: 13px;
			right: 0;
		}
		#tes-settings > div#tes-updateNotifier {
			top: -200px;
			margin-right: -33px;
			float: left;
			border: #53b6ef 1px solid;
			border-radius: 8px 0 0px 8px;
			padding: 5px;
			padding-right: 32px;
			height: auto;
			transition: visibility 0s, opacity 0.5s linear;
			background: white;
		}
		#tes-settings.tes-open > div#tes-updateNotifier {
			visibility: hidden;
			opacity: 0;
			width: 0;
			height: 0;
			padding: 0;
		}
		#tes-settings > div#tes-updateNotifier:hover { cursor: pointer; }
		.tes-closeButtonSmall {
			float: left;
			padding-right: 5px;
			color: #41b7ef;
			padding-left: 5px;
		}
		#tes-settings > div#tes-updateNotifier.visible { top: 38px; }
		.tes-closeButtonSmall:hover { color: #7ccefe; }

		#room-header.tes-nightmode,
		.tes-nightmode #tes-header-grabber {
			background-color: var(--nightmode-bgcolor);
			border-color: var(--nightmode-trimcolor);
		}
				#room-header.tes-nightmode.blacknight,
				.tes-nightmode.blacknight #tes-header-grabber {
					background-color: var(--nightmodeBlack-bgcolor);
					border-color: #222;
					border-bottom-color: #222;
				}
		.tes-nightmode #tes-header-grabber:hover { background-color: var(--nightmode-trimcolor); }
				.tes-nightmode.blacknight #tes-header-grabber:hover { background-color: #141414; }
		.tes-nightmode #room-header-info-details > span:after { background-color: var(--nightmode-bgcolor); }
				.tes-nightmode.blacknight #room-header-info-details > span:after { background-color: var(--nightmodeBlack-bgcolor); }
		.tes-nightmode #tes-header-grabber { color: #565e61; }
		.tes-nightmode #room-header-info > h1 { color: var(--nightmode-textcolor); }
		.tes-nightmode #room-header-info > h1:after,
		.tes-nightmode #room-header-info-text:after {
			opacity: 0;
		}
		.tes-nightmode #room-header-gifts-items { background-color: #313c3f; }
		.tes-nightmode #room-header-gifts-items > a > img { mix-blend-mode: multiply; }
		.tes-nightmode #room-header-gifts-items:hover > a > img { mix-blend-mode: unset; }
		.tes-nightmode #room-header-info-details > a { color: #417186; }
		.tes-nightmode #tes-settings { color: #98a1a4; }
		.tes-nightmode #tes-settingsGear { color: #145876; }
		.tes-nightmode #tes-settingsGear:hover { color: #1c7ca6; }
		.tes-nightmode #tes-settingsBox,
		.tes-nightmode .tes-open #tes-settingsGear {
			background-color: #354245;
			border-color: var(--nightmode-trimcolor);
		}
				.tes-nightmode.blacknight #tes-settingsBox,
				.tes-nightmode.blacknight .tes-open #tes-settingsGear {
					background-color: #222;
					border-color: #333;
				}
		.tes-nightmode #tes-settings > div#tes-updateNotifier { border-color: #5d7883; }
		.tes-nightmode #tes-settings > div#tes-updateNotifier {
			background-color: #354245;
			border-color: #145876;
		}
		.tes-nightmode input {
			background: #626b6f;
			color: #c4c8ca;
			border-color: #79868b;
		}
				.tes-nightmode.blacknight input {
					background: #444;
					border-color: #666;
				}
		.tes-nightmode #tes-settings .info {
			color: var(--nightmode-headerButtonscolor);
			border-color: var(--nightmode-headerButtonscolor);
		}
		.tes-nightmode path { fill: var(--nightmode-headerButtonscolor); }
		.tes-nightmode circle { stroke: var(--nightmode-headerButtonscolor); }
		@media screen and (max-width: 800px) {
			.tes-nightmode #room-header-gifts { background-color: var(--nightmode-bgcolor); }
				.tes-nightmode.blacknight #room-header-gifts { background-color: var(--nightmodeBlack-bgcolor); }
			}
		.tes-nightmode #room-header-gifts-buttons > #upgrade { background-color: #6d551d; }
		.tes-nightmode #room-header-gifts-buttons > #upgrade:hover { background-color: #776231; }
		.tes-nightmode #room-header-gifts-buttons > #get-coins {
			background-color: #3a474b;
			border-color: #275b72;
			color: #317490;
		}
			.tes-nightmode.blacknight #room-header-gifts-buttons > #get-coins { background-color: #222; }
		.tes-nightmode #room-header-gifts-buttons > #get-coins:hover {
			background-color: #48626a;
			color: #5fa9c8;
		}
		.tes-nightmode #room-header-gifts-buttons > a {
			background-color: #275b72;
			color: #788f97;
		}
		.tes-nightmode #room-header-gifts-buttons > #give-gift:hover {
			background-color: #1a80a2;
			color: #a3b5d2;
		} ` + firefoxCSS + `
        @keyframes smoke {
  0% {
    background-color: var(--nightmode-trimcolor);
  }
  50% {
    background-color: white;
  }
  100% {
    background-color: var(--nightmode-trimcolor);
  }
}

.smoke-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.smoke {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--nightmode-trimcolor);
  animation: smoke 4s infinite;
}
	</style>
	`;
                    titleCSS.insertAdjacentHTML(insertPosition, titleCSShtml);
                }

                { // videolistCSS
                    videolistCSShtml = `
	<style id="videolistCSS" scope="tc-videolist">` + globalCSS + `
		#videos-header {
			height: 10px;
			min-height: 10px;
			background: none!important;
			z-index: 5;
		}
            #videos-header #videos-header-fullscreen,
    #videos-header #videos-header-mic,
    #videos-header #videos-header-sound {
      display: inline-block;
      transition: transform 0.3s;
    }

    #videos-header #videos-header-fullscreen:hover,
    #videos-header #videos-header-mic:hover,
    #videos-header #videos-header-sound:hover {
      transform: scale(1.420);
    }
                #watchPartyButton {
    height: 100%;
    left: 100px; /* Adjust the value as needed */
    width: 50px;
    min-width: 50px;
    margin-right: 10px;
    line-height: 50px;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADhCAYAAAC5p2xVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAZ20lEQVR42u3de3Bc9Xk38O/zO2dX2tVlJdnYsi1j2WDZRtg4YPAdcBpImhY3bdLOtLlMyHQ6fd8AKQEnnTRvAqGYQCAGSsHQNtSBtBOModxCW5JgzM0mxgFs4QsGW1dbvki7uqyk3T2/5/1Dkm1ZsizJlrV79vuZ0WAJrS7POfru85yz53cElPFqF5eFbFtxLgCErM1RkwwDgAcEAZN34ucqbPHJjxcg30ICJ37MKHIgEj7xY1bViCBy8uNVtVBEnFP9fAIJWti84fxOAiQAaR/0c1RiKmr7/jASF0FX399Zkwq09f8e2tzvdxGnzagme9/3gEQQth0APBtIJY1pBYD8jg5v3N69Ldz7MpuwBCOnfw6nZtfcQkc68qxFjituEYwNqUWuquZATFhEXFEUWEAEWtT9R6YRUTFQFKioC0jYADkK5AASFqirQEHPX2+hCpzeoALQG1R5AILcCumxKwCInvB+VLs/BoHEALUQdEKlQ6FJA7SpwKpqrOdzogBUBa2iSPWGuBXbCZUO0xPgasUzRloA225Euro0GLWtrR3T9+/v5CZgAJ7W4VmzCrpyvIiLQJHn2Yg1GnFgiqxoRBSFAuSrIkdFI8dDSYoBzQEQBjQCSA66g6gAgMtdiNJEFNAuhbSLoEVUuhRoBbQNgq7usJW4AF0AmkXRYY3ERDVqVWLGScVca2KdyGk+f/v2qPQEOAMwDVXPnVsskpoi6k01kFKFFitMRFQjEC1SSEQEESgiAIoAFAOIADD8OyEaUkvbIkAMQAyKKERiAo2pIgajUVWJCaRZoI2e1QZrnbppO3c2CmAZgGdBbWVliTip+QKdrVYqIZgFoAzA1O5ujIjSTBLAQQC1UNmroh8awc6U6o5p2/d8wgAcRN3s2ePUxVVG7NUKuRrAxeAxSiK/aBBgo0Jeg8HGsvd37cn6ANxXXp4bzMu9RkW/CuBPwIP6RFkyYsuHANYHjK4r/WD3vqwKwIZ5cy616t0ElT9D79lOIspGFopXYfDolNm7n5H18HwbgPWVs5aq6A8BuYbbnYhO6gv3CuTHk8dPWicbN6Z8E4B1l8yuUE/vBvAFbmQiOk0o7RSV706p2vVCRgfg1ssuC0xMtH0bitsA5HLTEtEwOsIXHQ18c3JVVU3GBWDt3NlzAfufUKnkhiSiEWoR6A1lO/Y8kTEBWHfxzL9VyE8BhLj9iOiMe0Hg57ka+OaEqqq2tA1Avfpqt/5I/YMK+T/cZER0lmNwR8p1rpv+3q79aReAtZWVJZDk0wBWcEMR0Sg5CMWfTK3a807aBOCBT114XjJpfg1gHrcPEY0uiavRldM+2PObMQ/AvfMumBD0nF8DmMsNQ0TnLATFfmHajo9eGbMA3De/vMhJBjcx/IhoDHQo5JppVbvfHOkXGPHyUFWVlUEnFVzP8COiMRIS6PP75lbMPucBWIDE/VB8htuAiMZQibH4r4Pz5uWN5MEjCsDaORWfB+RvWXsiGmsCzEp4nQ+M8LHDUzd79jjPsbsAjGfpiSh92JXTqvYO6/rhYXeAnmN/zPAjovTrBJ2HhjsKDysAayorLgfwDZaaiNKNQs/v8jq/M2oBqMBd4I2FiCh93fLJxdMnnvUArK6sWAbgD1hfIkpjeUYDQ+4Ch3wSpHrOrP+B6LWsLxGlNUGHQaBsalVV0+k+dUg39q6dM2emJx6XsSei9KcIeUh8A8C9Z2UE9sS7EbxFJRFlTht4gwLOGQfgocrKfAi+xoISUQaZVj1n5ufOOADjNvk1KCKsJxFlVhMo3zzzEVjwN6wkEWWgz+6bPbt8xAH48ezZFQAuYR2JKAMZMd6XBvsEd/AO0vsL5bkPIsrcOfhLGORs8KDptu+imb8HMJ9FJKIMpaqp6TN27qse1ghcPbdiBsOPiDK9BTQm8MVhj8A2pV9i7Ygo81tAfBHAT4fVAUL1sywdEfkgAhdWzz2/eMgBWFtWFoLIEhaOiHzA0VTu1UMegVP5uVcqkMu6EZEvekDYPwDw7JA6QIXwZkdE5CMDZ9qAASgiK1gwIvKRWbUVFVNOG4ANl00OK5RXfxCRryQDdvFpA7CrPXw5hrhOIBFRxlAsOv0ILP0/iYjIB/plW79Oz8JcBihLRUQ+6wDlUgUcAbxTBiDUXsLFn4nIh0L7KypmYs+eXQOOwLVlZSFALmCdiMifTaCde+L7fQKwKz/nIgxhHX0ioswkpw5AozKDBSIi/3aAmHHKAFQxU1kiIvKxPhnX5ySIVZ0qPP9BRP5VdsoOEAJ2gETk6wDUE3LP9M0/TGZ9iMjHgh9fcMH4gTtAYBLrQ0R+Zly39FQBOJHlISI/88Q7FoDHToLsKy8vSqmGWB4i8jNR7d8BJoLBUpaGiPzOiukfgMZYBiAR+b8DFJ3YLwDFKgOQiPxP0b8DVBEGIBFlg0n9AhDCM8BElBX6nwVWq6XgdXBElEUByBGYiLJN8b7y8tw+ASgcgbNOzrxLXocxR1kJyjYakol9AhCKCSxLdpnwve9PmL5la27oupWvQyTGilC2sGrG9w1AoIRlyT5uQUFe2U/uWz7pld9q8NOffgMibawK+b4DhIwDek6CvD9vXh4647wMLovll5UV5T7w0LLYRx81t9z94zdSm99eACCXlSFfBqA9IQDz29rGpVzDqmR7NxgIYNxFFxWH/umhZS27djW237V6m/dh1RUY6O6BRBlMYI+PwNaYcSwJ9QoXFmL8pz41sejhR5bkP77ukHNR5Vs44V6qRBnfAUp3B2gAQBmANFA3OGkSii6+eHLBAw8uKXh4ba0pm/oOAGV1yAeOj8AKbzxvhk6n6gaDoRBigUC5+dnj5d777++Or76zwzY3zWd1KIN7wOMdICA8A0yn7QYLiovhzp8/q+CXT83Pu+323VJQsJPVoUwk2p15pvsdLWZJaCjdYMmkSXCDQbhLls4q3PDsnPAPbtuOcHg3q0MZ1f8Jio+NwNYgwiM7NJxuMN7SgrZoFIFly+ZGli7Vrhdf2Nq5du14TSbKWSXKgAiMnNABmggLQiPtBiEiOdetXBB54cXzQzfetFVcp5YVojQfgo8HoPakIdFIusGC4mKICGCMyblu5YKi518qzfmrL28WkUOsEqWp4wEI9IzAfMuut9HoBgGo6wZCX79+UeHzLxYE//CP3hRIlPXmW5q9haoqK4PdAahgB0hntxsEIDk5ofDNNy+N/NdzgeDn/+hNiLSwUpQ2+2wyWXjCCMynBLaAZ78b7P5gOC98881LC9c/bQOLF78BaAdrz7exfjPWRnqv8YzwJHD2Ga1tfvKZYtXu72QikaK8H92xzDY2Horfd++25O+3LQCQwy1BYyEJRHqPAeazHHROukEAZuLECfn3/GRp0ePrmp2ZM38HwLJadK4JUNgbgHksB52rY4PHdsCystLCh9deHnn0X2rN1DJeZ0zndgIyNmyqKiuD4HJHNEbdIACYGTOmRX627oqihx/Z1xOERKPOWBM2ifb2MEtBY90NAoDMrJgR+dm6Kwru/slOKS76gBWj0WSNhk0oJ4cBSGnTDQKAe+mlc4qe2jAv74e3bZdweBcrRqPSAaqGXS+VCgsXg6Yx6gZPPlN8ouCy5XODS5dp8pVX3mt98IE8dHXOZOXorBETdh1rw5YJSGPYDQZDIcSOHEEqkRhgJxUJXHvt/JLPfMZ2vvji1vgjD09AMnk+K0dnSqFhYx2HIzClRTd4qmOD3fOKMbkrVy4Y9+JLk0Nf/spmGNPIytEZNYCKkFFVBiClTTc42LFBAFDHcUPXX79o3K9eLgl9+SubxZjDrByNsAMMGTHK22FSZnWD6Flw4frrFxU982xe7jXXbIZIK6tHwwpAkTwDK0GWgjKxGwQAyc8Ph7/794uKN2ywwcVL3gAQZ/VoKIxKwFURly/Ap3TuBgc7U3wsCAsjkfw77lhmo9Hm+H33bet6+y3e2J0GZaGOEVWHpSA/dIMAYIqKivPvuGNZyZO/iLqVlW8BSLGCNOCTJsQ13R0gUWZ0g6c7Nnhs5y4tLY088OCSon/9lwb3wgs2gwsuUD/qGmUHSD7tBgHAKZ9xfmTtY4uKHn6k2uF1xtT3adIxhh0g+bwbBACnomJ60ePrrojce98uU1LyPqtIgLouO0DK5G5w0KtIBgrP+fNnFz+1HqmtW3e2rl6dsrHYXFYye59Lu88CK88CU2Z3g0M5U9zncQsWzCl+5hkkXn99e9vddwdtR8csVjP7dh+eBSbfdIPDOTbYK7h8+dyS55+fmf+tb21FIFDNSmbRAAw4xqpyJQTyVTc4nGODAI5dZ3zeSy9NCX/961vFdQ+ymv4ngGsEEN4hKlvf/PnKkJF2g+o4bvirX10w/qWXxoW/8pXNauQw9xF/7//s/ojd4MlB6LqB8PXXLxr/wgt5ud33M46yov7EACRfG2k3CACSGwrn33LL0vHPvxDoCUIuuODHAGQzzNuisxscLEXDefm33LK0ZMMzqeCSJW8o0Mn9xx9v7ACJ3eBQu4VIpLjwjn9cVvIf/9kSqLyI1xlzBCbKsm4QgDNx4oSiBx9aUvzzJw73BKHHymbo/gCAq2FlqyxeHmAkV5H0++OZMmVS0YMPTfI++WR/7PbbD3m1tZcDEO5YGULZARK7wTPqBgHAmTGjvGTduiuK16zZ45SWvsvKcgQmyqhusKS0FIHgmS2O7l5yyay8b3zDwHF4w6ZMeRL02LMTwQ0GUTKCa4p7JbZu3dmyenXSRqOfYjUzaLuzBER9u8HhHBtMbtu2q+Xee9u9gwcvY/UYgESZ/0cxhBVmknv27Gu5887DPPHBACTKmm7Q+/jj6pZ77mlIfvTRQgDTWSUGIJGvu8GS0lJEd+w40Pi97+1LfvjhQgDTWBkfBSBfBpideJeg00vU1x+oW7Xqo7YtWxYCmMSK+IewAyQaWKqpqal21artrRs3XgHgSlaEIzCR73nNzc11P/jBBy0vv3ypql7Fivg9AC14Dot4OCAeb2+47fatTRs2zAeDjx0gUVYEX0dH/ODd92w98uSTc2Atg48BSOR/mkwmGu9/YMvhxx6rUM/jMb5sDUBOwJRVwed5qcNrH9ty8MH7z9dkajkrksX7AjtAyp5Z19rDTzyx5cBdP56kicRSFoQ4AlNWiL788rbaVd/Js/H4YlaD+gSggVXlEEw+1Pzcc+/V/cM/5Nh4/FJWgwYMQBXhBQHkK62bNm2v+fa3vVRT03xWg05FgJQrIqnhrn1GlI7a3nqrqmbVqnjywIHLWQ06HQVSrqp6jD/KZB07duzdf+ONh7uqqxeBL2qgofNcWElBGIGUgcG3a9cnNd+6+UDHnt2LAVzIitAwpVwV6/FJkzJJV01NffVN3/ok/t77iyGYwYrQSIgg5UINO0DKCIn6+gM1t6z6qG3L5oUApvB5m86E1Z4OULgnUTrPKU1NTdW3rtre+uqrXJqKzl4HCPVciKS4IiqlI6+5ubn2+z/4IPbyr7g0FY1GBKZctdaD8PbAlEajSTzeXnvbbVubnubSVDSaNOUaOF3KFpDSIfg6Oroa7rrrvSNP/mImOz4afSbpCrwOBTtAGsvn4VTywJo1mw89+liFet5CVoTOzQSs7W5KJM74o7Fp+bpXaKm/884pXJqKzv3+h7gLY+KwHIFpDIJv9V2TNJHgCi00Ng0g0OEiaeIwHqtB50T0pZe3Vd+6Kmw7uDQVjfHzsEiHC5OM8xggnYvg2//d7+TatnYuTUXpEoFxF44TB5dDoFESe23T9uqbb/FSTUcZfJReI7CVuIvi4jiONLEadFa1vv12VfUtt8YTDVyaitI1ASXuLnj33eS706YnAQRYETpTHTuq9u674YbDnfu5NBWlOy/ee0+QdgBFLAiNOPh27fpk3w03Hencu3cBuDQVZUoH2PPPFgYgjURXbW3D/htv+rj9vfcXA1yaijIqAKMuAKggxqvhss+ZbPKuuvoD1beu+qh18+aFACazmpRpjGqsuwNUG+PhGhqK1NGmpv2rbt0e+y2XpqLM5ljbE4AwMbAFpEF4bW1ttbf/6N2jTz99KVdoIT8MQEdrZrR2B6DVGBtAGoiNx9trfnjb1qPrn76EwUc+yr/2FdiY6g5Aw2OAdNLukUwmDqy5f8vBR9bOUmsZfOQzEgOAnmOAiLEgBPQsTfXTNZsPrH20Ap7HFVrIr04IQCDGBjDbZ11rD617YkvtnXdO0WSSwUdZFICKKI8BZm3waeO/Pf5O/U/umWi7uDQVZcuog+jxABQ5yrPA2efwv//8wJ7//bKxHZ1chZmyi+jREwLQHoGyBcw2R5977mpWgbI0AY8A6F4IUDxzlAUhoqyJP5GjxwKwC0kGIBFlD3vCCNzlukddy5oQUXbQng7QBYAV+/d3vjO1vB1AHktDRP6fgb3jI3APjsFElB16znucEIB6iFUhomyQktThvgGoOMiyEFEW0ODEiYf6BqBhABJRVjiy4N13k8Dxa4FhFQf5Umgi8jvB8WbvWAcoahpZGiLKAv0DUDkCE1EWUNX+AQgIA5CI/M8M0AHCgiMwEfme6PGsOxaAqc4AO0AiyoIZ+HgHeOws8LIju1s3l03j5XBE5PMOcMBjgH1PDxMR+ZKDgQNQhQFIRD6fgD1v4ACE1TqWh4h8rGNhff3RgQNQpJb1ISL/kj5NnntSc1invD0cEfl1/IX2afL6HgMEO0Ai8nH/J4MEoFHzMUtERL7tABWfnDIA84vCOwEkWCYi8mcLaD44ZQBWVlUlAOxhlYjIjwJi+wSg2y8gge2quJilIiKfaVtQU7N/0AC0Ku8A+pesFRH5avoFfieAPeUIDAAW2MxSEZHfWODtkz/WLwBbQu7vAXSxXETkJ0Z182kD8PN793YB2MZyEZGPqPUCW04bgACgwG9ZLyLyke1LGz8+NKQANCK/Zr2IyDftHzBgprkDfbAwkvdWNNrWBiCfpSOijA9AwW8GbPYG+mBlVVVCgNdZNiLygUSyK75pyAHYnZj636wbEfnAGysOH24b8ggMAAK7QdVZM1hIEhGl//gr60/1/04Zbkvq6urBF0UTUWaz1tXnTvU/3UEfKnYDVJawhkSUiUR105XVtQdGFIAp9dY7cO8FuEw0EWVg+ydYP9j/H/T43lUNDbUcg4koQ6VSSeeZEQcgAKhgLetIRBk3/gLPrji8/+AZBWBrKPhLAI0sJxFlEs/afz7d55w2AD+/d28XBD9jOYkog3y4/GDdpjMOwO452F0LIMWaElFmzL/6TwLoEMbkoXl98tRnAPlTVpaI0jr7gBgSoanLjuxuPd3nukP9ogrzj6L6BfAlMUSUxlRw//IhhN/QR2AAVzZUbwP0WZaXiNJYNBU09w/1k4d1na+F+T4ESdaYiNKy+4P+aMX+/dFRCcCrDlTvFOB+lpmI0lBV+MCEh4bzgGGv9JJMdvwI0BrWmojSiLXQ/7sA7w5rQh3RCY2Nk6YuN5BXATisOxGlwex7z5UHa7473IeNaK2/qw/Uvg7R1aw6EaWB340bV/D/RvLAEb+kRQHz+qTzfwngS6w/EY1N44d6SGpxz8Itwzbi1Z4FsK5jvwbgDW4GIhoDUWv1cyMNvzMKQABYUlfX0WG7Pgcd+I5LRESjFX5Q+9kVjbU7zuSLnJWrOrZOnhyOe+6zEFzL7UJEo0sOizXXLD+07/0z/kpn60eqqqwMHm5q/WdR/DU3EBGNSvQBH3vG/PGKhv27ztLXO7s2lU67QaFrMIzrjImIhhBXryWd1Bc/U19/9Gx9xbN+y8srD1Y/pNAlAHZxgxHRWaAQPDh+XP61ZzP8RqUD7PVWWVkomZTVENzAbpCIRqgBBtdf1VD7v6M0Uo+uVyeXz3ast0aBz3FbEtFQuz6BPum6+LsldXVNozZUn6vfZmNp2R+K4Pu8zzARncZrAv3OlQfr3hntb3TOFzfdWDplBWBuALCSozERHQsjxZsQXX3VwbpfnbPvOVa/7G/KyqY4KfwVBF+AyiKMwgkZIkp7bYA+a4159NMNNW+e89BNhwq8el55qXHtSlX9UwDLAeRxvyDyLQ/AKyr6i4RNPvvZxsb2Mes6060yrwIupky52FhnoaouBLAAwCwAQe43RBkbeNsU2CQqrzk5eGN5TU1zWozdmVC9pwDnvPPKphsHFWplNoALxOACVcwAMI3hSJQWIdcIoAaCBlHdo2o+tA4+LJTUzgUNDfF0/KEz/g5vTwHOeaXlU43qDMCWW8gEUZSoaIkIiqEoAVACoLjnvxyviU4tASAGICZATIFmqEZVJCaCGCyi6Pm3pxo1ag95ntSYo3WNKzLw3uFZd4vLX114YU4olir2HFvieCgRQQgGRdYiJOj+N4AQ1OYKUAyRXFWEABRBEELvv4FcAOGetxz+3dAYaQPQKUCLAu0AOnvCK65Ah0BjCokD2gkxUVV0AOg0gmZrtUXExuAEok5CY7FgMnZdmnZqDMA092p5ea5rbair0wlCvDx4nmsCToFABVaKeqpdJICo2kKFcaCaL0YCsDYXghAAQCVfRAM9m6dIAYGIgWoEAEQRVDnWxYalJ3wVKMDxlxUF2emesz+gFu0e/wAgKoAqoACiPR+zPR0VADR3byuJGlhVkRaoeoC0QSQJ2HZVkzCKDhh0QtGpQIc1mhBIu/VsEmLagpJoNalU57IjR1q5BRiANISutyCRCPe+r3HJTTga6n3fgYbVyLEuVqF5xsrx46q9Qd37F61aAMix13CKaiGMHL8/jEIAW3Tyz6EwYQM7om5Ze8Kjz84rpkuBPh2LqI1bmK6+O7m2iIjX5+tp368n4nlWnJaTvmmn7e6Y4FgTd0O2CwBCNee1DffmO5Se/j/cn1E5m5VDMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wMy0yNlQyMzowNTowMSswMDowMCO1FSsAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDMtMjZUMjM6MDU6MDErMDA6MDBS6K2XAAAAAElFTkSuQmCC);
    background-size: 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    overflow: hidden;
    transition: .2s;
    background-color: rgba(0, 0, 0, 0); /* Transparent background */
      border: none; /* Remove the border */
  outline: none; /* Remove the outline */

}
		#videolist.tes-sidemenuCollapsed { width: 93%; }
		#Fvideolist * {
			width: 75%!important;
			display: contents;
			float: right;
			flex-direction: column;
		}
		#Fvideos {
			flex-direction: unset;
			flex-wrap: unset;
		}
		#videos-header > span {
			line-height: initial;
			position: relative;
			top: 1px;
			background: none;
		}
		#videos-header > span > svg {
			height: 16px;
			padding: 0;
		}
		#youtube.video:after { border: none; }

		.js-video { transition: all .4s ease-in-out; }
		.tes-max-noAnim .js-video { transition: unset; }
		
		/* Smaller footer buttons */
		#videos-footer {
			height: 43px;
			min-height: unset;
			padding-bottom: 0;
		}

		#videos-footer > div {
			height: 35px;
			min-height: unset;
			line-height: 35px;
		}
		#videos-footer-broadcast-wrapper > div {
			height: 35px;
			line-height: 37px;
			font-size: 15px;
		}
		#videos-footer-broadcast-wrapper > #videos-footer-push-to-talk { line-height: 34px; }
		#videos-footer > div svg { transform: scale(.70); }
		#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:before { top: 14px; }

		#videolist.tes-nightmode { background: var(--nightmode-bgcolor); }
				#videolist.tes-nightmode.blacknight { background: var(--nightmodeBlack-bgcolor); }
		.tes-nightmode #videos-footer-youtube { background-color: #723e3c; }
				.tes-nightmode.blacknight #videos-footer-youtube { background-color: #4e1f1d; }
		.tes-nightmode #videos-footer-youtube:hover { background-color: #a83c38; }
				.tes-nightmode.blacknight #videos-footer-youtube:hover { background-color: #742825; }

		.tes-nightmode #videos-footer-broadcast,
		.tes-nightmode #videos-footer-broadcast-wrapper > #videos-footer-submenu-button {
			background-color: #31684c;
			color: #519472;
		}
				.tes-nightmode.blacknight #videos-footer-broadcast,
				.tes-nightmode.blacknight #videos-footer-broadcast-wrapper > #videos-footer-submenu-button {
					background-color: #12261c;
					color: #2d5240;
				}
		.tes-nightmode #videos-footer-broadcast:hover,
		.tes-nightmode #videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {
			background-color: #338e5f;
			color: #82d9ad;
		}
				.tes-nightmode.blacknight #videos-footer-broadcast:hover,
				.tes-nightmode.blacknight #videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {
					background-color: #17402b;
					color: #41956b;
				}
		.tes-nightmode #videos-footer-broadcast-wrapper > #videos-footer-submenu-button:before { border-color: #519472 transparent; }
				.tes-nightmode.blacknight #videos-footer-broadcast-wrapper > #videos-footer-submenu-button:before { border-color: #41956b transparent; }
		.tes-nightmode #videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover:before { border-color: #82d9ad transparent; }

		.tes-nightmode #videos-footer-push-to-talk { background-color: #31684c; }
		.tes-nightmode #videos-footer-push-to-talk path { fill: #82d9ad; }
		.tes-nightmode #videos-footer-push-to-talk:hover { background-color: #338e5f; }

		#videos-footer-broadcast-wrapper.active-ptt > #videos-footer-push-to-talk { background-color: #404f54; }
		#videos-footer-broadcast-wrapper.active-ptt > #videos-footer-push-to-talk path { fill: #74817a; }

		.tes-nightmode #videos-footer-broadcast-wrapper.active > #videos-footer-broadcast,
		.tes-nightmode #videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button {
			background-color: #404f54;
			color: #74817a;
		}
				.tes-nightmode.blacknight #videos-footer-broadcast-wrapper.active > #videos-footer-broadcast,
				.tes-nightmode.blacknight #videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button {
					background-color: #222;
					color: #555;
				}
		.tes-nightmode #videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button:before { border-color: #74817a transparent; }
		.tes-nightmode #videos-header path { fill: var(--nightmode-headerButtonscolor); }
		.tes-nightmode #videos-header path[fill="none"] { stroke: var(--nightmode-headerButtonscolor); fill: none; }
		.tes-nightmode .videos-header-volume { border-color: #3a474b; }
				.tes-nightmode.blacknight .videos-header-volume { border-color: #222; }
		.tes-nightmode #videos-footer-youtube path { fill: #996d6c; }
				.tes-nightmode.blacknight #videos-footer-youtube path { fill: #634645; }
	</style>
	`;
                    videolistCSS.insertAdjacentHTML(insertPosition, videolistCSShtml);
                }

                { // chatlistCSS
                    chatlistCSShtml = `
	<style id="chatlistCSS" scope="tinychat-chatlist">` + globalCSS + `
		#chatlist.tes-mod { margin-top: 22px; }
		#chatlist > div > span {
			padding-left: 1px;
		}
		#chatlist > #header {
			top: 3px;
			height: auto;
		}

        .list-item > span > span > span.send-gift {
			display: none;
		}

		/*** --- this block is in chatlistCSS & userlistCSS --- ***/
			.list-item > span > img {
				right: 13px;
				left: auto;
			}
			.list-item > span[data-status]:before {
				left: auto;
				right: 0;
			}
			.list-item > span > span {
				background: none!important;
				box-shadow: none!important;
			}
		/*** ---                                        --- ***/

		.close-instant > path {
			fill: white;
		}
		.list-item > span > span { /* gift and close buttons */
			right: 16px;
		}
		.list-item > span:hover > span { /* gift and close buttons */
			right: 16px;
			background: var(--nightmode-bgcolor);
		}

		/*** --- this block is in chatlistCSS & userlistCSS --- ***/
		.tes-nightmode.blacknight .list-item > span,
		.tes-nightmode.blacknight .list-item > span> span {
			background: var(--nightmodeBlack-bgcolor);
		}
		.tes-nightmode.blacknight .list-item > span > span { box-shadow: 0 0 3px 3px var(--nightmodeBlack-bgcolor); }
		.tes-nightmode.blacknight .list-item > span:hover,
		.tes-nightmode.blacknight .list-item > span:hover > span,
		.tes-nightmode.blacknight .list-item + .list-item > span:hover,
		#chatlist.tes-nightmode.blacknight > #header ~ .list-item > span.active {
			background: #222;
		}
		/*** ---                                        --- ***/

	</style>
	`;
                    chatlistCSS.insertAdjacentHTML(insertPosition, chatlistCSShtml);
                }

                { // userlistCSS
                    userlistCSShtml = `
	<style id="userlistCSS" scope="tinychat-userlist">` + globalCSS + `
		#userlist > div > span {
			padding-left: 1px;
		}
		.list-item > span > span {
			right: auto;
			padding: 0 5px;
		}
		.list-item > span > .nickname {
			padding-right: 3px;
			transition: .5s;
		}
		.nickname.tes-myNick { color: #b3b3b3; }

        .list-item > span > span > span.send-gift {
			display: none;
		}

		/*** --- this block is in chatlistCSS & userlistCSS --- ***/
			.list-item > span > img {
				right: 13px;
				left: auto;
			}
			.list-item > span[data-status]:before {
				left: auto;
				right: 0;
			}
			.list-item > span > span {
				background: none;
				box-shadow: none;
			}
		/*** ---                                        --- ***/

		.list-item > span > span[data-moderator="1"]:before {
			filter: hue-rotate(226deg) saturate(4000%);
		}
		#userlist > #header {
			top: auto;
			height: auto;
			overflow: unset;
		}
		#header > span {
			width: unset!important;
			overflow: unset!important;
			}
		#button-banlist {
			right: -34px;
			position: fixed;
			top: 74px;
			left: 1px;
			width: 147px;
			transition: 1s;
			z-index: 8;
		}
		@media screen and (max-width: 1000px) {
			#button-banlist {
				top: -80px;
				left: 5px;
				width: 115px;
				position: absolute;
			}
		}
		.tes-sidemenuCollapsed #button-banlist {
			left: -100px;
			width: 10px;
			opacity: 0;
		}
		#contextmenu { z-index: 6; }
		#userlist .yourname, span[data-user-id="840113"] {
			color: white!important;
		}

		/*** --- this block is in chatlistCSS & userlistCSS --- ***/
		.tes-nightmode.blacknight .list-item > span,
		.tes-nightmode.blacknight .list-item > span> span {
			background: var(--nightmodeBlack-bgcolor);
		}
		.tes-nightmode.blacknight .list-item > span > span { box-shadow: 0 0 3px 3px var(--nightmodeBlack-bgcolor); }
		.tes-nightmode.blacknight .list-item > span:hover,
		.tes-nightmode.blacknight .list-item > span:hover > span,
		.tes-nightmode.blacknight .list-item + .list-item > span:hover,
		#chatlist.tes-nightmode.blacknight > #header ~ .list-item > span.active {
			background: #222;
		}
		/*** ---                                        --- ***/
		.tes-nightmode.blacknight .list-item > span:hover > span { box-shadow: 0 0 3px 3px #222; }
		.tes-nightmode.blacknight #button-banlist { background: #222; }
		.tes-nightmode.blacknight #button-banlist:hover { background: #00708f; }

		/*#userlist > div {
		  transition: 0s; animation-duration: 0s; -webkit-animation-duration: 0s;
		}*/
	</style>
	`;
                    userlistCSS.insertAdjacentHTML(insertPosition, userlistCSShtml);
                }

                { // userContextmenuCSS
                    userContextmenuCSShtml = `
	<style id="userContextmenuCSS" scope="tinychat-user-contextmenu">` + globalCSS + `
		#main {
			border: 1px solid rgba(0, 0, 0, .1);
		}
	</style>
	`;
                    userContextmenuCSS.insertAdjacentHTML(insertPosition, userContextmenuCSShtml);
                }

                { // bodyCSS
                    bodyCSShtml = `
	<style id="bodyCSS">` + globalCSS + `
		#nav-static-wrapper {
			width: 2px;
			opacity: .7;
		}
		@media screen and (max-width: 1000px) {
			#nav-static-wrapper {
				width: 82px;
				opacity: 1;
			}
		}
	   #content {
		   padding: 0;
		}

	    #menu-icon { transition: 1s; }
		.tes-sidemenuCollapsed #menu-icon {
			z-index: -1;
			opacity: 0;
		}
		body.tes-changefont {
		  font-family: sans-serif;
		}
		#header-user {
			left: 62px;
			bottom: 22px;
			transition: 1s;
		}
		.tes-sidemenuCollapsed #header-user { display: none; }
		@media screen and (max-width: 1000px) {
			#header-user {
				left: 21px;
			}
		}
		@media screen and (max-width: 600px) {
			#header-user {
				left: auto;
				right: 54px;
			}
		}
		@media screen and (min-width: 1000px) {
			#menu-icon:hover { opacity: 1; }
			#menu-icon {
				top: 4px;
				left: 19px;
				height: 12px;
				width: 109px;
				font-size: 10px;
				background: #04caff;
				border-radius: 6px;
				opacity: .8;
			}
			#menu-icon:after {
				position: absolute;
				top: 3px;
				left: 51px;
				content: "";
				height: 7px;
				width: 7px;
				border-width: 2px 2px 0px 0px;
				border-style: solid;
				border-color: #fff;
				box-sizing: border-box;
				transform: rotate(45deg);
				transition: .2s;
			}
			#menu-icon:hover:after {
				left: 55px;
			}
			#menu-icon.expanded:after {
				border-width: 0px 0px 2px 2px;
			}
			#menu-icon.expanded:hover:after {
				left: 40px;
			}
			#menu-icon > svg {
				opacity: 0;
			}
		}

		body.tes-nightmode {
			color: var(--nightmode-textcolor);
			background: var(--nightmode-bgcolor);
		}
				body.tes-nightmode.blacknight {
					color: gray;
					background: var(--nightmodeBlack-bgcolor);
				}
		.tes-nightmode.blacknight #nav-static-wrapper { background: var(--nightmodeBlack-bgcolor); }
	</style>
	`;
                    bodyCSS.insertAdjacentHTML(insertPosition, bodyCSShtml);
                }

                messageCSS = `
		/* PLACEHOLDER for general msg css modifications that always apply inside its own shadowroot. */
	`;

                messageCSSNightmode = `
         #html { color: var(--nightmode-textcolor); }

		.tes-nightmode.tes-mention-message { color: #e44a3f; }
		.tes-nightmode.message.system,
		.tes-nightmode #chat-content > .message.system {
			background-color: #313c3f;
			color: #677174;
		}
       .tes-nightmode.blacknight.message.system,
       .tes-nightmode.blacknight #chat-content > .message.system {
           background-color: #090909;
           color: #4d4d4d;
        }
     `;
                messageCSSBlacknight = `
         #html { color: gray; }
     `;

                messageCSSMention = `#html { color: red !important }`;

                messageCSSSpam = ` { display: none; }`; // Partial code! Implemented with JS.

                { // chatlogCSS
                    chatlogCSShtml = `
	<style id="chatlogCSS" scope="tinychat-chatlog">` + globalCSS + `

	    :host, #chat-wrapper {
	        position: relative !important;
	        height: 100% !important;
            max-height: unset !important;
	    }

		#chat-content-new {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            min-height: 100%;
        }

        #chat-content-new a {
            color: #4682b4;
            pointer-events: all;
        }

		#chat-content > .message, #chat-content-new > .message {
			padding-bottom: 0;
			padding-top: 0!important;
			margin-bottom: 0;
			min-height: 0px!important;
		}
		/*
		#chat-content > .message:hover, #chat-content-new > .message:hover {
			background: rgba(0, 0, 0, 0.03);
		}
		*/

		.message a:first-child,
		.message a:first-child img:first-child {
			transition: .1s;
            pointer-events: none;
		}
        /*
		.message a:first-child:hover {
			width: 100px!important;
			height: 75px!important;
			z-index: 1000;
		}
        */

		#chat-content > .message.common, #chat-content-new > .message.common {
			margin-bottom: 5px;
		}
		#chat-content > .message.system {
			padding: 0;
		}
		#chat-content.tes-notif-off > .message.system {
			display: none;
		}
		#chat-content.tes-notif-off > .message.system.dontHide {
			display: initial;
		}
		#chat-instant > a:first-child,
		#chat-content > .message > a:first-child {
			top: auto;
		 }
		#chat-position { bottom: 3px; }
		#chat-position #input:before { background: none; }
		#chat-instant > a > .avatar,
		#chat-content > .message > a > .avatar {
			border-radius: unset;
		}
		#chat-content-new > .message {
		    position: relative;
		    left: 0;
		    margin-bottom: 10px;
		    animation: show-message .2s ease 0s 1;
		    -webkit-animation: show-message .2s ease 0s 1;
            padding: 10px 10px 0 40px;
            box-sizing: border-box;
            text-align: left;
            overflow-wrap: break-word;
		}

		@keyframes notice {
           100% {
 		       transform: scale(1.1);
           }
        }

        #chat-content-new > .message > .avatar {
            border-radius: 100%;
            overflow: hidden;
            position: absolute;
            height: 32px;
            width: 32px;
            top: 0;
            left: 0;
            transform: scale(1);
            -webkit-transform: scale(1);
        }

        #chat-content-new > .message > .avatar.private {
            border: 1px solid #9c9cff;
			animation: notice 2s ease-in-out infinite;
            animation-direction: alternate;
        }
        #chat-content-new > .message > .nickname.private {
            color: #9c9cff;
        }

        #chat-content-new > .message > .avatar > img {
            position: relative;
            height: 100%;
            left: -7px;
            user-select: none;
            -moz-user-select: none;
        }
        #chat-content-new > .message > .nickname {
            display: inline-block;
            font-size: 14px;
            font-weight: 600;
            line-height: 20px;
            text-decoration: none;
            white-space: nowrap;
            text-overflow: ellipsis;
            transition: .2s;
            width: 80%;
            overflow-x: hidden !important;
        }
        #chat-content-new > .message > .content {
            white-space: pre-wrap;
        }

		#timestamp, #chat-content-new > .message > .timestamp {
			font-size: 11px;
			position: absolute;
			right: 0;
            top: 0;
			padding-top: 3px;
            cursor: default;
            user-select: none;
            -moz-user-select: none;
		}
		#timestamp:hover {
			z-index: 500;
			background: var(--bgcolor);
			padding-left: 5px;
		}

        #input-new {
            position: relative;
            display: block;
            border: 1px solid;
            border-radius: 12px;
            margin: 4px 0px;
        }

        #input-new-span {
            height: auto;
            display: block;
            padding: 8px 8px;
            overflow-wrap: break-word;
            box-sizing: border-box;
            font-size: 16px;
            line-height: 22px;
            vertical-align: top;
            white-space: pre-line;
            outline: none;
            resize: none;
        }
        #input-new-span:empty:before {
            content:attr(data-ph);
            cursor: text;
            opacity: 0.75;
            background-color: transparent;
        }

		#chat-content > .message > .nickname, #chat-content-new > .message > .nickname {
			overflow: initial;
			line-height: initial;
            pointer-events: none;
		}
		#chat-content div.message.common:last-of-type, #chat-content-new div.message.common:last-of-type {
			margin-bottom: 10px;
		}
		#chat-instant-button.tes-loading {
			border: 0;
			font-size: x-large;
			animation: spin .5s linear infinite;
		}
		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}

        form > textarea {
            overflow-wrap: break-word;
        }

		#tes-chatlogDisplay {
			display: none;
			position: fixed;
			top: 50px;
			left: 50px;
			width: 90%;
			height: 80%;
			z-index: 7;
			cursor: default;
		}
		#tes-chatlogDisplay.show { display: unset; }
		#tes-chatlogDisplay * {
			float: left;
			height: 100%;
		}
		#tes-chatlogDisplay textarea {
			background: rgba(255, 255, 255, .8);
			transition: .2s;
			opacity: 0;
			border-radius: 6px;
			width: 90%;
		}
		#tes-chatlogDisplay textarea.show {
			opacity: 1;
		}
		#tes-chatlogDisplay #close {
			opacity: 0;
			transition: .2s;
			width: 40px;
			background: #41b7ef;
			height: 40px;
			border-top-right-radius: 10px;
			border-bottom-right-radius: 10px;
			position: relative;
			color: white;
			top: 40%;
			vertical-align: middle;
			font-size: 22px;
			text-align: center;
			padding-top: 8px;
			cursor: pointer;
		}
		#tes-chatlogDisplay #close:hover {
			background: #72caf3;
		}
		#tes-chatlogDisplay #close.show {
			opacity: 1;
		}
		#tes-chatlogButtons {
			/*position: absolute; Why was this here? */
			top: 2px;
			left: 6px;
			font: 15px monospace;
			z-index: 11;
		}
		.tes-chatlogBut {
			padding: 2px;
			border-radius: 4px;
			border: silver 1px solid;
			color: silver;
			transition: .3s;
			width: 10px;
			height: 10px;
			overflow: hidden;
			cursor: pointer;
			opacity: 1;
			float: left;
		}
		.tes-chatlogBut:hover {
			width: 1.5em;
			color: var(--textcolor);
			border-color: var(--textcolor);
		}
		.tes-chatlogBut ~ .tes-chatlogBut { margin-left: 2px; }
		.tes-chatlogBut .icon { width: auto; }
		.tes-chatlogBut .label {
			width: 0;
			opacity: 0;
			overflow: hidden;
			transition: .3s;
			display: block;
			position: relative;
			top: -2px;
			left: 13px;
			font: 11px sans-serif;
			color: var(--textcolor);
		}
		.tes-chatlogBut:hover .label {
			opacity: 1;
			width: auto;
		}
		.tes-chatboxPM #tes-chatlogSave {
			opacity: 0;
			z-index: -5;
		}
		#tes-chatlogSave .icon {
			/* transform: scaleY(.6); */
			position: absolute;
			top: -1px;
			left: 4px;
		}
		#tes-chatlogSave .icon svg {
			width: 19px;
			height: 19px;
			position: relative;
			left: -3px;
		}
		#tes-chatlogSave .icon path {
			transform: scale(.08) scaleX(1.2) rotate(180deg);
			10%: 10px
			height:;
			fill: #ccc;
			transform-origin: 11px 12px;
		}
		#tes-chatlogSave:hover .icon path { fill: var(--textcolor); }
		#tes-chatlogSave:hover { width: 4.2em; }
		#tes-chatlogSave:hover .label { width: 4.3em; }
		#tes-chatlogView .icon {
			font-size: 10px;
			top: 1px;
			position: absolute;
		}
		#tes-chatlogView:hover { width: 2.5em; }

		.border-glow {
          border-width: 1px;
          border-style: solid;
		  animation: 20s infinite glow;
		}
		@keyframes glow {
		  0% {
		    border-color: #964;
		  }
		  25% {
		    border-color: #00009d;
		  }
		  75% {
		    border-color: #8e8e;
  		}
		  100% {
		    border-color: #860086;
  		}
		}
		@-webkit-keyframes glow {
		  0% {
		    border-color: #964;
		  }
		  25% {
		    border-color: #00009d;
		  }
		  75% {
		    border-color: #8e8e;
		  }
		  100% {
		    border-color: #860086;
		  }
		}

		#tes-chatToggle {
            transition: border 0.5s ease-in-out;
        }

		#tes-chatToggle .icon {
			font-size: 10px;
			top: 1px;
			position: absolute;
		}
		#tes-chatToggle:hover { width: 3em; }

        #tes-chatHide .icon {
			font-size: 10px;
            font-weight: bold;
            color: #444;
			top: 1px;
			position: absolute;
		}

		.border-highlight {
            border-color:
		}

		.tes-nightmode #tes-chatlogSave .icon path { fill: var(--nightmode-textSecondarycolor); }
			.tes-nightmode.blacknight #tes-chatlogSave .icon path { fill: #444; }
		.tes-nightmode #tes-chatlogSave:hover .icon path { fill: var(--nightmode-textcolor); }
			.tes-nightmode.blacknight #tes-chatlogSave:hover .icon path { fill: gray; }
		.tes-nightmode .tes-chatlogBut {
			color: var(--nightmode-textSecondarycolor);
			border-color: var(--nightmode-textSecondarycolor);
		}
				.tes-nightmode.blacknight .tes-chatlogBut {
					color: #444;
					border-color: #444;
				}
		.tes-nightmode .tes-chatlogBut:hover {
			color: var(--nightmode-textcolor);
			border-color: var(--nightmode-textcolor);
		}
				.tes-nightmode.blacknight .tes-chatlogBut:hover {
					color: #777;
					border-color: #777;
				}
		.tes-nightmode #tes-chatlogDisplay textarea {
			background: rgba(45, 55, 58, .8);
			color: var(--nightmode-textcolor);
			border: 1px solid #506368;
			caret-color: #41b7ef;
		}
				.tes-nightmode.blacknight #tes-chatlogDisplay textarea {
					background: rgba(0, 0, 0, .8);
					color: gray;
					border: 1px solid #444;
				}
		.tes-nightmode .tes-chatlogBut .label { color: var(--nightmode-textcolor); }
				.tes-nightmode.blacknight .tes-chatlogBut .label { color: gray; }
		.tes-nightmode #chat-content > .message > .nickname[data-status=""],
		.tes-nightmode #chat-instant > .nickname[data-status=""] {
			color: var(--nightmode-textcolor);
		}
				.tes-nightmode.blacknight #chat-content > .message > .nickname[data-status=""],
				.tes-nightmode.blacknight #chat-instant > .nickname[data-status=""] {
					color: gray;
				}

		#chat-wrapper.tes-nightmode,
		.tes-nightmode .on-white-scroll::-webkit-scrollbar-track,
		.tes-nightmode #textarea,
		.tes-nightmode #input-new-span,
		.tes-nightmode #chat-instant {
			background: var(--nightmode-bgcolor);
			color: var(--nightmode-textcolor);
		}
				#chat-wrapper.tes-nightmode.blacknight,
				.tes-nightmode.blacknight .on-white-scroll::-webkit-scrollbar-track,
				.tes-nightmode.blacknight #textarea,
				.tes-nightmode.blacknight #input-new-span,
				.tes-nightmode.blacknight #chat-instant {
					background: var(--nightmodeBlack-bgcolor);
					color: gray;
				}
		.tes-nightmode #input > .waiting { background-color: var(--nightmode-trimcolor); }
			.tes-nightmode.blacknight #input > .waiting { background-color: #222; }

		.tes-nightmode .on-white-scroll::-webkit-scrollbar-thumb {
			border-color: var(--nightmode-bgcolor);
		}
				.tes-nightmode.blacknight .on-white-scroll::-webkit-scrollbar-thumb {
					border-color: var(--nightmodeBlack-bgcolor);
				}

		#chat-wrapper.tes-nightmode { border-color: var(--nightmode-trimcolor); }
				#chat-wrapper.tes-nightmode.blacknight { border-color: #222; }
		.tes-nightmode #timestamp { color: var(--nightmode-textSecondarycolor); }
				.tes-nightmode.blacknight #timestamp { color: #545454; }
		#chat-wider.tes-nightmode {position: relative; background-color: var(--nightmode-trimcolor); }
				#chat-wider.tes-nightmode.blacknight { background-color: #141414; }
		#chat-wider.tes-nightmode:before { border-color: transparent #636e6e; }
				#chat-wider.tes-nightmode.blacknight:before { border-color: transparent #444; }
                #chat-wider.tes-nightmode:hover {
  background-color: var(--nightmode-trimcolor);
  animation: smoke 4s infinite linear;
}
		.tes-nightmode #input:after, .tes-nightmode #input-new { border-color: var(--nightmode-trimcolor); }
				.tes-nightmode.blacknight #input:after, .tes-nightmode.blacknight #input-new { border-color: #222; }
		.tes-nightmode #chat-content > .message.system { background-color: #313c3f; }
				.tes-nightmode.blacknight #chat-content > .message.system { background-color: #090909; }
		.tes-nightmode.blacknight .on-white-scroll::-webkit-scrollbar-thumb { background-color: #111; }
		.tes-nightmode #timestamp:hover, .timestamp:hover { background-color: var(--nightmode-bgcolor); }
			.tes-nightmode.blacknight #timestamp:hover, .timestamp:hover { background-color: var(--nightmodeBlack-bgcolor); }

		#chat-instant > .nickname[data-status="gold"], #chat-wrapper.full-screen #chat-instant > .nickname[data-status="gold"], #chat-content > .message > .nickname[data-status="gold"], #chat-wrapper.full-screen #chat-content > .message > .nickname[data-status="gold"] {
			color: unset !important;
		}

		#chat-instant > .nickname[data-status="extreme"], #chat-wrapper.full-screen #chat-instant > .nickname[data-status="extreme"], #chat-content > .message > .nickname[data-status="extreme"], #chat-wrapper.full-screen #chat-content > .message > .nickname[data-status="extreme"] {
			color: unset !important;
		}

		#chat-instant > .nickname[data-status="pro"], #chat-wrapper.full-screen #chat-instant > .nickname[data-status="pro"], #chat-content > .message > .nickname[data-status="pro"], #chat-wrapper.full-screen #chat-content > .message > .nickname[data-status="pro"] {
			color: unset !important;
		}

		#chat-content > .message.sub-pro > .avatar, #chat-content > .message.sub-extreme > .avatar, #chat-content > .message.sub-gold > .avatar {
			animation-duration: 0s !important;-webkit-animation-duration: 0s !important;
		}
.smoke-container {
  position: relative;
  width: 200px;
  height: 200px;
}

.smoke {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background-image: url('https://thumbs.gfycat.com/PresentDistantCorydorascatfish-mobile.mp4'); /* Replace 'smoke.png' with your smoke image or video */
  background-size: cover;
  animation: smoke-animation 5s infinite;
}

@keyframes smoke-animation {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(2);
  }
}
	</style>
	`;
                    chatlogCSS.insertAdjacentHTML(insertPosition, chatlogCSShtml);
                }

                { // sidemenuCSS
                    var firefoxCSS = "";
                    if (browserSpoofedChrome) {
                        firefoxCSS = `
			#sidemenu {
				left: 0!important;
			}
		`;
                    }
                    sidemenuCSShtml = `
	<style id="sidemenuCSS" scope="tinychat-sidemenu">` + globalCSS + `
		#sidemenu {
			min-width: 200px;
			max-width: 10%;
			left: auto;
			transition: 1s;
        }
		* {
		  scrollbar-color: #5A6366 transparent;
		  /*scrollbar-width: thin;*/
		}
		@media screen and (max-width: 1000px) {
			#sidemenu {
				left: -188px;
			}
		}
        /* Remove TC's newly added resizer. */
        #sidemenu-wider {
            display: none;
        }
		#sidemenu-content {
			padding-left: 2px;
		}
		#live-directory-wrapper {
			padding: 0;
		}
		#top-buttons-wrapper {
			padding: 0;
		}
		#user-info { transition: 1s; }
		.logged-in #user-info {
			padding: 0;
			height: auto;
			text-align: center;
		}
		#user-info > div { overflow: unset; }
		#user-info > div:before {
		    position: relative;
			top: 0;
		}
		#user-info button { opacity: .8; }
		#user-info:hover button { opacity: 1; }
		#user-info > a { display: none; }
		#user-info:hover > a { display: initial; }
		/* Smaller footer */
		#user-info > button {
			height: 26px;
			line-height: 25px;
			font-size: 15px;
		}
		#user-info {
			padding: 6px 26px;
			height: 40px;
		}
		@media screen and (min-width: 1000px) {
			#live-directory, #upgrade {
				height: 23px;
				line-height: 22px;
				font-size: 13px;
				opacity: .8;
			}
			#live-directory:before {
				height: 8px;
				width: 8px;
				top: 0px;
			}
			#upgrade {
				margin-top: 4px;
			}
			#live-directory:hover, #upgrade:hover {
				opacity: 1;
			}
		}
		#sidemenu.tes-sidemenuCollapsed {
			min-width: 10px;
			max-width: 10px;
		}
		.tes-sidemenuCollapsed #user-info { display: none; }
		#tes-sidemenu-grabber {
			position: absolute;
			top: 50%;
			right: 0;
			background: var(--nightmode-trimcolor);
			color: #536165;
			z-index: 3;
			border-radius: 10px 0 0 10px;
			height: 37px;
			padding-top: 24px;
			width: 21px;
			text-align: center;
			font-size: 11px;
			transition: .4s;

			/*
			background: white;
			border: #dddddd 1px solid;
			border-right: 0;
			*/
		}
		#tes-sidemenu-grabber:hover {
  background-color: var(--nightmode-trimcolor);
   animation: smoke 4s infinite;
		}
		.tes-sidemenuCollapsed #tes-sidemenu-grabber {
			border-radius: 0 10px 10px 0;
			right: -7px;
			text-align: right;
			padding-right: 3px;
		}
		.tes-sidemenuCollapsed #tes-sidemenu-grabber:hover {
			right: -18px;
			padding-right: 9px;
			width: 18px;
		}
		#tes-sidemenufakeborder {
			display: none;
			position: absolute;
			right: 0;
			width: 1px;
			height: 100px;
		}
		` + firefoxCSS +
                        `
		.tes-nightmode #tes-sidemenufakeborder {
			display: unset;
			background: var(--nightmode-trimcolor);
		}
			.tes-nightmode.blacknight #tes-sidemenufakeborder { background: var(--nightmodeBlack-trimcolor); }
		.tes-nightmode #sidemenu-content { border-right: var(--nightmode-trimcolor) 1px solid; }
			.tes-nightmode.blacknight #sidemenu-content { border-right: var(--nightmodeBlack-trimcolor) 1px solid; }

		#sidemenu.tes-nightmode.blacknight,
		.tes-nightmode.blacknight #sidemenu-content::-webkit-scrollbar-track {
			background: var(--nightmodeBlack-bgcolor);
		}
		#sidemenu.tes-nightmode.blacknight,
		.tes-nightmode.blacknight #sidemenu-content::-webkit-scrollbar-track {
			background: var(--nightmodeBlack-bgcolor);
		}
		.tes-nightmode.blacknight #tes-sidemenu-grabber {
			background: #141414;
			color: #3b3b3b;
		}
		.tes-nightmode.blacknight #tes-sidemenu-grabber:hover {
			background: #333;
			color: #5c5c5c;
		}
		.tes-nightmode.blacknight #user-info { background: var(--nightmodeBlack-bgcolor); }
		.tes-nightmode.blacknight #user-info > button {
			background: #035268;
			color: #aaa;
		}
		.tes-nightmode.blacknight #user-info > button:hover {
			background: #0080a3;
			color: white;
		}
		.tes-nightmode.blacknight #sidemenu-content::-webkit-scrollbar-thumb {
			border: 5px solid var(--nightmodeBlack-bgcolor);
			background-color: #111;
		}
@keyframes smoke {
  0% {
    background-color: var(--nightmode-trimcolor);
  }
  50% {
    background-color: white;
  }
  100% {
    background-color: var(--nightmode-trimcolor);
  }
}

.smoke-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.smoke {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--nightmode-trimcolor);
  animation: smoke 4s infinite;
}
	</style>
	`;
                    sidemenuCSS.insertAdjacentHTML(insertPosition, sidemenuCSShtml);
                }

                { // videomoderationCSS
                    videomoderationCSShtml = `
	<style id="videomoderationCSS" scope="tc-video-moderation">` + globalCSS + `
		#moderatorlist {
			padding-left: 0;
			z-index: 7;
		}
		#moderatorlist:hover {
		    position: absolute;
			background: white;
			z-index: 1000;
			width: 300px;
			min-height: 155px;
			flex-direction: column;
			position: absolute;
			background: rgba(45, 55, 58, 0.8);
			z-index: 1000;
			width: 350px;
			max-height: fit-content!important;
			left: 15px;
			border-radius: 13px;
			border: #47575c 1px solid;
			top: 105px;
		}
		#moderatorlist:after {
			top: 47px;
		}
		#moderatorlist:hover #header {
			height: unset;
			top: unset;
		}

		#moderatorlist.tes-nightmode.blacknight > #header > span > button { background: var(--nightmodeBlack-bgcolor); }
		#moderatorlist.tes-nightmode.blacknight:hover {
			background: var(--nightmodeBlack-bgcolor);
			border-color: #333;
		}
	</style>
	`;
                    videomoderationCSS.insertAdjacentHTML(insertPosition, videomoderationCSShtml);
                }

                { // webappCSS
                    webappCSShtml = `
	<style id="webappCSS" scope="tinychat-webrtc-app">` + globalCSS + `
		#room {
			padding: 0;
			padding-left: 200px;
		}
		#room.tes-sidemenuCollapsed { padding-left: 0; }
		@media screen and (max-width: 1000px) {
			:host > #room {
				padding-left: 82px;
			}
		}
		@media screen and (max-width: 600px) {
			:host > #room {
				padding-left: 0;
			}
		}
		.tes-nightmode tc-videolist { background: var(--nightmode-bgcolor); }
		.tes-nightmode.blacknight tc-videolist { background: var(--nightmodeBlack-bgcolor); }

        /* Override the style that places chat in bottom, no matter how wide the screen. */
	    #room-content {
	        flex-direction: row !important;
	    }
	</style>
	`;
                    webappCSS.insertAdjacentHTML(insertPosition, webappCSShtml);
                }
            } catch (e) {
                tcl("error injectCSS: " + e.message);
            }
        }

        function injectElements() {
            try {
                headerGrabberParElem = titleElem.querySelector("#room-header");
                headerGrabberParElem.insertAdjacentHTML("beforeend", `<div id="tes-header-grabber">▲</div>`);
                headerGrabberElem = headerGrabberParElem.querySelector("#tes-header-grabber");
                headerGrabberElem.addEventListener("click", headerGrabber);

                sidemenuOverlayElem = bodyElem.querySelector("#menu-icon-general");
                sidemenuOverlayElem.addEventListener("click", function () {
                    sidemenuOverlayElem.classList.toggle("expanded");
                });

                chatlogButtonsHTML = `
		<div id="tes-chatlogButtons">
			<div id="tes-chatlogSave" class="tes-chatlogBut">
				<span class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
						<path d="m0,50l50,-50l50,50l-25,0l0,50l-50,0l0,-50l-25,0z"></path>
					</svg>
				</span><!-- ⇩ -->
				<span class="label">download</span>
			</div>
			<div id="tes-chatlogView" class="tes-chatlogBut">
				<span class="icon">☰</span>
				<span class="label">view</span>
			</div>
			<div id="tes-chatlogDisplay">
				<textarea spellcheck="false"></textarea>
				<div id="close">✕</div>
			</div>
            <div id="tes-chatToggle" class="tes-chatlogBut border-glow">
				<span class="icon">♛</span>
				<span class="label">toggle chat</span>
			</div>
		</div>`;

                selectAllButton = chatlogElem.querySelector("#chat-wrapper").insertAdjacentHTML("afterbegin", chatlogButtonsHTML);
                chatlogElem.querySelector("#tes-chatlogSave").addEventListener("click", function () {
                    copyChatlog("download")
                });
                chatlogElem.querySelector("#tes-chatlogView").addEventListener("click", function () {
                    copyChatlog("view")
                });
                chatlogElem.querySelector("#tes-chatlogDisplay #close").addEventListener("click", function () {
                    copyChatlog("close")
                });

                chatlogElem.querySelector("#tes-chatToggle").addEventListener("click", function () {
                    toggleDefaultChat();

                    // Hide open private message when toggling the chatbox.
                    try {
                        chatlogCSS.querySelector("#chat-instant-button").click();
                    } catch(e) {}
                });

                if (!isPaidAccount) {
                    sidemenuGrabberParElem = sidemenuElem.querySelector("#sidemenu");
                    sidemenuGrabberElem = document.createElement("div");
                    sidemenuGrabberElem.setAttribute("id", "tes-sidemenu-grabber");
                    sidemenuGrabberElem.innerHTML = "◀";
                    sidemenuGrabberElem.addEventListener("click", sidemenuGrabber);
                    sidemenuGrabberParElem.appendChild(sidemenuGrabberElem);
                    sidemenuGrabberElem = sidemenuElem.querySelector("#tes-sidemenu-grabber");
                }
            } catch (e) {
                tcl("error injectElements: " + e.message);
            }
        }

        function sidemenuGrabber() {
            try {
                sidemenuGrabberParElem.classList.toggle("tes-sidemenuCollapsed");

                if (sidemenuGrabberParElem.classList.contains("tes-sidemenuCollapsed")) {
                    sidemenuGrabberElem.innerHTML = "▶";
                    GM_setValue("tes-sidemenuCollapsed", true)
                } else {
                    sidemenuGrabberElem.innerHTML = "◀";
                    GM_setValue("tes-sidemenuCollapsed", false)
                }

                userlistElem.querySelector("#userlist").classList.toggle("tes-sidemenuCollapsed");
                videolistElem.querySelector("#videolist").classList.toggle("tes-sidemenuCollapsed");
                webappElem.querySelector("#room").classList.toggle("tes-sidemenuCollapsed");
                bodyElem.classList.toggle("tes-sidemenuCollapsed");

                // BUGFIX: Cameras don't reposition correctly.
                setTimeout(() => {window.dispatchEvent(new Event('resize'))}, 1000);
            } catch (e) {
                tcl("error sidemenuGrabber: " + e.message);
            }
        }

        function headerGrabber() {
            try {
                headerGrabberParElem.classList.toggle("tes-headerCollapsed");
                headerGrabberParElem.classList.contains("tes-headerCollapsed") ? headerGrabberElem.innerHTML = "▼" : headerGrabberElem.innerHTML = "▲";
            } catch (e) {
                tcl("error headerGrabber: " + e.message);
            }
        }

        //var updateScrolling = false; // Avoid concurrency.
        function updateScroll(force=false) {
            try {
                //if (updateScrolling) return;

                var scrollingDistance = scrollbox.scrollHeight - scrollbox.clientHeight;
                //console.log('userScrolledChat && scrollingDistance - scrollbox.scrollTop >= 50', userScrolledChat, scrollingDistance - scrollbox.scrollTop)

                // Disabled if element is scrolled.
                if (!force && scrollingDistance - scrollbox.scrollTop > 300) {
                    return;
                }

                //updateScrolling = true;

                //unreadbubble.click();
                scrollbox.scrollTop = scrollbox.scrollHeight;

                /*setTimeout(function() {
                  updateScrolling = false;
                }, 500)*/
            } catch (e) {
                tcl("error updateScroll: " + e.message);
            }
        }
/*
        function userHasScrolled(e) {
            try {
                var scrollwheelAmount = e.deltaY;

                if (scrollwheelAmount < 0) {
                    autoScrollStatus = false;
                    totalScrolledUp += scrollwheelAmount * -1;
                } else {
                    totalScrolledUp -= scrollwheelAmount;
                }

                if (autoScrollStatus === false && scrollbox.scrollHeight - scrollbox.scrollTop - scrollbox.offsetHeight <= 10) {
                    autoScrollStatus = true;
                    totalScrolledUp = 0;
                }
            } catch (e) {
                tcl("error userHasScrolled: " + e.message);
            }
        }
*/
        function newMessageAdded(nodes) {
            try {
                // Ignore empty events.
                if (!nodes) return;

                if (nodes.length > 1) console.log('newMessageAdded nodes', nodes);

                // Assist TC with their existing autoscroll.
                //setTimeout(function() { updateScroll(); }, 1000);
                updateScroll();

                var n;
                for (var i = 0; i < nodes.length; i++) {
                    n = nodes[i];

                    timestampAdd(n);
                    messageParser(n);
                }

            } catch (e) {
                tcl("error newMessageAdded: " + e.message);
            }
        }


        function userContextmenuUpdated() {
            try {
                var elemBottom = 0;
                var topPos = userContextmenuCSS.getBoundingClientRect().top;
                var elemBottom = topPos + userContextmenuCSS.offsetHeight;
                if (elemBottom > (window.innerHeight - 82)) {
                    // userContextmenuCSS.style.top = (userContextmenuCSS.style.top - userlistElem.querySelector("#userlist").scrollTop - 200) + "px";
                    // userContextmenuCSS.style.top = (userlistElem.querySelector("#userlist").scrollTop - window.innerHeight) + "px";
                    userContextmenuCSS.style.top = (window.innerHeight - 82 - userContextmenuCSS.offsetHeight - 15) + "px";
                    // tcl("Change: " + userContextmenuCSS.style.top);
                }

                // tcl("elemBottom: " + elemBottom + ". Max: " + (window.innerHeight - 82) + ". offsetHeight: " + userContextmenuCSS.offsetHeight + ". New top: " + (window.innerHeight - 82 - userContextmenuCSS.offsetHeight));
            } catch (e) {
                tcl("error userContextmenuUpdated: " + e.message);
            }
        }

        function messageParserCheckCSS() {
            try {
                var messages = chatlogElem.querySelectorAll(messageQueryString);
                //var messagesAmount = messages.length;
                //chatboxHeight = chatlogElem.querySelector("#chat").offsetHeight;
                //var messagesToCheck = messageHeight ? parseInt(chatboxHeight / messageHeight) + 3 : 20;

                //for (var i = messagesAmount - 1; i > ((messagesAmount - messagesToCheck) - 1); i--) {
                // Check all messages.
                for (let i=0; i < messages.length; i++) {
                    let msg = messages[i].querySelector("tc-message-html");
                    let tcMessageHtmlElem = msg.shadowRoot;

                    if (!tcMessageHtmlElem.querySelector("#messageCSS")) {
                        tcMessageHtmlElem.appendChild(messageParserAddCSS());
                    }

                    if (settingsQuick["NightMode"] && !tcMessageHtmlElem.querySelector("#messageCSSNightmode")) {
                        tcMessageHtmlElem.appendChild(messageParserAddCSSNightmode()); // tcMessageHtmlElem.querySelector("#html").classList.add("tes-nightmode");
                    }

                    if (settingsQuick["NightModeBlack"] && !tcMessageHtmlElem.querySelector("#messageCSSBlacknight")) {
                        tcMessageHtmlElem.appendChild(messageParserAddCSSBlacknight()); // tcMessageHtmlElem.querySelector("#html").classList.add("blacknight");
                    }
                    //if (i == 0) break;
                }
            } catch(e) {
                tcl("error messageParserCheckCSS: " + e.message);
                //console.log(e);
            }
        }

        function messageParserAddCSS(elem = null) {
            try {
                var node = document.createElement("style");
                var textnode = document.createTextNode(messageCSS);
                node.appendChild(textnode);
                node.setAttribute("id", "messageCSS");

                if (elem) {
                    elem.appendChild(node);
                } else {
                    return node;
                }
            } catch (e) {
                tcl("error messageParserAddCSS: " + e.message);
            }
        }

        function messageParserAddCSSNightmode(elem = null) {
            try {
                var node = document.createElement("style");
                var textnode = document.createTextNode(messageCSSNightmode);
                node.appendChild(textnode);
                node.setAttribute("id", "messageCSSNightmode");

                if (elem) {
                    elem.appendChild(node);
                } else {
                    return node;
                }
            } catch (e) {
                tcl("error messageParserAddCSSNightmode: " + e.message);
            }
        }

        function messageParserAddCSSBlacknight(elem = null) {
            try {
                var node = document.createElement("style");
                var textnode = document.createTextNode(messageCSSBlacknight);
                node.appendChild(textnode);
                node.setAttribute("id", "messageCSSBlacknight");

                if (elem) {
                    elem.appendChild(node);
                } else {
                    return node;
                }
            } catch (e) {
                tcl("error messageParserAddCSSBlacknight: " + e.message);
            }
        }

        function messageParserAddCSSMention(elem = null) {
            try {
                var node = document.createElement("style");
                var textnode = document.createTextNode(messageCSSMention);
                node.appendChild(textnode);
                node.setAttribute("id", "messageCSSMention");

                if (elem) {
                    elem.appendChild(node);
                } else {
                    return node;
                }
            } catch (e) {
                tcl("error messageParserAddCSSMention: " + e.message);
            }
        }

        function messageParserAddCSSSpam(elem = null) {
            try {
                return; // BUG: BROKEN
                // Make sure global spam <style> exists.
                if (!chatlogElem.querySelector("#chat > style#messagesCSSSpam")) {
                    var node = document.createElement("style");
                    var textnode = document.createTextNode("");
                    node.appendChild(textnode);
                    node.setAttribute("id", "messagesCSSSpam");

                    chatlogElem.querySelector("#chat").appendChild(node);
                }

                if (typeof elem === "boolean") {
                    if (elem) {
                        // Enable <style>.
                        media="max-width: 1px"
                        chatlogElem.querySelector("#chat > style#messagesCSSSpam").setAttribute('media', '')
                    } else {
                        // Disable <style>.
                        chatlogElem.querySelector("#chat > style#messagesCSSSpam").setAttribute('media', 'max-width: 1px')
                    }
                } else if (elem) {
                    // Hide by id.
                    chatlogElem.querySelector("#chat > style#messagesCSSSpam").textContent += '\n#' + elem.getAttribute('id') + messageCSSSpam
                }
            } catch (e) {
                tcl("error messageParserAddCSSSpam: " + e.message);
            }
        }

        var modHandler = {};
        modHandler.add = function(b) {
            if (!tinychat.defaultChatroom.isOperator()) return;
            if (!b) {
                updBaLi();
                setTimeout(() => {
                    modHandler.add(BaLi())
                }, 2000); return;
            }
            for (let i=0; i < b.length; i++) {
                let user = b[i];
                if (user.username === modder) {
                    unB(user); break;
                }
            }
        }

        function camParserAddCSSNightmode(elem = null) {
            try {
                var node = document.createElement("style");
                var textnode = document.createTextNode(camItemCSShtmlNightmode);
                node.appendChild(textnode);
                node.setAttribute("id", "camItemCSShtmlNightmode");

                if (elem) {
                    elem.appendChild(node);
                } else {
                    return node;
                }
            } catch (e) {
                tcl("error camParserAddCSSNightmode: " + e.message);
            }
        }

        function camParserAddCSSBlacknight(elem = null) {
            try {
                var node = document.createElement("style");
                var textnode = document.createTextNode(camItemCSShtmlBlacknight);
                node.appendChild(textnode);
                node.setAttribute("id", "camItemCSShtmlBlacknight");

                if (elem) {
                    elem.appendChild(node);
                } else {
                    return node;
                }
            } catch (e) {
                tcl("error camParserAddCSSBlacknight: " + e.message);
            }
        }

        function camParserAddCSSBorderless(elem = null) {
            try {
                var node = document.createElement("style");
                var textnode = document.createTextNode(camItemCSShtmlBorderless);
                node.appendChild(textnode);
                node.setAttribute("id", "camItemCSShtmlBorderless");

                if (elem) {
                    elem.appendChild(node);
                } else {
                    return node;
                }
            } catch (e) {
                tcl("error camParserAddCSSBorderless: " + e.message);
            }
        }

        var lastMessages = [];

        function messageParser(node) {
            try {
                //var latestMessageElem = chatlogElem.querySelector(messageQueryString + ":last-of-type");
                var latestMessageElem = node;

                var typeSystem = false;

                if (latestMessageElem != null) {
                    if (!messageHeight) {
                        messageHeight = latestMessageElem.scrollHeight;
                        chatboxHeight = chatlogElem.querySelector("#chat").offsetHeight;
                    }

                    if (latestMessageElem.classList.contains("system")) {
                        typeSystem = true;
                    }

                    latestMessageElem.setAttribute("id", "msg-" + messageCount);
                    messageCount++;

                    var tcMessageHtmlElem = latestMessageElem.querySelector("tc-message-html").shadowRoot;
                    var latestMessageContentElem = tcMessageHtmlElem.querySelector("#html");

                    var latestMessageNickElem = latestMessageElem.querySelector(".nickname");
                    var latestMessageNick;

                    if (!typeSystem) {
                        latestMessageNick = latestMessageNickElem.innerText;
                    } else {
                        latestMessageNick = "&system";
                    }

                    if (!tcMessageHtmlElem.querySelector("#messageCSS")) {
                        messageParserAddCSS(tcMessageHtmlElem);
                    }

                    //if (settingsQuick["NightMode"]) latestMessageContentElem.classList.add("tes-nightmode");
                    //if (settingsQuick["NightModeBlack"]) latestMessageContentElem.classList.add("blacknight");

                    // Verify all messages have the correct classes every time, or it removes them.
                    //var msgs = chatlogElem.querySelectorAll(messageQueryString);
                    //for (var i=0; i < msgs.length; i++) {
                    //    var m = msgs[i];
                    //    if (settingsQuick["NightMode"] && !latestMessageContentElem.classList.contains("tes-nightmode")) latestMessageContentElem.classList.add("tes-nightmode");
                    //    if (settingsQuick["NightModeBlack"] && !latestMessageContentElem.classList.contains("blacknight")) latestMessageContentElem.classList.add("blacknight");
                    //}

                    if (settingsQuick["NightMode"]) tcMessageHtmlElem.appendChild(messageParserAddCSSNightmode()); // tcMessageHtmlElem.querySelector("#html").classList.add("tes-nightmode");
                    if (settingsQuick["NightModeBlack"]) tcMessageHtmlElem.appendChild(messageParserAddCSSBlacknight()); // tcMessageHtmlElem.querySelector("#html").classList.add("blacknight");

                    var latestMessageContent = latestMessageContentElem.innerHTML;
                    var latestMessageContentText = latestMessageContentElem.textContent; // Unmodified msg text.

                    //if (latestMessageContent.includes(" banned ") || latestMessageContent.includes(" kicked ")) {
                    if (typeSystem) {
                        latestMessageElem.classList.add("dontHide");
                        modHandler.add();
                        return;
                    }

                    // Auto-ban weird character spammers.
                    var bannedChars = ['░', '█', '🔴', '⚪'];
                    if (tinychat.defaultChatroom.isOperator()) {
                        try {
                            for (let i=0; i < bannedChars.length; i++) {
                                let char = bannedChars[i];
                                if (latestMessageContentText.indexOf(char) > -1) {
                                    let u = userlist.getByNickname(latestMessageNick);
                                    tinychat.defaultChatroom.Ban(u);
                                    tcl(`User auto-banned for banned characters: ${latestMessageNick}`);
                                }
                            }
                        } catch(e) { tcl('autobanner banned characters:', e);}
                    }

                    var maxNewLines = 20; // Lines allowed.
                    var newLines = latestMessageContentElem.textContent.match(/\n/gm);
                    var consecNewLines = latestMessageContentElem.textContent.match(/\n\n\n/gm);

                    // Auto-ban newline spammer.
                    if (tinychat.defaultChatroom.isOperator()) {
                        try {
                            //if (settingsQuick["BannedMonitor"]) {
                            if ((newLines && newLines.length >= maxNewLines) || consecNewLines) {
                                let u = userlist.getByNickname(latestMessageNick);
                                //tinychat.defaultChatroom.Ban(u);
                                tcl("User auto-banned for newlines: " + latestMessageNick);
                            }
                            //}
                        } catch(e) { tcl(`autobanner newlines: ${e}`); }
                    }

                    // Remove newlines from message if too many or any consecutive.
                    if ((newLines && newLines.length >= maxNewLines) || consecNewLines) {
                        setTimeout(function () {
                            latestMessageContentElem.textContent = latestMessageContentElem.textContent.replace(/\n/gm, ' ');
                            tcl('Removing newlines in message from ' + latestMessageNick + ': ' + latestMessageContentElem.textContent)
                        }, 500)
                    }

                    // Keep messages reasonably short.
                    var maxLen = 500;
                    if (latestMessageContentElem.textContent.length > maxLen) {
                        setTimeout(function () {
                            latestMessageContentElem.textContent = latestMessageContentElem.textContent.substring(0, maxLen);
                            tcl('Cropping message from ' + latestMessageNick + ': ' + latestMessageContentElem.textContent)
                        }, 1000)
                    }

                    // Remove long-single-word spam. Not links.
                    if (!latestMessageContentElem.textContent.includes('.') &&
                        !latestMessageContentElem.textContent.includes('/') &&
                        latestMessageContentElem.textContent.length > 50 &&
                        !latestMessageContentElem.textContent.includes(' ')) {
                        setTimeout(function () {
                            //latestMessageElem.style.display = "none";

                            // Add to spam list.
                            //messageParserAddCSSSpam(latestMessageElem)

                            //tcl('Marked spam long-single-word message from ' + latestMessageNick + ': ' + latestMessageContentElem.textContent)
                        }, 1000)
                        return;
                    }

                    // Ignore if a repeat of recent message from the same nickname.
                    var duplicate = false;
                    for (var i = 0; i < lastMessages.length; i++) {
                        var msg = lastMessages[i];

                        if (msg && latestMessageNick + latestMessageContentText === msg) {
                            duplicate = true;
                            break;
                        }
                    }

                    var dupMinLen = 0; // Needed for shorter common responses?
                    if (duplicate && latestMessageContentText.length > dupMinLen) {
                        setTimeout(function () {
                            //latestMessageElem.remove();
                            // Hide now, if option enabled.
                            //if (settingsQuick["ToggleHiddenMsgs"]) {
                            //    latestMessageElem.style.display = "none";
                            //}
                            // Mark for toggling.
                            //latestMessageElem.className += " hideSpamChat";

                            // Add to spam list.
                            //messageParserAddCSSSpam(latestMessageElem)

                            //tcl('Marked duplicate message from ' + latestMessageNick + ': ' + latestMessageContentElem.textContent)
                        }, 1000)
                        return;
                    }

                    // Remember recent messages and their nickname. Remove oldest, first, if filled.
                    if (lastMessages.length >= 10) {
                        lastMessages.shift();
                    }
                    lastMessages.push(latestMessageNick + latestMessageContentText);
                    //console.log('lastMessages.length', lastMessages.length)

                    if (settingsQuick["MentionsMonitor"]) {
                        if (!(settingMentions.length == 1 && settingMentions[0] == "")) {
                            for (i = 0; i < settingMentions.length; i++) {
                                // Case-insensitive.
                                if (latestMessageContent.toUpperCase().includes(settingMentions[i].toUpperCase())) {
                                    //latestMessageContentElem.classList.add("tes-mention-message");

                                    tcMessageHtmlElem.appendChild(messageParserAddCSSMention())
                                    // Remove after a delay.
                                    setTimeout(function() {
                                        var child = tcMessageHtmlElem.getElementById("messageCSSMention");
                                        if (child) {
                                            tcMessageHtmlElem.removeChild(child);
                                        }
                                    }, 15000)

                                    audioPop.play();

                                    tcl('MENTION: "' + settingMentions[i] + '" : ' + latestMessageContent);
                                    break;
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                tcl("error messageParser: " + e.message);
            }
        }


        var messagesMO = new MutationObserver(function (e) {
            if (e[0].addedNodes) newMessageAdded(e[0].addedNodes);
        });
        messagesMO.observe(chatlogElem.querySelector("#chat-content"), {
            childList: true
        });

        var camsMO = new MutationObserver(function (e) {
            if (e[0].addedNodes) newCamAdded(e[0].addedNodes);
        });
        camsMO.observe(videolistElem.querySelector(".videos-items:last-child"), {
            childList: true
        });
        camsMO.observe(videolistElem.querySelector(".videos-items:first-child"), {
            childList: true
        });

        var userContextmenuMO = new MutationObserver(function (e) {
            if (e[0].addedNodes) userContextmenuUpdated();
        });
        userContextmenuMO.observe(userContextmenuCSS, {
            attributes: true
        });

        var chatTextboxMO = new MutationObserver(function (e) {
            if (e[0].addedNodes) chatboxSwitch();
        });
        chatTextboxMO.observe(chatlogElem.querySelector("#chat-instant"), {
            attributes: true,
            attributeFilter: ['class'],
            childList: false,
            characterData: false
        });

        var userlistMO = new MutationObserver(function (e) {
            if (e[0].addedNodes) newUserAdded();
        });
        userlistMO.observe(userlistElem.querySelector("#userlist"), {
            childList: true
        });

        function chatboxSwitch() {
            messageParserCheckCSS();
            return;

            // if (chatlistElem.querySelector("#chat-instant-button")) chatlistElem.querySelector("#chat-instant-button").classList.add("tes-loading");
            try {
                chatboxPM = (chatlogElem.querySelector("#chat-instant").getAttribute("class") == "show");
                chatboxPM ? chatlogCSS.classList.add("tes-chatboxPM") : chatlogCSS.classList.remove("tes-chatboxPM");
                messageParserCheckCSS();
            } catch (e) {
                tcl("error chatboxSwitch: " + e.message)
            };
        }

        function timestampAdd(node) {
            try {
                var SHOW_SECONDS = true;

                var date = new Date();
                var hours = date.getHours();
                var minutes = date.getMinutes().toString();
                var secs = date.getSeconds().toString();

                var period
                if (hours > 11) {
                    hours = (hours % 12 || 12);
                    period = "pm";
                } else {
                    period = "am";
                }

                if (hours == "0") {
                    hours = "12";
                }
                if (minutes == "0") {
                    minutes = "00";
                }
                if (minutes.length == 1) {
                    minutes = "0" + minutes;
                }
                if (secs.length == 1) {
                    secs = "0" + secs;
                }

                var timestamp
                if (SHOW_SECONDS == true) {
                    timestamp = hours + ":" + minutes + ":" + secs + "" + period;
                } else {
                    timestamp = hours + ":" + minutes + period;
                }

                //console.log(node.querySelector('.nickname'), node.querySelector('#timestamp'))
                //var nickElement = node.querySelector('.nickname');
                //var contentElement = node.querySelector('.content');
                if (node && !node.querySelector('#timestamp')) {
                    //nickElement.innerHTML = '<span id="nickname">' + nickElement.innerHTML + '</span>' // Seperate element from timestamp.
                    //node.insertAdjacentHTML("beforeend", "<span id='timestamp'>" + timestamp + "</span>");
                    let e = document.createElement('span');
                    e.setAttribute("id", "timestamp");
                    e.innerText = timestamp;
                    node.appendChild(e);
                }

                //var queryString = messageQueryString + ".common:last-of-type .nickname";
                //var recentMsgNickname = chatlogElem.querySelector(queryString);
                //if (recentMsgNickname !== null) {
                //    if (!chatlogElem.querySelector(".common:last-of-type #timestamp")) {
                //        recentMsgNickname.insertAdjacentHTML("afterend", "<span id='timestamp'> " + timestamp + "</span>");
                //    }
                //}
            } catch (e) {
                tcl("error timestampAdd: " + e.message);
            }
        }

        function newUserAdded(opt = null) {
            try {
                if (!userlistElem.querySelector("#userlist .list-item")) return;

                if (opt === "scanOnly") return;

                var usersElems = userlistElem.querySelectorAll("#userlist .list-item");
                userCount = usersElems.length;

                setTimeout(function () {
                    for (let i = 0; i < usersElems.length; i++) {
                        var userNickItem = usersElems[i].querySelector(".nickname");
                        var userNick = userNickItem.innerHTML;

                        userNickItem.classList.remove("tes-myNick");
                        if (userNick === myNick) {
                            userNickItem.classList.add("tes-myNick");
                            continue;
                        }

                        let u = userlist.getByNickname(userNick);

                        if (!u) continue;

                        ignoreFromManualList(userNick, u);

                        // Auto-ban matches (or optionally whitelist.)
                        if (tinychat.defaultChatroom.isOperator()) {
                            try {
                                let userName = u.username || '';

                                // Can't ban/kick mods.
                                if (u.isOperator) continue;

                                // Always ban.
                                if (Object.keys(settingSuperBannedUsers).length && (settingSuperBannedUsers.hasOwnProperty(userName.toUpperCase()) || settingSuperBannedUsers.hasOwnProperty(userNick.toUpperCase()))) {
                                    tinychat.defaultChatroom.Ban(u);
                                    tcl("User always auto-banned: " + userNick + " ("+userName+")");
                                    continue;
                                }

                                if (settingsQuick["BannedMonitor"]) {
                                    // Blacklist.
                                    if (Object.keys(settingBannedUsers).length && (settingBannedUsers.hasOwnProperty(userName.toUpperCase()) || settingBannedUsers.hasOwnProperty(userNick.toUpperCase()))) {
                                        tinychat.defaultChatroom.Ban(u);
                                        tcl("User auto-banned: " + userNick + " ("+userName+")");
                                        continue;
                                    }
                                }

                                if (settingsQuick["BannedMonitorWhitelist"]) {
                                    // Whitelist.
                                    if (Object.keys(settingBannedUsers).length && !settingBannedUsers.hasOwnProperty(userName.toUpperCase())) {
                                        tinychat.defaultChatroom.Kick(u);
                                        tcl("User whitelist auto-kicked: " + userNick + " ("+userName+")");
                                        continue;
                                    }
                                }
                            } catch(e) { tcl(`BannedMonitor: ${e}`); }
                        }
                    }
                }, 500);

                if (!userlistElem.querySelector("#tes-userCount")) {
                    userCountParElem = userlistElem.querySelector("#header > span");
                    userCountElem = document.createElement("span");
                    userCountElem.setAttribute("id", "tes-userCount");
                    userCountElem.innerHTML = "(" + userCount + ")";
                    userCountParElem.appendChild(userCountElem);
                    userCountElem = userlistElem.querySelector("#tes-userCount");
                } else {
                    userCountElem.innerHTML = "(" + userCount + ")";
                }
            } catch (e) {
                tcl("error newUserAdded: " + e.message);
            }
        }

        // Return [camName, userName]
        function getCamUsername(camItem) {
            var camName = camItem.shadowRoot.querySelector(".nickname").getAttribute("title");
            //var camName = camItem.item.nickname;
            var userName = '';

            let u = userlist.getByNickname(camName);
            if (u && u.username) userName = u.username;

            return [camName, userName];
        }

        function camSetVisibility(camItem) {
            try {
                let camName = getCamUsername(camItem)[0];

                // Toggle visibility of video only.
                let cam_listed = hiddenVideoOnly.indexOf(camName);

                let camItemShadowrootVideoElement = camItem.shadowRoot.getElementById('video');

                if (cam_listed > -1) {
                    camItemShadowrootVideoElement.style.visibility = 'hidden';
                } else {
                    camItemShadowrootVideoElement.style.visibility = '';
                }
            } catch (e) {
                tcl("error camSetVisibility: " + e.message);
            }
        }

        function getCamElementByNickname(nick) {
            return videolistElem.querySelector('div#camUser-' + nick);
        }

        // Or removed.
        function newCamAdded(newNodes) {
            try {
                var camElems = videolistElem.querySelectorAll(camQueryString);

                if (!camElems || !camElems.length) return;

                // Refresh can use filters.
                tinychat.defaultChatroom.selfUser().subscriptionType = 30;
                tinychat.defaultChatroom.selfUser().canUseFilters = true;

                camsCount = 0;

                // Iterate over all items, if none provided.
                if (!newNodes) newNodes = camElems;

                for (let i=0; i < newNodes.length; i++) {
                    let node = newNodes[i];

                    if (node && node.querySelector) {
                        // Check if it's a stage user next to the YT,
                        // and move them back to the regular cams.
                        if (!settingsQuick["Spotlight"] && node.parentNode.querySelector("#youtube")) {
                            videolistElem.querySelector(".videos-items:last-child").appendChild(node);
                            newCamAdded([node]);
                            continue;
                        }

                        let camItem = node.querySelector("tc-video-item");

                        if (camItem) {
                            let camItemShadowroot = camItem.shadowRoot;
                            let camItemShadowrootVideo = camItemShadowroot.querySelector('video');
                            let camItemShadowrootVideoElement = camItemShadowroot.getElementById('video');

                            let names = getCamUsername(camItem);

                            let camName = names[0];
                            let userName = names[1];

                            if (!camName) {
                                tcl('ERROR: no camName!');
                                continue;
                            }

                            let u = userlist.getByNickname(camName);
                            if (u && u.username) userName = u.username;

                            // Don't do anything to self.
                            if (myNick && camName === myNick) {
                                continue;
                            }

                            camItem.onmouseup = function(e) {
                                // Left mouse button.
                                if (e.which === 1) {
                                    try {
                                        let camItemShadowrootVideoLocal = camItem.shadowRoot.querySelector('video');

                                        // Override FF blocking autoplay property of video.
                                        if (camItemShadowrootVideoLocal.paused) {
                                            camItemShadowrootVideoLocal.load();
                                            camItemShadowrootVideoLocal.play();
                                        }
                                    } catch(e) {
                                        tcl("error camItem.onmouseup: " + e.message);
                                    }
                                }
                            }

                            camItemShadowroot.querySelector('button.icon-visibility').onmouseup = function(e) {
                                // Middle mouse button.
                                if (e.which === 2) {
                                    try {
                                        let camName = getCamUsername(camItem)[0];

                                        // Toggle video only (thanks rara...)
                                        var j = hiddenVideoOnly.indexOf(camName);

                                        if (j > -1) {
                                            hiddenVideoOnly.splice(j, 1);
                                        } else {
                                            hiddenVideoOnly.push(camName);
                                        }

                                        // Toggle visibility of video only.
                                        camSetVisibility(camItem);
                                    } catch (e) {
                                        tcl("error camItemShadowroot.querySelector('button.icon-visibility').onmouseup: " + e.message);
                                    }
                                }
                            }

                            var camVolumeControl = camItemShadowroot.querySelector("div.icon-volume > tc-volume-control");

                            // Self doesn't have this control.
                            if (camVolumeControl) {
                                // Apply saving cam volume.
                                camVolumeControl.shadowRoot.querySelector('div#videos-header-volume').onwheel = function(e) {
                                    setTimeout(()=>{
                                        videosCamVolumeLevelFunction(e, camItem, camVolumeControl.volume);
                                    }, 100);
                                }

                                camVolumeControl.shadowRoot.querySelector('div#videos-header-volume').onmouseup = function(e) {
                                    // Quickly lower volume.
                                    if (e.which === 2) {
                                        camVolumeControl.volume = autoMinCamVol;
                                    }

                                    setTimeout(()=>{
                                        videosCamVolumeLevelFunction(e, camItem, camVolumeControl.volume);
                                    }, 100);
                                }

                                // Or mute, which is volume too.
                                camVolumeControl.shadowRoot.querySelector('div.icon-volume > button').onclick = function(e) {
                                    setTimeout(()=>{
                                        if (camVolumeControl.muted) {
                                            videosCamVolumeLevelFunction(e, camItem, 0);
                                        } else {
                                            videosCamVolumeLevelFunction(e, camItem, -1);
                                        }
                                    }, 100);
                                }

                                // Optionally load last cam volume.
                                Object.entries(camsVolume).forEach(entry => {
                                    const [item, volume] = entry;

                                    if ((camName === item || userName === item) && volume !== 100) {
                                        camVolumeControl.volume = volume;
                                        tcl("Changing cam volume: " + camName + ' ' + volume);
                                        return;
                                    }
                                });
                            }

                            // Optionally hide all cams.
                            if (settingsQuick["HideAllCams"] === "true" || urlPars.get("hideallcams") === "") {
                                //camItem.onHide();
                                //camItem.hidden = !camItem.hidden;
                                camItemShadowroot.querySelector("button.icon-visibility").click();
                                tcl("Hiding all cams: " + camName);
                                continue;
                            }

                            // Optionally hide new cams.
                            if (camName) {
                                // Hide ignored user.
                                if (settingsQuick["IgnoredMonitor"]) {
                                    if (settingIgnoredUsers.hasOwnProperty(userName.toUpperCase()) || settingIgnoredUsers.hasOwnProperty(camName.toUpperCase())) {
                                        //camItem.onHide();
                                        //camItem.hidden = !camItem.hidden;
                                        camItemShadowroot.querySelector("button.icon-visibility").click();
                                        tcl("Hiding ignored cam: " + camName);
                                        continue;
                                    }
                                }

                                // Hide all new cams.
                                if (settingsQuick["HideNewCams"]) {
                                    //camItem.onHide();
                                    //camItem.hidden = !camItem.hidden;
                                    camItemShadowroot.querySelector("button.icon-visibility").click();
                                    tcl("Hiding new cam: " + camName);
                                    continue;
                                }
                            }
                        }
                    }
                }

                for (let i = 0; i < camElems.length; i++) {
                    camsCount = i + 1;
                    let camItem = camElems[i].querySelector("tc-video-item");
                    let camItemShadowroot = camItem.shadowRoot;
                    let camItemCSS = camItemShadowroot.querySelector(".video");
                    let camItemShadowrootVideoElement = camItemShadowroot.getElementById('video');

                    if (settingsQuick["NightMode"]) {
                        camItemCSS.classList.add("tes-nightmode");

                        var child = camItemShadowroot.getElementById("camItemCSShtmlNightmode");
                        if (!child) {
                            camItemShadowroot.appendChild(camParserAddCSSNightmode());
                        }
                    } else {
                        camItemCSS.classList.remove("tes-nightmode");

                        var child = cacamItemShadowrootmItem.getElementById("camItemCSShtmlNightmode");
                        if (child) {
                            camItemShadowroot.removeChild(child);
                        }
                    }

                    if (settingsQuick["NightModeBlack"]) {
                        camItemCSS.classList.add("blacknight");

                        var child = camItemShadowroot.getElementById("camItemCSShtmlBlacknight");
                        if (!child) {
                            camItemShadowroot.appendChild(camParserAddCSSBlacknight());
                        }
                    } else {
                        camItemCSS.classList.remove("blacknight");

                        var child = camItemShadowroot.getElementById("camItemCSShtmlBlacknight");
                        if (child) {
                            camItemShadowroot.removeChild(child);
                        }
                    }

                    if (settingsQuick["BorderlessCams"]) {
                        camItemCSS.classList.add("tes-borderlesscams");

                        var child = camItemShadowroot.getElementById("camItemCSShtmlBorderless");
                        if (!child) {
                            camItemShadowroot.appendChild(camParserAddCSSBorderless());
                        }
                    } else {
                        camItemCSS.classList.remove("tes-borderlesscams");

                        var child = camItemShadowroot.getElementById("camItemCSShtmlBorderless");
                        if (child) {
                            camItemShadowroot.removeChild(child);
                        }
                    }

                    if (!camItemShadowroot.querySelector("#camItemCSS")) camItemCSS.insertAdjacentHTML("afterbegin", camItemCSShtml);

                    let names = getCamUsername(camItem);

                    let camName_loop = names[0];

                    if (!camName_loop) {
                        tcl('ERROR: no camName_loop!');
                        continue;
                    }

                    camElems[i].setAttribute("id", "camUser-" + camName_loop);

                    try {
                        // Cam maxing
                        var maxbutton = camItemShadowroot.querySelector(".icon-tes-max");
                        if (maxbutton) {
                            maxbutton.parentNode.removeChild(maxbutton);
                        }

                        camItemShadowroot.querySelector(".icon-resize").insertAdjacentHTML("beforebegin", camMaxButtonHtml);
                        camItemShadowroot.querySelector(".icon-tes-max").setAttribute("id", "maxbutton-" + camName_loop);

                        // Add talking indicator.
                        if (!camItemShadowroot.querySelector(".icon-tes-talking")) {
                            camItemShadowroot.querySelector(".icon-resize").insertAdjacentHTML("beforebegin", camTalkingIndicatorHtml);
                            camItemShadowroot.querySelector(".icon-tes-talking").setAttribute("id", "micIndicator-" + camName_loop);
                        }

                        var maxCamVar = function (maxCamVarArg) {
                            videolistElem.querySelector(".videos-items:last-child").classList.remove("tes-max-noAnim");
                            maximizeCam(maxCamVarArg, "buttonpress");
                        };
                        camItemShadowroot.querySelector("#maxbutton-" + camName_loop).addEventListener("click", maxCamVar.bind(this, camName_loop));

                        if (camMaxedCurrent == camName_loop) {
                            camElems[i].classList.add("tes-maxedCam");
                            camElems[i].parentElement.classList.add("tes-max");
                        }
                        if (!videolistElem.querySelector(".tes-maxedCam")) camElems[i].parentElement.classList.remove("tes-max");

                        if (videolistCSS.querySelector("#camMaxCSS")) {
                            var maxcss = videolistCSS.querySelector("#camMaxCSS");
                            maxcss.parentNode.removeChild(maxcss);
                        }
                        videolistCSS.insertAdjacentHTML("beforeend", camMaxCSShtml);

                        // Toggle visibility of video only.
                        camSetVisibility(camItem);

                    } catch (e) {
                        tcl("error newCamAdded: " + e.message);
                    }

                    camCounter(camElems[i]);
                }
            } catch (e) {
                tcl("error newCamAdded: " + e.message);
            }
        }

// Define the MutationObserver configuration
const observerConfig = { childList: true, subtree: true };

// Create a MutationObserver instance to listen for changes in #videos-content
const videosContentObserver = new MutationObserver(handleVideosContentChange);

// Start observing #videos-content for changes
videosContentObserver.observe(videolistElem, observerConfig);

// Object to store camera positions and widths
const cameraPositions = {};

// Handle changes in #videos-content
function handleVideosContentChange(mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      // Handle added or removed videos
      const addedVideos = Array.from(mutation.addedNodes).filter(isVideoElement);
      const removedVideos = Array.from(mutation.removedNodes).filter(isVideoElement);

      // Update camera positions for added videos
      for (let video of addedVideos) {
        const camName = getCamNameFromVideo(video);
        if (camName && camName in cameraPositions) {
          const camElem = videolistElem.querySelector(`#camUser-${camName}`);
          if (camElem) {
            restoreCameraWidth(camElem, cameraPositions[camName]);
          }
        }
      }

      // Remove camera positions for removed videos
      for (let video of removedVideos) {
        const camName = getCamNameFromVideo(video);
        if (camName && camName in cameraPositions) {
          delete cameraPositions[camName];
        }
      }
    }
  }

  // Restore the widths of the camera elements
  const cameraElems = videolistElem.querySelectorAll(".js-video");
  for (let camElem of cameraElems) {
    const camName = getCamNameFromVideo(camElem);
    if (camName && camName in cameraPositions) {
      restoreCameraWidth(camElem, cameraPositions[camName]);
    }
  }
}

// Restore camera width
function restoreCameraWidth(camElem, positionData) {
  camElem.style.width = positionData.width;
}

// Check if an element is a video element
function isVideoElement(element) {
  return element instanceof HTMLElement && element.classList.contains("js-video");
}

// Get the camera name from a video element
function getCamNameFromVideo(video) {
  return video.id.replace("camUser-", "");
}

// Restore camera position and width
function restoreCameraProperties(camElem, positionData) {
  camElem.style.transform = positionData.transform;
  camElem.style.width = positionData.width;
}

// Update camera position and width in the cameraPositions object
function updateCameraPosition(camElem) {
  const camName = getCamNameFromVideo(camElem);
  const positionData = {
    transform: camElem.style.transform,
    width: camElem.style.width
  };
  cameraPositions[camName] = positionData;
}


// Global variable to store the original width and transform values of maximized cameras
let originalWidths = {};
let originalTransforms = {};

function createResizeHandle() {
  const resizeHandle = document.createElement("div");
  resizeHandle.classList.add("tes-resize-handle");
  return resizeHandle;
}

function maximizeCam(camName, opt = null) {
  try {
    var camElem = videolistElem.querySelector("#camUser-" + camName);
    if (camElem == null) {
      return;
    }

    if (opt == "bbuttonpress") {
      camElem.parentElement.classList.remove("tes-max-noAnim");
    }

    if (camElem.classList.contains("tes-maxedCam")) {
      // Check if camera is already maximized
      if (camElem.classList.contains("tes-max-original")) {
        // Restore camera to original state/location
        camElem.classList.remove("tes-maxedCam");
        camElem.parentElement.classList.remove("tes-max");
        camElem.style.cursor = "default"; // Reset cursor style
        camElem.removeEventListener("mousedown", startDrag);
        camElem.removeEventListener("mouseup", stopDrag);
        camElem.removeEventListener("mousemove", drag);
        camElem.removeEventListener("mouseleave", stopDrag);
        camElem.style.transform = ""; // Reset transform
        camElem.style.width = ""; // Reset width
        camElem.style.height = ""; // Reset height

        // Toggle the #chat-wider
        const chatWiderElem = chatlogElem.getElementById("chat-wider");
        setTimeout(function () {
          chatWiderElem.classList.toggle("active");
          chatWiderElem.dispatchEvent(new Event("click"));
        }, 1500);

        // Remove camera position data from the object
        delete cameraPositions[camName];

        // Remove the slider
        let slider = camElem.querySelector(".camera-resize-slider");
        if (slider) {
          camElem.removeChild(slider);
        }
      } else {
        // Camera is already maximized, mark it as original to restore later
        camElem.classList.add("tes-max-original");
        camElem.style.transform = ""; // Reset transform

        // Toggle the #chat-wider
        const chatWiderElem = chatlogElem.getElementById("chat-wider");
        setTimeout(function () {
          chatWiderElem.classList.toggle("active");
          chatWiderElem.dispatchEvent(new Event("click"));
        }, 1500);
      }
    } else {
      camElem.classList.add("tes-maxedCam");
      camElem.parentElement.classList.add("tes-max");
      setTimeout(function () {
        camElem.parentElement.classList.add("tes-max-noAnim");
      }, 500);

      // Enable dragging of maximized camera
      let isDragging = false;
      let initialX = 0;
      let initialY = 0;
      let xOffset = 0;
      let yOffset = 0;
      let currentScale = 1; // Default scale

      camElem.addEventListener("mousedown", startDrag);
      camElem.addEventListener("mouseup", stopDrag);
      camElem.addEventListener("mousemove", drag);
      camElem.addEventListener("mouseleave", stopDrag);

      function startDrag(e) {
        // Start dragging
        isDragging = true;
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }

    function drag(e) {
        if (isDragging && camElem.classList.contains("tes-maxedCam")) {
          xOffset = e.clientX - initialX;
          yOffset = e.clientY - initialY;
          camElem.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(${currentScale})`;
          camElem.style.cursor = "move"; // Set cursor style to indicate drag
          camElem.style.zIndex = "9999";
        }
    }

      function stopDrag() {
        isDragging = false;
        // Save camera position data to the object
        cameraPositions[camName] = {
          transform: camElem.style.transform,
          width: camElem.style.width,
        };
      }

    // Create and append the slider
    let slider = document.createElement("input");
    slider.type = "range";
    slider.min = "85";  // Minimum scale value (e.g., 10%)
    slider.max = "200"; // Maximum scale value (e.g., 200%)
    slider.value = "100"; // Default scale (100%)
    slider.classList.add("camera-resize-slider");
    slider.style.display = "none"; // Hide by default

    // Add slider to the camera element or its container
    camElem.appendChild(slider);

      // Slider event listener for resizing
      slider.addEventListener("input", function() {
        // Resize the camera based on the slider value
        let scaleValue = parseInt(slider.value);
        currentScale = scaleValue / 100; // Convert to scale (e.g., 1.5 for 150%)
        camElem.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(${currentScale})`;
      });

      // Show/hide slider on hover
      camElem.addEventListener("mouseenter", function() {
        slider.style.display = "block";
      });
      camElem.addEventListener("mouseleave", function() {
        slider.style.display = "none";
      });
    }

    camCounter(camElem);
  } catch (e) {
    tcl("error maximizeCam: " + e.message);
  }
}

        function camCounter(camElem) {
            try {
                if (camsCount == 12) {
                    camElem.parentElement.classList.remove("tes-camCount10-11");
                    camElem.parentElement.classList.remove("tes-camCount2");

                    camElem.parentElement.classList.add("tes-camCount12");
                } else if (camsCount > 9 && camsCount < 12) {
                    camElem.parentElement.classList.remove("tes-camCount12");
                    camElem.parentElement.classList.remove("tes-camCount2");

                    camElem.parentElement.classList.add("tes-camCount10-11");
                } else if (camsCount == 2) {
                    camElem.parentElement.classList.remove("tes-camCount12");
                    camElem.parentElement.classList.remove("tes-camCount10-11");

                    camElem.parentElement.classList.add("tes-camCount2");
                } else {
                    camElem.parentElement.classList.remove("tes-camCount12");
                    camElem.parentElement.classList.remove("tes-camCount10-11");
                    camElem.parentElement.classList.remove("tes-camCount2");
                }
            } catch (e) {
                tcl("error camCounter: " + e.message);
            }
        }
    } catch (e) {
        tcl("error runTES: " + e.message);
    }
    /* End main function */
    return {
        newUserAdded: newUserAdded,
        chatlogElem: chatlogElem,
        userlistElem: userlistElem,
        tinychat: tinychat,
        userlist: userlist,
        settingsQuick: settingsQuick,
        updateScroll: updateScroll,
        known_spam_text: known_spam_text,
        videolistElem: videolistElem,
        chatlog: chatlog,
        titleElem: titleElem,
        modder: modder,
        updBaLi: updBaLi,
        BaLi: BaLi,
        unB: unB
    };
}

function tcl(m) {
    try {
        if (m.includes("error ")) {
            var m = m.split("error ")[1];
            console.log("%cTES " + "%cerror" + "%c" + ": " + m, "font-weight: bold; color: #53b6ef;", "color: red;", "");
        } else {
            console.log("%cTES: " + "%c" + m, "font-weight: bold; color: #53b6ef;", "");
        }
    } catch (e) {
        console.log("------ TES error tcl: " + e.message);
    }
}

function TESwsParser() {
    try {
        wsdata = [];
        chatlogMain = "";
        userlistLog = {};
        usernamesLog = [];
        userlistLogQuits = {};
        newline = `
`;
        WebSocket.prototype._send = WebSocket.prototype.send;

        // Track outgoing events.
        (function() {
            var proxied = WebSocket.prototype._send;
            WebSocket.prototype._send = function() {
                try {
                    let msg = JSON.parse(arguments[0]);

                    let msgType = msg['tc'];
                    let msgHandle = msg['handle'];
                    let msgText = msg['text'];

                    if (msgType === 'pvtmsg' && msgHandle) {
                        // Track PMs.
                        let nick = userlistLog[msgHandle]["nick"];

                        pmHistory.push(msgText);
                        pmHistoryNicks.push(nick);

                        if (pmHistory.length > 100) {
                            pmHistory.shift();
                            pmHistoryNicks.shift();
                        }
                    }

                    /*if (msgType.includes('msg')) {
                        TESapp.updateScroll(true);
                    }*/
                } catch(e) {tcl('ERROR WebSocket.prototype._send: ' + e)}

                return proxied.apply(this, arguments);
            };
        })();

        // Track incoming events.
        WebSocket.prototype.send = function (data) {
            try {
                this._send(data);

                this.addEventListener('message', function (msg) {
                    var msg_parsed = JSON.parse(msg.data);

                    try {
                        if (msg_parsed.tc == 'joined') {
                            myNick = msg_parsed["self"]["nick"];
                            myHandle = msg_parsed["self"]["handle"];
                        }

                        if (msg_parsed.tc == 'msg' && msg.data.includes('"handle"')) {
                            let handle = msg_parsed["handle"];
                            let nick = userlistLog[handle]["nick"];
                            let username = userlistLog[handle]["username"];
                            let msg_text = msg_parsed["text"];

                            if (username) {
                                chatlogAdd(nick + " (" + username + "): " + msg_text);
                            } else {
                                chatlogAdd(nick + ": " + msg_text);
                            }

                            addMessageToNewChatbox(msg_parsed, handle, username, nick, msg_text);
                        }

                        if (msg_parsed.tc == 'pvtmsg' && msg.data.includes('"handle"')) {
                            let handle = msg_parsed["handle"];
                            let nick = userlistLog[handle]["nick"];
                            let username = userlistLog[handle]["username"];
                            let msg_text = msg_parsed["text"];

                            let system = false;
                            // Special identifier character for self-system msgs.
                            if (handle === myHandle && msg_text.startsWith('⠀')) {
                                system = true;
                            }

                            if (username) {
                                chatlogAdd('[' + nick + " (" + username + ")]: " + msg_text);
                            } else {
                                chatlogAdd('[' + nick + "]: " + msg_text);
                            }

                            addMessageToNewChatbox(msg_parsed, handle, username, nick, msg_text, true, system);

                            if (BOT_MODE) {
                                try {
                                    let u = TESapp.userlist.getByNickname(nick);
                                    let is_mod = u.isOperator || u.isOwner;
                                    let is_owner = u.isOwner || u.username === TESapp.modder;

                                    if (u && (is_mod || is_owner)) {
                                        // Toggle bot whitelist.
                                        if (msg_text.toLowerCase() === 'whitelist') {
                                            TESapp.titleElem.querySelector("#tes-settings-banned input:nth-of-type(2)").click();

                                            // Respond.
                                            if (TESapp.titleElem.querySelector("#tes-settings-banned input:nth-of-type(2)").checked) {
                                                // Rescan user list.
                                                TESapp.newUserAdded();

                                                if (lastPMReceivedNick) TESapp.chatlog.SendMessage(u, 'Whitelist ON');
                                            } else {
                                                if (lastPMReceivedNick) TESapp.chatlog.SendMessage(u, 'Whitelist OFF');
                                            }
                                        }

                                        // Reload whitelist.
                                        if (msg_text.toLowerCase() === 'refresh') {
                                            TESapp.titleElem.querySelector("#tes-settings #tes-settings-banned button.save").click();

                                            // Respond.
                                            if (lastPMReceivedNick) TESapp.chatlog.SendMessage(u, 'Whitelist Refreshed');
                                        }
                                    }
                                } catch(e) {
                                    tcl("error WebSocket.prototype.send function pvtmsg BOT_MODE: " + e.message);
                                }
                            }
                        }

                        if (msg_parsed.tc == 'publish' || msg_parsed.tc == 'unpublish') {
                            let action = (msg_parsed["tc"] == "publish") ? "is" : "stopped";
                            let handle = msg_parsed["handle"];
                            let nick, username;

                            if (userlistLog[handle]) {
                                nick = userlistLog[handle]["nick"];
                                username = userlistLog[handle]["username"];
                            } else {
                                // Message can arrive after a user has also quit.
                                nick = userlistLogQuits[handle]["nick"];
                                username = userlistLogQuits[handle]["username"];
                            }

                            if (username) {
                                chatlogAdd("- " + nick + " (" + username + ") " + action + " broadcasting.");
                            } else {
                                chatlogAdd("- " + nick + " " + action + " broadcasting.");
                            }
                        }

                        if (msg_parsed.tc == 'sysmsg') {
                            chatlogAdd("-- " + msg_parsed["text"]);
                        }

                        if (msg_parsed.tc == 'userlist') {
                            userlistArr = msg_parsed["users"];

                            for (i = 0; i < userlistArr.length; i++) {
                                let nick = userlistArr[i]["nick"];
                                let handle = userlistArr[i]["handle"];
                                let username = userlistArr[i]["username"];
                                let isMod = userlistArr[i]["mod"];

                                userlistLog[handle] = {
                                    "nick": nick,
                                    "username": username,
                                    "mod": isMod
                                };

                                isMod = isMod == true ? "[MOD]" : "";
                                let logtext = username == "" ? nick : nick + "(" + username + ")";
                                logtext += isMod;
                                usernamesLog.push(logtext);
                            }

                            userlistInitial = usernamesLog.join(', ');
                            usersCountInitial = usernamesLog.length;
                        }

                        if (msg_parsed.tc == 'join' && 'username' in msg_parsed) {
                            let nick = msg_parsed["nick"];
                            let handle = msg_parsed["handle"];
                            let username = msg_parsed["username"];
                            let isMod = msg_parsed["mod"];

                            userlistLog[handle] = {
                                "nick": nick,
                                "username": username,
                                "mod": isMod
                            };

                            if (username) {
                                chatlogAdd("- " + nick + " (" + username + ") has joined.");
                            } else {
                                chatlogAdd("- " + nick + " has joined.");
                            }
                        }

                        if (msg_parsed.tc == 'quit') {
                            let handle = msg_parsed["handle"];
                            let username = userlistLog[handle]["username"];
                            let nick = userlistLog[handle]["nick"];

                            if (username) {
                                chatlogAdd("- " + nick + " (" + username + ") has quit.");
                            } else {
                                chatlogAdd("- " + nick + " has quit.");
                            }

                            userlistLogQuits[handle] = userlistLog[handle];
                            delete userlistLog[handle];
                        }

                        if (msg_parsed.tc == 'nick') {
                            let handle = msg_parsed["handle"];
                            let nick = msg_parsed["nick"];

                            let oldNick = userlistLog[handle]["nick"];
                            userlistLog[handle]["nick"] = nick;

                            if (handle == myHandle) {
                                myNick = nick;
                            }

                            TESapp.newUserAdded("scanOnly");

                            chatlogAdd("- " + oldNick + " is now known as " + nick);
                        }

                        if (msg.data.includes('"item"')) {
                            if (msg_parsed.tc == 'yut_play') {
                                let id = msg_parsed["item"]["id"];
                                chatlogAdd("- YouTube video started: " + "https://youtube.com/watch?v=" + id);
                            }
                            if (msg_parsed.tc == 'yut_stop') {
                                chatlogAdd("- YouTube video stopped.");
                            }
                        }

                    } catch(e) {
                        tcl("error WebSocket.prototype.send function: " + e.message);
                    }

                }, false);
                this.send = function (data) {
                    this._send(data);
                };

            } catch (e) {
                tcl("ERROR WebSocket.prototype.send: " + e.message);
            }
        }

        function chatlogAdd(arg) {
            var timestamp = new Date().toLocaleTimeString('en-GB', {
                hour12: false
            });
            chatlogMain += "[" + timestamp + "] " + arg + newline;
        }

        function newChatboxScroll(element) {
            newChatboxUserScrolled = false;
            element.scrollIntoView(false);
        }

        //var newChatboxMsgId;
        var last_myself = false;
        function addMessageToNewChatbox(msg_parsed, handle, username, nick, msg, priv = false, system = false) {
            var user = TESapp.tinychat.defaultChatroom.userlist.getByNickname(nick);

            if (system) {
                // Avoid repeats.
                if (!last_myself) {
                    last_myself = true;
                } else {
                    last_myself = false;
                    return;
                }

                var username = 'SYSTEM';
                var nick = '⛌ Failed to Send:';
            } else {
                // Ignored users.
                if (TESapp.userlist.isIgnored(user)) return;

                // Skip known spam.
                for (const text of TESapp.known_spam_text) {
                    if (msg.toLowerCase().includes(text.toLowerCase())) return;
                }
            }

            var chatContentNew = TESapp.chatlogElem.querySelector('#chat-content-new')
            var chatParent = TESapp.chatlogElem.querySelector('#chat')

            // mark private messages
            let pmTarget;
            var nickClass = 'nickname';
            var avatarClass = 'avatar';
            if (priv) {
                nickClass += ' private';
                avatarClass += ' private';

                // Add PM target if applicable.
                if (nick === myNick) {
                    // Find nick from recent sent messages history.
                    try {
                        let n = pmHistoryNicks[pmHistory.lastIndexOf(msg)] || '';
                        pmTarget = '❯ ' + n;
                    } catch(err) {
                        tcl(`addMessageToNewChatbox pmTarget ERROR: ${err}`);
                    }
                } else {
                    lastPMReceivedNick = nick;
                }
            }

            // autoscroll if sent by self
            if (nick === myNick) {
                newChatboxScroll(chatContentNew);
            }

            // parent div
            var node = document.createElement("div");
            node.className = "message common";
            //node.id = newChatboxMsgId;

            // avatar div
            divnode = document.createElement("div");
            divnode.className = avatarClass;
            var imgnode = document.createElement("img");
            imgnode.src = user.avatarUrl;
            divnode.title = username;
            divnode.appendChild(imgnode);
            node.appendChild(divnode);

            // nick div
            divnode = document.createElement("div");
            divnode.className = nickClass;
            try {
                divnode.setAttribute("data-status", TESapp.userlistElem.children.userlist.querySelectorAll('[data-user-id = "'+handle+'"]')[0].dataset.status);
            } catch(e) {}
            let textnode = document.createTextNode(pmTarget || nick);
            divnode.appendChild(textnode);
            node.appendChild(divnode);

            // text div
            var divnode = document.createElement("div");
            divnode.className = "content";

            // modify msg
            var m = msg;

            // add image element from first safe image link found.
            /*let reg = /(https?:\/\/)?(www)?(imgur\.com|fbcdn\.net|4cdn\.org){1}\/[-A-Z0-9_\-/.]+/igm;
            let res = m.match(reg);
            if (res.length > 0) {
                let first = res[0];
                let img = /([-A-Z0-9._\-]+)$/igm;
                // http://i.imgur.com/12345t.jpg
            }*/

            // change URLs to links
            let content = document.createTextNode(m);
            divnode.appendChild(content);
            divnode.innerHTML = linkify(divnode.innerHTML);
            node.appendChild(divnode);

            // timestamp
            var timestamp = new Date().toLocaleTimeString('en-GB', {hour12: false});
            divnode = document.createElement("div");
            divnode.className = "timestamp";
            textnode = document.createTextNode(timestamp);
            divnode.appendChild(textnode);
            node.appendChild(divnode);

            chatContentNew.appendChild(node);

            // Remove oldest msg if too full.
            if (chatContentNew.children.length > 1000) {
                chatContentNew.firstChild.remove();
            }

            // Autoscroll down if not manually scrolled.
            //if (chatParent.scrollHeight - chatParent.scrollTop - chatParent.clientHeight < 1000) {
            if (!newChatboxUserScrolled) {
                newChatboxScroll(chatContentNew);
            }

            if (!priv) {
                checkMentions(node);
            }

            // Add to auto reloaded log.
            GM_setValue(currentPageURLValidName + "newChatboxLog", chatContentNew.innerHTML);
        }

        // Mark mentions.
        function checkMentions(node) {
            let c = node.querySelector('.content');
            let nick_element = node.querySelector('.nickname');
            let timestamp_element = node.querySelector('.timestamp');

            if (TESapp.settingsQuick["MentionsMonitor"]) {
                settingMentions.forEach((word) => {
                    if (c.innerText.toUpperCase().indexOf(word.toUpperCase()) !== -1) {
                        nick_element.classList.add('mention');
                        //timestamp_element.classList.add('mention');
                        return;
                    }
                });
            }
        }

        // Replace URLs with links.
        /* Test:
testing bob3.co.il/mysite.php?var=loop  hah
bleep.com/hey
poop.eat.org heh
bleep.bloop.pop.net.il/yup
test http://site.com/?default=a+b
my email hrehe+mi3ke@ghsreghrs.com
grseh@grsgre.com
www.swords-bops.com

tadaa!
        */
        function swapURL(url) {
            // Remove trailing punctuation.
            //url = url.replace(/[.,]+$/, '');

            // Separate anything before protocol.
            let not_url = '';
            let protocol = url.search(/https?:\/\//i);
            if (protocol > 0) {
                not_url = url.slice(0, protocol);
                url = url.slice(protocol);
                console.log('boop', not_url, url)
            }

            let urlNoProtocol = url;

            // Ensure default protocol.
            if (!url.includes('//')) {
                // Printout without protocol.
                urlNoProtocol = url;

                url = 'https://' + url;
            }

            return not_url+'<a target="_blank" href="'+url+'">'+urlNoProtocol+'</a>';
        }

        function linkify(inputText) {
            // Replace nbsp with space, to avoid link marking issues, which are common webwide.
            inputText = inputText.replace(/&nbsp;/g, ' ');

            let urlPattern = /(https?:\/\/|ftp:\/\/|www\.[^.]|youtu\.be|\b(\w+\.)*(?<!@)\w+\.(com|org|net|info|gov|mil|de|icu|ru|xyz|tk|io|co\.\w+))\S*/ig;
            let urlPatternStarts = /^(https?:\/\/|ftp:\/\/)/i;
            let emailPattern = /([a-zA-Z0-9\-\_\.+]+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/ig;

            // By word.
            let newText = [];

            // Lines.
            for (let line of inputText.split(/\r?\n/)) {
                let newLine = [];

                // Words.
                for (let word of line.split(' ')) {
                    let w = word;

                    // URLs have protocol.
                    if (word.match(urlPatternStarts)) {
                        w = swapURL(word);
                    }

                    // Swap emails.
                    else if (word.includes('@')) {
                        w = word.replace(emailPattern, function (x) {
                            return '<a target="_blank" href="mailto:'+x+'">'+x+'</a>';
                        });
                    }

                    // Swap URLs.
                    else if (word.match(urlPattern)) {
                        w = swapURL(word);
                    }

                    // Add word.
                    newLine.push(w);
                }

                newLine = newLine.join(' ');

                newText.push(newLine);
            }

            newText = newText.join('\n');

            return newText;
        }

    } catch (e) {
        tcl("error TESwsParser: " + e.message);
    }
}