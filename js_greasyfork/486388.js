// ==UserScript==
// @name             Sploop++
// @version          1.2
// @description   simple visuals
// @author           nyannez
// @match            *://sploop.io/*
// @run-at            document-start
// @icon                https://sploop.io/img/ui/favicon.png
// @grant              none
// @namespace https://greasyfork.org/users/960747
// @downloadURL https://update.greasyfork.org/scripts/486388/Sploop%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/486388/Sploop%2B%2B.meta.js
// ==/UserScript==

const defaultSettings = {
    HP: true,
    chestsHP: true,
    rainbHP: true,
    LBF: false,
    rainbBar: false,
    hideHPwNicks: false,
    hideHUD: false,
    autoRespawn: false,
    hitboxes: false,
    autobuy: true,
    wrange: false,
    rainbNick: false,
    rainbClan: false,
    nickGradient: false,
    night: false,
    VSync: true,
    vignette: false,
    slowMotion: false,
    decorations: true,
    itemCount: true,
    keystrokes: true,
    shop: "crystal",
    lobby: "vertical",
    nickColor: "#89A0FE",
    nickColor2: "#404040",
    gradient: "#6d1082",
    gradient2: "#ad1dab",
    HPColor: "#a4cc4f",
    EnemysHPColor: "#802641",
    clanColor: "#0a80c9",
    clanColor2: "#2e3336",
    snowColor: "#ece5db",
    grassColor: "#788F57",
    beachColor: "#fcefbb",
    riverColor: "#2a8b9b",
    desertColor: "#b38354",
    nightColor: "#211b55",
    nightOpacity: "80",
    shopOpacity: 1,
    shopSize: 1
};
let buyed = false;
const log = console.log;

const checkChanges = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    return keys2.some(key => !keys1.includes(key)) || keys1.some(key => !keys2.includes(key));
};

if (!localStorage.settings || checkChanges(defaultSettings, JSON.parse(localStorage.settings))) {
    localStorage.setItem("settings", JSON.stringify(defaultSettings));
};

const changeSettings = (key, value) => {
    let newSettings = JSON.parse(localStorage.settings);
    newSettings[key] = value;
    localStorage.setItem("settings", JSON.stringify(newSettings));
};

const getValue = (key) => JSON.parse(localStorage.settings)[key];

const defaultRAF = window.requestAnimationFrame;
if (!getValue("VSync")) window.requestAnimationFrame = f => setTimeout(f, 0);

window.changeSettings = changeSettings;
window.getValue = getValue;
window.getSettings = changeSettings;

const getEl = (id) => document.getElementById(id);
window.getEl = getEl;
const serverInfo = document.createElement("span");
const pingCount = document.createElement("span");
const bossInfo = document.createElement("span");
const FPS = document.createElement("span");
const CPS = document.createElement("span");
let cps = 0;
const keystrokes = document.createElement("div");
const servers = {
    SFRA: "EU#1 Sand",
    SFRA2: "EU#2",
    SFRA2BIS: "EU#2 Sand",
    SCA: "USA#1 Sand",
    SCA2: "USA#2 Sand",
    SGP: 'AS#1 Sand',
    SGP2: 'AS#2 Sand',
    SGP3BIS: "AS#3 Sand",
    FRA1FFA: "EU Classic",
    CA1FFA: "USA Classic",
    SGP1FFA: "AS Classic",
    FR1EVENT: "EU Event",
    CA1EVENT: "USA Event"
};

