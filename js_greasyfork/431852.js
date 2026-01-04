// ==UserScript==
// @name         formofavi
// @namespace    null
// @version      0.3
// @description  Force mobile facebook view
// @author       gidiigekau
// @match https://*/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/431852/formofavi.user.js
// @updateURL https://update.greasyfork.org/scripts/431852/formofavi.meta.js
// ==/UserScript==

if (self === top && (/(?:www.facebook.com)/).test(document.location.href)) {
    var target = document.location.href.replace(/www.facebook/g, "m.facebook");
    window.location.replace(target);
}

if (self === top && (/(?:https:\/\/m.facebook.com\/login\/\?next\=)/).test(document.location.href)) {
    var next = decodeURIComponent(document.location.href.split('?next=')[1]);
    window.location.replace(next);
}
