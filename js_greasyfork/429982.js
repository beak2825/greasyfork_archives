// ==UserScript==
// @name         Theme
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  x
// @author       You
// @match        https://diep.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429982/Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/429982/Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Fira+Sans:wght@900&display=swap');
    document.head.appendChild(link);

    const crx = CanvasRenderingContext2D.prototype;
    crx.fillText = new Proxy(crx.fillText, {
        apply: (f, _this, args) => {
            _this.font = `${(parseFloat(_this.font.split(' ')[0]))}px Fira Sans`;
            return f.apply(_this, args);
        },
    });

    crx.strokeText = new Proxy(crx.strokeText, {
        apply: (f, _this, args) => {
            _this.font = `${(parseFloat(_this.font.split(' ')[0]))}px Fira Sans`;
            return f.apply(_this, args);
        },
    });
})();