// ==UserScript==
// @name         Kyberia.sk Shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://kyberia.sk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399099/Kyberiask%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/399099/Kyberiask%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const shortcut = {
        next_new: 'a',
        prev_new: 's',
    }

    const allNews = document.getElementsByClassName('node_header_new')
    let currentNew = null;
    const lastNew = allNews.length - 1;

    document.addEventListener('keydown', (key) => {
        switch (key.key){
            case shortcut.next_new:
                currentNew = (currentNew === null) ? 0 : currentNew + 1;
                break;
            case shortcut.prev_new:
                currentNew = (currentNew === null) ? -1 : currentNew - 1;
                break;
        }

        if (currentNew < 0) {
            currentNew = allNews.length - 1;
        }

        if (currentNew >= allNews.length) {
            currentNew = 0;
        }

        scrollToNew(allNews, currentNew);
    });

    function scrollToNew(allNews, currentNew) {
        if (!allNews.length) {
            return;
        }

        allNews[currentNew]
            .parentElement
            .parentElement
            .parentElement
            .scrollIntoView({behavior: 'smooth'});
    }
})();