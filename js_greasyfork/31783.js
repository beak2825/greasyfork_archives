// ==UserScript==
// @name         Seeno Extension alpha
// @namespace    http://tampermonkey.net/
// @version      1.0.4.1
// @description  just does tricksplit with t, triplesplit with 3 and doublesplit with q. also should allow for a custom skin.
// @author       SeenoAmroth
// @match        http://abs0rb.me/*
// @match        http://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/31783/Seeno%20Extension%20alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/31783/Seeno%20Extension%20alpha.meta.js
// ==/UserScript==
function setSkin() {
    if (document.getElementById('skin').value.match(/^http(s)?:\/\/(.*?)/)) {
        localStorage.setItem("skin", document.getElementById('skin').value);
    }
    document.getElementsByClassName('circle bordered')[0].src = document.getElementById('skin').value;
    if (document.getElementById("h").checked === true) {
        localStorage.setItem("h", "3");
        document.getElementById('hh').click();
        clearInterval(i);
    } else {
        localStorage.setItem("h", "2");
        document.getElementById('ss').click();
    }
}

function init() {
    if (document.getElementsByClassName('circle bordered')[0] && document.getElementById('skin').value.match(/^http(s)?:\/\/(.*?)/)) {
        document.getElementById('skinLabel').style.display = "none";
        document.getElementById('skinButton').className = "";
        document.getElementsByClassName('circle bordered')[0].style.display = 'block';
        document.getElementsByClassName('circle bordered')[0].src = document.getElementById('skin').value;
    }
}
document.getElementsByClassName('form-group clearfix')[1].innerHTML += '<input placeholder="Paste your image link here" id="skin" class="form-control" style="width:320px" <div id="h2u"><font size="2" color="#FF0000"><center style="margin-top: 6px; margin-bottom: -15px;">You must enter a nickname to see your skin.</center></font> <br><center style="margin-bottom: -5px;"><input type="checkbox" name="h" id="h"> Hide your nickname</center><a href="javascript:window.core.registerSkin(document.getElementById(\'nick\').value, null, document.getElementById(\'skin\').value, 2,null);" id="ss"></a><a href="javascript:window.core.registerSkin(document.getElementById(\'nick\').value, null, document.getElementById(\'skin\').value, 3, null);" id="hh"></div>';

if (localStorage.getItem("h") && localStorage.getItem("h") == 3) {
    document.getElementById("h").checked = true;
}
if (localStorage.getItem("skin") && localStorage.getItem("skin").match(/(http(s?):)|([/|.|\w|\s])*\.(?:jpg|jpeg|gif|png|bmp)/)) {
    document.getElementById('skin').value = localStorage.getItem("skin");
}
if(document.getElementById('statsContinue')){
    document.getElementById('statsContinue').addEventListener("click", function(){i=setInterval(function(){init();},500);}, false);
}
if (document.getElementsByClassName('btn btn-play-guest btn-success btn-needs-server')[0]) {
    document.getElementsByClassName('btn btn-play-guest btn-success btn-needs-server')[0].addEventListener("click", setSkin, false);
}
if (document.getElementsByClassName('btn btn-play btn-primary btn-needs-server')[0]) {
    document.getElementsByClassName('btn btn-play btn-primary btn-needs-server')[0].addEventListener("click", setSkin, false);
}
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 25; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
    if (event.keyCode == 65) { //key A
        split();
        setTimeout(split, speed);
    }

    }
function keyup(event) {
    if (event.keyCode == 87) { // key W
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); // key W
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}