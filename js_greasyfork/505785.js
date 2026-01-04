// ==UserScript==
// @name         pokerpatio websockets with button
// @namespace    https://pokerpatio.com/
// @version      2024-08-32
// @description  differnet
// @author       king
// @match        https://pokerpatio.com/pg?*
// @match        https://pokerpatio.com/mp?game=*
// @icon         https://pokerpatio.com/mp/favicon-32x32.png?v=118202401
// @run-at       document_end
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/505785/pokerpatio%20websockets%20with%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/505785/pokerpatio%20websockets%20with%20button.meta.js
// ==/UserScript==
/* global io */


(function() {
    'use strict';

    window.immune = true;
    window.injectors = {};

    class SocketInjector {
        constructor(GameManager, token) {
            this.GameManager = GameManager;
            this.token = token;
            this.socket = null;
            this.initializeSocket();
            this.openSocket();
            this.joined = false;
            this.pending = {};
            this.seat = "NONE";
        }

        initializeSocket() {
            let t = window.location.origin;
            const port = window.location.port;
            const path = window.location.pathname;

            const e = "/mp/socket.io"; //this.clientConfig.mpUrlPage + /socket.io

            if (port && port !== "1") {
                t = t.replace(":" + port, "");
                t += ":" + port + path;
            } else {
                t += path;
            }

            const socketOptions = {
                autoConnect: false,
                path: e,
                transports: ["websocket"]
            };

            const s = window.location.origin.includes("localhost")
            ? window.location.origin
            : "https://play.pokerpatio.com"; //: this.clientConfig.socketOrigin

            this.socket = io(s, socketOptions);

            this.setupSocketListeners();
        }

        setupSocketListeners() {
            this.socket.on("connect", () => {
                this.socket.emit("authentication", {
                    token: this.token,
                    username: false,
                    tableType: this.GameManager.data.tableType
                });
            });

            this.socket.on("authenticated", (e) => {
                if (!this.joined) {
                    this.socket.emit("room:join", {
                        roomId: this.GameManager.data.getParams.game
                    }, (e, a) => {
                    });
                    this.joined = true;
                }
            });

            this.socket.on("game:update_card_data", async function(e) {
                window.GameManager.cards.addOrUpdateCardData(e.cardData);
            });

            this.socket.on("room:get", (e) => {
                if (e.data.players[this.token]) {
                    this.seat = e.data.players[this.token].seatedAtPos;
                }
            });

            this.socket.on("game:player_turn_started", (e) => {
                if(e.playerPos == this.seat) {
                    if (this.pending.actionType) { //format for pending {"actionType": "x", "otherParams": xx}
                        console.log(e);
                        let data = {
                            "actionType": this.pending.actionType,
                            "playerID": e.playerID,
                            "playerPos": e.playerPos
                        }
                        if (this.pending.raiseAmount) { data.raiseAmount = this.pending.raiseAmount };
                        this.emit("player:game:perform_action", data);
                        this.pending = {};
                    }
                }
            });
        }
        emit(c, d) {
            if(this.socket) {
                    this.socket.emit(c, d, (e, a) => {
                    });
            }
        }

        openSocket() {
            if (this.socket) {
                this.socket.open();
            }
        }
        closeSocket() {
            if (this.socket) {
                this.socket.disconnect();
                this.socket = null; // Optionally set the socket to null after disconnecting
            }
        }
    }
    class Controls {
        takeAdmin() {
            Object.values(window.injectors).forEach((s) => {s.emit("admin:room:transfer_admin_rights",{"userId":window.GameManager.playerData.id,"newAdminUsername":window.GameManager.playerData.username,"fromExitPopup":false})});
        }

        forceLeave() {
            Object.values(window.injectors).forEach((s) => {s.emit("player:room:exit_lobby")});
        }

        emitAll(c, d) {
            Object.values(window.injectors).forEach((s) => {s.emit(c, d)});
        }

        pendAction(id, d) {
            window.injectors[id].pending = d;
        }

        pendActionAll(d) {
            Object.values(window.injectors).forEach((s) => {s.pending = d});
        }
    }

    function updateInjectors() {
        if (!this) {
            return;
        }
        if (!this.GameManager) {
            return;
        }
        if (!this.GameManager.game.content.players) {
            let injector_keys = Object.keys(window.injectors);
            injector_keys.forEach((k) => {
                window.injectors[k].closeSocket();
                delete window.injectors[k];
            });
            return;
        }
        let players = this.GameManager.game.content.players.map((p) => p.authUserId).filter((a) => a != window.GameManager.playerData.id);
        let injector_keys = Object.keys(window.injectors);
        injector_keys.forEach((k) => {
            if(!(players.includes(k))) {
                window.injectors[k].closeSocket();
                delete window.injectors[k];
            }
        });

        players.forEach((p) => {
            if(!(p in window.injectors)) {
                window.injectors[p] = new SocketInjector(this.GameManager, p);
            }
        });
    }

    setInterval(updateInjectors, 3000);
    setInterval(()=>{window.GameManager && window.GameManager.game && window.GameManager.game.showRemainingPlayersCards()}, 300);
/*    setInterval( function () {
        window.GameManager && window.GameManager.game && window.GameManager.game.content.players && window.GameManager.game.content.players.forEach((e)=> {
            window.GameManager.game.evaluatePlayerHand(e);
            let t = window.GameManager.handsEvaluator.winTypes[e.evaluationResult.winType];
            if(t) {
                let a = window.GameManager.domRefs.$contentHolder.find("#layoutContent .player.pos-type-" + e.posType).find(".best-hand");
                a.html(t.name + " (" + e.evaluationResult.winHighestValue + ")").addClass("shown").get();
            };
        });
    }, 900); */

    window.controls = new Controls;

    // Add CSS for the button and menu
 const style = document.createElement('style');
    style.textContent = `
        #myMenuButton {
            position: fixed;
            top: 20px; /* Distance from the top edge */
            right: 20px; /* Distance from the right edge */
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 24px;
            text-align: center;
            line-height: 50px;
            cursor: pointer;
            z-index: 9999;
        }
        #myMenu {
            display: none;
            position: absolute;
            top: 80px; /* Positioned below the button */
            right: 20px; /* Align with the button */
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 9999;
        }
        #myMenu a {
            display: block;
            padding: 10px;
            color: #007bff;
            text-decoration: none;
            border-bottom: 1px solid #ddd;
        }
        #myMenu a:last-child {
            border-bottom: none;
        }
        #myMenu a:hover {
            background-color: #f8f9fa;
        }
    `;
    document.head.appendChild(style);

    // Create and style the new button
    const button = document.createElement('button');
    button.id = 'myMenuButton';
    button.textContent = '☰'; // Three horizontal lines icon
    document.body.appendChild(button);

    // Create and style the menu
    const menu = document.createElement('div');
    menu.id = 'myMenu';
    menu.innerHTML = `
        <a href="#" data-action="Fold_C">Fold Current</a>
        <a href="#" data-action="All_In_C">All In Current</a>
        <a href="#" data-action="Change_User_C">Change Username Current</a>
        <a href="#" data-action="Fold_A">Fold All</a>
        <a href="#" data-action="All_In_A">All In All</a>
        <a href="#" data-action="Change_User_A">Change Username All</a>
        <a href="#" data-action="Take_Admin">Take Admin (Private Only)</a>

    `;
    document.body.appendChild(menu);

    // Toggle menu visibility
    button.addEventListener('click', () => {
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    }, { passive: true });

    // Handle menu item clicks
    menu.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            const action = event.target.getAttribute('data-action');
            const current_player = window.injectors[window.GameManager.playerTurn.player.authUserId];
            switch(action) {
                case "Fold_C":
                    current_player.emit("player:game:perform_action", {"actionType": "fold"});
                    break;
                case "All_In_C":
                    current_player.emit("player:game:perform_action", {"actionType": "raise", "raiseAmount": 1000000});
                    break;
                case "Change_User_C":
                    current_player.emit("room:set_username",{"roomId":window.GameManager.room.isInRoomId,"username":prompt("What username?"),"firstTimeUsernamePrompt":true,"autoSeat":true});
                    break;
                case "Fold_A":
                    window.controls.pendActionAll({"actionType": "fold"});
                    break;
                case "All_In_A":
                    window.controls.pendActionAll({"actionType": "raise", "raiseAmount": 100000});
                    break;
                case "Change_User_A":
                    window.controls.emitAll("room:set_username",{"roomId":window.GameManager.room.isInRoomId,"username": (prompt("What username?") + " " + Math.random() * 10000000000).substr(0,12),"firstTimeUsernamePrompt":true,"autoSeat":true})
                    break;
                case "Take_Admin":
                    window.controls.takeAdmin();
                    break;
            }
            menu.style.display = 'none'; // Close the menu
        }
    }, { passive: true });

    // Close menu if clicked outside
    document.addEventListener('click', (event) => {
        if (!button.contains(event.target) && !menu.contains(event.target)) {
            menu.style.display = 'none';
        }
    }, { passive: true });

    window.socketInj = SocketInjector;

})();