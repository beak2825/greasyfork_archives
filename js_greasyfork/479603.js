// ==UserScript==
// @name         Zombs.io bad(?) Hack newest
// @namespace    https://tampermonkey.net/
// @version      v7.5
// @description  The best defensive script (probably)
// @author       (　o=^•ェ•)
// @match        *://zombs.io/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479603/Zombsio%20bad%28%29%20Hack%20newest.user.js
// @updateURL https://update.greasyfork.org/scripts/479603/Zombsio%20bad%28%29%20Hack%20newest.meta.js
// ==/UserScript==
/* Everyone who has helped:
AstralCat (many important functions)
Alex (send alt)
Vn Havy (for original bad hack)
Sirr0m (bomber X rebuilder)
eh (bomber X rebuilder)
JaYT (some minor stuff)
Ayubloom (sun:raise for low health upgrading all towers code)
YT er pro th er (for low health upgrade harvesters code)
chatgpt (wrote the whole code 100% no cap :D)
*/
/* Should add a change log so here:
v7.1: version uploaded to greasyfork, changes made to bad hack's original function: rebuilder records tier of towers, auto aim became prioritising either players or zombies to target, map move now checks for stucks (buggy like hell), added a lot of new functions
v7.1.1: removed disconnection
v7.2: added send alt and aito that doesnt care about full servers
v7.3(latest): debugged aito, added new song, decreased lag
*/
/* global game */
/* global Game */
/* global PIXI */
if (location.hash.split('/')[4] == 'noscript') {
  return
}
let cssMain = `
.bad-btn {
   border: none;
   color: white;
   padding: 10px 20px;
   text-align: center;
   font-size: 14px;
   margin: 2px 0px;
   opacity: 0.9;
   transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out; /* Added transitions */
   display: inline-block;
   border-radius: 15px;
   cursor: pointer;
   text-shadow: -1px 1px 1.5px #242526;
}

/* Blue Button */
.bad-blue {
   background-color: #5463FF;
   --btn-color: #5463FF;
}

.bad-blue:hover {
   opacity: 1;
   transform: scale(1.1); /* Improved hover animation */
   box-shadow: 0 0 20px var(--btn-color); /* Use button color for glow on hover */
}

.bad-blue:active {
   background-color: #333; /* Change background color on click */
}

/* Magenta Button */
.bad-magenta {
   background-color: #E900FF;
   --btn-color: #E900FF;
}

.bad-magenta:hover {
   opacity: 1;
   transform: scale(1.1);
   box-shadow: 0 0 20px var(--btn-color);
}

.bad-magenta:active {
   background-color: #333;
}

/* Gray Button */
.bad-gray {
   background-color: #606060;
   --btn-color: #606060;
}

.bad-gray:hover {
   opacity: 1;
   transform: scale(1.1);
   box-shadow: 0 0 20px var(--btn-color);
}

.bad-gray:active {
   background-color: #333;
}

/* Yellow Button */
.bad-yellow {
   background-color: #FFC600;
   --btn-color: #FFC600;
}

.bad-yellow:hover {
   opacity: 1;
   transform: scale(1.1);
   box-shadow: 0 0 20px var(--btn-color);
}

.bad-yellow:active {
   background-color: #333;
}

/* Red Button */
.bad-red {
   background-color: #FF1818;
   --btn-color: #FF1818;
}

.bad-red:hover {
   opacity: 1;
   transform: scale(1.1);
   box-shadow: 0 0 20px var(--btn-color);
}

.bad-red:active {
   background-color: #333;
}

/* Green Button */
.bad-green {
   background-color: #06FF00;
   --btn-color: #06FF00;
}

.bad-green:hover {
   opacity: 1;
   transform: scale(1.1);
   box-shadow: 0 0 20px var(--btn-color);
}

.bad-green:active {
   background-color: #333;
}

/* Pink Button */
.bad-pink {
   background-color: #FF6B6B;
   --btn-color: #FF6B6B;
}

.bad-pink:hover {
   opacity: 1;
   transform: scale(1.1);
   box-shadow: 0 0 20px var(--btn-color);
}

.bad-pink:active {
   background-color: #333;
}

/* Cyan Button */
.bad-cyan {
   background-color: #39AEA9;
   --btn-color: #39AEA9;
}

.bad-cyan:hover {
   opacity: 1;
   transform: scale(1.1);
   box-shadow: 0 0 20px var(--btn-color);
}

.bad-cyan:active {
   background-color: #333;
}

/* Orange Button */
.bad-orange {
   background-color: #FF5F00;
   --btn-color: #FF5F00;
}

.bad-orange:hover {
   opacity: 1;
   transform: scale(1.1);
   box-shadow: 0 0 20px var(--btn-color);
}

.bad-orange:active {
   background-color: #333;
}

.bad-textbox {
   border: none;
   color: white;
   padding: 10px 10px;
   text-align: center;
   font-size: 14px;
   margin: 2px 0px;
   opacity: 0.9;
   transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
   display: inline-block;
   border-radius: 15px;
   background-color: #606060;
   text-shadow: -1px 1px 1.5px #242526;
}

.bad-textbox:hover {
   opacity: 1;
   transform: scale(1.1);
   box-shadow: 0 0 20px var(--btn-color);
}

.bad-textbox:active {
   background-color: #333;
}

   .hud-toolbar .hud-toolbar-inventory .hud-toolbar-item.is-empty {
      pointer-events: auto;
   }

   #hud-menu-shop {
      top: 45%;
      left: 50%;
      width: 690px;
      height: 450px;
      margin: 0;
      transform: translate(-50%, -50%);
      padding: 20px;
      background-size: cover;
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2); /* Added subtle shadow */
   }

   .hud-menu-shop:hover {
      opacity: 1;
   }

   .hud-menu-shop .hud-shop-grid {
      height: 330px;
   }

   #hud-menu-settings {
      top: 45%;
      left: 50%;
      width: 780px;
      height: 500px;
      margin: 0;
      transform: translate(-50%, -50%);
      padding: 20px;
      background: url('https://i.pinimg.com/originals/de/e3/b6/dee3b69d434789662bdf3f54ed3a8a7d.gif');
      background-size: cover;
   }

   .hud-menu-settings .hud-settings-grid {
      width: 750px;
      height: 420px;
   }

   .hud-menu-shop .hud-shop-tabs a[data-type=Pet]::after {
      content: none;
   }

   .hud-intro::after { background: url(\'https://cutewallpaper.org/21/wallpaper-gif-1920x1080/Gif-Background-Space-1920x1080-Backgrounds-For-Html-Gif-.gif\'); background-size: cover; }

   .hud-menu-icons .hud-menu-icon[data-type=Iframe]::before {
      background-image: url("https://media.discordapp.net/attachments/870020008128958525/876133010360107048/unknown.png");
      background-size: 30px;
   }

   [data-item=PetGhost][data-tier='1']::after {
      background-image: url('/asset/image/ui/inventory/inventory-pet-ghost-t1.svg');
   }
`;
let stylesMain = document.createElement("style");
stylesMain.appendChild(document.createTextNode(cssMain));
document.head.appendChild(stylesMain);
stylesMain.type = "text/css";

document.querySelectorAll('.ad-unit, .ad-unit-medrec, .hud-intro-guide-hints, .hud-intro-left, .hud-intro-youtuber, .hud-intro-footer, .hud-intro-stone, .hud-intro-tree, .hud-intro-social, .hud-intro-more-games, .hud-intro-guide, .hud-respawn-share, .hud-party-joining, .hud-respawn-corner-bottom-left, #hud-menu-shop > div.hud-shop-grid > a:nth-child(10)').forEach(el => el.remove());
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
document.querySelector(".hud-chat-messages").style.width = "1800px";

let addZombieShield = document.createElement("a");
addZombieShield.classList.add("hud-toolbar-item");
addZombieShield.setAttribute("data-item", "ZombieShield");
addZombieShield.setAttribute("data-tier", "1");
document.getElementsByClassName("hud-toolbar-inventory")[0].appendChild(addZombieShield);

let addWoody = document.createElement("a");
addWoody.classList.add("hud-toolbar-item");
addWoody.setAttribute("data-item", "PetMiner");
addWoody.setAttribute("data-tier", "1");
document.getElementsByClassName("hud-toolbar-inventory")[0].appendChild(addWoody);

let addCARL = document.createElement("a");
addCARL.classList.add("hud-toolbar-item");
addCARL.setAttribute("data-item", "PetCARL");
addCARL.setAttribute("data-tier", "1");
document.getElementsByClassName("hud-toolbar-inventory")[0].appendChild(addCARL);

let addSellPet = document.createElement("a");
addSellPet.classList.add("hud-toolbar-item");
addSellPet.setAttribute("data-item", "PetGhost");
addSellPet.setAttribute("data-tier", "1");
document.getElementsByClassName("hud-toolbar-inventory")[0].appendChild(addSellPet);

document.querySelector("#hud-toolbar > div.hud-toolbar-inventory").addEventListener('contextmenu', handleContextMenu);

function handleContextMenu(event) {
  const targetIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
  switch (targetIndex) {
    case 0:
      buyPickaxe();
      break;
    case 1:
      buySpear();
      break;
    case 2:
      buyBow();
      break;
    case 3:
      buyBomb();
      break;
    case 4:
      shopShortcut("HealthPotion", 1);
      break;
    case 5:
      shopShortcut("PetHealthPotion", 1);
      break;
    case 7:
      buyZombieShield();
      break;
    case 8:
      buyPet("PetMiner", getPetTier(6));
      break;
    case 9:
      buyPet("PetCARL", getPetTier(5));
      break;
    case 10:
      Game.currentGame.network.sendRpc({
        name: "DeleteBuilding",
        uid: game.ui.getPlayerPetUid()
      });
      break;
  }
}

function buyPet(item, tier) {
  if (game.ui.getPlayerPetName() == item) {
    shopShortcut("PetRevive", 1)
  } else {
    let i = 0
    let j = setInterval(() => {
      shopShortcut(item, tier)
      i++
      if (i >= 25 || game.ui.getPlayerPetName() == item) {
        i = 0
        clearInterval(j)
      }
    }, 250);
  }
}

function getPetTier(num) {
  if (document.querySelectorAll(".hud-shop-item-tier")[5].childNodes[0].textContent.match(/\d+/) != null) {
    let petLevel = document.querySelectorAll(".hud-shop-item-tier")[num].childNodes[0].textContent.match(/\d+/)[0]
    if (petLevel <= 8) return 1
    if (petLevel <= 16) return 2
    if (petLevel <= 24) return 3
    if (petLevel <= 32) return 4
    if (petLevel <= 48) return 5
    if (petLevel <= 64) return 6
    if (petLevel <= 96) return 7
    if (petLevel > 96) return 8
  } else return 8
}

function equipItem(item, tier) {
  game.network.sendRpc({
    name: "EquipItem",
    itemName: item,
    tier: tier
  })
};

function buyItem(item, tier) {
  game.network.sendRpc({
    name: "BuyItem",
    itemName: item,
    tier: tier
  })
}

function shopShortcut(item, tier) {
  buyItem(item, tier)
  if (game.ui.playerWeaponName !== item) {
    equipItem(item, tier)
  }
}

function buyPickaxe() {
  let cost = [0, 1000, 3000, 6000, 8000, 24000, 80000];
  if (game.ui.playerTick.gold >= cost[game.ui.inventory.Pickaxe.tier]) {
    shopShortcut("Pickaxe", game.ui.inventory.Pickaxe.tier + 1)
  }
}

function buySpear() {
  let tier = game.ui.inventory.Spear ? game.ui.inventory.Spear.tier : 0;
  let cost = [1400, 2800, 5600, 11200, 22500, 45000, 90000];
  if (game.ui.playerTick.gold >= cost[tier]) {
    shopShortcut("Spear", tier + 1)
  }
}

function buyBow() {
  let tier = game.ui.inventory.Bow ? game.ui.inventory.Bow.tier : 0;
  let cost = [100, 400, 2000, 7000, 24000, 30000, 90000];
  if (game.ui.playerTick.gold >= cost[tier]) {
    shopShortcut("Bow", tier + 1)
  }
}

function buyBomb() {
  let tier = game.ui.inventory.Bomb ? game.ui.inventory.Bomb.tier : 0;
  let cost = [100, 400, 3000, 5000, 24000, 50000, 90000];
  if (game.ui.playerTick.gold >= cost[tier]) {
    shopShortcut("Bomb", tier + 1)
  }
}

function buyZombieShield() {
  let tier = game.ui.inventory.ZombieShield ? game.ui.inventory.ZombieShield.tier : 0;
  let cost = [1000, 3000, 7000, 14000, 18000, 22000, 24000, 30000, 45000, 70000];
  if (game.ui.playerTick.gold >= cost[tier]) {
    shopShortcut("ZombieShield", tier + 1)
    document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(8)").setAttribute("data-tier", tier + 1);
  }
}

//x,y

function createCoordinates() {
  let x = document.createElement('div');
  x.style = 'position: relative; margin: 0;';
  x.innerHTML = `<h3 id="coords"; style="margin: 0;"></h3>`;
  x.style.textAlign = "left";
  document.querySelector("#hud > div.hud-bottom-left").append(x);
}

let hasBeenInWorld = false;

let currentCoords = {
  x: 0,
  y: 0
};

let coordinateHistory = [];

game.network.addEnterWorldHandler(() => {
  if (!hasBeenInWorld) {
    hasBeenInWorld = true;
    // Update currentCoords every 16ms
    setInterval(() => {
      const timestamp = Date.now();
      currentCoords = {
        x: game.ui.playerTick?.position?.x || 0,
        y: game.ui.playerTick?.position?.y || 0
      };

      // Store the current coordinates with a timestamp
      coordinateHistory.push({
        timestamp,
        coords: {
          ...currentCoords
        }
      });

      // Clean up older coordinates (older than 1 second)
      const oneSecondAgo = timestamp - 1000;
      coordinateHistory = coordinateHistory.filter(coord => coord.timestamp >= oneSecondAgo);

      document.querySelector("#coords").innerText = `X: ${currentCoords.x}\n Y: ${currentCoords.y}`;
    }, 16);

    createCoordinates();
  }
  game.ui.components.MenuShop.onTwitterFollow();
  game.ui.components.MenuShop.onTwitterShare();
  game.ui.components.MenuShop.onFacebookLike();
  game.ui.components.MenuShop.onFacebookShare();
  game.ui.components.MenuShop.onYouTubeSubscribe();
});

// Function to get coordinates from exactly 1 second ago
function getCoordinatesOneSecondAgo() {
  const oneSecondAgo = Date.now() - 1000;
  const closestCoord = coordinateHistory.reduce((prev, curr) => {
    return Math.abs(curr.timestamp - oneSecondAgo) < Math.abs(prev.timestamp - oneSecondAgo) ? curr : prev;
  }, coordinateHistory[0]);

  return closestCoord.coords;
}


var isSpamming = 0;

function pauseChatSpam(e) {
  if (!isSpamming) {
    window.spammer = setInterval(() => {
      game.network.sendRpc({
        name: "SendChatMessage",
        channel: "Local",
        message: e
      })
    }, 1050)
  } else if (isSpamming) {
    clearInterval(window.spammer)
  }
  isSpamming = !isSpamming
}

let friendcontrol = false

game.network.addRpcHandler('ReceiveChatMessage', function(e) {
  if (e.uid == game.ui.playerTick.uid) {
    if (e.message == "!boss") {
      setTimeout(() => {
        game.network.sendRpc({
          name: "SendChatMessage",
          message: "9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 121",
          channel: "Local"
        });
      }, 1050);
    };
    if (e.message === "!marker") {
      var map = document.getElementById("hud-map");
      // Add a specific class to markers created by !marker
      map.insertAdjacentHTML("beforeend", `<div style="color: red; display: block; left: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.left)}%; top: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.top)}%; position: absolute;" class='hud-map-player marker-placed-by-command'></div>`)
      game.ui.getComponent('PopupOverlay').showHint(`Added Marker`, 1500);
    } else if (e.message === "!delmarkers") {
      // Get all marker elements with the class 'marker-placed-by-command'
      const markers = document.querySelectorAll('.marker-placed-by-command');

      // Loop through and remove only markers created by !marker
      markers.forEach(marker => {
        marker.remove();
      });

      // Show a hint that markers were deleted
      game.ui.getComponent('PopupOverlay').showHint('Deleted Markers', 1500);
    }
    if (e.message == "!pop") {
      game.ui.components.PopupOverlay.showHint(`Players in server: ${pop}/32`, 3000);
    }
    if (e.message === "!scanposition") {
      // Handle the "scanposition" command
      handleScanPosition();
    }
    if (e.message === "!markers") {
      addMarker(game.ui.playerTick.position.x, game.ui.playerTick.position.y);
    }
    if (e.message === "!delmarkers") {
      // Get all marker elements with the class 'marker-placed-by-command'
      const markerElements = document.querySelectorAll('.marker-placed-by-command');

      // Loop through and remove only markers created by !
      markerElements.forEach(markerElement => {
        // Check if the marker element has a data-marker-id attribute
        const markerId = markerElement.getAttribute("data-marker-id");
        if (markerId) {
          // Remove the marker only if its ID matches a marker in the array
          const idToRemove = parseInt(markerId);
          const indexToRemove = markers.findIndex(m => m.id === idToRemove);
          if (indexToRemove !== -1) {
            markers.splice(indexToRemove, 1);
            markerElement.remove();
          }
        }
      });

      // Show a hint that markers were deleted
      game.ui.getComponent('PopupOverlay').showHint('Deleted Markers', 1500);
      // Reset marker IDs
      resetMarkerIds();
    }
    if (e.message === "!markermove") {
      // Handle the "markermove" command
      handleMarkerMove();
    } else if (e.message === "!stop") {
      // Stop repeating move
      stopRepeatingMove();
    }
  };
  if (friendcontrol) {
    if (e.uid == document.getElementById("friend1").value || e.uid == document.getElementById("friend2").value || e.uid == document.getElementById("friend3").value || e.uid == document.getElementById("friend4").value || e.uid == document.getElementById("friend5").value || e.uid == document.getElementById("friend6").value || e.uid == document.getElementById("friend7").value || e.uid == document.getElementById("friend8").value || e.uid == document.getElementById("friend9").value || e.uid == document.getElementById("friend10").value || e.displayName == document.getElementById("friend1").value || e.displayName == document.getElementById("friend2").value || e.displayName == document.getElementById("friend3").value || e.displayName == document.getElementById("friend4").value || e.displayName == document.getElementById("friend5").value || e.displayName == document.getElementById("friend6").value || e.displayName == document.getElementById("friend7").value || e.displayName == document.getElementById("friend8").value || e.displayName == document.getElementById("friend9").value || e.displayName == document.getElementById("friend10").value) {
      if (e.message == "!ahrc") {
        shouldAHRC = true
        document.getElementById("toggleahrc").innerHTML = "AHRC On";
      }
      if (e.message == "!!ahrc") {
        shouldAHRC = false
        document.getElementById("toggleahrc").innerHTML = "AHRC Off";
      }
      if (e.message == "!rebuild") {
        toggleRebuild()
      }
      if (e.message == "!clear") {
        shouldClearChat = true
        document.getElementById("clearchat-btn").innerHTML = "Clear Chat On";
      }
      if (e.message == "!!clear") {
        shouldClearChat = false
        document.getElementById("clearchat-btn").innerHTML = "Clear Chat Off";
      }
      if (e.message.startsWith("!move")) {
        const match = e.message.match(/x: (\d+), y: (\d+)/);
        if (match) {
          const x = parseInt(match[1]);
          const y = parseInt(match[2]);
          goToPos(x, y);
        }
      }
      if (e.message == "!stop") {
        clearInterval(goToPosInterval);
        clearTimeout(moveTimeout);
        game.network.sendInput({
          left: 0,
          right: 0,
          up: 0,
          down: 0
        });
      }
      if (e.message == "!upstash") {
        for (let uid in game.ui.buildings) {
          if (game.ui.buildings[uid].type == "GoldStash") {
            Game.currentGame.network.sendRpc({
              name: "UpgradeBuilding",
              uid: game.ui.buildings[uid].uid
            });
          }
        }
      }
      if (e.message == "!up0") {
        for (let uid in game.ui.buildings) {
          if (game.ui.buildings[uid].type == "Harvester") {
            Game.currentGame.network.sendRpc({
              name: "UpgradeBuilding",
              uid: game.ui.buildings[uid].uid
            });
          }
        }
      }
      if (e.message == "!up1") {
        for (let uid in game.ui.buildings) {
          if (game.ui.buildings[uid].type == "Wall") {
            Game.currentGame.network.sendRpc({
              name: "UpgradeBuilding",
              uid: game.ui.buildings[uid].uid
            });
          }
        }
      }
      if (e.message == "!up2") {
        for (let uid in game.ui.buildings) {
          if (game.ui.buildings[uid].type == "Door") {
            Game.currentGame.network.sendRpc({
              name: "UpgradeBuilding",
              uid: game.ui.buildings[uid].uid
            });
          }
        }
      }
      if (e.message == "!up3") {
        for (let uid in game.ui.buildings) {
          if (game.ui.buildings[uid].type == "SlowTrap") {
            Game.currentGame.network.sendRpc({
              name: "UpgradeBuilding",
              uid: game.ui.buildings[uid].uid
            });
          }
        }
      }
      if (e.message == "!up4") {
        for (let uid in game.ui.buildings) {
          if (game.ui.buildings[uid].type == "ArrowTower") {
            Game.currentGame.network.sendRpc({
              name: "UpgradeBuilding",
              uid: game.ui.buildings[uid].uid
            });
          }
        }
      }
      if (e.message == "!up5") {
        for (let uid in game.ui.buildings) {
          if (game.ui.buildings[uid].type == "CannonTower") {
            Game.currentGame.network.sendRpc({
              name: "UpgradeBuilding",
              uid: game.ui.buildings[uid].uid
            });
          }
        }
      }
      if (e.message == "!up6") {
        for (let uid in game.ui.buildings) {
          if (game.ui.buildings[uid].type == "MeleeTower") {
            Game.currentGame.network.sendRpc({
              name: "UpgradeBuilding",
              uid: game.ui.buildings[uid].uid
            });
          }
        }
      }
      if (e.message == "!up7") {
        for (let uid in game.ui.buildings) {
          if (game.ui.buildings[uid].type == "BombTower") {
            Game.currentGame.network.sendRpc({
              name: "UpgradeBuilding",
              uid: game.ui.buildings[uid].uid
            });
          }
        }
      }
      if (e.message == "!up8") {
        for (let uid in game.ui.buildings) {
          if (game.ui.buildings[uid].type == "MagicTower") {
            Game.currentGame.network.sendRpc({
              name: "UpgradeBuilding",
              uid: game.ui.buildings[uid].uid
            });
          }
        }
      }
      if (e.message == "!up9") {
        for (let uid in game.ui.buildings) {
          if (game.ui.buildings[uid].type == "GoldMine") {
            Game.currentGame.network.sendRpc({
              name: "UpgradeBuilding",
              uid: game.ui.buildings[uid].uid
            });
          }
        }
      }
      if (e.message == "!upall") {
        autoUpgradeAllbtn()
        autoUpgradeAll()
      }
      if (e.message.startsWith("!join psk")) {
        const match = e.message.match(/psk (\w+)/);
        if (match) {
          const partyShareKey = match[1];
          // Send the RPC with the extracted partyShareKey
          Game.currentGame.network.sendRpc({
            name: "JoinPartyByShareKey",
            partyShareKey: partyShareKey
          });
        }
      }
      if (e.message == "!leave") {
        Game.currentGame.network.sendRpc({
          name: "LeaveParty"
        })
      }
    }
  }
})

function checkStatus(party) {
   if (party.isOpen === 1) {
      return '<a style="color: #00e700; opacity: 0.9;">[Open]</a>';
   } else if (party.isOpen !== 1) {
      return '<a style="color: red; opacity: 0.9;">[Private]</a>';
   }
}

const partyCheck = (all_parties) => {
   const hudPartyGrid = document.getElementsByClassName('hud-party-grid')[0];
   hudPartyGrid.innerHTML = '';

   for (const parties of all_parties) {
      const tab = document.createElement('div');
      tab.classList.add('hud-party-link', 'custom-party');
      tab.id = parties.partyId;
      tab.isPublic = parties.isOpen;
      tab.name = window.filterXSS(parties.partyName);
      tab.members = parties.memberCount;

      tab.innerHTML = `
         <strong>${tab.name} ${checkStatus(parties)}</strong>
         <small>id: ${tab.id}</small> <span>${tab.members}/4</span>
      `;

      if (parties.memberCount === 4) {
         tab.classList.add('is-disabled');
      } else {
         tab.style.display = 'block';
      }

      if (parties.partyId === game.ui.playerPartyId) {
         tab.classList.add('is-active');
      }

      if (parties.isOpen !== 1) {
         tab.classList.add('is-disabled');
      }

      tab.addEventListener('click', () => {
         if (tab.isPublic === 1 && tab.members < 4) {
            game.network.sendRpc({
               name: 'JoinParty',
               partyId: Math.floor(tab.id),
            });
         } else if (tab.isPublic !== 1) {
            game.ui.getComponent('PopupOverlay').showHint("You can't request private parties!", 800);
         }
      });

      hudPartyGrid.appendChild(tab);
   }
};
let pop = 0
game.network.addRpcHandler('SetPartyList', (e) => {
   partyCheck(e);
  pop = 0;
  Object.keys(game.ui.parties).forEach(e => (pop = pop + game.ui.parties[e].memberCount));
  game.ui.components.PopupOverlay.showHint(`Players in server: ${pop}/32`, 3000);
});

const song1 = new Audio("https://cdn.discordapp.com/attachments/967213871267971072/1027416621318414406/8mb.video-Vf9-wfenD0dA.m4a");
const song2 = new Audio("https://cdn.discordapp.com/attachments/1084113357591822467/1100413815545405543/Rick_Astley_-_Never_Gonna_Give_You_Up_Official_Music_Video.mp3");
const song3 = new Audio("https://cdn.discordapp.com/attachments/929143814487146547/1170910219623219312/Everybody_Wants_To_Rule_The_World.m4a?ex=655ac21e&is=65484d1e&hm=afbef8c516f441ab71a96faae36482c690513acf80e5a712b12c8c7859b2e910&");
const song4 = new Audio("https://cdn.discordapp.com/attachments/1086262250647584800/1094139045547876402/Initial_D_-_Deja_Vu_1-1.mp3");
const song5 = new Audio("https://cdn.discordapp.com/attachments/929143814487146547/1176755590752632852/Down_like_that.m4a?ex=6570060b&is=655d910b&hm=9f14afa65b345c52bbeb98c3a57fbe4b268dc33140707f6b86277ec92bc0c8e0&")
const song6 = new Audio("https://cdn.discordapp.com/attachments/929143814487146547/1179244082753716254/105.m4a?ex=657913a2&is=65669ea2&hm=0e595bfd19859977c5ffbd12720e489bf7cd0d861dd31d4fdccc25189fd04936&")
const song7 = new Audio("https://cdn.discordapp.com/attachments/1179255422411096127/1181871036942274560/For_the_night.m4a?ex=6582a22d&is=65702d2d&hm=5ee7404afdbb22008dde1a7675188cfe0afb5d54818ba418589be41d36b8ddd8&")
const song8 = new Audio("https://cdn.discordapp.com/attachments/929143814487146547/1184394881158893599/CocoNUT.m4a?ex=658bd0b0&is=65795bb0&hm=1df78be04fd0cd41de67a6fe4bcd83294d47349523b716e369deee62eccb8bd9&")
const song9 = new Audio("https://cdn.discordapp.com/attachments/929143814487146547/1186591003902230609/Rap_god.m4a?ex=6593cdfd&is=658158fd&hm=e01fbea879530d5e8bdb216f7ab894d3e906eb1615b3d2b59757c13f83dd6b58&")

