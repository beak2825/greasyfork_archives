// ==UserScript==
// @author      Carlos Feldmann <feldmannjunior@gmail.com>
// @namespace   https://feldmann.dev
// @name        Whatsapp Sidebar Hider
// @include     https://web.whatsapp.com/
// @version     0.2
// @description Hide the whatsapp side bar
// @downloadURL https://update.greasyfork.org/scripts/411388/Whatsapp%20Sidebar%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/411388/Whatsapp%20Sidebar%20Hider.meta.js
// ==/UserScript==

(function () {
    let pane = null;
    let oldPane;
    let oldRegion;
    let region;
    let myButton = document.createElement("button");
    let hidding = false;

    function toggleVisibility() {
        pane = document.getElementById('pane-side');
        region = document.querySelector('[role="region"]');
        if (hidding) {
            pane.setAttribute('style', oldPane);
            region.setAttribute('style', oldRegion);
            myButton.innerHTML = 'Hide';
        } else {
            oldPane = pane.style.cssText;
            oldRegion = region.style.cssText;
            console.log(oldPane,oldRegion);
            pane.setAttribute('style', 'visibility:collapse !important');
            region.setAttribute('style', 'visibility:hidden !important');
            myButton.innerHTML = 'Show';
        }
        hidding = !hidding;
    }

    myButton.id = 'customButtom';
    myButton.innerHTML = "Hide";
    myButton.style.background = 'lightgray';
    myButton.style.color = 'black';
    myButton.style.borderRadius = '40px';
    myButton.style.padding = '5px';
    myButton.onclick = toggleVisibility;

    function changeButton() {
        let button = document.querySelector('[role="button"],[title="Status"]');
        let clone = button.parentNode.cloneNode(true);
        clone = button.parentNode.parentNode.insertBefore(clone, button.parentNode);
        clone.replaceChild(myButton, clone.firstChild);
    }


    function checkScreenLoaded() {
        setTimeout(function () {

            pane = document.getElementById('pane-side');
            region = document.querySelector('[role="region"]');
            if (pane != null && region != null) {
                changeButton();

            } else {
                checkScreenLoaded();
            }
        }, 50);
    }
    checkScreenLoaded();
})();