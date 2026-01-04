// ==UserScript==
// @name         XYZ private script
// @namespace    https://tampermonkey.net/
// @version      1
// @description  dont leak it
// @author       XYZ_Havy
// @match        http://zombs.io/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/438795/XYZ%20private%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/438795/XYZ%20private%20script.meta.js
// ==/UserScript==

document.querySelectorAll('.ad-unit, .ad-unit-medrec, .hud-intro-guide-hints, .hud-intro-left, .hud-intro-youtuber, .hud-intro-footer, .hud-intro-stone, .hud-intro-tree, .hud-intro-social, .hud-intro-more-games, .hud-intro-guide, .hud-day-night-overlay, .hud-respawn-share, .hud-party-joining, .hud-respawn-corner-bottom-left').forEach(el => el.remove());
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
game.renderer.ground.setVisible(false) //set to true for ground
game.renderer.projectiles.setVisible(false) //set to true for projectiles
//Disable ground and projectiles, help improve FPS if you have a 2000s computer, feel free to enable if you want.

// ==UserScript==
// @name         Shop Shortcut
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Fast & Convenient
// @author       vn_Havy
// @match        http://zombs.io/*
// @grant        none
// ==/UserScript==

document.getElementsByClassName("hud-top-center")[0].innerHTML = `
<a id="shopshortcut1"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pickaxe-t7.svg"></a>
<a id="shopshortcut2"><img src="http://zombs.io/asset/image/ui/inventory/inventory-spear-t7.svg"></a>
<a id="shopshortcut3"><img src="http://zombs.io/asset/image/ui/inventory/inventory-bow-t7.svg"></a>
<a id="shopshortcut4"><img src="http://zombs.io/asset/image/ui/inventory/inventory-bomb-t7.svg"></a>
<a id="shopshortcut5"><img src="http://zombs.io/asset/image/ui/inventory/inventory-health-potion.svg"></a>
<a id="shopshortcut6"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-health-potion.svg"></a>
<a id="shopshortcut7"><img src="http://zombs.io/asset/image/ui/inventory/inventory-shield-t10.svg"></a>
<a id="shopshortcut8"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-ghost-t1.svg"></a>
`;

document.getElementById('shopshortcut1').addEventListener('click', buyPickaxe);
document.getElementById('shopshortcut2').addEventListener('click', buySpear);
document.getElementById('shopshortcut3').addEventListener('click', buyBow);
document.getElementById('shopshortcut4').addEventListener('click', buyBomb);
document.getElementById('shopshortcut5').addEventListener('click', heal);
document.getElementById('shopshortcut6').addEventListener('click', petHeal);
document.getElementById('shopshortcut7').addEventListener('click', buyZombieShield);
document.getElementById('shopshortcut8').addEventListener('click', sellPet);

function buyPickaxe() {
    if (game.ui.inventory.Pickaxe.tier == 1 && game.ui.playerTick.gold >= 1000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Pickaxe",
            tier: 2
        });
        if (game.ui.playerWeaponName !== "Pickaxe") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Pickaxe",
                tier: 2
            });
        }
    }
    if (game.ui.inventory.Pickaxe.tier == 2 && game.ui.playerTick.gold >= 3000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Pickaxe",
            tier: 3
        });
        if (game.ui.playerWeaponName !== "Pickaxe") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Pickaxe",
                tier: 3
            });
        }
    }
    if (game.ui.inventory.Pickaxe.tier == 3 && game.ui.playerTick.gold >= 5000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Pickaxe",
            tier: 4
        });
        if (game.ui.playerWeaponName !== "Pickaxe") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Pickaxe",
                tier: 4
            });
        }
    }
    if (game.ui.inventory.Pickaxe.tier == 4 && game.ui.playerTick.gold >= 8000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Pickaxe",
            tier: 5
        });
       if (game.ui.playerWeaponName !== "Pickaxe") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Pickaxe",
                tier: 5
            });
        }
    }
    if (game.ui.inventory.Pickaxe.tier == 5 && game.ui.playerTick.gold >= 24000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Pickaxe",
            tier: 6
        });
        if (game.ui.playerWeaponName !== "Pickaxe") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Pickaxe",
                tier: 6
            });
        }
    }
    if (game.ui.inventory.Pickaxe.tier == 6 && game.ui.playerTick.gold >= 90000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Pickaxe",
            tier: 7
        });
        if (game.ui.playerWeaponName !== "Pickaxe") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Pickaxe",
                tier: 7
            });
        }
    } else if (game.ui.playerWeaponName !== "Pickaxe") {
        game.network.sendRpc({
            name: "EquipItem",
            itemName: "Pickaxe",
            tier: game.ui.inventory.Pickaxe.tier
        });
    }
}

