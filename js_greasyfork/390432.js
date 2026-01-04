// ==UserScript==
// @name         Mananelo/Mangakakalot/Manganato/Manga4life Bookmarks Export
// @namespace    http://smoondev.com/
// @version      3.01
// @description  Import and export bookmakrs from Mangakakalot, Manganato, Nataomanga, Nelomanga (id, name and visited number) to a txt or csv file on "Export Bookmarks"/"Import Bookmarks" button click
// @author       Shawn Moon
// @match        https://*.mangakakalot.gg/bookmark*
// @match        https://*.natomanga.com/bookmark*
// @match        https://*.manganato.gg/bookmark*
// @match        https://*.nelomanga.net/bookmark*
// @match        https://mangakakalot.fun/user/bookmarks
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/390432/MananeloMangakakalotManganatoManga4life%20Bookmarks%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/390432/MananeloMangakakalotManganatoManga4life%20Bookmarks%20Export.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Inject CSS styles for bookmark export/import UI
  function addBookarkStyles(css) {
    const head = document.head || document.getElementsByTagName("head")[0];
    if (!head) return;
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = css;
    head.appendChild(style);
  }

  addBookarkStyles(`
#export_container_nato, #export_container_kakalot, #export_container_m4l {
  color: #000;
  cursor: pointer;
  float: right;
}

#export_container_fun {
  display: inline-flex;
  vertical-align: bottom;
  align-items: baseline;
  margin-top: 20px;
  text-align: right;
  float: right;
  margin-right: 20px;
}

#export_container_kakalot {
  margin-right: 10px;
}

#export_nato:hover, #export_kakalot:hover, #import_kakalot:hover, #export_m4l:hover {
  background-color: #b6e4e3;
  color: #000;
  cursor: pointer;
  text-shadow: none;
}

#export_nato, #export_kakalot, #import_kakalot, #export_m4l {
  border-radius: 5px;
  text-decoration: none;
  color:rgb(255, 255, 255);
  text-shadow: 1px 1px #3d7f7d;
  background-color: #76cdcb;
  border: none;
  font-weight: bold;
}

#export_nato, #export_kakalot, #import_kakalot {
  padding: 4px 8px;
  letter-spacing: 0.5px;
}

#import_kakalot {
  margin-right: 20px; 
}

#export_m4l {
  padding: 1px 12px;
  font-size: 16.5px;
}

#export_fun {
  color: #f05759;
  background-color: #fff;
  border: 1px solid #f05759;
  display: inline-block;
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  touch-action: manipulation;
  cursor: pointer;
  white-space: nowrap;
  padding: 6px 12px;
  border-radius: 0;
  user-select: none;
  transition: all .2s ease-in-out;
  margin-left: 5px;
}

#import_fun {
  display: none;
}

#export_fun:hover {
  color: #fff;
  background-color: #f05759;
  margin-left: 5px;
}

#inclURL_nato, #inclURL_kakalot, #inclURL_fun {
  margin-left: 10px;
}

#inclURL_fun {
  margin-right: 5px;
}

.inclURL_kakalot {
  color: #ffffff;
  margin-top: 0;
  font-size: 14px;
  margin-bottom: 0;
}

.inclURL_fun {
  font-weight:normal;
}

#temp_data {
  position: absolute;
  top: -9999px;
  left: -9999px;
}

.bm-container {
  background-color: #218f8c;
  border-top-left-radius: 7px;
  border-top: solid #288b89 1px;
  border-left: solid #288b89 1px;
  padding-left: 10px;
}
`);

  // Global constants and variables
  const MAX_RETRIES = 10;
  const CONCURRENCY_LIMIT = 5;
  const DELAY_TIMING = 1000;

  // Setup selectors and IDs based on domain
  let pageI,
    bmTag,
    bmTitle,
    lastViewed,
    btnContainer,
    exportButtonID,
    importButtonID,
    inclURL,
    bookmarkedTitles = "",
    exportContainer,
    pageCount = 0,
    removeBtn,
    bmContainer,
    domain = window.location.hostname,
    tld = domain.replace("www.", ""),
    bmLabel = "Bookmarks";

  let mangagakalotDomains = ["mangakakalot.gg", "natomanga.com", "manganato.gg", "nelomanga.net"];

  if (mangagakalotDomains.includes(tld)) {
    pageI = ".group-page a";
    bmTag = ".user-bookmark-item-right";
    bmTitle = ".bm-title";
    lastViewed = "span:nth-of-type(2) a";
    btnContainer = ".breadcrumbs p";
    inclURL = "inclURL_kakalot";
    removeBtn = ".btn-remove-bookmark";
    bmContainer = "bm-container";

    let pageElList = document.querySelectorAll(pageI);
    if (pageElList.length > 0) {
      let lastText = pageElList[pageElList.length - 1].textContent;
      pageCount = parseInt(lastText.replace(/\D+/g, ""), 10) || 0;
    }
    exportButtonID = "export_kakalot";
    exportContainer = "export_container_kakalot";
    importButtonID = "import_kakalot";
  } else if (domain.indexOf("mangakakalot.fun") !== -1) {
    bmTag = ".list-group-item";
    bmTitle = ".media-heading a";
    lastViewed = ".media-body p a";
    btnContainer = ".container-fluid:first-child div:last-child";
    inclURL = "inclURL_fun";
    exportButtonID = "export_fun";
    importButtonID = "import_fun";
    exportContainer = "export_container_fun";
    bmContainer = "";
  }

  // Delay utility function
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Save data to file with FileSaver.js
  const saveFile = (saveData, format) => {
    const ext = format === "csv" ? "csv" : "txt";
    const fileData = new Blob([saveData], { type: "application/octet-stream" });
    saveAs(fileData, `${tld}_bookmarks.${ext}`);
    const btn = document.getElementById(exportButtonID);
    if (btn) {
      btn.innerHTML = `Export ${bmLabel}`;
      btn.disabled = false;
    }
  };

  // Remove temporary data container from DOM
  const deleteTemp = () => {
    const tempData = document.getElementById("temp_data");
    if (tempData) {
      tempData.remove();
    }
  };

  // Generate export content for mangakakalot.fun bookmarks
  const getFunBMs = (url, format) => {
    const bmItems = document.querySelectorAll(bmTag);
    for (let i = 0; i < bmItems.length; i++) {
      const titleElem = bmItems[i].querySelector(bmTitle);
      const title = titleElem ? titleElem.textContent.trim() : "";
      const lastViewedElem = bmItems[i].querySelector(".media-body p a");
      const viewedText = lastViewedElem ? lastViewedElem.textContent.trim() : "None";
      if (format === "csv") {
        const csvTitle = `"${title.replace(/"/g, '""')}"`;
        const csvViewed = `"${viewedText.replace(/"/g, '""')}"`;
        let csvURL = "";
        if (url && lastViewedElem && lastViewedElem.href) {
          csvURL = `"${lastViewedElem.href.replace(/"/g, '""')}"`;
        }
        bookmarkedTitles += `${csvTitle},${csvViewed},${csvURL}\n`;
      } else {
        const linkText = url && lastViewedElem && lastViewedElem.href ? `- ${lastViewedElem.href}` : "";
        bookmarkedTitles += `${title} || Viewed: ${viewedText} ${linkText} \n`;
      }
    }
    saveFile(bookmarkedTitles, format);
  };

  // Insert export/import UI container if not present
  if (!document.getElementById(exportContainer)) {
    const btnContElem = document.querySelector(btnContainer);
    if (btnContElem) {
      btnContElem.insertAdjacentHTML(
        "beforeend",
        `<div class='${bmContainer}'>
          <div id='${exportContainer}'>
            <button id='${importButtonID}'>Import ${bmLabel}</button>
            <select id="export_option" style="border-radius: 5px; padding: 4px 8px;">
            <option value="csv">CSV</option>
            <option value="text">Text</option>
            </select>
            <button id='${exportButtonID}'>Export ${bmLabel}</button>
            <input type="checkbox" id="${inclURL}">
            <span>
              <label for="${inclURL}" class='${inclURL}'>Add URL</label>
            </span>
          </div>
        </div>`
      );
    }
  }

  // Generate export content for mangakakalot (and like) bookmarks
  const getBookmarks = (url, bookmarkHeader, format) => {
    deleteTemp();
    document.body.insertAdjacentHTML("beforeend", "<div id='temp_data'></div>");
    let bookmarkedContent = bookmarkHeader;
    const tempData = document.getElementById("temp_data");
    const fetches = [];

    for (let i = 0; i < pageCount; i++) {
      const pageId = `page${i + 1}`;
      const pageDiv = document.createElement("div");
      pageDiv.id = pageId;
      tempData.appendChild(pageDiv);
      const fetchPromise = retryFetch(`https://${domain}/bookmark?page=${i + 1}`)
        .then((response) => response.text())
        .then((htmlText) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, "text/html");
          const items = doc.querySelectorAll(bmTag);
          pageDiv.innerHTML = Array.from(items)
            .map((item) => item.outerHTML)
            .join("");
        })
        .catch((error) => console.error("ExportError", error));
      fetches.push(fetchPromise);
    }

    Promise.all(fetches).then(() => {
      const bmItems = document.querySelectorAll(`#temp_data ${bmTag}`);
      bmItems.forEach((item) => {
        const titleElem = item.querySelector(bmTitle);

        if (titleElem && titleElem.textContent) {
          const titleText = titleElem.textContent.trim();
          const lastViewedElem = item.querySelector(lastViewed);
          const viewedText = lastViewedElem ? lastViewedElem.textContent.trim() : "Not Found";
          const mID = item.querySelector(removeBtn)?.getAttribute("data-url")?.match(/\d+/)?.[0] || "";

          if (format === "csv") {
            const csvTitle = `"${titleText.replace(/"/g, '""')}"`;
            const csvViewed = `"${viewedText.replace(/"/g, '""')}"`;
            let csvURL = "";
            if (url && lastViewedElem && lastViewedElem.href) {
              csvURL = `"${lastViewedElem.href.replace(/"/g, '""')}"`;
            }
            bookmarkedContent += `${mID},${csvTitle},${csvViewed},${csvURL}\n`;
          } else {
            const linkPart = url && lastViewedElem && lastViewedElem.href ? `- ${lastViewedElem.href}` : "";
            bookmarkedContent += `${titleText} || Viewed: ${viewedText} ${linkPart} \n`;
          }
        }
      });
      saveFile(bookmarkedContent, format);
      deleteTemp();
    });
  };

  // Retrieve existing bookmark IDs to avoid duplicates during import for mangakakalot (and like) sites
  const getExistingIDs = async () => {
    const ids = new Set();
    if (pageCount > 1) {
      const promises = [];
      for (let i = 1; i <= pageCount; i++) {
        const pageUrl = `https://${domain}/bookmark?page=${i}`;
        const promise = fetch(pageUrl)
          .then((response) => response.text())
          .then((htmlText) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");
            const items = doc.querySelectorAll(bmTag);
            items.forEach((item) => {
              const mID = item.querySelector(removeBtn)?.getAttribute("data-url")?.match(/\d+/)?.[0];
              if (mID) {
                ids.add(mID);
              }
            });
          })
          .catch((error) => console.error("Error fetching page:", error));
        promises.push(promise);
      }
      await Promise.all(promises);
    } else {
      document.querySelectorAll(bmTag).forEach((item) => {
        const mID = item.querySelector(removeBtn)?.getAttribute("data-url")?.match(/\d+/)?.[0];
        if (mID) {
          ids.add(mID);
        }
      });
    }
    return ids;
  };

  // Fetch with timeout using AbortController
  const fetchWithTimeout = async (url, options = {}, timeout = 2000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(id);
    }
  };

  // Retry fetch upon failure up to MAX_RETRIES times
  const retryFetch = async (url, options = {}, retries = MAX_RETRIES) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetchWithTimeout(url, options, 2000); // timeout of 2 seconds
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        return response;
      } catch (err) {
        if (attempt === retries - 1) {
          throw err;
        }
        await delay(DELAY_TIMING);
      }
    }
  };

  // Import bookmarks from CSV file
  const importButton = document.getElementById(importButtonID);
  if (importButton) {
    importButton.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv";
      input.style.display = "none";
      document.body.appendChild(input);
      input.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = async function (e) {
            try {
              const contents = e.target.result;
              const lines = contents.split("\n").filter((line) => line.trim() !== "");
              if (lines.length === 0) {
                alert("CSV file is empty or invalid.");
                return;
              }

              const headerValues = lines[0].split(",").map((item) =>
                item
                  .trim()
                  .replace(/^"(.*)"$/, "$1")
                  .toLowerCase()
              );

              if (headerValues[0] !== "id") {
                alert("CSV file is corrupt or invalid: Missing 'ID' header in first column.");
                return;
              }

              const rawExistingIDs = await getExistingIDs();
              const existingIDs = new Set(Array.from(rawExistingIDs).map((id) => String(parseInt(id, 10))));
              const tasks = [];

              for (let index = 1; index < lines.length; index++) {
                const values = lines[index].split(",");
                if (values.length === 0) continue;

                let rawId = values[0].trim();
                let idStr = rawId.replace(/^"(.*)"$/, "$1").trim();
                if (!idStr || isNaN(idStr)) {
                  alert(`CSV file is corrupt or invalid at line ${index + 1}: '${rawId}' is not a valid number.`);
                  return;
                }

                const normalizedCSVId = String(parseInt(idStr, 10));

                if (existingIDs.has(normalizedCSVId)) {
                  continue;
                }

                tasks.push(async () => {
                  const url = `https://${domain}/action/bookmark/${normalizedCSVId}?action=add`;
                  try {
                    const response = await retryFetch(url);
                  } catch (error) {
                    console.error(`Line ${index + 1}: Error with id ${normalizedCSVId} after ${MAX_RETRIES} retries.`, error);
                  }
                  completed++;
                  importButton.innerHTML = `Importing (${completed} of ${tasks.length})`;
                  await delay(DELAY_TIMING);
                });
              }

              const total = tasks.length;
              if (total === 0) {
                alert("No ew bookmarks to import.");
                return;
              }
              let completed = 0;

              const runTasks = async (tasks, limit) => {
                let index = 0;
                const runners = [];
                const next = async () => {
                  if (index >= tasks.length) return;
                  const currentTask = tasks[index++];
                  await currentTask();
                  await next();
                };
                for (let i = 0; i < limit; i++) {
                  runners.push(next());
                }
                await Promise.all(runners);
              };

              await runTasks(tasks, CONCURRENCY_LIMIT);
            } finally {
              location.reload();
            }
          };
          reader.readAsText(file);
        }
        document.body.removeChild(input);
      });
      input.click();
    });
  }

  // Export bookmarks based on selected format and domain
  const exportButton = document.getElementById(exportButtonID);
  if (exportButton) {
    exportButton.addEventListener("click", async function () {
      const format = document.getElementById("export_option").value;
      const inclURLCheck = document.getElementById(inclURL).checked;
      let bookmarkHeader = "";
      if (format === "csv") {
        bookmarkHeader = inclURLCheck ? `"ID","Title","Viewed","URL"\n` : `"ID","Title","Viewed"\n`;
      } else {
        bookmarkHeader = `===========================\n${domain} ${bmLabel}\n===========================\n`;
      }
      bookmarkedTitles = bookmarkHeader;

      if (mangagakalotDomains.includes(tld)) {
        exportButton.innerHTML = "Generating File...";
        exportButton.disabled = true;
        getBookmarks(inclURLCheck, bookmarkedTitles, format);
      } else if (domain === "mangakakalot.fun") {
        getFunBMs(inclURLCheck, format);
      }
    });
  }
})();
