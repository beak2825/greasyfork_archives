// ==UserScript==
// @name         Thingverse auto download
// @namespace    https://userscript.snomiao.com/
// @version      0.0.2
// @description  Thingverse auto download (deprecated)
// @author       snomiao@gmail.com
// @match        https://www.thingiverse.com/search?*
// @match        https://www.thingiverse.com/thing*
// @icon         https://www.google.com/s2/favicons?domain=khanacademy.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443726/Thingverse%20auto%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/443726/Thingverse%20auto%20download.meta.js
// ==/UserScript==

(async () => {
  const searchpageQ =
    0 === location.href.indexOf("https://www.thingiverse.com/search?");
  const thingpageQ =
    0 === location.href.indexOf("https://www.thingiverse.com/thing:");
  const eleFind = (pattern) =>
    [...document.querySelectorAll("*")]
      .reverse()
      .find((e) => e.textContent?.match(pattern));
  if (thingpageQ) eleFind(/Download All Files/)?.click();
  // 'Downloading...'
})();
