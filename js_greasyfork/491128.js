// ==UserScript==
// @name		    Singularity Browser Extension
// @namespace		http://tampermonkey.net/
// @run-at		  document-idle
// @version		  1.31
// @grant		    unsafeWindow
// @grant		    GM_getValue
// @grant		    GM_setValue
// @icon		    https://schaken-mods.com/mods/Schaken/UnityAssets/Singularity/Singularity.png
// @author		  Schaken
// @description Browser extension that communicates with Singularity Extension
// @match		    https://www.nexusmods.com/users/myaccount?tab=download+history
// @match		    https://next.nexusmods.com/settings/api-keys*
// @match		    https://www.nexusmods.com/*/mods*?tab=files&file_id=*
// @match		    https://www.nexusmods.com/*/mods*?tab=files
// @match		    https://www.nexusmods.com/*/mods*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/491128/Singularity%20Browser%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/491128/Singularity%20Browser%20Extension.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var { body: bodyElement, head: headElement } = document;
	var titleElement = headElement.querySelector("title");
	var _gameId = null;
	var _tabContentDiv = null;
	var _modTabsUl = null;
	var _section = null;

	function scrapeAndConstructURL() {
		const modLinks = document.querySelectorAll('.tracking-mod a');
		const downloadDates = document.querySelectorAll('.table-download');
		const gameAndMods = [];

		modLinks.forEach((link, index) => {
			const url = new URL(link.href);
			const pathSegments = url.pathname.split('/');

			const game = pathSegments[1];
			const mod = pathSegments[3];

			if (index < downloadDates.length - 1) {
				const dateString = downloadDates[index + 1].textContent.trim();

				gameAndMods.push(`${game}?${mod}?${dateString}`);
			} else {
				console.warn(`No download date found for mod ${mod}`);
			}
		});

		const customURL = `schakenmods://ModHandler/Nexus/MyMods/${gameAndMods.join('/')}`;
		window.open(customURL, '_blank');
	}

///////////////////////////////////////////////////////
///////////////// NEXUS MODS API GRABBER //////////////
///////////////////////////////////////////////////////

	function extractCode() {
		const inputElement = document.querySelector('input[aria-label="api key"]');
		if (inputElement) {
			return inputElement.value;
		}
		return null;
	}

	function constructURL(code) {
		return `schakenmods://ModHandler/NexusLogin/${code}`;
	}

  function AddSingularityAPI() {
      const targetClass = ".flex.flex-col.items-center.sm\\:flex-row.md\\:gap-x-4";
      const singularityClass = "singularity"; // Class to identify the inserted element

      // Find the first div with the specified class
      const targetDiv = document.querySelector(targetClass);

      // Check if an element with the singularity class already exists
      const existingSingularity = document.querySelector(`.${singularityClass}`);

      if (targetDiv && !existingSingularity) {
          // Create a new div element to hold the provided HTML structure
          const singularityDiv = document.createElement('div');
          singularityDiv.innerHTML = `
              <div class="flex flex-col items-center sm:flex-row md:gap-x-4 singularity">
                  <div class="flex w-[10rem] justify-start object-contain pb-8 sm:flex-shrink-0 sm:py-0">
                      <img alt="Singularity" src="https://schaken-mods.com/mods/Schaken/UnityAssets/Singularity/Singularity.png">
                  </div>
                  <span class="ml-4 flex flex-col gap-y-4">
                      <p class="font-montserrat font-semibold text-lg leading-tight tracking-wide text-neutral-strong">
                          Singuarity Mod Handler
                      </p>
                      <p class="font-roboto text-sm leading-normal tracking-normal text-neutral-strong">
                          A mod handler used for Schaken-Mods and NexusMods to download mods, handle backups, and keeping mods up to date!
                      </p>
                      <div class="flex gap-4">
                          <button style="padding-left:50px;border-radius:115px;padding:-10px 97px" class="font-montserrat font-semibold text-sm leading-none tracking-wider uppercase text-center leading-none flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-focus-subdued focus:outline-offset-2 rounded px-4 py-1 cursor-pointer bg-primary-moderate fill-neutral-strong text-neutral-strong border-transparent aria-expanded:bg-primary-subdued focus:bg-primary-strong hover:bg-primary-subdued xs:w-auto" type="button" aria-label="Send to Singularity">
                              <img src="https://schaken-mods.com/mods/Schaken/UnityAssets/Singularity/Singularity.png" style="width:55px;height:55px;position:absolute;top:-10px;left:-10px;">

                              Send To Singularity
                          </button>
                      </div>
                  </span>
              </div>
              <br>
              <div class="bg-stroke-weak h-px"></div>
          `;

          // Insert the provided HTML structure before the target div
          targetDiv.parentNode.insertBefore(singularityDiv, targetDiv);
          console.log('Singularity HTML structure inserted successfully.');

          // Attach the event listener to the button
          const button = singularityDiv.querySelector('button');
          button.addEventListener('click', function() {
              const code = extractCode();
              if (code) {
                  const url = constructURL(code);
                  window.open(url, '_blank');
              }
          });
      }
  }

