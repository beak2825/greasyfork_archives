// ==UserScript==
// @name Zombs.io Script
// @namespace -
// @version v1
// @description Cool. Check greasyfork description.
// @author Nudo#3310
// @match *://zombs.io/*
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/442380/Zombsio%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/442380/Zombsio%20Script.meta.js
// ==/UserScript==

//­

let cvs = document.querySelector('canvas')
/*
let elm = document.getElementsByTagName('*')
for(let i = 0; i < elm.length; ++i) {
    elm[i].oncontextmenu = null
}
*/
let openMenu = `
<div class="hud-spell-icon" data-type="SettingsHack"></div>
<div class="hack-info-holder">
  <div class="hack-inner">
    <div>
      <h4>Settings</h4>
      <h5>Hack</h5>
    </div>
    <div>
      <p>Here you can enable hacks ;3</p>
    </div>
    <div>
      <p style="color: #8ecc51">Click</p>
    </div>
  </div>
</div>
<style>
.hack-inner h4 {
  display: block;
  margin: 0;
  color: #d0d0d0;
}
.hack-inner p {
  margin: 10px 0 0;
  color: #eeeeee;
  white-space: nowrap;
  font-size: 14px;
}
.hack-inner h5 {
  display: block;
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
}
.hack-inner {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.4);
  padding: 10px;
  border-radius: 4px;
}
.hack-inner::after {
  content: ' ';
  display: block;
  position: absolute;
  top: 50%;
  right: 100%;
  margin-top: -6px;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid rgba(0, 0, 0, 0.4);
}
.hack-info-holder {
  display: none;
  position: absolute;
  left: 76px;
  top: -25px;
}
.hud-spell-icons .hud-spell-icon[data-type=SettingsHack]::before {
  background-image: url(https://media.discordapp.net/attachments/776127909651808276/945227208602046524/settings-ico.png);
}
</style>
`
$("#hud-spell-icons").prepend(openMenu)
$('[data-type="SettingsHack"]').hover(() => {
    $('.hack-info-holder').css("display", "block")
}, () => {
    $('.hack-info-holder').css("display", "none")
})

let menu = `
<div class="menu-holder">
  <div class="menu-wrapper">
    <div class="menu-title">
      <h3>Settings</h3>
      <a class="menu-close" id="closeSettings"></a>
    </div>
    <div class="menu-navbar">
      <div class="nav-btns">
        <div id="mainBtn" style="background: rgba(0, 0, 0, 0.4); color: rgba(255, 255, 255, 0.4)">Main</div>
        <div id="miscBtn">Misc</div>
        <div id="sellBtn">Sell</div>
        <div id="botsBtn">Bots</div>
        <div id="upgradesBtn">Upgrades</div>
        <div id="autobaseBtn">AutoBase</div>
      </div>
    </div>
    <div class="menu-content" id="main" style="display: block;"></div>
    <div class="menu-content" id="misc"></div>
    <div class="menu-content" id="bots"></div>
    <div class="menu-content" id="sell"></div>
    <div class="menu-content" id="upgrades"></div>
    <div class="menu-content" id="autobase" style="width: 530px"></div>
    <div class="menu-footer">
      <span>Made by Nudo#3310</span>
    </div>
  </div>
</div>
<style>
.toggler-mark {
  display: none;
  width: 6px;
  height: 12px;
  border: solid #777;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
  border-radius: 2px;
  margin-left: 4.2px;
}
.toggler-checkbox {
  margin-right: 10px;
  margin-top: 2px;
  background: rgba(0, 0, 0, .4);
  width: 15px;
  border-radius: 2px;
  height: 15px;
}
.toggler-action {
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}
.toggler-active {
  display: block;
}
.toggler-display {
  margin-top: 5px;
  padding: 10px;
  background: #444;
  border-radius: 4px;
  height: 35px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
}
.toggler-info {
  display: flex;
  flex-direction: column;
}
.toggler-info #toggler-name {
  font-weight: 1000;
  color: #eee;
  font-size: 16px;
}
.toggler-info #toggler-desc {
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}
.toggler-container {
  width: -webkit-fill-available;
  padding: 10px;
  margin: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  color: #eee;
  display: flex;
  justify-content: space-between;

}
.toggler-display {
  transition: all 0.15s ease-in-out;
}
.toggler-display:hover {
  background-color: #555;
  color: #fff;
}
/*
.menu-navbar #autobaseBtn::after {
  content: 'BETA';
  display: inline-block;
  vertical-align: middle;
  height: 16px;
  line-height: 16px;
  margin: 0 0 0 6px;
  padding: 0 4px;
  font-size: 10px;
  background: #c9523c;
  color: #eee;
  text-shadow: 0 1px 3px rgb(0 0 0 / 20%);
  border-radius: 2px;
}
*/
.menu-content {
  display: none;
  flex-direction: column;
  height: 300px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  border-radius: 0 3px 3px 3px;
}
.menu-footer {
  position: relative;
  bottom: -5px;
}
.menu-footer span {
  font-weight: 1000;
  font-size: 18px;
  color: #d0d0d0;
}

.menu-navbar {
  width: 100%;
}
.nav-btns {
  display: flex;
}
.nav-btns div {
  cursor: pointer;
  display: flex;
  padding: 0 14px;
  margin: 0 1px 0 0;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.15s ease-in-out;
  justify-content: center;
  align-items: center;
  width: 75px;
  height: 35px;
}
.nav-btns div:first-child {
  border-radius: 3px 0 0;
}
.nav-btns div:last-child {
  border-radius: 0 3px 0 0;
}
/*.nav-btns div:active, .nav-btns div:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #eee;
}*/
.menu-title {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
}
.menu-wrapper h3 {
  display: block;
  margin: 0;
  line-height: 20px;
}
.menu-close::after {
  transform: rotate( 320deg);
}
.menu-close {
  cursor: pointer;
  width: 30px;
  height: 30px;
  opacity: 0.2;
  transition: all 0.15s ease-in-out;
}
.menu-close::before {
  transform: rotate(45deg);
}
.menu-close::before, .menu-close::after {
  content: ' ';
  position: absolute;
  height: 30px;
  width: 2px;
  background: #eee;
}
.menu-close:hover, .menu-close:active {
  opacity: 0.4;
}
.menu-wrapper {
  width: 600px;
  height: 420px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: #eee;
  border-radius: 4px;
  z-index: 15;
}
.menu-holder {
  display: none;
  position: absolute;
  width: 100%;
  top: 0;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
`

