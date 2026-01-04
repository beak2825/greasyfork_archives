// ==UserScript==
// @name         VGD Fixes
// @namespace    nikku
// @license      MIT
// @version      0.1
// @description  На ВГД в разделе "Закладки - Новое" делает так, чтобы по клику открывался последний пост
// @author       nikku
// @match        https://forum.vgd.ru/index.php?m=feed&a=bookmarks*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vgd.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466194/VGD%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/466194/VGD%20Fixes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('.profiletable').forEach(function(table) {
        var link = table.querySelector('.username');
        link.href = link.href.replace('post/', '').replace('p.htm#pp', '#last');
    });
})();