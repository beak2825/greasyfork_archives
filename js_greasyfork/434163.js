// ==UserScript==
// @name        gi hun jumpscare v2
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.1
// @author      static
// @description 10/19/2021, 9:55:49 PM now with funny boom
// @downloadURL https://update.greasyfork.org/scripts/434163/gi%20hun%20jumpscare%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/434163/gi%20hun%20jumpscare%20v2.meta.js
// ==/UserScript==
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let boom = new Audio("https://cdn.discordapp.com/attachments/791424837285052430/900218563258900550/Instagram_Thud_Sound_Effect_Vine_Boom.mp3");
(async () => {
    await sleep(6000)
    let priorsrcs = [];
    let imgs = document.getElementsByTagName("img")
    for (var i = 0; i < imgs.length; i++) {
        priorsrcs.push(imgs[i].src);
        boom.play()
        imgs[i].src = "https://cdn.discordapp.com/attachments/791424837285052430/899883205551861821/unknown.png"; 
    }
    await sleep(150)
    async function fadeImg(img) {
        img.style.opacity = 0;
        img.src = priorsrcs[i];
        for (var e = 0; e < 100; e++) {
            await sleep(10)
            img.style.opacity = e / 100;
        }
    }
    for (var i = 0; i < imgs.length; i++) {
        fadeImg(imgs[i])
    }
})();

