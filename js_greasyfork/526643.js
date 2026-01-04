// ==UserScript==
// @name         Advanced Sploop.io script v2.1
// @version      2.1
// @description  -
// @namespace    Auto-push auto place
// @author       renato and i COPYED the whole script LMAO
// @match        https://sploop.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sploop.io
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526643/Advanced%20Sploopio%20script%20v21.user.js
// @updateURL https://update.greasyfork.org/scripts/526643/Advanced%20Sploopio%20script%20v21.meta.js
// ==/UserScript==


const getElem = (id) => {
    return document.getElementById(id);
}

const getValue = (id) => {
    return document.getElementById(id).value;
}

const localResources = {
    arrow: "https://i.imgur.com/jFZXJlt.png",
}

const HTML = {
    menuname: function (name, version) {
        return `
        <div style="display: flex">
          <span class="menu-header">
              <h1> ${name} </h1>
          </span>
          <span class="version-header">
              <h1> ${version} </h1>
          </span>
       </div>
        `
    },
    newline: function (amount) {
        let result = '';
        for (let i = 0; i < amount; i += 1) {
            result += '<br>';
        }
        return result;
    },
    title: function (name, id, id2) {
        return `
        <div class="option-title">
            <div class="holder-title">${name}</div>
                <button id="${id}" class="title-button">
                       <img src=${localResources.arrow} id="${id2}" style="width: 25px; height: 25px;  transform: rotate(0deg); transition: transform 0.3s ease-in-out;"/>
                </button>
        </div>`;
    },
    color: function (id, name, color, id2, state) {
        return `
        <div class="option-color">
        <h1>${name}</h1>
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <input type="color" id="${id}" value="${color}" class="color-style" style="margin-right: 5px;" />
            <input type="checkbox" id="${id2}" style = "margin-bottom: 12.5px;" ${state} />
        </div>
        </div>
        `
    },
    noarrowtitle: function (name) {
        return `
        <div class="option-title">
            <div class="holder-title">${name}</div>
        </div>`;
    },
    checkbox: function (name, id, state) {
        return `
        <div class="new-checkbox-section">
            <h1> ${name} </h1> <input type="checkbox" id="${id}" style = "margin-bottom: 12.5px;" ${state}/>
        </div>`;
    },
    text: function (name, id, value, id2, state) {
        return `
        <div class="option-text-text">
            <h1> ${name} </h1>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <input type="text" id="${id}" class="chats-input" style="width: 225px" value="${value}"/>
                <input type="checkbox" id="${id2}" style = "margin-bottom: 12.5px;" ${state} />
            </div>
        </div>
        `
    },
}

const menu = document.createElement("div");
menu.id = "menu";
menu.style = ' position: absolute; padding: 5px; border-radius: 4px; color: #000; background-color: #2B2B2C; top: 0; left: 0; bottom: 0; right: 0; margin: auto; width: 625px; height: 325px; display: block; ';

const display = document.createElement("div");
display.id = "display";
display.style = ' position: absolute; top: 20px; left: 20px; color: #fff; display: block; font-size: 16.5px; font-family: Cursive; ';

const watermarkD = document.createElement("div");
watermarkD.id = "watermarkD";
watermarkD.style = ' position: absolute; display: none; top: 20px; left: 45%; border-radius: 12px; width: 180px; height: 50px; font-size: 18px; font-family: "Montserrat", sans-serif; font-weight: 900; background-color: rgba(0, 0, 0, 0); color: #fff; border: 5px solid black; align-items: center; text-align: center; padding: 10px; ';

