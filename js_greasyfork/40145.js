// ==UserScript==
// @name         Evil Waypoint
// @namespace    https://greasyfork.org/
// @version      0.1.1
// @description  try to take over the world!
// @author       tinaun
// @match        http*://waypoint.vice.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40145/Evil%20Waypoint.user.js
// @updateURL https://update.greasyfork.org/scripts/40145/Evil%20Waypoint.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css){

        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(".canonical__topic { color: #F71F4A; } body { background: #000000;}");
    addGlobalStyle(".grid__wrapper__card__text__title { color: #AAAAAA; }");
    addGlobalStyle("#root .section-header__wrapper, #root .short-form-article__header, #root .long-form-article__content__header { border-top: 3px solid #F71F4a}");
    addGlobalStyle(".link-button--alt, a, a:hover, a:active, #root .contributor__name a, #root .article__body a, #root .newsletter__subheading, #root .topic__link, #root .topic__link:hover, #root .canonical__topic {color: #F71F4A; } ");
    addGlobalStyle("#root .link-button--branded, #root .long-form-article__topic, .related__articles > .related__articles__module__title, .related__video > .related__video__header { color: #000000; background-color: #F71F4A; }");
    addGlobalStyle("#root .link-button--branded:hover { color: #000000; background-color: #AD1634; }");
    addGlobalStyle("#root .grid__wrapper__card__text__title, #root .blog-grid__wrapper__card__text__title, #root .long-form-article__content__body, #root .article__body { color: #AAA; }");
    addGlobalStyle(".site-header--home, .site-header--default, .site-header--article, .newsletter, .navbar__body, .navbar__header { background-color: #444; }");
    addGlobalStyle(".up-next.up-next--visible {background-color: #444;}");
    addGlobalStyle(".waypoint {border-top: 3px solid #F71F4A;}");
    addGlobalStyle(".article__pull-quote { border-left: 3px solid #F71F4A; color: #F71F4A }");
    addGlobalStyle("#root .long-form-article__content__header { color: #FFFFFF; background: #000; }");
    addGlobalStyle(".newsletter__heading, .article__title, .article__title--video, .related_articles > .related__article, .related__article__title, .topics > .topic:first-child { color: #FFFFFF; }");
    addGlobalStyle(".navbar__section--tier-1 .navbar__section__item a, .navbar__section--tier-2 .navbar__section__item a, .navbar__section--upsell .navbar__section__item a, .embed-article-dek { color: #FFF }");
    addGlobalStyle(".navbar__section--tier-1 .navbar__section__item a:focus, .navbar__section--tier-2 .navbar__section__item a:focus, .navbar__section--upsell .navbar__section__item a:focus, .navbar__section--tier-1 .navbar__section__item a:hover, .navbar__section--tier-2 .navbar__section__item a:hover, .navbar__section--upsell .navbar__section__item a:hover { color: #F71F4A;}");
    addGlobalStyle("#root .nav__search-bar {border: 1px solid #444;} #root .nav__search-bar .search-input { background-color: #444}");

    
})();