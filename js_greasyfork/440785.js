// ==UserScript==
// @name         Google Chrome Dino-Game Hack (https://chromedino.com/)
// @namespace    http://tampermonkey.net/
// @version      3.2.5
// @description  A basic GUI for Chrome Dino Speed Hack, Jump Hack, Points Hack, Invincibility Hack, & More.
// @author       Cracko298
// @icon         https://www.omgchrome.com/wp-content/uploads/2015/06/chrome-trex-dinosaur.jpg
// @include      chrome://dino
// @match        chrome://dino
// @match        https://chromedino.com
// @match        https://chromedino.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440785/Google%20Chrome%20Dino-Game%20Hack%20%28https%3Achromedinocom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440785/Google%20Chrome%20Dino-Game%20Hack%20%28https%3Achromedinocom%29.meta.js
// ==/UserScript==

function script() {
    var elem = document.getElementById('script');
    elem.parentNode.removeChild(elem);
    return false;
}


setTimeout(function() {
// Placeholder
}, 2000);

if (window.confirm("Want to Inject The Hack?")) 
{

var button = document.createElement("button");
button.innerHTML = "Set Max Score";

var body = document.getElementsByTagName("header")[0];
body.appendChild(button);

button.addEventListener ("click", function() {
  alert("Max Score Set.");
Runner.instance_.distanceRan = 899999 / Runner.instance_.distanceMeter.config.COEFFICIENT;

});
var button = document.createElement("button");
button.innerHTML = "Invincibility";

var body = document.getElementsByTagName("header")[0];
body.appendChild(button);

button.addEventListener ("click", function() {
  alert("Invincibility Set.");
var original = Runner.prototype.gameOver
Runner.prototype.gameOver = function(){}

});
var button = document.createElement("button");
button.innerHTML = "High Speed";

var body = document.getElementsByTagName("header")[0];
body.appendChild(button);

button.addEventListener ("click", function() {
  alert("High Speed Set.");
Runner.instance_.setSpeed(100)

});
var button = document.createElement("button");
button.innerHTML = "High Jump";

var body = document.getElementsByTagName("header")[0];
body.appendChild(button);

button.addEventListener ("click", function() {
  alert("High Jump Set.");
Runner.instance_.tRex.setJumpVelocity(50)

});
var button = document.createElement("button");
button.innerHTML = "Reset All Hacks";

var body = document.getElementsByTagName("header")[0];
body.appendChild(button);

button.addEventListener ("click", function() {
  alert("Reset All Hacks");
Runner.prototype.gameOver = original
Runner.instance_.tRex.setJumpVelocity(10)
Runner.instance_.setSpeed(7)
Runner.instance_.distanceRan = 0 / Runner.instance_.distanceMeter.config.COEFFICIENT;
Runner.prototype.gameOver = original
});

var button = document.createElement("button");
button.innerHTML = "Reset Invincibility";

var body = document.getElementsByTagName("header")[0];
body.appendChild(button);

button.addEventListener ("click", function() {
Runner.prototype.gameOver = original
});

}
else{
alert('The Hack Inject Was Cancelled');
Runner.prototype.gameOver = original

}