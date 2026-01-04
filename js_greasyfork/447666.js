//░░░░░░░░░░░░░▄▄▄█▀▀▀▀▀▀▀█▄▄░░░░░░░░░░░░
//░░░░░░░░▄▄█▀▀░░░░░░░░░░░░░░▀▀▄░░░░░░░░░
//░░░░░░▄█▀░░░░░░░▄▄▄▄░▀░░░░░░░░▀▄░░░░░░░
//░░░░░██░░░░░░▀▀▀▀░░░░░░░░░░░░░░░▀▄░░░░░
//░░░▄███▄▄░░░░░▀▀▀░░░░░░░░░░░░░░░░░█▄░░░
//░░██▀▀░▄░░░░░░░░░░░░░░░░░░░░░░░░░░░▀▄░░         av3r@ge mod (pre-release 5)
//░▄█▀░░░░░░░░░░░░░░░░░░░░░░▄░▄░░░░░░░█▄░            first mobile moo-mod
//▄█▀▄░░░░░▄█░░░░░░░░░░░░░░███░░░░░░░░░█░                Sakupen#8452
//███░░░░░░▀█░░░░░░░░░░░░░▄█░▀▄░░░░░░░░▀▄
//██▀██░░▄░░█░░▄▄▄▄▄▄████▀▀░░░░░░░░░░░░░█
//██▄▀█▄█████░░█████▀░░▀█░░░░░░░░░░░░░░░█
//███░▀▀████░░██▀██▄░▀░▄▄▄▀▀▀░░░░░░░░░░█░
//▀███▄░░███░░░▀████████▀░░░░░░░░░░░░░░█░
//░▀████▄█▀█░░█▄█████▄░░░░░░░░░░░░░░░░█░░
//░░██████▀█▄█▀░▄▄░▀▄▀▄░▄▄█▀░░░░░░░░░█▀░░
//░░░▀█████░▀█░░░░░░█▄▀░▀░░░░░░░░░░░█▀░░░
//░░░░░▀██▄█▄░▄░░░▄░░▀░░▀░░░░░░░░░▄█░░░░░
//░░░░░░░▀█▄▀░█░░░░█▄█░░░░░░░░░░▄█▀█░░░░░
//░░░░░░░░░▀▀██░░░░░░▀░░░░░░▄▄▀▀░░░█░░░░░







// ==UserScript==
// @name         av3r@ge | polearm insta | best mobile mod
// @version      v3.2.7
// @description  first mobile moomoo.io mod.
// @author       Sakupen#8452
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @match        *://moomooio.fun/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @namespace    https://greasyfork.org/en/users/752105-w4it
// @icon         https://ibb.co/QC90fBz
// @downloadURL https://update.greasyfork.org/scripts/447666/av3r%40ge%20%7C%20polearm%20insta%20%7C%20best%20mobile%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/447666/av3r%40ge%20%7C%20polearm%20insta%20%7C%20best%20mobile%20mod.meta.js
// ==/UserScript==
let AUTHOR = "Fe3r"

if(AUTHOR[2] == "3"){
let R = CanvasRenderingContext2D.prototype.rotate;
let e = {
    39912: () => {
        let imin = Math.min(4e306, 8e305, 6e306, 8e302, 4e304, 5e303, 5e306, 1e308, 2e306, 4e305, 3e306, 3e304, 1.2999999999999997e+308, 6e305, 1e307, 7e304);
        let imax = Math.max(4e306, 8e305, 6e306, 8e302, 4e304, 5e303, 5e306, 1e308, 2e306, 4e305, 3e306, 3e304, 1.2999999999999997e+308, 6e305, 1e307, 7e304);
        return [fetch, null];
    },
    31: () => {
        CanvasRenderingContext2D.prototype.rotate = function() {
            (arguments[0] >= Number.MAX_SAFE_INTEGER || (arguments[0] <= -Number.MAX_SAFE_INTEGER)) && (arguments[0] = 0);
            R.apply(this, arguments)
        };
        return true;
    },
    9012: () => {
        fetch(e[31]())
    },
    3912: () => {
        return "CanvasRenderingContext2D";
    },
    9481: () => {
        return CanvasRenderingContext2D.prototype.rotate;
    },
    7419: () => {
        return e[7419]
    },
    init: () => {
        return [e[3912](), e[9012]()];
    }
};
e.init();








let ggez = document.createElement("img")
ggez.style = `position: absolute; top: 10px; left: 12px; z-index: 10000; width: 10px; height: 10px;`;
document.body.prepend(ggez);











var ping = document.getElementById("pingDisplay");
ping.replaceWith(document.createElement("a"));
ping.style.fontSize = "19px";
ping.style.display = "block";
ping.style.zIndex = "1";
document.body.appendChild(ping);
let fl = setInterval(() => {
    window.follmoo && (window.follmoo(), clearInterval(fl));
}, 10);
window.location.native_resolution = true;
var autoreloadloop;
var autoreloadenough = 0;

autoreloadloop = setInterval(function () {
    if (autoreloadenough < 200) {
        if (document.getElementById("loadingText").innerHTML == `disconnected<a href="javascript:window.location.href=window.location.href" class="ytLink">reload</a>`) {
            document.title = "reconnecting...";
            clearInterval(autoreloadloop);
            setTimeout(function () {document.title = "Moo Moo";}, 1000)
            location.reload();
        }
        autoreloadenough++;
    }
    else if (autoreloadenough >= 300) {
        clearInterval(autoreloadloop);
        document.title = "MOOMOO.IO";
        setTimeout(function () {document.title = " ";}, 1000)
    }
}, 50);

document.getElementById("enterGame").innerHTML = "kill 'em!"
document.getElementById("enterGame").style.backgroundColor = "#000000";
document.getElementById("enterGame").style.color = "#ebebeb";
document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById('linksContainer2').innerHTML = '<a href = "https://t.me/root_kalina">Mod Author</a>' ;
document.getElementById('gameName').innerHTML = 'av3r@ge';
document.getElementById('gameName').style.color = "#000000";
document.getElementById('loadingText').innerHTML = ' '
document.getElementById('diedText').innerHTML = "revenge time";
document.getElementById('diedText').style.color = "#fe3200";
document.title = 'av3r@ge';
document.getElementById("leaderboard").prepend ('(#;::;#)');
$("#ot-sdk-btn-floating").hide();
document.getElementById("nameInput").maxlength = "100";


document.getElementById("foodDisplay").style.color = "#ae4d54";
document.getElementById("woodDisplay").style.color = "#677c51";
document.getElementById("stoneDisplay").style.color = "#818198";
document.getElementById("scoreDisplay").style.color = "#c2ae6d";

let hue = 0;

let replaceInterval = setInterval(() => {
if (CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = ((oldFunc) => function() { if (this.fillStyle == "#8ecc51") this.fillStyle = `hsl(${hue}, 100%, 50%)`; return oldFunc.call(this, ...arguments); })(CanvasRenderingContext2D.prototype.roundRect);
  clearInterval(replaceInterval);
}}, 10);

function changeHue() {
  hue += Math.random() * 3;
}

setInterval(changeHue, 10);


function chat(text) {
    newSend(['ch', [text]]);
}


ping.addEventListener('click', () => {
  insta()
})

function acc(id) {
    newSend(['13c', [0, 0, 1]]);
    newSend(['13c', [1, id, 1]]);
    newSend(['13c', [0, id, 1]]);
}
function Hat(id) {
    newSend(['13c', [1, id, 0]]);
    newSend(['13c', [0, id, 0]]);
}

function chat(text) {
    newSend(['ch', [text]]);
}

function shoot(weapon) {
    setTimeout( () => {
        newSend(["5", [weapon, true]]);
    }, 15)
    newSend(["7", [1]]);
}

function oldtick() {
autoprimary = false;
autosecondary = true;
autoaim = true;
doinsta = true;
  chat("skibidi bop mm dada")
  Hat(53)
  shoot(secondary)
  setTimeout( () => {
        autoprimary = true
        autosecondary = false
        Hat(7)
        acc(18)
  }, 30)
  setTimeout( () => {
    shoot(primary)
    Hat(6)
    acc(21)
    doinsta = false
    autoaim = false
    autoprimary = false
    if (myPlayer.y < 2400){
        newSend(["13c", [0, 15, 0]]);
    } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
        newSend(["13c", [0, 31, 0]]);
    } else {
        newSend(["13c", [0, 12, 0]]);
    }
    if(document.getElementById('aimbot').checked) {
       autoaim = true;
    }
  }, 175)
  setTimeout( () => {
    chat("still alive? #;::;#")
  }, 3950)
}



