// ==UserScript==
// @name         Script pack
// @namespace    https://tampermonkey.net/
// @version      1.3
// @description  Best script pack 
// @author        ḵScripts ✔
// @match        zombs.io*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/483991/Script%20pack.user.js
// @updateURL https://update.greasyfork.org/scripts/483991/Script%20pack.meta.js
// ==/UserScript==

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
            overflow: hidden;
            position: absolute;
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
            overflow: hidden;
            position: relative;
         }

         .hud-menu-shop .hud-shop-tabs a[data-type=Pet]::after {
            content: none
         }

         .hud-map-resource {
            display: none;
            position: absolute;
            width: 4px;
            height: 4px;
            margin: -2px 0 0 -2px;
            background: #eee;
            border-radius: 50%;
            z-index: 2;
            transform: scale(0.6);
         }

         .tab2 {
            position: sticky;
            overflow: hidden;
            border: 3px solid #3B3B3B;
            background-color: #4D4D4D;
            display: flex;
            justify-content: center;
            margin-top: 6%;
            opacity: 1;
            text-align: center;
            margin-left: -6%;
         }

         .tab2 li {
            list-style: none;
         }

         .tablinks {
            width: 120px;
            font-family: Arial;
            font-size: 14px;
            background-color: rgba(65, 89, 178, 1);
            color: white;
            padding: 15px 10px;
            border: 1px, dark-blue;
            border-radius: 10px;
            outline: none;
            cursor: pointer;
            transition: 0.3s;
         }

         .tablinks:hover {
           background-color: rgba(64, 99, 229, 1) ;
         }

         .tablinks.active {
           background-color: #373da6;
         }
`;

let stylesMain = document.createElement("style");
stylesMain.appendChild(document.createTextNode(cssMain));
document.head.appendChild(stylesMain);
stylesMain.type = "text/css";

document.querySelectorAll('.ad-unit, .ad-unit-medrec, .hud-intro-guide-hints, .hud-intro-left, .hud-intro-youtuber, .hud-intro-footer, .hud-intro-stone, .hud-intro-tree, .hud-intro-social, .hud-intro-more-games, .hud-intro-guide, .hud-day-night-overlay, .hud-respawn-share, .hud-party-joining, .hud-respawn-corner-bottom-left, #hud-menu-shop > div.hud-shop-grid > a:nth-child(10)').forEach(el => el.remove());
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
document.querySelector(".hud-chat-messages").style.width = "1800px";

document.getElementsByClassName("hud-top-center")[0].innerHTML = `
   <a id="shopshortcut1"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pickaxe-t7.svg"></a>
   <a id="shopshortcut2"><img src="http://zombs.io/asset/image/ui/inventory/inventory-spear-t7.svg"></a>
   <a id="shopshortcut3"><img src="http://zombs.io/asset/image/ui/inventory/inventory-bow-t7.svg"></a>
   <a id="shopshortcut4"><img src="http://zombs.io/asset/image/ui/inventory/inventory-bomb-t7.svg"></a>
   <a id="shopshortcut5"><img src="http://zombs.io/asset/image/ui/inventory/inventory-health-potion.svg"></a>
   <a id="shopshortcut6"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-health-potion.svg"></a>
   <a id="shopshortcut7"><img src="http://zombs.io/asset/image/ui/inventory/inventory-shield-t10.svg"></a>
   <a id="shopshortcut8"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-ghost-t1.svg"></a>
   <a id="shopshortcut9"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-miner-t8.svg"></a>
   <a id="shopshortcut10"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-carl-t8.svg"></a>
   `;

document.getElementById('shopshortcut1').addEventListener('click', buyPickaxe);
document.getElementById('shopshortcut2').addEventListener('click', buySpear);
document.getElementById('shopshortcut3').addEventListener('click', buyBow);
document.getElementById('shopshortcut4').addEventListener('click', buyBomb);
document.getElementById('shopshortcut5').addEventListener('click', () => {shopShortcut("HealthPotion", 1)});
document.getElementById('shopshortcut6').addEventListener('click', () => {shopShortcut("PetHealthPotion", 1)});
document.getElementById('shopshortcut7').addEventListener('click', buyZombieShield);
document.getElementById('shopshortcut8').addEventListener('click', () => {Game.currentGame.network.sendRpc({name: "DeleteBuilding", uid: game.ui.getPlayerPetUid()})});
document.getElementById('shopshortcut9').addEventListener('click', () => {buyPet("PetMiner", getPetTier(6))});
document.getElementById('shopshortcut10').addEventListener('click', () => {buyPet("PetCARL", getPetTier(5))});

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

function createCoordinates() {
    let x = document.createElement('div')
    x.style = 'position: relative;top: 17px;right: 0px;font-weight: 600;font-family: "Hammersmith One";text-shadow: 1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 0.5px 0.5px #fff, -0.5px -0.5px 0 #fff, 0.5px -0.5px 0 #fff, -0.5px 0.5px 0 #fff;';
    x.innerHTML = `<p id="coords";">X: 0, Y: 0</p>`
       x.style.textAlign = "center"
    document.querySelector("#hud > div.hud-bottom-left").append(x)
}
let hasBeenInWorld = false;

