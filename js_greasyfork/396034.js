// ==UserScript==
// @name         loserscript v2
// @namespace    http://tampermonkey.net/
// @version      v.1.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396034/loserscript%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/396034/loserscript%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();var targetFPS = 60,
    sendFPS = 30,
    delta, delta2, currentTime, oldTime = 0,
    gameState = 0,
    gameData, socket, port;
Number.prototype.round = function(a) {
    return +this.toFixed(a)
};
var MathPI = Math.PI,
    MathCOS = Math.cos,
    MathSIN = Math.sin,
    MathABS = Math.abs,
    MathPOW = Math.pow,
    MathMIN = Math.min,
    MathMAX = Math.max,
    MathATAN2 = Math.atan2,
    MathSQRT = Math.sqrt,
    mainCanvas = document.getElementById("mainCanvas"),
    mainContext = mainCanvas.getContext("2d"),
    gameTitle = document.getElementById("gameTitle"),
    instructionsText = document.getElementById("instructionsText"),
    gameUiContainer = document.getElementById("gameUiContainer"),
    userInfoContainer = document.getElementById("userInfoContainer"),
    loadingContainer = document.getElementById("loadingContainer"),
    enterGameButton = document.getElementById("enterGameButton"),
    userNameInput = document.getElementById("userNameInput"),
    menuContainer = document.getElementById("menuContainer"),
    darkener = document.getElementById("darkener"),
    linksContainer = document.getElementById("linksContainer"),
    leaderboardList = document.getElementById("leaderboardList"),
    followText = document.getElementById("followText"),
    lobbyKey = document.getElementById("lobbyKey"),
    lobbyKeyText = document.getElementById("lobbyKeyText"),
    scoreContainer = document.getElementById("scoreContainer"),
    unitListDisplay = document.getElementById("unitList"),
    unitInfoContainer = document.getElementById("unitInfoContainer"),
    unitInfo = document.getElementById("unitInfo"),
    unitInfoUpgrades = document.getElementById("unitInfoUpgrades"),
    unitInfoName = document.getElementById("unitInfoName"),
    unitInfoCost = document.getElementById("unitInfoCost"),
    unitInfoDesc = document.getElementById("unitInfoDesc"),
    unitInfoType = document.getElementById("unitInfoType"),
    unitInfoLimit = document.getElementById("unitInfoLimit"),
    sellButton = document.getElementById("sellButton"),
    chatInput = document.getElementById("chatInput"),
    chatList = document.getElementById("chatList"),
    chatListWrapper = document.getElementById("chatListWrapper"),
    skinInfo = document.getElementById("skinInfo"),
    skinSelector = document.getElementById("skinSelector"),
    skinIcon = document.getElementById("skinIcon"),
    instructionsIndex = 0,
    instructionsSpeed = 5500,
    insturctionsCountdown = 0,
    instructionsList = "CERTIFIQUE-SE QUE TENHA SOMENTE O loserscriptV1 ABERTO;MAKE SURE YOU HAVE ONLY THE loserscriptV1 OPEN ; NOVIDADES=NOVO X-RAY PERSONALIZADO PARA USUARIOS PERSONALIZADOS".split(";"),
    InstructionsIndex = UTILS.randInt(0, instructionsList.length - 1),
    randomLoadingTexts = ["ENTRANDO..."],
    featuredYoutuber = document.getElementById("featuredYoutube"),
    youtuberList = [{
        name: "ABRA O DSICORD DO CRIADOR PARA TER PRIVILEGIOS",
        link: "https://discord.gg/beKH2mh"
    }],
    tmpYoutuber = youtuberList[UTILS.randInt(0, youtuberList.length - 1)];
featuredYoutuber.innerHTML = "<a target='_blank' href='" + tmpYoutuber.link + "'><i class='material-icons' style='vertical-align: top;'>&#xE064;</i> " + tmpYoutuber.name + "</a>";
var hasStorage = "undefined" !== typeof Storage,
    firstCid = !1,
    cid = 0;
hasStorage && (cid = localStorage.getItem("cid"), cid && 0 != cid || (firstCid = !0, cid = UTILS.getUniqueID(), localStorage.setItem("cid", cid)));
var tmpIndx, tmpVal, partyKey = null, player = null, users = [], unitList = [], forceUnitInfoUpdate, units = [], bullets = [], activeUnit, activeBase, selUnits = [], selUnitType, hoverUnit, showSelector, activeUnitDst, activeUnitDir, mapBounds, targetDir = 0, targetDst = 0, scaleFillNative = 1, maxScreenWidth = 1920, maxScreenHeight = 1080, originalScreenWidth = maxScreenWidth, originalScreenHeight = maxScreenHeight, screenWidth, screenHeight, darkColor = "#666666", outlineWidth = 7, lanePad = 20, backgroundColor = "#ebebeb", outerColor = "#d6d6d6", indicatorColor = "rgba(0,0,0,0.08)", turretColor = "#A8A8A8", bulletColor = "#A8A8A8", redColor = "rgba(255, 0, 0, 0.1)", targetColor = "#b4b4b4", playerColors = "#f9ff6080 #ff606080 #82ff6080 #607eff80 #60eaff80 #ff60ee80 #e360ff80 #ffaf6080 #a3ff6080 #ff609c80 #60ff8280 #cc60ff80 #c6595980 #404b7f80 #f2d95780 #c5525280 #c5525280 #498e5680 #c4515180 #c3545480 #c8575780 #c8595980 #5b74b680 #cd686880 #5c81bd80 #5bb14680 #d8c96380 #c5525280 #404b7f80 #c5525280 #c5525280 #c5525280 #c5525280 #404b7f80 #498e5680 #498e5680".split(" "), playerSkins = 24, currentSkin =0, cameraSpd = .85, unitRotSpd = .5, cameraKeys, camX = 0, camXS = 0, camY = 0, camYS = 0;




function resetCamera() {
    camX = camXS = camY = camYS = 0;
    cameraKeys = {
        l: 0,
        r: 0,
        u: 0,
        d: 0
    }
}
resetCamera();
var upgrInputsToIndex = {
        k49: 1,
        k50: 2,
        k51: 3,
        k52: 4,
        k53: 5,
        k54: 7,
        k55: 8
    },
    playerBorderRot = 0;
