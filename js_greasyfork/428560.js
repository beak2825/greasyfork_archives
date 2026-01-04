// ==UserScript==
// @name         Moomoo.io Hack (No Ads , Multi Hats and ASWD)
// @version      0.1
// @description  Moomoo.io Hack
// @author       ItzxXHUNTERXx_EvZ [GD]
// @match        *://dev.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @grant        none
// @namespace    https://greasyfork.org/en/scripts/
// @downloadURL https://update.greasyfork.org/scripts/428560/Moomooio%20Hack%20%28No%20Ads%20%2C%20Multi%20Hats%20and%20ASWD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428560/Moomooio%20Hack%20%28No%20Ads%20%2C%20Multi%20Hats%20and%20ASWD%29.meta.js
// ==/UserScript==

//OP Hat Macro v1.3.0 - Beta 0.1
var W = false;
var A = false;
var S = false;
var D = false;
var keyMod = `
<div id="wk">W</div>
&nbsp
<div id="ak">A</div>
&nbsp
<div id="sk">S</div>
&nbsp
<div id="dk">D</div>
`
var styleA = `
<style>
#wk {
color: blue;
width: 50px;
heught 50px;
}
#ak {
color: blue;
width: 30px;
heught 30px;
}
#sk {
color: blue;
width: 30px;
heught 30px;
}
#dk {
color: blue;
width: 30px;
heught 30px;
}
</style>
`
var int;
function BuyAll(){
int = 0
var val = setInterval(function(){
int++;
Hat(int)
if(int === 100){
clearInterval(val)
}
}, 10)

}
document.getElementById("promoImg").remove();
document.querySelectorAll('#pre-content-container').forEach(function(a) {
            a.remove();
$("#topInfoHolder").append(keyMod);
$("html").prepend(styleA);
        });
function Hat(id){
    storeBuy(id);
    storeEquip(id);
}
window.addEventListener('keydown', function(e) {
switch(e.keyCode){
case 82:
Hat(6);
break;
case 84:
Hat(7);
break;
case 89:
Hat(40);
break;
case 85:
Hat(12);
break;
case 71:
Hat(53);
break;
case 16:
Hat(0);
break;
case 77:
BuyAll()
break;
 }
});
window.addEventListener('keydown', function(e){
switch(e.key){
case "w":
wa()
break;
case "a":
aa()
break;
case "s":
sa()
break;
case "d":
da()
break;
}
});
function wa(){
document.getElementById("wk").style.color = "green";
}
function aa(){
document.getElementById("ak").style.color = "green";
}
function sa(){
document.getElementById("sk").style.color = "green";
}
function da(){
document.getElementById("dk").style.color = "green";
}
window.addEventListener('keyup', function(e){
switch(e.key){
case "w":
wb()
break;
case "a":
ab()
break;
case "s":
sb()
break;
case "d":
db()
break;
}
});
function wb(){
document.getElementById("wk").style.color = "blue";
}
function ab(){
document.getElementById("ak").style.color = "blue";
}
function sb(){
document.getElementById("sk").style.color = "blue";
}
function db(){
document.getElementById("dk").style.color = "blue";
}
setInterval(function(){document.getElementById("gameName").innerHTML = "Beta";}, 1000)
setInterval(function(){document.getElementById("gameName").innerHTML = "Bet_";}, 1100)
setInterval(function(){document.getElementById("gameName").innerHTML = "Be_a";}, 1200)
setInterval(function(){document.getElementById("gameName").innerHTML = "B_ta";}, 1300)
setInterval(function(){document.getElementById("gameName").innerHTML = "_eta";}, 1400)
setInterval(function(){document.getElementById("gameName").innerHTML = "B_ta";}, 1500)
setInterval(function(){document.getElementById("gameName").innerHTML = "Be_a";}, 1600)
setInterval(function(){document.getElementById("gameName").innerHTML = "Bet_";}, 1700)
setInterval(function(){document.getElementById("gameName").innerHTML = "____";}, 1800)
setInterval(function(){document.getElementById("gameName").innerHTML = "B__a";}, 1900)
setInterval(function(){document.getElementById("gameName").style.color = "lime";}, 1000)
setInterval(function(){document.getElementById("gameName").style.color = "red";}, 1200)
setInterval(function(){document.getElementById("gameName").style.color = "blue";}, 1400)
setInterval(function(){document.getElementById("gameName").style.color = "yellow";}, 1600)
setInterval(function(){document.getElementById("gameName").style.color = "green";}, 1800)