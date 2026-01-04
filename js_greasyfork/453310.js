// ==UserScript==
// @name         Official flygOn LiTe Theme | Shell Shockers
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  FlygOn LiTe Theme
// @author       flygOn LiTe
// @match        https://shellshock.io/*
// @match        https://mathactivity.xyz/*
// @match        https://mathdrills.life/*
// @icon         https://www.berrywidgets.com/assets/babyflygon-grenade.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453310/Official%20flygOn%20LiTe%20Theme%20%7C%20Shell%20Shockers.user.js
// @updateURL https://update.greasyfork.org/scripts/453310/Official%20flygOn%20LiTe%20Theme%20%7C%20Shell%20Shockers.meta.js
// ==/UserScript==

(function() {
let style = document.createElement("link");
style.rel = "stylesheet";
style.href = "https://berrybroscrypto.com/css/shelltheme.css";
document.head.appendChild(style);

var script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://berrywidgets.com/shellshockers/mods/health-bar/health-bar.js";
document.head.appendChild(script);

var script2 = document.createElement("script");
script2.type = "text/javascript";
script2.src = "https://berrywidgets.com/shellshockers/mods/ammo-bar/ammo.js";
document.head.appendChild(script2);
})();
