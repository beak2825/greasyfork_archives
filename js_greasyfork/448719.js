// ==UserScript==
// @name         	Advanced Streaming | aniworld.to & s.to
// @name:de         Erweitertes Streaming | aniworld.to & s.to
// @namespace    	https://greasyfork.org/users/928242
// @version      	3.6.6
// @description  	Minimizing page elements to fit smaller screens and adding some usability improvements.
// @description:de 	Minimierung der Seitenelemente zur Anpassung an kleinere Bildschirme und Verbesserung der Benutzerfreundlichkeit.
// @author       	Kamikaze (https://github.com/Kamiikaze)
// @supportURL     	https://github.com/Kamiikaze/Tampermonkey/issues
// @iconURL      	https://s.to/favicon.ico
// @match        	https://s.to/serie/stream/*
// @match      		https://s.to/serienkalender*
// @match      		https://s.to/serien*
// @match      		https://s.to/genre*
// @match        	https://s.to/account/subscribed
// @match        	https://s.to/account/watchlist*
// @match        	https://aniworld.to/anime/stream/*
// @match      		https://aniworld.to/animekalender*
// @match      		https://aniworld.to/animes*
// @match      		https://aniworld.to/genre*
// @match        	https://aniworld.to/account/subscribed
// @match        	https://aniworld.to/account/watchlist*
// @require        	https://greasyfork.org/scripts/455253-kamikaze-script-utils/code/Kamikaze'%20Script%20Utils.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.js
// @resource        toastifyCss https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @license      	MIT
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448719/Advanced%20Streaming%20%7C%20aniworldto%20%20sto.user.js
// @updateURL https://update.greasyfork.org/scripts/448719/Advanced%20Streaming%20%7C%20aniworldto%20%20sto.meta.js
// ==/UserScript==

// Load Toastify CSS

// # # # # # #
// CONFIG
// You can disable features by replacing the value true with false.
// # # # # # #

// Enables shorter Window Tab Title
// Example: S3E8 - Black Clover | AniWorld.to
const enableShortWindowTitle = true;

// Hides the section of Season Suggestions below the video
const enableHideSeasonSuggestions = true;

// Closing the dropdown menu when mouse leaves (fix the perma-open menu)
const enableCloseMenuOnHoverLeave = true;

// Adding a Link below "Watch Trailer" to search for it on YT (Because sometimes there is a Homepage linked to the Anime)
const enableAddTrailerSearchLink = true;

// Adding a small box at bottom left to search the Anime on sites like MyAnimeList, Crunchyroll & more
const enableAddAnimeSearchBox = true;

// Enable/Disable search providers by changing the value either to true or false
// If you want to add your own provider let me know
const animeSearchProviderList = {
  Crunchyroll: false,
  aniSearch: false,
  AnimePlanet: false,
  Kitsu: true,
  MyAnimeList: true,
  "Amazon Video": true,
};

// Adding a small box at bottom left to search the Series on sites like Amazon, Netflix & more
const enableAddSeriesSearchBox = true;

// Enable/Disable search providers by changing the value either to true or false
// If you want to add your own provider let me know
const seriesSearchProviderList = {
  "Amazon Video": true,
  Netflix: true,
};

// Adding a small button at the right corner of the video frame to get to the next episode
const enableEpisodeNavButtons = true;

// Allows filtering the Series Calendar by subscribed series
// To use this feature you need to go to https://s.to/account/subscribed and wait for the script to save the
// subscribed series. After that you can go to https://s.to/serienkalender and use the filter.
const enableFilterSeriesCalendar = true;

// Adds a link to search series in the release calendar
const enableAddCalendarSearch = true;

// Enable improved Search Box
// When pressing a key, search box will be automatically focused. Clicking the search box will select all input.
// By clicking outside the search box and pressing a key, the search box will be focused and cleared for new input.
const enableImprovedSearchBox = true;

// Enables Notebox (Beta)
// Allows you to save notes to each Series/Animes
const enableNoteBox = false;

// # # # # # #
// Styling
// Some adjustments to layout.
// You can disable features by replacing the value true with false.
// # # # # # #

