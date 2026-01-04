// ==UserScript==
// @name         GitHub Review Helper
// @namespace    https://greasyfork.org/scripts/376688-github-review-helper
// @version      0.2
// @description  try to take over the world!
// @author       zaypen
// @match        https://github.com/*/*/pull/*/files
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/376688/GitHub%20Review%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/376688/GitHub%20Review%20Helper.meta.js
// ==/UserScript==

/*jslint browser:true*/
/*global GM_config */

var defaultCollapseRegex = '__tests__|-spec';

var fieldDefs = {
    'AutoCollapseRegex': {
        'label': 'Auto Collapse Regex',
        'type': 'string',
        'default': defaultCollapseRegex
    }
};

GM_config.init({
  id: 'GM_config',
  title: 'GitHub Review Helper',
  fields: fieldDefs
});

function retry(fn, interval, times) {
    var ret = fn();
    if (!ret && times) {
        setTimeout(function () {
            retry(fn, interval, times--);
        }, interval);
    }
}

function main() {
    var prReviewTools = document.querySelector('.pr-review-tools');

    var configButton = document.createElement('button');
    configButton.href = 'javascript:;';
    configButton.className = 'btn btn-sm';
    configButton.style = 'float: left; margin-right: 20px';
    configButton.innerHTML = 'Settings';
    configButton.onclick = function() { GM_config.open(); };

    prReviewTools.insertAdjacentElement('afterbegin', configButton);

    var toggleCommentButton = document.createElement('button');
    toggleCommentButton.href = 'javascript:;';
    toggleCommentButton.className = 'btn btn-sm';
    toggleCommentButton.style = 'float: left; margin-right: 20px';
    toggleCommentButton.innerHTML = 'Toggle comments';
    toggleCommentButton.onclick = function() {
        Array.apply(null, document.querySelectorAll('.js-toggle-file-notes')).forEach(e => e.click());
    };

    prReviewTools.insertAdjacentElement('afterbegin', toggleCommentButton);

    var collapseAllButton = document.createElement('button');
    collapseAllButton.href = 'javascript:;';
    collapseAllButton.className = 'btn btn-sm';
    collapseAllButton.style = 'float: left; margin-right: 20px';
    collapseAllButton.innerHTML = 'Collapse all files';
    collapseAllButton.onclick = function() {
        Array.apply(null, document.querySelectorAll('.file-actions .js-details-target[aria-expanded="true"]'))
            .map(e => { e.click(); return e })
            .map(e => { e.setAttribute('aria-expanded', false); return e })
    }

    prReviewTools.insertAdjacentElement('afterbegin', collapseAllButton);

    var fileElements = Array.apply(null, document.querySelectorAll('.file-header'));
    var files = fileElements.map(e => ({
        name: e.querySelector('.file-info a').textContent,
        ref: e
    }));
    var regex = new RegExp(GM_config.get('AutoCollapseRegex'));
    files.filter(f => regex.test(f.name)).forEach(f => {
        f.ref.querySelector('.file-actions .js-details-target[aria-expanded="true"]').click()
    });
}

(function() {
    'use strict';
    retry(function() {
        if (document.querySelector('.pr-review-tools')) {
            main();
            return true;
        }
    }, 500, 6);
})();