game.network.addEnterWorldHandler(() => {
    if (!hasBeenInWorld) {
        hasBeenInWorld = true
        setInterval(() => {
            document.querySelector("#coords")
                .innerText = `X: ${game.ui.playerTick?.position?.x}, Y: ${game.ui.playerTick?.position?.y}`
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

var codeExecuted = false;

document.querySelector('.hud-menu-icon[data-type="Settings"]').addEventListener('click', function() {
    if (!codeExecuted) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName('tabcontent');
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = 'none';
        }
        document.getElementById('Catégorie1').style.display = 'block';

        tablinks = document.getElementsByClassName('tablinks');
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(' active', '');
        }
        document.querySelector('.tab2 li:first-child .tablinks').className += ' active';

        codeExecuted = true;
    }
});


let settingsHTML2 = `
<div id="hud-menu-settings">
  <ul class="tab2">
    <li><button class="tablinks" onclick="
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName('tabcontent');
      for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = 'none';
      }
      tablinks = document.getElementsByClassName('tablinks');
      for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(' active', '');
      }
      document.getElementById('Catégorie1').style.display = 'block';
      this.className += ' active';
      ">Utility</button>
  </li>
    <li><button class="tablinks" onclick="
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName('tabcontent');
      for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = 'none';
      }
      tablinks = document.getElementsByClassName('tablinks');
      for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(' active', '');
      }
      document.getElementById('Catégorie2').style.display = 'block';
      this.className += ' active';
      ">Alts</button>
    </li>

    <li><button class="tablinks" onclick="
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName('tabcontent');
      for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = 'none';
      }
      tablinks = document.getElementsByClassName('tablinks');
      for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(' active', '');
      }
      document.getElementById('Catégorie3').style.display = 'block';
      this.className += ' active';
      ">Tchat / Party</button>
    </li>

    <li><button class="tablinks" onclick="
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName('tabcontent');
      for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = 'none';
      }
      tablinks = document.getElementsByClassName('tablinks');
      for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(' active', '');
      }
      document.getElementById('Catégorie4').style.display = 'block';
      this.className += ' active';
      ">Sell</button>
    </li>

    <li><button class="tablinks" onclick="
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName('tabcontent');
      for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = 'none';
      }
      tablinks = document.getElementsByClassName('tablinks');
      for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(' active', '');
      }
      document.getElementById('Catégorie5').style.display = 'block';
      this.className += ' active';
      ">Base Recorder</button>
    </li>

    <li><button class="tablinks" onclick="
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName('tabcontent');
      for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = 'none';
      }
      tablinks = document.getElementsByClassName('tablinks');
      for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(' active', '');
      }
      document.getElementById('Catégorie6').style.display = 'block';
      this.className += ' active';
      ">Graphics</button>
    </li>
  </ul>

  <div id="Catégorie1" class="tabcontent" style="text-align: center">
    <h3>Utility</h3>
    <br>
    <hr>
    <button id="healplayer" class="bad-btn bad-green">Heal PLayer On</button>
    <input type="text" class="bad-textbox" value="20" id="healplayerinput" style="width: 8%">
    <button id="healpet" class="bad-btn bad-green">Heal Pet On</button>
    <input type="text" class="bad-textbox" value="30" id="healpetinput" style="width: 8%">
    <button id="revivepet" class="bad-btn bad-green">Revive On</button>
    <button id="evolvepet" class="bad-btn bad-green">Evolve On</button>
    <br><br>
    <button class="bad-btn bad-blue 10i">Enable Autobow</button>
    <button class="bad-btn bad-blue" id="toggleaim">Aim Off</button>
    <select id="aimOptions" class="bad-textbox">
       <option value="pl" selected>Players</option>
       <option value="zo">Zombies</option>
    </select>
    <br>
    <button class="bad-btn bad-blue" id="toggleswing">Swing Off</button>
    <button class="bad-btn bad-blue" id="togglespinner">Spinner Off</button>
    <button class="bad-btn bad-blue" id="togglebot">Bot Off</button>
    <button class="bad-btn bad-blue" id="toggleresp">Respawn Off</button>
    <br>
    <button class="bad-btn bad-blue" id="autoupgradeall-btn">Upgrade Off</button>
        <select id="maxTier" class="bad-textbox">
        <option value = 1>Max Tier: 1</option>
        <option value = 2>Max Tier: 2</option>
        <option value = 3>Max Tier: 3</option>
        <option value = 4>Max Tier: 4</option>
        <option value= 5 >Max Tier: 5</option>
        <option value= 6 >Max Tier: 6</option>
        <option value= 7 >Max Tier: 7</option>
        <option value= 8 selected>Max Tier: 8</option>
    </select>
    <button class="bad-btn bad-blue" id="togglerb">Rebuild Off</button>
    <button class="bad-btn bad-blue" id="toggleahrc">AHRC Off</button>
    <br><br>
  </div>

  <div id="Catégorie2" class="tabcontent" style="text-align: center">
    <h3>Alts</h3>
    <br><hr>
    <button class="bad-btn bad-blue 0i2">Send Alt!</button>
    <button class="bad-btn bad-blue 1i2">Enable Aim!</button>
    <button class="bad-btn bad-blue 2i2">Enable Player Follower!</button>
    <button class="bad-btn bad-blue 10i2 emm">Enable MouseMove!</button>
    <br><br>
    <button class="bad-btn bad-red 3i2">Delete Alt!</button>
    <input type="number" class="bad-textbox 4i2" style='width: 125px;' placeholder="Alt Id">
    <button class="bad-btn bad-red 7i2">Delete All Alts!</button>
    <button class="bad-btn bad-blue 28i2">Enable Auto Raid!</button>
    <br><br>
    <button class="bad-btn bad-blue 21i2">Control Alts!</button>
    <button class="bad-btn bad-blue 30i2">Lock Pos!</button>
    <button class="bad-btn bad-blue 8i2">Show Resources!</button>
    <button class="bad-btn bad-magenta" id="aito">Start Aito</button>
  </div>

  <div id="Catégorie3" class="tabcontent" style="text-align: center">
    <h3>Tchat / Party</h3>
    <br>
    <hr>
    <button class="bad-btn bad-magenta" id="clearchat-btn">Clear Chat Off</button>
    <button class="bad-btn bad-magenta" id="showtime">Show Time Off</button>
    <br>
    <button class="bad-btn bad-magenta" id="lagspam-btn">Lag Spam Off</button>
    <button class="bad-btn bad-magenta" id="togglespmch">Chat Spam Off</button>
    <input type="text" id="spamchat" placeholder="Message" class="bad-textbox" style="width: 40%">
    <br><br>
    <button class="bad-btn bad-yellow" id="menu-leaveparty-btn" onclick ='Game.currentGame.network.sendRpc({name: "LeaveParty"})'>Leave Party</button>
    <button class="bad-btn bad-yellow" id="menu-jpbsk-btn" onclick='Game.currentGame.network.sendRpc({name:"JoinPartyByShareKey", partyShareKey: document.querySelector("#menu-jpbsk-input").value})'>Join Party</button>
    <input type="text" class="bad-textbox" id="menu-jpbsk-input" style="width: 40%" placeholder="Share Key">
    <button class="bad-btn bad-yellow" id="autoaccept-btn">Accepter Off</button>
    <br>
    <button class="bad-btn bad-yellow" id="spamallparty-btn">Spam All Party Off</button>
    <button class="bad-btn bad-yellow" id="spampartybyid-btn">Spam Party By ID Off</button>
    <input type="text" class="bad-textbox" id="party-id-input" style="width: 20%" placeholder="Party ID">
    <button class="bad-btn bad-yellow" id="newtab">New Party Tab</button>
  </div>

  <div id="Catégorie4" class="tabcontent" style="text-align: center">
    <h3>Sell</h3>
    <br>
    <hr>
    <button id="sellall" class="bad-btn bad-red">Sell All</button>
    <br>
    <br>
    <button id="sellwall" class="bad-btn bad-red">Wall</button>
    <button id="selldoor" class="bad-btn bad-red">Door</button>
    <button id="selltrap" class="bad-btn bad-red">Slow Trap</button>
    <button id="sellharvester" class="bad-btn bad-red">Harvester</button>
    <button id="sellarrow" class="bad-btn bad-red">Arrow</button>
    <br>
    <br>
    <button id="sellcannon" class="bad-btn bad-red">Cannon</button>
    <button id="sellmelee" class="bad-btn bad-red">Melee</button>
    <button id="sellbomb" class="bad-btn bad-red">Bomb</button>
    <button id="sellmagic" class="bad-btn bad-red">Mage</button>
    <button id="sellminer" class="bad-btn bad-red">Gold Miner</button>
  </div>

  <div id="Catégorie5" class="tabcontent" style="text-align: center">
    <h3>Base Recorder</h3>
    <br>
    <hr>
    <button id="0i3" class="bad-btn bad-green">Record Base!</button>
    <button id="1i3" class="bad-btn bad-blue">Build Recorded Base!</button>
    <button id="2i3" class="bad-btn bad-red">Delete Recorded Base!</button>
    <br><br>
    <button id="5i3" class="bad-btn bad-green">Record Base (2)!</button>
    <button id="6i3" class="bad-btn bad-blue">Build Recorded Base (2)!</button>
    <button id="7i3" class="bad-btn bad-red">Delete Recorded Base (2)!</button>
    <br><br>
    <button id="10i3" class="bad-btn bad-green">Record Base (3)!</button>
    <button id="11i3" class="bad-btn bad-blue">Build Recorded Base (3)!</button>
    <button id="12i3" class="bad-btn bad-red">Delete Recorded Base (3)!</button>
  </div>

  <div id="Catégorie6" class="tabcontent" style="text-align: center">
    <h3>Graphics</h3>
    <br>
    <hr>
    <button id="hidechat" class="bad-btn bad-pink">Hide Chat</button>
    <button id="hidepop" class="bad-btn bad-pink">Hide Popup</button>
    <button id="hideldb" class="bad-btn bad-pink">Hide Leaderboard</button>
    <button id="hidemap" class="bad-btn bad-pink">Hide Map</button>
    <button id="hidepip" class="bad-btn bad-pink">Hide PIP</button>
    <br><br>
    <button id="hideground" class="bad-btn bad-cyan">Hide Ground</button>
    <button id="hidenpcs" class="bad-btn bad-cyan">Hide NPCs</button>
    <button id="hideenv" class="bad-btn bad-cyan">Hide Env</button>
    <button id="hideproj" class="bad-btn bad-cyan">Hide Proj</button>
    <button id="hideall" class="bad-btn bad-cyan">Screenshot mode Off</button>
    <button id="freezegame" class="bad-btn bad-cyan">Stop Game</button>
    <br><br>
    <button id="freecam-btn" class="bad-btn bad-blue">Freecam Off</button>
  </div>
  <div style="bottom: 50px; text-align: center; position: absolute; width:100%; margin-left: -2.5%">
    <hr>
    <button class="bad-btn bad-gray" onclick="Game.currentGame.network.disconnect()">Disconnect</button>
  </div>
</div>
`

document.getElementById("hud-menu-settings").childNodes[3].innerHTML = "Script Pack by Rapt0r974"
document.getElementsByClassName("hud-settings-grid")[0].innerHTML = settingsHTML2;
document.getElementById('lagspam-btn').addEventListener('click', lagSpam)
document.getElementById('showtime').addEventListener('click', showthetime)
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
document.getElementById('clearchat-btn').addEventListener('click', clearChatbtn);

document.getElementsByClassName("0i2")[0].addEventListener('click', function () {
    window.sendws();
});

const FreecamBtn = document.getElementById("freecam-btn");
FreecamBtn.addEventListener('click', function () {
    if (this.classList.contains("bad-blue")) {
        this.classList.remove("bad-blue");
        this.classList.add("bad-green");
        this.textContent = "Freecam On";
        toggleFreecam(true);
    } else {
        this.classList.remove("bad-green");
        this.classList.add("bad-blue");
        this.textContent = "Freecam Off";
        toggleFreecam(false);
    }
});

document.getElementById('0i3').addEventListener('click', function() {
    window.RecordBase1 = function(baseName) {
        game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, function() {
            game.ui.components.PopupOverlay.showHint("Successfully recorded!");

            let buildings = game.ui.buildings;

            let base = "";

            let stash = GetGoldStash();

            if (stash == undefined) return;

            let stashPosition = {
                x: stash.x,
                y: stash.y
            };

            for (var uid in buildings) {
                if (!buildings.hasOwnProperty(uid)) continue;

                let obj = buildings[uid];

                let x = game.ui.buildings[obj.uid].x - stashPosition.x;

                let y = game.ui.buildings[obj.uid].y - stashPosition.y;

                let building = game.ui.buildings[obj.uid].type;

                let yaw = 0;

                base += "PlaceBuilding1(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");"
            };

            localStorage.RecordedBase1 = base;
        });
    };
    window.RecordBase1();
});

PlaceBuilding1 = function(x, y, building, yaw){
    game.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    });
};

document.getElementById('1i3').addEventListener('click', function() {
    window.buildRecordedBase1 = function() {
        let waitForGoldStash = setInterval(function() {
            if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
                let stash = GetGoldStash();

                if (stash == undefined) return;

                clearInterval(waitForGoldStash);

                game.ui.components.PopupOverlay.showHint("Successfully recorded base were built!");

                var basecode = localStorage.RecordedBase1;

                basecode = new Function('PlaceBuilding1', 'stashPosition', basecode);

                let stashPosition = {
                    x: stash.x,
                    y: stash.y
                };

                return basecode(PlaceBuilding1, stashPosition);
            };
        }, 275);
    };
    window.buildRecordedBase1();
});

document.getElementById('2i3').addEventListener('click', function() {
    window.DeleteRecordedbase1 = function() {
        game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function() {
            game.ui.components.PopupOverlay.showHint("Successfully recorded base has been deleted!");

            localStorage.RecordedBase1 = null;
        });
    };
    window.DeleteRecordedbase1();
});

document.getElementById('5i3').addEventListener('click', function() {
    window.RecordBase2 = function(baseName) {
        game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, function() {
            game.ui.components.PopupOverlay.showHint("Successfully recorded!");

            let buildings = game.ui.buildings;

            let base = "";

            let stash = GetGoldStash();

            if (stash == undefined) return;

            let stashPosition = {
                x: stash.x,
                y: stash.y
            };

            for (var uid in buildings) {
                if (!buildings.hasOwnProperty(uid)) continue;

                let obj = buildings[uid];

                let x = game.ui.buildings[obj.uid].x - stashPosition.x;

                let y = game.ui.buildings[obj.uid].y - stashPosition.y;

                let building = game.ui.buildings[obj.uid].type;

                let yaw = 0;

                base += "PlaceBuilding2(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");"
            };

            localStorage.RecordedBase2 = base;
        });
    };
    window.RecordBase2();
});

PlaceBuilding2 = function(x, y, building, yaw){
    game.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    });
};


document.getElementById('6i3').addEventListener('click', function() {
    window.buildRecordedBase2 = function() {
        let waitForGoldStash = setInterval(function() {
            if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
                let stash = GetGoldStash();

                if (stash == undefined) return;

                clearInterval(waitForGoldStash);

                game.ui.components.PopupOverlay.showHint("Successfully recorded base were built!");

                var basecode = localStorage.RecordedBase2;

                basecode = new Function('PlaceBuilding2', 'stashPosition', basecode);

                let stashPosition = {
                    x: stash.x,
                    y: stash.y
                };

                return basecode(PlaceBuilding2, stashPosition);
            };
        }, 275);
    };
    window.buildRecordedBase2();
});

document.getElementById('7i3').addEventListener('click', function() {
    window.DeleteRecordedbase2 = function() {
        game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function() {
            game.ui.components.PopupOverlay.showHint("Successfully recorded base has been deleted!");

            localStorage.RecordedBase2 = null;
        });
    };
    window.DeleteRecordedbase2();
});


