// ==UserScript==
// @name         Excalidraw Custom Font
// @description  Use your favorite font in Excalidraw.
// @version      0.1
// @author       NekoChan
// @match        https://excalidraw.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=excalidraw.com
// @license      MIT
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/764519
// @downloadURL https://update.greasyfork.org/scripts/477958/Excalidraw%20Custom%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/477958/Excalidraw%20Custom%20Font.meta.js
// ==/UserScript==

GM_addStyle(`
  @font-face {
    font-family: "Virgil";
    src: url("https://raw.githubusercontent.com/max32002/JasonHandWritingFonts/master/webfont/JasonHandwriting1-Regular.woff2");
    font-display: swap;
  }
`)
