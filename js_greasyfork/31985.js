// ==UserScript==
// @name         AFK bot vertix
// @namespace    http://vertix.io/
// @version      1.03
// @description  'shift' to start bot, 'q' to show lobby selection
// @author       Meatman2tasty
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31985/AFK%20bot%20vertix.user.js
// @updateURL https://update.greasyfork.org/scripts/31985/AFK%20bot%20vertix.meta.js
// ==/UserScript==

//Easy Lobby Join Feature//

document.addEventListener("keydown", function(a) { // Press 'q' to show lobby selection
    if (a.keyCode == 81) {
$("#lobbySelector").css("display","block");
    }
}, false);

$("#lobbySelector").css("display","block");


//Boosting Script Addition//
function respawn() {
    setTimeout(respawn, 1);
    if (player.dead && !inMainMenu) {
         startGame('player');
    hideMenuUI();
    hideUI(true);
    document.getElementById('startMenuWrapper').style.display = 'none';
    }
}
respawn();

//Aimbot addition//
var active = false;
var interval = void 0;

function activate(event) { //'shift' to activate
    event.preventDefault();
    if (event.keyCode === 16 && !active) {
        c.removeEventListener("mousemove", gameInput, false);
        active = true;
        interval = setInterval(aimClosestPlayer, 10);
    }
}

function deactivate(event) { //'t' to deactivate
    event.preventDefault();
    if (event.keyCode === 84) {
        active = false;
        clearInterval(interval);
        c.addEventListener("mousemove", gameInput, false);
    }
}


c.addEventListener("keydown", activate, false);
c.addEventListener("keyup", deactivate, false);

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
    setTimeout(keys.s = 1,10);
    setTimeout(shootBullet(player), 100);
    document.getElementById("playerNameInput").value="﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽";
}

////////////////////////////////////////////////////

function playMove() {
    setTimeout(function() {
        keys.u = 1;
        keys.r = 1;
        setTimeout (function() {
            keys.u = 0;
            keys.r = 0;
            setTimeout (function() {
                keys.d = 1;
                keys.r = 1;
                setTimeout (function() {
                    keys.d = 0;
                    keys.r = 0;
                    setTimeout (function() {
                        keys.d = 1;
                        keys.l = 1;
                        setTimeout (function() {
                            keys.d = 0;
                            keys.l = 0;
                            setTimeout (function() {
                                keys.l = 1;
                                keys.u = 1;
                                setTimeout (function() {
                                    keys.l = 0;
                                    keys.u = 0;
                                }, 1500);
                            }, 10);
                        }, 1500);
                    }, 10);
                }, 1500);
            }, 10);
        }, 1500);
    }, 10);
    setTimeout(playMove, 6050);
}
playMove();