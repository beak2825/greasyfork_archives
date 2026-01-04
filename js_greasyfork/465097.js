// ==UserScript==
// @name         NEON's bot+gamemodes
// @namespace    https://bonk.io/
// @version      1.0
// @description  sim
// @author       You
// @match        https://bonk.io/*
// @run-at       document-idle
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @downloadURL https://update.greasyfork.org/scripts/465097/NEON%27s%20bot%2Bgamemodes.user.js
// @updateURL https://update.greasyfork.org/scripts/465097/NEON%27s%20bot%2Bgamemodes.meta.js
// ==/UserScript==
let originalCall = window.PIXI.Graphics.prototype.drawCircle;
let originalCall3 = window.PIXI.Graphics.prototype.arc;
let originalCall2 = CanvasRenderingContext2D.prototype.arc;
let sequence = 0;
let clearIds = [];
let ctx;
let instantPlay = false;
let Players = [];
let lastBotMessage = '';
let shield = [];
let globalParent;
let selPlayer = -1;
let banned = ["New Player"]
let delay = 0;
let breakingTurn = -1;
let hhdelay = 0;
let lastTurn = -1;
let gameMap = [];
let plrIndex = 0;
let limit = {x: 0,y: 0};
let lastCall = Date.now();
let lastDt = 1;
let KOHPLR = -1
let simonRule = -1;
let mode = 'none';
let potatoId = -1;
let potatoDelay = 0;
let potatoTime = 0;
let infected = {}
let KOHDELAY = 0;
let breaking = false;
let lastPotato = -1;
let deathLink = false;
let deathLinker = -1;
let choosenInf = false;
let winningInf = false;
let lastPotatoCall = Date.now();
var chatInput1 = null;
var originalConsoleSend = console.log;
var printOnChat = false;
var chatInput2 = null;
var chatBox = null;
var chatBox2 = null;
var shiftKey = false;
var tabKey = false;
var mouse = [0,0];
var bonkiocontainer = null
let gameCanvas = document.createElement("canvas");
gameCanvas.style.position = 'absolute';
gameCanvas.style.pointerEvents = 'none';
document.body.appendChild(gameCanvas);
gameCanvas.style.zIndex = 99999999999;

const modes = [
    ["DeadlyHeavy",'c'], // Mode 0
    ["Crown",'g'], // Mode 1
    ["Infection",'g'], // Mode 2
    ["Team Chain",'g'], // Mode 3
    ["Death grapple",'g'], // Mode 4
    ["Hot potato",'g'], // Mode 5
    ["Sniper Arrows",'d'], // Mode 6
    ['None','n'] //Mode 7
]

function changeMode(mes){
         let modest = mes.substring(0,1);
         let mo = 'none';
         let text = 'none';
         if (modest == 's'){
         mo = 'bs'
         text = 'Simple';
         }
         if (modest == 'c'){
         mo = 'b'
         text = 'Classic';
         }
         if (modest == 'd'){
         mo = 'ard'
         text = 'Death Arrows';
         }
         if (modest == 'g'){
         mo = 'sp'
         text = 'Grapple'
         }
         if (modest == 'a'){
         mo = 'ar'
         text = 'Arrows'
         }
         if (modest == 'v'){
         mo = 'v'
         text = 'Vtol'
         }
         if (mo !== 'none'){
         let txt = document.getElementById('newbonklobby_modetext');
         if (txt){
          setTimeout(() => {
              txt.textContent = text+" - "+modes[mode][0];
          },10);
         }
         websocket.send('42[20,{"ga":"b","mo":"'+mo+'"}]');
         websocket.onmessage({data:'42[26,"b","'+mo+'"]'});
         }
}

