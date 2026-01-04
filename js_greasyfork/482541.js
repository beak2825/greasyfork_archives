// ==UserScript==
// @name         vnmod
// @namespace    none
// @version      1
// @description  aaaaaaaaa
// @author       aaaaaaaa
// @license MIT
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=912797
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482541/vnmod.user.js
// @updateURL https://update.greasyfork.org/scripts/482541/vnmod.meta.js
// ==/UserScript==
//SHAME AND PING

document.getElementById("enterGame").addEventListener('click', autohide);
function autohide(){
    $("#ot-sdk-btn-floating").hide();
}
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById('linksContainer2').innerHTML = ' vn pro ' ;
document.getElementById('gameName').innerHTML = 'vnmod';
document.getElementById('loadingText').innerHTML = 'vn loading'
document.getElementById('diedText').innerHTML = "vn died";
document.getElementById('diedText').style.color = "#ffffff";
document.title = ' vnmod';
document.getElementById("leaderboard").append ('vnmod');
$("#mapDisplay").css({background: `url('https://i.pinimg.com/originals/97/57/67/975767e67adc18ad53d5a1a687cb6421.gif')`});
document.getElementById("storeHolder").style = "height: 1150px; width: 400px;";
document.getElementById("promoImgHolder").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD
$('#itemInfoHolder').css({'top':'1050px',
                          'left':'15px'
                         });
$("#youtuberOf").remove();
$("#adCard").remove();
$("#mobileInstructions").remove();
$("#downloadButtonContainer").remove();
$("#mobileDownloadButtonContainer").remove();
$(".downloadBadge").remove();

