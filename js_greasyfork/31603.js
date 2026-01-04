// ==UserScript==
// @name         MooMoo.io | ●HINFE●HINFE?IVAN◊FETISOV◊
// @namespace    https://greasyfork.org/users/139500
// @version      ∞
// @description  Jezení,Zaměřování,Útok = Shift Zaplé/Vyplé ║ Čepice = 0-9,* ║ Měnění Čepice = Modrá,Červená = + | Prase,Kráva = - | Sprint a Král = ÷ ║ Lepší Minimapa ║ Vylepšení
// @author       ●HINFE●HINFE?IVAN◊FETISOV◊
// @match        http://moomoo.io/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @icon         http://i.imgur.com/CX6267k.png
// @downloadURL https://update.greasyfork.org/scripts/31603/MooMooio%20%7C%20%E2%97%8FHINFE%E2%97%8FHINFEIVAN%E2%97%8AFETISOV%E2%97%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/31603/MooMooio%20%7C%20%E2%97%8FHINFE%E2%97%8FHINFEIVAN%E2%97%8AFETISOV%E2%97%8A.meta.js
// ==/UserScript==

// ●HINFE●HINFE?IVAN◊FETISOV◊

// http://keycode.info/
// https://shikargar.files.wordpress.com/2010/10/keycodes.png
// https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes/

// Odebraný odpad

$('#youtuberOf').prepend('');
$('#adCard').remove();
$('#linksContainer1').remove();
$('#linksContainer2').remove();
$('#twitterFollow').remove();
$('#youtubeFollow').remove();
$('#downloadButtonContainer').remove();
$('#youtuberOf').remove();у
$('#promoImgHolder').remove();

// Vylepšení

document.getElementById('gameName').innerHTML = '? HINFE ?';
document.getElementById('enterGame').innerHTML = '? FETISOV ?';

var myElement = document.querySelector("#nameInput");
myElement.style.backgroundColor = "#808080";
myElement.style.color = "#fff";

var myElement = document.querySelector("#enterGame");
myElement.style.backgroundColor = "#FF0000";
myElement.style.color = "#fff";

$('head').append('<link rel="stylesheet" href="https://eucliwood.com/des.css" type="text/css" media="screen, projection" />');
$('#ageBarContainer').append('</br><div id="hacktext"></div>');
$('#leaderboard').append('╳╳FENRIR╳╳');

// Lepší mapa ║ Automatické \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

$('#mapDisplay').css({'background': 'url("http://i.imgur.com/XnxZ42u.png")'});

(function() { var conf = {'map': {'w': '200','h': '200',},};

$('#mapDisplay').css({'width': conf.map.w + 'px','height': conf.map.h + 'px'});
$('#scoreDisplay').css({'bottom': '290px',});})();

// Automatické jezení a zameřování a útočení ║ 1×Shift = Vyp | 2×Shift = Zap-Vyp | 3×Shift = Vyp-Zap | 4×Shift = Zap | 1×Shift = Vyp | 2×Shift = Zap-Vyp | 3×Shift = Vyp-Zap \\\\\\\\\\\\

var filecontrol = {
    VYP : -1,
    ZIVOT : 0,
    BOJ : 1,
    ZAP : 2
};


var id;
var statecontrol = filecontrol.ZAP;

function isElementVisible(e) {
    return (e.offsetParent !== null);
}

document.addEventListener('keydown', function(e){
    if (e.keyCode === 16 && document.activeElement.id.toLowerCase() !== 'chatbox'){
        filechanger();
    }
});

function filechanger(){
    if (statecontrol === filecontrol.ZAP) statecontrol = filecontrol.VYP;
    else statecontrol++;
    var transyag;
    switch (statecontrol){
        case filecontrol.VYP:
            transyag = "VYPLÉ";
            break;
        case filecontrol.ZIVOT:
            transyag = "NESMRTELNÝ";
            break;
        case filecontrol.BOJ:
            transyag = "NEPORAZITELNÝ";
            break;
        case filecontrol.ZAP:
            transyag = "ZAPLÉ";
    }

    document.getElementById("hacktext").innerHTML = transyag;
    durumyansit();
}

var kolanya = 0;

function durumyansit(){
    kolanya++;
    setTimeout(function(){
        kolanya--;
        if (!kolanya) {
            document.getElementById("hacktext").innerHTML = '<div id="ageText"></div>';
        }
    }, 1500);
}

var EnumStates = {
    NONE : -1,
    HEAL : 0,
    AIM : 1,
    BOTH : 2
};

var playersNear = [];
var ws;
var id;
var f = 0;
var user;
var canvas = document.querySelector("#gameCanvas");
var hasApple = true;
var currentTarget;
var state = EnumStates.BOTH;