function displayOnChat(msg){
     if (chatBox){
      let cldiv = document.createElement('div');
      cldiv.class = 'newbonklobby_chat_msg_txt';
      cldiv.textContent = msg;
      cldiv.style.color = '#954fd6'
      chatBox.appendChild(cldiv);
      chatBox.scrollTop = chatBox.scrollHeight;
     }
    if (chatBox2){
      let cldiv2 = document.createElement('div');
      cldiv2.class = 'ingamechatmessage';
      cldiv2.textContent = msg;
      cldiv2.style.color = '#954fd6'
      chatBox2.appendChild(cldiv2);
      chatBox2.scrollTop = chatBox2.scrollHeight;
    }
}
console.log = function(...args){
    if (printOnChat){
       displayOnChat(args[0])
    }
    originalConsoleSend.call(this,...args);
}
setInterval(function(){
     let renderer = document.getElementById('gamerenderer');
    if (renderer){
     let canvas;
     for (let child of renderer.children){
      if (child.tagName.toLowerCase() == 'canvas'){
       canvas = child;
       break;
      }
     }
        if (canvas){
         limit.x = canvas.width;
         limit.y = canvas.height;
         limit.x2 = parseInt(canvas.style.width.substring(0,canvas.style.width.length-2))
         limit.y2 = parseInt(canvas.style.height.substring(0,canvas.style.height.length-2));
         gameCanvas.width = limit.x;
         gameCanvas.height = limit.y;
         let rect = bonkiocontainer.getBoundingClientRect();
         gameCanvas.style.width = canvas.style.width;
         gameCanvas.style.height = canvas.style.height;
         gameCanvas.style.left = rect.left+'px';
         gameCanvas.style.top = rect.top+'px';
         ctx = gameCanvas.getContext('2d');
        }else{
         if (ctx){
         ctx.clearRect(-5000,-5000,15000,15000)
         ctx = null;
         }
        }
    }else{
     ctx.clearRect(-5000,-5000,15000,15000)
     ctx = null;
    }
    if (mode == 2 && Date.now() > gmstrt+3000 && delay <= 0){
       if (!choosenInf){
        choosenInf = true;
        let plr = users[Math.floor(Math.random()*users.length)];
        let limit = 0
        while (!plr.alive){
              plr = users[Math.floor(Math.random()*users.length)];
              limit += 1;
            if (limit > 100){
             break;
            }
        }
        if (limit > 100){
         return;
        }
        infected[plr.id] = [true,Date.now()+10000];
        sendMsg(plr.name+" é o infectado.")
       }
       let kill = []
       for (let p of users){
          if (infected[p.id] && infected[p.id][0]){
             if (Date.now() > infected[p.id][1]+20000 && p.alive){
              kill.push(p.id)
              infected[p.id] = [false]
             }
             for (let user of users){
              if (!infected[user.id]){
        let a = p.x-user.x;
        let b = p.y-user.y;
        let dist = Math.sqrt(a*a+b*b)
        if (dist < p.radius*4){
         if (!user.infectionRate || user.infectionRate < Date.now()-10000){
          user.infectionRate = Date.now()+1000;
         }
         if (user.infectionRate < Date.now()){
         infected[user.id] = [true,Date.now()]
         sendMsg(user.name+" tem 20s para infectar.")
         }
        }
              }
             }
          }
       }
       let infections = 0;
       let alive = 0;
        for (let plr of users){
         if (plr.alive){
            if (infected[plr.id] && infected[plr.id][0]){
          infections += 1;
            }else{
             alive += 1
            }
         }
        }
        if ((infections <= 0 || alive <= 0) && !winningInf){
            winningInf = true;
            let choosen = users[Math.floor(Math.random()*users.length)]
            let limit = 0
            kill = []
            while (true){
                limit += 1
                if (limit > 100){break;}
                choosen = users[Math.floor(Math.random()*users.length)]
                if (choosen.alive && ((infections <= 0 && !infected[choosen.id]) || (alive <= 0 && infected[choosen.id]))){
                 break
                }
            }
            for (let p of users){
                if (p.id != choosen.id){
                 kill.push(p.id)
                }
            }
            if (infections <= 0){
             sendMsg("Sobreviventes venceram")
            }else{
             sendMsg("Infectados venceram")
            }
        }
        if (kill.length > 0){
           let frame = Math.floor((Date.now() - gmstrt)/1000*30);
           websocket.send('42[25,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]');
         websocket.onmessage({data:'42[31,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]'});
        }
    }else{
     infected = {}
     choosenInf = false;
     winningInf = false;
    }
    if (mode == 1 && Date.now() > gmstrt+6000 && delay <= 0){
     if (KOHPLR <= -1){
     let newId = users[Math.floor(Math.random()*users.length)];
        if (!newId){return;}
        let limit = 0;
        while (true){
            limit += 1;
         newId = users[Math.floor(Math.random()*users.length)];
            if (limit > 100 || (newId.alive === true)){
             break;
            }
        }
        if (limit > 100){
         return;
        }
        if (newId){
            KOHPLR = newId.id;
            KOHDELAY = 80;
            sendMsg(newId.name+" Esta com a coroa!");
        }
     }else{
        let user = findUserById(KOHPLR);
        if (user){
            if (!user.alive){
             KOHPLR = -1;
            }
     if (KOHDELAY <= 0){
     for (let p of users){
        if (p.alive){
        let a = p.x-user.x;
        let b = p.y-user.y;
        let dist = Math.sqrt(a*a+b*b)
        if (dist < p.radius*2.75 && dist > 5 && p.heavy != user.heavy){
          KOHDELAY = 60;
          KOHPLR = p.id;
          sendMsg(p.name+" Roubou a coroa!")
        }
        }
         }
     }else{
      KOHDELAY -= 1;
     }
     }else{
      KOHPLR = -1;
     }
     }
     if (Date.now() > gmstrt+30000 && KOHDELAY <= 0){
     let plr = findUserById(KOHPLR)
     KOHDELAY = 1000000000;
     if (plr){
        sendMsg(plr.name+" VENCEU!")
        let kill = []
        for (let p of users){
         if (p.id != KOHPLR){
          kill.push(p.id)
         }
        }
        if (kill.length > 0){
              let frame = Math.floor((Date.now() - gmstrt)/1000*30);
           websocket.send('42[25,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]');
         websocket.onmessage({data:'42[31,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]'});
        }
     }
     }
     }else{
      KOHDELAY = 0;
      KOHPLR = -1;
     }
    if (mode == 0 && Date.now() > gmstrt+6000 && delay <= 0){
                let kill = [];
     for (let p of users){
      if (p.alive && p.heavy){
       for (let p2 of users){
        if (p2.id !== p.id){
         if (p2.heavy == false){
             let a = p2.x-p.x;
             let b = p2.y-p.y;
             let dist = Math.sqrt(a*a+b*b);
             if (dist < (p2.radius*2.5)+(p.radius*2.5) && p2.alive && !dead[p2.id]){
                 kill.push(p2.id);
                 dead[p2.id] = true;
             }
         }
        }
       }
     }
    }
        if (kill.length > 0){
              let frame = Math.floor((Date.now() - gmstrt)/1000*30);
           websocket.send('42[25,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]');
         websocket.onmessage({data:'42[31,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]'});
        }
    }
    let maop = document.getElementById('maploadwindowmapscontainer');
    let winner = document.getElementById('ingamewinner');
    if (delay > 0){
     delay -= 1;
    }
    if (winner && renderer && delay <= 0 && quickplay){
    let countdown = document.getElementById('ingamecountdown');
    if (delay <= 0 && winner.style.visibility !== 'hidden' && Date.now() > gmstrt+1000 && renderer.visibility !== 'hidden'){
       delay = 1000;
       mode = 'none';
        let next = maop.children[Math.floor(Math.random()*maop.children.length)]
        if (next){
                setTimeout(() => {
          mode = Math.floor(Math.random()*modes.length);
          if (modes[mode][0] == 'None'){
           mode = 0
          }
          changeMode(modes[mode][1]);
          sendMsg("O modo agora é "+modes[mode])
          next.click();
          document.getElementById("newbonklobby_editorbutton").click();
          document.getElementById("mapeditor_close").click();
          document.getElementById("mapeditor_midbox_testbutton").click();
          delay = 100;
                },1000);
        }
    }
    }
    if (mode == 3 && delay <= 0){
     for (let t = 0; t < 6; t++){
      let connectors = [];
         for (let p of users){
          if (p.team == t && p.alive){
           connectors.push(p);
          }
         }
         if (connectors.length > 0){
         let user1 = connectors[0];
         connectors.push(user1);
         let sx = user1.x;
         let sy = user1.y;
         let kill = [];
         for (let i = 1; i < connectors.length; i++){
          let p = connectors[i];
             while(true){
              let angle = Math.atan2(p.y-sy,p.x-sx);
              sx += Math.cos(angle)*p.radius;
              sy += Math.sin(angle)*p.radius;
                  let a2 = sx-p.x;
                  let b2 = sy-p.y;
                  let dist2 = Math.sqrt(a2*a2+b2*b2);
                 if (dist2 < 20){
                  break;
                 }
                 for (let p2 of users){
                  let a = p2.x-sx;
                  let b = p2.y-sy;
                  let dist = Math.sqrt(a*a+b*b);
                     if (dist < p.radius && p2.team !== p.team && p2.alive == true && !dead[p2.id] && Date.now() > gmstrt+5000){
                         dead[p2.id] = true;
                                  let frame = Math.floor((Date.now() - gmstrt)/1000*30);
  websocket.send('42[25,{"a":{"playersLeft":['+p2.id+'],"playersJoined":[]},"f":'+frame+'}]');
         websocket.onmessage({data:'42[31,{"a":{"playersLeft":['+p2.id+'],"playersJoined":[]},"f":'+frame+'}]'});
                         p2.alive = false;
                         kill.push(p2.id);
                     }
                 }
         }
         }
                     if (kill.length > 0){
              let frame = Math.floor((Date.now() - gmstrt)/1000*30);
           websocket.send('42[25,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]');
         websocket.onmessage({data:'42[31,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]'});
        }
         }
         }
     }
    if (mode == 4 && delay <= 0){
        let kill = [];
for (let p of users){
    if (p.alive && p.grappleX && p.special){
        let sx = p.x;
        let sy = p.y;
        let angle = Math.atan2(p.grappleY-sy,p.grappleX-sx);
        let ox = Math.cos(angle)*p.radius;
        let oy = Math.sin(angle)*p.radius;
        for (let i = 0; i < 50; i++){
            sx += ox;
            sy += oy;
            let a = sx-p.grappleX;
            let b = sy-p.grappleY;
            let dist = Math.sqrt(a*a+b*b);
            if (dist <= p.radius){
            break;
            }
     for (let p2 of users){
         if (p2.id !== p.id){
            let a = sx-p2.x;
            let b = sy-p2.y;
            let dist = Math.sqrt(a*a+b*b);
         if (dist <= p.radius && p2.alive && !dead[p2.id]){
             dead[p2.id] = true;
kill.push(p2.id);
         }
     }
     }
        }
        }
}
                             if (kill.length > 0){
              let frame = Math.floor((Date.now() - gmstrt)/1000*30);
           websocket.send('42[25,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]');
         websocket.onmessage({data:'42[31,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]'});
        }
    }
                    if (delay > 0){
                 delay -= 1;
                }
            if (winner && renderer && delay <= 0 && instantPlay){
    let countdown = document.getElementById('ingamecountdown');
    if (delay <= 0 && winner.style.visibility !== 'hidden' && gmstrt > 10 && Date.now() > gmstrt+3000 && renderer.visibility !== 'hidden'){
delay = 1000;
      setTimeout(() => {
          document.getElementById("newbonklobby_editorbutton").click();
          document.getElementById("mapeditor_midbox_testbutton").click();
          document.getElementById("mapeditor_close").click();
          delay = 100;
      },1000)
    }
            }
    if (!renderer || renderer.style.visbility === 'hidden'){
        for (let p of users){
         if (p.IdObj){
          clearInterval(p.IdObj);
          p.IdObj = null;
         }
        }
    }
    if (mode == 5){
    if (renderer && renderer.style.visbility !== 'hidden'){
    let time = Date.now()-lastPotatoCall;
    lastPotatoCall = Date.now()
    if (potatoDelay > 0){
    potatoDelay -= 1;
    potatoTime += time;
    }
    if (Date.now() < gmstrt+2000){
     potatoId = -1;
     potatoTime = 0;
    }
    if (Date.now() > gmstrt+2000 && potatoDelay <= 0){
                potatoTime += time;
    if (potatoId == -1){
     let newId = users[Math.floor(Math.random()*users.length)];
        if (!newId){return;}
        let limit = 0;
        while (true){
            limit += 1;
         newId = users[Math.floor(Math.random()*users.length)];
            if (limit > 100 || (newId.alive === true && newId.id !== lastPotato)){
             break;
            }
        }
        if (limit > 100){
         return;
        }
        if (newId){
            potatoId = newId.id;
            potatoDelay = 80
            sendMsg(newId.name+" tem uma batata! (Segure PESADO para passar.)");
        }
    }else{
        let user = findUserById(potatoId);
        if (user){
            if (!user.alive){
             potatoId = -1;
            }
            if (user.heavy){
        for (let p of users){
         if (p.id !== user.id && p.alive == true){
             let a = p.x-user.x;
             let b = p.y-user.y;
             if (Math.sqrt(a*a+b*b) <= user.radius*3){
                 potatoDelay = 80;
                 sendMsg(p.name+" esta com a batata!");
                 potatoId = p.id;
                 break;
             }
         }
        }
            }
            if (potatoTime > 20000 && potatoId > -1){
             potatoTime = 0;
          let frame = Math.floor((Date.now() - gmstrt)/1000*30);
          let kill = []
          for (let p of users){
             let a = p.x-user.x;
             let b = p.y-user.y;
             if (Math.sqrt(a*a+b*b) <= user.radius*6 && p.alive){
                 kill.push(p.id);
             }
          }
         websocket.send('42[25,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]');
         websocket.onmessage({data:'42[31,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]'});
                if (user.id == potatoId){user.alive = false;}
                lastPotato = potatoId;
                potatoId = -1;
            }else if(potatoTime > 20000){
             potatoTime = 0;
            }
        }else{
         potatoId = -1;
        }
    }
    }
    }
    }else{
     lastPotatoCall = Date.now();
    }
},0);

