// ==UserScript==
// @name         Cinematic Spectate Mode in Shell Shockers
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Spectate with a rotating camera!
// @author       Jayvan
// @match        https://shellshock.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436729/Cinematic%20Spectate%20Mode%20in%20Shell%20Shockers.user.js
// @updateURL https://update.greasyfork.org/scripts/436729/Cinematic%20Spectate%20Mode%20in%20Shell%20Shockers.meta.js
// ==/UserScript==
setTimeout(function(){
    var readouts = document.getElementById('readouts');
    //readouts.appendChild(document.getElementById('game-play-switch'));
    var buttonContainer = document.createElement("div");
    buttonContainer.style.width = 200;
    buttonContainer.style.height = 50;
    buttonContainer.style.marginLeft = "20000px";
    const buttons = document.getElementById('game-play-switch');
    readouts.appendChild(buttonContainer);
    buttonContainer.appendChild(buttons);
}, 4500);
let style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'https://SSSPECCINEMATIC.jayvan229.repl.co/style.css';
document.head.appendChild(style);
setTimeout(function(){
    var div = document.getElementById('pausePopup');
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }
    var div2 = document.getElementById('inGameScaler');
    while(div2.firstChild) {
        div2.removeChild(div2.firstChild);
    }
}, 5000);