mainCanvas.onkeyup = function(a) {
    a = a.keyCode ? a.keyCode : a.which;
    if (socket && player && !player.dead) {
        if (65 == a || 37 == a) cameraKeys.l = 0, updateCameraInput();
        if (68 == a || 39 == a) cameraKeys.r = 0, updateCameraInput();
        if (87 == a || 38 == a) cameraKeys.u = 0, updateCameraInput();
        if (83 == a || 40 == a) cameraKeys.d = 0, updateCameraInput();
        if (32 == a) {
            var d = unitList.indexOf(activeUnit);
            sendUnit(d)
        }
        void 0 != upgrInputsToIndex["k" + a] && toggleActiveUnit(upgrInputsToIndex["k" + a]);
        46 == a && selUnits.length && sellSelUnits();
        84 == a && toggleChat("none" == chatListWrapper.style.display);
        27 == a && (toggleActiveUnit(), disableSelUnit(), showSelector = !1);
        82 == a && (camY = camX = 0)
    }
};
mainCanvas.onkeydown = function(a) {
    a = a.keyCode ? a.keyCode : a.which;
    socket && player && !player.dead && (65 != a && 37 != a || cameraKeys.l || (cameraKeys.l = -1, cameraKeys.r = 0, updateCameraInput()), 68 != a && 39 != a || cameraKeys.r || (cameraKeys.r = 1, cameraKeys.l = 0, updateCameraInput()), 87 != a && 38 != a || cameraKeys.u || (cameraKeys.u = -1, cameraKeys.d = 0, updateCameraInput()), 83 != a && 40 != a || cameraKeys.d || (cameraKeys.d = 1, cameraKeys.u = 0, updateCameraInput()))
};

function getURLParam(a, d) {
    d || (d = location.href);
    a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var c = (new RegExp("[\\?&]" + a + "=([^&#]*)")).exec(d);
    return null == c ? null : c[1]
}
var lobbyURLIP = getURLParam("l"),
    lobbyRoomID;
if (lobbyURLIP) {
    var tmpL = lobbyURLIP.split("-"),
        lobbyURLIP = tmpL[0];
    lobbyRoomID = tmpL[1]
}
window.onbeforeunload = function(a) {
    return gameState ? "Tem certeza que quer sair??" : null
};
window.onload = function() {
    enterGameButton.onclick = function() {
        enterGame()
    };
    userNameInput.addEventListener("keypress", function(a) {
        13 === (a.which || a.keyCode) && enterGame()
    });
    mainCanvas.addEventListener("keypress", function(a) {
        gameState && 13 === (a.which || a.keyCode) && (mainCanvas.blur(), chatInput.focus(), toggleChat(!0))
    });
    chatInput.addEventListener("keypress", function(a) {
        gameState && socket && 13 === (a.which || a.keyCode) && ("" != chatInput.value && socket.emit("ch", chatInput.value), chatInput.value = "", mainCanvas.focus())
    });
    chatInput.onclick = function() {
        toggleChat(!0)
    };
    sellButton.onclick = function() {
        socket && selUnits.length && sellSelUnits();
        mainCanvas.focus()
    };
    $.get("/getIP", {
        sip: lobbyURLIP
    }, function(a) {
        port = a.port;
        socket || (socket = io.connect("http://" + a.ip + ":" + a.port, {
            "connect timeout": 3E3,
            reconnection: !0,
            query: "cid=" + cid + "&rmid=" + lobbyRoomID
        }), setupSocket())
    })
};
window.addEventListener("mousemove", gameInput, !1);
var mouseX, mouseY, mouseStartX, mouseStartY;

function gameInput(a) {
    a.preventDefault();
    a.stopPropagation();
    mouseX = a.clientX;
    mouseY = a.clientY
}
mainCanvas.addEventListener("mousedown", function(a) {
    a.preventDefault();
    a.stopPropagation();
    document.activeElement != mainCanvas && mainCanvas.focus();
    mouseStartX = maxScreenWidth / 2 + targetDst * MathCOS(targetDir);
    mouseStartY = maxScreenHeight / 2 + targetDst * MathSIN(targetDir);
    showSelector = !0;
    activeUnit ? (showSelector = !1, 3 === a.which ? toggleActiveUnit() : unitList && (a = unitList.indexOf(activeUnit), sendUnit(a))) : 3 !== a.which && 2 !== a.button || !selUnits.length || (showSelector = !1, "Unit" == selUnitType ? moveSelUnits() : setSelUnitGather())
});
window.addEventListener("mouseup", function(a) {
    a.preventDefault();
    a.stopPropagation();
    gameState && showSelector && (showSelector = !1, toggleSelUnit())
});

function addChatLine(a, d, c) {
    if (player) {
        var b = getUserBySID(a);
        if (c || 0 <= b) {
            var g = c ? "SERVER" : users[b].name;
            c = c ? "#fff" : playerColors[users[b].color] ? playerColors[users[b].color] : playerColors[0];
            player.sid == a && (c = "#fff");
            b = document.createElement("li");
            b.className = player.sid == a ? "chatme" : "chatother";
            b.innerHTML = '<span style="color:' + c + '">[' + g + ']</span> <span class="chatText">' + d + "</span>";
            10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
            chatList.appendChild(b)
        }
    }
}

function toggleChat(a) {
    chatListWrapper.style.display = a ? "block" : "none"
}

