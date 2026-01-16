// ==UserScript==
// @name         IMDB VidSrc Player
// @version      1.2.3
// @description  Add a multi-server video player directly into IMDB movie/series pages.
// @author       https://github.com/atefr
// @license      MIT
// @match        https://www.imdb.com/title/*
// @match        https://m.imdb.com/title/*
// @icon         https://m.media-amazon.com/images/G/01/imdb/images-ANDW73HA/favicon_desktop_32x32._CB1582158068_.png
// @connect      imdb.com
// @connect      m.imdb.com
// @connect      vidsrc-embed.ru
// @connect      vidsrc-embed.su
// @connect      111movies.com
// @connect      2embed.cc
// @connect      www.2embed.cc
// @connect      vidfast.pro
// @namespace https://greasyfork.org/users/1397577
// @downloadURL https://update.greasyfork.org/scripts/517653/IMDB%20VidSrc%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/517653/IMDB%20VidSrc%20Player.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Utility function to log errors
  const logError = (error) => console.error(`Error: ${error.message || error}`);
  let cachedNextData = null;

  const SERVER_STORAGE_KEY = "imdb-vidsrc-server";
  const SERVERS = [
    {
      id: "vidsrc-embed-ru",
      name: "VidSrc",
      buildUrl: (context) =>
        buildVidsrcEmbedUrl("https://vidsrc-embed.ru", context),
    },
    {
      id: "vidsrc-embed-su",
      name: "VidSrc (su)",
      buildUrl: (context) =>
        buildVidsrcEmbedUrl("https://vidsrc-embed.su", context),
    },
    {
      id: "111movies",
      name: "111Movies",
      buildUrl: (context) => build111MoviesUrl(context),
    },
    {
      id: "2embed",
      name: "2Embed",
      buildUrl: (context) => build2EmbedUrl(context),
    },
    {
      id: "vidfast",
      name: "VidFast",
      buildUrl: (context) => buildVidfastUrl(context),
    },
  ];

  insertPlayer();

  function extractSeasonEpisode() {
    const seasonEpisodeDiv = document.querySelector(
      '[data-testid="hero-subnav-bar-season-episode-numbers-section"]',
    );
    if (seasonEpisodeDiv) {
      const seasonEpisodeText = seasonEpisodeDiv.textContent.trim();
      const match = seasonEpisodeText.match(/S(\d+)\s*.\s*E(\d+)/);
      if (match) {
        return {
          season: match[1],
          episode: match[2],
        };
      }
    }
    const nextData = getNextData();
    const episodeNumber =
      nextData?.props?.pageProps?.aboveTheFoldData?.series?.episodeNumber;
    if (episodeNumber?.seasonNumber && episodeNumber?.episodeNumber) {
      return {
        season: String(episodeNumber.seasonNumber),
        episode: String(episodeNumber.episodeNumber),
      };
    }
    return null;
  }

  // Function to extract the series ID from the IMDb page
  function extractSeriesId() {
    const seriesLink = document.querySelector(
      '[data-testid="hero-title-block__series-link"]',
    );
    if (seriesLink) {
      const href = seriesLink.getAttribute("href");
      const match = href.match(/\/title\/(tt\d+)\//);
      if (match) {
        return match[1];
      }
    }
    const nextData = getNextData();
    const seriesId =
      nextData?.props?.pageProps?.aboveTheFoldData?.series?.series?.id;
    if (seriesId) {
      return seriesId;
    }
    return null;
  }

  // Common function to insert the video player into the IMDB page
  function insertPlayer() {
    const imdbId = window.location.pathname.split("/")[2];
    const context = buildContentContext(imdbId);
    const container = createPlayerContainer(context);

    const targetLocation = document.querySelector("main");
    if (targetLocation) {
      targetLocation.before(container);
    } else {
      logError("Target location for player insertion not found on the page");
      document.body.prepend(container);
    }
  }

  function getContentType() {
    const ogType = document
      .querySelector('meta[property="og:type"]')
      ?.getAttribute("content");
    if (ogType === "video.episode") {
      return "episode";
    }
    if (ogType === "video.tv_show") {
      return "series";
    }

    const nextData = getNextData();
    const titleType = nextData?.props?.pageProps?.aboveTheFoldData?.titleType;
    if (titleType?.id === "tvEpisode" || titleType?.isEpisode) {
      return "episode";
    }
    if (titleType?.id === "tvSeries" || titleType?.isSeries) {
      return "series";
    }

    const title = document.title || "";
    const isEpisode = title.includes("TV Episode");
    const isSeries = title.includes("TV Series");
    if (isEpisode) {
      return "episode";
    }
    if (isSeries) {
      return "series";
    }
    return "movie";
  }

  function buildContentContext(imdbId) {
    const contentType = getContentType();
    const seasonEpisode = extractSeasonEpisode();
    return {
      imdbId,
      contentType,
      season: seasonEpisode ? seasonEpisode.season : null,
      episode: seasonEpisode ? seasonEpisode.episode : null,
      seriesId: extractSeriesId() || imdbId,
    };
  }

  function buildVidsrcEmbedUrl(baseUrl, context) {
    if (context.contentType === "movie") {
      return `${baseUrl}/embed/${context.imdbId}/`;
    }
    if (context.contentType === "series") {
      return `${baseUrl}/embed/tv?imdb=${context.seriesId}`;
    }
    if (context.season && context.episode) {
      return `${baseUrl}/embed/${context.seriesId}/${context.season}-${context.episode}/`;
    }
    return null;
  }

  function build111MoviesUrl(context) {
    if (context.contentType === "movie") {
      return `https://111movies.com/movie/${context.imdbId}`;
    }
    const episode = getPreferredEpisode(context);
    if (episode) {
      return `https://111movies.com/tv/${context.seriesId}/${episode.season}/${episode.episode}`;
    }
    return null;
  }

  function build2EmbedUrl(context) {
    if (context.contentType === "movie") {
      return `https://www.2embed.cc/embed/${context.imdbId}`;
    }
    if (context.contentType === "series") {
      return `https://www.2embed.cc/embedtvfull/${context.seriesId}`;
    }
    if (context.season && context.episode) {
      return `https://www.2embed.cc/embedtv/${context.seriesId}?s=${context.season}&e=${context.episode}`;
    }
    return null;
  }

  function buildVidfastUrl(context) {
    if (context.contentType === "movie") {
      return `https://vidfast.pro/movie/${context.imdbId}`;
    }
    const episode = getPreferredEpisode(context);
    if (episode) {
      return `https://vidfast.pro/tv/${context.seriesId}/${episode.season}/${episode.episode}`;
    }
    return null;
  }

  function getSavedServerId(availableServers) {
    const savedId = localStorage.getItem(SERVER_STORAGE_KEY);
    return availableServers.some((entry) => entry.server.id === savedId)
      ? savedId
      : availableServers[0].server.id;
  }

  function getNextData() {
    if (cachedNextData !== null) {
      return cachedNextData;
    }
    const script = document.getElementById("__NEXT_DATA__");
    if (!script || !script.textContent) {
      cachedNextData = null;
      return cachedNextData;
    }
    try {
      cachedNextData = JSON.parse(script.textContent);
    } catch (error) {
      logError(error);
      cachedNextData = null;
    }
    return cachedNextData;
  }

  function getPreferredEpisode(context) {
    if (context.season && context.episode) {
      return {
        season: context.season,
        episode: context.episode,
      };
    }
    if (context.contentType !== "series") {
      return null;
    }
    return {
      season: "1",
      episode: "1",
    };
  }

  function injectStyles() {
    if (document.getElementById("gm-vidsrc-style")) {
      return;
    }
    const style = document.createElement("style");
    style.id = "gm-vidsrc-style";
    style.textContent = `
            #gm-vidsrc-player {
                width: 100%;
                padding: 12px 16px 16px;
                background: #101010;
                border: 1px solid #1f1f1f;
                border-radius: 4px;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.35);
                color: #f5f5f5;
                box-sizing: border-box;
            }

            #gm-vidsrc-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                margin-bottom: 12px;
                flex-wrap: wrap;
            }

            #gm-vidsrc-title {
                font-size: 12px;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: #f5c518;
            }

            #gm-vidsrc-controls {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            #gm-vidsrc-controls label {
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.12em;
                color: #b3b3b3;
            }

            #gm-vidsrc-controls select {
                background: #1a1a1a;
                color: #f5f5f5;
                border: 1px solid #2a2a2a;
                border-radius: 6px;
                padding: 6px 12px;
                font-size: 13px;
            }

            #gm-vidsrc-controls select:focus {
                outline: 2px solid #f5c518;
                outline-offset: 2px;
            }

            #gm-vidsrc-iframe {
                width: 100%;
                height: 65vh;
                min-height: 360px;
                border: 0;
                border-radius: 4px;
                background: #000;
            }

            #gm-vidsrc-message {
                padding: 18px;
                border-radius: 6px;
                background: #171717;
                border: 1px dashed #2a2a2a;
                font-size: 13px;
                color: #d0d0d0;
                display: none;
            }

            @media (max-width: 768px) {
                #gm-vidsrc-player {
                    margin: 0 0 20px;
                    padding: 12px 12px 14px;
                    border-radius: 0;
                }

                #gm-vidsrc-iframe {
                    height: 50vh;
                    min-height: 280px;
                }
            }
        `;
    document.head.appendChild(style);
  }

  function createPlayerContainer(context) {
    injectStyles();

    const container = document.createElement("section");
    container.id = "gm-vidsrc-player";

    const header = document.createElement("div");
    header.id = "gm-vidsrc-header";

    const title = document.createElement("div");
    title.id = "gm-vidsrc-title";
    title.textContent = "Stream";

    const controls = document.createElement("div");
    controls.id = "gm-vidsrc-controls";

    const label = document.createElement("label");
    label.setAttribute("for", "gm-vidsrc-server");
    label.textContent = "Server";

    const select = document.createElement("select");
    select.id = "gm-vidsrc-server";

    controls.appendChild(label);
    controls.appendChild(select);
    header.appendChild(title);
    header.appendChild(controls);
    container.appendChild(header);

    const availableServers = SERVERS.map((server) => ({
      server,
      url: server.buildUrl(context),
    })).filter((entry) => entry.url);

    const message = document.createElement("div");
    message.id = "gm-vidsrc-message";
    container.appendChild(message);

    if (!availableServers.length) {
      message.textContent =
        context.contentType === "episode"
          ? "Season or episode info is missing on this page."
          : "No available servers support this title.";
      message.style.display = "block";
      return container;
    }

    const savedServerId = getSavedServerId(availableServers);
    availableServers.forEach((entry) => {
      const option = document.createElement("option");
      option.value = entry.server.id;
      option.textContent = entry.server.name;
      if (entry.server.id === savedServerId) {
        option.selected = true;
      }
      select.appendChild(option);
    });
    select.disabled = availableServers.length === 1;

    const iframe = createIframe();
    const initialEntry =
      availableServers.find((entry) => entry.server.id === savedServerId) ||
      availableServers[0];
    iframe.src = initialEntry.url;
    container.appendChild(iframe);

    select.addEventListener("change", () => {
      const entry = availableServers.find(
        (item) => item.server.id === select.value,
      );
      if (!entry) {
        return;
      }
      localStorage.setItem(SERVER_STORAGE_KEY, entry.server.id);
      iframe.src = entry.url;
    });

    return container;
  }

  // Helper function to create an iframe for embedding the video player
  function createIframe() {
    const iframe = document.createElement("iframe");
    iframe.id = "gm-vidsrc-iframe";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    iframe.setAttribute("webkitallowfullscreen", "true");
    iframe.setAttribute("mozallowfullscreen", "true");
    return iframe;
  }
})();
