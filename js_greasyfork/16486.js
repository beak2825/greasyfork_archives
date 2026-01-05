// ==UserScript==
// @name        ask.fm удаление чужих лайков
// @description Удаляет посты "Вашему другу это понравилось"
// @include     https://ask.fm/*
// @version     1.0.1
// @grant       none
// @namespace https://greasyfork.org/users/6033
// @downloadURL https://update.greasyfork.org/scripts/16486/askfm%20%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%87%D1%83%D0%B6%D0%B8%D1%85%20%D0%BB%D0%B0%D0%B9%D0%BA%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/16486/askfm%20%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%87%D1%83%D0%B6%D0%B8%D1%85%20%D0%BB%D0%B0%D0%B9%D0%BA%D0%BE%D0%B2.meta.js
// ==/UserScript==

function nukeShit() {
    var nodesSnapshot = document.evaluate("//*[contains(text(), 'Вашему другу')]/..", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
        nodesSnapshot.snapshotItem(i).style.display = 'none';
    }
}

window.addEventListener('DOMNodeInserted', nukeShit);