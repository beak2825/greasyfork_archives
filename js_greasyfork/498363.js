// ==UserScript==
// @name            WideView
// @namespace       http://tampermonkey.net/
// @license         MIT
// @version         0.1.3.3
// @description     Removes sidebars + stretches post area to full browser width
// @description:ru  Удаляет боковые панели + растягивает область поста на всю ширину браузера
// @author          Prog57
// @match           *://*.habr.com/*
// @match           *://*.microsoft.com/*
// @match           *://*.stackoverflow.com/*
// @match           *://rus-linux.net/*
// @match           *://riptutorial.com/*
// @match           *://bitbucket.org/*
// @match           *://*.atlassian.net/*
// @match           *://github.com/*
// @match           *://pikabu.ru/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=habr.com
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/498363/WideView.user.js
// @updateURL https://update.greasyfork.org/scripts/498363/WideView.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const apply = function (toWide, toHide, toMargin, toPadding, percent) {
        // debugger;
        let els = document.querySelectorAll(toHide) || [];
        // els.forEach(el => el.style.cssText += 'display: none;');
        els.forEach(el => el.remove());

        percent ||= 100;
        els = document.querySelectorAll(toWide) || [];
        els.forEach(el => el.style.cssText += `max-width: ${percent}%; width: ${percent}%`);

        els = document.querySelectorAll(toMargin) || [];
        // els.forEach < Element > (el => el.style.cssText += 'margin: 0, auto;'); не всегда работает
        els.forEach(el => {
            el.style.marginLeft = 'auto';
            el.style.marginRight = 'auto';
        });

        document.querySelectorAll(toPadding)
            .forEach(el => el.style.cssText += 'padding: 0;');
    }

    const run = function () {
        const host = window.location.host;
        if (/habr\.com/.test(host)) {
            apply(".tm-page-width, .tm-page__main_has-sidebar, .tm-article-presenter",
                ".column_sidebar, .layout__navbar, .tm-page__sidebar",
                null,
                ".tm-page-width"
            );
        }
        else if (/-linux\.net/.test(host)) {
            apply(null,
                "#left_col");
        }
        else if (/microsoft\.com/.test(host)) {
            apply(".modular-content-container, #main-column",
                "#ms--additional-resources");
        }
        else if (/stackoverflow\.com/.test(host)) {
            apply("body > .container, #content, #mainbar",
                "#sidebar, #left-sidebar, #onetrust-banner-sdk");
        }
        else if (/riptutorial\.com/.test(host)) {
            apply(".section-article",
                "#cookie-consent, div.section-sidebar");
        }
        else if (/bitbucket\.org/.test(host)) {
            apply(null,
                "div.css-19vvwff.ehpgwqe0");
        }
        else if (/atlassian\.net/.test(host)) {
            apply(null,
                "div.css-zolx62, link[href*='shared~vendor~atlassian'], script[data-defer-skip], .css-17lamoy");
        }
        else if (/github\.com/.test(host)) {
            apply(".container-xl, .markdown-body",
                null,
                ".react-repos-overview-margin"
            );
        }
        else if (/pikabu\.ru/.test(host)) {
            apply(".app__inner, .main",
                ".sidebar"
            );
        }
    }

    setTimeout(run, 1000);
    setTimeout(run, 2000);
})();
