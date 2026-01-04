// ==UserScript==
// @name         AE86
// @namespace    none
// @version      9
// @description  Ae86 says vroom
// @author       Ae86
// @license      MIT
// @icon         https://upload.wikimedia.org/wikipedia/commons/2/25/Cube_Animation.gif
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://hackers.mohmoh.eu/*
// @require      https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499620/AE86.user.js
// @updateURL https://update.greasyfork.org/scripts/499620/AE86.meta.js
// ==/UserScript==
/* KEYBINDS
    n - auto triple mills
    v - spikes
    f - traps
    h - double teleporters/turrets
    m - music menu
    space - perfect spiketick
    rightclick - autobreaker
    r - normal insta
    t - reverse insta
    , - boost tick
    y - 1 tick
    b - bulltick
    */
    const PASSWORD = "vroom";
    let password = prompt("Enter Your Password!");
    while (password !== PASSWORD) {
        alert("you paid yet dont know the pass?");
        password = prompt("Enter Password");
    }
setInterval(() => window.follmoo && follmoo(), 10);

if(location.hostname == "sandbox.moomoo.io") {
    document.getElementById("foodDisplay").style.display = "none";
    document.getElementById("woodDisplay").style.display = "none";
    document.getElementById("stoneDisplay").style.display = "none";
}
let newImg2 = document.createElement("img");
    newImg2.src = "https://wc.wallpaperuse.com/wallp/15-155534_s.jpg";
    newImg2.style = `position: absolute; top: 1px; left: 5px; width: 200px; height: 200px; margin: 60px auto 0 auto; cursor: pointer;`;
    document.body.prepend(newImg2);

document.getElementById("enterGame").addEventListener("click", autohide);
function autohide() {
    $("#ot-sdk-btn-floating").hide();
}
document.getElementById("linksContainer2").innerHTML = " ";
let changes = `<div id="subConfirmationElement"><a href="https://www.youtube.com/channel/UC45zHuFS_APJWBHzGJFtvFQ">Youtube</a></div>`;
$('#linksContainer2').prepend(changes);
$('#subConfirmationElement').click( () => {
    try { window.follmoo(); } catch(e){};
    localStorage["moofoll"] = "1"; localStorage["moofol"] = "1";
});
document.querySelector("#joinPartyButton").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD
document.getElementById("gameName").innerHTML = "ae86"
let changes2 = `<div id="customMenuName"><h3 style="font-size: 50px;" class = "indent">vroom.</a></div>`;
$('#gameName').prepend(changes2);
$("#gameName").css({
    color: "#000000",
    "text-shadow": "0 1px 0 #181818, 0 2px 0 #181818, 0 3px 0 #181818, 0 4px 0 #181818, 0 5px 0 #181818, 0 6px 0 #181818, 0 7px 0 #181818, 0 8px 0 #181818, 0 9px 0 #181818, rgba(0, 0, 0, 0.4) 1px 1px 40px",
    "text-align": "center",
    "font-size": "156px",
    "margin-bottom": "-30px",
});
document.getElementById("loadingText").innerHTML = `<div id=paid for this" class="loader">`
//document.getElementById("loadingText").innerHTML = "vroom";
document.getElementById("diedText").innerHTML = "Vroom vrooom";
document.getElementById("diedText").style.color = "#ffffff";
document.title = "Ae86";
document.getElementById("leaderboard").append("Ae86");
$("#mapDisplay").css("background", "url('https://wormax.org/chrome3kafa/moomooio-background.png')");
document.getElementById("storeHolder").style = "height: 1150px; width: 400px;";
document.getElementById('promoImgHolder').innerHTML =
    `
  <style>
  p { font-size: 20px;}#noticationDisplay {
      vertical-align: top;
      position: absolute;
      right: 85%;
      top: 10%;
      text-align: right;
  } .menuButton { transition: 0.5s; border-radius: 0px;
  } .menuButton:hover { transform: scale(1.11); box-shadow: 0 0 20px #333;
  } #linksContainer2 { background: #ccc; border-top: 5px solid; border-image: linear-gradient(to right,#333,#333) 1 1 0 0; height: 18px; top: 0%; color: #333; transition: 0.3s;
  } #linksContainer2:hover { background: #ccc; box-shadow: 0 0 20px #333;
  } #top-wrap-right { color: #333;
  } .check-box {transform: scale(1.1);
  } .inParty {display: none;
  } input[type="checkbox"] { position: relative; appearance: none; width: 33px; height: 15.5px; border-radius: 50px; box-shadow: inset 0 0 5px rgba(41, 41, 41, 0.2); cursor: pointer; top: 7.5px; transition: 0.4s;
  } input:checked[type="checkbox"] { background: #333;
  } input[type="checkbox"]::after { position: absolute; content: ""; width: 15.5px; height: 15.5px; top: 0; left: 0; background: #fff; border-radius: 50%; box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); transform: scale(1.1); transition: 0.4s;
  } input:checked[type="checkbox"]::after { left: 50%;
  } .menuCard { background-color: #181818; border-top: 5px solid; border-image: linear-gradient(to right,#333,#303030) 1 0 0 0; color: #333; margin-top:0px; border-radius: 0px; border-bottom: 0px solid red; transition: all 1s; transform: scale(1); box-shadow: 0px 0px #333; transform: translateX(0px);
  } .menuCard:hover { transform: scale(1.05); box-shadow: 0 0 20px #333;
  } .menuCard.active { transform: translateX(0px);
  } #adCard { display: none;
  } #promoImgHolder { overflow-y: scroll; -ms-overflow-style: none; scrollbar-width: none; height: 90px; max-height: 90px; }
  </style>
      </head>
      <div>
  <i class="fa-solid fa-rectangle-list"style="font-size: 25px";></i><p>Update Next</p> <div style="font-size: 15px">
  - added Player Invisible<br>
  - added Revenge Insta<br>
  - Fix Bug AutoMild<br>
  - added Revenge Heal<br>
  waw<br>


  </div><div style="font-size: 15px">
  </div><br>
  `
