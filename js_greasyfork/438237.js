// ==UserScript==
// @name         Zombs.io Bad Hack
// @namespace    https://tampermonkey.net/
// @version      4.5.0
// @description  The best public script for zombs.io
// @author       vn︵ℌαʋү༉
// @match        http://zombs.io/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/438237/Zombsio%20Bad%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/438237/Zombsio%20Bad%20Hack.meta.js
// ==/UserScript==


function Bad() {
   if (location.hash.split('/')[4] == 'noscript') { return }
   let cssMain = `
      .bad-btn{
         border: none;
         color: white;
         padding: 10px 20px;
         text-align: center;
         font-size: 14px;
         margin: 2px 0px;
         opacity: 0.9;
         transition: 0.2s;
         display: inline-block;
         border-radius: 15px;
         cursor: pointer;
         text-shadow: -1px 1px 1.5px #242526;
      }
         .bad-btn:hover{
            opacity: 1
         }
         .bad-blue{
            background-color: #5463FF
         }
         .bad-magenta{
            background-color: #E900FF
         }
         .bad-gray{
            background-color: #606060
         }
         .bad-yellow{
            background-color: #FFC600
         }
         .bad-red{
            background-color: #FF1818
         }
         .bad-green{
            background-color: #06FF00
         }
         .bad-pink{
            background-color: #FF6B6B
         }
         .bad-cyan{
            background-color: #39AEA9
         }
         .bad-orange{
            background-color: #FF5F00
         }
         .bad-textbox{
            border: none;
            color: white;
            padding: 10px 10px;
            text-align: center;
            font-size: 14px;
            margin: 2px 0px;
            opacity: 0.9;
            transition: 0.2s;
            display: inline-block;
            border-radius: 15px;
            background-color: #606060;
            text-shadow: -1px 1px 1.5px #242526;
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
            padding: 20px 20px 20px 20px;
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
            padding: 20px 20px 20px 20px;
         }
         .hud-menu-settings .hud-settings-grid {
            width: 750px;
            height: 420px;
         }

         .hud-menu-shop .hud-shop-tabs a[data-type=Pet]::after {
            content: none
         }

         .hud-menu-iframe h3 {
            display: block;
            margin: 0;
            line-height: 20px;
         }

         .hud-menu-iframe{
            display: none;
            position: fixed;
            border-radius: 4px;
            top: 45%;
            left: 50%;
            padding: 20px;
            width: 780px;
            height: 500px;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.6);
            color: #eee;
            z-index: 20;
         }

         .hud-menu-iframe .hud-iframe-grid {
            text-align: center;
            display: block;
            position: relative;
            height: 420px;
            margin: 20px 0 0;
            padding: 10px;
            background: rgba(0, 0, 0, 0.2);
            overflow-y: auto;
            border-radius: 3px;
         }

         .hud-menu-icons .hud-menu-icon[data-type=Iframe]::before {
            background-image: url("https://media.discordapp.net/attachments/870020008128958525/876133010360107048/unknown.png");
            background-size: 30px;
         }
         [data-item=PetGhost][data-tier='1']::after {
            background-image: url('/asset/image/ui/inventory/inventory-pet-ghost-t1.svg');
      `;
   let stylesMain = document.createElement("style");
   stylesMain.appendChild(document.createTextNode(cssMain));
   document.head.appendChild(stylesMain);
   stylesMain.type = "text/css";

   document.querySelectorAll('.ad-unit, .ad-unit-medrec, .hud-intro-guide-hints, .hud-intro-left, .hud-intro-youtuber, .hud-intro-footer, .hud-intro-stone, .hud-intro-tree, .hud-intro-social, .hud-intro-more-games, .hud-intro-guide, .hud-day-night-overlay, .hud-respawn-share, .hud-party-joining, .hud-respawn-corner-bottom-left, #hud-menu-shop > div.hud-shop-grid > a:nth-child(10)').forEach(el => el.remove());
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

   document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(1)").addEventListener('contextmenu', buyPickaxe);
   document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(2)").addEventListener('contextmenu', buySpear);
   document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(3)").addEventListener('contextmenu', buyBow);
   document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(4)").addEventListener('contextmenu', buyBomb);
   document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(5)").addEventListener('contextmenu', () => { shopShortcut("HealthPotion", 1) });
   document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(6)").addEventListener('contextmenu', () => { shopShortcut("PetHealthPotion", 1) });
   document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(8)").addEventListener('contextmenu', buyZombieShield);
   document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(9)").addEventListener('contextmenu', () => { buyPet("PetMiner", getPetTier(6)) });
   document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(10)").addEventListener('contextmenu', () => { buyPet("PetCARL", getPetTier(5)) });
   document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(11)").addEventListener('contextmenu', () => { Game.currentGame.network.sendRpc({ name: "DeleteBuilding", uid: game.ui.getPlayerPetUid() }) });

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

   //Iframe start
   // menu stuff start
   document.querySelector('#hud').insertAdjacentHTML('beforeend', `
      <div id="hud-menu-iframes" ; class="hud-menu-iframe hud-menu">
         <a class="hud-menu-close"></a>
         <h3>Iframe Multibox</h3>
         <div class="hud-iframe-grid">
            <button class="bad-btn bad-cyan" id="newalt">New Alt</button>
            <button class="bad-btn bad-red" id="delalt">Delete Alt</button>
            <input class="bad-textbox" id="delid" style="width: 10%" placeholder="Alt's Id">
            <button class="bad-btn bad-red" id="delallalt">Delete All Alt</button>
            <button class="bad-btn bad-cyan" id="altmove">Stay</button>
         </div>
      </div>
   `)
   document.querySelector("#hud-menu-iframes > a").addEventListener('click', () => document.getElementById('hud-menu-iframes').style.display = 'none')
   let mm = document.getElementsByClassName("hud-menu-iframe")[0];

   function iframeMenu() {
      if (["none", ""].includes(mm.style.display)) {
         mm.style.display = "block";
         for (let i of Array.from(document.getElementsByClassName("hud-menu"))) {
            if (i.classList.contains('hud-menu-iframe')) { return; };
            i.style.display = "none";
         };
      } else {
         mm.style.display = "none";
      };
   };

   document.getElementsByClassName("hud-menu-icons")[0].insertAdjacentHTML("beforeend", `<div class="hud-menu-icon" data-type="Iframe"></div>`);
   document.querySelectorAll(".hud-menu-icon")[3].addEventListener("click", iframeMenu)
   document.getElementsByClassName("hud-menu-iframe")[0].style.overflow = "auto";

   for (let i of Array.from(document.getElementsByClassName("hud-menu-icon"))) {
      if (i.dataset.type !== "Iframe") {
         i.addEventListener('click', function () {
            if (document.getElementsByClassName("hud-menu-iframe")[0].style.display == "block") {
               document.getElementsByClassName("hud-menu-iframe")[0].style.display = "none";
            };
         });
      };
   };

   for (let i of Array.from(document.getElementsByClassName("hud-spell-icon"))) {
      if (i.dataset.type !== "HealTowersSpell" && i.dataset.type !== "TimeoutItem") {
         i.addEventListener('click', function () {
            if (document.getElementsByClassName("hud-menu-iframe")[0].style.display == "block") {
               document.getElementsByClassName("hud-menu-iframe")[0].style.display = "none";
            };
         });
      };
   };

   document.addEventListener("keyup", e => {
      if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
         if (e.key === "o" || e.key === "p" || e.key === "b" || e.key === "/" || e.keyCode == 27) {
            if (mm.style.display == "block") {
               mm.style.display = "none";
            }
         }
      }
   })

   var IframesCount = 0;
   document.getElementById('newalt').addEventListener('click', function () {
      let iframe = document.createElement('iframe');
      IframesCount++;
      iframe.id = "iframeId" + IframesCount;
      iframe.className = "iframeAlts";
      iframe.src = `http://zombs.io/#/${game.options.serverId}/${game.ui.playerPartyShareKey}/${iframe.id}/noscript`;
      iframe.style.display = 'none';
      iframe.addEventListener('load', function (e) {
         iframe.contentWindow.eval(`
         
         !window.Log && (Log = eval);
         eval = (e) => {
            if (e.includes('typeof window')) return 'object';
            if (e.includes('typeof process')) return undefined;
            if (e.includes('Game.currentGame.network.connected')) return true;
            if (e.includes('Game.currentGame.world.myUid')) return 0;
            if (e.includes('document.getElementById("hud").children.length')) return 25;

            let log = Log(e);
            return log;
         }
         document.body.innerHTML = "<script src='/asset/sentry.js'></script><script src='/asset/app.js?1646574495'></script>";
         
         window.SendWs = () => {
            game.network.connectionOptions = parent.game.options.servers[parent.game.options.serverId];
            game.network.connected = true;

            let ws = new WebSocket(parent.game.network.socket.url + game.network.connectionOptions.port);
            ws.binaryType = 'arraybuffer';

            ws.onopen = (data) => {
               ws.network = new game.networkType();

               ws.network.sendPacket = (_event, _data) => {
                  ws.send(ws.network.codec.encode(_event, _data));
               }

               ws.onmessage = msg => {
                  let data = ws.network.codec.decode(msg.data);
                  console.log(data)
                  
                  switch (data.opcode) {
                     case 0:
                        if (data.entities[ws.uid].position) ws.entity = data.entities[ws.uid];
                        if (!ws.entity) return;
                        ws.moveToward = (position) => {
                           let x = Math.round(position.x);
                           let y = Math.round(position.y);

                           let myX = Math.round(ws.entity.position.x);
                           let myY = Math.round(ws.entity.position.y);

                           let offset = 100;

                           if (-myX + x > offset) ws.network.sendInput({ left: 0 }); else ws.network.sendInput({ left: 1 });
                           if (myX - x > offset) ws.network.sendInput({ right: 0 }); else ws.network.sendInput({ right: 1 });

                           if (-myY + y > offset) ws.network.sendInput({ up: 0 }); else ws.network.sendInput({ up: 1 });
                           if (myY - y > offset) ws.network.sendInput({ down: 0 }); else ws.network.sendInput({ down: 1 });
                        }

                        switch (parent.document.getElementById('altmove').innerText) {
                           case "Follow Player":
                              ws.moveToward(parent.game.ui.playerTick.position);
                              break;
                           case "Follow Cursor":
                              ws.moveToward(parent.game.renderer.screenToWorld(parent.game.ui.mousePosition.x, parent.game.ui.mousePosition.y));
                              break;
                           case "Stay":
                              ws.network.sendInput({ left: 0, right: 0, up: 0, down: 0 });
                              break;
                           case "Move Exactly":
                              if (parent.document.getElementById('hud-chat').className.includes('is-focus') || parent.document.getElementById('hud-menu-settings').style.display == 'block') break;
                              if (parent.game.inputManager.keysDown[87]) { ws.network.sendInput({ up: 1, down: 0 }) } else { ws.network.sendInput({ up: 0 }) }; // w
                              if (parent.game.inputManager.keysDown[65]) { ws.network.sendInput({ left: 1, right: 0 }) } else { ws.network.sendInput({ left: 0 }) }; // a
                              if (parent.game.inputManager.keysDown[83]) { ws.network.sendInput({ down: 1, up: 0 }) } else { ws.network.sendInput({ down: 0 }) }; // s
                              if (parent.game.inputManager.keysDown[68]) { ws.network.sendInput({ right: 1, left: 0 }) } else { ws.network.sendInput({ right: 0 }) }; // d
                              break;
                        }

                        let worldMousePos = parent.game.renderer.screenToWorld(parent.game.ui.mousePosition.x, parent.game.ui.mousePosition.y);
                        ws.network.sendInput({ mouseMoved: game.inputPacketCreator.screenToYaw((-ws.entity.position.x + worldMousePos.x) * 100, (-ws.entity.position.y + worldMousePos.y) * 100) });

                        if (parent.game.inputManager.mouseDown) {
                           ws.network.sendInput({ mouseDown: 0 });
                           ws.network.sendInput({mouseMovedWhileDown: game.inputPacketCreator.screenToYaw((-ws.entity.position.x + worldMousePos.x)*100, (-ws.entity.position.y + worldMousePos.y)*100)});
                        } else {
                           ws.network.sendInput({ mouseUp: 0 })
                           ws.network.sendInput({ mouseMoved: game.inputPacketCreator.screenToYaw((-ws.entity.position.x + worldMousePos.x) * 100, (-ws.entity.position.y + worldMousePos.y) * 100) });
                        }
                        break;
                     case 4:
                        ws.send(game.network.codec.encode(6, {}));
                        ws.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: parent.game.ui.playerPartyShareKey });
                        ws.uid = data.uid;
                        break;
                     case 5:
                        ws.network.sendPacket(4, { displayName: 'KINGGG_BOBBBB', extra: data.extra });
                        break;
                     case 9:
                        switch (data.name) {
                           case 'Dead':
                              ws.network.sendPacket(3, { respawn: 1 })
                              break;
                           case 'SetPartyList':
                              break;
                           case 'Leaderboard':
                              //ws.send(new Uint8Array([9,6,0,0,0,126,8,0,0,108,27,0,0,146,23,0,0,82,23,0,0,8,91,11,0,8,91,11,0,0,0,0,0,32,78,0,0,76,79,0,0,172,38,0,0,120,155,0,0,166,39,0,0,140,35,0,0,36,44,0,0,213,37,0,0,100,0,0,0,120,55,0,0,0,0,0,0,0,0,0,0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,134,6,0,0]));
                              ws.send(new Uint8Array([9,6,0,0,0,100,0,0,0,184,11,0,0,196,9,0,0,8,7,0,0,160,134,1,0,0,0,0,0,160,134,1,0,32,78,0,0,64,13,3,0,32,191,2,0,64,66,15,0,160,134,1,0,160,134,1,0,160,134,1,0,160,134,1,0,0,0,0,0,108,51,1,0,0,0,0,0,0,0,0,0,0,0,0,0,120,105,0,0,144,1,0,0,64,66,15,0,100,25,0,0]))
                              break;
                        }
                        break;
                  }
               }
               ws.onclose = () => {
                  console.log('Ws closed.');
                  parent.document.getElementById(location.hash.split('/')[3]).remove()
               }
            }
         }
         window.SendWs();
         `)
      })
      document.body.append(iframe);
   })

   let AltMoveClicks = 0;
   var AltMoveStyle = "Stay";
   document.getElementById('altmove').addEventListener('click', function () {
      let moveOrder = ["Stay", "Follow Cursor", "Follow Player", "Move Exactly"];
      AltMoveClicks++;
      AltMoveStyle = moveOrder[AltMoveClicks % 4]
      document.getElementById('altmove').innerText = AltMoveStyle;
   })

   document.getElementById('delallalt').addEventListener('click', function () {
      if (document.getElementsByClassName('iframeAlts').length > 0) {
         for (let iframe of document.getElementsByClassName('iframeAlts')) {
            iframe.remove();
         }
      }
   })
   /*
//menu stuff end
let numOfAlts = 0
let aitoid = 0
let shouldAITO = false
 
game.network.addRpcHandler("DayCycle", () => {
if (shouldAITO) {
   aitoid += 1
   console.log("aito" + aitoid)
   let NewAITO = document.createElement('Iframe');
   NewAITO.id = "aito" + aitoid;
   NewAITO.src = `http://zombs.io/#/${game.options.serverId}/badhack`;
         NewAITO.addEventListener('load', function () {
            NewAITO.contentWindow.eval(`
       document.getElementsByClassName("hud-intro-play")[0].click()
       game.network.addEntityUpdateHandler(() => {
           if (game.world.inWorld && game.network.connected) {
               if (game.ui.getPlayerPartyShareKey() == window.parent.game.ui.getPlayerPartyShareKey() && game.ui.playerTick.gold >= 10000) {
                    console.log("buy timeout")
                    game.network.sendRpc({
                        name: "BuyItem",
                        itemName: "Pause",
                        tier: 1
                    });
                    setTimeout(() => {
                        window.parent.document.getElementById("aito" + aitoid).remove()
                    }, 250)
                } else if (game.ui.getPlayerPartyShareKey() != window.parent.game.ui.getPlayerPartyShareKey()){
                    console.log("join party")
                    game.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: window.parent.game.ui.getPlayerPartyShareKey()
                    });
                }
            }
       })
   `)
         })
         NewAITO.style.display = "none"
         document.body.append(NewAITO)
      }
})

   document.getElementById("aitobtn").addEventListener("click", function () {
      if (!shouldAITO) {
         shouldAITO = true
         document.getElementById("aitobtn").innerHTML = "AITO On"
      } else {
         shouldAITO = false
         document.getElementById("aitobtn").innerHTML = "AITO Off"
      }

   });
   document.getElementById("newalt").addEventListener("click", function () {
      numOfAlts++;
      let newDiv = document.createElement('div');
      newDiv.className = "frameholder";
      newDiv.id = "frame" + numOfAlts;
      let newIframe = document.createElement('iFrame');
      newIframe.className = "frames";
      newIframe.src = `http://zombs.io/#/${game.options.serverId}/${game.ui.playerPartyShareKey}`;

      document.getElementsByClassName("hud-menu-more")[0].insertBefore(newDiv, null);
      newDiv.appendChild(newIframe);
   });

   document.getElementById("delallalt").addEventListener("click", function F_deleteAllAlt() {
      for (let i = 1; i <= numOfAlts; i++) {
         document.getElementById("frame" + i).remove();
      }
      numOfAlts = 0;
   });

   document.getElementById("delalt").addEventListener("click", function F_deleteAlt() {
      let deletealtnum = parseInt(document.getElementById('delid').value);
      document.getElementById("frame" + deletealtnum).remove();
      for (let i = 1; i <= (numOfAlts - deletealtnum); i++) {
         document.getElementById("frame" + (deletealtnum + i)).id = "frame" + (deletealtnum + i - 1);
      }
      numOfAlts--;
   });


//Iframe end
*/

   function createCoordinates() {
      let x = document.createElement('div')
      x.style = 'position: relative; margin: 0;';
      x.innerHTML = `<h3 id="coords"; style="margin: 0;"></h3>`
      x.style.textAlign = "left"
      document.querySelector("#hud > div.hud-bottom-left").append(x)
   }
   let hasBeenInWorld = false;

   game.network.addEnterWorldHandler(() => {
      if (!hasBeenInWorld) {
         hasBeenInWorld = true
         setInterval(() => {
            document.querySelector("#coords")
               .innerText = `X: ${game.ui.playerTick?.position?.x}\n Y: ${game.ui.playerTick?.position?.y}`
         }, 16)
         createCoordinates()
      }
      game.ui.components.MenuShop.onTwitterFollow();
      game.ui.components.MenuShop.onTwitterShare();
      game.ui.components.MenuShop.onFacebookLike();
      game.ui.components.MenuShop.onFacebookShare();
      game.ui.components.MenuShop.onYouTubeSubscribe();
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

   game.network.addRpcHandler('ReceiveChatMessage', function (e) {
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
         if (e.message == "!marker") {
            var map = document.getElementById("hud-map");
            map.insertAdjacentHTML("beforeend", `<div style="color: red; display: block; left: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.left)}%; top: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.top)}%; position: absolute;" class='hud-map-player'></div>`)
            game.ui.getComponent('PopupOverlay').showHint(`Added Marker`, 1500);
         };
      };
   });

   function checkStatus(party) {
      if (party.isOpen == 1) {
         return '<a style = "color: #00e700;opacity: 0.9;">[Open]<a/>';
      } else if (!party.isOpen == 1) {
         return '<a style = "color:red;opacity: 0.9;">[Private]<a/>';
      }
   };
   let partyCheck = (all_parties) => {
      document.getElementsByClassName('hud-party-grid')[0].innerHTML = '';

      for (let i in all_parties) {
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

         if (parties.memberCount == 4) {
            tab.classList.add('is-disabled');
         } else {
            tab.style.display = 'block';
         }
         setTimeout(() => {
            if (parties.partyId == game.ui.playerPartyId) tab.classList.add('is-active');
         }, 1000);

         if (parties.isOpen !== 1) tab.classList.add('is-disabled');

         tab.addEventListener('click', function () {
            if (tab.isPublic == 1 && tab.members < 4) {
               game.network.sendRpc({
                  name: 'JoinParty',
                  partyId: Math.floor(tab.id)
               });
            } else if (!tab.isPublic == 1) {
               game.ui.getComponent('PopupOverlay').showHint("You can't request private parties!", 800);
            }
         });
         document.getElementsByClassName('hud-party-grid')[0].appendChild(tab);
      };
   };

   game.network.addRpcHandler("SetPartyList", (e) => { partyCheck(e) });

   let settingsHTML = `
      <div style="text-align: center">
         <button class="bad-btn bad-magenta" id="lagspam-btn">Lag Spam Off</button>
         <button class="bad-btn bad-magenta" id="togglespmch">Chat Spam Off</button>
         <input type="text" id="spamchat" placeholder="Message" class="bad-textbox" style="width: 40%">
         <hr>
         <button id="sellall" class="bad-btn bad-red">Sell All</button>
         <button id="sellwall" class="bad-btn bad-red">Wall</button>
         <button id="selldoor" class="bad-btn bad-red">Door</button>
         <button id="selltrap" class="bad-btn bad-red">Slow Trap</button>
         <button id="sellharvester" class="bad-btn bad-red">Harvester</button>
         <br>
         <button id="sellarrow" class="bad-btn bad-red">Arrow</button>
         <button id="sellcannon" class="bad-btn bad-red">Cannon</button>
         <button id="sellmelee" class="bad-btn bad-red">Melee</button>
         <button id="sellbomb" class="bad-btn bad-red">Bomb</button>
         <button id="sellmagic" class="bad-btn bad-red">Mage</button>
         <button id="sellminer" class="bad-btn bad-red">Gold Miner</button>
         <hr>
         <button class="bad-btn bad-yellow" id="menu-leaveparty-btn" onclick ='Game.currentGame.network.sendRpc({name: "LeaveParty"})'>Leave Party</button>
         <button class="bad-btn bad-yellow" id="menu-jpbsk-btn" onclick='Game.currentGame.network.sendRpc({name:"JoinPartyByShareKey", partyShareKey: document.querySelector("#menu-jpbsk-input").value})'>Join Party</button>
         <input type="text" class="bad-textbox" id="menu-jpbsk-input" style="width: 40%" placeholder="Share Key">
         <button class="bad-btn bad-yellow" id="autoaccept-btn">Accepter Off</button>
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
         <button class="bad-btn bad-blue" id="toggleresp">Respawn Off</button>
         <button class="bad-btn bad-blue" id="togglebot">Bot Off</button>
         <button class="bad-btn bad-blue" id="toggleswing">Swing Off</button>
         <button class="bad-btn bad-blue" id="togglerb">Rebuild Off</button>
         <hr>
         <button id="hidechat" class="bad-btn bad-pink">Hide Chat</button>
         <button id="hidepop" class="bad-btn bad-pink">Hide Popup</button>
         <button id="hideldb" class="bad-btn bad-pink">Hide Leaderboard</button>
         <button id="hidemap" class="bad-btn bad-pink">Hide Map</button>
         <button id="hidepip" class="bad-btn bad-pink">Hide PIP</button>
         <hr>
         <button id="hideground" class="bad-btn bad-cyan">Hide Ground</button>
         <button id="hidenpcs" class="bad-btn bad-cyan">Hide NPCs</button>
         <button id="hideenv" class="bad-btn bad-cyan">Hide Env</button>
         <button id="hideproj" class="bad-btn bad-cyan">Hide Proj</button>
         <button id="hideall" class="bad-btn bad-cyan">Hide All</button>
         <button id="freezegame" class="bad-btn bad-cyan">Stop Game</button>
         <hr>
         <button class="bad-btn bad-gray" onclick="Game.currentGame.network.disconnect()">Disconnect</button>
      </div>
   `
   document.getElementById("hud-menu-settings").childNodes[3].innerHTML = "Bad Hack by ︵ℌαʋү༉"
   document.getElementsByClassName("hud-settings-grid")[0].innerHTML = settingsHTML;
   document.getElementById('lagspam-btn').addEventListener('click', lagSpam)
   document.getElementById('lagspam-btn').addEventListener('click', lagSpambtn)
   document.getElementById("spamallparty-btn").addEventListener("click", spamAllParty);
   document.getElementById("newtab").addEventListener("click", () => window.open(`http://zombs.io/#/${game.options.serverId}/${game.ui.getPlayerPartyShareKey()}`));
   document.getElementById("autoupgradeall-btn").addEventListener("click", autoUpgradeAll);
   document.getElementById("autoupgradeall-btn").addEventListener("click", autoUpgradeAllbtn);
   document.getElementById("spampartybyid-btn").addEventListener("click", spamPartyByID);
   document.getElementById("autoaccept-btn").addEventListener("click", autoAcceptParty);
   document.getElementById("autoaccept-btn").addEventListener("click", autoAcceptPartybtn);
   document.getElementById("toggleswing").addEventListener("click", toggleSwing)
   document.getElementById("toggleahrc").addEventListener("click", toggleAHRC)
   document.getElementById("toggleresp").addEventListener('click', toggleRespawn)
   document.getElementById("toggleaim").addEventListener("click", toggleAim)
   document.getElementById("togglerb").addEventListener("click", toggleRebuild);
   document.getElementById("togglespinner").addEventListener("click", spinnerbtn);
   document.getElementById("healplayer").addEventListener("click", toggleHealPlayer);
   document.getElementById("healpet").addEventListener("click", toggleHealPet);
   document.getElementById("revivepet").addEventListener("click", toggleRevivePet);
   document.getElementById("evolvepet").addEventListener("click", toggleEvolvePet);
   document.getElementById("sellwall").addEventListener('click', () => { sellAllByType("Wall") });
   document.getElementById("selldoor").addEventListener('click', () => { sellAllByType("Door") });
   document.getElementById("selltrap").addEventListener('click', () => { sellAllByType("SlowTrap") });
   document.getElementById("sellarrow").addEventListener('click', () => { sellAllByType("ArrowTower") });
   document.getElementById("sellcannon").addEventListener('click', () => { sellAllByType("CannonTower") });
   document.getElementById("sellmelee").addEventListener('click', () => { sellAllByType("MeleeTower") });
   document.getElementById("sellbomb").addEventListener('click', () => { sellAllByType("BombTower") });
   document.getElementById("sellmagic").addEventListener('click', () => { sellAllByType("MagicTower") });
   document.getElementById("sellminer").addEventListener('click', () => { sellAllByType("GoldMine") });
   document.getElementById("sellharvester").addEventListener('click', () => { sellAllByType("Harvester") });
   document.getElementById("hidechat").addEventListener("click", hideChat);
   document.getElementById("hidepop").addEventListener("click", hidePopupOverlay);
   document.getElementById("hideldb").addEventListener("click", hideLeaderboard);
   document.getElementById("hidemap").addEventListener("click", hideMap);
   document.getElementById("hidepip").addEventListener("click", hidePIP);
   document.getElementById("hideground").addEventListener("click", hideGround);
   document.getElementById("hidenpcs").addEventListener("click", hideNPCs);
   document.getElementById("hideenv").addEventListener("click", hideEnviroment);
   document.getElementById("hideproj").addEventListener("click", hideProjectiles);
   document.getElementById("hideall").addEventListener("click", hideAll);
   document.getElementById("freezegame").addEventListener("click", freezeGame);
   document.getElementById('clearchat-btn').addEventListener('click', clearChatbtn)

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

   game.network.addRpcHandler("LocalBuilding", (data) => {
      for (let e of data) {
         if (!!e.dead) {
            for (let i of uniqueSellUid) {
               if (e.uid == i) {
                  uniqueSellUid.splice(uniqueSellUid.indexOf(i, 0), 1)
               }
            };
         }
      }
   })
   let sellUid = []
   let uniqueSellUid = []
   function sellAllByType(type) {
      for (let i of Object.values(game.ui.buildings)) {
         if (Object.values(i)[2] == type) {
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
   }

   document.getElementById("sellall").addEventListener('click', function () {
      Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete all towers?", 6000, function () {
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

   let shouldAutoRespawn = false
   game.network.addRpcHandler("Dead", () => {
      if (shouldAutoRespawn) {
         game.network.sendPacket(3, { respawn: 1 })
         document.getElementById('hud-respawn').style.display = "none"
      }
   })

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
         chatSpam = setInterval(function () {
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
         acceptparty = setInterval(function () {
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
   var autoupgradeall = null;

   function autoUpgradeAll() {
      clearInterval(autoupgradeall);
      if (autoupgradeall !== null) {
         autoupgradeall = null;
      } else {
         autoupgradeall = setInterval(function () {
            var entities = Game.currentGame.world.entities;
            for (var uid in entities) {
               if (!entities.hasOwnProperty(uid)) continue;
               var obj = entities[uid];
               Game.currentGame.network.sendRpc({
                  name: "UpgradeBuilding",
                  uid: obj.fromTick.uid
               })
            }
         }, 1000)
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
      if (!shouldAutoRebuild) {
         deadTowers = []
         shouldAutoRebuild = true
         document.getElementById("togglerb").innerHTML = "Rebuild On";
      } else {
         deadTowers = []
         shouldAutoRebuild = false
         document.getElementById("togglerb").innerHTML = "Rebuild Off";
      }
   }

   function toggleSwing() {
      if (!autoSwing) {
         autoSwing = true;
         document.getElementById("toggleswing").innerHTML = "Swing On";
      } else {
         autoSwing = false;
         document.getElementById("toggleswing").innerHTML = "Swing Off";
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
            game.inputPacketScheduler.scheduleInput({ up: 1, down: 0, left: 0, right: 0 })
            break
         }
         case 'Down': {
            game.inputPacketScheduler.scheduleInput({ up: 0, down: 1, left: 0, right: 0 })
            break
         }
         case 'Left': {
            game.inputPacketScheduler.scheduleInput({ up: 0, down: 0, left: 1, right: 0 })
            break
         }
         case 'Right': {
            game.inputPacketScheduler.scheduleInput({ up: 0, down: 0, left: 0, right: 1 })
            break
         }
         case 'UpRight': {
            game.inputPacketScheduler.scheduleInput({ up: 1, down: 0, left: 0, right: 1 })
            break
         }
         case 'UpLeft': {
            game.inputPacketScheduler.scheduleInput({ up: 1, down: 0, left: 1, right: 0 })
            break
         }
         case 'DownRight': {
            game.inputPacketScheduler.scheduleInput({ up: 0, down: 1, left: 0, right: 1 })
            break
         }
         case 'DownLeft': {
            game.inputPacketScheduler.scheduleInput({ up: 0, down: 1, left: 1, right: 0 })
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
   let shouldAutoRebuild = false
   let autoBuildTimeout = false
   let autoSwing = false
   let shouldBotMode = false
   let botTimeout = false
   let shouldAHRC = false
   let shouldAutoAim = false
   let shouldAutoHealPet = true
   let healPetTimeout = false
   let shouldAutoRevivePet = true
   let shouldAutoEvolvePet = true
   let shouldAutoHealPlayer = true
   let playerHealTimeout = false
   let petSpawned = false
   game.network.addEntityUpdateHandler((data) => {
      if (game.world.inWorld && game.network.connected) {
         let myPet = game.world.entities[game.ui.playerTick?.petUid]?.fromTick;
         let petHealth = (myPet?.health / myPet?.maxHealth) * 100;
         let myPlayer = game.world.entities[game.ui.playerTick?.uid]?.fromTick;
         let playerHealth = (myPlayer?.health / myPlayer?.maxHealth) * 100;

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
         if (petSpawned == true && shouldAutoRevivePet && !game.world.entities[game.ui.playerTick?.petUid] && playerHealth > 0) {
            shopShortcut("PetRevive", 1)
         }

         if (playerHealth <= document.getElementById("healplayerinput").value && playerHealth > 0 && game.ui.playerTick.gold >= 100 && shouldAutoHealPlayer && !playerHealTimeout) {
            shopShortcut("HealthPotion", 1)
            playerHealTimeout = true;
            setTimeout(() => {
               playerHealTimeout = false;
            }, 300)
         }
         if (shouldAHRC) {
            let entities = Game.currentGame.world.entities;
            for (let uid in entities) {
               let obj = entities[uid];
               if (obj.fromTick.model == "Harvester") {
                  let amount = obj.fromTick.tier * 0.05 - 0.02;
                  game.network.sendRpc({ name: "AddDepositToHarvester", uid: obj.fromTick.uid, deposit: amount });
                  game.network.sendRpc({ name: "CollectHarvester", uid: obj.fromTick.uid });
               };
            };
         };
         if (shouldAutoAim) {
            window.targets = [];
            let entities = game.renderer.npcs.attachments;
            for (let i in entities) {
               if (document.getElementById('aimOptions').value == 'pl' ?
                  (entities[i].fromTick.model == "GamePlayer" && entities[i].fromTick.uid !== game.ui.playerTick.uid && entities[i].targetTick.partyId !== game.ui.playerPartyId && entities[i].fromTick.dead == 0) :
                  (entities[i].fromTick.model !== "GamePlayer" && entities[i].entityClass !== "Projectile")) {
                  window.targets.push(entities[i].fromTick);
               };
            };
            if (window.targets.length > 0) {
               const myPos = game.ui.playerTick.position;
               window.targets.sort((a, b) => {
                  return measureDistance(myPos, a.position) - measureDistance(myPos, b.position);
               });

               const target = window.targets[0];
               let reversedAim = game.inputPacketCreator.screenToYaw((target.position.x - myPos.x) * 100, (target.position.y - myPos.y) * 100);
               game.inputPacketCreator.lastAnyYaw = reversedAim;
               game.network.sendPacket(3, { mouseMoved: reversedAim });
            }
         };
         if (autoSwing) {
            game.network.sendInput({ space: 0 })
            game.network.sendInput({ space: 1 })
         }
         if (shouldLockYaw && game.ui.playerTick?.aimingYaw != lockedYaw) {
            game.inputPacketCreator.lastAnyYaw = lockedYaw;
            game.network.sendPacket(3, { mouseMoved: lockedYaw });
         }
         if (shouldAutoRebuild && deadTowers.length > 0 && !autoBuildTimeout) {
            console.log('rebuild')
            autoBuildTimeout = true
            for (let i of deadTowers) {
               game.network.sendRpc({
                  name: "MakeBuilding",
                  type: i[0],
                  x: i[1],
                  y: i[2],
                  yaw: i[3],
               });
            };
            setTimeout(() => {
               autoBuildTimeout = false;
            }, 1000)
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
            if (joinablePartyId.length > 0) game.network.sendRpc({ name: 'JoinParty', partyId: joinablePartyId[Math.floor(Math.random() * joinablePartyId.length)] })
         }
         if (shouldSpin) {
            game.inputPacketCreator.lastAnyYaw = yaw;
            game.network.sendPacket(3, { mouseMoved: yaw });
            yaw += 10
            if (yaw >= 360) yaw -= 360
         }
         if (shouldSpamIdParty && document.querySelector("#party-id-input").value != '') game.network.sendRpc({ name: "JoinParty", partyId: parseInt(document.querySelector("#party-id-input").value) })
         if (shouldClearChat && document.querySelector('.hud-chat-messages').childElementCount > 0) document.querySelector('.hud-chat-messages').innerHTML = ""
      }
   })

   let deadTowers = []
   game.network.addRpcHandler("LocalBuilding", (data) => {
      if (shouldAutoRebuild) {
         for (let e of data) {
            if (!!e.dead) {
               let yaw = 0;
               if (["Harvester", "MeleeTower"].includes(e.type)) {
                  if (game.world.entities[e.uid] !== undefined) yaw = game.world.entities[e.uid].targetTick.yaw;
               }
               deadTowers.push([e.type, e.x, e.y, yaw, e.tier])
            };
            for (let i of deadTowers) {
               if (e.type == i[0] && e.x == i[1] && e.y == i[2] && e.dead == 0) {
                  deadTowers.splice(deadTowers.indexOf(i, 0), 1)
               }
            };
            if (e.type == "GoldStash") deadTowers = []
         }
      };
   });

   let mousePs = {};
   let should3x3Walls = false;
   let should5x5Walls = false;
   let should7x7Walls = false;
   let should9x9Walls = false;

   addEventListener('keydown', function (e) {
      if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
         if (e.key == "z" && !should3x3Walls) {
            game.ui.getComponent("PopupOverlay").showHint('3x3 Walls On', 1000)
            should3x3Walls = true;
            should5x5Walls = false;
            should7x7Walls = false;
            should9x9Walls = false;
         }
         if (e.key == "x" && !should5x5Walls) {
            game.ui.getComponent("PopupOverlay").showHint('5x5 Walls On', 1000)
            should3x3Walls = false;
            should5x5Walls = true;
            should7x7Walls = false;
            should9x9Walls = false;
         }
         if (e.key == "c" && !should7x7Walls) {
            game.ui.getComponent("PopupOverlay").showHint('7x7 Walls On', 1000)
            should3x3Walls = false;
            should5x5Walls = false;
            should7x7Walls = true;
            should9x9Walls = false;
         }
         if (e.key == "v" && !should9x9Walls) {
            game.ui.getComponent("PopupOverlay").showHint('9x9 Walls On', 1000)
            should3x3Walls = false;
            should5x5Walls = false;
            should7x7Walls = false;
            should9x9Walls = true;
         }
      }
   })

   addEventListener('keyup', function (e) {
      if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
         if (e.key == "z") {
            should3x3Walls = false;
         }
         if (e.key == "x") {
            should5x5Walls = false;
         }
         if (e.key == "c") {
            should7x7Walls = false;
         }
         if (e.key == "v") {
            should9x9Walls = false;
         }
      }
   })

   function placeWall(x, y) {
      game.network.sendRpc({ name: 'MakeBuilding', x: x, y: y, type: "Wall", yaw: 0 });
   }

   document.addEventListener('mousemove', e => {
      mousePs = { x: e.clientX, y: e.clientY };
      if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
         var buildingSchema = game.ui.getBuildingSchema();
         var schemaData = buildingSchema.Wall;
         var world = game.world;
         var worldPos = game.renderer.screenToWorld(mousePs.x, mousePs.y);
         var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, { width: schemaData.gridWidth, height: schemaData.gridHeight });
         var cellSize = world.entityGrid.getCellSize();
         var cellAverages = { x: 0, y: 0 };
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
            //layer 1
            placeWall(gridPos.x - 48, gridPos.y + 48);
            placeWall(gridPos.x, gridPos.y + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48);
            //layer 2
            placeWall(gridPos.x - 48, gridPos.y);
            placeWall(gridPos.x, gridPos.y);
            placeWall(gridPos.x + 48, gridPos.y);
            //layer 3
            placeWall(gridPos.x - 48, gridPos.y - 48);
            placeWall(gridPos.x, gridPos.y - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48);
         }
         if (should5x5Walls) {
            //layer 1
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
            //layer 2
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48);
            placeWall(gridPos.x, gridPos.y + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
            //layer 3
            placeWall(gridPos.x - 48 - 48, gridPos.y);
            placeWall(gridPos.x - 48, gridPos.y);
            placeWall(gridPos.x, gridPos.y);
            placeWall(gridPos.x + 48, gridPos.y);
            placeWall(gridPos.x + 48 + 48, gridPos.y);
            //layer 4
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48);
            placeWall(gridPos.x, gridPos.y - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
            //layer 5
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
         }
         if (should7x7Walls) {
            //layer 1
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
            //layer 2
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48);
            //layer 3
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48);
            placeWall(gridPos.x, gridPos.y + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48);
            //layer 4
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y);
            placeWall(gridPos.x - 48 - 48, gridPos.y);
            placeWall(gridPos.x - 48, gridPos.y);
            placeWall(gridPos.x, gridPos.y);
            placeWall(gridPos.x + 48, gridPos.y);
            placeWall(gridPos.x + 48 + 48, gridPos.y);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y);
            //layer 5
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48);
            placeWall(gridPos.x, gridPos.y - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48);
            //layer 6
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48);
            //layer 7
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
         }
         if (should9x9Walls) {
            //layer 1
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
            //layer 2
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
            //layer 3
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48);
            //layer 4
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48);
            placeWall(gridPos.x, gridPos.y + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48)
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48);
            //layer 5
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y);
            placeWall(gridPos.x - 48 - 48, gridPos.y);
            placeWall(gridPos.x - 48, gridPos.y);
            placeWall(gridPos.x, gridPos.y);
            placeWall(gridPos.x + 48, gridPos.y);
            placeWall(gridPos.x + 48 + 48, gridPos.y)
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y);
            //layer 6
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48);
            placeWall(gridPos.x, gridPos.y - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48)
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48);
            //layer 7
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48);
            //layer 8
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
            //layer 9
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
         }
      }
   })

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

   addEventListener('keyup', function (e) {
      if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
         if (e.key == "=") {
            game.ui.getComponent("PopupOverlay").showHint(
               'Press [/] for menu, press [?] to lock angle, type !boss for boss wave, !marker to leave a mark on map, left click somewhere on the minimap to automatically move there, HOLD "c" for 3x3 wall, "x" for 5x5 and "z" for 7x7',
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

   document.querySelector('#togglebot').addEventListener('click', function () {
      shouldBotMode = !shouldBotMode
      this.innerText = shouldBotMode ? "Bot On" : "Bot Off"
   })
   document.querySelector('#togglespmch').addEventListener('click', function () {
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
         b = msg.displayName.replace(/<(?:.|\n)*?>/gm, ''),
         c = msg.message.replace(/<(?:.|\n)*?>/gm, '')
      if (blockedNames.includes(b) || window.chatDisabled) { return; };
      let d = a.ui.createElement(`<div class="hud-chat-message"><strong><a>🟢 </a>${b}</strong><small> at ${getClock()}</small>: ${c}</div>`);
      a.messagesElem.appendChild(d);
      a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
      a.messagesElem.lastChild.childNodes[0].childNodes[0].onclick = () => { blockPlayer(b) }
   }
   Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);

   let goToPosInterval
   let moveTimeout
   function goToPos(x, y) {
      clearInterval(goToPosInterval)
      goToPosInterval = setInterval(() => {
         let myX = Math.round(game.ui.playerTick.position.x);
         let myY = Math.round(game.ui.playerTick.position.y);

         let offset = 100;

         if (-myX + x > offset) game.network.sendInput({ left: 0 }); else game.network.sendInput({ left: 1 });
         if (myX - x > offset) game.network.sendInput({ right: 0 }); else game.network.sendInput({ right: 1 });

         if (-myY + y > offset) game.network.sendInput({ up: 0 }); else game.network.sendInput({ up: 1 });
         if (myY - y > offset) game.network.sendInput({ down: 0 }); else game.network.sendInput({ down: 1 });

         if (-myX + x < offset && myX - x < offset && -myY + y < offset && myY - y < offset) {
            game.ui.getComponent('PopupOverlay').showHint('Finished moving!', 1e4)
            clearInterval(goToPosInterval)
            clearTimeout(moveTimeout)
         }
      }, 50)
      moveTimeout = setTimeout(() => {
         clearInterval(goToPosInterval)
         game.ui.getComponent('PopupOverlay').showHint('It has been 4 minutes to move to the position on the map, so it has automatically stopped to prevent infinite loops.', 8000)
         game.network.sendInput({ left: 0, right: 0, up: 0, down: 0 })
      }, 240000)
   }

   let mapContainer = document.createElement('div')
   mapContainer.id = "hud-map-container"
   document.querySelector('.hud-bottom-left').append(mapContainer)
   $('#hud-map').appendTo(document.querySelector('#hud-map-container'))

   document.querySelector("#hud-map-container").addEventListener('click', (e) => {
      let offset = $('#hud-map-container').offset();
      let mapMouseX = e.pageX - offset.left;
      let mapMouseY = e.pageY - offset.top;
      game.ui.getComponent('PopupOverlay').showConfirmation(`Are you sure you want to move to X: ${Math.round(mapMouseX * 171.42857142857)}, Y: ${Math.round(mapMouseY * 171.42857142857)}? You can right click the minimap to cancel.`, 7500, () => {
         game.ui.getComponent('PopupOverlay').showHint('Starting MapMove...', 4000)
         goToPos(mapMouseX * 171.42857142857, mapMouseY * 171.42857142857)
      }, () => {
         game.ui.getComponent('PopupOverlay').showHint('OK, did not start MapMove', 4000)
      })
   })

   document.querySelector('#hud-map-container').addEventListener('contextmenu', () => {
      game.ui.getComponent('PopupOverlay').showConfirmation('Are you sure you want to cancel the current MapMove process?', 7500, () => {
         clearInterval(goToPosInterval)
         clearTimeout(moveTimeout)
         game.network.sendInput({ left: 0, right: 0, up: 0, down: 0 })
         game.ui.getComponent('PopupOverlay').showHint('Successfully stopped MapMover.', 4000)
      }, () => {
         game.ui.getComponent('PopupOverlay').showHint('OK, did not stop MapMover.', 4000)
      })
   })
}
Bad()