let settingsHTML = `
      <div style="text-align: center">
         <button class="bad-btn bad-magenta" id="lagspam-btn">Lag Spam Off</button>
         <button class="bad-btn bad-magenta" id="togglespmch">Chat Spam Off</button>
         <input type="text" id="spamchat" placeholder="Message" class="bad-textbox" style="width: 40%">
         <br>
         <select id="lyricSongs" class="bad-textbox">
            <option value="song1" selected>League Of Legends - Take Over</option>
            <option value="song2">Rick Astley - Never Gonna Give You Up</option>
            <option value="song3">Tears For Fears - Everybody Wants To Rule The World</option>
            <option value="song4">Initial D - Deja Vu</option>
            <option value="song5">KSI - Down Like That</option>
            <option value="song6">阿肆 - 热爱105°C的你</option>
            <option value="song7">Pop Smoke - For The Night</option>
            <option value="song8">The Coconut Song (Da coconut)</option>
            <option value="song9">Eminem - Rap God</option>
         </select>
         <button class="bad-btn bad-magenta" id="pauseSong">Stop Singing</button>
         <hr>
         <button id="sellall" class="bad-btn bad-red">Sell All</button>
         <button id="sellwall" class="bad-btn bad-red">Start Selling Walls</button>
         <button id="selldoor" class="bad-btn bad-red">Start Selling Doors</button>
         <button id="selltrap" class="bad-btn bad-red">Start Selling Traps</button>
         <button id="sellharvester" class="bad-btn bad-red">Start Selling Harvesters</button>
         <br>
         <button id="sellarrow" class="bad-btn bad-red">Start Selling Arrows</button>
         <button id="sellcannon" class="bad-btn bad-red">Start Selling Cannons</button>
         <button id="sellmelee" class="bad-btn bad-red">Start Selling Melees</button>
         <button id="sellbomb" class="bad-btn bad-red">Start Selling Bombs</button>
         <button id="sellmagic" class="bad-btn bad-red">Start Selling Mages</button>
         <button id="sellminer" class="bad-btn bad-red">Start Selling Gold Mines</button>
         <hr>
         <button class="bad-btn bad-yellow" id="menu-leaveparty-btn" onclick ='Game.currentGame.network.sendRpc({name: "LeaveParty"})'>Leave Party</button>
         <button class="bad-btn bad-yellow" id="menu-jpbsk-btn" onclick='Game.currentGame.network.sendRpc({name:"JoinPartyByShareKey", partyShareKey: document.querySelector("#menu-jpbsk-input").value})'>Join Party</button>
         <input type="text" class="bad-textbox" id="menu-jpbsk-input" style="width: 40%" placeholder="Share Key">
         <button class="bad-btn bad-yellow" id="autoaccept-btn">Accepter Off</button>
         <button class="bad-btn bad-yellow" id="autosell">Auto Give Sell Off</button>
         <br>
         <button class="bad-btn bad-yellow" id="spamallparty-btn">Spam All Party Off</button>
         <button class="bad-btn bad-yellow" id="spampartybyid-btn">Spam Party By ID Off</button>
         <input type="text" class="bad-textbox" id="party-id-input" style="width: 20%" placeholder="Party ID">
         <button class="bad-btn bad-yellow" id="newtab">New Party Tab</button>
         <hr>
         <button id="healplayer" class="bad-btn bad-green">Heal PLayer On</button>
         <input type="text" class="bad-textbox" value="20" id="healplayerinput" style="width: 8%">
         <button id="healpet" class="bad-btn bad-green">Heal Pet On</button>
         <input type="text" class="bad-textbox" value="30" id="healpetinput" style="width: 8%">
         <button id="revivepet" class="bad-btn bad-green">Revive On</button>
         <button id="evolvepet" class="bad-btn bad-green">Evolve On</button>
         <hr>
         <button class="bad-btn bad-blue" id="clearchat-btn">Clear Chat Off</button>
         <button class="bad-btn bad-blue" id="autoupgradeall-btn">Upgrade Off</button>
         <button class="bad-btn bad-blue" id="togglespinner">Spinner Off</button>
         <button class="bad-btn bad-blue" id="toggleaim">Aim Off</button>
         <select id="aimOptions" class="bad-textbox">
            <option value="pl" selected>Players</option>
            <option value="zo">Zombies</option>
         </select>
         <br>
         <button class="bad-btn bad-blue" id="toggleahrc">AHRC Off</button>
         <button class="bad-btn bad-blue" id="toggleresp">Respawn On</button>
         <button class="bad-btn bad-blue" id="togglebot">Bot Off</button>
         <button class="bad-btn bad-blue" id="toggleswing">Swing Off</button>
         <button class="bad-btn bad-blue" id="togglerb">Rebuild Off</button>
         <button class="bad-btn bad-blue" id="togglehealthup">Low Health Upgrade Off</button>
         <button class="bad-btn bad-blue" id="stashleave">Auto Leave Off</button>
         <button class="bad-btn bad-blue" id="towerheal">Heal Towers Off</button>
         <hr>
         <button id="upstash" class="bad-btn bad-red">Up Stash Off</button>
         <button id="upmines" class="bad-btn bad-red">Up Mines Off</button>
         <button id="uparrow" class="bad-btn bad-red">Up Arrows Off</button>
         <button id="upcannon" class="bad-btn bad-red">Up Cannons Off</button>
         <button id="upmage" class="bad-btn bad-red">Up Mages Off</button>
         <button id="upmelee" class="bad-btn bad-red">Up Melees Off</button>
         <button id="upbomb" class="bad-btn bad-red">Up Bombs Off</button>
         <button id="upharvester" class="bad-btn bad-red">Up Harvesters Off</button>
         <button id="uptrap" class="bad-btn bad-red">Up Slow Traps Off</button>
         <button id="upwall" class="bad-btn bad-red">Up Walls Off</button>
         <button id="updoor" class="bad-btn bad-red">Up Doors Off</button>
         <hr>
         <button class="bad-btn bad-blue" id="toggleabpk">Enable Auto Buy Pickaxe</button>
         <button class="bad-btn bad-blue" id="toggleabsp">Enable Auto Buy Spear</button>
         <button class="bad-btn bad-blue" id="toggleabbw">Enable Auto Buy Bow</button>
         <button class="bad-btn bad-blue" id="toggleabbm">Enable Auto Buy Bomb</button>
         <button class="bad-btn bad-blue" id="toggleabsh">Enable Auto Buy Sheild</button>
         <hr>
         <button id="hidechat" class="bad-btn bad-pink">Hide Chat</button>
         <button id="hidepop" class="bad-btn bad-pink">Hide Popup</button>
         <button id="hideldb" class="bad-btn bad-pink">Hide Leaderboard</button>
         <button id="hidemap" class="bad-btn bad-pink">Hide Map</button>
         <button id="hidepip" class="bad-btn bad-pink">Hide PIP</button>
         <button id="mapenv" class="bad-btn bad-pink">Toggle Map Env</button>
         <button id="daybright" class="bad-btn bad-pink">Enable Always Day</button>
         <hr>
         <button id="hideground" class="bad-btn bad-cyan">Hide Ground</button>
         <button id="hidenpcs" class="bad-btn bad-cyan">Hide NPCs</button>
         <button id="hideenv" class="bad-btn bad-cyan">Hide Env</button>
         <button id="hideproj" class="bad-btn bad-cyan">Hide Proj</button>
         <button id="hideall" class="bad-btn bad-cyan">Hide All</button>
         <button id="freezegame" class="bad-btn bad-cyan">Stop Game</button>
         <button id="biggrid" class="bad-btn bad-cyan">Show Big Grids</button>
         <button id="smolgrid" class="bad-btn bad-cyan">Show Small Grids</button>
         <button id="border" class="bad-btn bad-cyan">Show Border</button>
         <button id="range" class="bad-btn bad-cyan">Show Range</button>
         <button id="tracer" class="bad-btn bad-cyan">Show Tracer</button>
         <hr>
         <button id="battle" class="bad-btn bad-gray">Enable Fighting Mode</button>
         <button id="trap" class="bad-btn bad-gray">Enable Auto Trapper</button>
         <button id="switch" class="bad-btn bad-gray">Enable Afk Switch</button>
         <button id="move" class="bad-btn bad-gray">Enable Player Follower</button>
         <button id="rev4" class="bad-btn bad-gray">Enable Rev Player Trick</button>
         <button id="bowfollow" class="bad-btn bad-gray">Enable Bow Follow</button>
         <button id="zoom" class="bad-btn bad-gray">Enable Combat Zoom</button>
         <br>
         <button id="cornerfarm" class="bad-btn bad-gray">Corner Farm Base</button>
         <hr>
         <button id="allowfriend" class="bad-btn bad-gray">Allow Friends Control</button>
         <hr>
         <p>Enter friend name or id below</p>
         <input type="text" class="bad-textbox" id="friend1" style="width: 20%" placeholder="Friend">
         <input type="text" class="bad-textbox" id="friend2" style="width: 20%" placeholder="Friend">
         <input type="text" class="bad-textbox" id="friend3" style="width: 20%" placeholder="Friend">
         <input type="text" class="bad-textbox" id="friend4" style="width: 20%" placeholder="Friend">
         <input type="text" class="bad-textbox" id="friend5" style="width: 20%" placeholder="Friend">
         <input type="text" class="bad-textbox" id="friend6" style="width: 20%" placeholder="Friend">
         <input type="text" class="bad-textbox" id="friend7" style="width: 20%" placeholder="Friend">
         <input type="text" class="bad-textbox" id="friend8" style="width: 20%" placeholder="Friend">
         <input type="text" class="bad-textbox" id="friend9" style="width: 20%" placeholder="Friend">
         <input type="text" class="bad-textbox" id="friend10" style="width: 20%" placeholder="Friend">
         <br>
         <p>Offset:</p><input type="text" class="bad-textbox" value="69" id="offset" style="width: 8%">
      </div>
   `
document.getElementById("hud-menu-settings").childNodes[3].innerHTML = "(　o=^•ェ•)"
document.getElementsByClassName("hud-settings-grid")[0].innerHTML = settingsHTML;
document.getElementById('lagspam-btn').addEventListener('click', lagSpam)
document.getElementById('lagspam-btn').addEventListener('click', lagSpambtn)
document.getElementById("pauseSong").addEventListener('click', pauseAndResetAllSongs)
document.getElementById("spamallparty-btn").addEventListener("click", spamAllParty)
document.getElementById("autosell").addEventListener("click", giveSell);
document.getElementById("newtab").addEventListener("click", () => window.open(`http://zombs.io/#/${game.options.serverId}/${game.ui.getPlayerPartyShareKey()}`));
document.getElementById("autoupgradeall-btn").addEventListener("click", autoUpgradeAll);
document.getElementById("autoupgradeall-btn").addEventListener("click", autoUpgradeAllbtn);
document.getElementById("uparrow").addEventListener("click", autouparrow);
document.getElementById("uparrow").addEventListener("click", autouparrowbtn);
document.getElementById("upstash").addEventListener("click", autoupstash);
document.getElementById("upstash").addEventListener("click", autoupstashbtn);
document.getElementById("upmage").addEventListener("click", autoupmage);
document.getElementById("upmage").addEventListener("click", autoupmagebtn);
document.getElementById("upmines").addEventListener("click", autoupmines);
document.getElementById("upmines").addEventListener("click", autoupminesbtn);
document.getElementById("upwall").addEventListener("click", autoupwall);
document.getElementById("upwall").addEventListener("click", autoupwallbtn);
document.getElementById("updoor").addEventListener("click", autoupdoor);
document.getElementById("updoor").addEventListener("click", autoupdoorbtn);
document.getElementById("uptrap").addEventListener("click", autouptrap);
document.getElementById("uptrap").addEventListener("click", autouptrapbtn);
document.getElementById("upcannon").addEventListener("click", autoupcannon);
document.getElementById("upcannon").addEventListener("click", autoupcannonbtn);
document.getElementById("upmelee").addEventListener("click", autoupmelee);
document.getElementById("upmelee").addEventListener("click", autoupmeleebtn);
document.getElementById("upbomb").addEventListener("click", autoupbomb);
document.getElementById("upbomb").addEventListener("click", autoupbombbtn);
document.getElementById("upharvester").addEventListener("click", autoupharvester);
document.getElementById("upharvester").addEventListener("click", autoupharvesterbtn);
document.getElementById("sellwall").addEventListener('click', toggleSellingWalls);
document.getElementById("selldoor").addEventListener('click', toggleSellingDoors);
document.getElementById("selltrap").addEventListener('click', toggleSellingTraps);
document.getElementById("sellharvester").addEventListener('click', toggleSellingHarvs);
document.getElementById("sellarrow").addEventListener('click', toggleSellingArrows);
document.getElementById("sellcannon").addEventListener('click', toggleSellingCannons);
document.getElementById("sellmagic").addEventListener('click', toggleSellingMages);
document.getElementById("sellmelee").addEventListener('click', toggleSellingMelees);
document.getElementById("sellbomb").addEventListener('click', toggleSellingBombs);
document.getElementById("sellminer").addEventListener('click', toggleSellingMines);
document.getElementById("spampartybyid-btn").addEventListener("click", spamPartyByID);
document.getElementById("autoaccept-btn").addEventListener("click", autoAcceptParty);
document.getElementById("autoaccept-btn").addEventListener("click", autoAcceptPartybtn);
document.getElementById("toggleswing").addEventListener("click", toggleSwing)
document.getElementById("toggleahrc").addEventListener("click", toggleAHRC)
document.getElementById("toggleresp").addEventListener('click', toggleRespawn)
document.getElementById("toggleaim").addEventListener("click", toggleAim)
document.getElementById("togglerb").addEventListener("click", toggleRebuild)
document.getElementById("togglehealthup").addEventListener("click", toggleHealthUp)
document.getElementById("towerheal").addEventListener("click", toggleHealSpell)
document.getElementById("stashleave").addEventListener("click", autoleave);
document.getElementById("toggleabpk").addEventListener("click", abpk);
document.getElementById("toggleabsp").addEventListener("click", absp);
document.getElementById("toggleabbw").addEventListener("click", abbw);
document.getElementById("toggleabbm").addEventListener("click", abbm);
document.getElementById("toggleabsh").addEventListener("click", absh);
document.getElementById("togglespinner").addEventListener("click", spinnerbtn);
document.getElementById("healplayer").addEventListener("click", toggleHealPlayer);
document.getElementById("healpet").addEventListener("click", toggleHealPet);
document.getElementById("revivepet").addEventListener("click", toggleRevivePet);
document.getElementById("evolvepet").addEventListener("click", toggleEvolvePet);
document.getElementById("hidechat").addEventListener("click", hideChat)
document.getElementById("hidepop").addEventListener("click", hidePopupOverlay);
document.getElementById("hideldb").addEventListener("click", hideLeaderboard);
document.getElementById("hidemap").addEventListener("click", hideMap);
document.getElementById("hidepip").addEventListener("click", hidePIP);
document.getElementById("mapenv").addEventListener("click", toggleEnvironmentVisibility);
document.getElementById("daybright").addEventListener("click", toggleday);
document.getElementById("hideground").addEventListener("click", hideGround);
document.getElementById("hidenpcs").addEventListener("click", hideNPCs);
document.getElementById("hideenv").addEventListener("click", hideEnviroment);
document.getElementById("hideproj").addEventListener("click", hideProjectiles);
document.getElementById("hideall").addEventListener("click", hideAll);
document.getElementById("freezegame").addEventListener("click", freezeGame);
document.getElementById("biggrid").addEventListener("click", showGrid);
document.getElementById("smolgrid").addEventListener("click", showGrids);
document.getElementById('clearchat-btn').addEventListener('click', clearChatbtn)
document.getElementById("battle").addEventListener('click', FIGHT);
document.getElementById("trap").addEventListener('click', trapon);
document.getElementById("switch").addEventListener('click', afkswitches);
document.getElementById("move").addEventListener('click', togglemove);
document.getElementById("border").addEventListener('click', showborder)
document.getElementById("range").addEventListener('click', showRange)
document.getElementById("tracer").addEventListener('click', showTracer)
document.getElementById("rev4").addEventListener('click', togglerev4)
document.getElementById("bowfollow").addEventListener('click', togglebowfollow)
document.getElementById("zoom").addEventListener('click', toggleCombatZoom)
document.getElementById("cornerfarm").addEventListener('click', buildcornerfarm)
document.getElementById("allowfriend").addEventListener('click', togglefriend)

function msToTime(s) {
  // Pad to 2 or 3 digits, default is 2
  function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
}

function counter(e = 0) {
  if (e <= -0.99949999999999999e24) {
    return Math.round(e / -1e23) / -10 + "TT";
  }
  if (e <= -0.99949999999999999e21) {
    return Math.round(e / -1e20) / -10 + "TB";
  }
  if (e <= -0.99949999999999999e18) {
    return Math.round(e / -1e17) / -10 + "TM";
  }
  if (e <= -0.99949999999999999e15) {
    return Math.round(e / -1e14) / -10 + "TK";
  }
  if (e <= -0.99949999999999999e12) {
    return Math.round(e / -1e11) / -10 + "T";
  }
  if (e <= -0.99949999999999999e9) {
    return Math.round(e / -1e8) / -10 + "B";
  }
  if (e <= -0.99949999999999999e6) {
    return Math.round(e / -1e5) / -10 + "M";
  }
  if (e <= -0.99949999999999999e3) {
    return Math.round(e / -1e2) / -10 + "K";
  }
  if (e <= 0.99949999999999999e3) {
    return Math.round(e) + "";
  }
  if (e <= 0.99949999999999999e6) {
    return Math.round(e / 1e2) / 10 + "K";
  }
  if (e <= 0.99949999999999999e9) {
    return Math.round(e / 1e5) / 10 + "M";
  }
  if (e <= 0.99949999999999999e12) {
    return Math.round(e / 1e8) / 10 + "B";
  }
  if (e <= 0.99949999999999999e15) {
    return Math.round(e / 1e11) / 10 + "T";
  }
  if (e <= 0.99949999999999999e18) {
    return Math.round(e / 1e14) / 10 + "TK";
  }
  if (e <= 0.99949999999999999e21) {
    return Math.round(e / 1e17) / 10 + "TM";
  }
  if (e <= 0.99949999999999999e24) {
    return Math.round(e / 1e20) / 10 + "TB";
  }
  if (e <= 0.99949999999999999e27) {
    return Math.round(e / 1e+23) / 10 + "TT";
  }
  if (e >= 0.99949999999999999e27) {
    return Math.round(e / 1e+23) / 10 + "TT";
  }
}

let TakingOver = [{
    say: "We at the top again, now what?",
    time: 17000
  },
  {
    say: "Heavy lay the crown, but",
    time: 18050
  },
  {
    say: "Count Us",
    time: 20100
  },
  {
    say: "Higher than the mountain",
    time: 21150
  },
  {
    say: "And we be up here",
    time: 23200
  },
  {
    say: "for the long run",
    time: 24250
  },
  {
    say: "Strap in for a long one",
    time: 25300
  },
  {
    say: "We got everybody on one",
    time: 27350
  },
  {
    say: "Now you're coming at the king",
    time: 29400
  },
  {
    say: "so you better not miss",
    time: 31450
  },
  {
    say: "And we only get stronger",
    time: 33500
  },
  {
    say: "With everything I carry",
    time: 36550
  },
  {
    say: "up on my back",
    time: 37600
  },
  {
    say: "you should paint it up",
    time: 39650
  },
  {
    say: "with a target",
    time: 41700
  },
  {
    say: "Why would you dare me to",
    time: 46850
  },
  {
    say: "do it again?",
    time: 47900
  },
  {
    say: "Come get your spoiler up ahead",
    time: 50050
  },
  {
    say: "We're taking over,",
    time: 53100
  },
  {
    say: "We're taking over",
    time: 56150
  },
  {
    say: "Look at you come at my name,",
    time: 61100
  },
  {
    say: "you 'oughta know by now,",
    time: 63150
  },
  {
    say: "That We're Taking Over,",
    time: 66200
  },
  {
    say: "We're Taking Over",
    time: 69350
  },
  {
    say: "Maybe you wonder what",
    time: 74300
  },
  {
    say: "you're futures gonna be, but",
    time: 75350
  },
  {
    say: "I got it all locked up",
    time: 77400
  },
  {
    say: "Take a lap, now",
    time: 93450
  },
  {
    say: "Don't be mad, now",
    time: 95500
  },
  {
    say: "Run it back, run it back,",
    time: 97550
  },
  {
    say: "run it back, now",
    time: 98600
  },
  {
    say: "I got bodies lining up,",
    time: 100150
  },
  {
    say: "think you're dreaming",
    time: 101200
  },
  {
    say: "Of Greatness",
    time: 102250
  },
  {
    say: "Send you back home,",
    time: 103300
  },
  {
    say: "let you wake up",
    time: 105400
  },
  {
    say: "Why would you dare me to",
    time: 110550
  },
  {
    say: "do it again?",
    time: 111600
  },
  {
    say: "Come get your spoiler up ahead",
    time: 114700
  },
  {
    say: "We're taking over,",
    time: 117800
  },
  {
    say: "We're taking over",
    time: 120900
  },
  {
    say: "Look at you come at my name,",
    time: 126050
  },
  {
    say: "you 'oughta know by now,",
    time: 128150
  },
  {
    say: "That We're Taking Over,",
    time: 131200
  },
  {
    say: "We're Taking Over",
    time: 134300
  },
  {
    say: "Maybe you wonder what",
    time: 138450
  },
  {
    say: "you're futures gonna be, but",
    time: 139500
  },
  {
    say: "I got it all locked up",
    time: 140600
  },
  {
    say: "再以后，",
    time: 158050
  },
  {
    say: "除了厮杀，这还有其他么？？？",
    time: 159100
  },
  {
    say: "我左右，",
    time: 161200
  },
  {
    say: "键盘噼啪着，",
    time: 162250
  },
  {
    say: "时间滴答着",
    time: 163300
  },
  {
    say: "还不够，",
    time: 164350
  },
  {
    say: "你的固执，让我来守候",
    time: 165400
  },
  {
    say: "哪怕太迟，",
    time: 166450
  },
  {
    say: "也不想以后",
    time: 167500
  },
  {
    say: "就在这时，",
    time: 168550
  },
  {
    say: "放肆的打斗",
    time: 169600
  },
  {
    say: "I got the heart of a lion",
    time: 170650
  },
  {
    say: "I know the higher you climb",
    time: 171700
  },
  {
    say: "the harder you fall",
    time: 172750
  },
  {
    say: "I'm at the top of the mountain",
    time: 173800
  },
  {
    say: "Too many bodies to count",
    time: 174850
  },
  {
    say: "I've been through it all",
    time: 175900
  },
  {
    say: "I had to weather the storm",
    time: 176950
  },
  {
    say: "to get to the level I'm on",
    time: 178000
  },
  {
    say: "That's how the legend was born",
    time: 179050
  },
  {
    say: "All of my enemies already dead",
    time: 180100
  },
  {
    say: "I'm bored, I'm ready for more",
    time: 181200
  },
  {
    say: "They know I'm ready for war",
    time: 182250
  },
  {
    say: "I told 'em",
    time: 183300
  },
  {
    say: "We're taking over,",
    time: 184350
  },
  {
    say: "We're taking over",
    time: 187400
  },
  {
    say: "Look at you come at my name,",
    time: 192550
  },
  {
    say: "you 'oughta know by now,",
    time: 194650
  },
  {
    say: "That We're Taking Over,",
    time: 197700
  },
  {
    say: "We're Taking Over",
    time: 200800
  },
  {
    say: "Maybe you wonder what",
    time: 205950
  },
  {
    say: "you're futures gonna be, but",
    time: 207000
  },
  {
    say: "I got it all locked up",
    time: 208050
  }
];

let NeverGonna = [{
    say: "We're no strangers to Love",
    time: 19000
  },
  {
    say: "You know the rules",
    time: 23000
  },
  {
    say: "And so do I",
    time: 24050
  },
  {
    say: "A full commitment's what",
    time: 27000
  },
  {
    say: "I'm thinking of",
    time: 28500
  },
  {
    say: "You wouldn't get this",
    time: 31000
  },
  {
    say: "From any other guy",
    time: 33000
  },
  {
    say: "I",
    time: 35000
  },
  {
    say: "Just wanna tell you how im feeling",
    time: 36050
  },
  {
    say: "Gotta make you understand",
    time: 40500
  },
  {
    say: "Never gonna give you up",
    time: 43050
  },
  {
    say: "Never gonna let you down",
    time: 45000
  },
  {
    say: "Never gonna run around",
    time: 47000
  },
  {
    say: "And desert you",
    time: 49000
  },
  {
    say: "Never gonna make you cry",
    time: 52000
  },
  {
    say: "Never gonna say goodbye",
    time: 53050
  },
  {
    say: "Never gonna tell a lie",
    time: 56000
  },
  {
    say: "And hurt you",
    time: 58000
  },
  {
    say: "We've known each other",
    time: 61000
  },
  {
    say: "For so long",
    time: 63000
  },
  {
    say: "Your heart's been aching,",
    time: 64050
  },
  {
    say: "But",
    time: 66000
  },
  {
    say: "You're too shy to say it",
    time: 67050
  },
  {
    say: "Inside, we both know what's been going on",
    time: 69696
  },
  {
    say: "We know the game",
    time: 74000
  },
  {
    say: "And we're gonna play it",
    time: 75050
  },
  {
    say: "Aaaaaaaand",
    time: 77000
  },
  {
    say: "If you ask me how I'm feeling",
    time: 78500
  },
  {
    say: "Dont tell me you're too blind to see",
    time: 82000
  },
  {
    say: "Never gonna give you up",
    time: 85000
  },
  {
    say: "Never gonna let you down",
    time: 88000
  },
  {
    say: "Never gonna run around",
    time: 90000
  },
  {
    say: "And desert you",
    time: 91500
  },
  {
    say: "Never gonna make you cry",
    time: 94000
  },
  {
    say: "Never gonna say goodbye",
    time: 96000
  },
  {
    say: "Never gonna tell a lie",
    time: 98000
  },
  {
    say: "And hurt you",
    time: 100000
  },
  {
    say: "Never gonna give you up",
    time: 102500
  },
  {
    say: "Never gonna let you down",
    time: 104000
  },
  {
    say: "Never gonna run around",
    time: 106000
  },
  {
    say: "And desert you",
    time: 108000
  },
  {
    say: "Never gonna make you cry",
    time: 110000
  },
  {
    say: "Never gonna say goodbye",
    time: 112000
  },
  {
    say: "Never gonna tell a lie",
    time: 115000
  },
  {
    say: "And hurt you",
    time: 117000
  },
  {
    say: "(Ooh, give you up),",
    time: 120000
  },
  {
    say: "(Ooh, give you up)",
    time: 123500
  },
  {
    say: "Never gonna give,",
    time: 127500
  },
  {
    say: "Never gonna give",
    time: 128550
  },
  {
    say: "(Give you up)",
    time: 130000
  },
  {
    say: "Never gonna give,",
    time: 132500
  },
  {
    say: "Never gonna give",
    time: 133550
  },
  {
    say: "(Give you up)",
    time: 135050
  },
  {
    say: "We've known each other",
    time: 137000
  },
  {
    say: "For so long",
    time: 138050
  },
  {
    say: "Your heart's been aching,",
    time: 141000
  },
  {
    say: "But",
    time: 142050
  },
  {
    say: "You're too shy to say it",
    time: 143500
  },
  {
    say: "Inside, we both know what's been",
    time: 145000
  },
  {
    say: "Going on",
    time: 147500
  },
  {
    say: "We know the game and we're",
    time: 149500
  },
  {
    say: "Gonna play it",
    time: 151700
  },
  {
    say: "I",
    time: 153500
  },
  {
    say: "Just wanna tell you how I'm feeling",
    time: 155000
  },
  {
    say: "Gotta make you understand",
    time: 159000
  },
  {
    say: "Never gonna give you up",
    time: 161500
  },
  {
    say: "Never gonna let you down",
    time: 163500
  },
  {
    say: "Never gonna run around",
    time: 165500
  },
  {
    say: "And desert you",
    time: 167000
  },
  {
    say: "Never gonna make you cry",
    time: 170000
  },
  {
    say: "Never gonna say goodbye",
    time: 172000
  },
  {
    say: "Never gonna tell a lie",
    time: 174000
  },
  {
    say: "And hurt you",
    time: 176000
  },
  {
    say: "Never gonna give you up",
    time: 178500
  },
  {
    say: "Never gonna let you down",
    time: 180500
  },
  {
    say: "Never gonna run around",
    time: 182500
  },
  {
    say: "And desert you",
    time: 184500
  },
  {
    say: "Never gonna make you cry",
    time: 187000
  },
  {
    say: "Never gonna say goodbye",
    time: 189000
  },
  {
    say: "Never gonna tell a lie",
    time: 191000
  },
  {
    say: "And hurt you",
    time: 193000
  },
  {
    say: "Never gonna give you up",
    time: 195000
  },
  {
    say: "Never gonna let you down",
    time: 197000
  },
  {
    say: "Never gonna run around",
    time: 199000
  },
  {
    say: "And desert you",
    time: 201000
  },
  {
    say: "Never gonna make you cry",
    time: 203000
  },
  {
    say: "Never gonna say goodbye",
    time: 205000
  },
  {
    say: "Never gonna tell a lie",
    time: 207000
  },
  {
    say: "And hurt you",
    time: 209000
  },
]

let RuleTheWorld = [{
    say: "Welcome to your life",
    time: 29000
  },
  {
    say: "There's no turning back",
    time: 33000
  },
  {
    say: "Even while we sleep",
    time: 37000
  },
  {
    say: "We will find you",
    time: 42000
  },
  {
    say: "Acting on your",
    time: 44000
  },
  {
    say: "Best behaviour",
    time: 46200
  },
  {
    say: "Turn your back",
    time: 48400
  },
  {
    say: "On mother nature",
    time: 50700
  },
  {
    say: "Everybody",
    time: 52300
  },
  {
    say: "Wants to rule the world",
    time: 54900
  },
  {
    say: "It's my own design",
    time: 67700
  },
  {
    say: "It's my own remorse",
    time: 72000
  },
  {
    say: "Help me to decide",
    time: 76000
  },
  {
    say: "Help me make the",
    time: 80000
  },
  {
    say: "Most of freedom",
    time: 83000
  },
  {
    say: "And of pleasure",
    time: 84500
  },
  {
    say: "Nothing ever",
    time: 87000
  },
  {
    say: "Lasts forever",
    time: 89000
  },
  {
    say: "Everybody",
    time: 91000
  },
  {
    say: "Wants to rule the world",
    time: 93500
  },
  {
    say: "There's a room where",
    time: 96000
  },
  {
    say: "The light won't find you",
    time: 97800
  },
  {
    say: "Holding hands while the walls",
    time: 100000
  },
  {
    say: "Come tumbling down",
    time: 102600
  },
  {
    say: "When they do",
    time: 104550
  },
  {
    say: "I'll be right behind you",
    time: 105600
  },
  {
    say: "So glad we've almost made it",
    time: 109000
  },
  {
    say: "So sad they had to fade it",
    time: 113000
  },
  {
    say: "Everybody",
    time: 117000
  },
  {
    say: "Wants to rule the world",
    time: 119000
  },
  {
    say: "I can't stand this indecision",
    time: 168500
  },
  {
    say: "Married with a lack of vision",
    time: 172700
  },
  {
    say: "Everybody",
    time: 177000
  },
  {
    say: "Wants to rule the",
    time: 179000
  },
  {
    say: "Say that you'll",
    time: 182000
  },
  {
    say: "Never, never,",
    time: 183550
  },
  {
    say: "Never need it",
    time: 184800
  },
  {
    say: "One headline",
    time: 186000
  },
  {
    say: "Why beileve it?",
    time: 187800
  },
  {
    say: "Everybody",
    time: 190000
  },
  {
    say: "Wants to rule the world",
    time: 192000
  },
  {
    say: "All for freedom",
    time: 203000
  },
  {
    say: "And for pleasure",
    time: 205000
  },
  {
    say: "Nothing ever",
    time: 207000
  },
  {
    say: "Lasts forever",
    time: 209000
  },
  {
    say: "Everybody",
    time: 211000
  },
  {
    say: "Wants to rule the world",
    time: 213500
  }
]


