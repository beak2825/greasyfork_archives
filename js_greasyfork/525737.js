// ==UserScript==
// @name         Gartic.io Listen to WebSocket in Your Room
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  With this script, when you enter a room, you listen to the websocket. While in the game, you can send data to the game from the console with wsObj.send(). wsObj.id gives your current room id. wsObj.lengthID gives your id consisting of letters.
// @author       Mré
// @license      MIT
// @match        *://gartic.io/*
// @icon         https://see.fontimg.com/api/rf5/rvaw8/OTRjZDMyNDZkNzRiNDg3Njk3N2I3NzlmODRmOTY1ZTQudHRm/TXLDqSA/hidden.png?r=fs&h=490&w=1000&fg=B31008&bg=DEDEDE&tb=1&s=490
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/525737/Garticio%20Listen%20to%20WebSocket%20in%20Your%20Room.user.js
// @updateURL https://update.greasyfork.org/scripts/525737/Garticio%20Listen%20to%20WebSocket%20in%20Your%20Room.meta.js
// ==/UserScript==

let originalSend = WebSocket.prototype.send,setTrue=false;
window.wsObj={}

WebSocket.prototype.send=function(data){
console.log("Gönderilen Veri: "+data)
originalSend.apply(this, arguments)
if(Object.keys(window.wsObj).length==0){window.wsObj=this;window.eventAdd()}
};

window.eventAdd=()=>{
if(!setTrue){
setTrue=1
window.wsObj.addEventListener("message",(msg)=>{
try{
let data=JSON.parse(msg.data.slice(2))
console.log(data)
if(data[0]==5){
window.wsObj.lengthID=data[1]
window.wsObj.id=data[2]
window.wsObj.roomCode=data[3]
}
}catch(err){}
})
}
}