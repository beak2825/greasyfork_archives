// ==UserScript==
// @name         msec_override for Old TweetDeck
// @namespace    https://twitter.com/@7vU6jrZRuX2ffkY
// @version      0.5
// @description  旧TweetDeckの時刻表示をミリ秒単位にするやつ
// @author       @7vU6jrZRuX2ffkY
// @match        https://twitter.com/i/tweetdeck
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473393/msec_override%20for%20Old%20TweetDeck.user.js
// @updateURL https://update.greasyfork.org/scripts/473393/msec_override%20for%20Old%20TweetDeck.meta.js
// ==/UserScript==

(() => {
  const observer = new MutationObserver(m => {
    m.forEach(mm => {
      mm.addedNodes.forEach(e => {
        if (e.classList.contains("js-stream-item")) {
          modifyAnchor(e.querySelector("time>a"));
          modifyAnchor(e.querySelector("div.js-card-container+div>a"));
        }
      });
    });
  });

  const modifyAnchor = a => {
    if (!a) return;
    const id = a.href.split("/")[5];
    if (!id || id < 10000000000) return;
    const d = new Date(id / 4194304 + 1288834974657);
    a.textContent = formatDateLocal(d);
  };

  const formatDateLocal = d => {
    return d.getFullYear() + "/" +
      ("0" + (d.getMonth() + 1)).slice(-2) + "/" +
      ("0" + d.getDate()).slice(-2) + " " +
      ("0" + d.getHours()).slice(-2) + ":" +
      ("0" + d.getMinutes()).slice(-2) + ":" +
      ("0" + d.getSeconds()).slice(-2) + "." +
      ("00" + d.getMilliseconds()).slice(-3);
  };

  const waitForLoadCompletion = () => {
    const t1 = document.querySelector("div.js-app-columns");
    const t2 = document.querySelector("div#open-modal");
    if (t1 && t2) {
      observer.observe(t1, {
        childList: true,
        subtree: true,
        characterData: true
      });
      observer.observe(t2, {
        childList: true,
        subtree: true,
        characterData: true
      });
      const tasks = TD.controller.scheduler._tasks;
      const key = Object.keys(tasks).find(k => tasks[k].period == 30000);
      TD.controller.scheduler.removePeriodicTask(key);
    } else {
      setTimeout(waitForLoadCompletion, 500);
    }
  };

  waitForLoadCompletion();
})();