// ==UserScript==
// @name         AkinO3
// @namespace    http://tampermonkey.net/
// @version      1.11.5
// @description  Discover similar stories inside works on the Archive Of Our Own.
// @author       dxudz
// @match        https://archiveofourown.org/works/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/543400/AkinO3.user.js
// @updateURL https://update.greasyfork.org/scripts/543400/AkinO3.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // === SETTINGS with defaults ===
  const defaultSettings = {
    language: "en",
    complete: "T",
    crossover: "",
    tagBlocklist: "",
    wordsFrom: "",
    wordsTo: ""
  };

  const languageOptions = [
    { code: "all", label: "All Languages" },
    { code: "en", label: "English" },
    { code: "zh", label: "Chinese" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "it", label: "Italian" },
    { code: "ja", label: "Japanese" },
    { code: "ko", label: "Korean" },
    { code: "pl", label: "Polish" },
    { code: "pt", label: "Portuguese" },
    { code: "ru", label: "Russian" },
    { code: "es", label: "Spanish" },
  ];

  function loadSettings() {
    return {
      language: GM_getValue("language", defaultSettings.language),
      complete: GM_getValue("complete", defaultSettings.complete),
      crossover: GM_getValue("crossover", defaultSettings.crossover),
      tagBlocklist: GM_getValue("tagBlocklist", defaultSettings.tagBlocklist),
      wordsFrom: GM_getValue("wordsFrom", defaultSettings.wordsFrom),
      wordsTo: GM_getValue("wordsTo", defaultSettings.wordsTo),
    };
  }

  function saveSettings(settings) {
    GM_setValue("language", settings.language);
    GM_setValue("complete", settings.complete);
    GM_setValue("crossover", settings.crossover);
    GM_setValue("tagBlocklist", settings.tagBlocklist);
    GM_setValue("wordsFrom", settings.wordsFrom);
    GM_setValue("wordsTo", settings.wordsTo);
  }

  let modal, overlay;
  function createSettingsModal() {
    if (modal) return;

    overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    overlay.style.zIndex = "100000";
    overlay.style.display = "none";

    modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "#ddd";
    modal.style.padding = "1em 1.5em";
    modal.style.borderRadius = "16px";
    modal.style.boxShadow = "0 2px 12px rgba(0,0,0,0.4)";
    modal.style.zIndex = "100001";
    modal.style.minWidth = "320px";
    modal.style.maxWidth = "90vw";
    modal.style.display = "none";
    modal.style.color = "#000";
      modal.style.overflowY = "auto";
      modal.style.maxHeight = "80vh";
      modal.style.overflowY = "auto";
      modal.style.scrollbarWidth = "none"; // Firefox
      modal.style.msOverflowStyle = "none"; // IE & Edge

      const style = document.createElement("style");
style.textContent = `
  div::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(style);


    const langOptionsHtml = languageOptions.map(opt => `<option value="${opt.code}">${opt.label}</option>`).join("");

   modal.innerHTML = `
  <style>
    #akinO3-settings-form select,
    #akinO3-settings-form input,
    #akinO3-settings-form textarea {
      width: 100%;
      padding: 0.5em;
      margin-bottom: 1.3em;
      border: 1px solid #ccc;
      border-radius: 30px;
      color: #000;
      font-size: 1em;
      box-sizing: border-box;
      box-shadow: inset 1px 1px 4px rgba(0,0,0,0.15);
      transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.3s ease;
      font-family: inherit;
    }

    #akinO3-settings-form select.akinO3-input {
      line-height: 1.5em;
      padding-top: 0.5em;
      padding-bottom: 0.5em;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-position: right 0.7em center;
      background-repeat: no-repeat;
      background-size: 1em;
    }

    #akinO3-settings-form input:focus,
    #akinO3-settings-form textarea:focus,
    #akinO3-settings-form select:focus {
    border-color: #900;
    outline: none;
    box-shadow: 0 0 5px rgba(136, 0, 0, 0.4);
    background-color:
    }


    #akinO3-settings-form select:hover,
    #akinO3-settings-form input:hover,
    #akinO3-settings-form textarea:hover {
      border-color: #900;
      box-shadow: 0 0 5px rgba(136, 0, 0, 0.3);
      transform: scale(0.95);
    }

    #akinO3-settings-form select option {
      font-family: inherit;
      font-weight: normal;
      padding: 0.3em 0.5em;
    }

    #akinO3-settings-form label {
      display: block;
      margin-bottom: 0.4em;
      font-weight: bold;
    }

    #akinO3-settings-form h2 {
      margin-top: 0;
      margin-bottom: 0.5em;
    }

    #akinO3-settings-form p.header {
      font-size: 1em;
      font-weight: normal;
      margin: 1em 0 1em 0;
    }

    #akinO3-settings-form p.word-count-header {
      font-size: 1em;
      font-weight: normal;
      margin: 0.5em 0 1.2em 0;
    }

    #akinO3-settings-form .button-group {
      text-align: right;
      margin-top: 1em;
    }

    #akinO3-settings-form .button-group button {
      padding: 0.4em 0.9em;
      border: none;
      border-radius: 16px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.2s ease; transform 0.3s ease;
    }

    #akinO3-cancel-btn {
      background: #ccc;
      color: #000;
      transition: transform 0.3s ease;
      margin-right: 0.5em;
    }

    #akinO3-cancel-btn:hover {
      background: #bbb;
      transform: scale(0.90);
    }

    #akinO3-settings-form button[type="submit"] {
      background: #900;
      color: #fff;
      transition: transform 0.3s ease;
    }

    #akinO3-settings-form button[type="submit"]:hover {
      background: #b00;
      transform: scale(0.90);
    }

    #akinO3-settings-form .akinO3-input {
      width: 100%;
      padding: 0.5em;
      font-size: 1em;
      border: 1px solid #ccc;
      border-radius: 16px;
      box-sizing: border-box;
      margin-bottom: 1.3em;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.3s ease;
      height: 2.5em;
      vertical-align: middle;
      font-family: inherit;
    }

    #akinO3-settings-form .akinO3-input:hover {
      border-color: #900;
      box-shadow: 0 0 5px rgba(136, 0, 0, 0.3);
      transform: scale(0.90);
    }
  </style>

  <h3 style="text-align: center; font-size: 2em; font-weight: bold; margin-bottom: 0;">AkinO3 Parameters</h3>
  <h5 class="header" style="text-align: center; font-size: 1.1em; margin-bottom: 1.5em;">Select your work preferences!</h5>
  <form id="akinO3-settings-form">
    <label for="akinO3-language">Language:</label>
    <select id="akinO3-language" name="language" class="akinO3-input">
      ${langOptionsHtml}
    </select>

    <label for="akinO3-complete">Completion Status:</label>
    <select id="akinO3-complete" name="complete" class="akinO3-input">
      <option value="T">Complete works only</option>
      <option value="F">Works in progress only</option>
      <option value="A">All works</option>
    </select>

    <label for="akinO3-crossover">Crossovers:</label>
    <select id="akinO3-crossover" name="crossover" class="akinO3-input">
      <option value="">Include crossovers</option>
      <option value="F">Exclude crossovers</option>
      <option value="T">Show only crossovers</option>
    </select>

    <h5 style="margin-top: 0.5em; margin-bottom: 0.5em; font-weight: normal; font-size: 1.1em;">Word Count:</h5>

    <label for="akinO3-wordsFrom">From:</label>
    <input type="number" id="akinO3-wordsFrom" name="wordsFrom" class="akinO3-input" step="1000" />

    <label for="akinO3-wordsTo">To:</label>
    <input type="number" id="akinO3-wordsTo" name="wordsTo" class="akinO3-input" step="1000" />

    <label for="akinO3-tagBlocklist">Tag blocklist (comma-separated):</label>
    <textarea id="akinO3-tagBlocklist" name="tagBlocklist" rows="3" class="akinO3-input" placeholder="e.g. major character death, rape/non-con, gore"></textarea>

    <div class="button-group">
      <button type="button" id="akinO3-cancel-btn" style="transition: transform 0.3s ease;">Close</button>
      <button type="submit">Save</button>
    </div>

    <div id="akinO3-confirmation" style="color: green; margin-top: 10px; display: none; font-weight: bold;"></div>
  </form>
