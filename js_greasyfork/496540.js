// ==UserScript==
// @name             0xFFFE.Genfluence.Archivist (prod)
// @match            https://www.genfluence.ai/*
// @description      Add "Download All" and "Delete All" features to Genfluence.AI.
// @license          LGPL-3.0-or-later
// @version          1.9
// @namespace https://greasyfork.org/users/1309423
// @downloadURL https://update.greasyfork.org/scripts/496540/0xFFFEGenfluenceArchivist%20%28prod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496540/0xFFFEGenfluenceArchivist%20%28prod%29.meta.js
// ==/UserScript==

(function() {
  const PREFIX = "xga-";
  const BASE_URL = "https://www.genfluence.ai";
  const NAVBAR_ELEM_SELECTOR = ".drawer-content > .navbar";
  const CASH_ELEM_SELECTOR = ".drawer-content .text-xl";
  const MAIN_ELEM_SELECTOR = "main#skip";
  const TOGGLE_ELEM_ID = `${PREFIX}-settings-toggle`;
  const PANEL_ELEM_ID = `${PREFIX}-settings-panel`;
  const TOGGLE_ELEM_SELECTOR = "#" + TOGGLE_ELEM_ID;
  const SLEEP_TIME_SETUP = 1000;
  const SLEEP_TIME_IMAGE = 100;
  const SLEEP_TIME_PAGINATION = 500;

  let setupTimeout = 60;
  let navBarElem = null;
	let toggleButtonElem = null;
  let downloadButtonElem = null;
  let cashElem = null;
  let logsElem = null;
  let deleteButtonElem = null;
  let mainElem = null;
  let panelElem = null;
  let requestStop = false;

  async function sleep(duration) {
    await new Promise(r => setTimeout(r, duration));
  }

  async function deleteImage(imageId, retry) {
    if (!retry) {
      retry = 0;
    }
    if (retry > 2) {
      return null;
    }

    try {
      let result = await fetch(BASE_URL + "/api/images/delete_images", {
        "credentials": "include",
        "headers": {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0",
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
          "Content-Type": "application/json",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "Pragma": "no-cache",
          "Cache-Control": "no-cache"
        },
        "referrer": BASE_URL + "/create",
        "body": "{\"imageIds\":[\"" + imageId + "\"]}",
        "method": "POST",
        "mode": "cors"
      });
      return result;
    } catch (error) {
      await sleep(2000);
      return deleteImage(imageId, retry + 1);
    }
  }

  async function downloadImage(url, name) {
    let link = document.createElement("a");
    let blob = await fetch(url).then(r => r.blob());
    let file = new Blob([blob], {
      type: 'application/octet-stream'
    });
    link.href = URL.createObjectURL(file);
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function fetchImages(position, retry) {
    if (!retry) { retry = 0; }
    if (retry > 2) { return null; }

    let positionStart = position;
    let positionEnd = position + 19;
    try {
      let result = await fetch(BASE_URL + "/api/images/get_images", {
        "credentials": "include",
        "headers": {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0",
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
          "Content-Type": "application/json",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "Pragma": "no-cache",
          "Cache-Control": "no-cache"
        },
        "referrer": BASE_URL + "/create",
        "body": "{\"by\":\"history\",\"projectId\":\"\",\"from\":" + positionStart + ",\"to\":" + positionEnd + "}",
        "method": "POST",
        "mode": "cors"
      });
      if (result.ok) {
      	// If the response is successful, process the JSON
        return result.json();
      } else {
        console.error(`Received error: ${result.status}. Retrying...`);
        await sleep(3000); // Wait before retrying
        return fetchImages(position, retry + 1);
      }
    } catch (error) {
      await sleep(3000);
      return fetchImages(position, retry + 1);
    }
  }

  function toggleSettings() {
    if (panelElem.dataset.enabled === "true") {
      panelElem.dataset.enabled = "false";
      panelElem.classList.add("hidden");
      mainElem.classList.remove(`${PREFIX}-hidden`);
    } else {
      panelElem.dataset.enabled = "true";
      panelElem.classList.remove("hidden");
      mainElem.classList.add(`${PREFIX}-hidden`);
    }
  }

  async function cancelAction() {
    console.log("cancelAction-begin");
    requestStop = true;
    console.log("cancelAction-end");
  }

  async function runDelete() {
    console.log("runDelete-begin");

    let initRes = await fetchImages(0);
    let imagesTotal = initRes.totalRecords;
    let deleteButtonValueBackup = deleteButtonElem.value;

    requestStop = false;
    downloadButtonElem.classList.add("disabled");
    deleteButtonElem.value = "❌ Cancel delete";
    deleteButtonElem.removeEventListener('click', runDelete);
    deleteButtonElem.addEventListener('click', cancelAction);

    for (let offsetCur = 0; offsetCur < imagesTotal; offsetCur += 20) {
      let offsetRes = await fetchImages(0); //
      if (!offsetRes) { break; }
      if (!offsetRes.images) { break; }
      if (requestStop) { break; }

      await sleep(SLEEP_TIME_PAGINATION);
      for (let imageCur = 0; imageCur < 20; imageCur += 1) {
        let image = offsetRes.images[imageCur];
        if (!image) { continue; }
        if (requestStop) { break; }

        deleteImage(image.id);
        let pcent = Math.floor(10000 * (imageCur + offsetCur) / imagesTotal) / 100;
        logsElem.textContent = `🗑️ Deleting... (${pcent.toFixed(2)}%)`;
        await sleep(SLEEP_TIME_IMAGE);
      }
    }

    deleteButtonElem.value = deleteButtonValueBackup;
    logsElem.textContent = "";
    deleteButtonElem.removeEventListener('click', cancelAction);
    deleteButtonElem.addEventListener('click', runDelete);
    downloadButtonElem.classList.remove("disabled");

    console.log("runDelete-end");
  }


  async function runDownload() {
    console.log("runDownload-begin");
    let initRes = await fetchImages(0);
    let imagesTotal = initRes.totalRecords;
    let downloadButtonValueBackup = downloadButtonElem.value;

    requestStop = false;
    deleteButtonElem.classList.add("disabled");
    downloadButtonElem.value = "❌ Cancel download";
    downloadButtonElem.removeEventListener('click', runDownload);
    downloadButtonElem.addEventListener('click', cancelAction);

    for (let offsetCur = 0; offsetCur < imagesTotal; offsetCur += 20) {
      let offsetRes = await fetchImages(offsetCur); //
      if (!offsetRes) { break; }
      if (!offsetRes.images) { break; }
      if (requestStop) { break; }

      for (let imageCur = 0; imageCur < 20; imageCur += 1) {
        if (imageCur >= offsetRes.images.length) { break; }
        if (requestStop) { break; }

        let pcent = Math.floor(10000 * (imageCur + offsetCur) / imagesTotal) / 100;
        // let globalIndex = (imageCur + offsetCur);
        // console.log(`offset = ${globalIndex} / ${imagesTotal} (${pcent.toFixed(2)}%)`);

        let image = offsetRes.images[imageCur];
        if (!image) { continue; }
        let imageUrl = image.imgUrl;
        let imageTimestamp = image.createdAt.substring(0, 19).replace(/[:-]/g,"");
        let imageName = `anydream--${imageTimestamp}--${image.id}.${image.extention}`;

        downloadImage(imageUrl, imageName);
        logsElem.textContent = `💾 Downloading... (${pcent.toFixed(2)}%)`;
        await sleep(SLEEP_TIME_IMAGE);
      }

      await sleep(SLEEP_TIME_PAGINATION);
    }

    downloadButtonElem.value = downloadButtonValueBackup;
    logsElem.textContent = "";
    downloadButtonElem.removeEventListener('click', cancelAction);
    downloadButtonElem.addEventListener('click', runDownload);
    mainElem.classList.remove("hidden");
    deleteButtonElem.classList.remove("disabled");

    console.log("runDownload-end");
  }

  function setup() {
    console.log("setup-begin");

    let bodyElem = document.querySelector("body");
    navBarElem = document.querySelector(NAVBAR_ELEM_SELECTOR);
    mainElem = document.querySelector(MAIN_ELEM_SELECTOR);
    cashElem = document.querySelector(CASH_ELEM_SELECTOR);
    console.log(navBarElem);
    console.log(mainElem);
    console.log(cashElem);

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      body {
        position: relative;
      }
      ${MAIN_ELEM_SELECTOR} {
      	transition: all 0.25s ease-in-out;
        pointer-events: auto;
        opacity: 100%;
      }
      ${MAIN_ELEM_SELECTOR}.${PREFIX}-hidden {
        pointer-events: none;
        opacity: 25%;
      }
      #${PANEL_ELEM_ID} {
        box-shadow: 0px 0px 50px rgb(20,184,166,0.5);
        position: fixed;
        top: 50vh;
        left: 50vw;
        background-color: #0f172a;
        transform: translate(-50%,-50%);
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: stretch;
        gap: 1em;
        padding: 60px 30px 30px 30px;
        transition: all 0.25s ease-in-out;
        border: 2px solid #fdd888;
        opacity: 1;
        z-index: 100;
        width: min(80vw, 400px);
      }
      #${PANEL_ELEM_ID}.hidden {
        opacity: 0;
        top: -50vh;
      }
      #${PANEL_ELEM_ID} > .button-close {
        position: absolute;
        top: 10px;
        right: 10px;
      }
      #${PANEL_ELEM_ID} > .button.disabled {
        pointer-events: none;
        opacity: 25%;
      }
      #${PANEL_ELEM_ID} > .logs {
        display: block;
        background-color: rgb(55 65 81/var(--tw-bg-opacity));
        flex-basis: 50px;
        padding: 5px;
      }
      #${PANEL_ELEM_ID} > .button-download {
        border: 2px solid #14B8A6;
        background-color: #333;
        border-radius: 5px;
        padding: 0.25em 1em;
        margin-right: 0.5em;
        width: 100%;
      }
      #${PANEL_ELEM_ID} > .button-delete {
        border: 2px solid darkred;
        background-color: #333;
        border-radius: 5px;
        padding: 0.25em 1em;
        width: 100%;
      }
      #${PANEL_ELEM_ID} h2 {
        font-size: 120%;
        color: #fdd888;
      }
      #${TOGGLE_ELEM_ID} {
        margin-right: 0.5em;
        outline: 0px;
        box-shadow: none;
      }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);

    toggleButtonElem = document.createElement('input');
    toggleButtonElem.id = TOGGLE_ELEM_ID;
    toggleButtonElem.type = "button";
    toggleButtonElem.value = "🛠️";
    toggleButtonElem.addEventListener('click', toggleSettings);

    panelElem = document.createElement('div');
    panelElem.id = PANEL_ELEM_ID;
    panelElem.dataset.enabled = "false";
    panelElem.classList.add("hidden");

    let panelTitle = document.createElement("h2");
    panelTitle.textContent = "Genfluence Archivist";
    panelElem.appendChild(panelTitle);

    let panelCloseElem = document.createElement('input');
    panelCloseElem.classList.add("button-close");
    panelCloseElem.type = "button";
    panelCloseElem.value = "[Close]";
    panelCloseElem.addEventListener('click', toggleSettings);
	  panelElem.appendChild(panelCloseElem);

    logsElem = document.createElement('div');
    logsElem.classList.add("logs");
    logsElem.dataset.enabled = "false";
    panelElem.appendChild(logsElem);

    downloadButtonElem = document.createElement('input');
    downloadButtonElem.classList.add("button", "button-download");
    downloadButtonElem.type = "button";
    downloadButtonElem.value = "💾 Download all";
    downloadButtonElem.addEventListener('click', runDownload);
    panelElem.appendChild(downloadButtonElem);

    deleteButtonElem = document.createElement('input');
    deleteButtonElem.classList.add("button", "button-delete");
    deleteButtonElem.type = "button";
    deleteButtonElem.value = "🗑️ Delete all";
    deleteButtonElem.addEventListener('click', runDelete);
    panelElem.appendChild(deleteButtonElem);

    bodyElem.appendChild(panelElem);

    cashElem.parentNode.parentNode.insertBefore(toggleButtonElem, cashElem.parentNode);
    console.log("setup-end");
  }

  function trySetup() {
    console.log("trysetup-begin " + setupTimeout);
    navBarElem = document.querySelector(NAVBAR_ELEM_SELECTOR);
    toggleButtonElem = document.querySelector(TOGGLE_ELEM_SELECTOR);
    if (navBarElem && !toggleButtonElem) {
      setup();
    } else if (setupTimeout > 0) {
      setupTimeout = setupTimeout - 1;
      setTimeout(trySetup, SLEEP_TIME_SETUP);
    }
    console.log("trysetup-end");
  }
  setTimeout(trySetup, SLEEP_TIME_SETUP);
}());