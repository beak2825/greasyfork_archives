// ==UserScript==
// @name        YSlow
// @namespace   http://feifeihang.info
// @description YSlow for Firefox Greasemonkey
// @include     *
// @version     1
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/15135/YSlow.user.js
// @updateURL https://update.greasyfork.org/scripts/15135/YSlow.meta.js
// ==/UserScript==
var YSLOW = 'javascript%3A%28function%28y%2Cp%2Co%29%7Bp%3Dy.body.appendChild%28y.createElement%28%27iframe%27%29%29%3Bp.id%3D%27YSLOW-bookmarklet%27%3Bp.style.cssText%3D%27display%3Anone%27%3Bo%3Dp.contentWindow.document%3Bo.open%28%29.write%28%27%3Chead%3E%3Cbody%2520onload%3D%22YUI_config%3D%7Bwin%3Awindow.parent%2Cdoc%3Awindow.parent.document%7D%3Bvar%2520d%3Ddocument%3Bd.getElementsByTagName%28%5C%27head%5C%27%29%5B0%5D.appendChild%28d.createElement%28%5C%27script%5C%27%29%29.src%3D%5C%27http%3A%2F%2Fyslow.org%2Fyslow-bookmarklet.js%5C%27%22%3E%27%29%3Bo.close%28%29%7D%28document%29%29';
var showYslow = function () {
  var anchor = document.createElement('a');
  anchor.setAttribute('href', decodeURIComponent(YSLOW));
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};
GM_registerMenuCommand('YSlow', showYslow);
