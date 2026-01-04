// ==UserScript==
// @name        Download No Wait by sylin527
// @namespace   https://www.nexusmods.com
// @match       https://www.nexusmods.com/*/mods*?tab=files&file_id=*
// @match       https://www.nexusmods.com/*/mods*?tab=files
// @match       https://www.nexusmods.com/*/mods*
// @run-at      document-idle
// @version     0.2.1.23.5.9
// @license     GPLv3
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @icon        https://www.nexusmods.com/favicon.ico
// @author      sylin527
// @description Download No Wait. No memory leak, performance. When you open mod files page or click files tab, it will add buttons, texted "Download No Wait", below file description. Also works on archived files.
// @downloadURL https://update.greasyfork.org/scripts/458874/Download%20No%20Wait%20by%20sylin527.user.js
// @updateURL https://update.greasyfork.org/scripts/458874/Download%20No%20Wait%20by%20sylin527.meta.js
// ==/UserScript==
(() => {
  // src/api/download_api.ts
  async function generateDownloadUrl(gameId, fileId) {
    const res = await fetch("/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: `game_id=${gameId}&fid=${fileId}`,
      method: "POST"
    });
    const resJson = await res.json();
    return resJson.url;
  }

  // src/site_shared.ts
  function getMainContentDiv() {
    return document.getElementById("mainContent");
  }
  var _section = null;
  function getSection() {
    !_section && (_section = getMainContentDiv().querySelector(":scope > section"));
    return _section;
  }

  // src/ui.ts
  var { body: bodyElement, head: headElement } = document;
  var titleElement = headElement.querySelector("title");
  var primaryColor = "#8197ec";
  var primaryHoverColor = "#a4b7ff";
  function overPrimaryComponent(element) {
    const style = element.style;
    element.addEventListener("mouseover", function() {
      style.backgroundColor = primaryHoverColor;
    });
    element.addEventListener("mouseleave", function() {
      style.backgroundColor = primaryColor;
    });
  }

  // src/mod_page/tabs_shared.ts
  var _gameId = null;
  function getGameId() {
    _gameId ||= _gameId = parseInt(getSection().getAttribute("data-game-id"));
    return _gameId;
  }
  function getFeaturedBelowDiv() {
    return getSection().querySelector(":scope > div.wrap > div:nth-of-type(2).wrap");
  }
  function getTabsDiv() {
    return getFeaturedBelowDiv().querySelector(":scope > div:nth-of-type(2) > div.tabs");
  }
  var _modTabsUl = null;
  function getModTabsUl() {
    _modTabsUl ||= _modTabsUl = getTabsDiv().querySelector(":scope > ul.modtabs");
    return _modTabsUl;
  }
  var _tabContentDiv = null;
  function getTabContentDiv() {
    return _tabContentDiv ||= _tabContentDiv = bodyElement.querySelector(
      "div.tabcontent.tabcontent-mod-page"
    );
  }
  function getCurrentTab() {
    const modTabsUl = getModTabsUl();
    const tabSpan = modTabsUl.querySelector(":scope > li > a.selected > span.tab-label");
    return tabSpan.innerText.toLowerCase();
  }
  function getTabFromTabLi(tabLi) {
    const tabSpan = tabLi.querySelector(":scope > a[data-target] > span.tab-label");
    return tabSpan.innerText.toLowerCase();
  }
  function clickTabLi(callback) {
    const modTabsUl = getModTabsUl();
    const tabLis = modTabsUl.querySelectorAll(":scope > li[id^=mod-page-tab]");
    for (const tabLi of tabLis) {
      tabLi.addEventListener("click", (event) => {
        callback(getTabFromTabLi(tabLi), event);
      });
    }
  }

  // src/mod_page/archived_files_tab.ts
  function getArchivedFilesContainerDiv() {
    return document.getElementById("file-container-archived-files");
  }
  function isArchivedFilesTab() {
    return getCurrentTab() === "files" && getModFilesDiv() !== null && getArchivedFilesContainerDiv() !== null;
  }

  // src/mod_page/files_tab.ts
  function isFilesTab() {
    return getCurrentTab() === "files" && getModFilesDiv() !== null && getArchivedFilesContainerDiv() === null;
  }
  function getModFilesDiv() {
    return document.getElementById("mod_files");
  }
  function getAllFileDls() {
    const modFilesDiv = getModFilesDiv();
    return modFilesDiv ? modFilesDiv.querySelectorAll(":scope > div.files-tabs > div.accordionitems > dl.accordion") : null;
  }
  function getAllFileDtAndDdMap() {
    const fileDls = getAllFileDls();
    if (!fileDls)
      return null;
    const map = /* @__PURE__ */ new Map();
    for (const fileDl of fileDls) {
      const children = fileDl.children;
      for (let i = 0; i < children.length; i = i + 2) {
        map.set(children[i], children[i + 1]);
      }
    }
    return map;
  }
  function setDownloadedRecord(fileHeaderDt, dateDownloadedText) {
    const fileHeaderDiv = fileHeaderDt.querySelector(":scope > div");
    const downloadedIconI = fileHeaderDiv.querySelector(":scope > i.material-icons");
    const downloadStatsContainerDiv = fileHeaderDiv.querySelector(":scope > div.file-download-stats");
    const downloadStatsUl = downloadStatsContainerDiv.querySelector(":scope > ul.stats");
    const dateDownloadedLi = downloadStatsUl.querySelector(":scope > li.stat-downloaded");
    const dateUploadedLi = downloadStatsUl.querySelector(":scope > li.stat-uploaddate");
    if (downloadedIconI) {
      downloadedIconI.setAttribute("title", `You downloaded this mod file on ${dateDownloadedText}`);
    } else {
      const newI = document.createElement("i");
      newI.className = "material-icons";
      newI.setAttribute("style", "margin-top: 3px");
      newI.setAttribute("title", `You downloaded this mod file on ${dateDownloadedText}`);
      newI.innerText = "cloud_download";
      fileHeaderDiv.insertBefore(newI, downloadStatsContainerDiv);
    }
    if (dateDownloadedLi) {
      const statDiv = dateDownloadedLi.querySelector(":scope > div.statitem > div.stat");
      statDiv.innerText = dateDownloadedText;
    } else {
      const newLi = document.createElement("li");
      newLi.className = "stat-downloaded";
      newLi.innerHTML = `
<div class="statitem">
  <div class="titlestat">Downloaded</div>
  <div class="stat">${dateDownloadedText}</div>
</div>
`;
      downloadStatsUl.insertBefore(newLi, dateUploadedLi);
    }
  }
  function getDownloadButtonContainerDiv(fileDescriptionDd) {
    return fileDescriptionDd.querySelector("div.tabbed-block:nth-of-type(2)");
  }
  function getDownloadButtonsUl(fileDescriptionDd) {
    return getDownloadButtonContainerDiv(fileDescriptionDd).querySelector("ul.accordion-downloads");
  }
  function getFileId(headerDtOrDescriptionDd) {
    return parseInt(headerDtOrDescriptionDd.getAttribute("data-id"));
  }

  // src/util.ts
  function toIsoLikeDateTimeString(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.toTimeString().substring(0, 8)}`;
  }
  function observeDirectChildNodes(targetNode, callback) {
    const observer = new MutationObserver((mutationList) => {
      callback(mutationList, observer);
    });
    observer.observe(targetNode, {
      childList: true,
      attributes: false,
      subtree: false
    });
    return observer;
  }
  function observeAddDirectChildNodes(targetNode, callback) {
    return observeDirectChildNodes(targetNode, (mutationList, observer) => {
      for (let index = 0; index < mutationList.length; index++) {
        const mutation = mutationList[index];
        const isAddNodesMutation = mutation.addedNodes.length > 0;
        if (isAddNodesMutation) {
          callback(mutationList, observer);
          break;
        }
      }
    });
  }

  // ../../../../Workspaces/@lyne408/userscript_lib/mod.ts
  function setValue(name2, value) {
    return GM_setValue(name2, value);
  }
  function getValue(name2) {
    return GM_getValue(name2);
  }

  // src/mod_page/tabs_shared_actions.ts
  function clickedTabContentLoaded() {
    return new Promise((resolve) => {
      observeAddDirectChildNodes(getTabContentDiv(), (mutationList, observer) => {
        console.log("tabContentDiv add childNodes mutationList:", mutationList);
        observer.disconnect();
        resolve(0);
      });
    });
  }

  // src/shared.ts
  function isSylin527() {
    const value = getValue("isSylin527");
    return typeof value === "boolean" ? value : false;
  }

  // src/mod_page/files_tab_actions.ts
  function insertDownloadNoWaitComponent(fileHeaderDt, fileDescriptionDd) {
    const newLi = document.createElement("li");
    const newAnchor = document.createElement("a");
    newAnchor.className = "btn inline-flex";
    newAnchor.href = "#";
    newLi.appendChild(newAnchor);
    const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newSvg.setAttribute("class", "icon icon-manual");
    newSvg.innerHTML = `<use xlink:href="https://www.nexusmods.com/assets/images/icons/icons.svg#icon-manual"></use>`;
    newAnchor.appendChild(newSvg);
    const newSpan = document.createElement("span");
    newSpan.innerText = "Download No Wait";
    newSpan.className = "flex-label";
    newSpan.style.textTransform = "none";
    newAnchor.appendChild(newSpan);
    newAnchor.addEventListener("click", async (event) => {
      event.preventDefault();
      let latestDownloadUrl;
      if (isSylin527()) {
        const latestDownloadUrlAttr = "latest-download-url";
        const dateLastDownloadedAttr = "date-last-downloaded";
        latestDownloadUrl = fileDescriptionDd.getAttribute(latestDownloadUrlAttr);
        const dateLastDownloaded = fileDescriptionDd.getAttribute(dateLastDownloadedAttr);
        if (!latestDownloadUrl || dateLastDownloaded && Date.now() - parseInt(dateLastDownloaded) > 60 * 60 * 1e3) {
          latestDownloadUrl = await generateDownloadUrl(getGameId(), getFileId(fileDescriptionDd));
          fileDescriptionDd.setAttribute(latestDownloadUrlAttr, latestDownloadUrl);
          fileDescriptionDd.setAttribute(dateLastDownloadedAttr, Date.now().toString());
        }
      } else {
        latestDownloadUrl = await generateDownloadUrl(getGameId(), getFileId(fileDescriptionDd));
      }
      setDownloadedRecord(fileHeaderDt, toIsoLikeDateTimeString(new Date()));
      window.open(latestDownloadUrl, "_self");
    });
    getDownloadButtonsUl(fileDescriptionDd).appendChild(newLi);
    return newLi;
  }
  function insertDownloadNoWaitComponents() {
    function _inner() {
      const modFilesDiv = getModFilesDiv();
      if (modFilesDiv) {
        const map = getAllFileDtAndDdMap();
        if (!map)
          return;
        for (const [dt, dd] of map) {
          insertDownloadNoWaitComponent(dt, dd);
        }
      }
    }
    getCurrentTab() === "files" && isFilesTab() && _inner();
    clickTabLi(async (clickedTab) => {
      clickedTab === "files" && await clickedTabContentLoaded() === 0 && isFilesTab() && _inner();
    });
  }

  // src/mod_page/archived_files_tab_actions.ts
  function insertDownloadNoWaitComponents2() {
    function _inner() {
      const archivedFilesContainerDiv = getArchivedFilesContainerDiv();
      if (archivedFilesContainerDiv) {
        const map = getAllFileDtAndDdMap();
        if (!map)
          return;
        for (const [dt, dd] of map) {
          insertDownloadNoWaitComponent(dt, dd);
        }
      }
    }
    getCurrentTab() === "files" && isArchivedFilesTab() && _inner();
    clickTabLi(async (clickedTab) => {
      clickedTab === "files" && await clickedTabContentLoaded() === 0 && isArchivedFilesTab() && _inner();
    });
  }

  // src/userscripts/userscripts_shared.ts
  var isProduction = true;
  function getAuthor() {
    return "sylin527";
  }

  // src/userscripts/download_no_wait/userscript.header.ts
  var name = `Download No Wait by ${getAuthor()}${isProduction ? "" : " Development Version"}`;
  var version = `0.2.1.23.5.9`;

  // src/mod_page/file_tab.ts
  function getPageLayoutDiv() {
    return getTabContentDiv().querySelector(":scope > div.container > div.page-layout");
  }
  function getFileHeaderDiv() {
    const pageLayoutDiv = getPageLayoutDiv();
    return pageLayoutDiv ? pageLayoutDiv.querySelector(":scope > div.header") : null;
  }
  function isFileTab() {
    return getCurrentTab() === "files" && getModFilesDiv() === null && getFileHeaderDiv() !== null;
  }
  function getFileIdFromUrl(url) {
    const fileId = new URL(url).searchParams.get("file_id");
    return fileId ? parseInt(fileId) : null;
  }
  function getDownloadButtonsTr() {
    const pageLayoutDiv = getPageLayoutDiv();
    return pageLayoutDiv ? pageLayoutDiv.querySelector(":scope > div.table > table > tfoot > tr") : null;
  }

  // src/mod_page/file_tab_actions.ts
  function createDownloadNoWaitComponent() {
    const newAnchor = document.createElement("a");
    newAnchor.innerText = "Download No Wait";
    newAnchor.className = "rj-btn rj-btn-standard rj-btn-full";
    newAnchor.href = "#";
    newAnchor.style.textTransform = "none";
    newAnchor.style.border = "none";
    newAnchor.style.backgroundColor = primaryColor;
    overPrimaryComponent(newAnchor);
    newAnchor.addEventListener("click", async (event) => {
      event.preventDefault();
      const fileId = getFileIdFromUrl(location.href);
      const gameId = getGameId();
      let latestDownloadUrl;
      if (isSylin527()) {
        const latestDownloadUrlAttr = "latest-download-url";
        const dateLastDownloadedAttr = "date-last-downloaded";
        latestDownloadUrl = newAnchor.getAttribute(latestDownloadUrlAttr);
        const dateLastDownloaded = newAnchor.getAttribute(dateLastDownloadedAttr);
        if (!latestDownloadUrl || dateLastDownloaded && Date.now() - parseInt(dateLastDownloaded) > 60 * 60 * 1e3) {
          latestDownloadUrl = await generateDownloadUrl(gameId, fileId);
          newAnchor.setAttribute(latestDownloadUrlAttr, latestDownloadUrl);
          newAnchor.setAttribute(dateLastDownloadedAttr, Date.now().toString());
        }
      } else {
        latestDownloadUrl = await generateDownloadUrl(gameId, fileId);
      }
      window.open(latestDownloadUrl, "_self");
    });
    return newAnchor;
  }
  function insertDownloadNoWaitComponent2() {
    function _inner() {
      const downloadButtonsTr = getDownloadButtonsTr();
      if (!downloadButtonsTr)
        return;
      const firstCell = downloadButtonsTr.cells[0];
      if (firstCell.children.length > 0)
        return;
      const newAnchor = createDownloadNoWaitComponent();
      firstCell.appendChild(newAnchor);
    }
    getCurrentTab() === "files" && isFileTab() && _inner();
    clickTabLi(async (clickedTab) => {
      clickedTab === "files" && await clickedTabContentLoaded() === 0 && isFileTab() && _inner();
    });
  }

  // src/userscripts/download_no_wait/userscript.main.ts
  function initStorage() {
    const bSylin527 = getValue("isSylin527");
    bSylin527 === void 0 && setValue("isSylin527", false);
  }
  function main() {
    initStorage();
    insertDownloadNoWaitComponents();
    insertDownloadNoWaitComponents2();
    insertDownloadNoWaitComponent2();
    const scriptInfo = `Load userscript: ${name} ${version}`;
    console.log("%c [Info] " + scriptInfo, "color: green");
  }
  main();
})();
