// ==UserScript==
// @name         SuS Shell Shockers Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sussy shell theme
// @author       Jayvan
// @match        https://shellshock.io/
// @icon         https://cdn1.iconfinder.com/data/icons/logos-brands-in-colors/231/among-us-player-white-512.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436823/SuS%20Shell%20Shockers%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/436823/SuS%20Shell%20Shockers%20Theme.meta.js
// ==/UserScript==

document.title="SuS";
setTimeout(function(){
    document.getElementById("logo").innerHTML = "<img src='https://cdn.discordapp.com/attachments/829136552469725235/884804557736128522/image0.png'>";
}, 2000);
let style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'https://SuS.jayvan229.repl.co/style.css';
document.head.appendChild(style);
