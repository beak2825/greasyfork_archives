// ==UserScript==
// @name         </> Kurt & Java Üstad Pençetay
// @namespace    http://tampermonkey.net/
// @version      18.1
// @description  !adminyetki
// @author       Kurt
// @match        *://zombs.io/*
// @exclude      *://zombs.io/NR*
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424154/%3C%3E%20Kurt%20%20Java%20%C3%9Cstad%20Pen%C3%A7etay.user.js
// @updateURL https://update.greasyfork.org/scripts/424154/%3C%3E%20Kurt%20%20Java%20%C3%9Cstad%20Pen%C3%A7etay.meta.js
// ==/UserScript==

var changeChat = true;
var hoverOver;
var mousemove;
addEventListener('mousemove', (e) => {
    mousemove = e;
})
function roundTenThousands(x) {
    if(x > 10000) {
    return x.toString().slice(0, 3) + "00"
    } else {
        return x.toString()
    }
}
function roundMyPosition(e) {
    return { x: roundTenThousands( e.getPositionX()),
            y: roundTenThousands(e.getPositionY())
           }
}
var mouseOverInterval = setInterval(() => {
    Object.entries(game.world.entities).forEach((item => {
        if(roundMyPosition(item[1]).x == parseInt(roundTenThousands(game.renderer.screenToWorld(mousemove.clientX, mousemove.clientY).x)) && roundMyPosition(item[1]).y == parseInt(roundTenThousands(game.renderer.screenToWorld(mousemove.clientX, mousemove.clientY).y))
           ) {
            hoverOver = 'Hovering over entity: ' + JSON.stringify(item[1].targetTick)
        } else {
            hoverOver = 'Hiçbir Varlığın Üzerine Gelmeyin.'
        }
    }))

    document.querySelector('#hoverOver').innerText = hoverOver;
}, 100)
var isSpamming = 0;
function pauseChatSpam(e) {
    if(!isSpamming) {
        if(e == ""){
            e = "TC Team Uğradı Yatın Aşşa Orospu Evladları"
        }
        window.spammer = setInterval(() => {
            game.network.sendRpc({
                name: "SendChatMessage",
                channel: "Local",
                message: e
            })
        }, 100)
    } else if(isSpamming) {
        clearInterval(window.spammer)
    }
    isSpamming = !isSpamming
}

window.rainbowwww = true
function degreesToYaw(deg) {
    let ans;
    if((deg - 90) < 90){
        ans = deg - 90
    } else if(deg == 90){
        ans = deg + 90
    } else if(deg > 90){
        ans = deg + 90
    }
    if(ans < 0){
        ans = Math.abs(ans)
    }
}
if(localStorage.timesEhacked == undefined){
    localStorage.timesEhacked = 1;
} else {
    localStorage.timesEhacked++;
}
document.title = "Kurt & Java " + localStorage.timesEhacked
var autoRespawn = false
let hue = 10
var settingsRainbow = document.querySelector("#hud-menu-settings")
function changeHue(){
    if(window.rainbowwww){
    hue+=10
    }
}
function getEntitiesByModel(type){
    let entities = []
        Object.entries(game.world.entities).forEach((item => {
    if(item[1].targetTick.model == type){
        entities.push(item)
    }
}))
    return entities;
}
function moveUp(){
    game.inputPacketScheduler.scheduleInput({
    down: 0,
    up: 1
    })
}
function moveDown(){
    game.inputPacketScheduler.scheduleInput({
    up: 0,
    down: 1
    })
}
function moveLeft(){
    game.inputPacketScheduler.scheduleInput({
        right: 0,
        left: 1
    })
}
function moveRight(){
    game.inputPacketScheduler.scheduleInput({
    left: 0,
    right: 1
    })
}