function buySpear() {
    if (game.ui.inventory.Spear == undefined && game.ui.playerTick.gold >= 1400) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Spear",
            tier: 1
        })
        if (game.ui.playerWeaponName !== "Spear") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Spear",
                tier: 1
            });
        }
    }
    if (game.ui.inventory.Spear.tier == 1 && game.ui.playerTick.gold >= 2800) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Spear",
            tier: 2
        })
        if (game.ui.playerWeaponName !== "Spear") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Spear",
                tier: 2
            });
        }
    }
    if (game.ui.inventory.Spear.tier == 2 && game.ui.playerTick.gold >= 5600) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Spear",
            tier: 3
        })
        if (game.ui.playerWeaponName !== "Spear") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Spear",
                tier: 3
            });
        }
    }
    if (game.ui.inventory.Spear.tier == 3 && game.ui.playerTick.gold >= 11200) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Spear",
            tier: 4
        })
        if (game.ui.playerWeaponName !== "Spear") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Spear",
                tier: 4
            });
        }
    }
    if (game.ui.inventory.Spear.tier == 4 && game.ui.playerTick.gold >= 22500) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Spear",
            tier: 5
        })
        if (game.ui.playerWeaponName !== "Spear") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Spear",
                tier: 5
            });
        }
    }
    if (game.ui.inventory.Spear.tier == 5 && game.ui.playerTick.gold >= 45000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Spear",
            tier: 6
        })
        if (game.ui.playerWeaponName !== "Spear") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Spear",
                tier: 6
            });
        }
    }
    if (game.ui.inventory.Spear.tier == 6 && game.ui.playerTick.gold >= 90000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Spear",
            tier: 7
        })
        if (game.ui.playerWeaponName !== "Spear") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Spear",
                tier: 7
            });
        }
    } else if (game.ui.playerWeaponName !== "Spear") {
        game.network.sendRpc({
            name: "EquipItem",
            itemName: "Spear",
            tier: game.ui.inventory.Spear.tier
        });
    }
}

function buyBow() {
    if (game.ui.inventory.Bow == undefined && game.ui.playerTick.gold >= 100) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Bow",
            tier: 1
        })
        if (game.ui.playerWeaponName !== "Bow") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bow",
                tier: 1
            });
        }
    }
    if (game.ui.inventory.Bow.tier == 1 && game.ui.playerTick.gold >= 400) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Bow",
            tier: 2
        })
        if (game.ui.playerWeaponName !== "Bow") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bow",
                tier: 2
            });
        }
    }
    if (game.ui.inventory.Bow.tier == 2 && game.ui.playerTick.gold >= 2000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Bow",
            tier: 3
        })
        if (game.ui.playerWeaponName !== "Bow") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bow",
                tier: 3
            });
        }
    }
    if (game.ui.inventory.Bow.tier == 3 && game.ui.playerTick.gold >= 7000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Bow",
            tier: 4
        })
        if (game.ui.playerWeaponName !== "Bow") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bow",
                tier: 4
            });
        }
    }
    if (game.ui.inventory.Bow.tier == 4 && game.ui.playerTick.gold >= 24000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Bow",
            tier: 5
        })
        if (game.ui.playerWeaponName !== "Bow") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bow",
                tier: 5
            });
        }
    }
    if (game.ui.inventory.Bow.tier == 5 && game.ui.playerTick.gold >= 30000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Bow",
            tier: 6
        })
        if (game.ui.playerWeaponName !== "Bow") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bow",
                tier: 6
            });
        }
    }
    if (game.ui.inventory.Bow.tier == 6 && game.ui.playerTick.gold >= 90000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Bow",
            tier: 7
        })
        if (game.ui.playerWeaponName !== "Bow") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bow",
                tier: 7
            });
        }
    } else if (game.ui.playerWeaponName !== "Bow") {
        game.network.sendRpc({
            name: "EquipItem",
            itemName: "Bow",
            tier: game.ui.inventory.Bow.tier
        });
    }
}

function buyBomb() {
    if (game.ui.inventory.Bomb == undefined && game.ui.playerTick.gold >= 100) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Bomb",
            tier: 1
        })
        if (game.ui.playerWeaponName !== "Bomb") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bomb",
                tier: 1
            });
        }
    }
    if (game.ui.inventory.Bomb.tier == 1 && game.ui.playerTick.gold >= 400) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Bomb",
            tier: 2
        })
        if (game.ui.playerWeaponName !== "Bomb") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bomb",
                tier: 2
            });
        }
    }
    if (game.ui.inventory.Bomb.tier == 2 && game.ui.playerTick.gold >= 3000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Bomb",
            tier: 3
        })
        if (game.ui.playerWeaponName !== "Bomb") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bomb",
                tier: 3
            });
        }
    }
    if (game.ui.inventory.Bomb.tier == 3 && game.ui.playerTick.gold >= 5000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Bomb",
            tier: 4
        })
        if (game.ui.playerWeaponName !== "Bomb") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bomb",
                tier: 4
            });
        }
    }
    if (game.ui.inventory.Bomb.tier == 4 && game.ui.playerTick.gold >= 24000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Bomb",
            tier: 5
        })
        if (game.ui.playerWeaponName !== "Bomb") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bomb",
                tier: 5
            });
        }
    }
    if (game.ui.inventory.Bomb.tier == 5 && game.ui.playerTick.gold >= 50000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Bomb",
            tier: 6
        })
        if (game.ui.playerWeaponName !== "Bomb") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bomb",
                tier: 6
            });
        }
    }
    if (game.ui.inventory.Bomb.tier == 6 && game.ui.playerTick.gold >= 90000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "Bomb",
            tier: 7
        })
        if (game.ui.playerWeaponName !== "Bomb") {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bomb",
                tier: 7
            });
        }
    } else if (game.ui.playerWeaponName !== "Bomb") {
        game.network.sendRpc({
            name: "EquipItem",
            itemName: "Bomb",
            tier: game.ui.inventory.Bomb.tier
        });
    }
}

