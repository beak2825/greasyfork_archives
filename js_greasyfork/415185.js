// ==UserScript==
// @name         ikometa
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  try to take over the world!
// @author       You
// @run-at       document-start
// @match        http://petridish.pw/ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415185/ikometa.user.js
// @updateURL https://update.greasyfork.org/scripts/415185/ikometa.meta.js
// ==/UserScript==

console.log("observer mutation")
var p = {};
var m = {
    registerObserver: function() {
        if (typeof(window.WebKitMutationObserver) == 'undefined') return;
        p.observer = new window.WebKitMutationObserver(function(mutationRecords) {
            mutationRecords.forEach(function(mutationRecord) {
                for (var i = 0; i < mutationRecord.addedNodes.length; ++i) {
                    checkNode(mutationRecord.addedNodes[i]);
                }
            });
        });
        p.observer.observe(window.document, {
            subtree: true,
            childList: true,
            attribute: false
        });
    }
};

m.registerObserver();
function checkNode(node) {


    var tag = node.parentElement ? node.parentElement.tagName : "";

    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
            node.textContent = node.textContent.replace(/ > zoom/g, ' > zoom && false');
            node.textContent = node.textContent.replaceAll('if (isFB == 1) { event.preventDefault(); }', 'if(0.1 > zoom) { zoom = 0.1; }\nif (isFB == 0.1) { event.preventDefault(); }');
    }
if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
            node.textContent = node.textContent.replaceAll(' function drawBorders(ctx) {', `function drawBorders(ctx) {         ctx.save();
        ctx.beginPath();
        ctx.fillStyle = '#360101';
        ctx.rect(-mapmaxX, -mapmaxY, mapmaxX * 3, mapmaxY);
        ctx.rect(mapmaxX, 0, mapmaxX, mapmaxY * 2);
        ctx.rect(-mapmaxX, 0, mapmaxX, mapmaxY * 2);
        ctx.rect(0, mapmaxY, mapmaxX, mapmaxY);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(0, 0, mapmaxX, mapmaxY);
        ctx.restore();`);
    }
 if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
            node.textContent = node.textContent.replaceAll(`if (users[i].name == 'Congratulations') {`, `if (users[i].name == 'Game starting in') {`);
    }
if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
            node.textContent = node.textContent.replace(`'black hole':'blackhole2',`, `'black hole':'geo1',`);
}
if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
            node.textContent = node.textContent.replaceAll(`anus`, `white hole`);
}};

(function() {
    'use strict';

    var socket, feeding;

    addEventListener('keydown', evt => {
        if(evt.key === 'q'){
            feeding = true;
        }
    });

    addEventListener('keyup', evt => {
        if(evt.key === 'q'){
            feeding = false;
        }
    });

    const send = WebSocket.prototype.send, feed_msg = Uint8Array.from([21]);
    WebSocket.prototype.send = function(packet){
        if(packet && packet.constructor === ArrayBuffer){
            socket = this;
        }
        return send.call(this, packet);
    };

    setInterval(() => {
        if(feeding){
            socket.send(feed_msg);
        }
    }, 0);
})();
setTimeout(function() {
let count = 0
setInterval(() =>{
    let texts = [...document.documentElement.innerText.match(/white hole: !i/g)].length
    if(texts === count) return
    count = texts
    javascript:insert('@ikometa','');
}, 1000)
setInterval(() =>{
    let texts = [...document.documentElement.innerText.match(/white hole: !kick/g)]
    if(texts === count) return
    count = texts
    javascript:insert('kick 10sec','');
    clickColor("#000066",7)
}, 2000)
setInterval(() =>{
    let texts = [...document.documentElement.innerText.match(/white hole: !ban/g)]
    if(texts === count) return
    count = texts
    javascript:insert('Я долбаеб!','');
    clickColor("#000066",7)
}, 100)
}, 10000);



let count = 0
setInterval(() =>{
    let texts = [...document.documentElement.innerText.match(/white hole: !chekservers/g)].length
    if(texts === count) return
    count = texts
		setTimeout(function() {
 location.reload()
}, 60000)
var snakeIp = ["snakerdish1.petridish.pw:8080","snakerdish3.petridish.pw:8080","fastfood1.petridish.pw:8080","fastfood2.petridish.pw:8080","fastfood11.petridish.pw:8080","megasplit1.petridish.pw:8080","megasplit2.petridish.pw:8080","megasplit3.petridish.pw:8080","megasplit10.petridish.pw:8080","megasplit27.petridish.pw:8080","megasplit30.petridish.pw:8080","megasplit40.petridish.pw:8080","hardcore2.petridish.pw:8080","hardcore3.petridish.pw:8080","hardcore4.petridish.pw:8080","hardcore5.petridish.pw:8080","hardcore6.petridish.pw:8080","hardcore7.petridish.pw:8080","hardcore8.petridish.pw:8080","hardcore10.petridish.pw:8080","hardcore12.petridish.pw:8080","hardcore26.petridish.pw:8080","extreme7.petridish.pw:8080","exp1.petridish.pw:8080","exp8.petridish.pw:8080","exp9.petridish.pw:8080","crazysplit2.petridish.pw:8080","crazysplit3new.petridish.pw:8080","crazysplit3.petridish.pw:8080","crazysplit4.petridish.pw:8080","crazysplit5.petridish.pw:8080","crazysplit6.petridish.pw:8080","crazysplit7.petridish.pw:8080","crazysplit8.petridish.pw:8080","crazysplit9.petridish.pw:8080","crazysplit10.petridish.pw:8080","crazysplit11.petridish.pw:8080","crazysplit12.petridish.pw:8080","crazysplit13.petridish.pw:8080","crazysplit14.petridish.pw:8080","crazysplit15.petridish.pw:8080","crazysplit16.petridish.pw:8080","crazysplit17.petridish.pw:8080","crazysplit18.petridish.pw:8080","hardcoreexp1.petridish.pw:8080","hardcoreexp2.petridish.pw:8080","hardcoreexp3.petridish.pw:8080","hardcoreexp4.petridish.pw:8080","hardcoreexp5.petridish.pw:8080","hardcoreexp6.petridish.pw:8080","hardcoreexp7.petridish.pw:8080","hardcoreexp8.petridish.pw:8080","hardcoreexp9.petridish.pw:8080","hardcoreexp10.petridish.pw:8080","hardcoreexp21.petridish.pw:8080","hardcoreexp22.petridish.pw:8080","hardcoreexp41.petridish.pw:8080","hardcoreexp50.petridish.pw:8080","crazy1.petridish.pw:8080","crazy2.petridish.pw:8080","blackhole1.petridish.pw:8080","blackhole4.petridish.pw:8080","blackhole5.petridish.pw:8080","blackhole6.petridish.pw:8080","blackhole7.petridish.pw:8080","blackhole8.petridish.pw:8080","blackhole9.petridish.pw:8080","viruswarsffa1.petridish.pw:8080"] ;
var nomerOfSnake = 0 ;
var i = 0 ;
function checkSnakes() {
connnspec(snakeIp[nomerOfSnake],0);
nomerOfSnake++ ;
var timerId = setTimeout(function() {checkSnakes()}, 1000)
if (nomerOfSnake > snakeIp.lenght) {
clearInterval(timerId) ;
}
}
checkSnakes() ;
}, 1000);