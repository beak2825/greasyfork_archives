// ==UserScript==
// @name         Starblast.io Notification Mod
// @description  Shows a notification when players join a starblast.io match
// @version      0.1
// @author       Pixelmelt
// @license      MIT
// @namespace    https://greasyfork.org/en/users/226344
// @match        https://starblast.io/
// @icon         https://cdn.upload.systems/uploads/DDPfEofl.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481733/Starblastio%20Notification%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/481733/Starblastio%20Notification%20Mod.meta.js
// ==/UserScript==
 
const modName = "Notification Mod";
 
const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #0086FF");
 
function ingamecheck(){
    if (window.location.pathname == "/") {
        if (Object.values(window.module.exports.settings).find(v => v && v.mode).mode.id != 'welcome') {
            if (window.location.href != `https://starblast.io/#`) {
                return true
            }
        }
    }
    return false
}
function injector(sbCode) {
  log(`Mod injected`);
  return sbCode;
}
async function sendNotification(msg, color) {
    let iconcolor = `white`
    if(color){
        iconcolor = color
    }
    var notiArea = document.createElement("div");
    notiArea.className = "noti-area";
    notiArea.style.top = "-50px";
    notiArea.style.width = "100%";
    notiArea.style.height = "40px";
    notiArea.style.backgroundColor = "#00000000";
    notiArea.style.position = "absolute";
    notiArea.style.pointerEvents = "none";
    var notiBox = document.createElement("div");
    notiBox.className = "noti-box";
    notiBox.style.width = "30%";
    notiBox.style.height = "40px";
    notiBox.style.border = "2px solid";
    notiBox.style.borderColor = "black";
    notiBox.style.borderRadius = "25px";
    notiBox.style.backgroundColor = "#000000";
    notiBox.style.margin = "0 auto";
    notiBox.style.pointerEvents = "none";
    var notiText = document.createElement("div");
    notiText.className = "noti-text";
    notiText.style.color = "white";
    notiText.style.height = "40px";
    notiText.style.lineHeight = "40px";
    notiText.style.textAlign = "center";
    notiText.style.backgroundColor = "#00000000";
    notiText.style.margin = "0 auto";
    notiText.style.pointerEvents = "none";
    var notiIcon = document.createElement("div");
    notiIcon.className = "noti-icon";
    notiIcon.style.width = "30px";
    notiIcon.style.height = "30px";
    notiIcon.style.borderRadius = "50%";
    notiIcon.style.backgroundColor = iconcolor;
    notiIcon.style.margin = "0 auto";
    notiIcon.style.position = "absolute";
    notiIcon.style.top = "6.5px";
    notiIcon.style.marginLeft = "5px";
    notiIcon.style.pointerEvents = "none";
    notiArea.appendChild(notiBox);
    notiBox.appendChild(notiText);
    notiBox.appendChild(notiIcon);
    notiText.innerHTML = msg;
    document.body.appendChild(notiArea);
    let topphat = document.getElementsByClassName(`noti-area`)[0].style.top
    topphat = topphat.replace("px", "")
    topphat = parseInt(topphat)
    while(topphat <= 10){
        topphat = document.getElementsByClassName(`noti-area`)[0].style.top
        topphat = topphat.replace("px", "")
        topphat = parseInt(topphat)
        document.getElementsByClassName(`noti-area`)[0].style.top = (topphat + 4) + "px";
        await new Promise(resolve => setTimeout(resolve, 1));
    }
    await new Promise(resolve => setTimeout(resolve, 1400));
    topphat = document.getElementsByClassName(`noti-area`)[0].style.top
    topphat = topphat.replace("px", "")
    topphat = parseInt(topphat)
    while(topphat >= -50){
        topphat = document.getElementsByClassName(`noti-area`)[0].style.top
        topphat = topphat.replace("px", "")
        topphat = parseInt(topphat)
        document.getElementsByClassName(`noti-area`)[0].style.top = (topphat - 4) + "px";
        await new Promise(resolve => setTimeout(resolve, 1));
    }
    document.body.removeChild(notiArea);
    return true;
}
function getColor(e){
    return e < 25 ? "Red" : e < 50 ? "Orange" : e < 75 ? "Yellow" : e < 150 ? "Green" : e < 256 ? "Blue" : e < 287 ? "Purple" : e < 331 ? "Pink" : void 0;
}
function runner(){
    if(localStorage.getItem("notifs") == null){
        localStorage.setItem("notifs", "false")
    }
    if(localStorage.getItem("notifs") == "true"){
      window.module.exports.settings.parameters.notifs = {
        name:`Player join notifications`,
        value:true
      }  
    }else{
      window.module.exports.settings.parameters.notifs = {
        name:`Player join notifications`,
        value:false
      }
    }
    if(localStorage.getItem("notifs") != "true"){return}
    var oldplayers = []
    setInterval(() => {
        if(ingamecheck()){
            var players = Object.values(window.module.exports.settings).find(v => v && v.mode).names.data
            if(oldplayers != players){
                var difference = players.filter(x => !oldplayers.includes(x))
                if(difference != undefined){
                    difference.forEach(player => {
                        if(Object.values(window.module.exports.settings).find(v => v && v.mode).mode.id == "team"){
                            let teamcolor = getColor(Object.values(window.module.exports.settings).find(v => v && v.mode).mode.teams[player.friendly].hue)
                            sendNotification(`${player.player_name} has joined team ${teamcolor}!`, teamcolor)
                        }else{
                            sendNotification(`${player.player_name} has joined the game!`)
                        }
                        
                    })
                }
                oldplayers = [... players]
            }
        }
    }, 100);
    log(`Mod ran`);
}
if (!window.sbCodeInjectors) window.sbCodeInjectors = [];
window.sbCodeInjectors.push((sbCode) => {
  try {
    return injector(sbCode);
  } catch (error) {
    alert(`${modName} failed to load`);
    throw error;
  }
});
if(!window.sbCodeRunners) window.sbCodeRunners = [];
window.sbCodeRunners.push(() => {
  try {
    return runner();
  } catch (error) {
    alert(`${modName} failed to load`);
    throw error;
  }
});
log(`Mod loaded`);