function buyZombieShield() {
    if (game.ui.inventory.ZombieShield == undefined && game.ui.playerTick.gold >= 1000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "ZombieShield",
            tier: 1
        })
    }
    if (game.ui.inventory.ZombieShield.tier == 1 && game.ui.playerTick.gold >= 3000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "ZombieShield",
            tier: 2
        })
    }
    if (game.ui.inventory.ZombieShield.tier == 2 && game.ui.playerTick.gold >= 7000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "ZombieShield",
            tier: 3
        })
    }
    if (game.ui.inventory.ZombieShield.tier == 3 && game.ui.playerTick.gold >= 14000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "ZombieShield",
            tier: 4
        })
    }
    if (game.ui.inventory.ZombieShield.tier == 4 && game.ui.playerTick.gold >= 18000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "ZombieShield",
            tier: 5
        })
    }
    if (game.ui.inventory.ZombieShield.tier == 5 && game.ui.playerTick.gold >= 22000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "ZombieShield",
            tier: 6
        })
    }
    if (game.ui.inventory.ZombieShield.tier == 6 && game.ui.playerTick.gold >= 24000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "ZombieShield",
            tier: 7
        })
    }
    if (game.ui.inventory.ZombieShield.tier == 7 && game.ui.playerTick.gold >= 30000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "ZombieShield",
            tier: 8
        })
    }
    if (game.ui.inventory.ZombieShield.tier == 8 && game.ui.playerTick.gold >= 45000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "ZombieShield",
            tier: 9
        })
    }
    if (game.ui.inventory.ZombieShield.tier == 9 && game.ui.playerTick.gold >= 70000) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "ZombieShield",
            tier: 10
        })
    }
}

function heal() {
    Game.currentGame.network.sendRpc({
        "name": "BuyItem",
        "itemName": "HealthPotion",
        "tier": 1
    })
    Game.currentGame.network.sendRpc({
        "name": "EquipItem",
        "itemName": "HealthPotion",
        "tier": 1
    })
}

function petHeal() {
    Game.currentGame.network.sendRpc({
        "name": "BuyItem",
        "itemName": "PetHealthPotion",
        "tier": 1
    })
    Game.currentGame.network.sendRpc({
        "name": "EquipItem",
        "itemName": "PetHealthPotion",
        "tier": 1
    })
}

function sellPet() {
    for(let uid in game.world.entities) {
        if(game.world.entities[uid].fromTick.model == "PetCARL" || game.world.entities[uid].fromTick.model == "PetMiner") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.world.entities[uid].fromTick.uid
            });
        }
    }
}

let mapTimeouts = [];

function createCoordinates() {
    let x = document.createElement('div')
    x.style = 'position: relative;top: 17px;right: 0px;font-weight: 600;font-family: "Hammersmith One";text-shadow: 1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 0.5px 0.5px #fff, -0.5px -0.5px 0 #fff, 0.5px -0.5px 0 #fff, -0.5px 0.5px 0 #fff;';
    x.innerHTML = `<p id="coords";">X: 0, Y: 0</p>`
    x.style.textAlign = "center"
    document.querySelector("#hud > div.hud-bottom-left").append(x)
}

let mapMouseX;
let mapMouseY;
let hasBeenInWorld = false;

setInterval(() => {
    _isInChatbox = document.querySelector('.hud-chat')
        .classList.contains('is-focused')
    if (botMode) {
        if (parseInt((getEntitiesByModel('Tree')[0][1].targetTick.position.x - game.world.getEntityByUid(game.world.getMyUid())
                      .targetTick.position.x)
                     .toString()
                     .replaceAll('-', '')) < 250) {
            game.network.sendRpc({
                name: "SendChatMessage",
                channel: "Local",
                message: "Tree @ Angle (in radians): " + getNearestTreeAngle()
            })
            danceRandom = false;
        } else {
            danceRandom = true;
        }
        if (parseInt((getEntitiesByModel('Stone')[0][1].targetTick.position.x - game.world.getEntityByUid(game.world.getMyUid())
                      .targetTick.position.x)
                     .toString()
                     .replaceAll('-', '')) < 250) {
            game.network.sendRpc({
                name: "SendChatMessage",
                channel: "Local",
                message: "Stone @ Angle (in radians): " + getNearestStoneAngle()
            })
        }
    }
}, 2.5)

game.network.addEnterWorldHandler(function () {
    if(!hasBeenInWorld) {
        hasBeenInWorld = true
        setInterval(() => {
            document.querySelector("#coords")
                .innerText = `X: ${game.world.localPlayer.entity.targetTick.position.x}, Y: ${game.world.localPlayer.entity.targetTick.position.y}`
        }, 16)
        createCoordinates()
    }
})

var mousemove;
addEventListener('mousemove', (e) => {
    mousemove = e;
})

var isSpamming = 0;

function pauseChatSpam(e) {
    if (!isSpamming) {
        window.spammer = setInterval(() => {
            game.network.sendRpc({
                name: "SendChatMessage",
                channel: "Local",
                message: e
            })
        }, 100)
    } else if (isSpamming) {
        clearInterval(window.spammer)
    }
    isSpamming = !isSpamming
}

var autoRespawn = false

game.network.addRpcHandler('ReceiveChatMessage', function(e) {
    if(e.uid == game.ui.playerTick.uid) {
        if(e.message == "!boss") {
            setTimeout(() => {
                game.network.sendRpc({
                    name: "SendChatMessage",
                    message: "9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 121",
                    channel: "Local"
                });
            }, 1000)
        }
        if(e.message == "!marker") {
            var map = document.getElementById("hud-map");
            map.insertAdjacentHTML("beforeend", `<div style="color: red; display: block; left: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.left)}%; top: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.top)}%; position: absolute;" class='hud-map-player'></div>`)
            game.ui.components.PopupOverlay.showHint(`Added Marker`);
        };
    }
});