$("#itemInfoHolder").css({ top: "0px", left: "15px" });
$("#youtuberOf").remove();
$("#adCard").remove();
$("#mobileInstructions").remove();
$("#downloadButtonContainer").remove();
$("#mobileDownloadButtonContainer").remove();
$(".downloadBadge").remove();

const shadowStyle = "box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.4)";

const setupCardDiv = document.getElementById("setupCard");
if (setupCardDiv) {
    setupCardDiv.style.cssText += shadowStyle;
}

const serverBrowserSelect = document.getElementById("serverBrowser");
if (serverBrowserSelect) {
    serverBrowserSelect.style.color = "#333";
    serverBrowserSelect.style.backgroundColor = "#e5e3e4";
}

const enterGameButton = document.getElementById("Start the car");
if (enterGameButton) {
    enterGameButton.style.backgroundColor = "#8F00FF";
}

const style = document.createElement("style");
style.innerHTML = `
            .menuLink {
                font-size: 20px;
                color: #333;
            }
            a {
                color: #333;
                text-decoration: none;
            }
        `;
document.head.appendChild(style);

const nameInputElement = document.getElementById("nameInput");
if (nameInputElement) {
    nameInputElement.style.color = "#333";
}

const guideCardDiv = document.getElementById("guideCard");
if (guideCardDiv) {
    guideCardDiv.style.cssText += shadowStyle;
    setupCardDiv.style.backgroundColor = "#181818";
    guideCardDiv.style.backgroundColor = "#181818";
}