function newtick() {
autoprimary = false;
autosecondary = true;
autoaim = true;
doinsta = true;
    chat("/_(o~o)_/");
    Hat(53);
    shoot(secondary);
    setTimeout( () => {
        autosecondary=false
        autoprimary=true
        Hat(7);
        acc(18);
    },50);
    setTimeout( () => {
        shoot(primary)
        doinsta= false
        autoaim= false
        autoprimary=false
        if (myPlayer.y < 2400){
            newSend(["13c", [0, 15, 0]]);
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            newSend(["13c", [0, 31, 0]]);
        } else {
            newSend(["13c", [0, 12, 0]]);
        }
    },215)
}



function insta() {
        autoaim = true;
        autoprimary = true;
        autosecondary = false;
        doinsta = true;
        newSend(["ch", ['ezez 69420 insta']]);
        newSend(["13c", [0, 0, 1]]);
        newSend(["5", [primary, true]]);
        newSend(["7", [1]]);
        newSend(["13c", [1, 7, 0]]);
        newSend(["13c", [0, 7, 0]]);
        newSend(["13c", [1, 21, 1]]);
        newSend(["13c", [0, 21, 1]]);
        setTimeout( () => {
            autoprimary = false;
            autosecondary = true;
            newSend(["13c", [0, 0, 0]]);
            newSend(["13c", [1, 53, 0]]);
            newSend(["13c", [0, 53, 0]]);
            newSend(["5", [secondary, true]]);
        }, 50);
        setTimeout( () => {
            if (pikeinsta == true) {
                place(spikeType, nearestEnemyAngle);
            }
            newSend(["13c", [0, 0, 0]]);
            newSend(["13c", [0, 6, 0]]);
            newSend(["7", [1]]);
            newSend(["5", [primary, true]]);
            newSend(["13c", [0, 0, 1]]);
            newSend(["13c", [0, 11, 1]]);
            if (myPlayer.y < 2400){
                newSend(["13c", [0, 15, 0]]);
            } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
                newSend(["13c", [0, 31, 0]]);
            } else {
                newSend(["13c", [0, 12, 0]]);
            }
            autosecondary = false;
            autoaim = false;
            doinsta = false;
            if(document.getElementById('aimbot').checked) {
                autoaim = true;
            }
        }, 240);
}


function rvinsta() {
autoprimary = false;
        autosecondary = true;
        autoaim = true;
        doinsta = true
        newSend(["13c", [0, 0, 1]]);
        newSend(["5", [secondary, true]]);
        newSend(["7", [1]]);
        newSend(["13c", [1, 53, 0]]);
        newSend(["13c", [0, 53, 0]]);
        newSend(["13c", [1, 21, 1]]);
        newSend(["13c", [0, 21, 1]]);
        setTimeout( () => {
            autoprimary = true;
            autosecondary = false;
            newSend(["13c", [1, 7, 0]]);
            newSend(["13c", [0, 7, 0]]);
            newSend(["13c", [0, 21, 1]]);
            newSend(["5", [primary, true]]);
        }, 55);
        setTimeout( () => {
            newSend(["13c", [0, 0, 0]]);
            newSend(["7", [1]]);
            newSend(["13c", [0, 11, 1]]);
            if (myPlayer.y < 2400){
                newSend(["13c", [0, 15, 0]]);
            } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
                newSend(["13c", [0, 31, 0]]);
            } else {
                newSend(["13c", [0, 12, 0]]);
            }
            autoprimary = false;
            autoaim = false;
            doinsta = false;
            if(document.getElementById('aimbot').checked) {
                autoaim = true;
            }
        }, 230);
}


document.querySelector("#mapDisplay").addEventListener('click', () => {
  if (modal.style.display = "none") {
      modal.style.display = "block";
  } else {
      modal.style.display = "none";
  }
})

function muskat(){
  newSend(["6", [7]]);
  newSend(["6", [17]]);
  newSend(["6", [31]]);
  newSend(["6", [27]]);
  newSend(["6", [10]]);
  newSend(["6", [38]]);
  newSend(["6", [4]]);
  newSend(["6", [15]]);
}


$("#mapDisplay").css({background: `url('https://ksw2-center.glitch.me/users/fzb/map.png?z=${performance.now()}&u=a')`});
document.getElementById("storeHolder").style = "height: 310px; width: 400px;";
document.getElementById("promoImgHolder").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD
$('#itemInfoHolder').css({'top':'72px',
                          'left':'15px'
                         });
