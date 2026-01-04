// ==UserScript==
// @name           Twitter List
// @namespace      https://twitter.com
// @description    Userscript to add a Twitter list to the Twitter web interface's dashboard. By Cleiton Lima
// @version        1
// @match          *://twitter.com/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/38401/Twitter%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/38401/Twitter%20List.meta.js
// ==/UserScript==

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    var ElmList, ElmStyle;
    ElmList = document.getElementsByClassName('wtf-module')[0];
    ElmStyle = document.createElement('div');
    ElmList.before(ElmStyle);
    ElmStyle.innerHTML = '<div class="module Trends"><div class="flex-module-header"><h3>Listas</h3>\</div><div class="flex-module-inner"><ul class="list-items js-list"><li class="context-list-item"><a class="pretty-link js-list-link js-nav u-dir" href="[USERNAME]/lists/[LISTNAME]">[LISTNAME]">[LISTNAME]</a></li><li class="context-list-item"><a class="pretty-link js-list-link js-nav u-dir" href="[USERNAME]/lists/[LISTNAME]">[LISTNAME]">[LISTNAME]</a></li><li class="context-list-item"><a class="pretty-link js-list-link js-nav u-dir" href="/[USERNAME]/lists/[LISTNAME]">[LISTNAME]</a>\</li></ul></div></div>';
  }
};