// ==UserScript==
// @name         Hatebu Hide Entries from Tags
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  はてブのエントリーのうち、特定のタグが付与されているものを非表示にします。
// @author       @euro_s
// @match        https://b.hatena.ne.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hatena.ne.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448655/Hatebu%20Hide%20Entries%20from%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/448655/Hatebu%20Hide%20Entries%20from%20Tags.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const hide_tags = ['政治', 'これはひどい', 'フェミニズム', 'ジェンダー', '統一教会'];
    const entries = document.querySelectorAll('li.js-keyboard-selectable-item');
    for (let e of entries) {
        const tags = Array.from(e.querySelectorAll('a[rel="tag"]'));
        if (tags.some((tag) => hide_tags.some((htag) => htag === tag.innerText))) {
            e.style.display = 'none';
        }
    }
})();