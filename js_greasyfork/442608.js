// ==UserScript==
// @name         Totless r/Place Overlay
// @namespace    http://tampermonkey.net/
// @version      420
// @description  Yoink my script now :dab:
// @author       Ramiris
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      GNU GPLv3
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/442608/Totless%20rPlace%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/442608/Totless%20rPlace%20Overlay.meta.js
// ==/UserScript==

var blendButton = null
var child = null;
var opacity = 0.7
var blendMode = 0
const blends = ["normal","multiply","screen","overlay","darken","lighte","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"]

function getImage() {
    const i = document.createElement("img");
    i.src = "https://git.roundtableinteractive.co.uk/Ramiris/DJFry/-/raw/2.0/totlesstemplate.png"
    i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 4000px;height: 4000px; filter:alpha(opacity=50); -moz-opacity:0.5;";
    i.style.opacity = opacity;
    i.style.filter = 'alpha(opacity=' + String(opacity*100) + ')';
    i.style.mixBlendMode = blends[blendMode];
    return i;
}

function refreshTemplate() {
    var x = document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0];
    if (child) {
        x.removeChild(child);
        child = null;
        console.log("Template has been removed.");
    }
    else {
        child = getImage();
        x.appendChild(child, false);
        console.log("Template has been added.");
    }
}

function nextBlendMode() {
    if (child) {
        blendMode = (blendMode + 1) % blends.length;
        child.style.mixBlendMode = blends[blendMode];
        blendButton.innerHTML = "Blend: " + blends[blendMode]
        console.log("Blend Mode set to: " + blends[blendMode]);
    }
}

function addOpacity() {
    if (child) {
        opacity = Math.min(Math.max(opacity + 0.1, 0.1), 1);
        child.style.opacity = opacity;
        child.style.filter = 'alpha(opacity=' + String(opacity*100) + ')';
        console.log("Opacity Increased to: " + opacity);
    }
}

function removeOpacity() {
    if (child) {
        opacity = Math.min(Math.max(opacity - 0.1, 0.1), 1);
        child.style.opacity = opacity;
        child.style.filter = 'alpha(opacity=' + String(opacity*100) + ')';
        console.log("Opacity Increased to: " + opacity);
    }
}

(function() {
    function addButton(text, onclick, cssObj) {
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.style.color = "grey";
        button.style.border = "0px none";
        button.style.backgroundColor = "white";
        button.onclick = onclick
        btnStyle.position = 'absolute'
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]})
        return button
    }

    window.addEventListener('load', () => {
        refreshTemplate()
        blendButton = addButton('Blend: Normal', nextBlendMode, {position: 'absolute', bottom: '120px', left:'20px', 'z-index': 3})
        addButton('Toggle Overlay', refreshTemplate, {position: 'absolute', bottom: '160px', left:'20px', 'z-index': 3})
        addButton('-10%', addOpacity, {position: 'absolute', bottom: '200px', left:'20px', 'z-index': 3})
        addButton('+10%', removeOpacity, {position: 'absolute', bottom: '200px', left:'84px', 'z-index': 3})
    })
})();