window.addEventListener('DOMContentLoaded', event => {
    const Comfortaa = document.createElement('style');
    Comfortaa.innerHTML = `@import "https://fonts.googleapis.com/css2?family=Comfortaa&display=swap";`;
    const ubuntu = document.createElement("style");
    ubuntu.textContent = `@import "https://fonts.googleapis.com/css2?family=Ubuntu:700&display=swap";`;
    document.head.appendChild(Comfortaa, ubuntu);

    serverInfo.style = `position: absolute;font-size: 120%;z-index: 888;top: 15px;color: white;left: 1%;font-weight: 100;pointer-events: none;font-family: Comfortaa;text-shadow: 1px 1px 5px black, 3px 3px 5px black;`;
    FPS.id = "FPS";
    FPS.style = "position: absolute;z-index: 10;left: 1%;font-family: Comfortaa;pointer-events:none;top: 50px;font-size: 120%;color: white;font-weight: 100;text-shadow: 1px 1px 5px black, 3px 3px 5px black;"
    pingCount.id = "pingCount";
    pingCount.style = "position: absolute;z-index: 10;left: 1%;font-family: Comfortaa;pointer-events:none;top: 85px;font-size: 120%;color: white;font-weight: 100;text-shadow: 1px 1px 5px black, 3px 3px 5px black;"
    bossInfo.id = "bossInfo";
    bossInfo.style = "position: absolute;z-index: 10;left: 1%;font-family: Comfortaa;pointer-events:none;top: 120px;font-size: 120%;color: white;font-weight: 100;text-shadow: 1px 1px 5px black, 3px 3px 5px black;"
    CPS.id = "CPS";
    CPS.style = "position: absolute;z-index: 10;left: 1%;font-family: Comfortaa;pointer-events:none;top: 155px;font-size: 120%;color: white;font-weight: 100;text-shadow: 1px 1px 5px black, 3px 3px 5px black;"
    CPS.textContent = "CPS: " + cps;
    pingCount.textContent = "Ping: unknown";
    serverInfo.textContent = "Loading...";
    bossInfo.textContent = "Boss: unknown";
    FPS.textContent = "FPS: unknown";
    serverInfo.style.display = "none";
    FPS.style.display = "none";
    pingCount.style.display = "none";
    bossInfo.style.display = "none";
    CPS.style.display = "none";

    const plist = document.createElement("div");
    plist.id = "plist";
    plist.style = `
    position: absolute;
    top: 40%;
    background: rgba(0, 0, 0, 0.26);
    box-shadow: rgba(0, 0, 0, 0.26) 3px 8px 20px 1px;
    border: 3px solid rgba(0, 0, 0, 0.16);
    border-radius: 15px;
    left: 50%;
    height: 500px;
    width: 400px;
    color: white;
    transform: translate(-50%, -40%);
    display: none;
    flex-direction: column;
    overflow-x: hidden;
    `;

    const menu = document.createElement("div");
    menu.id = "menu";
    menu.className = "menuu";
    menu.style = `
    z-index: 99;
    position: absolute;
    top: 40%;
    background: rgba(0, 0, 0, 0.26);
    left: 50%;
    height: 450px;
    box-shadow: rgba(0, 0, 0, 0.26) 3px 8px 20px 1px;
    width: 400px;
    transform: translate(-50%, -40%);
    border-radius: 15px;
    padding: 10px;
    border: 3px solid rgba(0, 0, 0, 0.16);
    display: none;
    overflow: auto;
    `;

    menu.innerHTML = `
    <div class="otctup">
    <span class="checkbox-text">Health point</span>
    <label class="checkbox">
      <input type="checkbox" id="HP">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">Rainbow nickname</span>
    <label class="checkbox">
      <input type="checkbox" id="rainbNick">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">Rainbow HP</span>
    <label class="checkbox">
      <input type="checkbox" id="rainbHP">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">Rainbow age bar</span>
    <label class="checkbox">
      <input type="checkbox" id="rainbBar">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">Rainbow clan</span>
    <label class="checkbox">
      <input type="checkbox" id="rainbClan">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">Rainbow speed: </span>
    <input class="inpu" value="35">
    </div>

    <div class="otctup">
    <span class="checkbox-text">Chests HP</span>
    <label class="checkbox">
      <input type="checkbox" id="chestsHP">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">Leader board full gold</span>
    <label class="checkbox">
      <input type="checkbox" id="LBF">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">Hide HP with nicknames</span>
    <label class="checkbox">
      <input type="checkbox" id="hideHPwNicks">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">Hide HUD</span>
    <label class="checkbox">
      <input type="checkbox" id="hideHUD">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">VSync</span>
    <label class="checkbox">
      <input type="checkbox" id="VSync">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">Decorations</span>
    <label class="checkbox">
      <input type="checkbox" id="decorations">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">Item count</span>
    <label class="checkbox">
      <input type="checkbox" id="itemCount">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">Slowmotion</span>
    <label class="checkbox">
      <input type="checkbox" id="slowMotion">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">Keystrokes</span>
    <label class="checkbox">
      <input type="checkbox" id="keystrokes">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">Hitboxes</span>
    <label class="checkbox">
      <input type="checkbox" id="hitboxes">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">Weapon range</span>
    <label class="checkbox">
      <input type="checkbox" id="wrange">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup">
    <span class="checkbox-text">Auto respawn</span>
    <label class="checkbox">
      <input type="checkbox" id="autoRespawn">
      <span class="checkmark"></span>
    </label>
    </div>

     <div class="otctup" style="display: flex;align-items: center;">
        <span class="checkbox-text">Shop type</span>
        <select style="outline: none; left: 10px; position: relative; text-align: center;" onchange="window.changeCSS(this);">
          <option ${getValue("shop") === "default" ? "selected" : ""}>default</option>
          <option ${getValue("shop") === "crystal" ? "selected" : ""}>crystal</option>
        </select>
        <input oninput=window.changeColor(this) value=${getValue("shopColor")} type="color" id="shopColor" style="background: none;border: none;left: 15px;position: relative;">
     </div>

     <div class="otctup" style="display: flex;align-items: center;">
        <span class="checkbox-text" style="padding-right: 5px;">Opacity</span>
        <input oninput=window.changeOpacity(this) value=${getValue("shopOpacity") * 100} min="1" max="100" type="range" id="shopOpacity" style="outline:none;">
     </div>

     <div class="otctup" style="padding-bottom: 5px;display: flex;align-items: center;">
        <span class="checkbox-text" style="padding-right: 5px;">Size</span>
        <input oninput=window.changeOpacity(this) value=${getValue("shopSize") * 100} min="1" max="100" type="range" id="shopSize" style="outline:none;">
     </div>

     <div class="otctup">
        <span class="checkbox-text" style="">Lobby type</span>
        <select style="outline: none;left: 10px;position: relative;text-align: center;" onchange="window.changeCSS(this);">
           <option ${getValue("lobby") === "vertical" ? "selected" : ""}>default</option>
           <option ${getValue("lobby") === "vertical" ? "selected" : ""}>vertical</option>
        </select>
     </div>

    <div class="otctup">
    <span class="checkbox-text">Auto buy hats (sandbox)</span>
    <label class="checkbox">
      <input type="checkbox" id="autobuy">
      <span class="checkmark"></span>
    </label>
    </div>

    <div class="otctup" style="display: flex;align-items: center;">
    <span class="checkbox-text" style="padding-right: 5px;">Night</span>
    <label class="checkbox">
      <input type="checkbox" id="night">
      <span class="checkmark"></span>
    </label>
    <input oninput=window.changeColor(this) value=${getValue("nightColor")} type="color" id="nightColor" style="padding-right: 10px;background: none;border: none;left: 5px;position: relative;">
    <span class="checkbox-text" style="padding-right: 5px;">Vignette</span>
    <label class="checkbox">
      <input type="checkbox" id="vignette">
      <span class="checkmark"></span>
    </label>
    <span class="checkbox-text" style="padding-left: 5px;padding-right: 5px;">A</span>
    <input oninput=window.changeOpacity(this) value=${getValue("nightOpacity")} min="1" max="100" type="range" id="nightOpacity" style="outline:none;">
    </div>

    <div style="display: flex;align-items: center;">
       <span class="checkbox-text">Nickname color</span>
       <input oninput=window.changeColor(this) value=${getValue("nickColor")} type="color" id="nickColor" style="background: none;border: none;left: 5px;position: relative;">
        <input oninput=window.changeColor(this) value=${getValue("nickColor2")} type="color" id="nickColor2" style="background: none;border: none;left: 5px;position: relative;">
    </div>

    <div style="display: flex;align-items: center;">
    <span style="padding-right: 5px;" class="checkbox-text">Nickname gradient</span>
    <label class="checkbox">
      <input type="checkbox" id="nickGradient">
      <span class="checkmark"></span>
    </label>
    <input oninput=window.changeColor(this) value=${getValue("gradient")} type="color" id="gradient" style="background: none;border: none;left: 5px;position: relative;">
    <input oninput=window.changeColor(this) value=${getValue("gradient2")} type="color" id="gradient2" style="background: none;border: none;left: 5px;position: relative;">
    </div>

    <div style="display: flex;align-items: center;">
    <span class="checkbox-text">HP color</span>
    <input oninput=window.changeColor(this) value=${getValue("HPColor")} type="color" id="HPColor" style="background: none;border: none;left: 5px;position: relative;">
    </div>

    <div style="display: flex;align-items: center;">
    <span class="checkbox-text">Enemys HP color</span>
    <input oninput=window.changeColor(this) value=${getValue("EnemysHPColor")} type="color" id="EnemysHPColor" style="background: none;border: none;left: 5px;position: relative;">
    </div>

    <div style="display: flex;align-items: center;">
    <span class="checkbox-text">Clan color</span>
    <input oninput=window.changeColor(this) value=${getValue("clanColor")} type="color" id="clanColor" style="background: none;border: none;left: 5px;position: relative;">
    <input oninput=window.changeColor(this) value=${getValue("clanColor2")} type="color" id="clanColor2" style="background: none;border: none;left: 5px;position: relative;">
    </div>

    <div style="display: flex;align-items: center;">
    <span class="checkbox-text">Snow color</span>
    <input oninput=window.changeColor(this) value=${getValue("snowColor")} type="color" id="snowColor" style="background: none;border: none;left: 5px;position: relative;">
    </div>

    <div style="display: flex;align-items: center;">
    <span class="checkbox-text">Grass color</span>
    <input oninput=window.changeColor(this) value=${getValue("grassColor")} type="color" id="grassColor" style="background: none;border: none;left: 5px;position: relative;">
    </div>

    <div style="display: flex;align-items: center;">
    <span class="checkbox-text">Beach color</span>
    <input oninput=window.changeColor(this) value=${getValue("beachColor")} type="color" id="beachColor" style="background: none;border: none;left: 5px;position: relative;">
    </div>

    <div style="display: flex;align-items: center;">
    <span class="checkbox-text">River color</span>
    <input oninput=window.changeColor(this) value=${getValue("riverColor")} type="color" id="riverColor" style="background: none;border: none;left: 5px;position: relative;">
    </div>

    <div style="display: flex;align-items: center;">
    <span class="checkbox-text">Desert color</span>
    <input oninput=window.changeColor(this) value=${getValue("desertColor")} type="color" id="desertColor" style="background: none;border: none;left: 5px;position: relative;">
    </div>

    <button id="reset">Reset</button>
    `;

    keystrokes.style="pointer-events: none;position: absolute;width: 150px;height: auto;background: rgba(0, 0, 0, 0.62);z-index: 9;display: none;flex-wrap: wrap;top: 190px;left: 1%;"
    keystrokes.id = "keystrokes";
    keystrokes.innerHTML = `
    <div id="1" class="batton" style="border-bottom: none;">1</div>
    <div id="2" class="batton" style="border-bottom: none;border-left: none;">2</div>
    <div id="3" class="batton" style="border-bottom: none;border-left: none;">3</div>
    <div id="Q" class="batton">Q</div>
    <div id="F" style="border-left: none;" class="batton">F</div>
    <div id="R" style="border-left: none;" class="batton">R</div>
    <div id="LBtn" class="batton" style="width: 50%;border-top: none;">L</div>
    <div id="RBtn" class="batton" style="width: 50%;border-top: none;border-left: none;">R</div>
    <div id="Space" class="batton" style="width: 100%;border-top: none;">Space</div>
    `;
    const night = document.createElement("div");
    night.innerHTML = `<div id="nightEl" style="display: ${getValue("night") ? "block" : "none"};position: absolute;z-index: 2;width: 100%;height: 100%;background: ${getValue("vignette") ? `radial-gradient(transparent, ${getValue("nightColor") + getValue("nightOpacity")})` : `${getValue("nightColor") + getValue("nightOpacity")}`};pointer-events: none;"></div>`;
    document.body.append(serverInfo, FPS, pingCount, bossInfo, CPS, menu, plist, night, keystrokes);

    getEl("reset").addEventListener("mousedown", () => {
        localStorage.setItem("settings", JSON.stringify(defaultSettings));
        document.querySelectorAll('input[type="checkbox"]').forEach(el => {
            const id = el.id;
            if (["chestsHP", "LBF", "HP", "rainbHP", "rainbBar", "hideHPwNicks", "hideHUD", "autoRespawn", "hitboxes", "autobuy", "wrange", "rainbNick", "rainbClan", "nickGradient", "VSync", "slowMotion", "night", "vignette", "decorations", "itemCount", "keystrokes"].includes(id)) {
                el.checked = getValue(id);
            }
        });
    });

    const opacityToHex = (val) =>{
        val = Math.max(0, Math.min(100, val));
        const opacityValue = Math.round((val / 100) * 255);
        const opacityHex = opacityValue.toString(16).padStart(2, "0");

        return opacityHex;
    };

    window.changeOpacity = (element) => {
        const opacity = opacityToHex(element.value);
        if (element.id === "shopSize") {
            const sizeForShop = element.value / 100;
            getEl("hat-menu").style.scale = element.value / 100;
            changeSettings(element.id, sizeForShop);
        } else if (element.id === "shopOpacity") {
            const opacityForShop = element.value / 100;
            getEl("hat-menu").style.setProperty('opacity', `${opacityForShop}`, 'important');
            changeSettings(element.id, opacityForShop);
        }else if (element.id === "nightOpacity" && getValue("vignette")) {
            getEl("nightEl").style.background = `radial-gradient(transparent, ${getValue("nightColor") + opacity})`;
            changeSettings(element.id, opacity);
        } else if (element.id === "nightOpacity") {
            getEl("nightEl").style.background = getValue("nightColor") + opacity;
            changeSettings(element.id, opacity);
        };
    };

    window.changeColor = (element) => {
        if (element.id === "nightColor") {
            if (!getValue("vignette")) getEl("nightEl").style.background = element.value + getValue("nightOpacity");
            if (getValue("vignette")) getEl("nightEl").style.background = `radial-gradient(transparent, ${getValue("nightColor") + getValue("nightOpacity")})`;
            changeSettings(element.id, element.value);
        } else {
            changeSettings(element.id, element.value);
        };
    };

    window.changeCSS = (event) => {
        if (event.value === "vertical") {
            window.lobbyCSS = document.createElement("style");
            window.lobbyCSS.innerHTML = differentCSS[event.value];
            document.head.append(window.lobbyCSS);
        } else if (event.value === "crystal") {
            window.shopCSS = document.createElement("style");
            window.shopCSS.innerHTML = differentCSS[event.value];
            document.head.append(window.shopCSS);
        } else if (event.value === "default") {
            if (window.lobbyCSS) window.lobbyCSS.remove();
            if (window.shopCSS) window.shopCSS.remove();
        };
        changeSettings("shop", event.value);
    };

    setInterval(() => {
        getSploopServers();
        if (!currentServerUrl) return;
        const serverName = currentServerUrl.toUpperCase();
        const server = sploopServers.find(i => i.r === serverName);
        serverInfo.textContent = `${servers[serverName]}: ${server.d[1]}`;
    }, 2000);

    try {
        ["new-changelog", "logo", "bottom-wrap", "shop-io-games", "right-content", "game-bottom-content", "game-right-content-main", "game-left-content-main", "cross-promo", "landscape"].forEach(e => getEl(e).remove());
        document.querySelector("#skin-message > a > div").remove();
        document.querySelector("#left-content > div:nth-child(3)").remove();
        getEl("shop-message").style.opacity = 0;
        getEl("skin-message").style.opacity = 0;
    } catch(err) {}

    const styleItem = `
    .batton {
       width: 50px;
       height: 50px;
       color: white;
       display: flex;
       align-items: center;
       justify-content: center;
       border: 2px solid;
       font-family: 'Comfortaa';
       font-weight: 100;
    }

    .sl {
        outline: none;
        border: none;
        font-weight: 600;
    }

    .otctup {
        padding-top: 5px;
    }

    .menuu::-webkit-scrollbar {
       width: 18px;
       margin-left: 10px;
    }

    #plist::-webkit-scrollbar {
       width: 18px;
       margin-left: 10px;
    }

    .menuu::-webkit-scrollbar-thumb {
       border-radius: 20px;
       border: 2px solid #272727;
       background: #3939397d;
    }

    #plist::-webkit-scrollbar-thumb {
       border-radius: 20px;
       border: 2px solid #272727;
       background: #3939397d;
    }

    .inpu {
       width: auto;
       max-width: 50px;
       outline: none;
       text-align: center;
    }

    .checkbox {
      position: relative;
      display: inline-block;
      cursor: pointer;
    }

    .checkbox input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }

    .checkbox .checkmark {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      width: 20px;
      height: 20px;
      border: 2px solid #333;
      border-radius: 5px;
      background-color: #222;
    }

    .checkbox input:checked + .checkmark {
      background-color: #222;
    }

    .checkbox input:checked + .checkmark:after {
      content: "";
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
      background-size: cover;
      background-position: center;
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .checkbox span {
      pointer-events: none;
    }

    .checkbox-text {
      font-weight: 100;
      font-family: Comfortaa;
      color: white;
    }

    #ranking-rank-container {
      height: 360px;
    }

    #ranking2-middle-main {
      height: auto;
    }

    #left-content {
      height: 40px;
      position: unset;
      width: 100px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }

    #game-middle-main {
      left: 50%;
      transform: translate(-50%);
    }

    #main-content {
      background: none;
    }

    .profile-scores {
      width: 600px;
      height: 76px;
      color: white;
    }

    #profile-next-rank-text {
      height: 100%;
      color: white;
      width: auto;
      max-width: none;
    }

    #profile-next-rank-icons {
      height: 100%;
      width: 250px;
      padding: 5px;
      margin-right: 10px;
    }

    .scrollbar::-webkit-scrollbar-thumb {
      box-shadow: none;
    }
    #hat-menu {
      transform-origin: left top;
    }
    `;
    const differentCSS = {
        vertical: `
            #server-select {
                transition: all 0.5s ease;
                border-radius: 5px;
                background: #9ce2de;
                box-shadow: inset 0 -6px 0 0 rgb(85 173 195 / 70%);
            }
            #server-select:hover {
                transition: all 0.5s ease;
                background: #abe2ff;
                box-shadow: inset 0px -5px 0px rgb(131 210 238);
            }
            .nav-button-active {
                transition: all 0.5s ease;
                position: absolute;
                transform: scale(1);
                color: #7fdeff;
            }
            .nav-button-text:active {
                transition: all 0.5s ease;
                transform: scale(1);
                color: #7fdeff;
            }
            .nav-button-text:hover {
                transition: all 0.5s ease;
                color: #7fdeff;
            }
            #play:hover {
                transition: all 0.5s ease;
                background-color: #abe2ff;
                box-shadow: inset 0 -9px 0 rgb(131 210 238);
            }
            #play {
                transition: all 0.5s ease;
                background: #9ce2de;
                box-shadow: inset 0 -9px 0 rgb(85 173 195 / 70%);
                border-radius: 7px;
            }
            #play:active {
                transition: all 0.5s ease;
                background-color: #6dc5e7;
                box-shadow: inset 0 9px 0 rgb(153 207 249 / 70%);
            }
            .dark-blue-button {
                transition: all 0.5s ease;
                background: #9ce2de;
                box-shadow: inset 0 -6px 0 0 rgb(85 173 195 / 70%);
            }
            .dark-blue-button-3-active {
                transition: all 0.5s ease;
                background: #6dc5e7;
                box-shadow: inset 0px 5px 0px rgb(153 207 249 / 70%);
            }
            .dark-blue-button:hover {
                transition: all 0.5s ease;
                background: #abe2ff;
                box-shadow: inset 0px -5px 0px rgb(131 210 238);
            }
            .dark-blue-button-3-active:active {
                transition: all 0.5s ease;
                background: #6dc5e7;
                box-shadow: inset 0px 5px 0px rgb(153 207 249 / 70%);
            }
            .game-mode {
                transition: all 0.5s ease;
                border-radius: 7px;
            }
            #nickname {
                transition: all 0.5s ease;
                border-radius: 5px;
            }
            #game-middle-main {
                background: rgba(75, 186, 248, 0.2);
                border-radius: 0px;
                box-shadow: rgb(153, 187, 255) 5px 5px 20px 2px;
                border-color: rgba(60, 185, 255, 0.2);
            }
            #nav {
                position: absolute;
                display: flex;
                flex-direction: column;
                left: -20vw;
                width: 0px !important;
                height: 200%;
                justify-content: space-between;
            }
            #middle-wrap {
               scale: 0.8;
            }
        `,
        crystal: `
           .green-button {
               transition: all 0.5s ease;
               background-color: rgb(138 202 234 / 50%);
               box-shadow: inset 0 -5px 0 rgb(111 175 185 / 50%);
           }
           .green-button:hover {
               transition: all 0.5s ease;
               background-color: #a3d2ea;
               box-shadow: inset 0 -5px 0 #69bae3;
           }
           .green-button:active {
               transition: all 0.5s ease;
               background-color: #9ae0ea;
               box-shadow: inset 0 5px 0 #bbedee;
           }
           .menu-item {
               border-bottom: 3px solid rgba(255, 255, 255, 0) !important;
           }
           #hat_menu_content {
               border-color: rgba(175, 226, 255, 0.57);
               box-shadow: none;
               background: rgba(20, 20, 20, 0);
               border-radius: 0px;
               text-shadow: rgb(20, 20, 20) 3px 0px 20px;
           }
           #hat-menu {
                scale: ${getValue("shopSize")};
                transform-origin: left top;
                display: flex;
                opacity: ${getValue("shopOpacity")} !important;
                background: rgba(190, 220, 255, 0.17) !important;
                box-shadow: rgba(173, 255, 239, 0.5) 6px 6px 23px 2px;
                border: 5px solid rgba(168, 211, 255, 0.51);
           }
    `};
    const styleElement = document.createElement("style");
    styleElement.innerHTML = styleItem;
    document.head.appendChild(styleElement);

    if (getValue("shop") !== "default") {
        window.shopCSS = document.createElement("style");
        window.shopCSS.innerHTML = differentCSS[getValue("shop")];
        document.head.append(window.shopCSS);
    };

    if (getValue("lobby") !== "default") {
        window.lobbyCSS = document.createElement("style");
        window.lobbyCSS.innerHTML = differentCSS[getValue("lobby")];
        document.head.append(window.lobbyCSS);
    };

    document.querySelector("#play > div.background-moving.background-img-play").remove();
    document.querySelector("#hat-menu > div.pop-top.select > div.pop-title.text-shadowed-4").style.textShadow = "none";
    document.querySelector("#hat-menu > div.pop-top.select > div.pop-title.text-shadowed-4").textContent = "hats";
    for (let i = 0; i < 11; i++) {
        document.getElementsByClassName("hat_action_button")[i].style.borderRadius = '5px';
        document.getElementsByClassName("menu-item")[i].style.borderBottom = "3px solid #ffffff00";
        document.getElementsByClassName("menu-item")[i].style.color = "3px solid #ffffff00";
        document.getElementsByClassName("description")[i].style.display = "none";
    };

    const isInput = () => {
        const element = document.activeElement;
        return ["TEXTAREA", "INPUT"].includes(element.tagName);
    };

    window.addEventListener("keydown", (event) => {
        if (event.code === "Space" && !isInput()) {
            event.preventDefault();
        }
    });

    getEl("hat_menu_content").addEventListener("wheel", event => {
        const hatMenuContent = getEl("hat_menu_content");
        const scrollTop = hatMenuContent.scrollTop;

        getEl("hat_menu_content").scrollBy(0, event.deltaY < 0 ? (scrollTop === 203 || scrollTop === 200) ? -250 : -150 : 203);
        event.preventDefault();
    });

    setTimeout(() => {
        const kd = document.createElement("div");
        const kdCount = (Number(document.querySelector("#total-kill").textContent) / Number(document.querySelector("#total-death").textContent)).toFixed(2);
        kd.innerHTML = `<div><div class="text-shadowed-3 profile-score">Kills/Deaths</div><div class="text-shadowed-3 profile-score yellow-text">${kdCount}</div></div>`;
        document.querySelector("#profile-container > div.middle-main.profile-scores").appendChild(kd);
    }, 200);

    document.querySelectorAll('input[type="checkbox"]').forEach(el => {
        const id = el.id;
        if (["chestsHP", "LBF", "HP", "rainbHP", "rainbBar", "hideHPwNicks", "hideHUD", "autoRespawn", "hitboxes", "autobuy", "wrange", "rainbNick", "rainbClan", "nickGradient", "VSync", "slowMotion", "night", "vignette", "decorations", "itemCount", "keystrokes"].includes(id)) {
            el.checked = getValue(id);
            el.addEventListener("click", event => {
                changeSettings(id, !getValue(id));
                if (id === "VSync") {
                    if (getValue(id)) {
                        window.requestAnimationFrame = defaultRAF;
                    } else {
                        window.requestAnimationFrame = f => setTimeout(f, 0);
                    };
                } else if (id === "hideHUD") {
                    if (getValue(id)) {
                        serverInfo.style.display = "none";
                        FPS.style.display = "none";
                        pingCount.style.display = "none";
                        bossInfo.style.display = "none";
                        CPS.style.display = "none";
                        keystrokes.style.display = "none";
                    } else {
                        serverInfo.style.display = "block";
                        FPS.style.display = "block";
                        pingCount.style.display = "block";
                        bossInfo.style.display = "block";
                        CPS.style.display = "block";
                        keystrokes.style.display = "flex";
                    };
                } else if (id === "night") {
                    getEl("nightEl").style.display = getValue(id) ? "block" : "none";
                } else if (id === "vignette") {
                    const opacity = getValue("nightOpacity");
                    getEl("nightEl").style.background = getValue(id) ? `radial-gradient(transparent, ${getValue("nightColor") + getValue("nightOpacity")})` : `${getValue("nightColor") + getValue("nightOpacity")}`
                } else if (id === "keystrokes") {
                    keystrokes.style.display = getValue(id) ? "flex" : "none";
                };
            });
        };
    });

    window.hue = 0;
    const updateColors = () => {
        window.barColor = getValue("rainbBar") ? `hsl(${window.hue}, 80%, 50%)` : "#ffffff";
        window.myHPColor = getValue("rainbHP") ? `hsl(${window.hue}, 80%, 50%)` : getValue("HPColor");
        window.hue = (window.hue + 0.3) % 360;
    };

    const setNewInterval = () => {
        const speed = document.querySelector("#menu > div:nth-child(6) > input").value;
        const colorInterval = setInterval(() => {
            if (speed !== document.querySelector("#menu > div:nth-child(6) > input").value) {
                setNewInterval();
                clearInterval(colorInterval);
            };
            updateColors();
        }, document.querySelector("#menu > div:nth-child(6) > input").value);
    };
    setNewInterval();
});