(function(){if(document.querySelector("#customAudioPlayer"))return;
            var audioFiles=[{url:"https://cdn.discordapp.com/attachments/1062441866416619653/1069324203297362040/Barren_Gates_-_Obey_NCS_Release.mp3",title:"Obey NCS"},
                            {url:"https://cdn.discordapp.com/attachments/1062441866416619653/1069323837608570941/Clarx_-_Zig_Zag_NCS_Release.mp3",title:"Zig Zag NCS"},
                            {url:"https://cdn.discordapp.com/attachments/1062441866416619653/1069300879708135524/Anixto_-_Ride_Or_Die_NCS_Release.mp3",title:"Ride Or Die NCS"},
                            {url:"https://cdn.discordapp.com/attachments/1062441866416619653/1069324799903531128/MP3DL.CC_Rival_-_Throne_-_ft._Neoni_NCS_Release-256k.mp3",title:"Throne NCS"},
                            {url:"https://cdn.discordapp.com/attachments/905994516719345664/918544988965568562/Dirty_Palm_-_Ropes_feat._Chandler_Jewels_NCS10_Release.mp3",title:"Ropes NCS"},
                            {url:"https://cdn.discordapp.com/attachments/905994516719345664/918546211584213023/Jonth_Tom_Wilson_Facading_MAGNUS_Jagsy_Vosai_RudeLies__Domastic_-_Heartless_NCS10_Release.mp3",title:"Heartless NCS"},
                            {url:"https://cdn.discordapp.com/attachments/905873563490328626/920005714481672212/Anikdote_-_Turn_It_Up_NCS_Release.mp3",title:"Turn It Up NCS"},
                            {url:"https://cdn.discordapp.com/attachments/905873563490328626/920006439999778856/Unknown_Brain_-_MATAFAKA_feat._Marvin_Divine_NCS_Release.mp3",title:"MATAFKA NCS"},
                            {url:"https://cdn.discordapp.com/attachments/905994516719345664/918910823290769458/koven_never_have_i_felt_this_ncs_release_gqEQ_nIByoK-gucZcxBO.mp3",title:"Never Have I Felt This NCS"},
                            {url:"https://cdn.discordapp.com/attachments/905994516719345664/925144953611505714/Rebel_Scum__Dani_King__Centrix_-_Calm_Before_The_Storm_NCS_Release.mp3",title:"Calm Before The Storm NCS"}];
            var currentIndex=0;
            var audio=new Audio(audioFiles[currentIndex].url);
            audio.preload="auto";
            audio.volume=0.1;
            var repeat=false;
            var shuffled=false;
            function playNext()
            {if(shuffled){currentIndex=Math.floor(Math.random()*audioFiles.length);
                         }else if(!repeat)
                         {currentIndex=(currentIndex+1)%audioFiles.length;
                         }audio.src=audioFiles[currentIndex].url;audio.play();label.textContent=audioFiles[currentIndex].title;playButton.textContent='Pause';playButton.style.background='red';var trackButtons=document.querySelectorAll(".track-button");trackButtons.forEach(function(trackButton,index){if(index===currentIndex){trackButton.classList.add("active");}else{trackButton.classList.remove("active");}});}function formatDuration(duration){var minutes=Math.floor(duration/60);var seconds=Math.floor(duration%60);return minutes+':'+(seconds<10?'0':'')+seconds;}audio.addEventListener('ended',playNext);audio.addEventListener('timeupdate',function(){durationDisplay.textContent=formatDuration(audio.currentTime)+'/'+formatDuration(audio.duration);});var player=document.createElement('div');player.id="customAudioPlayer";player.style='position:fixed;top:10px;left:10px;z-index:10001;background:#282828;border:1px solid black;padding:20px;border-radius:10px;width:300px;color:#fff;box-shadow:0px 0px 20px 5px rgba(0,0,0,0.75);display:none;flex-direction:column;align-items:center;';
            var profilePicture=document.createElement('img');
            profilePicture.src='https://yt3.ggpht.com/jI1t37BCsCD_jMVBEqQPUghbRmz3KMny540V-r5iYAHaJeGolUYdUE8o1QCok7HMxEzZHZGS9Q=s600-c-k-c0x00ffffff-no-rj-rp-mo';
            profilePicture.style='width:60px;height:60px;border-radius:50%;cursor:pointer;';
            profilePicture.onclick=function(){window.location.href='https://www.youtube.com/channel/UCub84Dy0SSA0NgCqeUdjpsA';};
            player.appendChild(profilePicture);
            var label=document.createElement('div');
            label.textContent=audioFiles[currentIndex].title;
            label.style='margin-top:10px;text-align:center;';
            player.appendChild(label);
            var playButton=document.createElement('button');
            playButton.textContent='Play';playButton.style='margin-top:10px;width:100%;padding:10px;border:none;border-radius:5px;background-color:green;color:white;cursor:pointer;';playButton.onclick=function(){if(audio.paused){audio.play();this.textContent='Pause';this.style.background='red';}else{audio.pause();this.textContent='Play';this.style.background='green';}};player.appendChild(playButton);var nextButton=document.createElement('button');nextButton.textContent='Next';nextButton.style='margin-top:10px;width:100%;padding:10px;border:none;border-radius:5px;background-color:white;color:black;cursor:pointer;';nextButton.onclick=playNext;player.appendChild(nextButton);var shuffleRepeatContainer=document.createElement('div');shuffleRepeatContainer.style='display:flex;justify-content:space-between;width:100%;margin-top:10px;';player.appendChild(shuffleRepeatContainer);var shuffleButton=document.createElement('button');shuffleButton.textContent='Shuffle: Off';shuffleButton.style='padding:10px;border:none;border-radius:5px;background-color:black;color:white;cursor:pointer;width:48%;';shuffleButton.onclick=function(){shuffled=!shuffled;this.textContent=shuffled?'Shuffle: On':'Shuffle: Off';};shuffleRepeatContainer.appendChild(shuffleButton);var repeatButton=document.createElement('button');repeatButton.textContent='Repeat: Off';repeatButton.style='padding:10px;border:none;border-radius:5px;background-color:black;color:white;cursor:pointer;width:48%;';repeatButton.onclick=function(){repeat=!repeat;this.textContent=repeat?'Repeat: On':'Repeat: Off';};shuffleRepeatContainer.appendChild(repeatButton);var durationDisplay=document.createElement('div');durationDisplay.style='margin-top:10px;text-align:center;';player.appendChild(durationDisplay);var trackList=document.createElement('div');trackList.style='overflow:auto;max-height:150px;margin-top:20px;border:1px solid #fff;border-radius:10px;padding:5px;';audioFiles.forEach(function(track,index){var trackButton=document.createElement('button');trackButton.textContent=track.title;trackButton.classList.add("track-button");trackButton.style='padding:5px;border:none;border-radius:5px;background-color:black;color:white;cursor:pointer;width:100%;text-align:left;margin-top:5px;';trackButton.onclick=function(){currentIndex=index;audio.src=track.url;audio.play();label.textContent=track.title;playButton.textContent='Pause';playButton.style.background='red';trackButtons.forEach(function(trackButton,i){if(i===currentIndex){trackButton.classList.add("active");}else{trackButton.classList.remove("active");}});};trackList.appendChild(trackButton);});player.appendChild(trackList);var activeButtonStyle=document.createElement("style");activeButtonStyle.innerHTML='.track-button.active{background-color:green;}';document.head.appendChild(activeButtonStyle);var madeByLabel=document.createElement('div');madeByLabel.textContent='Made by Zod324myers';madeByLabel.style='margin-top:auto;text-align:center;';player.appendChild(madeByLabel);document.body.appendChild(player);document.addEventListener('keydown',function(e){if(e.key==='m'){player.style.display=player.style.display==='none'?'flex':'none';}});})();


