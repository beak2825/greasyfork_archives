// ==UserScript==
// @name         Zombs Tools 7
// @namespace    -
// @icon         https://zombs-tools.casuallyca.repl.co/Images/Zombs%20Tools%20Icon.png
// @version      undefined
// @description  Do not take over the world yet
// @author       Trash
// @match        zombs.io
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/445517/Zombs%20Tools%207.user.js
// @updateURL https://update.greasyfork.org/scripts/445517/Zombs%20Tools%207.meta.js
// ==/UserScript==
var ZTGrid = `
          <div id="S_Home" style="height: 300px;">
            <button class="ZTbtn_on" id="B_Login">Login</button>
            <div id="S_FirstPageDisplay" style="display:none;margin: 0px;padding: 0px;">
              <h3>Have Fun</h3>
              <h3 style="margin: 0px" id="T_DiscordNameDisplay">ΛⴽΞПΛ ム ANSHU#6560</h3>
            </div>
          </div>

          <div id="S_Heal" style="height: 300px;">
            <input class="ZTinput"type="text" id="I_AutoHeal" value="75"maxlength="3" >
            <button class="ZTbtn_on" id="B_AutoHeal">Auto Heal</button>
            <input class="ZTinput"type="text" id="I_AutoHealPet" value="75"maxlength="3" >
            <button class="ZTbtn_on" id="B_AutoHealPet">Auto Heal Pet</button>
          </div>

          <div id="S_Attack" style="height: 300px;">
            <button class="ZTbtn_off" id="B_AutoBuySpear">Auto Buy Spear</button>
            <button class="ZTbtn_off" id="B_AutoEquipSpear">Auto Equip Spear</button>
            <button class="ZTbtn_off" id="B_AutoBuyBomb">Auto Buy Bomb</button>
            <button class="ZTbtn_off" id="B_AutoEquipBomb">Auto Equip Bomb</button>
            <button class="ZTbtn_off" id="B_AutoRespawn">Auto Respawn</button>
          </div>

          <div id="S_Bases" style="height: 300px;">
            base
          </div>

          <div id="S_Render" style="height: 300px;">
            <button class="ZTbtn_on" id="B_GroundRender">Ground Render</button>
            <button class="ZTbtn_on" id="B_ProjectilesRender">Projectiles Render</button>
            <button class="ZTbtn_on" id="B_SceneryRender">Scenery Render</button>
            <br>
            <button class="ZTbtn_on" id="B_AutoRaidCapture">Auto Raid Capture</button>
          </div>

          <div id="S_Party" style="height: 300px; overflow: hidden;">
            <input class="ZTinput" type="text" maxlength="20" placeHolder="party share key..." id="B_JoinPskInput"></input>
            <button class="ZTbtn_off" id="B_JoinPsk">Join Party</button>
            <button class="ZTbtn_click" id="B_LeaveParty">Leave Party</button>
            <hr style="margin: 10px auto;">
          </div>

          <div id="S_Map" style="height: 300px; overflow: hidden;">
            <h3 id="T_PlayerPositionDisplay">Loading player position...</h3>
            <button class="ZTbtn_click" id="B_PinPosition">Pin Position</button>
            <button class="ZTbtn_click" id="B_UnpinPosition">Unpin Position</button>
          </div>

          <div id="S_Alt" style="height: 300px; overflow: hidden;">
            <button class="ZTbtn_click" id="B_SendAlt">Send Alt</button>
            <button class="ZTbtn_on" id="B_AltMove">Stay</button>
            <button class="ZTbtn_on" id="B_DeleteAlts">Delete Alts</button>
            <input class="ZTinput" type="text" maxlength="20" placeHolder="Alt Hit Psk..." id="B_AltHitInput"></input>
          </div>
            `;
var SceneOrder = {
    'CurrentScene':{name: 0, icon: ''},
    0:{name: 'Home'},
    1:{name: 'Heal'},
    2:{name: 'Attack'},
    3:{name: 'Bases'},
    4:{name: 'Render'},
    5:{name: 'Party'},
    6:{name: 'Map'},
    7:{name: 'Alt'}
};
function DisplayZTMenu(){
    document.getElementById("hud-menu-zombsTools").style.display = 'block';
}
let ZTMenuIcon = document.createElement('div');
ZTMenuIcon.className = "hud-menu-icon hud-menu-ZTMenuIcon";
ZTMenuIcon.setAttribute("data-type", "zombsTools")
document.getElementById("hud-menu-icons").insertBefore(ZTMenuIcon, document.getElementById("hud-menu-icons").childNodes[5]);
function HideOtherMenus(){
    var buildingOverlay = game.ui.getComponent('BuildingOverlay');
    var placementOverlay = game.ui.getComponent('PlacementOverlay');
    var spellOverlay = game.ui.getComponent('SpellOverlay');
    var menuShop = game.ui.getComponent('MenuShop');
    var menuParty = game.ui.getComponent('MenuParty');
    var menuSettings = game.ui.getComponent('MenuSettings');
    var menuFPS = game.ui.getComponent('MenuFPS');
    var menuScripts = game.ui.getComponent('MenuScripts');
    if (menuFPS) {
        if (menuFPS.isVisible()) menuFPS.hide();
    }
    if (menuScripts) {
        if (menuScripts.isVisible()) menuScripts.hide();
    }
    if (menuSettings) {
        if (menuSettings.isVisible()) menuSettings.hide();
    }
    if (menuParty) {
        if (menuParty.isVisible()) menuParty.hide();
    }
    if (menuShop) {
        if (menuShop.isVisible()) menuShop.hide();
    }
}
document.getElementsByClassName("hud-menu-ZTMenuIcon")[0].addEventListener("mouseup", function() {
    let ZTMenu = document.getElementById("hud-menu-zombsTools");
    if(ZTMenu.style.display === "none" || ZTMenu.style.display === "") {
        DisplayZTMenu()
        HideOtherMenus();
    } else {
        ZTMenu.style.display = "none";
    };
})
var Menu = document.createElement('div');
Menu.id = "hud-menu-zombsTools";
Menu.className = "hud-menu hud-menu-zombsTools";
Menu.style.display = 'none';
Menu.innerHTML = `
            <style>
            .hud-menu-icon[data-type="zombsTools"]::before {
            background-image: url("https://zombs-tools.casuallyca.repl.co/Images/Zombs%20Tools%20Icon.png");
            }
            .hud-menu-zombsTools {
            display: none;
            position: fixed;
            top: 48%;
            left: 50%;
            width: 600px;
            height: 495px;
            margin: -270px 0 0 -300px;
            padding: 0px 25px;
            background: rgba(0, 0, 0, 0.6);
            color: #eee;
            border-radius: 20px;
            z-index: 15;
            background-image: linear-gradient(to bottom right, rgba(240, 254, 255, 0.8) 5%, rgba(105, 230, 255, 0.8) 25%, rgba(105, 230, 255, 0.8) 75%, rgba(224, 255, 84, 0.8) 100%);
            box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.75);
            text-align: center;
            }

            .hud-zombsTools-grid{
            display: block;
            height: 380px;
            position: relative;
            bottom: 15px;
            padding: 0px 20px 15px 15px;
            background: rgba(0, 0, 0, 0.15);
            border-radius: 20px;
            overflow: hidden;
            }

            .hud-menu-close{
            opacity: 1 !important;
            transition: opacity 0.2s ease-in-out;
            }

            .hud-menu-close:hover{
            opacity: 0.5 !important;
            transition: opacity 0.2s ease-in-out;
            }
            </style>
            <!------------------HTML------------------>
            <a class="hud-menu-close" id="hud-menu-zombsTools-close"></a>
            <h1 style="text-align:center;">Zombs Tools</h1>
            <div class="hud-zombsTools-grid">
            </div>
            `
