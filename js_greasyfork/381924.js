// ==UserScript==
// @name         Disable Bing Search Result User Data Tracking
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      AGPLv3
// @description  Disable Bing Search result's user data tracking where trivial page interactions are recorded (e.g. page scrolling, mouse hover, etc.). It also disables link tracking that let Bing knows which off-site link the user is clicking. And additionally, this script ensures that the referring URL (i.e. the search page) is not sent to the target site.
// @author       jcunews
// @match        *://www.bing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381924/Disable%20Bing%20Search%20Result%20User%20Data%20Tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/381924/Disable%20Bing%20Search%20Result%20User%20Data%20Tracking.meta.js
// ==/UserScript==

((xo, xs) => {
  xo = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(mtd, url) {
    this.dbsrudtUrl = url;
    return xo.apply(this, arguments);
  };
  xs = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function() {
    if ((/fd\/ls\/lsp\.aspx/).test(this.dbsrudtUrl)) return;
    return xs.apply(this, arguments);
  };
  document.querySelectorAll('a[h]').forEach(a => {
    a.removeAttribute("h");
    a.rel += (a.rel && " ") + "noreferrer";
  });
})();