$("#hud").append(menu)

$('[data-type="SettingsHack"]').click(() => {
    cvs.style.filter = "blur(8px)"
    $(".menu-holder").css(`display`, `flex`)
})

$("#closeSettings").click(() => {
    cvs.style.filter = "none"
    $(".menu-holder").css(`display`, `none`)
})

$(document).mouseup((e) => {
    if ($(".menu-holder").has(e.target).length === 0){
        $(".menu-holder").hide()
        cvs.style.filter = "none"
    }
})

let btns = ["mainBtn", "miscBtn", "autobaseBtn", "sellBtn", "upgradesBtn", "botsBtn"]

$(`#${btns[0]}`).css({"background": "rgba(0, 0, 0, 0.2)", "color": "#eee"})

function activeButton(e) {
    for (let i = 0; i < btns.length; i++) {
        if (e.target.id == btns[i]) $(`#${btns[i]}`).css({"background": "rgba(0, 0, 0, 0.2)", "color": "#eee"})
        else $(`#${btns[i]}`).css({"background": "rgba(0, 0, 0, 0.4)", "color": "rgba(255, 255, 255, 0.4)"})
    }
}

$("#mainBtn").click((e) => {
    activeButton(e)
    $("#main").css("display", "flex")
    $("#misc").css("display", "none")
    $("#upgrades").css("display", "none")
    $("#sell").css("display", "none")
    $("#autobase").css("display", "none")
    $("#bots").css("display", "none")
})

$("#miscBtn").click((e) => {
    activeButton(e)
    $("#misc").css("display", "flex")
    $("#main").css("display", "none")
    $("#upgrades").css("display", "none")
    $("#sell").css("display", "none")
    $("#autobase").css("display", "none")
    $("#bots").css("display", "none")
})

$("#autobaseBtn").click((e) => {
    activeButton(e)
    $("#autobase").css("display", "flex")
    $("#main").css("display", "none")
    $("#misc").css("display", "none")
    $("#upgrades").css("display", "none")
    $("#sell").css("display", "none")
    $("#bots").css("display", "none")
})

$("#sellBtn").click((e) => {
    activeButton(e)
    $("#sell").css("display", "flex")
    $("#main").css("display", "none")
    $("#misc").css("display", "none")
    $("#autobase").css("display", "none")
    $("#upgrades").css("display", "none")
    $("#bots").css("display", "none")
})

$("#upgradesBtn").click((e) => {
    activeButton(e)
    $("#upgrades").css("display", "flex")
    $("#main").css("display", "none")
    $("#misc").css("display", "none")
    $("#autobase").css("display", "none")
    $("#sell").css("display", "none")
    $("#bots").css("display", "none")
})
$("#botsBtn").click((e) => {
    activeButton(e)
    $("#bots").css("display", "flex")
    $("#upgrades").css("display", "none")
    $("#main").css("display", "none")
    $("#misc").css("display", "none")
    $("#autobase").css("display", "none")
    $("#sell").css("display", "none")
})

let packets = {
    0: "PACKET_ENTITY_UPDATE",
    1: "PACKET_PLAYER_COUNTER_UPDATE",
    2: "PACKET_SET_WORLD_DIMENSIONS",
    3: "PACKET_INPUT",
    4: "PACKET_ENTER_WORLD",
    7: "PACKET_PING",
    9: "PACKET_RPC",
    PACKET_ENTER_WORLD: 4,
    PACKET_ENTITY_UPDATE: 0,
    PACKET_INPUT: 3,
    PACKET_PING: 7,
    PACKET_PLAYER_COUNTER_UPDATE: 1,
    PACKET_RPC: 9,
    PACKET_SET_WORLD_DIMENSIONS: 2
}

let ar = [null, Infinity];