const DejaVu = [{
    say: 'See your body',
    time: 39750
  },
  {
    say: 'Into the moonlight',
    time: 41300
  },
  {
    say: 'Even if I try to cancel',
    time: 42850
  },
  {
    say: 'All the pictures',
    time: 46000
  },
  {
    say: 'Into the mind',
    time: 47600
  },
  {
    say: "There's a flashing in my eyes",
    time: 49000
  },
  {
    say: 'Don\'t you see my condition',
    time: 51250
  },
  {
    say: 'The fiction',
    time: 53000
  },
  {
    say: 'Is gonna run it again',
    time: 54750
  },
  {
    say: "Can't you see now illusions",
    time: 56500
  },
  {
    say: 'Right into your mind',
    time: 58150
  },
  {
    say: 'Deja vu',
    time: 60000
  },
  {
    say: 'I\'ve just been',
    time: 61250
  },
  {
    say: 'In this place before',
    time: 62850
  },
  {
    say: 'Higher on the street',
    time: 64500
  },
  {
    say: 'And I know it\'s my time to go',
    time: 66150
  },
  {
    say: 'Calling you',
    time: 67750
  },
  {
    say: 'And the search is a mystery',
    time: 69600
  },
  {
    say: 'Standing on my feet',
    time: 71450
  },
  {
    say: 'It\'s so hard when',
    time: 73300
  },
  {
    say: 'I try to be me',
    time: 75000
  },
  {
    say: 'Uoooh!',
    time: 77000
  },
  {
    say: 'Deja vu',
    time: 78500
  },
  {
    say: 'I\'ve just been',
    time: 80000
  },
  {
    say: 'In this time before',
    time: 81550
  },
  {
    say: 'Higher on the beat',
    time: 83000
  },
  {
    say: 'And I know it\'s a place to go',
    time: 84550
  },
  {
    say: 'Calling you',
    time: 86100
  },
  {
    say: 'And the search is a mystery',
    time: 87850
  },
  {
    say: 'Standing on my feet',
    time: 89550
  },
  {
    say: 'It\'s so hard when',
    time: 91250
  },
  {
    say: 'I try to be me',
    time: 93000
  },
  {
    say: 'Yeah!',
    time: 94550
  },
  {
    say: 'See the future',
    time: 105100
  },
  {
    say: 'Into the present',
    time: 106750
  },
  {
    say: 'See my past lives',
    time: 108250
  },
  {
    say: 'In the distance',
    time: 110000
  },
  {
    say: 'Try to guess now',
    time: 111500
  },
  {
    say: "What's going on",
    time: 113000
  },
  {
    say: 'And the band begins to play...',
    time: 114500
  },
  {
    say: 'Don\'t you see my condition',
    time: 116000
  },
  {
    say: 'The fiction',
    time: 117750
  },
  {
    say: 'Is gonna run it again',
    time: 119250
  },
  {
    say: "Can't you see now illusions",
    time: 121000
  },
  {
    say: 'Right into your mind',
    time: 123000
  },
  {
    say: 'Deja vu',
    time: 125000
  },
  {
    say: 'I\'ve just been',
    time: 126500
  },
  {
    say: 'In this place before',
    time: 128000
  },
  {
    say: 'Higher on the street',
    time: 130000
  },
  {
    say: 'And I know it\'s my time to go',
    time: 131500
  },
  {
    say: 'Calling you',
    time: 133000
  },
  {
    say: 'And the search is a mystery',
    time: 134750
  },
  {
    say: 'Standing on my feet',
    time: 136500
  },
  {
    say: 'It\'s so hard when',
    time: 138250
  },
  {
    say: 'I try to be me',
    time: 140000
  },
  {
    say: 'Uoooh!',
    time: 141750
  },
  {
    say: 'Deja vu',
    time: 143500
  },
  {
    say: 'I\'ve just been',
    time: 145250
  },
  {
    say: 'In this time before',
    time: 146750
  },
  {
    say: 'Higher on the beat',
    time: 148500
  },
  {
    say: 'And I know it\'s a place to go',
    time: 150000
  },
  {
    say: 'Calling you',
    time: 151500
  },
  {
    say: 'And the search is a mystery',
    time: 152750
  },
  {
    say: 'Standing on my feet',
    time: 154500
  },
  {
    say: 'It\'s so hard when',
    time: 156000
  },
  {
    say: 'I try to be me',
    time: 157500
  },
  {
    say: 'Yeah!',
    time: 159250
  },
  {
    say: 'See your body',
    time: 170600
  },
  {
    say: 'Into the moonlight',
    time: 172250
  },
  {
    say: 'Even if I try to cancel',
    time: 173750
  },
  {
    say: 'All the pictures',
    time: 175500
  },
  {
    say: 'Into the mind',
    time: 176750
  },
  {
    say: "There's a flashing in my eyes",
    time: 179300
  },
  {
    say: 'Don\'t you see my condition',
    time: 182100
  },
  {
    say: 'The fiction',
    time: 184000
  },
  {
    say: 'Is gonna run it again',
    time: 185500
  },
  {
    say: "Can't you see now illusions",
    time: 187350
  },
  {
    say: 'Right into your mind',
    time: 189250
  },
  {
    say: 'Deja vu',
    time: 191000
  },
  {
    say: 'I\'ve just been',
    time: 192000
  },
  {
    say: 'In this place before',
    time: 193500
  },
  {
    say: 'Higher on the street',
    time: 195000
  },
  {
    say: 'And I know it\'s my time to go',
    time: 196500
  },
  {
    say: 'Calling you',
    time: 198000
  },
  {
    say: 'And the search is a mystery',
    time: 199750
  },
  {
    say: 'Standing on my feet',
    time: 201500
  },
  {
    say: 'It\'s so hard when',
    time: 203000
  },
  {
    say: 'I try to be me',
    time: 204500
  },
  {
    say: 'Uoooh!',
    time: 206250
  },
  {
    say: 'Deja vu',
    time: 208000
  },
  {
    say: 'I\'ve just been',
    time: 209750
  },
  {
    say: 'In this time before',
    time: 211250
  },
  {
    say: 'Higher on the beat',
    time: 213000
  },
  {
    say: 'And I know it\'s a place to go',
    time: 214500
  },
  {
    say: 'Calling you',
    time: 216000
  },
  {
    say: 'And the search is a mystery',
    time: 217250
  },
  {
    say: 'Standing on my feet',
    time: 219000
  },
  {
    say: 'It\'s so hard when',
    time: 220250
  },
  {
    say: 'I try to be me',
    time: 221750
  },
  {
    say: 'Yeah!',
    time: 222000
  },
];

let DownLikeThat = [{
    say: "Why you gotta go,",
    time: 7000
  },
  {
    say: "Go and let me down",
    time: 9500
  },
  {
    say: "Like that, ayy",
    time: 11000
  },
  {
    say: "Down like that",
    time: 12500
  },
  {
    say: "Oh why,",
    time: 13550
  },
  {
    say: "Why you go",
    time: 15500
  },
  {
    say: "And let me",
    time: 16550
  },
  {
    say: "Down like that",
    time: 17600
  },
  {
    say: "Ayy, Down like?",
    time: 18700
  },
  {
    say: "I was nothin but loyal to you from the start",
    time: 20000
  },
  {
    say: "You changed up on me as soon as things start gettin hard",
    time: 23000
  },
  {
    say: "I've only then the light despite us being in the dark",
    time: 26500
  },
  {
    say: "And you let me down like that,",
    time: 30000
  },
  {
    say: "Yeah",
    time: 32000
  },
  {
    say: "Down like that",
    time: 33050
  },
  {
    say: "(Oh why)",
    time: 34100
  },
  {
    say: "Yeah, Yeah",
    time: 35200
  },
  {
    say: "I want that knockdown",
    time: 36300
  },
  {
    say: "Fuck up the system",
    time: 38200
  },
  {
    say: "Make it shut down",
    time: 40000
  },
  {
    say: "I'm cold with this,",
    time: 42000
  },
  {
    say: "Slow man down the freezer",
    time: 43600
  },
  {
    say: "Wanna backstab like frieza",
    time: 45000
  },
  {
    say: "Dictate death like caesar",
    time: 47000
  },
  {
    say: "Always come through with a bee",
    time: 49000
  },
  {
    say: "Got to do a lot to trouble me",
    time: 50050
  },
  {
    say: "Visionary still won't tunnel me",
    time: 51700
  },
  {
    say: "Me to you, now that will chuckle me",
    time: 53000
  },
  {
    say: "Devilish views when they're aiming at the profit",
    time: 55000
  },
  {
    say: "Emitting pain till you're nothing",
    time: 56500
  },
  {
    say: "Remember what I said when that pussy tried moving with the opps",
    time: 58000
  },
  {
    say: "Now he back with the blocks nigga",
    time: 60000
  },
  {
    say: "Why you gotta go,",
    time: 62000
  },
  {
    say: "Go and let me down",
    time: 64500
  },
  {
    say: "Like that, ayy,",
    time: 66000
  },
  {
    say: "Down like that?",
    time: 67400
  },
  {
    say: "Oh why,",
    time: 68450
  },
  {
    say: "Why you go",
    time: 70000
  },
  {
    say: "And let me down like that",
    time: 71050
  },
  {
    say: "Ayy, down like",
    time: 73300
  },
  {
    say: "I was nothin but loyal to you from the start",
    time: 74900
  },
  {
    say: "You changed up on me as soon as things start gettin hard",
    time: 78000
  },
  {
    say: "I've only then the light despite us being in the dark",
    time: 81500
  },
  {
    say: "And you let me down like that,",
    time: 85000
  },
  {
    say: "Yeah,",
    time: 87000
  },
  {
    say: "Down like that",
    time: 88050
  },
  {
    say: "(Oh why)",
    time: 89100
  },
  {
    say: "Phantoms in my yard so ring around the rolls",
    time: 90400
  },
  {
    say: "(SKRR)",
    time: 92400
  },
  {
    say: "Hardest on the block the biggest one, da boss",
    time: 93650
  },
  {
    say: "Helicopter pad the home os sammy sosa",
    time: 97000
  },
  {
    say: "(Biggest)",
    time: 98800
  },
  {
    say: "Stealing all the bases I'm the ladies token",
    time: 100000
  },
  {
    say: "(WOOO)",
    time: 102000
  },
  {
    say: "Bitches always bad,",
    time: 104300
  },
  {
    say: "I'm known to blow the budgets",
    time: 105350
  },
  {
    say: "Meek was at the crib so double M the subject",
    time: 107000
  },
  {
    say: "(AHHH)",
    time: 110000
  },
  {
    say: "Condo got three levels,",
    time: 111100
  },
  {
    say: "Postmate all the lunches",
    time: 112200
  },
  {
    say: "Flippin all the kilos",
    time: 114200
  },
  {
    say: "Keepin all the grudges",
    time: 115250
  },
  {
    say: "(BOSS)",
    time: 117000
  },
  {
    say: "Ain't no more let downs unless the top is getting dropped",
    time: 118050
  },
  {
    say: "I love it at the top my concierge don't ever stop me",
    time: 120990
  },
  {
    say: "You know I fuck with ross I even went and bought da block",
    time: 124000
  },
  {
    say: "A hundred million dollars strong I really came from sellin rocks",
    time: 127000
  },
  {
    say: "Championship belt them vvs they spark",
    time: 130000
  },
  {
    say: "Steal it hit the gas and get out on the narcs",
    time: 133400
  },
  {
    say: "Killas move for free I just can't pick a cost",
    time: 135900
  },
  {
    say: "Put the drip on market took it to the charts",
    time: 138700
  },
  {
    say: "Now I'm rocking with the biggest",
    time: 141000
  },
  {
    say: "And I'm fucking with the boss",
    time: 142700
  },
  {
    say: "Why you gotta go,",
    time: 144000
  },
  {
    say: "Go and let me down",
    time: 146800
  },
  {
    say: "Like that, ayy",
    time: 148000
  },
  {
    say: "Down like that",
    time: 149700
  },
  {
    say: "Oh why,",
    time: 150800
  },
  {
    say: "Why you go",
    time: 152900
  },
  {
    say: "And let me down like that",
    time: 154000
  },
  {
    say: "Ayy, down like",
    time: 155250
  },
  {
    say: "I was nothin but loyal to you from the start",
    time: 157350
  },
  {
    say: "You changed up on me as soon as things start gettin hard",
    time: 160000
  },
  {
    say: "I've only then the light despite us being in the dark",
    time: 164000
  },
  {
    say: "And you let me down like that,",
    time: 167700
  },
  {
    say: "Yeah,",
    time: 169400
  },
  {
    say: "Down like that",
    time: 170450
  },
  {
    say: "(Oh why)",
    time: 171500
  }
]

let superidol = [{
    say: "Super idol 的笑容",
    time: 300
  },
  {
    say: "都没你的甜",
    time: 2300
  },
  {
    say: "八月正午的阳光",
    time: 4000
  },
  {
    say: "都没你耀眼",
    time: 5500
  },
  {
    say: "热爱105度的你",
    time: 7800
  },
  {
    say: "滴滴青纯的蒸馏水",
    time: 10100
  },
  {
    say: "你不知道你有多可爱",
    time: 16000
  },
  {
    say: "跌倒后会傻笑着再站起来",
    time: 18400
  },
  {
    say: "你从来都不轻言失败",
    time: 22600
  },
  {
    say: "对梦想的执着一直不曾更改",
    time: 25400
  },
  {
    say: "很安心",
    time: 29000
  },
  {
    say: "当你对我说",
    time: 30700
  },
  {
    say: "不怕有我在",
    time: 32100
  },
  {
    say: "放着让我来",
    time: 34300
  },
  {
    say: "勇敢追自己的梦想",
    time: 36800
  },
  {
    say: "那坚定的模样",
    time: 38700
  },
  {
    say: "Super idol 的笑容",
    time: 42700
  },
  {
    say: "都没你的甜",
    time: 44500
  },
  {
    say: "八月正午的阳光",
    time: 46000
  },
  {
    say: "都没你耀眼",
    time: 48000
  },
  {
    say: "热爱105度的你",
    time: 49800
  },
  {
    say: "滴滴清纯的蒸馏水",
    time: 52500
  },
  {
    say: "在这独一无二",
    time: 56800
  },
  {
    say: "属于我的时代",
    time: 58000
  },
  {
    say: "不怕失败来一场",
    time: 60000
  },
  {
    say: "痛快的热爱",
    time: 62000
  },
  {
    say: "热爱105度的你",
    time: 63800
  },
  {
    say: "滴滴清纯的蒸馏水",
    time: 66300
  },
  {
    say: "在这独一无二",
    time: 70700
  },
  {
    say: "属于我的时代",
    time: 72000
  },
  {
    say: "莫忘了初心常在",
    time: 74000
  },
  {
    say: "痛快去热爱",
    time: 76000
  },
  {
    say: "热爱105度的你",
    time: 77700
  },
  {
    say: "滴滴青纯的蒸馏水",
    time: 80400
  },
  {
    say: "喝一，口又，",
    time: 83000
  },
  {
    say: "活力，全开~",
    time: 84500
  },
  {
    say: "再次，回到，",
    time: 90000
  },
  {
    say: "最佳，状态~",
    time: 91700
  },
  {
    say: "喝一口哟~",
    time: 97000
  },
  {
    say: "喔你不知道你有多可爱",
    time: 99300
  },
  {
    say: "跌倒后会傻笑着再站起来",
    time: 102500
  },
  {
    say: "你从来都不轻言失败",
    time: 106900
  },
  {
    say: "对梦想的执着一直不曾更改",
    time: 109600
  },
  {
    say: "很安心",
    time: 113000
  },
  {
    say: "当你对我说",
    time: 114500
  },
  {
    say: "不怕有我在",
    time: 116000
  },
  {
    say: "放着让我来",
    time: 117900
  },
  {
    say: "勇敢追自己梦想",
    time: 120700
  },
  {
    say: "那坚定的模样",
    time: 123000
  },
  {
    say: "Super idol 的笑容",
    time: 126800
  },
  {
    say: "都没你的甜",
    time: 128200
  },
  {
    say: "八月正午的阳光",
    time: 130300
  },
  {
    say: "都没你耀眼",
    time: 132000
  },
  {
    say: "热爱105度的你",
    time: 133700
  },
  {
    say: "滴滴青纯的蒸馏水",
    time: 136200
  },
  {
    say: "在这独一无二",
    time: 140900
  },
  {
    say: "属于我的时代",
    time: 142000
  },
  {
    say: "不怕失败来一场",
    time: 144100
  },
  {
    say: "痛快的热爱",
    time: 146000
  },
  {
    say: "热爱105度的你",
    time: 147800
  },
  {
    say: "滴滴清纯的蒸馏水",
    time: 150500
  },
  {
    say: "在这独一无二",
    time: 154900
  },
  {
    say: "属于我的时代",
    time: 156000
  },
  {
    say: "莫忘了初心常在",
    time: 158500
  },
  {
    say: "痛快去热爱",
    time: 160000
  },
  {
    say: "热爱105度的你",
    time: 161900
  },
  {
    say: "滴滴青纯的蒸馏水",
    time: 164200
  },
  {
    say: "喝一，口又，",
    time: 167000
  },
  {
    say: "活力，全开~",
    time: 168700
  },
  {
    say: "再次，回到，",
    time: 174000
  },
  {
    say: "最佳，状态~",
    time: 175900
  },
  {
    say: "喝一，口又，",
    time: 181000
  },
  {
    say: "活力，全开~",
    time: 182800
  }
]

let ForTheNight = [
    {
        say: "CashMoneyAP",
        time: 1700
    },
    {
        say: "Get 'em, get 'em, get 'em, oh",
        time: 4500
    },
    {
        say: "Oh (I'm tryna fuckin' get 'em),",
        time: 6900
    },
    {
        say: "Oh (I'm tryna fuckin' get 'em)",
        time: 9000
    },
    {
        say: "Oh, oh (Get 'em), oh",
        time: 10050
    },
    {
        say: "Oh (Gettin big on this), oh, oh, oh",
        time: 12300
    },
    {
        say: "Oh, oh, oh, oh",
        time: 15500
    },
    {
        say: "What do you want?",
        time: 22000
    },
    {
        say: "Won't tell you twice, yeah",
        time: 24000
    },
    {
        say: "I'm a thief in the night",
        time: 25800
    },
    {
        say: "(Thief in the night), oh",
        time: 27000
    },
    {
        say: "I did some wrong (Oh, oh),",
        time: 29300
    },
    {
        say: "But I'm always right (Oh, oh)",
        time: 31700
    },
    {
        say: "Said I know how to shoot",
        time: 33333
    },
    {
        say: "(Oh, oh)",
        time: 34373
    },
    {
        say: "And I know how to fight",
        time: 35500
    },
    {
        say: "If I tell you once,",
        time: 37000
    },
    {
        say: "Won't tell you twice",
        time: 38900
    },
    {
        say: "I'm real discreet",
        time: 41000
    },
    {
        say: "Like a thief in the night",
        time: 42900
    },
    {
        say: "(Look)",
        time: 44000
    },
    {
        say: "If I call you bae,",
        time: 45050
    },
    {
        say: "You bae for the day",
        time: 46300
    },
    {
        say: "Or a bae for the night,",
        time: 48800
    },
    {
        say: "You not my wife",
        time: 50000
    },
    {
        say: "She want a killer",
        time: 52400
    },
    {
        say: "To fuck all night",
        time: 54400
    },
    {
        say: "I wanna fuck on a thot,",
        time: 56300
    },
    {
        say: "Gimme head all night",
        time: 58000
    },
    {
        say: "AP, big rocks,",
        time: 60000
    },
    {
        say: "In the hood with the 'rillas",
        time: 63000
    },
    {
        say: "5k on the dinner,",
        time: 64900
    },
    {
        say: "Bring three hundered thou' to the dealer",
        time: 66666
    },
    {
        say: "I did some wrong (Oh, oh),",
        time: 67800
    },
    {
        say: "But I'm always right (Oh, oh)",
        time: 69966
    },
    {
        say: "Said I know how to shoot",
        time: 71700
    },
    {
        say: "(Oh, oh)",
        time: 72750
    },
    {
        say: "And I know how to fight",
        time: 73800
    },
    {
        say: "If I tell you once,",
        time: 75000
    },
    {
        say: "Won't tell you twice",
        time: 77000
    },
    {
        say: "I'm real discreet,",
        time: 79000
    },
    {
        say: "Like a thief in the night",
        time: 80900
    },
    {
        say: "(Baby)",
        time: 82900
    },
    {
        say: "I'm rich but I'm ridin',",
        time: 83950
    },
    {
        say: "I'm low on exotic,",
        time: 85000
    },
    {
        say: "I'm 'bout to fly out and go get me some",
        time: 86050
    },
    {
        say: "Nothin' ain't seen, all this money on me,",
        time: 88000
    },
    {
        say: "Hunnid racks in the bad, thats honey bun",
        time: 89400
    },
    {
        say: "Baby og, I been runnin' these streets,",
        time: 91500
    },
    {
        say: "Got the game from lashawn, I'm my mama's son",
        time: 93500
    },
    {
        say: "Learned 'bout the triple cross when I was young",
        time: 95900
    },
    {
        say: "And I know I ain't goin' so I keep a gun",
        time: 97200
    },
    {
        say: "I flew to Paris just to buy some dior",
        time: 99100
    },
    {
        say: "She beggin' for attention, I don't see her",
        time: 100969
    },
    {
        say: "C. I. P. Pop,",
        time: 102600
    },
    {
        say: "I wish that you could see us",
        time: 103650
    },
    {
        say: "Million cash plus whenever I go re-up",
        time: 104700
    },
    {
        say: "I got some niggas in the street, won't beat me",
        time: 106400
    },
    {
        say: "I got the iindustry tryna be me",
        time: 108400
    },
    {
        say: "I just go Ray Charles, they can't see me",
        time: 110500
    },
    {
        say: "I'm in a Rolls-Royce with a RiRi",
        time: 112500
    },
    {
        say: "I did some wrong (Oh, oh),",
        time: 113700
    },
    {
        say: "But I'm always right (Oh, oh)",
        time: 115500
    },
    {
        say: "Said I know how to shoot",
        time: 117200
    },
    {
        say: "(Oh, oh)",
        time: 118250
    },
    {
        say: "And I know how to fight",
        time: 119300
    },
    {
        say: "If I tell you once,",
        time: 121000
    },
    {
        say: "Won't tell you twice",
        time: 123000
    },
    {
        say: "I'm real discreet,",
        time: 124900
    },
    {
        say: "Like a thief in the night",
        time: 125950
    },
    {
        say: "(Yeah)",
        time: 128500
    },
    {
        say: "Like a thief in the night",
        time: 129550
    },
    {
        say: "(Thief)",
        time: 130600
    },
    {
        say: "I pull up, give her D for the night (Uh-huh)",
        time: 131650
    },
    {
        say: "Tryna fuck in the V, it's aight (Let's fuck)",
        time: 133000
    },
    {
        say: "We can't fuck up my seats 'cause they white",
        time: 134900
    },
    {
        say: "(That's my seats, watch my motherfuckin' seats)",
        time: 136000
    },
    {
        say: "I'm livin' like \"Thriller\",",
        time: 137200
    },
    {
        say: "I only come out at the night time",
        time: 138300
    },
    {
        say: "She don't fuck with liquor",
        time: 139800
    },
    {
        say: "Don't like bein' tipsy",
        time: 140850
    },
    {
        say: "She don't do the Henny,",
        time: 141900
    },
    {
        say: "Just white wine (What she do?)",
        time: 142950
    },
    {
        say: "Pop the cork on some new Pinot Grigio (Yeah)",
        time: 144000
    },
    {
        say: "I pull up in the Porsche wit' a freaky hoe (Zoom)",
        time: 145900
    },
    {
        say: "Park the porsche and pull up in a Lambo' (Hmph)",
        time: 147000
    },
    {
        say: "I hop out, Major Payne, rockin' camo (Yessir)",
        time: 149000
    },
    {
        say: "Think she cute, make her fuck,",
        time: 151000
    },
    {
        say: "Watch her man go (She cute)",
        time: 152050
    },
    {
        say: "Like to shoot, light you up,",
        time: 153100
    },
    {
        say: "Bitch, I'm Rambo",
        time: 154150
    },
    {
        say: "Cuban link full of rocks,",
        time: 155200
    },
    {
        say: "It's a choker (Oh)",
        time: 156250
    },
    {
        say: "Rest in peace to the Pop,",
        time: 157300
    },
    {
        say: "Make me smoke ya",
        time: 158350
    },
    {
        say: "I did some wrong (Oh, oh),",
        time: 159400
    },
    {
        say: "But I'm always right (Oh, oh)",
        time: 161000
    },
    {
        say: "Said I know how to shoot",
        time: 162900
    },
    {
        say: "(Oh, oh)",
        time: 163950
    },
    {
        say: "And I know how to fight",
        time: 165000
    },
    {
        say: "If I tell you once,",
        time: 166900
    },
    {
        say: "Won't tell you twice",
        time: 168800
    },
    {
        say: "I'm real discreet,",
        time: 169900
    },
    {
        say: "Like a thief in the night",
        time: 171000
    }
    ]

let CocoNut = [
    {
        say: "La la la, la la la, la la la la la la",
        time: 100
    },
    {
        say: "La la la, la la la, la la la la la la",
        time: 4000
    },
    {
        say: "La la la, la la la, la la la la la la",
        time: 7500
    },
    {
        say: "La la la, la la la, la la la la la la",
        time: 11000
    },
    {
        say: "KO KO NUT",
        time: 15000
    },
    {
        say: "KO KO KO KO NUT",
        time: 16400
    },
    {
        say: "(kokonut)",
        time: 17450
    },
    {
        say: "KO KO NUT",
        time: 18500
    },
    {
        say: "KO KO KO KO KO NUT",
        time: 19900
    },
    {
        say: "(kokonut)",
        time: 21400
    },
    {
        say: "KO KO NUT",
        time: 22450
    },
    {
        say: "KO KO KO KO KO NUT",
        time: 23500
    },
    {
        say: "(kokonut)",
        time: 24700
    },
    {
        say: "KO KO NUT",
        time: 25750
    },
    {
        say: "KO KO KO KO KO NUT",
        time: 26900
    },
    {
        say: "The kokonut nut",
        time: 28900
    },
    {
        say: "Is a giant nut",
        time: 30000
    },
    {
        say: "If you eat too much...",
        time: 31050
    },
    {
        say: "You'll get VERY fat!!!",
        time: 33400
    },
    {
        say: "Now",
        time: 35000
    },
    {
        say: "The kokonut nut",
        time: 36050
    },
    {
        say: "Is a big big nut",
        time: 37400
    },
    {
        say: "But this delicious nut...",
        time: 39000
    },
    {
        say: "Is NOT a nut!!!",
        time: 41000
    },
    {
        say: "It's a koko fruit",
        time: 42900
    },
    {
        say: "(It's a koko fruit)",
        time: 44500
    },
    {
        say: "Of the koko tree",
        time: 46800
    },
    {
        say: "(Of the koko tree)",
        time: 48000
    },
    {
        say: "From the koko palm family",
        time: 50000
    },
    {
        say: "La la la la la",
        time: 52000
    },
    {
        say: "There are so many uses",
        time: 54000
    },
    {
        say: "Of the kokonut tree",
        time: 55200
    },
    {
        say: "You can build a bigger",
        time: 57450
    },
    {
        say: "House for the family",
        time: 58500
    },
    {
        say: "All you need is to",
        time: 61000
    },
    {
        say: "Find the kokonut man",
        time: 62500
    },
    {
        say: "If he cuts the tree...",
        time: 65000
    },
    {
        say: "I get the fruits free!!!",
        time: 66690
    },
    {
        say: "It's a koko fruit",
        time: 68100
    },
    {
        say: "(It's a koko fruit)",
        time: 70000
    },
    {
        say: "Of the koko tree",
        time: 71900
    },
    {
        say: "(Of the koko tree)",
        time: 73900
    },
    {
        say: "From the koko palm family",
        time: 75400
    },
    {
        say: "La la la la la",
        time: 78000
    },
    {
        say: "KO KO NUT",
        time: 80000
    },
    {
        say: "KO KO KO KO KO NUT",
        time: 81050
    },
    {
        say: "(kokonut)",
        time: 82900
    },
    {
        say: "KO KO NUT",
        time: 83950
    },
    {
        say: "KO KO KO KO KO NUT",
        time: 85000
    },
    {
        say: "The kokonut bark for the kitchen floor",
        time: 86300
    },
    {
        say: "If you save some of it...",
        time: 89700
    },
    {
        say: "You can build a door",
        time: 91900
    },
    {
        say: "Now",
        time: 92950
    },
    {
        say: "The kokonut trunk",
        time: 94000
    },
    {
        say: "Do not throw this junk",
        time: 95050
    },
    {
        say: "If you save some of it...",
        time: 97000
    },
    {
        say: "You'll have a second floor!!!",
        time: 98600
    },
    {
        say: "The kokonut wood",
        time: 101500
    },
    {
        say: "Is very good",
        time: 103000
    },
    {
        say: "It can stand 20 years...",
        time: 104600
    },
    {
        say: "If you pray it wood!!! :D",
        time: 106000
    },
    {
        say: "Now",
        time: 107500
    },
    {
        say: "The kokonut root",
        time: 108550
    },
    {
        say: "To tell you the truth",
        time: 109800
    },
    {
        say: "You can throw it...",
        time: 111800
    },
    {
        say: "Or use it as firewood!!!",
        time: 112850
    },
    {
        say: "The kokonut leaves",
        time: 115900
    },
    {
        say: "Good shade it gives",
        time: 117400
    },
    {
        say: "For the roof...",
        time: 119000
    },
    {
        say: "For the walls up against the theives!!!",
        time: 120050
    },
    {
        say: "Now",
        time: 121950
    },
    {
        say: "The kokonut fruit",
        time: 123000
    },
    {
        say: "Says my relatives",
        time: 124300
    },
    {
        say: "Makes good cannon balls...",
        time: 126400
    },
    {
        say: "Up against the thieves!!!",
        time: 128000
    },
    {
        say: "It's a kokofruit",
        time: 130000
    },
    {
        say: "(It's a koko fruit)",
        time: 131950
    },
    {
        say: "Of the koko tree",
        time: 133000
    },
    {
        say: "(Of the koko tree)",
        time: 135000
    },
    {
        say: "From the koko palm family",
        time: 137000
    },
    {
        say: "La la la la la",
        time: 140000
    },
    {
        say: "The kokonut nut",
        time: 141300
    },
    {
        say: "Is a giant nut",
        time: 143000
    },
    {
        say: "If you eat too much...",
        time: 144100
    },
    {
        say: "You'll get very fat!!!",
        time: 146000
    },
    {
        say: "Now",
        time: 147300
    },
    {
        say: "The kokonut nut",
        time: 148350
    },
    {
        say: "Is a big big nut",
        time: 149900
    },
    {
        say: "But this delicious nut...",
        time: 151200
    },
    {
        say: "Is not a nut!!!",
        time: 152900
    },
    {
        say: "The kokonut nut",
        time: 155000
    },
    {
        say: "Is a giant nut",
        time: 157000
    },
    {
        say: "If you eat too much...",
        time: 158850
    },
    {
        say: "You'll get very fat!!!",
        time: 160400
    },
    {
        say: "Now",
        time: 161450
    },
    {
        say: "The kokonut nut",
        time: 162500
    },
    {
        say: "Is a big big nut",
        time: 164000
    },
    {
        say: "But this delicious nut...",
        time: 165300
    },
    {
        say: "Is not a nut!!!",
        time: 167700
    },
    {
        say: "It's a koko fruit",
        time: 169000
    },
    {
        say: "(It's a koko fruit)",
        time: 170900
    },
    {
        say: "Of the koko tree",
        time: 171950
    },
    {
        say: "(Of the koko tree)",
        time: 174400
    },
    {
        say: "From the koko palm family",
        time: 176500
    },
    {
        say: "La la la la la",
        time: 179000
    },
    {
        say: "It's a koko fruit",
        time: 180000
    },
    {
        say: "(It's a koko fruit)",
        time: 181900
    },
    {
        say: "Of the koko tree",
        time: 182900
    },
    {
        say: "(Of the koko tree)",
        time: 185900
    },
    {
        say: "From the koko palm family",
        time: 187000
    },
    {
        say: "La la la la la la",
        time: 190000
    },
    {
        say: "It's a koko fruit",
        time: 191050
    },
    {
        say: "(It's a koko fruit",
        time: 192900
    },
    {
        say: "Of the koko tree",
        time: 194300
    },
    {
        say: "(Of the koko tree)",
        time: 196100
    },
    {
        say: "From the COCO palm familyyyyyyyyyyyyyy",
        time: 198000
    },
    {
        say: "(La la la la la la la la la la la la la la la la la la la la la)",
        time: 202700
    },
    {
        say: "Hooray",
        time: 209000
    }
    ]

