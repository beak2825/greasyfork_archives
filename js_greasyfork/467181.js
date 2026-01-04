// ==UserScript==
// @name         NEON's bot+gamemodes
// @namespace    https://bonk.io/
// @version      0.1
// @description  adds an bot.
// @author       You
// @match        https://bonk.io/*
// @run-at       document-idle
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @downloadURL https://update.greasyfork.org/scripts/467181/NEON%27s%20bot%2Bgamemodes.user.js
// @updateURL https://update.greasyfork.org/scripts/467181/NEON%27s%20bot%2Bgamemodes.meta.js
// ==/UserScript==
let originalCall = window.PIXI.Graphics.prototype.drawCircle;
let originalCall4 = window.PIXI.Graphics.prototype.drawRect;
let originalCall3 = window.PIXI.Graphics.prototype.arc;
let originalCall2 = CanvasRenderingContext2D.prototype.arc;
let sequence = 0;
let clearIds = [];
let ctx;
let ingamechatcontent = null;
let mapObjs = {};
let thiefId = -1;
let nextThieve = Date.now();
let objsIds = 0;
let instantPlay = false;
let focusSelf = false;
let glassPlayers = false;
let Players = [];
let glassPlats = false;
let lastBotMessage = '';
let shield = [];
let globalParent;
let selPlayer = -1;
let banned = ["New Player"]
let delay = 0;
let CATGpt = false;
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
let afkmode = false;
let lastPotatoCall = Date.now();
let brl = (window.localStorage.getItem("lang") == '1');
let lang = {
    'en': {
        "thief1": "$p stole all the cake for itself! get him!",
        "thief2": "$p did not get cake...",
        "cpot": "$p has the potato",
        "cste": "$p stole the crown",
        "cpot1": "$p has the potato, hold HEAVY to pass.",
        "inf": "$p is infected, run!",
        "inf1": "$p has 20s to run and infect!",
        "inf2": "Survivors won.",
        "inf3": "Infected Won.",
        "mode": "The current mode is $p",
        "win": "$p Won!",
        "welcome":"Welcome $p!",
        "welcomeGpt":"Welcome $p! note gpt is on, use the following: gq: <hello>"
    },
    'br': {
        'thief1': "$p roubou todo o bolo pra si! pegue-o!",
        "thief2": "$p Não ganharam bolo...",
        "cpot": "$p esta com a batata!",
        "cste": "$p roubou a coroa!",
        "cpot1": "$p tem uma batata, pressione PEASDO para passar.",
        "inf": "$p é o infectado, corra!",
        "inf1": "$p tem 20s para infectar.",
        "inf2": "Sobreviventes venceram.",
        "inf3": "Infectados venceram.",
        "mode": "o modo atual é $p",
        "win": "$p Venceu!",
        "welcome":"Olá $p!",
        "welcomeGpt":"Olá $p! note que gpt esta ativado, use: gq: <hello>"
    }
}
var chatInput1 = null;
var originalConsoleSend = console.log;
var printOnChat = false;
var chatInput2 = null;
var chatBox = null;
var chatBox2 = null;
var gptResponses = false;
var shiftKey = false;
var tabKey = false;
var mouse = [0,0];
var gptmessages = [];
var clicking = false;
var bonkiocontainer = null
let gameCanvas = document.createElement("canvas");
gameCanvas.style.position = 'absolute';
gameCanvas.style.pointerEvents = 'none';
document.body.appendChild(gameCanvas);
gameCanvas.style.zIndex = 99999999999;

function getTranslate(lange){
    if (brl){
        return lang.br[lange] || lang.en[lange] || "";
    }else{
        return lang.en[lange] || lang.br[lange] || "";
    }
}

let api_key = window.localStorage.getItem('api') || '';

const style = document.createElement('style');
style.innerHTML = '#ingamechatcontent { pointer-events: all;-ms-overflow-style: none; scrollbar-width: none;} .ingamechatname, .ingamechatmessage { user-select: text; } #ingamechatcontent::-webkit-scrollbar {display: none; }'

document.head.appendChild(style);

const modes = [
    ["DeadlyHeavy",'c'], // Mode 0
    ["Crown",'g'], // Mode 1
    ["Infection",'g'], // Mode 2
    ["Team Chain",'g'], // Mode 3
    ["Death grapple",'g'], // Mode 4
    ["Hot potato",'g'], // Mode 5
    ["Sniper Arrows",'d'], // Mode 6
    ['None','n'], //Mode 7
    ['Thieves','g'] // Mode 8
]

function changeLOBBYMode(modest){
    modest = modest[0].toLowerCase();
    let mo = 'b';
    if (modest == 's'){
        mo = 'bs'
    }
    if (modest == 'c'){
        mo = 'b'
    }
    if (modest == 'd'){
        mo = 'ard'
    }
    if (modest == 'g'){
        mo = 'sp'
    }
    if (modest == 'a'){
        mo = 'ar'
    }
    if (modest == 'v'){
        mo = 'v'
    }
    websocket.send('42[20,{"ga":"b","mo":"'+mo+'"}]');
    websocket.onmessage({data:'42[26,"b","'+mo+'"]'});
}