class Handler {
    constructor() {
        this.msg = null
        this.uid = null
        this.players = {}
        this.buildings = {}
        this.entities = {}
        this.myPlayer = null
        this.myPet = null
        this.alive = false
        this.visibleModel = null
        this.myStash = null
        this.uaDate = Date.now()
        this.myPartyKey = null
        this.bossWaves = [9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 121]
        this.proc = {
            health: {
                player: 100,
                pet: 100
            }
        }
    }
    updateUid() {
        if (this.msg.uid) {
            this.uid = this.msg.uid
            this.players = {}
            this.buildings = {}
            this.entities = {}
            window.msg = 0
        }
    }
    buyItem(e) {
        Game.currentGame.network.sendRpc({
            "name": "BuyItem",
            "itemName": e,
            "tier": 1
        })
    }
    equipItem(e) {
        Game.currentGame.network.sendRpc({
            "name": "EquipItem",
            "itemName": e,
            "tier": 1
        })
    }
    useItem(e) {
        this.buyItem(e)
        this.equipItem(e)
    }
    entitiesAction(model, action) {
        this.entities = Game.currentGame.world.entities
        for (let ind in this.entities) {
            if (!this.entities.hasOwnProperty(ind)) continue
            let obj = this.entities[ind]
            action(obj, model)
        }
    }
    updateMyStash() {
        this.entitiesAction("GoldStash", (e, m) => {
            if (e.fromTick.model == m) {
                this.myStash = e
            }
        })
    }
    upgradeAll() {
        this.entitiesAction("GoldStash", (e, m) => {
            if (e.fromTick.model != m) {
                Game.currentGame.network.sendRpc({
                    name: "UpgradeBuilding",
                    uid: e.fromTick.uid
                })
            }
        })
    }
    /*revivePets() {
        for(let idn in game.world.entities) {
            if(game.world.entities[idn].fromTick.model == "PetCARL" || game.world.entities[idn].fromTick.model == "PetMiner") {
                Game.currentGame.network.sendRpc({
                    name: "purchaseItem",
                    itemName: "PetRevive",
                    uid: game.world.entities[idn].fromTick.uid
                });
            }
        }
    }*/
    sellPets() {
        for(let idn in game.world.entities) {
            if(game.world.entities[idn].fromTick.model == "PetCARL" || game.world.entities[idn].fromTick.model == "PetMiner") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: game.world.entities[idn].fromTick.uid
                });
            }
        }
    }
    delAction(model) {
        this.entities = Game.currentGame.world.entities
        for (let ind in this.entities) {
            if (!this.entities.hasOwnProperty(ind)) continue;
            if (this.entities[ind].fromTick.model == model) {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: this.entities[ind].fromTick.uid
                });
            }
        }
    }
    sellBuilding(model, {verify, content}) {
        if (verify) {
            Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation(content, 1e4, () => {
                this.delAction(model)
            })
        } else {
            this.delAction(model)
        }
    }
    sellAll() {
        Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure?", 1e4, () => {
            this.entities = Game.currentGame.world.entities
            for (let ind in this.entities) {
                if (!this.entities.hasOwnProperty(ind)) continue;
                if (this.entities[ind].fromTick.model != "GoldStash") {
                    Game.currentGame.network.sendRpc({
                        name: "DeleteBuilding",
                        uid: this.entities[ind].fromTick.uid
                    });
                }
            }
        })
    }
    ahrc() {
        let depTier = [0.07, 0.11, 0.17, 0.22, 0.25, 0.28, 0.42, 0.65]
        this.entitiesAction("Harvester", (e) => {
            if (e.fromTick.deposit > 0) {
                Game.currentGame.network.sendRpc({
                    name: "CollectHarvester",
                    uid: e.fromTick.uid
                });
            }
            for (let i = 0; i < depTier.length; i++) {
                let tc = i + 1
                if (e.fromTick.tier == tc) {
                    if (e.fromTick.deposit <= 0) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: e.fromTick.uid,
                            deposit: depTier[i]
                        });
                    }
                }
            }
        })
    }
    heal(type) {
        switch (type) {
            case "proc":
                if (this.myPlayer) {
                    this.proc.health.player = (this.myPlayer.health / this.myPlayer.maxHealth) * 100
                    if (this.myPet) {
                        this.proc.health.pet = (this.myPet.health / this.myPet.maxHealth) * 100
                    }
                }
                window.proc = this.proc
                break
            case "player":
                if (this.myPlayer) {
                    if (this.proc.health.player <= 35) {
                        this.useItem("HealthPotion")
                    }
                }
                break
            case "pet":
                if (this.myPet) {
                    if (this.proc.health.pet <= 35) {
                        this.useItem("PetHealthPotion")
                    }
                }
                break
        }
    }
    waveInfo() {
        if ($("#hud-day-night-overlay").css("opacity") < 0.5) {
            if (!scoreLog.n || Date.now() - scoreLog.n >= 1000) {
                if ($("#hud-day-night-overlay").css("opacity") < 0.5) {
                    scoreLog.night = true
                    scoreLog.day = false
                }
                scoreLog.n = Date.now()
            }
        }
        if ($("#hud-day-night-overlay").css("opacity") > 0.5) {
            if (!scoreLog.d || Date.now() - scoreLog.d >= 1000) {
                if ($("#hud-day-night-overlay").css("opacity") > 0.5) {
                    scoreLog.night = false
                    scoreLog.day = true
                }
                scoreLog.d = Date.now()
            }
        }
        if (scoreLog.timer.enabled) {
            if (!scoreLog.timer.dateS || Date.now() - scoreLog.timer.dateS >= 1000) {
                scoreLog.timer.sec -= 1
                scoreLog.timer.dateS = Date.now()
            }
            $("#wave-timer").text(scoreLog.timer.sec + "s")
            document.getElementById("waveBarInner").style.width = 100 * (scoreLog.timer.sec / scoreLog.timer.max) + "%"
        }
    }
    autoRespawn() {
        if (document.querySelector('.hud-respawn').style.display == "none") return
        game.inputPacketScheduler.scheduleInput({
            respawn: 1
        })
        document.querySelector('.hud-respawn').style.display = "none"
    }
    clickImitation(e) {
        switch (e) {
            case "space":
                game.network.sendInput({space: 0})
                game.network.sendInput({space: 1})
                break
            case "up":
                Game.currentGame.network.sendInput({
                    up: 1
                })
                break
            case "down":
                Game.currentGame.network.sendInput({
                    down: 1
                })
                break
            case "left":
                Game.currentGame.network.sendInput({
                    left: 1
                })
                break
            case "right":
                Game.currentGame.network.sendInput({
                    right: 1
                })
                break
        }
    }
    putBuilding(x, y, model, yaw = 180) {
        Game.currentGame.network.sendRpc({
            name: "MakeBuilding",
            x: x,
            y: y,
            type: model,
            yaw: yaw
        })
    }
    findNearPlayer(ourUID, ourX, ourY) {
        ar[0] = null;
        ar[1] = Infinity;
        for(let key in Game.currentGame.world.entities) {
            const entity = Game.currentGame.world.entities[key];
            if(!entity || entity.targetTick.uid == ourUID || !entity.targetTick || entity.entityClass !== "PlayerEntity" || game.world.localPlayer.entity.targetTick.partyId == entity.targetTick.partyId) continue;
            const position = entity.targetTick.position;
            const dist = (ourX - position.x) ** 2 + (ourY - position.y) ** 2;
            if(dist < ar[1]){
                ar[1] = dist;
                ar[0] = entity;
            }
        }
        return ar;
    }
    setMouseMoved(e) {
        game.network.sendInput({
            mouseMoved: e
        })
    }
    lookYaw({x1, x2}, {y1, y2}) {
        return game.inputPacketCreator.screenToYaw((-x1 + x2) * 100, (-y1 + y2) * 100)
    }
    autoAim() {
        if (this.players.uid) {
            const [target, distSqrd] = this.findNearPlayer(
                game.world.localPlayer.entity.targetTick.uid,
                game.world.localPlayer.entity.targetTick.position.x,
                game.world.localPlayer.entity.targetTick.position.y);
            if (target) {
                this.setMouseMoved(this.lookYaw({
                    x1: game.world.localPlayer.entity.targetTick.position.x,
                    x2: target.targetTick.position.x
                }, {
                    y1: game.world.localPlayer.entity.targetTick.position.y,
                    y2: target.targetTick.position.y
                }))
                console.log(target.targetTick)
                document.querySelector(".player-info-holder").innerHTML += `
                <div class="box">
                  <div id="name" style="color: #cc5151">Aim at: ${target.targetTick.name}</div>
                </div>`
            }
        }
    }
    buySpear() {
        let getTierText = $("[data-item='Spear'] > .hud-shop-item-tier").text()
        let getTier = getTierText.split(" ")[1]
        if (getTier == 1 && this.myPlayer.gold > 1400) {
            this.useItem("Spear")
        }
    }
    update() {
        if (tgl.autorespawn) this.autoRespawn()
        this.waveInfo()
        this.updateUid()
        this.alive = game.world.inWorld
        if (this.msg.entities) {
            if (window.msg == 0) {
                game.world.replicator.onEntityUpdate(this.msg);
            }
            if (this.msg.entities[this.uid].name) {
                this.myPlayer = this.msg.entities[this.uid];
            }
            for (let ind in this.myPlayer) {
                if (this.myPlayer[ind] !== this.msg.entities[this.uid][ind] && this.msg.entities[this.uid][ind] !== undefined) {
                    this.myPlayer[ind] = this.msg.entities[this.uid][ind];
                }
            }
            if (this.myPlayer.petUid) {
                if (this.msg.entities[this.myPlayer.petUid]) {
                    if (this.msg.entities[this.myPlayer.petUid].model) {
                        this.myPet = this.msg.entities[this.myPlayer.petUid];
                    }
                }
                for (let ind in this.myPet) {
                    if (this.msg.entities[this.myPlayer.petUid]) {
                        if (this.myPet[ind] !== this.msg.entities[this.myPlayer.petUid][ind] && this.msg.entities[this.myPlayer.petUid][ind] !== undefined) {
                            this.myPet[ind] = this.msg.entities[this.myPlayer.petUid][ind]
                        }
                    }
                }
            }
        }
        if (this.alive) {
            //this.revivePets()
            updatePlayerInfo()
            this.updateMyStash()
            this.myPartyKey = Game.currentGame.ui.getPlayerPartyShareKey()
            this.heal("proc")
            if (tgl.autoaim) {
                this.autoAim()
            }
            if (tgl.autobuyspear) {
                this.buySpear()
            }
            if (lockYaw.active) {
                this.setMouseMoved(lockYaw.yaw)
            }
            if (tgl.autospacebar) {
                this.clickImitation("space")
            }
            if (tgl.autoheal) {
                this.heal("player")
            }
            if (tgl.petheal) {
                this.heal("pet")
            }
            if (tgl.ahrc) {
                this.ahrc()
            }
            if (tgl.upgradesall) {
                // Anti lag night
                if (scoreLog.night) {
                    if (!this.uaDate || Date.now() - this.uaDate >= 1000) {
                        this.upgradeAll()
                        this.uaDate = Date.now()
                    }
                } else {
                    this.upgradeAll()
                }
            }
            if (tgl.bsbase) {
                BSBase()
            }
        }
    }
}

