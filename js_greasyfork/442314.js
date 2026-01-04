// ==UserScript==
// @name         script for Rocketeer Bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Rocketeer Bot script with Antirammer build and c + e
// @author       MysteriousImage300
// @match        https://diep.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442314/script%20for%20Rocketeer%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/442314/script%20for%20Rocketeer%20Bot.meta.js
// ==/UserScript==
var died=true;
function s() {
    input.keyUp(75); input.keyDown(75);
    if(input.should_prevent_unload()) {
        if (died) {
            died=false;
            setTimeout(() => {
                input.keyDown(220); input.keyUp(220);
             input.keyDown(67); input.keyUp(67);
             input.keyDown(69); input.keyUp(69);
             input.execute('game_stats_build 222223333333555555566666667777777');
            }, 400);
             };
         }else{
                  died=true;
   };
};
setInterval(s, 100);