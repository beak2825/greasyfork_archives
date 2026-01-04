// ==UserScript==
// @name         Kour.io - Weapon Selector (LC MOD MENU)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script allows you to select and equip any secondary weapon in Kour.io.
// @author       LC|K
// @match        *://kour.io/*
// @grant        none
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/527862/Kourio%20-%20Weapon%20Selector%20%28LC%20MOD%20MENU%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527862/Kourio%20-%20Weapon%20Selector%20%28LC%20MOD%20MENU%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const weapons = [
        { name: "AK-47", id: "00" },
        { name: "Deagle", id: "01" },
        { name: "AWP", id: "02" },
        { name: "Bayonet", id: "03" },
        { name: "Uzi", id: "04" },
        { name: "PKM", id: "05" },
        { name: "Revolver", id: "06" },
        { name: "RPG", id: "07" },
        { name: "USPS", id: "08" },
        { name: "MP5", id: "09" },
        { name: "Shotgun", id: "10" },
        { name: "Glock", id: "11" },
        { name: "Karambit", id: "12" },
        { name: "Knife", id: "13" },
        { name: "Scar", id: "14" },
        { name: "Minigun", id: "15" },
        { name: "Famas", id: "16" },
        { name: "Vector", id: "17" },
        { name: "Flamethrower", id: "18" },
        { name: "Kar98k", id: "19" },
        { name: "M4A4", id: "20" },
        { name: "Tec-9", id: "21" },
        { name: "CZ", id: "22" },
        { name: "Berretta92fs", id: "23" },
        { name: "AK-109", id: "24" },
        { name: "P90", id: "25" },
        { name: "Thompson", id: "26" },
        { name: "UMP45", id: "27" },
        { name: "XM1014", id: "28" },
        { name: "Butterfly", id: "29" },
        { name: "Laser Gun", id: "30" },
        { name: "Bomb", id: "31" },
        { name: "Smoke Grenade", id: "32" },
        { name: "Molotov", id: "33" },
        { name: "Grenade", id: "34" },
        { name: "Flashbang", id: "35" },
        { name: "Glizzy", id: "36" },
        { name: "Axe", id: "37" },
        { name: "Bare Fists", id: "38" }
    ];

    const menu = document.createElement("div");
    menu.id = "lcWeaponMenu";
    menu.style.position = "fixed";
    menu.style.top = "50px";
    menu.style.left = "50px";
    menu.style.width = "300px";
    menu.style.maxHeight = "400px";
    menu.style.overflowY = "auto";
    menu.style.backgroundColor = "#222";
    menu.style.color = "#fff";
    menu.style.padding = "15px";
    menu.style.zIndex = "10000";
    menu.style.fontFamily = "Arial, sans-serif";
    menu.style.fontSize = "14px";
    menu.style.borderRadius = "8px";
    menu.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
    menu.style.border = "2px solid #007bff";
    menu.style.display = "block"; // Menu starts visible

    menu.innerHTML = 
        `<strong style="color: #007bff; font-size: 16px;">LC MOD MENU</strong>
        <hr style="border: 1px solid #007bff;">
        <strong>➤ Select Secondary Weapon:</strong>
        <p style="font-size: 12px; color: #ccc;">Press "O" to show/hide menu</p>`;

    weapons.forEach(function(weapon) {
        const btn = document.createElement("button");
        btn.textContent = `${weapon.name} (${weapon.id})`;
        btn.style.display = "block";
        btn.style.width = "100%";
        btn.style.margin = "5px 0";
        btn.style.padding = "5px";
        btn.style.border = "none";
        btn.style.backgroundColor = "#007bff";
        btn.style.color = "#fff";
        btn.style.cursor = "pointer";
        btn.style.borderRadius = "5px";
        
        btn.onclick = function() {
            setSecondaryWeapon(weapon.id);
        };

        menu.appendChild(btn);
    });

    document.body.appendChild(menu);

    function setSecondaryWeapon(weaponID) {
        firebase.database().goOffline();
        firebase.database().ref('users/' + firebase.auth().currentUser.uid).child('overrideWeaponIndexes1').set(weaponID);
        firebase.database().goOnline();
        alert(`Secondary weapon set to: ${weaponID}`);

        setTimeout(function() {
            const reloadMessage = document.createElement("div");
            reloadMessage.textContent = "Please reload your page to apply changes.";
            reloadMessage.style.position = "fixed";
            reloadMessage.style.bottom = "10px";
            reloadMessage.style.left = "50%";
            reloadMessage.style.transform = "translateX(-50%)";
            reloadMessage.style.backgroundColor = "#f44336";
            reloadMessage.style.color = "#fff";
            reloadMessage.style.padding = "10px";
            reloadMessage.style.borderRadius = "5px";
            reloadMessage.style.fontSize = "16px";
            reloadMessage.style.zIndex = "10001";
            document.body.appendChild(reloadMessage);

            setTimeout(function() {
                reloadMessage.remove();
            }, 5000);
        }, 5000);
    }

    document.addEventListener("keydown", function(e) {
        if (e.key.toLowerCase() === "o" && !e.target.matches("input, textarea")) {
            menu.style.display = (menu.style.display === "none" ? "block" : "none");
        }
    });
})();
