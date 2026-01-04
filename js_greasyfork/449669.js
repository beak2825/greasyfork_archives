// ==UserScript==
// @name         Rainbow MOD
// @author       Frog PEPE#5852
// @version    1.9.1
// @description It no top script
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://abc.moomoo.io/*
// @icon         data:image/png;base64,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
// @require https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=912797
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @license none
// @namespace -
// @downloadURL https://update.greasyfork.org/scripts/449669/Rainbow%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/449669/Rainbow%20MOD.meta.js
// ==/UserScript==

/*
discord is rotator#2860

ws notes
packet = data
- receiving:
  - io-init = intialization
  - ch = chat; data[0] = unknown; data[1] = playerid; data[2] = message
  - 2 = other player came
        what super mod has to say about this:
        names[data[1][1]] ? names[data[1][1]] != data[1][2] ? (console.log("{", names[data[1][1]], "} => {", data[1][2], "} [", data[1][1], "]"), cPlayer && chat("{" + names[data[1][1]] + "} => {" + data[1][2] + "}")) : (console.log("{", names[data[1][1]], "} returned"), cPlayer && chat("{" + names[data[1][1]] + "} returned")) : (console.log("{", data[1][2], "} [", data[1][1], "]"), cPlayer && chat("{" + data[1][2] + "} [" + data[1][1] + "]")), names[data[1][1]] = data[1][2], theirPrimary[data[1][1]] = 0, theirSecondary[data[1][1]] = void 0;
  - 6 = something about buildings, idk. examine some hacks to find out about it (look in the anti trap section)
  - 7: i dont know much about that
  - 8 = mostly useless
  - 9 = you got a kill or something, idk
  - 10 = mostly useless
  - 11 = you died
  - 13 = player left or something, idk
  - 17 = something happens to your hotbar
  - 18
  - 33 = move
  - ac
  - h = hp change
    - data[2] = your hp
  - d = disconnect
-
//*/

// antiinvis
CanvasRenderingContext2D.prototype.rotatef = CanvasRenderingContext2D.prototype.rotate
CanvasRenderingContext2D.prototype.rotate = function(e){
    if(Math.abs(e) > 1e300) {
        e = Math.atan2(Math.cos(e), Math.sin(e));
        this.globalAlpha = 0.85;
        this.rotatef(e);
    } else {
        this.rotatef(e);
    }
};

//Start edit
setTimeout(() => {
    if (document.getElementById('gameName').innerHTML != 'Rainbow MOD') {
        document.getElementById("gameName").style.color = 'orang'
        alert("Warning: Mod may not be compatible with other mods. Use at your own risk.");
    }
    $("#ot-sdk-btn-floating").remove() // remove the cookie thing
    console.log("SetTimeout Happened..");
    $("#gameCanvas").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');
    $("#enterGame").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');
    document.getElementById('loadingText').innerHTML = "Loading Rainbow.";
    document.getElementById('loadingText').style.color = 'green'
    document.getElementById('gameName').innerHTML = 'Rainbow MOD';
    document.getElementById('errorNotification').remove();
    window.location.native_resolution = true;
    $("#consentBlock").css({display: "none"});
    $("#youtuberOf").css({display: "none"});
    $("#mapDisplay").css({background: `url('https://i.imgur.com/fgFsQJp.png')`});
    document.getElementById("moomooio_728x90_home").style.display = "none";
    $("#moomooio_728x90_home").parent().css({display: "none"});
    document.getElementById("linksContainer2").innerHTML = `<a href="https://www.youtube.com/" target="_blank" class="menuLink">YouTube</a> | <a href="https://discord.com/channels/@me" target="_blank" class="menuLink"> Discord </a> | <a href="https://youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" class="menuLink"> Little Bots </a> `
    //Edit end
}, 1200);
console.log("The mod is working.");
$("#gameCanvas").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');
$("#enterGame").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');
document.getElementById('loadingText').innerHTML = "Loading Rainbow.";
document.getElementById('gameName').innerHTML = 'Raibow mod';
document.getElementById("leaderboard").append('need new script');;
document.getElementById('errorNotification').remove();
//more fps:
window.location.native_resolution = true;
$("promoImgHolder").remove();
$("#consentBlock").css({display: "none"});
$("#youtuberOf").css({display: "none"});
$("#mapDisplay").css({background: `url('https://i.imgur.com/fgFsQJp.png')`});
document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById("linksContainer2").innerHTML = `<a href="https://www.youtube.com/" target="_blank" class="menuLink">YouTube</a> | <a href="https://discord.com/channels/@me" target="_blank" class="menuLink"> Discord </a> | <a href="https://youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" class="menuLink"> Little Bots </a> `
//Edit end
try {
    document.getElementById("moomooio_728x90_home").style.display = "none"; //Remove sidney's ads
    $("#moomooio_728x90_home").parent().css({display: "none"});
} catch (e) {
    console.log("error removing ad");
}

function login(username, sk=0) {
    doNewSend(['sp', [{name: username, skin: sk, mofoll: 1}]])
}

let mouseX;
let mouseY;

let width;
let height;