`;


    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    overlay.addEventListener("click", closeModal);
    document.getElementById("akinO3-cancel-btn").addEventListener("click", closeModal);
    document.getElementById("akinO3-settings-form").addEventListener("submit", saveModalSettings);
  }

  function openSettingsModal() {
    createSettingsModal();
    const settings = loadSettings();

    modal.querySelector("#akinO3-language").value = settings.language || "all";
    modal.querySelector("#akinO3-complete").value = settings.complete || "T";
    modal.querySelector("#akinO3-crossover").value = settings.crossover || "";
    modal.querySelector("#akinO3-tagBlocklist").value = settings.tagBlocklist || "";
    modal.querySelector("#akinO3-wordsFrom").value = settings.wordsFrom || "";
    modal.querySelector("#akinO3-wordsTo").value = settings.wordsTo || "";

    modal.querySelector("#akinO3-confirmation").style.display = "none";
    modal.querySelector("#akinO3-confirmation").textContent = "";

    overlay.style.display = "block";
    modal.style.display = "block";
  }

  function closeModal() {
    if (modal) modal.style.display = "none";
    if (overlay) overlay.style.display = "none";
  }

  function saveModalSettings(e) {
    e.preventDefault();
    const form = e.target;
    const newSettings = {
      language: form.language.value.toLowerCase(),
      complete: ["T", "F", "A"].includes(form.complete.value.toUpperCase()) ? form.complete.value.toUpperCase() : "T",
      crossover: ["", "F", "T"].includes(form.crossover.value.toUpperCase()) ? form.crossover.value.toUpperCase() : "T",
      tagBlocklist: form.tagBlocklist.value.toLowerCase(),
      wordsFrom: form.wordsFrom.value.trim(),
      wordsTo: form.wordsTo.value.trim()
    };
    console.log("Saving settings:", newSettings);
    saveSettings(newSettings);

    const confirmation = modal.querySelector("#akinO3-confirmation");
    confirmation.innerHTML = "Settings saved!<br>Please run 'Randomize' to apply.";
    confirmation.style.display = "block";
    confirmation.style.color = "#000";
    confirmation.style.fontSize = "16px";
    confirmation.style.textAlign = "center";
    confirmation.style.marginTop = "16px";
  }

  GM_registerMenuCommand("AkinO3 Settings", openSettingsModal);

  function getTagText(selector) {
    return Array.from(document.querySelectorAll(selector)).map(el => el.textContent.trim());
  }

  let selectedPairing = null; // Store user's choice for the session

function createPairingModal(relationships) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
  overlay.style.zIndex = "100000";

  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "#ddd";
  modal.style.padding = "1.5em";
  modal.style.borderRadius = "16px";
  modal.style.boxShadow = "0 2px 12px rgba(0,0,0,0.4)";
  modal.style.zIndex = "100001";
  modal.style.minWidth = "300px";
  modal.style.maxWidth = "90vw";
  modal.style.color = "#000";

  modal.innerHTML = `
    <style>
      .akinO3-pairing-label {
        transition: transform 0.2s ease;
        display: block;
        margin: 1em 0;
      }
      .akinO3-pairing-label:hover {
        transform: scale(0.95);
      }
    </style>
    <h3 style="text-align: center; margin-top: 0;">What are you looking for today?</h3>
    <p style="text-align: center; color: #666; font-style: italic; margin: 0 0 1.5em 0; font-size: 0.9em;">
      Your choice lasts until you refresh the page.
    </p>
    <div class="pairing-section">
      <h4 style="margin-bottom: 0.5em; margin-top: 0.5em;">Pairings available:</h4>
      ${relationships.map(pairing => `
        <label class="akinO3-pairing-label" style="display: block; margin: 0.5em 0;">
          <input type="radio" name="pairing" value="${pairing}" style="margin-right: 0.5em;">
          ${pairing}
        </label>
      `).join("")}
    </div>
    <div style="display: flex; justify-content: center; gap: 1em; margin-top: 1.5em;">
      <button id="selection-cancel-btn" style="
        padding: 0.5em 1em;
        background: #ccc;
        color: black;
        border: none;
        border-radius: 16px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s ease, transform 0.3s ease;
      ">Cancel</button>
      <button id="selection-start-btn" style="
        padding: 0.5em 1em;
        background: #900;
        color: white;
        border: none;
        border-radius: 16px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s ease, transform 0.3s ease;
      ">Start Search</button>
    </div>
  `;

  return new Promise((resolve) => {
    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    const startBtn = modal.querySelector("#selection-start-btn");
    const cancelBtn = modal.querySelector("#selection-cancel-btn");

    // Add hover effects
    startBtn.addEventListener("mouseenter", () => {
      startBtn.style.backgroundColor = "#b00";
      startBtn.style.transform = "scale(0.95)";
    });
    startBtn.addEventListener("mouseleave", () => {
      startBtn.style.backgroundColor = "#900";
      startBtn.style.transform = "scale(1)";
    });

    cancelBtn.addEventListener("mouseenter", () => {
      cancelBtn.style.backgroundColor = "#bbb";
      cancelBtn.style.transform = "scale(0.95)";
    });
    cancelBtn.addEventListener("mouseleave", () => {
      cancelBtn.style.backgroundColor = "#ccc";
      cancelBtn.style.transform = "scale(1)";
    });

    function cleanup(selection = null) {
      overlay.remove();
      modal.remove();
      resolve(selection);
    }

    // Click outside to cancel
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        cleanup(null);
      }
    });

    // Cancel button
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      cleanup(null);
    });

    // Start search button
    startBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const selected = modal.querySelector('input[name="pairing"]:checked');
      cleanup(selected ? selected.value : null);
    });

    // Auto-select first option
    const firstRadio = modal.querySelector('input[name="pairing"]');
    if (firstRadio) firstRadio.checked = true;
  });
}


  function buildSearchURL({ fandom, pairing, tags }) {
    const base = "https://archiveofourown.org/works?";
    const params = new URLSearchParams();
    const settings = loadSettings();

    params.set("work_search[sort_column]", "revised_at");
    params.set("work_search[other_tag_names]", tags.join(","));

    const excludedTags = settings.tagBlocklist.split(",").map(t => t.trim()).filter(t => t.length);
    params.set("work_search[excluded_tag_names]", excludedTags.join(","));

    if (settings.crossover === "") {
      params.set("work_search[crossover]", "");
    } else if (settings.crossover === "F") {
      params.set("work_search[crossover]", "F");
    } else {
      params.set("work_search[crossover]", "T");
    }

    if (settings.complete === "T") {
      params.set("work_search[complete]", "T");
    } else if (settings.complete === "F") {
      params.set("work_search[complete]", "F");
    } else {
      params.set("work_search[complete]", "");
    }

    params.set("work_search[words_from]", settings.wordsFrom || "");
    params.set("work_search[words_to]", settings.wordsTo || "");
    params.set("work_search[query]", "");

    if (settings.language !== "all") {
      params.set("work_search[language_id]", settings.language);
    } else {
      params.delete("work_search[language_id]");
    }

    params.set("commit", "Sort and Filter");
    if (pairing) {
    params.set("tag_id", pairing.replace(/\//g, '*s*'));
  } else {
    params.set("tag_id", fandom);
  }

  return base + params.toString();
}

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

 async function fetchWorks(url) {
  try {
    const res = await fetch(url);
    if (res.status === 429) {
      // signal to the caller that AO3 is overloaded
      const err = new Error("AO3_OVERLOADED");
      err.code = 429;
      throw err;
    }
    const html = await res.text();
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.querySelectorAll("li.work.blurb.group");
  } catch (e) {
    // Only catch network errors, let custom errors propagate
    if (e.code === 429) throw e;
    console.error("❌ Fetch error:", e);
    return [];
  }
}

  async function fetchRecommendations(forceRefresh = false) {
  // No longer prompt for pairing here; use selectedPairing from the session
  const relationships = getTagText("dd.relationship.tags a.tag");

  // If no relationships found, exit early
  if (!relationships.length) {
    console.log("No relationships found to recommend from.");
    return;
  }

  // Use the selectedPairing for this session
  if (!selectedPairing) {
    // Should not happen, but fallback to first relationship if needed
    selectedPairing = relationships[0];
  }

  const fandoms = getTagText("dd.fandom.tags a.tag");
  const allTags = getTagText("dd.freeform.tags a.tag");

  if (!fandoms.length) {
    console.log("Not enough data to recommend.");
    return;
  }

    const fandom = fandoms[0];
    const pairing = selectedPairing;

    // Get settings and filter out blocked tags
    const settings = loadSettings();
    const blockedTags = settings.tagBlocklist
      .split(",")
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length);

    // Filter tags before shuffling
    const filteredTags = allTags.filter(tag =>
      !blockedTags.includes(tag.toLowerCase())
    );

    const tags = shuffle(filteredTags);

    const currentWorkIdMatch = window.location.pathname.match(/\/works\/(\d+)/);
    const currentWorkId = currentWorkIdMatch ? currentWorkIdMatch[1] : null;

    // Changed here to try 5 tags, then fallback 4, 3, 2, 1
    const attempts = [
      tags.slice(0, 5),
      tags.slice(0, 4),
      tags.slice(0, 3),
      tags.slice(0, 2),
      tags.slice(0, 1),
    ];

    let totalDisplayed = 0;
    const displayedWorkIds = new Set();

    const existing = document.getElementById("similar-works-container");
    if (existing) existing.remove();

    const container = document.createElement("div");
    container.id = "similar-works-container";
    container.style.display = "block";
    container.style.marginTop = "2em";

    const titleRow = document.createElement("div");
    titleRow.style.display = "flex";
    titleRow.style.alignItems = "center";
    titleRow.style.justifyContent = "center";
    titleRow.style.gap = "1em";

    const randomBtn = document.createElement("button");
    randomBtn.textContent = "Randomize";
    randomBtn.style.cursor = "pointer";
    randomBtn.style.padding = "0.25em 0.75em";
    randomBtn.style.borderRadius = "0.25em";
    randomBtn.style.border = "1px solid #999";
    randomBtn.style.color = "#444";
    randomBtn.style.backgroundColor = "#eee";
    randomBtn.style.fontSize = "100%";

    randomBtn.addEventListener("mouseenter", () => {
      randomBtn.style.color = "#900";
      randomBtn.style.boxShadow = "inset 2px 2px 2px #bbb";
    });
    randomBtn.addEventListener("mouseleave", () => {
      randomBtn.style.color = "#444";
      randomBtn.style.boxShadow = "none";
    });

    randomBtn.addEventListener("click", () => {
      const existing = document.getElementById("similar-works-container");
      if (existing) existing.remove();
      fetchRecommendations(true);
    });

    const title = document.createElement("h3");
    title.textContent = "You might also enjoy:";
    title.style.textAlign = "center";

    titleRow.appendChild(randomBtn);
    titleRow.appendChild(title);
    container.appendChild(titleRow);

    function createMessage(text, tagsOnly) {
      const msg = document.createElement("div");
      msg.style.marginBottom = "5px";
      msg.style.marginTop = "5px";
      msg.style.fontStyle = "italic";
      msg.style.textAlign = "center";

      const parts = text.split(" ");
      const tagIndex = parts.findIndex(part => part.startsWith("matching"));
      const tagText = parts.slice(tagIndex + 1).join(" ");
      const preText = parts.slice(0, tagIndex + 1).join(" ");

      msg.innerHTML = `${preText} <span>${tagText}</span>`;
      return msg;
    }

      let ao3Overloaded = false;

    for (let i = 0; i < attempts.length && totalDisplayed < 5; i++) {
  const tagsToUse = attempts[i];
  if (!tagsToUse.length) continue;

  const url = buildSearchURL({ fandom, pairing, tags: tagsToUse });
  console.log(`🔗 Attempt #${i + 1}: Tags [${tagsToUse.join(", ")}]`);
  console.log(`🌐 URL used: ${url}`);

  let works;
  try {
    works = await fetchWorks(url);
  } catch (e) {
        if (e.code === 429) {
          console.warn("🚫 AO3 returned 429 Too Many Requests. Aborting further attempts.");
          ao3Overloaded = true; // Just set the flag
          break;
        } else {
          console.error("❌ Error while fetching works:", e);
          continue;
        }
      }

  if (!works.length) {
    console.log(`⚠️ Found 0 works on attempt #${i + 1}, trying next fallback...`);
    continue;
  }

  const filteredWorks = Array.from(works).filter(w => {
    let id = null;
    if (w.hasAttribute("data-work-id")) {
      id = w.getAttribute("data-work-id");
    } else {
      const link = w.querySelector("h4.heading a[href*='/works/']");
      const match = link?.href?.match(/\/works\/(\d+)/);
      if (match) id = match[1];
    }
    return id !== currentWorkId && !displayedWorkIds.has(id);
  });

  if (!filteredWorks.length) {
    console.log(`⚠️ Found 0 works after filtering current work on attempt #${i + 1}, trying next fallback...`);
    continue;
  }


      shuffle(filteredWorks);
      const toShowCount = Math.min(5 - totalDisplayed, filteredWorks.length);

      const tagLabel = tagsToUse.length === 1 ? "tag" : "tags";
      container.appendChild(createMessage(`Showing ${toShowCount} result${toShowCount > 1 ? "s" : ""} matching the ${tagLabel} ${tagsToUse.join(", ")}`));

      for (let j = 0; j < toShowCount; j++) {
        const work = filteredWorks[j];
        const clone = work.cloneNode(true);
        clone.style.border = "1px solid #ccc";
        clone.style.padding = "1em";
        clone.style.margin = "1em 0";
        clone.style.borderRadius = "6px";
        clone.style.maxWidth = "950px";
        clone.style.marginLeft = "auto";
        clone.style.marginRight = "auto";

        let workId = null;
        if (work.hasAttribute("data-work-id")) {
          workId = work.getAttribute("data-work-id");
        } else {
          const link = work.querySelector("h4.heading a[href*='/works/']");
          const match = link?.href?.match(/\/works\/(\d+)/);
          if (match) workId = match[1];
        }

        if (!workId) continue;
          displayedWorkIds.add(workId);
          const markBtn = document.createElement("button");
          markBtn.textContent = "Mark for Later";
          markBtn.style.padding = "0.25em 0.75em";
          markBtn.style.border = "1px solid #999";
          markBtn.style.borderRadius = "0.25em";
          markBtn.style.color = "#444";
          markBtn.style.cursor = "pointer";
          markBtn.style.backgroundColor = "#eee";
          markBtn.style.fontSize = "100%";
          markBtn.style.marginTop = "16px";

          markBtn.addEventListener("mouseenter", () => {
            markBtn.style.color = "#900";
            markBtn.style.boxShadow = "inset 2px 2px 2px #bbb";
          });
          markBtn.addEventListener("mouseleave", () => {
            markBtn.style.color = "#444";
            markBtn.style.boxShadow = "none";
          });

          markBtn.addEventListener("click", () => {
            window.open(`https://archiveofourown.org/works/${workId}/mark_for_later/`, "_blank", "noopener,noreferrer");
          });

          clone.appendChild(markBtn);
        container.appendChild(clone);
      }

      totalDisplayed += toShowCount;
    }

     if (ao3Overloaded) {
      const overloadMsg = document.createElement("div");
         overloadMsg.style.textAlign = "center";
      overloadMsg.style.fontSize = "18px";
      overloadMsg.style.marginTop = "1em";
      overloadMsg.style.fontStyle = "italic";
      overloadMsg.textContent =
        "AO3 seems to have gotten too many requests at this time. Please try again in a couple minutes.";
      container.appendChild(overloadMsg);

         } else if (totalDisplayed === 0) {
      const noResultsMsg = document.createElement("div");
      noResultsMsg.style.textAlign = "center";
      noResultsMsg.style.fontStyle = "italic";
      noResultsMsg.style.fontSize = "18px";
      noResultsMsg.style.marginTop = "1em";
      noResultsMsg.textContent =
        "Oops, it seems like this search brought up no results at this time. Why don't you try again?";
      container.appendChild(noResultsMsg);
    }

    let settingsBtn = document.getElementById("akinO3-settings-btn");
    if (!settingsBtn) {
      settingsBtn = document.createElement("button");
      settingsBtn.id = "akinO3-settings-btn";
      settingsBtn.textContent = "AkinO3 Parameters";
      settingsBtn.style.marginTop = "1em";
      settingsBtn.style.marginBottom = "1em";
      settingsBtn.style.marginLeft = "auto";
      settingsBtn.style.marginRight = "auto";
      settingsBtn.style.display = "block";
      settingsBtn.style.cursor = "pointer";
      settingsBtn.style.padding = "0.25em 0.75em";
      settingsBtn.style.borderRadius = "0.25em";
      settingsBtn.style.border = "1px solid #999";
      settingsBtn.style.color = "#444";
      settingsBtn.style.backgroundColor = "#eee";
      settingsBtn.style.fontSize = "100%";

      settingsBtn.addEventListener("mouseenter", () => {
        settingsBtn.style.color = "#900";
        settingsBtn.style.boxShadow = "inset 2px 2px 2px #bbb";
      });
      settingsBtn.addEventListener("mouseleave", () => {
        settingsBtn.style.color = "#444";
        settingsBtn.style.boxShadow = "none";
      });

      settingsBtn.addEventListener("click", () => {
        openSettingsModal();
      });

      container.appendChild(settingsBtn);
    }

    const workskin = document.getElementById("workskin");
    if (workskin && workskin.parentNode) {
      workskin.parentNode.insertBefore(container, workskin.nextSibling);
      console.log("✅ Inserted recommendations after fic body.");
    }
  }

  // Add this event handler for the "Find Similar Works" link
  const similarToggle = document.createElement("li");
  similarToggle.innerHTML = `<a href="#" id="similar-works-toggle">Find Similar Works</a>`;

  const navActions = document.querySelector("div.feedback ul.actions");
  if (navActions) {
    navActions.appendChild(similarToggle);
  }

  // Only show the pairing modal on the first click per page load
  // Store the user's choice for the session (until refresh)
  document.addEventListener("click", async (e) => {
    if (e.target && e.target.id === "similar-works-toggle") {
      e.preventDefault();
      const container = document.getElementById("similar-works-container");
      if (container) {
        container.style.display = container.style.display === "none" ? "block" : "none";
      } else {
        // Only prompt for pairing if not already selected this session
        if (!selectedPairing) {
          const relationships = getTagText("dd.relationship.tags a.tag");
          if (relationships.length > 1) {
            selectedPairing = await createPairingModal(relationships);
            if (!selectedPairing) {
              console.log("Selection cancelled by user");
              return;
            }
          } else if (relationships.length === 1) {
            selectedPairing = relationships[0];
          } else {
            console.log("No relationships found to recommend from.");
            return;
          }
        }
        fetchRecommendations();
      }
    }
  });

})();
