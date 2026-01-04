// ==UserScript==
// @name         Chrome Dino Invincibility + Speed Boost
// @namespace    your face
// @version      0.1
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEX///9TU1Ps7OxQUFDi4uJDQ0Nzc3Pm5uZKSkpYWFhNTU2NjY1ubm6Hh4fNzc23t7dcXFzy8vKsrKzAwMCAgIDGxsb5+fmXl5egoKBGRkbT09N9fX1gYGCbm5v19fWlpaU9PT3a2tqSkpKqBTuvAAAFFklEQVR4nO2d23qiMBRGiygCIgdFKgdr9f0fciDRMQohiVhD8F/f3AyBslfRkMNO+vUFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8NMlhpUh60h2zGrPAV2Sx0x2zGrPAttRwYTgypm+YqBuGumOWJdk3HCpFQctekesM8FxablM1qgrWis1l+VF3/GKW3l3YBHlNf6M7fjF3hlXZ4HhcI9MN7XXWHCoq6adonGGaNIfCGIYwHBUfZrgiNc1pujWN5cVeTSzrZ6ChMjAcAzCEoe74xcAQhrrjFwNDGOqOXwwMYag7fjEwnL6h3TuLmJtvaJfrPtKt7vjFCAzzpe4AByMynOsOcDAwhOH4ERmekha6Q1ZE+LZIH3F+dMeshvCN32Jh2ENUb7XBcGx8gCF3psl3u/l9u2FxaHJ3okz1uhm5bs97ht4m6majfKehRIu6G+OWyr/Z+a/flyvkzf4i2KeIXOv/BLUK87z36+aNp1cBQx7TN1xO1fB0rROP/QmJ5hpuFpf3miDj0mBDt98Mhhr4FMO1bL80kjUcW5vGibY1O26bkRQ3Z3xL5nR7m+0NvUsPrg/FrvvjAe8Xny2a/G2VFG7yI236z/beavQI87HrM1RzezCN32r0yBsMLRj+LVKGX+qG7NqL0Rha1TZsYAeqk11zpJB8RzAEBG9khlbc4B2Y4pAeUxb0illNktojM2yw/TtDV3VZ2sWQtmlSf4SG1oPhU4IwfCcfabhnip+oRVnDki5P1KN2oW1oO9831s9VNFfDiAwb611I2dEdYpNgnhQcXf/w9cDwjcAQhjDUDwxhaIKh2k4P5hluvaphwoaU3eQNt682tCZtSL7Y0zW0g3GmV77ScDzzaizbxSLP8ydHDo0wpChsaWGoocK2JDAcKTCcgKHnDhlBJKOQbjVmw/n+ULN3nlO0g+/66u+jAYnchyd2CbT+79dmArI5M4+G6imcuoCh+YZnV3VWhtai5hhGKV2HHEiPbTjkguM4+018fo4rySdYFbpjfZJkKzlCFRuwW243xUru5W+uYZZFEzes+8T7jjdHq6LVbLicq8I0nZebtmG1btbzljbH8Ef5fpJwDYPfhRq/Z+bqdj6NvyYFs5xjGNqK95PE5hqWfnu5cS9uf8aQn5KCOdcwVr2hFD4/7WjlKBKw6S/qhkWpekNJuIbJTBW2aaJumCnfTxKu4TDuDcmH+GK4IB+eMdSlw7gzjEneL62IlhX5z7QM/RV589A5l4zU4GE8LcPvVjFdjw9DaWbLC2/sh73VMEljMuVeedFrfqAMF0OyfOnvDZ1LYyEfasi+IgUjD9TQrlrLFCgvNixjijXQ8OdMa/qGSrApHDXMT62lJpTXGmb0NjUD58iT9NZydAUZytRwwSseaV2apO5tY799/7lmGmabW6b6WbC+00zDr4yl/1RDDRWQMzR1NLGBGro7smK5LXIx3JPisPPzEOpe6Szg2qZpOkou741PmwR+96h+XXHrXeksQKrVdinmGLr+HxsWuxuC78uMnsX+BU0FQ87c08Epy/bRkIkqHDijU1reFWvdf2pRNefavJGo5wy790qsmKiCgftHMmNtlwEILnSY7O7rFubMIFyHIbNvIOdT2o13i8oPBv7Z1VVwox3iHYVDzmIbckXFXN5u4c0cpvis0KtjrysHPkOFjkTWPutu5KzjckExl7tRNGMyHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgE/kH/ZhfYcT3Nb2AAAAAElFTkSuQmCC
// @description  Invincibility + Speed Boost
// @author       Sam55
// @include      https://chromedino.com/
// @include      https://dino-chrome.com/
// @include      https://t-rex-game.com/
// @include      */chromedino/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444753/Chrome%20Dino%20Invincibility%20%2B%20Speed%20Boost.user.js
// @updateURL https://update.greasyfork.org/scripts/444753/Chrome%20Dino%20Invincibility%20%2B%20Speed%20Boost.meta.js
// ==/UserScript==

//Invincibility

(function() {
    var menu = document.createElement('div');
    menu.innerHTML='<button style="background: red;" onclick="Runner.instance_.gameOver=function(){}">Invicibility</button><button onclick="Runner.instance_.gameOver=Runner.prototype.gameOver">Disable Invicibility</button><p style="color: red;">Press "S" to choose speed</p><p style="color: red;">Enjoy!</p><h3 style="color: red;">Made by Sam55.</h3>';
    document.body.insertBefore(menu, document.body.firstChild);
})();

//Speed Boost

var button = document.createElement("Button");
button.innerHTML = "Speed Boost";
button.style = "top:0;right:0;position:absolute;z-index:99999;padding:20px;";
document.body.appendChild(button);
button.onclick = function(){Runner.instance_.setSpeed(50)};

// Other Speed Hack (press "s" for it)

window.addEventListener("keydown", hehe, false);

showHacks();

function showHacks(){
    var box = document.getElementById("desktop-controls");
    var controls = document.createElement("div");
    controls.className = "title2";
    controls.id = "adamsstuff";
    var lol = document.getElementById("adamsstuff");
}

// Other Speed Hack (press "s" for it)

window.addEventListener("keydown", hehe, false);

showHacks();

function showHacks(){
    var box = document.getElementById("desktop-controls");
    var controls = document.createElement("div");
    controls.className = "title2";
    controls.id = "adamsstuff";
    var lol = document.getElementById("adamsstuff");
}

function hehe(e){
    if(e.keyCode == "83"){
        var a = prompt("What Speed Would You Like?");
        if(isNaN(a)){
            window.alert("Please enter a number next time");
        }else{
            Runner.instance_.setSpeed(a);
        }
    }

else if(e.keyCode == "68"){
        var b = prompt("What Distance Would You Like?");
        if(isNaN(b)){
            window.alert("Please enter a number next time");
        }else{
            Runner.instance_.distanceRan = b
        }
    }
}