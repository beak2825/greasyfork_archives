// ==UserScript==
// @name         GOD
// @namespace    -
// @version      BETA
// @description  nais
// @author      My Script.
// @match        zombs.io
// @icon         https://cdn.discordapp.com/channel-icons/855622511553937429/c4ae7994d1bf46c69d63bd08ff302745.png
// @grant        none
// @license MIT
// ==/UserScript==

document.body.insertAdjacentHTML('beforeend', `
<div class="hud-menu hud-menu-settings hud-menu-more">
<h3 style="text-align: left;">Renderer</h3>
<br />
<br />
<div style="text-align: left">
<button class="btn btn-theme 1z" style="width: 45%;margin: 1px;">Stop Rendering Ground?</button>
<br />
<br />
<small><i class="fa fa-info-circle"></i> The ground will start/stop rendering.</small>
<br />
<br />
<div id="addon" style="display: none;">
<button class="btn btn-green 1z1" style="margin: 1px;">Black Ground With Grid?</button>
<br />
<br />
</div>
<button class="btn btn-theme 2z" style="width: 45%;margin: 1px;">Stop Rendering NPCs?</button>
<br />
<br />
<small><i class="fa fa-info-circle"></i> All NPCs (including players, apparently) will start/stop rendering.</small>
<br />
<br />
<button class="btn btn-theme 3z" style="width: 45%;margin: 1px;">Stop Rendering Enviroment?</button>
<br />
<br />
<small><i class="fa fa-info-circle"></i> Trees, Stones, Crystals and Buildings will start/stop rendering. Can be a performance increase if you have travelled to too many places on the map...</small>
<br />
<br />
<button class="btn btn-theme 4z" style="width: 45%;margin: 1px;">Stop Rendering Projectiles?</button>
<br />
<br />
<small><i class="fa fa-info-circle"></i> Projectiles will start/stop rendering. Good for sitting in large bases!</small>
<br />
<br />
<button class="btn btn-theme 5z" style="width: 45%;margin: 1px;">Stop Rendering <strong>Everything</strong>?</button>
<br />
<br />
<small><i class="fa fa-info-circle"></i><strong> Everything.</strong></small>
<br />
<br />
<button class="btn btn-theme 6z" style="width: 45%;margin: 1px;">Stop Renderer?</button>
<br />
<br />
<small><i class="fa fa-info-circle"></i> Freezes renderer.</small>
<br />
<br />
</div>
</div>
`);

