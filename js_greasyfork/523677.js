// ==UserScript==
// @name         Stream Watchtool
// @namespace    github/Johannes7k75/Stream-Watchtool
// @version      1.1.1
// @author       monkey
// @description  Lets you highlight watched episoded and seasons. Also highlights Filler episodes.
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        *://*/anime/stream/*
// @match        *://*/serie/stream/*
// @resource     fillers.json  https://github.com/Johannes7k75/tampermonkey-user-scripts/releases/download/daily-AniWorld-filler-release/fillers.json
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/523677/Stream%20Watchtool.user.js
// @updateURL https://update.greasyfork.org/scripts/523677/Stream%20Watchtool.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const r=document.createElement("style");r.textContent=t,document.head.append(r)})(" :root{--filler-color: rgb(161, 74, 64);--watched-color: rgb(35, 194, 101);--watched-color-hover: rgb(0, 172, 72);--watching-color: rgb(0, 105, 255);--watching-color-hover: rgb(0, 55, 131);--watching-color-2-hover: rgb(40, 47, 63)}.fa{position:absolute;transform:translate(-65px);font-size:46px}[class*=season][class*=EpisodeID]{display:flex!important;align-items:center!important;gap:15px!important;justify-content:left!important;padding:4px!important;white-space:nowrap!important;text-align:center!important;height:88px!important}[id*=NotWatched]{margin-left:0!important}.filler,.filler:hover{box-shadow:0 -8px var(--filler-color) inset;transition:unset!important}.filler>a,.filler td a:has(i),.filler:hover>a,.filler:hover td a:has(i){box-shadow:0 -8px var(--filler-color) inset}.watched,.watched>a{background-color:var(--watched-color)!important;transition:unset!important}li.watched:hover>a:not(.anything),li.watched>a.active{font-weight:700;color:var(--watched-color-hover)!important}tr.watched:hover{transition:unset!important;background-color:var(--watched-color-hover)!important}li.watching a{background-color:var(--watching-color)!important;transition:unset!important}li.watching a.active{font-weight:700;color:var(--watching-color)!important}li.watching:hover>a:not(.anything){font-weight:700;color:var(--watching-color)!important}.watching{background:linear-gradient(to right,var(--watching-color) var(--progress, 0%),transparent var(--progress, 0%),transparent 100%)}.watching:hover{background:linear-gradient(to right,var(--watching-color-hover) var(--progress, 0%),var(--watching-color-2-hover) var(--progress, 0%),var(--watching-color-2-hover) 100%)!important}.episodeMarker{float:right;display:flex;align-items:center;padding-left:40px;position:relative;cursor:pointer}.episodeMarker>i{font-size:25px;transform:translate(-35px)} ");

