// ==UserScript==
// @name        Gladiatus Auto Dungeon click
// @description gladiatus auto dungeon
// @include     *://*s*.gladiatus.gameforge.*/game/index.php?mod=dungeon*
// @include     *://*s*.gladiatus.gameforge.*/game/index.php?mod=reports&submod=showCombatReport*t=1*
// @author      ZaharX97
// @version  	1.13
// @namespace   https://greasyfork.org/users/104906
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/27599/Gladiatus%20Auto%20Dungeon%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/27599/Gladiatus%20Auto%20Dungeon%20click.meta.js
// ==/UserScript==
(function() { "use strict"; } )();
GM_addStyle("\
.GADbutton1{\
background-image: url(https://i.imgur.com/Wcct3Hz.jpg);\
background-repeat: no-repeat;\
background-size: 144px 19px;\
background-position: center;\
text-align: center;\
color: #c8b38a;\
font-weight: bold;\
width: 144px;\
margin-left: auto;\
margin-right: auto;\
cursor: pointer;\
outline-style: none;\
outline-color: #ffff00;\
outline-width: 1px;\
}\
");
var statusLocal = GM_getValue("status", true);
var refreshInc = setTimeout(function(){ window.location.reload(true); }, 10000);
window.addEventListener("load", calculateRuntime);
addAutoDungeonButton();

function main () {
    var i, elemLink, dungeonLink, time, x, elemFights;
    elemLink = document.getElementById("linknotification");
    if(elemLink !== null){
        elemLink.click();
        x = getRndInteger( 0, 2899 );
        setTimeout(function(){ window.location.reload(true); }, 2510 + x);
        return;
    }
    elemLink = document.getElementById("linkLoginBonus");
    if(elemLink !== null){
        elemLink.click();
        x = getRndInteger( 0, 2899 );
        setTimeout(function(){ window.location.reload(true); }, 2510 + x);
        return;
    }
    dungeonLink = window.location.href;
    if(dungeonLink.includes("eport")){
        elemLink = document.getElementsByClassName("cooldown_bar_link");
        dungeonLink = elemLink[1].href;
    }
    time = getRemainingTime();
    if(isNaN(time)){
        if(window.location.href != dungeonLink){
            x = getRndInteger( 0, 2899 );
            setTimeout(function(){ console.log("[GAD]: going to dungeon"); window.location.assign(dungeonLink); }, 2510 + x);
            return;
        }
        elemFights = document.getElementsByTagName("area");
        x = getRndInteger( 0, 3281 );
        if(elemFights.length > 0){
            setTimeout( function(){ elemFights[0].click(); }, x);
            return;
        }
        else{
            elemFights = document.getElementsByClassName("button1");
            if(elemFights.length > 0){
                for(i = elemFights.length - 1 ; i >= 0  ; i--)
                    if( elemFights[i].type == "submit" ){
                        setTimeout( function(){ elemFights[i].click(); }, x);
                        return;
                    }
            }
            else setTimeout(function(){ console.log("[GAD]: teleporting to dungeon"); window.location.assign(dungeonLink); }, 2510 + x);
        }
    }
    else{
        setTimeout( function(){ console.log( "[GAD]: " + time + " passed, going to dungeon" ); window.location.assign(dungeonLink); }, time + 5000 );
        return;
    }
}

function getRemainingTime(){
    var elemTime, timeText, x, time;
    elemTime = document.getElementById("cooldown_bar_text_dungeon");
    timeText = elemTime.innerText;
    x = getRndInteger( 1, 4 );
    time = timeText[0]*3600 + timeText[2]*10*60 + timeText[3]*60 + timeText[5]*10 + timeText[6]*1 + x*1;
    //console.log( timeText[0]*3600 + " " + timeText[2]*10*60 + " " + timeText[3]*60 + " " + timeText[5]*10 + " " + timeText[6] + " " + x + " timp= " + time);
    time = time*1000;
    console.log( "[GAD]: going to dungeon in " + time + "ms" );
    return time;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function calculateRuntime(){
    var sRuntime = Date.now();
    var eRuntime;
    clearTimeout(refreshInc);
    if(statusLocal)
        main();
    eRuntime = Date.now() - sRuntime;
    console.log("[GAD] runtime: " + eRuntime + "ms" );
}

function addAutoDungeonButton(){
    var elemTarget = document.getElementsByClassName("contentItem");
    if(!elemTarget[0])
        elemTarget = document.getElementsByClassName("reportWin");
    var elemMyButton = document.createElement("div");
    elemMyButton.setAttribute("id", "GADbuttonPlace");
    elemMyButton.style.marginTop = "7px";
    var elemNewChild = document.createElement("div");
    elemNewChild.setAttribute("id", "GADactualButton1");
    elemNewChild.setAttribute("class", "GADbutton1");
    if(statusLocal){
        elemNewChild.style.backgroundImage = "url(https://i.imgur.com/iXZKKOQ.jpg)";
        elemNewChild.innerText = "AUTO DUNGEON is ON";
    }
    else{
        elemNewChild.style.backgroundImage = "url(https://i.imgur.com/jr28Qwn.jpg)";
        elemNewChild.innerText = "AUTO DUNGEON is OFF";
    }
    elemNewChild.addEventListener("mouseover", function() {
        document.getElementById("GADactualButton1").style.outlineStyle = "solid";
    });
    elemNewChild.addEventListener("mouseout", function() {
        document.getElementById("GADactualButton1").style.outlineStyle = "none";
    });
    elemNewChild.addEventListener("click", function() {
        GM_setValue("status", !statusLocal);
        window.location.reload();
    });
    elemMyButton.appendChild(elemNewChild);
    elemNewChild = document.createElement("br");
    elemMyButton.appendChild(elemNewChild);
    elemTarget[0].parentElement.insertBefore(elemMyButton, elemTarget[0]);
}