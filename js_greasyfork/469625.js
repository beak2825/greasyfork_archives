// ==UserScript==
// @name        !bangAnywhere
// @namespace   https://github.com/RuiNtD
// @version     1.1.3
// @description Use DuckDuckGo !bangs on your preferred search engine
// @author      RuiNtD
// @match       https://*.google.com/search?*
// @match       https://*.bing.com/search?*
// @match       https://search.brave.com/search?*
// @match       https://*.qwant.com/?*
// @match       https://*.startpage.com/*/search*
// @noframes    
// @homepageURL https://greasyfork.org/scripts/469625
// @icon        https://icons.duckduckgo.com/ip2/duckduckgo.com.ico
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/url@0
// @resource    bangs https://duckduckgo.com/bang.js
// @license     MIT
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/469625/%21bangAnywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/469625/%21bangAnywhere.meta.js
// ==/UserScript==

(function (url) {
'use strict';

// Modified from https://github.com/t3dotgg/unduck
function getBangUrl(query) {
  const match = query.match(/!(\S+)/i);
  const bangTag = match?.[1]?.toLowerCase();
  if (!bangTag) return;
  const bangs = JSON.parse(GM_getResourceText("bangs"));
  const bang = bangs.find(b => b.t == bangTag);
  if (!bang) return null;
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();
  if (!cleanQuery) return `https://${bang.d}`;
  return bang.u.replace("{{{s}}}", encodeURIComponent(cleanQuery));
}
function checkQuery() {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const qInput = document.querySelector("input#q");
  const query = (params.get("q") || params.get("query") || qInput?.value || "").trim();
  if (!query) return;
  console.log("!bangAnywhere Query:", query);
  const bangUrl = getBangUrl(query);
  console.log("!bangAnywhere Redirect:", bangUrl);
  if (bangUrl) window.location.replace(bangUrl);
}
url.onNavigate(checkQuery);
checkQuery();

})(VM);
