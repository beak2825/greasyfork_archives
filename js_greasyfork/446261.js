// ==UserScript==
// @name         TheZombsProject
// @namespace    https://github.com/eh7644/thezombsproject/
// @version      1.9.5
// @description  Instructions at the GitHub page on how to install and use it, aka https://github.com/eh7644/thezombsproject/blob/main/README.md
// @author       thezombsproject
// @match        zombs.io
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446261/TheZombsProject.user.js
// @updateURL https://update.greasyfork.org/scripts/446261/TheZombsProject.meta.js
// ==/UserScript==

let sellAllExcept = false;
let upgradeAllExcept = false;

const onEnterWorld = () => {
    window.addEventListener('error', function (e) {
        game.ui.getComponent("PopupOverlay")
            .showHint(`An error occoured: ${JSON.stringify(e)}`, 5e3)
        log(`Error, data: ${JSON.stringify(e)}`)
    });
}

game.network.addEnterWorldHandler(onEnterWorld);
let entities;
setInterval(() => {
    entities = game.world.entities;
}, 10)
var scanServers = function () {
    Object.values(serverObj)
        .forEach((item => {
        alert(JSON.stringify(item))
    }))
}

wss = new WebSocket("wss://ViolentWateryNetworks.thethe4.repl.co/");
serverObj = {};
wss.onmessage = (e) => {
    console.log(e);
    if (e.data.includes('"m":')) {
        serverObj = JSON.parse(e.data).m;
        for (let i = 0; i < document.getElementsByClassName("hud-intro-server")[0].length; i++) {
            let id = document.getElementsByClassName("hud-intro-server")[0][i].value;
            let target = serverObj[id].leaderboardDataObj.sort((a, b) => b.wave - a.wave)[0];
            document.getElementsByClassName("hud-intro-server")[0][i].innerText = `${game.options.servers[id].name}, ppl: ${serverObj[id].population / 3.125}, ${target.wave} <= ${target.name}`;
        }
    }
}

let alp = ["", "K", "M", "B", "T", "Q"];
let counter = (value = 0) => {
    return length = (value).toLocaleString().split(",").length - 1, v = (value / `1e${length * 3}`).toFixed(2) - "" + alp[length], n = !v ? "LIMIT" : isNaN(v - "") ? v: v - "";
};

document.getElementsByClassName("hud-intro-guide")[0].innerHTML = `<hr />
<h3>Scan Players (main y features)</h3>
<input class="scanpplinput1" value="Player" type="text" placeholder="name">
<button class="scanpplbutton1">Scan?</button>
<br>
<input class="scanpplinput21" value="1000" type="number" placeholder="highestwave">
<button class="highestwavebutton1">Get hws?</button>
<br>
<input class="scanpplinput31" value="1000000000" type="number" placeholder="highestscore">
<button class="highestscorebutton1">Get hss?</button>
<p class = "idk1"></p>
<hr />`

find_1 = (targetName = "Player", findAll = false) => {
    let targets = {};
    let results = 0;
    Object.values(serverObj).forEach(server => {
        if (!server.leaderboardDataObj) return;
        server.leaderboardDataObj.forEach(result => {
            if (result.name.toLowerCase().includes(targetName.toLowerCase()) && !findAll) {
                targets[result.uid] = {server: server.id, name: result.name, wave: result.wave, score: result.score, uid: result.uid};
                results++;
            }
            if (findAll) {
                targets[result.uid] = {server: server.id, name: result.name, wave: result.wave, score: result.score, uid: result.uid};
                results++;
            }
        })
    })
    let sortedTargets = Object.values(targets).sort((a, b) => b.wave - a.wave);
    return [`All the results that includes ${targetName}, ${results}`, sortedTargets]
}

highestWave_1 = (moreOrEqualTo = 1000, lessOrEqualTo = Infinity) => {
    let targets = {};
    let results = 0;
    Object.values(serverObj).forEach(server => {
        if (!server.leaderboardDataObj) return;
        server.leaderboardDataObj.forEach(result => {
            if (result.wave >= moreOrEqualTo && result.wave <= lessOrEqualTo) {
                targets[result.uid] = {server: server.id, name: result.name, wave: result.wave, score: result.score, uid: result.uid};
                results++;
            }
        })
    })
    let sortedTargets = Object.values(targets).sort((a, b) => b.wave - a.wave);
    return [`All the results for waves more or equal to ${moreOrEqualTo} and less or equal to ${lessOrEqualTo}, ${results}`, sortedTargets]
}

