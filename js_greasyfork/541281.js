// ==UserScript==
// @name         TorrentBD Shoutbox Notifier
// @namespace    https://greasyfork.org/en/users/1455164-goodfellow
// @version      1.0
// @description  Smart notifications for TorrentBD shoutbox with different sounds for messages and announcements
// @match        https://www.torrentbd.net/*
// @match        https://www.torrentbd.com/*
// @match        https://www.torrentbd.me/*
// @icon         https://www.torrentbd.net/themes/material/static/favicon/favicon-32x32.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541281/TorrentBD%20Shoutbox%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/541281/TorrentBD%20Shoutbox%20Notifier.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const config = {
        regularSound: "https://assets.mixkit.co/active_storage/sfx/2863/2863.wav",
        announcementSound: "https://assets.mixkit.co/active_storage/sfx/2575/2575.wav",
        volume: 0.3,
        checkInterval: 1000,
        debug: true
    };
 
    // Audio system with interaction requirement
    const audioSystem = {
        initialized: false,
        allowed: false,
 
        init() {
            this.regular = this.createAudio(config.regularSound);
            this.announcement = this.createAudio(config.announcementSound);
            this.setupInteractionListener();
            this.initialized = true;
        },
 
        createAudio(src) {
            const audio = new Audio(src);
            audio.volume = config.volume;
            audio.preload = 'auto';
            return audio;
        },
 
        setupInteractionListener() {
            const enableAudio = () => {
                this.allowed = true;
                if (config.debug) console.log('Audio playback enabled by user interaction');
                document.removeEventListener('click', enableAudio);
            };
            document.addEventListener('click', enableAudio);
        },
 
        play(type) {
            if (!this.allowed) {
                if (config.debug) console.log('Audio blocked - waiting for user interaction');
                return;
            }
 
            try {
                const audio = this[type];
                audio.currentTime = 0;
                audio.play().catch(e => {
                    if (config.debug) console.log('Audio play failed:', e.message);
                });
            } catch (e) {
                if (config.debug) console.log('Audio error:', e.message);
            }
        }
    };
    audioSystem.init();
 
    const state = {
        lastMessageId: 0,
        currentUsername: null,
        init() {
            this.currentUsername = this.detectUsername();
            if (config.debug) {
                console.log('Current user:', this.currentUsername || 'Not detected');
            }
        },
        detectUsername() {
            const selectors = [
                '.card-reveal .card-title',
                '.user-menu-username',
                '.shout-item .shout-user a span.tbdrank'
            ];
 
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    const username = element.textContent
                        .replace('close', '')
                        .trim();
                    if (username) return username;
                }
            }
            return null;
        }
    };
    state.init();
 
    const messageProcessor = {
        isAnnouncement(messageElement) {
            if (!messageElement) return false;
            const textElement = messageElement.querySelector('.shout-text');
            if (!textElement) return false;
 
            const text = textElement.textContent;
            return [
                'New Forum Post',
                'New Forum Topic',
                'New Torrent',
                'New Request'
            ].some(phrase => text.includes(phrase));
        },
 
        isOwnMessage(messageElement) {
            if (!state.currentUsername || !messageElement) return false;
 
            const usernameElement = messageElement.querySelector('.shout-user span.tbdrank');
            if (usernameElement && usernameElement.textContent.includes(state.currentUsername)) {
                return true;
            }
 
            const profilePopup = messageElement.querySelector('.dl-sc-block');
            if (profilePopup && profilePopup.textContent.includes(state.currentUsername)) {
                return true;
            }
 
            return false;
        },
 
        getLatestMessageId() {
            const messages = document.querySelectorAll('#shouts-container .shout-item');
            for (const msg of messages) {
                if (!this.isOwnMessage(msg)) {
                    const msgId = msg.id.replace('shout-', '');
                    return parseInt(msgId, 10) || 0;
                }
            }
            return 0;
        },
 
        checkNewMessages() {
            try {
                const messages = document.querySelectorAll('#shouts-container .shout-item');
                if (!messages.length) return;
 
                const latestMessage = messages[0];
                const currentId = parseInt(latestMessage.id.replace('shout-', ''), 10) || 0;
 
                if (currentId > state.lastMessageId) {
                    if (!this.isOwnMessage(latestMessage)) {
                        const type = this.isAnnouncement(latestMessage) ? 'announcement' : 'regular';
                        if (config.debug) {
                            console.log(`New ${type} message (ID: ${currentId})`);
                        }
                        audioSystem.play(type);
                    } else if (config.debug) {
                        console.log("Ignoring own message (ID:", currentId + ")");
                    }
                    state.lastMessageId = currentId;
                }
            } catch (e) {
                if (config.debug) console.log('Message processing error:', e.message);
            }
        }
    };
 
    function initShoutboxObserver() {
        const shoutbox = document.getElementById('shouts-container');
        if (shoutbox) {
            state.lastMessageId = messageProcessor.getLatestMessageId();
            setInterval(() => messageProcessor.checkNewMessages(), config.checkInterval);
 
            if (config.debug) {
                console.log('🔔 Shoutbox notifier activated');
                console.log('🔊 Sound system ready (click page to enable audio)');
            }
        } else {
            if (config.debug) console.log('Shoutbox not found, retrying...');
            setTimeout(initShoutboxObserver, 2000);
        }
    }
 
    // Start the script
    if (document.readyState === 'complete') {
        initShoutboxObserver();
    } else {
        window.addEventListener('load', initShoutboxObserver);
    }
 
    // Debug helper
    if (config.debug) {
        window.torrentbdNotifier = {
            config,
            state,
            audioSystem,
            messageProcessor,
            forcePlay: (type) => {
                audioSystem.allowed = true;
                audioSystem.play(type);
            }
        };
        console.log('Debug mode active - click anywhere to enable audio');
        console.log('Or use torrentbdNotifier.forcePlay("regular") in console');
    }
})();