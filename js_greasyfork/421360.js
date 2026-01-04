/** twimg:orig Redirect - Go to orignal size URL of Twitter image
 *  @note The legacy format is deprecated
 */
// ==UserScript==
// @name         twimg:orig Redirect
// @description  Go to orignal size URL of Twitter image
// @match        https://pbs.twimg.com/media/*
// @version      0.3.2
// @run-at       document-start
// @license      MIT
// @namespace    https://greasyfork.org/users/735252
// @downloadURL https://update.greasyfork.org/scripts/421360/twimg%3Aorig%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/421360/twimg%3Aorig%20Redirect.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function () {
  const fmtLegacy = window.localStorage.getItem('fmtLegacy');
  const f = fmtLegacy ? ['.', ':'] : ['?format=', '&name='];
  const href = window.location.href;
  const m = href.match(/^(https?:\/\/pbs\.twimg\.com\/media\/\w+)(?:\.(\w+)|\?(?:[\w=]+&)?format=(\w+))/);
  const url = m[1] + f[0] + (m[2] || m[3]) + f[1] + 'orig';
  if (window.sessionStorage.getItem('url') !== url && url !== href) {
    window.sessionStorage.setItem('url', url);
    // left history every time with this way
    const a = document.createElement('A');
    a.href = url;
    a.click();
  }
})();
