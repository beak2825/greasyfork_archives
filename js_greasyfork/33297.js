// ==UserScript==
// @name         Skip Bit Heroes Ads
// @version      0.81
// @description  Allows to skip ads on Bit Heroes, but keep get the rewards
// @author       Spychopat
// @include      https://www.kongregate.com/games/juppiomenz/bit-heroes
// @match        https://www.kongregate.com/games/juppiomenz/bit-heroes
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/33297/Skip%20Bit%20Heroes%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/33297/Skip%20Bit%20Heroes%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ul = document.getElementById("quicklinks");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode('● Ads skipper by Spychopat ●'));
    li.style.color="white";
    ul.appendChild(li);

    setInterval(function() {
        var frame = document.getElementById("epom-tag-container-iframe");
        var msg = document.getElementsByClassName("ironrv-complete-text").length;
        if(frame) {
            // make the close cross instantly visible
            document.querySelector('.ironrv-close').style = "";
            // close the ad frame if offer is completed
            if(msg > 0){
                setTimeout(function () {
                    document.querySelector('.ironrv-close').click();
                }, 1000);
            }
            // fire regular reward
            if(frame.contentWindow.Common)
                frame.contentWindow.Common.onReward();
        }
    }, 200);
})();