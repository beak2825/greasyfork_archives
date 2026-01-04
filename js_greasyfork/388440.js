// ==UserScript==
// @name         swordz.IO Hack
// @namespace    Sasha
// @version      1.4.8
// @description  Support extension for SwOrDz.Io
// @author       Sasha2210
// @match        *.swordz.io
// @grant        ur mum
// @downloadURL https://update.greasyfork.org/scripts/388440/swordzIO%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/388440/swordzIO%20Hack.meta.js
// ==/UserScript==

(function() {
	//Вырубаем сразу же после загрузки звуки и музыку
    toggleSound();
    toggleMusic();

    //Вырубаем отрисовку говнотутора
    Img.other[1].src= "";
})();

/*
А это шляпа с сообщеницами :D Осторожно, говнокод.
var msgQueue = 0;
function msgMeme() {
    if(Player.list[selfId].map != 'menu') {
        var msg;
        switch(msgQueue) {
            case 0:
                msg = '🌑 Qmaks 🌑';
                break;
            case 1:
                msg = '🌒 Qmaks 🌒';
                break;
            case 2:
                msg = '🌓 Qmaks 🌓';
                break;
            case 3:
                msg = '🌔 Qmaks 🌔';
                break;
            case 4:
                msg = '🌕 Qmaks 🌕';
                break;
            case 5:
                msg = '🌖 Qmaks 🌖';
                break;
            case 6:
                msg = '🌗 Qmaks 🌗';
                break;
            case 7:
                msg = '🌘 Qmaks 🌘';
                break;
            default:
                break;
        }
        if(msgQueue >= 0 && msgQueue <= 7) {
            msgQueue++;
            if(msgQueue == 7) {
                msgQueue = 0;
            }
        }
        socket.emit('keyPress', {
            inputId: 'chatMessage',
            state: msg
        });
        typing = false;
    }
}
setInterval(msgMeme, 250);*/

var aimbot = false;
var tracers = true;
var staying = false;
var speedhack = false;
var autorespawn = false;
var isAimbotActive = false;

function onUpdate() {
    if(autorespawn && Player.list[selfId].map == "menu" && respawnButton.style.display != " ") {
        respawnButton.click();
        playButton.click();
    }
    if(Player.list[selfId].map != undefined && Player.list[selfId].map != 'menu') {
        if(staying) {
            socket.emit('keyPress', {
                inputId: 'mouseDistance',
                state: 0
            });
        }
        if(aimbot) {
            var prevPlayer = {};

            var diffX;
            var diffY;

            for(var playerId in Player.list) {
                if(playerId != selfId) {
                    var otherPlayer = Player.list[playerId];
                    if(otherPlayer.map != undefined && otherPlayer.map != "menu") {
                        diffX = otherPlayer.x - Player.list[selfId].x;
                        diffY = otherPlayer.y - Player.list[selfId].y;
                        var currentDistance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
                        if(prevPlayer.distance != undefined) {
                            if(currentDistance <= prevPlayer.distance) {
                                prevPlayer.player = otherPlayer;
                                prevPlayer.distance = currentDistance;
                            }
                        } else {
                            prevPlayer.player = otherPlayer;
                            prevPlayer.distance = currentDistance;
                        }
                    }
                }
            }

            if(isAimbotActive = (prevPlayer.distance != undefined && !isNaN(prevPlayer.distance) && prevPlayer.distance <= 500)) {
                diffX = prevPlayer.player.x - Player.list[selfId].x;
                diffY = prevPlayer.player.y - Player.list[selfId].y;
                mouseAngle = (Math.atan2(diffY, diffX) * 180 / Math.PI);
                //AutoAttack
                socket.emit('keyPress', {
                    inputId: 'angle',
                    state: speedhack ? (mouseAngle + 180) % 360 : mouseAngle
                });
                socket['emit']('keyPress', {
                    inputId: 'leftButton',
                    state: true
                });
            }
        }
    }
}

setInterval(onUpdate, 100);