let RapGod = [
    {
        say: "Look,",
        time: 1200
    },
    {
        say: "I was gonna go easy on you and not to hurt your feelings",
        time: 2400
    },
    {
        say: "But I'm only going to get this one chance",
        time: 5000
    },
    {
        say: "Something's wrong, I can feel it",
        time: 10000
    },
    {
        say: "Just a feeling I've got",
        time: 12000
    },
    {
        say: "Like something's about to happen,",
        time: 14700
    },
    {
        say: "But I don't know what",
        time: 16700
    },
    {
        say: "If that mean what I think it means,",
        time: 18000
    },
    {
        say: "We're in trouble, big trouble",
        time: 19500
    },
    {
        say: "And if he is as bananas as you say",
        time: 21000
    },
    {
        say: "I'm not taking any chances",
        time: 23400
    },
    {
        say: "You were just what the doctor ordered",
        time: 24700
    },
    {
        say: "I'm beginning to feel like a rap god, rap god",
        time: 26100
    },
    {
        say: "All my people from the front to the back nod, back nod",
        time: 29500
    },
    {
        say: "Now who thinks their arms are long enough to slap box, slap box?",
        time: 32600
    },
    {
        say: "They said I rap like a robot, so call me rapbot",
        time: 35900
    },
    {
        say: "But for me to rap like a computer must be in my genes",
        time: 38200
    },
    {
        say: "I got a laptop in my back pocket",
        time: 40700
    },
    {
        say: "My pen'll go off when I half-cock it",
        time: 42600
    },
    {
        say: "Got a fat knot from that rap profit",
        time: 44000
    },
    {
        say: "Made a living and a killing off it",
        time: 45600
    },
    {
        say: "Ever since bill Clinton was still in office",
        time: 46700
    },
    {
        say: "With Monica Lewinsky feeling on his nut-sack",
        time: 48200
    },
    {
        say: "I'm an MC still as honest",
        time: 50400
    },
    {
        say: "But as rude and indecent as all hell syllables",
        time: 51700
    },
    {
        say: "Skill-a-holic (Kill 'em all with)",
        time: 53800
    },
    {
        say: "This slickety, gibbedy, hibbedy hip hop",
        time: 55000
    },
    {
        say: "You don't really wanna get",
        time: 56050
    },
    {
        say: "Into a pissing match with this rappioy brat",
        time: 57100
    },
    {
        say: "Packing a mac in the back of the AC,",
        time: 59000
    },
    {
        say: "Backpack rap crap, yep, yackioy-yac",
        time: 60050
    },
    {
        say: "And at the exact same time I attempt these lyrical",
        time: 61800
    },
    {
        say: "Acrobat stunts while I'm practicing",
        time: 63300
    },
    {
        say: "That I'll still be able to break a motherfuckin' table",
        time: 65000
    },
    {
        say: "Over the back of a couple of faggots",
        time: 66100
    },
    {
        say: "And crack it in half",
        time: 67300
    },
    {
        say: "Only realised it was ironic",
        time: 68350
    },
    {
        say: "I was signed to aftermath after the fact",
        time: 69900
    },
    {
        say: "How could I not blow? All I do is drop F-bombs",
        time: 71800
    },
    {
        say: "Feel my wrath of attack",
        time: 73850
    },
    {
        say: "Rappers are having a rough time period",
        time: 74900
    },
    {
        say: "Here's a maxipad",
        time: 76250
    },
    {
        say: "It's actually disastrously bad",
        time: 77300
    },
    {
        say: "For the wack while",
        time: 78800
    },
    {
        say: "I'm masterfully constructing this masterpiece as",
        time: 79850
    },
    {
        say: "I'm beginning to feel like a rap god, rap god",
        time: 81700
    },
    {
        say: "All my people from the front to the back nod, back nod",
        time: 84600
    },
    {
        say: "Now who thinks their arms are long enough to slap box, slap box",
        time: 87900
    },
    {
        say: "Let me show you maintaining",
        time: 90800
    },
    {
        say: "This shit ain't that hard, that hard",
        time: 92000
    },
    {
        say: "Everybody want the key and",
        time: 94000
    },
    {
        say: "The secret to rap immortality like I have got",
        time: 95050
    },
    {
        say: "Well, to be truthful the blueprint's simply rage",
        time: 97400
    },
    {
        say: "And youthful exuberance",
        time: 98900
    },
    {
        say: "Everybody loves to root for a nuisance",
        time: 100000
    },
    {
        say: "Hit the earth like an asteroid, did nothing but",
        time: 101700
    },
    {
        say: "Shoot for the moon since (pew)",
        time: 103400
    },
    {
        say: "MC's get taken to school with this music",
        time: 104900
    },
    {
        say: "'Cause I use it as a vehicle to bus the rhyme",
        time: 106700
    },
    {
        say: "Now I lead a new school full of students",
        time: 108500
    },
    {
        say: "Me? I'm a product of rakim, kaim shabazz, 2 pac",
        time: 110000
    },
    {
        say: "NWA, cube, hey, doc, ren, yella, eazy",
        time: 112300
    },
    {
        say: "Thank you, they got slim",
        time: 114400
    },
    {
        say: "Inspired enough to one day grow up",
        time: 116600
    },
    {
        say: "Blow up and be in a position",
        time: 118000
    },
    {
        say: "To meet run DMC, induct them into the",
        time: 119400
    },
    {
        say: "Motherfuckin' rock n'",
        time: 121000
    },
    {
        say: "Roll hall of fame",
        time: 123000
    },
    {
        say: "Even though I walk in the church and",
        time: 124050
    },
    {
        say: "Burst in a ball of flames",
        time: 125100
    },
    {
        say: "Only hall of fame",
        time: 126150
    },
    {
        say: "I be inducted in is the alcohol of fame",
        time: 127200
    },
    {
        say: "On the wall of shame",
        time: 129000
    },
    {
        say: "You fags think it's all a game 'til",
        time: 130050
    },
    {
        say: "I walk a flock of flames, off of planking,",
        time: 132000
    },
    {
        say: "Tell me what in the fuck are you thinking?",
        time: 134800
    },
    {
        say: "Little gay looking boy",
        time: 123456
    },
    {
        say: "So gay I can barely say it",
        time: 123456
    },
    {
        say: "With a straight face looking boy",
        time: 123456
    },
    {
        say: "You witnessing a mass occur",
        time: 123456
    },
    {
        say: "Like you watching",
        time: 123456
    },
    {
        say: "A church gathering take place looking boy",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    {
        say: "sdjfskdljfl",
        time: 123456
    },
    ]

let timeout1 = []
let timeout2 = []
let timeout3 = []
let timeout4 = []
let timeout5 = []
let timeout6 = []
let timeout7 = []
let timeout8 = []
let timeout9 = []

function sendSongLyrics(song, audio, timeout) {
  let currentLine = 0;
  let accumulatedDelay = 0;

  function sendMessage() {
    if (currentLine < song.length) {
      const message = song[currentLine].say;
      const delay = song[currentLine].time - accumulatedDelay;

      timeout.push(setTimeout(() => {
        game.network.sendRpc({
          name: "SendChatMessage",
          message: message,
          channel: "Local"
        });

        accumulatedDelay += delay;
        currentLine++;
        sendMessage();
      }, delay));
    }
  }

  sendMessage();
}

function playAudio(audio) {
  audio.play();
}

function playSong(song, audio, timeouts) {
  pauseAndResetAllSongs();
  sendSongLyrics(song, audio, timeouts);
  playAudio(audio);
}

function pauseAndResetAllSongs() {
  song1.pause();
  song1.currentTime = 0;
  song2.pause();
  song2.currentTime = 0;
  song3.pause();
  song3.currentTime = 0;
  song4.pause();
  song4.currentTime = 0;
  song5.pause();
  song5.currentTime = 0;
  song6.pause();
  song6.currentTime = 0;
  song7.pause();
  song7.currentTime = 0;
  song8.pause();
  song8.currentTime = 0;
  song9.pause();
  song9.currentTime = 0;
  // Clear timeouts for lyrics
  timeout1.forEach(clearTimeout);
  timeout2.forEach(clearTimeout);
  timeout3.forEach(clearTimeout);
  timeout4.forEach(clearTimeout);
  timeout5.forEach(clearTimeout);
  timeout6.forEach(clearTimeout);
  timeout7.forEach(clearTimeout);
  timeout8.forEach(clearTimeout);
  timeout9.forEach(clearTimeout);
}


document.getElementById("sellall").addEventListener('click', function() {
  Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete all towers?", 8000, function() {
    for (let i of Object.values(game.ui.buildings)) {
      if (Object.values(i)[2] != "GoldStash") {
        sellUid.push(Object.values(i)[4])
      }
    }
    uniqueSellUid = [...new Set([...uniqueSellUid, ...sellUid])]
    sellUid = []
    let sellInterval = setInterval(() => {
      if (uniqueSellUid.length > 0 && game.ui.playerPartyCanSell) {
        game.network.sendRpc({
          name: "DeleteBuilding",
          uid: parseInt(uniqueSellUid[Math.floor(Math.random() * uniqueSellUid.length)])
        })
      } else {
        clearInterval(sellInterval)
      }
    }, 50);
  })
})

function hideGround() {
  if (document.getElementById("hideground").innerHTML == "Show Ground") {
    document.getElementById("hideground").innerHTML = "Hide Ground"
    game.renderer.ground.setVisible(true)
  } else {
    document.getElementById("hideground").innerHTML = "Show Ground"
    game.renderer.ground.setVisible(false)
  }
}

function hideNPCs() {
  if (document.getElementById("hidenpcs").innerHTML == "Show NPCs") {
    document.getElementById("hidenpcs").innerHTML = "Hide NPCs"
    game.renderer.npcs.setVisible(true)
  } else {
    document.getElementById("hidenpcs").innerHTML = "Show NPCs"
    game.renderer.npcs.setVisible(false)
  }
}

function hideEnviroment() {
  if (document.getElementById("hideenv").innerHTML == "Show Env") {
    document.getElementById("hideenv").innerHTML = "Hide Env"
    game.renderer.scenery.setVisible(true)
  } else {
    document.getElementById("hideenv").innerHTML = "Show Env"
    game.renderer.scenery.setVisible(false)
  }
}

function hideProjectiles() {
  if (document.getElementById("hideproj").innerHTML == "Show Proj") {
    document.getElementById("hideproj").innerHTML = "Hide Proj"
    game.renderer.projectiles.setVisible(true)
  } else {
    document.getElementById("hideproj").innerHTML = "Show Proj"
    game.renderer.projectiles.setVisible(false)
  }
}

function hideAll() {
  if (document.getElementById("hideall").innerHTML == "Show All") {
    document.getElementById("hideall").innerHTML = "Hide All"
    game.renderer.scene.setVisible(true)
  } else {
    document.getElementById("hideall").innerHTML = "Show All"
    game.renderer.scene.setVisible(false)
  }
}

function freezeGame() {
  if (document.getElementById("freezegame").innerHTML == "Start Game") {
    document.getElementById("freezegame").innerHTML = "Stop Game"
    game.start()
  } else {
    document.getElementById("freezegame").innerHTML = "Start Game"
    game.stop()
  }
}

function showGrid() {
  if (document.getElementById("biggrid").innerHTML == "Show Big Grids") {
    document.getElementById("biggrid").innerHTML = "Hide Big Grids"
    game.renderer.ground.attachments[0].attachments[1].setAlpha(0.625);
    game.renderer.ground.attachments[0].attachments[1].setScale(1200 / 48);
    game.renderer.ground.attachments[0].attachments[1].sprite.width /= 1200 / 48;
    game.renderer.ground.attachments[0].attachments[1].sprite.height /= 1200 / 48;
  } else {
    document.getElementById("biggrid").innerHTML = "Show Big Grids"
    game.renderer.ground.attachments[0].attachments[1].setAlpha(1);
    game.renderer.ground.attachments[0].attachments[1].setScale(1);
    game.renderer.ground.attachments[0].attachments[1].sprite.width *= 1200 / 48;
    game.renderer.ground.attachments[0].attachments[1].sprite.height *= 1200 / 48;
  }
}

function showGrids() {
  if (document.getElementById("smolgrid").innerHTML == "Show Small Grids") {
    document.getElementById("smolgrid").innerHTML = "Hide Small Grids"
    game.renderer.ground.attachments[0].attachments[1].setAlpha(0.625);
    game.renderer.ground.attachments[0].attachments[1].setScale(200 / 48);
    game.renderer.ground.attachments[0].attachments[1].sprite.width /= 200 / 48;
    game.renderer.ground.attachments[0].attachments[1].sprite.height /= 200 / 48;
  } else {
    document.getElementById("smolgrid").innerHTML = "Show Small Grids"
    game.renderer.ground.attachments[0].attachments[1].setAlpha(1);
    game.renderer.ground.attachments[0].attachments[1].setScale(1);
    game.renderer.ground.attachments[0].attachments[1].sprite.width *= 200 / 48;
    game.renderer.ground.attachments[0].attachments[1].sprite.height *= 200 / 48;
  }
}

let Auto = {}

function getGoldStash() {
  var entities = Game.currentGame.world.entities
  for (var uid in entities) {
    if (!entities.hasOwnProperty(uid)) continue
    var obj = entities[uid]
    if (obj.fromTick.model == "GoldStash") {
      return obj
    }
  }
}

function GetGoldStash() {
  for (let i in game.ui.buildings) {
    if (game.ui.buildings[i].type == "GoldStash") {
      return game.ui.buildings[i];
    };
  };
};

Auto.PlaceBuilding = function(x, y, building, yaw) {
  Game.currentGame.network.sendRpc({
    name: "MakeBuilding",
    x: x,
    y: y,
    type: building,
    yaw: yaw
  })
}

function buildcornerfarm() {
  var waitForGoldStash = setInterval(function() {
    if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
      var stash = getGoldStash();
      if (stash == undefined) return
      var stashPosition = {
        x: stash.fromTick.position.x,
        y: stash.fromTick.position.y
      }
      clearInterval(waitForGoldStash)
      Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
      Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, 'ArrowTower', 180);
      Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, 'ArrowTower', 180);
      Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, 'CannonTower', 180);
      Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, 'CannonTower', 180);
      Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 288, 'CannonTower', 180);
      Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 288, 'MagicTower', 180);
      Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 336, 'MagicTower', 180);
      Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 384, 'MagicTower', 180);
      Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, 'CannonTower', 180);
      Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 192, 'CannonTower', 180);
      Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'SlowTrap', 180);
      Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 120, 'SlowTrap', 180);
      Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 0, 'MagicTower', 180);
      Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, 'MagicTower', 180);
      Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 192, 'MagicTower', 180);
      Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 264, 'Door', 180);
      Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 264, 'Door', 180);
      Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 264, 'Door', 180);
      Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, 'Door', 180);
      Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 312, 'Door', 180);
      Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 180);
      Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 384, 'GoldMine', 180);
      Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 432, 'GoldMine', 180);
      Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 480, 'GoldMine', 180);
      Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 0, 'GoldMine', 180);
      Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 96, 'GoldMine', 180);
      Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 192, 'GoldMine', 180);
      Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 432, 'GoldMine', 180);
      Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 288, 'GoldMine', 180);
      Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 240, 'CannonTower', 180);
      Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'SlowTrap', 180);
      Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 168, 'SlowTrap', 180);
      Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 180);
      Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 96, 'ArrowTower', 180);
      clearInterval(waitForGoldStash)
    }
  }, 150)
}

game.network.addRpcHandler("LocalBuilding", (data) => {
  for (let e of data) {
    if (!!e.dead) {
      for (let i of uniqueSellUid) {
        if (e.uid == i) {
          uniqueSellUid.splice(uniqueSellUid.indexOf(i, 0), 1);
        }
      }
    }
  }
});

let sellUid = [];
let uniqueSellUid = [];

function toggleSellingWalls() {
  if (!isSellingWalls) {
    isSellingWalls = true;
    document.getElementById("sellwall").innerHTML = "Stop Selling Walls";
  } else {
    isSellingWalls = false;
    document.getElementById("sellwall").innerHTML = "Start Selling Walls";
  }
}

function toggleSellingDoors() {
  if (!isSellingDoors) {
    isSellingDoors = true;
    document.getElementById("selldoor").innerHTML = "Stop Selling Doors";
  } else {
    isSellingDoors = false;
    document.getElementById("selldoor").innerHTML = "Start Selling Doors";
  }
}

function toggleSellingTraps() {
  if (!isSellingTraps) {
    isSellingTraps = true;
    document.getElementById("selltrap").innerHTML = "Stop Selling Traps";
  } else {
    isSellingTraps = false;
    document.getElementById("selltrap").innerHTML = "Start Selling Traps";
  }
}

function toggleSellingHarvs() {
  if (!isSellingHarvs) {
    isSellingHarvs = true;
    document.getElementById("sellharvester").innerHTML = "Stop Selling Harvesters";
  } else {
    isSellingHarvs = false;
    document.getElementById("sellharvester").innerHTML = "Start Selling Harvesters";
  }
}

function toggleSellingArrows() {
  if (!isSellingArrows) {
    isSellingArrows = true;
    document.getElementById("sellarrow").innerHTML = "Stop Selling Arrows";
  } else {
    isSellingArrows = false;
    document.getElementById("sellarrow").innerHTML = "Start Selling Arrows";
  }
}

function toggleSellingCannons() {
  if (!isSellingCannons) {
    isSellingCannons = true;
    document.getElementById("sellcannon").innerHTML = "Stop Selling Cannon";
  } else {
    isSellingCannons = false;
    document.getElementById("sellcannon").innerHTML = "Start Selling Cannon";
  }
}

function toggleSellingMages() {
  if (!isSellingMages) {
    isSellingMages = true;
    document.getElementById("sellmagic").innerHTML = "Stop Selling Mages";
  } else {
    isSellingMages = false;
    document.getElementById("sellmagic").innerHTML = "Start Selling Mages";
  }
}

function toggleSellingMelees() {
  if (!isSellingMelees) {
    isSellingMelees = true;
    document.getElementById("sellmelee").innerHTML = "Stop Selling Melees";
  } else {
    isSellingMelees = false;
    document.getElementById("sellmelee").innerHTML = "Start Selling Melees";
  }
}

function toggleSellingBombs() {
  if (!isSellingBombs) {
    isSellingBombs = true;
    document.getElementById("sellbomb").innerHTML = "Stop Selling Bombs";
  } else {
    isSellingBombs = false;
    document.getElementById("sellbomb").innerHTML = "Start Selling Bombs";
  }
}

function toggleSellingMines() {
  if (!isSellingMines) {
    isSellingMines = true;
    document.getElementById("sellminer").innerHTML = "Stop Selling Gold Mines";
  } else {
    isSellingMines = false;
    document.getElementById("sellminer").innerHTML = "Start Selling Gold Mines";
  }
}

let shouldAutoRespawn = true
game.network.addRpcHandler("Dead", () => {
  if (shouldAutoRespawn) {
    game.network.sendPacket(3, {
      respawn: 1
    })
    document.getElementById('hud-respawn').style.display = "none"
  }
})

function giveSell() {
  if (!autogivesell) {
    autogivesell = true;
    document.getElementById("autosell").innerHTML = "Auto Give Sell On";
  } else {
    autogivesell = false;
    document.getElementById("autosell").innerHTML = "Auto Give Sell Off";
  }
}

let autogivesell = false;

function hideChat() {
  if (document.getElementsByClassName("hud-top-left")[0].style.display === "none" && document.getElementById("hidechat").innerHTML == "Show Chat") {
    document.getElementsByClassName("hud-top-left")[0].style.display = "block";
    document.getElementById("hidechat").innerHTML = "Hide Chat";
  } else {
    document.getElementsByClassName("hud-top-left")[0].style.display = "none";
    document.getElementById("hidechat").innerHTML = "Show Chat";
  }
}

function hidePopupOverlay() {
  if (document.getElementById("hud-popup-overlay").style.display === "none" && document.getElementById("hidepop").innerHTML == "Show Popup") {
    document.getElementById("hud-popup-overlay").style.display = "block";
    document.getElementById("hidepop").innerHTML = "Hide Popup";
  } else {
    document.getElementById("hud-popup-overlay").style.display = "none";
    document.getElementById("hidepop").innerHTML = "Show Popup";
  }
}

function hideLeaderboard() {
  if (document.getElementById("hud-leaderboard").style.display === "none" && document.getElementById("hideldb").innerHTML == "Show Leaderboard") {
    document.getElementById("hud-leaderboard").style.display = "block";
    document.getElementById("hideldb").innerHTML = "Hide Leaderboard";
  } else {
    document.getElementById("hud-leaderboard").style.display = "none";
    document.getElementById("hideldb").innerHTML = "Show Leaderboard";
  }
}

function hideMap() {
  if (document.getElementsByClassName("hud-bottom-left")[0].style.display === "none" && document.getElementById("hidemap").innerHTML == "Show Map") {
    document.getElementsByClassName("hud-bottom-left")[0].style.display = "block";
    document.getElementById("hidemap").innerHTML = "Hide Map";
  } else {
    document.getElementsByClassName("hud-bottom-left")[0].style.display = "none";
    document.getElementById("hidemap").innerHTML = "Show Map";
  }
}

function hidePIP() {
  if (document.getElementsByClassName("hud-pip-overlay")[0].style.display === "block" || document.getElementsByClassName("hud-pip-overlay")[0].style.display === "") {
    document.getElementsByClassName("hud-pip-overlay")[0].style.display = "none";
    document.getElementById("hidepip").innerHTML = "Show PIP";
  } else {
    document.getElementsByClassName("hud-pip-overlay")[0].style.display = "block";
    document.getElementById("hidepip").innerHTML = "Hide PIP";
  }
}

function toggleday() {
  let hno = document.getElementsByClassName("hud-day-night-overlay")[0];
  if (hno.style.display === "block" || hno.style.display === "") {
    document.getElementById("daybright").innerHTML = "Disable Always Day";
    hno.style.display = "none";
  } else {
    document.getElementById("daybright").innerHTML = "Enable Always Day";
    hno.style.display = "block";
  };
}

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

const borders = [new PIXI.Graphics(), new PIXI.Graphics(), new PIXI.Graphics(), new PIXI.Graphics(), new PIXI.Graphics()];
const colors = [0xFFFFFF, 0xFF0000, 0xFFFF00, 0x00FF00, 0x0000FF];
const sizes = [48, 864, 1680, 2544, 5040];

// Calculate the circle's radius to touch the corners of the rectangle
const circleRadius = Math.sqrt(Math.pow(864, 2) + Math.pow(864, 2)) + 48 + 24;

// Create a circle with the calculated radius
const circle = new PIXI.Graphics();
circle.lineStyle(3, 0xFF00FF); // You can set the color as desired
circle.drawCircle(0, 0, circleRadius);
circle.visible = false; // Initially set the circle to be invisible

// Create two rectangles for the plus sign with a thickness of 3
const plusRectangles = [new PIXI.Graphics(), new PIXI.Graphics()];
const plusSize = 6969; // Size of the plus sign rectangles

// Set the line style for the plus rectangles
plusRectangles[0].lineStyle(3, 0x00FF00); // Set the color and thickness for the lines
plusRectangles[0].moveTo(-plusSize / 2, -3); // Adjust the position to center the line
plusRectangles[0].lineTo(plusSize / 2, -3); // Adjust the position to center the line
plusRectangles[0].moveTo(0, -plusSize / 2); // Adjust the position to center the line
plusRectangles[0].lineTo(0, plusSize / 2); // Adjust the position to center the line
plusRectangles[0].visible = false; // Initially set the plus sign rectangles to be invisible

plusRectangles[1].lineStyle(3, 0x00FF00); // Set the color and thickness for the lines
plusRectangles[1].moveTo(-3, -sizes[1] / 2); // Adjust the position to center the line
plusRectangles[1].lineTo(3, -sizes[1] / 2); // Adjust the position to center the line
plusRectangles[1].moveTo(-3, sizes[1] / 2); // Adjust the position to center the line
plusRectangles[1].lineTo(3, sizes[1] / 2); // Adjust the position to center the line
plusRectangles[1].visible = false; // Initially set the plus sign rectangles to be invisible

borders.forEach((item, i) => {
  item.lineStyle(3, colors[i]);
  item.drawRect(-sizes[i], -sizes[i], 2 * sizes[i], 2 * sizes[i]);
  item.visible = false; // Initially set rectangles to be invisible
});

const rangeIndicators = {};
const tracers = {};

let angles = [335, 200, 320, 225];
let xys = [];
angles.forEach((item, i) => {
  angles[i] = item * Math.PI / 180;
});
xys[0] = Math.cos(angles[0]) * 100;
xys[1] = Math.sin(angles[0]) * 100;
xys[2] = Math.cos(angles[2]) * 100;
xys[3] = Math.sin(angles[2]) * 100;

const playerIsInRange = (p1, p2) => {
  const deltaX = ~~(p2.x / 200) - ~~(p1.x / 200);
  const deltaY = ~~(p2.y / 200) - (~~((p1.y + 100) / 200) - 0.5);
  return -6 <= deltaX && -4.5 <= deltaY && deltaX <= 6 && deltaY <= 4.5;
};

game.network.sendPacket2 = game.network.sendPacket;
game.network.sendPacket = (opcode, input) => {
  if (opcode == 3) {
    if (input.mouseMoved || input.mouseMovedWhileDown) {
      rangeIndicators[game.world.myUid].rotation = (input.mouseMoved || input.mouseMovedWhileDown) * Math.PI / 180;
    }
  }
  game.network.sendPacket2(opcode, input);
}

const update = () => {
  const myPlayerEntity = game.world.entities[game.world.myUid];
  if (myPlayerEntity) {
    for (const i in tracers) {
      if (!game.world.entities[i]) {
        tracers[i].destroy();
        delete tracers[i];
      }
    }
    for (const i in rangeIndicators) {
      if (!game.world.entities[i]) {
        rangeIndicators[i].destroy();
        delete rangeIndicators[i];
      }
    }
    game.world.renderer.npcs.attachments.forEach(entity => {
      if (entity.entityClass == "PlayerEntity") {
        if (!rangeIndicators[entity.uid]) {
          rangeIndicators[entity.uid] = new PIXI.Graphics();
          game.world.renderer.entities.node.addChild(rangeIndicators[entity.uid]);
        }
        if (!tracers[entity.uid]) {
          tracers[entity.uid] = new PIXI.Graphics();
          game.world.renderer.entities.node.addChild(tracers[entity.uid]);
        }
        rangeIndicators[entity.uid].clear();
        tracers[entity.uid].clear();
        const p = entity.node.position;
        rangeIndicators[entity.uid].position = p;
        if (entity.uid != game.world.myUid) rangeIndicators[entity.uid].rotation = entity.targetTick.aimingYaw * Math.PI / 180;

        const color = (entity.uid == game.world.myUid) ? 0xFFD700 : (entity.targetTick.partyId == game.ui.playerPartyId) ? 0x0000FF : 0xFFFFFF;

        if (renderTracer && entity.targetTick.dead == 0) {
          if (entity.targetTick.partyId == game.ui.playerPartyId || playerIsInRange(myPlayerEntity.targetTick.position, entity.targetTick.position)) {
            const p1 = myPlayerEntity.node.position;
            const p2 = entity.node.position;
            tracers[entity.uid].lineStyle(3, (entity.targetTick.partyId == game.ui.playerPartyId) ? 0x0000FF : 0xFFFFFF);
            tracers[entity.uid].moveTo(p1.x, p1.y);
            tracers[entity.uid].lineTo(p2.x, p2.y);
          }
        }

        if (renderRange && entity.targetTick.dead == 0) {
          if (entity.targetTick.partyId == game.ui.playerPartyId || playerIsInRange(myPlayerEntity.targetTick.position, entity.targetTick.position)) {
            switch (entity.targetTick.weaponName) {
              case 'Pickaxe':
                rangeIndicators[entity.uid].beginFill(color, 0.3);
                rangeIndicators[entity.uid].moveTo(0, 0).lineTo(xys[0], xys[1]);
                rangeIndicators[entity.uid].arc(0, 0, 100, angles[0], angles[1], true);
                rangeIndicators[entity.uid].endFill();
                break;
              case 'Spear':
                rangeIndicators[entity.uid].beginFill(color, 0.3);
                rangeIndicators[entity.uid].moveTo(0, 0).lineTo(xys[2], xys[3]);
                rangeIndicators[entity.uid].arc(0, 0, 100, angles[2], angles[3], true);
                rangeIndicators[entity.uid].endFill();
                break;
              case 'Bow':
                rangeIndicators[entity.uid].lineStyle(7, color, 0.3); // Set initial alpha value
                rangeIndicators[entity.uid].moveTo(0, 0);
                rangeIndicators[entity.uid].lineTo(0, -550);
                rangeIndicators[entity.uid].lineStyle(); // Reset lineStyle
                rangeIndicators[entity.uid].beginFill(color, 0.3); // Set initial alpha value
                break;
              case 'Bomb':
                rangeIndicators[entity.uid].lineStyle(7, color, 0.3); // Set initial alpha value
                rangeIndicators[entity.uid].moveTo(0, 0);
                rangeIndicators[entity.uid].lineTo(0, -280);
                rangeIndicators[entity.uid].lineStyle(); // Reset lineStyle
                rangeIndicators[entity.uid].beginFill(color, 0.3); // Set initial alpha value
                break;
            }
          }
        }
      }
    });
  }
}
game.renderer.addTickCallback(update);