function setupSocket() {
    socket.on("connect_error", function() {
        lobbyURLIP ? kickPlayer("Falha na conexão") : kickPlayer("Falha na conexão")
    });
    socket.on("disconnect", function(a) {
        kickPlayer("Falha na conexão")
    });
    socket.on("error", function(a) {
        kickPlayer("Falha na conexão")
    });
    socket.on("kick", function(a) {
        kickPlayer(a)
    });
    socket.on("lk", function(a) {
        partyKey = a
    });
    socket.on("spawn", function() {
        gameState = 1;
        unitList = share.getUnitList();
        resetCamera();
        toggleMenuUI(!1);
        toggleGameUI(!0);
        updateUnitList();
        player.upgrades = share.getBaseUpgrades();
        mainCanvas.focus()
    });
    socket.on("gd", function(a) {
        gameData = a
    });
    socket.on("mpd", function(a) {
        mapBounds = a
    });
    socket.on("ch", function(a, d, c) {
        addChatLine(a, d, c)
    });
    socket.on("setUser", function(a, d) {
        if (a && a[0]) {
            var c = getUserBySID(a[0]),
                b = {
                    sid: a[0],
                    name: a[1],
                    iName: "Informações da base",
                    dead: !1,
                    color: a[2],
                    size: a[3],
                    startSize: a[4],
                    x: a[5],
                    y: a[6],
                    buildRange: a[7],
                    gridIndex: a[8],
                    spawnProt: a[9],
                    skin: a[10],
                    desc: "Spawned:" + a[8] + "   " + "Protect:" + a[9] + "   " + "Skin:" + a[10] + "   "  +
                    "ID:" + a[0] + "   " + "Distância de Altura:" + a[6] + "%" +"   "  + "Distância de largura:" + a[5] + "   " + "Name:" + a[1] + "   " + "Health(Testing...):" + a[2] ,
                    kills: 10,
                    typeName: "Base"
                };
            null != c ? (users[c] = b, d && (player = users[c])) : (users.push(b), d && (player = users[users.length - 1]))
        }
    });
    socket.on("klUser", function(a) {
        var d = getUserBySID(a);
        null != d && (users[d].dead = !0);
        player && player.sid == a && (hideMainMenuText(), leaveGame())
    });
    socket.on("delUser", function(a) {
        a = getUserBySID(a);
        null != a && users.splice(a, 1)
    });
    socket.on("au", function(a) {
        a && (units.push({
            id: a[0],
            owner: a[1],
            uPath: a[2] || 0,
            type: a[3] || 0,
            color: a[4] || 0,
            paths: a[5],
            x: a[6] || 0,
            sX: a[6] || 0,
            y: a[7] || 0,
            sY: a[7] || 0,
            dir: a[8] ||
                0,
            turRot: a[8] || 0,
            speed: a[9] || 0,
            renderIndex: a[10] || 0,
            turretIndex: a[11] || 0,
            range: a[12] || 0,
            cloak: a[13] || 0
        }), units[units.length - 1].speed && (units[units.length - 1].startTime = window.performance.now()), a = getUnitFromPath(units[units.length - 1].uPath)) && (units[units.length - 1].size = a.size, units[units.length - 1].shape = a.shape, units[units.length - 1].layer = a.layer, units[units.length - 1].renderIndex || (units[units.length - 1].renderIndex = a.renderIndex), units[units.length - 1].range || (units[units.length - 1].range = a.range),
            units[units.length - 1].turretIndex || (units[units.length - 1].turretIndex = a.turretIndex), units[units.length - 1].iSize = a.iSize)
    });
    socket.on("spa", function(a, d, c, b) {
        a = getUnitById(a);
        if (null != a) {
            var g = UTILS.getDistance(d, c, units[a].x || d, units[a].y || c);
            300 > g && g ? (units[a].interpDst = g, units[a].interpDstS = g, units[a].interpDir = UTILS.getDirection(d, c, units[a].x || d, units[a].y || c)) : (units[a].interpDst = 0, units[a].interpDstS = 0, units[a].interpDir = 0, units[a].x = d, units[a].y = c);
            units[a].interX = 0;
            units[a].interY = 0;
            units[a].sX =
                units[a].x || d;
            units[a].sY = units[a].y || c;
            b[0] && (units[a].dir = b[0], units[a].turRot = b[0]);
            units[a].paths = b;
            units[a].startTime = window.performance.now()
        }
    });
    socket.on("uc", function(a, d) {
        unitList && (unitList[a].count = d);
        forceUnitInfoUpdate = !0
    });
    socket.on("uul", function(a, d) {
        unitList && (unitList[a].limit += d)
    });
    socket.on("rpu", function(a, d) {
        var c = getUnitFromPath(a);
        c && (c.dontShow = d, forceUnitInfoUpdate = !0)
    });
    socket.on("sp", function(a, d) {
        var c = getUserBySID(a);
        null != c && (users[c].spawnProt = d)
    });
    socket.on("ab", function(a) {
        a &&
            bullets.push({
                x: a[0],
                sX: a[0],
                y: a[1],
                sY: a[1],
                dir: a[2],
                speed: a[3],
                size: a[4],
                range: a[5]
            })
    });
    socket.on("uu", function(a, d) {
        if (void 0 != a && d) {
            var c = getUnitById(a);
            if (null != c)
                for (var b = 0; b < d.length;) units[c][d[b]] = d[b + 1], "dir" == d[b] && (units[c].turRot = d[b + 1]), b += 2
        }
    });
    socket.on("du", function(a) {
        a = getUnitById(a);
        null != a && units.splice(a, 1)
    });
    socket.on("sz", function(a, d) {
        var c = getUserBySID(a);
        null != c && (users[c].size = d)
    });
    socket.on("pt", function(a, b, c, d, e, f) {
        scoreContainer.innerHTML = "Power " + a + "<div style='display:float:down;' class='blackText'>"
    });
    socket.off("pt", function(a) {
        scoreContainer.innerHTML = "Money: <span class='greyMenuText'>" + a + b +
            "/6000</span>"
    });
    socket.on("l", function(a) {
        for (var d = "", c = 1, b = 0; b < a.length;) d += "<div class='leaderboardItem'><div style='display:inline-block;float:right;' class='whiteText'>" + c + ".</div> <div class='" + (player && a[b] == player.sid ? "leaderYou" : "leader") + "'>" + a[b + 1] + "</div><div class='scoreText'>" + a[b + 2] + "</div></div>", c++, b += 3;
        leaderboardList.innerHTML = d
    })
}
function setupSocket2(i) {

}
function updateUnitList() {
    if (unitList) {
        for (var a = "", d = 0; d < unitList.length; ++d) unitList[d].notUser || (a += "<div onmouseout='toggleHoverUnit()' id='unitItem" + d + "' class='unitItem'><img id='unitItemIcon" + d + "'></div>");
        unitListDisplay.innerHTML = a;
        for (d = 0; d < unitList.length; ++d) unitList[d].notUser || function(a) {
            var b = document.createElement("canvas");
            b.width = b.height = 65;
            var c = b.getContext("2d");
            c.translate(b.width / 2, b.height / 2);
            c.imageSmoothingEnabled = !1;
            c.webkitImageSmoothingEnabled = !1;
            c.mozImageSmoothingEnabled = !1;
            renderUnit(0, 0, 0, unitList[a], player ? playerColors[player.color] : "#fff", c, !0);
            document.getElementById("unitItemIcon" + a).src = b.toDataURL();
            b = document.getElementById("unitItem" + a);
            b.onmouseover = function() {
                toggleHoverUnit(unitList[a])
            };
            b.onclick = function() {
                toggleActiveUnit(a)
            }
        }(d)
    }
}

function getUnitFromPath(a) {
    if (a.length && 10 < a.length) return null;
    for (var d, c = 0; c < a.length; ++c)
        if (d)
            if (d.upgrades && d.upgrades[a[c]]) d = d.upgrades[a[c]];
            else return null;
    else d = unitList[a[c]];
    return d
}
var lastCount = -1;