let handler = new Handler()
game.network.addPacketHandler = (e, cb) => {
    game.network.emitter.on(packets[e], cb)
}

game.network.emitter.removeListener('PACKET_ENTITY_UPDATE', game.network.emitter._events.PACKET_ENTITY_UPDATE)

game.network.addPacketHandler(0, e => {
    handler.msg = e
    handler.update()
})

for (let i = 0; i < 10; i++) {
    game.network.addPacketHandler(i, function(e) {
        handler.msg = e
        handler.update()
    })
}


window.sendBot = () => {
    console.log("Send bot")
    // connect(game.options.servers[game.options.serverId].hostname, "8000")
}


let playerInfo = `
<div class="player-info-holder">
</div>
<style>
.box {
  font-weight: 1000;
  color: white;
  display: flex;
  foxt-size: 14px;
}
.box #name {
  color: #a79aef;
  text-shadow: 0px 0px 5px blue, 0px 0px 5px blue;
}
.player-info-holder {
  pointer-events: none;
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 290px;
  left: 76px;
}
</style>
`

$("#hud").append(playerInfo)

function addPlayer(name, res, party) {
    document.querySelector(".player-info-holder").innerHTML += `
  <div class="box">
   <div id="name" style="color: ${handler.myPlayer.partyId == party ? "#8ecc51" : "#a79aef"}">${name}&nbsp</div>
   <div id="res">[${res}]</div>
  </div>
  `
}

