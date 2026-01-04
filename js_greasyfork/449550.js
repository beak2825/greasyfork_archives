// ==UserScript==
// @name         Fanfiction.net - contenteditable
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make stories on fanfiction.net editable
// @author       NickKolok
// @match        https://www.fanfiction.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanfiction.net
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/449550/Fanfictionnet%20-%20contenteditable.user.js
// @updateURL https://update.greasyfork.org/scripts/449550/Fanfictionnet%20-%20contenteditable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('storytext').contentEditable="true";
})();