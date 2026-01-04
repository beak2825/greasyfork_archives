// ==UserScript==
// @name         Filterboxd
// @namespace    https://github.com/blakegearin/filterboxd
// @version      1.5.0
// @description  Filter content on Letterboxd
// @author       Blake Gearin <hello@blakeg.me> (https://blakegearin.com)
// @match        https://letterboxd.com/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM.getValue
// @grant        GM.setValue
// @icon         https://raw.githubusercontent.com/blakegearin/filterboxd/main/img/logo.png
// @supportURL   https://github.com/blakegearin/filterboxd/issues
// @license      MIT
// @copyright    2024–2025, Blake Gearin (https://blakegearin.com)
// @downloadURL https://update.greasyfork.org/scripts/519719/Filterboxd.user.js
// @updateURL https://update.greasyfork.org/scripts/519719/Filterboxd.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* global GM_config */

(function() {
  'use strict';

  const VERSION = '1.5.0';
  const USERSCRIPT_NAME = 'Filterboxd';
  let GMC = null;

  // Log levels
  const SILENT = 0;
  const QUIET = 1;
  const INFO = 2;
  const DEBUG = 3;
  const VERBOSE = 4;
  const TRACE = 5;

  // Change to true if you want to clear all your local data; this is irreversible
  const RESET_DATA = false;

  const LOG_LEVELS = {
    default: 'quiet',
    options: [
      'silent',
      'quiet',
      'info',
      'debug',
      'verbose',
      'trace',
    ],
    getName: (level) => {
      return {
        0: 'silent',
        1: 'quiet',
        2: 'info',
        3: 'debug',
        4: 'verbose',
        5: 'trace',
      }[level];
    },
    getValue: (name) => {
      return {
        silent: SILENT,
        quiet: QUIET,
        info: INFO,
        debug: DEBUG,
        verbose: VERBOSE,
        trace: TRACE,
      }[name];
    },
  };

  function currentLogLevel() {
    if (GMC === null) return LOG_LEVELS.getValue(LOG_LEVELS.default);

    return LOG_LEVELS.getValue(GMC.get('logLevel'));
  }

  function log (level, message, variable = undefined) {
    if (currentLogLevel() < level) return;

    const levelName = LOG_LEVELS.getName(level);

    const log = `[${VERSION}] [${levelName}] ${USERSCRIPT_NAME}: ${message}`;

    console.groupCollapsed(log);

    if (variable !== undefined) console.dir(variable, { depth: null });

    console.trace();
    console.groupEnd();
  }

  function logError (message, error = undefined) {
    const log = `[${VERSION}] [error] ${USERSCRIPT_NAME}: ${message}`;

    console.groupCollapsed(log);

    if (error !== undefined) console.error(error);

    console.trace();
    console.groupEnd();
  }

  log(TRACE, 'Starting');

  function gmcGet(key) {
    log(DEBUG, 'gmcGet()');

    try {
      return GMC.get(key);
    } catch (error) {
      logError(`Error setting GMC, key=${key}`, error);
    }
  }

  function gmcSet(key, value) {
    log(DEBUG, 'gmcSet()');

    try {
      return GMC.set(key, value);
    } catch (error) {
      logError(`Error setting GMC, key=${key}, value=${value}`, error);
    }
  }

  function gmcSave() {
    log(DEBUG, 'gmcSave()');

    try {
      return GMC.save();
    } catch (error) {
      logError('Error saving GMC', error);
    }
  }

  function startObserving() {
    log(DEBUG, 'startObserving()');

    OBSERVER.observe(
      document.body,
      {
        childList: true,
        subtree: true,
      },
    );
  }

  function modifyThenObserve(callback) {
    log(DEBUG, 'modifyThenObserve()');

    OBSERVER.disconnect();
    callback();
    startObserving();
  }

  function mutationsExceedsLimits() {
    // Fail-safes to prevent infinite loops
    if (IDLE_MUTATION_COUNT > gmcGet('maxIdleMutations')) {
      logError('Max idle mutations exceeded');
      OBSERVER.disconnect();

      return true;
    } else if (ACTIVE_MUTATION_COUNT >= gmcGet('maxActiveMutations')) {
      logError('Max active mutations exceeded');
      OBSERVER.disconnect();

      return true;
    }

    return false;
  }

  function observeAndModify(mutationsList) {
    log(VERBOSE, 'observeAndModify()');

    if (mutationsExceedsLimits()) return;

    log(VERBOSE, 'mutationsList.length', mutationsList.length);

    for (const mutation of mutationsList) {
      if (mutation.type !== 'childList') return;

      log(TRACE, 'mutation', mutation);

      let sidebarUpdated;
      let popMenuUpdated;
      let filtersApplied;

      modifyThenObserve(() => {
        sidebarUpdated = maybeAddListItemToSidebar();
        log(VERBOSE, 'sidebarUpdated', sidebarUpdated);

        popMenuUpdated = addListItemToPopMenu();
        log(VERBOSE, 'popMenuUpdated', popMenuUpdated);

        filtersApplied = applyFilters();
        log(VERBOSE, 'filtersApplied', filtersApplied);
      });

      const activeMutation = sidebarUpdated || popMenuUpdated || filtersApplied;
      log(DEBUG, 'activeMutation', activeMutation);

      if (activeMutation) {
        ACTIVE_MUTATION_COUNT++;
        log(VERBOSE, 'ACTIVE_MUTATION_COUNT', ACTIVE_MUTATION_COUNT);
      } else {
        IDLE_MUTATION_COUNT++;
        log(VERBOSE, 'IDLE_MUTATION_COUNT', IDLE_MUTATION_COUNT);
      }

      if (mutationsExceedsLimits()) break;
    }
  }

  // Source: https://stackoverflow.com/a/21144505/5988852
  function countWords(string) {
    var matches = string.match(/[\w\d’'-]+/gi);
    return matches ? matches.length : 0;
  }

  function createId(string) {
    log(TRACE, 'createId()');

    if (string.startsWith('#')) return string;

    if (string.startsWith('.')) {
      logError(`Attempted to create an id from a class: "${string}"`);
      return;
    }

    if (string.startsWith('[')) {
      logError(`Attempted to create an id from an attribute selector: "${string}"`);
      return;
    }

    return `#${string}`;
  }

  const FILM_BEHAVIORS = [
    'Remove',
    'Fade',
    'Blur',
    'Replace poster',
    'Custom',
  ];
  const REVIEW_BEHAVIORS = [
    'Remove',
    'Fade',
    'Blur',
    'Replace text',
    'Custom',
  ];
  const COLUMN_ONE_WIDTH = '33%';
  const COLUMN_TWO_WIDTH = '64.8%';
  const COLUMN_HALF_WIDTH = '50%';

  let IDLE_MUTATION_COUNT = 0;
  let ACTIVE_MUTATION_COUNT = 0;
  let SELECTORS = {
    filmPosterPopMenu: {
      self: '.film-poster-popmenu',
      userscriptListItemClass: 'filterboxd-list-item',
      addToList: '.film-poster-popmenu .menu-item-add-to-list',
      addThisFilm: '.film-poster-popmenu .menu-item-add-this-film',
    },
    filmPageSections: {
      backdropImage: 'body.backdrop-loaded .backdrop-container',
      // Left column
      poster: '#film-page-wrapper section.poster-list a[data-js-trigger="postermodal"]',
      stats: '#film-page-wrapper section.poster-list ul.film-stats',
      whereToWatch: '#film-page-wrapper section.watch-panel',
      // Right column
      userActionsPanel: '#film-page-wrapper section#userpanel',
      ratings: '#film-page-wrapper section.ratings-histogram-chart',
      // Middle column
      releaseYear: '#film-page-wrapper .details .releaseyear',
      director: '#film-page-wrapper .details .credits',
      tagline: '#film-page-wrapper .tagline',
      description: '#film-page-wrapper .truncate',
      castTab: '#film-page-wrapper #tabbed-content ul li:nth-of-type(1),#film-page-wrapper #tab-cast',
      crewTab: '#film-page-wrapper #tabbed-content ul li:nth-of-type(2),#film-page-wrapper #tab-crew',
      detailsTab: '#film-page-wrapper #tabbed-content ul li:nth-of-type(3),#film-page-wrapper #tab-details',
      genresTab: '#film-page-wrapper #tabbed-content ul li:nth-of-type(4),#film-page-wrapper #tab-genres',
      releasesTab: '#film-page-wrapper #tabbed-content ul li:nth-of-type(5),#film-page-wrapper #tab-releases',
      activityFromFriends: '#film-page-wrapper section.activity-from-friends',
      filmNews: '#film-page-wrapper section.film-news',
      reviewsFromFriends: '#film-page-wrapper section#popular-reviews-with-friends',
      popularReviews: '#film-page-wrapper section#popular-reviews',
      recentReviews: '#film-page-wrapper section#recent-reviews',
      relatedFilms: '#film-page-wrapper section#related',
      similarFilms: '#film-page-wrapper section.related-films:not(#related)',
      mentionedBy: '#film-page-wrapper section#film-hq-mentions',
      popularLists: '#film-page-wrapper section:has(#film-popular-lists)',
    },
    filter: {
      filmClass: 'filterboxd-filter-film',
      reviewClass: 'filterboxd-filter-review',
      reviews: {
        ratings: '.film-detail .attribution .rating,.film-detail-meta .rating,.activity-summary .rating,.film-metadata .rating,.-rated .rating,.poster-viewingdata .rating',
        likes: '.film-detail .attribution .icon-liked,.film-metadata .icon-liked,.review .like-link-target,.film-detail-content .like-link-target',
        comments: '.film-detail .attribution .content-metadata,#content #comments',
        withSpoilers: '.film-detail:has(.contains-spoilers)',
        withoutRatings: '.film-detail:not(:has(.rating))',
      },
    },
    homepageSections: {
      friendsHaveBeenWatching: '.person-home h1.title-hero span',
      newFromFriends: '.person-home section#recent-from-friends',
      popularWithFriends: '.person-home section#popular-with-friends',
      discoveryStream: '.person-home section.section-discovery-stream',
      latestNews: '.person-home section#latest-news:not(:has(.teaser-grid))',
      popularReviewsWithFriends: '.person-home section#popular-reviews',
      newListsFromFriends: '.person-home section:has([href="/lists/friends/"])',
      popularLists: '.person-home section:has([href="/lists/popular/this/week/"])',
      recentStories: '.person-home section.stories-section',
      recentShowdowns: '.person-home section:has([href="/showdown/"])',
      recentNews: '.person-home section#latest-news:has(.teaser-grid)',
    },
    processedClass: {
      apply: 'filterboxd-hide-processed',
      remove: 'filterboxd-unhide-processed',
    },
    settings: {
      clear: '.clear',
      favoriteFilms: '.favourite-films-selector',
      filteredTitleLinkClass: 'filtered-title-span',
      note: '.note',
      posterList: '.poster-list',
      removePendingClass: 'remove-pending',
      savedBadgeClass: 'filtered-saved',
      subNav: '.sub-nav',
      subtitle: '.mob-subtitle',
      tabbedContentId: '#tabbed-content',
    },
    userpanel: {
      self: '#userpanel',
      userscriptListItemId: 'filterboxd-userpanel-list-item',
      addThisFilm: '#userpanel .add-this-film',
    },
  };

  function addListItemToPopMenu() {
    log(DEBUG, 'addListItemToPopMenu()');

    const filmPosterPopMenus = document.querySelectorAll(SELECTORS.filmPosterPopMenu.self);

    if (!filmPosterPopMenus) {
      log(`Selector ${SELECTORS.filmPosterPopMenu.self} not found`, DEBUG);
      return false;
    }

    let pageUpdated = false;

    filmPosterPopMenus.forEach(filmPosterPopMenu => {
      const userscriptListItemPresent = filmPosterPopMenu.querySelector(
        `.${SELECTORS.filmPosterPopMenu.userscriptListItemClass}`,
      );
      if (userscriptListItemPresent) return;

      const lastListItem = filmPosterPopMenu.querySelector('li:last-of-type');

      if (!lastListItem) {
        logError(`Selector ${SELECTORS.filmPosterPopMenu} li:last-of-type not found`);
        return;
      }

      const unorderedList = filmPosterPopMenu.querySelector('ul');
      if (!unorderedList) {
        logError(`Selector ${SELECTORS.filmPosterPopMenu.self} ul not found`);
        return;
      }

      modifyThenObserve(() => {
        let userscriptListItem = lastListItem.cloneNode(true);
        userscriptListItem.classList.add(SELECTORS.filmPosterPopMenu.userscriptListItemClass);

        userscriptListItem = buildUserscriptLink(userscriptListItem, unorderedList);
        lastListItem.parentNode.append(userscriptListItem);
      });

      pageUpdated = true;
    });

    return pageUpdated;
  }

  function addFilterToFilm({ id, slug }) {
    log(DEBUG, 'addFilterToFilm()');

    let pageUpdated = false;

    const idMatch = `[data-film-id="${id}"]`;
    let appliedSelector = `.${SELECTORS.processedClass.apply}`;

    const replaceBehavior = gmcGet('filmBehaviorType') === 'Replace poster';
    log(VERBOSE, 'replaceBehavior', replaceBehavior);

    if (replaceBehavior) appliedSelector = '[data-original-img-src]';

    log(VERBOSE, 'Activity page reviews');
    document.querySelectorAll(`section.activity-row ${idMatch}`).forEach(posterElement => {
      applyFilterToFilm(posterElement, 3);

      pageUpdated = true;
    });

    log(VERBOSE, 'Activity page likes');
    document.querySelectorAll(`section.activity-row .activity-summary a[href*="${slug}"]:not(${appliedSelector})`).forEach(posterElement => {
      applyFilterToFilm(posterElement, 3);

      pageUpdated = true;
    });

    log(VERBOSE, 'New from friends');
    document.querySelectorAll(`.poster-container ${idMatch}:not(${appliedSelector})`).forEach(posterElement => {
      applyFilterToFilm(posterElement, 1);

      pageUpdated = true;
    });

    log(VERBOSE, 'Reviews');
    document.querySelectorAll(`.review-tile ${idMatch}:not(${appliedSelector})`).forEach(posterElement => {
      applyFilterToFilm(posterElement, 3);

      pageUpdated = true;
    });

    log(VERBOSE, 'Diary');
    document.querySelectorAll(`.td-film-details [data-original-img-src]${idMatch}:not(${appliedSelector})`).forEach(posterElement => {
      applyFilterToFilm(posterElement, 2);

      pageUpdated = true;
    });

    log(VERBOSE, 'Popular with friends, competitions');
    const remainingElements = document.querySelectorAll(
      `div:not(.popmenu):not(.actions-panel) ${idMatch}:not(aside [data-film-id="${id}"]):not(${appliedSelector})`,
    );
    remainingElements.forEach(posterElement => {
      applyFilterToFilm(posterElement, 0);

      pageUpdated = true;
    });

    return pageUpdated;
  }

  function addToHiddenTitles(filmMetadata) {
    log(DEBUG, 'addToHiddenTitles()');

    const filmFilter = getFilter('filmFilter');
    filmFilter.push(filmMetadata);
    log(VERBOSE, 'filmFilter', filmFilter);

    setFilter('filmFilter', filmFilter);
  }

  function applyFilters() {
    log(DEBUG, 'applyFilters()');

    let pageUpdated = false;

    const filmFilter = getFilter('filmFilter');
    log(VERBOSE, 'filmFilter', filmFilter);

    const reviewFilter = getFilter('reviewFilter');
    log(VERBOSE, 'reviewFilter', reviewFilter);

    const replaceBehavior = gmcGet('reviewBehaviorType') === 'Replace text';
    log(VERBOSE, 'replaceBehavior', replaceBehavior);

    const reviewBehaviorReplaceValue = gmcGet('reviewBehaviorReplaceValue');
    log(VERBOSE, 'reviewBehaviorReplaceValue', reviewBehaviorReplaceValue);

    const homepageFilter = getFilter('homepageFilter');
    log(VERBOSE, 'homepageFilter', homepageFilter);

    const filmPageFilter = getFilter('filmPageFilter');
    log(VERBOSE, 'filmPageFilter', filmPageFilter);

    modifyThenObserve(() => {
      filmFilter.forEach(filmMetadata => {
        const filmUpdated = addFilterToFilm(filmMetadata);
        if (filmUpdated) pageUpdated = true;
      });

      const selectorReviewElementsToFilter = [];
      if (reviewFilter.ratings) selectorReviewElementsToFilter.push(SELECTORS.filter.reviews.ratings);
      if (reviewFilter.likes) selectorReviewElementsToFilter.push(SELECTORS.filter.reviews.likes);
      if (reviewFilter.comments) selectorReviewElementsToFilter.push(SELECTORS.filter.reviews.comments);

      log(VERBOSE, 'selectorReviewElementsToFilter', selectorReviewElementsToFilter);

      if (selectorReviewElementsToFilter.length) {
        document.querySelectorAll(selectorReviewElementsToFilter.join(',')).forEach(reviewElement => {
          reviewElement.style.display = 'none';

          pageUpdated = true;
        });
      }

      const reviewsToFilterSelectors = [];
      if (reviewFilter.withSpoilers) reviewsToFilterSelectors.push(SELECTORS.filter.reviews.withSpoilers);
      if (reviewFilter.withoutRatings) reviewsToFilterSelectors.push(SELECTORS.filter.reviews.withoutRatings);

      log(VERBOSE, 'reviewsToFilterSelectors', reviewsToFilterSelectors);

      if (reviewsToFilterSelectors.length) {
        document.querySelectorAll(reviewsToFilterSelectors.join(',')).forEach(review => {
          if (replaceBehavior) {
            review.querySelector('.body-text').innerText = reviewBehaviorReplaceValue;
          }

          review.classList.add(SELECTORS.filter.reviewClass);

          pageUpdated = true;
        });
      }

      if (reviewFilter.byWordCount) {
        const reviewMinimumWordCount = getFilter('reviewMinimumWordCount');
        log(VERBOSE, 'reviewMinimumWordCount', reviewMinimumWordCount);

        document.querySelectorAll('.film-detail:not(.filterboxd-filter-review)').forEach(review => {
          const reviewText = review.querySelector('.body-text').innerText;
          log(VERBOSE, 'reviewText', reviewText);

          if (countWords(reviewText) >= reviewMinimumWordCount) return;

          if (replaceBehavior) {
            review.querySelector('.body-text').innerText = reviewBehaviorReplaceValue;
          }

          review.classList.add(SELECTORS.filter.reviewClass);

          pageUpdated = true;
        });
      }

      const sectionsToFilter = [];

      const homepageSectionsToFilter = Object.keys(homepageFilter)
        .filter(key => homepageFilter[key])
        .map(key => SELECTORS.homepageSections[key])
        .filter(Boolean);
      log(VERBOSE, 'homepageSectionToFilter', homepageSectionsToFilter);

      const filmPageSectionsToFilter = Object.keys(filmPageFilter)
        .filter(key => filmPageFilter[key])
        .map(key => SELECTORS.filmPageSections[key])
        .filter(Boolean);
      log(VERBOSE, 'filmPageSectionsToFilter', filmPageSectionsToFilter);

      sectionsToFilter.push(...homepageSectionsToFilter);
      sectionsToFilter.push(...filmPageSectionsToFilter);

      if (sectionsToFilter.length) {
        document.querySelectorAll(sectionsToFilter.join(',')).forEach(filterSection => {
          filterSection.style.display = 'none';

          pageUpdated = true;
        });
      }

      if (filmPageFilter.backdropImage) {
        document.querySelector('#content.-backdrop')?.classList.remove('-backdrop');
        pageUpdated = true;
      }
    });

    return pageUpdated;
  }

  function applyFilterToFilm(element, levelsUp = 0) {
    log(DEBUG, 'applyFilterToFilm()');

    const replaceBehavior = gmcGet('filmBehaviorType') === 'Replace poster';
    log(VERBOSE, 'replaceBehavior', replaceBehavior);

    if (replaceBehavior) {
      const filmBehaviorReplaceValue = gmcGet('filmBehaviorReplaceValue');
      log(VERBOSE, 'filmBehaviorReplaceValue', filmBehaviorReplaceValue);

      const elementImg = element.querySelector('img');
      if (!elementImg) return;

      const originalImgSrc = elementImg.src;
      if (!originalImgSrc) return;

      if (originalImgSrc === filmBehaviorReplaceValue) return;

      element.setAttribute('data-original-img-src', originalImgSrc);

      element.querySelector('img').src = filmBehaviorReplaceValue;
      element.querySelector('img').srcset = filmBehaviorReplaceValue;

      element.classList.add(SELECTORS.processedClass.apply);
      element.classList.remove(SELECTORS.processedClass.remove);
    } else {
      let target = element;

      for (let i = 0; i < levelsUp; i++) {
        if (target.parentNode) {
          target = target.parentNode;
        } else {
          break;
        }
      }

      log(VERBOSE, 'target', target);

      target.classList.add(SELECTORS.filter.filmClass);
      element.classList.add(SELECTORS.processedClass.apply);
      element.classList.remove(SELECTORS.processedClass.remove);
    }
  }

  function buildBehaviorFormRows(parentDiv, filterName, selectArrayValues, behaviorsMetadata) {
    const behaviorValue = gmcGet(`${filterName}BehaviorType`);
    log(DEBUG, 'behaviorValue', behaviorValue);

    const behaviorChange = (event) => {
      const filmBehaviorType = event.target.value;
      updateBehaviorCSSVariables(filterName, filmBehaviorType);
    };

    const behaviorFormRow = createFormRow({
      formRowStyle: `width: ${COLUMN_ONE_WIDTH};`,
      labelText: 'Behavior',
      inputValue: behaviorValue,
      inputType: 'select',
      selectArray: selectArrayValues,
      selectOnChange: behaviorChange,
    });

    parentDiv.appendChild(behaviorFormRow);

    // Fade amount
    const behaviorFadeAmount = parseInt(gmcGet(behaviorsMetadata.fade.fieldName));
    log(DEBUG, 'behaviorFadeAmount', behaviorFadeAmount);

    const fadeAmountFormRow = createFormRow({
      formRowClass: ['update-details'],
      formRowStyle: `width: ${COLUMN_TWO_WIDTH}; float: right; display: var(--filterboxd-${filterName}-behavior-fade);`,
      labelText: 'Opacity',
      inputValue: behaviorFadeAmount,
      inputType: 'number',
      inputMin: 0,
      inputMax: 100,
      inputStyle: 'width: 100px !important;',
      notes: '%',
      notesStyle: 'width: 10px; margin-left: 14px;',
    });

    parentDiv.appendChild(fadeAmountFormRow);

    // Blur amount
    const behaviorBlurAmount = parseInt(gmcGet(behaviorsMetadata.blur.fieldName));
    log(DEBUG, 'behaviorBlurAmount', behaviorBlurAmount);

    const blurAmountFormRow = createFormRow({
      formRowClass: ['update-details'],
      formRowStyle: `width: ${COLUMN_TWO_WIDTH}; float: right; display: var(--filterboxd-${filterName}-behavior-blur);`,
      labelText: 'Amount',
      inputValue: behaviorBlurAmount,
      inputType: 'number',
      inputMin: 1,
      inputStyle: 'width: 100px !important;',
      notes: 'px',
      notesStyle: 'width: 10px; margin-left: 14px;',
    });

    parentDiv.appendChild(blurAmountFormRow);

    // Replace value
    const behaviorReplaceValue = gmcGet(behaviorsMetadata.replace.fieldName);
    log(DEBUG, 'behaviorReplaceValue', behaviorReplaceValue);

    const replaceValueFormRow = createFormRow({
      formRowStyle: `width: ${COLUMN_TWO_WIDTH}; float: right; display: var(--filterboxd-${filterName}-behavior-replace);`,
      labelText: behaviorsMetadata.replace.labelText,
      inputValue: behaviorReplaceValue,
      inputType: 'text',
    });

    parentDiv.appendChild(replaceValueFormRow);

    // Custom CSS
    const behaviorCustomValue = gmcGet(behaviorsMetadata.custom.fieldName);
    log(DEBUG, 'behaviorCustomValue', behaviorCustomValue);

    const cssFormRow = createFormRow({
      formRowStyle: `width: ${COLUMN_TWO_WIDTH}; float: right; display: var(--filterboxd-${filterName}-behavior-custom);`,
      labelText: 'CSS',
      inputValue: behaviorCustomValue,
      inputType: 'text',
    });

    parentDiv.appendChild(cssFormRow);

    return [
      behaviorFormRow,
      fadeAmountFormRow,
      blurAmountFormRow,
      replaceValueFormRow,
      behaviorCustomValue,
    ];
  }

  function buildToggleSectionListItems(filterName, unorderedList, listItemMetadata) {
    log(DEBUG, 'buildListItemToggles()');

    const filter = getFilter(filterName);

    listItemMetadata.forEach(metadata => {
      const { type, name, description } = metadata;

      if (type === 'label') {
        const label = document.createElement('label');
        unorderedList.appendChild(label);

        label.innerText = description;
        label.style.cssText = 'margin: 1em 0em;';

        return;
      }

      const checked = filter[name] || false;

      const listItem = document.createElement('li');
      listItem.classList.add('option');

      const label = document.createElement('label');
      listItem.appendChild(label);

      label.classList.add('option-label', '-toggle', 'switch-control');

      const labelSpan = document.createElement('span');
      label.appendChild(labelSpan);

      labelSpan.classList.add('label');
      labelSpan.innerText = description;

      const labelInput = document.createElement('input');
      label.appendChild(labelInput);

      labelInput.classList.add('checkbox');
      labelInput.setAttribute('type', 'checkbox');
      labelInput.setAttribute('role', 'switch');
      labelInput.setAttribute('data-filter-name', filterName);
      labelInput.setAttribute('data-field-name', name);
      labelInput.checked = checked;

      const labelCheckboxSpan = document.createElement('span');
      label.appendChild(labelCheckboxSpan);

      labelCheckboxSpan.classList.add('state');

      const checkboxTrackSpan = document.createElement('span');
      labelCheckboxSpan.appendChild(checkboxTrackSpan);

      checkboxTrackSpan.classList.add('track');

      const checkboxHandleSpan = document.createElement('span');
      checkboxTrackSpan.appendChild(checkboxHandleSpan);

      checkboxHandleSpan.classList.add('handle');

      unorderedList.appendChild(listItem);
    });
  }

  function buildUserscriptLink(userscriptListItem, unorderedList) {
    log(DEBUG, 'buildUserscriptLink()');

    const userscriptLink = userscriptListItem.firstElementChild;
    userscriptListItem.onclick = (event) => {
      event.preventDefault();

      log(DEBUG, 'userscriptListItem clicked');
      log(VERBOSE, 'event', event);

      const link = event.target;
      log(VERBOSE, 'link', link);

      const id = parseInt(link.getAttribute('data-film-id'));
      const slug = link.getAttribute('data-film-slug');
      const name = link.getAttribute('data-film-name');
      const year = link.getAttribute('data-film-release-year');

      const filmMetadata = {
        id,
        slug,
        name,
        year,
      };

      const titleIsHidden = link.getAttribute('data-title-hidden') === 'true';

      modifyThenObserve(() => {
        if (titleIsHidden) {
          removeFilterFromFilm(filmMetadata);
          removeFromFilmFilter(filmMetadata);
        } else {
          addFilterToFilm(filmMetadata);
          addToHiddenTitles(filmMetadata);
        }

        const sidebarLink = document.querySelector(createId(SELECTORS.userpanel.userscriptListItemId));
        if (sidebarLink) {
          updateLinkInPopMenu(!titleIsHidden, sidebarLink);

          const popupLink = document.querySelector(`.${SELECTORS.filmPosterPopMenu.userscriptListItemClass} a`);
          if (popupLink) updateLinkInPopMenu(!titleIsHidden, popupLink);
        } else {
          updateLinkInPopMenu(!titleIsHidden, link);
        }
      });
    };

    let filmPosterSelector;

    let titleId = unorderedList.querySelector('[data-film-id]')?.getAttribute('data-film-id');
    log(DEBUG, 'titleId', titleId);

    if (titleId) {
      filmPosterSelector = `[data-film-id='${titleId}'].film-poster`;
    } else {
      const titleName = unorderedList.querySelector('[data-film-name]')?.getAttribute('data-film-name');
      log(DEBUG, 'titleName', titleName);

      if (titleName) {
        filmPosterSelector = `[data-film-name='${titleName}'].film-poster`;
      } else {
        logError('No film id or name found in unordered list');
        return;
      }
    }

    log(DEBUG, 'filmPosterSelector', filmPosterSelector);
    const filmPoster = document.querySelector(filmPosterSelector);
    log(DEBUG, 'filmPoster', filmPoster);

    if (!titleId) {
      titleId = filmPoster?.getAttribute('data-film-id');
      log(DEBUG, 'titleId', titleId);

      if (!titleId) {
        logError('No film id found on film poster');
        return;
      }
    }

    userscriptLink.setAttribute('data-film-id', titleId);

    if (!filmPoster) {
      logError('No film poster found');
      log(INFO, 'unorderedList', unorderedList);
    }

    const titleSlug =
      unorderedList.querySelector('[data-film-slug]')?.getAttribute('data-film-slug')
      || filmPoster?.getAttribute('data-film-slug');
    log(DEBUG, 'titleSlug', titleSlug);

    if (titleSlug) userscriptLink.setAttribute('data-film-slug', titleSlug);

    const titleName = unorderedList.querySelector('[data-film-name]')?.getAttribute('data-film-name');
    log(DEBUG, 'titleName', titleName);
    if (titleName) userscriptLink.setAttribute('data-film-name', titleName);

    // Title year isn't present in the pop menu list, so retrieve it from the film poster
    const titleYear =
      filmPoster?.querySelector('.has-menu')?.getAttribute('data-original-title')?.match(/\((\d{4})\)/)?.[1]
      || document.querySelector('div.releaseyear a')?.innerText
      || document.querySelector('small.metadata a')?.innerText
      || filmPoster?.querySelector('.frame-title')?.innerText?.match(/\((\d{4})\)/)?.[1];
    log(DEBUG, 'titleYear', titleYear);
    if (titleYear) userscriptLink.setAttribute('data-film-release-year', titleYear);

    const filmFilter = getFilter('filmFilter');
    log(DEBUG, 'filmFilter', filmFilter);

    const titleIsHidden = filmFilter.some(
      filteredFilm => filteredFilm.id?.toString() === titleId?.toString(),
    );
    log(DEBUG, 'titleIsHidden', titleIsHidden);

    updateLinkInPopMenu(titleIsHidden, userscriptLink);

    userscriptLink.removeAttribute('class');

    return userscriptListItem;
  }

  function buildToggleSection(parentElement, sectionTitle, filerName, sectionMetadata) {
    log(DEBUG, 'buildToggleSection()');

    const formRowDiv = document.createElement('div');
    parentElement.appendChild(formRowDiv);

    formRowDiv.style.cssText = 'margin-bottom: 40px;';

    const sectionHeader = document.createElement('h3');
    formRowDiv.append(sectionHeader);

    sectionHeader.classList.add('title-3');
    sectionHeader.style.cssText = 'margin-top: 0em;';
    sectionHeader.innerText = sectionTitle;

    const unorderedList = document.createElement('ul');
    formRowDiv.append(unorderedList);

    unorderedList.classList.add('options-list', '-toggle-list', 'js-toggle-list');

    buildToggleSectionListItems(
      filerName,
      unorderedList,
      sectionMetadata,
    );

    let formColumnDiv = document.createElement('div');
    formRowDiv.appendChild(formColumnDiv);

    formColumnDiv.classList.add('form-columns', '-cols2');
  }

  function createFormRow({
    formRowClass = [],
    formRowStyle = '',
    labelText = '',
    helpText = '',
    inputValue = '',
    inputType = 'text',
    inputMin = null,
    inputMax = null,
    inputStyle = '',
    selectArray = [],
    selectOnChange = () => {},
    notes = '',
    notesStyle = '',
  }) {
    log(DEBUG, 'createFormRow()');

    const formRow = document.createElement('div');
    formRow.classList.add('form-row');
    formRow.style.cssText = formRowStyle;
    formRow.classList.add(...formRowClass);

    const selectList = document.createElement('div');
    formRow.appendChild(selectList);

    selectList.classList.add('select-list');

    const label = document.createElement('label');
    selectList.appendChild(label);

    label.classList.add('label');
    label.textContent = labelText;

    if (helpText) {
      const helpIcon = document.createElement('span');
      label.appendChild(helpIcon);

      helpIcon.classList.add('s', 'icon-14', 'icon-tip', 'tooltip');
      helpIcon.setAttribute('target', '_blank');
      helpIcon.setAttribute('data-html', 'true');
      helpIcon.setAttribute('data-original-title', helpText);
      helpIcon.innerHTML = '<span class="icon"></span>(Help)';
    }

    const inputDiv = document.createElement('div');
    selectList.appendChild(inputDiv);

    inputDiv.classList.add('input');
    inputDiv.style.cssText = inputStyle;

    if (inputType === 'select') {
      const select = document.createElement('select');
      inputDiv.appendChild(select);

      select.classList.add('select');

      selectArray.forEach(option => {
        const optionElement = document.createElement('option');
        select.appendChild(optionElement);

        optionElement.value = option;
        optionElement.textContent = option;

        if (option === inputValue) optionElement.setAttribute('selected', 'selected');
      });

      select.onchange = selectOnChange;
    } else if (['text', 'number'].includes(inputType)) {
      const input = document.createElement('input');
      inputDiv.appendChild(input);

      input.type = inputType;
      input.classList.add('field');
      input.value = inputValue;

      if (inputMin !== null) input.min = inputMin;
      if (inputMax !== null) input.max = inputMax;
    }

    if (notes) {
      const notesElement = document.createElement('p');
      selectList.appendChild(notesElement);

      notesElement.classList.add('notes');
      notesElement.style.cssText = notesStyle;
      notesElement.textContent = notes;
    }

    return formRow;
  }

  function displaySavedBadge() {
    log(DEBUG, 'displaySavedBadge()');

    const savedBadge = document.querySelector(`.${SELECTORS.settings.savedBadgeClass}`);

    savedBadge.classList.remove('hidden');
    savedBadge.classList.add('fade');

    setTimeout(() => {
      savedBadge.classList.add('fade-out');
    }, 2000);

    setTimeout(() => {
      savedBadge.classList.remove('fade', 'fade-out');
      savedBadge.classList.add('hidden');
    }, 3000);
  }

  function getFilter(filterName) {
    log(DEBUG, 'getFilter()');

    return JSON.parse(gmcGet(filterName));
  }

  function getFilterBehaviorStyle(filterName) {
    log(DEBUG, 'getFilterBehaviorStyle()');

    let behaviorStyle;
    let behaviorType = gmcGet(`${filterName}BehaviorType`);
    log(DEBUG, 'behaviorType', behaviorType);

    const behaviorFadeAmount = gmcGet(`${filterName}BehaviorFadeAmount`);
    log(VERBOSE, 'behaviorFadeAmount', behaviorFadeAmount);

    const behaviorBlurAmount = gmcGet(`${filterName}BehaviorBlurAmount`);
    log(VERBOSE, 'behaviorBlurAmount', behaviorBlurAmount);

    const behaviorCustomValue = gmcGet(`${filterName}BehaviorCustomValue`);
    log(VERBOSE, 'behaviorCustomValue', behaviorCustomValue);

    switch (behaviorType) {
      case 'Remove':
        behaviorStyle = 'display: none !important;';
        break;
      case 'Fade':
        behaviorStyle = `opacity: ${behaviorFadeAmount}%`;
        break;
      case 'Blur':
        behaviorStyle = `filter: blur(${behaviorBlurAmount}px)`;
        break;
      case 'Custom':
        behaviorStyle = behaviorCustomValue;
        break;
    }

    updateBehaviorCSSVariables(filterName, behaviorType);

    return behaviorStyle;
  }

  function gmcInitialized() {
    log(DEBUG, 'gmcInitialized()');
    log(QUIET, 'Running');

    GMC.css.basic = '';

    if (RESET_DATA) {
      log(QUIET, 'Resetting GMC');

      for (const [key, field] of Object.entries(GMC_FIELDS)) {
        const value = field.default;
        gmcSet(key, value);
      }

      log(QUIET, 'GMC reset');
    }

    let userscriptStyle = document.createElement('style');
    userscriptStyle.setAttribute('id', 'filterboxd-style');

    const filmBehaviorStyle = getFilterBehaviorStyle('film');
    log(VERBOSE, 'filmBehaviorStyle', filmBehaviorStyle);

    const reviewBehaviorStyle = getFilterBehaviorStyle('review');
    log(VERBOSE, 'reviewBehaviorStyle', reviewBehaviorStyle);

    userscriptStyle.textContent += `
      .${SELECTORS.filter.filmClass}
      {
        ${filmBehaviorStyle}
      }

      .${SELECTORS.filter.reviewClass}
      {
        ${reviewBehaviorStyle}
      }

      .${SELECTORS.settings.filteredTitleLinkClass}
      {
        cursor: pointer;
        margin-right: 0.3rem !important;
      }

      .${SELECTORS.settings.filteredTitleLinkClass}:hover
      {
        background: #303840;
        color: #def;
      }

      .${SELECTORS.settings.removePendingClass}
      {
        outline: 1px dashed #ee7000;
        outline-offset: -1px;
      }

      .hidden {
        visibility: hidden;
      }

      .fade {
        opacity: 1;
        transition: opacity 1s ease-out;
      }

      .fade.fade-out {
        opacity: 0;
      }
    `;
    document.body.appendChild(userscriptStyle);

    const onSettingsPage = window.location.href.includes('/settings/');
    log(VERBOSE, 'onSettingsPage', onSettingsPage);

    if (onSettingsPage) {
      maybeAddConfigurationToSettings();
    }
    else {
      applyFilters();
      startObserving();
    }
  }

  function trySelectFilterboxdTab() {
    const maxAttempts = 10;
    let attempts = 0;
    let successes = 0;

    log(DEBUG, `Attempting to select Filterboxd tab (attempt ${attempts + 1}/${maxAttempts})`);

    const tabLink = document.querySelector('a[data-id="filterboxd"]');
    if (!tabLink) {
      log(DEBUG, 'Filterboxd tab link not found yet');
      if (attempts < maxAttempts) {
        attempts++;
        setTimeout(trySelectFilterboxdTab, 100);
      } else {
        logError('Failed to find Filterboxd tab after maximum attempts');
      }
      return;
    }

    try {
      tabLink.click();

      setTimeout(() => {
        const tabSelected = document.querySelector('li.selected:has(a[data-id="filterboxd"])') !== null;
        if (tabSelected) {
          log(DEBUG, 'Filterboxd tab selected successfully');
          successes++;

          // There's a race condition between the click and the "Profile" tab being loaded and selected
          if (successes < 2) setTimeout(trySelectFilterboxdTab, 500);
        } else {
          log(DEBUG, 'Click didn\'t select the tab properly');
          if (attempts < maxAttempts) {
            attempts++;
            setTimeout(trySelectFilterboxdTab, 100);
          } else {
            logError('Failed to select Filterboxd tab after maximum attempts');
          }
        }
      }, 50);
    } catch (error) {
      logError('Error selecting Filterboxd tab', error);
      if (attempts < maxAttempts) {
        attempts++;
        setTimeout(trySelectFilterboxdTab, 100);
      }
    }
  }

  function maybeAddConfigurationToSettings() {
    log(DEBUG, 'maybeAddConfigurationToSettings()');

    const userscriptTabId = 'tab-filterboxd';
    const configurationExists = document.querySelector(createId(userscriptTabId));
    log(VERBOSE, 'configurationExists', configurationExists);

    if (configurationExists) {
      log(DEBUG, 'Filterboxd configuration tab is present');
      return;
    }

    const userscriptTabDiv = document.createElement('div');

    const settingsTabbedContent = document.querySelector(SELECTORS.settings.tabbedContentId);
    settingsTabbedContent.appendChild(userscriptTabDiv);

    userscriptTabDiv.setAttribute('id', userscriptTabId);
    userscriptTabDiv.classList.add('tabbed-content-block');

    const tabTitle = document.createElement('h2');
    userscriptTabDiv.append(tabTitle);

    tabTitle.style.cssText = 'margin-bottom: 1em;';
    tabTitle.innerText = 'Filterboxd';

    const tabPrimaryColumn = document.createElement('div');
    userscriptTabDiv.append(tabPrimaryColumn);

    tabPrimaryColumn.classList.add('col-10', 'overflow');

    const asideColumn = document.createElement('aside');
    userscriptTabDiv.append(asideColumn);

    asideColumn.classList.add('col-12', 'overflow', 'col-right', 'js-hide-in-app');

    // Filter film page
    const filmPageFilterMetadata = [
      {
        type: 'toggle',
        name: 'backdropImage',
        description: 'Remove backdrop image',
      },
      {
        type: 'label',
        description: 'Left column',
      },
      {
        type: 'toggle',
        name: 'poster',
        description: 'Remove poster',
      },
      {
        type: 'toggle',
        name: 'stats',
        description: 'Remove Letterboxd stats',
      },
      {
        type: 'toggle',
        name: 'whereToWatch',
        description: 'Remove "Where to watch" section',
      },
      {
        type: 'label',
        description: 'Right column',
      },
      {
        type: 'toggle',
        name: 'userActionsPanel',
        description: 'Remove user actions panel',
      },
      {
        type: 'toggle',
        name: 'ratings',
        description: 'Remove "Ratings" section',
      },
      {
        type: 'label',
        description: 'Middle column',
      },
      {
        type: 'toggle',
        name: 'releaseYear',
        description: 'Remove release year text',
      },
      {
        type: 'toggle',
        name: 'director',
        description: 'Remove director text',
      },
      {
        type: 'toggle',
        name: 'tagline',
        description: 'Remove tagline text',
      },
      {
        type: 'toggle',
        name: 'description',
        description: 'Remove description text',
      },
      {
        type: 'toggle',
        name: 'castTab',
        description: 'Remove "Cast" tab',
      },
      {
        type: 'toggle',
        name: 'crewTab',
        description: 'Remove "Crew" tab',
      },
      {
        type: 'toggle',
        name: 'detailsTab',
        description: 'Remove "Details" tab',
      },
      {
        type: 'toggle',
        name: 'genresTab',
        description: 'Remove "Genres" tab',
      },
      {
        type: 'toggle',
        name: 'releasesTab',
        description: 'Remove "Releases" tab',
      },
      {
        type: 'toggle',
        name: 'activityFromFriends',
        description: 'Remove "Activity from friends" section',
      },
      {
        type: 'toggle',
        name: 'filmNews',
        description: 'Remove HQ film news section',
      },
      {
        type: 'toggle',
        name: 'reviewsFromFriends',
        description: 'Remove "Reviews from friends" section',
      },
      {
        type: 'toggle',
        name: 'popularReviews',
        description: 'Remove "Popular reviews" section',
      },
      {
        type: 'toggle',
        name: 'recentReviews',
        description: 'Remove "Recent reviews" section',
      },
      {
        type: 'toggle',
        name: 'relatedFilms',
        description: 'Remove "Related films" section',
      },
      {
        type: 'toggle',
        name: 'similarFilms',
        description: 'Remove "Similar films" section',
      },
      {
        type: 'toggle',
        name: 'mentionedBy',
        description: 'Remove "Mentioned by" section',
      },
      {
        type: 'toggle',
        name: 'popularLists',
        description: 'Remove "Popular lists" section',
      },
    ];

    buildToggleSection(
      asideColumn,
      'Film Page Filter',
      'filmPageFilter',
      filmPageFilterMetadata,
    );

    // Advanced Options
    const formRowDiv = document.createElement('div');
    asideColumn.appendChild(formRowDiv);

    formRowDiv.style.cssText = 'margin-bottom: 40px;';

    const sectionHeader = document.createElement('h3');
    formRowDiv.append(sectionHeader);

    sectionHeader.classList.add('title-3');
    sectionHeader.style.cssText = 'margin-top: 0em;';
    sectionHeader.innerText = 'Advanced Options';

    const logLevelValue = gmcGet('logLevel');
    log(DEBUG, 'logLevelValue', logLevelValue);

    const logLevelFormRow = createFormRow({
      formRowClass: ['update-details'],
      formRowStyle: `width: ${COLUMN_ONE_WIDTH};`,
      labelText: 'Log level ',
      helpText: 'Determines how much logging<br /> is visible in the browser console',
      inputValue: logLevelValue,
      inputType: 'select',
      selectArray: LOG_LEVELS.options,
    });

    formRowDiv.appendChild(logLevelFormRow);

    const mutationsDiv = document.createElement('div');
    mutationsDiv.style.cssText = 'display: flex; align-items: center;';
    formRowDiv.append(mutationsDiv);

    const maxActiveMutationsValue = gmcGet('maxActiveMutations');
    log(DEBUG, 'maxActiveMutationsValue', maxActiveMutationsValue);

    const maxActiveMutationsFormRow = createFormRow({
      formRowClass: ['update-details'],
      formRowStyle: `width: ${COLUMN_HALF_WIDTH};`,
      labelText: 'Max active mutations ',
      helpText: 'Safety limit that halts execution<br /> when a certain number of modifications<br /> are performed by the script',
      inputValue: maxActiveMutationsValue,
      inputType: 'number',
      inputMin: 1,
      inputStyle: 'width: 100px !important;',
    });

    mutationsDiv.appendChild(maxActiveMutationsFormRow);

    const maxIdleMutationsValue = gmcGet('maxIdleMutations');
    log(DEBUG, 'maxIdleMutationsValue', maxIdleMutationsValue);

    const maxIdleMutationsFormRow = createFormRow({
      formRowClass: ['update-details'],
      formRowStyle: `width: ${COLUMN_HALF_WIDTH}; float: right;`,
      labelText: 'Max idle mutations ',
      helpText: 'Safety limit that halts execution<br /> when a certain number of modifications<br /> are performed by Letterboxd<br /> that did not result in modifications<br /> from the script',
      inputValue: maxIdleMutationsValue,
      inputType: 'number',
      inputMin: 1,
      inputStyle: 'width: 100px !important;',
    });

    mutationsDiv.appendChild(maxIdleMutationsFormRow);

    let formColumnDiv = document.createElement('div');
    formRowDiv.appendChild(formColumnDiv);

    formColumnDiv.classList.add('form-columns', '-cols2');

    // Filter films
    const favoriteFilmsDiv = document.querySelector(SELECTORS.settings.favoriteFilms);
    const filteredFilmsDiv = favoriteFilmsDiv.cloneNode(true);
    tabPrimaryColumn.appendChild(filteredFilmsDiv);

    filteredFilmsDiv.style.cssText = 'margin-bottom: 20px;';

    const posterList = filteredFilmsDiv.querySelector(SELECTORS.settings.posterList);
    posterList.remove();

    filteredFilmsDiv.querySelector(SELECTORS.settings.subtitle).innerText = 'Films Filter';
    filteredFilmsDiv.querySelector(SELECTORS.settings.note).innerText =
      'Right click to mark for removal.';

    let hiddenTitlesDiv = document.createElement('div');
    filteredFilmsDiv.append(hiddenTitlesDiv);

    const hiddenTitlesParagraph = document.createElement('p');
    hiddenTitlesDiv.appendChild(hiddenTitlesParagraph);

    hiddenTitlesDiv.classList.add('text-sluglist');

    const filmFilter = getFilter('filmFilter');
    log(VERBOSE, 'filmFilter', filmFilter);

    filmFilter.forEach((filteredFilm, index) => {
      log(VERBOSE, 'filteredFilm', filteredFilm);

      let filteredTitleLink = document.createElement('a');
      hiddenTitlesParagraph.appendChild(filteredTitleLink);

      if (filteredFilm.slug) filteredTitleLink.href= `/film/${filteredFilm.slug}`;

      filteredTitleLink.classList.add(
        'text-slug',
        SELECTORS.processedClass.apply,
        SELECTORS.settings.filteredTitleLinkClass,
      );
      filteredTitleLink.setAttribute('data-film-id', filteredFilm.id);
      filteredTitleLink.setAttribute('index', index);

      let titleLinkText = filteredFilm.name;
      if (['', null, undefined].includes(filteredFilm.name)) {
        log(INFO, 'filteredFilm has no name; marking as broken', filteredFilm);
        titleLinkText = 'Broken, please remove';
      }

      if (!['', null, undefined].includes(filteredFilm.year)) {
        titleLinkText += ` (${filteredFilm.year})`;
      }
      filteredTitleLink.innerText = titleLinkText;

      filteredTitleLink.oncontextmenu = (event) => {
        event.preventDefault();

        filteredTitleLink.classList.toggle(SELECTORS.settings.removePendingClass);
      };
    });

    let formColumnsDiv = document.createElement('div');
    filteredFilmsDiv.appendChild(formColumnsDiv);

    formColumnsDiv.classList.add('form-columns', '-cols2');

    // Filter films behavior
    const filmBehaviorsMetadata = {
      fade: {
        fieldName: 'filmBehaviorFadeAmount',
      },
      blur: {
        fieldName: 'filmBehaviorBlurAmount',
      },
      replace: {
        fieldName: 'filmBehaviorReplaceValue',
        labelText: 'Direct image URL',
      },
      custom: {
        fieldName: 'filmBehaviorCustomValue',
      },
    };
    const filmFormRows = buildBehaviorFormRows(
      formColumnsDiv,
      'film',
      FILM_BEHAVIORS,
      filmBehaviorsMetadata,
    );

    const clearDiv = filteredFilmsDiv.querySelector(SELECTORS.settings.clear);
    clearDiv.remove();

    // Filter reviews
    const filteredReviewsFormRow = document.createElement('div');
    tabPrimaryColumn.append(filteredReviewsFormRow);

    filteredReviewsFormRow.classList.add('form-row');

    const filteredReviewsTitle = document.createElement('h3');
    filteredReviewsFormRow.append(filteredReviewsTitle);

    filteredReviewsTitle.classList.add('title-3');
    filteredReviewsTitle.style.cssText = 'margin-top: 0em;';
    filteredReviewsTitle.innerText = 'Reviews Filter';

    // First unordered list
    const filteredReviewsUnorderedListFirst = document.createElement('ul');
    filteredReviewsFormRow.append(filteredReviewsUnorderedListFirst);

    filteredReviewsUnorderedListFirst.classList.add('options-list', '-toggle-list', 'js-toggle-list');
    filteredReviewsUnorderedListFirst.style.cssText += 'margin-bottom: 5px;';

    const reviewFilterItemsFirst = [
      {
        name: 'ratings',
        description: 'Remove ratings from reviews',
      },
      {
        name: 'likes',
        description: 'Remove likes from reviews',
      },
      {
        name: 'comments',
        description: 'Remove comments from reviews',
      },
      {
        name: 'byWordCount',
        description: 'Filter reviews by minimum word count',
      },
    ];

    buildToggleSectionListItems(
      'reviewFilter',
      filteredReviewsUnorderedListFirst,
      reviewFilterItemsFirst,
    );

    // Minium word count
    let minimumWordCountDiv = document.createElement('div');
    filteredReviewsFormRow.appendChild(minimumWordCountDiv);

    minimumWordCountDiv.classList.add('form-columns', '-cols2');

    const minimumWordCountValue = gmcGet('reviewMinimumWordCount');
    log(DEBUG, 'minimumWordCountValue', minimumWordCountValue);

    const minimumWordCountFormRow = createFormRow({
      formRowClass: ['update-details'],
      formRowStyle: `width: ${COLUMN_TWO_WIDTH}; float: right; margin-bottom: 10px;`,
      inputValue: minimumWordCountValue,
      inputType: 'number',
      inputStyle: 'width: 100px !important;',
      notes: 'words',
      notesStyle: 'width: 10px; margin-left: 14px;',
    });

    minimumWordCountDiv.appendChild(minimumWordCountFormRow);

    // Second unordered list
    const filteredReviewsUnorderedListSecond = document.createElement('ul');
    filteredReviewsFormRow.append(filteredReviewsUnorderedListSecond);

    filteredReviewsUnorderedListSecond.classList.add('options-list', '-toggle-list', 'js-toggle-list');
    filteredReviewsUnorderedListSecond.style.cssText += 'margin: 0 0 1.53846154rem;';

    const reviewFilterItemsSecond = [
      {
        name: 'withSpoilers',
        description: 'Filter reviews that contain spoilers',
      },
      {
        name: 'withoutRatings',
        description: 'Filter reviews that don\'t have ratings',
      },
    ];

    buildToggleSectionListItems(
      'reviewFilter',
      filteredReviewsUnorderedListSecond,
      reviewFilterItemsSecond,
    );

    let reviewColumnsDiv = document.createElement('div');
    filteredReviewsFormRow.appendChild(reviewColumnsDiv);

    reviewColumnsDiv.classList.add('form-columns', '-cols2');

    const reviewBehaviorsMetadata = {
      fade: {
        fieldName: 'reviewBehaviorFadeAmount',
      },
      blur: {
        fieldName: 'reviewBehaviorBlurAmount',
      },
      replace: {
        fieldName: 'reviewBehaviorReplaceValue',
        labelText: 'Text',
      },
      custom: {
        fieldName: 'reviewBehaviorCustomValue',
      },
    };
    const reviewFormRows = buildBehaviorFormRows(
      reviewColumnsDiv,
      'review',
      REVIEW_BEHAVIORS,
      reviewBehaviorsMetadata,
    );

    // Filter homepage
    const homepageFilterMetadata = [
      {
        name: 'friendsHaveBeenWatching',
        description: 'Remove "Here\'s what your friends have been watching..." title text',
      },
      {
        name: 'newFromFriends',
        description: 'Remove "New from friends" films section',
      },
      {
        name: 'popularWithFriends',
        description: 'Remove "Popular with friends" section',
      },
      {
        name: 'discoveryStream',
        description: 'Remove discovery section (e.g. festivals, competitions)',
      },
      {
        name: 'latestNews',
        description: 'Remove "Latest news" section',
      },
      {
        name: 'popularReviewsWithFriends',
        description: 'Remove "Popular reviews with friends" section',
      },
      {
        name: 'newListsFromFriends',
        description: 'Remove "New from friends" lists section',
      },
      {
        name: 'popularLists',
        description: 'Remove "Popular lists" section',
      },
      {
        name: 'recentStories',
        description: 'Remove "Recent stories" section',
      },
      {
        name: 'recentShowdowns',
        description: 'Remove "Recent showdowns" section',
      },
      {
        name: 'recentNews',
        description: 'Remove "Recent news" section',
      },
    ];

    buildToggleSection(
      tabPrimaryColumn,
      'Homepage Filter',
      'homepageFilter',
      homepageFilterMetadata,
    );

    // Save changes
    let buttonsRowDiv = document.createElement('div');
    userscriptTabDiv.appendChild(buttonsRowDiv);

    buttonsRowDiv.style.cssText = 'display: flex; align-items: center;';
    buttonsRowDiv.classList.add('buttons', 'clear', 'row');

    let saveInput = document.createElement('input');
    buttonsRowDiv.appendChild(saveInput);

    saveInput.classList.add('button', 'button-action');
    saveInput.setAttribute('value', 'Save Changes');
    saveInput.setAttribute('type', 'submit');
    saveInput.onclick = (event) => {
      event.preventDefault();

      const pendingRemovals = hiddenTitlesParagraph.querySelectorAll(`.${SELECTORS.settings.removePendingClass}`);
      pendingRemovals.forEach(removalLink => {
        const id = parseInt(removalLink.getAttribute('data-film-id'));
        const filteredFilm = filmFilter.find(filteredFilm => filteredFilm.id === id);

        if (filteredFilm) {
          removeFilterFromFilm(filteredFilm);
          removeFromFilmFilter(filteredFilm);
        } else {
          const index = removalLink.getAttribute('index');
          removeFromFilmFilter(null, index);
        }
        removalLink.remove();
      });

      const minimumWordCountValue = parseInt(minimumWordCountFormRow.querySelector('input').value || 0);
      log(DEBUG, 'minimumWordCountValue', minimumWordCountValue);

      gmcSet('reviewMinimumWordCount', minimumWordCountValue);

      saveBehaviorSettings('film', filmFormRows);
      saveBehaviorSettings('review', reviewFormRows);

      const inputToggles = userscriptTabDiv.querySelectorAll('input[type="checkbox"]');
      inputToggles.forEach(inputToggle => {
        const filterName = inputToggle.getAttribute('data-filter-name');
        const filter = getFilter(filterName);

        const fieldName = inputToggle.getAttribute('data-field-name');
        const checked = inputToggle.checked;

        filter[fieldName] = checked;
        setFilter(filterName, filter);
      });

      const logLevel = logLevelFormRow.querySelector('select').value;
      gmcSet('logLevel', logLevel);

      const maxIdleMutationsValue = parseInt(maxIdleMutationsFormRow.querySelector('input').value || 0);
      log(DEBUG, 'maxIdleMutationsValue', maxIdleMutationsValue);

      gmcSet('maxIdleMutations', maxIdleMutationsValue);

      const maxActiveMutationsValue = parseInt(maxActiveMutationsFormRow.querySelector('input').value || 0);
      log(DEBUG, 'maxActiveMutationsValue', maxActiveMutationsValue);

      gmcSet('maxActiveMutations', maxActiveMutationsValue);

      gmcSave();

      displaySavedBadge();
    };

    let checkContainerDiv = document.createElement('div');
    buttonsRowDiv.appendChild(checkContainerDiv);

    checkContainerDiv.classList.add('check-container');
    checkContainerDiv.style.cssText = 'margin-left: 10px;';

    let usernameAvailableParagraph = document.createElement('p');
    checkContainerDiv.appendChild(usernameAvailableParagraph);

    usernameAvailableParagraph.classList.add(
      'username-available',
      'has-icon',
      'hidden',
      SELECTORS.settings.savedBadgeClass,
    );
    usernameAvailableParagraph.style.cssText = 'float: left;';

    let iconSpan = document.createElement('span');
    usernameAvailableParagraph.appendChild(iconSpan);

    iconSpan.classList.add('icon');

    const savedText = document.createTextNode('Saved');
    usernameAvailableParagraph.appendChild(savedText);

    const settingsSubNav = document.querySelector(SELECTORS.settings.subNav);

    const userscriptSubNabListItem = document.createElement('li');
    settingsSubNav.appendChild(userscriptSubNabListItem);

    const userscriptSubNabLink = document.createElement('a');
    userscriptSubNabListItem.appendChild(userscriptSubNabLink);

    const userscriptSettingsLink = '/settings/?filterboxd';
    userscriptSubNabLink.setAttribute('href', userscriptSettingsLink);
    userscriptSubNabLink.setAttribute('data-id', 'filterboxd');
    userscriptSubNabLink.innerText = 'Filterboxd';
    userscriptSubNabLink.onclick = (event) => {
      event.preventDefault();

      Array.from(settingsSubNav.children).forEach(listItem => {
        const link = listItem.querySelector('a');

        if (link.getAttribute('data-id') === 'filterboxd') {
          listItem.classList.add('selected');
        } else {
          listItem.classList.remove('selected');
        }
      });

      Array.from(settingsTabbedContent.children).forEach(tab => {
        if (!tab.id) return;

        const display = tab.id === userscriptTabId ? 'block' : 'none';
        tab.style.cssText = `display: ${display};`;
      });

      window.history.replaceState(null, '', `https://letterboxd.com${userscriptSettingsLink}`);
    };

    Array.from(settingsSubNav.children).forEach(listItem => {
      listItem.onclick = (event) => {
        const link = event.target;
        if (link.getAttribute('href') === userscriptSettingsLink) return;

        userscriptSubNabListItem.classList.remove('selected');
        userscriptTabDiv.style.display = 'none';
      };
    });
  }

  function maybeAddListItemToSidebar() {
    log(DEBUG, 'maybeAddListItemToSidebar()');

    const isListPage = document.querySelector('body.list-page');
    if (isListPage) return;

    const userscriptListItemFound = document.querySelector(createId(SELECTORS.userpanel.userscriptListItemId));
    if (userscriptListItemFound) {
      log(DEBUG, 'Userscript list item already exists');
      return false;
    }

    const userpanel = document.querySelector(SELECTORS.userpanel.self);

    if (!userpanel) {
      log(INFO, 'Userpanel not found');
      return false;
    }

    const secondLastListItem = userpanel.querySelector('li:nth-last-child(3)');
    if (!secondLastListItem ) {
      log(INFO, 'Second last list item not found');
      return false;
    }

    if (secondLastListItem.classList.contains('loading-csi')) {
      log(INFO, 'Second last list item is loading');
      return false;
    }

    let userscriptListItem = document.createElement('li');
    const userscriptListLink = document.createElement('a');
    userscriptListItem.appendChild(userscriptListLink);
    userscriptListLink.href = '#';

    userscriptListItem.setAttribute('id', SELECTORS.userpanel.userscriptListItemId);

    const unorderedList = userpanel.querySelector('ul');
    userscriptListItem = buildUserscriptLink(userscriptListItem, unorderedList);

    // Text: "Go PATRON to change images"
    const upsellLink = userpanel.querySelector('[href="/pro/"]');

    // If the upsell link is present, insert above
    // Otherwise, inset above "Share"
    const insertBeforeElementIndex = upsellLink ? 2 : 1;
    const insertBeforeElement = userpanel.querySelector(`li:nth-last-of-type(${insertBeforeElementIndex})`);

    secondLastListItem.parentNode.insertBefore(userscriptListItem, insertBeforeElement);

    return true;
  }

  function removeFilterFromElement(element, levelsUp = 0) {
    log(DEBUG, 'removeFilterFromElement()');

    const replaceBehavior = gmcGet('filmBehaviorType') === 'Replace poster';
    log(VERBOSE, 'replaceBehavior', replaceBehavior);

    if (replaceBehavior) {
      const originalImgSrc = element.getAttribute('data-original-img-src');
      if (!originalImgSrc) {
        log(DEBUG, 'data-original-img-src attribute not found', element);
        return;
      }

      element.querySelector('img').src = originalImgSrc;
      element.querySelector('img').srcset = originalImgSrc;

      element.removeAttribute('data-original-img-src');
      element.classList.add(SELECTORS.processedClass.remove);
      element.classList.remove(SELECTORS.processedClass.apply);
    } else {
      let target = element;

      for (let i = 0; i < levelsUp; i++) {
        if (target.parentNode) {
          target = target.parentNode;
        } else {
          break;
        }
      }

      log(VERBOSE, 'target', target);

      target.classList.remove(SELECTORS.filter.filmClass);
      element.classList.add(SELECTORS.processedClass.remove);
      element.classList.remove(SELECTORS.processedClass.apply);
    }
  }

  function removeFromFilmFilter(filmMetadata, index) {
    log(DEBUG, 'removeFromFilmFilter()');

    let filmFilter = getFilter('filmFilter');
    if (filmMetadata) {
      filmFilter = filmFilter.filter(filteredFilm => filteredFilm.id !== filmMetadata.id);
    } else {
      filmFilter.splice(index, 1);
    }

    setFilter('filmFilter', filmFilter);
  }

  function removeFilterFromFilm({ id, slug }) {
    log(DEBUG, 'removeFilterFromFilm()');

    const idMatch = `[data-film-id="${id}"]`;
    let removedSelector = `.${SELECTORS.processedClass.remove}`;

    log(VERBOSE, 'Activity page reviews');
    document.querySelectorAll(`section.activity-row ${idMatch}`).forEach(posterElement => {
      removeFilterFromElement(posterElement, 3);
    });

    log(VERBOSE, 'Activity page likes');
    document.querySelectorAll(`section.activity-row .activity-summary a[href*="${slug}"]:not(${removedSelector})`).forEach(posterElement => {
      removeFilterFromElement(posterElement, 3);
    });

    log(VERBOSE, 'New from friends');
    document.querySelectorAll(`.poster-container ${idMatch}:not(${removedSelector})`).forEach(posterElement => {
      removeFilterFromElement(posterElement, 1);
    });

    log(VERBOSE, 'Reviews');
    document.querySelectorAll(`.review-tile ${idMatch}:not(${removedSelector})`).forEach(posterElement => {
      removeFilterFromElement(posterElement, 3);
    });

    log(VERBOSE, 'Diary');
    document.querySelectorAll(`.td-film-details [data-original-img-src]${idMatch}:not(${removedSelector})`).forEach(posterElement => {
      removeFilterFromElement(posterElement, 2);
    });

    log(VERBOSE, 'Popular with friends, competitions');
    const remainingElements = document.querySelectorAll(
      `div:not(.popmenu):not(.actions-panel) ${idMatch}:not(aside [data-film-id="${id}"]):not(#backdrop):not(${removedSelector})`,
    );
    remainingElements.forEach(posterElement => {
      removeFilterFromElement(posterElement, 0);
    });
  }

  function saveBehaviorSettings(filterName, formRows) {
    log(DEBUG, 'saveBehaviorSettings()');

    const behaviorType = formRows[0].querySelector('select').value;
    log(DEBUG, 'behaviorType', behaviorType);

    gmcSet(`${filterName}BehaviorType`, behaviorType);

    updateBehaviorCSSVariables(filterName, behaviorType);

    if (behaviorType === 'Fade') {
      const behaviorFadeAmount = formRows[1].querySelector('input').value;
      log(DEBUG, 'behaviorFadeAmount', behaviorFadeAmount);

      gmcSet(`${filterName}BehaviorFadeAmount`, behaviorFadeAmount);
    } else if (behaviorType === 'Blur') {
      const behaviorBlurAmount = formRows[2].querySelector('input').value;
      log(DEBUG, 'behaviorBlurAmount', behaviorBlurAmount);

      gmcSet(`${filterName}BehaviorBlurAmount`, behaviorBlurAmount);
    } else if (behaviorType.includes('Replace')) {
      const behaviorReplaceValue = formRows[3].querySelector('input').value;
      log(DEBUG, 'behaviorReplaceValue', behaviorReplaceValue);

      gmcSet(`${filterName}BehaviorReplaceValue`, behaviorReplaceValue);
    } else if (behaviorType === 'Custom') {
      const behaviorCustomValue = formRows[4].querySelector('input').value;
      log(DEBUG, 'behaviorCustomValue', behaviorCustomValue);

      gmcSet(`${filterName}BehaviorCustomValue`, behaviorCustomValue);
    }
  }

  function setFilter(filterName, filterValue) {
    log(DEBUG, 'setFilter()');

    gmcSet(filterName, JSON.stringify(filterValue));
    return gmcSave();
  }

  function updateBehaviorCSSVariables(filterName, behaviorType) {
    log(DEBUG, 'updateBehaviorTypeVariable()');
    log(DEBUG, 'behaviorType', behaviorType);

    const fadeValue = behaviorType === 'Fade' ? 'block' : 'none';
    document.documentElement.style.setProperty(
      `--filterboxd-${filterName}-behavior-fade`,
      fadeValue,
    );

    const blurValue = behaviorType === 'Blur' ? 'block' : 'none';
    document.documentElement.style.setProperty(
      `--filterboxd-${filterName}-behavior-blur`,
      blurValue,
    );

    const replaceValue = behaviorType.includes('Replace') ? 'block' : 'none';
    document.documentElement.style.setProperty(
      `--filterboxd-${filterName}-behavior-replace`,
      replaceValue,
    );

    const customValue = behaviorType === 'Custom' ? 'block' : 'none';
    document.documentElement.style.setProperty(
      `--filterboxd-${filterName}-behavior-custom`,
      customValue,
    );
  }

  function updateLinkInPopMenu(titleIsHidden, link) {
    log(DEBUG, 'updateLinkInPopMenu()');

    link.setAttribute('data-title-hidden', titleIsHidden);

    const innerText = titleIsHidden ? 'Remove from filter' : 'Add to filter';
    link.innerText = innerText;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const tabSelected = urlParams.get('filterboxd') !== null;
  log(DEBUG, 'tabSelected', tabSelected);

  if (tabSelected) trySelectFilterboxdTab();

  let OBSERVER = new MutationObserver(observeAndModify);

  const GMC_FIELDS = {
    filmBehaviorType: {
      type: 'select',
      options: FILM_BEHAVIORS,
      default: 'Fade',
    },
    filmBehaviorBlurAmount: {
      type: 'int',
      default: 3,
    },
    filmBehaviorCustomValue: {
      type: 'text',
      default: '',
    },
    filmBehaviorFadeAmount: {
      type: 'int',
      default: 10,
    },
    filmBehaviorReplaceValue: {
      type: 'text',
      default: 'https://raw.githubusercontent.com/blakegearin/filterboxd/main/img/bee-movie.jpg',
    },
    filmFilter: {
      type: 'text',
      default: JSON.stringify([]),
    },
    filmPageFilter: {
      type: 'text',
      default: JSON.stringify({}),
    },
    homepageFilter: {
      type: 'text',
      default: JSON.stringify({}),
    },
    logLevel: {
      type: 'select',
      options: LOG_LEVELS.options,
      default: LOG_LEVELS.default,
    },
    reviewBehaviorType: {
      type: 'select',
      options: REVIEW_BEHAVIORS,
      default: 'Fade',
    },
    reviewBehaviorBlurAmount: {
      type: 'int',
      default: 3,
    },
    reviewBehaviorCustomValue: {
      type: 'text',
      default: '',
    },
    reviewBehaviorFadeAmount: {
      type: 'int',
      default: 10,
    },
    reviewBehaviorReplaceValue: {
      type: 'text',
      default: 'According to all known laws of aviation, there is no way a bee should be able to fly.',
    },
    reviewFilter: {
      type: 'text',
      default: JSON.stringify({}),
    },
    reviewMinimumWordCount: {
      type: 'int',
      default: 10,
    },
    maxIdleMutations: {
      type: 'int',
      default: 10000,
    },
    maxActiveMutations: {
      type: 'int',
      default: 10000,
    },
  };

  GMC = new GM_config({
    id: 'gmc-frame',
    events: {
      init: gmcInitialized,
    },
    fields: GMC_FIELDS,
  });
})();
