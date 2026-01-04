// ==UserScript==
// @name         r/place Canvas Clearer
// @namespace    https://reddit.com
// @version      0.2
// @description  One button to clear the canvas and see where the activity is
// @author       tt2468
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/442535/rplace%20Canvas%20Clearer.user.js
// @updateURL https://update.greasyfork.org/scripts/442535/rplace%20Canvas%20Clearer.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', () => {
        addButton('Clear Canvas', clearCanvas)
    })

    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {position: 'absolute', bottom: '12%', left:'4%', 'z-index': 3}
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        btnStyle.position = 'absolute'
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    }

    function clearCanvas() {
        var canvas = document.querySelector("body > mona-lisa-app > faceplate-csrf-provider > faceplate-alert-reporter > mona-lisa-embed").shadowRoot.querySelector("div > mona-lisa-share-container > mona-lisa-camera > mona-lisa-canvas").shadowRoot.querySelector("div > canvas");
        var ctx = canvas.getContext("2d");

        const templateCanvas = new OffscreenCanvas(canvas.width, canvas.height);
        const templateCtx = templateCanvas.getContext('2d');

        templateCtx.fillStyle = 'white';
        templateCtx.fillRect(0, 0, canvas.width, canvas.height);

        var templateImgData = templateCtx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(templateImgData, 0, 0);

        console.log("Canvas cleared.");
    }
})();