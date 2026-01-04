// ==UserScript==
// @name         ČSFD Compare
// @version      0.6.0.3
// @namespace    csfd.cz
// @description  Show your own ratings on other users ratings list
// @author       Jan Verner <SonGokussj4@centrum.cz>
// @license      GNU GPLv3
// @match        http*://www.csfd.cz/*
// @match        http*://www.csfd.sk/*
// @icon         http://img.csfd.cz/assets/b1733/images/apple_touch_icon.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://greasyfork.org/scripts/449554-csfd-compare-utils/code/csfd-compare-utils.js?version=1100309
// @downloadURL https://update.greasyfork.org/scripts/425054/%C4%8CSFD%20Compare.user.js
// @updateURL https://update.greasyfork.org/scripts/425054/%C4%8CSFD%20Compare.meta.js
// ==/UserScript==

const VERSION = 'v0.6.0.3';
const SCRIPTNAME = 'CSFD-Compare';
const SETTINGSNAME = 'CSFD-Compare-settings';
const GREASYFORK_URL = 'https://greasyfork.org/cs/scripts/425054-%C4%8Dsfd-compare';

const SETTINGSNAME_HIDDEN_BOXES = 'CSFD-Compare-hiddenBoxes';

const NUM_RATINGS_PER_PAGE = 50; // Was 100, now it's 50...

let defaultSettings = {
  // HOME PAGE
  hiddenSections: [],
  // GLOBAL
  showControlPanelOnHover: true,
  clickableHeaderBoxes: true,
  clickableMessages: true,
  addStars: true,
  // USER
  displayMessageButton: true,
  displayFavoriteButton: true,
  hideUserControlPanel: true,
  compareUserRatings: true,
  // FILM/SERIES
  addRatingsDate: false,
  showLinkToImage: true,
  ratingsEstimate: true,
  ratingsFromFavorites: true,
  addRatingsComputedCount: true,
  hideSelectedUserReviews: false,
  hideSelectedUserReviewsList: [],
  // ACTORS
  showOnOneLine: false,
  // EXPERIMENTAL
  loadComputedRatings: false,
  addChatReplyButton: false,
};

class Api {
  async getCurrentPageRatings(url) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Ids: [9499, 563036, 123],
      }),
    });
    console.log('response', response);
    const data = await response.json();
    console.log('data', data);
    return data;
  }
}

/**
 * Check if settings are valid. If not, reset them.
 * Return either unmodified or modified settings
 * @param {*} settings - LocalStorage settings current value
 * @param {string} settingsName - Settings Name
 */
async function checkSettingsValidity(settings, settingsName) {
  if (settingsName === SETTINGSNAME_HIDDEN_BOXES) {
    const isArray = Array.isArray(settings);
    let keysValid = true;
    settings.forEach((element) => {
      const keys = Object.keys(element);
      if (keys.length !== 2) {
        keysValid = false;
      }
    });

    if (!isArray || !keysValid) {
      settings = defaultSettings.hiddenSections;
      localStorage.setItem(SETTINGSNAME_HIDDEN_BOXES, JSON.stringify(settings));
    }
  }
  return settings;
}

/**
 * This function returns a promise that will resolve after "t" milliseconds
 */
function delay(t) {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
}

async function getSettings(settingsName = SETTINGSNAME) {
  if (!localStorage[settingsName]) {
    if (settingsName === SETTINGSNAME_HIDDEN_BOXES) {
      defaultSettings = [];
    }
    console.log(`ADDDING DEFAULTS: ${defaultSettings}`);
    localStorage.setItem(settingsName, JSON.stringify(defaultSettings));
    return defaultSettings;
  } else {
    return JSON.parse(localStorage[settingsName]);
  }
}

async function refreshTooltips() {
  try {
    tippy('[data-tippy-content]', {
      // interactive: true,
      popperOptions: { modifiers: { computeStyle: { gpuAcceleration: false } } },
    });
  } catch (err) {
    console.log('Error: refreshTooltips():', err);
  }
}

/**
 * Take a list of dictionaries and return merged dictionary
 * @param {*} list
 * @returns
 */
async function mergeDict(list) {
  const merged = list.reduce(function (r, o) {
    Object.keys(o).forEach(function (k) {
      r[k] = o[k];
    });
    return r;
  }, {});
  return merged;
}

async function onHomepage() {
  let check = false;
  if (document.location.pathname === '/') {
    check = true;
  }
  return check;
}