function updatePlayerInfo() {
    document.querySelector(".player-info-holder").innerHTML = ""
    Object.entries(Game.currentGame.world.entities).forEach((stuff => {
        if (stuff[1].targetTick.entityClass == "PlayerEntity" && ((stuff[1].targetTick.uid !== Game.currentGame.world.entities[Game.currentGame.world.getMyUid()].targetTick.uid) || window.useSamePI)) {
            let rr = Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick
            handler.players = rr
            let hp = (rr.health / rr.maxHealth) * 100
            let res = `Gold: ${rr.gold},
            Wood: ${rr.wood},
            Stone: ${rr.stone},
            Hp: ${~~(hp)}%`
            addPlayer(stuff[1].targetTick.name, res, rr.partyId)
        }
    }))
}

let dimension = 1;

const onWindowResize = () => {
    const renderer = Game.currentGame.renderer;
    let canvasWidth = window.innerWidth * window.devicePixelRatio;
    let canvasHeight = window.innerHeight * window.devicePixelRatio;
    let ratio = Math.max(canvasWidth / (1920 * dimension), canvasHeight / (1080 * dimension));
    renderer.scale = ratio;
    renderer.entities.setScale(ratio);
    renderer.ui.setScale(ratio);
    renderer.renderer.resize(canvasWidth, canvasHeight);
    renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
    renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
}

onWindowResize()

window.addEventListener("resize", () => {
    onWindowResize()
})

window.dpr = (e) => {
    window.devicePixelRatio = e
    onWindowResize()
}

function disableEvent() {
    let els = [".menu-holder", "#hud-menu-party", "#hud-menu-shop", "#hud-menu-settings"]
    for (let i = 0; i < els.length; i++) {
        if ($(els[i]).css("display") != "none") {
            return true
        }
        return false
    }
}

window.addEventListener("wheel", function(e, t = 1.003) {
    if (disableEvent() || !tgl.wheelzoom || $("#hud-chat").hasClass("is-focused")) return
    if (e.deltaY > 0) {
        for(let i = 0; i < 50; i++) {
            setTimeout(() => {
                dimension = dimension * t
                onWindowResize()
            }, i * 5)
        };
    } else if(e.deltaY <= 1){
        for(let i = 0; i < 50; i++) {
            setTimeout(() => {
                dimension = dimension / t
                onWindowResize()
            }, i * 5)
        };
    }
});

let lockYaw = {
    active: false,
    yaw: 0
}

let clearChat = {
    cmd: "!clear",
    active: false
}

function checkChat() {
    if ($(".hud-chat-input").val() == clearChat.cmd) {
        clearChat.active = true
    }
}

document.addEventListener("keydown", e => {
    if (e.code == "Enter") {
        checkChat()
        if (clearChat.active) {
            document.querySelector(".hud-chat-messages").innerHTML = ""
            clearChat.active = false
            setTimeout(() => {
                document.querySelector(".hud-chat-messages").innerHTML = ""
            }, 500)
        }
    }
    if (e.code == "KeyX") {
        lockYaw.active = !lockYaw.active
        if (lockYaw.active) {
            lockYaw.yaw = game.world.localPlayer.entity.targetTick.yaw
        } else {
            lockYaw.yaw = null
        }
    }
})

let dni = `
<div class="dni-holder">
  <div id="lastscore">Score for last night: 0</div>
  <div class="waveBar">
    <div class="timer-holder">
      <span id="wave-timer">0s</span>
    </div>
    <div id="waveBarInner"></div>
  </div>
</div>
<style>
.timer-holder {
  position: absolute;
  width: 200px;
  height: 30px;
  display: flex;
  margin-left: -3px;
  margin-top: -3px;
  justify-content: center;
  align-items: center;
}
.timer-holder span {
  font-size: 20px;
  font-weight: 1000;
  color: #2d2d2d;
}
#waveBarInner {
  width: 0%;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 6px;
}
.waveBar {
  margin: 5px;
  padding: 3px;
  width: 200px;
  height: 30px;
  background: rgb(0 0 0 / 20%);
  border-radius: 6px;
}
#lastscore {
  font-weight: 1000;
  font-size: 25px;
  color: #d0d0d0;
}
.dni-holder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
`

$("#hud").append(dni)

let scoreLog = {
    night: false,
    day: false,
    d: Date.now(),
    n: Date.now(),
    new: null,
    old: null,
    last: null,
    date: Date.now(),
    timer: {
        sec: 0,
        dateS: Date.now(),
        enabled: false,
        max: 59
    }
}

Game.currentGame.network.addRpcHandler("DayCycle", () => {
    if (scoreLog.night) {
        scoreLog.timer.sec = scoreLog.timer.max
        document.getElementById("waveBarInner").style.width = "100%"
        scoreLog.timer.enabled = true
        scoreLog.old = Game.currentGame.ui.playerTick.score
        $("#lastscore").text(`Score for last night: ...`)
    }
    if (scoreLog.day) {
        document.getElementById("waveBarInner").style.background = "rgba(255, 255, 255, 0.4)"
        $("#wave-timer").text("0s")
        document.getElementById("waveBarInner").style.width = "0%"
        scoreLog.timer.enabled = false
        scoreLog.new = Game.currentGame.ui.playerTick.score
        scoreLog.last = (scoreLog.new - scoreLog.old)
        $("#lastscore").text(`Score for last night: ${scoreLog.last}`)
    }
})


