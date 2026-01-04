// ==UserScript==
// @name         Maracas
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Changes regular room_dogcheck dog to maraca dog on deltarune's dogcheck room page if it is specifically on /maraca, /maracadog, /maracadancingdog, /maracadance or /maracadancer
// @author       fat hairr
// @match        https://deltarune.com/maraca/
// @match        https://deltarune.com/maracadog/
// @match        https://deltarune.com/maracadancingdog/
// @match        https://deltarune.com/maracadance/
// @match        https://deltarune.com/maracadancer/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deltarune.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544150/Maracas.user.js
// @updateURL https://update.greasyfork.org/scripts/544150/Maracas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.firstElementChild.getElementsByTagName("div").dog_sleep.classList.add("hidden")
    document.body.firstElementChild.getElementsByTagName("div").dog_maraca.classList.remove("hidden")
    maraca = true;
    document.on('click', '.dog:not(.playing)', function() {
        if (maraca) {
            baci.play();
        } else {
            results.play();
        }
        document.body.firstElementChild.getElementsByTagName("div").dog_maraca.classList.add("playing")
        document.body.firstElementChild.getElementsByTagName("div").dog_maraca.getElementsByClassName("dog1")[0].style.opacity=0
        document.body.firstElementChild.getElementsByTagName("div").dog_maraca.getElementsByClassName("dog2")[0].style.opacity=1
    });
    document.on('click', '.dog.playing', function() {
        if (maraca) {
            baci.pause();
        } else {
            results.pause();
        }
        document.body.firstElementChild.getElementsByTagName("div").dog_maraca.classList.remove("playing")
        document.body.firstElementChild.getElementsByTagName("div").dog_maraca.getElementsByClassName("dog1")[0].style.opacity=1
        document.body.firstElementChild.getElementsByTagName("div").dog_maraca.getElementsByClassName("dog2")[0].style.opacity=-0
  });
})();