// ==UserScript==
// @name         Kein Tag im Seitentitel
// @namespace    http://pr0gramm.com/user/koma/no-tag-in-title
// @version      0.1
// @description  Es bleibt hier alles so wie es ist
// @author       koma
// @match        https://pr0gramm.com/*
// @grant        none
// @run-at       document-end
// @icon         https://pr0gramm.com/media/pr0gramm-favicon.png
// @downloadURL https://update.greasyfork.org/scripts/379360/Kein%20Tag%20im%20Seitentitel.user.js
// @updateURL https://update.greasyfork.org/scripts/379360/Kein%20Tag%20im%20Seitentitel.meta.js
// ==/UserScript==

(function() {
    window.p.View.Stream.Tags.prototype.loaded = new Function('item', window.p.View.Stream.Tags.prototype.loaded.toString().replace(/^function\(item\)\{([\s\S]+?)p\.mainView.setTitle\([^)]+\);\}$/, "$1"));
})();