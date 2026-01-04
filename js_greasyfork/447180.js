// ==UserScript==
// @name         show full race track
// @namespace    http://tampermonkey.net/
// @version      0.10.1
// @description  shows full race track on top
// @author       Reverse NT
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license  MIT
// @run-at           document-start
// @downloadURL https://update.greasyfork.org/scripts/447180/show%20full%20race%20track.user.js
// @updateURL https://update.greasyfork.org/scripts/447180/show%20full%20race%20track.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pos1=0;
    var pos2=0;
    var pos3=0;
    var pos4=0;
    var pos5=0;
    var counter=0
    var posuid=0
var userID=JSON.parse(JSON.parse(window.localStorage['persist:nt'])['user'])['userID']
console.log(userID)
const sockets = [];
const nativeWebSocket = window.WebSocket;
window.WebSocket = function(...args){
  const socket = new nativeWebSocket(...args);
  sockets.push(socket);
  return socket;
};
function sleep(s) {
  var ms = s*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function main(ws) {
    console.log('Message from server ', event.data);
    var message = event.data;
    message=message.slice(1)
canvas = document.createElement('canvas');
canvas.style.position = "absolute";
canvas.style.left = "0px";
canvas.style.top = "0px";
canvas.style.zIndex = "100";
canvas.style.background = 'grey';
canvas.width=1025;
canvas.height=200;
ctx = canvas.getContext("2d");
ctx.strokeStyle = "#ffffff";
ctx.fillStyle = "#ffffff";
    counter=1
for (const i in JSON.parse(message)['payload']['racers']){
    if (JSON.parse(message)['payload']['racers'][i]['u']==(userID)){
        posuid=counter
    }
    console.log('123'+JSON.parse(i))
    counter+=1
}
    if (posuid==1)
{
    ctx.fillStyle = "#ff0000";
    ctx.strokeStyle ='#ff0000'
}
ctx.beginPath();
         console.log(JSON.parse(message)['payload'])
pos1=JSON.parse(message)['payload']['racers'][0]['p']*1000+25
    pos2=JSON.parse(message)['payload']['racers'][1]['p']*1000+25
    pos3=JSON.parse(message)['payload']['racers'][2]['p']*1000+25
    pos4=JSON.parse(message)['payload']['racers'][3]['p']*1000+25
    pos5=JSON.parse(message)['payload']['racers'][4]['p']*1000+25

    ctx.rect(pos1, 10, 30, 15);
    ctx.stroke();
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
ctx.fillStyle = "#FFFFFF";
if (posuid==2)
{
    ctx.fillStyle = "#ff0000";
    ctx.strokeStyle ='#ff0000'
}
    ctx.beginPath()
ctx.rect(pos2, 30, 30, 15);
    ctx.stroke();
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
ctx.fillStyle = "#FFFFFF";
    if (posuid==3)
{
    ctx.fillStyle = "#ff0000";
    ctx.strokeStyle ='#ff0000'
}

    ctx.beginPath()
ctx.rect(pos3, 50, 30, 15);
    ctx.stroke();
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
ctx.fillStyle = "#FFFFFF";
        if (posuid==4)
{
    ctx.fillStyle = "#ff0000";
    ctx.strokeStyle ='#ff0000'
}
    ctx.beginPath()
ctx.rect(pos4, 70, 30, 15);
    ctx.stroke();
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
ctx.fillStyle = "#FFFFFF";
        if (posuid==5)
{
    ctx.fillStyle = "#ff0000";
    ctx.strokeStyle ='#ff0000'
}
    ctx.beginPath()
ctx.rect(pos5, 90, 30, 15);
ctx.fill();
ctx.stroke();
document.querySelector('.ad--container').appendChild(canvas)
                    var sleeptime = randrange(int(sleep1), int(sleep2)) / 10000000 //sleep between each character at a random interval according to the WPM
                    await sleep(sleeptime)



        ws.close()

  var words = scan_for_text(message)
  if (words) {
      await type(words, wpm, accuracy)
      location.reload();
  }
}
setTimeout( function () {
    var ws = sockets[0];
    ws.addEventListener('message', async function(event) {await main(ws, event)});
}, 5000)
    var canvas=0
    var ctx=0
    var player1=0
})();