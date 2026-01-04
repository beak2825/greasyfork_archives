// ==UserScript==

// @name         Project ^_^

// @namespace    Hack Studio
// @namespace    Develope Company (DC)

// @version      v.1.4

// @description  Bar Reloads, AutoGG, And Instakill Types

// @author       cah blX

// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        https://moomoo.io/
// @match        https://sandbox.moomoo.io/
// @match        https://dev.moomoo.io/
// @match        *abc.moomoo.io/*

// @run-at       document-start

// @license      MIT
// @license      Copyright (c) Hack Studio 2019
// @license      Copyright (c) DC

// @downloadURL https://update.greasyfork.org/scripts/501617/Project%20%5E_%5E.user.js
// @updateURL https://update.greasyfork.org/scripts/501617/Project%20%5E_%5E.meta.js
// ==/UserScript==

/*
  Author: cah blX ( 2k09__ )
  Discord: 2k09__
  GreasyFork: cah blX
  Glitch: 2k09__
  Copyright (c) 101.NewA. cah_blX
*/

document.getElementById('gameName').innerHTML = '';
document.getElementById("leaderboard").innerHTML = '^_^';
document.getElementById('loadingText').innerHTML = '';
document.getElementById("nameInput").innerHTML = 'tester';
document.getElementById("chatBox").innerHTML = '>> Message <<';
document.getElementById('enterGame').innerHTML = '--> Lets Play <---';
document.getElementById("ageText").style.color = "#000000"
document.getElementById("ageBar").style.backgroundColor = "rgba(0, 0, 0, 0.25)"
document.getElementById("ageBarBody").style.backgroundColor = "#064a49"
document.getElementById('adCard')?.remove();
document.getElementById('errorNotification')?.remove();
document.getElementById('promoImg')?.remove();
document.getElementById("ot-sdk-btn-floating");
document.getElementById("partyButton")?.remove
document.getElementById("joinPartyButton")?.remove
document.getElementById("youtuberOf")?.remove
document.getElementById("moomooio_728x90_home")?.remove
document.getElementById("darkness")?.remove
document.getElementById("gameUI")?.remove

var primary = 0,
    secondary = 0,
    foodType = 0,
    spikeType = 6,
    boostType = 15,
    instaspeed = 110,
    autoaim = false,
    instacht = "Type: Normal Insta",
    insta1tickcht = "Type: One Ticked",
    instarevcht = "Type: Rev Insta",
    instasTickedcht = "Type: Spike Tick",
    insta1framecht = "Type: One Frame",
    mouseX,
    mouseY,
    ws,
    player = [],
    width,
    height,
    nearestEnemyAngle,
    msgpack5 = window.msgpack;

