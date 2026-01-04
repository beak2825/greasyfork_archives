// ==UserScript==
// @name ClodyMode
// @version    1.14.5
// @description By UrkePro|AutoHeal|;=4 Spikes|G=BoostPad+2 Spikes|All 100 on start|R=Insta...
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @grant UrkePro
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @namespace -
// ==/UserScript==

document.getElementById("youtubeFollow").remove();
document.getElementById("followText").style = "bottom: -0px;"
document.getElementById('errorNotification').remove();
document.getElementById("pingDisplay").remove();
$("#consentBlock").css({display: "none"});
$("#youtuberOf").css({display: "none"});
$("#mapDisplay").css({background: `url('https://i.imgur.com/fgFsQJp.png')`});

document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});

window.onbeforeunload = null;

let mouseX;
let mouseY;

let width;
let height;

setInterval(() => {
   if(clanToggle == 1) {
        doNewSend(["9", [null]]);
        doNewSend(["8", [animate(false, 5)]])
    }
    doNewSend(["testing", [6]]);
}, 200);

setInterval(() => {
    if(messageToggle == 1) {
        doNewSend(["ch", [animate(true, 5)]])
    }
}, 200);

setInterval(() => {
    if(autoaim == true) {
        doNewSend(["2", [nearestEnemyAngle]]);
    }
}, 0);

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

var nearestEnemy;
var nearestEnemyAngle;
var isEnemyNear;
var instaSpeed = 230;
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

let healSpeed = 70;
var messageToggle = 0;
var clanToggle = 0;
let healToggle = 1;
let hatToggle = 1;

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
                    normalAcc = 19
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
    if(item == "h" && data[1] == myPlayer.id) {
        if(data[2] < 100 && data[2] > 0 && healToggle == 1) {
            setTimeout( () => {
                place(foodType, null);
            }, healSpeed);

        }
    }
    update();
}


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


function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}

function boostSpike() {
    if(boostDir == null) {
        boostDir = nearestEnemyAngle;
    }
    place(spikeType, boostDir + toRad(90));
    place(spikeType, boostDir - toRad(90));
    place(boostType, boostDir);
    doNewSend(["33", [boostDir]]);
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

const healer = repeater(81, () => {place(foodType)}, 0);
const boostPlacer = repeater(70, () => {place(boostType)}, 0);
const spikePlacer = repeater(86, () => {place(spikeType)}, 0);
const millPlacer = repeater(78, () => {place(millType)}, 0);
const turretPlacer = repeater(72, () => {place(turretType)}, 0);
const boostSpiker = repeater(71, boostSpike, 0);

document.addEventListener('keydown', (e)=>{
    spikePlacer.start(e.keyCode);
    healer.start(e.keyCode);
    boostPlacer.start(e.keyCode);
    boostSpiker.start(e.keyCode);
    millPlacer.start(e.keyCode);
    turretPlacer.start(e.keyCode);

    if (e.keyCode == 79 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<5;i++){
             let angle = myPlayer.dir + toRad(i * 72);
             place(millType, angle)
        }
    }
    if (e.keyCode == 80 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<4;i++){
             let angle = myPlayer.dir + toRad(i * 90);
             place(wallType, angle)
        }
    }
    if (e.keyCode == 73 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<4;i++){
             let angle = myPlayer.dir + toRad(i * 90);
             place(boostType, angle)
        }
    }
    if (e.keyCode == 186 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<4;i++){
             let angle = myPlayer.dir + toRad(i * 90);
             place(spikeType, angle)
        }
    }
    if (e.keyCode == 72 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        place(turretType, myPlayer.dir + toRad(45));
        place(turretType, myPlayer.dir - toRad(45));
    }

    if (e.keyCode == 77 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        if (myPlayer.y < 2400){
            hat(15);
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            hat(31);
        } else {
	        hat(12);
        }
        acc(11);
    }

    if(e.keyCode == 82 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        autoaim = true;
        doNewSend(["5", [primary, true]]);
        doNewSend(["13c", [0, 7, 0]]);
        doNewSend(["13c", [0, 0, 1]]);
        doNewSend(["13c", [0, 19, 1]]);
        doNewSend(["c", [1]]);
        setTimeout( () => {
            doNewSend(["13c", [0, 53, 0]]);
            doNewSend(["5", [secondary, true]]);
        }, instaSpeed - 130);

        setTimeout( () => {
            doNewSend(["5", [primary, true]]);
            doNewSend(["c", [0, null]]);
            doNewSend(["13c", [0, 6, 0]]);
            autoaim = false;
        }, instaSpeed);
    }


    if(e.keyCode == 38 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        messageToggle = (messageToggle + 1) % 2;
    }

    if(e.keyCode == 40 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        clanToggle = (clanToggle + 1) % 2;
    }

    if(e.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        healToggle = (healToggle + 1) % 2;
        if(healToggle == 0) {
            if(hatToggle == 0) {
                document.title = "Heal: OFF | Hat: OFF"
            } else {
                document.title = "Heal: OFF | Hat: ON"
            }
        } else {
            if(hatToggle == 0) {
                document.title = "Heal: ON | Hat: OFF"
            } else {
                document.title = "Heal: ON | Hat: ON"
            }
        }
    }
    if(e.keyCode == 76 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        autoaim = true;
        doNewSend(["5", [secondary, true]]);
        doNewSend(["13c", [0, 53, 0]]);
        doNewSend(["c", [1]]);

        setTimeout( () => {
            doNewSend(["6", [12]]);
        }, 300);

        setTimeout( () => {
            doNewSend(["6", [15]]);
        }, 300);

        setTimeout( () => {
            doNewSend(["c", [0]]);
            doNewSend(["13c", [0, 6, 0]]);
            doNewSend(["5", [primary, true]]);
            autoaim = false;
        }, 300);
    }

    if(e.keyCode == 97 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [4]]);
    }

    if(e.keyCode == 98 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [15]]);
    }
    if(e.keyCode == 99 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [28]]);
    }
    if(e.keyCode == 105 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [28]]);
        doNewSend(["6", [25]]);
    }
    if(e.keyCode == 66 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        hatToggle = (hatToggle + 1) % 2;
        if(healToggle == 0) {
            if(hatToggle == 0) {
                document.title = "Heal: OFF | Hat: OFF"
            } else {
                document.title = "Heal: OFF | Hat: ON"
            }
        } else {
            if(hatToggle == 0) {
                document.title = "Heal: ON | Hat: OFF"
            } else {
                document.title = "Heal: ON | Hat: ON"
            }
        }
    }
})

document.addEventListener('keyup', (e)=>{
    spikePlacer.stop(e.keyCode);
    boostPlacer.stop(e.keyCode);
    boostSpiker.stop(e.keyCode);
    millPlacer.stop(e.keyCode);
    turretPlacer.stop(e.keyCode);
    healer.stop(e.keyCode);
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


document.title = "Heal: ON | Hat: ON"

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
}


(function() {
    'use strict';

    var ID_TankGear = 40;
    var ID_TurretGear = 53;


    document.addEventListener('keydown', function(e) {
        if(e.keyCode === 16 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(0);
        }
        else if (e.keyCode === 90 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_TankGear);
        }
        else if (e.keyCode === 67 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_TurretGear);
        }

    });

})();


$('#mapDisplay').css({
		'background': 'url("https://cdn1.imggmi.com/uploads/2019/3/1/057f0bed181b5fde3ae8fed17c498ca9-full.png")'
	});

function revertTitle(){
    f++;
    setTimeout(function(){
        f--;
        if (!f) {
            document.title = "Moo Moo";
        }
    }, 1500);
}

(function() {

var aV = [0,0];
var hZ =
    [
        [15, "Winter Cap"],
        [31, "Flipper Hat"],
        [12, "Booster Hat"],
        [19, "Shadow Wings"],
        [22, "Emp Helmet"],
        [6, "Soldier Helmet"],
        [7, "Bull Helmet"],
        [20, "Samurai"]
    ];
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
		document.title = "Bought";
	}
}