let websocket = null
let quickplay = false;
const originalSend = window.WebSocket.prototype.send
const getId = id => window.getElementById(id)
let frame = 0;
let trollMode = false;
console.log(window.PIXI);
let gmstrt = Date.now();
let gmstrt2 = Date.now();
let deathgrapple = false;
let teamChain = false;
let lock = false;
let turns = false;
let noHeavy = false;
let turn = -1;
let desync = false;
let lastGraphics = null;

function fire(keyCode, type, modifiers) {
	var evtName = (typeof(type) === "string") ? "key" + type : "keydown";
	var modifier = (typeof(modifiers) === "object") ? modifier : {};

	var event = document.createEvent("HTMLEvents");
	event.initEvent(evtName, true, false);
	event.keyCode = keyCode;

	for (var i in modifiers) {
		event[i] = modifiers[i];
	}

	document.dispatchEvent(event);
}

let users = [];
let botId = -100;
let hostId = -200;

function sendMsg(msg){
lastBotMessage = msg;
 if (websocket){
  websocket.send("42[10,"+JSON.stringify({message:msg})+"]")
 }
}

function findUserById(id){
    let us;
    for (let i = 0; i < users.length; i++){
        if (users[i]){
     if (users[i].id == id){
         us = users[i];
         us.index = i;
         break;
     }
        }
    }
    return us;
}

function findUserByName(name){
    let us;
    for (let i = 0; i < users.length; i++){
        if (users[i]){
     if (users[i].name == name){
         us = users[i];
         us.index = i;
         break;
     }
        }
    }
    return us;
}

let dead = {};

let ltc = Date.now();
let nts = 0;
let deathBorder = false;

let copying = -100;
let lastMessage = '';
let deathTouch = false;

