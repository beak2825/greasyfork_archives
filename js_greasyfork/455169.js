// ==UserScript==
// @name         IMDb Info On Netflix
// @license      GPLv3
// @description  Detailed IMDB info to Netflix titles
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @author       Hyftar
// @homepageURL  https://github.com/Hyftar/IMDb-Info-on-Netflix
// @match        https://www.netflix.com/browse
// @match        https://www.netflix.com/title/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/455169/IMDb%20Info%20On%20Netflix.user.js
// @updateURL https://update.greasyfork.org/scripts/455169/IMDb%20Info%20On%20Netflix.meta.js
// ==/UserScript==

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch (e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0);
  }
}

(function () {
  Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
  }

  Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);

    if (value === null) {
      return {}
    }

    return JSON.parse(value);
  }

  const useLocalStorage = storageAvailable('localStorage');

  window.titlesIdCache = useLocalStorage ? localStorage.getObject('TitlesIdCache') : {}
  window.titlesRatingCache = useLocalStorage ? localStorage.getObject('TitlesRatingCache') : {}

  $('head')
    .append(
      `<style>
        a.slnk {
          margin-left: 10px;
          margin-top:5px;
        }

        a.slnk img {
          width: 25px;
          height: 25px;
        }

        .previewModal-episodeDetail-and-badge .imdbInfoLoading
        ,.previewModal-episodeDetail-and-badge .imdbLogo {
          margin-left: 1em;
        }

        .previewModal-episodeDetail-and-badge {
          display: flex;
          align-items: center;
        }
      </style>`
    );

  let isInfoLoaded = false;

  //main loop
  const intervalId = setInterval(
    function () {
      if ($('.imdbRating').length === 0
        && $('.imdbInfoLoading').length === 0) {
        isInfoLoaded = false;
      }

      if ($('.PlayerControlsNeo__button-control-row').length !== 0) {
        clearInterval(intervalId);

        return;
      }

      if (isInfoLoaded) {
        return;
      }

      if ($('.previewModal--detailsMetadata-right').length !== 0) {
        isInfoLoaded = true;
        loadImdbScorePreviewModal();

        return;
      }

      if ($('.previewModal--info').length !== 0) {
        isInfoLoaded = true;
        loadImdbScoreInfoModal();

        return;
      }
    },
    500
  );

  function loadImdbScoreInfoModal() {
    const title = $('.previewModal--boxart')[0].alt;

    if (title === undefined) {
      return;
    }

    loadRatingAsync(title);
  }

  function loadImdbScorePreviewModal() {
    const title = $('.playerModel--player__storyArt')[0].alt;

    if (title === undefined) {
      return;
    }

    loadRatingAsync(title);
  }

  async function loadRatingAsync(title) {
    const loadingElem =
      $('<img>')
        .attr('src', "https://i.imgur.com/1Aatim3.gif")
        .attr('width', 20)
        .attr('class', "imdbInfoLoading")

    loadingElem.appendTo('.videoMetadata--container:first');
    loadingElem.clone().appendTo('.previewModal-episodeDetail-and-badge')

    const imdbInfo = await getImdbInfoFromTitle(title);

    $('.imdbInfoLoading').remove()
    $('.imdbLogo').remove()
    $('.imdbRating').remove()

    const color = getRatingColor(imdbInfo);

    const imdbUrl = 'https://www.imdb.com' + imdbInfo.url;

    const imdbLogoElem =
      $('<a>')
        .attr('class', 'imdbLogo')
        .attr('href', imdbUrl)
        .attr('target', '_blank')
        .addClass('slnk')
        .html('<img src="https://i.imgur.com/uKZrahf.png">');

    imdbLogoElem.appendTo('.videoMetadata--container:first');
    imdbLogoElem.clone().appendTo('.previewModal-episodeDetail-and-badge');

    const imdbInfoElem =
      $('<b>')
        .attr('class', 'imdbRating')
        .attr('span', imdbUrl)
        .attr('style', "line-height:25px; margin-left: 5px; color:" + color)
        .html(imdbInfo.rating);

    imdbInfoElem.appendTo('.videoMetadata--container:first');
    imdbInfoElem.clone().appendTo('.previewModal-episodeDetail-and-badge');
  }

  async function getImdbInfoFromTitle(title) {
    const imdbId = await getImdbIdFromTitle(title);

    if (imdbId === undefined) {
      return;
    }

    return getImdbInfoFromId(imdbId);
  }

  async function getImdbIdFromTitle(title) {
    if (window.titlesIdCache[title] !== undefined) {
      return Promise.resolve(window.titlesIdCache[title]);
    }

    const encodedUrl = encodeURIComponent(title)

    const url = `https://www.imdb.com/find?s=tt&q=${encodedUrl}`

    return new Promise(
      function (resolve, reject) {
        GM_xmlhttpRequest({
          url,

          method: 'GET',
          responseType: 'document',
          synchronous: false,
          onload: (resp) => {
            if (resp.status !== 200) {
              reject(`Error retrieving the IMDb id at url : '${url}'`)
            }

            const doc = document.implementation.createHTMLDocument().documentElement;
            doc.innerHTML = resp.responseText;

            const link =
              Array.from(doc.querySelectorAll('.find-result-item:first-child a'))
                .find((el) => !el.parentNode.textContent.trim().match(/\((?:TV Episode|Short|Video Game|Video)\)/));

            const id = link?.href.match(/title\/(tt\d+)/)[1];

            if (id === undefined) {
              return reject(`Error getting IMDb id for ${title}`);
            }

            window.titlesIdCache[title] = id;
            localStorage.setObject('TitlesIdCache', window.titlesIdCache)

            return resolve(id);
          }
        });
      }
    );
  }

  function getImdbInfoFromId(id) {
    const previousImdbInfo = window.titlesRatingCache[id];
    if (previousImdbInfo !== undefined
        && isIMDbInfoFresh(previousImdbInfo)) {
      return Promise.resolve(window.titlesRatingCache[id]);
    }

    const url = `https://www.imdb.com/title/${id}/`;

    return new Promise(function (resolve, reject) {
      GM_xmlhttpRequest({
        url,

        method: 'GET',
        responseType: 'document',
        synchronous: false,
        onload: (resp) => {
          if (resp.status !== 200) {
            return reject(`Error retrieving the IMDb rating at url : '${url}'`);
          }

          const doc = document.implementation.createHTMLDocument().documentElement;
          doc.innerHTML = resp.responseText;

          const jsonDataElement = doc.querySelector('script[type="application/ld+json"]');
          if (jsonDataElement === null) {
            return reject(`The JSON data at url '${url}' was not found`);
          }

          const jsonData = JSON.parse(jsonDataElement.textContent);
          const data = {
            id,

            url: jsonData.url,
            title: jsonData.name,
            datePublished: jsonData.datePublished,
            description: jsonData.description,
            rating: jsonData.aggregateRating.ratingValue,
            votes: jsonData.aggregateRating.ratingCount,

            dateFetched: new Date()
          };

          window.titlesRatingCache[id] = data;
          localStorage.setObject('TitlesRatingCache', window.titlesRatingCache);

          return resolve(data);
        }
      });
    });
  }

  function getRatingColor(imdbInfo) {
    if (imdbInfo.rating < 5) {
      return "#a10d0d";
    }

    if (imdbInfo.rating < 6) {
      return "#b33c2d";
    }

    if (imdbInfo.rating < 7) {
      return "#d98730";
    }

    if (imdbInfo.rating < 8) {
      return "#8bd925"
    }

    return "#2bff00"
  }

  function isIMDbInfoFresh(imdbInfo) {
    const daysSinceRelease = daysSince(imdbInfo.datePublished);
    const daysSinceFetched = daysSince(imdbInfo.dateFetched);

    if (daysSinceRelease < 120
        && daysSinceFetched > 2) {
      return false;
    }

    if (daysSinceFetched > 21) {
      return false;
    }

    return true;
  }

  function daysSince(date) {
    const now = new Date()
    const publishDate = new Date(date)

    return Math.floor((now.getTime()-publishDate.getTime())/(24*3600*1000))
  }
})();
