// ==UserScript==
// @name         Discord Ease of Use
// @namespace    http://tampermonkey.net/
// @version      Alpha 1.2.2
// @description  Use this script to complete actions, commands, and use customizations for the cord!
// @author       James D Melix
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495925/Discord%20Ease%20of%20Use.user.js
// @updateURL https://update.greasyfork.org/scripts/495925/Discord%20Ease%20of%20Use.meta.js
// ==/UserScript==

//soundInfo_e6cedd

(function() {
    'use strict';
    let strt = () => {
        let userSettings = { // Default Settings
            zind: 12,
            opa: 1,
            soundboard: {
                r: false, // Whether or not it will randomize
                t: 250, // The wait time before every action (in ms)
                minrange: 0, // Minimum Sound IDs Playable in the current server
                maxrange: 0, // Max Sound IDs Playable in the current server
            },
            chat: {},
            canSave: true,
            canLoad: true,
        }
        let panel = document.createElement('div');
        function cEl(el, innHTML, par, idD) {
            let agfok = document.createElement(el);
            if (innHTML) {
                agfok.innerHTML = innHTML;
            }
            if (par) {
                par.appendChild(agfok);
            }
            if (idD) {
                agfok.id = idD;
            }
            return agfok;
        }

        function dragElement(elmnt) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            if (document.getElementById('eouDrag')) {
                document.getElementById('eouDrag').onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                panel.style.top = (panel.offsetTop - pos2) + "px";
                panel.style.left = (panel.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        let drag = document.createElement('div');
        let min = document.createElement('span');
        let styl = document.createElement('style');
        let contnt = document.createElement('div');
        let homeBtn = document.createElement('span');
        let settingBtn = document.createElement('span');
        let homePage = document.createElement('div');
        let settingPage = document.createElement('div');

        // Append Children and Apply IDs
        document.body.appendChild(panel)
        panel.id = 'eouDragPanel';
        panel.appendChild(drag)
        drag.id = 'eouDrag';
        drag.appendChild(min);
        min.innerHTML = '+';
        document.body.appendChild(styl)
        styl.id = 'eouStyling';
        panel.appendChild(contnt);
        contnt.style.display = 'none';
        contnt.appendChild(homeBtn);
        homeBtn.innerHTML = 'Home';
        homeBtn.id = 'eouHome';
        contnt.appendChild(settingBtn);
        settingBtn.innerHTML = 'Settings';
        settingBtn.id = 'eouSettings';
        contnt.appendChild(homePage);
        homePage.id = 'eouHomePage';
        contnt.appendChild(settingPage);
        settingPage.id = 'eouSettingsPage';

        // Actions

        min.onclick = () => {
            if (min.innerHTML == '+') {
                min.innerHTML = '-';
                contnt.style.display = 'block';
            } else {
                min.innerHTML = '+';
                contnt.style.display = 'none';
            }
        }
        settingBtn.onclick = () => { updatePnl('dS') }
        homeBtn.onclick = () => { updatePnl('dH') }

        function updatePnl(arg1) {
            let s = userSettings;

            if (arg1 == 'dS') {
                document.getElementById('eouSettingsPage').style.display = 'grid';
                document.getElementById('eouSettings').style.textShadow = '0px 0px 20px white';
                document.getElementById('eouHomePage').style.display = 'none';
                document.getElementById('eouHome').style.textShadow = 'none';
            } else if (arg1 == 'dH') {
                document.getElementById('eouSettingsPage').style.display = 'none';
                document.getElementById('eouSettings').style.textShadow = 'none';
                document.getElementById('eouHomePage').style.display = 'block';
                document.getElementById('eouHome').style.textShadow = '0px 0px 20px white';
            } else { // Updates are to panel
                panel.style.zIndex = document.getElementById('zinInput').value;
                panel.style.opacity = document.getElementById('oinInput').value;
            }
        }

        // Pages

        (function() {
            let home = document.getElementById('eouHomePage');
            let sB = cEl('div', '', homePage, 'soundBoard');
            let sBHeader = cEl('div', 'Soundboard', sB, 'sBHeader');
            let rndmSound = cEl('input', '', sB, 'sBRandom');
            rndmSound.type = 'checkbox';
            rndmSound.checked = false;
            rndmSound.onclick = () => {
                if (userSettings.soundboard.r == true) {
                    userSettings.soundboard.r = false;
                    rndmSound.checked = false;
                } else if (userSettings.soundboard.r == false) {
                    userSettings.soundboard.r = true;
                    rndmSound.checked = true;
                }
                console.log(userSettings.soundboard);
            }


            let st = document.getElementById('eouSettingsPage');
            let zin = cEl('div', 'Z-Index', st);
            let zinInput = cEl('input', '', st, 'zinInput');
            zinInput.type = 'range';
            zinInput.min = 0;
            zinInput.max = 1000;
            zinInput.onmousemove = updatePnl;
            zinInput.onchange = updatePnl;

            let oin = cEl('div', 'Opacity: ', st);
            let oinInput = cEl('input', '', st, 'oinInput');
            oinInput.type = 'range';
            oinInput.min = 0;
            oinInput.max = 1;
            oinInput.value = 1;
            oinInput.step = 0.01
            oinInput.onmousemove = updatePnl;
            oinInput.onchange = updatePnl;
        })();

        // Styling
        styl.innerHTML = '#eouDragPanel {padding: 9px;max-height: 250px; border-radius: 20px; display:block; background-color: black; color: #2cb200; font-size: 25px; width: 250px; height: auto; position: absolute; top: 0px; left: 0px;z-index:10}' +
            '#eouDrag {background-color: rgba(255, 255, 255, 0.2); cursor: pointer; padding: 2px; border-radius: 25px; box-shadow: 0px 0px 5px rgba(255, 255, 255, 1);}' +
            '#contnt {width: 240px; height: 250px; background-color: rgba(255, 0, 0, 0.1)}' +
            '#eouSettings, #eouHome { cursor: pointer;transition: color: 0.2s,padding:5px} #eouSettings:hover, #eouHome:hover {color: white;transition: color 0.5s;}' +
            '#eouSettingsPage {display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto}' +
            '#eouSettingsPage, #eouHomePage {padding-top: 15px;display:none}';
        dragElement(min);
    }
    strt();
})();