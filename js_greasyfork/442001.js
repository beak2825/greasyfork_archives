// ==UserScript==
// @name         Kirka Css Injector
// @author       ©2022 DdDd
// @version      1.1
// @match        *://kirka.io/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?domain=kirka.io    
// @description   custom css injector for kirka.io
// @namespace https://greasyfork.org/users/858307
// @downloadURL https://update.greasyfork.org/scripts/442001/Kirka%20Css%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/442001/Kirka%20Css%20Injector.meta.js
// ==/UserScript==

//                        REPLACE THE LINK IN THE " " WITH YOUR OWN CSS LINK
const cssLink = "https://cdn.discordapp.com/attachments/738010330780926004/955078958918033438/Titans.css";

document.addEventListener("DOMContentLoaded", () => {

    let cssLinkElem = document.createElement("link");
    cssLinkElem.href = cssLink;
    cssLinkElem.rel = "stylesheet";

    document.head.append(cssLinkElem);

});