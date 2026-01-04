// ==UserScript==
// @name        KissAnime player speed
// @description   Adds buttons to change the player speed on KissAnime
// @match       *://*.kissanime.ru/Anime/*/*
// @grant       none
// @version     1.1
// @author      henrik9999
// @run-at      document-idle
// @namespace https://greasyfork.org/users/412318
// @downloadURL https://update.greasyfork.org/scripts/395909/KissAnime%20player%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/395909/KissAnime%20player%20speed.meta.js
// ==/UserScript==

var node = document.createElement('style');
node.innerHTML = '#speedchanger {float:left; margin-top:5px} #speedchanger > button.active {background-color:grey}'
document.body.appendChild(node);

document.querySelector("#divQuality").parentElement.parentElement.innerHTML += "<span id='speedchanger'><button class='speed'>0.25</button><button class='speed'>0.5</button><button class='speed active'>1</button><button class='speed'>1.5</button><button class='speed'>2</button></span>";

var buttons = document.querySelectorAll('#speedchanger > button.speed');
for (var i = 0; i < buttons.length; i++) {
    addBtnListener(buttons[i]);
}

function addBtnListener(self) {
    self.addEventListener('click', function (event) {
        setSpeed(self.textContent);
    }, false);
}

function setButtonActive(speed) {
    document.querySelector("span#speedchanger > button.active").classList.remove('active');
    var buttons = document.querySelectorAll("#speedchanger > button.speed");
    buttons.forEach(function(el) {
        if (el.textContent === speed) {
            el.classList.add('active')
        }
    });
}

function setSpeed(speed) {
    setButtonActive(speed);
    var player = document.querySelector("#divMyVideo").getElementsByTagName("video")[0];
    player.playbackRate = speed;
    console.log("set speed to " + player.playbackRate);
}