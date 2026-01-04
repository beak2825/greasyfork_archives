// ==UserScript==
// @name         Emanon Twemoji Mod
// @version      1.0.6
// @description  Rendering twemoji smile's on chat mangalib.me
// @author       reiwsan
// @match        https://mangalib.me/*
// @match        https://yaoilib.me/*
// @match        https://ranobelib.me/*
// @grant        GM_addStyle
// @require      https://cdn.staticfile.org/twemoji/12.0.4/2/twemoji.min.js
// @icon         https://cdn.staticfile.org/twemoji/12.0.4/2/72x72/1f47a.png
// @namespace    https://greasyfork.org/users/221048
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/373749/Emanon%20Twemoji%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/373749/Emanon%20Twemoji%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SUPPORTS_SVG = (document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1"));

    /**
     * @param {string} emoji code
     * @returns {string}
     */
    const twemojiPath = function(icon) {
        let folder = '72x72',
            type = 'png';

        if (SUPPORTS_SVG) {
            folder = type = 'svg';
        }

        return `https://cdn.staticfile.org/twemoji/12.0.4/2/${folder}/${icon}.${type}`;
    };

    unsafeWindow.emanon.addMessageMutation(
        message => {
            twemoji.parse(message, {
                className: '_emanon-emoji',
                callback: function(icon) {
                    switch ( icon ) {
                        case 'a9':      // copyright  ©
                        case 'ae':      // trademark  ®
                        case '2122':    // team       ™
                            return false;
                    }

                    return twemojiPath(icon);
                }
            });
        }
    );

    GM_addStyle("img._emanon-emoji { height: 1.1em !important; width: 1.1em !important; margin: 0 .05em 0 .1em !important; vertical-align: -0.2em !important;}");
})();