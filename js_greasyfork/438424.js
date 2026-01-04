// ==UserScript==
// @name         Heise - Fix Layout
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  Fix heise.de layout
// @author       derjanb
// @match        https://www.heise.de/newsticker/*
// @exclude      https://www.heise.de/newsticker/meldung/*
// @run-at       document-body
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/438424/Heise%20-%20Fix%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/438424/Heise%20-%20Fix%20Layout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    .archive__link {
        padding: unset;
    }
    .archive__list .a-article-teaser__title-text {
        font-weight: normal;
        color: #039;
        font-size: 1.1rem;
    }
    .archive__list .a-article-teaser__link:visited {
        color: #999; font-weight: normal;
    }
    .archive__list .archiv-liste__heading {
        font-weight: normal;
    }
    .a-layout {
        max-width: 89rem;
    }
    .a-layout__main {
        width: calc(100% - 27rem);
    }
    .a-layout__sidebar {
        width: 25rem;
    }
    .a-article-teaser * {
        display: inline-block;
        font-size: 1rem;
        line-height: 2rem;
    }
    `);
})();