// Set the height of the video player. (in pixel)
// Set to 0 to disabled it. Default: 480
const reducePlayerHeight = 150;

// Hides the text to show/edit the description of the episode below episode title
const hideDescriptionEdit = true;

// Hides the language box above the video player
const hideLanguageBox = true;

// Hides seen episodes (marked green) from the Episode-List (You can still see them in the season overview
const hideSeenEpisodes = true;

// Use Scrollbar for Episode-List (good for seasons with a large amount of episodes)
const useScrollbarForEpisodeList = true;

/*** DO NOT CHANGE BELOW ***/

/* global Logger getStreamData waitForElm addGlobalStyle searchSeries GM_getResourceText */

const log = new Logger("Advanced Streaming");
let streamData = null;
let streamDetails = null;

(async () => {
  generateStyles();

  await getSubscribedSeries();
  hideSeen();
  sortWatchlist();

  if (enableFilterSeriesCalendar) filterSeriesCalendar();

  if (enableImprovedSearchBox) improvedSearchBox();

  streamData = await getStreamData();
  // streamDetails = await getStreamDetails()

  await toggleSubscribedSeries();

  if (hideSeenEpisodes) {
    if (streamData.currentEpisode !== 0) {
      addGlobalStyle(`
                #stream > ul:nth-child(4) li .seen {
                    display: none;
                }
        `);
    }
  }

  /**
     {
		"host": "aniworld.to",
		"title": "Komi Can’t Communicate",
		"currentSeason": 2,
		"seasonsCount": 2,
		"currentEpisode": 1,
		"episodesCount": 12,
		"episodeTitle": {
			"de": "Es ist nur der Winteranfang. Und mehr.",
			"en": "It's just the arrival of winter. Plus more."
		},
		"hasMovies": false
	}
     **/
  console.log("streamData:", streamData);

  /**
     {
		"title": "Komi Can’t Communicate",
		"seasonsCount": 2,
		"episodesCount": 12,
		"episodeTitle": {
			"de": "Es ist nur der Winteranfang. Und mehr.",
			"en": "It's just the arrival of winter. Plus more."
		},
		"hasMovies": false
    }
     **/
  console.log("streamDetails:", streamDetails);

  // Features

  if (enableShortWindowTitle) shortWindowTitle();

  if (enableHideSeasonSuggestions) hideSeasonSuggestions();

  if (enableCloseMenuOnHoverLeave) closeMenuOnHoverLeave();

  if (enableAddTrailerSearchLink) addTrailerSearchLink();

  if (enableAddAnimeSearchBox) addAnimeSearchBox();

  if (enableAddSeriesSearchBox) addSeriesSearchBox();

  if (enableEpisodeNavButtons) addEpisodeNavButtons();

  if (enableAddCalendarSearch) addCalendarSearch();

  if (enableNoteBox) addNotesBox();

  fixAnimeTrailerWatchButton();
})();

function hideSeen() {
  const subscribedSeries = localStorage.subscribedSeries;
  let animeList = document.querySelector(".seriesListContainer");
  if (!animeList || !subscribedSeries) return;
  animeList = animeList.children;

  for (let i = 0; i < animeList.length; i++) {
    let anime = animeList[i];
    let title = anime.querySelector("h3")?.innerText;
    if (subscribedSeries.includes(title)) {
      log.debug(title, "found");
      anime.querySelector("a").classList.add("subbed");
    }
  }
  addGlobalStyle(`
            .seriesListContainer a.subbed {filter: blur(1px) grayscale(1) opacity(0.5);}
            .seriesListContainer a.subbed:hover {filter: unset;}
            .seriesListContainer>div>a:hover h3 {white-space: break-spaces;}
        `);
}

