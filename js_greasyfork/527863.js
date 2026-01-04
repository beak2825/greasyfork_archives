// ==UserScript==
// @name         Unified MPP Bot
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Combined MPP bot with all features
// @author       You
// @match        *://mppclone.com/*
// @match        *://www.multiplayerpiano.com/*
// @match        *://multiplayerpiano.net/*
// @match        *://www.multiplayerpiano.net/*
// @grant        GM_xmlhttpRequest
// @connect      api.telegram.org
// @downloadURL https://update.greasyfork.org/scripts/527863/Unified%20MPP%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/527863/Unified%20MPP%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        telegram: {
            tokens: {
                main: '7413364729:AAEzJTgFQ9ESvx3spFH-3qe1zGDREn9-Qx4',
            },
            channels: {
                main: '-1002202818873',
                stats: '-1002397402159'
            }
        },
        verification: {
            prefix: '_MPNQS_',
            time: 120000,
            banTimes: {
                verification: 0,
                leave: 1800000
            }
        },
        colors: {
            checking: '#ff0000',
            success: ['#ffffff', '#00ff00'],
            failed: '#ff0000'
        },
        updateInterval: 10 * 1000,
        prefix: '✧'
    };

    class UnifiedMPPBot {
        constructor() {
            this.version = '2.0.0';
            this.verificationQueue = new Map();
            this.afkUsers = new Set();
            this.colorTimer = null;
            this.lastStatsUpdate = 0;
            
            this.commands = new Map([
                ['help', this.cmdHelp.bind(this)],
                ['about', this.cmdAbout.bind(this)],
                ['room', this.cmdRoom.bind(this)],
                ['verify', this.cmdVerify.bind(this)],
                ['afk', this.cmdAfk.bind(this)],
                ['back', this.cmdBack.bind(this)]
            ]);
        }

        // Telegram Integration
        async sendTelegramMessage(text, channel = 'main') {
            try {
                await GM_xmlhttpRequest({
                    method: 'POST',
                    url: `https://api.telegram.org/bot${CONFIG.telegram.tokens.main}/sendMessage`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        chat_id: CONFIG.telegram.channels[channel],
                        text: text,
                        parse_mode: 'HTML'
                    })
                });
            } catch (e) {
                console.error('Telegram Error:', e);
            }
        }

        // Room Color Management
        setRoomColor(color) {
            if (!MPP || !MPP.client) return;
            try {
                MPP.client.sendArray([{
                    m: 'room',
                    set: { color: color }
                }]);
            } catch (e) {
                console.error('[Color] Error:', e);
            }
        }

        playSuccessColors() {
            const colors = CONFIG.colors.success;
            let step = 0;
            
            if (this.colorTimer) {
                clearInterval(this.colorTimer);
            }

            const changeColor = () => {
                this.setRoomColor(colors[step % 2]);
                step++;
                if (step >= 4) {
                    clearInterval(this.colorTimer);
                    this.colorTimer = null;
                }
            };

            changeColor();
            this.colorTimer = setInterval(changeColor, 1000);
        }

        // Chat Functions
        sendChat(msg) {
            if (MPP && MPP.chat) {
                MPP.chat.send(msg);
            }
        }

        // Verification System
        startVerification(participant) {
            if (!participant) return;
            if (participant.name.includes(CONFIG.verification.prefix)) {
                this.sendChat(`✅ ${participant.name} уже верифицирован!`);
                return;
            }

            this.setRoomColor(CONFIG.colors.checking);

            const timer = setTimeout(() => {
                if (this.verificationQueue.has(participant._id)) {
                    this.banUser(participant._id, CONFIG.verification.banTimes.verification);
                    this.verificationQueue.delete(participant._id);
                    this.sendChat(`❌ ${participant.name} не прошёл верификацию!`);
                    this.setRoomColor(CONFIG.colors.failed);
                }
            }, CONFIG.verification.time);

            this.verificationQueue.set(participant._id, {
                name: participant.name,
                timer: timer,
                joinTime: Date.now()
            });

            this.sendChat(`⚠️ ${participant.name}, добавьте ${CONFIG.verification.prefix} в ник!`);
            this.sendChat(`⏰ У вас ${CONFIG.verification.time/1000} секунд!`);
            this.sendChat(`❗ Выход = бан на 30 минут!`);
        }

        // User Management
        banUser(userId, duration) {
            if (MPP && MPP.client) {
                MPP.client.sendArray([{
                    m: 'kickban',
                    _id: userId,
                    ms: duration
                }]);
            }
        }

        unbanUser(userId) {
            if (MPP && MPP.client) {
                MPP.client.sendArray([{
                    m: 'unban',
                    _id: userId
                }]);
            }
        }

        // Statistics Collection
        collectStats() {
            if (!MPP || !MPP.client || !MPP.client.ppl) return null;

            const players = Object.values(MPP.client.ppl);
            const total = players.length;
            let afkCount = this.afkUsers.size;
            let botCount = players.filter(p => 
                p.name && (
                    p.name.toLowerCase().includes('bot') ||
                    p.name.match(/\[bot\]/i) ||
                    p.name.match(/\(bot\)/i)
                )
            ).length;

            return {
                total,
                active: total - afkCount - botCount,
                afk: afkCount,
                bots: botCount
            };
        }

        // Command Handlers
        cmdHelp() {
            this.sendChat('📌 Commands: /help, /about, /room, /verify, /afk, /back');
        }

        cmdAbout() {
            this.sendChat(`🤖 Unified MPP Bot v${this.version}`);
        }

        cmdRoom() {
            const users = Object.keys(MPP.client.ppl).length;
            this.sendChat(`🎹 Room: ${MPP.client.channel._id} | 👥 Users: ${users}`);
        }

        cmdVerify(participant) {
            this.startVerification(participant);
        }

        cmdAfk(participant) {
            if (!this.afkUsers.has(participant._id)) {
                this.afkUsers.add(participant._id);
                this.sendChat(`💤 ${participant.name} теперь отошёл`);
            }
        }

        cmdBack(participant) {
            if (this.afkUsers.has(participant._id)) {
                this.afkUsers.delete(participant._id);
                this.sendChat(`👋 ${participant.name} вернулся`);
            }
        }

        // Event Handlers
        handleCommand(msg) {
            if (!msg.a.startsWith('/')) return;
            
            const command = msg.a.substring(1).toLowerCase();
            const handler = this.commands.get(command);
            
            if (handler) {
                handler(msg.p);
            }
        }

        setupListeners() {
            MPP.client.on('a', (msg) => {
                if (!msg.p || !msg.a) return;

                // Command handling
                if (msg.a.startsWith('/')) {
                    this.handleCommand(msg);
                }

                // Log chat messages to Telegram
                this.sendTelegramMessage(
                    `💬 Chat Message\n` +
                    `├ From: ${msg.p.name}\n` +
                    `└ Text: ${msg.a}`
                );
            });

            // Verification system
            MPP.client.on('participant added', (participant) => {
                this.startVerification(participant);
                this.sendTelegramMessage(
                    `👋 User Joined\n` +
                    `├ Name: ${participant.name}\n` +
                    `└ ID: ${participant._id}`
                );
            });

            MPP.client.on('participant update', (participant) => {
                if (this.verificationQueue.has(participant._id)) {
                    if (participant.name.includes(CONFIG.verification.prefix)) {
                        clearTimeout(this.verificationQueue.get(participant._id).timer);
                        this.verificationQueue.delete(participant._id);
                        this.sendChat(`✅ ${participant.name} верифицирован!`);
                        this.playSuccessColors();
                    }
                }
            });

            MPP.client.on('participant removed', (participant) => {
                if (this.verificationQueue.has(participant._id)) {
                    clearTimeout(this.verificationQueue.get(participant._id).timer);
                    this.verificationQueue.delete(participant._id);
                    this.banUser(participant._id, CONFIG.verification.banTimes.leave);
                    this.sendChat(`🚫 ${participant.name} вышел во время проверки (бан 30 минут)`);
                    this.setRoomColor(CONFIG.colors.failed);
                }

                this.sendTelegramMessage(
                    `🚶 User Left\n` +
                    `├ Name: ${participant.name}\n` +
                    `└ ID: ${participant._id}`
                );
            });

            // Statistics reporting
            setInterval(() => {
                if (Date.now() - this.lastStatsUpdate >= CONFIG.updateInterval) {
                    const stats = this.collectStats();
                    if (stats) {
                        this.sendTelegramMessage(
                            `📊 MPP Statistics:\n` +
                            `👥 Total Players: ${stats.total}\n` +
                            `👤 Active Players: ${stats.active}\n` +
                            `😴 AFK Players: ${stats.afk}\n` +
                            `🤖 Bots: ${stats.bots}\n` +
                            `🕒 Time: ${new Date().toLocaleString()}`,
                            'stats'
                        );
                        this.lastStatsUpdate = Date.now();
                    }
                }
            }, CONFIG.updateInterval);
        }

        start() {
            this.setupListeners();
            console.log(`[Unified MPP Bot] v${this.version} started`);
            this.sendTelegramMessage(`🤖 Unified MPP Bot v${this.version} started`);
        }
    }

    // Wait for MPP to initialize
    const waitForMPP = setInterval(() => {
        if (typeof MPP === "undefined" || !MPP.client || !MPP.client.on) return;
        clearInterval(waitForMPP);
        window.unifiedBot = new UnifiedMPPBot();
        window.unifiedBot.start();
    }, 100);
})();