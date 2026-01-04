// ==UserScript==
// @name         [Box] Modify icon-view size step
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       SSARCandy
// @match        https://app.box.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32427/%5BBox%5D%20Modify%20icon-view%20size%20step.user.js
// @updateURL https://update.greasyfork.org/scripts/32427/%5BBox%5D%20Modify%20icon-view%20size%20step.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(()=> {
        $('div.file-list-header.icon-view > .file-list-icon-view-control > input').attr('step', 1);
    }, 3000);

})();