(function () {
    if (document.querySelector("#customAudioPlayer")) return;
    var audioFiles = [
        {
            url: "https://cdn.discordapp.com/attachments/1062441866416619653/1069324203297362040/Barren_Gates_-_Obey_NCS_Release.mp3",
            title: "Obey NCS",
        },
        {
            url: "https://cdn.discordapp.com/attachments/1062441866416619653/1069323837608570941/Clarx_-_Zig_Zag_NCS_Release.mp3",
            title: "Zig Zag NCS",
        },
        {
            url: "https://cdn.discordapp.com/attachments/1062441866416619653/1069300879708135524/Anixto_-_Ride_Or_Die_NCS_Release.mp3",
            title: "Ride Or Die NCS",
        },
        {
            url: "https://cdn.discordapp.com/attachments/1062441866416619653/1069324799903531128/MP3DL.CC_Rival_-_Throne_-_ft._Neoni_NCS_Release-256k.mp3",
            title: "Throne NCS",
        },
        {
            url: "https://cdn.discordapp.com/attachments/905994516719345664/918544988965568562/Dirty_Palm_-_Ropes_feat._Chandler_Jewels_NCS10_Release.mp3",
            title: "Ropes NCS",
        },
        {
            url: "https://cdn.discordapp.com/attachments/905994516719345664/918546211584213023/Jonth_Tom_Wilson_Facading_MAGNUS_Jagsy_Vosai_RudeLies__Domastic_-_Heartless_NCS10_Release.mp3",
            title: "Heartless NCS",
        },
        {
            url: "https://cdn.discordapp.com/attachments/905873563490328626/920005714481672212/Anikdote_-_Turn_It_Up_NCS_Release.mp3",
            title: "Turn It Up NCS",
        },
        {
            url: "https://cdn.discordapp.com/attachments/905873563490328626/920006439999778856/Unknown_Brain_-_MATAFAKA_feat._Marvin_Divine_NCS_Release.mp3",
            title: "MATAFKA NCS",
        },
        {
            url: "https://cdn.discordapp.com/attachments/905994516719345664/918910823290769458/koven_never_have_i_felt_this_ncs_release_gqEQ_nIByoK-gucZcxBO.mp3",
            title: "Never Have I Felt This NCS",
        },
        {
            url: "https://cdn.discordapp.com/attachments/905994516719345664/925144953611505714/Rebel_Scum__Dani_King__Centrix_-_Calm_Before_The_Storm_NCS_Release.mp3",
            title: "Calm Before The Storm NCS",
        },
    ];
    var currentIndex = 0;
    var audio = new Audio(audioFiles[currentIndex].url);
    audio.preload = "auto";
    audio.volume = 0.1;
    var repeat = false;
    var shuffled = false;
    function playNext() {
        if (shuffled) {
            currentIndex = Math.floor(Math.random() * audioFiles.length);
        } else if (!repeat) {
            currentIndex = (currentIndex + 1) % audioFiles.length;
        }
        audio.src = audioFiles[currentIndex].url;
        audio.play();
        label.textContent = audioFiles[currentIndex].title;
        playButton.textContent = "Pause";
        playButton.style.background = "red";
        var trackButtons = document.querySelectorAll(".track-button");
        trackButtons.forEach(function (trackButton, index) {
            if (index === currentIndex) {
                trackButton.classList.add("active");
            } else {
                trackButton.classList.remove("active");
            }
        });
    }
    function formatDuration(duration) {
        var minutes = Math.floor(duration / 60);
        var seconds = Math.floor(duration % 60);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }
    audio.addEventListener("ended", playNext);
    audio.addEventListener("timeupdate", function () {
        durationDisplay.textContent =
            formatDuration(audio.currentTime) + "/" + formatDuration(audio.duration);
    });
    var player = document.createElement("div");
    player.id = "customAudioPlayer";
    player.style =
        "position:fixed;top:10px;left:10px;z-index:10001;background:#282828;border:1px solid black;padding:20px;border-radius:10px;width:300px;color:#fff;box-shadow:0px 0px 20px 5px rgba(0,0,0,0.75);display:none;flex-direction:column;align-items:center;";
    var profilePicture = document.createElement("img");
    profilePicture.src =
        "https://yt3.ggpht.com/jI1t37BCsCD_jMVBEqQPUghbRmz3KMny540V-r5iYAHaJeGolUYdUE8o1QCok7HMxEzZHZGS9Q=s600-c-k-c0x00ffffff-no-rj-rp-mo";
    profilePicture.style =
        "width:60px;height:60px;border-radius:50%;cursor:pointer;";
    profilePicture.onclick = function () {
        window.location.href =
            "https://www.youtube.com/channel/UCub84Dy0SSA0NgCqeUdjpsA";
    };
    player.appendChild(profilePicture);
    var label = document.createElement("div");
    label.textContent = audioFiles[currentIndex].title;
    label.style = "margin-top:10px;text-align:center;";
    player.appendChild(label);
    var playButton = document.createElement("button");
    playButton.textContent = "Play";
    playButton.style =
        "margin-top:10px;width:100%;padding:10px;border:none;border-radius:5px;background-color:green;color:white;cursor:pointer;";
    playButton.onclick = function () {
        if (audio.paused) {
            audio.play();
            this.textContent = "Pause";
            this.style.background = "red";
        } else {
            audio.pause();
            this.textContent = "Play";
            this.style.background = "green";
        }
    };
    player.appendChild(playButton);
    var nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.style =
        "margin-top:10px;width:100%;padding:10px;border:none;border-radius:5px;background-color:white;color:black;cursor:pointer;";
    nextButton.onclick = playNext;
    player.appendChild(nextButton);
    var shuffleRepeatContainer = document.createElement("div");
    shuffleRepeatContainer.style =
        "display:flex;justify-content:space-between;width:100%;margin-top:10px;";
    player.appendChild(shuffleRepeatContainer);
    var shuffleButton = document.createElement("button");
    shuffleButton.textContent = "Shuffle: Off";
    shuffleButton.style =
        "padding:10px;border:none;border-radius:5px;background-color:black;color:white;cursor:pointer;width:48%;";
    shuffleButton.onclick = function () {
        shuffled = !shuffled;
        this.textContent = shuffled ? "Shuffle: On" : "Shuffle: Off";
    };
    shuffleRepeatContainer.appendChild(shuffleButton);
    var repeatButton = document.createElement("button");
    repeatButton.textContent = "Repeat: Off";
    repeatButton.style =
        "padding:10px;border:none;border-radius:5px;background-color:black;color:white;cursor:pointer;width:48%;";
    repeatButton.onclick = function () {
        repeat = !repeat;
        this.textContent = repeat ? "Repeat: On" : "Repeat: Off";
    };
    shuffleRepeatContainer.appendChild(repeatButton);
    var durationDisplay = document.createElement("div");
    durationDisplay.style = "margin-top:10px;text-align:center;";
    player.appendChild(durationDisplay);
    var trackList = document.createElement("div");
    trackList.style =
        "overflow:auto;max-height:150px;margin-top:20px;border:1px solid #fff;border-radius:10px;padding:5px;";
    audioFiles.forEach(function (track, index) {
        var trackButton = document.createElement("button");
        trackButton.textContent = track.title;
        trackButton.classList.add("track-button");
        trackButton.style =
            "padding:5px;border:none;border-radius:5px;background-color:black;color:white;cursor:pointer;width:100%;text-align:left;margin-top:5px;";
        trackButton.onclick = function () {
            currentIndex = index;
            audio.src = track.url;
            audio.play();
            label.textContent = track.title;
            playButton.textContent = "Pause";
            playButton.style.background = "red";
            trackButtons.forEach(function (trackButton, i) {
                if (i === currentIndex) {
                    trackButton.classList.add("active");
                } else {
                    trackButton.classList.remove("active");
                }
            });
        };
        trackList.appendChild(trackButton);
    });
    player.appendChild(trackList);
    var activeButtonStyle = document.createElement("style");
    activeButtonStyle.innerHTML = ".track-button.active{background-color:green;}";
    document.head.appendChild(activeButtonStyle);
    var madeByLabel = document.createElement("div");
    madeByLabel.textContent = "Made by Ae86 and nunu";
    madeByLabel.style = "margin-top:auto;text-align:center;";
    player.appendChild(madeByLabel);
    document.body.appendChild(player);
    document.addEventListener("keydown", function (e) {
        if (e.key === "m" && document.activeElement.id.toLowerCase() !== "chatbox") {
            player.style.display = player.style.display === "none" ? "flex" : "none";
        }
    });
})();

let lastPing = -1;
let cvs = document.getElementById("gameCanvas"),
    ctx = cvs.getContext("2d");
let Ie = document.getElementById("pingDisplay");
Ie.replaceWith(document.createElement("div"));
Ie.style.fontSize = "20px";
Ie.style.fontFamily = "Calibri";
Ie.style.display = "block";
Ie.style.zIndex = "1";
document.body.appendChild(Ie);
setInterval(() => {
    Ie.style.display = "block";
    Ie.innerText = `${window.pingTime} ping | ${fps} fps`;
}, 0);
const times = [];
let fps;

function refreshLoop() {
    window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        fps = times.length;
        refreshLoop();
    });
}

refreshLoop();
Ie.style.fontSize = "20px";
Ie.style.display = "block";
Ie.style.color = "#fff";
Ie.style.textShadow = "3px 3px 3px black";
Ie.style.zIndex = "1";
let anti = true;
let hitBack = false;
let stackInsta = true;
let lastDamageTick = 0;
let HP = 100;
let gameTick = 0;
var shame = 0;
let shameTime,
    damageTimes = 0;
let mouseX;
let mouseY;

let width;
let height;
//autoaim1
setInterval(() => {
    if (autoaim == true) {
        doNewSend(["D", [nearestEnemyAngle]]);
    }
}, 10);

