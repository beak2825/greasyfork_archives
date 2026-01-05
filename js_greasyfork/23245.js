document.getElementById("miniMapPlayer").outerHTML += '<canvas style="position:relative;"width=600 height=800 id="minimapNodes"></canvas>';
var doSimpleSplix = false;
var shadowSplix = false;
var oldColors = {
    grey: {
        BG: "#3a342f",
        brighter: "#4e463f",
        darker: "#2d2926",
        diagonalLines: "#c7c7c7"
    },
    red: {
        brighter: "#a22929",
        darker: "#7b1e1e",
        slightlyBrighter: "#af2c2c",
        pattern: "#8c2222",
        patternEdge: "#631717",
        boundsDark: "#420707",
        boundsBright: "#4c0808"
    },
    red2: {
        brighter: "#E3295E",
        darker: "#B3224B",
        slightlyBrighter: "#F02B63",
        pattern: "#CC2554",
        patternEdge: "#9C1C40"
    },
    pink: {
        brighter: "#A22974",
        darker: "#7A1F57",
        pattern: "#8A2262",
        patternEdge: "#5E1743",
        slightlyBrighter: "#B02C7E"
    },
    pink2: {
        brighter: "#7D26EF",
        darker: "#5E1DBA",
        pattern: "#6A21D1",
        patternEdge: "#4C1896",
        slightlyBrighter: "#882DFF"
    },
    purple: {
        brighter: "#531880",
        darker: "#391058",
        pattern: "#4b1573",
        patternEdge: "#3b115a",
        slightlyBrighter: "#5a198c"
    },
    blue: {
        brighter: "#27409c",
        darker: "#1d3179",
        pattern: "#213786",
        patternEdge: "#1b2b67",
        slightlyBrighter: "#2a44a9"
    },
    blue2: {
        brighter: "#3873E0",
        darker: "#2754A3",
        pattern: "#2F64BF",
        patternEdge: "#1F4587",
        slightlyBrighter: "#3B79ED"
    },
    green: {
        brighter: "#2ACC38",
        darker: "#1C9626",
        pattern: "#24AF30",
        patternEdge: "#178220",
        slightlyBrighter: "#2FD63D"
    },
    green2: {
        brighter: "#1e7d29",
        darker: "#18561f",
        pattern: "#1a6d24",
        patternEdge: "#14541c",
        slightlyBrighter: "#21882c"
    },
    leaf: {
        brighter: "#6a792c",
        darker: "#576325",
        pattern: "#5A6625",
        patternEdge: "#454F1C",
        slightlyBrighter: "#738430"
    },
    yellow: {
        brighter: "#d2b732",
        darker: "#af992b",
        pattern: "#D1A932",
        patternEdge: "#B5922B",
        slightlyBrighter: "#e6c938"
    },
    orange: {
        brighter: "#d06c18",
        darker: "#ab5a15",
        pattern: "#AF5B16",
        patternEdge: "#914A0F",
        slightlyBrighter: "#da7119"
    },
    shadowSplix: {
        brighter: "#000",
        darker: "#000",
        pattern: "#AF5B16",
        patternEdge: "#000",
        slightlyBrighter: "#da7119"
    },
};
var simpleColors = {
    grey: {
        BG: "#3a342f",
        brighter: "#3a342f",
        darker: "#3a342f",
        diagonalLines: "#3a342f"
    },
    red: {
        brighter: "#a22929",
        darker: "#7b1e1e",
        slightlyBrighter: "#af2c2c",
        pattern: "#8c2222",
        patternEdge: "#631717",
        boundsDark: "#420707",
        boundsBright: "#4c0808"
    },
    red2: {
        brighter: "#E3295E",
        darker: "#E3295E",
        slightlyBrighter: "#F02B63",
        pattern: "#F02B63",
        patternEdge: "#F02B63"
    },
    pink: {
        brighter: "#A22974",
        darker: "#A22974",
        pattern: "#8A2262",
        patternEdge: "#8A2262",
        slightlyBrighter: "#8A2262"
    },
    pink2: {
        brighter: "#7D26EF",
        darker: "#7D26EF",
        pattern: "#6A21D1",
        patternEdge: "#6A21D1",
        slightlyBrighter: "#6A21D1"
    },
    purple: {
        brighter: "#531880",
        darker: "#531880",
        pattern: "#4b1573",
        patternEdge: "#4b1573",
        slightlyBrighter: "#4b1573"
    },
    blue: {
        brighter: "#27409c",
        darker: "#27409c",
        pattern: "#213786",
        patternEdge: "#213786",
        slightlyBrighter: "#213786"
    },
    blue2: {
        brighter: "#3873E0",
        darker: "#3873E0",
        pattern: "#2F64BF",
        patternEdge: "#2F64BF",
        slightlyBrighter: "#2F64BF"
    },
    green: {
        brighter: "#2ACC38",
        darker: "#2ACC38",
        pattern: "#24AF30",
        patternEdge: "#24AF30",
        slightlyBrighter: "#24AF30"
    },
    green2: {
        brighter: "#1e7d29",
        darker: "#1e7d29",
        pattern: "#1a6d24",
        patternEdge: "#1a6d24",
        slightlyBrighter: "#1a6d24"
    },
    leaf: {
        brighter: "#6a792c",
        darker: "#576325",
        pattern: "#5A6625",
        patternEdge: "#454F1C",
        slightlyBrighter: "#738430"
    },
    yellow: {
        brighter: "#d2b732",
        darker: "#d2b732",
        pattern: "#D1A932",
        patternEdge: "#D1A932",
        slightlyBrighter: "#D1A932"
    },
    orange: {
        brighter: "#d06c18",
        darker: "#d06c18",
        pattern: "#AF5B16",
        patternEdge: "#AF5B16",
        slightlyBrighter: "#AF5B16"
    },
    shadowSplix: {
        brighter: "#000",
        darker: "#000",
        pattern: "#AF5B16",
        patternEdge: "#000",
        slightlyBrighter: "#da7119"
    },
};
minimapNodesCTX = document.getElementById("minimapNodes").getContext("2d");
overrideServer = {
    override: false,
    ip: ""
};
$("#miniMapPlayer").hide();
$("#minimapCanvas").hide();
$("#tutorialCanvas").hide();
document.body.addEventListener("mousewheel", handleZoom, true);

