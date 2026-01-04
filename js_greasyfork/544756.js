// ==UserScript==
// @name         1 tick by abdo
// @namespace    none
// @version      1
// @description  best 1 tick
// @author       Abdo
// @license      best
// @icon         https://cdn.discordapp.com/attachments/942291806740160552/1187992941306855544/Untitled_design_23.png?ex=6598e7a5&is=658672a5&hm=3b02984cc121d8feced3ba084129cbb21f3b3be25bd8d7c9964f4f176eeeecba&
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @require      https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544756/1%20tick%20by%20abdo.user.js
// @updateURL https://update.greasyfork.org/scripts/544756/1%20tick%20by%20abdo.meta.js
// ==/UserScript==
/*Mod Log
    V1 - Created vn mod, devlopment beings
       - Added basic macros & auto triple mills
       - Fixed buggy placement function
       - Added mousebutton hats
       - Added perfect spiketick
       - Added bullspammer

    V1.5 - added autobreaker
         - added heal based hitback
         - added anti instas
         - added reverse insta
         - removed bullspammer
         - added music menu

    V2   - added boost tick
         - added normal instaa
         - added diamond pol 1 tick
         - added sync detect test
         - added sync heal q hold
         - added a lot of visuals
         - major bug fixes
         - optimised heal
         - removed autobreaker secondary
         - added biome map
         - fixed heal bugs
         - made logo
        - changed autobreaker to hold right click
        - added menu
        - added stack insta
        - added bullspam detect
        - accessories

  V2.5  - added new menu
        - deleted reverse insta
        -changed binds
        -added anti instas
        -added shame auto shame reset
        -added better reverse insta
        -added line for ranged insta
    */
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

setInterval(() => window.follmoo && follmoo(), 10);

if(location.hostname == "sandbox.moomoo.io") {
    document.getElementById("foodDisplay").style.display = "none";
    document.getElementById("woodDisplay").style.display = "none";
    document.getElementById("stoneDisplay").style.display = "none";
}

document.getElementById("enterGame").addEventListener("click", autohide);
function autohide() {
    $("#ot-sdk-btn-floating").hide();
}
document.getElementById("linksContainer2").innerHTML = " ";
let changes = `<div id="subConfirmationElement"><a href="https://discord.gg/BVx8EWfBny">Join Discord!</a></div>`;
$('#linksContainer2').prepend(changes);
$('#subConfirmationElement').click( () => {
    try { window.follmoo(); } catch(e){};
    localStorage["moofoll"] = "1"; localStorage["moofol"] = "1";
});
document.querySelector("#joinPartyButton").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD
document.getElementById("gameName").innerHTML = "1 tick by abdo"
let changes2 = `<div id="customMenuName"><h3 style="font-size: 50px;" class = "indent">abdo is best</a></div>`;
$('#gameName').prepend(changes2);
$("#gameName").css({
    color: "#333",
    "text-shadow": "0 1px 0 #181818, 0 2px 0 #181818, 0 3px 0 #181818, 0 4px 0 #181818, 0 5px 0 #181818, 0 6px 0 #181818, 0 7px 0 #181818, 0 8px 0 #181818, 0 9px 0 #181818, rgba(0, 0, 0, 0.4) 1px 1px 40px",
    "text-align": "center",
    "font-size": "156px",
    "margin-bottom": "-30px",
});
document.getElementById("loadingText").innerHTML = `<div id="MRLAGPRO" class="loader">`
//document.getElementById("loadingText").innerHTML = "1 tick by abdo Loading";
document.getElementById("diedText").innerHTML = "Skill Issue";
document.getElementById("diedText").style.color = "#ffffff";
document.title = " 1 tick by abdo";
document.getElementById("leaderboard").append("1 tick bu abdo");
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
  <i class="fa-solid fa-rectangle-list"style="font-size: 25px";></i><p>Update V2</p> <div style="font-size: 15px">
  - added boost tick<br>
  - added normal insta<br>
  - added sync detect test<br>
  - added sync heal q hold-beta)<br>
  - added a lot of visuals<br>
  - major bug fixes<br>
  - optimised heal<br>
  - removed autobreaker secondary<br>
  - added biome hat<br>
  - fixed heal bugs <br>
  - made logo <br>
  - changed autobreaker to tankclick<br>
  - added menu! <br>
  - added stack insta<br>
  - added autoaim<br>
  - optimised heals<br>
  - added bullspam detect<br>
  - added accesories <br>
  <i class="fa-solid fa-rectangle-list"style="font-size: 25px";></i><p>Update V1</p> <div style="font-size: 15px">
  - Created vn mod, devlopment beings<br>
  - Added basic macros & auto triple mills<br>
  - Fixed buggy placement function<br>
  - Added mousebutton hats<br>
  - Added perfect spiketick<br>
  - Added bullspammer<br>
  - added autobreaker<br>
  - added heal based hitback<br>
  - added anti instas<br>
  - added reverse insta<br>
  - removed bullspammer<br>
  - added music menu<br>


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

