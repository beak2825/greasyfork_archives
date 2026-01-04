// ==UserScript==
// @name         Furious Mod. Version:0.2...
// @namespace    none
// @version      0.2
// @description  BuildCount, v8-FixBigPing, SaveChat, FastInsta, AutoCoordWalk, AFKMode, R-InstaKill, AutoHeal, AutoAntiBull, AntiInsta, FollowAnimals, AutoFarmResource, M-TripleWASDMills, UpArrow-Katana+Musket, H-Turret, N-Mill, V-spike, F-Trap, Z-TankGear, Shift-BiomeHats, Esc-BetterMenu, AutoAntiBull, MouseClicks, BetterHotBar, OneTickInsta. Please rate this script in the comments! I'm trying really hard! Give me your support!
// @author       Prezi#6361, GeasyFork: https://greasyfork.org/ru/users/759782-00100110
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441194/Furious%20Mod%20Version%3A02.user.js
// @updateURL https://update.greasyfork.org/scripts/441194/Furious%20Mod%20Version%3A02.meta.js
// ==/UserScript==
// Script in greasyfork: https://greasyfork.org/ru/scripts/431370-mFurious Mod-v6-new-menu-and-more
 
// Ping Adapter...
(function() {
    'use strict'
    class Main {
        constructor(status) {
            this.status = status
        }
        RemoveAd() {
            try {
                setTimeout(() => ($('#ot-sdk-btn-floating').remove(), $('#pre-content-container').remove()), 3000)
                document.getElementById("moomooio_728x90_home").style.display = "none"
                $("#moomooio_728x90_home").parent().css("display", "none")
                $("#moomooio_728x90_home").remove()
                $('#adCard').remove()
                $("#adBlock").remove()
            } catch (e) {}
        }
        AdapterPing() {
            try {
                $("#errorNotification").remove()
                $("#youtuberOf").remove()
                $("#followText").remove()
                $("#promoImgHolder").remove()
                $("#twitterFollow").remove()
                $("#linksContainer2").remove()
                $("#youtubeFollow").remove()
                $("#mobileInstructions").remove()
                $("#downloadButtonContainer").remove()
                $("#mobileDownloadButtonContainer").remove()
                $(".downloadBadge").remove()
            } catch (e) {}
        }
        AdapterFPS() {
            try {
                window.location.native_resolution = true
            } catch (e) {}
        }
    }
    const MAIN = new Main("Work")
    console.log("Status: " + MAIN.status)
    queueMicrotask(MAIN.AdapterPing)
    queueMicrotask(MAIN.AdapterFPS)
    queueMicrotask(MAIN.RemoveAd)
    const $el_PING = $("#pingDisplay")
    $el_PING.css("display", "block")
    $("body").append($el_PING)
})()
 
// Menu toggler...
let keyMenu = "27"
document.addEventListener('keydown', e => {
    if (e.code == $("#KeyOpenGuiMenu").val()) {
        if ($('.blockMenu').css('display') == 'none') $('.blockMenu').animate({
            top: 'show'
        }, 100);
        else $('.blockMenu').animate({
            top: 'hide'
        }, 100);
    }
})
 
// Edit style mainMenu...
let editMainMenu = `
<style>
#setupCard {
border-radius: 30px;
}
#enterGame {
transition: 1s all;
text-align: center;
font-size: 23px;
padding: 6px;
color: #fff;
background-color: #2c9506;
box-shadow: 0px 0px 8px gray, 0px 0px 4px gray;
width: 100%;
border-radius: 15px;
cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
}
#nameInput {
text-align: center;
cursor: text;
outline: 0;
display: block;
background: #fff;
box-shadow: 0px 0px 5px gray, 0px 0px 2px gray;
border: none;
padding: 6px;
color: #4a4a4a;
border-radius: 10px;
}
#nameInput::selection {
  background: #828282;
}
.skinColorItem {
  border: 3px solid black;
  transition: 1s all;
}
#guideCard::-webkit-scrollbar{
  width: 0px;
  height: 0px;
  background-color: rgba(0, 0, 0, 0);
}
#guideCard {
  border-radius: 30px;
}
#mainMenu {
  background: #121212;
}
.menuCard {
  background: #e6e3df;
  text-align: center;
  box-shadow: inset 0px 0px 10px black;
}
</style>
`
 