///////////////////////////////////////////////////////
////////////// NEXUS MODS Images GRABBER //////////////
///////////////////////////////////////////////////////

    function extractPartialLinks() {
        const ulElement = document.querySelector('ul.thumbgallery.gallery.clearfix');
        if (!ulElement) return [];

        const imgElements = ulElement.querySelectorAll('li');
        const partialLinks = [];

        imgElements.forEach(li => {
            const src = li.getAttribute('data-src');
            const match = src.match(/\/mods\/(.+)/);
            if (match) {
                partialLinks.push(match[1]);
            }
        });

        return partialLinks;
    }

    // Function to create the deep link
    function createDeepLink(partialLinks) {
        const base = 'schakenmods://ModHandler/ImportImages';
        const links = partialLinks.join(',');
        return `${base},${links}`;
    }

    // Main function to execute the script
    function NexusImageGrabber() {
        const partialLinks = extractPartialLinks();
        const deepLink = createDeepLink(partialLinks);
        window.open(deepLink, '_blank');
    }

///////////////////////////////////////////////////////
////////////// NEXUS MODS Images GRABBER END //////////
///////////////////////////////////////////////////////

	async function generateDownloadUrl(gameId, fileId) {
		const res = await fetch("/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl", {
			headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
			},
			body: `game_id=${gameId}&fid=${fileId}`,
			method: "POST"
		});
		const resJson = await res.json();
		return "schakenmods://ModHandler/NexusMod/"+resJson.url;
	}

	function getMainContentDiv() {
		return document.getElementById("mainContent");
	}

	function getSection() {
		!_section && (_section = getMainContentDiv().querySelector(":scope > section"));
		return _section;
	}

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

	function getModTabsUl() {
		_modTabsUl ||= _modTabsUl = getTabsDiv().querySelector(":scope > ul.modtabs");
		return _modTabsUl;
	}

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

	function getArchivedFilesContainerDiv() {
		return document.getElementById("file-container-archived-files");
	}

	function isArchivedFilesTab() {
		return getCurrentTab() === "files" && getModFilesDiv() !== null && getArchivedFilesContainerDiv() !== null;
	}

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

	function clickedTabContentLoaded() { // Clicked Files tab - trigger to add buttons
		return new Promise((resolve) => {
			observeAddDirectChildNodes(getTabContentDiv(), (mutationList, observer) => {
			console.log("tabContentDiv add childNodes mutationList:", mutationList);
			observer.disconnect();
			resolve(0);
			});
		});
	}

	function ModFiles() { // Locate non Archived Mods
		function _inner() {
			const modFilesDiv = getModFilesDiv();
			if (modFilesDiv) {
			const map = getAllFileDtAndDdMap();
			if (!map)
				return;
			for (const [dt, dd] of map) {
				insertComponent(dt, dd);
			}
			}
		}
		getCurrentTab() === "files" && isFilesTab() && _inner();
		clickTabLi(async (clickedTab) => {
			clickedTab === "files" && await clickedTabContentLoaded() === 0 && isFilesTab() && _inner();
		});
	}

	function ArchivedFiles() { // Locate "Archived" mod files
		function _inner() {
			const archivedFilesContainerDiv = getArchivedFilesContainerDiv();
			if (archivedFilesContainerDiv) {
			const map = getAllFileDtAndDdMap();
			if (!map)
				return;
			for (const [dt, dd] of map) {
				insertComponent(dt, dd);
			}
			}
		}
		getCurrentTab() === "files" && isArchivedFilesTab() && _inner();
		clickTabLi(async (clickedTab) => {
			clickedTab === "files" && await clickedTabContentLoaded() === 0 && isArchivedFilesTab() && _inner();
		});
	}

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

	function getDownloadButtonsTr() {
		const pageLayoutDiv = getPageLayoutDiv();
		return pageLayoutDiv ? pageLayoutDiv.querySelector(":scope > div.table > table > tfoot > tr") : null;
	}

	function FileTabLocater() {
		function _inner() {
			const downloadButtonsTr = getDownloadButtonsTr();
			if (!downloadButtonsTr)
			return;
			const firstCell = downloadButtonsTr.cells[0];
			if (firstCell.children.length > 0)
			return;
		}
		getCurrentTab() === "files" && isFileTab() && _inner();
		clickTabLi(async (clickedTab) => {
			clickedTab === "files" && await clickedTabContentLoaded() === 0 && isFileTab() && _inner();
		});
	}

	function ModPage() {
		ModFiles();
		ArchivedFiles();
		FileTabLocater();
		console.log("%c [Info]", "color: green");
	}

	function ButtonStyle(button, position) {
		button.className = "btn inline-flex";
		button.style.borderRadius = "15px";
		button.style.padding = "-10px 7px";
		button.style.backgroundColor = "#d98f40";
		button.style.position = position;
		button.addEventListener("mouseover", function() {
			this.style.backgroundColor = "#c87b28";
		});
		button.addEventListener("mouseout", function() {
			this.style.backgroundColor = "#d98f40";
		});
	}

	function AddButtonImage(newAnchor) {
		const newImg = document.createElement("img");
		newImg.setAttribute("class", "icon icon-manual");
		newImg.setAttribute("src", "https://schaken-mods.com/mods/Schaken/UnityAssets/Singularity/Singularity.png");
		newImg.style.width = "55px";
		newImg.style.height = "55px";
		newImg.style.position = "absolute";
		newImg.style.top = "-10px";
		newImg.style.left = "-10px";
		newAnchor.appendChild(newImg);
	}

	function myDownloadsButton() {
		const button = document.createElement('button');
		ButtonStyle(button, "fixed");
		button.textContent = 'Send to Singularity';
		button.style.paddingLeft = "50px";
		button.style.bottom = '10px';
		button.style.right = '10px';
		button.style.zIndex = '9999';
    button.style.font = '14px';
		button.onclick = scrapeAndConstructURL;
		AddButtonImage(button);
		document.body.appendChild(button);
	}

	function myImagesButton() {
		const button = document.createElement('button');
		ButtonStyle(button, "fixed");
		button.textContent = 'Send Images to Singularity';
		button.style.paddingLeft = "50px";
		button.style.bottom = '10px';
		button.style.right = '10px';
		button.style.zIndex = '9999';
    button.style.font = '14px';
		button.onclick = NexusImageGrabber;
		AddButtonImage(button);
		document.body.appendChild(button);
	}

  function insertTestButton() {
    const button = document.createElement('button');
    button.textContent = 'Login to Singularity';
    document.body.appendChild(button); // Append the button to the body
  }

  function insertComponent(fileHeaderDt, fileDescriptionDd) {
    const newLi = document.createElement("li");
    const newAnchor = document.createElement("a");
    newAnchor.href = "#";
    ButtonStyle(newAnchor, "relative");
    newLi.appendChild(newAnchor);
    AddButtonImage(newAnchor);
    const newSpan = document.createElement("span");
    newSpan.innerText = "Download with Singularity";
    newSpan.className = "flex-label";
    newSpan.style.textTransform = "none";
    newSpan.style.marginLeft = "40px";
    newAnchor.appendChild(newSpan);
    newAnchor.addEventListener("click", async (event) => {
      event.preventDefault();
      let latestDownloadUrl;
      latestDownloadUrl = await generateDownloadUrl(getGameId(), getFileId(fileDescriptionDd));

      setDownloadedRecord(fileHeaderDt, toIsoLikeDateTimeString(new Date()));
      window.open(latestDownloadUrl, "_self");
    });
    getDownloadButtonsUl(fileDescriptionDd).appendChild(newLi);
    return newLi;
  }

	window.onload = function() {
    if (window.location.href.includes('nexusmods.com')) {
      if (window.location.href.includes('https://www.nexusmods.com/users/myaccount?tab=download+history')) {
        myDownloadsButton('Send to Singularity', 'rj-standard-button', scrapeAndConstructURL);
      } else if (window.location.href.includes('https://next.nexusmods.com/settings/api-keys')) {
        setInterval(AddSingularityAPI, 250);
      } else if (window.location.href.includes('/mods/')) {
        ModPage();
        if (window.location.href.includes('?GetImages=true')) {
          myImagesButton('Send Images to Singularity', 'rj-standard-button', scrapeAndConstructURL);
        }
      }
    }
	};
})();