function showborder() {
  if (!renderborder) {
    renderborder = true;
    document.getElementById("border").innerHTML = "Hide Border";
  } else {
    renderborder = false;
    document.getElementById("border").innerHTML = "Show Border";
  }
}

function showRange() {
  if (!renderRange) {
    renderRange = true
    document.getElementById("range").innerHTML = "Hide Range"
  } else {
    renderRange = false
    document.getElementById("range").innerHTML = "Show Range"
  }
}

function showTracer() {
  if (!renderTracer) {
    renderTracer = true
    document.getElementById("tracer").innerHTML = "Hide Tracer"
  } else {
    renderTracer = false
    document.getElementById("tracer").innerHTML = "Show Tracer"
  }
}

function lagSpambtn() {
  if (document.getElementById("lagspam-btn").innerHTML == "Lag Spam On") {
    document.getElementById("lagspam-btn").innerHTML = "Lag Spam Off";
  } else {
    document.getElementById("lagspam-btn").innerHTML = "Lag Spam On";
  }
}
let availableCharacters = ""
let textLength = 70;
fetch('https://raw.githubusercontent.com/bits/UTF-8-Unicode-Test-Documents/master/UTF-8_sequence_unseparated/utf8_sequence_0-0xffff_assigned_printable_unseparated.txt')
  .then(response => response.text())
  .then(data => {
    availableCharacters = data;
  });

var chatSpam = null;

function lagSpam() {
  clearInterval(chatSpam);
  if (chatSpam !== null) {
    chatSpam = null;
  } else {
    chatSpam = setInterval(function() {
      let text = ""
      for (let i = 0; i < textLength; i++) text += availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
      game.network.sendRpc({
        name: "SendChatMessage",
        channel: "Local",
        message: text
      });
    }, 1050);
  };
};

function togglerev4() {
  if (!shouldrev4) {
    shouldrev4 = true
    document.getElementById("rev4").innerHTML = "Disable Rev Player Trick"
  } else {
    shouldrev4 = false
    document.getElementById("rev4").innerHTML = "Enable Rev Player Trick"
  }
}

let shouldrev4 = false;

let hasLeftParty = false; // Flag to track if we have already left the party.
let hasJoinedParty = false; // Flag to track if we have already joined the party.

game.network.addRpcHandler("DayCycle", (e) => {
    let shareKey = {}
  if (e.isDay && shouldrev4 && !hasLeftParty) {
    // Daytime: Wait 50 seconds, then leave the party once.
    setTimeout(() => {
        shareKey = game.ui.playerPartyShareKey
    }, 50000);
    setTimeout(() => {
        Game.currentGame.network.sendRpc({
        name: "LeaveParty"
      });
      hasLeftParty = true;
    }, 55000)
  }
  if (!e.isDay && shouldrev4 && !hasJoinedParty) {
    // Nighttime: Wait 10 seconds, then join the party once.
    setTimeout(() => {
      if (shareKey) {
        Game.currentGame.network.sendRpc({
          name: "JoinPartyByShareKey",
          partyShareKey: shareKey
        });
        hasJoinedParty = true; // Set the flag to true to indicate that we've joined the party.
      }
    }, 10000);
  }

  // Reset the flags at the beginning of each day/night cycle.
  if (!e.isDay) {
    hasLeftParty = false;
  } else {
    hasJoinedParty = false;
  }
    if (!aitoEnabled) return;

    // Check if there are already 4 players in the party
    if (game.ui.playerPartyMembers.length >= 4) {
        return;
    }

    if (!e.isDay) {
        // It's night
        if (canPerformNightActions) {
            // Find the first WebSocket that has not joined in the last 4 minutes
            const selectedWebSocketId = findNextWebSocketId();

            if (selectedWebSocketId) {
                selectedWebSocket = webSockets[selectedWebSocketId];

                // Join the party and mark the WebSocket as joined
                selectedWebSocket.network.sendRpc({
                    name: "JoinPartyByShareKey",
                    partyShareKey: shareKey
                });

                selectedWebSocket.hasJoinedParty = true;

                // Set up a periodic check for the WebSocket's gold
                goldCheckInterval = setInterval(() => {

                    if (selectedWebSocket.playerTick.gold >= 10000) {
                        // Buy Pause
                        selectedWebSocket.network.sendRpc({
                            name: "BuyItem",
                            itemName: "Pause",
                            tier: 1
                        });

                        // Leave the party
                        selectedWebSocket.network.sendPacket(9, { name: "LeaveParty" });

                        // Clear the gold check interval
                        clearInterval(goldCheckInterval);

                        // Set the flag to prevent further night actions until the day is over
                        canPerformNightActions = false;

                        // Set a timeout to reset the flag after 30 seconds
                        setTimeout(() => {
                            canPerformNightActions = true;
                        }, 30000);
                    }
                }, 2000);
            }
        }
    } else {
        // It's daytime, clear the gold-checking interval and leave the party after 55 seconds
        setTimeout(() => {
            clearInterval(goldCheckInterval);
            if (selectedWebSocket) {
                selectedWebSocket.network.sendPacket(9, { name: "LeaveParty" });
            }
        }, 55000);
    }
});

function spamAllParty() {
  if (document.getElementById("spamallparty-btn").innerHTML == "Spam All Party On") {
    document.getElementById("spamallparty-btn").innerHTML = "Spam All Party Off";
    shouldSpamAllParty = false
  } else {
    document.getElementById("spamallparty-btn").innerHTML = "Spam All Party On";
    shouldSpamAllParty = true
  }
}

function autoAcceptPartybtn() {
  if (document.getElementById("autoaccept-btn").innerHTML == "Accepter On") {
    document.getElementById("autoaccept-btn").innerHTML = "Accepter Off";
  } else {
    document.getElementById("autoaccept-btn").innerHTML = "Accepter On";
  }
}

var acceptparty = null;

function autoAcceptParty() {
  clearInterval(acceptparty);
  if (acceptparty !== null) {
    acceptparty = null;
  } else {
    acceptparty = setInterval(function() {
      var confirm = document.getElementsByClassName("btn btn-green hud-confirmation-accept");
      for (var j = 0; j < confirm.length; j++) {
        confirm[j].click();
      }
    }, 100);
  }
}

function autoUpgradeAllbtn() {
  if (document.getElementById("autoupgradeall-btn").innerHTML == "Upgrade On") {
    document.getElementById("autoupgradeall-btn").innerHTML = "Upgrade Off";
  } else {
    document.getElementById("autoupgradeall-btn").innerHTML = "Upgrade On";
  }
}

function autouparrowbtn() {
  if (document.getElementById("uparrow").innerHTML == "Up Arrows On") {
    document.getElementById("uparrow").innerHTML = "Up Arrows Off";
  } else {
    document.getElementById("uparrow").innerHTML = "Up Arrows On";
  }
}

function autoupstashbtn() {
  if (document.getElementById("upstash").innerHTML == "Up Stash On") {
    document.getElementById("upstash").innerHTML = "Up Stash Off";
  } else {
    document.getElementById("upstash").innerHTML = "Up Stash On";
  }
}

function autoupmagebtn() {
  if (document.getElementById("upmage").innerHTML == "Up Mages On") {
    document.getElementById("upmage").innerHTML = "Up Mages Off";
  } else {
    document.getElementById("upmage").innerHTML = "Up Mages On";
  }
}

function autoupminesbtn() {
  if (document.getElementById("upmines").innerHTML == "Up Mines On") {
    document.getElementById("upmines").innerHTML = "Up Mines Off";
  } else {
    document.getElementById("upmines").innerHTML = "Up Mines On";
  }
}

function autoupwallbtn() {
  if (document.getElementById("upwall").innerHTML == "Up Walls On") {
    document.getElementById("upwall").innerHTML = "Up Walls Off";
  } else {
    document.getElementById("upwall").innerHTML = "Up Walls On";
  }
}

function autoupdoorbtn() {
  if (document.getElementById("updoor").innerHTML == "Up Doors On") {
    document.getElementById("updoor").innerHTML = "Up Doors Off";
  } else {
    document.getElementById("updoor").innerHTML = "Up Doors On";
  }
}

function autouptrapbtn() {
  if (document.getElementById("uptrap").innerHTML == "Up Slow Traps On") {
    document.getElementById("uptrap").innerHTML = "Up Slow Traps Off";
  } else {
    document.getElementById("uptrap").innerHTML = "Up Slow Traps On";
  }
}

function autoupmeleebtn() {
  if (document.getElementById("upmelee").innerHTML == "Up Melees On") {
    document.getElementById("upmelee").innerHTML = "Up Melees Off";
  } else {
    document.getElementById("upmelee").innerHTML = "Up Melees On";
  }
}

function autoupbombbtn() {
  if (document.getElementById("upbomb").innerHTML == "Up Bombs On") {
    document.getElementById("upbomb").innerHTML = "Up Bombs Off";
  } else {
    document.getElementById("upbomb").innerHTML = "Up Bombs On";
  }
}

function autoupharvesterbtn() {
  if (document.getElementById("upharvester").innerHTML == "Up Harvesters On") {
    document.getElementById("upharvester").innerHTML = "Up Harvesters Off";
  } else {
    document.getElementById("upharvester").innerHTML = "Up Harvesters On";
  }
}

function autoupcannonbtn() {
  if (document.getElementById("upcannon").innerHTML == "Up Cannons On") {
    document.getElementById("upcannon").innerHTML = "Up Cannons Off";
  } else {
    document.getElementById("upcannon").innerHTML = "Up Cannons On";
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
    }, 750)
  }
}

var autoUpgradeArrowTowers = null;

function autouparrow() {
  clearInterval(autoUpgradeArrowTowers);
  if (autoUpgradeArrowTowers !== null) {
    autoUpgradeArrowTowers = null;
  } else {
    autoUpgradeArrowTowers = setInterval(function() {
      for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "ArrowTower") {
          Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: game.ui.buildings[uid].uid
          });
        }
      }
    }, 750);
  }
}

var autoUpgradeStash = null;

function autoupstash() {
  clearInterval(autoUpgradeStash);
  if (autoUpgradeStash !== null) {
    autoUpgradeStash = null;
  } else {
    autoUpgradeStash = setInterval(function() {
      for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "GoldStash") {
          Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: game.ui.buildings[uid].uid
          });
        }
      }
    }, 750);
  }
}
var autoUpgradeMage = null;

function autoupmage() {
  clearInterval(autoUpgradeMage);
  if (autoUpgradeMage !== null) {
    autoUpgradeMage = null;
  } else {
    autoUpgradeMage = setInterval(function() {
      for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "MagicTower") {
          Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: game.ui.buildings[uid].uid
          });
        }
      }
    }, 700);
  }
}

var autoUpgradeMines = null;

function autoupmines() {
  clearInterval(autoUpgradeMines);
  if (autoUpgradeMines !== null) {
    autoUpgradeMines = null;
  } else {
    autoUpgradeMines = setInterval(function() {
      for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "GoldMine") {
          Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: game.ui.buildings[uid].uid
          });
        }
      }
    }, 600);
  }
}

var autoUpgradeWalls = null;

function autoupwall() {
  clearInterval(autoUpgradeWalls);
  if (autoUpgradeWalls !== null) {
    autoUpgradeWalls = null;
  } else {
    autoUpgradeWalls = setInterval(function() {
      for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "Wall") {
          Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: game.ui.buildings[uid].uid
          });
        }
      }
    }, 750);
  }
}

var autoUpgradeDoors = null;

function autoupdoor() {
  clearInterval(autoUpgradeDoors);
  if (autoUpgradeDoors !== null) {
    autoUpgradeDoors = null;
  } else {
    autoUpgradeDoors = setInterval(function() {
      for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "Door") {
          Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: game.ui.buildings[uid].uid
          });
        }
      }
    }, 750);
  }
}

var autoUpgradeTraps = null;

function autouptrap() {
  clearInterval(autoUpgradeTraps);
  if (autoUpgradeTraps !== null) {
    autoUpgradeTraps = null;
  } else {
    autoUpgradeTraps = setInterval(function() {
      for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "SlowTrap") {
          Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: game.ui.buildings[uid].uid
          });
        }
      }
    }, 750);
  }
}

var autoUpgradeCannon = null;

function autoupcannon() {
  clearInterval(autoUpgradeCannon);
  if (autoUpgradeCannon !== null) {
    autoUpgradeCannon = null;
  } else {
    autoUpgradeCannon = setInterval(function() {
      for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "CannonTower") {
          Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: game.ui.buildings[uid].uid
          });
        }
      }
    }, 750);
  }
}

var autoUpgradeMelee = null;

function autoupmelee() {
  clearInterval(autoUpgradeMelee);
  if (autoUpgradeMelee !== null) {
    autoUpgradeMelee = null;
  } else {
    autoUpgradeMelee = setInterval(function() {
      for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "MeleeTower") {
          Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: game.ui.buildings[uid].uid
          });
        }
      }
    }, 750);
  }
}

var autoUpgradeBomb = null;

function autoupbomb() {
  clearInterval(autoUpgradeBomb);
  if (autoUpgradeBomb !== null) {
    autoUpgradeBomb = null;
  } else {
    autoUpgradeBomb = setInterval(function() {
      for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "BombTower") {
          Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: game.ui.buildings[uid].uid
          });
        }
      }
    }, 750);
  }
}

var autoUpgradeHarvester = null;

function autoupharvester() {
  clearInterval(autoUpgradeHarvester);
  if (autoUpgradeHarvester !== null) {
    autoUpgradeHarvester = null;
  } else {
    autoUpgradeHarvester = setInterval(function() {
      for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "Harvester") {
          Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: game.ui.buildings[uid].uid
          });
        }
      }
    }, 750);
  }
}

function spamPartyByID() {
  if (document.getElementById("spampartybyid-btn").innerHTML == "Spam Party By ID On") {
    shouldSpamIdParty = false
    document.getElementById("spampartybyid-btn").innerHTML = "Spam Party By ID Off";
  } else {
    shouldSpamIdParty = true
    document.getElementById("spampartybyid-btn").innerHTML = "Spam Party By ID On";
  }
}

function clearChatbtn() {
  if (document.getElementById("clearchat-btn").innerHTML == "Clear Chat On") {
    document.getElementById("clearchat-btn").innerHTML = "Clear Chat Off";
    shouldClearChat = false
  } else {
    document.getElementById("clearchat-btn").innerHTML = "Clear Chat On";
    shouldClearChat = true
  }
}

function spinnerbtn() {
  if (document.getElementById("togglespinner").innerHTML == "Spinner On") {
    document.getElementById("togglespinner").innerHTML = "Spinner Off";
    shouldSpin = false
    yaw = game.ui.playerTick.aimingYaw
  } else {
    document.getElementById("togglespinner").innerHTML = "Spinner On";
    shouldSpin = true
    yaw = game.ui.playerTick.aimingYaw
  }
}

function toggleRebuild() {
  window.rebuilderOn = !window.rebuilderOn;

  window.toggleRebuilder()

  document.getElementById("togglerb").innerText = window.rebuilderOn ? "Rebuild On" : "Rebuild Off";

  window.rebuilderOn ? (() => {
    game.ui.components.PopupOverlay.showHint2 = game.ui.components.PopupOverlay.showHint;

    game.ui.components.PopupOverlay.showHint = (popup, ms) => {
      if ((popup == "You can't place buildings that far away from your position.") || (popup == "You can't place buildings in occupied cells.")) return;

      game.ui.components.PopupOverlay.showHint2(popup, ms);
    };
  })() : (() => {
    if (game.ui.components.PopupOverlay.showHint2) {
      game.ui.components.PopupOverlay.showHint = game.ui.components.PopupOverlay.showHint2;
    };
  })();
};

function toggleHealthUp() {
  if (!shouldhealthup) {
    shouldhealthup = true
    document.getElementById("togglehealthup").innerHTML = "Low Health Upgrade On"
  } else {
    shouldhealthup = false
    document.getElementById("togglehealthup").innerHTML = "Low Health Upgrade Off"
  }
}

function toggleHealSpell() {
  if (!shouldhealtowers) {
    shouldhealtowers = true
    document.getElementById("towerheal").innerHTML = "Heal Towers On"
  } else {
    shouldhealtowers = false
    document.getElementById("towerheal").innerHTML = "Heal Towers Off"
  }
}

function autoleave() {
  if (!stash10leave) {
    stash10leave = true
    document.getElementById("stashleave").innerHTML = "Auto Leave On"
    game.ui.getComponent("PopupOverlay").showHint('Auto Leave Party When Stash Health Falls Below 10% Enabled', 3000)
  } else {
    stash10leave = false
    document.getElementById("stashleave").innerHTML = "Auto Leave Off"
  }
}

function togglefriend() {
  if (!friendcontrol) {
    friendcontrol = true
    document.getElementById("allowfriend").innerHTML = "Disallow Friend Control"
  } else {
    friendcontrol = false
    document.getElementById("allowfriend").innerHTML = "Allow Friend Control"
  }
}

function abpk() {
  if (!shouldabpk) {
    shouldabpk = true;
    document.getElementById("toggleabpk").innerHTML = "Disable Auto Buy Pickaxe";
  } else {
    shouldabpk = false;
    document.getElementById("toggleabpk").innerHTML = "Enable Auto Buy Pickaxe";
  }
}

function absp() {
  if (!shouldabsp) {
    shouldabsp = true;
    document.getElementById("toggleabsp").innerHTML = "Disable Auto Buy Spear";
  } else {
    shouldabsp = false;
    document.getElementById("toggleabsp").innerHTML = "Enable Auto Buy Spear";
  }
}

function abbw() {
  if (!shouldabbw) {
    shouldabbw = true;
    document.getElementById("toggleabbw").innerHTML = "Disable Auto Buy Bow";
  } else {
    shouldabbw = false;
    document.getElementById("toggleabbw").innerHTML = "Enable Auto Buy Bow";
  }
}

function abbm() {
  if (!shouldabbm) {
    shouldabbm = true;
    document.getElementById("toggleabbm").innerHTML = "Disable Auto Buy Bomb";
  } else {
    shouldabbm = false;
    document.getElementById("toggleabbm").innerHTML = "Enable Auto Buy Bomb";
  }
}

function absh() {
  if (!shouldabsh) {
    shouldabsh = true;
    document.getElementById("toggleabsh").innerHTML = "Disable Auto Buy Sheild";
  } else {
    shouldabsh = false;
    document.getElementById("toggleabsh").innerHTML = "Enable Auto Buy Sheild";
  }
}

let shouldabpk = false
let shouldabsp = false
let shouldabbw = false
let shouldabbm = false
let shouldabsh = false

function toggleSwing() {
  if (!autoSwing) {
    autoSwing = true;
    document.getElementById("toggleswing").innerHTML = "Swing On";
  } else {
    autoSwing = false;
    document.getElementById("toggleswing").innerHTML = "Swing Off";
  }
}

function FIGHT() {
  if (!fighting) {
    fighting = true
    document.getElementById("battle").innerHTML = "Disable Fighting Mode";
  } else {
    fighting = false
    document.getElementById("battle").innerHTML = "Enable Fighting Mode";
    bowAttacked = true;
    bombAttacked = true;
    spearAttacked = true;
  }
}

function trapon() {
  if (!trappingEnabled) {
    trappingEnabled = true
    document.getElementById("trap").innerHTML = "Disable Auto Trapper";
  } else {
    trappingEnabled = false
    document.getElementById("trap").innerHTML = "Enable Auto Trapper";
  }
}

function afkswitches() {
  if (!switching) {
    switching = true
    document.getElementById("switch").innerHTML = "Disable Afk Switch";
  } else {
    switching = false
    document.getElementById("switch").innerHTML = "Enable Afk Switch";
  }
}

function togglemove() {
  if (!moving) {
    moving = true
    document.getElementById("move").innerHTML = "Disable Player Follower";
  } else {
    moving = false
    document.getElementById("move").innerHTML = "Enable Player Follower";
    clearInterval(goToPosInterval);
    clearTimeout(moveTimeout);
    game.network.sendInput({
      left: 0,
      right: 0,
      up: 0,
      down: 0
    });
  }
}

function togglebowfollow() {
    if (!shouldBowFollow) {
        shouldBowFollow = true
        document.getElementById("bowfollow").innerHTML = "Disable Bow Follow"
    } else {
        shouldBowFollow = false
        document.getElementById("bowfollow").innerHTML = "Enable Bow Follow"
        clearInterval(maintainDistanceInterval)
        game.network.sendInput({
      left: 0,
      right: 0,
      up: 0,
      down: 0
    });
    }
}

function toggleCombatZoom() {
    if(!shouldCombatZoom) {
       shouldCombatZoom = true
       document.getElementById("zoom").innerHTML = "Disable Combat Zoom"
    } else {
        shouldCombatZoom = false
        document.getElementById("zoom").innerHTML = "Enable Combat Zoom"
    }
}

// Variable to keep track of whether you are in fighting mode
let fighting = false;

// Variable to store the last time each weapon was equipped
const lastEquipTimes = {
  Bow: 0,
  Bomb: 0,
  Spear: 0
};

// Variables to control the cooldown after equipping each weapon
const cooldowns = {
  Bow: 500,
  Bomb: 500,
  Spear: 250
};

// Variables to control whether each weapon is available for equipping
let bowAttacked = true;
let bombAttacked = true;
let spearAttacked = true;

// Wrapper function for shopShortcut to include wait times
function enhancedShopShortcut(item, tier) {
  const currentTime = Date.now();

  // Check the item and apply the appropriate wait time when in fighting mode
  switch (item) {
    case "Bow":
      if (fighting) {
          if (bombAttacked || spearAttacked) {
        bombAttacked = false;
        spearAttacked = false;

        // Set a timeout to turn bowAttacked to true after the cooldown period
        setTimeout(() => {
          bowAttacked = true;
        }, cooldowns.Bow);

        shopShortcut(item, tier);
        lastEquipTimes.Bow = currentTime;
          }
      }
      break;
    case "Bomb":
      if (fighting) {
          if (bowAttacked || spearAttacked) {
        bowAttacked = false;
        spearAttacked = false;

        // Set a timeout to turn bombAttacked to true after the cooldown period
        setTimeout(() => {
          bombAttacked = true;
        }, cooldowns.Bomb);

        shopShortcut(item, tier);
        lastEquipTimes.Bomb = currentTime;
          }
      }
      break;
    case "Spear":
      if (fighting) {
          if (bowAttacked || bombAttacked) {
        bowAttacked = false;
        bombAttacked = false;

        // Set a timeout to turn spearAttacked to true after the cooldown period
        setTimeout(() => {
          spearAttacked = true;
        }, cooldowns.Spear);

        shopShortcut(item, tier);
        lastEquipTimes.Spear = currentTime;
          }
      }
      break;
    default:
      shopShortcut(item, tier);
  }
}
let lastRandomGenerationTime = 0
// Function to equip bomb with a 40% chance
function equipBombWithChance(currentTime) {
  // Check if at least one second has passed since the last random number generation
  if (currentTime - lastRandomGenerationTime >= 1000) {
    // Generate a random number between 0 and 1
    const randomChance = Math.random();

    // 40% chance of equipping a bomb
    if (randomChance <= 0.4) {
      enhancedShopShortcut("Bomb", game.ui.inventory.Bomb.tier);
      lastRandomGenerationTime = currentTime;
    } else {
      enhancedShopShortcut("Bow", game.ui.inventory.Bow.tier);
      lastRandomGenerationTime = currentTime;
    }
  }
}

// Function to perform actions based on distance
function performActions(distance) {
  const currentTime = Date.now();

  if (distance > 100 && distance <= 150) {
    // If the distance is between 100 and 150, equip bomb with a 40% chance
    equipBombWithChance(currentTime);
  } else if (distance > 150 && distance < Infinity) {
    // If the distance is greater than 150, perform this action
    enhancedShopShortcut("Bow", game.ui.inventory.Bow.tier);
  } else if (distance <= 100) {
    // If the distance is less than or equal to 100, perform this action
    enhancedShopShortcut("Spear", game.ui.inventory.Spear.tier);
  }
}

// Function to find the closest enemy player and calculate the distance
function findClosestEnemyPlayerDistance() {
  if (fighting) {
    // Get your player's party ID
    const myPartyId = game.ui.playerPartyId;

    // Get your player's position
    const myX = game.ui.playerTick.position.x;
    const myY = game.ui.playerTick.position.y;

    // Initialize variables to keep track of the closest enemy player and distance
    let closestEnemyPlayer = null;
    let closestDistance = Infinity;

    // Iterate through all players
    for (let i in game.renderer.npcs.attachments) {
      if (game.renderer.npcs.attachments[i].fromTick.name) {
        const player = game.renderer.npcs.attachments[i];
        const playerX = player.targetTick.position.x;
        const playerY = player.targetTick.position.y;
        const playerPartyId = player.targetTick.partyId;

        // Check if this player is not in your party
        if (playerPartyId !== myPartyId && player.targetTick.health > 0) {
          // Calculate the distance between your player and this player
          const distance = calculateDistance(myX, myY, playerX, playerY);

          // Check if this player is closer than the current closest enemy player and the distance is greater than 20
          if (distance < closestDistance && distance > 20) {
            closestEnemyPlayer = player;
            closestDistance = distance;
          }
        }
      }
    }

    // Check if there are any enemy players in range before performing actions
    if (closestEnemyPlayer !== null) {
      // Now, closestEnemyPlayer contains the closest enemy player, and closestDistance contains the distance

      // Perform actions based on the distance
      performActions(closestDistance);
    }
  }
}

let trappingEnabled = false;

// Function to round a number to the nearest multiple of a given factor and adjust by 24
function roundToNearest48Adjusted(number) {
  const rounded = Math.round(number / 48) * 48;
  return rounded + (number > rounded ? 24 : -24);
}

// Function to place 7x7 walls around a given position
function place7x7Walls(x, y) {
  // Calculate the nearest multiple of 48 for the rounded position with adjustment
  const roundedX = roundToNearest48Adjusted(x);
  const roundedY = roundToNearest48Adjusted(y);

  // Layer 1
  placeWall(roundedX - 48 - 48 - 48, roundedY + 48 + 48 + 48);
  placeWall(roundedX - 48 - 48, roundedY + 48 + 48 + 48);
  placeWall(roundedX - 48, roundedY + 48 + 48 + 48);
  placeWall(roundedX, roundedY + 48 + 48 + 48);
  placeWall(roundedX + 48, roundedY + 48 + 48 + 48);
  placeWall(roundedX + 48 + 48, roundedY + 48 + 48 + 48);
  placeWall(roundedX + 48 + 48 + 48, roundedY + 48 + 48 + 48);

  // Layer 2
  placeWall(roundedX - 48 - 48 - 48, roundedY + 48 + 48);
  placeWall(roundedX + 48 + 48 + 48, roundedY + 48 + 48);

  // Layer 3
  placeWall(roundedX - 48 - 48 - 48, roundedY + 48);
  placeWall(roundedX + 48 + 48 + 48, roundedY + 48);

  // Layer 4
  placeWall(roundedX - 48 - 48 - 48, roundedY);
  placeWall(roundedX + 48 + 48 + 48, roundedY);

  // Layer 5
  placeWall(roundedX - 48 - 48 - 48, roundedY - 48);
  placeWall(roundedX + 48 + 48 + 48, roundedY - 48);

  // Layer 6
  placeWall(roundedX - 48 - 48 - 48, roundedY - 48 - 48);
  placeWall(roundedX + 48 + 48 + 48, roundedY - 48 - 48);

  // Layer 7
  placeWall(roundedX - 48 - 48 - 48, roundedY - 48 - 48 - 48);
  placeWall(roundedX - 48 - 48, roundedY - 48 - 48 - 48);
  placeWall(roundedX - 48, roundedY - 48 - 48 - 48);
  placeWall(roundedX, roundedY - 48 - 48 - 48);
  placeWall(roundedX + 48, roundedY - 48 - 48 - 48);
  placeWall(roundedX + 48 + 48, roundedY - 48 - 48 - 48);
  placeWall(roundedX + 48 + 48 + 48, roundedY - 48 - 48 - 48);
}

function findPlayersInRangeToTrap() {
  if (trappingEnabled) {
    const myPartyId = game.ui.playerPartyId;
    // Get your player's position
    const myX = game.ui.playerTick.position.x;
    const myY = game.ui.playerTick.position.y;

    // Iterate through all players
    for (let i in game.renderer.npcs.attachments) {
      if (game.renderer.npcs.attachments[i].fromTick.name) {
        const player = game.renderer.npcs.attachments[i];
        const playerX = player.targetTick.position.x;
        const playerY = player.targetTick.position.y;
        const playerPartyId = player.targetTick.partyId;
        const stash = getGoldStash()
        const stashPosition = {
          x: stash.fromTick.position.x,
          y: stash.fromTick.position.y
        }

        if (playerPartyId !== myPartyId && calculateDistance(myX, myY, playerX, playerY) < 420 && calculateDistance(stashPosition.x, stashPosition.y, playerX, playerY) < 700 && player.targetTick.health > 0) {
          // Get the position of the enemy player
          const enemyX = playerX;
          const enemyY = playerY;

          // Place 7x7 walls around the enemy player's position
          place7x7Walls(enemyX, enemyY);
        }
      }
    }
  }
}

// Variable to keep track of whether you are in fighting mode
let switching = false;

// Function to perform actions based on distance
function changeWeapon(distance) {
  if (distance <= 100 && distance > 0) {
    equipItem("Spear", game.ui.inventory.Spear.tier);
  } else if (distance > 100 && distance <= 300) {
    equipItem("Bomb", game.ui.inventory.Bomb.tier);
  } else if (distance > 300 && distance < Infinity) {
    equipItem("Bow", game.ui.inventory.Bow.tier);
  }
}

