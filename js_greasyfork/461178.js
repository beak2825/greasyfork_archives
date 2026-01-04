// ==UserScript==
// @name         Syn Gym
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hides gym stats and gains
// @author       -zero [2669774]
// @match        https://www.torn.com/gym.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461178/Syn%20Gym.user.js
// @updateURL https://update.greasyfork.org/scripts/461178/Syn%20Gym.meta.js
// ==/UserScript==

function hideStats(){
    if ($('#gymroot > div > div.gymContentWrapper___xqvJB > div').length){
        document.getElementById("strength-val").style.display = "none";
        document.getElementById("defense-val").style.display = "none";
        document.getElementById("speed-val").style.display = "none";
        document.getElementById("dexterity-val").style.display = "none";
        $('div[class^=message]').css("display","none");
    }
    else{
        setTimeout(hideStats, 80);
    }
}


(function() {
    'use strict';

    hideStats();
    setInterval(hideStats, 300);
})();
