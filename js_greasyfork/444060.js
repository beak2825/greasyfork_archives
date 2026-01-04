// ==UserScript==
// @name         Diep.io Grayscale Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  read the title
// @author       bismuth
// @match        *diep.io
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/444060/Diepio%20Grayscale%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/444060/Diepio%20Grayscale%20Theme.meta.js
// ==/UserScript==
['stroke','fill'].forEach(method => {
    CanvasRenderingContext2D.prototype[method] = new Proxy(CanvasRenderingContext2D.prototype[method], {
        apply: (target,_this,args) => {
            //console.log(_this.fillStyle);
            const fill = [parseInt(_this[`${method}Style`].slice(1,3), 16), parseInt(_this[`${method}Style`].slice(3,5), 16), parseInt(_this[`${method}Style`].slice(5,7), 16)];
            const grayscaleValue = ((((fill[0] << 4) - fill[0] + fill[1] + (fill[2] << 4)) >> 5) & 255).toString(16);
            _this[`${method}Style`] = `#${grayscaleValue}${grayscaleValue}${grayscaleValue}`;
            return Reflect.apply(target,_this,args);
        }
    });
});