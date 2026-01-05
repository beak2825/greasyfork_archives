// ==UserScript==
// @name          IMDB info + .torrent from magnet
// @version       2.20200620
// @description   Show info of movies/series's (rating, poster, actors, ...) from IMDB on almost any torrent domain (thepiratebay, *torrent* , ...) as well as showing .torrent download links from any magnet:?url
// @namespace     hossam6236
// @author        hossam6236
// @license       GPL-3.0-or-later
// @include       http*://*torrent*.*/*
// @include       http*://*pirate*bay*.*/*
// @include       http*://*tpb*.*/*
// @include       http*://*isohunt*.*/*
// @include       http*://*1337x*.*/*
// @include       http*://*rarbg*.*/*
// @include       http*://*zooqle*.*/*
// @include       http*://*bitsnoop*.*/*
// @include       http*://*dnoid*.*/*
// @include       http*://*torlock*.*/*
// @include       http*://*eztv*.*/*
// @include       http*://*idope*.*/*
// @include       http*://*toorgle*.*/*
// @include       http*://*demonoid*.*/*
// @include       http*://*kickass*.*/*
// @include       http*://*kat*.*/*
// @include       http*://*boxofficemojo*.*/*
// @include       http*://*.imdb.*/*
// @grant         GM_xmlhttpRequest
// @connect       imdb.com
// @connect       omdbapi.com
// @connect       media-amazon.com
// @downloadURL https://update.greasyfork.org/scripts/16946/IMDB%20info%20%2B%20torrent%20from%20magnet.user.js
// @updateURL https://update.greasyfork.org/scripts/16946/IMDB%20info%20%2B%20torrent%20from%20magnet.meta.js
// ==/UserScript==

// Find at:
// https://greasyfork.org/en/scripts/16946-imdb-info-torrent-from-magnet
// https://openuserjs.org/scripts/hossam6236/IMDB_info_%2B_.torrent_from_magnet

// TODO:
// - storage (cleanup)
// - tests

/**
 * @typedef {(m: ResolvedMovieData) => void} CbMovieMouseEvent
 * @typedef {Map<string, { title: string, year: string, hash: string, promise: Promise<ResolvedMovieData> }>} MoviesDataMap
 * @typedef {{
        Error?: any;
        Actors: string;
        Awards: string;
        BoxOffice: string;
        Country: string;
        DVD: string;
        Director: string;
        Genre: string;
        Language: string;
        Metascore: string;
        Plot: string;
        Poster: string;
        Production: string;
        Rated: string;
        Ratings: {Source: string;Value: string;}[][];
        Released: string;
        Response: string;
        Runtime: string;
        Title: string;
        Trailer?: string;
        Type: string;
        Website: string;
        Writer: string;
        Year: string;
        imdbID: string;
        imdbRating: string;
        imdbVotes: string;
    }} ResolvedMovieData
 */

/**
 * @global
 * @type {(a: Partial<XMLHttpRequest> & {url: string; method: string;}) => void} GM_xmlhttpRequest
 */
var GM_xmlhttpRequest;

