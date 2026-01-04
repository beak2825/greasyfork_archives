// ==UserScript==
// @name         TORN: Poker Player Links
// @namespace    dekleinekobini.pokerplayerlinks
// @version      1.1.0
// @author       DeKleineKobini [2114440]
// @description  Replace player names with links where possible.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/487407/TORN%3A%20Poker%20Player%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/487407/TORN%3A%20Poker%20Player%20Links.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .ppl-link{color:inherit;text-decoration:none} ");

(function () {
  'use strict';

  function findByPartialClass(node, className, subSelector = "") {
    return node.querySelector(`[class*='${className}'] ${subSelector}`.trim());
  }
  function findAll(node, selector) {
    return [...node.querySelectorAll(selector)];
  }
  var LogType = /* @__PURE__ */ ((LogType2) => {
    LogType2["STARTED"] = "STARTED";
    LogType2["LEAVE"] = "LEAVE";
    LogType2["UNKNOWN"] = "UNKNOWN";
    return LogType2;
  })(LogType || {});
  function analyzePokerLog(log) {
    var _a, _b;
    let type = "UNKNOWN";
    if (log.className.includes("state___")) {
      if ((_a = log.textContent) == null ? void 0 : _a.includes(" started")) {
        type = "STARTED";
      }
    } else if ((_b = log.textContent) == null ? void 0 : _b.includes("left the table")) {
      type = "LEAVE";
    }
    return {
      element: log,
      type,
      isOld: log.className.includes("old__")
    };
  }
  const names = {};
  let audioElement;
  injectAudioElement();
  setInterval(execute, 250);
  function execute() {
    findAll(document, "[class*='opponent___']:not(.ppl-modified)").forEach((element) => {
      markModified(element);
      linkProfile(element);
    });
    findAll(document, "[class*='messagesWrap___'] [class*='message___']:not(.ppl-modified)").forEach((element) => {
      markModified(element);
      const log = analyzePokerLog(element);
      switch (log.type) {
        case LogType.STARTED:
          if (!log.isOld) {
            increaseSittingOutTimer();
          }
          break;
        case LogType.LEAVE:
          if (!log.isOld) {
            notifyLeave();
          }
          break;
      }
      linkAttackPage(log);
    });
  }
  function markModified(element) {
    element.classList.add("ppl-modified");
  }
  function linkProfile(opponent) {
    const user = parseInt(opponent.id.split("-")[1], 10);
    const nameElement = findByPartialClass(opponent, "name__");
    if (!nameElement)
      return;
    const name = nameElement.textContent;
    nameElement.innerHTML = `<a href="https://www.torn.com/profiles.php?XID=${user}" class="ppl-link" target="_blank">${name}</a>`;
    names[name] = user;
  }
  function linkAttackPage(log) {
    const boldElement = log.element.querySelector("em");
    if (boldElement) {
      const name = boldElement.textContent;
      if (name in names) {
        const user = names[name];
        boldElement.innerHTML = `<a href="https://www.torn.com/loader.php?sid=attack&user2ID=${user}" class="ppl-link" target="_blank">${name}</a>`;
      }
    }
  }
  function increaseSittingOutTimer() {
    findAll(document, "[class*='opponent___'][class*='folded___']").forEach((opponent) => {
      var _a, _b;
      if (!((_a = opponent.textContent) == null ? void 0 : _a.includes("Sitting out"))) {
        delete opponent.dataset.sittingRounds;
        (_b = opponent.querySelector(".ppl-rounds")) == null ? void 0 : _b.remove();
        return;
      }
      const currentRounds = parseInt(opponent.dataset.sittingRounds ?? "0", 10);
      opponent.dataset.sittingRounds = (currentRounds + 1).toString();
      const stateElement = findByPartialClass(opponent, "state___");
      if (!stateElement)
        return;
      let roundsElement = stateElement.querySelector(".ppl-rounds");
      if (!roundsElement) {
        roundsElement = document.createElement("span");
        roundsElement.classList.add("ppl-rounds");
        stateElement.appendChild(roundsElement);
      }
      roundsElement.textContent = ` (${currentRounds + 1})`;
    });
  }
  function injectAudioElement() {
    if (audioElement)
      return;
    audioElement = document.createElement("audio");
    audioElement.src = "https://cdn.pixabay.com/download/audio/2024/02/06/audio_2766287d66.mp3?filename=foot-step-snow-4-189865.mp3";
    audioElement.preload = "auto";
    document.body.appendChild(audioElement);
  }
  function notifyLeave() {
    injectAudioElement();
    audioElement == null ? void 0 : audioElement.play().catch(() => {
    });
  }

})();