window.addEventListener("DOMContentLoaded", () => {

    display.innerHTML = `
    <div id = "pinginner"> </div> <br>
    <div id = "fpsinner"> </div>
    `;

    document.body.appendChild(display);

    watermarkD.innerHTML = `RXT v1`
    document.body.appendChild(watermarkD);



    menu.innerHTML = `
    <div class="tabs">
    <ul>
    ${HTML.menuname("RXT  ", " version 1")} ${HTML.newline(1)}
    <div class="option-text"><li><a id="#tab1">Combat</a></li></div>
    <div class="option-text"><li><a id="#tab2">Misc</a></li></div>
    <div class="option-text"><li><a id="#tab3">Visual</a></li></div>
    <div class="option-text"><li><a id="#tab4">Chats</a></li></div>
    </ul>
    </div>
    <div class="menu-content">

    <div id="tab1" class="tab-content active">
    <div style = "overflow-y: scroll; height: 305px;">
    <div class="add-holder">
    ${HTML.title("Heal", "heal-arrow", "heal-arrow-rotation")}
    <div id="heal-content" style="display: none;">
    ${HTML.checkbox("Auto heal", "autoheal", "checked")}
    </div> </div> ${HTML.newline(1)}
    <div class="add-holder">
    ${HTML.title("Placing", "placing-arrow", "placing-arrow-rotation")}
    <div id="placing-content" style="display: none;">
    ${HTML.checkbox("Auto place", "autoplace", "checked")}
    ${HTML.checkbox("Placing macro", "placingmacro", "checked")}
    </div> </div> ${HTML.newline(1)}
    <div class="add-holder">
    ${HTML.title("Movement", "movement-arrow", "movement-arrow-rotation")}
    <div id="movement-content" style="display: none;">
    ${HTML.checkbox("Auto push", "autopush", "")}
    ${HTML.checkbox("Path finder", "pathfinder", "")}
    ${HTML.checkbox("Scaffold", "scaffold", "")}
    </div> </div> ${HTML.newline(1)}
    <div class="add-holder">
    ${HTML.title("Hats", "hats-arrow", "hats-arrow-rotation")}
    <div id="hats-content" style="display: none;">
    ${HTML.checkbox("Auto jungle", "autojungle", "checked")}
    ${HTML.checkbox("Auto scuba", "autoscuba", "checked")}
    ${HTML.checkbox("Auto demolist", "autodemolist", "")}
    ${HTML.checkbox("Auto prev hat", "autoprevhat", "")}
    ${HTML.checkbox("Hats macro", "hatsmacro", "checked")}
    </div> </div> ${HTML.newline(1)}
    <div class="add-holder">
    ${HTML.title("Other", "other-arrow", "other-arrow-rotation")}
    <div id="other-content" style="display: none;">
    ${HTML.checkbox("Auto insta", "autoinsta", "checked")}
    ${HTML.checkbox("Auto break trap", "autobreak", "checked")}
    </div> </div>
    </div>
    </div>

    <div id="tab2" class="tab-content">
    <div style = "overflow-y: scroll; height: 305px;">
    <div class="add-holder">
    ${HTML.noarrowtitle("Select")}
    ${HTML.checkbox("Auto pick", "autopick", "")}
    </div> ${HTML.newline(1)}
    <div class="add-holder">
    ${HTML.noarrowtitle("Display")}
    ${HTML.checkbox("Show ping", "showping", "")}
    ${HTML.checkbox("Show fps", "showfps", "")}
    </div>
    </div>
    </div>

    <div id="tab3" class="tab-content">
    <div style = "overflow-y: scroll; height: 305px;">
    <div class="add-holder">
    ${HTML.title("Tracers", "tracers-arrow", "tracers-arrow-rotation")}
    <div id="tracers-content" style="display: none;">
    ${HTML.color("animal-tracer-color", "Animal color", "#518CCC", "animal-tracers", "checked")}
    ${HTML.color("team-tracer-color", "Teammates color", "#8ECC51", "team-tracers", "checked")}
    ${HTML.color("enemy-tracer-color", "Enemies color", "#CC5151", "enemy-tracers", "checked")}
    ${HTML.checkbox("Use lines", "use-lines", "")}
    ${HTML.checkbox("Use rainbow", "use-rainbow", "")} ${HTML.newline(1)}
    ${HTML.color("autopush-tracer-color", "Auto push line", "#6b78c1", "autopushline", "state")}
    </div> </div> ${HTML.newline(1)}
    <div class="add-holder">
    ${HTML.title("Markers", "markers-arrow", "markers-arrow-rotation")}
    <div id="markers-content" style="display: none;">
    ${HTML.color("team-marker-color", "Teammates color", "#518CCC", "team-markers", "checked")}
    ${HTML.color("mine-marker-color", "Mine color", "#8ECC51", "mine-markers", "checked")}
    ${HTML.color("enemy-marker-color", "Enemies color", "#CC5151", "enemy-markers", "checked")}
    </div> </div> ${HTML.newline(1)}
    <div class="add-holder">
    ${HTML.title("Watermark", "watermark-arrow", "watermark-arrow-rotation")}
    <div id="watermark-content" style="display: none;">
    ${HTML.color("fill-mark-color", "Fill color", "#CC5151", "fill-color", "checked")}
    ${HTML.color("stroke-mark-color", "Stroke color", "#FF0000", "stroke-color", "checked")}
    ${HTML.checkbox("Use rainbow", "use-rainbow-mark", "")}
    ${HTML.checkbox("Watermark", "watermark-display", "")}
    </div> </div>
    </div>
    </div>

    <div id="tab4" class="tab-content">
    <div style = "overflow-y: scroll; height: 305px;">
    <div class="add-holder">
    ${HTML.title("Chats", "chats-arrow", "chats-arrow-rotation")}
    <div id="chats-content" style="display: none;">
    ${HTML.text("Kill chat", "kill-chat", "gg you're no match", "killchat", "checked")}
    ${HTML.text("Auto break chat", "auto-break-chat", "", "autobreakchat", "")}
    ${HTML.text("Auto push chat", "auto-push-chat", "", "autopushchat", "checked")}
    </div> </div>
    </div>
    </div>

    </div>
    `;

    document.body.appendChild(menu);

    setInterval(() => {
        if (getElem("watermark-display").checked) {
            getElem("watermarkD").style.display = "block";
        } else {
            getElem("watermarkD").style.display = "none";
        }
        getElem("watermarkD").style.backgroundColor = (getElem("use-rainbow-mark").checked ? `hsl(${hue}, 100%, 50%)` : (getElem("fill-color").checked ? getValue("fill-mark-color") : 'rgba(0, 0, 0, 0)'));
        getElem("watermarkD").style.borderColor = (getElem("use-rainbow-mark").checked ? `hsl(${hue}, 100%, 80%)` : (getElem("stroke-color").checked ? getValue("stroke-mark-color") : 'rgba(0, 0, 0, 0)'));
    }, 0);

    document.addEventListener("keydown", (e) => {
        if (e.keyCode == 27) {
            if (getElem("menu").style.display == "none") {
                getElem("menu").style.display = "block"
            } else {
                getElem("menu").style.display = "none"
            }
        }
    });

    let classesAndStyles = `
::-webkit-scrollbar {
    display: none;
    border-radius: 4px;
    outline: none;
}
.option-title, .title-button:hover {
    cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;
}

.option-color, .option-text-text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.chats-input {
    padding: 5px;
    border: none;
    outline: none;
    text-align: center;
    border-radius: 4px;
    background-color: #3f3f4b;
    color: #fff;
}

.title-button {
    color: #6b78c1;
    border: none;
    outline: none;
    border-radius: 4px;
    width: 100%;
    height: 22.5px;
    background-color: rgba(0,0,0,0);
    text-align: right;
}

.holder-title {
    color: #646fab;
    font-size: 22.5px;
}

.option-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.menu-header h1 {
    font-size: 20px;
    color: #fff;
}

.version-header h1 {
    color: #646fab;
    font-size: 20px;
    margin-left: 5px;
}

.new-checkbox-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.color-style {
    outline: none;
    border: none;
    padding: 0 1px;
    margin: 0;
    height: 24px;
    background-color: #515a88;
    border-radius: 5px;
    cursor: pointer
}

.tab-content h1 {
    color: #515a88;
    font-size: 20px;
}

.tabs {
    position: absolute;
    border-radius: 4px;
    float: left;
    width: 150px;
    height: 315px;
    background-color: #2F2F31;
    padding: 10px;
    margin-right: 5px;
}

.tabs ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.tabs li {
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #36363d;
    border-radius: 4px;
    transition: background-color 0.3s ease-in-out;
}

.tabs a {
    text-decoration: none;
    color: #fff;
    padding: 5px 10px;
    transition: color 0.3s ease-in-out;
}

.tabs li:hover a {
    color: #646fab;
    cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;
}

.tabs li:hover {
    background-color: #28282f;
    color: #646fab;
    cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;
}

.tabs a:hover {
    color: #646fab;
    cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;
}

.menu-content {
    border-radius: 4px;
    float: right;
    width: calc(100% - 150px - 5px);
    padding: 5px;
    background-color: #2F2F31;
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

.add-holder {
    width: 100%;
    padding: 5px;
    color: #fff;
    border-radius: 4px;
    background-color: #36363d;
}

input:checked[type="checkbox"] {
    background: #6b78c1;
}

input[type="checkbox" i] {
    background-color: initial;
    cursor: default;
    appearance: auto;
    box-sizing: border-box;
    margin: 3px 3px 3px 4px;
    padding: initial;
    border: initial;
}

input:checked[type="checkbox"]::after {
    left: 55%;
}

input[type="checkbox"]::after {
    position: absolute;
    content: "";
    width: 15px;
    height: 15px;
    top: 0;
    left: 0;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    transition: 0.4s;
}

input[type="checkbox"] {
    position: relative;
    appearance: none;
    width: 30px;
    height: 15px;
    background: #3f454d;
    border-radius: 8px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;
    top: 4px;
    transition: 0.4s;
}

#cross-promo,
#bottom-wrap,
#google_play,
#game-left-content-main,
#game-bottom-content,
#game-right-content-main,
#right-content,
#left-content,
#settings {
    display: none !important;
}
#main-content {
    background: rgb(54 54 61 / 20%)
}
#homepage {
    background: rgb(65 65 165 / 65%);
}
.nav-button-active {
    color: #6b78c1;
}
.nav-button-text:hover {
    color: #57619a;
}
.dark-blue-button,
.blue-button,
.green-button {
    background-color: #6b78c1;
    box-shadow: inset 0 -5px 0 #57619a;
}
.green-button:hover,
.dark-blue-button:hover,
.blue-button:hover,
#play:hover {
    background-color: #7c8bdd;
    box-shadow: inset 0 -5px 0 #6974b6;
}
.login-button-active,
.dark-blue-button-3-active {
    background-color: #7c8bdd;
    box-shadow: inset 0 5px 0 #6974b6;
}
#server-select {
    background-color: #6b78c1;
    box-shadow: inset 0 -5px 0 #57619a;
}
#server-select:hover {
    background-color: #7c8bdd;
    box-shadow: inset 0 -5px 0 #6974b6;
}
.background-img-play {
    filter: blur(2.5px);
    background: none;
    display: none !important;
}
#play {
    background-color: #6b78c1;
    box-shadow: inset 0 -9px 0 #57619a;
}
#play-text {
    text-align: center;
    position: absolute;
    top: 11px;
    left: 0;
    items-align: center;
    bottom: 0;
    right: 0;
    margin: auto;
}

#logo {
    height: 150px;
}
   `;
    const menuStylesUpdate = document.createElement("style");
    menuStylesUpdate.type = "text/css";
    menuStylesUpdate.innerText = classesAndStyles;
    document.head.appendChild(menuStylesUpdate);

    getElem('ranking-middle-main').style.height = '380px';
    getElem('ranking-ranks-container').style.height = '295px';
    getElem('ranking2-middle-main').style.height = '380px';
    getElem('ranking-rank-container').style.height = '295px';
    getElem('profile-left-main').style.width = '650px';
    getElem('change-username').style.width = '200px';
    document.querySelector('#game-content').style.justifyContent = 'center';
    document.querySelector('#main-content').style.width = 'auto';

    let isArrowRotated = [false, false, false, false, false, false, false, false, false];

    const toggleContent = (index) => {
        const contentEl = getElem(`${["heal", "placing", "hats", "tracers", "markers", "other", "movement", "chats", "watermark"][index]}-content`);
        const arrowEl = getElem(`${["heal", "placing", "hats", "tracers", "markers", "other", "movement", "chats", "watermark"][index]}-arrow-rotation`);

        if (contentEl.style.display === "none") {
            contentEl.style.display = "block";
            contentEl.style.height = "0";
            contentEl.style.overflow = "hidden";
            contentEl.style.transition = "height 0.3s ease-in-out";
            setTimeout(() => {
                contentEl.style.height = contentEl.scrollHeight + "px";
            }, 10);
        } else {
            contentEl.style.height = contentEl.scrollHeight + "px";
            contentEl.style.transition = "height 0.3s ease-in-out";
            setTimeout(() => {
                contentEl.style.height = "0";
                setTimeout(() => {
                    contentEl.style.display = "none";
                }, 300);
            }, 10);
        }

        arrowEl.style.transform = isArrowRotated[index] ? 'rotate(0deg)' : 'rotate(90deg)';
        isArrowRotated[index] = !isArrowRotated[index];
    };

    getElem("heal-arrow").onclick = () => toggleContent(0);
    getElem("placing-arrow").onclick = () => toggleContent(1);
    getElem("hats-arrow").onclick = () => toggleContent(2);
    getElem("tracers-arrow").onclick = () => toggleContent(3);
    getElem("markers-arrow").onclick = () => toggleContent(4);
    getElem("other-arrow").onclick = () => toggleContent(5);
    getElem("movement-arrow").onclick = () => toggleContent(6);
    getElem("chats-arrow").onclick = () => toggleContent(7);
    getElem("watermark-arrow").onclick = () => toggleContent(8);

    const tabs = document.querySelectorAll('.tabs li');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabContents.forEach((content) => {
                content.classList.remove('active');
            });
            tabContents[index].classList.add('active');
        });
    });

    setInterval(() => {
        defaultToggles.autoBreak = getElem("autobreak").checked ? true : false;
        defaultToggles.autoHeal = getElem("autoheal").checked ? true : false;
        defaultToggles.autoPlace = getElem("autoplace").checked ? true : false;
        defaultToggles.autoPush = getElem("autopush").checked ? true : false;
        defaultToggles.autoJungle = getElem("autojungle").checked ? true : false;
        defaultToggles.autoScuba = getElem("autoscuba").checked ? true : false;
        defaultToggles.autoDemolist = getElem("autodemolist").checked ? true : false;
        defaultToggles.autoPrevHat = getElem("autoprevhat").checked ? true : false;
        defaultToggles.autoPick = getElem("autopick").checked ? true : false;
        defaultToggles.autoInsta = getElem("autoinsta").checked ? true : false;
        defaultToggles.teamTracers = getElem("team-tracers").checked ? true : false;
        defaultToggles.animalTracers = getElem("animal-tracers").checked ? true : false;
        defaultToggles.enemyTracers = getElem("enemy-tracers").checked ? true : false;
        defaultToggles.useRainbow = getElem("use-rainbow").checked ? true : false;
        defaultToggles.useLines = getElem("use-lines").checked ? true : false;
        defaultToggles.killChat = getElem("killchat").checked ? true : false;
        defaultToggles.killChatValue = getValue("kill-chat");
        defaultToggles.autoPushChat = getElem("autopushchat").checked ? true : false;
        defaultToggles.autoPushChatValue = getValue("auto-push-chat");
        defaultToggles.autoBreakChat = getElem("autobreakchat").checked ? true : true;
        defaultToggles.autoBreakChatValue = getValue("auto-break-chat");
        defaultToggles.teamMarkers = getElem("team-markers").checked ? true : false;
        defaultToggles.enemyMarkers = getElem("enemy-markers").checked ? true : false;
        defaultToggles.mineMarkers = getElem("mine-markers").checked ? true : false;
        defaultToggles.autoPushLine = getElem("autopushline").checked ? true : false;
        defaultToggles.placingMacro = getElem("placingmacro").checked ? true : false;
        defaultToggles.hatsMacro = getElem("hatsmacro").checked ? true : false;
        defaultToggles.showPing = getElem("showping").checked ? true : false;
        defaultToggles.showFps = getElem("showfps").checked ? true : false;
        defaultToggles.scaffold = getElem("scaffold").checked ? true : false;
    }, []);
});