function toggleUnitInfo(a, d) {
    var c = "";
    a && a.uPath && (c = void 0 != a.group ? a.group : a.uPath[0], c = unitList[c].limit ? (unitList[c].count || 0) + "/" + unitList[c].limit : "");
    if (a && (forceUnitInfoUpdate || "block" != unitInfoContainer.style.display || unitInfoName.innerHTML != (a.iName || a.name) || lastCount != c)) {
        forceUnitInfoUpdate = !1;
        unitInfoContainer.style.display = "block";
        unitInfoName.innerHTML = a.iName || a.name;
        a.cost ? (unitInfoCost.innerHTML = "Cost " + a.cost, unitInfoCost.style.display = "block") : unitInfoCost.style.display = "none";
        unitInfoDesc.innerHTML = a.desc;
        unitInfoType.innerHTML = a.typeName;
        var b = a.space;
        lastCount = c;
        c = '<span style="color:#fff">' + c + "</span>";
        unitInfoLimit.innerHTML = b ? '<span><i class="material-icons" style="Horizontal-align: top; font-size: 20px;">&#xE7FD;</i>' + b + "</span> " + c : c;
        unitInfoUpgrades.innerHTML = "";
        if (d && a.upgrades) {
            for (var g, e, h, f, k, c = 0; c < a.upgrades.length; ++c)(function(b) {
                g = a.upgrades[b];
                var c = !0;
                g.lockMaxBuy && void 0 != g.unitSpawn && (unitList[g.unitSpawn].count || 0) >= (unitList[g.unitSpawn].limit || 0) ?
                    c = !1 : g.dontShow && (c = !1);
                c && (e = document.createElement("div"), e.className = "upgradeInfo", h = document.createElement("div"), h.className = "unitInfoName", h.innerHTML = g.name, e.appendChild(h), f = document.createElement("div"), f.className = "unitInfoCost", f.innerHTML = "Cost " + g.cost, e.appendChild(f), k = document.createElement("div"), k.id = "upgrDesc" + b, k.className = "unitInfoDesc", k.innerHTML = g.desc, k.style.display = "none", e.appendChild(k), e.onmouseover = function() {
                        document.getElementById("upgrDesc" + b).style.display = "block"
                    },
                    e.onmouseout = function() {
                        document.getElementById("upgrDesc" + b).style.display = "none"
                    }, e.onclick = function() {
                        upgradeUnit(b);
                        mainCanvas.focus()
                    }, unitInfoUpgrades.appendChild(e))
            })(c);
            g = e = h = f = k = null
        }
    } else a || (unitInfoContainer.style.display = "none")
}

function toggleHoverUnit(a) {
    hoverUnit = a
}

function toggleActiveUnit(a) {
    for (var d = 0; d < unitList.length; ++d) unitList[d].notUser || (document.getElementById("unitItem" + d).className = "unitItem");
    void 0 == a || unitList[a].notUser || activeUnit == unitList[a] ? activeUnit = null : (activeUnit = unitList[a], disableSelUnit(), showSelector = !1, document.getElementById("unitItem" + a).className = "unitItemA");
    mainCanvas.focus()
}

function toggleSelUnit() {
    if (player && !activeUnit && units) {
        var a = (player.x || 0) - maxScreenWidth / 2 + camX,
            d = (player.y || 0) - maxScreenHeight / 2 + camY,
            c = player.x - a + targetDst * MathCOS(targetDir) + camX,
            b = player.y - d + targetDst * MathSIN(targetDir) + camY;
        disableSelUnit();
        var g = 4 >= MathABS(c - mouseStartX + (b - mouseStartY)),
            e = !1;
        activeBase = null;
        if (g)
            for (var h = 0; h < users.length; ++h)
                if (0 <= users[h].size - UTILS.getDistance(c, b, users[h].x - a, users[h].y - d)) {
                    activeBase = users[h];
                    forceUnitInfoUpdate = !0;
                    break
                }
        if (!activeBase) {
            activeBase = null;
            for (h = 0; h < units.length; ++h)
                if (units[h].owner == player.sid)
                    if (g) {
                        if (0 <= units[h].size - UTILS.getDistance(c, b, units[h].x - a, units[h].y - d)) {
                            selUnits.push(units[h]);
                            var f = getUnitFromPath(selUnits[0].uPath);
                            f && (selUnits[0].info = f, "Unit" == f.typeName && (e = !0));
                            break
                        }
                    } else UTILS.pointInRect(units[h].x - a, units[h].y - d, mouseStartX, mouseStartY, c - mouseStartX, b - mouseStartY) && (selUnits.push(units[h]), f = getUnitFromPath(selUnits[selUnits.length - 1].uPath)) && (selUnits[selUnits.length - 1].info = f, "Unit" == f.typeName && (e = !0));
            if (selUnits.length) {
                for (h = selUnits.length - 1; 0 <= h; --h) e && "Tower" == selUnits[h].info.typeName ? selUnits.splice(h, 1) : e || "Unit" != selUnits[h].info.typeName || selUnits.splice(h, 1);
                selUnitType = e ? "Unit" : "Tower";
                150 < selUnits.length && (selUnits.length = 150)
            }
        }
        updateSelUnitViews()
    }
}

function updateSelUnitViews() {
    sellButton.style.display = "block";
    for (var a = 0, d = 0; d < selUnits.length; ++d) a += Math.round(selUnits[d].info.cost / 2);
    a ? sellButton.innerHTML = "Vender: <span class='greyMenuText'>" + a + "</span>" : sellButton.style.display = "none"
}

function disableSelUnit(a) {
    void 0 == a ? (selUnits.length = 0, sellButton.style.display = "none") : selUnits[a] && (selUnits.splice(a, 1), selUnits.length || disableSelUnit())
}

function setSelUnitGather() {
    if (selUnits.length) {
        for (var a = player.x + targetDst * MathCOS(targetDir) + camX, d = player.y + targetDst * MathSIN(targetDir) + camY, c = [], b = 0; b < selUnits.length; ++b) void 0 != selUnits[b].info.unitSpawn && (selUnits[b].gatherPoint = [a, d], c.push(selUnits[b].id));
        socket.emit("6", a, d, c)
    }
}

function sellSelUnits() {
    if (selUnits.length) {
        for (var a = [], d = 0; d < selUnits.length; ++d) a.push(selUnits[d].id);
        socket.emit("3", a)
    }
}

function moveSelUnits() {
    if (selUnits.length) {
        var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY,
            c = 1;
        if (c && 1 < selUnits.length)
            for (var b = 0; b < users.length; ++b)
                if (UTILS.pointInCircle(a, d, users[b].x, users[b].y, users[b].size)) {
                    c = 0;
                    break
                }
        var g = -1;
        if (c)
            for (b = 0; b < units.length; ++b)
                if (units[b].onScreen && units[b].owner != player.sid && UTILS.pointInCircle(a, d, units[b].x, units[b].y, units[b].size)) {
                    c = 0;
                    g = units[b].id;
                    break
                }
        1 == selUnits.length && (c = 0);
        for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);
        socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), e, c, g)
    }
}

function loadPartyKey() {
    partyKey && (window.history.pushState("", "bloble.io", "/?l=" + partyKey), lobbyKeyText.innerHTML = "Manda pra geral", lobbyKey.className = "deadLink")
}
var unlockedSkins = 0;
hasStorage && localStorage.getItem("isFollBlob") && unlockSkins();

function unlockSkins() {
    skinInfo.style.display = "inline-block";
    skinSelector.style.display = "inline-block";
    followText.innerHTML = "loserscriptV1 ON";
    unlockedSkins = !0;
    hasStorage && localStorage.setItem("isFollBlob", 1)
}

function changeSkin(a) {
    currentSkin += a;
    0 > currentSkin && (currentSkin = playerSkins);
    currentSkin > playerSkins && (currentSkin = 0);
    a = document.createElement("canvas");
    a.width = a.height = 100;
    var d = a.getContext("2d");
    d.translate(a.width / 2, a.height / 2);
    d.lineWidth = outlineWidth;
    d.strokeStyle = darkColor;
    renderPlayer({
        size: 50,
        color: 1,
        skin: currentSkin
    }, 0, 0, d, currentSkin);
    skinIcon.src = a.toDataURL()
}
changeSkin(0);
$("#skinSelector").bind("contextmenu", function(a) {
    changeSkin(-1);
    return !1
});
hasStorage && localStorage.getItem("lstnmdbl") && (userNameInput.value = localStorage.getItem("lstnmdbl"));

