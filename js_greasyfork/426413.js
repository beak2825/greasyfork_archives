// ==UserScript==
// @name         </> Kurt & Java Üstad Pençetay Özel
// @namespace    http://tampermonkey.net/
// @version      18.2
// @description  !adminyetki
// @icon         https://cdn.discordapp.com/emojis/822555094493954048.png?v=1
// @author       Eh, Kurt
// @match        *://zombs.io/*
// @match        http://tc-mod.glitch.me/
// @match        http://optimized-zombs.glitch.me/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/426413/%3C%3E%20Kurt%20%20Java%20%C3%9Cstad%20Pen%C3%A7etay%20%C3%96zel.user.js
// @updateURL https://update.greasyfork.org/scripts/426413/%3C%3E%20Kurt%20%20Java%20%C3%9Cstad%20Pen%C3%A7etay%20%C3%96zel.meta.js
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
    document.getElementsByClassName("hud-intro-server")[0][server].innerHTML = game.options.servers[i].name + ", Kapasite: {" + Math.round(game.options.servers[i].population/3.125) + "/32}";
}
window.useSamePI = false
addEventListener('keyup', function(e){
    if(e.key == "`" && !_isInChatbox){
game.inputManager.onKeyRelease({
    keyCode: 117
})
    }
}) // Boss İnfo
var bw1 = "😈 Zorlu Dalgalar [1/2]: 9, 17, 25, 33, 41, 49, 57, 65, 73, 81 😈"
var bw2 = "😈 Zorlu Dalgalar [2/2]: 89, 97, 105, 121 😈"
window.ajsd = Math.random().toString().slice(0, 6)
console.log(window.ajsd)
var users = [
    {
    "name": "Kurt",
    "roles": ['Owner', 'Admin']
}, {
    "name": "Ander",
    "roles": ['Co-Owner', 'Admin']
}, {
    "name": "Deadpool",
    "roles": ['Co-Owner', 'Admin']
}, {
    "name": "Kurt",
    "roles": ['Owner', 'Admin']
}, {
    "name": "TC Developer",
    "roles": ['Admin', 'Leaker']
}, {
    "name": "Xhyper",
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


let ppInterval = setInterval( () => { // Özel Parti
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
}, 1000) // Özelleştirilmiş Parti
window.lpSave = []

var altSpace = " " // Alternatif Boşluk Karakteri

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
window.generateSlots = function(){ // FP Döndürülen Dizidir, FS Birleştirilmiş
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
function ahrc1(){ // 1 AHRC (toplama ve yakıt ikmali), lp Aralığında Kullanılır
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
var lpinterval = setInterval(function(){ // Yükklü Oyuncu Bilgisi, AHRC, isInMenu,
    document.querySelector('#lpi').innerText = "Yüklenen Oyuncu Bilgileri: " + JSON.stringify(window.loadedIDS())
    if(window.ahrc){
        ahrc1()
    }
    window.isInMenu = document.querySelector('#hud-menu-settings').style.display == "block" ? true : false
    if((window.lpSave[window.lpSave.length - 1] !== loadedPlayers()[loadedPlayers().length - 1]) && document.querySelector('#noobchat').checked){
        doNewSend(['ch', ['Acemi = ' + loadedPlayers()[Math.floor(Math.random() * loadedPlayers().length)]]])
        window.lpSave = loadedPlayers()
    }
    document.querySelector("#hud-menu-party > div.hud-party-grid > div.hud-party-joining").style.display = "none"
}, 100)

// Açık Kapalı Sohbet
// 🟩 🟥

function enDisAbleEmj(bool, txt){
    return bool ? "" + txt + " Etkin #TC" : "" + txt + " Devre Dışı Bırakıldı #TC"
}
// Sohbette Etkinleştirmeyi Devre Dışı Bırak

window.cmdsEnabled = true

// Bunların Hepsi Düğme Olay Dinleyicileridir --->
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
// <--- Düğme Olay Dinleyicilerinin Sonu

//
document.querySelector('.hud-chat-input').addEventListener('keypress', function(e){
    emojis.forEach((item => {
        this.value = this.value.replaceAll(item.text, item.char)
    }))
    if(e.keyCode == 13){ // Komutları Ve HTML Varlığını Dışında
        this.value = this.value.replaceAll('fuck', 'fuc‌k').replaceAll('FUCK', 'FUC‌K').replaceAll('shit', 'shi‌t').replaceAll('SHIT', 'SHI‌T').replaceAll('bitch', 'bit‌ch').replaceAll('BITCH', 'BIT‌CH').replaceAll('ass', 'as‌s').replaceAll('ASS', 'AS‌S').replaceAll('dick', 'dic‌k').replaceAll('DICK', "DIC‌K").slice(0, 63) // anti censor C:
        if(this.value.includes('nigg') || this.value.includes('niga')){
            this.value = "Ben Senin Babanım Irkçı Olma"
        }
    }
})
var insults = ["Senin Ananın Amcığına Yarramı Sokarım", "Kuduruk Orospu Evladı Seni Ananı Sikerim", "Herkes Haddini Bilsin Karşınız da Kurt Var", "Bacının Amına Muz Soktuğumun Oğlu", "Portakal Suyu Diş Macunu Aromalısın Beybi"] // Sadece Bir Dizi Hakaret

// Menü Öğeleri (tanımlama ve ekleme) --->
var settingsHTML = `
<div style="text-align:center"><br>
<hr>
<h3>• Kurt & Java Üstad Pençetay Özel</h3>
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
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="opt">Klon Gönder</button>
<hr>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="idkbtn33">Havalı Oyundan Çıkış</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="idkbtn22">Sohbet Dikdörtgeni</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="idkbtn11">Sohbet Çevresi</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="XKeyAR">Yıkım Modu &Y</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="Bf">Analizli Kurucu &Y</button>
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
<input type="text" class="menu-textbox" id="menu-jpbsk-input2" placeholder="Yedek Anaktar">
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
<hr style=\"color: rgba(255, 255, 255);\">
<center><h3>Analizler</h3>
<hr style=\"color: rgba(255, 255, 255);\">
<button type="submit" class="btn btn-blue hud-intro-play">Giriş</button>
<input type="text" class="hud-intro-name" maxlength="16" placeholder="İsmin" style="border-radius: 1em; color: rgb(255, 255, 255); border: 2px solid rgb(0, 4, 46); background-color: rgb(8, 8, 8);">
</div>
<select class="hud-intro-server" style="border-radius: 1em; color: rgb(255, 255, 255); border: 2px solid rgb(0, 4, 46); background-color: rgb(8, 8, 8);">
                                                    <optgroup label="US East">
                                                                                                                                                                                                                        <option value="v32306117">US East #1, Population: {32/32}</option>
                                                                                                                                                                                                                        <option value="v32306125">US East #2, Population: {28/32}</option>
                                                                                                                                                                                                                        <option value="v32306121">US East #3, Population: {25/32}</option>
                                                                                                                                                                                                                        <option value="v32306122">US East #4, Population: {25/32}</option>
                                                                                                                                                                                                                        <option value="v32306119">US East #5, Population: {14/32}</option>
                                                                                                                                                                                                                        <option value="v32306123">US East #6, Population: {23/32}</option>
                                                                                                                                                                                                                        <option value="v32306124">US East #7, Population: {25/32}</option>
                                                                                                                                                                                                                        <option value="v32306126">US East #8, Population: {22/32}</option>
                                                                                                                                                                                                                        <option value="v32306120">US East #9, Population: {11/32}</option>
                                                                                                                                                                                                                        <option value="v32306118">US East #10, Population: {13/32}</option>
                                                                                                                                                                                                                        <option value="v32306139">US East #11, Population: {10/32}</option>
                                                                                                                                                                                                                        <option value="v32306141">US East #12, Population: {11/32}</option>
                                                                                                                                                                                                                        <option value="v32306142">US East #13, Population: {25/32}</option>
                                                                                                                                                                                                                        <option value="v32306143">US East #14, Population: {10/32}</option>
                                                                                                                                                                                                                        <option value="v32306140">US East #15, Population: {25/32}</option>
                                                                                                                                                                                                                        <option value="v32306137">US East #16, Population: {26/32}</option>
                                                                                                                                                                                                                        <option value="v32306144">US East #17, Population: {13/32}</option>
                                                                                                                                            <option value="v32306146">US East #18, Population: {4/32}</option>
                                                                                                                                            <option value="v32306138">US East #19, Population: {9/32}</option>
                                                                                                                                                                                                                        <option value="v32306145">US East #20, Population: {24/32}</option>
                                                                                                                                            <option value="v32306165">US East #21, Population: {3/32}</option>
                                                                                                                                            <option value="v32306164">US East #22, Population: {6/32}</option>
                                                                                                                                            <option value="v32306157">US East #23, Population: {5/32}</option>
                                                                                                                                            <option value="v32306160">US East #24, Population: {3/32}</option>
                                                                                                                                            <option value="v32306163">US East #25, Population: {7/32}</option>
                                                                                                                                                                                                                        <option value="v32306166">US East #26, Population: {16/32}</option>
                                                                                                                                            <option value="v32306161">US East #27, Population: {5/32}</option>
                                                                                                                                            <option value="v32306158">US East #28, Population: {1/32}</option>
                                                                                                                                                                                                                        <option value="v32306159">US East #29, Population: {32/32}</option>
                                                                                                                                            <option value="v32306162">US East #30, Population: {3/32}</option>
                                                                                                                                            <option value="v32306174">US East #31, Population: {7/32}</option>
                                                                                                                                            <option value="v32306173">US East #32, Population: {5/32}</option>
                                                            </optgroup>
                                                    <optgroup label="US West">
                                                                                                                                            <option value="v32305606">US West #1, Population: {4/32}</option>
                                                                                                                                            <option value="v32305607">US West #2, Population: {3/32}</option>
                                                                                                                                                                                                                        <option value="v32305611">US West #3, Population: {26/32}</option>
                                                                                                                                            <option value="v32305613">US West #4, Population: {5/32}</option>
                                                                                                                                                                                                                        <option value="v32305605">US West #5, Population: {26/32}</option>
                                                                                                                                            <option value="v32305608">US West #6, Population: {4/32}</option>
                                                                                                                                            <option value="v32305612">US West #7, Population: {0/32}</option>
                                                                                                                                                                                                                        <option value="v32305609">US West #8, Population: {26/32}</option>
                                                                                                                                            <option value="v32305610">US West #9, Population: {1/32}</option>
                                                                                                                                            <option value="v32305621">US West #10, Population: {0/32}</option>
                                                                                                                                            <option value="v32305622">US West #11, Population: {8/32}</option>
                                                                                                                                                                                                                        <option value="v32305625">US West #12, Population: {26/32}</option>
                                                                                                                                            <option value="v32305624">US West #13, Population: {4/32}</option>
                                                                                                                                                                                                                        <option value="v32305626">US West #14, Population: {14/32}</option>
                                                                                                                                            <option value="v32305623">US West #15, Population: {8/32}</option>
                                                            </optgroup>
                                                    <optgroup label="Europe">
                                                                                                                                                                                                                        <option value="v32304817">Europe #1, Population: {24/32}</option>
                                                                                                                                            <option value="v32304816">Europe #2, Population: {3/32}</option>
                                                                                                                                            <option value="v32304819">Europe #3, Population: {9/32}</option>
                                                                                                                                            <option value="v32304812">Europe #4, Population: {5/32}</option>
                                                                                                                                            <option value="v32304821">Europe #5, Population: {3/32}</option>
                                                                                                                                            <option value="v32304815">Europe #6, Population: {4/32}</option>
                                                                                                                                            <option value="v32304820">Europe #7, Population: {3/32}</option>
                                                                                                                                                                                                                        <option value="v32304814">Europe #8, Population: {21/32}</option>
                                                                                                                                            <option value="v32304813">Europe #9, Population: {5/32}</option>
                                                                                                                                            <option value="v32304818">Europe #10, Population: {3/32}</option>
                                                                                                                                            <option value="v32304840">Europe #11, Population: {4/32}</option>
                                                                                                                                            <option value="v32304833">Europe #12, Population: {1/32}</option>
                                                                                                                                            <option value="v32304839">Europe #13, Population: {1/32}</option>
                                                                                                                                            <option value="v32304835">Europe #14, Population: {2/32}</option>
                                                                                                                                            <option value="v32304831">Europe #15, Population: {5/32}</option>
                                                                                                                                            <option value="v32304838">Europe #16, Population: {4/32}</option>
                                                                                                                                            <option value="v32304834">Europe #17, Population: {3/32}</option>
                                                                                                                                            <option value="v32304837">Europe #18, Population: {0/32}</option>
                                                                                                                                            <option value="v32304832">Europe #19, Population: {3/32}</option>
                                                                                                                                            <option value="v32304836">Europe #20, Population: {0/32}</option>
                                                                                                                                            <option value="v32304861">Europe #21, Population: {1/32}</option>
                                                                                                                                            <option value="v32304864">Europe #22, Population: {4/32}</option>
                                                                                                                                            <option value="v32304859">Europe #23, Population: {1/32}</option>
                                                                                                                                            <option value="v32304862">Europe #24, Population: {0/32}</option>
                                                                                                                                            <option value="v32304860">Europe #25, Population: {2/32}</option>
                                                                                                                                            <option value="v32304858">Europe #26, Population: {0/32}</option>
                                                                                                                                            <option value="v32304857">Europe #27, Population: {0/32}</option>
                                                                                                                                                                                                                        <option value="v32304856">Europe #28, Population: {32/32}</option>
                                                                                                                                            <option value="v32304865">Europe #29, Population: {3/32}</option>
                                                                                                                                            <option value="v32304863">Europe #30, Population: {1/32}</option>
                                                                                                                                            <option value="v32304880">Europe #31, Population: {1/32}</option>
                                                                                                                                            <option value="v32304881">Europe #32, Population: {3/32}</option>
                                                            </optgroup>
                                                    <optgroup label="Asia">
                                                                                                                                            <option value="v32306492">Asia #1, Population: {1/32}</option>
                                                                                                                                            <option value="v32306495">Asia #2, Population: {1/32}</option>
                                                                                                                                            <option value="v32306501">Asia #3, Population: {3/32}</option>
                                                                                                                                            <option value="v32306493">Asia #4, Population: {0/32}</option>
                                                                                                                                            <option value="v32306496">Asia #5, Population: {1/32}</option>
                                                                                                                                            <option value="v32306494">Asia #6, Population: {0/32}</option>
                                                                                                                                            <option value="v32306497">Asia #7, Population: {1/32}</option>
                                                                                                                                            <option value="v32306498">Asia #8, Population: {4/32}</option>
                                                                                                                                            <option value="v32306499">Asia #9, Population: {0/32}</option>
                                                                                                                                            <option value="v32306500">Asia #10, Population: {5/32}</option>
                                                                                                                                            <option value="v32306505">Asia #11, Population: {0/32}</option>
                                                                                                                                                                                                                        <option value="v32306510" selected="">Asia #12, Population: {22/32}</option>
                                                                                                                                            <option value="v32306506">Asia #13, Population: {0/32}</option>
                                                                                                                                            <option value="v32306509">Asia #14, Population: {2/32}</option>
                                                                                                                                            <option value="v32306507">Asia #15, Population: {0/32}</option>
                                                                                                                                            <option value="v32306508">Asia #16, Population: {1/32}</option>
                                                            </optgroup>
                                                    <optgroup label="Australia">
                                                                                                                                            <option value="v32306673">Australia #1, Population: {0/32}</option>
                                                                                                                                            <option value="v32306677">Australia #2, Population: {0/32}</option>
                                                                                                                                            <option value="v32306676">Australia #3, Population: {2/32}</option>
                                                                                                                                            <option value="v32306675">Australia #4, Population: {0/32}</option>
                                                                                                                                            <option value="v32306674">Australia #5, Population: {3/32}</option>
                                                                                                                                            <option value="v32306669">Australia #6, Population: {0/32}</option>
                                                                                                                                            <option value="v32306670">Australia #7, Population: {5/32}</option>
                                                                                                                                            <option value="v32306678">Australia #8, Population: {2/32}</option>
                                                                                                                                            <option value="v32306672">Australia #9, Population: {0/32}</option>
                                                                                                                                                                                                                        <option value="v32306671">Australia #10, Population: {16/32}</option>
                                                                                                                                            <option value="v32306697">Australia #11, Population: {1/32}</option>
                                                                                                                                            <option value="v32306698">Australia #12, Population: {0/32}</option>
                                                                                                                                            <option value="v32306693">Australia #13, Population: {0/32}</option>
                                                                                                                                            <option value="v32306696">Australia #14, Population: {6/32}</option>
                                                                                                                                            <option value="v32306695">Australia #15, Population: {0/32}</option>
                                                            </optgroup>
                                                    <optgroup label="South America">
                                                                                                                                            <option value="v32305898">South America #1, Population: {3/32}</option>
                                                                                                                                                                                                                        <option value="v32305897">South America #2, Population: {28/32}</option>
                                                                                                                                            <option value="v32305895">South America #3, Population: {4/32}</option>
                                                                                                                                            <option value="v32305903">South America #4, Population: {6/32}</option>
                                                                                                                                            <option value="v32305894">South America #5, Population: {3/32}</option>
                                                                                                                                            <option value="v32305902">South America #6, Population: {1/32}</option>
                                                                                                                                            <option value="v32305896">South America #7, Population: {2/32}</option>
                                                                                                                                                                                                                        <option value="v32305899">South America #8, Population: {25/32}</option>
                                                                                                                                            <option value="v32305901">South America #9, Population: {2/32}</option>
                                                                                                                                            <option value="v32305900">South America #10, Population: {1/32}</option>
                                                                                                                                                                                                                        <option value="v32305921">South America #11, Population: {27/32}</option>
                                                                                                                                            <option value="v32305920">South America #12, Population: {3/32}</option>
                                                                                                                                                                                                                        <option value="v32305923">South America #13, Population: {32/32}</option>
                                                                                                                                            <option value="v32305924">South America #14, Population: {4/32}</option>
                                                                                                                                            <option value="v32305925">South America #15, Population: {1/32}</option>
                                                                                                                                                                                                                        <option value="v32305922">South America #16, Population: {19/32}</option>
                                                            </optgroup>
                                            </select>
<br><br>
<hr style=\"color: rgba(255, 255, 255);\">
<center><h3>Sunucu Kısayolları</h3>
<hr style=\"color: rgba(255, 255, 255);\">
<button class=\"btn btn-blue\" style=\"width: 25%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592411';\">Europe 1</button>
<button class=\"btn btn-blue\" style=\"width: 25%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592406';\">Australia 1</button>
<br>
<button class=\"btn btn-blue\" style=\"width: 25%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v3230649';\">Asia 1</button>
<button class=\"btn btn-blue\" style=\"width: 25%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v3230611';\">US East 1</button>
<br>
<button class=\"btn btn-blue\" style=\"width: 25%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v3230560';\">US West 1</button>
<button class=\"btn btn-blue\" style=\"width: 25%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564836';\">Özel Sunucu</button>
<br>
` // Kurt Mod Menü
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
// <--- Menü Öğelerinin Sonu (tanımlama ve ekleme)
// Ayrıca Menüdeki Olay Dinleyicileri Bunu Komut Dosyasının Başına Eklemeyi Unuttular

var removeDeleted = function(e){ // Bir Dizideki Silinmiş / Boş / Tanımsız / Boş Öğeleri Kaldır
    let fp = []
    for(let i = 0;i<e.length;i++){
        if(e[i] !== undefined){
            fp.push(e[i])
        }
    }
    return fp;
}

function loadedPlayers(){ // Yüklenen Oyuncu İsimleri
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

function spamchatclick(){ // Eskiden Spam Sohbeti Olarak Adlandırılırdı, Artık Bölünmüş Sohbeti
    var user = document.querySelector('#spamchat').value
    splitChatLength(user)
}

document.querySelector('#spamchatbtn').addEventListener('click', spamchatclick)
document.querySelector('#resetinsultsbtn').addEventListener('click', resetInsults)
function resetInsults(){
if(window.use_di){
insults = ["Senin Ananın Amcığına Yarramı Sokarım", "Kuduruk Orospu Evladı Seni Ananı Sikerim", "Herkes Haddini Bilsin Karşınız da Kurt Var", "Bacının Amına Muz Soktuğumun Oğlu", "Portakal Suyu Diş Macunu Aromalısın Beybi"]
}
    else{
        insults = ["Hakaret Yok, Eklemek İçin !ekle Kullanın!"]
    }
doNewSend(['ch', ["Hakaretler Başarıyla Sıfırlandı"]])
}
document.querySelector('#togglecmd').addEventListener('click', toggleCmds)
var balls = ["Güzel Oyun.", "Gerçek?", "Embesil.", "Not Aldım.", "Sevindim.", "Güzel Oyundu Tebrikler.", "Şimdi?", "Sevindim.", "Sevindim."]
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
            message: "🍞🍞🍞 @" + document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] + " Ekmek Yedi! " + breadEaten + " İnsanlar Ekmek Yedi! 🍞🍞🍞"
        })
}
        if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[1].slice(1, 13) == "!willigetagf"){
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: "💐 Kız Arkadaş Edinme Şansın " + Math.floor(Math.random() * 10) + "%! @" + document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] + " 💐"
        })
}
                if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[1].slice(1, 9) == "!insults"){
                    var insultCounteRz = 1;
                    var innsultSInterval = setInterval(() => {
                        if (insultCounteRz <= (insults.length)){
                            doNewSend(['ch', ['📖 Hakaretler [' + insultCounteRz + "/" + (insults.length) + "]: " + insults[insultCounteRz - 1] + " 📖"]])
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
            message: "❌ Ananı Sikmeye Yemin Ettim @" + document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] + " ❌"
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
        message: "💻 Komutlar [3/3]: !alanyoket, !kendiniyoket, !lagg 💻"
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
            message: (playerName + " Onları Öldürenin Aptal Olduğunu Düşünüyor!")
    })
    }
                if(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[1].slice(1, 7) == "!slots"){
                    var f = window.generateSlots()
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: "🎰 @" + document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message').length - 1].innerText.split(':')[0] + " Alan Sonuçlarınız: "+ f [0] +" İle Bir Puan: " + f[1] + "! 🎰"
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
            doNewSend(['ch', ['Güle Güle İyi Günler!']])
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
} // Yakınlaştırma Uzaklaştırma

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

