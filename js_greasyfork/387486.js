// ==UserScript==
// @name         Gold Generator2 sell harvest first...
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387486/Gold%20Generator2%20sell%20harvest%20first.user.js
// @updateURL https://update.greasyfork.org/scripts/387486/Gold%20Generator2%20sell%20harvest%20first.meta.js
// ==/UserScript==

let slowTraps = []
const buildings = Game.currentGame.ui.buildings,
saveSlowTraps = () => {
slowTraps = []
Object.keys(buildings).forEach(keys => {
const building = buildings(keys)
if (building.type == "SlowTrap") {
slowTraps.push(building)
}
})
},
placeBuilding = (x, y, building, yaw) => {
Game.currentGame.network.sendRpc({
"name": "PlaceBuilding",
"x": x,
"y": y,
"type": building,
"yaw": yaw
})

upgradeSlowTraps()
sellSlowTraps()

Object.keys(buildings).forEach(keys => {
const building = buildings(key)
if (building.type == "SlowTrap") {
delete buildings(keys)
}
})
},
        sellBombs = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "BombTower") {
                                Game.currentGame.network.sendRpc({
                                        "name": "DeleteBuilding",
                                        "uid": obj.fromTick.uid
                                })

                        }
                }
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
        upgradeBombs = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "BombTower") {
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
      SellAll = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(["MeleeTower", "MagicTower", "CannonTower", "BombTower", "ArrowTower", "Door", "GoldMine", "Wall", "Harvester", "SlowTrap" || "Wall"].indexOf(obj.fromTick.model) >= 0) {
                                Game.currentGame.network.sendRpc({
                                        "name": "DeleteBuilding",
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
                        if(["MeleeTower", "MagicTower", "CannonTower", "BombTower", "ArrowTower", "Door", "PetCARL", "PetMiner" || "Wall"].indexOf(obj.fromTick.model) >= 0) {
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
        grid = document.querySelector(".hud-party-server")

grid.innerHTML += `<button class="Kod1">Enable gold generator</button>
<button class="Kod2">Save slow traps</button>
<input type"number"value"100"size"52"class="Kod3"></input>`
let Intervaled = 0,
time = 100
const start = () => {
state.stopped = false
Intervaled = setInterval(() => {
if (state.stopped) return
for (let s of slowTraps) placeBuilding(s-x, s-y, s-type, 0)
}, time)
}
      const stop = () => {
state.stopped = true
clearInterval(Intervaled)
sellSlowTraps()
Object.keys(buildings).forEach(key => {
const building = buildings(key)
if (building.type == "SlowTrap") {
delete buildings(key)
}
})
}
Array.prototype.slice.call(grid.childNodes)
        .find(c => c.classList && c.classList.value == "Kod1")
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
Array.prototype.slice.call(grid.childNodes)
        .find(c => c.classList && c.classList.value == "Kod2")
                .addEventListener("click", saveSlowTraps)
Array.prototype.slice.call(grid.childNodes)
        .find(c => c.classList && c.classList.value == "Kod3")
                .addEventListener("input", e=> time - parseInt(e.target.value))

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