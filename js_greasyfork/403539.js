// ==UserScript==
// @name         REMOVER TUDO 3
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Zoom, Base Builder, InstaFind
// @author       EU
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403539/REMOVER%20TUDO%203.user.js
// @updateURL https://update.greasyfork.org/scripts/403539/REMOVER%20TUDO%203.meta.js
// ==/UserScript==

//BaseBuilder

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];


window.UIList.push({
    level: 0,
    x: 0,
    html: '<div onclick=tirarwall()>TIRAR WALL</div>'
}, {
    level:0,
    x:0,
    html:'<div id="res" onclick=setRes()>Res(1)</div>'
}, {
    level:0,
    x:1,
    html:'<div id="fps" onclick=setFPS()>Normal</div>'
}
    );

function emit2() {
    socket.emit.apply(socket, arguments);
}
window.tirarwall = function () {
for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);
    socket.emit("3", a)
}


var resolution = 1;
var rate = 0;

window.removeEventListener("mousemove", gameInput);

window.gameInput = function (a) {
    a.preventDefault();
    a.stopPropagation();
    mouseX = a.clientX * resolution;
    mouseY = a.clientY * resolution;
};
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
    };

    mainContext.setTransform(scaleFillNative, 0, 0, scaleFillNative, Math.floor((screenWidth - maxScreenWidth * scaleFillNative) / 2), Math.floor((screenHeight - maxScreenHeight * scaleFillNative) / 2));
    player || renderBackground();
};
window.addEventListener("resize", resize);
window.statusItems.push({
    order: 1,
    value: function () {
        return document.getElementById('auto1').textContent;
    }
}, {
    order: 2,
    value: function () {
        return document.getElementById('auto2').textContent;
    }
}, {
    order: 3,
    value: function () {
        return document.getElementById('auto3').textContent;
    }
}, {
    order: 4,
    value: function () {
        return document.getElementById('patch').textContent;
    }
}, {
    order: 5,
    value: function () {
        return document.getElementById('afk').textContent;
    }
}, {
    order: 6,
    value: function () {
        return document.getElementById('fps').textContent;
    }
}, {
    order: 7,
    name: 'Resolution',
    value: function () {
        return document.getElementById('res').textContent;
    }});
window.setFPS = function () {
    var el = document.getElementById('fps');
    if (rate === 0) {
        el.textContent = 'Anti-Lagg:on';
        rate = 150;
    } else if (rate === 150) {
        el.textContent = 'Ultra Anti-Lagg';
        rate = 500;
    } else if (rate === 500) {
        el.textContent = 'Supreme Anti-Lagg';
        rate = 5000;
    } else if (rate === 5000) {
        el.textContent = 'Max Anti-Lagg';
        rate = 100000;
    } else if (rate === 100000) {
        el.textContent = 'Maximized Anti-Lagg';
        rate = 999999999;
    } else if (rate === 999999999) {
        el.textContent = 'VIP Level:1 Anti-Lagg';
        rate = 99999999999999999999999999999999999999999999999999;
    } else if (rate === 99999999999999999999999999999999999999999999999999) {
        el.textContent = 'VIP Level:2 Anti-Lagg';
        rate = 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
    } else if (rate === 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999) {
        el.textContent = 'VIP Level:3 Anti-Lagg';
        rate = 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
    } else {
        el.textContent = 'Normal';
        rate = 0;
    }
    unitSprites = {};
    resize();
    window.statusBar();
};
window.setRes = function () {
    var el = document.getElementById('res');
    if (resolution === 2) {
        resolution = .1;
        el.textContent = 'Res(.1)';
    } else if (resolution === .1) {
        resolution = .2;
        el.textContent = 'Res(.2)';
    } else if (resolution === .2) {
        resolution = .3;
        el.textContent = 'Res(.3)';
    } else if (resolution === .3) {
        resolution = .4;
        el.textContent = 'Res(.4)';
    } else if (resolution === .4) {
        resolution = .5;
        el.textContent = 'Res(.5)';
    } else if (resolution === .5) {
        resolution = .6;
        el.textContent = 'Res(.6)';
    } else if (resolution === .6) {
        resolution = .7;
        el.textContent = 'Res(.7)';
    } else if (resolution === .7) {
        resolution = .8;
        el.textContent = 'Res(.8)';
    } else if (resolution === .8) {
        resolution = .9;
        el.textContent = 'Res(.9)';
    } else if (resolution === .9) {
        resolution = 1;
        el.textContent = 'Res(1)';
    } else if (resolution === 1) {
        resolution = 1.1;
        el.textContent = 'Res(1.1)';
    } else if (resolution === 1.1) {
        resolution = 1.2;
        el.textContent = 'Res(1.2)';
    } else if (resolution === 1.2) {
        resolution = 1.3;
        el.textContent = 'Res(1.3)';
    } else if (resolution === 1.3) {
        resolution = 1.4;
        el.textContent = 'Res(1.4)';
    } else if (resolution === 1.4) {
        resolution = 1.5;
        el.textContent = 'Res(1.5)';
    } else if (resolution === 1.5) {
        resolution = 1.6;
        el.textContent = 'Res(1.6)';
    } else if (resolution === 1.6) {
        resolution = 1.7;
        el.textContent = 'Res(1.7)';
    } else if (resolution === 1.7) {
        resolution = 1.8;
        el.textContent = 'Res(1.8)';
    } else if (resolution === 1.8) {
        resolution = 1.9;
        el.textContent = 'Res(1.9)';
    } else if (resolution === 1.9) {
        resolution = 2;
        el.textContent = 'Res(2)';
    } else if (resolution === 2) {
        resolution = 2.1;
        el.textContent = 'Res(2.1)';
    } else if (resolution === 2.1) {
        resolution = 2.2;
        el.textContent = 'Res(2.2)';
    } else if (resolution === 2.2) {
        resolution = 2.3;
        el.textContent = 'Res(2.3)';
    } else if (resolution === 2.3) {
        resolution = 2.4;
        el.textContent = 'Res(2.4)';
    } else {
        resolution = 2.5;
        el.textContent = 'Res(2.5)';
    }
    unitSprites = {};
    resize();
    window.statusBar();
};
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