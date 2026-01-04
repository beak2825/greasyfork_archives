// ==UserScript==
// @name         Pink CrossHair
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  stuff
// @author       Cluck36
// @match        https://shellshock.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477566/Pink%20CrossHair.user.js
// @updateURL https://update.greasyfork.org/scripts/477566/Pink%20CrossHair.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.title="Shell"
        document.head.innerHTML += `<style>

.crosshair {
	position: absolute;
	transform-origin: 50% top;
	top: 50%;
	border: solid 0.05em #FFC0CB;
	height: 0.8em;
	margin-bottom: 0.12em;
	opacity: 0.7;
}

.crosshair.normal {
	left: calc(50% - 0.15em);
	background: #FFC0CB;
	width: 0.3em;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: red;
	width: 0.5em;
}


</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();