// ==UserScript==
// @name        Ao3 Auto Bookmarker
// @description Allows for autofilled bookmark summary and tags on Ao3.
// @namespace   Ao3
// @match       http*://archiveofourown.org/works/*
// @match       http*://archiveofourown.org/series/*
// @grant       none
// @version     3.1.1
// @author      Legovil
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/531415/Ao3%20Auto%20Bookmarker.user.js
// @updateURL https://update.greasyfork.org/scripts/531415/Ao3%20Auto%20Bookmarker.meta.js
// ==/UserScript==

/**
 * Settings for customizing script behavior.
 * Allows enabling or disabling specific features.
 * @type {!Object}
 */
const settings = {
  /** @type {boolean} Whether to generate a title note. */
  generateTitleNote: true,

  /** @type {boolean} Whether to generate a summary note. */
  generateSummaryNote: false,

  /** @type {boolean} Whether to check the recommendation box. */
  checkRecBox: false,

  /** @type {boolean} Whether to check the private box. */
  checkPrivateBox: false,

  /** @type {boolean} Whether to retrieve the rating (currently not implemented). */
  getRating: true,

  /** @type {boolean} Whether to retrieve archive warnings. */
  getArchiveWarnings: true,

  /** @type {boolean} Whether to retrieve category tags. */
  getCategoryTags: true,

  /** @type {boolean} Whether to retrieve fandom tags. */
  getFandomTags: false,

  /** @type {boolean} Whether to retrieve relationship tags. */
  getRelationshipTags: true,

  /** @type {boolean} Whether to retrieve character tags. */
  getCharacterTags: false,

  /** @type {boolean} Whether to retrieve additional tags. */
  getAdditionalTags: false,

  /** @type {boolean} Whether to generate a Complete/Incomplete/Abandoned tag. */
  getCompletedStatus: true,

  /** @type {boolean} Whether to generate a one shot tag in addition to Complete/Incomplete tags.*/
  generateOneshotTag: true,

  /** @type {boolean} Whether to generate a word count tag. */
  generateWordCountTag: true,

  /** @type {boolean} Whether to append generated content to an existing note. */
  appendToExistingNote: false,

  /** @type {boolean} Whether to append generated tags to existing tags. */
  appendToExistingTags: false,

  /** @type {boolean} Whether AO3 extensions are being used. */
  usingAo3Extensions: false,

  /** @type {boolean} Whether to allow platonic relationship tags. */
  excludeFriendshipTags: true,

  /** @type {boolean} Whether to allow only the first relationship tag. */
  getFirstRelationshipTagOnly: true,

};

/**
 * Integer numbers to check whether a fic is older than to call it abandoned instead of incomplete.
 * E.g. 2, 0, 0 would mean any fic over 2 years old will be considered abandoned if not completed.
 * @type {!Object}
 */
const abandonedCheckBounds = {
  years: 2,
  months: 0,
  days: 0
}

/**
 * Word count boundaries used for generating word count tags.
 * Represents thresholds for different tag categories.
 * @type {!Array<number>}
 */
const wordCountBounds = [1000, 5000, 10000, 50000, 100000, 500000];

/**
 * Enum for bookmark types.
 * Specifies the type of bookmark being processed.
 * @enum {string}
 */
const BookmarkType = Object.freeze({
  /** Represents a bookmark for a work. */
  WORK: 'WORK',

  /** Represents a bookmark for a series. */
  SERIES: 'SERIES',
});

(function() {
  'use strict';

  // Get all bookmark buttons and attach event listeners for bookmarking on click.
  const buttons = document.querySelectorAll(".bookmark_form_placement_open");
  buttons.forEach(button => button.addEventListener('click', generateBookmark));
})();

/**
 * Generates a bookmark based on the current page's URL.
 * Validates the bookmark type and applies corresponding settings.
 */
function generateBookmark() {
  const bookmarkType = checkBookmarkType(window.location.href);
  if (!bookmarkType) {
    console.error('Bookmark type not found. Cancelling bookmark generation.');
    return;
  }

  // Apply relevant settings for the determined bookmark type.
  setNotes(bookmarkType);
  setTags(bookmarkType);
  handleCheckBoxes();
}

/**
 * Sets notes based on bookmark type.
 * @param {string} bookmarkType The type of the bookmark.
 */