document.onmousemove = function (info) {
    if (info.clientX < 110 && info.clientY > window.innerHeight - 310) {
        return;
    }
    if (Player.list[selfId] && Player.list[selfId].map != 'menu') {
        var x = -canvasWIDTH / 2 + info.clientX;
        var y = -canvasHEIGHT / 2 + info.clientY;
        if(!isAimbotActive) {
            mouseAngle = Math.atan2(y, x) / Math.PI * 180;
        }
        mouseDistance = 1;
        if (getDistance(x, y, 0, 0) < canvasWIDTH * canvasWIDTH / 324) {
            mouseDistance = 1 * (getDistance(x, y, 0, 0) / (canvasWIDTH * canvasWIDTH / 324));
        } else {
            mouseDistance = 1;
        }
    }
}

document.onkeyup = function (key) {
    switch(key.keyCode) {
        case 69: //on E
            speedhack = false;
            if(!aimbot) {
                socket.emit('keyPress', {
                    inputId: 'angle',
                    state: mouseAngle
                });
            }
            socket.emit('keyPress', {
                inputId: 'mouseDistance',
                state: 1
            });
            break;
        case 87: //on W
            inputAttack(false);
            break;
        case 32: //on SPACE
            inputDash(false);
            break;
        case 13:
            inputChat(); //on ENTER
            break;
        case 80: //on P
            if(!typing) {
                tFunction();
            }
            break;
        default:
            break;
    }
}

document.onkeydown = function (key) {
    //if(document.getElementById('chatMessage') == null) {
    if(!typing) {
        switch(key.keyCode) {
            case 68: //on D
                autorespawn = !autorespawn;
                break;
            case 81: //on Q
                aimbot = !aimbot;
                if(!aimbot) {
                    socket['emit']('keyPress', {
                        inputId: 'leftButton',
                        state: false
                    });
                    isAimbotActive = false;
                }
                break;
            case 90: //on Z
                tracers = !tracers;
                break;
            case 65: //on A
                staying = !staying;
                break;
            case 69: //on E
                if(!aimbot && !speedhack) {
                    socket.emit('keyPress', {
                        inputId: 'angle',
                        state: ((mouseAngle + 180) % 360)
                    });
                }
                socket.emit('keyPress', {
                    inputId: 'mouseDistance',
                    state: -67343687834436746237846234783246
                });
                speedhack = true;
                break;
            case 87: //on W
                inputAttack(true);
                break;
            case 32: //on Space
                inputDash(true);
                break;
            default:
                break;
        }
    }
}

function onRender() {
    if(tracers && Player.list[selfId] != undefined && Player.list[selfId].map != undefined && Player.list[selfId].map != 'menu') {
        for(var playerId in Player.list) {
            if(playerId != selfId) {
                var target = Player.list[playerId];
                var diffX = target.x - Player.list[selfId].x;
                var diffY = target.y - Player.list[selfId].y;
                var currentDistance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
                if(currentDistance != undefined && !isNaN(currentDistance) && currentDistance <= 1000) {
                    ctx.beginPath();
                    ctx.moveTo(WIDTH / 2, HEIGHT / 2);
                    ctx.arc(WIDTH / 2, HEIGHT / 2, 1, 0, 2 * Math.PI, true);
                    ctx.lineTo(diffX + WIDTH / 2, diffY + HEIGHT / 2);
                    ctx.arc(diffX + WIDTH / 2, diffY + HEIGHT / 2, 1, 0, 2 * Math.PI, true);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "#e74c3c";
                    ctx.stroke();
                }
            }
        }
    }

    ctx.font = "20px Comic Sans MS";
    ctx.textAlign = "center";

    ctx.fillStyle = aimbot ? "green" : "red";
    ctx.fillText("AimBot [Q]", 80, 80);

    ctx.fillStyle = tracers ? "green" : "red";
    ctx.fillText("Tracers [Z]", 80, 105);

    ctx.fillStyle = staying ? "green" : "red";
    ctx.fillText("Staying [A]", 80, 130);

    ctx.fillStyle = speedhack ? "green" : "red";
    ctx.fillText("SpeedHack [E]", 80, 155);

    ctx.fillStyle = autorespawn ? "green" : "red";
    ctx.fillText("AutoRespawn [D]", 80, 180);

    requestAnimationFrame(onRender);
}

onRender();

