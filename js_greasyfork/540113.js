// ==UserScript==
// @name         Deny Cookies
// @namespace    https://kfragkoulis.com/DenyCookies
// @version      1.0.0
// @author       Konstantinos Fragkoulis
// @description  Deny cookie popups
// @license      ISC
// @icon         example.com
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540113/Deny%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/540113/Deny%20Cookies.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const denyText = ["Reject", "Decline", "Deny", "Only essential", "Decline optional", "Decline optional cookies", "Do not consent"];
  const denyButton = ["reject-all-btn", "reject-all-button", "W0wltc", "onetrust-reject-all-handler", "btn-reject", "do-not-consent"];
  const moreOptionsText = ["More Options"];
  const moreOptionsButton = ["more-options-btn", "more-options-button"];
  const popupText = ["Not now"];
  const popupButton = ["onesignal-slidedown-cancel-button", "cleverpush-confirm-btn-deny"];
  function clickDenyButton() {
    var _a;
    var flag = false;
    const buttons = Array.from(document.querySelectorAll('button, a, div, span, [role="button"]')).sort((a, b) => {
      var _a2, _b;
      const aText = ((_a2 = a.textContent) == null ? void 0 : _a2.trim()) || "";
      const bText = ((_b = b.textContent) == null ? void 0 : _b.trim()) || "";
      return aText.length - bText.length;
    });
    for (const btn of buttons) {
      const tagName = btn.tagName.toLowerCase();
      if (tagName === "div" || tagName === "span") {
        const style = window.getComputedStyle(btn);
        if (style.cursor !== "pointer" && !btn.hasAttribute("onclick") || !btn.textContent) {
          continue;
        }
      }
      const text = (_a = btn.textContent) == null ? void 0 : _a.trim().toLowerCase();
      if (text && denyText.some((deny) => text.includes(deny.toLowerCase()))) {
        console.log("Clicking deny button: ", text);
        btn.click();
        flag = true;
      }
      if (denyButton.some((deny) => btn.id.toString().includes(deny.toLowerCase()))) {
        console.log("Clicking deny button: ", btn.id.toString());
        btn.click();
        flag = true;
      }
    }
    return flag;
  }
  function clickMoreOptionsButton() {
    var _a;
    var flag = false;
    const buttons = Array.from(document.querySelectorAll('button, a, div, span, [role="button"]')).sort((a, b) => {
      var _a2, _b;
      const aText = ((_a2 = a.textContent) == null ? void 0 : _a2.trim()) || "";
      const bText = ((_b = b.textContent) == null ? void 0 : _b.trim()) || "";
      return aText.length - bText.length;
    });
    for (const btn of buttons) {
      const tagName = btn.tagName.toLowerCase();
      if (tagName === "div" || tagName === "span") {
        const style = window.getComputedStyle(btn);
        if (style.cursor !== "pointer" && !btn.hasAttribute("onclick")) {
          continue;
        }
      }
      const text = (_a = btn.textContent) == null ? void 0 : _a.trim().toLowerCase();
      if (text && moreOptionsText.some((moreOptions) => text.includes(moreOptions.toLowerCase()))) {
        console.log("Clicking more options button: ", text);
        btn.click();
        flag = true;
      }
      if (moreOptionsButton.some((moreOptions) => btn.id.toString().includes(moreOptions.toLowerCase()))) {
        console.log("Clicking more options button: ", btn.id.toString());
        btn.click();
        flag = true;
      }
    }
    return flag;
  }
  function hidePopups() {
    var _a;
    var flag = false;
    const buttons = Array.from(document.querySelectorAll("button, a, div")).sort((a, b) => {
      var _a2, _b;
      const aText = ((_a2 = a.textContent) == null ? void 0 : _a2.trim()) || "";
      const bText = ((_b = b.textContent) == null ? void 0 : _b.trim()) || "";
      return aText.length - bText.length;
    });
    for (const btn of buttons) {
      const text = (_a = btn.textContent) == null ? void 0 : _a.trim().toLowerCase();
      if (text && popupText.some((popup) => text.includes(popup.toLowerCase()))) {
        console.log("Clicking popup button: ", text);
        btn.click();
        flag = true;
      }
      if (popupButton.some((popup) => btn.id.toString().includes(popup.toLowerCase()))) {
        console.log("Clicking popup button: ", btn.id.toString());
        btn.click();
        flag = true;
      }
    }
    return flag;
  }
  let tries = 0;
  const maxTries = 5;
  const interval = setInterval(() => {
    console.log("Try ", tries);
    tries++;
    var deny = clickDenyButton();
    var moreOptions;
    if (!deny) {
      moreOptions = clickMoreOptionsButton();
      if (moreOptions) deny = clickDenyButton();
    }
    hidePopups();
    if (deny || tries >= maxTries) clearInterval(interval);
  }, 1e3);

})();