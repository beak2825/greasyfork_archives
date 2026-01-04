// ==UserScript==
// @name        FoxFixer
// @namespace   https://os-mc.net
// @license     MIT
// @match       https://nation.foxnews.com/account/signin/
// @grant       none
// @version     1.0
// @author      moderator_man
// @description Fix recent bug with Fox Nation sign-in page.
// @downloadURL https://update.greasyfork.org/scripts/460142/FoxFixer.user.js
// @updateURL https://update.greasyfork.org/scripts/460142/FoxFixer.meta.js
// ==/UserScript==

const targetScript = "vendors.a1becfe2.min.js";
const replacementScript = "vendors.dd763754.min.js";

const scriptTags = document.getElementsByTagName("script");
for (let i = 0; i < scriptTags.length; i++) {
  const script = scriptTags[i];
  const src = script.getAttribute("src");
  if (src && src.includes(targetScript)) {
    const replacementTag = document.createElement("script");
    replacementTag.src = src.replace(targetScript, replacementScript);
    script.parentNode.insertBefore(replacementTag, script);
    script.parentNode.removeChild(script);
    break;
  }
}