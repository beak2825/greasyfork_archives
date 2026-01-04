// ==UserScript==
// @name         Chat Scroll - Alert - Instafind
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  chat
// @author       Neutrox
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465985/Chat%20Scroll%20-%20Alert%20-%20Instafind.user.js
// @updateURL https://update.greasyfork.org/scripts/465985/Chat%20Scroll%20-%20Alert%20-%20Instafind.meta.js
// ==/UserScript==

//instafind//
window.chatListWrapper.style.pointerEvents = 'auto';
window.leaderboardList.style.pointerEvents = 'auto';

window.goToBase = function(id) {
    let xX = [];
    let yY = [];
    for(let i = 0; i < users.length; i++){
        if(users[i].sid == id){
            xX.push(users[i].x)
            yY.push(users[i].y)
        }
    }
    if (xX.length > 0 && yY.length > 0) {
        camX = xX[0] - player.x;
        camY = yY[0] - player.y;
    }
}

window.addChatLine = (a, d, c) => {
    if (player) {
        var b = getUserBySID(a);
        if (c || 0 <= b) {
            var g = c ? "SERVER" : users[b].name;
            c = c ? "#fff" : playerColors[users[b].color] ? playerColors[users[b].color] : playerColors[0];
            player.sid == a && (c = "#fff");
            b = document.createElement("li");
            b.className = player.sid == a ? "chatme" : "chatother";
            b.innerHTML = '<span style="color:' + c + '" onclick=goToBase(' + a + ');>[' + g + ']</span> <span class="chatText">' + d + "</span>";
            25 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
            chatList.appendChild(b)
        }
    }
}

window.addChat = (msg, cor) => {
    var b = document.createElement("li");
    b.innerHTML = '<span class="chatText" style="color: ' + cor + ';">' + msg + "</span>";
    chatList.appendChild(b)
}

//scroll chat//
const chatElement = document.getElementById('chatList');

chatElement.addEventListener('wheel', (event) => {
  event.stopPropagation();
});

var css2 = document.createElement("style")
css2.innerText = `
#chatListWrapper {
	background-color: rgba(60, 60, 60, 0.6);
	border-radius: 4px 4px 0px 0px;
	height: 215px;
	overflow: visible;
}
#chatList{
	width: 100%;
    font-family: "regularF";
    padding: 8px;
    margin: 0;
    list-style: none;
    box-sizing: border-box;
    color: #fff;
    overflow: hidden;
    word-wrap: break-word;
    position: absolute;
    bottom: 30px;
    font-size: 16px;
    line-height: 23px;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 88%;\n\
}
::-webkit-scrollbar {
  width: 10px;
  background-color: #00000000;
}

::-webkit-scrollbar-thumb {
  background-color: #00000080;
}
`
document.head.appendChild(css2)

var chatList = document.querySelector('#chatList');

var observer = new MutationObserver(function(mutations) {
    var newElementsAdded = false;
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
            newElementsAdded = true;
        }
    });

    if (newElementsAdded) {
        chatrolagem();
    }
});

var observerConfig = { childList: true };
observer.observe(chatList, observerConfig);

function chatrolagem() {
    var chatList = document.querySelector('#chatList');
    var isNearBottom = chatList.scrollHeight - chatList.clientHeight - chatList.scrollTop <= 150;
    if (isNearBottom) {
        chatList.scrollTop = chatList.scrollHeight - chatList.clientHeight;
    }
}

