// ==UserScript==
// @name        Chocolatey install -y
// @namespace   Violentmonkey Scripts
// @match       http*://chocolatey.org/packages*
// @grant       none
// @version     1.2
// @author      SettingDust
// @description Add -y to install command
// @downloadURL https://update.greasyfork.org/scripts/403929/Chocolatey%20install%20-y.user.js
// @updateURL https://update.greasyfork.org/scripts/403929/Chocolatey%20install%20-y.meta.js
// ==/UserScript==

const map = {};

const observer = new MutationObserver(function (mutations, me) {
  const installElem = Array.from(
    document.querySelectorAll(".input-group .input-group-prepend+input")
  );
  if (installElem.length) {
    installElem
      .filter((elem) => !map[elem])
      .filter((elem) => !elem.value.endsWith("-y"))
      .forEach((elem) => {
        elem.value += " -y";
        map[elem] = true;
      });
  }

  const copyElem = Array.from(
    document.querySelectorAll("[data-original-title='Copy to Clipboard']")
  );
  if (copyElem.length) {
    copyElem
      .filter((elem) => !map[elem])
      .forEach((elem) => {
        elem.setAttribute(
          "data-clipboard-text",
          elem.getAttribute("data-clipboard-text") + " -y"
        );
        map[elem] = true;
      });
  }
});

// start observing
observer.observe(document, {
  childList: true,
  subtree: true,
});