// Furious Mod menu...
let GameMenu = `
<div class="blockMenu" style="display: none;">
    <img src="http://s1.iconbird.com/ico/2013/8/429/w512h5121377940132185095settingsstreamline.png" align="bottom" style="text-align: bottom;" id="imgTitle">
    <div class="titleMenu">Setting<span class="twoTitleName">Furious Mod</span></div>
    <hr>
    <div class="ScrollFixedPositionBlock">
        <a class="ScrollElementBox" href="#ScrollElement1"><span>AutoHeal</span></a>
        <a class="ScrollElementBox" href="#ScrollElement2"><span>AntiInsta</span></a>
        <a class="ScrollElementBox" href="#ScrollElement3"><span>InstaKill</span></a>
        <a class="ScrollElementBox" href="#ScrollElement4"><span>AntiTrap</span></a>
        <a class="ScrollElementBox" href="#ScrollElement5"><span>Follow</span></a>
        <a class="ScrollElementBox" href="#ScrollElement12"<span>PVP</span></a>
        <a class="ScrollElementBox" href="#ScrollElement6"><span>Other</span></a>
        <a class="ScrollElementBox" href="#ScrollElement7"><span>Walk</span></a>
        <a class="ScrollElementBox" href="#ScrollElement11"><span>AFK</span></a>
        <a class="ScrollElementBox" href="#ScrollElement8"><span>Cmd</span></a>
        <a class="ScrollElementBox" href="#ScrollElement9"><span>Bind</span></a>
        <a class="ScrollElementBox" href="#ScrollElement10"<span>Menu</span></a>
    </div>
    <div class="blockSetting">
        <section class="InvisibleElementForScroll" id="ScrollElement1"></section>
        <fieldset>
            <legend align="center">Heal</legend>
            <SettingText>Auto healing <label class="checkbox-green"><input type="checkbox" id="AutoHeal" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText>Use soldier <label class="checkbox-green"><input type="checkbox" id="SoldierForAutoHeal"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText>Chat <input class="inputTxt" id="AutoHealChat" maxlength="30" placeholder="Message..." type="text"></SettingText>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement2"></section>
        <fieldset>
            <legend align="center">AntiInsta</legend>
            <SettingText title="AntiInsta from Furious Mod v9.">Anti insta (v9)<label class="checkbox-green"><input type="checkbox" id="MainAntiInsta" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText title="AntiInsta from Furious Mod v6.">Anti insta (v6)<label class="checkbox-green"><input type="checkbox" id="AntiInsta"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText title="AntiInsta from Furious Mod v1-v5.">Anti insta (v1)<label class="checkbox-green"><input type="checkbox" id="AntiInstaOld"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText>Chat <input type="text" class="inputTxt" id="AntiInstaChat" maxlength="30" value="FuriousAntiInsta" placeholder="Message..."></SettingText><br>
            <SettingText>Heal for ai(v6) multiplier <input type="range" min="1" max="10" id="AntiInstaMultiplier" value="1"> x<span id="myMult">1</span></SettingText>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement3"></section>
        <fieldset>
            <legend align="center">InstaKill</legend>
            <SettingText>Auto aim <label class="checkbox-green"><input type="checkbox" id="Aim"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText>Speed normal insta <input class="inputTxt" id="InstaSpeed" maxlength="3" placeholder="Speed..." value="92" type="text"></SettingText><br>
            <SettingText>Auto reload secondary <label class="checkbox-green"><input type="checkbox" id="AutoReloadInstaKill"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText>Chat <input type="text" class="inputTxt" value="FuriousInsta" disabled></SettingText>
            <fieldset>
                <legend align="center">OneTickInsta</legend>
                <SettingText>One tick insta <label class="checkbox-green"><input type="checkbox" id="oneTickInsta"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText>
                <select id="oneTickType" class="select-css">
                    <option value="Back Musket" id="BackMusket">Polearm+BackMusket</option>
                    <option value="Only Polearm" id="OnlyPolearm">OnlyPolearm</option>
                </select>
                <select id="oneTickType2" class="select-css" style="opacity: 0">
                    <option value="Normal Insta" id="Normal">Normal</option>
                    <option value="Smart Insta" id="Smart">Smart</option>
                </select><br>
                  <SettingText>Chat <input type="text" class="inputTxt" value="FuriousOneTick" disabled></SettingText>
                </SettingText>
            </fieldset>
       <fieldset>
              <legend align="center">FastInsta</legend>
              <SettingText>Fast insta <label class="checkbox-green"><input type="checkbox" id="StackInsta"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
              <SettingText>Chat <input type="text" class="inputTxt" value="FuriousFastInsta" disabled></SettingText>
       </fieldset>
       <fieldset>
              <legend align="center">SpikeInsta</legend>
              <SettingText>Spike insta <label class="checkbox-green"><input type="checkbox" id="SpikeInsta"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
              <SettingText>Chat <input type="text" class="inputTxt" value="FuriousSpikeInsta" disabled></SettingText>
       </fieldset>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement4"></section>
        <fieldset>
            <legend align="center">AntiTrap</legend>
            <SettingText>Anti trap <label class="checkbox-green"><input type="checkbox" id="AntiTrap"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label><br>
            Chat <input type="text" class="inputTxt" id="AntiTrapChat" maxlength="30" value="FuriousAntiTrap" placeholder="Message..." disabled\></SettingText><br>
            <SettingText>Start place <select id="StartPlace" class="select-css">
                    <option selected>Types StartPlace</option>
                    <option value="4 start trap" id="Start4traps">4Traps</option>
                    <option value="4 start spike" id="Start4spikes">4Spike</option>
                    <option value="4 start mill" id="Start4mill">4Mill</option>
                </select>
            </SettingText>
            <br>
            <SettingText>End place <select id="EndPlace" class="select-css">
                    <option selected>Types EndPlace</option>
                    <option value="4 end trap" id="End4traps">4Traps</option>
                    <option value="4 end spike" id="End4spikes">4Spike</option>
                    <option value="4 end mill" id="End4mill">4Mill</option>
                    <option value="2 end spikes2 trap" id="End2spikes2trap">2Spike2Trap</option>
                </select>
            </SettingText>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement5"></section>
        <fieldset>
            <legend align="center">Follow</legend>
            <SettingText>Follow animals <label class="checkbox-green"><input type="checkbox" id="FollowAnimals"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText>Auto farm <label class="checkbox-green"><input type="checkbox" id="AutoFarm"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label><br>
                Need resources <input type="text" style="width: 50px;" class="inputTxt" id="NextResource" placeholder="Resources" value="150" \><br>
                Auto farm type <label class="checkbox-green"><input type="checkbox" id="AutoFarmType"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label> <select id="goRes" class="select-css"><br>
                    <option selected disabled>Types Farm</option>
                    <option value="go food" id="gofood">Food</option>
                    <option value="go stone" id="gostone">Stone</option>
                    <option value="go tree" id="gotree">Wood</option>
                    <option value="go mine" id="gomine">Gold</option>
                </select>
            </SettingText>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement12"></section>
        <fieldset>
        <legend align="center">PVP</legend>
         <SettingText>Mouse click <label class="checkbox-green"><input type="checkbox" id="mouseClick"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
         <SettingText>Melee bot <label class="checkbox-green"><input type="checkbox" id="Auto1v1OnlyMeleeBot"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement6"></section>
        <fieldset>
            <legend align="center">Other</legend>
            <SettingText>Spam clan <label class="checkbox-green"><input type="checkbox" id="SpamClan"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label> <input type="text" class="inputTxt" id="SpamClanName" value="FuriousMod" placeholder="Message..."></SettingText><br>
            <SettingText>Spam chat <label class="checkbox-green"><input type="checkbox" id="SpamChat"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label> <input type="text" class="inputTxt" id="SpamChatName" value="FuriousMod" placeholder="Message..."></SettingText><br>
            <SettingText>Send msg if near enemy <label class="checkbox-green"><input type="checkbox" id="helloMode"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label> <input type="text" class="inputTxt" id="MsgText" value="hello!" placeholder="Message..."></SettingText><br>
            <SettingText>Auto anti bull [beta]<label class="checkbox-green"><input type="checkbox" id="AutoAntiBull"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText>360° hit <label class="checkbox-green"><input type="checkbox" id="angleGlitch"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText>Auto respawn <label class="checkbox-green"><input type="checkbox" id="AutoRespawn"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label> <input type="text" class="inputTxt" id="AutoRespawnName" maxlength="15" placeholder="Name..." \></SettingText><br>
            <SettingText>Kill chat <label class="checkbox-green"><input type="checkbox" id="killChat"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label> <input type="text" class="inputTxt" id="KillChat" maxlength="30" placeholder="Chat..." \></SettingText><br>
            <SettingText>Better hot bar <label class="checkbox-green"><input type="checkbox" id="BetterHotBar"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement7"></section>
        <fieldset>
            <legend align="center">Walk</legend>
            <SettingText>Mouse walk <label class="checkbox-green"><input type="checkbox" id="AutoWalk"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText>Auto coord walk <label class="checkbox-green"><input type="checkbox" id="AutoCoordWalk"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label> <input type="text" style="width: 65px;" class="inputTxt" id="WalkX" placeholder="Coord X..."> <input type="text" style="width: 65px;" class="inputTxt" id="WalkY" placeholder="Coord Y..."></SettingText><br>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement11"></section>
        <fieldset>
            <legend align="center">AFK</legend>
            <SettingText >AFK mode <label class="checkbox-green"><input type="checkbox" id="AFKMode"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><div style="display: inline-block;" id="VisibleBR"><hr></div>
            <SettingText id="AfkVisible">Chat <input type="text" class="inputTxt" value="Hello bro!" id="AfkMsg"><br></SettingText>
            <SettingText id="PlaceVisible">Place spike <label class="checkbox-green"><input type="checkbox" id="PlaceSpike"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement8"></section>
        <fieldset>
            <legend align="center">Commands</legend>
            <SettingText>Prefix: <input type="text" class="inputTxt" style="width: 50px;" id="PrefixCommands" maxlength="1" value="!" placeholder="Prefix..."></SettingText>
            <hr>
            <SettingText>Clan: </SettingText><br>
            <MiniSettingText>[Prefix]join NAME</MiniSettingText><br>
            <MiniSettingText>[Prefix]leave</MiniSettingText><br>
            <MiniSettingText>[Prefix]create NAME</MiniSettingText>
            <hr>
            <SettingText>Chat: </SettingText><br>
            <MiniSettingText>[Prefix]clear</MiniSettingText>
            <hr>
            <SettingText>FastAge: </SettingText><br>
            <MiniSettingText>[Prefix]km</MiniSettingText><br>
            <MiniSettingText>[Prefix]pm</MiniSettingText><br>
            <MiniSettingText>[Prefix]kh</MiniSettingText>
            <hr>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement9"></section>
        <fieldset>
            <legend align="center">Bind keys</legend>
            <SettingText>
                Anti trap: <input style="width: 100px;" id="BindAntiTrap" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="KeyO" type="text">
                <br>
                Anti insta: <input style="width: 100px;" id="BindAntiInsta" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="KeyU" type="text">
                <br>
                360° hit: <input style="width: 100px;" id="hit360" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="KeyI" type="text">
                <br>
                Bull Helmet: <input style="width: 100px;" id="BindBull" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="KeyT" type="text">
                <br>
                Samurai Armor: <input style="width: 100px;" id="BindSamurai" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="KeyB" type="text">
                <br>
                Emp Helmet: <input style="width: 100px;" id="BindEmp" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="KeyY" type="text">
            </SettingText>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement10"></section>
        <fieldset>
            <legend align="center">Menu</legend>
            <SettingText>
                Menu color text <input type="color" id="ColorText" value="#4A4A4A"> <button id="DefColorText" class="Button_style">Default</button><br>
                Bind key: <input style="width: 100px;" id="KeyOpenGuiMenu" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="Escape" type="text"><br>
            </SettingText>
            <fieldset>
                <legend align="center">Menu</legend>
                <SettingText>Hud <label class="checkbox-green"><input type="checkbox" id="Hud"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>Hud color text <input type="color" id="ColorText2" value="#ffffff"> <button id="DefColorText2" class="Button_style">Default</button></SettingText><br>
                <SettingText>Hud text size <input type="range" min="1" max="60" id="HudTextSize" value="18"> <span id="myMult2">18</span>px <button id="DefColorText4" class="Button_style">Default</button></SettingText><br>
                <SettingText>Hud shadow <label class="checkbox-green"><input type="checkbox" id="HudShadow"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label> <input type="color" id="ColorText3" value="#FF0000"> <button id="DefColorText3" class="Button_style">Default</button></SettingText>
            </fieldset>
        </fieldset>
        <div id="IfHudOn">
            <fieldset>
                <legend align="center">VisibleInHud</legend>
                <SettingText>AutoHeal <label class="checkbox-green"><input type="checkbox" id="AutoHealVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>HealSoldier <label class="checkbox-green"><input type="checkbox" id="HealSoldierVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>AntiInsta <label class="checkbox-green"><input type="checkbox" id="AntiInstaVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>AutoAim <label class="checkbox-green"><input type="checkbox" id="AutoAimVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>AutoReload <label class="checkbox-green"><input type="checkbox" id="AutoReloadVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>OneTickInsta <label class="checkbox-green"><input type="checkbox" id="OneTickInstaVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>AntiTrap <label class="checkbox-green"><input type="checkbox" id="AntiTrapVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>FollowAnimals <label class="checkbox-green"><input type="checkbox" id="FollowAnimalsVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>MouseWalk <label class="checkbox-green"><input type="checkbox" id="AutoWalkVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>CoordWalk <label class="checkbox-green"><input type="checkbox" id="AutoCoordWalkVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>AFKMode <label class="checkbox-green"><input type="checkbox" id="AFKModeVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>AutoFarm <label class="checkbox-green"><input type="checkbox" id="AutoFarmVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>AutoFarmType <label class="checkbox-green"><input type="checkbox" id="AutoFarmTypeVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>SpamClan <label class="checkbox-green"><input type="checkbox" id="SpamClanVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>SpamChat <label class="checkbox-green"><input type="checkbox" id="SpamChatVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>SendMsg <label class="checkbox-green"><input type="checkbox" id="SendMsgVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>AutoAntiBull <label class="checkbox-green"><input type="checkbox" id="AutoAntiBullVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>MouseClick <label class="checkbox-green"><input type="checkbox" id="MouseClickVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>MeleeBot <label class="checkbox-green"><input type="checkbox" id="MeleeBotVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>360°Hit <label class="checkbox-green"><input type="checkbox" id="360°HitVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>AutoRespawn <label class="checkbox-green"><input type="checkbox" id="AutoRespawnVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>KillChat <label class="checkbox-green"><input type="checkbox" id="KillChatVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>BetterHotBar <label class="checkbox-green"><input type="checkbox" id="BetterHotBarVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>Hud <label class="checkbox-green"><input type="checkbox" id="HudVisible" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            </fieldset>
        </div>
    </div>
    <hr />
    <footer>
        Copyright 00100110 © 2021
    </footer>
</div>
<style>
    #AfkVisible {
        display: none;
    }
    #PlaceVisible {
        display: none;
    }
    .ScrollElementBox {
        display: inline-block;
        width: auto;
        height: auto;
        padding: 5px;
        text-align: center;
        border: 2px solid #4a4a4a;
        border-radius: 4px;
        transition: 0.5s all;
        cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
    }
    .actionBarItem, #chatButton, #storeButton, #allianceButton,
    .allianceButtonM, .joinAlBtn, #allianceManager, #storeMenu,
    .storeTab, .skinColorItem, #altServer, .notifButton,
    #joinPartyButton, .menuLink, #nativeResolution, #showPing,
    #settingsButton {
        cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
    }
    #storeHolder, #gameCanvas, #allianceHolder, .storeItem, #mainMenu {
        cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
    }
    a {
        cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
    }
    #nameInput {
        cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
    }
    input[type="text"] {
    cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
    }
    .ScrollElementBox:link, .ScrollElementBox:visited {
        color: #6a1919;
        text-decoration: none;
    }
    .ScrollElementBox:hover {
        border: 2px solid #b8b8b8;
    }
    .ScrollFixedPositionBlock {
        padding-left: 55px;
        display: block;
        width: 635px;
        height: 30px;
        background: rgba(0, 0, 0, 0);
        border-radius:4px;
        margin-left: 15px;
    }
    .InvisibleElementForScroll {
        font-size: 0px;
        opacity: 0;
        color: rgba(0, 0, 0, 0);
        margin: 0;
        padding: 0;
        width: 0;
        height: 0;
    }
    select {
        outline: 0;
        transition: 1s all;
        cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
        vertical-align: middle;
        user-select: none;
        box-sizing: border-box;
        background: #fff;
        color: #4A4A4A;
        border-radius: 10px;
    }
 
    #IfHudOn {
        display: none;
        transition: 1s all;
    }
 
    select:hover {
        border: 2.5px solid #212121;
    }
    .Button_style {
        cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
        vertical-align: middle;
        user-select: none;
        box-sizing: border-box;
        text-align: center;
        outline: 0;
        display: inline-block;
        border: none;
        border: 5px solid rgba(0, 0, 0, 0);
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08), 0 2px 10px 0 rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        transition: all 1s;
    }
 
    .Button_style:hover {
        box-shadow: inset 0 2px 5px 0 rgba(0, 0, 0, 0.08), inset 0 2px 10px 0 rgba(0, 0, 0, 0.06);
    }
 
    .inputTxt {
        vertical-align: middle;
        user-select: none;
        box-sizing: border-box;
        text-align: center;
        outline: 0;
        display: inline-block;
        border: none;
        border: 5px solid rgba(0, 0, 0, 0);
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08), 0 2px 10px 0 rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        transition: all 1s;
    }
 
    .inputTxt:focus {
        box-shadow: inset 0 2px 5px 0 rgba(0, 0, 0, 0.08), inset 0 2px 10px 0 rgba(0, 0, 0, 0.06);
    }
 
    fieldset {
        padding: 0;
        padding-bottom: 13.5px;
        padding-left: 10px;
        border-radius: 7px;
        border: 2px solid #39342d;
    }
 
    legend {
        color: #4A4A4A;
        font-size: 24px;
    }
 
    footer {
        color: #425c70;
        font-size: 24px;
    }
 
    SettingText {
        color: #4A4A4A;
        font-size: 30px;
        margin-right: 5px;
        text-align: left;
    }
 
    MiniSettingText {
        color: #4A4A4A;
        font-size: 15px;
        margin-right: 5px;
        text-align: left;
    }
 
    .blockSetting {
        display: block;
        background: rgba(209, 209, 209, 0.73);
        overflow-y: scroll;
        overflow-x: hidden;
        width: 660px;
        height: 400px;
        padding: 15px;
        box-shadow: 0 2px 5px 0 rgb(0 0 0 / 29%), 0 2px 10px 0 rgb(0 0 0 / 29%);
        border-radius: 30px;
        margin-top: 10px;
        margin-left: 35px;
    }
 
    .blockSetting::-webkit-scrollbar {
        width: 0px;
        height: 0px;
        background: none;
    }
 
    .twoTitleName {
        position: absolute;
        transform: rotate(45deg) display: inline-block;
        font-size: 18px;
        color: #4a4a4a;
    }
 
    #imgTitle {
        display: inline-block;
        width: 28px;
        background-size: 28px;
        background-repeat: no-repeat;
        background-position: bottom;
        text-align: bottom;
    }
 
    .titleMenu {
        display: inline-block;
        font-size: 35px;
        color: #4a4a4a;
    }
 
    .blockMenu {
        cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
        padding: 15px;
        position: absolute;
        display: none;
        width: 750px;
        border-radius: 25px;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08), 0 2px 10px 0 rgba(0, 0, 0, 0.06);
        height: 565px;
        background: rgba(191, 191, 191, 0.86);
        top: 9.8vh;
        transition: all 1s;
        left: 26.7vw;
    }
 
    .checkbox-green {
        display: inline-block;
        height: 32px;
        line-height: 28px;
        margin-left: 5px;
        position: relative;
        border-radius: 20px;
        vertical-align: middle;
        font-size: 14px;
        user-select: none;
    }
 
    .checkbox-green .checkbox-green-switch {
        display: inline-block;
        height: 28px;
        width: 90px;
        box-sizing: border-box;
        position: relative;
        border-radius: 20px;
        background: #f76a6a;
        transition: background-color 1s cubic-bezier(0, 1, 0.5, 1);
    }
    #gameName {
    text-shadow: none;
    margin: 0;
    }
    .checkbox-green .checkbox-green-switch:before {
        content: attr(data-label-on);
        display: inline-block;
        box-sizing: border-box;
        width: 45px;
        padding: 0 12px;
        position: absolute;
        top: 0;
        left: 45px;
        text-transform: uppercase;
        text-align: center;
        color: rgba(255, 255, 255, 0.5);
        font-size: 15px;
        line-height: 28px;
    }
 
    .checkbox-green .checkbox-green-switch:after {
        content: attr(data-label-off);
        display: inline-block;
        width: 47px;
        border-radius: 20px;
        position: absolute;
        top: -4px;
        left: -1px;
        z-index: 5;
        text-transform: uppercase;
        text-align: center;
        background: white;
        border: 2px solid #f76a6a;
        line-height: 32px;
        font-size: 15px;
        color: #f76a6a;
        transition: transform 1s cubic-bezier(0, 1, 0.5, 1);
    }
 
    .checkbox-green input[type="checkbox"] {
        display: block;
        width: 0;
        height: 0;
        position: absolute;
        z-index: -1;
        opacity: 0;
    }
 
    .checkbox-green input[type="checkbox"]:checked+.checkbox-green-switch {
        background-color: #70c767;
    }
 
    .checkbox-green input[type="checkbox"]:checked+.checkbox-green-switch:before {
        content: attr(data-label-off);
        left: 0;
    }
 
    .checkbox-green input[type="checkbox"]:checked+.checkbox-green-switch:after {
        content: attr(data-label-on);
        color: #4fb743;
        border: 2px solid #4fb743;
        transform: translate3d(44px, 0, 0);
    }
 
    .checkbox-green input[type="checkbox"]:not(:disabled)+.checkbox-green-switch:hover {
        cursor: url(https://media.discordapp.net/attachments/888409659743010867/889978058591842304/hand-cursor_1.png), default;
    }
 
    input[type=color] {
    cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
    }
    input[type=range] {
        vertical-align: middle;
        user-select: none;
        box-sizing: border-box;
        -webkit-appearance: none;
        margin: 10px 0;
    }
 
    input[type=range]:focus {
        outline: 0;
    }
 
    input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height: 5px;
        cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
        animate: 0.5s;
        box-shadow: 0px 0px 2.5px #000000;
        background: #212121;
        border-radius: 1px;
        border: 1px solid #000000;
    }
    input[type=range]::-webkit-slider-thumb {
        box-shadow: 0px 0px 2.5px #000000;
        border: 1px solid #212121;
        height: 18px;
        width: 18px;
        border-radius: 25px;
        background: #4A4A4A;
        cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
        -webkit-appearance: none;
        margin-top: -7px;
    }
 
    input[type=range]:focus::-webkit-slider-runnable-track {
        background: #212121;
    }
 
    input[type=range]::-moz-range-track {
        width: 100%;
        height: 5px;
        cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
        animate: 0.2s;
        box-shadow: 0px 0px 0px #000000;
        background: #212121;
        border-radius: 1px;
        border: 0px solid #000000;
    }
 
    input[type=range]::-moz-range-thumb {
        box-shadow: 0px 0px 0px #000000;
        border: 1px solid #212121;
        height: 18px;
        width: 18px;
        border-radius: 25px;
        background: #4A4A4A;
        cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
    }
    input[type=range]::-ms-track {
        width: 100%;
        height: 5px;
        cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
        animate: 0.2s;
        background: transparent;
        border-color: transparent;
        color: transparent;
    }
 
    input[type=range]::-ms-fill-lower {
        background: #212121;
        border: 0px solid #000000;
        border-radius: 2px;
        box-shadow: 0px 0px 0px #000000;
    }
 
    input[type=range]::-ms-fill-upper {
        background: #212121;
        border: 0px solid #000000;
        border-radius: 2px;
        box-shadow: 0px 0px 0px #000000;
    }
 
    input[type=range]::-ms-thumb {
        margin-top: 1px;
        box-shadow: 0px 0px 0px #000000;
        border: 1px solid #212121;
        height: 18px;
        width: 18px;
        border-radius: 25px;
        background: #4A4A4A;
        cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
    }
 
    input[type=range]:focus::-ms-fill-lower {
        background: #212121;
    }
 
    input[type=range]:focus::-ms-fill-upper {
        background: #212121;
    }
 
    .progressBar {
        transition: 1s all;
        border-radius: 1px;
        height: 40px;
        width: 500px;
    }
 
    progress {
        box-shadow: 5px 6px 20px rgba(135, 135, 135, 0.75);
    }
</style>
<script>
function SupressInput($event) {
   $event.preventDefault();
}
const getElementA = document.querySelectorAll('a[href^="#"]');
for (let smoothA of getElementA) {
    smoothA.addEventListener('click', function (e) {
        e.preventDefault();
        const id = smoothA.getAttribute('href');
        document.querySelector(id).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
};
    let use = false
    let codeKey
    let use2 = false
    let codeKey2
    let use3 = false
    let codeKey3
    let use4 = false
    let codeKey4
    let use5 = false
    let codeKey5
    let use6 = false
    let codeKey6
    let use7 = false
    let codeKey7
    document.getElementById("BindEmp").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#BindEmp").val("Select")
            use = true
        }
        if (e.button == 2) {
            $("#BindEmp").val("...")
            use = false
        }
    })
    document.getElementById("BindEmp").addEventListener('keydown', e => {
        if ($("#BindEmp").focus()) {
            if (use) {
                use = false
                codeKey = (e.code).toString()
                $("#BindEmp").val(codeKey)
            }
        }
    })
    document.getElementById("BindBull").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#BindBull").val("Select")
            use2 = true
        }
        if (e.button == 2) {
            $("#BindBull").val("...")
            use2 = false
        }
    })
    document.getElementById("BindBull").addEventListener('keydown', e => {
        if ($("#BindBull").focus()) {
            if (use2) {
                use2 = false
                codeKey2 = (e.code).toString()
                $("#BindBull").val(codeKey2)
            }
        }
    })
    document.getElementById("KeyOpenGuiMenu").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#KeyOpenGuiMenu").val("Select")
            use3 = true
        }
        if (e.button == 2) {
            $("#KeyOpenGuiMenu").val("...")
            use3 = false
        }
    })
    document.getElementById("KeyOpenGuiMenu").addEventListener('keydown', e => {
        if ($("#KeyOpenGuiMenu").focus()) {
            if (use3) {
                use3 = false
                codeKey3 = (e.code).toString()
                $("#KeyOpenGuiMenu").val(codeKey3)
            }
        }
    })
    document.getElementById("BindSamurai").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#BindSamurai").val("Select")
            use4 = true
        }
        if (e.button == 2) {
            $("#BindSamurai").val("...")
            use4 = false
        }
    })
    document.getElementById("BindSamurai").addEventListener('keydown', e => {
        if ($("#BindSamurai").focus()) {
            if (use4) {
                use4 = false
                codeKey4 = (e.code).toString()
                $("#BindSamurai").val(codeKey4)
            }
        }
    })
    document.getElementById("BindAntiInsta").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#BindAntiInsta").val("Select")
            use5 = true
        }
        if (e.button == 2) {
            $("#BindAntiInsta").val("...")
            use5 = false
        }
    })
    document.getElementById("BindAntiInsta").addEventListener('keydown', e => {
        if ($("#BindAntiInsta").focus()) {
            if (use5) {
                use5 = false
                codeKey5 = (e.code).toString()
                $("#BindAntiInsta").val(codeKey5)
            }
        }
    })
    document.getElementById("hit360").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#hit360").val("Select")
            use6 = true
        }
        if (e.button == 2) {
            $("#hit360").val("...")
            use6 = false
        }
    })
    document.getElementById("hit360").addEventListener('keydown', e => {
        if ($("#hit360").focus()) {
            if (use6) {
                use6 = false
                codeKey6 = (e.code).toString()
                $("#hit360").val(codeKey6)
            }
        }
    })
    document.getElementById("BindAntiTrap").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#BindAntiTrap").val("Select")
            use7 = true
        }
        if (e.button == 2) {
            $("#BindAntiTrap").val("...")
            use7 = false
        }
    })
    document.getElementById("BindAntiTrap").addEventListener('keydown', e => {
        if ($("#BindAntiTrap").focus()) {
            if (use7) {
                use7 = false
                codeKey6 = (e.code).toString()
                $("#BindAntiTrap").val(codeKey7)
            }
        }
    })
    jQuery(function() {
        if (localStorage.input) {
            var checks = JSON.parse(localStorage.input);
            jQuery('#HudVisible, #BetterHotBarVisible, #KillChatVisible, #360°HitVisible, #MeleeBotVisible, #MouseClickVisible, AutoAntiBullVisible, #SendMsgVisible, #SpamChatVisible, #HealSoldierVisible, #SpamClanVisible, #AutoFarmTypeVisible, #AutoFarmVisible, #AutoWalkVisible, #FollowAnimalsVisible, #AntiTrapVisible, #OneTickInstAutoReloadVisibleaVisible, #AutoReloadVisible, #AutoAimVisible, #AntiInstaVisible, #AutoHealVisible, #AutoCoordWalkVisible, #AFKModeVisible').prop('checked', function(i) {
                return checks[i];
            });
        }
    });
    jQuery('#HudVisible, #BetterHotBarVisible, #KillChatVisible, #360°HitVisible, #MeleeBotVisible, #MouseClickVisible, AutoAntiBullVisible, #SendMsgVisible, #SpamChatVisible, #HealSoldierVisible, #SpamClanVisible, #AutoFarmTypeVisible, #AutoFarmVisible, #AutoWalkVisible, #FollowAnimalsVisible, #AntiTrapVisible, #OneTickInstAutoReloadVisibleaVisible, #AutoReloadVisible, #AutoAimVisible, #AntiInstaVisible, #AutoHealVisible, #AutoCoordWalkVisible, #AFKModeVisible').on('change', function() {
        localStorage.input = JSON.stringify(jQuery('#HudVisible, #BetterHotBarVisible, #KillChatVisible, #360°HitVisible, #MeleeBotVisible, #MouseClickVisible, AutoAntiBullVisible, #SendMsgVisible, #SpamChatVisible, #HealSoldierVisible, #SpamClanVisible, #AutoFarmTypeVisible, #AutoFarmVisible, #AutoWalkVisible, #FollowAnimalsVisible, #AntiTrapVisible, #OneTickInstAutoReloadVisibleaVisible, #AutoReloadVisible, #AutoAimVisible, #AntiInstaVisible, #AutoHealVisible, #AutoCoordWalkVisible, #AFKModeVisible').map(function() {
            return this.checked;
        }).get());
    });
</script>
<div id="StopWalkBtn">Stop walking</div>
`
$("body").append(GameMenu)
let HudMenu = `
<div id="HudBlock">
    <HudText1>AutoHeal<br></HudText1>
    <HudText12>HealSoldier<br></HudText12>
    <HudText2>AntiInsta<br></HudText2>
    <HudText3>AutoAim<br></HudText3>
    <HudText4>AutoReload<br></HudText4>
    <HudText5>OneTickInsta<br></HudText5>
    <HudText6>AntiTrap<br></HudText6>
    <HudText7>FollowAnimals<br></HudText7>
    <HudText8>MouseWalk<br></HudText8>
    <HudText24>CoordWalk<br></HudText24>
    <HudText23>AFKMode<br></HudText23>
    <HudText9>AutoFarm<br></HudText9>
    <HudText10>AutoFarmType<br></HudText10>
    <HudText11>SpamClan<br></HudText11>
    <HudText13>SpamChat<br></HudText13>
    <HudText14>SendMsg<br></HudText14>
    <HudText15>AutoAntiBull<br></HudText15>
    <HudText16>MouseClick<br></HudText16>
    <HudText17>MeleeBot<br></HudText17>
    <HudText18>360°Hit<br></HudText18>
    <HudText19>AutoRespawn<br></HudText19>
    <HudText20>KillChat<br></HudText20>
    <HudText21>BetterHotBar<br></HudText21>
    <HudText22>Hud</HudText22>
</div>
<style>
    HudText1,
    HudText2,
    HudText3,
    HudText4,
    HudText5,
    HudText6,
    HudText7,
    HudText8,
    HudText9,
    HudText10,
    HudText11,
    HudText12,
    HudText13,
    HudText14,
    HudText15,
    HudText16,
    HudText17,
    HudText18,
    HudText19,
    HudText20,
    HudText21,
    HudText22,
    HudText23,
    HudText24,
    HudText25 {
        font-size: 18px;
    }
 
    #HudBlock {
        color: #fff;
        position: absolute;
        left: 0px;
        top: 0px;
        background: rgba(0, 0, 0, 0);
        width: auto;
        height: auto;
        transition: 1s all;
    }
</style>
`
 