setInterval(() => {
    if (hatToggle == 1) {
        if (oldHat != normalHat) {
            hat(normalHat);
            console.log("Tried. - Hat")
        }
        if (oldAcc != normalAcc) {
            acc(normalAcc);
            console.log("Tried. - Acc")
        }
        oldHat = normalHat;
        oldAcc = normalAcc
    }
}, 25);

setInterval(function () {
    if (myPlayer.hat == 45) {
        doNewSend(["6", ["bruh wtf"]]);
    }
}, 1980);// messages send ever 2000ms but this is incase of packet mashes

function normal() {
    hat(normalHat);
    acc(normalAcc);
}

function aim(x, y) {
    var cvs = document.getElementById("gameCanvas");
    cvs.dispatchEvent(new MouseEvent("mousemove", {
        clientX: x,
        clientY: y

    }));
}

let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");

var packet
var nearestEnemy;
var nearestEnemyAngle;
var oppositeEnemyAngle;
var enemyRan;
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
    isSkull: null,
};

let healSpeed = 1.0;
var messageToggle = 0;
var clanToggle = 0;
let healToggle = 1;
let hatToggle = 1;
document.msgpack = msgpack;

function n() {
    this.buffer = new Uint8Array([0]);
    this.buffer.__proto__ = new Uint8Array;
    this.type = 0;
}

WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m) {
    if (!ws) {
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

function socketFound(socket) {
    socket.addEventListener('message', function(message) {
        handleMessage(message);
    });
}

function handleMessage(m) {
    let temp = msgpack5.decode(new Uint8Array(m.data));
    let data;
    if (temp.length > 1) {
        data = [temp[0], ...temp[1]];
        if (data[1] instanceof Array) {
            data = data;
        }
    } else {
        data = temp;
    }
    let item = data[0];
    if (!data) {
        return
    };


    if (item === "io-init") {
        let cvs = document.getElementById("gameCanvas");
        width = cvs.clientWidth;
        height = cvs.clientHeight;
        $(window).resize(function() {
            width = cvs.clientWidth;
            height = cvs.clientHeight;
        });
        cvs.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    }

    if (item == "C" && myPlayer.id == null) {
        myPlayer.id = data[1];
    }

    if (item == "a") {
        enemiesNear = [];
        for (let i = 0; i < data[1].length / 13; i++) {
            let playerInfo = data[1].slice(13 * i, 13 * i + 13);
            if (playerInfo[0] == myPlayer.id) {
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
            } else if (playerInfo[7] != myPlayer.clan || playerInfo[7] === null) {
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
    /*if(item == "P"){
      setTimeout(() => {
          doNewSend(["M", [{name: "vn-" + "",moofoll: 1,skin: "#cc5151"}]]);
      }, 200);
      }*/

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
    if (enemiesNear) {
        nearestEnemy = enemiesNear.sort((a, b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
    }

    if (nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2] - myPlayer.y, nearestEnemy[1] - myPlayer.x);
        oppositeEnemyAngle = Math.atan2(nearestEnemy[2] + myPlayer.y, nearestEnemy[1] + myPlayer.x);
        enemyRan = Math.sqrt(Math.pow((myPlayer.y - nearestEnemy[2]), 2) + Math.pow((myPlayer.x - nearestEnemy[1]), 2));
        if (Math.sqrt(Math.pow((myPlayer.y - nearestEnemy[2]), 2) + Math.pow((myPlayer.x - nearestEnemy[1]), 2)) < 285) {
            isEnemyNear = true;
            if (autoaim == false && myPlayer.hat != 7 && myPlayer.hat != 53) {
                normalHat = 6;
                if (primary != 8) {
                    normalAcc = 21
                }
            };
        }
    }
    if (isEnemyNear == false && autoaim == false) {
        if (myPlayer.y < 2400) {
            normalHat = 15;
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550) {
            normalHat = 31;
        } else {
            normalHat = 12;

        }
    }
    if(isEnemyNear == true && nearestEnemy[5] == 4 && nearestEnemy[9] == 7 && hitBack == true && myPlayer.hat != 7 && myPlayer.hat != 53 && myPlayer.hat != 22 && myPlayer.hat != 11){
        doNewSend(["c", [0, 11, 0]]);
        setTimeout(()=>{
            doNewSend(["c", [0, 21, 1]]);
        },60);
    }
    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }

    if (item == "X") {
        //this is Sync detector(beta)
        if (data[5] == 3.6) {
            let dir_1 = (dir) => Math.atan2(Math.sin(dir), Math.cos(dir));
            let a1 = dir_1(
                (Math.atan2(data[2] - myPlayer.y, data[1] - myPlayer.x) +
                 Math.PI +
                 Math.PI) %
                (Math.PI * 2)
            );
            let a2 = dir_1((dir_1(data[3]) + Math.PI) % (Math.PI * 2));
            let a3 = a1 - a2;
            if (0.36 > a3 && -0.36 < a3) {
                //doNewSend(["6", ["Sync Detect Test"]]);
                doNewSend(["D",[Math.atan2(data[2] - myPlayer.y, data[1] - myPlayer.x)],]);
                if (data[2] < 80 && data[2] > 0) {
                    doNewSend(["c", [0, 6, 0]]);
                    place(foodType);
                    place(foodType);
                }
            }
        }
    }
    if (myPlayer.hat == 45 && shame) shameTime = 30000;
    if (myPlayer.hat == 45 && shame) shame = 30000;
    if (data[0] == "a") {
        gameTick++;
    }
    if (item == "O" && data[1] == myPlayer.id) {
        gameTick = 0;
        lastDamageTick = 0;
        shame = 0;
        HP = 100;
        shameTime = 0;
        if (item == "O" && data[1] == myPlayer.id) {
            let damage = HP - data[2];
            HP = data[2];
            if (damage <= -1) {
                damageTimes++;
                if (!lastDamageTick) return;
                let healTime = gameTick - lastDamageTick;
                lastDamageTick = 0;
                if (healTime <= 0) {
                    shame = shame++;
                } else {
                    shame = Math.max(0, shame - 2);
                }
            } else {
                lastDamageTick = gameTick;
            }
        }
        if (data[2] < 100 && data[2] > 00 && healToggle == true) {
            //normal heal
            console.log("normal healing");
            setTimeout(() => {
                place(foodType);
                place(foodType);
                doNewSend(["c", [0, 6, 0]]);
                // doNewSend(["6", ["Heal"]]);
            }, 115);
        }
        if (data[2] < 48 && data[2] > 0 && anti == true && (nearestEnemy[5] == 5 || nearestEnemy[5] == 3)) {
            healToggle = false;
            //antiinsta no sold for pol
            console.log("no soldier anti - polearm");
            doNewSend(["c", [0, 22, 0]]);
            //doNewSend(["6", ["Anti"]]);
            place(foodType);
            setTimeout(() => {
                place(foodType);
                doNewSend(["c", [0, 6, 0]]);
                healToggle = true;
            }, 200);
            setTimeout(() => {
                doNewSend(["c", [0, 7, 0]]);
            }, 700);
            setTimeout(() => {
                doNewSend(["c", [0, 6, 0]]);
            }, 1900);
        }
        if (data[2] < 62 && data[2] > 41 && anti == true && (nearestEnemy[5] == 5 || nearestEnemy[5] == 3)) {
            healToggle = false;
            //antiinsta for pol
            console.log("anti insta - polearm");
            doNewSend(["c", [0, 22, 0]]);
            //doNewSend(["6", ["Anti"]]);
            place(foodType);
            setTimeout(() => {
                place(foodType);
                doNewSend(["c", [0, 6, 0]]);
                healToggle = true;
            }, 200);
            setTimeout(() => {
                doNewSend(["c", [0, 7, 0]]);
            }, 700);
            setTimeout(() => {
                doNewSend(["c", [0, 6, 0]]);
            }, 1900);
        }
        if (data[2] < 56 && data[2] > 50) {
            healToggle = false;
            //bullspam heal
            console.log("anti bullspam");
            setTimeout(() => {
                place(foodType);
                place(foodType);
                doNewSend(["c", [0, 6, 0]]);
                //doNewSend(["6", ["BHeal1"]]);
                healToggle = true;
            }, 140);
        }
        if (data[2] < 41 && data[2] > 0 && hitBack == true && nearestEnemy[5] == 4) {
            console.log("hitbacking");
            healToggle = false;
            autoaim = true;
            setTimeout(() => {
                place(foodType);
                place(foodType);
            }, 133);
            place(spikeType, nearestEnemyAngle);
            doNewSend(["d", [1]]);
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["G", [primary, true]]);
            setTimeout(() => {
                doNewSend(["c", [0, 53, 0]]);
                doNewSend(["d", [0]]);
                healToggle = true;
            }, 150);
            setTimeout(() => {
                doNewSend(["c", [0, 11, 0]]);
                autoaim = false;
            }, 300);
        }
    }
    update();
}

function doNewSend(sender) {
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}

function acc(id) {
    doNewSend(["c", [0, 0, 1]]);
    doNewSend(["c", [0, id, 1]]);
}

function hat(id) {
    doNewSend(["c", [0, id, 0]]);
}

function placeO(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["G", [myPlayer.weapon, true]]);
    doNewSend(["G", [id, null]]);
    doNewSend(["d", [1, angle]]);
    doNewSend(["d", [0, angle]]);
    doNewSend(["G", [myPlayer.weapon, true]]);
}

function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["G", [id, null]]);
    doNewSend(["d", [1, angle]]);
    doNewSend(["d", [0, angle]]);
    doNewSend(["G", [myPlayer.weapon, true]]);
}

