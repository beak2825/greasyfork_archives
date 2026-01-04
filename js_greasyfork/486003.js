// ==UserScript==
// @name         Musicnotes Sample Watermark Remover
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Removes the watermark when printing samples on musicnotes.com
// @author       bvdeijzen
// @license      MIT
// @match        *://www.musicnotes.com/sheetmusic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486003/Musicnotes%20Sample%20Watermark%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/486003/Musicnotes%20Sample%20Watermark%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*global Mneme */
    Mneme.Render.MtdInterp.prototype.Sample = () => {};
})();