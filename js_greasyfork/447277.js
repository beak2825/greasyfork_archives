// ==UserScript==
// @name Taming.io Anti Caracal Ability
// @author Murka
// @description Removes brown background when caracal ability is enabled
// @icon https://taming.io/img/interface/favicon.png
// @version 0.3
// @match *://taming.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/447277/Tamingio%20Anti%20Caracal%20Ability.user.js
// @updateURL https://update.greasyfork.org/scripts/447277/Tamingio%20Anti%20Caracal%20Ability.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/cPRFdcZkeD
    Greasyfork: https://greasyfork.org/en/users/919633
*/

(function() {
    "use strict";

    CanvasRenderingContext2D.prototype.fillRect = new Proxy(CanvasRenderingContext2D.prototype.fillRect, {
        apply(target, _this, args) {
            if (_this.fillStyle === "#3a322c") return null;
            return target.apply(_this, args);
        }
    })

})();