var danceCounter = 0
var danceRandom = true
var botMode = false
var mineInterval = setInterval(() => {
    if(botMode){
    if(parseInt((getEntitiesByModel('Tree')[0][1].targetTick.position.x - game.world.getEntityByUid(game.world.getMyUid()).targetTick.position.x).toString().replaceAll('-', '')) < 250){
        game.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: "Odun @Kurt (Gösterim): " + getNearestTreeAngle()
        })
        danceRandom = false;
    } else {
        danceRandom = true;
    }
        if(parseInt((getEntitiesByModel('Stone')[0][1].targetTick.position.x - game.world.getEntityByUid(game.world.getMyUid()).targetTick.position.x).toString().replaceAll('-', '')) < 250){
        game.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: "Taş @Kurt (Gösterim): " + getNearestStoneAngle()
        })
    }
    }
}, 100)
var danceInterval = setInterval(() => {
    if(botMode){
    if(danceCounter < moves.length){
        moves[danceCounter]()
        if(danceRandom){
            danceCounter = Math.floor(Math.random() * moves.length)
        } else {
            danceCounter++
        }
    } else {
        danceCounter = 0;
    }
}
}, 500)
var respawnInterval = setInterval(() => {
    if(document.querySelector('.hud-respawn').style.display == "block" && autoRespawn) {
        game.inputPacketScheduler.scheduleInput({
            respawn: 1
        })
        document.querySelector('.hud-respawn').style.display = "none"
    }
}, 10)
var moves = [moveUp, moveRight, moveDown, moveLeft]
function getNearestStoneAngle(){
    return Math.atan2(game.world.entities[game.world.getMyUid()].targetTick.position.y - getEntitiesByModel('Stone')[0][1].targetTick.position.y / 2, game.world.entities[game.world.getMyUid()].targetTick.position.x - getEntitiesByModel('Stone')[0][1].targetTick.position.x)
}
function getNearestTreeAngle(){
    return Math.atan2(game.world.entities[game.world.getMyUid()].targetTick.position.y - getEntitiesByModel('Tree')[0][1].targetTick.position.y / 2, game.world.entities[game.world.getMyUid()].targetTick.position.x - getEntitiesByModel('Tree')[0][1].targetTick.position.x)
}
function scanServer(){
    var current = []
Object.entries(game.ui.getComponent('Leaderboard').playerNames).forEach((item => {
    current.push(item)
}))
    return JSON.stringify(current)
}
var leaveChats = ['Oyundan Çıkış Modu Etkinleştirildi #TC', '3', '2', '1', 'Elveda Dostlar']
function leaveChat(){
    let counter = 0;
    window.leaveChatInterval = setInterval(() => {
        if(counter < leaveChats.length){
        doNewSend(['ch', [leaveChats[counter]]])
        counter++
        }
        else{
        counter = 0;
        clearInterval(window.leaveChatInterval)
        Game.currentGame.network.disconnect()
        }
    }, 1500)
}
window.startaito = false;
let server = -1;
for (let i in game.options.servers) {
    server += 1;
    document.getElementsByClassName("hud-intro-server")[0][server].innerHTML = game.options.servers[i].name + ", Population: {" + Math.round(game.options.servers[i].population/3.125) + "/32}";
}
window.useSamePI = false
addEventListener('keyup', function(e){
    if(e.key == "`" && !_isInChatbox){
game.inputManager.onKeyRelease({
    keyCode: 117
})
    }
}) // debug info
var bw1 = "😈 Zorlu Dalgalar [1/2]: 9, 17, 25, 33, 41, 49, 57, 65, 73, 81 😈"
var bw2 = "😈 Zorlu Dalgalar [2/2]: 89, 97, 105, 121 😈"
window.ajsd = Math.random().toString().slice(0, 6)
console.log(window.ajsd)
var users = [
    {
    "name": "☭ 𝑒𝒽 ✨ ツ ✓",
    "roles": ['Owner', 'Admin']
}, {
    "name": "u7🤗ツ✔",
    "roles": ['Co-Owner', 'Admin']
}, {
    "name": "☢₦Ʉ₵ⱠɆ₳Ɽ☣✔",
    "roles": ['Co-Owner', 'Admin']
}, {
    "name": "⦕NR⦖☭𝑒𝒽✨ツ✓",
    "roles": ['Owner', 'Admin']
}, {
    "name": "Potato Bot",
    "roles": ['Admin', 'Leaker']
}, {
    "name": "⦕NR⦖ F3AR ツ",
    "roles": ['Admin', 'Official']
}, {
    "name": "Yazeet",
    "roles": ['Stealer']
}
]
var q = [{
    word: "is",
    answers: ['Naw', 'Yup.'],
    random: true
}, {
    word: "will",
    answers: ['Outlook good.', 'Perhaps.', 'Yup.', 'Naw'],
    random: true
}, {
    word: "when",
    answers: ['Soon.', 'Never.'],
    random: true
}, {
    word: "are",
    answers: ['Yup.', 'Naw', 'Perhaps.'],
    random: true
}]


let ppInterval = setInterval( () => { // show private parties
    if(document.querySelector('#showpp').checked){
    document.querySelectorAll('.hud-party-link').forEach((elem => {
    if(elem.style.display == "none"){
        elem.style.display = "block"
        elem.childNodes[0].innerText = elem.childNodes[0].innerText + "[ÖZEL]"
        elem.addEventListener('click', function(){
            game.ui.getComponent('PopupOverlay').showHint('Gizli Olduğu İçin Bu Partiye Katılamazsınız', 1e4)
        })
    }}))
    }
}, 1000) // show private parties
window.lpSave = []

var altSpace = " " // alternate space character

String.prototype.multiChatSpaces = function(){
    return this.replaceAll(' ', altSpace)
}
var chatAnims = {
    makeRect: [
        "________________________",
        "| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |",
        "________________________"
    ],
    makeCircle: [
        "   ╱‾‾‾‾‾╲",
        "  /         \x5c",
        " |            |",
        "  \x5c          /",
        "   ╲_____╱"
        ]
} // :D
window.use_di = true;
window.isInMenu = false;

function doorWall(){
    var stashPosition = getGoldStash()
    PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, 'GoldMine', 180);PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'GoldMine', 180);PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, 'GoldMine', 180);PlaceBuilding(stashPosition.x + 96, stashPosition.y + -192, 'GoldMine', 180);PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, 'GoldMine', 180);PlaceBuilding(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 180);PlaceBuilding(stashPosition.x + -96, stashPosition.y + -288, 'GoldMine', 180);PlaceBuilding(stashPosition.x + -24, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -72, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -120, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -168, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -216, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -264, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -312, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -360, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -408, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -456, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -504, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -552, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 24, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 72, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 120, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 168, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 216, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 264, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -600, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -648, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -696, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -744, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -792, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -792, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -744, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -696, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -648, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -600, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -552, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -504, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -456, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -408, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -360, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -312, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -264, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -216, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -168, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -120, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -72, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + -24, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 24, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 72, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 120, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 168, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 216, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 264, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 312, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 360, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 408, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 456, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 504, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 552, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 600, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 648, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 696, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 744, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 792, 'Door', 180);PlaceBuilding(stashPosition.x + -840, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -792, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -744, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -696, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -648, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -600, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -552, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -504, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -456, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -408, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -360, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -216, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -168, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -72, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 24, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -312, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -264, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -120, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + -24, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 72, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 120, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 168, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 216, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 264, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 312, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 360, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 456, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 408, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 504, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 552, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 600, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 648, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 696, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 744, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 792, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 840, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 792, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 744, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 696, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 648, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 600, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 552, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 504, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 456, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 408, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 360, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 312, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 264, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 216, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 168, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 120, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 72, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + 24, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -24, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -72, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -168, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -264, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -312, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -360, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -408, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -456, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -504, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -552, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -600, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -648, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -216, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -120, 'Door', 180);PlaceBuilding(stashPosition.x + 312, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 360, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 408, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 456, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 504, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 552, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 600, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 648, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 696, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 744, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 792, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -840, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -792, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -744, 'Door', 180);PlaceBuilding(stashPosition.x + 840, stashPosition.y + -696, 'Door', 180);
}
var animChat = {
    makeRect: function(){
        let counter = 0;
        let rectInterval = setInterval( () => {
            if(counter<chatAnims.makeRect.length){
                doNewSend(['ch', [chatAnims.makeRect[counter].multiChatSpaces()]])
                counter++
            }
            else{
                counter = 0
                clearInterval(rectInterval)
            }
        }, 3000)
    },
    makeCircle: function(){
        let counter = 0;
        let circleInterval = setInterval( () => {
            if(counter<chatAnims.makeCircle.length){
                doNewSend(['ch', [chatAnims.makeCircle[counter].multiChatSpaces()]])
                counter++
            }
            else{
                counter = 0
                clearInterval(circleInterval)
            }
        }, 3000)
    }
}