document.getElementById("hud").insertBefore(Menu, document.getElementById('hud-menu-settings').nextSibling);
game.network.sendInput = (e) => {
    let i = e;
    if (!i.mouseDown && !i.mouseUp) game.network.sendPacket(3, e);
}
document.getElementsByClassName('hud')[0].addEventListener('mousedown', e => {
    if (e.button !== 0 || document.getElementById('hud-intro').style.display === '') return;
    let ignore = false;
    for(let i in e.path){
        if(e.path[i].id === "hud-menu-zombsTools") ignore = true;
    }
    ignore ? game.network.sendPacket(3, {mouseUp: 1}) : game.network.sendPacket(3, {mouseDown: game.inputPacketCreator.screenToYaw(e.clientX, e.clientY)})
})
document.getElementsByClassName('hud')[0].addEventListener('mouseup', e => {
    if (!e.button && document.getElementById('hud-intro').style.display !== '') game.network.sendPacket(3, {mouseUp: 1});
})
document.getElementById('hud').addEventListener("mouseup", function(e){
    let ignore = false;
    for(let i in e.path){
        if(e.path[i].id === "hud-menu-zombsTools"){
            ignore = true;
            if(e.target.id === "hud-menu-zombsTools-close") {
                document.getElementById("hud-menu-zombsTools").style.display = 'none';
            }
            else break;
        }
    }
    if(!ignore) document.getElementById("hud-menu-zombsTools").style.display = 'none';
    if(document.getElementById('hud-intro').style.display !== '') game.network.sendPacket(3, {mouseUp: 1});
})
document.getElementById('hud-menu-icons').addEventListener("mouseup", function(e){
    if(e.target.classList[1] === undefined){
        document.getElementById("hud-menu-zombsTools").style.display = 'none';
    }
})
document.getElementById('hud-spell-icons').addEventListener("mouseup", function(e){
    document.getElementById("hud-menu-zombsTools").style.display = 'none';
})
var SceneCss = document.createElement('style');
SceneCss.innerHTML = `
            :root {
            --Alpha: 0.85;
            --DarkBlue: rgba(9, 145, 173, var(--Alpha));
            --LightBlue: rgba(110, 251, 251, var(--Alpha));
            --BrownWhite: rgba(255, 250, 228, var(--Alpha));
            --LightBrown: rgba(247, 232, 164, var(--Alpha));
            --Pink: rgba(255, 130, 172, var(--Alpha));
            --Orange: rgba(255, 174, 112, var(--Alpha));
            --Purple: rgba(119, 110, 188, var(--Alpha));
            }
            .ZTArrows{
            overflow: hidden;
            height: 50px;
            }
            .ZTArrow{
            font-size: 45px;
            display:inline-block;
            }
            .ZTArrow-left{
            text-align: left;
            }
            .ZTArrow-right{
            position: absolute;
            top: 0px;
            text-align: right;
            width: 115px;
            margin-left: 400px;
            }
            #ZTArrow-left-one{
            opacity: 1;
            transition: opacity 0.2s;
            }
            #ZTArrow-left-one:hover{
            opacity: 0.6;
            transition: opacity 0.2s;
            }
            #ZTArrow-left-all{
            opacity: 1;
            transition: opacity 0.2s;
            }
            #ZTArrow-left-all:hover{
            opacity: 0.6;
            transition: opacity 0.2s;
            }
            #ZTArrow-right-one{
            opacity: 1;
            transition: opacity 0.2s;
            position: relative;
            }
            #ZTArrow-right-one:hover{
            opacity: 0.6;
            transition: opacity 0.2s;
            }
            #ZTArrow-right-all{
            opacity: 1;
            transition: opacity 0.2s;
            }
            #ZTArrow-right-all:hover{
            opacity: 0.6;
            transition: opacity 0.2s;
            }
            .ZTbtn_on{
            background-color: var(--LightBrown);
            border-radius: 10px;
            width: 200px;
            height: 40px;
            box-shadow: 0px 0 8px 3px #dddddd;
            border: 0;
            margin: 15px;
            opacity: 1;
            transition: opacity 0.3s;
            transition: transform 0.2s;
            }
            .ZTbtn_on:active {
              transform: scale(0.98);
              transition: transform 0.2s;
            }
            .ZTbtn_on:hover{
            opacity: 0.8;
            transition: opacity 0.3s;
            }
            .ZTbtn_off{
            background-color: var(--LightBrown);
            border-radius: 10px;
            width: 200px;
            height: 40px;
            box-shadow: 0px 0 8px 3px #dddddd;
            border: 0;
            margin: 15px;
            opacity: 1;
            transition: opacity 0.3s;
            transition: transform 0.2s;
            filter: saturate(30%);
            }
            .ZTbtn_off:active {
              transform: scale(0.98);
              transition: transform 0.2s;
            }
            .ZTbtn_off:hover{
            opacity: 0.8;
            transition: opacity 0.3s;
            }
            .ZTbtn_click{
            background-color: var(--Orange);
            border-radius: 10px;
            width: 200px;
            height: 40px;
            box-shadow: 0px 0 8px 3px #dddddd;
            border: 0;
            margin: 15px;
            opacity: 1;
            transition: opacity 0.3s;
            transition: transform 0.2s;
            }
            .ZTbtn_click:active {
              transform: scale(0.98);
              transition: transform 0.2s;
            }
            .ZTbtn_click:hover{
            opacity: 0.8;
            transition: opacity 0.3s;
            }
            .ZTinput{
            text-align: center;
            height: 35px;
            width: 204px;
            background: var(--BrownWhite);
            border: rgba(247, 232, 164, 0.5) 2px solid;
            box-shadow: 0px 0 8px 3px var(--LightBrown);
            border-radius: 6px;
            font-size: 15px;
            margin: 0px 12px;
            }
            /*StopRenderBtn*/
            #StopRenderBtn{
              border: none;
              display: block;
              position: relative;
              bottom: 20px;
              width: 170px;
              height: 56px;
              background: rgba(247, 232, 164, 0.7);
              color: rgba(255, 255, 255, 0.7);
              text-align: center;
              transition: all 0.15s ease-in-out;
              font-size: 20px;
              border-radius: 0px 0px 15px 15px;
            }
            .hud-top-center{
              z-index: 13;
            }
            /*SpamPskDisplayer*/
            #B_SpamPskDisplayer::placeholder {
              color: gray;
              font-size: 16px;
              opacity: 1;
            }
            #B_SpamPskDisplayer::-webkit-scrollbar {
              display: none;
            }
            `;
