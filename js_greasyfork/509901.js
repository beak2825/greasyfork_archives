// ==UserScript==
// @name        Breezin Thru Buttons2Keys
// @namespace   https://cbass92.org
// @match       https://breezinthrutheory.com/binder2016/index.php*
// @grant       none
// @version     1.0
// @author      Cbass92
// @description Maps the buttons in breezinthru drills to your number keys because keyboard. will probably recieve updates due to bieng hastily written
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509901/Breezin%20Thru%20Buttons2Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/509901/Breezin%20Thru%20Buttons2Keys.meta.js
// ==/UserScript==

function listenForNumberKeys() {
    document.addEventListener('keydown', function(event) {
        const key = Number(event.key);
        if (key >= 1 && key <= 9) {
            const index = key - 1;
            const controlElement = document.getElementById("control-" + index);
            if (controlElement) {
                controlElement.click();
            } else {
                console.warn(`No element found with ID: control-${index}`);
            }
        }
    });
}

window.onload = function() {
    setTimeout(() => {
        listenForNumberKeys();
    }, 3000);
};
