// ==UserScript==
// @name         Troll Bonk.io
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Adds a troll bonk.io button to bonk.io, click the button then leave the tab opened to troll bonk.io
// @author       GavoroX
// @match        https://bonk.io/gameframe-release.html
// @icon         https://tinyurl.com/y8coosw6
// @grant        none
// namespace     https://greasyfork.org/en/scripts/439539-troll-bonk-io
// @downloadURL https://update.greasyfork.org/scripts/439539/Troll%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/439539/Troll%20Bonkio.meta.js
// ==/UserScript==

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
async function stopAfter() {
    await sleep(100);
}
function Enter() {
    var enter = new KeyboardEvent("keydown",{"keyCode":13,"bubbles":true});
    document.getElementById("gamerenderer").dispatchEvent(enter);
}

var raidIntv = null;
var bonktroll = document.createElement('div');
bonktroll.innerHTML = 'troll';
bonktroll.classList.add('roomlistbottombutton');
bonktroll.classList.add('brownButton');
bonktroll.classList.add('brownButton_classic');
bonktroll.classList.add('buttonShadow');
bonktroll.style = 'pointer-events = auto; right: 0; bottom: -75px;';
bonktroll.addEventListener('click', () => {
    var myName = window.prompt("What text do you want to be sent in the lobbies upon joining them?")
if(!raidIntv){ raidIntv = setInterval(() => {
const rl = document.getElementsByClassName("HOVERUNSELECTED UNSELECTED").length
let r = document.getElementsByClassName("HOVERUNSELECTED UNSELECTED");
        let citem = Math.floor(Math.random()*rl)
        let rlclick = r.item(citem).click();
        console.log(citem)
        document.getElementById("roomlistjoinbutton").click();
        stopAfter()
        document.getElementById("roomlistpasscancelbutton").click()
        Enter()
        document.getElementById("newbonklobby_chat_input").value = myName
        Enter()
        document.getElementById("pretty_top_exit").click();
        document.getElementById("leaveconfirmwindow_okbutton").click()
        }, 7000);
}});
var joinBtn = document.querySelector('#roomlistjoinbutton');
joinBtn.parentNode.insertBefore(bonktroll, joinBtn.nextSibling);

window.addEventListener("keydown", checkKeyPress, false);
function checkKeyPress(key) {
 if (key.keyCode == "19") {
clearInterval(raidIntv)
}}