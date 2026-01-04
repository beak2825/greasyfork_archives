// ==UserScript==
// @name         copy tag
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  copy img tag
// @author       You
// @match        https://safebooru.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=safebooru.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452733/copy%20tag.user.js
// @updateURL https://update.greasyfork.org/scripts/452733/copy%20tag.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const button = document.createElement('button');
    document.querySelector('.space').append(button);
    button.innerText = 'copy';
    button.onclick = copy;

    function copy() {
        const arr = [];
        document.querySelectorAll('.tag-type-general.tag').forEach(item => arr.push(item.children));

        const res = arr.map(item => item[0].innerText).join(',');

        navigator.clipboard.writeText(res);
        console.log(res);
    }
})();