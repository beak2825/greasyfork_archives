// ==UserScript==
// @name         Vertix.io Mod
// @namespace    https://greasyfork.org/en/users/129328-snowlord7
// @version      4.3
// @description  Press 'o' to turn on aimbot and 'f' to turn it off. Press 'b' to bhop and 'n' to stop.  Jump to shoot, right click to shoot all your bullets. Press 'h' to see controls.
// @author       Copyright 2017, iomods.weebly.com, All rights reserved.
// @match        http://vertix.io/*
// @match        http://www.vertix.io/*
// @supportURL   http://iomods.weebly.com/
// @icon         https://i.imgur.com/IQB2jZR.png
// @grant        GM_addStyle
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/37784/Vertixio%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/37784/Vertixio%20Mod.meta.js
// ==/UserScript==
//© SnowLord7 / iomods.weebly.com

//Random Helpfull Stuff (1)
document.getElementById("mainTitleText").style.color = "#f00";
var doc1 = document.createElement("p");
var node = document.createTextNode("Vertix.io Mod By SnowLord7");
doc1.appendChild(node);
var element = document.getElementById("mainTitleText");
element.appendChild(doc1);

//Random Helpfull Stuff (2)
var para2 = document.createElement("p");
var node2 = document.createTextNode("Red = off, Green = on");
para2.appendChild(node2);
var element2 = document.getElementById("mainTitleText");
element2.appendChild(para2);

//Remove Ads
$("#adWrapper").remove();
document.getElementById("namesBox").remove();
document.getElementById("linkBox").remove();



//Weapon Length
function wepLength() {
    setTimeout(wepLength, 1);
    if (player.onScreen) {
         setTimeout(player.weapons["0"].length = 5000,100);
    player.weapons["0"].width = 15;
    player.weapons["0"].shake = 0;
    }
}
wepLength();

//Faster Mini-Map
drawMiniMapFPS = 0;

//Loading Tips
var element = document.createElement("div");
element.appendChild(document.createTextNode('TIP: RED TITLE TEXT = OFF, GREEN TITLE TEXT = ON'));
document.getElementById('loadSpinner').appendChild(element);
element.idName = "loadText2";

//Bunny Hop On
document.addEventListener("keydown", function(a) {
    if (a.keyCode == 66) {
setTimeout(keys.s = 1,10);
player.jumpCountdown = 0;
    }
}, false);

//Bunny Hop Off
document.addEventListener("keydown", function(a) {
    if (a.keyCode == 78) {
setTimeout(keys.s = 2,10);
    }
}, false);

function jumpcooldown() {
    setTimeout(function() {
       player.jumpCountdown = 0
    }, 500);
}

var active = false;
var interval = void 0;

//BHop Jump Cooldown Killer
function activate(event) { //'b' to activate
    event.preventDefault();
    if (event.keyCode === 66 && !active) {
        active = true;
        interval = setInterval(jumpcooldown, 10);
    }
}

function deactivate(event) { //'n' to deactivate
    event.preventDefault();
    if (event.keyCode === 78) {
        active = false;
        clearInterval(interval);
    }
}

c.addEventListener("keydown", activate, false);
c.addEventListener("keyup", deactivate, false);

//Kill Sound Effects (Roblox lol)
;(() => {
    let _b = function() {
        socket.on("3", function(a) {
            let t = new Audio('https://www.myinstants.com/media/sounds/roblox-death-sound-effect.mp3');
            if(1 == a.kd) t.play();
        });
    }

    let _t = window.setInterval(() => {
        if(socket) clearInterval(_t), _b();
    }, 0x64);
})();

//Press "Ctrl" to Auto Join Games
document.addEventListener("keydown", function(a) {
    if (a.keyCode == 17) {
startGame("player");
socket.emit("respawn");
    }
}, false);

var active = false;
var interval = void 0;

function activate(event) {
    event.preventDefault();
    if (event.keyCode === 79 && !active) {
        c.removeEventListener("mousemove", gameInput, false);
        active = true;
        document.getElementById("mainTitleText").style.color = "#0f0";
        interval = setInterval(aimClosestPlayer, 10);
    }
}

function deactivate(event) {
    event.preventDefault();
    if (event.keyCode === 80) {
        active = false;
        document.getElementById("mainTitleText").style.color = "#f00";
        clearInterval(interval);
        c.addEventListener("mousemove", gameInput, false);
    }
}

window.onkeydown = function(event) {
   if (event.keyCode === 72) {
      alert("Press 'h' for help. Press 'o' to turn on aimbot and press 'p' to stop it. Press 'b' to turn bunny hop on and 'n' to stop it. Press 'ctrl' to join the match. Jump to jumpshoot. -SnowLord7");
      console.log('-=----------------=-');
      console.log('Name: ' + player.name);
      console.log('Team: ' + player.team);
      console.log('Dead: ' + player.dead);
      console.log('Boss: ' + player.isBoss);
      console.log('Health: ' + player.health);
      console.log('Kills: ' + player.kills);
      console.log('Deaths: ' + player.deaths);
      console.log('-=----------------=-');
   }
};