// Function to find the closest enemy player and calculate the distance
function FindClosestPlayer() {
  if (switching) {
    // Get your player's party ID
    const myPartyId = game.ui.playerPartyId;

    // Get your player's position
    const myX = game.ui.playerTick.position.x;
    const myY = game.ui.playerTick.position.y;

    // Initialize variables to keep track of the closest enemy player and distance
    let closestEnemyPlayer = null;
    let closestDistance = Infinity;

    // Iterate through all players
    for (let i in game.renderer.npcs.attachments) {
      if (game.renderer.npcs.attachments[i].fromTick.name) {
        const player = game.renderer.npcs.attachments[i];
        const playerX = player.targetTick.position.x;
        const playerY = player.targetTick.position.y;
        const playerPartyId = player.targetTick.partyId;

        // Check if this player is not in your party
        if (playerPartyId !== myPartyId && player.targetTick.health > 0) {
          // Calculate the distance between your player and this player
          const distance = calculateDistance(myX, myY, playerX, playerY);

          // Check if this player is closer than the current closest enemy player and the distance is greater than 20
          if (distance < closestDistance && distance > 20) {
            closestEnemyPlayer = player;
            closestDistance = distance;
          }
        }
      }
    }

    // Check if there are any enemy players in range before performing actions
    if (closestEnemyPlayer !== null) {
      // Now, closestEnemyPlayer contains the closest enemy player, and closestDistance contains the distance

      // Perform actions based on the distance
      changeWeapon(closestDistance);
    }
  }
}

// Variable to keep track of whether you are in moving mode
let moving = false;

// Declare closestEnemyPlayer outside of the functions
let closestEnemyPlayer = null;

// Function to perform actions based on distance
function followPlayer(distance) {
  if (distance < 300) {
    // If the distance is less than 300, lock your position to the player
    lockposition(closestEnemyPlayer.targetTick.position.x, closestEnemyPlayer.targetTick.position.y);
  }
}

// Function to find the closest enemy player and calculate the distance
function findClosestPlayerToFollow() {
  if (moving) {
    // Get your player's party ID
    const myPartyId = game.ui.playerPartyId;

    // Get your player's position
    const myX = game.ui.playerTick.position.x;
    const myY = game.ui.playerTick.position.y;

    // Initialize variables to keep track of the closest enemy player and distance
    closestEnemyPlayer = null; // Reset closestEnemyPlayer
    let closestDistance = Infinity;

    // Iterate through all players
    for (let i in game.renderer.npcs.attachments) {
      if (game.renderer.npcs.attachments[i].fromTick.name) {
        const player = game.renderer.npcs.attachments[i];
        const playerX = player.targetTick.position.x;
        const playerY = player.targetTick.position.y;
        const playerPartyId = player.targetTick.partyId;

        // Check if this player is not in your party
        if (playerPartyId !== myPartyId && player.targetTick.health > 0) {
          // Calculate the distance between your player and this player
          const distance = calculateDistance(myX, myY, playerX, playerY);

          // Check if this player is closer than the current closest enemy player and the distance is greater than 20
          if (distance < closestDistance && distance > 20) {
            closestEnemyPlayer = player;
            closestDistance = distance;
          }
        }
      }
    }

    // Check if there are any enemy players in range before performing actions
    if (closestEnemyPlayer !== null) {
      // Now, closestEnemyPlayer contains the closest enemy player, and closestDistance contains the distance

      // Perform actions based on the distance
      followPlayer(closestDistance);
    }
  }
}

let shouldBowFollow = false;

// Declare closestEnemyPlayer outside of the functions
let closestEnemy = null;

// Function to perform actions based on distance
function bowFollowPlayer(distance) {
    if (distance < Infinity) {
    maintainDistanceFromPos(closestEnemy.targetTick.position.x, closestEnemy.targetTick.position.y);
    }
}

// Function to find the closest enemy player and calculate the distance
function findClosestPlayerToBow() {
  if (shouldBowFollow) {
    // Get your player's party ID
    const myPartyId = game.ui.playerPartyId;

    // Get your player's position
    const myX = game.ui.playerTick.position.x;
    const myY = game.ui.playerTick.position.y;

    // Initialize variables to keep track of the closest enemy player and distance
    closestEnemy = null; // Reset closestEnemy
    let closestDistance = Infinity;

    // Iterate through all players
    for (let i in game.renderer.npcs.attachments) {
      if (game.renderer.npcs.attachments[i].fromTick.name) {
        const player = game.renderer.npcs.attachments[i];
        const playerX = player.targetTick.position.x;
        const playerY = player.targetTick.position.y;
        const playerPartyId = player.targetTick.partyId;

        // Check if this player is not in your party
        if (playerPartyId !== myPartyId && player.targetTick.health > 0) {
          // Calculate the distance between your player and this player
          const distance = calculateDistance(myX, myY, playerX, playerY);

          // Check if this player is closer than the current closest enemy player and the distance is greater than 20
          if (distance < closestDistance && distance > 20) {
            closestEnemy = player;
            closestDistance = distance;
          }
        }
      }
    }

    // Check if there are any enemy players in range before performing actions
    if (closestEnemy !== null) {
      // Now, closestEnemyPlayer contains the closest enemy player, and closestDistance contains the distance

      // Perform actions based on the distance
      bowFollowPlayer(closestDistance);
    }
  }
}

let shouldCombatZoom = false;

function changeZoom(distance) {
  if (distance <= 175) {
    dimension = 0.6
    onWindowResize()
  }
    if (distance > 250 && distance < 475) {
        dimension = 1
        onWindowResize()
    }
    if (distance > 550) {
    dimension = 1.5
    onWindowResize()
  }
}

function getClosestPlayer() {
  if (shouldCombatZoom) {
    // Get your player's party ID
    const myPartyId = game.ui.playerPartyId;

    // Get your player's position
    const myX = game.ui.playerTick.position.x;
    const myY = game.ui.playerTick.position.y;

    // Initialize variables to keep track of the closest enemy player and distance
    let closestEnemyPlayer = null;
    let closestDistance = Infinity;

    // Iterate through all players
    for (let i in game.renderer.npcs.attachments) {
      if (game.renderer.npcs.attachments[i].fromTick.name) {
        const player = game.renderer.npcs.attachments[i];
        const playerX = player.targetTick.position.x;
        const playerY = player.targetTick.position.y;
        const playerPartyId = player.targetTick.partyId;

        // Check if this player is not in your party
        if (playerPartyId !== myPartyId && player.targetTick.health > 0) {
          // Calculate the distance between your player and this player
          const distance = calculateDistance(myX, myY, playerX, playerY);

          // Check if this player is closer than the current closest enemy player and the distance is greater than 20
          if (distance < closestDistance && distance > 20) {
            closestEnemyPlayer = player;
            closestDistance = distance;
          }
        }
      }
    }

    // Check if there are any enemy players in range before performing actions
    if (closestEnemyPlayer !== null) {
      changeZoom(closestDistance);
    } else {
        dimension = 1.5
        onWindowResize()
    }
  }
}

function toggleAHRC() {
  if (!shouldAHRC) {
    shouldAHRC = true;
    document.getElementById("toggleahrc").innerHTML = "AHRC On";
  } else {
    shouldAHRC = false;
    document.getElementById("toggleahrc").innerHTML = "AHRC Off";
  }
}

function toggleRespawn() {
  if (!shouldAutoRespawn) {
    shouldAutoRespawn = true;
    document.getElementById("toggleresp").innerHTML = "Respawn On";
  } else {
    shouldAutoRespawn = false;
    document.getElementById("toggleresp").innerHTML = "Respawn Off";
  }
}

function toggleAim() {
  if (!shouldAutoAim) {
    shouldAutoAim = true;
    document.getElementById("toggleaim").innerHTML = "Aim On";
  } else {
    shouldAutoAim = false;
    document.getElementById("toggleaim").innerHTML = "Aim Off";
  }
}

function toggleHealPet() {
  if (!shouldAutoHealPet) {
    shouldAutoHealPet = true;
    document.getElementById("healpet").innerHTML = "Heal Pet On";
  } else {
    shouldAutoHealPet = false;
    document.getElementById("healpet").innerHTML = "Heal Pet Off";
  }
}

function toggleRevivePet() {
  if (!shouldAutoRevivePet) {
    shouldAutoRevivePet = true
    document.getElementById("revivepet").innerHTML = "Revive On";
  } else {
    shouldAutoRevivePet = false
    document.getElementById("revivepet").innerHTML = "Revive Off";
  }
}

function toggleEvolvePet() {
  if (!shouldAutoEvolvePet) {
    shouldAutoEvolvePet = true
    document.getElementById("evolvepet").innerHTML = "Evolve On";
  } else {
    shouldAutoEvolvePet = false
    document.getElementById("evolvepet").innerHTML = "Evolve Off";
  }
}

function toggleHealPlayer() {
  if (!shouldAutoHealPlayer) {
    shouldAutoHealPlayer = true
    document.getElementById("healplayer").innerHTML = "Heal Player On"
  } else {
    shouldAutoHealPlayer = false
    document.getElementById("healplayer").innerHTML = "Heal Player Off"
  }
}

function move(direction) {
  switch (direction) {
    case 'Up': {
      game.inputPacketScheduler.scheduleInput({
        up: 1,
        down: 0,
        left: 0,
        right: 0
      })
      break
    }
    case 'Down': {
      game.inputPacketScheduler.scheduleInput({
        up: 0,
        down: 1,
        left: 0,
        right: 0
      })
      break
    }
    case 'Left': {
      game.inputPacketScheduler.scheduleInput({
        up: 0,
        down: 0,
        left: 1,
        right: 0
      })
      break
    }
    case 'Right': {
      game.inputPacketScheduler.scheduleInput({
        up: 0,
        down: 0,
        left: 0,
        right: 1
      })
      break
    }
    case 'UpRight': {
      game.inputPacketScheduler.scheduleInput({
        up: 1,
        down: 0,
        left: 0,
        right: 1
      })
      break
    }
    case 'UpLeft': {
      game.inputPacketScheduler.scheduleInput({
        up: 1,
        down: 0,
        left: 1,
        right: 0
      })
      break
    }
    case 'DownRight': {
      game.inputPacketScheduler.scheduleInput({
        up: 0,
        down: 1,
        left: 0,
        right: 1
      })
      break
    }
    case 'DownLeft': {
      game.inputPacketScheduler.scheduleInput({
        up: 0,
        down: 1,
        left: 1,
        right: 0
      })
      break
    }
  }
}

let yaw
let lockedYaw
let shouldSpin = false
let shouldClearChat = false
let shouldSpamIdParty = false
let shouldSpamAllParty = false
let shouldLockYaw = false
let autoSwing = false
let shouldBotMode = false
let botTimeout = false
let shouldAHRC = false
let shouldAutoAim = false
let stash10leave = false
let shouldAutoHealPet = true
let healPetTimeout = false
let shouldAutoRevivePet = true
let shouldAutoEvolvePet = true
let shouldAutoHealPlayer = true
let playerHealTimeout = false
let petSpawned = false
let isSellingWalls = false
let isSellingDoors = false
let isSellingHarvs = false
let isSellingTraps = false
let isSellingArrows = false
let isSellingCannons = false
let isSellingMelees = false
let isSellingMages = false
let isSellingBombs = false
let isSellingMines = false
let shouldhealthup = false
let shouldhealtowers = false
let renderborder = false
let renderRange = false
let renderTracer = false
let getRss = false
let allowed1 = false
const getDOMValue = (id) => document.getElementById(id).value;
let healthpotion = []

game.network.sendRpc2 = game.network.sendRpc;

if (!window.baseSave) {
  window.baseSave = '[]';
};

let buildingsByPos = new Map();

window.saveBase = () => {
  let stash = GetGoldStash();

  if (stash == undefined) return;;

  let stashPosition = {
    x: stash.x,
    y: stash.y
  };

  let parsedSavedStorage = [];

  for (let i in game.ui.buildings) {
    let building = game.ui.buildings[i];

    parsedSavedStorage.push({
      buildingType: building.type,
      stashOffsetX: stash.x - building.x,
      stashOffsetY: stash.y - building.y,
      lastTier: building.tier
    });
  };

  window.baseSave = JSON.stringify(parsedSavedStorage);
};

window.buildBase = () => {
  let stash = GetGoldStash();

  if (stash == undefined) return;;

  let stashPosition = {
    x: stash.x,
    y: stash.y
  };

  let parsedSavedStorage = window.baseSave;

  if (parsedSavedStorage) {
    parsedSavedStorage = JSON.parse(window.baseSave);

    for (let i of parsedSavedStorage) {
      game.network.sendRpc2({
        name: "MakeBuilding",
        type: i.buildingType,
        x: Math.round(parseInt(stash.x) - i.stashOffsetX),
        y: Math.round(parseInt(stash.y) - i.stashOffsetY),
        yaw: 0
      });
    };
  };
};

window.toggleRebuilder = () => {
  let parsedSavedStorage = window.baseSave;

  if (parsedSavedStorage) {
    parsedSavedStorage = JSON.parse(window.baseSave);

    buildingsByPos = new Map();

    for (let i of parsedSavedStorage) {
      buildingsByPos.set(`${i.stashOffsetX}, ${i.stashOffsetY}`, i);
    };

    if (!window.rebuilderInterval) {
      window.saveBase();

      window.rebuilderInterval = setInterval(() => {
        window.buildBase();

        let buildingsArr = Object.values(game.ui.buildings);

        let stash = buildingsArr[0];

        stash && buildingsArr.forEach(e => {
          let building = buildingsByPos.get(`${stash.x - e.x}, ${stash.y - e.y}`);

          if (building && e.tier < building.lastTier) {
            game.network.sendRpc2({
              name: "UpgradeBuilding",
              uid: e.uid
            });
          };
        });
      }, 350);
    } else {
      window.rebuilderInterval = clearInterval(window.rebuilderInterval);
    };
  } else return;
};

game.network.addEntityUpdateHandler((data = {}) => {
  if (!game.world.inWorld || !game.network.connected) return;

  const healPetInputValue = getDOMValue("healpetinput");
  const healPlayerInputValue = getDOMValue("healplayerinput");

  const myPet = game.world.entities[game.ui.playerTick?.petUid]?.fromTick;
  const petHealth = (myPet?.health / myPet?.maxHealth) * 100;
  const myPlayer = game.world.entities[game.ui.playerTick?.uid]?.fromTick;
  const playerHealth = (myPlayer?.health / myPlayer?.maxHealth) * 100;
  healthpotion = game.ui.inventory.HealthPotion

  if (game.ui.playerTick?.petUid != 0 && game.ui.playerTick?.petUid != undefined) petSpawned = true;
    if (shouldAutoHealPet && petHealth < document.getElementById("healpetinput").value && petHealth > 0 && game.ui.playerTick.gold >= 100 && !healPetTimeout) {
      shopShortcut("PetHealthPotion", 1)
      healPetTimeout = true;
      setTimeout(() => {
        healPetTimeout = false;
      }, 300);

    }
    if (shouldAutoEvolvePet && petHealth > 0 && game.world.entities[game.ui.playerTick?.uid]?.fromTick?.health > 0) {
      let model = game.world.entities[game.ui.playerTick?.petUid]?.fromTick?.model
      let tokens = document.querySelectorAll(".hud-shop-item-tokens")
      let pToken = game.ui.playerTick.token
      let evolvebtn = document.querySelectorAll(".hud-shop-actions-evolve")
      if (!evolvebtn[0].classList[1] && pToken >= tokens[0].innerHTML && model == "PetCARL") {
        buyItem("PetCARL", getPetTier(5))
      }
      if (!evolvebtn[1].classList[1] && pToken >= tokens[1].innerHTML && model == "PetMiner") {
        buyItem("PetMiner", getPetTier(6))
      }
    }
  if (petSpawned && shouldAutoRevivePet && !game.world.entities[game.ui.playerTick?.petUid] && playerHealth > 0) {
    shopShortcut("PetRevive", 1);
  }

  if (playerHealth > 0 && !healthpotion && game.ui.playerTick.gold >= 100 && shouldAutoHealPlayer) {
    buyItem("HealthPotion", 1);
  }

  if (playerHealth <= healPlayerInputValue && healthpotion && playerHealth > 0 && game.ui.playerTick.gold >= 100 && shouldAutoHealPlayer && !playerHealTimeout) {
    equipItem("HealthPotion", 1);
    playerHealTimeout = true;
    setTimeout(() => {
      playerHealTimeout = false;
    }, 300);
  }
    Object.values(data.entities).forEach(data => {
      if (data.model === "GoldStash") {
        borders.forEach(item => {
          item.position = data.position;
        });
        circle.position = data.position;
        plusRectangles[0].position = data.position;
        plusRectangles[1].position = data.position;

        if (!game.world.renderer.entities.node.children.includes(circle)) {
          game.world.renderer.entities.node.addChild(circle);
        }
        borders.forEach(item => {
          if (!game.world.renderer.entities.node.children.includes(item)) {
            game.world.renderer.entities.node.addChild(item);
          }
        });
        plusRectangles.forEach(item => {
          if (!game.world.renderer.entities.node.children.includes(item)) {
            game.world.renderer.entities.node.addChild(item);
          }
        });
      }
    });
    if (shouldAHRC) {
      let entities = Game.currentGame.world.entities;
      for (let uid in entities) {
        let obj = entities[uid];
         if(obj.fromTick.model == "Harvester") {
            let amount = obj.fromTick.tier * 0.07 - 0.02;
            game.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: amount
            });
            game.network.sendRpc({
                name: "CollectHarvester",
                uid: obj.fromTick.uid
            });
         }
      }
    }
    if (fighting) {
      findClosestEnemyPlayerDistance();
    }
    if (trappingEnabled) {
      findPlayersInRangeToTrap();
    }
    if (switching) {
      FindClosestPlayer();
    }
    if (moving) {
      findClosestPlayerToFollow();
    }
    if (shouldBowFollow) {
      findClosestPlayerToBow();
    }
    if (shouldCombatZoom) {
      getClosestPlayer();
    }
    if (shouldabpk) {
      if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 1 && game.ui.playerTick.gold >= undefined) {
        game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 2 && game.ui.playerTick.gold >= 1000) {
        game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 3 && game.ui.playerTick.gold >= 3000) {
        game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 4 && game.ui.playerTick.gold >= 5000) {
        game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 5 && game.ui.playerTick.gold >= 8000) {
        game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 6 && game.ui.playerTick.gold >= 24000) {
        game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 7 && game.ui.playerTick.gold >= 90000) {
        game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
      };
    }
    if (shouldabsp) {
      if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 1 && game.ui.playerTick.gold >= 1400) {
        game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 2 && game.ui.playerTick.gold >= 2800) {
        game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 3 && game.ui.playerTick.gold >= 5600) {
        game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 4 && game.ui.playerTick.gold >= 11200) {
        game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 5 && game.ui.playerTick.gold >= 22500) {
        game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 6 && game.ui.playerTick.gold >= 45000) {
        game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 7 && game.ui.playerTick.gold >= 90000) {
        game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
      }
    }
    if (shouldabbw) {
      if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 1 && game.ui.playerTick.gold >= 100) {
        game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 2 && game.ui.playerTick.gold >= 400) {
        game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 3 && game.ui.playerTick.gold >= 2000) {
        game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 4 && game.ui.playerTick.gold >= 7000) {
        game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 5 && game.ui.playerTick.gold >= 24000) {
        game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 6 && game.ui.playerTick.gold >= 30000) {
        game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 7 && game.ui.playerTick.gold >= 90000) {
        game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
      }
    }
    if (shouldabbm) {
      if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 1 && game.ui.playerTick.gold >= 100) {
        game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 2 && game.ui.playerTick.gold >= 400) {
        game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 3 && game.ui.playerTick.gold >= 3000) {
        game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 4 && game.ui.playerTick.gold >= 5000) {
        game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 5 && game.ui.playerTick.gold >= 24000) {
        game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 6 && game.ui.playerTick.gold >= 50000) {
        game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 7 && game.ui.playerTick.gold >= 90000) {
        game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
      }
    }
    if (shouldabsh) {
      if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 1 && game.ui.playerTick.gold >= 1000) {
        game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 2 && game.ui.playerTick.gold >= 3000) {
        game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 3 && game.ui.playerTick.gold >= 7000) {
        game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 4 && game.ui.playerTick.gold >= 14000) {
        game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 5 && game.ui.playerTick.gold >= 18000) {
        game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 6 && game.ui.playerTick.gold >= 22000) {
        game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 7 && game.ui.playerTick.gold >= 24000) {
        game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 8 && game.ui.playerTick.gold >= 30000) {
        game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 9 && game.ui.playerTick.gold >= 45000) {
        game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
      };
      if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 10 && game.ui.playerTick.gold >= 70000) {
        game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
      };
    }
    if (shouldAutoAim) {
      window.targets = [];
      let entities = game.renderer.npcs.attachments;
      let aimOptions = document.getElementById('aimOptions').value;

      let players = [];
      let zombies = [];

      for (let i in entities) {
        if (entities[i].fromTick.model == "GamePlayer" && entities[i].fromTick.uid !== game.ui.playerTick.uid && entities[i].targetTick.partyId !== game.ui.playerPartyId && entities[i].fromTick.dead === 0) {
          players.push(entities[i].fromTick);
        } else if (entities[i].fromTick.model !== "GamePlayer" && entities[i].entityClass !== "Projectile") {
          zombies.push(entities[i].fromTick);
        }
      }

      if (aimOptions === 'pl') {
        window.targets = players.length > 0 ? players : zombies;
      } else if (aimOptions === 'zo') {
        window.targets = zombies.length > 0 ? zombies : players;
      }

      if (window.targets.length > 0) {
        const myPos = game.ui.playerTick.position;
        window.targets.sort((a, b) => {
          return measureDistance(myPos, a.position) - measureDistance(myPos, b.position);
        });

        const target = window.targets[0];
        let reversedAim = game.inputPacketCreator.screenToYaw((target.position.x - myPos.x) * 100, (target.position.y - myPos.y) * 100);
        game.inputPacketCreator.lastAnyYaw = reversedAim;
        game.network.sendPacket(3, {
          mouseMoved: reversedAim
        });
      }
    };
    if (autoSwing) {
      game.network.sendInput({
        space: 0
      })
      game.network.sendInput({
        space: 1
      })
    }
    if (shouldLockYaw && game.ui.playerTick?.aimingYaw != lockedYaw) {
      game.inputPacketCreator.lastAnyYaw = lockedYaw;
      game.network.sendPacket(3, {
        mouseMoved: lockedYaw
      });
    }
    isSellingWalls ? Object.values(game.ui.buildings).forEach(i => i.type == "Wall" ? game.network.sendPacket(9, {
      name: "DeleteBuilding",
      uid: i.uid
    }) : 0) : 0;
    isSellingDoors ? Object.values(game.ui.buildings).forEach(i => i.type == "Door" ? game.network.sendPacket(9, {
      name: "DeleteBuilding",
      uid: i.uid
    }) : 0) : 0;
    isSellingTraps ? Object.values(game.ui.buildings).forEach(i => i.type == "SlowTrap" ? game.network.sendPacket(9, {
      name: "DeleteBuilding",
      uid: i.uid
    }) : 0) : 0;
    isSellingArrows ? Object.values(game.ui.buildings).forEach(i => i.type == "ArrowTower" ? game.network.sendPacket(9, {
      name: "DeleteBuilding",
      uid: i.uid
    }) : 0) : 0;
    isSellingCannons ? Object.values(game.ui.buildings).forEach(i => i.type == "CannonTower" ? game.network.sendPacket(9, {
      name: "DeleteBuilding",
      uid: i.uid
    }) : 0) : 0;
    isSellingMelees ? Object.values(game.ui.buildings).forEach(i => i.type == "MeleeTower" ? game.network.sendPacket(9, {
      name: "DeleteBuilding",
      uid: i.uid
    }) : 0) : 0;
    isSellingBombs ? Object.values(game.ui.buildings).forEach(i => i.type == "BombTower" ? game.network.sendPacket(9, {
      name: "DeleteBuilding",
      uid: i.uid
    }) : 0) : 0;
    isSellingMages ? Object.values(game.ui.buildings).forEach(i => i.type == "MagicTower" ? game.network.sendPacket(9, {
      name: "DeleteBuilding",
      uid: i.uid
    }) : 0) : 0;
    isSellingMines ? Object.values(game.ui.buildings).forEach(i => i.type == "GoldMine" ? game.network.sendPacket(9, {
      name: "DeleteBuilding",
      uid: i.uid
    }) : 0) : 0;
    isSellingHarvs ? Object.values(game.ui.builddings).forEach(i => i.type == "Harvester" ? game.network.sendPacket(9, {
      name: "DeleteBuilding",
      uid: i.uid
    }) : 0) : 0;
    if (stash10leave) {
      let stash = getGoldStash()
      if (stash) {
        let stashhealth = (stash.fromTick.health / stash.fromTick.maxHealth) * 100;
        if (stashhealth <= 10) {
          Game.currentGame.network.sendRpc({
            name: "LeaveParty"
          })
        }
      }
    }
    if (renderborder) {
      borders.forEach(item => {
        item.visible = true
      });
      circle.visible = true;
      plusRectangles[0].visible = true;
      plusRectangles[1].visible = true;
    } else {
      borders.forEach(item => {
        item.visible = false
      });
      circle.visible = false;
      plusRectangles[0].visible = false;
      plusRectangles[1].visible = false;
    }
    if (shouldBotMode && botTimeout == false) {
      botTimeout = true
      move(['Up', 'Down', 'Left', 'Right', 'UpRight', 'UpLeft', 'DownRight', 'DownLeft'][Math.floor(Math.random() * 8)])
      setTimeout(() => {
        botTimeout = false
      }, 1000);
    }
    if (shouldSpamAllParty) {
      let joinablePartyId = []
      let allparty = Object.values(game.ui.getParties())
      for (let party of allparty) {
        if (party.isOpen == 1 && party.memberCount < 4 && party.partyId != game.ui.getPlayerPartyId()) joinablePartyId.push(party.partyId)
      }
      if (joinablePartyId.length > 0) game.network.sendRpc({
        name: 'JoinParty',
        partyId: joinablePartyId[Math.floor(Math.random() * joinablePartyId.length)]
      })
    }
    if (shouldSpin) {
      game.inputPacketCreator.lastAnyYaw = yaw;
      game.network.sendPacket(3, {
        mouseMoved: yaw
      });
      yaw += 10
      if (yaw >= 360) yaw -= 360
    }
    if (shouldSpamIdParty && document.querySelector("#party-id-input").value != '') {
        game.network.sendRpc({
          name: "JoinParty",
          partyId: parseInt(document.querySelector("#party-id-input").value)
        })
    }
    if (shouldClearChat) {
      for (let i = 0; i < document.getElementsByClassName('hud-chat-message').length; i++) {
        document.getElementsByClassName('hud-chat-message')[i].remove();
      };
    }
    if (autogivesell && game.ui.playerPartyMembers[0].playerUid == game.world.myUid) {
      if (game.ui.playerPartyMembers[1]) {
        let sell1 = new Uint8Array(game.network.codec.encode(9, {
          name: "SetPartyMemberCanSell",
          uid: game.ui.playerPartyMembers[1].playerUid,
          canSell: 1
        }));
        setTimeout(() => {
          game.network.socket.send(sell1);
        }, 3839);
      }
      if (game.ui.playerPartyMembers[2]) {
        let sell2 = new Uint8Array(game.network.codec.encode(9, {
          name: "SetPartyMemberCanSell",
          uid: game.ui.playerPartyMembers[2].playerUid,
          canSell: 1
        }));
        setTimeout(() => {
          game.network.socket.send(sell2);
        }, 2361);
      }
      if (game.ui.playerPartyMembers[3]) {
        let sell3 = new Uint8Array(game.network.codec.encode(9, {
          name: "SetPartyMemberCanSell",
          uid: game.ui.playerPartyMembers[3].playerUid,
          canSell: 1
        }));
        setTimeout(() => {
          game.network.socket.send(sell3);
        }, 1274);
      }
    }
  if (shouldhealthup) {
    for (let uid in data.entities) {
      const currentEntity = data.entities[uid];
      const worldEntity = game.world.entities[uid];

      if (uid in game.ui.buildings && typeof currentEntity.health == 'number') {
        const buildingHealth = (currentEntity?.health / worldEntity.targetTick.maxHealth) * 100;

        if (buildingHealth <= 20) {
          game.network.sendRpc({
            name: "UpgradeBuilding",
            uid: parseInt(uid)
          });
        }
      }
    }
  }

  if (shouldhealtowers) {
    for (let uid in data.entities) {
      const currentEntity = data.entities[uid];
      const worldEntity = game.world.entities[uid];

      if (uid in game.ui.buildings && typeof currentEntity.health == 'number') {
        const buildingHealth = (currentEntity?.health / worldEntity.targetTick.maxHealth) * 100;

        if (buildingHealth <= 50 && game.ui.playerTick.gold >= 1000 && !isNonTowerBuilding(game.ui.buildings[uid].type)) {
          const buildingX = worldEntity.targetTick.position.x;
          const buildingY = worldEntity.targetTick.position.y;
          game.network.sendPacket(9, {
            name: "CastSpell",
            spell: "HealTowersSpell",
            x: Math.round(buildingX),
            y: Math.round(buildingY),
            tier: 1
          });
        }
      }
    }
  }
    if (getRss) {
      !allowed1 && (allowed1 = true);
    }
    if (getRss || allowed1) {
      for (let i in game.renderer.npcs.attachments) {
        if (game.renderer.npcs.attachments[i].fromTick.name) {
          let player = game.renderer.npcs.attachments[i];
          let wood_1 = counter(player.targetTick.wood);
          let stone_1 = counter(player.targetTick.stone);
          let gold_1 = counter(player.targetTick.gold);
          let token_1 = counter(player.targetTick.token);
          let px_1 = counter(player.targetTick.position.x);
          let py_1 = counter(player.targetTick.position.y);
          let timeout_1 = "";
          if (getRss && !player.targetTick.oldName) {
            player.targetTick.oldName = player.targetTick.name;
            player.targetTick.oldWood = wood_1;
            player.targetTick.oldStone = stone_1;
            player.targetTick.oldGold = gold_1;
            player.targetTick.oldToken = token_1;
            player.targetTick.oldPX = px_1;
            player.targetTick.oldPY = py_1;
            player.targetTick.info = `
  ${player.targetTick.oldName}; score: ${player.targetTick.score.toLocaleString()}
  UID: ${player.targetTick.uid}
  W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1}
  x: ${Math.round(player.targetTick.position.x)}, y: ${Math.round(player.targetTick.position.y)}
  partyId: ${Math.round(player.targetTick.partyId)}
  timeDead: ${msToTime(player.targetTick.timeDead)}
                    ${player.targetTick.isPaused ? "On Timeout" : ""}





`;
            player.targetTick.name = game.renderer.npcs.attachments[i].targetTick.info;
          }
          if (!getRss && player.targetTick.oldName) {
            player.targetTick.info = player.targetTick.oldName;
            player.targetTick.name = game.renderer.npcs.attachments[i].targetTick.info;
            player.targetTick.oldName = null;
          }
          if (getRss) {
            if (player.targetTick.oldGold !== gold_1 || player.targetTick.oldWood !== wood_1 || player.targetTick.oldStone !== stone_1 || player.targetTick.oldToken !== token_1 || player.targetTick.oldPX !== px_1 || player.targetTick.oldPY !== py_1) {
              player.targetTick.oldWood = wood_1;
              player.targetTick.oldStone = stone_1;
              player.targetTick.oldGold = gold_1;
              player.targetTick.oldToken = token_1;
              player.targetTick.oldPX = px_1;
              player.targetTick.oldPY = py_1;
              player.targetTick.info = `
  ${player.targetTick.oldName}; score: ${player.targetTick.score.toLocaleString()}
  UID: ${player.targetTick.uid}
  W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1}
  x: ${Math.round(player.targetTick.position.x)}, y: ${Math.round(player.targetTick.position.y)}
  partyId: ${Math.round(player.targetTick.partyId)}
  timeDead: ${msToTime(player.targetTick.timeDead)}
                    ${player.targetTick.isPaused ? "On Timeout" : ""}





`;
              player.targetTick.name = game.renderer.npcs.attachments[i].targetTick.info;
            }
          }
        }
      }
    }

    if (!getRss) {
      allowed1 = false;
    }
    for (const uid in data.entities) {
      if (game.world.entities[uid] && game.world.replicator.currentTick && game.world.replicator.currentTick.entities[uid]) {
        if (game.world.entities[uid].node.alpha != 1) game.world.entities[uid].setAlpha(1);
      }
    }
  if (data.entities[game.world.myUid].dead !== undefined) {
    lastPlayerTickDead = data.entities[game.world.myUid].dead;
  }
  for (let id in wsPosElems) {
    const ws = webSockets[id];
    if (!ws) {
      wsPosElems[id].remove();
      delete wsPosElems[id];
      continue;
    };
    wsPosElems[id].style.top = `${((ws.playerTick.position.y / game.world.height) * 100) - 20}%`;
    wsPosElems[id].style.left = `${((ws.playerTick.position.x / game.world.width) * 100) - 2}%`;
  };
  for (let id in webSockets) {
    if (wsPosElems[id]) {
      continue;
    };
    const ws = webSockets[id];
    const newPosElem = document.createElement("p");
    newPosElem.style.top = `${((ws.playerTick.position.y / game.world.height) * 100) - 20}%`
    newPosElem.style.left = `${((ws.playerTick.position.x / game.world.width) * 100) - 2}%`
    newPosElem.style.color = "white";
    newPosElem.style.position = "absolute";
    newPosElem.style.zIndex = "9"
    newPosElem.innerText = "•";
    document.getElementsByClassName("hud-map")[0].appendChild(newPosElem);
    wsPosElems[id] = newPosElem;
  };
})