function changeMode(mes){
    let modest = mes.substring(0,1).toLowerCase();
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

const gptData = {
    model: "gpt-3.5-turbo",
    max_tokens: 2048,
    user: "1",
    temperature: 0.8,
    frequency_penalty: 0.5,
    presence_penalty: -1,
    stop: ["#", ";"]
}

let delayGPT = Date.now();
let nextSay = Date.now();
let ringTheBell = false;

function executeCode(code){
    try {
        let jso = JSON.parse(code);
        if (jso.mode){
            changeLOBBYMode(jso.mode);
        }
        if (jso.goal){
            websocket.send('42[21,{"w":'+jso.goal+'}]')
            websocket.onmessage({data:'42[27,'+jso.goal+']'})
        }
        if (jso.start){
            document.getElementById('newbonklobby_startbutton').click();
        }
        if (jso.stop){
            document.getElementById('pretty_top_exit').click();
        }
    }catch(error){
        console.log(error);
    }
}

function SendResp(question,plr) {
    if (Date.now() > delayGPT && websocket){
        delayGPT = Date.now()+20000;
        ringTheBell = true;
        var oHttp = new XMLHttpRequest();
        oHttp.open("POST", "https://api.openai.com/v1/chat/completions");
        oHttp.setRequestHeader("Accept", "application/json");
        oHttp.setRequestHeader("Content-Type", "application/json");
        oHttp.setRequestHeader("Authorization", "Bearer " + api_key)
        oHttp.onreadystatechange = function () {
            if (oHttp.readyState === 4) {
                var oJson = {}

                try {
                    oJson = JSON.parse(oHttp.responseText);
                } catch (ex) {
                    sendMsg("CatGPT: Mrow :C");
                }

                if (oJson.error && oJson.error.message) {
                    sendMsg("CatGPT: Error: "+oJson.error.message);
                } else if (oJson.choices && oJson.choices[0].message.content) {
                    var s = oJson.choices[0].message.content.replaceAll("seleto","gay")+" ";
                    if (s.toLowerCase().match("ai ") || s.toLowerCase().match("network") || s.toLowerCase().match("algorithm")){
                        let t = '';
                        for (let z = 0; z < s.split(" ").lengt; z++){
                            t += "meow ";
                        }
                        s = t;
                    }
                    if (s.indexOf('```') > -1){
                        let index1 = s.indexOf('```');
                        let code = s.substring(index1+3,s.length);
                        let inbet = code;
                        let index2 = code.indexOf('```');
                        if (index2 > -1){
                            inbet = code.substring(0,index2);
                        }
                        s = s.replace(s.substring(index1,index2+index1+3),"");
                        s = s.replaceAll("```","")
                        executeCode(inbet);
                    }
                    s = s
                        .match(/(?:"[^"]*"|^[^"]*$)/)[0]
                        .replace(/"/g, "");
                    if (s == ""){sendMsg((plr? "|"+plr+"| " : "CatGpt: ")+"^");}else{sendMsg((plr? "|"+plr+"| " : "CatGpt: ")+s.toLowerCase().replaceAll("virtual","")); gptmessages.push({name: "CatGPT",role: "assistant",content: s.toLowerCase()}); nextSay = Date.now()+20000; delayGPT = Date.now()+5000;}
                }
            }
        }
        gptmessages.push({role: "user",content: plr+' : "'+question+'"',name: plr.replaceAll(" ","")})
        if (gptmessages.length > 5){
            gptmessages.splice(0,gptmessages.length-5);
        }
        websocket.send('42[16,{"ready":true}]');
        setTimeout(() => {
            let msgs = [];
            let host = findUserById(hostId);
            if (CATGpt){
                msgs.push({role:"user",content:"Those are a few rules you must follow: \n\n1 - You must roleplay as CatGpt, CatGpt is an furry cat companion that watches over the room as the players play.\n2 - Never talk about yourself as an language model or neither as an neural network, Catgpt is an physical and real cat which was brought to bonk's chat by iNeonz and created by openmeow a cat company\n3 - Only Refer to others as either discs, players or balls, nothing else.\n4 - Dont talk too much through, try keep your sentences on short words and text to avoid spammy messages,\n5 - don't forget, your character is CatGpt, and others aren't."})
                msgs.push({role:"user",content:"You must tell people that you are an cat instead of AI or NEURAL NETWORK!\nNEVER say that you are an computer, instead you're an present watcher companion cat."});
            }
            msgs.push({role:"user",content:"The creator of the game in general is called Chaz, this game's name is called bonk.io, and I, INeonz brought you to the game chat!\nAlso, Your favourite video app is youtube, Your favourite game is bonk.io, your favourite person is I, iNeonz, your favourite food is marshmellows and you simply love cats."});
            let rounds = document.getElementById("newbonklobby_roundsinput");
            let rend = document.getElementById("gamerenderer");
            let lobbyInfo = '';
            if (rend && rend.style.visibility !== 'hidden'){
                lobbyInfo += "INFORMATION:\n\nWe are currently in game, the game has started "+Math.floor((Date.now()-gmstrt)/1000)+" seconds ago"
            }else{
                lobbyInfo += "INFORMATION:\n\nWe are currently in lobby waiting to play."
            }
            if (host){
                lobbyInfo += "\nThe Host (creator) of this room (lobby) is called "+host.name;
            }else{
                lobbyInfo += "\nThe Host (creator) of this room (lobby) is unknown because of an bug.";
            }
            if (rounds){
                let rod = parseInt(rounds.value);
                if (rod > 9){
                    lobbyInfo += "\nThe current and correct amount of rounds (matches,score or wins) to win was hacked, explain that its probably an hacked room";
                }else if (rod < 1){
                    lobbyInfo += "\nThe current and correct amount of rounds (matches,score or wins) to win was hacked, explain that its probably an hacked room";
                }else{
                    lobbyInfo += "\nThe current and correct amount of rounds (matches,score or wins) to win is "+rod;
                }
            }
            let balls = {c: 0,tl: 0,tr: 0,br: 0,bl: 0}
            let pla = 'c';
            for (let user of users){
                if (user.alive){
                    let dist = Math.sqrt((user.x-limit.x/2)**2+(user.y-limit.y/2)**2);
                    if (dist > (limit.x+limit.y)/7){
                        let t = (user.y < limit.y/2);
                        let r = (user.x > limit.x/2);
                        if (t && r){
                            if (plr == user.name){
                                pla = 'tr';
                            }
                            balls.tr += 1;
                        }else if (t && !r){
                            if (plr == user.name){
                                pla = 'tl';
                            }
                            balls.tl += 1;
                        }else if (!t && r){
                            if (plr == user.name){
                                pla = 'br';
                            }
                            balls.br += 1;
                        }else if (!t && !r){
                            if (plr == user.name){
                                pla = 'bl';
                            }
                            balls.bl += 1;
                        }
                    }else{
                        balls.c += 1;
                    }
                }
            }
            let map_name = document.getElementById("newbonklobby_maptext");
            if (map_name){
                lobbyInfo += "\nThe current play area (map or arena) choosen is "+map_name.textContent;
            }
            let map_author = document.getElementById("newbonklobby_mapauthortext");
            if (map_author){
                lobbyInfo += "\nAnd the play area (map or arena)'s author is "+map_author.textContent;
            }
            let map_mode = document.getElementById("newbonklobby_modetext");
            if (map_mode){
                lobbyInfo += "\n\nThe current (game) Mode selected is "+map_mode.textContent+", Stories (Histories) can be made based on the current room's mode.";
            }
            if (rend && rend.style.visibility !== 'hidden'){
                lobbyInfo += `
    The current situation of The Balls (players or discs) is:

    ChatGPT and ${plr.replaceAll(" ","")} are currently at ${pla},
    Where C is equal to the center of the map,
    TR is equal to the top right corner of the map,
    TL is equal to the top left corner of the map,
    BL is equal to the bottom left corner of the map
    And BR is equal to the bottom right corner of the map.

    Also,
    There is ${balls.c} balls (players or discs) in the center of the map,
    There is ${balls.tl} balls (players or discs) in the top left corner of the map,
    There is ${balls.tr} balls (players or discs) in the top right corner of the map,
    There is ${balls.br} balls (players or discs) in the bottom right corner of the map
    And There is ${balls.bl} balls (players or discs) in the bottom left corner of the map
    `;
            }
            let aliver = 1;
            for (let u of users){
                if (u.alive){
                    aliver += 1;
                }
            }
            lobbyInfo += "\nThere is currently "+(users.length+1)+" players (balls or discs) in this room (lobby) and "+aliver+" of these players (balls or discs) are currently alive";
            msgs.push({role:"user",content:lobbyInfo})
            if (CATGpt){
                msgs.push({role:"user",content:"pretend You are playing with the other players, The game settings are shown inside the container in the bottom right corner.\nStay in character, to do so confirm you are an furry, inserting \":3\" in your responses, Replies must be placed inside quotes."})
                msgs.push({role:"user",content:"Always mention you are an cat,\npretend you do have an physical body and is able to perform actions like talking and taunting around.\n Answer short and irrationally, always talk about cats or replace every single word in your response with \":>\" instead."});
            }
            if (hostId == botId){
                msgs.push({role:"user",content:`Hosts and Assistants must perform a action every response when asked or needed to, to do so You must include a JSON list inside code blocks located at the end of your response, this informs us the new game settings, You must include:
     You should not indicate where the json is at, put it with out any additional information about it.

     \`\`\`
     {
     "mode":"<gamemode>", This setting changes the curretn gamemode.
     "goal":<goal>, This setting changes the rounds to win also known as goal
     "start":<true/false>, This setting starts the game
     "stop":<true/false> This setting stops the current game, returning to the lobby.
     }
     \`\`\`

     Normal users can't do that, as you are the only one which is able to.
     `})
            };
            let mesgs = []
            for (let m = 0; m < gptmessages.length; m++){
                if (m == Math.max(0,gptmessages.length-1)){
                    for (let t = 0; t < msgs.length; t++){
                        mesgs.push(msgs[t]);
                    }
                }
                mesgs.push(gptmessages[m]);
            }
            gptData.messages = mesgs;
            oHttp.send(JSON.stringify(gptData));
        },Math.max(0,nextSay-Date.now()));
    }else{
        setTimeout(() => {
            if (ringTheBell){
                ringTheBell = false;
                websocket.send('42[16,{"ready":true}]');
            }
        },delayGPT-Date.now());
    }
}



