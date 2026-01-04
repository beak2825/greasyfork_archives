// ==UserScript==
// @name        Idle Pixel Hide Collected Items Collection Log
// @namespace   finally.idle-pixel.hidecollectionlog
// @match       https://idle-pixel.com/login/play/*
// @grant       none
// @version     1.2
// @author      finally
// @description Hides already collected items in your collection log
// @downloadURL https://update.greasyfork.org/scripts/519966/Idle%20Pixel%20Hide%20Collected%20Items%20Collection%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/519966/Idle%20Pixel%20Hide%20Collected%20Items%20Collection%20Log.meta.js
// ==/UserScript==

(() => {
  return new Promise((resolve) => {
    function check() {
      if (document.getElementById("panel-collection-log-content")) {
        resolve();
        return;
      }
      setTimeout(check, 200);
    }
    check();
  });
})().then(() => {
  let collectionLog = document.getElementById("panel-collection-log");
  let div = document.createElement("div");
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "hide-collection-items";
  let label = document.createElement("label");
  label.for = "hide-collection-items";
  label.innerHTML = "Hide Collected Items";
  let button = document.createElement("input");
  button.type = "button";
  button.value = "Collect All";
  div.appendChild(checkbox);
  div.appendChild(label);
  div.appendChild(button);
  collectionLog.insertBefore(div, collectionLog.childNodes[collectionLog.childNodes.length-2]);

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) hideCollectedItems();
    else showCollectedItems();
  });

  button.addEventListener("click", () => {
    Items.collection_log_items.forEach(item => {
      Items.clicksCollectionLogItem(item.var);
    });
  });

  let old_refresh_collection_log = Items.refresh_collection_log;
  Items.refresh_collection_log = () => {
    old_refresh_collection_log.apply(this, arguments);

    if (checkbox.checked) hideCollectedItems();
    else showCollectedItems();
  };

  function hideCollectedItems() {
    let collectionLog = document.getElementById("panel-collection-log-content");
    for (let i = 0; i < collectionLog.childNodes.length; i++) {
      let node = collectionLog.childNodes[i];
      if (node.className.indexOf("collection-log-entry") == -1) { //non-item
        let done = true;
        for (let j = i+2; j < collectionLog.childNodes.length; j++) {
          let nnode = collectionLog.childNodes[j];
          if (nnode.className.indexOf("collection-log-entry") == -1) break;
          if (Items.getItem(nnode.title + "_collected") == 0) {
            done = false;
            break;
          }
        }

        if (done) {
          node.style.display = "none";
          collectionLog.childNodes[++i].style.display = "none";
        }

        continue;
      }

      if (Items.getItem(node.title + "_collected") != 0) {
        node.style.display = "none";
      }
    }
  }

  function showCollectedItems() {
    let collectionLog = document.getElementById("panel-collection-log-content");
    for (let i = 0; i < collectionLog.childNodes.length; i++) {
      collectionLog.childNodes[i].style.display = "";
    }
  }
});