function handleZoom(event) {
    window["BLOCKS_ON_SCREEN"] *= Math.pow(0.8, event.wheelDelta / 100);


}
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) {
        r = w / 2;
    }
    if (h < 2 * r) {
        r = h / 2;
    }
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};

function updateMinimap() {
    try {
        minimapNodesCTX.clearRect(0, 0, minimapNodes.width, minimapNodes.height);
        for (var i = 0; i < players.length; i++) {
            if (!players[i].isDead) {

                var x = players[i].pos[0] / mapSize * 160 + 1.5 - 14;
                var y = players[i].pos[1] / mapSize * 160 + 1.5 - 14;
                minimapNodesCTX.beginPath();
                minimapNodesCTX.roundRect(x, y, 7, 7, 2);
                minimapNodesCTX.lineWidth = 1.3;
                minimapNodesCTX.strokeStyle = "#000";
                minimapNodesCTX.stroke();
                minimapNodesCTX.fillStyle = "#fff";
                minimapNodesCTX.fill();
                minimapNodesCTX.fillText(players[i].name, x - 10, y + 20)
            }
        }
    } catch (e) {}
}
var minimapInterval = setInterval(function() {
    updateMinimap();
}, 100)
MAX_ZOOM = 100000

_getServer = getServer;
getServer = function() {
    if (overrideServer.override) {
        return {
            ip: "ws://" + overrideServer.ip + "/splix",
            ping: 1
        };
        $("#serverIpHolder")[0].innerHTML = "Server Ip: " + overrideServer.ip.split("ws://")[1].split("/splix")[0]
        overrideServer.override = false;
    } else {
        a = _getServer();
        $("#serverIpHolder")[0].innerHTML = "Server Ip: " + a.ip.split("ws://")[1].split("/splix")[0]
        return a;
    }
}
_startPingServers = startPingServers
startPingServers = function() {
    //$("#serverIp").val(getServer().ip)
    _startPingServers();
}
window.connectToSplixServer = function() {
    overrideServer.override = true;
    overrideServer.ip = $(".serverIp").val();
    connectWithTransition();
}
window.createParty = function() {
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;
    var bestServer;
    myArray = servers
    for (var i = myArray.length - 1; i >= 0; i--) {
        tmp = myArray[i].avgPing;
        if (tmp < lowest) lowest = tmp;
        if (tmp > highest) highest = tmp;
        bestPingServer = myArray[i]
    }
    console.log(lowest);
	console.log(bestPingServer, server)
    var server = randFromArray(bestPingServer.gamemodes[0].versions)
    var lobby = randFromArray(server.lobbies)
    window.location.hash = lobby.hash
    $("#serverToken").val(window.location.hash)
    return lobby;
}
window.joinParty = function() {
    var server = $("#serverToken").val()
    if (server.indexOf("http://") !== -1) {
        var newServer = server.split("http://splix.io/")[1];
        $("#serverToken").val(newServer)
        window.location.hash = newServer;
    } else {
        window.location.hash = server
    }

}
window.toggleSimpleSplix = function() {
    doSimpleSplix = !doSimpleSplix;
    switch (doSimpleSplix) {
        case true:
            colors = simpleColors;
            break;
        case false:
            colors = oldColors;
            break;
    }
}

