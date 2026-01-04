// ==UserScript==
// @name         ASMR Raw File
// @namespace    aoi suki
// @version      0.1
// @description  try to take over the omanko!
// @author       Yui
// @match        https://www.asmr.one/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asmr.one
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453660/ASMR%20Raw%20File.user.js
// @updateURL https://update.greasyfork.org/scripts/453660/ASMR%20Raw%20File.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.querySelector("#q-app > div > header > div.q-toolbar.row.no-wrap.items-center.row.justify-between > button.q-btn.q-btn-item.non-selectable.no-outline.q-btn--flat.q-btn--round.q-btn--actionable.q-focusable.q-hoverable.q-btn--wrap.q-btn--dense > span.q-btn__wrapper.col.row.q-anchor--skip > span > i").onclick=function(){window.open(document.getElementsByTagName('audio')[0].children[0].src,'target','')}
})();