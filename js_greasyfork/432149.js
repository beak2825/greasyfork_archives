// ==UserScript==
// @name         MFC Item Importer
// @version      0.1
// @description  import to MFC
// @author       IxianNavigator
// @match        https://myfigurecollection.net/manager/collection/
// @icon         https://icons.duckduckgo.com/ip2/myfigurecollection.net.ico
// @grant        none
// @namespace https://greasyfork.org/users/746566
// @downloadURL https://update.greasyfork.org/scripts/432149/MFC%20Item%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/432149/MFC%20Item%20Importer.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function collectItem(mfcId) {
    const formData = new FormData();
    const data = {
      commit: "collectItem",
      targets: ["COLLECT", "COLLECTION", `ITEM${mfcId}`],
      status: 2,
      previousStatus: 0,
      count: 1,
      score: -1,
      ownedDate: "0000-00-00",
      orderedPrice: "0.00",
      orderedLocation: "",
      shippingMethod: 0,
      trackingNumber: "",
      paidDate: "0000-00-00",
      shippedDate: "0000-00-00",
      subStatus: 0
    };
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return fetch(`https://myfigurecollection.net/item/${mfcId}`, {
      method: "post",
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: formData
    });
  }
  const importDialog = document.createElement("div");

  function doImport() {
    const text = importDialog.querySelector("textarea").value;
    if (!text || !text.trim()) {
      return;
    }
    const mfcIds = text.match(/[^\r\n]+/g).reduce((ids, currentLine) => {
      const match = currentLine.match(/\d+/);
      if (match) {
        ids.push(match[0]);
      }
      return ids;
    }, []);

    const button = importDialog.querySelector('input[type="submit"]');
    button.disabled = true;
    button.style.opacity = 0.6;
    button.value = "Working";

    function saveRemainingItems() {
      if (mfcIds.length) {
        return collectItem(mfcIds.shift()).then(
          () => {
            button.value = `${button.value}.`;
            return saveRemainingItems();
          }
        )
      }
      return Promise.resolve();
    };
    return saveRemainingItems().then(() => {
      button.disabled = false;
      button.style.opacity = 1;
      button.value = "Save";
    });
  }

  // add import dialog
  importDialog.id = "window";
  importDialog.style.display = "none";
  importDialog.innerHTML = `<div class="wrapper tbx-target-WINDOW"><h2><span class="icon icon-plus"></span>Import items<nav class="actions"><a href="#" class="maximize"><span class="icon-only icon-expand"></span></a><a href="#" class="minimize"><span class="icon-only icon-compress"></span></a><a href="#" class="close" title="Close"><span class="icon-only icon-times-circle"></span></a></nav></h2><div class="window-content">
<div class="form">
  <div class="text form-field">
    <div class="form-label">Import data</div>
    <div class="form-input field-is-required">
      <div class="tbx-bbcode">
        <textarea id="import-textarea" rows="30" placeholder="Paste here your MFC item URLs or bare item ids, you can even mix them, but put each of them into a separate line."></textarea>
      </div>
    </div>
  </div>
  <div class=" form-field">
    <div class="form-input">
      <input value="Save" type="submit">
    </div>
  </div>
</div>
  </div></div>
  `;
  importDialog.querySelector(".close").addEventListener(
    'click',
    () => { importDialog.style.display = "none"; }
  );
  importDialog.querySelector('input[type="submit"]').addEventListener(
    'click',
    () => { doImport(); }
  );
  document.body.appendChild(importDialog);
  // add import button
  const container = document.querySelector(".h1-meta-actions.desktop");
  const importButton = document.createElement('a');
  const icon = document.createElement('span');
  icon.classList.add("icon-plus");
  icon.classList.add("icon-only");
  importButton.appendChild(icon);
  importButton.href = "#";
  importButton.classList.add("tbx-window");
  importButton.classList.add("action");
  importButton.appendChild(document.createTextNode("Import items"));
  container.appendChild(importButton);
  importButton.addEventListener("click", () => {
    importDialog.style.display = "block";
  });

})();