var animateyorn = true;
var doAdvAc1 = false;
var doAdvAc2 = false;
var animateInterval = 500;
var advAc2pos = 0;
var advAc = `get i30cpsmod
no unfair advantages
--
imagine cheating
--`.split('\n'); // change this to change advanced autochat type 1, make sure each line is or is below thirty characters long.
var advAc2 = "Imagine having to cheat through the use of unfair advantages to beat others in a cow game. Whoever does is pathetic. Stop the cheaters. Get i30cpsmod - no unfair advantages. Bring more light into mooomoo.io. bit.ly/i30cpsmod";
var advertisement = "Imagine having to cheat through the use of unfair advantages to beat others in a cow game. Whoever does is pathetic. Stop the cheaters. Get i30cpsmod - no unfair advantages. Bring more light into mooomoo.io. bit.ly/i30cpsmod";
var rickroll = `We're no strangers to love; You know the rules and so do I (do I); A full commitment's what I'm thinking of; You wouldn't get this from any other guy; I just wanna tell you how I'm feeling; Gotta make you understand; Never gonna give you up; Never gonna let you down; Never gonna run around and desert you; Never gonna make you cry; Never gonna say goodbye; Never gonna tell a lie and hurt you; We've known each other for so long; Your heart's been aching, but you're too shy to say it (say it); Inside, we both know what's been going on (going on); We know the game and we're gonna play it; And if you ask me how I'm feeling; Don't tell me you're too blind to see; Never gonna give you up; Never gonna let you down; Never gonna run around and desert you; Never gonna make you cry; Never gonna say goodbye; Never gonna tell a lie and hurt you; Never gonna give you up; Never gonna let you down; Never gonna run around and desert you; Never gonna make you cry; Never gonna say goodbye; Never gonna tell a lie and hurt you; We've known each other for so long; Your heart's been aching, but you're too shy to say it (to say it); Inside, we both know what's been going on (going on); We know the game and we're gonna play it; I just wanna tell you how I'm feeling; Gotta make you understand; Never gonna give you up; Never gonna let you down; Never gonna run around and desert you; Never gonna make you cry; Never gonna say goodbye; Never gonna tell a lie and hurt you; Never gonna give you up; Never gonna let you down; Never gonna run around and desert you; Never gonna make you cry; Never gonna say goodbye; Never gonna tell a lie and hurt you; Never gonna give you up; Never gonna let you down; Never gonna run around and desert you; Never gonna make you cry; Never gonna say goodbye; Never gonna tell a lie and hurt you`
function roll() {
    if (advAc2.substring(0, 1820) == rickroll) {advAc2 = advertisement}
    else {advAc2 = rickroll}
}
setInterval(() => { // if someone steals my advAc2 ill go find their house and rickroll them irl
    if(doAdvAc1) { // array autochat
        doNewSend(['ch', [advAc[advAc2pos++]]]);
    }
    else if(doAdvAc2) { // Long scroll autochat
        while (advAc2.length <= 30) {
            advAc2 += " || " + advAc2
        }
        if (advAc2.substring(advAc2.length - 30, advAc2.length) != advAc2.substring(0, 30)) {
            advAc2 += " || " + advAc2.substring(0, 30);
        }
        if (advAc2pos > advAc2.length - 30) {
            advAc2pos = 0;
        }
        doNewSend(['ch', [advAc2.substring(advAc2pos, advAc2pos + 30)]])
        advAc2pos += 2;
    } else {advAc2pos = 0}
    if(messageToggle == 1) { // default autochat
        doNewSend(["ch", [animate(true, animateyorn)]])
    }
}, animateInterval);

var angs = [[-135, -90, -45],
            [180, null, 0],
            [135, 90, 45]]; // angle for movement

var justClosed = false;

setInterval(() => {
    if(autoaim == true) {
        doNewSend(["2", [nearestEnemyAngle]]);
    }
    if (document.querySelector("#allianceMenu").style.display=='block') {
        if (holdingKeys.w || holdingKeys.a || holdingKeys.s || holdingKeys.d) {
            let xArea = 1;
            let yArea = 1;
            if (holdingKeys.w) yArea -= 1;
            if (holdingKeys.a) xArea -= 1;
            if (holdingKeys.s) yArea += 1;
            if (holdingKeys.d) xArea += 1;
            doNewSend(['33', [toRad(angs[yArea][xArea])]])
            justClosed = true;
        }
    } else if (justClosed) { // just closed it
        justClosed = false;
    }
}, 5);

setInterval(() => {
    // Fix advAc2
    while (advAc2.length <= 30) {
        advAc2 += " || " + advAc2
    }
    if (advAc2.substring(advAc2.length - 30, advAc2.length) != advAc2.substring(0, 30)) {
        advAc2 += " || " + advAc2.substring(0, 30);
    }

    // CpsTalk
    if (cpsTalk) {
        doNewSend(['ch', ["Clicks/Sec. - " + cps + " - By i30cps"]])
    }
}, 500)

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

var holdingKeys = {w: false, a: false, s: false, d: false}