var repeater = function(key, action, interval, bu) {
    let _isKeyDown = false;
    let _intervalId = undefined;

    return {
        start(keycode) {
            if (keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = true;
                if (_intervalId === undefined) {
                    _intervalId = setInterval(() => {
                        action();
                        if (!_isKeyDown) {
                            clearInterval(_intervalId);
                            _intervalId = undefined;
                            console.log("claered");
                        }
                    }, interval);
                }
            }
        },

        stop(keycode) {
            if (keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = false;
            }
        }
    };


}

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
let friendlyMillLocs = [];
let nearestFriendlyMill;
let nearestFriendlyMillX;
let nearestFriendlyMillY;
let nearestFriendlyMillScale;
let isNextToFriendlyMill = false;
let automilling = false
let automill = false
setInterval(()=>{
    if(automill == true && isNextToFriendlyMill == false && millCount < 298 && automilling == false){
        automilling = true;
        doNewSend(["G",[millType, null]])
        doNewSend(["d",[1, (movementDirection - 1.90)]])
        doNewSend(["d",[0, (movementDirection - 1.90)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        doNewSend(["G",[millType, null]])
        doNewSend(["d",[1, (movementDirection - 3.14)]])
        doNewSend(["d",[0, (movementDirection - 3.14)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        doNewSend(["G",[millType, null]])
        doNewSend(["d",[1, (movementDirection + 1.90)]])
        doNewSend(["d",[0, (movementDirection + 1.90)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        automilling = false
    }
}, 100)
const boostPlacer = repeater(70,() => {place(boostType);},50);
const spikePlacer = repeater(86,() => {place(spikeType);},50);
const placers = [boostPlacer, spikePlacer];
let prevCount = 0;
const handleMutations = (mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.target.id === "killCounter") {
            const count = parseInt(mutation.target.innerText, 10) || 0;
            if (count > prevCount) {
                doNewSend(["6", ["NOOB!"]]);
                setTimeout(()=>{
                    doNewSend(["6", ["GG|FSH private mod|By base "]]);
                },650);
                prevCount = count;
            }
        }
    }
}
const observer = new MutationObserver(handleMutations);
observer.observe(document, {
    subtree: true,
    childList: true,
});

document.addEventListener('keydown', (e) => {
    if (["allianceinput", "chatbox", "nameinput", "storeHolder"].includes(document.activeElement.id.toLowerCase()))
        return null;
    placers.forEach((t) => {
        t.start(e.keyCode);
    });

    if (e.keyCode == 78 && document.activeElement.id.toLowerCase() !== "chatbox") {// N = Automill
        automill = !automill;
    }

    if (e.keyCode == 72 && document.activeElement.id.toLowerCase() !== "chatbox") {// H = Turret/Teleporter
        for (let i = 0; i < Math.PI * 1; i+= Math.PI / 2) {
            place(turretType, myPlayer.dir + i);
            place(turretType, myPlayer.dir - i);
        }
    }
    /* if (e.keyCode == 16) {
    biomeHat();
  }*/
    if (e.keyCode == 32 && document.activeElement.id.toLowerCase() !== "chatbox") {
        // spiketick
        autoaim = true;
        console.log("spiektick");
        place(spikeType, nearestEnemyAngle);
        doNewSend(["d", [1]]);
        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["G", [primary, true]]);
        doNewSend(["d", [1]]);
        setTimeout(() => {
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d", [0]]);
            autoaim = false;
        }, 400);
    }
    if (e.keyCode == 89 && document.activeElement.id.toLowerCase() !== "chatbox") {//diamond pol 1 tick
        autoaim = true;
        doNewSend(["G", [primary, true]]);
        doNewSend(["c", [0, 53, 0]]);
        setTimeout(() => {
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d", [1]]);
        }, 100);
        setTimeout(() => {
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d", [0]]);
            autoaim = false;
        }, 500);
    }
    if (e.keyCode == 82 &&document.activeElement.id.toLowerCase() !== "chatbox") {
        if (stackInsta == false) {
            console.log("normal insta");
            autoaim = true;
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 0, 1]])
            doNewSend(["d", [1]]);
            acc(18)
            doNewSend(["c", [1]]);
            setTimeout(() => {
                doNewSend(["G", [secondary, true]]);
                doNewSend(["c", [0, 53, 0]]);
                doNewSend(["c", [0, 0, 1]]);
                acc(21)
            }, 105);
            setTimeout(() => {
                doNewSend(["G", [secondary, true]]);
            }, 110);
            setTimeout(() => {
                doNewSend(["G", [secondary, true]]);
            }, 115);
            setTimeout(() => {
                doNewSend(["G", [primary, true]]);
                doNewSend(["d", [0, null]]);
                doNewSend(["c", [0, 6, 0]]);
                doNewSend(["c", [0, 0, 0]]);
                doNewSend(["c", [0, 0, 1]]);
                hat(6)
                acc(21)
                autoaim = false;
            }, 215);
        } else {
            console.log("stack insta");
            autoaim = true;
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 0, 1]])
            doNewSend(["d", [1]]);
            acc(18)
            doNewSend(["c", [1]]);
            setTimeout( () => {
                var sck = "";
                doNewSend(["G", [secondary, true]]);
                doNewSend(["c", [0, 53, 0]]);
                doNewSend(["c", [0, 0, 1]]);
                for(let i = 0; i < 850; i++){
                    let caas = new Uint8Array(550);
                    for(let i = 0; i <caas.length;i++){
                        caas[i] = Math.floor(Math.random()*270);
                        sck += caas[i]
                    }
                }
                ws.send(caas);
            }, 105);
            setTimeout(() => {
                doNewSend(["G", [secondary, true]]);
            }, 200);
            setTimeout(() => {
                doNewSend(["G", [primary, true]]);
                doNewSend(["d", [0, null]]);
                doNewSend(["c", [0, 6, 0]]);
                doNewSend(["c", [0, 0, 0]]);
                doNewSend(["c", [0, 0, 1]]);
                hat(6)
                acc(21)
                autoaim = false;
            }, 215);
        }
    }
    if (e.keyCode == 188 &&document.activeElement.id.toLowerCase() !== "chatbox") {
        console.log("boost tick");
        autoaim = true;
        setTimeout(()=>{
            doNewSend(["d", [1]]);
            doNewSend(["G", [secondary, true]]);
        },99);
        setTimeout(()=>{
            doNewSend(["c", [0, 53, 0]]);
            place(boostType);
        },50);
        setTimeout(() => {
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d", [1]]);
            doNewSend(["d", [0]]);
        }, 175);
        setTimeout(() => {
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d", [0]]);
            autoaim = false;
        }, 500);
    }
    if (e.keyCode == 84 && document.activeElement.id.toLowerCase() !== "chatbox") {
        if(stackInsta == false){
            // insta
            autoaim = true;
            console.log("reverse insta");
            doNewSend(["d", [1]]);
            doNewSend(["G", [secondary, true]]);
            doNewSend(["c", [0, 53, 0]]);
            setTimeout(() => {
                doNewSend(["G", [primary, true]]);
                doNewSend(["c", [0, 7, 0]]);
                doNewSend(["d", [1]]);
                doNewSend(["d", [0]]);
            }, 80);
            setTimeout(() => {
                doNewSend(["G", [primary, true]]);
                doNewSend(["c", [0, 6, 0]]);
                doNewSend(["d", [0]]);
                autoaim = false;
            }, 500);
        } else {
            autoaim = true;
            console.log("stacked reverse insta");
            doNewSend(["d", [1]]);
            doNewSend(["G", [secondary, true]]);
            doNewSend(["c", [0, 53, 0]]);
            setTimeout(() => {
                var sck = "";
                doNewSend(["G", [primary, true]]);
                doNewSend(["c", [0, 7, 0]]);
                doNewSend(["d", [1]]);
                doNewSend(["d", [0]]);
                for(let i = 0; i < 850; i++){
                    let caas = new Uint8Array(550);
                    for(let i = 0; i <caas.length;i++){
                        caas[i] = Math.floor(Math.random()*270);
                        sck += caas[i]
                    }
                }
                ws.send(caas);
            }, 80);
            setTimeout(() => {
                doNewSend(["G", [primary, true]]);
                doNewSend(["c", [0, 6, 0]]);
                doNewSend(["d", [0]]);
                autoaim = false;
            }, 500);
        }
    }
    if (e.keyCode == 66 &&document.activeElement.id.toLowerCase() !== "chatbox") {//manual bulltick
        doNewSend(["c", [0, 7, 0]]);
        setTimeout(()=>{
            doNewSend(["c", [0, 13, 1]]);
        },60);
    }
})

