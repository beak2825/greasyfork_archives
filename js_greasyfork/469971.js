// ==UserScript==
// @name         Silver's DF DeGambler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @description  Remove gambling from DF, as requested by Carl
// @author       SilverBeam
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=49
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/469971/Silver%27s%20DF%20DeGambler.user.js
// @updateURL https://update.greasyfork.org/scripts/469971/Silver%27s%20DF%20DeGambler.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
        if(window.location.href == "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=49"){
            window.location.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php"
        }
        if(window.location.href == "https://fairview.deadfrontier.com/onlinezombiemmo/index.php"){
            let buttons = document.getElementsByTagName("button");
            for (let button of buttons){
                console.log(button);
                if (button.dataset.page == "49"){
                    button.parentNode.remove();
                    break;
                }
            }
        }
    },500);
})();