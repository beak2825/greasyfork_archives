// ==UserScript==
// @name         AntiMooShooScript
// @author       CROTishka
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  suck, bitch
// @match        https://forumlocal.ru/*
// @downloadURL https://update.greasyfork.org/scripts/18710/AntiMooShooScript.user.js
// @updateURL https://update.greasyfork.org/scripts/18710/AntiMooShooScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var query = null;
    switch (location.pathname) {
        case '/dosearch.php':
        case '/doasearch.php':
            query = "//tbody/tr[(contains(@class, 'lighttable') or contains(@class, 'darktable')) and td/a[contains(., 'CROTishka')]]/td[4]";
            break;
        case '/showflat.php':
            query = "//table//table//table//tr[td/table/tbody/tr/td/a[text()='CROTishka']]/td[2]//table/tbody/tr/td[2]//table//td[2]/span";
            break;
    }
    if (query) {
        var res = document.evaluate(query, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < res.snapshotLength; i++) {
            var el = res.snapshotItem(i);
            var mark = Number(el.textContent) + 4;
            el.textContent = (mark === 0)? '' : mark;
        }
    }
})();