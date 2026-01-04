// ==UserScript==
// @name         StickyTopic
// @namespace    Empornium
// @version      1.0.1
// @description  Persist the forum topic title at top of page when scrolling
// @author       vandenium
// @include     /^https://www\.empornium\.(me|sx|is)\/forum\/thread*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477489/StickyTopic.user.js
// @updateURL https://update.greasyfork.org/scripts/477489/StickyTopic.meta.js
// ==/UserScript==
// Changelog:
// Version 1.0.1
//  - Fix background issue in some themes.
// Version 1.0.0:
//  - Initial version
(function() {
    'use strict';

    const h2 = document.querySelector("h2");
    const h2Top = h2.cloneNode(true);
    const bodyColor = window.getComputedStyle(document.body).backgroundColor;
    const getDisplayProp = () => window.scrollY <= 100 ? 'none' : 'block';
    h2Top.style.cssText = `margin: 0; position: fixed; z-index: 10; display: ${getDisplayProp()}; width: 100%; background: ${bodyColor}`;
    document.body.prepend(h2Top);
    const handleScroll = () => {
        h2Top.style.display = getDisplayProp();
    };
    addEventListener("scroll", handleScroll);
})();