function btnChatCircle(){
    animChat.makeCircle()
}
function btnChatRect(){
    animChat.makeRect()
}
function upgradeAll(){
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    doNewSend(['ch', ['Her Şey Yükseltildi #TC']])
}
function movePlayer(e){
    if(!_isInChatbox){
    switch(e.toLowerCase().replaceAll(' ', '')){
        case "a":
            Game.currentGame.network.sendInput({
                left: 1
            })
            break;
        case "d":
            Game.currentGame.network.sendInput({
                right: 1
            })
            break;
        case "w":
            Game.currentGame.network.sendInput({
                up: 1
            })
            break;
        case "s":
            Game.currentGame.network.sendInput({
                down: 1
            })
            break;
    }
    }
}

var emojis = [{
text: ":happy:",
char: "😄"
}, {
text: ":sad:",
char: "😥"
}, {
text: ":angry:",
char: "😠"
}, {
text: ":laughing:",
char: "😂"
}, {
text: ":stop:",
char: "🛑"
}, {
text: ":revenge:",
char: "😈"
}, {
text: ":smiley:",
char: "ヅ"
}]

function heal() {
        Game.currentGame.network.sendRpc({
            "name": "BuyItem",
            "itemName": "HealthPotion",
            "tier": 1
        })

        Game.currentGame.network.sendRpc({
            "name": "EquipItem",
            "itemName": "HealthPotion",
            "tier": 1
        })
        Game.currentGame.network.sendRpc({
            "name": "BuyItem",
            "itemName": "PetHealthPotion",
            "tier": 1
        })

        Game.currentGame.network.sendRpc({
            "name": "EquipItem",
            "itemName": "PetHealthPotion",
            "tier": 1
        })
}

function getGoldStash(){
        let entities = Game.currentGame.ui.buildings
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        }
        let obj = entities[uid]
        if (obj.type == "GoldStash") {
            return obj
        }
    }
}
function PlaceBuilding(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
var isBowing = false;

var slotChars = [{
    char: "7️⃣",
    value: 33
}, {
    char: "🍎",
    value: 10
   }, {
       char: "🍔",
       value: 25
   }, {
       char: "🥓",
       value: 15
   }, {
       char: "⚽",
       value: 12
   }, {
       char: "🐾",
       value: 10
   }, {
       char: "1️⃣",
       value: 27
   }, {
       char:"💡",
       value: 30
   }]

console.log(slotChars)
window.generateSlots = function(){ // fp is the returned array, fs is the joined | fp string, pp is the score
    let fp = [];
    let fs = "";
    let pp = 0;
    var f1 = slotChars[Math.floor(Math.random() * slotChars.length)]
    fp.push(f1.char)
    pp+=f1.value
    var f2 = slotChars[Math.floor(Math.random() * slotChars.length)]
    fp.push(f2.char)
    pp+=f2.value
    var f3 = slotChars[Math.floor(Math.random() * slotChars.length)]
    fp.push(f3.char)
    pp+=f3.value
    fs = [fp.join('|'), pp + " / 99"]
    return fs;
}
function ahrc1(){ // 1 ahrc (collect and refuel), used in lpinterval
    var entities = Game.currentGame.world.entities
                    for(let uid in entities) {
                    if(!entities.hasOwnProperty(uid)) continue;
                    let obj = entities[uid];
                    Game.currentGame.network.sendRpc({
                        name: "CollectHarvester",
                        uid: obj.fromTick.uid
                    });
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 1) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.07
                        });
                    }
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 2) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.11
                        });
                    }
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 3) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.17
                        });
                    }
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 4) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.22
                        });
                    }
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 5) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.25
                        });
                    }
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 6) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.28
                        });
                    }
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 7) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.42
                        });
                    }
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 8) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.65
                        });
                    }
                    }
}
var lpinterval = setInterval(function(){ // loaded player info, ahrc, isInMenu, noob = chatbot
    document.querySelector('#lpi').innerText = "Yüklenen Oyuncu Bilgileri: " + JSON.stringify(window.loadedIDS())
    if(window.ahrc){
        ahrc1()
    }
    window.isInMenu = document.querySelector('#hud-menu-settings').style.display == "block" ? true : false
    if((window.lpSave[window.lpSave.length - 1] !== loadedPlayers()[loadedPlayers().length - 1]) && document.querySelector('#noobchat').checked){
        doNewSend(['ch', ['NOOB = ' + loadedPlayers()[Math.floor(Math.random() * loadedPlayers().length)]]])
        window.lpSave = loadedPlayers()
    }
    document.querySelector("#hud-menu-party > div.hud-party-grid > div.hud-party-joining").style.display = "none"
}, 100)

// enable/disable chat
// 🟩 🟥

function enDisAbleEmj(bool, txt){
    return bool ? "" + txt + " Etkin #TC" : "" + txt + " Devre Dışı Bırakıldı #TC"
}
 // disable enable in chat

window.cmdsEnabled = true