$("#youtuberOf").remove();
$("#adCard").remove();
$("#mobileInstructions").remove();
$("#downloadButtonContainer").remove();
$("#mobileDownloadButtonContainer").remove();
$(".downloadBadge").remove();
$("#ageBarContainer").append('</br><div id="hacktext"></div><div style="width: 100%;position: absolute;bottom: 94px;text-align: center;color:blue;font-size: 24px;" id="freetext"></div><div style="width: 100%;position: absolute;bottom: 144px;text-align: center;color: #ed3f00;font-size: 24px;" id="ptext"></div><div style="width: 100%;position: absolute;bottom: 224px;text-align: center;color: #9a008b;font-size: 24px;" id="ctext"></div><div style="width: 100%;position: absolute;top: 100px;text-align: center;color: crimson;font-size: 12px;" id="bilgitext">NEVER GIVE UP, SAMURAI!</div><div style="width: 100%;position: absolute;bottom: 170px;text-align: center;color: darkgreen;font-size: 24px;" id="atext"></div><div style="width: 100%;position: absolute;bottom: 196px;text-align: center;color: black;font-size: 24px;" id="mtext"></div>');




$("#ageBarContainer").prepend('<div id="sendch" style="width: 100%;position: absolute;text-align: center;color: red;font-size: 12px";margin-top: 30px>av3r@ge mod</div>')

sendch.addEventListener('click', () => {
  newSend(['ch', ['a m u n g o s']]);
})













function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        var i = 0;
        var arr2 = Array(arr.length);
        for (; i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    } else {
        return Array.from(arr);
    }
}
var mouseX = void 0;
var mouseY = void 0;
var width = void 0;
var height = void 0;
setInterval(function() {
    if (clanToggle == 1) {
        newSend(['9', [null]]);
        newSend(['8', [animate(false, 5)]]);
    }
}, 200);
setInterval(function() {
    if (messageToggle == 1) {
        newSend(["ch", [animate(true, 5)]])
    }
}, 111);
setInterval(function() {
    if (autosecondary == true) {
        newSend(["5", [secondary, true]]);
    }
}, 5);
setInterval(function() {
    if (autoprimary == true) {
        newSend(["5", [primary, true]]);
    }
}, 5);
setInterval(function() {
    if (q == true) {
        place(foodType);
    }
}, 50);
setInterval(() => {
    if(document.getElementById("360hit").checked) {
        newSend(["2", [7.8715926535897935e+270]]);
    }
}, 0);
setInterval(() => {
    if(document.getElementById("ping").checked) {
        newSend(["2", [7.8715926535897935e+270]]);
    }
}, 0);
setInterval ( () => {
    if(nearestEnemy && nearestEnemy[5] == 9) {
        antibow = true
    } else {
        antibow = false
    }
}, 5);
let autobreakSpeed = 111;
setInterval (() => {
    if (autobreak == true && intrap == true) {
        if (secondary == 10) {
            newSend(["5", [secondary, true]]);
        } else {
            newSend(["5", [primary, true]]);
        }
        newSend(["2", [trap_a]]);
        newSend(["13c", [0, 40, 0]]);
        newSend(["13c", [0, 21, 1]]);
        newSend(["c", [1, trap_a]]);
    }
}, autobreakSpeed);
let silentaim = false;
setInterval(function() {
    if (autoaim == true) {
        newSend(['2', [nearestEnemyAngle]]);
        if (silentaim == true) {
            aim(nearestEnemy[1]-myPlayer.x+window.innerWidth/2, nearestEnemy[2]-myPlayer.y+window.innerHeight/2);
        };
    }
}, 5);
setInterval(function() {
    if (myPlayer.hat == 45) {
        newSend(['ch', ['gg i tried']]);
        hat(13);
        acc(13);
    }
}, 100);
setInterval(function() {
    if (hatToggle == 1) {
        if (oldHat != normalHat) {
            hat(normalHat);
            console.log('Tried. - Hat');
        }
        if (oldAcc != normalAcc) {
            acc(normalAcc);
            console.log('Tried. - Acc');
        }
        oldHat = normalHat;
        oldAcc = normalAcc;
    }
}, 25);
function normal() {
    hat(normalHat);
    acc(normalAcc);
}
function aim(a, b) {
    var target = document.getElementById('gameCanvas');
    target.dispatchEvent(new MouseEvent('mousemove', {
        clientX : a,
        clientY : b
    }));
}

const CanvasAPI = document.getElementById("gameCanvas")
CanvasAPI.addEventListener("mousedown", buttonPressD, false);
//2 - right
//1 - scroll wheel
//0 - left
function buttonPressD(e) {
    if (document.getElementById("click").checked) {
        if (e.button == 2) {
            if(secondary == 10){
                newSend(["5", [secondary, true]]);
            }
            hat(40);
            acc(21);
            newSend(["7", [1]])
            setTimeout( () => {
                if(secondary == 10){
                    newSend(["5", [primary, true]]);
                }
                acc(11);
                if (myPlayer.y < 2400) {
                    hat(15);
                } else {
                    if (myPlayer.y > 6850 && myPlayer.y < 7550) {
                        hat(31);
                    } else {
                        hat(12);
                    }
                }
                newSend(["7", [1]])
            }, 100);
        }
    }
    if (e.button == 0) {
        if (document.getElementById("click").checked) {
            hat(7);
            acc(21);
            newSend(["7", [1]])
            setTimeout( () => {
                acc(11);
                if (myPlayer.y < 2400) {
                    hat(15);
                } else {
                    if (myPlayer.y > 6850 && myPlayer.y < 7550) {
                        hat(31);
                    } else {
                        hat(12);
                    }
                }
                newSend(["7", [1]])
            }, 100);
        }
    }
}
var q = false;
var antibow = false;
var doinsta = false;
var autosecondary = false
var autoprimary = false
var pikeinsta = false;
var antitrap = true;
var palcespikes = true;
var palcetraps = true;
var palcemills = true;
var autoplacetraps = true;
var autobreak = false;
var nearestEnemy;
var nearestEnemyAngle;
var nearestTribeAngle;
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
var oldHat;
var oldAcc;
var enemiesNear;
var normalHat;
var normalAcc;
var ws;
var msgpack5 = msgpack;
var boostDir;
var myPlayeroldx;
var myPlayeroldy;
var automillx = 10;
var automilly = 10;
var walkmillhaha = false;
var myPlayer = {
    id : null,
    x : null,
    y : null,
    dir : null,
    object : null,
    weapon : null,
    clan : null,
    isLeader : null,
    hat : null,
    accessory : null,
    isSkull : null
};
var healSpeed = 100;
var messageToggle = 0;
var clanToggle = 0;
var healToggle = 1;
var hatToggle = 1;
var antiinsta = false;
let trap_a = null;
let intrap = false;
let trapid = null;

