// ==UserScript==
// @name         Moomoo.io | Hat Macro & Menu Script
// @version      beta
// @description  HAT MACRO, Menu Key => B (By default, you can change it on the menu!)
// @author       DETIX || Discord => detixthegoat
// @match        *://*.moomoo.io/*
// @namespace https://greasyfork.org/users/684614
// @downloadURL https://update.greasyfork.org/scripts/470361/Moomooio%20%7C%20Hat%20Macro%20%20Menu%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/470361/Moomooio%20%7C%20Hat%20Macro%20%20Menu%20Script.meta.js
// ==/UserScript==

const keys = {};
let SoldierHat = "c",
    TurretHat = "h",
    TankGear = "z",
    BullHelmet = "j",
    BarbarianArmor = "t",
    NoHat = "y",
    //Menu Key
    menuKey = "b"; // by Default

const Equip = (id) => {
    storeEquip(id);
}

function hats() {
    if (keys[SoldierHat.toLowerCase()] === true || keys[SoldierHat.toUpperCase()] === true) {
        Equip(6);
    }
    if (keys[TurretHat.toLowerCase()] === true || keys[TurretHat.toUpperCase()] === true) {
        Equip(53);
    }
    if (keys[TankGear.toLowerCase()] === true || keys[TankGear.toUpperCase()] === true) {
        Equip(40);
    }
    if (keys[BullHelmet.toLowerCase()] === true || keys[BullHelmet.toUpperCase()] === true) {
        Equip(7);
    }
    if (keys[BarbarianArmor.toLowerCase()] === true || keys[BarbarianArmor.toUpperCase()] === true) {
        Equip(26);
    }
    if (keys[NoHat.toLowerCase()] === true || keys[NoHat.toUpperCase()] === true) {
        Equip(0);
    }
}

function handleKeyDown(event) {
    keys[event.key] = true;
    hats();

    if (event.key.toLowerCase() === menuKey || event.key.toUpperCase() === menuKey) {
        const menu = document.getElementById("hatMacroMenu");
        menu.style.display = menu.style.display === "none" ? "block" : "none";
    }
}

function handleKeyUp(event) {
    keys[event.key] = false;
}

const menu = document.createElement("div");
menu.id = "hatMacroMenu";
menu.innerHTML = `<div class="hatMacroMenu-container">
        <h1>Hat Macro Script<sub>By DETIX</sub></h1>
        <div class="hatMacroMenu-input">
            <label for="soldierHatInput">Soldier Hat:</label>
            <input type="text" id="soldierHatInput" value="${SoldierHat}">
        </div>
        <div class="hatMacroMenu-input">
            <label for="turretHatInput">Turret Hat:</label>
            <input type="text" id="turretHatInput" value="${TurretHat}">
        </div>
        <div class="hatMacroMenu-input">
            <label for="tankGearInput">Tank Gear:</label>
            <input type="text" id="tankGearInput" value="${TankGear}">
        </div>
        <div class="hatMacroMenu-input">
            <label for="bullHelmetInput">Bull Helmet:</label>
            <input type="text" id="bullHelmetInput" value="${BullHelmet}">
        </div>
        <div class="hatMacroMenu-input">
            <label for="barbarianArmorInput">Barbarian Armor:</label>
            <input type="text" id="barbarianArmorInput" value="${BarbarianArmor}">
        </div>
        <div class="hatMacroMenu-input">
            <label for="noHatInput">No Hat:</label>
            <input type="text" id="noHatInput" value="${NoHat}">
        </div>
    <div class="hatMacroMenu-input">
        <label for="menuKeyInput">Menu Key:</label>
        <input type="text" id="menuKeyInput" value="${menuKey}">
    </div>
</div>`;
menu.style.position = "absolute";
menu.style.top = "10px";
menu.style.right = "10px";
menu.style.padding = "10px";
menu.style.backgroundColor = "#f9f9f9";
menu.style.border = "1.5px solid #000";
menu.style.borderRadius = "8px";
menu.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
menu.style.zIndex = "9999";
menu.style.display = "none";
menu.style.maxWidth = "300px";

const style = document.createElement("style");
style.innerHTML = `
    .hatMacroMenu-container h1 {
        margin: 0;
        padding: 10px 0;
        text-align: center;
        font-size: 24px;
    }
    .hatMacroMenu-input {
        margin: 15px 0;
        display: flex;
        align-items: center;
    }
    .hatMacroMenu-input label {
        width: 130px;
        font-size: 18px;
    }
    .hatMacroMenu-input input {
        flex: 1;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 16px;
    }`;

document.head.appendChild(style);
document.body.appendChild(menu);

function updateHatKeys() {
    SoldierHat = document.getElementById("soldierHatInput").value;
    TurretHat = document.getElementById("turretHatInput").value;
    TankGear = document.getElementById("tankGearInput").value;
    BullHelmet = document.getElementById("bullHelmetInput").value;
    BarbarianArmor = document.getElementById("barbarianArmorInput").value;
    NoHat = document.getElementById("noHatInput").value;
}

function handleMenuKeyChange(event) {
    menuKey = event.target.value;
    event.target.style.backgroundColor = "#ffcc00";
}
const menuKeyInput = document.getElementById("menuKeyInput");
menuKeyInput.addEventListener("input", handleMenuKeyChange);

menu.addEventListener("input", updateHatKeys);

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);