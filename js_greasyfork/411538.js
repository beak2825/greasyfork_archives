// ==UserScript==
// @name         Dino hackerman
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Teh hackerman dino
// @author       codingMASTER398
// @match        https://chrometrex.com/
// @match        https://dino-chrome.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411538/Dino%20hackerman.user.js
// @updateURL https://update.greasyfork.org/scripts/411538/Dino%20hackerman.meta.js
// ==/UserScript==

(function() {
    var para = document.createElement("button");
    para.innerHTML = "Stand still. Why?";
    para.onclick = function() {Runner.instance_.stop()};
    document.body.prepend(para);


    var para = document.createElement("button");
    para.innerHTML = "Set speed 10";
    para.onclick = function() {Runner.instance_.setSpeed(10)};
    document.body.prepend(para);

    var para = document.createElement("button");
    para.innerHTML = "Set speed 100";
    para.onclick = function() {Runner.instance_.setSpeed(100)};
    document.body.prepend(para);

    var para = document.createElement("button");
    para.innerHTML = "Set speed 1000";
    para.onclick = function() {Runner.instance_.setSpeed(1000)};
    document.body.prepend(para);

    var para = document.createElement("button");
    para.innerHTML = "Kill dino";
    para.onclick = function() {Runner.instance_.gameOver()};
    document.body.prepend(para);

    var para = document.createElement("button");
    para.innerHTML = "Disable death";
    para.onclick = function() {Runner.instance_.gameOver = function(){};};
    document.body.prepend(para);

    var para = document.createElement("button");
    para.innerHTML = "Infinite high score";
    para.onclick = function() {Runner.instance_.saveHighScore(9999999);};
    document.body.prepend(para);



    var para = document.createElement("button");
    para.innerHTML = "Yeet";
    para.onclick = function() {Runner.instance_.tRex.setJumpVelocity(100)};
    document.body.prepend(para);

    var para = document.createElement("button");
    para.innerHTML = "Delete everything";
    para.onclick = function() {delete Runner.instance_.tRex};
    document.body.prepend(para);

    var para = document.createElement("button");
    para.innerHTML = "Distance hack";
    para.onclick = function() {Runner.instance_.distanceRan = 99999999};
    document.body.prepend(para);

})();