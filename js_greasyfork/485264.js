// ==UserScript==
// @name         Mario ModMenu [N] to hide menu
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Including: ESP, Fly Hack, Infinity Coins, Freeze Enemies, Kill Enemies, Invincibility, Custom Background Color  Infinity Score, Infinity Time, Infinity Lives!
// @author       You
// @license      MIT
// @match        https://gamaverse.com/c/f/g/super-mario-bros/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamaverse.com
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/485264/Mario%20ModMenu%20%5BN%5D%20to%20hide%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/485264/Mario%20ModMenu%20%5BN%5D%20to%20hide%20menu.meta.js
// ==/UserScript==

window.addEventListener('load', function() {

if(location.href=="https://gamaverse.com/c/f/g/super-mario-bros/") {

var ww = document.createElement('div')
ww.id="modWrap"
ww.innerHTML=`
<a id="title">GabiMod</a>
<div id="mods">
    <div id="checks">
    <div class="checkW">
        <input class="check" type="checkbox">
        <a class="checkDesc">Player ESP</a>
    </div>
    <div class="checkW">
        <input class="check" type="checkbox">
        <a class="checkDesc">Enemy ESP</a>
    </div>
    <div class="checkW">
        <input class="check" type="checkbox">
        <a class="checkDesc">Tracers</a>
    </div>
    <div class="checkW">
        <input class="check" type="checkbox">
        <a class="checkDesc">Distance</a>
    </div>
    <div class="checkW">
        <input class="check" type="checkbox">
        <a class="checkDesc">Star</a>
    </div>
    <div class="checkW">
        <input class="check" type="checkbox">
        <a class="checkDesc">Freeze Entities</a>
    </div>
    <div class="checkW">
        <input class="check" type="checkbox">
        <a class="checkDesc">Fly Hack</a>
    </div>
    <div class="checkW">
        <input class="check" type="checkbox">
        <a class="checkDesc">Invincible</a>
    </div>
    </div>
    <br>
    <div id="values">
    <div class="mod">
        <input type="text" class="modInput" placeholder="Set Coins">
        <input type="button" class="modBtn" value="Apply">
    </div>
    <div class="mod">
        <input type="text" class="modInput" placeholder="Set Score">
        <input type="button" class="modBtn" value="Apply">
    </div>
    <div class="mod">
        <input type="text" class="modInput" placeholder="Set Lives">
        <input type="button" class="modBtn" value="Apply">
    </div>
    <div class="mod">
        <input type="text" class="modInput" placeholder="Set Gravity">
        <input type="button" class="modBtn" value="Apply">
    </div>
    <div class="mod">
        <input type="text" class="modInput" placeholder="Set Time">
        <input type="button" class="modBtn" value="Apply">
    </div>
    <div class="mod">
        <input type="text" class="modInput" placeholder="Set BG Color">
        <input type="button" class="modBtn" value="Apply">
        </div>
    </div>
    <div id="buttonMods">
    <button class="buttonMod">Turn Big</button>
    <button class="buttonMod">Shoot Flames</button>
    <button class="buttonMod">Kill Nearby Enemies</button>
    <button class="buttonMod">Remove Bushes</button>
    <button class="buttonMod">Remove Clouds</button>
    <button class="buttonMod">Remove Hills</button>
    <button class="buttonMod">Remove Pipes</button>
    <button class="buttonMod">Remove Bricks</button>
    <button class="buttonMod">Remove Mystery Blocks</button>
    <button class="buttonMod">Remove Stones</button>
    </div>
</div>

<style>
    ::-webkit-scrollbar {
        width: 0.8vw;
    }

    ::-webkit-scrollbar-thumb {
        background: rgb(151, 151, 151);
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #c7c7c7;
    }

    #title {
        position: relative;
        display: inline-block;
        height: 0;
        top: 1%;
        font-size: 10pt;
        color: c6c6c6;
    }

    #modWrap {
        z-index: 3232;
        position: absolute;
        font-family: "Lucida Console", "Courier New", monospace;
        border: 2px #505050 solid;
        border-radius: 0.5vw;
        background: black;
        user-select: none;
        opacity: 0.95;
        height: 20vw;
        width: 17vw;
    }


    #mods {
        position: relative;
        overflow-y: scroll;
        overflow-x: hidden;
        height: 79%;
        top: 10%;

    }

    #checks {
        text-align: left;
        position: relative;
        top: 2%;
        left: 5%;
    }

    .checkW {
        margin-top: 2%;
    }

    .check {
        outline: #acacac 1px solid;
        vertical-align: middle;
        appearance: none;
        border-radius: 30%;
        height: 1.3vw;
        width: 1.3vw;
        top: 30%;
    }

    .check:checked {
        background-color: #acacac;
    }

    .checkDesc {
        color: white;
        font-size: 1.2vw;
    }


    #values {
        position: relative;
    }

    .mod {
        position: relative;
        margin-bottom: 3%;
        margin-top: 3%;
    }


    .modInput {
        border-radius: 0.4vw 0 0 0.4vw;
        border: 2px #505050 solid;
        background: #b0b0b0;
        height: 18%;
        width: 60%;
    }

    .modInput,
    ::-webkit-input-placeholder {
        position: relative;
        color: #505050;
        left: 4%;
    }

    .modInput:focus {
        outline: none
    }

    .modBtn {
        border-radius: 0 0.4vw 0.4vw 0;
        border: 2px #505050 solid;
        background: #505050;
        transition: all 0.3s;
        position: relative;
        font-size: 10pt;
        color: #c0c0c0;
        height: 18%;
        width: 25%;
        left: -1%;
    }
    .modBtn:hover {
        background: #707070;
    }


    #buttonMods {
        position: absolute;
        left: 3%;
        height: 100%;
    }
    .buttonMod {
        border: 2px #c0c0c0 solid;
        background: #505050;
        transition: all 0.3s;
        border-radius: 0.4vw;
        margin-bottom: 2%;
        margin-top: 2%;
        color: #d0d0d0;
        height: 14%;
        width: 90%;

    }
    .buttonMod:hover {
        background: #707070;
    }
</style>`
document.body.appendChild(ww)
var title = document.getElementById('title')
var gui = document.getElementById('modWrap')

window.onload = addListeners();


function addListeners(){
    title.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);
}
function mouseUp() {
    window.removeEventListener('mousemove', divMove, true);
    document.body.style.userSelect="all"
}

function mouseDown(e){
    document.body.style.userSelect="none"
    window.addEventListener('mousemove', divMove, true);
}

function divMove(e) {
    gui.style.left=e.clientX-110+"px"
    gui.style.top=e.clientY-10+"px"
}





var pEsp = false;
var eEsp = false;
var tracer = false;
var eDis = false;
var invi = false;
var canvas = document.querySelector("body > canvas")



drawThingOnCanvas = (function() {
    var cached_function = drawThingOnCanvas;
    return function() {
        var result = cached_function.apply(this, arguments); // use .apply() to call it
        updateDrawings() // <- add this function to update function
        return result;
    };
})()

function updateDrawings() {
    for(var i=0;i<characters.length;i++) {
        if(characters[i].type=="mario" && pEsp==true) {
            context.beginPath()
            context.strokeStyle="#00ff00"
            context.strokeRect(
                characters[i].left,
                characters[i].top,
                characters[i].width*4,
                characters[i].height*4
            )
            context.stroke()
        }
        if(characters[i].collide.name=='collideEnemy' || characters[i].collide.name=='nc') {
            var dx = mario.left-characters[i].left
            var dy = mario.top-characters[i].top
            var distance = Math.round(Math.sqrt(dx*dx+dy*dy))
            if(abs(distance)<canvas.width-mario.left-50) {


                if(characters[i].type!="mario" && eEsp==true) {
                    context.beginPath()
                    context.strokeStyle="#ff0000"
                    context.strokeRect(
                        characters[i].left,
                        characters[i].top,
                        characters[i].width*4,
                        characters[i].height*4
                    )
                    context.stroke()
                }

                if(characters[i].type!="mario" && tracer==true) {
                    console.log(characters[i].type)
                    context.beginPath()
                    context.moveTo(mario.left+15,mario.top+10)
                    context.lineTo(characters[i].left+13,characters[i].top+10)
                    context.strokeStyle="#00ff00"
                    context.stroke()
                }
                if(characters[i].type!="mario" && eDis==true) {
                    context.fillStyle = "blue";
                    context.font = "bold 10px Arial";
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.rotate(40+"deg")
                    context.fillText(distance, ((characters[i].left+mario.left)/2), ((mario.top+characters[i].top)/2));
                }
            }
        }
    }
}
var flyUpT
var flyUpF
var flyE = 0

document.addEventListener('keydown', (e) => {
    if(flyE==1) {
        if (e.key=="ArrowUp" || e.key==" " || e.key=="w") {
            keydown(32)
            mario.gravity=-1
            mario.yvel=0;
        }
        if(e.key=="ArrowDown" || e.key=="s") {
            keydown(32)
            mario.gravity=1
            mario.yvel=0;
        }
    }
})
document.addEventListener('keyup', (e) => {
    if(flyE==1) {
        if (e.key=="ArrowUp" || e.key==" " || e.key=="w") {
            keyup(32)
            mario.gravity=0.00000001
            mario.yvel=0;
        }
        if(e.key=="ArrowDown" || e.key=="s") {
            keyup(32)
            mario.gravity=0.000000001
            mario.yvel=0;
        }
    }
})



var check = document.getElementsByClassName("check")
var modBtn = document.getElementsByClassName("modBtn")
var modInput = document.getElementsByClassName("modInput")
var modInput = document.getElementsByClassName("modInput")
var buttonMod = document.getElementsByClassName("buttonMod")




check[0].addEventListener('click', (e) => {
    if(check[0].checked==true) {
        pEsp = true;
    }
    else {
        pEsp = false
    }
})
check[1].addEventListener('click', (e) => {
        if(check[1].checked==true) {
        eEsp = true;
    }
    else {
        eEsp = false
    }
})
check[2].addEventListener('click', (e) => {
    if(check[2].checked==true) {
        tracer = true;
    }
    else {
        tracer = false
    }
})
check[3].addEventListener('click', (e) => {
    if(check[3].checked==true) {
        eDis = true;
    }
    else {
        eDis = false
    }
})
check[4].addEventListener('click', (e) => {
    if(check[4].checked==true) {

        ++mario.star;
        play("Powerup.wav");
        playTheme("Starman", true);
        addEvent(marioRemoveStar, 549849343343, mario);
        switchClass(mario, "normal", "star");
        addSpriteCycle(mario, ["star1", "star2", "star3", "star4"], "star", 5);
    }
    else {

var me = mario
    mario.star=0;
    addEvent(marioRemoveStar, 0, mario);
    switchClass(mario, "star", "normal");
    clearAllCycles(mario, ["star1", "star2", "star3", "star4"], "star", 5);
    }
})
var freeze
check[5].addEventListener('click', (e) => {
    if(check[5].checked==true) {
        freeze = setInterval(function() {
            for(var i=0;i<characters.length;i++) {
                if(characters[i].type!="mario") {
                    if(characters[i].xvel<-1) {
                        characters[i].lastSpeed = characters[i].speed
                        characters[i].xvel=0
                    }
                    if(characters[i].xvel>-1) {
                        characters[i].lastSpeed = -characters[i].speed
                        characters[i].xvel=0
                    }
                }
            }
        },300)
    }
    else {
        clearInterval(freeze)
        for(var i=0;i<characters.length;i++) {
            if(characters[i].type!="mario") {
                characters[i].xvel=characters[i].lastSpeed
            }
        }
    }
})
check[6].addEventListener('click', (e) => {
     flyE ^= true

    if(flyE==0) {
        mario.gravity=0.48
    }
})
var invii
check[7].addEventListener('click', (e) => {
    if(check[7].checked==true) {
        invii = setInterval(function() {
            for(var i=0;i<characters.length;i++) {
                if(characters[i].collide.name=='collideEnemy') {
                    characters[i].collide = function nc() {}
                }
            }
        },500)
    }
    else {
        clearInterval(invii)
        for(var i=0;i<characters.length;i++) {
            if(characters[i].collide.name=='nc') {

                characters[i].collide = (function() {
                    var cf = collideEnemy
                    return function() {
                        var res = cf.apply(this,arguments)
                        return res
                    }
                })()
            }

        }
    }
})
modBtn[0].addEventListener('click', function() {
    data.coins.amount=parseInt(modInput[0].value)
    updateDataElement(data.coins)
})
modBtn[1].addEventListener('click', function() {
    data.score.amount=parseInt(modInput[1].value)
    updateDataElement(data.score)
})
modBtn[2].addEventListener('click', function() {
    data.lives.amount=parseInt(modInput[2].value)
    updateDataElement(data.lives)
})
modBtn[3].addEventListener('click', function() {
    mario.gravity=parseInt(modInput[3].value)/30
})
modBtn[4].addEventListener('click', function() {
    data.time.amount=parseInt(modInput[4].value)
    updateDataElement(data.time)
})
modBtn[5].addEventListener('click', function() {
    map.area.fillStyle=modInput[5].value
})
function remScenery(name) {
    for(var i=0;i<scenery.length;i++) {
        if(scenery[i].title.includes(name)) {
            fireExplodes(scenery[i])
        }
    }
}

buttonMod[0].addEventListener('click', function() {
    mario.shrooming = true;
    mario.power=2
    marioGetsBig(mario)
    storeMarioStats();
})
buttonMod[1].addEventListener('click', function() {
    mario.shrooming = true;
    mario.power=3
    marioGetsBig(mario)
    marioGetsFire(mario)
    storeMarioStats();
})
buttonMod[2].addEventListener('click', function() {
    for(var i=0;i<characters.length;i++) {
        if(characters[i].type=="goomba" || characters[i].type=="koopa") {
            fireExplodes(characters[i])
        }
    }
})
buttonMod[3].addEventListener('click', function() {
    remScenery("Bush")
})
buttonMod[4].addEventListener('click', function() {
    remScenery("Cloud")
})
buttonMod[5].addEventListener('click', function() {
    remScenery("Hill")
})
buttonMod[6].addEventListener('click', function() {
    for(var i=0;i<solids.length;i++) {
        if(solids[i].title=="Pipe") {
            fireExplodes(solids[i])
        }
    }
})
buttonMod[7].addEventListener('click', function() {
    for(var i=0;i<solids.length;i++) {
        if(solids[i].title=="Brick") {
            fireExplodes(solids[i])
        }
    }
})
buttonMod[8].addEventListener('click', function() {
    for(var i=0;i<solids.length;i++) {
        if(solids[i].title=="Block") {
            fireExplodes(solids[i])
        }
    }
})
buttonMod[9].addEventListener('click', function() {
    for(var i=0;i<solids.length;i++) {
        if(solids[i].title=="Stone") {
            fireExplodes(solids[i])
        }
    }
})

var hideMenu = 0;

document.addEventListener('keydown', (e) => {
    if(e.key=="n") {
        if(hideMenu==0) {
            document.getElementById('modWrap').style.display="none"
        }
        if(hideMenu==1) {
            document.getElementById('modWrap').style.display=""
        }
        hideMenu ^= true;

    }
})

}
}, false);