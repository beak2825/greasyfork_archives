// ==UserScript==
// @name         Moomoo.io Hack (2018)
// @namespace    -
// @version     11.1
// @description  Autoheal
// @author       Applmac#2910
// @match        *://moomoo.io/*
// @match        http://dev.moomoo.io/*
// @match        *sandbox.moomoo.io/*
// @grant        none
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @downloadURL https://update.greasyfork.org/scripts/372216/Moomooio%20Hack%20%282018%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372216/Moomooio%20Hack%20%282018%29.meta.js
// ==/UserScript==

const autoHealSpeed = 150; //Bigger number = SLOWER autoheal; fastest is 0.

const START_SSWX =  [146, 161, 97, 146, 1, 192];
const END_SSWX =  [146, 161, 97, 146, 0, 192];
const TAKEOUT = [4, 132, 164, 116, 121, 112, 101, 2, 164, 100, 97, 116, 97, 147, 161, 53, 15, 212, 0, 0, 167, 111, 112, 116, 105, 111, 110, 115, 129, 168, 99, 111, 109, 112, 114, 101, 115, 115, 195, 163, 110, 115, 112, 161, 47];
const APPLE = [4, 132, 164, 116, 121, 112, 101, 2, 164, 100, 97, 116, 97, 147, 161, 53, 0, 212, 0, 0, 167, 111, 112, 116, 105, 111, 110, 115, 129, 168, 99, 111, 109, 112, 114, 101, 115, 115, 195, 163, 110, 115, 112, 161, 47];
const COOKIE = [4, 132, 164, 116, 121, 112, 101, 2, 164, 100, 97, 116, 97, 147, 161, 53, 1, 212, 0, 0, 167, 111, 112, 116, 105, 111, 110, 115, 129, 168, 99, 111, 109, 112, 114, 101, 115, 115, 195, 163, 110, 115, 112, 161, 47];
const PIZZA =  [97, 117, 116, 111, 115, 112, 101, 101, 100]
var currentHat = 0;
var currentAccessory = 0;
var IN_PROCESS = false;
var justDied = false;
var recentHealth = 100;
var ws;
var MYID;
var hasApple = true;
var foodInHand = false;
var autoheal = true;
var autobull = false;
var STATE = 0;
var msgpack5 = msgpack;
var inInstaProcess = false;
var allMooMooObjects = {};
var bowWorked = false;
var myCLAN = null;
var goodData;
var myPlayer;
var nearestPlayerAngle = 0;
var MYANGLE = 0;
let coregood = [212, 0, 0, 167, 111, 112, 116, 105, 111, 110, 115, 129, 168, 99, 111, 109, 112];

let badreplace = [130, 166, 98, 117, 102, 102, 101, 114, 130, 164, 116, 121, 112, 101, 166, 66, 117, 102, 102, 101, 114, 164, 100, 97, 116, 97, 145, 0, 164, 116, 121, 112, 101, 0]
document.msgpack = msgpack;
function n(){
     this.buffer = new Uint8Array([0]);
     this.buffer.__proto__ = new Uint8Array;
     this.type = 0;
}

var nval = msgpack5.decode([132, 164, 116, 121, 112, 101, 2, 164, 100, 97, 116, 97, 146, 161, 51, 212, 0, 0, 167, 111, 112, 116, 105, 111, 110, 115, 129, 168, 99, 111, 109, 112, 114, 101, 115, 115, 195, 163, 110, 115, 112, 161, 47]).data[1];
document.n = nval;
document.timeTween = 130;

function replaceFromArray(oldp, newp, array){
  return array.join(",").replace(oldp.join(","), newp.join(",")).split(",").map(x => parseInt(x))

}

var playersNear = [];

var player = function(id, x, y, clan){
    this.id = id;
    this.x = x;
    this.y = y;
    this.clan = clan;
}





function healthFunction(t, a) {
  return Math.abs(((t + a/2) % a) - a/2);
}

