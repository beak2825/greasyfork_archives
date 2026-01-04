// ==UserScript==
// @name         Electrek css
// @description  Hide Tesla/Elon Musk/Green Deals/EV Deals/Sponsored articles, the Featured section, and all sidebars (including the 9to5Google widget)
// @match        https://electrek.co/*
// @version 0.0.1.20251109111818
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/533802/Electrek%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/533802/Electrek%20css.meta.js
// ==/UserScript==

(function () {
    const style = document.createElement('style');
    style.textContent = `
        /* Hide articles tagged Tesla, Elon Musk, Green Deals, EV Deals, or Sponsored Post */
        article.article:has(ul.article__meta-guides a[href*="/tesla/"]),
        article.article:has(ul.article__meta-guides a[href*="/elon-musk/"]),
        article.article:has(ul.article__meta-guides a[href*="/green-deals/"]),
        article.article:has(ul.article__meta-guides a[href*="/ev-deals/"]),
        article.article:has(ul.article__meta-guides a[href*="/quick-charge/"]),
        article.article:has(ul.article__meta-guides a[href*="/sponsored-post/"]),
        article.article:has(ul.article__meta-guides a[href*="/guides/electrek-podcast/"]),
        article.article:has(ul.article__meta-guides a[href*="/guides/podcast/"]),
        article.article:has(ul.article__meta-guides a[href*="/guides/wheel-e-podcast/"]),
        article.article:has(ul.article__meta-guides a[href*="/guides/opinion/"]),
        article.article:has(ul.article__meta-guides a[href*="/guides/review/"]),
        article.article:has(ul.article__meta-guides a[href*="/guides/ev-lease/"]),
        article.article:has(ul.article__meta-guides a[href*="/guides/survey-sunday/"]),

        /* Hide articles by sponsored post authors */
        article.article:has(.author__link a[href*="/author/sponsoredpostz/"]),

        /* Hide the Featured carousel section */
        div.container.xs:has(> h2[attr-title="Featured"]),
        /* Hide any sidebar region */
        aside.sidebar,
        /* Hide the branded-RSS widget (e.g. 9to5Google) */
        .widget.ninetofive-branded-rss {
            display: none !important;
        }
        `;
    document.head.appendChild(style);
})();