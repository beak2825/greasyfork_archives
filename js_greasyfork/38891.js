// ==UserScript==
// @name         MOOMOO.IO AUTOHEAL + numpad hat mod 
// @namespace    -
// @version      2.2
// @description  Autoheal credit for auto heal gose to night and hat mod gose to Perussi. use numpads to equip hats u can press the number pad keys and see on top of tab withc eache one dose. 
// @author       frostynuts
// @match        *://moomoo.io/*
// @match        http://dev.moomoo.io/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack5/4.0.1/msgpack5.js
// @downloadURL https://update.greasyfork.org/scripts/38891/MOOMOOIO%20AUTOHEAL%20%2B%20numpad%20hat%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/38891/MOOMOOIO%20AUTOHEAL%20%2B%20numpad%20hat%20mod.meta.js
// ==/UserScript==



var ws;
var MYID;
var hasApple = true;
var foodInHand = false;
var autoheal = true;

document.title = "Moo Moo -- Autoheal ON";

function encodeSEND(json){
    let OC = msgpack5().encode(json);
        var aAdd = Array.from(OC);
        aAdd.unshift(4);
        return new Uint8Array(aAdd).buffer;
}

WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    this.oldSend(m);
    let x = new Uint8Array(m);
    let realData = msgpack5().decode(x.slice(1, x.length));
    console.log(realData.data[0]);
    if (realData.data[0]=="5"){
        if (realData.data[1] == 0 || realData.data[1] == 1) foodInHand = !foodInHand;
        console.log(`Food in hand: ${foodInHand}`);

    }
    if (!ws){
        ws = this;
        socketFound(this);
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
    console.log("HERE I AM IN THE HEAL FUNC.");
    var dataTemplate = {"type": 2, "data":[], "options":{"compress":false}, "nsp": "/"};
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
    var info = msgpack5().decode(td.slice(1, td.length)).data;

    if (info[0] == "1" && !MYID){
        MYID =  info[1];
    }

     console.log(info[0]);
    if (info[0] == "10" && info[1] == MYID && autoheal){
        if (info[2] < 100 && info[2] > 0){
       console.log("RECEIVED:");
        console.log(info);
       setTimeout( () => {
           heal();
       }, 167);
        } else if (info[2] > 0) {
            var dataTemplate = {"type": 2, "data":[], "options":{"compress":false}, "nsp": "/"};
             dataTemplate["data"]=["4", 0, null];
            let encoded = encodeSEND(dataTemplate);
            ws.send(encoded);
        } else {
            hasApple = true; //You've died tragically in combat; back to the apple for you!
        }
    }
    else if(info[0] == "11"){
        hasApple = true;
    }

}

function haveApple(){
    if (hasApple) hasApple = isElementVisible(document.getElementById("actionBarItem11"));
    return hasApple;
}

document.addEventListener('keypress', (e)=>{
   if (e.keyCode == 116 && document.activeElement.id.toLowerCase() !== 'chatbox'){
        autoheal = !autoheal;
       document.title = "Moo Moo -- Autoheal " + (autoheal ? "ON" : "OFF");
   }
});

(function() {

document.title = "Perussi's Moomoo.io Hat Haxxxx";
var vs = ["2 Peter 3:9", "John 3:16", "Psalm 23", "Romans 12:2", "John 5:24", "John 11:25-26", "Job 19:25-26"];
var aV = [0,0];
var hZ = [[15, "Winter Cap"], [12, "Booster Hat"], [31, "Flipper Hat"], [10, "Bush Gear"], [22, "Emp Helmet"], [26,  "Demolisher Armor"], [20, "Samurai Armor"], [7, "Bull Helmet"], [11, "Spike Gear"]];
var rZe = 0;

function hF(ki){
	if(aV[0] === 0){
		storeEquip(hZ[ki][0]);
		document.title = hZ[ki][1];
		aV[1] = 90;
	} else {
		storeBuy(hZ[ki][0]);
		aV[0] = 0;
		aV[1] = 180;
		document.title = "Bought. (if you had enough gold or didn't already buy it)";
	}
}

document.addEventListener('keydown', function(kfc) {
	switch (kfc.keyCode) {
		case 96: aV[0] = 1; aV[1] = 300; document.title = "Buying...."; break;
		case 110: if(aV[0] === 1){aV[1] = 120; document.title = "Not buying....";}  aV[0] = 0; break;
		case 107: storeEquip(0); break;
		case 97: hF(0); break;
		case 98: hF(1); break;
		case 99: hF(2); break;
		case 100: hF(3); break;
		case 101: hF(4); break;
		case 102: hF(5); break;
		case 103: hF(6); break;
		case 104: hF(7); break;
		case 105: hF(8); break;
	}
});

function tK(){
	aV[1]--;
	letThereBeLight();
}

function letThereBeLight(){
	if(aV[1] === 0){
		rZe = Math.floor(Math.random()*vs.length-0.00001);
		if(rZe < 0){
			rZe = 0;
		}
		document.title = vs[rZe];
	}
}

setInterval(tK, 1000/60);
})();
