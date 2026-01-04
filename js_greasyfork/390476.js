// ==UserScript==
// @name         moomoo.io auto aim / aimbot and auto heal!
// @namespace    -
// @version      1.2
// @description  aims at nearest player and heals when you're hurt (Toggle key: I)
// @author       Andrew Nguyen
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390476/moomooio%20auto%20aim%20%20aimbot%20and%20auto%20heal%21.user.js
// @updateURL https://update.greasyfork.org/scripts/390476/moomooio%20auto%20aim%20%20aimbot%20and%20auto%20heal%21.meta.js
// ==/UserScript==


var EnumStates = {
    NONE : -1,
    HEAL : 100,
    AIM : 1,
    BOTH : 2
};

var playersNear = [];
var ws;
var id;
var f = 0;
var user;
var canvas = document.querySelector("#gameCanvas");
var hasApple = true;
var currentTarget;
var state = EnumStates.BOTH;

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
    this.oldSend(currentTarget && parsed[0] === "2" ? "42[\"2\"," + currentTarget.getAngle() + "]" : m);
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
        for (var i = 0; i < data.length ; i += 12) { //loop to assign chunks of the array to a player
            var playerData = data.slice(i, i + 12);
            var player = new Player(playerData[0], playerData[1], playerData[2], playerData[7]);
            //console.log(player.id,player.x,player.y);
            if (player.id !== id) playersNear.push(player);
            else user = player;
        }
        if (currentTarget) currentTarget = null; //reset it, it'll be updated soon
        if ((state === EnumStates.AIM || state === EnumStates.BOTH) && playersNear.length > 0){
            var closestPlayer = getClosestPlayer();
            if (closestPlayer.getDistance() < 200 && (closestPlayer.tribe !== user.tribe || user.tribe === null)) aimAt(closestPlayer);
        }
    }
    if (parsed[0] === "1" && !id){
        id = parsed[1];
        console.log("id found: " + id);
    }
    if (parsed[0] === "10" && parsed[1] === id && parsed[2] !== 100 && (state === EnumStates.HEAL || state === EnumStates.BOTH)){
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

document.addEventListener('keydown', function(e){
    if (e.keyCode === 73 && document.activeElement.id.toLowerCase() !== 'chatbox'){ //Toggle key is I
        changeState();
    }
});

function changeState(){
    if (state === EnumStates.BOTH) state = EnumStates.NONE;
    else state++;
    var t;
    switch (state){
        case EnumStates.NONE:
            t = "Aim + heal off";
            break;
        case EnumStates.HEAL:
            t = "Heal on";
            break;
        case EnumStates.AIM:
            t = "Aim on";
            break;
        case EnumStates.BOTH:
            t = "Aim + heal on";
    }
    document.title = t;
    revertTitle();
}

function revertTitle(){
    f++;
    setTimeout(function(){
        f--;
        if (!f) {
            document.title = "Moo Moo";
        }
    }, 1500);
}