function disconnectPartyMembers(member = 1) {
    // Lider Olduğunuzdan Ve Onları Yönlendirecek Parti Üyelerine Sahip Olduğunuzdan Emin Olun.
    if (game.ui.playerPartyMembers[1] && game.ui.playerPartyMembers[0].playerUid == game.world.myUid) {
        let fnc1 = game.network.emitter._events.PACKET_RPC[15];
        let enabled = false;
        game.network.emitter._events.PACKET_RPC[15] = (data) => {
            if (enabled) {
                fnc1(data)
            }
        }
        let dcpacket1 = new Uint8Array(game.network.codec.encode(9, {name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[member].playerUid, canSell: 1}));
        let dcpacket2 = new Uint8Array(game.network.codec.encode(9, {name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[member].playerUid, canSell: 0}));
        for (let i = 0; i < 50000; i++) {
            game.network.socket.send(dcpacket1);
            game.network.socket.send(dcpacket2);
        }
        setTimeout(() => {
            enabled = true;
            game.network.socket.send([]);
        }, 12500);
    }
}
game.network.addRpcHandler("ReceiveChatMessage", e => {
    if (e.uid == game.world.myUid) {
        if (e.message.toLowerCase() == "!alanyoket") {
            disconnectPartyMembers()
        }
        if (e.message.toLowerCase() == "!kendiniyoket") {
            game.network.socket.send([]);
        }
    }
})