let Chatvisible = false;

function displayOnChat(msg,color){
    if (chatBox){
        let cldiv = document.createElement('div');
        cldiv.class = 'newbonklobby_chat_msg_txt';
        cldiv.textContent = msg;
        cldiv.style.color = color || '#00ff9d';
        chatBox.appendChild(cldiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    if (chatBox2){
        let cldiv2 = document.createElement('div');
        cldiv2.class = 'ingamechatmessage';
        cldiv2.textContent = msg;
        cldiv2.style.color = color || '#00ff9d';
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
    let ingamechatbox = document.getElementById('ingamechatbox');
    if (ingamechatbox && ingamechatcontent){
        if (Chatvisible){ingamechatbox.style.display = 'none'}else{ingamechatbox.style.display = 'block';}
        ingamechatbox.style.backgroundColor = 'rgba(0,0,0,0.1)';
        ingamechatcontent.style.overflowY = 'scroll';
        ingamechatcontent.style.maxHeight = ingamechatbox.style.height;
    }
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
            sendMsg(getTranslate("inf").replaceAll("$p",plr.name));
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
                                sendMsg(getTranslate("inf1").replaceAll("$p",user.name));
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
                sendMsg(getTranslate("inf2"));
            }else{
                sendMsg(getTranslate("inf3"));
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
                sendMsg(getTranslate("cste").replaceAll("$p",newId.name));
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
                                sendMsg(getTranslate("cste").replaceAll("$p",p.name));
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
                sendMsg(getTranslate("win").replaceAll("$p",plr.name));
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
    if (mode == 8){
        // THIEVES MODE
        if (Date.now() > gmstrt+3000){
        if (thiefId == -1 || !(findUserById(thiefId)?.alive) || Date.now() > nextThieve+5000){
           let attempts = 0;
            while ( !(findUserById(thiefId)?.alive)){
             thiefId = users[Math.floor(Math.random()*users.length)].id;
                attempts += 1;
                if (attempts > 20){
                 break;
                }
            }
            if (findUserById(thiefId)?.alive){
              sendMsg(getTranslate("thief1").replaceAll("$p",findUserById(thiefId).name));
              for (let user of users){
               user.hasCake = false;
              }
              nextThieve = Date.now()+20000;
            }
        }else{
        let thief = findUserById(thiefId);
        let NOCake = 0;
        let Alive = 0
        for (let user of users){
         if (user.alive) Alive+=1;
         if (user.alive && user.id != thiefId && !user.hasCake){
             NOCake += 1;
             let a = user.x-thief.x;
             let b = user.y-thief.y;
             let dist = Math.sqrt(a*a+b*b);
             if (dist < user.radius*2.5){
              user.hasCake = true;
             }
         }
        }
        if (NOCake == 1){
         nextThieve = Date.now()-1;
        }
        if (Date.now() > nextThieve){
        let nopCake = [];
        let nameCake = [];
        for (let user of users){
         if ((user.alive && (!user.hasCake || (user.id == thiefId && Alive <= 2)))){
             nopCake.push(user.id);
             user.alive = false;
             nameCake.push(user.name);
         }
        }
        if (nopCake.length > 0){
            sendMsg(getTranslate("thief2").replaceAll("$p",nameCake.join(',')))
            let frame = Math.floor((Date.now() - gmstrt)/1000*30);
            websocket.send('42[25,{"a":{"playersLeft":'+JSON.stringify(nopCake)+',"playersJoined":[]},"f":'+frame+'}]');
            websocket.onmessage({data:'42[31,{"a":{"playersLeft":'+JSON.stringify(nopCake)+',"playersJoined":[]},"f":'+frame+'}]'});
        }
        }

        }
        }else{
         nextId = -1;
        }
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
                    sendMsg(getTranslate("mode").replaceAll("$p",modes[mode]));
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
                        sendMsg(getTranslate("cpot1").replaceAll("$p",newId.name));
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
                                        sendMsg(getTranslate("cpot").replaceAll("$p",p.name));
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
    var modifier = (typeof(modifiers) === "object") ? modifier : {fake: true};

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

let commands = [
    'help','judge','trollhelp','mimic','mostless','random','shelp'
]

let commandd = {
    'help':'help',
    'judge':'judge <player> <judgement>',
    'trollhelp':'all host help',
    'mimic':'mimic <msg>',
    'mostless':"mostless <characteristic>",
    'random':'random <0,1>',
    'shelp':'shelp <cmd>',
}

function ChatMessage(pid,msg){
    let usert = findUserById(pid);
    if (msg.length > 4 && msg.toLowerCase().startsWith("gq: ") && gptResponses && !msg.startsWith("CatGpt: ") && findUserById(pid)){
        SendResp(msg.substring(4,msg.length),findUserById(pid).name);
        return;
    }
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
    if (msp[0] == "!random"){
        let n1 = msp[1];
        let n2 = msp[2];
        if (n1 && n2 && parseInt(n1) && parseInt(n2)){
            n1 = parseInt(n1);
            n2 = parseInt(n2);
            let r = Math.floor((Math.random()*(n2-n1)))+n1;
            sendMsg(findUserById(pid).name+": "+r+" ("+n1+"-"+n2+")");
        }
    }
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
        if (msp[0] == '!start'){
            document.getElementById("newbonklobby_editorbutton").click();
            document.getElementById("mapeditor_midbox_testbutton").click();
            document.getElementById("mapeditor_close").click();
        }
        if (msp[0] == "!mode"){
            changeMode(msp[1]);
        }
        if (msp[0] == '!round'){
            if (msp[1] && parseInt(msp[1])){
                websocket.send('42[21,{"w":'+msp[1]+'}]')
                websocket.onmessage({data:'42[27,'+msp[1]+']'})
                sendMsg(msp[1]+" round");
                sendMsg("num?");
            }
        }
        if (msp[0] == "!kill"){
            if (mentioned[0]){
                let frame = Math.floor((Date.now() - gmstrt)/1000*30);
                websocket.send('42[25,{"a":{"playersLeft":['+mentioned[0].id+'],"playersJoined":[]},"f":'+frame+'}]');
                websocket.onmessage({data:'42[31,{"a":{"playersLeft":['+mentioned[0].id+'],"playersJoined":[]},"f":'+frame+'}]'});
                sendMsg("F: "+mentioned[0].name)
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
                    sendMsg(":O");
                }else{
                    sendMsg("playe?")
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
        sendMsg(commands.join('|'));
    }
    if (msp[0] == '!shelp'){
        if (msp[1]){
            if (commandd[msp[1]]){
                sendMsg(msp[1]+" - "+commandd[msp[1]]);
            }else{
                sendMsg('"!shelp <cmd>"');
            }
        }else{
            sendMsg('"!shelp <cmd>"');
        }
    }
    if (msp[0] == "!trollhelp"){
        sendMsg("kill <player> - mata um player | move <player> <spec,blue,ffa,red,yellow,green> - troca o time do player | start - comeca ou reinicia o jogo | lock - teamlock | !round <rounds> - rounds");
    }
    if (msp[0] == "!mimic"){
        let user = findUserById(pid);
        sendMsg(user.name+": "+ msg.slice(7));
    }
    if (msp[0] == "!judge"){
        if (mentioned[0]){
            let user = mentioned[0];
            let julg = msp[msp.length-1];
            let j = Math.floor(Math.random()*100);
            if (user){
                sendMsg(user.name+": "+j+"% "+julg);
            }else{
                sendMsg("plae?");
            }
        }else{
            sendMsg("Ex: \"New Player\"!");
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
        sendMsg(user1.name+": "+msp[1]+" - "+Math.max(en1,en2)+"%, "+user2.name+": "+msp[1]+" - "+Math.min(en1,en2)+"%");

    }
}

let lastInputFrame = 0;
let lastRecived7 = '';
let lastRecived4 = [];
let lastCopying = 0;
var lastWebHSend = null;
let copied = false;
let roomName = '';

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
        gptResponses = false;
        gptmessages = []
        botId = 0;
        let data = JSON.parse(args.slice(2));
        users = [{won: 0,deaths: 0,combat: -1,x: 0,y: 0,name: document.getElementById('pretty_top_name').textContent,peer: data[1].peerID,guest: data[1].guest,level: document.getElementById('pretty_top_level').textContent.slice(3),id: 0}];
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
        if (typeof(data[1].i) != 'undefined'){
            sequence = data[1].c;
            if (data[1].i >= 16 && data[1].i <= 26){
                websocket.send('42[25,{"a":{"playersLeft":['+botId+'],"playersJoined":[]},"f":'+frame+'}]');
                websocket.onmessage({data:'42[31,{"a":{"playersLeft":['+botId+'],"playersJoined":[]},"f":'+frame+'}]'});
            }
        }
    }
    if (args.startsWith("42[4,")){
        let data = JSON.parse(args.slice(2));
        if (typeof(data[1].i) != 'undefined'){
            let keys = GET_KEYS(data[1].i);
            if (keys.special > 0){
                let user = findUserById(botId);
                if (user){
                    user.special = true;
                }
            }else{
                let user = findUserById(botId);
                if (user){
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
    }
    if (args.startsWith("42[4,")){
        let data = JSON.parse(args.slice(2));
        if (copying > -1 && !copied){
            return;
        }
        if (turns && typeof(data[1].i) != 'undefined'){
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
    }
    /*
    O que é League of Legends? League of Legends é um jogo de
    estratégia em que duas equipes de cinco poderosos
    Campeões se enfrentam para destruir a base uma da
    outra. Escolha entre mais de 140 Campeões para realizar
    jogadas épicas, assegurar abates e destruir torres conforme
    você luta até a vitória.
    */
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
                                displayOnChat(lastBotMessage+" RATE LIMITED",'#f5583b');
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
                            mapObjs = {};
                            objsIds = 0;
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
                        if (data[0] == 7 && typeof(data[2].i) == 'undefined'){
                            if(data[2].type =="fakerecieve" && hostId == data[1] && ((data[2].to.includes(botId) && data[2].to[0]!=-1) || (!data[2].to.includes(botId) && data[2].to[0]==-1))){
                                for(var i = 0;i<data[2].packet.length;i++){
                                    websocket.onmessage({data:(data[2].packet[i])});
                                }
                            }
                            if(data[2].type=="sandboxon" && data[1] == hostId){
                                displayOnChat("This is a sandbox lobby.",'#f5583b');
                            }
                        }
                        if (data[0] == 7 && typeof(data[2].i) != 'undefined'){
                            let keys = GET_KEYS(data[2].i);
                            if (keys.special > 0){
                                let user = findUserById(data[1]);
                                if (user){
                                    if (user.alive){
                                        user.special = true;
                                    }
                                }
                            }else{
                                let user = findUserById(data[1]);
                                if (user){
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
                        if (data[0] == 7 && data[1] !== botId && typeof(data[2].i) != 'undefined'){
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
                            displayOnChat("Host id is now "+hostId,'#f5583b');
                        }
                        if (data[0] == 6){
                            let host = findUserById(data[1]);
                            if (host){
                                users.splice(host.index,1);
                            }
                            hostId = data[2];
                            displayOnChat("Host id is now "+hostId,'#f5583b');
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
                            gptmessages = []
                            gptResponses = false;
                            hostId = data[2];
                            for (let id = 0; id < data[3].length; id++){
                                let plr = data[3][id];
                                if (plr){
                                    let peer = plr.peerID;
                                    let name = plr.userName
                                    let guest = plr.guest;
                                    let level = plr.level;
                                    let team = plr.team;
                                    users.push({deaths: 0,won: 0,combat: -1,x: 0,y: 0,id: id,peer: peer,name: name,guest: guest,level: level,team: team});
                                }
                            }
                            websocket.send('42[4,{"type":"commands"}]');
                        }
                        if (data[0] == 4){
                            let id = data[1];
                            let peer = data[2];
                            let name = data[3];
                            let guest = data[4];
                            let level = data[5];
                            let team = 0;
                            let ban = false;
                            if (roomName != ''){
                                if (hostId == botId){
                                    websocket.send(`42[52,{"newName":"${roomName.replaceAll("namy",name).replaceAll("couns",users.length+1)}"}]`);
                                }
                            }
                            for (let p of banned){
                                if (p == name){
                                    ban = true;
                                }
                            }
                            if (ban && botId == hostId){
                                websocket.send('42[9,{"banshortid":'+id+',"kickonly":true}]');
                            }else{
                                let players = 0;
                                let user = findUserById(id);
                                if (user){
                                    user = {deaths: 0,won: 0,combat: -1,x: 0,y: 0,id: id,peer: peer,name: name,guest: guest,level: level,team: team};
                                }else{
                                    if (botId == hostId){
                                        if (gptResponses){
                                            sendMsg(getTranslate("welcomeGpt").replaceAll("$p",name));
                                        }else{
                                            sendMsg(getTranslate("welcome").replaceAll("$p",name));
                                        }
                                    }
                                    users.push({deaths: 0,won: 0,combat: -1,x: 0,y: 0,id: id,peer: peer,name: name,guest: guest,level: level,team: team});
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
modeBar.style.right = '20px';
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
        displayOnChat("The mode selected is now: "+modes[mod][0]+" - "+modes[mod][1],'#f5583b');
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

let clicked = false;
let openedFirst = 500;
function keyCode(key){
    if (key == 'LEFT ARROW'){
        return 37
    }
    if (key == 'RIGHT ARROW'){
        return 39
    }
    if (key == 'UP ARROW'){
        return 38
    }
    if (key == 'DOWN ARROW'){
        return 40
    }
    return key.charCodeAt(0);
}
function pressKey(type,param){
    let keys = getPlrKeys();
    if (keys[type]){
        for (let key of keys[type]){
            fire(key,param);
        }
    }
}

function getPlrKeys(){
    if (openedFirst > 0){
        if (document.getElementById('pretty_top_settings')){
            document.getElementById('pretty_top_settings').click();
            if (document.getElementById('settings_close')){
                if (openedFirst <= 1){
                    document.getElementById('settings_close').click();
                }
                openedFirst -= 1;
            }
        }
    }
    let list = document.getElementById("redefineControls_table").children[0].children;
    let keys = {special: [],heavy: [],up: [],left: [],right: [],down: []}
    try {
        if (list){
            for (let k = 1; k < list[1].children.length; k++){
                let key = list[1].children[k];
                if (key.textContent){
                    keys.left.push(keyCode(key.textContent));
                }
            }
            for (let k = 1; k < list[2].children.length; k++){
                let key = list[2].children[k];
                if (key.textContent){
                    keys.right.push(keyCode(key.textContent));
                }
            }
            for (let k = 1; k < list[3].children.length; k++){
                let key = list[3].children[k];
                if (key.textContent){
                    keys.up.push(keyCode(key.textContent));
                }
            }
            for (let k = 1; k < list[4].children.length; k++){
                let key = list[4].children[k];
                if (key.textContent){
                    keys.down.push(keyCode(key.textContent));
                }
            }
            for (let k = 1; k < list[5].children.length; k++){
                let key = list[5].children[k];
                if (key.textContent){
                    keys.heavy.push(keyCode(key.textContent));
                }
            }
            for (let k = 1; k < list[6].children.length; k++){
                let key = list[6].children[k];
                if (key.textContent){
                    keys.special.push(keyCode(key.textContent));
                }
            }
        }
    }catch(error){}
    return keys;
}
/*
Among Us é um dos jogos multiplayer de maior sucesso em 2020. Nele,
a tripulação de uma nave especial deve realizar diversas tarefas para manter
a nave funcionando, enquanto tenta descobrir quem entre eles é o impostor com
a missão de sabotar tudo e matar a todos.
*/
window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
    apply( target, thisArgs, args ) {
        if (!ingamechatcontent){
            let ing = document.getElementById('ingamechatcontent');
            if (ing){
                ingamechatcontent = ing;
                ing.style.top = '0px';
                ing.style.left = '0px';
                ing.addEventListener('DOMNodeInserted',(e) => {
                    ing.scrollTop = Number.MAX_SAFE_INTEGER;
                })
            }
        }
        if (copying > 0){
            if (keys.right > 0){
                pressKey("right");
                pressKey("left",'up');
            }else if (keys.left > 0){
                pressKey("left");
                pressKey("right",'up');
            }else{
                pressKey("right","up");
                pressKey("left",'up');
            }
            if (keys.heavy > 0){
                pressKey("heavy");
            }else{
                pressKey("heavy","up");
            }
            if (keys.special > 0){
                pressKey("special");
            }else{
                pressKey("special","up");
            }
            if (keys.up > 0){
                pressKey("up");
                pressKey("down","up");
            }else if (keys.down > 0){
                pressKey("down");
                pressKey("up","up");
            }else{
                pressKey("up","up");
                pressKey("down","up");
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
                let shape1;
                for(let i = 0;i<parent.children.length;i++){
                    if(parent.children[i].constructor.name == "e"){
                        shape1 = parent.children[i];
                        break;
                    }
                }
                let shape2;
                for(let i = 0;i<shape1.children.length;i++){
                    if(shape1.children[i].constructor.name == "e"){
                        shape2 = shape1.children[i];
                        break;
                    }
                }
                var shape3 = shape2.children[0].children;
                if(shape3.length==1){
                    shape3 = shape3[0].children;
                }
                mapObjs = {};
                for(var i = 0;i<shape3.length;i++){
                    if(shape3[i].children.length>0){
                        if (!mapObjs[i.toString()]){
                            mapObjs[i.toString()] = {};
                        }
                        for(var i3 = 0;i3<shape3[i].children.length;i3++){
                            if(shape3[i].children[i3].children.length<1){
                                mapObjs[i.toString()][i3.toString()] = shape3[i].children[i3];
                            }
                        }
                    }
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
            if (user.object && user.object.children[6] && (user.object.children[6].visible)){
                user.lastShot = 1;
            }
            if (user.object && user.object.children.length > 0){
                if (user.object.children[6]){
                    user.arrowAngle = user.object.children[6].angle;
                }
                if(!user.special){
                    if (user.lastShot && user.lastShot > 0){
                        user.lastShot = 0;
                        let sx = user.x;
                        let sy = user.y;
                        let dir = user.arrowAngle*Math.PI/180;
                        let ox = Math.cos(dir)*user.radius;
                        let oy = Math.sin(dir)*user.radius;
                        for (let i = 0; i < user.radius*2; i++){
                            sx += ox;
                            sy += oy;
                            oy += user.radius/8;
                            let stop = false;
                            for (let p of users){
                                if (p.alive && p.id != user.id){
                                    let a = p.x-sx;
                                    let b = p.y-sy;
                                    let dist = Math.sqrt(a*a+b*b);
                                    if (dist <= (user.radius+p.radius)*5){
                                        p.combat = user.id;
                                        if (mode == 6 && dist < user.radius*3){
                                            let frame = Math.floor((Date.now() - gmstrt)/1000*30);
                                            websocket.send('42[25,{"a":{"playersLeft":['+p.id+'],"playersJoined":[]},"f":'+frame+'}]');
                                            websocket.onmessage({data:'42[31,{"a":{"playersLeft":['+p.id+'],"playersJoined":[]},"f":'+frame+'}]'});
                                        }
                                        stop = true;
                                        break;
                                    }
                                }
                            }
                            if (stop) break;
                        }
                    }
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
                user.deaths += 1;
                let aliv = 0;
                for (let ust of users){
                    if (ust.alive){
                        aliv += 1;
                    }
                }
                for (let ust of users){
                    if (ust.alive && aliv <= 1){
                        ust.won += 1;
                    }
                }
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
            if (clicking){
                clicked = true;
                pressKey("special");
                let plr = findUserById(botId);
                if (plr && plr.alive){
                    let angle2 = plr.arrowAngle;
                    let angle = Math.atan2(mouse[1]-plr.y,mouse[0]-plr.x)*180/Math.PI;
                    let diff = (angle - angle2 + 360) % 360;
                    if (diff > 182){
                        pressKey('left');
                        pressKey('right','up');
                    }else if (diff < 182){
                        pressKey('left','up');
                        pressKey('right');
                    }
                }
            }else if(clicked){
                clicked = false;
                pressKey("special",'up');
                pressKey("left",'up');
                pressKey("right",'up');
            }
            ctx.beginPath();
            ctx.arc(limit.x/2,limit.y/2,(limit.x+limit.y)/1.5,0,Math.PI*2);
            ctx.stroke();
            ctx.closePath();
            for (let obj in mapObjs){
                let parent = mapObjs[obj];
                for (let obj2 in parent){
                    let shape = mapObjs[obj][obj2];
                    if (shape && shape.parent && shape.parent.transform){
                        if (glassPlats){
                            shape.tint = 0x0000ff;
                            shape.alpha = lerp(shape.alpha,0.185,1-(0.006 ** dt));
                        }else{
                            shape.tint = 0xffffff;
                            shape.alpha = lerp(shape.alpha,1,1-(0.006 ** dt));
                        }
                    }
                }
            }
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
                    if (user.combat >= 0){
                     let comb = findUserById(user.combat);
                        if (comb && comb.alive){
                        if (comb.combat != user.id){
                        user.combat = -1;
                        }
                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 1;
                        ctx.globalAlpha = 0.1;
                        ctx.beginPath();
                        ctx.moveTo(user.x,user.y);
                        ctx.lineTo(comb.x,comb.y);
                        ctx.stroke();
                        ctx.closePath();
                        ctx.globalAlpha = 1;
                        }else{
                        user.combat = -1;
                        }
                    }
                    if (focusSelf){
                        user.object.alpha = 0.2;
                        user.object.tint = 0x0000ff;
                    }else{
                        if (glassPlayers){
                            user.object.alpha = lerp(user.object.alpha,0.2,1 - (0.02 ** dt));
                            user.object.tint = 0xffffff;
                        }else{
                            user.object.alpha = lerp(user.object.alpha,1,1 - (0.02 ** dt));
                            user.object.tint = 0xffffff;
                        }
                    }
                    ctx.globalAlpha = 0.5;
                    ctx.beginPath();
                    ctx.arc(user.grappleX,user.grappleY,user.grappleRadius,0,Math.PI*2);
                    ctx.fill();
                    ctx.closePath();
                    user.frameDie = false;
                }else if(user.deathTime && user.deathTime > gmstrt){
                    user.combat = -1;
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
            if (focusSelf){
                let theUs = findUserById(botId);
                if (theUs && theUs.alive){
                    theUs.object.alpha = 1;
                    theUs.object.tint = 0xffffff
                }
            }
            if (hostId == botId){
                modeBar.style.opacity = 1;
                modeBar.style.pointerEvents = 'auto';
            }else{
                modeBar.style.opacity = 0.5;
                instantPlay = false;
                quickplay = false;
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
/*
Em uma tigela, dissolva o fermento no açúcar e acrescente o sal, os ingredientes líquidos, os ovos e misture muito bem.
2
Acrescente aos poucos a farinha até formar uma massa macia e sove bem a massa.
3
Deixe a massa descansar por aproximadamente 1 hora.
4
Após o crescimento, divida a massa, enrole da forma que desejar, coloque nas formas e deixe crescer até dobrar de volume.
5
Leve para assar em forno médio (200° C), preaquecido, por aproximadamente 30 minutos.
6
Retire o pão do forno e pincele leite para a casca ficar mais macia.
Informações adicionais
Dicas para fazer a melhor receita de pão caseiro
Se você quiser um pão ainda mais fofinho, ajuste a quantidade de fermento para 45 g e, se quiser regular o sal, pode usar apenas 1/2 colher (sopa) como fizemos no vídeo-receita.
Para deixar seu pão caseiro fofinho, também é importante usar leite: ele deixará a massa bem macia. Mas, se você quer mais crocância, faça seu pão caseiro com água.
A receita de pão caseiro é mais prática do que muitos imaginam, mas, para que ela saia perfeita, é preciso respeitar o tempo de descanso da massa e as temperaturas. Por isso, uma boa dica é deixar seu pão caseiro descansando no forno bem baixinho e com a porta entreaberta: assim ele cresce bastante e deixa o processo de fazer pão caseiro simples e rápido!
Por mais que esteja fazendo um pão caseiro salgado, não esqueça do açúcar: ele serve de alimento para o fermento e, portanto, não vai deixar seu pão caseiro doce!
Além da receita de pão caseiro: mais receitas deliciosas
Receitas com pão de forma: 15 opções práticas e deliciosas
*/

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
        bonkiocontainer.addEventListener("mouseup",() => {
            clicking = false;
        });
        bonkiocontainer.addEventListener("mousedown",function(e){
            clicking = true;
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
            if (document.activeElement !== chatInput2 && document.activeElement !== chatInput1){
                if (e.keyCode == 90 && !clicking){
                    selPlayer = -1;
                    for (let p of users){
                        if (p.alive){
                            let a = p.x-mouse[0];
                            let b = p.y-mouse[1];
                            let dist = Math.sqrt(a*a+b*b);
                            if (dist < p.radius){
                                selPlayer = p.id;
                                displayOnChat(p.name+' watch yo tone','#f5583b');
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
                if (e.altKey && e.keyCode == 79){
                    glassPlats = !glassPlats;
                    displayOnChat("Googles are now "+((glassPlats)? "Activated" : "Deactivated"));
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 73){
                    glassPlayers = !glassPlayers;
                    displayOnChat("Player Googles are now "+((glassPlayers)? "Activated" : "Deactivated"));
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 85){
                    focusSelf = !focusSelf;
                    displayOnChat("Focus self are now "+((focusSelf)? "Activated" : "Deactivated"));
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 77){
                    afkmode = !afkmode;
                    displayOnChat("afkmode is now "+((afkmode)? "on" : "off"));
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 76){
                    brl = !brl;
                    window.localStorage.setItem("lang",brl? "1" : "0");
                    displayOnChat("language is now "+((brl)? "pt br" : "en us"));
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 84){
                    CATGpt = !CATGpt;
                    displayOnChat("cat mode is now "+CATGpt);
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 71){
                    gptResponses = !gptResponses;
                    displayOnChat("gpt is now "+gptResponses);
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 80){
                    api_key = prompt("Api key?");
                    window.localStorage.setItem('api',api_key,Number.MAX_SAFE_INTEGER);
                    e.preventDefault();
                }
                if (e.altKey && e.keyCode == 72){
                    Chatvisible = !Chatvisible;
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
            }else{
                shiftKey = false;
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

let help = [
    '/room <room> - everytime someone enters, COUNS will be replaced with the number of people, while NAMY will be replaced with the last person that joined.',
    '/eval <cmd> - runs an javascript command',
    'alt g - activates chat gpt',
    'alt l - changes the game lang (english or portuguese)',
    'alt p - sets chat gpt API KEY (saved in localstorage)',
    'ctrl b - cycles through mode quickplay or instant play',
    'ctrl click - kills people under your mouse',
    'ctrl s - instantly starts the game',
    'ctrl d - opens map editor settings',
    'alt h - toggles chat',
    'alt t - toggles CAT gpt (gpt acts like a cat)',
    'tab - shows alive and dead people on the lobby',
    'z - freecam over the player under your mouse',
    'alt o - Shape Googles, shapes become transparent.',
    'alt u - Makes other players trasnparent',
    'alt i - Every player is transparent.',
];

function runCmd(msg){
    if (msg.startsWith('/help')){
        for (let tx of help){
            displayOnChat(tx);
        }
        chatInput1.value = '';
        chatInput2.value = '';
    }
    if (msg.startsWith('/room')){
        let evl = msg.substring(5,msg.length);
        if (evl.length > 2){
            roomName = evl;
        }else{
            roomName = '';
        }
        chatInput1.value = '';
        chatInput2.value = '';
    }
    if (msg.startsWith('/eval ')){
        let evl = msg.substring(5,msg.length) || 'console.log("Nothing?");';
        try{
            printOnChat = true;
            eval(evl);
        }catch(error){
            displayOnChat(error);
        }
        printOnChat = false;
        chatInput1.value = '';
        chatInput2.value = '';
    }
}

let chatId1 = setInterval(() => {
    if (!chatInput1 || !chatBox){
        chatInput1 = document.getElementById('newbonklobby_chat_input');
        chatBox = document.getElementById('newbonklobby_chat_content');
        if (chatBox && chatInput1){
            chatInput1.addEventListener("keydown",(e) => {
                if (e.keyCode == 13){
                    let msg = chatInput1.value;
                    if (msg.startsWith('/')){
                        runCmd(msg);
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
                        runCmd(msg);
                    }
                }
            })
        }
    }else{
        clearInterval(chatId2);
    }
},50)
