// ==UserScript==
// @name        Only-bangumi.tv
// @namespace   BLDF
// @description Point all domain names to bangumi.tv
// @homepage    https://github.com/NeKoOuO/bangumiscripts
// @homepage    https://greasyfork.org/scripts/485822-only-bangumi-tv
// @include     /^https?:\/\/(doujin\.|)(bgm\.tv|bangumi\.tv)/
// @version     0.0.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/485822/Only-bangumitv.user.js
// @updateURL https://update.greasyfork.org/scripts/485822/Only-bangumitv.meta.js
// ==/UserScript==

(function() {
  // 取得目前使用的域名
  var domain = "bangumi.tv";
  var protocol = window.location.protocol;

  var links = document.getElementsByTagName('a');

  for(var j = 0, len = links.length; j < len; j++) {
    var link = links[j];
    if (link.href.match(/https?:\/\/(doujin\.|)(bgm\.tv|bangumi\.tv)/)) {
      link.href = link.href.replace(/https?:\/\/(doujin\.|)(bgm\.tv|bangumi\.tv)/, protocol + '//' + domain);
      link.innerHTML = link.innerHTML.replace(/https?:\/\/(doujin\.|)(bgm\.tv|bangumi\.tv)/, protocol + '//' + domain);
    }
  }
})();