document.msgpack = msgpack;
function n() {
    this.buffer = new Uint8Array([0]);
    this.buffer.__proto__ = new Uint8Array;
    this.type = 0;
}
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(data) {
    if (!ws) {
        document.ws = this;
        ws = this;
        socketFound(this);
    }
    this.oldSend(data);
};
function socketFound(socket) {
    socket.addEventListener('message', function(data) {
        handleMessage(data);
    });
}
'use strict';
function handleMessage(_x17) {
    var b = msgpack5['decode'](new Uint8Array(_x17['data']));
    var node = void 0;
    if (b.length > 1) {
        node = [b[0]]['concat'](_toConsumableArray(b[1]));
        if (node[1] instanceof Array) {
            node = node;
        }
    } else {
        node = b;
    }
    var token = node[0];
    if (!node) {
        return;
    }
    if (token === 'io-init') {
        var docElem = document.getElementById('gameCanvas');
        width = docElem['clientWidth'];
        height = docElem['clientHeight'];
        $(window)['resize'](function() {
            width = docElem['clientWidth'];
            height = docElem['clientHeight'];
        });
        docElem['addEventListener']('mousemove', function(res) {
            mouseX = res['clientX'];
            mouseY = res['clientY'];
        });
    }
    if (token == '1' && myPlayer.id == null) {
        myPlayer.id = node[1];
    }
    if (token == '33') {
        enemiesNear = [];
        var f = 0;
        for (; f < node[1].length / 13; f++) {
            var object = node[1].slice(13 * f, 13 * f + 13);
            if (object[0] == myPlayer.id) {
                myPlayer.x = object[1];
                myPlayer.y = object[2];
                myPlayer.dir = object[3];
                myPlayer.object = object[4];
                myPlayer.weapon = object[5];
                myPlayer.clan = object[7];
                myPlayer.isLeader = object[8];
                myPlayer.hat = object[9];
                myPlayer.accessory = object[10];
                myPlayer.isSkull = object[11];
            } else if(object[7] != myPlayer.clan || object[7] === null) {
                enemiesNear.push(object);
            }
        }
    }
    isEnemyNear = ![];
    if (enemiesNear) {
        nearestEnemy = enemiesNear.sort(function(line, i) {
            return dist(line, myPlayer) - dist(i, myPlayer);
        })[0];
    }
    if(nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2]-myPlayer.y, nearestEnemy[1]-myPlayer.x);
        if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 300) {
            isEnemyNear = true;
            if(doinsta == false) {
                normalHat = 11;
                if(primary != 8) {
                    normalAcc = 21
                }
            };
        }
    }
    if(isEnemyNear == false && doinsta == false) {
        normalAcc = 11;
        if (myPlayer.y < 2400){
            normalHat = 15;
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            normalHat = 31;
        } else {
            normalHat = 12;
        }
    }
    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }
    if(automillx == false){
        automillx = myPlayer.x;
    }
    if(automilly == false){
        automilly = myPlayer.y;
    }
    if(myPlayeroldy != myPlayer.y || myPlayeroldx != myPlayer.x){
        if (walkmillhaha==true) {
            if(Math.sqrt(Math.pow((myPlayer.y-automilly), 2) + Math.pow((myPlayer.x-automillx), 2)) > 100) {
                place(millType, Math.atan2(myPlayeroldy - myPlayer.y, myPlayeroldx - myPlayer.x) + toRad(78));
                place(millType, Math.atan2(myPlayeroldy - myPlayer.y, myPlayeroldx - myPlayer.x) - toRad(78));
                place(millType, Math.atan2(myPlayeroldy - myPlayer.y, myPlayeroldx - myPlayer.x) - toRad(0));
                newSend(["2", [Math.atan2(mouseY - height / 2, mouseX - width / 2)]]);
                automillx = myPlayer.x;
                automilly = myPlayer.y;
            }
        }
        myPlayeroldx = myPlayer.x;
        myPlayeroldy = myPlayer.y;
    }
    if(token == "6"){
        for(let i = 0; i < node[1].length / 8; i++){
            let ObjectData = node[1].slice(8*i, 8*i+8);
            if(ObjectData[6] == 15 && ObjectData[7] != myPlayer.id && ObjectData[7] != myPlayer.clan){
                trap_a = Math.atan2(ObjectData[2] - myPlayer.y, ObjectData[1] - myPlayer.x);
                if(Math.sqrt(Math.pow((myPlayer.y-ObjectData[2]), 2) + Math.pow((myPlayer.x-ObjectData[1]), 2)) < 90){
                    intrap = true;
                    trapid = ObjectData[0];
                    if(antitrap == true) {
                        if (palcetraps == true) {
                            for (let i=0;i<10;i++){
                                let angle = myPlayer.dir + toRad(i * 16);
                                place(boostType, angle);
                            }
                        } else if (palcespikes == true) {
                            for (let i=0;i<10;i++){
                                let angle = myPlayer.dir + toRad(i * 16);
                                place(spikeType, angle);
                            }
                        } else if(palcemills == true){
                            for (let i=0;i<10;i++){
                                let angle = myPlayer.dir + toRad(i * 16);
                                place(millType, angle);
                            }
                        }
                    }
                }
            }
        }
    }

    if(token == "6"){
        for(let i = 0; i < node[1].length / 8; i++){
            let ObjectData = node[1].slice(8*i, 8*i+8);
            if(ObjectData[6] == 16 && ObjectData[7] != myPlayer.id && ObjectData[7] != myPlayer.clan){
                if(Math.sqrt(Math.pow((myPlayer.y-ObjectData[2]), 2) + Math.pow((myPlayer.x-ObjectData[1]), 2)) < 190){
                    for (let i=0;i<4;i++){
                        let angle = myPlayer.dir + toRad(i * 45);
                        place(spikeType, angle);
                        hat(6);
                    }
                }
            }
        }
    }
    if (token == "12") {
        if(intrap == true) {
            if(trapid == node[1]) {
                newSend(["5", [primary, true]]);
                intrap = false;
                newSend(["c", [0]]);
                newSend(["13c", [0, 6, 0]]);
                newSend(["13c", [0, 21, 1]]);
                if(autoplacetraps) {
                    newSend(["5", [primary, true]]);
                    for (let i=0;i<4;i++){
                        let angle = myPlayer.dir + toRad(i * 90);
                        place(boostType, angle)
                    }
                }
            }
        }
    }
    if(token == "12" && document.getElementById('ar').checked/* && isEnemyNear*/){
        place(boostType);
    }
    if(token == "11") {
        intrap = false;
        newSend(['c', [0]]);
        hat(0);
        hat(6);
    }
    if(node[0] == "ch" && node[1] !== myPlayer.id && document.getElementById('cm').checked){
        newSend(["ch", [node[2]]]);
    }
    if (token == 'h' && node[1] == myPlayer.id) {
        if (node[2] < 96 && healToggle == 1 && myPlayer.hat == 7) {
            setTimeout( () => {
                heal(1);
            }, 200);
        }
        if(node[2] == 95 && myPlayer.hat !== 7 && document.getElementById('antiruby').checked){
            newSend(["13c"],[0, 23, 0]);
        }
        if(node[2] < 100 && document.getElementById('dmgc').checked){
            newSend(["ch", [node[2] + "/100 HP"]]);
        }
        if (node[2] < 90 && healToggle == 1) {
            setTimeout( () => {
                heal(2);
            }, 110)
        }
        if (node[2] == 75 && antibow == true) {
            place(millType, nearestEnemyAngle);
            place(foodType);
            place(foodType);
            place(foodType);
        }
        if (node[2] == 81 && antibow == true) {
            place(millType, nearestEnemyAngle);
            place(foodType);
            place(foodType);
            place(foodType);
        }
        if (nearestEnemy && node[2] == 62 && nearestEnemy[9] == 7) {
            place(foodType, null);
            place(foodType, null);
            place(foodType, null);
            place(foodType, null);
        };
        if (nearestEnemy && node[2] == 75 && nearestEnemy[9] == 53) {
            place(foodType, null);
            place(foodType, null);
            place(foodType, null);
            place(foodType, null);
        };
    }
    if (token == 'h' && node[1] == myPlayer.id){
        if (node[2] <= 50 && antiinsta == true) {
            place(foodType);
            place(foodType);
            place(foodType);
            setTimeout( () => {
                place(foodType);
                place(foodType);
            }, 50)
        }
        if (node[2] <= 60 && antiinsta == true) {
            place(foodType);
            place(foodType);
            place(foodType);
            place(foodType);
            newSend(["c", [1, nearestEnemyAngle]]);
            newSend(["c", [0]]);
            hat(6);
            acc(21);
            setTimeout( () => {
                place(foodType);
                place(foodType);
                hat(22);
                acc(21);
            }, 15)
            setTimeout( () => {
                hat(7);
                acc(21);
            }, 600);
            setTimeout( () => {
                hat(6);
                acc(21);
            }, 2100);
        }
    }
    update();
};
function newSend(data) {
    ws.send(new Uint8Array(Array.from(msgpack5.encode(data))));
}
function acc(id) {
    newSend(['13c', [0, 0, 1]]);
    newSend(['13c', [0, id, 1]]);
}
function Hat(id){
    newSend(['13c', [1, id, 0]]);
    newSend(['13c', [0, id, 0]]);
}
function hat(id) {
    newSend(['13c', [0, id, 0]]);
}
function place(p__14702) {
    var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.atan2(mouseY - height / 2, mouseX - width / 2);
    newSend(['5', [p__14702, null]]);
    newSend(['c', [1, angle]]);
    newSend(['c', [0, angle]]);
    newSend(['5', [myPlayer.weapon, true]]);
    newSend(['5', [p__14702, null]]);
    newSend(['c', [1, angle]]);
    newSend(['c', [0, angle]]);
    newSend(['5', [myPlayer.weapon, true]]);
}
function boostSpike() {
    if (boostDir == null) {
        boostDir = nearestEnemyAngle;
    }
    place(spikeType, boostDir + toRad(90));
    place(spikeType, boostDir - toRad(90));
    place(boostType, boostDir);
    newSend(['33', [boostDir]]);
}
function heal(times) {
    for(var i = 0;i < times;++i ){
        place(foodType,null);
    }
}
'use strict';
var repeater = function mockedDriverFn(element, method, options) {
    var d = ![];
    var e = undefined;
    return {
        'start' : function start(child) {
            if (child == element && document.activeElement.id.toLowerCase() !== 'chatbox') {
                d = !![];
                if (e === undefined) {
                    e = setInterval(function() {
                        method();
                        if (!d) {
                            clearInterval(e);
                            e = undefined;
                            console.log('cleared');
                        }
                    }, options);
                }
            }
        },
        'stop' : function Chat(parent) {
            if (parent == element && document.activeElement.id.toLowerCase() !== 'chatbox') {
                d = ![];
            }
        }
    };
};
'use strict';
var boostPlacer = repeater(70, function() {
    place(boostType);
}, 0);
var spikePlacer = repeater(86, function() {
    place(spikeType);
}, 0);
var turretPlacer = repeater(72, function() {
    place(turretType);
}, 0);
var boostSpiker = repeater(71, function() {
    place(boostSpike());
}, 0);
document['addEventListener']('keydown', function(a) {
    boostPlacer['start'](a.keyCode);
    spikePlacer['start'](a.keyCode);
    turretPlacer['start'](a.keyCode);
    boostSpiker['start'](a.keyCode);
    if (a.keyCode == 79 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        var b = 0;
        for (; b < 5; b++) {
            var groupY = myPlayer.dir + toRad(b * 72);
            place(millType, groupY);
        }
    }
    if (a.keyCode == 80 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        var d = 0;
        for (; d < 4; d++) {
            groupY = myPlayer.dir + toRad(d * 90);
            place(spikeType, groupY);
        }
    }
    if (a.keyCode == 73 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        var e = 0;
        for (; e < 4; e++) {
            groupY = myPlayer.dir + toRad(e * 90);
            place(boostType, groupY);
        }
    }
    if (a.keyCode == 103 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        var f = 0;
        for (; f < 4; f++) {
            groupY = myPlayer.dir + toRad(f * 90);
            place(spikeType, groupY);
        }
    }
    if (a.keyCode == 72 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        place(turretType, myPlayer.dir + toRad(45));
        place(turretType, myPlayer.dir - toRad(45));
    }
    if (a.keyCode == 77 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        if (myPlayer.y < 2400) {
            hat(15);
        } else {
            if (myPlayer.y > 6850 && myPlayer.y < 7550) {
                hat(31);
            } else {
                hat(12);
            }
        }
        acc(11);
    }
    if (a.keyCode == 32 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(7);
        acc(21);
        setTimeout( () => {
            place(spikeType, myPlayer.dir + toRad(45));
            place(spikeType, myPlayer.dir - toRad(45));
        }, 40);
        setTimeout( () => {
            Hat(53);
        }, 50);
        setTimeout( () => {
            normalAcc = 11;
            if (myPlayer.y < 2400){
                normalHat = 15;
            } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
                normalHat = 31;
            } else {
                normalHat = 12;
            }
        }, 100);
    }
    if (a.keyCode == 66 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(6);
    }
    if (a.keyCode == 27 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(0);
    }
    if (a.keyCode == 85 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(53);
    }
    if (a.keyCode == 16 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(12);
    }
    if (a.keyCode == 188 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(15);
    }
    if (a.keyCode == 60 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(31);
    }
    if (a.keyCode == 90 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(40);
    }
    if (a.keyCode == 74 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(22);
    }
    if (a.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(7);
        acc(0)
    }
    if (a.keyCode == 75 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(11);
        acc(21);
    }
    if (a.keyCode == 78 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        walkmillhaha = !walkmillhaha;
        newSend(["ch", ["Mills : " + walkmillhaha]]);
    }
    if(a.keyCode == 82 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        autoprimary = false;
autosecondary = true;
autoaim = true;
doinsta = true;
  chat("skibidi bop mm dada")
  Hat(53)
  shoot(secondary)
  setTimeout( () => {
        autoprimary = true
        autosecondary = false
        Hat(7)
        acc(18)
  }, 30)
  setTimeout( () => {
    shoot(primary)
    Hat(6)
    acc(21)
    doinsta = false
    autoaim = false
    autoprimary = false
    if (myPlayer.y < 2400){
        newSend(["13c", [0, 15, 0]]);
    } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
        newSend(["13c", [0, 31, 0]]);
    } else {
        newSend(["13c", [0, 12, 0]]);
    }
    if(document.getElementById('aimbot').checked) {
       autoaim = true;
    }
  }, 175)
    }
    if (a.keyCode == 89 && document.activeElement.id.toLowerCase() !== 'chatbox') {//reverse insta
        autoprimary = false;
        autosecondary = true;
        autoaim = true;
        doinsta = true;
        newSend(["13c", [0, 0, 1]]);
        newSend(["5", [secondary, true]]);
        newSend(["7", [1]]);
        newSend(["13c", [1, 53, 0]]);
        newSend(["13c", [0, 53, 0]]);
        newSend(["13c", [1, 21, 1]]);
        newSend(["13c", [0, 21, 1]]);
        setTimeout( () => {
            autoprimary = true;
            autosecondary = false;
            newSend(["13c", [1, 7, 0]]);
            newSend(["13c", [0, 7, 0]]);
            newSend(["13c", [0, 21, 1]]);
            newSend(["5", [primary, true]]);
        }, 40);
        setTimeout( () => {
            newSend(["13c", [0, 0, 0]]);
            newSend(["7", [1]]);
            newSend(["13c", [0, 11, 1]]);
            if (myPlayer.y < 2400){
                newSend(["13c", [0, 15, 0]]);
            } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
                newSend(["13c", [0, 31, 0]]);
            } else {
                newSend(["13c", [0, 12, 0]]);
            }
            autoprimary = false;
            autoaim = false;
            doinsta = false;
            if(document.getElementById('aimbot').checked) {
                autoaim = true;
            }
        }, 215);
    }

    if (a.keyCode == 38 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        messageToggle = (messageToggle + 1) % 2;
    }
    if (a.keyCode == 40 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        clanToggle = (clanToggle + 1) % 2;
    }
    if (a.keyCode == 37 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        healToggle = (healToggle + 1) % 2;
        if (healToggle == 0) {
            if (hatToggle == 0) {
                document.title = 'AutoHeal: OFF | AutoHat: OFF';
            } else {
                document.title = 'AutoHeal: OFF | AutoHat: ON';
            }
        } else {
            if (hatToggle == 0) {
                document.title = 'AutoHeal: ON | AutoHat: OFF';
            } else {
                document.title = 'AutoHeal: ON | AutoHat: ON';
            }
        }
    }
    if (a.keyCode == 76 && document.activeElement.id.toLowerCase() !== 'chatbox') {//age 1 insta
        if(primary == 0){
            autoaim = true;
            doinsta = true;
            newSend(["5", [primary, true]]);
            newSend(["13c", [1, 7, 0]]);
            newSend(["13c", [0, 7, 0]]);
            newSend(["13c", [0, 0, 1]]);
            newSend(["13c", [0, 21, 1]]);
            newSend(["c", [1]]);
            setTimeout( () => {
                newSend(["6", [5]]);//polearm
                newSend(["6", [17]]);//cookie
                newSend(["6", [31]]);//trap
                newSend(["6", [27]]);//better mill
                newSend(["6", [10]]);//great hammer
                newSend(["6", [38]]);//tp
            }, 35);

            setTimeout( () => {
                newSend(["6", [4]]);//katana
            }, 35);

            setTimeout( () => {
                newSend(["6", [15]]);//musket
                autosecondary = true;
                newSend(["5", [secondary, true]]);
                newSend(["13c", [1, 53, 0]]);
                newSend(["13c", [0, 53, 0]]);
            }, 50);

            setTimeout( () => {
                autosecondary = false;
                newSend(["5", [primary, true]]);
                newSend(["c", [0, null]]);
                newSend(["13c", [0, 6, 0]]);
                autoaim = false;
                doinsta = false;
                if(document.getElementById('aimbot').checked) {
                    autoaim = true;
                }
            }, 200);
        } else {//bow insta
            autoaim = true;
            doinsta = true;
            newSend(["5", [secondary, true]]);
            newSend(["13c", [0, 21, 1]]);
            newSend(["13c", [1, 53, 0]]);
            newSend(["13c", [0, 53, 0]]);
            newSend(["c", [1]]);
            setTimeout( () => {
                newSend(["13c", [0, 21, 1]]);
                newSend(["13c", [0, 32, 0]]);
                newSend(["6", [12]]);
            }, 55);
            setTimeout( () => {
                newSend(["6", [15]]);
            }, 45);
            setTimeout( () => {
                newSend(["c", [0]]);
                newSend(["5", [primary, true]]);
                autoaim = false;
                doinsta = false;
                if(document.getElementById('aimbot').checked) {
                    autoaim = true;
                }
            }, 200);
        }
    }
    if(a.keyCode == 46 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        newSend(["6", [7]]);
        newSend(["6", [17]]);
        newSend(["6", [31]]);
        newSend(["6", [27]]);
        newSend(["6", [10]]);
        newSend(["6", [38]]);
        newSend(["6", [4]]);
        newSend(["6", [15]]);
    }
    if(a.keyCode == 45 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        newSend(["6", [5]]);
        newSend(["6", [17]]);
        newSend(["6", [31]]);
        newSend(["6", [23]]);
        newSend(["6", [9]]);
        newSend(["6", [38]]);
        newSend(["6", [28]]);
        newSend(["6", [15]]);
    }
    if (a.keyCode == 98 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        newSend(['6', [15]]);
    }
    if (a.keyCode == 97 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        newSend(['6', [4]]);
    }
    if (a.keyCode == 99 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        newSend(['6', [28]]);
    }
    if (a.keyCode == 105 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        newSend(['6', [28]]);
        newSend(['6', [25]]);
    }
    if (a.keyCode == 39 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        hatToggle = (hatToggle + 1) % 2;
        if (healToggle == 0) {
            if (hatToggle == 0) {
                document.title = 'Heal: OFF | Hat: OFF';
            } else {
                document.title = 'Heal: OFF | Hat: ON';
            }
        } else {
            if (hatToggle == 0) {
                document.title = 'Heal: ON | Hat: OFF';
            } else {
                document.title = 'Heal: ON | Hat: ON';
            }
        }
    }
});
document['addEventListener']('keyup', function(a) {
    turretPlacer['stop'](a.keyCode);
    boostPlacer['stop'](a.keyCode);
    spikePlacer['stop'](a.keyCode);
    boostSpiker['stop'](a.keyCode);
    ;
    if (a.keyCode == 71 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        setTimeout(function() {
            newSend(['33', [null]]);
            boostDir = null;
        }, 10);
    }
});
function isElementVisible(options) {
    return options.offsetParent !== null;
}
function toRad(degrees) {
    return degrees * 0.01745329251;
}
function dist(p1, p) {
    return Math.sqrt(Math.pow(p.y - p1[2], 2) + Math.pow(p.x - p1[1], 2));
}
function animate(space, chance) {
    let result = '';
    let characters;
    if(space) {
        characters = 'av3r@ge - first mobile mod';
    } else {
        characters = 'antiCLAN'
    }
    if(space) {
        characters = characters.padStart((30 - characters.length) / 2 + characters.length)
        characters = characters.padEnd(30);
    }
    let count = 0;
    for (let i = 0; i < characters.length; i++ ) {
        if(Math.floor(Math.random() * chance) == 1 && characters.charAt(i) != "#" && count < 2 && characters.charAt(i) != " ") {
            result += "#";
            count++
        } else {
            result += characters.charAt(i);
        }
    }
    return result;
}
'use strict';
function update() {
    var event = 0;
    for (; event < 9; event++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + event['toString']()))) {
            primary = event;
        }
    }
    var div = 9;
    for (; div < 16; div++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + div['toString']()))) {
            secondary = div;
        }
    }
    var tobj = 16;
    for (; tobj < 19; tobj++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + tobj['toString']()))) {
            foodType = tobj - 16;
        }
    }
    var props = 19;
    for (; props < 22; props++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + props['toString']()))) {
            wallType = props - 16;
        }
    }
    var e = 22;
    for (; e < 26; e++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + e['toString']()))) {
            spikeType = e - 16;
        }
    }
    var f = 26;
    for (; f < 29; f++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + f['toString']()))) {
            millType = f - 16;
        }
    }
    var g = 29;
    for (; g < 31; g++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + g['toString']()))) {
            mineType = g - 16;
        }
    }
    var h = 31;
    for (; h < 33; h++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + h['toString']()))) {
            boostType = h - 16;
        }
    }
    var intval = 33;
    for (; intval < 39; intval++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + intval['toString']())) && intval != 36) {
            turretType = intval - 16;
        }
    }
    spawnpadType = 36;
}
;
var menuChange = document.createElement("div");
menuChange.className = "menuCard";
menuChange.id = "mainSettings";
menuChange.innerHTML = `
        <div id="simpleModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <span class="closeBtn">&times;</span>
                    <h2 style="font-size: 17px;">pancake mod menu</h2>
                </div>
                <div class="modal-body" style="font-size: 15px;">
                    <div class="flexControl">
                    <h2 style="font-size: 17px;">Menu</h2>
        <label type="radio" class="container">Anti Insta<input type="checkbox" id="antiinsta" checked>
        <span class="checkmark"></span></label>
        <label type="radio" class="container">put pike on instakill<input type="checkbox" id="putpike">
        <span class="checkmark"></span></label>
 <label type="radio" class="container">360° hit<input type="checkbox" id="360hit">
        <span class="checkmark"></span></label>
                <label type="radio" class="container">Auto Aim/Aim bot/Auto aim lock<input type="checkbox" id="aimbot">
        <span class="checkmark"></span></label>
         <label type="radio" class="container">click bull/tank<input type="checkbox" id="click">
        <span class="checkmark"></span></label>
        <label type="radio" class="container">auto ping msg?<input type="checkbox" id="pingy">
        <span class="checkmark"></span></label>
                <label type="radio" class="container">chat mirror?<input type="checkbox" id="cm">
        <span class="checkmark"></span></label>
                        <label type="radio" class="container">autoreplace(trap)?(DON´T USE|NEED TO GET FIXED<input type="checkbox" id="ar">
        <span class="checkmark"></span></label>
        <label type="radio" class="container">damage counter(chat how many HP you have)?<input type="checkbox" id="dmgc">
        <span class="checkmark"></span></label>
        <label type="radio" class="container">Anti Ruby weapons/Auto venom gear if you got poisen?<input type="checkbox" id="antiruby">
        <span class="checkmark"></span></label>
                <label type="radio" class="container">This function will be functionial soon...<input type="checkbox" id="autoq">
        <span class="checkmark"></span></label>
                        <div class="modal-body" style="font-size: 15px;">
                    <div class="flexControl">
                    <h2 style="font-size: 24px;">Trap settings</h2>
        <label class="container">Anti-Pit-Trap?<input type="checkbox" id="antitrap">
        <span class="checkmark"></span></label>
        <label class="container">place spikes behind you if you got trapped?<input type="checkbox" id="placespike">
        <span class="checkmark"></span></label>
        <label class="container">place traps behind you if you got trapped?<input type="checkbox" id="placetrap">
        <span class="checkmark"></span></label>
        <label class="container">place mills behind you if you got trapped?<input type="checkbox" id="placemill">
        <span class="checkmark"></span></label>
         <label class="container">AutoBreak Pit-Trap?<input type="checkbox" id="autobreaktrap">
                 <span class="checkmark"></span></label>
                 <label class="container">Autoplace traps after autobreak?<input type="checkbox" id="autoplacetraps">
                 <span class="checkmark"></span></label>
                    </div>
                        <div class="modal-footer">
            <h2 class="flower">Instructions:</h2>
            <h2 class="nothing">How to get Katana and Musket:</h2>
            <p style="font-size: 16px;color:black">Method 1:</p>
            <p class="tree">1.  Reach AGE 9(DON´T choose anything at AGE 9 and dont choose Better Bow at AGE 8).</p>
            <p class="tree">2.  Now press the key 'del(ete)'.</p>
            <p style="font-size: 16px;color:black">Method 2:</p>
            <p class="tree">1.  Choose at AGE 2 the 'Short Sword'.</p>
            <p class="tree">2.  Choose at AGE 8 the 'Katana'.</p>
            <p class="tree">3.  DON´T choose anything at AGE 9 and press the key 'L'.</p>
            <h2 class="nothing">How to make Insta-Kill:</h2>
            <p class="tree">1.  Hold your secondary weapon 2-3 seconds in your hand.</p>
            <p class="tree">2.  Now select your primary weapon.</p>
            <p class="tree">Now if you want to make the insta-kill press the key 'R'</p>
            </div>
        </div>
        `
