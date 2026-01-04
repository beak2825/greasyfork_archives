// ==UserScript==
// @name         Disable Discord chat input (updated)
// @version      5.0
// @description  Avoid accidentally typing in chat; automatically re-applies on channel/server nav by watching for new inputs in the DOM
// @author       Dragosarus, clnb
// @match        http://discord.com/*
// @match        https://discord.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM.setValue
// @grant        GM.getValue
// @require      http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/1474691
// @downloadURL https://update.greasyfork.org/scripts/537214/Disable%20Discord%20chat%20input%20%28updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537214/Disable%20Discord%20chat%20input%20%28updated%29.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
 
(function() {
  'use strict';

  const modes = ["hover","strict","off"];
  let modeIndex = 0,
      menuId,
      persist = true;

  (async function() {
    if (persist) {
      const saved = await GM.getValue("mode", modes[0]);
      const idx = modes.indexOf(saved);
      modeIndex = idx !== -1 ? idx : 0;
    }
    menuId = GM_registerMenuCommand(
      `Toggle input lock [current: ${modes[modeIndex]}]`,
      cycleMode, 'm'
    );
    applyMode();
    installWatcher();
  })();

  function cycleMode() {
    modeIndex = (modeIndex + 1) % modes.length;
    if (persist) GM.setValue("mode", modes[modeIndex]);
    GM_unregisterMenuCommand(menuId);
    menuId = GM_registerMenuCommand(
      `Toggle input lock [current: ${modes[modeIndex]}]`,
      cycleMode, 'm'
    );
    applyMode();
  }

  function applyMode() {
    if (modes[modeIndex] === "off") {
      enable();
    } else {
      disable();
    }
  }

  function disable() {
    const ta = $("div[class*='slateTextArea']");
    if (!ta.length) return;
    ta.attr("contenteditable","false")
      .parent().parent().css("pointer-events","none");
    ta[0].style.removeProperty("-webkit-user-modify");
  }

  function enable() {
    const ta = $("div[class*='slateTextArea']");
    if (!ta.length) return;
    ta.attr("contenteditable","true")
      .parent().parent().css("pointer-events","");
    ta[0].style.setProperty("-webkit-user-modify","read-write-plaintext-only");
  }

  function installHover() {
    if (modes[modeIndex] !== "hover") return;
    const c = $("div[class*='scrollableContainer']");
    if (!c.length) return;
    c.off('mouseenter mouseleave')
     .hover(() => enable(), () => disable());
  }

  function installWatcher() {
    const obs = new MutationObserver(muts => {
      for (let m of muts) {
        for (let node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;

          if (node.matches?.("div[class*='slateTextArea']") ||
              node.querySelector?.("div[class*='slateTextArea']")) {
            applyMode();
            installHover();
            return;
          }
        }
      }
    });

    obs.observe(document.body, { childList: true, subtree: true });
  }

})();