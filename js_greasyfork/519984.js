// ==UserScript==
// @name         TORN: Ranked War Procs
// @namespace    dekleinekobini.private.ranked-war-procs
// @version      1.0.0
// @author       DeKleineKobini [2114440]
// @description  List ranked war bonus procs.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/loader.php?sid=attackLog*
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/519984/TORN%3A%20Ranked%20War%20Procs.user.js
// @updateURL https://update.greasyfork.org/scripts/519984/TORN%3A%20Ranked%20War%20Procs.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const n=document.createElement("style");n.textContent=e,document.head.append(n)})(" .rwp-alert{display:inline-block;background-color:#00a9fa;color:#fff;padding-inline:4px;border-radius:6px} ");

(function () {
  'use strict';

  async function findDelayed(node, findElement, timeout) {
    return new Promise((resolve, reject) => {
      const initialElement = findElement();
      if (initialElement) {
        resolve(initialElement);
        return;
      }
      const observer = new MutationObserver(() => {
        const element = findElement();
        element && (clearTimeout(timeoutId), observer.disconnect(), resolve(element));
      }), timeoutId = setTimeout(() => {
        observer.disconnect(), reject("Failed to find the element within the acceptable timeout.");
      }, timeout);
      observer.observe(node, { childList: true, subtree: true });
    });
  }
  async function findBySelectorDelayed(node = document, selector, timeout = 5e3) {
    return findDelayed(node, () => node.querySelector(selector), timeout);
  }
  function decideEffect(icon, logMessage, logElement) {
    var _a, _b, _c, _d;
    let type = null;
    switch (icon) {
      case "attacking-events-eviscareted":
        type = "eviscerate";
        break;
      case "attacking-events-plunder":
        type = "plunder";
        break;
      case "attacking-events-motivated":
        type = "motivation";
        break;
      case "attacking-events-windup":
        type = "wind-up";
        break;
      case "attacking-events-sureshot":
        type = "sure shot";
        break;
      case "attacking-events-assassinate":
        type = "assassinate";
        break;
      case "attacking-events-bleeding":
        if (logMessage.includes("began bleeding")) type = "bleed";
        break;
      case "attacking-events-deadeye":
        type = "deadeye";
        break;
      case "attacking-events-empower":
        type = "empower";
        break;
      case "attacking-events-frenzy":
        type = "frenzy";
        break;
      case "attacking-events-fury":
        type = "fury";
        break;
      case "attacking-events-penetrate":
        type = "penetrate";
        break;
      case "attacking-events-powerful":
        type = "powerful";
        break;
      case "attacking-events-puncture":
        type = "puncture";
        break;
      case "attacking-events-quicken":
        type = "quicken";
        break;
      case "attacking-events-rage":
        type = "rage";
        break;
      case "attacking-events-specialist":
        type = "specialist";
        break;
      case "attacking-events-withered":
        if (logElement.nextElementSibling && ((_a = logElement.nextElementSibling.textContent) == null ? void 0 : _a.includes("Poison Umbrella")))
          type = null;
        else type = "wither";
        break;
      case "attacking-events-weakened":
        if (logElement.nextElementSibling && ((_b = logElement.nextElementSibling.textContent) == null ? void 0 : _b.includes("Poison Umbrella")))
          type = null;
        else type = "weaken";
        break;
      case "attacking-events-slowed":
        if (logElement.nextElementSibling && ((_c = logElement.nextElementSibling.textContent) == null ? void 0 : _c.includes("Poison Umbrella")))
          type = null;
        else type = "slow";
        break;
      case "attacking-events-crippled":
        if (logElement.nextElementSibling && ((_d = logElement.nextElementSibling.textContent) == null ? void 0 : _d.includes("Poison Umbrella")))
          type = null;
        else type = "cripple";
        break;
      // Untested from here on, just best guesses
      case "attacking-events-achilles":
        type = "achilles";
        break;
      case "attacking-events-blindside":
        type = "blindside";
        break;
      case "attacking-events-crusher":
        type = "crusher";
        break;
      case "attacking-events-cupid":
        type = "cupid";
        break;
      case "attacking-events-roshambo":
        type = "roshambo";
        break;
      case "attacking-events-smurf":
        type = "smurf";
        break;
      case "attacking-events-parry":
        type = "parry";
        break;
      case "attacking-events-bloodlust":
        type = "bloodlust";
        break;
      case "attacking-events-comeback":
        type = "comeback";
        break;
      case "attacking-events-deadly":
        type = "deadly";
        break;
      case "attacking-events-paralyzed":
        type = "paralyzed";
        break;
      case "attacking-events-backstab":
        type = "backstab";
        break;
      case "attacking-events-doubleedged":
        type = "double-edged";
        break;
      case "attacking-events-disarm":
        type = "disarm";
        break;
      case "attacking-events-homerun":
        type = "home run";
        break;
      case "attacking-events-revitalize":
        type = "revitalize";
        break;
      case "attacking-events-warlord":
        type = "warlord";
        break;
      case "attacking-events-irradiate":
        type = "irradiate";
        break;
      case "attacking-events-grace":
        type = "grace";
        break;
      case "attacking-events-focus":
        type = "focus";
        break;
      case "attacking-events-execute":
        type = "execute";
        break;
      case "attacking-events-berserk":
        type = "berserk";
        break;
      case "attacking-events-stricken":
        type = "stricken";
        break;
      case "attacking-events-stun":
        type = "stun";
        break;
      case "attacking-events-suppressed":
        type = "suppress";
        break;
      case "attacking-events-throttle":
        type = "throttle";
        break;
      default:
        type = null;
        break;
    }
    if (type == null) return null;
    return type;
  }
  (() => {
    const sid = new URL(location.href).searchParams.get("sid");
    switch (sid) {
      case "attack":
        loadOngoingAttack().catch((reason) => console.error("[Ranked War Procs] Failed to load the script.", reason));
        break;
      case "attackLog":
        loadAttackHistory().catch((reason) => console.error("[Ranked War Procs] Failed to load the script.", reason));
        break;
      default:
        console.warn("[Ranked War Procs] Couldn't detect which page is loaded.");
        break;
    }
  })();
  async function loadAttackHistory() {
    const logListScrollbar = await findBySelectorDelayed(document, "#log-list-scrollbar .jscroll-inner");
    processLogList(logListScrollbar);
    new MutationObserver(() => processLogList(logListScrollbar)).observe(logListScrollbar, { childList: true });
  }
  async function loadOngoingAttack() {
    const list = await findBySelectorDelayed(document, "ul[class*='list___'][aria-describedby='log-header']");
    processLogList(list);
    new MutationObserver(() => processLogList(list)).observe(list, { childList: true });
    console.log("DKK ongoing attack", list);
  }
  function processLogList(list) {
    var _a;
    list.classList.add("rwp-processed");
    for (const log of list.querySelectorAll("li:not(.rwp-processed)")) {
      log.classList.add("rwp-processed");
      const icon = (_a = log.querySelector(".message-wrap span:first-child, [class*='iconWrap___'] span:first-child")) == null ? void 0 : _a.classList[0];
      if (!icon) continue;
      const messageElement = log.querySelector(".message, [class*='message___']");
      if (!messageElement) continue;
      const effect = decideEffect(icon, messageElement.textContent, log);
      if (!effect) continue;
      const alert = document.createElement("div");
      alert.textContent = effect.toLowerCase();
      alert.classList.add("rwp-alert");
      messageElement.insertAdjacentElement("afterbegin", alert);
    }
  }

})();