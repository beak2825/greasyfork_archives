// ==UserScript==
// @name         Scope Theme - Circle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scope - Circle
// @author       Cluck36
// @match        https://shellshock.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476921/Scope%20Theme%20-%20Circle.user.js
// @updateURL https://update.greasyfork.org/scripts/476921/Scope%20Theme%20-%20Circle.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
*{

#maskmiddle {
    background: url('https://media.discordapp.net/attachments/836263147290624081/1066540876349833236/IMG_6524.png?ex=65348518&is=65221018&hm=2a3d099a2cdf4976a18ee66cabded06f2af5d8f451a0f35ea3754b761b51fa14&=&width=989&height=989') center center no-repeat;
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