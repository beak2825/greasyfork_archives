/*
 * Via 和 Alook 要求的形式
 */
/*
 * @name               Crack Forclass For Via
 * @Author             Houtarchat
 * @version            1.5.5
 * @description        适用于Via浏览器及Alook浏览器。
 * @include: *
 */
(function () {
  var n = window.location.href;
  var d = document;
  var s = d.createElement("script");
  if (
    n.includes("forclass.net/Student/Dati") ||
    n.includes("271bay.com/Student/Dati")
  ) {
    s.setAttribute(
      "src",
      "https://greasyfork.org/scripts/405731-crack-forclass/code/Crack%20Forclass.user.js"
    );
  } else if (
    n.includes("forclass.net/Student/Wdzy") ||
    n.includes("271bay.com/Student/Wdzy")
  ) {
    s.setAttribute(
      "src",
      "https://greasyfork.org/scripts/407423-crack-forclass-2/code/Crack%20Forclass%202.user.js"
    );
  }

  d.head.appendChild(s);
})();
// GreasyFork 要求的形式
// ==UserScript==
// @name               Crack Forclass For Via
// @namespace          https://via-app.crack-forclass.houtarchat.ml/
// @version            1.5.5
// @description        适用于Via浏览器及Alook浏览器。
// @author             Houtarchat
// @include            *
// @contributionURL    https://www.houtarchat.ml/donate.html
// @contributionAmount 5 RMB
// @grant              none
// @license            GNU General Public License
// @downloadURL https://update.greasyfork.org/scripts/407302/Crack%20Forclass%20For%20Via.user.js
// @updateURL https://update.greasyfork.org/scripts/407302/Crack%20Forclass%20For%20Via.meta.js
// ==/UserScript==
