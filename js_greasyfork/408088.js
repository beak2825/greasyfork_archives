// ==UserScript==
// @name         CabbageBot
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  CBG TC Script
// @author       YungElon
// @match        https://tinychat.com/room/cabbagepatch
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408088/CabbageBot.user.js
// @updateURL https://update.greasyfork.org/scripts/408088/CabbageBot.meta.js
// ==/UserScript==

(() => {

    let cbg;

    const iconElement = document.createElement('link');

    iconElement.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    iconElement.rel = 'stylesheet';

    document.head.appendChild(iconElement);

    const readyInterval = setInterval(() => {

        if(document.querySelector('#content') && document.querySelector('#content').shadowRoot) {

            window.TinychatApp.BLL.MediaConnection.prototype.Close = function() {
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

            window.TinychatApp.BLL.Userlist.prototype.generateUpdateEvent = function(a, b) {
                var c = -1,
                    d = null,
                    e = -1,
                    f = null;
                  Object.keys(this.items).forEach(b => {
                    var e = this.items[b];
                    if (e.handle === a) {
                        c = Number.parseInt(b);
                        d = Object.assign(new window.TinychatApp.DAL.UserEntity(), e);
                        f = e;
                    }
                });
                if(d != null && (b(f) || !Object.equals(d, f))) {
                    this.sorting(this.items);
                    e = this.items.indexOf(f);
                    if (e != -1) this.EventBus.broadcast(window.TinychatApp.BLL.UserlistUpdateUserEvent.ID, new window.TinychatApp.BLL.UserlistUpdateUserEvent(c, d,  e, f, this));
                }
            };

            window.TinychatApp.BLL.Userlist.prototype.sorting = function(a) {
                a.sort((c, a) => {
                    return (a.subscriptionType - c.subscriptionType || (a.isOperator ? 1 : 0) - (c.isOperator ? 1 : 0) || (a.isBroadcasting ? 1 : 0) - (c.isBroadcasting ? 1 : 0) || c.nickname.toLowerCase().localeCompare(a.nickname.toLowerCase()) || c.handle - a.handle);
                });
            };

            window.TinychatApp.BLL.User.isSubscription = function() {
                return true;
            };

            window.TinychatApp.BLL.User.canUseFilters = function() {
                return true;
            };

            // window.TinychatApp.BLL.Videolist.prototype.CanMakeLargeVideo = function() {
            //     return true;
            // }

            window.TinychatApp.prototype.isDebug = function() {
                return true;
            };

            window.TinychatApp.BLL.Videolist.prototype._volMediaStream = function(a, b) {
                let c = a.getAudioTracks();
    
                !Array.isArray(c) || 1 > c.length || Object.keys(c).forEach(a=>{
                    c[a].volume = 0.09
                    //console.log(c[a].kind + " - " + c[a].readyState + ", remote:" + c[a].remote + " - " + c[a].id + " -> vol: " + c[a].volume)
                });
            }

            window.TinychatApp.BLL.Userlist.prototype.sorting = function(a) {
                a.sort((c, a) => {
                    return (a.subscriptionType - c.subscriptionType || (a.isOperator ? 1 : 0) - (c.isOperator ? 1 : 0) || (a.isBroadcasting ? 1 : 0) - (c.isBroadcasting ? 1 : 0) || c.nickname.toLowerCase().localeCompare(a.nickname.toLowerCase()) || c.handle - a.handle);
                });
            };

            window.TinychatApp.BLL.MediaConnection.prototype.onICE_Candidate = function(a) {
                if (console.log(a),
                null != a.candidate && "object" === typeof a.candidate && "string" === typeof a.candidate.candidate) {
                    var b = this.chatroom.tcPkt_Trickle(this.handle, a.candidate.candidate);
                    this.chatroom.packetWorker.send(b)
                }
            }

            window.TinychatApp.BLL.ChatRoom.prototype.BroadcastStart = function(a) {
                var b = this,
                    d = this.settings.getSettings();
                if (d.video === null) {
                    return void this.app.MediaSettings(() => {
                        this.BroadcastStart();
                    });
                }
                this.videolist.AddingVideoSelf(this.self_handle);

                if(a) {
                    var m = new window.TinychatApp.BLL.BroadcastProgressEvent(window.TinychatApp.BLL.BroadcastProgressEvent.MEDIA_START);
                    this.EventBus.broadcast(window.TinychatApp.BLL.BroadcastProgressEvent.ID, m);

                    b.mediaLastConstraints = {
                        video: {
                            width: {
                                min: 320,
                                max: 4096
                            },
                            height: {
                                min: 240,
                                max: 2160
                            },
                            frameRate: {
                                min: 15,
                                ideal: 60,
                                max: 144
                            }
                        },
                        audio: true
                    };

                    return b.onMediaSuccessCallback(a);
                }

                var e = {};
                if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                    e.audio = false;
                    e.video = {
                        width: {
                            min: 320,
                            max: 4096
                        },
                        height: {
                            min: 240,
                            max: 2160
                        },
                        frameRate: {
                            min: 15,
                            ideal: 30,
                            max: 60
                        }
                    };
                } else {
                    navigator.mediaDevices.enumerateDevices().then(g => {
                        var h = false;
                        var len = g.length;
                        for (var c = 0; c < len; c++) {
                            if (g[c].kind === "videoinput") {
                                if (e.video === void 0) e.video = {
                                    width: {
                                        min: 320,
                                        max: 4096
                                    },
                                    height: {
                                        min: 240,
                                        max: 2160
                                    },
                                    frameRate: {
                                        min: 15,
                                        ideal: 30,
                                        max: 60
                                    }
                                };
                                if (h) {
                                    d.video = g[c];
                                    h = false;
                                    this.settings.saveSettings(d);
                                } else if (d.video === null) {
                                    d.video = g[c];
                                    this.settings.saveSettings(d);
                                } else if (d.video !== null && typeof d.video == "object" && d.video.deviceId == g[c].deviceId && d.video.deviceId !== a) {
                                    e.video.deviceId = {
                                        exact: d.video.deviceId
                                    };
                                } else if (d.video.deviceId === a) {
                                    h = true;
                                }
                            }
                            if (g[c].kind === "audioinput") {
                                if (e.audio === void 0) e.audio = {};
                                if (d.audio !== null && typeof d.audio == "object" && d.audio.deviceId == g[c].deviceId) {
                                    e.audio = {
                                        deviceId: {
                                            exact: d.audio.deviceId
                                        },
                                    };
                                }
                            }
                        }
                        if (e.video !== null && d.video !== null && d.video.deviceId == b.id__miconly) delete e.video;
                        let i = navigator.mediaDevices.getSupportedConstraints();
                        for (let a in i) {
                            if (i.hasOwnProperty(a) && "echoCancellation" == a && e.audio) e.audio[a] = this.settings.isAcousticEchoCancelation();
                        }
                        if (!(e.audio || e.video)) {
                            b.onMediaFailedCallback(new Error("No media devices to start broadcast."));
                        } else if ("https:" === location.protocol || this.app.isDebug()) {
                            var m = new window.TinychatApp.BLL.BroadcastProgressEvent(window.TinychatApp.BLL.BroadcastProgressEvent.MEDIA_START);
                            this.EventBus.broadcast(window.TinychatApp.BLL.BroadcastProgressEvent.ID, m);
                            b.mediaLastConstraints = e;
                            navigator.mediaDevices.getUserMedia(e).then(m => {
                                b.onMediaSuccessCallback(m);
                            });
                        }
                    }).catch(er => {

                    });
                }
            };

            window.TinychatApp.BLL.ChatRoom.prototype.onStreamClosed = function(a) {
                if (!this.tcPkt_TcCallbackCheck(a, "stream_closed"))
                    return;
                let b = a.publish
                  , c = a.handle;

                if(this.self_handle == c) {
                    this._selfMediaStreamStop(c, "Broadcast closed due server request")
                    a.reason !== void 0 && null !== a.reason && this._selfShowReason(a.reason)
                } else { 
                    this._stopRemoteMediaConnection(c)
                    this.onRoomPublishReconnect(c)
                }
            }

            // window.TinychatApp.BLL.ChatRoom.prototype.BroadcastStart = async function(a) {

            //     // content.app.defaultChatroom.videolist.items[3]

            //     var b = this,
            //         d = this.settings.getSettings();
            //     if (d.video === null) {
            //         return void this.app.MediaSettings(() => {
            //             this.BroadcastStart();
            //         });
            //     }
            //     this.videolist.AddingVideoSelf(this.self_handle);

            //     const constraints = {
            //         video: true,
            //         audio: true
            //     };

            //     b.mediaLastConstraints = constraints;

            //     var m = new window.TinychatApp.BLL.BroadcastProgressEvent(window.TinychatApp.BLL.BroadcastProgressEvent.MEDIA_START);
            //     this.EventBus.broadcast(window.TinychatApp.BLL.BroadcastProgressEvent.ID, m);
            //     //b.mediaLastConstraints = e;
            //     b.onMediaSuccessCallback(content.app.defaultChatroom.videolist.items[0].mediastream);

            //     // navigator.mediaDevices.getDisplayMedia(constraints)
            //     // .then(ms => {
            //     //     var m = new window.TinychatApp.BLL.BroadcastProgressEvent(window.TinychatApp.BLL.BroadcastProgressEvent.MEDIA_START);
            //     //     this.EventBus.broadcast(window.TinychatApp.BLL.BroadcastProgressEvent.ID, m);
            //     //     //b.mediaLastConstraints = e;
            //     //     b.onMediaSuccessCallback(ms);
            //     // });

            //     //return console.log(med);
            // };
            
            // const mainDom = document.body.querySelector('tinychat-webrtc-app').shadowRoot;
            // const videoList = mainDom.querySelector('tc-videolist').shadowRoot.querySelector('videolist');

            // videoList.style = `
            // background: url('https://images.unsplash.com/flagged/photo-1551301622-6fa51afe75a9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjExMzk2fQ&w=1000&q=80') no-repeat center cover / contain;
            // `;

            try {
                cbg = new Cabbage(true);
            }
            catch(err) {
                content.app.showNotificationHandler('An error occurred', err, 'Ok');
            }

            clearInterval(readyInterval);
        }

    }, 300);

    class Cabbage {

        version = '0.1.0';
        blacklist = [];
        users = [];
        bots = [];
        youtubeQueue = [];
        ui = null;
        wordBlacklist = [
            'nigger',
            'jihad'
        ];
        youtubeWhitelist = [];
        ls = {};
        prefix = '.';
        settings = null;

        constructor(debug = false, prefix = '.') {
            this.mainDom = document.body.querySelector('tinychat-webrtc-app').shadowRoot;
            this.sideMenu = this.mainDom.querySelector('tc-sidemenu').shadowRoot;
            this.videoList = this.mainDom.querySelector('tc-videolist').shadowRoot;

            // this.observer = new MutationObserver(this._observerCallback.bind(this));

            document.addEventListener('beforeunload', () => {
                this.ui.close();
            });

            this.selfUser = content.app.defaultChatroom.selfUser();
            this.debug = debug;

            this.users = [];

            this._loadSettings();

            setInterval(() => {
                this._saveSettings();
            }, 60 * 1000);

            this.notify(`CBG Script v${this.version}`);

            this.addYoutubeButton();
            this._addScreenshareButton();

            setTimeout(() => {
                this._addCameraModification();
            }, 2000);

            //this._scanRoom();

            this._initListeners();
        }

        _addCameraModification() {

            const videos = this.videoList.querySelectorAll('.videos-items:last-child > .js-video');

            if(!videos.length) return;

            console.log(videos)

            videos.forEach(camera => {
                const resizeBtn = camera.querySelector('tc-video-item').shadowRoot.querySelector('.icon-resize');

                resizeBtn.addEventListener('click', (e) => {
                    console.log({
                        resize: e
                    })
                })
            });
        }

        _createElement(element, attr = null) {
            return document.createElement(element);
        }

        async _addScreenshareButton() {
            const broadcastWrapper = this.videoList.querySelector('#videos-footer-broadcast-wrapper');
            const broadcastButton = broadcastWrapper.querySelector('#videos-footer-broadcast');

            const screenshareButton = this._createElement('button');

            broadcastButton.style = 'width: calc(95% - 1em);';

            screenshareButton.style = `
                border: 0;
                position: relative;
                display: block;
                height: 100%;
                width: 5%;
                min-width: 64px;
                border-radius: 11px;
                box-sizing: border-box;
                background-color: #38cd57;
                color: #f1f1f1;
                cursor: pointer;
                transition: .2s;
                margin: 0 1em 0 0;
            `;

            screenshareButton.innerHTML = `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><span class="material-icons">airplay</span>`;
            screenshareButton.addEventListener('click', () => {

                navigator.mediaDevices.getDisplayMedia({
                    video: {
                        width: 1920,
                        height: 1080,
                        frameRate: 60
                    },
                    audio: true
                })
                .then(async ms => {

                    if(!ms.getAudioTracks().length) {
                        const settings = content.app.defaultChatroom.settings.getSettings();
                        const audioDevice = await navigator.mediaDevices.getUserMedia({
                            video: false,
                            audio: {
                                deviceId: {
                                    exact: settings.audio.deviceId
                                }
                            }
                        });

                        ms.addTrack(audioDevice.getAudioTracks()[0]);
                    }

                    if(content.app.defaultChatroom.selfUser().isBroadcasting) {
                        content.app.defaultChatroom.BroadcastSwitch(ms)
                    } else {
                        content.app.defaultChatroom.BroadcastStart(ms);
                    }
                });
            });

            broadcastWrapper.insertBefore(screenshareButton, broadcastWrapper.firstChild);
        }
        
        _debug(message) {
            console.log(`DEBUG::${message}`);
        }

        _errorReport(error) {
            this.notifyModal('An error occurred', error);
        }

        _loadSettings() {
            let data = localStorage.getItem('CBG');

            if(!data) {
                this.prefix = '+';
                this.wordBlacklist = [];
                this.youtubeWhitelist = [];
                this.users = [];

                this._saveSettings();
            }

            data = JSON.parse(data);

            console.log(data)

            this.prefix = data.prefix;
            this.wordBlacklist = data.wordBlacklist;
            this.youtubeWhitelist = data.youtubeWhitelist;
            this.users = data.users;
        }
        
        _saveSettings() {
            let settings = {
                prefix: this.prefix,
                wordBlacklist: this.wordBlacklist,
                youtubeWhitelist: this.youtubeWhitelist,
                users: this.users,
                bots: this.bots
            };

            localStorage.setItem('CBG', JSON.stringify(settings));
        }

        _loadBlacklist() {
            
        }

        _initListeners() {
            // const chatLog = this.mainDom.querySelector('tc-chatlog').shadowRoot.querySelector('#chat-content');

            // this.observer.observe(chatLog, {
            //     childList: true
            // });

            this._debug('Subscribing to listeners');

            content.app.EventBus.subscribe(TinychatApp.BLL.ChatlogItemAddedEvent.ID, this._detectCommand.bind(this));
            content.app.EventBus.subscribe(TinychatApp.BLL.UserlistAddUserEvent.ID, this._onUserJoined.bind(this));
            content.app.EventBus.subscribe(TinychatApp.BLL.UserlistRemoveUserEvent.ID, this._onUserLeft.bind(this));
            content.app.EventBus.subscribe(TinychatApp.BLL.VideolistEvent.ID, this._onVideoEvent.bind(this));
            content.app.EventBus.subscribe(TinychatApp.BLL.YoutubeEvent.ID, this._onYoutubeEvent.bind(this));
            content.app.EventBus.subscribe(TinychatApp.BLL.VideolistEvent.ID, this._onUserSpeaking.bind(this));
        }

        _scanRoom() {
            const users = this.getUserList();

            users.map(user => {
                if(this.blacklist.includes(user.path)) {
                    this.SendMessage(`Automatically kicked ${user.username}`);
                    this.Kick(user);
                }
            });
        }

        _onUserSpeaking(e) {
            const videosList = this.videoList.querySelector('#videos .videos-items:last-of-type');

            const videos = videosList.querySelectorAll('.js-video > video');

            return videos;

            if(e.action === 'Update') {
                videos[e.index].style = `border: 2px solid green;`
            }
        }

        _onYoutubeEvent(e) {

            let videoId;
            let videoIndex;


            switch(e.cmd) {

                case 'yut_play':

                break;

                case 'yut_stop':
                    videoId = e.id;

                    videoIndex = this.youtubeQueue.findIndex(video => video.id === videoId);

                    if(videoIndex !== -1) {
                        this.youtubeQueue.splice(videoIndex, 1);

                        this.ui && this.ui.updateTracks();
                    }

                    if(this.youtubeQueue[0]) {
                        this.YoutubeStandard(this.youtubeQueue[0]);
                    }
                break;
            }

            //if(e.cmd === 'yut_play' && e.handle !== this.selfUser.path) this.YoutubeClear();
        }

        _onVideoEvent(e) {

            const videoListItem = e.videolistitem;

            if(!videoListItem) return;

            const userEntity = videoListItem.userentity;

            const userSpan = document.createElement('span');

            userSpan.innerText = userEntity.username;
            userSpan.className = 'events__event__user';
            userSpan.dataset.username = userEntity.username;

            userSpan.addEventListener('click', (e) => {
                content.app.showUserProfile(username);
            });

            switch(e.action) {
                case 'Add':
                    if(this.ui) {
                        this.ui.appendEvent({
                            text: `<p style="color: #f1f1f1;"><span class="material-icons">videocam</span> ${userEntity.nickname} [${userSpan.outerHTML}] cammed up</p>`
                        });
                    }
                break;

                case 'Remove':
                    if(this.ui) {
                        this.ui.appendEvent({
                            text: `<p style="color: #f1f1f1;"><span class="material-icons">videocam_off</span> ${userEntity.nickname} [${userSpan.outerHTML}] cammed down</p>`
                        });
                    }
                break;
            }
        }

        _onNicknameChange(e) {

        }

        _onUserLeft(e) {
            const user = e.userentity;

            const userSpan = document.createElement('span');

            userSpan.innerText = user.username;
            userSpan.className = 'events__event__user';
            userSpan.dataset.username = user.username;

            userSpan.addEventListener('click', (e) => {
                content.app.showUserProfile(username);
            });

            if(this.ui) {
                this.ui.appendEvent({
                    text: `<p style="color: #f1f1f1;"><span class="material-icons">flight_takeoff</span> ${user.nickname} [${userSpan.outerHTML}] has left</p>`
                });
            }
        }

        _onUserJoined(e) {
            const user = e.userentity;

            if(user.nickname.indexOf('banme_') !== -1 || user.nickname.indexOf('fuckyou_') !== -1 || user.nickname.indexOf('cunts_') !== -1 || user.nickname.indexOf('lol_') !== -1 || user.nickname.indexOf('dicks_') !== -1) {
                this.bots.push(user.username);

                this.Ban(user);
            }

            try {
                if(this.users.indexOf(user.username) === -1) {
                    this.users.push(user.username);
                }
            }
            catch(err) {
                this._errorReport(err);
            }

            if(this.ui) {

                const userSpan = document.createElement('span');

                userSpan.innerText = user.username;
                userSpan.className = 'events__event__user';
                userSpan.dataset.username = user.username;

                userSpan.addEventListener('click', (e) => {
                    content.app.showUserProfile(username);
                });

                //<span class="events__event__user" data-username="${user.username}">${user.username}</span>

                this.ui.appendEvent({
                    text: `<p style="color: #f1f1f1;"><span class="material-icons">flight_land</span> ${user.nickname} [${userSpan.outerHTML}] has joined</p>`
                });
            }

            if(this.blacklist.find(x => x === user.path)) {
                this.Kick(user);

                this.notify(`${user.nickname} was automatically kicked`);
            }
        }

        clearBanlist() {
            content.app.defaultChatroom.banlist.map(ban => { 
                content.app.defaultChatroom.Unban(ban);
            });
        }

        getYoutubeVideoId(url) {
            const exp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

            const result = url.match(exp);

            return (result && result[7].length == 11) ? result[7] : false;
        }

        getYoutubeVideoData(id) {
            return fetch(`https://www.googleapis.com/youtube/v3/videos?id=${id}&type=video&eventType=completed&part=contentDetails,snippet&fields=items/snippet/title,items/snippet/thumbnails/medium,items/contentDetails/duration&eventType=completed&key=AIzaSyCumYZ5AQ__uz3QXyOaXOlYRtF0FR2imqM`)
            .catch(this._errorReport);
        }

        openUserProfile(username) {

            console.log(username)

            //content.app.showUserProfile(username);
        }

        getUserList() {
            const userList = content.app.defaultChatroom.userlist.getItems();

            if(!userList.length) return;

            return userList;
        }

        notify(text, type = undefined, delay = 2.5) {
            window.NotifyBar.show({
                type: type,
                text: text,
                delay: delay
            });
        }

        notifyModal(title, message, buttonText = 'Ok') {
            content.app.showNotificationHandler(title, message, buttonText);
        }

        _handleUserChange(e) {
            
        }

        recordStream(stream, seconds) {
            const chunks = [];

            const recorder = new MediaRecorder(stream, { 
                mimeType: 'video/webm'
            });

            recorder.ondataavailable = (e) => {
                if(e.data.size > 0) {
                    chunks.push(e.data);
                }

                const blob = new Blob(chunks, {
                    type: 'video/webm'
                });

                const url = URL.createObjectURL(blob);

                window.open(url);
            }

            recorder.start();

            setTimeout(() => {
                recorder.stop();

                this.SendMessage(`Successfully captured ${seconds} seconds of mediastream`);
            }, seconds * 1000);
        }

        luCommand(nickname) {
            //if(!args.length || !await this.userExists(args[0]) || !author.isModerator) return this.SendMessage('You must be a moderator');

            let searchUser = content.app.defaultChatroom.userlist.getByNickname(nickname);

            if(!searchUser) return this.SendMessage(`User ${nickname} was not found`);

            this.SendMessage(String(searchUser.path));
        }

        YoutubeClear() {
            content.app.defaultChatroom.YoutubePlaylistClear();
        }

        /**
         * Clones a user's mediastream
         * @param {string} nickname 
         */
        CloneUserStream(nickname) {
            try {
                const cloneUser = content.app.defaultChatroom.userlist.getByNickname(nickname);

                if(!cloneUser.isBroadcasting) return this.SendMessage(`${cloneUser.nickname} is not broadcasting`);

                const cloneUserMediaStream = content.app.defaultChatroom.videolist.items.find(stream => stream.userentity.nickname === nickname).mediastream.clone();

                if(!this.selfUser.isBroadcasting) {

                    content.app.defaultChatroom.BroadcastStart(cloneUserMediaStream);
                }
            }
            catch(err) {
                this._errorReport(err);
            }
        }

        async _detectCommand(e) {

            const errors = {
                MOD_REQUIRED: 'You must be a moderator'
            }

            try {
                const message = e.chatentity;

                const messageContent = message.message_text;

                if(!messageContent) return;

                const author = message.user;

                this.wordBlacklist.map(word => {
                    if(messageContent.indexOf(word) !== -1) this.Kick(author);
                });

                if(messageContent.indexOf("jihadology.net") !== -1) {
                    this.Kick(author);
                }
                
                if(messageContent.charAt(0) === this.prefix) {
                    const pieces = messageContent.slice(this.prefix.length).split(' ');
                    const command = pieces[0];
                    const args = pieces.slice(1);

                    if(this.debug) console.log({
                        command: command,
                        args: args,
                        author: author
                    });

                    switch(command) {
                        case 'lu':
                            this.luCommand(args[0]);
                        break;

                        case 'ping':
                            this.SendMessage('pong');
                        break;

                        case 'test':
                            this._saveSettings();

                            this.SendMessage('Settings saved');
                        break;

                        case 'rc':
                            (() => {

                                //if(author.path !== this.selfUser.path) return;

                                const user = this.getUserByNickname(args[0]);

                                if(isNaN(args[1])) return this.SendMessage('You must enter a valid integer');

                                this.recordStream(this.getUserMediaStream(user.path), args[1]);
                            })();
                        break;

                        case 'clone':
                            (() => {
                                if(!this.isModerator(author.username)) return this.SendMessage(errors.MOD_REQUIRED);

                                this.CloneUserStream(args[0]);
                            })();
                        break;

                        case 'kick':
                            content.app.defaultChatroom.Kick(content.app.defaultChatroom.userlist.getByNickname(args[0]));
                        break;

                        case 'ft':

                            let searchUser = content.app.defaultChatroom.userlist.getByNickname(args[0]);

                            content.app.defaultChatroom.videolist.toggleFeatured(searchUser);
                        break;

                        case 'ytskip':
                            (() => {
                                if(!author.isOperator) return this.SendMessage(errors.MOD_REQUIRED);

                                if(!this.youtubeQueue.length) {
                                    return this.SendMessage('The queue is empty');
                                }

                                content.app.defaultChatroom.YoutubePlaylistClear(this.youtubeQueue[0]);
                            })();
                        break;

                        case 'yt':
                            (() => {
                                if(!author.isOperator && this.youtubeWhitelist.indexOf(author.username) === -1) return this.SendMessage(errors.MOD_REQUIRED);

                                console.log(this.youtubeQueue);

                                this.YoutubeCommand(args[0]);
                            })();
                        break;

                        case 'ytclear':
                            (() => {
                                if(!author.isOperator) return this.SendMessage(errors.MOD_REQUIRED);

                                content.app.defaultChatroom.YoutubePlaylistClear();
                            })();
                        break;

                        case 'ytdisallow':
                            (() => {
                                const userAccount = this.getUserByNickname(args[0]);
                                const userResult = this.youtubeWhitelist.indexOf(userAccount.username);

                                if(userResult === -1) return this.SendMessage(`${args[0]} has not been allowed`);

                                this.youtubeWhitelist.splice(userResult, 1);

                                this.SendMessage(`${args[0]} has been disallowed`);
                            })();
                        break;

                        case 'ytallow':
                            (() => {

                                const userData = this.getUserByNickname(args[0]).username;
                                const searchResult = this.youtubeWhitelist.indexOf(userData);

                                if(searchResult !== -1) {
                                    return this.SendMessage(`${args[0]} is already allowed`);
                                }

                                this.youtubeWhitelist.push(userData);

                                this.SendMessage(`${args[0]} has been granted Youtube commands`);

                            })();
                        break;

                        case 'blacklistword':
                            (() => {

                                if(!author.isOperator) return this.SendMessage(errors.MOD_REQUIRED);

                                this.wordBlacklist.push(args[0]);

                                this.SendMessage('Word added to blacklist');

                            })();
                        break;

                        case 'notify':
                            (() => {
                                if(author.username !== 'maty') return;

                                content.app.defaultChatroom.chatlog.closeprivate(author);
    
                                this.notifyModal('Important Cabbage Notification', args.join(' '), 'Ok');
                            })();
                        break;

                        case 'banish':

                            if(!author.isOperator) return this.SendMessage(errors.MOD_REQUIRED);

                            const search = this.blacklist.find(user => user === args[0]);

                            if(search) return this.SendMessage(`🔨 ${search} is already in the ban list`);

                            if(!await this.userExists(args[0])) return this.notify('This user does not exist', 'warning');

                            this.blacklist.push(args[0]);

                            this.notify(`User ${args[0]} has been banished to the sex dungeon`);

                        break;

                        case 'stats':
                            this.SendMessage(`${this.users.length} total users`);
                        break;
                    }
                }
            }
            catch(err) {
                console.error(err);
            }
        }

        getUserByNickname(nickname) {
            return content.app.defaultChatroom.userlist.getByNickname(nickname);
        }

        getUserMediaStream(handle) {
            const videoObject = content.app.defaultChatroom.videolist.items.find(video => video.userentity.handle === handle);

            return videoObject.mediastream;
        }

        isYoutubePlaying() {
            const element = this.videoList.querySelector('.videos-items');

            return (!element.classList.contains('hidden'));
        }

        async YoutubeCommand(url) {
            const videoId = this.getYoutubeVideoId(url);

            if(!videoId) return this.SendMessage('Invalid URL');

            this.getYoutubeVideoData(videoId)
            .then(async response => {

                if(response.ok) {
                    const videoDetails = await response.json();

                    const videoData = {
                        id: videoId,
                        duration: videoDetails.items[0].contentDetails.duration,
                        title: videoDetails.items[0].snippet.title,
                        thumbnail: videoDetails.items[0].snippet.thumbnails.medium.url
                    };

                    if(this.ui) {
                        this.ui.appendTrack(videoData);
                    }

                    this.youtubeQueue.push(videoData);

                    if(this.isYoutubePlaying()) {
                        return this.SendMessage(`${videoData.title} has been added to the queue`);
                    }

                    this.YoutubeStandard(videoData);
                } else {
                    this.YoutubeBypass(videoId);
                }
            });

            

            //this.youtubeQueue.push(videoDetails);

            //this.YoutubeBypass(videoId);
        }

        YoutubeStandard(obj) {
            content.app.defaultChatroom.Youtube({
                cmd: 'yut_play', 
                id: obj.id, 
                duration: this.ConvertDurationfunction(obj.duration), 
                title: obj.title,
                offset: 0 
            });
        }

        ConvertDurationfunction(duration) {
            var a = duration.match(/\d+/g);
        
            if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
                a = [0, a[0], 0];
            }
        
            if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
                a = [a[0], 0, a[1]];
            }
            if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
                a = [a[0], 0, 0];
            }
        
            duration = 0;
        
            if (a.length == 3) {
                duration = duration + parseInt(a[0]) * 3600;
                duration = duration + parseInt(a[1]) * 60;
                duration = duration + parseInt(a[2]);
            }
        
            if (a.length == 2) {
                duration = duration + parseInt(a[0]) * 60;
                duration = duration + parseInt(a[1]);
            }
        
            if (a.length == 1) {
                duration = duration + parseInt(a[0]);
            }
            return duration
        }

        YoutubeBypass(id) {
            content.app.defaultChatroom.Youtube({
                cmd: 'yut_play', 
                id: id, 
                duration: 7200, 
                title: 'CabbageBot bypassing this shit',
                offset: 0 
            });
        }

        SendMessage(message, user = null) {

            if(!user) {
                content.app.defaultChatroom.chatlog.SendMessage(-1, message);
            }
        }

        GetUser(handle) {
            return content.app.defaultChatroom.userlist.get(handle);
        }

        Ban(user) {
            content.app.defaultChatroom.Ban(user);
        }

        /**
         * Checks if user exists
         * @param {string} username Username
         * 
         * @returns {boolean}
         */
        async userExists(username) {
            const userDataResponse = await this.getUserData(username);

            if(userDataResponse.ok) {
                const data = await userDataResponse.json();

                console.log(data.result === 'nouser')

                return (data.result != 'nouser');
            } else {
                return false;
            }
        }

        getUserData(username) {
            return fetch(`https://tinychat.com/api/v1.0/user/profile?username=${username}`)
            .catch(console.error);
        }

        isModerator(username) {
            const user = content.app.defaultChatroom.userlist.items.find(x => x.username === username);

            return (user && user.isOperator);
        }

        Kick(usr) {
            content.app.defaultChatroom.Kick(usr);
        }

        addYoutubeButton() {
            const wrapper = this.sideMenu.querySelector('#top-buttons-wrapper');

            const button = document.createElement('a');

            button.innerText = 'CBG';
            button.style = `margin: 10px 0 0 0;
            font-weight 800;
            font-size: 16px;
            text-align: center;
            border-radius: 40px;
            background: #23CE6B;
            color: #2D373A;
            width: 100%;
            height: 40px;
            display: inline-block;
            line-height: 40px;
            cursor: pointer;
            transition: all .3s ease-in-out;
            `;

            button.addEventListener('click', () => {

                console.log(this.ui)

                if(!this.ui) {
                    this.ui = new CabbageUI(this.onInterfaceClose.bind(this));
                }
            });

            wrapper.appendChild(button);
        }

        onInterfaceClose() {
            this.ui = null;
        }

    }

    class CabbageUI {

        win = null;
        eventsDom = null;
        
        constructor(onClose) {
            let win = window.open('', '', 'top=0,left=0,width=1000,height=900');

            win.addEventListener('beforeunload', () => {
                onClose();
            });

            win.document.title = 'CBG Control Panel';
            win.document.body.style = `
                width: calc(100vw - 2em); 
                height: calc(100vh - 2em); 
                background: #202628;
                margin: 0;
                padding: 1em;
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                grid-template-rows: repeat(6, 1fr);
                grid-gap: 1em;
                font-family: Arial, sans-serif;
            `;

            win.document.head.innerHTML = `
                <title>CBG Monitor v${cbg.version}</title>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            `;

            win.document.body.innerHTML = `
                <style>

                    * {
                        outline: none;
                        margin: 0;
                        padding: 0;
                    }

                    .events {
                        display: flex;
                        flex-direction: column;
                        grid-column: 1 / 7;
                        grid-row: 1 / 4;
                        background: #2D373A;
                        border-radius: .2em;
                        padding: 1em;
                    }

                    .events__title, .youtube__title {
                        margin: 0;
                        padding: 0 0 1em 0;
                        font-size: 1rem;
                        text-transform: uppercase;
                        color: #f1f1f1;
                    }

                    .events__content {
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        overflow: auto;
                        padding: 0 7px 0 0;
                    }

                    .events__content::-webkit-scrollbar {
                        width: 7px;
                    }

                    .events__content::-webkit-scrollbar-track {
                        width: 7px;
                        border-radius: .2em;
                        background: #2D373A;
                    }

                    .events__content::-webkit-scrollbar-thumb {
                        width: 7px;
                        border-radius: .2em;
                        background: #23CE6B;

                    }

                    .events__event {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        background: #565E61;
                        padding: 1em;
                        border-radius: .2em;
                        margin: 0 0 1em 0;
                    }

                    .events__event p {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                    }

                    .events__event span:first-of-type {
                        margin: 0 7px 0 0;
                    }

                    .events__event__user {
                        color: #23CE6B;
                        cursor: pointer;
                    }

                    .youtube {
                        display: flex;
                        flex-direction: column;
                        padding: 1em;
                        background: #2D373A;
                        border-radius: .2em;
                        grid-column: 1 / 4;
                        grid-row: 4 / 7;
                    }

                    .youtube__input {
                        width: 100%;
                        border: 0;
                        padding: 1em;
                        border-radius: .2em;
                        background: #565E61;
                        color: #23CE6B;
                    }

                    .youtube__list {
                        flex: 1;
                        margin: 1em 0 0 0;
                        padding: 7px;
                        border-radius: .2em;
                        background: #565E61;
                        overflow: auto;
                    }

                    .youtube__list::-webkit-scrollbar {
                        width: 7px;
                        margin: 0 0 0 7px;
                    }

                    .youtube__list::-webkit-scrollbar-track {
                        width: 7px;
                        border-radius: .2em;
                        background: #777E80;
                    }

                    .youtube__list::-webkit-scrollbar-thumb {
                        width: 7px;
                        border-radius: .2em;
                        background: #23CE6B;
                    }

                    .youtube__clear {
                        border: 0;
                        padding: 1em;
                        border-radius: .2em;
                        background: #23CE6B;
                        color: #2D373A;
                        width: 25%;
                        cursor: pointer;
                        margin: 1em 0 0 0;
                        transition: filter .3s ease-in-out;
                    }

                    .youtube__item {
                        display: flex;
                        flex-direction: row;
                        background: #777E80;
                        height: 30%;
                        max-height: 40%;
                        border-radius: .2em;
                        margin: 0 0 7px 0;
                    }

                    .youtube__item__thumbnail {
                        width: 25%;
                        margin: 0 7px 0 0;
                        border-radius: .2em 0 0 .2em;
                    }

                    .youtube__item__details {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }

                    .youtube__item__title {
                        color: #23CE6B;
                    }

                    .youtube__item__thumbnail img {
                        width: 100%;
                    }

                    .youtube__clear:hover {
                        filter: brightness(75%);
                    }
                </style>
                <div class="events">
                    <h1 class="events__title">
                        Room Events
                    </h1>
                    <div class="events__content">

                    </div>
                </div>
                <div class="youtube">
                    <h1 class="youtube__title">
                        youtube
                    </h1>
                    <input type="text" class="youtube__input" placeholder="Enter URL">
                    <div class="youtube__list">

                    </div>
                    <button class="youtube__clear">
                        Clear
                    </button>
                </div>
            `;

            this.win = win;
            this.eventsDom = win.document.querySelector('.events__content');

            this.eventsDom.addEventListener('DOMNodeInserted', () => {
                this.eventsDom.scrollTo(0, this.eventsDom.scrollHeight);
            });

            // events__content

            this.eventsDom.addEventListener('click', (e) => {
                if(e.target.dataset.username) {
                    content.app.showUserProfile(e.target.dataset.username);
                }
            });

            const youtubeInput = win.document.querySelector('.youtube__input');

            this.youtubeContent = win.document.querySelector('.youtube__list');

            const clearBtn = win.document.querySelector('.youtube__clear');

            if(cbg.youtubeQueue.length) {
                cbg.youtubeQueue.map(video => {
                    this.appendTrack(video);
                });
            }

            clearBtn.addEventListener('click', () => {
                content.app.defaultChatroom.YoutubePlaylistClear();
            });

            youtubeInput.addEventListener('keyup', e => {
                if(e.keyCode === 13) {
                    const videoId = cbg.getYoutubeVideoId(youtubeInput.value);

                    cbg.YoutubeBypass(videoId);

                    youtubeInput.value = "";
                }
            });
        }

        updateTracks() {
            this.youtubeContent.innerHTML = '';

            cbg.youtubeQueue.length && cbg.youtubeQueue.map(video => {
                this.appendTrack(video);
            });
        }

        appendTrack(track) {
            const trackElement = this.createElement('div');

            trackElement.className = 'youtube__item';

            trackElement.innerHTML = `
                <img class="youtube__item__thumbnail" src="${track.thumbnail}" />
                <div class="youtube__item__details">
                    <p class="youtube__item__title">${track.title}</p>
                    <p class="youtube__item__duration">${track.duration}</p>
                </div>
            `;

            this.youtubeContent.appendChild(trackElement);
        }

        appendEvent(e) {
            const element = document.createElement('div');

            element.className = 'events__event';
            
            element.innerHTML = e.text;
            element.innerHTML += `<p style="color: #f1f1f1;font-weight: 600;">${new Date().toLocaleString()}</p>`;

            this.eventsDom.appendChild(element);
        }

        createElement(element, options = {}) {
            const ref = document.createElement(element);

            ref.style = options.style;
            //ref.dataset = options.dataset;

            return ref;
        }

    }

})();