let details = document.createElement("div");
details.id = "details";
document.body.prepend(details);
var ping = document.getElementById("pingDisplay");
ping.style.fontSize = "20px";
ping.style.display = "block";
ping.style.zIndex = "1";
document.body.appendChild(ping);
setInterval(function() {
    if (window.pingTime && ping) {
        ping.innerHTML = "Ping: " + window.pingTime //+ " | " + (myPlayer.hat == 45 ? "ShameTimer-[" + 30-1 + "s]" : "Shame[" + shame + "]");
    }
}, window.pingTime ? 0 : 1e3); //Credits to [GG]GAMER (skidded shaem counter)

let lastDamageTick = 0;
let HP = 100;
let gameTick = 0;
var shame = 0;
let shameTime,
    damageTimes = 0;
let friendlyMillLocs = [];
let nearestFriendlyMill;
let nearestFriendlyMillX;
let nearestFriendlyMillY;
let nearestFriendlyMillScale;
let isNextToFriendlyMill = false;

function removeArraysWithValue(arr, valueToRemove) {
    for (let i = arr.length - 1; i >= 0; i--) {
        const innerArray = arr[i];
        if (innerArray.includes(valueToRemove)) {
            arr.splice(i, 1);
        }
    }
}

let movementDirection

let millCount = 0;

let nearestRandomObjectX;
let nearestRandomObjectY;

let mouseX;
let mouseY;

let width;
let height;

setInterval(() => {
    if(hatToggle == 1) {
        if(oldHat != normalHat) {
            hat(normalHat);
            console.log("Tried. - Hat")
        }
        if(oldAcc != normalAcc) {
            acc(normalAcc);
            console.log("Tried. - Acc")
        }
        oldHat = normalHat;
        oldAcc = normalAcc
    }
}, 25);
setInterval(function() {
    if (myPlayer.hat == 45) {
        doNewSend(["6", ["toi vn khong giet lam on"]]);
    }
}, 100);
function normal() {
    hat(normalHat);
    acc(normalAcc);
}

function aim(x, y){
    var cvs = document.getElementById("gameCanvas");
    cvs.dispatchEvent(new MouseEvent("mousemove", {
        clientX: x,
        clientY: y

    }));
}

let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");

let trap_a = null;
let intrap = false;
let trapid = null;
var antitrap = false;
var isEnemyNear;
var primary;
var secondary;
var foodType;
var wallType;
var spikeType;
var millType;
var mineType;
var boostType;
var turretType;
var spawnpadType;
var autoaim = false;
var autoprimary = false;
var autosecondary = false;
var tick = 1;
var oldHat;
var oldAcc;
var enemiesNear;
var normalHat;
var normalAcc;
var ws;
var msgpack5 = msgpack;
var boostDir;
let myPlayer = {
    id: null,
    x: null,
    y: null,
    dir: null,
    object: null,
    weapon: null,
    clan: null,
    isLeader: null,
    hat: null,
    accessory: null,
    isSkull: null
};

let healSpeed = 100;
var messageToggle = 0;
var clanToggle = 0;
let healToggle = 1;
let hatToggle = 1;
var antiInsta = true;

document.msgpack = msgpack;
function n(){
    this.buffer = new Uint8Array([0]);
    this.buffer.__proto__ = new Uint8Array;
    this.type = 0;
}

WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    if (!ws){
        document.ws = this;

        ws = this;
        socketFound(this);
    }
    this.oldSend(m);
};

