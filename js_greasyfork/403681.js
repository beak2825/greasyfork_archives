// ==UserScript==
// @name         La dépêche - Midi Libre paywall bypass
// @namespace    https://greasyfork.org/fr/scripts/403681-la-d%C3%A9p%C3%AAche-midi-libre-paywall-bypass
// @version      1.02
// @description  Permet de lire les articles protégés par un paywall sur le Midi Libre et la Dépêche
// @author       Fate
// @match        https://tampermonkey.net/scripts.php
// @grant        none
// @include /https?:\/\/(www.)?ladepeche.fr
// @include /https?:\/\/(www.)?midilibre.fr
// @license Creative Commons BY-NC-SA
// @downloadURL https://update.greasyfork.org/scripts/403681/La%20d%C3%A9p%C3%AAche%20-%20Midi%20Libre%20paywall%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/403681/La%20d%C3%A9p%C3%AAche%20-%20Midi%20Libre%20paywall%20bypass.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('.article-paywall { max-height: 200000px !important; }');
addGlobalStyle('.article-full__body-content[data-state="fixed-height"]');
addGlobalStyle('p {display: block !important; }');
addGlobalStyle('#noscript-paywall-content { display: none !important; }');