// these are all button event listeners --->
function toggleCmds(){
    window.cmdsEnabled = !window.cmdsEnabled
    if(changeChat) {
    doNewSend(['ch', [enDisAbleEmj(window.cmdsEnabled, "Komutlar")]])
    }
    document.querySelector('#togglecmd').innerText = window.cmdsEnabled ? "Komutlar &K" : "Komutlar &A"
}
function sellAll(){
    var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model !== "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    doNewSend(['ch', ['💰 Her Şey Kaldırıldı #TC 💰']])
}
function sellWalls(){
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "Wall") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    doNewSend(['ch', ['💰 Duvarlar Kaldırıldı #TC 💰']])
}
function sellBombTowers(){
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "BombTower") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    doNewSend(['ch', ['💰 Bombacılar Kaldırıldı #TC 💰']])
}
function sellGoldMines(){
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "GoldMine") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    doNewSend(['ch', ['💰 Altın Toplayıcıları Kaldırıldı #TC 💰']])
}
function sellArrowTowers(){
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "ArrowTower") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    doNewSend(['ch', ['💰 Okçular Kaldırıldı #TC 💰']])
}
function sellSlowTraps(){
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "SlowTrap") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    doNewSend(['ch', ['💰 Tuzaklar Kaldırıldı #TC 💰']])
}
function sellCannonTowers(){
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "CannonTower") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    doNewSend(['ch', ['💰 Topçular Kaldırıldı #TC 💰']])
}
function sellMageTowers(){
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "MagicTower") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    doNewSend(['ch', ['💰 Büyücüler Kaldırıldı #TC 💰']])
}
function sellMeleeTowers(){
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "MeleeTower") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    doNewSend(['ch', ['💰 İticiler Kaldırıldı #TC 💰']])
}
function sellHarvesters(){
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "Harvester") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    doNewSend(['ch', ['💰 Kazıcılar Kaldırıldı #TC 💰']])
}
function sellDoors(){
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "Door") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    doNewSend(['ch', ['💰 Kapılar Kaldırıldı #TC 💰']])
}
// <--- end of button event listeners

//
document.querySelector('.hud-chat-input').addEventListener('keypress', function(e){
    emojis.forEach((item => {
        this.value = this.value.replaceAll(item.text, item.char)
    }))
    if(e.keyCode == 13){ // exclude commands and html entities
        this.value = this.value.replaceAll('fuck', 'fuc‌k').replaceAll('FUCK', 'FUC‌K').replaceAll('shit', 'shi‌t').replaceAll('SHIT', 'SHI‌T').replaceAll('bitch', 'bit‌ch').replaceAll('BITCH', 'BIT‌CH').replaceAll('ass', 'as‌s').replaceAll('ASS', 'AS‌S').replaceAll('dick', 'dic‌k').replaceAll('DICK', "DIC‌K").slice(0, 63) // anti censor C:
        if(this.value.includes('nigg') || this.value.includes('niga')){
            this.value = "I am a building, don't be racist"
        }
    }
})
var insults = ["you smooth brained potato", "you rotten pumpkin brain", "you soggy zuicini", "you watered down banana", "you're orange juice toothpaste flavored"] // just an array of insults

// menu stuff (defining & appending) --->
var settingsHTML = `
<div style="text-align:center"><br>
<hr>
<h3>• Kurt & Java Üstad Pençetay</h3>
<hr>
<input type="text" id="spamchat" placeholder="Mesaj" class="menu-textbox">
<br>
<button class="btn btn-purple ehack-btn" style="border-radius:25%" id="spamchatbtn">Bölünmüş Sohbet</button>
<br>
<input type="text" id="spmchinput" placeholder="Mesaj" class="menu-textbox">
<br>
<button class="btn btn-purple ehack-btn" style="border-radius:25%" id="togglespmch">Otomatik Yazıcı &</button>
<hr>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="clearchatbtn">Sohbeti Temizle</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="upgradeallbtn">Her Şeyi Yükselt</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="mainxaito">Zaman Dondurucu &</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="walldoor">Kapı Duvarı</button>
<hr>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="idkbtn33">Havalı Oyundan Çıkış</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="idkbtn22">Sohbet Dikdörtgeni</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="idkbtn11">Sohbet Çevresi</button>
<hr>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="resetinsultsbtn">Hakaretleri Sıfırla</button>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="togglecmd">Komutlar &</button>
<button class="btn btn-red ehack-btn ehack-btn" style="border-radius:25%" id="toggleahrc">Otomatik Kazıcı &</button>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="toggleab">Otomatik Yay &</button>
<hr>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="togglebot">Bot Modu &</button>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="toggleresp">Otomatik Yeniden Doğma &</button>
<hr>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellall">Her Şeyi Kaldır</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellwalls">Duvarları Kaldır</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="selldoors">Kapıları Kaldır</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="selltraps">Tuzakları Kaldır</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellmines">Altın Toplayıcıları Kaldır</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellarrows">Okları Kaldır</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellcannons">Topçuları Kaldır</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellmelees">İticileri Kaldır</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellbombs">Bombacıları Kaldır</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellmages">Büyücüleri Kaldır</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellharvesters">Kazıcıları Kaldır</button>
<hr>
<button class="btn btn-gold ehack-btn" style="border-radius:25%" id="menu-leaveparty-btn">Klandan Ayrıl</button>
<br>
<input type="text" class="menu-textbox" id="menu-jpbsk-input" placeholder="Anaktar">
<br>
<button class="btn btn-gold ehack-btn" style="border-radius:25%" id="menu-jpbsk-btn" onclick='Game.currentGame.network.sendRpc({name:"JoinPartyByShareKey", partyShareKey: document.querySelector("#menu-jpbsk-input").value})'>Klana Katıl</button>
<hr>
<button class="btn btn-white ehack-btn" style="border-radius:25%" onclick="Game.currentGame.network.disconnect()">Bağlantıyı kes</button>
<hr>
<p style="font-size:10px;">Varsayılan Hakaretler Kullanılsın mı?</p><input type="checkbox" id="use-di" checked>
<br>
<p style="font-size:10px;">Özel Partiler Gösterilsin mi?</p><input type="checkbox" id="showpp" checked>
<br>
<p style="font-size:10px;">Acemi Bildirici ?</p><input type="checkbox" id="noobchat">
<br>
<p style="font-size:10px;">Gelişmiş Oyuncu Bilgileri?</p><input type="checkbox" id="advancedlpi">
<br>
<p style="font-size:10px;">Kaydırmada Yakınlaştırılsın mı?</p><input type="checkbox" id="zos">
<br>
<p style="font-size:10px;">Kedi Kopyalansın mı?</p><input type="checkbox" id="copycat">
<br>
<p style="font-size:10px;">Ölüm Sohbeti mi?</p><input type="checkbox" id="deadchat">
<br>
<p style="font-size:10px;">Sohbet Etkinleştirilsin mi?</p><input type="checkbox" id="apexmode" checked>
<hr>
<p id="hoverOver"></p>
<br>
<p id="lpi">İtem Algılayıcı: </p>
<style>
.menu-textbox{
    border-radius:25%;
    background-color: rgba(171, 183, 183, 0.25);
    border: 2px solid black;
    color:white;
}
.ehack-btn:hover{
border: 3px solid grey;
}
</style>
` // aka mod menu
settingsHTML.id = "modmenu"
document.getElementsByClassName("hud-settings-grid")[0].innerHTML = settingsHTML;