function getEntitiesByModel(type) {
    let entities = []
    Object.entries(game.world.entities)
        .forEach((item => {
        if (item[1].targetTick.model == type) {
            entities.push(item)
        }
    }))
    return entities;
}

function moveUp() {
    game.inputPacketScheduler.scheduleInput({
        down: 0,
        up: 1
    })
}

function moveDown() {
    game.inputPacketScheduler.scheduleInput({
        up: 0,
        down: 1
    })
}

function moveLeft() {
    game.inputPacketScheduler.scheduleInput({
        right: 0,
        left: 1
    })
}

function moveRight() {
    game.inputPacketScheduler.scheduleInput({
        left: 0,
        right: 1
    })
}
var danceCounter = 0
var danceRandom = true
var botMode = false
var danceInterval = setInterval(() => {
    if (botMode) {
        if (danceCounter < moves.length) {
            moves[danceCounter]()
            if (danceRandom) {
                danceCounter = Math.floor(Math.random() * moves.length)
            } else {
                danceCounter++
            }
        } else {
            danceCounter = 0;
        }
    }
}, 500)
var respawnInterval = setInterval(() => {
    if (document.querySelector('.hud-respawn')
        .style.display == "block" && autoRespawn) {
        game.inputPacketScheduler.scheduleInput({
            respawn: 1
        })
        document.querySelector('.hud-respawn')
            .style.display = "none"
    }
}, 10)
var moves = [moveUp, moveRight, moveDown, moveLeft]

function getNearestStoneAngle() {
    let stoneEntities = getEntitiesByModel('Stone');
    let firstStone = stoneEntities[0][1].targetTick;
    let player = game.world.localPlayer.entity.targetTick

    return Math.atan2(player.position.y - firstStone.position.y / 2,
                      player.position.x - firstStone.position.x)
}

function getNearestTreeAngle() {
    return Math.atan2(game.world.entities[game.world.getMyUid()].targetTick.position.y - getEntitiesByModel('Tree')[0][1].targetTick.position.y / 2, game.world
                      .entities[game.world.getMyUid()].targetTick.position.x - getEntitiesByModel('Tree')[0][1].targetTick.position.x)
}

window.useSamePI = false
addEventListener('keyup', function (e) {
    if (e.key == "`" && !_isInChatbox) {
        game.inputManager.onKeyRelease({
            keyCode: 117
        })
    }
})

window.showpriv = true
if (game.world.inWorld === false) {
    game.network.addPreEnterWorldHandler(() => {
        setInterval(() => {
            document.getElementsByClassName('hud-party-grid')[0].innerHTML = '';

            function checkStatus(party) {
                if (window.showpriv == true) {
                    if(party.isOpen == 1) {
                        return '<a style = "color: #00e700;opacity: 0.4;">[Open]<a/>';
                    } else if(!party.isOpen == 1) {
                        return '<a style = "color:red;opacity: 0.4;">[Private]<a/>';
                    }
                } else {
                    return '';
                }
            };


            let all_parties = game.ui.parties;

            for(let i in all_parties) {
                let parties = all_parties[i];
                let tab = document.createElement('div');
                tab.classList.add('hud-party-link');
                tab.classList.add('custom-party');
                tab.id = parties.partyId;
                tab.isPublic = parties.isOpen;
                tab.name = parties.partyName;
                tab.members = parties.memberCount;
                tab.innerHTML = `
                <strong>${parties.partyName} ${checkStatus(parties)}<strong/>
                <small>id: ${parties.partyId}</small> <span>${parties.memberCount}/4<span/>
            `;

                if(parties.memberCount == 4) {
                    tab.classList.add('is-disabled');
                } else {
                    tab.style.display = 'block';
                }
                if(parties.partyName == document.getElementsByClassName('hud-party-tag')[0].value) {
                    tab.classList.add('is-active');
                }
                if (parties.isOpen !== 1 && window.showpriv == false) {
                    tab.style.display = 'none';
                }
                //function for requesting
                tab.addEventListener('click', function() {
                    let isJoining = true;
                    if(tab.isPublic == 1 && tab.members < 4) {
                        isJoining = true;
                        game.network.sendRpc({
                            name: 'JoinParty',
                            partyId: Math.floor(tab.id)
                        });
                        if(isJoining == true) {
                            document.getElementsByClassName('hud-party-grid')[0].classList.add('is-disabled');
                            document.getElementsByClassName('hud-party-link')[0].classList.add('is-disabled');
                            setTimeout(() => {
                                document.getElementsByClassName('hud-party-grid')[0].classList.remove('is-disabled');
                                document.getElementsByClassName('hud-party-link')[0].classList.remove('is-disabled');
                            },27500);
                        }
                    } else if(!tab.isPublic == 1) {
                        isJoining = false;
                        game.ui.components.PopupOverlay.showHint("You can't request private parties!");
                    }
                });
                document.getElementsByClassName('hud-party-grid')[0].appendChild(tab);
            };
        },5000);
    });
}

window.isInMenu = false;

function upgradeAll() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: obj.fromTick.uid
        })
    }
}

function movePlayer(e) {
    if (!_isInChatbox) {
        switch (e.toLowerCase()
                .replaceAll(' ', '')) {
            case "a":
                Game.currentGame.network.sendInput({
                    left: 1
                })
                break;
            case "d":
                Game.currentGame.network.sendInput({
                    right: 1
                })
                break;
            case "w":
                Game.currentGame.network.sendInput({
                    up: 1
                })
                break;
            case "s":
                Game.currentGame.network.sendInput({
                    down: 1
                })
                break;
        }
    }
}