let frames = 0,
    lastTime,
    lastUpdate = 0,
    frameCount = 0;
window.updateFPSCounter = (currentTime) => {
    const elapsedSeconds = (currentTime - (lastTime || (lastTime = currentTime))) / 1000;
    frameCount++;

    // Define colors for the gradient (lightest to darkest purples)
    const purpleColors = [
        "#d8a9ff", // Lightest purple
        "#bb80ff", // Light purple
        "#9f55ff", // Medium light purple
        "#8a2aff", // Medium purple
        "#7c00cc", // Darker purple
        "#6200b3", // Dark purple
        "#48007a", // Very dark purple
        "#2e0044"  // Deepest purple
    ];

    if (elapsedSeconds >= 1) {
        if (defaultToggles.showFps) {
            // Create the purple gradient string from lightest to darkest
            const gradient = `linear-gradient(to right, ${purpleColors.join(', ')})`;

            // Apply the gradient to the text
            getElem("fpsinner").innerHTML = `Fps: ${Math.round(frameCount / elapsedSeconds)}`;
            getElem("fpsinner").style.background = gradient;
            getElem("fpsinner").style.webkitBackgroundClip = 'text'; // Required for Webkit browsers
            getElem("fpsinner").style.backgroundClip = 'text'; // Required for other browsers
            getElem("fpsinner").style.color = 'transparent'; // Make the text color transparent so the gradient shows

            // Apply a dark glowing effect to the text
            getElem("fpsinner").style.textShadow = "0 0 10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 0, 0, 0.7)";
        } else {
            getElem("fpsinner").innerHTML = '';
        }
        frameCount = 0;
        lastTime = currentTime;
    };
}
let alive = {}
const defaultToggles = {
    autoBreak: true,
    autoHeal: true,
    autoPlace: true,
    autoPush: true,
    autoJungle: true,
    autoScuba: true,
    autoDemolist: true,
    autoPrevHat: false,
    autoInsta: false,
    autoPick: true,
    showPing: true,
    showFps: true,
    teamTracers: false,
    enemyTracers: false,
    animalTracers: false,
    useRainbow: false,
    useLines: false,
    killChatValue: "",
    killChat: false,
    autoBreakChatValue: "",
    autoBreakChat: false,
    autoPushChatValue: "",
    autoPushChat: false,
    teamMarkers: false,
    enemyMarkers: false,
    mineMarkers: false,
    autoPushLine: false,
    placingMacro: false,
    hatsMacro: true,
    scaffold: false,
}

const binds = {
    trap: "KeyF",
    spike: "KeyV",
    wall: "Digit4",
    mill: "Digit6",
    food: "KeyQ",
    platform: "...",
    turret: "...",

    bushHat: "...",
    berserkerHat: "KeyB",
    jungleGear: "...",
    crystalGear: "KeyY",
    spikeGear: "KeyH",
    immunityGear: "KeyI",
    boostHat: "KeyN",
    appleHat: "...",
    scubaGear: "...",
    hood: "KeyT",
    demolist: "KeyC",
}

let color
, colors = {
    stroke: "#303030",
    nobody: "rgba(0, 0, 0, 0)",
    nobodystroke: "rgba(0, 0, 0, 0)",
}

const hats = {
    bushHat: 1,
    berserkerHat: 2,
    jungleGear: 3,
    crystalGear: 4,
    spikeGear: 5,
    immunityGear: 6,
    boostHat: 7,
    appleHat: 8,
    scubaGear: 9,
    hood: 10,
    demolist: 11
}

const packets = {
    item: 0,
    move: 1,
    itemByID: 2,
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
}

const serverPackets = {
    pingServer: 0,
    updateLeaderBoard: 3,
    age_barWmats: 8,
    chooseItem: 14,
    pingUpdate: 15,
    updateClan: 16,
    clanRequest: 17,
    death: 19,
    getKill: 22,
    createClan: 24,
    clanRemove: 27,
    killText: 28,
    attackAnimation: 29,
    updateEntities: 20,
    playerSpawn: 32,
    getMyID: 33,
    spawn: 35,
    itemCount: 36,
}



// Save the original fillRect function
const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;

// Define colors for the gradient (lightest to darkest purples)
const purpleColors = [
    "#d8a9ff", // Lightest purple
    "#bb80ff", // Light purple
    "#9f55ff", // Medium light purple
    "#8a2aff", // Medium purple
    "#7c00cc", // Darker purple
    "#6200b3", // Dark purple
    "#48007a", // Very dark purple
    "#2e0044"  // Deepest purple
];

// Override fillRect
CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
    // Check if fillStyle is the specific color
    if (this.fillStyle === "#a4cc4f") {
        // Create a gradient from lightest to darkest purple for the health bar
        const gradient = this.createLinearGradient(x, y, x + width, y + height);

        // Add each color stop for the purple gradient (starting from lightest to darkest)
        gradient.addColorStop(0, purpleColors[0]);    // Lightest purple
        gradient.addColorStop(0.14, purpleColors[1]); // Lighter purple
        gradient.addColorStop(0.28, purpleColors[2]); // Medium light purple
        gradient.addColorStop(0.42, purpleColors[3]); // Medium purple
        gradient.addColorStop(0.57, purpleColors[4]); // Darker purple
        gradient.addColorStop(0.71, purpleColors[5]); // Dark purple
        gradient.addColorStop(0.85, purpleColors[6]); // Very dark purple
        gradient.addColorStop(1, purpleColors[7]);    // Deepest purple

        // Set the fillStyle to the gradient for the health bar
        this.fillStyle = gradient;

        // Call the original fillRect function (to draw the health bar)
        originalFillRect.call(this, x, y, width, height);

        // Calculate the health percentage
        const healthPercentage = Math.floor((myPlayer.health / myPlayer.maxHealth) * 100);

        // Apply futuristic, aesthetic styling to the health text
        this.font = "18px 'Orbitron', sans-serif";  // Smaller font size for a more subtle effect
        this.textAlign = "center";   // Center the text horizontally
        this.textBaseline = "middle"; // Center the text vertically

        // Create a gradient for the text with the same colors as the health bar
        const textGradient = this.createLinearGradient(x, y, x + width, y + height);
        textGradient.addColorStop(0, purpleColors[0]);    // Lightest purple
        textGradient.addColorStop(0.14, purpleColors[1]); // Lighter purple
        textGradient.addColorStop(0.28, purpleColors[2]); // Medium light purple
        textGradient.addColorStop(0.42, purpleColors[3]); // Medium purple
        textGradient.addColorStop(0.57, purpleColors[4]); // Darker purple
        textGradient.addColorStop(0.71, purpleColors[5]); // Dark purple
        textGradient.addColorStop(0.85, purpleColors[6]); // Very dark purple
        textGradient.addColorStop(1, purpleColors[7]);    // Deepest purple

        // Set the fillStyle to the text gradient
        this.fillStyle = textGradient;

        // Draw the text "HP: X%" (replace X with the calculated health percentage)
        this.shadowColor = "rgba(255, 255, 255, 0.7)"; // Light white glow
        this.shadowBlur = 10;  // Blur the shadow for glow effect
        this.shadowOffsetX = 0;
        this.shadowOffsetY = 0;

        // Draw the health percentage text 20px below the health bar
        this.fillText("health: " + myPlayer.health + "%", x + width / 2, y + height + 20);
    } else {
        // If fillStyle is not the specific color, call the original fillRect function
        originalFillRect.call(this, x, y, width, height);
    }
};