document.querySelector('#clearchatbtn').addEventListener('click', function(){
                        document.querySelector('.hud-chat-messages').innerHTML = ""
                console.clear()
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "Sohbet Temizlendi #TC"
                })
})
document.querySelector('#sellbombs').addEventListener('click', sellBombTowers)
document.querySelector('#sellarrows').addEventListener('click', sellArrowTowers)
document.querySelector('#sellcannons').addEventListener('click', sellCannonTowers)
document.querySelector('#sellmages').addEventListener('click', sellMageTowers)
document.querySelector('#sellall').addEventListener('click', sellAll)
document.querySelector('#selltraps').addEventListener('click', sellSlowTraps)
document.querySelector('#selldoors').addEventListener('click', sellDoors)
document.querySelector('#sellmines').addEventListener('click', sellGoldMines)
document.querySelector('#sellwalls').addEventListener('click', sellWalls)
document.querySelector('#sellmelees').addEventListener('click', sellMeleeTowers)
document.querySelector('#sellharvesters').addEventListener('click', sellHarvesters)

function onLeaveParty(){
    Game.currentGame.network.sendRpc({
        name: "LeaveParty"
    })
}


document.querySelector('#use-di').addEventListener('change', function(){
var THIS_DI_EVENT = this
game.ui.getComponent('PopupOverlay').showConfirmation('Varsayılan Hakaretleri Değiştirmek İstediğinizden Emin misiniz? Bu, Tüm Özel Hakaretleri Sıfırlayacak', 1e4, function(){
    if(THIS_DI_EVENT.checked){
        insults = ["Ananı Sikerim", "Orospu Evladı", "Piç", "Orospu Çocuğu", "Anana Kafa Atayım"]
        game.ui.getComponent('PopupOverlay').showHint('Varsayılan Hakaretler Başarıyla Etkinleştirildi.', 1e4)
        window.use_di = true
        if(changeChat) {
        doNewSend(['ch', ['Varsayılan Hakaretleri Kullan Etkinleştirildi #TC']])
        }
    }
    else{
        insults = ["Hakaret Yok, Eklemek İçin !silici Kullanın!"]
        game.ui.getComponent('PopupOverlay').showHint('Varsayılan Hakaretler Başarıyla Devre Dışı Bırakıldı.', 1e4)
        window.use_di = false
        if(changeChat) {
        doNewSend(['ch', ['Devre Dışı Bırakılmış Varsayılan Hakaretleri Kullan #TC']])
        }
    }
}, function(){
    game.ui.getComponent('PopupOverlay').showHint('Tamam', 1e4)
})
})
document.querySelector('#menu-leaveparty-btn').addEventListener('click', onLeaveParty)

document.querySelector('#showpp').addEventListener('change', function(){
    var THIS_PP_EVENT = this;
    if(THIS_PP_EVENT.checked){
        if(changeChat) {
        doNewSend(['ch', ['Özel Partileri Göster Etkinleştirildi #TC']])
        }
    }
    else{
        if(changeChat) {
        doNewSend(['ch', ['Devre Dışı Bırakılmış Özel Partileri Göster']])
        }
    }
})
document.querySelector('#copycat').addEventListener('change', function(){
    var THIS_CC_EVENT = this;
    if(THIS_CC_EVENT.checked){
        if(changeChat) {
        doNewSend(['ch', ['Etkin Kopya Kedi #TC']])
        }
    }
    else{
        if(changeChat) {
        doNewSend(['ch', ['Devre Dışı Bırakılmış Kopya Kedi #TC']])
        }
    }
})
document.querySelector('#deadchat').addEventListener('change', function(){
    var THIS_DC_EVENT = this;
    if(THIS_DC_EVENT.checked){
        if(changeChat) {
        doNewSend(['ch', ['Etkin Ölüm Sohbeti #TC']])
        }
    }
    else{
        if(changeChat) {
        doNewSend(['ch', ['Devre Dışı Bırakılmış Ölüm Sohbeti #TC']])
        }
    }
})
document.querySelector('#noobchat').addEventListener('change', function(){
    var THIS_NC_EVENT = this;
    if(THIS_NC_EVENT.checked){
        if(changeChat) {
        doNewSend(['ch', ['Acemi Bulucu Etkin #TC']])
        }
    }
    else{
        if(changeChat) {
        doNewSend(['ch', ['Acemi Bulucu Devre Dışı Bırakıldı #TC']])
        }
    }
})
// <--- end of menu stuff (defining & appending)
// also event listeners on the menu forgot to add that at start of script