document.addEventListener('keyup', (e) => {
    if (["allianceinput", "chatbox", "nameinput", "storeHolder"].includes(document.activeElement.id.toLowerCase()))
        return null;
    placers.forEach((t) => {
        t.stop(e.keyCode);
    })
})

document.addEventListener("mousedown", (event) => {
    if (event.button == 2 && secondary != 10) {
        doNewSend(["d", [1]]);
        doNewSend(["c", [0, 40, 0]]);
        doNewSend(["G", [primary, true]]);
        setTimeout(()=>{
            doNewSend(["d", [0]]);
            doNewSend(["c", [0, 6, 0]]);
        },100);
    } else if (event.button == 2) {
        doNewSend(["d", [1]]);
        doNewSend(["c", [0, 40, 0]]);
        doNewSend(["G", [secondary, true]]);
        setTimeout(()=>{
            doNewSend(["d", [0]]);
            doNewSend(["c", [0, 6, 0]]);
        },100);
    }
});

/*document.addEventListener("mousedown", (event) => {
    if (event.button == 0) {
        doNewSend(["d", [1]]);
        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["G", [primary, true]]);
        setTimeout(()=>{
            doNewSend(["d", [0]]);
            doNewSend(["c", [0, 6, 0]]);
        },100);
    }
});*/