highestScore_1 = (moreOrEqualTo = 1000000000, lessOrEqualTo = Infinity) => {
    let targets = {};
    let results = 0;
    Object.values(serverObj).forEach(server => {
        if (!server.leaderboardDataObj) return;
        server.leaderboardDataObj.forEach(result => {
            if (result.score >= moreOrEqualTo && result.score <= lessOrEqualTo) {
                targets[result.uid] = {server: server.id, name: result.name, wave: result.wave, score: result.score, uid: result.uid};
                results++;
            }
        })
    })
    let sortedTargets = Object.values(targets).sort((a, b) => b.score - a.score);
    return [`All the results for scores more or equal to ${moreOrEqualTo} and less or equal to ${lessOrEqualTo}, ${results}`, sortedTargets]
}
let num = 0;
onclickscannedserver = (server) => {
    document.getElementsByClassName("hud-intro-server")[0].value = server;
    game.ui.components.Leaderboard.leaderboardData = serverObj[server].leaderboardDataObj;
    game.ui.components.Leaderboard.update();
};
let scanByName = (name, scanEveryone = false, idd = "") => {
    let result = find_1(name, scanEveryone)[0];
    let input = find_1(name, scanEveryone)[1];
    let data = result + ", {\n";
    for (let i in input) {
        let e = input[i];
        let num_1 = num++;
        data += `<div class="tag${num_1}" onclick="onclickscannedserver('${e.server}');">${"    " + i + ", n: " + e.name + ", sid: " + e.server + ", w: " + counter(e.wave) + ", s: " + counter(e.score) + ",\n"}</div>`;
    }
    data += "}";
    let n = "idk" + idd;
    console.log([n, idd, document.getElementsByClassName(n)[0]])
    document.getElementsByClassName(n)[0].innerHTML = data;
}

let highestwave = (highest, idd = "") => {
    let result = highestWave_1(highest)[0];
    let input = highestWave_1(highest)[1];
    let data = result + ", {\n";
    for (let i in input) {
        let e = input[i];
        let num_1 = num++;
        data += `<div class="tag${num_1}" onclick="onclickscannedserver('${e.server}');">${"    " + i + ", n: " + e.name + ", sid: " + e.server + ", w: " + counter(e.wave) + ", s: " + counter(e.score) + ",\n"}</div>`;
    }
    data += "}";
    let n = "idk" + idd;
    document.getElementsByClassName(n)[0].innerHTML = data;
}

let highestscore = (highest, idd = "") => {
    let result = highestScore_1(highest)[0];
    let input = highestScore_1(highest)[1];
    let data = result + ", {\n";
    for (let i in input) {
        let e = input[i];
        let num_1 = num++;
        data += `<div class="tag${num_1}" onclick="onclickscannedserver('${e.server}');">${"    " + i + ", n: " + e.name + ", sid: " + e.server + ", w: " + counter(e.wave) + ", s: " + counter(e.score) + ",\n"}</div>`;
    }
    data += "}";
    let n = "idk" + idd;
    document.getElementsByClassName(n)[0].innerHTML = data;
}
document.getElementsByClassName("scanpplbutton1")[0].onclick = () => {
    let value = document.getElementsByClassName("scanpplinput1")[0].value;
    scanByName(value, false, "1");
}
document.getElementsByClassName("highestwavebutton1")[0].onclick = () => {
    let value = document.getElementsByClassName("scanpplinput21")[0].value;
    highestwave(value, "1");
}
document.getElementsByClassName("highestscorebutton1")[0].onclick = () => {
    let value = document.getElementsByClassName("scanpplinput31")[0].value;
    highestscore(value, "1");
}
let interval_1 = setInterval(() => {
    if (document.getElementsByClassName("scanpplbutton")[0]) {
        clearInterval(interval_1);
        document.getElementsByClassName("scanpplbutton")[0].onclick = () => {
            let value = document.getElementsByClassName("scanpplinput")[0].value;
            scanByName(value);
        }
        document.getElementsByClassName("highestwavebutton")[0].onclick = () => {
            let value = document.getElementsByClassName("scanpplinput2")[0].value;
            highestwave(value);
        }
        document.getElementsByClassName("highestscorebutton")[0].onclick = () => {
            let value = document.getElementsByClassName("scanpplinput3")[0].value;
            highestscore(value);
        }
    }
}, 100);
var scanPlayers = function () {
    var current = []
    Object.entries(game.ui.getComponent('Leaderboard')
                   .playerNames)
        .forEach((item => {
        current.push(item)
        alert(JSON.stringify(current) + "<br><br>")
    }))
    return JSON.stringify(current)
}
var leaderboardData = function () {
    var current = []
    Object.entries(game.ui.components.Leaderboard.leaderboardData)
        .forEach((item => {
        current.push(item)
        alert(JSON.stringify(current) + "<br><br>")
    }))
    return JSON.stringify(current)
}

const log = msg => {
    let logElem = document.createElement('div')
    logElem.innerHTML = `<br>${msg}`
    logElem.class = "tzpLogDiv"
    document.querySelector('#activitylogs').append(logElem)
}

