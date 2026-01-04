// ==UserScript==
// @name         aao-counter
// @namespace    lss.grisu118.ch
// @version      1.0.0
// @author       Grisu118
// @description  Zählt wie oft eine AAO angeglickt wurde und zeigt es mit einem badge direkt auf der AAO an
// @license      MIT
// @icon         https://avatars.githubusercontent.com/u/4274139?s=40&v=4
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/510948/aao-counter.user.js
// @updateURL https://update.greasyfork.org/scripts/510948/aao-counter.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" .g118-aao-badge{border-radius:8px;position:relative;top:-20px;z-index:1000;background:red;color:#fff;width:16px;height:16px;left:-8px}.aao{height:22px} ");

(function () {
  'use strict';

  (() => {
    function onClick(event) {
      const badgeClass = "g118-aao-badge";
      let target = event.target;
      if (target.tagName === "SPAN") {
        target = target.parentElement;
      }
      if (target.getAttribute("reset") === "true") {
        document.querySelectorAll(`.${badgeClass}`).forEach((elem) => elem.remove());
      } else {
        const badge = target.querySelector(`.${badgeClass}`);
        if (badge) {
          let currentValue = Number.parseInt(badge.innerText);
          if (Number.isNaN(currentValue)) {
            currentValue = 0;
          }
          badge.textContent = (currentValue + 1).toString();
        } else {
          const newBadge = document.createElement("div");
          newBadge.className = badgeClass;
          newBadge.innerText = "1";
          target.append(newBadge);
        }
      }
    }
    document.querySelectorAll(".btn.aao").forEach((elem) => {
      elem.addEventListener("click", onClick);
    });
  })();

})();