// Info menu...
const HTML = `
<div class="TimeDate"></div>
<div class="Fps">FPS: Loading...</div>
<div id="Coord">Loading...</div>
<div id="ItemCount">Undefined...</div>
<style>
    #ItemCount {
        position: absolute;
        color: #fff;
        font-size: 20px;
        top: 150px;
        left: 20px;
        background: rgba(0, 0, 0, 0.25);
        width: 200px;
        height: 30px;
        border-radius: 4px;
        padding-left: 5px;
        padding-top: 7px;
        text-align: center;
    }
    #StopWalkBtn {
    cursor: url(https://cdn.discordapp.com/attachments/1005595629436809348/1051564315162984498/Screenshot_2022-12-11_11.20.18_AM.png), default;
    display: none;
    position: absolute;
    top: 10vh;
    left: 44%;
    width: auto;
    height: auto;
    background: #4a4a4a;
    border: 1px solid black;
    border-radius: 15px;
    color: white;
    font-size: 30px;
    padding: 5px;
    }
    #itemInfoHolder {
    top: 190px !important;
    }
    #Coord {
        position: absolute;
        color: #fff;
        font-size: 20px;
        top: 70px;
        left: 20px;
        background: rgba(0, 0, 0, 0.25);
        width: 200px;
        height: 30px;
        border-radius: 4px;
        padding-left: 5px;
        padding-top: 7px;
        text-align: center;
    }
 
    .TimeDate {
        position: absolute;
        color: #fff;
        font-size: 20px;
        top: 110px;
        left: 20px;
        background: rgba(0, 0, 0, 0.25);
        width: 85px;
        height: 30px;
        border-radius: 4px;
        padding-top: 7px;
        text-align: center;
    }
 
    .Fps {
        position: absolute;
        color: #fff;
        font-size: 20px;
        top: 110px;
        left: 110px;
        background: rgba(0, 0, 0, 0.25);
        width: 85px;
        height: 30px;
        border-radius: 4px;
        padding-top: 7px;
        text-align: center;
    }
</style>
<script>
    let getTime = document.querySelector('.TimeDate');
    let getFps = document.querySelector('.Fps');
 
    function getTimeDate() {
        return new Date().toTimeString().replace(/ .*/, '');
    }
    setInterval(() => getTime.textContent = getTimeDate(), 1000);
    const UPDATE_DELAY = 700;
    let lastUpdate = 0;
    let frames = 0;
 
    function updateFPS() {
        let now = Date.now();
        let elapsed = now - lastUpdate;
        if (elapsed < UPDATE_DELAY) {
            ++frames;
        } else {
            let fps = Math.round(frames / (elapsed / 1000));
            getFps.textContent = "FPS: " + fps;
            frames = 0;
            lastUpdate = now;
        }
        requestAnimationFrame(updateFPS);
    }
    lastUpdate = Date.now();
    requestAnimationFrame(updateFPS);
</script>
`
 
// Save message menu...
let chatBox = `
 <div class="ChatBox">
 <span id="textChat"></span>
 <div>
 <style>
 #textChat {
  color: #ffffff;
  font-size: 18px;
  text-align: left;
 }
 .ChatBox {
 overflow-y: scroll;
 ocerflow-x: hidden;
 position: absolute;
 top: 20vh;
 left: 39%;
 background: rgba(0, 0, 0, 0);
 width: 335px;
 height: 325px;
 display: none;
 }
 .ChatBox::-webkit-scrollbar {
        width: 0px;
        height: 0px;
        background: none;
 }
 </style>
 `
 
// Add new html...
$("#mainMenu").append(editMainMenu)
$("#gameUI").append(HudMenu)
$("body").append(chatBox)
$("#gameUI").append(HTML)
 