let kh = [1, 12, 9, 19, 20, 15, 8, 17, 16];

let traps = [];
let teammates = [];
let drawpinginner = "game is loading";

let doingInsta = false;
let Entity = new Array();
let drawSyncHit = false;
let genderPing = NaN;
let autoPushing = false;
let myWS,
    weaponInHands = 0,
    ping = 100,
    PI = 3.141592653589793,
    PI2 = 6.283185307179586,
    mouseAngle,
    mouseX,
    mouseY,
    inRiver = false,
    buyed = false,
    myPlayer = { id: null, clown: false, inRiver: false },
    hatReloaded = true;
let drawHitSyncCircle = false;
window.getWS = (websocket) => {
    myWS = websocket;
    websocket.onclose = () => {
        myWS = undefined;
        buyed = false;
    };
};

const toRad = (angle) => {
    while (angle < 0) {
        angle += 360;
    };
    while (angle >= 360) {
        angle -= 360;
    };
    return (angle * Math.PI) / 180;
};
const toDegree = (angle) => {
    return ((angle * 180) / Math.PI);
};
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const formatAge = age => Math.floor(Math.log(1 + Math.max(0, age)) ** 2.4 / 13);

window.receiveMsg = async ({ data }) => {
    const decoded = typeof data === "string" ? JSON.parse(data) : new Uint8Array(data);
    switch (decoded[0]) {
        case serverPackets.attackAnimation:
            for (let i = 1; i < decoded.length; i += 5) {
                const type = decoded[i]
                , id = decoded[i + 1] | decoded[i + 2] << 8
                , weapon = decoded[i + 3];
                let isObject = decoded[i + 4];
            }
            break;
        case serverPackets.playerSpawn:
            break
        case serverPackets.chooseItem:
            if (defaultToggles.autoPick) kh.forEach(id => sendPacket(packets.upgrade, decoded[1].find(id2 => id === id2)));
            break;
        case serverPackets.getMyID:
            myPlayer.id = decoded[1];
            break;
        case serverPackets.pingUpdate:
            ping = decoded[1];
            if (defaultToggles.showPing) {
                // Create a gradient from lightest to darkest purple for the "Ping" text
                var purpleColors = [
                    "#d8a9ff", // Lightest purple
                    "#bb80ff", // Light purple
                    "#9f55ff", // Medium light purple
                    "#8a2aff", // Medium purple
                    "#7c00cc", // Darker purple
                    "#6200b3", // Dark purple
                    "#48007a", // Very dark purple
                    "#2e0044"  // Deepest purple
                ];

                // Join the colors into a CSS gradient string
                var gradient = 'linear-gradient(to right, ' + purpleColors.join(', ') + ')';

                // Set the inner HTML for the ping value
                getElem("pinginner").innerHTML = "Ping: " + ping + "ms";

                // Apply the gradient to the background and clip it to text
                getElem("pinginner").style.background = gradient;
                getElem("pinginner").style.webkitBackgroundClip = 'text'; // For Chrome/Safari
                getElem("pinginner").style.backgroundClip = 'text'; // For Firefox/Other browsers
                getElem("pinginner").style.color = 'transparent'; // Make the text color transparent

                // Apply the dark glowing text effect
                getElem("pinginner").style.textShadow = "0 0 10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 0, 0, 0.7)";
            } else {
                getElem("pinginner").innerHTML = "";
            }

            break;
        case serverPackets.spawn:
            alive = true
            if (!buyed) {
                for (let i = 0; i < 12; i++) sendPacket(packets.hat, i);
                buyed = true;
            };
            break;
        case serverPackets.death:
            alive = false
            break;
        case serverPackets.getKill:
            if (defaultToggles.killChat) {
                let kills = decoded[1][0];
                let killChatValue = defaultToggles.killChatValue;
                let updatedValue = killChatValue.replace('{kills}', kills);
                sendMsg(updatedValue);
            }
            break
        case serverPackets.updateClan: {
            const array_with_ID = [...decoded.slice(2, decoded.length)];
            array_with_ID.splice(array_with_ID.indexOf(myPlayer.id), 1);
            teammates = array_with_ID;
            return;
        }
        case serverPackets.createClan: {
            const array_with_ID = [...decoded.slice(3, decoded.length)];
            array_with_ID.splice(array_with_ID.indexOf(myPlayer.id), 1);
            teammates = array_with_ID;
            break;
        }
        case serverPackets.clanRemove:
            teammates = [];
            break;
        case serverPackets.updateEntities: {
            for (let i = 1; i < decoded.length; i += 19) {
                const newEnemy = {
                    type: decoded[i],
                    id: decoded[i + 1],
                    hat: decoded[i + 11],
                    teamID: decoded[i + 12],
                    x: decoded[i + 4] | decoded[i + 5] << 8,
                    y: decoded[i + 6] | decoded[i + 7] << 8,
                    index: decoded[i + 2] | decoded[i + 3] << 8,
                    health: Math.ceil(decoded[i + 13] / 2.55),
                    angle: decoded[i + 9] * 0.02454369260617026 - PI,
                    broken: decoded[i + 8]
                }
                newEnemy.id === myPlayer.id && Object.assign(myPlayer, newEnemy);
                window.myPlayer = newEnemy;
                if (newEnemy.broken & 2) {
                    if (myPlayer.inTrap && myPlayer.inTrap.index === newEnemy.index) {
                        myPlayer.inTrap = false;
                        clearInterval(hatInterval);
                        hatInterval = setInterval(() => {
                            if (hatReloaded) {
                                clearInterval(hatInterval);
                                equipHat(hats.crystalGear);//puaal
                            };
                        }, 10)
                    };
                    traps = traps.filter(trap => trap.index !== newEnemy.index);
                } else {
                    if (newEnemy.type === 6) {
                        traps.push(newEnemy); // Add enemy trap to the traps array
                    } else if (defaultToggles.autoBreak && newEnemy.id === myPlayer.id && newEnemy.broken !== 16) {
                        // Find a nearby trap to break
                        const trap = traps.find(trap => Math.hypot(myPlayer.x - trap.x, myPlayer.y - trap.y) <= 70 && trap.id !== myPlayer.id && !teammates.includes(trap.id));

                        if (trap && myPlayer.inTrap && trap.index !== myPlayer.inTrap.index) {
                            // If the player is already in a trap but it's not the current trap, update the trap
                            myPlayer.inTrap = trap;
                        }

                        if (!myPlayer.inTrap && trap) {
                            // If the player is not in a trap, assign the trap
                            myPlayer.inTrap = trap;
                            const angle = Math.atan2(trap.y - myPlayer.y, trap.x - myPlayer.x);
                            const prevWeapon = window.stats[Sploop.itemsID][weaponInHands];
                            sendPacket(packets.item, 1);
                            hit(angle);
                            sendPacket(packets.itemByID, prevWeapon);
                            sendPacket(packets.stopAttack);

                            // Function to place the traps with a 25ms delay between each
                            const placeTrapsWithDelay = async (angle) => {
                                const item = 4;
                                const item2 = 7;

                                // Place `7` trap first
                                singlePlace(item2, toRad(toDegree(angle) - 98));
                                await sleep(90); // 25ms delay
                                // Place another `7` trap opposite direction
                                singlePlace(item2, toRad(toDegree(angle) + 98));
                                await sleep(90); // 25ms delay
                                // Place `4` trap after `7`
                                singlePlace(item, toRad(toDegree(angle) + 180));
                            };

                            // Place traps with delay
                            placeTrapsWithDelay(angle);
                        }

                        if (myPlayer.inTrap && trap) {
                            const angle = Math.atan2(trap.y - myPlayer.y, trap.x - myPlayer.x);

                            // If autoDemolist toggle is enabled, equip the appropriate hat
                            if (defaultToggles.autoDemolist) {
                                equipHat(hats.demolist);
                            } else {
                                // Only equip the hat if crystalGear is not already equipped
                                if (myPlayer.hat !== hats.crystalGear) {
                                    equipHat(hats.crystalGear); // Equip crystalGear if it's not already equipped
                                }
                            }

                            const prevWeapon = window.stats[Sploop.itemsID][weaponInHands];
                            sendPacket(packets.item, 1);
                            hit(angle);
                            sendPacket(packets.itemByID, prevWeapon);
                            sendPacket(packets.stopAttack);


                            const item = 4;
                            const item2 = 7;
                            setTimeout(()=>{
                                singlePlace(item, toRad(toDegree(angle) - 98));
                            },90);
                            setTimeout(()=>{
                                singlePlace(item, toRad(toDegree(angle) + 98));
                            },90);
                            setTimeout(()=>{
                                singlePlace(item, toRad(toDegree(angle) + 180));
                            },90);
                        }

                        // If the player is in a trap and there are no nearby traps (within 52 distance)
                        if (myPlayer.inTrap && !traps.find(trap => Math.hypot(myPlayer.x - trap.x, myPlayer.y - trap.y) <= 70)) {
                            // Place a `7` trap when leaving or destroying a trap
                            singlePlace(7, newEnemy); 
                            myPlayer.inTrap = false;
                            clearInterval(hatInterval);  // Clear the previous hat interval

                            // Re-apply the hat logic after the trap is placed
                            hatInterval = setInterval(() => {
                                if (hatReloaded) {
                                    clearInterval(hatInterval);
                                    if (defaultToggles.autoPrevHat) {
                                        // Only re-equip the crystalGear if it's not currently equipped
                                        if (myPlayer.hat !== hats.crystalGear) {
                                            equipHat(hats.crystalGear);  // Re-equip the previous hat if the setting is enabled
                                        }
                                    }
                                };
                            }, 10);  // Check every 10ms if hat reload is finished
                        }
                    }
                }
                window.inTrap = myPlayer.inTrap;
            }

            if (myPlayer.y <= 9000 && myPlayer.y >= 8000) {
                if (defaultToggles.scaffold) {
                    const angle = Math.atan2(myPlayer.y - myPlayer.y2, myPlayer.x - myPlayer.x2);
                    place(8, angle);
                }
            }





            if (defaultToggles.autoScuba) {
                if (myPlayer.y <= 9000 && myPlayer.y >= 8000 && !myPlayer.inRiver) {
                    myPlayer.inRiver = true;
                    if (hatReloaded) {
                        equipHat(hats.scubaGear);
                    } else {
                        clearInterval(hatInterval);
                        hatInterval = setInterval(() => {
                            if (hatReloaded) {
                                clearInterval(hatInterval);
                                equipHat(hats.scubaGear);
                            };
                        }, 10)
                    };
                };
                if ((myPlayer.y >= 9000 || myPlayer.y <= 8000) && myPlayer.inRiver) {
                    myPlayer.inRiver = false;
                    if (hatReloaded) {
                        equipHat(hats.boostHat);
                    } else {
                        clearInterval(hatInterval);
                        hatInterval = setInterval(() => {
                            if (hatReloaded) {
                                clearInterval(hatInterval);
                                equipHat(hats.boostHat);
                            };
                        }, 10)
                    };
                };
            } else {
                myPlayer.inRiver = false;
            };





            if (myPlayer.broken === 128 && !myPlayer.clowned && defaultToggles.autoJungle) {
                myPlayer.clowned = true;
                equipHat(hats.jungleGear);
                setTimeout(() => {
                    myPlayer.clowned = false;
                    equipHat(hats.crystalGear);
                }, 3000)
            };

            let damageCount = 0; // Counter for damage hits between 9 and 14
            let healingSlow = false; // Flag to indicate if healing should be slowed down
            let slowHealingTimer = 0; // Timer for resetting slow healing after 1000ms
            let lastDamage = 0; // Store last damage value
            let doubleHealDisabled = false; // Flag to indicate if double heal is disabled
            let doubleHealFor35Active = false; // Flag for double heal at 35 HP
            let noDelayActive = false; // Flag to track if no-delay healing is active for 62-65 HP range
            let noDelayTimer = null; // Timer to manage the no-delay window for healing
            if(alive){
                // Function to detect damage in the range of 9 to 14
                function handleDamage(damage) {
                    // Check if the damage is between 9 and 14
                    if (damage >= 10 && damage <= 14) {
                        damageCount++;
                    }

                    // If damageCount exceeds 4, slow down healing
                    if (damageCount > 4 && !healingSlow) {
                        healingSlow = true; // Set flag to slow healing
                        slowHealingTimer = Date.now() + 1000; // Set timer for 1000ms to reset healing
                    }

                    // Special check for 65 exact damage to trigger double heal
                    if (damage === 65 && !doubleHealDisabled) {
                        healPlayer(true); // Trigger double heal
                        doubleHealDisabled = true; // Disable special heal
                        setTimeout(() => {
                            doubleHealDisabled = false; // Re-enable special heal after 3000ms
                        }, 3000);
                    }
                }

                let specialHealActive = false;  // Flag to track if special healing is active

                // Function to handle healing logic
                function healPlayer(isDoubleHeal = false) {
                    let delay;

                    // Check if health is exactly 35 and the special heal is not disabled
                    if (myPlayer.health === 35 && !doubleHealFor35Active) {
                        doubleHealFor35Active = true; // Activate double heal for 35 HP
                        healPlayer(true); // Trigger double heal immediately with no delay

                        // Disable double heal for 2000ms
                        setTimeout(() => {
                            doubleHealFor35Active = false; // Re-enable double heal for 35 HP after 2000ms
                        }, 2000);

                        return; // Prevent further healing logic from executing
                    }

                    // Special heal for under 40 health
                    if (myPlayer.health < 40 && !specialHealActive) {
                        specialHealActive = true; // Activate special healing

                        // Initialize the delay counter for each tick
                        let healTickDelay = 10; // Start with 15ms delay
                        let healTickCount = 0;  // Track the number of healing ticks

                        // Function to apply the special healing gradually
                        let healInterval = setInterval(() => {
                            // Heal with the current delay
                            placeFood();  // Heal the player

                            // Increase the delay after each heal
                            healTickCount++;
                            healTickDelay += 5; // Increase by 10ms per heal tick

                            // If delay exceeds a certain limit (e.g., 100ms), stop the special healing
                            if (healTickDelay >= 100 || healTickCount > 10) {
                                clearInterval(healInterval); // Stop healing when the delay gets too high
                                specialHealActive = false; // Deactivate special healing
                            }
                        }, healTickDelay); // Apply healing at the current delay

                        return; // Prevent further healing logic from executing
                    }

                    // If we are in the 62-65 range, and no-delay healing is active, check if myPlayer.hat !== 4
                    if (myPlayer.health >= 62 && myPlayer.health <= 65 && !noDelayActive && myPlayer.hat !== 4) {
                        noDelayActive = true; // Activate no delay healing
                        healPlayer(true); // Trigger double heal immediately with no delay

                        // Set a timer to disable the no-delay healing for 1 second
                        setTimeout(() => {
                            noDelayActive = false; // Disable no-delay healing after 1 second
                        }, 1000);

                        // Set a timer to re-enable no-delay healing every 2 seconds (changed from 3 seconds to 2 seconds)
                        setTimeout(() => {
                            noDelayActive = true; // Re-enable no-delay healing after 2 seconds
                        }, 1000);

                        return; // Prevent further healing logic from executing
                    }

                    // If healing should be slowed down due to constant damage
                    if (healingSlow) {
                        delay = 250; // Slow healing with 170ms delay
                    } else {
                        // Determine the delay based on health ranges
                        if (myPlayer.health >= 62 && myPlayer.health <= 65 && noDelayActive) {
                            delay = -1; // Heal immediately with no delay if in the range 62-65 and no-delay active
                        } else if (myPlayer.health >= 22 && myPlayer.health <= 34) {
                            delay = 40; // Heal with 40ms delay
                        } else {
                            delay = window.pingTime > 100 ? 55 : 80; // Default healing delay based on pingTime
                        }
                    }

                    // If it's been more than 1000ms since we started slow healing, reset the healing speed
                    if (healingSlow && Date.now() > slowHealingTimer) {
                        healingSlow = false; // Reset the slow healing flag
                        damageCount = 0; // Reset the damage counter
                    }

                    // If this is a double heal, trigger twice with no delay
                    if (isDoubleHeal) {
                        // Heal the player twice with no delay
                        setTimeout(() => {
                            placeFood(); // Heal the player
                        }, 0); // Heal immediately

                        setTimeout(() => {
                            placeFood(); // Heal again
                        }, 0); // Heal immediately again
                    } else {
                        // Heal the player with normal delay
                        setTimeout(() => {
                            placeFood(); // Heal the player
                        }, delay);
                    }
                }
                // Logic to trigger the healing process and track damage (this would be triggered where damage is detected in your game loop)
                if (myPlayer.health < 100 && defaultToggles.autoHeal) {
                    let delay;

                    // Determine the delay based on health ranges
                    if (myPlayer.health < 40 && !specialHealActive) {
                        delay = 15; // Start the special heal with 15ms delay when health is below 40
                    } else if (myPlayer.health >= 62 && myPlayer.health <= 65 && !noDelayActive && myPlayer.hat === 4) {
                        delay = 25; // Heal with 35ms delay when no-delay is off and hat is 4
                    } else if (myPlayer.health >= 62 && myPlayer.health <= 65 && noDelayActive) {
                        delay = -1; // Heal immediately with no delay when in the range 62-65 and no-delay is active
                    } else if (myPlayer.health >= 22 && myPlayer.health <= 34) {
                        delay = 25; // Heal with 40ms delay
                    } else {
                        delay = window.pingTime > 100 ? 55 : 80; // Default healing delay based on pingTime
                    }

                    setTimeout(() => {
                        healPlayer(); // Trigger the healing function
                    }, delay);
                }
            }

            break;
        }
    }
}

