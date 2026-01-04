// ==UserScript==
// @name         Scope Theme - K4hhny
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Same Scope K4hhny Uses
// @author       Stormii Cloud
// @match        https://shellshock.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475024/Scope%20Theme%20-%20K4hhny.user.js
// @updateURL https://update.greasyfork.org/scripts/475024/Scope%20Theme%20-%20K4hhny.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
*{

#maskmiddle {
    background: url('https://cdn.discordapp.com/attachments/743631842527150122/954343221088092220/scope.png') center center no-repeat;
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