function ChatMessage(pid,msg){
let usert = findUserById(pid);
    for (let p of banned){
     if (p == usert){
      return;
      break;
     }
    }
    if (msg == lastMessage){return;}
    lastMessage = msg;
    let user = findUserById(pid);
    user.lastMsg = msg;
    user.sendTime = Date.now();
let msp = msg.split(" ");
let qa = msg.split("\"");
let ormsg = msg;
let mentioned = [];
        for (let i of users){
            if (i){
            if (msg.match(i.name)){
                msg = msg.replaceAll(" "+i.name," -")
                mentioned.push(i);
            }
            }
        }
    mentioned.sort((a,b) => {
     let aind = ormsg.indexOf(a);
     let bind = ormsg.indexOf(b);
     if (aind > bind){
      return 1
     }else if(aind < bind){
      return -1;
     }else{
      return 0;
     }
    })
    if (msp[0] == "!troll" && pid == botId){
        trollMode = !trollMode;
        if (trollMode){
        sendMsg("O Modo troll foi ativado, TODOS os players podem usar o comando: !trollhelp")
        }else{
         sendMsg("O Modo troll foi desativado.")
        }
    }
    //Troll mode
    if (trollMode || pid == botId){
     
        if (msp[0] == "!lock"){
          lock = !lock;
         websocket.send('42[7,{"teamLock":'+lock+'}]')
         sendMsg("Lock :o");
        }
        if (msp[0] == "!mode"){
           changeMode(msp[1]);
         }
        if (msp[0] == '!round'){
            if (msp[1] && parseInt(msp[1])){
         websocket.send('42[21,{"w":'+msp[1]+'}]')
         websocket.onmessage({data:'42[27,'+msp[1]+']'})
                sendMsg("tem "+msp[1]+" rounds agr");
                        }else{
                        sendMsg("cade os NUMBEH!");
                        }
        }
     if (msp[0] == "!kill"){
         if (mentioned[0]){
             let frame = Math.floor((Date.now() - gmstrt)/1000*30);
         websocket.send('42[25,{"a":{"playersLeft":['+mentioned[0].id+'],"playersJoined":[]},"f":'+frame+'}]');
         websocket.onmessage({data:'42[31,{"a":{"playersLeft":['+mentioned[0].id+'],"playersJoined":[]},"f":'+frame+'}]'});
         sendMsg("Matou "+mentioned[0].name+"...!")
         }else{
             if (msp[1] == "all" || msp[1] == "todos" || msp[1] == "*"){
                 let kill = [];
                 for (let i of users){
                     if (i.id !== pid){
                  kill.push(i.id);
                     }
                 }
                          websocket.send('42[25,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]');
                 websocket.onmessage({data:'42[31,{"a":{"playersLeft":'+JSON.stringify(kill)+',"playersJoined":[]},"f":'+frame+'}]'});
                 sendMsg("Todos te odeiam agora.");
             }else{
          sendMsg("Especifique o player que deseja matar.")
             }
         }
     }
             if (msp[0] == "!move"){
         if (mentioned[0] && msp[2]){
             let c = msp[2].substring(0,1);
             if (c == "s"){
         websocket.send('42[26,{"targetID":'+mentioned[0].id+',"targetTeam":0}]');
         }else if (c == "f"){
         websocket.send('42[26,{"targetID":'+mentioned[0].id+',"targetTeam":1}]');
         }else if (c == "r"){
         websocket.send('42[26,{"targetID":'+mentioned[0].id+',"targetTeam":2}]');
         }else if (c == "b"){
         websocket.send('42[26,{"targetID":'+mentioned[0].id+',"targetTeam":3}]');
         }else if (c == "g"){
         websocket.send('42[26,{"targetID":'+mentioned[0].id+',"targetTeam":4}]');
         }else if (c == "y"){
         websocket.send('42[26,{"targetID":'+mentioned[0].id+',"targetTeam":5}]');
             }else{
              sendMsg("O Time "+msp[2]+" nao existe.");
             }
         }else{
          sendMsg("Especifique o player que deseja mover.")
         }
     }
    }
    //Untroll mode
    if (msp[0] == "!help"){
     sendMsg("trollhelp - ajuda do modo troll | mimic <message> - O Bot vai imitar sua mensagem | mostless <pro? sus?> - O Bot vai te dizer quem é mais e quem é menos | judge \"<nome>\" <pro? gay? sus?> - O Bot diz a porcentagem do player");
    }
    if (msp[0] == "!trollhelp"){
     sendMsg("kill <player> - mata um player | move <player> <spec,blue,ffa,red,yellow,green> - troca o time do player | start - comeca ou reinicia o jogo | lock - teamlock | !round <rounds> - rounds");
    }
if (msp[0] == "!mimic"){
    let user = findUserById(pid);
    sendMsg(user.name+": "+ msg.slice(7));
}
    if (msp[0] == '!copy' && pid == botId){
        if (mentioned[0]){
             let user =mentioned[0];
            copying = user.id;
            alert("copiando "+user.name);
        }else{
         copying = -100;
            alert("copiando ngm");
        }
    }
if (msp[0] == "!judge"){
    if (mentioned[0]){
 let user = mentioned[0];
 let julg = msp[msp.length-1];
 let j = Math.floor(Math.random()*100);
        if (user){
    sendMsg(user.name+" é "+j+"% "+julg);
        }else{
         sendMsg("o player deve existir na sala!");
        }
    }else{
     sendMsg("Voce deve digitar o nome do player assim: \"New Player\"!");
    }
}
    if (msp[0] == '!mostless'){
     let user1 = users[Math.floor(Math.random()*users.length)];
     let user2 = users[Math.floor(Math.random()*users.length)];
     for (let i = 0; i < 100; i++){
      if (user2 !== user1){break;}
       user2 = users[Math.floor(Math.random()*users.length)];
     }
      let en1 = Math.floor(Math.random()*100);
      let en2 = Math.floor(Math.random()*100);
      sendMsg(user1.name+" é o mais "+msp[1]+", com "+Math.max(en1,en2)+"%, E "+user2.name+" é o menos "+msp[1]+", com "+Math.min(en1,en2)+"%");

    }
}

let lastInputFrame = 0;
let lastRecived7 = '';
let lastRecived4 = [];
let lastCopying = 0;
var lastWebHSend = null;
let copied = false;

//Stolen from legend lol

const STB = function(x){
    if(x == "0"){
        return 0;
    }
    else{
        return 1;
    }
};

const GET_KEYS = function(x){
    var x2 = ((x+64)>>>0).toString(2).substring(1).split("");
    return {"left":STB(x2[5]),"right":STB(x2[4]),"up":STB(x2[3]),"down":STB(x2[2]),"heavy":STB(x2[1]),"special":STB(x2[0])}
};

