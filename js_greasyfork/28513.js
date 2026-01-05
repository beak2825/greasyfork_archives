// ==UserScript==
// @name         Auto respawn for back.alis.io by Perfectionist
// @version      2.3
// @description  Automatic resurrection after death.
// @author       Perfectionist
// @match        http://back.alis.io/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/28513/Auto%20respawn%20for%20backalisio%20by%20Perfectionist.user.js
// @updateURL https://update.greasyfork.org/scripts/28513/Auto%20respawn%20for%20backalisio%20by%20Perfectionist.meta.js
// ==/UserScript==
var autoJoinGameContainer = document.createElement("div");
var autoJoinGameLabel = document.getElementsByClassName("checkbox")[0].children[0].cloneNode(true);
var animator = new ToradorableAnimator();
document.getElementById('home').insertBefore(autoJoinGameContainer,document.getElementById("skin_row"));
autoJoinGameLabel.children[0].id="autoJoinGame";
autoJoinGameContainer.appendChild(autoJoinGameLabel);
autoJoinGameContainer.innerHTML = autoJoinGameContainer.innerHTML + ' Респавн';

autoJoinGame.checked=true;

myApp["onDead"] = function() {
    isJoinedGame = false;

    // Auto Respawn
    if (autoJoinGame.checked) setNick(document.getElementById('nick').value);
};


window.addEventListener('keydown', keydown);
function keydown(e) {


   /* else  */ if(e.keyCode === 27) {
        animator.pauseAnimation();
        $("#overlays")["show"]();
    }
}

function ToradorableAnimator(initArgs={}) {
	this.pauseAnimation = function(){
	};
}