function getGoldStash() {
    let entities = Game.currentGame.ui.buildings
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        }
        let obj = entities[uid]
        if (obj.type == "GoldStash") {
            return obj
        }
    }
}

function PlaceBuilding(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}

function ahrc1() { // 1 ahrc (collect and refuel), used in lpinterval
    var entities = Game.currentGame.world.entities
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        let obj = entities[uid];
        Game.currentGame.network.sendRpc({
            name: "CollectHarvester",
            uid: obj.fromTick.uid
        });
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 1) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.07
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 2) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.11
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 3) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.17
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 4) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.22
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 5) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.25
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 6) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.28
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 7) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.42
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 8) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.65
            });
        }
    }
}
var lpinterval = setInterval(function () { // loaded player info, ahrc, isInMenu, noob = chatbot
    document.querySelector('#lpi')
        .innerText = "Loaded Player Info: " + JSON.stringify(window.loadedIDS())
    if (window.ahrc) {
        ahrc1()
    }
    window.isInMenu = document.querySelector('#hud-menu-settings')
        .style.display == "block" ? true : false
}, 250)

window.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 27:
            var mb = document.getElementsByClassName("hud")[0];
            if (mb.style.display === "none") {
                mb.style.display = "block";
            } else {
                mb.style.display = "none";
            }
            break;
    }
})

var settingsHTML = `
<button class="btn btn-purple ehack-btn" style="border-radius:25%" id="spamchatbtn">Split Chat</button>
<button class="btn btn-purple ehack-btn" style="border-radius:25%" id="togglespmch">Enable Chat Spam</button>
<input type="text" id="spamchat" placeholder="Message" class="btn btn-white ehack-btn" style="border-radius:25%">
<hr>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="clearchatbtn">Clear Chat</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="upgradeallbtn">Upgrade</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="autoupgradeall-btn">Enable Auto Upgrade</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="togglebot">Enable Bot</button>
<hr>
<button class="btn btn-red ehack-btn ehack-btn" style="border-radius:25%" id="toggleahrc">Enable AHRC</button>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="toggleab">Enable Auto Bow</button>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="toggleresp">Enable Auto Respawn</button>
<hr>
<button class="btn btn-white ehack-btn" style="border-radius:25%" onclick="Game.currentGame.network.disconnect()">Disconnect</button>
<button class="btn btn-gold ehack-btn" style="border-radius:25%" id="menu-leaveparty-btn">Leave Party</button>
<button class="btn btn-gold ehack-btn" style="border-radius:25%" id="menu-jpbsk-btn" onclick='Game.currentGame.network.sendRpc({name:"JoinPartyByShareKey", partyShareKey: document.querySelector("#menu-jpbsk-input").value})'>Join Party</button>
<input type="text" class="btn btn-white ehack-btn" id="menu-jpbsk-input" style="border-radius:25%; width: 26%" placeholder="Share Key">
<hr>
<button class="btn btn-gold ehack-btn" style="border-radius:25%" id="spamallparty-btn">Enable Spam All Party</button>
<button class="btn btn-gold ehack-btn" style="border-radius:25%" id="spampartybyid-btn">Enable Spam Party By ID</button>
<input type="text" class="btn btn-white ehack-btn" id="party-id-input" style="border-radius:25%; width: 23%" placeholder="Party ID">
<hr>
<button id="hchat-btn" class="btn btn-purple ehack-btn" style="border-radius:25%">Hide Chat</button>
<button id="hpop-btn" class="btn btn-purple ehack-btn" style="border-radius:25%">Hide Popup</button>
<button id="hldb-btn" class="btn btn-purple ehack-btn" style="border-radius:25%">Hide Leaderboard</button>
<button id="hmap-btn" class="btn btn-purple ehack-btn" style="border-radius:25%">Hide Map</button>
<hr>
<p style="font-size:10px;">Advanced Player Info?</p><input type="checkbox" id="advancedlpi">
<br>
<p style="font-size:10px;">Zoom On Scroll?</p><input type="checkbox" id="zos">
<br>
<p id="lpi">Loaded Player Info: </p>
<style>
.menu-textbox{
    border-radius:25%;
    background-color: rgba(171, 183, 183, 0.25);
    border: 2px solid black;
    color:white;
}
.ehack-btn:hover{
border: 1px solid grey;
}
</style>
` // aka mod menu
settingsHTML.id = "modmenu"
document.getElementsByClassName("hud-settings-grid")[0].innerHTML = settingsHTML;

document.querySelector('#clearchatbtn')
    .addEventListener('click', function () {
    document.querySelector('.hud-chat-messages')
        .innerHTML = ""
})

document.querySelector('#sellpet')
    .addEventListener('click', sellpet)
document.querySelector('#toggleab')
    .addEventListener('click', autoBow)
document.querySelector('#upgradeallbtn')
    .addEventListener('click', upgradeAll)
document.getElementById("spamallparty-btn")
    .addEventListener("click", spamAllPartybtn);
document.getElementById("spamallparty-btn")
    .addEventListener("click", spamAllParty);
document.getElementById("autoupgradeall-btn")
    .addEventListener("click", autoUpgradeAllbtn);
document.getElementById("autoupgradeall-btn")
    .addEventListener("click", autoUpgradeAll);
document.getElementById("spampartybyid-btn")
    .addEventListener("click", spamPartyByIDbtn);
document.getElementById("spampartybyid-btn")
    .addEventListener("click", spamPartyByID);
document.querySelector('#hchat-btn')
    .addEventListener('click', hideChat)