const enterGameButton = document.getElementById("enterGame");
if (enterGameButton) {
    enterGameButton.style.backgroundColor = "#333";
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
        return minutes + ":" + (seconds < 10 ? "0" : "I Hate Myself.") + seconds;
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
    madeByLabel.textContent = "Made by Zod324myers";
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
let stackInsta = false;
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
        doNewSend(["6", [""]]);
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
let y = 0;
let x = 0;
let healSpeed = 100;
var messageToggle = 0;
var clanToggle = 0;
let healToggle = 1;
let hatToggle = 1;
var range_calculator = false;
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

/*function biomeHat() {
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
  }*/

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
          doNewSend(["M", [{name: "Anna" + "",moofoll: 1,skin: "#cc5151"}]]);
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

        if(rd0 == 'f'){
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
    let perfectAngle = 225;
    let log = console.log;
    let near;
    function do_auto_insta() {
        autoaim = true;
        doNewSend(["F", [1]]);
        doNewSend(["z", [secondary, true]]);
        doNewSend(["c", [0, 53, 0]]);
        setTimeout(() => {
            doNewSend(["z", [primary, true]]);
            doNewSend(["c", [0, 7, 0]]);

        }, 80);
        setTimeout(() => {
            doNewSend(["z", [primary, true]]);
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["F", [0]]);
            doNewSend(["9", [undefined, 1]]);
            autoaim = false;
        }, 500);
    }
    if(range_calculator == true){
        if (nearestEnemy !== undefined) {
            near = Math.hypot(myPlayer.y - nearestEnemy[2], myPlayer.x - nearestEnemy[1]);
            if(autoaim == false && Math.floor(near) >= 220 && Math.floor(near) <= 230) {
                doNewSend(["9", [nearestEnemyAngle, 1]]);
                doNewSend(["6", ['Calculated Range '+ Math.floor(near)]]);
                doNewSend(["c", [0, 40, 0]]);
                if(Math.floor(near) == 225){
                    do_auto_insta();
                }
            }
        }
    }
    let scale = 45;
    let placeOffset = 5;
    let angle = Math.atan2(y - myPlayer.y, x - myPlayer.x);
    if (y !== myPlayer.y || x !== myPlayer.x) {
        if (Math.atan2(y - myPlayer.y, x - myPlayer.x) < (scale + placeOffset) * 2) {
            if(automill == true && isNextToFriendlyMill == false && millCount < 298 && automilling == false){
                automilling = true;
                place(millType, angle + Math.PI / 2.5);
                place(millType, angle);
                place(millType, angle - Math.PI / 2.5);
                automilling = false;
            }
            x = myPlayer.x;
            y = myPlayer.y;
        }
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
                if (healTime <= 1) {
                    shame = shame++;
                } else {
                    shame = Math.max(0, shame - 2);
                }
            } else {
                lastDamageTick = gameTick;
            }
        }
        if (data[2] < 100 && data[2] > 0 && healToggle == true) {
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
            doNewSend(["n", [1]]);
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["z", [primary, true]]);
            setTimeout(() => {
                doNewSend(["c", [0, 53, 0]]);
                doNewSend(["n", [0]]);
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
    doNewSend(["z", [myPlayer.weapon, true]]);
    doNewSend(["z", [id, null]]);
    doNewSend(["F", [1, angle]]);
    doNewSend(["F", [0, angle]]);
    doNewSend(["z", [myPlayer.weapon, true]]);
}

function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["z", [id, null]]);
    doNewSend(["F", [1, angle]]);
    doNewSend(["F", [0, angle]]);
    doNewSend(["z", [myPlayer.weapon, true]]);
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
let automilling = false;
let automill = false;
const boostPlacer = repeater(70,() => {place(boostType);},50);
const spikePlacer = repeater(86,() => {place(spikeType);},50);
const placers = [boostPlacer, spikePlacer];
let prevCount = 0;
const handleMutations = (mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.target.id === "killCounter") {
            const count = parseInt(mutation.target.innerText, 10) || 0;
            if (count > prevCount) {
                doNewSend(["6", ["Search Youtube Abdo MooMoo io"]]);
                setTimeout(()=>{
                    doNewSend(["6", [""]]);
                },650);
                prevCount = count;
            }
        }
    }
};


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
    if (e.keyCode == 67 && document.activeElement.id.toLowerCase() !== "chatbox") {
        // spiketick
        if (autoaim) return;
autoaim = true;
console.log("Autoaim activated");

// Sprawdzenie, czy wróg został znaleziony
if (nearestEnemyAngle === undefined) {
    console.log("No enemy detected, aborting autoaim.");
    autoaim = false;
    return;
}

console.log("Zakładam czapkę 53, potem 7, a następnie kładę spike i wykonuję atak...");

// Najpierw czapka 53 (nie uruchamia ataku)
doNewSend(["c", [0, 53, 0]]);

// Po czapce 53 czekamy chwilę, aby atak nie został wykonany od razu
setTimeout(() => {
    console.log("Zakładam czapkę 7, kładę spika i wykonuję atak w tym samym czasie!");

    // Czapka 7 założona tuż przed atakiem
    doNewSend(["c", [0, 7, 0]]); // Czapka kutra 7

    // Kładzenie spika i atak w tym samym czasie
    place(spikeType, nearestEnemyAngle); // Kładzenie spika
    doNewSend(["F", [1]]);
    doNewSend(["z", [primary, true]]);
    doNewSend(["F", [1]]);

    console.log("Czapka 7 nałożona przed atakiem i położeniem spika.");

    // Zmiana czapki po ataku
    setTimeout(() => {
        console.log("Zmiana czapki po ataku.");
        doNewSend(["c", [0, 6, 0]]); // Zmiana czapki po ataku
        doNewSend(["F", [0]]);
        autoaim = false;
        console.log("Autoaim deactivated");
    }, 100); // Zmiana czapki po 100ms od ataku

}, 50);
    }
    if (e.keyCode == 84 && document.activeElement.id.toLowerCase() !== "chatbox") {//diamond pol 1 tick
        autoaim = true;
        doNewSend(["z", [primary, true]]);
        doNewSend(["c", [0, 53, 0]]);
        setTimeout(() => {
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["F", [1]]);
        }, 100);
        setTimeout(() => {
            doNewSend(["z", [primary, true]]);
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["F", [0]]);
            autoaim = false;
        }, 500);
    }
    if (e.keyCode == 199 &&document.activeElement.id.toLowerCase() !== "chatbox") {
        if (stackInsta == false) {
            console.log("normal insta");
            autoaim = true;
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["z", [primary, true]]);
            doNewSend(["c", [0, 0, 1]])
            doNewSend(["F", [1]]);
            acc(18)
            doNewSend(["c", [1]]);
            setTimeout(() => {
                doNewSend(["z", [secondary, true]]);
                doNewSend(["c", [0, 53, 0]]);
                doNewSend(["c", [0, 0, 1]]);
                acc(21)
            }, 105);
            setTimeout(() => {
                doNewSend(["z", [secondary, true]]);
            }, 110);
            setTimeout(() => {
                doNewSend(["z", [secondary, true]]);
            }, 115);
            setTimeout(() => {
                doNewSend(["z", [primary, true]]);
                doNewSend(["F", [0, null]]);
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
            doNewSend(["z", [primary, true]]);
            doNewSend(["c", [0, 0, 1]])
            doNewSend(["F", [1]]);
            acc(18)
            doNewSend(["c", [1]]);
            setTimeout( () => {
                var sck = "";
                doNewSend(["z", [secondary, true]]);
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
                doNewSend(["z", [secondary, true]]);
            }, 200);
            setTimeout(() => {
                doNewSend(["z", [primary, true]]);
                doNewSend(["F", [0, null]]);
                doNewSend(["c", [0, 6, 0]]);
                doNewSend(["c", [0, 0, 0]]);
                doNewSend(["c", [0, 0, 1]]);
                hat(6)
                acc(21)
                autoaim = false;
            }, 215);
        }
    }
    if (e.keyCode == 71 &&document.activeElement.id.toLowerCase() !== "chatbox") {
        console.log("boost tick");
        autoaim = true;
        setTimeout(()=>{
            doNewSend(["F", [1]]);
            doNewSend(["z", [secondary, true]]);
        },99);
        setTimeout(()=>{
            doNewSend(["c", [0, 53, 0]]);
            place(boostType);
        },50);
        setTimeout(() => {
            doNewSend(["z", [primary, true]]);
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["F", [1]]);
            doNewSend(["F", [0]]);
        }, 175);
        setTimeout(() => {
            doNewSend(["z", [primary, true]]);
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["F", [0]]);
            autoaim = false;
        }, 500);
    }
    if (e.keyCode == 82 && document.activeElement.id.toLowerCase() !== "chatbox") {
        if(stackInsta == false){
            // insta
            autoaim = true;
            console.log("reverse insta");
            doNewSend(["F", [1]]);
            doNewSend(["z", [secondary, true]]);
            doNewSend(["c", [0, 53, 0]]);
            setTimeout(() => {
                doNewSend(["z", [primary, true]]);
                doNewSend(["c", [0, 7, 0]]);

            }, 80);
            setTimeout(() => {
                doNewSend(["z", [primary, true]]);
                doNewSend(["c", [0, 6, 0]]);
                doNewSend(["F", [0]]);
                autoaim = false;
            }, 500);
        } else {
            autoaim = true;
            console.log("stacked reverse insta");
            doNewSend(["F", [1]]);
            doNewSend(["z", [secondary, true]]);
            doNewSend(["c", [0, 53, 0]]);
            setTimeout(() => {
                var sck = "";
                doNewSend(["z", [primary, true]]);
                doNewSend(["c", [0, 7, 0]]);
                doNewSend(["F", [1]]);
                doNewSend(["F", [0]]);
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
                doNewSend(["z", [primary, true]]);
                doNewSend(["c", [0, 6, 0]]);
                doNewSend(["F", [0]]);
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
        doNewSend(["F", [1]]);
        doNewSend(["c", [0, 40, 0]]);
        doNewSend(["z", [primary, true]]);
        setTimeout(()=>{
            doNewSend(["F", [0]]);
            doNewSend(["c", [0, 6, 0]]);
        },100);
    } else if (event.button == 2) {
        doNewSend(["F", [1]]);
        doNewSend(["c", [0, 40, 0]]);
        doNewSend(["z", [secondary, true]]);
        setTimeout(()=>{
            doNewSend(["F", [0]]);
            doNewSend(["c", [0, 6, 0]]);
        },100);
    }
});

/*document.addEventListener("mousedown", (event) => {
    if (event.button == 0) {
        doNewSend(["F", [1]]);
        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["z", [primary, true]]);
        setTimeout(()=>{
            doNewSend(["F", [0]]);
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


// Menu by Porsche 911 aka. Anna.dev
$("body").append(`
<div class="menu" id="T-menu">
        <span class="nameblock">1 tick by abdo</span><br>
        <span class="text">AntiInsta<input type="checkbox" id="anti" checked></span>
        <span class="text">HitBack<input type="checkbox" id="hitBack"></span>
        <span class="text">Stacked Insta<input type="checkbox" id="stackInsta"></span>
        <span class="text">Auto Reverse<input type="checkbox" id="calc"></span>
        <span class="nameblock">Controls:</span>

    <div class="text2">
        <span>N - Auto Triple Mill</span><br>
        <span>V - Spike</span><br>
        <span>F - Trap</span><br>
        <span>H - Double Turrets</span><br>
        <span>M - Music Menu</span><br>
        <span>Space - Perfect Stacked Spiketick</span><br>
        <span>RightClick - AutoBreaker</span><br>

        <span>R - Reverse Instakill</span><br>
        <span>T - OneTick</span><br>
        <span>G - Boost OneTick</span><br>
        <span>B - Bulltick</span><br>
        <span>Esc - Menu</span>
    </div>
</div>
<style>
.menu {
    width: 20rem;
    height: auto;
    top: 2rem;
    left: 2rem;
    transform: translateX(-30rem);
    position: absolute;
    display: flex;
    align-items: start;
    justify-content: start;
    flex-direction: column;
    transition: all 0.3s;
    padding: 2rem;
    border: 0.5rem rgb(0, 0, 0) solid;
    background-color: rgba(0, 255, 242, 0.534);;
}
.menu.show {
    transform: translateX(2rem);
}
.nameblock {
    font-size: 1.5rem;
    font-family: Arial;
    margin-block: 0.3rem;
}
.text {
    font-size: 1rem;
    font-family: Arial;
    margin-block: 0.1rem;
}
.text span {
    font-family: Arial;
    margin-block: 0.1rem;
}
text2 {
    display: flex;
    justify-content: start;
    align-items: start;
    height: auto;
}
.text2 span {
    font-family: Arial;
    margin-block: 1rem;
}
input[type="checkbox"] { position: relative; appearance: none; width: 33px; height: 15.5px; border-radius: 50px; box-shadow: inset 0 0 5px rgba(41, 41, 41, 0.2); cursor: pointer; top: 7.5px; transition: 0.4s;
  } input:checked[type="checkbox"] { background: #333;
  } input[type="checkbox"]::after { position: absolute; content: ""; width: 15.5px; height: 15.5px; top: 0; left: 0; background: #fff; border-radius: 50%; box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); transform: scale(1.1); transition: 0.4s;
  } input:checked[type="checkbox"]::after { left: 50%;}
</style>
`);
document.addEventListener("keydown", function (e) {
    if (e.keyCode == 27) {
        const menu = document.getElementById('T-menu');
        menu.classList.toggle('show');
    };
});


// move tester (working)
/*
document.addEventListener("keydown", function (e) {
    if (e.keyCode == 76) {
        doNewSend(["9", [nearestEnemyAngle, 1]]);
    };
});
*/




var calc = document.querySelector("#calc")
calc.addEventListener('change', function() {
    if (this.checked) {
        range_calculator = true;
    } else {
        range_calculator = false;
    }
});
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
document.addEventListener("keydown", function(e) {
    if (e.keyCode == 81) { // Zmieniono na klawisz 'Q'
        storeEquip(0,1);
        setTimeout(() => {
            place(inv.boostPad);
            setTimeout(()=>{
                weapon('secondary');
                storeEquip(53, 0);
                hit(true);
                setTimeout(() => {
                    weapon('primary');
                    storeEquip(7, 0);
                    setTimeout( () => {
                        storeEquip(6, 0);
                        setTimeout(() => {
                            hit(false);
                            storeEquip(11, 1);
                        }, 80);
                    }, 255);
                }, 140);
            }, 1.5);
        }, 150);
    }
});
this.rangeType = function(type) {
                        this.isTrue = true;
                        my.autoAim = true;
                        if (type == "ageInsta") {
                            sendChat("Uhm Bow Insta?");
                            my.ageInsta = false;
                            if (player.items[5] == 18) {
                                place(20, near.aim2);
                            }
                            packet("f", undefined, 1);
                            buyEquip(22, 0);
                            buyEquip(21, 1);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[1]);
                                buyEquip(53, 0);
                                buyEquip(21, 1);
                                sendAutoGather();
                                game.tickBase(() => {
                                    sendUpgrade(12);
                                    selectWeapon(player.weapons[1]);
                                    buyEquip(53, 0);
                                    buyEquip(21, 1);
                                    game.tickBase(() => {
                                        sendUpgrade(15);
                                        selectWeapon(player.weapons[1]);
                                        buyEquip(53, 0);
                                        buyEquip(21, 1);
                                        game.tickBase(() => {
                                            sendAutoGather();
                                            this.isTrue = false;
                                            my.autoAim = false;
                                        }, 1);
                                    }, 1);
                                }, 1);
                            }, 1);
                        } else {
                            selectWeapon(player.weapons[1]);
                            if (player.reloads[53] == 0 && near.dist2 <= 700 && near.skinIndex != 22) {
                                buyEquip(53, 0);
                            } else {
                                buyEquip(20, 0);
                            }
                            buyEquip(11, 1);
                            sendAutoGather();
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }, 1);
                        }
                    };
