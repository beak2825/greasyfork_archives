// ==UserScript==
// @name            tftv black mode
// @namespace       fellen.tftvblack
// @match           *://*.teamfortress.tv/*
// @version         1.0
// @author          fellen (https://github.com/mtxfellen)
// @description     black mode for teamfortress.tv
// @icon            https://raw.githubusercontent.com/mtxfellen/tftv-black-mode/master/tftv-icon.png
// @compatible      chrome Chrome + Violentmonkey
// @homepageURL     https://github.com/mtxfellen/tftv-black-mode
// @supportURL      https://github.com/mtxfellen/tftv-black-mode/issues
// @run-at          document-start
// @resource        REMOTE_CSS https://raw.githubusercontent.com/mtxfellen/tftv-black-mode/master/blackmode.css
// @grant           GM_xmlhttpRequest
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @license         https://unlicense.org/
// @downloadURL https://update.greasyfork.org/scripts/440313/tftv%20black%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/440313/tftv%20black%20mode.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
    'use strict';
    GM_xmlhttpRequest({
        method : "GET",
        url : "https://bennettfeely.com/ztext/js/ztext.min.js",
        onload : (ev) =>
        {
            let e = document.createElement('script');
            e.innerText = ev.responseText;
            document.head.appendChild(e);
        }
    });

    const myCss = GM_getResourceText("REMOTE_CSS");
    GM_addStyle(myCss);

    setTimeout(function() {
        var ztxt = new Ztextify(".hnname", {
        depth: "30px",
        layers: 8,
        fade: true,
        direction: "forwards",
        event: "pointer",
        eventRotation: "35deg"
    });
    }, 3000);

})();
