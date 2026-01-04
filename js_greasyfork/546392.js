// ==UserScript==
// @name         Wplace chunk downloader
// @namespace    http://tampermonkey.net/
// @version      2.5.0
// @description  Easily download chunk images from wplace.live using multi-point selection and highlighting
// @author       NotNotWaldo
// @match        https://wplace.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wplace.live
// @license      MIT
// @compatible    tampermonkey
// @compatible    violentmonkey
// @incompatible  greasemonkey
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546392/Wplace%20chunk%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/546392/Wplace%20chunk%20downloader.meta.js
// ==/UserScript==

// Code below, feel free to read in horror

(() => {
  // Global vals because I'm way too lazy
  // These variables are for handling the highlighting feature
  let isHightlightOn = false;
  let downloadingState = false; // the downloading state ensures that the highlight wont be also printed when downloading the images of chunk
  let highlightedChunksLinksArr = []; // array for the highlighted chunks

  // the coords of chunks that are selected by the points you've set
  let mlChunkCoords = {
    firstChunk: { x: null, y: null },
    secondChunk: { x: null, y: null },
  };
  let mlPixelCoords = {
    firstPixel: { x: null, y: null },
    secondPixel: { x: null, y: null },
  };

  // variables for the currently selected chunks
  let chunkX = null;
  let chunkY = null;
  let pixelX = null;
  let pixelY = null;
  let chunkUrl = null;

  // for the dragging mechanic
  let isPointing = false;

  // just a template for chunk img
  const chunkTemplateUrl = `https://backend.wplace.live/files/s0/tiles/`;

  // for the amount of downloading instances
  let concurrentDlInstances = 3; // yea, dont modify this tho

  // you can modify this here if you want to increase the max instances
  let maxDlInstances = 30; // dont go lower than 1. Honestly, why would you?

  // variables for the download bar
  let currImgsDownloaded = null;
  let totalImgsToBeDownloaded = null;

  // for preset deletion confirmation
  let dontAskPresetDelete = false;

  // for lazily waiting for something
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // for getting and setting persistent values
  let getGMValue = (key, def) => {
    try {
      if (typeof GM !== "undefined" && typeof GM.getValue === "function")
        return GM.getValue(key, def);

      if (typeof GM_getValue === "function")
        return Promise.resolve(GM_getValue(key, def));
    } catch {}

    // Fallback: localStorage
    try {
      let val = localStorage.getItem("gm_" + key);
      return Promise.resolve(val !== null ? JSON.parse(val) : def);
    } catch {
      return Promise.resolve(def);
    }
  };

  let setGMValue = (key, value) => {
    try {
      if (typeof GM !== "undefined" && typeof GM.setValue === "function")
        return GM.setValue(key, value);

      if (typeof GM_setValue === "function")
        return Promise.resolve(GM_setValue(key, value));
    } catch {}

    // Fallback: localStorage
    try {
      localStorage.setItem("gm_" + key, JSON.stringify(value));
    } catch {}
    return Promise.resolve();
  };

  let savedConfigs = {};
  let initConfig = async () => {
    savedConfigs = {
      concurrentDlInstances,
      dontAskPresetDelete,
      ...((await getGMValue("savedConfigs")) || {}),
    };

    if (Object.keys(savedConfigs).length === 0) {
      savedConfigs.concurrentDlInstances = concurrentDlInstances;
      savedConfigs.dontAskPresetDelete = dontAskPresetDelete;

      setGMValue("savedConfigs", savedConfigs);
    } else {
      ({ concurrentDlInstances, dontAskPresetDelete } = savedConfigs);
    }

    let instanceInfo = miscSection.querySelector(".instanceInfo");
    instanceInfo.textContent = `Download instances: ${concurrentDlInstances}`;
  };

  initConfig();

  let multipleChunksDownloaderElem = document.createElement("div");
  multipleChunksDownloaderElem.className = "mulChunksDownloader";

  multipleChunksDownloaderElem.innerHTML = `
  <div class="chunk-downloader">

    <!-- Multiple Chunk Downloader -->

    <div class="mainHead section-header">
      <span>Wplace Chunks Downloader</span>
      <button class="simple-btn">–</button>
    </div>

    <div class="mainCollapsible expanded">

      <div class="infoSection section">
        <div class="section-header coords">
          <span class="chunkSelectedInfo">Chunk selected: X: null, Y: null</span>
        </div>
        <div class="btn-row">
            <button class="downloadChunkBtn btn btn-primary">Download Chunk</button>
            <button class="viewChunkBtn btn">View Chunk Image</button>
          </div>
      </div>

      <div class="mulChunkSection section">
        <div class="section-header">
          <span>Multiple Chunks Downloader</span>
          <button class="simple-btn">+</button>
        </div>

        <div class="mulChunksSectionsCon collapsible collapsed">
          <div class="section">
            <div class="chunksInfo">
              <div class="coords">
                <span>1st X: null, Y: null</span>
                <span>2nd X: null, Y: null</span>
              </div>
              
              <div>
                <span class="chunkAmountText">Current amount of chunks: 0</span>
              </div>
            </div>
  
            <div class="btn-row">
              <button class="firstPointBtn btn btn-primary">Set 1st Point</button>
              <button class="secPointBtn btn btn-primary">Set 2nd Point</button>
            </div>
  
            <div class="btn-row">
              <button class="downloadBtn btn btn-primary">Download Chunks</button>
              <button class="removePointBtn btn">Remove Points</button>
            </div>
          </div>

          <div class="regionDownloadSection section">
            <div class="section-header">
              <span>Pixel Region Downloader</span>
              <button class="simple-btn">+</button>
            </div>

            <div class="collapsible collapsed">
              <div class="pixelCoords">
                <span>1st X: null, Y: null</span>
                <span>2nd X: null, Y: null</span>
              </div>
                <div class="btn-col">
                  <button class="downloadRegionBtn btn btn-primary">Download Region</button>
                </div>
            </div>
          </div>

          <div class="miscSection section">
            <div class="section-header">
              <span>Misc</span>
              <button class="simple-btn">+</button>
            </div>
            
            <div class="collapsible collapsed">
              <div class="multipleInstance">
                <span class="instanceInfo">Download instances: ${concurrentDlInstances}</span>
                <div class="instanceIncDecBtns">
                  <button class="instanceInc simple-btn">+</button>
                  <button class="instanceDec simple-btn">–</button>
                </div>
              </div>

              <div class="btn-col">
                <button class="highlightBtn btn">Highlight Chunks</button>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div class="savesSection section">
            <div class="section-header">
              <span>Presets</span>
              <button class="simple-btn">+</button>
            </div>          

            <div class="collapsible collapsed">
              <div class="saveCurrPreset">
                <input class="presetNameInput input-box" type="text" name="coordsName" placeholder="Preset name"></input>
                <div class="btn-col">
                  <button class="savePresetBtn btn-primary btn">Save Current Points as Preset</button>
                </div>
              </div>

              <div class="savedPresets">
              </div>
            </div>
          </div>

      <!-- Manual Chunk Download -->
      <div class="manualChunkSection section">
        <div class="section-header">
          <span>Manual Chunk Downloader</span>
          <button class="simple-btn">+</button>
        </div>

        <div class="collapsible collapsed">
          <input class="coordsInput input-box" type="text" name="chunksCoords" placeholder="firstX, firstY, secX, secY, safety">
          </input>

          <div class="btn-row" style="grid-template-columns: 1fr;">
            <button class="manualDownloadBtn btn btn-primary">Download</button>
          </div>
        </div>
      </div>

      <div class="downloadBarCon">
        <div class="download-bar">
          <div class="download-progress"></div>
          <span class="download-text">0 / 0</span>
        </div>
      </div>
    </div>
  </div>
`;

  let style = document.createElement("style");
  style.textContent = `
/* ================================
   Container & Layout
================================ */
.mulChunksDownloader {
  position: fixed;
  bottom: 12px;
  left: 12px;
  top: auto;
  z-index: 49;
}

.mulChunksDownloader .chunk-downloader {
  width: 360px;
  padding: 16px;
  font-family: sans-serif;
  font-size: 14px;
  color: #111827;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* ================================
   Sections
================================ */
.mulChunksDownloader .section {
  margin-bottom: 16px;
}

.mulChunksDownloader .mainHead {
  margin: 0;
  cursor: move;
}

.mulChunksDownloader .infoSection {
  margin-top: 16px;
}

.mulChunksDownloader .mulChunkSection .mulChunksSectionsCon {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.mulChunksDownloader .mulChunkSection .mulChunksSectionsCon .section {
  margin: 0;
}

/* ================================
   Headers
================================ */
.mulChunksDownloader .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
  font-weight: 600;
}

.mulChunksDownloader .savesSection .preset-header {
  padding: 10px 7px;
  font-weight: 600;
  cursor: pointer;
}

/* ================================
   Collapsibles
================================ */
.mulChunksDownloader .mainCollapsible,
.mulChunksDownloader .collapsible {
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.mulChunksDownloader .mainCollapsible.collapsed,
.mulChunksDownloader .collapsible.collapsed {
  max-height: 0;
}

.mulChunksDownloader .mainCollapsible.expanded {
  max-height: 2000px; /* large enough to fit all content */
}
.mulChunksDownloader .collapsible.expanded {
  max-height: 1000px;
}

/* ================================
   Text & Info
================================ */
.mulChunksDownloader .coords {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.mulChunksDownloader .pixelCoords {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  font-size: 14px;
  border-radius: 9999px;
  background: #f3f4f6;
  margin-top: 10px;
}

.mulChunksDownloader .chunksInfo {
  margin: 5px 0;
  padding: 6px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  background: #e8e8e9;
}

.mulChunksDownloader .chunkAmountText {
  font-weight: 600;
}

/* ================================
   Buttons
================================ */
.mulChunksDownloader .btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  background: #f3f4f6;
  color: #374151;
  font-size: 13px;
  text-align: center;
  cursor: pointer;
}
.mulChunksDownloader .btn:hover {
  background: #e5e7eb;
}

.mulChunksDownloader .btn-primary {
  background: #2563eb;
  border: none;
  color: #fff;
}
.mulChunksDownloader .btn-primary:hover {
  background: #1d4ed8;
}

 .simple-btn {
  width: 24px;
  height: 24px;
  font-size: 14px;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
}
.simple-btn:hover {
  background: #e5e7eb;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.mulChunksDownloader .del-btn {
  background: #fff;
  border: 2px solid #eb2525;
  color: #eb2525;
}
.mulChunksDownloader .del-btn:hover {
  background: #c02828;
  color: #fff;
}

.mulChunksDownloader button:disabled {
  background-color: #4b5563;
  color: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

/* ================================
   Button Layout
================================ */
.mulChunksDownloader .btn-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}

.mulChunksDownloader .btn-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

/* ================================
   Inputs
================================ */
.mulChunksDownloader .input-box {
  width: 100%;
  padding: 6px 12px;
  margin-top: 8px;
  font-size: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  background: #f3f4f6;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
}
.mulChunksDownloader .input-box:focus {
  border-color: #2563eb;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

/* ================================
   Presets
================================ */
.mulChunksDownloader .savesSection .preset {
  border-radius: 5px;
  transition: 0.2s ease;
}
.mulChunksDownloader .savesSection .preset:hover {
  background: #eeeff1;
}

.mulChunksDownloader .savesSection .savedPresets {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
}

.mulChunksDownloader .savesSection .preset .preset-header {
  border-bottom: 1px solid #d1d5db;
  display: flex;
  justify-content: space-between;
}

.mulChunksDownloader .savesSection .preset .preset-info {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mulChunksDownloader .savesSection .preset .point-info {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.mulChunksDownloader .savesSection .preset .point-num {
  font-weight: 600;
}

.mulChunksDownloader .savedPresets {
  max-height: 200px;    
  overflow-y: auto;     
  padding-right: 4px;   
}

/* Optional: style the scrollbar for better look */
.mulChunksDownloader .savedPresets::-webkit-scrollbar {
  width: 6px;
}
.mulChunksDownloader .savedPresets::-webkit-scrollbar-thumb {
  background: #9ca3af;   /* gray thumb */
  border-radius: 3px;
}
.mulChunksDownloader .savedPresets::-webkit-scrollbar-thumb:hover {
  background: #6b7280;   /* darker on hover */
}
.mulChunksDownloader .savedPresets::-webkit-scrollbar-track {
  background: transparent;
}

/* ================================
   Download Bar
================================ */
.mulChunksDownloader .download-bar {
  position: relative;
  width: 100%;
  height: 24px;
  margin-top: 10px;
  background-color: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.mulChunksDownloader .download-progress {
  width: 0%;
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
}

.mulChunksDownloader .download-text {
  position: absolute;
  top: 0;
  left: 50%;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  line-height: 24px;
  transform: translateX(-50%);
}

/* ================================
   Misc Section
================================ */
.mulChunksDownloader .multipleInstance {
  margin-top: 10px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.mulChunksDownloader .instanceIncDecBtns {
  display: flex;
  gap: 10px;
}

/* ================================
   Preset Deletion Section
================================ */
.preset-delete-modal .simple-btn {
  width: auto;
  padding: 5px 7px;
}

.preset-delete-modal .del-btn
{
  background: #fff;
  border: 2px solid #eb2525;
  color: #eb2525;
}

.preset-delete-modal .del-btn:hover {
  background: #c02828;
  color: #fff;
}

`;
  document.head.appendChild(style);
  document.body.appendChild(multipleChunksDownloaderElem);

  // === COLLAPSING MECHANISM SECTION ===

  let collapseSection = (btn, target) => {
    let isCollapsed = btn.dataset.collapsed === "true";

    if (!isCollapsed) {
      target.classList.remove("expanded");
      target.classList.add("collapsed");
      btn.dataset.collapsed = "true";
      btn.textContent = "+";
    } else {
      target.classList.remove("collapsed");
      target.classList.add("expanded");
      btn.dataset.collapsed = "false";
      btn.textContent = "–";
    }
  };

  // Main collapse
  let mainHead = multipleChunksDownloaderElem.querySelector(".mainHead");
  const mainCollapsible =
    multipleChunksDownloaderElem.querySelector(".mainCollapsible");
  const mainCollapseBtn = multipleChunksDownloaderElem.querySelector(
    ".mainHead .simple-btn"
  );
  mainCollapseBtn.dataset.collapsed = "false";

  mainCollapseBtn.addEventListener("click", () => {
    collapseSection(mainCollapseBtn, mainCollapsible);
  });

  // Multiple Chunks Section collapse
  let mulChunkSection =
    multipleChunksDownloaderElem.querySelector(".mulChunkSection");
  let mulChunkCollapseBtn = mulChunkSection.querySelector(".simple-btn");
  let mulChunkCollapsible = mulChunkSection.querySelector(".collapsible");
  mulChunkCollapseBtn.dataset.collapsed = "true";

  mulChunkCollapseBtn.addEventListener("click", () => {
    collapseSection(mulChunkCollapseBtn, mulChunkCollapsible);
  });

  // Misc section collapse
  let miscSection = mulChunkSection.querySelector(".miscSection");
  let miscCollapseBtn = miscSection.querySelector(".simple-btn");
  let miscCollapsible = miscSection.querySelector(".collapsible");
  miscCollapseBtn.dataset.collapsed = "true";

  miscCollapseBtn.addEventListener("click", () => {
    collapseSection(miscCollapseBtn, miscCollapsible);
  });

  // Manual Chunks Section collapse
  let manualChunkSection = multipleChunksDownloaderElem.querySelector(
    ".manualChunkSection"
  );
  let manualCollapseBtn = manualChunkSection.querySelector(".simple-btn");
  let manualCollapsible = manualChunkSection.querySelector(".collapsible");
  manualCollapseBtn.dataset.collapsed = "true"; // starts collapsed

  manualCollapseBtn.addEventListener("click", () => {
    collapseSection(manualCollapseBtn, manualCollapsible);
  });

  let regionDownloadSection = mulChunkSection.querySelector(
    ".regionDownloadSection"
  );
  let rgDlSectionCollapseBtn =
    regionDownloadSection.querySelector(".simple-btn");
  let rgDlSectionCollapsible =
    regionDownloadSection.querySelector(".collapsible");
  rgDlSectionCollapseBtn.dataset.collapsed = "true";

  rgDlSectionCollapseBtn.addEventListener("click", () => {
    collapseSection(rgDlSectionCollapseBtn, rgDlSectionCollapsible);
  });

  let savesSection =
    multipleChunksDownloaderElem.querySelector(".savesSection");
  let savesSectionCollapsible = savesSection.querySelector(".collapsible");
  let savesSectionCollapseBtn = savesSection.querySelector(".simple-btn");
  savesSectionCollapseBtn.dataset.collapsed = "true";

  savesSectionCollapseBtn.addEventListener("click", () => {
    collapseSection(savesSectionCollapseBtn, savesSectionCollapsible);
  });

  // === COLLAPSING MECHANISM SECTION END ===

  // for collapsing preset infos

  let collapsePreset = (header, target) => {
    let isCollapsed = header.dataset.collapsed === "true";

    if (!isCollapsed) {
      target.classList.remove("expanded");
      target.classList.add("collapsed");
      header.dataset.collapsed = "true";
    } else {
      target.classList.remove("collapsed");
      target.classList.add("expanded");
      header.dataset.collapsed = "false";
    }
  };

  let savedPresetsCon = savesSection.querySelector(".savedPresets");
  let presetIds = new Set();
  let savedPresets = {};

  // for creating preset element
  let createPresetElem = (presetId, pointsData, onDelete) => {
    let { firstPoint, secondPoint, name } = pointsData;
    if (!firstPoint || !secondPoint) return null;

    let preset = document.createElement("div");
    preset.className = "preset";
    preset.dataset.presetID = presetId;

    let presetHeader = document.createElement("div");
    presetHeader.className = "preset-header";
    presetHeader.dataset.collapsed = "true";

    let title = document.createElement("span");
    title.textContent = name;

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "deletePresetBtn simple-btn del-btn";
    deleteBtn.textContent = "X";

    presetHeader.append(title, deleteBtn);

    let presetCollapsible = document.createElement("div");
    presetCollapsible.className = "collapsible collapsed";

    let info = document.createElement("div");
    info.className = "preset-info";
    info.innerHTML = `
    <div>
      <span class="point-num">First point</span>
      <div class="point-info">
        <span>Chunk: ${firstPoint.chunk.x}, ${firstPoint.chunk.y}</span>
        <span>Pixel: ${firstPoint.pixel.x}, ${firstPoint.pixel.y}</span>
      </div>
    </div>
    <div>
      <span class="point-num">Second point</span>
      <div class="point-info">
        <span>Chunk: ${secondPoint.chunk.x}, ${secondPoint.chunk.y}</span>
        <span>Pixel: ${secondPoint.pixel.x}, ${secondPoint.pixel.y}</span>
      </div>
    </div>
  `;

    let presetBtnsCon = document.createElement("div");
    presetBtnsCon.className =
      firstPoint.pixel.x == null || secondPoint.pixel.x == null
        ? "preset-btns btn-col"
        : "preset-btns btn-row";

    let presetDlChunksBtn = document.createElement("button");
    presetDlChunksBtn.type = "button";
    presetDlChunksBtn.className = "presetDlChunksBtn dlBtn btn-primary btn";
    presetDlChunksBtn.textContent = "Download Chunks";

    presetBtnsCon.appendChild(presetDlChunksBtn);

    if (presetBtnsCon.classList.contains("btn-row")) {
      let presetDlRegionBtn = document.createElement("button");
      presetDlRegionBtn.type = "button";
      presetDlRegionBtn.className = "presetDlRegionBtn dlBtn btn-primary btn";
      presetDlRegionBtn.textContent = "Download Region";

      presetBtnsCon.appendChild(presetDlRegionBtn);

      presetDlRegionBtn.addEventListener("click", () => {
        regionDl?.(
          { firstChunk: firstPoint.chunk, secondChunk: secondPoint.chunk },
          { firstPixel: firstPoint.pixel, secondPixel: secondPoint.pixel },
          false,
          name
        );
      });
    }

    presetCollapsible.append(info, presetBtnsCon);
    preset.append(presetHeader, presetCollapsible);

    presetHeader.addEventListener("click", () => {
      collapsePreset(presetHeader, presetCollapsible);
    });

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      onDelete?.(presetId, preset);
    });

    presetDlChunksBtn.addEventListener("click", () => {
      multipleChunksDlUrl?.(
        { firstChunk: firstPoint.chunk, secondChunk: secondPoint.chunk },
        false,
        name
      );
    });

    return preset;
  };

  // For initalizing presets
  let initPresets = async () => {
    savedPresets = (await getGMValue("savedPresets")) || {};
    presetIds = new Set(Object.keys(savedPresets));

    Object.entries(savedPresets).forEach(([id, data]) => {
      let presetElem = createPresetElem(id, data, deletePreset);
      savedPresetsCon.appendChild(presetElem);
    });
  };

  initPresets();

  // For deleting preset

  function showDeleteConfirm(onConfirm) {
    // If user disabled confirmation, just run it
    if (dontAskPresetDelete) {
      onConfirm();
      return;
    }

    // Creates a modal container
    const modal = document.createElement("div");
    modal.className = "preset-delete-modal";
    modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex; justify-content: center; align-items: center;
    z-index: 9999;
  `;

    // Inner box
    const box = document.createElement("div");
    box.style.cssText = `
    background: #fff; padding: 16px; border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    min-width: 300px;
    text-align: center;
  `;
    box.innerHTML = `
    <p>Are you sure you want to delete this preset?</p>
    <label style="display:flex;align-items:center;justify-content:center;margin:8px 0;gap:6px;">
      <input type="checkbox" id="dontAskCheckbox">
      <span>Don’t ask again</span>
    </label>
    <div style="margin-top:12px; display:flex; gap:10px; justify-content:center;">
      <button id="confirmDeleteBtn" class="simple-btn del-btn">Delete</button>
      <button id="cancelDeleteBtn" class="simple-btn">Cancel</button>
    </div>
  `;

    modal.appendChild(box);
    document.body.appendChild(modal);

    // Handlers
    box.querySelector("#confirmDeleteBtn").onclick = () => {
      const dontAsk = box.querySelector("#dontAskCheckbox").checked;
      if (dontAsk) dontAskPresetDelete = true;
      onConfirm();
      modal.remove();
    };

    box.querySelector("#cancelDeleteBtn").onclick = () => modal.remove();
  }

  let deletePreset = (presetId, elem) => {
    showDeleteConfirm(() => {
      savedConfigs.dontAskPresetDelete = dontAskPresetDelete;
      setGMValue("savedConfigs", savedConfigs);
      delete savedPresets[presetId];
      presetIds.delete(presetId);
      elem.remove();
      setGMValue("savedPresets", savedPresets);
    });
  };

  function generateId(length = 8) {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id;
    do {
      id = Array.from(
        { length },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join("");
    } while (presetIds.has(id)); // regenerate if duplicate

    presetIds.add(id);
    return id;
  }

  function createBlankPreset(name = "Untitled Preset") {
    return {
      name,
      firstPoint: {
        chunk: { x: null, y: null },
        pixel: { x: null, y: null },
      },
      secondPoint: {
        chunk: { x: null, y: null },
        pixel: { x: null, y: null },
      },
    };
  }

  // for the dragging mechanism
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  mainHead.addEventListener("mousedown", (e) => {
    isDragging = true;

    // Calculates click offset inside the box
    const rect = multipleChunksDownloaderElem.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Prevent accidental text selection
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    multipleChunksDownloaderElem.style.top = `${e.clientY - offsetY}px`;
    multipleChunksDownloaderElem.style.left = `${e.clientX - offsetX}px`;
    multipleChunksDownloaderElem.style.bottom = "auto"; // stop sticking to bottom
    multipleChunksDownloaderElem.style.right = "auto"; // stop sticking to left
    multipleChunksDownloaderElem.style.position = "fixed";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // for displaying info about points and currently selected chunk
  let infoSection = multipleChunksDownloaderElem.querySelector(".infoSection");

  let downloadChunkBtn = infoSection.querySelector(".downloadChunkBtn");

  downloadChunkBtn.addEventListener("click", async () => {
    if (chunkX == null) return;
    multipleChunksDlUrl({
      firstChunk: { x: chunkX, y: chunkY },
      secondChunk: { x: chunkX, y: chunkY },
    });
  });

  let viewChunkBtn = infoSection.querySelector(".viewChunkBtn");
  viewChunkBtn.addEventListener("click", (event) => {
    if (chunkX == null) return;
    window.open(chunkUrl, "_blank");
  });

  // to update the infos displayed
  const refreshSetPointsInfo = () => {
    let coordsCon = mulChunkSection.querySelector(".coords");
    let currentCoords = infoSection.querySelector("span");
    currentCoords.textContent = `Chunk selected: X: ${chunkX}, Y: ${chunkY}`;
    let infoChildren = coordsCon.querySelectorAll("span");
    infoChildren[0].textContent = `1st X: ${mlChunkCoords.firstChunk.x}, Y: ${mlChunkCoords.firstChunk.y}`;
    infoChildren[1].textContent = `2nd X: ${mlChunkCoords.secondChunk.x}, Y: ${mlChunkCoords.secondChunk.y}`;

    let chunkAmountText = mulChunkSection.querySelector(".chunkAmountText");
    let currentChunkAmount = getAmountOfChunksSelected(mlChunkCoords);
    chunkAmountText.textContent = `Current amount of chunks: ${currentChunkAmount}`;

    let pixelCoordsCon = regionDownloadSection.querySelector(".pixelCoords");
    let pixelinfoChildren = pixelCoordsCon.querySelectorAll("span");
    pixelinfoChildren[0].textContent = `1st X: ${mlPixelCoords.firstPixel.x}, Y: ${mlPixelCoords.firstPixel.y}`;
    pixelinfoChildren[1].textContent = `2nd X: ${mlPixelCoords.secondPixel.x}, Y: ${mlPixelCoords.secondPixel.y}`;
  };

  let getAmountOfChunksSelected = (chunkCoords) => {
    if (chunkCoords.firstChunk.x == null && chunkCoords.secondChunk.x == null)
      return 0;

    if (chunkCoords.secondChunk.x == null || chunkCoords.firstChunk.x == null)
      return 1;

    let organizedChunkCoords = mlCoordsOrganizer(chunkCoords);

    let topLeft = organizedChunkCoords.firstChunk;
    let botRight = organizedChunkCoords.secondChunk;

    let width = 1 + botRight.x - topLeft.x;
    let height = 1 + botRight.y - topLeft.y;

    return width * height;
  };

  // for the multiple chunk downloader elems/buttons

  let firstPointBtn = mulChunkSection.querySelector(".firstPointBtn");
  let secPointBtn = mulChunkSection.querySelector(".secPointBtn");

  firstPointBtn.addEventListener("click", async (e) => {
    await setPoint("first");
  });

  secPointBtn.addEventListener("click", async (e) => {
    await setPoint("sec");
  });

  let setPoint = async (position) => {
    if (chunkX == null) return;
    if (position == "first") {
      mlChunkCoords.firstChunk = { x: chunkX, y: chunkY };
      mlPixelCoords.firstPixel = { x: pixelX, y: pixelY };
    } else if (position == "sec") {
      mlChunkCoords.secondChunk = { x: chunkX, y: chunkY };
      mlPixelCoords.secondPixel = { x: pixelX, y: pixelY };
    }

    if (isHightlightOn) {
      highlightedChunksLinksArr.length = 0;
      let organizedCoords = await mlCoordsOrganizer(mlChunkCoords);
      highlightedChunksLinksArr.push(
        ...getLinksFromChunkCoords(organizedCoords)
      );
    }

    refreshSetPointsInfo();
    updateButtons();
  };

  let removePointsBtn = mulChunkSection.querySelector(".removePointBtn");
  removePointsBtn.addEventListener("click", async () => {
    mlChunkCoords = {
      firstChunk: { x: null, y: null },
      secondChunk: { x: null, y: null },
    };
    mlPixelCoords = {
      firstPixel: { x: null, y: null },
      secondPixel: { x: null, y: null },
    };

    highlightedChunksLinksArr.length = 0;
    isHightlightOn = false;
    let highlightBtn = mulChunkSection.querySelector(".highlightBtn");
    highlightBtn.textContent = "Highlight chunks";

    refreshSetPointsInfo();
    updateButtons();
  });

  // for saving coords - section
  let presetNameInput = savesSection.querySelector(".presetNameInput");
  const invalidChars = /[\\\/:*?"<>|]/g;
  const maxLength = 40;
  presetNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.repeat) {
      addPreset();
    }
  });

  // block typing
  presetNameInput.addEventListener("keypress", (e) => {
    if (invalidChars.test(e.key)) e.preventDefault();
  });

  // sanitize pasted text
  presetNameInput.addEventListener("input", () => {
    presetNameInput.value = presetNameInput.value.replace(invalidChars, "");
    if (presetNameInput.value.length > maxLength) {
      presetNameInput.value = presetNameInput.value.substring(0, maxLength);
    }
  });

  let savePresetBtn = savesSection.querySelector(".savePresetBtn");
  savePresetBtn.addEventListener("click", () => {
    addPreset();
  });

  let createPreset = async () => {
    let presetName = presetNameInput.value.trim() || "Untitled Preset";
    let tempPreset = createBlankPreset(presetName);
    let presetID = generateId(); // unique random ID

    console.log("testing here");
    // fill in values
    tempPreset.firstPoint.chunk = { ...mlChunkCoords.firstChunk };
    tempPreset.secondPoint.chunk = { ...mlChunkCoords.secondChunk };
    tempPreset.firstPoint.pixel = { ...mlPixelCoords.firstPixel };
    tempPreset.secondPoint.pixel = { ...mlPixelCoords.secondPixel };

    savedPresets[presetID] = structuredClone(tempPreset);

    await setGMValue("savedPresets", savedPresets);

    return { id: presetID, ...tempPreset };
  };

  let addPreset = async () => {
    if (
      mlChunkCoords.firstChunk.x == null &&
      mlChunkCoords.secondChunk.x == null
    )
      return;

    if (presetIds.size >= 50) {
      console.warn("Maximum number of presets (50) reached");
      alert("You can only save up to 50 presets.");
      return;
    }
    let newPreset = await createPreset();
    let newPresetElem = await createPresetElem(
      newPreset.id,
      newPreset,
      deletePreset
    );
    savedPresetsCon.appendChild(newPresetElem);
  };

  let highlightBtn = miscSection.querySelector(".highlightBtn");
  highlightBtn.addEventListener("click", async () => {
    console.log("Trying to hightlight chunks");
    if (mlChunkCoords.firstChunk.x == null && mlChunkCoords.secondChunk.x)
      return;
    if (!isHightlightOn) {
      let organizedCoords = await mlCoordsOrganizer(mlChunkCoords);
      console.log(Object.keys(organizedCoords));
      highlightedChunksLinksArr.push(
        ...getLinksFromChunkCoords(organizedCoords)
      );
      console.log(`Turned on hightlight`);
      isHightlightOn = !isHightlightOn;
      highlightBtn.textContent = "Unhighlight chunks";
    } else {
      highlightedChunksLinksArr.length = 0;
      console.log(`Turned off highlight`);
      isHightlightOn = !isHightlightOn;
      highlightBtn.textContent = "Highlight chunks";
    }
  });

  let downloadBtn = mulChunkSection.querySelector(".downloadBtn");
  downloadBtn.addEventListener("click", async () => {
    if (
      mlChunkCoords.firstChunk.x == null &&
      mlChunkCoords.secondChunk.x == null
    ) {
      return;
    }

    multipleChunksDlUrl(mlChunkCoords, false);
  });

  // for the region download elems/buttons
  let downloadRegionBtn =
    regionDownloadSection.querySelector(".downloadRegionBtn");
  downloadRegionBtn.addEventListener("click", (event) => {
    console.log("Clicked region download");
    if (
      downloadingState ||
      mlPixelCoords.firstPixel.x == null ||
      mlPixelCoords.secondPixel.x == null
    )
      return;
    regionDl(mlChunkCoords, mlPixelCoords, false);
  });

  // for the manual downloading
  let coordsInput = manualChunkSection.querySelector(".coordsInput");
  coordsInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.repeat) {
      manualDownload();
    }
  });

  let manualDownloadBtn =
    manualChunkSection.querySelector(".manualDownloadBtn");
  manualDownloadBtn.addEventListener("click", () => {
    manualDownload();
  });

  let manualDownload = () => {
    if (downloadingState) return;

    let coordsText = coordsInput.value;
    // Split and trim whitespace from each value
    let splitUpVal = coordsText.split(",").map((v) => v.trim());

    // Helper: convert string to boolean or null if invalid
    const toBoolean = (str) => {
      if (str.toLowerCase() === "true") return true;
      if (str.toLowerCase() === "false") return false;
      return null;
    };

    if (splitUpVal.length !== 4 && splitUpVal.length !== 5) {
      console.log("You must input 4 or 5 arguments (comma-separated).");
      return;
    }

    // Validate first 4 args as integers
    for (let i = 0; i < 4; i++) {
      if (!Number.isInteger(Number(splitUpVal[i]))) {
        console.log(
          "First 4 arguments must all be integers. Also make sure that there is no space in between numbers. Example of what not to do: ..., 34 6, ..."
        );
        return;
      }
    }
    // organizing before sending data
    let tempCoords = {
      firstChunk: { x: Number(splitUpVal[0]), y: Number(splitUpVal[1]) },
      secondChunk: { x: Number(splitUpVal[2]), y: Number(splitUpVal[3]) },
    };

    // With 5th arg (boolean)
    if (splitUpVal.length === 5) {
      let inputBool = toBoolean(splitUpVal[4]);
      if (inputBool === null) {
        console.log("The fifth argument only accepts 'true' or 'false'.");
        return;
      }
      multipleChunksDlUrl(tempCoords, inputBool);
    } else {
      // Only 4 args
      multipleChunksDlUrl(tempCoords);
    }
  };

  let updateButtons = () => {
    let marker = document.querySelector(".maplibregl-marker");
    if (!marker) {
      isPointing = false;
      chunkX = null;
      chunkY = null;
      pixelX = null;
      pixelY = null;
      chunkUrl = null;
      refreshSetPointsInfo();
    }
    firstPointBtn.disabled = !isPointing;
    secPointBtn.disabled = !isPointing;
    let noChunkSelected =
      mlChunkCoords.firstChunk.x == null && mlChunkCoords.secondChunk.x == null;

    let hasAnUnassignedChunk =
      mlChunkCoords.firstChunk.x == null || mlChunkCoords.secondChunk.x == null;

    downloadChunkBtn.disabled = !isPointing || downloadingState;
    viewChunkBtn.disabled = !isPointing;
    downloadBtn.disabled = downloadingState || noChunkSelected;
    downloadRegionBtn.disabled = downloadingState || hasAnUnassignedChunk;
    manualDownloadBtn.disabled = downloadingState;

    highlightBtn.disabled = noChunkSelected;
    removePointsBtn.disabled = noChunkSelected;
    savePresetBtn.disabled = noChunkSelected;

    let presetDlBtns = document.querySelectorAll(".dlBtn");
    presetDlBtns.forEach((btn) => {
      btn.disabled = downloadingState;
    });
  };

  // for the download bar
  let updateDownloadBar = () => {
    const progressElem = document.querySelector(".download-progress");
    const textElem = document.querySelector(".download-text");

    if (!progressElem || !textElem || totalImgsToBeDownloaded === 0) return;

    const percent = Math.min(
      100,
      (currImgsDownloaded / totalImgsToBeDownloaded) * 100
    );

    progressElem.style.width = percent + "%";
    textElem.textContent = `${currImgsDownloaded} / ${totalImgsToBeDownloaded}`;
  };

  updateButtons();

  const mlCoordsOrganizer = (mlCoords) => {
    console.log(mlCoords);

    let { firstChunk, secondChunk } = structuredClone(mlCoords);

    if (firstChunk.x == null && secondChunk.x == null) {
      console.error("Null on both coords");
      return;
    }

    if (secondChunk.x == null) {
      secondChunk = { ...firstChunk };
      return { firstChunk, secondChunk };
    } else if (firstChunk.x == null) {
      firstChunk = { ...secondChunk };
      return { firstChunk, secondChunk };
    }

    // making sure that the coords that will be sent would be appropriate
    // turns the first point to be the topleft corner and the second the bottom right
    const result = {
      firstChunk: {
        x: Math.min(firstChunk.x, secondChunk.x),
        y: Math.min(firstChunk.y, secondChunk.y),
      },
      secondChunk: {
        x: Math.max(firstChunk.x, secondChunk.x),
        y: Math.max(firstChunk.y, secondChunk.y),
      },
    };

    return result;
  };

  let instanceInc = miscSection.querySelector(".instanceInc");
  let instanceDec = miscSection.querySelector(".instanceDec");

  instanceInc.addEventListener("click", () => changeInstances("inc"));
  instanceDec.addEventListener("click", () => changeInstances("dec"));

  let changeInstances = (type) => {
    let clamp = (num, min, max) => {
      return Math.min(Math.max(num, min), max);
    };
    let instanceInfo = miscSection.querySelector(".instanceInfo");
    if (type == "inc") {
      concurrentDlInstances++;
    } else if (type == "dec") {
      concurrentDlInstances--;
    }

    concurrentDlInstances = clamp(concurrentDlInstances, 1, maxDlInstances);
    savedConfigs.concurrentDlInstances = concurrentDlInstances;
    setGMValue("savedConfigs", savedConfigs);

    instanceInfo.textContent = `Download instances: ${concurrentDlInstances}`;
  };

  // For other overlay scripts / to protect this script too lol
  const w = unsafeWindow;
  const nativeFetch = w.fetch.bind(w);

  function makeFetchWrapper(fetchImpl) {
    const wrapper = async (resource, init) => {
      const url = new URL(
        typeof resource === "string" ? resource : resource.url || "",
        w.location.href // ensure absolute URL resolution
      );

      const isTile = url.pathname.endsWith(".png");
      const x = url.searchParams.get("x");
      const y = url.searchParams.get("y");

      // Always call the currently wrapped fetch implementation
      const res = await wrapper._target(resource, init);

      //  Highlight Tile logic
      if (
        isTile &&
        isHightlightOn &&
        highlightedChunksLinksArr.includes(url.href) &&
        !downloadingState
      ) {
        const cloned = res.clone();
        const blob = await cloned.blob();
        const bmp = await createImageBitmap(blob);

        const canvas = document.createElement("canvas");
        canvas.width = bmp.width;
        canvas.height = bmp.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(bmp, 0, 0);
        ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const modifiedBlob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );

        const headers = new Headers(res.headers);
        headers.delete("content-length");
        headers.delete("content-encoding");

        return new Response(modifiedBlob, {
          status: res.status,
          statusText: res.statusText,
          headers,
        });
      }

      // Point Selection logic / settintg event listeners for "exit point" btns
      if (x != null && y != null) {
        const pathnames = url.pathname.split("/");
        chunkX = Number(pathnames.at(-2));
        chunkY = Number(pathnames.at(-1));
        pixelX = Number(x);
        pixelY = Number(y);
        chunkUrl = `https://backend.wplace.live/files/s0/tiles/${chunkX}/${chunkY}.png`;

        isPointing = true;
        updateButtons();
        refreshSetPointsInfo();
        console.log(`Pressed on ChunkX: ${chunkX}, ChunkY: ${chunkY}`);

        const parent = document
          .querySelector(".rounded-t-box")
          ?.querySelector("div");

        if (parent) {
          const pixelBtns = parent.querySelector(".hide-scrollbar");
          let exitBtn = parent.querySelector(
            "div.px-3:nth-child(1) > button:nth-child(2)"
          );

          let exitPointEvent = () => {
            isPointing = false;
            chunkX = null;
            chunkY = null;
            chunkUrl = null;
            updateButtons();
            refreshSetPointsInfo();
          };

          if (exitBtn) {
            exitBtn.addEventListener("click", exitPointEvent);
          }

          let paintBtn = pixelBtns?.querySelector("button:nth-child(1)");
          if (paintBtn) {
            paintBtn.addEventListener("click", exitPointEvent);
          }
        } else {
          console.error("Parent element not found");
        }
      }

      // Default: return original response untouched
      return res;
    };

    wrapper._target = fetchImpl;
    return wrapper;
  }

  // Installs the first wrapper around the native fetch
  let myFetchWrapper = makeFetchWrapper(nativeFetch);

  // Trap window.fetch so other scripts can patch safely << for Wplace Overlay Pro
  Object.defineProperty(w, "fetch", {
    configurable: true,
    get() {
      return myFetchWrapper;
    },
    set(fn) {
      console.log("Another script patched fetch, wrapping it.");
      // Wrap the new fetch so recursion never happens
      myFetchWrapper = makeFetchWrapper(fn);
    },
  });

  // gonna need to optimize the code below, later.

  const multipleChunksDlUrl = async (chunkCoords, safety = true, name = "") => {

    if (downloadingState) return;

    let organizedChunkCoords = mlCoordsOrganizer(chunkCoords);

    let topleftX = organizedChunkCoords.firstChunk.x;
    let topleftY = organizedChunkCoords.firstChunk.y;
    let botRightX = organizedChunkCoords.secondChunk.x;
    let botRightY = organizedChunkCoords.secondChunk.y;

    console.log(
      `downloading chunks: ${organizedChunkCoords.firstChunk.x}, ${organizedChunkCoords.firstChunk.y} | ${organizedChunkCoords.secondChunk.x}, ${organizedChunkCoords.secondChunk.y}`
    );

    let linksResultArr = getLinksFromChunkCoords(organizedChunkCoords);

    downloadingState = true;
    updateButtons();

    let safetyThreshold = 70;

    let chunkWidth = 1 + Number(botRightX - topleftX);

    let imgsAmount = linksResultArr.length;

    if (linksResultArr.length > safetyThreshold) {
      if (safety) {
        console.warn(
          `You were about to download ${linksResultArr.length} images but was prevented by this precaution. If you intentionally wanted to download that much, you can type '${topLeftX}, ${topLeftY}, ${botRightX}, ${botRightY}, false' onto the manual chunk downloader. Good luck.`
        );
        return;
      } else {
        console.log("Better pray to God...");
      }
    }

    totalImgsToBeDownloaded = imgsAmount;
    currImgsDownloaded = 0;
    updateDownloadBar();

    let resultCanvas = await stitchImages(
      linksResultArr,
      chunkWidth,
      concurrentDlInstances
    );

    let canvasName;
    if (name == "") {
      canvasName = `ch-${topleftX}, ${topleftY}, ${botRightX}, ${botRightY} time-${Date.now()}`;
    } else {
      canvasName = `${name} - ${Date.now()}`;
    }

    canvasDownloader(resultCanvas, canvasName);
  };

  // region downloader

  const regionDl = async (
    chunkCoords,
    pixelCoords,
    safety = true,
    name = ""
  ) => {
    if (
      pixelCoords.firstPixel.x == null ||
      pixelCoords.secondPixel.x == null ||
      downloadingState
    )
      return;

    let organizedChunkCoords = mlCoordsOrganizer(chunkCoords);

    let topleftX = organizedChunkCoords.firstChunk.x;
    let topleftY = organizedChunkCoords.firstChunk.y;
    let botRightX = organizedChunkCoords.secondChunk.x;
    let botRightY = organizedChunkCoords.secondChunk.y;

    let linksResultArr = getLinksFromChunkCoords(organizedChunkCoords);

    downloadingState = true;
    updateButtons();

    let safetyThreshold = 70;

    let chunkWidth = 1 + Number(botRightX - topleftX);

    let imgsAmount = linksResultArr.length;

    if (linksResultArr.length > safetyThreshold) {
      if (safety) {
        console.warn(
          `You were about to download ${linksResultArr.length} images but was prevented by this precaution. If you intentionally wanted to download that much, Turn off the 'safety' under the Region Download section. Good luck.`
        );
        return;
      } else {
        console.log("Better pray to God...");
      }
    }

    totalImgsToBeDownloaded = imgsAmount;
    currImgsDownloaded = 0;
    updateDownloadBar();

    console.log(
      `First point coords: Chunkx: ${topleftX}, ChunkY: ${topleftY}, PixelX: ${pixelCoords.firstPixel.x}, PixelY: ${pixelCoords.firstPixel.y}`
    );
    console.log(
      `Second point coords: Chunkx: ${botRightX}, ChunkY: ${botRightY}, PixelX: ${pixelCoords.secondPixel.x}, PixelY: ${pixelCoords.secondPixel.y}`
    );

    let baseCanvas = await stitchImages(
      linksResultArr,
      chunkWidth,
      concurrentDlInstances
    );

    console.log(
      `canvas - Width: ${baseCanvas.width}, Height: ${baseCanvas.height}`
    );

    // translating the pixel coords onto canvas coords

    let toCanvasCoord = (chunk, pixel, origin, tileSize) => {
      return {
        x: (chunk.x - origin.x) * tileSize + pixel.x,
        y: (chunk.y - origin.y) * tileSize + pixel.y,
      };
    };

    // Basically the "organizedChunkCoords.firstChunk" serves as the "topleft corner" or the 0,0 coords
    // then we extract how far away are the points (on the amount of chunk tiles) from the topleft corner
    // then we multiply it by 1000
    // then the result would be then added by the pixel's coordinate (on the current chunk it is on) to get its coords on canvas.

    let tileWidthAndHeight = 1000; // the width and height of a chunk, hopefully wont change lol

    let canvasPixelCoords = {
      firstPixel: toCanvasCoord(
        chunkCoords.firstChunk,
        pixelCoords.firstPixel,
        organizedChunkCoords.firstChunk,
        tileWidthAndHeight
      ),
      secondPixel: toCanvasCoord(
        chunkCoords.secondChunk,
        pixelCoords.secondPixel,
        organizedChunkCoords.firstChunk,
        tileWidthAndHeight
      ),
    };

    console.log(chunkCoords);
    console.log(pixelCoords);
    console.log(canvasPixelCoords);

    let organizedCanvasPixelCoords = pixelCoordsOrganizer(canvasPixelCoords);

    // sets the width and height of the region
    let regionWidth =
      1 +
      (organizedCanvasPixelCoords.secondPixel.x -
        organizedCanvasPixelCoords.firstPixel.x);
    let regionHeight =
      1 +
      (organizedCanvasPixelCoords.secondPixel.y -
        organizedCanvasPixelCoords.firstPixel.y);

    // creates a new canvas so the data can be put into it
    let regionCanvas = document.createElement("canvas");
    regionCanvas.width = regionWidth;
    regionCanvas.height = regionHeight;

    let regionCtx = regionCanvas.getContext("2d");

    // copy the region onto the new canvas
    regionCtx.drawImage(
      baseCanvas,
      organizedCanvasPixelCoords.firstPixel.x, // source x
      organizedCanvasPixelCoords.firstPixel.y, // source y
      regionWidth, // source width
      regionHeight, // source height
      0, // destination x
      0, // destination y
      regionWidth, // destination width
      regionHeight // destination height
    );

    let canvasName;
    if (name == "") {
      canvasName = `ch-${organizedChunkCoords.firstChunk.x}, ${
        organizedChunkCoords.firstChunk.y
      } px-${organizedCanvasPixelCoords.firstPixel.x}, ${
        organizedCanvasPixelCoords.firstPixel.y
      } size ${regionWidth}, ${regionHeight} time-${Date.now()}`;
    } else {
      canvasName = `${name} - ${Date.now()}`;
    }

    // finally download the resulting canvas
    await canvasDownloader(regionCanvas, canvasName);
  };

  let pixelCoordsOrganizer = (pixelCoords) => {
    let { firstPixel, secondPixel } = structuredClone(pixelCoords);

    const result = {
      firstPixel: {
        x: Math.min(firstPixel.x, secondPixel.x),
        y: Math.min(firstPixel.y, secondPixel.y),
      },
      secondPixel: {
        x: Math.max(firstPixel.x, secondPixel.x),
        y: Math.max(firstPixel.y, secondPixel.y),
      },
    };

    return result;
  };

  let getLinksFromChunkCoords = (chunkCoords) => {
    console.log("getting the links from chunk coords.");
    console.log(
      "tempChunkCoords: " +
        `First chunk {x: ${chunkCoords.firstChunk.x}, y: ${chunkCoords.firstChunk.y}}, Second chunk {x: ${chunkCoords.secondChunk.x}, y: ${chunkCoords.secondChunk.y}}`
    );
    let topleftX = chunkCoords.firstChunk.x,
      topleftY = chunkCoords.firstChunk.y,
      botRightX = chunkCoords.secondChunk.x,
      botRightY = chunkCoords.secondChunk.y;

    if (botRightX == null) {
      botRightX = topleftX;
      botRightY = topleftY;
    }

    let chunkWidth = 1 + Number(botRightX - topleftX);
    let chunkHeight = 1 + Number(botRightY - topleftY);

    console.log("chunkWidth: " + chunkWidth);
    console.log("chunkHeight: " + chunkHeight);

    let linksArr = [];
    for (let j = 0; j < chunkHeight; j++) {
      for (let i = 0; i < chunkWidth; i++) {
        linksArr.push(
          chunkTemplateUrl +
            (Number(i) + Number(topleftX)) +
            "/" +
            (Number(j) + Number(topleftY)) +
            ".png"
        );
      }
    }
    return linksArr;
  };

  async function stitchImages(images, width, concurrency, delay = 150) {
    const resizeImage = (img, maxWidth = 1000, maxHeight = 1000) => {
      if (img.width <= maxWidth && img.height <= maxHeight) {
        return img; // no need to resize
      }

      const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
      const newWidth = Math.floor(img.width * scale);
      const newHeight = Math.floor(img.height * scale);

      const c = document.createElement("canvas");
      c.width = newWidth;
      c.height = newHeight;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const resized = new Image();
      resized.src = c.toDataURL();
      return new Promise((resolve) => {
        resized.onload = () => resolve(resized);
      });
    };

    const createBlank = () => {
      const c = document.createElement("canvas");
      c.width = 1000;
      c.height = 1000;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillRect(0, 0, c.width, c.height);
      return new Promise((resolve) => {
        c.toBlob((blob) => {
          const img = new Image();
          img.src = URL.createObjectURL(blob);
          img.onload = () => resolve(img);
        });
      });
    };

    async function fetchAndLoad(src) {
      console.log("Downloading: " + src);
      while (true) {
        try {
          const res = await fetch(src, { mode: "cors" });

          if (res.status === 429) {
            console.warn("Rate limited! Cooling down for 10s...");
            await sleep(10000);
            continue; // retry
          }

          if (res.status === 404) {
            console.warn("404 Not Found, using blank:", src);
            return await createBlank();
          }

          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }

          const blob = await res.blob();
          const img = await new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.onload = () => {
              console.log("Done loading img");
              resolve(image);
            };
            image.onerror = () => reject(new Error("Decode error"));
            image.src = URL.createObjectURL(blob);
          });

          return await resizeImage(img, 1000, 1000);
        } catch (err) {
          console.warn("Error loading, retrying:", src, err);
          await sleep(2000); // small cooldown before retry
        }
      }
    }

    // Worker pool
    async function loadImagesConcurrent(images, concurrency, delay) {
      const results = new Array(images.length);
      let index = 0;

      async function worker() {
        while (index < images.length) {
          const i = index++;
          const src = images[i];
          const img = await fetchAndLoad(src);
          results[i] = img;
          currImgsDownloaded++;
          updateDownloadBar();
          await sleep(delay); // per-worker cooldown
        }
      }

      const workers = Array.from({ length: concurrency }, () => worker()); // creates an array of promises (fetching imgs)
      await Promise.all(workers);
      return results;
    }

    // usage
    const loadedImages = await loadImagesConcurrent(images, concurrency, delay);

    // stitching
    const columns = width;
    const rows = Math.ceil(loadedImages.length / columns);
    const imgWidth = 1000;
    const imgHeight = 1000;

    const canvas = document.createElement("canvas");
    canvas.width = imgWidth * columns;
    canvas.height = imgHeight * rows;
    const ctx = canvas.getContext("2d");

    loadedImages.forEach((img, index) => {
      const x = (index % columns) * imgWidth;
      const y = Math.floor(index / columns) * imgHeight;
      ctx.drawImage(img, x, y);
    });

    return canvas;
  }

  let canvasDownloader = async (canvasToBeDownloaded, name) => {
    canvasToBeDownloaded.toBlob((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = name + ".png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      // to enable the highlight to stay after downloading
      downloadingState = false;
      updateButtons();
    }, "image/png");
  };
})();
