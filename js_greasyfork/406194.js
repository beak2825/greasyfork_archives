// ==UserScript==
// @name         Show Web App Version
// @namespace    https://crossjs.com/
// @version      0.4
// @description  show app version and building timestamp!
// @author       crossjs
// @match        *://*.arnoo.com/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/406194/Show%20Web%20App%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/406194/Show%20Web%20App%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const radix = chars.length;

    function decode(str) {
        const len = str.length;
        let num = 0;
        for (let i = 0; i < len; i++) {
            num += chars.indexOf(str.charAt(len - i - 1)) * Math.pow(radix, i);
        }
        return num;
    }

    const prefix = "VERSION: ";

    const showVersion = () => {
        const element = document.querySelector("[data-role=__VERSION_AND_TIMESTAMP__]");
        if (element) {
            const value = element.textContent;
            if (value.indexOf(prefix) === 0) {
                const [_, v, d] = value.match(/^VERSION: (\d+\.\d+\.\d+(?:-(?:alpha|beta)\.\d+)?)\.(.+)$/)
                alert(`Version: ${v}\nTS: ${new Date(decode(d))}`);
                return;
            }
        }
        setTimeout(showVersion, 1000)
    };

    GM_registerMenuCommand('Show Web App Version', showVersion);
})();