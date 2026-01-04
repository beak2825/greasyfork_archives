// ==UserScript==
// @name         r/PlaceNL Overlay System
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  r/PlaceNL
// @author       tt2468
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/442697/rPlaceNL%20Overlay%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/442697/rPlaceNL%20Overlay%20System.meta.js
// ==/UserScript==
 
var child = null;
 
function getImage() {
    var num = Math.random();
 
    const i = document.createElement("img");
    i.src = "https://placenl.noahvdaa.me/maps/template.png?v=" + num;
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