window.WebSocket.prototype.send = function(args) {
    //RECIEVE EVENTS
	const invalidSocket = websocket == null || websocket.readState != websocket.OPEN
	const validURL = this.url.includes(".bonk.io/socket.io/?EIO=3&transport=websocket&sid=")
    let frame = Math.floor((Date.now() - gmstrt)/1000*30);
    if (args.startsWith("42[12,")){
     hostId = 0;
     botId = 0;
     let data = JSON.parse(args.slice(2));
     users = [{combat: -1,x: 0,y: 0,name: document.getElementById('pretty_top_name').textContent,peer: data[1].peerID,guest: data[1].guest,level: document.getElementById('pretty_top_level').textContent.slice(3),id: 0}];
    }
        if (args.startsWith("42[6,")){
             let data = JSON.parse(args.slice(2));
            let user = findUserById(botId);
            if (user){
             user.team = data[1].targetTeam;
            }
        }
            if (args.startsWith("42[4,") && noHeavy){
                             let data = JSON.parse(args.slice(2));
                     sequence = data[1].c;
                     if (data[1].i >= 16 && data[1].i <= 26){
         websocket.send('42[25,{"a":{"playersLeft":['+botId+'],"playersJoined":[]},"f":'+frame+'}]');
         websocket.onmessage({data:'42[31,{"a":{"playersLeft":['+botId+'],"playersJoined":[]},"f":'+frame+'}]'});
                     }
                 }
                if (args.startsWith("42[4,")){
                             let data = JSON.parse(args.slice(2));
                    let keys = GET_KEYS(data[1].i);
                    if (keys.special > 0){
                        let user = findUserById(botId);
                         if (user){
                          user.lastSpecial = user.special;
                          user.special = true;
                         }
                     }else{
                         let user = findUserById(botId);
                         if (user){
                          user.lastSpecial = user.special;
                          user.special = false;
                         }
                     }
                     if (keys.heavy > 0){
                        let user = findUserById(botId);
                         if (user){
                          user.heavy = true;
                         }
                     }else{
                         let user = findUserById(botId);
                         if (user){
                          user.heavy = false;
                         }
                     }
                 }
    if (args.startsWith("42[4,")){

             let data = JSON.parse(args.slice(2));
             if (copying > -1 && !copied){
              return;
             }
                                     if (turns){
                                  if (users[turn].id !== botId){
                                   dead[botId] = true;
                                      let user = getUserById(botId);
                                      if (user){
                                                websocket.send('42[25,{"a":{"playersLeft":['+botId+'],"playersJoined":[]},"f":'+frame+'}]');
         websocket.onmessage({data:'42[31,{"a":{"playersLeft":['+botId+'],"playersJoined":[]},"f":'+frame+'}]'});
                                   sendMsg(user.name+" Nao era seu turno.");
                                       }
                                  }
                                     }
                  if (deathgrapple && data[1].i >= 32 && data[1].i <= 42){
                   let user = findUserById(botId);
                      if (user){
                       user.death = 0;
                      }
                  }
        sequence = data[1].c+1;
        if(desync && args !== lastRecived7){
                                let lastRecived7 = args;
            return;
        }
        }
	if (validURL && invalidSocket){
        if (websocket){
            websocket.onmessage = lastWebHSend;
        }
		websocket = this
        const lastWebSend = websocket.onmessage;
        lastWebHSend = lastWebSend;
        const originalClose = this.onclose;
        this.onclose = function () {
            if (websocket == this){
             websocket = null;
             users = [];
             ctx = null;
            }
            return originalClose.call(this);
        }
        websocket.onmessage = (event,a1,a2,a3,a4,a5) => {
            //MESSAGE EVENTS
            if (typeof(event.data) == 'string'){
                if (event.data.startsWith("42[7,"+botId)){
                    if (copying > -1 && !copied){
                     return;
                    }
                }
            }
            lastWebSend(event);
            if (typeof(event.data) == 'string'){
            if (event.data.startsWith("42[")){
                         let data = JSON.parse(event.data.slice(2));
             if (data){
                 if (data[0] == 16){
                  if (data[1] == 'chat_rate_limit'){
                   displayOnChat(lastBotMessage+" RATE LIMITED");
                  }
                 }
                                  if (data[0] == 5){
                  let user = findUserById(data[1]);
             if (user){
              if (user.id == selPlayer){
               selPlayer = -1;
              }
              users.splice(user.index,1);
             }
                 }
               if(data[0] == 15){
                   for (let i of users){
                    i.death = -5;
                    i.radius = undefined;
                   }
                gmstrt = Date.now();
                sequence = 0;
                   breakingTurn = -1;
        for (let p of users){
         if (p.IdObj){
          clearInterval(p.IdObj);
          p.IdObj = null;
         }
        }
                dead = {};
                   for (let p of users){
                    p.gotRadius = false;
                    p.deathTime = 0;
                   }
                gmstrt2 = data[1];
                lastInputFrame = 0;
            }
             let frame = Math.floor((Date.now() - gmstrt)/1000*30);
                 if (data[0] == 7 && deathgrapple){
                  if (data[2].i >= 32 && data[2].i <= 42){
                   let user = findUserById(data[1]);
                      if (user){
                       user.death = 0;
                      }
                  }
                 }
                 if (data[0] == 7 && noHeavy){
                     if (data[2].i >= 16 && data[2].i <= 26 && !dead[data[1]]){
                         dead[data[1]] = true;
         websocket.send('42[25,{"a":{"playersLeft":['+data[1]+'],"playersJoined":[]},"f":'+frame+'}]');
         websocket.onmessage({data:'42[31,{"a":{"playersLeft":['+data[1]+'],"playersJoined":[]},"f":'+frame+'}]'});
                     }
                 }
                      if (data[0] == 7){
                      let keys = GET_KEYS(data[2].i);
                      if (keys.special > 0){
                      let user = findUserById(data[1]);
                         if (user){
                         if (user.alive){
                          user.lastSpecial = user.special;
                          user.special = true;
                         }
                         }
                     }else{
                         let user = findUserById(data[1]);
                         if (user){
                          user.lastSpecial = user.special;
                          user.special = false;
                         }
                     }
                     if (keys.heavy > 0){
                      let user = findUserById(data[1]);
                         if (user){
                         if (user.alive){
                          user.heavy = true;
                         }
                         }
                     }else{
                         let user = findUserById(data[1]);
                         if (user){
                      user.heavy = false;
                         }
                     }
                 }
                                  if (data[0] == 7 && turns){
                                  if (data[1] !== users[turn].id && !dead[data[1]]){
                                   dead[data[1]] = true;
                                      let user = getUserById(data[1]);
                                      if (user){
        websocket.send('42[25,{"a":{"playersLeft":['+user.id+'],"playersJoined":[]},"f":'+frame+'}]');
         websocket.onmessage({data:'42[31,{"a":{"playersLeft":['+user.id+'],"playersJoined":[]},"f":'+frame+'}]'});
                                   sendMsg(user.name+" Nao era seu turno.");
                                       }
                                  }
                 }
                                 if (data[0] == 7 && data[1] !== botId){
                                     if (desync){
                                         return;
                                     }else{
                                  if (data[1] == copying){
                                    copied = true;
                                    lastCopying = data[2].i;
                                    websocket.onmessage({data:'42'+JSON.stringify([7,botId,data[2]])});
                                    websocket.send('42'+JSON.stringify([4,data[2]]));
                                    copied = false;
                                  }
                                     }
                                 }
                 if (data[0] == 41){
                  hostId = data[1].newHost;
                  displayOnChat("Host id is now "+hostId);
                 }
                 if (data[0] == 6){
                  let host = findUserById(data[1]);
                  if (host){
                   users.splice(host.index,1);
                  }
                  hostId = data[2];
                  displayOnChat("Host id is now "+hostId);
                 }
                 if (data[0] == 20){
                     ChatMessage(data[1],data[2]);
                 }
                 if (data[0] == 18){
                     let user = findUserById(data[1]);
                     if (user){
                      user.team = data[2];
                     }
                 }
            if (data[0] == 3){
               users = [];
               botId = data[1];
               hostId = data[2];
               for (let id = 0; id < data[3].length; id++){
                let plr = data[3][id];
                   if (plr){
                 let peer = plr.peerID;
                 let name = plr.userName
                 let guest = plr.guest;
                 let level = plr.level;
                 let team = plr.team;
                 users.push({combat: -1,x: 0,y: 0,id: id,peer: peer,name: name,guest: guest,level: level,team: team});
                   }
               }
            }
                 if (data[0] == 4){
                     let id = data[1];
                     let peer = data[2];
                     let name = data[3];
                     let guest = data[4];
                     let level = data[5];
                     let team = 0;
                                            let ban = false;
                       for (let p of banned){
                           if (p == name){
                            ban = true;
                           }
                       }
                       if (ban && botId == hostId){
                           websocket.send('42[9,{"banshortid":'+id+',"kickonly":true}]');
                       }else{
                     let user = findUserById(id);
                     if (user){
                         user = {combat: -1,x: 0,y: 0,id: id,peer: peer,name: name,guest: guest,level: level,team: team};
                     }else{
                         if (botId == hostId){
                     sendMsg("Seja bem vindo senhor ou senhora: "+name+"!")
                         }
                     users.push({combat: -1,x: 0,y: 0,id: id,peer: peer,name: name,guest: guest,level: level,team: team});
                 }
                       }
                 }
        }
        }
            }
    }
    }
	originalSend.call(this, args)
}

