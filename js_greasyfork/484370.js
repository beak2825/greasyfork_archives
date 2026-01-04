// ==UserScript==
// @name              [Diep.io] Utility Script
// @namespace    http://tampermonkey.net/
// @version           2.0
// @description     net_predict_movement, ren_upgrades and copy server and party link all in one script.
// @author             _Vap
// @match             https://diep.io/*
// @grant              unsafeWindow
// @grant              GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/484370/%5BDiepio%5D%20Utility%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/484370/%5BDiepio%5D%20Utility%20Script.meta.js
// ==/UserScript==

let notificationDuration = 5000; // How long the notifications will stay on your screen.
let notificationColor = 0x99DDF2; // The color of the notifcations.

let active = false;

class Gui {
    constructor(title) {
        this._colors = ['#00acdf', '#19B4E2', '#33BCE5', '#4CC4E8', '#66CDEB', '#7FD5EE', '#99DDF2'];
        this._buttons = [];

        this._title = title;
        this._gui;
        this._guiHead;
        this._guiBody;

        this._init();
    }

    _init() {
        const nonce = `a${(Math.random() * 1e5) | 0}`;
        GM_addStyle(
            `.${nonce} button{display:block;font-family:Ubuntu;color:#fff;text-shadow:-.1em -.1em 0 #000,0 -.1em 0 #000,.1em -.1em 0 #000,.1em 0 0 #000,.1em .1em 0 #000,0 .1em 0 #000,-.1em .1em 0 #000,-.1em 0 0 #000;opacity:.8;border:0;padding:.3em .5em;width:100%;transition:all .15s}.${nonce}{bottom:1.5%;right:11%;position:absolute;z-index: 9999}.${nonce} button:active:not([disabled]){filter:brightness(.9)}.${nonce} button:hover:not([disabled]):not(:active){filter:brightness(1.1)}`
        );

        this._gui = document.createElement('div');
        this._guiHead = document.createElement('div');
        this._guiBody = document.createElement('div');

        this._gui.className = `${nonce}`;
        this._guiBody.style.display = 'block';

        document.body.appendChild(this._gui);
        this._gui.appendChild(this._guiHead);
        this._gui.appendChild(this._guiBody);

        this._addButton(this._guiHead, this._title, () => {
            if (this._guiBody.style.display === 'block') {
                this._guiBody.style.display = 'none';
            } else {
                this._guiBody.style.display = 'block';
            }
        });
    }
    addButton(text, onclick, keyCode) {
        return this._addButton(this._guiBody, text, onclick, keyCode);
    }
    removeButton(button) {
        button.remove();
        button.active = false;
    }
    reset() {
        const head = this._buttons[0];
        this._buttons.forEach((x, i) => {
            if (i === 0) return;
            this.removeButton(x);
        });
        this._buttons = [head];
    }
    _addButton(parent, text, onclick, keyCode) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.keyCode = keyCode;
        button.onclick = onclick;
        button.style['background-color'] = this._colors[this._buttons.length % this._colors.length];
        button.addEventListener('contextmenu', (e) => e.preventDefault());

        parent.appendChild(button);
        this._buttons.push(button);
        return button;
    }
}

function onbtnPredict() {
    this.active = !this.active;
    if (this.active) {
        this.innerHTML = 'Predict Movement: FALSE';
        input.set_convar("net_predict_movement", false);
        input.inGameNotification("Movement Prediction: FALSE", notificationColor, notificationDuration);
    } else {
        this.innerHTML = 'Predict Movement: TRUE';
        input.set_convar("net_predict_movement", true);
        input.inGameNotification("Movement Prediction: TRUE", notificationColor, notificationDuration);
    }
}
function onbtnUpgrades() {
    this.active = !this.active;
    if (this.active) {
        this.innerHTML = 'Upgrades: ENABLED';
        input.set_convar("ren_upgrades", false);
        input.inGameNotification("Upgrades: ENABLED", notificationColor, notificationDuration);
    } else {
        this.innerHTML = 'Upgrades: DISABLED';
        input.set_convar("ren_upgrades", true);
        input.inGameNotification("Upgrades: DISABLED", notificationColor, notificationDuration);
    }
}

function onbtnUniLink() {
    let lobbyIp = window.xhttp = lobby_ip;
    let gamemode = window.xhttp = lobby_gamemode;

    let link = `https://diep.io/?s=${lobbyIp}&g=${gamemode}`;
    navigator.clipboard.writeText(link);
    input.inGameNotification("Copied universal link to clipboard.", notificationColor, notificationDuration);
}

function onbtnPartyLink() {
    let lobbyIp = window.xhttp = lobby_ip;
    let gamemode = window.xhttp = lobby_gamemode;
    let party = window.xhttp = __common__.party_link

    let link = `https://diep.io/?s=${lobbyIp}&g=${gamemode}&l=${party}`;
    navigator.clipboard.writeText(link);
    input.inGameNotification("Copied party link to clipboard.", notificationColor, notificationDuration);
}

const gui = new Gui(`Utility Script by _Vap`);

let btnUniLink = gui.addButton('Copy Universal Link', onbtnUniLink);
let btnPartyLink = gui.addButton('Copy Party Link', onbtnPartyLink);
let btnMovement = gui.addButton('Predict Movement: TRUE', onbtnPredict);
let btnUpgrades = gui.addButton('Disable Upgrades: OFF', onbtnUpgrades);