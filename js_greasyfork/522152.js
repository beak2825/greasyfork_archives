// ==UserScript==
// @name         WaniKani_SyncReviews
// @namespace    http://phi.pf-control.de/
// @version      2025-01-08
// @description  Synchronizes Wanikani Review Cache
// @author       Dediggefedde
// @match        https://www.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522152/WaniKani_SyncReviews.user.js
// @updateURL https://update.greasyfork.org/scripts/522152/WaniKani_SyncReviews.meta.js
// ==/UserScript==

// Use the menu in the wanikani dashboard to access the script features.
// A new entry at "Scripts > Settings > Sync Review Cache" will open a dialog.
// 1. export cache as JSON into file or clipboard on machine/browser A.
// 2. import cache as JSON/clipboard on machine/browser B.
// 3. Choose "import" to preserve data and prevent double entries.
// 4. Choose "overwrite" to restore backups and discard present entries.

(function () {
  'use strict';
  let originalReviews = []; //copy of present data
  let originalDate; //date of present data


  // --- Copied from WaniKani Review Cache script ---

  let cache_version = 1;
  function compress(data) {
    return press(true, data);
  }
  function press(com, data) {
    let last = 0;
    const pressed = data.reviews.map((item) => {
      const map = [com ? item[0] - last : last + item[0], ...item.slice(1)];
      last = com ? item[0] : last + item[0];
      return map;
    })
    return { cache_version: data.cache_version, date: data.date, reviews: pressed };
  }
  function save(data) {
    return window.wkof.file_cache.save('review_cache', compress(data)).then((_) => data);
  }


  // --- My functions ---

  /** fetches reviews and date */
  async function fetch() {
    originalReviews = await window.review_cache.get_reviews();
    originalDate = originalReviews.reduce((max, cur) => Math.max(cur[0], max), 0); //newest date
  }
  /** restores original data from cache*/
  async function restore() { //not used
    await save({ cache_version, date: new Date(originalDate).toISOString(), reviews: originalReviews });
  }
  /** restores original data from cache*/
  async function overwrite(reviews) {
    const newDate = reviews.reduce((max, cur) => Math.max(cur[0], max), 0);
    await save({ cache_version, date: new Date(newDate).toISOString(), reviews: reviews });
  }
  /** inserts review without doubling reviews and saves reviewCache */
  async function uniqueInsert(reviews) {
    const newestDate = reviews.reduce((max, cur) => Math.max(cur[0], max), 0)
    const merged = originalReviews.concat(reviews);
    const unique = [...new Map(merged.map(item => [item[0], item])).values()].sort((a, b) => a[0] - b[0]); //map prevents duplicates, should run O(n)
    const updated = {
      cache_version,
      date: new Date(newestDate).toISOString(),
      reviews: unique,
    };
    await save(updated);
  }
  function countNew(reviews) {
    const set2 = new Set(originalReviews.map(item => item[0]));
    const uniqueInArray1 = reviews.filter(item => !set2.has(item[0]));
    return uniqueInArray1.length;
  }


  // --- GUI ---

  /** adds menu item */
  function addMenu() {
    const config = {
      name: "sync_review",
      submenu: 'Settings',
      title: "Sync Review Cache",
      on_click: () => {
        const diag = document.getElementById("syncReview_overlay");
        if (diag === null) return;
        document.getElementById("syncReview_loading")?.style?.setProperty("display", "") //make loading text visible
        diag.style.display = "flex";//make dialog visible
        fetch().then(populateDialog) //fetch cache and fill out dialog
      },
    };
    window.wkof.Menu.insert_script_link(config);
  }

  /** Display status message */
  function showStatus(msg) {
    const div = document.getElementById("syncReview_status");
    if (div === null) return;
    div.innerHTML = msg;
  }

  /** offers file with JSON formated review cache for download */
  function downloadFile() {
    const jsonData = JSON.stringify(originalReviews);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'WaniKani_SyncReviews.json'; //filename
    link.click();
    URL.revokeObjectURL(link.href);
  }

  /** reads file after it's selected in input field and copies its content to input text 
   * requires input[type=file,id=syncReviews_uploadFile] to be present
  */
  function readFile() {
    const fileInput = document.getElementById('syncReviews_uploadFile');
    const file = fileInput.files[0];
    if (!file) {
      showStatus("No file selected for importing.");
      return;
    }
    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const fileContent = event.target.result;
        const textel = document.querySelector("#syncReview_dialog textarea[role='importText']");
        if (textel) textel.value = fileContent;
        showStatus("File content copied to import field.");
      } catch (error) {
        showStatus("Error at parsing the file:" + error);
        console.error("SyncReviews error at parsing the file:", error);
      }
    };
    reader.readAsText(file);
  }

  /**fills out dialog, hiding loading text */
  function populateDialog() {
    if (document.getElementById("syncReview_overlay") === null) return;

    document.getElementById("syncReview_loading").style.display = "none";
    document.getElementById("syncReview_content").style.display = "";
    document.getElementById("syncReview_reviewCount").innerHTML = originalReviews.length;
    document.getElementById("syncReview_latestDate").innerHTML = (new Date(originalDate)).toLocaleString();
    document.querySelector("#syncReview_dialog textarea[role='exportText']").value = JSON.stringify(originalReviews);
  }
  /** adds dialog event handlers for clicking/file upload */
  function addDialogEventHandlers() {
    document.getElementById("syncReview_overlay").addEventListener("click", (ev) => { //close dialog when clicking outside
      if (ev.target === ev.currentTarget) {
        document.getElementById("syncReview_overlay").style.display = "none";
        document.getElementById("syncReview_content").style.display = "none";
      }
    });
    document.getElementById('syncReviews_uploadFile').addEventListener("change", readFile); //file upload

    document.getElementById("syncReview_content").addEventListener("click", (ev) => { //event delegation
      if (ev.target.role === null) return;
      let text;
      let impRevs;
      let impDate;
      const importTextField = document.querySelector("#syncReview_dialog textarea[role='importText']");

      switch (ev.target.role) {
        case "close": //close button hides dialog
          document.getElementById("syncReview_overlay").style.display = "none";
          document.getElementById("syncReview_content").style.display = "none";
          break;
        case "paste": //paste clipboard to import textfield
          try {
            navigator.clipboard.readText().then(tex => {
              if (importTextField !== null) {
                importTextField.value = tex;
                showStatus("Text pasted into the input field.");
              } else {
                showStatus("Input field missing");
              }
            });
          } catch (err) {
            showStatus('Error reading the clipboard:\n' + err);
            console.error("SyncReviews error reading the clipboard:", err);
          }
          break;
        case "copy": //copy import textfield to clipboard
          text = JSON.stringify(originalReviews);
          navigator.clipboard.writeText(text).then(() => {
            showStatus("Text copied to clipboard!");
          }).catch(err => {
            showStatus('Error copying text to clipboard:\n' + err);
            console.error("SyncReviews error copy to clipboard:", err);
          });
          break;
        case "download": //offers cache data as file
          downloadFile();
          break;
        case "upload": //reads file and fills out import text area
          document.getElementById('syncReviews_uploadFile').click();
          break;
        case "import": //reads import textarea and imports data preserving present
          try {
            text = importTextField?.value;
            if (text === null) throw "Textelement not found";
            if (text === "") throw "Text is empty";
            impRevs = JSON.parse(text);
            if (impRevs.length === 0) {
              throw "Imported Data is empty";
            }
            if (typeof impRevs.reduce === "undefined") throw "Data is not an array";
            impDate = impRevs.reduce((max, cur) => Math.max(cur[0], max), 0)
            const cntNew = countNew(impRevs);
            if (cntNew == 0) {
              alert("No new entries.");
              return;
            }
            if (!confirm(`Data from ${(new Date(impDate)).toLocaleString()}: ${impRevs.length} entries (${cntNew} new).\nDo you want to IMPORT the data? Existing data is not overwritten.`)) return;
            uniqueInsert(impRevs).then(fetch).then(() => { //imports and fetches again, refreshing originalReviews.
              showStatus(`Data of ${impRevs.length} entries imported!\nNew Review cache size: ${originalReviews.length}.`);
              document.getElementById("syncReview_reviewCount").innerHTML = originalReviews.length;
              document.getElementById("syncReview_latestDate").innerHTML = (new Date(originalDate)).toLocaleString();
              //might need site reload for other scripts. 
              // cache_review.reload() is misleading, since it clears local data and tries to fetch it again from the server. This does not seem to work currently, so you end up with an empty database if you call that here. 
            }).catch(ex => {
              throw ex;
            });
          } catch (ex) {
            showStatus(`Error parsing the input text!\nMake sure it is valid JSON text!\n${ex}`)
            console.error("SyncReviews error parsing:", ex);
          }
          break;
        case "overwrite": //reads import textarea and imports data replacing present data
          try {
            text = importTextField?.value;
            impRevs = JSON.parse(text);
            if (impRevs.length === 0) {
              throw "Imported Data is empty";
            }
            impDate = impRevs.reduce((max, cur) => Math.max(cur[0], max), 0);
            if (!confirm(`Data of ${(new Date(impDate)).toLocaleString()} with ${impRevs.length} entries.\nDo you want to REPLACE the existing data?`)) return;
            overwrite(impRevs).then(fetch).then(() => {
              showStatus(`Data of ${impRevs.length} entries used to overwrite local storage!\nNew Review cache size: ${originalReviews.length}.`);
              document.getElementById("syncReview_reviewCount").innerHTML = originalReviews.length;
              document.getElementById("syncReview_latestDate").innerHTML = (new Date(originalDate)).toLocaleString();
            }).catch(ex => {
              throw ex;
            });
          } catch (ex) {
            showStatus(`Error parsing the input text!\nMake sure it is valid JSON text!\n${ex}`);
            console.error("SyncReviews error overwriting:", ex);
          }
          break;
        default:
          break;
      }
    });
  }
  /** Adds HTML and CSS for dialog */
  function addDialog() {
    if (document.getElementById("syncReview_overlay") !== null) return;
    const hTMLDialog = `
      <div id="syncReview_overlay">
          <div id="syncReview_dialog">
          <div id="syncReview_loading">Loading...</div>
          <div id="syncReview_content" style="display: none;">
              <h3>Synchronizes Review Cache</h3>
              <div class="syncReview_container">
              <p>Total review count: <span id="syncReview_reviewCount">0</span></p>
              <p>Latest entry from: <span id="syncReview_latestDate">N/A</span></p>
              </div>
              <div class="syncReview_container">
              <label>Copy JSON to export:</label>
              <div class="textarea-button-wrapper">
                  <textarea role="exportText" readonly></textarea>
                  <div class="button-container">
                  <button class="syncReview_action" role="copy">Copy</button>
                  <button class="syncReview_action" role="download">Download</button>
                  </div>
              </div>
              </div>
              <div class="syncReview_container">
              <label>Insert JSON to import:</label>
              <div class="textarea-button-wrapper">
                  <textarea role="importText"></textarea>
                  <div class="button-container">
                  <button class="syncReview_action" role="paste">Paste</button>
                  <button class="syncReview_action" role="upload">Upload</button>
                  </div>
              </div>
              </div>
              <div id='syncReview_status'>Status: Ready!</div>
              <div class="action-buttons">
              <button class="syncReview_action" role="import">Import Reviews</button>
              <button class="syncReview_action" role="overwrite">Overwrite Reviews</button>
              <button class="syncReview_action" role="close">Close</button>
              </div>
              <input id='syncReviews_uploadFile' type="file" style='display:none'/>
          </div>
          </div>
      </div>
      `;
    document.body.insertAdjacentHTML('beforeend', hTMLDialog);

    const cSSDialog =
      `#syncReview_overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: none; justify-content: center; align-items: center; }
      #syncReview_dialog { background: white; border-radius: 8px; padding: 20px; width: 450px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
      #syncReview_dialog h3 { font-weight: bold;  text-align: center;  margin-bottom: 15px;  font-size: larger; }
      #syncReview_dialog p { margin: 10px 0; }
      #syncReview_dialog button:active{filter: brightness(80%);}
      .syncReview_container { margin-bottom: 20px; }
      .textarea-button-wrapper { display: flex; justify-content: space-between; }
      #syncReview_dialog textarea { width: 80%; height: 80px; margin: 10px 0; resize: none; }
      .button-container { display: flex; flex-direction: column; align-items: flex-start;margin:5px; }
      .syncReview_action { background-color: #4caf50; color: white; margin: 5px; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; width:100%}
      .syncReview_action[role="close"] { background-color: #f4b336; color: white; }
      .syncReview_action[role="overwrite"] { background-color: #f44336; color: white; }
      .syncReview_action[role="import"] { background-color: #2196f3; }
      .action-buttons { display: flex; justify-content: space-between; margin-top: 20px; }
      #syncReview_status{white-space: pre-wrap;  font-style: italic;}
      `;
    document.head.insertAdjacentHTML('beforeend', `<style>${cSSDialog}</style>`);
  }

  /** entrance point */
  function init() {
    if (typeof window.wkof === "undefined" || typeof window.review_cache === "undefined") {
      return; //check for framework and review_cache
      //@grant: none allows full access to "window" and its objects
    }
    if (document.getElementById("syncReview_overlay") === null) {
      addDialog(); //adds HTML/CSS for dialog
      addDialogEventHandlers(); //adds dialog click handlers
    }
    addMenu(); //adds menu entry
  }

  /** Wanikani uses dynamic pageloading. Only if menu is present (dashboard) will the script be called */
  const observer = new MutationObserver(() => {
    if (document.querySelector('li[data-controller="expandable-navigation"]')) {
      init();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
