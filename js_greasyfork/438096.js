// ==UserScript==
// @name         Ugly and Crazy theme
// @namespace    lol
// @version      0.1
// @description  Make arras io ugly
// @author       idk
// @match        *https://arras.io/*
// @icon         https://arras.io/favicon/128x128.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438096/Ugly%20and%20Crazy%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/438096/Ugly%20and%20Crazy%20theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

CanvasRenderingContext2D.prototype._lineTo = CanvasRenderingContext2D.prototype.lineTo;

CanvasRenderingContext2D.prototype.lineTo = function(){

    this._lineTo(arguments[0]-10, arguments[1]+20)
}
})();