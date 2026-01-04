// ==UserScript==
// @name         Anooky's Vertix Mod
// @namespace    http://vertix.io/
// @version      0.1
// @description  `F1` or `Ctrl+?` to show the help menu. Features:Aimbot toggle or hold, Shows enemies on mini-map, Increases size and view of mini-map, Easy secondary, OP Fire all bullets at once, Autojump toggle, Shows weapon camos tooltip, Accurate aim cursor, Zoom map out or in, Max out the name field
// @author       Ze Anooky
// @match        https://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39875/Anooky%27s%20Vertix%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/39875/Anooky%27s%20Vertix%20Mod.meta.js
// ==/UserScript==

var halpTextArr = {
    "Shortcuts":       [
        "`F1` or `Ctrl+?` to show the help menu",
        "Hold `right click` to fire secondary, release to go back to primary",
        "`Middle click` to fire all bullets at once",
        "Zoom using `-` and `+`, `backtick` to reset zoom",
        "`z` to toggle auto jump",
        "`t` to toggle aimbot, or hold `Alt` down",
    ],
    "Features":        [
        "Aimbot toggle or hold",
        "Shows enemies on mini-map",
        "Increases size and view of mini-map",
        "Easy secondary",
        "OP Fire all bullets at once",
        "Autojump toggle",
        "Shows weapon camos tooltip",
        "Accurate aim cursor",
        "Zoom map out or in",
        "Max out the name field",
    ],
    "Class shortcuts": [
        "`1` to set the class to Triggerman on next spawn",
        "`2` to set the class to Detective on next spawn",
        "`3` to set the class to Hunter on next spawn",
        "`4` to set the class to Run 'N Gun on next spawn",
        "`5` to set the class to Vince on next spawn",
        "`6` to set the class to Rocketeer on next spawn",
        "`7` to set the class to Spray N' Pray on next spawn",
        "`8` to set the class to Arsonist on next spawn",
        "`9` to set the class to Duck on next spawn",
        "`0` to set the class to Nademan on next spawn",
    ],
};
var halpText    = '';
halpText += "VERTIX.IO insane mod!\n";
halpText += "\n";
for (var headingText in halpTextArr) {
    var sectionTextArr = halpTextArr[headingText];
    halpText += headingText + ":\n";
    for (var i in sectionTextArr) {
        halpText += "  - " + sectionTextArr[i] + "\n";
    }
    halpText += "\n";
}

// Faster minimap
drawMiniMapFPS = 1;

// Setup keyboard shortcuts
var autoJump                = false;
var zoomJumpPx              = 500;
var originalMaxScreenHeight = maxScreenHeight;
var originalMaxScreenWidth  = maxScreenWidth;
c.addEventListener('keydown', function (event) {
    if (!document.activeElement || document.activeElement.tagName != 'INPUT') {
        event.preventDefault();
        var keyCode = event.keyCode ? event.keyCode : event.which;
        // @formatter:off
        if (keyCode == 49 || keyCode ==  97) pickedCharacter(0); // Press `1` to set the class to Triggerman on next spawn
        if (keyCode == 50 || keyCode ==  98) pickedCharacter(1); // Press `2` to set the class to Detective on next spawn
        if (keyCode == 51 || keyCode ==  99) pickedCharacter(2); // Press `3` to set the class to Hunter on next spawn
        if (keyCode == 52 || keyCode == 100) pickedCharacter(3); // Press `4` to set the class to Run 'N Gun on next spawn
        if (keyCode == 53 || keyCode == 101) pickedCharacter(4); // Press `5` to set the class to Vince on next spawn
        if (keyCode == 54 || keyCode == 102) pickedCharacter(5); // Press `6` to set the class to Rocketeer on next spawn
        if (keyCode == 55 || keyCode == 103) pickedCharacter(6); // Press `7` to set the class to Spray N' Pray on next spawn
        if (keyCode == 56 || keyCode == 104) pickedCharacter(7); // Press `8` to set the class to Arsonist on next spawn
        if (keyCode == 57 || keyCode == 105) pickedCharacter(8); // Press `9` to set the class to Duck on next spawn
        if (keyCode == 48 || keyCode ==  96) pickedCharacter(9); // Press `0` to set the class to Nademan on next spawn
        // @formatter:on
        if (keyCode == 32 && !gameStart) { // Press ` ` to join match
            setTimeout(function () {
                document.getElementById('startButton').click();
            }, 100);
        } else if (keyCode == 90) { // Press `z` to toggle auto jump
            autoJump = !autoJump;
            setTimeout(function () {
                keys.s = autoJump;
            }, 10);
        } else if (keyCode == 112 || (event.ctrlKey && keyCode == 191)) { // Press `F1` or `Ctrl+?` to show the halp menu
            alert(halpText);
        } else if (keyCode == 84) { // Press `t` to toggle aimbot
            if (!aimbot_active) {
                aimbot_activate();
            } else {
                aimbot_deactivate();
            }
        } else if (keyCode == 16 && !aimbot_active) { // Hold `Alt` to activate aimbot
            aimbot_activate();
        }

        if (gameStart) { // Don't zoom if the game's not started yet
            if (keyCode == 187 || keyCode == 107) { // Press `+` to zoom in
                setZoom(maxScreenHeight - zoomJumpPx, maxScreenWidth - zoomJumpPx);
            } else if (keyCode == 189 || keyCode == 109) { // Press `-` to zoom out
                setZoom(maxScreenHeight + zoomJumpPx, maxScreenWidth + zoomJumpPx);
            } else if (keyCode == 192) { // Press ` (backtick) to reset zoom
                setZoom(originalMaxScreenHeight, originalMaxScreenWidth);
            }
        }
    }
});
c.addEventListener('keyup', function (event) {
    if (!document.activeElement || document.activeElement.tagName != 'INPUT') {
        event.preventDefault();
        var keyCode = event.keyCode ? event.keyCode : event.which;
        if (keyCode == 16) { // Release `Alt` to deactivate aimbot
            aimbot_deactivate();
        }
    }
});