function enterGame() {
    socket && unitList && (showMainMenuText(randomLoadingTexts[UTILS.randInt(0, randomLoadingTexts.length - 1)]), socket.emit("spawn", {
        name: userNameInput.value,
        skin: currentSkin
    }), hasStorage && localStorage.setItem("lstnmdbl", userNameInput.value), mainCanvas.focus())
}

function leaveGame() {
    gameState = 0;
    toggleGameUI(!1);
    toggleMenuUI(!0)
}

function isOnScreen(a, d, c) {
    return a - c <= maxScreenWidth && 0 <= a + c && d - c <= maxScreenHeight && 0 <= d + c
}
var lastCamX, lastCamY, sendFrequency = 1E3 / 24,
    lastCamSend = window.performance.now(),
    updateGameLoop = function(a) {
        if (player && gameData) {
            updateTarget();
            if (gameState && mapBounds) {
                if (camXS || camYS) camX += camXS * cameraSpd * a, camY += camYS * cameraSpd * a;
                player.x + camX < mapBounds[0] ? camX = mapBounds[0] - player.x : player.x + camX > mapBounds[0] + mapBounds[2] && (camX = mapBounds[0] + mapBounds[2] - player.x);
                player.y + camY < mapBounds[1] ? camY = mapBounds[1] - player.y : player.y + camY > mapBounds[1] + mapBounds[3] && (camY = mapBounds[1] + mapBounds[3] - player.y);
                currentTime - lastCamSend >= sendFrequency && (lastCamX != camX || lastCamY != camY) && (lastCamX = camX, lastCamY = camY, lastCamSend = currentTime, socket.emit("2", Math.round(camX), Math.round(camY)))
            }
            renderBackground(outerColor);
            var d = (player.x || 0) - maxScreenWidth / 2 + camX,
                c = (player.y || 0) - maxScreenHeight / 2 + camY;
            mapBounds && (mainContext.fillStyle = backgroundColor, mainContext.fillRect(mapBounds[0] - d, mapBounds[1] - c, mapBounds[2], mapBounds[3]));
            for (var b, g, e = 0; e < units.length; ++e) b = units[e], b.interpDst && (g = b.interpDst * a * .015, b.interX +=
                g * MathCOS(b.interpDir), b.interY += g * MathSIN(b.interpDir), b.interpDst -= g, .1 >= b.interpDst && (b.interpDst = 0, b.interX = b.interpDstS * MathCOS(b.interpDir), b.interY = b.interpDstS * MathSIN(b.interpDir))), b.speed && (updateUnitPosition(b), b.x += b.interX || 0, b.y += b.interY || 0);
            var h, f;
            if (gameState)
                if (activeUnit) {
                    h = player.x - d + targetDst * MathCOS(targetDir) + camX;
                    f = player.y - c + targetDst * MathSIN(targetDir) + camY;
                    var k = UTILS.getDirection(h, f, player.x - d, player.y - c);
                    0 == activeUnit.type ? (b = UTILS.getDistance(h, f, player.x - d, player.y -
                            c), b - activeUnit.size < player.startSize ? (h = player.x - d + (activeUnit.size + player.startSize) * MathCOS(k), f = player.y - c + (activeUnit.size + player.startSize) * MathSIN(k)) : b + activeUnit.size > player.buildRange - .15 && (h = player.x - d + (player.buildRange - activeUnit.size - .15) * MathCOS(k), f = player.y - c + (player.buildRange - activeUnit.size - .15) * MathSIN(k))) : 1 == activeUnit.type || 2 == activeUnit.type ? (h = player.x - d + (activeUnit.size + player.buildRange) * MathCOS(k), f = player.y - c + (activeUnit.size + player.buildRange) * MathSIN(k)) : 3 == activeUnit.type &&
                        (b = UTILS.getDistance(h, f, player.x - d, player.y - c), b - activeUnit.size < player.startSize ? (h = player.x - d + (activeUnit.size + player.startSize) * MathCOS(k), f = player.y - c + (activeUnit.size + player.startSize) * MathSIN(k)) : b + activeUnit.size > player.buildRange + 2 * activeUnit.size && (h = player.x - d + (player.buildRange + activeUnit.size) * MathCOS(k), f = player.y - c + (player.buildRange + activeUnit.size) * MathSIN(k)));
                    activeUnitDir = k;
                    activeUnitDst = UTILS.getDistance(h, f, player.x - d, player.y - c);
                    activeUnit.dontPlace = !1;
                    mainContext.fillStyle =
                        outerColor;
                    if (0 == activeUnit.type || 2 == activeUnit.type || 3 == activeUnit.type)
                        for (e = 0; e < units.length; ++e)
                            if (1 != units[e].type && units[e].owner == player.sid && 0 <= activeUnit.size + units[e].size - UTILS.getDistance(h, f, units[e].x - d, units[e].y - c)) {
                                mainContext.fillStyle = redColor;
                                activeUnit.dontPlace = !0;
                                break
                            }
                    renderCircle(h, f, activeUnit.range ? activeUnit.range : activeUnit.size + 30, mainContext, !0)
                } else if (selUnits.length)
                for (e = 0; e < selUnits.length; ++e) mainContext.fillStyle = outerColor, 1 < selUnits.length ? renderCircle(selUnits[e].x -
                    d, selUnits[e].y - c, selUnits[e].size + 25, mainContext, !0) : renderCircle(selUnits[e].x - d, selUnits[e].y - c, selUnits[e].range ? selUnits[e].range : selUnits[e].size + 25, mainContext, !0);
            else activeBase && (mainContext.fillStyle = outerColor, renderCircle(activeBase.x - d, activeBase.y - c, activeBase.size + 50, mainContext, !0));
            if (selUnits.length)
                for (mainContext.strokeStyle = targetColor, e = 0; e < selUnits.length; ++e) selUnits[e].gatherPoint && renderDottedCircle(selUnits[e].gatherPoint[0] - d, selUnits[e].gatherPoint[1] - c, 30, mainContext);
            for (e = 0; e < users.length; ++e)
                if (b = users[e], !b.dead) {
                    mainContext.lineWidth = 1.2 * outlineWidth;
                    mainContext.strokeStyle = indicatorColor;
                    isOnScreen(b.x - d, b.y - c, b.buildRange) && (mainContext.save(), mainContext.translate(b.x - d, b.y - c), mainContext.rotate(playerBorderRot), renderDottedCircle(0, 0, b.buildRange, mainContext), renderDottedCircle(0, 0, b.startSize, mainContext), mainContext.restore());
                    b.spawnProt && (mainContext.strokeStyle = redColor, mainContext.save(), mainContext.translate(b.x - d, b.y - c), mainContext.rotate(playerBorderRot),
                        renderDottedCircle(0, 0, b.buildRange + 140, mainContext), mainContext.restore());
                    for (var m = 0; m < users.length; ++m) e < m && !users[m].dead && (mainContext.strokeStyle = b.spawnProt || users[m].spawnProt ? redColor : indicatorColor, playersLinked(b, users[m]) && (isOnScreen(b.x - d, b.y - c, 0) || isOnScreen(users[m].x - d, users[m].y - c, 0) || isOnScreen((b.x + users[m].x) / 2 - d, (b.y + users[m].y) / 2 - c, 0)) && (g = UTILS.getDirection(b.x, b.y, users[m].x, users[m].y), renderDottedLine(b.x - (b.buildRange + lanePad + (b.spawnProt ? 140 : 0)) * MathCOS(g) - d, b.y - (b.buildRange +
                        lanePad + (b.spawnProt ? 140 : 0)) * MathSIN(g) - c, users[m].x + (users[m].buildRange + lanePad + (users[m].spawnProt ? 140 : 0)) * MathCOS(g) - d, users[m].y + (users[m].buildRange + lanePad + (users[m].spawnProt ? 140 : 0)) * MathSIN(g) - c, mainContext)))
                }
            mainContext.strokeStyle = darkColor;
            mainContext.lineWidth = 1.2 * outlineWidth;
            for (e = 0; e < units.length; ++e) b = units[e], b.layer || (b.onScreen = !1, isOnScreen(b.x - d, b.y - c, b.size) && (b.onScreen = !0, renderUnit(b.x - d, b.y - c, b.dir, b, playerColors[b.color], mainContext)));
            for (e = 0; e < units.length; ++e) b = units[e],
                1 == b.layer && (b.onScreen = !1, isOnScreen(b.x - d, b.y - c, b.size) && (b.onScreen = !0, renderUnit(b.x - d, b.y - c, b.dir, b, playerColors[b.color], mainContext)));
            mainContext.fillStyle = bulletColor;
            for (e = bullets.length - 1; 0 <= e; --e) {
                b = bullets[e];
                if (b.speed && (b.x += b.speed * a * MathCOS(b.dir), b.y += b.speed * a * MathSIN(b.dir), UTILS.getDistance(b.sX, b.sY, b.x, b.y) >= b.range)) {
                    bullets.splice(e, 1);
                    continue
                }
                isOnScreen(b.x - d, b.y - c, b.size) && renderCircle(b.x - d, b.y - c, b.size, mainContext)
            }
            mainContext.strokeStyle = darkColor;
            mainContext.lineWidth =
                1.2 * outlineWidth;
            for (e = 0; e < users.length; ++e) b = users[e], !b.dead && isOnScreen(b.x - d, b.y - c, b.size) && (renderPlayer(b, b.x - d, b.y - c, mainContext), "unknown" != b.name && (tmpIndx = b.name + "-" + b.size, 20 <= b.size && b.nameSpriteIndx != tmpIndx && (b.nameSpriteIndx = tmpIndx, b.nameSprite = renderText(b.name, b.size / 4)), b.nameSprite && mainContext.drawImage(b.nameSprite, b.x - d - b.nameSprite.width / 2, b.y - c - b.nameSprite.height / 2, b.nameSprite.width, b.nameSprite.height)));
            if (selUnits.length)
                for (e = selUnits.length - 1; 0 <= e; --e) selUnits[e] &&
                    0 > units.indexOf(selUnits[e]) && disableSelUnit(e);
            activeUnit && renderUnit(h, f, k, activeUnit, playerColors[player.color], mainContext);
            showSelector && (mainContext.fillStyle = "rgba(0, 0, 0, 0.1)", h = player.x - d + targetDst * MathCOS(targetDir) + camX, f = player.y - c + targetDst * MathSIN(targetDir) + camY, mainContext.fillRect(mouseStartX, mouseStartY, h - mouseStartX, f - mouseStartY));
            playerBorderRot += a / 5600;
            hoverUnit ? toggleUnitInfo(hoverUnit) : activeBase ? toggleUnitInfo(activeBase, activeBase.sid == player.sid) : activeUnit ? toggleUnitInfo(activeUnit) :
                1 == selUnits.length ? toggleUnitInfo(selUnits[0].info, !0) : toggleUnitInfo()
        }
    };