animate = function() {
    intervalTimer++;
    requestAnimationFrame(animate);
    if (!selfId) {
        return;
    }
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (var PlayerID in Player.list) {
        Player.list[PlayerID].update();
    }
    for (var NpcID in NPC.list) {
        NPC.list[NpcID].update();
    }
    for (var MobID in Mob.list) {
        Mob.list[MobID].update();
    }
    for (var BulletID in Bullet.list) {
        Bullet.list[BulletID].update();
    }
    drawMap();
    if (intervalTimer % FPS == 0) {
        manageMusic();
    }
    if (intervalTimer % 4 == 0 && Player.list[selfId].map == 'menu') {
        manageShop();
        manageHighScore();
    }
    if (Player['list'][selfId]['map'] == 'menu') {
        if (adTimer2++ > 60 * FPS) {
            aipDisplayTag['refresh']('fightz-io_336x280');
            aipDisplayTag['refresh']('fightz-io_300x250');
            adTimer2 = 0;
        }
    } else {
        adTimer2 = 0;
    }
    if (intervalTimer % 8 == 0 && Player['list'][selfId]['map'] !== 'menu') {
        if (Math['abs'](angleStatus - mouseAngle) > 1 || Math['abs'](distanceStatus - mouseDistance) > 0.1) {
            if(!isAimbotActive) {
                socket.emit('keyPress', {
                    inputId: 'angle',
                    state: speedhack ? (mouseAngle + 180) % 360 : mouseAngle
                });
            }
            socket.emit('keyPress', {
                inputId: 'mouseDistance',
                state: speedhack ? -5 : (staying ? 0 : mouseDistance)
            });
            angleStatus = mouseAngle;
            distanceStatus = mouseDistance;
        }
    }
    for (var DecorationID in Decoration.list) {
        if (Decoration.list[DecorationID].type != 35) {
            Decoration.list[DecorationID].draw();
        }
    }
    for (var foodID in Food.list) {
        Food.list[foodID].draw();
    }
    for (var mobID in Mob.list) {
        Mob.list[mobID].draw();
    }
    for (var ncpID in NPC.list) {
        NPC.list[ncpID].draw();
    }
    for (var bulletID in Bullet.list) {
        Bullet.list[bulletID].draw();
    }
    for (var playerID in Player.list) {
        Player.list[playerID].draw();
    }
    for (var decorationID in Decoration.list) {
        if (Decoration.list[decorationID].type == 35) {
            Decoration.list[decorationID].draw();
        }
    }
    for (var PLAYERID in Player.list) {
        Player.list[PLAYERID].drawMessage();
    }
    if (!(Player.list[selfId].score <= scoreRecord)) {
        scoreRecord = Player.list[selfId].score;
        levelRecord = Player.list[selfId].level;
        setCookie('scoreRecord', scoreRecord, 365);
        setCookie('levelRecord', levelRecord, 365);
    }
    if (!(Player.list[selfId].score <= scoreRecordThisGame)) {
        scoreRecordThisGame = Player.list[selfId].score;
        levelRecordThisGame = Player.list[selfId].level;
    }
    if (Player.list[selfId].map != 'menu') {
        drawLeaderboard();
        homeDiv.style.display = 'none';
        document.getElementById('controlContainer').style.display = 'block';
    } else {
        if (homeDiv.style.display == 'none' && deathTimer++ >= (FPS * 1)) {
            deathTimer = 0;
            homeDiv.style.display = 'block';
            if (firstLogin == 1) {
                respawnDiv.style.display = 'block';
                readyDiv.style.display = 'none';
                scoreRecordThisGame = 0;
                levelRecordThisGame = 0;
            }
            document.getElementById('controlContainer').style.display = 'none';
            signDivSignIn.style.display = 'none';
            signDivLoading.style.display = 'inline-block';
            if (finishLoading == 0 && loadPlayButton == 1) {
                signDivSignIn.style.display = 'inline-block';
                signDivLoading.style.display = 'none';
            }
            if (typing == true) {
                document.getElementById('chatContainer').innerHTML = '';
                typing = false;
            }
            if (firstLogin == 1) {
                spawnMessage.style.display = 'block';
                spawnMessage.innerHTML = 'You died. You\'ll spawn with +' + Player.list[selfId].score + ' score!';
            }
        }
    }
}