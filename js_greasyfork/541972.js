// ==UserScript==
// @name        Rule34 Video Tag Preserver
// @match       https://rule34.xxx/index.php?page=post&s=view&id=*
// @grant       GM_getValue
// @grant       GM_setValue
// @version      1
// @namespace http://tampermonkey.net/
// @description Preserves the video tag filter when editing tags on rule34.xxx by modifying form action
// @downloadURL https://update.greasyfork.org/scripts/541972/Rule34%20Video%20Tag%20Preserver.user.js
// @updateURL https://update.greasyfork.org/scripts/541972/Rule34%20Video%20Tag%20Preserver.meta.js
// ==/UserScript==

(function() {
  let url=new URL(location.href);
  let currentTag=url.searchParams.get("tags");
  let lastTag=GM_getValue("lastTag","");

  if(currentTag) {
    if(currentTag!==lastTag) GM_setValue("lastTag",currentTag);
  } else if(lastTag) {
    url.searchParams.set("tags",lastTag);
    location.href=url.href;
  }
})();