function renderBackground(a) {
    mainContext.fillStyle = a || backgroundColor;
    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight)
}

function renderCircle(a, d, c, b, g, e) {
    b.beginPath();
    b.arc(a, d, c - b.lineWidth / 2, 0, 2 * Math.PI);
    b.closePath();
    g || b.stroke();
    e || b.fill()
}

function renderDottedCircle(a, d, c, b) {
    b.setLineDash([55, 12]);
    b.beginPath();
    b.arc(a, d, c + b.lineWidth / 2, 0, 2 * Math.PI);
    b.stroke();
    b.setLineDash([])
}

function renderTriangle(a, d, c, b) {
    c -= b.lineWidth / 2;
    d -= c / 4;
    b.beginPath();
    b.moveTo(a, d - c);
    b.lineTo(a + c, d + c);
    b.lineTo(a - c, d + c);
    b.closePath();
    b.stroke();
    b.fill()
}

function renderAgon(a, d, c, b, g) {
    a = 2 * MathPI / g;
    b.beginPath();
    b.moveTo(c, 0);
    for (d = 1; d < g; d++) b.lineTo(c * MathCOS(a * d), c * MathSIN(a * d));
    b.closePath();
    b.stroke();
    b.fill()
}

function renderSquare(a, d, c, b) {
    c -= b.lineWidth / 2;
    b.strokeRect(a - c, d - c, 2 * c, 2 * c);
    b.fillRect(a - c, d - c, 2 * c, 2 * c)
}

function renderRect(a, d, c, b, g) {
    g.strokeRect(a - c / 2, d - b / 2, c, b);
    g.fillRect(a - c / 2, d - b / 2, c, b)
}

function renderRectCircle(a, d, c, b, g, e) {
    c -= e.lineWidth / 2;
    e.save();
    e.translate(a, d);
    g = Math.ceil(g / 2);
    for (a = 0; a < g; a++) renderRect(0, 0, 2 * c, b, e), e.rotate(MathPI / g);
    e.restore()
}

function renderStar(a, d, c, b, g, e) {
    c -= g.lineWidth / 2;
    a = MathPI / 2 * 3;
    d = MathPI / e;
    g.beginPath();
    g.moveTo(0, -c);
    for (var h = 0; h < e; h++) g.lineTo(MathCOS(a) * c, MathSIN(a) * c), a += d, g.lineTo(MathCOS(a) * b, MathSIN(a) * b), a += d;
    g.lineTo(0, -c);
    g.closePath();
    g.stroke();
    g.fill()
}

