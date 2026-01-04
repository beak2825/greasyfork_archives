// ==UserScript==
// @name         Hide comments on MangaDex
// @namespace    https://github.com/mestiez
// @version      0.1
// @description  Removes all comment buttons from Mangadex
// @author       zooi
// @match        https://mangadex.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/414772/Hide%20comments%20on%20MangaDex.user.js
// @updateURL https://update.greasyfork.org/scripts/414772/Hide%20comments%20on%20MangaDex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const links = document.getElementsByTagName('a');

    for (const link of links) {
        if (!link.href.includes('comments')) continue;
        link.style.display = 'none';
    }

    const icons = document.getElementsByClassName('fa-comments');

    for (const icon of icons) {
        icon.style.display = 'none';
    }

    const cmButton = document.getElementById('comment-button');
    if (cmButton)
    {
        cmButton.style.display = 'none';
    }

    console.log(links);
})();