var removeDeleted = function(e){ // remove deleted/empty/undefined/null items in an array
    let fp = []
    for(let i = 0;i<e.length;i++){
        if(e[i] !== undefined){
            fp.push(e[i])
        }
    }
    return fp;
}

function loadedPlayers(){ // loaded player names
   var returns = []
    Object.entries(Game.currentGame.world.entities).forEach((stuff => {
    if(stuff[1].targetTick.entityClass == "PlayerEntity" && ((stuff[1].targetTick.uid !== Game.currentGame.world.entities[Game.currentGame.world.getMyUid()].targetTick.uid) || window.useSamePI)){
        returns.push(stuff[1].targetTick.name)
    }
}))
    return returns;
}
window.loadedIDS = function(){
   var returns = []
    Object.entries(Game.currentGame.world.entities).forEach((stuff => {
    if(stuff[1].targetTick.entityClass == "PlayerEntity" && ((stuff[1].targetTick.uid !== Game.currentGame.world.entities[Game.currentGame.world.getMyUid()].targetTick.uid) || window.useSamePI)){
        var h = stuff[1].targetTick
        if(document.querySelector('#advancedlpi').checked){
            returns.push(JSON.stringify(h))
        }
        else{
        returns.push(stuff[1].targetTick.name + " - Odun: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.wood + ", Taş: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.stone + ", Altın: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.gold)
        }
    }
}))
    return returns;
}

function spamchatclick(){ // used to be called spam chat, its split chat now
    var user = document.querySelector('#spamchat').value
    splitChatLength(user)
}

document.querySelector('#spamchatbtn').addEventListener('click', spamchatclick)
document.querySelector('#resetinsultsbtn').addEventListener('click', resetInsults)
function resetInsults(){
if(window.use_di){
insults = ["you smooth brained potato", "you rotten pumpkin brain", "you soggy zuicini", "you watered down banana", "you're orange juice toothpaste flavored"]
}
    else{
        insults = ["Hakaret Yok, Eklemek İçin !ekle Kullanın!"]
    }
doNewSend(['ch', ["Hakaretler Başarıyla Sıfırlandı"]])
}
document.querySelector('#togglecmd').addEventListener('click', toggleCmds)
var balls = ["Outlook good.", "Really?", "Perhaps.", "Definitely not.", "Yup.", "Are you retarded?", "Naw", "Yup.", "Yup."]
var breadEaten = 0
var cmdInterval = setInterval(function(){
    if(window.cmdsEnabled){
    var playerName = Game.currentGame.world.entities[Game.currentGame.world.getMyUid()].targetTick.name
    if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[1].slice(1, 4) == "!ch"){
        Game.currentGame.network.sendRpc({
        name: "SendChatMessage",
        channel: "Local",
        message: document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[1].slice(4)
        })
}
    if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[1].slice(1, 7) == "!bread"){
        breadEaten++;
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: "🍞🍞🍞 @" + document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] + " has eaten bread! " + breadEaten + " people have eaten bread! 🍞🍞🍞"
        })
}
        if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[1].slice(1, 13) == "!willigetagf"){
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: "💐 The chances of you getting a girlfriend are " + Math.floor(Math.random() * 10) + "%! @" + document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] + " 💐"
        })
}
                if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[1].slice(1, 9) == "!insults"){
                    var insultCounteRz = 1;
                    var innsultSInterval = setInterval(() => {
                        if (insultCounteRz <= (insults.length)){
                            doNewSend(['ch', ['📖 Insults [' + insultCounteRz + "/" + (insults.length) + "]: " + insults[insultCounteRz - 1] + " 📖"]])
                            insultCounteRz++;
                        }
                        else {
                            insultCounteRz = 0;
                            clearInterval(innsultSInterval)
                        }
                    }, 1500)
}
    if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[1].slice(1).includes('**')){
        Game.currentGame.network.sendRpc({
        name: "SendChatMessage",
            channel: "Local",
            message: "❌ Don't fuc‌king swear you bitc‌h @" + document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] + " ❌"
        })
    }
    if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.toLowerCase().split(':')[1].slice(1, 7) == "!8ball"){
        q.forEach((item => {
            if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.toLowerCase().split(':')[1].includes(item.word)){
                window.ball = item.answers[Math.floor(Math.random() * item.answers.length)]
            }
            else{
                window.ball = balls[Math.floor(Math.random() * balls.length)]
            }
        }))
        Game.currentGame.network.sendRpc({
        name: "SendChatMessage",
            channel: "Local",
            message: "🎱 Büyücü 8 Top İle Cevaplandı " + window.ball + " 🎱"
        })
    }
            if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.toLowerCase().split(':')[1].slice(1, 10) == "!komutlar"){
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
        message: "💻 Komutlar [1/3]: !8ball,!ch,!bread,!insult,!addinsult 💻"
                })
                setTimeout(function(){
                                    Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
        message: "💻 Komutlar [2/3]: !willigetagf, !slots, !boss, !insults 💻"
                })
                }, 1500)

                setTimeout(function(){
                                    Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
        message: "💻 Komutlar [3/3]: Geliştiriliyor.. 💻"
                })
                }, 3000)

            }
                    if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.toLowerCase().split(':')[1].slice(1, 6) == "!boss"){
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
        message: bw1
                })
                setTimeout(function(){
                                    Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
        message: bw2
                })
                }, 1500)
            }
    if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.toLowerCase().split(':')[1].slice(1, 11) == "!addinsult"){
        if(!insults.includes(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.toLowerCase().split(':')[1].slice(11))){
            if(window.use_di){
            insults.push(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.toLowerCase().split(':')[1].slice(11))
            }
            else{
            insults = []
                insults.push(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.toLowerCase().split(':')[1].slice(11))
            }
            Game.currentGame.network.sendRpc({
                name: "SendChatMessage",
                             channel: "Local",
                message: "📝 Hakaretlere Eklendi 📝"
            })
                     }
        else{
            Game.currentGame.network.sendRpc({
                name: "SendChatMessage",
                             channel: "Local",
                message: "❌ Bu Hakaret Zaten Var ❌"
                         })
        }
    }
            if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.toLowerCase().split(':')[1].slice(1, 8) == "!insult" && document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[1].slice(1, 9) !== "!insults"){
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "📝 " + insults[Math.floor(Math.random() * insults.length)] + " @" + loadedPlayers()[Math.floor(Math.random() * loadedPlayers().length)] + " 📝"
                })
            }
    if(document.querySelector('#hud-respawn').style.display == "block" && document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[1] !== (playerName + " thinks that whoever killed them is an idiot!") && document.querySelector('#deadchat').checked){
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: (playerName + " thinks that whoever killed them is an idiot!")
    })
    }
                if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[1].slice(1, 7) == "!slots"){
                    var f = window.generateSlots()
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: "🎰 @" + document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] + " Your slots results are: " + f[0] + " with a score of " + f[1] + "! 🎰"
        })
}
                function getUserRoles(s){
        users.forEach((item => {
            if(item.name == s){
                return item.roles
            }
            else{
                return []
            }
        }))
        }
        if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[1].includes('!disconnect ' + window.ajsd) && (users[0].name == document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] || users[1].name == document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] || users[2].name == document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] || users[3].name == document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] || document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0].toLowerCase().includes('pot') || users[4].name == document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.toLowerCase().split(':')[0])){
            document.querySelector('.hud-chat-messages').innerHTML = ""
            console.clear()
            doNewSend(['ch', ['Bye have a great day!']])
            Game.currentGame.network.disconnect()
        }
        if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[1].includes('!eid') && (users[0].name == document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] || users[1].name == document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] || users[2].name == document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] || users[3].name == document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] || document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0].toLowerCase().includes('pot') || users[4].name == document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.toLowerCase().split(':')[0])){
            doNewSend(['ch', [window.ajsd]])
        }
    }
}, 750)

