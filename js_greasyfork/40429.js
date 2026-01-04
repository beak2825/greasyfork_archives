
// ==UserScript==
// @name         Automatic Bull Helmet, Spike & Heal Mod! DESTROY SERVERS EASILY with this!
// @namespace    -
// @version      2.0
// @description  Autoheal
// @author       Cloudy#9558,Mr.Undefined object "player"#0309
// @match        *://moomoo.io/*
// @match        http://dev.moomoo.io/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack5/4.0.1/msgpack5.js
// @downloadURL https://update.greasyfork.org/scripts/40429/Automatic%20Bull%20Helmet%2C%20Spike%20%20Heal%20Mod%21%20DESTROY%20SERVERS%20EASILY%20with%20this%21.user.js
// @updateURL https://update.greasyfork.org/scripts/40429/Automatic%20Bull%20Helmet%2C%20Spike%20%20Heal%20Mod%21%20DESTROY%20SERVERS%20EASILY%20with%20this%21.meta.js
// ==/UserScript==


const START_SSWX = [4, 132, 164, 116, 121, 112, 101, 2, 164, 100, 97, 116, 97, 147, 161, 52, 1, 192, 167, 111, 112, 116, 105, 111, 110, 115, 129, 168, 99, 111, 109, 112, 114, 101, 115, 115, 195, 163, 110, 115, 112, 161, 47];
const END_SSWX = [4, 132, 164, 116, 121, 112, 101, 2, 164, 100, 97, 116, 97, 147, 161, 52, 0, 192, 167, 111, 112, 116, 105, 111, 110, 115, 129, 168, 99, 111, 109, 112, 114, 101, 115, 115, 195, 163, 110, 115, 112, 161, 47];

const autoHealSpeed = 150; //Bigger number = SLOWER autoheal; fastest is 0

var justDied = false;
var ws;
var MYID;
var hasApple = true;
var foodInHand = false;
var autoheal = true;
var autobull = true;
var STATE = 0;

document.title = "Heal ON / Bull Hat OFF";

function encodeSEND(json){
    let OC = msgpack5().encode(json);
        var aAdd = Array.from(OC);
        aAdd.unshift(4);
        return new Uint8Array(aAdd).buffer;
}
function bullHelmet(status){
    var dataTemplate = {"data":[], "options":{"compress":false}, "nsp": "/", "type": 2};
    dataTemplate["data"]= ["13", 0, status == "on" ? 7 : 0, 0];
    //console.log(dataTemplate["data"]);
    let encoded = encodeSEND(dataTemplate);
    return encoded;
}


WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    if (!ws){
        ws = this;
        console.log("WS SET");
        socketFound(this);
    }
    let x = new Uint8Array(m);

    let x_arr_SSX = Array.from(x);
    if (x_arr_SSX.length === 43 && autobull){
         if (x_arr_SSX.every( (num, idx) => START_SSWX[idx]==num )){
             console.log("started swing");
             this.oldSend(bullHelmet("on"));
             spike();
         } else if (x_arr_SSX.every( (num, idx) => END_SSWX[idx]==num ) ){
             console.log("ended swing");
             this.oldSend(bullHelmet("off"));
         }
    }

    this.oldSend(m);
    let y = msgpack5().decode(x.slice(1, x.length)).data;
    //console.log("SENT");
    //console.log(y);
    let realData = msgpack5().decode(x.slice(1, x.length));
    //console.log(realData.data[0]);
    if (realData.data[0]=="5"){
        if (realData.data[1] == 0 || realData.data[1] == 1) foodInHand = !foodInHand;
        console.log(`Food in hand: ${foodInHand}`);

    } else if (realData.data[0]=="1"){
      console.log("user respawned");
       justDied = false;
    }
};

function socketFound(socket){
    socket.addEventListener('message', function(message){
        handleMessage(message);
    });
}

function isElementVisible(e) {
    return (e.offsetParent !== null);
}


function heal(){
    console.log(`HERE I AM IN THE HEAL FUNC with ${hasApple}`);
    var dataTemplate = {"data":[], "options":{"compress":false}, "nsp": "/", "type": 2};
    if (hasApple){
        if (!haveApple()){
            heal();
            return;
        }
        else { //User has apple
            var data2 = dataTemplate;
            data2['data'] = ["5", 0, null];
            ws.send(encodeSEND(data2));

        }
    }
    else { //User has cookie
        console.log('user has cookie');
            var data2 = dataTemplate;
            data2['data'] = ["5", 1, null];
            ws.send(encodeSEND(data2));
    }
    dataTemplate["data"]=["4", 1, null];
    let encoded = encodeSEND(dataTemplate);
    ws.send(encoded);

}

function handleMessage(m){
    let td = new Uint8Array(m.data);
    //console.log(td);
    //console.log(td.slice(98,-1));
    var info = msgpack5().decode(td.slice(1, td.length)).data;


    if (info[0] == "1" && !MYID){
        MYID =  info[1];
    }

    if (info[0] == "10" && info[1] == MYID && autoheal){
          console.log("doing stuff");
        console.log(info);
        if (info[2] < 100 && info[2] > 0){
       console.log("RECEIVED:");
        console.log(info);
       console.log("heal notif sent");
       setTimeout( () => {
           heal();
       }, autoHealSpeed);
        } else if (info[2] > 0) {
            var dataTemplate = {"type": 2, "data":[], "options":{"compress":false}, "nsp": "/"};
             dataTemplate["data"]=["4", 0, null];
            let encoded = encodeSEND(dataTemplate);
            ws.send(encoded);
        } else {
            hasApple = true; //You've died tragically in combat; back to the apple for you!
            console.log("Setting has apple to true from here")
        }
    }
    else if(info[0] == "11"){
        console.log("doing death");
        hasApple = true;
        justDied = true;

    }

}

function haveApple(){
    console.log("Im being used and justDied is:" + justDied);
    if (justDied){
        hasApple = true;
        return true;
    }
    if (hasApple) hasApple = isElementVisible(document.getElementById("actionBarItem11"));
    return hasApple;
}

function spike() {
    ws.send('42["5",5,null]');
    ws.send('42["4",1,null]');//SPIKE EVIL
    ws.send('42["4",0,null]');
}

document.addEventListener('keypress', (e)=>{
   if (e.keyCode == 116 && document.activeElement.id.toLowerCase() !== 'chatbox'){
       STATE+=1;
       let coreIndex = STATE%4;
       let truthArray = [ [1,2].includes(coreIndex), [0,1].includes(coreIndex)];
       autobull = truthArray[0];
       autoheal = truthArray[1];
       document.title = "Heal " + (autoheal ? "ON" : "OFF") + " / Bull Hat " + (autobull ? "ON" : "OFF");
   }
});