function isElementVisible(e) {
    return (e.offsetParent !== null);
}

function toRad(angle) {
    return angle * 0.01745329251;
}

function dist(a, b) {
    return Math.sqrt(Math.pow((b.y - a[2]), 2) + Math.pow((b.x - a[1]), 2));
}

function update() {
    for (let i = 0; i < 9; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            primary = i;
        }
    }

    for (let i = 9; i < 16; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            secondary = i;
        }
    }

    for (let i = 16; i < 19; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            foodType = i - 16;
        }
    }

    for (let i = 19; i < 22; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            wallType = i - 16;
        }
    }

    for (let i = 22; i < 26; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            spikeType = i - 16;
        }
    }

    for (let i = 26; i < 29; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            millType = i - 16;
        }
    }

    for (let i = 29; i < 31; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            mineType = i - 16;
        }
    }

    for (let i = 31; i < 33; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            boostType = i - 16;
        }
    }

    for (let i = 33; i < 39; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString())) && i != 36) {
            turretType = i - 16;
        }
    }

    spawnpadType = 36;
}

var styleItem = document.createElement("style");
styleItem.type = "text/css";
styleItem.appendChild(document.createTextNode(`
  .loader {
  position: absolute;
  top:110%;
  left:46%;
    border: 16px solid #333;
    border-radius: 50%;
    border-top: 16px solid #181818;
    box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.4);
    width: 60px;
    height: 60px;
    -webkit-animation: spin 0.5s linear infinite; /* Safari */
    animation: spin 0.5s linear infinite;
  }
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  #gameUI .joinAlBtn, a {
    animation: 5s infinite linear both normal rainbow;
  }

  @keyframes rainbow {
    0% { filter: hue-rotate(0deg) }
    100% { filter: hue-rotate(360deg) }
  }`));
document.head.appendChild(styleItem);

window.addEventListener("load", () => {

    let toggleRender = true;
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");
    let screenWidth = 1920;
    let screenHeight = 1080;
    let screenW = screenWidth / 2;
    let screenH = screenHeight / 2;

    function render() {

        if (toggleRender) {

            ctx.beginPath();

            let gradient = ctx.createRadialGradient(screenW, screenH, 0, screenW, screenH, screenWidth);
            for (let i = 0; i <= 1; i++) {
                gradient.addColorStop(i, "rgba(0, 0, 0, " + i + ")");
            }

            ctx.fillStyle = gradient;
            ctx.rect(0, 0, screenWidth, screenHeight);
            ctx.fill();

        }

        window.requestAnimFrame(render);

    }

    render();
});

document.addEventListener("keydown", function (e) {
    if (e.keyCode == 27) {
        $('#infomenu').toggle();
        ext = !ext;
    };
});

