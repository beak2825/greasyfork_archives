// ==UserScript==
// @name         Celestial Client Remix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A Bloxd.io custom client.
// @author       Blueify
// @match        https://bloxd.io/
// @match        https://staging.bloxd.io/
// @icon         https://cdn.discordapp.com/attachments/1166916383536328785/1173098884352970772/Screenshot_2023-11-11_201538.png?ex=6562b879&is=65504379&hm=bf8c00a507e056a58c5e08fcc0b876a93d8e1e9c75f0727b1c415522a02d2807&
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/491319/Celestial%20Client%20Remix.user.js
// @updateURL https://update.greasyfork.org/scripts/491319/Celestial%20Client%20Remix.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Define Main Menu
    let clientMainMenu;
    clientMainMenu = document.createElement("div");
    clientMainMenu.textContent = "Celestial Client (BETA)";
    clientMainMenu.style.position = "fixed";
    clientMainMenu.style.color = "#ffffff";
    clientMainMenu.style.top = "50%";
    clientMainMenu.style.left = "50%";
    clientMainMenu.style.transform = "translate(-50%, -50%)";
    clientMainMenu.style.zIndex = "10000";
    clientMainMenu.style.borderRadius = "10px";
    clientMainMenu.style.backgroundImage = "url(https://cdn.discordapp.com/attachments/1203712027705479228/1207286217931231252/dream_TradingCard_52.png?ex=661676e8&is=660401e8&hm=282380c2aaa53d004d5a848e0acfe90aed92a7ad763fafe62db5d1594a66fb7c&)";
    clientMainMenu.style.backgroundRepeat = "no-repeat";
    clientMainMenu.style.backgroundSize = "cover";
    clientMainMenu.style.backgroundPosition = "center";
    clientMainMenu.style.boxShadow = "0px 0px 20px rgba(0, 0, 0, 0.5)";
    clientMainMenu.style.fontSize = "24px";
    clientMainMenu.style.height = "600px";
    clientMainMenu.style.width = "500px";
    clientMainMenu.style.textAlign = "center";
    clientMainMenu.style.lineHeight = "50px";
    clientMainMenu.style.visibility = "hidden";
    clientMainMenu.style.opacity = "99%";
    clientMainMenu.style.userSelect = "none";


    // Define Button Elements
    let wkey;
    wkey = document.createElement('div');
    wkey.style.position = "relative";
    wkey.style.color = "#ffffff";
    wkey.textContent = "W";
    wkey.style.top = "0px";
    wkey.style.left = "0px";
    wkey.style.zIndex = "10000";
    wkey.style.fontWeight = "bold";
    wkey.style.borderRadius = "10px";
    wkey.style.backgroundColor = "#66ccff";
    wkey.style.fontSize = "24px";
    wkey.style.height = "50px";
    wkey.style.width = "50px";
    wkey.style.textAlign = "center";
    wkey.style.lineHeight = "50px";
    wkey.style.filter = "blur(1px)";


    let skey;
    skey = document.createElement('div');
    skey.style.position = "relative";
    skey.style.color = "#ffffff";
    skey.textContent = "S";
    skey.style.top = "5px";
    skey.style.left = "50%";
    skey.style.transform = "translateX(-50%)";
    skey.style.zIndex = "10000";
    skey.style.fontWeight = "bold";
    skey.style.borderRadius = "10px";
    skey.style.backgroundColor = "#66ccff";
    skey.style.fontSize = "24px";
    skey.style.height = "50px";
    skey.style.width = "50px";
    skey.style.textAlign = "center";
    skey.style.lineHeight = "50px";
    skey.style.filter = "blur(1px)";

    let akey;
    akey = document.createElement('div');
    akey.style.position = "relative";
    akey.style.color = "#ffffff";
    akey.textContent = "A";
    akey.style.top = "60px";
    akey.style.left = "46.3%";
    akey.style.transform = "translateX(-50%)";
    akey.style.zIndex = "10000";
    akey.style.fontWeight = "bold";
    akey.style.borderRadius = "10px";
    akey.style.backgroundColor = "#66ccff";
    akey.style.fontSize = "24px";
    akey.style.height = "50px";
    akey.style.width = "50px";
    akey.style.textAlign = "center";
    akey.style.lineHeight = "50px";
    akey.style.filter = "blur(1px)";

    let dkey;
    dkey = document.createElement('div');
    dkey.style.position = "relative";
    dkey.style.color = "#ffffff";
    dkey.textContent = "D";
    dkey.style.top = "60px";
    dkey.style.left = "53.7%";
    dkey.style.transform = "translateX(-50%)";
    dkey.style.zIndex = "10000";
    dkey.style.fontWeight = "bold";
    dkey.style.borderRadius = "10px";
    dkey.style.backgroundColor = "#66ccff";
    dkey.style.fontSize = "24px";
    dkey.style.height = "50px";
    dkey.style.width = "50px";
    dkey.style.textAlign = "center";
    dkey.style.lineHeight = "50px";
    dkey.style.filter = "blur(1px)";

    let lmb;
    lmb = document.createElement('div');
    lmb.style.position = "relative";
    lmb.style.color = "#ffffff";
    lmb.textContent = "LMB";
    lmb.style.top = "115px";
    lmb.style.left = "50%";
    lmb.style.transform = "translateX(-50%)";
    lmb.style.zIndex = "10000";
    lmb.style.fontWeight = "bold";
    lmb.style.borderRadius = "10px";
    lmb.style.backgroundColor = "#66ccff";
    lmb.style.fontSize = "18px";
    lmb.style.height = "50px";
    lmb.style.width = "50px";
    lmb.style.textAlign = "center";
    lmb.style.lineHeight = "50px";
    lmb.style.filter = "blur(1px)";

    let rmb;
    rmb = document.createElement('div');
    rmb.style.position = "relative";
    rmb.style.color = "#ffffff";
    rmb.textContent = "RMB";
    rmb.style.top = "115px";
    rmb.style.left = "53.7%";
    rmb.style.transform = "translateX(-50%)";
    rmb.style.zIndex = "10000";
    rmb.style.fontWeight = "bold";
    rmb.style.borderRadius = "10px";
    rmb.style.backgroundColor = "#66ccff";
    rmb.style.fontSize = "18px";
    rmb.style.height = "50px";
    rmb.style.width = "50px";
    rmb.style.textAlign = "center";
    rmb.style.lineHeight = "50px";
    rmb.style.filter = "blur(1px)";

    // Add the elements to the body and the clientMainMenu
    //document.body.appendChild(wkey);
    //document.body.appendChild(skey);
    //document.body.appendChild(akey);
    //document.body.appendChild(dkey);
    //document.body.appendChild(lmb);
    //document.body.appendChild(rmb);
    document.body.appendChild(clientMainMenu);

    // Add Event Listeners for the Keybinds

    document.addEventListener('keydown', function(event) {
        if (event.key === 'w') {
            wkey.style.backgroundColor = "#3366ff";
        }
        if (event.key === 's') {
            skey.style.backgroundColor = "#3366ff";
        }
        if (event.key === 'a') {
            akey.style.backgroundColor = "#3366ff";
        }
        if (event.key === 'd') {
            dkey.style.backgroundColor = "#3366ff";
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'w') {
            wkey.style.backgroundColor = "#66ccff";
        }
        if (event.key === 's') {
            skey.style.backgroundColor = "#66ccff";
        }
        if (event.key === 'a') {
            akey.style.backgroundColor = "#66ccff";
        }
        if (event.key === 'd') {
            dkey.style.backgroundColor = "#66ccff";
        }
    });

    document.addEventListener('mousedown', function(event) {
        if (event.button === 0) {
            lmb.style.backgroundColor = "#3366ff";
        }
        if (event.button === 2) {
            rmb.style.backgroundColor = "#3366ff";
        }
    });

    document.addEventListener('mouseup', function(event) {
        if (event.button === 0) {
            lmb.style.backgroundColor = "#66ccff";
        }
        if (event.button === 2) {
            rmb.style.backgroundColor = "#66ccff";
        }
    });

    // Define Main Menu dragging

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    clientMainMenu.addEventListener('mousedown', function(event) {
        if (event.target.nodeName !== 'INPUT') {
            isDragging = true;
            offsetX = event.clientX;
            offsetY = event.clientY;
        }
    });

    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            const left = event.clientX;
            const top = event.clientY;

            clientMainMenu.style.left = left + "px";
            clientMainMenu.style.top = top + "px";
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'U' || event.key === 'u') {
            clientMainMenu.style.visibility = clientMainMenu.style.visibility === "hidden" ? "visible" : "hidden";
        }
    });

    // Define imputs and main menu text

    let clientheader
    clientheader = document.createElement("div");
    clientheader.textContent = "Made By Blueify";
    clientheader.style.position = "absolute";
    clientheader.style.top = "20px";
    clientheader.style.left = "50%";
    clientheader.style.transform = "translateX(-50%)";
    clientheader.style.fontSize = "15px";
    clientMainMenu.appendChild(clientheader);

    // Create the button element
    const discordbutton = document.createElement("div");
    discordbutton.style.position = "absolute";
    discordbutton.style.top = "60px";
    discordbutton.style.left = "50%";
    discordbutton.style.transform = "translateX(-50%)";
    discordbutton.style.cursor = "pointer";
    discordbutton.style.backgroundColor = "#90a3ff";
    discordbutton.style.color = "#ffffff";
    discordbutton.style.borderRadius = "10px";
    discordbutton.style.height = "25px";
    discordbutton.style.padding = "8px";
    discordbutton.addEventListener("click", function() {
        window.location.href = "https://discord.gg/epDTP8jQtQ";
    });

    // Create the text element
    const discordButtonText = document.createElement("div");
    discordButtonText.textContent = "Join The Discord";
    discordButtonText.style.fontSize = "15px";
    discordButtonText.style.textAlign = "center";
    discordButtonText.style.top = "50%";
    discordButtonText.style.transform = "translateY(-25%)";

    // Append the text element to the button element
    discordbutton.appendChild(discordButtonText);

    // Append the button element to the desired parent element
    clientMainMenu.appendChild(discordbutton);


    let clientsettingstext;
    clientsettingstext = document.createElement("div");
    clientsettingstext.textContent = "- Client Settings -";
    clientsettingstext.style.position = "absolute";
    clientsettingstext.style.top = "120px";
    clientsettingstext.style.left = "50%";
    clientsettingstext.style.transform = "translateX(-50%)";
    clientsettingstext.style.fontSize = "20px";
    clientMainMenu.appendChild(clientsettingstext);

    let clientsettingsinput
    clientsettingsinput = document.createElement("input");
    clientsettingsinput.type = "text";
    clientsettingsinput.placeholder = "Client Background URL";
    clientsettingsinput.style.position = "absolute";
    clientsettingsinput.style.top = "160px";
    clientsettingsinput.style.left = "50%";
    clientsettingsinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(clientsettingsinput);

    clientsettingsinput.addEventListener('input', function() {
        clientMainMenu.style.backgroundImage = `url(${clientsettingsinput.value})`;
    });

    clientsettingsinput.addEventListener('mousedown', function(event) {
        event.stopPropagation();
    });

    let hotbarsettingstext;
    hotbarsettingstext = document.createElement("div");
    hotbarsettingstext.textContent = "- HotBar Settings -";
    hotbarsettingstext.style.position = "absolute";
    hotbarsettingstext.style.top = "220px";
    hotbarsettingstext.style.left = "50%";
    hotbarsettingstext.style.transform = "translateX(-50%)";
    hotbarsettingstext.style.fontSize = "20px";
    clientMainMenu.appendChild(hotbarsettingstext);

    let hotbarmaincolorinput
    hotbarmaincolorinput = document.createElement("input");
    hotbarmaincolorinput.type = "color";
    hotbarmaincolorinput.value = "#3d4b79"
    hotbarmaincolorinput.style.top = "250px";
    hotbarmaincolorinput.style.marginTop = "10px";
    hotbarmaincolorinput.style.position = "absolute";
    hotbarmaincolorinput.style.left = "44%";
    hotbarmaincolorinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(hotbarmaincolorinput);

    hotbarmaincolorinput.addEventListener("input", function() {
        const color = hotbarmaincolorinput.value;
        hotbarmaincolorinput.value = color;
        const hotbars = document.querySelectorAll(".item");

        hotbars.forEach(function(hotbar) {
            hotbar.style.backgroundColor = color;
        });
    });

    let hotbarbordercolorinput;
    hotbarbordercolorinput = document.createElement("input");
    hotbarbordercolorinput.type = "color";
    hotbarbordercolorinput.style.top = "250px";
    hotbarbordercolorinput.value = "#303a59";
    hotbarbordercolorinput.style.marginTop = "10px";
    hotbarbordercolorinput.style.position = "absolute";
    hotbarbordercolorinput.style.left = "56%";
    hotbarbordercolorinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(hotbarbordercolorinput);

    hotbarbordercolorinput.addEventListener("input", function() {
        const color = hotbarbordercolorinput.value;
        hotbarbordercolorinput.value = color;
        const hotbars = document.querySelectorAll(".item");

        hotbars.forEach(function(hotbar) {
            hotbar.style.borderColor = color;
        });
    });

    let hotbarborderradiusinput;
    hotbarborderradiusinput = document.createElement("input");
    hotbarborderradiusinput.type = "range";
    hotbarborderradiusinput.style.top = "280px";
    hotbarborderradiusinput.style.marginTop = "10px";
    hotbarborderradiusinput.style.position = "absolute";
    hotbarborderradiusinput.value = "0";
    hotbarborderradiusinput.style.left = "50%";
    hotbarborderradiusinput.min = "0";
    hotbarborderradiusinput.max = "30";
    hotbarborderradiusinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(hotbarborderradiusinput);

    hotbarborderradiusinput.addEventListener("input", function() {
        const hotbarrounding = hotbarborderradiusinput.value;
        const hotbars = document.querySelectorAll(".item");

        hotbars.forEach(function(hotbar) {
            hotbar.style.borderRadius = hotbarrounding + "px";
        });
    });

    let crosshairsettingstext
    crosshairsettingstext = document.createElement("div");
    crosshairsettingstext.textContent = "- Crosshair Settings -";
    crosshairsettingstext.style.position = "absolute";
    crosshairsettingstext.style.top = "320px";
    crosshairsettingstext.style.left = "50%";
    crosshairsettingstext.style.transform = "translateX(-50%)";
    crosshairsettingstext.style.fontSize = "20px";
    clientMainMenu.appendChild(crosshairsettingstext);

    let crosshairsettingsinput;
    crosshairsettingsinput = document.createElement("input");
    crosshairsettingsinput.type = "text";
    crosshairsettingsinput.placeholder = "Crosshair URL";
    crosshairsettingsinput.style.position = "absolute";
    crosshairsettingsinput.style.top = "360px";
    crosshairsettingsinput.value = "https://cdn.discordapp.com/attachments/1166916383536328785/1175256184907902986/pixel_art_1.png?ex=656a919d&is=65581c9d&hm=39338bcbfb89a25047bf664a5a6e7e910eb885f376044ce18e087d0179398f50&";
    crosshairsettingsinput.style.left = "50%";
    crosshairsettingsinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(crosshairsettingsinput);

    let crosshairurl;

    crosshairsettingsinput.addEventListener('input', function() {
        const crosshair = document.querySelector(".CrossHair");
        if (crosshair) {
            crosshair.style.backgroundImage = `url(${crosshairsettingsinput.value})`;
            crosshairurl = `url(${crosshairsettingsinput.value})`;
        }
    });

    crosshairsettingsinput.addEventListener('mousedown', function(event) {
        event.stopPropagation();
    });

    let keybindsettingstext;
    keybindsettingstext = document.createElement("div");
    keybindsettingstext.textContent = "- Keybind Settings -";
    keybindsettingstext.style.position = "absolute";
    keybindsettingstext.style.top = "420px";
    keybindsettingstext.style.left = "50%";
    keybindsettingstext.style.transform = "translateX(-50%)";
    keybindsettingstext.style.fontSize = "20px";
    clientMainMenu.appendChild(keybindsettingstext);

    setInterval(function() {
        const color1 = hotbarmaincolorinput.value;
        const color2 = hotbarbordercolorinput.value
        const hotbarrounding = hotbarborderradiusinput.value;
        const hotbars = document.querySelectorAll(".item");
        hotbars.forEach(function(hotbar) {
            hotbar.style.borderRadius = hotbarrounding + "px";
            hotbar.style.borderColor = color2;
            hotbar.style.backgroundColor = color1;
        });
        const crosshair = document.querySelector(".CrossHair");
        if (crosshair) {
            crosshair.textContent = "";
            crosshair.style.backgroundImage = crosshairurl; // Use the crosshairurl variable here
            crosshair.style.backgroundRepeat = "no-repeat";
            crosshair.style.backgroundSize = "contain";
            crosshair.style.width = "30px";
            crosshair.style.height = "30px";
        }
    }, 1000);
})();