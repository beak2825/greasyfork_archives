
// ==UserScript==
// @name         MELHOR SCRIPT DO BLOBLE.IO
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       You
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39816/MELHOR%20SCRIPT%20DO%20BLOBLEIO.user.js
// @updateURL https://update.greasyfork.org/scripts/39816/MELHOR%20SCRIPT%20DO%20BLOBLEIO.meta.js
// ==/UserScript==
addEventListener("keydown", function(a) {
    if (a.keyCode == 51) { //Generators
         for(i=-3.14;i<=2.36;i+=0.050){
              socket.emit("1",i,132,3);
       }
    }
    if (a.keyCode == 54) { //Armory
         socket.emit("1",UTILS.roundToTwo(2.75),UTILS.roundToTwo(175),7);
    }
    if (a.keyCode == 52) { //Houses
         for(i=-3.134;i<=2.492;i+=0.04620){
            socket.emit("1",i,194,4);
         }
    }

    if (a.keyCode == 50) {//Turrets
         socket.emit("1",2.75,245.75,2);socket.emit("1",2.50,245,2);socket.emit("1",3,245,2);
         for(i=-2.98;i<=2.2;i+=0.3235){
            socket.emit("1",i,245,2);
         }
    }
    if (a.keyCode == 49) {//Walls
         for(i=-3.14;i<3.14;i+=0.216){
             socket.emit("1",i,1e3,1);
         }
    }
    if (a.keyCode == 55) {//Barracks
        socket.emit("1",0.32,310,8);
        socket.emit("1",-0.98,310,8);
        socket.emit("1",1.61,310,8);
        socket.emit("1",-2.27,310,8);
    }
});

addEventListener("keydown", function(a) {
    if (a.keyCode == 77){
        for(i=0;i<users.length;++i){
            if(users[i].name.startsWith("[G]")&&users[i].name !== player.name){
                 camX = users[i].x-player.x;
                 camY = users[i].y-player.y;
            }
        }
   }
});



