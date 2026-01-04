// ==UserScript==
// @name         Gartic.io Anonim Menu
// @namespace    https://greasyfork.org/
// @version      2023-12-08
// @description  press F2 to open and close the menu
// @author       anonimbiri
// @match        https://gartic.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @require      https://update.greasyfork.org/scripts/462013/1164920/Abnormal%20Menu.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484139/Garticio%20Anonim%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/484139/Garticio%20Anonim%20Menu.meta.js
// ==/UserScript==

const AnonimbiriAPI = { ws: null, isGame: false, playerId: null, unlimitedKick: false, autoSkip: false, antiAfk: false, noCooldown:false, debug: false };

var menu = new CreateMenu({
    title: "Anonim Menu"
});
var fake_win_text = menu.addInput({label: "Fake Win text", value: "anonimbiri"})
var fake_win = menu.addButton({title: "Send Fake Win"})
fake_win.on("click" , () => {
    const event = new MessageEvent('message', { data: `42["26","${fake_win_text.getValue()}",10,11,10000]` });
    AnonimbiriAPI.ws.dispatchEvent(event);
});
var unlimited_kick = menu.addSwitch({label: "Unlimited Kick"})
unlimited_kick.on("change" , () => {
    AnonimbiriAPI.unlimitedKick = unlimited_kick.getValue();
});
var auto_skip = menu.addSwitch({label: "Auto Skip"})
auto_skip.on("change" , () => {
    AnonimbiriAPI.autoSkip = auto_skip.getValue();
});
var anti_afk = menu.addSwitch({label: "Anti Afk"})
anti_afk.on("change" , () => {
    AnonimbiriAPI.antiAfk = anti_afk.getValue();
});
var no_cooldown = menu.addSwitch({label: "No Cooldown For Room Change"})
no_cooldown.on("change" , () => {
    AnonimbiriAPI.noCooldown = no_cooldown.getValue();
});

window.WebSocket = class extends WebSocket {
    constructor(...args) {
        super(...args);
        AnonimbiriAPI.ws = this;
        this.addEventListener('message', (e) => {
            AnonimbiriAPI.debug && console.log("%c<--- Received data:", "color: pink", e.data);
            const messageData = JSON.parse(e.data.slice(2));
            if (messageData[0] === "45" && AnonimbiriAPI.unlimitedKick) {
                const originalDateNow = Date.now;
                (original => (Date.now = () => original() * 2123).toString = () => "function now() {\n    [native code]\n}")(Date.now);
                setTimeout(() => { (original => (Date.now = () => originalDateNow).toString = () => "function now() {\n    [native code]\n}")(Date.now); }, 2000);
                return;
            }else if (messageData[0] === "5") {
                AnonimbiriAPI.isGame = true;
                AnonimbiriAPI.playerId = messageData[2];
            }else if(messageData[0] === "16" && AnonimbiriAPI.autoSkip){
                AnonimbiriAPI.ws.send(`42[25,${AnonimbiriAPI.playerId}]`);
            }else if(messageData[0] === "34"){
                AnonimbiriAPI.ws.send(`42[30,${AnonimbiriAPI.playerId}]`);
                AnonimbiriAPI.ws.send(`42[30,${AnonimbiriAPI.playerId}]`);
                AnonimbiriAPI.ws.send(`42[30,${AnonimbiriAPI.playerId}]`);
            }else if (messageData[0] === "19" && AnonimbiriAPI.antiAfk){
                (original => (Date.now = () => original() / 2123).toString = () => "function now() {\n    [native code]\n}")(Date.now);
            }
        });
    }

    send(data) {
        AnonimbiriAPI.debug && console.log("%c---> Sent data:", "color: pink", data);
        const newData = JSON.parse(data.slice(2));
        if (newData[1] && newData[1].nick) {
            newData[1].nick = `‎${newData[1].nick}`;
            data = data.slice(0, 2) + JSON.stringify(newData);
        }else if(newData[0] === "46"){

        }
        super.send(data);
    }
}

const observer = new MutationObserver(() => {
    document.querySelector('input[name="chat"]')?.replaceWith(Object.assign(document.createElement('input'), {type: 'text', name: 'chat', className: 'mousetrap', placeholder: '🔓 Answer Unlocked', autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', maxLength: 100, value: ''}));
    if(document.querySelector('#popUp') && AnonimbiriAPI.noCooldown){
        const originalDateNow = Date.now;
        (original => (Date.now = () => original() * 2123).toString = () => "function now() {\n    [native code]\n}")(Date.now);
        setTimeout(() => { (original => (Date.now = () => originalDateNow).toString = () => "function now() {\n    [native code]\n}")(Date.now); }, 2000);
        document.querySelector('.ic-playHome').click();
    }
});
observer.observe(document.body, { childList: true, subtree: false });

const keyupEvent = function (e) {
    if (e.keyCode === 113) {
        MenuShowHide();
    }else if (e.keyCode === 13){
        var chatInput = document.querySelector('input[name="chat"]');
        AnonimbiriAPI.ws.send(`42[11,${AnonimbiriAPI.playerId},"${chatInput.value}"]`);
        chatInput.value = '';
    }
};

window.addEventListener('keyup', keyupEvent);
window.AnonimbiriAPI = AnonimbiriAPI;