// ==UserScript==
// @name         Mapillary Shrocuts
// @version      0.2
// @description  Mapillary Sequence Editor Shrocuts
// @author       Anton Shevchuk
// @license      MIT License
// @match        https://www.mapillary.com/*
// @namespace    https://greasyfork.org/users/227648
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392733/Mapillary%20Shrocuts.user.js
// @updateURL https://update.greasyfork.org/scripts/392733/Mapillary%20Shrocuts.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* global document */
(function() {
    'use strict';
    document.addEventListener('keypress', (event) => {
        if (event.code == 'KeyW')
        {
            document.querySelector('.SequenceStepNext').click();
        };
        if (event.code == 'KeyS')
        {
            document.querySelector('.SequenceStepPrev').click();
        };
        if (event.code == 'KeyD')
        {
            document.querySelector('.SemiTransparentBg button.DeleteStateBtn').click();
        };
    });
})();
