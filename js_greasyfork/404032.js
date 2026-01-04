// ==UserScript==
// @name         add-pull-requests-link-to-github-user-page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add pull requests link to GitHub User page.
// @author       oieioi
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404032/add-pull-requests-link-to-github-user-page.user.js
// @updateURL https://update.greasyfork.org/scripts/404032/add-pull-requests-link-to-github-user-page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var userNameDom = document.querySelector('.p-nickname');
    if (!userNameDom) return;
    var userName = userNameDom.textContent;
    var pulls = document.createElement('a');
    pulls.text = 'Pull Requests';
    pulls.href = "/pulls?q=is%3Aclosed+is%3Apr+author%3A"+userName+"&is%3Apublic";
    pulls.classList = 'UnderlineNav-item mr-0 mr-md-1 mr-lg-3 '
    document.querySelector('.UnderlineNav-body').append(pulls)
})();