// Show hud visible...
setInterval(() => {
    document.getElementById("Hud").checked && document.getElementById("HudVisible").checked ? $("HudText22").css("display", "block") : $("HudText22").css("display", "none")
    document.getElementById("BetterHotBar").checked && document.getElementById("BetterHotBarVisible").checked ? $("HudText21").css("display", "block") : $("HudText21").css("display", "none")
    document.getElementById("killChat").checked && document.getElementById("KillChatVisible").checked ? $("HudText20").css("display", "block") : $("HudText20").css("display", "none")
    document.getElementById("AutoRespawn").checked && document.getElementById("AutoRespawnVisible").checked ? $("HudText19").css("display", "block") : $("HudText19").css("display", "none")
    document.getElementById("angleGlitch").checked && document.getElementById("360°HitVisible").checked ? $("HudText18").css("display", "block") : $("HudText18").css("display", "none")
    document.getElementById("Auto1v1OnlyMeleeBot").checked && document.getElementById("MeleeBotVisible").checked ? $("HudText17").css("display", "block") : $("HudText17").css("display", "none")
    document.getElementById("mouseClick").checked && document.getElementById("MouseClickVisible").checked ? $("HudText16").css("display", "block") : $("HudText16").css("display", "none")
    document.getElementById("AutoAntiBull").checked && document.getElementById("AutoAntiBullVisible").checked ? $("HudText15").css("display", "block") : $("HudText15").css("display", "none")
    document.getElementById("helloMode").checked && document.getElementById("SendMsgVisible").checked ? $("HudText14").css("display", "block") : $("HudText14").css("display", "none")
    document.getElementById("SpamChat").checked && document.getElementById("SpamChatVisible").checked ? $("HudText13").css("display", "block") : $("HudText13").css("display", "none")
    document.getElementById("SoldierForAutoHeal").checked && document.getElementById("HealSoldierVisible").checked ? $("HudText12").css("display", "block") : $("HudText12").css("display", "none")
    document.getElementById("SpamClan").checked && document.getElementById("SpamClanVisible").checked ? $("HudText11").css("display", "block") : $("HudText11").css("display", "none")
    document.getElementById("AutoFarmType").checked && document.getElementById("AutoFarmTypeVisible").checked ? $("HudText10").css("display", "block") : $("HudText10").css("display", "none")
    document.getElementById("AutoFarm").checked && document.getElementById("AutoFarmVisible").checked ? $("HudText9").css("display", "block") : $("HudText9").css("display", "none")
    document.getElementById("AutoWalk").checked && document.getElementById("AutoWalkVisible").checked ? $("HudText8").css("display", "block") : $("HudText8").css("display", "none")
    document.getElementById("FollowAnimals").checked && document.getElementById("FollowAnimalsVisible").checked ? $("HudText7").css("display", "block") : $("HudText7").css("display", "none")
    document.getElementById("AntiTrap").checked && document.getElementById("AntiTrapVisible").checked ? $("HudText6").css("display", "block") : $("HudText6").css("display", "none")
    document.getElementById("oneTickInsta").checked && document.getElementById("OneTickInstaVisible").checked ? $("HudText5").css("display", "block") : $("HudText5").css("display", "none")
    document.getElementById("AutoReloadInstaKill").checked && document.getElementById("AutoReloadVisible").checked ? $("HudText4").css("display", "block") : $("HudText4").css("display", "none")
    document.getElementById("Aim").checked && document.getElementById("AutoAimVisible").checked ? $("HudText3").css("display", "block") : $("HudText3").css("display", "none")
    document.getElementById("AntiInsta").checked && document.getElementById("AntiInstaVisible").checked ? $("HudText2").css("display", "block") : $("HudText2").css("display", "none")
    document.getElementById("AutoHeal").checked && document.getElementById("AutoHealVisible").checked ? $("HudText1").css("display", "block") : $("HudText1").css("display", "none")
    document.getElementById("AFKMode").checked && document.getElementById("AFKModeVisible").checked ? $("HudText23").css("display", "block") : $("HudText23").css("display", "none")
    document.getElementById("AutoCoordWalk").checked && document.getElementById("AutoCoordWalkVisible").checked ? $("HudText24").css("display", "block") : $("HudText24").css("display", "none")
}, 150)
 
// Shadow hud text..
setInterval(() => {
    if (document.getElementById("HudShadow").checked) {
        $("#HudBlock").css("text-shadow", `0px 0px 5px ${$("#ColorText3").val()}`)
    } else {
        $("#HudBlock").css("text-shadow", "none")
    }
 
    // Show hud...
    if (document.getElementById("Hud").checked) {
        $("#HudBlock").css("display", "block")
        $("#IfHudOn").css("display", "block")
    } else {
        $("#HudBlock").css("display", "none")
        $("#IfHudOn").css("display", "none")
    }
}, 250)
 
// Show afk options..
setInterval(() => {
    if (document.getElementById("AFKMode").checked) {
        $("#VisibleBR").css("display", "block")
        $("#AfkVisible").css("display", "block")
        $("#PlaceVisible").css("display", "block")
    } else {
        $("#VisibleBR").css("display", "none")
        $("#PlaceVisible").css("display", "none")
        $("#AfkVisible").css("display", "none")
    }
}, 250)
 
// Hud text size...
document.getElementById("HudTextSize").oninput = function() {
    $("HudText1, HudText2, HudText3, HudText4, HudText5, HudText6, HudText7, HudText8, HudText9, HudText10, HudText11, HudText12, HudText13, HudText14, HudText15, HudText16, HudText17, HudText18, HudText19, HudText20, HudText21, HudText22, HudText23, HudText24").css("font-size", `${this.value}px`)
    document.getElementById("myMult2").innerHTML = this.value;
}
document.getElementById("AntiInstaMultiplier").oninput = function() {
    mult1 = this.value;
    document.getElementById("myMult").innerHTML = this.value;
}
 
// Edit moomoomod menu text color...
setInterval(() => {
    $("legend").css("color", $("#ColorText").val())
    $("MiniSettingText").css("color", $("#ColorText").val())
    $("SettingText").css("color", $("#ColorText").val())
    $("#HudBlock").css("color", $("#ColorText2").val())
}, 250)
 
// Default color...
$("#DefColorText").click(function() {
    $("#ColorText").val("#4A4A4A")
})
 
// Default color...
$("#DefColorText2").click(function() {
    $("#ColorText2").val("#ffffff")
})
 
// Default color...
$("#DefColorText3").click(function() {
    $("#ColorText3").val("#FF0000")
})
 
// Default color...
$("#DefColorText4").click(function() {
    $("#HudTextSize").val("18")
    $("HudText1, HudText2, HudText3, HudText4, HudText5, HudText6, HudText7, HudText8, HudText9, HudText10, HudText11, HudText12, HudText13, HudText14, HudText15, HudText16, HudText17, HudText18, HudText19, HudText20, HudText21, HudText22").css("font-size", `18px`)
    document.getElementById("myMult2").innerHTML = "18"
})
 
// Stop walk...
$("#StopWalkBtn").click(function() {
    document.getElementById("AutoCoordWalk").checked = false
    send.Packet("33", null)
    $("#StopWalkBtn").css("display", "none")
})
 
/* Number variables */
 
let numRiverPad = 450,
    speedRanbowSkin = 250,
    mult1 = 2,
    speedAntiInsta = 105,
    speedMill = 150,
    counter = 0,
    health = 65
 
/* Function variable */
 
let randomInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
 
let sleep = ms => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
}
 
/* Object variable */
 