// Klon
var button7 = document.getElementById("opt");
button7.addEventListener("click", partytab);

function partytab() {
  var url = document.getElementsByClassName('hud-party-share')[0].value;
  window.open(url);
}

// TC Sunucusu
function $(classname) {
    var element = document.getElementsByClassName(classname)
    if (element.length === 1) {
        return element[0]
    } else {
        return element
    }
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

var changeHeight = document.createElement("style")
changeHeight.type = "text/css"
changeHeight.innerHTML = "@keyframes hud-popup-message {0% { max-height: 0; margin-bottom: 0; opacity: 0; }100% { max-height: 1000px; margin-bottom: 10px; opacity: 1; }} .hud-map .hud-map-spot {display: none;position: absolute;width: 4px;height: 4px;margin: -2px 0 0 -2px;background: #ff5b5b;border-radius: 50%;z-index: 2;} .hud-chat .hud-chat-message { -moz-user-select: text; -khtml-user-select: text; -webkit-user-select: text; -ms-user-select: text; user-select: text; }"
document.body.appendChild(changeHeight)
var widget = '<iframe src="https://discordapp.com/widget?id=821773113506267136&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" style="width: 300px;height: 320px;"></iframe>'
$("hud-intro-left").innerHTML = widget

var PopupOverlay = Game.currentGame.ui.getComponent("PopupOverlay")

var input = $("hud-chat-input")
var pets = $("hud-shop-actions-equip")

function clearChat() {
    input.value = null
}