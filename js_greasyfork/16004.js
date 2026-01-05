// ==UserScript==
// @name         MouseHunt Rival Point - Extreme Toboggan Challenge
// @version      1.03
// @description  Get rival details, button below hints
// @author       Rani Kheir
// @match        *www.mousehuntgame.com/index.php*
// @namespace https://greasyfork.org/users/4271
// @downloadURL https://update.greasyfork.org/scripts/16004/MouseHunt%20Rival%20Point%20-%20Extreme%20Toboggan%20Challenge.user.js
// @updateURL https://update.greasyfork.org/scripts/16004/MouseHunt%20Rival%20Point%20-%20Extreme%20Toboggan%20Challenge.meta.js
// ==/UserScript==


$(window).load(function(){

var btn = document.createElement("BUTTON");
var t = document.createTextNode("Check Rival Details");
btn.appendChild(t);
document.getElementById("huntingTips").appendChild(btn);

btn.onclick = function() {

var x = document.getElementsByClassName("winterHunt2015-obstacleInfo sled rival")[0].getElementsByTagName("b")[0].innerHTML;
var z = document.getElementsByClassName("winterHunt2015-obstacleInfo-speed")[0].innerHTML;
var ddd = "";
var lll = "";
    
if (document.getElementsByClassName("winterHunt2015-course-sprite rival boost")[0])
{
    lll = "Boost: On";
    ddd = document.getElementsByClassName("winterHunt2015-course-sprite rival boost")[0].getAttribute("data-x");}    
else if (document.getElementsByClassName("winterHunt2015-course-sprite rival")[0])
{
    lll = "Boost: Off";
    ddd = document.getElementsByClassName("winterHunt2015-course-sprite rival")[0].getAttribute("data-x");}
else {
        lll = "Error retreiving data";
        ddd = "Error retreiving data";}


var node = document.createElement("P");
var node2 = document.createElement("P");
var textnode = document.createTextNode("Rival: " + x);
var textnode2 = document.createTextNode("Distance:" + ddd + " m | "+ z + " | " + lll);
node.appendChild(textnode);
node2.appendChild(textnode2);                  
document.getElementById("huntingTips").appendChild(node);
document.getElementById("huntingTips").appendChild(node2);
};
});
