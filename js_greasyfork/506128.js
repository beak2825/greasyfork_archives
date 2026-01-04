// ==UserScript==
// @name         Matrix Menu V2 | ESP & X-Ray | Wireframe Players&World
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  X-RAY Menu
// @author       Whoami
// @match        *://voxiom.io/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
// @icon         https://media.giphy.com/media/CxYGmxv0Oyz4I/giphy.gif
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506128/Matrix%20Menu%20V2%20%7C%20ESP%20%20X-Ray%20%7C%20Wireframe%20PlayersWorld.user.js
// @updateURL https://update.greasyfork.org/scripts/506128/Matrix%20Menu%20V2%20%7C%20ESP%20%20X-Ray%20%7C%20Wireframe%20PlayersWorld.meta.js
// ==/UserScript==

const originalArrayPush = Array.prototype.push;
const THREE = window.THREE;
const prototype_ = {
    world: {
        wireframe: false,
        visibleOnDamage: true,
        notVisible: true,
        depthFunc: 2
    },
    player: {
        opacity: 0.5,
        wireframe: false
    }
};

Array.prototype.push = function(...args) {
    if (args[0] && args[0].material && args[0].material.type && args[0].material.type === "ShaderMaterial") {
        const material = args[0].material;
        material.opacity = 0;
        material.transparent = prototype_.world.visibleOnDamage;
        material.side = 2;
        material.depthFunc = prototype_.world.depthFunc;
        material.wireframe = prototype_.world.wireframe;
        material.visible = prototype_.world.notVisible;
    }
    if (args[0] && args[0].material && args[0].material.type && args[0].material.type === "MeshBasicMaterial") {
        const material = args[0].material;
        material.opacity = prototype_.player.opacity;
        material.wireframe = prototype_.player.wireframe;
    }
    return originalArrayPush.apply(this, args);
};

const style = document.createElement('style');
style.innerHTML = `
    .menuHeaderText1 {
        font-size: 35px;
        font-weight: 900;
        text-align: center !important;
        animation: rgbAnimation 0.5s infinite alternate;
    }
    .menuItemTitle1 {
        font-size: 18px;
        animation: rgbAnimation 0.5s infinite alternate;
    }
    @keyframes rgbAnimation {
        0% { color: rgb(255, 0, 0); }
        25% { color: rgb(255, 255, 0); }
        50% { color: rgb(0, 255, 0); }
        75% { color: rgb(0, 255, 255); }
        100% { color: rgb(255, 0, 255); }
    }
    .menuItem1:hover img {
        transform: scale(1.1);
    }
    #menuContainer {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #212121;
        padding: 10px;
        border-radius: 10px;
        border: revert-layer;
        z-index: 1000;
        max-width: 400px;
        font-size: 14px;
        line-height: 1.5;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }
    #menuContainer * {
        -webkit-font-smoothing: antialiased;
        font-smoothing: antialiased;
    }
    #menuContainer label {
        color: white !important;
        font-weight: bold;
    }
    .tab {
        display: flex;
        justify-content: space-around;
        margin-bottom: 10px;
    }
    .tab button {
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        padding: 3px 5px;
        width: 100%;
        cursor: pointer;
    }
    .tab button.active {
        background-color: #ccc;
    }
    .tabcontent {
        display: none;
        margin-top: 10px;
    }
    .tabcontent.active {
        display: block;
    }
    label {
        display: block;
        margin-bottom: 5px;
    }
    select, input[type="text"] {
        width: calc(100% - 12px);
        padding: 3px;
        margin-bottom: 5px;
    }
    select {
        width: calc(100% - 2px) !important;
    }
    .header {
        position: relative;
        text-align: center;
    }
    .headerContent {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .header h2 {
        margin: 0;
        position: relative;
        bottom: -100px;
    }
    .headerImage {
        width: 100%;
        height: auto;
        margin-top: -50px;
        border-radius: 10px;
        object-fit: cover;
    }
    @import url(https://fonts.googleapis.com/css2?family=Space+Grotesk:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900&display=swap);
    @import url(https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900&display=swap);
    div div b {
        font-family: Montserrat;
    }
    h2.menuHeaderText1 {
        display: none;
    }
    button.active {
        font-family: Space Grotesk;
    }
    div div button {
        font-family: Space Grotesk;
        background-color: #7300a8;
        border-color: #000000;
        color: #eceff1;
        border-radius: 3px;
    }
    div div label {
        font-family: Montserrat;
    }
    div div select {
        font-family: Space Grotesk;
        background-color: #000000;
        color: #f5f5f5;
        text-decoration: overline;
        border-color: #7300a8;
        border-radius: 3px;
        text-align: center;
        height: 40px;
    }
    div div input {
        background-color: #7300a8;
        border-color: #000000;
        color: #ffffff;
        border-radius: 6px;
    }
    div div div {
        background-color: #000000;
    }
    div.sc-iJKOTD.jqbzkO {
        display: none;
    }
    a.sc-giYglK.bzRdHa {
        display: none;
    }
    img.sc-pVTFL.iRqeFU {
        display: none;
    }
    #menuContainer {
        width: 500px;
    }
    img.sc-ibSMNl.emCBjU {
        display: none;
    }
    div.sc-lbCmg.kLCLJb {
        text-decoration: overline;
        font-family: Montserrat;
    }
    div.sc-bgMUWu.hqpBqs {
        font-family: Montserrat;
    }
    div.sc-ivsNig.kqMamr {
        font-family: Montserrat;
    }
    div.sc-bxYNtK.ekaCUa {
        font-family: Montserrat;
    }
    div.sc-inrDdN.ehvxZP {
        font-family: Montserrat;
        align-items: center;
    }
    div.sc-fBgqEL.ljNuSc {
        background-color: #212121;
    }
    div.sc-ikJyIC.vCrTy {
        background-color: #7300a8;
        opacity: 0.4;
    }
    div.sc-jwrNVz.fVmNa {
        background-color: #7300a8;
        border-radius: 5px;
        height: 50px;
        align-items: center;
        padding-left: 40px;
    }
    div.sc-hnCQzQ.gFCsYN {
        font-family: Montserrat;
    }
    a.sc-cgLTVH.hqKrdE {
        font-family: Montserrat;
    }
`;
document.head.appendChild(style);