async function addNotesBox() {
  //const container = await waitForElm("#series > section > div.container.row")
  const container = document.querySelector(
    "#series > section > div.container.row",
  );
  const notesVisible = localStorage.getItem(`notes-visible`) === "true";
  console.error("notesVisible", notesVisible);
  if (!container) return;

  const notesEl = document.createElement("div");
  notesEl.id = "notes-box";
  notesEl.innerHTML = `
<div id="notes-toolbar">
    <button id="notes-save">Save Notes</button>
    <button id="notes-toggle">${notesVisible ? "Show" : "Hide"} Notes</button>
</div>
<textarea id="notes-text" placeholder="Save Notes for this Anime" class="${notesVisible ? "seen" : "hidden"}" ></textarea>
`;
  container.append(notesEl);
  addGlobalStyle(
    `
		#notes-box {
			display: flex;
			flex-direction: column;
			position: relative;
			width: 100%;
		}
		#notes-box.hidden {
			display: none;
		}

		#notes-toolbar {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: flex-end;
			align-items: center;
			padding-top: 10px;
		}

		#notes-toolbar > button {
			font-size: 13px;
			text-align: center;
			cursor: pointer;
			display: block;
			color: #fff;
			background: #637cf9;
			border-radius: 3px;
			padding: 10px;
			font-weight: 600;
			text-transform: uppercase;
			margin-left: 10px;
		}
	`,
    false,
  );
  const title = window.location.pathname.split("/")[3];
  const notesText = document.getElementById("notes-text");
  notesText.value = localStorage.getItem(`notes-${title}`);

  const saveBtn = document.getElementById("notes-save");
  saveBtn.addEventListener("click", () => {
    localStorage.setItem(`notes-${title}`, notesText.value);
    saveBtn.innerHTML = "Saved!";
    saveBtn.style.backgroundColor = "green";
    setTimeout(() => {
      saveBtn.innerHTML = "Save Notes";
      saveBtn.style.backgroundColor = "";
    }, 2000);

    notify("Notes saved");
  });

  const toggleBtn = document.getElementById("notes-toggle");
  toggleBtn.addEventListener("click", () => {
    const notes = document.getElementById("notes-text");
    const hidden = notes.classList.toggle("hidden");
    hidden
      ? (toggleBtn.innerHTML = "Show Notes")
      : (toggleBtn.innerHTML = "Hide Notes");
    localStorage.setItem(`notes-visible`, !hidden);
  });
}

async function sortWatchlist() {
  if (!window.location.pathname.includes("watchlist")) return;

  const nav = await waitForElm(".seriesListNavigation");
  nav.innerHTML = nav.innerHTML.replace("oder", "|");
  nav.style = `{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    gap: 10px;
}`;
  const sortByGenre = document.createElement("a");
  sortByGenre.href = "/account/watchlist/genre";
  sortByGenre.innerText = "Genre";

  nav.append(" | ");
  nav.append(sortByGenre);

  const sortOrder = window.location.pathname.split("/")[3];
  if (!sortOrder) return;

  const sortReset = document.createElement("a");
  sortReset.href = "/account/watchlist";
  sortReset.innerText = "Zurücksetzen";
  sortReset.style = "color: #cd3e3e;";

  nav.append(" | ");
  nav.append(sortReset);

  const sortTag = sortOrder === "genre" ? "small" : "h3";

  // Select the container
  const container = await waitForElm(".seriesListContainer");

  // Convert HTMLCollection to an array
  const elementArray = Array.from(container.children);

  // Sort the array based on the text content of the h3 elements
  elementArray.sort((a, b) => {
    const titleA = a.querySelector(sortTag).textContent.trim();
    const titleB = b.querySelector(sortTag).textContent.trim();

    if (sortOrder === "asc" || sortOrder === "genre")
      return titleA.localeCompare(titleB);
    return titleB.localeCompare(titleA);
  });

  // Re-append the sorted elements to the container
  elementArray.forEach((element) => container.appendChild(element));
}

