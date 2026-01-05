// ==UserScript==
// @name         Agar.io Custom Skins | By KapClanYT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Paste a direct imigur link below your name to use a custom skin
// @author       KapClanYT - https://www.youtube.com/channel/UCQEYdaW3G7wOge5B0T8UVPA
// @match        http://agar.io/*
// @match        http://petridish.pw/*
// @match        http://agarly.com/*
// @match        http://agar.biz/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @match        http://Xgario.ml/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29006/Agario%20Custom%20Skins%20%7C%20By%20KapClanYT.user.js
// @updateURL https://update.greasyfork.org/scripts/29006/Agario%20Custom%20Skins%20%7C%20By%20KapClanYT.meta.js
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
document.getElementsByClassName('form-group clearfix')[1].innerHTML += '<input placeholder="Paste imigur direct link here" id="skin" class="form-control" style="width:320px" <div id="h2u"><font size="2" color="#FF0000"><center style="margin-top: 6px; margin-bottom: -15px;"></center></font> <br><center style="margin-bottom: -5px;"><input type="checkbox" name="h" id="h"> Hide your nickname</center><a href="javascript:window.core.registerSkin(document.getElementById(\'nick\').value, null, document.getElementById(\'skin\').value, 2,null);" id="ss"></a><a href="javascript:window.core.registerSkin(document.getElementById(\'nick\').value, null, document.getElementById(\'skin\').value, 3, null);" id="hh"></div>';

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