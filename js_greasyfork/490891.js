// ==UserScript==
// @name         DOGEWARE KRUNKER.IO RAPID FIRE & SPEED
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  KRUNKER.IO RAPID FIRE, SPEED, RELOAD, AND NO DISCONNECT BY DOGEWARE
// @author       DOGEWARE
// @match       *://krunker.io/*
// @match        *://browserfps.com/*
// @icon         https://media.giphy.com/media/CxYGmxv0Oyz4I/giphy.gif
// @grant        none
// @antifeature  ads
// @downloadURL https://update.greasyfork.org/scripts/490891/DOGEWARE%20KRUNKERIO%20RAPID%20FIRE%20%20SPEED.user.js
// @updateURL https://update.greasyfork.org/scripts/490891/DOGEWARE%20KRUNKERIO%20RAPID%20FIRE%20%20SPEED.meta.js
// ==/UserScript==

const amount = 1.112 //USE THE RECOMMENDED SETTINGS FOR MAXIMUM ANONYMITY, BUT CONSIDER REDUCING THEM IF YOU EXPERIENCE LAG. ANYTHING ABOVE A VALUE OF 2 WILL BE DETECTED INSTANTLY
const originalNow = Date.now.bind(Date);
const urlParams = new URLSearchParams(window.location.search);
let key = urlParams.get('key');
const Start = ["H7", "J6", "P9", "H8"];
const End = ["BJ8", "C8Y", "PLOG", "C149"];
const x = 6
let usedKey = localStorage.getItem('key')
const c = document.addEventListener
const alertMsg = `⚠️ Invalid Key Alert ⚠️

This script now requires our license key for activation. To obtain the key, please visit our official page at dogescripts.pages.dev. This process only takes a few seconds and needs to be done once a day.

🛑 Please Note: The site is currently in the testing phase, and your cooperation is highly appreciated. Thank you for your understanding!
`
const ChanceToReload = Math.floor(Math.random() * 8) + 1;
if(key !== null){
    localStorage.setItem('key',key)
}
if(localStorage.getItem('key') === null){
    alert(alertMsg)
    location.href = `https://dogescripts.pages.dev/games/?script=${location.hostname}`
    return;
}else{
    console.log(ChanceToReload)
    if(ChanceToReload === x){
        alert(alertMsg, usedKey)
        location.href = `https://dogescripts.pages.dev/games/?script=${location.hostname}`
        return
    }
}
let isValidKey = false;
switch (isValidKey){
    case true:
        alert("Dont Modify This Script")
        return
    case null:
        alert("Dont Modify This Script")
        return
}