function generateStyles() {
  const toastifyCss = GM_getResourceText("toastifyCss");
  GM_addStyle(toastifyCss);

  if (reducePlayerHeight > 0) {
    addGlobalStyle(`
            .inSiteWebStream, .inSiteWebStream iframe {height: ${reducePlayerHeight}px; }
            .hosterSiteTitle {padding: 5px 0 10px;}
        `);
  }

  if (hideDescriptionEdit) {
    addGlobalStyle(`
            .descriptionSpoilerLink, .descriptionSpoilerPlaceholder,
            .submitNewDescription, .submitNewTitle, .hosterSectionTitle {
                display: none;
            }
        `);
  }

  if (hideLanguageBox) {
    addGlobalStyle(`
            .changeLanguageBox {
                display: none;
            }
        `);
  }

  if (useScrollbarForEpisodeList) {
    addGlobalStyle(`
			#stream > ul:nth-child(4) {
				overflow-x: auto;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				flex-wrap: nowrap;
				align-items: center;
			}

			#stream > ul:nth-child(4) li:nth-child(1) {
				position: absolute;
			}

			#stream > ul:nth-child(4) > li:nth-child(2) {
				margin-left: 119px;
			}

			/* ===== Scrollbar CSS ===== */
			  /* Firefox */
			  * {
				scrollbar-height: auto;
				scrollbar-color: #637cf9 #243743;
			  }

			  /* Chrome, Edge, and Safari */
			  #stream > ul:nth-child(4)::-webkit-scrollbar {
				height: 10px;
			  }

			  #stream > ul:nth-child(4)::-webkit-scrollbar-track {
				background: #243743;
			  }

			  #stream > ul:nth-child(4)::-webkit-scrollbar-thumb {
				background-color: #637cf9;
				border-radius: 10px;
				border: 1px solid #ffffff;
			  }
		`);
  }

  // Header Section and Backdrop Image size
  addGlobalStyle(`
		section.title {
			min-height: 450px;
		}
		#series .backdrop {
			height: 100%;
		}
	`);

  // seasonEpisodesList
  addGlobalStyle(`
		.seasonEpisodesList .editFunctions a,
		.seasonEpisodesList td:nth-child(4) a,
		.seasonEpisodesList .editFunctions {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-items: center;
			justify-content: center;
		}

		.seasonEpisodesList .editFunctions a .flag,
		.seasonEpisodesList .editFunctions img.flag,
		.seasonEpisodesList td:nth-child(4) a .icon {
			margin-right: 2px;
		}

		.seasonEpisodesList>tbody>tr>td {
			padding-right: 15px;
		}
		.seasonEpisodesList>tbody>tr>td:nth-child(1) {
			min-width: 110px;
		}
	`);
}

function shortWindowTitle() {
  if (!streamData.title) return;
  let pageTitle = "";
  if (streamData.currentSeason > 0) pageTitle += "S" + streamData.currentSeason;
  if (streamData.currentEpisode > 0)
    pageTitle += "E" + streamData.currentEpisode;
  window.document.title = `${pageTitle.length > 1 ? pageTitle + " - " : ""}${streamData.title} | ${streamData.host}`;
}

async function hideSeasonSuggestions() {
  if (!window.location.pathname.includes("episode")) return;

  const container = await waitForElm(".ContentContainerBox");
  if (!container) return;
  container.style = "display: none;";
  log.info("Season suggestions hidden");
}

async function closeMenuOnHoverLeave() {
  let menu = await waitForElm(".dd");
  menu.replaceWith(menu.cloneNode(true));
  menu = await waitForElm(".dd");

  const modal = await waitForElm(".modal");

  menu.addEventListener("mouseout", () => {
    modal.style = "display:none";
  });
  menu.addEventListener("mouseover", () => {
    modal.style = "display:block";
  });
}

async function addTrailerSearchLink() {
  const seriesTitle = streamData.title;
  const trailerBoxEl = await waitForElm(".add-series .collections");

  const ytSearchLink = "https://www.youtube.com/results?search_query=";

  const searchTrailerEl = document.createElement("li");
  searchTrailerEl.classList.add(
    "col-md-12",
    "col-sm-12",
    "col-xs-6",
    "buttonAction",
  );
  searchTrailerEl.innerHTML = `
		<div title="Deutschen Trailer von ${seriesTitle} bei YouTube suchen." itemprop="trailer" itemscope="" itemtype="http://schema.org/VideoObject">
			<a itemprop="url" target="_blank" href="${ytSearchLink + seriesTitle} Trailer Deutsch"><i class="fas fa-external-link-alt"></i><span class="collection-name">Trailer suchen</span></a>
			<meta itemprop="name" content="${seriesTitle} Trailer">
			<meta itemprop="description" content="Nach Offiziellen Trailer der TV-Serie ${seriesTitle} bei YouTube suchen.">
			<meta itemprop="thumbnailUrl" content="https://zrt5351b7er9.static-webarchive.org/img/facebook.jpg">
		</div>`;

  increaseHeaderSize();

  addLinkToList(trailerBoxEl, searchTrailerEl);
}

