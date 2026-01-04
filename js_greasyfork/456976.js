// ==UserScript==
// @name         MLD Baseball HIT submitter
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Submits MLD Baseball HITs automatically
// @author       lucassilvas1
// @match        http*://*.sagemaker.aws/work*
// jshint        esversion: 8
// @downloadURL https://update.greasyfork.org/scripts/456976/MLD%20Baseball%20HIT%20submitter.user.js
// @updateURL https://update.greasyfork.org/scripts/456976/MLD%20Baseball%20HIT%20submitter.meta.js
// ==/UserScript==

function check() {
  return new Promise((res, rej) => {
    const start = Date.now();
    const interval = setInterval(() => {
      const shadow = document.getElementsByTagName("crowd-bounding-box")[0];
      if (shadow?.header) {
        clearInterval(interval);
        setTimeout(() => res(shadow), 1000);
      } else if (Date.now() - start > 20000) {
        clearInterval(interval);
        rej();
      }
    }, 300);
  });
}

check().then((shadow) => {
  if (!shadow.src) return;
  const pattern = new URLPattern(
    "https://*.amazonaws.com/samurai-cp-canary-image-classification-prod*/input/020a80a3-0540-437b-8ceb-3c0df052ce0f.jpg?*"
  );
  if (!pattern.test(shadow.src)) return;

  setTimeout(() => {
    const checkbox = shadow.shadowRoot.querySelector("#awsui-checkbox-2");
    checkbox.click();
    const event = new KeyboardEvent("keydown", {
      window,
      bubbles: true,
      cancelable: true,
      composed: true,
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
      shiftKey: true,
    });
    document.dispatchEvent(event);
  }, 2000);
});
