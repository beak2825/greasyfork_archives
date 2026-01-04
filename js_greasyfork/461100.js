// ==UserScript==
// @name         florr.io | Server Switcher
// @namespace    https://github.com/Samer-Kizi
// @version      2.4
// @description  Shows current server you are in & Easily switch server
// @author       Furaken
// @license      MIT
// @match        https://florr.io/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/461100/florrio%20%7C%20Server%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/461100/florrio%20%7C%20Server%20Switcher.meta.js
// ==/UserScript==

var totalServers = 7,
    position = "-200px"

let url;
const nativeWebSocket = unsafeWindow.WebSocket;
unsafeWindow.WebSocket = function(...args) {
    const socket = new nativeWebSocket(...args);
    url = socket.url
    return socket;
};

let cp6 = unsafeWindow.cp6

function updateServers() {
    for (let i = 0; i < totalServers; i++) {
        fetch(`https://api.n.m28.io/endpoint/florrio-map-${i}-green/findEach/`).then((response) => response.json()).then((data) => {
            if (servers[matrixs[i]] == null) {
                servers[matrixs[i]] = {
                    NA: {},
                    EU: {},
                    AS: {}
                }
            }
            servers[matrixs[i]].NA[data.servers["vultr-miami"].id] = Math.floor(Date.now() / 1000)
            servers[matrixs[i]].EU[data.servers["vultr-frankfurt"].id] = Math.floor(Date.now() / 1000)
            servers[matrixs[i]].AS[data.servers["vultr-tokyo"].id] = Math.floor(Date.now() / 1000)
        });
    }
    for (const [keyMatrix, valueMatrix] of Object.entries(servers)) {
        for (const [keyServer, valueServer] of Object.entries(valueMatrix)) {
            for (const [keyId, valueId] of Object.entries(valueServer)) {
                if (Math.floor(Date.now() / 1000) - valueId > 5 * 60) delete servers[keyMatrix][keyServer][keyId]
            }
        }
    }
}
var servers = {},
    matrixs = ["Garden", "Desert", "Ocean", "Jungle", "Ant Hell", "Hel", "Sewers"]
updateServers()
setInterval(() => {
    updateServers()
    getServerId()
}, 5 * 1000)

var message = `Click on cp6 a server code to connect to that server.<br>Press <w style="color: #f5945c">\`</w> (backquote) key to toggle this menu.<br><w onclick='window.open("https://discord.gg/tmWUfg4FR9");' style="color: #5567f1">Discord</w>`

var container = document.createElement('div')
container.style = `
    width: 500px;
    height: auto;
    z-index: 1;
    background: rgba(0, 0, 0, 0.5);
    position: relative;
    border-radius: 10px;
    margin: 0 auto;
    color: white;
    text-align: center;
    font-family: 'Ubuntu';
    padding: 12px;
    text-shadow: rgb(0 0 0) 2px 0px 0px, rgb(0 0 0) 1.75517px 0.958851px 0px, rgb(0 0 0) 1.0806px 1.68294px 0px, rgb(0 0 0) 0.141474px 1.99499px 0px, rgb(0 0 0) -0.832294px 1.81859px 0px, rgb(0 0 0) -1.60229px 1.19694px 0px, rgb(0 0 0) -1.97998px 0.28224px 0px, rgb(0 0 0) -1.87291px -0.701566px 0px, rgb(0 0 0) -1.30729px -1.5136px 0px, rgb(0 0 0) -0.421592px -1.95506px 0px, rgb(0 0 0) 0.567324px -1.91785px 0px, rgb(0 0 0) 1.41734px -1.41108px 0px, rgb(0 0 0) 1.92034px -0.558831px 0px;
    top: 0;
    cursor: default;
    transition: all 1s ease-in-out;
`
container.innerHTML = message
document.querySelector('body').appendChild(container)

var autoToggle = true

var autoHide = setTimeout(function() {
    container.style.top = position
    clearTimeout(autoHide)
}, 3000);

document.documentElement.addEventListener("keydown", function (e) {
    if (event.keyCode == "192") {
        if (autoToggle) {
            autoToggle = false
            container.style.top = "0px"
        } else {
            autoToggle = true
            container.style.top = position
        }
    }
});

String.prototype.replaceLast = function (what, replacement) {
    if (!this.includes(what)) return this
    var pcs = this.split(what);
    var lastPc = pcs.pop();
    return pcs.join(what) + replacement + lastPc;
};
var t = message
function getServerId() {
    var thisBiome = "-",
        thisServerArr = []
    var thisCp6Id = url.match(/wss:\/\/([a-z0-9]*).s.m28n.net\//)[1]
    for (const [biome, serversObj] of Object.entries(servers)) {
        for (const [server, obj] of Object.entries(serversObj)) {
            if (Object.keys(obj).includes(thisCp6Id)) {
                t = `${server} - ${biome} (map-${matrixs.indexOf(biome)})<br><table style="position: relative; margin: 0 auto;">`
                thisBiome = biome
            }
            thisServerArr.push(`${biome} <tr><td>『 ${server} 』</td>${Object.keys(obj).map(x => `<td><w style="cursor: pointer; color: #ababab" onclick="cp6.forceServerID('${x}')">${x}</w></td>`).join(" - ").replaceLast(thisCp6Id, `<w style="color:#29ffa3">${thisCp6Id}</w>`)}</tr>`)
        }
    }
    thisServerArr.forEach(x => {
        if (x.startsWith(thisBiome)) t += x.replace(thisBiome, "").trim()
    })
    t += `</table>`
    container.innerHTML = t.replaceAll("<td>", "<td style='min-width: 50px'>")
}

var wssArr = []
setInterval(() => {
    wssArr.unshift(url)
    if (wssArr.length > 2) wssArr.splice(2)
    if (wssArr[wssArr.length - 1] != wssArr[0]) {
        updateServers()
        getServerId()
        if (autoToggle) {
            container.style.top = "0px"
            var autoHide = setTimeout(function() {
                container.style.top = position
                clearTimeout(autoHide)
            }, 3000);
        }
    }
}, 1000)