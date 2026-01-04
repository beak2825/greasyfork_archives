// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world
// @author       Shlong with the big dingdong
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?domain=diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430012/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/430012/New%20Userscript.meta.js
// ==/UserScript==

CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
    apply(reference, _this, args) {
        if (_this.fillStyle == "#ffff90") {
            _this.fillStyle = "#03fcfc";
        }
        return reference.apply(_this, args);
    }
});