function buildImg(src){
 let img = document.createElement("img");
 img.src = src;
 return img;
}
let aie = buildImg("https://bonkclans.itsdawildshadow.repl.co/file/Ai.png");
let plre = buildImg("https://bonkclans.itsdawildshadow.repl.co/file/Plr.png");
let lastCAMX = 0;
let lastCAMY = 0;
let lastCAMS = 1;
let battleCam = false;
let lastDtCall = Date.now();

function lerp(a, b, x) {
    return a + x * (b - a);
}

let modeBar = document.createElement("div");
modeBar.style.width = '150px';
modeBar.style.height = '100px';
modeBar.style.left = '20px';
modeBar.style.top = '150px';
modeBar.style.borderRadius = '20px';
modeBar.style.backgroundColor = 'white';
modeBar.style.zIndex = 999999;
modeBar.style.position = 'absolute';

for (const mod in modes){
let modeDiv = document.createElement('div');
modeDiv.style.backgroundColor = '#7361ff';
modeDiv.style.width = '150px';
modeDiv.style.height = '25px';
modeDiv.style.borderRadius = '20px';
modeDiv.style.position = 'absolute';
modeDiv.style.color = 'white';
modeDiv.style.textAlign = 'center';
modeDiv.style.top = mod*30+'px';
modeDiv.textContent = modes[mod][0]+" - "+modes[mod][1];
modeDiv.onclick = function(){
displayOnChat("The mode selected is now: "+modes[mod][0]+" - "+modes[mod][1]);
changeMode(modes[mod][1]);
mode = mod;
}
modeBar.appendChild(modeDiv);
}

function resize(){
let width = window.innerWidth;
let height = window.innerHeight;
modeBar.style.height = height/1.5+'px';
}

window.addEventListener("resize",resize);

setTimeout(() => {
document.body.appendChild(modeBar);
parent.document.getElementById("adboxverticalleftCurse").style.zIndex = -99999999;
parent.document.getElementById("adboxverticalCurse").style.zIndex = -9999999999;
resize();
},1000);

