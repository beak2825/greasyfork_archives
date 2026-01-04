// ==UserScript==
// @name         r/nicaragua para r/place
// @namespace    http://tampermonkey.net/
// @version      0.97
// @description  do what we say
// @author       tt2468
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/442776/rnicaragua%20para%20rplace.user.js
// @updateURL https://update.greasyfork.org/scripts/442776/rnicaragua%20para%20rplace.meta.js
// ==/UserScript==

var child = null;

function getImage() {
    const i = document.createElement("img");
    i.src = "https://i.ibb.co/3ykC2wg/rnicaragua-pixel-final-op84.png";
    i.style = "position: absolute;left: 1430px;top: 1971px;image-rendering: pixelated;width: 41px;height: 27px;";
    return i;
}

function refreshTemplate() {
    var x = document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0];
    if (child) {
        x.removeChild(child);
    }
    child = getImage();
    x.appendChild(child, false);

    console.log("Template has been updated.");
}

function refreshTemplateLoop() {
    refreshTemplate();
    setTimeout(function() { refreshTemplateLoop(); }, 300*1000);
}

(function() {
    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {position: 'absolute', bottom: '5%', left:'4%', 'z-index': 3}
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        btnStyle.position = 'absolute'
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]})
        return button
    }

    window.addEventListener('load', () => {
        setTimeout(function() { refreshTemplateLoop(); }, 4000);
        addButton('Update Template', refreshTemplate)
    })
})();