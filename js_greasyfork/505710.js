// ==UserScript==
// @name         MooMoo.io Text Custimazition
// @namespace    https://moomoo.io/
// @version      2024-08-29
// @description  MooMoo.io outline rendering to texts.
// @author       BianosakaSozinho
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505710/MooMooio%20Text%20Custimazition.user.js
// @updateURL https://update.greasyfork.org/scripts/505710/MooMooio%20Text%20Custimazition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalFillText = CanvasRenderingContext2D.prototype.fillText;
    const originalStrokeText = CanvasRenderingContext2D.prototype.strokeText;

    CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
        if(text === `X`) return
        originalStrokeText.call(this, text, x, y, maxWidth);
        originalFillText.call(this, text, x, y, maxWidth);
    };
})();