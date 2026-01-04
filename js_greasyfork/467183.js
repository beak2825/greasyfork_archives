// ==UserScript==
// @name         Change font
// @version      1.0.0
// @description  Changes the font to something else
// @author       Excigma
// @namespace    https://greasyfork.org/users/416480
// @match        https://diep.io/*
// @run-at       document-body
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/467183/Change%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/467183/Change%20font.meta.js
// ==/UserScript==


(() => {
    // This must be from Google fonts (fonts.google.com).
    const options = {
        fontFamily: "PT Sans",
    };

    let font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=PT+Sans&display=swap";
    // get font link from google fonts, from the right sidebar. refresh if you don't see it

    document.head.appendChild(font);

    const { set: fontSetter } = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "font");
    Object.defineProperty(unsafeWindow.CanvasRenderingContext2D.prototype, "font", {
        set(value) {
    // same as first variable
            fontSetter.call(this, value.replace("Ubuntu", 'PT Sans'));
        }
    });
})()
