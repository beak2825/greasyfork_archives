// ==UserScript==
// @name         https everywhere
// @namespace    https://www.youtube.com/watch?v=sHwvUFjaNdU
// @version      0.03
// @description  Make every page https with this very simple script!
// @author       You
// @match        http://*/*
// @icon         https://image.flaticon.com/icons/png/512/1652/1652335.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426322/https%20everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/426322/https%20everywhere.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // this simple strip of code reloads the page to https!
    if (location.protocol !== "https:"){
 location.replace(window.location.href.replace("http:", "https:"));
}
})();