const encoder = new TextEncoder();
const sendMsg = (text) => {
    return sendPacket(packets.chat, ...encoder.encode(text));
};
const hit = (angle) => {
    const transformedAngle = 65535 * (angle + Math.PI) / (2 * Math.PI);
    sendPacket(packets.hit, 255 & transformedAngle, transformedAngle >> 8 & 255);
};

let placingObject = 0;
let pushingCounts = 0;
let pushingChatCount = 0;

window.getEntityData = (entity, ctx, isTeammate) => {
    const isMe = entity[Sploop.id] === myPlayer.id;
    const entityX = entity[Sploop.x], entityY = entity[Sploop.y], entityAngle = entity[Sploop.angle];

    if (isMe) myPlayer.currentItem = window.weapons[entity[Sploop.currentWeapon]];

    const tracerAngle = (Math.atan2(myPlayer.y2 - entity[Sploop.y], myPlayer.x2 - entity[Sploop.x]) + Math.PI) % (2 * Math.PI);
    const tracerDistance = Math.max(Math.hypot(entity[Sploop.y] - myPlayer.y2, entity[Sploop.x] - myPlayer.x2) / 2, 30);
    const tracerx = myPlayer.x2 + tracerDistance * Math.cos(tracerAngle);
    const tracery = myPlayer.y2 + tracerDistance * Math.sin(tracerAngle);
    let tracerColor;
    if (myPlayer.id != entity[Sploop.id]) {
        if (defaultToggles.useRainbow) {
            if (defaultToggles.teamTracers || defaultToggles.enemyTracers || defaultToggles.animalTracers) {
                tracerColor = `hsl(${hue}, 100%, 50%)`;
            }
        } else {
            if (entity.type != 0) {
                (defaultToggles.animalTracers) ? tracerColor = getValue("animal-tracer-color") : tracerColor = "rgba(0, 0, 0, 0)"
            } else if (entity.type == 0 && !teammates.includes(entity[Sploop.id])) {
                (defaultToggles.enemyTracers) ? tracerColor = getValue("enemy-tracer-color") : tracerColor = "rgba(0, 0, 0, 0)"
            } else {
                (defaultToggles.teamTracers) ? tracerColor = getValue("team-tracer-color") : tracerColor = "rgba(0, 0, 0, 0)"
            }
        }
    } else {
        tracerColor = "rgba(0, 0, 0, 0)";
    }
    if (defaultToggles.useLines) {
        canvas.local.save();
        canvas.local.beginPath();
        canvas.local.globalAlpha = 1;
        canvas.local.lineCap = "round"
        canvas.local.strokeStyle = tracerColor;
        canvas.local.lineWidth = 5;
        canvas.local.moveTo(myPlayer.x2, myPlayer.y2);
        canvas.local.lineTo(entity[Sploop.x], entity[Sploop.y])
        canvas.local.stroke();
        canvas.local.closePath();
        canvas.local.restore();
    } else {
        canvas.local.save();
        canvas.local.beginPath();
        canvas.local.translate(tracerx, tracery);
        canvas.local.rotate(Math.PI / 4);
        canvas.local.rotate(tracerAngle);
        canvas.local.globalAlpha = 1;
        canvas.local.fillStyle = tracerColor;
        canvas.local.moveTo(-12, -12);
        canvas.local.lineTo(12, 12);
        canvas.local.lineTo(25, -25);
        canvas.local.fill();
        canvas.local.closePath();
        canvas.local.restore();
    }

    if (isMe) {
        myPlayer.x2 = entityX;
        myPlayer.y2 = entityY;
        myPlayer.angle2 = entityAngle;
        myPlayer.currentWeapon = entity[Sploop.currentWeapon];
    } else if (!isMe && entity.type === 0 && !teammates.includes(entity[Sploop.id])) {
        const distance = Math.hypot(entityX - myPlayer.x2, entityY - myPlayer.y2);
        const angle = Math.atan2(entityY - myPlayer.y2, entityX - myPlayer.x2); // Angle to enemy (not used for placement)

        let lastPlacedObject = -1; // Track the last object placed to prevent repeated packets
        if (alive) {
            if (distance <= 130) {
                const enemyTrapped = myTraps.find(c => Math.hypot(c[Sploop.y] - entity[Sploop.y], c[Sploop.x] - entity[Sploop.x]) <= 70);

                if (enemyTrapped) {
                    const x = enemyTrapped[Sploop.x] - myPlayer.x;
                    const y = enemyTrapped[Sploop.y] - myPlayer.y;
                    placingObject++;

                    if (placingObject == 15) {
                        // Place traps around the enemy when trapped
                        singlePlace(4, Math.atan2(y, x) + 1.3);
                        singlePlace(4, Math.atan2(y, x) - 1.3);
                        placingObject = 0;
                    } else if (placingObject == 7.5) {
                        singlePlace(4, Math.atan2(y, x) + 2.6);
                        singlePlace(4, Math.atan2(y, x) - 2.6);
                        placingObject = 0;
                    }
                } else {
                    placingObject = 0; // Reset placingObject when no traps are found

                    // Calculate the angle in the enemy's direction
                    const enemyAngle = Math.atan2(entity[Sploop.y] - myPlayer.y, entity[Sploop.x] - myPlayer.x);

                    // Calculate the 50° angle in radians
                    const angle50 = 50 * Math.PI / 180;

                    // Place the main traps
                    singlePlace(7, enemyAngle);
                    setTimeout(() => {
                        singlePlace(7, enemyAngle + angle50); // Place one to the right (+50°)
                    }, 50);
                    setTimeout(() => {
                        singlePlace(7, enemyAngle - angle50); // Place one to the left (-50°)
                    }, 50);
                    const angleBehind = Math.PI; // 180° to reverse direction
                }
            }
        }
        const dsd = myTraps.find(c => myPlayer.id == c[Sploop.id] && Math.hypot(c[Sploop.y] - entity[Sploop.y], c[Sploop.x] - entity[Sploop.x]) <= 70);
        // Ensure lastEquippedHat is defined and stored correctly
        if (typeof lastEquippedHat === "undefined") {
            var lastEquippedHat = myPlayer.hat;
        }


        if (defaultToggles.autoPush && distance <= 170) {
            const enemyTrapped = myTraps.find(c => myPlayer.id == c[Sploop.id] && Math.hypot(c[Sploop.y] - entity[Sploop.y], c[Sploop.x] - entity[Sploop.x]) <= 75);
            if (enemyTrapped && Math.hypot(enemyTrapped[Sploop.y] - myPlayer.y, enemyTrapped[Sploop.x] - myPlayer.x) <= 250) {
                // Ensure the spike belongs to your player
                const nearestSpike = mySpikes.find(c => c[Sploop.id] == myPlayer.id && Math.hypot(c[Sploop.y] - enemyTrapped[Sploop.y], c[Sploop.x] - enemyTrapped[Sploop.x]) <= 140);
                const angle = Math.atan2(entityY - myPlayer.y2, entityX - myPlayer.x2); // Angle to enemy (not used for placement)
                if (nearestSpike) {
                    pushingCounts++;
                    autoPushing = true;
                    nearestSpike.x = nearestSpike[Sploop.x];
                    nearestSpike.y = nearestSpike[Sploop.y];
                    const angleToEnemy = Math.atan2(entity[Sploop.y] - nearestSpike.y, entity[Sploop.x] - nearestSpike.x)
                    let distance = Math.hypot(nearestSpike.x - entity[Sploop.x], nearestSpike.y - entity[Sploop.y]) + 45;
                    const pushPos = {
                        x: nearestSpike.x + (distance * Math.cos(angleToEnemy)),
                        y: nearestSpike.y + (distance * Math.sin(angleToEnemy))
                    };
                    const pushingCount = Math.hypot(myPlayer.x - pushPos.x, myPlayer.y - pushPos.y);
                    let pushingAngle;
                    if (pushingCount > 15) {
                        pushingAngle = Math.atan2(pushPos.y - myPlayer.y, pushPos.x - myPlayer.x);
                    } else {
                        pushingAngle = Math.atan2(entity[Sploop.y] - myPlayer.y, entity[Sploop.x] - myPlayer.x);
                    }
                    const pushAngle = 65535 * (pushingAngle + Math.PI) / (2 * Math.PI);

                    if (entity[Sploop.health] < 95 && distance <= 155) {//nu merge
                        const instaKillAngle = Math.atan2(entity[Sploop.y] - myPlayer.y2, entity[Sploop.x] - myPlayer.x2);
                        const hitAngle = 65535 * (instaKillAngle + PI) / PI2;
                        equipHat(hats.berserkerHat);
                        sendPacket(packets.item, 0);

                        // Adjust the delay based on ping
                        let delayTime = 25;
                        if (ping > 100) {
                            delayTime = 25;  // Halve the delay if ping is over 100
                        }

                        setTimeout(() => {
                            sendPacket(packets.hit, 255 & hitAngle, hitAngle >> 8 & 255);
                        }, delayTime);

                        setTimeout(() => {
                            sendPacket(packets.stopAttack);
                        }, delayTime);

                        setTimeout(() => {
                            if (myPlayer.hat !== 4) {
                                equipHat(hats.crystalGear);
                            }
                        }, 1600);
                    }

                    // Draw purple stroke and fill
                    ctx.save();
                    ctx.beginPath();
                    ctx.lineWidth = 5;
                    ctx.lineCap = "round";
                    ctx.strokeStyle = "#800080"; // Purple stroke color
                    ctx.fillStyle = "#800080";  // Purple fill color
                    ctx.moveTo(myPlayer.x, myPlayer.y);
                    ctx.bezierCurveTo(entity[Sploop.x], entity[Sploop.y], pushPos.x, pushPos.y, nearestSpike.x, nearestSpike.y);
                    ctx.globalAlpha = 0.5;
                    ctx.arc(nearestSpike.x, nearestSpike.y, 8, 0, Math.PI * 2);
                    ctx.fill();  // Fill the circle
                    ctx.stroke(); // Stroke the path
                    ctx.closePath();
                    ctx.restore();

                    if (distance < 41) {
                        sendPacket(packets.stopMove);
                    } else {
                        if (pushingCounts > 6) {
                            sendPacket(packets.move, 255 & pushAngle, pushAngle >> 8 & 255);
                            pushingCounts = 0;
                        }
                    }
                } else {
                    // No nearby spike found, stop pushing
                    autoPushing = false;
                    pushingCounts = 0;  // Reset pushing count
                }
            } else {
                // No enemy trapped or distance too far, stop pushing
                autoPushing = false;
                pushingCounts = 0;  // Reset pushing count
            }
        }
    }}
