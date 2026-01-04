// ==UserScript==
// @name         ahh~
// @namespace    http://tampermonkey.net/
// @version      how am i supposed to know?
// @description  description
// @author       re!hades
// @match        https://sploop.io
// @icon         kill yourself u noober
// @grant        noob
// @downloadURL https://update.greasyfork.org/scripts/507791/ahh~.user.js
// @updateURL https://update.greasyfork.org/scripts/507791/ahh~.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
let animegirlwallpaper = ["https://cdn.discordapp.com/attachments/1268266927361364071/1282955793137668180/anime-girl-dream-1920x1200-10024.png?ex=66e13d31&is=66dfebb1&hm=ca20cdf5d87490a5fe283f9ab8d3c25eef7362d48429fdddfa5ceb98ec29f264&"];
    let wow = Math.floor(Math.random() * animegirlwallpaper.length);

    let homepage = document.querySelector("#homepage");
    homepage.style.backgroundImage = `url(${animegirlwallpaper[wow]})`;
    homepage.style.backgroundSize = "1920px";
    homepage.style.backgroundRepeat = "no-repeat";
    homepage.style.backgroundPosition = "center";
    homepage.style.height = "100%";
    homepage.style.width = "100%";
    homepage.style.transition = "0.1s";


                   

