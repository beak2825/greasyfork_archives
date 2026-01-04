// ==UserScript==
// @name            Discord 全屏一起看
// @name:zh         Discord 全屏一起看
// @name:en         Discord Watch Together Fullscreen
// @namespace       https://github.com/KumaTea
// @namespace       https://greasyfork.org/en/users/169784-kumatea
// @version         1.0
// @description     使 Discord 一起看 Youtube 时占满全屏
// @description:zh  使 Discord 一起看 Youtube 时占满全屏
// @description:en  Make Youtube fill the screen while in Discord Watch Together Activity
// @author          KumaTea
// @match           https://discord.com/popout
// @icon            https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @license         GPLv3
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/455930/Discord%20%E5%85%A8%E5%B1%8F%E4%B8%80%E8%B5%B7%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/455930/Discord%20%E5%85%A8%E5%B1%8F%E4%B8%80%E8%B5%B7%E7%9C%8B.meta.js
// ==/UserScript==

/* jshint esversion: 8 */


let SLEEP = 15;
let YOUTUBE_DIV = "pictureInPicture-1GQX91";


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fullscreen() {
  await sleep(SLEEP*1000);
  console.log('Waited for ' + SLEEP + ' seconds.');
  if (window.innerWidth == screen.width && window.innerHeight == screen.height) {
    console.log('Fullscreen detected.');
    document.querySelector("#app-mount > div > div > div > div." + YOUTUBE_DIV + " > div").style = "pointer-events: auto; transform: translateX(0px) translateY(0px) translateZ(0px);";
    console.log('Moved.');
    document.querySelector("#app-mount > div > div > div > div." + YOUTUBE_DIV + " > div > div").style = "width: " + window.innerWidth + "px; height: " + window.innerHeight + "px;";
    console.log('Reized.');
  }
}

fullscreen();
