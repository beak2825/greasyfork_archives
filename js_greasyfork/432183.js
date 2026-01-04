// ==UserScript==
// @name                Kogama Console Edited By Syrux 2
// @run-at            document-start
// @version            0.1 delta
// @description    kogama console
// @author            Syrux
// @match                https://www.kogama.com/page/webgl-frame/*
// @match                https://kogama.com.br/page/webgl-frame/*
// @match                https://friends.kogama.com/page/webgl-frame/*
// @grant                none
// @namespace https://greasyfork.org/users/776013
// @downloadURL https://update.greasyfork.org/scripts/432183/Kogama%20Console%20Edited%20By%20Syrux%202.user.js
// @updateURL https://update.greasyfork.org/scripts/432183/Kogama%20Console%20Edited%20By%20Syrux%202.meta.js
// ==/UserScript==

function cheatInject() {
    console.log("KOGAMA CHEAT LOADED");
    const style = `
background-color: black;
color: white;
border: none;
`;
    var SPMode = false;
    document.addEventListener("keydown", function(e) {
        let key = e.key;
        if (key == "Insert") {
            if (SPMode == false) {
                SPMode = true;
                alert("SPMode: On")
            } else {
                SPMode = false;
                alert("SPMode: Off")
            }
        } else if (key == "]") {
            let random = Math.floor(Math.random() * 15)
            if (random == 0) {
                server.weapons.impulseGun();
            } else if (random == 1) {
                server.weapons.bazooka();
            } else if (random == 2) {
                server.weapons.railGun();
            } else if (random == 3) {
                server.weapons.centralGun();
            } else if (random == 4) {
                server.weapons.shotGun();
            } else if (random == 5) {
                server.weapons.growthGun();
            } else if (random == 6) {
                server.weapons.mouseGun();
            } else if (random == 7) {
                server.weapons.flameThrower();
            } else if (random == 8) {
                server.weapons.sword();
            } else if (random == 9) {
                server.weapons.shuriken();
            } else if (random == 10) {
                server.weapons.multipleShuriken();
            } else if (random == 11) {
                server.weapons.revolver();
            } else if (random == 12) {
                server.weapons.doubleRevolvers();
            } else if (random == 13) {
                server.weapons.healRay();
            } else if (random == 14) {
                server.weapons.cubeGun();
            }
        }
    });
    let menu = top.document.createElement("div");
    top.document.body.appendChild(menu);
    menu.id = "cheatMenu";
    menu.style = `
position: fixed;
background-color: black;
box-shadow: 2px 2px 12px black;
height: 330px;
width: 250px;
top: 90px;
left: 896px;
text-align: center;
z-index: 9999;
  border: 5px solid transparent;
  border-image: linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%);
  border-image-slice: 1;
overflow: auto;
display: none;
`;
    top.document.addEventListener('contextmenu', e => {
        if (e.target == top.document.querySelector('#profile-extended-toggle>a>i')) {
            if (menu.style.display == "none") {
                menu.style.display = 'block';
                e.preventDefault();
            } else {
                menu.style.display = "none";
            }
        }
    });
    let text = document.createElement("h2");
    menu.appendChild(text);
    text.textContent = "KOGAMA CHEAT";
    let cheat = document.createElement("input");
    menu.appendChild(cheat);
    cheat.id = "kcheat";
    cheat.type = "button";
    cheat.value = "Anti-PlayersDamage: Off";
    cheat.style = style
    cheat.addEventListener("click", function() {
        if (this.value == "Anti-PlayersDamage: Off") {
            this.value = "Anti-PlayersDamage: On"
        } else {
            this.value = "Anti-PlayersDamage: Off"
        }
    });
    let cheat0 = document.createElement("input");
    menu.appendChild(cheat0);
    cheat0.id = "kcheat";
    cheat0.type = "button";
    cheat0.value = "Anti-Notification: Off";
    cheat0.style = style
    cheat0.addEventListener("click", function() {
        if (this.value == "Anti-Notification: Off") {
            this.value = "Anti-Notification: On"
        } else {
            this.value = "Anti-Notification: Off"
        }
    });
    let getIds = document.createElement("input");
    menu.appendChild(getIds);
    getIds.id = "kcheat";
    getIds.type = "button";
    getIds.value = "Get ActorNrs";
    getIds.style = style
    getIds.addEventListener("click", function() {
        client.messages.getActorNr();
    });
    let actorInp = document.createElement("input");
    menu.appendChild(actorInp);
    actorInp.id = "kcheat";
    actorInp.placeholder = "User ActorNr...";
    actorInp.style = style
    let sendBy = document.createElement("input");
    menu.appendChild(sendBy);
    sendBy.id = "kcheat";
    //sendBy.type = "button";
    sendBy.placeholder = "Admin message(Actor)";
    sendBy.style = style
    sendBy.addEventListener("keydown", function(e) {
        if(e.key == "Enter"){
        //let actorNr = prompt("User ActorNr")
        //let msg = prompt("User message")
        client.messages.messageByActorNr(this.value, actorInp.value, 7)
        }
    });
    let sendBy2 = document.createElement("input");
    menu.appendChild(sendBy2);
    sendBy2.id = "kcheat";
    //sendBy2.type = "button";
    sendBy2.placeholder = "Admin message(Actor)2";
    sendBy2.style = style
    sendBy2.addEventListener("keydown", function(e) {
        if(e.key == "Enter"){
        //let actorNr = prompt("User ActorNr")
        //let msg = prompt("User message")
        client.messages.messageByActorNr(this.value, actorInp.value, 9)
        }
    });
    let cheat1 = document.createElement("input");
    menu.appendChild(cheat1);
    cheat1.id = "kcheat";
    cheat1.placeholder = "Fast message...";
    cheat1.style = style
    cheat1.addEventListener("input", function() {
        client.messages.admin(this.value)
    });
    let cheat2 = document.createElement("input");
    menu.appendChild(cheat2);
    cheat2.id = "kcheat";
    cheat2.placeholder = "Admin message...";
    cheat2.style = style
    cheat2.addEventListener("keydown", function(e) {
        if (e.key == "Enter") {
            client.messages.admin(cheat2.value)
            cheat2.value = "";
        }
    });
    let cheat3 = document.createElement("input");
    menu.appendChild(cheat3);
    cheat3.id = "kcheat";
    cheat3.placeholder = "Super(all) message...";
    cheat3.style = style
    cheat3.addEventListener("keydown", function(e) {
        if (e.key == "Enter") {
            client.messages.super.all(cheat3.value)
            cheat3.value = "";
        }
    });
    let cheat4 = document.createElement("input");
    menu.appendChild(cheat4);
    cheat4.id = "kcheat";
    cheat4.placeholder = "Super(says) message...";
    cheat4.style = style
    cheat4.addEventListener("keydown", function(e) {
        if (e.key == "Enter") {
            client.messages.super.says(cheat4.value)
            cheat4.value = "";
        }
    });
    let cheat5 = document.createElement("input");
    menu.appendChild(cheat5);
    cheat5.id = "kcheat";
    cheat5.type = "button"
    cheat5.value = "Team Blue";
    cheat5.style = style
    cheat5.addEventListener("click", function() {
        client.teams.blue();
    });
    let cheat6 = document.createElement("input");
    menu.appendChild(cheat6);
    cheat6.id = "kcheat";
    cheat6.type = "button"
    cheat6.value = "Team Red";
    cheat6.style = style
    cheat6.addEventListener("click", function() {
        client.teams.red();
    });
    let cheat7 = document.createElement("input");
    menu.appendChild(cheat7);
    cheat7.id = "kcheat";
    cheat7.type = "button"
    cheat7.value = "Team Yellow";
    cheat7.style = style
    cheat7.addEventListener("click", function() {
        client.teams.yellow();
    });
    let cheat8 = document.createElement("input");
    menu.appendChild(cheat8);
    cheat8.id = "kcheat";
    cheat8.type = "button"
    cheat8.value = "Team Green";
    cheat8.style = style
    cheat8.addEventListener("click", function() {
        client.teams.green();
    });
    let cheat9 = document.createElement("input");
    menu.appendChild(cheat9);
    cheat9.id = "kcheat";
    cheat9.type = "button"
    cheat9.value = "Team White";
    cheat9.style = style
    cheat9.addEventListener("click", function() {
        client.teams.white();
    });
    let cheat10 = document.createElement("input");
    menu.appendChild(cheat10);
    cheat10.id = "kcheat";
    cheat10.type = "button"
    cheat10.value = "Team Server";
    cheat10.style = style
    cheat10.addEventListener("click", function() {
        client.teams.server();
    });
    let cheat11 = document.createElement("input");
    menu.appendChild(cheat11);
    cheat11.id = "kcheat";
    cheat11.type = "button"
    cheat11.value = "Shielded Effect";
    cheat11.style = style
    cheat11.addEventListener("click", function() {
        server.effects.shielded();
    });
    let cheat12 = document.createElement("input");
    menu.appendChild(cheat12);
    cheat12.id = "kcheat";
    cheat12.type = "button"
    cheat12.value = "SpawnProtection Effect";
    cheat12.style = style
    cheat12.addEventListener("click", function() {
        server.effects.spawnProtection();
    });
    let cheat13 = document.createElement("input");
    menu.appendChild(cheat13);
    cheat13.id = "kcheat";
    cheat13.type = "button"
    cheat13.value = "NinjaRun Effect";
    cheat13.style = style
    cheat13.addEventListener("click", function() {
        server.effects.ninjaRun();
    });
    let cheat14 = document.createElement("input");
    menu.appendChild(cheat14);
    cheat14.id = "kcheat";
    cheat14.type = "button"
    cheat14.value = "Enlarged(big) Effect";
    cheat14.style = style
    cheat14.addEventListener("click", function() {
        server.effects.enlarged();
    });
    let cheat15 = document.createElement("input");
    menu.appendChild(cheat15);
    cheat15.id = "kcheat";
    cheat15.type = "button"
    cheat15.value = "Shrunken(small) Effect";
    cheat15.style = style
    cheat15.addEventListener("click", function() {
        server.effects.shrunken();
    });
    let cheat16 = document.createElement("input");
    menu.appendChild(cheat16);
    cheat16.id = "kcheat";
    cheat16.type = "button"
    cheat16.value = "Spawn ImpulseGun";
    cheat16.style = style
    cheat16.addEventListener("click", function() {
        server.weapons.impulseGun();
    });
    let cheat17 = document.createElement("input");
    menu.appendChild(cheat17);
    cheat17.id = "kcheat";
    cheat17.type = "button"
    cheat17.value = "Spawn Bazooka";
    cheat17.style = style
    cheat17.addEventListener("click", function() {
        server.weapons.bazooka();
    });
    let cheat18 = document.createElement("input");
    menu.appendChild(cheat18);
    cheat18.id = "kcheat";
    cheat18.type = "button"
    cheat18.value = "Spawn RailGun";
    cheat18.style = style
    cheat18.addEventListener("click", function() {
        server.weapons.railGun();
    });
    let cheat19 = document.createElement("input");
    menu.appendChild(cheat19);
    cheat19.id = "kcheat";
    cheat19.type = "button"
    cheat19.value = "Spawn CentralGun";
    cheat19.style = style
    cheat19.addEventListener("click", function() {
        server.weapons.centralGun();
    });
    let cheat20 = document.createElement("input");
    menu.appendChild(cheat20);
    cheat20.id = "kcheat";
    cheat20.type = "button"
    cheat20.value = "Spawn ShotGun";
    cheat20.style = style
    cheat20.addEventListener("click", function() {
        server.weapons.shotGun();
    });
    let cheat21 = document.createElement("input");
    menu.appendChild(cheat21);
    cheat21.id = "kcheat";
    cheat21.type = "button"
    cheat21.value = "Spawn GrowthGun";
    cheat21.style = style
    cheat21.addEventListener("click", function() {
        server.weapons.growthGun();
    });
    let cheat22 = document.createElement("input");
    menu.appendChild(cheat22);
    cheat22.id = "kcheat";
    cheat22.type = "button"
    cheat22.value = "Spawn MouseGun";
    cheat22.style = style
    cheat22.addEventListener("click", function() {
        server.weapons.mouseGun();
    });
    let cheat23 = document.createElement("input");
    menu.appendChild(cheat23);
    cheat23.id = "kcheat";
    cheat23.type = "button"
    cheat23.value = "Spawn FlameThrower";
    cheat23.style = style
    cheat23.addEventListener("click", function() {
        server.weapons.flameThrower();
    });
    let cheat24 = document.createElement("input");
    menu.appendChild(cheat24);
    cheat24.id = "kcheat";
    cheat24.type = "button"
    cheat24.value = "Spawn Sword";
    cheat24.style = style
    cheat24.addEventListener("click", function() {
        server.weapons.sword();
    });
    let cheat25 = document.createElement("input");
    menu.appendChild(cheat25);
    cheat25.id = "kcheat";
    cheat25.type = "button"
    cheat25.value = "Spawn Shuriken";
    cheat25.style = style
    cheat25.addEventListener("click", function() {
        server.weapons.shuriken();
    });
    let cheat26 = document.createElement("input");
    menu.appendChild(cheat26);
    cheat26.id = "kcheat";
    cheat26.type = "button"
    cheat26.value = "Spawn MultipleShuriken";
    cheat26.style = style
    cheat26.addEventListener("click", function() {
        server.weapons.multipleShuriken();
    });
    let cheat27 = document.createElement("input");
    menu.appendChild(cheat27);
    cheat27.id = "kcheat";
    cheat27.type = "button"
    cheat27.value = "Spawn Revolver";
    cheat27.style = style
    cheat27.addEventListener("click", function() {
        server.weapons.revolver();
    });
    let cheat28 = document.createElement("input");
    menu.appendChild(cheat28);
    cheat28.id = "kcheat";
    cheat28.type = "button"
    cheat28.value = "Spawn DoubleRevolvers";
    cheat28.style = style
    cheat28.addEventListener("click", function() {
        server.weapons.doubleRevolvers();
    });
    let cheat29 = document.createElement("input");
    menu.appendChild(cheat29);
    cheat29.id = "kcheat";
    cheat29.type = "button"
    cheat29.value = "Spawn HealRay";
    cheat29.style = style
    cheat29.addEventListener("click", function() {
        server.weapons.healRay();
    });
    let cheat30 = document.createElement("input");
    menu.appendChild(cheat30);
    cheat30.id = "kcheat";
    cheat30.type = "button"
    cheat30.value = "Spawn SlapGun";
    cheat30.style = style
    cheat30.addEventListener("click", function() {
        server.weapons.slapGun();
    });
    let cheat31 = document.createElement("input");
    menu.appendChild(cheat31);
    cheat31.id = "kcheat";
    cheat31.type = "button"
    cheat31.value = "Spawn CubeGun";
    cheat31.style = style
    cheat31.addEventListener("click", function() {
        server.weapons.cubeGun();
    });
    let cheat32 = document.createElement("input");
    menu.appendChild(cheat32);
    cheat32.id = "kcheat";
    cheat32.placeholder = "Avatar Size...";
    cheat32.style = style
    cheat32.addEventListener("keydown", function(e) {
        if(e.key == "Enter"){
        client.avatarSize(this.value);
        }
    });

    function toByte32(num) {
        var result = new Uint8Array(num ? new Uint32Array([num]).buffer : []).reverse();
        return result
    }
    function toFloat(num) {
    var result = new Uint8Array(new Float32Array([num]).buffer).reverse()
    return result
    }
    const onMessage = function(message) {
        let Data = new Uint8Array(message.data);
        let DecodedData = String.fromCharCode.apply(null, Data)
        if (SPMode == true) {
            console.log("Data(client): " + Data + " Decoded Data(client): " + DecodedData)
        }
        _this = this;
        if (Data[2] == 255) {
            arguments[0] = new MessageEvent("message", {
                data: new Uint8Array(DecodedData.replace("\"IsAdmin\":false", "\"IsAdmin\":true ").split("").map((v) => v.charCodeAt())).buffer
            })
        }
        if (Data[2] == 61) {
            server.infos.playerList = DecodedData;
            server.infos.woId = DecodedData.split(":")[1].replace(',"spawnRoleAvatarIds"', "")
            //server.infos.userNames.push(DecodedData.split("}")[i].split(":")[2].replace(',"Gold"', ""))
        }
        if (Data[2] == 32 && cheat.value == "Anti-PlayersDamage: On")
            return;
        if (Data[2] == 57 && cheat0.value == "Anti-Notification: On")
            return;
        this._onmessage.apply(this, arguments);
    }
    window.server = top.server = {
        effects: {
            shielded: () => {
                for (var i = 0; i < 20; i++) {
                    _this._onmessage({
                        data: new Uint8Array([
                            243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 9, 109, 111, 100, 105, 102, 105, 101, 114, 115, 68, 0, 0, 0, i, 115, 0, 9, 95, 83, 104, 105, 101, 108, 100, 101, 100, 98, 0, 254, 105, 0, 0, 0, 0
                        ]).buffer
                    });
                }
            },
            spawnProtection: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 9, 109, 111, 100, 105, 102, 105, 101, 114, 115, 68, 0, 0, 0, 2, 115, 0, 26, 95, 84, 105, 109, 101, 65, 116, 116, 97, 99, 107, 70, 108, 97, 103, 68, 101, 98, 114, 105, 101, 102, 83, 108, 111, 119, 98, 0, 115, 0, 16, 95, 83, 112, 97, 119, 110, 80, 114, 111, 116, 101, 99, 116, 105, 111, 110, 98, 0, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            ninjaRun: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 9, 109, 111, 100, 105, 102, 105, 101, 114, 115, 68, 0, 0, 0, 1, 115, 0, 9, 95, 78, 105, 110, 106, 97, 82, 117, 110, 98, 0, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            enlarged: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 9, 109, 111, 100, 105, 102, 105, 101, 114, 115, 68, 0, 0, 0, 1, 115, 0, 9, 95, 69, 110, 108, 97, 114, 103, 101, 100, 98, 0, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            shrunken: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 9, 109, 111, 100, 105, 102, 105, 101, 114, 115, 68, 0, 0, 0, 1, 115, 0, 9, 95, 83, 104, 114, 117, 110, 107, 101, 110, 98, 0, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            }
        },
        weapons: {
            impulseGun: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 2, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            bazooka: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 4, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            railGun: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 6, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            centralGun: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 1, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            shotGun: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 9, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            growthGun: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 62, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            mouseGun: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 60, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            flameThrower: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 10, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            sword: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 8, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            shuriken: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 45, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            multipleShuriken: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 46, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            revolver: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 12, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            doubleRevolvers: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 13, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            healRay: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 70, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            },
            cubeGun: () => {
                _this._onmessage({
                    data: new Uint8Array([
                        243, 4, 29, 0, 3, 22, 105, ...toByte32(server.infos.woId), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 4, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 11, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 115, 0, 8, 105, 116, 101, 109, 68, 97, 116, 97, 68, 0, 0, 0, 1, 115, 0, 8, 109, 97, 116, 101, 114, 105, 97, 108, 98, 20, 254, 105, 0, 0, 0, 0
                    ]).buffer
                });
            }
        },
        infos: {
            woId: 0,
            playersCount: 0,
            playerList: 0
        }
    }
    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.socket = null;
    WebSocket.prototype.send = function(data) {
        if (!this._onmessage) {
            this._onmessage = this.onmessage;
            this.onmessage = onMessage;
            this.socket = this;
            _this = this;
        }
        let Data = new Uint8Array(data);
        let DecodedData = String.fromCharCode.apply(null, Data)
        if (SPMode == true) {
            console.log("Data(server): " + Data + " Decoded Data(server): " + DecodedData)
        }
        this._send(data);
        window.client = top.client = {
            avatarSize: (size) => {
            let sender = [243,2,25,0,2,22,105,...toByte32(server.infos.woId),70,68,0,0,0,1,115,0,4,115,105,122,101,102,...toFloat(size)]
            _this._send(new Uint8Array(sender))
            //alert(sender)
            },
            kill: (id) => {
                _this._send(new Uint8Array([243, 2, 27, 0, 2, 22, 105, ...toByte32(id), 83, 68, 0, 0, 0, 1, 98, 0, 120, 0, 0, 0, 2, 1, 6]))
            },
            lag: (power) => {
                for (var lag = 0; lag < power; lag++) {
                    _this._send(new Uint8Array([243, 2, 63, 0, 2, 199, 105, 0, 0, 0, 3, 200, 68, 0, 0, 0, 2, 98, 4, 105, 0, 0, 0, 0, 98, 12, 115, 0, 5, 112, 116, 95, 66, 82]))
                }
            },
            messages: {
                super: {
                    all: (message) => {
                        var msgEncoder = new TextEncoder();
                        var msgWS = msgEncoder.encode(message);
                        var msgLength = msgWS.length
                        var authorID = 1;
                        for (var i = 0; i < authorID; authorID++) {
                            var sender = [243, 2, 88, 0, 2, 87, 105, 0, 0, 0, 7, 88, 68, 0, 0, 0, 2, 98, 0, 105, 0, 0, 0, authorID, 98, 5, 115, 0, msgLength, ...msgWS];
                            _this._send(new Uint8Array(sender))
                            if (authorID > 500) {
                                break;
                            }
                        }
                    },
                    says: (message) => {
                        var msgEncoder = new TextEncoder();
                        var msgWS = msgEncoder.encode(message);
                        var msgLength = msgWS.length
                        var authorID = 1;
                        for (var i = 0; i < authorID; authorID++) {
                            var sender = [243, 2, 88, 0, 2, 87, 105, 0, 0, 0, 9, 88, 68, 0, 0, 0, 2, 98, 0, 105, 0, 0, 0, authorID, 98, 5, 115, 0, msgLength, ...msgWS];
                            _this._send(new Uint8Array(sender))
                            if (authorID > 500) {
                                break;
                            }
                        }
                    }
                },
                admin: (message) => {
                    var msgEncoder = new TextEncoder();
                    var msgWS = msgEncoder.encode(message);
                    var msgLength = msgWS.length
                    var sender = [243, 2, 88, 0, 2, 87, 105, 0, 0, 0, 3, 88, 68, 0, 0, 0, 2, 98, 0, 105, 0, 0, 0, 1, 98, 5, 115, 0, msgLength, ...msgWS];
                    _this._send(new Uint8Array(sender))
                },
                error: (message) => {
                    var msgEncoder = new TextEncoder();
                    var msgWS = msgEncoder.encode(message);
                    var msgLength = msgWS.length
                    var sender = [243, 2, 88, 0, 2, 87, 105, 0, 0, 0, 11, 88, 68, 0, 0, 0, 2, 98, 0, 105, 0, 0, 0, 1, 98, 5, 115, 0, msgLength, ...msgWS];
                    _this._send(new Uint8Array(sender))
                },
                getActorNr: () => {
                    var msgEncoder = new TextEncoder();
                    var authorID = 1;
                    for (var i = 0; i < authorID; authorID++) {
                    var msgWS = msgEncoder.encode("<color=red>KCODE:</color> " + authorID);
                    var msgLength = msgWS.length
                        var sender = [243, 2, 88, 0, 2, 87, 105, 0, 0, 0, 7, 88, 68, 0, 0, 0, 2, 98, 0, 105, 0, 0, 0, authorID, 98, 5, 115, 0, msgLength, ...msgWS];
                        _this._send(new Uint8Array(sender))
                        if (authorID > 500) {
                            break;
                        }
                    }
                },
                    messageByActorNr: (message, actorNr, type) => {
                    var msgEncoder = new TextEncoder();
                    var msgWS = msgEncoder.encode(message);
                    var msgLength = msgWS.length
                    var sender = [243, 2, 88, 0, 2, 87, 105, 0, 0, 0,type, 88, 68, 0, 0, 0, 2, 98, 0, 105, 0, 0, 0,actorNr, 98, 5, 115, 0, msgLength, ...msgWS];
                    _this._send(new Uint8Array(sender))
                }
            },
            teams: {
                green: () => _this._send(new Uint8Array([243, 2, 29, 0, 1, 89, 105, 0, 0, 0, 2])),
                yellow: () => _this._send(new Uint8Array([243, 2, 29, 0, 1, 89, 105, 0, 0, 0, 3])),
                blue: () => _this._send(new Uint8Array([243, 2, 29, 0, 1, 89, 105, 0, 0, 0, 0])),
                red: () => _this._send(new Uint8Array([243, 2, 29, 0, 1, 89, 105, 0, 0, 0, 1])),
                white: () => _this._send(new Uint8Array([243, 2, 29, 0, 1, 89, 105, 0, 0, 0, 5])),
                server: () => _this._send(new Uint8Array([243, 2, 29, 0, 1, 89, 105, 0, 0, 0, 6]))
            }
        };
    };
}

function injectScriptElement() {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.textContent = cheatInject.toString().replace(/function .+(){/, "").slice(0, -2);
    document.body.appendChild(script).remove();
}

function Inject(e) {
    if (e.srcElement.documentURI == "https://kogama.com.br/page/webgl-frame/") {
        injectScriptElement();
    } else if (e.srcElement.documentURI == "https://www.kogama.com/page/webgl-frame/") {
        injectScriptElement();
    } else if (e.srcElement.documentURI == "https://friends.kogama.com/page/webgl-frame/") {
        injectScriptElement();
    }
}
window.addEventListener("load", Inject)