function setZoom (maxScreenHeight, maxScreenWidth) {
    localStorage.setItem('maxScreenHeight', maxScreenHeight);
    localStorage.setItem('maxScreenWidth', maxScreenWidth);
    applyZoom();
}

function applyZoom () {
    maxScreenHeight = parseInt(localStorage.getItem('maxScreenHeight'));
    maxScreenWidth  = parseInt(localStorage.getItem('maxScreenWidth'));
    resize();
}

// Reapply previous zoom on game start
var oldStartGameFunction = startGame;

function startGame (a) {
    oldStartGameFunction(a);
    applyZoom();
}

// Override gameScroll
function gameScroll (a) {
}

var scrollLocked = false;
var timeout;

// Improve scroll switch weapon
c.addEventListener('scroll', function (event) {
    // Do nothing if still scrollLocked
    if (scrollLocked === true) {
        return false;
    }
    // Lock
    scrollLocked = true;

    // Switch weapon if not scrollLocked
    playerSwapWeapon(player, 1);

    clearTimeout(timeout);
    timeout = setTimeout(function () {
        // Unlock
        scrollLocked = false;
    }, 250);
});

// Setup mouse shortcuts
c.addEventListener('mousedown', function (event) {
    event.preventDefault();
    if (event.which == 2) { // Shoots all bullets on middle click
        for (var i = 0; i < 100; i++) {
            shootBullet(player);
        }
    } else if (event.which == 3) { // Shoots secondary on right click down
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 1);
    }
});
c.addEventListener('mouseup', function (event) {
    event.preventDefault();
    if (event.which == 3) { // Goes back to primary on up.
        setTimeout(playerSwapWeapon(player, 1), 1);
    }
});

window.onblur = function () {
    console.log('Window blurred');
    aimbot_deactivate();
};


// Change mini-map size.
document.getElementById('map').style.width  = '300px';
document.getElementById('map').style.height = '300px';

// Change cursor
c.style.cursor = 'url(https://s15.postimg.org/ka093ucbf/Hunter_Vertix_Cursor.png) 17 17, default';

// Show weapon camo in tooltip
var weaponNames = ["Machine Gun", "Desert Eagle", "Sniper", "Grenade Launcher", "Rocket Launcher", "Machine Pistol", "Minigun", "Flamethrower"];

var weaponNum = 0;
document.getElementById('charWpn').addEventListener('click', function () {
    weaponNum = 0;
}, false);
document.getElementById('charWpn2').addEventListener('click', function () {
    weaponNum = 1;
}, false);
document.getElementById('camoList').addEventListener('click', showCurrentWeapon, false);