function biomeHat() {
    if (myPlayer.y < 2400) {
        hat(6);
    } else {
        if (myPlayer.y > 6850 && myPlayer.y < 7550) {
            hat(6);
        } else {
            hat(6);
        }
    }
    //acc(11);
}
function socketFound(socket){
    socket.addEventListener('message', function(message){
        handleMessage(message);
    });
}

function handleMessage(m){
    let temp = msgpack5.decode(new Uint8Array(m.data));
    let data;
    if(temp.length > 1) {
        data = [temp[0], ...temp[1]];
        if (data[1] instanceof Array){
            data = data;
        }
    } else {
        data = temp;
    }
    let item = data[0];
    if(!data) {return};
    update();
    if (item == "C" && myPlayer.id == null){
        myPlayer.id = data[1];
    }
    if (item == "a") {
        for(let i = 0; i < data[1].length / 13; i++) {
            let playerInfo = data[1].slice(13*i, 13*i+13);
            if(playerInfo[0] == myPlayer.id) {
                myPlayer.x = playerInfo[1];
                myPlayer.y = playerInfo[2];
                myPlayer.dir = playerInfo[3];
                myPlayer.object = playerInfo[4];
                myPlayer.weapon = playerInfo[5];
                myPlayer.clan = playerInfo[7];
                myPlayer.isLeader = playerInfo[8];
                myPlayer.hat = playerInfo[9];
                myPlayer.accessory = playerInfo[10];
                myPlayer.isSkull = playerInfo[11];
            } else if(playerInfo[7] != myPlayer.clan || playerInfo[7] === null) {
                enemiesNear.push(playerInfo);
            }
        }
    }
    update();
    if (item == "H") {
        for(let i = 0; i < data[1].length / 8; i++) {
            let info = data[1].slice(8*i, 8*i+8);
            if(info[6] == millType && info[7] == myPlayer.id){
                friendlyMillLocs.push(info)
            }

            if(info[7] == myPlayer.id){
                onWeapon = true;
            }
        }

    }
    update();
    if(item == "Q"){
        removeArraysWithValue(friendlyMillLocs, data[1])
    }
    update();
    if(item == "R"){
        removeArraysWithValue(friendlyMillLocs, data[1])
    }
    update();
    if(item == "S"){
        if(data[1] == 3){
            millCount = data[2];
        }
    }
    update();
    if(friendlyMillLocs){
        nearestFriendlyMill = friendlyMillLocs.sort((a,b) => dist(a, myPlayer) - dist(b, myPlayer))[0];

        if(nearestFriendlyMill){
            nearestFriendlyMillX = nearestFriendlyMill[1]
            nearestFriendlyMillY = nearestFriendlyMill[2]
            nearestFriendlyMillScale = nearestFriendlyMill[4]
        }
    }
    if(Math.sqrt(Math.pow((myPlayer.y-nearestFriendlyMillY), 2) + Math.pow((myPlayer.x-nearestFriendlyMillX), 2)) < nearestFriendlyMillScale + 100) {
        console.log(true)
        isNextToFriendlyMill = true;
        //isNextToFriendlyMill = false;
    } else {
        isNextToFriendlyMill = false;
    }
    WebSocket.prototype.send = function(m){
        let xcc = new Uint8Array(m);
        this.oldSend(m);
        let realData = {};
        let realInfo = msgpack5.decode(xcc);
        if (realInfo[1] instanceof Array){
            realData.data = [realInfo[0], ...realInfo[1]]
        }
        let rd0 = realData.data[0];
        let rd1 = realData.data[1];
        let rd2 = realData.data[2]

        if(rd0 == 'a'){
            movementDirection = rd1
        }
    };
    isEnemyNear = false;
    if (myPlayer.hat == 45 && shame) shameTime = 30000;
    if (myPlayer.hat == 45 && shame) shame = 30000;
    if (data[0] == "33") {
        gameTick++;
    }
    if(item == "O" && data[1] == myPlayer.id) {
        (gameTick = 0);
        (lastDamageTick = 0);
        (shame = 0);
        (HP = 100);
        (shameTime = 0);
        if (item == "h" && data[1] == myPlayer.id) {
            let damage = HP - data[2];
            HP = data[2];
            if (damage <= -1) {
                damageTimes++;
                if (!lastDamageTick) return;
                let healTime = gameTick - lastDamageTick;
                lastDamageTick = 0;
                if (healTime <= 1) {
                    shame = shame++;
                } else {
                    shame = Math.max(0, shame - 2);
                }
            } else {
                lastDamageTick = gameTick;
            }
        }
        if (data[2] < 100 && data[2] > 55) {//normal heal
            console.log("normal healing")
            setTimeout(() => {
                place(foodType);
                place(foodType);
                doNewSend(["c", [0, 11, 0]]);
                // doNewSend(["6", ["Heal"]]);
            }, 133);
        }
        if (data[2] < 33 && data[2] > 0 && myPlayer.hat !== 6) {//antiinsta no sold
            console.log("no soldier anti")
            doNewSend(["c", [0, 22, 0]]);
            //doNewSend(["6", ["Anti"]]);
            place(foodType);
            setTimeout(() => {
                place(foodType);
            }, 170);
            setTimeout(() => {
                doNewSend(["c", [0, 7, 0]]);
            }, 760);
            setTimeout( () => {
                doNewSend(["c", [0, 11, 0]]);
            }, 1900);
        }
        if (data[2] < 51 && data[2] > 40 && myPlayer.hat == 6) {//antiinsta for pol
            console.log("anti insta")
            doNewSend(["c", [0, 22, 0]]);
            //doNewSend(["6", ["Anti"]]);
            place(foodType);
            setTimeout(() => {
                place(foodType);
            }, 170);
            setTimeout(() => {
                doNewSend(["c", [0, 7, 0]]);
            }, 760);
            setTimeout( () => {
                doNewSend(["c", [0, 11, 0]]);
            }, 1900);
        }
        if (data[2] < 56 && data[2] > 50 && myPlayer.hat == 6) {//bullspam heal
            console.log("anti bullspam")
            setTimeout(() => {
                place(foodType);
                place(foodType);
                doNewSend(["c", [0, 11, 0]]);
                //doNewSend(["6", ["BHeal1"]]);
            }, 150);
        }
        if (data[2] < 41 && data[2] > 0 && myPlayer.hat == 11) {
            console.log("hitbacking")
            setTimeout(() => {
                place(foodType);
                place(foodType);
            }, 133);
            place(spikeType);
            doNewSend(["d",[1]]);
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["G", [primary, true]]);
            doNewSend(["d",[1]]);
            setTimeout(() => {
                place(spikeType, + toRad(45));
                doNewSend(["d",[1]]);
                place(spikeType, - toRad(45));
                doNewSend(["d",[1]]);
                doNewSend(["c", [0, 53, 0]]);
                doNewSend(["d",[0]]);
            },150);
            setTimeout(() => {
                doNewSend(["c", [0, 11, 0]]);
            },300);

        }
    }
    update();
};
function doNewSend(sender){
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}
function acc(id) {
    doNewSend(["c", [0, 0, 1]]);
    doNewSend(["c", [0, id, 1]]);
}

