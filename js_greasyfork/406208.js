// ==UserScript==
// @name         Github New Layout Widescreen Fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406208/Github%20New%20Layout%20Widescreen%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/406208/Github%20New%20Layout%20Widescreen%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const e = document.createElement('style');
    e.innerText = `.UnderlineNav { margin: 0 auto; max-width: 1400px } .pagehead { box-shadow: inset 0 -1px 0 #e1e4e8 } div.pagehead > div { margin: 0 auto; max-width: 1400px }
div.js-header-wrapper { background: #242a2f }
.Header { margin: 0 auto; max-width: 1400px }`;
    document.querySelector('head').append(e);
})();