let sploopServers, currentServerUrl, ws;
const getSploopServers = async () => await fetch("https://sploop.io/servers").then(e => e.json()).then(e => (sploopServers = e));

const entities = {
    0: { health: 100 },
    14: { health: 380 },
    23: { health: 380 },
    24: { health: 380 },
    25: { health: 1000 },
    27: { health: 5000 },
    28: { health: 5000 },
    36: { health: 380 },
};

const packetsID = {
    item: 0,
    move: 1,
    hat: 5,
    chat: 7,
    place: 8,
    joinGame: 11,
    angle: 13,
    upgrade: 14,
    stopMove: 15,
    clanAcc: 17,
    stopAttack: 18,
    hit: 19,
    joinClan: 21,
    clan: 22,
    EAttack: 23,
    clanLeave: 24
};

let myID, placing = true, onHand = 0, placed = false, isAlive = false;
const sendPacket = (packetID, ...values) => ws.send(new Uint8Array([packetID, ...values]));
const respawn = () => ws.send(JSON.stringify([10, localStorage.nickname, localStorage.skin, "FFFFFEEEEGGBBBAAA", localStorage.accessory, localStorage.accMail, localStorage.accToken, localStorage.back]))
window.sendPacket = sendPacket;

const checkChat = () => getEl("chat-wrapper").style.display === "" || getEl("chat-wrapper").style.display === "none";
window.openPlayersList = () => {
    let dis = getEl("plist").style.display;
    getEl("menu").style.display = "none";
    getEl("plist").style.display = dis === "flex" ? dis = "none" : dis = "flex";
};