document.querySelector('#hpop-btn')
    .addEventListener('click', hidePopupOverlay)
document.querySelector('#hldb-btn')
    .addEventListener('click', hideLeaderboard)
document.querySelector('#hmap-btn')
    .addEventListener('click', hideMap)
document.querySelector('#menu-leaveparty-btn')
    .addEventListener('click', onLeaveParty)
document.querySelector('#spamchatbtn')
    .addEventListener('click', spamchatclick)

function onLeaveParty() {
    Game.currentGame.network.sendRpc({
        name: "LeaveParty"
    })
}

function hidePopupOverlay() {
    if (document.getElementById("hud-popup-overlay").style.display === "none" && document.getElementById("hpop-btn").innerHTML == "Show Popup") {
        document.getElementById("hud-popup-overlay").style.display = "block";
        document.getElementById("hpop-btn").innerHTML = "Hide Popup";
    } else {
        document.getElementById("hud-popup-overlay").style.display = "none";
        document.getElementById("hpop-btn").innerHTML = "Show Popup";
    }
}

function hideLeaderboard() {
    if (document.getElementById("hud-leaderboard").style.display === "none" && document.getElementById("hldb-btn").innerHTML == "Show Leaderboard") {
        document.getElementById("hud-leaderboard").style.display = "block";
        document.getElementById("hldb-btn").innerHTML = "Hide Leaderboard";
    } else {
        document.getElementById("hud-leaderboard").style.display = "none";
        document.getElementById("hldb-btn").innerHTML = "Show Leaderboard";
    }
}


function hideMap() {
    if (document.getElementsByClassName("hud-bottom-left")[0].style.display === "none" && document.getElementById("hmap-btn").innerHTML == "Show Map") {
        document.getElementsByClassName("hud-bottom-left")[0].style.display = "block";
        document.getElementById("hmap-btn").innerHTML = "Hide Map";
    } else {
        document.getElementsByClassName("hud-bottom-left")[0].style.display = "none";
        document.getElementById("hmap-btn").innerHTML = "Show Map";
    }
}

function hideChat() {
    if (document.getElementsByClassName("hud-top-left")[0].style.display === "none" && document.getElementById("hchat-btn").innerHTML == "Show Chat"){
        document.getElementsByClassName("hud-top-left")[0].style.display = "block";
        document.getElementById("hchat-btn").innerHTML = "Hide Chat";
    } else {
        document.getElementsByClassName("hud-top-left")[0].style.display = "none";
        document.getElementById("hchat-btn").innerHTML = "Show Chat";
    }
}

function spamAllPartybtn() {
    if (document.getElementById("spamallparty-btn").innerHTML == "Disable Spam All Party") {
        document.getElementById("spamallparty-btn").innerHTML = "Enable Spam All Party";
    } else {
        document.getElementById("spamallparty-btn").innerHTML = "Disable Spam All Party";
    }
}
var partyspam = null;
function spamAllParty() {
    clearInterval(partyspam);
    if (partyspam !== null) {
        partyspam = null;
    } else {
        partyspam = setInterval(function() {
        var party = document.getElementsByClassName('hud-party-link');
            for (var i = 0; i < party.length; i++) {
                var link = party[i];
                link.click();
            }
            confirm = document.getElementsByClassName('btn btn-green hud-confirmation-accept');
            for (var i2 = 0; i2 < confirm.length; i2++) {
                var accept = confirm[i2];
                accept.click();
            }
        },10);
    }
}

function autoUpgradeAllbtn() {
    if (document.getElementById("autoupgradeall-btn").innerHTML == "Disable Auto Upgrade") {
        document.getElementById("autoupgradeall-btn").innerHTML = "Enable Auto Upgrade";
    } else {
        document.getElementById("autoupgradeall-btn").innerHTML = "Disable Auto Upgrade";
    }
}
var autoupgradeall = null;
function autoUpgradeAll() {
    clearInterval(autoupgradeall);
    if (autoupgradeall !== null) {
        autoupgradeall = null;
    } else {
        autoupgradeall = setInterval(function() {
            var entities = Game.currentGame.world.entities;
            for (var uid in entities) {
                if (!entities.hasOwnProperty(uid)) continue;
                var obj = entities[uid];
                Game.currentGame.network.sendRpc({
                    name: "UpgradeBuilding",
                    uid: obj.fromTick.uid
                })
            }
        },1500)
    }
}

function spamPartyByIDbtn() {
    if (document.getElementById("spampartybyid-btn").innerHTML == "Disable Spam Party By ID") {
        document.getElementById("spampartybyid-btn").innerHTML = "Enable Spam Party By ID";
    } else {
        document.getElementById("spampartybyid-btn").innerHTML = "Disable Spam Party By ID";
    }
}
var spampartyid = null;
function spamPartyByID() {
    clearInterval(spampartyid);
    if (spampartyid !== null) {
        spampartyid = null;
    } else {
        spampartyid = setInterval(function() {
            game.network.sendRpc({
                name: "JoinParty",
                partyId: parseInt(document.querySelector("#party-id-input").value)
            })
        },0)
    }
}

