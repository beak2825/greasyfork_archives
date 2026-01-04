// ==UserScript==
// @name         9to5Mac css
// @description  Hide articles with podcast/deals tags, Sponsored Post author, the Featured section, all sidebars, and branded widgets
// @match        https://9to5mac.com/*
// @version 0.0.1.20251104023041
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/534405/9to5Mac%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/534405/9to5Mac%20css.meta.js
// ==/UserScript==

(function () {
  const style = document.createElement('style');
  style.textContent = `

    /* Hide articles with specific guide tags */
    article.article:has(ul.article__meta-guides a[href*="/9to5mac-daily/"]),
    article.article:has(ul.article__meta-guides a[href*="/apple-work-podcast/"]),
    article.article:has(ul.article__meta-guides a[href*="/deals/"]),
    article.article:has(ul.article__meta-guides a[href*="/apple-at-work/"]),
    article.article:has(ul.article__meta-guides a[href*="/podcast/"]),
    article.article:has(ul.article__meta-guides a[href*="/9to5mac-happy-hour/"]),
    article.article:has(ul.article__meta-guides a[href*="/rumor-replay/"]),
    article.article:has(ul.article__meta-guides a[href*="/9to5mac-overtime/"]),
    article.article:has(ul.article__meta-guides a[href*="/ipad-accessories/"]),
    article.article:has(ul.article__meta-guides a[href*="/indie-app-spotlight/"]),
    article.article:has(ul.article__meta-guides a[href*="/magsafe-monday/"]),
    article.article:has(ul.article__meta-guides a[href*="/guides/opinion/"]),
    article.article:has(ul.article__meta-guides a[href*="/apple-fitness/"]),
    article.article:has(ul.article__meta-guides a[href*="/homekit-weekly/"]),
    article.article:has(ul.article__meta-guides a[href*="/security-bite/"]),
    article.article:has(ul.article__meta-guides a[href*="/adobe/"]),
    article:has(> figure > a > img[alt="9to5mac daily podcast"]),
    article.article:has(.author__link a[href*="/author/sponsoredpostz/"]),
    div.container.xs:has(> h2[attr-title="Featured"]),
    aside.sidebar,
    .widget.ninetofive-branded-rss,
    div.author-affiliate-ad-wrapper {
      display: none !important;
    }

    `;
  document.head.appendChild(style);
})();