// ==UserScript==
// @name        Aliexpress: .ru links to .com
// @namespace   tadoritz
// @author      tadoritz
// @description Use after setting English: https://webapps.stackexchange.com/a/153233
// @version     1.1
// @match       https://*.aliexpress.ru/*
// @match       https://*.aliexpress.com/*
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/430592/Aliexpress%3A%20ru%20links%20to%20com.user.js
// @updateURL https://update.greasyfork.org/scripts/430592/Aliexpress%3A%20ru%20links%20to%20com.meta.js
// ==/UserScript==

document.querySelectorAll(`
  /* some preselected links */
  .inside-page-logo a,
  .right-shopcart a,
  .nav-cart-box a,
  .ng-bp a,
  .nav-wishlist a,
  .flyout-quick-entry a,
  .ng-mobile a,
  .sf-aliexpressInfo a,
  .sf-seoKeyword a,
  .items-list a`).forEach(item => {
    url = new URL(item.href);
    url.host = url.host.replace(".ru", ".com");
    item.href = url.href;
});

// another variants:
//   `.inside-page-logo a[href*=".ru"], ...` - same result, but too much words
//   `a[href*=".ru"]` - applying to all links, may break some links