function Player(id, x, y, tribe){
    this.id = id;
    this.x = x;
    this.y = y;
    this.tribe = tribe;
}
Player.prototype.getAngle = function(){
    return Math.atan2(this.deltaY, this.deltaX);
};

Player.prototype.getDistance = function(){
    return Math.sqrt(Math.pow(this.deltaX, 2) + Math.pow(this.deltaY, 2));
};

function lookAtPointRelativeToCharacter(x, y){
    var centerX = innerWidth / 2;
    var centerY = innerHeight / 2;
    canvas.dispatchEvent(new MouseEvent("mousemove", {
        clientX: centerX + x,
        clientY: centerY + y
    }));
}

WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    var parsed = parseWSMsg(m);
    this.oldSend(currentTarget && parsed[0] === "2" ? "42[\"2\"," + currentTarget.getAngle() + "]" : m);
    if (!ws){
        ws = this;
        socketFound(this);
    }
};

function socketFound(socket){
    console.log("found socket object");
    socket.addEventListener('message', function(e){
        handleMessage(e);
    });
}

function handleMessage(e){
    var m = e.data;
    var parsed = parseWSMsg(m);
    if (parsed[0] === "3"){
        playersNear = [];
        var data = parsed[1];
        for (var i = 0; i < data.length ; i += 12) {
            var playerData = data.slice(i, i + 12);
            var player = new Player(playerData[0], playerData[1], playerData[2], playerData[7]);
            if (player.id !== id) playersNear.push(player);
            else user = player;
        }
        if (currentTarget) currentTarget = null;
        if ((state === EnumStates.AIM || state === EnumStates.BOTH) && playersNear.length > 0){
            var closestPlayer = getClosestPlayer();
            if (closestPlayer.getDistance() < 200 && (closestPlayer.tribe !== user.tribe || user.tribe === null)) aimAt(closestPlayer);
        }
    }
    if (parsed[0] === "1" && !id){
        id = parsed[1];
        console.log("id found: " + id);
    }
    if (parsed[0] === "10" && parsed[1] === id && parsed[2] !== 100 && (state === EnumStates.HEAL || state === EnumStates.BOTH)){
        heal();
    }
}

function aimAt(target){
    lookAtPointRelativeToCharacter(target.deltaX, target.deltaY);
    currentTarget = target;
}

function getClosestPlayer(){
    var closestPlayer;
    for (var i = 0 ; i < playersNear.length; i++){
        var currentPlayer = playersNear[i];
        currentPlayer.deltaX = currentPlayer.x - user.x;
        currentPlayer.deltaY = currentPlayer.y - user.y;
        if (i === 0 || currentPlayer.getDistance() < closestPlayer.getDistance()){
            closestPlayer = currentPlayer;
        }
    }
    return closestPlayer;
}

function parseWSMsg(s){
    if (s.indexOf("42") === -1) return -1;
    var o = s.substring(s.indexOf("["));
    return JSON.parse(o);
}

function heal(){
    console.log("healing");
    if (hasApple){
        if (!haveApple()){
            heal();
            return;
        }
        else ws.send("42[\"5\",0,null]");
    }
    else ws.send("42[\"5\",1,null]");
    ws.send("42[\"4\",1,null]");
}

function haveApple(){
    if (hasApple) hasApple = isElementVisible(document.getElementById("actionBarItem9"));
    return hasApple;
}

function isElementVisible(e) {
    return (e.offsetParent !== null);
}

document.addEventListener('keydown', function(e){
    if (e.keyCode === 16 && document.activeElement.id.toLowerCase() !== 'chatbox'){
        changeState();
    }
});

function changeState(){
    if (state === EnumStates.BOTH) state = EnumStates.NONE;
    else state++;
    var t;
    switch (state){
        case EnumStates.NONE:
            t = "VYPLÉ";
            break;
        case EnumStates.HEAL:
            t = "NESMRTELNÝ";
            break;
        case EnumStates.AIM:
            t = "NEPORAZITELNÝ";
            break;
        case EnumStates.BOTH:
            t = "ZAPLÉ";
    }
    document.title = t;
    revertTitle();
}

function revertTitle(){
    f++;
    setTimeout(function(){
        f--;
        if (!f) {
            document.title = "Moo Moo";
        }
    }, 1500);
}

// Měniš čepice ║ 0=Booster Hat|1=Bushido Armor|2=Winter Cap|3=Demolisher Armor|4=Samurai Armor|5=Flipper Hat|6=Matksman Cap|7=Medic Gear|8=Emp Helmet|9=Plague Mask|*=Scavenger Gear \\\

