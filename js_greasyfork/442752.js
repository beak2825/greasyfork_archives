// ==UserScript==
// @name         SAMURAJ BOT
// @namespace    http://tampermonkey.net/
// @version      
// @description  FREAK GO GOG OGGO GOGOGO
// @author       SAMURAJ
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/442752/SAMURAJ%20BOT.user.js
// @updateURL https://update.greasyfork.org/scripts/442752/SAMURAJ%20BOT.meta.js
// ==/UserScript==

var child = null;

function getImage() {
    const i = document.createElement("img");
    i.src = "https://pic.moscow.ovh/images/2022/04/04/41365ba97be49edac7e61e7e5a7b5ab9.png?t=" + Date.now();
    i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";
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
        cssObj = cssObj || {position: 'absolute', bottom: '10%', left:'8%', 'z-index': 5}
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        btnStyle.position = 'absolute'
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]})
        return button
    }

    window.addEventListener('load', () => {
        setTimeout(function() { refreshTemplateLoop(); }, 12000);
        addButton('FREAK SHOW', refreshTemplate)
    })
})();