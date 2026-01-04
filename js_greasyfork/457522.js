// ==UserScript==
// @name         Crunchyroll Light Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Crunchyroll light theme script because there's no official light theme. This is also my first public script.
// @author       CurtisJLButler
// @match        https://www.crunchyroll.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/457522/Crunchyroll%20Light%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/457522/Crunchyroll%20Light%20Theme.meta.js
// ==/UserScript==


function GM_addStyle(css) {
  const style = document.getElementById("GM_addStyleBy8626") || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "GM_addStyleBy8626";
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}


GM_addStyle(".page-wrapper--5HUY2.page-wrapper--has-padding-top--h1N8H { background-color: #f2f2f2; padding-top: 0px;}");
GM_addStyle(".text--gq6o-.text--is-semibold--AHOYN.text--is-l--iccTo.watchlist-card-title__text--chGlt { color: #000000; }");
GM_addStyle(".watchlist-card--YfKgo { background-color: #ffffff; --hover-shadow-size:0.1rem;box-shadow:0 0 0 var(--hover-shadow-size) #dddddd; padding: 10px;}");
GM_addStyle(".watchlist-card--YfKgo:hover { background-color: #F47521; --hover-shadow-size:0.1rem;box-shadow:0 0 0 var(--hover-shadow-size) #F47521;}");
GM_addStyle(".text--gq6o-.text--is-m--pqiL-.watchlist-card-subtitle--IROsU { color: #606060;}");
GM_addStyle(".watchlist-card--YfKgo:hover .text--gq6o-.text--is-m--pqiL-.watchlist-card-subtitle--IROsU { color: #ffffff;}");
GM_addStyle(".heading--nKNOf.heading--is-m--7bv3g.heading--is-family-type-one--GqBzU.erc-my-lists-title { color: #000000;}");
GM_addStyle(".tabs-item--HW9pk.tabs-item--is-active--66UFY.active .call-to-action--PEidl.call-to-action--is-m--RVdkI.tabs-item__text--N-d0t { color: #000000;}");
GM_addStyle(".tabs-item--HW9pk.tabs-item--is-active--66UFY.active:hover .call-to-action--PEidl.call-to-action--is-m--RVdkI.tabs-item__text--N-d0t { color: #ffffff;}");
GM_addStyle(".tabs-item--HW9pk:hover { background-color: #F47521;}");
GM_addStyle(".erc-my-lists-header {padding: 50px; background-color: #ffffff; border: 1px #dddddd solid; border-style: outset;}");
GM_addStyle(".header-left {background-color: #ffffff;}");
GM_addStyle(".text--gq6o-.text--is-l--iccTo.item-title {color: #000000;}");
GM_addStyle(".text--gq6o-.text--is-l--iccTo {color: #000000;}");
GM_addStyle(".erc-header .header-content {background-color: #ffffff;}");
GM_addStyle(".erc-header-tile.menu-tile:hover {background-color: #F47521;}");
GM_addStyle(".erc-header-tile:hover {background-color: #F47521;}");