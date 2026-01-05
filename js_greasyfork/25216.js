// ==UserScript==
// @name          TagPro Timers (Pubs Only)
// @description   Timers for powerups, bombs, and boosts. Shows the second it will spawn then a countdown at 10 seconds. | Greasemonkey 4.1: ✕ Tampermonkey 4.4: ✔ 
//                Players show how much time is left on their active powerups. Blue = juke juice, yellow = rolling bomb, green = tagpro.
//			
//                Will not show timers on things that happened out of view, or if the spawn date is greater than the time left in the game.
//                All timers are cleared on game end.
//		          This special version is a pub only version
// @version       1.6
// @grant         none
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://*.newcompte.fr:*
// @include       http://tagpro-test.koalabeast.com/game
// @author        CFlakes
// @namespace     http://www.reddit.com/user/Cumflakes
// @license       2014
// @downloadURL https://update.greasyfork.org/scripts/25216/TagPro%20Timers%20%28Pubs%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/25216/TagPro%20Timers%20%28Pubs%20Only%29.meta.js
// ==/UserScript==

tagpro.ready(function timers() {
    if (!tagpro.playerId) {
        return setTimeout(timers, 250);
    }

    if (tagpro.group.socket) return;
    
    var tr = tagpro.renderer,
        self = tagpro.players[tagpro.playerId],
        tileTimer = [],
        ballTimer = [],
        gameEnd = false,
        playerCount = 0;
    
    tagpro.socket.on("mapupdate", function(data) {
        if (data.length > 1) {
            for (var i=0, l=data.length; i<l; i++) {
                switch (data[i].v) {
                    case 6.1:
                    case 6.2:
                    case 6.3:
                    case 10:
                    case 5:
                    case 14:
                    case 15:
                        handleTiles(data[i], 0);
                        break;
                    case 6:
                        handleTiles(data[i], 59999, '#00FF00');
                        break;
                    case '10.1':
                        handleTiles(data[i], 29999, '#D0A9F5');
                        break;
                    case '5.1':
                    case '14.1':
                    case '15.1':
                        handleTiles(data[i], 9999);
                        break;
                }
            }
        } else {
            data = data[0] || data;
            switch (data.v) {
                case 6.1:
                case 6.2:
                case 6.3:
                case 10:
                case 5:
                case 14:
                case 15:
                    handleTiles(data, 0);
                    break;
                case 6:
                    handleTiles(data, 59999, '#00FF00');
                    break;
                case '10.1':
                    handleTiles(data, 29999, '#D0A9F5');
                    break;
                case '5.1':
                case '14.1':
                case '15.1':
                    handleTiles(data, 9999);
                    break;
            }
        }
    });
    
    tagpro.socket.on("p", function(data) {
        data = data.u || data;
        for (var i = 0, l = data.length; i !== l; i++) {
            handlePlayerUpdate(data[i], data[i].id);
        }
    });
    
    function handlePlayerUpdate(data, id) {
        var player = tagpro.players[id];
        if (!player.countCheck) {
            player.countCheck = true;
            playerCount++;
        }
        if (data.grip !== undefined || data.bomb !== undefined || data.tagpro !== undefined || data.draw !== undefined || data.dead !== undefined) {
            ballTimer[id] = ballTimer[id] || {jj: {}, rb: {}, tp: {}};
            handlePlayers(data.id);
        }
    }
    
    tagpro.socket.on('playerLeft', function() {
        playerCount--;
    });
    
    tagpro.socket.on('end', function() {
        gameEnd = true;
        if (tagpro.renderer.layers.foreground.children.length > playerCount) {
            tagpro.renderer.layers.foreground.removeChildren(playerCount);
        }
    });
    
    function getTiles(onlyPups) {
        for (var x=0, xl=tagpro.map.length, yl=tagpro.map[0].length; x<xl; x++) {
            tileTimer[x] = tileTimer[x] || [];
            for (var y=0; y<yl; y++) {
                if (onlyPups) {
                    switch (tagpro.map[x][y]) {
                        case 6:
                        case 6.1:
                        case 6.2:
                        case 6.3:
                            tileTimer[x][y].v = tagpro.map[x][y];
                            break;
                    }
                } else {
                    switch (tagpro.map[x][y]) {
                        case 6:
                        case 6.1:
                        case 6.2:
                        case 6.3:
                        case 5:
                        case '5.1':
                        case 14:
                        case '14.1':
                        case 15:
                        case '15.1':
                        case 10:
                        case '10.1':
                            tileTimer[x][y] = {v: tagpro.map[x][y]};
                            break;
                    }
                }
            }
        }
    }
    getTiles();
    
    function getPlayers() {
        for (var id in tagpro.players) {
            if (tagpro.players.hasOwnProperty(id)) {
                var player = tagpro.players[id];
                if (!player.countCheck) {
                    player.countCheck = true;
                    playerCount++;
                }
                ballTimer[id] = ballTimer[id] || {jj: {}, rb: {}, tp: {}};
                if (player.draw) {
                    if (!player.grip) ballTimer[id].jj.check = true;
                    if (!player.bomb) ballTimer[id].rb.check = true;
                    if (!player.tagpro) ballTimer[id].tp.check = true;
                } else {
                    ballTimer[id].jj.check = false;
                    ballTimer[id].rb.check = false;
                    ballTimer[id].tp.check = false;
                }
            }
        }
    }
    getPlayers();
    
    tr.basicText = function(text, color, size) {
        return new PIXI.Text(text, {
            font: size || "20pt Arial",
            fill: color || "#FFFFFF",
            stroke: "#000000",
            strokeThickness: 3
        });
    };
    
    tr.drawTileTimer = function(tile, color) {
        if (gameEnd) return;
        var timeLeft = tile.spawn - Date.now(),
            timer = tileTimer[tile.x][tile.y];
        if (timeLeft > 10000) {
            if (!timer.second) {
                timer.second = tr.basicText(tile.time.substr(tile.time.length - 2, 2), color);
                timer.second.x = tile.x*40 + 3;
                timer.second.y = tile.y*40 + 7;
                tr.layers.foreground.addChild(timer.second);
            }
            timer.timeout = setTimeout(function() {
                tr.drawTileTimer(tile, color);
            }, timeLeft - 10000);
        } else {
            if (timer.second) {
                clearTimeout(timer.timeout);
                tr.layers.foreground.removeChild(timer.second);
                timer.second = undefined;
            }
            if (timeLeft > 0) {
                var tenths = Math.floor(timeLeft/100)/10 + '.0';
                if (!timer.countdown) {
                    timer.countdown = tr.basicText(tenths.substr(0, 3), color, '18pt Arial');
                    timer.countdown.x = tile.x*40 + 1;
                    timer.countdown.y = tile.y*40 + 9;
                    tr.layers.foreground.addChild(timer.countdown);
                }
                timer.countdown.setText(tenths.substr(0, 3));
                timer.timeout = setTimeout(function() {
                    tr.drawTileTimer(tile, color);
                }, 50);
            } else {
                if (timer.countdown) {
                    clearTimeout(timer.timeout);
                    tr.layers.foreground.removeChild(timer.countdown);
                    timer.countdown = undefined;
                }
            }
        }
    };
    
    tr.drawBallTimer = function(timer, id, i, color) {
        var offset = [],
            actPup = [tagpro.players[id].grip, tagpro.players[id].bomb, tagpro.players[id].tagpro];
        offset[0] = tagpro.players[id].degree ? 11 : 0;
        offset[1] = ballTimer[id].jj.sprite ? offset[0]+11 : offset[0];
        offset[2] = ballTimer[id].rb.sprite ? offset[1]+11 : offset[1];
        if (color && !gameEnd) {
            timer.expires = Date.now() + 19999;
            timer.left = Math.floor((timer.expires - Date.now())/1000);
            if (!timer.sprite && actPup[i]) {
                timer.sprite = tr.prettyText(timer.left, color);
                timer.sprite.x = 40;
                timer.sprite.y = -5 + offset[i];
                tagpro.players[id].sprites.info.addChild(timer.sprite);
                timer.timeout = setTimeout(function() {tr.drawBallTimer(timer, id, i);}, 50);
            }
        } else {
            if (actPup[i] && timer.expires - Date.now() > 0 && !gameEnd) {
                if (timer.expires - Date.now() > 10000) {
                    timer.left = Math.floor((timer.expires - Date.now())/1000);
                } else {
                    timer.left = (Math.floor((timer.expires - Date.now())/100)/10 + '.0').substr(0, 3);
                }
                timer.sprite.setText(timer.left);
                timer.sprite.y = -5 + offset[i];
                timer.timeout = setTimeout(function() {tr.drawBallTimer(timer, id, i);}, 50);
            } else {
                if (timer.timeout) {
                    clearTimeout(timer.timeout);
                }
                if (timer.sprite) {
                    tagpro.players[id].sprites.info.removeChild(timer.sprite);
                    timer.sprite = undefined;
                    timer.expires = 0;
                    timer.left = 0;
                }
            }
        }
    };
    
    function handleTiles(tile, spawn, color) {
        var timer = tileTimer[tile.x][tile.y];
        if (spawn) {
            var gameTimeLeft = tagpro.gameEndsAt - Date.now(),
                tileDist = {x: Math.abs(self.x - tile.x*40), y: Math.abs(self.y - tile.y*40)},
                inRange = ((tagpro.spectator || (tileDist.x < 655 && tileDist.y < 415)) && gameTimeLeft - spawn > 0) ? true : false;
            if (inRange) {
                tile.spawn = Date.now() + spawn;
                if (color) {
                    tile.time = '0' + Math.floor((gameTimeLeft + spawn)/1000 % 60);
                }
                if (timer.second === undefined && timer.countdown === undefined) {
                    tr.drawTileTimer(tile, color);
                }
            }
        } else {
            if (timer.timeout) {
                clearTimeout(timer.timeout);
            }
            if (timer.second) {
                tr.layers.foreground.removeChild(timer.second);
                timer.second = undefined;
            }
            if (timer.countdown) {
                tr.layers.foreground.removeChild(timer.countdown);
                timer.countdown = undefined;
            }
        }
        if (Math.floor(tile.v) === 6) {
            if (tile.v === 6) {
                getRepeatGrabs(tile.x, tile.y);
            }
            getTiles(true);
        }
    }
    
    function handlePlayers(id) {
        var player = tagpro.players[id];
        if (player.draw) {
            if (!player.grip) ballTimer[id].jj.check = true;
            if (!player.bomb) ballTimer[id].rb.check = true;
            if (!player.tagpro) ballTimer[id].tp.check = true;
        } else {
            ballTimer[id].jj.check = false;
            ballTimer[id].rb.check = false;
            ballTimer[id].tp.check = false;
        }
        if (player.grip) {
            if (ballTimer[id].jj.check) {
                getNearestPup(player.x, player.y);
                tr.drawBallTimer(ballTimer[id].jj, id, 0, '#58FAF4');
                ballTimer[id].jj.check = false;
            }
        }
        if (player.bomb) {
            if (ballTimer[id].rb.check) {
                getNearestPup(player.x, player.y);
                tr.drawBallTimer(ballTimer[id].rb, id, 1, '#FFFF00');
                ballTimer[id].rb.check = false;
            }
        }
        if (player.tagpro) {
            if (ballTimer[id].tp.check) {
                getNearestPup(player.x, player.y);
                tr.drawBallTimer(ballTimer[id].tp, id, 2, '#81F781');
                ballTimer[id].tp.check = false;
            }
        }
    }
    
    function getRepeatGrabs(x, y) {
        var oldPowerup = tileTimer[x][y].v;
        for (var id in tagpro.players) {
            if (tagpro.players.hasOwnProperty(id) && tagpro.players[id].draw && !tagpro.players[id].dead) {
                var player = tagpro.players[id],
                    distance = Math.sqrt(Math.pow((player.x + player.lx*7) - x*40, 2) + Math.pow((player.y + player.ly*7) - y*40, 2));
                if (distance < 40) {
                    switch (oldPowerup) {
                        case 6.1:
                            if (player.grip) {
                                ballTimer[id].jj.check = true;
                                handlePlayers(id);
                            }
                            break;
                        case 6.2:
                            if (player.bomb) {
                                ballTimer[id].rb.check = true;
                                handlePlayers(id);
                            }
                            break;
                        case 6.3:
                            if (player.tagpro) {
                                ballTimer[id].tp.check = true;
                                handlePlayers(id);
                            }
                            break;
                    }
                }
            }
        }
    }
    
    function getNearestPup(px, py) {
        var tile,
            timer,
            distance,
            nearest = 9999;
        for (var x=0, xl=tagpro.map.length, yl=tagpro.map[0].length; x<xl; x++) {
            for (var y=0; y<yl; y++) {
                if (Math.floor(tagpro.map[x][y]) === 6) {
                    distance = Math.sqrt(Math.pow(px - x*40, 2) + Math.pow(py - y*40, 2));
                    if (distance < nearest) {
                        nearest = distance;
                        timer = tileTimer[x][y];
                        tile = {x: x, y: y};
                    }
                }
            }
        }
        if (timer.second === undefined && timer.countdown === undefined) {
            tile.spawn = Date.now() + 59999;
            tile.time = '0' + Math.floor((tagpro.gameEndsAt - Date.now() + 59999)/1000 % 60);
            tile.color = '#00FF00';
            if (tagpro.gameEndsAt - tile.spawn > 0) {
                tr.drawTileTimer(tile, tile.color);
            }
        }
    }
});
