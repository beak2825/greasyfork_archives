// ==UserScript==
// @name         Keystrokes for Sploop.io
// @version      0.4
// @description  Keystrokes made for Sploop.io! | For support please join our Discord - https://discord.gg/zpVgaMdrrd
// @author       Ashureth
// @match        *://*sploop.io/*
// @license MIT
// @grant        none
// @namespace Keystrokes
// @downloadURL https://update.greasyfork.org/scripts/463482/Keystrokes%20for%20Sploopio.user.js
// @updateURL https://update.greasyfork.org/scripts/463482/Keystrokes%20for%20Sploopio.meta.js
// ==/UserScript==

// VERSIONS

/*
0.2 - Fixed some key bugs
0.3 - Fixed so that keys don't react when you're chatting or if you are in the clan tab.
0.4 - Added some smooth color changing to the keystrokes
*/


function Blocking() {
    return document.getElementById('chat-wrapper').offsetParent == null && document.getElementById('clan-menu').offsetParent == null && document.getElementById('play-text').offsetParent == null;
}

let html = `
<html>

    <style>
    .KeyBoard {
    position: absolute;
    width: 300px;
    height: 200px;
    top: 200px;
    left: -50px;
    padding: 15px;
    text-align: center;
    border-radius: 15px;
}
.line {
    width: 300px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.line2 {
    width: 300px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.Key {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    width: 50px;
    height: 50px;
    left: 0px;
    top: 0px;
    border: 3px solid black;
    background: #2F3336;
    color: #fff;
    margin: 5px;
    border-radius: 12px;
    box-shadow: 0px 0px 5px hsl(0, 0%, 0%);
    overflow: hidden;
    transition: .2s ease-in-out;
}
.Space {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    width: 200px;
    height: 50px;
    left: 0px;
    top: 0px;
    border: 3px solid black;
    background: #2F3336;
    color: #fff;
    margin: 2px;
    border-radius: 12px;
    box-shadow: 0px 0px 10px hsl(0, 0%, 0%);
    overflow: hidden;
}
.keyText {
    font-family: Helvetica;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-shadow: 0px 0px 10px hsl(0, 0%, 100%);
}


    </style>
<head>

<html>
    <head>
    </head>
    <body></body>
</html>

    <div class="KeyBoard" id='keyboard'>
        <div class="line">
            <div class="Key" id="keyQ">
                <span class="keyText">Q</span>
            </div>
            <div class="Key" id="keyW">
                <span class="keyText">W</span>
            </div>
            <div class="Key" id="keyE">
                <span class="keyText">E</span>
            </div>
        </div>
        <div class="line2">
            <div class="Key" id="keyA">
                <span class="keyText" id="keyA">A</span>
            </div>
            <div class="Key" id="keyS">
                <span class="keyText">S</span>
            </div>
            <div class="Key" id="keyD">
                <span class="keyText">D</span>
            </div>
        </div>
        <div class="line">
            <div class="Space" id="keySpace">
                <span class="keyText">━━━━━</span>
            </div>
        </div>
    </div>
</head>

<body>
</body>

</html>
`

let backgroundd = document.getElementById('backgroundd');


let HeldKeys = [];
let EToggle = false;

setInterval(() => {

    if(document.getElementById('play-text').offsetParent !== null) {
        EToggle = false;
    }

    var Element;

    let arr = ['W', 'A', 'S', 'D', 'E', 'Q', 'Space'];

    for(let i of arr) {
        i != 'E' && document.getElementById(`key${i}`) && (document.getElementById(`key${i}`).style.background = '#2F3336');
    }


    for(let Key in HeldKeys) {
        if(HeldKeys[Key] != 'E' && HeldKeys[Key] != null) {
            Element = document.getElementById(`key${HeldKeys[Key]}`);

            if(Element) {
                Element.style.background = '#52585e'
            }
        } else {
            Element = document.getElementById(`keyE`);

            Element.style.background = EToggle ? '#52585e' : '#2F3336';

        }
    }
});

document.body.insertAdjacentHTML('beforeend', html);

let game = document.getElementById('game-canvas');

window.addEventListener('keydown', e => {
    if(!Blocking()) return;
    let isSpace = e.key === ' ';
    if(isSpace) {
        HeldKeys['Space'] = 'Space';
    } else {
        if(e.key == 'e') {
            EToggle = !EToggle;
        } else {
            HeldKeys[e.key.toUpperCase()] = e.key.toUpperCase();
        }
    }
});
window.addEventListener('keyup', e => {
    let isSpace = e.key === ' ';
    if(isSpace) {
        HeldKeys['Space'] = null;
    } else {
        HeldKeys[e.key.toUpperCase()] = null;
    }
});