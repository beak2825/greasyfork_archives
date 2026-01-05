// ==UserScript==
// @name          MTG Grind Mode Switch
// @description   Adds buttons to the bottom of your screen to switch grind mode on and off
// @version       1.1
// @include       http://www.mturkgrind.com/threads/*
// @author        Cristo
// @copyright    2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/5443/MTG%20Grind%20Mode%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/5443/MTG%20Grind%20Mode%20Switch.meta.js
// ==/UserScript==

function chnageMode(f){
    var toUrl = 'http://www.mturkgrind.com/misc.php?do=filterposts_linksonly&filterposts_linksonly='+f;
    modeGet = new XMLHttpRequest();
    modeGet.onreadystatechange = function () {
        if ((modeGet.readyState ===4) && (modeGet.status ===200)) {
            location.reload();
        }
    }
    modeGet.open('GET', toUrl, true);
    modeGet.send(null);
}
if (window.top === window.self){
    var mtgBody = document.getElementsByTagName('body')[0];
    var sDiv = document.createElement('div');
    sDiv.style.position = "fixed";
    sDiv.style.zIndex="999";
    sDiv.style.bottom = "0%";
    sDiv.style.right ="1%";
    sDiv.style.bottom ="1%";
    sDiv.setAttribute('id','grinddiv');
    mtgBody.appendChild(sDiv); 
    var grindin = document.createElement("input");
    grindin.type = "button";
    grindin.value = 'Grind';
    grindin.style.cursor = "pointer";
    grindin.style.height ="auto";
    grindin.style.width ="50px";
    grindin.style.opacity = "0.5";
    grindin.addEventListener("click", function(){chnageMode(1);}, false); 
    sDiv.appendChild(grindin); 
    var talkin = document.createElement("input");
    talkin.type = "button";
    talkin.value = 'Social';
    talkin.style.cursor = "pointer";
    talkin.style.height ="auto";
    talkin.style.width ="50px";
    talkin.style.marginLeft ="10px";
    talkin.style.opacity = "0.5"; 
    talkin.addEventListener("click", function(){chnageMode(0);}, false); 
    sDiv.appendChild(talkin); 
}