document.addEventListener('keydown', function(kfc) {
    if(!$(':focus').length) {
        switch (kfc.keyCode) {
            case 186: aV[0] = 1; aV[1] = 300; document.title = "Buying...."; kfc.preventDefault(); break;
            case 222: if(aV[0] === 1){aV[1] = 120; document.title = "Not buying....";} aV[0] = 0; kfc.preventDefault(); break;
            case 191: hF(0); kfc.preventDefault(); break; // Winter Cap [/]
            case 16: hF(1); kfc.preventDefault(); break; // Flipper Hat [shift]
            case 188: hF(2); kfc.preventDefault(); break; // Booster [,]
            case 77: hF(3); kfc.preventDefault(); break; // Emp Helmet [y]
            case 78: hF(4); kfc.preventDefault(); break; // Shadow Wings [n]
            case 66: hF(5); kfc.preventDefault(); break; // Soldier Helmet [b]
            case 75: hF(6); kfc.preventDefault(); break; // Bull Helmet [k]
            case 74: hF(7); kfc.preventDefault(); break; // Samurai [j]
        }
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

class Krunker {
    static patchHTML(html) {
        html = html.replace(/(<script src=".*?game.*?")(><\/script>)/, '$1 type="javascript/blocked" $2');
        html = html.replace(/<script src=".*?paypal.*?"><\/script>/, '');
        return html;
    }

    static get(url) {
        return new Promise(resolve => {
            fetch(url).then(res => res.text()).then(res => {
                return resolve(res);
            });
        });
    }

    static addGUI() {

        let htmlToInject = `
        <style>
        .label {
            display: inline;
            font-size: 75%;
            font-weight: 700;
            line-height: 1;
            color: #fff;
            text-align: center;
            white-space: nowrap;
            vertical-align: baseline;
            border-radius: .25em;
            padding: 7.5px
        }
        .label-warning {
            background-color: #5b52ea;
        }
        .pull-right {
            float: right!important;
        }
        .btn {
            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 5px;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.42857;
            white-space: nowrap;
            -moz-user-select: none;
            border: 1px solid transparent;
            border-radius: 4px;
        }
        .btn, .region-message {
            text-align: center;
        }
        .btn, img {
            vertical-align: middle;
        }
        .btn-success {
            color: #fff;
            background-color: #5cb85c;
            border-color: #4cae4c;
        }

        .hackMenu {
            position: absolute;
            left: 1.5em;
            top: 10em;
            color: #e74c3c;
            padding: 20px 20px;
            border-radius: 8px;
            font-family: 'Ubuntu';
            color: #e74c3c;
            z-index: 9999999999999999;
            min-height: 10px;
            min-width: 200px;
            background-color: rgba(0,0,0,.5);
            letter-spacing: 0.05em;
            margin-bottom: 0.1em;
        }
        </style>
        <div class="hackMenu">
        <center><b style="color: #FFFFFF;">KRUNKERIO.NET</br>KRUNKERIO.ORG</b></center>
        <hr>
        <b style="color: #FFFFFF;">Version: <span id="gameVersion" class="label label-warning pull-right" style="border-radius: 1px;"></span>
        <hr>
        <b style="color: #FFFFFF;">GUI: </b> <span class="label label-warning pull-right" style="border-radius: 1px;">MOVEABLE BOX</span>
        <hr>
        <b style="color: #FFFFFF;">Spinbot (J): </b> <span class="hack_spinbot label pull-right" style="border-radius: 1px;"></span>
        <br>
        <b style="color: #FFFFFF;">Aimbot (O):</b> <span class="hack_aimbot label pull-right" style="border-radius: 1px;"></span>
        <br>
        <b style="color: #FFFFFF;">Bhop (L): </b> <span class="hack_bhop label pull-right" style="border-radius: 1px;"></span>
        <br>
        <b style="color: #FFFFFF;">ESP (K): </b> <span class="hack_esp label pull-right" style="border-radius: 1px;"></span>
        `;

        $('body').append(htmlToInject);
        $('.hackMenu').draggable({ containment: "#gameUI", scroll: false });

        document.querySelector('.hack_spinbot').innerText = localStorage.spinbot ? 'ON' : 'OFF';
        document.querySelector('.hack_spinbot').style.background = localStorage.spinbot ? '#5cb85c' : '#ff0000';

        document.querySelector('.hack_aimbot').innerText = localStorage.aimbot ? 'ON' : 'OFF';
        document.querySelector('.hack_aimbot').style.background = localStorage.aimbot ? '#5cb85c' : '#ff0000';

        document.querySelector('.hack_esp').innerText = localStorage.esp ? 'ON' : 'OFF';
        document.querySelector('.hack_esp').style.background = localStorage.esp ? '#5cb85c' : '#ff0000';

        document.querySelector('.hack_bhop').innerText = localStorage.bhop ? 'ON' : 'OFF';
        document.querySelector('.hack_bhop').style.background = localStorage.bhop ? '#5cb85c' : '#ff0000';

        document.getElementById('gameVersion').innerText = window.version;

        document.getElementById('aMerger').style.display = 'none';
        document.getElementById('aContainer').style.display = 'none';

        window.addEventListener('keydown', (event) => {
            let char = event.key.toUpperCase();

            switch (char) {
                case 'J':
                    if (localStorage.spinbot) {
                        localStorage.removeItem('spinbot');
                    } else {
                        localStorage.setItem('spinbot', true);
                    }
                    document.querySelector('.hack_spinbot').innerText = localStorage.spinbot ? 'ON' : 'OFF';
                    document.querySelector('.hack_spinbot').style.background = localStorage.spinbot ? '#5cb85c' : '#ff0000';
                    break;

                case 'O':
                    if (localStorage.aimbot) {
                        localStorage.removeItem('aimbot');
                    } else {
                        localStorage.setItem('aimbot', true);
                    }
                    document.querySelector('.hack_aimbot').innerText = localStorage.aimbot ? 'ON' : 'OFF';
                    document.querySelector('.hack_aimbot').style.background = localStorage.aimbot ? '#5cb85c' : '#ff0000';
                    break;

                case 'K':
                    if (localStorage.esp) {
                        localStorage.removeItem('esp');
                    } else {
                        localStorage.setItem('esp', true);
                    }
                    document.querySelector('.hack_esp').innerText = localStorage.esp ? 'ON' : 'OFF';
                    document.querySelector('.hack_esp').style.background = localStorage.esp ? '#5cb85c' : '#ff0000';
                    break;

                case 'L':
                    if (localStorage.bhop) {
                        localStorage.removeItem('bhop');
                    } else {
                        localStorage.setItem('bhop', true);
                    }
                    document.querySelector('.hack_bhop').innerText = localStorage.bhop ? 'ON' : 'OFF';
                    document.querySelector('.hack_bhop').style.background = localStorage.bhop ? '#5cb85c' : '#ff0000';
                    break;
            }
        });
    }

    static patchGame(code) {

        code = code.replace(/{if\(this\.target\){.*?}},/g, `
            {
                window.controller = this;

                if (this.target) {
                    this.object.rotation.y = this.target.yD;
                    this.pitchObject.rotation.x = this.target.xD;

                    const half = Math.PI / 2;
                    this.pitchObject.rotation.x = Math.max(-half, Math.min(half, this.pitchObject.rotation.x));

                    this.yDr = this.pitchObject.rotation.x % Math.PI;
                    this.xDr = this.object.rotation.y % Math.PI;
                }
            }, this.camLookAt =
        `);

        code = code.replace(/this\.procInputs=function\(\w+,\w+,\w+\)\{/g, `
            $&

            let aimBot = document.querySelector('.hack_aimbot').innerText === 'ON';

            let targets = game.players.list.filter(player => {
                if (player.team && player.team === this.team) return;
                if (!player.active) return;
                if (!player.inView) return;
                if (player.isYou) return;
                return true;
            });

            let nearestTargets = targets.sort((p1, p2) => {
                var d1 = Math.hypot(this.x - p1.x, this.y - p1.y, this.z - p1.z);
                var d2 = Math.hypot(this.x - p2.x, this.y - p2.y, this.z - p2.z);
                return d1 - d2;
            });

            if (!!window.spinTicks && this.lastSpin && Date.now() - this.lastSpin > 750) {
                window.spinTicks = 0;
            }

            if (this.active && aimBot && nearestTargets.length > 0) {
                let target = nearestTargets.shift();
                let spinBot = document.querySelector('.hack_spinbot').innerText === 'ON';
                let distance = Math.hypot(this.x - target.x, this.y - target.y, this.z - target.z);

                let yPos = target.y + target.height - target.headScale - target.crouchVal * (target.height / 4) - (this.recoilAnimY * 0.3) * 25;

                let xPos = target.x - this.recoilX;
                let zPos = target.z - this.recoilZ;

                if (!spinBot || window.spinTicks > 4) {
                    controller.camLookAt(xPos, yPos, zPos);
                    controller.mouseDownR = 1;

                    if (this.aimVal < 0.1) {
                        controller.mouseDownL = +!controller.mouseDownL;
                    }
                } else if (spinBot) {
                    window.spinTicks++;

                    controller.object.rotation.y += 5;
                    controller.xDr += 5;

                    this.lastSpin = Date.now();
                    window.spinLocked = true;
                }
            } else if (controller.target) {
                controller.target = null;
                controller.mouseDownL = 0;
                controller.mouseDownR = 0;
            } else {
                window.spinTicks = 0;
                window.spinLocked = false;
            }
        `);

        code = code.replace(/this\.xDire=\(t\[2\]\|\|0\)\.round\(3\),this\.yDire=\(t\[3\]\|\|0\)\.round\(3\)/, 'this.xDire=(window.controller.object.rotation.y % Math.PI2).round(3),this.yDire=(window.controller.pitchObject.rotation.x % Math.PI2).round(3)');
        code = code.replace(/,(\w+.yDr=\(\w+.pitchObject.rotation.x%Math.PI2\).round\(3\),\w+.xDr=\(\w+.object.rotation.y%Math.PI2\).round\(3\))/g, ';if (!window.spinLocked) {$1}');
        code = code.replace(/\(\w+\.singlePlayer\?(Object\.keys\(\w+\.store\.skins\)\.map\(t=>t={ind:parseInt\(\w+\),cnt:1}\)):\w+\.skins\)/g, '$1');
        code = code.replace(/if\((!\w+\.inView)\)continue;/g, 'if ($1 && document.querySelector(".hack_esp").innerText === "OFF") continue;');
        code = code.replace(/!(\w+)\.transparent/g, '$& && (!$1.penetrable || !this.players.list.find(a => a.isYou).weapon.pierce)');
        code = code.replace(/(\w+)\.getAngleDist\(t\[2\],this\.xDire\);/, '$1.getAngleDist(this.xDire,this.xDire);');
        code = code.replace(/check2\((\w+)\)/g, '$1 * 500 - 13 / 10 ** 1.5 / Math.max($1, 100) + Math.min($1, 30)');
        code = code.replace(/(\w+)\.getAngleDist\(t\[3\],this\.yDire\)/, '$1.getAngleDist(this.yDire, this.yDire)');
        code = code.replace(/((\w+)\.meleeIndex)=(.*?),/g, '$1 = $2.isYou ? localStorage.meleeIndex : $3,');
        code = code.replace(/((\w+)\.skins)=(\w+)/g, '$1 = $2.isYou ? [localStorage.currentSkin, -1] : $3');
        code = code.replace(/\w+\.exports\.obj=function\((\w+,){8}\w+\){/g, '$& window.game = this;');
        code = code.replace(/(\w+\.exports\.camChase(Trn|Spd|Sen))=.*?,/g, '$1 = Infinity,');
        code = code.replace(/_\.config\.nameTags\|\|_\.mode\.hideNames\|\|/g, '');
        code = code.replace(/\w+\.exports\.camChaseDst=.*?,/g, '$1 = 0,');
        code = code.replace(/this\.newGeo=function\(t\){/g, '$& return;');
        code = code.replace(/;if\(L\|\|E.singlePlayer\)/g, ';if (true)');
        code = code.replace(/\.1<=((\w+)\.avgSpn)/g, 'Infinity < $1');
        code = code.replace(/CLICK TO PLAY/g, 'IOMODS.ORG CLICK TO PLAY');

        code += `
            (function() {
                var i = 0;

                setInterval(() => {
                    if (!window.game) {
                        location.reload();
                    }
                }, 500);

                window._selectSkin = window.selectSkin;
                window.selectSkin = function(id) {
                    localStorage.setItem('currentSkin', id);
                    return _selectSkin.apply(this, arguments);
                }

                function jump() {
                    var e = document.createEvent('HTMLEvents');
                    e.keyCode = 32;
                    e.initEvent(++i % 2 > 0 ? 'keyup' : 'keydown', false, true);
                    window.dispatchEvent(e);
                }

                setInterval(() => {
                    if (document.querySelector(".hack_bhop").innerText === "OFF") return;
                    var me = game.players.list.find(a => a.isYou);
                    if (me && me.onGround) jump();
                }, 50);
            })();
        `;

        return code;
    }
}

(async function () {
    if (window.location.pathname !== '/') return;

    const html = await Krunker.get('https://krunker.io');

    let errMessage = 'Join our website for updated script - iomods.org';

    try {
        window.version = html.match(/v[0-9.]{2,}/).shift().slice(1);
        if (window.version !== '1.5.3') return alert(errMessage);
        // Modifying anything can lead to a hacker flagged account
    } catch (err) {
        return alert(errMessage);
    }

    const build = html.match(/(?<=build=)[^"]+/)[0];
    const gameURL = `https://krunker.io/js/game.${build}.js?build=${build}`;

    const code = await Krunker.get(gameURL);

    var page = Krunker.patchHTML(html);
    var gameJS = Krunker.patchGame(code);

    document.open();
    document.write(page);
    document.close();

    try {
        eval(gameJS);
    } catch (err) {
        location.reload();
    }

    Krunker.addGUI();
})();


setTimeout(function() {
//tanitim belgeseli
var colorize,lnk,text,ministyler
lnk = ["SLITHERE.COM", "KRUNKERIO.ORG", "KRUNKERIO.NET", "SHELLSHOCKIO.ORG", "MOOMOOIOPLAY.COM", "SURVIVIO.INFO", "ZOMBSROYALEIO.ORG", "MOPE-IO.NET", "MOPEIOGAME.COM", "DIEPIOPLAY.COM", "DIEPIOPLAY.ORG", "SLITHERIOPLAY.ORG", "SKRIBBL-IO.NET", "SPINZ-IO.NET", "BONK-IO.NET", "TANKSMITHIO.ORG", "DEEEEP-IO.NET", "IOGAMESLIST.ORG", "IOMODS.ORG", "IO-OYUNLAR.COM"];
text = "<b>";
lnk.forEach(lnkfunc);
text += "</b>";

function lnkfunc(value) {
var value2 = value;
if(value == "SLITHERE.COM" || value == "KRUNKERIO.ORG" || value == "KRUNKERIO.NET") { colorize = true; } else { colorize = false; }
if(value == "MOPE-IO.NET") { value2="MOPEIO.NET"; } if(value == "BONK-IO.NET") { value2="BONKIO.NET"; } if(value == "SPINZ-IO.NET") { value2="SPINZIO.NET"; } if(value == "DEEEEP-IO.NET") { value2="DEEEEPIO.NET"; } if(value == "SKRIBBL-IO.NET") { value2="SKRIBBLIO.NET"; } if(value == "IO-OYUNLAR.COM") { value2="IOOYUNLAR.COM"; }
if(colorize == false){ministyler = "color:white;font-size:12px;padding:3px;";} else {ministyler = "color:yellow;font-size:12px;padding:3px;";}
text += '<a href="http://'+value+'" target="_blank" style="'+ministyler+'">'+value2+'</a> - ';
}

//genel isimlendirme ve ayarlar
 this.settings = {
            feature1: "Show FPS",
            feature2: "Aimbot",
            feature3: "Firebot",
            feature4: "Auto Respawn",
            feature5: "Change Colors",
            feature6: "TAB Key ON/OFF",
            feature7: "Faster Speed",
            feature8: "Aim Settings",
            feature9: "Extra Features+",
            feature10: "Adblock Plus+",
            feature11: "Zoom In/Out",
            feature12: "Rainbow BG",
            feature13: "Change BG",
     l1: "goo.gl/XCNoJL", //sl
     l2: "goo.gl/6kqrgN", //krnet
     l3: "goo.gl/FGU9pC", //krorg
     l4: "goo.gl/SXUzeF", //zrorg
     l5: "goo.gl/Lb1GKp", //surviv
     l6: "goo.gl/28tVmw", //skribb
     l7: "goo.gl/aHMmvA", //mope
     l8: "goo.gl/X8Lhyn", //moomoo
     l9: "goo.gl/JcfvKP", //shellshock
     l10: "goo.gl/af7rF6", //iogames
     l11: "goo.gl/JcfvKP", //shellshock
     l12: "goo.gl/9PX3kG", //dieporg
     l13: "goo.gl/uqFAWf", //diepcom
     string: "<a style=\"padding-right: 2px;\"></a><font color=\"black\">-</font><a style=\"padding-left: 6px;\"></a>",
     buttonpadder: "padding-left: 2px;",
     locationer: "location=yes,scrollbars=yes,status=yes,height=570,width=520",
     locationer2: "location=yes,scrollbars=yes,status=yes,left=800,height=570,width=520",
	 optionstyler: "pointer-events: all;font-weight:bold;color:black;font-size:14px;",
     optionstyler2: "pointer-events: all;font-weight:bold;color:black;font-size:14px;",
     optionstyler3: "pointer-events: all;color:black;font-size:11px;",
		formstyle: "pointer-events: all;border:2px solid black;border-radius:20px;padding:5px;background-color: rgba(245, 245, 245, 1.0);",
     fpsstyle: "border:1px solid black;border-radius:20px;padding:3px;width:80px;height:20px;font-size: 15px;text-align:center;background-color: rgba(0, 0, 0, 0.8);color:white;",
     tablostyle: "border:2px solid black;border-radius:20px;padding:5px;background-color: rgba(255, 255, 255, 0.3);",
     liststyler: "pointer-events: all;color:white;background-color: black;padding:3px;border-style:double;-webkit-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.39);-moz-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.39);box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.39);",
 	 imagelist: '<a href="https://instagram.com/aecicekdagi" target="_blank"><img src="https://iomods.org/mods/instagram.jpg"></a> <a href="https://www.youtube.com/c/pignuts" target="_blank"><img src="https://iomods.org/mods/youtube.jpg"></a> <a href="https://facebook.com/slitherecom" target="_blank"><img src="https://iomods.org/mods/facebook.jpg"></a></br>',
};

//degisenkisimlar
$('#a').html('<div style="'+this.settings.fpsstyle+'" id="fps" class="fps"></div></br><div style="'+this.settings.formstyle+'"><div class="option1"></div>'+this.settings.imagelist+'</div><div class="list1"></div>');
//general
$('.option1').html('<a style="'+this.settings.optionstyler+'" href="http://'+this.settings.l1+'" target="blank">'+this.settings.feature1+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' class="fps" onchange="window.open(\'http://'+this.settings.l1+'\', \'_blank\', \''+this.settings.locationer+'\');" checked></label>'+this.settings.string+'<a style="'+this.settings.optionstyler2+'" href="http://'+this.settings.l2+'" target="blank">'+this.settings.feature2+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l2+'\', \'_blank\', \''+this.settings.locationer+'\');"><span class=\'slider\'></span></label><div class="option2"></div>');
$('.option1').on('click', '.fps', function() { hideandseek(); });
$('.option2').html('<a style="'+this.settings.optionstyler+'" href="http://'+this.settings.l3+'" target="blank">'+this.settings.feature3+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l3+'\', \'_blank\', \''+this.settings.locationer+'\');"></label>'+this.settings.string+'<a style="'+this.settings.optionstyler2+'" href="http://'+this.settings.l4+'" target="blank">'+this.settings.feature4+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l4+'\', \'_blank\', \''+this.settings.locationer+'\');"></label><div class="option3"></div>');
$('.option3').html('<a style="'+this.settings.optionstyler+'" href="http://'+this.settings.l5+'" target="blank">'+this.settings.feature5+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l5+'\', \'_blank\', \''+this.settings.locationer+'\');"></label>'+this.settings.string+'<a style="'+this.settings.optionstyler2+'" href="http://'+this.settings.l6+'" target="blank">'+this.settings.feature6+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l6+'\', \'_blank\', \''+this.settings.locationer+'\');"></label><div class="option4"></div>');
$('.option4').html('<a style="'+this.settings.optionstyler+'" href="http://'+this.settings.l7+'" target="blank">'+this.settings.feature7+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l7+'\', \'_blank\', \''+this.settings.locationer+'\');"></label>'+this.settings.string+'<a style="'+this.settings.optionstyler2+'" href="http://'+this.settings.l8+'" target="blank">'+this.settings.feature8+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l8+'\', \'_blank\', \''+this.settings.locationer+'\');"></label><div class="option5"></div>');
$('.option5').html('<a style="'+this.settings.optionstyler+'" href="http://'+this.settings.l9+'" target="blank">'+this.settings.feature9+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l9+'\', \'_blank\', \''+this.settings.locationer+'\');"></label>'+this.settings.string+'<a style="'+this.settings.optionstyler2+'" href="http://'+this.settings.l10+'" target="blank">'+this.settings.feature10+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l10+'\', \'_blank\', \''+this.settings.locationer+'\');"></label><div class="option6"></div>');
$('.option6').html('<a style="'+this.settings.optionstyler+'" href="http://'+this.settings.l12+'" target="blank">'+this.settings.feature12+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' class="renkcont" onchange="window.open(\'http://'+this.settings.l12+'\', \'_blank\', \''+this.settings.locationer+'\');"></label>'+this.settings.string+'<a style="'+this.settings.optionstyler2+'" href="http://'+this.settings.l13+'" target="blank">'+this.settings.feature13+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'color\' class="bgcont" style="width: 1em;height:17px;" onchange="window.open(\'http://'+this.settings.l13+'\', \'_blank\', \''+this.settings.locationer+'\');"></label><div class="option7"></div>');
$('.option6').on('change', '.renkcont', function() { colorfulmod(); });
$('.option6').on('change', '.bgcont', function() { changebackground(); });
$('.option7').html('<a style="'+this.settings.optionstyler+'" href="http://'+this.settings.l11+'" target="blank">'+this.settings.feature11+'</a> <input name="zoom" id="zoom" type="number" style="width: 4em" min="70" max="140" step="1" value="100" class="zoom" oninput="amount.value=zoom.value;" onchange="window.open(\'http://'+this.settings.l11+'\', \'_blank\', \''+this.settings.locationer2+'\');"> <a style="'+this.settings.optionstyler3+'" href="http://'+this.settings.l11+'" target="blank">(Min: 70-Max: 140)</a>');
$('.option7').on('input', '.zoom', function(e) { zoominout(); });
$('.list1').html('<div style="'+this.settings.liststyler+'">'+text+'</div>');
    }, 0);

//fps counter
var before,now,fps
before=Date.now();
fps=0;
requestAnimationFrame(
    function loop(){
        now=Date.now();
        fps=Math.round(1000/(now-before));
        before=now;
    requestAnimationFrame(loop);
        document.getElementById('fps').innerHTML = 'FPS: ' + fps;
    }
);

if(window.location.href.indexOf("io-games.io") > -1 || window.location.href.indexOf("iogames.space") > -1 || window.location.href.indexOf("titotu.io") > -1) { location.replace("http://iogameslist.org"); }
function hideandseek() {
  var x = document.getElementById("fps");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

//background kismi degisir
function changebackground() {
    var changecolor =  $('.bgcont').val();
$('#a').css('background-color',''+changecolor+'');
}

var colorsrain;
var checkedrain=false;
function colorfulmod() {
    if(checkedrain==false) {
        checkedrain=true;
      colorsrain = ["#ff0000","#00ff00","#0000ff","#000000","#ffffff","#ff00ff","#00ffff","#981890","#ff7f00","#0085ff","#00bf00"];
    } else {
        checkedrain=false;
    colorsrain = ["transparent"];
    }
      setInterval(function() {
                 var bodybgarrayno = Math.floor(Math.random() * colorsrain.length);
                 var selectedcolor = colorsrain[bodybgarrayno];
                $("#a").css("background-color",selectedcolor);

      }, 3000);
}

//burda birsey degismesi gerekmez
function zoominout() {
    var findinput = $('.zoom').val();
    if(findinput >= 70 && findinput <= 140)
    {
    $('body').css('zoom',''+findinput+'%');
    } else { $('body').css('zoom','100%'); }
}

//CONSTANTS
const _fps = false;
const _bg = true;
const _edge = true;
const _colorEdge = true;
const _color = 0.25;
const _scoreboard = true;
const _names = true;
const _rawHealth = false;
const _healthBars = true;
const _achievements = true;
const _ui = true;
const _greenShapes = false;
const _solidBg = false;
const _mapViewport = false;

//COLOR CONSTANTS
const _squares = 0xffeb69;
const _triangles = 0xfc7677;
const _pentagons = 0x768dfc;
const _crashers = 0xf177dd;
const _redTeam = 0xf14e54;
const _blueTeam = 0x00b2e1;
const _greenTeam = 0x00e16e;
const _purpleTeam = 0xbf7ff5;
const _brownTeam = null;
const _fallenTeam = 0xc0c0c0;
const _summonerSquares = 0xfcc376;
const _shinyShapes = 0x89ff69; //Color of green shapes
const _barrels = 0x999999;
const _arenaClosers = 0xffe869;
const _ffaLeaderboard = 0x44ffa0;
const _tankBorders = 0x555555;
const _mazeWalls = 0xbbbbbb;
const _unknown = null;

const _gridAlpha = 0.1;
const _bgColor = 0xcdcdcd;
const _borderAlpha = 0.1;
const _borderColor = 0x000000;
const _minimapbgColor = 0xcdcdcd;
const _minimapOutline = 0x555555;

//COLOR VARS
var smashers = _tankBorders;
var barrels = _barrels;
var ffa_self = _blueTeam;
var blue_team = _blueTeam;
var red_team = _redTeam;
var purple_team = _purpleTeam;
var green_team = _greenTeam;
var shiny_shapes = _shinyShapes;
var squares = _squares;
var triangles = _triangles;
var pentagons = _pentagons;
var crashers = _crashers;
var arena_closers = _arenaClosers;
var ffa_leaderboard = _ffaLeaderboard;
var maze_walls = _mazeWalls;
var ffa_others = _redTeam;
var ffa_necro_squares = _summonerSquares;
var fallen_team = _fallenTeam;
var unknown = _unknown;

var gridAlpha = _gridAlpha;
var bgColor = _bgColor;
var borderAlpha = _borderAlpha;
var borderColor = _borderColor;
var minimapbgColor = _minimapbgColor;
var minimapOutline = _minimapOutline;

//3/9/17 - Initialize Overlay
window.overlay = {};
overlay.keyCode = 9;
overlay.toggle = false;
overlay.setColor = setColor;
overlay.setColorVar = setColorVar;
overlay.setbgColor = setbgColor;
overlay.setBorderColor = setBorderColor;
overlay.setminimapbgColor = setminimapbgColor;
overlay.setminimapOutline = setminimapOutline;
styleInit();
ren_overlay();

//OBJECT NAMES TO COLOR ID
var colorNames = new Map([
    ["smashers", 0],
    ["barrels", 1],
    ["ffa_self", 2],
    ["blue_team", 3],
    ["red_team", 4],
    ["purple_team", 5],
    ["green_team", 6],
    ["shiny_shapes", 7],
    ["squares", 8],
    ["triangles", 9],
    ["pentagons", 10],
    ["crashers", 11],
    ["arena_closers", 12], //Also neutral dominators
    ["ffa_leaderboard", 13],
    ["maze_walls", 14],
    ["ffa_others", 15],
    ["ffa_necro_squares", 16],
    ["fallen_team", 17],
    ["UNKNOWN", 18]
]);

//3/8/17 - Initialize typing detection
var isTyping = false;

//3/8/17 - Color Modes
var colorModeTextArray = [];
var changing = false;
var periodicFunction;

//8/27/17 - Announcement System Fixes
var homeConsole = false;

function onChange(){
    /*Place any script you want to execute here when color modes change - EX: clearInterval(periodicFunction);*/
}

function normal(){
    fps = _fps;
    bg = _bg;
    edge = _edge;
    colorEdge = _colorEdge;
    color = _color;
    scoreboard = _scoreboard;
    names = _names;
    rawHealth = _rawHealth;
    healthBars = _healthBars;
    achievements = _achievements;
    ui = _ui;
    greenShapes = _greenShapes;
    solidBg = _solidBg;
    mapViewport = _mapViewport;
    reloadSettings();
    input.set_convar("ren_background_color", _bgColor);
    input.set_convar("ren_grid_base_alpha", _gridAlpha);
    setColor("squares", _squares);
}

//Initialize toggle detection
var toggle = false;
var shift = false;
var ctrl = false;

//Initialize Values
var fps = _fps;
var bg = _bg;
var edge = _edge;
var colorEdge = _colorEdge;
var color = _color;
var scoreboard = _scoreboard;
var names = _names;
var rawHealth = _rawHealth;
var healthBars = _healthBars;
var achievements = _achievements;
var ui = _ui;
//3/7/17
var greenShapes = _greenShapes;
//3/8/17
var solidBg = _solidBg;
var mapViewport = _mapViewport;

//3/7/17 - FUNCTIONS - DO NOT MODIFY!!!
function setColor(id, c){
    if (colorNames.has(id)){
        id = colorNames.get(id);
    }
    input.execute("net_replace_color " + id.toString() + " " + c.toString());
}

function stl(input){
    if (input.toString() == "true"){
        return true;
    }else if (input.toString() == "false"){
        return false;
    }else{
        return null;
    }
}

function storageAvailable(type){
	try{
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e){
		return false;
	}
}

function loadSavedData(){
    if(!localStorage.getItem("fps")){
        localStorage.setItem("fps", fps);
    }else{
        fps = stl(localStorage.getItem("fps"));
    }
    if(!localStorage.getItem("bg")){
        localStorage.setItem("bg", bg);
    }else{
        bg = stl(localStorage.getItem("bg"));
    }
    if(!localStorage.getItem("edge")){
        localStorage.setItem("edge", edge);
    }else{
        edge = stl(localStorage.getItem("edge"));
    }
    if(!localStorage.getItem("colorEdge")){
        localStorage.setItem("colorEdge", colorEdge);
    }else{
        colorEdge = stl(localStorage.getItem("colorEdge"));
    }
    if(!localStorage.getItem("color")){
        localStorage.setItem("color", color);
    }else{
        color = parseFloat(localStorage.getItem("color"));
    }
    if(!localStorage.getItem("scoreboard")){
        localStorage.setItem("scoreboard", scoreboard);
    }else{
        scoreboard = stl(localStorage.getItem("scoreboard"));
    }
    if(!localStorage.getItem("names")){
        localStorage.setItem("names", names);
    }else{
        names = stl(localStorage.getItem("names"));
    }
    if(!localStorage.getItem("rawHealth")){
        localStorage.setItem("rawHealth", rawHealth);
    }else{
        rawHealth = stl(localStorage.getItem("rawHealth"));
    }
    if(!localStorage.getItem("healthBars")){
        localStorage.setItem("healthBars", healthBars);
    }else{
        healthBars = stl(localStorage.getItem("healthBars"));
    }
    if(!localStorage.getItem("ui")){
        localStorage.setItem("ui", ui);
    }else{
        ui = stl(localStorage.getItem("ui"));
    }
    if(!localStorage.getItem("achievements")){
        localStorage.setItem("achievements", achievements);
    }else{
        achievements = stl(localStorage.getItem("achievements"));
    }
    if(!localStorage.getItem("greenShapes")){
        localStorage.setItem("greenShapes", greenShapes);
    }else{
        greenShapes = stl(localStorage.getItem("greenShapes"));
    }
    if(!localStorage.getItem("solidBg")){
        localStorage.setItem("solidBg", solidBg);
    }else{
        solidBg = stl(localStorage.getItem("solidBg"));
    }
    if(!localStorage.getItem("mapViewport")){
        localStorage.setItem("mapViewport", mapViewport);
    }else{
        mapViewport = stl(localStorage.getItem("mapViewport"));
    }
    if(!localStorage.getItem("smashers")){
        localStorage.setItem("smashers", smashers);
    }else{
        smashers = localStorage.getItem("smashers");
    }
    if(!localStorage.getItem("barrels")){
        localStorage.setItem("barrels", barrels);
    }else{
        barrels = localStorage.getItem("barrels");
    }
    if(!localStorage.getItem("ffa_self")){
        localStorage.setItem("ffa_self", ffa_self);
    }else{
        ffa_self = localStorage.getItem("ffa_self");
    }
    if(!localStorage.getItem("blue_team")){
        localStorage.setItem("blue_team", blue_team);
    }else{
        blue_team = localStorage.getItem("blue_team");
    }
    if(!localStorage.getItem("red_team")){
        localStorage.setItem("red_team", red_team);
    }else{
        red_team = localStorage.getItem("red_team");
    }
    if(!localStorage.getItem("purple_team")){
        localStorage.setItem("purple_team", purple_team);
    }else{
        purple_team = localStorage.getItem("purple_team");
    }
    if(!localStorage.getItem("green_team")){
        localStorage.setItem("green_team", green_team);
    }else{
        green_team = localStorage.getItem("green_team");
    }
    if(!localStorage.getItem("fallen_team")){
        localStorage.setItem("fallen_team", fallen_team);
    }else{
        fallen_team = localStorage.getItem("fallen_team");
    }
    if(!localStorage.getItem("shiny_shapes")){
        localStorage.setItem("shiny_shapes", shiny_shapes);
    }else{
        shiny_shapes = localStorage.getItem("shiny_shapes");
    }
    if(!localStorage.getItem("squares")){
        localStorage.setItem("squares", squares);
    }else{
        squares = localStorage.getItem("squares");
    }
    if(!localStorage.getItem("triangles")){
        localStorage.setItem("triangles", triangles);
    }else{
        triangles = localStorage.getItem("triangles");
    }
    if(!localStorage.getItem("pentagons")){
        localStorage.setItem("pentagons", pentagons);
    }else{
        pentagons = localStorage.getItem("pentagons");
    }
    if(!localStorage.getItem("crashers")){
        localStorage.setItem("crashers", crashers);
    }else{
        crashers = localStorage.getItem("crashers");
    }
    if(!localStorage.getItem("arena_closers")){
        localStorage.setItem("arena_closers", arena_closers);
    }else{
        arena_closers = localStorage.getItem("arena_closers");
    }
    if(!localStorage.getItem("ffa_leaderboard")){
        localStorage.setItem("ffa_leaderboard", ffa_leaderboard);
    }else{
        ffa_leaderboard = localStorage.getItem("ffa_leaderboard");
    }
    if(!localStorage.getItem("maze_walls")){
        localStorage.setItem("maze_walls", maze_walls);
    }else{
        maze_walls = localStorage.getItem("maze_walls");
    }
    if(!localStorage.getItem("ffa_others")){
        localStorage.setItem("ffa_others", ffa_others);
    }else{
        ffa_others = localStorage.getItem("ffa_others");
    }
    if(!localStorage.getItem("ffa_necro_squares")){
        localStorage.setItem("ffa_necro_squares", ffa_necro_squares);
    }else{
        ffa_necro_squares = localStorage.getItem("ffa_necro_squares");
    }
    if(!localStorage.getItem("gridAlpha")){
        localStorage.setItem("gridAlpha", gridAlpha);
    }else{
        gridAlpha = localStorage.getItem("gridAlpha");
    }
    if(!localStorage.getItem("bgColor")){
        localStorage.setItem("bgColor", bgColor);
    }else{
        bgColor = localStorage.getItem("bgColor");
    }
    if(!localStorage.getItem("borderAlpha")){
        localStorage.setItem("borderAlpha", borderAlpha);
    }else{
        borderAlpha = localStorage.getItem("borderAlpha");
    }
    if(!localStorage.getItem("borderColor")){
        localStorage.setItem("borderColor", borderColor);
    }else{
        borderColor = localStorage.getItem("borderColor");
    }
    if(!localStorage.getItem("minimapbgColor")){
        localStorage.setItem("minimapbgColor", minimapbgColor);
    }else{
        minimapbgColor = localStorage.getItem("minimapbgColor");
    }
    if(!localStorage.getItem("minimapOutline")){
        localStorage.setItem("minimapOutline", minimapOutline);
    }else{
        minimapOutline = localStorage.getItem("minimapOutline");
    }
}

function saveData(){
    localStorage.setItem("fps", fps);
    localStorage.setItem("bg", bg);
    localStorage.setItem("edge", edge);
    localStorage.setItem("colorEdge", colorEdge);
    localStorage.setItem("color", color);
    localStorage.setItem("scoreboard", scoreboard);
    localStorage.setItem("names", names);
    localStorage.setItem("rawHealth", rawHealth);
    localStorage.setItem("healthBars", healthBars);
    localStorage.setItem("ui", ui);
    localStorage.setItem("achievements", achievements);
    localStorage.setItem("greenShapes", greenShapes);
    localStorage.setItem("solidBg", solidBg);
    localStorage.setItem("mapViewport", mapViewport);
    localStorage.setItem("smashers", smashers);
    localStorage.setItem("barrels", barrels);
    localStorage.setItem("ffa_self", ffa_self);
    localStorage.setItem("blue_team", blue_team);
    localStorage.setItem("red_team", red_team);
    localStorage.setItem("purple_team", purple_team);
    localStorage.setItem("green_team", green_team);
    localStorage.setItem("shiny_shapes", shiny_shapes);
    localStorage.setItem("squares", squares);
    localStorage.setItem("triangles", triangles);
    localStorage.setItem("pentagons", pentagons);
    localStorage.setItem("crashers", crashers);
    localStorage.setItem("arena_closers", arena_closers);
    localStorage.setItem("ffa_leaderboard", ffa_leaderboard);
    localStorage.setItem("maze_walls", maze_walls);
    localStorage.setItem("ffa_others", ffa_others);
    localStorage.setItem("ffa_necro_squares", ffa_necro_squares);
    localStorage.setItem("fallen_team", fallen_team);
    localStorage.setItem("gridAlpha", gridAlpha);
    localStorage.setItem("bgColor", bgColor);
    localStorage.setItem("borderAlpha", borderAlpha);
    localStorage.setItem("borderColor", borderColor);
    localStorage.setItem("minimapbgColor", minimapbgColor);
    localStorage.setItem("minimapOutline", minimapOutline);
}

function reloadSettings(){
    if (greenShapes){
        setColor("squares", shiny_shapes);
        setColor("triangles", shiny_shapes);
        setColor("pentagons", shiny_shapes);
        setColor("crashers", shiny_shapes);
    }else{
        setColor("squares", squares);
        setColor("triangles", triangles);
        setColor("pentagons", pentagons);
        setColor("crashers", crashers);
    }
    input.set_convar("ren_fps", fps);
    input.set_convar("ren_background", bg);
    input.set_convar("ren_stroke_soft_color", colorEdge);
    input.set_convar("ren_stroke_soft_color_intensity", color);
    if (!edge){
        input.set_convar("ren_stroke_soft_color", true);
        input.set_convar("ren_stroke_soft_color_intensity", 0);
    }
    input.set_convar("ren_scoreboard", scoreboard);
    input.set_convar("ren_names", names);
    input.set_convar("ren_raw_health_values", rawHealth);
    input.set_convar("ren_health_bars", healthBars);
    input.set_convar("ren_ui", ui);
    input.set_convar("ren_achievements", achievements);
    input.set_convar("ren_solid_background", solidBg);
    input.set_convar("ren_minimap_viewport", mapViewport);
    input.set_convar("ren_grid_base_alpha", gridAlpha);
    input.set_convar("ren_background_color", bgColor);
    input.set_convar("ren_border_color_alpha", borderAlpha);
    input.set_convar("ren_border_color", borderColor);
    input.set_convar("ren_minimap_background_color", minimapbgColor);
    input.set_convar("ren_minimap_border_color", minimapOutline);
    setColor("smashers", smashers);
    setColor("barrels", barrels);
    setColor("ffa_self", ffa_self);
    setColor("blue_team", blue_team);
    setColor("red_team", red_team);
    setColor("purple_team", purple_team);
    setColor("green_team", green_team);
    setColor("shiny_shapes", shiny_shapes);
    setColor("arena_closers", arena_closers);
    setColor("ffa_leaderboard", ffa_leaderboard);
    setColor("maze_walls", maze_walls);
    setColor("ffa_necro_squares", ffa_necro_squares);
    setColor("fallen_team", fallen_team);
    setColor("ffa_others", ffa_others);
}

function styleInit() {
    addGlobalStyle(`#styleSetting{padding: 0.2em; margin:0.2em; position: absolute;top: 0;right: 0;width: 30%;
    background-color: rgba(0,200,200,0.1);display:none;height: 1vh;line-height: 2vh;font-size: 2vh;}`);
    addGlobalStyle(".table{ display: table; text-align: center; width: 100%;height: 1vh;line-height: 2vh;font-size: 2vh;min-width: 100%;max-width: 100%;}");
    addGlobalStyle(".row{ display: table-row;height: 1vh;line-height: 2vh;font-size: 2vh;min-width: 100%;max-width: 100%;}");
    addGlobalStyle(`.cell{ display: table-cell; padding: 0px 0.3em;border: 1px solid black;height: 1vh;line-height: 2vh;font-size: 2vh;min-width: 100%;max-width: 100%;}`);
    addGlobalStyle(`.backRed{background-color:#f14e54}`);
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
}

function toggleOverlay(tf) {
    if (tf){
        document.querySelector('#styleSetting').style.display = "block";
    }else{
        document.querySelector('#styleSetting').style.display = "none";
    }
}
window.addEventListener('resize',
function flaotingDiv(){
    var zoomLevel = ((screen.width)/(window.innerWidth));
    var inverseZoom = ((window.innerWidth)/(screen.width));
    var h = document.getElementById("styleSetting");

    h.style.top = (((window.pageYOffset) + 5) * zoomLevel).toString() + "px";

    h.style.paddingLeft = ((((window.pageXOffset) + 5) * zoomLevel).toString()) + "px";

    h.style.zoom = inverseZoom;
});


function ren_overlay(){
    var title = `<div>Color Menu</div>`;
    var descr = `<div>Press TAB to toggle this menu.</div><div style="font-weight:bold;background-color:lightgray;"><a class="menuLink" href="https://goo.gl/XCNoJL" target="_blank" style="color:black;font-size:12px;">SLITHERE.COM</a> - <a class="menuLink" href="https://goo.gl/6kqrgN" target="_blank" style="color:black;font-size:12px;">KRUNKERIO.NET</a> - <a class="menuLink" href="https://goo.gl/FGU9pC" target="_blank" style="color:black;font-size:12px;">KRUNKERIO.ORG</a> - <a class="menuLink" href="https://zombsroyaleio.org" target="_blank" style="color:black;font-size:12px;">ZOMBSROYALEIO.ORG</a> - <a class="menuLink" href="https://goo.gl/9PX3kG" target="_blank" style="color:black;font-size:12px;">DIEPIOPLAY.COM</a> - <a class="menuLink" href="https://goo.gl/Lb1GKp" target="_blank" style="color:black;font-size:12px;">SURVIVIO.INFO</a> - <a class="menuLink" href="https://skribbl-io.net" target="_blank" style="color:black;font-size:12px;">SKRIBBLIO.NET</a> - <a class="menuLink" href="https://shellshockio.org" target="_blank" style="color:black;font-size:12px;">SHELLSHOCKIO.ORG</a> <hr> <a class="menuLink" href="https://bonk-io.net" target="_blank" style="color:black;font-size:12px;">BONK-IO.NET</a> - <a class="menuLink" href="https://mope-io.net" target="_blank" style="color:black;font-size:12px;">MOPE-IO.NET</a> - <a class="menuLink" href="https://mopeiogame.com" target="_blank" style="color:black;font-size:12px;">MOPEIOGAME.COM</a> - <a class="menuLink" href="https://moomooioplay.com" target="_blank" style="color:black;font-size:12px;">MOOMOOIOPLAY.COM</a> - <a class="menuLink" href="https://diepioplay.org" target="_blank" style="color:black;font-size:12px;">DIEPIOPLAY.ORG</a> - <a class="menuLink" href="https://iogameslist.org" target="_blank" style="color:black;font-size:12px;">IOGAMESLIST.ORG</a> - <a class="menuLink" href="https://pubgmobile.org" target="_blank" style="color:black;font-size:12px;">PUBGMOBILE.ORG</a></b></div><hr><div class="containerFreespace0"></div><a style="font-weight:bold;color:black;font-size:18px;" href="https://skribbl-io.net" target="blank">Aim Helper</a> <label style="padding-left: 2px;" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'https://mope-io.net\', \'_blank\', \'location=yes,scrollbars=yes,status=yes,height=570,width=520\');"><span class=\'slider\'></span></label><div class="containerFreespace2"></div><a style="font-weight:bold;color:black;font-size:18px;" href="https://moomooioplay.com" target="blank">Fire Bot</a> <label style="padding-left: 2px;" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'https://mopeiogame.com\', \'_blank\', \'location=yes,scrollbars=yes,status=yes,height=570,width=520\');"><span class=\'slider\'></span></label><div class="containerFreespace3"></div><a style="font-weight:bold;color:black;font-size:18px;" href="https://goo.gl/Lb1GKp" target="blank">Faster Run</a> <label style="padding-left: 2px;" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'https://goo.gl/Lb1GKp\', \'_blank\', \'location=yes,scrollbars=yes,status=yes,height=570,width=520\');"><span class=\'slider\'></span></label><div class="containerFreespace4"></div><a style="font-weight:bold;color:black;font-size:18px;" href="https://goo.gl/XCNoJL" target="blank">Faster Heal</a> <label style="padding-left: 2px;" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'https://goo.gl/XCNoJL\', \'_blank\', \'location=yes,scrollbars=yes,status=yes,height=570,width=520\');"><span class=\'slider\'></span></label><div class="containerFreespace5"></div><a style="font-weight:bold;color:black;font-size:18px;" href="https://goo.gl/6kqrgN" target="blank">Faster Fire</a> <label style="padding-left: 2px;" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'https://goo.gl/6kqrgN\', \'_blank\', \'location=yes,scrollbars=yes,status=yes,height=570,width=520\');"><span class=\'slider\'></span></label><div class="containerFreespace6"></div><a style="font-weight:bold;color:black;font-size:18px;" href="https://goo.gl/FGU9pC" target="blank">Higher Jump</a> <label style="padding-left: 2px;" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'https://goo.gl/FGU9pC\', \'_blank\', \'location=yes,scrollbars=yes,status=yes,height=570,width=520\');"><span class=\'slider\'></span></label><div class="containerFreespace7"></div><a style="font-weight:bold;color:black;font-size:18px;" href="https://mope-io.net" target="blank">Custom Aim Settings</a> <label style="padding-left: 2px;" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'https://skribbl-io.net\', \'_blank\', \'location=yes,scrollbars=yes,status=yes,height=570,width=520\');"><span class=\'slider\'></span></label><div class="containerFreespace8"></div><a style="font-weight:bold;color:black;font-size:18px;" href="https://mopeiogame.com" target="blank">Show FPS</a> <label style="padding-left: 2px;" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'https://moomooioplay.com\', \'_blank\', \'location=yes,scrollbars=yes,status=yes,height=570,width=520\');"><span class=\'slider\'></span></label><div class="containerFreespace9"></div><a style="font-weight:bold;color:black;font-size:18px;" href="https://zombsroyaleio.org" target="blank">Adblock Plus+</a> <label style="padding-left: 2px;" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'https://zombsroyaleio.org\', \'_blank\', \'location=yes,scrollbars=yes,status=yes,height=570,width=520\');"><span class=\'slider\'></span></label><div class="containerFreespace10"></div><a style="font-weight:bold;color:black;font-size:18px;" href="https://iogameslist.org" target="blank">.io Games List 2019</a> <label style="padding-left: 2px;" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'https://iogameslist.org\', \'_blank\', \'location=yes,scrollbars=yes,status=yes,height=570,width=520\');"><span class=\'slider\'></span></label><div class="containerFreespace11"></div>`;
    var colorPicker = function(id){return `{onFineChange:'overlay.setColorVar(${id}, this); '}`;};
    var _setbgColor = function(){return `{onFineChange:'overlay.setbgColor(this); '}`;};
    var _setBorderColor = function(){return `{onFineChange:'overlay.setBorderColor(this); '}`;};
    var _setminimapbgColor = function(){return `{onFineChange:'overlay.setminimapbgColor(this); '}`;};
    var _setminimapOutline = function(){return `{onFineChange:'overlay.setminimapOutline(this); '}`;};
    var body = `
            <div class="table">
                <div class="row">Background
                </div>
                <div class="row">
                    <div class="cell">Grid Base Alpha<br><span class="grid_base_value">0.3</span></div>
                    <div class="cell"><input type="range" name="grid_base_alpha" value="36"></div>
                </div>
                <div class="row">
                    <div class="cell">Border Alpha<br><span class="border_alpha_value">0.1</span></div>
                    <div class="cell"><input type="range" name="border_alpha" value="10"></div>
                </div>
                <div class="row">
                    <div class="cell">Background</div>
                    <div class="cell"><input class="jscolor ${_setbgColor()}"
                    value="cdcdcd"></div>
                </div>
                <div class="row">
                    <div class="cell">Border</div>
                    <div class="cell"><input class="jscolor ${_setBorderColor()}"
                    value="cdcdcd"></div>
                </div>
                <div class="row">Minimap
                </div>
                <div class="row">
                    <div class="cell">Background</div>
                    <div class="cell"><input class="jscolor ${_setminimapbgColor()}"
                    value="cdcdcd"></div>
                </div>
                <div class="row">
                    <div class="cell">Outline</div>
                    <div class="cell"><input class="jscolor ${_setminimapOutline()}"
                    value="000000"></div>
                </div>
                <div class="row">Environment
                </div>
                <div class="row">
                    <div class="cell">Self (FFA)</div>
                    <div class="cell"><input class="jscolor ${colorPicker(2)}"
                    value="00b1de"></div>
                </div>
                <div class="row">
                    <div class="cell">Barrels</div>
                    <div class="cell"><input class="jscolor ${colorPicker(1)}"
                    value="999999"></div>
                </div>
                <div class="row">
                    <div class="cell">Others (FFA)</div>
                    <div class="cell"><input class="jscolor ${colorPicker(15)}"
                    value="f14e54"></div>
                </div>
                <div class="row">
                    <div class="cell">Smasher Class Outlines</div>
                    <div class="cell"><input class="jscolor ${colorPicker(0)}"
                    value="555555"></div>
                </div>
                <div class="row">
                    <div class="cell">Blue team</div>
                    <div class="cell"><input class="jscolor ${colorPicker(3)}"
                    value="00b1de"></div>
                </div>
                <div class="row">
                    <div class="cell">Red Team</div>
                    <div class="cell"><input class="jscolor ${colorPicker(4)}"
                    value="f14e54"></div>
                </div>
                <div class="row">
                    <div class="cell">Purple Team</div>
                    <div class="cell"><input class="jscolor ${colorPicker(5)}"
                    value="c396e9"></div>
                </div>
                <div class="row">
                    <div class="cell">Green Team</div>
                    <div class="cell"><input class="jscolor ${colorPicker(6)}"
                    value="11d578"></div>
                </div>
                <div class="row">
                    <div class="cell">Fallen Team</div>
                    <div class="cell"><input class="jscolor ${colorPicker(17)}"
                    value="c0c0c0"></div>
                </div>
                <div class="row">
                    <div class="cell">Shiny Shapes</div>
                    <div class="cell"><input class="jscolor ${colorPicker(7)}"
                    value="89ff69"></div>
                </div>
                <div class="row">
                    <div class="cell">Squares</div>
                    <div class="cell"><input class="jscolor ${colorPicker(8)}"
                    value="ffe869"></div>
                </div>
                <div class="row">
                    <div class="cell">Triangles</div>
                    <div class="cell"><input class="jscolor ${colorPicker(9)}"
                    value="fc7677"></div>
                </div>
                <div class="row">
                    <div class="cell">Pentagons</div>
                    <div class="cell"><input class="jscolor ${colorPicker(10)}"
                    value="768dfc"></div>
                </div>
                <div class="row">
                    <div class="cell">Crashers</div>
                    <div class="cell"><input class="jscolor ${colorPicker(11)}"
                    value="f077dc"></div>
                </div>
                <div class="row">
                    <div class="cell">Arena Closers</div>
                    <div class="cell"><input class="jscolor ${colorPicker(12)}"
                    value="ffe869"></div>
                </div>
                <div class="row">
                    <div class="cell">Maze Walls</div>
                    <div class="cell"><input class="jscolor ${colorPicker(14)}"
                    value="bbbbbb"></div>
                </div>
                <div class="row">
                    <div class="cell">Necro Squares (FFA)</div>
                    <div class="cell"><input class="jscolor ${colorPicker(16)}"
                    value="fcc376"></div>
                </div>
                <div class="row">Miscellaneous
                </div>
                <div class="row">
                    <div class="cell">Leaderboard Fill (FFA)</div>
                    <div class="cell"><input class="jscolor ${colorPicker(13)}"
                    value="44ffa0"></div>
                </div>
            </div>`;
    var temp = `<div id="styleSetting"> ${title} ${body} ${descr} </div>`;
    document.querySelector('body').insertAdjacentHTML('afterend', temp);
    var it = document.querySelector('input[name="grid_base_alpha"]').addEventListener('input', function(e) {
        gridAlpha = (e.target.value - e.target.value % 2) / 100;
        document.querySelector('.grid_base_value').innerHTML = gridAlpha;
        reloadSettings();
    });
    it = document.querySelector('input[name="border_alpha"]').addEventListener('input', function(e) {
        borderAlpha = (e.target.value - e.target.value % 2) / 100;
        document.querySelector('.border_alpha_value').innerHTML = borderAlpha;
        reloadSettings();
    });
}

function hexToDec(hex){
    return parseInt(hex, 16);
}

function setColorVar(id, color){
    switch(parseInt(id)){
        case 0:
            smashers = hexToDec(color);
            break;
        case 1:
            barrels = hexToDec(color);
            break;
        case 2:
            ffa_self = hexToDec(color);
            break;
        case 3:
            blue_team = hexToDec(color);
            break;
        case 4:
            red_team = hexToDec(color);
            break;
        case 5:
            purple_team = hexToDec(color);
            break;
        case 6:
            green_team = hexToDec(color);
            break;
        case 7:
            shiny_shapes = hexToDec(color);
            break;
        case 8:
            squares = hexToDec(color);
            break;
        case 9:
            triangles = hexToDec(color);
            break;
        case 10:
            pentagons = hexToDec(color);
            break;
        case 11:
            crashers = hexToDec(color);
            break;
        case 12:
            arena_closers = hexToDec(color);
            break;
        case 13:
            ffa_leaderboard = hexToDec(color);
            break;
        case 14:
            maze_walls = hexToDec(color);
            break;
        case 15:
            ffa_others = hexToDec(color);
            break;
        case 16:
            ffa_necro_squares = hexToDec(color);
            break;
        case 17:
            fallen_team = hexToDec(color);
            break;
    }
    reloadSettings();
}

function setbgColor(color){
    bgColor = hexToDec(color);
    input.set_convar("ren_background_color", bgColor);
}

function setBorderColor(color){
    borderColor = hexToDec(color);
    input.set_convar("ren_border_color", borderColor);
}

function setminimapbgColor(color){
    minimapbgColor = hexToDec(color);
    input.set_convar("ren_minimap_background_color", minimapbgColor);
}

function setminimapOutline(color){
    minimapOutline = hexToDec(color);
    input.set_convar("ren_minimap_border_color", minimapOutline);
}

//3/8/17
function modeSet(){
    var typed = false;
    var modes = document.createElement("INPUT");
    abc.setAttribute("type", "text");
    abc.setAttribute("value", "Start typing!");
    abc.disabled = false;
    abc.setAttribute("style", "font-size:16px;position:absolute;top:0px;right:0px;");
    document.body.appendChild(abc);
}

document.addEventListener('keydown', function(event){
    if (event.keyCode == 36){
        homeConsole = !homeConsole;
    }
    if (homeConsole) return;
    if (event.keyCode == 27){
        fps = _fps;
        bg = _bg;
        edge = _edge;
        colorEdge = _colorEdge;
        color = _color;
        scoreboard = _scoreboard;
        names = _names;
        rawHealth = _rawHealth;
        healthBars = _healthBars;
        achievements = _achievements;
        ui = _ui;
        solidBg = _solidBg;
        mapViewport = _mapViewport;
        gridAlpha = _gridAlpha;
        greenShapes = _greenShapes;
        smashers = _tankBorders;
        barrels = _barrels;
        ffa_self = _blueTeam;
        blue_team = _blueTeam;
        red_team = _redTeam;
        purple_team = _purpleTeam;
        green_team = _greenTeam;
        squares = _squares;
        triangles = _triangles;
        pentagons = _pentagons;
        crashers = _crashers;
        arena_closers = _arenaClosers;
        ffa_leaderboard = _ffaLeaderboard;
        maze_walls = _mazeWalls;
        ffa_necro_squares = _summonerSquares;
        fallen_team = _fallenTeam;
        bgColor = _bgColor;
        borderAlpha = _borderAlpha;
        borderColor = _borderColor;
        minimapbgColor = _minimapbgColor;
        minimapOutline = _minimapOutline;
        shiny_shapes = _shinyShapes;
        input.set_convar("ren_fps", fps);
        input.set_convar("ren_stroke_soft_color", colorEdge);
        input.set_convar("ren_stroke_soft_color_intensity", color);
        input.set_convar("ren_achievements", achievements);
        input.set_convar("ren_names", names);
        input.set_convar("ren_scoreboard", scoreboard);
        input.set_convar("ren_raw_health_values", rawHealth);
        input.set_convar("ren_background", bg);
        input.set_convar("ren_health_bars", healthBars);
        input.set_convar("ren_ui", ui);
        //3/7/17
        input.execute(`net_replace_color 8 ${_squares}`);
        input.execute(`net_replace_color 9 ${_triangles}`);
        input.execute(`net_replace_color 10 ${_pentagons}`);
        input.execute(`net_replace_color 11 ${_crashers}`);
        //3/8/17
        input.set_convar("ren_solid_background", solidBg);
        input.set_convar("ren_minimap_viewport", mapViewport);
        input.set_convar("ren_grid_base_alpha", gridAlpha);
        input.set_convar("ren_background_color", bgColor);
        input.set_convar("ren_border_color_alpha", borderAlpha);
        input.set_convar("ren_border_color", borderColor);
        input.set_convar("ren_minimap_background_color", minimapbgColor);
        input.set_convar("ren_minimap_border_color", minimapOutline);
        setColor("smashers", _tankBorders);
        setColor("barrels", _barrels);
        setColor("ffa_self", _blueTeam);
        setColor("blue_team", _blueTeam);
        setColor("red_team", _redTeam);
        setColor("purple_team", _purpleTeam);
        setColor("green_team", _greenTeam);
        setColor("squares", _squares);
        setColor("triangles", _triangles);
        setColor("pentagons", _pentagons);
        setColor("crashers", _crashers);
        setColor("arena_closers", _arenaClosers);
        setColor("ffa_leaderboard", _ffaLeaderboard);
        setColor("maze_walls", _mazeWalls);
        setColor("ffa_necro_squares", _summonerSquares);
        setColor("fallen_team", _fallenTeam);
        toggle = true;
    }
    if (event.keyCode == 16) shift = true;
    if (event.keyCode == 17) ctrl = true;
    if (toggle === false){
        //Overlay activation - default: TAB
        if (event.keyCode == overlay.keyCode){
            event.preventDefault();
            overlay.toggle = !overlay.toggle;
            toggleOverlay(overlay.toggle);
            toggle = true;
        }
        //Ctrl
        if (ctrl === true){
            //? / / for load saved settings
            if (event.keyCode == 191){
                loadSavedData();
                reloadSettings();
            }
        }
        //Shift
        if (shift === true){
            //S for save
            if (event.keyCode == 83){
                if (storageAvailable('localStorage')){
                    saveData();
                }else{
                    alert("LocalStorage is not supported on your current browser, so save cannot be used!");
                }
                toggle = true;
            }
            //P for minimap viewport
            if (event.keyCode == 80){
                mapViewport = !mapViewport;
                input.set_convar("ren_minimap_viewport", mapViewport);
                toggle = true;
            }
            //Q for solid background
            if (event.keyCode == 81){
                solidBg = !solidBg;
                input.set_convar("ren_solid_background", solidBg);
                toggle = true;
            }
            //F for FPS
            if (event.keyCode == 70){
                fps = !fps;
                input.set_convar("ren_fps", fps);
                toggle = true;
            }
            //Z for background
            if (event.keyCode == 90){
                bg = !bg;
                input.set_convar("ren_background", bg);
                toggle = true;
            }
            //X for edges
            if (event.keyCode == 88){
                edge = !edge;
                colorEdge = false;
                if (edge === true){
                    input.set_convar("ren_stroke_soft_color_intensity", _color);
                    input.set_convar("ren_stroke_soft_color", false);
                }
                if (edge === false){
                    input.set_convar("ren_stroke_soft_color_intensity", 0.0);
                    input.set_convar("ren_stroke_soft_color", true);
                }
                toggle = true;
            }
            //V for colored edges
            if (event.keyCode == 86){
                colorEdge = !colorEdge;
                edge = true;
                if (colorEdge === true){
                    input.set_convar("ren_stroke_soft_color_intensity", _color);
                    input.set_convar("ren_stroke_soft_color", true);
                }
                if (colorEdge === false){
                    input.set_convar("ren_stroke_soft_color_intensity", 0.0);
                    input.set_convar("ren_stroke_soft_color", false);
                }
                toggle = true;
            }
            //B for scoreboard
            if (event.keyCode == 66){
                scoreboard = !scoreboard;
                input.set_convar("ren_scoreboard", scoreboard);
                toggle = true;
            }
            //N for names
            if (event.keyCode == 78){
                names = !names;
                input.set_convar("ren_names", names);
                toggle = true;
            }
            //M for raw health values
            if (event.keyCode == 77){
                rawHealth = !rawHealth;
                input.set_convar("ren_raw_health_values", rawHealth);
                toggle = true;
            }
            //9 for health bars
            if (event.keyCode == 57){
                healthBars = !healthBars;
                input.set_convar("ren_health_bars", healthBars);
                toggle = true;
            }
            //9 for UI
            if (event.keyCode == 48){
                ui = !ui;
                input.set_convar("ren_ui", ui);
                toggle = true;
            }
            //[ for achievements
            if (event.keyCode == 219){
                achievements = !achievements;
                input.set_convar("ren_achievements", achievements);
                toggle = true;
            }
            //- for lighter color
            if (event.keyCode == 189){
                color -= 0.05;
                input.set_convar("ren_stroke_soft_color_intensity", color);
            }
            //+ for darker color
            if (event.keyCode == 187){
                color += 0.05;
                input.set_convar("ren_stroke_soft_color_intensity", color);
            }
            //3/7/17 Update
            //G for darker color
            if (event.keyCode == 71){
                greenShapes = !greenShapes;
                if (greenShapes){
                    input.execute(`net_replace_color 8 ${shiny_shapes}`);
                    input.execute(`net_replace_color 9 ${shiny_shapes}`);
                    input.execute(`net_replace_color 10 ${shiny_shapes}`);
                    input.execute(`net_replace_color 11 ${shiny_shapes}`);
                }else{
                    input.execute(`net_replace_color 8 ${_squares}`);
                    input.execute(`net_replace_color 9 ${_triangles}`);
                    input.execute(`net_replace_color 10 ${_pentagons}`);
                    input.execute(`net_replace_color 11 ${_crashers}`);
                }
            }
        }
    }
});

document.addEventListener('keyup',function(event){
    if (event.keyCode == 16){
        shift = false;
    }else if(event.keyCode == 17){
        ctrl = false;
    }else{
        toggle = false;
    }
});



(function() {
    'use strict';

//var NSE = document.createElement("audio");
//NSE.src = "https://dl.dropbox.com/s/1wot3ej8ajmx8eb/NOOB-SOUND EFFECT!!!!!.mp3";

    //xD
//var ezsound = new Audio("https://dl.dropbox.com/s/wkmc2c31vtvw1qq/Ben%20Says%20EZ%20Sound%20Effect.mp3");
  var ezsound = new Audio("https://dl.dropbox.com/s/rpz3ec77pe17ehe/LOL%20sound%20effect.mp3");

var kills = 0;

setInterval(getkills, 100);

function getkills(){
    var count = parseInt(document.getElementById("killCounter").innerText);
    if(count > kills){
	ezsound.play();
    }
    kills = count;
}
})();
