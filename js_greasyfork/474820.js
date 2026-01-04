// ==UserScript==
// @name           zhconvert's credit generator
// @name:en        zhconvert's credit generator
// @description    快速產生可以貼入註解的銘謝文字。
// @description:en Quickly generate the credit text for comment.
// @namespace      http://github.com/pan93412
// @version        1.0
// @description    try to take over the world!
// @author         pan93412
// @match          https://zhconvert.org/
// @icon           https://www.google.com/s2/favicons?sz=64&domain=zhconvert.org
// @grant          none
// @license        AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/474820/zhconvert%27s%20credit%20generator.user.js
// @updateURL https://update.greasyfork.org/scripts/474820/zhconvert%27s%20credit%20generator.meta.js
// ==/UserScript==

/**
 * @returns {boolean} Succeed?
 */
function pushButton() {
  const globalId = "--credit-adder-get-credit-text-button";

  const actionButtonSet = document.querySelector(
    "#portlet-convert-summary .panel-heading div.actions",
  );
  if (!actionButtonSet) return false;

  // Create an action button
  const copyCreditButton = document.createElement("a");
  copyCreditButton.id = globalId;
  copyCreditButton.className = "btn btn-xs grey with-icon";
  copyCreditButton.innerHTML += '<i class="fa-solid fa-share"></i>';
  copyCreditButton.innerHTML += '<span class="text">取得 credit 文字</span>';

  // Add an event listener for the template.
  copyCreditButton.href = "javascript:__getCreditTextHandler()";

  actionButtonSet.append(copyCreditButton);
  return true;
}

(function () {
  "use strict";

  // Workaround to unable to addEventListener :(
  window.__getCreditTextHandler = function () {
    const dictVersion = window
      .$(`tr:has(>th:contains("後端程式碼版本")) + tr > td`)
      .text()
      .trim();
    const date = new Date().toLocaleString("en-UK");

    const creditText = `Processed by 繁化姬 ${dictVersion} @ ${date} | https://zhconvert.org`;

    // Copy to clipboard.
    console.log("Copied: %s", creditText);
    navigator.clipboard
      .writeText(creditText)
      .then(console.log)
      .catch(console.error);
  };

  const mutationObserver = new MutationObserver(function (_, o) {
    console.log("Triggered %s", this);
    const succeed = pushButton();
    if (succeed) {
      o.disconnect();
      console.log("Process succeed.");
    } else {
      console.log("Process failed.");
    }
  });

  console.log(mutationObserver);
  mutationObserver.observe(document, { subtree: true, childList: true });
})();
