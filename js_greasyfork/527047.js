// ==UserScript==
// @name        Anna's Archive - Auto-expand
// @match       https://annas-archive.org/md5/*
// @version     1.0
// @author      MedX
// @namespace   MedX-AA
// @license     MIT
// @icon        https://annas-archive.org/favicon.ico
// @description Automatically expands the read more and external downloads sections on Anna's Archive book pages
// @downloadURL https://update.greasyfork.org/scripts/527047/Anna%27s%20Archive%20-%20Auto-expand.user.js
// @updateURL https://update.greasyfork.org/scripts/527047/Anna%27s%20Archive%20-%20Auto-expand.meta.js
// ==/UserScript==

for (const el of document.getElementsByClassName("js-show-external-button")) {
    el.click();
}

for (const el of document.getElementsByClassName("js-md5-top-box-description-link")) {
    el.click();
}