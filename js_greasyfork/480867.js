// ==UserScript==
// @name         Gats.io - 🥷 Cheat Menu (Chandler) 🥷
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!, can be updated at any time.
// @author       Chandler Ax
// @match        https://gats.io/
// @match        https://gats2.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gats.io
// @license      No licence.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480867/Gatsio%20-%20%F0%9F%A5%B7%20Cheat%20Menu%20%28Chandler%29%20%F0%9F%A5%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/480867/Gatsio%20-%20%F0%9F%A5%B7%20Cheat%20Menu%20%28Chandler%29%20%F0%9F%A5%B7.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let server_size = 81;

    let ui = `
    <div class="player_container"></div>
    <div class="player_alert" style="display: none;">/</div>
    <style>
        .player_container {
            position: absolute;
            left: 1vh;
            top: 55%;
            transform: translate(0, -50%);
            width: 25vh;
            height: 45vh;
            background-color: rgba(250, 246, 246, 0.5);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
            z-index: 2;
        }

        .player-list {
            overflow-y: auto;
            max-height: 100%;
        }

        .player-item {
            background-color: #fff;
            margin-bottom: 8px;
            padding: 10px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .player-item.me {
            background-color: #ffd700;
        }

        .attack-button {
            background-color: #ff4500;
            color: #fff;
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .defense-button {
            background-color: #3498db;
            color: #fff;
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    </style>
`;

    let element_ui = document.createElement("div");
    element_ui.innerHTML = ui;
    document.body.appendChild(element_ui);

    let canvas = document.getElementById("canvas");
    let canvas_1 = document.createElement("canvas");
    canvas_1.style.zIndex = 10;
    canvas_1.style.position = "absolute";
    document.getElementsByTagName("body")[0].appendChild(canvas_1);
    let canvas_ovarlay = canvas_1.getContext("2d");

    setInterval(() => {
        const player = RD.pool[c3];
        let enemies = Object.values(RD.pool).filter((player) => player.activated && player.id !== RD.pool[c3].id && (!player.teamCode || player.teamCode !== RD.pool[c3].teamCode) && player.hp > 0);

        if (player !== undefined && player.hp > 0) {
            RF.list[0].socket.send(`c, `);
            RF.list[0].socket.send(`c,{X: ${player.x} | Y: ${player.y}}`);
            const current_players = [];

            for (let i = 0; i < server_size; i++) {
                RD.pool[i].ghillie = 0;
                if (RD.pool[i].username !== "" && RD.pool[i].teamCode !== player.teamCode) {
                    current_players.push(RD.pool[i].username);
                }
                if (RD.pool[i].username !== "" && RD.pool[i].teamCode == player.teamCode) {
                    // player sn the same team
                }
            }

            const players_element = document.querySelector(".player_container");
            players_element.innerHTML = "";

            const player_element = document.createElement("div");
            player_element.className = "player-item me";
            player_element.textContent = `1. ${player.username}`;

            const defense_element = document.createElement("button");
            defense_element.className = "defense-button";
            defense_element.textContent = "Defense";
            defense_element.addEventListener("click", () => defense_me());

            player_element.appendChild(defense_element);
            players_element.appendChild(player_element);

            const playerList = document.createElement("div");
            playerList.className = "player-list";

            current_players.forEach((username, index) => {
                const player_element = document.createElement("div");
                player_element.className = "player-item";
                player_element.textContent = `${index + 2}. ${username}`;

                const attack_element = document.createElement("button");
                attack_element.className = "attack-button";
                attack_element.textContent = "Attack";
                attack_element.addEventListener("click", () => attack_player(username));

                player_element.appendChild(attack_element);
                playerList.appendChild(player_element);
            });
            player.isLeader = 1;
            player.isPremiumMember = 1;
            player.color.a = "gold";
            canvas_1.width = canvas.width;
            canvas_1.height = canvas.height;
            let plr_screen_position = c2.getRelPos(RD.pool[c3]);
            plr_screen_position.x *= j5;
            plr_screen_position.y *= j5;
            canvas_ovarlay.strokeStyle = "blue";
            canvas_ovarlay.lineWidth = 2;
            canvas_ovarlay.clearRect(0, 0, canvas_1.width, canvas_1.height);
            for (let i = 0; i < enemies.length; i++) {
                let diX = enemies[i].x - RD.pool[c3].x + plr_screen_position.x;
                let diY = enemies[i].y - RD.pool[c3].y + plr_screen_position.y;
                canvas_ovarlay.strokeRect(diX - 30 / 2, diY - 30 / 2, 30, 30);
                a57({ clientX: diX, clientY: diY });
            }
            players_element.appendChild(playerList);
        } else {
            canvas_1.width = 0;
            canvas_1.height = 0;
        }
    }, 30);

    window.addEventListener("wheel", function (event_packet) {
        let sens_base = 1;

        if (Math.sign(event_packet.deltaY) == 1) {
            j7 *= sens_base + 0.05;
            j8 *= sens_base + 0.05;
            a1();
        }

        if (Math.sign(event_packet.deltaY) == -1) {
            j7 *= sens_base - 1 + 0.95;
            j8 *= sens_base - 1 + 0.95;
            a1();
        }
    });

    let message_mem = true;

    const showMessage = (data) => {
        if (!message_mem) return;
        const message_element = document.querySelector(".player_alert");
        message_element.style.display = "block";
        message_element.innerHTML = data;
        message_mem = false;

        setTimeout(() => {
            message_element.style.display = "none";
            message_element.innerHTML = "/";
            message_mem = true;
        }, 3000);
    };

    const attack_player = (user) => {
        console.log(user);
    };

    const defense_me = () => {
        console.log(RD.pool[c3].username);
    };
})();