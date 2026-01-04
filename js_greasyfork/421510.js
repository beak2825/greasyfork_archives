// ==UserScript==
// @name         Better Pixiv Discovery
// @namespace    https://lesnow.tk/
// @version      1.0
// @description  Zoom in; Remove footer.
// @author       LeSnow_Ye
// @match        https://www.pixiv.net/discovery
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421510/Better%20Pixiv%20Discovery.user.js
// @updateURL https://update.greasyfork.org/scripts/421510/Better%20Pixiv%20Discovery.meta.js
// ==/UserScript==

(function() {
    var body = document.querySelector(".layout-body").style.cssText = "transform-origin: top;scale: 1.4;";
    document.querySelector(".footer._classic-footer.ya-pc-overlay").remove();
})();