try{
    for (const startStr of Start) {
        if (key.startsWith(startStr)) {
            for (const endStr of End) {
                if (key.endsWith(endStr)) {
                    isValidKey = true;
                    break;
                }
            }
            break;
        }
    }
}catch{isValidKey = true}
if (isValidKey) {
    let options = {
        SpeedHack: true
    }
    class KrunkerScript {
        constructor(author) {
            this.div = document.createElement('div');
            this.div.innerHTML = `<div class="Menuid"><h1 class="logofor4">${author}</h1><br><span id="speedHackText" style="font-weight: 650; display: inline;">[H]Speed<p id="uinfoy" style="font-weight: 800 !important;color: ${options.SpeedHack ? "lime" : "red"} !important;display: inline;">[${options.SpeedHack ? "ON" : "OFF"}]</p></span><br><input id="valamo" value='${amount}' placeHolder="*ChangeSpeed"><p style="font-weight: 550;">[O]Hide</p></div>
<style>.Menuid lebal{font-size: 11px;font-weight: 440;}.Menuid input{width: 100%;text-align: center;margin: auto;background-color: transparent;outline: none;border: none;height: 28px;font-size: 19px;color: white;font-weight: 600;}.Menuid {position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);width: 165px;z-index: 9999;background: linear-gradient(to bottom, #101010, #181818);font-family: monospace;border-radius: 10px;color: white;text-align: center;display: block;}.Menuid * {color: white;font-family: monospace;text-transform: uppercase;}.logofor4 {font-size: 26px;font-weight: bold;margin-bottom: 2px;animation: rgbAnimation 0.5s infinite alternate;}@keyframes rgbAnimation {0% {color: rgb(255, 0, 0);}25% {color: rgb(255, 255, 0);}50% {color: rgb(0, 255, 0);}75% {color: rgb(0, 255, 255);}100% {color: rgb(255, 0, 255);}}</style>`;

            this.isVisible = true;
            document.body.appendChild(this.div);

            this.storage("DG");

            c('keydown', (event) => {
                if (event.key === 'h' || event.key === 'H') {
                    this.toggleSpeedHack();
                }
            });

            c('keydown', (event) => {
                if (event.key === 'o' || event.key === 'O') {
                    this.togglePopup();
                }
            });
        }

        storage(name) {
            if (localStorage.getItem(name) === null) {
                localStorage.setItem(name, JSON.stringify(options));
            } else {
                options = JSON.parse(localStorage.getItem(name));
            }

            const speedHackText = document.getElementById('speedHackText');
            const uinfoyText = document.getElementById('uinfoy');
            if (options.SpeedHack) {
                speedHackText.innerHTML = '[H]Speed<p id="uinfoy" style="font-weight: 800 !important;color: lime !important;display: inline;">[ON]</p>';
                setTimeout(function(){
                    Date.now = () => originalNow() * document.getElementById('valamo').value;
                },5000)
            } else {
                speedHackText.innerHTML = '[H]Speed<p id="uinfoy" style="font-weight: 800 !important;color: red !important;display: inline;">[OFF]</p>';
            }
        }

        toggleSpeedHack() {
            options.SpeedHack = !options.SpeedHack;
            const speedHackText = document.getElementById('speedHackText');
            const uinfoyText = document.getElementById('uinfoy');
            if (options.SpeedHack) {
                speedHackText.innerHTML = '[H]Speed<p id="uinfoy" style="font-weight: 800 !important;color: lime !important;display: inline;">[ON]</p>';
                Date.now = () => originalNow() * document.getElementById('valamo').value;
            } else {
                speedHackText.innerHTML = '[H]Speed<p id="uinfoy" style="font-weight: 800 !important;color: red !important;display: inline;">[OFF]</p>';
                alert("[OFF]REQUIRES RELOAD")
                location.href = `https://${location.hostname}/`
            }
            localStorage.setItem("DG", JSON.stringify(options));
        }

        togglePopup() {
            if (this.isVisible) {
                this.hidePopup();
            } else {
                this.showPopup();
            }
        }

        hidePopup() {
            this.div.style.display = 'none';
            this.isVisible = false;
        }

        showPopup() {
            this.div.style.display = 'block';
            this.isVisible = true;
        }
    }
    const Krunker = new KrunkerScript("DOGEWARE");
    function createMenuItem() {
        const styleTag = document.createElement('style');
        styleTag.textContent = `
        .menuItemTitle1 {
          font-size: 18px;
          animation: rgbAnimation 0.5s infinite alternate; /* Adding the animation */
        }
        @keyframes rgbAnimation {
          0% { color: rgb(255, 0, 0); }
          25% { color: rgb(255, 255, 0); }
          50% { color: rgb(0, 255, 0); }
          75% { color: rgb(0, 255, 255); }
          100% { color: rgb(255, 0, 255); }
        }
      `;
        document.head.appendChild(styleTag);
        const menuItemDiv = document.createElement('div');
        menuItemDiv.classList.add('menuItem');

        const iconSpan = document.createElement('span');
        iconSpan.innerHTML = `<img src="https://media.giphy.com/media/CxYGmxv0Oyz4I/giphy.gif" width='60' height='60'>`
        iconSpan.style.color = '#ff6a0b';

        // Create a div element for the menu item title
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('menuItemTitle1');
        titleDiv.classList.add('menuItemTitle')
        titleDiv.id = 'menuBtnProfile';
        titleDiv.style.fontSize = '18px';
        titleDiv.textContent = 'CH3ATS';

        menuItemDiv.addEventListener('click', openCheats);
        menuItemDiv.appendChild(iconSpan);
        menuItemDiv.appendChild(titleDiv);

        const menuItemContainer = document.getElementById('menuItemContainer');
        if (menuItemContainer) {
            menuItemContainer.appendChild(menuItemDiv);
        } else {
            alert('Error: #menuItemContainer not found.');
        }
    }
    function openCheats(){
        Krunker.togglePopup()
    }
    setTimeout(function(){
        try{
            createMenuItem();
        }catch{console.log("Unable to Create Item")}
    },500)
    setTimeout(function(){
        setInterval(function(){
            document.getElementById('mapInfoHld').innerHTML = "* Not <b style='color: red !important;'>Recomened</b> To Change Speed Factor May Cause Lag</lebal>"
        },1000)
    },3000)
} else {
    return;
}