// ==UserScript==
// @name         /=|- B34R -|=\ /=\ Legit Script for Legit Players /=\
// @namespace    none
// @version      final
// @description  ArrowUp Key = Modification Menu | ArrowLeft Key = Setting | ArrowRight Key = MainMenu | ArrowDown Key = InfoBox | Anti Ads |
// @author       Bear
// @match        *://sploop.io/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @grant        none
// @icon         https://media.discordapp.net/attachments/1077687137455046718/1122722360420728913/DaB34R.png
// @downloadURL https://update.greasyfork.org/scripts/469493/%3D%7C-%20B34R%20-%7C%3D%5C%20%3D%5C%20Legit%20Script%20for%20Legit%20Players%20%3D%5C.user.js
// @updateURL https://update.greasyfork.org/scripts/469493/%3D%7C-%20B34R%20-%7C%3D%5C%20%3D%5C%20Legit%20Script%20for%20Legit%20Players%20%3D%5C.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let versionN = "final";

    // /=\ Sploop.io Tab Title /=\
    document.title = 'Sploop.io (B34R Script Active!!)';

    // /=\ Mod HTML /=\
    let modB = `
<div class="bearMenu" id="bearModMenu" style="display: none;">
    <div id="block-bind">
        <div id="side-bar-menu">
            <buttonbear id="bearButt" onclick="switchPage('keybinds')">Keybinds</buttonbear>
            <buttonbear id="bearButt" onclick="switchPage('styler')">Elements</buttonbear>
            <buttonbear id="bearButt" onclick="switchPage('auto')">Auto</buttonbear>
            <buttonbear id="bearButt" onclick="switchPage('mod')">ModHUD</buttonbear>
            <buttonbear id="bearButt" onclick="switchPage('credits')">Credits</buttonbear>
        </div>
    </div>
    <div id="block-bind-b">
        <div id="keybinds-page" class="page">
            <fieldset>
                <legend align="center">KeyBinds</legend>
                <SettingText>Mod Menu Key: <br>
                <input style="width: 100px;" id="modBind" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="ArrowUp" type="text">
                </SettingText>
                <br>
                <SettingText>Info Key: <br>
                <input style="width: 100px" id="infoBind" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="ArrowDown" type="text">
                </SettingText>
                <br>
                <SettingText>Settings Key: <br>
                <input style="width: 100px" id="settingsBind" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="ArrowLeft" type="text">
                </SettingText>
                <br>
                <SettingText>HomePage Key: <br>
                <input style="width: 100px" id="homeBind" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="ArrowRight" type="text">
                </SettingText>
                <br>
                <SettingText>Rewards Key: <br>
                <input style="width: 100px" id="rewardsBind" class="inputTxt" onKeyPress=SupressInput(event); oncontextmenu="return false" placeholder="Bind..." value="ControlRight" type="text">
                </SettingText>
            </fieldset>
        </div>
        <div id="styler-page" class="page">
            <fieldset>
                <legend align="center">Transparent</legend>
                <fieldset>
                    <SettingText>Transparent Hat Store
                        <div class="toggle-container">
                            <input type="checkbox" id="hatStore">
                            <label for="hatStore"></label>
                        </div>
                    </SettingText>
                    <br>
                    <SettingText>Transparent Clan Menu
                        <div class="toggle-container">
                            <input type="checkbox" id="clanMenu">
                            <label for="clanMenu"></label>
                        </div>
                    </SettingText>
                    <br>
                    <SettingText>Transparent Home Page
                        <div class="toggle-container">
                            <input type="checkbox" id="homeDisplay">
                            <label for="homeDisplay"></label>
                        </div>
                    </SettingText>
                </fieldset>
            </fieldset>
            <br>
            <fieldset>
                <legend align="center">Change Element</legend>
                <fieldset>
                    <SettingText>Anti-Scroll
                        <div class="toggle-container">
                             <input type="checkbox" id="antiScroll">
                             <label for="antiScroll"></label>
                         </div>
                    </SettingText>
                    <br>
                    <SettingText>Click-Thru [WIP]
                    <div class="toggle-container">
                    <input type="checkbox" id="clickThru">
                    <label for="clickThru"></label>
                    </div>
                    </SettingText>
                    <br>
                    <SettingText>Naked Hat Store
                        <div class="toggle-container">
                            <input type="checkbox" id="nakedStore">
                            <label for="nakedStore"></label>
                        </div>
                    </SettingText>
                    <br>
                    <SettingText>Skinny Hat Store
                        <div class="toggle-container">
                            <input type="checkbox" id="skinnyStore">
                            <label for="skinnyStore"></label>
                        </div>
                    </SettingText>
                </fieldset>
                <br>
                <fieldset>
                    <legend align="center">Home Page</legend>
                    <SettingText>Anti-Name Change
                        <div class="toggle-container">
                            <input type="checkbox" id="antiName">
                            <label for="antiName"></label>
                        </div>
                    </SettingText>
                    <br>
                    <SettingText>Bigger Rank Leaderboard
                    <div class="toggle-container">
                    <input type="checkbox" id="BiggerR">
                    <label for="BiggerR"></label>
                    </div>
                    </SettingText>
                </fieldset>
        </div>
        <div id="auto-page" class="page">
            <fieldset>
                <legend align="center">Auto Mode</legend>
                <SettingText>Classic
                    <div class="toggle-container">
                        <input type="checkbox" id="classicA">
                        <label for="classicA"></label>
                    </div>
                </SettingText>
                <br>
                <SettingText>Sandbox
                    <div class="toggle-container">
                        <input type="checkbox" id="sandboxA">
                        <label for="sandboxA"></label>
                    </div>
                </SettingText>
            </fieldset>
        </div>
        <div id="mod-page" class="page">
            <fieldset>
                <legend align="center">Infobox</legend>
                <SettingText>Transparent
                    <div class="toggle-container">
                        <input type="checkbox" id="opacityDisplay">
                        <label for="opacityDisplay"></label>
                    </div>
                    <br>
                </SettingText>
                <SettingText>Hide CPS
                    <div class="toggle-container">
                        <input type="checkbox" id="cpsDisplay">
                        <label for="cpsDisplay"></label>
                    </div>
                    <br>
                </SettingText>
                <SettingText>Hide FPS
                    <div class="toggle-container">
                        <input type="checkbox" id="framesPerSecondDisplay">
                        <label for="framesPerSecondDisplay"></label>
                    </div>
                </SettingText>
                <br>
                <SettingText>Hide Server
                    <div class="toggle-container">
                        <input type="checkbox" id="serverDisplay" checked>
                        <label for="serverDisplay"></label>
                    </div>
                    <br>
                </SettingText>
                <SettingText>Hide GameMode
                    <div class="toggle-container">
                        <input type="checkbox" id="gameDisplay">
                        <label for="gameDisplay"></label>
                    </div>
                </SettingText>
            </fieldset>
            <fieldset>
                <legend align="center">Modmenu</legend>
                <SettingText>Transparent
                    <div class="toggle-container">
                        <input type="checkbox" id="modDisplay">
                        <label for="modDisplay"></label>
                    </div>
                </SettingText>
            </fieldset>
        </div>
        <div id="credits-page" class="page">
            <fieldset>
                <legend align="center">Credits</legend>
                <fieldset>
                    <SettingText>Author:
                        <br> - B34R aka "DangerBear"
                    </SettingText>
                </fieldset>
                <br>
                <fieldset>
                    <SettingText>Discord:
                        <br> - dangerb34r.
                    </SettingText>
                </fieldset>
                <br>
                <fieldset>
                    <SettingText>Support:
                        <br> - offer Mi a cokie if u ci mi in game C:
                        <br> - any suggestions/problems? Add me on Discord.
                        <br> - Leave a comment in Greasyfork
                        <br>
                    </SettingText>
                </fieldset>
            </fieldset>
        </div>
    </div>
<script>

 function switchPage(pageName) {
        var pages = document.getElementsByClassName('page');

        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            if (page.id === pageName + '-page') {
                page.style.display = 'block';
            } else {
                page.style.display = 'none';
            }
        }
    }

    window.onload = function() {
        var defaultPage = 'styler';
        switchPage(defaultPage);
    };

// Mod Menu Bind
document.getElementById("modBind").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#modBind").val("Select")
            use3 = true
        }
        if (e.button == 2) {
            $("#modBind").val("...")
            use3 = false
        }
    })
    document.getElementById("modBind").addEventListener('keydown', e => {
        if ($("#modBind").focus()) {
            if (use3) {
                use3 = false
                codeKey3 = (e.code).toString()
                $("#modBind").val(codeKey3)
            }
        }
    })
    // Info Bind
    document.getElementById("infoBind").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#infoBind").val("Select")
            use3 = true
        }
        if (e.button == 2) {
            $("#infoBind").val("...")
            use3 = false
        }
    })
    document.getElementById("infoBind").addEventListener('keydown', e => {
        if ($("#infoBind").focus()) {
            if (use3) {
                use3 = false
                codeKey3 = (e.code).toString()
                $("#infoBind").val(codeKey3)
            }
        }
    })
    // Settings Bind
    document.getElementById("settingsBind").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#settingsBind").val("Select")
            use3 = true
        }
        if (e.button == 2) {
            $("#settingsBind").val("...")
            use3 = false
        }
    })
    document.getElementById("settingsBind").addEventListener('keydown', e => {
        if ($("#settingsBind").focus()) {
            if (use3) {
                use3 = false
                codeKey3 = (e.code).toString()
                $("#settingsBind").val(codeKey3)
            }
        }
    })
    // Homepage Bind
    document.getElementById("homeBind").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#homeBind").val("Select")
            use3 = true
        }
        if (e.button == 2) {
            $("#homeBind").val("...")
            use3 = false
        }
    })
    document.getElementById("homeBind").addEventListener('keydown', e => {
        if ($("#homeBind").focus()) {
            if (use3) {
                use3 = false
                codeKey3 = (e.code).toString()
                $("#homeBind").val(codeKey3)
            }
        }
    })
    // Rewards Bind
    document.getElementById("rewardsBind").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#rewardsBind").val("Select")
            use3 = true
        }
        if (e.button == 2) {
            $("#rewardsBind").val("...")
            use3 = false
        }
    })
    document.getElementById("rewardsBind").addEventListener('keydown', e => {
        if ($("#rewardsBind").focus()) {
            if (use3) {
                use3 = false
                codeKey3 = (e.code).toString()
                $("#rewardsBind").val(codeKey3)
            }
        }
    })
    jQuery(function() {
        if (localStorage.bearInput) {
            var checks = JSON.parse(localStorage.bearInput);
            jQuery('#hatStore, #clanMenu, #homeDisplay, #antiScroll, #clickThru, #skinnyStore, #nakedStore, #antiName, #BiggerR, #classicA, #sandboxA, #opacityDisplay, #cpsDisplay, #fpsDisplay, #serverDisplay, #gameDisplay, #modDisplay, #showBear').prop('checked', function(i) {
                return checks[i];
            });
        }
    });
    jQuery('#hatStore, #clanMenu, #homeDisplay, #antiScroll, #clickThru, #skinnyStore, #nakedStore, #antiName, #BiggerR, #classicA, #sandboxA, #opacityDisplay, #cpsDisplay, #fpsDisplay, #serverDisplay, #gameDisplay, #modDisplay, #showBear').on('change', function() {
        localStorage.bearInput = JSON.stringify(jQuery('#hatStore, #clanMenu, #homeDisplay, #antiScroll, #clickThru, #skinnyStore, #nakedStore, #antiName, #BiggerR, #classicA, #sandboxA, #opacityDisplay, #cpsDisplay, #fpsDisplay, #serverDisplay, #gameDisplay, #modDisplay, #showBear').map(function() {
            return this.checked;
        }).get());
    });
</script>
    <style>
        .info-text {
        position: relative;
    }

    .info-icon {
        display: inline-block;
        margin-left: 5px;
        color: blue;
        cursor: pointer;
    }

    .info-box {
        top: 100%;
        left: 0;
        display: none;
        padding: 5px;
        background-color: #282d22;
        border: 1px solid black;
        color: #dda725;
        border-radius: 4px;
        font-size: 10px;
    }

    .info-text:hover .info-box {
        display: block;
    }
    .inputTxt {
        width: 270px;
        border-radius: 10px;
        color: #dda725;
        background: black;
        text-align: center;
        outline: 0;
    }
    /* Styles for toggle container */

    .toggle-container {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
    }
    /* Styles for checkboxes */

    input[type="checkbox"] {
        display: none;
    }
    /* Styles for labels */

    label {
        display: block;
        width: 100%;
        height: 100%;
        background-color: black;
        border-radius: 20px;
        position: relative;
        cursor: pointer;
    }

    label::before {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        background-color: #fff;
        border-radius: 50%;
        transition: transform 0.3s ease-in-out;
    }

    input[type="checkbox"]:checked + label::before {
        transform: translateX(100%);
    }
    /* Styles for indicator */

    label::after {
        content: "";
        position: absolute;
        top: 6px;
        right: 6px;
        width: 8px;
        height: 8px;
        background-color: red;
        border-radius: 50%;
    }

    input[type="checkbox"]:checked + label::after {
        background-color: #36c746;
    }
    buttonbear:hover {
    background: rgb(220, 28, 28);
    box-shadow: none;
    }
    buttonbear {
        width: 150px;
        padding: 5px;
        display: inline-block;
        color: rgb(255, 255, 255);
        text-align: center;
        box-shadow: rgb(110, 137, 47) 0px 5px 0px inset;
        border-width: 5px;
        border-style: solid;
        border-color: rgb(20, 20, 20);
        border-image: initial;
        border-radius: 13px;
        background: rgb(129, 170, 74);
        margin-bottom: 5px;
    }
    fieldset {
        border: 3px solid black;
        background: rgba(20, 20, 20, 0.3);
        border-radius: 10px;
        box-shadow: rgba(20, 20, 20, 0.4) 0px 5px 0px inset;
        text-align: left;
        padding-bottom: 8px
    }

    legend {
        color: white;
        font-size: 20px;
    }

    .page {
        display: none;
    }

    SettingText {
        color: #dda725;
        font-size: 20px;
        margin-left: 13px;
    }

    #block-bind {
        width: 210px;
        height: 600px;
        right: 640px;
        background: rgb(40, 45, 34);
        box-shadow: rgb(78, 86, 69) 0px 4px 0px inset, rgb(56, 72, 37) 0px -4px 0px inset, rgba(20, 20, 20, 0.3) 0px 5px 0px;
        top: -5px;
        border-radius: 15px;
        border: 5px solid #141414;
        position: absolute;
        padding: 10px;
    }

    #side-bar-menu {
        z-index: 9999;
        width: 180px;
        height: 570px;
        background: rgba(20, 20, 20, 0.3);
        border: 3px solid black;
        border-radius: 15px;
        text-align: center;
        padding-top: 10px;
    }

    .bearMenu {
        opacity: 1;
        position: absolute;
        font-size: 20px;
        z-index: 9999;
        padding: 20px;
        margin: auto;
        display: none;
        background: rgb(40, 45, 34);
        box-shadow: rgb(78, 86, 69) 0px 4px 0px inset, rgb(56, 72, 37) 0px -4px 0px inset, rgba(20, 20, 20, 0.3) 0px 2px 0px 5px, rgba(20, 20, 20, 0.1) 0px 0px 0px 15px;
        top: 10%;
        left: 25%;
        border-radius: 15px;
        width: 650px;
        height: 600px;
        border: 5px solid #141414;
    }

    select {
        outline: 0;
        transition: 1s all;
        vertical-align: middle;
        user-select: none;
        box-sizing: border-box;
        background: #fff;
        color: #4A4A4A;
        border-radius: 10px;
    }

    .inputTxt {
        text-shadow: rgb(20 20 20) 4px 0px 0px, rgb(20 20 20) 3.87565px 0.989616px 0px, rgb(20 20 20) 3.51033px 1.9177px 0px, rgb(20 20 20) 2.92676px 2.72656px 0px, rgb(20 20 20) 2.16121px 3.36588px 0px, rgb(20 20 20) 1.26129px 3.79594px 0px, rgb(20 20 20) 0.282949px 3.98998px 0px, rgb(20 20 20) -0.712984px 3.93594px 0px, rgb(20 20 20) -1.66459px 3.63719px 0px, rgb(20 20 20) -2.51269px 3.11229px 0px, rgb(20 20 20) -3.20457px 2.39389px 0px, rgb(20 20 20) -3.69721px 1.52664px 0px, rgb(20 20 20) -3.95997px 0.56448px 0px, rgb(20 20 20) -3.97652px -0.432781px 0px, rgb(20 20 20) -3.74583px -1.40313px 0px, rgb(20 20 20) -3.28224px -2.28625px 0px, rgb(20 20 20) -2.61457px -3.02721px 0px, rgb(20 20 20) -1.78435px -3.57996px 0px, rgb(20 20 20) -0.843183px -3.91012px 0px, rgb(20 20 20) 0.150409px -3.99717px 0px, rgb(20 20 20) 1.13465px -3.8357px 0px, rgb(20 20 20) 2.04834px -3.43574px 0px, rgb(20 20 20) 2.83468px -2.82216px 0px, rgb(20 20 20) 3.44477px -2.03312px 0px, rgb(20 20 20) 3.84068px -1.11766px 0px, rgb(20 20 20) 3.9978px -0.132717px 0px;
        cursor: text;
        color: #fff;
        vertical-align: middle;
        user-select: none;
        box-sizing: border-box;
        text-align: center;
        outline: 0;
        display: inline-block;
        margin-left: 20px;
        border: none;
        border: 5px solid rgba(0, 0, 0, 0);
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08), 0 2px 10px 0 rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        transition: all 1s;
    }

    #block-bind-b {
        width: 100%;
        height: 100%;
        padding: 8px;
        overflow-y: scroll;
        overflow-x: hidden;
        background: rgba(20, 20, 20, 0.3);
        border-radius: 15px;
        border: 5px solid #141414;
    }
    #clanName {
    margin-left: 13px;
    background: black;
    color: #dda725;
    border-radius: 10px;
    outline: 0;
    text-align: center;
    }
    </style>`;
    $("body").append(modB)

    let cfB = `
<div class="infoElement" id="infoBox" style="display: block;">
    <div class="infoElementBox" id="cps" style="display: block;"></div>
    <div class="infoElementBox" id="fps" style="display: block;"></div>
    <div class="infoElementBox" id="server-label" style="display: block;"></div>
    <div class="infoElementBox" id="game-mode-label" style="display: block;"></div>
</div>
<style>
    #infoBox {}

    .infoElement {
        z-index: 8888;
        pointer-events: none;
        position: absolute;
        top: 5px;
        left: 5px;
        background-color: #282d22;
        width: auto;
        height: auto;
        border-width: 5px;
        border-style: solid;
        border-color: rgb(20, 20, 20);
        border-image: initial;
        padding: 7px;
        border-radius: 10px;
    }

    .infoElementBox {
        pointer-events: none;
        background: rgb(30, 32, 27);
        margin-bottom: 5px;
        border-width: 5px;
        border-style: solid;
        border-image: initial;
        padding: 10px;
        border: 5px solid #141414;
        border-radius: 10px;
        color: #dda725;
    }
    #bearButt.active {
    backgroud: green;
    }
</style>
`;
    $("body").append(cfB)

    let SploopStyle = `
    <style>
    #version-container {
    margin: 0 10px 0 5px;
    color: #f0ece0;
    font-size: 15px;
    display: flex;
    align-items: center;
    padding-right: 20px;
    border-radius: 7px;
    background: #1f2419;
    border: 3px solid #141414;
    height: 30px;
    margin-left: 20px;
    }
    #version {
    height: 60px;
    position: relative;
    left: -20px;
    margin-right: -10px;
    }
    .chat-container input {
    color: yellow;
    text-align: center;
    background-color: #000000ba;
    box-shadow: none;
    width: 315px;
    }
    #play:hover {
    box-shadow: none;
    }
    #play {
    box-shadow: none;
    }
    .background-img-play {
    display: none;
    }
    .game-mode {
    box-shadow: none;
    }
    .dark-blue-button-3-active:hover {
    box-shadow: none;
    }
    .dark-blue-button:hover {
    box-shadow: none;
    }
    #nickname {
    background: black;
    text-align: center;
    color: #dda725;
    width:  340px;
    }
    .input {
    box-shadow: none;
    color: white;
    }
    .menu .content .menu-item {
    }
    #main-content {
    width: auto;
    }
    #hat-menu {
    }
    #hat_menu_content {
    padding: initial;
    }
    .menu .content .menu-item {
    border: none !important;
    }
    #server-select {
    width: 340px;
    }
    #game-middle-main {
    height: 310px;
    }
    #homepage {
    background-image: url('') !important;
    }
    </style>
    `;
    $("body").append(SploopStyle)

    const popRewards = document.getElementById("pop-reward-da")
    const hatStoreBox = document.getElementById("hat-menu")
    const clanMenuBox = document.getElementById("clan-menu")
    const mainMenuBox = document.getElementById("game-middle-main")
    const hatStoreContentBox = document.getElementById("hat_menu_content")
    const nicknameBox = document.getElementById("nickname-container");
    const nickname = document.getElementById("nickname")
    const informationBox = document.getElementById("infoBox")
    const cpsBox = document.getElementById("cps")
    const fpsBox = document.getElementById("fps")
    const serverBox = document.getElementById("server-label")
    const gameBox = document.getElementById("game-mode-label")
    const ModMenu = document.getElementById("bearModMenu")
    const sideBarMenu = document.getElementById("block-bind")
    const hatDescriptions = [
        document.getElementsByClassName("column-flex column-flex-extra").item(0),
        document.getElementsByClassName("column-flex column-flex-extra").item(1),
        document.getElementsByClassName("column-flex column-flex-extra").item(2),
        document.getElementsByClassName("column-flex column-flex-extra").item(3),
        document.getElementsByClassName("column-flex column-flex-extra").item(4),
        document.getElementsByClassName("column-flex column-flex-extra").item(5),
        document.getElementsByClassName("column-flex column-flex-extra").item(6),
        document.getElementsByClassName("column-flex column-flex-extra").item(7),
        document.getElementsByClassName("column-flex column-flex-extra").item(8),
        document.getElementsByClassName("column-flex column-flex-extra").item(9),
        document.getElementsByClassName("column-flex column-flex-extra").item(10)
    ]
    const hatPrices = [
        document.getElementsByClassName("pricing hat_price_tag").item(0),
        document.getElementsByClassName("pricing hat_price_tag").item(1),
        document.getElementsByClassName("pricing hat_price_tag").item(2),
        document.getElementsByClassName("pricing hat_price_tag").item(3),
        document.getElementsByClassName("pricing hat_price_tag").item(4),
        document.getElementsByClassName("pricing hat_price_tag").item(5),
        document.getElementsByClassName("pricing hat_price_tag").item(6),
        document.getElementsByClassName("pricing hat_price_tag").item(7),
        document.getElementsByClassName("pricing hat_price_tag").item(8),
        document.getElementsByClassName("pricing hat_price_tag").item(9),
        document.getElementsByClassName("pricing hat_price_tag").item(10)
    ]
    const hatButtons = [
        document.getElementsByClassName("green-button text-shadowed-3 action hat_action_button").item(0),
        document.getElementsByClassName("green-button text-shadowed-3 action hat_action_button").item(1),
        document.getElementsByClassName("green-button text-shadowed-3 action hat_action_button").item(2),
        document.getElementsByClassName("green-button text-shadowed-3 action hat_action_button").item(3),
        document.getElementsByClassName("green-button text-shadowed-3 action hat_action_button").item(4),
        document.getElementsByClassName("green-button text-shadowed-3 action hat_action_button").item(5),
        document.getElementsByClassName("green-button text-shadowed-3 action hat_action_button").item(6),
        document.getElementsByClassName("green-button text-shadowed-3 action hat_action_button").item(7),
        document.getElementsByClassName("green-button text-shadowed-3 action hat_action_button").item(8),
        document.getElementsByClassName("green-button text-shadowed-3 action hat_action_button").item(9),
        document.getElementsByClassName("green-button text-shadowed-3 action hat_action_button").item(10)
    ]
    const hatTitle = document.getElementsByClassName("pop-title text-shadowed-4").item(0)
    const sandbox = document.getElementById("sandbox-mode")
    const classic = document.getElementById("ffa-mode")
    const popUi = document.getElementById("pop-ui")
    const popSettings = document.getElementById("pop-settings")
    const homeScreen = document.getElementById("homepage");
    const chatBox = document.getElementById("chat-wrapper");
    const grid = document.getElementById("grid-toggle")
    const ping = document.getElementById("display-ping-toggle")
    const antiScrollcheckBox = document.getElementById("antiScroll");
    const settingsBox = document.getElementById("top-wrap-left");
    const Skins = document.getElementById("nav-skins");
    const Ranking = document.getElementById("nav-ranking");
    const Game = document.getElementById("nav-game");
    const Shop = document.getElementById("nav-shop");
    const Profile = document.getElementById("nav-profile");
    const Warning = document.getElementById("Warning");
    const ranking = document.getElementById("ranking2-middle-main");
    const rankSpots = document.getElementById("ranking-rank-container");

    function handleKeyPress(event) {
        if (event.code === "Space" && antiScrollcheckBox.checked === true) {
            event.preventDefault();
        }
    }
    // /=\ Transparent HatStore /=\
    setInterval(() => {
        if (document.getElementById("hatStore").checked == true) {
            hatStoreBox.style.opacity = "0.4"
        } else {
            hatStoreBox.style.opacity = "1"
        }
    })
    // /=\ Transparent ClanMenu /=\
    setInterval(() => {
        if (document.getElementById("clanMenu").checked == true) {
            clanMenuBox.style.opacity = "0.4"
        } else {
            clanMenuBox.style.opacity = "1"
        }
    })
    // /=\ Transparent HomePage /=\
    setInterval(() => {
        if (document.getElementById("homeDisplay").checked == true) {
            mainMenuBox.style.opacity = "0.4"
        } else {
            mainMenuBox.style.opacity = "1"
        }
    })
    // /=\ naked hat Store /=\
    setInterval(() => {
        if (document.getElementById("nakedStore").checked == true) {
            hatStoreBox.style.boxShadow = "none";
            hatStoreBox.style.border = "none";
            hatStoreBox.style.background = "none";
            hatStoreContentBox.style.background = "none";
            hatStoreContentBox.style.border = "none";
            hatStoreContentBox.style.boxShadow = "none"
            hatDescriptions[0].style.display = "none"
            hatDescriptions[1].style.display = "none"
            hatDescriptions[2].style.display = "none"
            hatDescriptions[3].style.display = "none"
            hatDescriptions[4].style.display = "none"
            hatDescriptions[5].style.display = "none"
            hatDescriptions[6].style.display = "none"
            hatDescriptions[7].style.display = "none"
            hatDescriptions[8].style.display = "none"
            hatDescriptions[9].style.display = "none"
            hatDescriptions[10].style.display = "none"
            hatPrices[0].style.display = "none"
            hatPrices[1].style.display = "none"
            hatPrices[2].style.display = "none"
            hatPrices[3].style.display = "none"
            hatPrices[4].style.display = "none"
            hatPrices[5].style.display = "none"
            hatPrices[6].style.display = "none"
            hatPrices[7].style.display = "none"
            hatPrices[8].style.display = "none"
            hatPrices[9].style.display = "none"
            hatPrices[10].style.display = "none"
            hatButtons[0].style.background = "none"
            hatButtons[0].style.boxShadow = "none"
            hatButtons[1].style.background = "none"
            hatButtons[1].style.boxShadow = "none"
            hatButtons[2].style.background = "none"
            hatButtons[2].style.boxShadow = "none"
            hatButtons[3].style.background = "none"
            hatButtons[3].style.boxShadow = "none"
            hatButtons[4].style.background = "none"
            hatButtons[4].style.boxShadow = "none"
            hatButtons[5].style.background = "none"
            hatButtons[5].style.boxShadow = "none"
            hatButtons[6].style.background = "none"
            hatButtons[6].style.boxShadow = "none"
            hatButtons[7].style.background = "none"
            hatButtons[7].style.boxShadow = "none"
            hatButtons[8].style.background = "none"
            hatButtons[8].style.boxShadow = "none"
            hatButtons[9].style.background = "none"
            hatButtons[9].style.boxShadow = "none"
            hatButtons[10].style.background = "none"
            hatButtons[10].style.boxShadow = "none"
            hatTitle.innerText = "Naked: ON";
        } else {
            hatStoreBox.style.boxShadow = "rgb(78, 86, 69) 0px 4px 0px inset, rgb(56, 72, 37) 0px -4px 0px inset, rgba(20, 20, 20, 0.3) 0px 2px 0px 5px, rgba(20, 20, 20, 0.1) 0px 0px 0px 15px";
            hatStoreBox.style.border = "5px solid black";
            hatStoreBox.style.background = "rgb(40 45 34 / 60%)";
            hatStoreContentBox.style.background = "rgba(20, 20, 20, 0.3)";
            hatStoreContentBox.style.border = "4px solid black";
            hatStoreContentBox.style.boxShadow = "rgba(20, 20, 20, 0.4) 0px 5px 0px inset"
            hatDescriptions[0].style.display = "flex"
            hatDescriptions[1].style.display = "flex"
            hatDescriptions[2].style.display = "flex"
            hatDescriptions[3].style.display = "flex"
            hatDescriptions[4].style.display = "flex"
            hatDescriptions[5].style.display = "flex"
            hatDescriptions[6].style.display = "flex"
            hatDescriptions[7].style.display = "flex"
            hatDescriptions[8].style.display = "flex"
            hatDescriptions[9].style.display = "flex"
            hatDescriptions[10].style.display = "flex"
            hatPrices[0].style.display = "flex"
            hatPrices[1].style.display = "flex"
            hatPrices[2].style.display = "flex"
            hatPrices[3].style.display = "flex"
            hatPrices[4].style.display = "flex"
            hatPrices[5].style.display = "flex"
            hatPrices[6].style.display = "flex"
            hatPrices[7].style.display = "flex"
            hatPrices[8].style.display = "flex"
            hatPrices[9].style.display = "flex"
            hatPrices[10].style.display = "flex"
            hatButtons[0].style.background = "rgb(150, 185, 67)"
            hatButtons[0].style.boxShadow = "rgb(128, 152, 54) 0px -5px 0px inset"
            hatButtons[1].style.background = "rgb(150, 185, 67)"
            hatButtons[1].style.boxShadow = "rgb(128, 152, 54) 0px -5px 0px inset"
            hatButtons[2].style.background = "rgb(150, 185, 67)"
            hatButtons[2].style.boxShadow = "rgb(128, 152, 54) 0px -5px 0px inset"
            hatButtons[3].style.background = "rgb(150, 185, 67)"
            hatButtons[3].style.boxShadow = "rgb(128, 152, 54) 0px -5px 0px inset"
            hatButtons[4].style.background = "rgb(150, 185, 67)"
            hatButtons[4].style.boxShadow = "rgb(128, 152, 54) 0px -5px 0px inset"
            hatButtons[5].style.background = "rgb(150, 185, 67)"
            hatButtons[5].style.boxShadow = "rgb(128, 152, 54) 0px -5px 0px inset"
            hatButtons[6].style.background = "rgb(150, 185, 67)"
            hatButtons[6].style.boxShadow = "rgb(128, 152, 54) 0px -5px 0px inset"
            hatButtons[7].style.background = "rgb(150, 185, 67)"
            hatButtons[7].style.boxShadow = "rgb(128, 152, 54) 0px -5px 0px inset"
            hatButtons[8].style.background = "rgb(150, 185, 67)"
            hatButtons[8].style.boxShadow = "rgb(128, 152, 54) 0px -5px 0px inset"
            hatButtons[9].style.background = "rgb(150, 185, 67)"
            hatButtons[9].style.boxShadow = "rgb(128, 152, 54) 0px -5px 0px inset"
            hatButtons[10].style.background = "rgb(150, 185, 67)"
            hatButtons[10].style.boxShadow = "rgb(128, 152, 54) 0px -5px 0px inset"
            hatTitle.innerText = "Hats"
        }
    })
    // /=\ Skinny Hat Store /=\
    setInterval(() => {
        if (document.getElementById("skinnyStore").checked == true) {
            document.getElementById("nakedStore").checked = true
            hatStoreBox.style.width = "200px"
        } else {
            hatStoreBox.style.width = "500px"
        }
    })
    // /=\ AntiNameChange /=\
    setInterval(() => {
        if (document.getElementById("antiName").checked == true) {
            nicknameBox.style.pointerEvents = "none"
        } else {
            nicknameBox.style.pointerEvents = "auto"
        }
    })
    // /=\ Bigger Rank Leaderboard /=\
    setInterval(() => {
        if (document.getElementById("BiggerR").checked == true) {
            ranking.style.height = "600px"
            rankSpots.style.height = "475px"
        } else {
            ranking.style.height = "285px"
            rankSpots.style.height = "181px"
        }
    })

    // /=\ Anti Scroll /=\
    setInterval(() => {
        if (document.getElementById("antiScroll").checked == true) {
            document.getElementById("biggerHat").checked = false
            document.getElementById("pvpHats").checked = false
            document.getElementById("pvpHatsImmunity").checked = false
            document.addEventListener("keydown", handleKeyPress);
        } else {
            document.removeEventListener("keydown", handleKeyPress);
        }
    })
    // /=\ Auto Respawn /=\
    // /=\ classic Toggle /=\
    function checkClassicA() {
        if (document.getElementById("classicA").checked == true) {
            document.getElementById("sandboxA").checked = false;
            classic.click();
        }
    }

    document.getElementById("classicA").addEventListener("change", checkClassicA);

    // /=\ sandbox Toggle /=\
    function checkSandboxA() {
        if (document.getElementById("sandboxA").checked == true) {
            document.getElementById("classicA").checked = false;
            sandbox.click();
        }
    }

    document.getElementById("sandboxA").addEventListener("change", checkSandboxA);


    // /=\ Transparent InfoBox /=\
    setInterval(() => {
        if (document.getElementById("opacityDisplay").checked == true) {
            informationBox.style.opacity = "0.4"
        } else {
            informationBox.style.opacity = "1"
        }
    })
    // /=\ hide Cps /=\
    setInterval(() => {
        if (document.getElementById("cpsDisplay").checked == true) {
            cpsBox.style.display = "none"
        } else {
            cpsBox.style.display = "block"
        }
    })
    // /=\ hide Fps /=\
    setInterval(() => {
        if (document.getElementById("framesPerSecondDisplay").checked == true) {
            fpsBox.style.display = "none"
        } else {
            fpsBox.style.display = "block"
        }
    })
    // /=\ hide Server /=\
    setInterval(() => {
        if (document.getElementById("serverDisplay").checked == true) {
            serverBox.style.display = "none"
        } else {
            serverBox.style.display = "block"
        }
    })
    // /=\ hide gameMode /=\
    setInterval(() => {
        if (document.getElementById("gameDisplay").checked == true) {
            gameBox.style.display = "none"
        } else {
            gameBox.style.display = "block"
        }
    })
    // /=\ Transparent ModMenu /=\
    setInterval(() => {
        if (document.getElementById("modDisplay").checked == true) {
            ModMenu.style.background = "rgba(40, 45, 34, 0.31)"
            sideBarMenu.style.background = "rgba(40, 45, 34, 0.31)"
        } else {
            ModMenu.style.background = "rgb(40, 45, 34)"
            sideBarMenu.style.background = "rgb(40, 45, 34)"
        }
    })
    // /=\ Auto Grid-toggle /=\
    function handleCheckbox() {
        const checkbox = document.getElementById("grid-toggle");
        const smallWaiting = document.getElementById("small-waiting");

        if (checkbox.checked) {
            smallWaiting.style.pointerEvents = "none";
            checkbox.click();
        } else {
            smallWaiting.style.pointerEvents = "auto";
            checkbox.click();
        }
    }

    handleCheckbox();

    // /=\ Move InfoBox if Ping toggled ON
    setInterval(() => {
        if (document.getElementById("display-ping-toggle").checked == true) {
            informationBox.style.left = "75px"
        } else {
            informationBox.style.left = "15px"
        }
    })
    // /=\ Remove InfoBox if all Info toggled OFF /=\
    setInterval(() => {
        if (document.getElementById("cpsDisplay").checked == true && document.getElementById("framesPerSecondDisplay").checked == true && document.getElementById("serverDisplay").checked == true && document.getElementById("gameDisplay").checked == true) {
            informationBox.style.display = "none"
        }
    })

    // /=\ Create Version Box /=\
    var VersionDiv = `<div id="version-container"><img id="version" draggable="false"src="https://media.discordapp.net/attachments/1077687137455046718/1122722360420728913/DaB34R.png"> <div id="version-value">Version: ${versionN}</div></div>`;
    var targetdiv = $('div#logged-content');
    targetdiv.append(VersionDiv);

    // /=\ Change Chat Box Inner Text /=\
    const placeholders = [
        "MESSAGE",
        "_M_E_S_S_A_GE",
        "-M-E-S-S-A-G-E-",
        ".M.E.S.S.A.G.E.",
        "=M=E=S=S=A=G=E="
    ];

    function changePlaceholder(index) {
        if (index >= placeholders.length) {
            return;
        }

        setTimeout(() => {
            document.getElementById('chat').placeholder = placeholders[index];
            changePlaceholder(index + 1);
        }, 200);
    }

    setInterval(() => {
        changePlaceholder(0);
    }, 1100);

    // /=\ Delete Elements /=\
    const elementsToRemove = [
        'game-left-content-main',
        'game-right-content-main',
        'game-bottom-content',
        'right-content',
        'left-content',
        'skin-message',
        'shop-message',
        'cross-promo',
        'google_play',
        'landscape',
        'waiting',
        'policy',
        'logo',
    ];

    elementsToRemove.forEach(function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.remove();
        }
    });
    // /=\ Change Health bar color /=\
    const enhanceFillRect = function (fill, cColor) {
        return function (x, y, width, height) {
            if (this.fillStyle === "#a4cc4f") {
                this.fillStyle = cColor;
            }
            fill.call(this, x, y, width, height);
        };
    };

    const customColor = "#dda725";
    const FillRect = CanvasRenderingContext2D.prototype.fillRect;

    CanvasRenderingContext2D.prototype.fillRect = enhanceFillRect(FillRect, customColor);

    // /=\ Access homepage /=\
    function handleArrowRightKeyPress(event) {
        if (ModMenu.style.display === "none" && popUi.style.display === "none") {
            if (event.code === $("#homeBind").val()) {
                if (homeScreen) {
                    if (homeScreen.style.display === "flex") {
                        homeScreen.style.display = "none";
                        settingsBox.style.display = "flex"
                    } else {
                        homeScreen.style.display = "flex";
                        settingsBox.style.display = "none";
                    }
                }
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }
    document.addEventListener("keydown", handleArrowRightKeyPress);

    // /=\ Access Rewards???? /=\
    function handleArrowleftRightKeyPress(event) {
        if (event.code === $("#rewardsBind").val()) {
            if (popUi) {
                if (popUi.style.display === "flex") {
                    popUi.style.display = "none";
                    popRewards.style.display = "none";
                } else {
                    popUi.style.display = "flex";
                    popUi.classList.add("fade-in")
                    popRewards.style.display = "flex"
                    popRewards.classList.add("fade-in")
                }
            }
        }
    }
    document.addEventListener("keydown", handleArrowleftRightKeyPress);
    // /=\ Access Settings /=\
    function handleArrowLeftKeyPress(event) {
        if (homeScreen.style.display === "none" && ModMenu.style.display === "none" ) {
            if (event.code === $("#settingsBind").val()) {
                if (popUi && popSettings) {
                    if (popUi.style.display === "flex") {
                        popUi.style.display = "none";
                        popSettings.style.display = "none";
                    } else {
                        popUi.style.display = "flex";
                        popUi.classList.add("fade-in")
                        popSettings.style.display = "flex";
                        popSettings.classList.add("fade-in")
                        popUi.style.background = "none"
                        popSettings.style.background = "none"
                        popSettings.style.boxShadow = "none"
                        popSettings.style.border = "2px solid black"
                    }
                }
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }

    document.addEventListener("keydown", handleArrowLeftKeyPress);
    // /=\ ModMenu toggle /=\
    function handleArrowUpKeyPress(event) {
        if (popUi.style.display === "none") {
            if (event.code === $("#modBind").val()) {
                if (ModMenu) {
                    if (ModMenu.style.display === "block") {
                        ModMenu.style.display = "none"
                    } else {
                        ModMenu.style.display = "block"
                    }
                }
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }
    document.addEventListener("keydown", handleArrowUpKeyPress);
    // /=\ Info Box /=\
    function handleArrowDownKeyPress(event) {
        if (event.code === $("#infoBind").val()) {
            if (informationBox) {
                if (informationBox.style.display === "block") {
                    informationBox.style.display = "none"
                } else {
                    informationBox.style.display = "block"
                }
            }
            event.preventDefault();
            event.stopPropagation();
        }
    }
    document.addEventListener("keydown", handleArrowDownKeyPress);

    // /=\ Server and Gamemode Label /=\
    var serverLabel = document.getElementById("server-label");
    var gameModeLabel = document.getElementById("game-mode-label");

    serverLabel.textContent = "Server: Unknown";
    gameModeLabel.textContent = "Game Mode: Unknown";

    function updateLabels() {
        var serverSelect = document.getElementById("server-select");
        var serverName = "";

        for (var i = 0; i < serverSelect.options.length; i++) {
            var option = serverSelect.options[i];
            if (option.selected) {
                serverName = option.textContent;
                break;
            }
        }

        if (serverName !== "") {
            serverLabel.textContent = "Server: " + serverName;
        } else {
            serverLabel.textContent = "Server: Connecting";
        }


        var ffaMode = document.getElementById("ffa-mode");
        var sandboxMode = document.getElementById("sandbox-mode");
        var battleRoyaleMode = document.getElementById("battleroyale-mode");
        var smallWaiting = document.getElementById("small-waiting");

        if (smallWaiting.style.display === "flex") {
            gameModeLabel.textContent = "Game Mode: Connecting";
        } else if (ffaMode.classList.contains("dark-blue-button-3-active")) {
            gameModeLabel.textContent = "Game Mode: Classic";
        } else if (sandboxMode.classList.contains("dark-blue-button-3-active")) {
            gameModeLabel.textContent = "Game Mode: SandBox";
        } else if (battleRoyaleMode.classList.contains("dark-blue-button-3-active")) {
            gameModeLabel.textContent = "Game Mode: BattleRoyale";
        } else {
            gameModeLabel.textContent = "Game Mode: Unknown";
        }
    }

    updateLabels();
    setInterval(updateLabels, 500);

    // /=\ Fps /=\
    var frameCount = 0;
    var fpsStartTime = 0;
    var fpsDisplay = document.getElementById("fps");

    function updateDisplay() {
        var currentTime = new Date().getTime();
        var fpsElapsedTime = (currentTime - fpsStartTime) / 1000;
        var fps = frameCount / fpsElapsedTime;
        fpsDisplay.innerHTML = "FPS: " + fps.toFixed(0);
        frameCount = 0;
        fpsStartTime = currentTime;
    }
    function updateFrame() {
        frameCount++;
        requestAnimationFrame(updateFrame);
    }

    setInterval(updateDisplay, 1000);
    updateFrame();

    // /=\ Cps /=\
    let isSpacebarHeld = false;
    let cps = 0;
    let Mcps = 0;
    let Hue = 0;

    function updateCPS() {
        const cpsElement = document.getElementById("cps");
        cpsElement.textContent = "CPS: " + cps;
    }

    document.addEventListener("mousedown", function() {
        cps++;
        setTimeout(function() {
            cps--;
        }, 900);
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === " ") {
            if (!isSpacebarHeld) {
                isSpacebarHeld = true;
                event.preventDefault();
            }
        }
    });

    document.addEventListener("keyup", function(event) {
        if (event.key === " ") {
            isSpacebarHeld = false;
            cps++;
            setTimeout(function() {
                cps--;
            }, 900);
        }
    });

    setInterval(function() {
        if (cps > Mcps) Mcps = cps;
        Hue += Math.random() * 0.4;
        updateCPS();
    }, 0);


    // /=\ Text into Emoji /=\
    const emojiMappings = {
        ":skull:": "💀",
        ":heart:": "❤️",
        ":smile:": "😄",
        ":thumbu:": "👍",
        ":thumbd:": "👎"
    };

    function replaceTextWithEmojis(text) {
        let replacedText = text;
        for (const pattern in emojiMappings) {
            if (emojiMappings.hasOwnProperty(pattern)) {
                replacedText = replacedText.replace(new RegExp(pattern, "g"), emojiMappings[pattern]);
            }
        }
        return replacedText;
    }

    document.getElementById("chat").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const chatInput = event.target;
            const text = chatInput.value;
            const replacedText = replaceTextWithEmojis(text);
            chatInput.value = replacedText;
        }
    });

    // /=\ allows user to press Space when chatting /=\
    document.getElementById("chat-wrapper").addEventListener("keydown", function(event) {
        if (event.key === " ") {
            event.stopPropagation();
        }
    });
    document.getElementById("nickname").addEventListener("keydown", function(event) {
        if (event.key === " ") {
            event.stopPropagation();
        }
    });

})();