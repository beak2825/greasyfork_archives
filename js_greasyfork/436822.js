// ==UserScript==
// @name         Poorly Drawn Shell Shockers Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shell Shockers but drawn by me (bad)
// @author       Jayvan
// @match        https://shellshock.io/
// @icon         https://cdn1.iconfinder.com/data/icons/logos-brands-in-colors/231/among-us-player-white-512.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436822/Poorly%20Drawn%20Shell%20Shockers%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/436822/Poorly%20Drawn%20Shell%20Shockers%20Theme.meta.js
// ==/UserScript==

//font
var meta = document.createElement('meta');
meta.httpEquiv = "X-UA-Compatible";
meta.content = "ie-edge";
document.getElementsByTagName('head')[0].appendChild(meta);

let font = document.createElement('link');
font.rel = 'stylesheet';
font.href='https://shellthemes.jayvan229.repl.co/FONT/stylesheet.css';
document.head.appendChild(font);
//font end
let style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'https://shellthemes.jayvan229.repl.co/poorlydrawn.css';
document.head.appendChild(style);

setTimeout(function(){
    document.getElementById("logo").innerHTML = "<img src='https://cdn.discordapp.com/attachments/811268272418062359/887069850046959696/unknown-removebg-preview_9.png'>";
}, 2000);