// ==UserScript==
// @name         Map
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  tttt
// @author       Melo
// @match        https://agar.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431746/Map.user.js
// @updateURL https://update.greasyfork.org/scripts/431746/Map.meta.js
// ==/UserScript==

window.ZOOM_SPEED = 0.85
window.SHOW_ALL_PLAYERS_MASS = true
window.EXTENDED_ZOOM = true
window.DRAW_MAP_GRID = true
window.DURATION = 3


function setGUI() {
    var welcomeDiv = document.getElementById("mainui-ads")
    var promoDiv = document.getElementById("mainui-promo")
    var specialDiv =  `
<h1> ø Special </h1>
<img src="https://i.imgur.com/oM9sdps.png" style="text-align: center; width: auto; max-width: 70%; ">
    `

    welcomeDiv.innerHTML = specialDiv
    promoDiv.innerHTML = " "
    promoDiv.setAttribute("style", "background-color:black")
    promoDiv.setAttribute("id", "mainui-features")


    try{
        document.getElementById("mainui-offers").setAttribute("style", "background-color:black;color:white;")
    }
    catch{
        //pass
    }

    try{
        document.getElementById("mainui-party").setAttribute("style", "background-color:black;color:white;")
    }
    catch{
        //pass
    }

    document.querySelector("div[id='adsLeft']").remove()
    document.querySelector("div[id='adsBottom']").remove()
    document.querySelector("div[id='adsRight']").remove()


    welcomeDiv.setAttribute("style", "background-color:black;color:white;");
    core.setMinimap(true);
    core.playersMinimap(true);
}


function Split() {
    var x = 0;
    var intervalID = window.setInterval(function() {
        window.onkeydown({ keyCode: 32});
        window.onkeyup({ keyCode: 32});
        if(++x === 4) window.clearInterval(intervalID);
    }, 60);
}


function Feed() {
    window.onkeydown({keyCode: 87});
    window.onkeyup({keyCode: 87});
}

function keydown(event) {
    if (event.keyCode == 87) {
        setTimeout(Feed, window.DURATION)
    }

    if (event.keyCode == 81) {
        Split()
    }
}

window.addEventListener('keydown', keydown);

window.user = {
    startedBots: false,
    isAlive: false,
    mouseX: 0,
    mouseY: 0,
    offsetX: 0,
    offsetY: 0,
    macroFeedInterval: null
}

function modifyCore(core){
    return core
        .replace(/(\w+)=~~\(\+\w+\[\w+\+\d+>>3]\+\s+\+\(\(\w+\[\w+\+\d+>>2]\|0\)-\(\(\w+\[\d+]\|0\)\/2\|0\)\|0\)\/\w+\);(\w+)=~~\(\+\w+\[\w+\+\d+>>3]\+\s+\+\(\(\w+\[\w+\+\d+>>2]\|0\)-\(\(\w+\[\d+]\|0\)\/2\|0\)\|0\)\/\w+\)/, `
            $&
            window.user.mouseX = $1 - window.user.offsetX
            window.user.mouseY = $2 - window.user.offsetY
        `)
        .replace(/\w+\[\w+\+272>>3]=(\w+);\w+\[\w+\+280>>3]=(\w+);\w+\[\w+\+288>>3]=(\w+);\w+\[\w+\+296>>3]=(\w+)/, `
            $&
            if(~~($3 - $1) === 14142 && ~~($4 - $2) === 14142){
                window.user.offsetX = ($1 + $3) / 2
                window.user.offsetY = ($2 + $4) / 2
            }
        `)
        .replace(/\(\.9,/, '(window.ZOOM_SPEED,')
        .replace(/;if\((\w+)<1\.0\)/, ';if($1 < (window.EXTENDED_ZOOM ? 0.05 : 1))')
        .replace(/(\w+\(\d+,\w+\|0,\.5,\.5\)\|0);(\w+\(\d+,\w+\|0,\.5,50\.5\)\|0);(\w+\(\d+,\w+\|0,\.5,\.5\)\|0);(\w+\(\d+,\w+\|0,50\.5,\.5\)\|0)/, `
            $1
            if(window.DRAW_MAP_GRID) $2
            $3
            if(window.DRAW_MAP_GRID) $4
        `)
        .replace(/while\(0\);(\w+)=\(\w+\|0\)!=\(\w+\|0\);/, `
            $&
            if(window.SHOW_ALL_PLAYERS_MASS) $1 = true
        `)
}


window.game = {
    url: '',
    protocolVersion: 0,
    clientVersion: 0
}


var a = `WebSocket.prototype.storedSend = WebSocket.prototype.send
WebSocket.prototype.send = function(buffer){
    this.storedSend(buffer)
    const dataView = new DataView(new Uint8Array(buffer).buffer)
    if(!window.game.protocolVersion && dataView.getUint8(0) === 254) window.game.protocolVersion = dataView.getUint32(1, true)
    else if(!window.game.clientVersion && dataView.getUint8(0) === 255) window.game.clientVersion = dataView.getUint32(1, true)
}`


new MutationObserver(mutations => {
    mutations.forEach(({addedNodes}) => {
        addedNodes.forEach(node => {
            if(node !== null){
                if(node.nodeType === 1 && node.tagName === 'SCRIPT' && node.src && node.src.includes('agario.core.js')){
                    node.type = 'javascript/blocked'
                    node.parentElement.removeChild(node)
                    fetch(node.src)
                        .then(res => res.text())
                        .then(core => {
                        Function(modifyCore(core))()
                        setTimeout(() => {
                            setGUI()
                        }, 5000)
                    })
                }
            }})
    })
}).observe(document.documentElement, {
    childList: true,
    subtree: true
})