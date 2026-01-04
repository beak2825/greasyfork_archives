// ==UserScript==
// @name         Scope Theme - Green
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scope - Green
// @author       Stormii Cloud
// @match        https://shellshock.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475187/Scope%20Theme%20-%20Green.user.js
// @updateURL https://update.greasyfork.org/scripts/475187/Scope%20Theme%20-%20Green.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
*{

#maskmiddle {
    background: url('https://myclientsites.com/adamx/toxictheme/scope.png') center center no-repeat;
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