function encodeSEND(json){
    let OC = msgpack5.encode(json);
    var aAdd =  Array.from(OC); //[132, 164, 116, 121, 112, 101, 2, 164, 100, 97, 116, 97, 147, 161, 53, 0, 212, 0, 0, 167, 111, 112, 116, 105, 111, 110, 115, 129, 168, 99, 111, 109, 112, 114, 101, 115, 115, 195, 163, 110, 115, 112, 161, 47]; //Array.from(OC);
    return new Uint8Array(aAdd).buffer;
}





function bullHelmet2(status){
    console.info(status);
    var dataTemplate = {"data":[], "options":{"compress":true}, "nsp": "/", "type": 2};
    if (!status.includes("m")){
        dataTemplate["data"] = ["13s", [0, status == "on" ? 7  : currentHat, 0]];
    } else {
        if (currentAccessory == 11){
            console.info("HERE2");
            dataTemplate["data"] = ["13s", [0, status == "mOn" ? 11: 0, 1]];
        } else {
             console.info("HERE");
             dataTemplate["data"] = ["13s", [0, currentAccessory, 1]];
        }
    }
    console.info(dataTemplate["data"]);
    let encoded = encodeSEND(dataTemplate["data"]);
    return encoded;
}


WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    //console.info(new Uint8Array(m));

    if (!ws){
        document.ws = this;

        ws = this;
        console.info("WS SET");
        socketFound(this);
    }


      if (inInstaProcess){
           this.oldSend(m);
           console.log("here");
           return;
        }
    let x = new Uint8Array(m);
    this.oldSend(m);
    //console.info(x);
    let x_arr_SSX = Array.from(x);
    console.log(x_arr_SSX);
    if (x_arr_SSX.length === 6 && autobull){
         if (x_arr_SSX.every( (num, idx) => START_SSWX[idx]==num )){
             console.info("started swing");
             IN_PROCESS = true;
             this.oldSend(bullHelmet2("on"));
             this.oldSend(bullHelmet2("mOff"));
         } else if (x_arr_SSX.every( (num, idx) => END_SSWX[idx]==num ) ){
             console.info("ended swing");
             this.oldSend(bullHelmet2("off"));
             this.oldSend(bullHelmet2("mOn"));
             IN_PROCESS = false;
         }
    }


    /*let usageArray = Array.from(new Uint8Array(m));
    if (usageArray.length == 45){
        if (usageArray[16] == 0 || usageArray[16] == 1) foodInHand = false;
        console.info(`Food in hand: null{foodInHand}`);

    };*/

    let realData = {}
    let realInfo = msgpack5.decode(x);
    if (realInfo[1] instanceof Array){
    realData.data = [realInfo[0], ...realInfo[1]]
    } else {
        realData.data = realInfo
    }
    //console.log(realData)
    //console.info("sent");
    //console.info(realData.data);
     if(realData.data[0]!="2")  {
         console.info("HERE3");
       console.info(realData.data[0])
      console.info(realData.data);
         console.log(x);
    if (realData.data[0]=="3"){
         //console.info(realData.data[1]);
         /*console.info(new Uint8Array(m));
         if(typeof realData.data[1] != "number" && !nval){
             nval = realData.data[1];
             document.n = nval;
             console.info("SET NVAL to");
             console.info(nval);


         }*/
        /*console.info(typeof realData.data[2]);
        console.info(realData.data[2].buffer);
        goodData = realData.data;
        console.info(goodData);
        console.info(["5", 0, nval]);
        document.n = goodData[2];
        document.nval = nval*/
    }
     }
    //console.info(new Date().getTime());
    if (realData.data[0]=="1"){
      console.info("user respawned");
       for (var elem of Object.values(allMooMooObjects)){
           console.info(elem);
          elem.style.opacity = 1;
        }
       justDied = false;
    } else if (realData.data[0]=="13s"){
        console.info("In Hat Part");
        console.info(realData);
        console.info(IN_PROCESS);
        console.info(realData.data);
        console.info("test");
        if (!IN_PROCESS && realData.data.length == 4 && realData.data[3]==0 &&realData.data[1]==0){
            currentHat = realData.data[2];
            console.info("Changed hat to " + currentHat);

        } else if (!IN_PROCESS && realData.data.length == 4 && realData.data[3]==1 &&realData.data[1]==0){
            currentAccessory = realData.data[2];
            console.info("Changed accessory to " + currentAccessory);
        }

    } else if (realData.data[0]=="2"){
      MYANGLE = realData.data[1];
    } else if (realData.data[0]=="5") {
       console.info("hai");
        console.info(new Uint8Array(m));
        console.info(realData.data);
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
    console.log("healing");
    if (recentHealth>=100) return;
    console.info(recentHealth);
    console.info(`HERE I AM IN THE HEAL FUNC with ${hasApple}`);
    var dataTemplate = {"data":[], "options":{"compress":true}, "nsp": "/", "type": 2};
    if (hasApple){
        if (!haveApple()){
            heal();
            return;
        }
        else { //User has apple
            var data2 = dataTemplate;
            data2['data'] = goodData != undefined ? goodData : ["5", [0, null]];
            ws.send(encodeSEND(data2['data']));

        }
    }
    else { //User has cookie
        console.info('user has cookie');
            var data3 = dataTemplate;
            data3['data'] = ["5", [1, null]];
            ws.send(encodeSEND(data3['data']));
    }
    var datasave = dataTemplate;
    dataTemplate["data"]=["a", [1, null]];
    let encoded = encodeSEND(dataTemplate['data']);
    setTimeout( () => {
    ws.send(encoded);
    }, 0);

    datasave["data"]=["a", [0, null]];
    let encodedsave = encodeSEND(datasave['data']);
    setTimeout( () => {
    ws.send(encodedsave);
    }, 100);
    recentHealth += hasApple ? 20 : 40;

}