let dimension = 1;

const onWindowResize = () => {
    if(!window.isInMenu && window.zoomonscroll){
    const renderer = Game.currentGame.renderer;
    let canvasWidth = window.innerWidth * window.devicePixelRatio;
    let canvasHeight = window.innerHeight * window.devicePixelRatio;
    let ratio = Math.max(canvasWidth / (1920 * dimension), canvasHeight / (1080 * dimension));
    renderer.scale = ratio;
    renderer.entities.setScale(ratio);
    renderer.ui.setScale(ratio);
    renderer.renderer.resize(canvasWidth, canvasHeight);
    renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
    renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
    }
} // Zoom by Apex

onWindowResize();

window.onresize = onWindowResize;

window.onwheel = e => {
    if (e.deltaY > 0) {
        dimension = Math.min(1.35, dimension + 0.01);
        onWindowResize();
    } else if (e.deltaY < 0) {
        dimension = Math.max(0.1, dimension - 0.01);
        onWindowResize();
    }
}
var _isInChatbox = false;
setInterval( () => {
    _isInChatbox = document.querySelector('.hud-chat').classList.contains('is-focused')
}, 100)
window.isChatting = 0
function doNewSend(sender){
    if(sender[0] == "ch"){
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: sender[1][0]
        })
    }
}
function splitChatLength(text){
        let i = 0;
    window.chatSetInterval = setInterval(function(){
        if(i<text.length){
        doNewSend(['ch', [text.slice(i,i+45)]])
        i+=45;
        }
        else{
        clearInterval(window.chatSetInterval)
        }
    }, 1500)
}
addEventListener('keydown', function(e){
    if(!_isInChatbox && e.key == "/"){
        document.querySelector("#hud-menu-settings").style.display = document.querySelector("#hud-menu-settings").style.display == "none" ? "block" : "none"
        document.querySelector("#hud-menu-shop").style.display = "none"
        document.querySelector("#hud-menu-party").style.display = "none"
    }
    if(!_isInChatbox && e.key == "="){
        alert(scanServer())
    }
})
document.querySelector('#toggleahrc').addEventListener('click', function(){
    window.ahrc = !window.ahrc
    document.querySelector('#toggleahrc').innerText = window.ahrc ? "Otomatik Kazıcı &K" : "Otomatik Kazıcı &A"
    if(changeChat) {
    doNewSend(['ch', [enDisAbleEmj(window.ahrc, 'Otomatik Kazıcı')]])
    }
})
function autoBow(){
    if(isBowing){
        isBowing = false
        clearInterval(window.bow)
    }else{
        isBowing = true
          if(Game.currentGame.ui.inventory.Bow) {
              Game.currentGame.network.sendRpc({
                        name: "EquipItem",
                        itemName: "Bow",
                        tier: Game.currentGame.ui.inventory.Bow.tier
                  })
              window.bow = setInterval(function() {
                  Game.currentGame.inputPacketScheduler.scheduleInput({
                            space: 1
                            })
                  Game.currentGame.inputPacketScheduler.scheduleInput({
                            space: 0
                            })
                  Game.currentGame.inputPacketScheduler.scheduleInput({
                            space: 0
                            })
                }, 0);
           }
    }
    document.querySelector('#toggleab').innerText = isBowing ? "Otomatik Yay &K" : "Otomatik Yay &A"
    doNewSend(['ch', [isBowing ? "Otomatik Yay Etkin #TC" : "Otomatik Yay Devre Dışı #TC"]])
}
document.querySelector('#toggleab').addEventListener('click', autoBow)
document.querySelector('#upgradeallbtn').addEventListener('click', upgradeAll)
addEventListener('keydown', function(e){
    if(!_isInChatbox && e.key == "-"){
Game.currentGame.network.sendRpc({ name: "BuyItem", itemName: "Crossbow", tier: 1});
Game.currentGame.network.sendRpc({ name: "EquipItem", itemName: "Crossbow", tier: 1});
    }
})

