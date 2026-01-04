// ==UserScript==
// @name         </> Kurt Mod - Sihirbaz
// @namespace    http://tampermonkey.net/
// @version      72.4
// @description  !adminyetki
// @icon         https://cdn.discordapp.com/emojis/823513307712454727.png?v=1
// @author       Kurt
// @match        http://tc-mod.glitch.me/
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/430436/%3C%3E%20Kurt%20Mod%20-%20Sihirbaz.user.js
// @updateURL https://update.greasyfork.org/scripts/430436/%3C%3E%20Kurt%20Mod%20-%20Sihirbaz.meta.js
// ==/UserScript==

// Sihirbaz
(function() {
    'use strict';
let script_1_1 = () => {
    game.ui.components.PlacementOverlay.oldStartPlacing = game.ui.components.PlacementOverlay.startPlacing;
    game.ui.components.PlacementOverlay.startPlacing = function(e) {
        game.ui.components.PlacementOverlay.oldStartPlacing(e);
        if (game.ui.components.PlacementOverlay.placeholderEntity) {
            game.ui.components.PlacementOverlay.direction = 2;
            game.ui.components.PlacementOverlay.placeholderEntity.setRotation(180);
        }
    }

    game.ui.components.PlacementOverlay.cycleDirection = function () {
        if (game.ui.components.PlacementOverlay.placeholderEntity) {
            game.ui.components.PlacementOverlay.direction = (game.ui.components.PlacementOverlay.direction + 1) % 4;
            game.ui.components.PlacementOverlay.placeholderEntity.setRotation(game.ui.components.PlacementOverlay.direction * 90);
        }
    };

    let getElement = (Element) => {
        return document.getElementsByClassName(Element);
    }
    let getId = (Element) => {
        return document.getElementById(Element);
    }
    getElement("hud-party-members")[0].style.display = "block";
    getElement("hud-party-grid")[0].style.display = "none";
    let privateTab = document.createElement("a");
    privateTab.className = "hud-party-tabs-link";
    privateTab.id = "privateTab";
    privateTab.innerHTML = "Kapalı Partiler";
    let privateHud = document.createElement("div");
    privateHud.className = "hud-private hud-party-grid";
    privateHud.id = "privateHud";
    privateHud.style = "display: none;";
    getElement("hud-party-tabs")[0].appendChild(privateTab);
    getElement("hud-menu hud-menu-party")[0].insertBefore(privateHud, getElement("hud-party-actions")[0]);
    let keyTab = document.createElement("a");
    keyTab.className = "hud-party-tabs-link";
    keyTab.id = "keyTab";
    keyTab.innerHTML = "Anaktarlar";
    getElement("hud-party-tabs")[0].appendChild(keyTab);
    let keyHud = document.createElement("div");
    keyHud.className = "hud-keys hud-party-grid";
    keyHud.id = "keyHud";
    keyHud.style = "display: none;";
    getElement("hud-menu hud-menu-party")[0].insertBefore(keyHud, getElement("hud-party-actions")[0]);
    getId("privateTab").onclick = e => {
        for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
            getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
        }
        getId("privateTab").className = "hud-party-tabs-link is-active";
        getId("privateHud").setAttribute("style", "display: block;");
        if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
            getElement("hud-party-members")[0].setAttribute("style", "display: none;");
        }
        if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
            getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
        }
        if (getId("privateHud").getAttribute("style") == "display: none;") {
            getId("privateHud").setAttribute("style", "display: block;");
        }
        if (getId("keyHud").getAttribute("style") == "display: block;") {
            getId("keyHud").setAttribute("style", "display: none;");
        }
    }
    getElement("hud-party-tabs-link")[0].onmouseup = e => {
        getId("privateHud").setAttribute("style", "display: none;");
        getId("keyHud").setAttribute("style", "display: none;");
        if (getId("privateTab").className == "hud-party-tabs-link is-active") {
            getId("privateTab").className = "hud-party-tabs-link"
        }
        if (getId("keyTab").className == "hud-party-tabs-link is-active") {
            getId("keyTab").className = "hud-party-tabs-link"
        }
    }
    getElement("hud-party-tabs-link")[1].onmouseup = e => {
        getId("privateHud").setAttribute("style", "display: none;");
        getId("keyHud").setAttribute("style", "display: none;");
        getId
        if (getId("privateTab").className == "hud-party-tabs-link is-active") {
            getId("privateTab").className = "hud-party-tabs-link"
        }
        if (getId("keyTab").className == "hud-party-tabs-link is-active") {
            getId("keyTab").className = "hud-party-tabs-link"
        }
    }
    getId("keyTab").onmouseup = e => {
        for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
            getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
        }
        getId("keyTab").className = "hud-party-tabs-link is-active";
        getId("keyHud").setAttribute("style", "display: block;");
        if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
            getElement("hud-party-members")[0].setAttribute("style", "display: none;");
        }
        if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
            getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
        }
        if (getId("privateHud").getAttribute("style") == "display: block;") {
            getId("privateHud").setAttribute("style", "display: none;");
        }
        if (getId("keyHud").getAttribute("style") == "display: none;") {
            getId("keyHud").setAttribute("style", "display: block;");
        }
    }
    let num = 0;
    Game.currentGame.network.addRpcHandler("PartyShareKey", e => {
        let el = document.createElement('div');
        el.innerText = e.partyShareKey;
        el.className = `tag${num++}`;
        document.getElementsByClassName('hud-keys hud-party-grid')[0].appendChild(el);
        document.getElementsByClassName(el.className)[0].addEventListener('click', e => {
            game.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: el.innerText});
        })
    });
    let parties = "";
    Game.currentGame.network.addRpcHandler("SetPartyList", e => {
        parties = "";
        for (let i in e) {
            if (e[i].isOpen == 0) {
                parties += "<div style=\"width: relative; height: relative;\" class=\"hud-party-link is-disabled\"><strong>" + e[i].partyName + "</strong><span>" + e[i].memberCount + "/4<span></div>";
            }
        }
        getId("privateHud").innerHTML = parties;
    });
};
script_1_1();
})();