window.render = (ctx, shit) => {
};

let mySpikes = [];
let myTraps = [];
let myScaffs = [];
window.drawMarkers = (target, id, ctx, step) => {
    const objectID = target[Sploop.id]
    const isSpike = [2, 7, 17].includes(target.type);

    if (isSpike) {
        let isMySpike = myPlayer.id == objectID;
        if (isMySpike && !mySpikes.find(c => c[Sploop.id2] == target[Sploop.id2])) {
            mySpikes.push(target);
        }
    }

    if (myTraps && target.type == 6) {
        let isMyTrap = myPlayer.id == objectID;
        if (isMyTrap && !myTraps.find(c => c[Sploop.id2] == target[Sploop.id2])) {
            myTraps.push(target);
        }
    };

    if (myScaffs && target.type == 9) {
        let isMyScaff = myPlayer.id == objectID;
        if (isMyScaff && !myScaffs.find(c => c[Sploop.id2] == target[Sploop.id2])) {
            myScaffs.push(target);
        }
    };

    let color, strokeColor;
    if (teammates.includes(target[Sploop.id])) {
        if (defaultToggles.teamMarkers) {
            color = getValue("team-marker-color");
            strokeColor = colors.stroke;
        } else {
            color = colors.nobody;
            strokeColor = colors.nobodystroke;
        }
    } else if (objectID === myPlayer.id) {
        if (defaultToggles.mineMarkers) {
            color = getValue("mine-marker-color");
            strokeColor = colors.stroke;
        } else {
            color = colors.nobody;
            strokeColor = colors.nobodystroke;
        }
    } else {
        if (defaultToggles.enemyMarkers) {
            color = getValue("enemy-marker-color");
            strokeColor = colors.stroke;
        } else {
            color = colors.nobody;
            strokeColor = colors.nobodystroke;
        }
    }

    if (![21, 30, 40, 31, 32, 33, 34, 35, 38, 39, 1, 3, 4, 5, 9].includes(target.type)) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 10;
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

};