let checkbMAIN = [{
    name: "AutoPlayerHeal",
    desc: "Auto uses heal potion",
    id: "autoheal",
    action: "Enabled",
    active: true,
    button: false
},{
    name: "AutoPetHeal",
    desc: "Auto uses pet heal potion",
    id: "petheal",
    action: "Enabled",
    active: true,
    button: false
},{
    name: "AHRC",
    desc: "Auto collect resources from harvester",
    id: "ahrc",
    action: "Disabled",
    active: false,
    button: false
},{
    name: "AutoSpear",
    desc: "Auto buy spear [tier: 1]",
    id: "autobuyspear",
    action: "Disabled",
    active: false,
    button: false
},{
    name: "AutoSpaceBar",
    desc: "Automatically clicks on the space bar",
    id: "autospacebar",
    action: "Disabled",
    active: false,
    button: false
},{
    name: "AutoAim",
    desc: "you will look at the enemy, but you will not turn around",
    id: "autoaim",
    action: "Disabled",
    active: false,
    button: false
}]
let checkbMISC = [{
    name: "WheelZoom",
    desc: "Changes the visible part of the game",
    id: "wheelzoom",
    action: "Enabled",
    active: true,
    button: false
},{
    name: "LeaveFromClan",
    desc: "You will leave the clan you are in",
    id: "leaveclan",
    action: "Leave",
    button: true
},{
    name: "AutoRespawn",
    desc: "Respawn you after death",
    id: "autorespawn",
    action: "Enabled",
    active: true,
    button: false
}]
let checkbSELL = [{
    name: "SellPets",
    desc: "Remove your pet",
    id: "sellpets",
    action: "Sell",
    button: true
},{
    name: "All",
    desc: "Sell everything",
    id: "sellall",
    action: "Sell",
    button: true
},{
    name: "Walls",
    desc: "Sell walls",
    id: "sellwalls",
    action: "Sell",
    button: true
},{
    name: "Doors",
    desc: "Sell doors",
    id: "selldoors",
    action: "Sell",
    button: true
},{
    name: "Traps",
    desc: "Sell traps",
    id: "selltraps",
    action: "Sell",
    button: true
},{
    name: "ArrowTowers",
    desc: "Sell arrow towers",
    id: "sellarrows",
    action: "Sell",
    button: true
},{
    name: "CannonTowers",
    desc: "Sell cannon towers",
    id: "sellcannons",
    action: "Sell",
    button: true
},{
    name: "MeleeTowers",
    desc: "Sell melee towers",
    id: "sellmelees",
    action: "Sell",
    button: true
},{
    name: "BombTowers",
    desc: "Sell bomb towers",
    id: "sellbombs",
    action: "Sell",
    button: true
},{
    name: "MageTowers",
    desc: "Sell mage towers",
    id: "sellmages",
    action: "Sell",
    button: true
},{
    name: "GoldMines",
    desc: "Sell gold mines",
    id: "sellgoldmines",
    action: "Sell",
    button: true
},{
    name: "Harvesters",
    desc: "Sell harvesters",
    id: "sellharvesters",
    action: "Sell",
    button: true
},{
    name: "GoldStash",
    desc: "Sell gold stash",
    id: "sellgoldstash",
    action: "Sell",
    button: true
}]
let checkbBOTS = [{
    name: "SendBot",
    desc: "Send one bot",
    id: "sendbot",
    action: "Send",
    button: true
}]
let checkbUPGRADES = [{
    name: "UpgradesAll",
    desc: "Improves all buildings",
    id: "upgradesall",
    action: "Disabled",
    active: false,
    button: false
}]
let checkbAUTOBASE = [{
    name: "BSBase",
    desc: "[BryanSmithBase] Hack will create a base for you by itself",
    id: "bsbase",
    action: "Disabled",
    active: false,
    button: false
}]

let tgl = {
    autoheal: true,
    petheal: true,
    ahrc: false,
    wheelzoom: true,
    upgradesall: false,
    autorespawn: true,
    autospacebar: false,
    autoaim: false,
    bsbase: false,
    autobuyspear: false
}

function addTogglerHTML(loc, button, name, desc, id, action, active) {
    if (!button) {
        document.getElementById(loc).innerHTML += `
    <div class="toggler-container">
      <div class="toggler-info">
        <div id="toggler-name">${name}</div>
        <div id="toggler-desc">${desc}</div>
      </div>
      <div class="toggler-display" id="${id}">
        <span class="toggler-checkbox"><span class="toggler-mark ${active ? "toggler-active" : ""}" id="${id}-checkbox"></span></span>
        <span class="toggler-action" id="${id}-action">${action}</span>
      </div>
    </div>
`
    } else {
        document.getElementById(loc).innerHTML += `
    <div class="toggler-container">
      <div class="toggler-info">
        <div id="toggler-name">${name}</div>
        <div id="toggler-desc">${desc}</div>
      </div>
      <div class="toggler-display" id="${id}">
        <span class="toggler-action">${action}</span>
      </div>
    </div>
`
    }
}

function checkboxGenerator() {
    for (let i = 0; i < checkbMAIN.length; i++) {
        if (checkbMAIN[i].name) addTogglerHTML("main", checkbMAIN[i].button, checkbMAIN[i].name, checkbMAIN[i].desc, checkbMAIN[i].id, checkbMAIN[i].action || null, checkbMAIN[i].active || null)
    }
    for (let i = 0; i < checkbMISC.length; i++) {
        if (checkbMISC[i].name) addTogglerHTML("misc", checkbMISC[i].button, checkbMISC[i].name, checkbMISC[i].desc, checkbMISC[i].id, checkbMISC[i].action || null, checkbMISC[i].active || null)
    }
    for (let i = 0; i < checkbSELL.length; i++) {
        if (checkbSELL[i].name) addTogglerHTML("sell", checkbSELL[i].button, checkbSELL[i].name, checkbSELL[i].desc, checkbSELL[i].id, checkbSELL[i].action || null, checkbSELL[i].active || null)
    }
    for (let i = 0; i < checkbBOTS.length; i++) {
        if (checkbBOTS[i].name) addTogglerHTML("bots", checkbBOTS[i].button, checkbBOTS[i].name, checkbBOTS[i].desc, checkbBOTS[i].id, checkbBOTS[i].action, checkbBOTS[i].active)
    }
    for (let i = 0; i < checkbUPGRADES.length; i++) {
        if (checkbUPGRADES[i].name) addTogglerHTML("upgrades", checkbUPGRADES[i].button, checkbUPGRADES[i].name, checkbUPGRADES[i].desc, checkbUPGRADES[i].id, checkbUPGRADES[i].action || null, checkbUPGRADES[i].active || null)
    }
    for (let i = 0; i < checkbAUTOBASE.length; i++) {
        if (checkbAUTOBASE[i].name) addTogglerHTML("autobase", checkbAUTOBASE[i].button, checkbAUTOBASE[i].name, checkbAUTOBASE[i].desc, checkbAUTOBASE[i].id, checkbAUTOBASE[i].action || null, checkbAUTOBASE[i].active || null)
    }
}

