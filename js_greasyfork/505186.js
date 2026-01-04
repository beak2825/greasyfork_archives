// ==UserScript==

// @name                IMDb - Show Digital Release Date
// @description         Displays the digital release date for movies and TV shows on IMDb
// @version             1.1

// @namespace           io.github.ni554n
// @match               https://www.imdb.com/title/tt*
// @match               https://m.imdb.com/title/tt*
// @run-at              document-idle
// @grant               GM_xmlhttpRequest

// @supportURL          https://github.com/ni554n/userscripts/issues
// @license             MIT

// @author              Nissan Ahmed
// @homepageURL         https://anissan.com
// @contributionURL     https://paypal.me/ni554n

// @downloadURL https://update.greasyfork.org/scripts/505186/IMDb%20-%20Show%20Digital%20Release%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/505186/IMDb%20-%20Show%20Digital%20Release%20Date.meta.js
// ==/UserScript==

const imdbId = document.querySelector(
  `meta[property="imdb:pageConst"]`,
)?.content;

if (!imdbId) throw new Error("Failed to find IMDb ID on the page");

requestTmdb(
  `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id`,
  (response) => {
    if (response.response.tv_results.length !== 0) {
      addReleaseDateInfo(response.response.tv_results[0].first_air_date);
      return;
    }

    if (response.response.movie_results.length !== 0) {
      const tmdbId = response.response.movie_results[0].id;

      requestTmdb(
        `https://api.themoviedb.org/3/movie/${tmdbId}/release_dates`,
        (response) => {
          let earliestReleaseDate;

          // https://developer.themoviedb.org/reference/movie-release-dates
          for (const obj of response.response.results) {
            for (const date of obj.release_dates) {
              if (date.type !== 4) continue;

              const releaseDate = new Date(date.release_date);

              if (earliestReleaseDate === undefined) {
                earliestReleaseDate = releaseDate;
              } else if (releaseDate < earliestReleaseDate) {
                earliestReleaseDate = date.release_date;
              }
            }
          }

          addReleaseDateInfo(earliestReleaseDate);
        },
      );
    }
  },
);

/**
 * @param { string | Date } releaseDate
 */
function addReleaseDateInfo(releaseDate) {
  const subtitleElement = document.querySelector(
    `h1[data-testid="hero__pageTitle"]`,
  )?.parentElement?.lastElementChild;

  const releasedNode = subtitleElement?.lastElementChild?.cloneNode();
  if (!releasedNode) {
    console.error(
      "Failed to create a suitable element to add the release date in IMDb webpage.",
    );
    return;
  }

  if (releaseDate) {
    releasedNode.textContent = `🖥️ ${getRelativeTime(releaseDate)}`;
    releasedNode.title = `Digital release on ${releaseDate.toString()}`;
  } else {
    releasedNode.textContent = "🖥️ Unknown";
    releasedNode.title = "Digital release date not found";
  }

  subtitleElement?.appendChild(releasedNode);
}

/**
 * @param { string } url
 * @param { (response: object) => void } onload
 */
function requestTmdb(url, onload) {
  // Request the release date with TMDb ID
  GM_xmlhttpRequest({
    method: "GET",
    url,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${atob("ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKaGRXUWlPaUl4Wm1FelpETTFaR1l4TVdOak9HRmpNR1F6WVRsaU5qaGtZVGt4WTJZeVpTSXNJbk4xWWlJNklqWTBZbUU0TUdSa01URXpPRFpqTURCallXWTRNelE1TlNJc0luTmpiM0JsY3lJNld5SmhjR2xmY21WaFpDSmRMQ0oyWlhKemFXOXVJam94ZlEuUXNTVlFIWlhYSE1fYlpMZGs3dHo5ck5CSzFYVGpuc1FSS2dCLU92aUdrWQ==")}`,
    },
    responseType: "json",
    onload,
    onerror: console.error,
  });
}

/**
 * Formats date relatively such as "6 months ago", "1 week ago", "in 2 months".
 *
 * @param { string | Date } date
 * @returns { string }
 */
function getRelativeTime(date) {
  if (!(date instanceof Date)) date = new Date(date);
  if (isNaN(date)) throw new Error(`Invalid date: ${date}`);

  const timeFormatter = new Intl.RelativeTimeFormat();

  const diffMilliSeconds = date - new Date();
  const diffSeconds = Math.round(diffMilliSeconds / 1000);

  if (Math.abs(diffSeconds) < 60) {
    return timeFormatter.format(diffSeconds, "second");
  }

  const diffMinutes = Math.round(diffSeconds / 60);

  if (Math.abs(diffMinutes) < 60) {
    return timeFormatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (Math.abs(diffHours) < 24) {
    return timeFormatter.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  const diffDaysAbs = Math.abs(diffDays);

  if (diffDaysAbs < 7) {
    return timeFormatter.format(diffDays, "day");
  }

  if (diffDaysAbs < 30) {
    return timeFormatter.format(Math.round(diffDays / 7), "week");
  }

  if (diffDaysAbs < 365) {
    return timeFormatter.format(Math.round(diffDays / 30), "month");
  }

  return timeFormatter.format(Math.round(diffDays / 365), "year");
}