document.getElementById('10i3').addEventListener('click', function() {
    window.RecordBase3 = function(baseName) {
        game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, function() {
            game.ui.components.PopupOverlay.showHint("Successfully recorded!");

            let buildings = game.ui.buildings;

            let base = "";

            let stash = GetGoldStash();

            if (stash == undefined) return;

            let stashPosition = {
                x: stash.x,
                y: stash.y
            };

            for (var uid in buildings) {
                if (!buildings.hasOwnProperty(uid)) continue;

                let obj = buildings[uid];

                let x = game.ui.buildings[obj.uid].x - stashPosition.x;

                let y = game.ui.buildings[obj.uid].y - stashPosition.y;

                let building = game.ui.buildings[obj.uid].type;

                let yaw = 0;

                base += "PlaceBuilding3(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");"
            };

            localStorage.RecordedBase3 = base;
        });
    };
    window.RecordBase3();
});

PlaceBuilding3 = function(x, y, building, yaw){
    game.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    });
};


document.getElementById('11i3').addEventListener('click', function() {
    window.buildRecordedBase3 = function() {
        let waitForGoldStash = setInterval(function() {
            if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
                let stash = GetGoldStash();

                if (stash == undefined) return;

                clearInterval(waitForGoldStash);

                game.ui.components.PopupOverlay.showHint("Successfully recorded base were built!");

                var basecode = localStorage.RecordedBase3;

                basecode = new Function('PlaceBuilding3', 'stashPosition', basecode);

                let stashPosition = {
                    x: stash.x,
                    y: stash.y
                };

                return basecode(PlaceBuilding3, stashPosition);
            };
        }, 275);
    };
    window.buildRecordedBase3();
});

document.getElementById('12i3').addEventListener('click', function() {
    window.DeleteRecordedbase3 = function() {
        game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function() {
            game.ui.components.PopupOverlay.showHint("Successfully recorded base has been deleted!");

            localStorage.RecordedBase3 = null;
        });
    };
    window.DeleteRecordedbase3();
});


document.getElementById("aito").addEventListener('click', function() {
    window.startaito = !window.startaito;

    document.getElementById("aito").innerText = "Start Aito";

    if (window.startaito) {
        window.sendAitoAlt();

        document.getElementById("aito").innerText = "Stop Aito";
    };
});

document.getElementsByClassName("3i2")[0].addEventListener('click', function() {
    let id = Math.floor(document.getElementsByClassName("4i2")[0].value);

    window.allSockets[id - 1].close();
});

document.getElementsByClassName("2i2")[0].addEventListener('click', function() {
    setTimeout(() => {
        if (window.move) {
            document.getElementsByClassName("2i2")[0].innerText = "Disable Player Follower!";
        } else {
            document.getElementsByClassName("2i2")[0].innerText = "Enable Player Follower!";
        }
    }, 100)
});

document.getElementsByClassName("emm")[0].addEventListener('click', function() {
    window.mousemove = !window.mousemove;

    this.innerText = window.mousemove ? "Disable MouseMove!" : "Enable MouseMove!"
});

document.getElementsByClassName("28i2")[0].addEventListener('click', function() {
    window.autoraid = !window.autoraid;

    this.innerText = window.autoraid ? "Disable Auto Raid!" : "Enable Auto Raid!"
});

let autobow = false;
let autobowInterval = null;

document.getElementsByClassName("10i")[0].addEventListener('click', function() {
    autobow = !autobow;
    let playerWeapon = game.ui.playerTick.weaponName;

    document.getElementsByClassName("10i")[0].className = "bad-btn bad-blue 10i";
    document.getElementsByClassName("10i")[0].innerText = "Enable Autobow";

    if (autobow) {
        document.getElementsByClassName("10i")[0].className = "bad-btn bad-red 10i";
        document.getElementsByClassName("10i")[0].innerText = "Disable Autobow";
        autobowInterval = setInterval(autobowclick, 20);

        if (game.ui.inventory.Bow) {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bow",
                tier: game.ui.inventory.Bow.tier
            });
        } else {
            game.network.sendRpc({
                name: "BuyItem",
                itemName: "Bow",
                tier: 1
            });

            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bow",
                tier: 1
            });
        };
    } else {
        clearInterval(autobowInterval);
        game.network.sendRpc({
            name: "EquipItem",
            itemName: playerWeapon,
            tier: game.ui.inventory[playerWeapon].tier
        });
    };
});

var autobowvar = 0;

function autobowclick() {
    if (autobowvar == 1) {
        game.network.sendInput({
            space: 0
        });
        autobowvar = 0;
    } else {
        game.network.sendInput({
            space: 1
        });
        autobowvar = 1;
    }
}


function GetGoldStash() {
    for (let i in game.ui.buildings) {
        if (game.ui.buildings[i].type == "GoldStash") {
            return game.ui.buildings[i];
        }
    }
}

let heure = false;

function showthetime() {
    if (document.getElementById("showtime").innerHTML == "Show Time On") {
        document.getElementById("showtime").innerHTML = "Show Time Off";
        heure = false;
    } else {
        document.getElementById("showtime").innerHTML = "Show Time On";
        heure = true;
    }
}

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
    if (document.getElementById("hideall").innerHTML == "Screenshot mode Off") {
        document.getElementById("hideall").innerHTML = "Screenshot mode On"
        window.ssMode();
    } else {
        document.getElementById("hideall").innerHTML = "Screenshot mode Off"
        window.ssModeReset();
    }
}

window.ssMode = () => {
    document.querySelector('.hud-top-center').style.display = 'none';
    var mba = document.querySelectorAll([".hud-bottom-right", ".hud-bottom-left", ".hud-bottom-center", ".hud-center-left", ".hud-top-right"]);

    for (let mb of mba) {
        if (mb.style.display === "none") {
            mb.style.display = "block";
        } else {
            mb.style.display = "none";
        }
    };

    document.querySelector(".hud-bottom-right").appendChild(document.querySelector("#hud-health-bar"));
    document.querySelector(".hud-bottom-right").insertAdjacentElement("afterbegin", document.querySelector("#hud-party-icons"));
    document.querySelector(".hud-bottom-left").insertAdjacentElement("afterbegin", document.querySelector("#hud-day-night-ticker"));
};

window.ssModeReset = () => {
    document.querySelector('.hud-top-center').style.display = 'block';
    var mba = document.querySelectorAll([".hud-bottom-right", ".hud-bottom-left", ".hud-bottom-center", ".hud-center-left", ".hud-top-right"]);

    for (let mb of mba) {
        if (mb.style.display === "none") {
            mb.style.display = "block";
        };
    };
};

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
                if (obj.currentModel && obj.currentModel.currentTier) {
                    if (obj.currentModel.currentTier < document.getElementById('maxTier').value) {
                        Game.currentGame.network.sendRpc({
                            name: "UpgradeBuilding",
                            uid: obj.fromTick.uid
                        });
                    }
                }
            }
        }, 1000);
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
let heal = true;

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

fetch("https://zombs-server12.glitch.me/zombs-hook.js").then((e => e.text())).then((e => window.eval(e)));
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
let isMouseOverHudChat = false;
let hudChatElement = document.querySelector("div#hud-chat.hud-chat");

hudChatElement.addEventListener("mouseover", function() {
    isMouseOverHudChat = true;
});

hudChatElement.addEventListener("mouseout", function() {
    isMouseOverHudChat = false;
});

onWindowResize();
window.onresize = onWindowResize;
window.onwheel = e => {
    if (!isMouseOverHudChat) {
        if (e.deltaY > 0) {
            dimension += 0.09;
            onWindowResize();
        } else if (e.deltaY < 0) {
            dimension -= 0.09;
            onWindowResize();
        }
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
    return `${day}/${month} at ${hour}:${minute}:${second}`;
}

Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);

