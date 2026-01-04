// ==UserScript==
// @name         Bigger party Name. With Commands!
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This is a small Script. That let's you have a lot more bigger party name, Be sure that the name is not using a lot of stylish words/emojis or you can disconnect. Type /setMyName to set your name, /setPartyID to set the name to your partyID and /&myName to add your name in any sentence.
// @author       DiamondKingx
// @match        http://zombs.io/
// @icon         https://www.google.com/s2/favicons?domain=zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431036/Bigger%20party%20Name%20With%20Commands%21.user.js
// @updateURL https://update.greasyfork.org/scripts/431036/Bigger%20party%20Name%20With%20Commands%21.meta.js
// ==/UserScript==

(function() {
var partyNameInput = document.getElementsByClassName("hud-party-tag")[0];
setInterval(() => {
    if(game.world.inWorld == true){partyNameInput.maxLength = 49; var partyName;
if(partyNameInput.value.toUpperCase().startsWith("/SETMYNAME")){
partyName = game.ui.playerTick.name}
else{
if(partyNameInput.value.toUpperCase().startsWith("/SETPARTYID")){
partyName = "Party" + game.ui.playerPartyId}
else{
if(partyNameInput.value.toUpperCase().includes("/&MYNAME")){
var val = partyNameInput.value;
var allWords = val.split(" ");
for(var i=0; i<allWords.length; i++){
  if(allWords[i].toUpperCase().includes("/&MYNAME")){
    allWords[i] = game.ui.playerTick.name;
}
}
partyName = allWords.join(" ");
}
else{
partyName = partyNameInput.value
}}
}
game.network.sendRpc({
name: "SetPartyName",
partyName: partyName})}
}, 250)
})();