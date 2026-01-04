// ==UserScript==
// @name         Bloolet's CrossHair/Scope
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Boolet's Scope/CrossHair
// @author       Cluck36
// @match        https://shellshock.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477398/Bloolet%27s%20CrossHairScope.user.js
// @updateURL https://update.greasyfork.org/scripts/477398/Bloolet%27s%20CrossHairScope.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.title="Boolet"
        document.head.innerHTML += `<style>

#maskmiddle {
    background: url('https://media.discordapp.net/attachments/1000151470634700900/1010127774356348968/boolet_scope.png?width=556&height=556') center center no-repeat;
    background-size: contain;
    width: 100vh;
    height: 100vh;
}

.crosshair {
	position: absolute;
	transform-origin: 50% top;
	top: 50%;
	border: solid 0.05em #478ef8;
	height: 0.8em;
	margin-bottom: 0.12em;
	opacity: 0.7;
}

.crosshair.normal {
	left: calc(50% - 0.15em);
	background: #478ef8;
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