document.getElementsByClassName('hud-zombsTools-grid')[0].parentNode.appendChild(SceneCss);
var SceneAll_Top = `
            <div style="overflow:hidden; height: 75px;">
              <div class="ZTArrows">
                <div class="ZTArrow-left" style="visibility: hidden;">
                  <a class="ZTArrow" id="ZTArrow-left-all">&#171;</a>
                  <a class="ZTArrow" id="ZTArrow-left-one">&#8249;</a>
                  <i class="fa-solid" id="Scene-icon-left"></i>
                </div>
                <div class="ZTArrow-right">
                  <i class="fa-solid" id="Scene-icon-right"></i>
                  <a class="ZTArrow" id="ZTArrow-right-one">&#8250;</a>
                  <a class="ZTArrow" id="ZTArrow-right-all">&#187;</a>
                </div>
              </div>
              <hr style='height: 4px; background-color: white; border: none; border-radius: 4px;'>
              <h2 id='SceneName' style="position: relative; bottom: 50px; width: 300px; margin: 0 auto;">Home</h2>
            </div>
            `;
document.getElementsByClassName('hud-zombsTools-grid')[0].innerHTML = SceneAll_Top + ZTGrid;
function SceneToOrder(e){
    for(let i in SceneOrder){
        if(isNaN(i)) continue;
        if(e === parseInt(i)) {
            document.getElementById("S_" + SceneOrder[i].name.replace(/\s+/g, '')).style.display = 'block';
            document.getElementById('SceneName').innerHTML = SceneOrder[i].name;

            document.getElementsByClassName('ZTArrow-right')[0].style.visibility = 'visible';
            document.getElementsByClassName('ZTArrow-left')[0].style.visibility = 'visible';
            switch(parseInt(i)){
                case Object.keys(SceneOrder).length - 2:
                    document.getElementsByClassName('ZTArrow-right')[0].style.visibility = 'hidden';
                    document.getElementsByClassName('ZTArrow-right')[0].style.cursor = 'default';
                    break;
                case 0:
                    document.getElementsByClassName('ZTArrow-left')[0].style.visibility = 'hidden';
                    document.getElementsByClassName('ZTArrow-left')[0].style.cursor = 'default';
                    break;
            }
            SceneOrder.CurrentScene.name = parseInt(i);
            continue;
        }
        document.getElementById("S_" + SceneOrder[i].name.replace(/\s+/g, '')).style.display = 'none';
    }
    if (!V_LoggedIn) document.getElementsByClassName('ZTArrow-right')[0].style.visibility = 'hidden';
}
SceneToOrder(0);
document.getElementById('ZTArrow-left-one').addEventListener('click', function(){
    if(document.getElementsByClassName('ZTArrow-left')[0].style.visibility === 'hidden') return;
    SceneToOrder(SceneOrder.CurrentScene.name - 1);
})
document.getElementById('ZTArrow-left-all').addEventListener('click', function(){
    if(document.getElementsByClassName('ZTArrow-left')[0].style.visibility === 'hidden') return;
    SceneToOrder(0);
})
document.getElementById('ZTArrow-right-one').addEventListener('click', function(){
    if(document.getElementsByClassName('ZTArrow-right')[0].style.visibility === 'hidden') return;
    SceneToOrder(SceneOrder.CurrentScene.name + 1);
})
document.getElementById('ZTArrow-right-all').addEventListener('click', function(){
    if(document.getElementsByClassName('ZTArrow-right')[0].style.visibility === 'hidden') return;
    SceneToOrder(Object.keys(SceneOrder).length - 2);
})

