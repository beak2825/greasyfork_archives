// ==UserScript==
// @name         Starblast.io ECPCheck
// @description  Check the ECPs in starblast.io
// @version      0.1
// @author       M4tr1x
// @license      MIT
// @namespace    https://greasyfork.org/en/users/226344
// @match        https://starblast.io/
// @icon         https://cdn.upload.systems/uploads/DDPfEofl.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485517/Starblastio%20ECPCheck.user.js
// @updateURL https://update.greasyfork.org/scripts/485517/Starblastio%20ECPCheck.meta.js
// ==/UserScript==
 
const modName = "ECPCheck";
 
const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #85FF6C");
 
function injector(sbCode) {
  log(`Mod injected`);
  return sbCode;
}
function runner(){
 
  if(localStorage.getItem("ecpcheck") == null){
    localStorage.setItem("ecpcheck", "false")
  }
 
  if(localStorage.getItem("ecpcheck") == "true"){
    window.module.exports.settings.parameters.ecpcheck = {
      name:`ECP Check shortcut (Shift+E)`,
      value:true
    }
  }else{
    window.module.exports.settings.parameters.ecpcheck = {
      name:`ECP Check shortcut (Shift+E)`,
      value:false
    }
  }
 
  if(localStorage.getItem("ecpcheck") != "true"){return}
 
  function check() {
    function getColor(e){
      return e < 25 ? "Red" : e < 50 ? "Orange" : e < 75 ? "Yellow" : e < 150 ? "Green" : e < 256 ? "Blue" : e < 287 ? "Purple" : e < 331 ? "Pink" : void 0;
    }
    let teams = {}, k = Object.keys(window.module.exports.settings).filter(e => e.match(/[iI10OlL]{3,6}/))[0], b = [];
    window.module.exports.settings[k].names.data.filter(e => void 0 !== e).forEach(e => {
      b.push(`${e.hue}_${getColor(e.hue)} - ${e.player_name} - ${e.custom?e.custom.badge.charAt(0).toUpperCase() + e.custom.badge.slice(1):"No ecp"}`); b.sort();
      var a = getColor(e.hue);
      teams[a] || (teams[a] = {ecps: 0,hiddenECP: 0,randoms: 0,total: 0,hue: 0,names: "\n",map: new Map()}), 
      e.custom && !teams[a].map.has(e.player_name) ? (teams[a].ecps += 1, "Blank" === e.custom.badge && (teams[a].hiddenECP += 1), teams[a].hue = e.hue,
      teams[a].names += e.player_name + " - " + e.custom.badge.charAt(0).toUpperCase() + e.custom.badge.slice(1) + "\n") : teams[a].randoms += 1, teams[a].total += 1;
    });
    for (var c in b) console.log(`%c${b[c].toString().split("_")[1]}`,`color: hsl(${b[c].toString().split("_")[0]},100%,80%)`);
    Object.keys(teams).forEach(e => console.log(`%c${teams[e].names}`, `color: hsl(${teams[e].hue},100%,80%)`, teams[e]));
  }
  document.addEventListener("keydown", function(e){
    if(e.shiftKey && e.keyCode == 69){
      check();
    }
  })
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