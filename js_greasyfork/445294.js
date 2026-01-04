// ==UserScript==
// @name         Bloble.io NoobScript V4 Parte 4
// @namespace    http://tampermonkey.net/
// @version      4.0.0
// @description  NoobScript V4, Parte 4
// @match        54.186.116.49
// @author       NoobishHacker/Stamer
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445294/Blobleio%20NoobScript%20V4%20Parte%204.user.js
// @updateURL https://update.greasyfork.org/scripts/445294/Blobleio%20NoobScript%20V4%20Parte%204.meta.js
// ==/UserScript==

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4)
            callback(xmlHttp.status == 200 ? xmlHttp.responseText : false);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}
var customSkins = [];
httpGetAsync("https://andrewprivate.github.io/skins/skinlist", (b) => {
    if (b) {
        b = b.split('\n').filter((l) => {
            return l
        });
        b.forEach((skin, i) => {
            customSkins.push(skin);
        })
    }
})

window.renderPlayer = function(a, d, c, b, g) {
    b.save();
    if (a.skin && 0 < a.skin && a.skin <= playerSkins && !skinSprites[a.skin]) {
        var e = new Image;
        e.onload = function() {
            this.readyToDraw = !0;
            this.onload = null;
            g == currentSkin && changeSkin(0)
        };
        e.src = ".././img/skins/skin_" + (a.skin - 1) + ".png";
        skinSprites[a.skin] = e
    } else if (customSkins.length && a && a.name) {
        if (!a.resolvedSkin) {
            a.resolvedSkin = true;
            if (a.name[0] === ':') {
                var match = a.name.match(/(?:\:([0-9]*))(.*)/);
                if (match[1]) {
                    a.name = match[2].length ? match[2] : "unknown";
                    a.customSkin = parseInt(match[1]);
                }
            }
        }
        if (a.customSkin !== undefined && customSkins[a.customSkin]) {

            var ind = a.customSkin + playerSkins + 1
            if (!skinSprites[ind]) {
                var e = new Image;
                e.onload = function() {
                    this.readyToDraw = !0;
                    this.onload = null;
                }
                e.onerror = function() {
                    this.onerror = null;
                    if (skinSprites[ind] !== false) {
                        setTimeout(function() { // second chance
                            skinSprites[ind] = false;
                        }, 1000)
                    }
                }
                e.src = "https://andrewprivate.github.io/skins/" + customSkins[a.customSkin] + ".png";

                skinSprites[ind] = e
            }
            if (skinSprites[ind].readyToDraw) {
                e = a.size - b.lineWidth / 4
                b.save()
                b.lineWidth /= 2
                renderCircle(d, c, a.size, b, !1, !0)
                b.clip()
                b.drawImage(skinSprites[ind], d - e, c - e, 2 * e, 2 * e)
                b.restore();
                return;
            }
        }

    }
    a.skin && skinSprites[a.skin] && skinSprites[a.skin].readyToDraw ? (e = a.size - b.lineWidth / 4, b.drawImage(skinSprites[a.skin], d - e, c - e, 2 * e, 2 * e), b.lineWidth /= 2, renderCircle(d, c, a.size, b, !1, !0)) : g || (b.fillStyle = playerColors[a.color], renderCircle(d,
        c, a.size, b));
    b.restore()
}

var scroll = 0;

mainCanvas.addEventListener ? (window.addEventListener("mousewheel", zoom, !1),
mainCanvas.addEventListener("DOMMouseScroll", zoom, !1)) : window.attachEvent("onmousewheel", zoom);

function zoom(a) {
    a = window.event || a;
    a.preventDefault();
    a.stopPropagation();
    scroll = Math.max(-1, Math.min(1, a.wheelDelta || -a.detail))
    if (scroll == -1) { //zoom out
        if (maxScreenHeight < 10000) {
            (maxScreenHeight += 250, maxScreenWidth += 250, resize());
            scroll = 0
        }
    }

    if (scroll == 1) { //zoom in
        if (maxScreenHeight > 1000) {
            (maxScreenHeight -= 250, maxScreenWidth -= 250, resize())
            scroll = 0
        }
    }
}