var cpsTalk = false;
var nearestEnemy;
var nearestEnemyAngle;
var isEnemyNear;
var primary;
var instapike = true;
var instaCHAT = true;
var secondary;
var foodType;
var wallType;
var spikeType;
var millType;
var mineType;
var boostType;
var fdng = true;
var turretType;
var spawnpadType = 20;
var autoaim = false;
var tick = 1;
var oldHat;
var oldAcc;
var enemiesNear;
var normalHat;
var normalAcc;
var ws;
var searchp = true;
var msgpack5 = msgpack;
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
let hatToggle = 1;
var letChatToggle = 1;
document.logPackets = false;

var interv = setInterval(() => {
    if(!(localStorage.i30cps_MENU==undefined)){document.querySelector("#menuchanger").innerText = "Menu Key: "+localStorage.i30cps_MENU+" - Click this text and press a key to change it!";}
    if (document.querySelector("#menuchanger").innerText == "Menu Key: "+localStorage.i30cps_MENU+" - Click this text and press a key to change it!") {
        clearInterval(interv);
    }
}, 500);

if (localStorage.i30cps!='true') {
    localStorage.i30cps = !0;
    localStorage.i30cps_MENU = 'Escape';
    localStorage.i30cps_SPIKE = 'v';
    localStorage.i30cps_BOOST = 'f';
    localStorage.i30cps_MILL = 'n';
    localStorage.i30cps_TURRET = 'h';
    localStorage.i30cps_WALL = 'l';
    localStorage.i30cps_SPAWNPAD = 'k';
}

var nocommand = ["ach1", "spikechanger", "millchanger", "boostchanger", "turretchanger", "chatbox", "allianceinput"]

function decorate(message) {
    let result = ''
    for (let i = 0; i < message.length; i++) {
        Math.random() < 0.1 ? result += '~' : (Math.random() < 0.1 ? result += '-' : result += message[i]);
    }
    return result;
}

document.msgpack = msgpack;

WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    if (!ws) {
        document.ws = this;

        ws = this;
        socketFound(this);
    }
    if (document.logPackets) { // intercept and log the packet
        if (!(document.doNotLog.includes(msgpack.decode(m)[0].toString()))) console.log(msgpack.decode(m));
    }
    this.oldSend(m);
};

document.addEventListener('mousedown', (e) => {
    cps += 1;
    setTimeout(() => {cps = 99}, 960);
});

document.addEventListener('keydown', (e) => {
    if (e.code == 'Space') {
        cps += 1;
        setTimeout(() => {cps -= 1}, 960);
    }
})

document.doNotLog = ['2', 'pp', '33', 'ch']

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
    if (item == 'an') {
        if (tabs.includes(data[1][0])) {
            doNewSend(['11', [data[1], '1']])
        }
    }
    if (item == "1" && myPlayer.id == null){
        myPlayer.id = data[1];
        myID = data[1];
        if (!tabs.includes(myID)) {
            tabs.push(myID);
        }
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
    if(enemiesNear) {
        nearestEnemy = enemiesNear.sort((a,b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
    }
    if(nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2]-myPlayer.y, nearestEnemy[1]-myPlayer.x);
        if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 300) {
            isEnemyNear = true;
            if(autoaim == false && myPlayer.hat != 7 && myPlayer.hat != 53) {
                normalHat = 6;
                if(primary != 8) {
                    normalAcc = 21;
                }
            };
        }
    }
    if(isEnemyNear == false && autoaim == false) {
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
document.doNewSend = doNewSend;

/* Hat/Acc Debug */

function acc(id) {
    doNewSend(["13c", [0, 0, 1]]);
    doNewSend(["13c", [0, id, 1]]);
}

function hat(id) {
    doNewSend(["13c", [0, id, 0]]);
}

function placeF(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}

function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}

function slot(id) {
    doNewSend(["5", [id, null]])
}

function katana() {
    doNewSend([6, [4]])
}