function handleMessage(m){
    let td = new Uint8Array(m.data);
//      console.info(td);
    //console.info(td);
    //console.info(td.slice(98,-1));
    var infotest = msgpack5.decode(td);
    var info;
    if(infotest.length > 1) {
        info = [infotest[0], ...infotest[1]];
        if (info[1] instanceof Array){
             info = info;
        }
    } else {
        info = infotest;
    }
//    console.log(info);
   //console.info("received");
    //console.info(new Date().getTime());
    if(!info) return;
    if(!["a","5", "3"].includes(info[0])) console.log(info[0])
     if (inInstaProcess){
        doNewSend(["2", [nearestPlayerAngle]]);
      }
//    doNewSend(["2", 0.45]);
    if (info[0]=="3"){ //player update
        playersNear = [];
        var locInfoNow = info[1];
        console.log(locInfoNow)
        //console.info(locInfoNow);
        for (var i=0;i<locInfoNow.length/13;i++){
            var playerData = locInfoNow.slice(13*i, 13*i+13);
            if (playerData[0]==MYID){
                myCLAN = playerData[7];
                myPlayer = new player(playerData[0], playerData[1], playerData[2], playerData[7]);
                continue
            }
            if (playerData[7]===null || playerData[7] != myCLAN){
                 var locPlayer = new player(playerData[0], playerData[1], playerData[2], playerData[7]);
                 playersNear.push(locPlayer);
            }

        }
         var nearestPlayerPosition = playersNear.sort( (a,b) => pdist(a, myPlayer) - pdist(b, myPlayer) );
           var nearestPlayer = nearestPlayerPosition[0];
           if (nearestPlayer){
               nearestPlayerAngle = Math.atan2( nearestPlayer.y-myPlayer.y, nearestPlayer.x-myPlayer.x);
           }

    }

    /*if (info[0]=="6"){
        var locInfo = info[1];
        if (locInfo[locInfo.length-1].toString() == MYID){ //Object created
        if (window.innerWidth >= 770){
            var itemID = `actionBarItem${locInfo[locInfo.length-2]+13}`;
            var imgURL = document.getElementById(itemID).style.backgroundImage.toString().match(/url\("(.+)?(?=")/)[1];
            console.info(imgURL);
            let mapDisplay = document.getElementById("mapDisplay").getBoundingClientRect();
            let mapSize = [14365, 14365];
            let boxSize = [130, 130];
            let targets = [locInfo[1], locInfo[2]].map(item => (130*item)/14365);
            let x = targets[0] + mapDisplay.x - 6;
            let y = targets[1] + mapDisplay.y - 6;
            let newTarget = document.createElement("div");
            newTarget.style = `background-image: url("${imgURL}"); background-size: 12px 12px; width:12px; height:12px; position:absolute; left: ${x}px; top:${y}px; z-index:100`;
            newTarget.className = "mapTarget";
            document.getElementsByTagName("body")[0].appendChild(newTarget);
            allMooMooObjects[locInfo[0]] = newTarget;

        }
    }
    }*/

    if (info[0]=="12"){
       if (Object.keys(allMooMooObjects).includes(info[1].toString())){
            allMooMooObjects[info[1]].remove();
      }
    }

//    console.info("-------------")
    if (info[0] == "1" && !MYID){
        MYID =  info[1];
    }


    if (info[0] == "18" && info[4]=="1200") {
        console.info(info);
      bowWorked = true;
    }

    if (info[0] == "10" && info[1] == MYID && autoheal){
          console.info("doing stuff");
        console.info(info);
        if (info[2] < 100 && info[2] > 0){
       recentHealth = info[2];
       console.info("RECEIVED:");
        console.info(info);
        //recentHealth += hasApple ? 20 : 40;
       console.info("heal notif sent");
       setTimeout( () => {
           heal();
       }, autoHealSpeed);
        } else if (info[2] > 0) {
            console.info("done healing");
            recentHealth = 100;
            if (foodInHand){
               console.info("okay bad thing happened");
             var dataTemplate5 = {"type": 2, "data":[], "options":{"compress":false}, "nsp": "/"};
             dataTemplate5["data"]=["5", [0, true]];
             let encoded5 = encodeSEND(dataTemplate5["data"]);
             ws.send(encoded5);
                console.info("corrected bad thing");
            }

        } else {
            hasApple = true; //You've died tragically in combat; back to the apple for you!
            console.info("Setting has apple to true from here");
        }
    }
    else if(info[0] == "11"){
        console.info("doing death");
        for (var elem of Object.values(allMooMooObjects)){
           console.info(elem);
          elem.style.opacity = 0;
        }
        hasApple = true;
        justDied = true;
        recentHealth = 100;

    }

}