/*------------------Log In------------------*/
var V_LoggedIn = true;
window.addEventListener('DOMContentLoaded', (event) => {
V_LoggedIn = true;
    document.getElementsByClassName('ZTArrow-right')[0].style.visibility = 'visible';
        document.getElementById('B_Login').remove();
        document.getElementById('S_FirstPageDisplay').style.display = "block";
});
/*------------------Basic Functions------------------*/
function leaveparty() {
    game.network.sendRpc({name: "LeaveParty"})
}
function joinParty(psk){
    game.network.sendRpc({name: "JoinPartyByShareKey",partyShareKey: psk});
}
function hint(msg) {
    game.ui.getComponent('PopupOverlay').showHint(msg, 2000);
}
async function SendMsgToServer(msg){
    try {
        const response = await fetch('https://ZombsTools.casuallyca.repl.co/api', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({msg})
        }).then(response => response.text()).then((text) => {
            V_ServerVerify = text;
            console.log('Completed!', text);
        });
    } catch(err) {
        console.error(`Error: ${err}`);
    }
}
/*------------------Max Name And Party Name------------------*/
document.getElementsByClassName('hud-intro-name')[0].maxLength = "29";
document.getElementsByClassName('hud-party-tag')[0].maxlength = "49";
/*------------------DEAD CHAT------------------*/
document.addEventListener('keyup', function (e) {
    if (game.ui.playerTick){
        if (e.key === "Enter" && game.ui.playerTick.dead === 1) game.ui.components.Chat.startTyping();
    }
});
/*------------------Auto Buy Spear------------------*/
let V_AutoBuySpear = false;
document.getElementById('B_AutoBuySpear').addEventListener('click', function(){
    V_AutoBuySpear = !V_AutoBuySpear;
    document.getElementById('B_AutoBuySpear').className = V_AutoBuySpear? "ZTbtn_on" : "ZTbtn_off";
})
game.network.addEntityUpdateHandler(() => {
    if(V_AutoBuySpear){
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 1 && game.ui.playerTick.gold >= 100) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 2 && game.ui.playerTick.gold >= 400) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
        }
    }
})
/*------------------Auto Equip Spear------------------*/
let V_AutoEquipSpear = false;
document.getElementById('B_AutoEquipSpear').addEventListener('click', function(){
    V_AutoEquipSpear = !V_AutoEquipSpear;
    document.getElementById('B_AutoEquipSpear').className = V_AutoEquipSpear? "ZTbtn_on" : "ZTbtn_off";
})
game.network.addEntityUpdateHandler(() => {
    if(V_AutoEquipSpear){
        if (game.ui.playerWeaponName != "Spear") game.network.sendRpc({name: "EquipItem", itemName: "Spear", tier: game.ui.components.MenuShop.shopItems.Spear.itemTier});
    }
})
/*------------------Auto Buy Bomb------------------*/
let V_AutoBuyBomb = false;
document.getElementById('B_AutoBuyBomb').addEventListener('click', function(){
    V_AutoBuyBomb = !V_AutoBuyBomb;
    document.getElementById('B_AutoBuyBomb').className = V_AutoBuyBomb? "ZTbtn_on" : "ZTbtn_off";
})
game.network.addEntityUpdateHandler(() => {
    if(V_AutoBuyBomb){
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 1 && game.ui.playerTick.gold >= 100) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 2 && game.ui.playerTick.gold >= 400) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
    }
})
/*------------------Auto Equip Bomb------------------*/
let V_AutoEquipBomb = false;
document.getElementById('B_AutoEquipBomb').addEventListener('click', function(){
    V_AutoEquipBomb = !V_AutoEquipBomb;
    document.getElementById('B_AutoEquipBomb').className = V_AutoEquipBomb? "ZTbtn_on" : "ZTbtn_off";
})
game.network.addEntityUpdateHandler(() => {
    if(V_AutoEquipBomb){
        if (game.ui.playerWeaponName != "Bomb") game.network.sendRpc({name: "EquipItem", itemName: "Bomb", tier: game.ui.components.MenuShop.shopItems.Bomb.itemTier});
    }
})
/*------------------Auto Respawn------------------*/
let V_AutoRespawn = false;
document.getElementById('B_AutoRespawn').addEventListener('click', function(){
    V_AutoRespawn = !V_AutoRespawn;
    document.getElementById('B_AutoRespawn').className = V_AutoRespawn? "ZTbtn_on" : "ZTbtn_off";
})
game.network.addEntityUpdateHandler(() => {
    if(V_AutoRespawn){
        document.getElementsByClassName("hud-respawn-btn")[0].click();
    }
})
/*------------------Auto Heal------------------*/
let V_AutoHeal = true;
let V_CanBuyHeal = true;
document.getElementById('B_AutoHeal').addEventListener('click', function(){
    V_AutoHeal = !V_AutoHeal;
    document.getElementById('B_AutoHeal').className = V_AutoHeal? "ZTbtn_on" : "ZTbtn_off";
})
game.network.addEntityUpdateHandler(() => {
    if(V_AutoHeal && V_LoggedIn){
        try{
            let HealthPercentage = game.ui.playerTick.health / game.ui.playerTick.maxHealth * 100
            if(HealthPercentage <= parseInt(document.getElementById('I_AutoHeal').value) && V_CanBuyHeal == false) {
                V_CanBuyHeal = null;
                game.network.sendRpc({"name": "EquipItem","itemName": "HealthPotion","tier": 1});
                setTimeout(function(){
                    V_CanBuyHeal = true;
                    console.log('ff');
                }, 10000)
            }
            if(document.getElementsByClassName('hud-toolbar-item')[5].classList[1] && V_CanBuyHeal && game.ui.playerTick.gold >= 100) {
                V_CanBuyHeal = false;
                game.network.sendRpc({"name": "BuyItem","itemName": "HealthPotion","tier": 1});
            }
        }catch{}
    }
})
/*------------------Auto Heal Pet------------------*/
let V_AutoHealPet = true;
let V_CanBuyHealPet = true;
document.getElementById('B_AutoHealPet').addEventListener('click', function(){
    V_AutoHealPet = !V_AutoHealPet;
    document.getElementById('B_AutoHealPet').className = V_AutoHealPet? "ZTbtn_on" : "ZTbtn_off";
})
game.network.addEntityUpdateHandler(() => {
    if(V_AutoHealPet && V_LoggedIn){
        try{
            let PetHealthPercentage = game.ui.playerPetTick.health / game.ui.playerPetTick.maxHealth * 100
            if(PetHealthPercentage <= parseInt(document.getElementById('I_AutoHealPet').value)) {
                game.network.sendRpc({"name": "EquipItem","itemName": "PetHealthPotion","tier": 1});
                setTimeout(function(){
                    V_CanBuyHealPet = true;
                }, 15000)
            }
            if(document.getElementsByClassName('hud-toolbar-item')[5].classList[1] && V_CanBuyHealPet && game.ui.playerTick.gold >= 100) {
                V_CanBuyHealPet = false;
                game.network.sendRpc({"name": "BuyItem","itemName": "PetHealthPotion","tier": 1});
            }
        }catch{}
    }
})
/*------------------Ground Render------------------*/
let V_GroundRender = true;
document.getElementById('B_GroundRender').addEventListener('click', function(){
    V_GroundRender = !V_GroundRender;
    document.getElementById('B_GroundRender').className = V_GroundRender? "ZTbtn_on" : "ZTbtn_off";
    game.renderer.ground.setVisible(V_GroundRender);
})
/*------------------Projectiles Render------------------*/
let V_ProjectilesRender = true;
document.getElementById('B_ProjectilesRender').addEventListener('click', function(){
    V_ProjectilesRender = !V_ProjectilesRender;
    document.getElementById('B_ProjectilesRender').className = V_ProjectilesRender? "ZTbtn_on" : "ZTbtn_off";
    game.renderer.projectiles.setVisible(V_ProjectilesRender);
})
/*------------------Scenery Render------------------*/
let V_SceneryRender = true;
document.getElementById('B_SceneryRender').addEventListener('click', function(){
    V_SceneryRender = !V_SceneryRender;
    document.getElementById('B_SceneryRender').className = V_SceneryRender? "ZTbtn_on" : "ZTbtn_off";
    game.renderer.scenery.setVisible(V_SceneryRender);
})
/*------------------Auto Raid Capture------------------*/
let V_AutoRaidCapture = true;
document.getElementById('B_AutoRaidCapture').addEventListener('click', function(){
    V_AutoRaidCapture = !V_AutoRaidCapture;
    document.getElementById('B_AutoRaidCapture').className = V_AutoRaidCapture? "ZTbtn_on" : "ZTbtn_off";
})
function StopRender(){
    game.renderer.stop();
    let StartRenderBtn = document.createElement('button')
    StartRenderBtn.innerHTML = "Start Render";
    StartRenderBtn.id = "StopRenderBtn";
    document.getElementsByClassName('hud-top-center')[0].appendChild(StartRenderBtn);
    document.getElementById("StopRenderBtn").addEventListener('click', function(){
        document.getElementById("StopRenderBtn").remove();
        game.renderer.start();
    })
}
game.network.addEntityUpdateHandler(() => {
    if(V_AutoRaidCapture && V_LoggedIn){
        game.renderer.entities.attachments[1].attachments.forEach(function(i){
            if(i.targetTick.model === "GoldStash"){
                if(i.targetTick.health / i.targetTick.maxHealth * 100  <= 6.5 && !document.getElementById("StopRenderBtn")) StopRender();
            }
        })
    }
})
/*------------------Join Psk------------------*/
let V_JoinPsk = false;
document.getElementById('B_JoinPsk').addEventListener('click', function(){
    if(document.getElementById('B_JoinPskInput').value.length === 20){
        V_JoinPsk = !V_JoinPsk;
        document.getElementById('B_JoinPsk').className = V_JoinPsk? "ZTbtn_on" : "ZTbtn_off";
    }
})
game.network.addEntityUpdateHandler(() => {
    if(V_JoinPsk){
        if(document.getElementById('B_JoinPskInput').value !== game.ui.playerPartyShareKey){
            joinParty(document.getElementById('B_JoinPskInput').value);
        }
    }
})
/*------------------Leave Party------------------*/
document.getElementById('B_LeaveParty').addEventListener('click', function(){
    if(game.ui.playerPartyMembers !== 1){
        leaveparty();
    }
})
/*------------------Name Res------------------*/
function SetResName(){
    Object.entries(game.world.entities).forEach((stuff => {
        if(stuff[1].targetTick.entityClass == "PlayerEntity"){
            let newName = stuff[1].targetTick.name + `\n Wood:` +
                game.world.entities[stuff[1].targetTick.uid].targetTick.wood + `\n Stone: ` +
                game.world.entities[stuff[1].targetTick.uid].targetTick.stone + `\n Gold: ` +
                game.world.entities[stuff[1].targetTick.uid].targetTick.gold + `\n Tokens:` +
                game.world.entities[stuff[1].targetTick.uid].targetTick.token + `\n\n\n`;
            game.world.entities[stuff[1].targetTick.uid].currentModel.nameEntity.setString(newName);
        }
    }))
    if (game.world.localPlayer.entity) game.world.localPlayer.entity.currentModel.nameEntity.setString(game.ui.playerTick.name)
}