function loadedPlayers() { // loaded player names
    var returns = []
    Object.entries(Game.currentGame.world.entities)
        .forEach((stuff => {
        if (stuff[1].targetTick.entityClass == "PlayerEntity" && ((stuff[1].targetTick.uid !== Game.currentGame.world.entities[Game.currentGame.world.getMyUid()].targetTick.uid) || window.useSamePI)) {
            returns.push(stuff[1].targetTick.name)
        }
    }))
    return returns;
}
window.loadedIDS = function () {
    var returns = []
    Object.entries(Game.currentGame.world.entities)
        .forEach((stuff => {
        if (stuff[1].targetTick.entityClass == "PlayerEntity" && ((stuff[1].targetTick.uid !== Game.currentGame.world.entities[Game.currentGame.world.getMyUid()].targetTick.uid) || window.useSamePI)) {
            var h = stuff[1].targetTick
            if (document.querySelector('#advancedlpi')
                .checked) {
                returns.push(JSON.stringify(h))
            } else {
                returns.push(stuff[1].targetTick.name + " - Wood: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.wood +
                             ", Stone: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.stone + ", Gold: " + Game.currentGame
                             .world.entities[stuff[1].targetTick.uid].targetTick.gold)
            }
        }
    }))
    return returns;
}

function spamchatclick() { // used to be called spam chat, its split chat now
    var user = document.querySelector('#spamchat')
    .value
    splitChatLength(user)
}

let dimension = 1;
const onWindowResize = () => {
    if (!window.isInMenu && window.zoomonscroll) {
        const renderer = Game.currentGame.renderer;
        let canvasWidth = window.innerWidth * window.devicePixelRatio;
        let canvasHeight = window.innerHeight * window.devicePixelRatio;
        let ratio = canvasHeight / (1080 * dimension);
        renderer.scale = ratio;
        renderer.entities.setScale(ratio);
        renderer.ui.setScale(ratio);
        renderer.renderer.resize(canvasWidth, canvasHeight);
        renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
        renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
    }
} // Zoom by Apex, modified by eh
onWindowResize();
var transparentMenu = false;
window.onresize = onWindowResize;
window.onwheel = e => {
    if (e.deltaY > 0) {
        dimension += 0.09;
        onWindowResize();
    } else if (e.deltaY < 0) {
        dimension -= 0.09;
        onWindowResize();
    }
}
var _isInChatbox = false;

function doNewSend(sender) {
    if (sender[0] == "ch") {
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: sender[1][0]
        })
    }
}

function splitChatLength(text) {
    let i = 0;
    window.chatSetInterval = setInterval(function () {
        if (i < text.length) {
            doNewSend(['ch', [text.slice(i, i + 45)]])
            i += 45;
        } else {
            clearInterval(window.chatSetInterval)
        }
    }, 1500)
}
addEventListener('keydown', function (e) {
    if (!_isInChatbox && e.key == "/") {
        document.querySelector("#hud-menu-settings")
            .style.display = document.querySelector("#hud-menu-settings")
            .style.display == "none" ? "block" : "none"
        document.querySelector("#hud-menu-shop")
            .style.display = "none"
        document.querySelector("#hud-menu-party")
            .style.display = "none"
    } else if (e.key == "=" && !_isInChatbox) {
        game.ui.getComponent("PopupOverlay").showHint(
            'Press [/] for menu, left click somewhere on the minimap to automatically move there, type !boss for boss wave, !marker to leave a mark on map.',
            1.5e4
        )
    }
})
document.querySelector('#toggleahrc')
    .addEventListener('click', function () {
    window.ahrc = !window.ahrc
    document.querySelector('#toggleahrc')
        .innerText = window.ahrc ? "Disable AHRC" : "Enable AHRC"
})

var isBowing = false;
function autoBow() {
    if (isBowing) {
        isBowing = false
        clearInterval(window.bow)
    } else {
        isBowing = true
        if (Game.currentGame.ui.inventory.Bow) {
            Game.currentGame.network.sendRpc({
                name: "EquipItem",
                itemName: "Bow",
                tier: Game.currentGame.ui.inventory.Bow.tier
            })
            window.bow = setInterval(function () {
                Game.currentGame.inputPacketScheduler.scheduleInput({
                    space: 1
                })
                Game.currentGame.inputPacketScheduler.scheduleInput({
                    space: 0
                })
                Game.currentGame.inputPacketScheduler.scheduleInput({
                    space: 0
                })
            }, 0);
        }
    }
    document.querySelector('#toggleab')
        .innerText = isBowing ? "Disable Auto Bow" : "Enable Auto Bow"
}

document.querySelector('#advancedlpi')
    .addEventListener('change', function (e) {
    var THIS_LPI_EVENT = this;
})
document.querySelector('#zos')
    .addEventListener('change', function (e) {
    var THIS_ZOS_EVENT = this;
    window.zoomonscroll = THIS_ZOS_EVENT.checked
})

document.querySelector('#togglebot')
    .addEventListener('click', function () {
    botMode = !botMode
    this.innerText = botMode ? "Disable Bot" : "Enable Bot"
})
document.querySelector('#toggleresp')
    .addEventListener('click', function () {
    autoRespawn = !autoRespawn
    this.innerText = autoRespawn ? "Disable Auto Respawn" : "Enable Auto Respawn"
})
document.querySelector('#togglespmch')
    .addEventListener('click', function () {
    pauseChatSpam(document.querySelector('#spamchat').value)
    this.innerText = isSpamming ? "Disable Spam Chat" : "Enable Spam Chat"
})

function moveNext(targetX, targetY) {
    let player = game.world.localPlayer.entity.targetTick.position
    if (player.x <= targetX && player.y <= targetY) {
        game.network.sendInput({
            right: 1,
            left: 0,
            up: 0,
            down: 1
        })
    } else if (player.x >= targetX && player.y <= targetY) {
        game.network.sendInput({
            right: 0,
            left: 1,
            up: 0,
            down: 1
        })
    } else if (player.x <= targetX && player.y >= targetY) {
        game.network.sendInput({
            right: 1,
            left: 0,
            up: 1,
            down: 0
        })
    } else if (player.x >= targetX && player.y >= targetY) {
        game.network.sendInput({
            right: 0,
            left: 1,
            up: 1,
            down: 0
        })
    }
}

