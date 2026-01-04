// ==UserScript==
// @name         Scope Theme - Moon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Same Scope That Moon Uses
// @author       Stormii Cloud
// @match        https://shellshock.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474948/Scope%20Theme%20-%20Moon.user.js
// @updateURL https://update.greasyfork.org/scripts/474948/Scope%20Theme%20-%20Moon.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
*{

#maskmiddle {
    background: url('https://i.imgur.com/TbyE9aO.png') center center no-repeat;
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