(function() {
	var ID_MooHead = 28;
	var ID_PigHat = 29;
	var ID_BummleHat = 8;
	var ID_StrawHat = 2;
	var ID_WinterCap = 15;
	var ID_CowboyHat = 5;
	var ID_RangerHat = 4;
	var ID_ExplorerHat = 18;
	var ID_FlipperHat = 31;
	var ID_MatksmanCap = 1;
	var ID_BushGear = 10;
	var ID_SoldierHelmet = 6;
	var ID_AntiVenomGear = 23;
	var ID_MedicGear = 13;
	var ID_MinersHelmet = 9;
	var ID_BullHelmet = 7;
	var ID_EmpHelmet = 22;
	var ID_BoosterHat = 12;
	var ID_PlagueMask = 21;
	var ID_SpikeGear = 11;
	var ID_BushidoArmor = 16;
    var ID_SamuraiArmor = 20;
    var ID_DemolisherArmor = 26;
    var ID_ScavengerGear = 27;

	document.addEventListener('keydown', function(e) {
		switch (e.keyCode - 96) {
			case 0: storeEquip(ID_BoosterHat); break;       // 0 = Booster Hat
			case 1: storeEquip(ID_BushidoArmor); break;     // 1 = Bushido Armor
			case 2: storeEquip(ID_WinterCap); break;        // 2 = Winter Cap
			case 3: storeEquip(ID_DemolisherArmor); break;  // 3 = Demolisher Armor
			case 4: storeEquip(ID_SamuraiArmor); break;     // 4 = Samurai Armor
			case 5: storeEquip(ID_FlipperHat); break;       // 5 = Flipper Hat
			case 6: storeEquip(ID_MatksmanCap); break;      // 6 = Matksman Cap
			case 7: storeEquip(ID_MedicGear); break;        // 7 = Medic Gear
			case 8: storeEquip(ID_EmpHelmet); break;        // 8 = Emp Helmet
			case 9: storeEquip(ID_PlagueMask); break;       // 9 = Plague Mask
            case 10: storeEquip(ID_ScavengerGear); break;   // * = Scavenger Gear
		}
	});

})();

// Přehazování dvou čepic ║ Prase a kráva = - | Červená a modrá = + | Sprint a Král = ÷ \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Prase a kráva = -

(function() {
    var myVar;
    var myVar2;
	var police = true;
	var ID_MooHead = 28;
    var ID_EMPTY = 0;
	var ID_PigHead = 29;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 109) {
			e.preventDefault();
			if (police) {
            storeEquip(ID_MooHead);
            myVar = setTimeout(function(){ h1(); }, 500);
			} else {
            clearTimeout(myVar);
            clearTimeout(myVar2);
            storeEquip(ID_EMPTY);
			}
			police = !police;
		}
	});

    function h1() {
    storeEquip(ID_MooHead);
    clearTimeout(myVar);
    myVar2 = setTimeout(function(){ h2(); }, 500);
    }
    function h2() {
    storeEquip(ID_PigHead);
    clearTimeout(myVar2);
    myVar = setTimeout(function(){ h1(); }, 500);
    }
})();

// Červená a modrá = +

(function() {
    var myVar;
    var myVar2;
	var police = true;
	var ID_BummleHat = 8;
    var ID_EMPTY = 0;
	var ID_WinterCap = 15;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 107) {
			e.preventDefault();
			if (police) {
            storeEquip(ID_BummleHat);
            myVar = setTimeout(function(){ h1(); }, 500);
			} else {
            clearTimeout(myVar);
            clearTimeout(myVar2);
            storeEquip(ID_EMPTY);
			}
			police = !police;
		}
	});

    function h1() {
    storeEquip(ID_WinterCap);
    clearTimeout(myVar);
    myVar2 = setTimeout(function(){ h2(); }, 500);
    }
    function h2() {
    storeEquip(ID_BummleHat);
    clearTimeout(myVar2);
    myVar = setTimeout(function(){ h1(); }, 500);
    }
})();

// Sprint a Král = ÷

(function() {
    var myVar;
    var myVar2;
	var police = true;
	var ID_BoosterHat = 12;
    var ID_EMPTY = 0;
	var ID_ScavengerGear = 27;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 111) {
			e.preventDefault();
			if (police) {
            storeEquip(ID_BoosterHat);
            myVar = setTimeout(function(){ h1(); }, 500);
			} else {
            clearTimeout(myVar);
            clearTimeout(myVar2);
            storeEquip(ID_EMPTY);
			}
			police = !police;
		}
	});

    function h1() {
    storeEquip(ID_BoosterHat);
    clearTimeout(myVar);
    myVar2 = setTimeout(function(){ h2(); }, 500);
    }
    function h2() {
    storeEquip(ID_ScavengerGear);
    clearTimeout(myVar2);
    myVar = setTimeout(function(){ h1(); }, 500);
    }
})();
