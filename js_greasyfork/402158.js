// ==UserScript==
// @name         Beeline Reader (Except worse)
// @namespace    http://twitter.com/Automalix
// @version      0.0.2
// @description  I did this in 2 minutes thank u
// @author       Felix "Automalix" G.
// @include      https://*
// @include      http://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402158/Beeline%20Reader%20%28Except%20worse%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402158/Beeline%20Reader%20%28Except%20worse%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addGlobalStyle(css) {
        let head = document.getElementsByTagName('head')[0];
        if (!head) return;
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(`
        p {
            font-size: 20px;
            line-height: 32px;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAABgCAIAAAC46DQiAAAAYUlEQVQoz73SwQ3DIBAF0aetYDuAEtNJWoQKTAfOgcgS+M5pVnMafS0+X4JWHyAv4CbmdQDJICrthULfpYuckU52DshoUDd0KKuUZizc5zpJRlBpLxT6KtdFT3aO3H/wjx/oyySm/xnbdAAAAABJRU5ErkJggg==);
            background-position-y: 8px;
            background-size: 100% 128px;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent
        }
    `);

})();