setInterval(() => {
 if(autoaim == true){
  doNewSend(["2",[nearestEnemyAngle]]);
 }
},20);
function Random(e, t) {
	return Math.floor(Math.random() * t) + e
}
function aim(e, t) {
	document.getElementById("gameCanvas")
		.dispatchEvent(new MouseEvent("mousemove", {
			clientX: e,
			clientY: t
		}))
}
function place(id, angle=Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [3, angle]]);
    doNewSend(["5", [player.weapon, true]]);
}
function isElementVisible(e) {
    return (e.offsetParent !== null);
}
function doNewSend(sender) {
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}
function chat(sender) {
 doNewSend(["ch", [sender]]);
}
var repeater = function(key, action, interval) {
    let _isKeyDown = false;
    let _intervalId = undefined;
    return {
        start(keyCode) {
            if (keyCode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = true;
                if (_intervalId === undefined) {
                    _intervalId = setInterval(()=>{
                        action();
                        if (!_isKeyDown) {
                            clearInterval(_intervalId);
                            _intervalId = undefined;
                        }
                    }
                    , interval);
                }
            }
        },
        stop(keyCode) {
            if (keyCode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = false;
            }
        }
    };
}
function wep(id){
 doNewSend(["5", [id, true]]);
}
function hit() {
 doNewSend(["c", [1]]);
}
function stophit() {
 doNewSend(["c", [0, null]]);
}
function storeEquip(hat, acc) {
 doNewSend(["13c", [1, hat, 0]]);
 doNewSend(["13c", [1, acc, 1]]);
 doNewSend(["13c", [0, hat, 0]]);
 doNewSend(["13c", [0, acc, 1]]);
}
function storeBuy(hat, acc) {
 doNewSend(["c", [1, hat, 0]]);
 doNewSend(["c", [1, acc, 1]]);
 doNewSend(["c", [0, hat, 0]]);
 doNewSend(["c", [0, acc, 1]]);
}
function insta(id) {
 autoaim = true;
 chat(id)
 storeBuy(7, 19);
 storeEquip(7, 19);
 wep(primary)
 hit()
setTimeout(() => {
  wep(secondary)
  hit()
  storeBuy(53, 21);
  storeEquip(53, 21);
 },instaspeed);
setTimeout(() => {
  stophit()
  stophit()
  wep(primary)
  storeBuy(20, 19);
  storeEquip(20, 19);
 },230);
 autoaim = false;
}
function onetick(id) {
 autoaim = true;
 chat(id)
 storeBuy(53, 21);
 storeEquip(53, 21);
 wep(secondary)
 hit()
 place(boost)
setTimeout(() => {
  wep(primary)
  hit()
  storeBuy(7, 19);
  storeEquip(7, 19);
 },instaspeed);
setTimeout(() => {
  stophit()
  stophit()
  wep(primary)
  storeBuy(20, 19);
  storeEquip(20, 19);
 },230);
 autoaim = false;
}
function revinsta(id) {
 autoaim = true;
 chat(id)
 storeBuy(53, 21);
 storeEquip(53, 21);
 wep(secondary)
 hit()
setTimeout(() => {
  wep(primary)
  hit()
  storeBuy(7, 19);
  storeEquip(7, 19);
 },instaspeed);
setTimeout(() => {
  stophit()
  stophit()
  wep(primary)
  storeBuy(20, 19);
  storeEquip(20, 19);
 },230);
 autoaim = false;
}
function spiketick(id) {
 autoaim = true;
 chat(id)
 storeBuy(7, 19);
 storeEquip(7, 19);
 wep(primary)
 hit()
 place(spike)
setTimeout(() => {
  wep(secondary)
  hit()
  place(spike)
  storeBuy(53, 21);
  storeEquip(53, 21);
 },instaspeed);
setTimeout(() => {
  stophit()
  stophit()
  wep(primary)
  storeBuy(20, 19);
  storeEquip(20, 19);
 },230);
 autoaim = false;
}
function oneframe(id) {
 autoaim = true;
 chat(id)
 storeBuy(53, 21);
 storeEquip(53, 21);
setTimeout(() => {
  wep(primary)
  hit()
  storeBuy(7, 18);
  storeEquip(7, 18);
 },instaspeed);
setTimeout(() => {
  stophit()
  wep(primary)
  storeBuy(20, 19);
  storeEquip(20, 19);
 },230);
 autoaim = false;
}
const insta1 = repeater(82, () => {insta(instacht)}, 0);
const onetick1 = repeater(110, () => {onetick(insta1tickcht)}, 0);
const revinsta1 = repeater(84, () => {revinsta(instarevcht)}, 0);
const spikeTick1 = repeater(32, () => {spiketick(instasTickedcht)}, 0);
const oneFrame1 = repeater(80, () => {oneframe(insta1framecht)}, 0);
const spike = repeater(86, () => {place(spikeType)}, 0);
const qheal = repeater(81, () => {place(foodType)}, 0);
const boost = repeater(70, () => {place(boostType)}, 0);
document.addEventListener('keydown', (e)=>{
 insta1.start(e.keyCode);
 onetick1.start(e.keyCode);
 revinsta1.start(e.keyCode);
 spikeTick1.start(e.keyCode);
 oneFrame1.start(e.keyCode);
 spike.start(e.keyCode);
 qheal.start(e.keyCode);
 boost.start(e.keyCode);
})
var bKey = 16;
document.addEventListener('keydown', (e)=>{
 if(e.keyCode == bKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
  if (player.y < 2400) {
   storeBuy(20, 11)
   storeEquip(20, 11)
  } else if (player.y > 6850 && player.y < 7550) {
   storeBuy(31, 11)
   storeEquip(31, 11)
  } else if (player.y > 2400 && (player.y < 6850 || player.y > 7550)) {
   storeBuy(20, 11)
   storeEquip(20, 11)
  }
 }
})
document.addEventListener('keyup', (e)=>{
 insta1.stop(e.keyCode);
 onetick1.stop(e.keyCode);
 revinsta1.stop(e.keyCode);
 spikeTick1.stop(e.keyCode);
 oneFrame1.stop(e.keyCode);
 spike.stop(e.keyCode);
 qheal.stop(e.keyCode);
 boost.stop(e.keyCode);
})
    window.Cow.setCodec(window.msgpack);
    CanvasRenderingContext2D.prototype._roundRect = CanvasRenderingContext2D.prototype.roundRect;
    window.Cow.addRender("global", () => {
        window.Cow.playersManager.eachVisible(player => {
            if (player === null || player === undefined || !player.alive) return;
            function renderBar({ width, innerWidth, xOffset, yOffset, color }) {
                const context = window.Cow.renderer.context;
                const healthBarPad = window.config.healthBarPad;
                const height = 17;
                const radius = 8;
                context.save();
                context.fillStyle = "#3d3f42";
                context.translate(xOffset, yOffset);
                context.beginPath();
                context._roundRect(-width - healthBarPad, -8.5, 2 * width + 2 * healthBarPad, height, radius);
                context.fill();
                context.restore();
                context.save();
                context.fillStyle = color;
                context.translate(xOffset, yOffset);
                context.beginPath();
                context._roundRect(-width, -8.5 + healthBarPad, 2 * innerWidth, height - 2 * healthBarPad, radius - 1);
                context.fill();
                context.restore();
            }
            const width = window.config.healthBarWidth / 2 - window.config.healthBarPad / 2;
            const primaryReloadCount = Math.min(Math.max(player.reloads.primary.count / player.reloads.primary.max, 0), 1);
            const secondaryReloadCount = Math.min(Math.max(player.reloads.secondary.count / player.reloads.secondary.max, 0), 1);
            const yOffset = player.renderY + player.scale + window.config.nameY - 5;
            renderBar({
                width,
                innerWidth: width * primaryReloadCount,
                xOffset: player.renderX - width * 1.19,
                yOffset,
                color: player.isAlly ? "#ffff00" : "#cc5151"
            });
            renderBar({
                width,
                innerWidth: width * secondaryReloadCount,
                xOffset: player.renderX + width * 1.19,
                yOffset,
                color: player.isAlly ? "#ffff00" : "#cc5151"
            });
        });
    });
var prevCount
const attachWebSocketListener = e => {
  e.addEventListener("message", hookWS);
};
const hookWS = e => {/*...*/};
const sendPacket = e => {
  if (ws) {
    ws.send(msgpack5.encode(e));
  }
};
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (e) {
  if (!ws) {
    [document.ws, ws] = [this, this];
    attachWebSocketListener(this);
  }
  this.oldSend(e);
};
const handleMutations = mutationsList => {
  for (const mutation of mutationsList) {
    if (mutation.target.id === "killCounter") {
      const count = parseInt(mutation.target.innerText, 10) || 0;
      if (count > prevCount) {
        chat("AutoGG - Scripter Working!");
      } else {
        chat(player.kills + " - 0");
        prevCount = count;
      }
    }
  }
};
const observer = new MutationObserver(handleMutations);
observer.observe(document, {
  subtree: true,
  childList: true
});