let Global = {
    deathFade: window.config.deathFadeout,
    newSkinColors: (window.config.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373"]),
    riverPad: (window.config.riverPadding = Number(numRiverPad))
}
 
let {
    primary,
    secondary,
    foodType,
    wallType,
    spikeType,
    millType,
    mineType,
    boostType,
    turretType,
    spawnpadType,
    baitType
} = {
    primary: null,
    secondary: null,
    foodType: null,
    wallType: null,
    spikeType: null,
    millType: null,
    mineType: null,
    boostType: null,
    turretType: null,
    spawnpadType: null,
    baitType: null
}
 
let agar = [{
    nsa1: (((10 * 1000000) / 100) * 100)
}, {
    ac: 0
}, {
    se: (eca, ead, facr) => {
        for (let ead = 0; ead < facr; ead++) wS.oldSend(eca)
    }
}, {
    nsa2: (3.5 * 2)
}]
 
let {
    enemiesNear,
    nearEnemy,
    isEnemyNear,
    nearEnemyAngle
} = {
    enemiesNear: null,
    nearEnemy: null,
    IsEnemyNear: null,
    nearEnemyAngle: null
}
 
let {
    myID,
    myX,
    myY,
    myDir,
    ObjectB,
    Weapon,
    Variant,
    Clan,
    IsLeader,
    Hat,
    Acc,
    IsSkull,
    Health,
    aim,
    trap
} = {
    myID: null,
    myX: null,
    myY: null,
    myDir: null,
    ObjectB: null,
    Weapon: null,
    Variant: null,
    Clan: null,
    IsLeader: null,
    Hat: null,
    Acc: null,
    IsSkull: null,
    Health: 100,
    aim: null,
    trap: null
}
 
let ma = {
    last: Date.now(),
    meaning: 0,
    date: Date.now()
}
 
let ma2 = {
    last: Date.now(),
    meaning: 0,
    date: Date.now()
}
 
let ka2 = {
    tgl: false,
    fix: 65,
    delay: null,
    last: Date.now(),
    meaning: 0,
    speed: 58,
    type: 1
}
 
let ka3 = {
    tgl: false,
    fix: 65,
    last: Date.now()
}
 
let ka = {
    tgl: false,
    fix: 100,
    delay: null,
    last: Date.now(),
    meaning: 0,
    speed: 75,
    type: 1
}
 
let autowalk = [{
    ch: "WalkMode coords.",
    x: null,
    y: null
}]
 
let {
    CheckAB,
    step,
    AutoAntiBull
} = {
    CheckAB: false,
    step: false,
    AutoAntiBull: false
}
 
let player = {
    wood: 100,
    stone: 100,
    food: 100,
    points: 100
}
 
let autobreak = {
    angle: null,
    toggle: true,
    id: null
}
 
/* Date variables */
 
let autoWalk = Date.now(),
    lastTrapped = Date.now(),
    date = Date.now(),
    date2 = Date.now(),
    date3 = Date.now(),
    old3 = Date.now(),
    old = Date.now(),
    darads = Date.now()
 
/* Boolean variables */
 
let tgl2 = false,
    check1 = false,
    enemyAim = false,
    angleGlitch = false,
    OneTickAim = false,
    AutoHeal = true,
    AntiInsta = true,
    SoldierForAutoHeal = false,
    AutoRespawn = false,
    mouseClick = false,
    AntiTrap = false,
    Aim = false,
    AutoReloadInstaKill = false,
    angleGlitch2 = false,
    oneTickInsta = false,
    checkOneTick = false,
    check = false,
    end = false,
    AutoMill = false,
    AutoBaitMill = false,
    tgl = false,
    healAnti = false,
    melee = false
 
/* Array variables */
 
let getName = [],
    foods = [],
    trees = [],
    stones = [],
    mines = [],
    nearestTree = [],
    nearestFood = [],
    nearestStone = [],
    nearestMine = [],
    An = [
        [],
        [], false
    ],
    En = [
        [],
        [], false
    ]
 
/* DOM variables */
 
let Coord = document.getElementById("Coord"),
    $el_id = document.activeElement.id.toLowerCase(),
    $el_chat = document.getElementById("#chatHolder"),
    ANTIINSTA = document.getElementById("AntiInsta"),
    MAINANTIINSTA = document.getElementById("MainAntiInsta"),
    a1 = document.getElementById("StackInsta"),
    b121 = document.getElementById("SpikeInsta"),
    b1 = document.getElementById("oneTickInsta"),
    ANTIINSTAOLD = document.getElementById("AntiInstaOld"),
    SOLDFORAH = document.getElementById("SoldierForAutoHeal"),
    KILLCHAT = document.getElementById("killChat"),
    AUTORESPAWN = document.getElementById("AutoRespawn"),
    AUTOANTIBULL = document.getElementById("AutoAntiBull"),
    AUTOCOORDWALK = document.getElementById("AutoCoordWalk"),
    ANGLEGLITCH = document.getElementById("angleGlitch"),
    MOUSECLICK = document.getElementById("mouseClick"),
    ANTITRAP = document.getElementById("AntiTrap"),
    AIM = document.getElementById("Aim"),
    AUTORELOADINSTAKILL = document.getElementById("AutoReloadInstaKill"),
    ONETICKINSTA = document.getElementById("oneTickInsta"),
    BETTERHOTBAR = document.getElementById("BetterHotBar"),
    $el_lT = document.getElementById("loadingText")
 
/* Undefined variables */
 
let rainbowSkin,
    allColors,
    takeRandomColor,
    EnemyAim,
    nearestTreeAngle,
    nearestFoodAngle,
    nearestStoneAngle,
    nearestMineAngle,
    w,
    he,
    mX,
    mY,
    wS
 
/* Defined variables */
 
let adr = window.pingTime,
    msgPack = msgpack
document.msgpack = msgpack
 
/* setTimeout */
 
// Identify value...
setTimeout(() => {
    document.getElementById("gofood").value == "go food"
    document.getElementById("gostone").value == "go stone"
    document.getElementById("gotree").value == "go tree"
    document.getElementById("gomine").value == "go mine"
    document.getElementById("Normal").value == "Normal Insta"
    document.getElementById("Smart").value == "Smart Insta"
    document.getElementById("OnlyPolearm").value == "Only Polearm"
    document.getElementById("BackMusket").value == "Back Musket"
    document.getElementById("Start4traps").value == "4 start trap"
    document.getElementById("Start4spikes").value == "4 start spike"
    document.getElementById("Start4mill").value == "4 start mill"
    document.getElementById("End4traps").value == "4 end trap"
    document.getElementById("End4spikes").value == "4 end spike"
    document.getElementById("End4mill").value == "4 end mill"
    document.getElementById("End2spikes2trap").value == "2 end spikes2 trap"
}, 50)
 
// Remove deathFade...
setTimeout(() => {
    Global.deathFade = 0
}, 3500)
 
/* setInterval */
 
// 1v1 bot...
setInterval(() => {
    if (document.getElementById("Auto1v1OnlyMeleeBot").checked) {
        send.Packet("33", nearEnemyAngle)
        melee = true
    }
}, 150)
 
setInterval(() => {
    if (document.getElementById("Auto1v1OnlyMeleeBot").checked && melee) {
        send.EquipAcc(0)
        send.Packet("7", 1)
        send.FullPacket("5", primary, true)
        send.EquipHat(7)
        send.EquipAcc(18)
        setTimeout(() => {
            send.Packet("7", 1)
            send.EquipHat(53)
            send.EquipAcc(19)
        }, 200)
        setTimeout(() => {
            send.EquipHat(6)
            send.EquipAcc(21)
        }, 360)
    }
}, 400)
 
// Spam Chat...
setInterval(() => {
    if (document.getElementById("SpamChat").checked) {
        send.Packet("ch", spam(true))
    }
}, 500)
 
// Afk Mode send message...
setInterval(() => {
    if (document.getElementById("AFKMode").checked) send.Packet("ch", $("#AfkMsg").val())
}, 1000)
 
// Afk Mode place spike...
setInterval(() => {
    if (document.getElementById("AFKMode").checked && document.getElementById("PlaceSpike").checked) {
        send.Place(spikeType, myDir + send.toRad(135))
        send.Place(spikeType, myDir + send.toRad(150))
        send.Place(spikeType, myDir + send.toRad(165))
        send.Place(spikeType, myDir + send.toRad(180))
        send.Place(spikeType, myDir + send.toRad(270))
        send.Place(spikeType, myDir + send.toRad(360))
    }
}, 15)
 
// Auto Break...
setInterval(() => {
    if (trap == true && autobreak.toggle == true && document.getElementById("AntiTrap").checked) {
        autobreak.aim = true
        if (secondary == 10) {
            send.FullPacket(["5", [secondary, true]])
        } else {
            send.FullPacket(["5", [primary, true]])
        }
        send.EquipHat(40)
        send.Packet("c", 1)
        setTimeout(() => {
            send.Packet("c", 0)
            autobreak.aim = false
        }, 90)
    }
}, 163)
 
// Anti Trap aim...
setInterval(() => {
    if (autobreak.aim == true && document.getElementById("AntiTrap").checked) send.Packet("2", autobreak.angle)
}, 25)
 
// Rainbow Skin...
setInterval(() => {
    takeRandomColor = randomInt(0, 13)
    allColors = ["#7be0d8", "#7b9de0", "#ae2929", "#a929ae", "rgba(0, 0, 0, 0)", "#000000", "#ffffff", "#737373", "#13107f", "#207f10", "#e42121", "#ffea05", "#4dff7f", "#650094"]
    rainbowSkin = String(allColors[takeRandomColor])
    Global.newSkinColors = (window.config.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", rainbowSkin])
}, speedRanbowSkin)
 
// Mouse walk...
setInterval(() => {
    if (document.getElementById("AutoWalk").checked) {
        send.Packet('33', Math.atan2(mY - he / 2, mX - w / 2))
    }
}, 25)
 
// Anti Insta...
setInterval(() => {
    if (document.getElementById("AntiInsta").checked && ka2.tgl == true) {
        if (Date.now() - ka2.last >= 70) {
            send.FullPacket(["c", [1, null]])
            send.Place(foodType)
            send.Cycle(mult1, foodType)
            send.FullPacket(["c", [0, null]])
            send.Packet("ch", "FuriousAntiInsta")
            ka2.last = Date.now()
            ka2.tgl = false
        }
    }
}, 0.1)
 
// Auto Heal...
setInterval(() => {
    if (document.getElementById("AutoHeal").checked && ka.tgl == true) {
        if (Date.now() - ka.last >= ka.speed) {
            for (let i = 0; i < (ka.fix / (foodType === 0 ? 23 : 33)); i++) {
                send.Place(foodType, Infinity)
                send.Packet("ch", $("#AutoHealChat").val())
                if (document.getElementById("SoldierForAutoHeal").checked) send.EquipHat(6)
                ka.last = Date.now()
            }
            ka.tgl = false
        }
    }
}, 0.1)
 
// Anti Insta v9 heal...
setInterval(() => {
    if (ka3.tgl == true) {
        if (Date.now() - ka3.last >= speedAntiInsta) {
            for (let i = 0; i < (ka3.fix / (foodType === 0 ? 23 : 33)); i++) {
                send.Place(foodType, Infinity)
                ka.last = Date.now()
            }
            ka3.tgl = false
        }
    }
}, 0.1)
 
// One Tick insta aim...
setInterval(() => {
    if (OneTickAim) send.Packet("2", nearEnemyAngle + send.toRad(180))
}, 25)
 
// Near enemy aim...
setInterval(() => {
    enemyAim == true && (send.Packet("2", nearEnemyAngle), send.Packet("2", nearEnemyAngle), send.Packet("2", nearEnemyAngle))
}, 25)
 
// 360 hit...
setInterval(() => {
    document.getElementById("angleGlitch").checked && (send.Packet("2", 99e14 * 99e14 * 99e14 * 99e14), send.Packet("2", 99e14 * 99e14 * 99e14 * 99e14), send.Packet("2", 99e14 * 99e14 * 99e14 * 99e14))
}, 25)
 
// 360 hit two....
setInterval(() => {
    angleGlitch2 && (send.Packet("2", 99e14 * 99e14 * 99e14 * 99e14), send.Packet("2", 99e14 * 99e14 * 99e14 * 99e14), send.Packet("2", 99e14 * 99e14 * 99e14 * 99e14))
}, 25)
 
// Spam Clan...
setInterval(() => {
    if (document.getElementById("SpamClan").checked) {
        send.Packet("9", null)
        send.Packet("8", spam(false))
    }
    send.Packet("testing", 6)
}, 500)
 
/* WebSocket */
 
WebSocket.prototype.oldSend = WebSocket.prototype.send
WebSocket.prototype.send = function(e) {
    if (!wS) {
        wS = this
        document.wS = this
        this.addEventListener("message", a => HANDLER(a))
    }
    this.oldSend(e)
}
 
function hasEnough() {
    return (
        (!nearestTree || player.wood >= 1000) &&
        (!nearestStone || player.stone >= 1000) &&
        (!nearestFood || player.food >= 1000)
    )
}
 
function hit(e) {
    send.FullPacket(["c", [true, e]])
    send.FullPacket(["c", [null, e]])
}
 
function weapon(e) {
    send.FullPacket(["5", [e, true]])
}
 
function watch(e) {
    send.FullPacket(["2", [e]])
}
 
function take(e) {
    send.FullPacket(["5", [e, null]])
}
 
function walk(e) {
    send.FullPacket(["33", [e]])
}
 
function place(e, t = myDir) {
    take(e)
    hit(t)
    weapon(Weapon)
}
 
 
function onTick(e) {
    if (trees) {
        nearestTree = trees.sort(
            (a, b) =>
            Math.hypot(a[2] - myY, a[1] - myX) -
            Math.hypot(b[2] - myY, b[1] - myX)
        )[0]
        if (nearestTree) {
            nearestTreeAngle = Math.atan2(
                nearestTree[2] - myY,
                nearestTree[1] - myX
            )
        }
    }
    if (foods) {
        nearestFood = foods.sort(
            (a, b) =>
            Math.hypot(a[2] - myY, a[1] - myX) -
            Math.hypot(b[2] - myY, b[1] - myX)
        )[0]
        if (nearestFood) {
            nearestFoodAngle = Math.atan2(
                nearestFood[2] - myY,
                nearestFood[1] - myX
            )
        }
    }
    if (stones) {
        nearestStone = stones.sort(
            (a, b) =>
            Math.hypot(a[2] - myY, a[1] - myX) -
            Math.hypot(b[2] - myY, b[1] - myX)
        )[0]
        if (nearestStone) {
            nearestStoneAngle = Math.atan2(
                nearestStone[2] - myY,
                nearestStone[1] - myX
            )
        }
    }
    if (mines) {
        nearestMine = mines.sort(
            (a, b) =>
            Math.hypot(a[2] - myY, a[1] - myX) -
            Math.hypot(b[2] - myY, b[1] - myX)
        )[0]
        if (nearestMine) {
            nearestMineAngle = Math.atan2(
                nearestMine[2] - myY,
                nearestMine[1] - player.x
            )
        }
    }
    if (document.getElementById("FollowAnimals").checked) {
        if (An[1]) {
            e = Math.atan2(An[1].y - myY, An[1].x - myX);
            walk(e)
            watch(e)
            hit(e)
        }
    }
    if (!hasEnough() && document.getElementById("AutoFarm").checked) {
        send.Packet("ch", "MooMooAutoFarm")
        nearestFood && player.food < $("#NextResource").val() && farm(nearestFoodAngle)
        nearestStone && player.stone < $("#NextResource").val() && farm(nearestStoneAngle)
        nearestTree && player.wood < $("#NextResource").val() && farm(nearestTreeAngle)
    } else if (Date.now() - autoWalk >= 10e3 && document.getElementById("AutoFarm").checked) {
        autoWalk = Date.now()
        walk(Math.PI * 2 * Math.random())
    }
    if (document.getElementById("AutoFarmType").checked) {
        document.getElementById("goRes").value == "go food" && nearestFood && (send.Packet("ch", "MooMooFarmFood"), farm(nearestFoodAngle))
        document.getElementById("goRes").value == "go stone" && nearestStone && (send.Packet("ch", "MooMooFarmStone"), farm(nearestStoneAngle))
        document.getElementById("goRes").value == "go tree" && nearestTree && (send.Packet("ch", "MooMooFarmWood"), farm(nearestTreeAngle))
        document.getElementById("goRes").value == "go mine" && nearestTree && (send.Packet("ch", "MooMooFarmGold"), farm(nearestMineAngle))
    }
};
 
function farm(e) {
    walk(e)
    watch(e)
    hit(e)
}
 
function checkAnimals() {
    An[1] = null
    An[2] = false
    if (!An[0].length) return null
    An[1] = An[0].sort(
        (a, b) =>
        Math.hypot(a.y - myY, a.x - myX) -
        Math.hypot(b.y - myY, b.x - myX)
    )[0]
    An[2] = Math.hypot(An[1].y - myY, An[1].x - myX) <= 300
}
const HANDLER = (e) => {
    let what = [
        "what mod",
        "what mode",
        "what name",
        "name mod",
        "what ur mod",
        "what name mod",
        "what name u mod",
        "what name ur mod",
        "mod what name",
        "name mode",
        "mode name",
        "mod what",
        "mode what",
        "whate mod",
        "whate mode",
        "name cheat",
        "whatmod",
        "modwhat",
        "modname",
        "namemod",
        "mod name"
    ]
    let antiMsg = [
        "gold bot", "wolf is", "use Happy mod", "i am super pro", "super pro", "am super", "warning", "i am su", "i-", "su-_", "pr-", "r_p", "up--", "-er", "-up", "a-",
        "a__s", "-p", "s__r", "--a", "am_", "_ a", "i_a", "m_s", "e_", "-a", "am-", "up-r", "a___u", "i- -m", "i a_", "__u", "r pro", "sup_r", "a_", "p_r", "i_", "_m", "s-_", "i --", "i -m", "p-o", "--_-r", "pr_", "su-e", "r _--", "s_per", "_per", "-up", "-su", "- p", "_u", "is jesus mod", "s---", "--r", "_o", "---_", "==>", "|", "Dmg:", "MooMoo", "legit?"
    ]
    let DetectedPosition = false
    let AntiHitInsta = false
    let PeopleCheck
    let getNameChat = []
    let nameInChat
    let we = document.getElementById("gameCanvas"),
        be = we.getContext("2d"),
        k,
        k2
 
    let DataHP = 100
    let now = Date.now()
    let deCode = msgPack.decode(new Uint8Array(e.data))
    let data
    if (deCode.length > 1) {
        data = [deCode[0], ...deCode[1]]
        data[1] instanceof Array ? data = data : ""
    } else {
        data = deCode
    }
    let item = data[0]
    let checkH
    let h = ("h" == item),
        id = data[1],
        hp = data[2],
        s = (item == "11")
    if (!data) return
    if (item == "io-init") {
        w = we.clientWidth
        he = we.clientHeight
        $(window).resize(function() {
            w = we.clientWidth
            he = we.clientHeight
        })
        we.addEventListener("mousemove", e => {
            mX = e.clientX
            mY = e.clientY
        })
    }
    item == "1" && myID == null ? myID = id : ""
    if (item == "a") {
        if (!data[1] || !data[1].length) {
            return null
        }
        An[0] = []
        for (e = 0; e < data[1].length; e += 7) {
            [2, 3, 4].includes(data[1][e + 1]) &&
                An[0].push({
                x: data[1][e + 2],
                y: data[1][e + 3],
                id: data[1][e + 1]
            })
        }
        checkAnimals()
    }
    if (item == "2") {
        document.getElementById("helloMode").checked && send.Packet("ch", `${data[1][2]}, ${$("#MsgText").val()}`)
        getName[data[1]] = data[1][2]
        nameInChat = data[1][2]
    }
    if (item == "9") {
        if (data[1] == "wood") {
            player.wood = data[2]
        } else if (data[1] == "stone") {
            player.stone = data[2]
        } else if (data[1] == "food") {
            player.food = data[2]
        } else if (data[1] == "points") {
            player.points = data[2]
        }
    }
    if (item == "6") {
        for (let i = 0; i < data[1].length / 8; i++) {
            let j = data[1].slice(8 * i, 8 * i + 8)
            if (j[5] == 0) {
                trees.push(j)
            }
            if (j[5] == 1) {
                foods.push(j)
            }
            if (j[5] == 2) {
                stones.push(j)
            }
            if (j[5] == 3) {
                mines.push(j)
            }
        }
    }
    if (item == "33") {
        enemiesNear = []
        for (let i = 0; i < data[1].length / 13; i++) {
            let j = data[1].slice(13 * i, 13 * i + 13)
            if (j[0] == myID) {
                myX = j[1]
                myY = j[2]
                myDir = j[3]
                ObjectB = j[4]
                Weapon = j[5]
                Variant = j[6]
                Clan = j[7]
                IsLeader = j[8]
                Hat = j[9]
                Acc = j[10]
                IsSkull = j[11]
            } else if (j[7] !== Clan || j[7] == null) {
                enemiesNear.push(j)
                En[0].push(j)
            }
        }
        onTick()
    }
    if (document.getElementById("AutoCoordWalk").checked) {
        send.Packet("ch", autowalk[0].ch)
        autowalk[0].y = $("#WalkY").val()
        autowalk[0].x = $("#WalkX").val()
        send.Packet("33", Math.atan2(Number(autowalk[0].y) - myY, Number(autowalk[0].x) - myX))
        $("#StopWalkBtn").css("display", "block")
    }
    if (item == "6" && document.getElementById("AntiTrap").checked) {
        for (let i = 0; i < data[1].length / 8; i++) {
            let antiTrapArray = data[1].slice(8 * i, 8 * i + 8)
            if (antiTrapArray[6] == 15 && antiTrapArray[7] != myID && Math.sqrt(Math.pow((myY - antiTrapArray[2]), 2) + Math.pow((myX - antiTrapArray[1]), 2)) < 90) {
                autobreak.angle = Math.atan2(antiTrapArray[2] - myY, antiTrapArray[1] - myX)
                for (let i = 0; i < 16; i++) {
                    let angleStartPlace = myDir + send.toRad(i * 22.5)
                    if (document.getElementById("StartPlace").value == "4 start spike") send.Place(spikeType, angleStartPlace)
                    if (document.getElementById("StartPlace").value == "4 start trap") send.Place(boostType, angleStartPlace)
                    if (document.getElementById("StartPlace").value == "4 start mill") send.Place(millType, angleStartPlace)
                }
                send.Packet("ch", $("#AntiTrapChat").val())
                autobreak.id = antiTrapArray[0]
                trap = true
            }
        }
    }
    if (item == "12" && trap == true && autobreak.id == data[1] && document.getElementById("AntiTrap").checked) {
        trap = false
        send.Packet("c", 0)
        for (let i = 0; i < 16; i++) {
            let angleEndPlace = myDir + send.toRad(i * 22.5)
            if (document.getElementById("EndPlace").value == "4 end spike") send.Place(spikeType, angleEndPlace)
            if (document.getElementById("EndPlace").value == "4 end trap") send.Place(boostType, angleEndPlace)
            if (document.getElementById("EndPlace").value == "4 end mill") send.Place(millType, angleEndPlace)
            if (document.getElementById("EndPlace").value == "2 end spikes2 trap") {
                send.Place(boostType, angleEndPlace)
                send.Place(spikeType, angleEndPlace)
            }
        }
    }
    if ($("#chatHolder").css('display') == 'block') {
        $(".ChatBox").css("display", "block")
    } else {
        $(".ChatBox").css("display", "none")
    }
    if ($("#loadingText").css('display') == 'none') {
        $("#gameName").css("display", "block")
        $(".progressBar").val("100")
    }
 
    if (s && document.getElementById("AntiTrap").checked) {
        aim = true
        trap = false
    }
    Date.now() - ma.last > 2000 && ma.meaning > 0 && (ma.last = Date.now(), ma.meaning -= 1)
    Date.now() - ma2.last > 1 && ma2.meaning > 0 && (ma2.last = Date.now(), ma2.meaning -= 3)
    Coord.innerText = `X: ${myX}, Y: ${myY}`
    enemiesNear ? nearEnemy = enemiesNear.sort((a, b) => send.dist(a) - send.dist(b))[0] : ""
    if (!nearEnemy) {
        nearEnemyAngle = myDir
    }
    if (nearEnemy) {
        nearEnemyAngle = Math.atan2(nearEnemy[2] - myY, nearEnemy[1] - myX)
    }
    if (item === 'ch' && id != myID) {
        let chat = data[2]
        for (let i of what) {
            if (chat.toLowerCase().includes(i.toLowerCase())) {
                send.Packet("ch", "Name cheat: FuriousMod Last")
            }
        }
    }
    if (item === 'ch' && id == myID) {
        let msg = data[2]
        if (msg.startsWith(`${$("#PrefixCommands").val()}clear`)) {
            document.getElementById("textChat").innerHTML = ""
        }
        if (msg.startsWith(`${$("#PrefixCommands").val()}join `)) {
            let arg1 = msg.split(" ")
            arg1.shift()
            send.Packet("10", arg1.join(" "))
        }
        if (msg.startsWith(`${$("#PrefixCommands").val()}leave`)) send.Packet("9", null)
        if (msg.startsWith(`${$("#PrefixCommands").val()}create `)) {
            let arg2 = msg.split(" ")
            arg2.shift()
            send.Packet("9", null)
            send.Packet("8", arg2.join(" "))
        }
        if (msg.startsWith(`${$("#PrefixCommands").val()}km`)) {
            send.Packet("6", 3)
            send.Packet("6", 17)
            send.Packet("6", 31)
            send.Packet("6", 23)
            send.Packet("6", 9)
            send.Packet("6", 38)
            send.Packet("6", 4)
            send.Packet("6", 15)
        }
        if (msg.startsWith(`${$("#PrefixCommands").val()}pm`)) {
            send.Packet("6", 5)
            send.Packet("6", 17)
            send.Packet("6", 31)
            send.Packet("6", 23)
            send.Packet("6", 9)
            send.Packet("6", 38)
            send.Packet("6", 28)
            send.Packet("6", 15)
        }
        if (msg.startsWith(`${$("#PrefixCommands").val()}kh`)) {
            send.Packet("6", 3)
            send.Packet("6", 17)
            send.Packet("6", 31)
            send.Packet("6", 23)
            send.Packet("6", 10)
            send.Packet("6", 38)
            send.Packet("6", 4)
            send.Packet("6", 25)
        }
    }
    if (item == 'ch') {
        if (id !== myID) {
            let EnemyChat = data[2]
            for (let e of antiMsg) {
                if (EnemyChat.toLowerCase().includes(e.toLowerCase())) return ""
            }
            document.getElementById("textChat").innerHTML += `<span id="colorTextCheck" style="color: red; font-size: 18px;">Enemy</span>|${EnemyChat} <br>`
        }
        if (id === myID) {
            let myChat = data[2]
            document.getElementById("textChat").innerHTML += `<span style="color: green; font-size: 18px;">You</span>|${myChat} <br>`
        }
    }
    if (h && data[1] == myID) {
        if (ka.fix >= data[2]) {
            ma.date = Date.now()
            ka.meaning = (100 - data[2])
            ka.delay = (Date.now() - ka.last)
            ka.last = Date.now()
            ka.tgl = true
        } else {
            k = (Date.now() - ma.date)
            if (k < 120) {
                ma.meaning++
                ma.meaning > 7 ? ma.meaning = 0 : ""
 
            } else {
                ma.meaning -= 2
                ma.meaning < 3 ? ma.meaning = 0 : ""
            }
            ma.last = Date.now()
        }
        ka.fix = data[2]
    }
    if (h && data[1] == myID) {
        if (ka2.fix <= 65) {
            ka.meaning = (100 - data[2])
            ma2.date = Date.now()
            ka2.last = Date.now()
            ka2.tgl = true
        } else {
            ma2.last = Date.now()
        }
        if (data[2] == 100) {
            ka2.fix = (data[2] - 35)
        }
    }
    if (h && id == myID) {
        if (ka3.fix <= 65) ka3.last = Date.now()
        if (data[2] == 100) ka3.fix = (data[2] - 35)
    }
    /*
     item == "id" // All IDS, Names of players
     item == "pp" // Update Ping
     item == "d" // Full Server
     item == "b" // Bait Im fink
     item == "p" // Wave Of "R" button
     item == "a" // idk
     item == "mm" // idk
     item == "aa" // Moostofa Hit
     item == "sp" // Spawn
     item == "us" // Hats|Acc
     item == "ad" // Clan Deleted
     item == "sa" // Peoples At Clan
     item == "an" // People Joining to my clan
     item == "st" // MyPlayer Creating  Clan
     item == "ac" // Creating  Clan
     item == "ch" // Chat
     item == "h" // Health
     item == "t" // Damage
     item == "1" // Spawn
     item == "2" // When player is near Show Player Info
     item == "4" // ID or SID
     item == "5" // LeaderBoarderData
     item == "6" // Buildings
     item == "7" // Hit
     item == "8" // Moving Buildings
     item == "9" // Materials
     item == "11" // Death
     item == "12" // Breaked Building
     item == "13" // Leaved Peoples
     item == "14" // MyBuildingCount
     item == "15" // AgeXPCount
     item == "16" // AgeCount
     item == "17" // UpgradedItems
     item == "18" // Arrows
     item == "19" // Arrows When it damage
     item == "33" // Players Info
     item == "35" // NEWUPDATE!
     */
    if (item == "14") {
        document.getElementById("ItemCount").textContent = `Build count: ${data[2]}`
    }
    let hitTipe = [{ // Start AntiInsta v9...
        name: "Katana",
        dmg: 40,
        iSBull: 60,
        tgl: false,
        tgl2: false
    }, {
        name: "Polearm",
        dmg: 45,
        iSBull: 68,
        tgl: false,
        tgl2: false
    }, {
        name: "Daggers",
        dmg: 20,
        iSBull: 30,
        tgl: false,
        tgl2: false
    }]
    let new_x = null
    let LastWeaponId = null
    let heal_x = 100
    let result_heal_x = null
    let last_result_heal_x = null
    let P100AntiBull = false
    let useHats_antiInsta = true
    let HealStartNum = (e, a) => {
        if (!!0 === e) heal_x = (hp / Math.PI ** (Math.sin(90)) + 2)
        if (!!0 === a) result_heal_x = (result_heal_x / 2)
    }
    let katana_checkSpam_Bull_Turret = () => {
        if (item == "7" && id != myID) {
            setTimeout(function() {
                if (nearEnemy[5] == 4 && nearEnemy[9] == (7 || 53)) {
                    console.log("KatanaSpam: Detected.")
                    P100AntiBull = true
                }
            }, 222)
        }
    }
    if (P100AntiBull) {
        if (h && id == myID && hp <= hitTipe[0].iSBull) {
            speedAntiInsta = 105
            last_result_heal_x = 3
            send.EquipHat(7)
            setTimeout(function() {
                speedAntiInsta = 105
            }, 1350)
        }
    }
    let DetectedWeapon_x = () => {
        console.log("Detected Weapon.")
        if (nearEnemy[5] == 4 && nearEnemy[9] == 7) hitTipe[0].tgl = true
        else if (nearEnemy[5] == 4) hitTipe[0].tgl2 = true
        if (nearEnemy[5] == 5 && nearEnemy[9] == 7) hitTipe[1].tgl = true
        else if (nearEnemy[5] == 4) hitTipe[1].tgl2 = true
        if (nearEnemy[5] == 7 && nearEnemy[9] == 7) hitTipe[2].tgl = true
        else if (nearEnemy[5] == 4) hitTipe[2].tgl2 = true
        if (hitTipe[0].tgl) new_x = (hp * hitTipe[0].iSBull / Math.PI)
        if (hitTipe[0].tgl2) new_x = (hp * hitTipe[0].dmg / Math.PI)
        if (hitTipe[1].tgl) new_x = (hp * hitTipe[1].iSBull / Math.PI)
        if (hitTipe[1].tgl2) new_x = (hp * hitTipe[1].dmg / Math.PI)
        if (hitTipe[2].tgl) new_x = (hp * hitTipe[2].iSBull / Math.PI)
        if (hitTipe[2].tgl2) new_x = (hp * hitTipe[2].dmg / Math.PI)
    }
    let EnemyPositionDetected_x = (_) => {
        if (nearEnemy) {
            if (nearEnemy[5] == 4) speedAntiInsta = 73
            if (nearEnemy[5] == 5) speedAntiInsta = 82
            let pos1 = Math.sqrt(Math.pow((myY - nearEnemy[2]), 2) + Math.pow((myX - nearEnemy[1]), 2))
            if (pos1 <= _) {
                console.log("The enemy is very close!")
                speedAntiInsta = 105
                if (h && id == myID && Hat !== 45) {
                    if (hp <= 75) {
                        document.getElementById("AutoHeal").checked ? ka.tgl = true : send.Place(foodType)
                    }
                }
            } else {
                if (nearEnemy[5] == 9) console.log("Maybe it BowInsta?")
                if (h && id == myID && Hat !== 45) {
                    if (hp <= 90) {
                        document.getElementById("AutoHeal").checked ? ka.tgl = true : ""
                    }
                }
            }
        }
    }
    if (h && id == myID && document.getElementById("MainAntiInsta").checked && Hat !== 45 && nearEnemy) { // Work only if nearEnemy!
        if (hp <= 65) {
            DetectedWeapon_x()
            EnemyPositionDetected_x(Math.floor(45 * Math.PI))
            HealStartNum(false, true)
            result_heal_x !== (undefined || NaN) ? result_heal_x = heal_x : result_heal_x = null
            last_result_heal_x !== (undefined || NaN) ? last_result_heal_x = result_heal_x : last_result_heal_x = null
            send.Packet("ch", $("#AntiInstaChat").val())
            if (useHats_antiInsta) {
                send.EquipHat(22)
                sleep(250).then(() => {
                    send.EquipHat(7)
                })
                sleep((999 - window.pingTime)).then(() => {
                    send.EquipHat(6)
                })
            }
            sleep(700).then(async function() {
                if (hp <= 65) {
                    console.log(`Health <= 65! Health: ${hp}`)
                    await document.getElementById("AutoHeal").checked ? ka.tgl = true : send.Place(foodType)
                }
                if (hp === 100) {
                    console.log(`Health === 100! Health: ${hp}`)
                }
            })
            sleep(1666).then(async function() {
                P100AntiBull = false
            })
            if (result_heal_x <= 5) {
                result_heal_x = Math.floor((heal_x * Math.E ** Math.random() >>> (Math.random() * 2) + new_x))
            } else {
                HealStartNum(true, false)
                if (result_heal_x <= 5) {
                    result_heal_x = Math.floor((heal_x * Math.E ** Math.random() >>> (Math.random() * 2) + new_x))
                }
            }
            if (Date.now() - date2 > speedAntiInsta) {
                new_x = (new_x + Math.E)
                last_result_heal_x !== (undefined || NaN) ? last_result_heal_x = Number(Math.floor(((result_heal_x >>> Math.random() * 3) * Math.PI) / new_x)) : last_result_heal_x = null
                if (last_result_heal_x > 10) last_result_heal_x = (last_result_heal_x / new_x)
                if (last_result_heal_x < 3) last_result_heal_x = (last_result_heal_x + 2)
                if (last_result_heal_x < 0) last_result_heal_x = 2
                katana_checkSpam_Bull_Turret()
                send.Cycle(last_result_heal_x, foodType)
                ka3.tgl = true
                console.log(`Result: ${last_result_heal_x}`)
                date2 = Date.now()
            }
            setTimeout(() => {
                agar[2].se(agar[0].nsa1, agar[1].ac, agar[3].nsa2) // Make a shipment... To stabilize the work of AntiInsta!
            }, 120 - adr)
        }
    } // End anti insta
 
 
    if (h && id == myID && document.getElementById("AutoAntiBull").checked == true) {
        if (hp <= 60) {
            step = true
            setTimeout(function() {
                if (nearEnemy[5] == 4 && nearEnemy[9] == 7) {
                    setTimeout(function() {
                        if (nearEnemy[5] == 4 && nearEnemy[9] == 7) {
                            if (step) {
                                send.Packet("ch", "AutoAntiBull: On")
                                CheckAB = false
                                ka.type = 0
                                ka.speed = 105
                                if (document.getElementById("AntiInsta").checked == true) document.getElementById("AntiInsta").checked = false
                                send.Packet("7", 1)
                                send.EquipHat(6)
                                send.EquipAcc(13)
                                setTimeout(() => {
                                    send.EquipHat(11)
                                    send.EquipAcc(21)
                                }, 500)
                                setTimeout(() => {
                                    send.EquipHat(6)
                                    send.EquipAcc(13)
                                }, 1000)
                                setTimeout(() => {
                                    send.EquipHat(26)
                                    send.EquipAcc(21)
                                    document.getElementById("AntiInsta").checked = true
                                    ka.type = 1
                                    ka.speed = 75
                                    step = false
                                }, 1500)
                            } else {
                                return ""
                            }
                        } else {
                            CheckAB = true
                            if (CheckAB) {
                                ka.type = 1
                                setTimeout(function() {
                                    CheckAB = false
                                }, 100)
                                step = false
                                send.Packet("ch", "AutoAntiBull: Off")
                            }
                        }
                    }, 1000)
                }
            }, 200)
        }
    }
    if (h && myID == id && document.getElementById("AntiInsta").checked == true && data[2] <= 65) {
        send.EquipHat(22)
        setTimeout(() => {
            send.EquipHat(7)
        }, 250)
        setTimeout(() => {
            send.EquipHat(6)
            end = true
        }, (999 - window.pingTime))
    }
    if (h && myID == id && document.getElementById("AntiInstaOld").checked == true && data[2] <= 65) {
        send.Packet("ch", $("#AntiInstaChat").val())
        send.EquipHat(22)
        setTimeout(() => {
            send.EquipHat(7)
        }, 250)
        setTimeout(() => {
            send.EquipHat(6)
            end = true
        }, (999 - window.pingTime))
        if (Date.now() - date > 72) {
            send.Cycle(2, foodType)
            date = Date.now()
        }
    }
    if (document.getElementById("oneTickType").value == "Back Musket") {
        document.getElementById("oneTickType2").style.opacity = "1"
    } else {
        document.getElementById("oneTickType2").style.opacity = "0"
    }
    send.getId()
    s && document.getElementById("AutoRespawn").checked && send.Spawn(1)
    s && (ma.meaning = 0, ma.date = 0, ma2.meaning = 0, ma2.date = 0)
}
class Fncs {
    FullPacket(e) {
        wS.oldSend(new Uint8Array(Array.from(msgPack.encode(e))))
    }
    Packet(e, a) {
        send.FullPacket([e, [a]])
    }
    Spawn(e) {
        send.FullPacket(['sp', [{
            name: ($("#AutoRespawnName").val() || localStorage.getItem("moo_name")),
            moofoll: "1",
            skin: e
        }]])
    }
    Place(type, angle = Math.atan2(mY - he / 2, mX - w / 2)) {
        send.FullPacket(["5", [type, null]])
        send.FullPacket(["c", [1, angle]])
        send.FullPacket(["c", [0, angle]])
        send.FullPacket(["5", [Weapon, true]])
    }
    Cycle(x, type) {
        for (let i = 0; i < x; i++) send.Place(type, Number.MAX_VALUE)
    }
    EquipAcc(id) {
        send.FullPacket(["13c", [1, id, 1]])
        send.FullPacket(["13c", [0, id, 1]])
    }
    EquipHat(id) {
        send.FullPacket(["13c", [1, id, 0]])
        send.FullPacket(["13c", [0, id, 0]])
    }
    toRad(angle) {
        return angle * 0.01745329251
    }
    dist(a) {
        return Math.sqrt(Math.pow((myY - a[2]), 2) + Math.pow((myX - a[1]), 2))
    }
    eV(e) {
        return e.offsetParent !== null
    }
    getId() {
        for (let i = 0; i < 9; i++)
            if (send.eV(document.getElementById("actionBarItem" + i.toString()))) primary = i
        for (let i = 9; i < 16; i++)
            if (send.eV(document.getElementById("actionBarItem" + i.toString()))) secondary = i
        for (let i = 16; i < 19; i++)
            if (send.eV(document.getElementById("actionBarItem" + i.toString()))) foodType = i - 16
        for (let i = 19; i < 22; i++)
            if (send.eV(document.getElementById("actionBarItem" + i.toString()))) wallType = i - 16
        for (let i = 22; i < 26; i++)
            if (send.eV(document.getElementById("actionBarItem" + i.toString()))) spikeType = i - 16
        for (let i = 26; i < 29; i++)
            if (send.eV(document.getElementById("actionBarItem" + i.toString()))) millType = i - 16
        for (let i = 29; i < 31; i++)
            if (send.eV(document.getElementById("actionBarItem" + i.toString()))) mineType = i - 16
        for (let i = 31; i < 33; i++)
            if (send.eV(document.getElementById("actionBarItem" + i.toString()))) boostType = i - 16
        for (let i = 33; i < 36; i++)
            if (send.eV(document.getElementById("actionBarItem" + i.toString()))) turretType = i - 16
        for (let i = 36; i < 37; i++)
            if (send.eV(document.getElementById("actionBarItem" + i.toString()))) spawnpadType = i - 16
        for (let i = 37; i < 39; i++)
            if (send.eV(document.getElementById("actionBarItem" + i.toString()))) turretType = i - 16
        for (let i = 38; i < 40; i++)
            if (send.eV(document.getElementById("actionBarItem" + i.toString()))) baitType = i - 16
    }
    StackInsta() {
        if (document.getElementById("StackInsta").checked) {
            send.Packet("ch", "MooMooFastInsta")
            let tutu11 = setInterval(send.FullPacket(["5", [primary, true]]), 0);
            let tutu22;
            send.EquipHat(7);
            if (Acc == 11) {
                send.EquipAcc(0);
            }
            send.FullPacket(["5", [primary, true]]);
            send.Packet("2", nearEnemyAngle);
            send.FullPacket(["c", [1, nearEnemyAngle]]);
            setTimeout(() => {
                send.EquipHat(53);
                send.Packet("2", nearEnemyAngle);
                send.FullPacket(["5", [secondary, true]]);
                clearInterval(tutu11);
                tutu22 = setInterval(send.FullPacket(["5", [secondary, true]]), 0);
            }, 88);
            setTimeout(() => {
                clearInterval(tutu22);
                send.FullPacket(["c", [0, null]]);
                send.FullPacket(["5", [primary, true]]);
                send.EquipHat(6)
            }, 220);
        }
    }
    SpikeInsta() {
        if (document.getElementById("SpikeInsta").checked == true && document.getElementById("StackInsta").checked == false && document.getElementById("oneTickInsta").checked == false) {
            if (Acc == 11) send.EquipAcc(0)
            send.Packet("ch", "MooMooSpikeInsta")
            send.FullPacket(["5", [primary, true]])
            send.EquipHat(7);
            send.Packet("2", nearEnemyAngle)
            send.FullPacket(["c", [1]]);
 
            setTimeout(() => {
                send.EquipHat(53);
                send.FullPacket(["5", [secondary, true]])
                setTimeout(() => {
                    send.Place(spikeType)
                }, 25)
                setTimeout(() => {
                    send.EquipHat(6)
                    send.FullPacket(["5", [primary, true]])
                    send.FullPacket(["c", [0, null]]);
                }, 200)
            }, 88)
        }
    }
    InstaKill() {
        if (document.getElementById("oneTickInsta").checked == false && document.getElementById("StackInsta").checked == false && document.getElementById("SpikeInsta").checked == false) {
            if (Acc == 11) send.EquipAcc(0)
            if (document.getElementById("Aim").checked) enemyAim = true
            send.Packet("ch", "MooMooInsta")
            send.Packet("c", 1)
            send.FullPacket(["5", [primary, true]])
            send.EquipHat(7)
            setTimeout(() => {
                send.EquipHat(53)
                send.FullPacket(["5", [secondary, true]])
                setTimeout(() => {
                    send.Packet("c", 0)
                    if (!AutoReloadInstaKill) send.FullPacket(["5", [primary, true]])
                    if (AutoReloadInstaKill) send.FullPacket(["5", [secondary, true]])
                    send.EquipHat(6)
                    if (document.getElementById("Aim").checked) enemyAim = false
 
                }, 200)
            }, $("#InstaSpeed").val())
            if (document.getElementById("AutoReloadInstaKill").checked) {
                setTimeout(() => {
                    send.FullPacket(["5", [secondary, true]])
                }, 1000)
                setTimeout(() => {
                    send.FullPacket(["5", [secondary, true]])
                }, 2000)
                setTimeout(() => {
                    send.FullPacket(["5", [primary, true]])
                }, 3000)
            }
        }
    }
    OneTickInsta() {
        if (document.getElementById("oneTickInsta").checked) {
            if (document.getElementById("oneTickType2").value == "Smart Insta" && nearEnemy[9] == 6) checkOneTick = true
            else checkOneTick = false
            if (Acc == 11) send.EquipAcc(0)
            if (document.getElementById("oneTickType").value == "Back Musket") {
                if (checkOneTick == false) {
                    send.Packet("ch", "MooMooOneTick")
                    send.Packet("c", 1)
                    OneTickAim = true
                    send.FullPacket(["5", [secondary, true]])
                    send.EquipHat(53)
                    setTimeout(() => {
                        OneTickAim = false
                        angleGlitch2 = true
                        send.EquipHat(7)
                        send.FullPacket(["5", [primary, true]])
                    }, 75)
                    setTimeout(() => {
                        angleGlitch2 = false
                        send.Packet("c", 0)
                    }, 140)
                }
                if (document.getElementById("oneTickType2").value == "Smart Insta") {
                    checkOneTick = true
                    if (checkOneTick == true) {
                        if (nearEnemy[9] == 6) {
                            send.Packet("ch", "MooMooInsta")
                            send.Packet("c", 1)
                            send.FullPacket(["5", [primary, true]])
                            send.EquipHat(7)
                            setTimeout(() => {
                                send.EquipHat(53)
                                send.FullPacket(["5", [secondary, true]])
                                setTimeout(() => {
                                    send.Packet("c", 0)
                                    send.FullPacket(["5", [primary, true]])
                                    send.EquipHat(6)
                                    checkOneTick = false
                                }, 200)
                            }, $("#InstaSpeed").val())
                        }
                    }
                }
            }
            if (document.getElementById("oneTickType").value == "Only Polearm") {
                send.Packet("ch", "MooMooOneTick")
                send.Packet("c", 1)
                send.FullPacket(["5", [primary, true]])
                send.EquipHat(7)
                setTimeout(() => {
                    angleGlitch2 = true
                    send.EquipHat(53)
                }, 75)
                setTimeout(() => {
                    angleGlitch2 = false
                    send.Packet("c", 0)
                }, 140)
            }
        }
    }
    KM() {
        setTimeout(() => {
            send.Packet("6", 3)
            send.Packet("6", 17)
            send.Packet("6", 31)
            send.Packet("6", 23)
            send.Packet("6", 9)
            send.Packet("6", 38)
            send.Packet("6", 4)
            send.Packet("6", 15)
        }, 100)
    }
    boostSpike() {
        send.Place(spikeType, myDir + send.toRad(90))
        send.Place(spikeType, myDir - send.toRad(90))
        send.Place(boostType, myDir)
    }
    baitMill(diraim) {
        if ((!old3 || Date.now() - old3) - window.pingTime >= 47) {
            send.Place(baitType, diraim - send.toRad(0))
            send.Place(millType, diraim + send.toRad(73))
            send.Place(millType, diraim - send.toRad(73))
            old = Date.now()
        }
    }
    TripleMills(diraim) {
        if ((!old || Date.now() - old) - window.pingTime >= 47) {
            send.Place(millType, diraim - send.toRad(0))
            send.Place(millType, diraim + send.toRad(73))
            send.Place(millType, diraim - send.toRad(73))
            old = Date.now()
        }
    }
    rpt(k, i, itr) {
        let {
            skeyDown,
            itrvl
        } = {
            skeyDown: 0,
            itrvl: undefined
        }
        return {
            start: function(keycode) {
                if (keycode == k && document.activeElement.id != 'chatBox') {
                    skeyDown = 1
                    if (itrvl == undefined) {
                        itrvl = setInterval(() => {
                            i()
                            !skeyDown && (clearInterval(itrvl), itrvl = undefined)
                        }, itr)
                    }
                }
            },
            stop: function(keycode) {
                keycode == k && document.activeElement.id != 'chatBox' && (skeyDown = 0)
            }
        }
    }
}
 
let send = new Fncs()
const MillType1 = send.rpt(78, () => {
    send.Place(millType, Math.atan2(mY - he / 2, mX - w / 2))
}, 5)
const SpikeType1 = send.rpt(86, () => {
    send.Place(spikeType, Math.atan2(mY - he / 2, mX - w / 2))
}, 5)
const BoostType1 = send.rpt(70, () => {
    send.Place(boostType, Math.atan2(mY - he / 2, mX - w / 2))
}, 5)
const FoodType1 = send.rpt(81, () => {
    send.Place(foodType, Math.atan2(mY - he / 2, mX - w / 2))
}, 5)
const BaitType2 = send.rpt(36, () => {
    for (let i = 0; i < 99999; i++) send.Place(baitType)
    send.Packet("ch", "Bait Crash")
 
})
const BaitType1 = send.rpt(46, () => {
    send.Place(baitType)
    send.Packet("ch", "FuriousMod: Bait")
 
})
const TurretType1 = send.rpt(72, () => {
    send.Place(turretType, Math.atan2(mY - he / 2, mX - w / 2))
}, 5)
const spawnPadsx4 = send.rpt(74, () => {
    for (let i = 0; i < 16; i++) {
        let aP1 = myDir + send.toRad(i * 22.5)
        send.Place(spawnpadType, aP1)
    }
}, 5);
 
document.addEventListener("mousedown", e => {
    if (document.getElementById("mouseClick").checked) {
        if (e.button == 0) {
            send.EquipAcc(0)
            send.Packet("7", 1)
            send.FullPacket(["5", [primary, true]])
            send.EquipHat(7)
            send.EquipAcc(18)
            setTimeout(() => {
                send.Packet("7", 1)
                send.EquipHat(53)
                send.EquipAcc(19)
            }, 200)
            setTimeout(() => {
                send.EquipHat(6)
                send.EquipAcc(21)
            }, 360)
        }
        if (e.button == 2) {
            send.EquipAcc(0)
            send.Packet("7", 1)
            send.FullPacket(["5", [primary, true]])
            send.EquipHat(40)
            send.EquipAcc(19)
            setTimeout(() => {
                send.EquipHat(6)
                send.EquipAcc(21)
                send.Packet("7", 1)
            }, 360)
        }
    }
}, false)
document.addEventListener('keydown', e => {
    if (["allianceinput", 'chatbox'].includes(document.activeElement.id.toLowerCase())) return null
    spawnPadsx4.start(e.keyCode)
    TurretType1.start(e.keyCode)
    MillType1.start(e.keyCode)
    BaitType1.start(e.keyCode)
    SpikeType1.start(e.keyCode)
    BoostType1.start(e.keyCode)
    FoodType1.start(e.keyCode)
    BaitType2.start(e.keyCode)
    if (e.code == $("#BindAntiInsta").val()) {
        if (document.getElementById("MainAntiInsta").checked == false) {
            send.Packet("ch", "MainAntiInsta: On")
            document.getElementById("MainAntiInsta").checked = true
            document.getElementById("AntiInsta").checked = false
            document.getElementById("AntiInstaOld").checked = false
        } else {
            send.Packet("ch", "MainAntiInsta: Off")
            document.getElementById("MainAntiInsta").checked = false
            document.getElementById("AntiInsta").checked = false
            document.getElementById("AntiInstaOld").checked = false
        }
    }
    if (e.code == "KeyP") {
        send.Packet('ch', "Object: " + ObjectB)
    }
    if (e.code == $("#BindAntiTrap").val()) {
        if (document.getElementById("AntiTrap").checked == false) {
            send.Packet("ch", "AntiTrap: On")
            document.getElementById("AntiTrap").checked = true
        } else {
            send.Packet("ch", "AntiTrap: Off")
            document.getElementById("AntiTrap").checked = false
        }
    }
    if (e.code == $("#hit360").val()) {
        if (document.getElementById("angleGlitch").checked == false) {
            send.Packet("ch", "360 hit: On")
            document.getElementById("angleGlitch").checked = true
        } else {
            send.Packet("ch", "360 hit: Off")
            document.getElementById("angleGlitch").checked = false
        }
    }
    e.keyCode == 90 && (send.EquipHat(40), send.EquipAcc(19))
    if (e.keyCode == 16) {
        send.EquipAcc(11)
        if (myY < 2400) send.EquipHat(15)
        else if (myY > 6850 && myY < 7550) send.EquipHat(31)
        else send.EquipHat(12)
    }
    e.code == $("#BindBull").val() && send.EquipHat(7)
    e.code == $("#BindSamurai").val() && send.EquipHat(20)
    e.code == $("#BindEmp").val() && send.EquipHat(22)
    e.keyCode == 82 && (send.InstaKill(), send.OneTickInsta(), send.StackInsta(), send.SpikeInsta())
    e.keyCode == 38 && (send.KM())
    e.keyCode == 77 && (AutoMill == true ? (AutoMill = false, send.Packet("ch", "TripleMills: Off")) : (AutoMill = true, send.Packet("ch", "TripleMills: On")))
    e.keyCode == 71 && (AutoBaitMill == true ? (AutoBaitMill = false, send.Packet("ch", "BaitMills: Off")) : (AutoBaitMill = true, send.Packet("ch", "BaitMills: On")))
    if (AutoMill == true) {
        if (e.keyCode == 87 && e.keyCode == 65) send.TripleMills(0.79)
        else if (e.keyCode == 87 && e.keyCode == 68) send.TripleMills(2.36)
        else if (e.keyCode == 83 && e.keyCode == 65) send.TripleMills(-0.79)
        else if (e.keyCode == 83 && e.keyCode == 68) send.TripleMills(-2.36)
        else if (e.keyCode == 83) send.TripleMills(-1.57)
        else if (e.keyCode == 87) send.TripleMills(1.57)
        else if (e.keyCode == 68) send.TripleMills(3.14)
        else if (e.keyCode == 65) send.TripleMills(0)
    }
    if (AutoBaitMill == true) {
        if (e.keyCode == 87 && e.keyCode == 65) send.baitMill(0.79)
        else if (e.keyCode == 87 && e.keyCode == 68) send.baitMill(2.36)
        else if (e.keyCode == 83 && e.keyCode == 65) send.baitMill(-0.79)
        else if (e.keyCode == 83 && e.keyCode == 68) send.baitMill(-2.36)
        else if (e.keyCode == 83) send.baitMill(-1.57)
        else if (e.keyCode == 87) send.baitMill(1.57)
        else if (e.keyCode == 68) send.baitMill(3.14)
        else if (e.keyCode == 65) send.baitMill(0)
    }
 
})
document.addEventListener('keyup', (e) => {
    spawnPadsx4.stop(e.keyCode)
    TurretType1.stop(e.keyCode)
    MillType1.stop(e.keyCode)
    SpikeType1.stop(e.keyCode)
    BoostType1.stop(e.keyCode)
    FoodType1.stop(e.keyCode)
    BaitType1.stop(e.keyCode)
    BaitType2.stop(e.keyCode)
})
let InbundleMyPlayer
 
 
let killChat = false
let $el_killCounter
let newKill = 0
 
function SendKillChat() {
    $el_killCounter = parseInt(document.getElementById("killCounter").innerText).toString()
    if ($el_killCounter > newKill && document.getElementById("killChat").checked) send.Packet("ch", $("#KillChat").val())
    newKill = $el_killCounter
}
setInterval(SendKillChat, 0)
ANTIINSTA.addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("MainAntiInsta").checked = false
        document.getElementById("AntiInstaOld").checked = false
    }
})
MAINANTIINSTA.addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("AntiInsta").checked = false
        document.getElementById("AntiInstaOld").checked = false
    }
})
 
