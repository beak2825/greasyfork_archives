// ==UserScript==
// @name         moomoo aim + heal
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30713/moomoo%20aim%20%2B%20heal.user.js
// @updateURL https://update.greasyfork.org/scripts/30713/moomoo%20aim%20%2B%20heal.meta.js
// ==/UserScript==
 
var playersNear = [];
var ws;
var id;
var user;
var canvas = document.querySelector("#gameCanvas");
var hasApple = true;
var currentTarget;
 
function Player(id, x, y, tribe){
    this.id = id;
    this.x = x;
    this.y = y;
    this.tribe = tribe;
}
 
Player.prototype.getAngle = function(){
    return Math.atan2(this.deltaY, this.deltaX);
};
 
Player.prototype.getDistance = function(){
    return Math.sqrt(Math.pow(this.deltaX, 2) + Math.pow(this.deltaY, 2));
};
 
function lookAtPointRelativeToCharacter(x, y){
    var centerX = innerWidth / 2;
    var centerY = innerHeight / 2;
    canvas.dispatchEvent(new MouseEvent("mousemove", {
        clientX: centerX + x,
        clientY: centerY + y
    }));
}
 
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    var parsed = parseWSMsg(m);
    if (currentTarget && parsed[0] === "2" && Math.abs(currentTarget.getAngle() - parsed[1]) > 0.0872665){
        aimAt(currentTarget);
        console.log("mouse moved");
    }
    this.oldSend(m);
    if (!ws){
        ws = this;
        socketFound(this);
    }
};
 
function socketFound(socket){
    console.log("found socket object");
    socket.addEventListener('message', function(e){
        handleMessage(e);
    });
}
 
function handleMessage(e){
    var m = e.data;
    //console.log(m);
    var parsed = parseWSMsg(m);
    if (parsed[0] === "3"){ //position update
        playersNear = [];
        var data = parsed[1];
        for (var i = 0; i < data.length ; i += 11) { //loop to assign chunks of the array to a player
            var playerData = data.slice(i, i + 11);
            var player = new Player(playerData[0], playerData[1], playerData[2], playerData[6]);
            if (player.id !== id) playersNear.push(player);
            else user = player;
        }
        currentTarget = null;
        if (playersNear.length > 0){
            var closestPlayer = getClosestPlayer();
            if (closestPlayer.getDistance() < 200 && (closestPlayer.tribe !== user.tribe || user.tribe === null)) aimAt(closestPlayer);
        }
    }
    if (parsed[0] === "1" && !id){
        id = parsed[1];
        console.log("id found: " + id);
    }
    if (parsed[0] === "10" && parsed[1] === id && parsed[2] !== 100){
        heal();
    }
}
 
function aimAt(target){
    lookAtPointRelativeToCharacter(target.deltaX, target.deltaY);
    currentTarget = target;
}
 
function getClosestPlayer(){
    var closestPlayer;
    for (var i = 0 ; i < playersNear.length; i++){
        var currentPlayer = playersNear[i];
        currentPlayer.deltaX = currentPlayer.x - user.x;
        currentPlayer.deltaY = currentPlayer.y - user.y;
        if (i === 0 || currentPlayer.getDistance() < closestPlayer.getDistance()){
            closestPlayer = currentPlayer;
        }
    }
    return closestPlayer;
}
 
function parseWSMsg(s){
    if (s.indexOf("42") === -1) return -1;
    var o = s.substring(s.indexOf("["));
    return JSON.parse(o);
}
 
function heal(){
    console.log("healing");
    if (hasApple){
        if (!haveApple()){
            heal();
            return;
        }
        else ws.send("42[\"5\",0,null]");
    }
    else ws.send("42[\"5\",1,null]");
    ws.send("42[\"4\",1,null]");
}
 
function haveApple(){
    if (hasApple) hasApple = isElementVisible(document.getElementById("actionBarItem9"));
    return hasApple;
}
 
function isElementVisible(e) {
    return (e.offsetParent !== null);
}