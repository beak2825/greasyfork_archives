// ==UserScript==
// @name         Gota Addons
// @namespace    https://greasyfork.org/en/scripts/404047-gotachat
// @version      1.4
// @description  Some random shit to add to the game lmao
// @author       Specy
// @match        *://gota.io/web*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404047/Gota%20Addons.user.js
// @updateURL https://update.greasyfork.org/scripts/404047/Gota%20Addons.meta.js
// ==/UserScript==
//screenshot with CTRL+ALT

var fontURL = "https://dl.dropboxusercontent.com/s/3n1m38jyg2zg96e/Sectar-GOqrO.otf?dl=0"
//Example: https://dl.dropboxusercontent.com/s/3n1m38jyg2zg96e/Sectar-GOqrO.otf?dl=0
if(fontURL!=""){
    var cssString = "@font-face { font-family: 'Verdana'; font-weight: normal; font-style: normal; src: url('"+fontURL+"')}"
    var head = document.getElementsByTagName('head')[0]
    var newCss = document.createElement('style')
    newCss.type = "text/css"
    newCss.innerHTML = cssString
    head.appendChild(newCss)
}

var canvas = document.getElementById("canvas")
document.getElementById("score-panel").style.maxWidth = "none"
document.getElementById("score-panel").style.maxWidth = "1000px"
document.addEventListener("keydown",
    function KeyPress(e) {
        var evtobj = window.event ? event : e
        if(evtobj.altKey && evtobj.shiftKey) {
            canvas.toBlob((blob) => {
                saveBlob(blob, `gotascreen.png`);
            });
        }
    })
const saveBlob = (function() {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    return function saveData(blob, fileName) {
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
    };
}());

//Last messages
var chatTable = document.getElementById("chat-body-0");
var chatHistory = []
$('#chat-body-0').on("DOMSubtreeModified", function() {
    var nickname = document.getElementById("name-box").value
    var lastMessage = chatTable.rows[chatTable.rows.length - 1].innerText
    if(lastMessage.includes(":")) {
        lastMessage = lastMessage.split(":")
        if(lastMessage[0].includes(nickname)) {
            chatHistory.push(lastMessage[1])
        }
    }
    var timesUpPressed = 0
    document.onkeydown = function(evt) {
        var chatInput = document.getElementById("chat-input")
        evt = evt || window.event;
        if(evt.keyCode == 38 || evt.keyCode == 40) {
            if(evt.keyCode == 40) timesUpPressed--
            if(evt.keyCode == 38) timesUpPressed++
            if(timesUpPressed < chatHistory.length + 1 && timesUpPressed > 0) {
                console.log(timesUpPressed)
                chatInput.value = chatHistory[chatHistory.length - timesUpPressed]
                chatInput.focus()
            } else {
                timesUpPressed = 0
            }
        } else {
            timesUpPressed = 0
        }
        if(evt.keyCode == 81) {
            freezeSplit()
        }
    }
})

var gotaMenu = document.getElementById("main")

function freezeSplit() {
    for(var i = 0; i < 3; i++) {
        $(window).trigger($.Event('keydown', {
            keyCode: 32,
            which: 32
        }));
    }
    //I stole a bit this from donut, lul i'm sorry ok, i'm lazy to find out how to do it on my own
    if(gotaMenu.style.display == 'none') {
        gotaMenu.style.zIndex = '-2';
        gotaMenu.style.display = 'block';
        setTimeout(function() {
            gotaMenu.style.zIndex = '2';
            gotaMenu.style.display = 'none';
        }, 1000);
    }
}