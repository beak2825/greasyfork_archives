// ==UserScript==
// @name         HornsTownChanger
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Just Chnages the player gender on charater creation page load thats it (after character creation turn off the script!)
// @author       ARSE
// @match        https://hornstown.com/php/gamelink.php?c=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393719/HornsTownChanger.user.js
// @updateURL https://update.greasyfork.org/scripts/393719/HornsTownChanger.meta.js
// ==/UserScript==

(function() {
	var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("Player-avatar").innerHTML = this.responseText;
            }
        };
        xmlhttp.open("GET", "player-avatar.php?changeSex=a", true);
        xmlhttp.send();
})();