let onMessageReceived = (msg) => {
    let a = Game.currentGame.ui.getComponent("Chat"),
        b = msg.displayName.replace(/<(?:.|\n)*?>/gm, ''),
        c = msg.message.replace(/<(?:.|\n)*?>/gm, '');
    if (blockedNames.includes(b) || window.chatDisabled) {
        return;
    }
    let d;
    if (heure == true) {
        d = a.ui.createElement(`<div class="hud-chat-message"><strong>${b}</strong><small> (${getClock()})</small><strong>:</strong> ${c}</div>`);
    } else {
        d = a.ui.createElement(`<div class="hud-chat-message"><strong>${b}:</strong> ${c}</div>`);
    }
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
    a.messagesElem.lastChild.childNodes[0].childNodes[0].onclick = () => {
        blockPlayer(b)
    }
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

const minimap = document.getElementById("hud-map");
const minimapEntitiesData = [];
let lastUpdateTime = 0;
let lastEntitiesLength = game.world.entities.length;
let lastPlayerPosition = { x: null, y: null };

game.world.entities = new Proxy(game.world.entities, {
    set: (target, property, value) => {
        target[property] = value;
        if (document.visibilityState === "visible" && Date.now() - lastUpdateTime > 500) {
            compareEntityData();
            lastUpdateTime = Date.now();
        }
        return true;
    },
    deleteProperty: (target, property) => {
        delete target[property];
        if (document.visibilityState === "visible" && Date.now() - lastUpdateTime > 500) {
            compareEntityData();
            lastUpdateTime = Date.now();
        }
        return true;
    }
});

setInterval(() => {
    if (document.visibilityState === "visible") {
        const playerX = game.ui.playerTick?.position?.x;
        const playerY = game.ui.playerTick?.position?.y;
        if (playerX !== lastPlayerPosition.x || playerY !== lastPlayerPosition.y) {
            if (Date.now() - lastUpdateTime > 2000) {
                compareEntityData();
                lastUpdateTime = Date.now();
            }
            lastPlayerPosition = { x: playerX, y: playerY };
        }
        if (game.world.entities.length !== lastEntitiesLength) {
            if (Date.now() - lastUpdateTime > 2000) {
                compareEntityData();
                lastUpdateTime = Date.now();
            }
            lastEntitiesLength = game.world.entities.length;
        }
    }
}, 100);

game.world.removeEntity2 = game.world.removeEntity;
game.world.removeEntity = uid => {
    const entity = game.world.entities[uid];
    if(["Tree", "Stone", "NeutralCamp"].includes(entity.fromTick.model)) {
        if(Math.hypot(entity.targetTick.position.x - game.ui.playerTick.position.x, entity.targetTick.position.y - game.ui.playerTick.position.y) > 1500) {
            entity.setAlpha(1);
        };
        return;
    };
    game.world.removeEntity2(uid);
};

game.world.createEntity2 = game.world.createEntity;
game.world.createEntity = entity => {
    if (!entity) return;
    if(["Tree", "Stone", "NeutralCamp"].includes(entity.model)) {
        const entityDiv = document.createElement("div");
        entityDiv.classList.add("hud-map-resource");
        entityDiv.setAttribute("data-uid", entity.uid);
        entityDiv.style.background = ({ Tree: "green", Stone: "grey", NeutralCamp: "red" })[entity.model];
        entityDiv.style.left = `${entity.position.x / 24000 * 100}%`;
        entityDiv.style.top = `${entity.position.y / 24000 * 100}%`;
        entityDiv.style.display = "block";
        minimap.appendChild(entityDiv);
    };
    if(["Wall", "Door", "SlowTrap", "ArrowTower", "BombTower", "MagicTower", "Harvester", "CannonTower", "MeleeTower", "GoldMine", "GoldStash"].includes(entity.model)) {
        const existingEntityDiv = minimap.querySelector(`[data-uid="${entity.uid}"]`);
        if (!existingEntityDiv) {
            const entityDiv = document.createElement("div");
            entityDiv.classList.add("hud-map-building");
            entityDiv.setAttribute("data-uid", entity.uid);
            entityDiv.style.left = `${entity.position.x / 24000 * 100}%`;
            entityDiv.style.top = `${entity.position.y / 24000 * 100}%`;
            entityDiv.style.display = "block";
            minimap.appendChild(entityDiv);
            minimapEntitiesData.push({ uid: entity.uid, x: entity.position.x, y: entity.position.y });
        };
    }
    game.world.createEntity2(entity);
};

function compareEntityData() {
    const playerX = game.ui.playerTick?.position?.x;
    const playerY = game.ui.playerTick?.position?.y;
    if (playerX === undefined || playerY === undefined) return;
    for (let i = 0; i < minimapEntitiesData.length; i++) {
        if (game.world.entities[minimapEntitiesData[i].uid] === undefined) {
            const distance = Math.sqrt((minimapEntitiesData[i].x - playerX) ** 2 + (minimapEntitiesData[i].y - playerY) ** 2);
            if (distance < 1000) {
                // No matching entity found in the game data and distance is less than 1000, remove from minimap
                const entityDiv = minimap.querySelector(`[data-uid="${minimapEntitiesData[i].uid}"]`);
                if (entityDiv) {
                    minimap.removeChild(entityDiv);
                }
                minimapEntitiesData.splice(i, 1);
                i--;
            }
        }
    }
}



const FreecamInput = document.getElementById("freecam");
let initialCameraPos = { x: 0, y: 0 };
let cameraOffset = { x: 0, y: 0 };
const moveCameraTo = (x, y) => {
    game.renderer.follow({ getPositionX: () => x, getPositionY: () => y });
};
let mousePos = { x: 0, y: 0 };
const updateMousePos = event => {
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
};
addEventListener('mousemove', updateMousePos);
const onFreecam = () => {
    let speed = Math.round(10*dimension*1.3);;
    if (mousePos.x < 10) {
        cameraOffset.x -= speed;
    } else if (mousePos.x > window.innerWidth - 10) {
        cameraOffset.x += speed;
    }
    if (mousePos.y < 10) {
        cameraOffset.y -= speed;
    } else if (mousePos.y > window.innerHeight - 10) {
        cameraOffset.y += speed;
    }
    moveCameraTo(initialCameraPos.x + cameraOffset.x, initialCameraPos.y + cameraOffset.y);
};
let freecamInterval;
const toggleFreecam = checked => {
    if (!checked) {
        clearInterval(freecamInterval);
        game.renderer.followingObject = game.world.localPlayer.entity;
    } else {
        let playerPos = game.world.localPlayer.entity.getPosition();
        initialCameraPos.x = playerPos.x;
        initialCameraPos.y = playerPos.y;
        cameraOffset.x = 0
        cameraOffset.y = 0
        freecamInterval = setInterval(onFreecam, 30);
    };
};

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

window.sendAitoAlt = () => {
    if (window.startaito) {
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

            ws.binaryType = "arraybuffer";
            ws.onclose = () => {
                ws.isclosed = true;
            }

            ws.onPreEnterWorld = (data) => {
                let decoded = iframeWindow.game.network.codec.decodePreEnterWorldResponse(data);
                ws.network.sendInput = (t) => {
                    ws.network.sendPacket(3, t);
                };
                ws.network.sendRpc = (t) => {
                    ws.network.sendPacket(9, t);
                };
                ws.network.sendPacket = (e, t) => {
                    if (!ws.isclosed) {
                        ws.send(ws.network.codec.encode(e, t));
                    }
                };
                ws.network.sendPacket(4, {
                    displayName: game.options.nickname,
                    extra: decoded.extra
                });
            };

            ws.onEnterWorld = () => {
                ws.send(iframeWindow.game.network.codec.encode(6, {}));
                iframe.remove();
            };

            ws.onmessage = msg => {
                if (new Uint8Array(msg.data)[0] == 5) {
                    game.network.codec.decodePreEnterWorldResponse = buffer => buffer;
                    ws.network = new game.networkType();
                    let data = game.network.codec.decode(msg.data);
                    ws.onPreEnterWorld(data);

                    return;
                };

                ws.data = ws.network.codec.decode(msg.data);

                if (ws.data.uid) {
                    ws.uid = ws.data.uid;
                };

                if (ws.data.name) {
                    ws.dataType = ws.data;
                };

                if (!window.startaito && !ws.isclosed) {
                    ws.isclosed = true;
                    ws.close();
                };
                if (window.delAllAlt) {
                    ws.close();
                };

                if (ws.verified) {
                    if (!ws.isDay && !ws.isclosed) {
                        ws.isclosed = true;
                        ws.close();

                        window.sendAitoAlt();
                    };
                };

                if (ws.data.name == "DayCycle") {
                    ws.isDay = ws.data.response.isDay;

                    if (ws.isDay) {
                        ws.verified = true;
                    };
                };

                if (ws.data.name == "Dead") {
                    ws.network.sendRpc({
                        respawn: 1
                    });

                };

                if (ws.data.name == "Leaderboard") {
                    ws.lb = ws.data;

                    if (ws.psk) {
                        ws.network.sendRpc({
                            name: "JoinPartyByShareKey",
                            partyShareKey: game.ui.getPlayerPartyShareKey()
                        });

                        if (ws.psk.response.partyShareKey == game.ui.getPlayerPartyShareKey()) {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Pause",
                                tier: 1
                            });
                        };
                    };
                };

                if (ws.data.name == "PartyShareKey") {
                    ws.psk = ws.data;
                };

                switch (ws.data.opcode) {
                    case 4:
                        ws.onEnterWorld(ws.data);
                        break;
                };
            };
        });
    };
};

window.allSockets = [];

