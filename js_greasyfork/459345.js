// ==UserScript==
// @name         msec_override for misskey.io
// @namespace    https://misskey.io/@7vU6jrZRuX2ffkY
// @version      0.4
// @description  ノートの投稿時刻をミリ秒単位で表示
// @author       @7vU6jrZRuX2ffkY
// @match        https://misskey.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459345/msec_override%20for%20misskeyio.user.js
// @updateURL https://update.greasyfork.org/scripts/459345/msec_override%20for%20misskeyio.meta.js
// ==/UserScript==

(() => {
  const scriptLabel = "msec_override for misskey.io (v0.4)\n";
  const observer = new MutationObserver(records => {
    records.forEach(record => {
      record.addedNodes.forEach(addedNode => {
        if (!addedNode.querySelector) return;
        addedNode.querySelectorAll("a>time").forEach(timeEl => {
          const href = timeEl.parentNode.href.match(/(?<=\/notes\/)\w+/)[0];
          const time = new Date(parseInt(href.substr(0, href.length - 2), 36) + 946684800000);
          const timeStr = `${time.getFullYear()}/${("0"+(time.getMonth()+1)).slice(-2)}/${("0"+time.getDate()).slice(-2)}` +
            ` ${("0"+time.getHours()).slice(-2)}:${("0"+time.getMinutes()).slice(-2)}:${("0"+time.getSeconds()).slice(-2)}` +
            `.${("00"+time.getMilliseconds()).slice(-3)}`;
          timeEl.textContent = timeStr;
        });
        addedNode.querySelectorAll("button>time[title]").forEach(timeEl => { // Renoteにも対応
          const nums = timeEl.getAttribute("title").split(/\D+/);
          const timeStr = `${nums[0]}/${("0"+nums[1]).slice(-2)}/${("0"+nums[2]).slice(-2)}` +
            ` ${("0"+nums[3]).slice(-2)}:${("0"+nums[4]).slice(-2)}:${("0"+nums[5]).slice(-2)}`;
          timeEl.textContent = timeStr;
        });
      });
    });
  });
  const timer = setInterval(() => {
    const targetClassic = document.querySelector("main"); // クラシックUIでのobserve対象
    const targetDeck = document.querySelectorAll("#misskey_app>div>div>div>section"); // デッキUIでのobserve対象
    const targetDefault = document.querySelector("article"); // デフォルトUIを検知する用
    if (targetClassic) {
      console.log(scriptLabel + "Detected UI Mode: Classic");
      clearInterval(timer);
      observer.observe(targetClassic, {
        childList: true,
        subtree: true,
        characterData: true
      });
    } else if (targetDeck.length > 0) {
      console.log(scriptLabel + "Detected UI Mode: Deck");
      clearInterval(timer);
      targetDeck.forEach(target => observer.observe(target, {
        childList: true,
        subtree: true,
        characterData: true
      }));
    } else if (targetDefault) {
      console.log(scriptLabel + "Detected UI Mode: Default");
      clearInterval(timer);
      const ancestors = [targetDefault];
      while (true) {
        ancestors.unshift(ancestors[0].parentNode);
        if (ancestors[0].id == "misskey_app" || !ancestors[0]) break;
      }
      ancestors[3].querySelectorAll("a>time").forEach(timeEl => {
        const href = timeEl.parentNode.href.match(/(?<=\/notes\/)\w+/)[0];
        const time = new Date(parseInt(href.substr(0, href.length - 2), 36) + 946684800000);
        const timeStr = `${time.getFullYear()}/${("0"+(time.getMonth()+1)).slice(-2)}/${("0"+time.getDate()).slice(-2)}` +
          ` ${("0"+time.getHours()).slice(-2)}:${("0"+time.getMinutes()).slice(-2)}:${("0"+time.getSeconds()).slice(-2)}` +
          `.${("00"+time.getMilliseconds()).slice(-3)}`;
        timeEl.textContent = timeStr;
      });
      observer.observe(ancestors[3], {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }, 100);
})();