function hat(id) {
    doNewSend(["c", [0, id, 0]]);
}


function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["G", [id, null]]);
    doNewSend(["d", [1, angle]]);
    doNewSend(["d", [0, angle]]);
    doNewSend(["G", [primary, true]]);
}

var repeater = function(key, action, interval) {
    let _isKeyDown = false;
    let _intervalId = undefined;

    return {
        start(keycode) {
            if(keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = true;
                if(_intervalId === undefined) {
                    _intervalId = setInterval(() => {
                        action();
                        if(!_isKeyDown){
                            clearInterval(_intervalId);
                            _intervalId = undefined;
                        }
                    }, interval);
                }
            }
        },

        stop(keycode) {
            if(keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = false;
            }
        }
    };


}

let automilling = false;
let automill = false;
setInterval(()=>{
    if(automill == true && isNextToFriendlyMill == false && millCount < 300 && automilling == false){
        automilling = true;
        doNewSend(["G",[millType, null]])
        doNewSend(["d",[1, (movementDirection - 1.90)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        doNewSend(["G",[millType, null]])
        doNewSend(["d",[1, (movementDirection - 3.14)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        doNewSend(["G",[millType, null]])
        doNewSend(["d",[1, (movementDirection + 1.90)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        automilling = false
    }
}, 100);
let tankspam = false;
let tankspamming = false;
setInterval(()=>{
    if(tankspam == true && tankspamming == false){
        tankspamming = true;
        doNewSend(["c", [0, 40, 0]]);
        doNewSend(["G", [secondary, true]]);
        doNewSend(["d",[1]]);
        setTimeout(() => {
            doNewSend(["c", [0, 6, 0]]);
            tankspamming = false
            doNewSend(["d",[0]]);
        },200);
    }
},325);
const boostPlacer = repeater(70, () => {place(boostType)}, 50);
const spikePlacer = repeater(86, () => {place(spikeType)}, 50);
const placers = [boostPlacer, spikePlacer];
let prevCount = 0;
const handleMutations = mutationsList => {
    for (const mutation of mutationsList) {
        if (mutation.target.id === "killCounter") {
            const count = parseInt(mutation.target.innerText, 10) || 0;
            if (count > prevCount) {
                doNewSend(["6", ["vnmod pro autoGG"]]);
                prevCount = count;
            }
        }
    }
};
const observer = new MutationObserver(handleMutations);
observer.observe(document, {
    subtree: true,
    childList: true
});
document.addEventListener('keydown', (e) => {
    if (["allianceinput", 'chatbox', 'nameinput','storeHolder'].includes(document.activeElement.id.toLowerCase())) return null;
    placers.forEach(t => {
        t.start(e.keyCode);
    });

    if(e.keyCode == 78 && document.activeElement.id.toLowerCase() !== 'chatbox'){// N = Automill
        automill = !automill
    }

    if(e.keyCode == 72 && document.activeElement.id.toLowerCase() !== 'chatbox'){// H = Turret/Teleporter
        place(turretType, myPlayer.dir + toRad(45));
        place(turretType, myPlayer.dir - toRad(45));

    }
    if (e.keyCode == 16) {//booster hat
        biomeHat()
    }
    if(e.keyCode == 32 && document.activeElement.id.toLowerCase() !== 'chatbox'){// spiketick
        console.log("spiektick")
        place(spikeType);
        doNewSend(["d",[1]]);
        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["G", [primary, true]]);
        doNewSend(["d",[1]]);
        setTimeout(() => {
            doNewSend(["c", [0, 53, 0]]);
        },200);
        setTimeout(() => {
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d",[0]]);
        },150);
    }
    if(e.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox'){// insta
        console.log("katana insta")
        doNewSend(["d",[1]])
        doNewSend(["G", [secondary, true]]);
        doNewSend(["c", [0, 53, 0]]);
        setTimeout(() => {
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d",[1]]);
            doNewSend(["d",[0]]);
        },100);
        setTimeout(() => {
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d",[0]]);
        },900);
    }
})
document.addEventListener("mousedown", event => {
    if(event.button == 2 && document.activeElement.id.toLowerCase() !== 'chatbox'){// spiketick
        tankspam = !tankspam
    }
});
document.addEventListener('keyup', (e) => {
    placers.forEach(t => {
        t.stop(e.keyCode);
    });
    /*if (e.keyCode == 71) {
        setTimeout(() => {
            doNewSend(["33", [null]]);
            boostDir = null;
        }, 10);
    }*/
})
function isElementVisible(e) {
    return (e.offsetParent !== null);
}

function toRad(angle) {
    return angle * 0.01745329251;
}

function dist(e, o) {
    return e && o
        ? Math.sqrt((e.x - o.x) ** 2 + (e.y - o.y) ** 2)
    : null
};
function update() {
    for (let i=0;i<9;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            primary = i;
        }
    }

    for (let i=9;i<16;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            secondary = i;
        }
    }

    for (let i=16;i<19;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            foodType = i - 16;
        }
    }

    for (let i=19;i<22;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            wallType = i - 16;
        }
    }

    for (let i=22;i<26;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            spikeType = i - 16;
        }
    }

    for (let i=26;i<29;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            millType = i - 16;
        }
    }

    for (let i=29;i<31;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            mineType = i - 16;
        }
    }

    for (let i=31;i<33;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            boostType = i - 16;
        }
    }

    for (let i=33;i<36;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            turretType = i - 16;
        }
    }

    for (let i=36;i<37;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            spawnpadType = i - 16;
        }
    }

    for (let i=37;i<39;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            turretType = i - 16;
        }
    }
}