window.setupSocket = () => {
    socket.on("connect_error", function() {lobbyURLIP ? kickPlayer("Connection failed. Please check your lobby ID") : kickPlayer("Connection failed. Check your internet and firewall settings")});
    socket.on("disconnect", function(a) {kickPlayer("Disconnected.")});
    socket.on("error", function(a) {kickPlayer("Disconnected. The server may have updated.")});
    socket.on("kick", function(a) {kickPlayer(a)});
    socket.on("lk", function(a) {partyKey = a});
    socket.on("spawn", function() { gameState = 1; unitList = share.getUnitList(); resetCamera(); toggleMenuUI(!1); toggleGameUI(!0); updateUnitList(); player.upgrades = share.getBaseUpgrades();mainCanvas.focus()});
    socket.on("gd", function(a) {gameData = a});
    socket.on("mpd", function(a) {mapBounds = a});
    socket.on("ch", function(a, d, c) {addChatLine(a, d, c)});
    socket.on("setUser", function(a, d) { if (a && a[0]) { var c = getUserBySID(a[0]), b = { sid: a[0], name: a[1], iName: "Headquarters", dead: !1, color: a[2], size: a[3], startSize: a[4], x: a[5], y: a[6], buildRange: a[7], gridIndex: a[8], spawnProt: a[9], skin: a[10], desc: "Base of operations of " + a[1], kills: 0, typeName: "Base" }; null != c ? (users[c] = b, d && (player = users[c])) : (users.push(b), d && (player = users[users.length - 1]));}});
    socket.on("klUser", function(a) {var d = getUserBySID(a);null != d && (users[d].dead = !0);player && player.sid == a && (hideMainMenuText(), leaveGame())});
    socket.on("delUser", function(a) {a = getUserBySID(a);null != a && users.splice(a, 1)});
    socket.on("au", function(a) { a && (units.push({ id: a[0], owner: a[1], uPath: a[2] || 0, type: a[3] || 0, color: a[4] || 0, paths: a[5], x: a[6] || 0, sX: a[6] || 0, y: a[7] || 0, sY: a[7] || 0, dir: a[8] || 0, dst: UTILS.roundToTwo(UTILS.getDistance(player.x, player.y, a[6], a[7])), turRot: a[8] || 0, speed: a[9] || 0, renderIndex: a[10] || 0, turretIndex: a[11] || 0, range: a[12] || 0, cloak: a[13] || 0 }), units[units.length - 1].speed && (units[units.length - 1].startTime = window.performance.now()), a = getUnitFromPath(units[units.length - 1].uPath)) && (units[units.length - 1].size = a.size, units[units.length - 1].shape = a.shape, units[units.length - 1].layer = a.layer, units[units.length - 1].renderIndex || (units[units.length - 1].renderIndex = a.renderIndex), units[units.length - 1].range || (units[units.length - 1].range = a.range), units[units.length - 1].turretIndex || (units[units.length - 1].turretIndex = a.turretIndex), units[units.length - 1].iSize = a.iSize) });
    socket.on("spa", function(a, d, c, b) { a = getUnitById(a); if (null != a) { var g = UTILS.getDistance(d, c, units[a].x || d, units[a].y || c); 300 > g && g ? (units[a].interpDst = g, units[a].interpDstS = g, units[a].interpDir = UTILS.getDirection(d, c, units[a].x || d, units[a].y || c)) : (units[a].interpDst = 0, units[a].interpDstS = 0, units[a].interpDir = 0, units[a].x = d, units[a].y = c); units[a].interX = 0; units[a].interY = 0; units[a].sX = units[a].x || d; units[a].sY = units[a].y || c; b[0] && (units[a].dir = b[0], units[a].turRot = b[0]); units[a].paths = b; units[a].startTime = window.performance.now()}});
    socket.on("uc", function(a, d) {unitList && (unitList[a].count = d);forceUnitInfoUpdate = !0});
    socket.on("uul", function(a, d) {unitList && (unitList[a].limit += d)});
    socket.on("rpu", function(a, d) {var c = getUnitFromPath(a);c && (c.dontShow = d, forceUnitInfoUpdate = !0)});
    socket.on("sp", function(a, d) { var c = getUserBySID(a); if (null != c) { users[c].spawnProt = d; var playerName = users[c].name; var playerSid = users[c].sid; var message = '<a href="#" onclick="goToBase(\'' + playerSid + '\')" style="color: ' + playerColors[users[c].color] + ';">' + playerName + '</a> left the base.'; addChat(message, playerColors[users[c].color]); } });
    socket.on("ab", function(a) { a && bullets.push({ x: a[0], sX: a[0], y: a[1], sY: a[1], dir: a[2], speed: a[3], size: a[4], range: a[5] }) });
    socket.on("uu", function(a, d) {if (void 0 != a && d) {var c = getUnitById(a);if (null != c)for (var b = 0; b < d.length;) units[c][d[b]] = d[b + 1], "dir" == d[b] && (units[c].turRot = d[b + 1]), b += 2}});
    socket.on("du", function(a) {a = getUnitById(a);null != a && units.splice(a, 1)});
    socket.on("sz", function(a, d) {var c = getUserBySID(a);null != c && (users[c].size = d)});
    socket.on("pt", function(a) {scoreContainer.innerHTML = "Power <span class='greyMenuText'>" + a +"/6000</span>"; player.power = a});
    socket.on("l", function(a) {for (var d = "", c = 1, b = 0; b < a.length;) d += "<div class='leaderboardItem' onclick=goToBase(" + a[b] + ");><div style='display:inline-block;float:left;' class='whiteText'>" + c + ".</div> <div class='" + (player && a[b] == player.sid ? "leaderYou" : "leader") + "'>" + a[b + 1] + "</div><div class='scoreText'>" + a[b + 2] + "</div></div>", c++, b += 3;leaderboardList.innerHTML = d})
}