(function () {
  'use strict';

  var _GM_getResourceText = /* @__PURE__ */ (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_log = /* @__PURE__ */ (() => typeof GM_log != "undefined" ? GM_log : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var EpisodeState = /* @__PURE__ */ ((EpisodeState2) => {
    EpisodeState2[EpisodeState2["NotWatched"] = 0] = "NotWatched";
    EpisodeState2[EpisodeState2["Watched"] = 1] = "Watched";
    EpisodeState2[EpisodeState2["Watching"] = 2] = "Watching";
    return EpisodeState2;
  })(EpisodeState || {});
  const [seasonList, episodeList] = Array.from(document.querySelectorAll("#stream ul"));
  function getNumbersATags(element) {
    return Array.from(element.querySelectorAll("li:has(a) a")).filter((el) => {
      const num = Number.parseInt(el.innerHTML, 10);
      return !Number.isNaN(num) && typeof num === "number";
    });
  }
  const seasons = getNumbersATags(seasonList);
  const episodes = getNumbersATags(episodeList);
  const activeSeason = seasonList.querySelector("li a.active");
  const activeEpisode = episodeList.querySelector("li a.active");
  const episodesListTable = document.querySelector("tbody");
  function getAnimeWatchList() {
    const watchList = _GM_getValue("animeWatchList", []);
    _GM_log("Anime Watch List received", watchList);
    return watchList;
  }
  function setAnimeWatchList(animeWatchList) {
    _GM_log("Anime Watch List saved", animeWatchList);
    _GM_setValue("animeWatchList", animeWatchList);
  }
  window.resetWatchList = () => setAnimeWatchList([]);
  const seasonSelectionParentDiv = document.querySelector(".pageTitle");
  if (seasonSelectionParentDiv) {
    seasonSelectionParentDiv.innerHTML += `
<div class="dropDownContainer season">
    <div class="normalDropdownButton" data-active-status="1">Staffel gesehen? <i class="fas fa-chevron-down"></i></div>
        <div class="normalDropdown" style="display: none;">
        <span data-action="true" id="watched" class="clearAllEpisodesFromThisSeason season"><i class="fas fa-eye"></i> Gesehen</span>
        <span data-action="false" id="notWatched" class="clearAllEpisodesFromThisSeason season"><i class="fas fa-eye-slash"></i> Nicht gesehen</span>
    </div>
</div>`;
  }
  const episodeSelectionParentDiv = document.querySelector(".hosterSectionTitle");
  if (episodeSelectionParentDiv) {
    const episodeSelectionDiv = document.createElement("div");
    episodeSelectionDiv.className = "hosterSectionTitle episodeMarker";
    episodeSelectionDiv.innerHTML = `
  <i class="fa fa-eye"></i>
  <h3>Folge gesehen</h3>`;
    episodeSelectionParentDiv.after(episodeSelectionDiv);
  }
  const normalDropdown = document.querySelector(".normalDropdown");
  const dropDownContainer = document.querySelector(".dropDownContainer");
  const notWatchedButton = document.querySelector("#notWatched");
  const watchedButton = document.querySelector("#watched");
  const episodeMarker = document.querySelector(".episodeMarker");
  const titleElement = document.querySelector('h1[itemprop="name"] span');
  function updateButtons() {
    function getExistingAnime(animeName) {
      let anime = animeWatchList.find((anime2) => anime2.title === (animeName ?? title));
      if (anime) return anime;
      let allSeasonsNumber = seasonList.children.length - 1;
      if (seasonList.children[1].children[0].innerHTML === "Filme") {
        allSeasonsNumber = seasonList.children.length - 2;
      }
      anime = {
        title,
        link: "",
        allSeasonsNumber,
        seasons: []
      };
      animeWatchList.push(anime);
      const existingAnime2 = animeWatchList[animeWatchList.length - 1];
      setAnimeWatchList(animeWatchList);
      return existingAnime2;
    }
    function getExistingSeason(seasonNumber) {
      const existingAnime2 = getExistingAnime(title);
      let season = existingAnime2.seasons.find((season2) => season2.seasonNumber === seasonNumber);
      if (season) return season;
      season = {
        watched: false,
        seasonNumber,
        allEpisodesNumber: episodes.length,
        episodes: episodes.map((episode) => ({
          watched: false,
          watchTime: 0,
          episodeNumber: episode.innerHTML
        }))
      };
      existingAnime2.seasons.push(season);
      return existingAnime2.seasons[existingAnime2.seasons.length - 1];
    }
    function getExistingEpisode(episodeNumber, seasonNumber) {
      const existingSeason = getExistingSeason(seasonNumber ?? activeSeason.innerHTML);
      let episode = existingSeason.episodes.find((episode2) => episode2.episodeNumber === episodeNumber);
      if (episode) return episode;
      episode = {
        episodeNumber,
        watched: false,
        watchTime: 0
      };
      existingSeason.episodes.push(episode);
      return existingSeason.episodes[existingSeason.episodes.length - 1];
    }
    const animeWatchList = getAnimeWatchList();
    const title = (titleElement == null ? void 0 : titleElement.textContent) ?? "undefined";
    const existingAnime = getExistingAnime(title);
    const fillerList = JSON.parse(_GM_getResourceText("fillers.json"));
    if (episodesListTable) {
      if (activeSeason) {
        const existingSeason = existingAnime == null ? void 0 : existingAnime.seasons.find((season) => season.seasonNumber === activeSeason.innerHTML);
        Array.from(episodesListTable.children).forEach((episodeListButton) => {
          const episodeNumber = episodeListButton.querySelector("meta[itemprop='episodeNumber']").content;
          const existingEpisode = existingSeason == null ? void 0 : existingSeason.episodes.find((episode) => episode.episodeNumber === episodeNumber);
          let episodeState = 0;
          if (existingEpisode == null ? void 0 : existingEpisode.watched) {
            episodeState = 1;
          }
          const eye = document.createElement("i");
          eye.id = `${EpisodeState[episodeState]}-episode-${episodeNumber}`;
          eye.className = `fa ${episodeState === 1 ? "fa-eye-slash" : "fa-eye"}`;
          eye.addEventListener("click", () => {
            const anime = getExistingAnime(title);
            const season = getExistingSeason(activeSeason.innerHTML);
            const episode = getExistingEpisode(episodeNumber, activeSeason.innerHTML);
            episode.watched = !episode.watched;
            season.watched = season.episodes.filter((episode2) => episode2.watched && episode2.watchTime === 100).length === season.allEpisodesNumber;
            setAnimeWatchList(animeWatchList);
            doFancyStuff(anime);
          });
          episodeListButton.children[0].insertBefore(eye, episodeListButton.children[0].children[0]);
        });
      }
    }
    if (dropDownContainer) {
      if (normalDropdown) {
        dropDownContainer.addEventListener("click", () => {
          if (normalDropdown.style.display === "none") {
            normalDropdown.style.display = "block";
          } else {
            normalDropdown.style.display = "none";
          }
        });
      }
      watchedButton.addEventListener("click", () => {
        const anime = getExistingAnime();
        if (watchedButton.classList.contains("season")) {
          const season = getExistingSeason(activeSeason.innerHTML);
          season.episodes.forEach((episode) => {
            episode.watched = true;
          });
          season.watched = true;
        } else if (watchedButton.classList.contains("episode")) {
          const episode = getExistingEpisode(activeEpisode.innerHTML, activeSeason.innerHTML);
          episode.watched = true;
        }
        setAnimeWatchList(animeWatchList);
        doFancyStuff(anime);
      });
      notWatchedButton.addEventListener("click", () => {
        const anime = getExistingAnime();
        if (watchedButton.classList.contains("season")) {
          const season = getExistingSeason(activeSeason.innerHTML);
          season.episodes.forEach((episode) => {
            episode.watched = false;
          });
          season.watched = false;
        } else if (watchedButton.classList.contains("episode")) {
          const episode = getExistingEpisode(activeEpisode.innerHTML, activeSeason.innerHTML);
          episode.watched = false;
        }
        setAnimeWatchList(animeWatchList);
        doFancyStuff(anime);
      });
    }
    if (episodeMarker) {
      const existingSeason = existingAnime == null ? void 0 : existingAnime.seasons.find((season) => season.seasonNumber === activeSeason.innerHTML);
      const episodeNumber = activeEpisode == null ? void 0 : activeEpisode.innerHTML;
      const header = episodeMarker.querySelector("h3");
      if (episodeNumber) {
        const existingEpisode = existingSeason == null ? void 0 : existingSeason.episodes.find((episode) => episode.episodeNumber === episodeNumber);
        const watchedEpisode = (existingEpisode == null ? void 0 : existingEpisode.watched) ?? false;
        const eye = episodeMarker.querySelector("i");
        if (eye) {
          eye.id = `${EpisodeState[
          watchedEpisode ? 1 : 0
          /* NotWatched */
        ]}-episode-${episodeNumber}`;
        }
        if (watchedEpisode) {
          header.innerHTML = "Folge gesehen";
          eye.className = "fa fa-eye-slash";
        } else {
          header.innerHTML = "Folge nicht gesehen";
          eye.className = "fa fa-eye";
        }
        episodeMarker.addEventListener("click", () => {
          const anime = getExistingAnime();
          const existingEpisode2 = getExistingEpisode(episodeNumber);
          existingEpisode2.watched = !existingEpisode2.watched;
          setAnimeWatchList(animeWatchList);
          doFancyStuff(anime);
          if (existingEpisode2.watched) {
            header.innerHTML = "Folge gesehen";
            eye.className = "fa fa-eye-slash";
          } else {
            header.innerHTML = "Folge nicht gesehen";
            eye.className = "fa fa-eye";
          }
        });
      }
    }
    function markEpisodeAsWatched(episodeNumber, episodeState) {
      const episodeButtonId = episodeNumber;
      const listEpisode = episodes[Number.parseInt(episodeButtonId, 10) - 1];
      const tableEpisode = episodesListTable == null ? void 0 : episodesListTable.querySelector(`[data-episode-season-id='${episodeNumber}']`);
      if (episodeState === 0) {
        listEpisode.classList.remove("watched");
        listEpisode.classList.remove("watching");
        if (tableEpisode) {
          tableEpisode.style.cssText = "";
          tableEpisode.classList.remove("watched");
          tableEpisode.classList.remove("watching");
        }
      } else if (episodeState === 1) {
        listEpisode.classList.remove("watching");
        listEpisode.classList.add("watched");
        if (tableEpisode) {
          tableEpisode.style.cssText = "";
          tableEpisode.classList.remove("watching");
          tableEpisode.classList.add("watched");
        }
      } else if (episodeState === 2) {
        const watchedAnimeEpisode = getExistingEpisode(episodeButtonId, activeSeason.innerHTML);
        const progress = watchedAnimeEpisode.watchTime;
        if (!progress) return;
        listEpisode.classList.remove("watched");
        listEpisode.classList.add("watching");
        if (tableEpisode) {
          tableEpisode.classList.add("watching");
          tableEpisode.style.setProperty("--progress", `${progress}%`);
        }
      }
    }
    function markSeasonAsWatched(seasonNumber, seasonState) {
      const season = seasons.find((season2) => season2.innerHTML === seasonNumber);
      if (seasonState === 0) {
        season == null ? void 0 : season.classList.remove("watching");
        season == null ? void 0 : season.classList.remove("watched");
      } else if (seasonState === 1) {
        season == null ? void 0 : season.classList.remove("watching");
        season == null ? void 0 : season.classList.add("watched");
      } else if (seasonState === 2) {
        season == null ? void 0 : season.classList.remove("watched");
        season == null ? void 0 : season.classList.add("watching");
      }
    }
    function markEpisodeAsFiller(episodeNumber, isFiller) {
      const listEpisode = episodes[Number.parseInt(episodeNumber, 10) - 1];
      const tableEpisode = episodesListTable == null ? void 0 : episodesListTable.querySelector(`[data-episode-season-id='${episodeNumber}']`);
      if (isFiller) {
        listEpisode.classList.add("filler");
        if (tableEpisode) {
          tableEpisode.classList.add("filler");
        }
      } else {
        listEpisode.classList.remove("filler");
        if (tableEpisode) {
          tableEpisode.classList.remove("filler");
        }
      }
    }
    function doFancyStuff(anime) {
      const title2 = location.pathname.split("/").at(3);
      if (title2 && title2 in fillerList) {
        const fillers = fillerList[title2].filter((filler) => filler.season.toString() === activeSeason.innerHTML && filler.isFiller);
        for (const filler of fillers) {
          markEpisodeAsFiller(filler.episode.toString(), filler.isFiller);
        }
      }
      for (const season of anime.seasons) {
        const watchedEpisodes = season.episodes.filter((episode) => episode.watched || episode.watchTime === 100);
        const watchingEpisodes = season.episodes.filter((episode) => !episode.watched && episode.watchTime < 100);
        const isSeasonWatched = season.watched || season.allEpisodesNumber === watchedEpisodes.length;
        const isSeasonWatching = !isSeasonWatched && watchingEpisodes.length > 0 && watchingEpisodes.length < season.allEpisodesNumber;
        if (isSeasonWatched) {
          markSeasonAsWatched(
            season.seasonNumber,
            1
            /* Watched */
          );
        } else if (isSeasonWatching) {
          markSeasonAsWatched(
            season.seasonNumber,
            2
            /* Watching */
          );
        } else {
          markSeasonAsWatched(
            season.seasonNumber,
            0
            /* NotWatched */
          );
        }
        if (season.seasonNumber !== activeSeason.innerHTML) continue;
        for (const episode of season.episodes) {
          const isEpisodeWatched = episode.watched || episode.watchTime === 100;
          const isEpisodeWatching = !episode.watched && episode.watchTime > 0 && episode.watchTime < 100;
          if (isEpisodeWatched) {
            markEpisodeAsWatched(
              episode.episodeNumber,
              1
              /* Watched */
            );
          } else if (isEpisodeWatching) {
            markEpisodeAsWatched(
              episode.episodeNumber,
              2
              /* Watching */
            );
          } else {
            markEpisodeAsWatched(
              episode.episodeNumber,
              0
              /* NotWatched */
            );
          }
        }
      }
    }
    doFancyStuff(existingAnime);
  }
  updateButtons();

})();