function pdist(player1, player2){
      return Math.sqrt( Math.pow((player2.y-player1.y), 2) + Math.pow((player2.x-player1.x), 2) );
}

function haveApple(){
    console.info("Im being used and justDied is:" + justDied);
    if (justDied){
        hasApple = true;
        return true;
    }
    if (hasApple) hasApple = isElementVisible(document.getElementById("actionBarItem15"));
    return hasApple;
}

function havePoison(){
    let hasPoison = true;
    if (hasPoison) hasPoison = isElementVisible(document.getElementById("actionBarItem23"));
    return hasPoison;
}

function haveGreat(){
    let hasGreat = true;
    if (hasGreat) hasGreat = isElementVisible(document.getElementById("actionBarItem22"));
    return hasGreat;
}

function haveSpinning(){
    let hasSpinning = true;
    if (hasSpinning) hasSpinning = isElementVisible(document.getElementById("actionBarItem24"));
    return hasSpinning;
}

function doNewSend(sender){
    ws.send(encodeSEND(sender));
}

function placeSpike(item){
  ws.send(encodeSEND( ["5", [item, null] ]));
  ws.send(encodeSEND([
  "a",
  [
    1,
    null
  ]
]));

  ws.send(encodeSEND([
  "a",
  [
    0,
    null
  ]
])); //spike function by
}

document.dns = doNewSend;

document.title="Heal ON / Bull Hat OFF"

