// ==UserScript==
// @name         fake colors
// @namespace    none
// @version      10.1
// @description  BuildCount, v8-FixBigPing, SaveChat, FastInsta, AutoCoordWalk, AFKMode, R-InstaKill, AutoHeal, AutoAntiBull, AntiInsta, FollowAnimals, AutoFarmResource, M-TripleWASDMills, UpArrow-Katana+Musket, H-Turret, N-Mill, V-spike, F-Trap, Z-TankGear, Shift-BiomeHats, Esc-BetterMenu, AutoAntiBull, MouseClicks, BetterHotBar, OneTickInsta. Please rate this script in the comments! I'm trying really hard! Give me your support!
// @author       Cyka, GreasyFork: https://greasyfork.org/ru/users/759782-00100110
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506243/fake%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/506243/fake%20colors.meta.js
// ==/UserScript==
// Script in greasyfork: https://greasyfork.org/ru/scripts/431370-moomoomod-v6-new-menu-and-more

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
cursor: url(https://media.discordapp.net/attachments/888409659743010867/889978058591842304/hand-cursor_1.png), default;
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

// MooMooMod menu...
let GameMenu = `
<div class="blockMenu" style="display: none;">
    <img src="http://s1.iconbird.com/ico/2013/8/429/w512h5121377940132185095settingsstreamline.png" align="bottom" style="text-align: bottom;" id="imgTitle">
    <div class="titleMenu">HacTpoũKu<span class="twoTitleName">MooMoo.io~CheatMenu~</span></div>
    <hr>
    <div class="ScrollFixedPositionBlock">
        <a class="ScrollElementBox" href="#ScrollElement1"><span>Autoheal</span></a>
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
            <SettingText>Chat <input class="inputTxt" id="AutoHealChat" maxlength="30" placeholder="Message..." type="text"></SettingText>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement2"></section>
        <fieldset>
            <legend align="center">AntiInsta</legend>
            <SettingText title="AntiInsta from moomoomod v9.">Anti insta (v9)<label class="checkbox-green"><input type="checkbox" id="MainAntiInsta" checked><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText title="AntiInsta from moomoomod v6.">Anti insta (v6)<label class="checkbox-green"><input type="checkbox" id="AntiInsta"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText title="AntiInsta from moomoomod v1-v5.">Anti insta (v1)<label class="checkbox-green"><input type="checkbox" id="AntiInstaOld"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText>Chat <input type="text" class="inputTxt" id="AntiInstaChat" maxlength="30" placeholder="Message..."></SettingText><br>
            <SettingText>Heal for ai(v6) multiplier <input type="range" min="1" max="10" id="AntiInstaMultiplier" value="1"> x<span id="myMult">1</span></SettingText>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement3"></section>
        <fieldset>
            <legend align="center">InstaKill</legend>
            <SettingText>Auto aim <label class="checkbox-green"><input type="checkbox" id="Aim"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText>Speed normal insta <input class="inputTxt" id="InstaSpeed" maxlength="3" placeholder="Speed..." value="92" type="text"></SettingText><br>
            <SettingText>Auto reload secondary <label class="checkbox-green"><input type="checkbox" id="AutoReloadInstaKill"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText>Chat <input type="text" class="inputTxt" value="Insta" placeholder="Message..."
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
                  <SettingText>Chat <input type="text" class="inputTxt" value="OneTick" placeholder="Message..."
                </SettingText>
            </fieldset>
       <fieldset>
              <legend align="center">FastInsta</legend>
              <SettingText>Fast insta <label class="checkbox-green"><input type="checkbox" id="StackInsta"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
              <SettingText>Chat <input type="text" class="inputTxt" value="FastInsta" placeholder="Message..."
       </fieldset>
       <fieldset>
              <legend align="center">SpikeInsta</legend>
              <SettingText>Spike insta <label class="checkbox-green"><input type="checkbox" id="SpikeInsta"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
              <SettingText>Chat <input type="text" class="inputTxt" value="SpikeInsta" placeholder="Message..."
       </fieldset>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement4"></section>
        <fieldset>
            <legend align="center">AntiTrap</legend>
            <SettingText>Anti trap <label class="checkbox-green"><input type="checkbox" id="AntiTrap"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label><br>
            Chat <input type="text" class="inputTxt" id="AntiTrapChat" maxlength="30" value="AntiTrap" placeholder="Message..."
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
                Need resources <input type="text" style="width: 50px;" class="inputTxt" id="NextResource" placeholder="Resources" value="155" \><br>
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
            <SettingText>Spam clan <label class="checkbox-green"><input type="checkbox" id="SpamClan"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label> <input type="text" class="inputTxt" id="SpamClanName" value="~ ~ ~" placeholder="Message..."></SettingText><br>
            <SettingText>Spam chat <label class="checkbox-green"><input type="checkbox" id="SpamChat"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label> <input type="text" class="inputTxt" id="SpamChatName" value="~ ~ ~ ~ ~" placeholder="Message..."></SettingText><br>
            <SettingText>Send msg if near enemy <label class="checkbox-green"><input type="checkbox" id="helloMode"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label> <input type="text" class="inputTxt" id="MsgText" value="~hi~" placeholder="Message..."></SettingText><br>
            <SettingText>360° hit <label class="checkbox-green"><input type="checkbox" id="angleGlitch"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
            <SettingText>Auto respawn <label class="checkbox-green"><input type="checkbox" id="AutoRespawn"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label> <input type="text" class="inputTxt" id="AutoRespawnName" maxlength="15" placeholder="Name..." \></SettingText><br>
            <SettingText>Kill chat <label class="checkbox-green"><input type="checkbox" id="killChat"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label> <input type="text" class="inputTxt" id="KillChat" maxlength="100" placeholder="Chat..." \></SettingText><br>
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
            <SettingText id="AfkVisible">Chat <input type="text" class="inputTxt" value="~" id="AfkMsg"><br></SettingText>
            <SettingText id="PlaceVisible">Place spike <label class="checkbox-green"><input type="checkbox" id="PlaceSpike"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement8"></section>
        <fieldset>
            <legend align="center">Commands</legend>
            <SettingText>Prefix: <input type="text" class="inputTxt" style="width: 50px;" id="PrefixCommands" maxlength="1" value="w" placeholder="Prefix..."></SettingText>
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
                Anti trap: <input style="width: 100px;" id="BindAntiTrap" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="Numpad1" type="text">
                <br>
                Anti insta: <input style="width: 100px;" id="BindAntiInsta" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="Numpad2" type="text">
                <br>
                360° hit: <input style="width: 100px;" id="hit360" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="Numpad3" type="text">
                <br>
            </SettingText>
        </fieldset>
        <section class="InvisibleElementForScroll" id="ScrollElement10"></section>
        <fieldset>
            <legend align="center">Menu</legend>
            <SettingText>
                Menu color text <input type="color" id="ColorText" value="8000FF"> <button id="DefColorText" class="Button_style">Default</button><br>
                Bind key: <input style="width: 100px;" id="KeyOpenGuiMenu" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="Escape" type="text"><br>
            </SettingText>
            <fieldset>
                <legend align="center">Menu</legend>
                <SettingText>Hud <label class="checkbox-green"><input type="checkbox" id="Hud"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label></SettingText><br>
                <SettingText>Hud color text <input type="color" id="ColorText2" value="#FF00FC"> <button id="DefColorText2" class="Button_style">Default</button></SettingText><br>
                <SettingText>Hud text size <input type="range" min="1" max="60" id="HudTextSize" value="18"> <span id="myMult2">18</span>px <button id="DefColorText4" class="Button_style">Default</button></SettingText><br>
                <SettingText>Hud shadow <label class="checkbox-green"><input type="checkbox" id="HudShadow"><span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span></label> <input type="color" id="ColorText3" value="#002FFF"> <button id="DefColorText3" class="Button_style">Default</button></SettingText>
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
        cursor: url(https://media.discordapp.net/attachments/888409659743010867/889978058591842304/hand-cursor_1.png), default;
    }
    .actionBarItem, #chatButton, #storeButton, #allianceButton,
    .allianceButtonM, .joinAlBtn, #allianceManager, #storeMenu,
    .storeTab, .skinColorItem, #altServer, .notifButton,
    #joinPartyButton, .menuLink, #nativeResolution, #showPing,
    #settingsButton {
        cursor: url(https://media.discordapp.net/attachments/888409659743010867/889978058591842304/hand-cursor_1.png), default;
    }
    #storeHolder, #gameCanvas, #allianceHolder, .storeItem, #mainMenu {
        cursor: url(https://media.discordapp.net/attachments/888409659743010867/889974791698804776/free-icon-cursor-747970_1_1.png), default;
    }
    a {
        cursor: url(https://media.discordapp.net/attachments/888409659743010867/889978058591842304/hand-cursor_1.png), default;
    }
    #nameInput {
        cursor: url(https://media.discordapp.net/attachments/878345257786429471/889989640277336084/cursor_text_moomoomod_1.png), default;
    }
    input[type="text"] {
    cursor: url(https://media.discordapp.net/attachments/878345257786429471/889989640277336084/cursor_text_moomoomod_1.png), default;
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
        cursor: url(https://media.discordapp.net/attachments/888409659743010867/889978058591842304/hand-cursor_1.png), default;
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
        cursor: url(https://media.discordapp.net/attachments/888409659743010867/889978058591842304/hand-cursor_1.png), default;
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
        cursor: url(https://media.discordapp.net/attachments/888409659743010867/889974791698804776/free-icon-cursor-747970_1_1.png), default;
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
    cursor: url(https://media.discordapp.net/attachments/888409659743010867/889978058591842304/hand-cursor_1.png), default;
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
        cursor: url(https://media.discordapp.net/attachments/888409659743010867/889978058591842304/hand-cursor_1.png), default;
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
        cursor: url(https://media.discordapp.net/attachments/888409659743010867/889978058591842304/hand-cursor_1.png), default;
        -webkit-appearance: none;
        margin-top: -7px;
    }

    input[type=range]:focus::-webkit-slider-runnable-track {
        background: #212121;
    }

    input[type=range]::-moz-range-track {
        width: 100%;
        height: 5px;
        cursor: url(https://media.discordapp.net/attachments/888409659743010867/889978058591842304/hand-cursor_1.png), default;
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
        cursor: url(https://media.discordapp.net/attachments/888409659743010867/889978058591842304/hand-cursor_1.png), default;
    }
    input[type=range]::-ms-track {
        width: 100%;
        height: 5px;
        cursor: url(https://media.discordapp.net/attachments/888409659743010867/889978058591842304/hand-cursor_1.png), default;
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
        cursor: url(https://media.discordapp.net/attachments/888409659743010867/889978058591842304/hand-cursor_1.png), default;
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
/* Variable */

let rainbowSkin,
    allColors,
    takeRandomColor,
    w,
    he,
    mX,
    mY,
    wS

// Rainbow Skin...
setInterval(() => {
    takeRandomColor = randomInt(0, 13)
    allColors = ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "rgba(0, 0, 0, 0)", "#00FFFF", "#0000FF", "#000000", "#FF00FF", "#008000", "#808080", "#00FA9A", "#FF1493", "#7B68EE", "#FFFFFF"]
    rainbowSkin = String(allColors[takeRandomColor])
    Global.newSkinColors = (window.config.skinColors = ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#000000", "#FF00FF", "#008000", "#808080", "#00FA9A"])
}, speedRanbowSkin)

/*
 If you want to copy something, then do it correctly!
 Do not forget that JS knowledge is used here, which is unknown to you (most of it).
 I don't mind you copying my code! But do not forget about honor! After all, I wrote this script!
 Have a nice game!
 */