(function IIFE(document, hostname) {
  const POSTER_PLACEHOLDER =
    "http://ia.media-imdb.com/images/G/01/imdb/images/nopicture/large/film-184890147._CB379391879_.png";
  const STYLE = `
    .imdb-download-link::before {
        content: '⇩';
    }
    .title_wrapper .imdb-download-link {
        font-size: .5em;
    }
    a.movie-preview {
        display: inline-block !important;
    }
    .movie-preview-starter {
        display: inline-block;
        position: fixed;
        opacity: 0.85;
        top: 0;
        right: 0;
        z-index: 10000;
        text-align: center;
    }
    .movie-preview-starter--button {
        display: inline-block;
        cursor: pointer;
        margin: 7px;
        padding: 7px;
        font-size: 12pt;
        font-family: Tahoma, Arial;
        border-radius: 5px;
    }
    .movie-preview-box {
        position: fixed;
        z-index:9999;
        width:475px;
        height:283px;
        top: calc(50vh - 150px);
        left: 50vw;
        display: flex;
        color: #000;
        background-color: white;
        border: 3px solid #222;
        border-radius: 5px;
        overflow: hidden;
        opacity: 0;
        visibility: hidden;
        transition: all 0.5s ease-in-out;
    }
    .movie-preview-box.visible {
        opacity: 1;
        visibility: visible;
    }
    .movie-preview-box *,
    .movie-preview-unique-list > * {
        font-size: 10pt;
        font-family: Tahoma, Arial;
        line-height: initial;
    }
    .movie-preview-box.no-trailer .preview--info--trailer {
        display: none;
    }
    .torrent-download-links {
        opacity: 0.8;
        font-size: 90%;
        position: absolute;
        display: none;
    }
    .assisted-torrent-link:hover .torrent-download-links {
        display: inline-block;
    }
    .movie-preview-unique-list {
        width: 50%;
        max-width: 400px;
        max-height: 200px;
        margin: auto;
        overflow: auto;
        text-align: left;
        padding: 5px;
        line-height: 15px;
        color: #000;
        background-color: white;
        border: 3px solid #222;
        border-radius: 5px;
    }
    .movie-preview-unique-list > * {
        margin: 2px;
    }
    .movie-preview-unique-list a {
        border: 0;
    }
    .movie-preview-unique-list a:hover {
        border: 0;
        text-decoration: underline;
    }
    a.movie-preview {
        cursor: pointer;
    }
    a.movie-preview.highlight {
        background-color: rgba(255, 231, 58, 0.59);
    }
    .movie-preview-enhancement {
        display: inline-block !important;
        max-width: 30px;
        min-width: 30px;
        font-size: 85%;
        margin:0 4px 0 0;
    }
    .movie-preview-enhancement.remarkable {
      font-weight: bold;
    }
    .movie-preview-enhancement.starred-1::after {
      content: "★";
      color: #DD0000;
    }
    .movie-preview-enhancement.starred-2::after {
      content: "★";
      color: #660000;
    }
    .movie-preview-enhancement.starred-3::after {
      content: "★";
    }
    .movie-preview-enhancement.starred-4::after {
      content: "☆";
    }
    .preview--poster {
        flex-shrink: 0;
        width: 200px;
        height: 283px;
    }
    .preview--poster--img {
        cursor: pointer;
        width: 100%;
        height: 100%;
    }
    .preview--info {
        text-align:left;
        padding:3px;
        height:277px;
        overflow:auto;
        display:inline-block;
    }
    .preview--info--title {
        text-align:center;
        font-size:125%pt;
        font-weight:bold;
    }
    .preview--info--trailer {
        color: #369;
        cursor: pointer;
        display: inline-block;
    }
    .preview--info--trailer:hover {
        text-decoration: underline;
    }
    .preview--info--trailer::before {
        content: '(';
    }
    .preview--info--trailer::after {
        content: '), ';
    }
    .preview--info--imdb-rating,
    .preview--info--imdb-votes {
        font-weight: bold;
    }
    `;

  /** @param {string} style */
  const appendStyleToDocument = (style) => {
    const styleNode = document.createElement("style");
    styleNode.type = "text/css";
    styleNode.textContent = style;
    document.head.append(styleNode);
  };

  /**
   * @param {HTMLImageElement} imageNode
   * @param {string} src
   */
  const setImgSrcBypassingAdBlock = (imageNode, src) => {
    imageNode.src = src;
    imageNode.onerror = (e) => {
      if (!imageNode.src.startsWith("http")) return;
      GM_xmlhttpRequest({
        url: imageNode.src,
        method: "GET",
        responseType: "blob",
        onload: (data) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            // @ts-ignore
            imageNode.src = reader.result;
            const oldNode = imageNode;
            // @ts-ignore
            imageNode = oldNode.cloneNode();
            // @ts-ignore
            imageNode.style = "";
            oldNode.replaceWith(imageNode);
          };
          // @ts-ignore
          reader.readAsDataURL(data.response);
        },
      });
    };
  };

  /** @param {string} movieTitle */
  const getTorrentSearchURLFromMovieTitle = (movieTitle) =>
    `https://thepiratebay.org/search/${encodeURIComponent(movieTitle)}/0/99/0`;

  const applyImdbDomUpdate = () => {
    const movieTitleNodes = document.querySelectorAll(
      "div.titleBar > div.title_wrapper > h1, td.titleColumn, div.lister-item-content .lister-item-header, div.title > a.title-grid, td.overview-top > h4 > a"
    );
    for (let movieTitleNode of movieTitleNodes) {
      if (movieTitleNode.hasAttribute("with-download-link")) continue;
      movieTitleNode.setAttribute("with-download-link", "true");

      let movieTitle = movieTitleNode.textContent || "";
      if (movieTitleNode.querySelector(".lister-item-index")) {
        /** @type {HTMLElement} */
        // @ts-ignore
        let movieTitleNodeClone = movieTitleNode.cloneNode(true);
        movieTitleNodeClone.removeChild(
          /** @type {Node} */
          (movieTitleNodeClone.querySelector(".lister-item-index"))
        ).textContent;
      }
      movieTitle = movieTitle.replace(/\s+/g, " ").trim();

      const linkNode = document.createElement("a");
      linkNode.classList.add("imdb-download-link");
      linkNode.setAttribute(
        "href",
        getTorrentSearchURLFromMovieTitle(movieTitle)
      );

      movieTitleNode.append(linkNode);
    }
  };

  /**
   * @param {string} title
   * @param {string} year
   */
  const getMovieHashFromTitleAndYear = (title, year = "") => {
    return `${title}_${year}`.trim().replace(/[^a-zA-Z0-9]+/g, "-");
  };

  /** @param {HTMLAnchorElement} linkNode */
  const getMovieTitleAndYearFromLinkNode = (linkNode) => {
    const linkText = linkNode.textContent || "";
    const linkHref = linkNode.getAttribute("href") || "";
    const boxofficemojo = /^\/movies\/\?id=(.+)\.htm/i.exec(linkHref);
    let title = linkText
      .toLowerCase()
      .replace(",", " ")
      .replace(".", " ")
      .replace("(", " ")
      .replace("1080p", "")
      .replace("720p", "");
    /** @type {any} */
    let year = "";
    if (boxofficemojo) {
      title = linkText.toLowerCase();
      if (!year) {
        year = /\(([0-9]{4}).*\)/.exec(title);
        if (year) {
          // year from link text (if available)
          title = title.replace(year[0], " ").trim();
          year = year[1];
        } else {
          year = /([0-9]{4})\.htm$/.exec(linkHref);
          if (year && year[1] && year[1] > 1950) {
            // year from link href (if available)
            year = year[1];
          } else {
            // year from GET parameter (if available)
            year = new URL(window.location.href).searchParams.get("yr");
            if (!year) {
              // year is current year
              year = new Date().getFullYear();
            }
          }
        }
      }
      return { title, year };
    } else {
      const reM = /[0-9]{4}/i;
      const reS = /S[0-9]{2}E[0-9]{2}|[0-9]{1}x[0-9]{2}/i;
      /** @type {number | RegExpExecArray | null} */
      let matchYear = reM.exec(title);
      matchYear = matchYear && matchYear.length ? parseInt(matchYear[0]) : null;
      const matchSeries = reS.exec(title);
      if (matchYear && matchYear > 1900) {
        year = matchYear;
        title = title.substr(0, title.search(reM)).trim();
        return { title, year };
      } else if (matchSeries) {
        year = "-";
        title = title.substr(0, title.search(reS)).trim();
        return { title, year };
      }
    }
    return { title: null, year: null };
  };

  // const storage = localStorage.getItem('movie_preview');

  /** @param {string} url */
  const fetchSafe = (url) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url,
        method: "GET",
        onload: (data) => {
          // @ts-ignore
          resolve(data.responseText);
        },
        onerror: reject,
      });
    });
  };

  /**
   * @param {string} title
   * @param {number|string|null} year
   * @returns {Promise<ResolvedMovieData>}
   */
  const loadMovie = (title, year) => {
    const url = `https://www.omdbapi.com/?apikey=c989d08d&t=${title}&y=${year}&plot=full&r=json`;
    // const url = 'http://www.imdb.com/xml/find?json=1&nr=1&tt=on&q=' + encodeURIComponent(title + ' (' + year + ')');
    return fetchSafe(url).then((responseText) => JSON.parse(responseText)); // resolvedMovieData
  };

  /**
   * @param {string} text
   * @param {RegExp} regexp
   * @param {number} captureGroupIndex
   * @returns {string}
   */
  const _matchOnlyCaptureGroup = (text, regexp, captureGroupIndex = 1) => {
    const matchResult = text.match(regexp);
    return matchResult !== null ? matchResult[captureGroupIndex] : "";
  };

  /** @param {ResolvedMovieData} resolvedMovieData */
  const assessMovieRankings = (resolvedMovieData) => {
    const rankingMetrics = extractRankingMetrics(resolvedMovieData);
    const { rating, votes, wins_sig, wins, noms_sig, noms } = rankingMetrics;
    const isRemarkable = rating >= 7.0 && votes > 50000;

    let starredDegree;
    if ((wins_sig >= 1 || noms_sig >= 2) && (wins >= 5 || noms >= 10)) {
      starredDegree = 1; // red filled star
    } else if (
      wins >= 10 ||
      (noms_sig >= 1 && noms >= 5) ||
      (rating > 8.0 && votes > 50000)
    ) {
      starredDegree = 2; // darkred filled star
    } else if (wins >= 5 || noms >= 10 || noms_sig >= 1 || votes > 150000) {
      starredDegree = 3; // black/blue filled star
    } else if (wins + noms > 1) {
      starredDegree = 4; // non-filled star
    }

    let significancePercentage = 1.0;
    if (rating <= 5.0 || votes <= 1000) {
      significancePercentage = Math.max(
        0.15,
        Math.min(rating / 10, votes / 1000)
      );
    } else if (
      resolvedMovieData.imdbRating == "N/A" ||
      resolvedMovieData.imdbVotes == "N/A"
    ) {
      significancePercentage = 0.15;
    }

    return {
      isRemarkable,
      starredDegree,
      significancePercentage,
      rankingMetrics,
    };
  };

  /** @param {ResolvedMovieData} resolvedMovieData */
  const extractRankingMetrics = (resolvedMovieData) => {
    const awards = resolvedMovieData.Awards;
    const reg_wins = /([0-9]+) win(s|)/;
    const reg_noms = /([0-9]+) nomination(s|)/;
    const reg_wins_sig = /Won ([0-9]+) Oscar(s|)/;
    const reg_noms_sig = /Nominated for ([0-9]+) Oscar(s|)/;

    return {
      rating: parseFloat(resolvedMovieData.imdbRating),
      votes: parseFloat(resolvedMovieData.imdbVotes.replace(/,/g, "")),
      wins: parseInt(_matchOnlyCaptureGroup(awards, reg_wins, 1)) || 0,
      noms: parseInt(_matchOnlyCaptureGroup(awards, reg_noms, 1)) || 0,
      wins_sig: parseInt(_matchOnlyCaptureGroup(awards, reg_wins_sig, 1)) || 0,
      noms_sig: parseInt(_matchOnlyCaptureGroup(awards, reg_noms_sig, 1)) || 0,
      awards_text: awards.toLowerCase(),
    };
  };

  /**
   * @param {HTMLElement[] | NodeListOf<Element>} nodes
   * @param {ResolvedMovieData} resolvedMovieData
   * @param {CbMovieMouseEvent} cbOnMouseOver
   * @param {CbMovieMouseEvent} cbOnMouseOut
   */
  const updateLinkNodesWithMovieData = (
    nodes,
    resolvedMovieData,
    cbOnMouseOver,
    cbOnMouseOut
  ) => {
    for (let linkNode of nodes) {
      if (resolvedMovieData.Error) continue;
      /** @type {HTMLElement} */
      (linkNode).onmouseover = () => cbOnMouseOver(resolvedMovieData);
      /** @type {HTMLElement} */
      (linkNode).onmouseout = () => cbOnMouseOut(resolvedMovieData);

      const {
        isRemarkable,
        starredDegree,
        significancePercentage,
        rankingMetrics: { awards_text },
      } = assessMovieRankings(resolvedMovieData);

      const enhancementNode = document.createElement("a");
      enhancementNode.classList.add("movie-preview-enhancement");
      linkNode.parentNode &&
        linkNode.parentNode.insertBefore(enhancementNode, linkNode);
      if (isRemarkable) {
        enhancementNode.classList.add("remarkable");
      }
      if (starredDegree) {
        enhancementNode.classList.add(`starred-${starredDegree}`);
      }

      enhancementNode.setAttribute(
        "href",
        `http://www.imdb.com/title/${resolvedMovieData.imdbID}`
      );
      enhancementNode.setAttribute("target", "_blank");
      enhancementNode.setAttribute(
        "title",
        `${resolvedMovieData.imdbVotes} votes - ${resolvedMovieData.Runtime} - Rated ${resolvedMovieData.Rated} - Awards: ${awards_text}`
      );
      enhancementNode.innerHTML = resolvedMovieData.imdbRating;
      enhancementNode.style.opacity = significancePercentage.toString();
    }
  };

  /** @param {MoviesDataMap} moviesDataMap */
  const createUniqueMovieList = (moviesDataMap) => {
    let wrapperNode = document.createElement("div");
    wrapperNode.classList.add("movie-preview-unique-list");
    for (let movieData of moviesDataMap.values()) {
      const parentNode = document.createElement("div");
      const linkNode = document.createElement("a");
      linkNode.textContent = movieData.hash;
      linkNode.classList.add("movie-preview");
      linkNode.dataset.movieHash = movieData.hash;
      linkNode.onclick = () => {
        for (let movPreview of document.querySelectorAll(".movie-preview")) {
          movPreview.classList.remove("highlight");
        }
        for (let movPreview of document.querySelectorAll(
          `.movie-preview[data-movie-hash="${movieData.hash}"]`
        )) {
          movPreview.classList.add("highlight");
        }
      };
      movieData.promise.then((resolvedMovieData) => {
        if (resolvedMovieData.Title) {
          linkNode.textContent = `${resolvedMovieData.Title} (${resolvedMovieData.Year})`;
        }
      });
      wrapperNode.appendChild(parentNode);
      parentNode.appendChild(linkNode);
    }
    return wrapperNode;
  };

  /** @param {HTMLElement} node */
  const cleanupPorn = (node) => {
    const innerHTML = node.innerHTML.toLowerCase();
    if (innerHTML.includes("xxx") || innerHTML.includes("porn"))
      node.outerHTML = "";
  };

  /** @param {string} hostname */
  const isHostnamePirateBay = (hostname) =>
    /.*(pirate.*bay|tpb).*/.test(hostname);
  /** @param {string} hostname */
  const isHostnameIMDB = (hostname) => hostname.endsWith("imdb.com");

  /**
   * @param {HTMLElement} parentNode
   * @param {string} selector
   * @returns {HTMLElement}
   */
  const _querySelector = (parentNode, selector) =>
    // @ts-ignore
    parentNode.querySelector(selector);

  const initPreviewNode = () => {
    /** @type {HTMLDivElement & {show: ()=>void; hide: ()=>void; hiding: number; setMovie: CbMovieMouseEvent}}  */
    // @ts-ignore
    const previewNode = document.createElement("div");
    previewNode.classList.add("movie-preview-box");
    previewNode.insertAdjacentHTML(
      "beforeend",
      `
            <div class="preview--poster">
                <img class="preview--poster--img" src="${POSTER_PLACEHOLDER}">
            </div>
            <div class="preview--info">
                <div class="preview--info--title">
                    <a href="" target="_blank">
                        <span class="title">The Martian</span> (<span class="year">2015</span>)
                    </a>
                </div>
                <div class="preview--info--trailer" title="Play trailer" data-trailer-url="${POSTER_PLACEHOLDER}">▶</div>
                <span class="preview--info--imdb-rating">8.1</span><span style="color:grey;">/10</span> (<span class="preview--info--imdb-votes">275,300</span> votes), <span class="preview--info--imdb-metascore">-</span> Metascore
                <br /><u>Awards</u>: <span class="preview--info--awards"></span>
                <br /><u>Genre</u>: <span class="preview--info--genre">Adventure, Comedy, Drama</span>
                <br /><u>Released</u>: <span class="preview--info--released">17 Oct 2017</span>
                <br /><u>Box Office</u>: <span class="preview--info--boxofficegross">$123,456,789</span>
                <br /><u>Rated</u>: <span class="preview--info--mpaa-rating">PG-13</span>, <u>Runtime</u>: <span class="preview--info--runtime">144 min</span>
                <br /><u>Actors</u>: <span class="preview--info--actors">Matt Damon, Jessica Chastain, Kristen Wiig, Jeff Daniels</span>
                <br /><u>Director</u>: <span class="preview--info--director">Ridley Scott</span>
                <br /><u>Plot</u>: <span class="preview--info--plot">During a manned mission to Mars, Astronaut Mark Watney is presumed dead after a fierce storm and left behind by his crew. But Watney has survived and finds himself stranded and alone on the hostile planet. With only meager supplies, he must draw upon his ingenuity, wit and spirit to subsist and find a way to signal to Earth that he is alive.</span>
            </div>
        `
    );

    // @ts-ignore
    previewNode.querySelector(".preview--poster--img").onclick = (e) => {
      e.preventDefault();
      const poster = e.currentTarget.src;
      if (poster === POSTER_PLACEHOLDER || !poster.startsWidth("http")) return;
      window.open(poster, "", "width=600, height=600");
    };

    // @ts-ignore
    previewNode.querySelector(".preview--info--trailer").onclick = (e) => {
      e.preventDefault();
      window.open(
        e.currentTarget.getAttribute("data-trailer-url"),
        "",
        "width=900, height=500"
      );
    };

    previewNode.show = () => {
      previewNode.classList.add("visible");
      clearTimeout(previewNode.hiding);
    };

    previewNode.hide = () => {
      previewNode.hiding = setTimeout(
        () => previewNode.classList.remove("visible"),
        1500
      );
    };

    previewNode.setMovie = (movie) => {
      _querySelector(previewNode, ".preview--info--title > a").setAttribute(
        "href",
        `http://www.imdb.com/title/${movie.imdbID}`
      );
      _querySelector(previewNode, ".preview--info--title .title").textContent =
        movie.Title;
      _querySelector(previewNode, ".preview--info--title .year").textContent =
        movie.Year;

      if (!movie.Poster) previewNode.classList.add("no-poster");
      else previewNode.classList.remove("no-poster");
      setImgSrcBypassingAdBlock(
        /** @type {HTMLImageElement} */
        (_querySelector(previewNode, ".preview--poster--img")),
        movie.Poster || POSTER_PLACEHOLDER
      );

      if (!movie.Trailer) previewNode.classList.add("no-trailer");
      else previewNode.classList.remove("no-trailer");
      _querySelector(
        previewNode,
        ".preview--info--trailer"
      ).dataset.trailerUrl = movie.Trailer || "";

      _querySelector(previewNode, ".preview--info--imdb-rating").textContent =
        movie.imdbRating;
      _querySelector(previewNode, ".preview--info--imdb-votes").textContent =
        movie.imdbVotes;
      _querySelector(
        previewNode,
        ".preview--info--imdb-metascore"
      ).textContent = movie.Metascore;
      _querySelector(previewNode, ".preview--info--released").innerHTML =
        movie.Released;
      _querySelector(previewNode, ".preview--info--boxofficegross").innerHTML =
        movie.BoxOffice || "N/A";
      _querySelector(previewNode, ".preview--info--genre").textContent =
        movie.Genre;
      _querySelector(previewNode, ".preview--info--mpaa-rating").textContent =
        movie.Rated;
      _querySelector(previewNode, ".preview--info--runtime").textContent =
        movie.Runtime;
      _querySelector(
        previewNode,
        ".preview--info--awards"
      ).innerHTML = movie.Awards.replace("Oscars.", "<b>Oscars</b>.")
        .replace("Oscar.", "<b>Oscar</b>.")
        .replace("Another ", "<br />Another ");
      _querySelector(previewNode, ".preview--info--actors").textContent =
        movie.Actors;
      _querySelector(previewNode, ".preview--info--director").textContent =
        movie.Director;
      _querySelector(previewNode, ".preview--info--plot").textContent =
        movie.Plot;
    };

    previewNode.onmouseover = previewNode.show;
    previewNode.onmouseout = previewNode.hide;

    return previewNode;
  };

  appendStyleToDocument(STYLE);

  if (isHostnameIMDB(hostname)) {
    applyImdbDomUpdate();
  } else {
    const starterNode = document.createElement("form");
    starterNode.classList.add("movie-preview-starter");
    starterNode.insertAdjacentHTML(
      "beforeend",
      `<button class="movie-preview-starter--button"> load IMDb info </button>`
    );
    starterNode.onsubmit = (e) => {
      e.preventDefault();

      const previewNode = initPreviewNode();
      /** @type {MoviesDataMap} */
      const moviesDataMap = new Map();

      for (let linkNode of document.querySelectorAll("a")) {
        const href = linkNode.getAttribute("href") || "";
        // const torrentz = /^\/([a-zA-Z0-9]{40})/i.exec(href);
        // const piratebay = /^\/torrent\/([0-9])/i.exec(href);
        const hashMatch = /(^\/|^magnet\:\?xt\=urn\:btih\:)([a-zA-Z0-9]{40})/i.exec(
          href
        );

        cleanupPorn(linkNode);

        if (hashMatch) {
          const hash = hashMatch[2].toUpperCase();
          /////////////////////////////////////////////////////// Loading Magnet from piratebay
          const assistingNode = document.createElement("div");
          assistingNode.classList.add("torrent-download-links");
          assistingNode.insertAdjacentHTML(
            "beforeend",
            `
                <a target="_blank" href="http://torrage.info/torrent.php?h=${hash}"         style="display: inline-block; padding:0 5px 0 5px; background-color:#748DAB; text-align:center;">t1</a>
                <a target="_blank" href="http://www.btcache.me/torrent/${hash}"             style="display: inline-block; padding:0 5px 0 5px; background-color:#748DAB; text-align:center;">t1</a>
                <a target="_blank" href="http://torrentproject.se/torrent/${hash}.torrent"  style="display: inline-block; padding:0 5px 0 5px; background-color:#748DAB; text-align:center;">m</a>
            `
          );
          /** @type {HTMLElement | null} */
          // @ts-ignore
          const parentNode = linkNode.parentNode;
          if (parentNode) {
            parentNode.classList.add("assisted-torrent-link");
            parentNode.append(assistingNode);
          }
        }

        let { title, year } = getMovieTitleAndYearFromLinkNode(linkNode);

        if (title && year) {
          const movieHash = getMovieHashFromTitleAndYear(title, year);
          linkNode.classList.add("movie-preview");
          linkNode.dataset.movieHash = movieHash;
          linkNode.style.display =
            linkNode.style.display === "block"
              ? "inline-block"
              : linkNode.style.display;
          if (!moviesDataMap.has(movieHash)) {
            moviesDataMap.set(movieHash, {
              title,
              year,
              hash: movieHash,
              promise: loadMovie(title, year),
            });
          }
        }
      }

      console.log(`IMDB info + .torrent from magnet`, moviesDataMap);

      /** @param {ResolvedMovieData} resolvedMovieData */
      const cbOnMouseOver = (resolvedMovieData) => {
        previewNode.setMovie(resolvedMovieData);
        previewNode.show();
      };
      const cbOnMouseOut = previewNode.hide;

      for (let movieData of moviesDataMap.values()) {
        movieData.promise.then((resolvedMovieData) => {
          updateLinkNodesWithMovieData(
            document.querySelectorAll(
              `.movie-preview[data-movie-hash="${movieData.hash}"]`
            ),
            resolvedMovieData,
            cbOnMouseOver,
            cbOnMouseOut
          );
        });
      }

      starterNode.remove();
      document.body.prepend(createUniqueMovieList(moviesDataMap));
      document.body.append(previewNode);
    };

    document.body.prepend(starterNode);
  }

  if (isHostnamePirateBay(hostname)) {
    /** @type {HTMLElement | null} */
    const mainContent = document.querySelector("#main-content");
    if (!mainContent) return;
    mainContent.style.marginLeft = "0";
    mainContent.style.marginRight = "0";
  }
})(document, window.location.hostname);
