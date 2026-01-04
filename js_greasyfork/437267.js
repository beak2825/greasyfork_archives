// ==UserScript==
// @name KeyBoard Panel v2
// @namespace </>Nudo#3310
// @version 0.2
// @description The best public keyboard panel in Sploop.io !  Next to the inscription "MADE BY NUDO" you can change the color of the text on the keyboard and it is saved after page reload. When you press the button, the keyboard will show that you have enabled the automatic attack, and will be highlighted in blue. Also on X.
// @author Nudo
// @match *://sploop.io/*
// @match *://moomoo.io/*
// @match *://*.moomoo.io/*
// @icon https://media.discordapp.net/attachments/878345257786429471/922818957159829534/favicons_1_1.png
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/437267/KeyBoard%20Panel%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/437267/KeyBoard%20Panel%20v2.meta.js
// ==/UserScript==

/* Re-enable contextmenu on the right mouse button.
let elm = document.getElementsByTagName('*')
for(let i = 0; i < elm.length; ++i) {
  elm[i].oncontextmenu = null
}
*/

let fps = {
    old: Date.now(),
    count: 0,
    result: null,
    updateTime: 750
}

function updateFPS() {
    let newDate = Date.now(),
        lastDate = newDate - fps.old
    if (lastDate < fps.updateTime) ++fps.count
    else {
        fps.result = Math.round(fps.count / (lastDate / 1000))
        if ($('#ping').css('display') == 'inline-flex') $("#ping > i").text('Ping: ' + (window.pingTime != undefined ? window.pingTime : 0))
        $("#fps > i").text('Fps: ' + fps.result)
        fps.count = 0
        fps.old = newDate
    }
    requestAnimationFrame(updateFPS)
}
requestAnimationFrame(updateFPS)

let keyBoard = `
<div class="key-holder">
  <span class="fp" style="width: calc(100% - 10px); height: 40px; padding: 0;"><i>Made by Nudo</i><input type="color" id="keyBoardText-color" value="#ffffff" style="margin-left: 5px;"></span><br>
  <span class="key" id="keyQ"><i>q</i></span>
  <span class="key" id="keyW"><i>w</i></span>
  <span class="key" id="keyE"><i>e</i></span>
  <span class="key" id="keyR"><i>r</i></span><br>
  <span class="key" id="keyA"><i>a</i></span>
  <span class="key" id="keyS"><i>s</i></span>
  <span class="key" id="keyD"><i>d</i></span>
  <span class="key" id="keyF"><i>f</i></span><br>
  <span class="key" id="keySpace" style="width: 210px"><i>&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;</i></span>
  <span class="key" id="keyX"><i>x</i></span><br>
  <span class="cps" style="width: 135px; height: 40px; padding: 0;" id="lCps"><i>LCps: 0</i></span>
  <span class="cps" style="width: 135px; height: 40px; padding: 0;" id="rCps"><i>RCps: 0</i></span><br>
  <span class="fp" id="fps" style="margin-left: 75px; width: 135px; height: 40px; padding: 0;"><i>Fps: 0</i></span>
  <span class="fp" id="ping" style="display: none; width: 135px; height: 40px; padding: 0;" ><i>Ping: 0</i></span>
</div>
<style>
.key-holder {
  position: absolute;
  top: 20px;
  left: 20px;
}
.key, .cps, .fp {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 8px;
  padding-right: 2px;
  border-radius: 10px;
  margin: 5px 5px;
  width: 60px;
  height: 60px;
  background: linear-gradient(180deg, rgba(41, 41, 41, 0.69), rgba(33, 33, 33, 0.54));
  box-shadow: inset -8px 0 8px rgba(0,0,0,.15), inset 0px -8px 8px rgba(0,0,0,.25), 0 0 0 2px rgba(0,0,0,.75), 10px 20px 25px rgba(0, 0, 0, .4);
  overflow: hidden;
}
.key::before {
  content: '';
  position: absolute;
  padding: 5px;
  top: 3px;
  left: 4px;
  bottom: 7px;
  right: 7px;
  background: linear-gradient(90deg, rgba(36, 36, 36, 0.78), rgba(74, 74, 74, 0.75));
  border-radius: 10px;
  box-shadow: -10px -10px 10px rgba(255, 255, 255, .25), 10px 5px 10px rgba(0, 0, 0, .15);
  border-left: 1px solid #0004;
  border-bottom: 1px solid #0004;
  border-top: 1px solid #0004;
}
.key i, .cps i, .fp i {
  position: relative;
  color: white;
  font-style: normal;
  font-size: 25px;
  text-transform: uppercase;
  text-shadow: rgb(20 20 20) 3px 0px 0px, rgb(20 20 20) 2.83487px 0.981584px 0px, rgb(20 20 20) 2.35766px 1.85511px 0px, rgb(20 20 20) 1.62091px 2.52441px 0px, rgb(20 20 20) 0.705713px 2.91581px 0px, rgb(20 20 20) -0.287171px 2.98622px 0px, rgb(20 20 20) -1.24844px 2.72789px 0px, rgb(20 20 20) -2.07227px 2.16926px 0px, rgb(20 20 20) -2.66798px 1.37182px 0px, rgb(20 20 20) -2.96998px 0.42336px 0px, rgb(20 20 20) -2.94502px -0.571704px 0px, rgb(20 20 20) -2.59586px -1.50383px 0px, rgb(20 20 20) -1.96093px -2.27041px 0px, rgb(20 20 20) -1.11013px -2.78704px 0px, rgb(20 20 20) -0.137119px -2.99686px 0px, rgb(20 20 20) 0.850987px -2.87677px 0px, rgb(20 20 20) 1.74541px -2.43999px 0px, rgb(20 20 20) 2.44769px -1.73459px 0px, rgb(20 20 20) 2.88051px -0.838247px 0px;
}

input[type="color"] {
  -webkit-appearance: none;
  border: none;
  width: 29px;
  height: 28px;
  background: none;
  cursor: pointer;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  outline: 0;
  display: block;
  border: none;
  border-radius: 50px;
  box-shadow: inset 0px 0px 5px #212121;
  border: 1px solid #141414;
}
</style>
`
$('body').append(keyBoard)