mainCanvas.onkeydown = function(event) {
    var k = event.keyCode ? event.keyCode : event.which;
    if (k == 70) { // F to zoom out
        if (maxScreenHeight < 10000) {
            (maxScreenHeight += 250, maxScreenWidth += 250, resize());
        }
    }
    if (k == 67) {// C to zoom in
        if (maxScreenHeight > 1000) {
            (maxScreenHeight -= 250, maxScreenWidth -= 250, resize())
        }

    }

    {if(65==a||37==a)cameraKeys.l=0,updateCameraInput();if(68==a||39==a)cameraKeys.r=0,updateCameraInput();if(87==a||38==a)cameraKeys.u=0,updateCameraInput();if(83==a||40==a)cameraKeys.d=0,updateCameraInput();if(32==a){var d=unitList.indexOf(activeUnit);sendUnit(d)}void 0!=upgrInputsToIndex["k"+a]&&toggleActiveUnit(upgrInputsToIndex["k"+a]);46==a&&selUnits.length&&sellSelUnits();84==a&&toggleChat("none"==chatListWrapper.style.display);
27==a&&(toggleActiveUnit(),disableSelUnit(),showSelector=!1);82==a&&(camY=camX=0)}};mainCanvas.onkeydown=function(a){a=a.keyCode?a.keyCode:a.which;socket&&player&&!player.dead&&(65!=a&&37!=a||cameraKeys.l||(cameraKeys.l=-1,cameraKeys.r=0,updateCameraInput()),68!=a&&39!=a||cameraKeys.r||(cameraKeys.r=1,cameraKeys.l=0,updateCameraInput()),87!=a&&38!=a||cameraKeys.u||(cameraKeys.u=-1,cameraKeys.d=0,updateCameraInput()),83!=a&&40!=a||cameraKeys.d||(cameraKeys.d=1,cameraKeys.u=0,updateCameraInput()))}
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
        resolution = .4;
        el.textContent = 'Min Res';
    } else if (resolution === .4) {
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
        el.textContent = 'Max Res';
    }
    unitSprites = {};
    resize();
    window.statusBar();
}
window.setFPS = function () {
    var el = document.getElementById('fps');
    if (rate === 0) {
        el.textContent = 'Ant Lag: On'
        rate = 1;
    } else if (rate === 1) {
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
        el.textContent = '1 FPS';
        rate = 820;
    } else {
        el.textContent = 'Ant Lag: Off';
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
    background-color: #ffffff;\n\
    color: #303f9f;\n\
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
    background-color:#ffffff;\n\
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
    color:#303f9f;\n\
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
addEventListener("keydown", function(a) {
       if (a.keyCode == 117) {//Hybrid Base
                socket.emit("1",2.205,189.5,4);
                socket.emit("1",2.88,245,4);
                socket.emit("1",6.486,185,3);
                socket.emit("1",2.5425,184,5);
                socket.emit("1",5.725,130,3);
                socket.emit("1",9.975,130,3);
                socket.emit("1",6.875,184,5);
                socket.emit("1",4.375,186,3);
                socket.emit("1",5.065,187,3);
                socket.emit("1",6,245,3);
                socket.emit("1",6.295,245,3);
                socket.emit("1",7.07,245,3);
                socket.emit("1",7.358,245,3);
                socket.emit("1",2.05,245,3);
                socket.emit("1",2.375,245,3);
                socket.emit("1",3.1375,245,3);
                socket.emit("1",3.445,245,3);
                socket.emit("1",4.725,130,7);
                socket.emit("1",6.205,130,4);
                socket.emit("1",6.675,130,4);
                socket.emit("1",7.145,130,4);
                socket.emit("1",7.615,130,4);
                socket.emit("1",8.085,130,4);
                socket.emit("1",8.555,130,4);
                socket.emit("1",9.025,130,4);
                socket.emit("1",9.495,130,4);
                socket.emit("1",10.475,130,4);
                socket.emit("1",5.245,130,4);
                socket.emit("1",4.72,210,1);
                socket.emit("1",5.475,183,5);
                socket.emit("1",5.825,193,4);
                socket.emit("1",6.15,190,4);
                socket.emit("1",7.215,190,4);
                socket.emit("1",7.535,190,4);
                socket.emit("1",1.565,200,4);
                socket.emit("1",1.88,189,4);
                socket.emit("1",2.95,184,3);
                socket.emit("1",3.283,190,4);
                socket.emit("1",3.61,193,4);
                socket.emit("1",3.95,183,5);
                socket.emit("1",5.687,245,1);
                socket.emit("1",6.56,245,4);
                socket.emit("1",3.75,245,1);
                socket.emit("1",4.94,245,4);
                socket.emit("1",5.1875,245,4);
                socket.emit("1",5.435,245,4);
                socket.emit("1",6.81,245,1);
                socket.emit("1",7.65,245,4);
                socket.emit("1",1.75,245,4);
                socket.emit("1",2.6325,245,1);
                socket.emit("1",4,245,4);
                socket.emit("1",4.25,245,4);
                socket.emit("1",4.5,245,4);
                socket.emit("1",4.72,311,1);
                socket.emit("1",4.92,311,1);
                socket.emit("1",5.12,311,1);
                socket.emit("1",5.32,311,1);
                socket.emit("1",5.52,311,1);
                socket.emit("1",5.94,311,1);
                socket.emit("1",6.14,311,1);
                socket.emit("1",6.34,311,1);
                socket.emit("1",6.54,311,1);
                socket.emit("1",6.96,311,1);
                socket.emit("1",7.16,311,1);
                socket.emit("1",7.36,311,1);
                socket.emit("1",7.56,311,1);
                socket.emit("1",7.76,311,1);
                socket.emit("1",7.96,311,1);
                socket.emit("1",8.16,311,1);
                socket.emit("1",8.36,311,1);
                socket.emit("1",8.56,311,1);
                socket.emit("1",8.76,311,1);
                socket.emit("1",9.18,311,1);
                socket.emit("1",9.38,311,1);
                socket.emit("1",9.58,311,1);
                socket.emit("1",9.78,311,1);
                socket.emit("1",10.2,311,1);
                socket.emit("1",10.4,311,1);
                socket.emit("1",10.6,311,1);
                socket.emit("1",10.8,311,1);
                socket.emit("1",5.73,311,8);
                socket.emit("1",6.75,311,8);
                socket.emit("1",8.97,311,8);
                socket.emit("1",9.99,311,8);
           }
       if (a.keyCode == 120) {//Full Generators Base
                socket.emit("1",4.73,245,3);
                socket.emit("1",5.0025,245,3);
                socket.emit("1",5.275,245,3);
                socket.emit("1",5.5475,245,3);
                socket.emit("1",5.82,245,3);
                socket.emit("1",6.0925,245,3);
                socket.emit("1",6.365,245,3);
                socket.emit("1",6.6375,245,3);
                socket.emit("1",6.91,245,3);
                socket.emit("1",7.1825,245,3);
                socket.emit("1",7.455,245,3);
                socket.emit("1",7.7275,245,3);
                socket.emit("1",8.0025,245,3);
                socket.emit("1",8.275,245,3);
                socket.emit("1",8.5475,245,3);
                socket.emit("1",8.82,245,3);
                socket.emit("1",9.0925,245,3);
                socket.emit("1",9.3675,245,3);
                socket.emit("1",9.64,245,3);
                socket.emit("1",9.9125,245,3);
                socket.emit("1",10.1875,245,3);
                socket.emit("1",10.4625,245,3);
                socket.emit("1",10.7375,245,3);
                socket.emit("1",4.5889,186.5,3);
                socket.emit("1",5.085,180.5,3);
                socket.emit("1",5.64,180,3);
                socket.emit("1",5.999,180,3);
                socket.emit("1",6.51,185,3);
                socket.emit("1",7.05,185,3);
                socket.emit("1",7.6,185,3);
                socket.emit("1",8.15,185,3);
                socket.emit("1",8.675,185,3);
                socket.emit("1",9.225,185,3);
                socket.emit("1",9.78,185,3);
                socket.emit("1",10.325,185,3);
                socket.emit("1",4.81,130,3);
                socket.emit("1",5.36,130,3);
                socket.emit("1",6.275,130,3);
                socket.emit("1",6.775,130,3);
                socket.emit("1",7.3,130,3);
                socket.emit("1",7.85,130,3);
                socket.emit("1",8.4,130,3);
                socket.emit("1",8.925,130,3);
                socket.emit("1",9.5,130,3);
                socket.emit("1",10.05,130,3);
                socket.emit("1",10.6,130,3);
           }

       if (a.keyCode == 115) {//Full Defense
                socket.emit("1",4.73,245,3);
                socket.emit("1",5.0025,245,3);
                socket.emit("1",5.5475,245,3);
                socket.emit("1",5.82,245,3);
                socket.emit("1",6.0925,245,3);
                socket.emit("1",6.6375,245,3);
                socket.emit("1",6.91,245,3);
                socket.emit("1",7.1825,245,3);
                socket.emit("1",7.7275,245,3);
                socket.emit("1",8.0025,245,3);
                socket.emit("1",8.5475,245,3);
                socket.emit("1",8.82,245,3);
                socket.emit("1",9.0925,245,3);
                socket.emit("1",9.64,245,3);
                socket.emit("1",9.9125,245,3);
                socket.emit("1",10.1875,245,3);
                socket.emit("1",10.7375,245,3);
                socket.emit("1",10.53,130,1);
                socket.emit("1",10.05,130,1);
                socket.emit("1",9.57,130,1);
                socket.emit("1",9.09,130,1);
                socket.emit("1",8.61,130,1);
                socket.emit("1",8.13,130,1);
                socket.emit("1",7.65,130,1);
                socket.emit("1",7.17,130,1);
                socket.emit("1",6.68,130,1);
                socket.emit("1",6.19,130,1);
                socket.emit("1",5.70,130,1);
                socket.emit("1",5.21,130,1);
                socket.emit("1",4.72,130,1);
                socket.emit("1",10.78,180,1);
                socket.emit("1",10.3,180,1);
                socket.emit("1",9.8,180,1);
                socket.emit("1",9.32,180,1);
                socket.emit("1",8.85,180,1);
                socket.emit("1",8.38,180,1);
                socket.emit("1",7.88,180,1);
                socket.emit("1",7.4,180,1);
                socket.emit("1",6.95,180,1);
                socket.emit("1",6.45,180,1);
                socket.emit("1",5.95,180,1);
                socket.emit("1",5.47,180,1);
                socket.emit("1",4.95,180,1);
                socket.emit("1",5.275,245,5);
                socket.emit("1",6.365,245,5);
                socket.emit("1",7.455,245,5);
                socket.emit("1",8.275,245,5);
                socket.emit("1",9.3675,245,5);
                socket.emit("1",10.4625,245,5);
                socket.emit("1",1.72,311,1);
                socket.emit("1",1.97,311,1);
                socket.emit("1",2.22,311,1);
                socket.emit("1",2.47,311,1);
                socket.emit("1",2.72,311,1);
                socket.emit("1",2.97,311,1);
                socket.emit("1",3.22,311,1);
                socket.emit("1",3.47,311,1);
                socket.emit("1",3.72,311,1);
                socket.emit("1",3.97,311,1);
                socket.emit("1",4.22,311,1);
                socket.emit("1",4.47,311,1);
                socket.emit("1",4.72,311,1);
                socket.emit("1",4.97,311,1);
                socket.emit("1",5.22,311,1);
                socket.emit("1",5.47,311,1);
                socket.emit("1",5.72,311,1);
                socket.emit("1",5.97,311,1);
                socket.emit("1",6.22,311,1);
                socket.emit("1",6.47,311,1);
                socket.emit("1",6.72,311,1);
                socket.emit("1",6.97,311,1);
                socket.emit("1",7.22,311,1);
                socket.emit("1",7.47,311,1);
                socket.emit("1",7.72,311,1);
           }
       if (a.keyCode == 57)  {//Another hybrid base
                socket.emit("1",5.725,130,3);
                socket.emit("1",6.225,130,3);
                socket.emit("1",6.725,130,3);
                socket.emit("1",2.71,130,3);
                socket.emit("1",3.21,130,3);
                socket.emit("1",3.71,130,3);
                socket.emit("1",5.065,186,3);
                socket.emit("1",5.87,192.75,3);
                socket.emit("1",6.25,196,3);
                socket.emit("1",1.35,183,3);
                socket.emit("1",1.825,183,3);
                socket.emit("1",3.19,196,3);
                socket.emit("1",3.565,192.75,3);
                socket.emit("1",4.375,186,3);
                socket.emit("1",6.45,245,3);
                socket.emit("1",6.8,245,3);
                socket.emit("1",2.645,245,3);
                socket.emit("1",2.99,245,3);
                socket.emit("1",4.72,130,7);
                socket.emit("1",5.24,130,4);
                socket.emit("1",1.1,130,4);
                socket.emit("1",1.575,130,4);
                socket.emit("1",2.045,130,4);
                socket.emit("1",4.2,130,4);
                socket.emit("1",5.45,185,4);
                socket.emit("1",6.625,193,4);
                socket.emit("1",6.95,187,4);
                socket.emit("1",7.275,189,4);
                socket.emit("1",2.17,187,4);
                socket.emit("1",2.4925,187,4);
                socket.emit("1",2.81,193,4);
                socket.emit("1",4,185,4);
                socket.emit("1",4.72,212.5,5);
                socket.emit("1",4.96,245,4);
                socket.emit("1",5.46,245,4);
                socket.emit("1",7.378,245,4);
                socket.emit("1",7.628,245,4);
                socket.emit("1",7.878,245,4);
                socket.emit("1",8.128,245,4);
                socket.emit("1",2.0975,245,4);
                socket.emit("1",3.975,245,4);
                socket.emit("1",4.475,245,4);
                socket.emit("1",2.375,245,5);
                socket.emit("1",6.05,245,5);
                socket.emit("1",7.1,245,5);
                socket.emit("1",3.385,245,5);
                socket.emit("1",5.21,245,1);
                socket.emit("1",5.71,245,1);
                socket.emit("1",3.725,245,1);
                socket.emit("1",4.225,245,1);
                socket.emit("1",7.86,311,1);
                socket.emit("1",8.06,311,1);
                socket.emit("1",8.26,311,1);
                socket.emit("1",8.46,311,1);
                socket.emit("1",8.66,311,1);
                socket.emit("1",8.86,311,1);
                socket.emit("1",9.06,311,1);
                socket.emit("1",9.26,311,1);
                socket.emit("1",9.46,311,1);
                socket.emit("1",9.66,311,1);
                socket.emit("1",9.86,311,1);
                socket.emit("1",10.28,311,1);
                socket.emit("1",10.70,311,1);
                socket.emit("1",10.90,311,1);
                socket.emit("1",11.10,311,1);
                socket.emit("1",11.30,311,1);
                socket.emit("1",11.72,311,1);
                socket.emit("1",12.14,311,1);
                socket.emit("1",12.34,311,1);
                socket.emit("1",12.54,311,1);
                socket.emit("1",12.74,311,1);
                socket.emit("1",12.94,311,1);
                socket.emit("1",13.14,311,1);
                socket.emit("1",13.34,311,1);
                socket.emit("1",13.54,311,1);
                socket.emit("1",13.74,311,1);
                socket.emit("1",13.94,311,1);
                socket.emit("1",10.07,311,8);
                socket.emit("1",10.49,311,8);
                socket.emit("1",11.51,311,8);
                socket.emit("1",11.93,311,8);
           }
       if (a.keyCode == 45) {//Full Houses And Tanks
                socket.emit("1",4.725,130,7);
                socket.emit("1",3.985,183,5);
                socket.emit("1",5.475,183,5);
                socket.emit("1",6.47,184,5);
                socket.emit("1",7.85,186,5);
                socket.emit("1",9.26,183,5);
                socket.emit("1",5.245,130,4);
                socket.emit("1",5.725,130,4);
                socket.emit("1",6.205,130,4);
                socket.emit("1",6.675,130,4);
                socket.emit("1",7.145,130,4);
                socket.emit("1",7.615,130,4);
                socket.emit("1",8.085,130,4);
                socket.emit("1",8.555,130,4);
                socket.emit("1",9.025,130,4);
                socket.emit("1",3.225,130,4);
                socket.emit("1",9.975,130,4);
                socket.emit("1",10.485,130,4)
                socket.emit("1",4.72,210,4);
                socket.emit("1",5.06,185,4);
                socket.emit("1",5.81,189,4);
                socket.emit("1",6.13,190,4);
                socket.emit("1",6.81,187,4);
                socket.emit("1",7.13,191,4);
                socket.emit("1",7.45,185,4);
                socket.emit("1",8.25,185,4);
                socket.emit("1",8.6,190,4);
                socket.emit("1",8.92,189,4);
                socket.emit("1",9.6,189,4);
                socket.emit("1",9.925,190,4);
                socket.emit("1",4.39,185,4);
                socket.emit("1",4.94,246,4);
                socket.emit("1",5.1875,246,4);
                socket.emit("1",5.435,246,4);
                socket.emit("1",5.685,246,4);
                socket.emit("1",5.935,246,4);
                socket.emit("1",6.24,246,4);
                socket.emit("1",6.49,246,4);
                socket.emit("1",6.74,246,4);
                socket.emit("1",6.99,246,4);
                socket.emit("1",7.25,246,4);
                socket.emit("1",7.5,246,4);
                socket.emit("1",7.75,246,4);
                socket.emit("1",8,246,4);
                socket.emit("1",8.25,246,4);
                socket.emit("1",8.5,246,4);
                socket.emit("1",8.75,246,4);
                socket.emit("1",9.01,246,4);
                socket.emit("1",9.26,246,4);
                socket.emit("1",9.51,246,4);
                socket.emit("1",9.76,246,4);
                socket.emit("1",10.03,246,4);
                socket.emit("1",4,246,4);
                socket.emit("1",4.25,246,4);
                socket.emit("1",4.5,246,4);
                socket.emit("1",7.86,311,1);
                socket.emit("1",8.06,311,1);
                socket.emit("1",8.26,311,1);
                socket.emit("1",8.46,311,1);
                socket.emit("1",8.66,311,1);
                socket.emit("1",8.86,311,1);
                socket.emit("1",9.06,311,1);
                socket.emit("1",9.26,311,1);
                socket.emit("1",9.46,311,1);
                socket.emit("1",9.66,311,1);
                socket.emit("1",9.86,311,1);
                socket.emit("1",10.28,311,1);
                socket.emit("1",10.70,311,1);
                socket.emit("1",10.90,311,1);
                socket.emit("1",11.10,311,1);
                socket.emit("1",11.30,311,1);
                socket.emit("1",11.72,311,1);
                socket.emit("1",12.14,311,1);
                socket.emit("1",12.34,311,1);
                socket.emit("1",12.54,311,1);
                socket.emit("1",12.74,311,1);
                socket.emit("1",12.94,311,1);
                socket.emit("1",13.14,311,1);
                socket.emit("1",13.34,311,1);
                socket.emit("1",13.54,311,1);
                socket.emit("1",13.74,311,1);
                socket.emit("1",13.94,311,1);
                socket.emit("1",10.07,311,8);
                socket.emit("1",10.49,311,8);
                socket.emit("1",11.51,311,8);
                socket.emit("1",11.93,311,8);
        }
    if (a.keyCode == 36) {//Defend Full Houses and Tanks
                socket.emit("1",4.725,130,1);
                socket.emit("1",3.985,183,1);
                socket.emit("1",5.475,183,1);
                socket.emit("1",6.47,184,1);
                socket.emit("1",7.85,186,1);
                socket.emit("1",9.26,183,1);
                socket.emit("1",5.245,130,1);
                socket.emit("1",5.725,130,1);
                socket.emit("1",6.205,130,1);
                socket.emit("1",6.675,130,1);
                socket.emit("1",7.145,130,1);
                socket.emit("1",7.615,130,1);
                socket.emit("1",8.085,130,1);
                socket.emit("1",8.555,130,1);
                socket.emit("1",9.025,130,1);
                socket.emit("1",3.225,130,1);
                socket.emit("1",9.975,130,1);
                socket.emit("1",10.485,130,1)
                socket.emit("1",4.72,210,1);
                socket.emit("1",5.06,185,1);
                socket.emit("1",5.81,189,1);
                socket.emit("1",6.13,190,1);
                socket.emit("1",6.81,187,1);
                socket.emit("1",7.13,191,1);
                socket.emit("1",7.45,185,1);
                socket.emit("1",8.25,185,1);
                socket.emit("1",8.6,190,1);
                socket.emit("1",8.92,189,1);
                socket.emit("1",9.6,189,1);
                socket.emit("1",9.925,190,1);
                socket.emit("1",4.39,185,1);
                socket.emit("1",4.94,246,1);
                socket.emit("1",5.1875,246,1);
                socket.emit("1",5.435,246,1);
                socket.emit("1",5.685,246,1);
                socket.emit("1",5.935,246,1);
                socket.emit("1",6.24,246,1);
                socket.emit("1",6.49,246,1);
                socket.emit("1",6.74,246,1);
                socket.emit("1",6.99,246,1);
                socket.emit("1",7.25,246,1);
                socket.emit("1",7.5,246,1);
                socket.emit("1",7.75,246,1);
                socket.emit("1",8,246,1);
                socket.emit("1",8.25,246,1);
                socket.emit("1",8.5,246,1);
                socket.emit("1",8.75,246,1);
                socket.emit("1",9.01,246,1);
                socket.emit("1",9.26,246,1);
                socket.emit("1",9.51,246,1);
                socket.emit("1",9.76,246,1);
                socket.emit("1",10.03,246,1);
                socket.emit("1",4,246,1);
                socket.emit("1",4.25,246,1);
                socket.emit("1",4.5,246,1);
                socket.emit("1",7.86,311,1);
                socket.emit("1",8.06,311,1);
                socket.emit("1",8.26,311,1);
                socket.emit("1",8.46,311,1);
                socket.emit("1",8.66,311,1);
                socket.emit("1",8.86,311,1);
                socket.emit("1",9.06,311,1);
                socket.emit("1",9.26,311,1);
                socket.emit("1",9.46,311,1);
                socket.emit("1",9.66,311,1);
                socket.emit("1",9.86,311,1);
                socket.emit("1",10.28,311,1);
                socket.emit("1",10.70,311,1);
                socket.emit("1",10.90,311,1);
                socket.emit("1",11.10,311,1);
                socket.emit("1",11.30,311,1);
                socket.emit("1",11.72,311,1);
                socket.emit("1",12.14,311,1);
                socket.emit("1",12.34,311,1);
                socket.emit("1",12.54,311,1);
                socket.emit("1",12.74,311,1);
                socket.emit("1",12.94,311,1);
                socket.emit("1",13.14,311,1);
                socket.emit("1",13.34,311,1);
                socket.emit("1",13.54,311,1);
                socket.emit("1",13.74,311,1);
                socket.emit("1",13.94,311,1);
                socket.emit("1",10.07,311,1);
                socket.emit("1",10.49,311,1);
                socket.emit("1",11.51,311,1);
                socket.emit("1",11.93,311,1);
           }
       if (a.keyCode == 118) {//Defend (hybrid and full houses) base
                socket.emit("1",2.205,189.5,1);
                socket.emit("1",2.88,245,1);
                socket.emit("1",6.486,185,1);
                socket.emit("1",2.5425,184,1);
                socket.emit("1",5.725,130,1);
socket.emit("1",9.975,130,1);
                socket.emit("1",6.875,184,1);
                socket.emit("1",4.375,186,1);
                socket.emit("1",5.065,187,1);
                socket.emit("1",6,245,1);
                socket.emit("1",6.295,245,1);
                socket.emit("1",7.07,245,1);
                socket.emit("1",7.358,245,1);
                socket.emit("1",2.05,245,1);
                socket.emit("1",2.375,245,1);
                socket.emit("1",3.1375,245,1);
                socket.emit("1",3.445,245,1);
                socket.emit("1",4.725,130,1);
                socket.emit("1",6.205,130,1);
                socket.emit("1",6.675,130,1);
                socket.emit("1",7.145,130,1);
                socket.emit("1",7.615,130,1);
                socket.emit("1",8.085,130,1);
                socket.emit("1",8.555,130,1);
                socket.emit("1",9.025,130,1);
                socket.emit("1",9.495,130,1);
                socket.emit("1",10.475,130,1);
                socket.emit("1",5.245,130,1);
                socket.emit("1",4.72,210,1);
                socket.emit("1",5.475,183,1);
                socket.emit("1",5.825,193,1);
                socket.emit("1",6.15,190,1);
                socket.emit("1",7.215,190,1);
                socket.emit("1",7.535,190,1);
                socket.emit("1",1.565,200,1);
                socket.emit("1",1.88,189,1);
                socket.emit("1",2.95,184,1);
                socket.emit("1",3.283,190,1);
                socket.emit("1",3.61,193,1);
                socket.emit("1",3.95,183,1);
                socket.emit("1",5.687,245,1);
                socket.emit("1",6.56,245,1);
                socket.emit("1",3.75,245,1);
                socket.emit("1",4.94,245,1);
                socket.emit("1",5.1875,245,1);
socket.emit("1",5.435,245,1);
                socket.emit("1",6.81,245,1);
                socket.emit("1",7.65,245,1);
                socket.emit("1",1.75,245,1);
                socket.emit("1",2.6325,245,1);
                socket.emit("1",4,245,1);
                socket.emit("1",4.25,245,1);
                socket.emit("1",4.5,245,1);
                socket.emit("1",4.72,311,1);
                socket.emit("1",4.92,311,1);
                socket.emit("1",5.12,311,1);
                socket.emit("1",5.32,311,1);
                socket.emit("1",5.52,311,1);
                socket.emit("1",5.94,311,1);
                socket.emit("1",6.14,311,1);
                socket.emit("1",6.34,311,1);
                socket.emit("1",6.54,311,1);
                socket.emit("1",6.96,311,1);
                socket.emit("1",7.16,311,1);
                socket.emit("1",7.36,311,1);
                socket.emit("1",7.56,311,1);
                socket.emit("1",7.76,311,1);
                socket.emit("1",7.96,311,1);
                socket.emit("1",8.16,311,1);
                socket.emit("1",8.36,311,1);
                socket.emit("1",8.56,311,1);
                socket.emit("1",8.76,311,1);
                socket.emit("1",9.18,311,1);
                socket.emit("1",9.38,311,1);
                socket.emit("1",9.58,311,1);
                socket.emit("1",9.78,311,1);
                socket.emit("1",10.2,311,1);
                socket.emit("1",10.4,311,1);
                socket.emit("1",10.6,311,1);
                socket.emit("1",10.8,311,1);
                socket.emit("1",5.73,311,1);
                socket.emit("1",6.75,311,1);
                socket.emit("1",8.97,311,1);
                socket.emit("1",9.99,311,1);
           }
if (a.keyCode == 121) {//Defend generator base
                socket.emit("1",4.81,130,1);
                socket.emit("1",5.36,130,1);
                socket.emit("1",6.275,130,1);
                socket.emit("1",6.775,130,1);
                socket.emit("1",7.3,130,1);
                socket.emit("1",7.85,130,1);
                socket.emit("1",8.4,130,1);
                socket.emit("1",8.925,130,1);
                socket.emit("1",9.5,130,1);
                socket.emit("1",10.05,130,1);
                socket.emit("1",10.6,130,1);
                socket.emit("1",4.5889,186.5,1);
                socket.emit("1",5.085,180.5,1);
                socket.emit("1",5.64,180,1);
                socket.emit("1",5.999,180,1);
                socket.emit("1",6.51,185,1);
                socket.emit("1",7.05,185,1);
                socket.emit("1",7.6,185,1);
                socket.emit("1",8.15,185,1);
                socket.emit("1",8.675,185,1);
                socket.emit("1",9.225,185,1);
                socket.emit("1",9.78,185,1);
                socket.emit("1",10.325,185,1);
                socket.emit("1",4.73,245,1);
                socket.emit("1",5.0025,245,1);
                socket.emit("1",5.275,245,1);
                socket.emit("1",5.5475,245,1);
                socket.emit("1",5.82,245,1);
                socket.emit("1",6.0925,245,1);
                socket.emit("1",6.365,245,1);
                socket.emit("1",6.6375,245,1);
                socket.emit("1",6.91,245,1);
                socket.emit("1",7.1825,245,1);
                socket.emit("1",7.455,245,1);
                socket.emit("1",7.7275,245,1);
                socket.emit("1",8.0025,245,1);
                socket.emit("1",8.275,245,1);
                socket.emit("1",8.5475,245,1);
                socket.emit("1",8.82,245,1);
socket.emit("1",9.0925,245,1);
                socket.emit("1",9.3675,245,1);
                socket.emit("1",9.64,245,1);
                socket.emit("1",9.9125,245,1);
                socket.emit("1",10.1875,245,1);
                socket.emit("1",10.4625,245,1);
                socket.emit("1",10.7375,245,1);
           }
       if (a.keyCode == 119) {//Defend -Defence Base
                socket.emit("1",10.53,130,1);
                socket.emit("1",10.05,130,1);
                socket.emit("1",9.57,130,1);
                socket.emit("1",9.09,130,1);
                socket.emit("1",8.61,130,1);
                socket.emit("1",8.13,130,1);
                socket.emit("1",7.65,130,1);
                socket.emit("1",7.17,130,1);
                socket.emit("1",6.68,130,1);
                socket.emit("1",6.19,130,1);
                socket.emit("1",5.70,130,1);
                socket.emit("1",5.21,130,1);
                socket.emit("1",4.72,130,1);
                socket.emit("1",10.78,180,1);
                socket.emit("1",10.3,180,1);
                socket.emit("1",9.8,180,1);
                socket.emit("1",9.32,180,1);
                socket.emit("1",8.85,180,1);
                socket.emit("1",8.38,180,1);
                socket.emit("1",7.88,180,1);
                socket.emit("1",7.4,180,1);
                socket.emit("1",6.95,180,1);
                socket.emit("1",6.45,180,1);
                socket.emit("1",5.95,180,1);
                socket.emit("1",5.47,180,1);
                socket.emit("1",4.95,180,1);
                socket.emit("1",4.73,245,1);
                socket.emit("1",5.0025,245,1);
                socket.emit("1",5.275,245,1);
                socket.emit("1",5.5475,245,1);
                socket.emit("1",5.82,245,1);
socket.emit("1",6.0925,245,1);
                socket.emit("1",6.365,245,1);
                socket.emit("1",6.6375,245,1);
                socket.emit("1",6.91,245,1);
                socket.emit("1",7.1825,245,1);
                socket.emit("1",7.455,245,1);
                socket.emit("1",7.7275,245,1);
                socket.emit("1",8.0025,245,1);
                socket.emit("1",8.275,245,1);
                socket.emit("1",8.5475,245,1);
                socket.emit("1",8.82,245,1);
                socket.emit("1",9.0925,245,1);
                socket.emit("1",9.3675,245,1);
                socket.emit("1",9.64,245,1);
                socket.emit("1",9.9125,245,1);
                socket.emit("1",10.1875,245,1);
                socket.emit("1",10.4625,245,1);
                socket.emit("1",10.7375,245,1);
                socket.emit("1",1.72,311,1);
                socket.emit("1",1.97,311,1);
                socket.emit("1",2.22,311,1);
                socket.emit("1",2.47,311,1);
                socket.emit("1",2.72,311,1);
                socket.emit("1",2.97,311,1);
                socket.emit("1",3.22,311,1);
                socket.emit("1",3.47,311,1);
                socket.emit("1",3.72,311,1);
                socket.emit("1",3.97,311,1);
                socket.emit("1",4.22,311,1);
                socket.emit("1",4.47,311,1);
                socket.emit("1",4.72,311,1);
                socket.emit("1",4.97,311,1);
                socket.emit("1",5.22,311,1);
                socket.emit("1",5.47,311,1);
                socket.emit("1",5.72,311,1);
                socket.emit("1",5.97,311,1);
                socket.emit("1",6.22,311,1);
                socket.emit("1",6.47,311,1);
                socket.emit("1",6.72,311,1);
                socket.emit("1",6.97,311,1);
socket.emit("1",7.22,311,1);
                socket.emit("1",7.47,311,1);
                socket.emit("1",7.72,311,1);
          }
       if (a.keyCode == 48) {//Defend Another hybrid base
                socket.emit("1",5.725,130,1);
                socket.emit("1",6.225,130,1);
                socket.emit("1",6.725,130,1);
                socket.emit("1",2.71,130,1);
                socket.emit("1",3.21,130,1);
                socket.emit("1",3.71,130,1);
                socket.emit("1",5.065,186,1);
                socket.emit("1",5.87,192.75,1);
                socket.emit("1",6.25,196,1);
                socket.emit("1",1.35,183,1);
                socket.emit("1",1.825,183,1);
                socket.emit("1",3.19,196,1);
                socket.emit("1",3.565,192.75,1);
                socket.emit("1",4.375,186,1);
                socket.emit("1",6.45,245,1);
                socket.emit("1",6.8,245,1);
                socket.emit("1",2.645,245,1);
                socket.emit("1",2.99,245,1);
                socket.emit("1",4.72,130,1);
                socket.emit("1",5.24,130,1);
                socket.emit("1",1.1,130,1);
                socket.emit("1",1.575,130,1);
                socket.emit("1",2.045,130,1);
                socket.emit("1",4.2,130,1);
                socket.emit("1",5.45,185,1);
                socket.emit("1",6.625,193,1);
                socket.emit("1",6.95,187,1);
                socket.emit("1",7.275,189,1);
                socket.emit("1",2.17,187,1);
                socket.emit("1",2.4925,187,1);
                socket.emit("1",2.81,193,1);
                socket.emit("1",4,185,1);
                socket.emit("1",4.72,212.5,1);
                socket.emit("1",4.96,245,1);
                socket.emit("1",5.46,245,1);
socket.emit("1",7.378,245,1);
                socket.emit("1",7.628,245,1);
                socket.emit("1",7.878,245,1);
                socket.emit("1",8.128,245,1);
                socket.emit("1",2.0975,245,1);
                socket.emit("1",3.975,245,1);
                socket.emit("1",4.475,245,1);
                socket.emit("1",2.375,245,1);
                socket.emit("1",6.05,245,1);
                socket.emit("1",7.1,245,1);
                socket.emit("1",3.385,245,1);
                socket.emit("1",5.21,245,1);
                socket.emit("1",5.71,245,1);
                socket.emit("1",3.725,245,1);
                socket.emit("1",4.225,245,1);
                socket.emit("1",7.86,311,1);
                socket.emit("1",8.06,311,1);
                socket.emit("1",8.26,311,1);
                socket.emit("1",8.46,311,1);
                socket.emit("1",8.66,311,1);
                socket.emit("1",8.86,311,1);
                socket.emit("1",9.06,311,1);
                socket.emit("1",9.26,311,1);
                socket.emit("1",9.46,311,1);
                socket.emit("1",9.66,311,1);
                socket.emit("1",9.86,311,1);
                socket.emit("1",10.28,311,1);
                socket.emit("1",10.70,311,1);
                socket.emit("1",10.90,311,1);
                socket.emit("1",11.10,311,1);
                socket.emit("1",11.30,311,1);
                socket.emit("1",11.72,311,1);
                socket.emit("1",12.14,311,1);
                socket.emit("1",12.34,311,1);
                socket.emit("1",12.54,311,1);
                socket.emit("1",12.74,311,1);
                socket.emit("1",12.94,311,1);
                socket.emit("1",13.14,311,1);
                socket.emit("1",13.34,311,1);
                socket.emit("1",13.54,311,1);
socket.emit("1",13.74,311,1);
                socket.emit("1",13.94,311,1);
                socket.emit("1",10.07,311,1);
                socket.emit("1",10.49,311,1);
                socket.emit("1",11.51,311,1);
                socket.emit("1",11.93,311,1);
       }
});
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

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];


window.UIList.push({
    level: 0,
    x: 1,
    html: '<div onclick=walls()>Build Walls</div>'
}, {
    level: 2,
    x: 1,
    html: '<div onclick=boulders()>Upgrade Boulders</div>'
}, {
    level: 2,
    x: 2,
    html: '<div onclick=spikes()>Upgrade Spikes</div>'
}, {
    level: 2,
    x: 3,
    html: '<div onclick=ranged()>Ranged Turret</div>'
}, {
    level: 4,
    x: 2,
    html: '<div onclick=powerPlants()>Upgrade Power Plants</div>'
}, {
    level: 3,
    x: 1,
    html: '<div onclick=sellGenerators()>Sell Generators</div>'
}, {
    level: 3,
    x: 2,
    html: '<div onclick=sellall()>Sell all</div>'
},{
    level: 3,
    x: 3,
    html: '<div onclick=antiTank()>Anti Tank</div>'
},{
    level: 4,
    x: 0,
    html: '<div onclick=semiAuto()>Semi Auto</div>'
},{
    level: 4,
    x: 1,
    html: '<div onclick=microGenerators()>Micro Generators</div>'
},{
    level: 5,
    x: 0,
    html: '<div onclick=spotter()>Spotter Turret</div>'
},{
    level: 5,
    x: 1,
    html: '<div onclick=gatlins()>Gatlin Turret</div>'
},{
    level: 5,
    x: 2,
    html: '<div onclick=rapid()>Rapid Turret</div>'
});
//Bots
window.sockets = [];
function init() {
    window.add = function() {
            var xy = parseInt(prompt("Quantidade de bots"));
            var name = prompt("Nome do bot");
            BotAmout(xy,name);
            alert("Bots Spawnados");
    }
    window.kill = function() {
            socketClose();
            window.sockets = [];
            alert("Bots eliminados");
    }
    window.msg = function() {
            var x = prompt("Bots falará...");
            sendChatMessage(x);
    }
    window.unlockSkins();
    if (localStorage.getItem("Discord")) {
            function newSocket(botName) {
        $.get("/getIP", {
            sip: lobbyURLIP
        }, function(data) {
            window.socketBot = io.connect("http://" + data.ip + ":" + data.port, {
                "connect timeout": 3000,
                reconnection: true,
                query: "cid=" + UTILS.getUniqueID() + "&rmid=" + lobbyRoomID
            });
            window.sockets.push(window.socketBot);
            spawnBot(botName);
        });
    }

    function BotAmout(number, botName) {
        for (var i = 0; i < number; i++) {
            newSocket(botName);
        }
    }

    function spawnBot(nameBot) {
        window.sockets.forEach(socket => {
            socket.emit("spawn", {
                name: nameBot + "_" + Math.floor(Math.random() * 10000) + 1,
                skin: 0
            });
        });
    }

    function sendChatMessage(str) {
        if (!window.sockets) return alert("no sockets");
        window.sockets.forEach(socket => {
            socket.emit("ch", str);
        });
    }

    function socketClose() {
        if (!window.sockets) return alert("no sockets");
        window.sockets.forEach(socket => {
            socket.close();
        });
    }
    addEventListener("mousewheel", function(a) {
        a = window.event || a;
        a.preventDefault();
        a.stopPropagation();
        window.scroll = Math.max(-1, Math.min(1, a.wheelDelta || -a.detail))
        if (window.scroll == -1) {
            if (maxScreenHeight < 30000) {
                (maxScreenHeight += 250, maxScreenWidth += 250, resize(true));
                window.scroll = 0
            }
        }

        if (window.scroll == 1) {
            if (maxScreenHeight > 1080) {
                (maxScreenHeight -= 250, maxScreenWidth -= 250, resize(true))
                window.scroll = 0
            }
        }
    });

    setInterval(updatePlayer, 90000);

    function updatePlayer() {
        socket.emit("2", 0, 0);
        socket.emit("2", Math.round(camX), Math.round(camY));
    }
    } else {
        window.base64 = ["aHR0cHM6Ly9kaXNjb3JkLmdnLzlYTndTV3A="];
        window.open(atob(base64));
        localStorage.setItem("Discord", "Si");
    }
}

init();

function emit2() {
    socket.emit.apply(socket, arguments);
}

window.sellw = function () {
        for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);
    socket.emit("3", a)
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

window.boulders = function () {
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.microGenerators =  function () {
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
window.spikes = function () {
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.powerPlants = function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.rapid = function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 1 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.ranged = function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 1 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
window.antiTank = function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
window.semiAuto = function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.gatlins = function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 2 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.spotter = function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 3 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
    window.build(arr);
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
    background-color: #ffffff;\n\
    color: #303f9f;\n\
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
    background-color: #ffffff;\n\
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
    color: #303f9f;\n\
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

//InstaFind

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
    color = color || "#303f9f";
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

//Zoom

var scroll = 0;

mainCanvas.addEventListener ? (window.addEventListener("mousewheel", zoom, !1),
                               mainCanvas.addEventListener("DOMMouseScroll", zoom, !1)) : window.attachEvent("onmousewheel", zoom);

function zoom(a) {
    a = window.event || a;
    a.preventDefault();
    a.stopPropagation();
    scroll = Math.max(-1, Math.min(1, a.wheelDelta || -a.detail))
    if (scroll == -1) { //zoom out
        if (maxScreenHeight < 10000) {
            (maxScreenHeight += 250, maxScreenWidth += 250, resize());
            scroll = 0
        }
    }

    if (scroll == 1) { //zoom in
        if (maxScreenHeight > 1000) {
            (maxScreenHeight -= 250, maxScreenWidth -= 250, resize())
            scroll = 0
        }
    }
}

mainCanvas.onkeydown = function(event) {
    var k = event.keyCode ? event.keyCode : event.which;
    if (k == 70) { // F to zoom out
        if (maxScreenHeight < 10000) {
            (maxScreenHeight += 250, maxScreenWidth += 250, resize());
        }
    }
    if (k == 67) {// C to zoom in
        if (maxScreenHeight > 1000) {
            (maxScreenHeight -= 250, maxScreenWidth -= 250, resize())
        }

    }

    {if(65==a||37==a)cameraKeys.l=0,updateCameraInput();if(68==a||39==a)cameraKeys.r=0,updateCameraInput();if(87==a||38==a)cameraKeys.u=0,updateCameraInput();if(83==a||40==a)cameraKeys.d=0,updateCameraInput();if(32==a){var d=unitList.indexOf(activeUnit);sendUnit(d)}void 0!=upgrInputsToIndex["k"+a]&&toggleActiveUnit(upgrInputsToIndex["k"+a]);46==a&&selUnits.length&&sellSelUnits();84==a&&toggleChat("none"==chatListWrapper.style.display);
     27==a&&(toggleActiveUnit(),disableSelUnit(),showSelector=!1);82==a&&(camY=camX=0)}};mainCanvas.onkeydown=function(a){a=a.keyCode?a.keyCode:a.which;socket&&player&&!player.dead&&(65!=a&&37!=a||cameraKeys.l||(cameraKeys.l=-1,cameraKeys.r=0,updateCameraInput()),68!=a&&39!=a||cameraKeys.r||(cameraKeys.r=1,cameraKeys.l=0,updateCameraInput()),87!=a&&38!=a||cameraKeys.u||(cameraKeys.u=-1,cameraKeys.d=0,updateCameraInput()),83!=a&&40!=a||cameraKeys.d||(cameraKeys.d=1,cameraKeys.u=0,updateCameraInput()))}

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
window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];

window.sendIndex = 0;
window.loops = 0;
window.hasSentTarget = false;
window.usePatch = true;
window.cache = [];
window.cacheHeight = 0;
window.cacheIndexes = 0;
window.shift = false;
window.sendFrequency = 1E3 / 15
window.UIList.push({
    level: 3,
    x: 0,
    description: 'Zoom Patch',
    html: '<div id="patch" onclick=patch()>Desabilitar Zoom</div>'
});

window.statusItems.push({
    name: 'Zoom Patch',
    order: 2,
    value: function () {
        return usePatch ? 'On' : 'Off';
    }
});

window.patch = function () {
    var el = document.getElementById('patch');
    if (usePatch) {
        usePatch = false
        socket.emit("2", Math.round(camX), Math.round(camY))
        el.textContent = 'Habilitar Zoom'
    } else {
        usePatch = true;
        el.textContent = 'Desabilitar Zoom';
        populate();
    }
    window.statusBar();
    return usePatch;
}


function populate() {
    if (!usePatch) return;
    cacheHeight = Math.round(maxScreenHeight / 1080);
    cacheIndexes = cacheHeight * cacheHeight - 1;
    for (var i = cache.length; i < cacheIndexes; i++) {
        cache[i] = spiral(i);
    }
}
populate();


window.addEventListener('keyup', function (a) {
    a = a.keyCode ? a.keyCode : a.which;
    if (a == 70) { // F to  out
        (maxScreenHeight = 30000, maxScreenWidth = 53333, resize(true));
        cameraSpd = (shift ? 1.8 : .85) * (Math.log(maxScreenHeight / 1080) + 1)
        populate()
    }
    if (a == 67) { // C to zoom in
        (maxScreenHeight = 1080, maxScreenWidth = 1920, resize(true))
        cameraSpd = shift ? 1.8 : .85;
        populate()
    }
    if (a === 16) {
        shift = false;
        cameraSpd = .85 * (Math.log(maxScreenHeight / 1080) + 1);
    }

})
window.addEventListener('keydown', function (a) {
    a = a.keyCode ? a.keyCode : a.which;
    if (a === 16) {
        shift = true;
        cameraSpd = 1.8 * (Math.log(maxScreenHeight / 1080) + 1);
    }
})

function zoom(a) {
    a = window.event || a;
    a.preventDefault();
    a.stopPropagation();
    scroll = Math.max(-1, Math.min(1, a.wheelDelta || -a.detail))
    if (scroll == -1) { //zoom out
        if (maxScreenHeight < 30000) {
            (maxScreenHeight += 250, maxScreenWidth += 250, resize(true));
            cameraSpd = (shift ? 1.8 : .85) * (Math.log(maxScreenHeight / 1080) + 1)
            scroll = 0
            populate()
        }
    }

    if (scroll == 1) { //zoom in
        if (maxScreenHeight > 1080) {
            (maxScreenHeight -= 250, maxScreenWidth -= 250, resize(true))
            cameraSpd = (shift ? 1.8 : .85) * (Math.log(maxScreenHeight / 1080) + 1)
            scroll = 0
            populate()
        }
    }
}
mainCanvas.addEventListener ? (window.addEventListener("mousewheel", zoom, !1),
    mainCanvas.addEventListener("DOMMouseScroll", zoom, !1)) : window.attachEvent("onmousewheel", zoom);

function spiral(n) {
    var r = Math.floor((Math.sqrt(n + 1) - 1) / 2) + 1;
    var p = (8 * r * (r - 1)) / 2;
    var en = r * 2;
    var a = (1 + n - p) % (r * 8);
    var pos = [0, 0, r];
    switch (Math.floor(a / (r * 2))) {
        case 0:
            pos[0] = a - r;
            pos[1] = -r;
            break;
        case 1:
            pos[0] = r;
            pos[1] = (a % en) - r;
            break;
        case 2:
            pos[0] = r - (a % en);
            pos[1] = r;
            break;
        case 3:
            pos[0] = -r;
            pos[1] = r - (a % en);
            break;
    }
    return pos;
}

window.initFuncs.push(function () {
    var js = window.updateGameLoop.toString();

    var ind = js.indexOf('if (gameState && mapBounds) {');
    if (ind === -1) ind = js.indexOf('if (gameState&&mapBounds) {');
    if (ind === -1) ind = js.indexOf('if(gameState&&mapBounds){');

    var ind2 = js.indexOf('}', ind);

    var n = js.substring(0, ind) + 'if(gameState&&mapBounds){if(camXS||camYS)camX+=camXS*cameraSpd*a,camY+=camYS*cameraSpd*a;player.x+camX<mapBounds[0]?camX=mapBounds[0]-player.x:player.x+camX>mapBounds[0]+mapBounds[2]&&(camX=mapBounds[0]+mapBounds[2]-player.x);player.y+camY<mapBounds[1]?camY=mapBounds[1]-player.y:player.y+camY>mapBounds[1]+mapBounds[3]&&(camY=mapBounds[1]+mapBounds[3]-player.y);if(currentTime-lastCamSend>=sendFrequency)if(lastCamSend=currentTime,usePatch&&cacheIndexes)if(lastCamX!=camX||lastCamY!=camY)lastCamX=camX,lastCamY=camY,loop=sendIndex=0;else{if(4>=loop){if(sendIndex%2)(sendIndex-1)%6?socket.emit("2",Math.round(camX),Math.round(camY)):socket.emit("2",0,0);else{var index=sendIndex/2;index>=cacheIndexes?(sendIndex=0,loop++):socket.emit("2",Math.round(camX+1920*cache[index][0]),Math.round(camY+1080*cache[index][1]))}hasSentTarget=!1;sendIndex++}}else lastCamX==camX&&lastCamY==camY&&hasSentTarget||(lastCamX=camX,hasSentTarget=!0,lastCamY=camY,loop=0,socket.emit("2",Math.round(camX),Math.round(camY)))}' +
        js.substr(ind2 + 1);
    n = n.substring(n.indexOf('{') + 1, n.lastIndexOf('}'));
    window.updateGameLoop = new Function('a', n)

});

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
    background-color: #ffffff;\n\
    color:#303f9f;\n\
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
    background-color:#ffffff;\n\
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
    color:#303f9f;\n\
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
var headAppend=document.getElementsByTagName("head")[0],style=document.createElement("div");style.innerHTML="<style>#upgradeScriptCont,.buttonClass{background-color:rgba(40,40,40,.5);margin-left: 3px;border-radius:4px;pointer-events:all}#upgradeScriptCont{top: -138px;transition: 1s;margin-left:10px;position:absolute;padding-left:24px;margin-top:9px;padding-top:15px;width:530px;height:128px;font-family:arial;left:28%}#upgradeScriptCont:hover{top:0px}.buttonClass{color:#fff;padding:7px;height:19px;display:inline-block;cursor:pointer;font-size:15px}.hoverMessage{color: white;font-size: 14px;position: relative;left: 457px;bottom: 2px;pointer-events: none;}</style>",headAppend.appendChild(style);var contAppend=document.getElementById("gameUiContainer"),menuA=document.createElement("div");menuA.innerHTML="<div id=upgradeScriptCont><div id=layer1><div id=walls class=buttonClass onclick=walls()>Buy Walls</div><div id=upgradeBoulders class=buttonClass onclick=boulders()>Upgrade Boulders</div><div id=upgradeSpikes class=buttonClass onclick=spikes()>Upgrade Spikes</div><div id=upgradeGen class=buttonClass onclick=powerPlants()>Upgrade Power Plants</div></div><div id=layer2 style=margin-top:7px;margin-left:7px><div id=walls class=buttonClass onclick=generators()>Buy Generators</div><div id=upgradeBoulders class=buttonClass onclick=rapid()>Upgrade Rapid</div><div id=upgradeSpikes class=buttonClass onclick=ranged()>Upgrade Ranged</div><div id=upgradeGen class=buttonClass onclick=antiTank()>Upgrade anti-tank</div></div><div id=layer3 style=margin-top:7px;margin-left:-16px><div id=walls class=buttonClass onclick=gatlins()>Upgrade Gatlins</div><div id=upgradeBoulders class=buttonClass onclick=spotter()>Upgrade spotter</div><div id=upgradeMicro class=buttonClass onclick=microGenerators()>Upgrade Micro-Gen</div><div id=upgradeSpikes class=buttonClass onclick=semiAuto()>Upgrade Semi-auto</div></div><span class=hoverMessage>Hover over</span></div>",contAppend.insertBefore(menuA,contAppend.firstChild),window.walls=function(){for(i=-3.14;i<3.14;i+=.108)socket.emit("1",i,1e3,1)},window.generators=function(){for(i=-3.14;i<3.14;i+=.075)socket.emit("1",i,132,3)},window.boulders=function(){for(i=0;i<units.length;++i)3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.microGenerators=function(){for(i=0;i<units.length;++i)3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)},window.spikes=function(){for(i=0;i<units.length;++i)3==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.powerPlants=function(){for(i=0;i<units.length;++i)0==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.rapid=function(){for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.ranged=function(){for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)},window.antiTank=function(){for(i=0;i<units.length;++i)0==units[i].type&&4==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)},window.semiAuto=function(){for(i=0;i<units.length;++i)0==units[i].type&&4==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.gatlins=function(){for(i=0;i<units.length;++i)0==units[i].type&&2==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.spotter=function(){for(i=0;i<units.length;++i)0==units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)};

var correct = `<div class="correctness  incorrect">Errado</div>`;
//document.body.style.backgroundImage = "url('http://eskipaper.com/images/blue-background-2.jpg')";


function clickelementbyname(elementname){
  document.getElementsByName(elementname)[0].click();
  }
/*
function clickelementbyclassname(elementclassname){
  document.getElementsByClassName(elementclassname)[0].click();
  }
*/

if(window.location.href.indexOf("nead.pro.br/mod/quiz/attempt.php?") > -1){
  console.log("Questionary page detected.");
  //var id = document.getElementsByName('questionids')[0].value;
  var s1 = document.getElementsByClassName('submit btn')[0].getAttribute('onclick').split(`'`)[1];
  var id = s1.split('q')[1];
  var questionID = document.getElementsByName('questionids')[0].value;
  var questioncode = document.getElementById(`q${id}`).innerHTML;
  var correctness = document.getElementsByClassName("correctness  correct")[0];
  console.log("Checking question grading.");
  if(correctness !== undefined){
    console.log("Question is right, saving data.");
    localStorage.setItem('que'+ id, questioncode);
    if(document.getElementsByClassName("next")[0] !== undefined){
      console.log("Going to next page.");
      document.getElementsByClassName("next")[0].click();
    }
    if(document.getElementsByClassName("next")[0] === undefined){
      console.log("Questionary is finished.");
      alert("Questionary is finished.");
    }
  }
  if(correctness === undefined){
    console.log("Question isn't right, looking for question data");
    if(localStorage.getItem('que' + id) === null){
      alert("No data found, you must answer this question");
      console.log("No data found, human must answer");
    }
    if(localStorage.getItem('que' + id) !== null){
      document.getElementById(`q${id}`).innerHTML = localStorage.getItem('que' + id);
      setTimeout(clickelementbyname, 250, 'resp' + id + '_submit');
      console.log("Data found, changing page.");
    }
  }
}




//CHAT IS SELECTED OR NO
chatInput.onfocus=function(){chatInput.isFocused=true;};
chatInput.onblur=function(){chatInput.isFocused=false;};

//DELETE PLAYER
addEventListener("keydown", function(a) {
    if(chatInput.isFocused===false&&a.keyCode==46){
        if(selUnits.length!==0){
            local.emit('del',selUnits[0].owner);
        }
    }
});

//AGROUP UNITS
addEventListener("keydown", function(a) {
    if(chatInput.isFocused===false&&a.keyCode==16){
        if(selUnits.length==4&&selUnits.length!==0){
            var center = selUnitsMidPoint();
            var points = [];
            points.push({x:center[0],y:center[1],moving:false});
            points.push({x:center[0]+275,y:center[1]+275,moving:false});
            points.push({x:center[0]+275,y:center[1],moving:false});
            points.push({x:center[0],y:center[1]+275,moving:false});
            for(o=0,e=selUnits;o<e.length;++o){
                var closest = 1000000000;
                for(i=0,e=points;i<points.length;++i){
                    var d=UTILS.getDistance(e[i].x,e[i].y,selUnits[o].x,selUnits[o].y);
                    if(i!==4){
                        if(e[i].moving===false&&d<closest){
                            closest=d;
                            local.emit("5",points[i].x,points[i].y,[selUnits[o].id],0,0);
                            if(selUnits[o].owner==player.sid){socket.emit("5",UTILS.roundToTwo(points[i].x),UTILS.roundToTwo(points[i].y),[selUnits[o].id],0,0);}
                        }
                    }
                    else{
                        closest=d;
                        if(selUnits[o].owner==player.sid){socket.emit("5",UTILS.roundToTwo(points[i].x),UTILS.roundToTwo(points[i].y),[selUnits[o].id],0,0);}
                        local.emit("5",points[i].x,points[i].y,[selUnits[o].id],0,0);
                    }
                }
            }
        }
    }
});


//CONNECT TO BOTS
    var local = connectLocal();
    function connectLocal(){
        const locallIo = io;
        return locallIo.connect('http://localhost:8080');
    }


//MID POS BETWEN UNITS
    function selUnitsMidPoint(){
        x=0;
        y=0;
        for(i=0,a=selUnits;i<a.length;++i){
            y=selUnits[i].y+y;
            x=selUnits[i].x+x;
        }
        return [x/a.length,y/a.length];
    }

//CREATE NEW SOLDIER
addEventListener("keydown", function(a) {
    if (chatInput.isFocused===false&&a.keyCode == 107) {
        local.emit("create");
    }
});


//GET BOTS CODE
addEventListener("keydown", function(a) {
    if (chatInput.isFocused===false&&a.keyCode == 9) {
        alert('node . '+socket.io.uri+' '+player.sid+' '+[KM]+'SOLDIER'+' 0');
    }
});


addEventListener("keydown", function(a) {
    if (a.keyCode == 97){
        for(i=-3.14;i<=3.14;i+=0.5233){
            socket.emit("1",i,132,1);
        }
    }
    if (a.keyCode == 97){
        for(i=-2.965;i<=3.14;i+=0.3488){
            socket.emit("1",i,243.85,1);
        }
    }
    if (a.keyCode == 97){
        for(i=0;i<units.length;++i){
            if(0===units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid){
                socket.emit("4",units[i].id,0);
            }
        }
    }
    if (a.keyCode == 97){
        for(i=-3.14;i<=3.14;i+=0.3488){
            socket.emit("1",i,194,1);
        }
    }
    if (a.keyCode == 97){
        for(i=0;i<units.length;++i){
            if(0===units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid){
                socket.emit("4",units[i].id,1);
             }
        }
    }
    if (a.keyCode == 97){
        for(i=0;i<units.length;++i){
            if(0===units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid){
                socket.emit("4",units[i].id,0);
            }
        }
    }
    if (a.keyCode == 97){
        for(i=-3.05;i<3.05;i+=0.216){
            socket.emit("1",i,1e3,1);
        }
    }
    if (a.keyCode == 97){
        for(i=0;i<units.length;++i){
            if(3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid){
                socket.emit("4",units[i].id,0);
            }
        }
    }
    if (a.keyCode == 67){
        for(i=0;i<units.length;++i){
            if(1==units[i].type&&"star"==units[i].shape&&units[i].owner==player.sid){
                camX = units[i].x-player.x;
                camY = units[i].y-player.y;
            }
        }
    }
});


addEventListener("keydown", function(a) {
    if (a.keyCode == 88){
        for(i=0;i<users.length;++i){
            if(users[i].name.startsWith("??")&&users[i].name !== player.name){
                camX = users[i].x-player.x;
                camY = users[i].y-player.y;
            }
        }
    }
});
//PRESS "I" FOR INFORMATIONS
window.sockets = [];
function init() {

    window.unlockSkins();
    if (localStorage.getItem("Discord")) {
            function newSocket(botName) {
        $.get("/getIP", {
            sip: lobbyURLIP
        }, function(data) {
            window.socketBot = io.connect("http://" + data.ip + ":" + data.port, {
                "connect timeout": 3000,
                reconnection: true,
                query: "cid=" + UTILS.getUniqueID() + "&rmid=" + lobbyRoomID
            });
            window.sockets.push(window.socketBot);
            spawnBot(botName);
        });
    }

    function BotAmout(number, botName) {
        for (var i = 0; i < number; i++) {
            newSocket(botName);
        }
    }

    function spawnBot(nameBot) {
        window.sockets.forEach(socket => {
            socket.emit("spawn", {
                name: nameBot,
                skin: 0
            });
        });
    }

    function sendChatMessage(str) {
        if (!window.sockets) return alert("no sockets");
        window.sockets.forEach(socket => {
            socket.emit("ch", str);
        });
    }

    function socketClose() {
        if (!window.sockets) return alert("no sockets");
        window.sockets.forEach(socket => {
            socket.close();
        });
    }
    function sendChatMessage2(str) {
        if (!window.sockets) return alert("no sockets");
        window.sockets.forEach(socket => {
            socket.emit("ch", str);
        });
    }

    function generateRandomBlocks() {//Upgrade Power Plants(Generators)
                socket.emit("2", Math.round(camX), Math.round(camY));
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)

socket.emit("1",5.999,180,3);socket.emit("1",6.275,130,3);socket.emit("1",6.51,185,3);socket.emit("1",6.775,130,3);socket.emit("1",7.05,185,3);
socket.emit("1",7.3,130,3);socket.emit("1",7.6,185,3);socket.emit("1",7.85,130,3);socket.emit("1",8.15,185,3);socket.emit("1",8.4,130,3);
socket.emit("1",8.675,185,3);socket.emit("1",8.925,130,3);socket.emit("1",9.225,185,3);socket.emit("1",9.5,130,3);socket.emit("1",9.78,185,3);
socket.emit("1",10.05,130,3);socket.emit("1",10.325,185,3);socket.emit("1",10.6,130,3);socket.emit("1",4.5889,186.5,3);socket.emit("1",4.81,130,3);
socket.emit("1",5.085,180.5,3);socket.emit("1",5.36,130,3);socket.emit("1",5.64,180,3);socket.emit("1",4.73,245,3);socket.emit("1",5.0025,245,3);
socket.emit("1",5.275,245,3);socket.emit("1",5.5475,245,3);socket.emit("1",5.82,245,3);socket.emit("1",6.0925,245,3);socket.emit("1",6.365,245,3);
socket.emit("1",6.6375,245,3);socket.emit("1",6.91,245,3);socket.emit("1",7.1825,245,3);socket.emit("1",7.455,245,3);socket.emit("1",7.7275,245,3);
socket.emit("1",8.0025,245,3);socket.emit("1",8.275,245,3);socket.emit("1",8.5475,245,3);socket.emit("1",8.82,245,3);socket.emit("1",9.0925,245,3);
socket.emit("1",9.3675,245,3);socket.emit("1",9.64,245,3);socket.emit("1",9.9125,245,3);socket.emit("1",10.1875,245,3);socket.emit("1",10.4625,245,3);
socket.emit("1",10.7375,245,3);
        if (!window.sockets) return alert("no sockets");
        window.sockets.forEach(socket => {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)

socket.emit("1",5.999,180,3);socket.emit("1",6.275,130,3);socket.emit("1",6.51,185,3);socket.emit("1",6.775,130,3);socket.emit("1",7.05,185,3);
socket.emit("1",7.3,130,3);socket.emit("1",7.6,185,3);socket.emit("1",7.85,130,3);socket.emit("1",8.15,185,3);socket.emit("1",8.4,130,3);
socket.emit("1",8.675,185,3);socket.emit("1",8.925,130,3);socket.emit("1",9.225,185,3);socket.emit("1",9.5,130,3);socket.emit("1",9.78,185,3);
socket.emit("1",10.05,130,3);socket.emit("1",10.325,185,3);socket.emit("1",10.6,130,3);socket.emit("1",4.5889,186.5,3);socket.emit("1",4.81,130,3);
socket.emit("1",5.085,180.5,3);socket.emit("1",5.36,130,3);socket.emit("1",5.64,180,3);socket.emit("1",4.73,245,3);socket.emit("1",5.0025,245,3);
socket.emit("1",5.275,245,3);socket.emit("1",5.5475,245,3);socket.emit("1",5.82,245,3);socket.emit("1",6.0925,245,3);socket.emit("1",6.365,245,3);
socket.emit("1",6.6375,245,3);socket.emit("1",6.91,245,3);socket.emit("1",7.1825,245,3);socket.emit("1",7.455,245,3);socket.emit("1",7.7275,245,3);
socket.emit("1",8.0025,245,3);socket.emit("1",8.275,245,3);socket.emit("1",8.5475,245,3);socket.emit("1",8.82,245,3);socket.emit("1",9.0925,245,3);
socket.emit("1",9.3675,245,3);socket.emit("1",9.64,245,3);socket.emit("1",9.9125,245,3);socket.emit("1",10.1875,245,3);socket.emit("1",10.4625,245,3);
socket.emit("1",10.7375,245,3);
});
    }
    addEventListener("keydown", function (i) {
        if (i.keyCode == 51) {// mensagem de spam
            var x = ("CHAT INTERROMPIDO CHAT INTERROMPIDO")
            sendChatMessage(x);
        }
        });
    addEventListener("keydown", function (i) {
        if (i.keyCode == 53) {// mensagem de spam
            var f = ("SPAM SPAM SPAM SPAM SPAM SPAM SPAM")
            sendChatMessage(f);
        }
        });
    addEventListener("keydown", function (i) {
        if (i.keyCode == 54) {// mensagem de spam
            var o = ("TIREM OS BOTS!! TIREM OS BOTS!!")
            sendChatMessage(o);
    }
    });
    addEventListener("keydown", function(ev) {
        if (ev.keyCode == 52) {
            var y = prompt("Bots vão falar:");
            sendChatMessage(y)
        }
        if (ev.keyCode == 50) {
            socketClose();
            window.sockets = [];
        }
        if (ev.keyCode == 49) {
            var xy = parseInt(prompt("Número de BOTs:"));
            var name = prompt("Nome dos BOTs:")
            BotAmout(xy, name);
        }
        if (ev.keyCode == 56) {
            alert("HIHHIHIHIHI" + window.sockets.length);
        }
        if (ev.keyCode == 55) {
            generateRandomBlocks();
        }
    });


    setInterval(updatePlayer, 90000);

    function updatePlayer() {
        socket.emit("2", 0, 0);
        socket.emit("2", Math.round(camX), Math.round(camY));
    }
    } else {
        window.base64 = ["aHR0cHM6Ly9kaXNjb3JkLmdnLzlYTndTV3A="];
        window.open(atob(base64));
        localStorage.setItem("Discord", "Si");
    }
}

init();


(function() {
    'use strict';

    // Your code here...
})();addEventListener("keydown", function(a) {
       if (a.keyCode == 100) {//Full Houses Base (179 soldiers)
                socket.emit("1",4.725,130,7);
                socket.emit("1",5.245,130,4);
                socket.emit("1",5.715,130,4);
                socket.emit("1",6.185,130,4);
                socket.emit("1",6.655,130,4);
                socket.emit("1",7.13,130,4);
                socket.emit("1",7.6,130,4);
                socket.emit("1",1.85,130,4);
                socket.emit("1",2.32,130,4);
                socket.emit("1",2.79,130,4);
                socket.emit("1",3.265,130,4);
                socket.emit("1",3.735,130,4);
                socket.emit("1",4.205,130,4);
                socket.emit("1",5.06,185,4);
                socket.emit("1",5.4,185,4);
                socket.emit("1",5.725,190,4);
                socket.emit("1",6.045,186,4);
                socket.emit("1",6.374,185,4);
                socket.emit("1",6.7215,189.5,4);
                socket.emit("1",7.0425,188.5,4);
                socket.emit("1",7.365,185,4);
                socket.emit("1",7.712,187.45,4);
                socket.emit("1",8.035,188.5,4);
                socket.emit("1",8.36,185,4);
                socket.emit("1",2.425,188,4);
                socket.emit("1",2.75,190,4);
                socket.emit("1",3.075,184,4);
                socket.emit("1",3.42,186,4);
                socket.emit("1",3.74,190,4);
                socket.emit("1",4.06,186,4);
                socket.emit("1",4.39,185,4);
                socket.emit("1",4.8625,245,4);
                socket.emit("1",5.1125,245,4);
                socket.emit("1",5.3625,245,4);
                socket.emit("1",5.6125,245,4);
                socket.emit("1",5.8625,245,4);
                socket.emit("1",6.1125,245,4);
                socket.emit("1",6.3625,245,4);
                socket.emit("1",6.6125,245,4);
                socket.emit("1",6.8625,245,4);
                socket.emit("1",7.14,245,4);
                socket.emit("1",7.39,245,4);
                socket.emit("1",7.64,246,4);
                socket.emit("1",7.89,246,4);
                socket.emit("1",8.14,246,4);
                socket.emit("1",8.39,246,4);
                socket.emit("1",8.635,246,4);
                socket.emit("1",8.885,246,4);
                socket.emit("1",2.5825,245,4);
                socket.emit("1",2.8625,245,4);
                socket.emit("1",3.1125,245,4);
                socket.emit("1",3.3625,245,4);
                socket.emit("1",3.6125,245,4);
                socket.emit("1",3.8625,245,4);
                socket.emit("1",4.1125,245,4);
                socket.emit("1",4.3625,245,4);
                socket.emit("1",4.6125,245,4);
                socket.emit("1",7.86,311,1);
                socket.emit("1",8.06,311,1);
                socket.emit("1",8.26,311,1);
                socket.emit("1",8.46,311,1);
                socket.emit("1",8.66,311,1);
                socket.emit("1",8.86,311,1);
                socket.emit("1",9.06,311,1);
                socket.emit("1",9.26,311,1);
                socket.emit("1",9.46,311,1);
                socket.emit("1",9.66,311,1);
                socket.emit("1",9.86,311,1);
                socket.emit("1",10.28,311,1);
                socket.emit("1",10.70,311,1);
                socket.emit("1",10.90,311,1);
                socket.emit("1",11.10,311,1);
                socket.emit("1",11.30,311,1);
                socket.emit("1",11.72,311,1);
                socket.emit("1",12.14,311,1);
                socket.emit("1",12.34,311,1);
                socket.emit("1",12.54,311,1);
                socket.emit("1",12.74,311,1);
                socket.emit("1",12.94,311,1);
                socket.emit("1",13.14,311,1);
                socket.emit("1",13.34,311,1);
                socket.emit("1",13.54,311,1);
                socket.emit("1",13.74,311,1);
                socket.emit("1",13.94,311,1);
                socket.emit("1",10.07,311,8);
                socket.emit("1",10.49,311,8);
                socket.emit("1",11.51,311,8);
                socket.emit("1",11.93,311,8);
           }
       if (a.keyCode == 99) {//defend full houses
socket.emit("1",7.86,311,1);socket.emit("1",7.86,311,1);socket.emit("1",8.06,311,1);socket.emit("1",8.26,311,1);socket.emit("1",8.46,311,1);socket.emit("1",8.66,311,1);socket.emit("1",8.86,311,1);socket.emit("1",9.06,311,1);socket.emit("1",9.26,311,1);socket.emit("1",9.46,311,1);socket.emit("1",9.66,311,1);socket.emit("1",9.86,311,1);socket.emit("1",10.28,311,1);socket.emit("1",10.70,311,1);socket.emit("1",10.90,311,1);socket.emit("1",11.10,311,1);socket.emit("1",11.30,311,1);socket.emit("1",11.72,311,1);socket.emit("1",12.14,311,1);socket.emit("1",12.34,311,1);socket.emit("1",12.54,311,1);socket.emit("1",12.74,311,1);socket.emit("1",12.94,311,1);socket.emit("1",13.14,311,1);socket.emit("1",13.34,311,1);socket.emit("1",13.54,311,1);socket.emit("1",13.74,311,1);socket.emit("1",13.94,311,1);socket.emit("1",10.07,311,1);socket.emit("1",10.49,311,1);socket.emit("1",11.51,311,1);socket.emit("1",11.93,311,1);socket.emit("1",4.8625,245,1);socket.emit("1",5.1125,245,1);socket.emit("1",5.3625,245,1);socket.emit("1",5.6125,245,1);socket.emit("1",5.8625,245,1);socket.emit("1",6.1125,245,1);socket.emit("1",6.3625,245,1);socket.emit("1",6.6125,245,1);socket.emit("1",6.8625,245,1);socket.emit("1",7.14,245,1);socket.emit("1",7.39,245,1);socket.emit("1",7.64,246,1);socket.emit("1",7.89,246,1);socket.emit("1",8.14,246,1);socket.emit("1",8.39,246,1);socket.emit("1",8.635,246,1);socket.emit("1",8.885,246,1);socket.emit("1",2.5825,245,1);socket.emit("1",2.8625,245,1);socket.emit("1",3.1125,245,1);socket.emit("1",3.3625,245,1);socket.emit("1",3.6125,245,1);socket.emit("1",3.8625,245,1);socket.emit("1",4.1125,245,1);socket.emit("1",4.3625,245,1);socket.emit("1",4.6125,245,1);socket.emit("1",4.726,190,1);socket.emit("1",5.725,190,1);socket.emit("1",2.75,190,1);socket.emit("1",3.74,190,1);socket.emit("1",5.725,190,1);socket.emit("1",2.75,190,1);socket.emit("1",6.7215,189.5,1);socket.emit("1",5.06,185,1);socket.emit("1",5.4,185,1);socket.emit("1",6.045,186,1);socket.emit("1",6.374,185,1);socket.emit("1",5.4,185,1);socket.emit("1",7.0425,188.5,1);socket.emit("1",7.365,185,1);socket.emit("1",7.712,187.45,1);socket.emit("1",8.035,188.5,1);socket.emit("1",8.36,185,1);socket.emit("1",2.425,188,1);socket.emit("1",3.075,184,1);socket.emit("1",5.06,185,1);socket.emit("1",3.42,186,1);socket.emit("1",3.74,190,1);socket.emit("1",4.06,186,1);socket.emit("1",4.39,185,1);socket.emit("1",4.725,130,1);socket.emit("1",5.245,130,1);socket.emit("1",5.715,130,1);socket.emit("1",6.185,130,1);socket.emit("1",6.655,130,1);socket.emit("1",7.13,130,1);socket.emit("1",7.6,130,1);socket.emit("1",1.85,130,1);socket.emit("1",2.32,130,1);socket.emit("1",2.79,130,1);socket.emit("1",3.265,130,1);socket.emit("1",3.735,130,1);socket.emit("1",4.205,130,1);
    }
});



function moveSelUnits() {
    if (selUnits.length) {
        var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
        for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);
        socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), e, 0, -2)
    }
}