function onChangePP(){
    game.ui.getComponent('PopupOverlay').showHint('Bunun Uygulanması Biraz Zaman Alabilir, Bu Yüzden Sabırlı Olun')
}
document.querySelector('#showpp').addEventListener('change', onChangePP)
document.querySelector('#idkbtn11').addEventListener('click', btnChatCircle)
document.querySelector('#idkbtn22').addEventListener('click', btnChatRect)

document.querySelector('#advancedlpi').addEventListener('change', function(e){
    var THIS_LPI_EVENT = this;
    if(THIS_LPI_EVENT.checked){
        doNewSend(['ch', ['Etkinleştirilmiş Gelişmiş Oyuncu Bilgileri #TC']])
    }
    else{
        doNewSend(['ch', ['Devre Dışı Bırakılmış Gelişmiş Oyuncu Bilgileri #TC']])
    }
})
document.querySelector('#zos').addEventListener('change', function(e){
    var THIS_ZOS_EVENT = this;
    window.zoomonscroll = THIS_ZOS_EVENT.checked
    if(THIS_ZOS_EVENT.checked){
        doNewSend(['ch', ['Kaydırmada Yakınlaştırma Etkinleştirildi #TC']])
    }
    else{
        doNewSend(['ch', ['Kaydırmada Yakınlaştırmayı Devre Dışı Bırakıldı #TC ']])
    }
})
// AITO from Main X (credit to pot for giving me this)
window.sendAitoAlt = () => {
    if (window.startaito) {
        let ws = new WebSocket(`ws://${Game.currentGame.options.servers[Game.currentGame.options.serverId].hostname}:8000`);
        ws.binaryType = "arraybuffer";
        ws.onclose = () => {
            ws.isclosed = true;
        }
        ws.onopen = () => {
            ws.network = new Game.currentGame.networkType();
            ws.network.sendEnterWorldAndDisplayName = (t) => { ws.network.sendPacket(4, {displayName: t}); };
            ws.network.sendInput = (t) => { ws.network.sendPacket(3, t); };
            ws.network.sendRpc = (t) => { ws.network.sendPacket(9, t); };
            ws.network.sendPacket = (e, t) => { if (!ws.isclosed) { ws.send(ws.network.codec.encode(e, t)); } };
            ws.network.sendEnterWorldAndDisplayName(localStorage.name);
        }
        ws.onEnterWorld = () => {
            // useless
        }
        ws.onmessage = msg => {
            ws.data = ws.network.codec.decode(msg.data);
            if (ws.data.uid) {
                ws.uid = ws.data.uid;
            }
            if (ws.data.name) {
                ws.dataType = ws.data;
            }
            if (!window.startaito && !ws.isclosed) {
                ws.isclosed = true;
                ws.close();
            }
            if (ws.verified) {
                if (!ws.isDay && !ws.isclosed) {
                    ws.isclosed = true;
                    ws.close();
                    window.sendAitoAlt();
                }
            }
            if (ws.data.name == "DayCycle") {
                ws.isDay = ws.data.response.isDay;
                if (ws.isDay) {
                    ws.verified = true;
                }
            }
            if (ws.data.name == "Dead") {
                ws.network.sendInput({respawn: 1});
            }
            if (ws.data.name == "Leaderboard") {
                ws.lb = ws.data;
                if (ws.psk) {
                    ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: game.ui.getPlayerPartyShareKey()});
                    if (ws.psk.response.partyShareKey == game.ui.getPlayerPartyShareKey()) {
                        ws.network.sendRpc({name: "BuyItem", itemName: "Pause", tier: 1});
                    }
                }
            }
            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;
            }
            switch(ws.data.opcode) {
                case 4:
                    ws.onEnterWorld(ws.data);
                    break;
            }
        }
    }
}
function toggleAito(){
    if (window.startaito) {
        window.startaito = false;
    } else {
        window.startaito = true;
        window.sendAitoAlt()
    }
    doNewSend(['ch', [window.startaito ? "Zaman Dondurucu Etkin #TC" : "Zaman Dondurucu Devre Dışı Bırakıldı #TC"]])
    document.querySelector('#mainxaito').innerText = window.startaito ? "Zaman Dondurucu &K" : "Zaman Dondurucu &A"
}
document.querySelector('#mainxaito').addEventListener('click', toggleAito)
document.querySelector('#idkbtn33').addEventListener('click', leaveChat)
Game.currentGame.network.addRpcHandler('ReceiveChatMessage', (e) => {
    if(e.uid !== game.world.getMyUid() && document.querySelector('#copycat').checked){
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: e.message
        })
    }
})
document.querySelector('#togglebot').addEventListener('click', function(){
    botMode = !botMode
    this.innerText = botMode ? "Bot Modu &K" : "Bot Modu &A"
    if(changeChat) {
    doNewSend(['ch', [enDisAbleEmj(botMode, "Bot Modu")]])
    }
})
document.querySelector('#toggleresp').addEventListener('click', function(){
    autoRespawn = !autoRespawn
    this.innerText = autoRespawn ? "Otomatik Yeniden Doğma &K" : "Otomatik Yeniden Doğma &A"
    if(changeChat) {
    doNewSend(['ch', [enDisAbleEmj(autoRespawn, "Otomatik Yeniden Doğma")]])
    }
})
window.lol = setInterval(changeHue, 50)
window.rainbow = setInterval(() => {
    settingsRainbow.style.backgroundColor = `hsl(${hue}, 25%, 50%)`
}, 10)

document.querySelector('#togglespmch').addEventListener('click', function(){
    pauseChatSpam(document.querySelector('#spmchinput').value)
    if(changeChat) {
    doNewSend(['ch', [enDisAbleEmj(isSpamming, "Otomatik Yazıcı")]])
    }
    this.innerText = isSpamming ? "Otomatik Yazıcı &K" : "Otomatik Yazıcı &A"
})

document.querySelector('#walldoor').addEventListener('click', doorWall)

document.querySelector('#apexmode').addEventListener('change', function(){
    changeChat = this.checked
})