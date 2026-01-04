// ==UserScript==
// @name         disable google ai overview
// @namespace    http://tampermonkey.net/
// @version      2025-04-14
// @description  hide the ai overview in google search
// @author       You
// @match        https://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533477/disable%20google%20ai%20overview.user.js
// @updateURL https://update.greasyfork.org/scripts/533477/disable%20google%20ai%20overview.meta.js
// ==/UserScript==

const $x = xp => {
  const snapshot = document.evaluate(
    xp, document, null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
  );
  return [...Array(snapshot.snapshotLength)]
    .map((_, i) => snapshot.snapshotItem(i))
  ;
};
setTimeout(() => {
  const tohide = $x("//div[@id='m-x-content']/../../../../../..");
  tohide.forEach(el => {
    el.style.setProperty("display", "none", "important");
  });
}, 1000);