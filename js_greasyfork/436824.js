// ==UserScript==
// @name         Tide League Shell Shockers Theme
// @namespace    http://tampermonkey.net/
// @version      1
// @description  SS Theme for TL
// @author       Jayvan
// @match        https://shellshock.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436824/Tide%20League%20Shell%20Shockers%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/436824/Tide%20League%20Shell%20Shockers%20Theme.meta.js
// ==/UserScript==

(function() {
    const theme=()=>{
        document.title = 'Tide League';
        let style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://Tide-League-Theme.jayvan229.repl.co/style.css';
        document.head.appendChild(style);
        setTimeout(function(){
            document.getElementById("logo").innerHTML = "<img src='https://cdn.discordapp.com/attachments/811268272418062359/872246201196621884/unknown.png'>";
            document.getElementById("shellshockers_titlescreen_wrap").innerHTML = "<img src='https://cdn.discordapp.com/attachments/811268272418062359/872255106819686430/unknown.png'><img src='https://cdn.discordapp.com/attachments/811268272418062359/872255106819686430/unknown.png'><img src='https://cdn.discordapp.com/attachments/811268272418062359/872255106819686430/unknown.png'>";
        }, 2000);
    }
    if(document.body){
        theme();
    }else{
        document.addEventListener('DOMContentLoaded', function(load){
            theme();
        })
    }
})();