function isXYCloseTo(x, y) {
    let playerTargetTick = game.world.localPlayer.entity.targetTick.position;
    const radius = 50;
    return ((x <= (playerTargetTick.x + radius) && x >= (playerTargetTick.x - radius)) && (y <= (playerTargetTick.y + radius) && y >= (playerTargetTick.y - radius)));
}

let moveIsActive = false;

function goToPos(x, y) {
    moveIsActive = true;
    window.goToPosInterval = setInterval(() => {
        moveNext(x, y)
    }, 250)
    window.checkPosInterval = setInterval(() => {
        if (moveIsActive) {
            if (isXYCloseTo(x, y)) {
                game.network.sendInput({
                    left: 0,
                    right: 0,
                    up: 0,
                    down: 0
                })
                game.ui.getComponent('PopupOverlay')
                    .showHint('Finished moving!', 1e4)
                moveIsActive = false;
                mapTimeouts.forEach((item => { clearTimeout(item) }))
                clearInterval(window.goToPosInterval)
                clearInterval(window.checkPosInterval)
            }
        } else {
            game.network.sendInput({
                left: 0,
                right: 0,
                up: 0,
                down: 0
            })
            doNewSend(['ch', ['MapMover: Unexpectedly shut down']])
            mapTimeouts.forEach((item => { clearTimeout(item) }))
            game.ui.getComponent('PopupOverlay')
                .showHint('MapMover unexpectedly stopped', 1e4)
            clearInterval(window.checkPosInterval)
        }
    }, 10)
    let g = setTimeout(() => {
        clearInterval(window.goToPosInterval)
        game.ui.getComponent('PopupOverlay')
            .showHint('It has been 4 minutes to move to the position on the map, so it has automatically stopped to prevent infinite loops.', 1e4)
        moveIsActive = false;
        game.network.sendInput({
            left: 0,
            right: 0,
            up: 0,
            down: 0
        })
    }, 240000)
    mapTimeouts.push(g)
}
let mapContainer = document.createElement('div')

mapContainer.id = "hud-map-container"
document.querySelector('.hud-bottom-left')
    .append(mapContainer)
$('#hud-map')
    .appendTo(document.querySelector('#hud-map-container'))
document.querySelector("#hud-map-container")
    .addEventListener('mousemove', function (e) {
    var offset = $('#hud-map-container')
    .offset();
    // Then refer to
    mapMouseX = e.pageX - offset.left;
    mapMouseY = e.pageY - offset.top;
})

document.querySelector("#hud-map-container")
    .addEventListener('click', function (e) {
    if (!moveIsActive) {
        mapTimeouts.forEach((item => { clearTimeout(item) }))
        let yn = "y"
        game.ui.getComponent('PopupOverlay').showConfirmation('Are you sure you want to move to X:' + (mapMouseX * 170.4390625) + ",Y:" + (mapMouseY * 171.9977142857143) + '? You can right click the minimap to cancel this at any time.', 5e3, function() {
            if (yn.toLowerCase() == "y") {
                game.ui.getComponent('PopupOverlay').showHint('Starting MapMove...', 3e3)
                let moveToMapX = (mapMouseX * 170.4390625)
                let moveToMapY = (mapMouseY * 171.9977142857143)
                goToPos(moveToMapX, moveToMapY)
            }
        }, function() {
            game.ui.getComponent('PopupOverlay').showHint('OK, did not start MapMove', 3e3)
        })
    } else {
        moveIsActive = false;
        clearInterval(window.goToPosInterval)
        clearInterval(window.checkPosInterval)
        game.network.sendInput({
            left: 0,
            right: 0,
            up: 0,
            down: 0
        })
        mapTimeouts.forEach((item => { clearTimeout(item) }))
        game.ui.getComponent('PopupOverlay').showHint('MapMove is already in process. Restarting and moving to X:' + (mapMouseX * 170.4390625) + ",Y:" + (mapMouseY * 171.9977142857143) + '. You can right click the minimap to cancel this at any time.', 5e3)
        let yn = "y"
        if (yn.toLowerCase() == "y") {
            let moveToMapX = (mapMouseX * 170.4390625)
            let moveToMapY = (mapMouseY * 171.9977142857143)
            goToPos(moveToMapX, moveToMapY)
        }
    }
})

document.querySelector('#hud-map-container').addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    if(moveIsActive) {
        game.ui.getComponent('PopupOverlay').showConfirmation('Are you sure you want to cancel the current MapMove process?', 5e3, function() {
            moveIsActive = false;
            clearInterval(window.goToPosInterval)
            clearInterval(window.checkPosInterval)
            game.network.sendInput({
                left: 0,
                right: 0,
                up: 0,
                down: 0
            })
            game.ui.getComponent('PopupOverlay').showHint('Successfully stopped MapMover.', 3e3)
            mapTimeouts.forEach((item => { clearTimeout(item) }))
        }, function() {
            game.ui.getComponent('PopupOverlay').showHint('OK, did not stop MapMover.', 3e3)
        })
    } else {
        game.ui.getComponent('PopupOverlay').showHint('You are not in a MapMover process right now. Left click somewhere on the minimap to start one.')
    }
    return false;
}, false);