const updateCPS = () => {
    CPS.textContent = `CPS: ${++cps}`;
    setTimeout(() => {
        CPS.textContent = `CPS: ${--cps}`;
    }, 1000);
};

window.addEventListener("mousedown", event => {
    const btn = event.which === 1 ? "LBtn" : "RBtn";
    getEl(btn).style.background = "rgb(255 255 255 / 62%)";
    updateCPS();
});

window.addEventListener("mouseup", event => {
    const btn = event.which === 1 ? "LBtn" : "RBtn";
    setTimeout(() => {
        getEl(btn).style.background = "none";
    }, 20);
});

let keyPressed = false;

window.addEventListener("keydown", event => {
    const pressedKey = event.code;
    let element;

    switch (pressedKey) {
        case "Escape":
            window.openMenu();
            break;
        case "Digit1":
        case "Digit2":
        case "Digit3":
        case "KeyQ":
        case "KeyF":
        case "KeyR":
            element = getEl(pressedKey.slice(-1));
            if (element) element.style.background = "rgb(255 255 255 / 62%)";
            if (pressedKey === "Digit1") onHand = 0;
            else if (pressedKey === "Digit2") onHand = 1;
            break;
        case "Space":
            if (!keyPressed) {
                element = getEl("Space");
                if (element) {
                    element.style.background = "rgb(255 255 255 / 62%)";
                    updateCPS();
                    keyPressed = true;
                }
            }
            break;
    }
});

window.addEventListener("keyup", event => {
    const pressedKey = event.code;
    const element = pressedKey === "Space" ? getEl("Space") : getEl(pressedKey.slice(-1));
    if (element) element.style.background = "none";
    if (pressedKey === "Space") keyPressed = false;
});

window.seconds = undefined;

window.updatePList = () => {
    getEl("plist").innerHTML = ``;
    if (window.allPlayers) {
        window.allPlayers.forEach(player => {
            if (player[Sploop.nick] !== "") {
                const element = document.createElement("span");
                element.textContent = `{${player[Sploop.id2]}} ${player[Sploop.nick]}`;
                element.className = "checkbox-text";
                element.style = `
                   font-size: 17px;
                   padding-top: 10px;
                   left: 10px;
                   position: relative;
                   user-select: text;
                `;
                getEl("plist").append(element);
            };
        });
    };
};

window.getKill = (data) => {
};

let nextBoss = 0;
window.getBoss = (ID, bosses) => {
    clearInterval(window.seconds);
    const whichBoss = ID === 0 ? "cow" : ID === 1 ? "dragon" : ID === 2 ? "mammoth" : "unknown";
    nextBoss = bosses[ID + 1 < 3 ? ID + 1 : 0].name;
    bossInfo.textContent = `Boss: ${whichBoss}`;
};

window.getWS = (websocket) => {
    ws = websocket;
    currentServerUrl = ws.url.split('//')[1].split('.')[0];
    window.myWS = ws;
    ws.onclose = () => {
        ws = undefined;
        buyed = false;
    };
};

window.receiveMsg = (msg) => {
    const data = msg.data;
    const decoded = typeof data === "string" ? JSON.parse(data) : new Uint8Array(data);
    switch (decoded[0]) {
        case 15:
            getEl("pingCount").textContent = `Ping: ${decoded[1]}`;
            break;
        case 21: {
            let count = 59;
            window.seconds = setInterval(() => {
                bossInfo.textContent = `Next boss: ${nextBoss} ${count}s`;
                count--;
            }, 1000)
            break;
        }
        case 35:
            if (getValue("autobuy") && !buyed) {
                for (let i = 0; i < 12; i++) sendPacket(packetsID.hat, i);
                buyed = true;
            };
            isAlive = true;
            serverInfo.style.display = "block";
            FPS.style.display = "block";
            pingCount.style.display = "block";
            bossInfo.style.display = "block";
            CPS.style.display = "block";
            if (getValue("keystrokes")) keystrokes.style.display = "flex";
            break;
        case 19:
            if (getValue("autoRespawn")) respawn();
            onHand = 0;
            isAlive = false;
            placed = false;
            serverInfo.style.display = "none";
            FPS.style.display = "none";
            pingCount.style.display = "none";
            bossInfo.style.display = "none";
            CPS.style.display = "none";
            keystrokes.style.display = "none";
            getEl("plist").style.display = "none";
            break;
        case 33:
            myID = decoded[1];
            window.myID = myID;
            break;
    };
};

window.receiveChatMsg = (text) => {
    if (text.includes("spawn")) {
        window.decorations.push({
            id: Number(text.split(" ")[1]),
            [Sploop.x]: window.myX,
            [Sploop.y]: window.myY,
            gu: {
                Mu: 2,
                vu: 2
            }
        });
    }
    if (text.includes("remove")) {
        let lastIndex = window.decorations.findLastIndex(obj => obj.id == Number(text.split(" ")[1]));
        if (lastIndex !== -1) {
            window.decorations.splice(lastIndex, 1);
        }
    }
    if (text.includes("removes")) {
        let lastIndex = window.decorations.findIndex(obj => obj.id == Number(text.split(" ")[1]));
        if (lastIndex !== -1) {
            window.decorations.splice(lastIndex, 1);
        }
    }
};

let gameEntity;
let chests = [], queue = [];
window.attackAnimation = (type, id, weapon, isObject, entity) => {
    if (entity.type === 30 && chests.some(chest => chest[Sploop.id2] === id)) {
        queue.push(id);
    } else if (entity.type === 0) {
        const chests = queue.map(id => gameEntity.get(id));
        queue = [];
        if (!chests.length) return;
        const hatAdditional = entity[Sploop.hat] === 11 ? 1.4 : (entity[Sploop.hat] === 2 ? 1.25 : 1);
        const damage = (window.weapons[weapon][Sploop.weaponDamage2] || window.weapons[weapon][Sploop.weaponDamage]) * hatAdditional;
        chests.forEach(entity => {
            entity.health = ((entity.health -= damage) % 1 === 0) ? entity.health.toFixed(0) : entity.health.toFixed(1);
        });
    };
};

window.drawChestHP = (target, id, ctx, step) => {
    if (target.type === 30 && target.health === undefined) target.health = 380;
    if (!chests.some(chest => chest[Sploop.id2] === target[Sploop.id2]) && target.type === 30) chests.push(target);
    if (getValue("hitboxes")) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.arc(0, 0, window.sprites[target.type][Sploop.size], 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };
};

window.removeEntity = (entity) => {
    if (!entity.health) return;
    if ([12].includes(entity.type)) {
        const player = [...gameEntity].filter(([key, value]) => Sploop.id in value && value[Sploop.id] === entity[Sploop.id] && value.type === 0)[0][1];
        const spike = queue.map(id => gameEntity.get(id));
        queue = [];
        spike.forEach(obj => {
            obj.health -= player[Sploop.currentWeapon];
        });
    };
    delete entity.health;
    const index = chests.findIndex(chest => chest[Sploop.id2] === entity[Sploop.id2]);
    if (index !== -1) {
        chests.splice(index, 1);
    };
};

window.getEntityData = async (entity, ctx, isTeammate, map) => {
    gameEntity = map;
    if (!entity) return;;
    const entityX = entity[Sploop.x],
          entityY = entity[Sploop.y];
    if (entity[Sploop.id] === myID) {
        window.myX = entityX;
        window.myY = entityY;
        window.myAngle = entity[Sploop.angle];
        window.myID2 = entity[Sploop.id2];
    }
    if (getValue("hitboxes")) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.arc(entity[Sploop.x], entity[Sploop.y], window.sprites[entity.type][Sploop.size], 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };
    const maxHealth = entities[entity.type].health;
    const entityHealth = ((entity[Sploop.health] * maxHealth / 100) / 255 * 100).toFixed(0);
    if (getValue("wrange") && entity.type === 0) {
        const entityWeapon = entity[Sploop.currentWeapon],
              entityAngle = entity[Sploop.angle],
              weaponRange = window.weapons[entityWeapon].range,
              weaponName = window.weapons[entityWeapon][Sploop.weaponName];
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "#0000001A";
        ctx.strokeStyle = "#ffffff80";
        ctx.lineWidth = 3;
        if (weaponName === "XBow" || weaponName === "Bow" || weaponName === "Stone Musket" || weaponName === "Pearl") {
            const weaponX = weaponRange * Math.cos(entityAngle) + entityX;
            const weaponY = weaponRange * Math.sin(entityAngle) + entityY;
            ctx.moveTo(entityX, entityY)
            ctx.lineTo(weaponX, weaponY);
        } else {
            ctx.arc(entityX, entityY, weaponRange, entityAngle - 1.5, entityAngle + 1.5)
        };
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };
    if (getValue("HP")) {
        ctx.font = "100 20px MV Boli";
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = "#000000";
        ctx.shadowBlur = 5;
        ctx.fillStyle = (entity[Sploop.id] === myID || isTeammate) ? window.myHPColor : getValue("EnemysHPColor");
        ctx.fillText(`${entityHealth}/${maxHealth}`, entityX - 50, entityY + window.sprites[entity.type][Sploop.size] + 70);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    };
    if (getValue("chestsHP") && chests.length) {
        chests.forEach(target => {
            ctx.save();
            ctx.beginPath();
            ctx.textAlign = "center";
            ctx.font = "600 20px Comfortaa";
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 3;
            ctx.strokeText(target.health, target[Sploop.x], target[Sploop.y] + 5);
            ctx.fillText(target.health, target[Sploop.x], target[Sploop.y] + 5);
            ctx.fillRect
            ctx.closePath();
            ctx.restore();
        });
    };
};

