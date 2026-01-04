// ==UserScript==
// @name         Flowgame.io Nickname Color!
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Have fun! Read the code instructions carefully
// @author       SakuroProCoder :D
// @match        *://*.flowgame.io/*
// @match        *://*.flowy.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flowgame.io
// @grant        document-start
// @downloadURL https://update.greasyfork.org/scripts/442523/Flowgameio%20Nickname%20Color%21.user.js
// @updateURL https://update.greasyfork.org/scripts/442523/Flowgameio%20Nickname%20Color%21.meta.js
// ==/UserScript==

if (window.flowExtensions) {
  window.flowExtensions.register('https://greasyfork.org/en/scripts/442523-flowgame-io-nickname-color');
}
(function() {
    var Properties = {
        SCRIPT_CONFIG: {
            NAME_COLOR: "turquoise", // the color, which the target name should be changed to
        },
        MENU_CONFIG: {

            COLOR_1: "#00FFF0", // you can use color codes, rgba, hsl, rgb or just color names.
        },
    }
    function changebackgroundcolor() {

        $('.fade-box').css({
            background: 'linear-gradient(to right bottom,hsl('+Properties.COLOR_HUE+', 50%, 50%),hsl('+Properties.COLOR_HUE2+', 50%, 50%)'
        })
    }
    var { fillText } = CanvasRenderingContext2D.prototype;
    CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
        let localstorage = Properties.SCRIPT_CONFIG
        if(text == document.getElementById("nickname").value) {
            this.fillStyle = localstorage.NAME_COLOR;
        }
        fillText.call(this, ...arguments);
    }
    document.addEventListener("DOMContentLoaded", ready)
})();