game.network.addEntityUpdateHandler(() => {
    if (V_LoggedIn){
        if(game.ui.playerTick) SetResName();
    }
})
/*------------------Player Position Display------------------*/
game.network.addEntityUpdateHandler(() => {
    if (game.ui.playerTick){
        let position = game.ui.playerTick.position;
        document.getElementById('T_PlayerPositionDisplay').innerText = `X: ${position.x} Y: ${position.y}`;
    }
})
/*------------------Pin Map Position------------------*/
let V_PinnedPosition = {};
document.getElementById('B_PinPosition').addEventListener('click', function(){
    V_PinnedPosition = game.ui.playerTick.position;
})
document.getElementById('B_UnpinPosition').addEventListener('click', function(){
    V_PinnedPosition = {};
})

document.getElementsByTagName('canvas')[0].id = "originalCanvas";
let V_OldCanvas = document.getElementById('originalCanvas');

var V_LocationMark;

window.addEventListener('DOMContentLoaded', function (e){
    V_LocationMark = new LocationMark(37, 37);
    V_NewCanvasArea.start();
});

var V_NewCanvasArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        V_NewCanvasArea.canvas.width = V_OldCanvas.width;
        V_NewCanvasArea.canvas.height = V_OldCanvas.height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.canvas.style.position = 'absolute';
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function LocationMark(width, height){
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    const img = new Image();
    img.src = "https://zombs-tools.casuallyca.repl.co/Images/location-dot.svg";
    this.img = img;
    this.update = function(){
        let ctx = V_NewCanvasArea.context;
        if(V_NewCanvasArea.context){
            ctx.save();

            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.rotation / 57.15);
            ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
            ctx.drawImage(img, this.x, this.y);

            ctx.restore();
        }
    }
    this.newPos = function() {
        let playerPos = game.renderer.worldToScreen(V_PinnedPosition.x, V_PinnedPosition.y)

        let canvasWidth = V_NewCanvasArea.canvas.width;
        let canvasHeight = V_NewCanvasArea.canvas.height;

        let borderTouch = false;
        this.x = playerPos.x + 40;
        if (this.x < 0) {
            this.x = 0;
            borderTouch = true;
        }
        if (this.x + this.width > canvasWidth) {
            this.x = canvasWidth - this.width;
            borderTouch = true;
        }
        this.y = playerPos.y + 40;
        if (this.y < 0) {
            this.y = 0;
            borderTouch = true;
        }
        if (this.y + this.height > canvasHeight) {
            this.y = canvasHeight - this.height;
            borderTouch = true;
        }

        this.rotation = borderTouch ? game.inputPacketCreator.screenToYaw(this.x, this.y) + 180 : 0;
    }
}