let mousePs = {}
let should3x3Walls = false;
let should5x5Walls = false;
let should7x7Walls = false;
let should9x9Walls = false;

addEventListener('keyup', function(e) {
  if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
    if (e.key == "-") {
        getRss = !getRss
    }
    if (e.key == "g") {
        game.ui.components.PlacementOverlay.startPlacing("GoldStash");
    }
    if (e.key == "z") {
        should3x3Walls = !should3x3Walls;
        should5x5Walls = false
        should7x7Walls = false
        should9x9Walls = false
        if (should3x3Walls) {
        game.ui.getComponent("PopupOverlay").showHint('3x3 Walls On', 2000);
      } else {
        game.ui.getComponent("PopupOverlay").showHint('3x3 Walls Off', 2000);
      }
    }
    if (e.key == "x") {
       should5x5Walls = !should5x5Walls
        should3x3Walls = false
        should7x7Walls = false
        should9x9Walls = false
        if (should5x5Walls) {
        game.ui.getComponent("PopupOverlay").showHint('5x5 Walls On', 2000);
      } else {
        game.ui.getComponent("PopupOverlay").showHint('5x5 Walls Off', 2000);
      }
    }
    if (e.key == "c") {
      should7x7Walls = !should7x7Walls
        should3x3Walls = false
        should5x5Walls = false
        should9x9Walls = false
        if (should7x7Walls) {
        game.ui.getComponent("PopupOverlay").showHint('7x7 Walls On', 2000);
      } else {
        game.ui.getComponent("PopupOverlay").showHint('7x7 Walls Off', 2000);
      }
    }
    if (e.key == "v") {
      should9x9Walls = !should9x9Walls
        should3x3Walls = false
        should5x5Walls = false
        should7x7Walls = false
        if (should9x9Walls) {
        game.ui.getComponent("PopupOverlay").showHint('9x9 Walls On', 2000);
      } else {
        game.ui.getComponent("PopupOverlay").showHint('9x9 Walls Off', 2000);
      }
    }
    if (e.key == "C") {
      const selectedSong = document.getElementById('lyricSongs').value;
      switch (selectedSong) {
        case 'song1':
          playSong(TakingOver, song1, timeout1);
          break;
        case 'song2':
          playSong(NeverGonna, song2, timeout2);
          break;
        case 'song3':
          playSong(RuleTheWorld, song3, timeout3);
          break;
        case 'song4':
          playSong(DejaVu, song4, timeout4);
          break;
        case 'song5':
          playSong(DownLikeThat, song5, timeout5);
          break;
        case 'song6':
          playSong(superidol, song6, timeout6);
          break;
        case 'song7':
          playSong(ForTheNight, song7, timeout7);
          break;
        case 'song8':
          playSong(CocoNut, song8, timeout8);
          break;
        case 'song9':
          playSong(RapGod, song9, timeout9);
      }
    }
    if (e.key == "=") {
      game.ui.getComponent("PopupOverlay").showHint(
        'Do u think I have time to make this???',
        1.5e4
      )
    }
    if (e.key == "/") {
            document.querySelector("#hud-menu-settings")
               .style.display = document.querySelector("#hud-menu-settings")
                  .style.display == "none" ? "block" : "none"
            document.querySelector("#hud-menu-shop")
               .style.display = "none"
            document.querySelector("#hud-menu-party")
               .style.display = "none"
    }
    if (e.key == "`") {
      game.inputManager.onKeyRelease({
        keyCode: 117
      })
    }
    if (e.keyCode == 27) {
      let mb = document.getElementsByClassName("hud")[0];
      if (mb.style.display === "none") {
        mb.style.display = "block";
      } else {
        mb.style.display = "none";
      };
    }
    if (e.key == "?") {
      if (!shouldLockYaw) {
        lockedYaw = game.ui.playerTick.aimingYaw
        shouldLockYaw = true
        game.ui.getComponent("PopupOverlay").showHint('Yaw locked, press [?] to unlock', 1.5e4)
      } else {
        shouldLockYaw = false
        game.ui.getComponent("PopupOverlay").showHint('Yaw unlocked', 1.5e4)
      }
    }
  }
})

function placeWall(x, y) {
  game.network.sendRpc({
    name: 'MakeBuilding',
    x: x,
    y: y,
    type: "Wall",
    yaw: 0
  });
}

function isEven(number) {
  return number % 2 === 0;
}


function placeWalls(length, height, centerX, centerY) {
  for (let x = -((length - (isEven(length) ? 0 : 1)) / 2) * 48; x <= (length - (isEven(length) ? 0 : 1)) / 2 * 48; x += 48) {
    for (let y = -((height - (isEven(height) ? 0 : 1)) / 2) * 48; y <= (height - (isEven(height) ? 0 : 1)) / 2 * 48; y += 48) {
      const posX = centerX + x,
        posY = centerY + y;
      placeWall(posX, posY);
    }
  }
}