a1.addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("oneTickInsta").checked = false
        document.getElementById("SpikeInsta").checked = false
    }
})
 
b121.addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("StackInsta").checked = false
        document.getElementById("oneTickInsta").checked = false
    }
})
 
b1.addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("StackInsta").checked = false
        document.getElementById("SpikeInsta").checked = false
    }
})
ANTIINSTAOLD.addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("MainAntiInsta").checked = false
        document.getElementById("AntiInsta").checked = false
    }
})
 
SOLDFORAH.addEventListener('change', function() {
    if (this.checked) SoldierForAutoHeal = true
    else SoldierForAutoHeal = false
})
 
KILLCHAT.addEventListener('change', function() {
    if (this.checked) killChat = true
    else killChat = false
})
 
AUTORESPAWN.addEventListener('change', function() {
    if (this.checked) AutoRespawn = true
    else AutoRespawn = false
})
 
if (AUTOANTIBULL) {
    AUTOANTIBULL.addEventListener('change', function() {
        if (this.checked) AutoAntiBull = true
        else AutoAntiBull = false
    })
}
 
AUTOCOORDWALK.addEventListener('change', () => {
    if (this.checked) {
        $("#StopWalkBtn").css("display", "block")
    } else {
        send.Packet("33", null)
        $("#StopWalkBtn").css("display", "none")
    }
})
ANGLEGLITCH.addEventListener('change', () => {
    if (this.checked) angleGlitch = true
    else angleGlitch = false
})
 
