// ==UserScript==
// @name         Scope Theme - Bloolet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Same Scope That Bloolet Uses
// @author       Stormii Cloud
// @match        https://shellshock.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474949/Scope%20Theme%20-%20Bloolet.user.js
// @updateURL https://update.greasyfork.org/scripts/474949/Scope%20Theme%20-%20Bloolet.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
*{

#maskmiddle {
    background: url('https://media.discordapp.net/attachments/705329064256208957/844281233432248390/boolet_scope.png') center center no-repeat;
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