checkboxGenerator()

function updateCheckBox(n, e) {
    if (e) {
        $(`#${n}-action`).text("Enabled")
        $(`#${n}-checkbox`).addClass("toggler-active")
    } else {
        $(`#${n}-action`).text("Disabled")
        $(`#${n}-checkbox`).removeClass("toggler-active")
    }
}

$("#autoheal").click(() => (tgl.autoheal = !tgl.autoheal, updateCheckBox("autoheal", tgl.autoheal)))
$("#petheal").click(() => (tgl.petheal = !tgl.petheal, updateCheckBox("petheal", tgl.petheal)))
$("#ahrc").click(() => (tgl.ahrc = !tgl.ahrc, updateCheckBox("ahrc", tgl.ahrc)))
$("#wheelzoom").click(() => (tgl.wheelzoom = !tgl.wheelzoom, updateCheckBox("wheelzoom", tgl.wheelzoom)))
$("#leaveclan").click(() => Game.currentGame.network.sendRpc({name: "LeaveParty"}))
$("#upgradesall").click(() => (tgl.upgradesall = !tgl.upgradesall, updateCheckBox("upgradesall", tgl.upgradesall)))
$("#sendbot").click(() => window.sendBot())
$("#autorespawn").click(() => (tgl.autorespawn = !tgl.autorespawn, updateCheckBox("autorespawn", tgl.autorespawn)))
$("#autospacebar").click(() => (tgl.autospacebar = !tgl.autospacebar, updateCheckBox("autospacebar", tgl.autospacebar)))
$("#autoaim").click(() => (tgl.autoaim = !tgl.autoaim, updateCheckBox("autoaim", tgl.autoaim)))
$("#sellpets").click(() => handler.sellPets())
$("#bsbase").click(() => (tgl.bsbase = !tgl.bsbase, updateCheckBox("bsbase", tgl.bsbase)))
$("#autobuyspear").click(() => (tgl.autobuyspear = !tgl.autobuyspear, updateCheckBox("autobuyspear", tgl.autobuyspear)))

$("#sellall").click(() => handler.sellAll())
$("#sellwalls").click(() => handler.sellBuilding("Wall", {verify: false, content: ""}))
$("#selldoors").click(() => handler.sellBuilding("Door", {verify: false, content: ""}))
$("#selltraps").click(() => handler.sellBuilding("SlowTrap", {verify: false, content: ""}))
$("#sellarrows").click(() => handler.sellBuilding("ArrowTower", {verify: false, content: ""}))
$("#sellcannons").click(() => handler.sellBuilding("ConnonTower", {verify: false, content: ""}))
$("#sellmelees").click(() => handler.sellBuilding("MeleeTower", {verify: false, content: ""}))
$("#sellbombs").click(() => handler.sellBuilding("BombTower", {verify: false, content: ""}))
$("#sellmages").click(() => handler.sellBuilding("MageTower", {verify: false, content: ""}))
$("#sellgoldmines").click(() => handler.sellBuilding("GoldMine", {verify: false, content: ""}))
$("#sellharvesters").click(() => handler.sellBuilding("Harvester", {verify: false, content: ""}))
$("#sellgoldstash").click(() => handler.sellBuilding("GoldStash", {verify: true, content: "Are you sure?"}))

function OWBase() {
    if (!handler.myStash.targetTick) return
    let stash = handler.myStash.targetTick
    let stashPosition = {
        x: stash.position.x,
        y: stash.position.y
    }
    }