(async () => {
  'use strict';
  /* globals jQuery, $, waitForKeyElements */
  /* jshint -W069 */
  /* jshint -W083 */
  /* jshint -W075 */

  class Csfd {
    constructor(csfdPage) {
      this.csfdPage = csfdPage;
      this.stars = {};
      this.storageKey = undefined;
      this.userUrl = undefined;
      this.endPageNum = 0;
      this.userRatingsCount = 0;
      this.userRatingsUrl = undefined;
      this.localStorageRatingsCount = 0;
      this.settings = undefined;

      this.RESULT = {};

      // Ignore the ads... Make 'hodnoceni' table wider.
      // TODO: Toto do hodnoceni!
      $('.column.column-80').attr('class', '.column column-90');
    }

    async isLoggedIn() {
      const $profile = $('.profile.initialized');
      return $profile.length > 0;
    }

    /**
     * @async
     * @returns {Promise<string>} - User URL (e.g. /uzivatel/123456-adam-strong/)
     */
    async getCurrentUser() {
      let loggedInUser = $('.profile.initialized').attr('href');

      if (loggedInUser !== undefined) {
        if (loggedInUser.length == 1) {
          loggedInUser = loggedInUser[0];
        }
      }

      if (typeof loggedInUser === 'undefined') {
        console.log('Trying again...');

        // [OLD Firefox] workaround (the first returns undefined....?)
        let profile = document.querySelectorAll('.profile');
        if (profile.length == 0) {
          return undefined;
        }
        loggedInUser = profile[0].getAttribute('href');

        if (typeof loggedInUser === 'undefined') {
          console.error(`${SCRIPTNAME}: Can't find logged in username...`);
          throw `${SCRIPTNAME}: exit`; // TODO: Popup informing user
        }
      }
      return loggedInUser;
    }

    /**
     * @async
     * @returns {Promise<string>} - Username (e.g. adam-strong)
     */
    async getUsername() {
      const userHref = await this.getCurrentUser();
      if (userHref === undefined) {
        return undefined;
      }
      // get 'songokussj'   from '/uzivatel/78145-songokussj/'    with regex
      // get 'sans-sourire' from '/uzivatel/714142-sans-sourire/' with regex
      const foundMatch = userHref.match(new RegExp(/\/(\d+-(.*)+)\//));
      if (foundMatch.length == 3) {
        return foundMatch[2];
      }
      return undefined;
    }

    getStars() {
      // TODO: remove this function and use getLocalStorageRatings() instead
      if (!localStorage[this.storageKey] || localStorage[this.storageKey] === 'undefined') {
        return {};
      }
      return JSON.parse(localStorage[this.storageKey]);
    }

    async getLocalStorageRatings() {
      if (!localStorage[this.storageKey] || localStorage[this.storageKey] === 'undefined') {
        return {};
      }
      return JSON.parse(localStorage[this.storageKey]);
    }

    /**
     * Get ratings from LocalStorage and return the count of:
     * - normally rated (user clicked on rating)
     * - and computed ratings (not shown in user ratings)
     *
     * @returns {Promise<Object<string, number>>} `{ computed: int, rated: int }`
     */
    async getLocalStorageRatingsCount() {
      const ratings = await this.getLocalStorageRatings();
      const computedCount = Object.values(ratings).filter((rating) => rating.computed).length;
      const ratedCount = Object.keys(ratings).length - computedCount;
      return {
        computed: computedCount,
        rated: ratedCount,
      };
    }

    /**
     *
     * @returns {str} Current movie: `<MovieId>-<MovieUrlTitle>`
     *
     * Example:
     * - https://www.csfd.sk/film/739784-star-trek-lower-decks/prehlad/ --> `739784-star-trek-lower-decks`
     * - https://www.csfd.cz/film/1032817-naomi/1032819-don-t-believe-everything-you-think/recenze/ --> `1032819-don-t-believe-everything-you-think`
     */
    getCurrentFilmUrl() {
      const foundMatch = $('meta[property="og:url"]')
        .attr('content')
        .match(/\d+-[\w-]+/gi);

      // TODO: getCurrentFilmUrl by melo vrátit film URL ne jen cast... ne?
      if (!foundMatch) {
        console.error("TODO: getCurrentFilmUrl() Film URL wasn't found...");
        throw `${SCRIPTNAME} Exiting...`;
      }
      return foundMatch[foundMatch.length - 1];
    }

    /**
     *
     * @returns {str} Current movie: https://www.csfd.sk/film/739784-star-trek-lower-decks/recenze/
     *
     */
    getCurrentFilmFullUrl() {
      const foundMatch = $('meta[property="og:url"]').attr('content');

      // TODO: getCurrentFilmFullUrl by melo vrátit film URL ne jen cast... ne?
      if (!foundMatch) {
        console.error("TODO: getCurrentFilmFullUrl() Film URL wasn't found...");
        return '';
      }
      return foundMatch;
    }

    /**
     * Return current movie Type (film, serial, episode)
     *
     * @returns {str} Current movie type: film, serial, episode, movie, ...
     */
    getCurrentFilmType() {
      const foundTypes = $('.film-header span.type');
      let foundMatch = '';

      // No "type" found
      if (foundTypes.length === 0) {
        return 'movie';

        // One span.type found ... (film), (serial), ...
      } else if (foundTypes.length === 1) {
        foundMatch = $(foundTypes).text();

        // Multiple span.type found, get the one containing "(" and ")"
      } else if (foundTypes.length > 1) {
        foundTypes.each(function (index, element) {
          if ($(element).text().includes('(')) {
            foundMatch = $(element).text().toLowerCase();
          }
        });
      }
      // Strip foundMatch from "(" and ")"
      foundMatch = foundMatch.replace(/[\(\)]/g, '');

      // Convert to english (film, serial, movie, series, ...)
      foundMatch = this.getShowTypeFromType(foundMatch);

      return foundMatch;
    }

    /**
     * from property `og:title` extract the movie year `'Movie Title (2019)' --> 2019`
     *
     * @returns {str} Current movie year
     */
    getCurrentFilmYear() {
      const match = $('meta[property="og:title"]')
        .attr('content')
        .match(/\((\d+)\)/);
      if (match.length === 2) {
        const year = match[1];
        return year;
      }
      return '';
    }

    /**
     *
     * @param {html} content
     * @returns {bool} `true` if current movie rating is computed, `false` otherwise
     */
    async isCurrentFilmComputed(content = null) {
      const $computedStars = content === null ? $('.star.active.computed') : $(content).find('.star.active.computed');

      if ($computedStars.length > 0) {
        return true;
      }

      const secondTry = await this.isCurrentFilmRatingComputed();
      if (secondTry) {
        return true;
      }

      return false;
    }

    async isCurrentFilmRatingComputed() {
      const $computedStars = this.csfdPage.find('.current-user-rating .star-rating.computed');

      if ($computedStars.length !== 0) {
        return true;
      }

      return false;
    }

    getCurrentFilmComputedCount(content = null) {
      const $curUserRating = content === null ? this.csfdPage.find('li.current-user-rating') : content.find('li.current-user-rating');
      const countedText = $($curUserRating).find('span[title]').attr('title');
      // split by :
      const counted = countedText?.split(':')[1]?.trim();
      return counted;
    }

    async getCurrentFilmComputed() {
      const result = await this.getComputedRatings(this.csfdPage);
      return result;
    }

    async updateInLocalStorage(ratingsObject) {
      // Check if film is in LocalStorage
      const filmUrl = this.getCurrentFilmUrl();
      const filmId = await this.getMovieIdFromHref(filmUrl);
      const myRating = this.stars[filmId] || undefined;

      // Item not in LocalStorage, add it then!
      if (myRating === undefined) {
        // Item not in LocalStorage, add
        this.stars[filmId] = ratingsObject;
        localStorage.setItem(this.storageKey, JSON.stringify(this.stars));
        return true;
      }

      if (myRating.rating !== ratingsObject.rating || myRating.computedCount !== ratingsObject.computedCount) {
        console.log(`⚙️ ~ Csfd ~ updateInLocalStorage ~ Updating item...`);
        this.stars[filmId] = ratingsObject;
        localStorage.setItem(this.storageKey, JSON.stringify(this.stars));
        return true;
      }

      // Item in LocalStorage, everything is fine
      // console.log(`✅ ~ Csfd ~ updateInLocalStorage ~ Item in LocalStorage, everything is fine`);
      return false;
    }

    async removeFromLocalStorage() {
      // Check if film is in LocalStorage
      const filmUrl = this.getCurrentFilmUrl();
      const filmId = await this.getMovieIdFromHref(filmUrl);
      const item = this.stars[filmId];

      // Item not in LocalStorage, everything is fine
      if (item === undefined) {
        return false;
      }

      // Item in LocalStorage, delete it from local dc
      delete this.stars[filmId];

      // And resave it to LocalStorage
      localStorage.setItem(this.storageKey, JSON.stringify(this.stars));

      return true;
    }

    /**
     * Get movie rating from current or given page
     * @param {html} content
     * @returns {Promise<{rating: string, computedFrom: string, computed: boolean}>}
     */
    async getCurrentFilmRating(content = null) {
      const currentRatingIsComputed = await this.isCurrentFilmComputed(content);

      if (currentRatingIsComputed) {
        const { ratingCount, computedFromText } =
          content === null ? await this.getCurrentFilmComputed() : await this.getComputedRatings(content);

        return {
          rating: ratingCount,
          computedFrom: computedFromText,
          computed: true,
        };
      }

      const $activeStars = this.csfdPage.find('.star.active');

      // No rating
      if ($activeStars.length === 0) {
        return {
          rating: '',
          computedFrom: '',
          computed: false,
        };
      }

      // Rating "odpad" or "1"
      if ($activeStars.length === 1) {
        if ($activeStars.attr('data-rating') === '0') {
          return {
            rating: '0',
            computedFrom: '',
            computed: false,
          };
        }
      }

      // Rating "1" to "5"
      return {
        rating: $activeStars.length,
        computedFrom: '',
        computed: false,
      };
    }

    async getCurrentUserRatingsCount() {
      return $.get(this.userRatingsUrl).then(function (data) {
        const count = $(data)
          .find('.box-user-rating span.count')
          .text()
          .replace(/[\s()]/g, '');
        if (count) {
          return parseInt(count);
        }
        return 0;
      });
    }

    async fillMissingSettingsKeys() {
      let settings = await getSettings();

      let currentKeys = Object.keys(settings);
      let defaultKeys = Object.keys(defaultSettings);
      for (const defaultKey of defaultKeys) {
        let exists = currentKeys.includes(defaultKey);
        if (!exists) {
          settings[defaultKey] = defaultSettings[defaultKey];
        }
      }
      localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
    }

    async checkForOldLocalstorageRatingKeys() {
      const ratings = this.getStars();
      const keys = Object.keys(ratings);
      for (const key of keys) {
        if (key.includes('/')) {
          alert(`
            CSFD-Compare

            Byl nalezen starý způsob ukládání hodnocení do LocalStorage!
            Prosím, smažte staré hodnocení a znovu je nahrajte.

            CC -> Smazat Uložená hodnocení`);
          return null;
        }
      }
    }

    /**
     * $content should be URL with computed star ratings. Not manualy rated. \
     * Then, it will return dict with `computed stars` and text `"computed from episodes: X"`
     *
     * @param {str} $content HTML content of a page
     * @returns {Promise<{'ratingCount': int, 'computedFromText': str}>}
     *
     * Example: \
     * `{ ratingCount: 4, computedFromText: 'spocteno z episod': 2 }`
     */
    async getComputedRatings($content) {
      // Get current user rating
      const $curUserRating = $($content).find('li.current-user-rating');
      const $starsSpan = $($curUserRating).find('span.stars');
      const starCount = await csfd.getStarCountFromSpanClass($starsSpan);

      // Get 'Spocteno z episod' text
      const $countedText = $($curUserRating).find('span[title]').attr('title');

      // // Get this movieId and possible parentId
      // const filmUrl = await csfd.getFilmUrlFromHtml($content);
      // let [movieId, parentId] = await csfd.getMovieIdParentIdFromUrl(filmUrl);

      // Resulting dictionary
      const result = {
        ratingCount: starCount,
        computedFromText: $countedText,
        // 'movieId': movieId,
        // 'parentId': parentId
      };
      return result;
    }

    async loadInitialSettings() {
      // GLOBAL
      $('#chkControlPanelOnHover').attr('checked', settings.showControlPanelOnHover);
      $('#chkClickableHeaderBoxes').attr('checked', settings.clickableHeaderBoxes);
      $('#chkClickableMessages').attr('checked', settings.clickableMessages);
      $('#chkAddStars').attr('checked', settings.addStars);

      // USER
      $('#chkDisplayMessageButton').attr('checked', settings.displayMessageButton);
      $('#chkDisplayFavoriteButton').attr('checked', settings.displayFavoriteButton);
      $('#chkHideUserControlPanel').attr('checked', settings.hideUserControlPanel);
      $('#chkCompareUserRatings').attr('checked', settings.compareUserRatings);

      // FILM/SERIES
      $('#chkAddRatingsDate').attr('checked', settings.addRatingsDate);
      $('#chkShowLinkToImage').attr('checked', settings.showLinkToImage);
      $('#chkRatingsEstimate').attr('checked', settings.ratingsEstimate);
      $('#chkRatingsFromFavorites').attr('checked', settings.ratingsFromFavorites);
      $('#chkAddRatingsComputedCount').attr('checked', settings.addRatingsComputedCount);
      $('#chkHideSelectedUserReviews').attr('checked', settings.hideSelectedUserReviews);
      settings.hideSelectedUserReviews || $('#txtHideSelectedUserReviews').parent().hide();
      // if (settings.hideSelectedUserReviews === false) { $('#txtHideSelectedUserReviews').parent().hide(); }
      if (settings.hideSelectedUserReviewsList !== undefined) {
        $('#txtHideSelectedUserReviews').val(settings.hideSelectedUserReviewsList.join(', '));
      }

      // ACTORS
      $('#chkShowOnOneLine').attr('checked', settings.showOnOneLine);

      // EXPERIMENTAL
      $('#chkLoadComputedRatings').attr('checked', settings.loadComputedRatings);
      $('#chkAddChatReplyButton').attr('checked', settings.addChatReplyButton);
    }

    async addSettingsEvents() {
      // HOME PAGE

      // GLOBAL
      $('#chkControlPanelOnHover').on('change', function () {
        settings.showControlPanelOnHover = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });

      $('#chkClickableHeaderBoxes').on('change', function () {
        settings.clickableHeaderBoxes = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });

      $('#chkClickableMessages').on('change', function () {
        settings.clickableMessages = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });

      $('#chkAddStars').on('change', function () {
        settings.addStars = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });

      // USER
      $('#chkDisplayMessageButton').on('change', function () {
        settings.displayMessageButton = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });

      $('#chkDisplayFavoriteButton').on('change', function () {
        settings.displayFavoriteButton = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });

      $('#chkHideUserControlPanel').on('change', function () {
        settings.hideUserControlPanel = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });

      $('#chkCompareUserRatings').on('change', function () {
        settings.compareUserRatings = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });

      // FILM/SERIES
      $('#chkShowLinkToImage').on('change', function () {
        settings.showLinkToImage = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });

      $('#chkRatingsEstimate').on('change', function () {
        settings.ratingsEstimate = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });

      $('#chkRatingsFromFavorites').on('change', function () {
        settings.ratingsFromFavorites = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });

      $('#chkAddRatingsDate').on('change', function () {
        settings.addRatingsDate = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });

      $('#chkAddRatingsComputedCount').on('change', function () {
        settings.addRatingsComputedCount = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });

      $('#chkHideSelectedUserReviews').on('change', function () {
        settings.hideSelectedUserReviews = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
        $('#txtHideSelectedUserReviews').parent().toggle();
      });

      $('#txtHideSelectedUserReviews').on('change', function () {
        let ignoredUsers = this.value.replace(/\s/g, '').split(',');
        settings.hideSelectedUserReviewsList = ignoredUsers;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup(`Ignorovaní uživatelé:\n${ignoredUsers.join(', ')}`, 4);
      });

      // ACTORS
      $('#chkShowOnOneLine').on('change', function () {
        settings.showOnOneLine = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });

      // EXPERIMENTAL
      $('#chkLoadComputedRatings').on('change', function () {
        settings.loadComputedRatings = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });
      $('#chkAddChatReplyButton').on('change', function () {
        settings.addChatReplyButton = this.checked;
        localStorage.setItem(SETTINGSNAME, JSON.stringify(settings));
        Glob.popup('Nastavení uloženo (obnovte stránku)', 2);
      });
    }

    async onPageOtherUserHodnoceni() {
      if ((location.href.includes('/hodnoceni') || location.href.includes('/hodnotenia')) && location.href.includes('/uzivatel/')) {
        if (!location.href.includes(this.userUrl)) {
          return true;
        }
      }
      return false;
    }

    async onPageOtherUser() {
      if (location.href.includes('/uzivatel/')) {
        if (!location.href.includes(this.userUrl)) {
          return true;
        }
      }
      return false;
    }

    async onPageDiskuze() {
      if (location.href.includes('/diskuze/') || location.href.includes('/diskusie')) {
        return true;
      }
      return false;
    }

    async onPersonalFavorite() {
      if (location.href.includes('/soukromne/oblubene/') || location.href.includes('/soukrome/oblibene/')) {
        if (!location.href.includes(this.userUrl)) {
          return true;
        }
      }
      return false;
    }

    async notOnUserPage() {
      if (location.href.includes('/uzivatel/') && location.href.includes(this.userUrl)) {
        return false;
      }
      return true;
    }

    exportRatings() {
      localStorage.setItem(this.storageKey, JSON.stringify(this.stars));
    }

    async addStars() {
      if (location.href.includes('/zebricky/') || location.href.includes('/rebricky/')) {
        return;
      }
      let starsCss = { marginLeft: '5px' };
      // On UserPage or PersonalFavorite page, modify the CSS by adding solid red border outline
      if ((await this.onPageOtherUser()) || (await this.onPersonalFavorite())) {
        starsCss = {
          marginLeft: '5px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#c78888',
          borderRadius: '5px',
          padding: '0px 5px',
        };
      }

      let $links = $('a.film-title-name');
      for (const $link of $links) {
        const href = $($link).attr('href');
        const movieId = await this.getMovieIdFromHref(href);

        const res = this.stars[movieId];
        if (res === undefined) {
          continue;
        }
        const $sibl = $($link).closest('td').siblings('.rating,.star-rating-only');
        if ($sibl.length !== 0) {
          continue;
        }
        const starClass = res.rating !== 0 ? `stars-${res.rating}` : `trash`;
        const starText = res.rating !== 0 ? '' : 'odpad!';
        const className = res.computed ? 'star-rating computed' : 'star-rating';
        const title = res.computed ? res.computedFromText : res.date;

        // Construct the HTML
        const $starSpan = $('<span>', {
          class: className,
          html: `<span class="stars ${starClass}" title="${title}">${starText}</span>`,
        }).css(starsCss);

        // Add the HTML
        $($link).after($starSpan);

        // If the rating is computed, add SUP element indicating from how many ratings it was computed
        if (res.computed) {
          const $numSpan = $('<span>', {
            html: `<sup> (${res.computedCount})</sup>`,
          }).css({
            'font-size': '13px',
            color: '#7b7b7b',
          });
          $starSpan.find('span').after($numSpan);
        }
      }
    }

    /**
     * Adds a column to another user's ratings page with the user's rating
     *
     * @returns {None}
     */
    addRatingsColumn() {
      const starsDict = this.getStars();
      const lcRatingsCount = Object.keys(starsDict).length;

      // No ratings in LocalStorage, do nothing
      if (lcRatingsCount === 0) {
        return;
      }

      const $page = this.csfdPage;
      const $tbl = $page.find('#snippet--ratings table tbody');

      $tbl.find('tr').each(async function () {
        const $row = $(this);
        const href = $row.find('a.film-title-name').attr('href');
        const movieId = await csfd.getMovieIdFromHref(href);
        const myRating = starsDict[movieId];

        let $span = '';
        if (myRating?.rating === 0) {
          $span = `<span class="stars trash">odpad!</span>`;
        } else {
          if (myRating?.computed) {
            $span = `<span class="stars stars-${myRating?.rating}" title="${myRating?.computedFromText}"></span>`;
          } else {
            $span = `<span class="stars stars-${myRating?.rating}" title="${myRating?.date}"></span>`;
          }
        }

        // Color the rating to red (star-rating) or black (star-rating computed) if computed
        const className = myRating?.computed ? 'star-rating computed' : 'star-rating';

        // Build the HTML for computed rating SUP element: e.g. (3)
        const $computedSup = `
          <span style="position: relative;">
            <sup style="position: absolute; top: -1px; left: -2px; color: var(--color-grey-light2)">
              (${myRating?.computedCount})
            </sup>
          </span>
        `;

        const $currentUserSpan = `
          <span class="${className}">
            ${$span}
            ${myRating?.computed ? $computedSup : ''}
          </span>
        `;

        const $currentUserTd = $row.find('td:nth-child(2)');
        $currentUserTd.after(`
                    <td class="star-rating-only">
                        ${$currentUserSpan}
                    </td>
        `);
      });
    }

    async openControlPanelOnHover() {
      const btn = $('.button-control-panel');
      const panel = $('#dropdown-control-panel');

      // Remove any previously bound events on these elements
      btn.off();
      panel.off();

      // Ensure the panel starts hidden (remove 'active' class)
      panel.removeClass('active');

      let showTimer = null;
      let isBtnHovering = false;
      let isPanelHovering = false;
      let panelTriggered = false; // becomes true only after delay

      let openPanelTimeout;

      btn.on('mouseenter', function () {
        isBtnHovering = true;

        openPanelTimeout = setTimeout(() => {
          console.log('openPanelTimeout triggered');
          if (isBtnHovering && !panel.hasClass('active')) {
            panelTriggered = true;
            panel.addClass('active');

            const windowWidth = $(window).width();
            if (windowWidth <= 635) {
              panel.appendTo(document.body);
              panel.css({ top: '133px', right: '15px' });
            }
          }
        }, 500);
      });

      btn.on('mouseleave', function () {
        isBtnHovering = false;
        clearTimeout(showTimer);
        setTimeout(() => {
          if (!isBtnHovering && !isPanelHovering) {
            panelTriggered = false;
            panel.removeClass('active');
          }
        }, 200); // short delay for smooth hide
      });

      panel.on('mouseenter', function () {
        isPanelHovering = true;
        clearTimeout(showTimer);
        // Only allow panel to stay active if it was triggered already
        if (panelTriggered && !panel.hasClass('active')) {
          panel.addClass('active');
        }
      });

      panel.on('mouseleave', function () {
        isPanelHovering = false;
        setTimeout(() => {
          if (!isBtnHovering && !isPanelHovering) {
            panelTriggered = false;
            panel.removeClass('active');
          }
        }, 200);
      });
    }

    async addWarningToUserProfile() {
      const ratingCountOk = this.isRatingCountOk();
      if (ratingCountOk) return;

      $('.csfd-compare-menu').append(`
                <div class='counter'>
                    <span><b>!</b></span>
                </div>
            `);
    }

    async refreshButtonNew(ratingsInLS, curUserRatings) {
      const ratingCountOk = await this.isRatingCountOk();
      if (ratingCountOk) return;

      const $button = $('<button>', {
        id: 'refr-ratings-button',
        class: 'csfd-compare-reload',
        html: `<center>
                 <b> >> Načíst hodnocení (new) << </b> <br />
               </center>`,
      }).css({
        textTransform: 'initial',
        fontSize: '0.9em',
        padding: '5px',
        border: '4px solid whitesmoke',
        borderRadius: '8px',
        width: '-moz-available',
        width: '-webkit-fill-available',
        width: '100%',
        height: 'auto',
      });
      const $div = $('<div>', {
        html: $button,
      });
      $('.csfd-compare-settings').after($div);

      let forceUpdate = ratingsInLS > curUserRatings ? true : false;

      $($button).on('click', async function () {
        console.debug('refreshing ratings');
        const csfd = new Csfd($('div.page-content'));
        if (forceUpdate === true) {
          if (
            !confirm(
              `Pro jistotu bych obnovil VŠECHNA hodnocení... Důvod: počet tvých je [${ratingsInLS}], ale v databázi je uloženo více: [${curUserRatings}]. Souhlasíš?`
            )
          ) {
            forceUpdate = false;
          }
        }
        csfd.refreshAllRatingsNew(csfd, forceUpdate);
      });
    }

    async badgesComponent(ratingsInLS, curUserRatings, computedRatings) {
      // TODO" Tohle už teď bude fungovat, jen to zakomponovat...
      return '<b>ahoj</b>';
    }

    displayMessageButton() {
      let userHref = $('#dropdown-control-panel li a.ajax').attr('href');
      if (userHref === undefined) {
        console.log("fn displayMessageButton(): can't find user href, exiting function...");
        return;
      }

      let button = document.createElement('button');
      button.setAttribute('data-tippy-content', $('#dropdown-control-panel li a.ajax')[0].text);
      button.setAttribute('style', 'float: right; border-radius: 5px;');
      button.innerHTML = `
                <a class="ajax"
                    rel="contentModal"
                    data-mfp-src="#panelModal"
                    href="${userHref}"><i class="icon icon-messages"></i></a>
            `;
      $('.user-profile-content > h1').append(button);
    }

    async displayFavoriteButton() {
      let favoriteButton = $('#snippet--menuFavorite > a');
      if (favoriteButton.length !== 1) {
        console.log("fn displayFavoriteButton(): can't find user href, exiting function...");
        return;
      }
      let tooltipText = favoriteButton[0].text;
      let addRemoveIndicator = '+';
      if (tooltipText.includes('Odebrat') || tooltipText.includes('Odobrať')) {
        addRemoveIndicator = '-';
      }

      let button = document.createElement('button');
      button.setAttribute('style', 'float: right; border-radius: 5px; margin: 0px 5px;');
      button.setAttribute('data-tippy-content', tooltipText);
      button.innerHTML = `
                <a class="ajax"
                    rel="contentModal"
                    data-mfp-src="#panelModal"
                    href="${favoriteButton.attr('href')}">
                        <span id="add-remove-indicator" style="font-size: 1.5em; color: white;">${addRemoveIndicator}</span>
                        <i class="icon icon-favorites"></i>
                </a>
            `;
      $('.user-profile-content > h1').append(button);

      $(button).on('click', async function () {
        if (addRemoveIndicator == '+') {
          $('#add-remove-indicator')[0].innerText = '-';
          button._tippy.setContent('Odebrat z oblíbených');
        } else {
          $('#add-remove-indicator')[0].innerText = '+';
          button._tippy.setContent('Přidat do oblíbených');
        }
        await refreshTooltips();
      });
    }

    hideUserControlPanel() {
      let panel = $('.button-control-panel:not(.small)');
      if (panel.length !== 1) {
        return;
      }
      panel.hide();
    }

    async showLinkToImageOnSmallMoviePoster() {
      let $film = this.csfdPage.find('.film-posters');
      let $img = $film.find('img');
      let src = $img.attr('src');
      let width = $img.attr('width');

      let $div = $(`<div>`, { class: 'link-to-image' })
        .css({
          position: 'absolute',
          right: '0px',
          bottom: '0px',
          display: 'none',
          'z-index': '999',
          'padding-left': '0.5em',
          'padding-right': '0.5em',
          'margin-bottom': '0.5em',
          'margin-right': '0.5em',
          'background-color': 'rgba(255, 245, 245, 0.85)',
          'border-radius': '5px 0px',
          'font-weight': 'bold',
        })
        .html(`<a href="${src}">w${width}</a>`);

      $film.find('a').after($div);

      $film.on('mouseover', () => {
        $div.show('fast');
      });
      $film.on('mouseleave', () => {
        $div.hide('fast');
      });
    }

    /**
     * Show link for all possible picture sizes
     */
    async showLinkToImageOnOtherGalleryImages() {
      let $pictures = this.csfdPage.find('.gallery-item picture');

      let pictureIdx = 0;
      for (const $picture of $pictures) {
        let obj = {};

        let src = $($picture)
          .find('img')
          .attr('src')
          .replace(/cache[/]resized[/]w\d+[/]/g, '');

        obj['100 %'] = src;

        let $sources = $($picture).find('source');

        for (const $source of $sources) {
          const srcset = $($source).attr('srcset');

          if (srcset === undefined) {
            continue;
          }

          let attributeText = srcset.replace(/\dx/g, '').replace(/\s/g, '');
          let links = attributeText.split(',');

          for (const link of links) {
            const match = link.match(/[/]w(\d+)/);
            if (match !== null) {
              if (match.length === 2) {
                const width = match[1];
                obj[width] = link;
              }
            }
          }
        }

        let idx = 0;
        for (const item in obj) {
          let $div = $(`<div>`, { class: `link-to-image-gallery picture-idx-${pictureIdx}` })
            .css({
              position: 'absolute',
              right: '0px',
              bottom: '0px',
              display: 'none',
              'z-index': '999',
              'padding-left': '0.5em',
              'padding-right': '0.5em',
              'margin-bottom': `${0.5 + idx * 2}em`,
              'margin-right': '0.5em',
              'background-color': 'rgba(255, 245, 245, 0.75)',
              'border-radius': '5px 0px',
              'font-weight': 'bold',
            })
            .html(`<a href="${obj[item]}">${item}</a>`);

          $($picture).find('img').after($div);
          $($picture).attr('data-idx', pictureIdx);
          $($picture).parent().css({ position: 'relative' }); // need to have this for absolute position to work

          idx += 1;
        }

        pictureIdx += 1;

        $($picture).on('mouseover', () => {
          const pictureIdx = $($picture).attr('data-idx');
          $(`.link-to-image-gallery.picture-idx-${pictureIdx}`).show('fast');
        });
        $($picture).on('mouseleave', () => {
          const pictureIdx = $($picture).attr('data-idx');
          $(`.link-to-image-gallery.picture-idx-${pictureIdx}`).hide('fast');
        });
      }
    }

    /**
     * If film has been rated by user favorite people, make an average and display it
     * under the normal rating as: oblíbení: X %
     *
     * @returns null
     */
    async ratingsFromFavorites() {
      let $ratingSpans = this.csfdPage.find('li.favored:not(.current-user-rating) .star-rating .stars');

      // No favorite people ratings found
      if ($ratingSpans.length === 0) {
        return;
      }

      let ratingNumbers = [];
      for (let $span of $ratingSpans) {
        let num = this.getNumberFromRatingSpan($($span));
        num = num * 20;
        ratingNumbers.push(num);
      }
      let average = (array) => array.reduce((a, b) => a + b) / array.length;
      const ratingAverage = Math.round(average(ratingNumbers));

      let $ratingAverage = this.csfdPage.find('.box-rating-container div.film-rating-average');
      $ratingAverage.html(`
                <span style="position: absolute;">${$ratingAverage.text()}</span>
                <span style="position: relative; top: 25px; font-size: 0.3em; font-weight: 600;">oblíbení: ${ratingAverage} %</span>
            `);
    }
    /**
     * When there is less than 10 ratings on a movie, csfd waits with the rating.
     * This computes the rating from those less than 10 and shows it.
     *
     * @returns null
     */
    async ratingsEstimate() {
      // Find rating-average element
      let $ratingAverage = this.csfdPage.find('.box-rating-container .film-rating-average');

      // Not found, exit fn()
      if ($ratingAverage.length !== 1) {
        return;
      }

      // Get the text
      let curRating = $ratingAverage.text().replace(/\s/g, '');

      // If the text if anything than '?%', exit fn()
      if (!curRating.includes('?%')) {
        return;
      }

      // Get all other users ratings
      let $userRatings = this.csfdPage.find('section.others-rating .star-rating');

      // If no ratings in other ratings, exit fn()
      if ($userRatings.length === 0) {
        return;
      }

      // Fill the list with ratings as numbers
      let ratingNumbers = [];
      for (const $userRating of $userRatings) {
        let $ratingSpan = $($userRating).find('.stars');
        let num = this.getNumberFromRatingSpan($ratingSpan);
        // Transform number to percentage (0 -> 0 %, 1 -> 20 %, 2 -> 40 %...)
        num = num * 20;
        ratingNumbers.push(num);
      }

      // Compute the average
      let average = (array) => array.reduce((a, b) => a + b) / array.length;
      const ratingAverage = Math.round(average(ratingNumbers));

      // Rewrite the displayed rating
      const bgcolor = this.getRatingColor(ratingAverage);
      $ratingAverage
        .text(`${ratingAverage} %`)
        .css({ color: '#fff', backgroundColor: bgcolor })
        .attr('title', `spočteno z hodnocení: ${$userRatings.length}`);
    }
    /**
     * Depending on the percent number, return a color as a string representation
     * 0-29 black; 30-69 blue; 70-100 red
     *
     * @param {int} ratingPercent
     * @returns {string} representation of colour
     */
    getRatingColor(ratingPercent) {
      switch (true) {
        case ratingPercent < 29:
          return '#535353';
        case ratingPercent >= 30 && ratingPercent < 69:
          return '#658db4';
        case ratingPercent >= 70:
          return '#ba0305';
        default:
          return '#d2d2d2';
      }
    }
    /**
     * From jquery! $span csfd element class (.stars stars-4) return the ratings number (4)
     *
     * @param {jquery} $span
     * @returns int in range 0-5
     */
    getNumberFromRatingSpan($span) {
      // TODO: využít tuto funkci i při načítání hodnocení do LS
      let rating = 0;
      for (let stars = 0; stars <= 5; stars++) {
        if ($span.hasClass('stars-' + stars)) {
          rating = stars;
        }
      }
      return rating;
    }
    /**
     * Show clickable link to the absolute url of the image mouse is hovering above.
     *
     * Works with:
     * - Small Movie Poster
     * - Movie Gallery Images
     */
    async showLinkToImage() {
      this.showLinkToImageOnSmallMoviePoster();
      this.showLinkToImageOnOtherGalleryImages();
    }

    async doSomethingNew(url) {
      let data = await $.get(url);
      const $rows = $(data).find('#snippet--ratings tr');

      let dc = {};
      const parentIds = [];
      const seriesIds = [];

      // Process each row of the rating page
      // $row = <>ItemName | ItemUrl | (year) | (type) | (Detail) | Rating | Date</>
      for (const $row of $rows) {
        const name = $($row).find('td.name a').attr('href'); // /film/697624-love-death-robots/800484-zakazane-ovoce/
        const filmInfo = $($row).find('td.name > h3 > span > span'); // (2007)(série)(S02) // (2021)(epizoda)(S02E05)

        const [showType, showYear, parentName, [movieId, parentId]] = await Promise.all([
          csfd.getShowType(filmInfo),
          csfd.getShowYear(filmInfo),
          csfd.getParentNameFromUrl(name),
          csfd.getMovieIdParentIdFromUrl(name),
        ]);

        // If the show is a SEASON, it's parent is a SERIES and ID is in the URL
        if (showType === 'season') {
          // If parentId is not in parentIds, add it to the list
          if (!parentIds.includes(parentName)) {
            // console.debug(`[ DEBUG ] Adding parentName to [PARENT Ids]: ${parentName}`);
            parentIds.push(parentName);
          }
        }
        // If the show is a EPISODE, it's parent is a SEASON but the ID is not in the URL
        // We need to get the ID from the parentName (SERIES) content and then grab the SEASON IDs there
        else if (showType === 'episode') {
          // If parentId is not in parentIds, add it to the list
          if (!seriesIds.includes(parentName)) {
            // console.debug(`[ DEBUG ] Adding parentName to [SERIES Ids]: ${parentName}`);
            parentIds.push(parentName);
            seriesIds.push(parentName);
          }
        }

        // Get the RATING from the stars and the DATE
        const $ratings = $($row).find('span.stars');
        const rating = await csfd.getStarCountFromSpanClass($ratings);
        const date = $($row).find('td.date-only').text().replace(/[\s]/g, '');

        dc[movieId] = {
          url: name,
          fullUrl: location.origin + name,
          rating: rating,
          date: date,
          type: showType,
          year: showYear,
          parentName: parentName,
          parentId: parentId,
          computed: false,
          computedCount: '',
          computedFromText: '',
          lastUpdate: this.getCurrentDateTime(),
        };
      }
      return dc;
    }

    async getAllPagesNew(force = false) {
      const url = location.origin.endsWith('sk') ? `${this.userUrl}hodnotenia` : `${this.userUrl}hodnoceni`;
      const $content = await $.get(url);
      const $href = $($content).find(`.pagination a:not(.page-next):not(.page-prev):last`);
      const maxPageNum = $href.text();
      this.userRatingsCount = await this.getCurrentUserRatingsCount();

      const allUrls = [];
      // for (let idx = 1; idx <= 1; idx++) {  // TODO: DEBUG
      for (let idx = 1; idx <= maxPageNum; idx++) {
        const url = location.origin.endsWith('sk') ? `${this.userUrl}hodnotenia/?page=${idx}` : `${this.userUrl}hodnoceni/?page=${idx}`;
        allUrls.push(url);
      }

      const savedRatingsCount = Object.keys(this.stars).length;

      // If we don't have any ratings saved, load them all in chunks
      if (savedRatingsCount !== 0) {
        console.log(`Načíst jen chybějící hodnocení...`);

        let dict = this.stars;
        let ls = force ? [] : [dict];
        for (let idx = 1; idx <= maxPageNum; idx++) {
          console.log(`[ DEBUG ] iterating over idx <= ${maxPageNum}`);
          const onlyRated = Object.values(dict).filter((item) => item.computed === false);
          if (!force) if (onlyRated.length >= this.userRatingsCount) break;

          console.log(`Načítám hodnocení ${idx}/${maxPageNum} stránek`);
          Glob.popup(`Načítám hodnocení ${idx}/${maxPageNum} stránek`, 1, 200, 0);

          const url = location.origin.endsWith('sk') ? `${this.userUrl}hodnotenia/?page=${idx}` : `${this.userUrl}hodnoceni/?page=${idx}`;
          const res = await this.doSomethingNew(url);
          ls.push(res);
          if (!force) dict = await mergeDict(ls);
        }
        if (force) dict = await mergeDict(ls);
        return dict;
      }

      const chunkSize = 5;

      // Divide the urls into chunks of X (to not overload the browser)
      const chunks = [];
      while (allUrls.length) {
        chunks.push(allUrls.splice(0, chunkSize));
      }

      Glob.popup(`Načítám hodnocení...`, 2, 200, 0);

      // TODO: Debug
      // const limitedChunks = chunks.slice(0, 1);

      // Load the chunks in parallel
      let contents = [];
      let chunkDone = 0;
      for (const chunk of chunks) {
        Glob.popup(`Načítám hodnocení... ${chunkDone + chunk.length * NUM_RATINGS_PER_PAGE}/${this.userRatingsCount}`, 5, 200, 0);
        const content = await Promise.all(chunk.map((url) => $.get(url)));
        contents.push(content);
        chunkDone += chunk.length * NUM_RATINGS_PER_PAGE;
      }

      // Process the content of each rating page
      let dc = {};
      const parentIds = [];
      const seriesIds = [];

      for (const content of contents) {
        for (const data of content) {
          const $rows = $(data).find('#snippet--ratings tr');

          // Process each row of the rating page
          // $row = <>ItemName | ItemUrl | (year) | (type) | (Detail) | Rating | Date</>
          for (const $row of $rows) {
            const name = $($row).find('td.name a').attr('href'); // /film/697624-love-death-robots/800484-zakazane-ovoce/
            const filmInfo = $($row).find('td.name > h3 > span > span'); // (2007)(série)(S02) // (2021)(epizoda)(S02E05)

            const [showType, showYear, parentName, [movieId, parentId]] = await Promise.all([
              csfd.getShowType(filmInfo),
              csfd.getShowYear(filmInfo),
              csfd.getParentNameFromUrl(name),
              csfd.getMovieIdParentIdFromUrl(name),
            ]);

            // If the show is a SEASON, it's parent is a SERIES and ID is in the URL
            if (showType === 'season') {
              // If parentId is not in parentIds, add it to the list
              if (!parentIds.includes(parentName)) {
                // console.debug(`[ DEBUG ] Adding parentName to [PARENT Ids]: ${parentName}`);
                parentIds.push(parentName);
              }
            }
            // If the show is a EPISODE, it's parent is a SEASON but the ID is not in the URL
            // We need to get the ID from the parentName (SERIES) content and then grab the SEASON IDs there
            else if (showType === 'episode') {
              // If parentId is not in parentIds, add it to the list
              if (!seriesIds.includes(parentName)) {
                // console.debug(`[ DEBUG ] Adding parentName to [SERIES Ids]: ${parentName}`);
                parentIds.push(parentName);
                seriesIds.push(parentName);
              }
            }

            // Get the RATING from the stars and the DATE
            const $ratings = $($row).find('span.stars');
            const rating = await csfd.getStarCountFromSpanClass($ratings);
            const date = $($row).find('td.date-only').text().replace(/[\s]/g, '');

            dc[movieId] = {
              url: name,
              fullUrl: location.origin + name,
              rating: rating,
              date: date,
              type: showType,
              year: showYear,
              parentName: parentName,
              parentId: parentId,
              computed: false,
              computedCount: '',
              computedFromText: '',
              lastUpdate: this.getCurrentDateTime(),
            };
          }
        }
      }

      if (settings.loadComputedRatings === false) {
        return dc;
      } else {
        // TODO: Load computed ratings
        return dc;
      }
    }

    /**
     * @param {<span>} filmInfo Combination of 0-3 `<span>` elements
     * @returns {int} `YYYY` (year) if it exists in filmInfo[0], `????` otherwise
     *
     * Example:
     * - (2007)(série)(S02) --> 2007
     * - (2021) --> 2021
     * - --> ????
     */
    async getShowYear(filmInfo) {
      const showYear = filmInfo.length >= 1 ? $(filmInfo[0]).text().slice(1, -1) : '????';
      return parseInt(showYear);
    }

    /**
     * Return show type in 'english' language. Works for SK an CZ.
     *
     * @param {<span>} filmInfo Combination of 0-3 `<span>` elements
     * @returns {str} `showType` if it exists in filmInfo[1], `movie` otherwise
     *
     * Posible values: `movie`, `tv movie`, `serial`, `series`, `episode`
     *
     * Example:
     * - (2007)(série)(S02) --> series
     * - (2021)(epizoda)(S02E01) --> episode
     * - (2019) --> movie
     */
    async getShowType(filmInfo) {
      const showType = filmInfo.length > 1 ? $(filmInfo[1]).text().slice(1, -1) : 'film';

      switch (showType) {
        case 'epizoda':
        case 'epizóda':
          return 'episode';

        case 'série':
        case 'séria':
          return 'season';

        case 'seriál':
          return 'series';

        case 'TV film':
          return 'tv movie';

        case 'film':
          return 'movie';

        default:
          return showType;
      }
    }

    /**
     * Return show type in 'english' language. Works for SK an CZ.
     *
     * @param {str} showType seriál, série, epizoda, film, ...
     * @returns {str} `showType`
     *
     * Posible returned values: `movie`, `tv movie`, `serial`, `series`, `episode`
     *
     * Example:
     * - série --> series
     * - epizoda --> episode
     * - film --> movie
     */
    getShowTypeFromType(showType) {
      showType = showType.toLowerCase();

      switch (showType) {
        case 'epizoda':
        case 'epizóda':
          return 'episode';

        case 'série':
        case 'séria':
          return 'season';

        case 'seriál':
          return 'series';

        case 'tv film':
          return 'tv movie';

        case 'film':
          return 'movie';

        default:
          return showType;
      }
    }

    /**
     * Get star count from span with stars class
     *
     * @param {"<span>"} $starsSpan $span with class of 'stars-X' or 'trash' type.
     * @returns {int} `0` if trash; `1-5` if stars-X
     *
     * Example: \
     *    `<span class="stars stars-4">` --> `4`\
     *    `<span class='stars trash'>` --> `0`
     */
    async getStarCountFromSpanClass($starsSpan) {
      let rating = 0;
      for (let stars = 0; stars <= 5; stars++) {
        if ($starsSpan.hasClass('stars-' + stars)) {
          rating = stars;
        }
      }
      return rating;
    }

    /**
     * Return **relative** parent name from episode name
     *
     * @param {string} name relative URL of episode name
     * @returns relative URL of parent name
     *
     * Example: \
     * `/film/697624-love-death-robots/800484-zakazane-ovoce/` --> `/film/697624-love-death-robots/`
     * `/film/697624-love-death-robots/` --> `""`
     */
    async getParentNameFromUrl(name) {
      const splitted = name.slice(0, -1).split('/');
      splitted.pop();
      const parentName = splitted.length > 2 ? splitted.join('/') + '/' : '';
      return parentName;
    }

    /**
     *
     * @param {str} href csfd link for movie/series/episode
     * @returns {Promise<str>} Movie ID number
     *
     * Example:
     * - href = '/film/774319-zhoubne-zlo/' --> '774319'
     * - href = '/film/1058697-devadesatky/1121972-epizoda-6/' --> '1121972'
     * - href = '1058697-devadesatky' --> '1058697'
     * - href = 'nothing-here' --> null
     */
    async getMovieIdFromHref(href) {
      if (!href) {
        return null;
      }
      const found_groups = href.match(/(\d)+-[-\w]+/gi);

      if (!found_groups) {
        return null;
      }
      const movieIds = found_groups.map((x) => x.split('-')[0]);

      return movieIds[movieIds.length - 1];
    }

    /**
     * Extract MovieId, possibly ParentId from csfd URL address
     *
     * @param {str} url csfd movie URL
     * @returns {{MovieId: str, ParentId: str}}
     *
     * Example: \
     * - `/film/697624-love-death-robots/800484-zakazane-ovoce/` --> `{'MovieId': '800484', 'ParentId': '697624'}`
     * - `/film/697624-love-death-robots` --> `{'MovieId': '697624', 'ParentId': ''}`
     * - `/film/` --> `{'MovieId': '', 'ParentId': ''}`
     * - `/uzivatel/78145-songokussj/prehled/` --> `{'MovieId': '', 'ParentId': ''}`
     */
    async getMovieIdParentIdFromUrl(url) {
      if (!url.includes('/film/')) {
        // return { 'movieId': '', 'parentId': '' };
        return ['', ''];
      }
      let [firstResult, secondResult] = url.matchAll(/\/(\d+)-/g);
      if (firstResult === undefined && secondResult === undefined) {
        // return { 'movieId': '', 'parentId': '' };
        return ['', ''];
      }
      if (secondResult === undefined) {
        // return { 'movieId': firstResult[1], 'parentId': '' };
        return [firstResult[1], ''];
      }
      return [secondResult[1], firstResult[1]];
    }

    async refreshAllRatingsNew(csfd, force = false) {
      // Start timer
      const start = performance.now();

      await csfd.initializeClassVariables();
      csfd.stars = await this.getAllPagesNew(force);

      this.exportRatings();

      // Stop timer
      const end = performance.now();
      const time = (end - start) / 1000;
      console.debug(`Time: ${time} seconds`);

      // Refresh page
      location.reload();

      Glob.popup(`Vaše hodnocení byla načtena.<br>Obnovte stránku.`, 4, 200);
    }

    async removableHomeBoxes() {
      const boxSettingsName = 'CSFD-Compare-hiddenBoxes';
      const settings = await getSettings(boxSettingsName);

      $('.box-header').each(async function (index, value) {
        const $section = $(this).closest('section');
        $section.attr('data-box-id', index);

        if (settings.some((x) => x.boxId == index)) {
          $section.hide();
        }

        const $btnHideBox = $('<a>', {
          class: 'hide-me button',
          href: 'javascript:void(0)',
          html: `Skrýt`,
        }).css({
          margin: 'auto',
          marginLeft: '10px',
          backgroundColor: '#7b0203',
          display: 'none',
        });

        let $h2 = $(this).find('h2');
        if ($h2.length === 0) {
          $h2 = $(this).find('p');
          $(this).css({ 'padding-right': '0px' });
          $h2.after($btnHideBox[0]);
          return;
          // }
        }

        $h2.append($btnHideBox[0]);
      });

      $('.box-header')
        .on('mouseover', async function () {
          $(this).find('.hide-me').show();
        })
        .on('mouseout', async function () {
          $(this).find('.hide-me').hide();
        });

      $('.hide-me').on('click', async function (event) {
        const $section = $(event.target).closest('section');
        const boxId = $section.data('box-id');
        let boxName = $section
          .find('h2')
          .first()
          .text()
          .replace(/\n|\t|Skrýt/g, ''); // clean from '\t', '\n'
        if (boxName === '') {
          boxName = $section
            .find('p')
            .first()
            .text()
            .replace(/\n|\t|Skrýt/g, '');
        }
        const dict = { boxId: boxId, boxName: boxName };
        const settings = await getSettings(SETTINGSNAME_HIDDEN_BOXES);
        if (!settings.includes(dict)) {
          settings.push(dict);
          localStorage.setItem(boxSettingsName, JSON.stringify(settings));
          csfd.addHideSectionButton(boxId, boxName);
        }
        $section.hide();
      });
    }

    showOnOneLine() {
      const $sections = $(`div.creator-filmography`).find(`section`);
      let $nooverflowH3 = $sections.find(`h3.film-title-nooverflow`);
      $nooverflowH3.css({
        display: 'inline-block',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'max-width': '230px',
      });
      const $filmTitleNameA = $nooverflowH3.find(`a.film-title-name`);
      $filmTitleNameA.css({
        'white-space': 'nowrap',
      });
      $filmTitleNameA.each(function () {
        const $this = $(this);
        $this.attr('title', $this.text());
      });
    }

    addHideSectionButton(boxId, boxName) {
      let $button = `
                <button class="restore-hidden-section" data-box-id="${boxId}" title="${boxName}"
                    style="border-radius: 4px;
                           margin: 1px;
                           max-width: 60px;
                           text-transform: capitalize;
                           overflow: hidden;
                           text-overflow: ellipsis;"
                >${boxName}</button>
            `;
      let $div = $(`div.hidden-sections`);
      $div.append($button);
    }

    /**
     * Creates a <span> element with a tooltip.
     *
     * @param {str} url imgur/github url of the image (screenshot)
     * @param {str} description description of the image
     * @returns {str} html code of the image
     */
    helpImageComponent(url, description) {
      const $span = $(`
                <span class="help-hover-image"
                      data-description="${description}"
                      data-img-url="${url}"><a href="${url}" target="_blank">💬</a></span>
            `).css({
        cursor: 'pointer',
        color: 'rgba(255, 255, 255, 0.8)',
      });
      return $span.get(0).outerHTML;
    }

    settingsPanelComponent() {
      const $div = $(`
        <article class="article" style="padding: 5px 10px;">
          <section>
            <div class="article-section">
              <button id="btnResetSettings" class="settings-button" style="border-radius: 4px;" title="Resetuje uložená nastavení (NE hodnocení)">Reset nastavení</button>
              <button id="btnRemoveSavedRatings" class="settings-button" style="border-radius: 4px;" title="Smaže všechna uložená hodnocení!">Smazat uložená hodnocení</button>
            </div>
          </section>
        </article>
      `);

      return $div.get(0).outerHTML;
    }

    async addSettingsPanel() {
      let dropdownStyle = 'right: 150px; width: max-content; max-width: 500px;';
      let disabled = '';
      let needToLoginTooltip = '';
      let needToLoginStyle = '';

      if (!(await this.isLoggedIn())) {
        dropdownStyle = 'right: 50px; width: max-content;';
        disabled = 'disabled';
        needToLoginTooltip = `data-tippy-content="Funguje jen po přihlášení do CSFD"`;
        needToLoginStyle = 'color: grey;';
      }

      let button = document.createElement('li');
      // button.classList.add('active');  // TODO: Debug - Nonstop zobrazení CC Menu
      let resetLabelStyle = '-webkit-transition: initial; transition: initial; font-weight: initial; display: initial !important;';

      // Add box-id attribute to .box-header(s)
      $('.box-header').each(async function (index, value) {
        let $section = $(this).closest('section');
        $section.attr('data-box-id', index);
      });

      // Build array of buttons for un-hiding sections
      let resultDisplayArray = [];
      let hiddenBoxesArray = await getSettings(SETTINGSNAME_HIDDEN_BOXES);
      hiddenBoxesArray = await checkSettingsValidity(hiddenBoxesArray, SETTINGSNAME_HIDDEN_BOXES);
      hiddenBoxesArray.sort((a, b) => a - b); // sort by numbers
      hiddenBoxesArray.forEach((element) => {
        let boxId = element.boxId;
        let boxName = element.boxName.replace(/\n|\t/g, ''); // clean text of '\n' and '\t';
        resultDisplayArray.push(`
                    <button class="restore-hidden-section" data-box-id="${boxId}" title="${boxName}"
                            style="border-radius: 4px;
                                   margin: 1px;
                                   max-width: 60px;
                                   text-transform: capitalize;
                                   overflow: hidden;
                                   text-overflow: ellipsis;"
                    >
                        ${boxName}
                    </button>
                `);
      });

      const { computed: computed_ratings, rated: rated_ratings } = await this.getLocalStorageRatingsCount();
      const current_ratings = await this.getCurrentUserRatingsCount();

      button.innerHTML = `
                <a href="javascript:void()" class="user-link initialized csfd-compare-menu">CC</a>
                <div class="dropdown-content notifications" style="${dropdownStyle}">

                    <div class="dropdown-content-head csfd-compare-settings">

                        <h2>CSFD-Compare</h2>

                        <!-- <img src="https://i.imgur.com/1A2fPca.png" style="width: 32px; height: 32px; position: absolute; left: -17px; top: -9px; opacity: 85%;" /> -->
                        <!-- <img src="https://i.imgur.com/1A2fPca.png" style="width: 32px; height: 32px; position: absolute; left: 340px; top: -9px; opacity: 85%;" /> -->

                        <span class="badge" id="cc-control-panel-rating-count" title="Počet načtených/celkových červených hodnocení" style="margin-left: 10px; font-size: 0.7rem; font-weight: bold; background-color: #aa2c16; color: white; padding: 2px 4px; border-radius: 6px; cursor: help;">
                            ${rated_ratings} / ${current_ratings}
                        </span>

                        <span class="badge" id="cc-control-panel-computed-count" title="Počet načtených vypočtených hodnocení" style="margin-left: 10px; font-size: 0.7rem; font-weight: bold; background-color: #393939; color: white; padding: 2px 4px; border-radius: 6px; cursor: help;">
                            ${computed_ratings}
                        </span>

                        <span style="float: right; font-size: 0.7rem; margin-top: 0.2rem;">
                            <a id="script-version" href="${GREASYFORK_URL}">${VERSION}</a>
                        </span>
                    </div>

                    ${csfd.settingsPanelComponent()}

                    <article class="article" style="padding: 5px 10px;">
                        <h2 class="article-header">Domácí stránka - skryté panely</h2>
                        <section>
                            <div class="article-content">
                                <div class="hidden-sections" style="max-width: fit-content;">${resultDisplayArray.join('')}</div>
                            </div>
                        </section>
                    </article>

                    <article class="article" style="padding: 5px 10px;">
                        <h2 class="article-header">Globální</h2>
                        <section>
                            <div class="article-content">
                                <input type="checkbox" id="chkClickableHeaderBoxes" name="clickable-header-boxes">
                                <label for="chkClickableHeaderBoxes" style="${resetLabelStyle}">Boxy s tlačítkem "VÍCE" jsou klikatelné celé</label>
                                ${csfd.helpImageComponent(
                                  'https://i.imgur.com/8AwhbGK.png',
                                  "Boxy s tlačítkem 'VÍCE' jsou klikatelné celé, ne pouze na tlačítko 'VÍCE'"
                                )}
                            </div>
                            <div class="article-content">
                                <input type="checkbox" id="chkClickableMessages" name="clickable-messages" ${disabled}>
                                <label for="chkClickableMessages" style="${resetLabelStyle} ${needToLoginStyle}" ${needToLoginTooltip}>Klikatelné zprávy (bez tlačítka "více...")</label>
                                ${csfd.helpImageComponent(
                                  'https://i.imgur.com/ettGHsH.png',
                                  "Zprávy lze otevřít kliknutím kamkoli na zprávu, ne pouze na 'více...'"
                                )}
                            </div>
                            <div class="article-content">
                                <input type="checkbox" id="chkAddStars" name="add-stars" ${disabled}>
                                <label for="chkAddStars" style="${resetLabelStyle} ${needToLoginStyle}" ${needToLoginTooltip}>Přidat hvězdičky hodnocení u viděných filmů/seriálů</label>
                                ${csfd.helpImageComponent(
                                  'https://i.imgur.com/aTrSU2X.png',
                                  'Přidá hvězdy hodnocení u viděných filmů/seriálů'
                                )}
                            </div>
                        </section>
                    </article>

                    <article class="article" style="padding: 5px 10px;">
                        <h2 class="article-header">Uživatelé</h2>
                        <section>
                            <div class="article-content">
                                <input type="checkbox" id="chkControlPanelOnHover" name="control-panel-on-hover">
                                <label for="chkControlPanelOnHover" style="${resetLabelStyle}">Otevřít ovládací panel přejetím myší</label>
                                ${csfd.helpImageComponent('https://i.imgur.com/N2hfkZ6.png', 'Otevřít ovládací panel přejetím myší')}
                            </div>
                            <div class="article-content">
                                <input type="checkbox" id="chkCompareUserRatings" name="compare-user-ratings" ${disabled}>
                                <label for="chkCompareUserRatings" style="${resetLabelStyle} ${needToLoginStyle}" ${needToLoginTooltip}>Porovnat uživatelská hodnocení s mými</label>
                                ${csfd.helpImageComponent(
                                  'https://i.imgur.com/cDX0JaX.png',
                                  'Přidá sloupec pro porovnání hodnocení s mými hodnoceními'
                                )}
                            </div>
                            <div class="article-content">
                                <input type="checkbox" id="chkHideUserControlPanel" name="chide-user-control-panel" ${disabled}>
                                <label for="chkHideUserControlPanel" style="${resetLabelStyle} ${needToLoginStyle}" ${needToLoginTooltip}>Skrýt ovládací panel</label>
                                ${csfd.helpImageComponent(
                                  'https://i.imgur.com/KLzFqxM.png',
                                  'Skryje ovládací panel uživatele, další funkce lze poté zobrazit pomocí nastavení níže'
                                )}
                            </div>
                            <div class="article-content">
                                <input type="checkbox" id="chkDisplayMessageButton" name="display-message-button" ${disabled}>
                                <label for="chkDisplayMessageButton" style="${resetLabelStyle} ${needToLoginStyle}" ${needToLoginTooltip}> ↳ Přidat tlačítko odeslání zprávy</label>
                                ${csfd.helpImageComponent('https://i.imgur.com/N1JuzYk.png', 'Zobrazení tlačítka pro odeslání zprávy')}
                            </div>
                            <div class="article-content">
                                <input type="checkbox" id="chkDisplayFavoriteButton" name="display-favorite-button" ${disabled}>
                                <label for="chkDisplayFavoriteButton" style="${resetLabelStyle} ${needToLoginStyle}" ${needToLoginTooltip}> ↳ Přidat tlačítko přidat/odebrat z oblíbených</label>
                                ${csfd.helpImageComponent(
                                  'https://i.imgur.com/vbnFpEU.png',
                                  'Zobrazení tlačítka pro přidání/odebrání z oblíbených'
                                )}
                            </div>
                        </section>
                    </article>

                    <article class="article" style="padding: 5px 10px;">
                        <h2 class="article-header">Film/Seriál</h2>
                        <section>
                            <div class="article-content">
                                <input type="checkbox" id="chkShowLinkToImage" name="show-link-to-image">
                                <label for="chkShowLinkToImage" style="${resetLabelStyle}"}>Zobrazit odkazy na obrázcích</label>
                                ${csfd.helpImageComponent(
                                  'https://i.imgur.com/a2Av3AK.png',
                                  'Přidá vpravo odkazy na všechny možné velikosti, které jsou k dispozici'
                                )}
                            </div>
                            <div class="article-content">
                                <input type="checkbox" id="chkRatingsEstimate" name="ratings-estimate">
                                <label for="chkRatingsEstimate" style="${resetLabelStyle}">Vypočtení % při počtu hodnocení pod 10</label>
                                ${csfd.helpImageComponent(
                                  'https://i.imgur.com/qGAhXog.png',
                                  'Ukáže % hodnocení i u filmů s méně než 10 hodnoceními'
                                )}
                            </div>
                            <div class="article-content">
                                <input type="checkbox" id="chkRatingsFromFavorites" name="ratings-from-favorites" ${disabled}>
                                <label for="chkRatingsFromFavorites" style="${resetLabelStyle} ${needToLoginStyle}" ${needToLoginTooltip}>Zobrazit hodnocení z průměru oblíbených</label>
                                ${csfd.helpImageComponent(
                                  'https://i.imgur.com/ol88F6z.png',
                                  'Zobrazí % hodnocení od přidaných oblíbených uživatelů'
                                )}
                                </div>
                                <div class="article-content">
                                <input type="checkbox" id="chkAddRatingsComputedCount" name="compare-user-ratings" ${disabled}>
                                <label for="chkAddRatingsComputedCount" style="${resetLabelStyle} ${needToLoginStyle}" ${needToLoginTooltip}>Zobrazit spočteno ze sérií</label>
                                ${csfd.helpImageComponent(
                                  'https://i.imgur.com/KtpT81X.png',
                                  "Pokud je hodnocení 'vypočteno', zobrazí 'spočteno ze sérií/episod'"
                                )}
                            </div>
                            <div class="article-content">
                                <input type="checkbox" id="chkAddRatingsDate" name="add-ratings" ${disabled}>
                                <label for="chkAddRatingsDate" style="${resetLabelStyle} ${needToLoginStyle}" ${needToLoginTooltip}>Zobrazit datum hodnocení</label>
                                ${csfd.helpImageComponent(
                                  'https://i.imgur.com/CHpBDxK.png',
                                  'Zobrazí datum hodnocení <br>!!! Pozor !!! pere se s pluginem ČSFD Extended - v tomto případě ponechte vypnuté'
                                )}
                            </div>
                            <div class="article-content">
                                <input type="checkbox" id="chkHideSelectedUserReviews" name="hide-selected-user-reviews">
                                <label for="chkHideSelectedUserReviews" style="${resetLabelStyle}">Skrýt recenze lidí</label>
                                ${csfd.helpImageComponent(
                                  'https://i.imgur.com/k6GGE9K.png',
                                  'Skryje recenze zvolených uživatelů oddělených čárkou: POMO, kOCOUR'
                                )}
                                <div>
                                    <input type="textbox" id="txtHideSelectedUserReviews" name="hide-selected-user-reviews-list">
                                    <label style="${resetLabelStyle}">(např: POMO, golfista)</label>
                                </div>
                            </div>
                        </section>
                    </article>

                    <article class="article" style="padding: 5px 10px;">
                        <h2 class="article-header">Herci</h2>
                        <section>
                            <div class="article-content">
                                <input type="checkbox" id="chkShowOnOneLine" name="show-on-one-line">
                                <label for="chkShowOnOneLine" style="${resetLabelStyle}"}>Filmy na jednom řádku</label>
                                ${csfd.helpImageComponent('https://i.imgur.com/IPXzclo.png', 'Donutí zobrazit název filmu na jeden řádek')}
                            </div>
                        </section>
                    </article>

                    <article class="article" style="padding: 5px 10px;">
                        <h2 class="article-header">!! Experimentální !!</h2>
                        <section>
                          <div class="article-content">
                              <input type="checkbox" id="chkLoadComputedRatings" name="control-panel-on-hover" disabled>
                              <label for="chkLoadComputedRatings" style="${resetLabelStyle}"><del>Přinačíst vypočtená (černá) hodnocení</del></label>
                          </div>
                          <div class="article-content">
                              <input type="checkbox" id="chkAddChatReplyButton" name="control-panel-on-hover" ${disabled}>
                              <label for="chkAddChatReplyButton" style="${resetLabelStyle} ${needToLoginStyle}" ${needToLoginTooltip}>Přidat v diskuzích možnost odpovědět na sebe</label>
                          </div>
                        </section>
                    </article>

                </div>
            `;
      $('.header-bar').prepend(button);

      await refreshTooltips();

      // Show help image on hover
      $('.help-hover-image')
        .on('mouseenter', function (e) {
          const url = $(this).attr('data-img-url');
          const description = $(this).attr('data-description');
          $('body').append(`<p id='image-when-hovering-text'><img src='${url}'/><br>${description}</p>`);
          $('#image-when-hovering-text')
            .css({
              position: 'absolute',
              top: e.pageY + 5 + 'px',
              left: e.pageX + 25 + 'px',
              zIndex: '9999',
              backgroundColor: 'white',
              padding: '5px',
              border: '1px solid #6a6a6a',
              borderRadius: '5px',
            })
            .fadeIn('fast');
        })
        .on('mouseleave', function () {
          $('#image-when-hovering-text').remove();
        });

      $('.help-hover-image').on('mousemove', function (e) {
        $('#image-when-hovering-text')
          .css('top', e.pageY + 5 + 'px')
          .css('left', e.pageX + 25 + 'px');
      });

      // Show() the section and remove the number from localStorage
      $('.hidden-sections').on('click', '.restore-hidden-section', async function () {
        let $element = $(this);
        let sectionId = $element.attr('data-box-id');

        // Remove from localStorage
        let hiddenBoxesArray = await getSettings(SETTINGSNAME_HIDDEN_BOXES);
        hiddenBoxesArray = hiddenBoxesArray.filter((item) => item.boxId !== parseInt(sectionId));
        let settingsName = 'CSFD-Compare-hiddenBoxes';
        localStorage.setItem(settingsName, JSON.stringify(hiddenBoxesArray));

        // Show section
        let $section = $(`section[data-box-id="${sectionId}"`);
        $section.show();

        // Remove button
        $element.remove();
      });

      // TODO: DEBUG - zakomentovat pro nonstop zobrazení CC Menu
      // Don't hide settings popup when mouse leaves within interval of 0.2s
      let timer;
      $(button).on('mouseover', function () {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        if (!$(button).hasClass('active')) {
          $(button).addClass('active');
        }
      });

      $(button).on('mouseleave', function () {
        if ($(button).hasClass('active')) {
          timer = setTimeout(() => {
            $(button).removeClass('active');
          }, 200);
        }
      });

      $(button)
        .find('#btnResetSettings')
        .on('click', async function () {
          console.debug("Resetting 'CSFD-Compare-settings' settings...");
          localStorage.removeItem('CSFD-Compare-settings');
          location.reload();
        });

      $(button)
        .find('#btnRemoveSavedRatings')
        .on('click', async function () {
          const username = await csfd.getUsername();

          if (!username) {
            alert('Nejprve se přihlašte.');
            return;
          }

          if (!confirm(`Opravdu chcete smazat uložená hodnocení uživatele ${username}?`)) {
            return;
          }

          console.debug(`Removing saved ratings for user '${username}'...`);
          localStorage.removeItem(`CSFD-Compare_${username}`);
          location.reload();
        });
    }

    async checkAndUpdateCurrentRating() {
      const { rating, computedFrom, computed } = await this.getCurrentFilmRating();
      const currentFilmDateAdded = await this.getCurrentFilmDateAdded();

      const filmUrl = await this.getCurrentFilmUrl();
      const filmId = await this.getMovieIdFromHref(filmUrl);

      // In case user removed rating, we need to remove it from the LC
      if (rating === '') {
        console.info('☠️ No rating on current page but record in LC => Removing record...');
        const removed = await this.removeFromLocalStorage();
        if (removed) {
          console.info('☠️ Removed record from LC.');
          await this.updateControlPanelRatingCount();
        }
      } else {
        // Check if current page rating corresponds with that in LocalStorage, if not, update it
        const filmFullUrl = this.getCurrentFilmFullUrl();
        const type = this.getCurrentFilmType();
        const year = this.getCurrentFilmYear();
        const lastUpdate = this.getCurrentDateTime();

        const ratingsObject = {
          url: filmUrl,
          fullUrl: filmFullUrl,
          rating: rating,
          date: currentFilmDateAdded,
          type: type,
          year: year,
          computed: computed,
          computedCount: computed ? this.getCurrentFilmComputedCount() : '',
          computedFromText: computed ? computedFrom : '',
          lastUpdate: lastUpdate,
        };
        const updated = await this.updateInLocalStorage(ratingsObject);
        if (updated) {
          console.info('✅ Updated record in LC.');
          await this.updateControlPanelRatingCount();
        }
      }
    }

    /**
     * Returns current DateTime, e.g. 11.10.2022 1:49:42
     * @returns {str} DateTime in format DD.MM.YYYY hh:mm:ss
     */
    getCurrentDateTime() {
      const d = new Date();
      const dateFormat =
        [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('.') + ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
      return dateFormat;
    }

    /**
     * When user wants to open message, he needs to click on 'více' link.
     * This removes the 'více' link and enables to click on the message.
     *
     * @returns {None}
     */
    clickableMessages() {
      const $messagesBox = $('.dropdown-content.messages');
      const $moreSpan = $messagesBox.find('.span-more-small');
      if ($moreSpan.length < 1) {
        return;
      }

      for (const $span of $moreSpan) {
        // Hide "... více" button
        $($span).hide();

        const $content = $($span).closest('.article-content');
        const $article = $content.closest('article');
        $content.on(
          'hover',
          function () {
            $article.css('background-color', '#e1e0e0');
          },
          function () {
            $article.css('background-color', 'initial');
          }
        );

        const href = $($span).find('a').attr('href');
        $content.wrap(`<a href="${href}"></a>`);
      }
    }

    async clickableHeaderBoxes() {
      // CLICKABLE HEADER BUTTONS
      $('.user-link.wantsee').on('click', function () {
        location.href = '/chci-videt/';
      });
      $('.user-link.favorites').on('click', function () {
        location.href = '/soukrome/oblibene/'; // TODO: Toto pry nefunguje
      });
      $('.user-link.messages').on('click', function () {
        location.href = '/posta/';
      });

      // CLICKABLE HEADER DIVS
      const headers = $('.dropdown-content-head,.box-header');
      for (const div of headers) {
        const btn = $(div).find('a.button');

        if (btn.length === 0) {
          continue;
        }
        if (!['více', 'viac'].includes(btn[0].text.toLowerCase())) {
          continue;
        }

        $(div).wrap(`<a href="${btn.attr('href')}"></a>`);

        const h2 = $(div).find('h2');
        const spanCount = h2.find('span.count');
        $(div)
          .on('mouseover', () => {
            $(div).css({ backgroundColor: '#ba0305' });
            $(h2[0]).css({ backgroundColor: '#ba0305', color: '#fff' });
            if (spanCount.length == 1) {
              spanCount[0].style.color = '#fff';
            }
          })
          .on('mouseout', () => {
            if ($(div).hasClass('dropdown-content-head')) {
              $(div).css({ backgroundColor: '#ececec' });
            } else {
              $(div).css({ backgroundColor: '#e3e3e3' });
            }
            $(h2[0]).css({ backgroundColor: 'initial', color: 'initial' });
            if (spanCount.length == 1) {
              spanCount[0].style.color = 'initial';
            }
          });
      }
    }

    hideSelectedUserReviews() {
      let articleHeaders = $('.article-header-review-name');
      for (const element of articleHeaders) {
        let userTitle = $(element).find('.user-title-name');
        if (userTitle.length != 1) {
          continue;
        }
        let ignoredUser = settings.hideSelectedUserReviewsList.includes(userTitle[0].text);
        if (!ignoredUser) {
          continue;
        }
        $(element).closest('article').hide();
      }
    }

    /**
     *
     * @returns {Promise<{rating: string, computedFrom: string, computed: boolean}>}
     */
    async getCurrentFilmDateAdded() {
      let ratingText = this.csfdPage.find('span.stars-rating.initialized').attr('title');
      if (ratingText === undefined) {
        // Grab the rating date from mobile-rating
        ratingText = this.csfdPage.find('.mobile-film-rating-detail a span').attr('title');
        if (ratingText === undefined) {
          return;
        }
      }
      let match = ratingText.match('[0-9]{2}[.][0-9]{2}[.][0-9]{4}');
      if (match !== null) {
        let ratingDate = match[0];
        return ratingDate;
      }
      return undefined;
    }

    async addRatingsDate() {
      // Grab the rating date from stars-rating
      let ratingText = $('span.stars-rating.initialized').attr('title');
      if (ratingText === undefined) {
        // Grab the rating date from mobile-rating
        ratingText = $('.mobile-film-rating-detail a span').attr('title');
        if (ratingText === undefined) {
          return;
        }
      }
      let match = ratingText.match('[0-9]{2}[.][0-9]{2}[.][0-9]{4}');
      if (match !== null) {
        let ratingDate = match[0];
        let $myRatingCaption = $('.my-rating h3');
        $myRatingCaption.html(`${$myRatingCaption.text()}<br>${ratingDate}`);
      }
    }

    /**
     * From the title of .current-user-rating span get 'spocteno ze serii: x'
     * and add it bellow the 'Moje hodnoceni' text
     */
    async addRatingsComputedCount() {
      let $computedStars = $('.star.active.computed');
      let isComputed = $computedStars.length != 0;
      if (!isComputed) {
        return;
      }
      let fromRatingsText = this.csfdPage.find('.current-user-rating > span').attr('title');
      if (fromRatingsText === undefined) {
        return;
      }
      let $myRatingCaption = $('.my-rating h3');
      $myRatingCaption.html(`${$myRatingCaption.text()}<br>${fromRatingsText}`);
    }

    async checkForUpdate() {
      let pageHtml = await $.get(GREASYFORK_URL);
      let version = $(pageHtml).find('dd.script-show-version > span').text();
      return version;
    }

    async getChangelog() {
      let pageHtml = await $.get(`${GREASYFORK_URL}/versions`);
      let versionDateTime = $(pageHtml).find('.version-date').first().attr('datetime');
      let versionNumber = $(pageHtml).find('.version-number a').first().text();
      let versionDate = versionDateTime.substring(0, 10);
      let versionTime = versionDateTime.substring(11, 16);
      let changelogText = `
                <div style="font-size: 0.8rem; line-height: 1.5;">${versionDate} ${versionTime} (${versionNumber})<br>
                    <hr>
                    ${$(pageHtml).find('.version-changelog').html()}
                </div>
            `;
      return changelogText;
    }

    async initializeClassVariables() {
      this.userUrl = await this.getCurrentUser();
      const username = await this.getUsername();
      this.storageKey = `${SCRIPTNAME}_${username}`;
      this.userRatingsUrl = location.origin.endsWith('sk') ? `${this.userUrl}/hodnotenia` : `${this.userUrl}/hodnoceni`;
      this.stars = this.getStars();
    }

    async updateControlPanelRatingCount() {
      const { computed, rated } = await csfd.getLocalStorageRatingsCount();
      const current_ratings = await this.getCurrentUserRatingsCount();

      const $ratingsSpan = $('#cc-control-panel-rating-count');
      const $computedSpan = $('#cc-control-panel-computed-count');

      $ratingsSpan.text(`${rated} / ${current_ratings}`);
      $computedSpan.text(`${computed}`);
    }

    async isRatingCountOk() {
      const { rated, computed } = await csfd.getLocalStorageRatingsCount();
      const current_ratings = await this.getCurrentUserRatingsCount();
      return rated === current_ratings;
    }

    /**
     * For some reason, IMDb button to link current film does not have icon. This function adds it.
     *
     * @returns {Promise<void>}
     */
    async addImdbIcon() {
      const $image = $('<img>', {
        // src: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/171_Imdb_logo_logos-512.png',
        src: 'https://images.squarespace-cdn.com/content/v1/57c984f1cd0f68cf4beeb2cf/1472911999963-KH5AM2AU675ZGJUJEGQV/imdb+logo.png',
        alt: 'IMDB',
        title: 'IMDB',
        style: 'width: 26px; height: 26px; mix-blend-mode: darken;',
        class: 'imdb-icon',
      });
      const $imdbI = $('a.button-big.button-imdb i');
      $imdbI.css({ opacity: '1', 'background-color': '#f5c518' });
      $imdbI.append($image);
    }

    /**
     * On discussion pages, add a button to reply to user's own comments.
     *
     * Limitations:
     *  - If user replies to his own comment, he can't reply to the first someone else's comment.
     *  - Can't reply to multiple user's own comments at once.
     *
     * @returns {Promise<void>}
     */
    async addChatReplyButton() {
      // Get all divs with class 'icon-control' containing <i> with class 'icon-reply' in them (working reply buttons)
      const replyIconControlElements = $('.icon-control:has(i.icon-reply)');
      const $firstWorkingReplyIconControl = replyIconControlElements.first();
      const missingIconElements = $('.icon-control').not($(':has(i.icon-reply'));

      // Copy the working reply button and add it to the missingIconElements
      missingIconElements.each(async (index, element) => {
        // Clone working IconControl and remove potential '<a>' element whose child element has 'i.icon-trash'
        const $replyIconControlClone = $firstWorkingReplyIconControl.clone();
        $replyIconControlClone.find('a:has(i.icon-trash)').remove();

        const $replyIconCloneHref = $replyIconControlClone.find('a'); // TODO: not trash
        const $userTitle = element.closest('.article-content').querySelector('a.user-title-name');

        const username = $userTitle.text;
        const userId = $userTitle.href.split('/')[4].split('-')[0];
        const postId = element.closest('article').getAttribute('id').split('-')[2];

        $replyIconCloneHref.attr({
          'data-nick': username,
          'data-id': userId,
          'data-post': postId,
        });

        const $replyIconClone = $replyIconControlClone.find('i.icon-reply');
        $replyIconClone.on('click', () => {
          const $originalHref = $firstWorkingReplyIconControl.find('a');

          // Save original state
          const originalState = {
            'data-nick': $originalHref.attr('data-nick'),
            'data-id': $originalHref.attr('data-id'),
            'data-post': $originalHref.attr('data-post'),
          };

          // Edit the working reply button to contain the correct data
          $originalHref.attr({
            'data-nick': username,
            'data-id': userId,
            'data-post': postId,
          });

          // Trigger the click on the working reply button
          $originalHref.find('i.icon-reply').trigger('click');

          // Return the working reply button to its original state
          $originalHref.attr({
            'data-nick': originalState['data-nick'],
            'data-id': originalState['data-id'],
            'data-post': originalState['data-post'],
          });
        });

        $(element).append($replyIconCloneHref);
      });
    }
  }

  // ============================================================================================
  // SCRIPT START
  // ============================================================================================
  await delay(20); // Greasemonkey workaround, wait a little bit for page to somehow load
  console.debug('CSFD-Compare - Script started');
  let csfd = new Csfd($('div.page-content'));

  // =================================
  // LOAD SETTINGS
  // =================================
  await csfd.fillMissingSettingsKeys();

  const settings = await getSettings();
  await csfd.addSettingsPanel();
  await csfd.loadInitialSettings();
  await csfd.addSettingsEvents();

  // =================================
  // GLOBAL
  // =================================
  csfd.addImdbIcon();

  if (settings.clickableHeaderBoxes) {
    csfd.clickableHeaderBoxes();
  }
  if (settings.showControlPanelOnHover) {
    csfd.openControlPanelOnHover();
  }

  // Film/Series page
  if (location.href.includes('/film/') || location.href.includes('/tvurce/') || location.href.includes('/tvorca/')) {
    if (settings.hideSelectedUserReviews) {
      csfd.hideSelectedUserReviews();
    }
    if (settings.showLinkToImage) {
      csfd.showLinkToImage();
    }
    if (settings.ratingsEstimate) {
      csfd.ratingsEstimate();
    }
    if (settings.ratingsFromFavorites) {
      csfd.ratingsFromFavorites();
    }
  }

  // =================================
  // Page - Tvurce
  // =================================
  if (location.href.includes('/tvurce/') || location.href.includes('/tvorca/')) {
    if (settings.showOnOneLine) {
      csfd.showOnOneLine();
    }
  }

  // =================================
  // Page - Homepage
  // =================================
  if (await onHomepage()) {
    csfd.removableHomeBoxes();
  }

  // =================================
  // NOT LOGGED IN
  // =================================
  if (!(await csfd.isLoggedIn())) {
    // User page
    if (location.href.includes('/uzivatel/')) {
      if (settings.hideUserControlPanel) {
        csfd.hideUserControlPanel();
      }
    }
  }

  // =================================
  // LOGGED IN
  // =================================
  if (await csfd.isLoggedIn()) {
    // Global settings without category
    await csfd.initializeClassVariables();

    csfd.checkForOldLocalstorageRatingKeys();

    // Update user ratings count
    await csfd.updateControlPanelRatingCount();

    // =================================
    // Page - Diskuze
    // =================================
    if ((await csfd.onPageDiskuze()) && settings.addChatReplyButton) {
      csfd.addChatReplyButton();
    }

    if (settings.addStars && (await csfd.notOnUserPage())) {
      csfd.addStars();
    }

    let ratingsInLocalStorage = 0;
    let computedRatingsInLocalStorage = 0;
    let currentUserRatingsCount = 0;
    if (settings.addStars || settings.compareUserRatings) {
      const { computed, rated } = await csfd.getLocalStorageRatingsCount();
      ratingsInLocalStorage = rated;
      computedRatingsInLocalStorage = computed;
      currentUserRatingsCount = await csfd.getCurrentUserRatingsCount();
      if (ratingsInLocalStorage !== currentUserRatingsCount) {
        csfd.refreshButtonNew(ratingsInLocalStorage, currentUserRatingsCount, computedRatingsInLocalStorage);
        csfd.badgesComponent(ratingsInLocalStorage, currentUserRatingsCount, computedRatingsInLocalStorage);
        await csfd.addWarningToUserProfile();
      } else {
        csfd.userRatingsCount = currentUserRatingsCount;
      }
    }

    // =================================
    // Header modifications
    // =================================
    if (settings.clickableMessages) {
      csfd.clickableMessages();
    }

    // =================================
    // Page - Film
    // =================================
    if (location.href.includes('/film/')) {
      if (settings.addRatingsDate) {
        csfd.addRatingsDate();
      }
      if (settings.addRatingsComputedCount) {
        csfd.addRatingsComputedCount();
      }

      // Dynamic LocalStorage update on Film/Series in case user changes ratings
      await csfd.checkAndUpdateCurrentRating();
    }

    // =================================
    // Page - Other User
    // =================================
    if (await csfd.onPageOtherUser()) {
      if (settings.displayMessageButton) {
        csfd.displayMessageButton();
      }
      if (settings.displayFavoriteButton) {
        csfd.displayFavoriteButton();
      }
      if (settings.hideUserControlPanel) {
        csfd.hideUserControlPanel();
      }
      if (await csfd.onPageOtherUserHodnoceni()) {
        if (settings.compareUserRatings) {
          csfd.addRatingsColumn();
        }
      }
    }
  }

  // let t0 = performance.now();
  // const $siteHtml = await $.get(GREASYFORK_URL);
  // let t1 = performance.now();
  // console.log("Call to 'await $.get(GREASYFORK_URL)' took " + (t1 - t0) + " ms.");

  // =================================
  // Check for update
  // =================================
  // If not already in session storage, get new version from greasyfork and display changelog over version link
  let updateCheckJson = sessionStorage.updateChecked !== undefined ? JSON.parse(sessionStorage.updateChecked) : {};
  let $verLink = $('#script-version');
  if (Object.keys(updateCheckJson).length !== 0) {
    const difference = (Date.now() - updateCheckJson.lastCheck) / 60 / 60 / 60;
    const curVersion = VERSION.replace('v', '');
    // If more than 5 minutes, check for update
    if (difference >= 5) {
      let version = await csfd.checkForUpdate();
      let changelogText = await csfd.getChangelog();
      updateCheckJson.changelogText = changelogText;
      $verLink.attr('data-tippy-content', changelogText);
      if (version !== curVersion) {
        updateCheckJson.newVersion = true;
        updateCheckJson.newVersionNumber = version;

        let versionText = `${$verLink.text()} (Update v${version})`;
        $verLink.text(versionText);
        updateCheckJson.versionText = versionText;
      } else {
        updateCheckJson.newVersion = false;
        updateCheckJson.versionText = VERSION;
      }
      updateCheckJson.lastCheck = Date.now();
      sessionStorage.updateChecked = JSON.stringify(updateCheckJson);
    } else {
      if (updateCheckJson.newVersion === true) {
        if (updateCheckJson.newVersionNumber === curVersion) {
          $verLink.text(`v${curVersion}`);
        } else {
          const versionText = `${$verLink.text()} (Update v${updateCheckJson.newVersionNumber})`;
          $verLink.text(versionText);
        }
        $verLink.attr('data-tippy-content', updateCheckJson.changelogText);
      } else {
        $verLink.attr('data-tippy-content', updateCheckJson.changelogText);
      }
      // $('#script-version')
      //     .text(updateCheckJson.versionText)
      //     .attr("data-tippy-content", updateCheckJson.changelogText);
    }
  } else {
    let version = await csfd.checkForUpdate();
    let curVersion = VERSION.replace('v', '');
    if (version !== curVersion) {
      updateCheckJson.newVersion = true;
      let $verLink = $('#script-version');
      let versionText = `${$verLink.text()} (Update v${version})`;
      updateCheckJson.versionText = versionText;
      updateCheckJson.newVersionNumber = version;
      let changelogText = await csfd.getChangelog();
      $verLink.text(versionText);
      updateCheckJson.changelogText = changelogText;
      $verLink.attr('data-tippy-content', changelogText);
    } else {
      updateCheckJson.changelogText = await csfd.getChangelog();
      updateCheckJson.newVersion = false;
      updateCheckJson.versionText = VERSION;
      $('#script-version').attr('data-tippy-content', updateCheckJson.changelogText);
    }
    updateCheckJson.lastCheck = Date.now();
    sessionStorage.updateChecked = JSON.stringify(updateCheckJson);
  }

  // Call TippyJs constructor
  await refreshTooltips();

  // =================================
  // TEST
  // =================================
  // const api = new Api();
  // const url = 'https://csfdb.noirgoku.eu/api/v1/movies/byids/';
  // const res = await api.getCurrentPageRatings(url);
  // console.log("CURRENT PAGE RATINGS");
  // console.log(res);
})();