const menuContainer = document.createElement('div');
menuContainer.id = 'menuContainer';
document.body.appendChild(menuContainer);

const header = document.createElement('div');
header.innerHTML = `
    <div class="header">
        <h2 class='menuHeaderText1'>WHOAMI CHEATS</h2>
    </div>
    <b>"O" Exit</b>
`;
menuContainer.appendChild(header);

const tab = document.createElement('div');
tab.className = 'tab';
tab.innerHTML = `
    <button class="tablinks active" onclick="openTab(event, 'mainMenu')">Main Menu</button>
    <button class="tablinks" onclick="openTab(event, 'players')">Players</button>
    <button class="tablinks" onclick="openTab(event, 'world')">World</button>
`;
menuContainer.appendChild(tab);

const mainMenu = document.createElement('div');
mainMenu.id = 'mainMenu';
mainMenu.className = 'tabcontent active';
mainMenu.innerHTML = `
    <label for="opacity"><span class='menuItemTitle1'>Opacity:</span></label>
    <select id="opacity">
        <option value="0">0</option>
        <option value="0.1">0.1</option>
        <option value="0.2">0.2</option>
        <option value="0.3">0.3</option>
        <option value="0.4">0.4</option>
        <option value="0.5">0.5</option>
        <option value="0.6">0.6</option>
        <option value="0.7">0.7</option>
        <option value="0.8">0.8</option>
        <option value="0.9">0.9</option>
        <option value="1">1</option>
    </select>
    <button onclick="resetSettings()">Reset to Defaults</button>
`;
menuContainer.appendChild(mainMenu);

const players = document.createElement('div');
players.id = 'players';
players.className = 'tabcontent';
players.innerHTML = `
    <label for="playerOpacity"><span class='menuItemTitle1'>Player Opacity:</span></label>
    <select id="playerOpacity">
        <option value="0">0</option>
        <option value="0.1">0.1</option>
        <option value="0.2">0.2</option>
        <option value="0.3">0.3</option>
        <option value="0.4">0.4</option>
        <option value="0.5">0.5</option>
        <option value="0.6">0.6</option>
        <option value="0.7">0.7</option>
        <option value="0.8">0.8</option>
        <option value="0.9">0.9</option>
        <option value="1">1</option>
    </select>
`;
menuContainer.appendChild(players);

const world = document.createElement('div');
world.id = 'world';
world.className = 'tabcontent';
world.innerHTML = `
    <label for="wireframe"><span class='menuItemTitle1'>World Wireframe:</span></label>
    <select id="wireframe">
        <option value="true">True</option>
        <option value="false" selected>False</option>
    </select>
`;
menuContainer.appendChild(world);

function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
        tabcontent[i].classList.remove('active');
    }
    const tablinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove('active');
    }
    document.getElementById(tabName).style.display = 'block';
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

document.getElementById('opacity').addEventListener('change', function() {
    prototype_.player.opacity = parseFloat(this.value);
});

document.getElementById('playerOpacity').addEventListener('change', function() {
    prototype_.player.opacity = parseFloat(this.value);
});

document.getElementById('wireframe').addEventListener('change', function() {
    prototype_.world.wireframe = this.value === 'true';
});

function resetSettings() {
    prototype_.world.wireframe = false;
    prototype_.player.opacity = 0.5;
    prototype_.world.visibleOnDamage = true;
    prototype_.world.notVisible = true;
    prototype_.world.depthFunc = 2;
    document.getElementById('opacity').value = '0.5';
    document.getElementById('playerOpacity').value = '0.5';
    document.getElementById('wireframe').value = 'false';
}