setInterval(function(){
    V_NewCanvasArea.clear();
    if (V_PinnedPosition !== {}){
        if (V_NewCanvasArea.canvas.width !== V_OldCanvas.width) V_NewCanvasArea.canvas.width = V_OldCanvas.width;
        if (V_NewCanvasArea.canvas.height !== V_OldCanvas.height) V_NewCanvasArea.canvas.height = V_OldCanvas.height;
        V_LocationMark.newPos();
        V_LocationMark.update();
    }
}, 10)
/*------------------Iframe Alts------------------*/
let V_IframesCount = 0;
let V_NearestToCursor;
document.getElementById('B_SendAlt').addEventListener('click', function(){
    let iframe = document.createElement('iframe');
    V_IframesCount++;
    iframe.id = "iframeId" + V_IframesCount;
    iframe.className = "iframeAlts";
    iframe.src = `http://zombs.io/#/${game.options.serverId}/${game.ui.playerPartyShareKey}/${iframe.id}`;

    iframe.addEventListener('load', function(e) {
        iframe.contentWindow.eval(`
          window.nearestToCursor = false;
          let iframeId = location.hash.substring(8);

          game.renderer.scene.setVisible(false);

          document.getElementsByClassName("hud-intro-play")[0].click();

          var joinedGameCheck = setTimeout(function(){
            if (document.getElementsByClassName('hud-intro-error')[0].innerHTML !== "" && !game.world.inWorld) {
              parent.game.ui.getComponent('PopupOverlay').showHint(document.getElementsByClassName('hud-intro-error')[0].innerHTML, 3000);
              parent.V_IframesCount--;
              parent.document.getElementById("iframeId" + iframeId).remove();
            }
          }, 20000)

          game.network.addEnterWorldHandler(function(e) {
                clearTimeout(joinedGameCheck);
          })

          function MoveAltTo(position){
            let x = Math.round(position.x);
            let y = Math.round(position.y);

            if (game.ui.playerTick.position.y-y > 100) {
              game.network.sendInput({down: 0})
            } else {
              game.network.sendInput({down: 1})
            }
            if (-game.ui.playerTick.position.y+y > 100) {
               game.network.sendInput({up: 0})
            } else {
               game.network.sendInput({up: 1})
            }
            if (-game.ui.playerTick.position.x+x > 100) {
               game.network.sendInput({left: 0})
            } else {
               game.network.sendInput({left: 1})
            }
            if (game.ui.playerTick.position.x-x > 100) {
               game.network.sendInput({right: 0})
            } else {
               game.network.sendInput({right: 1})
            }
          }

          game.network.addEntityUpdateHandler(() => {
            if (game.ui.playerTick){
              switch (parent.document.getElementById('B_AltMove').innerText){
                case "Follow Player":
                  MoveAltTo(parent.game.ui.playerTick.position);
                  break;
                case "Follow Cursor":
                  MoveAltTo(parent.game.renderer.screenToWorld(parent.game.ui.mousePosition.x, parent.game.ui.mousePosition.y));
                  break;
                case "Stay":
                  game.network.sendInput({left: 0});
                  game.network.sendInput({right: 0});
                  game.network.sendInput({up: 0});
                  game.network.sendInput({down: 0});
                  break;
                case "Move Exactly":
                  if(parent.document.getElementById('hud-chat').className.includes('is-focus')) break;
                  let xyVel = {x: 0, y: 0};
                  if (parent.game.inputManager.keysDown[87]) xyVel.y++; // w
                  if (parent.game.inputManager.keysDown[65]) xyVel.x--; // a
                  if (parent.game.inputManager.keysDown[83]) xyVel.y--; // s
                  if (parent.game.inputManager.keysDown[68]) xyVel.x++; // d
                  game.network.sendInput({up: xyVel.y > 0 ? 1 : 0});
                  game.network.sendInput({left: xyVel.x < 0 ? 1 : 0});
                  game.network.sendInput({down: xyVel.y < 0 ? 1 : 0});
                  game.network.sendInput({right: xyVel.x > 0 ? 1 : 0});
                  break;
              }

              //Aim
              let worldMousePos = parent.game.renderer.screenToWorld(parent.game.ui.mousePosition.x, parent.game.ui.mousePosition.y);
              if (parent.game.inputManager.mouseDown) {
                game.network.sendInput({mouseDown: 0});
                game.network.sendInput({mouseMoved: game.inputPacketCreator.screenToYaw((-game.ui.playerTick.position.x + worldMousePos.x)*100, (-game.ui.playerTick.position.y + worldMousePos.y)*100)});
              }
              if (!parent.game.inputManager.mouseDown) {
                if (!window.nearestToCursor && parent.game.inputManager.keysDown[73]) game.network.sendInput({mouseUp: 0});
                game.network.sendInput({mouseMoved: game.inputPacketCreator.screenToYaw((-game.ui.playerTick.position.x + worldMousePos.x)*100, (-game.ui.playerTick.position.y + worldMousePos.y)*100)});
              }

              if(!parent.game.inputManager.mouseDown){
                if (window.nearestToCursor && parent.game.inputManager.keysDown[73]) {
                  game.network.sendRpc({name: "JoinPartyByShareKey",partyShareKey: parent.document.getElementById('B_AltHitInput').value});
                  game.network.sendInput({mouseDown: 0});
                }
                if(parent.game.inputManager.keysDown[73] && game.ui.playerPartyShareKey === parent.document.getElementById('B_AltHitInput').value){
                  game.network.sendRpc({ name: "LeaveParty"})
                  game.network.sendInput({mouseUp: 0});
                }
                else{
                  game.network.sendInput({mouseUp: 0});
                }
              }
              //////////////////////////////////////////////////////////////////////////////////////////////////
              let bombTier = game.ui.inventory.Bomb ? game.ui.inventory.Bomb.tier : 0;
              let bombGoldCost = [100, 400, 3000, 5000, 24000, 50000, 90000];
              if (game.ui.playerTick.gold >= bombGoldCost[bombTier]) game.network.sendRpc({name: "BuyItem", itemName: "Bomb", tier: bombTier + 1})

              if (game.ui.playerWeaponName !== "Bomb" && game.ui.inventory.Bomb) game.network.sendRpc({"name": "EquipItem", "itemName": "Bomb", "tier": game.ui.inventory.Bomb.tier})

              game.network.addRpcHandler("Dead", function(e) {
                game.network.sendPacket(3, { respawn: 1 })
              })

              if(parent.game.inputManager.keysDown[76]) game.network.sendRpc({ name: "LeaveParty"})
            }
          })
          function GetDistanceToCursor(cursorPos){
            let pos = game.ui.playerTick.position;
            let xDistance = Math.abs(pos.x - cursorPos.x);;
            let yDistance = Math.abs(pos.y - cursorPos.y);
            return Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
          }
        `);
    })
    iframe.style.display = 'none';
    document.body.append(iframe);
})