async function addCalendarSearch() {
  const seriesTitle = streamData.title;
  const trailerBoxEl = await waitForElm(".add-series .collections");

  const calendarUrl = (() => {
    if (getStreamPageLocation().host === "s.to") {
      return "https://s.to/serienkalender?q=" + seriesTitle;
    } else if (getStreamPageLocation().host === "aniworld.to") {
      return "https://aniworld.to/animekalender?q=" + seriesTitle;
    } else {
      log.error("Host not supported");
    }
  })();
  const searchCalendarEl = document.createElement("li");
  searchCalendarEl.classList.add(
    "col-md-12",
    "col-sm-12",
    "col-xs-6",
    "buttonAction",
  );
  searchCalendarEl.innerHTML = `
		<div title="Suche ${seriesTitle} im Release Kalender." itemprop="trailer" itemscope="" itemtype="http://schema.org/VideoObject">
			<a itemprop="url" target="_blank" href="${calendarUrl}"><i class="fas fa-external-link-alt"></i><span class="collection-name">Im Kalender suchen</span></a>
			<meta itemprop="name" content="${seriesTitle} Trailer">
			<meta itemprop="description" content="Suche ${seriesTitle} im Release Kalender.">
			<meta itemprop="thumbnailUrl" content="https://zrt5351b7er9.static-webarchive.org/img/facebook.jpg">
		</div>`;

  increaseHeaderSize();

  addLinkToList(trailerBoxEl, searchCalendarEl);
}

async function fixAnimeTrailerWatchButton() {
  const seriesTitle = streamData.title;
  const watchButton = await waitForElm(".trailerButton");
  if (!watchButton) return;
  watchButton.style.display = "none";

  if (!watchButton) return;

  const trailerBoxEl = await waitForElm(".add-series .collections");
  const watchTrailerPlaceholder = trailerBoxEl.querySelector(`li:nth-child(3)`);
  watchTrailerPlaceholder.removeChild(watchTrailerPlaceholder.children[0]);
  const watchTrailerEl = document.createElement("div");
  watchTrailerEl.innerHTML = `
		<div title="Trailer von ${seriesTitle} ansehen." itemprop="trailer" itemscope="" itemtype="http://schema.org/VideoObject">
			<a itemprop="url" target="_blank" href="${watchButton.href}"><i class="fas fa-external-link-alt"></i><span class="collection-name">Anime-Trailer</span></a>
			<meta itemprop="name" content="${seriesTitle} Trailer">
			<meta itemprop="description" content="Offiziellen Trailer der TV-Serie ${seriesTitle} jetzt ansehen.">
			<meta itemprop="thumbnailUrl" content="https://zrt5351b7er9.static-webarchive.org/img/facebook.jpg">
		</div>`;

  watchTrailerPlaceholder.append(watchTrailerEl);
}

function addLinkToList(parent, el) {
  if (!parent) return;
  const beforeElement = parent.querySelector(
    `li:nth-child(${parent.childElementCount})`,
  );

  parent.insertBefore(el, beforeElement);
}

async function increaseHeaderSize() {
  /**
   * @type {HTMLElement}
   */
  const header = await waitForElm("section.title");
  if (!header) return;
  const headerHeight = header.offsetHeight;

  if (headerHeight === 0) {
    log.debug("Header is not visible. Waiting for header to be visible");
    const observer = new MutationObserver(() => {
      if (header.offsetHeight > 0) {
        log.info("Header is visible. Increasing Header height");
        setTimeout(() => {
          increaseHeaderSize();
        }, 500);
        observer.disconnect();
      }
    });
    observer.observe(header, { attributes: true, attributeFilter: ["style"] });
  }
}

