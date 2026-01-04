// ==UserScript==
// @name         Auto Grid Off Show Ping On
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  By yours truly
// @author       fizzixww
// @match          *://sploop.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492499/Auto%20Grid%20Off%20Show%20Ping%20On.user.js
// @updateURL https://update.greasyfork.org/scripts/492499/Auto%20Grid%20Off%20Show%20Ping%20On.meta.js
// ==/UserScript==


            const gridToggle = document.querySelector("#grid-toggle");
setInterval(() => {
            if (gridToggle.checked) gridToggle.click();
}, 0);
            const tits = document.querySelector("#display-ping-toggle");
setInterval(() => {
            if (tits.checked) {
                console.log("OOOOOOOOOOOOOOOOOAAAAAAAAAAAAUUUAUAHHAHAHUHAHUAHUAHUAHHAHAHHHHHHH")
            }
    else{
        tits.click()};
}, 0);