let V_AltMoveClicks = 0;
var V_AltMoveStyle = "Stay";
document.getElementById('B_AltMove').addEventListener('click', function(){
    let moveOrder = ["Stay", "Follow Cursor", "Follow Player", "Move Exactly"];
    V_AltMoveClicks++;
    V_AltMoveStyle = moveOrder[V_AltMoveClicks % 4]
    document.getElementById('B_AltMove').innerText = V_AltMoveStyle;
})

document.getElementById('B_DeleteAlts').addEventListener('click', function(){
    let deleteAltLoop = setInterval(function(){
        if (document.getElementsByClassName('iframeAlts').length > 0){
            for(let iframe of document.getElementsByClassName('iframeAlts')){
                iframe.remove();
            }
        }
        else{
            clearInterval(deleteAltLoop);
        }
    })
})

var nearestToCursorIframeId;
setInterval(() => {
    let nearestIframeDistance = 9999999999999999;
    for(let iframe of document.getElementsByClassName('iframeAlts')){
        if (typeof(iframe.contentWindow.nearestToCursor) === 'undefined') continue;
        iframe.contentWindow.nearestToCursor = false;
        let mousePosition = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
        let distance = iframe.contentWindow.GetDistanceToCursor(mousePosition);
        if(distance < nearestIframeDistance){
            nearestIframeDistance = distance;
            nearestToCursorIframeId = iframe.id;
        }
    }
    if (document.getElementById(nearestToCursorIframeId)) {
        let iframeWindow = document.getElementById(nearestToCursorIframeId).contentWindow;
        if (typeof(iframeWindow.nearestToCursor) === 'boolean'){
            iframeWindow.nearestToCursor = true;
        }
    }
},100)
/*------------------.------------------*/
// butterfly
//'{"74467696":{"x":7584,"y":10176,"type":"GoldStash","dead":0,"uid":74467696,"tier":8},"125286096":{"x":7776,"y":9984,"type":"BombTower","dead":0,"uid":125286096,"tier":8},"125286102":{"x":8064,"y":9696,"type":"BombTower","dead":0,"uid":125286102,"tier":8},"125286104":{"x":8064,"y":9600,"type":"CannonTower","dead":0,"uid":125286104,"tier":8},"125286105":{"x":7968,"y":9648,"type":"CannonTower","dead":0,"uid":125286105,"tier":8},"125286106":{"x":7968,"y":9744,"type":"CannonTower","dead":0,"uid":125286106,"tier":8},"125286107":{"x":7872,"y":9744,"type":"CannonTower","dead":0,"uid":125286107,"tier":8},"125286110":{"x":7776,"y":9792,"type":"CannonTower","dead":0,"uid":125286110,"tier":8},"125286112":{"x":7680,"y":9840,"type":"CannonTower","dead":0,"uid":125286112,"tier":8},"125286113":{"x":7680,"y":9744,"type":"MagicTower","dead":0,"uid":125286113,"tier":8},"125286114":{"x":7776,"y":9696,"type":"MagicTower","dead":0,"uid":125286114,"tier":8},"125286115":{"x":7872,"y":9648,"type":"MagicTower","dead":0,"uid":125286115,"tier":8},"125286116":{"x":7968,"y":9552,"type":"MagicTower","dead":0,"uid":125286116,"tier":8},"125286117":{"x":7536,"y":9696,"type":"MagicTower","dead":0,"uid":125286117,"tier":8},"125286118":{"x":7440,"y":9648,"type":"MagicTower","dead":0,"uid":125286118,"tier":8},"125286119":{"x":7344,"y":9600,"type":"MagicTower","dead":0,"uid":125286119,"tier":8},"125286120":{"x":7536,"y":9792,"type":"CannonTower","dead":0,"uid":125286120,"tier":8},"125286122":{"x":7344,"y":9696,"type":"CannonTower","dead":0,"uid":125286122,"tier":8},"125286123":{"x":7536,"y":9888,"type":"ArrowTower","dead":0,"uid":125286123,"tier":8},"125286125":{"x":7344,"y":9792,"type":"CannonTower","dead":0,"uid":125286125,"tier":8},"125286135":{"x":7104,"y":9984,"type":"MagicTower","dead":0,"uid":125286135,"tier":8},"125286136":{"x":7152,"y":10080,"type":"MagicTower","dead":0,"uid":125286136,"tier":8},"125286137":{"x":7104,"y":10224,"type":"MagicTower","dead":0,"uid":125286137,"tier":8},"125286146":{"x":7248,"y":10080,"type":"CannonTower","dead":0,"uid":125286146,"tier":8},"125286147":{"x":7200,"y":9984,"type":"CannonTower","dead":0,"uid":125286147,"tier":8},"125286148":{"x":7488,"y":10416,"type":"BombTower","dead":0,"uid":125286148,"tier":8},"125286149":{"x":7392,"y":10368,"type":"BombTower","dead":0,"uid":125286149,"tier":8},"125286150":{"x":7392,"y":10464,"type":"BombTower","dead":0,"uid":125286150,"tier":8},"125286151":{"x":7296,"y":10512,"type":"BombTower","dead":0,"uid":125286151,"tier":8},"125286152":{"x":7200,"y":10512,"type":"BombTower","dead":0,"uid":125286152,"tier":8},"125286153":{"x":7296,"y":10416,"type":"BombTower","dead":0,"uid":125286153,"tier":8},"125286160":{"x":7392,"y":10656,"type":"MagicTower","dead":0,"uid":125286160,"tier":8},"125286161":{"x":7488,"y":10608,"type":"MagicTower","dead":0,"uid":125286161,"tier":8},"125286162":{"x":7392,"y":10560,"type":"ArrowTower","dead":0,"uid":125286162,"tier":8},"125286163":{"x":7488,"y":10512,"type":"ArrowTower","dead":0,"uid":125286163,"tier":8},"125286164":{"x":7632,"y":10464,"type":"ArrowTower","dead":0,"uid":125286164,"tier":8},"125286165":{"x":7632,"y":10560,"type":"ArrowTower","dead":0,"uid":125286165,"tier":8},"125286166":{"x":7632,"y":10656,"type":"MagicTower","dead":0,"uid":125286166,"tier":8},"125286168":{"x":7728,"y":10704,"type":"MagicTower","dead":0,"uid":125286168,"tier":8},"125286169":{"x":7824,"y":10752,"type":"MagicTower","dead":0,"uid":125286169,"tier":8},"125286171":{"x":7824,"y":10656,"type":"ArrowTower","dead":0,"uid":125286171,"tier":8},"125286172":{"x":7824,"y":10560,"type":"BombTower","dead":0,"uid":125286172,"tier":8},"125286173":{"x":7728,"y":10464,"type":"BombTower","dead":0,"uid":125286173,"tier":8},"125286176":{"x":7776,"y":10368,"type":"BombTower","dead":0,"uid":125286176,"tier":8},"125286178":{"x":7872,"y":10368,"type":"BombTower","dead":0,"uid":125286178,"tier":8},"125286179":{"x":7920,"y":10464,"type":"BombTower","dead":0,"uid":125286179,"tier":8},"125286181":{"x":7920,"y":10560,"type":"BombTower","dead":0,"uid":125286181,"tier":8},"125286186":{"x":7224,"y":10776,"type":"Door","dead":0,"uid":125286186,"tier":8},"125286192":{"x":7824,"y":10464,"type":"BombTower","dead":0,"uid":125286192,"tier":8},"125286193":{"x":7272,"y":10680,"type":"Door","dead":0,"uid":125286193,"tier":8},"125286194":{"x":7224,"y":10584,"type":"Door","dead":0,"uid":125286194,"tier":8},"125286195":{"x":7176,"y":10584,"type":"Door","dead":0,"uid":125286195,"tier":8},"125286196":{"x":7128,"y":10584,"type":"Door","dead":0,"uid":125286196,"tier":8},"125286197":{"x":7128,"y":10632,"type":"Door","dead":0,"uid":125286197,"tier":8},"125286198":{"x":7128,"y":10680,"type":"Door","dead":0,"uid":125286198,"tier":8},"125286199":{"x":7080,"y":10680,"type":"Door","dead":0,"uid":125286199,"tier":8},"125286201":{"x":7128,"y":10728,"type":"Door","dead":0,"uid":125286201,"tier":8},"125286205":{"x":8016,"y":10464,"type":"ArrowTower","dead":0,"uid":125286205,"tier":8},"125286207":{"x":7320,"y":10680,"type":"Door","dead":0,"uid":125286207,"tier":8},"125286208":{"x":7320,"y":10728,"type":"Door","dead":0,"uid":125286208,"tier":8},"125286215":{"x":8112,"y":10464,"type":"MagicTower","dead":0,"uid":125286215,"tier":8},"125286221":{"x":8064,"y":10368,"type":"MagicTower","dead":0,"uid":125286221,"tier":8},"125286227":{"x":8016,"y":10272,"type":"MagicTower","dead":0,"uid":125286227,"tier":8},"125286234":{"x":7968,"y":10368,"type":"CannonTower","dead":0,"uid":125286234,"tier":8},"125286238":{"x":7776,"y":9888,"type":"ArrowTower","dead":0,"uid":125286238,"tier":8},"125286239":{"x":7920,"y":10272,"type":"CannonTower","dead":0,"uid":125286239,"tier":8},"125286245":{"x":7872,"y":10128,"type":"ArrowTower","dead":0,"uid":125286245,"tier":8},"125286246":{"x":7968,"y":10128,"type":"ArrowTower","dead":0,"uid":125286246,"tier":8},"125286249":{"x":8112,"y":10032,"type":"MagicTower","dead":0,"uid":125286249,"tier":8},"125286269":{"x":8232,"y":9864,"type":"Door","dead":0,"uid":125286269,"tier":8},"125286271":{"x":8232,"y":9768,"type":"Door","dead":0,"uid":125286271,"tier":8},"125286287":{"x":7248,"y":9888,"type":"BombTower","dead":0,"uid":125286287,"tier":8},"125286288":{"x":7344,"y":9888,"type":"BombTower","dead":0,"uid":125286288,"tier":8},"125286289":{"x":7392,"y":9984,"type":"BombTower","dead":0,"uid":125286289,"tier":8},"125286295":{"x":7176,"y":9624,"type":"Wall","dead":0,"uid":125286295,"tier":8},"125286300":{"x":6936,"y":10440,"type":"Wall","dead":0,"uid":125286300,"tier":8},"125286321":{"x":8088,"y":10536,"type":"Door","dead":0,"uid":125286321,"tier":8},"125286328":{"x":7896,"y":10728,"type":"Door","dead":0,"uid":125286328,"tier":8},"125286332":{"x":7992,"y":10632,"type":"Door","dead":0,"uid":125286332,"tier":8},"125286347":{"x":7032,"y":10680,"type":"Door","dead":0,"uid":125286347,"tier":8},"125286348":{"x":7080,"y":10728,"type":"Wall","dead":0,"uid":125286348,"tier":8},"125286433":{"x":7176,"y":10776,"type":"Wall","dead":0,"uid":125286433,"tier":8},"125306787":{"x":8088,"y":10584,"type":"Door","dead":0,"uid":125306787,"tier":8},"125306789":{"x":7992,"y":10680,"type":"Door","dead":0,"uid":125306789,"tier":8},"125327837":{"x":8040,"y":10200,"type":"SlowTrap","dead":0,"uid":125327837,"tier":8},"125327838":{"x":7992,"y":10200,"type":"SlowTrap","dead":0,"uid":125327838,"tier":8},"125327839":{"x":7896,"y":10200,"type":"SlowTrap","dead":0,"uid":125327839,"tier":8},"125327841":{"x":7944,"y":10200,"type":"SlowTrap","dead":0,"uid":125327841,"tier":8},"125328083":{"x":7128,"y":10152,"type":"SlowTrap","dead":0,"uid":125328083,"tier":8},"125328138":{"x":7176,"y":10152,"type":"SlowTrap","dead":0,"uid":125328138,"tier":8},"125328160":{"x":7224,"y":10152,"type":"SlowTrap","dead":0,"uid":125328160,"tier":8},"125328167":{"x":7272,"y":10152,"type":"SlowTrap","dead":0,"uid":125328167,"tier":8},"125328205":{"x":7320,"y":10152,"type":"SlowTrap","dead":0,"uid":125328205,"tier":8},"125328419":{"x":7560,"y":10632,"type":"SlowTrap","dead":0,"uid":125328419,"tier":8},"125328516":{"x":7560,"y":10584,"type":"SlowTrap","dead":0,"uid":125328516,"tier":8},"125328519":{"x":7560,"y":10536,"type":"SlowTrap","dead":0,"uid":125328519,"tier":8},"125328549":{"x":7560,"y":10488,"type":"SlowTrap","dead":0,"uid":125328549,"tier":8},"125328617":{"x":7560,"y":10440,"type":"SlowTrap","dead":0,"uid":125328617,"tier":8},"125329454":{"x":7608,"y":9720,"type":"SlowTra... (45 KB left)
