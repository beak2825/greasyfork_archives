// ==UserScript==
// @name         Scope Theme - Purple 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scope - Purple
// @author       Stormii Cloud
// @match        https://shellshock.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475188/Scope%20Theme%20-%20Purple.user.js
// @updateURL https://update.greasyfork.org/scripts/475188/Scope%20Theme%20-%20Purple.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
*{

#maskmiddle {
    background: url('https://cdn.discordapp.com/attachments/1026318625436602419/1039020872217940008/imageedit_16_6909081453.png') center center no-repeat;
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