var headAppend=document.getElementsByTagName("head")[0],style=document.createElement("div");style.innerHTML="<style>#upgradeScriptCont,.buttonClass{background-color:rgba(40,40,40,.5);margin-left: 3px;border-radius:4px;pointer-events:all}#upgradeScriptCont{top: -138px;transition: 1s;margin-left:10px;position:absolute;padding-left:24px;margin-top:9px;padding-top:15px;width:530px;height:128px;font-family:arial;left:28%}#upgradeScriptCont:hover{top:0px}.buttonClass{color:#fff;padding:7px;height:19px;display:inline-block;cursor:pointer;font-size:15px}.hoverMessage{color: white;font-size: 14px;position: relative;left: 457px;bottom: 2px;pointer-events: none;}</style>",headAppend.appendChild(style);var contAppend=document.getElementById("gameUiContainer"),menuA=document.createElement("div");menuA.innerHTML="<div id=upgradeScriptCont><div id=layer1><div id=walls class=buttonClass onclick=walls()>Buy Walls</div><div id=upgradeBoulders class=buttonClass onclick=boulders()>Upgrade Boulders</div><div id=upgradeSpikes class=buttonClass onclick=spikes()>Upgrade Spikes</div><div id=upgradeGen class=buttonClass onclick=powerPlants()>Upgrade Power Plants</div></div><div id=layer2 style=margin-top:7px;margin-left:7px><div id=walls class=buttonClass onclick=generators()>Buy Generators</div><div id=upgradeBoulders class=buttonClass onclick=rapid()>Upgrade Rapid</div><div id=upgradeSpikes class=buttonClass onclick=ranged()>Upgrade Ranged</div><div id=upgradeGen class=buttonClass onclick=antiTank()>Upgrade anti-tank</div></div><div id=layer3 style=margin-top:7px;margin-left:-16px><div id=walls class=buttonClass onclick=gatlins()>Upgrade Gatlins</div><div id=upgradeBoulders class=buttonClass onclick=spotter()>Upgrade spotter</div><div id=upgradeMicro class=buttonClass onclick=microGenerators()>Upgrade Micro-Gen</div><div id=upgradeSpikes class=buttonClass onclick=semiAuto()>Upgrade Semi-auto</div></div><span class=hoverMessage>Hover over</span></div>",contAppend.insertBefore(menuA,contAppend.firstChild),window.walls=function(){for(i=-3.14;i<3.14;i+=.108)socket.emit("1",i,1e3,1)},window.generators=function(){for(i=-3.14;i<3.14;i+=.075)socket.emit("1",i,132,3)},window.boulders=function(){for(i=0;i<units.length;++i)3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.microGenerators=function(){for(i=0;i<units.length;++i)3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)},window.spikes=function(){for(i=0;i<units.length;++i)3==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.powerPlants=function(){for(i=0;i<units.length;++i)0==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.rapid=function(){for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.ranged=function(){for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)},window.antiTank=function(){for(i=0;i<units.length;++i)0==units[i].type&&4==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)},window.semiAuto=function(){for(i=0;i<units.length;++i)0==units[i].type&&4==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.gatlins=function(){for(i=0;i<units.length;++i)0==units[i].type&&2==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.spotter=function(){for(i=0;i<units.length;++i)0==units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)};



window.addEventListener("keyup", function(a) {
    a = a.keyCode ? a.keyCode : a.which;

    if (a === 81) { // All troops except commander
        selUnits = [];
        units.forEach((unit) => {
            if (unit.owner === player.sid && unit.type === 1) {
                if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
                unit.info.name !== 'Commander' && selUnits.push(unit)

            }
        });
        selUnitType = "Unit";
    } else if (a === 69) { // Everything
        selUnits = [];
        units.forEach((unit) => {
            if (unit.owner === player.sid && unit.type === 1) {
                if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
                selUnits.push(unit)
            }
        });
        selUnitType = "Unit";
    } else if (a === 67) { // Commander
        selUnits = [];
        units.every((unit) => {
            if (unit.owner === player.sid && unit.type === 1) {
                if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
                if (unit.info.name === 'Commander') {
                    selUnits.push(unit)
                    return false;
                }
            }
            return true;
        });
        selUnitType = "Unit";
    }
});


// ==UserScript==
// @name         Bloble.io NoobScript V3 InstaFind Fragment
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A fragment of code from NoobScript V3 - The instant player find feature. Click on a name on the leaderboard or click on a name in the chat to instantly find them. Use the < and > keys to navigate as well.
// @author       NoobishHacker
// @match        http://bloble.io/*
// @grant        none
// ==/UserScript==
var gotoUsers = [];
var gotoIndex = 0;
window.overrideSocketEvents = window.overrideSocketEvents || [];
window.chatCommands = window.chatCommands || {};

window.chatCommands.find = function(split) {
    var name = split.slice(1).join(' ');
    if (name == '') {
        addChat('Please specify a username', 'Client')
        return;
    }
    window.goto(name)
}
window.overrideSocketEvents.push({
    name: "l",
    description: "Leaderboard Insta Find override",
    func: function(a) {
        var d = "",
            c = 1,
            b = 0;
        for (; b < a.length;) {
            d += "<div class='leaderboardItem' onclick=goto2(" + a[b] + ");><div style='display:inline-block;float:left;' class='whiteText'>" + c + ".</div> <div class='" + (player && a[b] == player.sid ? "leaderYou" : "leader") + "'>" + a[b + 1] + "</div><div class='scoreText'>" + a[b + 2] + "</div></div>", c++, b += 3;
        }
        leaderboardList.innerHTML = d;
    }
})
leaderboardList.style.pointerEvents = 'auto';
chatListWrapper.style.pointerEvents = 'auto';

window.goto = function(username) {
    gotoUsers = users.filter((user) => {
        return user.name === username
    });
    gotoIndex = 0;
    if (gotoUsers[0]) {
        camX = gotoUsers[0].x - player.x;
        camY = gotoUsers[0].y - player.y;
    }
    addChat(gotoUsers.length + ' users found with the name ' + username, 'Client');
    return gotoUsers.length;
}
window.goto2 = function(id, go) {
    gotoUsers = users.filter((user) => {
        return user.sid === id;
    });
    gotoIndex = 0;
    if (!go && gotoUsers[0]) {
        camX = gotoUsers[0].x - player.x;
        camY = gotoUsers[0].y - player.y;
    }
    return gotoUsers.length;
}

window.gotoLeft = function() {
    if (!gotoUsers.length) return;

    if (camX == gotoUsers[gotoIndex].x - player.x && camY == gotoUsers[gotoIndex].y - player.y) {
        if (gotoIndex <= 0) gotoIndex = gotoUsers.length;
        gotoIndex--;
    }
    camX = gotoUsers[gotoIndex].x - player.x;
    camY = gotoUsers[gotoIndex].y - player.y;
}

window.gotoRight = function() {
    if (!gotoUsers.length) return;

    if (camX == gotoUsers[gotoIndex].x - player.x && camY == gotoUsers[gotoIndex].y - player.y) {
        if (gotoIndex >= gotoUsers.length - 1) gotoIndex = -1;
        gotoIndex++;
    }
    camX = gotoUsers[gotoIndex].x - player.x;
    camY = gotoUsers[gotoIndex].y - player.y;
}

window.addChat = function(msg, from, color) {
    color = color || "#fff";
    var b = document.createElement("li");
    b.className = "chatother";
    b.innerHTML = '<span style="color:' + color + '">[' + from + ']</span> <span class="chatText">' + msg + "</span>";
    10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
    chatList.appendChild(b)
}

window.resetCamera = function() { // Override
    camX = camXS = camY = camYS = 0;
    cameraKeys = {
        l: 0,
        r: 0,
        u: 0,
        d: 0
    }

    if (socket && window.overrideSocketEvents && window.overrideSocketEvents.length) {
        window.overrideSocketEvents.forEach((item) => {
            socket.removeAllListeners(item.name)
            socket.on(item.name, item.func);

        });

    }
}



window.addChatLine = function(a, d, c) {
    if (player) {
        var b = getUserBySID(a);
        if (c || 0 <= b) {
            var g = c ? "SERVER" : users[b].name;
            c = c ? "#fff" : playerColors[users[b].color] ? playerColors[users[b].color] : playerColors[0];
            player.sid == a && (c = "#fff");
            b = document.createElement("li");
            b.className = player.sid == a ? "chatme" : "chatother";

            b.innerHTML = '<span style="color:' + c + '" onclick=goto2(' + a + ');>[' + g + ']</span> <span class="chatText">' + d + "</span>";
            10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
            chatList.appendChild(b)
        }
    }
}

window.addEventListener("keyup", function(a) {
    a = a.keyCode ? a.keyCode : a.which;
    if (a === 190) {
        window.gotoRight()
    } else if (a === 188) {
        window.gotoLeft();
    }

});


// ==UserScript==
// @name         Bloble.io NoobScript V3 GameUtils Fragment
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  A fragment of code from NoobScript V3 - The FPS and resolution setter.
// @author       NoobishHacker
// @match        http://bloble.io/*
// @grant        none
// ==/UserScript==

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
// Resolution and FPS chooser.
var resolution = 1;
var rate = 0;

window.removeEventListener("mousemove", gameInput);

window.gameInput = function (a) {
    a.preventDefault();
    a.stopPropagation();
    mouseX = a.clientX * resolution;
    mouseY = a.clientY * resolution;
}
window.addEventListener("mousemove", gameInput, false);
window.removeEventListener("resize", resize);
window.resize = function (n) {
    screenWidth = window.innerWidth * resolution;
    screenHeight = window.innerHeight * resolution;
    scaleFillNative = MathMAX(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight);
    if (n !== true) {
        mainCanvas.width = screenWidth;
        mainCanvas.height = screenHeight;
        mainCanvas.style.width = (screenWidth / resolution) + "px";
        mainCanvas.style.height = (screenHeight / resolution) + "px";
    }

    mainContext.setTransform(scaleFillNative, 0, 0, scaleFillNative, Math.floor((screenWidth - maxScreenWidth * scaleFillNative) / 2), Math.floor((screenHeight - maxScreenHeight * scaleFillNative) / 2));
    player || renderBackground()
}
window.addEventListener("resize", resize);
window.statusItems.push({
    order: 3,
    value: function () {
        return document.getElementById('fps').textContent;
    }
}, {
    order: 4,
    name: 'Resolution',
    value: function () {
        return document.getElementById('res').textContent;
    }
});
window.UIList.push({
    level: 3,
    x: 4,
    html: '<div id="res" onclick=setRes()>Normal Res</div>'
}, {
    level: 3,
    x: 5,
    html: '<div id="fps" onclick=setFPS()>Unlim FPS</div>'
}, {
    level: 3,
    x: 1,
    html: '<div id="afk" onclick=afk()>AFK off</div>'
});
var afkinterval = false;
window.afk = function () {
    var element = document.getElementById('afk');
    if (afkinterval) {
        clearInterval(afkinterval)
        afkinterval = false;
        element.textContent = 'AFK off';
    } else {
        afkinterval = setInterval(function () {
            socket.emit("2", Math.round(camX), Math.round(camY));
        }, 1000)
        element.textContent = 'AFK on';
    }
}
window.setRes = function () {
    var el = document.getElementById('res');
    if (resolution === 2) {
        resolution = .5;
        el.textContent = 'Low Res';
    } else if (resolution === .5) {
        resolution = .8;
        el.textContent = 'Med Res';
    } else if (resolution === .8) {
        resolution = 1;
        el.textContent = 'Normal Res';
    } else if (resolution === 1) {
        resolution = 1.5;
        el.textContent = 'High Res';
    } else {
        resolution = 2;
        el.textContent = 'Retina Res';
    }
    unitSprites = {};
    resize();
    window.statusBar();
}
window.setFPS = function () {
    var el = document.getElementById('fps');
    if (rate === 0) {
        el.textContent = '45 FPS'
        rate = 22;
    } else if (rate === 22) {
        el.textContent = '40 FPS'
        rate = 25;
    } else if (rate === 25) {
        el.textContent = '35 FPS'
        rate = 28;
    } else if (rate === 28) {
        el.textContent = '30 FPS';
        rate = 33;
    } else if (rate === 33) {
        el.textContent = '25 FPS';
        rate = 40;
    } else if (rate === 40) {
        el.textContent = '20 FPS';
        rate = 50;
    } else {
        el.textContent = 'Unlim FPS';
        rate = 0;
    }
    window.statusBar();
}

window.callUpdate = function () {
    requestAnimFrame(callUpdate);
    currentTime = window.performance.now();
    var a = currentTime - then;
    if (a >= rate) {
        then = currentTime;
        updateGameLoop(a);
    }
    updateMenuLoop(a)
}

window.makeUI = function () {
    if (window.hasMadeUI) return;
    window.hasMadeUI = true;
    window.statusItems.sort(function (a, b) {
        return a.order - b.order;
    })
    var levels = [];
    window.UIList.forEach((item) => {
        if (!levels[item.level]) levels[item.level] = [];
        levels[item.level].push(item)
    })

    levels = levels.filter((a) => {
        if (a) {
            a.sort(function (a, b) {
                return a.x - b.x;
            })
            return true;
        } else {
            return false;
        }
    })

    var headAppend = document.getElementsByTagName("head")[0],
        style = document.createElement("div");

    var toast = document.createElement('div');
    toast.id = "snackbar";
    var css = document.createElement('div');

    css.innerHTML = '<style>\n\
#snackbar {\n\
    visibility: hidden;\n\
    min-width: 250px;\n\
    margin-left: -125px;\n\
    background-color: rgba(40, 40, 40, 0.5);\n\
    color: #fff;\n\
    text-align: center;\n\
    border-radius: 4px;\n\
    padding: 10px;\n\
    font-family: "regularF";\n\
    font-size: 20px;\n\
    position: fixed;\n\
    z-index: 100;\n\
    left: 50%;\n\
    top: 30px;\n\
}\n\
#snackbar.show {\n\
    visibility: visible;\n\
    -webkit-animation: fadein 0.5s;\n\
    animation: fadein 0.5s;\n\
}\n\
#snackbar.hide {\n\
    visibility: visible;\n\
    -webkit-animation: fadeout 0.5s;\n\
    animation: fadeout 0.5s;\n\
}\n\
@-webkit-keyframes fadein {\n\
    from {top: 0; opacity: 0;}\n\
    to {top: 30px; opacity: 1;}\n\
}\n\
@keyframes fadein {\n\
    from {top: 0; opacity: 0;}\n\
    to {top: 30px; opacity: 1;}\n\
}\n\
@-webkit-keyframes fadeout {\n\
    from {top: 30px; opacity: 1;}\n\
    to {top: 0; opacity: 0;}\n\
}\n\
@keyframes fadeout {\n\
    from {top: 30px; opacity: 1;}\n\
    to {top: 0; opacity: 0;}\n\
}\n\
</style>'
    var height = levels.length * (14 + 19) + (levels.length - 1) * 7 + 15;
    style.innerHTML = "<style>\n\
#noobscriptUI, #noobscriptUI > div > div {\n\
    background-color:rgba(40,40,40,.5);\n\
    margin-left: 3px;\n\
    border-radius:4px;\n\
    pointer-events:all\n\
}\n\
#noobscriptUI {\n\
    top: -" + (height + 12) + "px;\n\
    transition: 1s;\n\
    margin-left:10px;\n\
    position:absolute;\n\
    padding-left:24px;\n\
    margin-top:9px;\n\
    padding-top:15px;\n\
    width:580px;\n\
    height: " + height + "px;\n\
    font-family:arial;\n\
    left:25%\n\
}\n\
#noobscriptUI:hover{\n\
    top:0px\n\
}\n\
#noobscriptUI > div > div {\n\
    color:#fff;\n\
    padding:7px;\n\
    height:19px;\n\
    display:inline-block;\n\
    cursor:pointer;\n\
    font-size:15px\n\
}\n\
</style>"

    headAppend.appendChild(style);
    headAppend.appendChild(css);


    var contAppend = document.getElementById("gameUiContainer"),
        menuA = document.createElement("div");

    var code = ['<div id="noobscriptUI">\n'];

    levels.forEach((items, i) => {
        code.push(i === 0 ? '    <div>\n' : '    <div style="margin-top:7px;">\n');
        items.forEach((el) => {
            code.push('        ' + el.html + '\n');
        })
        code.push('    </div>\n');
    })
    code.push('    <div id="confinfo" style="margin-top:4px; color: white; text-align: center; font-size: 10px; white-space:pre"></div>')
    code.push('</div>');

    menuA.innerHTML = code.join("");
    contAppend.insertBefore(menuA, contAppend.firstChild)
    contAppend.appendChild(toast)
    var toastTimeout = false;
    window.showToast = function (msg) {
        toast.textContent = msg;

        if (toastTimeout) clearTimeout(toastTimeout);
        else toast.className = "show";
        toastTimeout = setTimeout(function () {
            toast.className = 'hide'
            setTimeout(function () {
                toast.className = '';
            }, 400);
            toastTimeout = false;
        }, 3000);
    }
    window.statusBar = function () {
        var el = document.getElementById('confinfo');
        var text = [];

        window.statusItems.forEach((item, i) => {
            if (i !== 0) text.push('     ');
            if (item.name) text.push(item.name + ': ');
            text.push(item.value());
        })

        el.textContent = text.join('');
    }
    window.statusBar();

    window.initFuncs.forEach((func) => {
        func();
    })
}
setTimeout(() => {
    window.makeUI();
}, 1000)


// ==UserScript==
// @name         Bloble.io NoobScript V3 BaseBuild Fragment
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A fragment of code from NoobScript V3 - The Base Builder.
// @author       NoobishHacker
// @match        http://bloble.io/*
// @grant        none
// ==/UserScript==

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];


window.UIList.push({
    level: 0,
    x: 0,
    html: '<div onclick=buildGenerators()>Build Generators</div>'
}, {
    level: 0,
    x: 1,
    html: '<div onclick=walls()>Build Walls</div>'
}, {
    level: 0,
    x: 2,
    html: '<div onclick=buildHouses()>Build Offense</div>'
}, {
    level: 0,
    x: 4,
    html: '<div onclick=buildHybrid()>Build Hybrid</div>'
}, {
    level: 1,
    x: 0,
    html: '<div onclick=boulders()>Upgrade Boulders</div>'
}, {
    level: 1,
    x: 1,
    html: '<div onclick=spikes()>Upgrade Spikes</div>'
}, {
    level: 1,
    x: 2,
    html: '<div onclick=microGenerators()>Mico-Generators</div>'
}, {
    level: 1,
    x: 3,
    html: '<div onclick=powerPlants()>Upgrade Power Plants</div>'
}, {
    level: 2,
    x: 0,
    html: '<div onclick=sellGenerators()>Sell Generators</div>'
}, {
    level: 2,
    x: 1,
    html: '<div onclick=sellall()>Sell all</div>'
});

function emit2() {
    socket.emit.apply(socket, arguments);
}
window.walls = function () {
    for (i = -3.14; i < 3.14; i += .108) emit2("1", i, 1e3, 1)
}
window.sellGenerators = window.sellGenerators || function () {
    for (var a = [], d = 0; d < units.length; ++d) {
        if (units[d].type === 0 && units[d].owner == player.sid) {
            var name = getUnitFromPath(units[d].uPath).name;
            (name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)
        }
    }
    socket.emit("3", a)
}
window.sellhouses = function () {
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'House' && a.push(units[d].id);
    socket.emit("3", a)
}
window.sellwalls = function () {
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);
    socket.emit("3", a)
}
window.sellinner = function () {
    for (var a = [], d = 0; d < units.length; ++d) {
        if (units[d].type === 0 && units[d].owner == player.sid) {
            a.push(units[d].id)
        }
    }
    socket.emit("3", a)
}
window.sellall = function () {
    for (var a = [], d = 0; d < units.length; ++d)(units[d].type === 3 || units[d].type === 2 || units[d].type === 0) && units[d].owner == player.sid && a.push(units[d].id);
    socket.emit("3", a)
}
window.boulders = window.boulders || function () {
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.microGenerators = window.microGenerators || function () {
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
window.spikes = window.spikes || function () {
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.powerPlants = window.powerPlants || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.rapid = window.rapid || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 1 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.ranged = window.ranged || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 1 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
window.antiTank = window.antiTank || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
window.semiAuto = window.semiAuto || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.gatlins = window.gatlins || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 2 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.spotter = window.spotter || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 3 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
};
window.build = function (instr) {
    instr.forEach((ins) => {
        emit2.apply({}, ins);
    })
}
window.buildHybrid = function () {
    window.build([["1", 3.13, 243.85, 5], ["1", 2.87, 246.85, 2], ["1", 2.62, 243.85, 5], ["1", 2.37, 246.85, 2], ["1", 2.11, 243.85, 5], ["1", 1.86, 246.85, 2], ["1", 1.6, 243.85, 5], ["1", 1.34, 246.85, 2], ["1", 1.08, 243.85, 5], ["1", 0.82, 246.85, 2], ["1", 0.56, 243.85, 5], ["1", 0.3, 246.85, 2], ["1", 0.04, 243.85, 5], ["1", -0.21, 246.85, 2], ["1", -0.46, 243.85, 5], ["1", -0.72, 246.85, 2], ["1", -0.98, 243.85, 5], ["1", -1.23, 246.85, 2], ["1", -1.49, 243.85, 5], ["1", -1.74, 246.85, 2], ["1", -1.99, 243.85, 5], ["1", -2.25, 246.85, 2], ["1", -2.51, 243.85, 5], ["1", -2.77, 246.85, 2], ["1", 2.77, 190.49, 2], ["1", 2.43, 187.99, 2], ["1", 1.96, 188.53, 2], ["1", 2.76, 130, 4], ["1", 2.28, 130, 4], ["1", 1.79, 130, 4], ["1", 1.28, 130, 4], ["1", 0.79, 130, 4], ["1", 0.28, 130, 4], ["1", -0.19, 130, 4], ["1", -0.67, 130, 4], ["1", -1.17, 130, 4], ["1", -1.64, 130, 4], ["1", -2.13, 130, 4], ["1", -2.61, 130, 4], ["1", -3.06, 138.27, 4], ["1", -2.94, 195.69, 2], ["1", -2.4, 183.33, 2], ["1", -1.91, 180.8, 2], ["1", -1.41, 182.01, 2], ["1", -0.94, 182.52, 2], ["1", -0.45, 180.37, 2], ["1", 0.04, 178.74, 2], ["1", 0.53, 177.22, 2], ["1", 1.03, 181.72, 2], ["1", 1.49, 184.1, 2]]);
}
window.buildHouses = function () {
    window.build([["1", -0.09, 245.4, 1], ["1", 0.16, 243.15, 1], ["1", 0.41, 243.84, 1], ["1", 0.67, 244.57, 1], ["1", 0.04, 183.15, 5], ["1", 0.39, 184.96, 2], ["1", 0.72, 184.99, 4], ["1", 0.92, 245.85, 4], ["1", -0.34, 245.85, 4], ["1", -0.34, 140, 7], ["1", -0.6, 245.85, 4], ["1", 0.25, 130, 4], ["1", -0.88, 130, 4], ["1", -1.37, 130, 4], ["1", -1.86, 130, 4], ["1", -2.36, 130, 4], ["1", -2.88, 130, 4], ["1", 2.85, 130, 4], ["1", 2.36, 130, 4], ["1", 1.85, 130, 4], ["1", 1.38, 130, 4], ["1", 0.9, 130, 4], ["1", 1.19, 245.85, 4], ["1", 1.46, 245.85, 4], ["1", 1.73, 245.85, 4], ["1", 2, 245.85, 4], ["1", 2.26, 245.85, 4], ["1", 2.52, 245.85, 4], ["1", 2.78, 245.85, 4], ["1", 3.04, 245.85, 4], ["1", -2.99, 245.85, 4], ["1", -2.74, 245.85, 4], ["1", -2.49, 245.85, 4], ["1", -2.24, 245.85, 4], ["1", -1.99, 245.85, 4], ["1", -1.74, 245.85, 4], ["1", -1.48, 245.85, 4], ["1", -1.23, 245.85, 4], ["1", -0.94, 245.85, 4], ["1", -0.72, 187.11, 4], ["1", -1.06, 186.05, 4], ["1", -1.53, 186.15, 4], ["1", -1.87, 191.23, 4], ["1", -2.21, 185.53, 4], ["1", -2.55, 184.19, 4], ["1", 1.07, 186.28, 4], ["1", 1.61, 184.13, 4], ["1", 2.07, 185.66, 4], ["1", 2.39, 192.03, 4], ["1", 2.71, 186.8, 4], ["1", 3.06, 185.93, 4]])
    //     window.build([["1", 0.24, 245.85, 4], ["1", 0.49, 245.85, 4], ["1", 0.74, 245.85, 4], ["1", -0.01, 245.85, 4], ["1", -0.26, 245.85, 4], ["1", -0.51, 245.85, 4], ["1", 1, 245.85, 4], ["1", 1.25, 245.85, 4], ["1", 1.5, 245.85, 4], ["1", 1.75, 245.85, 4], ["1", 2, 245.85, 4], ["1", 2.25, 245.85, 4], ["1", 2.5, 245.85, 4], ["1", 2.75, 245.85, 4], ["1", 3.01, 245.85, 4], ["1", -3.03, 245.85, 4], ["1", -3.01, 245.85, 4], ["1", -2.75, 245.85, 4], ["1", -2.49, 245.85, 4], ["1", -2.24, 245.85, 4], ["1", -1.98, 245.85, 4], ["1", -1.72, 245.85, 4], ["1", -1.46, 245.85, 4], ["1", -1.21, 245.85, 4], ["1", -0.96, 245.85, 4], ["1", -0.72, 203.14, 4], ["1", -0.39, 190.85, 4], ["1", -0.59, 130, 4], ["1", -0.05, 185.69, 4], ["1", 0.11, 130, 4], ["1", 0.31, 185.08, 5], ["1", 0.66, 187.02, 4], ["1", 1.02, 184.03, 4], ["1", 0.84, 130, 4], ["1", 1.36, 189.19, 4], ["1", 1.7, 186.55, 4], ["1", 1.44, 130, 4], ["1", 2.05, 186.48, 4], ["1", 1.92, 130, 4], ["1", 1.91, 130, 4], ["1", 2.38, 191.67, 4], ["1", 2.38, 130, 4], ["1", 2.71, 185.92, 4], ["1", 3.05, 185.84, 4], ["1", 2.87, 130, 4], ["1", -2.9, 188.9, 4], ["1", -2.57, 187.48, 4], ["1", -2.74, 130, 4], ["1", -2.24, 185.43, 4], ["1", -1.91, 186.44, 4], ["1", -2.07, 130, 4], ["1", -1.57, 190.81, 4], ["1", -1.58, 186.32, 4], ["1", -1.42, 130, 4], ["1", -1.24, 186.06, 4]]);
}
window.buildGenerators = function () {
    var arr = [["1", 3.11, 243.85, 3], ["1", -2.9, 243.85, 3], ["1", -2.63, 243.85, 3], ["1", -2.36, 243.85, 3], ["1", -2.06, 243.85, 3], ["1", -1.77, 243.85, 3], ["1", -1.5, 243.85, 3], ["1", -1.22, 243.85, 3], ["1", -0.94, 243.85, 3], ["1", -0.64, 243.85, 3], ["1", -0.36, 243.85, 3], ["1", -0.07, 243.85, 3], ["1", 0.2, 243.85, 3], ["1", 0.47, 243.85, 3], ["1", 0.76, 243.85, 3], ["1", 1.05, 243.85, 3], ["1", 1.35, 243.85, 3], ["1", 1.64, 243.85, 3], ["1", 1.92, 243.85, 3], ["1", 2.22, 243.85, 3], ["1", 2.49, 243.85, 3], ["1", 2.78, 243.85, 3], ["1", 3, 183.39, 3], ["1", -2.91, 178.82, 3], ["1", -2.5, 182.85, 3], ["1", -2.11, 178.92, 3], ["1", -1.72, 176.82, 3], ["1", -1.35, 177.59, 3], ["1", -0.98, 174.52, 3], ["1", -0.57, 179.76, 3], ["1", -0.19, 183.42, 3], ["1", 0.21, 176.37, 3], ["1", 0.63, 179.87, 3], ["1", 1.03, 175.57, 3], ["1", 1.43, 176.6, 3], ["1", 1.8, 181.19, 3], ["1", 2.19, 177.95, 3], ["1", 2.6, 178.66, 3]]
    window.build(arr);
}
window.makeUI = function () {
    if (window.hasMadeUI) return;
    window.hasMadeUI = true;
    window.statusItems.sort(function (a, b) {
        return a.order - b.order;
    })
    var levels = [];
    window.UIList.forEach((item) => {
        if (!levels[item.level]) levels[item.level] = [];
        levels[item.level].push(item)
    })

    levels = levels.filter((a) => {
        if (a) {
            a.sort(function (a, b) {
                return a.x - b.x;
            })
            return true;
        } else {
            return false;
        }
    })

    var headAppend = document.getElementsByTagName("head")[0],
        style = document.createElement("div");

    var toast = document.createElement('div');
    toast.id = "snackbar";
    var css = document.createElement('div');

    css.innerHTML = '<style>\n\
#snackbar {\n\
    visibility: hidden;\n\
    min-width: 250px;\n\
    margin-left: -125px;\n\
    background-color: rgba(40, 40, 40, 0.5);\n\
    color: #fff;\n\
    text-align: center;\n\
    border-radius: 4px;\n\
    padding: 10px;\n\
    font-family: "regularF";\n\
    font-size: 20px;\n\
    position: fixed;\n\
    z-index: 100;\n\
    left: 50%;\n\
    top: 30px;\n\
}\n\
#snackbar.show {\n\
    visibility: visible;\n\
    -webkit-animation: fadein 0.5s;\n\
    animation: fadein 0.5s;\n\
}\n\
#snackbar.hide {\n\
    visibility: visible;\n\
    -webkit-animation: fadeout 0.5s;\n\
    animation: fadeout 0.5s;\n\
}\n\
@-webkit-keyframes fadein {\n\
    from {top: 0; opacity: 0;}\n\
    to {top: 30px; opacity: 1;}\n\
}\n\
@keyframes fadein {\n\
    from {top: 0; opacity: 0;}\n\
    to {top: 30px; opacity: 1;}\n\
}\n\
@-webkit-keyframes fadeout {\n\
    from {top: 30px; opacity: 1;}\n\
    to {top: 0; opacity: 0;}\n\
}\n\
@keyframes fadeout {\n\
    from {top: 30px; opacity: 1;}\n\
    to {top: 0; opacity: 0;}\n\
}\n\
</style>'
    var height = levels.length * (14 + 19) + (levels.length - 1) * 7 + 15;
    style.innerHTML = "<style>\n\
#noobscriptUI, #noobscriptUI > div > div {\n\
    background-color:rgba(40,40,40,.5);\n\
    margin-left: 3px;\n\
    border-radius:4px;\n\
    pointer-events:all\n\
}\n\
#noobscriptUI {\n\
    top: -" + (height + 12) + "px;\n\
    transition: 1s;\n\
    margin-left:10px;\n\
    position:absolute;\n\
    padding-left:24px;\n\
    margin-top:9px;\n\
    padding-top:15px;\n\
    width:580px;\n\
    height: " + height + "px;\n\
    font-family:arial;\n\
    left:25%\n\
}\n\
#noobscriptUI:hover{\n\
    top:0px\n\
}\n\
#noobscriptUI > div > div {\n\
    color:#fff;\n\
    padding:7px;\n\
    height:19px;\n\
    display:inline-block;\n\
    cursor:pointer;\n\
    font-size:15px\n\
}\n\
</style>"

    headAppend.appendChild(style);
    headAppend.appendChild(css);


    var contAppend = document.getElementById("gameUiContainer"),
        menuA = document.createElement("div");

    var code = ['<div id="noobscriptUI">\n'];

    levels.forEach((items, i) => {
        code.push(i === 0 ? '    <div>\n' : '    <div style="margin-top:7px;">\n');
        items.forEach((el) => {
            code.push('        ' + el.html + '\n');
        })
        code.push('    </div>\n');
    })
    code.push('    <div id="confinfo" style="margin-top:4px; color: white; text-align: center; font-size: 10px; white-space:pre"></div>')
    code.push('</div>');

    menuA.innerHTML = code.join("");
    contAppend.insertBefore(menuA, contAppend.firstChild)
    contAppend.appendChild(toast)
    var toastTimeout = false;
    window.showToast = function (msg) {
        toast.textContent = msg;

        if (toastTimeout) clearTimeout(toastTimeout);
        else toast.className = "show";
        toastTimeout = setTimeout(function () {
            toast.className = 'hide'
            setTimeout(function () {
                toast.className = '';
            }, 400);
            toastTimeout = false;
        }, 3000);
    }
    window.statusBar = function () {
        var el = document.getElementById('confinfo');
        var text = [];

        window.statusItems.forEach((item, i) => {
            if (i !== 0) text.push('     ');
            if (item.name) text.push(item.name + ': ');
            text.push(item.value());
        })

        el.textContent = text.join('');
    }
    window.statusBar();

    window.initFuncs.forEach((func) => {
        func();
    })
}
setTimeout(() => {
    window.makeUI();
}, 1000)


// ==UserScript==
// @name         Bloble.io NoobScript V3 ChatCommands Fragment
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A fragment of code from NoobScript V3 - Chat commands.
// @author       NoobishHacker
// @match        http://bloble.io/*
// @grant        none
// ==/UserScript==

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.overrideSocketEvents = window.overrideSocketEvents || [];

window.chatCommands = window.chatCommands || {};

window.resetCamera = function () { // Override
    camX = camXS = camY = camYS = 0;
    cameraKeys = {
        l: 0,
        r: 0,
        u: 0,
        d: 0
    }

    if (socket && window.overrideSocketEvents && window.overrideSocketEvents.length) {
        window.overrideSocketEvents.forEach((item) => {
            socket.removeAllListeners(item.name)
            socket.on(item.name, item.func);

        });

    }
}

var muted = [];
window.overrideSocketEvents.push({
    name: "ch",
    description: "Chat Muter",
    func: function (a, d, c) {
        if (!muted[a])
            addChatLine(a, d, c)
    }

})

window.addChat = function (msg, from, color) {
    color = color || "#fff";
    var b = document.createElement("li");
    b.className = "chatother";
    b.innerHTML = '<span style="color:' + color + '">[' + from + ']</span> <span class="chatText">' + msg + "</span>";
    10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
    chatList.appendChild(b)
}


window.chatCommands.mute = function (split) {
    if (!split[1]) {
        addChat('Please specify a username or "all" for 1rst arg.')
    } else if (split[1] === 'all') {
        users.forEach((user) => {
            muted[user.sid] = true;
        });
        addChat('Muted ' + users.length + ' users', 'Client');

    } else {
        var len = 0;
        users.forEach((user) => {
            if (user.name === split[1]) {
                muted[user.sid] = true;
                len++;
            }

        });
        addChat('Muted ' + len + ' users with the name ' + split[1], 'Client');
    }
}
window.chatCommands.unmute = function (split) {
    if (!split[1]) {
        addChat('Please specify a username or "all" for 1rst arg.')
    } else if (split[1] === 'all') {
        addChat('Unmuted ' + Object.keys(mute).length + ' users', 'Client');
        muted = {};
    } else {
        var len = 0;
        users.forEach((user) => {
            if (user.name === split[1]) {
                muted[user.sid] = false;
                len++;
            }
        });
        addChat('Unmuted ' + len + ' users with the name ' + split[1], 'Client');
    }
}
window.chatCommands.help = function (split) {
    var avail = Object.keys(window.chatCommands);
    addChat('There are ' + avail.length + ' commands available.', 'Client')
    addChat(avail.join(', '), 'Client');
}

window.chatCommands.playerlist = function (split) {
    var page = parseInt(split[1]) || 1;
    var total = Math.ceil(users.length / 5);
    addChat('There are ' + users.length + ' players. Page ' + page + ' out of ' + total, 'Client')
    var offset = page * 5;
    for (var i = 0; i < 5; i++) {
        if (!users[i + offset]) break;
        addChat(users[i + offset].name, 'Client', playerColors[users[i + offset].color])
    }
}


window.chatCommands.clear = function () {
    while (chatList.hasChildNodes()) {
        chatList.removeChild(chatList.lastChild);
    }
}
var modsShown = true;
window.chatCommands.toggle = function () {
    var element = document.getElementById('noobscriptUI')
    if (modsShown) {
        modsShown = false;
        element.style.display = 'none';
        addChat('Mod Menu disabled', 'Client')
    } else {
        modsShown = true;
        element.style.display = 'block';
        addChat('Mod Menu enabled', 'Client')
    }
}

var chatHist = [];
var chatHistInd = -1;
var prevText = '';



setTimeout(function () {
    var old = chatInput
    chatInput = old.cloneNode(true);
    old.parentNode.replaceChild(chatInput, old);
    chatInput.onclick = function () {
        toggleChat(!0)
    };

    chatInput.addEventListener("keyup", function (a) {
        var b = a.which || a.keyCode;
        if (b === 38) { // up
            if (chatHistInd === -1) {
                prevText = chatInput.value;
                chatHistInd = chatHist.length;
            }
            if (chatHistInd > 0) chatHistInd--;
            chatInput.value = prevText + (chatHist[chatHistInd] || '')

        } else if (b === 40) {
            if (chatHistInd !== -1) {

                if (chatHistInd < chatHist.length) chatHistInd++;
                else chatHistInd = -1;
                chatInput.value = prevText + (chatHist[chatHistInd] || '')
            }
        } else
        if (gameState && socket && 13 === (a.which || a.keyCode) && "" != chatInput.value) {
            var value = chatInput.value;
            chatInput.value = ""
            mainCanvas.focus()

            if (value.charAt(0) === '/') {

                var split = value.split(' ');
                var name = split[0].substr(1);
                if (window.chatCommands[name]) window.chatCommands[name](split);
                else {
                    addChat("Command '" + name + "' not found. Please do /help for a list of commands.")
                }
            } else {
                socket.emit("ch", value)
            }
            if (chatHist[chatHist.length - 1] !== value) {
                var ind = chatHist.indexOf(value);
                if (ind !== -1) {
                    chatHist.splice(ind, 1);
                }
                chatHist.push(value);
            }
            chatHistInd = -1;
        }
    })
},1000)





var scroll=0;
mainCanvas["addEventListener"]?(window["addEventListener"]("mousewheel",zoom,!1),mainCanvas["addEventListener"]("DOMMouseScroll",zoom,!1)):window["attachEvent"]("onmousewheel",zoom);function zoom(a)
{
	a= window["event"]|| a;a["preventDefault"]();a["stopPropagation"]();scroll= Math["max"](-1,Math["min"](1,a["wheelDelta"]||  -a["detail"]));if(scroll==  -1)
	{
		if(maxScreenHeight< 10000)
		{
			(maxScreenHeight+= 250,maxScreenWidth+= 250,resize());scroll= 0
		}
	}
	if(scroll== 1)
	{
		if(maxScreenHeight> 1000)
		{
			(maxScreenHeight-= 250,maxScreenWidth-= 250,resize());scroll= 0
		}
	}
}
mainCanvas["onkeydown"]= function(event)
{
	var k=event["keyCode"]?event["keyCode"]:event["which"];
	if(k== 70)
	{
		if(maxScreenHeight< 10000)
		{
			(maxScreenHeight+= 250,maxScreenWidth+= 250,resize())
		}
	}
	if(k== 67)
	{
		if(maxScreenHeight> 1000)
		{
			(maxScreenHeight-= 250,maxScreenWidth-= 250,resize())
		}
	}
	{
		if(65== a|| 37== a)
		{
			cameraKeys["l"]= 0,updateCameraInput()
		}
		if(68== a|| 39== a)
		{
			cameraKeys["r"]= 0,updateCameraInput()
		}
		if(87== a|| 38== a)
		{
			cameraKeys["u"]= 0,updateCameraInput()
		}
		if(83== a|| 40== a)
		{
			cameraKeys["d"]= 0,updateCameraInput()
		}
		if(32== a)
		{
			var d=unitList["indexOf"](activeUnit);
			sendUnit(d)
		}
		void(0)!= upgrInputsToIndex["k"+ a]&& toggleActiveUnit(upgrInputsToIndex["k"+ a]);46== a&& selUnits["length"]&& sellSelUnits();84== a&& toggleChat("none"== chatListWrapper["style"]["display"]);27== a&& (toggleActiveUnit(),disableSelUnit(),showSelector=  !1);82== a&& (camY= camX= 0)
	}
}
;mainCanvas["onkeydown"]= function(a)
{
	a= a["keyCode"]?a["keyCode"]:a["which"];socket&& player&&  !player["dead"]&& (65!= a&& 37!= a|| cameraKeys["l"]|| (cameraKeys["l"]=  -1,cameraKeys["r"]= 0,updateCameraInput()),68!= a&& 39!= a|| cameraKeys["r"]|| (cameraKeys["r"]= 1,cameraKeys["l"]= 0,updateCameraInput()),87!= a&& 38!= a|| cameraKeys["u"]|| (cameraKeys["u"]=  -1,cameraKeys["d"]= 0,updateCameraInput()),83!= a&& 40!= a|| cameraKeys["d"]|| (cameraKeys["d"]= 1,cameraKeys["u"]= 0,updateCameraInput()))
}