let weaponReloading = false;
window.attackAnimation = (type, id, weapon, isObject, entity) => {
    try {
        const entityID = entity[Sploop.id];
        entityID == myPlayer.id && (weaponReloading = true);
        setTimeout(function () {
            entityID == myPlayer.id && (weaponReloading = false);
        }, window.weapons[window.stats[Sploop.itemsID][weaponInHands]].reload)
    } catch (err) { }
};

const checkChanges = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    return keys2.some(key => !keys1.includes(key)) || keys1.some(key => !keys2.includes(key));
};

const changeSettings = (key, value) => {
    let newSettings = JSON.parse(localStorage.settings);
    newSettings[key] = value;
    localStorage.setItem("settings", JSON.stringify(newSettings));
};

const sendPacket = (packetID, ...values) => {
    return myWS.send(new Uint8Array([packetID, ...values]));
}

let mouseAngle2;
window.addEventListener("mousemove", ({ pageX, pageY }) => {
    mouseX = pageX;
    mouseY = pageY;
    mouseAngle = 65535 * (Math.atan2(mouseY - innerHeight / 2, mouseX - innerWidth / 2) + PI) / PI2;
    mouseAngle2 = Math.atan2(mouseY - innerHeight / 2, mouseX - innerWidth / 2);
});

let hatInterval;
const equipHat = (id) => {
    if (hatReloaded) {
        hatReloaded = false;
        setTimeout(() => {
            hatReloaded = true;
        }, 1300);
        if (myPlayer.hat !== id) {
            myPlayer.prevHat = myPlayer.inRiver && myPlayer.hat === hats.scubaGear ? id : myPlayer.hat;
            sendPacket(packets.hat, id);
        };
    };
};

let _isKeyDown = false, _intervalId;

const checkChat = () => !getElem("chat-wrapper").style.display || getElem("chat-wrapper").style.display === "none";

let repeater = (key, action) => ({
    start(keycode) {
        if (keycode === key && !_isKeyDown) {
            _isKeyDown = true;
            placingItem = true;
            _intervalId = setInterval(() => {
                action();
                !_isKeyDown && (clearInterval(_intervalId), _intervalId = undefined);
            }, 25);
        }
    },
    stop(keycode) {
        if (keycode === key) {
            _isKeyDown = false;
            placingItem = false;
        };
    }
});

const changeAngle = (angle, isTransformed = false) => {
    if (isTransformed) {
        sendPacket(packets.angle, 255 & angle, angle >> 8 & 255);
        return;
    } else {
        const angle2 = 65535 * (angle + Math.PI) / (2 * Math.PI);
        sendPacket(packets.angle, 255 & angle2, angle2 >> 8 & 255);
    }
};

let placingItem = false;
const canvas = {
    local: undefined,
}

window.addEventListener("DOMContentLoaded", event => {
    canvas.local = getElem("game-canvas").getContext("2d");
});

const prevRect = CanvasRenderingContext2D.prototype.clearRect;
CanvasRenderingContext2D.prototype.clearRect = function (x, y, width, height) {
    if (this.canvas.id === "game-canvas") {
        canvas.local = this.canvas.getContext("2d");
    }
    return prevRect.apply(this, arguments);
}

const { fillRect } = CanvasRenderingContext2D.prototype;
CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
    if (placingItem && this.fillStyle === "#a4cc4f") {
        //drawPredict('place');
    };
    return fillRect.apply(this, arguments);
}

const place = (itemID) => {
    sendPacket(packets.item, weaponInHands);
    sendPacket(packets.item, itemID);
    sendPacket(packets.hit, 255 & mouseAngle, mouseAngle >> 8 & 255);
    sendPacket(packets.stopAttack);
    sendPacket(packets.item, weaponInHands);
};

const singlePlace = (itemID, preAngle) => {
    const back = mouseAngle;
    const angle = 65535 * (preAngle + Math.PI) / (2 * Math.PI);
    sendPacket(packets.item, weaponInHands);
    sendPacket(packets.item, itemID);
    sendPacket(packets.hit, 255 & angle, angle >> 8 & 255);
    changeAngle(back, true);
    sendPacket(packets.stopAttack);
    sendPacket(packets.item, weaponInHands);
};

const placeFood = () => {
    sendPacket(packets.item, weaponInHands);
    sendPacket(packets.item, 2);
    const healAngle = 65535 * (myPlayer.angle + PI) / PI2;
    sendPacket(packets.hit, 255 & healAngle, healAngle >> 8 & 255);
    sendPacket(packets.stopAttack);
    sendPacket(packets.item, weaponInHands);
};

const placeByKey = (key, itemID) => repeater(binds[key], () => place(itemID), itemID);
const placement = {
    trap: placeByKey("trap", 7),
    spike: placeByKey("spike", 4),
    wall: placeByKey("wall", 3),
    mill: placeByKey("mill", 5),
    QHold: placeByKey("QHeal", 2),
    platform: placeByKey("platform", 8),
    turret: placeByKey("turret", 10)
};

