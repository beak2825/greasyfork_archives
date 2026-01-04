// ==UserScript==
// @name                La Repubblica "Rep" Paywall Bypass
// @name:it             La Repubblica "Rep" Paywall Bypass
// @namespace           LucciUserJS
// @version             2.1.1
// @description         Unhides the "paywalled" articles on Rep.
// @description:it      Rimuove il paywall su Rep, gli articoli premium di la Repubblica.it.
// @author              Lucci <gabriele@lucci.xyz>, Andrea Lazzarotto
// @match               https://rep.repubblica.it/*
// @license             GPL version 3 or any later version http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/371931/La%20Repubblica%20%22Rep%22%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/371931/La%20Repubblica%20%22Rep%22%20Paywall%20Bypass.meta.js
// ==/UserScript==

const addStyle = function(css) {
  /**
   * Inject CSS into the document.
   * 
   * This is a standalone implementation of GM_addStyle, which is 
   * deprecated by Greasemonkey but still supported by other extensions.
   * 
   * Inspired by Tampermonkey's TM_addStyle function, which is 
   * Tampermonkey's own implementation of GM_addStyle.
   **/
  try {
    let style = document.createElement('style');
    style.textContent = css;
    parent = (document.head || document.body || document.documentElement || document);
    parent.appendChild(style);
  } catch (e) {
    console.log("Error: " + e);
  }
};

const redirect = function() {
    var pwa = location.href.indexOf("/pwa/") > 0;
    var comments = location.pathname.endsWith("/commenti");
    if (pwa && !comments) {
        location.href = location.href.replace("/pwa/", "/ws/detail/");
    }
};

(function () {
  'use strict';
  redirect()
  addStyle(
    `
    div.detail-article_body > div:not(.paywall) { 
      display: none !important;
    }
    div.detail-article_body > div.paywall, 
    body:not(.i-amphtml-subs-grant-yes) [subscriptions-section='content'] { 
      display: block !important; 
    }
    `
  );
  window.dispatchEvent(new Event('resize'));
})()