window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
	apply( target, thisArgs, args ) {
               if (copying > 0){
               let keys = GET_KEYS(lastCopying);
               if (keys.right > 0){
                          fire(68);
                          fire(65,"up");
                }else if (keys.left > 0){
                          fire(65);
                          fire(68,"up");
                 }else{
                          fire(65,'up');
                          fire(68,'up');
                 }
                 if (keys.heavy > 0){
                                        fire(32);
                 }else{
                                        fire(32,"up");
                 }
                 if (keys.special > 0){
                     fire(78);
                 }else{
                      fire(78,"up");
                                    }
                                  if (keys.up > 0){
                                        fire(87);
                                        fire(83,"up");
                                    }else if (keys.down > 0){
                                        fire(83);
                                        fire(87,"up");
                                    }else{
                                     fire(83,'up');
                                     fire(87,'up');
                                    }
               }
        let dt = (Date.now()-lastDtCall)/1000
        let player = findUserById(selPlayer);
        if (player && player.alive && player.object && player.object.parent){

        let parent = player.object
            while (parent.parent){
             parent = parent.parent
            }
            parent.x = -((player.object.x/1.25)-limit.x2/2)
            parent.y = -((player.object.y/1.25)-limit.y2/2)
            lastCAMX = parent.x;
            lastCAMY = parent.y;
            parent.transform.scale.x = .78;
            parent.transform.scale.y = .78;
            lastCAMS = 0.78;
            let bg = player.object.parent.parent.parent.children[0]
        bg.x = -lastCAMX/lastCAMS;
        bg.y = -lastCAMY/lastCAMS;
        bg.transform.scale.x = 2/lastCAMS;
        bg.transform.scale.y = 2/lastCAMS;
        }else if (!battleCam){
           for (let user of users){
            if (user.alive && user.object && user.object.parent && (lastCAMX != 0 || lastCAMY != 0)){
            let parent = user.object
            while (parent.parent){
             parent = parent.parent
            }
            parent.x = 0;
            parent.y = 0;
            parent.transform.scale.x = 1;
            parent.transform.scale.y = 1;
            lastCAMX = 0;
            lastCAMY = 0;
            lastCAMS = 1;
            let bg = user.object.parent.parent.parent.children[0]
            bg.x = 0;
            bg.y = 0;
            bg.transform.scale.x = 1;
            bg.transform.scale.y = 1;
            break;
            }
           }
        }
        lastDtCall = Date.now();
        Reflect.apply(...arguments);
           for (let user of users){
            if (user.alive && user.object && user.object.parent){
            let parent = user.object
            while (parent.parent){
             parent = parent.parent
            }
            break;
            }
           }
        let CENTERX = 0;
        let CENTERY = 0;
        let plr = findUserById(botId);
        let leng = 0;
               for (let user of users){
                   if ((!user.special && user.grappleX) || (user.grappleDelay <= 0 && user.grappleX)){
                    user.grappleX = undefined;
                    user.grappleY = undefined;
                   }else{
                    user.grappleDelay -= 1;
                   }
         if (user.object && user.object.children.length > 0){
             if (user.special){
              if (user.object.children[6]){
                  user.arrowAngle = user.object.children[6].angle;
              }
             }else if(user.object.children[6] && user.lastSpecial){
              user.lastSpecial = false;
              if (!user.lastShot){user.lastShot = Date.now()-1000;}
              if (Date.now() > (user.lastShot)){
              user.lastShot = Date.now()+4000;
                 let sx = user.x;
                 let sy = user.y;
                 let dir = user.arrowAngle*Math.PI/180;
                 let ox = Math.cos(dir)*user.radius;
                 let oy = Math.sin(dir)*user.radius;
                 for (let i = 0; i < user.radius*2; i++){
                     sx += ox;
                     sy += oy;
                     oy += user.radius/8;
                     for (let p of users){
                      if (p.alive && p.id != user.id){
                         let a = p.x-sx;
                         let b = p.y-sy;
                         let dist = Math.sqrt(a*a+b*b);
                         if (dist <= (user.radius+p.radius)*3){
                             p.combat = user.id;
                             if (mode == 6 && dist < user.radius*3){
        let frame = Math.floor((Date.now() - gmstrt)/1000*30);
        websocket.send('42[25,{"a":{"playersLeft":['+p.id+'],"playersJoined":[]},"f":'+frame+'}]');
        websocket.onmessage({data:'42[31,{"a":{"playersLeft":['+p.id+'],"playersJoined":[]},"f":'+frame+'}]'});
                         }
                      }
                     }
                 }
                 }
              }
              user.arrowAngle = undefined;
             }
             let x = ((user.object.x/limit.x2)*limit.x);
             let y = ((user.object.y/limit.y2)*limit.y);
         user.lx = user.vx;
         user.ly = user.vy;
         user.lvx = user.vx;
         user.lvy = user.vy;
         user.vx = (x-user.x)/dt
         user.vy = (y-user.y)/dt
         user.ax = (user.vx-user.lvx)/dt;
         user.ay = (user.vy-user.lvy)/dt;
         user.x = x;
         user.y = y;
         user.alive = true;
         if (user.alive && user.object){ //&& x > 0 && y > 0 && x < limit.x && y < limit.y){
         CENTERX += user.object.x+(user.vx || 0)*dt*10;
         CENTERY += user.object.y+(user.vy || 0)*dt*10;
         leng += 1;
         }
         }else if(user.alive){
          user.deathTime = Date.now();
          user.alive = false;
         }
        }
        if (leng > 1){
        CENTERX /= leng;
        CENTERY /= leng;
        }
        let highest = 0;
        for (let p of users){
         if (p.object && p.alive){
         let a = p.object.x-CENTERX;
         let b = p.object.y-CENTERY;
         let dist = (Math.sqrt(a*a+b*b)/((limit.y+limit.x)/6));
         if (dist > highest){
          highest = dist
         }
        }
        }
        let SCALE = (Math.min(1.25,Math.max(0.3,1/highest)))/1.4;
        if (battleCam && !findUserById(selPlayer)){
        for (let p of users){
        if (p.alive && p.object){
        let parent = p.object
            while (parent.parent){
             parent = parent.parent
            }
        let x = -((CENTERX*SCALE)-limit.x2/2);
        let y = -((CENTERY*SCALE)-limit.y2/2);
        lastCAMX = lerp(lastCAMX,x,1 - 0.035 ** dt);
        lastCAMY = lerp(lastCAMY,y,1 - 0.035 ** dt);
        lastCAMS = lerp(lastCAMS,SCALE,1 - 0.035 ** dt);
        parent.x = lastCAMX;
        parent.y = lastCAMY;
        parent.transform.scale.y = lastCAMS;
        parent.transform.scale.x = lastCAMS;
        let bg = p.object.parent.parent.parent.children[0]
        bg.x = -lastCAMX/lastCAMS;
        bg.y = -lastCAMY/lastCAMS;
        bg.transform.scale.x = 2/lastCAMS;
        bg.transform.scale.y = 2/lastCAMS;
        break;
        }
        }
        }
        if (ctx){
            ctx.clearRect(-5000,-5000,15000,15000)
            ctx.setTransform(1,0,0,1,1,1);

            ctx.font = '20px Arial';
             ctx.fillStyle = 'white';
             ctx.strokeStyle = 'black';
             ctx.globalAlpha = 0.5;
             ctx.textAlign = 'left';
            if (botId == hostId){
             ctx.strokeText("You are the host of this room.",0,20);
             ctx.fillText("You are the host of this room.",0,20);
            }else{
             let plr = findUserById(hostId);
             if (plr){
                ctx.strokeText(plr.name+" Is the host of this room.",0,20);
                ctx.fillText(plr.name+" Is the host of this room.",0,20);
             }else{
                ctx.strokeText("The host is unknown????",0,20);
                ctx.fillText("The host is unknown????",0,20);
             }
            }
            if (tabKey){
                ctx.textAlign = 'center';
                for (let id in users){
                    let user = users[id]
                    ctx.strokeText(user.name+" - "+(user.alive? "ALIVE" : "DEAD"),limit.x/2,60+(id*30));
                    ctx.fillText(user.name+" - "+(user.alive? "ALIVE" : "DEAD"),limit.x/2,60+(id*30));
                }
            }
             ctx.globalAlpha = 1;
            ctx.fillStyle = 'black';
            ctx.textAlign = 'left';
            let camzx = ((lastCAMX/limit.x2)*limit.x);
            let camzy = ((lastCAMY/limit.y2)*limit.y);
            ctx.strokeStyle = 'red';
            ctx.setTransform(lastCAMS,0,0,lastCAMS,camzx,camzy);
            ctx.strokeRect(-5,-5,limit.x+10,limit.y+10);
            ctx.strokeRect(mouse[0]-5,mouse[1]-5,10,10);
            ctx.beginPath();
            ctx.arc(limit.x/2,limit.y/2,(limit.x+limit.y)/1.5,0,Math.PI*2);
            ctx.stroke();
            ctx.closePath();
                            for (let user of users){
                                 ctx.fillStyle = 'white';
                                 ctx.textAlign = 'center';
                                 let centerX = Math.max(user.radius,Math.min(user.x,limit.x-user.radius));
                                 let centerY = Math.max(user.radius,Math.min(user.y,limit.y-user.radius));
                                if (user.lastMsg && Date.now() < user.sendTime+10000){
                                    ctx.globalAlpha = 10-((Date.now()-user.sendTime)/1000)
                                    ctx.font = Math.max(5,20-(user.lastMsg.length/5))+'px arial';
                                    ctx.fillText(user.lastMsg,centerX,centerY-user.radius-(20+((Date.now()-user.sendTime)/500)));
                                    ctx.globalAlpha = 1;
                                }
                                 if (user.team == 2){
                                     ctx.fillStyle = 'red';
                                 }
                                 if (user.team == 3){
                                     ctx.fillStyle = 'blue';
                                 }
                                 if (user.team == 4){
                                     ctx.fillStyle = 'green';
                                 }
                                 if (user.team == 5){
                                     ctx.fillStyle = 'yellow';
                                 }
                                ctx.strokeStyle = 'black';
                                if (user.alive){
                 ctx.globalAlpha = 0.5;
                 ctx.beginPath();
                 ctx.arc(user.grappleX,user.grappleY,user.grappleRadius,0,Math.PI*2);
                 ctx.fill();
                 ctx.closePath();
                 user.frameDie = false;
                                }else if(user.deathTime && user.deathTime > gmstrt){
                                    let alpha = Math.max(0,1-(Date.now()-user.deathTime)/8000);
                                    ctx.globalAlpha = alpha;
                               ctx.strokeText(user.name,centerX,centerY+user.radius+20)
                 ctx.fillText(user.name,centerX,centerY+user.radius+20)
                                 user.ly *= 0.99;
                                 user.lx *= 0.99;
                                 user.x += user.lx*(dt/5);
                                 user.y += user.ly*(dt/5);
                                 ctx.strokeStyle = 'red';
                                 ctx.beginPath();
                                 ctx.moveTo(centerX-user.radius,centerY-user.radius);
                                 ctx.lineTo(centerX+user.radius,centerY+user.radius);
                                 ctx.moveTo(centerX-user.radius,centerY+user.radius);
                                 ctx.lineTo(centerX+user.radius,centerY-user.radius);
                                 ctx.stroke();
                                 ctx.closePath();
                                 ctx.globalAlpha = 1;
                                }
                            }
          if (hostId == botId){
          modeBar.style.opacity = 1;
          modeBar.style.pointerEvents = 'auto';
          }else{
          modeBar.style.opacity = 0.5;
          modeBar.style.pointerEvents = 'none';
          if (mode !== 7){
           mode = 7;
          }
          }
        }else{
          if (hostId == botId){
          modeBar.style.opacity = 1;
          modeBar.style.pointerEvents = 'auto';
          }else{
          modeBar.style.opacity = 0.5;
          modeBar.style.pointerEvents = 'none';
          if (mode !== 7){
           mode = 7;
          }
          }
        }
    }
}
                                         );