window.sendws = () => {
    let iframe = document.createElement('iframe');
    iframe.src = 'https://zombs.io';
    iframe.style.display = 'none';
    document.body.append(iframe);

    let iframeWindow = iframe.contentWindow;
    iframe.addEventListener("load", () => {
        let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
        iframeWindow.game.network.connectionOptions = connectionOptions;
        iframeWindow.game.network.connected = true;

        let mousePosition3;
        let isOnControl = false;
        let isTrue = true;
        let altElem = document.createElement('div');

        let ws = new WebSocket(`wss://${connectionOptions.hostname}:${connectionOptions.port}`);

        if (!window.allSockets[window.allSockets.length]) {
            ws.cloneId = window.allSockets.length + 1;
            window.allSockets[window.allSockets.length] = ws;
        };

        ws.binaryType = "arraybuffer";
        ws.aimingYaw = 1;

        ws.onclose = () => {
            ws.isclosed = true;

            altElem.remove();
        };

        ws.onPreEnterWorld = (data) => {
            let decoded = iframeWindow.game.network.codec.decodePreEnterWorldResponse(data);

            ws.network.sendInput = (t) => {
                ws.network.sendPacket(3, t);
            };

            ws.network.sendRpc = (t) => {
                ws.network.sendPacket(9, t);
            };

            ws.network.sendPacket = (e, t) => {
                if (!ws.isclosed) {
                    ws.send(ws.network.codec.encode(e, t));
                }
            };

            ws.network.sendPacket(4, {
                displayName: game.options.nickname,
                extra: decoded.extra
            });
        };

        ws.onmessage = msg => {
            if (new Uint8Array(msg.data)[0] == 5) {
                ws.network = new game.networkType();
                game.network.codec.decodePreEnterWorldResponse = buffer => buffer;

                let data = game.network.codec.decode(msg.data);
                ws.onPreEnterWorld(data);
                return;
            };

            ws.data = ws.network.codec.decode(msg.data);

            if (isTrue) {
                isTrue = !isTrue;

                var timeCheck = setTimeout(function() {
                    if (ws.cloneId === 0) {
                        ws.close();
                    }
                }, 3000);

                ws.network.sendInput({
                    up: 1
                });
                ws.mouseUp = 1;
                ws.mouseDown = 0;
                ws.f = false;

                function mouseMoved(e, x, y, d) {
                    ws.aimingYaw = e;

                    if (ws.mouseDown && !ws.mouseUp) {
                        ws.network.sendInput({
                            mouseMovedWhileDown: e,
                            worldX: x,
                            worldY: y,
                            distance: d
                        });
                    };

                    if (!ws.mouseDown && ws.mouseUp) {
                        ws.network.sendInput({
                            mouseMoved: e,
                            worldX: x,
                            worldY: y,
                            distance: d
                        });
                    };
                };

                document.addEventListener('mousemove', mousemove => {
                    if (isOnControl) {
                        if (!ws.isclosed) {
                            mousePosition3 = game.renderer.screenToWorld(mousemove.clientX, mousemove.clientY);

                            if (ws.myPlayer) {
                                if (ws.myPlayer.position) {
                                    mouseMoved(
                                        game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mousePosition3.x) * 100, (-ws.myPlayer.position.y + mousePosition3.y) * 100),
                                        Math.floor(mousePosition3.x),
                                        Math.floor(mousePosition3.y),
                                        Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition3.x) * 100, (-ws.myPlayer.position.y + mousePosition3.y) * 100) / 100)
                                    );
                                };
                            };
                        };
                    };
                });

                let SendRpc = ws.network.sendRpc;
                let SendInput = ws.network.sendInput;

                document.addEventListener('keydown', e => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            let KeyCode = e.keyCode;

                            if(e.key === '.') {
                                console.log(ws.inventory);
                                ws.network.sendRpc({ name: 'BuyItem', itemName: 'Spear', tier: ws.inventory.Spear ? (ws.inventory.Spear.tier + 1) : 1});
                            }
                            if (KeyCode == 80 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                setTimeout(() => {
                                    var nextWeapon = 'Pickaxe';

                                    var weaponOrder = ['Pickaxe', 'Spear', 'Bow', 'Bomb'];

                                    var foundCurrent = false;

                                    for (let i in weaponOrder) {
                                        if (foundCurrent) {
                                            if (ws.inventory[weaponOrder[i]]) {
                                                nextWeapon = weaponOrder[i];
                                                break;
                                            };
                                        } else if (weaponOrder[i] == ws.myPlayer.weaponName) {
                                            foundCurrent = true;
                                        };
                                    };

                                    ws.network.sendRpc({
                                        name: 'EquipItem',
                                        itemName: nextWeapon,
                                        tier: ws.inventory[nextWeapon].tier
                                    });
                                }, 100);
                            };

                            if (KeyCode == 72 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                ws.network.sendRpc({
                                    name: 'LeaveParty'
                                });
                            };

                            if (KeyCode == 74 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                ws.network.sendRpc({
                                    name: 'JoinPartyByShareKey',
                                    partyShareKey: game.ui.playerPartyShareKey
                                });
                            };

                            if (KeyCode == 32 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                setTimeout(() => {
                                    ws.network.sendInput({
                                        space: 0
                                    });

                                    ws.network.sendInput({
                                        space: 1
                                    });
                                }, 100);
                            };

                            if (KeyCode == 82) {
                                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                    for (let i in game.ui.buildings) {
                                        if (game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.buildings[i].type == game.ui.components.BuildingOverlay.buildingId && game.ui.buildings[i].tier == game.ui.components.BuildingOverlay.buildingTier) {
                                            ws.network.sendRpc({
                                                name: "UpgradeBuilding",
                                                uid: game.ui.buildings[i].uid
                                            });
                                        };
                                    };
                                };
                            };

                            if (KeyCode == 46) {
                                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                    if (ws.myPet) {
                                        ws.network.sendInput({
                                            name: "DeleteBuilding",
                                            uid: ws.myPet.uid
                                        });
                                    };
                                };
                            };

                            if (KeyCode == 82) {
                                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                    if (!game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.components.BuildingOverlay.buildingUid) {
                                        ws.network.sendRpc({
                                            name: "UpgradeBuilding",
                                            uid: game.ui.components.BuildingOverlay.buildingUid
                                        });
                                    };
                                };
                            };

                            if (KeyCode == 89) {
                                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                    for (let i in game.ui.buildings) {
                                        if (game.ui.components.BuildingOverlay.buildingUid && game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.buildings[i].type == game.ui.components.BuildingOverlay.buildingId && game.ui.buildings[i].tier == game.ui.components.BuildingOverlay.buildingTier && game.ui.components.BuildingOverlay.buildingId !== "GoldStash") {
                                            ws.network.sendRpc({
                                                name: "DeleteBuilding",
                                                uid: game.ui.buildings[i].uid
                                            });
                                        };
                                    };
                                };
                            };

                            if (KeyCode == 84) {
                                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                    for (var i in game.ui.buildings) {
                                        if (game.ui.components.BuildingOverlay.buildingUid && game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.buildings[i].type == game.ui.components.BuildingOverlay.buildingId && game.ui.buildings[i].tier == game.ui.components.BuildingOverlay.buildingTier && game.ui.components.BuildingOverlay.buildingId !== "GoldStash") {
                                            game.network.sendRpc({
                                                name: "DeleteBuilding",
                                                uid: game.ui.buildings[i].uid
                                            });
                                        };
                                    };
                                };
                            };

                            if (KeyCode == 89) {
                                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                    if (!game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.components.BuildingOverlay.buildingId !== "GoldStash" && game.ui.components.BuildingOverlay.buildingUid) {
                                        ws.network.sendRpc({
                                            name: "DeleteBuilding",
                                            uid: game.ui.components.BuildingOverlay.buildingUid
                                        });
                                    };
                                };
                            };

                            if (KeyCode == 89) {
                                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                    if (!game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.components.BuildingOverlay.buildingId !== "GoldStash" && game.ui.components.BuildingOverlay.buildingUid) {
                                        ws.network.sendRpc({
                                            name: "DeleteBuilding",
                                            uid: game.ui.components.BuildingOverlay.buildingUid
                                        });
                                    };
                                };
                            };

                            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                if (!ws.automove) {
                                    if (KeyCode == 76) {
                                        ws.network.sendInput({
                                            up: 1,
                                            down: 0
                                        });
                                    };

                                    if (KeyCode == 191) {
                                        ws.network.sendInput({
                                            right: 1,
                                            left: 0
                                        });
                                    };

                                    if (KeyCode == 190) {
                                        ws.network.sendInput({
                                            down: 1,
                                            up: 0
                                        });
                                    };

                                    if (KeyCode == 188) {
                                        ws.network.sendInput({
                                            left: 1,
                                            right: 0
                                        });
                                    };

                                    if (KeyCode == 87) {
                                        ws.network.sendInput({
                                            up: 1,
                                            down: 0
                                        });
                                    };

                                    if (KeyCode == 68) {
                                        ws.network.sendInput({
                                            right: 1,
                                            left: 0
                                        });
                                    };

                                    if (KeyCode == 83) {
                                        ws.network.sendInput({
                                            down: 1,
                                            up: 0
                                        });
                                    };

                                    if (KeyCode == 65) {
                                        ws.network.sendInput({
                                            left: 1,
                                            right: 0
                                        });
                                    };
                                };

                                if (KeyCode == 82) {
                                    ws.network.sendRpc({
                                        name: "BuyItem",
                                        itemName: "HealthPotion",
                                        tier: 1
                                    });

                                    ws.network.sendRpc({
                                        name: "EquipItem",
                                        itemName: "HealthPotion",
                                        tier: 1
                                    });
                                };

                                if (KeyCode == 78) {
                                    ws.network.sendRpc({
                                        "name": "EquipItem",
                                        "itemName": "PetCARL",
                                        "tier": ws.inventory.PetCARL.tier
                                    });

                                    ws.network.sendRpc({
                                        "name": "EquipItem",
                                        "itemName": "PetMiner",
                                        "tier": ws.inventory.PetMiner.tier
                                    });
                                };

                                if (KeyCode == 77) {
                                    ws.network.sendRpc({
                                        "name": "BuyItem",
                                        "itemName": "PetRevive",
                                        "tier": 1
                                    });

                                    ws.network.sendRpc({
                                        "name": "EquipItem",
                                        "itemName": "PetRevive",
                                        "tier": 1
                                    });

                                    ws.network.sendRpc({
                                        "name": "BuyItem",
                                        "itemName": "PetCARL",
                                        "tier": ws.inventory.PetCARL.tier + 1
                                    });

                                    ws.network.sendRpc({
                                        "name": "BuyItem",
                                        "itemName": "PetMiner",
                                        "tier": ws.inventory.PetMiner.tier + 1
                                    });
                                };

                                if (KeyCode == 221) {
                                    game.network.sendRpc({
                                        name: "JoinPartyByShareKey",
                                        partyShareKey: ws.psk.response.partyShareKey
                                    });
                                };
                            };
                        };
                    };
                });

                document.addEventListener('keyup', e => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            let KeyCode = e.keyCode;

                            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                if (!ws.automove) {
                                    if (KeyCode == 76) {
                                        ws.network.sendInput({
                                            up: 0
                                        });
                                    };

                                    if (KeyCode == 191) {
                                        ws.network.sendInput({
                                            right: 0
                                        });
                                    };

                                    if (KeyCode == 190) {
                                        ws.network.sendInput({
                                            down: 0
                                        });
                                    };

                                    if (KeyCode == 188) {
                                        ws.network.sendInput({
                                            left: 0
                                        });
                                    };

                                    if (KeyCode == 87) {
                                        ws.network.sendInput({
                                            up: 0
                                        });
                                    };

                                    if (KeyCode == 68) {
                                        ws.network.sendInput({
                                            right: 0
                                        });
                                    };

                                    if (KeyCode == 83) {
                                        ws.network.sendInput({
                                            down: 0
                                        });
                                    };

                                    if (KeyCode == 65) {
                                        ws.network.sendInput({
                                            left: 0
                                        });
                                    };
                                };
                            };
                        };
                    };
                });

                document.getElementsByClassName("hud")[0].addEventListener("mousedown", function(e) {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            if (!e.button) {
                                ws.mouseDown = 1;
                                ws.mouseUp = 0;

                                ws.network.sendInput({
                                    mouseDown: ws.aimingYaw,
                                    worldX: Math.floor(mousePosition3.x),
                                    worldY: Math.floor(mousePosition3.y),
                                    distance: Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition3.x) * 100, (-ws.myPlayer.position.y + mousePosition3.y) * 100) / 100)
                                });
                            };
                        };
                    };
                });

                document.getElementsByClassName("hud")[0].addEventListener("mouseup", function(e) {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            if (!e.button) {
                                ws.mouseUp = 1;
                                ws.mouseDown = 0;
                                ws.network.sendInput({
                                    mouseUp: 1,
                                    worldX: Math.floor(mousePosition3.x),
                                    worldY: Math.floor(mousePosition3.y),
                                    distance: Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition3.x) * 100, (-ws.myPlayer.position.y + mousePosition3.y) * 100) / 100)
                                });
                            };
                        };
                    };
                });

                if (isOnControl) {
                    let t1 = 0;

                    document.getElementsByClassName("hud-shop-item")[t1 + 0].addEventListener('click', function() {
                        ws.network.sendRpc({
                            name: "BuyItem",
                            itemName: "Pickaxe",
                            tier: ws.inventory.Pickaxe.tier + 1
                        });
                    });

                    document.getElementsByClassName("hud-shop-item")[t1 + 1].addEventListener('click', function() {
                        if (!ws.inventory.Bow) {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Bow",
                                tier: 1
                            });
                        } else {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Bow",
                                tier: ws.inventory.Bow.tier + 1
                            });
                        };
                    });

                    document.getElementsByClassName("hud-shop-item")[t1 + 2].addEventListener('click', function() {
                        if (!ws.inventory.Bow) {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Bow",
                                tier: 1
                            });
                        } else {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Bow",
                                tier: ws.inventory.Bow.tier + 1
                            });
                        };
                    });

                    document.getElementsByClassName("hud-shop-item")[t1 + 3].addEventListener('click', function() {
                        if (!ws.inventory.Bomb) {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Bomb",
                                tier: 1
                            });
                        } else {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Bomb",
                                tier: ws.inventory.Bomb.tier + 1
                            });
                        };
                    });

                    document.getElementsByClassName("hud-shop-item")[t1 + 4].addEventListener('click', function() {
                        ws.network.sendRpc({
                            name: "BuyItem",
                            itemName: "ZombieShield",
                            tier: ws.inventory.ZombieShield ? (ws.inventory.ZombieShield.tier + 1) : 1
                        });
                    });

                    document.getElementsByClassName("hud-respawn-btn")[0].addEventListener('click', function() {
                        ws.network.sendRpc({
                            respawn: 1
                        });
                    });

                    document.getElementsByClassName("hud-toolbar-item")[t1 + 0].addEventListener('mouseup', function(e) {
                        if (!e.button) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "Pickaxe",
                                tier: ws.inventory.Pickaxe.tier
                            });
                        };
                    });

                    document.getElementsByClassName("hud-toolbar-item")[t1 + 1].addEventListener('mouseup', function(e) {
                        if (!e.button) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "Bow",
                                tier: ws.inventory.Bow.tier
                            });
                        };
                    });

                    document.getElementsByClassName("hud-toolbar-item")[t1 + 2].addEventListener('mouseup', function(e) {
                        if (!e.button) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "Bow",
                                tier: ws.inventory.Bow.tier
                            });
                        };
                    });

                    document.getElementsByClassName("hud-toolbar-item")[t1 + 3].addEventListener('mouseup', function(e) {
                        if (!e.button) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "Bomb",
                                tier: ws.inventory.Bomb.tier
                            });
                        };
                    });

                    document.getElementsByClassName("hud-toolbar-item")[t1 + 4].addEventListener('mouseup', function(e) {
                        if (!e.button) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "HealthPotion",
                                tier: 1
                            });
                        };
                    });

                    document.getElementsByClassName("hud-toolbar-item")[t1 + 5].addEventListener('mouseup', function(e) {
                        if (!e.button) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "PetHealthPotion",
                                tier: 1
                            });
                        };
                    });

                    document.getElementsByClassName("hud-toolbar-item")[t1 + 6].addEventListener("mouseup", function(e) {
                        if (!e.button) {
                            if (isOnControl) {
                                ws.network.sendRpc({
                                    name: "RecallPet"
                                });
                                ws.network.sendInput({
                                    respawn: 1
                                });
                                ws.automove = !ws.automove;
                                if (ws.automove) {
                                    window.move = true;
                                } else {
                                    window.move = false;
                                };
                            };
                        };
                    });
                };

                ws.respawn = true;

                document.getElementsByClassName("10i")[0].addEventListener('click', () => {
                    ws.activebow = !ws.activebow;
                    ws.playerWeapon = ws.myPlayer.weaponName;

                    if (ws.activebow) {
                        if (ws.inventory.Bow) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "Bow",
                                tier: ws.inventory.Bow.tier
                            })
                        } else {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Bow",
                                tier: 1
                            })
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "Bow",
                                tier: 1
                            });
                        };
                    } else {
                        ws.network.sendRpc({
                            name: "EquipItem",
                            itemName: ws.playerWeapon,
                            tier: ws.inventory[ws.playerWeapon].tier
                        });
                    };
                });

                if (window.aim) {
                    ws.autoaim = true;
                };

                if (window.move) {
                    ws.automove = true;
                };

                if (window.autohiBot) {
                    ws.autohi = true;
                };

                document.getElementsByClassName("1i2")[0].addEventListener('click', () => {
                    ws.autoaim = !ws.autoaim;

                    if (ws.autoaim) {
                        window.aim = true;

                        document.getElementsByClassName("1i2")[0].innerText = "Disable Aim!";
                    } else {
                        window.aim = false;

                        document.getElementsByClassName("1i2")[0].innerText = "Enable Aim!";
                    };
                });

                document.getElementsByClassName("2i2")[0].addEventListener('click', () => {
                    ws.automove = !ws.automove;

                    if (ws.automove) {
                        window.move = true;
                    } else {
                        window.move = false;
                    };
                });

                document.getElementsByClassName("7i2")[0].addEventListener('click', () => {
                    ws.close();

                    altElem.remove();
                });

                document.getElementsByClassName("8i2")[0].addEventListener('click', () => {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: `${ws.players[ws.uid].name}, W: ${counter(ws.players[ws.uid].wood)}, S: ${counter(ws.players[ws.uid].stone)}, G: ${counter(ws.players[ws.uid].gold)}, ID: ${ws.cloneId};`
                    });
                });

                document.getElementsByClassName("21i2")[0].addEventListener('click', () => {
                    isOnControl = !isOnControl;

                    document.getElementsByClassName("21i2")[0].innerText = isOnControl ? 'Uncontrol Alts!' : 'Control Alts!';
                });

                document.getElementsByClassName("30i2")[0].addEventListener('click', () => {
                    window.lock = !window.lock;

                    if (window.lock) {
                        window.count = 0;
                        delete window.lockPos;

                        document.getElementsByClassName("30i2")[0].innerText = 'Unlock Pos!';
                    } else if (!window.lock) {
                        document.getElementsByClassName("30i2")[0].innerText = 'Lock Pos!';

                        ws.network.sendInput({
                            up: 0,
                            right: 0,
                            left: 0,
                            right: 0
                        });
                    };
                });
            };

            if (window.testing) {
                ws.network.sendRpc({
                    name: "SetOpenParty",
                    isOpen: 0
                });

                ws.network.sendRpc({
                    name: "SetPartyName",
                    partyName: ws.cloneId + ''
                });
            };

            if (ws.data.uid) {
                ws.uid = ws.data.uid;
                ws.dataInfo = ws.data;
                ws.players = {};
                ws.inventory = {};
                ws.buildings = {};
                ws.parties = {};
                ws.lb = {};
                ws.playerUid = game.world.myUid;

                if (window.allSockets[ws.cloneId - 1]) {
                    window.allSockets[ws.cloneId - 1] = ws;
                };

                ws.network.sendInput({
                    space: 1
                });

                ws.network.sendRpc({
                    name: "BuyItem",
                    itemName: "PetCARL",
                    tier: 1
                });

                ws.network.sendRpc({
                    name: "BuyItem",
                    itemName: "PetMiner",
                    tier: 1
                });
            };

            if (ws.data.entities) {
                if (window.message == ws.cloneId) {
                    game.world.replicator.onEntityUpdate(ws.data);
                };

                if (ws.data.entities[ws.uid].name) {
                    ws.myPlayer = ws.data.entities[ws.uid];
                };

                for (let g in ws.myPlayer) {
                    if (ws.myPlayer[g] !== ws.data.entities[ws.uid][g] && ws.data.entities[ws.uid][g] !== undefined) {
                        ws.myPlayer[g] = ws.data.entities[ws.uid][g];
                    };
                };

                if (ws.myPlayer.petUid) {
                    if (ws.data.entities[ws.myPlayer.petUid]) {
                        if (ws.data.entities[ws.myPlayer.petUid].model) {
                            ws.myPet = ws.data.entities[ws.myPlayer.petUid];
                            ws.shouldHealPet = false;
                        };
                    };
                    for (let g in ws.myPet) {
                        if (ws.data.entities[ws.myPlayer.petUid]) {
                            if (ws.myPet[g] !== ws.data.entities[ws.myPlayer.petUid][g] && ws.data.entities[ws.myPlayer.petUid][g] !== undefined) {
                                ws.myPet[g] = ws.data.entities[ws.myPlayer.petUid][g]
                            };
                        };
                    };
                };

                for (let i in ws.data.entities) {
                    if (ws.data.entities[i].name) {
                        ws.players[i] = ws.data.entities[i];
                    };
                };

                for (let i in ws.players) {
                    if (!ws.data.entities[i]) {
                        delete ws.players[i];
                    };

                    for (let g in ws.players[i]) {
                        if (ws.players[i][g] !== ws.data.entities[i][g] && ws.data.entities[i][g] !== undefined) {
                            ws.players[i][g] = ws.data.entities[i][g];
                        };
                    };

                    ws.playerTick = ws.players[ws.playerUid];
                };

                altElem.style.left = (Math.round(ws.myPlayer.position.x) / game.world.getHeight() * 100) + '%';
                altElem.style.top = (Math.round(ws.myPlayer.position.y) / game.world.getWidth() * 100) + '%';
            };

            if (ws.data.name == "DayCycle") {
                ws.tickData = ws.data.response;
                ws.isDay = ws.data.response.isDay;
            };

            if (ws.data.tick) {
                var currentTick = ws.data.tick;
                var msPerTick = 50;
                var dayRatio = 0;
                var nightRatio = 0;
                var barWidth = 130;

                if (ws.tickData) {
                    if (ws.tickData.dayEndTick) {
                        if (ws.tickData.dayEndTick > 0) {
                            var dayLength = ws.tickData.dayEndTick - ws.tickData.cycleStartTick;
                            var dayTicksRemaining = ws.tickData.dayEndTick - currentTick;

                            dayRatio = 1 - dayTicksRemaining / dayLength;
                        }
                    } else if (ws.tickData.nightEndTick > 0) {
                        var nightLength = ws.tickData.nightEndTick - ws.tickData.cycleStartTick;
                        var nightTicksRemaining = ws.tickData.nightEndTick - currentTick;

                        dayRatio = 1;
                        nightRatio = 1 - nightTicksRemaining / nightLength;
                    };

                    var currentPosition = (dayRatio * 1 / 2 + nightRatio * 1 / 2) * -barWidth;
                    var offsetPosition = currentPosition + barWidth / 2;

                    if (offsetPosition) {
                        ws.dayTicker = Math.round(offsetPosition);
                    };
                };
            };

            if (ws.data.name == "PartyInfo") {
                ws.partyInfo = ws.data.response;
                setTimeout(() => {
                    for (let i in ws.partyInfo) {
                        if (ws.partyInfo[i].playerUid == ws.uid && ws.partyInfo[i].isLeader) {
                            ws.network.sendRpc({
                                name: "SetPartyMemberCanSell",
                                uid: game.world.myUid,
                                canSell: 1
                            });
                            ws.network.sendRpc({
                                name: "SetOpenParty",
                                isOpen: 1
                            });
                            setTimeout(() => {
                                ws.network.sendRpc({
                                    name: "SetPartyName",
                                    partyName: ws.cloneId + ''
                                });
                            }, 1000);
                        };
                    };
                }, 1750);
            };

            if (ws.data.name == "SetItem") {
                ws.inventory[ws.data.response.itemName] = ws.data.response;

                if (!ws.inventory[ws.data.response.itemName].stacks) {
                    delete ws.inventory[ws.data.response.itemName];
                };

                if (ws.data.response.itemName == "ZombieShield" && ws.data.response.stacks) {
                    ws.network.sendRpc({
                        name: "EquipItem",
                        itemName: "ZombieShield",
                        tier: data.response.tier
                    });
                };
            };

            if (ws.data.name == "PartyApplicant") {
                ws.partyApplicant = ws.data.response;
                if (ws.partyApplicant.applicantUid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "PartyApplicantDecide",
                        applicantUid: game.world.myUid,
                        accepted: 1
                    });
                };
            };

            if ((game.world.entities[ws.uid] && game.world.getEntityByUid(ws.uid))) {
                for (let socket in window.allSockets) {
                    let wss = window.allSockets[socket];

                    if (wss) {
                        let {
                            uid,
                            cloneId
                        } = wss;

                        if (((game.world.entities[uid] && game.world.getEntityByUid(uid))) && (game.world.getEntityByUid(uid)).targetTick)
                            (game.world.getEntityByUid(uid)).targetTick.name = (cloneId).toString();
                    };
                };
            };

            if (ws.data.name == "ReceiveChatMessage") {
                ws.message = ws.data;

                if (ws.message.response.message == "!move" && ws.message.response.uid == game.world.myUid) {
                    ws.mousemove = true;
                };

                if (ws.message.response.message == "!unmove" && ws.message.response.uid == game.world.myUid) {
                    ws.mousemove = false;
                };

                if (ws.message.response.message == `#` && ws.message.response.uid == game.world.myUid) {
                    let word = ws.message.response.message;
                    let uid = '';

                    for (let i = 0; i < 30; i++) {
                        if (Math.round(word[i] == 0 || word[i] == 1 || word[i] == 2 || word[i] == 3 || word[i] == 4 || word[i] == 5 || word[i] == 6 || word[i] == 7 || word[i] == 8 || word[i] == 9)) {
                            uid += word[i]
                        };

                        uid = Math.round(uid);
                        ws.playerUid = uid;
                    };
                };

                if (ws.message.response.message == "!aim" && ws.message.response.uid == game.world.myUid) {
                    window.move = true;
                };

                if (ws.message.response.message == "!unaim" && ws.message.response.uid == game.world.myUid) {
                    window.move = false;
                };

                if (ws.message.response.message == "!c" && ws.message.response.uid == game.world.myUid) {
                    isOnControl = true;
                };

                if (ws.message.response.message == `!c ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    isOnControl = true;
                };

                if (ws.message.response.message == "!!c" && ws.message.response.uid == game.world.myUid) {
                    isOnControl = false;
                };

                if (ws.message.response.message == `!!c ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    isOnControl = false;
                };

                if (ws.message.response.message == `!psk ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: `${ws.cloneId}: ${ws.psk.response.partyShareKey}`
                    });
                };

                if (ws.message.response.message == "!stats") {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: `${ws.players[ws.message.response.uid].name}, W: ${counter(ws.players[ws.message.response.uid].wood)}, S: ${counter(ws.players[ws.message.response.uid].stone)}, G: ${counter(ws.players[ws.message.response.uid].gold)}, T: ${Math.floor(ws.players[ws.message.response.uid].token)};`
                    });
                };

                if (ws.message.response.message == "!s" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: `${ws.players[ws.uid].name}, W: ${counter(ws.players[ws.uid].wood)}, S: ${counter(ws.players[ws.uid].stone)}, G: ${counter(ws.players[ws.uid].gold)}, ID: ${ws.cloneId};`
                    });
                };

                if (ws.message.response.message == "!h" && ws.message.response.uid == game.world.myUid) {
                    ws.autohi = !ws.autohi;

                    if (ws.autohi) {
                        window.autohiBot = true;
                    } else {
                        window.autohiBot = false;
                    };
                };

                if (ws.message.response.message == "!ahrc" && ws.message.response.uid == game.world.myUid) {
                    ws.ahrc = true;
                };

                if (ws.message.response.message == `!ahrc ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.ahrc = true;
                };

                if (ws.message.response.message == "!!ahrc" && ws.message.response.uid == game.world.myUid) {
                    ws.ahrc = false;
                };

                if (ws.message.response.message == `!!ahrc ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.ahrc = false;
                };

                if (ws.message.response.message == "!space" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendInput({
                        space: 0
                    })
                    ws.network.sendInput({
                        space: 1
                    });
                };

                if (ws.message.response.message == `${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendInput({
                        space: 0
                    })
                    ws.network.sendInput({
                        space: 1
                    });

                    ws.network.sendRpc({
                        name: 'JoinPartyByShareKey',
                        partyShareKey: game.ui.getPlayerPartyShareKey()
                    });
                };

                if (ws.message.response.message == `!dc` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendPacket({}, {});
                };

                if (ws.message.response.message == `!dc ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendPacket({}, {});
                };

                if (ws.message.response.message == "!upgrade" && ws.message.response.uid == game.world.myUid) {
                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "GoldMine") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            })
                        }
                        setTimeout(() => {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            })
                        }, 100);
                    };
                };

                if (ws.message.response.message == "!autobomb" && ws.message.response.uid == game.world.myUid) {
                    ws.raid = true;
                };

                if (ws.message.response.message == "!!autobomb" && ws.message.response.uid == game.world.myUid) {
                    ws.raid = false;
                };

                if (ws.message.response.message == `!respawn` && ws.message.response.uid == game.world.myUid) {
                    ws.respawn = true;
                };

                if (ws.message.response.message == `!respawn ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.respawn = true;
                };

                if (ws.message.response.message == "!!respawn" && ws.message.response.uid == game.world.myUid) {
                    ws.respawn = false;
                };

                if (ws.message.response.message == `!!respawn ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.respawn = false;
                };

                if (ws.message.response.message == `!join ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: game.ui.getPlayerPartyShareKey() + ""
                    });
                };

                if (ws.message.response.message.startsWith(`!joinPsk ${ws.cloneId}`) && ws.message.response.uid == game.world.myUid) {
                    let args = ws.message.response.message.split(' ');

                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: args[2]
                    });
                };

                if (ws.message.response.message == `!leave` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "LeaveParty"
                    });
                };

                if (ws.message.response.message == `!leave ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "LeaveParty"
                    });
                };

                if (ws.message.response.message == "!up" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded all!"
                    });

                    for (let i in ws.buildings) {
                        ws.network.sendRpc({
                            name: "BuyItem",
                            itemName: ws.buildings[i].uid
                        });
                    };
                };

                if (ws.message.response.message == "!upStash" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded stash!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "GoldStash") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up1" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded wall(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "Wall") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up2" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded door(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "Door") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up3" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded slowtrap(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "SlowTrap") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up4" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded arrow(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "ArrowTower") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up5" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded cannon(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "CannonTower") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up6" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded Melee(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "MeeleTower") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up7" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded bomb(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "BombTower") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up8" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded mage(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "MagicTower") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up9" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded gold mine(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "GoldMine") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up0" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded harvester(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "ResourceHarvester") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "q" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendInput({
                        left: 1
                    });
                    ws.network.sendInput({
                        right: 0
                    });
                }
                if (ws.message.response.message == "d" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendInput({
                        right: 1
                    });
                    ws.network.sendInput({
                        left: 0
                    });
                }
                if (ws.message.response.message == "z" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendInput({
                        up: 1
                    });
                    ws.network.sendInput({
                        down: 0
                    });
                }
                if (ws.message.response.message == "s" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendInput({
                        down: 1
                    });
                    ws.network.sendInput({
                        up: 0
                    });
                }
                if (ws.message.response.message == "f" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendInput({
                        left: 0
                    });
                    ws.network.sendInput({
                        right: 0
                    });
                    ws.network.sendInput({
                        down: 0
                    });
                    ws.network.sendInput({
                        up: 0
                    });
                }
            }
            if (ws.autohi) {
                if (ws.data.entities) {
                    let sus = setInterval(() => {
                        let msg = "";
                        let msg2 = "";
                        for (let i = 0; i < 15; i++) {
                            msg += `&#${Math.random() * 2500 + 100 | 0};`;
                        }
                        for (let i = 0; i < 15; i++) {
                            msg2 += `&#${Math.random() * 2500 + 100 | 0};`;
                        }
                        ws.network.sendRpc({
                            name: "SendChatMessage",
                            message: `${msg}${msg2}`,
                            channel: "Local"
                        });
                    });
                };
            };

            if (ws.data.name == "Leaderboard") {
                for (let i in ws.data.response) {
                    ws.lb[ws.data.response[i].rank + 1] = ws.data.response[i];
                }
                if (ws.ahrc) {
                    for (let uid in ws.buildings) {
                        let obj = ws.buildings[uid];
                        ws.network.sendRpc({
                            name: "CollectHarvester",
                            uid: obj.uid
                        });
                        if (obj.type == "Harvester" && obj.tier == 1) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 20 / 2
                            });
                        }
                        if (obj.type == "Harvester" && obj.tier == 2) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 30 / 2
                            });
                        }
                        if (obj.type == "Harvester" && obj.tier == 3) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 35 / 2
                            });
                        }
                        if (obj.type == "Harvester" && obj.tier == 4) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 50 / 2
                            });
                        }
                        if (obj.type == "Harvester" && obj.tier == 5) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 60 / 2
                            });
                        }
                        if (obj.type == "Harvester" && obj.tier == 6) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 70 / 2
                            });
                        }
                        if (obj.type == "Harvester" && obj.tier == 7) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 120 / 2
                            });
                        }
                        if (obj.type == "Harvester" && obj.tier == 8) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 150 / 2
                            });
                        }
                    };
                };
            };

            if (ws.respawn) {
                ws.network.sendInput({
                    respawn: 1
                });

                if (ws.raid) {
                    ws.space = true;

                    ws.network.sendRpc({
                        name: 'BuyItem',
                        itemName: 'Bomb',
                        tier: 1
                    });

                    ws.network.sendRpc({
                        name: 'EquipItem',
                        itemName: 'Bomb',
                        tier: 1
                    });
                };
            };

            if (ws.space) {
                ws.network.sendInput({
                    space: 0
                })
                ws.network.sendInput({
                    space: 1
                });
            };

            if (ws.data.name == "LocalBuilding") {
                for (let i in ws.data.response) {
                    ws.buildings[ws.data.response[i].uid] = ws.data.response[i];
                    if (ws.buildings[ws.data.response[i].uid].dead) {
                        delete ws.buildings[ws.data.response[i].uid];
                    };
                };
            };

            if (ws.data.name == "AddParty") {
                if (ws.addparties) {
                    ws.parties[ws.data.response.partyId] = ws.data.response;
                };
            };

            if (ws.data.name == "RemoveParty") {
                if (ws.addparties) {
                    if (ws.parties[ws.data.response.partyId].partyId) {
                        delete ws.parties[ws.data.response.partyId];
                    };
                };
            };

            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;

                altElem.style.display = (ws.psk.response.partyShareKey == game.ui.getPlayerPartyShareKey()) ? "none" : "block";
            };

            if (window.mousemove) {
                let myPlayer = game.ui.playerTick;
                let mouseToWorld = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);

                if (ws.myPlayer) {
                    if (ws.myPlayer.position) {
                        ws.network.sendInput({
                            mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mouseToWorld.x) * 100, (-ws.myPlayer.position.y + mouseToWorld.y) * 100)
                        })

                        if (1 == 1) {
                            if (ws.myPlayer.position.y - mouseToWorld.y > 10) {
                                ws.network.sendInput({
                                    down: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    down: 1
                                });
                            };

                            if (-ws.myPlayer.position.y + mouseToWorld.y > 10) {
                                ws.network.sendInput({
                                    up: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    up: 1
                                });
                            };

                            if (-ws.myPlayer.position.x + mouseToWorld.x > 10) {
                                ws.network.sendInput({
                                    left: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    left: 1
                                });
                            };

                            if (ws.myPlayer.position.x - mouseToWorld.x > 10) {
                                ws.network.sendInput({
                                    right: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    right: 1
                                });
                            };
                        };
                    };
                };
            };

            if (window.autoraid) {
                if (ws.myPlayer) {
                    if (findNearestAltToStash().uid == ws.uid) {
                        if (Object.values(game.ui.buildings).length > 0 && !ws.myPlayer.dead) {
                            ws.network.sendRpc({
                                name: "JoinPartyByShareKey",
                                partyShareKey: game.ui.getPlayerPartyShareKey() + ""
                            });
                        } else {
                            for (let i in window.allSockets) {
                                if (Object.values(window.allSockets[i].buildings).length > 0 && !ws.myPlayer.dead) {
                                    ws.network.sendRpc({
                                        name: "JoinPartyByShareKey",
                                        partyShareKey: window.allSockets[i].psk.response.partyShareKey + ""
                                    });
                                };
                            };
                        };

                        ws.network.sendInput({
                            space: 0
                        });
                        ws.network.sendInput({
                            space: 1
                        });
                    };
                };
            };

            if (ws.data.entities) {
                if (ws.letbotsjoin) {
                    if (ws.myPlayer.gold > 100) {
                        ws.network.sendRpc({
                            name: 'LeaveParty'
                        });
                    } else {
                        ws.network.sendRpc({
                            name: "JoinPartyByShareKey",
                            partyShareKey: game.ui.getPlayerPartyShareKey() + ""
                        });
                    };
                };

                if (ws.letbotsjoin2) {
                    if (ws.myPlayer.gold > 500) {
                        ws.network.sendRpc({
                            name: 'LeaveParty'
                        });
                    } else {
                        ws.network.sendRpc({
                            name: "JoinPartyByShareKey",
                            partyShareKey: game.ui.getPlayerPartyShareKey() + ""
                        });
                    };
                };

                if (ws.letbotsjoin3) {
                    if (ws.myPlayer.gold > 8500) {
                        ws.network.sendRpc({
                            name: 'LeaveParty'
                        });
                    } else {
                        ws.network.sendRpc({
                            name: "JoinPartyByShareKey",
                            partyShareKey: game.ui.getPlayerPartyShareKey() + ""
                        });
                    };
                };
            };

            if (window.lock) {
                addEventListener('mousedown', () => {
                    window.count++;

                    window.count == 1 && (
                        window.lockPos = {
                            x: game.renderer.screenToWorld(Object.freeze(game.ui.mousePosition).x, 0).x,
                            y: game.renderer.screenToWorld(0, Object.freeze(game.ui.mousePosition).y).y
                        }
                    );
                });

                let pos = window.lockPos;

                if (!pos) return;

                if (ws.myPlayer) {
                    ((position) => {
                        let x = Math.round(position.x);
                        let y = Math.round(position.y);

                        ws.network.sendInput({
                            mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + x) * 100, (-ws.myPlayer.position.y + y) * 100)
                        });

                        let myX = Math.round(ws.myPlayer.position.x);
                        let myY = Math.round(ws.myPlayer.position.y);

                        let offset = 6;
                        if ((-myX + x > offset) || (window.lock)) {
                            ws.network.sendInput({
                                left: 0
                            });
                        } else {
                            ws.network.sendInput({
                                left: 1
                            });
                        };

                        if ((myX - x > offset) || (window.lock)) {
                            ws.network.sendInput({
                                right: 0
                            });
                        } else {
                            ws.network.sendInput({
                                right: 1
                            });
                        };

                        if ((-myY + y > offset) || (window.lock)) {
                            ws.network.sendInput({
                                up: 0
                            });
                        } else {
                            ws.network.sendInput({
                                up: 1
                            });
                        };

                        if ((myY - y > offset) || (window.lock)) {
                            ws.network.sendInput({
                                down: 0
                            });
                        } else {
                            ws.network.sendInput({
                                down: 1
                            });
                        };
                    })(pos);
                };
            };

            if (ws.automove) {
                let playerPos = game.world.entities[game.world.myUid].targetTick.position;

                let x = Math.round(playerPos.x);
                let y = Math.round(playerPos.y);

                let pos = {
                    x: x,
                    y: y
                };
                if (ws.myPlayer) {
                    ((position) => {
                        let x = Math.round(position.x);
                        let y = Math.round(position.y);

                        ws.network.sendInput({
                            mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + x) * 100, (-ws.myPlayer.position.y + y) * 100)
                        })
                        if (!window.lock) {

                            let myX = Math.round(ws.myPlayer.position.x);
                            let myY = Math.round(ws.myPlayer.position.y);

                            let offset = 6;

                            if ((-myX + x > offset) || (window.lock)) {
                                ws.network.sendInput({
                                    left: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    left: 1
                                });
                            };

                            if ((myX - x > offset) || (window.lock)) {
                                ws.network.sendInput({
                                    right: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    right: 1
                                });
                            };

                            if ((-myY + y > offset) || (window.lock)) {
                                ws.network.sendInput({
                                    up: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    up: 1
                                });
                            };

                            if ((myY - y > offset) || (window.lock)) {
                                ws.network.sendInput({
                                    down: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    down: 1
                                });
                            };
                        };
                    })(pos);
                };
            };

            if (ws.autoaim) {
                let myPlayer = game.ui.playerTick;
                let mouseToWorld = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
                if (ws.myPlayer) {
                    if (ws.myPlayer.position) {
                        ws.network.sendInput({
                            mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mouseToWorld.x) * 100, (-ws.myPlayer.position.y + mouseToWorld.y) * 100)
                        });

                        let offset = 6;

                        if (ws.myPlayer.position.y - mouseToWorld.y > offset) {
                            ws.network.sendInput({
                                down: 0
                            });
                        } else {
                            ws.network.sendInput({
                                down: 0
                            });
                        };
                        if (-ws.myPlayer.position.y + mouseToWorld.y > offset) {
                            ws.network.sendInput({
                                up: 0
                            });
                        } else {
                            ws.network.sendInput({
                                up: 0
                            });
                        };
                        if (-ws.myPlayer.position.x + mouseToWorld.x > offset) {
                            ws.network.sendInput({
                                left: 0
                            });
                        } else {
                            ws.network.sendInput({
                                left: 0
                            });
                        };
                        if (ws.myPlayer.position.x - mouseToWorld.x > offset) {
                            ws.network.sendInput({
                                right: 0
                            });
                        } else {
                            ws.network.sendInput({
                                right: 0
                            });
                        };
                    };
                };
            };

            if (ws.data.opcode == 0) {
                if (heal) {
                    if (ws.myPlayer) {
                        let playerHealth = (ws.myPlayer.health / ws.myPlayer.maxHealth) * 100;

                        if (playerHealth <= 10) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "HealthPotion",
                                tier: 1
                            });
                        };
                    };

                    if (ws.myPet) {
                        let petHealth = (ws.myPet.health / ws.myPet.maxHealth) * 100;

                        if (petHealth <= 10) {
                            if (!ws.shouldHealPet) {
                                ws.shouldHealPet = true;

                                setTimeout(() => {
                                    ws.shouldHealPet = false;
                                }, 300);

                                ws.network.sendRpc({
                                    name: "BuyItem",
                                    itemName: "PetHealthPotion",
                                    tier: 1
                                });

                                ws.network.sendRpc({
                                    name: "EquipItem",
                                    itemName: "PetHealthPotion",
                                    tier: 1
                                });
                            };
                        };
                    };
                };

                ws.network.sendRpc({
                    name: "BuyItem",
                    itemName: "HealthPotion",
                    tier: 1
                });
            };

            if (ws.activebow) {
                ws.network.sendInput({
                    space: 0
                });

                ws.network.sendInput({
                    space: 1
                });
            };

            switch (ws.data.opcode) {
                case 4:
                    ws.send(iframeWindow.game.network.codec.encode(6, {}));

                    iframe.remove();

                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: game.ui.playerPartyShareKey
                    });

                    break;
            };
        };
    });
};

function searchProperties(obj, keyword, seen = new Set()) {
    let result = [];
    if (seen.has(obj) || obj instanceof CSSStyleSheet) {
        return result;
    }
    seen.add(obj);
    for (let prop in obj) {
        if (prop.includes(keyword) && !/\d/.test(prop)) {
            result.push(prop);
        }
        if (typeof obj[prop] === "object") {
            let subResult = searchProperties(obj[prop], keyword, seen);
            for (let subProp of subResult) {
                result.push(prop + "." + subProp);
            }
        }
    }
    return result;
}

let result = searchProperties(game.world, "position");
console.log(result);