const sell = type => {
    var SellArrows = function () {
        for (var uid in entities) {
            if (!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if (obj.fromTick.model == type) {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                })
            }
        }
    }
    game.ui.getComponent("PopupOverlay")
        .showHint(`Sold ${type}s`, 3e3);
    log('Sold towers with building type {[' + type + ']}')
}
const upgrade = type => {
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid]
        if (obj.fromTick.model == type) {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    log('Upgraded towers with building type ' + type)
}

const sellAllBut = type => {
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid]
        if (obj.fromTick.model !== type && obj.fromTick.model !== "GoldStash") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    log('Sold all but towers with building type ' + type)
}

const upgradeAllBut = type => {
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid]
        if (obj.fromTick.model !== type && obj.fromTick.model !== "GoldStash") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    log('Upgraded all but towers with building type ' + type)
}

const cfp = [{
    path: "sellwallsbtn",
    function: () => {
        if(!sellAllExcept){
            sell("Wall")
        } else {
            sellAllBut("Wall")
        }
    }
}, {
    path: "selldoorsbtn",
    function: () => {
        if(!sellAllExcept){
            sell("Door")
        } else {
            sellAllBut("Door")
        }
    }
}, {
    path: "sellmagesbtn",
    function: () => {
        if(!sellAllExcept){
            sell("MagicTower")
        } else {
            sellAllBut("MagicTower")
        }
    }
}, {
    path: "sellmeleesbtn",
    function: () => {
        if(!sellAllExcept){
            sell("MeleeTower")
        } else {
            sellAllBut("MeleeTower")
        }
    }
}, {
    path: "sellminesbtn",
    function: () => {
        if(!sellAllExcept){
            sell("GoldMine")
        } else {
            sellAllBut("GoldMine")
        }
    }
}, {
    path: "sellbombsbtn",
    function: () => {
        if(!sellAllExcept){
            sell("BombTower")
        } else {
            sellAllBut("BombTower")
        }
    }
}, {
    path: "sellarrowsbtn",
    function: () => {
        if(!sellAllExcept){
            sell("ArrowTower")
        } else {
            sellAllBut("ArrowTower")
        }
    }
}, {
    path: "sellcannonsbtn",
    function: () => {
        if(!sellAllExcept){
            sell("CannonTower")
        } else {
            sellAllBut("CannonTower")
        }
    }
}, {
    path: "sellharvsbtn",
    function: () => {
        if(!sellAllExcept){
            sell("Harvester")
        } else {
            sellAllBut("Harvester")
        }
    }
}, {
    path: "upwallsbtn",
    function: () => {
        if(!upgradeAllExcept){
            upgrade("Wall")
        } else {
            upgradeAllBut("Wall")
        }
    }
}, {
    path: "updoorsbtn",
    function: () => {
        if(!upgradeAllExcept){
            upgrade("Door")
        } else {
            upgradeAllBut("Door")
        }
    }
}, {
    path: "upmagesbtn",
    function: () => {
        if(!upgradeAllExcept){
            upgrade("MagicTower")
        } else {
            upgradeAllBut("MagicTower")
        }
    }
}, {
    path: "upmeleesbtn",
    function: () => {
        if(!upgradeAllExcept){
            upgrade("MeleeTower")
        } else {
            upgradeAllBut("MeleeTower")
        }
    }
}, {
    path: "upminesbtn",
    function: () => {
        if(!upgradeAllExcept){
            upgrade("GoldMine")
        } else {
            upgradeAllBut("GoldMine")
        }
    }
}, {
    path: "upbombsbtn",
    function: () => {
        if(!upgradeAllExcept){
            upgrade("BombTower")
        } else {
            upgradeAllBut("BombTower")
        }
    }
}, {
    path: "uparrowsbtn",
    function: () => {
        if(!upgradeAllExcept){
            upgrade("ArrowTower")
        } else {
            upgradeAllBut("ArrowTower")
        }
    }
}, {
    path: "upcannonsbtn",
    function: () => {
        if(!upgradeAllExcept){
            upgrade("CannonTower")
        } else {
            upgradeAllBut("CannonTower")
        }
    }
}, {
    path: "upharvsbtn",
    function: () => {
        if(!upgradeAllExcept){
            upgrade("Harvester")
        } else {
            upgradeAllBut("Harvester")
        }
    }
}]

addEventListener('load', function (e) {
    document.querySelector('#scanallservsbtn')
        .addEventListener('click', scanServers);
    document.querySelector('#scanlbdatabtn')
        .addEventListener('click', scanPlayers);;
    document.querySelector('#scanplayernamesbtn')
        .addEventListener('click', scanPlayers)
    cfp.forEach((objc => {
        document.querySelector(`#${objc.path}`)
            .addEventListener('click', objc.function);
    }));
    log('Initialized script')
    document.querySelector('#sellallbutchk').addEventListener('change', function() {
        sellAllExcept = this.checked;
    })
    document.querySelector('#upallbutchk').addEventListener('change', function() {
        upgradeAllExcept = this.checked;
    })
});
