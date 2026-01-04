// ==UserScript==
// @name         Show Me the Posters
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display posters on Karagarga Browse Page
// @author       TYT@KG
// @match        https://karagarga.in/browse.php*
// @icon         https://www.google.com/s2/favicons?domain=karagarga.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436912/Show%20Me%20the%20Posters.user.js
// @updateURL https://update.greasyfork.org/scripts/436912/Show%20Me%20the%20Posters.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const posterUrl = `https://img3.doubanio.com/f/movie/30c6263b6db26d055cbbe73fe653e29014142ea3/pics/movie/movie_default_large.png`;
  const browseTable = document.querySelector("#torform #browse");
  [...browseTable.firstElementChild.children].forEach(async (el, ind) => {
    if (ind === 0) {
      const posterHeadTd = el.children[1].cloneNode();
      posterHeadTd.textContent = "Poster";
      el.firstElementChild.after(posterHeadTd);
    } else if (el.childElementCount > 2) {
      const posterTd = document.createElement("td");
      const posterImageElement = document.createElement("img");
      posterImageElement.src = posterUrl;
      posterImageElement.style.width = "100px";
      posterTd.append(posterImageElement);
      el.firstElementChild.after(posterTd);

      const imdbPic = el.querySelector('img[src="pic/imdblink.gif"]');
      if (imdbPic) {
        const link = imdbPic.parentElement.href;
        const imdbId = /tt\d{7,}$/.exec(link);
        if (imdbId !== null) {
          const requestUrl = `https://tmdb.secant.workers.dev/api/3/find/${imdbId}?language=zh-CN&external_source=imdb_id`;
          const resp = await fetch(requestUrl);
          if (resp.status === 200) {
            const details = await resp.json();
            const {
              movie_results: [
                {
                  poster_path: moviePosterPath = undefined,
                  title: movieTitle,
                } = {
                  poster_path: undefined,
                  title: undefined,
                },
              ],
              tv_results: [
                { poster_path: tvPosterPath = undefined, title: tvTitle } = {
                  poster_path: undefined,
                  title: undefined,
                },
              ],
              tv_episode_results: [
                { poster_path: tvEpisodePosterPath, title: tvEpisodeTitle } = {
                  poster_path: undefined,
                  title: undefined,
                },
              ],
              tv_season_results: [
                { poster_path: tvSeasonPosterPath, title: tvSeasonTitle } = {
                  poster_path: undefined,
                  title: undefined,
                },
              ],
            } = details;
            const posterPath =
              moviePosterPath ||
              tvPosterPath ||
              tvEpisodePosterPath ||
              tvSeasonPosterPath;
            const title =
              movieTitle || tvTitle || tvEpisodeTitle || tvSeasonTitle;
            if (posterPath) {
              const posterUrl = `https://image.tmdb.org/t/p/w200${posterPath}`;
              posterImageElement.src = posterUrl;
            }
            if (title) {
              const titleElement = el.querySelector('a[href^="details.php"]');
              const kgTitle = titleElement.textContent.toLocaleLowerCase();
              const tmdbTitle = title.toLocaleLowerCase();
              if (
                !kgTitle.includes(tmdbTitle) &&
                !tmdbTitle.includes(kgTitle)
              ) {
                const chineseTitleElement = document.createElement("b");
                chineseTitleElement.textContent = title;
                chineseTitleElement.style.fontSize = "large";
                chineseTitleElement.style.color = "#c11717";
                titleElement.append(document.createElement("br"));
                titleElement.append(chineseTitleElement);
              }
            }
          }
        }
      }
    }
  });
})();