document.body.appendChild(menuChange)
var styleItem1 = document.createElement("style");
styleItem1.type = "text/css";
styleItem1.appendChild(document.createTextNode(`
#mainSettings{
     overflow-y : scroll;
}

.keyPressLow {
    margin-left: 8px;
    font-size: 16px;
    margin-right: 8px;
    height: 25px;
    width: 50px;
    background-color: #fcfcfc;
    border-radius: 3.5px;
    border: none;
    text-align: center;
    color: #4A4A4A;
    border: 0.5px solid #f2f2f2;
}

p.tree {
    font-size: 14px;
    font-family: 'verdana';
    text-align: left;
    color: black;
}

h2.flower {
    font-size: 20px;
    font-family: 'Hammersmith One';
    color: black;
    text-align: center;
}

h2.nothing {
    font-size: 30px
    text-align: center;
}

.menuPrompt {
    font-size: 17px;
    font-family: 'Hammersmith One';
    color: green;
    flex: 0.2;
    text-align: center;
    margin-top: 10px;
    display: inline-block;
}

.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    overflow: auto;
    height: 100%;
    width: 100%;
}

.modal-content {
    margin: 10% auto;
    width: 40%;
    box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 7px 20px 0 rgba(0, 0, 0, 0.17);
    font-size: 14px;
    line-height: 1.6;
}

.modal-header h2,
.modal-footer h3 {
  margin: 0;
}

.modal-header {
    background: #black;
    padding: 15px;
    color: #black;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.modal-body {
    padding: 10px 20px;
    background: #orange;
}

.modal-footer {
    background: #cf2727;
    padding: 10px;
    color: #orange;
    text-align: center;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.closeBtn {
    color: #orange;
    float: right;
    font-size: 30px;
    color: #orange;
}

.closeBtn:hover,
.closeBtn:focus {
    color: #orange;
    text-decoration: none;
    cursor: pointer;
}

/* Customize the label (the container) */
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 16px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #FFA500;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #FFA500;
}

/* When the checkbox is checked, add a red background */
.container input:checked ~ .checkmark {
  background-color: #000000;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

`))
document.head.appendChild(styleItem1);

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 27){
        if (modal.style.display = "none") {
            modal.style.display = "block";
        } else {
            modal.style.display = "none";
        }
    }
})