function renderDottedLine(a, d, c, b, g) {
    g.setLineDash([55, 12]);
    g.beginPath();
    g.moveTo(a, d);
    g.lineTo(c, b);
    g.stroke();
    g.setLineDash([])
}

function renderText(a, d) {
    var c = document.createElement("canvas"),
        b = c.getContext("2d");
    b.font = d + "px regularF";
    var g = b.measureText(a);
    c.width = g.width + 20;
    c.height = 2 * d;
    b.translate(c.width / 2, c.height / 2);
    b.font = d + "px regularF";
    b.fillStyle = "#ffffff";
    b.textBaseline = "middle";
    b.textAlign = "center";
    b.strokeStyle = darkColor;
    b.lineWidth = outlineWidth;
    b.strokeText(a, 0, 0);
    b.fillText(a, 0, 0);
    return c
}
var iconSizeMult = .7,
    unitSprites = [];

function renderUnit(a, d, c, b, g, e, h) {
    var f = b.size * (h ? iconSizeMult : 1),
        k = f + ":" + b.cloak + ":" + b.renderIndex + ":" + b.iSize + ":" + b.turretIndex + ":" + b.shape + ":" + g;
    if (!unitSprites[k]) {
        var m = document.createElement("canvas"),
            l = m.getContext("2d");
        m.width = 2 * f + 30;
        m.height = m.width;
        m.style.width = m.width + "px";
        m.style.height = m.height + "px";
        l.translate(m.width / 2, m.height / 2);
        l.lineWidth = outlineWidth * (h ? .9 : 1.2);
        l.strokeStyle = darkColor;
        l.fillStyle = g;
        4 == b.renderIndex ? l.fillStyle = turretColor : 5 == b.renderIndex && (l.fillStyle = turretColor,
            renderRect(0, .76 * f, 1.3 * f, f / 2.4, l), l.fillStyle = g);
        b.cloak && (l.fillStyle = backgroundColor);
        "circle" == b.shape ? (renderCircle(0, 0, f, l), b.iSize && (l.fillStyle = turretColor, renderCircle(0, 0, f * b.iSize, l))) : "triangle" == b.shape ? (renderTriangle(0, 0, f, l), b.iSize && (l.fillStyle = turretColor, renderTriangle(0, 2, f * b.iSize, l))) : "hexagon" == b.shape ? (renderAgon(0, 0, f, l, 6), b.iSize && (l.fillStyle = turretColor, renderAgon(0, 0, f * b.iSize, l, 6))) : "octagon" == b.shape ? (l.rotate(MathPI / 8), renderAgon(0, 0, .96 * f, l, 8), b.iSize && (l.fillStyle =
            turretColor, renderAgon(0, 0, .96 * f * b.iSize, l, 8))) : "pentagon" == b.shape ? (l.rotate(-MathPI / 2), renderAgon(0, 0, 1.065 * f, l, 5), b.iSize && (l.fillStyle = turretColor, renderAgon(0, 0, 1.065 * f * b.iSize, l, 5))) : "square" == b.shape ? (renderSquare(0, 0, f, l), b.iSize && (l.fillStyle = turretColor, renderSquare(0, 0, f * b.iSize, l))) : "spike" == b.shape ? renderStar(0, 0, f, .7 * f, l, 8) : "star" == b.shape && (f *= 1.2, renderStar(0, 0, f, .7 * f, l, 6));
        if (1 == b.renderIndex) l.fillStyle = turretColor, renderRect(f / 2.8, 0, f / 4, f / 1, l), renderRect(-f / 2.8, 0, f / 4, f / 1, l);
        else if (2 ==
            b.renderIndex) l.fillStyle = turretColor, renderRect(f / 2.5, f / 2.5, f / 2.5, f / 2.5, l), renderRect(-f / 2.5, f / 2.5, f / 2.5, f / 2.5, l), renderRect(f / 2.5, -f / 2.5, f / 2.5, f / 2.5, l), renderRect(-f / 2.5, -f / 2.5, f / 2.5, f / 2.5, l);
        else if (3 == b.renderIndex) l.fillStyle = turretColor, l.rotate(MathPI / 2), renderRectCircle(0, 0, .75 * f, f / 2.85, 3, l), renderCircle(0, 0, .5 * f, l), l.fillStyle = g;
        else if (6 == b.renderIndex) l.fillStyle = turretColor, l.rotate(MathPI / 2), renderRectCircle(0, 0, .7 * f, f / 4, 5, l), l.rotate(-MathPI / 2), renderAgon(0, 0, .4 * f, l, 6);
        else if (7 == b.renderIndex)
            for (g =
                0; 3 > g; ++g) l.fillStyle = g ? 1 == g ? "#93e865" : "#a2ff6f" : "#89d95f", renderStar(0, 0, f, .7 * f, l, 7), f *= .55;
        else 8 == b.renderIndex && (l.fillStyle = turretColor, renderRectCircle(0, 0, .75 * f, f / 2.85, 3, l), renderSquare(0, 0, .5 * f, l));
        1 != b.type && b.turretIndex && renderTurret(0, 0, b.turretIndex, h ? iconSizeMult : 1, -(MathPI / 2), l);
        unitSprites[k] = m
    }
    f = unitSprites[k];
    e.save();
    e.translate(a, d);
    e.rotate(c + MathPI / 2);
    e.drawImage(f, -(f.width / 2), -(f.height / 2), f.width, f.height);
    1 == b.type && b.turretIndex && renderTurret(0, 0, b.turretIndex, h ? iconSizeMult :
        1, b.turRot - MathPI / 2 - c, e);
    e.restore()
}

function updateUnitPosition(a) {
    if (a.paths && a.paths.length) {
        var d = a.speed * (currentTime - a.startTime);
        a.x = a.sX;
        a.y = a.sY;
        updatePath(a, d, 0)
    } else void 0 != a.lastX && void 0 != a.lastY && (a.x = a.lastX, a.y = a.lastY)
}

function updatePath(a, d) {
    if (a.paths[1]) {
        a.dir = a.paths[0];
        var c = a.paths[1],
            c = c - d;
        0 < c ? (a.x += d * MathCOS(a.dir), a.y += d * MathSIN(a.dir)) : (c *= -1, a.x += a.paths[1] * MathCOS(a.dir), a.y += a.paths[1] * MathSIN(a.dir), a.startTime += a.paths[1] / a.speed, a.paths.splice(0, 2), updatePath(a, c));
        a.lastX = a.x;
        a.lastY = a.y
    }
}
var turretSprites = [];