document.addEventListener('keydown', (e)=>{
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        if (e.code == 'KeyW') holdingKeys.w = true;
        else if (e.code == 'KeyA') holdingKeys.a = true;
        else if (e.code == 'KeyS') holdingKeys.s = true;
        else if (e.code == 'KeyD') holdingKeys.d = true;
    }
    if (updateMenuKey) {
        updateMenuKey = false;
        localStorage.i30cps_MENU = e.code;
        document.querySelector("#menuchanger").innerText = "Menu Key: "+e.code+" - Click this text and press a key to change it!";
    }
    if (e.keyCode == 46 && !nocommand.includes(document.activeElement.id.toLowerCase())) {
        const EDITION = 0;

        var head = document.getElementsByTagName('head')[0];
        var icon = document.createElement('link');

        icon.setAttribute('type', 'image/png');
        icon.setAttribute('rel', 'shortcut icon');

        if (EDITION == 0) icon.setAttribute('href', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAA3NCSVQICAjb4U/gAAABHVBMVEX///9FRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUXt7e3r6+vp6enn5+fl5eXj4+Ph4eHf39/d3d3b29vZ2dnX19fV1dXT09PR0dHPz8/MzMzJycnHx8fFxcXDw8PBwcG/v7+9vb27u7u5ubm3t7e1tbWzs7OxsbGvr6+tra2rq6upqamnp6elpaWjo6OhoaGfn5+dnZ2ZmZmVlZWTk5ORkZGPj4+NjY2Li4uJiYmHh4eFhYWDg4OBgYF+fn58fHx6enp4eHh2dnZ0dHRycnJwcHBubm5sbGxqampmZmZiYmJgYGBeXl5cXFxaWlpYWFhWVlZUVFRSUlJQUFBOTk5MTExKSkpISEhGRkZFRUUChAOfAAAAX3RSTlMAESIzRFVmd4iZqrvM3e7//////////////////////////////////////////////////////////////////////////////////////////////////////////4gnOa8AAAAJcEhZcwAACpwAAAqcAfTS3xIAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAFnRFWHRDcmVhdGlvbiBUaW1lADAzLzE3LzE3CP1IFgAADiFJREFUeJztnXsjG00XwJ8gaULYhLRudSlFL4RS9PKUVsuDEooIkc33/xiviMjuOWdusTOz+s7vX8maM5k9c25z5p9/HA6Hw+FwOBwOh8PhcDgcDofD4XA4HHpIdCdT6Uxftr9/oP7AQH9/ti+TTiW7E7bHp5FEdyqTDUhNM5DNpP7CaehKZrIi0YNkM8m/ZxK6Upl+FeFb9GdSXbbH/mi6Ur3CRc9joPcpT0Kys18erYR0t21JOqE7/aif/qnPQUpJ5cmQTdmWSZ5EOmrpm6SfxsaQyOgRv0HmCUyBpl+/Rdq2fAKe6RW/wTPbMnKIXvVRxFcdanz5w2RsS0qSjMTqkSObtC0txtjP3yRui6BH+u2/Lv36d70492pipJD37skXRiZezRXX//1VupZ9TjZWtqGU8q8efVt59dwT8GJmZeu4KvO8GG0H4r2/8nN1KieSvU1ueu1XRfjQ2NgE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');
        if (EDITION == 1) icon.setAttribute('href', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAA3NCSVQICAjb4U/gAAABNVBMVEX///9FRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUXfxlXdxFXcw1Xbw1XZwVTawVTXv1TVvVTTvFTSu1TPuVPRuVLNt1PLtVPJtFPIs1PGsVLFsVLEr1LDrlLBrVK/q1K9qlG6p1G5plG3pVG1o1CyoVCxoFCvnlCtnVCsm1CqmU+nl0+llU+jlE+hkk+gkU6fkE6dj06bjU6Yi06Zi06XiU2Uh02RhU2Pg02NgUyLgEyJfkyIfUyFe0yDeUuBeEt9dEt8c0t4cEp2bkp0bEpyakpwaUpuZ0ltZklqZEloYklmYUhmYEhlYEhjXkhiXUhgXEheWkhbWEdaV0dYVUdWU0dVUkdSUEZPTkZQTkZNTEZOTEZMS0ZKSkZKSUZISEVFRUVGRkXhDf0HAAAAZ3RSTlMAESIzRFVmd4iZqrvM3e7/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9O0EYAAAAAlwSFlzAAAKnAAACpwB9NLfEgAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDMvMTcvMTcI/UgWAAAJuElEQVR4nO2de1/URhSG5RKuC7NgVXBRRClaa3XFirRY74ooxVK8K1Jgk+//EbrLwrLJe+aWzCT8wnn+JLPhzOTM7cybkzNnGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGMYFfQMjY2E4NjLQV7QlBdA3ODIedhgfGTxVjdA71FX5TiMM9RZtV14MY+3bDBVtWS70VWT1D8PKKegIg/Lqtxgo2j7P9Iyo6x+GIz1F2+iTHoX7d7pBmVtA+/wPfKBoK/2h6f9HlHYc6DOrfxiWdS4wGADaVIq21A/S9Q9SyhVRr3n9w7CMq2ILByinC9jUPwyLttY9/XYN0F+0vc6h1gCbi7WJau3ev8SlwaLtdc4o1HGvLg6p78HF0aLtdQ6EQPbmRYefoQXGi7bXNbgK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');

        head.appendChild(icon);
    }
    if(e.keyCode == 38 && !nocommand.includes(document.activeElement.id.toLowerCase())) {
        if(letChatToggle) {messageToggle = (messageToggle + 1) % 2;}
    }
    if(e.key == "\\" && !nocommand.includes(document.activeElement.id.toLowerCase())) {
        doNewSend(["6", [4]]);
    }
    if(e.keyCode == 189 && !nocommand.includes(document.activeElement.id.toLowerCase())) {
        doNewSend(["6", [28]]);
        /*setTimeout(() => {
            doNewSend(["6", [25]]);
        }, 100);*/
    }
    if(e.key == localStorage.i30cps_BOOST && !nocommand.includes(document.activeElement.id.toLowerCase())) {
        slot(boostType);
    }
    if(e.key == localStorage.i30cps_MILL && !nocommand.includes(document.activeElement.id.toLowerCase())) {
        slot(millType);
    }
    if(e.key == localStorage.i30cps_SPIKE && !nocommand.includes(document.activeElement.id.toLowerCase())) {
        slot(spikeType)
    }
    if(e.key == localStorage.i30cps_TURRET && !nocommand.includes(document.activeElement.id.toLowerCase())) {
        doNewSend(["5", [turretType, null]])
    }
    if(e.key == localStorage.i30cps_WALL && !nocommand.includes(document.activeElement.id.toLowerCase())) {
        doNewSend(["5", [wallType, null]])
    }
    if(e.key == localStorage.i30cps_SPAWNPAD && !nocommand.includes(document.activeElement.id.toLowerCase())) {
        doNewSend(["5", [20, null]])
    }
    if(e.keyCode == 80 && !nocommand.includes(document.activeElement.id.toLowerCase())) {
        let sendPrompt = prompt("Send (Type Help for Help):").split(", ");

        if (sendPrompt.length == 2) {
            eval("doNewSend(["+sendPrompt[0]+", ["+sendPrompt[1]+"]])");
        } else if (sendPrompt.length == 3) {
            eval("doNewSend(["+sendPrompt[0]+", ["+sendPrompt[1]+", "+sendPrompt[2]+"]])");
        } else if (sendPrompt.length == 1 && sendPrompt[0].toLowerCase() == "help") {
            alert("6, 4 = Katana, 6, 25 = Spinning Spikes, 6, 28 = Power Mill, 6, 15 = Musket, 33, angle = Move, 2, angle = Aim, 5, id = Slot, 'c', 1, angle = start hit, c, 0, angle = stop hit")
        } else {
            alert("Ws Sender Error. Use a, b, c option format. Do not use brackets ( (), [], {} ).")
        }
    }
    if(e.keyCode == 76 && !nocommand.includes(document.activeElement.id.toLowerCase())) {
        let evals = prompt("Console Command: Available Commands: katana(), place(spikeType:millType:boostType:turretType, optionalangle):")
        eval(evals);
    }
    if(e.keyCode == 219 && !nocommand.includes(document.activeElement.id.toLowerCase())) {
        doAdvAc2 = !doAdvAc2;
    }
})

document.addEventListener('keyup', (e) => {
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        if (e.code == 'KeyW') holdingKeys.w = false;
        else if (e.code == 'KeyA') holdingKeys.a = false;
        else if (e.code == 'KeyS') holdingKeys.s = false;
        else if (e.code == 'KeyD') holdingKeys.d = false;
    }
    if (document.querySelector("#allianceMenu").style.display=='block') doNewSend(['33', []])
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

var updateMenuKey = false;

document.title = "Rainbow Mod"

function update() {
    // find the slots for everything
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

    spawnpadType = 20;
}

try {
    document.getElementById("moomooio_728x90_home").style.display = "none";
    $("moomooio728x90_home").parent().css({display: "none"});
} catch (e) {
    console.log("There was an error removing the ads.");
}


var menuChange = document.createElement("div");
menuChange.className = "menuCard";
menuChange.id = "mainSettings";
menuChange.innerHTML = `
<div id="simpleModal" class="modal">
<div class="modal-content">
<div class="modal-header">
<span class="closeBtn">&times;</span>
<h2 style="font-size: 17px;">Settings</h2>
</div>
<div class="modal-body" style="font-size: 17px;">
<div class="modal-content" style="font-size:14px">
<p>This mod does not give any unfair advantages. Alt = Open Menu, P = WS Sender L = Console Command, Up Arrow=Autochat, Dash (-) = Power Mill, Backslash (\\) = Katana. To spawn a bot: Press L and type bot(). To find bot's owner: say owner.</p>
</div>
<div class="flexControl">
<a id="menuchanger">Menu Key: Escape - Click this text and press a key to change it!</a>
<h3 style="font-size: 17px;"> Settings </h3>
<label class="container">Show biomes on the map?
<input type="checkbox" id="myCheck" checked="true">
<span class="checkmark"></span>
</label>
<label class="container">Bigger shop?
<input type="checkbox" id="bigShop">
<span class="checkmark"></span>
</label>
<label class="container">Aim Cursor?
<input type="checkbox" id="myCheck3" checked="true">
<span class="checkmark"></span>
</label>
<label class="container">Advertisement bots join your clan?
<input type="checkbox" id="customBotClan">
<span class="checkmark"></span>
</label>
<label class="container">Advertisement bots let everyone join their clan?
<input type="checkbox" id="botClanOpen" checked="true">
<span class="checkmark"></span>
</label>
<label for="wallchanger" class="container">Wall Key:</label><input type="text" id="wallchanger" value="t"><label for="spikechanger" class="container">Spike Key:</label>
<input type="text" id="spikechanger" value="v"><label for="millchanger" class="container">Windmill Key:
</label><input type="text" id="millchanger" value="z"><label for="boostchanger" class="container">Boost/Trap Key:</label>
<input type="text" id="boostchanger" value="f"><label for="turretchanger" class="container">Turret/Teleporter/Other Key:</label>
<input type="text" id="turretchanger" value="g"><label for="spawnpadchanger" class="container">Spawn Pad Key:</label><input type="text" id="spawnpadchanger" value="b">
<h3 style="font-size: 17px;"> Autochat settings </h3>
<label class="container">AutoChat Animation?
<input type="checkbox" checked="true" id="myCheck2">
<span class="checkmark"></span>
</label>
<br>AutoChat:<input type="text" value="bit.ly/i30cpsmod not unfair" id="ach1" width="100" height="50"/><br>
</div>
</div>
</div>
</div>`
document.body.appendChild(menuChange)

setTimeout(() => { // buffer for modal to load
    document.getElementById("spikechanger").value = localStorage.i30cps_SPIKE;
    document.getElementById("millchanger").value = localStorage.i30cps_MILL;
    document.getElementById("boostchanger").value = localStorage.i30cps_BOOST;
    document.getElementById("turretchanger").value = localStorage.i30cps_TURRET;
    document.getElementById("wallchanger").value = localStorage.i30cps_WALL;
    document.getElementById("spawnpadchanger").value = localStorage.i30cps_SPAWNPAD;
    setTimeout(() => { // buffer for modal to update
        setInterval(() => {
            localStorage.i30cps_SPIKE = document.getElementById("spikechanger").value.toLowerCase();
            localStorage.i30cps_MILL = document.getElementById("millchanger").value.toLowerCase();
            localStorage.i30cps_BOOST = document.getElementById("boostchanger").value.toLowerCase();
            localStorage.i30cps_TURRET = document.getElementById("turretchanger").value.toLowerCase();
            localStorage.i30cps_WALL = document.getElementById("wallchanger").value.toLowerCase();
            localStorage.i30cps_SPAWNPAD = document.getElementById("spawnpadchanger").value.toLowerCase();
        }, 500);
    }, 1000);
}, 500);

var styleItem = document.createElement("style");
styleItem.type = "text/css";
styleItem.appendChild(document.createTextNode(`
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
.menuPrompt {
font-size: 17px;
font-family: 'Hammersmith One';
color: #4A4A4A;
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
background: #4287f5;
padding: 15px;
color: #fff;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
}

.modal-body {
padding: 10px 20px;
background: #fff;
}

.modal-footer {
background: #cf2727;
padding: 10px;
color: #fff;
text-align: center;
border-bottom-left-radius: 5px;
border-bottom-right-radius: 5px;
}

.closeBtn {
color: #ccc;
float: right;
font-size: 30px;
color: #fff;
}

.closeBtn:hover,
.closeBtn:focus {
color: #000;
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
background-color: #eee;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
background-color: #ccc;
}

/* When the checkbox is checked, add a red background */
.container input:checked ~ .checkmark {
background-color: #cf2727;
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
document.head.appendChild(styleItem);


$("#adCard").css({display: "none"});


window.addEventListener('keydown', function(e) {
    if (e.code == localStorage.i30cps_MENU){
        if (modal.style.display != "block") {
            modal.style.display = "block";
        } else {
            modal.style.display = "none";
        }
    }
})

// Get modal element
var modal = document.getElementById("simpleModal");
// Get close button
var closeBtn = document.getElementsByClassName('closeBtn')[0];

// Events
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

// Close
function closeModal() {
    modal.style.display = 'none';
}

// Close If Outside Click
function outsideClick(e) {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
}

// Menu Key Changer
document.querySelector("#menuchanger").onclick = (e) => {updateMenuKey = true;}

document.querySelector("#myCheck").addEventListener('change', function() {
    if (this.checked) {
        $("#mapDisplay").css({background: `url('https://i.imgur.com/fgFsQJp.png')`});
    } else {
        $("#mapDisplay").css({background: `rgba(0, 0, 0, 0.25)`})
    }
})

document.querySelector("#myCheck2").addEventListener('change', function() {
    if (this.checked) {
        animateyorn = true;
    } else {
        animateyorn = false;
    }
})

document.querySelector("#myCheck3").addEventListener('change', function() {
    if (this.checked) {
        $("#gameCanvas").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');
    } else {
        document.getElementById("gameCanvas").style.cursor = 'default';
    }
})

document.querySelector("#bigShop").addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('storeHolder').style = 'height: 1500px; width: 450px';
    } else {
        document.getElementById('storeHolder').style = '';
    }
})

var customBotClan = false;
document.querySelector('#customBotClan').addEventListener('change', function() {
    if (this.checked) {
        customBotClan = true;
    } else {
        customBotClan = false;
    }
})

var openBotClan = true;
document.querySelector('#botClanOpen').addEventListener('change', function() {
    if (this.checked) openBotClan = true;
    else openBotClan = false;
})

function animate(space, animateyn) {
    let result = '';
    if (space) {
        result = document.getElementById("ach1").value;
    } else {
        result = ""
    }
    if (animateyn) {
        let place = Math.floor(Math.random()*result.length);
        result = result.substring(0, place) + "_" + result.substring(place+1, result.length);
    }
    return result;
}

unsafeWindow.admob = {
    requestInterstitialAd: ()=>{},
    showInterstitialAd: ()=>{}
}

var cps = 100;
var CpsMenu = document.createElement("div");
CpsMenu.style.padding = "5px";
CpsMenu.id = "CpsDiv";
CpsMenu.style.font = "40px Arial";
CpsMenu.style.display = "block";
CpsMenu.style.position = "fixed";
CpsMenu.style.top = "3%";
CpsMenu.style.left = "0%";
CpsMenu.textContent = "clicks:";
document.body.appendChild(CpsMenu);
setInterval(()=>{
    CpsMenu.textContent = "bro its clicks:"+cps;
}, 5);


document.donotrespondtothis = ['33', 'h', '5', '7', 'a', 'ch', 'mm'];

document.dnpush = (e) => {
    document.donotrespondtothis.push(e);
}

var tabs = [];
var myID;
document.botDebug = false;
var botClan;
var usedBot = false;

const captcha = '6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ';
const generateToken = () => unsafeWindow.grecaptcha.execute(captcha, { action : 'homepage' });
let botcount = (window.location.hostname == "sandbox.moomoo.io") ? 1 : 2;
const wait = async ms => new Promise(done => setTimeout(done, ms));
const connectBot = captcha => {
    let advertpos = 0;
    let nearestenemy;
    let enemyIsNear;
    let enemiesnear = [];
    let thingToSay = '';
    let token = encodeURIComponent(captcha);
    let advertBot = new WebSocket(document.ws.url.split("&")[0] + "&token=" + token);
    advertBot.binaryType = 'arraybuffer';
    advertBot.message = (data) => {
        advertBot.send(msgpack.encode(data));
    };
    if (!usedBot) {
        advertBot.isFirstBot = true;
        usedBot = true;
    } else {
        advertBot.isFirstBot = false;
    }

    let randAngle=0;
    let nearAngle = 0;
    advertBot.onopen = async () => {
        await wait(100);
        advertBot.message(['sp', [{name: 'Rainbow bot', moofoll: '1', skin: Math.floor(Math.random()*4)}]]);
        setInterval(() => {
            if (sayDiff) {
                advertBot.message(['ch', [thingToSay]])
            }
            advertpos += 3;
            if (advertpos > advAc2.length - 30) {
                advertpos = 0;
            }
            advertBot.message(['ch', [advAc2.substring(advertpos, advertpos + 30)]]);
        }, 500)
        setInterval(()=>{
            advertBot.message([2, [90**100]])
            if (!enemyIsNear) {
                advertBot.message(['33', [nearAngle]])
            } else {
                advertBot.message(['33', []])
            }
        }, 100);
        setInterval(() => {
            enemyIsNear = false;
        }, 15000)
        setInterval(() => {
            randAngle = Math.random() * 6.283185307179586;
            advertBot.message([5, [10, null]]);
            advertBot.message(['c', [1, 0]]);
            advertBot.message(['c', [0, 0]]);
            if (document.botDebug) console.log(advertBot.clan + ' :: ' + advertBot.x + ', ' + advertBot.y);
            setTimeout(() => {
                advertBot.message([5, [11, null]]);
                advertBot.message(['c', [1, 0]]);
                advertBot.message(['c', [0, 0]]);
                setTimeout(() => {
                    advertBot.message([5, [12, null]]);
                    advertBot.message(['c', [1, 0]]);
                    advertBot.message(['c', [0, 0]]);
                    setTimeout(() => {
                        advertBot.message(['c', [1, 0]]);
                        advertBot.message(['c', [0, 0]]);
                    }, 100);
                }, 100);
            }, 100);
        }, 5000);
    };
    let sayDiff = false;
    let nearbyPlayers = [];
    let nearbyEnemies = [];
    advertBot.chat = (message, duration) => {
        thingToSay = message;
        sayDiff = true;
        setTimeout(() => {
            sayDiff = false;
        }, duration)
    }
    advertBot.reClan = () => {
        if (advertBot.clan == null) {
            setTimeout(() => {
                if(advertBot.clan == null) {
                    doNewSend(['8', [decorate(String.fromCharCode(Math.floor(Math.random()*26)+65)+String.fromCharCode(Math.floor(Math.random()*26)+65)+String.fromCharCode(Math.floor(Math.random()*26)+65)+String.fromCharCode(Math.floor(Math.random()*26)+65)+String.fromCharCode(Math.floor(Math.random()*26)+65)+String.fromCharCode(Math.floor(Math.random()*26)+65)+String.fromCharCode(Math.floor(Math.random()*26)+65))]])
                    setTimeout(() => {
                        if (advertBot.clan == null) advertBot.reClan()
                        else {advertBot.message(['9', [null]])}
                    }, 500);
                }
            }, 5000);
        }
    }
    advertBot.clanUpdate = (joinSelfClan) => {
        if (joinSelfClan && myPlayer.clan && botClan && (myPlayer.clan!=botClan)) {
            advertBot.message(['9', [null]])
            botClan = false;
        }
        if (advertBot.clan == null) {
            if (myPlayer.clan && joinSelfClan) {
                advertBot.message(['10', [myPlayer.clan]]);
                botClan = false;
            } else if (advertBot.isFirstBot) {
                botClan = decorate('i30cps');
                advertBot.message(['8', [botClan]]);
            } else {
                advertBot.message(['10', [botClan]]);
            }
        } else if (!botClan) {
            botClan = advertBot.clan;
        }
    }
    advertBot.onmessage = message => {
        let temp = msgpack.decode(new Uint8Array(message.data));
        let data;
        if(temp.length > 1) {
            data = [temp[0], ...temp[1]];
        } else {
            data = temp;
        }
        let item = data[0];
        if(!data) {return};
        //if(!document.donotrespondtothis.includes(item)){console.log(data)}
        if (item == 'an') {
            console.log(data);
            console.log(tabs);
            if (tabs.includes(data[1]) || openBotClan) {
                advertBot.message(['11', [data[1], 1]])
            } else {
                advertBot.message(['11', [data[1], 0]])
            }
        }
        if (item == "h") {
            advertBot.message(['c', [1, 0]])
            advertBot.message(['c', [0, 0]])
            setTimeout(()=>{
                advertBot.message(["5", [0, null]]);
                advertBot.message(["c", [1, 0]]);
                advertBot.message(["c", [0, 0]]);
                advertBot.message(["5", [0, null]]);
                advertBot.message(["c", [1, 0]]);
                advertBot.message(["c", [0, 0]]);
            }, 100);
        } else if (item == '11') {
            advertBot.message(['sp', [{ name: 'i30cps bot', moofoll: '1', skin: Math.floor(Math.random() * 4)}]]);
        } else if (item === '1') {
            enemyIsNear = false;
            advertBot.id = data[1];
            if (!tabs.includes(advertBot.id)) {
                tabs.push(advertBot.id);
            }
            advertBot.clanUpdate(customBotClan);
        } else if (item === '33') {
            nearbyEnemies = [];
            for(let i = 0; i < data[1].length / 13; i++) {
                let playerInfo = data[1].slice(13*i, 13*i+13);
                if(playerInfo[0] == advertBot.id) {
                    advertBot.id = playerInfo[0];
                    advertBot.x = playerInfo[1];
                    advertBot.y = playerInfo[2];
                    advertBot.dir = playerInfo[3];
                    advertBot.object = playerInfo[4];
                    advertBot.weapon = playerInfo[5];
                    advertBot.clan = playerInfo[7];
                    advertBot.isLeader = playerInfo[8];
                    advertBot.hat = playerInfo[9];
                    advertBot.accessory = playerInfo[10];
                    advertBot.isSkull = playerInfo[11];
                } else {
                    nearbyPlayers.push(data[1].slice(13*i, 13*i+13))
                    if((playerInfo[7] != advertBot.clan || playerInfo[7] === null) && !(tabs.includes(playerInfo[0]))) {
                        nearbyEnemies.push(playerInfo);
                    }
                };
            };
            advertBot.clanUpdate(customBotClan);
        } else if (item == 'ch') {
            let isOwner = data[1] == myID;
            if ((!(data[1] == advertBot.id)) && (data[2].includes(document.querySelector("#nameInput").value))) {console.log(data[2]);}
            if (isOwner) {
                if (data[2].substring(0, 2) == 'i:') {
                    let datas = data[2].substring(0, 2).split(' ');
                    advertBot.message([datas[0]==undefined?null:datas[0], [datas[1]==undefined?null:datas[1], datas[2]==undefined?null:datas[2]]])
                } else if (data[2].substring(0, 2) == 'i!') {
                    eval(data[2].substring(2, data[2].length));
                }
            }
            if (data[2].substring(0, 2) == 'i.') { // commands
                if (isOwner) { // admin commands
                    if ((data[2] == 'i.dc') || (data[2] == 'i.disconnect')) for (let i = 0; i < 20; i++) advertBot.message(['sp', {name: "i30cps bot", skin: 1, moofoll: 1}]); // moomoo kicks after this
                    else if (data[2].substring(0, 4).toLowerCase() == 'i.ch') {
                        thingToSay = data[2].substring(5, 30);
                        sayDiff = true;
                    }
                }
            }
            if (data[2].includes('owner')) {
                advertBot.chat("[" + myPlayer.clan + "] " + document.querySelector("#nameInput").value + " {" + myPlayer.id + "}", 1000);
            }
        }

        if(nearbyEnemies) {
            nearestenemy = nearbyEnemies.sort((a,b) => dist(a, advertBot) - dist(b, advertBot))[0];
        }

        if(nearestenemy) {
            nearAngle = Math.atan2(nearestenemy[2]-advertBot.y, nearestenemy[1]-advertBot.x);
            let nearDist = Math.sqrt(Math.pow((advertBot.y-nearestenemy[2]), 2) + Math.pow((advertBot.x-nearestenemy[1]), 2));
            if(nearDist < 250) {
                enemyIsNear = false;
                nearAngle += 3.141592653;
            } else if (nearDist < 400) {
                enemyIsNear = true;
            } else {
                enemyIsNear = false;
            }
        } else {nearAngle = randAngle}
    };
};

function bot(notifi=true) {
    const promises = [generateToken()];
    Promise.all(promises).then(t => {
        console.log('generated ', t);
        if (notifi) alert('generated an i30cps bot that uses your advAc2: ' + t)
        connectBot(t[0]);
    });
}