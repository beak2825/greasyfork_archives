// ==UserScript==
// @name         cleanLinuxQuestionsOrg
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  clean LinuxQuestions.Org ads
// @author       mooring@codernotes.club
// @match        https://www.linuxquestions.org/*
// @icon         https://www.google.com/s2/favicons?domain=linuxquestions.org
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/427082/cleanLinuxQuestionsOrg.user.js
// @updateURL https://update.greasyfork.org/scripts/427082/cleanLinuxQuestionsOrg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = 'ins[id],ins[class*=google],div[id*=_ad_],td.page[valign="top"] > div[style*=center]{display:none!important}';
    var style = document.createElement('style');
    style.innerText = css;
    document.body.previousElementSibling.appendChild(style)
})();