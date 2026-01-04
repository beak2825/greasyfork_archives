// ==UserScript==
// @name         Code Kata Slug
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Get the slug for a Code Kata
// @author       Andrew Lane
// @match        https://www.codewars.com/kata/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403263/Code%20Kata%20Slug.user.js
// @updateURL https://update.greasyfork.org/scripts/403263/Code%20Kata%20Slug.meta.js
// ==/UserScript==

(async () => {
    const pathname = location.pathname.split('/');
    if (pathname[2] === 'reviews') {
        return;
    }

    const res = await fetch(`https://www.codewars.com/api/v1/code-challenges/${pathname[2]}`);
    const json = await res.json();
    pathname[2] = json.slug;
    history.replaceState({}, '', pathname.join('/'));
})();