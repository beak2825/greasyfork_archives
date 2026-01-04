// ==UserScript==
// @name         PokerHistory
// @namespace    http://www.torn.com/
// @version      1.2
// @description  Records all Poker history.
// @author       bot_7420 [2937420]
// @match        https://www.torn.com/page.php?sid=holdem*
// @run-at       document-body
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/473563/PokerHistory.user.js
// @updateURL https://update.greasyfork.org/scripts/473563/PokerHistory.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let db = null;
  let messageBoxObserver = null;

  initIndexDB();

  window.onload = function () {
    initCSS();
    initControlPanel();
    initPokerObserver();
  };

  function initIndexDB() {
    const openRequest = indexedDB.open("scriptPokerHistoryDB", 1);
    openRequest.onupgradeneeded = function (e) {
      console.log("PokerHistory: initIndexDB open onupgradeneeded");
      db = e.target.result;
      if (!db.objectStoreNames.contains("messageStore")) {
        console.log("PokerHistory: initIndexDB open onupgradeneeded create store");
        const objectStore = db.createObjectStore("messageStore", { keyPath: "autoId", autoIncrement: true });
      }
    };
    openRequest.onsuccess = function (e) {
      console.log("PokerHistory: initIndexDB open onsuccess");
      db = e.target.result;
    };
    openRequest.onerror = function (e) {
      console.error("PokerHistory: initIndexDB open onerror");
      console.dir(e);
    };
  }

  function dbWrite(message) {
    if (!db || !message) {
      return;
    }

    const transaction = db.transaction(["messageStore"], "readwrite");
    transaction.oncomplete = (event) => {
      //console.log("PokerHistory: dbWrite transaction oncomplete [" + message.text + "]");
    };
    transaction.onerror = (event) => {
      console.error("PokerHistory: dbWrite transaction onerror [" + message.text + "]");
    };

    const store = transaction.objectStore("messageStore");
    const request = store.put(message);
    request.onsuccess = (event) => {};
  }

  function dbReadAll() {
    if (!db) {
      console.error("PokerHistory: dbReadAll db is null");
    }

    const transaction = db.transaction(["messageStore"], "readonly");
    transaction.oncomplete = (event) => {
      console.log("PokerHistory: dbReadAll transaction oncomplete");
    };
    transaction.onerror = (event) => {
      console.error("PokerHistory: dbReadAll transaction onerror");
    };

    const store = transaction.objectStore("messageStore");
    return new Promise((resolve, reject) => {
      const resultList = [];
      store.openCursor().onerror = (event) => {
        resolve(resultList);
      };
      store.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          resultList.push(cursor.value);
          cursor.continue();
        } else {
          resolve(resultList);
        }
      };
    });
  }

  function initPokerObserver() {
    const $poker = $("div.holdemWrapper___D71Gy");
    const observerConfig = { attributes: false, childList: true, subtree: false };
    const observer = new MutationObserver(() => {
      reObserveMessageBox();
    });
    if ($poker.length === 1) {
      console.log("PokerHistory: observe poker page");
      observer.observe($poker[0], observerConfig);
      reObserveMessageBox();
    }
  }

  function reObserveMessageBox() {
    console.log("PokerHistory: reObserveMessageBox");
    if (!messageBoxObserver) {
      messageBoxObserver = new MutationObserver((mutated) => {
        handleMessageBoxChange(mutated);
      });
    }
    messageBoxObserver.disconnect();
    const $messageWrap = $("div.holdemWrapper___D71Gy div.messagesWrap___tBx9u");
    const observerConfig = { attributes: true, childList: true, subtree: false };
    messageBoxObserver.observe($messageWrap[0], observerConfig);
  }

  function handleMessageBoxChange(mutated) {
    if (mutated.length >= 40) {
      console.log("PokerHistory: handlePokerBoxChange disregarded " + mutated.length);
      return;
    }

    for (const mutation of mutated) {
      for (const node of mutation.addedNodes) {
        if (node.classList.contains("message___RlFXd")) {
          let message = {
            timestamp: new Date().getTime() / 1000,
            text: node.innerText,
          };
          dbWrite(message);
        }
      }
    }
  }

  function initCSS() {
    const isDarkmode = $("body").hasClass("dark-mode");
    GM_addStyle(`.poker-control-panel-popup {
                        position: fixed;
                        top: 10%;
                        left: 15%;
                        border-radius: 10px;
                        padding: 10px;
                        background: ${isDarkmode ? "#282828" : "#F0F0F0"};
                        z-index: 1000;
                        display: none;
                      }

                      .poker-control-panel-results {
                        padding: 10px;
                      }

                      .poker-control-player {
                        margin: 4px 4px 4px 4px !important;
                        display: inline-block !important;
                      }

                      .poker-control-panel-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        background: ${isDarkmode ? "#404040" : "#B0B0B0"};
                        width: 100%;
                        height: 100%;
                        opacity: 0.7;
                        z-index: 900;
                        display: none;
                      }

                      .poker-control-panel-item {
                        display: inline-block;
                        margin: 2px 2px 2px 2px;
                      }`);
  }

  function initControlPanel() {
    const $title = $("div#top-page-links-list");
    if ($title.length === 0) {
      console.log("PokerHistory: nowhere to put control panel button");
    }
    const $controlBtn = $(`<a id="pokerHistoryControl" class="t-clear h c-pointer right last">
                                  <span class="icon-wrap svg-icon-wrap">
                                    <span class="link-icon-svg">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10.33"><defs><style>.cls-1{opacity:0.35;}.cls-2{fill:#fff;}.cls-3{fill:#777;}</style></defs><g id="Слой_2" data-name="Слой 2"><g id="icons"><g class="cls-1"><path class="cls-2" d="M10,5.67a2,2,0,0,1-4,0,1.61,1.61,0,0,1,0-.39A1.24,1.24,0,0,0,7.64,3.7a2.19,2.19,0,0,1,.36,0A2,2,0,0,1,10,5.67ZM8,1C3,1,0,5.37,0,5.37s3.22,5,8,5c5.16,0,8-5,8-5S13.14,1,8,1ZM8,9a3.34,3.34,0,1,1,3.33-3.33A3.33,3.33,0,0,1,8,9Z"></path></g><path class="cls-3" d="M10,4.67a2,2,0,0,1-4,0,1.61,1.61,0,0,1,0-.39A1.24,1.24,0,0,0,7.64,2.7a2.19,2.19,0,0,1,.36,0A2,2,0,0,1,10,4.67ZM8,0C3,0,0,4.37,0,4.37s3.22,5,8,5c5.16,0,8-5,8-5S13.14,0,8,0ZM8,8a3.34,3.34,0,1,1,3.33-3.33A3.33,3.33,0,0,1,8,8Z"></path></g></g></svg>
                                    </span>
                                  </span>
                                  <span>PokerHistory</span>
                                </a>`);
    $title.append($controlBtn);

    const $controlPanelDiv = $(`<div id="pokerControlPanel" class="poker-control-panel-popup">control</div>`);
    const $controlPanelOverlayDiv = $(`<div id="pokerControlOverlayPanel" class="poker-control-panel-overlay"></div>`);
    $controlPanelDiv.html(`
        <textarea readonly id="poker-results" cols="120" rows="30"></textarea>
        `);

    $title.append($controlPanelDiv);
    $title.append($controlPanelOverlayDiv);

    $controlBtn.click(function () {
      dbReadAll().then((result) => {
        let text = "";
        for (const message of result) {
          const timeStr = formatDateString(new Date(message.timestamp * 1000));
          text += timeStr + " " + message.text + "\n";
        }
        text += "Found " + result.length + " records\n";
        const $textarea = $("textarea#poker-results");
        $textarea.val(text);
        $textarea.scrollTop($textarea[0].scrollHeight);
      });

      $controlPanelDiv.fadeToggle(200);
      $controlPanelOverlayDiv.fadeToggle(200);
    });

    $controlPanelOverlayDiv.click(function () {
      $controlPanelDiv.fadeOut(200);
      $controlPanelOverlayDiv.fadeOut(200);
    });
  }

  function formatDateString(date) {
    const pad = (v) => {
      return v < 10 ? "0" + v : v;
    };
    let year = date.getFullYear();
    let month = pad(date.getMonth() + 1);
    let day = pad(date.getDate());
    let hour = pad(date.getHours());
    let min = pad(date.getMinutes());
    let sec = pad(date.getSeconds());
    return year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;
  }
})();
