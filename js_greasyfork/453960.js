// ==UserScript==
// @name         Alpha-Ware 40 bot mod! (Patched)
// @namespace    D_Alpha
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @description  Up to 40 bots hack (more with VPN), autoheal, macros, and command keys! 
// @author       D_Alpha
// @grant        none
// @licence      MIT
// @version 0.0.1.20240222210506
// @downloadURL https://update.greasyfork.org/scripts/453960/Alpha-Ware%2040%20bot%20mod%21%20%28Patched%29.user.js
// @updateURL https://update.greasyfork.org/scripts/453960/Alpha-Ware%2040%20bot%20mod%21%20%28Patched%29.meta.js
// ==/UserScript==

let AutoAim = false;
let mouseX;
let mouseY;
let width;
let height;
let Hacks = true;
setInterval(() => {
    if(clanToggle == 1 && Hacks) {
        doNewSend(["9", [null]]);
        doNewSend(["8", [animate(false, 5)]])
    }
}, 200);

setInterval(() => {
    if(messageToggle == 1 && Hacks) {
        doNewSend(["ch", [animate(true, 5)]])
    }
}, 200);

setInterval(() => {
    if(hatToggle && Hacks) {
        if(oldHat != normalHat) {
            armor(normalHat);
        }
        if(oldAcc != normalAcc) {
            acc(normalAcc);
        }
        oldHat = normalHat;
        oldAcc = normalAcc
    }
}, 25);

function normal() {
    hat(normalHat, normalAcc);
}

let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");

var nearestEnemy;
var nearestEnemyAngle;
var isEnemyNear;
var instaSpeed = 190;
var primary;
var secondary;
var foodType;
var wallType;
var spikeType;
var millType;
var mineType;
var OGClan = [];
var boostType;
var turretType;
var spawnpadType;
var tick = 1;
var oldHat;
var oldAcc;
var enemiesNear;
var normalHat;
var normalAcc;
var ws;
var MSG = false;
var msgpack5 = msgpack;
var boostDir;
var PremiumMap = false;
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

var MHat = false;
var allMooMooObjects = {};
let healSpeed = 73;
var messageToggle = 0;
var clanToggle = 0;
let healToggle = 1;
let hatToggle = 1;
var log = true;
var heal = false;
var HealthToggle = 1;
var names = [];
var buildings = [];
var theirPrimary = [], theirSecondary = [];
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
    let moduel;
    if(temp.length > 1) {
        moduel = [temp[0], ...temp[1]];
        if (moduel[1] instanceof Array){
            moduel = moduel;
        }
    } else {
        moduel = temp;
    }
    let FunctionID = moduel[0];
    if(!moduel) {return};

    if(FunctionID === "io-init") {
        let cvs = document.getElementById("gameCanvas");
        width = cvs.clientWidth;
        height = cvs.clientHeight;
        (window).resize(function() {
            width = cvs.clientWidth;
            height = cvs.clientHeight;
        });
        cvs.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    }

    if (FunctionID == "1" && myPlayer.id == null){
        myPlayer.id = moduel[1];
    }
    if(FunctionID == "ch" && moduel[1] == myPlayer.id) {
        if ("/join " == moduel[2].substring(0, 6)) {
            var w = moduel[2].substring(6);
            doNewSend(["10", [w]]);
            setTimeout(function () {
                chat("Requested : " + w)
            }, 500)
        }
        if ("/clan " == moduel[2].substring(0, 6)) {
            var t = moduel[2].substring(6);
            doNewSend(["8", [t]]);
            setTimeout(function () {
                chat("Created : " + t)
            }, 500)
        }
        if ("/unclan" == moduel[2].substring(0, 7)) {
            if(myPlayer.clan == undefined) return setTimeout(chat("You are not in a clan"), 500);
            if(myPlayer.clan == null) return setTimeout(chat("You are not in a clan"), 500);
            OGClan = myPlayer.clan;
            doNewSend(["9", [null]]);
            setTimeout(function () {
                chat("Left : " + OGClan)
                OGClan = [];
            }, 500)
        }
        if ("/track" == moduel[2].substring(0, 6)) {
            log = !log;
            setTimeout(function () {
                chat("Player Tracker : " + log)
            }, 500)
        }
 if ("/log" == moduel[2].substring(0, 4)) {
            log = !log;
            setTimeout(function () {
                chat("Player Tracker : " + log)
            }, 500)
        }
    }
    if(FunctionID == "2" && moduel[1] != myPlayer.id && Hacks && log) {// supermod stuff
        if(null != names[moduel[1][1]]){
            if(names[moduel[1][1]] != moduel[1][2]){
                console.log("{", names[moduel[1][1]], "} => {", moduel[1][2], "} [", moduel[1][1], "]");
                chat("{" + names[moduel[1][1]] + "} => {" + moduel[1][2] + "}");
            }else{
                console.log("{", names[moduel[1][1]], "} SubtoD_Alpha");
                chat("{" + names[moduel[1][1]] + "} SubtoD_Alpha");
            }
        }else{
            console.log("{", moduel[1][2], "} [", moduel[1][1], "]");
            chat("{" + moduel[1][2] + "} [" + moduel[1][1] + "]");
            names[moduel[1][1]] = moduel[1][2];
            theirPrimary[moduel[1][1]] = 0;
            theirSecondary[moduel[1][1]] = void 0;
        }
    }
    if(FunctionID == "13" && moduel[1] != myPlayer.id && Hacks && log) { // supermod stuff
        for (var r = 0; r < buildings.length; r++) buildings[r][7] == moduel[1] && (buildings.splice(r, 1), r--);
        if(names[moduel[1]]) {
            console.log("{", names[moduel[1]], "} DidnotsubtoD_Alpha");
            chat("{" + names[moduel[1]] + "} DidnotsubtoD_Alpha");
            names[moduel[1]] = void 0;
        }else{
            console.log("[", moduel[1], "] DidnotsubtoD_Alpha");
            theirPrimary[moduel[1]] = 0;
            theirSecondary[moduel[1]] = void 0;
        }
    }
    if(FunctionID == "6") {
        for (var a = 0; a < moduel[1].length / 8; a++) {
            var i = moduel[1].slice(8 * a, 8 * a + 8);
            buildings.push(i)
        }
    }
    if (FunctionID == "33") {
        enemiesNear = [];
        for(let i = 0; i < moduel[1].length / 13; i++) {
            let playerInfo = moduel[1].slice(13*i, 13*i+13);
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
    if (enemiesNear) {
        nearestEnemy = enemiesNear.sort((a, b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
    }
    if (nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2] - myPlayer.y, nearestEnemy[1] - myPlayer.x);
        if (Math.sqrt(Math.pow((myPlayer.y - nearestEnemy[2]), 2) + Math.pow((myPlayer.x - nearestEnemy[1]), 2)) < 300) {
            isEnemyNear = true;
            if(AutoAim == false && myPlayer.hat != 7 && myPlayer.hat != 53) {
                normalHat = 6;
                if(primary != 8) {
                    normalAcc = 21;
                }
            };
        }
    }
    if(isEnemyNear == false && AutoAim == false) {
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
    update();
}
function doNewSend(sender){
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}

function storeBuy(newHat, newAcc) {
    doNewSend(["13c", [1, newHat, 0]]);
    doNewSend(["13c", [1, newAcc, 1]]);
}

function storeEquip(newHat, newAcc) {
    doNewSend(["13c", [0, newHat, 0]]);
    doNewSend(["13c", [0, 0, 1]]);
   doNewSend(["13c", [0, newAcc, 1]]);
}

function armor(id) {
    doNewSend(["13c", [0, id, 0]]);
}
function acc(id) {
    doNewSend(["13c", [0, id, 1]]);
}
function chat(string) {
    doNewSend(["ch", [string]]);
}
function hat(newHat, newAcc) {
   if(Hacks) {
    if (window.location.host == "sandbox.moomoo.io") {
        storeBuy(newHat, newAcc);
    }
    storeEquip(newHat, newAcc);
   }
}
function _place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
   if(Hacks) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
   }
}

function boostSpike() {
   if(Hacks) {
    if(boostDir == null) {
        boostDir = nearestEnemyAngle;
    }
    _place(spikeType, boostDir + toRad(90));
    _place(spikeType, boostDir - toRad(90));
    _place(boostType, boostDir);
    doNewSend(["33", [boostDir]]);
   }
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
                            console.log("claered");
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
const foodPlacer = repeater(81, () => {_place(foodType)}, 0);
const spawnPlacer = repeater(48, () => {_place(spawnpadType)}, 0);
const wallPlacer = repeater(52, () => {_place(wallType)}, 0);
const boostSpiker = repeater(71, boostSpike, 0);
document.addEventListener('keydown', (e)=>{
    foodPlacer.start(e.keyCode);
    wallPlacer.start(e.keyCode);
    spawnPlacer.start(e.keyCode);
    boostSpiker.start(e.keyCode);

    function quad(type, amount, ang) {
        for (let i = 0; i < amount; i++){
            let angle = myPlayer.dir + toRad(i * ang);
            _place(type, angle)
        }
    }
    function double(id) {
        _place(id, myPlayer.dir + toRad(45));
        _place(id, myPlayer.dir - toRad(45));
    }

    if (e.keyCode == 77 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        if (myPlayer.y < 2400){
            hat(15, 11);
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            hat(31, 11);
        } else {
            hat(12, 11);
        }
    }
    if(e.keyCode == 38 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        messageToggle = !messageToggle;
        message.count = 0;
    }
    if(e.keyCode == 40 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        clanToggle = !clanToggle;
        clan.count = 0;
    }
})

document.addEventListener('keyup', (e)=>{
    foodPlacer.stop(e.keyCode);
    spawnPlacer.stop(e.keyCode);
    wallPlacer.stop(e.keyCode);
    boostSpiker.stop(e.keyCode);
    if(e.keyCode == 71 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        setTimeout( () => {
            doNewSend(["33", [null]]);
            boostDir = null;
        }, 10);
    }
})


function isElementVisible(e) {
    return (e.offsetParent !== null);
}


function toRad(angle) {
    return angle * 0.01745329251;
}

function dist(a, b){
    return Math.sqrt( Math.pow((b.y-a[2]), 2) + Math.pow((b.x-a[1]), 2) );
}
let message = {
    count: 0,
    max: 55,
    speed: 1000,
    chats: [
        'You need to subscribe to D_Alpha',
    'you need to subscribe to D_Omega',
    'like and subscribe to D_Alpha',
    'like and sunscribe to D_Omega',
    'Sub to D_Alpha YT',
    'Sub to D_Omega YT',
    ]
};
setInterval(() => {
    if(messageToggle) {
        message.count++
        if(message.count == message.max){
            message.count = 0;
        }
    }
}, message.speed);
function makeClan(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
let clan = {
    count: 0,
    max: 5,
    speed: 0,
    chats: [makeClan(7)]
};
/*
setInterval(() => {
    if(clanToggle) {
        clan.count++
        if(clan.count == clan.max){
            clan.count = 0;
        }
    }
});
*/
function animate(space, chance) {
    let result = '';
    let characters;
    if(space) {
        characters = message.chats[message.count];
    } else {
        characters = makeClan(7);
    }
    if(space) {
        characters = characters.padStart((30 - characters.length) / 2 + characters.length)
        characters = characters.padEnd(30);
    }
    let count = 0;
    for (let i = 0; i < characters.length; i++ ) {
        if(Math.floor(Math.random() * chance) == 0 && characters.charAt(i) != "_" && count < 0 && characters.charAt(i) != "_") {
            result += "_";
            count++
        } else {
            result += characters.charAt(i);
        }
    }
    return result;
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

    for (let i=33;i<39;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString())) && i != 36){
            turretType = i - 16;
        }
    }
    spawnpadType = 36;
    for (let i=36;i<37;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            spawnpadType = i - 16;
        }
    }
}
var Progress = 0;
function loading() {
    setInterval(() => {
       if(Progress != 99) {
        Progress++
       }else{
       setTimeout(() => {
        Progress++
       },100);
       }
        $(".loadingBar").val(Progress)
    },19);
    document.getElementById("loadingText").innerHTML = '<progress id="loadingText" value="0" max="100" class="loadingBar"></progress>'
}
loading()
let AntiInvis = {}
let { rotate } = CanvasRenderingContext2D.prototype
AntiInvis.init = function() {
    AntiInvis.toggler = true
    AntiInvis.opacity = 0.7// 0.7 opacity to check for invis
    AntiInvis.invisibleAngle = 38e38
}
AntiInvis.init()
AntiInvis.getFixedDir = function(angle) {
    return Math.atan2(Math.sin(angle), Math.cos(angle))
}
AntiInvis.isAbnormalDir = function(angle) {
    if (angle <= -AntiInvis.invisibleAngle || angle >= AntiInvis.invisibleAngle) {
        return true
    }
    return false
}
AntiInvis.setOpacity = function(opacity) {
    this.globalAlpha = opacity
}
CanvasRenderingContext2D.prototype.rotate = function(angle) {
    if (AntiInvis.isAbnormalDir(angle) && AntiInvis.toggler) {
        angle = AntiInvis.getFixedDir(angle)
        AntiInvis.setOpacity.call(this, AntiInvis.opacity)
        return rotate.call(this, angle)
    }

    return rotate.apply(this, arguments)
}
var testing;
function afk(src, cb=()=>{}) {
    let s = document.createElement("SCRIPT");
    s.src = src;
    document.body.appendChild(s);
    s.onload = cb;
}
/*
afk("https://eight-evening-slug.glitch.me/moomoo.js", () => {
    //ScriptWorker();
});*/
var DisableKeys = false;
document.title = "a";
let Wish = 0;
let Fixed = [];
document.rarar = 15;
let CPS = 1;
let Nighte = 0;
let Spinner = true;
let AutoPlace = false;
let AutoHeal = true
let InvisProj = true;
let InvisItem = true;
let AssassinGear = false;
let AutoBreak = true;
let Aim360 = false;
let HatLoop = false;
let Mill = {x: null, y: null, z: false, k: null};
let UI = true;
let qMode = false;

!(function(e) {
    var t = {};

    function n(i) {
        if (t[i]) return t[i].exports;
        var r = (t[i] = {
            i: i,
            l: !1,
            exports: {}
        });
        return e[i].call(r.exports, r, r.exports, n), (r.l = !0), r.exports;
    }
    (n.m = e),
        (n.c = t),
        (n.d = function(e, t, i) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: i
        });
    }),
        (n.r = function(e) {
        "undefined" != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
            Object.defineProperty(e, "__esModule", {
            value: !0
        });
    }),
        (n.t = function(e, t) {
        if ((1 & t && (e = n(e)), 8 & t)) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var i = Object.create(null);
        if (
            (n.r(i),
             Object.defineProperty(i, "default", {
                enumerable: !0,
                value: e
            }),
             2 & t && "string" != typeof e)
        )
            for (var r in e)
                n.d(
                    i,
                    r,
                    function(t) {
                        return e[t];
                    }.bind(null, r),
                );
        return i;
    }),
        (n.n = function(e) {
        var t =
            e && e.__esModule ?
            function() {
                return e.default;
            } :
        function() {
            return e;
        };
        return n.d(t, "a", t), t;
    }),
        (n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }),
        (n.p = ""),
        n((n.s = 21));
})([
    function(e, t, n) {
        var i = (t.global = n(25)),
            r = (t.hasBuffer = i && !!i.isBuffer),
            s = (t.hasArrayBuffer = "undefined" != typeof ArrayBuffer),
            a = (t.isArray = n(5));
        t.isArrayBuffer = s ?
            function(e) {
            return e instanceof ArrayBuffer || p(e);
        } :
        m;
        var o = (t.isBuffer = r ? i.isBuffer : m),
            c = (t.isView = s ? ArrayBuffer.isView || y("ArrayBuffer", "buffer") : m);
        (t.alloc = d),
            (t.concat = function(e, n) {
            n ||
                ((n = 0),
                 Array.prototype.forEach.call(e, function(e) {
                n += e.length;
            }));
            var i = (this !== t && this) || e[0],
                r = d.call(i, n),
                s = 0;
            return (
                Array.prototype.forEach.call(e, function(e) {
                    s += f.copy.call(e, r, s);
                }),
                r
            );
        }),
            (t.from = function(e) {
            return "string" == typeof e ?
                function(e) {
                var t = 3 * e.length,
                    n = d.call(this, t),
                    i = f.write.call(n, e);
                return t !== i && (n = f.slice.call(n, 0, i)), n;
            }.call(this, e) :
            g(this).from(e);
        });
        var l = (t.Array = n(28)),
            h = (t.Buffer = n(29)),
            u = (t.Uint8Array = n(30)),
            f = (t.prototype = n(6));

        function d(e) {
            return g(this).alloc(e);
        }
        var p = y("ArrayBuffer");

        function g(e) {
            return o(e) ? h : c(e) ? u : a(e) ? l : r ? h : s ? u : l;
        }

        function m() {
            return !1;
        }

        function y(e, t) {
            return (
                (e = "[object " + e + "]"),
                function(n) {
                    return null != n && {}.toString.call(t ? n[t] : n) === e;
                }
            );
        }
    },
    function(e, t, n) {
        var i = n(5);
        (t.createCodec = o),
            (t.install = function(e) {
            for (var t in e) s.prototype[t] = a(s.prototype[t], e[t]);
        }),
            (t.filter = function(e) {
            return i(e) ?
                (function(e) {
                return (
                    (e = e.slice()),
                    function(n) {
                        return e.reduce(t, n);
                    }
                );

                function t(e, t) {
                    return t(e);
                }
            })(e) :
            e;
        });
        var r = n(0);

        function s(e) {
            if (!(this instanceof s)) return new s(e);
            (this.options = e), this.init();
        }

        function a(e, t) {
            return e && t ?
                function() {
                return e.apply(this, arguments), t.apply(this, arguments);
            } :
            e || t;
        }

        function o(e) {
            return new s(e);
        }
        (s.prototype.init = function() {
            var e = this.options;
            return e && e.uint8array && (this.bufferish = r.Uint8Array), this;
        }),
            (t.preset = o({
            preset: !0
        }));
    },
    function(e, t, n) {
        var i = n(3).ExtBuffer,
            r = n(32),
            s = n(33),
            a = n(1);

        function o() {
            var e = this.options;
            return (
                (this.encode = (function(e) {
                    var t = s.getWriteType(e);
                    return function(e, n) {
                        var i = t[typeof n];
                        if (!i)
                            throw new Error('Unsupported type "' + typeof n + '": ' + n);
                        i(e, n);
                    };
                })(e)),
                e && e.preset && r.setExtPackers(this),
                this
            );
        }
        a.install({
            addExtPacker: function(e, t, n) {
                n = a.filter(n);
                var r = t.name;
                r && "Object" !== r ?
                    ((this.extPackers || (this.extPackers = {}))[r] = s) :
                (this.extEncoderList || (this.extEncoderList = [])).unshift([t, s]);

                function s(t) {
                    return n && (t = n(t)), new i(t, e);
                }
            },
            getExtPacker: function(e) {
                var t = this.extPackers || (this.extPackers = {}),
                    n = e.constructor,
                    i = n && n.name && t[n.name];
                if (i) return i;
                for (
                    var r = this.extEncoderList || (this.extEncoderList = []),
                    s = r.length,
                    a = 0; a < s; a++
                ) {
                    var o = r[a];
                    if (n === o[0]) return o[1];
                }
            },
            init: o,
        }),
            (t.preset = o.call(a.preset));
    },
    function(e, t, n) {
        t.ExtBuffer = function e(t, n) {
            if (!(this instanceof e)) return new e(t, n);
            (this.buffer = i.from(t)), (this.type = n);
        };
        var i = n(0);
    },
    function(e, t) {
        (t.read = function(e, t, n, i, r) {
            var s,
                a,
                o = 8 * r - i - 1,
                c = (1 << o) - 1,
                l = c >> 1,
                h = -7,
                u = n ? r - 1 : 0,
                f = n ? -1 : 1,
                d = e[t + u];
            for (
                u += f, s = d & ((1 << -h) - 1), d >>= -h, h += o; h > 0; s = 256 * s + e[t + u], u += f, h -= 8
            );
            for (
                a = s & ((1 << -h) - 1), s >>= -h, h += i; h > 0; a = 256 * a + e[t + u], u += f, h -= 8
            );
            if (0 === s) s = 1 - l;
            else {
                if (s === c) return a ? NaN : (1 / 0) * (d ? -1 : 1);
                (a += Math.pow(2, i)), (s -= l);
            }
            return (d ? -1 : 1) * a * Math.pow(2, s - i);
        }),
            (t.write = function(e, t, n, i, r, s) {
            var a,
                o,
                c,
                l = 8 * s - r - 1,
                h = (1 << l) - 1,
                u = h >> 1,
                f = 23 === r ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                d = i ? 0 : s - 1,
                p = i ? 1 : -1,
                g = t < 0 || (0 === t && 1 / t < 0) ? 1 : 0;
            for (
                t = Math.abs(t),
                isNaN(t) || t === 1 / 0 ?
                ((o = isNaN(t) ? 1 : 0), (a = h)) :
                ((a = Math.floor(Math.log(t) / Math.LN2)),
                 t * (c = Math.pow(2, -a)) < 1 && (a--, (c *= 2)),
                 (t += a + u >= 1 ? f / c : f * Math.pow(2, 1 - u)) * c >= 2 &&
                 (a++, (c /= 2)),
                 a + u >= h ?
                 ((o = 0), (a = h)) :
                 a + u >= 1 ?
                 ((o = (t * c - 1) * Math.pow(2, r)), (a += u)) :
                 ((o = t * Math.pow(2, u - 1) * Math.pow(2, r)), (a = 0))); r >= 8; e[n + d] = 255 & o, d += p, o /= 256, r -= 8
            );
            for (
                a = (a << r) | o, l += r; l > 0; e[n + d] = 255 & a, d += p, a /= 256, l -= 8
            );
            e[n + d - p] |= 128 * g;
        });
    },
    function(e, t) {
        var n = {}.toString;
        e.exports =
            Array.isArray ||
            function(e) {
            return "[object Array]" == n.call(e);
        };
    },
    function(e, t, n) {
        var i = n(31);
        (t.copy = c),
            (t.slice = l),
            (t.toString = function(e, t, n) {
            return (!a && r.isBuffer(this) ? this.toString : i.toString).apply(
                this,
                arguments,
            );
        }),
            (t.write = (function(e) {
            return function() {
                return (this[e] || i[e]).apply(this, arguments);
            };
        })("write"));
        var r = n(0),
            s = r.global,
            a = r.hasBuffer && "TYPED_ARRAY_SUPPORT" in s,
            o = a && !s.TYPED_ARRAY_SUPPORT;

        function c(e, t, n, s) {
            var a = r.isBuffer(this),
                c = r.isBuffer(e);
            if (a && c) return this.copy(e, t, n, s);
            if (o || a || c || !r.isView(this) || !r.isView(e))
                return i.copy.call(this, e, t, n, s);
            var h = n || null != s ? l.call(this, n, s) : this;
            return e.set(h, t), h.length;
        }

        function l(e, t) {
            var n = this.slice || (!o && this.subarray);
            if (n) return n.call(this, e, t);
            var i = r.alloc.call(this, t - e);
            return c.call(this, i, 0, e, t), i;
        }
    },
    function(e, t, n) {
        (function(e) {
            !(function(t) {
                var n,
                    i = "undefined",
                    r = i !== typeof e && e,
                    s = i !== typeof Uint8Array && Uint8Array,
                    a = i !== typeof ArrayBuffer && ArrayBuffer,
                    o = [0, 0, 0, 0, 0, 0, 0, 0],
                    c =
                    Array.isArray ||
                    function(e) {
                        return (
                            !!e && "[object Array]" == Object.prototype.toString.call(e)
                        );
                    },
                    l = 4294967296;

                function h(e, c, h) {
                    var b = c ? 0 : 4,
                        x = c ? 4 : 0,
                        S = c ? 0 : 3,
                        T = c ? 1 : 2,
                        I = c ? 2 : 1,
                        E = c ? 3 : 0,
                        M = c ? y : v,
                        A = c ? k : w,
                        P = O.prototype,
                        B = "is" + e,
                        C = "_" + B;
                    return (
                        (P.buffer = void 0),
                        (P.offset = 0),
                        (P[C] = !0),
                        (P.toNumber = R),
                        (P.toString = function(e) {
                            var t = this.buffer,
                                n = this.offset,
                                i = _(t, n + b),
                                r = _(t, n + x),
                                s = "",
                                a = !h && 2147483648 & i;
                            for (a && ((i = ~i), (r = l - r)), e = e || 10;;) {
                                var o = (i % e) * l + r;
                                if (
                                    ((i = Math.floor(i / e)),
                                     (r = Math.floor(o / e)),
                                     (s = (o % e).toString(e) + s),
                                     !i && !r)
                                )
                                    break;
                            }
                            return a && (s = "-" + s), s;
                        }),
                        (P.toJSON = R),
                        (P.toArray = u),
                        r && (P.toBuffer = f),
                        s && (P.toArrayBuffer = d),
                        (O[B] = function(e) {
                            return !(!e || !e[C]);
                        }),
                        (t[e] = O),
                        O
                    );

                    function O(e, t, r, c) {
                        return this instanceof O ?
                            (function(e, t, r, c, h) {
                            if (
                                (s &&
                                 a &&
                                 (t instanceof a && (t = new s(t)),
                                  c instanceof a && (c = new s(c))),
                                 t || r || c || n)
                            ) {
                                if (!p(t, r))
                                    (h = r), (c = t), (r = 0), (t = new(n || Array)(8));
                                (e.buffer = t),
                                    (e.offset = r |= 0),
                                    i !== typeof c &&
                                    ("string" == typeof c ?
                                     (function(e, t, n, i) {
                                    var r = 0,
                                        s = n.length,
                                        a = 0,
                                        o = 0;
                                    "-" === n[0] && r++;
                                    for (var c = r; r < s;) {
                                        var h = parseInt(n[r++], i);
                                        if (!(h >= 0)) break;
                                        (o = o * i + h),
                                            (a = a * i + Math.floor(o / l)),
                                            (o %= l);
                                    }
                                    c && ((a = ~a), o ? (o = l - o) : a++),
                                        j(e, t + b, a),
                                        j(e, t + x, o);
                                })(t, r, c, h || 10) :
                                     p(c, h) ?
                                     g(t, r, c, h) :
                                     "number" == typeof h ?
                                     (j(t, r + b, c), j(t, r + x, h)) :
                                     c > 0 ?
                                     M(t, r, c) :
                                     c < 0 ?
                                     A(t, r, c) :
                                     g(t, r, o, 0));
                            } else e.buffer = m(o, 0);
                        })(this, e, t, r, c) :
                        new O(e, t, r, c);
                    }

                    function R() {
                        var e = this.buffer,
                            t = this.offset,
                            n = _(e, t + b),
                            i = _(e, t + x);
                        return h || (n |= 0), n ? n * l + i : i;
                    }

                    function j(e, t, n) {
                        (e[t + E] = 255 & n),
                            (n >>= 8),
                            (e[t + I] = 255 & n),
                            (n >>= 8),
                            (e[t + T] = 255 & n),
                            (n >>= 8),
                            (e[t + S] = 255 & n);
                    }

                    function _(e, t) {
                        return (
                            16777216 * e[t + S] +
                            (e[t + T] << 16) +
                            (e[t + I] << 8) +
                            e[t + E]
                        );
                    }
                }

                function u(e) {
                    var t = this.buffer,
                        i = this.offset;
                    return (
                        (n = null),
                        !1 !== e && 0 === i && 8 === t.length && c(t) ? t : m(t, i)
                    );
                }

                function f(t) {
                    var i = this.buffer,
                        s = this.offset;
                    if (((n = r), !1 !== t && 0 === s && 8 === i.length && e.isBuffer(i)))
                        return i;
                    var a = new r(8);
                    return g(a, 0, i, s), a;
                }

                function d(e) {
                    var t = this.buffer,
                        i = this.offset,
                        r = t.buffer;
                    if (
                        ((n = s),
                         !1 !== e && 0 === i && r instanceof a && 8 === r.byteLength)
                    )
                        return r;
                    var o = new s(8);
                    return g(o, 0, t, i), o.buffer;
                }

                function p(e, t) {
                    var n = e && e.length;
                    return (t |= 0), n && t + 8 <= n && "string" != typeof e[t];
                }

                function g(e, t, n, i) {
                    (t |= 0), (i |= 0);
                    for (var r = 0; r < 8; r++) e[t++] = 255 & n[i++];
                }

                function m(e, t) {
                    return Array.prototype.slice.call(e, t, t + 8);
                }

                function y(e, t, n) {
                    for (var i = t + 8; i > t;)(e[--i] = 255 & n), (n /= 256);
                }

                function k(e, t, n) {
                    var i = t + 8;
                    for (n++; i > t;)(e[--i] = (255 & -n) ^ 255), (n /= 256);
                }

                function v(e, t, n) {
                    for (var i = t + 8; t < i;)(e[t++] = 255 & n), (n /= 256);
                }

                function w(e, t, n) {
                    var i = t + 8;
                    for (n++; t < i;)(e[t++] = (255 & -n) ^ 255), (n /= 256);
                }
                h("Uint64BE", !0, !0),
                    h("Int64BE", !0, !1),
                    h("Uint64LE", !1, !0),
                    h("Int64LE", !1, !1);
            })("string" != typeof t.nodeName ? t : this || {});
        }.call(this, n(11).Buffer));
    },
    function(e, t, n) {
        var i = n(3).ExtBuffer,
            r = n(35),
            s = n(17).readUint8,
            a = n(36),
            o = n(1);

        function c() {
            var e = this.options;
            return (
                (this.decode = (function(e) {
                    var t = a.getReadToken(e);
                    return function(e) {
                        var n = s(e),
                            i = t[n];
                        if (!i)
                            throw new Error(
                                "Invalid type: " + (n ? "0x" + n.toString(16) : n),
                            );
                        return i(e);
                    };
                })(e)),
                e && e.preset && r.setExtUnpackers(this),
                this
            );
        }
        o.install({
            addExtUnpacker: function(e, t) {
                (this.extUnpackers || (this.extUnpackers = []))[e] = o.filter(t);
            },
            getExtUnpacker: function(e) {
                return (
                    (this.extUnpackers || (this.extUnpackers = []))[e] ||
                    function(t) {
                        return new i(t, e);
                    }
                );
            },
            init: c,
        }),
            (t.preset = c.call(o.preset));
    },
    function(e, t, n) {
        t.encode = function(e, t) {
            var n = new i(t);
            return n.write(e), n.read();
        };
        var i = n(10).EncodeBuffer;
    },
    function(e, t, n) {
        t.EncodeBuffer = r;
        var i = n(2).preset;

        function r(e) {
            if (!(this instanceof r)) return new r(e);
            if (e && ((this.options = e), e.codec)) {
                var t = (this.codec = e.codec);
                t.bufferish && (this.bufferish = t.bufferish);
            }
        }
        n(14).FlexEncoder.mixin(r.prototype),
            (r.prototype.codec = i),
            (r.prototype.write = function(e) {
            this.codec.encode(this, e);
        });
    },
    function(e, t, n) {
        "use strict";
        (function(e) {
            /*!
             * The buffer module from node.js, for the browser.
             *
             * @author   Feross Aboukhadijeh <http://feross.org>
             * @license  MIT
             */
            var i = n(26),
                r = n(4),
                s = n(27);

            function a() {
                return c.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
            }

            function o(e, t) {
                if (a() < t) throw new RangeError("Invalid typed array length");
                return (
                    c.TYPED_ARRAY_SUPPORT ?
                    ((e = new Uint8Array(t)).__proto__ = c.prototype) :
                    (null === e && (e = new c(t)), (e.length = t)),
                    e
                );
            }

            function c(e, t, n) {
                if (!(c.TYPED_ARRAY_SUPPORT || this instanceof c))
                    return new c(e, t, n);
                if ("number" == typeof e) {
                    if ("string" == typeof t)
                        throw new Error(
                            "If encoding is specified then the first argument must be a string",
                        );
                    return u(this, e);
                }
                return l(this, e, t, n);
            }

            function l(e, t, n, i) {
                if ("number" == typeof t)
                    throw new TypeError('"value" argument must not be a number');
                return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ?
                    (function(e, t, n, i) {
                    if ((t.byteLength, n < 0 || t.byteLength < n))
                        throw new RangeError("'offset' is out of bounds");
                    if (t.byteLength < n + (i || 0))
                        throw new RangeError("'length' is out of bounds");
                    return (
                        (t =
                         void 0 === n && void 0 === i ?
                         new Uint8Array(t) :
                         void 0 === i ?
                         new Uint8Array(t, n) :
                         new Uint8Array(t, n, i)),
                        c.TYPED_ARRAY_SUPPORT ?
                        ((e = t).__proto__ = c.prototype) :
                        (e = f(e, t)),
                        e
                    );
                })(e, t, n, i) :
                "string" == typeof t ?
                    (function(e, t, n) {
                    if (
                        (("string" == typeof n && "" !== n) || (n = "utf8"),
                         !c.isEncoding(n))
                    )
                        throw new TypeError(
                            '"encoding" must be a valid string encoding',
                        );
                    var i = 0 | p(t, n),
                        r = (e = o(e, i)).write(t, n);
                    return r !== i && (e = e.slice(0, r)), e;
                })(e, t, n) :
                (function(e, t) {
                    if (c.isBuffer(t)) {
                        var n = 0 | d(t.length);
                        return 0 === (e = o(e, n)).length || t.copy(e, 0, 0, n), e;
                    }
                    if (t) {
                        if (
                            ("undefined" != typeof ArrayBuffer &&
                             t.buffer instanceof ArrayBuffer) ||
                            "length" in t
                        )
                            return "number" != typeof t.length ||
                                (function(e) {
                                return e != e;
                            })(t.length) ?
                                o(e, 0) :
                            f(e, t);
                        if ("Buffer" === t.type && s(t.data)) return f(e, t.data);
                    }
                    throw new TypeError(
                        "First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.",
                    );
                })(e, t);
            }

            function h(e) {
                if ("number" != typeof e)
                    throw new TypeError('"size" argument must be a number');
                if (e < 0) throw new RangeError('"size" argument must not be negative');
            }

            function u(e, t) {
                if ((h(t), (e = o(e, t < 0 ? 0 : 0 | d(t))), !c.TYPED_ARRAY_SUPPORT))
                    for (var n = 0; n < t; ++n) e[n] = 0;
                return e;
            }

            function f(e, t) {
                var n = t.length < 0 ? 0 : 0 | d(t.length);
                e = o(e, n);
                for (var i = 0; i < n; i += 1) e[i] = 255 & t[i];
                return e;
            }

            function d(e) {
                if (e >= a())
                    throw new RangeError(
                        "Attempt to allocate Buffer larger than maximum size: 0x" +
                        a().toString(16) +
                        " bytes",
                    );
                return 0 | e;
            }

            function p(e, t) {
                if (c.isBuffer(e)) return e.length;
                if (
                    "undefined" != typeof ArrayBuffer &&
                    "function" == typeof ArrayBuffer.isView &&
                    (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)
                )
                    return e.byteLength;
                "string" != typeof e && (e = "" + e);
                var n = e.length;
                if (0 === n) return 0;
                for (var i = !1;;)
                    switch (t) {
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return n;
                        case "utf8":
                        case "utf-8":
                        case void 0:
                            return z(e).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return 2 * n;
                        case "hex":
                            return n >>> 1;
                        case "base64":
                            return H(e).length;
                        default:
                            if (i) return z(e).length;
                            (t = ("" + t).toLowerCase()), (i = !0);
                    }
            }

            function g(e, t, n) {
                var i = e[t];
                (e[t] = e[n]), (e[n] = i);
            }

            function m(e, t, n, i, r) {
                if (0 === e.length) return -1;
                if (
                    ("string" == typeof n ?
                     ((i = n), (n = 0)) :
                     n > 2147483647 ?
                     (n = 2147483647) :
                     n < -2147483648 && (n = -2147483648),
                     (n = +n),
                     isNaN(n) && (n = r ? 0 : e.length - 1),
                     n < 0 && (n = e.length + n),
                     n >= e.length)
                ) {
                    if (r) return -1;
                    n = e.length - 1;
                } else if (n < 0) {
                    if (!r) return -1;
                    n = 0;
                }
                if (("string" == typeof t && (t = c.from(t, i)), c.isBuffer(t)))
                    return 0 === t.length ? -1 : y(e, t, n, i, r);
                if ("number" == typeof t)
                    return (
                        (t &= 255),
                        c.TYPED_ARRAY_SUPPORT &&
                        "function" == typeof Uint8Array.prototype.indexOf ?
                        r ?
                        Uint8Array.prototype.indexOf.call(e, t, n) :
                        Uint8Array.prototype.lastIndexOf.call(e, t, n) :
                        y(e, [t], n, i, r)
                    );
                throw new TypeError("val must be string, number or Buffer");
            }

            function y(e, t, n, i, r) {
                var s,
                    a = 1,
                    o = e.length,
                    c = t.length;
                if (
                    void 0 !== i &&
                    ("ucs2" === (i = String(i).toLowerCase()) ||
                     "ucs-2" === i ||
                     "utf16le" === i ||
                     "utf-16le" === i)
                ) {
                    if (e.length < 2 || t.length < 2) return -1;
                    (a = 2), (o /= 2), (c /= 2), (n /= 2);
                }

                function l(e, t) {
                    return 1 === a ? e[t] : e.readUInt16BE(t * a);
                }
                if (r) {
                    var h = -1;
                    for (s = n; s < o; s++)
                        if (l(e, s) === l(t, -1 === h ? 0 : s - h)) {
                            if ((-1 === h && (h = s), s - h + 1 === c)) return h * a;
                        } else -1 !== h && (s -= s - h), (h = -1);
                } else
                    for (n + c > o && (n = o - c), s = n; s >= 0; s--) {
                        for (var u = !0, f = 0; f < c; f++)
                            if (l(e, s + f) !== l(t, f)) {
                                u = !1;
                                break;
                            }
                        if (u) return s;
                    }
                return -1;
            }

            function k(e, t, n, i) {
                n = Number(n) || 0;
                var r = e.length - n;
                i ? (i = Number(i)) > r && (i = r) : (i = r);
                var s = t.length;
                if (s % 2 != 0) throw new TypeError("Invalid hex string");
                i > s / 2 && (i = s / 2);
                for (var a = 0; a < i; ++a) {
                    var o = parseInt(t.substr(2 * a, 2), 16);
                    if (isNaN(o)) return a;
                    e[n + a] = o;
                }
                return a;
            }

            function v(e, t, n, i) {
                return V(z(t, e.length - n), e, n, i);
            }

            function w(e, t, n, i) {
                return V(
                    (function(e) {
                        for (var t = [], n = 0; n < e.length; ++n)
                            t.push(255 & e.charCodeAt(n));
                        return t;
                    })(t),
                    e,
                    n,
                    i,
                );
            }

            function b(e, t, n, i) {
                return w(e, t, n, i);
            }

            function x(e, t, n, i) {
                return V(H(t), e, n, i);
            }

            function S(e, t, n, i) {
                return V(
                    (function(e, t) {
                        for (
                            var n, i, r, s = [], a = 0; a < e.length && !((t -= 2) < 0);
                            ++a
                        )
                            (i = (n = e.charCodeAt(a)) >> 8),
                                (r = n % 256),
                                s.push(r),
                                s.push(i);
                        return s;
                    })(t, e.length - n),
                    e,
                    n,
                    i,
                );
            }

            function T(e, t, n) {
                return 0 === t && n === e.length ?
                    i.fromByteArray(e) :
                i.fromByteArray(e.slice(t, n));
            }

            function I(e, t, n) {
                n = Math.min(e.length, n);
                for (var i = [], r = t; r < n;) {
                    var s,
                        a,
                        o,
                        c,
                        l = e[r],
                        h = null,
                        u = l > 239 ? 4 : l > 223 ? 3 : l > 191 ? 2 : 1;
                    if (r + u <= n)
                        switch (u) {
                            case 1:
                                l < 128 && (h = l);
                                break;
                            case 2:
                                128 == (192 & (s = e[r + 1])) &&
                                    (c = ((31 & l) << 6) | (63 & s)) > 127 &&
                                    (h = c);
                                break;
                            case 3:
                                (s = e[r + 1]),
                                    (a = e[r + 2]),
                                    128 == (192 & s) &&
                                    128 == (192 & a) &&
                                    (c = ((15 & l) << 12) | ((63 & s) << 6) | (63 & a)) >
                                    2047 &&
                                    (c < 55296 || c > 57343) &&
                                    (h = c);
                                break;
                            case 4:
                                (s = e[r + 1]),
                                    (a = e[r + 2]),
                                    (o = e[r + 3]),
                                    128 == (192 & s) &&
                                    128 == (192 & a) &&
                                    128 == (192 & o) &&
                                    (c =
                                     ((15 & l) << 18) |
                                     ((63 & s) << 12) |
                                     ((63 & a) << 6) |
                                     (63 & o)) > 65535 &&
                                    c < 1114112 &&
                                    (h = c);
                        }
                    null === h ?
                        ((h = 65533), (u = 1)) :
                    h > 65535 &&
                        ((h -= 65536),
                         i.push(((h >>> 10) & 1023) | 55296),
                         (h = 56320 | (1023 & h))),
                        i.push(h),
                        (r += u);
                }
                return (function(e) {
                    var t = e.length;
                    if (t <= E) return String.fromCharCode.apply(String, e);
                    for (var n = "", i = 0; i < t;)
                        n += String.fromCharCode.apply(String, e.slice(i, (i += E)));
                    return n;
                })(i);
            }
            (t.Buffer = c),
                (t.SlowBuffer = function(e) {
                return +e != e && (e = 0), c.alloc(+e);
            }),
                (t.INSPECT_MAX_BYTES = 50),
                (c.TYPED_ARRAY_SUPPORT =
                 void 0 !== e.TYPED_ARRAY_SUPPORT ?
                 e.TYPED_ARRAY_SUPPORT :
                 (function() {
                try {
                    var e = new Uint8Array(1);
                    return (
                        (e.__proto__ = {
                            __proto__: Uint8Array.prototype,
                            foo: function() {
                                return 42;
                            },
                        }),
                        42 === e.foo() &&
                        "function" == typeof e.subarray &&
                        0 === e.subarray(1, 1).byteLength
                    );
                } catch (e) {
                    return !1;
                }
            })()),
                (t.kMaxLength = a()),
                (c.poolSize = 8192),
                (c._augment = function(e) {
                return (e.__proto__ = c.prototype), e;
            }),
                (c.from = function(e, t, n) {
                return l(null, e, t, n);
            }),
                c.TYPED_ARRAY_SUPPORT &&
                ((c.prototype.__proto__ = Uint8Array.prototype),
                 (c.__proto__ = Uint8Array),
                 "undefined" != typeof Symbol &&
                 Symbol.species &&
                 c[Symbol.species] === c &&
                 Object.defineProperty(c, Symbol.species, {
                value: null,
                configurable: !0,
            })),
                (c.alloc = function(e, t, n) {
                return (function(e, t, n, i) {
                    return (
                        h(t),
                        t <= 0 ?
                        o(e, t) :
                        void 0 !== n ?
                        "string" == typeof i ?
                        o(e, t).fill(n, i) :
                        o(e, t).fill(n) :
                        o(e, t)
                    );
                })(null, e, t, n);
            }),
                (c.allocUnsafe = function(e) {
                return u(null, e);
            }),
                (c.allocUnsafeSlow = function(e) {
                return u(null, e);
            }),
                (c.isBuffer = function(e) {
                return !(null == e || !e._isBuffer);
            }),
                (c.compare = function(e, t) {
                if (!c.isBuffer(e) || !c.isBuffer(t))
                    throw new TypeError("Arguments must be Buffers");
                if (e === t) return 0;
                for (
                    var n = e.length, i = t.length, r = 0, s = Math.min(n, i); r < s;
                    ++r
                )
                    if (e[r] !== t[r]) {
                        (n = e[r]), (i = t[r]);
                        break;
                    }
                return n < i ? -1 : i < n ? 1 : 0;
            }),
                (c.isEncoding = function(e) {
                switch (String(e).toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "latin1":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return !0;
                    default:
                        return !1;
                }
            }),
                (c.concat = function(e, t) {
                if (!s(e))
                    throw new TypeError('"list" argument must be an Array of Buffers');
                if (0 === e.length) return c.alloc(0);
                var n;
                if (void 0 === t)
                    for (t = 0, n = 0; n < e.length; ++n) t += e[n].length;
                var i = c.allocUnsafe(t),
                    r = 0;
                for (n = 0; n < e.length; ++n) {
                    var a = e[n];
                    if (!c.isBuffer(a))
                        throw new TypeError(
                            '"list" argument must be an Array of Buffers',
                        );
                    a.copy(i, r), (r += a.length);
                }
                return i;
            }),
                (c.byteLength = p),
                (c.prototype._isBuffer = !0),
                (c.prototype.swap16 = function() {
                var e = this.length;
                if (e % 2 != 0)
                    throw new RangeError("Buffer size must be a multiple of 16-bits");
                for (var t = 0; t < e; t += 2) g(this, t, t + 1);
                return this;
            }),
                (c.prototype.swap32 = function() {
                var e = this.length;
                if (e % 4 != 0)
                    throw new RangeError("Buffer size must be a multiple of 32-bits");
                for (var t = 0; t < e; t += 4)
                    g(this, t, t + 3), g(this, t + 1, t + 2);
                return this;
            }),
                (c.prototype.swap64 = function() {
                var e = this.length;
                if (e % 8 != 0)
                    throw new RangeError("Buffer size must be a multiple of 64-bits");
                for (var t = 0; t < e; t += 8)
                    g(this, t, t + 7),
                        g(this, t + 1, t + 6),
                        g(this, t + 2, t + 5),
                        g(this, t + 3, t + 4);
                return this;
            }),
                (c.prototype.toString = function() {
                var e = 0 | this.length;
                return 0 === e ?
                    "" :
                0 === arguments.length ?
                    I(this, 0, e) :
                function(e, t, n) {
                    var i = !1;
                    if (((void 0 === t || t < 0) && (t = 0), t > this.length))
                        return "";
                    if (
                        ((void 0 === n || n > this.length) && (n = this.length),
                         n <= 0)
                    )
                        return "";
                    if ((n >>>= 0) <= (t >>>= 0)) return "";
                    for (e || (e = "utf8");;)
                        switch (e) {
                            case "hex":
                                return P(this, t, n);
                            case "utf8":
                            case "utf-8":
                                return I(this, t, n);
                            case "ascii":
                                return M(this, t, n);
                            case "latin1":
                            case "binary":
                                return A(this, t, n);
                            case "base64":
                                return T(this, t, n);
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return B(this, t, n);
                            default:
                                if (i) throw new TypeError("Unknown encoding: " + e);
                                (e = (e + "").toLowerCase()), (i = !0);
                        }
                }.apply(this, arguments);
            }),
                (c.prototype.equals = function(e) {
                if (!c.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                return this === e || 0 === c.compare(this, e);
            }),
                (c.prototype.inspect = function() {
                var e = "",
                    n = t.INSPECT_MAX_BYTES;
                return (
                    this.length > 0 &&
                    ((e = this.toString("hex", 0, n).match(/.{2}/g).join(" ")),
                     this.length > n && (e += " ... ")),
                    "<Buffer " + e + ">"
                );
            }),
                (c.prototype.compare = function(e, t, n, i, r) {
                if (!c.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                if (
                    (void 0 === t && (t = 0),
                     void 0 === n && (n = e ? e.length : 0),
                     void 0 === i && (i = 0),
                     void 0 === r && (r = this.length),
                     t < 0 || n > e.length || i < 0 || r > this.length)
                )
                    throw new RangeError("out of range index");
                if (i >= r && t >= n) return 0;
                if (i >= r) return -1;
                if (t >= n) return 1;
                if (this === e) return 0;
                for (
                    var s = (r >>>= 0) - (i >>>= 0),
                    a = (n >>>= 0) - (t >>>= 0),
                    o = Math.min(s, a),
                    l = this.slice(i, r),
                    h = e.slice(t, n),
                    u = 0; u < o;
                    ++u
                )
                    if (l[u] !== h[u]) {
                        (s = l[u]), (a = h[u]);
                        break;
                    }
                return s < a ? -1 : a < s ? 1 : 0;
            }),
                (c.prototype.includes = function(e, t, n) {
                return -1 !== this.indexOf(e, t, n);
            }),
                (c.prototype.indexOf = function(e, t, n) {
                return m(this, e, t, n, !0);
            }),
                (c.prototype.lastIndexOf = function(e, t, n) {
                return m(this, e, t, n, !1);
            }),
                (c.prototype.write = function(e, t, n, i) {
                if (void 0 === t)(i = "utf8"), (n = this.length), (t = 0);
                else if (void 0 === n && "string" == typeof t)
                    (i = t), (n = this.length), (t = 0);
                else {
                    if (!isFinite(t))
                        throw new Error(
                            "Buffer.write(string, encoding, offset[, length]) is no longer supported",
                        );
                    (t |= 0),
                        isFinite(n) ?
                        ((n |= 0), void 0 === i && (i = "utf8")) :
                    ((i = n), (n = void 0));
                }
                var r = this.length - t;
                if (
                    ((void 0 === n || n > r) && (n = r),
                     (e.length > 0 && (n < 0 || t < 0)) || t > this.length)
                )
                    throw new RangeError("Attempt to write outside buffer bounds");
                i || (i = "utf8");
                for (var s = !1;;)
                    switch (i) {
                        case "hex":
                            return k(this, e, t, n);
                        case "utf8":
                        case "utf-8":
                            return v(this, e, t, n);
                        case "ascii":
                            return w(this, e, t, n);
                        case "latin1":
                        case "binary":
                            return b(this, e, t, n);
                        case "base64":
                            return x(this, e, t, n);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return S(this, e, t, n);
                        default:
                            if (s) throw new TypeError("Unknown encoding: " + i);
                            (i = ("" + i).toLowerCase()), (s = !0);
                    }
            }),
                (c.prototype.toJSON = function() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0),
                };
            });
            var E = 4096;

            function M(e, t, n) {
                var i = "";
                n = Math.min(e.length, n);
                for (var r = t; r < n; ++r) i += String.fromCharCode(127 & e[r]);
                return i;
            }

            function A(e, t, n) {
                var i = "";
                n = Math.min(e.length, n);
                for (var r = t; r < n; ++r) i += String.fromCharCode(e[r]);
                return i;
            }

            function P(e, t, n) {
                var i = e.length;
                (!t || t < 0) && (t = 0), (!n || n < 0 || n > i) && (n = i);
                for (var r = "", s = t; s < n; ++s) r += F(e[s]);
                return r;
            }

            function B(e, t, n) {
                for (var i = e.slice(t, n), r = "", s = 0; s < i.length; s += 2)
                    r += String.fromCharCode(i[s] + 256 * i[s + 1]);
                return r;
            }

            function C(e, t, n) {
                if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
                if (e + t > n)
                    throw new RangeError("Trying to access beyond buffer length");
            }

            function O(e, t, n, i, r, s) {
                if (!c.isBuffer(e))
                    throw new TypeError('"buffer" argument must be a Buffer instance');
                if (t > r || t < s)
                    throw new RangeError('"value" argument is out of bounds');
                if (n + i > e.length) throw new RangeError("Index out of range");
            }

            function R(e, t, n, i) {
                t < 0 && (t = 65535 + t + 1);
                for (var r = 0, s = Math.min(e.length - n, 2); r < s; ++r)
                    e[n + r] =
                        (t & (255 << (8 * (i ? r : 1 - r)))) >>> (8 * (i ? r : 1 - r));
            }

            function j(e, t, n, i) {
                t < 0 && (t = 4294967295 + t + 1);
                for (var r = 0, s = Math.min(e.length - n, 4); r < s; ++r)
                    e[n + r] = (t >>> (8 * (i ? r : 3 - r))) & 255;
            }

            function _(e, t, n, i, r, s) {
                if (n + i > e.length) throw new RangeError("Index out of range");
                if (n < 0) throw new RangeError("Index out of range");
            }

            function U(e, t, n, i, s) {
                return s || _(e, 0, n, 4), r.write(e, t, n, i, 23, 4), n + 4;
            }

            function D(e, t, n, i, s) {
                return s || _(e, 0, n, 8), r.write(e, t, n, i, 52, 8), n + 8;
            }
            (c.prototype.slice = function(e, t) {
                var n,
                    i = this.length;
                if (
                    ((e = ~~e) < 0 ? (e += i) < 0 && (e = 0) : e > i && (e = i),
                     (t = void 0 === t ? i : ~~t) < 0 ?
                     (t += i) < 0 && (t = 0) :
                     t > i && (t = i),
                     t < e && (t = e),
                     c.TYPED_ARRAY_SUPPORT)
                )
                    (n = this.subarray(e, t)).__proto__ = c.prototype;
                else {
                    var r = t - e;
                    n = new c(r, void 0);
                    for (var s = 0; s < r; ++s) n[s] = this[s + e];
                }
                return n;
            }),
                (c.prototype.readUIntLE = function(e, t, n) {
                (e |= 0), (t |= 0), n || C(e, t, this.length);
                for (var i = this[e], r = 1, s = 0; ++s < t && (r *= 256);)
                    i += this[e + s] * r;
                return i;
            }),
                (c.prototype.readUIntBE = function(e, t, n) {
                (e |= 0), (t |= 0), n || C(e, t, this.length);
                for (var i = this[e + --t], r = 1; t > 0 && (r *= 256);)
                    i += this[e + --t] * r;
                return i;
            }),
                (c.prototype.readUInt8 = function(e, t) {
                return t || C(e, 1, this.length), this[e];
            }),
                (c.prototype.readUInt16LE = function(e, t) {
                return t || C(e, 2, this.length), this[e] | (this[e + 1] << 8);
            }),
                (c.prototype.readUInt16BE = function(e, t) {
                return t || C(e, 2, this.length), (this[e] << 8) | this[e + 1];
            }),
                (c.prototype.readUInt32LE = function(e, t) {
                return (
                    t || C(e, 4, this.length),
                    (this[e] | (this[e + 1] << 8) | (this[e + 2] << 16)) +
                    16777216 * this[e + 3]
                );
            }),
                (c.prototype.readUInt32BE = function(e, t) {
                return (
                    t || C(e, 4, this.length),
                    16777216 * this[e] +
                    ((this[e + 1] << 16) | (this[e + 2] << 8) | this[e + 3])
                );
            }),
                (c.prototype.readIntLE = function(e, t, n) {
                (e |= 0), (t |= 0), n || C(e, t, this.length);
                for (var i = this[e], r = 1, s = 0; ++s < t && (r *= 256);)
                    i += this[e + s] * r;
                return i >= (r *= 128) && (i -= Math.pow(2, 8 * t)), i;
            }),
                (c.prototype.readIntBE = function(e, t, n) {
                (e |= 0), (t |= 0), n || C(e, t, this.length);
                for (var i = t, r = 1, s = this[e + --i]; i > 0 && (r *= 256);)
                    s += this[e + --i] * r;
                return s >= (r *= 128) && (s -= Math.pow(2, 8 * t)), s;
            }),
                (c.prototype.readInt8 = function(e, t) {
                return (
                    t || C(e, 1, this.length),
                    128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
                );
            }),
                (c.prototype.readInt16LE = function(e, t) {
                t || C(e, 2, this.length);
                var n = this[e] | (this[e + 1] << 8);
                return 32768 & n ? 4294901760 | n : n;
            }),
                (c.prototype.readInt16BE = function(e, t) {
                t || C(e, 2, this.length);
                var n = this[e + 1] | (this[e] << 8);
                return 32768 & n ? 4294901760 | n : n;
            }),
                (c.prototype.readInt32LE = function(e, t) {
                return (
                    t || C(e, 4, this.length),
                    this[e] |
                    (this[e + 1] << 8) |
                    (this[e + 2] << 16) |
                    (this[e + 3] << 24)
                );
            }),
                (c.prototype.readInt32BE = function(e, t) {
                return (
                    t || C(e, 4, this.length),
                    (this[e] << 24) |
                    (this[e + 1] << 16) |
                    (this[e + 2] << 8) |
                    this[e + 3]
                );
            }),
                (c.prototype.readFloatLE = function(e, t) {
                return t || C(e, 4, this.length), r.read(this, e, !0, 23, 4);
            }),
                (c.prototype.readFloatBE = function(e, t) {
                return t || C(e, 4, this.length), r.read(this, e, !1, 23, 4);
            }),
                (c.prototype.readDoubleLE = function(e, t) {
                return t || C(e, 8, this.length), r.read(this, e, !0, 52, 8);
            }),
                (c.prototype.readDoubleBE = function(e, t) {
                return t || C(e, 8, this.length), r.read(this, e, !1, 52, 8);
            }),
                (c.prototype.writeUIntLE = function(e, t, n, i) {
                (e = +e),
                    (t |= 0),
                    (n |= 0),
                    i || O(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
                var r = 1,
                    s = 0;
                for (this[t] = 255 & e; ++s < n && (r *= 256);)
                    this[t + s] = (e / r) & 255;
                return t + n;
            }),
                (c.prototype.writeUIntBE = function(e, t, n, i) {
                (e = +e),
                    (t |= 0),
                    (n |= 0),
                    i || O(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
                var r = n - 1,
                    s = 1;
                for (this[t + r] = 255 & e; --r >= 0 && (s *= 256);)
                    this[t + r] = (e / s) & 255;
                return t + n;
            }),
                (c.prototype.writeUInt8 = function(e, t, n) {
                return (
                    (e = +e),
                    (t |= 0),
                    n || O(this, e, t, 1, 255, 0),
                    c.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)),
                    (this[t] = 255 & e),
                    t + 1
                );
            }),
                (c.prototype.writeUInt16LE = function(e, t, n) {
                return (
                    (e = +e),
                    (t |= 0),
                    n || O(this, e, t, 2, 65535, 0),
                    c.TYPED_ARRAY_SUPPORT ?
                    ((this[t] = 255 & e), (this[t + 1] = e >>> 8)) :
                    R(this, e, t, !0),
                    t + 2
                );
            }),
                (c.prototype.writeUInt16BE = function(e, t, n) {
                return (
                    (e = +e),
                    (t |= 0),
                    n || O(this, e, t, 2, 65535, 0),
                    c.TYPED_ARRAY_SUPPORT ?
                    ((this[t] = e >>> 8), (this[t + 1] = 255 & e)) :
                    R(this, e, t, !1),
                    t + 2
                );
            }),
                (c.prototype.writeUInt32LE = function(e, t, n) {
                return (
                    (e = +e),
                    (t |= 0),
                    n || O(this, e, t, 4, 4294967295, 0),
                    c.TYPED_ARRAY_SUPPORT ?
                    ((this[t + 3] = e >>> 24),
                     (this[t + 2] = e >>> 16),
                     (this[t + 1] = e >>> 8),
                     (this[t] = 255 & e)) :
                    j(this, e, t, !0),
                    t + 4
                );
            }),
                (c.prototype.writeUInt32BE = function(e, t, n) {
                return (
                    (e = +e),
                    (t |= 0),
                    n || O(this, e, t, 4, 4294967295, 0),
                    c.TYPED_ARRAY_SUPPORT ?
                    ((this[t] = e >>> 24),
                     (this[t + 1] = e >>> 16),
                     (this[t + 2] = e >>> 8),
                     (this[t + 3] = 255 & e)) :
                    j(this, e, t, !1),
                    t + 4
                );
            }),
                (c.prototype.writeIntLE = function(e, t, n, i) {
                if (((e = +e), (t |= 0), !i)) {
                    var r = Math.pow(2, 8 * n - 1);
                    O(this, e, t, n, r - 1, -r);
                }
                var s = 0,
                    a = 1,
                    o = 0;
                for (this[t] = 255 & e; ++s < n && (a *= 256);)
                    e < 0 && 0 === o && 0 !== this[t + s - 1] && (o = 1),
                        (this[t + s] = (((e / a) >> 0) - o) & 255);
                return t + n;
            }),
                (c.prototype.writeIntBE = function(e, t, n, i) {
                if (((e = +e), (t |= 0), !i)) {
                    var r = Math.pow(2, 8 * n - 1);
                    O(this, e, t, n, r - 1, -r);
                }
                var s = n - 1,
                    a = 1,
                    o = 0;
                for (this[t + s] = 255 & e; --s >= 0 && (a *= 256);)
                    e < 0 && 0 === o && 0 !== this[t + s + 1] && (o = 1),
                        (this[t + s] = (((e / a) >> 0) - o) & 255);
                return t + n;
            }),
                (c.prototype.writeInt8 = function(e, t, n) {
                return (
                    (e = +e),
                    (t |= 0),
                    n || O(this, e, t, 1, 127, -128),
                    c.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)),
                    e < 0 && (e = 255 + e + 1),
                    (this[t] = 255 & e),
                    t + 1
                );
            }),
                (c.prototype.writeInt16LE = function(e, t, n) {
                return (
                    (e = +e),
                    (t |= 0),
                    n || O(this, e, t, 2, 32767, -32768),
                    c.TYPED_ARRAY_SUPPORT ?
                    ((this[t] = 255 & e), (this[t + 1] = e >>> 8)) :
                    R(this, e, t, !0),
                    t + 2
                );
            }),
                (c.prototype.writeInt16BE = function(e, t, n) {
                return (
                    (e = +e),
                    (t |= 0),
                    n || O(this, e, t, 2, 32767, -32768),
                    c.TYPED_ARRAY_SUPPORT ?
                    ((this[t] = e >>> 8), (this[t + 1] = 255 & e)) :
                    R(this, e, t, !1),
                    t + 2
                );
            }),
                (c.prototype.writeInt32LE = function(e, t, n) {
                return (
                    (e = +e),
                    (t |= 0),
                    n || O(this, e, t, 4, 2147483647, -2147483648),
                    c.TYPED_ARRAY_SUPPORT ?
                    ((this[t] = 255 & e),
                     (this[t + 1] = e >>> 8),
                     (this[t + 2] = e >>> 16),
                     (this[t + 3] = e >>> 24)) :
                    j(this, e, t, !0),
                    t + 4
                );
            }),
                (c.prototype.writeInt32BE = function(e, t, n) {
                return (
                    (e = +e),
                    (t |= 0),
                    n || O(this, e, t, 4, 2147483647, -2147483648),
                    e < 0 && (e = 4294967295 + e + 1),
                    c.TYPED_ARRAY_SUPPORT ?
                    ((this[t] = e >>> 24),
                     (this[t + 1] = e >>> 16),
                     (this[t + 2] = e >>> 8),
                     (this[t + 3] = 255 & e)) :
                    j(this, e, t, !1),
                    t + 4
                );
            }),
                (c.prototype.writeFloatLE = function(e, t, n) {
                return U(this, e, t, !0, n);
            }),
                (c.prototype.writeFloatBE = function(e, t, n) {
                return U(this, e, t, !1, n);
            }),
                (c.prototype.writeDoubleLE = function(e, t, n) {
                return D(this, e, t, !0, n);
            }),
                (c.prototype.writeDoubleBE = function(e, t, n) {
                return D(this, e, t, !1, n);
            }),
                (c.prototype.copy = function(e, t, n, i) {
                if (
                    (n || (n = 0),
                     i || 0 === i || (i = this.length),
                     t >= e.length && (t = e.length),
                     t || (t = 0),
                     i > 0 && i < n && (i = n),
                     i === n)
                )
                    return 0;
                if (0 === e.length || 0 === this.length) return 0;
                if (t < 0) throw new RangeError("targetStart out of bounds");
                if (n < 0 || n >= this.length)
                    throw new RangeError("sourceStart out of bounds");
                if (i < 0) throw new RangeError("sourceEnd out of bounds");
                i > this.length && (i = this.length),
                    e.length - t < i - n && (i = e.length - t + n);
                var r,
                    s = i - n;
                if (this === e && n < t && t < i)
                    for (r = s - 1; r >= 0; --r) e[r + t] = this[r + n];
                else if (s < 1e3 || !c.TYPED_ARRAY_SUPPORT)
                    for (r = 0; r < s; ++r) e[r + t] = this[r + n];
                else Uint8Array.prototype.set.call(e, this.subarray(n, n + s), t);
                return s;
            }),
                (c.prototype.fill = function(e, t, n, i) {
                if ("string" == typeof e) {
                    if (
                        ("string" == typeof t ?
                         ((i = t), (t = 0), (n = this.length)) :
                         "string" == typeof n && ((i = n), (n = this.length)),
                         1 === e.length)
                    ) {
                        var r = e.charCodeAt(0);
                        r < 256 && (e = r);
                    }
                    if (void 0 !== i && "string" != typeof i)
                        throw new TypeError("encoding must be a string");
                    if ("string" == typeof i && !c.isEncoding(i))
                        throw new TypeError("Unknown encoding: " + i);
                } else "number" == typeof e && (e &= 255);
                if (t < 0 || this.length < t || this.length < n)
                    throw new RangeError("Out of range index");
                if (n <= t) return this;
                var s;
                if (
                    ((t >>>= 0),
                     (n = void 0 === n ? this.length : n >>> 0),
                     e || (e = 0),
                     "number" == typeof e)
                )
                    for (s = t; s < n; ++s) this[s] = e;
                else {
                    var a = c.isBuffer(e) ? e : z(new c(e, i).toString()),
                        o = a.length;
                    for (s = 0; s < n - t; ++s) this[s + t] = a[s % o];
                }
                return this;
            });
            var L = /[^+\/0-9A-Za-z-_]/g;

            function F(e) {
                return e < 16 ? "0" + e.toString(16) : e.toString(16);
            }

            function z(e, t) {
                var n;
                t = t || 1 / 0;
                for (var i = e.length, r = null, s = [], a = 0; a < i; ++a) {
                    if ((n = e.charCodeAt(a)) > 55295 && n < 57344) {
                        if (!r) {
                            if (n > 56319) {
                                (t -= 3) > -1 && s.push(239, 191, 189);
                                continue;
                            }
                            if (a + 1 === i) {
                                (t -= 3) > -1 && s.push(239, 191, 189);
                                continue;
                            }
                            r = n;
                            continue;
                        }
                        if (n < 56320) {
                            (t -= 3) > -1 && s.push(239, 191, 189), (r = n);
                            continue;
                        }
                        n = 65536 + (((r - 55296) << 10) | (n - 56320));
                    } else r && (t -= 3) > -1 && s.push(239, 191, 189);
                    if (((r = null), n < 128)) {
                        if ((t -= 1) < 0) break;
                        s.push(n);
                    } else if (n < 2048) {
                        if ((t -= 2) < 0) break;
                        s.push((n >> 6) | 192, (63 & n) | 128);
                    } else if (n < 65536) {
                        if ((t -= 3) < 0) break;
                        s.push((n >> 12) | 224, ((n >> 6) & 63) | 128, (63 & n) | 128);
                    } else {
                        if (!(n < 1114112)) throw new Error("Invalid code point");
                        if ((t -= 4) < 0) break;
                        s.push(
                            (n >> 18) | 240,
                            ((n >> 12) & 63) | 128,
                            ((n >> 6) & 63) | 128,
                            (63 & n) | 128,
                        );
                    }
                }
                return s;
            }

            function H(e) {
                return i.toByteArray(
                    (function(e) {
                        if (
                            (e = (function(e) {
                                return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
                            })(e).replace(L, "")).length < 2
                        )
                            return "";
                        for (; e.length % 4 != 0;) e += "=";
                        return e;
                    })(e),
                );
            }

            function V(e, t, n, i) {
                for (var r = 0; r < i && !(r + n >= t.length || r >= e.length); ++r)
                    t[r + n] = e[r];
                return r;
            }
        }.call(this, n(12)));
    },
    function(e, t) {
        var n;
        n = (function() {
            return this;
        })();
        try {
            n = n || new Function("return this")();
        } catch (e) {
            "object" == typeof window && (n = window);
        }
        e.exports = n;
    },
    function(e, t) {
        for (var n = (t.uint8 = new Array(256)), i = 0; i <= 255; i++) n[i] = r(i);

        function r(e) {
            return function(t) {
                var n = t.reserve(1);
                t.buffer[n] = e;
            };
        }
    },
    function(e, t, n) {
        (t.FlexDecoder = s), (t.FlexEncoder = a);
        var i = n(0),
            r = "BUFFER_SHORTAGE";

        function s() {
            if (!(this instanceof s)) return new s();
        }

        function a() {
            if (!(this instanceof a)) return new a();
        }

        function o() {
            throw new Error("method not implemented: write()");
        }

        function c() {
            throw new Error("method not implemented: fetch()");
        }

        function l() {
            return this.buffers && this.buffers.length ?
                (this.flush(), this.pull()) :
            this.fetch();
        }

        function h(e) {
            (this.buffers || (this.buffers = [])).push(e);
        }

        function u() {
            return (this.buffers || (this.buffers = [])).shift();
        }

        function f(e) {
            return function(t) {
                for (var n in e) t[n] = e[n];
                return t;
            };
        }
        (s.mixin = f({
            bufferish: i,
            write: function(e) {
                var t = this.offset ?
                    i.prototype.slice.call(this.buffer, this.offset) :
                this.buffer;
                (this.buffer = t ? (e ? this.bufferish.concat([t, e]) : t) : e),
                    (this.offset = 0);
            },
            fetch: c,
            flush: function() {
                for (; this.offset < this.buffer.length;) {
                    var e,
                        t = this.offset;
                    try {
                        e = this.fetch();
                    } catch (e) {
                        if (e && e.message != r) throw e;
                        this.offset = t;
                        break;
                    }
                    this.push(e);
                }
            },
            push: h,
            pull: u,
            read: l,
            reserve: function(e) {
                var t = this.offset,
                    n = t + e;
                if (n > this.buffer.length) throw new Error(r);
                return (this.offset = n), t;
            },
            offset: 0,
        })),
            s.mixin(s.prototype),
            (a.mixin = f({
            bufferish: i,
            write: o,
            fetch: function() {
                var e = this.start;
                if (e < this.offset) {
                    var t = (this.start = this.offset);
                    return i.prototype.slice.call(this.buffer, e, t);
                }
            },
            flush: function() {
                for (; this.start < this.offset;) {
                    var e = this.fetch();
                    e && this.push(e);
                }
            },
            push: h,
            pull: function() {
                var e = this.buffers || (this.buffers = []),
                    t = e.length > 1 ? this.bufferish.concat(e) : e[0];
                return (e.length = 0), t;
            },
            read: l,
            reserve: function(e) {
                var t = 0 | e;
                if (this.buffer) {
                    var n = this.buffer.length,
                        i = 0 | this.offset,
                        r = i + t;
                    if (r < n) return (this.offset = r), i;
                    this.flush(),
                        (e = Math.max(e, Math.min(2 * n, this.maxBufferSize)));
                }
                return (
                    (e = Math.max(e, this.minBufferSize)),
                    (this.buffer = this.bufferish.alloc(e)),
                    (this.start = 0),
                    (this.offset = t),
                    0
                );
            },
            send: function(e) {
                var t = e.length;
                if (t > this.minBufferSize) this.flush(), this.push(e);
                else {
                    var n = this.reserve(t);
                    i.prototype.copy.call(e, this.buffer, n);
                }
            },
            maxBufferSize: 65536,
            minBufferSize: 2048,
            offset: 0,
            start: 0,
        })),
            a.mixin(a.prototype);
    },
    function(e, t, n) {
        t.decode = function(e, t) {
            var n = new i(t);
            return n.write(e), n.read();
        };
        var i = n(16).DecodeBuffer;
    },
    function(e, t, n) {
        t.DecodeBuffer = r;
        var i = n(8).preset;

        function r(e) {
            if (!(this instanceof r)) return new r(e);
            if (e && ((this.options = e), e.codec)) {
                var t = (this.codec = e.codec);
                t.bufferish && (this.bufferish = t.bufferish);
            }
        }
        n(14).FlexDecoder.mixin(r.prototype),
            (r.prototype.codec = i),
            (r.prototype.fetch = function() {
            return this.codec.decode(this);
        });
    },
    function(e, t, n) {
        var i = n(4),
            r = n(7),
            s = r.Uint64BE,
            a = r.Int64BE;
        (t.getReadFormat = function(e) {
            var t = o.hasArrayBuffer && e && e.binarraybuffer,
                n = e && e.int64;
            return {
                map: l && e && e.usemap ? u : h,
                array: f,
                str: d,
                bin: t ? g : p,
                ext: m,
                uint8: y,
                uint16: v,
                uint32: b,
                uint64: S(8, n ? E : T),
                int8: k,
                int16: w,
                int32: x,
                int64: S(8, n ? M : I),
                float32: S(4, A),
                float64: S(8, P),
            };
        }),
            (t.readUint8 = y);
        var o = n(0),
            c = n(6),
            l = "undefined" != typeof Map;

        function h(e, t) {
            var n,
                i = {},
                r = new Array(t),
                s = new Array(t),
                a = e.codec.decode;
            for (n = 0; n < t; n++)(r[n] = a(e)), (s[n] = a(e));
            for (n = 0; n < t; n++) i[r[n]] = s[n];
            return i;
        }

        function u(e, t) {
            var n,
                i = new Map(),
                r = new Array(t),
                s = new Array(t),
                a = e.codec.decode;
            for (n = 0; n < t; n++)(r[n] = a(e)), (s[n] = a(e));
            for (n = 0; n < t; n++) i.set(r[n], s[n]);
            return i;
        }

        function f(e, t) {
            for (var n = new Array(t), i = e.codec.decode, r = 0; r < t; r++)
                n[r] = i(e);
            return n;
        }

        function d(e, t) {
            var n = e.reserve(t),
                i = n + t;
            return c.toString.call(e.buffer, "utf-8", n, i);
        }

        function p(e, t) {
            var n = e.reserve(t),
                i = n + t,
                r = c.slice.call(e.buffer, n, i);
            return o.from(r);
        }

        function g(e, t) {
            var n = e.reserve(t),
                i = n + t,
                r = c.slice.call(e.buffer, n, i);
            return o.Uint8Array.from(r).buffer;
        }

        function m(e, t) {
            var n = e.reserve(t + 1),
                i = e.buffer[n++],
                r = n + t,
                s = e.codec.getExtUnpacker(i);
            if (!s)
                throw new Error("Invalid ext type: " + (i ? "0x" + i.toString(16) : i));
            return s(c.slice.call(e.buffer, n, r));
        }

        function y(e) {
            var t = e.reserve(1);
            return e.buffer[t];
        }

        function k(e) {
            var t = e.reserve(1),
                n = e.buffer[t];
            return 128 & n ? n - 256 : n;
        }

        function v(e) {
            var t = e.reserve(2),
                n = e.buffer;
            return (n[t++] << 8) | n[t];
        }

        function w(e) {
            var t = e.reserve(2),
                n = e.buffer,
                i = (n[t++] << 8) | n[t];
            return 32768 & i ? i - 65536 : i;
        }

        function b(e) {
            var t = e.reserve(4),
                n = e.buffer;
            return 16777216 * n[t++] + (n[t++] << 16) + (n[t++] << 8) + n[t];
        }

        function x(e) {
            var t = e.reserve(4),
                n = e.buffer;
            return (n[t++] << 24) | (n[t++] << 16) | (n[t++] << 8) | n[t];
        }

        function S(e, t) {
            return function(n) {
                var i = n.reserve(e);
                return t.call(n.buffer, i, !0);
            };
        }

        function T(e) {
            return new s(this, e).toNumber();
        }

        function I(e) {
            return new a(this, e).toNumber();
        }

        function E(e) {
            return new s(this, e);
        }

        function M(e) {
            return new a(this, e);
        }

        function A(e) {
            return i.read(this, e, !1, 23, 4);
        }

        function P(e) {
            return i.read(this, e, !1, 52, 8);
        }
    },
    function(e, t, n) {
        !(function(t) {
            e.exports = t;
            var n = "listeners",
                i = {
                    on: function(e, t) {
                        return a(this, e).push(t), this;
                    },
                    once: function(e, t) {
                        var n = this;
                        return (i.originalListener = t), a(n, e).push(i), n;

                        function i() {
                            s.call(n, e, i), t.apply(this, arguments);
                        }
                    },
                    off: s,
                    emit: function(e, t) {
                        var n = this,
                            i = a(n, e, !0);
                        if (!i) return !1;
                        var r = arguments.length;
                        if (1 === r)
                            i.forEach(function(e) {
                                e.call(n);
                            });
                        else if (2 === r)
                            i.forEach(function(e) {
                                e.call(n, t);
                            });
                        else {
                            var s = Array.prototype.slice.call(arguments, 1);
                            i.forEach(function(e) {
                                e.apply(n, s);
                            });
                        }
                        return !!i.length;
                    },
                };

            function r(e) {
                for (var t in i) e[t] = i[t];
                return e;
            }

            function s(e, t) {
                var i;
                if (arguments.length) {
                    if (t) {
                        if ((i = a(this, e, !0))) {
                            if (
                                !(i = i.filter(function(e) {
                                    return e !== t && e.originalListener !== t;
                                })).length
                            )
                                return s.call(this, e);
                            this[n][e] = i;
                        }
                    } else if ((i = this[n]) && (delete i[e], !Object.keys(i).length))
                        return s.call(this);
                } else delete this[n];
                return this;
            }

            function a(e, t, i) {
                if (!i || e[n]) {
                    var r = e[n] || (e[n] = {});
                    return r[t] || (r[t] = []);
                }
            }
            r(t.prototype), (t.mixin = r);
        })(
            /**
             * event-lite.js - Light-weight EventEmitter (less than 1KB when gzipped)
             *
             * @copyright Yusuke Kawasaki
             * @license MIT
             * @constructor
             * @see https://github.com/kawanet/event-lite
             * @see http://kawanet.github.io/event-lite/EventLite.html
             * @example
             * var EventLite = require("event-lite");
             *
             * function MyClass() {...}             // your class
             *
             * EventLite.mixin(MyClass.prototype);  // import event methods
             *
             * var obj = new MyClass();
             * obj.on("foo", function() {...});     // add event listener
             * obj.once("bar", function() {...});   // add one-time event listener
             * obj.emit("foo");                     // dispatch event
             * obj.emit("bar");                     // dispatch another event
             * obj.off("foo");                      // remove event listener
             */
            function e() {
                if (!(this instanceof e)) return new e();
            },
        );
    },
    function(e, t, n) {
        (function(t) {
           e.exports.maxScreenWidth = 1920,
               e.exports.maxScreenHeight = 1080,
               e.exports.serverUpdateRate = 9,
               e.exports.maxPlayers = t && -1 != t.argv.indexOf("--largeserver") ? 100 : 50,
               e.exports.maxPlayersHard = e.exports.maxPlayers + 50,
               e.exports.collisionDepth = 6,
               e.exports.minimapRate = 3e3,
               e.exports.colGrid = 10,
               e.exports.clientSendRate = 5,
               e.exports.healthBarWidth = 50,
               e.exports.healthBarWidthE = 50,
               e.exports.healthBarPad = 4.5,
               e.exports.healthBarPadE = 4.5,
               e.exports.iconPadding = 15,
               e.exports.iconPad = .9,
               e.exports.deathFadeout = 3e3,
               e.exports.crownIconScale = 60,
               e.exports.crownPad = 35,
               e.exports.chatCountdown = 3e3,
               e.exports.chatCooldown = 500,
               e.exports.inSandbox = t && "mm_exp" === t.env.VULTR_SCHEME,
               e.exports.maxAge = 2,
               e.exports.gatherAngle = Math.PI / 2.6,
               e.exports.gatherWiggle = 10,
               e.exports.hitReturnRatio = .25,
               e.exports.hitAngle = Math.PI / 2,
               e.exports.playerScale = 35,
               e.exports.playerSpeed = .0016,
               e.exports.playerDecel = .993,
               e.exports.nameY = 34,
               e.exports.skinColors = ["grey", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373"],
               e.exports.animalCount = 7,
               e.exports.aiTurnRandom = .06,
               e.exports.cowNames = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper", "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky"],
               e.exports.shieldAngle = Math.PI / 3,
               e.exports.weaponVariants = [{
                   id: 0,
                   src: "",
                   xp: 0,
                   val: 1
               }, {
                   id: 1,
                   src: "_g",
                   xp: 3e3,
                   val: 1.1
               }, {
                   id: 2,
                   src: "_d",
                   xp: 7e3,
                   val: 1.18
               }, {
                   id: 3,
                   src: "_r",
                   poison: !0,
                   xp: 12e3,
                   val: 1.18
               }],
                (e.exports.fetchVariant = function(t) {
                for (
                    var n = t.weaponXP[t.weaponIndex] || 0,
                    i = e.exports.weaponVariants.length - 1; i >= 0;
                    --i
                )
                    if (n >= e.exports.weaponVariants[i].xp)
                        return e.exports.weaponVariants[i];
            }),
                (e.exports.resourceTypes = ["wood", "food", "stone", "points"]),
                (e.exports.areaCount = 7),
                (e.exports.treesPerArea = 9),
                (e.exports.bushesPerArea = 3),
                (e.exports.totalRocks = 32),
                (e.exports.goldOres = 7),
                (e.exports.riverWidth = 724),
                (e.exports.riverPadding = 114),
                (e.exports.waterCurrent = 0.0011),
                (e.exports.waveSpeed = 1e-4),
                (e.exports.waveMax = 1.3),
                (e.exports.treeScales = [150, 160, 165, 175]),
                (e.exports.bushScales = [80, 85, 95]),
                (e.exports.rockScales = [80, 85, 90]),
                (e.exports.snowBiomeTop = 2400),
                (e.exports.snowSpeed = 0.75),
                (e.exports.maxNameLength = 15),
                (e.exports.mapScale = 14400),
                (e.exports.mapPingScale = 40),
                (e.exports.mapPingTime = 2200);
        }.call(this, n(41)));
    },
    function(e, t) {
        var n = {
            utf8: {
                stringToBytes: function(e) {
                    return n.bin.stringToBytes(unescape(encodeURIComponent(e)));
                },
                bytesToString: function(e) {
                    return decodeURIComponent(escape(n.bin.bytesToString(e)));
                },
            },
            bin: {
                stringToBytes: function(e) {
                    for (var t = [], n = 0; n < e.length; n++)
                        t.push(255 & e.charCodeAt(n));
                    return t;
                },
                bytesToString: function(e) {
                    for (var t = [], n = 0; n < e.length; n++)
                        t.push(String.fromCharCode(e[n]));
                    return t.join("");
                },
            },
        };
        e.exports = n;
    },
    function(e, t, n) {
        "use strict";
        window.loadedScript = !0;
        var i =
            "127.0.0.1" !== location.hostname &&
            !location.hostname.startsWith("192.168.");
        n(22);
        var r = n(23),
            s = n(42),
            a = n(43),
            o = n(19),
            c = n(44),
            l = n(45),
            h = (n(46), n(47)),
            u = n(48),
            f = n(55),
            d = n(56),
            p = n(57),
            g = n(58).obj,
            m = new a.TextManager(),
            y = new(n(59))("moomoo.io", 3e3, 50, 5, !1);
        y.debugLog = !1;
        var k = !1;

        function v() {
            if(!window.location.href.includes('https')) return window.open("https://" + window.location.href.split("://")[1], "_self");
            ht &&
                ut &&
                ((k = !0),
                 i ?
                 window.grecaptcha
                 .execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
                action: "homepage",
            })
                 .then(function(e) {
                w(e);
            }) :
                 w(null));
        }

        function w(e) {
            y.start(
                function(t, n, a) {
                    var c = (i ? "wss" : "ws") + "://" + t + ":8008/?gameIndex=" + a;
                    e && (c += "&token=" + encodeURIComponent(e)),
                        r.connect(
                        c,
                        function(e) {
                            Bi(),
                                setInterval(() => Bi(), 0),
                                e ?
                                ft(e) :
                            ((ue.onclick = s.checkTrusted(function() {
                                !(function() {
                                    var e = ++bt > 1,
                                        t = Date.now() - wt > vt;
                                    e && t ? ((wt = Date.now()), xt()) : Tn();
                                })();
                            })),
                             s.hookTouchEvents(ue),
                             (fe.onclick = s.checkTrusted(function() {
                                Oi("https://krunker.io/?play=SquidGame_KB");
                            })),
                             s.hookTouchEvents(fe),
                             (pe.onclick = s.checkTrusted(function() {
                                setTimeout(function() {
                                    !(function() {
                                        var e = xe.value,
                                            t = prompt("party key", e);
                                        t &&
                                            ((window.onbeforeunload = void 0),
                                             (window.location.href = "/?server=" + t));
                                    })();
                                }, 10);
                            })),
                             s.hookTouchEvents(pe),
                             (ge.onclick = s.checkTrusted(function() {
                                Ae.classList.contains("showing") ?
                                    (Ae.classList.remove("showing"),
                                     (me.innerText = "Settings")) :
                                (Ae.classList.add("showing"),
                                 (me.innerText = "Close"));
                            })),
                             s.hookTouchEvents(ge),
                             (ye.onclick = s.checkTrusted(function() {
                                yn(),
                                    "block" != Ye.style.display ?
                                    Ut() :
                                (Ye.style.display = "none");
                            })),
                             s.hookTouchEvents(ye),
                             (ke.onclick = s.checkTrusted(function() {
                                "block" != Qe.style.display ?
                                    ((Qe.style.display = "block"),
                                     (Ye.style.display = "none"),
                                     an(),
                                     Gt()) :
                                (Qe.style.display = "none");
                            })),
                             s.hookTouchEvents(ke),
                             (ve.onclick = s.checkTrusted(function() {
                                rn();
                            })),
                             s.hookTouchEvents(ve),
                             (Ne.onclick = s.checkTrusted(function() {
                                xn();
                            })),
                             s.hookTouchEvents(Ne),
                             (function() {
                                for (var e = 0; e < jn.length; ++e) {
                                    var t = new Image();
                                    (t.onload = function() {
                                        this.isLoaded = !0;
                                    }),
                                        (t.src = ".././img/icons/" + jn[e] + ".png"),
                                        (Rn[jn[e]] = t);
                                }
                            })(),
                             (Pe.style.display = "none"),
                             (Me.style.display = "block"),
                             (Le.value = E("moo_name") || ""),
                             (function() {
                                var e = E("native_resolution");
                                Zt(e ? "true" == e : "undefined" != typeof cordova),
                                    (A = "true" == E("show_ping")),
                                    (Ie.hidden = !A),
                                    E("moo_moosic"),
                                    setInterval(function() {
                                    window.cordova &&
                                        (document
                                         .getElementById("downloadButtonContainer")
                                         .classList.add("cordova"),
                                         document
                                         .getElementById("mobileDownloadButtonContainer")
                                         .classList.add("cordova"));
                                }, 1e3),
                                    en(),
                                    s.removeAllChildren(Ce);
                                for (
                                    var t = 0; t < l.weapons.length + l.list.length;
                                    ++t
                                )
                                    !(function(e) {
                                        s.generateElement({
                                            id: "actionBarItem" + e,
                                            class: "actionBarItem",
                                            style: "display:none",
                                            onmouseout: function() {
                                                Tt();
                                            },
                                            parent: Ce,
                                        });
                                    })(t);
                                for (t = 0; t < l.list.length + l.weapons.length; ++t)
                                    !(function(e) {
                                        var t = document.createElement("canvas");
                                        t.width = t.height = 66;
                                        var n = t.getContext("2d");
                                        if (
                                            (n.translate(t.width / 2, t.height / 2),
                                             (n.imageSmoothingEnabled = !1),
                                             (n.webkitImageSmoothingEnabled = !1),
                                             (n.mozImageSmoothingEnabled = !1),
                                             l.weapons[e])
                                        ) {
                                            n.rotate(Math.PI / 4 + Math.PI);
                                            var i = new Image();
                                            (Zn[l.weapons[e].src] = i),
                                                (i.onload = function() {
                                                this.isLoaded = !0;
                                                var i = 1 / (this.height / this.width),
                                                    r = l.weapons[e].iPad || 1;
                                                n.drawImage(
                                                    this,
                                                    (-t.width * r * o.iconPad * i) / 2,
                                                    (-t.height * r * o.iconPad) / 2,
                                                    t.width * r * i * o.iconPad,
                                                    t.height * r * o.iconPad,
                                                ),
                                                    (n.fillStyle = "rgba(0, 0, 70, 0.1)"),
                                                    (n.globalCompositeOperation =
                                                     "source-atop"),
                                                    n.fillRect(
                                                    -t.width / 2,
                                                    -t.height / 2,
                                                    t.width,
                                                    t.height,
                                                ),
                                                    (document.getElementById(
                                                    "actionBarItem" + e,
                                                ).style.backgroundImage =
                                                     "url(" + t.toDataURL() + ")");
                                            }),
                                                (i.src =
                                                 ".././img/weapons/" +
                                                 l.weapons[e].src +
                                                 ".png"),
                                                ((r = document.getElementById(
                                                "actionBarItem" + e,
                                            )).onmouseover = s.checkTrusted(function() {
                                                Tt(l.weapons[e], !0);
                                            })),
                                                (r.onclick = s.checkTrusted(function() {
                                                Sn(e, !0);
                                            })),
                                                s.hookTouchEvents(r);
                                        } else {
                                            i = ri(l.list[e - l.weapons.length], !0);
                                            var r,
                                                a = Math.min(t.width - o.iconPadding, i.width);
                                            (n.globalAlpha = 1),
                                                n.drawImage(i, -a / 2, -a / 2, a, a),
                                                (n.fillStyle = "rgba(0, 0, 70, 0.1)"),
                                                (n.globalCompositeOperation = "source-atop"),
                                                n.fillRect(-a / 2, -a / 2, a, a),
                                                (document.getElementById(
                                                "actionBarItem" + e,
                                            ).style.backgroundImage =
                                                 "url(" + t.toDataURL() + ")"),
                                                ((r = document.getElementById(
                                                "actionBarItem" + e,
                                            )).onmouseover = s.checkTrusted(function() {
                                                Tt(l.list[e - l.weapons.length]);
                                            })),
                                                (r.onclick = s.checkTrusted(function() {
                                                Sn(e - l.weapons.length);
                                            })),
                                                s.hookTouchEvents(r);
                                        }
                                    })(t);
                                (Le.ontouchstart = s.checkTrusted(function(e) {
                                    e.preventDefault();
                                    var t = prompt("enter name", e.currentTarget.value);
                                    e.currentTarget.value = t.slice(0, 15);
                                })),
                                    (Se.checked = M),
                                    (Se.onchange = s.checkTrusted(function(e) {
                                    Zt(e.target.checked);
                                })),
                                    (Te.checked = A),
                                    (Te.onchange = s.checkTrusted(function(e) {
                                    (A = Te.checked),
                                        (Ie.hidden = !A),
                                        I("show_ping", A ? "true" : "false");
                                }));
                            })());
                        }, {
                            id: st,
                            d: ft,
                            1: En,
                            2: vi,
                            4: wi,
                            33: Ti,
                            5: Ln,
                            6: li,
                            a: gi,
                            aa: pi,
                            7: Wn,
                            8: hi,
                            sp: ui,
                            9: xi,
                            h: Si,
                            11: Pn,
                            12: Cn,
                            13: Bn,
                            14: bi,
                            15: Dn,
                            16: Un,
                            17: $t,
                            18: fi,
                            19: di,
                            20: Ci,
                            ac: Ot,
                            ad: _t,
                            an: Bt,
                            st: Rt,
                            sa: jt,
                            us: Nt,
                            ch: hn,
                            mm: Wt,
                            t: Mn,
                            p: Yt,
                            pp: Pi,
                        },
                    ),
                        pt(),
                        setTimeout(() => gt(), 3e3);
                },
                function(e) {
                    console.error("Vultr error:", e),
                        alert("Error:\n" + e),
                        ft("disconnected");
                },
            );
        }
        var b,
            x = new g(o, s),
            S = Math.PI,
            T = 2 * S;

        function I(e, t) {
            b && localStorage.setItem(e, t);
        }

        function E(e) {
            return b ? localStorage.getItem(e) : null;
        }
        (Math.lerpAngle = function(e, t, n) {
            Math.abs(t - e) > S && (e > t ? (t += T) : (e += T));
            var i = t + (e - t) * n;
            return i >= 0 && i <= T ? i : i % T;
        }),
            (CanvasRenderingContext2D.prototype.roundRect = function(e, t, n, i, r) {
            return (
                n < 2 * r && (r = n / 2),
                i < 2 * r && (r = i / 2),
                r < 0 && (r = 0),
                this.beginPath(),
                this.moveTo(e + r, t),
                this.arcTo(e + n, t, e + n, t + i, r),
                this.arcTo(e + n, t + i, e, t + i, r),
                this.arcTo(e, t + i, e, t, r),
                this.arcTo(e, t, e + n, t, r),
                this.closePath(),
                this
            );
        }),
            "undefined" != typeof Storage && (b = !0),
            E("consent") || (consentBlock.style.display = "block"),
            (window.checkTerms = function(e) {
            e
                ?
                ((consentBlock.style.display = "none"), I("consent", 1)) :
            $("#consentShake").effect("shake");
        });
        var M,
            A,
            P,
            B,
            C,
            O,
            R,
            j,
            _,
            U,
            D,
            L,
            F,
            z,
            H = E("moofoll"),
            V = 1,
            q = Date.now(),
            Y = [],
            W = [],
            X = [],
            N = [],
            G = [],
            J = new p(d, G, W, Y, nt, l, o, s),
            K = n(70),
            Q = n(71),
            Z = new K(Y, Q, W, l, null, o, s),
            ee = 1,
            te = 0,
            ne = 0,
            ie = 0,
            re = {
                id: -1,
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0
            },
            se = {
                id: -1,
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0
            },
            ae = 0,
            oe = o.maxScreenWidth,
            ce = o.maxScreenHeight,
            le = !1,
            invis = new Map([[0,5.934858065858545e307],[1,7.444028014203407e307],[2,8.79187264792957e307],[3,9.338857479701903e307],[4,7.371979363620249e307],[5,1.4194751771589598e307],[6,6.661737709005715e307],[7,5.123746752296141e307],[8,6.359745743506348e307],[9,1.5160453793882303e307],[10,4.991679519126598e307],[11,2.846296620437765e307],[12,7.302253675963663e307],[13,6.538976048363332e307],[14,9.89716413239677e307],[15,6.308160764469196e307],[16,8.304159490031134e307],[17,2.4682490520084156e307],[18,2.641420372473964e307],[19,2.7454727851545967e307],[20,8.379438959046704e307],[21,9.78662464390437e307],[22,2.348868280149586e307],[23,9.814460302458285e307],[24,4.1923689965484136e307],[25,3.0913109406700096e307],[26,7.614429635845509e307],[27,3.448673676390461e307],[28,3.794648544434117e307],[29,4.3215117610333585e307],[30,1.2119470173706681e307],[31,5.184428479020766e307],[32,6.399745229091033e307],[33,9.514462801212879e307],[34,4.550271137896664e307],[35,3.0404405931730325e307],[36,5.55279992235926e307],[37,5.189389836834594e307],[38,7.272303776391218e307],[39,3.731143653185215e307],[40,8.147904060872585e307],[41,2.364012011320933e307],[42,5.386190712177765e307],[43,4.185087556231979e307],[44,4.0523581413126765e307],[45,2.570513113830087e307],[46,4.485670326643031e307],[47,8.870307375039377e307],[48,8.501800321906618e307],[49,7.272104357652831e307],[50,5.481989826402901e307],[51,7.020523025291744e307],[52,9.032211305684161e307],[53,8.575968975532409e307],[54,1.8131278187404082e307],[55,1.371593501004095e307],[56,6.13956991804191e307],[57,1.5593790524732488e307],[58,2.4116487656633906e307],[59,6.108553555931735e307],[60,4.633679694988548e307],[61,2.408883627717832e307],[62,7.696049356322011e307],[63,3.796698473253951e307],[64,7.272505287893932e307],[65,9.850214641870329e307],[66,2.9788312407864814e307],[67,1.217897796646603e307],[68,8.005268205656468e307],[69,7.261209972441176e307],[70,1.6320629840265537e307],[71,4.94761460409424e307],[72,2.601892122410636e307],[73,7.443882012271289e307],[74,2.1962892102835533e307],[75,2.8923133227410834e307],[76,1.4259194192927462e307],[77,1.0467590622822731e307],[78,3.77676061549846e307],[79,8.153853097921673e307],[80,2.1164904816928597e307],[81,2.856473538413742e307],[82,8.640774634315918e307],[83,4.614176481937673e307],[84,5.227366370857555e307],[85,3.24219016625781e307],[86,2.315843398267405e307],[87,3.142743602909226e307],[88,5.169814766765893e307],[89,3.191087862254074e307],[90,1.3834540257719918e307],[91,3.1532889057165483e307],[92,3.637935054363517e307],[93,7.136583754501707e307],[94,3.9420268119312606e307],[95,4.937308418199656e307],[96,2.567890065050876e307],[97,9.62719472042902e307],[98,8.065810809121164e307],[99,5.229829819976837e307],[100,2.1043027829078946e307],[101,2.2051667554582525e307],[102,1.1693939789415108e307],[103,6.285608651645671e307],[104,7.262370199332233e307],[105,9.579579911536877e307],[106,7.197036758156811e307],[107,8.840905594838243e307],[108,7.441556545691613e307],[109,9.82269594677941e307],[110,1.36726674742365e307],[111,2.78412569306441e307],[112,5.113976903408658e307],[113,6.589933962193681e307],[114,2.17651308127639e307],[115,1.396514350322634e307],[116,5.800364443018914e307],[117,5.313325196137211e307],[118,6.311173334731253e307],[119,4.926143660752854e307],[120,3.4428963867860506e307],[121,5.006021268496975e307],[122,9.255712414470177e307],[123,7.698312450907042e307],[124,6.15508708475221e307],[125,1.0074173915024108e307],[126,6.058056236700429e307],[127,9.971058021115813e307],[128,9.514008095099334e307],[129,6.834586041851257e307],[130,8.847127318617485e307],[131,4.17001417933092e307],[132,6.380005218844455e307],[133,8.98830121597813e307],[134,1.2072500663399105e307],[135,9.22190473127061e307],[136,5.950849408890453e307],[137,8.200200345713352e307],[138,9.412668074925946e307],[139,2.574757200471198e307],[140,6.47530104052169e307],[141,1.853145880260808e307],[142,4.587559917337617e307],[143,9.769520916282892e307],[144,8.246610859207915e307],[145,7.555833948904061e307],[146,8.447288888198189e307],[147,1.7551269341268156e307],[148,4.99411468876718e307],[149,6.821854621049486e307],[150,1.579792910466723e307],[151,1.8916088765714955e307],[152,2.4003431605083423e307],[153,1.9616446369914737e307],[154,8.771026339132761e307],[155,9.72450842571205e307],[156,2.1017102152519257e307],[157,9.190009559940962e307],[158,3.3060303941499504e307],[159,1.0830885405195684e307],[160,2.3125806486451855e307],[161,1.6344428073960892e307],[162,2.7840766887469774e307],[163,5.37291496409877e307],[164,8.205142062786488e307],[165,3.1112343927557496e307],[166,7.783702884278098e307],[167,1.0452965803959451e307],[168,6.988425257971669e307],[169,3.086037024145276e307],[170,3.2306025887946597e307],[171,5.339705646028536e307],[172,6.009470156491103e307],[173,2.2122293156318557e307],[174,4.895180194512219e307],[175,4.450407410630146e307],[176,7.564719114239139e307],[177,3.145677763166953e307],[178,4.710333157655215e307],[179,4.119115767827133e307],[180,5.662080625104246e307],[181,9.70578108914945e307],[182,7.196508436662423e307],[183,9.26200659983519e307],[184,3.1633297503593696e307],[185,9.344654016890358e307],[186,7.207146949288486e307],[187,4.3795476229442277e307],[188,6.410175014599629e307],[189,7.383927482587271e307],[190,5.547113496164573e307],[191,7.862008393924792e307],[192,4.993330853578506e307],[193,3.7065662896191774e307],[194,1.009517417155804e307],[195,6.867355174713665e307],[196,9.903560021315224e307],[197,3.386932193363461e307],[198,9.078366090598178e307],[199,4.906668662586232e307],[200,7.906005776982499e307],[201,2.3824782257383125e307],[202,5.679564244208513e307],[203,2.052022039718074e307],[204,7.792494697777584e307],[205,9.477372142796747e307],[206,6.635446949085337e307],[207,9.95373276893311e307],[208,3.8108476191638297e307],[209,1.8190077749992862e307],[210,8.862978838802499e307],[211,6.908650527344226e307],[212,8.330245114055456e307],[213,3.1263851413508527e307],[214,3.2094729068859525e307],[215,4.878758967255739e307],[216,1.1965823778627417e307],[217,8.4325606127281e307],[218,8.521046098350088e307],[219,9.008554302021519e307],[220,4.714050526255698e307],[221,1.5786026179312017e307],[222,5.957542066729034e307],[223,9.377659467443362e307],[224,7.133670745493146e307],[225,9.228931284053678e307],[226,8.766068670598255e307],[227,4.50132721876185e307],[228,2.761102968570498e307],[229,3.5282244741404525e307],[230,3.962339921432778e307],[231,9.665207840722775e307],[232,1.0386975928380881e307],[233,1.317611716919277e307],[234,6.131920254632748e307],[235,3.492604597922767e307],[236,4.93139579443937e307],[237,2.613201934096772e307],[238,6.777572575839438e307],[239,7.752276602865232e307],[240,6.006722692811431e307],[241,7.702095377722768e307],[242,8.773558604002284e307],[243,1.0036773916404639e307],[244,1.1559747807680801e307],[245,5.751073295750128e307],[246,7.824674724582971e307],[247,9.294421629395608e307],[248,2.487082976998732e307],[249,4.1596547466761103e307],[250,2.4334278252771605e307],[251,1.9158810795510734e307],[252,9.928102434679417e307],[253,7.167129032297305e307],[254,3.511147398873307e307],[255,9.629003984233106e307],[256,1.1224407600581254e307],[257,7.13920912071801e307],[258,5.813408643265555e307],[259,5.001794247158856e307],[260,9.103298938428898e307],[261,4.606598455802841e307],[262,3.8140596071864084e307],[263,1.2781511704615514e307],[264,5.204431067248931e307],[265,3.919171800686964e307],[266,9.554470903276127e307],[267,1.9323620433448886e307],[268,7.310635378800372e307],[269,3.636633815890085e307],[270,1.1432707974589943e307],[271,1.6050735322853493e307],[272,1.4502596310839625e307],[273,2.5686197466150196e307],[274,9.629910646553415e307],[275,5.351385818257151e307],[276,3.8465752505389974e307],[277,7.05025645920112e307],[278,7.541588684554092e307],[279,4.4413471565823516e307],[280,4.3742566331069635e307],[281,5.291513421439586e307],[282,5.099625844578498e307],[283,6.62423815308036e307],[284,7.43662603551727e307],[285,1.211758510725099e307],[286,8.105486666186405e307],[287,8.99547706717512e307],[288,8.278759598961786e307],[289,1.3707009634288314e307],[290,5.552206660313306e307],[291,9.14011223661041e307],[292,7.855867515354157e307],[293,4.87562384204934e307],[294,3.955649100764671e307],[295,4.573180045135709e307],[296,6.972114994402689e307],[297,2.8105423495966644e307],[298,1.6392869187740433e307],[299,1.4339607818659832e307],[300,9.18612252189016e307],[301,9.618355285021303e307],[302,6.112012092747776e307],[303,4.923312256580887e307],[304,8.868824297315767e307],[305,6.210825606344273e307],[306,5.623873673153573e307],[307,5.579214354613288e307],[308,7.508670642905466e307],[309,3.698165125312669e307],[310,7.735216324773042e307],[311,4.006256921919418e307],[312,5.573609381607216e307],[313,1.9608025066814378e307],[314,2.7838761131041465e307],[315,7.553490831002618e307],[316,3.5251233847961595e307],[317,6.028788356322556e307],[318,4.243902937986857e307],[319,6.69180588983441e307],[320,1.3686330849396029e307],[321,2.9935330768678993e307],[322,2.85049381521107e307],[323,3.9012341172395073e307],[324,3.1962994316749893e307],[325,1.6571408560038803e307],[326,7.630880689367794e307],[327,7.726353690115212e307],[328,1.17711612082019e307],[329,9.206461866179672e307],[330,5.561460681594542e307],[331,1.517582731273497e307],[332,2.772047785381572e307],[333,6.575698565281917e307],[334,2.3537206343272087e307],[335,5.431238962757352e307],[336,9.636744932001615e307],[337,6.988175181266892e307],[338,6.808274853644974e307],[339,8.997904018487074e307],[340,6.310848543228463e307],[341,3.162020062907145e307],[342,5.922279516455878e307],[343,3.4044070552515374e307],[344,6.221741270116318e307],[345,5.779213276319275e307],[346,9.646849956150499e307],[347,6.372199587728235e307],[348,3.9232349983320127e307],[349,4.4315690473150836e307],[350,1.788995278677522e307],[351,2.359779715013311e307],[352,4.800435256891746e307],[353,6.45535126351271e307],[354,4.617712092058642e307],[355,2.321094781242963e307],[356,6.411859928332581e307],[357,3.1304683743788885e307],[358,1.2042020758470231e307],[359,4.4030582519448383e307],[360,9.42760336727574e307],[361,6.612167436415329e307],[362,2.587353251400225e307],[363,5.071404526908556e307],[364,9.175130921588786e307],[365,5.591321424899272e307],[366,7.847183746832531e307],[367,6.546596495183466e307],[368,2.272857990187773e307],[369,1.2331098489753137e307],[370,9.219125482132045e307],[371,6.886492636915111e307],[372,1.8177459490010773e307],[373,8.234729490200285e307],[374,2.6621171046668487e307],[375,1.4052222115687952e307],[376,2.0506871513591277e307],[377,9.239991501542567e307],[378,7.751499847424856e307],[379,7.044048168037932e307],[380,6.726212915742559e307],[381,1.9652165262744893e307],[382,2.2433514396952432e307],[383,9.343955204953473e307],[384,8.327489475062243e307],[385,2.9851086528455575e307],[386,6.985077312401063e307],[387,1.836779905088346e307],[388,3.93599225637253e307],[389,7.360116687132885e307],[390,6.573543018035343e307],[391,6.597696784976494e307],[392,3.670482985154141e307],[393,7.137446927610519e307],[394,4.0071643751581866e307],[395,5.074401265972189e307],[396,2.3208042913372836e307],[397,4.364056308008988e307],[398,1.0671566540880869e307],[399,7.988430038042559e307],[400,7.150358745185814e307],[401,2.0581733166034958e307],[402,2.334260908358888e307],[403,3.8344620229041827e307],[404,3.434009559939365e307],[405,6.67667601953075e307],[406,3.1750006950150223e307],[407,7.043773022874203e307],[408,8.200290748147064e307],[409,4.514896391944205e307],[410,4.964326639913988e307],[411,6.348200086137984e307],[412,5.781051986695175e307],[413,4.0930652966509375e307],[414,3.8324725261678116e307],[415,1.2147801804559344e307],[416,5.202063887550235e307],[417,1.979396867382726e307],[418,3.8302731364664977e307],[419,3.869177032604323e307],[420,7.779409707976619e307],[421,8.846971381176633e307],[422,9.797707605584317e307],[423,8.613380857696986e307],[424,3.7803598415090455e307],[425,5.216241241890635e307],[426,2.2589244616938126e307],[427,3.7899284946242664e307],[428,6.554497142152899e307],[429,6.028851381148694e307],[430,6.53778482240095e307],[431,4.4132679057592984e307],[432,5.672972733560079e307],[433,4.863114842280672e307],[434,5.197194371595281e307],[435,4.218491556846905e307],[436,9.272233418042402e307],[437,7.918827679383662e307],[438,3.2260039280297204e307],[439,1.4304055506027474e307],[440,8.140574749958926e307],[441,8.596646714935788e307],[442,2.355047328675273e307],[443,2.879082896949454e307],[444,3.7461338803906473e307],[445,2.0523572121504247e307],[446,8.731773556885989e307],[447,2.272483240278914e307],[448,2.3070564630966793e307],[449,7.311437457504171e307],[450,2.0024670261598304e307],[451,7.141263983699933e307],[452,4.027331299011233e307],[453,7.276606068457241e307],[454,8.5716833877062e307],[455,2.4904340977639303e307],[456,9.497356729806719e307],[457,4.1151921033206763e307],[458,7.365472333801864e307],[459,7.53695522034238e307],[460,6.672500976095242e307],[461,7.901119747686542e307],[462,4.129351231453383e307],[463,7.599254641640102e307],[464,2.579748504235729e307],[465,4.1124102026124977e307],[466,2.704965218630988e307],[467,9.117257310480306e307],[468,2.6663600012203193e307],[469,7.879984876582535e307],[470,3.6551492591947176e307],[471,3.7344880812156276e307],[472,6.593879871957297e307],[473,8.783616687142438e307],[474,7.617711960433904e307],[475,1.8336726666651126e307],[476,2.5404345284591596e307],[477,9.444203593289671e307],[478,8.619945477375327e307],[479,2.444426572372299e307],[480,4.538756577098122e307],[481,3.808684028607883e307],[482,6.986371167433305e307],[483,8.248462388466182e307],[484,5.929080476212301e307],[485,9.855958562678653e307],[486,4.244026858582236e307],[487,2.577210241040301e307],[488,3.3799958504348093e307],[489,9.807821914878976e307],[490,1.4050126604102218e307],[491,6.95821496024153e307],[492,9.21925741873676e307],[493,6.07367708339287e307],[494,7.464681544307899e307],[495,2.6592406154508253e307],[496,3.505709645719154e307],[497,7.833391212882516e307],[498,5.786577010038179e307],[499,8.704559344782392e307],[500,5.859836601783424e307],[501,1.7184516752682847e307],[502,2.5650752370082926e307],[503,5.398380561956994e307],[504,9.988905221701953e307],[505,4.511473287823816e307],[506,6.044831368999708e307],[507,1.9634854777929283e307],[508,2.531038169195664e307],[509,4.68270166134922e307],[510,1.966693018517132e307],[511,1.775097339119434e307],[512,9.57347677122492e307],[513,3.9706220163269924e307],[514,9.14646468077784e307],[515,1.9437717029339636e307],[516,2.186299761597924e307],[517,3.4949061040245935e307],[518,7.11567728797681e307],[519,5.719802236775215e307],[520,6.086222997748278e307],[521,8.502262125905428e307],[522,1.2901000532477565e307],[523,3.629687570230045e307],[524,5.211487144669836e307],[525,1.1472561352543002e307],[526,5.645231382371881e307],[527,4.2357606569157715e307],[528,4.503183384568538e307],[529,2.1232729106852554e307],[530,9.317787560911774e307],[531,8.439761501684221e307],[532,6.638452569021536e307],[533,1.938598968525688e307],[534,9.856893773250221e307],[535,6.183174718538196e307],[536,3.65866631696504e307],[537,7.504494105993668e307],[538,7.793522240664865e307],[539,9.400365398264136e307],[540,1.8943272615417774e307],[541,9.957888892487125e307],[542,4.743488159723809e307],[543,9.588038378795043e307],[544,6.420835680300303e307],[545,4.673355529329707e307],[546,7.073696754578108e307],[547,4.1672171366538835e307],[548,6.953172339194151e307],[549,2.2086578563649988e307],[550,5.057301425948961e307],[551,2.688296051494823e307],[552,9.580693262301608e307],[553,9.07067208630047e307],[554,5.042577246027071e307],[555,7.149488509554281e307],[556,8.218047266815209e307],[557,4.909153527573525e307],[558,1.7187558646473203e307],[559,2.6707179754380985e307],[560,3.7087816145969423e307],[561,9.999697366991435e307],[562,5.200040819796303e307],[563,6.169264149046053e307],[564,8.492458140417154e307],[565,2.0171207066537603e307],[566,9.02660964965476e307],[567,7.629880262955577e307],[568,5.534212272886614e307],[569,5.184131785737374e307],[570,5.924954373226264e307],[571,8.978148028716026e307],[572,6.747647954240405e307],[573,6.325715675710891e307],[574,3.5346237388058634e307],[575,2.0750637900389214e307],[576,7.173327288033585e307],[577,1.0009456417076213e307],[578,3.8266250766218236e307],[579,6.974462478968961e307],[580,9.131064440380576e307],[581,6.647765114823694e307],[582,7.092388250708257e307],[583,5.967284196952817e307],[584,2.5965827389110795e307],[585,3.090270584885235e307],[586,9.97110855816683e307],[587,8.194542841881099e307],[588,5.282417319120665e307],[589,4.850953219350319e307],[590,9.571063250019215e307],[591,3.8057498451748374e307],[592,4.1781336317151686e307],[593,7.932972342007907e307],[594,8.137838894766584e307],[595,2.0740609916318225e307],[596,3.1022631458137375e307],[597,5.673209114018979e307],[598,8.983860789749939e307],[599,1.2306739280507452e307],[600,1.36903102810617e307],[601,8.349708353880342e307],[602,1.9440796380577858e307],[603,4.3350485103423076e307],[604,6.485239726072002e307],[605,1.5937968435607215e307],[606,6.261445261539055e307],[607,9.337134040303353e307],[608,5.172314776293521e307],[609,9.974980339902678e307],[610,9.267532349712101e307],[611,1.2368249329172793e307],[612,3.1367622613673876e307],[613,6.608518168812448e307],[614,3.183612115414575e307],[615,4.503682107679853e307],[616,4.938329133630848e307],[617,9.356881112332339e307],[618,5.906144845873651e307],[619,2.59669013964023e307],[620,9.359085141240315e307],[621,9.335456789957256e307],[622,8.597888281201229e307],[623,9.867543636801535e307],[624,4.236349806587445e307],[625,2.531998651708143e307],[626,6.164647460950428e307],[627,6.270829798826506e307],[628,4.0656283330238554e307],[629,5.079295709052801e307],[630,9.60345508703207e307],[631,8.923877678068366e307],[632,3.883759178979508e307],[633,2.845966876847147e307],[634,9.199285092348118e307],[635,2.237263423432813e307],[636,9.984532827250772e307],[637,3.276844281767369e307],[638,5.67302028275492e307],[639,7.43512311079087e307],[640,1.4706419480005286e307],[641,5.0766599959862e307],[642,3.892056149302121e307],[643,6.225388102467188e307],[644,9.120538850593827e307],[645,1.5923919806882695e307],[646,4.25126289566097e307],[647,5.088342332605368e307],[648,9.922815560798238e307],[649,6.117057869621292e307],[650,9.779294696893623e307],[651,2.8630700099275144e307],[652,3.76803345268499e307],[653,9.296181073837154e307],[654,6.849417757585507e307],[655,9.509362092831875e307],[656,3.892980156926298e307],[657,9.941141559733579e307],[658,1.5834456321390368e307],[659,5.88407252550554e307],[660,9.771461104630746e307],[661,3.6229938302477127e307],[662,3.4779454832456856e307],[663,7.285102072069346e307],[664,9.633727475458923e307],[665,5.804393244116871e307],[666,5.561127915591995e307],[667,4.4902258454548415e307],[668,3.4114057797466413e307],[669,6.384896657986916e307],[670,1.8241161152152013e307],[671,1.1332837537189637e307],[672,1.31212973080541e307],[673,9.787512629875827e307],[674,6.839823944682403e307],[675,3.507410330218714e307],[676,8.813053383982692e307],[677,9.953928469788619e307],[678,1.0013826563509523e307],[679,6.358615025739269e307],[680,5.79150404327687e307],[681,9.633759740401511e307],[682,3.5923064757569434e307],[683,1.2917094905175483e307],[684,4.133454433664976e307],[685,8.304053740664751e307],[686,6.669652124651584e307],[687,6.779670695766444e307],[688,7.481570842862952e307],[689,9.418233678874262e307],[690,1.114511122257138e307],[691,6.149884555279432e307],[692,5.040088779175789e307],[693,7.437415762661709e307],[694,5.382088061426628e307],[695,1.5309892392581658e307],[696,7.16676983028825e307],[697,1.0147063544253842e307],[698,8.53408781182235e307],[699,5.9764332881508e307],[700,8.154028543509843e307],[701,9.41195925961056e307],[702,5.971146519580579e307],[703,4.495994179212309e307],[704,9.16183617897701e307],[705,2.361846683538901e307],[706,8.164022579947416e307],[707,3.303976554635624e307],[708,2.6313438970312597e307],[709,6.457147026699142e307],[710,1.1356397185733474e307],[711,5.782085318450447e307],[712,5.45761932401547e307],[713,3.646767277505969e307],[714,6.993643066252177e307],[715,4.683851936865708e307],[716,3.331997443454384e307],[717,6.367611527920573e307],[718,6.906828030878221e307],[719,5.09817539822578e307],[720,9.72402402114044e307],[721,2.306133936847106e307],[722,9.24650852585633e307],[723,1.2231271271630546e307],[724,5.351714644355943e307],[725,7.11281833777874e307],[726,7.668246350366372e307],[727,1.497003021018482e307],[728,2.910772536784403e307],[729,3.40148390072316e307],[730,3.0202645160851516e307],[731,1.224059160096808e307],[732,3.417804136552261e307],[733,6.493258983446957e307],[734,5.085819352069704e307],[735,6.950420803488447e307],[736,5.476072472705253e307],[737,8.678007469116438e307],[738,1.1471262608311323e307],[739,3.321569969124092e307],[740,4.4550492906337693e307],[741,4.3063834915165145e307],[742,2.2299988276399674e307],[743,8.736187571591422e307],[744,9.01705857817933e307],[745,6.933879575951849e307],[746,8.525227716109903e307],[747,5.557179990315701e307],[748,9.242216500505762e307],[749,3.0269828621652667e307],[750,8.438933892556219e307],[751,1.7929455149323716e307],[752,4.0092608270558337e307],[753,9.705362340578202e307],[754,4.1643732777204666e307],[755,7.98889879772365e307],[756,5.163380372896424e307],[757,6.044839201846977e307],[758,1.0684187022066738e307],[759,4.163290312397546e307],[760,8.580377826090294e307],[761,6.076199803264666e307],[762,5.414337125046893e307],[763,8.618569799183178e307],[764,4.822251630868585e307],[765,6.287813083821333e307],[766,3.3478231356229372e307],[767,8.913884885562232e307],[768,7.045867582813832e307],[769,4.506029670379957e307],[770,6.321901142238416e307],[771,1.9172418158153183e307],[772,8.262106903458418e307],[773,3.6033492848933934e307],[774,2.413368063930862e307],[775,7.109959986185046e307],[776,8.36449646129758e307],[777,4.967178464428904e307],[778,4.143919107385231e307],[779,2.522265858267034e307],[780,7.468146405531343e307],[781,5.983648839049062e307],[782,6.405792689311139e307],[783,5.63472639194391e307],[784,8.22179394647837e307],[785,4.838502977174656e307],[786,1.3119166399403187e307],[787,2.2394027380493515e307],[788,1.3068980625633712e307],[789,2.457954274058942e307],[790,2.7485800195573363e307],[791,4.537335380546729e307],[792,1.6581651160517414e307],[793,2.5252236704924205e307],[794,7.586145632917558e307],[795,7.008651729259053e307],[796,4.1258808113747427e307],[797,5.030019162787785e307],[798,9.667511627917706e307],[799,6.310597055427954e307],[800,2.9876040552024336e307],[801,6.578721060726867e307],[802,2.7687747794841634e307],[803,4.511280683398053e307],[804,3.0755574248655526e307],[805,5.397491164658715e307],[806,7.0754838408477e307],[807,7.14106983327869e307],[808,3.795628842136077e307],[809,7.871856503823185e307],[810,2.291338760511401e307],[811,6.282150847655002e307],[812,5.683015353034896e307],[813,2.8590223252822276e307],[814,1.0544725482969226e307],[815,7.371003458782378e307],[816,6.017836784919461e307],[817,5.191419463249525e307],[818,7.173997035278132e307],[819,4.4218464830726346e307],[820,9.848441166629476e307],[821,7.601909118685909e307],[822,2.2498461021411333e307],[823,1.3332179521135923e307],[824,4.789457917764594e307],[825,2.6271574712367194e307],[826,3.4820869520590805e307],[827,3.653224956536387e307],[828,2.0314641947094385e307],[829,8.019360737036024e307],[830,2.477913828741598e307],[831,4.935312520320824e307],[832,4.75167258516674e307],[833,5.409464138843673e307],[834,7.206424775354784e307],[835,4.495209184682323e307],[836,5.447014553011199e307],[837,9.01999267469847e307],[838,3.6535675393682956e307],[839,2.9654342080659326e307],[840,6.921652293831245e307],[841,5.142579336952174e307],[842,6.554510545479278e307],[843,9.185341008668135e307],[844,7.255532037874777e307],[845,6.490885445946326e307],[846,7.062535777495866e307],[847,8.0124096700304e307],[848,9.702258409160174e307],[849,4.923071810772182e307],[850,6.851471918426716e307],[851,1.2523026492798998e307],[852,8.775981250811898e307],[853,9.444082027663237e307],[854,6.740395351237673e307],[855,3.115186681099904e307],[856,2.080114159714321e307],[857,8.69556305511562e307],[858,4.12831672252151e307],[859,2.2208492702639672e307],[860,5.867402596543405e307],[861,4.2857415793416767e307],[862,7.134577256129329e307],[863,9.266640793486533e307],[864,2.906152687829201e307],[865,9.684080719274448e307],[866,4.904805997150468e307],[867,9.279286684614581e307],[868,7.216884148185424e307],[869,1.7964830732279525e307],[870,1.7956988742652117e307],[871,6.637872853839699e307],[872,5.023330623858749e307],[873,4.3523273972896227e307],[874,4.2469965914838595e307],[875,4.1535034298143847e307],[876,8.173092761826307e307],[877,6.04529278353922e307],[878,4.179239195005615e307],[879,9.418105554863413e307],[880,3.7875202980428024e307],[881,7.335021239965761e307],[882,2.24952092240071e307],[883,2.9046844150589484e307],[884,7.115698764775824e307],[885,4.0038715578869697e307],[886,7.584094018812567e307],[887,5.751940532915479e307],[888,6.693183393634576e307],[889,2.493952459176042e307],[890,7.489861791019205e307],[891,8.513925402023798e307],[892,8.56499246184156e307],[893,6.491825222407917e307],[894,2.6394965778047466e307],[895,4.91075745118656e307],[896,5.407082600715842e307],[897,6.684483326377834e307],[898,3.1178652932055155e307],[899,2.6123871415852387e307],[900,9.273750531487477e307],[901,2.2318292972633935e307],[902,6.529034708955987e307],[903,2.2221334975811115e307],[904,9.360930218757423e307],[905,2.2351103058177914e307],[906,3.469981858855346e307],[907,8.427955350043277e307],[908,8.714946026599881e307],[909,9.797214463022997e307],[910,2.0601818305765996e307],[911,4.956702082861331e307],[912,6.799518977761248e307],[913,4.401700345370078e307],[914,4.500622088626054e307],[915,9.691222930107486e307],[916,1.28053320520073e307],[917,8.23423124760964e307],[918,2.9297896564482315e307],[919,2.689251109630945e307],[920,5.862291190114827e307],[921,3.9894483147308026e307],[922,2.1646199365957258e307],[923,3.071042206670673e307],[924,5.313720843209561e307],[925,4.375672645942713e307],[926,2.760957228060076e307],[927,5.333120461503014e307],[928,7.410576970304e307],[929,7.29297640657812e307],[930,6.770915015062162e307],[931,5.213556960139428e307],[932,3.644110376727893e307],[933,9.875156048692552e307],[934,7.338509409735581e307],[935,9.977957571294097e307],[936,1.926147864780749e307],[937,2.7535589955888107e307],[938,4.904291578647861e307],[939,1.257633579127226e307],[940,8.123717202691557e307],[941,1.194584042904421e307],[942,3.094322631527503e307],[943,3.455444502082208e307],[944,9.17405294848201e307],[945,5.949487559669599e307],[946,1.5403788532902179e307],[947,7.285140697755955e307],[948,2.9562536980901845e307],[949,7.805361053167566e307],[950,2.3467019159310376e307],[951,1.3436918097507766e307],[952,1.619272505078479e307],[953,9.823822667802761e307],[954,5.192117510219619e307],[955,7.360555740478095e307],[956,8.656483305763354e307],[957,3.5130484960691367e307],[958,2.0517252560945612e307],[959,2.8969397824212305e307],[960,3.0179977489501826e307],[961,7.841555833093547e307],[962,5.327868721556427e307],[963,2.814257476319956e307],[964,8.395494267301772e307],[965,1.0236996832658166e307],[966,1.4233876002423715e307],[967,2.1443113560016997e307],[968,1.899395294656862e307],[969,7.847139716270173e307],[970,9.026914551685043e307],[971,6.966525092725926e307],[972,6.967147989428674e307],[973,1.9140970576354313e307],[974,5.24013120189104e307],[975,1.310273973900587e307],[976,3.0335571755558243e307],[977,1.7735596398953338e307],[978,7.463760765929444e307],[979,1.0728987309328567e307],[980,3.389613520400203e307],[981,3.410256197662396e307],[982,3.4926134610934246e307],[983,7.822040502626059e307],[984,4.771854483404671e307],[985,6.076209587250098e307],[986,4.277927597968162e307],[987,5.346581501764211e307],[988,1.9697079708358235e307],[989,2.001488366726188e307],[990,9.71129266372907e307],[991,5.234751447988923e307],[992,8.034932044486138e307],[993,4.548739916648223e307],[994,1.964421775316737e307],[995,2.9659151245680316e307],[996,8.122368798350711e307],[997,5.00562283425398e307],[998,9.448932239742214e307],[999,4.155815782637907e307],[1e3,3.058928118664166e307],[1001,4.4056782030311514e307],[1002,3.6085686992783227e307],[1003,7.084648953862759e307],[1004,3.780207775147169e307],[1005,4.2143862239997563e307],[1006,4.558100603871366e307],[1007,5.576188447633922e307],[1008,5.574070788649883e307],[1009,3.595081392849224e307],[1010,9.190602812481693e307],[1011,2.1353939337826417e307],[1012,9.69923209535006e307],[1013,7.581486479776752e307],[1014,6.577949666816803e307],[1015,2.2121764282758973e307],[1016,9.200939463436338e307],[1017,3.359404044312213e307],[1018,9.54932892904945e307],[1019,7.898258385894467e307],[1020,9.200646194584357e307],[1021,4.879730399488358e307],[1022,1.1084619586526312e307],[1023,1.1065328198009272e307],[1024,4.640648728414147e307],[1025,8.969557562106253e307],[1026,4.0796601361842376e307],[1027,4.162492261872486e307],[1028,8.322530091636169e307],[1029,9.54626937113003e307],[1030,4.1114130452386277e307],[1031,5.047307348390254e307],[1032,2.581731470613088e307],[1033,8.724268806246016e307],[1034,3.4560694740785726e307],[1035,2.6647741629067024e307],[1036,3.003663298559015e307],[1037,3.737337518126335e307],[1038,6.918389515187124e307],[1039,7.677851692811058e307],[1040,5.183339799713782e307],[1041,2.602100502358743e307],[1042,6.148201922405825e307],[1043,7.857740940380342e307],[1044,4.884345620158622e307],[1045,8.061908063677871e307],[1046,1.385181224013516e307],[1047,5.217611802998745e307],[1048,2.7273089904382606e307],[1049,6.876348750887004e307],[1050,5.342981002474632e307],[1051,5.169617986771512e307],[1052,2.5924584485226523e307],[1053,6.601419204524593e307],[1054,9.49069770406236e307],[1055,5.214267863661927e307],[1056,4.1030712219437493e307],[1057,6.819082331667732e307],[1058,8.257423922087621e307],[1059,5.453452081493251e307],[1060,7.976905584571925e307],[1061,3.1403147437847924e307],[1062,9.00551128598376e307],[1063,9.464291625024215e307],[1064,3.6591940962412274e307],[1065,9.833363569402772e307],[1066,5.027278609688866e307],[1067,6.434443830287359e307],[1068,2.033619425050509e307],[1069,7.578731746789422e307],[1070,6.256528829780479e307],[1071,3.3853850397367114e307],[1072,7.34288861722374e307],[1073,2.394195216603502e307],[1074,7.16536410557624e307],[1075,1.0168249203013868e307],[1076,2.4057166860122226e307],[1077,2.540100230649154e307],[1078,9.420432247703963e307],[1079,1.771426053547685e307],[1080,8.87870447329469e307],[1081,6.985900222648413e307],[1082,3.746119945624481e307],[1083,1.5528546784934236e307],[1084,1.6126470256117473e307],[1085,1.8264087141482912e307],[1086,3.5970410365989205e307],[1087,9.550385928439804e307],[1088,9.478476256328607e307],[1089,5.292383425444425e307],[1090,6.713719410316304e307],[1091,8.778127624525158e307],[1092,2.881465670661039e307],[1093,2.056906430898955e307],[1094,4.762670072606581e307],[1095,8.473706877104044e307],[1096,1.8419577567591053e307],[1097,7.906238595699481e307],[1098,2.0326112316471785e307],[1099,2.645016617922801e307],[1100,2.6163141174955877e307],[1101,8.511608631897824e307],[1102,9.265638945848806e307],[1103,8.739242779425623e307],[1104,1.3075788110955977e307],[1105,8.75705179509335e307],[1106,7.557675081103004e307],[1107,8.552096972575009e307],[1108,1.288672762079314e307],[1109,6.571413211382314e307],[1110,3.129578475563969e307],[1111,9.401007828547944e307],[1112,6.49185826596977e307],[1113,4.61526844106788e307],[1114,9.445915205509104e307],[1115,5.669576573969522e307],[1116,4.1756819539682143e307],[1117,6.962555360335211e307],[1118,5.22888890161453e307],[1119,7.822788507006842e307],[1120,1.3295993297919262e307],[1121,2.3293582371980636e307],[1122,4.488347943332771e307],[1123,7.034609961405534e307],[1124,8.952735283170461e307],[1125,7.328575777471828e307],[1126,2.699908139832076e307],[1127,4.889004860694684e307],[1128,2.6769171575681774e307],[1129,7.945712763281818e307],[1130,2.3875885673707226e307],[1131,1.545470115620102e307],[1132,7.440978230034134e307],[1133,3.8386743183089645e307],[1134,9.076128343008847e307],[1135,9.690615610199524e307],[1136,9.525594296050272e307],[1137,1.2760150242968503e307],[1138,4.4347869523966044e307],[1139,5.46157722228451e307],[1140,6.593486844059307e307],[1141,1.4558137878624445e307],[1142,2.2113123306572552e307],[1143,7.810485163820699e307],[1144,8.537195671946146e307],[1145,1.4892030886150392e307],[1146,1.4622703527875262e307],[1147,2.0653421152705857e307],[1148,9.78495972542486e307],[1149,5.059696071492518e307],[1150,9.487706194044748e307],[1151,1.8708939495807245e307],[1152,1.3508827580954707e307],[1153,7.739856779941692e307],[1154,1.0885185401028452e307],[1155,4.33719400672842e307],[1156,5.129718170707409e307],[1157,8.645605239289864e307],[1158,7.888261120036518e307],[1159,7.467898525707844e307],[1160,3.9055609270843874e307],[1161,3.098904088481467e307],[1162,7.750886922673183e307],[1163,5.780062562742004e307],[1164,5.739447453122981e307],[1165,5.85877617396989e307],[1166,6.140714315189968e307],[1167,9.1711058245776e307],[1168,1.3092022807685053e307],[1169,6.593826465479326e307],[1170,4.2317799901754637e307],[1171,3.6872111669739704e307],[1172,1.0151444022601318e307],[1173,3.280456560920057e307],[1174,6.881693177150375e307],[1175,2.4271229579568006e307],[1176,6.007490428928923e307],[1177,8.970309844327507e307],[1178,9.382648979779894e307],[1179,3.669052560187434e307],[1180,1.6662141965680732e307],[1181,7.271492670360016e307],[1182,7.312950110776139e307],[1183,2.7466127020999614e307],[1184,9.114092478911702e307],[1185,9.21840254000418e307],[1186,1.9791965347884604e307],[1187,7.590736843847149e307],[1188,1.4766325576359902e307],[1189,1.312467225998812e307],[1190,9.777832181134e307],[1191,3.056563324762491e307],[1192,5.274665301786187e307],[1193,2.957554785338095e307],[1194,9.315459194589867e307],[1195,2.6569652374387427e307],[1196,6.714100517603412e307],[1197,6.474107208864106e307],[1198,4.91594604146923e307],[1199,3.8542130378394533e307],[1200,6.219906955857082e307],[1201,1.4290986469177532e307],[1202,8.302023716668003e307],[1203,5.711729481020221e307],[1204,1.3111192314005257e307],[1205,1.9404295761493695e307],[1206,2.1375310259232285e307],[1207,7.270268542879063e307],[1208,9.343880349228121e307],[1209,4.3190587164929927e307],[1210,9.03077982951743e307],[1211,6.012435294423029e307],[1212,4.510431117298553e307],[1213,2.843532337136652e307],[1214,5.079071605808671e307],[1215,9.596803776408165e307],[1216,3.085789223836978e307],[1217,1.4327265682099734e307],[1218,2.014378185875938e307],[1219,7.756769445276956e307],[1220,4.947522667225263e307],[1221,9.974363208510512e307],[1222,4.516566290276646e307],[1223,5.483613606915864e307],[1224,1.9144185074605413e307],[1225,1.8540911185275044e307],[1226,3.7939639280163826e307],[1227,5.345093713872742e307],[1228,2.9459374994828437e307],[1229,8.468837638926567e307],[1230,8.573274775500499e307],[1231,3.418095515954693e307],[1232,6.78358369662015e307],[1233,2.1098657211638755e307],[1234,8.756879260152529e307],[1235,8.05524512224205e307],[1236,9.25113126646114e307],[1237,7.645096207966221e307],[1238,9.114544447500637e307],[1239,1.860126551507516e307],[1240,5.242895707700842e307],[1241,7.393334154028323e307],[1242,7.973928836781553e307],[1243,6.546064761471e307],[1244,8.743607579021968e307],[1245,5.943440625502637e307],[1246,8.880073317967919e307],[1247,3.306737340500402e307],[1248,7.551696003033895e307],[1249,9.70047494040293e307],[1250,4.2284028884903624e307],[1251,4.720616401908166e307],[1252,3.205575584936726e307],[1253,4.591756291964458e307],[1254,8.285820393195329e307],[1255,8.050477547766278e307],[1256,4.1534165363471087e307],[1257,9.9107262620818e307],[1258,7.856103740039237e307],[1259,7.792136047286864e307],[1260,8.71465478964434e307],[1261,2.6551595489247724e307],[1262,3.5035218510774313e307],[1263,2.9662498428462035e307],[1264,5.832062849024887e307],[1265,2.197154649652658e307],[1266,4.754804069216616e307],[1267,6.044764760024305e307],[1268,9.264334245743794e307],[1269,5.502524119942286e307],[1270,5.099504016125241e307],[1271,1.7099305012997225e307],[1272,2.7324016930253523e307],[1273,5.319258514994197e307],[1274,9.636061205301685e307],[1275,4.0348128508373815e307],[1276,3.6054442850971204e307],[1277,5.830698958335896e307],[1278,6.682520601156735e307],[1279,5.321268827761382e307],[1280,1.1732041771741283e307],[1281,7.306410655127388e307],[1282,3.0579961695815606e307],[1283,4.3961912532452807e307],[1284,4.60082171436114e307],[1285,9.837086161376118e307],[1286,2.6951477094163257e307],[1287,2.996325725297345e307],[1288,4.081490082407636e307],[1289,4.379538780464286e307],[1290,4.788890850773008e307],[1291,8.368099075625668e307],[1292,3.0869276093481646e307],[1293,5.455137980634196e307],[1294,7.916556587390102e307],[1295,5.370398180026027e307],[1296,5.38022434871704e307],[1297,8.480979771345142e307],[1298,3.8562234553066555e307],[1299,4.600100298227948e307],[1300,3.1262912019367826e307],[1301,7.720547153651778e307],[1302,2.095604447432981e307],[1303,7.727815980400192e307],[1304,6.266222410167729e307],[1305,3.846521127781467e307],[1306,5.456742796489791e307],[1307,8.819606199246365e307],[1308,1.7644183854305597e307],[1309,9.920283208871606e307],[1310,9.115885024882391e307],[1311,2.0297966268886774e307],[1312,7.50067476354507e307],[1313,9.664643157958467e307],[1314,7.282820372130672e307],[1315,1.4175658497212432e307],[1316,8.134347954712429e307],[1317,6.742397208785912e307],[1318,9.990181766036273e307],[1319,5.776756280120209e307],[1320,2.8305900450601993e307],[1321,1.7998594803709007e307],[1322,9.204399347712576e307],[1323,5.132719196541037e307],[1324,2.9295721034808386e307],[1325,1.3495617964013675e307],[1326,9.908680513926924e307],[1327,3.1326653531210034e307],[1328,2.418387846622901e307],[1329,8.460820949928752e307],[1330,3.892049823674282e307],[1331,1.7097765722619202e307],[1332,5.580257368797037e307],[1333,8.213044049598601e307],[1334,9.08184841154575e307],[1335,1.8331650130715585e307],[1336,5.802514800626426e307],[1337,7.385382293216806e307],[1338,2.1304670248249335e307],[1339,3.36018819104874e307],[1340,7.3844558855787e307],[1341,6.01954114985537e307],[1342,9.321348017169033e307],[1343,7.056042141486143e307],[1344,8.727576077964451e307],[1345,9.287473442640416e307],[1346,4.0769871124042903e307],[1347,5.146369580622658e307],[1348,7.900381681657534e307],[1349,8.401258763624842e307],[1350,7.154411508755049e307],[1351,4.3186938611690274e307],[1352,2.4070218680818483e307],[1353,6.636379651718043e307],[1354,7.709143862455583e307],[1355,7.667214423289568e307],[1356,9.514673137038598e307],[1357,2.1234249664247913e307],[1358,9.606946711898098e307],[1359,3.609123320275823e307],[1360,6.862338613489006e307],[1361,2.299348478496432e307],[1362,5.552427361452851e307],[1363,6.637715192472248e307],[1364,7.990672972483443e307],[1365,4.806850984134632e307],[1366,1.1180627782201141e307],[1367,1.4695369149119197e307],[1368,7.226688794137656e307],[1369,3.258159690196737e307],[1370,3.6781246889214003e307],[1371,4.183271081051272e307],[1372,8.680871516977231e307],[1373,6.367115255507316e307],[1374,7.279901733467875e307],[1375,8.212022810521234e307],[1376,7.308497215707881e307],[1377,7.83721413008958e307],[1378,4.907957811557713e307],[1379,4.0071224705584096e307],[1380,5.038498749478016e307],[1381,5.206817411238602e307],[1382,4.456115647606812e307],[1383,2.2071161007734248e307],[1384,2.0807805275860009e307],[1385,2.1508560867191062e307],[1386,7.577242639977079e307],[1387,8.719603388076364e307],[1388,3.2880536644006165e307],[1389,1.7328793263486525e307],[1390,9.235014013389618e307],[1391,4.886987191817904e307],[1392,6.271012195395203e307],[1393,1.8014113443402174e307],[1394,5.69743882604202e307],[1395,9.59209044234012e307],[1396,6.545808655169816e307],[1397,5.922324318378423e307],[1398,4.570895437322247e307],[1399,6.125067071174163e307],[1400,2.9145728431606356e307],[1401,3.033955002879436e307],[1402,3.990534479543476e307],[1403,8.797487293701863e307],[1404,2.256067731048457e307],[1405,1.5865107824874825e307],[1406,2.1133614094795608e307],[1407,8.018526693623745e307],[1408,5.902401409281098e307],[1409,2.5016337999681616e307],[1410,3.3678414579795203e307],[1411,8.989003800799015e307],[1412,7.100644325716915e307],[1413,3.1219301264178707e307],[1414,7.771282679129566e307],[1415,6.103431746469104e307],[1416,3.4194860981107733e307],[1417,5.681013939352637e307],[1418,4.732485092478079e307],[1419,4.1521290624291843e307],[1420,9.74712502957187e307],[1421,9.087316409766206e307],[1422,2.558527468445403e307],[1423,1.8246163195263589e307],[1424,4.625761579011031e307],[1425,5.42539169278527e307],[1426,4.0528103181983035e307],[1427,3.288406217148684e307],[1428,5.270682692024097e307],[1429,2.252542974498728e307],[1430,7.184529892693391e307],[1431,9.75375314819604e307],[1432,1.1185100397038653e307],[1433,1.2853990736964293e307],[1434,1.0791756266614079e307],[1435,6.228284897946611e307],[1436,4.4676280477324415e307],[1437,3.953645938812811e307],[1438,6.610068549813605e307],[1439,9.233341360680163e307],[1440,7.784784646564534e307]]),
            he =
            (document.getElementById("ad-container"),
             document.getElementById("mainMenu")),
            ue = document.getElementById("enterGame"),
            fe = document.getElementById("promoImg"),
            de = document.getElementById("partyButton"),
            pe = document.getElementById("joinPartyButton"),
            ge = document.getElementById("settingsButton"),
            me = ge.getElementsByTagName("span")[0],
            ye = document.getElementById("allianceButton"),
            ke = document.getElementById("storeButton"),
            ve = document.getElementById("chatButton"),
            we = document.getElementById("gameCanvas"),
            be = we.getContext("2d"),
            xe = document.getElementById("serverBrowser"),
            Se = document.getElementById("nativeResolution"),
            Te = document.getElementById("showPing"),
            Ie =
            (document.getElementById("playMusic"),
             document.getElementById("pingDisplay")),
            Ee = document.getElementById("shutdownDisplay"),
            Me = document.getElementById("menuCardHolder"),
            Ae = document.getElementById("guideCard"),
            Pe = document.getElementById("loadingText"),
            Be = document.getElementById("gameUI"),
            Ce = document.getElementById("actionBar"),
            Oe = document.getElementById("scoreDisplay"),
            Re = document.getElementById("foodDisplay"),
            je = document.getElementById("woodDisplay"),
            _e = document.getElementById("stoneDisplay"),
            Ue = document.getElementById("killCounter"),
            De = document.getElementById("leaderboardData"),
            Le = document.getElementById("nameInput"),
            Fe = document.getElementById("itemInfoHolder"),
            ze = document.getElementById("ageText"),
            He = document.getElementById("ageBarBody"),
            Ve = document.getElementById("upgradeHolder"),
            qe = document.getElementById("upgradeCounter"),
            Ye = document.getElementById("allianceMenu"),
            We = document.getElementById("allianceHolder"),
            Xe = document.getElementById("allianceManager"),
            Ne = document.getElementById("mapDisplay"),
            Ge = document.getElementById("diedText"),
            Je = document.getElementById("skinColorHolder"),
            Ke = Ne.getContext("2d");
        (Ne.width = 300), (Ne.height = 300);
        var Qe = document.getElementById("storeMenu"),
            $e = document.getElementById("storeHolder"),
            Ze = document.getElementById("noticationDisplay"),
            et = f.hats,
            tt = f.accessories,
            nt = new h(c, N, s, o),
            it = "#525252",
            rt = "#3d3f42";

        function st(e) {
            X = e.teams;
        }
        var at = document.getElementById("featuredYoutube"),
            ot = [{
                name: "D_Alpha",
                link: "https://www.youtube.com/channel/UC2bRg4LFQLf0Zwkxz1skjIg",
            },
                 ],
            ct = ot[s.randInt(0, ot.length - 1)];
        at.innerHTML =
            "<a target='_blank' class='ytLink' href='" +
            ct.link +
            "'><i class='material-icons' style='vertical-align: top;'>&#xE064;</i> " +
            ct.name +
            "</a>";
        var lt = !0,
            ht = !1,
            ut = !1;

        function ft(e) {
            r.close(), dt(e);
        }

        function dt(e) {
            (he.style.display = "block"),
                (Be.style.display = "none"),
                (Me.style.display = "none"),
                (Ge.style.display = "none"),
                (Pe.style.display = "block"),
                (Pe.innerHTML =
                 e +
                 "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>");
        }
        (window.onblur = function() {
            lt = !1;
        }),
            (window.onfocus = function() {
            (lt = !0), R && R.alive && yn();
        }),
            (window.onload = function() {
            (ht = !0),
                v(),
                setTimeout(function() {
                k || (alert("Captcha failed to load"), window.location.reload());
            }, 2e4);
        }),
            (window.captchaCallback = function() {
            (ut = !0), v();
        }),
            (we.oncontextmenu = function() {
            return !1;
        });

        function pt() {
            var e,
                t,
                n = "",
                i = 0;
            for (var r in y.servers) {
                for (var s = y.servers[r], a = 0, c = 0; c < s.length; c++)
                    for (var l = 0; l < s[c].games.length; l++)
                        a += s[c].games[l].playerCount;
                i += a;
                var h = y.regionInfo[r].name;
                n += "<option disabled>" + h + " - " + a + " players</option>";
                for (var u = 0; u < s.length; u++)
                    for (var f = s[u], d = 0; d < f.games.length; d++) {
                        var p = f.games[d],
                            g = 1 * f.index + d + 1,
                            m =
                            y.server &&
                            y.server.region === f.region &&
                            y.server.index === f.index &&
                            y.gameIndex == d,
                            k =
                            h +
                            " " +
                            g +
                            " [" +
                            Math.min(p.playerCount, o.maxPlayers) +
                            "/" +
                            o.maxPlayers +
                            "]";
                        let e = y.stripRegion(r) + ":" + u + ":" + d;
                        m && (de.getElementsByTagName("span")[0].innerText = e),
                            (n +=
                             "<option value='" +
                             e +
                             "' " +
                             (m ? "selected" : "") +
                             ">" +
                             k +
                             "</option>");
                    }
                n += "<option disabled></option>";
            }
            (n += "<option disabled>All Servers - " + i + " players</option>"),
                (xe.innerHTML = n),
                "sandbox.moomoo.io" == location.hostname ?
                ((e = "Back to MooMoo"), (t = "//moomoo.io/")) :
            ((e = "Try the sandbox"), (t = "//sandbox.moomoo.io/")),
                (document.getElementById("altServer").innerHTML =
                 "<a href='" +
                 t +
                 "'>" +
                 e +
                 "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>");
        }

        function gt() {
            var e = new XMLHttpRequest();
            (e.onreadystatechange = function() {
                4 == this.readyState &&
                    (200 == this.status ?
                     ((window.vultr = JSON.parse(this.responseText)),
                      y.processServers(vultr.servers),
                      pt()) :
                     console.error(
                    "Failed to load server data with status code:",
                    this.status,
                ));
            }),
                e.open("GET", "/serverData", !0),
                e.send();
        }
        xe.addEventListener(
            "change",
            s.checkTrusted(function() {
                let e = xe.value.split(":");
                y.switchServer(e[0], e[1], e[2]);
            }),
        );
        var mt = document.getElementById("pre-content-container"),
            yt = null,
            kt = null;
        window.cpmstarAPI(function(e) {
            e.game.setTarget(mt), (kt = e);
        });
        var vt = 3e5,
            wt = 0,
            bt = 0;

        function xt() {
            if (!cpmstarAPI || !kt)
                return (
                    console.log("Failed to load video ad API", !!cpmstarAPI, !!kt),
                    void Tn()
                );
            (yt = new kt.game.RewardedVideoView("rewardedvideo")).addEventListener(
                "ad_closed",
                function(e) {
                    console.log("Video ad closed"), St();
                },
            ),
                yt.addEventListener("loaded", function(e) {
                console.log("Video ad loaded"), yt.show();
            }),
                yt.addEventListener("load_failed", function(e) {
                console.log("Video ad load failed", e), St();
            }),
                yt.load(),
                (mt.style.display = "block");
        }

        function St() {
            (mt.style.display = "none"), Tn();
        }

        function Tt(e, t, n) {
            if (R && e)
                if (
                    (s.removeAllChildren(Fe),
                     Fe.classList.add("visible"),
                     s.generateElement({
                        id: "itemInfoName",
                        text: s.capitalizeFirst(e.name),
                        parent: Fe,
                    }),
                     s.generateElement({
                        id: "itemInfoDesc",
                        text: e.desc,
                        parent: Fe
                    }),
                     n)
                );
                else if (t)
                    s.generateElement({
                        class: "itemInfoReq",
                        text: e.type ? "secondary" : "primary",
                        parent: Fe,
                    });
                else {
                    for (var i = 0; i < e.req.length; i += 2)
                        s.generateElement({
                            class: "itemInfoReq",
                            html: e.req[i] +
                            "<span class='itemInfoReqVal'> x" +
                            e.req[i + 1] +
                            "</span>",
                            parent: Fe,
                        });
                    e.group.limit &&
                        s.generateElement({
                        class: "itemInfoLmt",
                        text: (R.itemCounts[e.group.id] || 0) + "/" + e.group.limit,
                        parent: Fe,
                    });
                } else Fe.classList.remove("visible");
        }
        window.showPreAd = xt;
    var It, Et, Mt, Ar, Ez, At = [], Pt = [];
    var teamDetect = window.teamDetect = function(id){
        for(let i = 0; i < Pt.length; i += 2){
            if(id == Pt[i]){
                return true;
            }
        }
    }
        const Member = function(e){
            for(let i = 0; i < Pt.length; i += 2){
                if(e == Pt[i]) return true;
            };
            return false;
        }
        function Bt(e, t) {
            At.push({
                sid: e,
                name: t
            }), Ct();
        }

        function Ct() {
            if (At[0]) {
                var e = At[0];
                s.removeAllChildren(Ze),
                    (Ze.style.display = "block"),
                    s.generateElement({
                    class: "notificationText",
                    text: e.name,
                    parent: Ze,
                }),
                    s.generateElement({
                    class: "notifButton",
                    html: "<i style='font-size:28px;color:#cc5151;'>❎</i>",
                    parent: Ze,
                    onclick: function() {
                        Dt(0);
                    },
                    hookTouch: !0,//❎✅
                }),
                    s.generateElement({
                    class: "notifButton",
                    html: "<i style='font-size:28px;color:#8ecc51;'>✅</i>",
                    parent: Ze,
                    onclick: function() {
                        Dt(1);
                    },
                    hookTouch: !0,
                });
            } else Ze.style.display = "none";
        }

        function Ot(e) {
            X.push(e), "block" == Ye.style.display && Ut();
        }

        function Rt(e, t) {
            R && ((R.team = e), (R.isOwner = t), "block" == Ye.style.display && Ut());
        }

        function jt(e) {
            (Pt = e), "block" == Ye.style.display && Ut();
        }

        function _t(e) {
            for (var t = X.length - 1; t >= 0; t--) X[t].sid == e && X.splice(t, 1);
            "block" == Ye.style.display && Ut();
        }

        function Ut() {
            if (R && R.alive) {
                if (
                    (an(),
                     (Qe.style.display = "none"),
                     (Ye.style.display = "block"),
                     s.removeAllChildren(We),
                     R.team)
                )
                    for (var e = 0; e < Pt.length; e += 2)
                        !(function(e) {
                            var t = s.generateElement({
                                class: "allianceItem",
                                style: "color:" +
                                (Pt[e] == R.sid ? "#fff" : "rgba(255,255,255,0.6)"),
                                text: Pt[e + 1],
                                parent: We,
                            });
                            R.isOwner &&
                                Pt[e] != R.sid &&
                                s.generateElement({
                                class: "joinAlBtn",
                                text: "🥾",
                                onclick: function() {
                                    Lt(Pt[e]);
                                },
                                hookTouch: !0,
                                parent: t,
                            });
                        })(e);
                else if (X.length)
                    for (e = 0; e < X.length; ++e)
                        !(function(e) {
                            var t = s.generateElement({
                                class: "allianceItem",
                                style: "color:" +
                                (X[e].sid == R.team ? "#fff" : "rgba(255,255,255,0.6)"),
                                text: X[e].sid,
                                parent: We,
                            });
                            s.generateElement({
                                class: "joinAlBtn",
                                text: "Join",
                                onclick: function() {
                                    Ft(e);
                                },
                                hookTouch: !0,
                                parent: t,
                            });
                        })(e);
                else
                    s.generateElement({
                        class: "allianceItem",
                        text: "No Tribes Yet",
                        parent: We,
                    });
                s.removeAllChildren(Xe),
                    R.team ?
                    s.generateElement({
                    class: "allianceButtonM",
                    style: "width: 360px",
                    text: R.isOwner ? "Delete Tribe" : "Leave Tribe",
                    onclick: function() {
                        Ht();
                    },
                    hookTouch: !0,
                    parent: Xe,
                }) :
                (s.generateElement({
                    tag: "input",
                    type: "text",
                    id: "allianceInput",
                    maxLength: 7,
                    placeholder: "unique name",
                    ontouchstart: function(e) {
                        e.preventDefault();
                        var t = prompt("unique name", e.currentTarget.value);
                        e.currentTarget.value = t.slice(0, 7);
                    },
                    parent: Xe,
                }),
                 s.generateElement({
                    tag: "div",
                    class: "allianceButtonM",
                    style: "width: 140px;",
                    text: "Create",
                    onclick: function() {
                        zt();
                    },
                    hookTouch: !0,
                    parent: Xe,
                }));
            }
        }

        function Dt(e) {
            r.send("11", At[0].sid, e), At.splice(0, 1), Ct();
        }

        function Lt(e) {
            r.send("12", e);
        }

        function Ft(e) {
            r.send("10", X[e].sid);
        }

        function zt() {
            r.send("8", document.getElementById("allianceInput").value);
        }

        function Ht() {
            (At = []), Ct(), r.send("9");
        }
        var Vt,
            qt = [];

        function Yt(e, t) {
            for (var n = 0; n < qt.length; ++n)
                if (!qt[n].active) {
                    Vt = qt[n];
                    break;
                }
            Vt ||
                ((Vt = new(function() {
                (this.init = function(e, t) {
                    (this.scale = 0), (this.x = e), (this.y = t), (this.active = !0);
                }),
                    (this.update = function(e, t) {
                    this.active &&
                        ((this.scale += 0.05 * t),
                         this.scale >= o.mapPingScale ?
                         (this.active = !1) :
                         ((e.globalAlpha =
                           1 - Math.max(0, this.scale / o.mapPingScale)),
                          e.beginPath(),
                          e.arc(
                        (this.x / o.mapScale) * Ne.width,
                        (this.y / o.mapScale) * Ne.width,
                        this.scale,
                        0,
                        2 * Math.PI,
                    ),
                          e.stroke()));
                });
            })()),
                 qt.push(Vt)),
                Vt.init(e, t);
        }

        function Wt(e) {
            Et = e;
        }
        var Xt = 0;

        function Nt(e, t, n) {
            n
                ?
                e ?
                (null) :
            (R.tails[t] = 1) :
            e ?
                (null) :
            (R.skins[t] = 1),
                "block" == Qe.style.display && Gt();
        }

        function Gt() {
            if (R) {
                s.removeAllChildren($e);
                for (var e = Xt, t = e ? tt : et, n = 0; n < t.length; ++n)
                    t[n].dontSell ||
                        (function(n) {
                        var i = s.generateElement({
                            id: "storeDisplay" + n,
                            class: "storeItem",
                            onmouseout: function() {
                                Tt();
                            },
                            onmouseover: function() {
                                Tt(t[n], !1, !0);
                            },
                            parent: $e,
                        });
                        s.hookTouchEvents(i, !0),
                            s.generateElement({
                            tag: "img",
                            class: "hatPreview",
                            src: "../img/" +
                            (e ? "accessories/access_" : "hats/hat_") +
                            t[n].id +
                            (t[n].topSprite ? "_p" : "") +
                            ".png",
                            parent: i,
                        }),
                            s.generateElement({
                            tag: "span",
                            text: t[n].name,
                            parent: i
                        }),
                            (e ? R.tails[t[n].id] : R.skins[t[n].id]) ?
                            (e ? R.tailIndex : R.skinIndex) == t[n].id ?
                            s.generateElement({
                            class: "joinAlBtn",
                            style: "margin-top: 5px",
                            text: "Unequip",
                            onclick: function() {
                                Jt(0, e);
                            },
                            hookTouch: !0,
                            parent: i,
                        }) :
                        s.generateElement({
                            class: "joinAlBtn",
                            style: "margin-top: 5px",
                            text: "Equip",
                            onclick: function() {
                                Jt(t[n].id, e);
                            },
                            hookTouch: !0,
                            parent: i,
                        }) :
                        (s.generateElement({
                            class: "joinAlBtn",
                            style: "margin-top: 5px",
                            text: "Buy",
                            onclick: function() {
                                Kt(t[n].id, e);
                            },
                            hookTouch: !0,
                            parent: i,
                        }),
                         s.generateElement({
                            tag: "span",
                            class: "itemPrice",
                            text: t[n].price,
                            parent: i,
                        }));
                    })(n);
            }
        }
        function Bu(e, t) {
           if(Hacks) {
            Jt(e, 0);
            Jt(t, 1);
           }
        }
        function Jt(e, t, n) {
                e = Number(e);
                t = Number(t);
                n = (!t ? R.skins[e] : R.tails[e]);
                (!n && e) && e && window.location.href.includes('sandbox') && Kt(e, t);
                    r.send("13c", 0, e, t)
        }

        function Kt(e, t) {
            r.send("13c", 1, e, t);
        }

        function Qt() {
            (Qe.style.display = "none"), (Ye.style.display = "none"), an();
        }

        function $t(e, t) {
            e && (t ? (R.weapons = e) : (R.items = e));
            for (var n = 0; n < l.list.length; ++n) {
                var i = l.weapons.length + n;
                document.getElementById("actionBarItem" + i).style.display =
                    R.items.indexOf(l.list[n].id) >= 0 ? "inline-block" : "none";
            }
            for (n = 0; n < l.weapons.length; ++n)
                document.getElementById("actionBarItem" + n).style.display =
                    R.weapons[l.weapons[n].type] == l.weapons[n].id ?
                    "inline-block" :
                "none";
        }

        function Zt(e) {
            (M = e),
                (V = (e && window.devicePixelRatio) || 1),
                (Se.checked = e),
                I("native_resolution", e.toString()),
                un();
        }

        function en() {
            for (var e = "", t = 0; t < o.skinColors.length; ++t)
                e +=
                    t == ae ?
                    "<div class='skinColorItem activeSkin' style='background-color:" +
                    o.skinColors[t] +
                    "' onclick='selectSkinColor(" +
                    t +
                    ")'></div>" :
                "<div class='skinColorItem' style='background-color:" +
                    o.skinColors[t] +
                    "' onclick='selectSkinColor(" +
                    t +
                    ")'></div>";
            Je.innerHTML = e;
        }
        var tn = document.getElementById("chatBox"),
            nn = document.getElementById("chatHolder");

        function rn() {
            on
                ?
                setTimeout(function() {
                var e = prompt("chat message");
                e && sn(e);
            }, 1) :
            "block" == nn.style.display ?
                (tn.value && sn(tn.value), an()) :
            ((Qe.style.display = "none"),
             (Ye.style.display = "none"),
             (nn.style.display = "block"),
             tn.focus(),
             yn()),
                (tn.value = "");
        }
        let gameUi = true;
        let ElementsUI = ['allianceButton', 'allianceMenu', 'chatButton', 'storeButton', 'noticationDisplay', 'actionBar', 'resDisplay', 'ageBarContainer', 'ageText', 'upgradeCounter', 'upgradeHolder', 'topInfoHolder', 'mapDisplay'];
        const nightTarget = [24, 47, 82, .3];
        let Nights = 0;
        function phew(e){
            setTimeout(() => {
                r.send('ch', e);
            }, 600);
        };

        let Removing = false;
        function Bots(C, name){
            Removing = false;
            let Projects = ['fluorescent-elite-turtle','beaded-elemental-headlight','automatic-delightful-tumbleweed','surf-juicy-bandicoot','sordid-debonair-notebook','super-mire-ankylosaurus','psychedelic-awake-wisteria','power-verbose-raclette','sable-gregarious-star','carnation-triangular-crater','vagabond-alpine-apartment','somber-capable-temper','admitted-fork-polka','famous-lead-plant']
            for(let i = 0; i <= 20; i++) Projects.push(`${Projects[0]}${i}`);
            let Sockets = [];
            Projects.forEach(e => Sockets.push(new WebSocket(`wss://${e}.glitch.me/`)));
            Sockets.forEach(e => {
                async function Solve(Link){
                    return await new Promise(resolve => {
                        window.grecaptcha
                            .execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
                            action: "homepage"
                        })
                            .then(function(e) {
                            resolve(`${Link}&token=${encodeURIComponent(e)}`);
                        });
                    });
                }
                e.onclose = () => {
                    e.able = false;
                };
                e.onopen = () => {
                    e.able = true;
                    e.tick = setInterval(async () => {
                        if(e.able && document.wsURL && !e.sent && R){
                            async function Connect(){
                                let Link = await Solve(document.wsURL.split("&")[0]);
                                e.send(JSON.stringify({url: Link, name: "D_Alpha-YT", skin: 1, own: R, mode: {zombie: false, defense: false, multi: true, farm: false, chill: false, passive: false, gold: false, chat: true, sandbox: false}}));
console.log('Connecting Sockets');
                                return console.log('Connecting Sockets');
                            };// passive stand still // chill dont attack but follow, // zombie attack everyone , defense defends u with shield, multi broken, farm walks around randomly, gold goldbot, chat chats, sandbox places mills and walks around
                            if(C < 0) return e.close();
                            for(let i = 0; i < 5; i++) {
                                C > 0 && Connect();
                                C--;
                            };
                            e.sent = true;
                        } else if(e.able && e.sent && R){
                            if(Removing){
                                e.send('close');
                                e.close();
                            };
                            e.send(JSON.stringify(R));
                            e.send(JSON.stringify({zombie: false, defense: false, multi: true, farm: false, chill: false, passive: false, gold: false, chat: true, sandbox: false}));
                        };
                    }, 500);
                };
            });
        };
        function tp(LocationX, LocationY) {
            r.free(1e3, document.boko)
            r.send('33', Math.atan2(LocationY-R.y, LocationX-R.x));
        }
        document.boko = 1e8;
        function sn(e) {
            let myChat = e;
            let js = r;
            let h;
            r.send("ch", e.slice(0, 30));
            e = e.toLowerCase();
            if(e == ".nb"){
                nobull = !nobull;
                setTimeout(() => {
                    r.send(nobull+'-removebull');
                },500);
            }
            if(e == ".li"){
                laginsta = !laginsta;
                setTimeout(() => {
                    r.send(laginsta+'-laginsta');
                },500);
            }
            if(e == ".tp top right"){
                tp(14365,35)
            }
            if(e == ".tp top left"){
                tp(35,35)
            }
            if(e == ".tp bottom right"){
                tp(14365,14365)
            }
            if(e == ".tp bottom left"){
                tp(35,14365)
            }
            if(e == ".tp river"){
                tp(14365,7165);
            }
        }
    var btn = document.createElement("div");
    btn.innerHTML = "A-FINDER";
    btn.classList.add("storeTab");

    document.getElementById("storeMenu").children[0].appendChild(btn);

    var msgpack;
    function loadScript(src, cb=()=>{}) {
        let s = document.createElement("SCRIPT");
        s.src = src;
        document.body.appendChild(s);
        s.onload = cb;
    }
    loadScript("https://cdn.jsdelivr.net/npm/msgpack5@4.0.2/dist/msgpack5.min.js", () => {
        msgpack = msgpack5();
    });
    const SERVER_INDEXES = {
        //miami: "39",
        //frankfurt: "9",
        //london: "8",
        //sydney: "19",
        //siliconvalley: "12",
        //singapore: "40"
    }
    const sockets = [];
    const nativeWebSocket = window.WebSocket;


    window.WebSocket = function(...args){
        const socket = new nativeWebSocket(...args);
        sockets.push(socket);
        return socket;
    }

    var Botz = []
    var AllBots = []
    var countDisplay;
    var namesInput;
    var resultDisplay;
    var crashDisplay;
    var BotSpawned = false;
    function updateCountDisplay() {
        countDisplay && countDisplay.setText(genCountDisplayText(AllBots.length, Botz.length));
    }
    const BOTNAME = 'D_Alpha-YT';
    class Bot {
        constructor(ip) {
            this.onready = function(){};
            this.onclose = function(){};
            this.name = BOTNAME+"-a";
            this.namesFound = [];
            this.id = null;
            this.serverId = null;
            this.ip = ip
            AllBots.push(this);
            updateCountDisplay()

            window.grecaptcha.execute('6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ', { action: 'homepage' }).then(t => {
                this.token = t;

                this.socket = new WebSocket((this.ip ? `wss://ip_${this.ip}.moomoo.io:8008/?gameIndex=0` : sockets[0].url.split("&")[0]) + "&token=" + this.token);
                this.socket.binaryType = "arraybuffer";
                this.socket.onclose = () => {
                    Botz.splice(Botz.findIndex(e => e == this), 1);
                    updateCountDisplay()

                    this.onclose();
                }
                this.socket.onmessage = (message) => {
                    let raw = new Uint8Array(message.data);
                    let data = msgpack.decode(raw);

                    switch(data[0]) {
                        case "io-init":
                            this.onready();
                            this.spawn();
                            this.serverId = this.socket.url.slice(9, 41);
                            break;
                        case "1":
                            if(!this.id) {
                                this.id = data[1][0];
                                Botz.push(this);
                                updateCountDisplay()
                            }
                            break;
                        case "h":
                           setTimeout(() => {
                               this.botPlace(food, null);
                           },85);
                            break;
                        case "33":
                            this.botPlace(mill, + toRad(71));
                            this.botPlace(mill, - toRad(71));
                            this.buy(R.skinIndex);
                            this.hat(R.skinIndex);
                            this.aim(R.dir);
                            this.hit(1, Number.MAX_VALUE)
                            this.chat(_.chatMessage);
                            this.join(R.team);
                            this.send(["10", [R.team]]);
                            this.walk(Math.random(), Math.random());
                            for(let i = 0; i < data[1][0].length / 13; i++) {
                                let playerInfo = data[1][0].slice(13*i, 13*i+13);
                                if(playerInfo[0] == this.id) {
                                    this.id = playerInfo[0];
                                    this.botx = playerInfo[1];
                                    this.boty = playerInfo[2];
                                    this.botdir = playerInfo[3];
                                    this.botobj = playerInfo[4];
                                    this.botwep = playerInfo[5];
                                    this.botclan = playerInfo[7];
                                    this.botleader = playerInfo[8];
                                    this.bothat = playerInfo[9];
                                    this.botacc = playerInfo[10];
                                    this.botskull = playerInfo[11];
                                };
                            };
                            break;
                        case "5":
                            const names = data[1][0].filter(e => typeof e == "string");
                            this.namesFound = names;
                            break;
                        case "11":
                            this.spawn();
                            break;
                    }
                }
            });
        }
        send(e) {
            this.socket.readyState === 1 && (this.socket.send(msgpack.encode(e)))
        }

        close() {
            AllBots.splice(AllBots.find(e => e == this), 1);
            this.socket.close();
            updateCountDisplay()
        }
        spawn() {
            this.send(['sp', [{
                name: this.name,
                moofoll: '1',
                skin: 1,
            }]]);
        }
        botPlace(id,angle) {
            //- toRad(71));
                this.send(["5", [id, null]]);
                this.send(["c", [1, angle]]);
                this.send(["c", [0, angle]]);
                this.send(["5", [1, null]]);
        }
        hat(id) {
            this.send(["13c", [0, id, 0]]);
        }
        buy(id) {
            this.send(["13c", [1, id, 0]]);
        }
        hit(toggle, angle) {
            this.send(["c", [toggle, angle]]);
        }
        aim(angle) {
            this.send(["2", [angle]]);
        }
        chat(string) {
            this.send(["ch", [string]]);
        }
        walk(x, y) {
            this.send(["33", [Math.atan2(x,y)]]);
        }
        clan(id) {
            this.send(["8", [id]]);
        }
        unclan() {
            this.send(["9", [null]]);
        }
        join(id) {
            this.send(["10", [id]]);
        }
        upgrade(num) {
            this.send(["5", [num]]);
        }
    }

    var Connectors = [];
    class ConnectAll {
        constructor(list = [], speed) {
            Connectors.forEach(e => e.destroy());
            let _this = this;
            this.settings = {};
            list.forEach(e => {
                this.settings[SERVER_INDEXES["sydney"]] = e.checked();
            });

            this.speed = speed ?? 300;

            this.active = true;
            AllBots.forEach(e => e.close());

            Connectors.push(this);


            !async function(){
                for(let i in vultr.servers) {
                    if(!_this.active) break;
                    let server = vultr.servers[i];
                    if(_this.settings[server.region.slice("6")]) {
                        new Bot(server.ip);
                        await sleep(_this.speed);
                    }
                }
            }()

        }

        destroy() {
            this.active = false;
            Botz.forEach(e => e.close());
        }
    }


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function checkNames(s = [], lowercase, exact) {

        let list = {};
        Botz.forEach(e => {
            if(e.namesFound.length > 0) {
                list[serverId(e.serverId)] = e.namesFound;
            }
        });


        let found = [];


        for(let l in list) {
            let line = list[l];
            line = line.join(".")[lowercase ? "toLowerCase" : "toString"]().split(".");
            s.forEach(searchname => {
                searchname = searchname[lowercase ? "toLowerCase" : "toString"]();
                line.forEach(linename => {
                    if(linename == searchname) {
                        found.push([l, linename]);
                    } else if(!exact && (linename.includes(searchname) || searchname.includes(linename))) {
                        found.push([l, linename]);
                    }
                })
            });
        }
        return found;
    }
    function serverId(id) {
        let server = window.vultr?.servers?.find(e => e.ip == id);
        return `${server.region.slice(6)}:${server.index}:0`;
    }



    const SearchMenu = document.createElement("div");
    SearchMenu.style.position = "fixed"
    SearchMenu.style.top = "10px";
    SearchMenu.style.left = "10px";
    SearchMenu.style.maxHeight = "500px";
    SearchMenu.style.backgroundImage = "linear-gradient(red, yellow)";
    SearchMenu.style.color = "white";
    SearchMenu.style.zIndex = "999999";
    SearchMenu.style.display = "none";
    SearchMenu.style.flexDirection = "column";
    SearchMenu.style.padding = "20px";
    SearchMenu.style.overflowY = "auto";
    document.body.appendChild(SearchMenu);

    btn.addEventListener("click", e=> {
           let cur = SearchMenu.style.display;
           DisableKeys = !DisableKeys;
           SearchMenu.style.display = cur == "none" ? "flex" : "none";
    })
    document.addEventListener("keydown",(e) => {
       if(e.keyCode == 27 && document.activeElement.id.toLowerCase() !== 'chatbox'){
           let cur = SearchMenu.style.display;
           DisableKeys = !DisableKeys;
           SearchMenu.style.display = cur == "none" ? "flex" : "none";
       }
    });
    function inSandbox() {
        return !document.URL?.split("://")[1]?.startsWith("moomoo");
    }
    class checkBox {
        constructor(name, parent) {

            this.element = document.createElement("input");
            this.element.setAttribute("type", "checkbox");
            this.element.name = name;
            this.check();

            this.label = document.createElement("label");
            this.label.setAttribute("for", name);
            this.label.innerHTML = name;
            this.label.style.fontSize = "18px";

            this.wrap = document.createElement("div");
            this.wrap.appendChild(this.label);
            this.wrap.appendChild(this.element);

            parent.appendChild(this.wrap);
        }
        checked() {
            return this.element.checked;
        }
        check() {
            this.element.checked = true;
        }
        uncheck() {
            this.element.checked = false;
        }
    }

    class text {
        constructor(text, color, parent) {
            this.element = document.createElement("p");
            this.setText(text);
            this.element.style.color = color;
            this.element.style.fontSize = "20px";
            this.element.style.padding = "0";
            this.element.style.margin = "0";

            parent.appendChild(this.element);
        }
        setText(text) {
            this.element.innerHTML = text;
        }
    }
    class lineBreak {
        constructor(parent) {
            parent.appendChild(document.createElement("br"));
        }
    }

    class button {
        constructor(text, color, parent) {
            this.element = document.createElement("button");
            this.element.style.background = color;
            this.element.style.padding = "10px 24px";
            this.element.style.borderStyle = "solid";
            this.element.innerHTML = text;

            this.element.addEventListener("click", e => {
                typeof this.onclick == "function" && this.onclick(e);
            });

            parent.appendChild(this.element);
        }
    }
    class textInput {
        constructor(placeholder, parent) {
            this.element = document.createElement("input");
            this.element.setAttribute("type", "text");
            this.element.setAttribute("placeholder", placeholder);
            this.element.style.padding = "10px 24px";
            this.element.style.borderStyle = "solid";
            this.element.style.backgroundImage = "linear-gradient(red, yellow)";


            parent.appendChild(this.element);
        }
        getValue() {
            return this.element.value;
        }

    }
    var crashIntervals = [];
    function genCountDisplayText(a = 0, b = 0) {
        return `Bots Connected: ${a} | Bots Spawned: ${b}`;
    }


    new text("<u style=\"font-size: 20px;\">A-FINDER</u>", "white", SearchMenu);
    new text("Helps Find People / Crash ", "grey", SearchMenu).element.style.fontSize = "15px";
    new lineBreak(SearchMenu);

    let sydney = {checked() {}, element: {name: null}}
    sydney = new checkBox("sydney", SearchMenu);
    //if(inSandbox()) {
        /*miami = new checkBox("miami", ui);
        frankfurt = new checkBox("frankfurt", ui);*/
        /*singapore = new checkBox("singapore", ui);
        siliconvalley = new checkBox("siliconvalley", ui);*/
    //} else {
        /*miami = new checkBox("miami", ui);
        frankfurt = new checkBox("frankfurt", ui);*/
        //sydney = checked();
        /*singapore = new checkBox("singapore", ui);
        siliconvalley = new checkBox("siliconvalley", ui);
        london = new checkBox("london", ui)*/
    //}


//    new lineBreak(ui);

    let speedInput = 300; //new textInput("Interval Timer", SearchMenu);


    let connectbutton = new button("connect","green", SearchMenu);
    connectbutton.onclick = () => {
        new ConnectAll([sydney], 300);
        r.send('ch', 'A-Finder Connecting </>');
    }

    let disconnectbutton = new button("disconnect", "red", SearchMenu);
    disconnectbutton.onclick = () => {
        Connectors.forEach(e => e.destroy());
        r.send('ch', 'A-Finder Disconnecting </>');
    }

    countDisplay = new text(genCountDisplayText("[]", "[]"), "blue", SearchMenu);

    //let uppercase = new uppercase.checked();
    //let exactmatch = new checkBox("exact match", ui);

    namesInput = new textInput("Enter Name", SearchMenu);
    let searchbutton = new button("Find", "green", SearchMenu);
    let crashbutton = new button("Crash", "red", SearchMenu);
    crashbutton.onclick = () => {
        let names = namesInput.getValue().split(",");

        names = names.map(e => e.trim());
        names = names.filter(e => e);

        let CheckedName = checkNames(names);

        if(Botz.length > 0) {
            if(CheckedName.length < 1) {
                crashDisplay.setText("Crash Target Not Found");
                r.send('ch', 'Error[Undefined-Player] </>');
            } else {
                crashIntervals.push(setInterval(function() {
                    if(!this.socket || this.socket.readyState !== 1) {
                        return crashIntervals.shift();
                    }
                    this.socket.send(new Uint8Array([159, 18, 223, 1, 76, 246, 3]));
                }));
                crashDisplay.setText("Crashed "+CheckedName.map(e => e.reverse().join(" | ")).join("<br>"));
                r.send('ch', '['+CheckedName.map(e => e.reverse().join("]-[")).join("<br>")+"] </>");
            }
        } else {
            crashDisplay.setText("Error[Bots-Connection]");
            r.send('ch', 'Error[Bots-Connection] </>');
        }



    }
    searchbutton.onclick = () => {
        let names = namesInput.getValue().split(",");

        names = names.map(e => e.trim());
        names = names.filter(e => e);

        let res = checkNames(names);//, uppercase.checked()/*, exactmatch.check()*/);

        if(Botz.length > 0) {
            if(res.length < 1) {
                resultDisplay.setText("Cannot Find[Undefined-Player]");
                r.send('ch', 'Error[Undefined-Player] </>');
            } else {
                resultDisplay.setText("Found "+res.map(e => e.reverse().join(" | ")).join("<br>"));
                r.send('ch', '['+res.map(e => e.reverse().join("]-[")).join("<br>")+"] </>");
            }
        } else {
            resultDisplay.setText("Cannot Find[Bot-Connection]");
            r.send('ch', 'Error[Bot-Connection] </>');
        }



    }
    resultDisplay = new text("Enter Player", "green", SearchMenu);
    crashDisplay = new text("Crash Player", "red", SearchMenu);
        function an() {
            (tn.value = ""), (nn.style.display = "none");
        }
        var on,
            cn,
            ln = [];

        function hn(e, t) {
            var n = Ii(e);
            n &&
                ((n.chatMessage = (function(e) {
                for (var t, n = 0; n < ln.length; ++n)
                    if (e.indexOf(ln[n]) > -1) {
                        t = "";
                        for (var i = 0; i < ln[n].length; ++i) t += t.length ? "o" : "M";
                        var r = new RegExp(ln[n], "g");
                        e = e.replace(r, t);
                    }
                return e;
            })(t)),
                 (n.chatCountdown = o.chatCountdown));
        }
        function YT(e, t) {
            var n = Ii(e);
            n &&
                ((n.chatMessage = (function(e) {
                for (var t, n = 0; n < ln.length; ++n)
                    if (e.indexOf(ln[n]) > -1) {
                        t = "";
                        for (var i = 0; i < ln[n].length; ++i) t += t.length ? "o" : "M";
                        var r = new RegExp(ln[n], "g");
                        e = e.replace(r, t);
                    }
                return e;
            })(t)),
                 (n.chatCountdown = o.chatCountdown));
        }
        we.addEventListener("wheel", function(e, t = [null, 0]) {
            if(!Hacks) return;
            if (e.deltaY > 0) {
                if(oe < 50000){
                    t[0] = setInterval(() => {
                        if(t[1] >= 10) clearInterval(t[0]);
                        oe *= 1.005;
                        ce *= 1.005;
                        un();
                        t[1]++;
                    }, 5);
                }
            } else {
                if(oe > 1000){
                    t[0] = setInterval(() => {
                        if(t[1] >= 10) clearInterval(t[0]);
                        oe /= 1.005;
                        ce /= 1.005;
                        un();
                        t[1]++;
                    }, 5);
                }
            }
        });

        function un() {
            F = window.innerWidth;
            z = window.innerHeight;
            var e = Math.max(F / oe, z / ce) * V;
            we.width = F * V
            we.height = z * V
            we.style.width = F + "px"
            we.style.height = z + "px"
            be.setTransform(e, 0, 0, e, (F * V - oe * e) / 2, (z * V - ce * e) / 2);
        }

        function fn(e) {
            (on = e) ? Ae.classList.add("touch"): Ae.classList.remove("touch");
        }

        function dn(e) {
            e.preventDefault(), e.stopPropagation(), fn(!0);
            for (var t = 0; t < e.changedTouches.length; t++) {
                var n = e.changedTouches[t];
                n.identifier == re.id ?
                    ((re.id = -1), bn()) :
                n.identifier == se.id &&
                    ((se.id = -1), R.buildIndex >= 0 && ((O = 1), vn()), (O = 0), vn());
            }
        }

        function pn() {
            return R ?
                (-1 != se.id ?
                 (cn = Math.atan2(
                se.currentY - se.startY,
                se.currentX - se.startX,
            )) :
                 R.lockDir || on || (cn = Math.atan2(ie - z / 2, ne - F / 2)),
                 s.fixTo(cn || 0, 2)) :
            0;
        }
        window.addEventListener("resize", s.checkTrusted(un)),
            un(),
            fn(!1),
            (window.setUsingTouch = fn),
            we.addEventListener(
            "touchmove",
            s.checkTrusted(function(e) {
                e.preventDefault(), e.stopPropagation(), fn(!0);
                for (var t = 0; t < e.changedTouches.length; t++) {
                    var n = e.changedTouches[t];
                    n.identifier == re.id ?
                        ((re.currentX = n.pageX), (re.currentY = n.pageY), bn()) :
                    n.identifier == se.id &&
                        ((se.currentX = n.pageX), (se.currentY = n.pageY), (O = 1));
                }
            }),
            !1,
        ),
            we.addEventListener(
            "touchstart",
            s.checkTrusted(function(e) {
                e.preventDefault(), e.stopPropagation(), fn(!0);
                for (var t = 0; t < e.changedTouches.length; t++) {
                    var n = e.changedTouches[t];
                    n.pageX < document.body.scrollWidth / 2 && -1 == re.id ?
                        ((re.id = n.identifier),
                         (re.startX = re.currentX = n.pageX),
                         (re.startY = re.currentY = n.pageY),
                         bn()) :
                    n.pageX > document.body.scrollWidth / 2 &&
                        -1 == se.id &&
                        ((se.id = n.identifier),
                         (se.startX = se.currentX = n.pageX),
                         (se.startY = se.currentY = n.pageY),
                         R.buildIndex < 0 && ((O = 1), vn()));
                }
            }),
            !1,
        ),
            we.addEventListener("touchend", s.checkTrusted(dn), !1),
            we.addEventListener("touchcancel", s.checkTrusted(dn), !1),
            we.addEventListener("touchleave", s.checkTrusted(dn), !1),
            we.addEventListener(
            "mousemove",
            function(e) {
                e.preventDefault(),
                    e.stopPropagation(),
                    fn(!1),
                    (ne = e.clientX),
                    (ie = e.clientY);
            },
            !1,
        ),
            we.addEventListener(
            "mousedown",
            function(e) {
                fn(!1), 1 != O && ((O = 1), vn());
            },
            !1,
        ),
            we.addEventListener(
            "mouseup",
            function(e) {
                fn(!1), 0 != O && ((O = 0), vn());
            },
            !1,
        );
        var gn = {},
            mn = {
                87: [0, -1],
                38: [0, -1],
                83: [0, 1],
                40: [0, 1],
                65: [-1, 0],
                37: [-1, 0],
                68: [1, 0],
                39: [1, 0],
            };

        function yn() {
            (gn = {}), r.send("rmd");
        }

        function kn() {
            return "block" != Ye.style.display && "block" != nn.style.display;
        }

        function vn() {
            !AutoAim || !Hacks && aimAt(pn());
            R && R.alive && (r.send("c", O, R.buildIndex >= 0 ? pn() : null), R && R.alive && (Hvk[0] = !Hvk[0]))
            Hgs();
        }
        window.addEventListener(
            "keydown",
            s.checkTrusted(function(e) {
                var t = e.which || e.keyCode || 0;
                27 == t ?
                    Qt() :
                R &&
                    R.alive &&
                    kn() &&
                    (gn[t] ||
                     ((gn[t] = 1),
                      69 == t ?
                      (r.send("7", 1), Hvk[1] = !Hvk[1], Hgs()) :
                      67 == t ?
                      (Ez || (Ez = {}), (Ez.x = R.x), (Ez.y = R.y)) :
                      88 == t ?
                      (R.lockDir = R.lockDir ? 0 : 1, !Hacks && r.send("7", 0)) :
                      null != R.weapons[t - 49] ?
                      Sn(R.weapons[t - 49], !0) :
                      null != R.items[t - 49 - R.weapons.length] ?
                      Sn(R.items[t - 49 - R.weapons.length]) :
                      81 == t ?
                      Sn(R.items[0]) :
                      82 == t ?
                      xn() :
                      mn[t] ?
                      bn() :
                      32 == t && ((O = 1), vn())));
            }),
        ),
            window.addEventListener(
            "keyup",
            s.checkTrusted(function(e) {
                if (R && R.alive) {
                    var t = e.which || e.keyCode || 0;
                    13 == t ?
                        rn() :
                    kn() &&
                        gn[t] &&
                        ((gn[t] = 0), mn[t] ? bn() : 32 == t && ((O = 0), vn()));
                }
            }),
        );
        var wn = void 0;

        function bn() {
            var e = (function() {
                var e = 0,
                    t = 0;
                if (-1 != re.id)
                    (e += re.currentX - re.startX), (t += re.currentY - re.startY);
                else
                    for (var n in mn) {
                        var i = mn[n];
                        (e += !!gn[n] * i[0]), (t += !!gn[n] * i[1]);
                    }
                return 0 == e && 0 == t ? void 0 : s.fixTo(Math.atan2(t, e), 2);
            })();
            (null == wn || null == e || Math.abs(e - wn) > 0.3) &&
                (r.send("33", e), Point.in && (Point.in = false), (wn = e));
        }

        function xn() {
            r.send("14", 1);
        }

        function Sn(e, t) {
            r.send("5", e, t);
        }

        function Tn() {
            Hvk = [0, 0];
            I("moo_name", Le.value),
                !le &&
                r.connected &&
                ((le = !0),
                 x.stop("menu"),
                 dt("Loading..."),
                 r.send("sp", {
                name: `a-${Le.value}`,
                moofoll: 1,
                skin: ae
            }));
            //Bots(4, "D_Alphabot_A");
        }
        //e.close();
        window.onbeforeunload = function () {
            return e.close();
        };
        var In = !0;
        function En(e) {
            (Pe.style.display = "none"),
                (Me.style.display = "block"),
                (he.style.display = "none"),
                (gn = {}),
                (j = e),
                (O = 0),
                (le = !0),
                In && ((In = !1), (N.length = 0));
        }

       function Mn(e, t, n, i) {
           m.showText(e, t, 39, 0.2, 1500, Math.abs(n), n >= 0 ? "#cc5151" : "#8ecc51")
       }
       var An = 99999;
       function Pn() {
        InInsta = false;
        AutoAim = false;
            le = !1;
            try {
                factorem.refreshAds([2], !0);
            } catch (e) {}
            (Be.style.display = "none"),
                Qt(),
                (It = {
                x: R.x,
                y: R.y
            }),
        Pe.style.display = "none",
        Ge.style.display = "block",
        Ge.style.fontSize = "0px",
        An = 0,
        setTimeout((function() {
            Me.style.display = "block",
            he.style.display = "block",
            Ge.style.display = "none"
        }
        ), o.deathFadeout),
        gt()
        }

        function Bn(e) {
            R && nt.removeAllItems(e);
        }

        async function Cn(e, t, n, i) {
            nt.disableBySid(e);
           if(AutoPlace) {
            if(R.items[4] != 15 || InInsta) return;
            if(window.location.href.includes('sandbox') && AutoPlace && !InInsta && (_ = Mi(e)) && R && [6, 7, 8, 9, 15].includes(_.id) && Math.hypot(R.x2 - _.x, R.y2 - _.y) <= _.scale + 250)
                if(Enemy && Math.hypot(R.y2 - Enemy.y2, R.x2 - Enemy.x2) <= 300){
                    if(AutoPlace && R.reloads[0].done && Math.hypot(Enemy.x2 - _.x, Enemy.y2 - _.y) <= 50 && _.id == 15 && _.owner.sid == R.sid && (R.team && Member(_.owner.sid))){
                        place(R.items[2], Math.atan2(_.y - R.y2, _.x - R.x2));
                        await Next();
                        Jt(0, 1);
                        Bu(7, 18);
                        r.send("c", true);
                        r.send("c", false);
                        await Next();
                        Os();
                    };
                    let Spam = ([7, 8, 9].includes(R.items[2]) && (Hvk[0] || Hvk[1]) && R.weaponIndex == 4 && _.id == 15 && Math.hypot(c.x - Enemy.x2, c.y - Enemy.y2) <= 100)
                    e = (Keys[86] || Spam) ? R.items[2] : R.items[4];
                    let t = N.filter(c => c.isItem && c.active && !c.dontGather && (c.owner.sid == R.sid || (R.team && Member(c.owner.sid))) && [6, 7, 8, 9, 15].includes(c.id) && Math.hypot(c.x - _.x, c.y - _.y) <= 350);
                    t && (t = t.sort((a, b) => Math.hypot(a.x - _.x, a.y - _.y) - Math.hypot(b.x - _.x, b.y - _.y)));
                    if(t && t[0]){
                        n = Math.atan2(Enemy.y2 - t[0].y, Enemy.x2 - t[0].x);
                        i = Math.hypot(t[0].y - Enemy.y2, t[0].x - Enemy.x2) + 3;
                        let ra = {x: t[0].x + Math.cos(n) * i, y: t[0].y + Math.sin(n) * i};
                       if(AutoPlace){
                        place(R.items[2], Math.atan2(ra.y - R.y2, ra.x - R.x2));
                        for(let i = 0; i < 40; i += 5) place(R.items[2], Math.atan2(ra.y - R.y2, ra.x - R.x2) + Degree(i)), place(R.items[2], Math.atan2(ra.y - R.y2, ra.x - R.x2) - Degree(i));
                       }
                    } else {
                        if(AutoPlace){
                        place(e, Math.atan2(_.y - R.y2, _.x - R.x2));
                        for(let i = 0; i < 50; i += 5) place(e, Math.atan2(_.y - R.y2, _.x - R.x2) + Degree(i)), place(e, Math.atan2(_.y - R.y2, _.x - R.x2) - Degree(i));
                        }
                    };
                };
           }
        }
        function On() {
           Oe.innerText = R.points,
               Re.innerText = R.food,
               je.innerText = R.wood,
               _e.innerText = R.stone,
               Ue.innerText = R.kills
            //document.querySelector("#scoreDisplay").innerHTML = Smoothie(Math.round(Tf.points), 1e6);
        }
        var Rn = {},
            jn = ["crown", "skull"],
            _n = [];

        function Un(e, t) {
            if (((R.upgradePoints = e), (R.upgrAge = t), e > 0)) {
                (_n.length = 0), s.removeAllChildren(Ve);
                for (var n = 0; n < l.weapons.length; ++n)
                    l.weapons[n].age == t &&
                        (null == l.weapons[n].pre ||
                         R.weapons.indexOf(l.weapons[n].pre) >= 0) &&
                        ((s.generateElement({
                        id: "upgradeItem" + n,
                        class: "actionBarItem",
                        onmouseout: function() {
                            Tt();
                        },
                        parent: Ve,
                    }).style.backgroundImage = document.getElementById(
                        "actionBarItem" + n,
                    ).style.backgroundImage),
                         _n.push(n));
                for (n = 0; n < l.list.length; ++n)
                    if (
                        l.list[n].age == t &&
                        (null == l.list[n].pre || R.items.indexOf(l.list[n].pre) >= 0)
                    ) {
                        var i = l.weapons.length + n;
                        (s.generateElement({
                            id: "upgradeItem" + i,
                            class: "actionBarItem",
                            onmouseout: function() {
                                Tt();
                            },
                            parent: Ve,
                        }).style.backgroundImage = document.getElementById(
                            "actionBarItem" + i,
                        ).style.backgroundImage),
                            _n.push(i);
                    }
                for (n = 0; n < _n.length; n++)
                    !(function(e) {
                        var t = document.getElementById("upgradeItem" + e);
                        (t.onmouseover = function() {
                            l.weapons[e] ?
                                Tt(l.weapons[e], !0) :
                            Tt(l.list[e - l.weapons.length]);
                        }),
                            (t.onclick = s.checkTrusted(function() {
                            r.send("6", e);
                        })),
                            s.hookTouchEvents(t);
                    })(_n[n]);
                _n.length ?
                    ((Ve.style.display = "block"),
                     (qe.style.display = "block"),
                     (qe.innerHTML = "SELECT ITEMS (" + e + ")")) :
                ((Ve.style.display = "none"), (qe.style.display = "none"), Tt());
            } else(Ve.style.display = "none"), (qe.style.display = "none"), Tt();
        }

        function Dn(e, t, n) {
            null != e && (R.XP = e),
                null != t && (R.maxXP = t),
                null != n && (R.age = n),
                n == o.maxAge ?
                ((ze.innerHTML = "MAX AGE"), (He.style.width = "100%")) :
            ((ze.innerHTML = "AGE " + R.age),
             (He.style.width = (R.XP / R.maxXP) * 100 + "%"));
        }

        function Ln(e) {
            s.removeAllChildren(De);
            for (var t = 1, n = 0; n < e.length; n += 3)
                !(function(n) {
                    s.generateElement({
                        class: "leaderHolder",
                        parent: De,
                        children: [
                            s.generateElement({// lb id
                                //                     (_.isLeader = e[n + 8]), (_.skinIndex = e[n + 9]),
                                class: "leaderboardItem",
                                style: "color:" + (e[n] == j ? "#fff" : "rgba(255,255,255,0.6)"),
                                text: t + `. ` + ("" != e[n + 1] ? e[n + 1] : "unknown"),
                            }),
                            s.generateElement({
                                class: "leaderScore",
                                text: s.kFormat(e[n + 2]) || "",
                            }),
                        ],
                    });
                })(n),
                    t++;
        }

        function Fn(e, t, n, i) {
            be.save(), be.setTransform(1, 0, 0, 1, 0, 0), be.scale(V, V);
            var r = 50;
            be.beginPath(),
                be.arc(e, t, r, 0, 2 * Math.PI, !1),
                be.closePath(),
                (be.fillStyle = "rgba(255, 255, 255, 0.3)"),
                be.fill(),
                (r = 50);
            var s = n - e,
                a = i - t,
                o = Math.sqrt(Math.pow(s, 2) + Math.pow(a, 2)),
                c = o > r ? o / r : 1;
            (s /= c),
                (a /= c),
                be.beginPath(),
                be.arc(e + s, t + a, 0.5 * r, 0, 2 * Math.PI, !1),
                be.closePath(),
                (be.fillStyle = "white"),
                be.fill(),
                be.restore();
        }

        function zn(e, t, n) {
            for (var i = 0; i < G.length; ++i)
                (_ = G[i]).active &&
                    _.layer == e &&
                    (_.update(P),
                     _.active &&
                     ki(_.x - t, _.y - n, _.scale) &&
                     (be.save(),
                      be.translate(_.x - t, _.y - n),
                      be.rotate(_.dir),
                      Vn(0, 0, _, be, 1),
                      be.restore()));
        }
        var Hn = {};

        function Vn(e, t, n, i, r) {
            if (n.src) {
                var s = l.projectiles[n.indx].src,
                    a = Hn[s];
                a ||
                    (((a = new Image()).onload = function() {
                    this.isLoaded = !0;
                }),
                     (a.src = ".././img/weapons/" + s + ".png"),
                     (Hn[s] = a)),
                    a.isLoaded &&
                    i.drawImage(a, e - n.scale / 2, t - n.scale / 2, n.scale, n.scale);
            } else 1 == n.indx && ((i.fillStyle = "#939393"), si(e, t, n.scale, i));
        }

        function qn(e, t, n, i) {
            var r = o.riverWidth + i,
                s = o.mapScale / 2 - t - r / 2;
            s < ce && s + r > 0 && n.fillRect(0, s, oe, r);
        }
        document.spinIn = 0;
        function Yn(e, t, n) {
            document.spinIn += .0003 * P;
            for (var i, r, s, a = 0; a < N.length; ++a)
                (_ = N[a]).active &&
                    ((r = _.x + _.xWiggle - t),
                     (s = _.y + _.yWiggle - n),
                     0 == e && _.update(P),
                     _.layer == e &&
                     ki(r, s, _.scale + (_.blocker || 0)) &&
                     ((be.globalAlpha = _.id == 15 ? .6 : 1),
                      _.isItem ?
                      ((i = ri(_)),
                       be.save(),
                       be.translate(r, s),
                       be.rotate(_.dir > 1e308 || _.dir < -1e308 ? Math.atan2(Math.sin(_.dir), Math.cos(_.dir)) : _.dir),
                       be.drawImage(i, -i.width / 2, -i.height / 2),
                       _.blocker &&
                       ((be.strokeStyle = "#db6e6e"),
                        (be.globalAlpha = 0.3),
                        (be.lineWidth = 6),
                        si(0, 0, _.blocker, be, !1, !0)),
                       be.restore(),
                        R && R.alive && _.owner.sid == R.sid && Math.hypot(R.x2 - _.x, R.y2 - _.y) <= 150 && console.log(Math.atan2(R.x2 - _.x, R.y2 - _.y)),
                       Hacks && UI && R && _.health > 0 && Reach(Math.hypot(R.x2 - _.x, R.y2 - _.y) - (_.getScale ? _.getScale() : _.scale) - 35, Math.atan2(_.y - R.y2, _.x - R.x2)) && br(be, r + 20, s - 10, R.sid == _.owner.sid || (R.team && Member(_.owner.sid)) ? "#8ecc51" : "#cc5151", _.healthMov, _.maxHealth, -20)) :
                      ((i = ni(_)),
                       be.drawImage(i, r - i.width / 2, s - i.height / 2))));
        }
        function Reach(e, t, n){
            n = (l.weapons[R.weaponIndex].range ? l.weapons[R.weaponIndex].range : l.weapons[R.weapons[0]].range);
            return Boolean(e <= n)
        };
        function Hsl(e, t, i, r, g, l, n = 0){
            n = e / (t / Math.abs(r - i));
            return `hsl(${Math.max(r > i ? (i + n) : (Math.max(r, i) - n), Math.min(r, i))}, ${g ? g : 100}%, ${l ? l : 50}%)`;
        };
        async function avh(){
            setTimeout(() => {
                Bu(7, 18);
                Sn(R.weapons[0], true);
                r.send('c', true);
                r.send('c', false);
                AutoAim = true;
                setTimeout(() => {
                    Os();
                    AutoAim = false;
                }, 120);
            }, 120);
        };
        function Wn(e, t, n, i) {
            if(!i) return Fixed.push({indicator: Wn, data: [e, t, n, true]});
            (_ = Ii(e)) && (_.gather(n, Number(n > 8), l.weapons[n]), _.startAnim(t, n), R.health < 60 && Enemy && Enemy.sid == _.sid && Math.hypot(_.y2 - R.y2, _.x2 - R.x2) <= l.weapons[n].range + 70 && _.skinIndex == 7 && [3, 4, 5].includes(n) && R.skinIndex == 11 && R.tailIndex == 21 && R.reloads[0].done && avh());
        }
        function ahs(e){
            if(e < Math.PI * 2 && e > -Math.PI * 2) return e;
            e < 0 && (Math.abs(e));
            return e - Math.floor(e / (Math.PI * 2)) * (Math.PI * 2);
        };
        function Xn(e, t, n) {
            be.globalAlpha = 1;
            for (var i = 0; i < W.length; ++i)
                (_ = W[i]).zIndex == n &&
                    (_.animate(P),
                     _.visible &&
                     ((_.skinRot += 0.002 * P),
                      (L = (R == _ ? pn() : Math.atan2(Math.sin(_.dir), Math.cos(_.dir))) + _.dirPlus),
                      be.save(),
                      be.translate(_.x - e, _.y - t),
                      be.rotate(L),
                      Nn(_, be),
                      be.restore()));
        }

        function Nn(e, t) {
            ((t = t || be).lineWidth = 5.5), (t.lineJoin = "miter");
            var n = (Math.PI / 4) * (l.weapons[e.weaponIndex].armS || 1),
                i = (e.buildIndex < 0 && l.weapons[e.weaponIndex].hndS) || 1,
                r = (e.buildIndex < 0 && l.weapons[e.weaponIndex].hndD) || 1;
            if (
                (e.tailIndex > 0 &&
                 (function(e, t, n) {
                    if (!(Gn = Qn[e])) {
                        var i = new Image();
                        (i.onload = function() {
                            (this.isLoaded = !0), (this.onload = null);
                        }),
                            (i.src = ".././img/accessories/access_" + e + ".png"),
                            (Qn[e] = i),
                            (Gn = i);
                    }
                    var r = $n[e];
                    if (!r) {
                        for (var s = 0; s < tt.length; ++s)
                            if (tt[s].id == e) {
                                r = tt[s];
                                break;
                            }
                        $n[e] = r;
                    }
                    Gn.isLoaded &&
                        (t.save(),
                         t.translate(-20 - (r.xOff || 0), 0),
                         r.spin && t.rotate(n.skinRot),
                         t.drawImage(Gn, -r.scale / 2, -r.scale / 2, r.scale, r.scale),
                         t.restore());
                })(e.tailIndex, t, e),
                 e.buildIndex < 0 &&
                 !l.weapons[e.weaponIndex].aboveHand &&
                 (ei(
                    l.weapons[e.weaponIndex],
                    o.weaponVariants[e.weaponVariant].src,
                    e.scale,
                    0,
                    t,
                ),
                  null == l.weapons[e.weaponIndex].projectile ||
                  l.weapons[e.weaponIndex].hideProjectile ||
                  Vn(
                    e.scale,
                    0,
                    l.projectiles[l.weapons[e.weaponIndex].projectile],
                    be,
                )),
                 (t.fillStyle = o.skinColors[e.skinColor]),
                 si(e.scale * Math.cos(n), e.scale * Math.sin(n), 14),
                 si(e.scale * r * Math.cos(-n * i), e.scale * r * Math.sin(-n * i), 14),
                 e.buildIndex < 0 &&
                 l.weapons[e.weaponIndex].aboveHand &&
                 (ei(
                    l.weapons[e.weaponIndex],
                    o.weaponVariants[e.weaponVariant].src,
                    e.scale,
                    0,
                    t,
                ),
                  null == l.weapons[e.weaponIndex].projectile ||
                  l.weapons[e.weaponIndex].hideProjectile ||
                  Vn(
                    e.scale,
                    0,
                    l.projectiles[l.weapons[e.weaponIndex].projectile],
                    be,
                )),
                 e.buildIndex >= 0)
            ) {
                var s = ri(l.list[e.buildIndex]);
                t.drawImage(s, e.scale - l.list[e.buildIndex].holdOffset, -s.width / 2);
            }
            t.beginPath(),
                t.arc(0, 0, 35, 0, 2 * Math.PI),
                t.fill(),
                t.stroke(),
                e.skinIndex > 0 &&
                (t.rotate(Math.PI / 2),
                 (function e(t, n, i, r) {
                if (!(Gn = Jn[t])) {
                    var s = new Image();
                    (s.onload = function() {
                        (this.isLoaded = !0), (this.onload = null);
                    }),
                        (s.src = ".././img/hats/hat_" + t + ".png"),
                        (Jn[t] = s),
                        (Gn = s);
                }
                var a = i || Kn[t];
                if (!a) {
                    for (var o = 0; o < et.length; ++o)
                        if (et[o].id == t) {
                            a = et[o];
                            break;
                        }
                    Kn[t] = a;
                }
                be.globalAlpha = .75
                Gn.isLoaded &&
                    n.drawImage(Gn, -a.scale / 2, -a.scale / 2, a.scale, a.scale),
                    !i &&
                    a.topSprite &&
                    (n.save(),
                     n.rotate(r.skinRot),
                     e(t + "_top", n, a, r),
                     n.restore());
            })(e.skinIndex, t, null, e));
        }
        var Gn,
            Jn = {},
            Kn = {},
            Qn = {},
            $n = {},
            Zn = {};

        function ei(e, t, n, i, r) {
            var s = e.src + (t || ""),
                a = Zn[s];
            a ||
                (((a = new Image()).onload = function() {
                this.isLoaded = !0;
            }),
                 (a.src = ".././img/weapons/" + s + ".png"),
                 (Zn[s] = a)),
                a.isLoaded &&
                r.drawImage(
                a,
                n + e.xOff - e.length / 2,
                i + e.yOff - e.width / 2,
                e.length,
                e.width,
            );
        }
        var ti = {};

        function ni(e) {
            var t =
                e.y >= o.mapScale - o.snowBiomeTop ?
                2 :
            e.y <= o.snowBiomeTop ?
                1 :
            0,
                n = e.type + "_" + e.scale + "_" + t,
                i = ti[n];
            if (!i) {
                var r = document.createElement("canvas");
                r.width = r.height = 2.1 * e.scale + 5.5;
                var a = r.getContext("2d");
                if (
                    (a.translate(r.width / 2, r.height / 2),
                     a.rotate(s.randFloat(0, Math.PI)),
                     (a.strokeStyle = it),
                     (a.lineWidth = 5.5),
                     0 == e.type)
                )
                    for (var c, l = 0; l < 2; ++l)
                        ai(a, 7, (c = _.scale * (l ? 0.5 : 1)), 0.7 * c),
                            (a.fillStyle = t ?
                             l ?
                             "#fff" :
                             "#e3f1f4" :
                             l ?
                             "#b4db62" :
                             "#9ebf57"),
                            a.fill(),
                            l || a.stroke();
                else if (1 == e.type)
                    if (2 == t)
                        (a.fillStyle = "#606060"),
                            ai(a, 6, 0.3 * e.scale, 0.71 * e.scale),
                            a.fill(),
                            a.stroke(),
                            (a.fillStyle = "#89a54c"),
                            si(0, 0, 0.55 * e.scale, a),
                            (a.fillStyle = "#a5c65b"),
                            si(0, 0, 0.3 * e.scale, a, !0);
                    else {
                        var h;
                        !(function(e, t, n, i) {
                            var r,
                                a = (Math.PI / 2) * 3,
                                o = Math.PI / 6;
                            e.beginPath(), e.moveTo(0, -i);
                            for (var c = 0; c < 6; c++)
                                (r = s.randInt(n + 0.9, 1.2 * n)),
                                    e.quadraticCurveTo(
                                    Math.cos(a + o) * r,
                                    Math.sin(a + o) * r,
                                    Math.cos(a + 2 * o) * i,
                                    Math.sin(a + 2 * o) * i,
                                ),
                                    (a += 2 * o);
                            e.lineTo(0, -i), e.closePath();
                        })(a, 0, _.scale, 0.7 * _.scale),
                            (a.fillStyle = t ? "#e3f1f4" : "#89a54c"),
                            a.fill(),
                            a.stroke(),
                            (a.fillStyle = t ? "#6a64af" : "#c15555");
                        var u = T / 4;
                        for (l = 0; l < 4; ++l)
                            si(
                                (h = s.randInt(_.scale / 3.5, _.scale / 2.3)) * Math.cos(u * l),
                                h * Math.sin(u * l),
                                s.randInt(10, 12),
                                a,
                            );
                    }
                else
                    (2 != e.type && 3 != e.type) ||
                        ((a.fillStyle =
                          2 == e.type ? (2 == t ? "#938d77" : "#939393") : "#e0c655"),
                         ai(a, 3, e.scale, e.scale),
                         a.fill(),
                         a.stroke(),
                         (a.fillStyle =
                          2 == e.type ? (2 == t ? "#b2ab90" : "#bcbcbc") : "#ebdca3"),
                         ai(a, 3, 0.55 * e.scale, 0.65 * e.scale),
                         a.fill());
                (i = r), (ti[n] = i);
            }
            return i;
        }
       var ii = [];
       function ri(e, t) {
           var n = ii[e.id];
           if (!n || t) {
               var i = document.createElement("canvas");
               i.width = i.height = 2.5 * e.scale + 5.5 + (l.list[e.id].spritePadding || 0);
               var r = i.getContext("2d");
               if (r.translate(i.width / 2, i.height / 2),
                   r.rotate(t ? 0 : Math.PI / 2),
                   r.strokeStyle = it,
                   r.lineWidth = 5.5 * (t ? i.width / 81 : 1),
                   "apple" == e.name) {
                   r.fillStyle = "#c15555",
                       si(0, 0, e.scale, r),
                       r.fillStyle = "#89a54c";
                   var a = -Math.PI / 2;
                   !function(e, t, n, i, r) {
                       var s = e + 25 * Math.cos(i)
                       , a = t + 25 * Math.sin(i);
                       r.moveTo(e, t),
                           r.beginPath(),
                           r.quadraticCurveTo((e + s) / 2 + 10 * Math.cos(i + Math.PI / 2), (t + a) / 2 + 10 * Math.sin(i + Math.PI / 2), s, a),
                           r.quadraticCurveTo((e + s) / 2 - 10 * Math.cos(i + Math.PI / 2), (t + a) / 2 - 10 * Math.sin(i + Math.PI / 2), e, t),
                           r.closePath(),
                           r.fill(),
                           r.stroke()
                   }(e.scale * Math.cos(a), e.scale * Math.sin(a), 0, a + Math.PI / 2, r)
               } else if ("cookie" == e.name) {
                   r.fillStyle = "#cca861",
                       si(0, 0, e.scale, r),
                       r.fillStyle = "#937c4b";
                   for (var o = T / (h = 4), c = 0; c < h; ++c)
                       si((u = s.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(o * c), u * Math.sin(o * c), s.randInt(4, 5), r, !0)
               } else if ("cheese" == e.name) {
                   var h, u;
                   for (r.fillStyle = "#f4f3ac",
                        si(0, 0, e.scale, r),
                        r.fillStyle = "#c3c28b",
                        o = T / (h = 4),
                        c = 0; c < h; ++c)
                       si((u = s.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(o * c), u * Math.sin(o * c), s.randInt(4, 5), r, !0)
               } else if ("wood wall" == e.name || "stone wall" == e.name || "castle wall" == e.name) {
                   r.fillStyle = "castle wall" == e.name ? "#83898e" : "wood wall" == e.name ? "#a5974c" : "#939393";
                   var f = "castle wall" == e.name ? 4 : 3;
                   ai(r, f, 1.1 * e.scale, 1.1 * e.scale),
                       r.fill(),
                       r.stroke(),
                       r.fillStyle = "castle wall" == e.name ? "#9da4aa" : "wood wall" == e.name ? "#c9b758" : "#bcbcbc",
                       ai(r, f, .65 * e.scale, .65 * e.scale),
                       r.fill()
               } else if ("spikes" == e.name || "greater spikes" == e.name || "poison spikes" == e.name || "spinning spikes" == e.name) {
                   r.fillStyle = "poison spikes" == e.name ? "#7b935d" : "#939393";
                   var d = .6 * e.scale;
                   ai(r, "spikes" == e.name ? 5 : 6, e.scale, d),
                       r.fill(),
                       r.stroke(),
                       r.fillStyle = "#a5974c",
                       si(0, 0, d, r),
                       r.fillStyle = "#c9b758",
                       si(0, 0, d / 2, r, !0)
               } else if ("windmill" == e.name || "faster windmill" == e.name || "power mill" == e.name)
                r.fillStyle = "#a5974c",
                si(0, 0, e.scale, r),
                r.fillStyle = "#c9b758",
                ci(0, 0, 1.5 * e.scale, 29, 4, r),
                r.fillStyle = "#a5974c",
                si(0, 0, .5 * e.scale, r);
               else if ("mine" == e.name)
                   r.fillStyle = "#939393",
                       ai(r, 4, e.scale, e.scale),
                       r.fill(),
                       r.stroke(),
                       r.fillStyle = "#bcbcbc",
                       ai(r, 4, .55 * e.scale, .65 * e.scale),
                       r.fill();
               else if ("sapling" == e.name)
                   for (c = 0; c < 2; ++c)
                       ai(r, 7, d = e.scale * (c ? .5 : 1), .7 * d),
                           r.fillStyle = c ? "#b4db62" : "#9ebf57",
                           r.fill(),
                           c || r.stroke();
               else if ("pit trap" == e.name)
                   r.fillStyle = "#a5974c",
                       ai(r, 4, 1.1 * e.scale, 1.1 * e.scale),
                       r.fill(),
                       r.stroke(),
                       r.fillStyle = it,
                       ai(r, 4, .65 * e.scale, .65 * e.scale),
                       r.fill();
               else if ("boost pad" == e.name)
                   r.fillStyle = "#7e7f82",
                       oi(0, 0, 2 * e.scale, 2 * e.scale, r),
                       r.fill(),
                       r.stroke(),
                       r.fillStyle = "#dbd97d",
                       function(e, t) {
                       t = t || be;
                       var n = e * (Math.sqrt(3) / 2);
                       t.beginPath(),
                           t.moveTo(0, -n / 2),
                           t.lineTo(-e / 2, n / 2),
                           t.lineTo(e / 2, n / 2),
                           t.lineTo(0, -n / 2),
                           t.fill(),
                           t.closePath()
                   }(1 * e.scale, r);
               else if ("turret" == e.name)
                   r.fillStyle = "#a5974c",
                       si(0, 0, e.scale, r),
                       r.fill(),
                       r.stroke(),
                       r.fillStyle = "#939393",
                       oi(0, -25, .9 * e.scale, 50, r),
                       si(0, 0, .6 * e.scale, r),
                       r.fill(),
                       r.stroke();
               else if ("platform" == e.name) {
                   r.fillStyle = "#cebd5f";
                   var p = 2 * e.scale
                   , g = p / 4
                   , m = -e.scale / 2;
                   for (c = 0; c < 4; ++c)
                       oi(m - g / 2, 0, g, 2 * e.scale, r),
                           r.fill(),
                           r.stroke(),
                           m += p / 4
               } else
                   "healing pad" == e.name ? (r.fillStyle = "#7e7f82",
                                              oi(0, 0, 2 * e.scale, 2 * e.scale, r),
                                              r.fill(),
                                              r.stroke(),
                                              r.fillStyle = "#db6e6e",
                                              ci(0, 0, .65 * e.scale, 20, 4, r, !0)) : "spawn pad" == e.name ? (r.fillStyle = "#7e7f82",
                                                                                                                oi(0, 0, 2 * e.scale, 2 * e.scale, r),
                                                                                                                r.fill(),
                                                                                                                r.stroke(),
                                                                                                                r.fillStyle = "#71aad6",
                                                                                                                si(0, 0, .6 * e.scale, r)) : "blocker" == e.name ? (r.fillStyle = "#7e7f82",
                si(0, 0, e.scale, r),
                r.fill(),
                r.stroke(),
                r.rotate(Math.PI / 4),
                r.fillStyle = "#db6e6e",
                ci(0, 0, .65 * e.scale, 20, 4, r, !0)) : "teleporter" == e.name && (r.fillStyle = "#7e7f82",
                                                                                    si(0, 0, e.scale, r),
                                                                                    r.fill(),
                                                                                    r.stroke(),
                                                                                    r.rotate(Math.PI / 4),
                                                                                    r.fillStyle = "#d76edb",
                                                                                    si(0, 0, .5 * e.scale, r, !0));
            n = i,
            t || (ii[e.id] = n)
        }
        return n
    }

        function si(e, t, n, i, r, s) {
            (i = i || be).beginPath(),
                i.arc(e, t, n, 0, 2 * Math.PI),
                s || i.fill(),
                r || i.stroke();
        }

        function ai(e, t, n, i) {
            var r,
                s,
                a = (Math.PI / 2) * 3,
                o = Math.PI / t;
            e.beginPath(), e.moveTo(0, -n);
            for (var c = 0; c < t; c++)
                (r = Math.cos(a) * n),
                    (s = Math.sin(a) * n),
                    e.lineTo(r, s),
                    (a += o),
                    (r = Math.cos(a) * i),
                    (s = Math.sin(a) * i),
                    e.lineTo(r, s),
                    (a += o);
            e.lineTo(0, -n), e.closePath();
        }

        function oi(e, t, n, i, r, s) {
            r.fillRect(e - n / 2, t - i / 2, n, i),
                s || r.strokeRect(e - n / 2, t - i / 2, n, i);
        }

        function ci(e, t, n, i, r, s, a) {
            s.save(), s.translate(e, t), (r = Math.ceil(r / 2));
            for (var o = 0; o < r; o++)
                oi(0, 0, 2 * n, i, s, a), s.rotate(Math.PI / r);
            s.restore();
        }

        function li(e){
            let c = [];
            for(var t = 0; t < e.length; t += 8){
                e[t + 7] >= 0 && R && e[t + 7] != R.sid && (!R.team || !Member(e[t + 7])) && c.push({id: e[t + 6], x: e[t + 1], y: e[t + 2], sid: e[t + 7]});
                nt.add(e[t], e[t + 1], e[t + 2], e[t + 3], e[t + 4], e[t + 5], l.list[e[t + 6]], !0, e[t + 7] >= 0 ? {sid: e[t + 7]} : null);
            };
            if(!Hacks) return;
            for(let v in c){
                if(v > 0 && c[v].id == 16){
                    let g = Ii(c[v].sid);
                    let hfh;
                    if(AutoPlace && !InInsta && g && g.y2 && (hfh = g.moveDir - Math.PI) && Math.hypot(g.y2 - c[v].y, g.x2 - c[v].x) <= 400 && s.getAngleDist(s.getDirection(R.x2, R.y2, g.x2, g.y2), hfh) <= Math.PI / 3 && Math.hypot(g.y2 - R.y2, g.x2 - R.x2) <= 300){
                        place(R.items[2], hfh)
                        place(R.items[2], hfh + Math.PI / 2);
                        place(R.items[2], hfh - Math.PI / 2);
                    };
                };
            };
        };

        function hi(e, t) {
            (_ = Mi(t)) &&
                ((_.hitTime = Date.now()), (_.xWiggle += o.gatherWiggle * Math.cos(e)),
                 (_.yWiggle += o.gatherWiggle * Math.sin(e)));
        }

        function rq(x, y, dir, obj, owner, scale, range, skipMov = true){
            if(!obj || !obj.scale) return false;
            !owner && (owner = {sid: -1, x: -1, y: -1, team: null});
            scale = obj.scale;
            range = obj.range;
            for(let u = 0; u < range; u += 35){
                let o, f, h, e = Y, t = W, c = [];
                if (skipMov) {
                    skipMov = !1;
                } else {
                    x += u * Math.cos(dir);
                    y += u * Math.sin(dir);
                    range -= u;
                    if(range <= 0){
                        x += range * Math.cos(dir)
                        y += range * Math.sin(dir)
                        u = 1
                        range = 0
                        return false;
                    };
                    for (c.length = 0,
                         f = 0; f < e.length + t.length; ++f)
                        !(o = e[f] || t[f - e.length]).alive || o == owner || owner.team && o.team == owner.team || s.lineInRect(o.x2 - o.scale, o.y2 - o.scale, o.x2 + o.scale, o.y2 + o.scale, x, y, x + u * Math.cos(dir), y + u * Math.sin(dir)) && c.push(o);
                    for (var d = nt.getGridArrays(x, y, scale), p = 0; p < d.length; ++p)
                        for (var g = 0; g < d[p].length; ++g)
                            h = (o = d[p][g]).getScale(),
                                o.active && c.indexOf(o) < 0 && !o.ignoreCollision && s.lineInRect(o.x - h, o.y - h, o.x + h, o.y + h, x, y, x + u * Math.cos(dir), y + u * Math.sin(dir)) && c.push(o);
                    if (c.length > 0) {
                        var m = null,
                            yz = null,
                            k = null;
                        for (f = 0; f < c.length; ++f)
                            k = s.getDistance(x, y, c[f].x, c[f].y),
                                (null == yz || k < yz) && (yz = k,
                                                           m = c[f]);
                        return m;
                        if (m.isPlayer || m.isAI) {
                            var v = .3 * (m.weightM || 1);
                            null != m.weaponIndex && i.weapons[m.weaponIndex].shield && s.getAngleDist(dir + Math.PI, m.dir) <= r.shieldAngle || null;
                        }
                    }
                }
            };
        };

        function ui(e, t, p) {
            if(!p) return Fixed.push({indicator: ui, data: [e, t, l]});
            (_ = Mi(e)) &&
                ((_.dir = t),
                 (_.xWiggle += o.gatherWiggle * Math.cos(t + Math.PI)),
                 (_.yWiggle += o.gatherWiggle * Math.sin(t + Math.PI)),
                 (_.shootCount = 0), e = rq(_.y, _.y, t, p.projectiles[1], _), e && console.log(e.name));
        }

        function fi(e, t, n, i, r, s, a, o) {
            lt && (J.addProjectile(e, t, Math.atan2(Math.sin(n), Math.cos(n)), i, r, s, null, null, a).sid = o);
            px(e, t, n, i, r, s, a, o);
        };
        let inFlight = [];

        class Projectile {
            constructor(o, x, y, n, r, t, s){
                this.x = e;
                this.y = y;
                this.dir = n;
                this.estimate = t;
                this.speed = s.speed;
                this.scale = s.scale;
                this.dmg = s.dmg;
                this.owner = o;
                this.original = s;
                this.at = Date.now();
                this.active = true;
                this.oldUpdate = Date.now();
            };
            update(){
                if(!this.active) return;
                if(Date.now() - this.at >= 2e3) return;
                this.x = this.x + (Date.now() - this.oldUpdate) * Math.cos(this.dir);
                this.y = this.y + (Date.now() - this.oldUpdate) * Math.sin(this.dir);
                this.estimate = Math.ceil((Math.hypot(R.x2 - this.x, R.y2 - this.y) - this.scale) / (this.speed * (1e3 / 9)));
                let Future = rq(this.y, this.y, this.dir, this.original, this.owner);
                (this.estimate <= 0 || !Future || Future.sid != R.sid || !Future.isPlayer) && (this.active = false);
                this.oldUpdate = Date.now();
            };
        };
        let SafeDefense = 0;
        function ProjectileSafety(e, t, n, i){
            e = 0;
            t = e;
            SafeDefense = e + t;
            if(inFlight.length < 1) return;
            for(let a of inFlight) a.active && (a.estimate <= 2 ? (e += a.dmg) : (t += a.dmg)); /* Sorting damage into preventable and not */
            SafeDefense = e + t;
            if(e >= 100 * (R.skinIndex == 6 ? 1.25 : 1)) {
                Ji();
                return console.log(`Death by projectiles?`);
            };
            if((t * .75 + e) >= 100) {
                //Bu(6, 17);
                setTimeout(() => {
                    Ji();
                    setTimeout(() => {
                        Ji();
                    }, 120);
                }, 120);
                return console.log(`Preventing death by projectiles.`);
            };
        };
        function px(e, t, n, i, rs, s, a, o, p, m) {
            if(!p) return Fixed.push({indicator: px, data: [e, t, n, i, rs, s, a, o, l]});
            m = Number(i == 700 && rs == 1.5);
            for(let Musketeer of W){
                if(Musketeer.visible && ((!m && p.weapons[Musketeer.weaponIndex].projectile !== undefined && Musketeer.d2 - n == 0 && [69, 70, 71, 72].includes(Math.round(Math.hypot(Musketeer.y2 - t, Musketeer.x2 - e))) || (m && Musketeer.reloads[2] == 23 && Musketeer.skinIndex == 53 && Number(Math.round(Math.hypot(Musketeer.y2 - t, Musketeer.x2 - e))) <= 5)))) {
                    if(m){ /* Projectile is by turret gear */
                        Musketeer.reloads[2] = 0;
                        Hacks && Musketeer.reloads[0].rarity > 1 && [4, 5].includes(Musketeer.reloads[0].id) && Math.hypot(R.x2 - Musketeer.x2, R.y2 - Musketeer.y2) > 130 && Math.hypot(R.x2 - Musketeer.x2, R.y2 - Musketeer.y2) < 300 && zwh();
                    } else {
                        Musketeer.reloads[1].count = 1
                        Musketeer.reloads[1].done = false;
                        if(Musketeer.sid == R.sid || (R.team && Member(Musketeer.sid))) return;
                        let Target = rq(e, t, n, p.projectiles[Number(p.weapons[Musketeer.weaponIndex].projectile)], Musketeer);
                        let Ammo = p.projectiles[Number(p.weapons[Musketeer.weaponIndex].projectile)];
                        if(Target && Target.isPlayer && Target.sid == R.sid) inFlight.push(new Projectile(Musketeer, x, y, n, Math.hypot(R.x2 - e, R.y2 - t), Math.ceil((Math.hypot(R.x2 - e, R.y2 - t) - Ammo.scale) / (Ammo.speed * (1e3 / 9))), Ammo))
                    };
                };
            }
        };
        async function zwh(){
            //Jt(6, 0);
            await Next();
            //Jt(6, 0);
            await Next();
            //Jt(6, 0);
            await Next();
        };
        function di(e, t) {
            for (var n = 0; n < G.length; ++n) G[n].sid == e && (G[n].range = t);
        }

        function pi(e) {
            (_ = Ei(e)) && _.startAnim();
        }

        function gi(e) {
            for (var t = 0; t < Y.length; ++t)
                (Y[t].forcePos = !Y[t].visible), (Y[t].visible = !1);
            if (e) {
                var n = Date.now();
                for (t = 0; t < e.length;)
                    (_ = Ei(e[t])) ?
                        ((_.index = e[t + 1]),
                         (_.t1 = void 0 === _.t2 ? n : _.t2),
                         (_.t2 = n),
                         (_.x1 = _.x),
                         (_.y1 = _.y),
                         (_.x2 = e[t + 2]),
                         (_.y2 = e[t + 3]),
                         (_.d1 = void 0 === _.d2 ? e[t + 4] : _.d2),
                         (_.d2 = e[t + 4]),
                         (_.health = e[t + 5]),
                         (_.dt = 0),
                         (_.visible = !0)) :
                    (((_ = Z.spawn(e[t + 2], e[t + 3], e[t + 4], e[t + 1])).x2 = _.x),
                     (_.y2 = _.y),
                     (_.d2 = _.dir),
                     (_.health = e[t + 5]),
                     Z.aiTypes[e[t + 1]].name || (_.name = o.cowNames[e[t + 6]]),
                     (_.forcePos = !0),
                     (_.sid = e[t]),
                     (_.visible = !0)),
                        (t += 7);
            }
        }
        var mi = {};

        function yi(e, t) {
            var n = e.index,
                i = mi[n];
            if (!i) {
                var r = new Image();
                (r.onload = function() {
                    (this.isLoaded = !0), (this.onload = null);
                }),
                    (r.src = ".././img/animals/" + e.src + ".png"),
                    (i = r),
                    (mi[n] = i);
            }
            if (i.isLoaded) {
                var s = 1.2 * e.scale * (e.spriteMlt || 1);
                t.drawImage(i, -s, -s, 2 * s, 2 * s);
            }
        }

        function ki(e, t, n) {
            return e + n >= 0 && e - n <= oe && t + n >= 0 && t - n <= ce;
        }

        function vi(e, t) {
            var n = (function(e) {
                for (var t = 0; t < W.length; ++t)
                    if (W[t].id == e) return W[t];
                return null;
            })(e[0]);
            n || ((n = new u(e[0], e[1], o, s, J, nt, W, Y, l, et, tt)), W.push(n)),
                n.spawn(t ? H : null),
                (n.visible = !1),
                (n.x2 = void 0),
                (n.y2 = void 0),
                n.setData(e),
                t &&
                ((U = (R = n).x),
                 (D = R.y),
                 $t(),
                 On(),
                 Dn(),
                 Un(0),
                 (Be.style.display = "block"));
        }

        function wi(e) {
            for (var t = 0; t < W.length; t++)
                if (W[t].id == e) {
                    W.splice(t, 1);
                    break;
                }
        }

        function bi(e, t) {
            R && (R.itemCounts[e] = t);
        }

        function xi(e, t, n) {
            R && ((R[e] = t), n && On());
        }
        let BullTimer = 0;
        /*
    function anti(am) {
        for(let i = 0; i < am; i++) place(R.items[0], null);
        equip(22,19);
        setTimeout(() => {
         equip(6,21);
        },170);
    }*/

    function OptimisedAnti() {
       /*
        if(R.health < 100 && R.health > 75) playerAnti = "normal";
        if(R.health < 75 && R.health > 55) playerAnti = "barb";
        if(R.health > 55) playerAnti = "emp";
        if(R.health < 35) playerAnti = "autoq";
        if(R.health > 1) playerAnti = "normal";*/
        if(R.health < 65 && R.health > 55 && nearestEnemy.hat == 7) {
            equip(26, 19);
            place(foodType);
            place(foodType, null);
        }
        if(R.health < 55) {
            equip(22, 19);
            place(foodType);
            place(foodType);
        }
        if(R.health < 50) {
           place(foodType);
           place(foodType);
           place(foodType);
           place(foodType);
        }
    }
        var HealTick = 0;
        function Si(e, t) {
            (_ = Ii(e)) && (t <= _.health ? (_.hitTime = Wish) : _.buildItem(),
                            _.health = t,
                            t - _.health == ((R.skinIndex == 7 ? -5 : 0) + (R.tailIndex == 13 ? 3 : 0)) && (inBullTick = false, !InInsta ? equip(6, 21) : null, BullTimer = Wish));
        if(AutoHeal && Hacks) {
            if(R.health < 100 && R.health > 0){
                setTimeout(() => {
                    r.send('5', R.items[0], null);
                    r.send('c', 1, null);
                    r.send('c', 0, null);
                    r.send('5', R.weaponIndex, true);
                },100);
            }
        }
        }
        function onBuild(e, t, n, i, r, p){
            p = (Math.pow, Math.sqrt);
            n = e.x - t.x;
            i = e.y - t.y;
            r = e.scale + (t.getScale ? t.getScale() : t.scale);
            return (p(n * n + i * i) - r < 0)
        };
    const invisible = (e, n) => {
        return e = (e % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI), e = Math.round(e / (2 * Math.PI / invis.size)),
            null !== (n = invis.get(e)) && void 0 !== n ? n : null;
    };
        const aimAt = (e) => {
           if(Hacks) {
            lastAim = e;
            r.send('2', e);
           }else{
           r.send('2', pn());
           }
        };
        function Aim() {
           if(Hacks) {
            !AutoAim && !InInsta && !Spinner && aimAt(invisible(2 * Math.PI * Math.random()));
            (R.weaponIndex == 11) && aimAt(Number.MAX_VALUE);
           }
        }
        let lastAim;
        function place(e, t = pn()){
           if(Hacks) {
            if(InvisItem) t = invisible(t);
            if(qMode) return NoGap(t);
            r.send('5', e, null)
            r.send('c', 1, t)
            r.send('c', 0, t)
            r.send('5', R.weaponIndex, true);
            r.send('2', lastAim);
           }
        };
        function Placer(){
            if(Date.now() - Updated >= 70 || !Hacks) return;
            for(let i = 0; i < CPS; i++){
            Keys[86] && place(R.items[2]);
            Keys[78] && place(R.items[3]);
            Keys[70] && place(R.items[4]);
            Keys[72] && place(R.items[5]);
            };
        };
        function wear(id) {
            r.send('13c', 0, id, 0);
        }
        var slightLag = false;
       function SlightLag(timer) {
          setTimeout(() => {
            if(slightLag) {
                r.wave(20)
            }
        },timer);
    }
        function Degree(e){
            return Math.PI / 180 * e;
        };
        function Mills(nr){ nt.checkItemLocation
            const a = 10 === R.items[3] ? 1.115820407 : 1.141422642,
                  s = [ ...Array(3) ].map((e, t) => R.moveDir + (t - 1) * a),
                  l = s.map((e, t) => Hq(R.items[3], e, R, true));
            if(!Hq(R.items[3], R.moveDir, R, true)) return;
            if(InvisItem) InvisItem = false, nr = true;
            Hq(R.items[3], s[1], R) && (l[1] = !0, l[0] = !1);
            const f = l.reduce((e, t) => e + t, 0);
            0 !== f && (!(f > 0) || l[1]) && (s.forEach((e, t) => {
                l[t] && place(R.items[3], e);
            }));
            nr && (InvisItem = true)
               Mill = {y: R.y2, x: R.x2, z: true, k: R.moveDir};
        };
        function Hq(e, t, R, n, i, r) {
           if(!InInsta){
            if(n) r = true;
            n = l.list[e];
            if(!n) return;
            i = (35 + n.scale + (e.placeOffset || 0));
            if(r) return n && nt.checkItemLocation(R.x2 + Math.cos(t) * i, R.y2 + Math.sin(t) * i, n.scale, .6, n.id, false)
            n && nt.checkItemLocation(R.x2 + Math.cos(t) * i, R.y2 + Math.sin(t) * i, n.scale, .6, n.id, false) && place(e, t);
           }
        };
        let defaultSpam = 0;
        function Avg(e, t, n, m, r){
            if(!R.items[4] || InInsta || !AutoPlace) return null;
            t = N.filter(c => c.isItem && c.active && !c.dontGather && (c.owner.sid == R.sid || (R.team && Member(c.owner.sid))) && [6, 7, 8, 9, 15].includes(c.id) && Math.hypot(c.x - e.x2, c.y - e.y) <= 250);
            t && (t = t.sort((a, b) => Math.hypot(a.x - e.x, a.y - e.y) - Math.hypot(b.x - e.x, b.y - e.y))[0]);
            if(t && t[0]){
                n = Math.atan2(e.y2 - t[0].y, e.x2 - t[0].x);
                m = Math.hypot(t[0].y - e.y2, t[0].x - e.x2) + 3;
                r = {x: t[0].x + Math.cos(n) * m, y: t[0].y + Math.sin(n) * m};
                if(AutoPlace){
                place(R.items[2], Math.atan2(r.y - R.y2, r.x - R.x2));
                for(let i = 0; i < 50; i += 5) place(R.items[2], Math.atan2(r.y - R.y2, r.x - R.x2) + Degree(i)), place(R.items[2], Math.atan2(r.y - R.y2, r.x - R.x2) - Degree(i));
                }
            };
            t = Math.atan2(e.y - R.y2, e.x - R.x2);
            n = R.x2 + Math.cos(t) * 80;
            m = R.y2 + Math.sin(t) * 80;
            if(Math.hypot(m - e.y2, n - e.x2) <= 50 && AutoPlace){
                Hq(R.items[4], t, R);
                for(let i = 50; i < 120; i += 5) Hq(R.items[2], t + Degree(i), R);
            };
            if(wn !== undefined && Math.hypot(R.x2 - e.x2, R.y2 - e.y2) <= 150 && AutoPlace){
                defaultSpam = Wish;
                for(let i = 0; i < Degree(160); i += Math.PI / 4) Hq(R.items[Math.random() * 4 <= 2 ? 4 : 2], wn + i, R);
                for(let i = 0; i < Degree(160); i += Math.PI / 4) Hq(R.items[Math.random() * 4 <= 2 ? 4 : 2], wn - i, R);
            }
            r = N.find(c => c.isItem && c.active && !c.dontGather && c.owner.sid == R.sid && c.id == 15 && Math.hypot(c.x - e.x2, c.y - e.y2) <= 70);
            if(!r || Math.hypot(r.y - R.y2, r.x - R.x2) > 70) return null;
           if(AutoPlace){
            for(let i = 70; i < 170; i += 5){
                Hq(R.items[2], Math.atan2(r.y - R.y2, r.x - R.x2) + Degree(i), R);
                Hq(R.items[2], Math.atan2(r.y - R.y2, r.x - R.x2) - Degree(i), R);
            };
           }
        };
        setInterval(Placer, 0);
        let Shine = false;
        let Enemy;
        let Point = {in: false, r: 384};
        let Keys = new Array(100);
         var SpamDash = false;
        document.addEventListener('keydown', (e) => KeyMessage(e));
        document.addEventListener('keyup', (e) => (Keys[e.keyCode] = false));
        async function KeyMessage(e){
            if(["allianceinput", 'chatbox', 'nameinput'].includes(document.activeElement.id.toLowerCase())) return null;
            if(DisableKeys) return null;
            Keys[e.keyCode] = true;
            if(!Hacks) return;
            switch(e.keyCode){
                case 9:
                    r.free(100);
                    break;
                case 74:
                    slightLag = !slightLag;
                    r.send('ch', slightLag+('-Lagger </>'));
                    break;
                case 192:
                    SpamDash = !SpamDash;
                    if(SpamDash){
                    var level = prompt('Level of packets','100');
                    var time = prompt('Interval ms time','1000');
                    }
                    r.send('ch', SpamDash+"-waver </>");
                    setInterval(() => {
                    if(SpamDash){
                       r.free(level);
                    }
                   },time);
                    break;
            };
        };
        document.beks = 10;
        document.vex = 1e8;
        document.bd = 4;
        function NoGap(e){
            let Init = Gap[e] ? Gap[e] : Math.PI / 4;
            for(i = wn + Init; i < Math.PI * 2 + wn + Init; i += Init) place(R.items[2], i);
        };
        let Gap = []; 1.3500232038615632
        // 0.007838565599999958 per scale+
        Gap[6] = 1.3424536955948967; // small spike | 49
        Gap[7] = 1.3738079579948965; // greater spike | 52
        Gap[8] = 1.3738079579948965; // poison spike | 52
        Gap[9] = 1.3738079579948965; // spinning spike | 52
        Gap[10] = 1.115820407; // windmill | 45
        Gap[11] = 1.141422642; // faster windmill | 47
        Gap[12] = 1.141422642;// power windmill | 47
        Gap[15] = 1.3581308267948966; // trap | 50
        Gap[16] = 1.3581308267948966; // trap | 50
        let Ran = function(){};
        let Next = function(){
            return new Promise((e) => (Ran = e))
        }
        let InInsta = false;
        function delay(a) {
            return new Promise(resolve => setTimeout(resolve, a));
        }
        document.ke = 70;
        document.le = 14;
        document.gaka = 3;
       var nobull = 0;
       var laginsta = false;
        document.hah = false;
        async function Walking(e, t, n, i, y){
            t = Math.atan2(R.y2 - Enemy.y2, R.x2 - Enemy.x2);
            n = {x: e.x2 + Math.cos(t) * Point.r, y: e.y2 + Math.sin(t) * Point.r};
            i = Math.hypot(n.y - R.y2, n.x - R.x2);
            y = Math.atan2(n.y - R.y2, n.x - R.x2);
            if(i <= document.qkw){
                r.send("33", null);
                document.hah && Jt(0, 0);
                Sn(R.weapons[0], true);
                await Next();
                if([Point.r - 1, Point.r].includes(Math.round(Math.hypot(Enemy.y - R.y2, Enemy.x - R.x2)))) {
                    Point.in = false;
                    return;
                };
            };
            r.send('33', y);
            Walked = Date.now();
            Jt(0, 1);
            if(Date.now() - StartedWalking >= 2e3) {
                StartedWalking = Date.now();
                e = false;
            };
            Sn(e && i <= 35 ? R.weapons[1] : R.weapons[0], true);
            Jt(!e ? 12 : i <= 35 ? 40 : 0, 0);
            Jt(!e ? 11 : i <= 35 ? 0 : 0, 1);
            await Next();
            Enemy && Point.in && Walking(Enemy);
        };
        document.qkw = 1;
        let Spam = [0, 0];
        setInterval(() => {
            Spam[0] && Sn(R.weapons[0], true);
            Spam[1] && Sn(R.weapons[1], true);
        }, 25);
        async function bowInsta(){
            if(InInsta) return;
            InInsta = true;
            AutoAim = true;
            setTimeout(() => {
                equip(53, 19);
                r.send("6", 9);
                setTimeout(() => {
                    r.send('7', 1);
                    Sn(R.weapons[1], true);
                    setTimeout(() => {
                        r.send("6", 38);
                        r.send("6", 12);
                        setTimeout(() => {
                            r.send("6", 15);
                            setTimeout(() => {
                                equip(0, 0);
                                equip(6, 21);
                                Sn(R.weapons[0], true);
                                r.send('7', 1);
                                AutoAim = false;
                                InInsta = false;
                            }, 1e3 / 9);
                        }, 1e3 / 9);
                    }, 1e3 / 9);
                }, 1e3 / 9);
            }, 1e3 / 9);
        };
        async function Insta(e, t){
            if(InInsta) return null;
            if(R.items[4] != 16 || R.weapons[0] != 5 || ![9, 12, 13].includes(R.weapons[1])){
                InInsta = true;
                await Next();
                AutoAim = true;
                InInsta = true;
                r.send('c', 1, null);
                equip(0, 1);
                equip(7, 18);
                Spam[0] = true;
                Sn(R.weapons[0], true);
                await delay(document.ke);
                r.free(document.le);
                equip(53, 19);
                Spam[0] = false;
                Spam[1] = true;
                Sn(R.weapons[1], true);
                for(let i = 0; i < document.gaka; i++) await Next();
                Spam[1] = false;
                r.send('c', 0, null);
                Sn(R.weapons[0], true);
                Os();
                InInsta = false;
                AutoAim = false;
                chat: "Sub to D_Alpha!"
                return;
            };
            if(!Enemy) return;
            InInsta = true;
            setTimeout(() => {
                Bu(53, 21);
                setTimeout(() => {
                    e = Math.atan2(Enemy.y2 - R.y2, Enemy.x2 - R.x2);
                    place(R.items[4], e);
                    Spam[1] = true;
                    Bu(12, 11);
                    R.weapons[1] && Sn(R.weapons[1], true);
                    r.send('c', true);
                    r.send('33', e);
                    Aiming = true;
                    setTimeout(() => {
                        e = Math.atan2(Enemy.y2 - R.y2, Enemy.x2 - R.x2);
                        Bu(7, 19);
                        Spam[1] = false;
                        Sn(R.weapons[0], true);
                        Spam[0] = true;
                        r.send('33', e);
                        setTimeout(() => {
                            Aiming = false;
                            Spam[0] = false;
                            r.send('c', false);
                            r.send('33', null);
                            Os();
                            InInsta = false;
                        }, 1e3 / 9);
                    }, 1e3 / 9);
                }, 1e3 / 9);
            }, 1e3 / 9);
        };
        async function InvisBoost(e){
            if(R.skins[40] && R.items[4] != 16 && ((R.weapons[0] == 5 && R.reloads[0].rarity > 1) || R.weapons[1] == 10)) return;
            r.send('33', e);
            place(R.items[4], e);
            Jt(40, 0);
            r.send("7", 1);
            r.send("c", 1, Number.MAX_VALUE);
            aimAt(Number.MAX_VALUE);
            await Next();
            r.send("7", 1);
            r.send("c", 0);
            Os();
        };
        const BackPotential = async function(e, t, i, r, k, d, n = Enemy){
            /*
            1. When a player is not near it should place 3 mills.
            2. If a player is near but infront of you it should do spikes.
            3. If a player is behind it should do traps.
            4. If there's a player in your screen, but he isn't near do traps.
            */
           if(AutoPlace) {
            t = (!n ? R.items[3] : n && Math.hypot(n.y2 - R.y2, n.x2 - R.x2) >= 350 ? R.items[4] : R.items[2]);
            if(t === R.items[2]){
                i = Math.atan2(e.y - R.y2, e.x - R.x2);
                r = Math.atan2(n.y - R.y2, n.x - R.x2);
                k = Math.abs(i - r);
                t = k <= Math.PI ? R.items[2] : t;
                for(i = 0; i <= Math.PI * 2; i += Math.PI / 32) Hq(t, i, R);
            };
           }
        };
        let Walked = Date.now();
        let StartedWalking = Date.now();
        let Trapped = false;
        let Updated = Date.now();
        let lastSync = Date.now();
        const Sync = async function(a){
           return;
           if(Date.now() - lastSync < 250) return;
           lastSync = Date.now();
           if(!a){
           r.send('2', 198.849251);
           setTimeout(() => r.send('2', 198.849251), 25);
           setTimeout(() => r.send('2', 198.849251), 60);
           await Next();
           console.log(R.d2)
           };
           AutoAim = true;
           Bu(7, 18);
           Sn(R.weapons[0], true);
           r.send('c', true);
           r.send('c', false);
           await Next();
           Bu(6, 21);
           Sn(R.weapons[0], true);
           AutoAim = false;
        };
       function storeBuy(newHat, newAcc) {
           r.send("13c", 1, newHat, 0);
           r.send("13c", 1, newAcc, 1);
       }

       function storeEquip(newHat, newAcc) {
           r.send("13c", 0, newHat, 0);
           r.send("13c", 0, 0, 1);
           r.send("13c", 0, newAcc, 1);
       }

       function equip(newHat, newAcc) {
          if(Hacks) {
           if (window.location.host == "sandbox.moomoo.io") {
               storeBuy(newHat, newAcc);
           }
           storeEquip(newHat, newAcc);
          }
       }
       var soldierKey = 90;//z
       var bullKey = 66;//b
       var tankKey = 67;//c
       var biomeKey = 77;//m
       var unequipKey = 16;//shift
    var hasBot = true;
    var advantageMod = false;
    document.addEventListener("keydown", function(e){
            if(["allianceinput", 'chatbox', 'nameinput'].includes(document.activeElement.id.toLowerCase())) return null;
            if(DisableKeys) return null;
       if(document.activeElement.id.toLowerCase() !== 'chatbox' && document.getElementById("mainMenu").style.display == "none" && !Hacks && advantageMod){
           if(e.key == "="){
               Sn(primary, true);
               window.storeEquip(7);
               setTimeout(() => {
                r.send('c', 1);
                setTimeout(() => {
               Sn(secondary, true);
               window.storeEquip(53);
                },60);
               },260);
               setTimeout(() => {
                   setTimeout(() => {
               r.send('c', 0);
                   },40);
               setTimeout(() => {
               window.storeEquip(0)
               },350);
               },350);
           }
           var DoingTank = false
           , DoingSoldier = false;
           if(e.key == "c" && !DoingSoldier){
               DoingTank = true;
               setTimeout(() => {
               window.storeEquip(40);
               },150);
               setTimeout(() => {
               DoingTank = false;
               },250);
           }
           if(e.key == "z" && !DoingTank){
               DoingSoldier = true;
               setTimeout(() => {
               window.storeEquip(6);
               },150);
               setTimeout(() => {
               DoingSoldier = false;
               },250);
           }
    if(e.key == "r"){
        //for(let i = 0; i < cps; i++){
    r.send("c", 1);
    r.send("c", 0);
    setTimeout(() => {
    },100);
        //}
    }
    if(e.key == "f"){
        //for(let i = 0; i < cps; i++){
    r.send("c", 1);
    r.send("c", 0);
    setTimeout(() => {
    },100);
        //}
    }
    if(e.key == "n"){
        //for(let i = 0; i < cps; i++){
    r.send("c", 1);

    r.send("c", 0);
    setTimeout(() => {

    },100);
        //}
    }
    if(e.key == "h"){
      //  for(let i = 0; i < cps; i++){
    r.send("c", 1);

    r.send("c", 0);
    setTimeout(() => {

    },100);
       // }
    }
        if(e.key == " "){
          r.send("c", 1);
        }
        if(e.keyCode == 86){
        r.send("5", R.items[2]);
        r.send("c", 1);

        r.send("c", 0);
        setTimeout(() => {

        },100);
        }
        if(e.keyCode == 81){
        if(R.health < 55){
        r.send("5", R.items[0]);
        r.send("c", 1);
        r.send("c", 0);
        }
        }
        if(e.keyCode == 82){
        r.send("5", R.items[2])
        }
        if(e.keyCode == 70){
        r.send("5", R.items[4])
        r.send("c", 1);

        r.send("c", 0);
        setTimeout(() => {

        },100);
        }
        if(e.key == "n"){
        r.send("5", millType)
        }
        if(e.key == "h"){
        r.send("5", turretType)
        }
    if(e.key == "1"){
    for(let i = 0; i < 10; i++) {
        Sn(primary, true);
    }
   }
    if(e.key == "2"){
    for(let i = 0; i < 10; i++) {
        Sn(secondary, true);
    }
   }
  }
       if(e.keyCode == 220 && document.activeElement.id.toLowerCase() !== 'chatbox' && document.getElementById("mainMenu").style.display == "none"){
           Hacks = !Hacks;
        if(!Hacks){
            Jt(0, 1)
            oe = 1920;
            ce = 1080;
            un();
        };
           r.send('ch', Hacks+"-hacks");
       }
       if(e.key == "l" && document.activeElement.id.toLowerCase() !== 'chatbox' && document.getElementById("mainMenu").style.display == "none"){
           autopush = !autopush;
           Hacks ? r.send('ch', autopush+"-autopush") : alert(autopush+"-autopush");
       }
       if(e.key == "]" && !Hacks && document.activeElement.id.toLowerCase() !== 'chatbox' && document.getElementById("mainMenu").style.display == "none"){
           advantageMod = !advantageMod;
           alert(advantageMod+"-advantage");
       }
       if(e.key == "u" && document.activeElement.id.toLowerCase() !== 'chatbox' && document.getElementById("mainMenu").style.display == "none"){
           Removing = true;
           hasBot = false;
           r.send('ch', "Warning[D_Alphas-Removed] </>");
       }
       if(e.key == "i" && document.activeElement.id.toLowerCase() !== 'chatbox' && document.getElementById("mainMenu").style.display == "none"){
           var botCount = prompt('BotCount[1-40]');
           Bots(botCount, "D_Alphabot_A");
           hasBot = true;
           r.send('ch', `Warning[Connecting D_Alpha-[${botCount}]D_Alpha] </>`);
       }
      if(document.activeElement.id.toLowerCase() !== 'chatbox' && document.getElementById("mainMenu").style.display == "none" && Hacks){
        if(e.key == "y") { // lag insta
            AutoAim = true;
            InInsta = true;
            if(R.health < 25) return place(R.items[0]);
            doNewSend(["5", [primary, true]]);
            equip(nearestEnemy.hat == 11 ? 6 : 7, 21);
            r.wave(23)
            doNewSend(["c", [1]]);
            setTimeout( () => {
                r.wave(15)
               if(R.health < 25) return place(R.items[0]);
                equip(nearestEnemy.hat == 22 ? 11 : 53, 21);
                r.wave(10)
                doNewSend(["5", [secondary, true]]);
            }, instaSpeed - 110);

            setTimeout( () => {
                doNewSend(["c", [0]]);
                doNewSend(["5", [primary, true]]);
               if(isEnemyNear) {
                equip(6, 21);
               }else{
                equip(6, 11);
               }
                InInsta = false;
                AutoAim = false;
            }, instaSpeed);
        }
        if(e.key == "r") {
            AutoAim = true;
            InInsta = true;
            doNewSend(["5", [primary, true]]);
            equip(nearestEnemy.hat == 11 ? 6 : 7, 21);
            doNewSend(["c", [1]]);
            setTimeout( () => {
               if(R.health < 25) return place(R.items[0]);
                equip(nearestEnemy.hat == 22 ? 11 : 53, 21);
                doNewSend(["5", [secondary, true]]);
            }, instaSpeed - 110);

            setTimeout( () => {
                doNewSend(["c", [0]]);
                doNewSend(["5", [primary, true]]);
               if(isEnemyNear) {
                equip(6, 21);
               }else{
                equip(6, 11);
               }
                InInsta = false;
                AutoAim = false;
            }, instaSpeed);
        }
        if(e.key == "t") {
            AutoAim = true;
            InInsta = true;
            doNewSend(["13c", [0, 0, 0]]);
            doNewSend(["13c", [0, 0, 18]]);
            place(boostType, nearestEnemyAngle);
            doNewSend(["13c", [1, 53, 0]]);
            doNewSend(["5", [secondary, true]]);
            doNewSend(["13c", [0, 53, 0]]);
            doNewSend(["7", [2]]);
            setTimeout(() => {
                doNewSend(["5", [primary, true]]);
                doNewSend(["13c", [1, 7, 0]]);
                doNewSend(["13c", [0, 7, 0]]);
            }, 110);
            setTimeout(() => {
                doNewSend(["13c", [0, 0, 0]]);
                doNewSend(["7", [1]]);
                doNewSend(["5", [primary, true]]);
                doNewSend(["13c", [0, 6, 0]]);
                doNewSend(["13c", [1, 6, 0]]);
                doNewSend(["13c", [0, 11, 1]]);
                doNewSend(["13c", [1, 11, 1]]);
                InInsta = false;
                AutoAim = false;
            }, 225);
        }
        if(e.key == ".") {
            AutoAim = true;
            InInsta = true;
            doNewSend(["5", [secondary, true]]);
            equip(53, 21);
            doNewSend(["c", [1]]);
            setTimeout( () => {
                equip(26, 21);
                doNewSend(["6", [12]]);
            }, 100);
            setTimeout( () => {
                doNewSend(["6", [15]]);
            }, 200);
            setTimeout( () => {
                doNewSend(["c", [0]]);
               if(isEnemyNear) {
                equip(6, 21);
               }else{
                equip(6, 11);
               }
                doNewSend(["5", [primary, true]]);
                InInsta = false;
                AutoAim = false;
            }, 300);
        }
        if(e.key == " ") {
            AutoAim = true;
            InInsta = true;
            doNewSend(["5", [primary, true]]);
            equip(nearestEnemy.hat == 11 ? 6 : 7, 21);
            place(spikeType, boostDir + toRad(45));
            place(spikeType, boostDir - toRad(45));

            doNewSend(["c", [1]]);

            setTimeout( () => {
                equip(53, 21);
            }, 100);

            setTimeout( () => {
                doNewSend(["c", [0]]);
               if(isEnemyNear) {
                equip(6, 21);
               }else{
                equip(6, 11);
               }
                InInsta = false;
                AutoAim = false;
            }, 200);
        }
       if(e.key == "["){
           AutoBreak = !AutoBreak;
           r.send('ch', AutoBreak+"-autobreak </>");
       }
       if(e.key == "]"){
           AutoPlace = !AutoPlace;
           r.send('ch', AutoPlace+"-autoplace </>");
       }
       if(e.key == ","){
           automill = !automill;
           r.send('ch', automill+"-automill </>");
       }
       if(e.key == "з"){
           gameUi = !gameUi;
           for(let i in ElementsUI) document.getElementById(ElementsUI[i]).style.display = gameUi && ElementsUI[i] != 'allianceMenu' ? 'block' : 'none';
           r.send('ch', gameUi+"-ui </>");
       }
       if(e.key == "p"){
           InvisItem = !InvisItem;
           InvisProj = !InvisProj;
           r.send('ch', InvisItem+"-invis </>");
       }
       if(e.key == "х"){
           r.free(1e3, document.boko)
       }
       if(e.key == "/"){
           HatLoop = !HatLoop;
           r.send('ch', HatLoop+"-loophat </>");
       }
           if(e.keyCode == bullKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
               equip(7,18)
           }else if(e.keyCode == soldierKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
               equip(6,21)
           }else if(e.keyCode == tankKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
               equip(40,19)
           }else if(e.keyCode == unequipKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
               equip(0,0)
           }else if(e.keyCode == biomeKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
               if (R.y < 2400) {
                   equip(15,11)
               }else if (R.y > 6850 && R.y < 7550) {
                   equip(31,11)
               } else if (R.y > 2400 && (R.y < 6850 || R.y > 7550)) {
                   equip(12,11)
               }
           }
      }
    });
       function isElementVisible(e) {
           return (e.offsetParent !== null);
       }
       function toRad(angle) {
           return angle * 0.01745329251;
       }
       var OldX;
       var OldY;
       var automillx = 15;
       var Tick = 0
       var automilly = 15;
       var automill = false;
       function Am() {
           if(automillx == false){
               automillx = R.x;
           }
           if(automilly == false){
               automilly = R.y;
           }
           if(OldY != R.y || OldX != R.x){
               if (automill==true) {
                   if(Math.sqrt(Math.pow((R.y-automilly), 2) + Math.pow((R.x-automillx), 2)) > 100) {
                       place(R.items[3], Math.atan2(OldY - R.y, OldX - R.x) + toRad(71));
                       place(R.items[3], Math.atan2(OldY - R.y, OldX - R.x) - toRad(71));
                       place(R.items[3], Math.atan2(OldY - R.y, OldX - R.x) - toRad(0));
                       automillx = R.x;
                       automilly = R.y;
                   }
               }
               OldX = R.x;
               OldY = R.y;
           }
       }
var autopush = false;
let Push = false;
function whenBuild(e, t, n, i, r, p, k = 0){
    p = (Math.pow, Math.sqrt);
    n = e.x - t.x;
    i = e.y - t.y;
    r = e.scale + (t.getScale ? t.getScale() : t.scale) - k;
    return (p(n * n + i * i) - r < 0)
};
const isMember = function(e){
    for(let i = 0; i < Pt.length; i += 2){
        if(e == Pt[i]) return true;
    };
    return false;
}
async function Pusher(e, t, n, i, k, v, l, j, m){
if(autopush && R !== _){
    e = function(){
        Push && (Push = false, r.send('33', null));
    };
    t = N.find(c => c.isItem && c.active && !c.dontGather && c.owner.sid == R.sid && c.id == 15 && Math.hypot(c.x - _.x2, c.y - _.y2) <= 50);
    if(!t) return e();
    if(t && Math.hypot(t.x - R.x2, t.y - R.y2) <= 300){
        n = N.filter(c => c.isItem && c.active && !c.dontGather && c.owner && (c.owner.sid == R.sid || (R.team && isMember(c.owner.sid))) && [6, 7, 8, 9].includes(c.id));
        if(!n || !n.length) return e();
        n = n.sort((a, b) => Math.hypot(a.x - _.x2, a.y - _.y2) - Math.hypot(b.x - _.x2, b.y - _.y2))[0];
        if(!n) return e();
        if(Math.hypot(t.x - n.x, t.y - n.y) <= 50 + n.scale + 35){
            i = Math.atan2(_.y - n.y, _.x - n.x);
            function uc(h){
                k = Math.hypot(n.x - _.x, n.y - _.y) + h;
                v = {
                    x: n.x + (k * Math.cos(i)),
                    y: n.y + (k * Math.sin(i))
                };
                m = N.find(c => c.isItem && !c.ignoreCollision && whenBuild({x: v.x, y: v.y, scale: 35}, c));
            };
            uc(70);
            uc(!m ? 70 : 60);
            uc(!m ? 60 : 50);
            if(whenBuild(_, n)) return e();
            Push = true;
            r.send('33', Math.hypot(v.x - R.x2, v.y - R.y2) > 20 ? Math.atan2(v.y - R.y2, v.x - R.x2) : Math.atan2(n.y - R.y2, n.x - R.x2));
        };
    };
}
};
        /*
function EnemyTracer() {
    if(!Enemy) return Mt = {};
    if(Enemy){
     Mt
     Mt.x = Enemy.x
     Mt.y = Enemy.y
    }
}
function AnimalTracer() {
    if(!_.isPlayer){
     Ar
     Ar.x = _.x
     Ar.y = _.y
 }
}*/
        function Ti(e) {
        r.send("chat", 'hey');
           if(Hacks) {
            Am();
            Aim();
            SlightLag();
           }
            if(AutoHeal && Hacks) {
                OptimisedAnti();
            }
            if(R.health < 100){
                HealTick++
            }
            if(R.weaponIndex[1] == 9 || R.weaponIndex[1] == 12 || R.weaponIndex[1] == 13 || R.weaponIndex[1] == 15){
                Spinner = false;
            }else{
                if(Hacks){
                Spinner = true;
                }else{
                 Spinner = false;
                }
            }
            Enemy = null;
            for (var t = Date.now(), n = 0; n < W.length; ++n)
                (W[n].forcePos = !W[n].visible), (W[n].visible = !1);
            for (n = 0; n < e.length;)
                (_ = Ii(e[n])) &&
                    ((_.t1 = void 0 === _.t2 ? t : _.t2),
                     (_.t2 = t),
                     (_.x1 = _.x),
                     (_.y1 = _.y),
                     (_.x2 = e[n + 1]),
                     (_.y2 = e[n + 2]),
                     (_.d1 = void 0 === _.d2 ? e[n + 3] : _.d2),
                     (_.d2 = e[n + 3]),
                     (_.dt = 0),
                     (_.moveDir = Math.atan2(_.y1 - _.y2, _.x1 - _.x2)),
                     (_.speed = Math.hypot(_.y1 - _.y2, _.x1 - _.x2)),
                     (_.buildIndex = e[n + 4]),
                     (_.weaponIndex = e[n + 5]),
                     (_.weaponVariant = e[n + 6]),
                     (_.team = e[n + 7]),
                     (_.isLeader = e[n + 8]),
                     (_.skinIndex = e[n + 9]),
                     (_.tailIndex = e[n + 10]),
                     (_.iconIndex = e[n + 11]),
                     (_.zIndex = e[n + 12]),
                     (_.forcePos && _.spawn()),
                     (_.visible = !0),
                     !_.xWare && (!Enemy || Math.hypot(Enemy.y2 - R.y2, Enemy.x2 - R.x2) > Math.hypot(_.y2 - R.y2, _.x2 - R.x2)) && R.sid != _.sid && (!R.team || e[n + 7] != R.team) && (Enemy = _),
                     (_.skinIndex == 45 && _.shameCount > 0 && (_.shameCount = 0)),
                     _.onTick()),
                    (n += 13);
            Wish++;
            Updated = Date.now();
            for(let i in inFlight) !inFlight[i].active ? (inFlight.splice(i, 1)) : inFlight[i].update();
            for(let i of Fixed) i.indicator(...i.data);
            Fixed = [];
            if(!Hacks) return;
            DamagePotential();
            ProjectileSafety();
            Enemy && Avg(Enemy);
            Mill.z && Mills();
            Enemy
            let Shined = Shine;
                le && (Hvk[0] || Hvk[1]) && Hgs();
                Date.now() - Walked < 500 && Enemy && R.weapons[0] == 5 && R.weapons[1] == 13 && [383, 384].includes(Math.round(Math.hypot(R.y2 - Enemy.y2, R.x2 - Enemy.x2))) && Math.round(R.speed) <= 2 && Insta();
                Date.now() - Walked < 500 && Enemy && R.weapons[1] == 9 && [694, 695, 696, 697, 698, 699].includes(Math.round(Math.hypot(R.y2 - Enemy.y2, R.x2 - Enemy.x2))) && Math.round(Enemy.speed) <= 5 && Math.round(R.speed) <= 0 && bowInsta();
                Enemy && spikeSync(Enemy);
                R.shameCount > 0 && R.skinIndex != 45 && (Wish - BullTimer) % 9 >= 0 && R.skinIndex != 7 && (inBullTick = true, equip(7, 0));
            if(AutoHeal && Hacks && le && R.skinIndex != 45 && R.hitTime && R.health < R.maxHealth) {
                Wish - R.hitTime >= (R.health - canDmg <= 0 && R.shameCount <= 5 ? 0 : 2) && /*Ji() R.health <= 70 */ Jh(Enemy);
            };
            Shined && (Shine = false);
            Os();
            Trapped = false;
            let Trap = N.find(c => c.active && Math.hypot(c.y - R.y2, c.x - R.x2) <= c.scale && c.id == 15 && c.owner.sid != R.sid && (!R.team || !Member(c.owner.sid)));
            let Scary = Enemy && Math.hypot(R.y2 - Enemy.y2, R.x2 - Enemy.x2) <= 262;
            if(Trap && AutoBreak){
                let Offense = Number(R.weapons[1] == 10);
                if(OldTrap != Trap.sid) BackPotential(Trap);
                OldTrap = Trap.sid;
                Offense && Trap.health - (l.weapons[R.weapons[0]].dmg * o.weaponVariants[R.reloads[0].rarity].val * 3.3) <= 0 && (Offense = 0);
                Trapped = true;
                if(R.reloads[Number(Offense)].done){
                    r.send('c', 1);
                    r.send('c', 0);
                    aimAt(Number.MAX_VALUE);
                    equip(0, 0);
                    equip(40, Scary ? 21 : 11);
                } else {
                    equip(0, 0);
                    equip(Scary ? 26 : 6, Scary ? 21 : 11);
                };
                r.send('5', R.weapons[Offense], true);
                BreakWeapon = (R.weapons[1] === 11 && Keys[50] ? 11 : R.weapons[Offense]);
                R.weapons[1] === 11 && Keys[50] && (Bu(0, 0), BreakWeapon = 11, Bu(Scary ? 26 : 6, Scary ? 21 : 11), aimAt(Number.MAX_VALUE), Sn(R.weapons[1], true));
            } else { /* Not in trap */
                le && (Hvk[0] || Hvk[1]) && Hgs();
                Date.now() - Walked < 500 && Enemy && R.weapons[0] == 5 && R.weapons[1] == 13 && [383, 384].includes(Math.round(Math.hypot(R.y2 - Enemy.y2, R.x2 - Enemy.x2))) && Math.round(R.speed) <= 2 && Insta();
                Date.now() - Walked < 500 && Enemy && R.weapons[1] == 9 && [694, 695, 696, 697, 698, 699].includes(Math.round(Math.hypot(R.y2 - Enemy.y2, R.x2 - Enemy.x2))) && Math.round(Enemy.speed) <= 5 && Math.round(R.speed) <= 0 && bowInsta();
                Enemy && spikeSync(Enemy);
                R.shameCount > 0 && R.skinIndex != 45 && (Wish - BullTimer) % 9 >= 0 && R.skinIndex != 7 && (inBullTick = true, equip(7, 0));
            };
                le && (Hvk[0] || Hvk[1]) && Hgs();
                Date.now() - Walked < 500 && Enemy && R.weapons[0] == 5 && R.weapons[1] == 13 && [383, 384].includes(Math.round(Math.hypot(R.y2 - Enemy.y2, R.x2 - Enemy.x2))) && Math.round(R.speed) <= 2 && Insta();
                Date.now() - Walked < 500 && Enemy && R.weapons[1] == 9 && [694, 695, 696, 697, 698, 699].includes(Math.round(Math.hypot(R.y2 - Enemy.y2, R.x2 - Enemy.x2))) && Math.round(Enemy.speed) <= 5 && Math.round(R.speed) <= 0 && bowInsta();
                Enemy && spikeSync(Enemy);
                R.shameCount > 0 && R.skinIndex != 45 && (Wish - BullTimer) % 9 >= 0 && R.skinIndex != 7 && (inBullTick = true, equip(7, 0));
            Ran();
            Enemy && Agy(Enemy);
            Ables = [];
            setTimeout(() => PrototypePlace(), 90)
        };
        function PrototypePlace(e, t){
            if(AutoPlace || [9, 12, 13, 15].includes(R.weaponIndex) || !Enemy || Math.hypot(R.x2 - Enemy.x2, R.y2 - Enemy.y2) >= 300) return;
            t = N.filter(c => c.active && c.hitTime && Date.now() - c.hitTime <= 1e3 && c.health <= c.maxHealth / 2 && [6, 7, 8, 9, 15].includes(c.id) && Math.hypot(R.x2 - c.x, R.y2 - c.y) <= c.scale + 147);
            e = Keys[86] || R.items[4] != 15 ? R.items[2] : R.items[4];
            if(t) for(let j of t){
                for(let i = 0; i < Math.PI / 4; i += Math.PI / 8) place(e, i + Math.atan2(j.y - R.y2, j.x - R.x2)), place(e, i - Math.atan2(j.y - R.y2, j.x - R.x2));
            };
        };
        let inBullTick = false;
        document.bek = 6;
        document.awq = 360 * 2
        const Gaps = [1.2718244790949085, 1.2718244790949085, 1.2718244790949085, 1.2718244790949085, 1.2718244790949085];
        function GapCheck(){
            for(let i = 0; i < Math.PI; i += Math.PI / document.awq){
                if(Hqh(R.items[document.asn], i)){
                    console.log(i);
                    return;
                };
            };
        };
        function Hqh(e, t, n, i) {
            n = l.list[e];
            i = (35 + n.scale + (e.placeOffset || 0));
            if(n && nt.checkItemLocation(R.x2 + Math.cos(t) * i, R.y2 + Math.sin(t) * i, n.scale, .6, n.id, false)){
                Ables.push({x: R.x2 + Math.cos(t) * i, y: R.y2 + Math.sin(t) * i})
                return true;
            };
            return false;
        };
        let Ables = [];
        let OldTrap = 0;
        let BreakWeapon = 0;
        document.ek = 25;
        function spikeSync(e, j, t, n, i, k){
            k = e.speed - document.ek;
            n = (l.weapons[R.weapons[0]].dmg * o.weaponVariants[R.reloads[0].rarity].val * 1.5 * (e.skinIndex == 6 ? .75 : 1))
            t = {x: (e.x2 + Math.cos(e.moveDir) * k), y: (e.y2 + Math.sin(R.moveDir) * k)}
            j = N.find(c => c.active && onBuild({x: t.x, y: t.y, scale: 35}, c) && [6, 7, 8, 9].includes(c.id) && (R.sid == c.owner.sid || (R.team && !Member(c.owner.sid))));
            i = Boolean(j && 100 - j.dmg * (e.skinIndex == 6 ? .75 : 1) - n <= 0 && Math.hypot(R.y2 - t.y, R.x2 - t.x) <= 200);
            i && (AutoAim = true,
                  Sn(R.weapons[0], true),
                  Bu(7, 18),
                  r.send('c', true),
                  r.send('c', false),
                  setTimeout(() => {
                AutoAim = false;
            }, 120));
        };
        function Agy(e, t, n, i, k, j, h){
            j = Math.hypot(R.y2 - e.y2, R.x2 - e.x2);
            n = (j <= 395 && j >= 340);
            t = ([9, 12, 13].includes(e.reloads[1].id) && e.reloads[0].id == 5 && [2, 3].includes(e.reloads[0].rarity) && e.reloads[2] > 21 && n);
            if(n && [9, 12, 13].includes(e.weaponIndex) && e.reloads[0].id == 5 && [2, 3].includes(e.reloads[0].rarity)){
                //Jt(6, 0);
            } else if(t){
            };
        };
        let EmpOn = Date.now();
        function Rhs(e, t){
           if(AutoPlace) {
            if([9, 12, 13, 15].includes(R.weaponIndex) || !Enemy || Math.hypot(R.x2 - Enemy.x2, R.y2 - Enemy.y2) >= 450) return;
            t = N.filter(c => c.active && c.hitTime && Date.now() - c.hitTime <= 2e3 && c.health <= c.maxHealth / 2 + 10 && [6, 7, 8, 9, 15].includes(c.id) && Math.hypot(R.x2 - c.x, R.y2 - c.y) <= c.scale + 147);
            e = Keys[86] || R.items[4] != 15 ? R.items[2] : R.items[4];
            if(t) for(let j of t) place(e, Math.atan2(j.y - R.y2, j.x - R.x2));
           }
        };
        let Hvk = [0, 0];
        setInterval(() => {
            if(AutoAim){
                aimAt(nearestEnemyAngle);
            } else if(Trapped && AutoBreak) {
                r.send('5', BreakWeapon, true);
                r.send('c', true);
                r.send('c', false);
            };
        });
        async function Hgs(e, t, i, h, k){
            if(!Hacks || R.weaponIndex == 11) return;
            h = pn();
            Enemy && (i = Enemy);
            e = (i && Math.atan2(i.y2 - R.y2, i.x2 - R.x2) - Math.PI / 2 < h && h < Math.atan(i.y2 - R.y2, i.x2 - R.x2) + Math.PI / 2 && Math.hypot(i.y2 - R.y2, i.x2 - R.x2) - 70 <= l.weapons[R.weapons[0]].range);
            t = N.find(c => c.isItem && c.active && Math.atan2(c.y - R.y2, c.x - R.x2) - Math.PI / 2 < h && h < Math.atan(c.y - R.y2, c.x - R.x2) + Math.PI / 2 && Math.hypot(c.y - R.y2, c.x - R.x2) - 35 - c.scale <= l.weapons[R.weapons[0]].range);
            k = N.find(c => !c.isItem && Math.atan2(c.y - R.y2, c.x - R.x2) - Math.PI / 2 < h && h < Math.atan(c.y - R.y2, c.x - R.x2) + Math.PI / 2 && Math.hypot(c.y - R.y2, c.x - R.x2) - 35 - c.scale <= l.weapons[R.weapons[0]].range);
            !e && !t && (e = Y.find(c => c.visible && Math.atan2(c.y2 - R.y2, c.x2 - R.x2) - Math.PI / 2 < h && h < Math.atan(c.y2 - R.y2, c.x2 - R.x2) + Math.PI / 2 && Math.hypot(c.y2 - R.y2, c.x2 - R.x2) - 35 - c.scale <= l.weapons[R.weapons[0]].range));
            if(R && R.reloads[Number(R.weaponIndex > 8)].done){
                if([9, 12, 13, 15].includes(R.weaponIndex)){
                    let aimFixer = (Enemy && Math.abs(Math.atan2(Enemy.y2 - R.y2, Enemy.x2 - R.x2) - h) <= Math.PI / 2.2);
                    if(aimFixer) h = Math.atan2(Enemy.y2 - R.y2, Enemy.x2 - R.x2);
                    aimAt(InvisProj ? invisible(h) : h);
                    Bu(Enemy && Math.hypot(Enemy.y2 - R.y2, Enemy.x2 - R.x2) <= 300 ? 20 : 1, 11);
                } else if(![9, 12, 13, 15].includes(R.weaponIndex)){
                    if(e || t || k) e ? (R.tailIndex == 11 && Jt(0, 1), Bu(7, 18)) : k ? Bu(20, 11) : null
                    let xU = W.find(c => c.sid != R.sid && c.xWare && (!R.team || !Member(c.sid)) && Math.abs(Math.atan2(c.y2 - R.y2, c.x2 - R.x2) - h) <= Math.PI / 2 && Math.hypot(c.y2 - R.y2, c.x2 - R.x2) <= l.weapons[R.weaponIndex].range + 70);
                    if(xU) h += Math.PI;
                    aimAt(Number.MAX_VALUE);
                };
            } else if(![9, 12, 13, 15].includes(R.weaponIndex)){
                Enemy && Math.hypot(Enemy.y2 - R.y2, Enemy.x2 - R.x2) <= 300 && Bu(11, 11);
            };
        };
        document.hasu = 80;
        function DamagePotential(e, t, n, i, r){
            r = 0;
            let Rx = {x: R.speed * Math.cos(R.moveDir - Math.PI) + R.x2, y: R.speed * Math.sin(R.moveDir - Math.PI) + R.y2, scale: 35};
            t = N.filter(c => c.active && c.isItem && c.owner.sid != R.sid && (!R.team || !Member(c.owner.sid)) && [6, 7, 8, 9].includes(c.id) && !c.ignoreCollision && onBuild(Rx, c));
            n = W.filter(c => c.visible && c.sid != R.sid && (!R.team || !Member(c.sid)) && Math.hypot(c.y2 - Rx.y, c.x2 - Rx.x) <= l.weapons[c.reloads[0].id].range + 70);
            i = Y.filter(c => c.visible && Math.hypot(c.y2 - Rx.y, c.x - Rx.x) <= c.scale + 35 && [2, 3, 4, 8].includes(c.index));
            if(t) for(let a of t) r += (a.dmg ? a.dmg : 0);
            if(i) for(let a of i) r += (a.dmg ? a.dmg : 0);
            if(n) for(let a of n) r += (a.reloads[0].done ? (l.weapons[a.reloads[0].id].dmg * o.weaponVariants[a.reloads[0].rarity].val * 1.5) : 0) + (a.reloads[2] == 23 ? 25 : 0) + (a.reloads[1].done ? (l.weapons[a.reloads[1].id].projectile !== undefined ? l.projectiles[l.weapons[a.reloads[1].id].projectile].dmg : (l.weapons[a.reloads[1].id].dmg * o.weaponVariants[a.reloads[1].rarity].val * 1.5)) : 0);
            canDmg = r + SafeDefense;
            return;
            R.shameCount < 7 && canDmg >= document.hasu && setTimeout(() => {
                //Bu(6, 21);
                Ji();
            }, 120);
        };
        let canDmg = 0;
        let defaultStop = 0;
        document.beku = 14;
        function InstaCounter(){
            R.shameCount >= 4 && r.free(document.beku);
            Ji(R.health);
        };
        function Jh(e, t, n, v) {
            return;
            if(!e) return;
            t = W.find(c => c.sid != e.sid && R.sid != c.sid && (!R.team || !Member(c.sid)) && [3, 4, 5].includes(c.reloads[0].id) && Math.hypot(c.y2 - R.y2, c.x2 - R.x2) <= 200);
            if(R.shameCount < 7 && (Wish - defaultStop > 1 || t) && !N.find(c => c.isItem && c.owner.sid != R.sid && (!R.team || !Member(c.owner.sid)) && [6, 7, 8, 9].includes(c.id) && !c.ignoreCollision && onBuild({x: R.x2, y: R.y2, scale: 35}, c)) && ((Math.hypot(e.y2 - R.y2, e.x2 - R.x2) <= 240 && [3, 4, 5].includes(e.reloads[0].id)) || t)) {
                defaultStop = Wish;
                equip(22, 21);
                r.free(document.rarar);
                InstaCounter();
            };
        };
        let FreeHats = [51, 50, 28, 29, 30, 36, 37, 38, 44, 35, 42, 43, 49];
        let HatIndex = 0;
        function HatLooping(e){
            e = FreeHats[HatIndex];
            if(!e){
                HatIndex = 0;
                e = 51;
            };
            HatIndex++;
            return Jt(e);
        };
        let defaultHat = 6;
        let defaultAccessor = 21;
        function Os(e , t){ // fix this
            !AutoAim && Spinner && aimAt(invisible(2 * Math.PI * Math.random()));
            (Aim360 || R.weaponIndex == 11) && aimAt(Number.MAX_VALUE);
            if(HatLoop){
                HatIndex++;
                if(!FreeHats[HatIndex]) HatIndex = 0;
            };
            n = N.filter(c => c.active && c.isItem && R.sid != c.owner.sid && (!R.team || !Member(c.owner.sid)) && c.id == 17 && Math.hypot(R.y2 - c.y, R.x2 - c.x) <= 700 + 35 + c.scale);
            e = n && n.length >= 6 ? 22 : R.y2 >= 6838 && R.y2 <= 7562 && "number" == typeof wn ? 31 : Enemy && Math.hypot(R.y2 - Enemy.y2, R.x2 - Enemy.x2) <= l.weapons[Enemy.reloads[0].id].range + 70 && 0 === Enemy.reloads[0].rarity ? "number" == typeof wn ? 26 : 6 : n && n.length >= 2 ? 22 : R.y2 <= 2400 && "number" == typeof wn ? 15 : HatLoop ? FreeHats[HatIndex] : AssassinGear ? 56 : "number" == typeof wn ? 12 : defaultHat;
            t = 26 === e || 11 === e && R.speed < 15 ? 21 : "number" == typeof wn ? 11 : defaultAccessor;
            Bu(0, 0);
            Bu(e, t)
            return;
            if(AssassinGear) {
                Jt(56, 0);
                return Jt(11, 1);
            };
            e = N.filter(c => c.active && c.isItem && R.sid != c.owner.sid && (!R.team || !Member(c.owner.sid)) && c.id == 17 && Math.hypot(R.y2 - c.y, R.x2 - c.x) <= 700 + 35 + c.scale);
            if(e && e.length >= 4){
                !HatLoop ? Jt(22, 0) : HatLooping();
            } else if(Enemy && Math.hypot(R.y2 - Enemy.y2, R.x2 - Enemy.x2) <= 262){
                Bu(11, 11);
                return null;
            } else if(!AssassinGear && !HatLoop && wn === undefined){
                return Bu(0, 0)
            } else if(R.y > 6850 && R.y < 7550){
                Jt(31, 0);
            } else if(R.y < 2400){
                (!HatLoop || wn !== undefined) ? Jt(15, 0) : HatLooping();
            } else {
                HatLoop ? HatLooping() : Jt(12, 0);
            };
            Jt(11, 1);
        };
        function Ji(e, t = [20, 40, 30]) {
            if(AssassinGear || R.skinIndex == 56) Jt(0, 0);
            for (var n = 0; n < 100; n += 20) place(R.items[0]);
        }
        function Ii(e) {
            for (var t = 0; t < W.length; ++t)
                if (W[t].sid == e) return W[t];
            return null;
        }

        function Ei(e) {
            for (var t = 0; t < Y.length; ++t)
                if (Y[t].sid == e) return Y[t];
            return null;
        }

        function Mi(e) {
            for (var t = 0; t < N.length; ++t)
                if (N[t].sid == e) return N[t];
            return null;
        }
        var Ai = -1;
        let Lds = Date.now();
        setInterval(() => {
            window.pingTime = Date.now() - Ai;
            if(window.pingTime > 10e3) return;
            if(window.pingTime > 75 && Enemy && Math.hypot(Enemy.y2 - R.y2, Enemy.x2 - R.x2) <= 200 && [3, 4, 5].includes(Enemy.reloads[0].id) && Date.now() - Lds > 130) {
                Lds = Date.now();
                //for(let i = 0; i < 5; i++) place(R.items[0]);
            };
        }, 20);
        let Responsed = true;
        function Pi() {
            Responsed = true;
        }
        document.currentPing = 0;
        function Bi() {
            if(!Responsed && Date.now() - Ai < 1e3) return;
            document.currentPing = Date.now() - Ai;
            Ie.innerText = " " + " ";
            window.pingTime = document.current
            Responsed = false;
            // window.pingTime && window.pingTime > 85 && console.log(window.pingTime);
            Ai = Date.now();
            r.send("pp");
        }

        function br(t, x, y, i, r, u, k = 0) {
            be.save();
      //      be.shadowColor = 'rgba(0, 0, 0, 0.5)';
       //     be.shadowBlur = 1000000000000;
      //      be.shadowOffsetY = 0;
            t.fillStyle = "#3d3f42";
            t.roundRect(x - 54.5, y + _.scale + 34, 2 * (50 + k) + 2 * 4.5, 17, 8);
            t.fill();
            be.restore();
            t.fillStyle = i;
            t.roundRect(x - 50, y + _.scale + 38.5, 2 * (50 + k) * (r / u), 8, 7);
            t.fill();
        };

        function Ci(e) {
            if (!(e < 0)) {
                var t = Math.floor(e / 60),
                    n = e % 60;
                (n = ("0" + n).slice(-2)),
                    (Ee.innerText = "Server restarting in " + t + ":" + n),
                    (Ee.hidden = !1);
            }
        }
        let Icon = {loaded: false, image: new Image(60, 45)};
        Icon.image.src = '';
        Icon.image.onload = function(){
            Icon.loaded = true;
        };
        function Beautify(e){
            e = $("#pingDisplay")
            e.css("display", "block")
            $("body").append(e)
            $("#consentBlock").css({display: "none"});
            $("#moomooio_728x90_home").parent().css({display: "none"});
            $("moomooio_728x90_home").hide();
            document.getElementById('promoImgHolder').remove();
            document.getElementById('linksContainer2').remove();
            $("#promoImgHolder").remove();
            $("div#menuCard.adCard").remove();
            document.getElementById('adCard').remove();
            document.getElementById('errorNotification').remove();
            $("#promoImgHolder").hide();
            $("div[style*='inline-block']").css('display', 'block');
            document.getElementById("moomooio_728x90_home").style.display = "none";
            let removeInterval = setInterval(() => {
                let displayer = document.getElementById("ot-sdk-btn-floating");
                if(displayer){
                    displayer.remove();
                    clearInterval(removeInterval);
                };
            });
        };
        function Oi(e) {
            window.open(e, "_blank");
        }
        let FPS = 0;
        (window.requestAnimFrame =
         window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         function(e) {
            window.setTimeout(e, 1e3 / 60);
        }),
            (function() {
            var e = o.mapScale / 2;
            nt.add(0, e, e + 200, 0, l.list[4].scale, l.list[4].id, l.list[10]),
                nt.add(1, e, e - Math.random(), 0, l.list[4].scale, l.list[4].id, l.list[10]),
                nt.add(2, e + Math.random(), e + Math.random(), 0, l.list[4].scale, l.list[4].id, l.list[10]),
                nt.add(3, e - Math.random(), e - Math.random(), 0, l.list[4].scale, l.list[4].id, l.list[10]),
                nt.add(4, e - Math.random(), e - Math.random(), 0, l.list[4].scale, l.list[4].id, l.list[10]),
                nt.add(5, e - Math.random(), e + Math.random(), 0, l.list[4].scale, l.list[4].id, l.list[10]),
                nt.add(6, e + Math.random(), e - Math.random(), 0, l.list[4].scale, l.list[4].id, l.list[10]),
                nt.add(7, e - Math.random(), e + Math.random(), 0, l.list[4].scale, l.list[4].id, l.list[10]),
                nt.add(8, e + Math.random(), e + Math.random(), 0, l.list[4].scale, l.list[4].id, l.list[10]),
                nt.add(9, e - Math.random(), e + Math.random(), 0, l.list[4].scale, l.list[4].id, l.list[10]),
                nt.add(10, e - Math.random(), e + Math.random(), 0, l.list[4].scale, l.list[4].id, l.list[10]),
                nt.add(11, e + Math.random(), e - Math.random(), 0, l.list[4].scale, l.list[4].id, l.list[10])
                //nt.add(12, e - 400, e - 450, 0, o.rockScales[2], 2)
        })(),
            (function e() {
            FPS++
            setTimeout(() => (FPS--), 1e3);
            (B = Date.now()),
                (P = B - q),
                (q = B),
                (function() {
                if (
                    (R &&
                     (!C || B - C >= 1e3 / o.clientSendRate) &&
                     ((C = B), ((!AutoAim && !Spinner && !Aim360) || !Hacks) && (aimAt(pn()))),
                     An < 120 &&
                     ((An += 0.1 * P),
                      (Ge.style.fontSize = Math.min(Math.round(An), 120) + "px")),
                     R)
                ) {
                    var e = s.getDistance(U, D, R.x, R.y),
                        t = s.getDirection(R.x, R.y, U, D),
                        n = Math.min(0.01 * e * P, e);
                    e > 0.05 ?
                        ((U += n * Math.cos(t)), (D += n * Math.sin(t))) :
                    ((U = R.x), (D = R.y));
                } else(U = o.mapScale / 2), (D = o.mapScale / 2);
                for (
                    var i = B - 1e3 / o.serverUpdateRate, a = 0; a < W.length + Y.length;
                    ++a
                )
                    if ((_ = W[a] || Y[a - W.length]) && _.visible)
                        if (_.forcePos)(_.x = _.x2), (_.y = _.y2), (_.dir = _.d2);
                        else {
                            var c = _.t2 - _.t1,
                                l = (i - _.t1) / c;
                            _.dt += P;
                            var h = Math.min(1.7, _.dt / 170),
                                u = _.x2 - _.x1;
                            (_.x = _.x1 + u * h),
                                (u = _.y2 - _.y1),
                                (_.y = _.y1 + u * h),
                                (_.dir = Math.lerpAngle(_.d2, _.d1, Math.min(1.2, l)));
                        }
                var f = U - oe / 2,
                    d = D - ce / 2;
                o.snowBiomeTop - d <= 0 && o.mapScale - o.snowBiomeTop - d >= ce ?
                    ((be.fillStyle = "#b6db66"), be.fillRect(0, 0, oe, ce)) :
                o.mapScale - o.snowBiomeTop - d <= 0 ?
                    ((be.fillStyle = "#dbc666"), be.fillRect(0, 0, oe, ce)) :
                o.snowBiomeTop - d >= ce ?
                    ((be.fillStyle = "#fff"), be.fillRect(0, 0, oe, ce)) :
                o.snowBiomeTop - d >= 0 ?
                    ((be.fillStyle = "#fff"),
                     be.fillRect(0, 0, oe, o.snowBiomeTop - d),
                     (be.fillStyle = "#b6db66"),
                     be.fillRect(
                    0,
                    o.snowBiomeTop - d,
                    oe,
                    ce - (o.snowBiomeTop - d),
                )) :
                ((be.fillStyle = "#b6db66"),
                 be.fillRect(0, 0, oe, o.mapScale - o.snowBiomeTop - d),
                 (be.fillStyle = "#dbc666"),
                 be.fillRect(
                    0,
                    o.mapScale - o.snowBiomeTop - d,
                    oe,
                    ce - (o.mapScale - o.snowBiomeTop - d),
                )),
                    In ||
                    ((ee += te * o.waveSpeed * P) >= o.waveMax ?
                     ((ee = o.waveMax), (te = -1)) :
                     ee <= 1 && (ee = te = 1),
                     (be.globalAlpha = 1),
                     (be.fillStyle = "#dbc666"),
                     qn(f, d, be, o.riverPadding),
                     (be.fillStyle = "#91b2db"),
                     qn(f, d, be, 250 * (ee - 1))),
                    (be.lineWidth = 4),
                    (be.strokeStyle = "#000"),
                    (be.globalAlpha = 0.06),
                    be.beginPath();
                for (var p = (14400 - f) % 50; p < oe; p += 50)
                    p > 0 && (be.moveTo(p, 0), be.lineTo(p, ce));
                for (var g = (14400 - d) % 50; g < ce; g += 50)
                    p > 0 && (be.moveTo(0, g), be.lineTo(oe, g));
                for (
                    be.stroke(),
                    be.globalAlpha = 1,
                    be.strokeStyle = it,
                    Yn(-1, f, d),
                    be.globalAlpha = 1,
                    be.lineWidth = 5.5,
                    zn(0, f, d),
                    Xn(f, d, 0),
                    be.globalAlpha = 1,
                    a = 0; a < Y.length;
                    ++a
                )
                    (_ = Y[a]).active &&
                        _.visible &&
                        (_.animate(P),
                         be.save(),
                         be.translate(_.x - f, _.y - d),
                         be.rotate(_.dir + _.dirPlus - Math.PI / 2),
                         yi(_, be),
                         be.restore());
                if (
                    (Yn(0, f, d),
                     zn(1, f, d),
                     Yn(1, f, d),
                     Xn(f, d, 1),
                     Yn(2, f, d),
                     Yn(3, f, d),
                     (be.fillStyle = "#000"),
                     (be.globalAlpha = 0.09),
                     f <= 0 && be.fillRect(0, 0, -f, ce),
                     o.mapScale - f <= oe)
                ) {
                    var y = Math.max(0, -d);
                    be.fillRect(o.mapScale - f, y, oe - (o.mapScale - f), ce - y);
                }
                if (
                    (d <= 0 && be.fillRect(-f, 0, oe + f, -d), o.mapScale - d <= ce)
                ) {
                    var k = Math.max(0, -f),
                        v = 0;
                    o.mapScale - f <= oe && (v = oe - (o.mapScale - f)),
                        be.fillRect(
                        k,
                        o.mapScale - d,
                        oe - k - v,
                        ce - (o.mapScale - d),
                    );
                }
                for (
                    be.globalAlpha = 1,
                    be.fillStyle = "rgba(0, 0, 70, 0.35)",
                    be.fillRect(0, 0, oe, ce),
                    be.strokeStyle = rt,
                    a = 0; a < W.length + Y.length;
                    ++a
                )
                    if ((_ = W[a] || Y[a - W.length]).visible && (10 != _.skinIndex || _ == R || _.team && _.team == R.team || UI)) {
                        var w = (_.team ? "[" + _.team + "] " : "") + (_.name + ' ' || "") + (`${Hacks ? _.isPlayer ? "<"+_.shameCount+">" : "" : ""}`);
                       if ("" != w) {
                           if (be.font = (_.nameScale || 30) + "px Hammersmith One",
                            be.fillStyle = "#fff",
                            be.textBaseline = "middle",
                            be.textAlign = "center",
                            be.lineWidth = _.nameScale ? 11 : 8,
                            be.lineJoin = "round",
                            be.strokeText(w, _.x - f, _.y - d - _.scale - o.nameY),
                            be.fillText(w, _.x - f, _.y - d - _.scale - o.nameY),
                            _.isLeader && Rn.crown.isLoaded) {
                                var b = o.crownIconScale;
                                k = _.x - f - b / 2 - be.measureText(w).width / 2 - o.crownPad,
                                be.drawImage(Rn.crown, k, _.y - d - _.scale - o.nameY - b / 2 - 5, b, b)
                            }
                            1 == _.iconIndex && Rn.skull.isLoaded && (b = o.crownIconScale,
                            k = _.x - f - b / 2 + be.measureText(w).width / 2 + o.crownPad,
                            be.drawImage(Rn.skull, k, _.y - d - _.scale - o.nameY - b / 2 - 5, b, b))
                        }
                       var tracer = true;
                       if(tracer && Hacks && _.isPlayer){
                           be.strokeStyle = "black";
                           be.lineWidth = .2;
                           be.beginPath();
                           be.lineCap = "round";
                           be.moveTo(R.x-f, R.y-d);
                           be.lineTo(_.x-f, _.y-d);
                           be.stroke();
                           be.strokeStyle = bt;
                       }
                       _.health > 0 && (o.healthBarWidth,
                                        be.fillStyle = rt,
                                        be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, _.y - d + _.scale + o.nameY, 2 * o.healthBarWidth + 2 * o.healthBarPad, 17, 8),
                                        be.fill(),
                                        be.fillStyle = _ == R || _.team && _.team == R.team ? "#8ecc51" : "#cc5151",
                                        be.roundRect(_.x - f - o.healthBarWidth, _.y - d + _.scale + o.nameY + o.healthBarPad, 2 * o.healthBarWidth * (_.health / _.maxHealth), 17 - 2 * o.healthBarPad, 7),
                                        be.fill())
                   }
                for (m.update(P, be, f, d), a = 0; a < W.length; ++a)
                    if ((_ = W[a]).visible && _.chatCountdown > 0) {
                        (_.chatCountdown -= P),
                            _.chatCountdown <= 0 && (_.chatCountdown = 0),
                            (be.font = "32px Hammersmith One");
                        var x = be.measureText(_.chatMessage);
                        (be.textBaseline = "middle"),
                            (be.textAlign = "center"),
                            (k = _.x - f),
                            (y = _.y - _.scale - d - 90);
                        var S = x.width + 17;
                        (be.fillStyle = "rgba(0,0,0,0.2)"),
                            be.roundRect(k - S / 2, y - 23.5, S, 47, 6),
                            be.fill(),
                            (be.fillStyle = "#fff"),
                            be.fillText(_.chatMessage, k, y);
                    }!(function(e) {
                        if (R && R.alive) {
                            Ke.clearRect(0, 0, Ne.width, Ne.height),
                                (Ke.strokeStyle = "#fff"),
                                (Ke.lineWidth = 4);
                            for (var t = 0; t < qt.length; ++t)(Vt = qt[t]).update(Ke, e);
                            if (
                                ((Ke.globalAlpha = 1),
                                 (Ke.fillStyle = "#fff"),
                                 si(
                                    (R.x / o.mapScale) * Ne.width,
                                    (R.y / o.mapScale) * Ne.height,
                                    7,
                                    Ke,
                                    !0,
                                ),
                                 (Ke.fillStyle = "green"),
                                 R.team && Et)
                            )
                                for (t = 0; t < Et.length;)
                                    si(
                                        (Et[t] / o.mapScale) * Ne.width,
                                        (Et[t + 1] / o.mapScale) * Ne.height,
                                        7,
                                        Ke,
                                        !0,
                                    ),
                                        //for (t = 0; t < Enemy.length;){
                                    (t += 2);
                        It && ( Ke.fillStyle = "darkred",
                            Ke.font = "34px Hammersmith One",
                            Ke.textBaseline = "middle",
                            Ke.textAlign = "center",
                            Ke.fillText("x", It.x / o.mapScale * Ne.width, It.y / o.mapScale * Ne.height))
                        Mt && ( Ke.fillStyle = "red",
                            Ke.font = "50px Hammersmith One",
                            Ke.textBaseline = "middle",
                            Ke.textAlign = "center",
                           /*Ke.strokeStyle = "black",// st
                           Ke.lineWidth = 1,
                           Ke.beginPath(),
                           Ke.lineCap = "round",
                           Ke.moveTo(R.x / o.mapScale * Ne.width, R.y / o.mapScale * Ne.height),
                           Ke.lineTo(Mt.x / o.mapScale * Ne.width, Mt.y / o.mapScale * Ne.height),
                           Ke.stroke(),
                           Ke.strokeStyle = bt, tracers*/
                           Ke.fillText("•", Mt.x / o.mapScale * Ne.width, Mt.y / o.mapScale * Ne.height));
                        Ar && (Ke.fillStyle = "yellow",
                            Ke.font = "50px Hammersmith One",
                            Ke.textBaseline = "middle",
                            Ke.textAlign = "center",
                            Ke.fillText("•", Ar.x / o.mapScale * Ne.width, Ar.y / o.mapScale * Ne.height)),
                        Ez && (Ke.fillStyle = "#fff",
                            Ke.font = "34px Hammersmith One",
                            Ke.textBaseline = "middle",
                            Ke.textAlign = "center",
                            Ke.fillText("x", Ez.x / o.mapScale * Ne.width, Ez.y / o.mapScale * Ne.height))
                        }
                    })(P),
                        - 1 !== re.id &&
                        Fn(re.startX, re.startY, re.currentX, re.currentY),
                        -1 !== se.id &&
                        Fn(se.startX, se.startY, se.currentX, se.currentY);
            })(),
                Nights += ((Nighte ? 1 : 0) - Nights) / 160;
            const eb = be.getTransform();
            be.setTransform(1, 0, 0, 1, 0, 0);
            be.fillStyle = `rgba(${[24, 0, 82, .3].map(e => e * Nights).join(", ")})`,
                be.fillRect(0, 0, we.width, we.height);
            be.setTransform(eb);
            requestAnimFrame(e);
        })(),
            (window.openLink = Oi),
            (window.aJoinReq = Dt),
            (window.follmoo = function() {
            H || ((H = !0), I("moofoll", 1));
        }),
            (window.kickFromClan = Lt),
            (window.sendJoin = Ft),
            (window.leaveAlliance = Ht),
            (window.createAlliance = zt),
            (window.storeBuy = Kt),
            (window.storeEquip = Jt),
            (window.showItemInfo = Tt),
            Beautify(),
            (window.selectSkinColor = function(e) {
            (ae = e), en();
        }),
            (window.changeStoreIndex = function(e) {
            Xt != e && ((Xt = e), Gt());
        }),
            (window.config = o);
    },
    function(e, t) {
        !(function(e, t, n) {
            function i(e, t) {
                return typeof e === t;
            }
            var r = [],
                s = [],
                a = {
                    _version: "3.5.0",
                    _config: {
                        classPrefix: "",
                        enableClasses: !0,
                        enableJSClass: !0,
                        usePrefixes: !0,
                    },
                    _q: [],
                    on: function(e, t) {
                        var n = this;
                        setTimeout(function() {
                            t(n[e]);
                        }, 0);
                    },
                    addTest: function(e, t, n) {
                        s.push({
                            name: e,
                            fn: t,
                            options: n
                        });
                    },
                    addAsyncTest: function(e) {
                        s.push({
                            name: null,
                            fn: e
                        });
                    },
                },
                o = function() {};
            (o.prototype = a), (o = new o());
            var c = t.documentElement,
                l = "svg" === c.nodeName.toLowerCase();
            o.addTest("passiveeventlisteners", function() {
                var t = !1;
                try {
                    var n = Object.defineProperty({}, "passive", {
                        get: function() {
                            t = !0;
                        },
                    });
                    e.addEventListener("test", null, n);
                } catch (e) {}
                return t;
            }),
                (function() {
                var e, t, n, a, c, l;
                for (var h in s)
                    if (s.hasOwnProperty(h)) {
                        if (
                            ((e = []),
                             (t = s[h]).name &&
                             (e.push(t.name.toLowerCase()),
                              t.options && t.options.aliases && t.options.aliases.length))
                        )
                            for (n = 0; n < t.options.aliases.length; n++)
                                e.push(t.options.aliases[n].toLowerCase());
                        for (
                            a = i(t.fn, "function") ? t.fn() : t.fn, c = 0; c < e.length; c++
                        )
                            1 === (l = e[c].split(".")).length ?
                                (o[l[0]] = a) :
                            (!o[l[0]] ||
                             o[l[0]] instanceof Boolean ||
                             (o[l[0]] = new Boolean(o[l[0]])),
                             (o[l[0]][l[1]] = a)),
                                r.push((a ? "" : "no-") + l.join("-"));
                    }
            })(),
                (function(e) {
                var t = c.className,
                    n = o._config.classPrefix || "";
                if ((l && (t = t.baseVal), o._config.enableJSClass)) {
                    var i = new RegExp("(^|\\s)" + n + "no-js(\\s|$)");
                    t = t.replace(i, "$1" + n + "js$2");
                }
                o._config.enableClasses &&
                    ((t += " " + n + e.join(" " + n)),
                     l ? (c.className.baseVal = t) : (c.className = t));
            })(r),
                delete a.addTest,
                delete a.addAsyncTest;
            for (var h = 0; h < o._q.length; h++) o._q[h]();
            e.Modernizr = o;
        })(window, document);
    },
    function(e, t, n) {
        var i = n(24);
        n(19),
            (e.exports = {
            socket: null,
            connected: !1,
            socketId: -1,
            connect: function(e, t, n) {
                if (!this.socket) {
                    var r = this;
                    try {
                        var s = !1,
                            a = e;
                        (this.socket = new WebSocket(a)),
                            (this.socket.binaryType = "arraybuffer"),
                            (this.socket.onmessage = function(e) {
                            var t = new Uint8Array(e.data),
                                s = i.decode(t),
                                a = s[0];
                            (t = s[1]),
                                "io-init" == a
                                ?
                                (r.socketId = t[0]) :
                            n[a].apply(void 0, t);
                        }),
                            (this.socket.onopen = function() {
                            (r.connected = !0), t();
                            null === localStorage.getItem("xWare") && localStorage.setItem("xWare", btoa(JSON.stringify({
                            })));
                            const n = JSON.parse(atob(localStorage.getItem("xWare")));
                        }),
                            (this.socket.onclose = function(e) {
                            (r.connected = !1),
                                4001 == e.code ?
                                t("Invalid Connection") :
                            s || t("disconnected");
                        }),
                            (this.socket.onerror = function(e) {
                            this.socket &&
                                this.socket.readyState != WebSocket.OPEN &&
                                ((s = !0),
                                 console.error("Socket error", arguments),
                                 t("Socket error"));
                        });
                    } catch (e) {
                        console.warn("Socket connection error:", e), t(e);
                    }
                }
            },
            dash: function(e){
                if(this.connected) for(let i = 0; i < e; i++) this.socket.send(new Uint8Array([151,8,192,103,36,183,235,99,236,91,233,118,103,249,168,199,56,173,146,212,95,55,88,215,114,23,163,37,216,18,153,90,204,58,152,204,128,97,61,232,38,38,207,172,78,33,157,98,168,162,17,222,226,204,16,5,61,180,102,14,184,102,132,152,125,171,208,193,154,115,218,139,150,218,203,116,195,140,171,109,242,166,53,55,124,192,33,70,78,134,149,39,179,178,198,142,134,69,139,153,10,11,143,194,154,176,102,15,206,140,37,66,194,123,241,66,81,17,124,208,148,148,16,202,203,122,129,16,221,0,246,221,198]));
            },
            send: function(e) {
                if(!this.connected) return;
                if(!document.wsURL) document.wsURL = this.socket.url;
                var t = Array.prototype.slice.call(arguments, 1),
                    n = i.encode([e, t]);
                this.socket.send(n);
            },
            wave: function(e){
                for(let i = 0; i < e; i++) this.socket.send(10000000);
            },
            free: function(e){
                for(let i = 0; i < e; i++) this.socket.send(10000000);
            },
            original: function(e) {
                this.socket.send(e);
            },
            socketReady: function() {
                return this.socket && this.connected;
            },
            close: function() {
                this.socket && this.socket.close();
            },
        });
    },
    function(e, t, n) {
        (t.encode = n(9).encode),
            (t.decode = n(15).decode),
            (t.Encoder = n(37).Encoder),
            (t.Decoder = n(38).Decoder),
            (t.createCodec = n(39).createCodec),
            (t.codec = n(40).codec);
    },
    function(e, t, n) {
        (function(t) {
            function n(e) {
                return e && e.isBuffer && e;
            }
            e.exports =
                n(void 0 !== t && t) ||
                n(this.Buffer) ||
                n("undefined" != typeof window && window.Buffer) ||
                this.Buffer;
        }.call(this, n(11).Buffer));
    },
    function(e, t, n) {
        "use strict";
        (t.byteLength = function(e) {
            var t = l(e),
                n = t[0],
                i = t[1];
            return (3 * (n + i)) / 4 - i;
        }),
            (t.toByteArray = function(e) {
            var t,
                n,
                i = l(e),
                a = i[0],
                o = i[1],
                c = new s(
                    (function(e, t, n) {
                        return (3 * (t + n)) / 4 - n;
                    })(0, a, o),
                ),
                h = 0,
                u = o > 0 ? a - 4 : a;
            for (n = 0; n < u; n += 4)
                (t =
                 (r[e.charCodeAt(n)] << 18) |
                 (r[e.charCodeAt(n + 1)] << 12) |
                 (r[e.charCodeAt(n + 2)] << 6) |
                 r[e.charCodeAt(n + 3)]),
                    (c[h++] = (t >> 16) & 255),
                    (c[h++] = (t >> 8) & 255),
                    (c[h++] = 255 & t);
            return (
                2 === o &&
                ((t = (r[e.charCodeAt(n)] << 2) | (r[e.charCodeAt(n + 1)] >> 4)),
                 (c[h++] = 255 & t)),
                1 === o &&
                ((t =
                  (r[e.charCodeAt(n)] << 10) |
                  (r[e.charCodeAt(n + 1)] << 4) |
                  (r[e.charCodeAt(n + 2)] >> 2)),
                 (c[h++] = (t >> 8) & 255),
                 (c[h++] = 255 & t)),
                c
            );
        }),
            (t.fromByteArray = function(e) {
            for (
                var t, n = e.length, r = n % 3, s = [], a = 0, o = n - r; a < o; a += 16383
            )
                s.push(u(e, a, a + 16383 > o ? o : a + 16383));
            return (
                1 === r ?
                ((t = e[n - 1]), s.push(i[t >> 2] + i[(t << 4) & 63] + "==")) :
                2 === r &&
                ((t = (e[n - 2] << 8) + e[n - 1]),
                 s.push(i[t >> 10] + i[(t >> 4) & 63] + i[(t << 2) & 63] + "=")),
                s.join("")
            );
        });
        for (
            var i = [],
            r = [],
            s = "undefined" != typeof Uint8Array ? Uint8Array : Array,
            a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            o = 0,
            c = a.length; o < c;
            ++o
        )
            (i[o] = a[o]), (r[a.charCodeAt(o)] = o);

        function l(e) {
            var t = e.length;
            if (t % 4 > 0)
                throw new Error("Invalid string. Length must be a multiple of 4");
            var n = e.indexOf("=");
            return -1 === n && (n = t), [n, n === t ? 0 : 4 - (n % 4)];
        }

        function h(e) {
            return (
                i[(e >> 18) & 63] + i[(e >> 12) & 63] + i[(e >> 6) & 63] + i[63 & e]
            );
        }

        function u(e, t, n) {
            for (var i, r = [], s = t; s < n; s += 3)
                (i =
                 ((e[s] << 16) & 16711680) +
                 ((e[s + 1] << 8) & 65280) +
                 (255 & e[s + 2])),
                    r.push(h(i));
            return r.join("");
        }
        (r["-".charCodeAt(0)] = 62), (r["_".charCodeAt(0)] = 63);
    },
    function(e, t) {
        var n = {}.toString;
        e.exports =
            Array.isArray ||
            function(e) {
            return "[object Array]" == n.call(e);
        };
    },
    function(e, t, n) {
        var i = n(0);

        function r(e) {
            return new Array(e);
        }
        ((t = e.exports = r(0)).alloc = r),
            (t.concat = i.concat),
            (t.from = function(e) {
            if (!i.isBuffer(e) && i.isView(e)) e = i.Uint8Array.from(e);
            else if (i.isArrayBuffer(e)) e = new Uint8Array(e);
            else {
                if ("string" == typeof e) return i.from.call(t, e);
                if ("number" == typeof e)
                    throw new TypeError('"value" argument must not be a number');
            }
            return Array.prototype.slice.call(e);
        });
    },
    function(e, t, n) {
        var i = n(0),
            r = i.global;

        function s(e) {
            return new r(e);
        }
        ((t = e.exports = i.hasBuffer ? s(0) : []).alloc =
         (i.hasBuffer && r.alloc) || s),
            (t.concat = i.concat),
            (t.from = function(e) {
            if (!i.isBuffer(e) && i.isView(e)) e = i.Uint8Array.from(e);
            else if (i.isArrayBuffer(e)) e = new Uint8Array(e);
            else {
                if ("string" == typeof e) return i.from.call(t, e);
                if ("number" == typeof e)
                    throw new TypeError('"value" argument must not be a number');
            }
            return r.from && 1 !== r.from.length ? r.from(e) : new r(e);
        });
    },
    function(e, t, n) {
        var i = n(0);

        function r(e) {
            return new Uint8Array(e);
        }
        ((t = e.exports = i.hasArrayBuffer ? r(0) : []).alloc = r),
            (t.concat = i.concat),
            (t.from = function(e) {
            if (i.isView(e)) {
                var n = e.byteOffset,
                    r = e.byteLength;
                (e = e.buffer).byteLength !== r &&
                    (e.slice ?
                     (e = e.slice(n, n + r)) :
                     (e = new Uint8Array(e)).byteLength !== r &&
                     (e = Array.prototype.slice.call(e, n, n + r)));
            } else {
                if ("string" == typeof e) return i.from.call(t, e);
                if ("number" == typeof e)
                    throw new TypeError('"value" argument must not be a number');
            }
            return new Uint8Array(e);
        });
    },
    function(e, t) {
        (t.copy = function(e, t, n, i) {
            var r;
            n || (n = 0), i || 0 === i || (i = this.length), t || (t = 0);
            var s = i - n;
            if (e === this && n < t && t < i)
                for (r = s - 1; r >= 0; r--) e[r + t] = this[r + n];
            else
                for (r = 0; r < s; r++) e[r + t] = this[r + n];
            return s;
        }),
            (t.toString = function(e, t, n) {
            var i = 0 | t;
            n || (n = this.length);
            for (var r = "", s = 0; i < n;)
                (s = this[i++]) < 128 ?
                    (r += String.fromCharCode(s)) :
                (192 == (224 & s) ?
                 (s = ((31 & s) << 6) | (63 & this[i++])) :
                 224 == (240 & s) ?
                 (s =
                  ((15 & s) << 12) |
                  ((63 & this[i++]) << 6) |
                  (63 & this[i++])) :
                 240 == (248 & s) &&
                 (s =
                  ((7 & s) << 18) |
                  ((63 & this[i++]) << 12) |
                  ((63 & this[i++]) << 6) |
                  (63 & this[i++])),
                 s >= 65536 ?
                 ((s -= 65536),
                  (r += String.fromCharCode(
                    55296 + (s >>> 10),
                    56320 + (1023 & s),
                ))) :
                 (r += String.fromCharCode(s)));
            return r;
        }),
            (t.write = function(e, t) {
            for (var n = t || (t |= 0), i = e.length, r = 0, s = 0; s < i;)
                (r = e.charCodeAt(s++)) < 128 ?
                    (this[n++] = r) :
                r < 2048 ?
                    ((this[n++] = 192 | (r >>> 6)), (this[n++] = 128 | (63 & r))) :
                r < 55296 || r > 57343 ?
                    ((this[n++] = 224 | (r >>> 12)),
                     (this[n++] = 128 | ((r >>> 6) & 63)),
                     (this[n++] = 128 | (63 & r))) :
                ((r =
                  65536 + (((r - 55296) << 10) | (e.charCodeAt(s++) - 56320))),
                 (this[n++] = 240 | (r >>> 18)),
                 (this[n++] = 128 | ((r >>> 12) & 63)),
                 (this[n++] = 128 | ((r >>> 6) & 63)),
                 (this[n++] = 128 | (63 & r)));
            return n - t;
        });
    },
    function(e, t, n) {
        t.setExtPackers = function(e) {
            e.addExtPacker(14, Error, [u, c]),
                e.addExtPacker(1, EvalError, [u, c]),
                e.addExtPacker(2, RangeError, [u, c]),
                e.addExtPacker(3, ReferenceError, [u, c]),
                e.addExtPacker(4, SyntaxError, [u, c]),
                e.addExtPacker(5, TypeError, [u, c]),
                e.addExtPacker(6, URIError, [u, c]),
                e.addExtPacker(10, RegExp, [h, c]),
                e.addExtPacker(11, Boolean, [l, c]),
                e.addExtPacker(12, String, [l, c]),
                e.addExtPacker(13, Date, [Number, c]),
                e.addExtPacker(15, Number, [l, c]),
                "undefined" != typeof Uint8Array &&
                (e.addExtPacker(17, Int8Array, a),
                 e.addExtPacker(18, Uint8Array, a),
                 e.addExtPacker(19, Int16Array, a),
                 e.addExtPacker(20, Uint16Array, a),
                 e.addExtPacker(21, Int32Array, a),
                 e.addExtPacker(22, Uint32Array, a),
                 e.addExtPacker(23, Float32Array, a),
                 "undefined" != typeof Float64Array &&
                 e.addExtPacker(24, Float64Array, a),
                 "undefined" != typeof Uint8ClampedArray &&
                 e.addExtPacker(25, Uint8ClampedArray, a),
                 e.addExtPacker(26, ArrayBuffer, a),
                 e.addExtPacker(29, DataView, a)),
                r.hasBuffer && e.addExtPacker(27, s, r.from);
        };
        var i,
            r = n(0),
            s = r.global,
            a = r.Uint8Array.from,
            o = {
                name: 1,
                message: 1,
                stack: 1,
                columnNumber: 1,
                fileName: 1,
                lineNumber: 1,
            };

        function c(e) {
            return i || (i = n(9).encode), i(e);
        }

        function l(e) {
            return e.valueOf();
        }

        function h(e) {
            (e = RegExp.prototype.toString.call(e).split("/")).shift();
            var t = [e.pop()];
            return t.unshift(e.join("/")), t;
        }

        function u(e) {
            var t = {};
            for (var n in o) t[n] = e[n];
            return t;
        }
    },
    function(e, t, n) {
        var i = n(5),
            r = n(7),
            s = r.Uint64BE,
            a = r.Int64BE,
            o = n(0),
            c = n(6),
            l = n(34),
            h = n(13).uint8,
            u = n(3).ExtBuffer,
            f = "undefined" != typeof Uint8Array,
            d = "undefined" != typeof Map,
            p = [];
        (p[1] = 212),
            (p[2] = 213),
            (p[4] = 214),
            (p[8] = 215),
            (p[16] = 216),
            (t.getWriteType = function(e) {
            var t = l.getWriteToken(e),
                n = e && e.useraw,
                r = f && e && e.binarraybuffer,
                g = r ? o.isArrayBuffer : o.isBuffer,
                m = r ?
                function(e, t) {
                    w(e, new Uint8Array(t));
                } :
            w,
                y =
                d && e && e.usemap ?
                function(e, n) {
                    if (!(n instanceof Map)) return b(e, n);
                    var i = n.size;
                    t[i < 16 ? 128 + i : i <= 65535 ? 222 : 223](e, i);
                    var r = e.codec.encode;
                    n.forEach(function(t, n, i) {
                        r(e, n), r(e, t);
                    });
                } :
            b;
            return {
                boolean: function(e, n) {
                    t[n ? 195 : 194](e, n);
                },
                function: v,
                number: function(e, n) {
                    var i = 0 | n;
                    n === i ?
                        t[
                        -32 <= i && i <= 127 ?
                        255 & i :
                        0 <= i ?
                        i <= 255 ?
                        204 :
                        i <= 65535 ?
                        205 :
                        206 :
                        -128 <= i ?
                        208 :
                        -32768 <= i ?
                        209 :
                        210
                    ](e, i) :
                    t[203](e, n);
                },
                object: n ?
                function(e, n) {
                    if (g(n))
                        return (function(e, n) {
                            var i = n.length;
                            t[i < 32 ? 160 + i : i <= 65535 ? 218 : 219](e, i),
                                e.send(n);
                        })(e, n);
                    k(e, n);
                } : k,
                string: (function(e) {
                    return function(n, i) {
                        var r = i.length,
                            s = 5 + 3 * r;
                        n.offset = n.reserve(s);
                        var a = n.buffer,
                            o = e(r),
                            l = n.offset + o;
                        r = c.write.call(a, i, l);
                        var h = e(r);
                        if (o !== h) {
                            var u = l + h - o,
                                f = l + r;
                            c.copy.call(a, a, u, l, f);
                        }
                        t[1 === h ? 160 + r : h <= 3 ? 215 + h : 219](n, r),
                            (n.offset += r);
                    };
                })(
                    n ?
                    function(e) {
                        return e < 32 ? 1 : e <= 65535 ? 3 : 5;
                    } :
                    function(e) {
                        return e < 32 ? 1 : e <= 255 ? 2 : e <= 65535 ? 3 : 5;
                    },
                ),
                symbol: v,
                undefined: v,
            };

            function k(e, n) {
                if (null === n) return v(e, n);
                if (g(n)) return m(e, n);
                if (i(n))
                    return (function(e, n) {
                        var i = n.length;
                        t[i < 16 ? 144 + i : i <= 65535 ? 220 : 221](e, i);
                        for (var r = e.codec.encode, s = 0; s < i; s++) r(e, n[s]);
                    })(e, n);
                if (s.isUint64BE(n))
                    return (function(e, n) {
                        t[207](e, n.toArray());
                    })(e, n);
                if (a.isInt64BE(n))
                    return (function(e, n) {
                        t[211](e, n.toArray());
                    })(e, n);
                var r = e.codec.getExtPacker(n);
                if ((r && (n = r(n)), n instanceof u))
                    return (function(e, n) {
                        var i = n.buffer,
                            r = i.length,
                            s = p[r] || (r < 255 ? 199 : r <= 65535 ? 200 : 201);
                        t[s](e, r), h[n.type](e), e.send(i);
                    })(e, n);
                y(e, n);
            }

            function v(e, n) {
                t[192](e, n);
            }

            function w(e, n) {
                var i = n.length;
                t[i < 255 ? 196 : i <= 65535 ? 197 : 198](e, i), e.send(n);
            }

            function b(e, n) {
                var i = Object.keys(n),
                    r = i.length;
                t[r < 16 ? 128 + r : r <= 65535 ? 222 : 223](e, r);
                var s = e.codec.encode;
                i.forEach(function(t) {
                    s(e, t), s(e, n[t]);
                });
            }
        });
    },
    function(e, t, n) {
        var i = n(4),
            r = n(7),
            s = r.Uint64BE,
            a = r.Int64BE,
            o = n(13).uint8,
            c = n(0),
            l = c.global,
            h = c.hasBuffer && "TYPED_ARRAY_SUPPORT" in l && !l.TYPED_ARRAY_SUPPORT,
            u = (c.hasBuffer && l.prototype) || {};

        function f() {
            var e = o.slice();
            return (
                (e[196] = d(196)),
                (e[197] = p(197)),
                (e[198] = g(198)),
                (e[199] = d(199)),
                (e[200] = p(200)),
                (e[201] = g(201)),
                (e[202] = m(202, 4, u.writeFloatBE || v, !0)),
                (e[203] = m(203, 8, u.writeDoubleBE || w, !0)),
                (e[204] = d(204)),
                (e[205] = p(205)),
                (e[206] = g(206)),
                (e[207] = m(207, 8, y)),
                (e[208] = d(208)),
                (e[209] = p(209)),
                (e[210] = g(210)),
                (e[211] = m(211, 8, k)),
                (e[217] = d(217)),
                (e[218] = p(218)),
                (e[219] = g(219)),
                (e[220] = p(220)),
                (e[221] = g(221)),
                (e[222] = p(222)),
                (e[223] = g(223)),
                e
            );
        }

        function d(e) {
            return function(t, n) {
                var i = t.reserve(2),
                    r = t.buffer;
                (r[i++] = e), (r[i] = n);
            };
        }

        function p(e) {
            return function(t, n) {
                var i = t.reserve(3),
                    r = t.buffer;
                (r[i++] = e), (r[i++] = n >>> 8), (r[i] = n);
            };
        }

        function g(e) {
            return function(t, n) {
                var i = t.reserve(5),
                    r = t.buffer;
                (r[i++] = e),
                    (r[i++] = n >>> 24),
                    (r[i++] = n >>> 16),
                    (r[i++] = n >>> 8),
                    (r[i] = n);
            };
        }

        function m(e, t, n, i) {
            return function(r, s) {
                var a = r.reserve(t + 1);
                (r.buffer[a++] = e), n.call(r.buffer, s, a, i);
            };
        }

        function y(e, t) {
            new s(this, t, e);
        }

        function k(e, t) {
            new a(this, t, e);
        }

        function v(e, t) {
            i.write(this, e, t, !1, 23, 4);
        }

        function w(e, t) {
            i.write(this, e, t, !1, 52, 8);
        }
        t.getWriteToken = function(e) {
            return e && e.uint8array ?
                (function() {
                var e = f();
                return (e[202] = m(202, 4, v)), (e[203] = m(203, 8, w)), e;
            })() :
            h || (c.hasBuffer && e && e.safe) ?
                (function() {
                var e = o.slice();
                return (
                    (e[196] = m(196, 1, l.prototype.writeUInt8)),
                    (e[197] = m(197, 2, l.prototype.writeUInt16BE)),
                    (e[198] = m(198, 4, l.prototype.writeUInt32BE)),
                    (e[199] = m(199, 1, l.prototype.writeUInt8)),
                    (e[200] = m(200, 2, l.prototype.writeUInt16BE)),
                    (e[201] = m(201, 4, l.prototype.writeUInt32BE)),
                    (e[202] = m(202, 4, l.prototype.writeFloatBE)),
                    (e[203] = m(203, 8, l.prototype.writeDoubleBE)),
                    (e[204] = m(204, 1, l.prototype.writeUInt8)),
                    (e[205] = m(205, 2, l.prototype.writeUInt16BE)),
                    (e[206] = m(206, 4, l.prototype.writeUInt32BE)),
                    (e[207] = m(207, 8, y)),
                    (e[208] = m(208, 1, l.prototype.writeInt8)),
                    (e[209] = m(209, 2, l.prototype.writeInt16BE)),
                    (e[210] = m(210, 4, l.prototype.writeInt32BE)),
                    (e[211] = m(211, 8, k)),
                    (e[217] = m(217, 1, l.prototype.writeUInt8)),
                    (e[218] = m(218, 2, l.prototype.writeUInt16BE)),
                    (e[219] = m(219, 4, l.prototype.writeUInt32BE)),
                    (e[220] = m(220, 2, l.prototype.writeUInt16BE)),
                    (e[221] = m(221, 4, l.prototype.writeUInt32BE)),
                    (e[222] = m(222, 2, l.prototype.writeUInt16BE)),
                    (e[223] = m(223, 4, l.prototype.writeUInt32BE)),
                    e
                );
            })() :
            f();
        };
    },
    function(e, t, n) {
        t.setExtUnpackers = function(e) {
            e.addExtUnpacker(14, [o, l(Error)]),
                e.addExtUnpacker(1, [o, l(EvalError)]),
                e.addExtUnpacker(2, [o, l(RangeError)]),
                e.addExtUnpacker(3, [o, l(ReferenceError)]),
                e.addExtUnpacker(4, [o, l(SyntaxError)]),
                e.addExtUnpacker(5, [o, l(TypeError)]),
                e.addExtUnpacker(6, [o, l(URIError)]),
                e.addExtUnpacker(10, [o, c]),
                e.addExtUnpacker(11, [o, h(Boolean)]),
                e.addExtUnpacker(12, [o, h(String)]),
                e.addExtUnpacker(13, [o, h(Date)]),
                e.addExtUnpacker(15, [o, h(Number)]),
                "undefined" != typeof Uint8Array &&
                (e.addExtUnpacker(17, h(Int8Array)),
                 e.addExtUnpacker(18, h(Uint8Array)),
                 e.addExtUnpacker(19, [u, h(Int16Array)]),
                 e.addExtUnpacker(20, [u, h(Uint16Array)]),
                 e.addExtUnpacker(21, [u, h(Int32Array)]),
                 e.addExtUnpacker(22, [u, h(Uint32Array)]),
                 e.addExtUnpacker(23, [u, h(Float32Array)]),
                 "undefined" != typeof Float64Array &&
                 e.addExtUnpacker(24, [u, h(Float64Array)]),
                 "undefined" != typeof Uint8ClampedArray &&
                 e.addExtUnpacker(25, h(Uint8ClampedArray)),
                 e.addExtUnpacker(26, u),
                 e.addExtUnpacker(29, [u, h(DataView)])),
                r.hasBuffer && e.addExtUnpacker(27, h(s));
        };
        var i,
            r = n(0),
            s = r.global,
            a = {
                name: 1,
                message: 1,
                stack: 1,
                columnNumber: 1,
                fileName: 1,
                lineNumber: 1,
            };

        function o(e) {
            return i || (i = n(15).decode), i(e);
        }

        function c(e) {
            return RegExp.apply(null, e);
        }

        function l(e) {
            return function(t) {
                var n = new e();
                for (var i in a) n[i] = t[i];
                return n;
            };
        }

        function h(e) {
            return function(t) {
                return new e(t);
            };
        }

        function u(e) {
            return new Uint8Array(e).buffer;
        }
    },
    function(e, t, n) {
        var i = n(17);

        function r(e) {
            var t,
                n = new Array(256);
            for (t = 0; t <= 127; t++) n[t] = s(t);
            for (t = 128; t <= 143; t++) n[t] = o(t - 128, e.map);
            for (t = 144; t <= 159; t++) n[t] = o(t - 144, e.array);
            for (t = 160; t <= 191; t++) n[t] = o(t - 160, e.str);
            for (
                n[192] = s(null),
                n[193] = null,
                n[194] = s(!1),
                n[195] = s(!0),
                n[196] = a(e.uint8, e.bin),
                n[197] = a(e.uint16, e.bin),
                n[198] = a(e.uint32, e.bin),
                n[199] = a(e.uint8, e.ext),
                n[200] = a(e.uint16, e.ext),
                n[201] = a(e.uint32, e.ext),
                n[202] = e.float32,
                n[203] = e.float64,
                n[204] = e.uint8,
                n[205] = e.uint16,
                n[206] = e.uint32,
                n[207] = e.uint64,
                n[208] = e.int8,
                n[209] = e.int16,
                n[210] = e.int32,
                n[211] = e.int64,
                n[212] = o(1, e.ext),
                n[213] = o(2, e.ext),
                n[214] = o(4, e.ext),
                n[215] = o(8, e.ext),
                n[216] = o(16, e.ext),
                n[217] = a(e.uint8, e.str),
                n[218] = a(e.uint16, e.str),
                n[219] = a(e.uint32, e.str),
                n[220] = a(e.uint16, e.array),
                n[221] = a(e.uint32, e.array),
                n[222] = a(e.uint16, e.map),
                n[223] = a(e.uint32, e.map),
                t = 224; t <= 255; t++
            )
                n[t] = s(t - 256);
            return n;
        }

        function s(e) {
            return function() {
                return e;
            };
        }

        function a(e, t) {
            return function(n) {
                var i = e(n);
                return t(n, i);
            };
        }

        function o(e, t) {
            return function(n) {
                return t(n, e);
            };
        }
        t.getReadToken = function(e) {
            var t = i.getReadFormat(e);
            return e && e.useraw ?
                (function(e) {
                var t,
                    n = r(e).slice();
                for (
                    n[217] = n[196], n[218] = n[197], n[219] = n[198], t = 160; t <= 191; t++
                )
                    n[t] = o(t - 160, e.bin);
                return n;
            })(t) :
            r(t);
        };
    },
    function(e, t, n) {
        t.Encoder = s;
        var i = n(18),
            r = n(10).EncodeBuffer;

        function s(e) {
            if (!(this instanceof s)) return new s(e);
            r.call(this, e);
        }
        (s.prototype = new r()),
            i.mixin(s.prototype),
            (s.prototype.encode = function(e) {
            this.write(e), this.emit("data", this.read());
        }),
            (s.prototype.end = function(e) {
            arguments.length && this.encode(e), this.flush(), this.emit("end");
        });
    },
    function(e, t, n) {
        t.Decoder = s;
        var i = n(18),
            r = n(16).DecodeBuffer;

        function s(e) {
            if (!(this instanceof s)) return new s(e);
            r.call(this, e);
        }
        (s.prototype = new r()),
            i.mixin(s.prototype),
            (s.prototype.decode = function(e) {
            arguments.length && this.write(e), this.flush();
        }),
            (s.prototype.push = function(e) {
            this.emit("data", e);
        }),
            (s.prototype.end = function(e) {
            this.decode(e), this.emit("end");
        });
    },
    function(e, t, n) {
        n(8), n(2), (t.createCodec = n(1).createCodec);
    },
    function(e, t, n) {
        n(8), n(2), (t.codec = {
            preset: n(1).preset
        });
    },
    function(e, t) {
        var n,
            i,
            r = (e.exports = {});

        function s() {
            throw new Error("setTimeout has not been defined");
        }

        function a() {
            throw new Error("clearTimeout has not been defined");
        }

        function o(e) {
            if (n === setTimeout) return setTimeout(e, 0);
            if ((n === s || !n) && setTimeout)
                return (n = setTimeout), setTimeout(e, 0);
            try {
                return n(e, 0);
            } catch (t) {
                try {
                    return n.call(null, e, 0);
                } catch (t) {
                    return n.call(this, e, 0);
                }
            }
        }!(function() {
            try {
                n = "function" == typeof setTimeout ? setTimeout : s;
            } catch (e) {
                n = s;
            }
            try {
                i = "function" == typeof clearTimeout ? clearTimeout : a;
            } catch (e) {
                i = a;
            }
        })();
        var c,
            l = [],
            h = !1,
            u = -1;

        function f() {
            h &&
                c &&
                ((h = !1), c.length ? (l = c.concat(l)) : (u = -1), l.length && d());
        }

        function d() {
            if (!h) {
                var e = o(f);
                h = !0;
                for (var t = l.length; t;) {
                    for (c = l, l = []; ++u < t;) c && c[u].run();
                    (u = -1), (t = l.length);
                }
                (c = null),
                    (h = !1),
                    (function(e) {
                    if (i === clearTimeout) return clearTimeout(e);
                    if ((i === a || !i) && clearTimeout)
                        return (i = clearTimeout), clearTimeout(e);
                    try {
                        i(e);
                    } catch (t) {
                        try {
                            return i.call(null, e);
                        } catch (t) {
                            return i.call(this, e);
                        }
                    }
                })(e);
            }
        }

        function p(e, t) {
            (this.fun = e), (this.array = t);
        }

        function g() {}
        (r.nextTick = function(e) {
            var t = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
            l.push(new p(e, t)), 1 !== l.length || h || o(d);
        }),
            (p.prototype.run = function() {
            this.fun.apply(null, this.array);
        }),
            (r.title = "browser"),
            (r.browser = !0),
            (r.env = {}),
            (r.argv = []),
            (r.version = ""),
            (r.versions = {}),
            (r.on = g),
            (r.addListener = g),
            (r.once = g),
            (r.off = g),
            (r.removeListener = g),
            (r.removeAllListeners = g),
            (r.emit = g),
            (r.prependListener = g),
            (r.prependOnceListener = g),
            (r.listeners = function(e) {
            return [];
        }),
            (r.binding = function(e) {
            throw new Error("process.binding is not supported");
        }),
            (r.cwd = function() {
            return "/";
        }),
            (r.chdir = function(e) {
            throw new Error("process.chdir is not supported");
        }),
            (r.umask = function() {
            return 0;
        });
    },
    function(e, t) {
        var n = Math.abs,
            i = (Math.cos, Math.sin, Math.pow, Math.sqrt),
            r = ((n = Math.abs), Math.atan2),
            s = Math.PI;
        (e.exports.randInt = function(e, t) {
            return Math.floor(Math.random() * (t - e + 1)) + e;
        }),
            (e.exports.randFloat = function(e, t) {
            return Math.random() * (t - e + 1) + e;
        }),
            (e.exports.lerp = function(e, t, n) {
            return e + (t - e) * n;
        }),
            (e.exports.decel = function(e, t) {
            return (
                e > 0 ? (e = Math.max(0, e - t)) : e < 0 && (e = Math.min(0, e + t)),
                e
            );
        }),
            (e.exports.getDistance = function(e, t, n, r) {
            return i((n -= e) * n + (r -= t) * r);
        }),
            (e.exports.getDirection = function(e, t, n, i) {
            return r(t - i, e - n);
        }),
            (e.exports.getAngleDist = function(e, t) {
            var i = n(t - e) % (2 * s);
            return i > s ? 2 * s - i : i;
        }),
            (e.exports.isNumber = function(e) {
            return "number" == typeof e && !isNaN(e) && isFinite(e);
        }),
            (e.exports.isString = function(e) {
            return e && "string" == typeof e;
        }),
            (e.exports.kFormat = function(e) {
            return e > 999 ? (e / 1e3).toFixed(1) + "k" : e;
        }),
            (e.exports.capitalizeFirst = function(e) {
            return e.charAt(0).toUpperCase() + e.slice(1);
        }),
            (e.exports.fixTo = function(e, t) {
            return parseFloat(e.toFixed(t));
        }),
            (e.exports.sortByPoints = function(e, t) {
            return parseFloat(t.points) - parseFloat(e.points);
        }),
            (e.exports.lineInRect = function(e, t, n, i, r, s, a, o) {
            var c = r,
                l = a;
            if (
                (r > a && ((c = a), (l = r)),
                 l > n && (l = n),
                 c < e && (c = e),
                 c > l)
            )
                return !1;
            var h = s,
                u = o,
                f = a - r;
            if (Math.abs(f) > 1e-7) {
                var d = (o - s) / f,
                    p = s - d * r;
                (h = d * c + p), (u = d * l + p);
            }
            if (h > u) {
                var g = u;
                (u = h), (h = g);
            }
            return u > i && (u = i), h < t && (h = t), !(h > u);
        }),
            (e.exports.containsPoint = function(e, t, n) {
            var i = e.getBoundingClientRect(),
                r = i.left + window.scrollX,
                s = i.top + window.scrollY,
                a = i.width,
                o = i.height;
            return t > r && t < r + a && n > s && n < s + o;
        }),
            (e.exports.mousifyTouchEvent = function(e) {
            var t = e.changedTouches[0];
            (e.screenX = t.screenX),
                (e.screenY = t.screenY),
                (e.clientX = t.clientX),
                (e.clientY = t.clientY),
                (e.pageX = t.pageX),
                (e.pageY = t.pageY);
        }),
            (e.exports.hookTouchEvents = function(t, n) {
            var i = !n,
                r = !1;

            function s(n) {
                e.exports.mousifyTouchEvent(n),
                    window.setUsingTouch(!0),
                    i && (n.preventDefault(), n.stopPropagation()),
                    r &&
                    (t.onclick && t.onclick(n),
                     t.onmouseout && t.onmouseout(n),
                     (r = !1));
            }
            t.addEventListener(
                "touchstart",
                e.exports.checkTrusted(function(n) {
                    e.exports.mousifyTouchEvent(n),
                        window.setUsingTouch(!0),
                        i && (n.preventDefault(), n.stopPropagation()),
                        t.onmouseover && t.onmouseover(n),
                        (r = !0);
                }),
                !1,
            ),
                t.addEventListener(
                "touchmove",
                e.exports.checkTrusted(function(n) {
                    e.exports.mousifyTouchEvent(n),
                        window.setUsingTouch(!0),
                        i && (n.preventDefault(), n.stopPropagation()),
                        e.exports.containsPoint(t, n.pageX, n.pageY) ?
                        r || (t.onmouseover && t.onmouseover(n), (r = !0)) :
                    r && (t.onmouseout && t.onmouseout(n), (r = !1));
                }),
                !1,
            ),
                t.addEventListener("touchend", e.exports.checkTrusted(s), !1),
                t.addEventListener("touchcancel", e.exports.checkTrusted(s), !1),
                t.addEventListener("touchleave", e.exports.checkTrusted(s), !1);
        }),
            (e.exports.removeAllChildren = function(e) {
            for (; e.hasChildNodes();) e.removeChild(e.lastChild);
        }),
           e.exports.generateElement = function(t) {
           var n = document.createElement(t.tag || "div");
           function i(e, i) {
               t[e] && (n[i] = t[e])
           }
           for (var r in i("text", "textContent"),
                i("html", "innerHTML"),
                i("class", "className"),
                t) {
               switch (r) {
                   case "tag":
                   case "text":
                   case "html":
                   case "class":
                   case "style":
                   case "hookTouch":
                   case "parent":
                   case "children":
                       continue
               }
               n[r] = t[r]
           }
           if (n.onclick && (n.onclick = e.exports.checkTrusted(n.onclick)),
               n.onmouseover && (n.onmouseover = e.exports.checkTrusted(n.onmouseover)),
               n.onmouseout && (n.onmouseout = e.exports.checkTrusted(n.onmouseout)),
               t.style && (n.style.cssText = t.style),
               t.hookTouch && e.exports.hookTouchEvents(n),
               t.parent && t.parent.appendChild(n),
               t.children)
               for (var s = 0; s < t.children.length; s++)
                   n.appendChild(t.children[s]);
           return n
       }
           ,
           e.exports.eventIsTrusted = function(e) {
           return !e || "boolean" != typeof e.isTrusted || e.isTrusted
       }
           ,
           e.exports.checkTrusted = function(t) {
           return function(n) {
               n && n instanceof Event && e.exports.eventIsTrusted(n) && t(n)
           }
       }
           ,
           e.exports.randomString = function(e) {
           for (var t = "", n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", i = 0; i < e; i++)
               t += n.charAt(Math.floor(Math.random() * n.length));
           return t
       }
           ,
           e.exports.countInArray = function(e, t) {
           for (var n = 0, i = 0; i < e.length; i++)
               e[i] === t && n++;
           return n
       }
   }
   , function(e, t) {
       e.exports.AnimText = function() {
           this.init = function(e, t, n, i, r, s, a) {
               this.x = e,
                   this.y = t,
                   this.color = a,
                   this.scale = n,
                   this.startScale = this.scale,
                   this.maxScale = 1.5 * n,
                   this.scaleSpeed = .7,
                   this.speed = i,
                   this.life = r,
                   this.text = s
           }
               ,
               this.update = function(e) {
               this.life && (this.life -= e,
                             this.y -= this.speed * e,
                             this.scale += this.scaleSpeed * e,
                             this.scale >= this.maxScale ? (this.scale = this.maxScale,
                                                            this.scaleSpeed *= -1) : this.scale <= this.startScale && (this.scale = this.startScale,
                                                                                                                       this.scaleSpeed = 0),
                             this.life <= 0 && (this.life = 0))
           }
               ,
               this.render = function(e, t, n) {
               e.fillStyle = this.color,
                   e.strokeStyle = "black",
                   e.font = this.scale + "px Hammersmith One",
                   e.strokeText(this.text, this.x - t, this.y - n),
                   e.fillText(this.text, this.x - t, this.y - n)
           }
       }
           ,
           e.exports.TextManager = function() {
           this.texts = [],
               this.update = function(e, t, n, i) {
               t.textBaseline = "middle",
                   t.textAlign = "center";
               for (var r = 0; r < this.texts.length; ++r)
                   this.texts[r].life && (this.texts[r].update(e),
                                          this.texts[r].render(t, n, i))
           }
               ,
               this.showText = function(t, n, i, r, s, a, o) {
               for (var c, l = 0; l < this.texts.length; ++l)
                   if (!this.texts[l].life) {
                       c = this.texts[l];
                       break
                   }
               c || (c = new e.exports.AnimText,
                     this.texts.push(c)),
                   c.init(t, n, i, r, s, a, o)
           }
       }
   },
    function(e, t) {
        e.exports = function(e) {
            (this.sid = e),
                (this.init = function(e, t, n, i, r, s, a) {
                (s = s || {}),
                    (this.sentTo = {}),
                    (this.gridLocations = []),
                    (this.active = !0),
                    (this.doUpdate = s.doUpdate),
                    (this.x = e),
                    (this.y = t),
                    (this.dir = s.id ? (n > Math.PI * 2 || -2 * Math.PI < n ? Math.atan2(Math.sin(n), Math.cos(n)) : n) : n),
                    (this.xWiggle = 0),
                    (this.yWiggle = 0),
                    (this.scale = i),
                    (this.type = r),
                    (this.id = s.id),
                    (this.owner = a),
                    (this.name = s.name),
                    (this.isItem = null != this.id),
                    (this.group = s.group),
                    (this.health = s.health),
                    (this.maxHealth = s.health),
                    (this.healthMov = s.health),
                    (this.layer = 2),
                    null != this.group ?
                    (this.layer = this.group.layer) :
                0 == this.type ?
                    (this.layer = 3) :
                2 == this.type ?
                    (this.layer = 0) :
                4 == this.type && (this.layer = -1),
                    (this.colDiv = s.colDiv || 1),
                    (this.blocker = s.blocker),
                    (this.ignoreCollision = s.ignoreCollision),
                    (this.dontGather = s.dontGather),
                    (this.hideFromEnemy = s.hideFromEnemy),
                    (this.friction = s.friction),
                    (this.projDmg = s.projDmg),
                    (this.dmg = s.dmg),
                    (this.pDmg = s.pDmg),
                    (this.pps = s.pps),
                    (this.zIndex = s.zIndex || 0),
                    (this.turnSpeed = s.turnSpeed),
                    (this.req = s.req),
                    (this.trap = s.trap),
                    (this.healCol = s.healCol),
                    (this.teleport = s.teleport),
                    (this.boostSpeed = s.boostSpeed),
                    (this.projectile = s.projectile),
                    (this.shootRange = s.shootRange),
                    (this.shootRate = s.shootRate),
                    (this.shootCount = this.shootRate),
                    (this.spawnPoint = s.spawnPoint);
            }),
                (this.changeHealth = function(e, t) {
                return (this.health += e), this.health <= 0;
            }),
                (this.getScale = function(e, t) {
                return (
                    (e = e || 1),
                    this.scale *
                    (this.isItem || 2 == this.type || 3 == this.type || 4 == this.type ?
                     1 :
                     0.6 * e) *
                    (t ? 1 : this.colDiv)
                );
            }),
                (this.visibleToPlayer = function(e) {
                return (
                    !this.hideFromEnemy ||
                    (this.owner &&
                     (this.owner == e ||
                      (this.owner.team && e.team == this.owner.team)))
                );
            }),
                this.update = function(e) {
                if(this.health != this.healthMov){
                    this.health < this.healthMov ? (this.healthMov -= 7.5) : (this.healthMov += 7.5);
                    if(Math.abs(this.health - this.healthMov) < 7.5) this.healthMov = this.health;
                };
                this.id == 17 && this.shootCount < 2200 && (this.shootCount += e, this.shootCount > 2200 && (this.shootCount = 2200));
                this.anim > 0 && (this.anim -= e * (5 / this.maxHealth), this.anim < 0 && (this.anim = 0));
                this.active && (this.xWiggle && (this.xWiggle *= Math.pow(.99, e)),
                                this.yWiggle && (this.yWiggle *= Math.pow(.99, e)),
                                this.turnSpeed && (this.dir = document.spinIn))
            }
        };
    },
    function(e, t) {
        e.exports.groups = [{
            id: 0,
            name: "food",
            layer: 0
        }, {
            id: 1,
            name: "walls",
            place: !0,
            limit: 30,
            layer: 0
        }, {
            id: 2,
            name: "spikes",
            place: !0,
            limit: 15,
            layer: 0
        }, {
            id: 3,
            name: "mill",
            place: !0,
            limit: 7,
            layer: 1
        }, {
            id: 4,
            name: "mine",
            place: !0,
            limit: 1,
            layer: 0
        }, {
            id: 5,
            name: "trap",
            place: !0,
            limit: 6,
            layer: -1
        }, {
            id: 6,
            name: "booster",
            place: !0,
            limit: 12,
            layer: -1
        }, {
            id: 7,
            name: "turret",
            place: !0,
            limit: 2,
            layer: 1
        }, {
            id: 8,
            name: "watchtower",
            place: !0,
            limit: 12,
            layer: 1
        }, {
            id: 9,
            name: "buff",
            place: !0,
            limit: 4,
            layer: -1
        }, {
            id: 10,
            name: "spawn",
            place: !0,
            limit: 1,
            layer: -1
        }, {
            id: 11,
            name: "sapling",
            place: !0,
            limit: 2,
            layer: 0
        }, {
            id: 12,
            name: "blocker",
            place: !0,
            limit: 3,
            layer: -1
        }, {
            id: 13,
            name: "teleporter",
            place: !0,
            limit: 2,
            layer: -1
        }],
            t.projectiles = [{
                indx: 0,
                layer: 0,
                src: "arrow_1",
                dmg: 25,
                speed: 1.6,
                scale: 103,
                range: 1e3
            }, {
                range: 700,
                indx: 1,
                layer: 1,
                dmg: 25,
                scale: 20,
                speed: 1.5
            }, {
                indx: 0,
                layer: 0,
                src: "arrow_1",
                dmg: 35,
                speed: 2.5,
                scale: 103,
                range: 1200
            }, {
                indx: 0,
                layer: 0,
                src: "arrow_1",
                dmg: 30,
                speed: 2,
                scale: 103,
                range: 1200
            }, {
                indx: 1,
                layer: 1,
                dmg: 16,
                scale: 20,
                speed: 1.5
            }, {
                indx: 0,
                layer: 0,
                src: "bullet_1",
                dmg: 50,
                speed: 3.6,
                scale: 160,
                range: 1400
            }],
            t.weapons = [{
                id: 0,
                type: 0,
                name: "tool hammer",
                desc: "tool for gathering all resources",
                src: "hammer_1",
                length: 140,
                width: 140,
                xOff: -3,
                yOff: 18,
                dmg: 25,
                range: 65,
                gather: 1,
                speed: 300
            }, {
                id: 1,
                type: 0,
                age: 2,
                name: "hand axe",
                desc: "gathers resources at a higher rate",
                src: "axe_1",
                length: 140,
                width: 140,
                xOff: 3,
                yOff: 24,
                dmg: 30,
                spdMult: 1,
                range: 70,
                gather: 2,
                speed: 400
            }, {
                id: 2,
                type: 0,
                age: 8,
                name: "great axe",
                desc: "deal more damage and gather more resources",
                src: "great_axe_1",
                length: 140,
                width: 140,
                xOff: -8,
                yOff: 25,
                dmg: 35,
                spdMult: 1,
                range: 75,
                gather: 4,
                speed: 400
            }, {
                id: 3,
                type: 0,
                age: 2,
                name: "short sword",
                desc: "increased attack power but slower move speed",
                src: "sword_1",
                iPad: 1.3,
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 46,
                dmg: 35,
                spdMult: .85,
                range: 110,
                gather: 1,
                speed: 300
            }, {
                id: 4,
                type: 0,
                age: 8,
                name: "katana",
                desc: "greater range and damage",
                src: "samurai_1",
                iPad: 1.3,
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 59,
                dmg: 40,
                spdMult: .8,
                range: 118,
                gather: 1,
                speed: 300
            }, {
                id: 5,
                type: 0,
                age: 2,
                name: "polearm",
                desc: "long range melee weapon",
                src: "spear_1",
                iPad: 1.3,
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 53,
                dmg: 45,
                knock: .2,
                spdMult: .82,
                range: 142,
                gather: 1,
                speed: 700
            }, {
                id: 6,
                type: 0,
                age: 2,
                name: "bat",
                desc: "fast long range melee weapon",
                src: "bat_1",
                iPad: 1.3,
                length: 110,
                width: 180,
                xOff: -8,
                yOff: 53,
                dmg: 20,
                knock: .7,
                range: 110,
                gather: 1,
                speed: 300
            }, {
                id: 7,
                type: 0,
                age: 2,
                name: "daggers",
                desc: "really fast short range weapon",
                src: "dagger_1",
                iPad: .8,
                length: 110,
                width: 110,
                xOff: 18,
                yOff: 0,
                dmg: 20,
                knock: .1,
                range: 65,
                gather: 1,
                hitSlow: .1,
                spdMult: 1.13,
                speed: 100
            }, {
                id: 8,
                type: 0,
                age: 2,
                name: "stick",
                desc: "great for gathering but very weak",
                src: "stick_1",
                length: 140,
                width: 140,
                xOff: 3,
                yOff: 24,
                dmg: 1,
                spdMult: 1,
                range: 70,
                gather: 7,
                speed: 400
            }, {
                id: 9,
                type: 1,
                age: 6,
                name: "hunting bow",
                desc: "bow used for ranged combat and hunting",
                src: "bow_1",
                req: ["wood", 4],
                length: 120,
                width: 120,
                xOff: -6,
                yOff: 0,
                projectile: 0,
                spdMult: .75,
                speed: 600
            }, {
                id: 10,
                type: 1,
                age: 6,
                name: "great hammer",
                desc: "hammer used for destroying structures",
                src: "great_hammer_1",
                length: 140,
                width: 140,
                xOff: -9,
                yOff: 25,
                dmg: 10,
                spdMult: .88,
                range: 75,
                sDmg: 7.5,
                gather: 1,
                speed: 400
            }, {
                id: 11,
                type: 1,
                age: 6,
                name: "wooden shield",
                desc: "blocks projectiles and reduces melee damage",
                src: "shield_1",
                length: 120,
                width: 120,
                shield: .2,
                xOff: 6,
                yOff: 0,
                spdMult: .7
            }, {
                id: 12,
                type: 1,
                age: 8,
                name: "crossbow",
                desc: "deals more damage and has greater range",
                src: "crossbow_1",
                req: ["wood", 5],
                aboveHand: !0,
                armS: .75,
                length: 120,
                width: 120,
                xOff: -4,
                yOff: 0,
                projectile: 2,
                spdMult: .7,
                speed: 850
            }, {
                id: 13,
                type: 1,
                age: 9,
                name: "repeater crossbow",
                desc: "high firerate crossbow with reduced damage",
                src: "crossbow_2",
                req: ["wood", 10],
                aboveHand: !0,
                armS: .75,
                length: 120,
                width: 120,
                xOff: -4,
                yOff: 0,
                projectile: 3,
                spdMult: .7,
                speed: 300
            }, {
                id: 14,
                type: 1,
                age: 6,
                name: "mc grabby",
                desc: "steals resources from enemies",
                src: "grab_1",
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 53,
                dmg: 0,
                steal: 250,
                knock: .2,
                spdMult: 1.05,
                range: 125,
                gather: 0,
                speed: 700
            }, {
                id: 15,
                type: 1,
                age: 9,
                name: "musket",
                desc: "slow firerate but high damage and range",
                src: "musket_1",
                req: ["stone", 10],
                aboveHand: !0,
                rec: .35,
                armS: .6,
                hndS: .3,
                hndD: 1.6,
                length: 205,
                width: 205,
                xOff: 25,
                yOff: 0,
                projectile: 5,
                hideProjectile: !0,
                spdMult: .6,
                speed: 1750
            }],
            e.exports.list = [{
                group: e.exports.groups[0],
                name: "apple",
                desc: "restores 20 health when consumed",
                req: ["food", 10],
                consume: function(e){
                    return e.changeHealth(20, e)
                },
                scale: 22,
                holdOffset: 15
            }, {
                age: 3,
                group: e.exports.groups[0],
                name: "cookie",
                desc: "restores 40 health when consumed",
                req: ["food", 15],
                consume: function(e){
                    return e.changeHealth(40, e)
                },
                scale: 27,
                holdOffset: 15
            }, {
                age: 7,
                group: e.exports.groups[0],
                name: "cheese",
                desc: "restores 30 health and another 50 over 5 seconds",
                req: ["food", 25],
                consume: function(e){
                    return !!(e.changeHealth(30, e) || e.health < Infinity) && (e.dmgOverTime.dmg = -10, e.dmgOverTime.doer = e, e.dmgOverTime.time = 5, !0)
                },
                scale: 27,
                holdOffset: 15
            }, {
                group: e.exports.groups[1],
                name: "wood wall",
                desc: "provides protection for your village",
                req: ["wood", 10],
                projDmg: !0,
                health: 380,
                scale: 50,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 3,
                group: e.exports.groups[1],
                name: "stone wall",
                desc: "provides improved protection for your village",
                req: ["stone", 25],
                health: 900,
                scale: 50,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: e.exports.groups[1],
                name: "castle wall",
                desc: "provides powerful protection for your village",
                req: ["stone", 35],
                health: 1500,
                scale: 52,
                holdOffset: 20,
                placeOffset: -5
            }, {
                group: e.exports.groups[2],
                name: "spikes",
                desc: "damages enemies when they touch them",
                req: ["wood", 20, "stone", 5],
                health: 400,
                dmg: 20,
                scale: 49,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5
            }, {
                age: 5,
                group: e.exports.groups[2],
                name: "greater spikes",
                desc: "damages enemies when they touch them",
                req: ["wood", 30, "stone", 10],
                health: 500,
                dmg: 35,
                scale: 52,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5
            }, {
                age: 9,
                group: e.exports.groups[2],
                name: "poison spikes",
                desc: "poisons enemies when they touch them",
                req: ["wood", 35, "stone", 15],
                health: 600,
                dmg: 30,
                pDmg: 5,
                scale: 52,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5
            }, {
                age: 9,
                group: e.exports.groups[2],
                name: "spinning spikes",
                desc: "damages enemies when they touch them",
                req: ["wood", 30, "stone", 20],
                health: 500,
                dmg: 45,
                turnSpeed: .003,
                scale: 52,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5
            }, {
                group: e.exports.groups[3],
                name: "windmill",
                desc: "generates gold over time",
                req: ["wood", 50, "stone", 10],
                health: 400,
                pps: 1,
                turnSpeed: .0016,
                spritePadding: 25,
                iconLineMult: 12,
                scale: 45,
                holdOffset: 20,
                placeOffset: 5
            }, {
                age: 5,
                group: e.exports.groups[3],
                name: "faster windmill",
                desc: "generates more gold over time",
                req: ["wood", 60, "stone", 20],
                health: 500,
                pps: 1.5,
                turnSpeed: .0025,
                spritePadding: 25,
                iconLineMult: 12,
                scale: 47,
                holdOffset: 20,
                placeOffset: 5
            }, {
                age: 8,
                group: e.exports.groups[3],
                name: "power mill",
                desc: "generates more gold over time",
                req: ["wood", 100, "stone", 50],
                health: 800,
                pps: 2,
                turnSpeed: .005,
                spritePadding: 25,
                iconLineMult: 12,
                scale: 47,
                holdOffset: 20,
                placeOffset: 5
            }, {
                age: 5,
                group: e.exports.groups[4],
                type: 2,
                name: "mine",
                desc: "allows you to mine stone",
                req: ["wood", 20, "stone", 100],
                iconLineMult: 12,
                scale: 65,
                holdOffset: 20,
                placeOffset: 0
            }, {
                age: 5,
                group: e.exports.groups[11],
                type: 0,
                name: "sapling",
                desc: "allows you to farm wood",
                req: ["wood", 150],
                iconLineMult: 12,
                colDiv: .5,
                scale: 110,
                holdOffset: 50,
                placeOffset: -15
            }, {
                age: 4,
                group: e.exports.groups[5],
                name: "pit trap",
                desc: "pit that traps enemies if they walk over it",
                req: ["wood", 10, "stone", 10],
                trap: !0,
                ignoreCollision: !0,
                hideFromEnemy: !0,
                health: 500,
                colDiv: .2,
                scale: 50,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 4,
                group: e.exports.groups[6],
                name: "boost pad",
                desc: "provides boost when stepped on",
                req: ["stone", 20, "wood", 5],
                ignoreCollision: !0,
                boostSpeed: 1.5,
                health: 150,
                colDiv: .7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: e.exports.groups[7],
                doUpdate: !0,
                name: "turret",
                desc: "defensive structure that shoots at enemies",
                req: ["wood", 200, "stone", 150],
                health: 800,
                projectile: 1,
                shootRange: 700,
                shootRate: 2200,
                scale: 43,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: e.exports.groups[8],
                name: "platform",
                desc: "platform to shoot over walls and cross over water",
                req: ["wood", 20],
                ignoreCollision: !0,
                zIndex: 1,
                health: 300,
                scale: 43,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: e.exports.groups[9],
                name: "healing pad",
                desc: "standing on it will slowly heal you",
                req: ["wood", 30, "food", 10],
                ignoreCollision: !0,
                healCol: 15,
                health: 400,
                colDiv: .7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 9,
                group: e.exports.groups[10],
                name: "spawn pad",
                desc: "you will spawn here when you die but it will dissapear",
                req: ["wood", 100, "stone", 100],
                health: 400,
                ignoreCollision: !0,
                spawnPoint: !0,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: e.exports.groups[12],
                name: "blocker",
                desc: "blocks building in radius",
                req: ["wood", 30, "stone", 25],
                ignoreCollision: !0,
                blocker: 300,
                health: 400,
                colDiv: .7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: e.exports.groups[13],
                name: "teleporter",
                desc: "teleports you to a random point on the map",
                req: ["wood", 60, "stone", 60],
                ignoreCollision: !0,
                teleport: !0,
                health: 200,
                colDiv: .7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5
            }];
        for (var n = 0; n < e.exports.list.length; ++n)
            (e.exports.list[n].id = n),
                e.exports.list[n].pre &&
                (e.exports.list[n].pre = n - e.exports.list[n].pre);
    },
    function(e, t) {
        e.exports = {};
    },
    function(e, t) {
        var n = Math.floor,
            i = Math.abs,
            r = Math.cos,
            s = Math.sin,
            a = (Math.pow, Math.sqrt);
        e.exports = function(e, t, o, c, l, h) {
            var u, f;
            (this.objects = t), (this.grids = {}), (this.updateObjects = []);
            var d = c.mapScale / c.colGrid;
            (this.setObjectGrids = function(e) {
                for (
                    var t = Math.min(c.mapScale, Math.max(0, e.x)),
                    n = Math.min(c.mapScale, Math.max(0, e.y)),
                    i = 0; i < c.colGrid;
                    ++i
                ) {
                    u = i * d;
                    for (var r = 0; r < c.colGrid; ++r)
                        (f = r * d),
                            t + e.scale >= u &&
                            t - e.scale <= u + d &&
                            n + e.scale >= f &&
                            n - e.scale <= f + d &&
                            (this.grids[i + "_" + r] || (this.grids[i + "_" + r] = []),
                             this.grids[i + "_" + r].push(e),
                             e.gridLocations.push(i + "_" + r));
                }
            }),
                (this.removeObjGrid = function(e) {
                for (var t, n = 0; n < e.gridLocations.length; ++n)
                    (t = this.grids[e.gridLocations[n]].indexOf(e)) >= 0 &&
                        this.grids[e.gridLocations[n]].splice(t, 1);
            }),
                (this.disableObj = function(e) {
                if (((e.active = !1), h)) {
                    e.owner && e.pps && (e.owner.pps -= e.pps), this.removeObjGrid(e);
                    var t = this.updateObjects.indexOf(e);
                    t >= 0 && this.updateObjects.splice(t, 1);
                }
            }),
                (this.hitObj = function(e, t) {
                for (var n = 0; n < l.length; ++n)
                    l[n].active &&
                        (e.sentTo[l[n].id] &&
                         (e.active ?
                          l[n].canSee(e) && h.send(l[n].id, "8", o.fixTo(t, 1), e.sid) :
                          h.send(l[n].id, "12", e.sid)),
                         e.active ||
                         e.owner != l[n] ||
                         l[n].changeItemCount(e.group.id, -1));
            });
            var p,
                g,
                m = [];
            (this.getGridArrays = function(e, t, i) {
                (u = n(e / d)), (f = n(t / d)), (m.length = 0);
                try {
                    this.grids[u + "_" + f] && m.push(this.grids[u + "_" + f]),
                        e + i >= (u + 1) * d &&
                        ((p = this.grids[u + 1 + "_" + f]) && m.push(p),
                         f && t - i <= f * d ?
                         (p = this.grids[u + 1 + "_" + (f - 1)]) && m.push(p) :
                         t + i >= (f + 1) * d &&
                         (p = this.grids[u + 1 + "_" + (f + 1)]) &&
                         m.push(p)),
                        u &&
                        e - i <= u * d &&
                        ((p = this.grids[u - 1 + "_" + f]) && m.push(p),
                         f && t - i <= f * d ?
                         (p = this.grids[u - 1 + "_" + (f - 1)]) && m.push(p) :
                         t + i >= (f + 1) * d &&
                         (p = this.grids[u - 1 + "_" + (f + 1)]) &&
                         m.push(p)),
                        t + i >= (f + 1) * d &&
                        (p = this.grids[u + "_" + (f + 1)]) &&
                        m.push(p),
                        f &&
                        t - i <= f * d &&
                        (p = this.grids[u + "_" + (f - 1)]) &&
                        m.push(p);
                } catch (e) {}
                return m;
            }),
                (this.add = function(n, i, r, s, a, o, c, l, u) {
                g = null;
                for (var f = 0; f < t.length; ++f)
                    if (t[f].sid == n) {
                        g = t[f];
                        break;
                    }
                if (!g)
                    for (f = 0; f < t.length; ++f)
                        if (!t[f].active) {
                            g = t[f];
                            break;
                        }
                g || ((g = new e(n)), t.push(g)),
                    l && (g.sid = n),
                    g.init(i, r, s, a, o, c, u),
                    true &&
                    (this.setObjectGrids(g),
                     g.doUpdate && this.updateObjects.push(g));
            }),
                (this.disableBySid = function(e) {
                for (var n = 0; n < t.length; ++n)
                    if (t[n].sid == e) {
                        this.disableObj(t[n]);
                        break;
                    }
            }),
                (this.removeAllItems = function(e, n) {
                for (var i = 0; i < t.length; ++i)
                    t[i].active &&
                        t[i].owner &&
                        t[i].owner.sid == e &&
                        this.disableObj(t[i]);
                n && n.broadcast("13", e);
            }),
                (this.fetchSpawnObj = function(e) {
               for (var n = null, i = 0; i < t.length; ++i)
                   if ((g = t[i]).active && g.owner && g.owner.sid == e && g.spawnPoint) {
                       n = [g.x, g.y],
                           this.disableObj(g),
                           h.broadcast("12", g.sid),
                           g.owner && g.owner.changeItemCount(g.group.id, -1);
                       break
                   }
               return n
            }),
                (this.checkItemLocation = function(e, n, i, r, s, a, l) {
                for (var h = 0; h < t.length; ++h) {
                    var u = t[h].blocker ? t[h].blocker : t[h].getScale(r, t[h].isItem);
                    if (t[h].active && o.getDistance(e, n, t[h].x, t[h].y) < i + u)
                        return !1;
                }
                return !(
                    !a &&
                    18 != s &&
                    n >= c.mapScale / 2 - c.riverWidth / 2 &&
                    n <= c.mapScale / 2 + c.riverWidth / 2
                );
            }),
                (this.addProjectile = function(e, t, n, i, r) {
                for (
                    var s, a = items.projectiles[r], c = 0; c < projectiles.length;
                    ++c
                )
                    if (!projectiles[c].active) {
                        s = projectiles[c];
                        break;
                    }
                s || ((s = new Projectile(l, o)), projectiles.push(s)),
                    s.init(r, e, t, n, a.speed, i, a.scale);
            }),
                (this.checkCollision = function(e, t, n) {
                n = n || 1;
                var l = e.x - t.x,
                    h = e.y - t.y,
                    u = e.scale + t.scale;
                if (i(l) <= u || i(h) <= u) {
                    u = e.scale + (t.getScale ? t.getScale() : t.scale);
                    var f = a(l * l + h * h) - u;
                    if (f <= 0) {
                        if (t.ignoreCollision)
                            !t.trap ||
                                e.noTrap ||
                                t.owner == e ||
                                (t.owner && t.owner.team && t.owner.team == e.team) ?
                                t.boostSpeed ?
                                ((e.xVel +=
                                  n * t.boostSpeed * (t.weightM || 1) * r(t.dir)),
                                 (e.yVel +=
                                  n * t.boostSpeed * (t.weightM || 1) * s(t.dir))) :
                            t.healCol ?
                                (e.healCol = t.healCol) :
                            t.teleport &&
                                ((e.x = o.randInt(0, c.mapScale)),
                                 (e.y = o.randInt(0, c.mapScale))) :
                            ((e.lockMove = !0), (t.hideFromEnemy = !1));
                        else {
                            var d = o.getDirection(e.x, e.y, t.x, t.y);
                            if (
                                (o.getDistance(e.x, e.y, t.x, t.y),
                                 t.isPlayer ?
                                 ((f = (-1 * f) / 2),
                                  (e.x += f * r(d)),
                                  (e.y += f * s(d)),
                                  (t.x -= f * r(d)),
                                  (t.y -= f * s(d))) :
                                 ((e.x = t.x + u * r(d)),
                                  (e.y = t.y + u * s(d)),
                                  (e.xVel *= 0.75),
                                  (e.yVel *= 0.75)),
                                 t.dmg &&
                                 t.owner != e &&
                                 (!t.owner || !t.owner.team || t.owner.team != e.team))
                            ) {
                                e.changeHealth(-t.dmg, t.owner, t);
                                var p = 1.5 * (t.weightM || 1);
                                (e.xVel += p * r(d)),
                                    (e.yVel += p * s(d)),
                                    !t.pDmg ||
                                    (e.skin && e.skin.poisonRes) ||
                                    ((e.dmgOverTime.dmg = t.pDmg),
                                     (e.dmgOverTime.time = 5),
                                     (e.dmgOverTime.doer = t.owner)),
                                    e.colDmg &&
                                    t.health &&
                                    (t.changeHealth(-e.colDmg) && this.disableObj(t),
                                     this.hitObj(t, o.getDirection(e.x, e.y, t.x, t.y)));
                            }
                        }
                        return t.zIndex > e.zIndex && (e.zIndex = t.zIndex), !0;
                    }
                }
                return !1;
            });
        };
    },
    function(e, t, n) {
        var i = new(n(49))();
        i.addWords(
            "jew",
            "black",
            "baby",
            "child",
            "white",
            "porn",
            "pedo",
            "trump",
            "clinton",
            "hitler",
            "nazi",
            "gay",
            "pride",
            "sex",
            "pleasure",
            "touch",
            "poo",
            "kids",
            "rape",
            "white power",
            "nigga",
            "nig nog",
            "doggy",
            "rapist",
            "boner",
            "nigger",
            "nigg",
            "finger",
            "nogger",
            "nagger",
            "nig",
            "fag",
            "gai",
            "pole",
            "stripper",
            "penis",
            "vagina",
            "pussy",
            "nazi",
            "hitler",
            "stalin",
            "burn",
            "chamber",
            "cock",
            "peen",
            "dick",
            "spick",
            "nieger",
            "die",
            "satan",
            "n|ig",
            "nlg",
            "cunt",
            "c0ck",
            "fag",
            "lick",
            "condom",
            "anal",
            "shit",
            "phile",
            "little",
            "kids",
            "free KR",
            "tiny",
            "sidney",
            "ass",
            "kill",
            ".io",
            "(dot)",
            "[dot]",
            "mini",
            "whiore",
            "whore",
            "faggot",
            "github",
            "1337",
            "666",
            "satan",
            "senpa",
            "discord",
            "d1scord",
            "mistik",
            ".io",
            "senpa.io",
            "sidney",
            "sid",
            "senpaio",
            "vries",
            "asa",
        );
        var r = Math.abs,
            s = Math.cos,
            a = Math.sin,
            o = Math.pow,
            c = Math.sqrt;
        e.exports = function(e, t, n, l, h, u, f, d, p, g, m, y, k, v) {
            (this.id = e),
                (this.sid = t),
                (this.tmpScore = 0),
                (this.team = null),
                (this.skinIndex = 0),
                (this.tailIndex = 0),
                (this.hitTime = 0),
                (this.tails = {});
            for (var w = 0; w < m.length; ++w)
                m[w].price <= 0 && (this.tails[m[w].id] = 1);
            for (this.skins = {}, w = 0; w < g.length; ++w)
                g[w].price <= 0 && (this.skins[g[w].id] = 1);
            (this.points = 0),
                (this.dt = 0),
                (this.hidden = !1),
                (this.itemCounts = {}),
                (this.isPlayer = !0),
                (this.pps = 0),
                (this.moveDir = void 0),
                (this.skinRot = 0),
                (this.lastPing = 0),
                (this.iconIndex = 0),
                (this.skinColor = 0),
                (this.reloads = [{count: Math.ceil(300 / 111), max: Math.ceil(300 / 111), id: 0, rarity: 0}, {count: Math.ceil(1500 / 111), max: Math.ceil(1500 / 111), id: 15, rarity: 0}, 23]),
                (this.spawn = function(e) {
                (this.active = !0),
                    (this.alive = !0),
                    (this.lockMove = !1),
                    (this.lockDir = !1),
                    (this.minimapCounter = 0),
                    (this.chatCountdown = 0),
                    (this.shameCount = 0),
                    (this.shameTimer = 0),
                    (this.sentTo = {}),
                    (this.gathering = 0),
                    (this.autoGather = 0),
                    (this.animTime = 0),
                    (this.animSpeed = 0),
                    (this.mouseState = 0),
                    (this.buildIndex = -1),
                    (this.healthMov = 100),
                    (this.shameMov = 8),
                    (this.weaponIndex = 0),
                    (this.dmgOverTime = {}),
                    (this.noMovTimer = 0),
                    (this.maxXP = 300),
                    (this.XP = 0),
                    (this.age = 1),
                    (this.kills = 0),
                    (this.upgrAge = 2),
                    (this.upgradePoints = 0),
                    (this.x = 0),
                    (this.y = 0),
                    (this.zIndex = 0),
                    (this.xVel = 0),
                    (this.yVel = 0),
                    (this.slowMult = 1),
                    (this.dir = 0),
                    (this.dirPlus = 0),
                    (this.targetDir = 0),
                    (this.targetAngle = 0),
                    (this.maxHealth = 100),
                    (this.health = this.maxHealth),
                    (this.scale = n.playerScale),
                    (this.speed = n.playerSpeed),
                    this.resetMoveDir(),
                    this.resetResources(e),
                    (this.items = [0, 3, 6, 10]),
                    (this.weapons = [0]),
                    (this.shootCount = 0),
                    (this.weaponXP = []),
                    (this.reloads = [{count: Math.ceil(300 / 111), max: Math.ceil(300 / 111), id: 0, rarity: 0, done: true}, {count: Math.ceil(1500 / 111), max: Math.ceil(1500 / 111), id: 15, rarity: 0, done: true}, 23]);

            }),
                (this.resetMoveDir = function() {
                this.moveDir = void 0;
            }),
                (this.resetResources = function(e) {
                for (var t = 0; t < n.resourceTypes.length; ++t)
                    this[n.resourceTypes[t]] = e ? 100 : 0;
            }),
                (this.addItem = function(e) {
                var t = p.list[e];
                if (t) {
                    for (var n = 0; n < this.items.length; ++n)
                        if (p.list[this.items[n]].group == t.group)
                            return (
                                this.buildIndex == this.items[n] && (this.buildIndex = e),
                                (this.items[n] = e),
                                !0
                            );
                    return this.items.push(e), !0;
                }
                return !1;
            }),
                (this.setUserData = function(e) {
                if (e) {
                    this.name = "a-ware";
                    var t = e.name + "",
                        r = !1,
                        s = (t = (t = (t = (t = t.slice(0, n.maxNameLength)).replace(
                            /[^\w:\(\)\/? -]+/gim,
                            " ",
                        )).replace(/[^\x00-\x7F]/g, " ")).trim())
                    .toLowerCase()
                    .replace(/\s/g, "")
                    .replace(/1/g, "i")
                    .replace(/0/g, "o")
                    .replace(/5/g, "s");
                    for (var a of i.list)
                        if (-1 != s.indexOf(a)) {
                            r = !0;
                            break;
                        }
                    t.length > 0 && !r && (this.name = t),
                        (this.skinColor = 0),
                        n.skinColors[e.skin] && (this.skinColor = e.skin);
                }
            }),
                (this.getData = function() {
                return [
                    this.id,
                    this.sid,
                    this.name,
                    l.fixTo(this.x, 2),
                    l.fixTo(this.y, 2),
                    l.fixTo(this.dir, 3),
                    this.health,
                    this.maxHealth,
                    this.scale,
                    this.skinColor,
                ];
            }),
                (this.setData = function(e) {
                (this.id = e[0]),
                    (this.sid = e[1]),
                    (this.name = e[2]),
                    (this.x = e[3]),
                    (this.y = e[4]),
                    (this.dir = e[5]),
                    (this.health = e[6]),
                    (this.maxHealth = e[7]),
                    (this.scale = e[8]),
                    (this.skinColor = e[9]);
            });
            var b = 0;
            (this.update = function(e) {
                if (this.alive) {
                    if(this.health != this.healthMov){
                        this.health < this.healthMov ? (this.healthMov -= 3) : (this.healthMov += 3);
                        if(Math.abs(this.health - this.healthMov) < 3) this.healthMov = this.health;
                    };
                    if(this.shameCount != this.shameMov) this.shameCount < this.shameMov ? (this.shameMov -= .1) : (this.shameMov += .1), Math.abs(this.shameCount - this.shameMov) < .1 && (this.shameMov = this.shameCount);
                };
            }),
                (this.onTick = function(e) {
                let Reload = this.reloads[Number(this.weaponIndex > 8)]; /* Secondary / Primary */
                let Weapon = p.weapons[this.weaponIndex];
                if(Reload.id != Weapon.id) {
                    Reload.id = Weapon.id;
                    Reload.max = Weapon.speed ? (Math.ceil(Weapon.speed / 111)) : 0;
                    Reload.count = Reload.max;
                    Reload.done = true;
                    Reload.rarity = this.weaponVariant;
                };
                if(this.weaponVariant != Reload.rarity) Reload.rarity = this.weaponVariant;
                if(Reload.count < Reload.max && this.buildIndex == -1){
                    Reload.count += 1;
                    Reload.done = Reload.count == Reload.max;
                };
                this.reloads[Number(this.weaponIndex > 8)] = Reload;
                if(this.reloads[2] < 23) this.reloads[2]++;
            }),
                (this.addWeaponXP = function(e) {
                this.weaponXP[this.weaponIndex] ||
                    (this.weaponXP[this.weaponIndex] = 0),
                    (this.weaponXP[this.weaponIndex] += e);
            }),
                (this.earnXP = function(e) {
                this.age < n.maxAge &&
                    ((this.XP += e),
                     this.XP >= this.maxXP ?
                     (this.age < n.maxAge ?
                      (this.age++, (this.XP = 0), (this.maxXP *= 1.2)) :
                      (this.XP = this.maxXP),
                      this.upgradePoints++,
                      y.send(this.id, "16", this.upgradePoints, this.upgrAge),
                      y.send(
                    this.id,
                    "15",
                    this.XP,
                    l.fixTo(this.maxXP, 1),
                    this.age,
                )) :
                     y.send(this.id, "15", this.XP));
            }),
                (this.changeHealth = function(e, t) {
                if (e > 0 && this.health >= this.maxHealth) return !1;
                e < 0 && this.skin && (e *= this.skin.dmgMult || 1),
                    e < 0 && this.tail && (e *= this.tail.dmgMult || 1),
                    e < 0 && (this.hitTime = Date.now()),
                    (this.health += e),
                    this.health > this.maxHealth &&
                    ((e -= this.health - this.maxHealth),
                     (this.health = this.maxHealth)),
                    this.health <= 0 && this.kill(t);
                for (var n = 0; n < f.length; ++n)
                    this.sentTo[f[n].id] &&
                        y.send(f[n].id, "h", this.sid, Math.round(this.health));
                return (
                    !t ||
                    !t.canSee(this) ||
                    (t == this && e < 0) ||
                    y.send(
                        t.id,
                        "t",
                        Math.round(this.x),
                        Math.round(this.y),
                        Math.round(-e),
                        1,
                    ),
                    !0
                );
            }),
                (this.kill = function(e) {
                e &&
                    e.alive &&
                    (e.kills++,
                     e.skin && e.skin.goldSteal ?
                     k(e, Math.round(this.points / 2)) :
                     k(
                    e,
                    Math.round(
                        100 *
                        this.age *
                        (e.skin && e.skin.kScrM ? e.skin.kScrM : 1),
                    ),
                ),
                     y.send(e.id, "9", "kills", e.kills, 1)),
                    (this.alive = !1),
                    y.send(this.id, "11"),
                    v();
            }),
                (this.addResource = function(e, t, i) {
                !i && t > 0 && this.addWeaponXP(t),
                    3 == e ?
                    k(this, t, !0) :
                ((this[n.resourceTypes[e]] += t),
                 y.send(
                    this.id,
                    "9",
                    n.resourceTypes[e],
                    this[n.resourceTypes[e]],
                    1,
                ));
            }),
                (this.changeItemCount = function(e, t) {
                (this.itemCounts[e] = this.itemCounts[e] || 0),
                    (this.itemCounts[e] += t),
                    y.send(this.id, "14", e, this.itemCounts[e]);
            }),
                (this.buildItem = function() {
                if (this.hitTime) {
                    let o = Wish - this.hitTime;
                    this.hitTime = 0;
                    o < 2 ? (this.shameCount++,
                             this.shameCount >= 8 && (this.shameTimer = 3e4, this.shameCount = 0)) : (this.shameCount = Math.max(0, this.shameCount - 2))
                }
            }),
                (this.hasRes = function(e, t) {
                for (var n = 0; n < e.req.length;) {
                    if (this[e.req[n]] < Math.round(e.req[n + 1] * (t || 1))) return !1;
                    n += 2;
                }
                return !0;
            }),
                (this.useRes = function(e, t) {
                if (!n.inSandbox)
                    for (var i = 0; i < e.req.length;)
                        this.addResource(
                            n.resourceTypes.indexOf(e.req[i]),
                            -Math.round(e.req[i + 1] * (t || 1)),
                        ),
                            (i += 2);
            }),
                (this.canBuild = function(e) {
                return (
                    !!n.inSandbox ||
                    (!(e.group.limit && this.itemCounts[e.group.id] >= e.group.limit) &&
                     this.hasRes(e))
                );
            }),
                this.gather = function(oe, ot, on){
                this.reloads[ot].count = 0;
                this.reloads[ot].done = false;
                this.noMovTimer = 0, this.slowMult -= on.hitSlow ||
                    .3, this.slowMult < 0 && (this.slowMult = 0);
                for(var e, t, i, r = n.fetchVariant(this), o = r.poison, c = r.val, h = {},
                    g = u.getGridArrays(this.x, this.y, on.range),
                    m = 0; m < g.length; ++m)
                    for(var y = 0; y < g[m].length; ++y)
                        if ((t = g[m][y]).active && !t.dontGather && !h[t.sid] && Date.now() - t.hitTime <= 100 && l.getDistance(this.x, this.y, t.x, t.y) - t.scale - 35 <= p.weapons[this.weaponIndex].range){
                            e = l.getDirection(t.x, t.y, this.x, this.y);
                            if(l.getAngleDist(e, this.d2) <= n.gatherAngle) {
                                h[t.sid] = 1;
                                if (t.health) {
                                    if (t.changeHealth(-on.dmg * c * (oe == 10 ? 7.5 : 1) * (this.skinIndex == 40 ? 3.3 : 1), this)) {
                                        null;
                                    }
                                }
                            }
                        }
            };
            var x = 0,
                S = 0;
            (this.animate = function(e) {
                this.animTime > 0 &&
                    ((this.animTime -= e),
                     this.animTime <= 0 ?
                     ((this.animTime = 0), (this.dirPlus = 0), (x = 0), (S = 0)) :
                     0 == S ?
                     ((x += e / (this.animSpeed * n.hitReturnRatio)),
                      (this.dirPlus = l.lerp(0, this.targetAngle, Math.min(1, x))),
                      x >= 1 && ((x = 1), (S = 1))) :
                     ((x -= e / (this.animSpeed * (1 - n.hitReturnRatio))),
                      (this.dirPlus = l.lerp(0, this.targetAngle, Math.max(0, x)))));
            }),
                (this.startAnim = function(e, t) {
                (this.animTime = this.animSpeed = p.weapons[t].speed),
                    (this.targetAngle = e ? -n.hitAngle : -Math.PI),
                    (x = 0),
                    (S = 0);
            }),
                (this.canSee = function(e) {
                if (!e) return !1;
                if (e.skin && e.skin.invisTimer && e.noMovTimer >= e.skin.invisTimer)
                    return !1;
                var t = r(e.x - this.x) - e.scale,
                    i = r(e.y - this.y) - e.scale;
                return (
                    t <= (n.maxScreenWidth / 2) * 1.3 &&
                    i <= (n.maxScreenHeight / 2) * 1.3
                );
            });
        };
    },
    function(e, t, n) {
        const i = n(50).words,
              r = n(51).array;
        e.exports = class {
            constructor(e = {}) {
                Object.assign(this, {
                    list: (e.emptyList && []) ||
                    Array.prototype.concat.apply(i, [r, e.list || []]),
                    exclude: e.exclude || [],
                    placeHolder: e.placeHolder || "*",
                    regex: e.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
                    replaceRegex: e.replaceRegex || /\w/g,
                });
            }
            isProfane(e) {
                return (
                    this.list.filter((t) => {
                        const n = new RegExp(`\\b${t.replace(/(\W)/g, "\\$1")}\\b`, "gi");
                        return !this.exclude.includes(t.toLowerCase()) && n.test(e);
                    }).length > 0 || !1
                );
            }
            replaceWord(e) {
                return e
                    .replace(this.regex, "")
                    .replace(this.replaceRegex, this.placeHolder);
            }
            clean(e) {
                return e
                    .split(/\b/)
                    .map((e) => (this.isProfane(e) ? this.replaceWord(e) : e))
                    .join("");
            }
            addWords() {
                let e = Array.from(arguments);
                this.list.push(...e),
                    e
                    .map((e) => e.toLowerCase())
                    .forEach((e) => {
                    this.exclude.includes(e) &&
                        this.exclude.splice(this.exclude.indexOf(e), 1);
                });
            }
            removeWords() {
                this.exclude.push(...Array.from(arguments).map((e) => e.toLowerCase()));
            }
        };
    },
    function(e) {
        e.exports = {
            words: [
                "ahole",
                "anus",
                "ash0le",
                "ash0les",
                "asholes",
                "ass",
                "Ass Monkey",
                "Assface",
                "assh0le",
                "assh0lez",
                "asshole",
                "assholes",
                "assholz",
                "asswipe",
                "azzhole",
                "bassterds",
                "bastard",
                "bastards",
                "bastardz",
                "basterds",
                "basterdz",
                "Biatch",
                "bitch",
                "bitches",
                "Blow Job",
                "boffing",
                "butthole",
                "buttwipe",
                "c0ck",
                "c0cks",
                "c0k",
                "Carpet Muncher",
                "cawk",
                "cawks",
                "Clit",
                "cnts",
                "cntz",
                "cock",
                "cockhead",
                "cock-head",
                "cocks",
                "CockSucker",
                "cock-sucker",
                "crap",
                "cum",
                "cunt",
                "cunts",
                "cuntz",
                "dick",
                "dild0",
                "dild0s",
                "dildo",
                "dildos",
                "dilld0",
                "dilld0s",
                "dominatricks",
                "dominatrics",
                "dominatrix",
                "dyke",
                "enema",
                "f u c k",
                "f u c k e r",
                "fag",
                "fag1t",
                "faget",
                "fagg1t",
                "faggit",
                "faggot",
                "fagg0t",
                "fagit",
                "fags",
                "fagz",
                "faig",
                "faigs",
                "fart",
                "flipping the bird",
                "fuck",
                "fucker",
                "fuckin",
                "fucking",
                "fucks",
                "Fudge Packer",
                "fuk",
                "Fukah",
                "Fuken",
                "fuker",
                "Fukin",
                "Fukk",
                "Fukkah",
                "Fukken",
                "Fukker",
                "Fukkin",
                "g00k",
                "God-damned",
                "h00r",
                "h0ar",
                "h0re",
                "hells",
                "hoar",
                "hoor",
                "hoore",
                "jackoff",
                "jap",
                "japs",
                "jerk-off",
                "jisim",
                "jiss",
                "jizm",
                "jizz",
                "knob",
                "knobs",
                "knobz",
                "kunt",
                "kunts",
                "kuntz",
                "Lezzian",
                "Lipshits",
                "Lipshitz",
                "masochist",
                "masokist",
                "massterbait",
                "masstrbait",
                "masstrbate",
                "masterbaiter",
                "masterbate",
                "masterbates",
                "Motha Fucker",
                "Motha Fuker",
                "Motha Fukkah",
                "Motha Fukker",
                "Mother Fucker",
                "Mother Fukah",
                "Mother Fuker",
                "Mother Fukkah",
                "Mother Fukker",
                "mother-fucker",
                "Mutha Fucker",
                "Mutha Fukah",
                "Mutha Fuker",
                "Mutha Fukkah",
                "Mutha Fukker",
                "n1gr",
                "nastt",
                "nigger;",
                "nigur;",
                "niiger;",
                "niigr;",
                "orafis",
                "orgasim;",
                "orgasm",
                "orgasum",
                "oriface",
                "orifice",
                "orifiss",
                "packi",
                "packie",
                "packy",
                "paki",
                "pakie",
                "paky",
                "pecker",
                "peeenus",
                "peeenusss",
                "peenus",
                "peinus",
                "pen1s",
                "penas",
                "penis",
                "penis-breath",
                "penus",
                "penuus",
                "Phuc",
                "Phuck",
                "Phuk",
                "Phuker",
                "Phukker",
                "polac",
                "polack",
                "polak",
                "Poonani",
                "pr1c",
                "pr1ck",
                "pr1k",
                "pusse",
                "pussee",
                "pussy",
                "puuke",
                "puuker",
                "queer",
                "queers",
                "queerz",
                "qweers",
                "qweerz",
                "qweir",
                "recktum",
                "rectum",
                "retard",
                "sadist",
                "scank",
                "schlong",
                "screwing",
                "semen",
                "sex",
                "sexy",
                "Sh!t",
                "sh1t",
                "sh1ter",
                "sh1ts",
                "sh1tter",
                "sh1tz",
                "shit",
                "shits",
                "shitter",
                "Shitty",
                "Shity",
                "shitz",
                "Shyt",
                "Shyte",
                "Shytty",
                "Shyty",
                "skanck",
                "skank",
                "skankee",
                "skankey",
                "skanks",
                "Skanky",
                "slag",
                "slut",
                "sluts",
                "Slutty",
                "slutz",
                "son-of-a-bitch",
                "tit",
                "turd",
                "va1jina",
                "vag1na",
                "vagiina",
                "vagina",
                "vaj1na",
                "vajina",
                "vullva",
                "vulva",
                "w0p",
                "wh00r",
                "wh0re",
                "whore",
                "xrated",
                "xxx",
                "b!+ch",
                "bitch",
                "blowjob",
                "clit",
                "arschloch",
                "fuck",
                "shit",
                "ass",
                "asshole",
                "b!tch",
                "b17ch",
                "b1tch",
                "bastard",
                "bi+ch",
                "boiolas",
                "buceta",
                "c0ck",
                "cawk",
                "chink",
                "cipa",
                "clits",
                "cock",
                "cum",
                "cunt",
                "dildo",
                "dirsa",
                "ejakulate",
                "fatass",
                "fcuk",
                "fuk",
                "fux0r",
                "hoer",
                "hore",
                "jism",
                "kawk",
                "l3itch",
                "l3i+ch",
                "lesbian",
                "masturbate",
                "masterbat*",
                "masterbat3",
                "motherfucker",
                "s.o.b.",
                "mofo",
                "nazi",
                "nigga",
                "nigger",
                "nutsack",
                "phuck",
                "pimpis",
                "pusse",
                "pussy",
                "scrotum",
                "sh!t",
                "shemale",
                "shi+",
                "sh!+",
                "slut",
                "smut",
                "teets",
                "tits",
                "boobs",
                "b00bs",
                "teez",
                "testical",
                "testicle",
                "titt",
                "w00se",
                "jackoff",
                "wank",
                "whoar",
                "whore",
                "*damn",
                "*dyke",
                "*fuck*",
                "*shit*",
                "@$$",
                "amcik",
                "andskota",
                "arse*",
                "assrammer",
                "ayir",
                "bi7ch",
                "bitch*",
                "bollock*",
                "breasts",
                "butt-pirate",
                "cabron",
                "cazzo",
                "chraa",
                "chuj",
                "Cock*",
                "cunt*",
                "d4mn",
                "daygo",
                "dego",
                "dick*",
                "dike*",
                "dupa",
                "dziwka",
                "ejackulate",
                "Ekrem*",
                "Ekto",
                "enculer",
                "faen",
                "fag*",
                "fanculo",
                "fanny",
                "feces",
                "feg",
                "Felcher",
                "ficken",
                "fitt*",
                "Flikker",
                "foreskin",
                "Fotze",
                "Fu(*",
                "fuk*",
                "futkretzn",
                "gook",
                "guiena",
                "h0r",
                "h4x0r",
                "hell",
                "helvete",
                "hoer*",
                "honkey",
                "Huevon",
                "hui",
                "injun",
                "jizz",
                "kanker*",
                "kike",
                "klootzak",
                "kraut",
                "knulle",
                "kuk",
                "kuksuger",
                "Kurac",
                "kurwa",
                "kusi*",
                "kyrpa*",
                "lesbo",
                "mamhoon",
                "masturbat*",
                "merd*",
                "mibun",
                "monkleigh",
                "mouliewop",
                "muie",
                "mulkku",
                "muschi",
                "nazis",
                "nepesaurio",
                "nigger*",
                "orospu",
                "paska*",
                "perse",
                "picka",
                "pierdol*",
                "pillu*",
                "pimmel",
                "piss*",
                "pizda",
                "poontsee",
                "poop",
                "porn",
                "p0rn",
                "pr0n",
                "preteen",
                "pula",
                "pule",
                "puta",
                "puto",
                "qahbeh",
                "queef*",
                "rautenberg",
                "schaffer",
                "scheiss*",
                "schlampe",
                "schmuck",
                "screw",
                "sh!t*",
                "sharmuta",
                "sharmute",
                "shipal",
                "shiz",
                "skribz",
                "skurwysyn",
                "sphencter",
                "spic",
                "spierdalaj",
                "splooge",
                "suka",
                "b00b*",
                "testicle*",
                "titt*",
                "twat",
                "vittu",
                "wank*",
                "wetback*",
                "wichser",
                "wop*",
                "yed",
                "zabourah",
            ],
        };
    },
    function(e, t, n) {
        e.exports = {
            object: n(52),
            array: n(53),
            regex: n(54)
        };
    },
    function(e, t) {
        e.exports = {
            "4r5e": 1,
            "5h1t": 1,
            "5hit": 1,
            a55: 1,
            anal: 1,
            anus: 1,
            ar5e: 1,
            arrse: 1,
            arse: 1,
            ass: 1,
            "ass-fucker": 1,
            asses: 1,
            assfucker: 1,
            assfukka: 1,
            asshole: 1,
            assholes: 1,
            asswhole: 1,
            a_s_s: 1,
            "b!tch": 1,
            b00bs: 1,
            b17ch: 1,
            b1tch: 1,
            ballbag: 1,
            balls: 1,
            ballsack: 1,
            bastard: 1,
            beastial: 1,
            beastiality: 1,
            bellend: 1,
            bestial: 1,
            bestiality: 1,
            "bi+ch": 1,
            biatch: 1,
            bitch: 1,
            bitcher: 1,
            bitchers: 1,
            bitches: 1,
            bitchin: 1,
            bitching: 1,
            bloody: 1,
            "blow job": 1,
            blowjob: 1,
            blowjobs: 1,
            boiolas: 1,
            bollock: 1,
            bollok: 1,
            boner: 1,
            boob: 1,
            boobs: 1,
            booobs: 1,
            boooobs: 1,
            booooobs: 1,
            booooooobs: 1,
            breasts: 1,
            buceta: 1,
            bugger: 1,
            bum: 1,
            "bunny fucker": 1,
            butt: 1,
            butthole: 1,
            buttmuch: 1,
            buttplug: 1,
            c0ck: 1,
            c0cksucker: 1,
            "carpet muncher": 1,
            cawk: 1,
            chink: 1,
            cipa: 1,
            cl1t: 1,
            clit: 1,
            clitoris: 1,
            clits: 1,
            cnut: 1,
            cock: 1,
            "cock-sucker": 1,
            cockface: 1,
            cockhead: 1,
            cockmunch: 1,
            cockmuncher: 1,
            cocks: 1,
            cocksuck: 1,
            cocksucked: 1,
            cocksucker: 1,
            cocksucking: 1,
            cocksucks: 1,
            cocksuka: 1,
            cocksukka: 1,
            cok: 1,
            cokmuncher: 1,
            coksucka: 1,
            coon: 1,
            cox: 1,
            crap: 1,
            cum: 1,
            cummer: 1,
            cumming: 1,
            cums: 1,
            cumshot: 1,
            cunilingus: 1,
            cunillingus: 1,
            cunnilingus: 1,
            cunt: 1,
            cuntlick: 1,
            cuntlicker: 1,
            cuntlicking: 1,
            cunts: 1,
            cyalis: 1,
            cyberfuc: 1,
            cyberfuck: 1,
            cyberfucked: 1,
            cyberfucker: 1,
            cyberfuckers: 1,
            cyberfucking: 1,
            d1ck: 1,
            damn: 1,
            dick: 1,
            dickhead: 1,
            dildo: 1,
            dildos: 1,
            dink: 1,
            dinks: 1,
            dirsa: 1,
            dlck: 1,
            "dog-fucker": 1,
            doggin: 1,
            dogging: 1,
            donkeyribber: 1,
            doosh: 1,
            duche: 1,
            dyke: 1,
            ejaculate: 1,
            ejaculated: 1,
            ejaculates: 1,
            ejaculating: 1,
            ejaculatings: 1,
            ejaculation: 1,
            ejakulate: 1,
            "f u c k": 1,
            "f u c k e r": 1,
            f4nny: 1,
            fag: 1,
            fagging: 1,
            faggitt: 1,
            faggot: 1,
            faggs: 1,
            fagot: 1,
            fagots: 1,
            fags: 1,
            fanny: 1,
            fannyflaps: 1,
            fannyfucker: 1,
            fanyy: 1,
            fatass: 1,
            fcuk: 1,
            fcuker: 1,
            fcuking: 1,
            feck: 1,
            fecker: 1,
            felching: 1,
            fellate: 1,
            fellatio: 1,
            fingerfuck: 1,
            fingerfucked: 1,
            fingerfucker: 1,
            fingerfuckers: 1,
            fingerfucking: 1,
            fingerfucks: 1,
            fistfuck: 1,
            fistfucked: 1,
            fistfucker: 1,
            fistfuckers: 1,
            fistfucking: 1,
            fistfuckings: 1,
            fistfucks: 1,
            flange: 1,
            fook: 1,
            fooker: 1,
            fuck: 1,
            fucka: 1,
            fucked: 1,
            fucker: 1,
            fuckers: 1,
            fuckhead: 1,
            fuckheads: 1,
            fuckin: 1,
            fucking: 1,
            fuckings: 1,
            fuckingshitmotherfucker: 1,
            fuckme: 1,
            fucks: 1,
            fuckwhit: 1,
            fuckwit: 1,
            "fudge packer": 1,
            fudgepacker: 1,
            fuk: 1,
            fuker: 1,
            fukker: 1,
            fukkin: 1,
            fuks: 1,
            fukwhit: 1,
            fukwit: 1,
            fux: 1,
            fux0r: 1,
            f_u_c_k: 1,
            gangbang: 1,
            gangbanged: 1,
            gangbangs: 1,
            gaylord: 1,
            gaysex: 1,
            goatse: 1,
            God: 1,
            "god-dam": 1,
            "god-damned": 1,
            goddamn: 1,
            goddamned: 1,
            hardcoresex: 1,
            hell: 1,
            heshe: 1,
            hoar: 1,
            hoare: 1,
            hoer: 1,
            homo: 1,
            hore: 1,
            horniest: 1,
            horny: 1,
            hotsex: 1,
            "jack-off": 1,
            jackoff: 1,
            jap: 1,
            "jerk-off": 1,
            jism: 1,
            jiz: 1,
            jizm: 1,
            jizz: 1,
            kawk: 1,
            knob: 1,
            knobead: 1,
            knobed: 1,
            knobend: 1,
            knobhead: 1,
            knobjocky: 1,
            knobjokey: 1,
            kock: 1,
            kondum: 1,
            kondums: 1,
            kum: 1,
            kummer: 1,
            kumming: 1,
            kums: 1,
            kunilingus: 1,
            "l3i+ch": 1,
            l3itch: 1,
            labia: 1,
            lust: 1,
            lusting: 1,
            m0f0: 1,
            m0fo: 1,
            m45terbate: 1,
            ma5terb8: 1,
            ma5terbate: 1,
            masochist: 1,
            "master-bate": 1,
            masterb8: 1,
            "masterbat*": 1,
            masterbat3: 1,
            masterbate: 1,
            masterbation: 1,
            masterbations: 1,
            masturbate: 1,
            "mo-fo": 1,
            mof0: 1,
            mofo: 1,
            mothafuck: 1,
            mothafucka: 1,
            mothafuckas: 1,
            mothafuckaz: 1,
            mothafucked: 1,
            mothafucker: 1,
            mothafuckers: 1,
            mothafuckin: 1,
            mothafucking: 1,
            mothafuckings: 1,
            mothafucks: 1,
            "mother fucker": 1,
            motherfuck: 1,
            motherfucked: 1,
            motherfucker: 1,
            motherfuckers: 1,
            motherfuckin: 1,
            motherfucking: 1,
            motherfuckings: 1,
            motherfuckka: 1,
            motherfucks: 1,
            muff: 1,
            mutha: 1,
            muthafecker: 1,
            muthafuckker: 1,
            muther: 1,
            mutherfucker: 1,
            n1gga: 1,
            n1gger: 1,
            nazi: 1,
            nigg3r: 1,
            nigg4h: 1,
            nigga: 1,
            niggah: 1,
            niggas: 1,
            niggaz: 1,
            nigger: 1,
            niggers: 1,
            nob: 1,
            "nob jokey": 1,
            nobhead: 1,
            nobjocky: 1,
            nobjokey: 1,
            numbnuts: 1,
            nutsack: 1,
            orgasim: 1,
            orgasims: 1,
            orgasm: 1,
            orgasms: 1,
            p0rn: 1,
            pawn: 1,
            pecker: 1,
            penis: 1,
            penisfucker: 1,
            phonesex: 1,
            phuck: 1,
            phuk: 1,
            phuked: 1,
            phuking: 1,
            phukked: 1,
            phukking: 1,
            phuks: 1,
            phuq: 1,
            pigfucker: 1,
            pimpis: 1,
            piss: 1,
            pissed: 1,
            pisser: 1,
            pissers: 1,
            pisses: 1,
            pissflaps: 1,
            pissin: 1,
            pissing: 1,
            pissoff: 1,
            poop: 1,
            porn: 1,
            porno: 1,
            pornography: 1,
            pornos: 1,
            prick: 1,
            pricks: 1,
            pron: 1,
            pube: 1,
            pusse: 1,
            pussi: 1,
            pussies: 1,
            pussy: 1,
            pussys: 1,
            rectum: 1,
            retard: 1,
            rimjaw: 1,
            rimming: 1,
            "s hit": 1,
            "s.o.b.": 1,
            sadist: 1,
            schlong: 1,
            screwing: 1,
            scroat: 1,
            scrote: 1,
            scrotum: 1,
            semen: 1,
            sex: 1,
            "sh!+": 1,
            "sh!t": 1,
            sh1t: 1,
            shag: 1,
            shagger: 1,
            shaggin: 1,
            shagging: 1,
            shemale: 1,
            "shi+": 1,
            shit: 1,
            shitdick: 1,
            shite: 1,
            shited: 1,
            shitey: 1,
            shitfuck: 1,
            shitfull: 1,
            shithead: 1,
            shiting: 1,
            shitings: 1,
            shits: 1,
            shitted: 1,
            shitter: 1,
            shitters: 1,
            shitting: 1,
            shittings: 1,
            shitty: 1,
            skank: 1,
            slut: 1,
            sluts: 1,
            smegma: 1,
            smut: 1,
            snatch: 1,
            "son-of-a-bitch": 1,
            spac: 1,
            spunk: 1,
            s_h_i_t: 1,
            t1tt1e5: 1,
            t1tties: 1,
            teets: 1,
            teez: 1,
            testical: 1,
            testicle: 1,
            tit: 1,
            titfuck: 1,
            tits: 1,
            titt: 1,
            tittie5: 1,
            tittiefucker: 1,
            titties: 1,
            tittyfuck: 1,
            tittywank: 1,
            titwank: 1,
            tosser: 1,
            turd: 1,
            tw4t: 1,
            twat: 1,
            twathead: 1,
            twatty: 1,
            twunt: 1,
            twunter: 1,
            v14gra: 1,
            v1gra: 1,
            vagina: 1,
            viagra: 1,
            vulva: 1,
            w00se: 1,
            wang: 1,
            wank: 1,
            wanker: 1,
            wanky: 1,
            whoar: 1,
            whore: 1,
            willies: 1,
            willy: 1,
            xrated: 1,
            xxx: 1,
        };
    },
    function(e, t) {
        e.exports = [
            "4r5e",
            "5h1t",
            "5hit",
            "a55",
            "anal",
            "anus",
            "ar5e",
            "arrse",
            "arse",
            "ass",
            "ass-fucker",
            "asses",
            "assfucker",
            "assfukka",
            "asshole",
            "assholes",
            "asswhole",
            "a_s_s",
            "b!tch",
            "b00bs",
            "b17ch",
            "b1tch",
            "ballbag",
            "balls",
            "ballsack",
            "bastard",
            "beastial",
            "beastiality",
            "bellend",
            "bestial",
            "bestiality",
            "bi+ch",
            "biatch",
            "bitch",
            "bitcher",
            "bitchers",
            "bitches",
            "bitchin",
            "bitching",
            "bloody",
            "blow job",
            "blowjob",
            "blowjobs",
            "boiolas",
            "bollock",
            "bollok",
            "boner",
            "boob",
            "boobs",
            "booobs",
            "boooobs",
            "booooobs",
            "booooooobs",
            "breasts",
            "buceta",
            "bugger",
            "bum",
            "bunny fucker",
            "butt",
            "butthole",
            "buttmuch",
            "buttplug",
            "c0ck",
            "c0cksucker",
            "carpet muncher",
            "cawk",
            "chink",
            "cipa",
            "cl1t",
            "clit",
            "clitoris",
            "clits",
            "cnut",
            "cock",
            "cock-sucker",
            "cockface",
            "cockhead",
            "cockmunch",
            "cockmuncher",
            "cocks",
            "cocksuck",
            "cocksucked",
            "cocksucker",
            "cocksucking",
            "cocksucks",
            "cocksuka",
            "cocksukka",
            "cok",
            "cokmuncher",
            "coksucka",
            "coon",
            "cox",
            "crap",
            "cum",
            "cummer",
            "cumming",
            "cums",
            "cumshot",
            "cunilingus",
            "cunillingus",
            "cunnilingus",
            "cunt",
            "cuntlick",
            "cuntlicker",
            "cuntlicking",
            "cunts",
            "cyalis",
            "cyberfuc",
            "cyberfuck",
            "cyberfucked",
            "cyberfucker",
            "cyberfuckers",
            "cyberfucking",
            "d1ck",
            "damn",
            "dick",
            "dickhead",
            "dildo",
            "dildos",
            "dink",
            "dinks",
            "dirsa",
            "dlck",
            "dog-fucker",
            "doggin",
            "dogging",
            "donkeyribber",
            "doosh",
            "duche",
            "dyke",
            "ejaculate",
            "ejaculated",
            "ejaculates",
            "ejaculating",
            "ejaculatings",
            "ejaculation",
            "ejakulate",
            "f u c k",
            "f u c k e r",
            "f4nny",
            "fag",
            "fagging",
            "faggitt",
            "faggot",
            "faggs",
            "fagot",
            "fagots",
            "fags",
            "fanny",
            "fannyflaps",
            "fannyfucker",
            "fanyy",
            "fatass",
            "fcuk",
            "fcuker",
            "fcuking",
            "feck",
            "fecker",
            "felching",
            "fellate",
            "fellatio",
            "fingerfuck",
            "fingerfucked",
            "fingerfucker",
            "fingerfuckers",
            "fingerfucking",
            "fingerfucks",
            "fistfuck",
            "fistfucked",
            "fistfucker",
            "fistfuckers",
            "fistfucking",
            "fistfuckings",
            "fistfucks",
            "flange",
            "fook",
            "fooker",
            "fuck",
            "fucka",
            "fucked",
            "fucker",
            "fuckers",
            "fuckhead",
            "fuckheads",
            "fuckin",
            "fucking",
            "fuckings",
            "fuckingshitmotherfucker",
            "fuckme",
            "fucks",
            "fuckwhit",
            "fuckwit",
            "fudge packer",
            "fudgepacker",
            "fuk",
            "fuker",
            "fukker",
            "fukkin",
            "fuks",
            "fukwhit",
            "fukwit",
            "fux",
            "fux0r",
            "f_u_c_k",
            "gangbang",
            "gangbanged",
            "gangbangs",
            "gaylord",
            "gaysex",
            "goatse",
            "God",
            "god-dam",
            "god-damned",
            "goddamn",
            "goddamned",
            "hardcoresex",
            "hell",
            "heshe",
            "hoar",
            "hoare",
            "hoer",
            "homo",
            "hore",
            "horniest",
            "horny",
            "hotsex",
            "jack-off",
            "jackoff",
            "jap",
            "jerk-off",
            "jism",
            "jiz",
            "jizm",
            "jizz",
            "kawk",
            "knob",
            "knobead",
            "knobed",
            "knobend",
            "knobhead",
            "knobjocky",
            "knobjokey",
            "kock",
            "kondum",
            "kondums",
            "kum",
            "kummer",
            "kumming",
            "kums",
            "kunilingus",
            "l3i+ch",
            "l3itch",
            "labia",
            "lust",
            "lusting",
            "m0f0",
            "m0fo",
            "m45terbate",
            "ma5terb8",
            "ma5terbate",
            "masochist",
            "master-bate",
            "masterb8",
            "masterbat*",
            "masterbat3",
            "masterbate",
            "masterbation",
            "masterbations",
            "masturbate",
            "mo-fo",
            "mof0",
            "mofo",
            "mothafuck",
            "mothafucka",
            "mothafuckas",
            "mothafuckaz",
            "mothafucked",
            "mothafucker",
            "mothafuckers",
            "mothafuckin",
            "mothafucking",
            "mothafuckings",
            "mothafucks",
            "mother fucker",
            "motherfuck",
            "motherfucked",
            "motherfucker",
            "motherfuckers",
            "motherfuckin",
            "motherfucking",
            "motherfuckings",
            "motherfuckka",
            "motherfucks",
            "muff",
            "mutha",
            "muthafecker",
            "muthafuckker",
            "muther",
            "mutherfucker",
            "n1gga",
            "n1gger",
            "nazi",
            "nigg3r",
            "nigg4h",
            "nigga",
            "niggah",
            "niggas",
            "niggaz",
            "nigger",
            "niggers",
            "nob",
            "nob jokey",
            "nobhead",
            "nobjocky",
            "nobjokey",
            "numbnuts",
            "nutsack",
            "orgasim",
            "orgasims",
            "orgasm",
            "orgasms",
            "p0rn",
            "pawn",
            "pecker",
            "penis",
            "penisfucker",
            "phonesex",
            "phuck",
            "phuk",
            "phuked",
            "phuking",
            "phukked",
            "phukking",
            "phuks",
            "phuq",
            "pigfucker",
            "pimpis",
            "piss",
            "pissed",
            "pisser",
            "pissers",
            "pisses",
            "pissflaps",
            "pissin",
            "pissing",
            "pissoff",
            "poop",
            "porn",
            "porno",
            "pornography",
            "pornos",
            "prick",
            "pricks",
            "pron",
            "pube",
            "pusse",
            "pussi",
            "pussies",
            "pussy",
            "pussys",
            "rectum",
            "retard",
            "rimjaw",
            "rimming",
            "s hit",
            "s.o.b.",
            "sadist",
            "schlong",
            "screwing",
            "scroat",
            "scrote",
            "scrotum",
            "semen",
            "sex",
            "sh!+",
            "sh!t",
            "sh1t",
            "shag",
            "shagger",
            "shaggin",
            "shagging",
            "shemale",
            "shi+",
            "shit",
            "shitdick",
            "shite",
            "shited",
            "shitey",
            "shitfuck",
            "shitfull",
            "shithead",
            "shiting",
            "shitings",
            "shits",
            "shitted",
            "shitter",
            "shitters",
            "shitting",
            "shittings",
            "shitty",
            "skank",
            "slut",
            "sluts",
            "smegma",
            "smut",
            "snatch",
            "son-of-a-bitch",
            "spac",
            "spunk",
            "s_h_i_t",
            "t1tt1e5",
            "t1tties",
            "teets",
            "teez",
            "testical",
            "testicle",
            "tit",
            "titfuck",
            "tits",
            "titt",
            "tittie5",
            "tittiefucker",
            "titties",
            "tittyfuck",
            "tittywank",
            "titwank",
            "tosser",
            "turd",
            "tw4t",
            "twat",
            "twathead",
            "twatty",
            "twunt",
            "twunter",
            "v14gra",
            "v1gra",
            "vagina",
            "viagra",
            "vulva",
            "w00se",
            "wang",
            "wank",
            "wanker",
            "wanky",
            "whoar",
            "whore",
            "willies",
            "willy",
            "xrated",
            "xxx",
        ];
    },
    function(e, t) {
        e.exports =
            /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi;
    },
    function(e, t) {
        (e.exports.hats = [{
            id: 45,
            name: "Shame!",
            dontSell: !0,
            price: 0,
            scale: 120,
            desc: "hacks are for losers",
        },
                           {
                               id: 51,
                               name: "Moo Cap",
                               price: 0,
                               scale: 120,
                               desc: "coolest mooer around",
                           },
                           {
                               id: 50,
                               name: "Apple Cap",
                               price: 0,
                               scale: 120,
                               desc: "apple farms remembers",
                           },
                           {
                               id: 28,
                               name: "Moo Head",
                               price: 0,
                               scale: 120,
                               desc: "no effect"
                           },
                           {
                               id: 29,
                               name: "Pig Head",
                               price: 0,
                               scale: 120,
                               desc: "no effect"
                           },
                           {
                               id: 30,
                               name: "Fluff Head",
                               price: 0,
                               scale: 120,
                               desc: "no effect"
                           },
                           {
                               id: 36,
                               name: "Pandou Head",
                               price: 0,
                               scale: 120,
                               desc: "no effect"
                           },
                           {
                               id: 37,
                               name: "Bear Head",
                               price: 0,
                               scale: 120,
                               desc: "no effect"
                           },
                           {
                               id: 38,
                               name: "Monkey Head",
                               price: 0,
                               scale: 120,
                               desc: "no effect"
                           },
                           {
                               id: 44,
                               name: "Polar Head",
                               price: 0,
                               scale: 120,
                               desc: "no effect"
                           },
                           {
                               id: 35,
                               name: "Fez Hat",
                               price: 0,
                               scale: 120,
                               desc: "no effect"
                           },
                           {
                               id: 42,
                               name: "Enigma Hat",
                               price: 0,
                               scale: 120,
                               desc: "join the enigma army",
                           },
                           {
                               id: 43,
                               name: "Blitz Hat",
                               price: 0,
                               scale: 120,
                               desc: "hey everybody i'm blitz",
                           },
                           {
                               id: 49,
                               name: "Bob XIII Hat",
                               price: 0,
                               scale: 120,
                               desc: "like and subscribe",
                           },
                           {
                               id: 57,
                               name: "Pumpkin",
                               price: 50,
                               scale: 120,
                               desc: "Spooooky"
                           },
                           {
                               id: 8,
                               name: "Bummle Hat",
                               price: 100,
                               scale: 120,
                               desc: "no effect"
                           },
                           {
                               id: 2,
                               name: "Straw Hat",
                               price: 500,
                               scale: 120,
                               desc: "no effect"
                           },
                           {
                               id: 15,
                               name: "Winter Cap",
                               price: 600,
                               scale: 120,
                               desc: "allows you to move at normal speed in snow",
                               coldM: 1,
                           },
                           {
                               id: 5,
                               name: "Cowboy Hat",
                               price: 1e3,
                               scale: 120,
                               desc: "no effect"
                           },
                           {
                               id: 4,
                               name: "Ranger Hat",
                               price: 2e3,
                               scale: 120,
                               desc: "no effect"
                           },
                           {
                               id: 18,
                               name: "Explorer Hat",
                               price: 2e3,
                               scale: 120,
                               desc: "no effect",
                           },
                           {
                               id: 31,
                               name: "Flipper Hat",
                               price: 2500,
                               scale: 120,
                               desc: "have more control while in water",
                               watrImm: !0,
                           },
                           {
                               id: 1,
                               name: "Marksman Cap",
                               price: 3e3,
                               scale: 120,
                               desc: "increases arrow speed and range",
                               aMlt: 1.3,
                           },
                           {
                               id: 10,
                               name: "Bush Gear",
                               price: 3e3,
                               scale: 160,
                               desc: "allows you to disguise yourself as a bush",
                           },
                           {
                               id: 48,
                               name: "Halo",
                               price: 3e3,
                               scale: 120,
                               desc: "no effect"
                           },
                           {
                               id: 6,
                               name: "Soldier Helmet",
                               price: 4e3,
                               scale: 120,
                               desc: "reduces damage taken but slows movement",
                               spdMult: 0.94,
                               dmgMult: 0.75,
                           },
                           {
                               id: 23,
                               name: "Anti Venom Gear",
                               price: 4e3,
                               scale: 120,
                               desc: "makes you immune to poison",
                               poisonRes: 1,
                           },
                           {
                               id: 13,
                               name: "Medic Gear",
                               price: 5e3,
                               scale: 110,
                               desc: "slowly regenerates health over time",
                               healthRegen: 3,
                           },
                           {
                               id: 9,
                               name: "Miners Helmet",
                               price: 5e3,
                               scale: 120,
                               desc: "earn 1 extra gold per resource",
                               extraGold: 1,
                           },
                           {
                               id: 32,
                               name: "Musketeer Hat",
                               price: 5e3,
                               scale: 120,
                               desc: "reduces cost of projectiles",
                               projCost: 0.5,
                           },
                           {
                               id: 7,
                               name: "Bull Helmet",
                               price: 6e3,
                               scale: 120,
                               desc: "increases damage done but drains health",
                               healthRegen: -5,
                               dmgMultO: 1.5,
                               spdMult: 0.96,
                           },
                           {
                               id: 22,
                               name: "Emp Helmet",
                               price: 6e3,
                               scale: 120,
                               desc: "turrets won't attack but you move slower",
                               antiTurret: 1,
                               spdMult: 0.7,
                           },
                           {
                               id: 12,
                               name: "Booster Hat",
                               price: 6e3,
                               scale: 120,
                               desc: "increases your movement speed",
                               spdMult: 1.16,
                           },
                           {
                               id: 26,
                               name: "Barbarian Armor",
                               price: 8e3,
                               scale: 120,
                               desc: "knocks back enemies that attack you",
                               dmgK: 0.6,
                           },
                           {
                               id: 21,
                               name: "Plague Mask",
                               price: 1e4,
                               scale: 120,
                               desc: "melee attacks deal poison damage",
                               poisonDmg: 5,
                               poisonTime: 6,
                           },
                           {
                               id: 46,
                               name: "Bull Mask",
                               price: 1e4,
                               scale: 120,
                               desc: "bulls won't target you unless you attack them",
                               bullRepel: 1,
                           },
                           {
                               id: 14,
                               name: "Windmill Hat",
                               topSprite: !0,
                               price: 1e4,
                               scale: 120,
                               desc: "generates points while worn",
                               pps: 1.5,
                           },
                           {
                               id: 11,
                               name: "Spike Gear",
                               topSprite: !0,
                               price: 1e4,
                               scale: 120,
                               desc: "deal damage to players that damage you",
                               dmg: 0.45,
                           },
                           {
                               id: 53,
                               name: "Turret Gear",
                               topSprite: !0,
                               price: 1e4,
                               scale: 120,
                               desc: "you become a walking turret",
                               turret: {
                                   proj: 1,
                                   range: 700,
                                   rate: 2500
                               },
                               spdMult: 0.7,
                           },
                           {
                               id: 20,
                               name: "Samurai Armor",
                               price: 12e3,
                               scale: 120,
                               desc: "increased attack speed and fire rate",
                               atkSpd: 0.78,
                           },
                           {
                               id: 58,
                               name: "Dark Knight",
                               price: 12e3,
                               scale: 120,
                               desc: "restores health when you deal damage",
                               healD: 0.4,
                           },
                           {
                               id: 27,
                               name: "Scavenger Gear",
                               price: 15e3,
                               scale: 120,
                               desc: "earn double points for each kill",
                               kScrM: 2,
                           },
                           {
                               id: 40,
                               name: "Tank Gear",
                               price: 15e3,
                               scale: 120,
                               desc: "increased damage to buildings but slower movement",
                               spdMult: 0.3,
                               bDmg: 3.3,
                           },
                           {
                               id: 52,
                               name: "Thief Gear",
                               price: 15e3,
                               scale: 120,
                               desc: "steal half of a players gold when you kill them",
                               goldSteal: 0.5,
                           },
                           {
                               id: 55,
                               name: "Bloodthirster",
                               price: 2e4,
                               scale: 120,
                               desc: "Restore Health when dealing damage. And increased damage",
                               healD: 0.25,
                               dmgMultO: 1.2,
                           },
                           {
                               id: 56,
                               name: "Assassin Gear",
                               price: 2e4,
                               scale: 120,
                               desc: "Go invisible when not moving. Can't eat. Increased speed",
                               noEat: !0,
                               spdMult: 1.1,
                               invisTimer: 1e3,
                           },
                          ]),
            (e.exports.accessories = [{
                id: 12,
                name: "Snowball",
                price: 1e3,
                scale: 105,
                xOff: 18,
                desc: "no effect",
            },
                                      {
                                          id: 9,
                                          name: "Tree Cape",
                                          price: 1e3,
                                          scale: 90,
                                          desc: "no effect"
                                      },
                                      {
                                          id: 10,
                                          name: "Stone Cape",
                                          price: 1e3,
                                          scale: 90,
                                          desc: "no effect",
                                      },
                                      {
                                          id: 3,
                                          name: "Cookie Cape",
                                          price: 1500,
                                          scale: 90,
                                          desc: "no effect",
                                      },
                                      {
                                          id: 8,
                                          name: "Cow Cape",
                                          price: 2e3,
                                          scale: 90,
                                          desc: "no effect"
                                      },
                                      {
                                          id: 11,
                                          name: "Monkey Tail",
                                          price: 2e3,
                                          scale: 97,
                                          xOff: 25,
                                          desc: "Super speed but reduced damage",
                                          spdMult: 1.35,
                                          dmgMultO: 0.2,
                                      },
                                      {
                                          id: 17,
                                          name: "Apple Basket",
                                          price: 3e3,
                                          scale: 80,
                                          xOff: 12,
                                          desc: "slowly regenerates health over time",
                                          healthRegen: 1,
                                      },
                                      {
                                          id: 6,
                                          name: "Winter Cape",
                                          price: 3e3,
                                          scale: 90,
                                          desc: "no effect",
                                      },
                                      {
                                          id: 4,
                                          name: "Skull Cape",
                                          price: 4e3,
                                          scale: 90,
                                          desc: "no effect"
                                      },
                                      {
                                          id: 5,
                                          name: "Dash Cape",
                                          price: 5e3,
                                          scale: 90,
                                          desc: "no effect"
                                      },
                                      {
                                          id: 2,
                                          name: "Dragon Cape",
                                          price: 6e3,
                                          scale: 90,
                                          desc: "no effect",
                                      },
                                      {
                                          id: 1,
                                          name: "Super Cape",
                                          price: 8e3,
                                          scale: 90,
                                          desc: "no effect"
                                      },
                                      {
                                          id: 7,
                                          name: "Troll Cape",
                                          price: 8e3,
                                          scale: 90,
                                          desc: "no effect"
                                      },
                                      {
                                          id: 14,
                                          name: "Thorns",
                                          price: 1e4,
                                          scale: 115,
                                          xOff: 20,
                                          desc: "no effect",
                                      },
                                      {
                                          id: 15,
                                          name: "Blockades",
                                          price: 1e4,
                                          scale: 95,
                                          xOff: 15,
                                          desc: "no effect",
                                      },
                                      {
                                          id: 20,
                                          name: "Devils Tail",
                                          price: 1e4,
                                          scale: 95,
                                          xOff: 20,
                                          desc: "no effect",
                                      },
                                      {
                                          id: 16,
                                          name: "Sawblade",
                                          price: 12e3,
                                          scale: 90,
                                          spin: !0,
                                          xOff: 0,
                                          desc: "deal damage to players that damage you",
                                          dmg: 0.15,
                                      },
                                      {
                                          id: 13,
                                          name: "Angel Wings",
                                          price: 15e3,
                                          scale: 138,
                                          xOff: 22,
                                          desc: "slowly regenerates health over time",
                                          healthRegen: 3,
                                      },
                                      {
                                          id: 19,
                                          name: "Shadow Wings",
                                          price: 15e3,
                                          scale: 138,
                                          xOff: 22,
                                          desc: "increased movement speed",
                                          spdMult: 1.1,
                                      },
                                      {
                                          id: 18,
                                          name: "Blood Wings",
                                          price: 2e4,
                                          scale: 178,
                                          xOff: 26,
                                          desc: "restores health when you deal damage",
                                          healD: 0.2,
                                      },
                                      {
                                          id: 21,
                                          name: "Corrupt X Wings",
                                          price: 2e4,
                                          scale: 178,
                                          xOff: 26,
                                          desc: "deal damage to players that damage you",
                                          dmg: 0.25,
                                      },
                                     ]);
    },
    function(e, t) {
        e.exports = function(e, t, n, i, r, s, a) {
            this.init = function(e, t, n, i, r, s, o, c, l) {
                (this.active = !0),
                    (this.indx = e),
                    (this.x = t),
                    (this.y = n),
                    (this.dir = i),
                    (this.skipMov = !0),
                    (this.speed = r),
                    (this.dmg = s),
                    (this.scale = c),
                    (this.range = o),
                    (this.owner = l),
                    a && (this.sentTo = {});
            };
            var o,
                c = [];
            this.update = function(l) {
                if (this.active) {
                    var h,
                        u = this.speed * l;
                    if (
                        (this.skipMov ?
                         (this.skipMov = !1) :
                         ((this.x += u * Math.cos(this.dir)),
                          (this.y += u * Math.sin(this.dir)),
                          (this.range -= u),
                          this.range <= 0 &&
                          ((this.x += this.range * Math.cos(this.dir)),
                           (this.y += this.range * Math.sin(this.dir)),
                           (u = 1),
                           (this.range = 0),
                           (this.active = !1))),
                         a)
                    ) {
                        for (var f = 0; f < e.length; ++f)
                            !this.sentTo[e[f].id] &&
                                e[f].canSee(this) &&
                                ((this.sentTo[e[f].id] = 1),
                                 a.send(
                                e[f].id,
                                "18",
                                s.fixTo(this.x, 1),
                                s.fixTo(this.y, 1),
                                s.fixTo(this.dir, 2),
                                s.fixTo(this.range, 1),
                                this.speed,
                                this.indx,
                                this.layer,
                                this.sid,
                            ));
                        for (c.length = 0, f = 0; f < e.length + t.length; ++f)
                            !(o = e[f] || t[f - e.length]).alive ||
                                o == this.owner ||
                                (this.owner.team && o.team == this.owner.team) ||
                                (s.lineInRect(
                                o.x - o.scale,
                                o.y - o.scale,
                                o.x + o.scale,
                                o.y + o.scale,
                                this.x,
                                this.y,
                                this.x + u * Math.cos(this.dir),
                                this.y + u * Math.sin(this.dir),
                            ) &&
                                 c.push(o));
                        for (
                            var d = n.getGridArrays(this.x, this.y, this.scale), p = 0; p < d.length;
                            ++p
                        )
                            for (var g = 0; g < d[p].length; ++g)
                                (h = (o = d[p][g]).getScale()),
                                    o.active &&
                                    this.ignoreObj != o.sid &&
                                    this.layer <= o.layer &&
                                    c.indexOf(o) < 0 &&
                                    !o.ignoreCollision &&
                                    s.lineInRect(
                                    o.x - h,
                                    o.y - h,
                                    o.x + h,
                                    o.y + h,
                                    this.x,
                                    this.y,
                                    this.x + u * Math.cos(this.dir),
                                    this.y + u * Math.sin(this.dir),
                                ) &&
                                    c.push(o);
                        if (c.length > 0) {
                            var m = null,
                                y = null,
                                k = null;
                            for (f = 0; f < c.length; ++f)
                                (k = s.getDistance(this.x, this.y, c[f].x, c[f].y)),
                                    (null == y || k < y) && ((y = k), (m = c[f]));
                            if (m.isPlayer || m.isAI) {
                                var v = 0.3 * (m.weightM || 1);
                                (m.xVel += v * Math.cos(this.dir)),
                                    (m.yVel += v * Math.sin(this.dir)),
                                    (null != m.weaponIndex &&
                                     i.weapons[m.weaponIndex].shield &&
                                     s.getAngleDist(this.dir + Math.PI, m.dir) <=
                                     r.shieldAngle) ||
                                    m.changeHealth(-this.dmg, this.owner, this.owner);
                            } else
                                for (
                                    m.projDmg &&
                                    m.health &&
                                    m.changeHealth(-this.dmg) &&
                                    n.disableObj(m),
                                    f = 0; f < e.length;
                                    ++f
                                )
                                    e[f].active &&
                                        (m.sentTo[e[f].id] &&
                                         (m.active ?
                                          e[f].canSee(m) &&
                                          a.send(e[f].id, "8", s.fixTo(this.dir, 2), m.sid) :
                                          a.send(e[f].id, "12", m.sid)),
                                         m.active ||
                                         m.owner != e[f] ||
                                         e[f].changeItemCount(m.group.id, -1));
                            for (this.active = !1, f = 0; f < e.length; ++f)
                                this.sentTo[e[f].id] &&
                                    a.send(e[f].id, "19", this.sid, s.fixTo(y, 1));
                        }
                    }
                }
            };
        };
    },
    function(e, t) {
        e.exports = function(e, t, n, i, r, s, a, o, c) {
            this.addProjectile = function(l, h, u, f, d, p, g, m, y) {
                for (var k, v = s.projectiles[p], w = 0; w < t.length; ++w)
                    if (!t[w].active) {
                        k = t[w];
                        break;
                    }
                return (
                    k || (((k = new e(n, i, r, s, a, o, c)).sid = t.length), t.push(k)),
                    k.init(p, l, h, u, d, v.dmg, f, v.scale, g),
                    (k.ignoreObj = m),
                    (k.layer = y || v.layer),
                    (k.src = v.src),
                    k
                );
            };
        };
    },
    function(e, t) {
        e.exports.obj = function(e, t) {
            var n;
            (this.sounds = []),
                (this.active = !0),
                (this.play = function(t, i, r) {
                i &&
                    this.active &&
                    ((n = this.sounds[t]) ||
                     ((n = new Howl({
                    src: ".././sound/" + t + ".mp3"
                })),
                      (this.sounds[t] = n)),
                     (r && n.isPlaying) ||
                     ((n.isPlaying = !0),
                      n.play(),
                      n.volume((i || 1) * e.volumeMult),
                      n.loop(r)));
            }),
                (this.toggleMute = function(e, t) {
                (n = this.sounds[e]) && n.mute(t);
            }),
                (this.stop = function(e) {
                (n = this.sounds[e]) && (n.stop(), (n.isPlaying = !1));
            });
        };
    },
    function(e, t, n) {
        var i = n(60),
            r = n(67);

        function s(e, t, n, i, r) {
            "localhost" == location.hostname &&
                (window.location.hostname = "127.0.0.1"),
                (this.debugLog = !1),
                (this.baseUrl = e),
                (this.lobbySize = n),
                (this.devPort = t),
                (this.lobbySpread = i),
                (this.rawIPs = !!r),
                (this.server = void 0),
                (this.gameIndex = void 0),
                (this.callback = void 0),
                (this.errorCallback = void 0),
                this.processServers(vultr.servers);
        }
        (s.prototype.regionInfo = {
            0: {
                name: "Local",
                latitude: 0,
                longitude: 0
            },
            "vultr:1": {
                name: "New Jersey",
                latitude: 40.1393329,
                longitude: -75.8521818,
            },
            "vultr:2": {
                name: "Chicago",
                latitude: 41.8339037,
                longitude: -87.872238,
            },
            "vultr:3": {
                name: "Dallas",
                latitude: 32.8208751,
                longitude: -96.8714229,
            },
            "vultr:4": {
                name: "Seattle",
                latitude: 47.6149942,
                longitude: -122.4759879,
            },
            "vultr:5": {
                name: "Los Angeles",
                latitude: 34.0207504,
                longitude: -118.691914,
            },
            "vultr:6": {
                name: "Atlanta",
                latitude: 33.7676334,
                longitude: -84.5610332,
            },
            "vultr:7": {
                name: "Amsterdam",
                latitude: 52.3745287,
                longitude: 4.7581878,
            },
            "vultr:8": {
                name: "London",
                latitude: 51.5283063,
                longitude: -0.382486
            },
            "vultr:9": {
                name: "Frankfurt",
                latitude: 50.1211273,
                longitude: 8.496137,
            },
            "vultr:12": {
                name: "Silicon Valley",
                latitude: 37.4024714,
                longitude: -122.3219752,
            },
            "vultr:19": {
                name: "Sydney",
                latitude: -33.8479715,
                longitude: 150.651084,
            },
            "vultr:24": {
                name: "Paris",
                latitude: 48.8588376,
                longitude: 2.2773454
            },
            "vultr:25": {
                name: "Tokyo",
                latitude: 35.6732615,
                longitude: 139.569959,
            },
            "vultr:39": {
                name: "Miami",
                latitude: 25.7823071,
                longitude: -80.3012156,
            },
            "vultr:40": {
                name: "Singapore",
                latitude: 1.3147268,
                longitude: 103.7065876,
            },
        }),
            (s.prototype.start = function(e, t) {
            (this.callback = e), (this.errorCallback = t);
            var n = this.parseServerQuery();
            n
                ?
                (this.log("Found server in query."),
                 (this.password = n[3]),
                 this.connect(n[0], n[1], n[2])) :
            (this.log("Pinging servers..."), this.pingServers());
        }),
            (s.prototype.parseServerQuery = function() {
            var e = i.parse(location.href, !0),
                t = e.query.server;
            if ("string" == typeof t) {
                var n = t.split(":");
                if (3 == n.length) {
                    var r = n[0],
                        s = parseInt(n[1]),
                        a = parseInt(n[2]);
                    return (
                        "0" == r || r.startsWith("vultr:") || (r = "vultr:" + r),
                        [r, s, a, e.query.password]
                    );
                }
                this.errorCallback("Invalid number of server parameters in " + t);
            }
        }),
            (s.prototype.findServer = function(e, t) {
            var n = this.servers[e];
            if (Array.isArray(n)) {
                for (var i = 0; i < n.length; i++) {
                    var r = n[i];
                    if (r.index == t) return r;
                }
                console.warn(
                    "Could not find server in region " + e + " with index " + t + ".",
                );
            } else this.errorCallback("No server list for region " + e);
        }),
            (s.prototype.pingServers = function() {
            var e = this,
                t = [];
            for (var n in this.servers)
                if (this.servers.hasOwnProperty(n)) {
                    var i = this.servers[n],
                        r = i[Math.floor(Math.random() * i.length)];
                    null != r ?
                        (function(i, r) {
                        var s = new XMLHttpRequest();
                        s.onreadystatechange = function(i) {
                            var s = i.target;
                            if (4 == s.readyState)
                                if (200 == s.status) {
                                    for (var a = 0; a < t.length; a++) t[a].abort();
                                    e.log("Connecting to region", r.region);
                                    var o = e.seekServer(r.region);
                                    e.connect(o[0], o[1], o[2]);
                                } else
                                    console.warn(
                                        "Error pinging " + r.ip + " in region " + n,
                                    );
                        };
                        var a =
                            "//" +
                            e.serverAddress(r.ip, !0) +
                            ":" +
                            e.serverPort(r) +
                            "/ping";
                        s.open("GET", a, !0),
                            s.send(null),
                            e.log("Pinging", a),
                            t.push(s);
                    })(0, r) :
                    console.log("No target server for region " + n);
                }
        }),
            (s.prototype.seekServer = function(e, t, n) {
            null == n && (n = "random"), null == t && (t = !1);
            const i = ["random"];
            var r = this.lobbySize,
                s = this.lobbySpread,
                a = this.servers[e]
            .flatMap(function(e) {
                var t = 0;
                return e.games.map(function(n) {
                    var i = t++;
                    return {
                        region: e.region,
                        index: e.index * e.games.length + i,
                        gameIndex: i,
                        gameCount: e.games.length,
                        playerCount: n.playerCount,
                        isPrivate: n.isPrivate,
                    };
                });
            })
            .filter(function(e) {
                return !e.isPrivate;
            })
            .filter(function(e) {
                return (
                    !t || (0 == e.playerCount && e.gameIndex >= e.gameCount / 2)
                );
            })
            .filter(function(e) {
                return "random" == n || i[e.index % i.length].key == n;
            })
            .sort(function(e, t) {
                return t.playerCount - e.playerCount;
            })
            .filter(function(e) {
                return e.playerCount < r;
            });
            if ((t && a.reverse(), 0 != a.length)) {
                var o = Math.min(s, a.length),
                    c = Math.floor(Math.random() * o),
                    l = a[(c = Math.min(c, a.length - 1))],
                    h = l.region,
                    u =
                    ((c = Math.floor(l.index / l.gameCount)), l.index % l.gameCount);
                return this.log("Found server."), [h, c, u];
            }
            this.errorCallback("No open servers.");
        }),
            (s.prototype.connect = function(e, t, n) {
            if (!this.connected) {
                var i = this.findServer(e, t);
                null != i ?
                    (this.log("Connecting to server", i, "with game index", n),
                     i.games[n].playerCount >= this.lobbySize ?
                     this.errorCallback("Server is already full.") :
                     (window.history.replaceState(
                    document.title,
                    document.title,
                    this.generateHref(e, t, n, this.password),
                ),
                      (this.server = i),
                      (this.gameIndex = n),
                      this.log(
                    "Calling callback with address",
                    this.serverAddress(i.ip),
                    "on port",
                    this.serverPort(i),
                    "with game index",
                    n,
                ),
                      this.callback(
                    this.serverAddress(i.ip),
                    this.serverPort(i),
                    n,
                ))) :
                this.errorCallback(
                    "Failed to find server for region " + e + " and index " + t,
                );
            }
        }),
            (s.prototype.switchServer = function(e, t, n, i) {
            (this.switchingServers = !0),
                (window.location.href = this.generateHref(e, t, n, i));
        }),
            (s.prototype.generateHref = function(e, t, n, i) {
            var r = "/?server=" + (e = this.stripRegion(e)) + ":" + t + ":" + n;
            return i && (r += "&password=" + encodeURIComponent(i)), r;
        }),
            (s.prototype.serverAddress = function(e, t) {
            return "127.0.0.1" == e ||
                "7f000001" == e ||
                "903d62ef5d1c2fecdcaeb5e7dd485eff" == e ?
                window.location.hostname :
            this.rawIPs ?
                t ?
                "ip_" + this.hashIP(e) + "." + this.baseUrl :
            e :
            "ip_" + e + "." + this.baseUrl;
        }),
            (s.prototype.serverPort = function(e) {
            return 0 == e.region ?
                this.devPort :
            location.protocol.startsWith("https") ?
                443 :
            80;
        }),
            (s.prototype.processServers = function(e) {
            for (var t = {}, n = 0; n < e.length; n++) {
                var i = e[n],
                    r = t[i.region];
                null == r && ((r = []), (t[i.region] = r)), r.push(i);
            }
            for (var s in t)
                t[s] = t[s].sort(function(e, t) {
                    return e.index - t.index;
                });
            this.servers = t;
        }),
            (s.prototype.ipToHex = function(e) {
            return e
                .split(".")
                .map((e) => ("00" + parseInt(e).toString(16)).substr(-2))
                .join("")
                .toLowerCase();
        }),
            (s.prototype.hashIP = function(e) {
            return r(this.ipToHex(e));
        }),
            (s.prototype.log = function() {
            return this.debugLog ?
                console.log.apply(void 0, arguments) :
            console.verbose ?
                console.verbose.apply(void 0, arguments) :
            void 0;
        }),
            (s.prototype.stripRegion = function(e) {
            return (
                e.startsWith("vultr:") ?
                (e = e.slice(6)) :
                e.startsWith("do:") && (e = e.slice(3)),
                e
            );
        }),
            (window.testVultrClient = function() {
            var e = 1;

            function t(t, n) {
                (t = "" + t) == (n = "" + n) ?
                    console.log(`Assert ${e} passed.`): console.warn(`Assert ${e} failed. Expected ${n}, got ${t}.`),
                    e++;
            }
            var n = new s("test.io", -1, 5, 1, !1);
            (n.errorCallback = function(e) {}),
                n.processServers(
                (function(e) {
                    var t = [];
                    for (var n in e)
                        for (var i = e[n], r = 0; r < i.length; r++)
                            t.push({
                                ip: n + ":" + r,
                                scheme: "testing",
                                region: n,
                                index: r,
                                games: i[r].map((e) => ({
                                    playerCount: e,
                                    isPrivate: !1
                                })),
                            });
                    return t;
                })({
                    1: [
                        [0, 0, 0, 0],
                        [0, 0, 0, 0],
                    ],
                    2: [
                        [5, 1, 0, 0],
                        [0, 0, 0, 0],
                    ],
                    3: [
                        [5, 0, 1, 5],
                        [0, 0, 0, 0],
                    ],
                    4: [
                        [5, 1, 1, 5],
                        [1, 0, 0, 0],
                    ],
                    5: [
                        [5, 1, 1, 5],
                        [1, 0, 4, 0],
                    ],
                    6: [
                        [5, 5, 5, 5],
                        [2, 3, 1, 4],
                    ],
                    7: [
                        [5, 5, 5, 5],
                        [5, 5, 5, 5],
                    ],
                }),
            ),
                t(n.seekServer(1, !1), [1, 0, 0]),
                t(n.seekServer(1, !0), [1, 1, 3]),
                t(n.seekServer(2, !1), [2, 0, 1]),
                t(n.seekServer(2, !0), [2, 1, 3]),
                t(n.seekServer(3, !1), [3, 0, 2]),
                t(n.seekServer(3, !0), [3, 1, 3]),
                t(n.seekServer(4, !1), [4, 0, 1]),
                t(n.seekServer(4, !0), [4, 1, 3]),
                t(n.seekServer(5, !1), [5, 1, 2]),
                t(n.seekServer(5, !0), [5, 1, 3]),
                t(n.seekServer(6, !1), [6, 1, 3]),
                t(n.seekServer(6, !0), void 0),
                t(n.seekServer(7, !1), void 0),
                t(n.seekServer(7, !0), void 0),
                console.log("Tests passed.");
        });
        var a = function(e, t) {
            return e.concat(t);
        };
        (Array.prototype.flatMap = function(e) {
            return (function(e, t) {
                return t.map(e).reduce(a, []);
            })(e, this);
        }),
            (e.exports = s);
    },
    function(e, t, n) {
        "use strict";
        var i = n(61),
            r = n(63);

        function s() {
            (this.protocol = null),
                (this.slashes = null),
                (this.auth = null),
                (this.host = null),
                (this.port = null),
                (this.hostname = null),
                (this.hash = null),
                (this.search = null),
                (this.query = null),
                (this.pathname = null),
                (this.path = null),
                (this.href = null);
        }
        (t.parse = v),
            (t.resolve = function(e, t) {
            return v(e, !1, !0).resolve(t);
        }),
            (t.resolveObject = function(e, t) {
            return e ? v(e, !1, !0).resolveObject(t) : t;
        }),
            (t.format = function(e) {
            return (
                r.isString(e) && (e = v(e)),
                e instanceof s ? e.format() : s.prototype.format.call(e)
            );
        }),
            (t.Url = s);
        var a = /^([a-z0-9.+-]+:)/i,
            o = /:[0-9]*$/,
            c = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
            l = ["{", "}", "|", "\\", "^", "`"].concat([
                "<",
                ">",
                '"',
                "`",
                " ",
                "\r",
                "\n",
                "\t",
            ]),
            h = ["'"].concat(l),
            u = ["%", "/", "?", ";", "#"].concat(h),
            f = ["/", "?", "#"],
            d = /^[+a-z0-9A-Z_-]{0,63}$/,
            p = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
            g = {
                javascript: !0,
                "javascript:": !0
            },
            m = {
                javascript: !0,
                "javascript:": !0
            },
            y = {
                http: !0,
                https: !0,
                ftp: !0,
                gopher: !0,
                file: !0,
                "http:": !0,
                "https:": !0,
                "ftp:": !0,
                "gopher:": !0,
                "file:": !0,
            },
            k = n(64);

        function v(e, t, n) {
            if (e && r.isObject(e) && e instanceof s) return e;
            var i = new s();
            return i.parse(e, t, n), i;
        }
        (s.prototype.parse = function(e, t, n) {
            if (!r.isString(e))
                throw new TypeError(
                    "Parameter 'url' must be a string, not " + typeof e,
                );
            var s = e.indexOf("?"),
                o = -1 !== s && s < e.indexOf("#") ? "?" : "#",
                l = e.split(o);
            l[0] = l[0].replace(/\\/g, "/");
            var v = (e = l.join(o));
            if (((v = v.trim()), !n && 1 === e.split("#").length)) {
                var w = c.exec(v);
                if (w)
                    return (
                        (this.path = v),
                        (this.href = v),
                        (this.pathname = w[1]),
                        w[2] ?
                        ((this.search = w[2]),
                         (this.query = t ?
                          k.parse(this.search.substr(1)) :
                          this.search.substr(1))) :
                        t && ((this.search = ""), (this.query = {})),
                        this
                    );
            }
            var b = a.exec(v);
            if (b) {
                var x = (b = b[0]).toLowerCase();
                (this.protocol = x), (v = v.substr(b.length));
            }
            if (n || b || v.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                var S = "//" === v.substr(0, 2);
                !S || (b && m[b]) || ((v = v.substr(2)), (this.slashes = !0));
            }
            if (!m[b] && (S || (b && !y[b]))) {
                for (var T, I, E = -1, M = 0; M < f.length; M++)
                    -
                        1 !== (A = v.indexOf(f[M])) && (-1 === E || A < E) && (E = A);
                for (
                    -1 !== (I = -1 === E ? v.lastIndexOf("@") : v.lastIndexOf("@", E)) &&
                    ((T = v.slice(0, I)),
                     (v = v.slice(I + 1)),
                     (this.auth = decodeURIComponent(T))),
                    E = -1,
                    M = 0; M < u.length; M++
                ) {
                    var A; -
                        1 !== (A = v.indexOf(u[M])) && (-1 === E || A < E) && (E = A);
                } -
                    1 === E && (E = v.length),
                    (this.host = v.slice(0, E)),
                    (v = v.slice(E)),
                    this.parseHost(),
                    (this.hostname = this.hostname || "");
                var P =
                    "[" === this.hostname[0] &&
                    "]" === this.hostname[this.hostname.length - 1];
                if (!P)
                    for (
                        var B = this.hostname.split(/\./), C = ((M = 0), B.length); M < C; M++
                    ) {
                        var O = B[M];
                        if (O && !O.match(d)) {
                            for (var R = "", j = 0, _ = O.length; j < _; j++)
                                O.charCodeAt(j) > 127 ? (R += "x") : (R += O[j]);
                            if (!R.match(d)) {
                                var U = B.slice(0, M),
                                    D = B.slice(M + 1),
                                    L = O.match(p);
                                L && (U.push(L[1]), D.unshift(L[2])),
                                    D.length && (v = "/" + D.join(".") + v),
                                    (this.hostname = U.join("."));
                                break;
                            }
                        }
                    }
                this.hostname.length > 255 ?
                    (this.hostname = "") :
                (this.hostname = this.hostname.toLowerCase()),
                    P || (this.hostname = i.toASCII(this.hostname));
                var F = this.port ? ":" + this.port : "",
                    z = this.hostname || "";
                (this.host = z + F),
                    (this.href += this.host),
                    P &&
                    ((this.hostname = this.hostname.substr(
                    1,
                    this.hostname.length - 2,
                )),
                     "/" !== v[0] && (v = "/" + v));
            }
            if (!g[x])
                for (M = 0, C = h.length; M < C; M++) {
                    var H = h[M];
                    if (-1 !== v.indexOf(H)) {
                        var V = encodeURIComponent(H);
                        V === H && (V = escape(H)), (v = v.split(H).join(V));
                    }
                }
            var q = v.indexOf("#"); -
                1 !== q && ((this.hash = v.substr(q)), (v = v.slice(0, q)));
            var Y = v.indexOf("?");
            if (
                (-1 !== Y ?
                 ((this.search = v.substr(Y)),
                  (this.query = v.substr(Y + 1)),
                  t && (this.query = k.parse(this.query)),
                  (v = v.slice(0, Y))) :
                 t && ((this.search = ""), (this.query = {})),
                 v && (this.pathname = v),
                 y[x] && this.hostname && !this.pathname && (this.pathname = "/"),
                 this.pathname || this.search)
            ) {
                F = this.pathname || "";
                var W = this.search || "";
                this.path = F + W;
            }
            return (this.href = this.format()), this;
        }),
            (s.prototype.format = function() {
            var e = this.auth || "";
            e &&
                ((e = (e = encodeURIComponent(e)).replace(/%3A/i, ":")), (e += "@"));
            var t = this.protocol || "",
                n = this.pathname || "",
                i = this.hash || "",
                s = !1,
                a = "";
            this.host ?
                (s = e + this.host) :
            this.hostname &&
                ((s =
                  e +
                  (-1 === this.hostname.indexOf(":") ?
                   this.hostname :
                   "[" + this.hostname + "]")),
                 this.port && (s += ":" + this.port)),
                this.query &&
                r.isObject(this.query) &&
                Object.keys(this.query).length &&
                (a = k.stringify(this.query));
            var o = this.search || (a && "?" + a) || "";
            return (
                t && ":" !== t.substr(-1) && (t += ":"),
                this.slashes || ((!t || y[t]) && !1 !== s) ?
                ((s = "//" + (s || "")),
                 n && "/" !== n.charAt(0) && (n = "/" + n)) :
                s || (s = ""),
                i && "#" !== i.charAt(0) && (i = "#" + i),
                o && "?" !== o.charAt(0) && (o = "?" + o),
                t +
                s +
                (n = n.replace(/[?#]/g, function(e) {
                    return encodeURIComponent(e);
                })) +
                (o = o.replace("#", "%23")) +
                i
            );
        }),
            (s.prototype.resolve = function(e) {
            return this.resolveObject(v(e, !1, !0)).format();
        }),
            (s.prototype.resolveObject = function(e) {
            if (r.isString(e)) {
                var t = new s();
                t.parse(e, !1, !0), (e = t);
            }
            for (var n = new s(), i = Object.keys(this), a = 0; a < i.length; a++) {
                var o = i[a];
                n[o] = this[o];
            }
            if (((n.hash = e.hash), "" === e.href)) return (n.href = n.format()), n;
            if (e.slashes && !e.protocol) {
                for (var c = Object.keys(e), l = 0; l < c.length; l++) {
                    var h = c[l];
                    "protocol" !== h && (n[h] = e[h]);
                }
                return (
                    y[n.protocol] &&
                    n.hostname &&
                    !n.pathname &&
                    (n.path = n.pathname = "/"),
                    (n.href = n.format()),
                    n
                );
            }
            if (e.protocol && e.protocol !== n.protocol) {
                if (!y[e.protocol]) {
                    for (var u = Object.keys(e), f = 0; f < u.length; f++) {
                        var d = u[f];
                        n[d] = e[d];
                    }
                    return (n.href = n.format()), n;
                }
                if (((n.protocol = e.protocol), e.host || m[e.protocol]))
                    n.pathname = e.pathname;
                else {
                    for (
                        var p = (e.pathname || "").split("/"); p.length && !(e.host = p.shift());

                    );
                    e.host || (e.host = ""),
                        e.hostname || (e.hostname = ""),
                        "" !== p[0] && p.unshift(""),
                        p.length < 2 && p.unshift(""),
                        (n.pathname = p.join("/"));
                }
                if (
                    ((n.search = e.search),
                     (n.query = e.query),
                     (n.host = e.host || ""),
                     (n.auth = e.auth),
                     (n.hostname = e.hostname || e.host),
                     (n.port = e.port),
                     n.pathname || n.search)
                ) {
                    var g = n.pathname || "",
                        k = n.search || "";
                    n.path = g + k;
                }
                return (n.slashes = n.slashes || e.slashes), (n.href = n.format()), n;
            }
            var v = n.pathname && "/" === n.pathname.charAt(0),
                w = e.host || (e.pathname && "/" === e.pathname.charAt(0)),
                b = w || v || (n.host && e.pathname),
                x = b,
                S = (n.pathname && n.pathname.split("/")) || [],
                T =
                ((p = (e.pathname && e.pathname.split("/")) || []),
                 n.protocol && !y[n.protocol]);
            if (
                (T &&
                 ((n.hostname = ""),
                  (n.port = null),
                  n.host && ("" === S[0] ? (S[0] = n.host) : S.unshift(n.host)),
                  (n.host = ""),
                  e.protocol &&
                  ((e.hostname = null),
                   (e.port = null),
                   e.host && ("" === p[0] ? (p[0] = e.host) : p.unshift(e.host)),
                   (e.host = null)),
                  (b = b && ("" === p[0] || "" === S[0]))),
                 w)
            )
                (n.host = e.host || "" === e.host ? e.host : n.host),
                    (n.hostname =
                     e.hostname || "" === e.hostname ? e.hostname : n.hostname),
                    (n.search = e.search),
                    (n.query = e.query),
                    (S = p);
            else if (p.length)
                S || (S = []),
                    S.pop(),
                    (S = S.concat(p)),
                    (n.search = e.search),
                    (n.query = e.query);
            else if (!r.isNullOrUndefined(e.search))
                return (
                    T &&
                    ((n.hostname = n.host = S.shift()),
                     (P = !!(n.host && n.host.indexOf("@") > 0) && n.host.split("@")) &&
                     ((n.auth = P.shift()), (n.host = n.hostname = P.shift()))),
                    (n.search = e.search),
                    (n.query = e.query),
                    (r.isNull(n.pathname) && r.isNull(n.search)) ||
                    (n.path =
                     (n.pathname ? n.pathname : "") + (n.search ? n.search : "")),
                    (n.href = n.format()),
                    n
                );
            if (!S.length)
                return (
                    (n.pathname = null),
                    n.search ? (n.path = "/" + n.search) : (n.path = null),
                    (n.href = n.format()),
                    n
                );
            for (
                var I = S.slice(-1)[0],
                E =
                ((n.host || e.host || S.length > 1) &&
                 ("." === I || ".." === I)) ||
                "" === I,
                M = 0,
                A = S.length; A >= 0; A--
            )
                "." === (I = S[A]) ?
                    S.splice(A, 1) :
                ".." === I ?
                    (S.splice(A, 1), M++) :
                M && (S.splice(A, 1), M--);
            if (!b && !x)
                for (; M--; M) S.unshift("..");
            !b || "" === S[0] || (S[0] && "/" === S[0].charAt(0)) || S.unshift(""),
                E && "/" !== S.join("/").substr(-1) && S.push("");
            var P,
                B = "" === S[0] || (S[0] && "/" === S[0].charAt(0));
            return (
                T &&
                ((n.hostname = n.host = B ? "" : S.length ? S.shift() : ""),
                 (P = !!(n.host && n.host.indexOf("@") > 0) && n.host.split("@")) &&
                 ((n.auth = P.shift()), (n.host = n.hostname = P.shift()))),
                (b = b || (n.host && S.length)) && !B && S.unshift(""),
                S.length ?
                (n.pathname = S.join("/")) :
                ((n.pathname = null), (n.path = null)),
                (r.isNull(n.pathname) && r.isNull(n.search)) ||
                (n.path =
                 (n.pathname ? n.pathname : "") + (n.search ? n.search : "")),
                (n.auth = e.auth || n.auth),
                (n.slashes = n.slashes || e.slashes),
                (n.href = n.format()),
                n
            );
        }),
            (s.prototype.parseHost = function() {
            var e = this.host,
                t = o.exec(e);
            t &&
                (":" !== (t = t[0]) && (this.port = t.substr(1)),
                 (e = e.substr(0, e.length - t.length))),
                e && (this.hostname = e);
        });
    },
    function(e, t, n) {
        (function(e, i) {
            var r;
            /*! https://mths.be/punycode v1.4.1 by @mathias */
            !(function(s) {
                t && t.nodeType, e && e.nodeType;
                var a = "object" == typeof i && i;
                a.global !== a && a.window !== a && a.self;
                var o,
                    c = 2147483647,
                    l = 36,
                    h = /^xn--/,
                    u = /[^\x20-\x7E]/,
                    f = /[\x2E\u3002\uFF0E\uFF61]/g,
                    d = {
                        overflow: "Overflow: input needs wider integers to process",
                        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                        "invalid-input": "Invalid input",
                    },
                    p = Math.floor,
                    g = String.fromCharCode;

                function m(e) {
                    throw new RangeError(d[e]);
                }

                function y(e, t) {
                    for (var n = e.length, i = []; n--;) i[n] = t(e[n]);
                    return i;
                }

                function k(e, t) {
                    var n = e.split("@"),
                        i = "";
                    return (
                        n.length > 1 && ((i = n[0] + "@"), (e = n[1])),
                        i + y((e = e.replace(f, ".")).split("."), t).join(".")
                    );
                }

                function v(e) {
                    for (var t, n, i = [], r = 0, s = e.length; r < s;)
                        (t = e.charCodeAt(r++)) >= 55296 && t <= 56319 && r < s ?
                            56320 == (64512 & (n = e.charCodeAt(r++))) ?
                            i.push(((1023 & t) << 10) + (1023 & n) + 65536) :
                        (i.push(t), r--) :
                        i.push(t);
                    return i;
                }

                function w(e) {
                    return y(e, function(e) {
                        var t = "";
                        return (
                            e > 65535 &&
                            ((t += g((((e -= 65536) >>> 10) & 1023) | 55296)),
                             (e = 56320 | (1023 & e))),
                            t + g(e)
                        );
                    }).join("");
                }

                function b(e) {
                    return e - 48 < 10 ?
                        e - 22 :
                    e - 65 < 26 ?
                        e - 65 :
                    e - 97 < 26 ?
                        e - 97 :
                    l;
                }

                function x(e, t) {
                    return e + 22 + 75 * (e < 26) - ((0 != t) << 5);
                }

                function S(e, t, n) {
                    var i = 0;
                    for (e = n ? p(e / 700) : e >> 1, e += p(e / t); e > 455; i += l)
                        e = p(e / 35);
                    return p(i + (36 * e) / (e + 38));
                }

                function T(e) {
                    var t,
                        n,
                        i,
                        r,
                        s,
                        a,
                        o,
                        h,
                        u,
                        f,
                        d = [],
                        g = e.length,
                        y = 0,
                        k = 128,
                        v = 72;
                    for ((n = e.lastIndexOf("-")) < 0 && (n = 0), i = 0; i < n; ++i)
                        e.charCodeAt(i) >= 128 && m("not-basic"), d.push(e.charCodeAt(i));
                    for (r = n > 0 ? n + 1 : 0; r < g;) {
                        for (
                            s = y, a = 1, o = l; r >= g && m("invalid-input"),
                            ((h = b(e.charCodeAt(r++))) >= l || h > p((c - y) / a)) &&
                            m("overflow"),
                            (y += h * a),
                            !(h < (u = o <= v ? 1 : o >= v + 26 ? 26 : o - v)); o += l
                        )
                            a > p(c / (f = l - u)) && m("overflow"), (a *= f);
                        (v = S(y - s, (t = d.length + 1), 0 == s)),
                            p(y / t) > c - k && m("overflow"),
                            (k += p(y / t)),
                            (y %= t),
                            d.splice(y++, 0, k);
                    }
                    return w(d);
                }

                function I(e) {
                    var t,
                        n,
                        i,
                        r,
                        s,
                        a,
                        o,
                        h,
                        u,
                        f,
                        d,
                        y,
                        k,
                        w,
                        b,
                        T = [];
                    for (y = (e = v(e)).length, t = 128, n = 0, s = 72, a = 0; a < y; ++a)
                        (d = e[a]) < 128 && T.push(g(d));
                    for (i = r = T.length, r && T.push("-"); i < y;) {
                        for (o = c, a = 0; a < y; ++a)(d = e[a]) >= t && d < o && (o = d);
                        for (
                            o - t > p((c - n) / (k = i + 1)) && m("overflow"),
                            n += (o - t) * k,
                            t = o,
                            a = 0; a < y;
                            ++a
                        )
                            if (((d = e[a]) < t && ++n > c && m("overflow"), d == t)) {
                                for (
                                    h = n, u = l; !(h < (f = u <= s ? 1 : u >= s + 26 ? 26 : u - s)); u += l
                                )
                                    (b = h - f),
                                        (w = l - f),
                                        T.push(g(x(f + (b % w), 0))),
                                        (h = p(b / w));
                                T.push(g(x(h, 0))), (s = S(n, k, i == r)), (n = 0), ++i;
                            }
                        ++ n, ++t;
                    }
                    return T.join("");
                }
                (o = {
                    version: "1.4.1",
                    ucs2: {
                        decode: v,
                        encode: w
                    },
                    decode: T,
                    encode: I,
                    toASCII: function(e) {
                        return k(e, function(e) {
                            return u.test(e) ? "xn--" + I(e) : e;
                        });
                    },
                    toUnicode: function(e) {
                        return k(e, function(e) {
                            return h.test(e) ? T(e.slice(4).toLowerCase()) : e;
                        });
                    },
                }),
                    void 0 ===
                    (r = function() {
                    return o;
                }.call(t, n, t, e)) || (e.exports = r);
            })();
        }.call(this, n(62)(e), n(12)));
    },
    function(e, t) {
        e.exports = function(e) {
            return (
                e.webpackPolyfill ||
                ((e.deprecate = function() {}),
                 (e.paths = []),
                 e.children || (e.children = []),
                 Object.defineProperty(e, "loaded", {
                    enumerable: !0,
                    get: function() {
                        return e.l;
                    },
                }),
                 Object.defineProperty(e, "id", {
                    enumerable: !0,
                    get: function() {
                        return e.i;
                    },
                }),
                 (e.webpackPolyfill = 1)),
                e
            );
        };
    },
    function(e, t, n) {
        "use strict";
        e.exports = {
            isString: function(e) {
                return "string" == typeof e;
            },
            isObject: function(e) {
                return "object" == typeof e && null !== e;
            },
            isNull: function(e) {
                return null === e;
            },
            isNullOrUndefined: function(e) {
                return null == e;
            },
        };
    },
    function(e, t, n) {
        "use strict";
        (t.decode = t.parse = n(65)), (t.encode = t.stringify = n(66));
    },
    function(e, t, n) {
        "use strict";

        function i(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
        }
        e.exports = function(e, t, n, s) {
            (t = t || "&"), (n = n || "=");
            var a = {};
            if ("string" != typeof e || 0 === e.length) return a;
            var o = /\+/g;
            e = e.split(t);
            var c = 1e3;
            s && "number" == typeof s.maxKeys && (c = s.maxKeys);
            var l = e.length;
            c > 0 && l > c && (l = c);
            for (var h = 0; h < l; ++h) {
                var u,
                    f,
                    d,
                    p,
                    g = e[h].replace(o, "%20"),
                    m = g.indexOf(n);
                m >= 0 ?
                    ((u = g.substr(0, m)), (f = g.substr(m + 1))) :
                ((u = g), (f = "")),
                    (d = decodeURIComponent(u)),
                    (p = decodeURIComponent(f)),
                    i(a, d) ? (r(a[d]) ? a[d].push(p) : (a[d] = [a[d], p])) : (a[d] = p);
            }
            return a;
        };
        var r =
            Array.isArray ||
            function(e) {
                return "[object Array]" === Object.prototype.toString.call(e);
            };
    },
    function(e, t, n) {
        "use strict";
        var i = function(e) {
            switch (typeof e) {
                case "string":
                    return e;
                case "boolean":
                    return e ? "true" : "false";
                case "number":
                    return isFinite(e) ? e : "";
                default:
                    return "";
            }
        };
        e.exports = function(e, t, n, o) {
            return (
                (t = t || "&"),
                (n = n || "="),
                null === e && (e = void 0),
                "object" == typeof e ?
                s(a(e), function(a) {
                    var o = encodeURIComponent(i(a)) + n;
                    return r(e[a]) ?
                        s(e[a], function(e) {
                        return o + encodeURIComponent(i(e));
                    }).join(t) :
                    o + encodeURIComponent(i(e[a]));
                }).join(t) :
                o ?
                encodeURIComponent(i(o)) + n + encodeURIComponent(i(e)) :
                ""
            );
        };
        var r =
            Array.isArray ||
            function(e) {
                return "[object Array]" === Object.prototype.toString.call(e);
            };

        function s(e, t) {
            if (e.map) return e.map(t);
            for (var n = [], i = 0; i < e.length; i++) n.push(t(e[i], i));
            return n;
        }
        var a =
            Object.keys ||
            function(e) {
                var t = [];
                for (var n in e)
                    Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
                return t;
            };
    },
    function(e, t, n) {
        !(function() {
            var t = n(68),
                i = n(20).utf8,
                r = n(69),
                s = n(20).bin,
                a = function(e, n) {
                    e.constructor == String ?
                        (e =
                         n && "binary" === n.encoding ?
                         s.stringToBytes(e) :
                         i.stringToBytes(e)) :
                    r(e) ?
                        (e = Array.prototype.slice.call(e, 0)) :
                    Array.isArray(e) || (e = e.toString());
                    for (
                        var o = t.bytesToWords(e),
                        c = 8 * e.length,
                        l = 1732584193,
                        h = -271733879,
                        u = -1732584194,
                        f = 271733878,
                        d = 0; d < o.length; d++
                    )
                        o[d] =
                            (16711935 & ((o[d] << 8) | (o[d] >>> 24))) |
                            (4278255360 & ((o[d] << 24) | (o[d] >>> 8)));
                    (o[c >>> 5] |= 128 << c % 32), (o[14 + (((c + 64) >>> 9) << 4)] = c);
                    var p = a._ff,
                        g = a._gg,
                        m = a._hh,
                        y = a._ii;
                    for (d = 0; d < o.length; d += 16) {
                        var k = l,
                            v = h,
                            w = u,
                            b = f;
                        (h = y(
                            (h = y(
                                (h = y(
                                    (h = y(
                                        (h = m(
                                            (h = m(
                                                (h = m(
                                                    (h = m(
                                                        (h = g(
                                                            (h = g(
                                                                (h = g(
                                                                    (h = g(
                                                                        (h = p(
                                                                            (h = p(
                                                                                (h = p(
                                                                                    (h = p(
                                                                                        h,
                                                                                        (u = p(
                                                                                            u,
                                                                                            (f = p(
                                                                                                f,
                                                                                                (l = p(
                                                                                                    l,
                                                                                                    h,
                                                                                                    u,
                                                                                                    f,
                                                                                                    o[d + 0],
                                                                                                    7,
                                                                                                    -680876936,
                                                                                                )),
                                                                                                h,
                                                                                                u,
                                                                                                o[d + 1],
                                                                                                12,
                                                                                                -389564586,
                                                                                            )),
                                                                                            l,
                                                                                            h,
                                                                                            o[d + 2],
                                                                                            17,
                                                                                            606105819,
                                                                                        )),
                                                                                        f,
                                                                                        l,
                                                                                        o[d + 3],
                                                                                        22,
                                                                                        -1044525330,
                                                                                    )),
                                                                                    (u = p(
                                                                                        u,
                                                                                        (f = p(
                                                                                            f,
                                                                                            (l = p(
                                                                                                l,
                                                                                                h,
                                                                                                u,
                                                                                                f,
                                                                                                o[d + 4],
                                                                                                7,
                                                                                                -176418897,
                                                                                            )),
                                                                                            h,
                                                                                            u,
                                                                                            o[d + 5],
                                                                                            12,
                                                                                            1200080426,
                                                                                        )),
                                                                                        l,
                                                                                        h,
                                                                                        o[d + 6],
                                                                                        17,
                                                                                        -1473231341,
                                                                                    )),
                                                                                    f,
                                                                                    l,
                                                                                    o[d + 7],
                                                                                    22,
                                                                                    -45705983,
                                                                                )),
                                                                                (u = p(
                                                                                    u,
                                                                                    (f = p(
                                                                                        f,
                                                                                        (l = p(
                                                                                            l,
                                                                                            h,
                                                                                            u,
                                                                                            f,
                                                                                            o[d + 8],
                                                                                            7,
                                                                                            1770035416,
                                                                                        )),
                                                                                        h,
                                                                                        u,
                                                                                        o[d + 9],
                                                                                        12,
                                                                                        -1958414417,
                                                                                    )),
                                                                                    l,
                                                                                    h,
                                                                                    o[d + 10],
                                                                                    17,
                                                                                    -42063,
                                                                                )),
                                                                                f,
                                                                                l,
                                                                                o[d + 11],
                                                                                22,
                                                                                -1990404162,
                                                                            )),
                                                                            (u = p(
                                                                                u,
                                                                                (f = p(
                                                                                    f,
                                                                                    (l = p(
                                                                                        l,
                                                                                        h,
                                                                                        u,
                                                                                        f,
                                                                                        o[d + 12],
                                                                                        7,
                                                                                        1804603682,
                                                                                    )),
                                                                                    h,
                                                                                    u,
                                                                                    o[d + 13],
                                                                                    12,
                                                                                    -40341101,
                                                                                )),
                                                                                l,
                                                                                h,
                                                                                o[d + 14],
                                                                                17,
                                                                                -1502002290,
                                                                            )),
                                                                            f,
                                                                            l,
                                                                            o[d + 15],
                                                                            22,
                                                                            1236535329,
                                                                        )),
                                                                        (u = g(
                                                                            u,
                                                                            (f = g(
                                                                                f,
                                                                                (l = g(
                                                                                    l,
                                                                                    h,
                                                                                    u,
                                                                                    f,
                                                                                    o[d + 1],
                                                                                    5,
                                                                                    -165796510,
                                                                                )),
                                                                                h,
                                                                                u,
                                                                                o[d + 6],
                                                                                9,
                                                                                -1069501632,
                                                                            )),
                                                                            l,
                                                                            h,
                                                                            o[d + 11],
                                                                            14,
                                                                            643717713,
                                                                        )),
                                                                        f,
                                                                        l,
                                                                        o[d + 0],
                                                                        20,
                                                                        -373897302,
                                                                    )),
                                                                    (u = g(
                                                                        u,
                                                                        (f = g(
                                                                            f,
                                                                            (l = g(
                                                                                l,
                                                                                h,
                                                                                u,
                                                                                f,
                                                                                o[d + 5],
                                                                                5,
                                                                                -701558691,
                                                                            )),
                                                                            h,
                                                                            u,
                                                                            o[d + 10],
                                                                            9,
                                                                            38016083,
                                                                        )),
                                                                        l,
                                                                        h,
                                                                        o[d + 15],
                                                                        14,
                                                                        -660478335,
                                                                    )),
                                                                    f,
                                                                    l,
                                                                    o[d + 4],
                                                                    20,
                                                                    -405537848,
                                                                )),
                                                                (u = g(
                                                                    u,
                                                                    (f = g(
                                                                        f,
                                                                        (l = g(l, h, u, f, o[d + 9], 5, 568446438)),
                                                                        h,
                                                                        u,
                                                                        o[d + 14],
                                                                        9,
                                                                        -1019803690,
                                                                    )),
                                                                    l,
                                                                    h,
                                                                    o[d + 3],
                                                                    14,
                                                                    -187363961,
                                                                )),
                                                                f,
                                                                l,
                                                                o[d + 8],
                                                                20,
                                                                1163531501,
                                                            )),
                                                            (u = g(
                                                                u,
                                                                (f = g(
                                                                    f,
                                                                    (l = g(
                                                                        l,
                                                                        h,
                                                                        u,
                                                                        f,
                                                                        o[d + 13],
                                                                        5,
                                                                        -1444681467,
                                                                    )),
                                                                    h,
                                                                    u,
                                                                    o[d + 2],
                                                                    9,
                                                                    -51403784,
                                                                )),
                                                                l,
                                                                h,
                                                                o[d + 7],
                                                                14,
                                                                1735328473,
                                                            )),
                                                            f,
                                                            l,
                                                            o[d + 12],
                                                            20,
                                                            -1926607734,
                                                        )),
                                                        (u = m(
                                                            u,
                                                            (f = m(
                                                                f,
                                                                (l = m(l, h, u, f, o[d + 5], 4, -378558)),
                                                                h,
                                                                u,
                                                                o[d + 8],
                                                                11,
                                                                -2022574463,
                                                            )),
                                                            l,
                                                            h,
                                                            o[d + 11],
                                                            16,
                                                            1839030562,
                                                        )),
                                                        f,
                                                        l,
                                                        o[d + 14],
                                                        23,
                                                        -35309556,
                                                    )),
                                                    (u = m(
                                                        u,
                                                        (f = m(
                                                            f,
                                                            (l = m(l, h, u, f, o[d + 1], 4, -1530992060)),
                                                            h,
                                                            u,
                                                            o[d + 4],
                                                            11,
                                                            1272893353,
                                                        )),
                                                        l,
                                                        h,
                                                        o[d + 7],
                                                        16,
                                                        -155497632,
                                                    )),
                                                    f,
                                                    l,
                                                    o[d + 10],
                                                    23,
                                                    -1094730640,
                                                )),
                                                (u = m(
                                                    u,
                                                    (f = m(
                                                        f,
                                                        (l = m(l, h, u, f, o[d + 13], 4, 681279174)),
                                                        h,
                                                        u,
                                                        o[d + 0],
                                                        11,
                                                        -358537222,
                                                    )),
                                                    l,
                                                    h,
                                                    o[d + 3],
                                                    16,
                                                    -722521979,
                                                )),
                                                f,
                                                l,
                                                o[d + 6],
                                                23,
                                                76029189,
                                            )),
                                            (u = m(
                                                u,
                                                (f = m(
                                                    f,
                                                    (l = m(l, h, u, f, o[d + 9], 4, -640364487)),
                                                    h,
                                                    u,
                                                    o[d + 12],
                                                    11,
                                                    -421815835,
                                                )),
                                                l,
                                                h,
                                                o[d + 15],
                                                16,
                                                530742520,
                                            )),
                                            f,
                                            l,
                                            o[d + 2],
                                            23,
                                            -995338651,
                                        )),
                                        (u = y(
                                            u,
                                            (f = y(
                                                f,
                                                (l = y(l, h, u, f, o[d + 0], 6, -198630844)),
                                                h,
                                                u,
                                                o[d + 7],
                                                10,
                                                1126891415,
                                            )),
                                            l,
                                            h,
                                            o[d + 14],
                                            15,
                                            -1416354905,
                                        )),
                                        f,
                                        l,
                                        o[d + 5],
                                        21,
                                        -57434055,
                                    )),
                                    (u = y(
                                        u,
                                        (f = y(
                                            f,
                                            (l = y(l, h, u, f, o[d + 12], 6, 1700485571)),
                                            h,
                                            u,
                                            o[d + 3],
                                            10,
                                            -1894986606,
                                        )),
                                        l,
                                        h,
                                        o[d + 10],
                                        15,
                                        -1051523,
                                    )),
                                    f,
                                    l,
                                    o[d + 1],
                                    21,
                                    -2054922799,
                                )),
                                (u = y(
                                    u,
                                    (f = y(
                                        f,
                                        (l = y(l, h, u, f, o[d + 8], 6, 1873313359)),
                                        h,
                                        u,
                                        o[d + 15],
                                        10,
                                        -30611744,
                                    )),
                                    l,
                                    h,
                                    o[d + 6],
                                    15,
                                    -1560198380,
                                )),
                                f,
                                l,
                                o[d + 13],
                                21,
                                1309151649,
                            )),
                            (u = y(
                                u,
                                (f = y(
                                    f,
                                    (l = y(l, h, u, f, o[d + 4], 6, -145523070)),
                                    h,
                                    u,
                                    o[d + 11],
                                    10,
                                    -1120210379,
                                )),
                                l,
                                h,
                                o[d + 2],
                                15,
                                718787259,
                            )),
                            f,
                            l,
                            o[d + 9],
                            21,
                            -343485551,
                        )),
                            (l = (l + k) >>> 0),
                            (h = (h + v) >>> 0),
                            (u = (u + w) >>> 0),
                            (f = (f + b) >>> 0);
                    }
                    return t.endian([l, h, u, f]);
                };
            (a._ff = function(e, t, n, i, r, s, a) {
                var o = e + ((t & n) | (~t & i)) + (r >>> 0) + a;
                return ((o << s) | (o >>> (32 - s))) + t;
            }),
                (a._gg = function(e, t, n, i, r, s, a) {
                var o = e + ((t & i) | (n & ~i)) + (r >>> 0) + a;
                return ((o << s) | (o >>> (32 - s))) + t;
            }),
                (a._hh = function(e, t, n, i, r, s, a) {
                var o = e + (t ^ n ^ i) + (r >>> 0) + a;
                return ((o << s) | (o >>> (32 - s))) + t;
            }),
                (a._ii = function(e, t, n, i, r, s, a) {
                var o = e + (n ^ (t | ~i)) + (r >>> 0) + a;
                return ((o << s) | (o >>> (32 - s))) + t;
            }),
                (a._blocksize = 16),
                (a._digestsize = 16),
                (e.exports = function(e, n) {
                if (null == e) throw new Error("Illegal argument " + e);
                var i = t.wordsToBytes(a(e, n));
                return n && n.asBytes ?
                    i :
                n && n.asString ?
                    s.bytesToString(i) :
                t.bytesToHex(i);
            });
        })();
    },
    function(e, t) {
        !(function() {
            var t =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                n = {
                    rotl: function(e, t) {
                        return (e << t) | (e >>> (32 - t));
                    },
                    rotr: function(e, t) {
                        return (e << (32 - t)) | (e >>> t);
                    },
                    endian: function(e) {
                        if (e.constructor == Number)
                            return (16711935 & n.rotl(e, 8)) | (4278255360 & n.rotl(e, 24));
                        for (var t = 0; t < e.length; t++) e[t] = n.endian(e[t]);
                        return e;
                    },
                    randomBytes: function(e) {
                        for (var t = []; e > 0; e--)
                            t.push(Math.floor(256 * Math.random()));
                        return t;
                    },
                    bytesToWords: function(e) {
                        for (var t = [], n = 0, i = 0; n < e.length; n++, i += 8)
                            t[i >>> 5] |= e[n] << (24 - (i % 32));
                        return t;
                    },
                    wordsToBytes: function(e) {
                        for (var t = [], n = 0; n < 32 * e.length; n += 8)
                            t.push((e[n >>> 5] >>> (24 - (n % 32))) & 255);
                        return t;
                    },
                    bytesToHex: function(e) {
                        for (var t = [], n = 0; n < e.length; n++)
                            t.push((e[n] >>> 4).toString(16)),
                                t.push((15 & e[n]).toString(16));
                        return t.join("");
                    },
                    hexToBytes: function(e) {
                        for (var t = [], n = 0; n < e.length; n += 2)
                            t.push(parseInt(e.substr(n, 2), 16));
                        return t;
                    },
                    bytesToBase64: function(e) {
                        for (var n = [], i = 0; i < e.length; i += 3)
                            for (
                                var r = (e[i] << 16) | (e[i + 1] << 8) | e[i + 2], s = 0; s < 4; s++
                            )
                                8 * i + 6 * s <= 8 * e.length ?
                                    n.push(t.charAt((r >>> (6 * (3 - s))) & 63)) :
                                n.push("=");
                        return n.join("");
                    },
                    base64ToBytes: function(e) {
                        e = e.replace(/[^A-Z0-9+\/]/gi, "");
                        for (var n = [], i = 0, r = 0; i < e.length; r = ++i % 4)
                            0 != r &&
                                n.push(
                                ((t.indexOf(e.charAt(i - 1)) &
                                  (Math.pow(2, -2 * r + 8) - 1)) <<
                                 (2 * r)) |
                                (t.indexOf(e.charAt(i)) >>> (6 - 2 * r)),
                            );
                        return n;
                    },
                };
            e.exports = n;
        })();
    },
    function(e, t) {
        function n(e) {
            return (
                !!e.constructor &&
                "function" == typeof e.constructor.isBuffer &&
                e.constructor.isBuffer(e)
            );
        }
        /*!
         * Determine if an object is a Buffer
         *
         * @author   D_Alpha
         * @license  MIT
         */
        e.exports = function(e) {
            return (
                null != e &&
                (n(e) ||
                 (function(e) {
                    return (
                        "function" == typeof e.readFloatLE &&
                        "function" == typeof e.slice &&
                        n(e.slice(0, 0))
                    );
                })(e) ||
                 !!e._isBuffer)
            );
        };
    },
    function(e, t) {
        e.exports = function(e, t, n, i, r, s, a, o, c) {
            (this.aiTypes = [{
                id: 0,
                src: "cow_1",
                killScore: 150,
                health: 500,
                weightM: 0.8,
                speed: 95e-5,
                turnSpeed: 0.001,
                scale: 72,
                drop: ["food", 50],
                chat: "Moooo"
            },
                             {
                                 id: 1,
                                 src: "pig_1",
                                 killScore: 200,
                                 health: 800,
                                 weightM: 0.6,
                                 speed: 85e-5,
                                 turnSpeed: 0.001,
                                 scale: 72,
                                 drop: ["food", 80],
                                 chat: "I eat bacon"
                             },
                             {
                                 id: 2,
                                 name: "Bull",
                                 src: "bull_2",
                                 hostile: !0,
                                 dmg: 20,
                                 killScore: 1e3,
                                 health: 1800,
                                 weightM: 0.5,
                                 speed: 94e-5,
                                 turnSpeed: 74e-5,
                                 scale: 78,
                                 viewRange: 800,
                                 chargePlayer: !0,
                                 drop: ["food", 100],
                                 chat: "Oley!"
                             },
                             {
                                 id: 3,
                                 name: "Bully",
                                 src: "bull_1",
                                 hostile: !0,
                                 dmg: 20,
                                 killScore: 2e3,
                                 health: 2800,
                                 weightM: 0.45,
                                 speed: 0.001,
                                 turnSpeed: 8e-4,
                                 scale: 90,
                                 viewRange: 900,
                                 chargePlayer: !0,
                                 drop: ["food", 400],
                                 chat: "Give me your lunch money!"
                             },
                             {
                                 id: 4,
                                 name: "Wolf",
                                 src: "wolf_1",
                                 hostile: !0,
                                 dmg: 8,
                                 killScore: 500,
                                 health: 300,
                                 weightM: 0.45,
                                 speed: 0.001,
                                 turnSpeed: 0.002,
                                 scale: 84,
                                 viewRange: 800,
                                 chargePlayer: !0,
                                 drop: ["food", 200],
                                 chat: "Woof"
                             },
                             {
                                 id: 5,
                                 name: "Quack",
                                 src: "chicken_1",
                                 dmg: 8,
                                 killScore: 2e3,
                                 noTrap: !0,
                                 health: 300,
                                 weightM: 0.2,
                                 speed: 0.0018,
                                 turnSpeed: 0.006,
                                 scale: 70,
                                 drop: ["food", 100],
                                 chat: "Quack Quack!"
                             },
                             {
                                 id: 6,
                                 name: "MOOSTAFA",
                                 nameScale: 50,
                                 src: "enemy",
                                 hostile: !0,
                                 dontRun: !0,
                                 fixedSpawn: !0,
                                 spawnDelay: 6e4,
                                 noTrap: !0,
                                 colDmg: 100,
                                 dmg: 40,
                                 killScore: 8e3,
                                 health: 18e3,
                                 weightM: 0.4,
                                 speed: 7e-4,
                                 turnSpeed: 0.01,
                                 scale: 80,
                                 spriteMlt: 1.8,
                                 leapForce: 0.9,
                                 viewRange: 1e3,
                                 hitRange: 210,
                                 hitDelay: 1e3,
                                 chargePlayer: !0,
                                 drop: ["food", 100],
                                 chat: "MOOSTAFA KILL YOU"
                             },
                             {
                                 id: 7,
                                 name: "Treasure",
                                 hostile: !0,
                                 nameScale: 35,
                                 src: "crate_1",
                                 fixedSpawn: !0,
                                 spawnDelay: 12e4,
                                 colDmg: 200,
                                 killScore: 5e3,
                                 health: 2e4,
                                 weightM: 0.1,
                                 speed: 0,
                                 turnSpeed: 0,
                                 scale: 70,
                                 spriteMlt: 1,
                                 chat: "No key? Time for box abuse!"
                             },
                             {
                                 id: 8,
                                 name: "MOOFIE",
                                 src: "wolf_2",
                                 hostile: !0,
                                 fixedSpawn: !0,
                                 dontRun: !0,
                                 hitScare: 4,
                                 spawnDelay: 3e4,
                                 noTrap: !0,
                                 nameScale: 35,
                                 dmg: 10,
                                 colDmg: 100,
                                 killScore: 3e3,
                                 health: 7e3,
                                 weightM: 0.45,
                                 speed: 0.0015,
                                 turnSpeed: 0.002,
                                 scale: 90,
                                 viewRange: 800,
                                 chargePlayer: !0,
                                 drop: ["food", 1e3],
                                 chat: "eEeEeEeEEEeEEEEEee!"
                             },
                            ]),
                (this.spawn = function(l, h, u, f) {
                for (var d, p = 0; p < e.length; ++p)
                    if (!e[p].active) {
                        d = e[p];
                        break;
                    }
                return (
                    d || ((d = new t(e.length, r, n, i, a, s, o, c)), e.push(d)),
                    d.init(l, h, u, f, this.aiTypes[f]),
                    d
                );
            });
        };
    },
    function(e, t) {
        var n = 2 * Math.PI;
        e.exports = function(e, t, i, r, s, a, o, c) {
            (this.sid = e),
                (this.isAI = !0),
                (this.nameIndex = s.randInt(0, a.cowNames.length - 1)),
                (this.init = function(e, t, n, i, r) {
                (this.x = e),
                    (this.y = t),
                    (this.startX = r.fixedSpawn ? e : null),
                    (this.startY = r.fixedSpawn ? t : null),
                    (this.xVel = 0),
                    (this.yVel = 0),
                    (this.zIndex = 0),
                    (this.dir = n),
                    (this.dirPlus = 0),
                    (this.index = i),
                    (this.src = r.src),
                    r.name && (this.name = r.name),
                    (this.weightM = r.weightM),
                    (this.speed = r.speed),
                    (this.killScore = r.killScore),
                    (this.turnSpeed = r.turnSpeed),
                    (this.scale = r.scale),
                    (this.maxHealth = r.health),
                    (this.leapForce = r.leapForce),
                    (this.health = this.maxHealth),
                    (this.chargePlayer = r.chargePlayer),
                    (this.viewRange = r.viewRange),
                    (this.drop = r.drop),
                    (this.dmg = r.dmg),
                    (this.hostile = r.hostile),
                    (this.dontRun = r.dontRun),
                    (this.hitRange = r.hitRange),
                    (this.hitDelay = r.hitDelay),
                    (this.hitScare = r.hitScare),
                    (this.spriteMlt = r.spriteMlt),
                    (this.nameScale = r.nameScale),
                    (this.colDmg = r.colDmg),
                    (this.noTrap = r.noTrap),
                    (this.spawnDelay = r.spawnDelay),
                    (this.hitWait = 0),
                    (this.waitCount = 1e3),
                    (this.moveCount = 0),
                    (this.targetDir = 0),
                    (this.active = !0),
                    (this.alive = !0),
                    (this.runFrom = null),
                    (this.chargeTarget = null),
                    (this.dmgOverTime = {});
            });
            var l = 0;
            (this.update = function(e) {
                if (this.active) {
                    if (this.spawnCounter)
                        return (
                            (this.spawnCounter -= e),
                            void(
                                this.spawnCounter <= 0 &&
                                ((this.spawnCounter = 0),
                                 (this.x = this.startX || s.randInt(0, a.mapScale)),
                                 (this.y = this.startY || s.randInt(0, a.mapScale)))
                            )
                        );
                    (l -= e) <= 0 &&
                        (this.dmgOverTime.dmg &&
                         (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer),
                          (this.dmgOverTime.time -= 1),
                          this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)),
                         (l = 1e3));
                    var r = !1,
                        o = 1;
                    if (
                        (!this.zIndex &&
                         !this.lockMove &&
                         this.y >= a.mapScale / 2 - a.riverWidth / 2 &&
                         this.y <= a.mapScale / 2 + a.riverWidth / 2 &&
                         ((o = 0.33), (this.xVel += a.waterCurrent * e)),
                         this.lockMove)
                    )
                        (this.xVel = 0), (this.yVel = 0);
                    else if (this.waitCount > 0) {
                        if (((this.waitCount -= e), this.waitCount <= 0))
                            if (this.chargePlayer) {
                                for (var h, u, f, d = 0; d < i.length; ++d)
                                    !i[d].alive ||
                                        (i[d].skin && i[d].skin.bullRepel) ||
                                        ((f = s.getDistance(this.x, this.y, i[d].x, i[d].y)) <=
                                         this.viewRange &&
                                         (!h || f < u) &&
                                         ((u = f), (h = i[d])));
                                h
                                    ?
                                    ((this.chargeTarget = h),
                                     (this.moveCount = s.randInt(8e3, 12e3))) :
                                ((this.moveCount = s.randInt(1e3, 2e3)),
                                 (this.targetDir = s.randFloat(-Math.PI, Math.PI)));
                            } else
                                (this.moveCount = s.randInt(4e3, 1e4)),
                                    (this.targetDir = s.randFloat(-Math.PI, Math.PI));
                    } else if (this.moveCount > 0) {
                        var p = this.speed * o;
                        if (
                            (this.runFrom &&
                             this.runFrom.active &&
                             (!this.runFrom.isPlayer || this.runFrom.alive) ?
                             ((this.targetDir = s.getDirection(
                                this.x,
                                this.y,
                                this.runFrom.x,
                                this.runFrom.y,
                            )),
                              (p *= 1.42)) :
                             this.chargeTarget &&
                             this.chargeTarget.alive &&
                             ((this.targetDir = s.getDirection(
                                this.chargeTarget.x,
                                this.chargeTarget.y,
                                this.x,
                                this.y,
                            )),
                              (p *= 1.75),
                              (r = !0)),
                             this.hitWait && (p *= 0.3),
                             this.dir != this.targetDir)
                        ) {
                            this.dir %= n;
                            var g = (this.dir - this.targetDir + n) % n,
                                m = Math.min(Math.abs(g - n), g, this.turnSpeed * e),
                                y = g - Math.PI >= 0 ? 1 : -1;
                            this.dir += y * m + n;
                        }
                        (this.dir %= n),
                            (this.xVel += p * e * Math.cos(this.dir)),
                            (this.yVel += p * e * Math.sin(this.dir)),
                            (this.moveCount -= e),
                            this.moveCount <= 0 &&
                            ((this.runFrom = null),
                             (this.chargeTarget = null),
                             (this.waitCount = this.hostile ? 1500 : s.randInt(1500, 6e3)));
                    }
                    (this.zIndex = 0), (this.lockMove = !1);
                    var k = s.getDistance(0, 0, this.xVel * e, this.yVel * e),
                        v = Math.min(4, Math.max(1, Math.round(k / 40))),
                        w = 1 / v;
                    for (d = 0; d < v; ++d) {
                        this.xVel && (this.x += this.xVel * e * w),
                            this.yVel && (this.y += this.yVel * e * w),
                            (M = t.getGridArrays(this.x, this.y, this.scale));
                        for (var b = 0; b < M.length; ++b)
                            for (var x = 0; x < M[b].length; ++x)
                                M[b][x].active && t.checkCollision(this, M[b][x], w);
                    }
                    var S,
                        T,
                        I,
                        E = !1;
                    if (this.hitWait > 0 && ((this.hitWait -= e), this.hitWait <= 0)) {
                        (E = !0),
                            (this.hitWait = 0),
                            this.leapForce &&
                            !s.randInt(0, 2) &&
                            ((this.xVel += this.leapForce * Math.cos(this.dir)),
                             (this.yVel += this.leapForce * Math.sin(this.dir)));
                        for (
                            var M = t.getGridArrays(this.x, this.y, this.hitRange), A = 0; A < M.length;
                            ++A
                        )
                            for (b = 0; b < M[A].length; ++b)
                                (S = M[A][b]).health &&
                                    (T = s.getDistance(this.x, this.y, S.x, S.y)) <
                                    S.scale + this.hitRange &&
                                    (S.changeHealth(5 * -this.dmg) && t.disableObj(S),
                                     t.hitObj(S, s.getDirection(this.x, this.y, S.x, S.y)));
                        for (b = 0; b < i.length; ++b)
                            i[b].canSee(this) && c.send(i[b].id, "aa", this.sid);
                    }
                    if (r || E)
                        for (d = 0; d < i.length; ++d)
                            (S = i[d]) &&
                                S.alive &&
                                ((T = s.getDistance(this.x, this.y, S.x, S.y)),
                                 this.hitRange ?
                                 !this.hitWait &&
                                 T <= this.hitRange + S.scale &&
                                 (E ?
                                  ((I = s.getDirection(S.x, S.y, this.x, this.y)),
                                   S.changeHealth(-this.dmg),
                                   (S.xVel += 0.6 * Math.cos(I)),
                                   (S.yVel += 0.6 * Math.sin(I)),
                                   (this.runFrom = null),
                                   (this.chargeTarget = null),
                                   (this.waitCount = 3e3),
                                   (this.hitWait = s.randInt(0, 2) ? 0 : 600)) :
                                  (this.hitWait = this.hitDelay)) :
                                 T <= this.scale + S.scale &&
                                 ((I = s.getDirection(S.x, S.y, this.x, this.y)),
                                  S.changeHealth(-this.dmg),
                                  (S.xVel += 0.55 * Math.cos(I)),
                                  (S.yVel += 0.55 * Math.sin(I))));
                    this.xVel && (this.xVel *= Math.pow(a.playerDecel, e)),
                        this.yVel && (this.yVel *= Math.pow(a.playerDecel, e));
                    var P = this.scale;
                    this.x - P < 0 ?
                        ((this.x = P), (this.xVel = 0)) :
                    this.x + P > a.mapScale &&
                        ((this.x = a.mapScale - P), (this.xVel = 0)),
                        this.y - P < 0 ?
                        ((this.y = P), (this.yVel = 0)) :
                    this.y + P > a.mapScale &&
                        ((this.y = a.mapScale - P), (this.yVel = 0));
                }
            }),
                (this.canSee = function(e) {
                if (!e) return !1;
                if (e.skin && e.skin.invisTimer && e.noMovTimer >= e.skin.invisTimer)
                    return !1;
                var t = Math.abs(e.x - this.x) - e.scale,
                    n = Math.abs(e.y - this.y) - e.scale;
                return (
                    t <= (a.maxScreenWidth / 2) * 1.3 &&
                    n <= (a.maxScreenHeight / 2) * 1.3
                );
            });
            var h = 0,
                u = 0;
            (this.animate = function(e) {
                this.animTime > 0 &&
                    ((this.animTime -= e),
                     this.animTime <= 0 ?
                     ((this.animTime = 0), (this.dirPlus = 0), (h = 0), (u = 0)) :
                     0 == u ?
                     ((h += e / (this.animSpeed * a.hitReturnRatio)),
                      (this.dirPlus = s.lerp(0, this.targetAngle, Math.min(1, h))),
                      h >= 1 && ((h = 1), (u = 1))) :
                     ((h -= e / (this.animSpeed * (1 - a.hitReturnRatio))),
                      (this.dirPlus = s.lerp(0, this.targetAngle, Math.max(0, h)))));
            }),
                (this.startAnim = function() {
                (this.animTime = this.animSpeed = 600),
                    (this.targetAngle = 0.8 * Math.PI),
                    (h = 0),
                    (u = 0);
            }),
                (this.changeHealth = function(e, t, n) {
                if (
                    this.active &&
                    ((this.health += e),
                     n &&
                     (this.hitScare && !s.randInt(0, this.hitScare) ?
                      ((this.runFrom = n),
                       (this.waitCount = 0),
                       (this.moveCount = 2e3)) :
                      this.hostile && this.chargePlayer && n.isPlayer ?
                      ((this.chargeTarget = n),
                       (this.waitCount = 0),
                       (this.moveCount = 8e3)) :
                      this.dontRun ||
                      ((this.runFrom = n),
                       (this.waitCount = 0),
                       (this.moveCount = 2e3))),
                     e < 0 && this.hitRange && s.randInt(0, 1) && (this.hitWait = 500),
                     t &&
                     t.canSee(this) &&
                     e < 0 &&
                     c.send(
                        t.id,
                        "t",
                        Math.round(this.x),
                        Math.round(this.y),
                        Math.round(-e),
                        1,
                    ),
                     this.health <= 0 &&
                     (this.spawnDelay ?
                      ((this.spawnCounter = this.spawnDelay),
                       (this.x = -1e6),
                       (this.y = -1e6)) :
                      ((this.x = this.startX || s.randInt(0, a.mapScale)),
                       (this.y = this.startY || s.randInt(0, a.mapScale))),
                      (this.health = this.maxHealth),
                      (this.runFrom = null),
                      t && (o(t, this.killScore), this.drop)))
                )
                    for (var i = 0; i < this.drop.length;)
                        t.addResource(
                            a.resourceTypes.indexOf(this.drop[i]),
                            this.drop[i + 1],
                        ),
                            (i += 2);
            });
        };
    },
]);