async function addAnimeSearchBox() {
  if (window.location.hostname !== "aniworld.to") return;
  const rightColEl = await waitForElm(".add-series");
  const seriesTitel = streamData.title;
  const searchBoxEl = document.createElement("div");
  searchBoxEl.classList.add("anime-search");
  const searchBoxTitel = document.createElement("p");
  searchBoxTitel.innerText = "Anime suchen auf:";

  if (!rightColEl) return;

  rightColEl.append(searchBoxEl);
  searchBoxEl.append(searchBoxTitel);

  const sites = [
    {
      domain: "crunchyroll.com",
      searchUrl: "https://www.crunchyroll.com/de/search?q=#TITEL#",
      name: "Crunchyroll",
    },
    {
      domain: "anisearch.de",
      searchUrl: "https://www.anisearch.de/anime/index?text=#TITEL#",
      name: "aniSearch",
    },
    {
      domain: "anime-planet.com",
      searchUrl: "https://www.anime-planet.com/anime/all?name=#TITEL#",
      name: "AnimePlanet",
    },
    {
      domain: "kitsu.io",
      searchUrl: "https://kitsu.io/anime?text=#TITEL#",
      name: "Kitsu",
    },
    {
      domain: "myanimelist.net",
      searchUrl: "https://myanimelist.net/anime.php?q=#TITEL#&cat=anime",
      name: "MyAnimeList",
    },
    {
      domain: "amazon.de",
      searchUrl: "https://www.amazon.de/s?k=#TITEL#&i=instant-video",
      name: "Amazon Video",
    },
  ];

  for (let i = 0; i < sites.length; i++) {
    const site = sites[i];

    if (animeSearchProviderList[site.name]) {
      const siteElement = document.createElement("a");
      siteElement.classList.add("sites");
      siteElement.target = "_blank";
      siteElement.href = site.searchUrl.replace("#TITEL#", seriesTitel);
      siteElement.innerHTML =
        `<img src="https://www.google.com/s2/favicons?sz=64&domain=${site.domain}" alt='${site.name} Logo Icon' />` +
        site.name;

      searchBoxEl.append(siteElement);
    }
  }
}

async function addSeriesSearchBox() {
  if (window.location.hostname !== "s.to") return;
  const rightColEl = await waitForElm(".add-series");
  const seriesTitel = streamData.title;
  const searchBoxEl = document.createElement("div");
  searchBoxEl.classList.add("anime-search");
  const searchBoxTitel = document.createElement("p");
  searchBoxTitel.innerText = "Serie suchen auf:";

  rightColEl.append(searchBoxEl);
  searchBoxEl.append(searchBoxTitel);

  const sites = [
    {
      domain: "amazon.de",
      searchUrl: "https://www.amazon.de/s?k=#TITEL#&i=instant-video",
      name: "Amazon Video",
    },
    {
      domain: "netflix.com",
      searchUrl: "https://www.netflix.com/search?q=#TITEL#",
      name: "Netflix",
    },
  ];

  for (let i = 0; i < sites.length; i++) {
    const site = sites[i];

    if (seriesSearchProviderList[site.name]) {
      const siteElement = document.createElement("a");
      siteElement.classList.add("sites");
      siteElement.target = "_blank";
      siteElement.href = site.searchUrl.replace("#TITEL#", seriesTitel);
      siteElement.innerHTML =
        `<img src="https://www.google.com/s2/favicons?sz=64&domain=${site.domain}" alt='${site.name} Logo Icon' />` +
        site.name;

      searchBoxEl.append(siteElement);
    }
  }
}

addGlobalStyle(`
.anime-search {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    margin: 15px 5px;
    background: #313d4f;
    padding: 15px;
    border-radius: 3px;
    width: fit-content;
    position: fixed;
    left: 0;
    bottom: -8px;
    z-index: 99;
}

.anime-search .sites {
    padding: 5px 0;
}

.anime-search .sites img {
    max-width: 32px;
    width: 16px;
    margin-right: 5px;
    border-radius: 16px;
}
`);

