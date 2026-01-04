// ==UserScript==
// @name         Query String Automator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automation based on query string. Example: https://www.google.com/?uauto={selector:".RNmpXc",action:"this.click()"}
// @author       You
// @match        *://*/*?uauto=*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478984/Query%20String%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/478984/Query%20String%20Automator.meta.js
// ==/UserScript==

(function () {
  /** @type {string} A query string. object literal of the automation*/
  const queryString = new URLSearchParams(window.location.search);

  /**
   * @typedef {object} automation
   * @prop {string} selector Selector to the target element
   * @prop {string=} action If empty, click the target. Otherwise, eval it. ('this' is binded to the target element)
   */
  let uauto = eval(`(${queryString.get("uauto")})`);
  /**@type {automation[]} */
  let automations = uauto?.length ? uauto : [uauto];
  for (let { selector, action } of automations) {
    let target = document.querySelector(selector);
    console.log(target);
    if (!target) {
      return;
    }
    if (!action) {
      target.click();
    } else {
      var fn = eval(`(function() {${action}})`);
      fn.call(target);
    }
  }
})();
