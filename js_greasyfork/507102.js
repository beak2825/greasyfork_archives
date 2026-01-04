// ==UserScript==
// @name        40 bot script (no vpn required)
// @namespace   -
// @version     1.0.1
// @description simple moomoo.io script that allows you to use bots
// @author      me mega noob
// @match       *://sandbox.moomoo.io/*
// @require     https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/507102/40%20bot%20script%20%28no%20vpn%20required%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507102/40%20bot%20script%20%28no%20vpn%20required%29.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Nombres personalizados para los bots
    const botNames = ["supaman", "megawashere", "welcome", "tomy", "nextvideo", "on moomoo", "cowgame"].map(e => e.slice(0, 15));

    let socket;
    let wsAddress = "";
    let playerSID = null;
    let player = { x: 0, y: 0, team: null };
    let nearestEnemy = null;
    let allEnemies = [];

    class Bot {
        constructor(amount, ws) {
            this.socket = ws;
            this.amount = amount;

            this.socket.onopen = () => this.requestBots(this.amount);
            this.socket.onmessage = (msg) => {
                const message = JSON.parse(msg.data);
                if (message.type === "canSendNow") {
                    this.requestBots(this.amount);
                }
            };
        }

        async requestBots(amount) {
            const tokens = await this.getTokens(amount);
            this.send({ type: "add", ip: wsAddress, tokens });
        }

        getTokens(amount) {
            const tokenPromises = Array.from({ length: amount }, () =>
                new Promise((resolve, reject) => {
                    window.grecaptcha.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", { action: "homepage" })
                        .then(token => resolve("re:" + encodeURIComponent(token)))
                        .catch(reject);
                })
            );
            return Promise.all(tokenPromises);
        }

        send(data) {
            if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify(data));
            }
        }
    }

    class BotManager {
        constructor() {
            this.projects = ["large-shadowed-hoof", "cooperative-vanilla-hydrofoil", "lowly-discovered-agenda", "balanced-instinctive-mantis", "splashy-dusty-snout"];
            this.bots = [];
        }

        spawn(amount) {
            this.projects.forEach((projectLink, i) => {
                if (amount <= 0) return;
                const ws = new WebSocket(`wss://${projectLink}.glitch.me/`);
                this.bots.push(new Bot(Math.min(amount, 4), ws));
                amount -= 4;
            });
        }

        destroy() {
            this.bots.forEach(bot => bot.socket.close());
            this.bots = [];
        }

        update() {
            this.bots.forEach(bot => {
                if (bot.socket.readyState === WebSocket.OPEN) {
                    bot.send({
                        type: "update",
                        msg: {
                            owner: { x: player.x, y: player.y, team: player.team, enemy: nearestEnemy },
                            botNames
                        }
                    });
                }
            });
        }
    }

    const botManager = new BotManager();

    function getDistance(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    document.addEventListener("keydown", e => {
        if (e.key === ".") {
            botManager.bots.forEach(bot => {
                if (bot.socket.readyState === WebSocket.OPEN) {
                    bot.send({ type: "sync" });
                }
            });
        }
    });

    WebSocket.prototype.oldSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(msg) {
        if (!socket && this.url.includes("moomoo.io")) {
            socket = this;
            this.addEventListener("message", msg => {
                const data = new Uint8Array(msg.data);
                const parsed = window.msgpack.decode(data);
                const type = parsed[0];
                const messageData = parsed[1];

                if (type === "C") {
                    playerSID = messageData[0];
                } else if (type === "a") {
                    allEnemies = [];
                    nearestEnemy = null;

                    for (let i = 0; i < messageData[0].length;) {
                        const team = messageData[0][i + 7];
                        if (messageData[0][i] === playerSID) {
                            player.x = messageData[0][i + 1];
                            player.y = messageData[0][i + 2];
                            player.team = team;
                        } else if (!(messageData[0][i] === playerSID || (team && team === player.team))) {
                            allEnemies.push({ x: messageData[0][i + 1], y: messageData[0][i + 2] });
                        }
                        i += 13;
                    }

                    if (allEnemies.length) {
                        nearestEnemy = allEnemies.reduce((closest, enemy) =>
                            getDistance(enemy, player) < getDistance(closest, player) ? enemy : closest, allEnemies[0]
                        );
                    }

                    botManager.update();
                }
            });

            wsAddress = this.url.split("/?token")[0];
        }

        const parsedData = new Uint8Array(msg);
        const parsedMessage = window.msgpack.decode(parsedData);
        const type = parsedMessage[0];
        const messageContent = parsedMessage[1];

        if (type === "6") {
            const chatMsg = messageContent[0];
            if (chatMsg.startsWith("!spawn ")) {
                const amount = Math.min(parseInt(chatMsg.split("!spawn ")[1]), 38);
                botManager.spawn(amount);
            } else if (chatMsg === "!dc") {
                botManager.destroy();
            }
        }

        this.oldSend(msg);
    };
})();