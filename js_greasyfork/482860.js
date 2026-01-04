// ==UserScript==
// @name         Default CSS
// @version      2023-12-23
// @license      WTFPL
// @description  enable custom CSS if and only if page does not define any styles in <head>
// @author       https://matrix.to/#/@belkka:private.coffee
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/922438
// @downloadURL https://update.greasyfork.org/scripts/482860/Default%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/482860/Default%20CSS.meta.js
// ==/UserScript==

// Note: this userscript uses CSS from https://github.com/susam/spcss/ project. Since you are already reading this,
// feel free to replace "https://unpkg.com/spcss" with style sheet of your choice
// or even use <style> instead of <link> to embed CSS directly

(function() {
    'use strict';
    const head = document.getElementsByTagName('head')[0];
    if(head.querySelector('style:not(:empty), link[rel~=stylesheet]') === null) {
        head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="https://unpkg.com/spcss" />');
    }
})();