window.PIXI.Graphics.prototype.arc = function(...args){
     return originalCall3.call(this,...args);
}

window.PIXI.Graphics.prototype.drawCircle = function(...args){
if (this.parent){
 var This = this;
        if (args[0] !== 0 || args[1] !== 0){
                for (let i of This.parent.children){
     if (i._text){
         let user = findUserByName(i._text);
         if (user){
             user.grappleX = ((this.parent.x/limit.x2)*limit.x)+args[0];
             user.grappleY = ((this.parent.y/limit.y2)*limit.y)+args[1];
             user.grappleDelay = 10;
             user.grappleRadius = args[2];
             break;
         }
     }
                }
        }else{
 var id;
 id = setInterval(() => {
     if (This.parent){
    for (let i of This.parent.children){
     if (i._text){
         let user = findUserByName(i._text);
         if (user){
             if (!user.gotRadius || args[2] <= user.radius){
          user.radius = args[2];
          user.gotRadius = true;
             }else{
              clearInterval(id);
             }
             if (!This || !This.parent || !This.transform){
                 if (user.gotRadius && args[2] == user.radius){
                  user.gotRadius = false;
                 }
              clearInterval(id);
             }else{
              user.object = This.parent;
             }
         }else{
                           clearInterval(id);
         }
      break;
     }
    }
     }else{
      clearInterval(id);
     }
 });

        }
}
        return originalCall.call(this,...args);
}

let bonkId1 = setInterval(() => {
 if (!bonkiocontainer){
  bonkiocontainer = document.getElementById('bonkiocontainer');
 }else{
  bonkiocontainer.addEventListener("mousemove",function(e){
   let rect = bonkiocontainer.getBoundingClientRect();
   mouse[0] = (((((e.clientX-rect.left)-lastCAMX)/limit.x2)*limit.x)/lastCAMS)-5;
   mouse[1] = (((((e.clientY-rect.top)-lastCAMY)/limit.y2)*limit.y)/lastCAMS)-5;
  })
  bonkiocontainer.addEventListener("mousedown",function(e){
      if (shiftKey){
      for (let p of users){
       if (p.alive){
       let a = p.x-mouse[0];
       let b = p.y-mouse[1];
       let dist = Math.sqrt(a*a+b*b);
       if (dist < p.radius*1.5){
        let frame = Math.floor((Date.now() - gmstrt)/1000*30);
        websocket.send('42[25,{"a":{"playersLeft":['+p.id+'],"playersJoined":[]},"f":'+frame+'}]');
        websocket.onmessage({data:'42[31,{"a":{"playersLeft":['+p.id+'],"playersJoined":[]},"f":'+frame+'}]'});
        break;
       }
       }
      }
      }
  })

  window.addEventListener("keydown",function(e){
      if (document.activeElement !== chatInput2){
                 if (e.keyCode == 90){
                     selPlayer = -1;
                    for (let p of users){
       if (p.alive){
       let a = p.x-mouse[0];
       let b = p.y-mouse[1];
       let dist = Math.sqrt(a*a+b*b);
       if (dist < p.radius){
        selPlayer = p.id;
        displayOnChat(p.name+' watch yo tone');
        break;
       }
       }
      }
           }
     if (e.keyCode == 17){
      e.preventDefault();
      shiftKey = true;
     }
     if (e.keyCode == 9){
      e.preventDefault();
      tabKey = true;
     }
      if (shiftKey && e.keyCode == 70){
      battleCam = !battleCam;
      e.preventDefault();
      }
      if (shiftKey && e.keyCode == 66) {
      if (instantPlay){
       displayOnChat("QUICK PLAY")
       instantPlay = false;
       quickplay = true;
       e.preventDefault();
      }else if (quickplay){
       displayOnChat("NORMAL PLAY")
       quickplay = false;
       instantPlay = false;
       e.preventDefault();
      }else{
       displayOnChat("INSTANT PLAY")
       instantPlay = true;
       quickplay = false;
       e.preventDefault();
      }
     }
     if (shiftKey && e.keyCode == 83){
          document.getElementById("newbonklobby_editorbutton").click();
          document.getElementById("mapeditor_midbox_testbutton").click();
          document.getElementById("mapeditor_close").click();
          e.preventDefault();
     }
     if (shiftKey && e.keyCode == 68){
          document.getElementById("newbonklobby_editorbutton").click();
          document.getElementById('mapeditor_midbox_settingsbutton').click();
          e.preventDefault();
     }
      }
      })

  window.addEventListener("keyup",function(e){
     if (e.keyCode == 17){
      shiftKey = false;
      e.preventDefault();
     }
     if (e.keyCode == 9){
      e.preventDefault();
      tabKey = false;
     }
  })
  clearInterval(bonkId1);
 }
},50)

let chatId1 = setInterval(() => {
if (!chatInput1 || !chatBox){
    chatInput1 = document.getElementById('newbonklobby_chat_input');
    chatBox = document.getElementById('newbonklobby_chat_content');
    if (chatBox && chatInput1){
       chatInput1.addEventListener("keydown",(e) => {
            if (e.keyCode == 13){
            let msg = chatInput1.value;
            if (msg.startsWith('/')){
               if (msg.startsWith('/eval ')){
                   let evl = msg.substring(5,msg.length) || 'console.log("Nothing?");';
                   try{
                   printOnChat = true;
                   eval(evl);
                   }catch(error){
                    displayOnChat(error);
                   }
                   printOnChat = false;
                   chatInput1.value = ''
               }
            }
            }
       })
    }
}else{
  clearInterval(chatId1);
}
},50)

let chatId2 = setInterval(() => {
if (!chatInput2 || !chatBox2){
    chatInput2 = document.getElementById('ingamechatinputtext');
    chatBox2 = document.getElementById('ingamechatcontent');
    if (chatBox2 && chatInput2){
       chatInput2.addEventListener("keydown",(e) => {
            if (e.keyCode == 13){
            let msg = chatInput2.value;
            if (msg.startsWith('/')){
               if (msg.startsWith('/eval ')){
                   let evl = msg.split(' ')[1] || 'console.log("Nothing?");';
                   try{
                   printOnChat = true;
                   eval(evl);
                   }catch(error){
                    displayOnChat(error);
                   }
                   printOnChat = false;
                   chatInput2.value = ''
               }
            }
            }
       })
    }
}else{
  clearInterval(chatId2);
}
},50)
