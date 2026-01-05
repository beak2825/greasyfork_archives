// ==UserScript==
// @name        Facebooknosuggest
// @namespace   Test
// @include     https://www.facebook.com*
// @version     1.1
// @grant       none
// @description:fr Supprime *à priori* les "Publication suggérée" sur facebook. 
// Je vous conseille d'installer µblock (extension/module firefox/Chromium) et de mettre à jour vos listes d'abonnement (la guerre est ouverte entre fb et les adblocks).
// CSS methode (masque uniquement)
// @description Supprime *à priori* les "Publication suggérée" sur facebook.
// @downloadURL https://update.greasyfork.org/scripts/13006/Facebooknosuggest.user.js
// @updateURL https://update.greasyfork.org/scripts/13006/Facebooknosuggest.meta.js
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

addGlobalStyle('*[data-xt] {display: none!important;}');
addGlobalStyle('.ego_unit_container, #pagelet_side_ads {display: none!important;}');