const max = [0, 0, 0, 100, 30, 8, 2, 12, 32, 1, 2];
window.drawItemBar = (ctx, imageData, index) => {
    if (!getValue("itemCount")) return;
    const limit = max[window.weapons[window.stats[Sploop.itemsID][index]][Sploop.weaponID2]];
    const crntCount = window.stats[Sploop.objCount][window.weapons[window.stats[Sploop.itemsID][index]][Sploop.weaponID2]];
    if (limit == 0) return;
    const text = `${crntCount}/${limit}`;
    ctx.save();
    ctx.font = "600 25px MV Boli";
    ctx.fillStyle = "#000";
    ctx.fillText(text, imageData[Sploop.x] + imageData.width - ctx.measureText(text).width - 10, imageData[Sploop.y] + 25);
    ctx.restore();
};

const TYPEOF = value => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
const NumberSystem = [
    { radix: 2, prefix: "0b0*" },
    { radix: 8, prefix: "0+" },
    { radix: 10, prefix: "" },
    { radix: 16, prefix: "0x0*" }
];
class Regex {
    constructor(code, unicode) {
        this.code = this.COPY_CODE = code;
        this.unicode = unicode || false;
        this.hooks = {};
    };

    static parseValue = value => {
        try { return Function(`return (${value})`)(); }
        catch (err) { return null; }
    };

    isRegexp = value => TYPEOF(value) === "regexp";

    generateNumberSystem = int => `(?:${NumberSystem.map(({ prefix, radix }) => prefix + int.toString(radix)).join("|")})`;

    parseVariables = regex => regex.replace(/\{VAR\}/g, "(?:let|var|const)")
    .replace(/\{QUOTE\}/g, "['\"`]")
    .replace(/ARGS\{(\d+)\}/g, (_, count) => (Array(Number(count)).fill("\\w+")).join("\\s*,\\s*"))
    .replace(/NUMBER\{(\d+)\}/g, (_, int) => this.generateNumberSystem(Number(int)));

    format = (name, inputRegex, flags) => {
        const regex = Array.isArray(inputRegex) ? inputRegex.map(exp => this.isRegexp(exp) ? exp.source : exp).join("\\s*") : this.isRegexp(inputRegex) ? inputRegex.source : "";
        let parsedRegex = this.parseVariables(regex);

        if (this.unicode) {
            parsedRegex = parsedRegex.replace(/\\w/g, "(?:[^\\x00-\\x7F-]|\\$|\\w)");
        };

        const expression = new RegExp(parsedRegex.replace(/\{INSERT\}/, ""), flags);
        return parsedRegex.includes("{INSERT}") ? new RegExp(parsedRegex, flags) : expression;
    };

    template = (type, name, regex, substr) => {
        const expression = new RegExp(`(${this.format(name, regex).source})`);
        const match = this.code.match(expression) || [];
        this.code = this.code.replace(expression, type === 0 ? "$1" + substr : substr + "$1");
        return match;
    };

    match = (name, regex, flags, debug = false) => {
        const expression = this.format(name, regex, flags);
        const match = this.code.match(expression) || [];
        this.hooks[name] = { expression, match };
        return match;
    };

    matchAll = (name, regex, debug = false) => {
        const expression = this.format(name, regex, "g");
        const matches = [...this.code.matchAll(expression)];
        this.hooks[name] = { expression, match: matches };
        return matches;
    };

    replace = (name, regex, substr, flags) => {
        const expression = this.format(name, regex, flags);
        this.code = this.code.replace(expression, substr);
        return this.code.match(expression) || [];
    };

    replaceAll = (name, regex, substr, flags) => {
        const expression = this.format(name, regex, "g");
        this.code = this.code.replaceAll(expression, substr);
        return this.code.match(expression) || [];
    };

    append = (name, regex, substr) => this.template(0, name, regex, substr);

    prepend = (name, regex, substr) => this.template(1, name, regex, substr);

    insert = (name, regex, substr) => {
        const { source } = this.format(name, regex);
        if (!source.includes("{INSERT}")) throw new Error("Your regexp must contain {INSERT} keyword");
        const findExpression = new RegExp(source.replace(/^(.*)\{INSERT\}(.*)$/, "($1)($2)"));
        this.code = this.code.replace(findExpression, `$1${substr}$2`);
        return this.code.match(findExpression);
    };
};

window.openMenu = () => {
    let dis = getEl("menu").style.display;
    getEl("plist").style.display = "none";
    getEl("menu").style.display = dis === "block" ? dis = "none" : dis = "block";
};

window.abbreviateNumber = (number) => {
    const suffixes = {
        't': 1e12,
        'b': 1e9,
        'm': 1e6,
        'k': 1e3,
    };

    for (const [letter, value] of Object.entries(suffixes)) {
        if (number >= value) {
            let abbreviated = (number / value).toFixed(2).replace(/\.?0*$/, '');
            return `${abbreviated}${letter}`;
        };
    };

    return number.toString();
};

window.hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

let frames = 0,
    lastTime,
    lastUpdate = 0,
    frameCount = 0;
window.updateFPSCounter = (currentTime) => {
    const elapsedSeconds = (currentTime - (lastTime || (lastTime = currentTime))) / 1000;
    frameCount++;

    if (elapsedSeconds >= 1) {
        FPS.textContent = `FPS: ${Math.round(frameCount / elapsedSeconds)}`;
        frameCount = 0;
        lastTime = currentTime;
    };
};