window.toggleShadowSplix = function() {
    console.log('toggline')
    shadowSplix = !shadowSplix;
    console.log(shadowSplix)
    if (shadowSplix == true) {
        console.log('Is true')
        colors = oldColors
        window.createInterval();
    } else {
        clearInterval(splixInterval);
    }
}
window.createInterval = function() {
    window.splixInterval = setInterval(function() {
        console.log('Test')
        if (players[0]) {
            players[0].skinBlock = 12
        }
    }, 500)
}

window.getColorForBlockSkinId = function(a) {
    switch (a) {
        case 0:
            return colors.red;
        case 1:
            return colors.red2;
        case 2:
            return colors.pink;
        case 3:
            return colors.pink2;
        case 4:
            return colors.purple;
        case 5:
            return colors.blue;
        case 6:
            return colors.blue2;
        case 7:
            return colors.green;
        case 8:
            return colors.green2;
        case 9:
            return colors.leaf;
        case 10:
            return colors.yellow;
        case 11:
            return colors.orange;
        case 12:
            return colors.shadowSplix
        default:
            return {
                brighter: "#000000",
                darker: "#000000",
                slightlyBrighter: "#000000"
            };
    }
}
$("#leaderboard").append("<h1>ⓈplixPlus.io</h1><p style='-moz-user-select: text; -khtml-user-select: text; -webkit-user-select: text; -ms-user-select: text; user-select: text;' id='serverIpHolder'>Server Ip: </p>");
$('<br> <br><form id="splixxPlusForm"class="fancyBox greenBox"style="display:inline-block;margin-left:auto;margin-right:auto;padding:30px"method="get"><input type="text"style="border:0;outline:0;font-size:20px;padding:8px;box-shadow:1px 1px #155a1c,2px 2px #155a1c,3px 3px #155a1c,4px 4px #155a1c,5px 5px #155a1c,10px 10px 20px rgba(0,0,0,.2);margin:5px;-webkit-appearance:none;width: 120px"class="fancyBox serverIp"maxlength="50"id="serverToken"placeholder="Token"><input type="button"class="fancyBox"id="joinButton"value="Join"onclick="window.joinParty()"><input type="button"class="fancyBox"id="joinButton"value="Create"onclick="window.createParty()"><h2 style="font-size: 30px">Simple Splix<input type="checkbox"style="transform: scale(1.5)"onclick="window.toggleSimpleSplix();"></h2><h2 style="font-size: 30px">Shadow Mode<input type="checkbox"style="transform: scale(1.5)"onclick="window.toggleShadowSplix()"></h2><div id="splxxPlusMessage"style="width:300px"></div></form>').insertAfter("#nameForm")