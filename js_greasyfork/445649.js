// ==UserScript==
// @name         Madgrades in Course Search
// @namespace    https://github.com/JayC180
// @version      1.2
// @description  Adds a button that takes you to madgrades on the course that you are currently inspecting.
// @author       JayC
// @match        *://enroll.wisc.edu/search*
// @match        *://madgrades.com/search?query=*
// @icon         https://enroll.wisc.edu/assets/img/uw-crest.svg
// @grant        GM_getValue
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445649/Madgrades%20in%20Course%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/445649/Madgrades%20in%20Course%20Search.meta.js
// ==/UserScript==

'use strict';
(function() {
    if (window.location.href.includes("//madgrades.com/search?query=")) {
        window.onload = () => {
            var page = document.getElementsByClassName("content")[2].href;
            window.open(page, "_self").focus();
        };
    }

    const targetNode = document.getElementsByClassName("cdk-live-announcer-element cdk-visually-hidden")[0];
    var config = { characterData: false, attributes: false, childList: true, subtree: false };

    const callback = function(mutation) {
        const n = document.getElementsByClassName("catalog-ref");
        if (typeof n[0].childNodes[1] === 'undefined') {
                addButton();
            } else {
                n[0].childNodes[1].remove();
                n[0].childNodes[1].remove();
                addButton();
            }
    }
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

})();

function addButton() {
    const n = document.getElementsByClassName("catalog-ref");
    const str = n[0].textContent;
    console.log(str);
    const btn = document.createElement("button");
    btn.innerHTML = "Madgrades";
    btn.onclick = () => {
        exLink(str);
    }

    var t = document.createTextNode("\u00A0");
    n[0].insertBefore(btn, n[0].childNodes[0].nextSibling);
    n[0].insertBefore(t, n[0].childNodes[0].nextSibling);
    btn.style.color = "red";
}

function exLink(str) {
    var url = "https://madgrades.com/search?query=" + str;
    window.open(url, '_blank').focus();
}
