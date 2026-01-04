// ==UserScript==
// @name         scrape-majsoul-game-uuid
// @version      0.0.1
// @author       Sanggu Han
// @description  Copies uuid of friendly games in mahjong soul
// @homepage     https://greasyfork.org/en/scripts/444785
// @homepageURL  https://greasyfork.org/en/scripts/444785
// @supportURL   https://github.com/KOREAN139/syssec-leaderboard/issues
// @namespace    mjuuidscraper
// @license      MIT
// @match        https://game.mahjongsoul.com/*
// @downloadURL https://update.greasyfork.org/scripts/444785/scrape-majsoul-game-uuid.user.js
// @updateURL https://update.greasyfork.org/scripts/444785/scrape-majsoul-game-uuid.meta.js
// ==/UserScript==

(function () {
  const L_KEY_CODE = "KeyL";
  const FRIENDLY_GAME_TYPE = 1;

  document.addEventListener("keydown", e => {
    e = e || window.event;
    if (e.code != L_KEY_CODE) {
      return;
    }

    waitAppLoading();
    fetchLogList();
  });

  const waitAppLoading = () => {
    if (typeof app === "undefined" || !app.NetAgent || !app.NetAgent.prototype) {
      return setTimeout(() => waitAppLoading(), 1000);
    }
    console.log("app loaded");
  }

  const fetchLogList = () => {
    console.log("fetchGameRecordList requested");
    app.NetAgent.sendReq2Lobby(
      "Lobby",
      "fetchGameRecordList",
      { start: 0, count: 100, type: FRIENDLY_GAME_TYPE },
      (err, res) => {
        if (err || res.error) {
          console.log("error", err, res.error);
          return;
        }
        console.log("fetchGameRecordList successed");
        const uuids = res.record_list.map(r => r.uuid);
        makePopup(uuids);
      });
  };

  const makePopup = uuids => {
    let popup = open("", "gameUuids", "_blank", "width=200,height=200");
    popup.document.write(uuids.join('\n'));
    popup.document.body.style.whiteSpace="pre-line";
  };
})();