if (window.location.href.includes('sploop')) {
    $('#google_play').remove()
} else {
    $('#fps').css('margin-left', '5px')
    $('#ping').css('display', 'inline-flex')
    $('.key, .cps, .fp').css('height', '40px')
}

$('.key i, .cps i, .fp i').css('color', localStorage.getItem('keyBoard_color'))
$('.fp #keyBoardText-color').val(localStorage.getItem('keyBoard_color') || '#ffffff')

document.querySelector('.fp #keyBoardText-color').oninput = () => {
    let val = $('.fp #keyBoardText-color').val()
    localStorage.setItem('keyBoard_color', val)
    $('.key i, .cps i, .fp i').css('color', val)
}

let active = {
    keyQ: false,
    keyW: false,
    keyE: false,
    keyR: false,
    keyA: false,
    keyS: false,
    keyD: false,
    keyF: false,
    keySpace: false,
    keyX: false,
    lCps: 0,
    rCps: 0
}

function changeBackground(id) {
    $(id).css('background', 'linear-gradient(180deg, rgba(47, 142, 71, 0.69), rgba(29, 88, 44, 0.69))')
}

function rechangeBackground(id, activeKey) {
    if (activeKey == true) {
        setTimeout(() => {
            $(id).css('background', 'linear-gradient(180deg, rgba(41, 41, 41, 0.69), rgba(33, 33, 33, 0.54))')
        }, 500)
    }
}

function autoAttackCheck() {
    if (active.keyE) {
        $('#keyE').css('background', 'linear-gradient(180deg, rgba(41, 41, 41, 0.69), rgba(33, 33, 33, 0.54))')
        active.keyE = false
    } else {
        $('#keyE').css('background', 'linear-gradient(180deg, rgba(47, 123, 142, 0.69), rgba(29, 79, 88, 0.69))')
        active.keyE = true
    }
}

