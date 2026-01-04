// ==UserScript==
// @name         IEEE Xplore pdf no banner
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  delete the banner in IEEE Xplore pdf display page.
// @author       ladyrick
// @match        http://ieeexplore.ieee.org/stamp/stamp.jsp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35779/IEEE%20Xplore%20pdf%20no%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/35779/IEEE%20Xplore%20pdf%20no%20banner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll("body>iframe").forEach(function(dom, ind){
        if (ind === 0) {
            dom.style.display = "none";
        } else {
            dom.style.height = "100%";
        }
    });
})();