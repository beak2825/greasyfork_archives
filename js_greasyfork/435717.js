// ==UserScript==
// @name        TagPro Timers With Previews
// @description A timer script to be used with TagPro. All boosts, bombs, powerups, and player respawns will have a countdown.
// @locale
// @version     0.4.1
// @match        *://*.koalabeast.com/*
// @match        *://*.jukejuice.com/*
// @match        *://*.newcompte.fr/*
// @author      Some Ball -1 modified by Niplepotamus
// @grant       GM_setValue
// @grant       GM_getValue
// @license MIT
// @namespace https://greasyfork.org/users/840828
// @downloadURL https://update.greasyfork.org/scripts/435717/TagPro%20Timers%20With%20Previews.user.js
// @updateURL https://update.greasyfork.org/scripts/435717/TagPro%20Timers%20With%20Previews.meta.js
// ==/UserScript==

tagpro.ready(function() {
    tr = tagpro.renderer;
    tr.layers.timers = new PIXI.DisplayObjectContainer();
    tr.layers.pupTimes = new PIXI.DisplayObjectContainer();
    var timers = [],
        redflag, blueflag, spawntime,
        pup = false,
        pups = [],
        powerups = [],
        lastTime = [],
        me;

    var enable = GM_getValue('timers',true);

    $('#optionsName').append('<label style="margin-left: 50px;"><input id="timers" type="checkbox"'+(enable ? ' checked' : '')+'/>Enable Timers</label>');
    function enableDisable()
    {
        if(enable)
        {
            tr.layers.timers.alpha = 1;
            if(!tagpro.spectator && tagpro.players[tagpro.playerId].sprites.timers)
            	tagpro.players[tagpro.playerId].sprites.timers.alpha = 1;
        }
        else if(!enable)
        {
            tr.layers.timers.alpha = 0;
            if(!tagpro.spectator && tagpro.players[tagpro.playerId].sprites.timers)
	            tagpro.players[tagpro.playerId].sprites.timers.alpha = 0;
        }
    }
    $('#timers').change(function() {
        enable = $(this).is(':checked');
        GM_setValue('timers',enable);
        enableDisable();
    });

    tagpro.socket.on('end', function() {
        for(var x in timers)
        {
            for(var y in timers[x])
            {
                clearInterval(timers[x][y][4])
            }
        }
        for(var i = 0; i < 4; i++)
        {
            if (powerups[i] && powerups[i][3])
            {
                clearInterval(powerups[i][3])
            }
        }
    });
    tagpro.socket.on('mapupdate', function(data) {
        if(!(data instanceof Array)) data = [data];
        for(var i = 0; i < data.length; i++)
        {
            data[i].x = parseInt(data[i].x);
            data[i].y = parseInt(data[i].y);
            var which = parseFloat(data[i].v);
            if(which == 5 || which == 15 || which == 14 || which == 10 || which == 6.1 || which == 6.2 || which == 6.3 || which == 6.4 )
            {
                if(timers[data[i].x] && timers[data[i].x][data[i].y])
                {
                    tr.layers.timers.removeChild(timers[data[i].x][data[i].y][0]);
                    clearInterval(timers[data[i].x][data[i].y][4]);
                    delete timers[data[i].x][data[i].y]
                }
            }
            else
            {
                switch(which)
                {
                    case 5.1:
                        createTimer(data[i].x, data[i].y, 10000, 0xFFFF00);
                        break;
                    case 14.1:
                        createTimer(data[i].x, data[i].y, 10000, 0xFF0000);
                        break;
                    case 15.1:
                        createTimer(data[i].x, data[i].y, 10000, 0x0000FF);
                        break;
                    case 10.1:
                        createTimer(data[i].x, data[i].y, 30000, 0x696969);
                        break;
                    case 6.12:
                    case 6.22:
                    case 6.32:
                    case 6.42:
                        createTimer(data[i].x, data[i].y, 60000, 0xFFFFFF);
                        updatePupTime(data[i].x, data[i].y)
                        break;
                    default:
                        break;
                }
            }
        }
    });
    tagpro.socket.on('splat', function(data) {
        if(tagpro.playerId && !tagpro.spectator)
        {
            var me = tagpro.players[tagpro.playerId];
            if(data.t != me.team && !me.flag && (me.tagpro || me.bomb))
            {
                var theirflag = data.t == 1 ? redflag : blueflag;
                if (theirflag)
                {
                    if(timers[theirflag.x] && timers[theirflag.x][theirflag.y])
                    {
                        tr.layers.timers.removeChild(timers[theirflag.x][theirflag.y][0]);
                        clearInterval(timers[theirflag.x][theirflag.y][4]);
                        delete timers[theirflag.x][theirflag.y];
                    }
                    createTimer(theirflag.x, theirflag.y, spawntime || 3000, 0x00FF00, 1)
                }
            }
        }
    });
    tagpro.socket.on('spawn', function(data) {
        spawntime = parseFloat(data.w);
        var locx = parseInt(data.x / 40);
        var locy = parseInt(data.y / 40);
        if(timers[locx] && timers[locx][locy])
        {
            tr.layers.timers.removeChild(timers[locx][locy][0]);
            clearInterval(timers[locx][locy][4]);
            delete timers[locx][locy];
        }
        createTimer(locx, locy, spawntime || 3000, 0x00FF00, 1);
    });
    var waitOne = false;
    tagpro.socket.on('spectator', function(data) {
        waitOne = true;
    });

    tagpro.socket.on('time', function(data) {
        if(data.state && data.state == 5) //game going to overtime
        {
            updateOvertimePupTimes();
        }

    });

    function drawPups()
    {
        var me = tagpro.players[tagpro.playerId];
        if(!me || !me.sprites || !me.sprites.info)
        {
            setTimeout(drawPups, 50);
            return
        }
        me.sprites.timers = new PIXI.DisplayObjectContainer();
        var list = ['JJ', 'RB', 'TP', 'SP'];
        for(var i = 0; i < 4; i++)
        {
            if(powerups[i] && powerups[i][0])
            {
                powerups[i][0].alpha = 0;
                delete powerups[i][0]
            }
            powerups[i] = [tr.prettyText(''), list[i]];
            me.sprites.timers.addChild(powerups[i][0]);
            powerups[i][0].x = 40;
            powerups[i][0].y = 5 + i * 10;
            powerups[i][0].alpha = 0;
        }
        me.sprites.info.addChild(me.sprites.timers);
        tagpro.socket.on('p',function(data) {
            data = data.u || data;
            for(var i = 0;i < data.length;i++)
            {
                if(data[i].id===tagpro.playerId && data[i].bomb === false)
                {
                    powerups[1][0].setStyle({
                        font: "bold 8pt Arial",
                        fill: '#ffffff',
                        stroke: "#000000",
                        strokeThickness: 3
                    });
                    powerups[1][0].alpha = 0;
                    if (powerups[1][3])
                    {
                        clearInterval(powerups[1][3]);
                        delete powerups[1][3]
                    }
                }
            }
        });
        enableDisable();
    }

    function ifSpec()
    {
        if (!tagpro.spectator)
        {
            if (!waitOne)
            {
                waitOne = true;
                setTimeout(ifSpec, 500);
                return
            }
            drawPups();
            tagpro.socket.on('sound', function(sound) {
                pup = sound.s === 'powerup' ? (new Date()) : false
            });
            tagpro.socket.on('mapupdate', function(data) {
                if(!(data instanceof Array)) data = [data];
                for(var i = 0; i < data.length; i++)
                {
                    try
                    {
                        if(data[i].v == 6 && (new Date).getTime() - pup <= 10)
                        {
                            var me = tagpro.players[tagpro.playerId];
                            if(!me) break;
                            data[i].v = parseFloat(data[i].v);
                            data[i].x = parseInt(data[i].x);
                            data[i].y = parseInt(data[i].y);
                            if(!me.sprites.timers)
                                drawPups();
                            if(!me.sprites.timers.parent)
                                me.sprites.info.addChild(me.sprites.timers);
                            pup = false;
                            if(pups[data[i].x] && pups[data[i].x][data[i].y])
                            {
                                var was = pups[data[i].x][data[i].y],
                                    index = Math.round((was - 6.1) * 10);
                                if(powerups[index][3])
                                {
                                    clearInterval(powerups[index][3]);
                                    delete powerups[index][3]
                                }
                                powerups[index][0].setStyle({
                                    font: "bold 8pt Arial",
                                    fill: "#ffffff",
                                    stroke: "#000000",
                                    strokeThickness: 3
                                });
                                powerups[index][0].setText(powerups[index][1] + ': 20');
                                powerups[index][0].alpha = 1;
                                powerups[index][2] = new Date((new Date).getTime() + 20000);
                                powerups[index][3] = setInterval(updateSelf, 500, index);
                            }
                        }
                        else if(data[i].v > 6 && data[i].v <= 6.4)
                        {
                            if(!pups[data[i].x]) pups[data[i].x] = [];
                            pups[data[i].x][data[i].y] = data[i].v;
                        }
                    }
                    catch(e)
                    {
                        console.log("Error: "+e);
                    }
                }
            });

            function updateSelf(index)
            {
                var me = tagpro.players[tagpro.playerId];
                if(!me.sprites.timers)
                    drawPups();
                if(!me.sprites.timers.parent)
                    me.sprites.info.addChild(me.sprites.timers);
                var timeleft = powerups[index][2] - (new Date).getTime();
                if(timeleft <= 0)
                {
                    powerups[index][0].setStyle({
                        font: "bold 8pt Arial",
                        fill: '#ffffff',
                        stroke: "#000000",
                        strokeThickness: 3
                    });
                    powerups[index][0].alpha = 0;
                    clearInterval(powerups[index][3]);
                    delete powerups[index][3];
                    return;
                }
                var color = '#ffffff';
                if(timeleft <= 10000)
                {
                    color = (255 * (timeleft / 10000) + 0x100).toString(16).substring(1, 3);
                    color = '#ff' + color + '00'
                }
                else if(timeleft <= 15000)
                {
                    color = '#ffff' + (255 * ((timeleft - 10000) / 10000) + 0x100).toString(16).substring(1, 3)
                }
                powerups[index][0].setStyle({
                    font: "bold 8pt Arial",
                    fill: color,
                    stroke: "#000000",
                    strokeThickness: 3
                });
                powerups[index][0].setText(powerups[index][1] + ': ' + (Math.ceil(timeleft / 1000)));
            }
        }
    }
    ifSpec();

    function updateItems(x, y)
    {
        if(tr.gameContainer && !tr.layers.timers.parent)
            tr.gameContainer.addChildAt(tr.layers.timers, 2);
        if(tr.gameContainer && tr.gameContainer.getChildAt(2) != tr.layers.timers)
            tr.gameContainer.setChildIndex(tr.layers.timers, 2);
        if(!timers[x][y]) return //i don't know why this happens sometimes
        var curr = timers[x][y][0],
            end = timers[x][y][1],
            length = timers[x][y][2],
            color = timers[x][y][3],
            isSpawn = timers[x][y][5],
            time = curr.getChildAt(0),
            timeleft = end - (new Date).getTime(),
            radius = 15;
        if(timeleft <= 0)
        {
            tr.layers.timers.removeChild(timers[x][y][0]);
            clearInterval(timers[x][y][4]);
            delete timers[x][y];
            return;
        }
        time.setText(Math.ceil(timeleft / 1000))
    }

    function onScreen(x, y)
    {
        var me = tagpro.players[tagpro.playerId];
        if(!me) return false;
        return tagpro.spectator ? true : (Math.abs(me.x / 40 - x) < 16.25 && Math.abs(me.y / 40 - y) < 10.25)
    }

    function createTimer(x, y, timeout, color, force)
    {
        if (tr.gameContainer && !tr.layers.timers.parent)
            tr.gameContainer.addChildAt(tr.layers.timers, 2);
        if(tr.gameContainer && tr.gameContainer.getChildAt(2) != tr.layers.timers)
            tr.gameContainer.setChildIndex(tr.layers.timers, 2);
        if(!(force || onScreen(x,y)))
           return;
        var radius = 15,
            timer = new PIXI.DisplayObjectContainer(),
            time = new PIXI.Text((timeout / 1000).toString(), {
                font: '17.5pt Arial',
                fill: ((force || onScreen(x, y)) ? 'black' : 'brown'),
                stroke: 'white',
                strokeThickness: 3,
            });
        time.x = time.y = 20;
        time.anchor.x = time.anchor.y = .5;
        time.alpha = .9;
        timer.addChild(time);
        timer.x = Math.round(x * 40);
        timer.y = Math.round(y * 40);
        tr.layers.timers.addChild(timer);
        if(!timers[x]) timers[x] = [];
        timers[x][y] = [timer, new Date((new Date).getTime() + timeout), timeout, color, setInterval(updateItems, 500 - (force ? 250 : 0), x, y), force || 0];
    }

    function getSecond()
    {

        const date = new Date();
        var time = date.getTime();
        if(tagpro.state == 1) //game is in active state
        {
            var timeLeft = (tagpro.gameEndsAt - time)/1000;
            var second = 0;
            second = Math.floor(timeLeft % 60);
            return second;
        }
        else if(tagpro.state == 5)//game is in overtime state
        {
            var timeSinceOT = (time - tagpro.overtimeStartedAt )/1000;
            return Math.floor(timeSinceOT % 60);
        }
        return 0;
    }

    function updatePupTime(x, y)
    {
        if(!onScreen(x,y))
        {
           return;
        }
        var second = getSecond();
        if (tr.gameContainer && !tr.layers.pupTimes.parent)
            tr.gameContainer.addChildAt(tr.layers.pupTimes, 3);
        if(tr.gameContainer && tr.gameContainer.getChildAt(3) != tr.layers.pupTimes)
            tr.gameContainer.setChildIndex(tr.layers.pupTimes, 3);
        if(lastTime[x] && lastTime[x][y])
        {
            tr.layers.pupTimes.removeChild(lastTime[x][y]);
        }

        var timer = new PIXI.DisplayObjectContainer(),
            time = new PIXI.Text((second).toString(), {
                font: '11pt Arial',
                fill: 'black',
                stroke: 'blue',
                strokeThickness: 0.5,
            });
        time.x = time.y = 35;
        time.anchor.x = time.anchor.y = .5;
        time.alpha = .9;
        timer.addChild(time);
        timer.x = Math.round(x * 40);
        timer.y = Math.round(y * 40);
        tr.layers.pupTimes.addChild(timer);
        if(!lastTime[x]) lastTime[x] = [];
        lastTime[x][y] = timer;
    }

    function updateOvertimePupTimes()
    {
        for(var x = 0; x < lastTime.length; x++)
        {
            if(!lastTime[x]) continue;
            for(var y = 0; y <lastTime[x].length; y++)
            {
                if(!lastTime[x][y]) continue;
                var time = lastTime[x][y].getChildAt(0);
                var newTime = (60 - parseInt(time.text)) % 60;
                time.setText(Math.floor(newTime))
            }
        }
    }

    function findFlagsAndPups()
    {
        if(!tagpro.map)
        {
            setTimeout(findFlagsAndPups, 50);
            return
        }
        for(var i = 0; i < tagpro.map.length; i++)
        {
            var flags = [3, 19, 4, 20],
                powerups = [6.1, 6.2, 6.3, 6.4];
            for(var j = 0; j < flags.length; j++)
            {
                var found = tagpro.map[i].indexOf(flags[j]);
                if(found > -1)
                {
                    if (flags[j] == 3 || flags[j] == 19) {
                        redflag = {
                            x: i,
                            y: found
                        }
                    } else {
                        blueflag = {
                            x: i,
                            y: found
                        }
                    }
                }
                found = tagpro.map[i].indexOf(powerups[j]);
                while(found > -1)
                {
                    if (!pups[i]) pups[i] = [];
                    pups[i][found] = powerups[j];
                    found = tagpro.map[i].indexOf(powerups[j], found + 1)
                }
            }
        }
    }
    findFlagsAndPups();
});