// Menu
$("body").after(`
  <div id="infomenu">
  <hr>
  <div class="nameblock">๖ۣۜℱ₴Ⱨ 𝕞𝕠𝕕</div>
  <hr>
  <ul>
  <li></label><label><div class="text">AntiInsta<input type="checkbox" id="anti" checked><span class="checkmark"></div></li>
  <li></label><label><div class="text">HitBack<input type="checkbox" id="hitBack"><span class="checkmark"></div></li>
  <li></label><label><div class="text">Stacked Insta<input type="checkbox" id="stackInsta"><span class="checkmark"></div></li>
  </ul>
  <hr>
  <div class="nameblock">HotKey:</div>
  <hr>

  <div class="text">
  </li>
  <li> N - Auto Triple Mill
  </li>
  <li> V - Spike
  </li>
  <li> F - Trap
  </li>
  <li> H - Double Turrets
  </li>
  <li> M - Music Menu (Not working)
  </li>
  <li> Space - Perfect Stacked Spiketick
  </li>
  <li> RightClick - AutoBreaker
  </li>
  <li> R - Normal Instakill
  </li>
  <li> T - Hard Instakill
  </li>
  <li> Y - OneTick
  </li>
  <li> , - Boost OneTick
  </li>
  <li> B - Bulltick
  </li>
  <li> Esc - To Open Menu
  </li>
  <br> whoa<br>
  <br> ty<br>
  </ul>
  <hr>
  </div>



  </div>
  <style>
  button:active,
  button:focus {
    outline: none !important;
  }
  button::-moz-focus-inner {
    border: 0 !important;
  }
  .nameblock {
  font-size: 20px;
  color: #dbdbdb;
  text-align: center;
  }
  li {
  font-size: 13px;
  }
  .text {
  display: block;
  font-size: 17px;
  color: #fff;
  text-align: left;
  }
  .menuToggle:hover{
  cursor: pointer;
  position: absolute;
  background: linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: colorR 20s ease infinite;
  animation: colorR 20s ease infinite;
  font-family: "Hammersmith One";
  display: block !important;
  top: 80px;
  left: 1517px;
  font-size: 17px;
  }
  .menuToggle{
  cursor: pointer;
  position: absolute;
  background: linear-gradient(to right, gray, black);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: colorR 20s ease infinite;
  animation: colorR 20s ease infinite;
  font-family: "Hammersmith One";
  display: block !important;
  top: 80px;
  left: 1517px;
  font-size: 17px;
  }
  ::-webkit-scrollbar { width: 5px; height: 3px;}
  ::-webkit-scrollbar-button {  background-color: #000000; }
  ::-webkit-scrollbar-track {  background-color: #999;}
  ::-webkit-scrollbar-track-piece { background-color: rgba(0, 0, 0, 0.50);}
  ::-webkit-scrollbar-thumb { height: 50px; background-color: #666; border-radius: 3px;}
  ::-webkit-scrollbar-corner { background-color: #999;}}
  ::-webkit-resizer { background-color: #666;}
  #infomenu {
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 20px;
  position: absolute;
  display: none;
  background: rgba(102, 102, 102, 0.25);
  width: 310px;
  height: 450px;
  border: 2px solid black;
  border-radius: 4px;
  top: 80px;
  left: 20px;
  z-index: 1;
  }
  input {outline: 0 !important;}
  .Input_Text_style, .Input_Buttob_style {
  background: rgba(102, 102, 102);
  border: 2px solid black;
  border-radius: 10px;
  color: #fff;
  -o-transition: all 1s ease;
  -ms-transition: all 1s ease;
  -moz-transition: all 1s ease;
  -webkit-transition: all 1s ease;
  transition: all 1s ease;
  }
  .Input_Text_style:focus,.Input_Buttob_style:focus {
  border: 2px solid #fff;
  }
  </style>
  <script>
  function InfoMenu() {
  $("#infomenu").css({
  "display" : "block"
  });
  }

  /*(function() {
    var UPDATE_DELAY = 700;
    var lastUpdate = 0;
    var frames = 0;
  var values;
    function updateCounter() {
      var now = Date.now();
      var elapsed = now - lastUpdate;
      if (elapsed < UPDATE_DELAY) {
        ++frames;
      } else {
        var fps = Math.round(frames / (elapsed / 1000));
        document.getElementById("fps").textContent ="Fps: " + fps ;
        frames = 0;
        lastUpdate = now;
      }
      requestAnimationFrame(updateCounter);
    }
    lastUpdate = Date.now();
    requestAnimationFrame(updateCounter);
  })();
  setInterval(()=>{
  document.getElementById("ping").textContent = "Ping: " + window.pingTime;
  },0);*/

  </script>
  `);
$("body").after(`
  <div id="ShowMenu">
  </span>
  <div id="addtext">LeftAndRightClick: On</div>
  <div id="addtext3">Balant macros: On</div>
  <div id="addtext0">Soldier-Q: On</div>
  <div id="addtext4">AutoSpawn: On</div>
  <div id="addtext1">Left-Click</div>
  <div id="addtext2">Right-Click</div>
  <style>
     #ShowMenu {
     position:absolute !important;
     display:block;
     top: 5px;
     left: 5px;
     width: auto;
     height: auto;
     text-align: center;
     }
     #addtext,#addtext1,#addtext2,#addtext0,#addtext3,#addtext4{
     display: none;
     color: #fff;
     background: linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet);
     background-size: 400% 400%;
     font-size: 20px;
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
     -webkit-animation: colorR 20s ease infinite;
     animation: colorR 20s ease infinite;
     }
     @-webkit-keyframes colorR {
     0% { background-position: 0% 50% }
     50% { background-position: 100% 50% }
     100% { background-position: 0% 50% }
     }
     @keyframes colorR {
     0% { background-position: 0% 50% }
     50% { background-position: 100% 50% }
     100% { background-position: 0% 50% }
     }
  </style>
  <script>
  </script>
  `);

var antii = document.querySelector("#anti")
antii.addEventListener('change', function() {
    if (this.checked) {
        anti = true;
    } else {
        anti = false;
    }
});
var hitBackk = document.querySelector("#hitBack")
hitBackk.addEventListener('change', function() {
    if (this.checked) {
        hitBack = true;
    } else {
        hitBack = false;
    }
});
var stackInstaa = document.querySelector("#stackInsta")
stackInstaa.addEventListener('change', function() {
    if (this.checked) {
        stackInsta = true;
    } else {
        stackInsta = false;
    }
});