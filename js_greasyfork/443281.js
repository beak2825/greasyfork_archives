
// ==UserScript==
// @name         working send alt :) join for more op https://discord.gg/up9kk6ZK
// @namespace    -
// @version      BETA.3
// @description  working send alt , raid alts leaked by trollers sever             https://discord.gg/up9kk6ZK
// @author       Liqwyd 
// @match        zombs.io
// @license      MIT
// @icon         https://cdn.discordapp.com/channel-icons/855622511553937429/c4ae7994d1bf46c69d63bd08ff302745.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443281/working%20send%20alt%20%3A%29%20join%20for%20more%20op%20https%3Adiscordggup9kk6ZK.user.js
// @updateURL https://update.greasyfork.org/scripts/443281/working%20send%20alt%20%3A%29%20join%20for%20more%20op%20https%3Adiscordggup9kk6ZK.meta.js
// ==/UserScript==

function thing() {
    if (location.hash.includes("noscript")) {
        return;
    }

    document.title = 'Person';
    document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
    document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
    document.querySelectorAll('.ad-unit, .hud-intro-youtuber, .hud-intro-footer, .hud-intro-stone, .hud-intro-tree, hud-respawn-corner-bottom-left, .hud-intro-social, .hud-intro-more-games, .hud-intro-form > label, .hud-intro-stone, .hud-intro-tree, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right').forEach(el => el.remove());

    document.getElementsByClassName('hud-intro-form')[0].insertAdjacentHTML('beforeend', `
    <select class="btn" style="width: 100%; height: 50px; margin: 10px 0px 0px 0px;" id="sesVal">
<option value="none">No Session</option>
<option value="ses1">Session 1</option>
<option value="ses2">Session 2</option>
<option value="ses3">Session 3</option>
<option value="ses4">Session 4</option>
</select>
<div style="width: 100%; height: 50px; margin: 10px 0px 0px 0px;" class="btn btn-facebook">
<div style="margin-top: -8px;">
<p style="display: inline-block;">Record Session?</p>
<input type="checkbox" style="display: inline-block;" id="recordSession" />
</div>
</div>
    `)

    let sesOn = false;

    let sessionUrl = "SessionSaver.iwebbysaregod.repl.co";

    JSON.safeStringify = (obj, indent = 2) => {
        let cache = [];
        const retVal = JSON.stringify(
            obj,
            (key, value) =>
            typeof value === "object" && value !== null ?
            cache.includes(value) ?
            undefined // Duplicate reference found, discard key
            :
            cache.push(value) && value // Store value in our collection
            :
            value,
            indent
        );
        cache = null;
        return retVal;
    };

    game.network.connect2 = game.network.connect
    game.network.connect = options => {
        if (document.getElementById('sesVal').value !== "none") {
            let sesWs = new WebSocket(`wss://${sessionUrl}`)
            if (document.getElementById('recordSession').checked) {
                sesWs.onopen = () => {
                    sesWs.send(JSON.stringify({
                        sessionId: document.getElementById('sesVal').value,
                        type: "init",
                        o: "record"
                    }))
                    const oo = () => {
                        game.network.addEntityUpdateHandler(data => {
                            let newEntities = {};
                            for (let i in data.entities) {
                                if (!game.world.entities[i]) {
                                    continue;
                                };
                                newEntities[i] = {};
                                for (let entry of Object.entries(game.world.entities[i].targetTick)) {
                                    newEntities[i][entry[0]] = entry[1];
                                };
                                /*
                                newEntities[i] = {};
                                for(let p in game.world.entities[i].targetTick) {
                                    newEntities[i][p] = game.world.entities[i].targetTick[p]
                                };
                                */
                            };
                            console.log(newEntities)
                            sesWs.send(JSON.stringify({
                                type: "data",
                                o: "record",
                                playerTick: game.world.localPlayer.entity.targetTick,
                                entities: JSON.stringify(newEntities),
                                sesId: document.getElementById('sesVal').value
                            }))
                        })
                    };

                    if (game.world.inWorld) {
                        oo();
                    } else {
                        game.network.addEnterWorldHandler(oo);
                    };
                };
                sesWs.onclose = e => {
                    alert(e.reason);
                    console.log("ws closed");
                };
                game.network.connect2(options);
                return;
            } else {
                sesWs.onopen = () => {
                    sesWs.send(JSON.stringify({
                        sessionId: document.getElementById('sesVal').value,
                        type: "init",
                        o: "get"
                    }))
                    let hasEnteredWorld = false;
                    sesWs.onmessage = msg => {
                        let data = JSON.parse(msg.data);
                        if (data.type == "data") {
                            if (data.o == "get") {
                                if (!hasEnteredWorld) {
                                    hasEnteredWorld = true;
                                    game.world.onEnterWorld({
                                        allowed: true
                                    });
                                    game.ui.components.Intro.onEnterWorld({
                                        allowed: true
                                    })
                                    game.world.init();
                                };
                                data.data.entities = JSON.parse(data.data.entities)
                                /*
                                let newEntities = {};
                                for(let o of Object.values(data.data.entities)) {
                                    if(o == true) { continue; };
                                    newEntities[o.uid] = o;
                                };
                                console.log(newEntities);
                                */

                                //console.log(data.data.entities)

                                game.renderer.lookAtPosition(data.data.tick.position.x, data.data.tick.position.y)

                                //for (let uid in game.world.entities) {
                                /*
                                    if (!(uid in data.data.entities)) {
                                        game.world.removeEntity(uid);
                                    } else if (data.data.entities[uid] !== true) {
                                        game.world.updateEntity(uid, data.data.entities[uid]);
                                    } else {
                                        game.world.updateEntity(uid, game.world.entities[uid].getTargetTick());
                                    }
                                    */
                                //}

                                for (let uid in data.data.entities) {
                                    /*
                                    if (data.data.entities[uid] === true) {
                                        continue;
                                    }
                                    if (!(uid in game.world.entities)) {
                                        game.world.createEntity(data.data.entities[uid]);
                                    }
                                    if (game.world.localPlayer != null && game.world.localPlayer.getEntity() == game.world.entities[uid]) {
                                        game.world.localPlayer.setTargetTick(data.data.entities[uid]);
                                    }
                                    */
                                    if (!game.world.entities[uid]) {
                                        game.world.createEntity(data.data.entities[uid])
                                    };
                                }
                            };
                        };
                    }
                    sesWs.onclose = e => {
                        alert(e.reason)
                        console.log("ws closed")
                    };
                };
            };
            return;
        };
        game.network.connect2(options);
    };

    document.getElementsByClassName("hud-intro-guide")[0].innerHTML = `
<h3 style='text-align:center;'>Filling</h3>
<br>
<button class="btn btn-red" style='width: 220px' onclick="window.sendAltServer();">Current Server.</button>
<br>
<input class='btn servercodei' type='text' placeholder='Server Code' style='width: 220px'>
<br><br>
<button class="btn btn-red" style='width: 220px' onclick="window.sendAltSpecificServer();">Custom Server</button>
<br>
`;

    window.sendAltServer = () => {
        let selected = document.getElementsByClassName("hud-intro-server")[0].value;
        let server = game.options.servers[selected];
        let hostname = server.hostname;
        let url = `ws://${hostname}:80/`;
        game.network.connectionOptions = {
            hostname: hostname
        };
        game.network.connected = true;
        let ws = new WebSocket(url);
        ws.binaryType = "arraybuffer";
        ws.onopen = (data) => {
            ws.network = new game.networkType();
            ws.network.sendPacket = (e, t) => {
                ws.send(ws.network.codec.encode(e, t));
            };
            ws.onRpc = (data) => {
                if (data.name === "SetPartyList") {
                    return;
                };
                if (data.name === "Leaderboard") {
                    return;
                };
            };
            ws.onmessage = msg => {
                let data = ws.network.codec.decode(msg.data);
                switch (data.opcode) {
                    case 5:
                        ws.network.sendPacket(4, {
                            displayName: `LiqWyd Filla`,
                            extra: data.extra
                        });
                        break;
                    case 4:
                        ws.network.sendPacket(3, {
                            left: 1,
                            up: 1
                        });
                        ws.pop = data.players - 1;
                        break;
                    case 9:
                        ws.onRpc(data);
                        break;
                };
            };
        };

    };

    window.sendAltSpecificServer = () => {
        let selected = document.getElementsByClassName("servercodei")[0].value;
        if (selected.length < 1) return;
        let server = game.options.servers[selected];
        let hostname = server.hostname;
        let url = `ws://${hostname}:80/`;
        game.network.connectionOptions = {
            hostname: hostname
        };
        game.network.connected = true;
        let ws = new WebSocket(url);
        ws.binaryType = "arraybuffer";
        ws.onopen = (data) => {
            ws.network = new game.networkType();
            ws.network.sendPacket = (e, t) => {
                ws.send(ws.network.codec.encode(e, t));
            };
            ws.onRpc = (data) => {
                if (data.name === "SetPartyList") {
                    return;
                };
                if (data.name === "Leaderboard") {
                    return;
                };
            };
            ws.onmessage = msg => {
                let data = ws.network.codec.decode(msg.data);
                switch (data.opcode) {
                    case 5:
                        ws.network.sendPacket(4, {
                            displayName: `Filler Bot`,
                            extra: data.extra
                        });
                        break;
                    case 4:
                        ws.network.sendPacket(3, {
                            left: 1,
                            up: 1
                        });
                        ws.pop = data.players - 1;
                        break;
                    case 9:
                        ws.onRpc(data);
                        break;
                };
            };
        };
    };

    document.getElementsByClassName("hud-menu hud-menu-settings")[0].innerHTML = `
<h3 style='text-align:center;'>LiqWyd Raid Mod</h3>
<br>
<br />
<div style="text-align:center">
<button class="btn btn-red SE tb" style="width: 21%" id="fillingTabButton">Filling</button>
<button class="btn btn-red SI tb" style="width: 21%" id="iWebbysTabButton">Alts</button>
<button class="btn btn-red AB tb" style="width: 21%" id="usefulnessTabButton">Usefulness</button>
<button class="btn btn-red BS tb" style="width: 21%" id="antiRaidTabButton">Anti Raid</button>
<br />
<button class="btn btn-red BS tb" style="width: 20%;margin-top: 10px;" id="spwTabButton"">SPW</button>
</div>
<div id="tabDisplay">
</div>
`;

    // MiniMap Preset
    {
        var mapcontainer = document.createElement('div');
        mapcontainer.id = "hud-mapcontainer";
        document.querySelector('.hud-bottom-left')
            .append(mapcontainer);
        document.querySelector("#hud-mapcontainer")
            .appendChild(document.querySelector("#hud-map"));
        var mapcontainercss = document.querySelector("#hud-mapcontainer")
            .style;
        mapcontainercss.position = "relative";
        mapcontainercss.top = "17px";
        mapcontainercss.right = "17px";
        mapcontainercss.margin = "0px";
        mapcontainercss.width = "140px";
        mapcontainercss.zIndex = "30";

        document.querySelector(".hud-map")
            .style.border = "3px solid white";

        var huddaynighttickerstyle = document.querySelector(".hud-day-night-ticker")
            .style;
        huddaynighttickerstyle.position = "relative";
        huddaynighttickerstyle.top = "17px";
        huddaynighttickerstyle.right = "20px";
        huddaynighttickerstyle.margin = "3px";
    }

    //Black InGame Backround slight FPS boost
    game.renderer.ground.setVisible(false);
    //ChatSpam Blocker made by ehScops
    let blockedNames = [];

    window.blockPlayer = name => {
        game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to block ${name}?`, 3500, () => {
            blockedNames.push(name);
            for (let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
                if (msg.childNodes[2].innerText === name) {
                    let bl = msg.childNodes[0];
                    bl.innerHTML = "Unblock";
                    bl.style.color = "red";
                    bl.onclick = () => {
                        window.unblockPlayer(name);
                    };
                };
            };
        }, () => {});
    };

    window.unblockPlayer = name => {
        blockedNames.splice(blockedNames.indexOf(name), 1);
        for (let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
            if (msg.childNodes[2].innerText === name) {
                let bl = msg.childNodes[0];
                bl.innerHTML = "Block";
                bl.style.color = "red";
                bl.onclick = () => {
                    window.blockPlayer(name);
                };
            };
        };
    };

    const getClock = () => {
        var date = new Date();
        var d = date.getDate();
        var d1 = date.getDay();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds()
        var session = "PM";

        if (h == 2) {
            h = 12;
        };

        if (h < 13) {
            session = "AM"
        };
        if (h > 12) {
            session = "PM";
            h -= 12;
        };

        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;
        s = (s < 10) ? "0" + s : s;
        return `${h}:${m} ${session}`;
    }

    Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
    let onMessageReceived = (msg => {
        if (blockedNames.includes(msg.displayName) || window.chatDisabled) {
            return;
        };
        let a = Game.currentGame.ui.getComponent("Chat"),
            b = msg.displayName.replace(/<(?:.|\n)*?>/gm, ''),
            c = msg.message.replace(/<(?:.|\n)*?>/gm, ''),
            d = a.ui.createElement(`<div class="hud-chat-message"><a href="javascript:void(0);" onclick="window.blockPlayer(\`${msg.displayName}\`)" style="color: red;">Block</a> <strong>${b}</strong> <small> at ${getClock()}</small>: ${c}</div>`);
        a.messagesElem.appendChild(d);
        a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
    })
    Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);

    window.toggleChat = () => {
        window.chatDisabled = !window.chatDisabled;
        let hcm = document.getElementsByClassName("hud-chat-messages")[0];
        if (window.chatDisabled) {
            window.oldChatHTML = hcm.innerHTML;
            hcm.innerHTML = "<h1>Disabled Chat</h1>";
        } else {
            hcm.innerHTML = window.oldChatHTML;
        };
    };



    // Auto Pet Evolve and Revive
    /*
game.network.addEntityUpdateHandler(() => {
    if ((game.ui.playerPetTick.health / game.ui.playerPetTick.maxHealth) * 100 <= 0) {
        Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "PetRevive", tier: 1});
        Game.currentGame.network.sendRpc({name: "EquipItem", itemName: "PetRevive", tier: 1});
    }
})
*/
    //

    document.getElementById("fillingTabButton").addEventListener("click", function() {
        document.getElementById("tabDisplay").innerHTML = `
    <h1>Lorem ipsum</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultricies integer quis auctor elit sed vulputate.</p>
    `
        let _this = this;
        Array.from(document.getElementsByClassName("tb")).forEach((e => {
            if (e.id !== _this.id) {
                e.classList.replace('btn-grey', 'btn-red')
            } else {
                e.classList.replace('btn-red', 'btn-grey')
            }
        }))
    })

    document.getElementById("usefulnessTabButton").addEventListener("click", function() {
        document.getElementById("tabDisplay").innerHTML = `
    <h1>Usefulness</h1>
    <p></p>
    `
        let _this = this;
        Array.from(document.getElementsByClassName("tb")).forEach((e => {
            if (e.id !== _this.id) {
                e.classList.replace('btn-grey', 'btn-red')
            } else {
                e.classList.replace('btn-red', 'btn-grey')
            }
        }))
    })

    document.getElementById("antiRaidTabButton").addEventListener("click", function() {
        document.getElementById("tabDisplay").innerHTML = `
    <h1>Lorem ipsum</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultricies integer quis auctor elit sed vulputate.</p>
    `
        let _this = this;
        Array.from(document.getElementsByClassName("tb")).forEach((e => {
            if (e.id !== _this.id) {
                e.classList.replace('btn-grey', 'btn-red')
            } else {
                e.classList.replace('btn-red', 'btn-grey')
            }
        }))
    })

    document.getElementById("spwTabButton").addEventListener("click", function() {
        document.getElementById("tabDisplay").innerHTML = `
    <h1>Lorem ipsum</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultricies integer quis auctor elit sed vulputate.</p>
    `
        let _this = this;
        Array.from(document.getElementsByClassName("tb")).forEach((e => {
            if (e.id !== _this.id) {
                e.classList.replace('btn-grey', 'btn-red')
            } else {
                e.classList.replace('btn-red', 'btn-grey')
            }
        }))
    })

    document.getElementById("iWebbysTabButton").addEventListener("click", function() {
        document.getElementById("tabDisplay").innerHTML = `
    <h1>Bots</h1>
    <p>The only known form of unpatched alts you can send via a script.</p>
    <hr />
    <button class="btn btn-red" id="gynf">Send Multiboxer</button>
    <button class="btn btn-green" id="mamm">Move Alts (ON)</button>
    <button class="btn btn-red" id="exmm">Move to Mouse (OFF)</button>
    <button class="btn btn-red" id="m4mm" style="margin-top: 10px;">Move Exactly (OFF)</button>
    <br />
    <p style="display:inline-block;">Party Share Key: </p>
    <input type="text" id="pskSend" placeholder="abcdefghijklmnopqrst" value="${window.psk || ""}" style="display:inline-block;margin-top:10px;" class="btn" />
    <button class="btn btn-red" onclick="document.getElementById('pskSend').value = game.ui.getPlayerPartyShareKey()" style="margin-top:10px;">Reset</button>
    `

        let _this = this;
        Array.from(document.getElementsByClassName("tb")).forEach((e => {
            if (e.id !== _this.id) {
                e.classList.replace('btn-grey', 'btn-red')
            } else {
                e.classList.replace('btn-red', 'btn-grey')
            }
        }))
        document.getElementById("gynf").addEventListener('click', function() {
            let niw = document.createElement('iframe')
            niw.src = `http://zombs.io/#/${game.options.serverId}/${document.getElementById('pskSend').value}/noscript`;
            let niwId = Math.floor(Math.random() * 999999999)
            niw.id = `niw${niwId}`
            niw.addEventListener('load', function() {
                niw.contentWindow.eval(`
window.moveTowards = pos => {
    if (game.ui.playerTick.position.y-pos.y > 100 || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < 100) {
        game.network.sendInput({down: 0})
    } else {
        game.network.sendInput({down: 1})
    }
    if (-game.ui.playerTick.position.y+pos.y > 100 || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < 100) {
        game.network.sendInput({up: 0})
    } else {
        game.network.sendInput({up: 1})
    }
    if (-game.ui.playerTick.position.x+pos.x > 100 || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < 100) {
        game.network.sendInput({left: 0})
    } else {
        game.network.sendInput({left: 1})
    }
    if (game.ui.playerTick.position.x-pos.x > 100 || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < 100) {
        game.network.sendInput({right: 0})
    } else {
        game.network.sendInput({right: 1})
    }
};
            document.getElementsByClassName("hud-intro-play")[0].click()
            let hasJoined = false
            game.network.addEnterWorldHandler(function(e) {
                if(hasJoined) { return; }
                hasJoined = true;
            })
            game.network.addEntityUpdateHandler(function(e) {
                if(window.parent.exactMove) { return; }
                if(!window.parent.moveAlts) {
                    game.network.sendInput({ right: 0, left: 0, up: 0, down: 0 })
                    return;
                };
                if(window.parent.mouseMove) {
                    window.moveTowards(window.parent.game.renderer.screenToWorld(window.parent.game.ui.mousePosition.x, window.parent.game.ui.mousePosition.y))
                    return;
                };
                window.moveTowards(window.parent.game.world.entities[window.parent.game.world.getMyUid()].targetTick.position)
            })
            game.network.addRpcHandler("Dead", function(e) {
                game.network.sendPacket(3, { respawn: 1 })
            })
            window.parent.addEventListener('message', function(msg) {
                let data = msg.data
                if(data.type == "packet") {
                    game.network.sendPacket(data.packet[0], data.packet[1])
                }
            })
            `)
            })
            niw.style.display = "none"
            document.body.append(niw)
        })
        document.getElementById("exmm").addEventListener("click", function() {
            if (window.exactMove) {
                return;
            }
            window.mouseMove = !window.mouseMove;

            if (window.mouseMove) {
                this.classList.replace("btn-red", "btn-green")
                this.innerText = "Move to Mouse (ON)"
            } else {
                this.classList.replace("btn-green", "btn-red")
                this.innerText = "Move to Mouse (OFF)"
            }
        })
        document.getElementById("m4mm").addEventListener("click", function() {
            if (window.mouseMove) {
                return;
            };

            window.exactMove = !window.exactMove

            if (window.exactMove) {
                this.classList.replace("btn-red", "btn-green")
                this.innerText = "Move Exactly (ON)"
            } else {
                this.classList.replace("btn-green", "btn-red")
                this.innerText = "Move Exactly (OFF)"
            }
        })
        document.getElementById("mamm").addEventListener("click", function() {
            // if(window.) { return; }
            window.moveAlts = !window.moveAlts
            if (window.moveAlts) {
                this.classList.replace("btn-red", "btn-green")
                this.innerText = "Move Alts (ON)"
            } else {
                this.classList.replace("btn-green", "btn-red")
                this.innerText = "Move Alts (OFF)"
            }
        })
    })

    game.network.sendPacket2 = game.network.sendPacket
    game.network.sendPacket = function(t, e) {
        if (((!e.left && !e.right && !e.down && !e.up) || window.exactMove) && ((t == 3) || (t == 9))) {
            let p = {
                type: "packet"
            };
            p.packet = [t, e]
            postMessage(p)
        }
        game.network.sendPacket2(t, e)
    };

    game.network.addRpcHandler("PartyShareKey", e => {
        window.psk = e.partyShareKey
    })
};
thing()

addEventListener('keydown', function(f){
    if(f.key == "/"){
        game.renderer.ground.setVisible(false);
    }
})

addEventListener('keydown', function(s){
    if(s.key == "."){
        game.renderer.ground.setVisible(true);
    }
})
