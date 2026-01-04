// ==UserScript==
// @name         Redacted YouTube Searcher
// @license      MIT
// @namespace    https://redacted.sh/
// @version      1.4.2
// @description  Add YouTube search links that play in an embedded player or open in a new tab.
// @author       x__a
// @match        https://*.redacted.sh/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/476138/Redacted%20YouTube%20Searcher.user.js
// @updateURL https://update.greasyfork.org/scripts/476138/Redacted%20YouTube%20Searcher.meta.js
// ==/UserScript==

(function () {
  "use strict";

  if (document.getElementById("redacted-youtube")) return;

  const CONFIG = {
    STORAGE_KEY: "redacted-youtube-player-visibility",
    YOUTUBE_SEARCH_URL: "https://www.youtube.com/results?search_query=",
    YOUTUBE_EMBED_URL: "https://www.youtube-nocookie.com/embed/",
    VIDEO_ID_REGEX: /"videoId"\s*:\s*"([^"]+)"/,
  };

  let activeTrack = null;

  const utils = {
    slugify(string) {
      return string
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    },
  };

  const UI = {
    createLoadingSpinner() {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.id = "redacted-youtube-spinner";
      svg.setAttribute("viewBox", "0 0 100 100");

      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.id = "redacted-youtube-spinner-circle";
      circle.setAttribute("cx", "50");
      circle.setAttribute("cy", "50");
      circle.setAttribute("r", "45");

      svg.appendChild(circle);
      return svg;
    },

    createYouTubeIcon() {
      return `<svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>`;
    },

    createExternalLinkIcon() {
      return `<svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clip-rule="evenodd" /></svg>`;
    },
  };

  const YouTubeAPI = {
    async searchVideo(query) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: `${CONFIG.YOUTUBE_SEARCH_URL}${encodeURIComponent(query)}`,
          onload: function (response) {
            if (response.readyState === 4 && response.status === 200) {
              const videoIds = response.responseText.match(
                CONFIG.VIDEO_ID_REGEX,
              );
              if (videoIds && videoIds.length > 0) {
                resolve(videoIds[1]);
              } else {
                reject(new Error("No video ID found"));
              }
            } else {
              reject(new Error(`HTTP ${response.status}`));
            }
          },
          onerror: () => reject(new Error("Network error")),
        });
      });
    },

    createEmbedPlayer(videoId) {
      const player = document.createElement("iframe");
      player.id = "redacted-youtube-player";
      player.src = `${CONFIG.YOUTUBE_EMBED_URL}${videoId}?autoplay=1`;
      return player;
    },
  };

  const PlayerManager = {
    setVisibility(state) {
      localStorage.setItem(CONFIG.STORAGE_KEY, state);
      const trackList = document.getElementById("redacted-youtube-track-list");
      if (trackList) {
        trackList.style.display = state === "hidden" ? "none" : "";
      }
    },

    toggleVisibility(event) {
      event.preventDefault();
      const currentState = localStorage.getItem(CONFIG.STORAGE_KEY);
      const newState = currentState === "hidden" ? "visible" : "hidden";
      this.setVisibility(newState);

      const showLink = event.target;
      showLink.textContent = newState === "hidden" ? "(Show)" : "(Hide)";
    },

    async playFirstResult(event) {
      event.preventDefault();

      const parent = event.target.closest("[data-query]");
      if (!parent) return;

      const query = parent.getAttribute("data-query");
      const existingPlayer = document.getElementById("redacted-youtube-player");

      if (existingPlayer && activeTrack === parent.id) {
        activeTrack = null;
        existingPlayer.remove();
        return;
      }

      const spinner = UI.createLoadingSpinner();
      parent.appendChild(spinner);

      try {
        if (existingPlayer) existingPlayer.remove();

        const videoId = await YouTubeAPI.searchVideo(query);
        const player = YouTubeAPI.createEmbedPlayer(videoId);
        parent.appendChild(player);

        spinner.remove();
        activeTrack = parent.id;
      } catch (error) {
        console.error("YouTube search failed:", error);
        spinner.remove();

        const errorMsg = document.createElement("span");
        errorMsg.textContent = "Search failed";
        errorMsg.style = "color: #ed5651; font-size: 12px; margin-left: 5px;";
        parent.appendChild(errorMsg);

        setTimeout(() => errorMsg.remove(), 3000);
      }
    },
  };

  const TrackProcessor = {
    AUDIO_EXTENSIONS: [".mp3", ".flac", ".wav", ".aac", ".opus"],
    TRACK_NUMBER_PATTERNS: [
      /^(\d{1,2})\.(\d{1,2})[.\s-]+/,
      /^(\d{1,2})-(\d{1,2})[.\s-]+/,
      /^(\d{1,2})[.\s-]+/,
    ],
    UNWANTED_PATTERNS: [
      /\([^)]*\)/g,
      /\[[^\]]*\]/g,
      /\{[^}]*\}/g,
      /\bfeat(?:\.|uring)?\b/gi,
      /\bft\.?\b/gi,
      /extended/gi,
      /radio edit/gi,
      /clean version/gi,
      /explicit/gi,
      /instrumental/gi,
      /demo/gi,
      /live/gi,
      /acoustic/gi,
      /original mix/gi,
      /club mix/gi,
      /dub mix/gi,
    ],

    isAudioFile(filename) {
      const extension = filename.slice(filename.lastIndexOf("."));
      return this.AUDIO_EXTENSIONS.includes(extension.toLowerCase());
    },

    cleanText(text) {
      let cleaned = text;
      this.UNWANTED_PATTERNS.forEach(
        (pattern) => (cleaned = cleaned.replace(pattern, "")),
      );
      return cleaned
        .replace(/^\s+|\s+$/g, "")
        .replace(/[-\s.]+$/g, "")
        .replace(/^[-\s.]+/g, "")
        .replace(/\s+/g, " ")
        .trim();
    },

    extractTrackNumber(filename) {
      for (const pattern of this.TRACK_NUMBER_PATTERNS) {
        const match = filename.match(pattern);
        if (match) {
          const trackNumber = match[1];
          const discNumber = match[2] || null;
          const remaining = filename.replace(match[0], "");
          return {
            trackNumber: parseInt(trackNumber, 10),
            discNumber: discNumber ? parseInt(discNumber, 10) : null,
            remaining: remaining.trim(),
          };
        }
      }
      return { trackNumber: null, discNumber: null, remaining: filename };
    },

    removeArtistName(trackTitle, artist) {
      if (!artist) return trackTitle;

      const artistNames = artist
        .split(/[&and]/i)
        .map((name) => name.trim())
        .filter(Boolean);

      for (const artistName of artistNames) {
        const escapedArtist = artistName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const patterns = [
          new RegExp(`^\\s*${escapedArtist}\\s*[-–—]\\s*`, "i"),
          new RegExp(`^\\s*${escapedArtist}\\s*:\\s*`, "i"),
          new RegExp(`^\\s*${escapedArtist}\\s+`, "i"),
        ];

        for (const pattern of patterns) {
          if (pattern.test(trackTitle)) {
            return trackTitle.replace(pattern, "").trim();
          }
        }
      }
      return trackTitle;
    },

    extractTrackInfo(fileText, artist) {
      if (!this.isAudioFile(fileText)) return null;

      try {
        const lastDotIndex = fileText.lastIndexOf(".");
        let trackTitle =
          lastDotIndex > 0 ? fileText.slice(0, lastDotIndex) : fileText;

        const numberInfo = this.extractTrackNumber(trackTitle);
        trackTitle = numberInfo.remaining;

        if (artist) trackTitle = this.removeArtistName(trackTitle, artist);
        trackTitle = this.cleanText(trackTitle);

        if (!trackTitle)
          trackTitle =
            lastDotIndex > 0 ? fileText.slice(0, lastDotIndex) : fileText;

        const artistInTrack =
          artist && trackTitle.toLowerCase().includes(artist.toLowerCase());
        const artistAndTrack = artistInTrack
          ? trackTitle
          : `${artist} - ${trackTitle}`;

        return {
          trackName: trackTitle,
          artistAndTrack,
          trackId: utils.slugify(trackTitle),
          trackNumber: numberInfo.trackNumber,
          discNumber: numberInfo.discNumber,
        };
      } catch (error) {
        console.error("Error processing track:", fileText, error);
        return null;
      }
    },

    createTrackElement(trackInfo) {
      const trackLinkElement = document.createElement("tr");
      const trackLinkTableData = document.createElement("td");
      trackLinkTableData.id = trackInfo.trackId;
      trackLinkTableData.setAttribute("data-query", trackInfo.artistAndTrack);

      const trackLinkAnchor = document.createElement("a");
      trackLinkAnchor.href = "#";
      trackLinkAnchor.innerHTML = trackInfo.trackName;
      trackLinkAnchor.addEventListener("click", (e) =>
        PlayerManager.playFirstResult(e),
      );

      const trackSearchAnchor = document.createElement("a");
      trackSearchAnchor.href = `${CONFIG.YOUTUBE_SEARCH_URL}${encodeURIComponent(trackInfo.artistAndTrack)}`;
      trackSearchAnchor.title = "Open YouTube";
      trackSearchAnchor.rel = "noopener";
      trackSearchAnchor.target = "_blank";
      trackSearchAnchor.innerHTML = UI.createExternalLinkIcon();
      trackSearchAnchor.style = "margin-left: 4px";

      trackLinkTableData.appendChild(trackLinkAnchor);
      trackLinkTableData.appendChild(trackSearchAnchor);
      trackLinkElement.appendChild(trackLinkTableData);

      return trackLinkElement;
    },
  };

  const App = {
    injectStyles() {
      const head = document.head || document.getElementsByTagName("head")[0];
      const style = document.createElement("style");
      style.id = "redacted-youtube";
      style.innerHTML = `.redacted-youtube-link{transition:all 0.15s ease!important;line-height:0!important;color:#c4302b!important}.redacted-youtube-link:hover{color:#ed5651!important}.redacted-youtube-link>svg{width:12px!important;height:12px!important}.redacted-youtube-svg{width:12px!important;height:12px!important}#redacted-youtube-player{display:block;border:none;border-radius:0.5rem;margin-top:0.5rem;aspect-ratio:16/9;width:100%}#redacted-youtube-spinner{animation:2s linear infinite svg-animation;max-width:10px;margin-left:5px}@keyframes svg-animation{0%{transform:rotateZ(0deg)}100%{transform:rotateZ(360deg)}}#redacted-youtube-spinner-circle{animation:1.4s ease-in-out infinite both circle-animation;display:block;fill:transparent;stroke:#ed5651;stroke-linecap:round;stroke-dasharray:283;stroke-dashoffset:280;stroke-width:10px;transform-origin:50% 50%}@keyframes circle-animation{0%,25%{stroke-dashoffset:280;transform:rotate(0)}50%,75%{stroke-dashoffset:75;transform:rotate(45deg)}100%{stroke-dashoffset:280;transform:rotate(360deg)}}`;
      head.appendChild(style);
    },

    addTorrentLinks() {
      const urlParams = new URLSearchParams(window.location.search);

      document
        .querySelectorAll("table.torrent_table > tbody > tr")
        .forEach((torrent) => {
          if (torrent.querySelector(".redacted-youtube-link")) return;

          const artistLink = torrent.querySelector('a[href*="artist.php?id"]');
          const releaseLink = torrent.querySelector(
            'a[href*="torrents.php?id"]',
          );

          if (!artistLink && !releaseLink) return;

          let artist = artistLink ? artistLink.textContent : null;

          if (
            /\/artist.php/.test(window.location.pathname) &&
            urlParams.has("id")
          ) {
            artist =
              document.querySelector(".header > h2")?.textContent || artist;
          }

          const release = releaseLink.textContent;
          const query = encodeURIComponent(
            artist ? `${artist} - ${release}` : release,
          );
          const actionButtons = torrent.querySelector(
            "span.torrent_action_buttons",
          );
          const addBookmarkButton = torrent.querySelector("span.add_bookmark");

          const youtubeLink = `| <a href="${CONFIG.YOUTUBE_SEARCH_URL}${query}" class="tooltip redacted-youtube-link" rel="noopener" target="_blank" title="Search YouTube">${UI.createYouTubeIcon()}</a>`;

          if (actionButtons) {
            actionButtons.insertAdjacentHTML("beforeend", youtubeLink);
          } else if (addBookmarkButton) {
            addBookmarkButton.insertAdjacentHTML(
              "beforebegin",
              `<span title="Search YouTube" class="tooltip" style="margin-left: 4px"><a href="${CONFIG.YOUTUBE_SEARCH_URL}${query}" class="redacted-youtube-link" rel="noopener" target="_blank">${UI.createYouTubeIcon()}</a></span>`,
            );
          }
        });
    },

    observeDynamicContent() {
      const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;

        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (
                  node.matches &&
                  (node.matches("table.torrent_table") ||
                    node.matches("table.torrent_table *"))
                ) {
                  shouldUpdate = true;
                }
                if (
                  node.querySelector &&
                  node.querySelector("table.torrent_table")
                ) {
                  shouldUpdate = true;
                }
              }
            });
          }
        });

        if (shouldUpdate) {
          setTimeout(() => this.addTorrentLinks(), 100);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    },

    createTrackList() {
      const urlParams = new URLSearchParams(window.location.search);

      if (
        !/\/torrents.php/.test(window.location.pathname) ||
        !urlParams.has("id")
      )
        return;

      const artist = Array.from(
        document.querySelectorAll('h2 a[href*="artist.php"]'),
      )
        .map((link) => link.textContent)
        .join(" & ");

      const fileTables = Array.from(
        document.querySelectorAll("table.filelist_table"),
      ).filter((table) => {
        const releaseRow =
          table.closest("tr.releases_1")?.previousElementSibling;
        const firstTdText = releaseRow?.querySelector("td")?.textContent || "";
        return !/\/\s*Scene/i.test(firstTdText);
      });

      const fileRows = fileTables.flatMap((table) =>
        Array.from(
          table.querySelectorAll(
            "tbody > tr:not(.colhead_dark) > td:not(.number_column)",
          ),
        ),
      );

      // const fileRows = document.querySelectorAll(
      //   "table.filelist_table > tbody > tr:not(.colhead_dark) > td:not(.number_column)",
      // );

      const trackLinks = [];

      fileRows.forEach((item) => {
        const file = item.textContent;
        const trackInfo = TrackProcessor.extractTrackInfo(file, artist);

        if (!trackInfo) return;

        const trackElement = TrackProcessor.createTrackElement(trackInfo);

        const normalizedTrackName = trackInfo.trackName.toLowerCase().trim();
        const isDuplicate = trackLinks.some(
          (trackLink) =>
            trackLink.id === trackInfo.trackId ||
            trackLink.artistAndTrack === trackInfo.artistAndTrack ||
            trackLink.normalizedName === normalizedTrackName,
        );

        if (!isDuplicate) {
          trackLinks.push({
            id: trackInfo.trackId,
            element: trackElement,
            artistAndTrack: trackInfo.artistAndTrack,
            normalizedName: normalizedTrackName,
            trackNumber: trackInfo.trackNumber,
            discNumber: trackInfo.discNumber,
          });
        }
      });

      if (trackLinks.length === 0) return;

      const table = document.createElement("table");
      table.id = "redacted-youtube-tracks-table";
      table.className = "collage_table";

      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      headerRow.className = "colhead";
      const headerCell = document.createElement("td");

      const upLink = document.createElement("a");
      upLink.href = "#";
      upLink.textContent = "↑";
      const trackSearchText = document.createTextNode(" YouTube Track Search ");
      const showLink = document.createElement("a");
      showLink.href = "#";
      showLink.textContent =
        localStorage.getItem(CONFIG.STORAGE_KEY) === "hidden"
          ? "(Show)"
          : "(Hide)";
      showLink.onclick = (e) => PlayerManager.toggleVisibility(e);

      headerCell.appendChild(upLink);
      headerCell.appendChild(trackSearchText);
      headerCell.appendChild(showLink);
      headerRow.appendChild(headerCell);
      thead.appendChild(headerRow);

      const tbody = document.createElement("tbody");
      tbody.id = "redacted-youtube-track-list";
      tbody.style =
        localStorage.getItem(CONFIG.STORAGE_KEY) === "hidden"
          ? "display: none"
          : "";

      table.appendChild(thead);
      table.appendChild(tbody);

      trackLinks.sort((a, b) => {
        if (a.discNumber !== b.discNumber)
          return (a.discNumber || 0) - (b.discNumber || 0);
        return (a.trackNumber || 0) - (b.trackNumber || 0);
      });

      const descriptionBox = document.querySelector(
        "div.box.torrent_description",
      );
      if (descriptionBox) {
        descriptionBox.insertAdjacentElement("beforebegin", table);
        trackLinks.forEach((track) => tbody.appendChild(track.element));
      }
    },

    init() {
      this.injectStyles();
      this.addTorrentLinks();
      this.createTrackList();
      this.observeDynamicContent();
    },
  };

  App.init();
})();
