// ==UserScript==
// @name         外国政治内容剔除
// @namespace    https://git.yuanlu.bid/
// @version      0.1
// @description  自动剔除外国网站内掺杂的固定政治内容
// @author       yuanlu
// @include      *://*/*
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-latest.js
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/444910/%E5%A4%96%E5%9B%BD%E6%94%BF%E6%B2%BB%E5%86%85%E5%AE%B9%E5%89%94%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/444910/%E5%A4%96%E5%9B%BD%E6%94%BF%E6%B2%BB%E5%86%85%E5%AE%B9%E5%89%94%E9%99%A4.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /** @type {import('jquery')} */
  const $ = window.jQuery;
  if (location.host.indexOf("svelte.dev") >= 0) {
    const timer = setInterval(() => {
      $(".nav-spot").attr("style", "background-image: url('/favicon.png');");
      $(".ukr").remove();
    }, 100);
    setTimeout(() => clearInterval(timer), 1000 * 60);
  } else if (location.host.indexOf("sveltematerialui.com") >= 0) {
    const timer = setInterval(() => {
      $("body").removeClass("ukraine");
    }, 100);
    setTimeout(() => clearInterval(timer), 1000 * 60);
  }
})();
