// ==UserScript==
// @name         PA-Block
// @namespace    http://tampermonkey.net/
// @version      2024-11-01
// @description  hides users posts.
// @author       You
// @match        https://petersonacademy.com/feed
// @icon         https://www.google.com/s2/favicons?sz=64&domain=petersonacademy.com
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/515268/PA-Block.user.js
// @updateURL https://update.greasyfork.org/scripts/515268/PA-Block.meta.js
// ==/UserScript==

let blocked_users = new Set([
  // put your users you want to block here
  "@example-user-1",
  "@another-example-user",
  "@testing123",
]);

function blocker(records, observer) {
  for (const record of records) {
    if (record.target.nodeName != "ARTICLE") {
      continue;
    }
    let posterName = record.target.querySelector(
      "div header div div div div button div div span.text-secondary",
    ).textContent;
    if (blocked_users.has(posterName)) {
      console.log("blocking", posterName);
      record.target.remove();
    }
  }
}

let observer = new MutationObserver(blocker);
let container = document.querySelector("main");
const observerOptions = {
  childList: true,
  subtree: true,
};
observer.observe(container, observerOptions);