function setNotes(bookmarkType) {
  const notesElement = document.getElementById('bookmark_notes');
  if (!notesElement) {
    console.error('Notes element not found. Cancelling notes generation.');
    return;
  }
  notesElement.value = generateNotes(bookmarkType, notesElement);
}

/**
 * Sets tags based on bookmark type.
 * @param {string} bookmarkType The type of the bookmark.
 */
function setTags(bookmarkType) {
  const tagsElement = document.getElementById('bookmark_tag_string_autocomplete');
  if (!tagsElement) {
    console.error('Tags input element not found. Cancelling bookmark tag generation.');
    return;
  }
  if (!settings.appendToExistingTags) {
    document.querySelectorAll('.added.tag a').forEach(tagLink => tagLink.click());
  }
  tagsElement.value = generateTagsFromType(bookmarkType);
}

/**
 * Generates tags based on the bookmark type.
 * @param {string} bookmarkType The type of the bookmark.
 * @return {string} The generated tags.
 */
function generateTagsFromType(bookmarkType) {
  return bookmarkType === BookmarkType.WORK ? generateTags() : generateSeriesTags();
}

/**
 * Checks the type of bookmark based on the URL.
 * @param {string} url The URL to check.
 * @return {string|null} The bookmark type or null if not found.
 */
function checkBookmarkType(url) {
  const bookmarkTypes = [
    { type: '/works/', result: BookmarkType.WORK, message: 'Found Work Bookmark.' },
    { type: '/series/', result: BookmarkType.SERIES, message: 'Found Series Bookmark.' },
  ];

  const bookmarkType = bookmarkTypes.find(({ type }) => url.includes(type));

  if (!bookmarkType) {
    return null;
  }

  console.info(bookmarkType.message);
  return bookmarkType.result;
}

/**
 * Generates notes for the bookmark.
 * @param {string} bookmarkType The type of bookmark.
 * @param {!Element} notesElement The notes input element.
 * @return {string} The generated notes.
 */
function generateNotes(bookmarkType, notesElement) {
  const notesArray = [
    { setting: settings.generateTitleNote, note: generateTitleNote(bookmarkType) },
    { setting: settings.generateSummaryNote, note: generateSummaryNote(bookmarkType) },
  ];

  const notes = notesArray
    .filter((noteObj) => noteObj.setting)
    .map((noteObj) => noteObj.note)
    .join('\n\n');

  // Append or replace existing notes based on settings.
  return settings.appendToExistingNote
    ? `${notesElement.value}\n\n${notes}`
    : notes;
}

/**
 * Generates the title note for the bookmark.
 * @param {string} bookmarkType The type of bookmark.
 * @return {string} The generated title note.
 */
function generateTitleNote(bookmarkType) {
  const queries = {
    WORK: { title: '.title.heading', author: '.byline.heading a' },
    SERIES: { title: '.series-show.region .heading', author: '.series.meta.group a' },
  };

  const query = queries[bookmarkType];
  if (!query) {
    console.warn(`Invalid bookmark type: ${bookmarkType}. Cancelling Title Note generation.`);
    return '';
  }

  const { title: titleQuery, author: authorQuery } = query;
  const title = document.querySelector(titleQuery);
  if (!title) {
    console.warn('Title not found. Cancelling Title Note generation.');
    return '';
  }

  const author = document.querySelector(authorQuery);
  if (!author) {
    console.warn('Author not found. Cancelling Title Note generation.');
    return '';
  }

  return `${title.innerText.link(window.location.href)} by ${author.outerHTML}.`;
}

/**
 * Generates the summary note for the bookmark.
 * @param {string} bookmarkType The type of bookmark.
 * @return {string} The generated summary note.
 */
function generateSummaryNote(bookmarkType) {
  const queries = {
    WORK: '.summary.module .userstuff',
    SERIES: '.series.meta.group .userstuff',
  };

  const summaryQuery = queries[bookmarkType];
  if (!summaryQuery) {
    console.warn(`Invalid bookmark type: ${bookmarkType}. Cancelling summary note generation.`);
    return '';
  }

  const summary = document.querySelector(summaryQuery);
  if (!summary) {
    console.warn('No summary found. Cancelling summary note generation.');
    return '';
  }

  return `Summary: ${summary.innerText}`;
}