function BSBase() {
    if (!handler.myStash.targetTick) return
    let stash = handler.myStash.targetTick
    let stashPosition = {
        x: stash.position.x,
        y: stash.position.y
    }
    handler.putBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);
    handler.putBuilding(stashPosition.x + -192, stashPosition.y + -48, 'GoldMine', 0);
    handler.putBuilding(stashPosition.x + -192, stashPosition.y + 48, 'GoldMine', 0);
    handler.putBuilding(stashPosition.x + -48, stashPosition.y + -192, 'GoldMine', 0);
    handler.putBuilding(stashPosition.x + 48, stashPosition.y + -192, 'GoldMine', 0);
    handler.putBuilding(stashPosition.x + 192, stashPosition.y + -48, 'GoldMine', 0);
    handler.putBuilding(stashPosition.x + 192, stashPosition.y + 48, 'GoldMine', 0);
    handler.putBuilding(stashPosition.x + -48, stashPosition.y + 192, 'GoldMine', 0);
    handler.putBuilding(stashPosition.x + 48, stashPosition.y + 192, 'GoldMine', 0);
    handler.putBuilding(stashPosition.x + -144, stashPosition.y + 288, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + -48, stashPosition.y + 288, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 48, stashPosition.y + 288, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 144, stashPosition.y + 288, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + -288, stashPosition.y + -48, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + -288, stashPosition.y + 144, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 48, stashPosition.y + -288, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 288, stashPosition.y + -144, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 288, stashPosition.y + -48, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 288, stashPosition.y + 48, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 288, stashPosition.y + 144, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 384, stashPosition.y + 144, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 480, stashPosition.y + 144, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 336, stashPosition.y + 240, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 432, stashPosition.y + 240, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 384, stashPosition.y + 336, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 144, stashPosition.y + 384, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 144, stashPosition.y + 480, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 48, stashPosition.y + 576, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + 240, stashPosition.y + 432, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + -288, stashPosition.y + -144, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + -384, stashPosition.y + -144, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + -480, stashPosition.y + -144, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + -432, stashPosition.y + -240, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + -336, stashPosition.y + -240, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + -336, stashPosition.y + 240, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + -144, stashPosition.y + 384, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + -240, stashPosition.y + 432, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + -144, stashPosition.y + -288, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + -144, stashPosition.y + -384, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + -144, stashPosition.y + -480, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + -240, stashPosition.y + -432, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + -336, stashPosition.y + -384, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + 144, stashPosition.y + -288, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + 144, stashPosition.y + -384, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + 144, stashPosition.y + -480, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + 240, stashPosition.y + -432, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + 336, stashPosition.y + -384, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + 336, stashPosition.y + -240, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + 432, stashPosition.y + -240, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + 528, stashPosition.y + -240, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + 480, stashPosition.y + -144, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + 576, stashPosition.y + -144, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + 384, stashPosition.y + -144, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + 480, stashPosition.y + -48, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + 480, stashPosition.y + 48, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + 576, stashPosition.y + -48, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + 576, stashPosition.y + 48, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + 240, stashPosition.y + 528, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + 144, stashPosition.y + 576, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + 48, stashPosition.y + 384, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + -48, stashPosition.y + 384, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + 48, stashPosition.y + 480, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + -48, stashPosition.y + 480, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + -48, stashPosition.y + 576, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + -144, stashPosition.y + 480, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + -384, stashPosition.y + 48, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + -384, stashPosition.y + 144, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + -480, stashPosition.y + -48, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + -480, stashPosition.y + 48, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + -480, stashPosition.y + 144, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 0);
    handler.putBuilding(stashPosition.x + -384, stashPosition.y + 336, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -48, stashPosition.y + -480, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + -48, stashPosition.y + -384, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + 48, stashPosition.y + -384, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + 48, stashPosition.y + -480, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + 48, stashPosition.y + -576, 'BombTower', 0);
    handler.putBuilding(stashPosition.x + 144, stashPosition.y + -576, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + 240, stashPosition.y + -528, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + 336, stashPosition.y + -480, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -48, stashPosition.y + -576, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -144, stashPosition.y + -576, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -240, stashPosition.y + -528, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -336, stashPosition.y + -480, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -576, stashPosition.y + 48, 'ArrowTower', 0);
    handler.putBuilding(stashPosition.x + -576, stashPosition.y + 144, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -576, stashPosition.y + -48, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -576, stashPosition.y + -144, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -528, stashPosition.y + -240, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -480, stashPosition.y + -336, 'MagicTower', 0);
    handler.putBuilding(stashPosition.x + -144, stashPosition.y + -192, 'Harvester', 0);
    handler.putBuilding(stashPosition.x + 144, stashPosition.y + -192, 'Harvester', 0);
    handler.putBuilding(stashPosition.x + 144, stashPosition.y + 192, 'Harvester', 0);
    handler.putBuilding(stashPosition.x + -144, stashPosition.y + 192, 'Harvester', 0);
    handler.putBuilding(stashPosition.x + -648, stashPosition.y + -168, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -648, stashPosition.y + -120, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -648, stashPosition.y + -72, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -648, stashPosition.y + -24, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -648, stashPosition.y + 24, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -648, stashPosition.y + 72, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -648, stashPosition.y + 120, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -648, stashPosition.y + 168, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 600, stashPosition.y + 120, 'Door', 0);
    handler.putBuilding(stashPosition.x + 552, stashPosition.y + 120, 'Door', 0);
    handler.putBuilding(stashPosition.x + 552, stashPosition.y + 168, 'Door', 0);
    handler.putBuilding(stashPosition.x + 600, stashPosition.y + 168, 'Door', 0);
    handler.putBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 648, stashPosition.y + -72, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -120, stashPosition.y + -648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -72, stashPosition.y + -648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 24, stashPosition.y + -648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -72, stashPosition.y + 648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Wall', 0);
    handler.putBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Wall', 0);
    handler.putBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0);
    handler.putBuilding(stashPosition.x + 216, stashPosition.y + 360, 'Door', 0);
    handler.putBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 0);
    handler.putBuilding(stashPosition.x + 216, stashPosition.y + -120, 'Door', 0);
    handler.putBuilding(stashPosition.x + -216, stashPosition.y + -120, 'Door', 0);
    handler.putBuilding(stashPosition.x + -216, stashPosition.y + 120, 'Door', 0);
    handler.putBuilding(stashPosition.x + 216, stashPosition.y + 120, 'Door', 0);
    handler.putBuilding(stashPosition.x + 216, stashPosition.y + -312, 'Door', 0);
    handler.putBuilding(stashPosition.x + 216, stashPosition.y + -360, 'Door', 0);
    handler.putBuilding(stashPosition.x + 264, stashPosition.y + -360, 'Door', 0);
    handler.putBuilding(stashPosition.x + -216, stashPosition.y + -360, 'Door', 0);
    handler.putBuilding(stashPosition.x + -216, stashPosition.y + -312, 'Door', 0);
    handler.putBuilding(stashPosition.x + -264, stashPosition.y + -360, 'Door', 0);
    handler.putBuilding(stashPosition.x + -216, stashPosition.y + 312, 'Door', 0);
    handler.putBuilding(stashPosition.x + -216, stashPosition.y + 360, 'Door', 0);
    handler.putBuilding(stashPosition.x + -264, stashPosition.y + 360, 'Door', 0);
}







