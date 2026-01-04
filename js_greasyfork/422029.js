// ==UserScript==
// @name          BetterThingiverse
// @description   Makes thingiverse website better to use
// @namespace     https://github.com/victornpb/betterThingiverse
// @version       0.1
// @match         https://www.thingiverse.com/search
// @homepageURL   https://github.com/victornpb/betterThingiverse
// @supportURL    https://github.com/victornpb/betterThingiverse/issues
// @contributionURL https://www.buymeacoffee.com/vitim
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/422029/BetterThingiverse.user.js
// @updateURL https://update.greasyfork.org/scripts/422029/BetterThingiverse.meta.js
// ==/UserScript==

// Extends the search results from 20 to 200 per page
URLSearchParams.prototype._append = URLSearchParams.prototype.append;
URLSearchParams.prototype.append = function append(k, v) {
  if(k==='per_page') v = 200;
  return this._append(k, v);
};
