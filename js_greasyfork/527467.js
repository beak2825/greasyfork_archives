// ==UserScript==
// @name         VGMdb Date Format YYYY-MM-DD
// @namespace    nya.nya.nya
// @version      0.1
// @description  Convert album page dates to YYYY-MM-DD format for easier metadata entry
// @author       nya
// @match        https://vgmdb.net/album/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527467/VGMdb%20Date%20Format%20YYYY-MM-DD.user.js
// @updateURL https://update.greasyfork.org/scripts/527467/VGMdb%20Date%20Format%20YYYY-MM-DD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('a[title^="View albums released on"]').forEach(link => {
        let dateObj = new Date(link.innerText);
        if (!isNaN(dateObj)) {
            link.innerText = `${dateObj.getFullYear()}-${('0' + (dateObj.getMonth() + 1)).slice(-2)}-${('0' + dateObj.getDate()).slice(-2)}`;
        }
    });
})();