document.addEventListener('keypress', (e)=>{

   if (e.keyCode == 116 && document.activeElement.id.toLowerCase() !== 'chatbox'){
       STATE+=1;
       let coreIndex = STATE%4;
       let truthArray = [ [1,2].includes(coreIndex), [0,1].includes(coreIndex)];
       autobull = truthArray[0];
       autoheal = truthArray[1];
       document.title = "Heal " + (autoheal ? "ON" : "OFF") + " / Bull Hat " + (autobull ? "ON" : "OFF");
   } else if (e.keyCode == 102 && document.activeElement.id.toLowerCase() !== 'chatbox') {
       console.log("UH OH")
        var dataTemplate = {"data":[], "options":{"compress":true}, "nsp": "/", "type": 2};
        var data50 = dataTemplate;
        data50["data"]=["5", [15, 0]];
        ws.send(encodeSEND(data50["data"]));
        var data51 = dataTemplate;
        data51["data"]=[
  "a",
  [
    1,
    null
  ]
];
        let encoded2 = encodeSEND(data51["data"]);
        ws.send(encoded2);
        dataTemplate["data"]=["a",0, null];
        let encoded = encodeSEND(dataTemplate);
        ws.send(encoded);

      } else if (e.keyCode == 118 && document.activeElement.id.toLowerCase() !== 'chatbox') {
           if (havePoison()) {
             placeSpike(8);
           } else if (haveGreat()){
             placeSpike(7);
           } else if (haveSpinning()){
             placeSpike(9);
           } else {
             placeSpike(6);
         }

   } else if (e.keyCode == 114 && document.activeElement.id.toLowerCase() !== 'chatbox') {
       console.info(currentAccessory);
       var ctime = new Date().getTime();
       console.info(inInstaProcess)
       if (!inInstaProcess){
       console.info("got in");
       inInstaProcess = true
        IN_PROCESS = true;

       doNewSend(["13s", [0, 7, 0]]);
          if (currentAccessory == 11){
               doNewSend(["13s", [0, 0, 1]]);
           }
       doNewSend(["5", [5, true]]);
       console.info("Starting at 0");

      //after bad


       setTimeout( () => {
           doNewSend(["2", [nearestPlayerAngle]]);
           doNewSend([
  "a",
  [
    1,
    null
  ]
]); //If we're perfect, we only send this once
           console.info(`Sending swing at ${new Date().getTime() - ctime}`);
           ctime = new Date().getTime();
       }, 20);



       setTimeout( () => {
           doNewSend(["2", [nearestPlayerAngle]]);
           doNewSend(["5", [12, true]]);
           console.info(`Changed weapon at ${new Date().getTime() - ctime}`);
           ctime = new Date().getTime();
       }, document.timeTween); //120-140?




       setTimeout( () => {
           doNewSend(["a", [0, null]]);
           doNewSend(["13s", [0, currentHat, 0]]);
           if (currentAccessory == 11){
                doNewSend(["13s", [0, currentAccessory, 1]]);
                    }
           doNewSend(["5", [5, true]]);
           console.info(`Finished at  ${new Date().getTime() - ctime}`);
           ctime = new Date().getTime();
       }, 600);

        setTimeout( () => {
          if (bowWorked){
          doNewSend(["5", [12, true]]);
        }
       }, 730);

        setTimeout( () => {
          if (bowWorked){
          doNewSend([
  "a",
  [
    1,
    null
  ]
]);
        }
       }, 840);

      setTimeout( () => {
           if (bowWorked){
          doNewSend(["a", [0, null]]);
        }
       }, 950);

      setTimeout( () => {
          inInstaProcess = false;
          if (bowWorked){
         doNewSend(["5",  [5, true]]);
              setTimeout( () => {
         doNewSend(["a", [0, null]]);
              }, 300);
         bowWorked = false;
         IN_PROCESS = false;
       }
        IN_PROCESS = false;
       }, 1060);

    //if it worked, fire, if it didn't dont fire
       }

//IT WORKS ON AND OFF
//    WTF ??!?!?

   }
});