function renderTurret(a, d, c, b, g, e) {
    var h = c + ":" + b;
    if (!unitSprites[h]) {
        var f = document.createElement("canvas"),
            k = f.getContext("2d");
        f.width = 90 * b;
        f.height = f.width;
        f.style.width = f.width + "px";
        f.style.height = f.height + "px";
        k.translate(f.width / 2, f.height / 2);
        k.lineWidth = outlineWidth * (1 != b ? .9 : 1.2);
        k.strokeStyle = darkColor;
        k.fillStyle = turretColor;
        2 == c ? (c = 14 * b, k.strokeRect(0, -(c / 2.3), 1.9 * c, c / 1.15), k.fillRect(0, -(c / 2.3), 1.9 * c, c / 1.15), k.strokeRect(0, -(c / 2), 1.4 * c, c), k.fillRect(0, -(c / 2), 1.4 * c, c)) : 3 == c ? (c = 15 * b, k.strokeRect(0, -(c / 2), 2.2 * c, c), k.fillRect(0, -(c / 2), 2.2 * c, c)) : 4 == c ? (c = 17 * b, k.strokeRect(0, -(c / 2), 2.1 * c, c), k.fillRect(0, -(c / 2), 2.1 * c, c)) : 5 == c ? (c = 17 * b, k.strokeRect(0, -(c / 2.3), 2.2 * c, c / 1.15), k.fillRect(0, -(c / 2.3), 2.2 * c, c / 1.15), k.strokeRect(0, -(c / 2), 1.5 * c, c), k.fillRect(0, -(c / 2), 1.5 * c, c)) : 6 == c ? (c = 18 * b, k.strokeRect(0, -(c / 2), 2.1 * c, c), k.fillRect(0, -(c / 2), 2.1 * c, c), k.strokeRect(1.5 * c, -(c / 1.6), c / 1.4, c / 1.6 * 2), k.fillRect(1.5 * c, -(c / 1.6), c / 1.4, c / 1.6 * 2)) : 7 == c ? (c = 14 * b, k.strokeRect(0, -(c / 2), 2 * c, c), k.fillRect(0, -(c / 2), 2 * c, c), k.beginPath(),
            k.moveTo(0, 0), k.lineTo(2.1 * c, 0), k.stroke()) : 8 == c ? (c = 12 * b, k.strokeRect(0, -(c / 2), 1.8 * c, c), k.fillRect(0, -(c / 2), 1.8 * c, c)) : 9 == c ? (c = 20 * b, k.strokeRect(0, -(c / 2), 1.9 * c, c), k.fillRect(0, -(c / 2), 1.9 * c, c)) : 10 == c ? (c = 15 * b, k.strokeRect(0, -(c / 2), 2.6 * c, c), k.fillRect(0, -(c / 2), 2.6 * c, c), k.strokeRect(-7, 1.2 * -c, 14, 2.4 * c), k.fillRect(-7, 1.2 * -c, 14, 2.4 * c)) : (c = 14 * b, k.strokeRect(0, -(c / 2), 1.8 * c, c), k.fillRect(0, -(c / 2), 1.8 * c, c));
        renderCircle(0, 0, c, k);
        unitSprites[h] = f
    }
    h = unitSprites[h];
    e.save();
    e.translate(a, d);
    e.rotate(g);
    e.drawImage(h, -(h.width / 2), -(h.height / 2), h.width, h.height);
    e.restore()
}
var skinSprites = [];

function renderPlayer(a, d, c, b, g) {
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
    }
    a.skin && skinSprites[a.skin] && skinSprites[a.skin].readyToDraw ? (e = a.size - b.lineWidth / 4, b.drawImage(skinSprites[a.skin], d - e, c - e, 2 * e, 2 * e), b.lineWidth /= 2, renderCircle(d, c, a.size, b, !1, !0)) : g || (b.fillStyle = playerColors[a.color], renderCircle(d,
        c, a.size, b));
    b.restore()
}

function updateMenuLoop(a) {
    1 != gameState && (insturctionsCountdown -= a, 0 >= insturctionsCountdown && (insturctionsCountdown = instructionsSpeed, instructionsText.innerHTML = instructionsList[instructionsIndex], instructionsIndex++, instructionsIndex >= instructionsList.length && (instructionsIndex = 0)))
}

function sendUnit(a) {
    socket && gameState && activeUnit && !activeUnit.dontPlace && socket.emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a)
}

function upgradeUnit(a) {
    socket && gameState && (1 == selUnits.length ? socket.emit("4", selUnits[0].id, a) : activeBase && activeBase.sid == player.sid && socket.emit("4", 0, a, 1))
}

function updateTarget() {
    player && !player.dead && (targetDir = MathATAN2(mouseY - screenHeight / 2, mouseX - screenWidth / 2), targetDst = MathSQRT(MathPOW(mouseY - screenHeight / 2, 2) + MathPOW(mouseX - screenWidth / 2, 2)), targetDst *= MathMIN(maxScreenWidth / screenWidth, maxScreenHeight / screenHeight))
}

function updateCameraInput() {
    camXS = cameraKeys.l + cameraKeys.r;
    camYS = cameraKeys.u + cameraKeys.d;
    var a = MathSQRT(camXS * camXS + camYS * camYS);
    0 != a && (camXS /= a, camYS /= a)
}

function playersLinked(a, d) {
    return UTILS.getDistance(a.x, a.y, d.x, d.y) <= gameData.gridSpace
}

function getUserBySID(a) {
    for (var d = 0; d < users.length; ++d)
        if (users[d].sid == a) return d;
    return null
}

function getUnitById(a) {
    for (var d = 0; d < units.length; ++d)
        if (units[d].id == a) return d;
    return null
}
var kickReason = null;

function kickPlayer(a) {
    leaveGame();
    kickReason || (kickReason = a);
    showMainMenuText(kickReason);
    socket.close();
    hasStorage && firstCid && localStorage.setItem("cid", 0)
}

function showMainMenuText(a) {
    userInfoContainer.style.display = "none";
    loadingContainer.style.display = "block";
    loadingContainer.innerHTML = a
}

function hideMainMenuText() {
    userInfoContainer.style.display = "block";
    loadingContainer.style.display = "none"
}

function toggleGameUI(a) {
    gameUiContainer.style.display = a ? "block" : "none"
}

function toggleMenuUI(a) {
    a ? (menuContainer.style.display = "flex", darkener.style.display = "block", linksContainer.style.display = "block") : (menuContainer.style.display = "none", darkener.style.display = "none", linksContainer.style.display = "none")
}
window.addEventListener("resize", resize);

function resize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    scaleFillNative = MathMAX(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight);
    mainCanvas.width = screenWidth;
    mainCanvas.height = screenHeight;
    mainCanvas.style.width = screenWidth + "px";
    mainCanvas.style.height = screenHeight + "px";
    mainContext.setTransform(scaleFillNative, 0, 0, scaleFillNative, Math.floor((screenWidth - maxScreenWidth * scaleFillNative) / 2), Math.floor((screenHeight - maxScreenHeight * scaleFillNative) / 2));
    player || renderBackground()
}
window.requestAnimFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a, d) {
        window.setTimeout(a, 1E3 / targetFPS)
    }
}();
var then = window.performance.now();

function callUpdate() {
    requestAnimFrame(callUpdate);
    currentTime = window.performance.now();
    var a = currentTime - then;
    then = currentTime;
    updateGameLoop(a);
    updateMenuLoop(a)
}
resize();
renderBackground();
callUpdate();