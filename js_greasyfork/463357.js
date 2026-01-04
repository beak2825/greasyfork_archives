// ==UserScript==
// @name		1_DuckDuckGo-mobile
// @description		Custom dark mode & optimized layout
// @match		*://*.duckduckgo.com/*
// @match		https://duckduckgo.com/*
// @grant		GM_addStyle
// @namespace		https://greasyfork.org/en/scripts/463357-1_duckduckgo-mobile
// @author		sports_wook
// @version		2025.05.15

// @downloadURL https://update.greasyfork.org/scripts/463357/1_DuckDuckGo-mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/463357/1_DuckDuckGo-mobile.meta.js
// ==/UserScript==


GM_addStyle (`

.is-mobile .nrn-react-div, .is-mobile .result--news {
    padding: 5px 5px !important;
    margin: 5px !important;
    padding-top: 0px !important;
    margin-top: 0px !important;
    margin-bottom: 10px !important;
}

.is-mobile .tile-wrap {
    margin-top: -22px;
}

.is-mobile .has-nav.tileview__videos {
    margin-left: 10px !important;
    margin-right: 10px !important;
}

.is-mobile .module--about, .is-mobile .module--carousel {
    margin: 10px !important;
}

.is-mobile #m0-0.module-slot {
    margin-top: -10px !important;
}

.is-mobile article[id^="r1-"], .is-mobile .module__content {
    padding: 10px !important
}

.is-mobile .has-nav.tileview__images {
    padding-left: 5px !important
    padding-right: 5px !important
}

.is-mobile .tile--img {
    margin-right: 1px !important;
    margin-left: 7px !important;
}

.is-mobile .result.result--news {
    margin-left: 10px !important;
    margin-right: 10px !important;
    margin-bottom: 15px !important;
}

.is-mobile .result__body {
    padding: 5px !important;
}

.is-mobile .zci__main, .is-mobile div[id^="m0-"] .module--carousel {
    margin-top: 0px !important;
    padding-top: 10px !important;
    padding-bottom: 0px !important;
    padding-left: 0px !important;
}

.is-mobile .metabar__dropdowns  {
    height: 39px !important;
}

.is-mobile .module--carousel__item {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    margin-left: 0px !important;
    margin-right: 10px !important;
}

.is-mobile .has-tiles--grid .tile {
    margin-top: 7px !important;
    margin-left: 5px !important;
    margin-right: 5px !important;
}

.is-mobile .tileview--grid .tile--c--w {
    margin-left: 7px !important;
    margin-right: 7px !important;
    width: 46%;
}

.is-mobile .tile--vid .tile__media {
    padding-bottom: 55%;
}

.is-mobile .related-searches__title-short, .is-mobile .related-searches__lists {
    padding: 10px 10px !important;
    padding-bottom: 0px !important;
}

.is-mobile .nrn-react-div article, .is-mobile .result.result--news, .is-mobile .module, .is-mobile .related-searches, .is-mobile .module--carousel__item, .is-mobile .tile, .is-mobile .tile--s, .is-mobile .tile--info, .is-mobile .tile--img__media {
    border-radius: 10px !important;
}

.is-mobile .nrn-react-div article, .is-mobile .result.result--news, .is-mobile .module--about, .is-mobile .related-searches, .is-mobile .module--carousel__item, .is-mobile .tile--s, .is-mobile .tile--info {
    border: 1px solid #283547 !important;
}

.is-mobile .result__pagenum {
    color: #8b949e !important;
}

.is-mobile .result--sep--hr::before {
    background-color: #8b949e !important;
}

.is-mobile .result--sep {
    margin: 5px !important;
    margin-top: -10px !important;
}

.is-mobile .related-searches__item {
    padding: 7px 7px !important;
}

.is-mobile .about-profiles__item {
    padding: 5px 10px;
}

.is-mobile .module--about {
    padding-bottom: 0px !important;
}

.is-mobile .module--images {
    margin-bottom: -5px !important;
}

.is-mobile #links .module-slot .module--images {
    margin: 10px !important;
    border: 1px solid var(--theme-col-border-ui) !important;
}

.is-mobile .js-images-show-more {
    margin-bottom: -5px !important;
}

.is-mobile .related-searches {
    padding: 5px !important;
    margin: 10px !important;
}

.is-mobile .metabar--unsticky + .tile-wrap {
    padding-top: 0px !important;
}

.is-mobile .tileview--grid .metabar--unsticky {
    margin-bottom: 10px !important;
}

.is-mobile .metabar__dropdowns-wrap {
    height: 39px !important;
}

.is-mobile .tile-wrap {
    position: relative !important;
    top: 0px !important;
}

.is-mobile .zci--images:not(.is-fallback) .tile-wrap {
    margin-top: -22px !important;
    padding: 0 5px;
}

.is-mobile .module-slot {
    padding-bottom: 5px !important;
}

.is-mobile .ia-modules .module--about {
    margin-top: 0px !important;
    margin-bottom: 15px !important;
}

.is-mobile .search--header {
    border-radius: 10px !important;
    background-color: #000 !important;
    border: 1px solid #283547 !important;
}

.is-mobile .body--serp .header__search-wrap {
    padding: 0 15px;
}

`);