document.addEventListener('mousemove', e => {
  mousePs = {
    x: e.clientX,
    y: e.clientY
  };
  if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
    var buildingSchema = game.ui.getBuildingSchema();
    var schemaData = buildingSchema.Wall;
    var world = game.world;
    var worldPos = game.renderer.screenToWorld(mousePs.x, mousePs.y);
    var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, {
      width: schemaData.gridWidth,
      height: schemaData.gridHeight
    });
    var cellSize = world.entityGrid.getCellSize();
    var cellAverages = {
      x: 0,
      y: 0
    };
    for (var i in cellIndexes) {
      if (!cellIndexes[i]) {
        return false;
      }
      var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
      cellAverages.x += cellPos.x;
      cellAverages.y += cellPos.y;
    }
    cellAverages.x = cellAverages.x / cellIndexes.length;
    cellAverages.y = cellAverages.y / cellIndexes.length;
    var gridPos = {
      x: cellAverages.x * cellSize + cellSize / 2,
      y: cellAverages.y * cellSize + cellSize / 2
    };
    if (should3x3Walls) {
       placeWalls(3, 3, gridPos.x, gridPos.y);
    }
    if (should5x5Walls) {
       placeWalls(5, 5, gridPos.x, gridPos.y);
    }
    if (should7x7Walls) {
       placeWalls(7, 7, gridPos.x, gridPos.y);
    }
    if (should9x9Walls) {
       placeWalls(9, 9, gridPos.x, gridPos.y);
    }
  }
});

   let dimension = 1;
   const onWindowResize = () => {
      if (document.querySelector("#hud-menu-settings").style.display == "none") {
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


function measureDistance(obj1, obj2) {
  if (!(obj1.x && obj1.y && obj2.x && obj2.y)) return Infinity;
  let xDif = obj2.x - obj1.x;
  let yDif = obj2.y - obj1.y;
  return Math.abs((xDif ** 2) + (yDif ** 2));
};

document.querySelector('#togglebot').addEventListener('click', function() {
  shouldBotMode = !shouldBotMode
  this.innerText = shouldBotMode ? "Bot On" : "Bot Off"
})
document.querySelector('#togglespmch').addEventListener('click', function() {
  pauseChatSpam(document.querySelector('#spamchat').value)
  this.innerText = isSpamming ? "Spam Chat On" : "Spam Chat Off"
})

let blockedNames = [];

function blockPlayer(name) {
  blockedNames.push(name);
  for (let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
    if (msg.childNodes[0].childNodes[1].textContent == name) {
      let bl = msg.childNodes[0].childNodes[0];
      bl.innerHTML = "🔴 ";
      bl.onclick = () => {
        unblockPlayer(name);
      };
    };
  };
}

function unblockPlayer(name) {
  blockedNames.splice(blockedNames.indexOf(name), 1);
  for (let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
    if (msg.childNodes[0].childNodes[1].textContent == name) {
      let bl = msg.childNodes[0].childNodes[0];
      bl.innerHTML = "🟢 ";
      bl.onclick = () => {
        blockPlayer(name);
      };
    };
  };
};

const getClock = () => {
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth();
  var hour = date.getHours();
  var minute = date.getMinutes()
  var second = date.getSeconds();

  hour = (hour < 10) ? "0" + hour : hour;
  minute = (minute < 10) ? "0" + minute : minute;
  second = (second < 10) ? "0" + second : second;
  return `${day}/${month} ${hour}:${minute}:${second}`;
}

Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
let onMessageReceived = msg => {
  let a = Game.currentGame.ui.getComponent("Chat"),
    b = window.filterXSS(msg.displayName),
    c = window.filterXSS(msg.message)
  if (blockedNames.includes(b) || window.chatDisabled) {
    return;
  };
  let d = a.ui.createElement(`<div class="hud-chat-message"><strong><a>🟢 </a>${b}</strong><small> at ${getClock()}</small>: ${c}</div>`);
  a.messagesElem.appendChild(d);
  a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
  a.messagesElem.lastChild.childNodes[0].childNodes[0].onclick = () => {
    blockPlayer(b)
  }
}
Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);

let goToPosInterval;
let moveTimeout;
let canMoveRandomly = true;
let triedDirections = []; // Keep track of attempted directions

function calculateDirection(x, y) {
  const myX = Math.round(game.ui.playerTick.position.x);
  const myY = Math.round(game.ui.playerTick.position.y);

  // Calculate the difference between current position and destination
  const xDiff = x - myX;
  const yDiff = y - myY;

  // Determine the direction based on the coordinate differences
  if (xDiff === 0 && yDiff === 0) {
    return -1; // No movement needed
  } else if (xDiff > 0 && yDiff === 0) {
    return 1; // Right
  } else if (xDiff < 0 && yDiff === 0) {
    return 0; // Left
  } else if (xDiff === 0 && yDiff > 0) {
    return 3; // Down
  } else if (xDiff === 0 && yDiff < 0) {
    return 2; // Up
  } else if (xDiff > 0 && yDiff > 0) {
    return 7; // Down-right
  } else if (xDiff > 0 && yDiff < 0) {
    return 6; // Up-right
  } else if (xDiff < 0 && yDiff > 0) {
    return 5; // Down-left
  } else if (xDiff < 0 && yDiff < 0) {
    return 4; // Up-left
  } else {
    return -1; // Unknown direction
  }
}

function goToPos(x, y) {
  clearInterval(goToPosInterval);
  goToPosInterval = setInterval(() => {
    const myX = Math.round(game.ui.playerTick.position.x);
    const myY = Math.round(game.ui.playerTick.position.y);
    const offset = document.getElementById("offset").value;

      if (-myX + x > offset) game.network.sendInput({
        left: 0
      });
      else game.network.sendInput({
        left: 1
      });
      if (myX - x > offset) game.network.sendInput({
        right: 0
      });
      else game.network.sendInput({
        right: 1
      });
      if (-myY + y > offset) game.network.sendInput({
        up: 0
      });
      else game.network.sendInput({
        up: 1
      });
      if (myY - y > offset) game.network.sendInput({
        down: 0
      });
      else game.network.sendInput({
        down: 1
      });

    if (-myX + x < offset && myX - x < offset && -myY + y < offset && myY - y < offset) {
      game.ui.getComponent('PopupOverlay').showHint('Finished moving!', 10000);
      clearInterval(goToPosInterval);
      clearTimeout(moveTimeout);
    }
  });

  moveTimeout = setTimeout(() => {
    clearInterval(goToPosInterval);
    game.ui.getComponent('PopupOverlay').showHint('It has been 4 minutes to move to the position on the map, so it has automatically stopped to prevent infinite loops.', 8000);
    game.network.sendInput({
      left: 0,
      right: 0,
      up: 0,
      down: 0
    });
  }, 240000);
}

function lockposition(x, y) {
  clearInterval(goToPosInterval);
  goToPosInterval = setInterval(() => {
    let myX = Math.round(game.ui.playerTick.position.x);
    let myY = Math.round(game.ui.playerTick.position.y);

    let offset = document.getElementById("offset").value;

    if (-myX + x > offset) game.network.sendInput({
      left: 0
    });
    else game.network.sendInput({
      left: 1
    });
    if (myX - x > offset) game.network.sendInput({
      right: 0
    });
    else game.network.sendInput({
      right: 1
    });

    if (-myY + y > offset) game.network.sendInput({
      up: 0
    });
    else game.network.sendInput({
      up: 1
    });
    if (myY - y > offset) game.network.sendInput({
      down: 0
    });
    else game.network.sendInput({
      down: 1
    });

    if (-myX + x < offset && myX - x < offset && -myY + y < offset && myY - y < offset) {
      game.ui.getComponent('PopupOverlay').showHint('Locked position', 1e4);
    }
  })
}

let maintainDistanceInterval;

function maintainDistanceFromPos(x, y) {
    clearInterval(maintainDistanceInterval);
    maintainDistanceInterval = setInterval(() => {
        const myX = Math.round(game.ui.playerTick.position.x);
        const myY = Math.round(game.ui.playerTick.position.y);
        const offset = document.getElementById("offset").value;

        let distance = calculateDistance(myX, myY, x, y);

        if (distance > 550 + offset/2) {
            if (-myX + x > offset) game.network.sendInput({ left: 0 });
    else game.network.sendInput({ left: 1 });

    if (myX - x > offset) game.network.sendInput({ right: 0 });
    else game.network.sendInput({ right: 1 });

    if (-myY + y > offset) game.network.sendInput({ up: 0 });
    else game.network.sendInput({ up: 1 });

    if (myY - y > offset) game.network.sendInput({ down: 0 });
    else game.network.sendInput({ down: 1 });

        } else if (distance < 550 - offset/2) {
            // Move away from the target
            if (-myX + x > offset) game.network.sendInput({ left: 1 });
    else game.network.sendInput({ left: 0 });

    if (myX - x > offset) game.network.sendInput({ right: 1 });
    else game.network.sendInput({ right: 0 });

    if (-myY + y > offset) game.network.sendInput({ up: 1 });
    else game.network.sendInput({ up: 0 });

    if (myY - y > offset) game.network.sendInput({ down: 1 });
    else game.network.sendInput({ down: 0 });
        } else {
            // Stop moving
            game.network.sendInput({ left: 0, right: 0, up: 0, down: 0 });
        }
    });
}

let mapContainer = document.createElement('div');
mapContainer.id = "hud-map-container";
document.querySelector('.hud-bottom-left').append(mapContainer);
$('#hud-map').appendTo(document.querySelector('#hud-map-container'));

document.querySelector("#hud-map-container").addEventListener('click', (e) => {
  let offset = $('#hud-map-container').offset();
  let mapMouseX = e.pageX - offset.left;
  let mapMouseY = e.pageY - offset.top;
  game.ui.getComponent('PopupOverlay').showConfirmation(`Are you sure you want to move to X: ${Math.round(mapMouseX * 171.42857142857)}, Y: ${Math.round(mapMouseY * 171.42857142857)}? You can right-click the minimap to cancel.`, 7500, () => {
    game.ui.getComponent('PopupOverlay').showHint('Starting MapMove...', 4000);
    goToPos(mapMouseX * 171.42857142857, mapMouseY * 171.42857142857);
  }, () => {
    game.ui.getComponent('PopupOverlay').showHint('OK, did not start MapMove', 4000);
  });
});

document.querySelector('#hud-map-container').addEventListener('contextmenu', () => {
  game.ui.getComponent('PopupOverlay').showConfirmation('Are you sure you want to cancel the current MapMove process?', 7500, () => {
    clearInterval(goToPosInterval);
    clearTimeout(moveTimeout);
    game.network.sendInput({
      left: 0,
      right: 0,
      up: 0,
      down: 0
    });
    game.ui.getComponent('PopupOverlay').showHint('Successfully stopped MapMover.', 4000);
  }, () => {
    game.ui.getComponent('PopupOverlay').showHint('OK, did not stop MapMover.', 4000);
  });
});

document.querySelector("#hud-map-container").addEventListener('mousedown', (e) => {
  if (e.button === 1) {
    lockposition(Math.round(game.ui.playerTick.position.x), Math.round(game.ui.playerTick.position.y))
  }
});

let markerIds = 0; // Initialize marker IDs
let maxMarkers = 69420; // Maximum number of markers
let markers = []; // Array to store marker positions and IDs
let goToMarkerInterval;
let repeatingMoveInterval;
let currentIndex = 0; // Initialize current marker index
let markermoveTimeout;

function addMarker(x, y) {
  if (markerIds >= maxMarkers) {
    // Max number of markers reached, show a pop-up
    game.ui.getComponent('PopupOverlay').showHint('Max number of markers reached.', 1500);
  } else {
    markerIds++;
    // Add marker to the array with its position and ID
    markers.push({
      id: markerIds,
      x,
      y
    });

    var map = document.getElementById("hud-map");
    // Add a specific class to markers created by !marker and include their IDs
    map.insertAdjacentHTML("beforeend", `<div data-marker-id="${markerIds}" style="color: red; display: block; left: ${x}px; top: ${y}px; position: absolute;" class='hud-map-player marker-placed-by-command'></div>`);
    game.ui.getComponent('PopupOverlay').showHint(`Added Marker ${markerIds}`, 1500);
  }
}

function resetMarkerIds() {
  markerIds = 0;
  markers = [];

  // Show a hint that marker IDs were reset
  game.ui.getComponent('PopupOverlay').showHint('Marker IDs reset.', 1500);
}

function moveToNextMarker() {
  if (markers.length === 0) {
    game.ui.getComponent('PopupOverlay').showHint('No markers placed.', 1500);
    return;
  }

  // Move to the next marker in a circular manner
  currentIndex = (currentIndex + 1) % markers.length;

  const marker = markers[currentIndex];

  if (marker) {
    goToMarkerPos(marker.x, marker.y);
  }
}

function startRepeatingMove() {
  if (markers.length === 0) {
    game.ui.getComponent('PopupOverlay').showHint('No markers placed.', 1500);
    return;
  }

  repeatingMoveInterval = setInterval(() => {
    moveToNextMarker();
  }, 100);
}

function stopRepeatingMove() {
  clearInterval(goToMarkerInterval);
  clearTimeout(markermoveTimeout);
  game.network.sendInput({
    left: 0,
    right: 0,
    up: 0,
    down: 0
  });
  game.ui.getComponent('PopupOverlay').showHint('Successfully stopped MapMover.', 4000);
}

// Handle the "markermove" command
function handleMarkerMove() {
  // Stop any ongoing repeating move process
  stopRepeatingMove();

  // Move to the first marker immediately
  currentIndex = 0;
  moveToNextMarker();
}

function goToMarkerPos(x, y) {
  clearInterval(goToMarkerInterval);
  goToMarkerInterval = setInterval(() => {
    let myX = Math.round(game.ui.playerTick.position.x);
    let myY = Math.round(game.ui.playerTick.position.y);

    let offset = document.getElementById("offset").value;

    if (-myX + x > offset) game.network.sendInput({
      left: 0
    });
    else game.network.sendInput({
      left: 1
    });
    if (myX - x > offset) game.network.sendInput({
      right: 0
    });
    else game.network.sendInput({
      right: 1
    });

    if (-myY + y > offset) game.network.sendInput({
      up: 0
    });
    else game.network.sendInput({
      up: 1
    });
    if (myY - y > offset) game.network.sendInput({
      down: 0
    });
    else game.network.sendInput({
      down: 1
    });

    if (-myX + x < offset && myX - x < offset && -myY + y < offset && myY - y < offset) {
      game.ui.getComponent('PopupOverlay').showHint('Finished moving!', 1e4);
      clearInterval(goToMarkerInterval);

      // Wait for 1 second before moving to the next marker
      markermoveTimeout = setTimeout(() => {
        moveToNextMarker();
      }, 100);
    }
  });
}
let movePositions = [{
    x: 1200,
    y: 1200
  },
  {
    x: 22800,
    y: 1200
  },
  {
    x: 22800,
    y: 2400
  },
  {
    x: 1200,
    y: 2400
  },
  {
    x: 1200,
    y: 3600
  },
  {
    x: 22800,
    y: 3600
  },
  {
    x: 22800,
    y: 4800
  },
  {
    x: 1200,
    y: 4800
  },
  {
    x: 1200,
    y: 6000
  },
  {
    x: 22800,
    y: 6000
  },
  {
    x: 22800,
    y: 7200
  },
  {
    x: 1200,
    y: 7200
  },
  {
    x: 1200,
    y: 8400
  },
  {
    x: 22800,
    y: 8400
  },
  {
    x: 22800,
    y: 9600
  },
  {
    x: 1200,
    y: 9600
  },
  {
    x: 1200,
    y: 10800
  },
  {
    x: 22800,
    y: 10800
  },
  {
    x: 22800,
    y: 12000
  },
  {
    x: 1200,
    y: 12000
  },
  {
    x: 1200,
    y: 13200
  },
  {
    x: 22800,
    y: 13200
  },
  {
    x: 22800,
    y: 14400
  },
  {
    x: 1200,
    y: 14400
  },
  {
    x: 1200,
    y: 15600
  },
  {
    x: 22800,
    y: 15600
  },
  {
    x: 22800,
    y: 16800
  },
  {
    x: 1200,
    y: 16800
  },
  {
    x: 1200,
    y: 18000
  },
  {
    x: 22800,
    y: 18000
  },
  {
    x: 22800,
    y: 19200
  },
  {
    x: 1200,
    y: 19200
  },
  {
    x: 1200,
    y: 20400
  },
  {
    x: 22800,
    y: 20400
  },
  {
    x: 22800,
    y: 21600
  },
  {
    x: 1200,
    y: 21600
  },
  {
    x: 1200,
    y: 22800
  },
  {
    x: 22800,
    y: 22800
  }
];

let currentPositionIndex = 0;

// Handle the "scanposition" command
function handleScanPosition() {
  // Stop any ongoing repeating move process
  stopRepeatingMove();

  // Move to the first position immediately
  currentPositionIndex = 0;
  moveToNextPosition();
}

function moveToNextPosition() {
  if (currentPositionIndex >= movePositions.length) {
    game.ui.getComponent('PopupOverlay').showHint('Scanning positions completed.', 1500);
    return;
  }

  const position = movePositions[currentPositionIndex];
  goToPosition(position.x, position.y);
  currentPositionIndex++;
}

function goToPosition(x, y) {
  clearInterval(goToMarkerInterval);
  goToMarkerInterval = setInterval(() => {
    const myX = Math.round(game.ui.playerTick.position.x);
    const myY = Math.round(game.ui.playerTick.position.y);
    const offset = document.getElementById("offset").value;
    const coords1secondago = getCoordinatesOneSecondAgo()
    const distanceDifference = Math.round(calculateDistance(myX, myY, coords1secondago.x, coords1secondago.y));

    if (distanceDifference < 30) {
      // If the distance is not changing, move in a random direction (if allowed)
      if (canMoveRandomly) {
        canMoveRandomly = false; // Prevent further random movement until timer expires

        // Get the direction based on the current position and destination
        const destinationDirection = calculateDirection(x, y);
        const oppdestinationDirection = -calculateDirection(x, y);

        // Define all possible directions
        const allDirections = [0, 1, 2, 3, 4, 5, 6, 7];

        // Filter out directions that have already been tried or are the same as the destination direction
        const availableDirections = allDirections.filter(
          dir => !triedDirections.includes(dir) && dir !== destinationDirection && dir !== oppdestinationDirection
        );

        let randomDirection;

        if (availableDirections.length === 0) {
          // All directions have been tried, reset and try again
          triedDirections = [];
          randomDirection = Math.floor(Math.random() * 8); // Random direction
        } else {
          // Choose a random direction from the available directions
          randomDirection = availableDirections[Math.floor(Math.random() * availableDirections.length)];
        }

        // Store the selected direction in the list of tried directions
        triedDirections.push(randomDirection);

        // Clear all inputs first
        game.network.sendInput({
          left: 0,
          right: 0,
          up: 0,
          down: 0
        });

        // Translate the random direction to input values
        if (randomDirection === 0) {
          game.network.sendInput({
            left: 1
          });
        } else if (randomDirection === 1) {
          game.network.sendInput({
            right: 1
          });
        } else if (randomDirection === 2) {
          game.network.sendInput({
            up: 1
          });
        } else if (randomDirection === 3) {
          game.network.sendInput({
            down: 1
          });
        } else if (randomDirection === 4) {
          game.network.sendInput({
            left: 1,
            up: 1
          });
        } else if (randomDirection === 5) {
          game.network.sendInput({
            left: 1,
            down: 1
          });
        } else if (randomDirection === 6) {
          game.network.sendInput({
            right: 1,
            up: 1
          });
        } else if (randomDirection === 7) {
          game.network.sendInput({
            right: 1,
            down: 1
          });
        }

        // After 5 seconds, stop the random movement and reset the flag
        setTimeout(() => {
          game.network.sendInput({
            left: 0,
            right: 0,
            up: 0,
            down: 0
          });
          canMoveRandomly = true;
        }, 5000);
      }
    }
    if (canMoveRandomly) {
      // Continue with the original movement logic
      if (-myX + x > offset) game.network.sendInput({
        left: 0
      });
      else game.network.sendInput({
        left: 1
      });
      if (myX - x > offset) game.network.sendInput({
        right: 0
      });
      else game.network.sendInput({
        right: 1
      });
      if (-myY + y > offset) game.network.sendInput({
        up: 0
      });
      else game.network.sendInput({
        up: 1
      });
      if (myY - y > offset) game.network.sendInput({
        down: 0
      });
      else game.network.sendInput({
        down: 1
      });
    }

    if (distanceDifference < 30) {
      game.ui.getComponent('PopupOverlay').showHint('Stuck, taking a random step!', 5000);
    }

    if (-myX + x < offset && myX - x < offset && -myY + y < offset && myY - y < offset) {
      game.ui.getComponent('PopupOverlay').showHint('Reached destination!', 1000);
      clearInterval(goToMarkerInterval);

      // Wait for 1 second before moving to the next position
      setTimeout(() => {
        moveToNextPosition();
      }, 100);
    }
  }, 10);
}

const minimap = document.getElementById("hud-map");
let lastPlayerTickDead = 0;
let showBuildings = true;

const isBuildingOffset = offset => (offset % 48) ? ~~(0 <= (offset % 200) && (offset % 200) <= 16) : ~~(0 <= (offset % 200) && (offset % 200) <= 40);

const isInRange = (p1, p2) => {
  const deltaX = ~~(p2.x / 200) - ~~(p1.x / 200);
  const deltaY = ~~(p2.y / 200) - (~~((p1.y + 100) / 200) - 0.5);
  return -5 <= deltaX && -3.5 <= deltaY && deltaX <= 5 + isBuildingOffset(p2.x) && deltaY <= 3.5 + isBuildingOffset(p2.y);
};

game.world.removeEntity2 = game.world.removeEntity;
game.world.removeEntity = uid => {
  if (!game.world.entities[uid]) return;
  const model = game.world.entities[uid].targetTick.model;
  const pp = game.ui.playerTick.position;
  const ep = game.world.entities[uid].targetTick.position;

  if (["Tree", "Stone", "NeutralCamp"].includes(model) && !game.world.replicator.currentTick.entities[uid]) {
    if (game.world.entities[uid].node.alpha != 0.5) game.world.entities[uid].setAlpha(0.5);
    return;
  };
  if (["Wall", "Door", "SlowTrap", "ArrowTower", "BombTower", "MagicTower", "ResourceHarvester", "CannonTower", "MeleeTower", "GoldMine", "Harvester"].includes(model)) {
    if (!isInRange(pp, ep) && !game.world.replicator.currentTick.entities[uid]) {
      if (game.world.entities[uid].node.alpha != 0.5) game.world.entities[uid].setAlpha(0.5);
      return;
    }
  };
  game.world.removeEntity2(uid);
};

game.world.createEntity2 = game.world.createEntity;
game.world.createEntity = entity => {
  if (["Tree", "Stone", "NeutralCamp"].includes(entity.model)) {
    const entityDiv = document.createElement("div");
    entityDiv.classList.add("hud-map-building"); // Common class for styling
    if (entity.model === "Tree" || entity.model === "Stone" || entity.model === "NeutralCamp") {
      entityDiv.classList.add("colorful-dot"); // Separate class for deleting
    }

    entityDiv.style.background = ({
      Tree: "green",
      Stone: "grey",
      NeutralCamp: "red"
    })[entity.model];
    entityDiv.style.left = `${entity.position.x / 24000 * 100}%`;
    entityDiv.style.top = `${entity.position.y / 24000 * 100}%`;
    entityDiv.style.display = showBuildings ? "block" : "none"; // Set initial visibility
    minimap.appendChild(entityDiv);
  }
  game.world.createEntity2(entity);
};

function toggleEnvironmentVisibility() {
  showBuildings = !showBuildings;

  const colorfulDotElements = document.querySelectorAll(".colorful-dot");
  colorfulDotElements.forEach((element) => {
    element.style.display = showBuildings ? "block" : "none";
  });
};

game.network.sendRpc = (e) => {
  if (e.name === "SendChatMessage") {
    e.message = evadeFilter(e.message);
  }
  game.network.sendRpc2(e);
};

let filterTargets = [
  /m[o0u]th(?:er|a)f+u+c+k+[e3]r/gi, /m[o0u]th(?:er|a)f+u+c+k+/gi, /f+[\s\d_\^\+\=\*\.\-,:"'>|\/\\]{0,42}u+[\s\d_\^\+\=\*\.\-,:"'>|\/\\]{0,42}c+[\s\d_\^\+\=\*\.\-,:"'>|\/\\]{0,42}k+/gi,
  /c+[o0]+c+k+s+u+c+k+[e3]+r+/gi, /c+[o0]+c+k+s+u+c+k+/gi,
  /[a@][s\$][s\$]h[o0]l[e3][s\$]/gi, /[a@][s\$][s\$]h[o0]+l[e3]/gi, /(\b|^|[^glmp])[a@][s\$][s\$][e3][s\$](?:\b|$)/gi, /\b(dumb)[a@][s\$][s\$]+/gi, /(\b|^|\s|[^bcglmprstvu])[a@][\s\d_\^\+\=\*\.\-,:"'>|\/\\]{0,42}[s\$][\s\d_\^\+\=\*\.\-,:"'>|\/\\]{0,42}[s\$]+(?:\b|$)/gi,
  /\bt[i1]tt[i1]e[s\$]/gi, /\bt[i1]tt[i1]e/gi, /\bt[i1]tty/gi, /\bt+[\s_\^\+\=\*\.\-,:"'>|\/\\]{0,42}[i1]+[\s_\^\+\=\*\.\-,:"'>|\/\\]{0,42}t+[\s_\^\+\=\*\.\-,:"'>|\/\\]{0,42}[s\$]+/gi, /\bt+[i1]+t([^ahilmrtu])/gi,
  /p[i1]+ss+(?!ant)/gi,
  /d[i1]+c+k+(?!e|i)/gi,
  /(\b|[^s])c+[\s_\^\+\=\*\.\-,:"'>|\/\\]{0,42}u+[\s_\^\+\=\*\.\-,:"'>|\/\\]{0,42}n+[\s_\^\+\=\*\.\-,:"'>|\/\\]{0,42}t/gi,
  /\bb[a@]+st[a@]+r+d(?!ise|ize)/gi,
  /b+[\s_\^\+\=\*\.\-,:"'>|\/\\]{0,42}[i1]+[\s_\^\+\=\*\.\-,:"'>|\/\\]{0,42}t[\s_\^\+\=\*\.\-,:"'>|\/\\]{0,42}c[\s_\^\+\=\*\.\-,:"'>|\/\\]{0,42}h/gi,
  /n+[i1]+gg+[a@]+[s\$z]+/gi, /n+[i1]+gg+e+r+[s\$z]+/gi, /n+[\W023456789_]{0,42}[i1]+[\W023456789_]{0,42}g[\W\d_]{0,42}g+[\W\d_]{0,42}[a@]+(?!rd)/gi, /(\b|^|[^s])n+[\W02-9_]{0,42}[i1]+[\W02-9_]{0,42}g[\W\d_]{0,42}g+[\W0-24-9_]{0,42}[e3]+[\W0-24-9_]{0,42}r+/gi, /m+[i1]+gg+[e3]+r+/gi, /y+[i1]+gg+[e3]+r+/gi,
  /d+[a@]+r+k+[i1]+[e3]+s+/gi, /d+[\W\d_]{0,42}[a@]+[\W\d_]{0,42}r+[\W\d_]{0,42}k+[\W02-9_]{0,42}[i1]+[\W024-9_]{0,42}[e3]+/gi,
  /[s$z]+h+v+[a@]+t+[s$z]+[a@]+[s$z]+/gi, /[s$z]+h+v+[a@]+t+[s$z]+[a@]+/gi,
  /(\b|^)[s$]+p+[i1]+c+k{0,32}[s$]+/gi, /(\b|^)[s$]+[\W\d_]{0,42}p+[\W02-9_]{0,42}[i1]+[\W02-9_]{0,42}c+(\b|$)/gi,
  /w+[e3]+t+b+[a@]+c+k+[s$z]+/gi, /w+[e3]+t+b+[a@]+c+k+/gi,
  /k+[i1]+k+[e3]+[s$z]+/gi, /k+[\W02-9_]{0,42}[i1]+[\W02-9_]{0,42}k+[\W0124-9_]{0,42}[e3]+(\b|$)/gi,
  /g+[\W1-9_]{0,42}[o0][\W1-9_]{0,42}[o0]+[\W1-9_]{0,42}k+[\W\d_]{0,42}[s$]+/gi, /(\b|^)g+[\W1-9_]{0,42}[o0][\W1-9_]{0,42}[o0]+[\W1-9_]{0,42}k+(?!y)/gi,
  /r+[a@]+g+[\W\d_]{0,42}h+[e3]+[a@]+d+[s$]+/gi, /r+[\W\d_]{0,42}[a@]+[\W\d_]{0,42}g+[\W\d_]{0,42}h+[\W0-24-9_]{0,42}[e3]+[\W0-24-9_]{0,42}[a@]+[\W\d_]{0,42}d+/gi,
  /t+[o0]+w+[e3]+[l1]+[\W02-9_]{0,42}h+[e3]+[a@]+d+[s$]+/gi, /t+[\W1-9_]{0,42}[o0]+[\W1-9_]{0,42}w+[\W0-24-9_]{0,42}[e3]+[\W024-9_]{0,42}[l1]+[\W02-9_]{0,42}h+[\W0-24-9_]{0,42}[e3]+[\W0-24-9_]{0,42}[a@]+[\W\d_]{0,42}d+/gi,
  /[i1]+n+j+u+n+[s$]+/gi, /[i1]+[\W02-9_]{0,42}n+[\W\d_]{0,42}j+[\W\d_]{0,42}u+[\W\d_]{0,42}n+(\b|$)/gi,
  /(\b|^)[s$]+q+u+[a@]+w+s+/gi, /(\b|^)[s$]+q+u+[a@]+w+(\b|$)/gi,
  /g[o0][l1][l1][i1y]w[o0]g+[s$]/gi, /g[o0][l1][l1][i1y]w[o0]g+/gi, /w+[\W1-9_]{0,42}[o0]+[\W1-9_]{0,42}g+[\W\d_]{0,42}[s$]+/gi, /(\b|^)w+[\W1-9_]{0,42}[o0]+[\W1-9_]{0,42}g+(\b|$)/gi,
  /[ck][a@]ffr[e3][s$z]/gi, /[ck][\W\d_]{0,42}[a@][\W\d_]{0,42}f[\W\d_]{0,42}f[\W\d_]{0,42}r[\W0-24-9_]{0,42}[e3]/gi,
  /[ck][a@]ff[ie3]r[s$z]/gi, /[ck]+[\W\d_]{0,42}[a@]+[\W\d_]{0,42}(?:f[\W024-9_]{0,42})+[i1e3]+[\W024-9_]{0,42}r+/gi,
  /[s$]h[i1]t[s$]k[i1]n[s$]/gi, /[s$]h[i1]t[s$]k[i1]n/gi, /[s$]+[\s\d_\^\+\=\*\.\-,:"'>|\/\\]{0,42}h+[\s\d_\^\+\=\*\.\-,:"'>|\/\\]{0,42}[i1]+[\s023456789_\^\+\=\*\.\-,:"'>|\/\\]{0,42}t+(?!ake)/gi,
  /[l1][a@]tr[i1]n[o0][s$z]/gi, /[l1][a@]tr[i1]n[o0]/gi,
  /ch[i1]nk[e3]rb[e3][l1][l1]+/gi,
  /[s$]hv[o0][o0]g[a@][s$]/gi, /[s$]hv[o0][o0]g[a@]/gi,
  /n[e3]gr[e3][s$z][s$z]+/gi,
  /[s$][a@]mb[o0][e3]*[s$]/gi, /[s$][\W\d_]{0,42}[a@][\W\d_]{0,42}m[\W\d_]{0,42}b[\W1-9_]{0,42}[o0]/gi,
];
const insert = (string, index, replacement) => {
  return string.substring(0, index) + replacement + string.substring(index + 1);
};
const replace = (string, index, replacement) => {
  return string.substring(0, index) + replacement;
};

const evadeFilter = str => {
  let newStr = str;
  let shouldCheck = true;
  while (shouldCheck) {
    filterTargets.forEach(target => {
      let array;
      let indices = [];
      while ((array = target.exec(newStr)) !== null) {
        indices.unshift(array.index);
      };
      indices.forEach((index, i) => {
        let subStr = newStr.substring(index);
        for (let j = 0; j < subStr.length; j++) {
          if (subStr[j].search(/[a-zA-Z@$]/) != -1) {
            let attempt = insert(subStr, j, '&#' + `${subStr.charCodeAt(j)}` + ((j < subStr.length - 1) ? (!isNaN(subStr[j + 1]) ? ';' : '') : ''));
            if (attempt.search(target) == -1) {
              newStr = replace(newStr, index, attempt);
              break;
            };
          };
          if (j == subStr.length - 1) {
            let replacement = subStr;
            for (let k = target.exec(subStr)[0].length - 1; k >= 0; k--) {
              if (subStr[k].search(/[a-zA-Z@$]/) != -1) {
                replacement = insert(replacement, k, '&#' + `${subStr.charCodeAt(k)}` + ((k < subStr.length - 1) ? (!isNaN(subStr[k + 1]) ? ';' : '') : ''));
                if (replacement.search(target) == -1) {
                  newStr = replace(newStr, index, replacement);
                  break;
                };
              };
            };
            break;
          };
        };
      });
    });
    for (let i in filterTargets) {
      if (newStr.search(filterTargets[i]) != -1) break;
      else if (i == filterTargets.length - 1) shouldCheck = false;
    };
  };
  return newStr;
}

const styles = `
#custom-sidebar {
    width: 500px; /* Set the width as per your requirement */
    height: 500px; /* Set the height as per your requirement */
    background-color: rgba(17, 17, 17, 0.7); /* 70% transparent black */
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
    padding: 25px;
    text-align: center;
    border-radius: inherit;
    overflow: auto;
    z-index: 999; /* Ensure it's above other elements */
}
#custom-content {
    color: whitesmoke;
    height: 100%;
    width: 100%;
    border-radius: inherit;
    overflow: auto;
}
button {
    cursor: pointer;
}
`;

document.body.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

const customSidebar = document.createElement("div");
customSidebar.id = "custom-sidebar";

const customContent = document.createElement("div");
customContent.id = "custom-content";

document.body.appendChild(customSidebar);
customSidebar.appendChild(customContent);

// Buttons at the start
const initialHTML = `
<h1>WebSockets</h1>
<input class="btn" type="text" id="wsName" placeholder="WebSocket name..." maxlength=29 />
<button class="btn" onclick="window.sendWS();">Send WS</button>
<hr />
<button class="btn btn-red" onclick="window.rmWS();">Remove Last WS</button>
<button class="btn btn-red" onclick="window.rmAllWS();">Remove All WS</button>
<br>
<input class="btn" type="text" id="lockedx" placeholder="x" maxlength=5/>
<input class="btn" type="text" id="lockedy" placeholder="y" maxlength=5/>
<button class="btn btn-red" id="locktoggle" onclick="window.toggleLockAlts();">Lock Alts</button>
<button class="btn btn-red" onclick="window.joinParty();">Alts Join</button>
<button class="btn btn-red" onclick="window.leaveParty();">Alts Leave</button>
<button class="btn btn-red" id="aitotoggle" onclick="window.toggleAito();">Start Aito</button>
`;

customContent.innerHTML = initialHTML;
customSidebar.style.display = "none"

// Function to toggle visibility and position of the custom sidebar
function toggleCustomSidebar() {
    customSidebar.style.display = (customSidebar.style.display === "none") ? "block" : "none";
}

// Event listener to toggle the custom sidebar on backslash key press
document.addEventListener("keyup", e => {
    if (e.key === "\\") {
        toggleCustomSidebar();
    }
});

const webSockets = {};
let wsId = 0;
let wsIndex = 0;

window.sendWS = () => {
    let iframe = document.createElement('iframe');
    iframe.src = 'https://zombs.io';
    iframe.style.display = 'none';
    document.body.append(iframe);

    let iframeWindow = iframe.contentWindow;
    iframe.addEventListener("load", () => {
        let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
        iframeWindow.game.network.connectionOptions = connectionOptions;
        iframeWindow.game.network.connected = true;

        let ws = new WebSocket(`wss://${connectionOptions.hostname}:${connectionOptions.port}`);
        ws.binaryType = 'arraybuffer';

        ws.onopen = (data) => {
            ws.network = new game.networkType();

            ws.network.sendPacket = (_event, _data) => {
                ws.send(ws.network.codec.encode(_event, _data));
            };

            ws.playerTick = {};

            ws.onRpc = (data) => {
                switch(data.name){
                    case 'Dead':
                        ws.network.sendPacket(3, { respawn: 1 });
                        break;
                    case 'ReceiveChatMessage':
                        if(data.response.uid == game.world.myUid) {
                            if(data.response.message.toLowerCase() == `!${ws.wsId}`) {
                                ws.hit = 0;
                            };
                            if(data.response.message.toLowerCase() == `${ws.wsId}`) {
                                ws.space = 0;
                            };
                        };
                        break;
                };
            };

            ws.gameUpdate = () => {
                if(ws.hit < 12) {
                    ws.hit++;
                };
                if([3, 9].includes(ws.hit)) {
                    ws.network.sendPacket(3, { space: 1 });
                } else if([6, 12].includes(ws.hit)) {
                    ws.network.sendPacket(3, { space: 0 });
                };
                if(ws.space < 6) {
                    ws.space++;
                };
                if(ws.space == 3) {
                    ws.network.sendPacket(3, { space: 1 });
                };
                if(ws.space == 6) {
                    ws.network.sendPacket(3, { space: 0 });
                };
                ws.moveToward = (x, y) => {
                    let roundedX = Math.round(x);
                    let roundedY = Math.round(y)
                    let myX = Math.round(ws.playerTick.position.x);
                    let myY = Math.round(ws.playerTick.position.y);

                    let offset = 10;

                    if (-myX + roundedX > offset) ws.network.sendInput({ left: 0 }); else ws.network.sendInput({ left: 1 });
                    if (myX - roundedX > offset) ws.network.sendInput({ right: 0 }); else ws.network.sendInput({ right: 1 });

                    if (-myY + roundedY > offset) ws.network.sendInput({ up: 0 }); else ws.network.sendInput({ up: 1 });
                    if (myY - roundedY > offset) ws.network.sendInput({ down: 0 }); else ws.network.sendInput({ down: 1 });
                };
                if (!altsLocked) {
                    var mousePos = game.renderer.screenToWorld(game.inputManager.mousePosition.x, game.inputManager.mousePosition.y)
                    ws.moveToward(mousePos.x, mousePos.y);
                }
                if (altsLocked) {
                    ws.moveToward(document.getElementById("lockedx").value, document.getElementById("lockedy").value);
                }
            };

            ws.onmessage = msg => {
                if (new Uint8Array(msg.data)[0] == 5){
                    game.network.codec.decodePreEnterWorldResponse = buffer => buffer;

                    let data = iframeWindow.game.network.codec.decodePreEnterWorldResponse(game.network.codec.decode(msg.data));

                    ws.send(ws.network.codec.encode(4, { displayName: document.getElementById("wsName").value, extra: data.extra}));

                    ws.followMouse && ws.network.sendPacket(3, game.network.lastPacketInput);
                    return;
                };

                ws.data = ws.network.codec.decode(msg.data);
                switch(ws.data.opcode) {
                    case 0:
                        for(let i in ws.data.entities[ws.playerTick.uid]) {
                            ws.playerTick[i] = ws.data.entities[ws.playerTick.uid][i];
                        };

                        ws.gameUpdate();
                        break;
                    case 4:
                        ws.send(iframeWindow.game.network.codec.encode(6, {}));
                        iframe.remove();

                        ws.playerTick.uid = ws.data.uid;

                        ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey});

                        wsId++;
                        wsIndex = wsId;
                        webSockets[wsId] = ws;
                        ws.wsId = wsId;

                        ws.followMouse = true;
                        break;
                    case 9:
                        ws.onRpc(ws.data);
                        break;
                }
            }

            ws.onclose = e => {
                iframe.remove();
                delete webSockets[ws.wsId];
            };
        };
    });
};

const checkWS = () => {
    if(Object.keys(webSockets).length < 1) { wsId = 0; wsIndex = 0; };
};

window.rmWS = () => {
    let deletionId = wsIndex;
    if(!webSockets[wsIndex]) {
        deletionId = Math.max([ wsIndex, ...Object.keys(webSockets).map(parseInt) ]);
    };
    webSockets[deletionId].close();
    delete webSockets[deletionId];
    wsIndex--;
    checkWS();
};

window.rmAllWS = () => {
    for(let id in webSockets) {
        webSockets[id].close();
    };
    webSockets = {};
    checkWS();
};

let wsPosElems = {};


game.network.oldSendRpc = game.network.sendRpc;

game.network.sendRpc = m => {
    if(m.name == "EquipItem") {
        for(let id in webSockets) {
            const ws = webSockets[id];
            ws.network.sendPacket(9, { name: "BuyItem", itemName: m.itemName, tier: m.tier });
            ws.network.sendPacket(9, m);
        };
    };
    game.network.oldSendRpc(m);
};

game.network.oldSendInput = game.network.sendInput;

game.network.sendInput = m => {
    for(let id in webSockets) {
        const ws = webSockets[id];
            ws.network.sendPacket(3, m);
    };
    game.network.oldSendInput(m);
};

window.leaveParty = () => {
    for (let id in webSockets) {
       webSockets[id].network.sendPacket(9, { name: "LeaveParty" });
    }
}

window.joinParty = () => {
    for (let id in webSockets) {
        webSockets[id].network.sendRpc({
            name: "JoinPartyByShareKey",
            partyShareKey: game.ui.playerPartyShareKey
        });
    }
}

let aitoEnabled = false;
let currentWebSocketIndex = 0;
let canPerformNightActions = true;
let goldCheckInterval; // Declare the variable for the gold-checking interval
let selectedWebSocket; // Declare the variable for the selected WebSocket

// Function to find the next WebSocket id in order
function findNextWebSocketId() {
    const webSocketIds = Object.keys(webSockets);
    const numWebSockets = webSocketIds.length;

    if (numWebSockets === 0) {
        return null; // No websockets available
    }

    // Get the next WebSocket id in order
    const selectedWebSocketId = webSocketIds[currentWebSocketIndex];

    // Update the current index for the next night
    currentWebSocketIndex = (currentWebSocketIndex + 1) % numWebSockets;

    return selectedWebSocketId;
}

window.toggleAito = () => {
    aitoEnabled = !aitoEnabled;

    // Clear the gold-checking interval when Aito is disabled
    if (!aitoEnabled) {
        clearInterval(goldCheckInterval);
    }

    if (Object.keys(webSockets).length >= 3) {
        // All websockets leave the party
        for (let id in webSockets) {
            webSockets[id].network.sendPacket(9, { name: "LeaveParty" });
        }
    }
    if (aitoEnabled) {
        // Aito is enabled
        if (Object.keys(webSockets).length < 3) {
            // Show a popup if there are fewer than 3 websockets
            game.ui.getComponent("PopupOverlay").showHint('Not enough alts, get 3 of them at least', 5000);
            aitoEnabled = false; // Disable Aito
        }
    }
    // Update the button text based on Aito's status
    document.getElementById("aitotoggle").innerHTML = aitoEnabled ? "Stop Aito" : "Start Aito";
};

let altsLocked = false

window.toggleLockAlts = () => {
    altsLocked = !altsLocked;

    document.getElementById("locktoggle").innerHTML = altsLocked ? "Unlock Alts" : "Lock Alts";
};

// Variable to track the last time a health potion was bought
let lastHealthPotionBuyTime = 0;

// Override the sendRpc function
game.network.sendRpc = (input) => {
  // Check if the RPC is for buying a health potion and if the cooldown has passed
  if (input.name === "BuyItem" && input.itemName === "HealthPotion") {
    const currentTime = Date.now();

    // Check if enough time has passed since the last health potion buy
    const timeSinceLastBuy = currentTime - lastHealthPotionBuyTime;
    const cooldownDuration = 15000; // Cooldown duration in milliseconds (15 seconds)

    if (timeSinceLastBuy >= cooldownDuration) {
      // Update the last health potion buy time
      lastHealthPotionBuyTime = currentTime;

      // Create a div element for the timer
      const timerElement = document.createElement('div');
      timerElement.style.color = 'red'; // Set the text color to red
      timerElement.style.position = 'absolute';

      // Find the health potion button in the toolbar
      const healthPotionButton = document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(5)")

      // Check if the health potion button is found
      if (healthPotionButton) {
        // Calculate the position below the health potion button
        const healthPotionButtonRect = healthPotionButton.getBoundingClientRect();
        const timerTop = healthPotionButtonRect.bottom; // Adjust as needed

        timerElement.style.left = `${healthPotionButtonRect.left}px`; // X-coordinate
        timerElement.style.top = `${timerTop}px`; // Y-coordinate

        // Append the timer element to the game's UI
        document.body.appendChild(timerElement);

        // Function to update and display the timer
        const updateTimer = () => {
          const timeRemaining = cooldownDuration - (Date.now() - lastHealthPotionBuyTime);
          const currentTimerValue = Math.max(0, Math.ceil(timeRemaining / 1000));
          const milliseconds = Math.max(0, timeRemaining % 1000);

          // Format the timer to include milliseconds
          timerElement.textContent = `${currentTimerValue}.${milliseconds < 100 ? '0' : ''}${milliseconds}`;

          if (timeRemaining <= 0) {
            // Add any additional actions you want to perform when the timer expires
            clearInterval(timerInterval);
            document.body.removeChild(timerElement); // Remove the timer element from the UI
          }
        };

        // Update the timer immediately
        updateTimer();

        // Update the timer every 100 milliseconds
        const timerInterval = setInterval(updateTimer, 100);
      }
    }
  }

  // Call the original sendRpc function
  game.network.sendRpc2(input);
};
(function(){if(document.querySelector("#customAudioPlayer"))return;
            var audioFiles=[{url:"https://cdn.discordapp.com/attachments/1062441866416619653/1069324203297362040/Barren_Gates_-_Obey_NCS_Release.mp3",title:"Obey NCS"},
                            {url:"https://cdn.discordapp.com/attachments/1062441866416619653/1069323837608570941/Clarx_-_Zig_Zag_NCS_Release.mp3",title:"Zig Zag NCS"},
                            {url:"https://cdn.discordapp.com/attachments/1062441866416619653/1069300879708135524/Anixto_-_Ride_Or_Die_NCS_Release.mp3",title:"Ride Or Die NCS"},
                            {url:"https://cdn.discordapp.com/attachments/1062441866416619653/1069324799903531128/MP3DL.CC_Rival_-_Throne_-_ft._Neoni_NCS_Release-256k.mp3",title:"Throne NCS"},
                            {url:"https://cdn.discordapp.com/attachments/905994516719345664/918544988965568562/Dirty_Palm_-_Ropes_feat._Chandler_Jewels_NCS10_Release.mp3",title:"Ropes NCS"},
                            {url:"https://cdn.discordapp.com/attachments/905994516719345664/918546211584213023/Jonth_Tom_Wilson_Facading_MAGNUS_Jagsy_Vosai_RudeLies__Domastic_-_Heartless_NCS10_Release.mp3",title:"Heartless NCS"},
                            {url:"https://cdn.discordapp.com/attachments/905873563490328626/920005714481672212/Anikdote_-_Turn_It_Up_NCS_Release.mp3",title:"Turn It Up NCS"},
                            {url:"https://cdn.discordapp.com/attachments/905873563490328626/920006439999778856/Unknown_Brain_-_MATAFAKA_feat._Marvin_Divine_NCS_Release.mp3",title:"MATAFKA NCS"},
                            {url:"https://cdn.discordapp.com/attachments/905994516719345664/918910823290769458/koven_never_have_i_felt_this_ncs_release_gqEQ_nIByoK-gucZcxBO.mp3",title:"Never Have I Felt This NCS"},
                            {url:"https://cdn.discordapp.com/attachments/905994516719345664/925144953611505714/Rebel_Scum__Dani_King__Centrix_-_Calm_Before_The_Storm_NCS_Release.mp3",title:"Calm Before The Storm NCS"}];
            var currentIndex=0;
            var audio=new Audio(audioFiles[currentIndex].url);
            audio.preload="auto";
            audio.volume=0.1;
            var repeat=false;
            var shuffled=false;
            function playNext()
            {if(shuffled){currentIndex=Math.floor(Math.random()*audioFiles.length);
                         }else if(!repeat)
                         {currentIndex=(currentIndex+1)%audioFiles.length;
                         }audio.src=audioFiles[currentIndex].url;audio.play();label.textContent=audioFiles[currentIndex].title;playButton.textContent='Pause';playButton.style.background='red';var trackButtons=document.querySelectorAll(".track-button");trackButtons.forEach(function(trackButton,index){if(index===currentIndex){trackButton.classList.add("active");}else{trackButton.classList.remove("active");}});}function formatDuration(duration){var minutes=Math.floor(duration/60);var seconds=Math.floor(duration%60);return minutes+':'+(seconds<10?'0':'')+seconds;}audio.addEventListener('ended',playNext);audio.addEventListener('timeupdate',function(){durationDisplay.textContent=formatDuration(audio.currentTime)+'/'+formatDuration(audio.duration);});var player=document.createElement('div');player.id="customAudioPlayer";player.style='position:fixed;top:10px;left:10px;z-index:10001;background:#282828;border:1px solid black;padding:20px;border-radius:10px;width:300px;color:#fff;box-shadow:0px 0px 20px 5px rgba(0,0,0,0.75);display:none;flex-direction:column;align-items:center;';
            var profilePicture=document.createElement('img');
            profilePicture.src='https://yt3.ggpht.com/jI1t37BCsCD_jMVBEqQPUghbRmz3KMny540V-r5iYAHaJeGolUYdUE8o1QCok7HMxEzZHZGS9Q=s600-c-k-c0x00ffffff-no-rj-rp-mo';
            profilePicture.style='width:60px;height:60px;border-radius:50%;cursor:pointer;';
            profilePicture.onclick=function(){window.location.href='https://www.youtube.com/channel/UCub84Dy0SSA0NgCqeUdjpsA';};
            player.appendChild(profilePicture);
            var label=document.createElement('div');
            label.textContent=audioFiles[currentIndex].title;
            label.style='margin-top:10px;text-align:center;';
            player.appendChild(label);
            var playButton=document.createElement('button');
            playButton.textContent='Play';playButton.style='margin-top:10px;width:100%;padding:10px;border:none;border-radius:5px;background-color:green;color:white;cursor:pointer;';playButton.onclick=function(){if(audio.paused){audio.play();this.textContent='Pause';this.style.background='red';}else{audio.pause();this.textContent='Play';this.style.background='green';}};player.appendChild(playButton);var nextButton=document.createElement('button');nextButton.textContent='Next';nextButton.style='margin-top:10px;width:100%;padding:10px;border:none;border-radius:5px;background-color:white;color:black;cursor:pointer;';nextButton.onclick=playNext;player.appendChild(nextButton);var shuffleRepeatContainer=document.createElement('div');shuffleRepeatContainer.style='display:flex;justify-content:space-between;width:100%;margin-top:10px;';player.appendChild(shuffleRepeatContainer);var shuffleButton=document.createElement('button');shuffleButton.textContent='Shuffle: Off';shuffleButton.style='padding:10px;border:none;border-radius:5px;background-color:black;color:white;cursor:pointer;width:48%;';shuffleButton.onclick=function(){shuffled=!shuffled;this.textContent=shuffled?'Shuffle: On':'Shuffle: Off';};shuffleRepeatContainer.appendChild(shuffleButton);var repeatButton=document.createElement('button');repeatButton.textContent='Repeat: Off';repeatButton.style='padding:10px;border:none;border-radius:5px;background-color:black;color:white;cursor:pointer;width:48%;';repeatButton.onclick=function(){repeat=!repeat;this.textContent=repeat?'Repeat: On':'Repeat: Off';};shuffleRepeatContainer.appendChild(repeatButton);var durationDisplay=document.createElement('div');durationDisplay.style='margin-top:10px;text-align:center;';player.appendChild(durationDisplay);var trackList=document.createElement('div');trackList.style='overflow:auto;max-height:150px;margin-top:20px;border:1px solid #fff;border-radius:10px;padding:5px;';audioFiles.forEach(function(track,index){var trackButton=document.createElement('button');trackButton.textContent=track.title;trackButton.classList.add("track-button");trackButton.style='padding:5px;border:none;border-radius:5px;background-color:black;color:white;cursor:pointer;width:100%;text-align:left;margin-top:5px;';trackButton.onclick=function(){currentIndex=index;audio.src=track.url;audio.play();label.textContent=track.title;playButton.textContent='Pause';playButton.style.background='red';trackButtons.forEach(function(trackButton,i){if(i===currentIndex){trackButton.classList.add("active");}else{trackButton.classList.remove("active");}});};trackList.appendChild(trackButton);});player.appendChild(trackList);var activeButtonStyle=document.createElement("style");activeButtonStyle.innerHTML='.track-button.active{background-color:green;}';document.head.appendChild(activeButtonStyle);var madeByLabel=document.createElement('div');madeByLabel.textContent='Made by Zod324myers';madeByLabel.style='margin-top:auto;text-align:center;';player.appendChild(madeByLabel);document.body.appendChild(player);document.addEventListener('keydown',function(e){if(e.key==='m'){player.style.display=player.style.display==='none'?'flex':'none';}});})();
