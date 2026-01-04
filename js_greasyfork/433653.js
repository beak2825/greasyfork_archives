// ==UserScript==
// @name         Change font - Diep.io
// @version      1.0.0
// @description  Changes the font to something else
// @author       Excigma
// @namespace    https://greasyfork.org/users/416480 
// @match        https://diep.io/*
// @run-at       document-body
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/433653/Change%20font%20-%20Diepio.user.js
// @updateURL https://update.greasyfork.org/scripts/433653/Change%20font%20-%20Diepio.meta.js
// ==/UserScript==

(() => {
    // This must be from Google fonts (fonts.google.com).
    const options = {
        fontFamily: "Abril Fatface",
    };

    // Add the font to the page, this makes your browser load the font
    // so you can use it later
    let font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = `https://fonts.googleapis.com/css2?family=${options.fontFamily.split(" ").join("+")}&display=swap`;

    document.head.appendChild(font);

    // This makes your name in the "This is the tale of..." to become the font you want
    GM_addStyle(`
#textInput {
    box-shadow: none !important;
    transform: translateY(-2.5px);
    font-family: ${options.fontFamily} !important;
}

`);

    // This is inspired by Binary-person's minimap AFK script
    // found here: https://greasyfork.org/en/scripts/412171-diep-io-minimap-afk
    const { set: fontSetter } = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "font");
    Object.defineProperty(unsafeWindow.CanvasRenderingContext2D.prototype, "font", {
        // When it tries to set the font to "Ubuntu", (which is diep's default font), set it to our custom font instead
        set(value) {
            fontSetter.call(this, value.replace("Ubuntu", `'${options.fontFamily}'`));
        }
    });
})()