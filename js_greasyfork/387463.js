// ==UserScript==
// @name         Zombs.io Gold Gen
// @namespace    https://www.youtube.com/channel/UCC4Q28czyJPjSPtYQerbPGw
// @version      null
// @description  Description goes there
// @author       DemostanisYt & Ultimate Mod
// @match        http://zombs.io/*
// @match        http://zombs.x10.bz/*
// @info         Info goes there
// @how-to-use   You need to farm till 500 wood and stone, before placing stash there is a Button you press in Settings called Enable Gold genarator then u press it then you place stash
// @downloadURL https://update.greasyfork.org/scripts/387463/Zombsio%20Gold%20Gen.user.js
// @updateURL https://update.greasyfork.org/scripts/387463/Zombsio%20Gold%20Gen.meta.js
// ==/UserScript==
Game.currentGame.network.addEnterWorldHandler(() => {
const placeBuilding = (x, y, building, yaw) => {
        Game.currentGame.network.sendRpc({
                name: "MakeBuilding",
                x: x,
                y: y,
                type: building,
                yaw: yaw
        })

        upgradeSlowTraps()
        sellSlowTraps()
},
        sellSlowTraps = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "SlowTrap") {
                                Game.currentGame.network.sendRpc({
                                        "name": "DeleteBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },
        upgradeStash = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "GoldStash") {
                                Game.currentGame.network.sendRpc({
                                        "name": "UpgradeBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },
        upgradeSlowTraps = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "SlowTrap") {
                                Game.currentGame.network.sendRpc({
                                        "name": "UpgradeBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },
        upgradeGoldMines = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "GoldMine") {
                                Game.currentGame.network.sendRpc({
                                        "name": "UpgradeBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },
        upgradeBase = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(["MeleeTower", "MagicTower", "CannonTower", "BombTower", "ArrowTower", "Door" || "Wall"].indexOf(obj.fromTick.model) >= 0) {
                                Game.currentGame.network.sendRpc({
                                        "name": "UpgradeBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },
        state = {
                "stopped": true
        },
        start = () => state.stopped = false,
        stop = () => state.stopped = true,
        grid = document.querySelector(".hud-settings-grid")

grid.innerHTML += `<button
        class="KodeLlmsaBgcZ">
        Enable gold generator
</button>`

Array.prototype.slice.call(grid.childNodes)
        .find(c => c.classList && c.classList.value == "KodeLlmsaBgcZ")
                .addEventListener("click", e => {
        switch(e.target.innerText) {
                case "Enable gold generator":
                        e.target.innerText = "Disable gold generator"
                        start()
                        break
                case "Disable gold generator":
                        e.target.innerText = "Enable gold generator"
                        stop()
                        break
        }
})

Game.currentGame.network.addRpcHandler("LocalBuilding", e => {
        if(e[0].type === "GoldStash" && !e[0].dead && e[0].tier === 1) {
                if(state.stopped) return
                placeBuilding(e[0].x + -48, e[0].y + -96, "GoldMine", 0)
                placeBuilding(e[0].x + 48, e[0].y + -96, "GoldMine", 0)
                placeBuilding(e[0].x + 96, e[0].y + 0, "GoldMine", 0)
                placeBuilding(e[0].x + -96, e[0].y + 0, "GoldMine", 0)
                placeBuilding(e[0].x + -48, e[0].y + 96, "GoldMine", 0)
                placeBuilding(e[0].x + 48, e[0].y + 96, "GoldMine", 0)
                placeBuilding(e[0].x + 192, e[0].y + 0, "GoldMine", 0)
                placeBuilding(e[0].x + -192, e[0].y + 0, "GoldMine", 0)
                placeBuilding(e[0].x + -192, e[0].y + -96, "BombTower", 0)
                placeBuilding(e[0].x + -192, e[0].y + 96, "BombTower", 0)
                placeBuilding(e[0].x + 192, e[0].y + 96, "BombTower", 0)
                placeBuilding(e[0].x + 192, e[0].y + -96, "BombTower", 0)
                placeBuilding(e[0].x + 0, e[0].y + -192, "BombTower", 0)
                placeBuilding(e[0].x + 0, e[0].y + 192, "BombTower", 0)
                placeBuilding(e[0].x + -96, e[0].y + 192, "ArrowTower", 0)
                placeBuilding(e[0].x + 96, e[0].y + 192, "ArrowTower", 0)
                placeBuilding(e[0].x + 96, e[0].y + -192, "ArrowTower", 0)
                placeBuilding(e[0].x + -96, e[0].y + -192, "ArrowTower", 0)
                placeBuilding(e[0].x + -168, e[0].y + -168, "Door", 0)
                placeBuilding(e[0].x + 168, e[0].y + -168, "Door", 0)
                placeBuilding(e[0].x + 168, e[0].y + 168, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + 168, "Door", 0)

                const intervalId = setInterval(() => {
                        if(state.stopped) return
                        placeBuilding(e[0].x + -120, e[0].y + -120, "SlowTrap", 0)
                        placeBuilding(e[0].x + -120, e[0].y + -120, "SlowTrap", 0)
                        placeBuilding(e[0].x + -120, e[0].y + -72, "SlowTrap", 0)
                        placeBuilding(e[0].x + 120, e[0].y + -120, "SlowTrap", 0)
                        placeBuilding(e[0].x + 120, e[0].y + -72, "SlowTrap", 0)
                        placeBuilding(e[0].x + -120, e[0].y + 72, "SlowTrap", 0)
                        placeBuilding(e[0].x + -120, e[0].y + 120, "SlowTrap", 0)
                        placeBuilding(e[0].x + 120, e[0].y + 72, "SlowTrap", 0)
                        placeBuilding(e[0].x + 120, e[0].y + 120, "SlowTrap", 0)
                }, 100)

                Game.currentGame.network.addEntityUpdateHandler(e => {
                        if(state.stopped) return
                        const myUid = Game.currentGame.world.myUid

                        if(e.entities[myUid].gold >= 5200 && e.entities[myUid].gold <= 10199) {
                                upgradeStash()
                                upgradeGoldMines()

                                setTimeout(upgradeBase, 5000)
                        } else if(e.entities[myUid].gold >= 10200 && e.entities[myUid].gold <= 16199) {
                                upgradeStash()
                                upgradeGoldMines()

                                setTimeout(upgradeBase, 3000)
                        } else if(e.entities[myUid].gold >= 16200 && e.entities[myUid].gold <= 20199) {
                                upgradeStash()
                                upgradeGoldMines()

                                setTimeout(upgradeBase, 1000)
                        } else if(e.entities[myUid].gold >= 20200 && e.entities[myUid].gold <= 32199) {
                                upgradeStash()
                                upgradeGoldMines()

                                setTimeout(upgradeBase, 500)
                        } else if(e.entities[myUid].gold >= 32200 && e.entities[myUid].gold <= 100199) {
                                upgradeStash()
                                upgradeGoldMines()

                                upgradeBase()
                        } else if(e.entities[myUid].gold >= 100200 && e.entities[myUid].gold <= 400199) {
                                upgradeStash()
                                upgradeGoldMines()

                                upgradeBase()
                        } else if(e.entities[myUid].gold >= 400200 && e.entities[myUid].gold <= 1000000) {
                                upgradeStash()
                                upgradeGoldMines()

                                upgradeBase()
                        }
                 })
           }
     })
})