function showCurrentWeapon () {
    var a = characterClasses[currentClassID].weaponIndexes[weaponNum]; // Get the weapon id.
    var x = 0;
    while (camoDataList[a][x].id != getCookie('wpnSkn' + a)) { // Find the proper id of the camo.
        x = x + 1;
    }
    if (weaponNum === 0) {
        characterWepnDisplay.innerHTML = "<b>Primary:</b><div class='hatSelectItem' style='display: inline-block; color: " + getItemRarityColor(camoDataList[a][x].chance) + ";'>" + camoDataList[a][x].name + " x" + (parseInt(camoDataList[a][x].count) + 1) + "<div class='hoverTooltip'><div style='float:left; margin-top:10px; margin-right:10px; width:62px; height:62px; background:url(" + getCamoURL(camoDataList[a][x].id) + "); background-size:cover; background-repeat:no-repeat; background-position:50% 50%;'></div><div style='color:" + getItemRarityColor(camoDataList[a][x].chance) + "; font-size:16px; margin-top:5px;'>" + camoDataList[a][x].name + "</div><div style='color:#ffd100; font-size:12px; margin-top:0px;'>droprate " + camoDataList[a][x].chance + "%</div><div style='font-size:8px; color:#d8d8d8; margin-top:1px;'><i>weapon camo</i></div><div style='font-size:12px; margin-top:5px;'>" + weaponNames[a] + " weapon skin.</div><div style='font-size:8px; color:#d8d8d8; margin-top:5px;'><i></i></div></div></div>";
    } else {
        characterWepnDisplay2.innerHTML = "<b>Secondary:</b><div class='hatSelectItem' style='display: inline-block; color: " + getItemRarityColor(camoDataList[a][x].chance) + ";'>" + camoDataList[a][x].name + " x" + (parseInt(camoDataList[a][x].count) + 1) + "<div class='hoverTooltip'><div style='float:left; margin-top:10px; margin-right:10px; width:62px; height:62px; background:url(" + getCamoURL(camoDataList[a][x].id) + "); background-size:cover; background-repeat:no-repeat; background-position:50% 50%;'></div><div style='color:" + getItemRarityColor(camoDataList[a][x].chance) + "; font-size:16px; margin-top:5px;'>" + camoDataList[a][x].name + "</div><div style='color:#ffd100; font-size:12px; margin-top:0px;'>droprate " + camoDataList[a][x].chance + "%</div><div style='font-size:8px; color:#d8d8d8; margin-top:1px;'><i>weapon camo</i></div><div style='font-size:12px; margin-top:5px;'>" + weaponNames[a] + " weapon skin.</div><div style='font-size:8px; color:#d8d8d8; margin-top:5px;'><i></i></div></div></div>";
    }
}

// Aimbot
var aimbot_active   = false;
var aimbot_interval = void 0;

function aimbot_activate () {
    c.removeEventListener('mousemove', gameInput, false);
    aimbot_active   = true;
    aimbot_interval = setInterval(aimbot_aimAtClosestPlayer, 10);
}

function aimbot_deactivate () {
    aimbot_active = false;
    clearInterval(aimbot_interval);
    c.addEventListener('mousemove', gameInput, false);
}

function aimbot_aimAtClosestPlayer () {
    var closestPlayer_details = aimbot_getClosestPlayer(gameObjects);
    var closestPlayer         = closestPlayer_details[0];
    if (!closestPlayer) {
        return;
    }
    var closestPlayer_angle    = aimbot_getAngle(player.x, player.y, closestPlayer.x, closestPlayer.y);
    var closestPlayer_distance = closestPlayer_details[1];
    aimbot_setTarget(closestPlayer_angle, closestPlayer_distance);
    targetChanged = true;
}

function aimbot_getClosestPlayer (gameObjects) {
    var myTeam                 = aimbot_getMyPlayer(gameObjects).team;
    var otherPlayers           = aimbot_getOtherPlayers(gameObjects, myTeam);
    var closestPlayer          = void 0;
    var closestPlayer_distance = Infinity;
    otherPlayers.forEach(function (otherPlayer) {
        var otherPlayer_distance = aimbot_getDistance(player.x, player.y, otherPlayer.x, otherPlayer.y);
        if (otherPlayer_distance < closestPlayer_distance) {
            closestPlayer          = otherPlayer;
            closestPlayer_distance = otherPlayer_distance;
        }
    });
    return [closestPlayer, closestPlayer_distance];
}

function aimbot_getMyPlayer (gameObjects) {
    return gameObjects.filter(function (gameObject) {
        return (gameObject.name === player.name);
    })[0];
}

function aimbot_getOtherPlayers (gameObjects, myTeam) {
    return gameObjects.filter(function (gameObject) {
        return (
            gameObject.type === 'player'
            &&
            gameObject.dead === false
            &&
            gameObject.name !== player.name
            &&
            gameObject.team !== myTeam
        );
    });
}

function aimbot_getDistance (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function aimbot_getAngle (x1, y1, x2, y2) {
    return Math.atan2(y1 - y2, x1 - x2);
}

function aimbot_setTarget (angle, distance) {
    target.f = angle;
    target.d = distance;
}


window.drawMiniMap = function () {
    mapCanvas.width = mapCanvas.width, mapContext.globalAlpha = 1;
    for (var a = 0; a < gameObjects.length; ++a) {
        'player' == gameObjects[a].type &&
        gameObjects[a].onScreen &&
        (gameObjects[a].index == player.index ||
         gameObjects[a].team !== player.team ||
         gameObjects[a].team == player.team ||
         gameObjects[a].isBoss) &&
        (mapContext.fillStyle = gameObjects[a].index == player.index ? '#fff' : gameObjects[a].isBoss ? '#db4fcd' : gameObjects[a].team !== player.team ? '#d20d12' : '#5151d9',
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