function lockDirCheck() {
    if (active.KeyX) {
        $('#keyX').css('background', 'linear-gradient(180deg, rgba(41, 41, 41, 0.69), rgba(33, 33, 33, 0.54))')
        active.KeyX = false
    } else {
        $('#keyX').css('background', 'linear-gradient(180deg, rgba(47, 123, 142, 0.69), rgba(29, 79, 88, 0.69))')
        active.KeyX = true
    }
}

document.addEventListener("mousedown", downButton, false)

document.addEventListener("mouseup", upButton, false)

function downButton(e) {
    if (e.button == 0) {
        active.lCps++
        $('#lCps').css('background', 'linear-gradient(180deg, rgba(142, 63, 47, 0.69), rgba(88, 39, 29, 0.69))')
        $('#lCps > i').text(`LCps: ${active.lCps}`)
        setTimeout(() => {
            active.lCps--
            $('#lCps').css('background', 'linear-gradient(180deg, rgba(41, 41, 41, 0.69), rgba(33, 33, 33, 0.54))')
            $('#lCps > i').text(`LCps: ${active.lCps}`)
        }, 1000)
    }
    if (e.button == 2) {
        active.rCps++
        $('#rCps').css('background', 'linear-gradient(180deg, rgba(142, 63, 47, 0.69), rgba(88, 39, 29, 0.69))')
        $('#rCps > i').text(`RCps: ${active.rCps}`)
        setTimeout(() => {
            active.rCps--
            $('#rCps').css('background', 'linear-gradient(180deg, rgba(41, 41, 41, 0.69), rgba(33, 33, 33, 0.54))')
            $('#rCps > i').text(`RCps: ${active.rCps}`)
        }, 1000)
    }
}

function upButton(e) {
    if (e.button == 0) {
        $('#lCps').css('background', 'linear-gradient(180deg, rgba(142, 63, 47, 0.69), rgba(88, 39, 29, 0.69))')
        $('#lCps > i').text(`LCps: ${active.lCps}`)
    }
    if (e.button == 2) {
        $('#rCps').css('background', 'linear-gradient(180deg, rgba(142, 63, 47, 0.69), rgba(88, 39, 29, 0.69))')
        $('#RCps > i').text(`RCps: ${active.rCps}`)
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code == 'KeyQ') (changeBackground('#keyQ'), active.keyQ = true)
    if (e.code == 'KeyW') (changeBackground('#keyW'), active.keyW = true)
    if (e.code == 'KeyE' && $('#homepage').css('display') != 'flex') autoAttackCheck()
    if (e.code == 'KeyR') (changeBackground('#keyR'), active.keyR = true)
    if (e.code == 'KeyA') (changeBackground('#keyA'), active.keyA = true)
    if (e.code == 'KeyS') (changeBackground('#keyS'), active.keyS = true)
    if (e.code == 'KeyD') (changeBackground('#keyD'), active.keyD = true)
    if (e.code == 'KeyF') (changeBackground('#keyF'), active.keyF = true)
    if (e.code == 'Space') (changeBackground('#keySpace'), active.keySpace = true)
    if (e.code == 'KeyX' && $('#homepage').css('display') != 'flex') lockDirCheck()
})

document.addEventListener('keyup', (e) => {
    if (e.code == 'KeyQ') rechangeBackground('#keyQ', active.keyQ)
    if (e.code == 'KeyW') rechangeBackground('#keyW', active.keyW)
    if (e.code == 'KeyR') rechangeBackground('#keyR', active.keyR)
    if (e.code == 'KeyA') rechangeBackground('#keyA', active.keyA)
    if (e.code == 'KeyS') rechangeBackground('#keyS', active.keyS)
    if (e.code == 'KeyD') rechangeBackground('#keyD', active.keyD)
    if (e.code == 'KeyF') rechangeBackground('#keyF', active.keyF)
    if (e.code == 'Space') rechangeBackground('#keySpace', active.keySpace)
})
