// ==UserScript==
// @name            FuckQQ
// @namespace       https://github.com/Cierra-Runis/FuckQQ
// @version         1.2
// @description     拦你妈呢死妈 QQ 管家
// @connect         raw.githubusercontent.com
// @connect         github.com
// @connect         cdn.jsdelivr.net
// @author          https://github.com/Cierra-Runis
// @match           https://c.pc.qq.com/*
// @icon            https://raw.githubusercontent.com/Cierra-Runis/FuckQQ/master/.github/icon.png
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/448283/FuckQQ.user.js
// @updateURL https://update.greasyfork.org/scripts/448283/FuckQQ.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let urlBlock = document.getElementById("url");

  const getQuery = (url, query) => {
    const str = url.substr(url.indexOf("?") + 1);
    const arr = str.split("&");
    const result = {};
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i].split("=");
      result[item[0]] = item[1];
    }
    return result[query];
  };

  if (urlBlock == null) {
    window.location.href = decodeURIComponent(
      getQuery(window.location.href, "url")
    );
  }
  window.location.href = urlBlock.textContent;
})();