MOUSECLICK.addEventListener('change', () => {
    if (this.checked) mouseClick = true
    else mouseClick = false
})
 
ANTITRAP.addEventListener('change', () => {
    if (this.checked) AntiTrap = true
    else AntiTrap = false
})
AIM.addEventListener('change', () => {
    if (this.checked) Aim = true
    else Aim = false
})
 
 
AUTORELOADINSTAKILL.addEventListener('change', () => {
    if (this.checked) AutoReloadInstaKill = true
    else AutoReloadInstaKill = false
})
ONETICKINSTA.addEventListener('change', () => {
    if (this.checked) oneTickInsta = true
    else oneTickInsta = false
})
BETTERHOTBAR.addEventListener('change', () => {
    if (BETTERHOTBAR.checked) {
        let newStyleHotBar = `
<style>
.actionBarItem {
transition: 1s all;
margin-left: 0;
margin-right: 0;
background-color: rgba(0, 0, 0, 0.65);
border: 2.5px dashed black;
border-radius: 50%;
}
.actionBarItem:hover {
box-shadow: inset 0px 0px 10px black;
}
</style>
`
        $("body").append(newStyleHotBar)
    } else {
        let oldStyleHotBar = `
<style>
.actionBarItem {
transition: 1s all;
margin-left: 5px;
margin-right: 5px;
background-color: rgba(0, 0, 0, 0.25);
border: none;
box-shadow: none;
border-radius:4px;
}
.actionBarItem:hover {
box-shadow: none;
}
</style>
`
        $("body").append(oldStyleHotBar)
    }
})
 
