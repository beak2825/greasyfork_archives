// ==UserScript==
// @name         Scope Theme - Gamer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scope - Gamer
// @author       Stormii Cloud
// @match        https://shellshock.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475876/Scope%20Theme%20-%20Gamer.user.js
// @updateURL https://update.greasyfork.org/scripts/475876/Scope%20Theme%20-%20Gamer.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
*{

#maskmiddle {
    background: url('https://media.discordapp.net/attachments/1082903570728357939/1082903666425593856/optracerscope2.png') center center no-repeat;
    background-size: contain;
    width: 100vh;
    height: 100vh;
}

#maskleft, #maskright {
	background: black;
	flex: 1;
}
</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();