c.addEventListener("keydown", activate, false);
c.addEventListener("keyup", deactivate, false);
//convertstr1ng . com/Enc odeDecod e/ HexDecode
function getOtherPlayers(gameObjects, myTeam) {
    return gameObjects.filter(function (o) {
        return o.type === 'player' && o.dead === false && o.name !== player.name && o.team !== myTeam;
    });
}

function getMyPlayer(gameObjects) {
    return gameObjects.filter(function (o) {
        return o.name === player.name;
    })[0];
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getClosestPlayer(gameObjects) {
    var myTeam = getMyPlayer(gameObjects).team;
    var otherPlayers = getOtherPlayers(gameObjects, myTeam);
    var closestDistance = Infinity;
    var closestPlayer = void 0;
    otherPlayers.forEach(function (p) {
        var d = distance(player.x, player.y, p.x, p.y);
        if (d < closestDistance) {
            closestPlayer = p;
            closestDistance = d;
        }
    });
    return closestPlayer;
}

function getAngle(x1, y1, x2, y2) {
    return Math.atan2(y1 - y2, x1 - x2);
}

function setTarget(angle, distance) {
    target.f = angle;
    target.d = distance;
}

function aimClosestPlayer() {
    var closestPlayer = getClosestPlayer(gameObjects);
    if (!closestPlayer) {
        return;
    }
    var angle = getAngle(player.x, player.y, closestPlayer.x, closestPlayer.y);
    var distance = 100;
    setTarget(angle, distance);
    targetChanged = true;
}

//Right click to shoot all bullets

c.addEventListener('mousedown', function (event) {
    if (event.which == 3) {
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
		playerReload(player, 1);
        playerSwapWeapon(player, 1);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
        shootBullet(player);
		playerReload(player, 1);
        playerSwapWeapon(player, 1);
		
    }
});

//Ememy Radar (Credits to Lightning King)
window.drawMiniMap = function () {
    mapCanvas.width = mapCanvas.width, mapContext.globalAlpha = 1;
    for (var a = 0; a < gameObjects.length; ++a) {
        'player' == gameObjects[a].type &&
        gameObjects[a].onScreen &&
        (gameObjects[a].index == player.index ||
         gameObjects[a].team !== player.team ||
         gameObjects[a].team == player.team ||
         gameObjects[a].isBoss) &&
        (mapContext.fillStyle = gameObjects[a].index == player.index ? '#fff' : gameObjects[a].isBoss ? '#db4fcd' : gameObjects[a].team !== player.team ? '#D35400' : '#5151d9',
            mapContext.beginPath(),
            mapContext.arc(gameObjects[a].x / gameWidth * mapScale, gameObjects[a].y / gameHeight * mapScale, pingScale, 0, 2 * mathPI, !0),
            mapContext.closePath(),
            mapContext.fill());
    }
    if (null != gameMap) {
        for (mapContext.globalAlpha = 1, a = 0; a < gameMap.pickups.length; ++a) {
            gameMap.pickups[a].active &&
            ('lootcrate' == gameMap.pickups[a].type ? mapContext.fillStyle = '#ffd100' : 'healthpack' == gameMap.pickups[a].type &&
            (mapContext.fillStyle = '#5ed951'),
                mapContext.beginPath(),
                mapContext.arc(gameMap.pickups[a].x / gameWidth * mapScale, gameMap.pickups[a].y / gameHeight * mapScale, pingScale, 0, 2 * mathPI, !0),
                mapContext.closePath(),
                mapContext.fill());
        }
        mapContext.globalAlpha = 1.0,
            a = getCachedMiniMap(),
        null != a &&
        mapContext.drawImage(a, 0, 0, mapScale, mapScale),
            delete a;
    }
};

//d3c0d3 h4x
$("#cvs").keydown(function(c){32==c.which&&shootBullet(player)});

var b=0;

setTimeout(function() {
    ShowCurrentWeaponAll();

    document.getElementById("charWpn").addEventListener("click",function bzero() {b=0;}, false);
    document.getElementById("charWpn2").addEventListener("click",function bone() {b=1;}, false);
    document.getElementById("camoList").addEventListener("click",ShowCurrentWeapon, false);
    document.getElementById("classList").addEventListener("click",ShowCurrentWeaponAll, false);

},6000);

function ShowCurrentWeaponAll() {
    b=0;
    ShowCurrentWeapon();
    b=1;
    ShowCurrentWeapon();
}

function ShowCurrentWeapon() {
    var a = characterClasses[currentClassID].weaponIndexes[b]; /* get the weapon id */
    var x=0;
    if(getCookie("wpnSkn"+a) !=getCookie("wpnSknundefined")) { /* if the default weapon is NOT selected */
        while(camoDataList[a][x].id != getCookie("wpnSkn"+a)) { /* find the proper id of the camo */
            x=x+1;
        }
    }
    else { /* if the defualt weapon is selected */
        if(camoDataList[a][x].name != "Art of War") { /* this is a work around to the bug in vertix, Art of War and default have the same id */
            if(b===0) { characterWepnDisplay.innerHTML = "<b>Primary:</b><div class='hatSelectItem' style='display:inline-block'>" + characterClasses[currentClassID].pWeapon + "</div>"; }
            else { characterWepnDisplay2.innerHTML = "<b>Secondary:</b><div class='hatSelectItem' style='display:inline-block'>" + characterClasses[currentClassID].sWeapon + "</div>"; }
            return;
        }
    }
    if(b===0) { characterWepnDisplay.innerHTML = "<b>Primary:</b><div class='hatSelectItem' style='display:inline-block; color:" + getItemRarityColor(camoDataList[a][x].chance) + ";'>" + camoDataList[a][x].name + " x" + (parseInt(camoDataList[a][x].count) + 1) + "<div class='hoverTooltip'><div style='float:left; margin-top:10px; margin-right:10px; width:62px; height:62px; background:url(" + getCamoURL(camoDataList[a][x].id) + "); background-size:cover; background-repeat:no-repeat; background-position:50% 50%;'></div><div style='color:" + getItemRarityColor(camoDataList[a][x].chance) + "; font-size:16px; margin-top:5px;'>" + camoDataList[a][x].name + "</div><div style='color:#ffd100; font-size:12px; margin-top:0px;'>droprate " + camoDataList[a][x].chance + "%</div><div style='font-size:8px; color:#d8d8d8; margin-top:1px;'><i>weapon camo</i></div><div style='font-size:12px; margin-top:5px;'>" + characterClasses[currentClassID].pWeapon + " weapon skin.</div><div style='font-size:8px; color:#d8d8d8; margin-top:5px;'><i></i></div></div></div>"; }// roubaixinte ractive .com/PlayGround/B inary_Conv ersion/Bi nary_To_T ext .asp
    else { characterWepnDisplay2.innerHTML = "<b>Secondary:</b><div class='hatSelectItem' style='display:inline-block; color:" + getItemRarityColor(camoDataList[a][x].chance) + ";'>" + camoDataList[a][x].name + " x" + (parseInt(camoDataList[a][x].count) + 1) + "<div class='hoverTooltip'><div style='float:left; margin-top:10px; margin-right:10px; width:62px; height:62px; background:url(" + getCamoURL(camoDataList[a][x].id) + "); background-size:cover; background-repeat:no-repeat; background-position:50% 50%;'></div><div style='color:" + getItemRarityColor(camoDataList[a][x].chance) + "; font-size:16px; margin-top:5px;'>" + camoDataList[a][x].name + "</div><div style='color:#ffd100; font-size:12px; margin-top:0px;'>droprate " + camoDataList[a][x].chance + "%</div><div style='font-size:8px; color:#d8d8d8; margin-top:1px;'><i>weapon camo</i></div><div style='font-size:12px; margin-top:5px;'>" + characterClasses[currentClassID].sWeapon + " weapon skin.</div><div style='font-size:8px; color:#d8d8d8; margin-top:5px;'><i></i></div></div></div>"; }

}

//help in chat
window.onkeydown = function(event) {
   if (event.keyCode === 72) {
document.getElementById("chatList").innerHTML+= '<li class="me"><span>MOD: </span><label id="chatLine15">Press "h" for help. (thats how I am here!)</label></li>';

document.getElementById("chatList").innerHTML+= '<li class="me"><span>MOD: </span><label id="chatLine15">Press "o" to turn on aimbot and press "p" to stop it.</label></li>';

document.getElementById("chatList").innerHTML+= '<li class="me"><span>MOD: </span><label id="chatLine15">Press "b" to turn bunny hop on and "n" to stop it.</label></li>';

document.getElementById("chatList").innerHTML+= '<li class="me"><span>MOD: </span><label id="chatLine15">Press "ctrl" to join the match.</label></li>';

document.getElementById("chatList").innerHTML+= '<li class="me"><span>MOD: </span><label id="chatLine15">Jump to jumpshoot.</label></li>';
   }
};
var doc2 = document.createElement("p");
var node2 = document.createTextNode("Made also by @spicyness#6520 on discord!");
doc2.appendChild(node2);
var element2 = document.getElementById("settings");
element2.appendChild(doc2);
//wonder what this line below can do
//4D4445784D5441774D5445674D4445784D4445784D5441674D4445784D4445784D5445674D4445784D5441784D5445674D4445784D4445784D4441674D4445784D4445784D5445674D4445784D5441774D5441674D4445784D4441784D4441674D4441784D5441784D54453D