function thing() {
    if(location.hash.includes("noscript")) { return; }

    document.title = 'Sirr0m';
    document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
    document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
    document.querySelectorAll('.ad-unit, .hud-intro-youtuber, .hud-intro-footer, .hud-intro-stone, .hud-intro-tree, hud-respawn-corner-bottom-left, .hud-intro-social, .hud-intro-more-games, .hud-intro-form > label, .hud-intro-stone, .hud-intro-tree, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right').forEach(el => el.remove());

    // Lost Ascend's filling shit

    window.codeIn = () => {
        let codei = document.getElementById('codei');
        let code = codei.value;
        if (code.length = 0) return;
        if (code.length > 8) return;
        if (code.length < 8) return;
        if (!code.startsWith("v")) return;
        document.getElementsByClassName("hud-intro-server")[0].value = code;
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
                            displayName: `Sirr0m Filla`,
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
                            displayName: `Sirr0m Filla`,
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




    let css2 = `
.btn:hover {
cursor: pointer;
}
.btn-blue {
background-color:#ffff00;
}
.btn-blue:hover .btn-blue:active {
background-color: #ffff00;
}
.box {
display: block;
width: 100%;
height: 50px;
line-height: 34px;
padding: 8px 14px;
margin: 0 0 10px;
background:#ffff00;
border: 0;
font-size: 14px;
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
border-radius: 4px;
}
.codeIn, .joinOut {
height: 50px;
}
.hud-menu-zipp2 {
display: none;
position: fixed;
top: 48%;
left: 50%;
width: 600px;
height: 470px;
margin: -270px 0 0 -300px;
padding: 20px;
background: hsl(0, 100%, 30%)
color: #ffff00;
border-radius: 4px;
z-index: 15;
}
.hud-menu-zipp2 h3 {
display: block;
margin: 0;
line-height: 30px;
}
.hud-menu-zipp2 .hud-zipp-grid2 {
background-color: rgba(28, 92, 65, 0.55); border: 5px solid white; overflow: scroll; display: block;"
display: block;
height: 440px;
padding: 15px;
margin-top: 20px;
 background: rgba(0, 0, 0, 0.6);
  color: #eee;
  border-radius: 4px;
  z-index: 15;
  overflow-y: auto;
  opacity: 0.75;
  background-size: cover;
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity2"]::before {
background-image: url("https://media.discordapp.net/attachments/838437616566796288/904966032425365514/sirromedit-removebg-preview.png");
}
.hud-menu-zipp2 .hud-the-tab {
position: relative;
height: 80px;
line-height: 80px;
margin: 20px;
border: 0px solid rgb(0, 0, 0, 0);
}
.hud-menu-zipp2 .hud-the-tab {
display: block;
float: left;
padding: 0 14px;
margin: 0 1px 0 0;
font-size: 15px;
background: rgba(81, 123, 91, 1);
color: rgba(81, 123, 91, 1);
transition: all 0.15s ease-in-out;
}
.hud-menu-zipp2 .hud-the-tab:hover {
background: rgba(81, 123, 91, 1)
color: #ffff00;
cursor: pointer;
}
.hud-intro::before {
    background-image: url('https://images-ext-2.discordapp.net/external/cqpW4BLZOBItpCKbw1_t90vPacviKC0VcWOh2YXDhHw/https/wallpaperboat.com/wp-content/uploads/2019/12/cute-black-and-white-06.jpg?width=1129&height=635');
    background-size: cover;
}
`;


    //mod and menu styling
    let sm = document.querySelector("#hud-menu-settings");

    sm.innerHTML = `

<input type="text" style="width: 150px; border-radius: 3px; border: 2px solid rgb(0, 0, 0, 0.4); color: black; height: 50px; padding: 5px;" id="codei" placeholder="Server Code">
<button class="btn btn-red codeIn" style="width: 40%; height: 50px;" onclick='window.codeIn();'>Use Code</button>
<br />

`;

    sm.style.overflow = "scroll"

    let styles = document.createElement("style");
    styles.appendChild(document.createTextNode(css2));
    document.head.appendChild(styles);

    // class changing
    document.getElementsByClassName("hud-intro-form")[0].style.height = "300px";
    document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-red hud-intro-play");

    // spell icon
    let spell = document.createElement("div");
    spell.classList.add("hud-spell-icon");
    spell.setAttribute("data-type", "Zippity2");
    spell.classList.add("hud-zipp2-icon");
    document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

    //Menu for spell icon
    let modHTML = `
<div class="hud-menu-zipp2">
<br />
<div class="hud-zipp-grid2">
</div>
</div>
`;
    document.body.insertAdjacentHTML("afterbegin", modHTML);
    let zipz123 = document.getElementsByClassName("hud-menu-zipp2")[0];

    // buttons brib

    document.getElementsByClassName("hud-menu hud-menu-settings")[0].innerHTML = `
<h3 style='text-align:center;'>moddedyeat</h3>
<br>
<br />
<div style="text-align:center">
<button class="btn btn-red SE tb" style="width: 21%" id="fillingTabButton">Filling</button>
<button class="btn btn-red SI tb" style="width: 21%" id="iWebbysTabButton">iFrames</button>
<button class="btn btn-red AB tb" style="width: 21%" id="usefulnessTabButton">Usefulness</button>
<button class="btn btn-red BS tb" style="width: 21%" id="antiRaidTabButton">Anti Raid</button>
<br />
<button class="btn btn-red BS tb" style="width: 20%;margin-top: 10px;" id="spwTabButton"">SPW</button>
</div>
<div id="tabDisplay">
</div>





`;
    //For settings buttons to work ig


    //some spell tower thing lul

    document.getElementsByClassName("hud-zipp2-icon")[0].addEventListener("click", function() {
        if(zipz123.style.display == "none") {
            zipz123.style.display = "block";
            for(var i = 0; i < menus.length; i++) {
                menus[i].style.display = "none";
            }
        } else {
            zipz123.style.display = "none";
        };
    });

    let _menu = document.getElementsByClassName("hud-menu-icon");
    let _spell = document.getElementsByClassName("hud-spell-icon");
    let allIcon = [
        _menu[0],
        _menu[1],
        _menu[2],
        _spell[0],
        _spell[1]
    ];

    allIcon.forEach(function(elem) {
        elem.addEventListener("click", function() {
            if(zipz123.style.display == "block") {
                zipz123.style.display = "none";
            };
        });
    });

    // MiniMap Preset
    {var mapcontainer = document.createElement('div');
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
     huddaynighttickerstyle.margin = "3px";}

    //Black InGame Backround slight FPS boost
    game.renderer.ground.setVisible(false);
    //ChatSpam Blocker made by ehScops
    let blockedNames = [];

    window.blockPlayer = name => {
        game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to block ${name}?`, 3500, () => {
            blockedNames.push(name);
            for(let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
                if(msg.childNodes[2].innerText === name) {
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
        for(let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
            if(msg.childNodes[2].innerText === name) {
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

        if(h == 2){
            h = 12;
        };

        if(h < 13) {
            session = "AM"
        };
        if(h > 12){
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
        if(blockedNames.includes(msg.displayName) || window.chatDisabled) { return; };
        let a = Game.currentGame.ui.getComponent("Chat"),
            b = msg.displayName.replace(/<(?:.|\n)*?>/gm, ''),
            c = msg.message,
            d = a.ui.createElement(`<div class="hud-chat-message"><a href="javascript:void(0);" onclick="window.blockPlayer(\`${msg.displayName}\`)" style="color: red;">Block</a> <strong>${b}</strong> <small> at ${getClock()}</small>: ${c}</div>`);
        a.messagesElem.appendChild(d);
        a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
    })
    Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);

    window.toggleChat = () => {
        window.chatDisabled = !window.chatDisabled;
        let hcm = document.getElementsByClassName("hud-chat-messages")[0];
        if(window.chatDisabled) {
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
            if(e.id !== _this.id) {
                e.classList.replace('btn-grey', 'btn-red')
            } else {
                e.classList.replace('btn-red', 'btn-grey')
            }
        }))
    })

    document.getElementById("usefulnessTabButton").addEventListener("click", function() {
        document.getElementById("tabDisplay").innerHTML = `
    <h1>Lorem ipsum</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultricies integer quis auctor elit sed vulputate.</p>
    `
        let _this = this;
        Array.from(document.getElementsByClassName("tb")).forEach((e => {
            if(e.id !== _this.id) {
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
            if(e.id !== _this.id) {
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
            if(e.id !== _this.id) {
                e.classList.replace('btn-grey', 'btn-red')
            } else {
                e.classList.replace('btn-red', 'btn-grey')
            }
        }))
    })

    document.getElementById("iWebbysTabButton").addEventListener("click", function() {
        document.getElementById("tabDisplay").innerHTML = `
    <h1>iFrames</h1>
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
            if(e.id !== _this.id) {
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
            if(window.exactMove) { return; }
            window.mouseMove = !window.mouseMove
            if(window.mouseMove) {
                this.classList.replace("btn-red", "btn-green")
                this.innerText = "Move to Mouse (ON)"
            } else {
                this.classList.replace("btn-green", "btn-red")
                this.innerText = "Move to Mouse (OFF)"
            }
        })
        document.getElementById("m4mm").addEventListener("click", function() {
            if(window.mouseMove) { return; }
            window.exactMove = !window.exactMove
            if(window.exactMove) {
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
            if(window.moveAlts) {
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
        if(((!e.left && !e.right && !e.down && !e.up) || window.exactMove) && ((t == 3) || (t == 9))) {
            let p = { type: "packet" };
            p.packet = [t, e]
            postMessage(p)
        }
        game.network.sendPacket2(t, e)
    };

    game.network.addRpcHandler("PartyShareKey", e => {
        window.psk = e.partyShareKey
    })

    (function() {
        'use strict';

        const packet_enum = {
            0: 'PACKET_ENTITY_UPDATE',
            1: 'PACKET_PLAYER_COUNTER_UPDATE',
            2: 'PACKET_SET_WORLD_DIMENSIONS',
            3: 'PACKET_INPUT',
            4: 'PACKET_ENTER_WORLD',
            5: 'PACKET_PRE_ENTER_WORLD',
            7: 'PACKET_PING',
            9: 'PACKET_RPC'
        }

        const session_enum = {
            'Session 1': 7778
        }; let session_port;

        let session_string = '';
        for(const sessionId in session_enum) {
            session_string += `\n <option value=${session_enum[sessionId]}>${sessionId}</option>`;
        }

        document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select").innerHTML = `<optgroup label="Sessions">${session_string}`;
        game.network.connect = options => {
            session_port = document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select").selectedOptions[0].value;
            game.network.connecting || (game.network.connectionOptions = options, game.network.connected = false, game.network.connecting = true, 'https:' === window.location.protocol ? game.network.socket = new WebSocket('wss://' + options.hostname + ':' + options.port) : game.network.socket = new WebSocket('ws://' + '143.198.153.49' + ':' + session_port.toString()), game.network.socket.binaryType = `arraybuffer`, game.network.bindEventListeners());
        }

        game.network.sendPacket = (opcode, data) => {
            if(opcode === 7) return;
            game.network.connected && game.network.socket.send(game.network.codec.encode(opcode, data));
        }

        game.network.onMessage = (msg => {
            if(!(msg.data instanceof ArrayBuffer)) {
                msg = JSON.parse(msg.data);

                if(msg.opcode === 69) return handleCustomData(msg);
                return game.network.emitter.emit(packet_enum[msg.opcode], msg);
            }

            const decoded = game.network.codec.decode(msg.data);
            if(decoded.opcode === 5 || decoded.opcode === 7) return;

            game.network.emitter.emit(packet_enum[decoded.opcode], decoded);
        });

        game.network.addEnterWorldHandler(() => {
            const checkExist = setInterval(() => {
                if(!game.world.getEntityByUid(game.world.getMyUid())?.getTargetTick()) return;
                clearInterval(checkExist);

                game.network.socket.send('CHECK_IF_DEAD');
                game.network.socket.send('KEY_VERIFICATION:48C516A4B38AF98CF29257811CFC2');
            }, 50);
        });


        function handleCustomData({ action, data }) {
            switch(action) {
                case 'attributeMaps':
                    game.network.codec.attributeMaps = data;
                    break;
                case 'entityTypeNames':
                    game.network.codec.entityTypeNames = data;
                    break;
                case 'rpcMaps':
                    game.network.codec.rpcMaps = data;
                    break;
                case 'rpcMapsByName':
                    game.network.codec.rpcMapsByName = data;
                    break;
                case 'sortedUidsByType':
                    game.network.codec.sortedUidsByType = data;
                    break;
            }
        }
    })();

}
thing()
