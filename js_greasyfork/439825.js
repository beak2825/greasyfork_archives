// ==UserScript==
// @name         Zombs.io tool bar
// @namespace    !Satınal
// @version      0.9
// @description  Click the item you want and it will buy it.
// @author       ₮ⱤØⱠⱠɆⱤ 1
// @match        zombs.io
// @match        http://tc-mod-xyz.glitch.me/
// @grant        ₮ⱤØⱠⱠɆⱤ 1
// @downloadURL https://update.greasyfork.org/scripts/439825/Zombsio%20tool%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/439825/Zombsio%20tool%20bar.meta.js
// ==/UserScript==
let css = `
.btn-purple {
background-color: #702de0;
}
`

document.getElementsByClassName("hud-top-center")[0].innerHTML = `
<button class="btn-purple." style="border-radius: 0em; color: rgb(0, 0, 0); border: 2px solid rgb(8, 8, 8);" onclick='Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "Pickaxe", tier: ws.inventory.Pickaxe.tier+1});'><img src="http://zombs.io/asset/image/ui/inventory/inventory-pickaxe-t5.svg"</button>
<button class="btn-purple" style="border-radius: 0em; color: rgb(0, 0, 0); border: 2px solid rgb(8, 8, 8);" onclick='Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "Spear", tier: Game.currentGame.ui.inventory.Spear.tier+1});'><img src="http://zombs.io/asset/image/ui/inventory/inventory-spear-t5.svg"</button>
<button class="btn-purple" style="border-radius: 0em; color: rgb(0, 0, 0); border: 2px solid rgb(8, 8, 8);" onclick='Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "Bow", tier: Game.currentGame.ui.inventory.Bow.tier+1});'><img src="http://zombs.io/asset/image/ui/inventory/inventory-bow-t5.svg"</button>
<button class="btn-purple" style="border-radius: 0em; color: rgb(0, 0, 0); border: 2px solid rgb(8, 8, 8);" onclick='Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "Bomb", tier: Game.currentGame.ui.inventory.Bomb.tier+1});'><img src="http://zombs.io/asset/image/ui/inventory/inventory-bomb-t5.svg"</button>
<button class="btn-purple" style="border-radius: 0em; color: rgb(0, 0, 0); border: 2px solid rgb(8, 8, 8);" onclick='Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "ZombieShield", tier: Game.currentGame.ui.inventory.ZombieShield.tier+1});'><img src="http://zombs.io/asset/image/ui/inventory/inventory-shield-t5.svg"</button>
<button class="btn-purple" style="border-radius: 0em; color: rgb(0, 0, 0); border: 2px solid rgb(8, 8, 8);" onclick='Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "PetCARL", tier: Game.currentGame.ui.inventory.ZombieShield.tier+1});'><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-carl-t6.svg"</button>
<button class="btn-purple" style="border-radius: 0em; color: rgb(0, 0, 0); border: 2px solid rgb(8, 8, 8);" onclick='Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "PetMiner", tier: Game.currentGame.ui.inventory.ZombieShield.tier+1});'><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-miner-t5.svg"</button>
`
var entities = Game.currentGame.world.entities;

var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu, .hud-menu-icon, .hud-intro-left, .hud-party-visibility, .hud-intro-footer, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
for (let i = 0; i < Style1.length; i++) {
    Style1[i].style.borderRadius = '2px'; // standard
    Style1[i].style.MozBorderRadius = '2px'; // Mozilla
    Style1[i].style.WebkitBorderRadius = '2px'; // WebKitww
    Style1[i].style.border = "3px solid #702de0";
    Style1[i].style.outline = "none";
}