function spam(use) {
    let txt = ["", "~", "/", "$", "&", "^", "-"]
    let rdm = Math.floor(Math.random() * 6)
    let result = ''
    let characters
    let count = 0
    if (use) characters = $("#SpamChatName").val()
    else characters = $("#SpamClanName").val()
    if (use) {
        characters = characters.padStart((70 - characters.length) / 6 + characters.length)
        characters = characters.padEnd(30);
    }
    for (let i = 0; i < characters.length; i++) {
        if (Math.floor(Math.random() * $("#SpamClanName").val().length) == 1) result += txt[rdm]
        else result += characters.charAt(i);
    }
    return result;
}
 
function newDOM() {
    setTimeout(() => {
        $(".progressBar").val("18")
        setTimeout(() => {
            $(".progressBar").val("24")
        }, 100)
    }, 500)
    setTimeout(() => {
        $(".progressBar").val("47")
        setTimeout(() => {
            $(".progressBar").val("50")
        }, 100)
        setTimeout(() => {
            $(".progressBar").val("57")
        }, 350)
    }, 1250)
    setTimeout(() => {
        $(".progressBar").val("76")
        setTimeout(() => {
            $(".progressBar").val("86")
        }, 100)
    }, 2000)
    setTimeout(() => {
        $(".progressBar").val("100")
    }, 2750)
    document.getElementById("storeHolder").style = "height: 450px; width: 400px;"
    document.getElementById("moomooio_728x90_home").style.display = "none"
    document.getElementById("enterGame").innerHTML = "Spawn"
    document.getElementById("gameName").innerHTML = `<div style="text-align: center; color: #b67520; font-size: 100px;">MooMoo<span style="color: #c6c6c6;">Mod</span></div><div style="text-align: center; font-size: 50px; color: #4A4A4A; opacity: 0.6;">The Leading public mod for MooMoo.io</div><div style="text-align: center; font-size: 35px; color: #4A4A4A; opacity: 0.6;">Hello, Furious Mod user!</div>`
    document.querySelector(".menuLink").textContent = "00100110"
    document.getElementById("loadingText").innerHTML = '<progress id="loadingText" value="0" max="100" class="progressBar"></progress><br>Loading...'
    setInterval(() => {
        if ($(".progressBar").val() == "100") {
            document.getElementById("loadingText").innerHTML = '<progress id="loadingText" value="100" max="100" class="progressBar"></progress><br>The loading is complete! Wait!'
        }
    }, 250)
    $("#gameName").css("display", "none")
}
 
const RELOAD = setInterval(() => {
    switch ($el_lT.textContent) {
        case "disconnectedreload":
            document.getElementById("gameName").textContent = "AutoReload: Start!"
            window.onbeforeunload = null
            setTimeout(() => clearInterval(RELOAD), 100)
            window.location.reload()
            break
    }
}, 250)
newDOM()
 
 
 
 
 
 
 
/*
 If you want to copy something, then do it correctly!
 Do not forget that JS knowledge is used here, which is unknown to you (most of it).
 I don't mind you copying my code! But do not forget about honor! After all, I wrote this script!
 Have a nice game!
 */