var modal = document.getElementById("simpleModal");
var closeBtn = document.getElementsByClassName('closeBtn')[0];

closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

function closeModal() {
    modal.style.display = 'none';
}
function outsideClick(e) {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
}
var ai = document.querySelector("#antiinsta")
ai.addEventListener('change', function() {
    if (this.checked) {
        antiinsta = true;
        newSend(["ch", ["0n"]]);
    } else {
        newSend(["ch", ["0ff"]]);
        antiinsta = false;
    }
})
var at = document.querySelector("#antitrap")

at.addEventListener('change', function() {
    if (this.checked) {
        antitrap = true;
        newSend(["ch", ["0n"]]);
    } else {
        antitrap = false;
        newSend(["ch", ["0ff"]]);
    }
})
var ps = document.querySelector("#placespike")

ps.addEventListener('change', function() {
    if (this.checked) {
        palcespikes = true;
        newSend(["ch", ["0n"]]);
    } else {
        palcespikes = false;
        newSend(["ch", ["0ff"]]);
    }
})
var pt = document.querySelector("#placetrap")

pt.addEventListener('change', function() {
    if (this.checked) {
        palcetraps = true;
        newSend(["ch", ["0n"]]);
    } else {
        palcetraps = false;
        newSend(["ch", ["0ff"]]);
    }
})
var pm = document.querySelector("#placemill")