/**
 * Generates tags for the series bookmark.
 * Extracts tag information from works and generates unique tags.
 * @return {string} A comma-separated list of generated tags.
 */
function generateSeriesTags() {
  const works = Array.from(document.querySelector('.series.work.index.group').children);

  if (!Array.isArray(works) || works.length === 0) {
    console.warn(
        'No works found or invalid works array. Cancelling tag generation.');
    return '';
  }

  const tagTypes = [
    {
      setting: settings.getArchiveWarnings,
      type: 'warnings',
      errorMessage: 'Failed to generate Archive Warnings tags. Check to see if you have hide warnings enabled.'
    },
    {
      setting: settings.getFandomTags,
      type: 'fandoms.heading',
      errorMessage: 'Failed to generate Fandom Tags.'
    },
    {
      setting: settings.getRelationshipTags,
      type: 'relationships',
      errorMessage: 'Failed to generate Relationship Tags.'
    },
    {
      setting: settings.getCharacterTags,
      type: 'characters',
      errorMessage: 'Failed to generate Character Tags.'
    },
    {
      setting: settings.getAdditionalTags,
      type: 'freeforms',
      errorMessage: 'Failed to generate Additional Tags.'
    }
  ];

  const tags = works.flatMap(work =>
      tagTypes
          .filter(tagType => tagType.setting)
          .flatMap(tagType => getTagsFromString(tagType, work)));

  if (settings.getCategoryTags) {
    tags.push(generateSeriesCategoryTags())
  }

  if (settings.generateWordCountTag) {
    tags.push(generateWordCountTag());
  }

  if (settings.getCompletedStatus) {
    tags.push(generateCompletedSeriesTag())
  }

  return generateUniqueTagList(tags);
}

/**
 * Generates tags for the bookmark.
 * Removes existing tags unless configured to append to them,
 * then generates new tags based on settings.
 * @return {string} A comma-separated list of generated tags.
 */
function generateTags() {
  const tagTypes = [
    {
      setting: settings.getArchiveWarnings,
      type: 'warning.tags',
      errorMessage: 'Failed to generate Archive Warnings tags. Check to see if you have hide warnings enabled.'
    },
    {
      setting: settings.getCategoryTags,
      type: 'category.tags',
      errorMessage: 'Failed to generate Category Tags.'
    },
    {
      setting: settings.getFandomTags,
      type: 'fandom.tags',
      errorMessage: 'Failed to generate Fandom Tags.'
    },
    {
      setting: settings.getRelationshipTags,
      type: 'relationship.tags',
      errorMessage: 'Failed to generate Relationship Tags.'
    },
    {
      setting: settings.getCharacterTags,
      type: 'character.tags',
      errorMessage: 'Failed to generate Character Tags.'
    },
    {
      setting: settings.getAdditionalTags,
      type: 'freeform.tags',
      errorMessage: 'Failed to generate Additional Tags.'
    }
  ];

  const tags = tagTypes
      .filter(tagType => tagType.setting)
      .flatMap(tagType => getTagsFromString(tagType));

  if (settings.generateWordCountTag) {
    tags.push(generateWordCountTag());
  }

  if (settings.getCompletedStatus) {
    tags.push(generateCompletedTag());
  }

  if (settings.generateOneshotTag) {
    tags.push(generateOneshotTag());
  }

  return tags.join(', ');
}

/**
 * Extracts text content from elements with a specific tag type and class name.
 * @param {!Object} tagType The tag type containing the class name and error message.
 * @param {string} tagType.type The class name of the tag type to search for.
 * @param {string} tagType.errorMessage The custom error message to display when no tags are found.
 * @param {(!Document|!Element)=} startNode The node to begin the search from. Defaults to the document.
 * @return {string} The concatenated text content from all matching tags, or an empty string if none are found.
 */
function getTagsFromString(tagType, startNode = document) {
  let tagList = startNode.querySelectorAll(`.${tagType.type} .tag`);

  if (tagList.length === 0) {
    console.warn(tagType.errorMessage);
    return '';
  }

  tagList = handleRelationshipTag(tagType, tagList);

  return Array.from(tagList, tag => tag.text);
}

/**
 * Handles relationship tags based on the provided settings.
 *
 * @param {Object} tagType - The type of the tag.
 * @param {Array} tagList - The list of tags.
 * @returns {Array} The filtered list of tags.
 */