async function addEpisodeNavButtons() {
  if (!window.location.pathname.includes("episode")) return;

  const episodeControls = document.createElement("div");
  episodeControls.id = "episodeControls";

  const nextBtn = document.createElement("button");
  nextBtn.classList.add("nextBtn");
  nextBtn.innerText = "Next";

  const currentSeason = streamData.currentSeason;
  const currentEpisode = streamData.currentEpisode;
  const maxSeasons = streamData.seasonsCount;
  const maxEpisodes = streamData.episodesCount;

  nextBtn.addEventListener("click", function () {
    nextEpisode(currentSeason, currentEpisode, maxSeasons, maxEpisodes);
  });
  episodeControls.append(nextBtn);

  const videoContainer = await waitForElm(".hosterSiteVideo");
  videoContainer.insertBefore(
    episodeControls,
    videoContainer.querySelector(".inSiteWebStream"),
  );
}

function nextEpisode(currSeason, currEpisode, maxSeasons, maxEpisodes) {
  let nextEpisode = currEpisode + 1;
  let nextSeason = currSeason;

  log.debug({
    currSeason,
    currEpisode,
    maxSeasons,
    maxEpisodes,
    nextEpisode,
    nextSeason,
  });

  if (nextEpisode <= maxEpisodes) {
    log.info("Next Episode", nextEpisode);
  }
  if (nextEpisode > maxEpisodes) {
    nextSeason++;
    if (nextSeason <= maxSeasons) {
      log.info("Next Season", nextSeason);
      nextEpisode = 1;
      log.info("Next Episode", nextEpisode);
    }
    if (nextSeason > maxSeasons) {
      nextEpisode = false;
      notify("Last Episode of Last Season", undefined, "error");
    }
  }

  if (!nextEpisode) {
    notify("Episode not found", undefined, "error");
    return;
  }

  window.location.pathname =
    window.location.pathname.split("/").slice(0, 4).join("/") +
    `/staffel-${nextSeason}/episode-${nextEpisode}`;
}

addGlobalStyle(
  `
#episodeControls {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-end;
    align-items: center;
    margin: 10px 0;
}

#episodeControls button {
    width: 120px;
    height: fit-content;
    position: relative;
    padding: 10px 20px;
    background: #4160f9;
    color: #fff;
    font-size: 13px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.nextBtn::after {
    content: ">";
    padding-left: 10px;
}
`,
  false,
);

async function filterSeriesCalendar() {
  if (!window.location.pathname.includes("kalender")) return;

  log.info("Calendar Filter enabled");

  await getSubscribedSeries();

  let onlySubbedEpisodes = false;

  const container = await waitForElm("#seriesContainer");

  if (!container) throw new Error("Could not find seriesContainer");

  const filterToggleContainer = document.createElement("div");
  filterToggleContainer.id = "filterToggleContainer";

  const filterToggle = document.createElement("button");
  filterToggle.innerText = "Zeige nur Abonnierte Serien";
  filterToggle.id = "filterToggleButton";
  filterToggle.classList.add("button", "blue", "small");
  filterToggle.addEventListener("click", function () {
    toggleAiringEpisodes()
      .then(() => {
        onlySubbedEpisodes = !onlySubbedEpisodes;
        filterToggle.innerText = onlySubbedEpisodes
          ? "Zeige alle Serien"
          : "Zeige nur Abonnierte Serien";
      })
      .catch((error) => {
        log.error(`An error occurred while toggling airing episodes: ${error}`);
      });
  });

  filterToggleContainer.prepend(filterToggle);

  container.prepend(filterToggleContainer);
}

async function toggleSubscribedSeries() {
  const subButton = await waitForElm(".series-add ul > li:nth-child(1)");
  if (!subButton) return;

  subButton.addEventListener("click", () => {
    const isSubbed = subButton.classList.contains("true");
    const subscribesSeries = JSON.parse(
      localStorage.getItem("subscribedSeries"),
    );
    const title = streamData.title.trim();

    if (isSubbed) {
      const index = subscribesSeries.indexOf(title);
      if (index === -1) return;
      subscribesSeries.splice(index, 1);
    } else {
      subscribesSeries.push(title);
    }
    localStorage.setItem("subscribedSeries", JSON.stringify(subscribesSeries));
  });
}