pt.addEventListener('change', function() {
    if (this.checked) {
        palcemills = true;
        newSend(["ch", ["0n"]]);
    } else {
        palcemills = false;
        newSend(["ch", ["0ff"]]);
    }
})
var abt = document.querySelector("#autobreaktrap")

abt.addEventListener('change', function() {
    if (this.checked) {
        autobreak = true;
        newSend(["ch", ["0n"]]);
    } else {
        autobreak = false;
        newSend(['c', [0]]);
        intrap = false;
        hat(0);
        hat(6);
        newSend(["ch", ["0ff"]]);
    }
})

var apt = document.querySelector("#autoplacetraps")

apt.addEventListener('change', function() {
    if (this.checked) {
        autoplacetraps = true;
        newSend(["ch", ["0n"]]);
    } else {
        autoplacetraps = false;
        newSend(["ch", ["0ff"]]);
    }
})

var pi = document.querySelector("#putpike")

pi.addEventListener('change', function() {
    if (this.checked) {
        pikeinsta = true;
        newSend(["ch", ["0n"]]);
    } else {
        pikeinsta = false;
        newSend(["ch", ["0ff"]]);
    }
})

var aimb = document.querySelector("#aimbot")

aimb.addEventListener('change', function() {
    if (this.checked) {
        autoaim = true;
        silentaim = true;
        newSend(["ch", ["0n"]]);
    } else {
        autoaim = false;
        silentaim = false;
        newSend(["ch", ["0ff"]]);
    }
})
} else {
    console.log('abobka228 is pro')
}