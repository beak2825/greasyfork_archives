// ==UserScript==
// @name         Bg disabler BONK.IO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disables lobby bg, FPS+++++++++++++++++++++++++++++++++++
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @namespace    https://greasyfork.org/users/824888
// @downloadURL https://update.greasyfork.org/scripts/461836/Bg%20disabler%20BONKIO.user.js
// @updateURL https://update.greasyfork.org/scripts/461836/Bg%20disabler%20BONKIO.meta.js
// ==/UserScript==

        let ide;
   ide = setInterval(() => {
    let mt = document.getElementById('newbonklobby_mapthumb_big')
    if (mt){
    mt.remove();
    }
   },500)