async function getSubscribedSeries() {
  if (!window.location.href.includes("subscribed")) return;

  log.info("Getting subscribed series...");

  const container = await waitForElm(".seriesListContainer");

  if (!container) throw new Error("Could not find seriesListContainer");

  const subscsribedTitles = container.querySelectorAll("h3");

  const titles = Array.from(subscsribedTitles).map(
    (title) => title.textContent?.trim() || "",
  );

  if (titles.length > 0) {
    log.debug(`Found ${titles.length} subscribed series.`);

    localStorage.setItem("subscribedSeries", JSON.stringify(titles));

    log.info(`Saved ${titles.length} subscribed series.`);

    notify(`Saved ${titles.length} subscribed series.`);
  } else {
    log.warn("No subscribed series found.");
    notify("No subscribed series found.", undefined, "error");
  }

  return titles;
}

async function toggleAiringEpisodes() {
  log.info("Toggling airing episodes...");

  const subscribedSeries = localStorage.getItem("subscribedSeries");
  log.info(`Subscribed Series: ${subscribedSeries}`);

  if (!subscribedSeries || subscribedSeries.length === 0) {
    log.warn("No subscribed series found.");
    alert(`
No subscribed series found.

To use this feature you need to go to:
https://s.to/account/subscribed
and wait for the script to save the subscribed series. After that you can come back and use the filter.`);
    return;
  }

  const containers = document.querySelectorAll(".seriesListContainer");

  if (!containers) throw new Error("Could not find seriesListContainer");

  log.debug(`Found ${containers.length} containers`);

  containers.forEach((container) => {
    const episodes = container.querySelectorAll("div");

    log.debug(`Found ${episodes.length} episodes`);

    episodes.forEach((episode) => {
      const title = episode.querySelector("h3")?.innerText;

      if (title && !subscribedSeries?.includes(title)) {
        const isHidden = episode.style.display === "none";
        log.debug(
          `Hiding episode ${title} (${isHidden ? "hidden" : "visible"})`,
        );

        if (!isHidden) {
          episode.style.display = "none";
        } else {
          episode.style.display = "block";
        }
      }
    });
  });
}

addGlobalStyle(
  `
div#filterToggleContainer {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    padding: 15px 0 0;
}
`,
  false,
);

async function improvedSearchBox() {
  if (
    !window.location.pathname.includes("animes") &&
    !window.location.pathname.includes("serien") &&
    !window.location.pathname.includes("kalender")
  )
    return;

  let doNewSearch = false;

  const searchInput = await waitForElm("input#serInput");
  if (!searchInput) return;
  searchInput.focus();

  if (window.location.search.includes("q=")) {
    const searchQuery = window.location.search.split("q=")[1];
    log.info(`Found search query: ${searchQuery}`);
    searchInput.value = decodeURI(searchQuery)
      .replaceAll("+", " ")
      .replaceAll("’", "'");
    searchSeries(); // global function
  }

  document.addEventListener("keypress", () => {
    searchInput.focus();
    if (doNewSearch) {
      searchInput.value = "";
      doNewSearch = false;
    }
  });

  searchInput.addEventListener("click", () => {
    searchInput.select();
  });

  document.addEventListener("focusout", function (event) {
    if (event.target.id === "serInput") {
      doNewSearch = true;
    }
  });

  // Auto-Open Anime if only 1 result
  const genreList = document.getElementById("seriesContainer");
  const activeGenres = Array.from(genreList.children).filter(
    (g) => g.style.display !== "none",
  );
  console.log(activeGenres);

  if (activeGenres.length === 1) {
    const activeSeries = Array.from(
      activeGenres[0].querySelector("ul").children,
    ).filter((g) => g.style.display !== "none");
    console.log(activeSeries);

    if (activeSeries.length === 1) {
      activeSeries[0].querySelector("a").click();
    }
  }
}