let Sploop;
const applyHooks = code => {
    const Hook = new Regex(code, true);
    window.COPY_CODE = (Hook.COPY_CODE.match(/^(\(function \w+\(\w+\)\{.+)\(.+?\);$/) || [])[1];
    Hook.append("EXTERNAL fix", /\(function (\w+)\(\w+\)\{/, "let $2 = eval(`(() => ${COPY_CODE})()`);delete window.COPY_CODE;");
    const nick = Hook.match("nick", /\.(\w+):"XX"/)[1];
    const ID = Hook.match('ID', /&&\w{2}===\w\.(\w{2})\){/)[1];
    const map = Hook.match("objects", /let \w=(\w).get\(\w\)/)[1];
    const myData = Hook.match('myPlayer', /=(\w.get\(\w{2}\));\w&&\w\(\)/)[1];
    const X = Hook.match('playerX', /\{this\.(\w{2})=\w\|\|0/)[1];
    const Y = Hook.match('playerY', /,this\.(\w{2})=\w\|\|0\}/)[1];
    const ID2 = Hook.match('ID2', /-1!==\w+\.(\w+)&&/)[1];
    const currentWeapon = Hook.match("crntWeapon", /,\w.(\w{2})===/)[1];
    const angle = Hook.match("angle", /;\w.(\w{2})=\w\(\)/)[1];
    const weaponName = Hook.match("wpnName", /(\w{2}):"XX/)[1];
    const health = Hook.match("health", /(\w{2})<<8;/)[1];
    const weaponDamage = Hook.match("wpnDamage", /(\w{2}):32,reload:300/)[1];
    const weaponDamage2 = Hook.match("wpnDamage", /\w{2}:25,.{6}:300,(\w{2}):30/)[1];
    const teamID = Hook.match('test', /,\w=\w.(\w{2})\|.+?\<\<8/)[1];
    const radius = Hook.match("radius", /(\w{2}):220/)[1];
    const [, currentItem, hat] = Hook.match("hat", /\(\w+\.(\w+)\|\w+\.(\w+)<<NUMBER{8}\)/);
    const inWhichObject = Hook.match("iwo", /110\).+?,1===\w.(\w{2})&&!\w{2}/)[1];
    const weaponID = Hook.match('weaponID', /5,(\w{2}):0,\w{2}:22,/)[1];
    const weaponID2 = Hook.matchAll('el', /,(\w+):9,\w+:2/)[1][1];
    const itemsID = Hook.match("IDs", />1\){.{3}(\w{2})/)[1];
    const objCount = Hook.match("objCount", /\),this.(\w{2})=\w\):/)[1];
    const size = Hook.match("size", /\.(\w{2})\+50/)[1];
    const RweaponDMG = Hook.match("size", /\[0,0,10,0\](?:[^:]+:){4}[^,:]+,(\w{2})/)[1];
    const Bosses = Hook.match("bosses", /\(3424\),(\w+)/)[1];
    const itemBar = Hook.match("defaultData", /(\W\w+>NUMBER{1}\W.+?(\w+)\.(\w+).+?)function/)[3];
    const myID = Hook.match("myID", /!==(\w{2})\)/)[1];
    Sploop = {
        x: X,
        y: Y,
        id: ID,
        map: map,
        id2: ID2,
        hat: hat,
        nick: nick,
        size: size,
        type: 'type',
        angle: angle,
        health: health,
        radius: radius,
        teamID: teamID,
        itemsID: itemsID,
        itemBar: itemBar,
        objCount: objCount,
        weaponID: weaponID,
        weaponID2: weaponID2,
        RweaponDMG: RweaponDMG,
        weaponName: weaponName,
        weaponDamage: weaponDamage,
        weaponDamage2: weaponDamage2,
        currentWeapon: currentWeapon,
        inWhichObject: inWhichObject
    }
    log(Sploop);
    window.Sploop = Sploop;
    window.generatePositions = (amount, id) => {
        let flowers = [];
        for (let i = 0; i < amount; i++) {
            let obj = {
                [Sploop.x]: Math.floor(Math.random() * (9800 - 200 + 1)) + 200,
                [Sploop.y]: Math.floor(Math.random() * (7450 - 200 + 1)) + 200,
                id: id
            };
            flowers.push(obj);
        };
        return flowers;
    };

    window.decorations = [{"id":223,[Sploop.x]:29.99999999999999,[Sploop.y]:2550.0000000056198},{"id":223,[Sploop.x]:214.0002966762103,[Sploop.y]:2492.0291726187397},{"id":223,[Sploop.x]:382.0748870194689,[Sploop.y]:2440.6865700037215},{"id":223,[Sploop.x]:573.9858511507157,[Sploop.y]:2503.996448203956},{"id":223,[Sploop.x]:761.9999908462445,[Sploop.y]:2442.0386539633755},{"id":223,[Sploop.x]:952.0590210896952,[Sploop.y]:2505.0498958190256},{"id":223,[Sploop.x]:1259.9862437885706,[Sploop.y]:2452.0322384681695},{"id":223,[Sploop.x]:1450.0232490356113,[Sploop.y]:2512.003077236567},{"id":223,[Sploop.x]:1641.999998107236,[Sploop.y]:2447.999837480006},{"id":223,[Sploop.x]:1764.0000434531719,[Sploop.y]:2505.0000611454825},{"id":223,[Sploop.x]:1988.0000024140948,[Sploop.y]:2475.3910402273605},{"id":223,[Sploop.x]:2179.999948255453,[Sploop.y]:2539.9980611367455},{"id":223,[Sploop.x]:2371.000480338862,[Sploop.y]:2415.9959284149245},{"id":223,[Sploop.x]:2498.0000070562905,[Sploop.y]:2536.0629494204723},{"id":223,[Sploop.x]:2686.9998878301403,[Sploop.y]:2472.9999999978954},{"id":223,[Sploop.x]:2925.999527997155,[Sploop.y]:2485.018991363512},{"id":223,[Sploop.x]:3097.732209871221,[Sploop.y]:2439.997508765663},{"id":223,[Sploop.x]:3273.968723799376,[Sploop.y]:2549.999193626759},{"id":223,[Sploop.x]:3464.8013362358633,[Sploop.y]:2485.988137109807},{"id":223,[Sploop.x]:3658.901643634054,[Sploop.y]:2485.9999999926995},{"id":223,[Sploop.x]:3831.043036235859,[Sploop.y]:2526.0001627953843},{"id":223,[Sploop.x]:4082.9596476709476,[Sploop.y]:2461.9236918125425},{"id":223,[Sploop.x]:3956.0004172683734,[Sploop.y]:2461.99999999995},{"id":223,[Sploop.x]:4277.747414095257,[Sploop.y]:2513.8991451561224},{"id":223,[Sploop.x]:4509.000161954971,[Sploop.y]:2580.0064837158116},{"id":223,[Sploop.x]:4400.0000005704605,[Sploop.y]:2479.9017377199107},{"id":223,[Sploop.x]:4781.002734792941,[Sploop.y]:2488.1308565839},{"id":223,[Sploop.x]:4967.00551941161,[Sploop.y]:2551.1279965524545},{"id":223,[Sploop.x]:5160.050201842505,[Sploop.y]:2488.0470865591833},{"id":223,[Sploop.x]:5352.999570332228,[Sploop.y]:2552.020740569861},{"id":223,[Sploop.x]:5543.93781742945,[Sploop.y]:2488.0029731646046},{"id":223,[Sploop.x]:5737.000002635433,[Sploop.y]:2427.172435813349},{"id":223,[Sploop.x]:5928.993634014561,[Sploop.y]:2464.136863940179},{"id":223,[Sploop.x]:6116.258412735068,[Sploop.y]:2460.7532317948144},{"id":223,[Sploop.x]:6320.9560100313865,[Sploop.y]:2503.999997449834},{"id":223,[Sploop.x]:6559.886115789101,[Sploop.y]:2497.8825216612922},{"id":223,[Sploop.x]:6808.045482957361,[Sploop.y]:2434.7954508014664},{"id":223,[Sploop.x]:6686.313048001445,[Sploop.y]:2434.000063238881},{"id":223,[Sploop.x]:7007.821502411624,[Sploop.y]:2497.842353327186},{"id":223,[Sploop.x]:7201.89346427579,[Sploop.y]:2434.814349475234},{"id":223,[Sploop.x]:7394.0000069265125,[Sploop.y]:2496.000855023708},{"id":223,[Sploop.x]:7586.991570724414,[Sploop.y]:2496.002150801967},{"id":223,[Sploop.x]:7774.35475739181,[Sploop.y]:2433.97018813505},{"id":223,[Sploop.x]:7965.652671373453,[Sploop.y]:2433.9999999745323},{"id":223,[Sploop.x]:8105.065104471541,[Sploop.y]:2448.041779867961},{"id":223,[Sploop.x]:8357.00328524934,[Sploop.y]:2485.986261225132},{"id":223,[Sploop.x]:8500.999736983238,[Sploop.y]:2584.090122606014},{"id":223,[Sploop.x]:8679.159237507823,[Sploop.y]:2413.199101719817},{"id":223,[Sploop.x]:8908.11207669312,[Sploop.y]:2493.8815710969857},{"id":223,[Sploop.x]:9100.266251022786,[Sploop.y]:2430.0089637733436},{"id":223,[Sploop.x]:9286.056462091026,[Sploop.y]:2485.9780466880356},{"id":223,[Sploop.x]:9538.995084609018,[Sploop.y]:2450.9396355931212},{"id":223,[Sploop.x]:9732.002382560924,[Sploop.y]:2514.7415554647096},{"id":223,[Sploop.x]:9924.06913400942,[Sploop.y]:2450.3753934720717},{"id":224,[Sploop.x]:9633.066283895572,[Sploop.y]:2774.965527966431},{"id":224,[Sploop.x]:9368.367656473702,[Sploop.y]:2638.760240996886},{"id":224,[Sploop.x]:9108.93843443585,[Sploop.y]:2637.9999992425182},{"id":224,[Sploop.x]:8886.996496464813,[Sploop.y]:2740.465721502559},{"id":224,[Sploop.x]:8591.98848042534,[Sploop.y]:2697.955473152916},{"id":224,[Sploop.x]:8364.02653944699,[Sploop.y]:2742.099189166931},{"id":224,[Sploop.x]:8018.224819551448,[Sploop.y]:2652.8442740990295},{"id":224,[Sploop.x]:7777.999486631112,[Sploop.y]:2606.9522705110076},{"id":224,[Sploop.x]:7558.001173278906,[Sploop.y]:2890.046991103157},{"id":224,[Sploop.x]:8127.3105680599665,[Sploop.y]:2890.999995021336},{"id":224,[Sploop.x]:7398.508914037662,[Sploop.y]:2668.8699230283755},{"id":224,[Sploop.x]:6708.262218454327,[Sploop.y]:2866.24706119208},{"id":224,[Sploop.x]:6880.874061431822,[Sploop.y]:2568.0547673207466},{"id":224,[Sploop.x]:7048.001181302265,[Sploop.y]:2683.998365437441},{"id":224,[Sploop.x]:6384.51880056193,[Sploop.y]:2633.012344760018},{"id":224,[Sploop.x]:6229.001527052843,[Sploop.y]:2724.000037299408},{"id":224,[Sploop.x]:6185.032206096412,[Sploop.y]:2552.328289336163},{"id":224,[Sploop.x]:5833.001081234768,[Sploop.y]:2515.000004783373},{"id":224,[Sploop.x]:5635.013000179002,[Sploop.y]:2715.132991764611},{"id":224,[Sploop.x]:4983.825719408364,[Sploop.y]:2630.2715949351987},{"id":224,[Sploop.x]:4808.991452957154,[Sploop.y]:2675.0019236474545},{"id":224,[Sploop.x]:4529.012077026215,[Sploop.y]:2794.998442785668},{"id":224,[Sploop.x]:4248.154513207736,[Sploop.y]:2644.1945023172448},{"id":224,[Sploop.x]:3829.7973412358106,[Sploop.y]:2707.1158592753254},{"id":224,[Sploop.x]:3546.763829523222,[Sploop.y]:2679.8762554251716},{"id":224,[Sploop.x]:3265.379713427688,[Sploop.y]:2884.726069333624},{"id":224,[Sploop.x]:2752.170958277778,[Sploop.y]:2757.172314205808},{"id":224,[Sploop.x]:2342.000023920623,[Sploop.y]:2541.7259192431193},{"id":224,[Sploop.x]:2393.0000001045064,[Sploop.y]:2546.020440082226},{"id":224,[Sploop.x]:2375.214639614609,[Sploop.y]:2785.050511999293},{"id":224,[Sploop.x]:2011.4663935069682,[Sploop.y]:2678.3053400094395},{"id":224,[Sploop.x]:2319.999998340479,[Sploop.y]:2512.063388541019},{"id":224,[Sploop.x]:1781.5653155460602,[Sploop.y]:2919.7695949555446},{"id":224,[Sploop.x]:1457.9829399058456,[Sploop.y]:2732.69666008065},{"id":224,[Sploop.x]:1121.8816981507593,[Sploop.y]:2643.8009150795624},{"id":224,[Sploop.x]:902.8558665635351,[Sploop.y]:2914.533541069445},{"id":224,[Sploop.x]:617.7088262599689,[Sploop.y]:3000.208332291725},{"id":224,[Sploop.x]:115.76284446446414,[Sploop.y]:2761.1691492848804},{"id":224,[Sploop.x]:443.999174424608,[Sploop.y]:2626.910633614252},{"id":224,[Sploop.x]:401.0006173978146,[Sploop.y]:532.9993392260212}, {"id":"225",[Sploop.x]:146.3497840873793,[Sploop.y]:7519.927999039886},{"id":"225",[Sploop.x]:391.0196308967286,[Sploop.y]:7549.085720093481},{"id":"225",[Sploop.x]:543.1371807981709,[Sploop.y]:7533.976836147818},{"id":"225",[Sploop.x]:697.0531620113139,[Sploop.y]:7550.005525482361},{"id":"225",[Sploop.x]:841.2366989055986,[Sploop.y]:7546.024636082353},{"id":"225",[Sploop.x]:1002.1840190174183,[Sploop.y]:7499.675493417864},{"id":"225",[Sploop.x]:1142.6196506884087,[Sploop.y]:7548.285257450758},{"id":"225",[Sploop.x]:1304.2958114699852,[Sploop.y]:7548.0000001380395},{"id":"225",[Sploop.x]:1461.2890760037862,[Sploop.y]:7504.484162973849},{"id":"225",[Sploop.x]:1599.1268933314354,[Sploop.y]:7552.456685165645},{"id":"225",[Sploop.x]:1759.204500911972,[Sploop.y]:7529.112818068299},{"id":"225",[Sploop.x]:1885.5663898853736,[Sploop.y]:7535.997014384194},{"id":"225",[Sploop.x]:2008.864282123885,[Sploop.y]:7534.011987392109},{"id":"225",[Sploop.x]:2169.451157581377,[Sploop.y]:7508.428652937195},{"id":"225",[Sploop.x]:2321.4119053460654,[Sploop.y]:7524.004600254365},{"id":"225",[Sploop.x]:2445.37679324718,[Sploop.y]:7556.959438438634},{"id":"225",[Sploop.x]:2605.4951406107575,[Sploop.y]:7557.0000001068265},{"id":"225",[Sploop.x]:2745.837252598174,[Sploop.y]:7513.389117185103},{"id":"225",[Sploop.x]:2870.119102149074,[Sploop.y]:7545.351524404612},{"id":"225",[Sploop.x]:3053.1769305206426,[Sploop.y]:7545.000003910216},{"id":"225",[Sploop.x]:3154.026610855043,[Sploop.y]:7492.703531529384},{"id":"225",[Sploop.x]:3241.745184056783,[Sploop.y]:7558.0648618785635},{"id":"225",[Sploop.x]:3452.00226701193,[Sploop.y]:7544.999961196074},{"id":"225",[Sploop.x]:3567.4144062974487,[Sploop.y]:7498.745675591474},{"id":"225",[Sploop.x]:3688.934608223305,[Sploop.y]:7531.10369153833},{"id":"225",[Sploop.x]:3791.186191689511,[Sploop.y]:7520.999459482911},{"id":"225",[Sploop.x]:3906.079096108739,[Sploop.y]:7543.998942932907},{"id":"225",[Sploop.x]:4044.2380426104028,[Sploop.y]:7543.999999992666},{"id":"225",[Sploop.x]:4174.286212080739,[Sploop.y]:7505.998008278797},{"id":"225",[Sploop.x]:4319.522512008703,[Sploop.y]:7537.101396727113},{"id":"225",[Sploop.x]:4433.000000004023,[Sploop.y]:7513.999999995751},{"id":"225",[Sploop.x]:4555.716798990464,[Sploop.y]:7546.0026680826795},{"id":"225",[Sploop.x]:4670.1247637998,[Sploop.y]:7523.046104406854},{"id":"225",[Sploop.x]:4794.617556083352,[Sploop.y]:7555.999791719118},{"id":"225",[Sploop.x]:4941.651040639689,[Sploop.y]:7524.000003661002},{"id":"225",[Sploop.x]:5042.602176094363,[Sploop.y]:7556.0006088283935},{"id":"225",[Sploop.x]:5180.459249490879,[Sploop.y]:7556.00000000101},{"id":"225",[Sploop.x]:5303.000933676377,[Sploop.y]:7501.028451187172},{"id":"225",[Sploop.x]:5419.518179728937,[Sploop.y]:7548.018130776565},{"id":"225",[Sploop.x]:5557.021528601353,[Sploop.y]:7525.360710641226},{"id":"225",[Sploop.x]:5679.548749434651,[Sploop.y]:7558.387682614479},{"id":"225",[Sploop.x]:5817.081907074551,[Sploop.y]:7535.225502179956},{"id":"225",[Sploop.x]:5955.801011406585,[Sploop.y]:7536.998169722631},{"id":"225",[Sploop.x]:6058.068886876112,[Sploop.y]:7503.843014156425},{"id":"225",[Sploop.x]:6182.08285499084,[Sploop.y]:7536.468905493149},{"id":"225",[Sploop.x]:6319.000298599492,[Sploop.y]:7559.223506154572},{"id":"225",[Sploop.x]:6456.0438409023,[Sploop.y]:7559.000001239853},{"id":"225",[Sploop.x]:6593.708873816226,[Sploop.y]:7559.000000000004},{"id":"225",[Sploop.x]:6694.621021783071,[Sploop.y]:7503.922669545933},{"id":"225",[Sploop.x]:6802.017532395823,[Sploop.y]:7543.013844983488},{"id":"225",[Sploop.x]:6939.576139515191,[Sploop.y]:7519.736835652795},{"id":"225",[Sploop.x]:7094.688032200829,[Sploop.y]:7540.085798774424},{"id":"225",[Sploop.x]:7226.998639368321,[Sploop.y]:7522.058989048326},{"id":"225",[Sploop.x]:7387.01121045099,[Sploop.y]:7544.002188008208},{"id":"225",[Sploop.x]:7525.164163912381,[Sploop.y]:7520.477342503655},{"id":"225",[Sploop.x]:7682.63209343086,[Sploop.y]:7520.950333690332},{"id":"225",[Sploop.x]:7819.874119219743,[Sploop.y]:7474.529781602834},{"id":"225",[Sploop.x]:7914.101850271172,[Sploop.y]:7546.273684819922},{"id":"225",[Sploop.x]:8075.163398710387,[Sploop.y]:7523.178479254832},{"id":"225",[Sploop.x]:8243.626299995074,[Sploop.y]:7529.999928226666},{"id":"225",[Sploop.x]:8381.398267091548,[Sploop.y]:7506.778270687802},{"id":"225",[Sploop.x]:8610.0060525894,[Sploop.y]:7529.696290884706},{"id":"225",[Sploop.x]:8770.417583524257,[Sploop.y]:7553.000247702051},{"id":"225",[Sploop.x]:8448.995853929235,[Sploop.y]:7553.000000000004},{"id":"225",[Sploop.x]:8929.703318071148,[Sploop.y]:7552.999999999999},{"id":"225",[Sploop.x]:9044.893738170069,[Sploop.y]:7504.45378526034},{"id":"225",[Sploop.x]:9233.46060143763,[Sploop.y]:7495.997477063163},{"id":"225",[Sploop.x]:9348.000125187058,[Sploop.y]:7541.000685853901},{"id":"225",[Sploop.x]:9572.018260313409,[Sploop.y]:7527.314604546699},{"id":"225",[Sploop.x]:9702.810491263053,[Sploop.y]:7511.700779821693}, ...window.generatePositions(100, 220), ...window.generatePositions(100, 221), ...window.generatePositions(100, 222)];
    Hook.append("flowers", /Date\.now\(\),\w=0;/, `
    if (window.getValue("decorations")) {
      window.decorations.forEach(decoration => {
          if (Math.hypot(window.myX - Number(decoration.${Sploop.x}), window.myY - Number(decoration.${Sploop.y})) < 1500) st(decoration, decoration.id, t, n);
      });
    }
    `);
    Hook.append("itemCounter", /AGE 0.+?\[(\w+)\][,;](\w+)\.\w+\((\w+)\)([,;])/, `window.drawItemBar($4,$3,$2)$5`);
    Hook.replace("removeCheckerForLB", /\w\(\w\.\w+\|\|/, `e(`);
    Hook.replace("coloredLB", /((\w)\.\w+,\w\(\)\.\w+,)(\w\(\)\..{2}),(\w\(\)\.\w+)/, `$1$2.${Sploop.id2} == window.myID ? window.getValue("rainbNick") ? window.hslToHex(window.hue, 80, 50) : window.getValue("nickGradient") ? window.gradient : window.getValue("nickColor") : $3, $2.${Sploop.id2} == window.myID ? window.getValue("nickColor2") : $4`);
    Hook.append("chatMsg", /\.length\)return;/, `window.receiveChatMsg(i);`);
    Hook.append("openWS", /(\w+)\.onopen=\w=>{/, `window.getWS($2),`);
    Hook.replace("LBPos", /width:250/, `width: 260`);
    Hook.replace("biggerLBoard", /250,330/, `260, 330`);
    Hook.replace("scorePos", /\+145/, `\+145`);
    Hook.replace("strokeForScrInLB", /(\),\w\(\)\.\w+,)\w\(\)\..{2}\)/, `$1"#ffffff", "#2D3030")`);
    Hook.insert("changeBiomesColors", /\.5\*\w+;{INSERT}.+?\+\+\)\w=(\w+).+?(\w+),\w\./, `
    $3()[0].$4 = window.getValue("grassColor");
    $3()[1].$4 = window.getValue("snowColor");
    $3()[2].$4 = window.getValue("beachColor");
    $3()[3].$4 = window.getValue("riverColor");
    $3()[4].$4 = window.getValue("desertColor");
    `);
    Hook.append("updateFPS", /const (\w)=\+new Date,.+?3;/, `window.updateFPSCounter($2);`);
    Hook.replace("let", /\);const (\w)=\+/, `);let $1=+`);
    Hook.insert("test", /\w\.\w+,{INSERT}(\w)\),\w+&/, `window.getValue("slowMotion") ? $3 / 3 : `);
    Hook.insert("w", /&.{15}\),\w+\(\w+,{INSERT}(\w)\),\w+/, `window.getValue("slowMotion") ? $3 / 3 : `);
    Hook.replace("transparentDescr", /(\w\.fillStyle=")(#\w+"|\w\(\d+\))(,\w\()/, `$1#0000004D"$3`);
    Hook.insert("addID", /\w+:function\(ARGS{8}{INSERT}\)/, `,id`);
    Hook.insert("addID", /;return this\.\w+\(ARGS{9}{INSERT}\)/, `,id`);
    Hook.insert("addID", /\w+:function\(ARGS{9}{INSERT}\){c/, `,id=false`);
    Hook.replace("removeCheckerForNick", /;(const \w=)\w.\w+\|\|/, `;$1`);
    Hook.replace("coloredNick", /(===(\w\.\w+);.{22}\.\w+,\w\(\)\.\w+,)\w\(\)\.\w+,("#\w+"|\w\(\d+\))/, `$1$2 === ${myID} ? window.getValue("rainbNick") ? window.hslToHex(window.hue, 80, 50) : window.getValue("nickColor") : "#fff", $2 === ${myID} ? window.getValue("nickColor2") : "#404040", undefined, undefined, undefined, undefined, $2`);
    Hook.insert("names", /,{INSERT}\w+:480},\w\./, `name: "mammoth",`);
    Hook.insert("names", /,{INSERT}\w+:480},\w\[/, `name: "dragon",`);
    Hook.insert("names", /,{INSERT}duration:120/, `name: "cow",`);
    Hook.replace("chooseItem", /"Choose item",40,"#fff"/, `"«Choose item»",40,"#fff","#303030"`);
    Hook.replace("addGradient", /(1\*\w\+("px Baloo Paaji"|\w\(\d+\)),)(\w)(\[\w\(\d+\)\]|\.fillStyle)=(\w),/, `
    $1
    window.gradient=$3.createLinearGradient(0, 0, $3.measureText(n).width, 0),
    window.gradient.addColorStop(0, window.getValue("gradient")),
    window.gradient.addColorStop(1, window.getValue("gradient2")),
    $3.fillStyle = id === window.myID && window.getValue("nickGradient") ? window.gradient : $5,
    `);
    Hook.append("hideHPwNicks", /45,0,2.+?\){/, `if (window.getValue("hideHPwNicks")) return;`);
    Hook.append("hideHUD", /==\w+}function \w+\(\w,\w\){/, `if (window.getValue("hideHUD")) return;`);
    Hook.insert("test", /{INSERT}.{12}\w+\[2\]\<<8;\w+=/, `return;`);
    Hook.replace("test", /this.Fl=this.Fl/, "this.Fl=0");
    Hook.replace("test", /.ag=.02/, ".ag=.0");
    Hook.append("someFunction", /login\.hide\(\),\w{2}\(\)}/, `window.someFunction=lt;`);
    const serverList = Hook.match("allPlayers", /\w",\w{2}:\w\?(\w{2}\.\w{2})\[/)[1];
    Hook.replace("defaultData", /(\W\w+>NUMBER{1}\W.+?(\w+)\.(\w+).+?)function/, `$1setInterval(() => {window.allPlayers = ${serverList};window.updatePList();},1000);function`);
    Hook.append("getBoss", /3\)}\w+ \w+\((\w),\w,\w\){/, `window.getBoss($2, ${Bosses}());`)
    Hook.replace("abrScore", /(\w\(\d+\)\+)(\w)(\+\w\(\d+\),)/, `$1window.abbreviateNumber($2)$3`);
    Hook.replace("abrScore", /\+(\w\[\w\]\[0\])/, `+window.abbreviateNumber($1)`);
    Hook.replace("abrScore", /("ranking-score">.{3})(\w)/, `$1window.abbreviateNumber($2)`);
    const weaponList = Hook.match("weaponList", /\?Math\.PI\/2.+?(\w\(\))/)[1];
    Hook.append("Kills", /=1}}function.+?function.{4}(\w).{2}/, `window.getKill($2);`);
    Hook.append('removeEntity', /\;let (\w)=\w.\w+\(\w\).{14}/, `window.removeEntity($2);`);
    Hook.replace("renderItems", /(\(\w+\.\w+\+\w+,\w+\.\w+\+\w+\).+?\w+\(\).+?\w+\.\w+\.\w+\)([,;]))/, `$1window.drawChestHP(...arguments, ${Sploop.map})$2`);
    Hook.replace("defaultData", /(\W\w+>NUMBER{1}\W.+?(\w+)\.(\w+).+?)function/, `$1window.stats=$2;window.sprites = tt();window.weapons=${weaponList};function`);
    Hook.append("getMsg", /0;fu.{10}(\w).{2}/, `window.receiveMsg($2);`);
    Hook.replace("particles", /(0,\w{2}=!1,\w{2}=)!1,/, `$1true,`);
    Hook.replace("grid", /1,(\w{2})=!0/, `1, $1=false`);
    Hook.replace("millMarker", /=false,(\w{2})=!0/, `=false,$1=false`);
    Hook.replace("enablePing", /42.5\),(\w{2})=!1/, `42.5),$1=true`);
    Hook.replace("nativeRender", /(true,\w{2}=)!1/, `$1true`);
    Hook.replace("betterAGEBar", /("AGE 0"|\w\(\d+\)),24,("#fff"|\w\(\d+\))\)\);/, `"«0»",24,"#fff","#303030"));`);
    Hook.replace("betterAGEBar", /("AGE "|\w\(\d+\))\+(\w),\d{2},("#\w+"|\w\(\d+\))/, `"«" + $2 + "»",24,"#fff","#303030"`);
    Hook.replace("ColorMats", /\)\,24,\"\#\w{6}\"\)|\)\,24,\w\(\d{3}\)\)/, `),24,"#AE4D57", "#303030")`);
    Hook.replace("ColorMats", /\)\,24,\"\#\w{6}\"\)|\)\,24,\w\(\d{3}\)\)/, `),24,"#935F3B", "#303030")`);
    Hook.replace("ColorMats", /\)\,24,\"\#\w{6}\"\)|\)\,24,\w\(\d{3}\)\)/, `),24,"#7B7A91", "#303030")`);
    Hook.replace("ColorMats", /\"\",24\,\D{9}|\"\",24\,\w\(\d{3}\)/, `"",24,"#FFD700", "#303030"`);
    Hook.replace('customLoader', /Loading Sploop.io/, `Loading cringe...`);
    Hook.replace("customBar", /20,10,(\w\(\d+\)|"#5D3A37")/, `20,10,"#00000080"`);
    Hook.replace("customBar", /=(\w\(\d{3}\)|"#\w+"),this/, `=window.getValue("rainbBar") ? window.hslToHex(window.hue, 80, 50) : "#fff",this`);
    Hook.replace("customHP", /(,\.18.+?\:).+?\)}/, `$1window.myHPColor)}`);
    Hook.replace("customHP", /(=\.5;\w(\[\w\(\d+\)\]|\.fillStyle)=\w).+?,/, `$1?window.myHPColor : window.getValue("EnemysHPColor"),`);
    Hook.replace("customClan", /"\["/, `"«"`);
    Hook.replace("customClan", /"\]"/, `"»"`);
    Hook.replace("customClan", /("»",\w\(\)\.\w+,)("#\w+"|\w\(\d+\)),("#\w+"|\w\(\d+\))/, `$1window.getValue("rainbClan") ? window.hslToHex(window.hue, 80, 50) : window.getValue("clanColor"),window.getValue("clanColor2")`);
    Hook.append("showFullMats", /10},\w{2}\Dfunction\((\w)\){/, `return $2;`);
    Hook.append("attackAnim", /\+=NUMBER{5}.+?(\w+)=.+?(\w+)=.+?(\w+)=.+?(\w+)=.+?(\w+)=.+?;/, `window.attackAnimation($2, $3, $4, $5, $6);`);
    Hook.replace("showFullGold", /(\w)\>\d{7}.*?\+""/, `window.getValue("LBF")?$1:window.abbreviateNumber($1)`);
    const kawakaa = Hook.match("m", /var.{6}(\w{2})\((\w),(\w)\)&&\w{2}\(.{5}/).slice(1);
    Hook.append("newImg", /(\w).{9}(.{9})."clan_decline"\)\);/, `
    $2[$2.length] = $3("settings"));
    $2[$2.length - 1].src = "https://cdn.glitch.global/80f01abb-e90c-4a7c-8f06-4aab31fdf28a/wasdad-02.png?v=1708708420340";
    $2[$2.length] = $3("list"));
    $2[$2.length - 1].src = "https://cdn.glitch.global/80f01abb-e90c-4a7c-8f06-4aab31fdf28a/absba.png?v=1714327780784";
    $2[$2.length] = $3("yFlower"));
    $2[$2.length - 1].src = "https://cdn.glitch.global/80f01abb-e90c-4a7c-8f06-4aab31fdf28a/yellowFlower.png?v=1714580473155";
    $2[$2.length] = $3("rFlower"));
    $2[$2.length - 1].src = "https://cdn.glitch.global/80f01abb-e90c-4a7c-8f06-4aab31fdf28a/redFlower.png?v=1714579975791";
    $2[$2.length] = $3("berry"));
    $2[$2.length - 1].src = "https://cdn.glitch.global/80f01abb-e90c-4a7c-8f06-4aab31fdf28a/zxc.png?v=1714581353965";
    $2[$2.length] = $3("bigEGG"));
    $2[$2.length - 1].src = "https://cdn.glitch.global/80f01abb-e90c-4a7c-8f06-4aab31fdf28a/bigEGG.png?v=1714650054208";
    $2[$2.length] = $3("miniEGG"));
    $2[$2.length - 1].src = "https://cdn.glitch.global/80f01abb-e90c-4a7c-8f06-4aab31fdf28a/miniEGGpng.png?v=1714650626845";
    $2[$2.length] = $3("ybigEGG"));
    $2[$2.length - 1].src = "https://cdn.glitch.global/80f01abb-e90c-4a7c-8f06-4aab31fdf28a/ybigEGG.png?v=1714757303463";
    `);
    Hook.append("newImg", /1.{4}(\w{2})\((\w).{9}38.5,42.5\)/, `,huebok=$2($3[$3.length - 7], 38.5, 42.5)`);
    Hook.append("newImg", /1.{4}(\w{2})\((\w).{9}38.5,42.5\)/, `,sbnoadnb=$2($3[$3.length - 8], 38.5, 42.5)`);
    Hook.append("newImg", /var.{6}(\w{2})\((\w),(\w)\)&&\w{2}\(.{5}/, `sbnoadnb.$2($3, $4) && window.openMenu(), huebok.$2($3, $4) && window.openPlayersList(),`);
    Hook.append("newImg", /return \w{2}.\w{2}\(\w,\w\)&&\((\w)=!0\),/, `sbnoadnb.${kawakaa[0]}(${kawakaa[1]}, ${kawakaa[2]}) && ($2 = !0), huebok.${kawakaa[0]}(${kawakaa[1]}, ${kawakaa[2]}) && ($2 = !0),`);
    Hook.append("newImg", /\.(\w+)=5,(\w+).(\w+)=\w+.\w+-\w+(\[\w\(\d+\)\]|.width)-11;/ , `sbnoadnb.$2 = 5, sbnoadnb.$4 = $3.$4 - $3.width-11, huebok.$2 = 5, huebok.$4 = sbnoadnb.$4 - sbnoadnb.width-11;`);
    Hook.append("newImg", /0,-50\)}}if\(\w{2}.\w{2}\(\w\),\w{2}.(\w{2})\((\w)\),/, `sbnoadnb.$2($3),huebok.$2($3),`);
    let args = Hook.match("drawEntityInfo", /\.\w+\),\w(\.restore|\w\(\d+\))\(\)}function \w+\((ARGS{3})\){/)[2];
    Hook.append('drawEntityInfo', /EnemysHPColor.+?width,\w\*\w.height\)/, `;try {window.getEntityData(${args}, ${Sploop.map});} catch(err) {};`);
    return Hook.code;
};

window.eval = new Proxy(window.eval, {
    apply(target, _this, args) {
        const code = args[0];
        if (code.length > 100000) {
            args[0] = applyHooks(code);
            window.eval = target;
        }
        return target.apply(_this, args);
    }
});