function handleRelationshipTag(tagType, tagList) {
  if (!tagType.type.includes('relationship')) {
    return tagList;
  }

  if (settings.excludeFriendshipTags) {
    tagList = [...tagList].filter(tag => tag.text.includes('/'));
  }

  if (tagList.length === 0) {
    console.warn(tagType.errorMessage);
    return '';
  }

  if (settings.getFirstRelationshipTagOnly) {
    return [tagList[0]];
  }

  return tagList;
}

/**
 * Generates a list of unique category tags.
 * @return {string} A list of unique category tags.
 */
function generateSeriesCategoryTags() {
  const tagList = document.querySelectorAll(".category-slash.category");
  console.log(tagList);

  const tags = Array.from(tagList).map(tag => tag.innerText);
  return generateUniqueTagList(tags);
}

/**
 * Generates a word count tag based on the word count boundaries.
 * @return {string} The generated word count tag.
 */
function generateWordCountTag() {
  const index = settings.usingAo3Extensions ? 2 : 1;
  const wordCountElement = document.getElementsByClassName('words')[index];

  if (!wordCountElement || wordCountElement.innerText === 'Words:') {
    console.error('Word count not found. Cancelling word count tag generation.');
    return '';
  }

  const wordCount = wordCountElement.innerText.replace(/[, ]/g, '');

  let lowerBound = wordCountBounds[0];

  if (wordCount < lowerBound) {
    return `< ${lowerBound}`;
  }

  for (const upperBound of wordCountBounds) {
    if (wordCount < upperBound) {
      return `${lowerBound} - ${upperBound}`;
    }
    lowerBound = upperBound;
  }

  return `> ${wordCountBounds[wordCountBounds.length - 1]}`;
}

/**
 * Generates a tag indicating if the series is complete.
 * @return {string} 'Complete' or 'Incomplete'
 */
function generateCompletedTag() {
  // Grab chapter counts and convert to numbers
  const [current, total] = document
    .querySelector('dd.chapters')
    .textContent
    .split('/')
    .map(Number);

  if (current === total) {
    return 'Complete';
  }

  // Parse last update date (YYYY-MM-DD)
  const [year, month, day] = document
    .querySelector('dd.status')
    .textContent
    .split('-')
    .map(Number);

  const updateDate = new Date(year, month - 1, day);

  // Build cutoff by subtracting bounds from now in UTC
  const cutoff = new Date();
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - abandonedCheckBounds.years);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - abandonedCheckBounds.months);
  cutoff.setUTCDate(cutoff.getUTCDate() - abandonedCheckBounds.days);
  cutoff.setUTCHours(0, 0, 0, 0);

  return cutoff > updateDate ? 'Abandoned' : 'Incomplete';
}


/**
 * Generates a tag indicating if the series is a oneshot.
 * @return {string} 'Oneshot' or ''
 */
function generateOneshotTag() {
  const [current, total] = document.querySelector('dd.chapters').textContent.split('/');
  return current === '1' && total === '1' ? 'Oneshot' : '';
}

/**
 * Generates a tag indicating if the series is complete.
 * @return {string} 'Complete' or 'Incomplete'
 */
function generateCompletedSeriesTag() {
  const completedStatus = Array.from(document.querySelector('dl.stats').childNodes)
    .find(stat => stat.textContent === 'Yes' || stat.textContent === 'No');
  return completedStatus && completedStatus.textContent === 'Yes' ? 'Complete' : 'Incomplete';
}



/**
 * Handles the state of checkboxes based on settings.
 * Updates checkbox elements based on the user's configuration.
 */
function handleCheckBoxes() {
  const checkBoxSettings = [
    {
      setting: settings.checkRecBox,
      elementId: 'bookmark_rec',
      message: 'Checking rec box.'
    },
    {
      setting: settings.checkPrivateBox,
      elementId: 'bookmark_private',
      message: 'Checking private box.'
    }
  ];
  checkBoxSettings.forEach(({ elementId, setting, message }) => {
    const checkBox = document.getElementById(elementId);
    if (setting && checkBox) {
      console.log(message);
      checkBox.checked = true;
    }
  });
}

/*
 * Generates a unique tag list csv from an array.
 * @return {string} The generated unique tag list csv.
 */
function generateUniqueTagList(tags) {
  return Array.from(new Set(tags)).join(', ');
}