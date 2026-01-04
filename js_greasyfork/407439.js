// ==UserScript==
// @name         respawn script for tricksplit.io
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  instantly respawn with a press of a button
// @author       sos
// @match        https://tricksplit.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407439/respawn%20script%20for%20tricksplitio.user.js
// @updateURL https://update.greasyfork.org/scripts/407439/respawn%20script%20for%20tricksplitio.meta.js
// ==/UserScript==
var socialKeys = document.getElementsByClassName('main')[0];
var menu = document.getElementsByClassName('menu');
var endPanel = document.getElementsByClassName('end');
var closePanel = document.getElementsByClassName('closePanel');
window.onload = function(){
    closePanel[0].click(); // automaticlly closes the newSkins window at the start of the game
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    setTimeout(startCollection, 5000);
    createKeys('Respawn', "respawn", 1, "text", "30px");
    createKeys('Freeze', "freeze", 1, "text", "30px");
    createKeys('FakeClip', "fake", 1, "text", "30px");
    createKeys('animationDelay', "animD", 4, "text","60px");
    setInterval(function () {
        if (document.getElementById('animD').value != '') {
            setInterval(function() {
                window.game.animationDelay = document.getElementById('animD').value; // Set this to any animation delay you want, !WARNING! if you set the animation delay below 1, your game is not gonna work
            }, 1000)
        }
    }, 1000)
    setInterval(function () {
        localStorage.setItem('respawnKey', document.getElementById('respawn').value);
        localStorage.setItem('freezeKey', document.getElementById('freeze').value);
        localStorage.setItem('fakeClipKey', document.getElementById('fake').value);
        localStorage.setItem('animD', document.getElementById('animD').value);
    }, 2000)
    var rK = localStorage.getItem('respawnKey');
    var fK = localStorage.getItem('freezeKey');
    var fcK = localStorage.getItem('fakeClipKey');
    var animD = localStorage.getItem('animD');
    document.getElementById('respawn').value = rK;
    document.getElementById('freeze').value = fK;
    document.getElementById('fake').value = fcK;
    document.getElementById('animD').value = animD;
};
function startCollection() {
    var freeCoins = document.getElementById("freeCoins");
    freeCoins.onclick = function() {
        console.log('auto coins collection started');
        window.game.api.utils.claimFreeCoins();
        setInterval(collectCoins, 7210000);
    }
}
function collectCoins() {

    window.game.api.utils.claimFreeCoins();

}
function keydown(event) {
    if (event.keyCode == document.getElementById('respawn').value.charCodeAt(0) - 32 && window.game.chat.focused === false) {
        spawn();
    }
    if (event.keyCode == document.getElementById('freeze').value.charCodeAt(0) - 32 && window.game.chat.focused === false) {
        var X = window.innerWidth/2;
        var Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
    if (event.keyCode == document.getElementById('fake').value.charCodeAt(0) - 32 && window.game.chat.focused === false) {
        window.game.socket.split();
        setTimeout(function() {
            window.game.socket.send(new Uint8Array([0x33]))
            setTimeout(function() {
                window.game.socket.send(new Uint8Array([0x18]))
            }, 400)
        }, 500)
    }
}
function keyup(event) {
    if (event.keyCode == 68) {
        return;
    }
    if (event.keyCode == document.getElementById('freeze').value.charCodeAt(0) - 32) {
        var X2 = window.innerWidth;
        var Y2 = window.innerHeight;
        $("canvas").trigger($.Event("mousemove", {clientX: X2, clientY: Y2}));
    }
}
function spawn() {
    if (menu[0].style.display === "none") {
        window.game.socket.onClose("xd");
        endPanel[0].style.display = "none";
        document.getElementById('overlays').style.display = "none";
        setTimeout(function() {
            window.game.spawn();
        }, 1000);
    }
}

function createKeys(name, id, maxlength, type, width) {
    var hotKey = document.createElement("div");
    hotKey.setAttribute("class", "hotkey");
    hotKey.setAttribute("style", "margin-bottom:5px")
    socialKeys.appendChild(hotKey);
    var hotKeyName = document.createElement("div");
    hotKeyName.setAttribute("class", "hotkeyName");
    hotKeyName.innerText = name;
    hotKey.appendChild(hotKeyName);
    var hotKeyCode = document.createElement("div");
    hotKeyCode.setAttribute("class", "hotkeyCode");
    hotKey.appendChild(hotKeyCode);
    var hotKeyInput = document.createElement("div");
    hotKeyInput.setAttribute("class", "hotkeyInput");
    hotKeyCode.appendChild(hotKeyInput);
    var keyInput = document.createElement("input");
    //keyInput.setAttribute("class", "keyCode");
    keyInput.setAttribute("type", type);
    keyInput.setAttribute("maxlength", maxlength);
    keyInput.setAttribute("id", id);
    keyInput.setAttribute("style", "text-align:center;background-color:#adadae;text-transform:capitalize;font-size:24px;width:" + width + ";position:absolute; right:250%");
    hotKeyInput.appendChild(keyInput);
}

//     https://docstore.mik.ua/orelly/webprog/DHTML_javascript/0596004672_jvdhtmlckbk-app-b.html     \\ Link for key codes numbers