let copyMove = 0;
document.addEventListener("keydown", event => {
    if (event.repeat || !checkChat()) return;
    const pressedKey = event.code;
    if (defaultToggles.placingMacro) {
        if (Object.values(binds).includes(pressedKey)) Object.values(placement).forEach(action => action.start(pressedKey));
    }
    if (["KeyW", "KeyA", "KeyS", "KeyD"].includes(pressedKey)) {
        if (pressedKey === "KeyW") copyMove |= 1;
        if (pressedKey === "KeyA") copyMove |= 4;
        if (pressedKey === "KeyS") copyMove |= 2;
        if (pressedKey === "KeyD") copyMove |= 8;
    }

    switch (pressedKey) {
        case "Digit1": weaponInHands = 0; break;
        case "Digit2": weaponInHands = 1; break;
        case binds.bushHat: if (defaultToggles.hatsMacro) equipHat(hats.bushHat); break;
        case binds.berserkerHat: if (defaultToggles.hatsMacro) equipHat(hats.berserkerHat); break;
        case binds.jungleGear: if (defaultToggles.hatsMacro) equipHat(hats.jungleGear); break;
        case binds.crystalGear: if (defaultToggles.hatsMacro) equipHat(hats.crystalGear); break;
        case binds.spikeGear: if (defaultToggles.hatsMacro) equipHat(hats.spikeGear); break;
        case binds.immunityGear: if (defaultToggles.hatsMacro) equipHat(hats.immunityGear); break;
        case binds.boostHat: if (defaultToggles.hatsMacro) equipHat(hats.boostHat); break;
        case binds.appleHat: if (defaultToggles.hatsMacro) equipHat(hats.appleHat); break;
        case binds.scubaGear: if (defaultToggles.hatsMacro) equipHat(hats.scubaGear); break;
        case binds.hood: if (defaultToggles.hatsMacro) equipHat(hats.hood); break;
        case binds.demolist: if (defaultToggles.hatsMacro) equipHat(hats.demolist); break;
    };
});

document.addEventListener("keyup", event => {
    if (!checkChat()) return;
    const pressedKey = event.code;
    if (["KeyW", "KeyA", "KeyS", "KeyD"].includes(pressedKey)) {
        if (pressedKey === "KeyW") copyMove &= -2;
        if (pressedKey === "KeyA") copyMove &= -5;
        if (pressedKey === "KeyS") copyMove &= -3;
        if (pressedKey === "KeyD") copyMove &= -9;
    };
    if (Object.values(binds).includes(pressedKey)) Object.values(placement).forEach(action => action.stop(pressedKey));
});

let objectsCounts = {
    limit: 0,
    count: 0,
}

const hasCount = (type) => {
    return objectsCounts.count < objectsCounts.limit;
}

const maxObjCount = [0, 0, 0, 100, 30, 8, 2, 12, 32, 1, 2];
window.drawItemBar = (ctx, imageData, index) => {
    const limit = maxObjCount[window.weapons[window.stats[Sploop.itemsID][index]][Sploop.weaponID2]];
    const crntCount = window.stats[Sploop.objCount][window.weapons[window.stats[Sploop.itemsID][index]][Sploop.weaponID2]];
    objectsCounts.limit = limit;
    objectsCounts.count = crntCount;
    if (limit == 0) return;
    const text = `${crntCount}/${limit}`;
    ctx.save();
    ctx.font = "900 20px Montserrat";
    ctx.fillStyle = "#fff";
    ctx.fillText(text, imageData[Sploop.x] + imageData.width - ctx.measureText(text).width - 10, imageData[Sploop.y] + 25);
    ctx.strokeStyle = "#000";
    ctx.strokeText(text, imageData[Sploop.x] + imageData.width - ctx.measureText(text).width - 10, imageData[Sploop.y] + 25);
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
    }

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
        }

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

let Sploop;
const applyHooks = code => {
    const Hook = new Regex(code, true);
    window.COPY_CODE = (Hook.COPY_CODE.match(/^(\(function \w+\(\w+\)\{.+)\(.+?\);$/) || [])[1];
    Hook.append("EXTERNAL fix", /\(function (\w+)\(\w+\)\{/, "let $2 = eval(`(() => ${COPY_CODE})()`);delete window.COPY_CODE;console.log(1);");
    const myData = Hook.match('myPlayer', /=(\w.get\(\w{2}\));\w&&\w\(\)/)[1];
    const X = Hook.match('playerX', /\{this\.(\w{2})=\w\|\|0/)[1];
    const Y = Hook.match('playerY', /,this\.(\w{2})=\w\|\|0\}/)[1];
    const ID = Hook.match('ID', /&&\w{2}===\w\.(\w{2})\){/)[1];
    const ID2 = Hook.match('ID2', /-1!==\w+\.(\w+)&&/)[1];
    const currentWeapon = Hook.match("crntWeapon", /,\w.(\w{2})===/)[1];
    const angle = Hook.match("angle", /;\w.(\w{2})=\w\(\)/)[1];
    const weaponName = Hook.match("wpnName", /(\w{2}):"XX/)[1];
    const health = Hook.match("health", /(\w{2})<<8;/)[1];
    const weaponDamage = Hook.match("wpnDamage", /(\w{2}):32,reload:300/)[1];
    const teamID = Hook.match('test', /,\w=\w.(\w{2})\|.+?\<\<8/)[1];
    const radius = Hook.match("radius", /(\w{2}):220/)[1];
    const [, currentItem, hat] = Hook.match("hat", /\(\w+\.(\w+)\|\w+\.(\w+)<<NUMBER{8}\)/);
    const inWhichObject = Hook.match("iwo", /110\).+?,1===\w.(\w{2})&&!\w{2}/)[1];
    const weaponID = Hook.match('el', /(\w{2}):0,\w{2}:22,reload:150/)[1];
    const itemsID = Hook.match("IDs", />1\){.{3}(\w{2})/)[1];
    const weaponID2 = Hook.matchAll('el', /,(\w+):9,\w+:2/)[1][1];
    const objCount = Hook.match("objCount", /\),this.(\w{2})=\w\):/)[1];
    const size = Hook.match("size", /\.(\w{2})\+50/)[1];
    const objQuantity = Hook.match("Quantity", /\),this.(\w{2})=\w\):/)[1];
    const itemBar = Hook.match("defaultData", /(\W\w+>NUMBER{1}\W.+?(\w+)\.(\w+).+?)function/)[3];
    Sploop = {
        myPlayer: {
            myData: myData,
            x: `${myData}.${X}`,
            y: `${myData}.${Y}`,
            id: `${myData}.${ID}`,
            teamID: `${myData}.${teamID}`,
            angle: `${myData}.${angle}`
        },
        x: X,
        y: Y,
        id: ID,
        id2: ID2,
        hat: hat,
        type: 'type',
        angle: angle,
        health: health,
        radius: radius,
        teamID: teamID,
        itemsID: itemsID,
        temBar: itemBar,
        objCount: objCount,
        weaponID: weaponID,
        weaponID2: weaponID2,
        weaponName: weaponName,
        objQuantity: objQuantity,
        weaponDamage: weaponDamage,
        currentWeapon: currentWeapon,
        inWhichObject: inWhichObject
    };
    Hook.append("itemCounter", /AGE 0.+?\[(\w+)\][,;](\w+)\.\w+\((\w+)\)([,;])/, `window.drawItemBar($4,$3,$2)$5`);
    Hook.replace("blockMouse", /\|\|(\w+\(\w+\(\)\)\))/, `||!window.inTrap && $1;`);
    Hook.append("renderer", /1}function \w+\((\w),(\w)\){/, `window.render($2, $3);`);
    Hook.replace("grid", /1,(\w{2})=!0/, `1, $1=window.grid`);
    Hook.replace("grid", /,\w{2}(&&\w+\(\w,)/, `,window.grid$1`);
    Hook.append("updateFPS", /const (\w)=\+new Date,.+?3;/, `window.updateFPSCounter($2);`);
    Hook.replace("renderItems", /(\(\w+\.\w+\+\w+,\w+\.\w+\+\w+\).+?\w+\(\).+?\w+\.\w+\.\w+\)([,;]))/, `$1window.drawMarkers(...arguments)$2`);
    const args = Hook.match("drawEntityInfo", /-NUMBER{50},.+?function \w+\((ARGS{3})\)\{/)[1];
    Hook.append('drawEntityInfo', /=.5;/, `try {window.getEntityData(${args});} catch(err) {};`)
    Hook.append("getMsg", /0;fu.{10}(\w).{2}/, `window.receiveMsg($2);`);
    Hook.append("getWS", /(\w{2})=new \w{2}\("".{31}/, `,window.getWS($2)`);
    const weaponList = Hook.match("weaponList", /\?Math\.PI\/2.+?(\w\(\))/)[1];
    Hook.replace("defaultData", /(\W\w+>NUMBER{1}\W.+?(\w+)\.(\w+).+?)function/, `$1window.stats=$2;window.weapons = ${weaponList};window.sprites = tt();function`);
    Hook.append('attackReload', /\+=NUMBER{5}.+?(\w+)=.+?(\w+)=.+?(\w+)=.+?(\w+)=.+?(\w+)=.+?;/, `window.attackAnimation($2, $3, $4, $5, $6);`)
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
