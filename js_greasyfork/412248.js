// ==UserScript==
// @name         github-md-catalog
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  generate catalog in Github readme page
// @author       fengxxc
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412248/github-md-catalog.user.js
// @updateURL https://update.greasyfork.org/scripts/412248/github-md-catalog.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        // 目录树缩进的步长
        const PADDINGLEFT_STEP_LENGTH = 20;

        if (window.location.hostname != 'github.com') return;
        const mdDom = document.querySelector('article.markdown-body');
        if (!mdDom) return;
        let catalogs = [];
        const titles = mdDom.querySelectorAll('h1,h2,h3,h4,h5,h6');
        for (let i = 0; i < titles.length; i++) {
            catalogs.push(
                getPaddingLeftEl(parseInt(titles[i].tagName.slice(1)), PADDINGLEFT_STEP_LENGTH)
                + '<a href="#' + titles[i].innerText + '">' + titles[i].innerText + '</a><br>'
            );
            titles[i].insertAdjacentHTML('afterbegin', '<a name="' + titles[i].innerText + '"></a>');
        }
        document.body.insertAdjacentHTML('beforeend', '<nav id="github_md_catalog" style="position: fixed; top: 115px; right: 5px; max-width: 257px">' + catalogs.join('') + '</nav>');
    }

    function getPaddingLeftEl(tabStep, stepLength) {
        return '<span style="display: inline-block; width: ' + tabStep * stepLength + 'px;"></span>';
    }

    main();
})();