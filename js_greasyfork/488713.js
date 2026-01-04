// ==UserScript==
// @name         Diep.io Join Notifier
// @namespace    *
// @version      1.1.6
// @description  Notifies when people join,leave,respawn or die using the inbuilt diep.io player list.
// @author       rbest
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @license      rbest
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488713/Diepio%20Join%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/488713/Diepio%20Join%20Notifier.meta.js
// ==/UserScript==
// made by king rbest
// made by king rbest
// made by king rbest
//toggle which notifications you want
let joinNotifications = true;
let dieNotifications = true;
let respawnNotifications = true;
let leaveNotifications = true;
//dont touch this;
let old = [];
let bef = [];
let changed = false;
let oldPlayers = {};
let oldNames = {};
let times = {};
function toMin(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
function check() {
    let players = window.ui.players;
    let players2 = {};
    players.forEach(player=>{
        players2[player.identityId] = player;
    })
    if (players) {
        bef = old;
        oldPlayers = {};
        bef.forEach(player=>{
            oldPlayers[player.identityId] = player;
        })
        old = players;
        if (bef===old) changed = false;
        if (bef!==old) changed = true;
        if (changed === true) {
            for (let player of players) {
                if (!oldPlayers[player.identityId]) {
                    if (joinNotifications) notification(`${player.name} joined`);
                    times[player.identityId] = {};
                }
                if (oldPlayers[player.identityId]) {
                    if (oldPlayers[player.identityId].name !== ' (dead)' && player.name === ' (dead)') {
                        oldNames[player.identityId] = oldPlayers[player.identityId].name;
                      if (dieNotifications && times[player.identityId].spawnTime) notification(`${oldPlayers[player.identityId].name} died (${toMin(new Date().getTime()-times[player.identityId].spawnTime)})`)
                        if (dieNotifications && !times[player.identityId].spawnTime) notification(`${oldPlayers[player.identityId].name} died`)
                    }
                    if (oldPlayers[player.identityId].name === ' (dead)' && player.name !== ' (dead)') {
                        if (player.name === oldNames[player.identityId]) {
                           if (respawnNotifications) notification(`${player.name} respawned`);
                        }
                        else if (player.name !== oldNames[player.identityId] && oldNames[player.identityId] !== undefined) {
                          if (respawnNotifications) notification(`${player.name} (${oldNames[player.identityId]}) respawned`); //if they changed username
                        }
                        times[player.identityId] = {};
                        times[player.identityId].spawnTime = new Date().getTime();
                        oldNames[player.identityId] = player.name;
                    }
                }
            }
            Object.values(oldPlayers).forEach(playr=>{
                if (!players2[playr.identityId] && oldNames[playr.identityId] !== undefined) if (leaveNotifications) notification(`${oldNames[playr.identityId]} left`);
                if (!players2[playr.identityId] && oldNames[playr.identityId] === undefined) if (leaveNotifications) notification(`${playr.name} left`);
            })
        }
    }
}
setInterval(check,100);
//Modified notification code from DiepBox
let notificationBody = document.body.appendChild(document.createElement('div'));
notificationBody.style.pointerEvents = 'none';
notificationBody.style.position = 'fixed';
notificationBody.style.left = `50%`;
notificationBody.style.top = `1.9%`;
notificationBody.style.opacity = '0.70';

function notification(text, duration = 3500) {
    const button = document.createElement('button');
    button.innerHTML = `&nbsp;${text}&nbsp;`;
    button.style['background-color'] = '#E8B18B';
    button.style.display = 'block';
    button.style.height = '35px';
    button.style.border = 'none';
    button.style.color = 'white';
    button.style.fontSize = '26px';
    button.style.transform = 'translate(-50%, -1.9%)';
    button.addEventListener('contextmenu', (e) => e.preventDefault());

    notificationBody.appendChild(button);
    setTimeout(()=>{
        button.style.transition = "opacity 250ms";
        button.style.opacity = "0";

        setTimeout(() => button.remove(), 250);
    },duration);
}
// made by king rbest