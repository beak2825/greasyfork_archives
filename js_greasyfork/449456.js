// ==UserScript==
// @name        WaniKani French Synoynms
// @namespace   wk.french.synonyms
// @version     2.0.2
// @description Automatically adds french synonyms to all your unlocked items from WaniKani
// @author      Acaretia (Code Revamp: Acaretia; Original Author: Norman Sue)
// @include     /^https://(www|preview).wanikani.com//
// @copyright   2022+, Acaretia
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/449456/WaniKani%20French%20Synoynms.user.js
// @updateURL https://update.greasyfork.org/scripts/449456/WaniKani%20French%20Synoynms.meta.js
// ==/UserScript==

const log = (...args) => {
  return console.log(`%c[WaniKani French Synonyms] %c${args}`,
    'color: rgb(239, 68, 68); font-weight:800;',
    'color: rgb(132, 204, 22)'
  );
};

const error_log = (...args) => {
  return console.log(`%c[WaniKani French Synonyms] %c${args}`,
    'color: rgb(239, 68, 68); font-weight:800;',
    'color: rgb(255, 0, 0)'
  );
};

async function wkFrenchSynonyms() {

  // ===========================================================================
  // Defining variables                                                       ==
  // ===========================================================================

  // WaniKani set a limit of 8 synonyms per item, so we need to split the list
  // by selecting the first eight elements of the list.
  const MAX_SYNONYMS = 8;

  // Rate Limit is set to 60 requests per minute.
  // We will wait for 1 minute before making another request.
  const RATE_LIMIT = 60;
  let number_of_requests = 0;

  // IF set to true, the script will automatically delete the user's synonyms
  // after the script is finished.
  //
  // TODO: Make this configurable.
  const DELETE_SYNONYMS = false;

  // ===========================================================================
  // Fetch french synonyms from Github                                        ==
  // ===========================================================================

  const radicals_synonyms_url = 'https://raw.githubusercontent.com/acaretia/WaniKani-French-Data/master/radicals.json';
  const kanji_synonyms_url = 'https://raw.githubusercontent.com/acaretia/WaniKani-French-Data/master/kanji.json';
  const words_synonyms_url = 'https://raw.githubusercontent.com/acaretia/WaniKani-French-Data/master/words.json';

  const radicals_synonyms = await fetch(radicals_synonyms_url).then(response => response.json()).then(data => data);
  const kanji_synonyms = await fetch(kanji_synonyms_url).then(response => response.json()).then(data => data);
  const words_synonyms = await fetch(words_synonyms_url).then(response => response.json()).then(data => data);

  log('Fetched french synonyms from Github');
  log(`[GITHUB] Radicals: ${Object.keys(radicals_synonyms).length}; Kanji: ${Object.keys(kanji_synonyms).length}; Words: ${Object.keys(words_synonyms).length}.`);

  // ===========================================================================
  // Getting WaniKani data and updating synonyms                              ==
  // ===========================================================================

  // Check https://github.com/rfindley/wanikani-open-framework for
  // more information on the WaniKani Open Framework.
  const items = await wkof.ItemData.get_items({
    'wk_items': {
      'options': {
        'subjects': true,
        'study_materials': true,
        'assignments': true
      },
      'filters': {
        'item_type': ['rad', 'kan', 'voc'],
        'level': `1..${wkof.user.level}`,
      }
    }
  });

  log('Got WaniKani data');

  // From the items, get the radicals, kanji and words into separate arrays
  // and sort them alphabetically using the first meaning of each item
  // then sort the arrays by item level.
  const wk_radicals = items.filter(item => item.object === 'radical')
    .sort((a, b) => a.data.slug.localeCompare(b.data.slug))
    .sort((a, b) => a.data.level - b.data.level);

  const wk_kanjis = items.filter(item => item.object === 'kanji')
    .sort((a, b) => a.data.meanings[0].meaning.localeCompare(b.data.meanings[0].meaning))
    .sort((a, b) => a.data.level - b.data.level);

  const wk_vocabulary = items.filter(item => item.object === 'vocabulary')
    .sort((a, b) => a.data.meanings[0].meaning.localeCompare(b.data.meanings[0].meaning))
    .sort((a, b) => a.data.level - b.data.level);

  log(`[wkof] Radicals: ${wk_radicals.length}; Kanji: ${wk_kanjis.length}; Words: ${wk_vocabulary.length}.`);

  // ===========================================================================
  // Synchronizing WaniKani data with french synonyms                         ==
  // ===========================================================================

  // Function to update synonyms for a given item.
  const update_synonyms = async (wk_item) => {
    if (number_of_requests >= RATE_LIMIT) {
      return error_log('/!\\ Rate limit has been reached! Please wait one minute before refreshing the page.');
    }

    if (!wk_item.assignments) {
      return log(`[${wk_item.object}] ${wk_item.data.slug} is not unlocked for the moment.`);
    }

    const french_synonyms = [];

    // Get the synonyms from the french synonyms data.

    // If the item is a radical, get the synonyms from the radicals synonyms data.
    if (wk_item.object === 'radical') {
      if (!radicals_synonyms[wk_item.data.slug]) return log(`[${wk_item.object}] ${wk_item.data.slug} has no french synonyms.`);

      french_synonyms.push(...radicals_synonyms[wk_item.data.slug]);
    }

    // If the item is a kanji, get the synonyms from the kanji synonyms data.
    if (wk_item.object === 'kanji') {
      if (!kanji_synonyms[wk_item.data.slug]) return log(`[${wk_item.object}] ${wk_item.data.slug} has no french synonyms.`);

      french_synonyms.push(...kanji_synonyms[wk_item.data.slug]);
    }

    // If the item is a word, get the synonyms from the words synonyms data.
    if (wk_item.object === 'vocabulary') {
      if (!words_synonyms[wk_item.data.slug]) return log(`[${wk_item.object}] ${wk_item.data.slug} has no french synonyms.`);

      french_synonyms.push(...words_synonyms[wk_item.data.slug]);
    }

    // If the item has no synonyms, return.
    if (!french_synonyms.length) {
      return;
    }

    // If the item has synonyms, update them.
    log(`[${wk_item.object}] ${wk_item.data.slug} has ${french_synonyms.length} french synonyms. (${french_synonyms.join(', ')})`);

    // If the item has too many synonyms, remove the oldest ones.
    if (french_synonyms.length > MAX_SYNONYMS) {
      french_synonyms.splice(0, french_synonyms.length - MAX_SYNONYMS);
      log(`[${wk_item.object}] ${wk_item.data.slug} has too many french synonyms. ${french_synonyms.length} synonyms will be kept.`);
    }

    let final_synonyms = [];

    // Add all the synonyms to the final synonyms array.
    if (wk_item.study_materials) {
      final_synonyms.push(...wk_item.study_materials.meaning_synonyms);
    }

    final_synonyms.push(...french_synonyms);

    // Remove duplicates.
    final_synonyms = [...new Set(final_synonyms)];

    // Check if final synonyms array is exceeding the maximum allowed length.
    if (final_synonyms.length > MAX_SYNONYMS) {
      final_synonyms.splice(0, final_synonyms.length - MAX_SYNONYMS);
    }

    // Check if final synonyms are already the same as the current synonyms.
    if (wk_item.study_materials && final_synonyms.length === wk_item.study_materials.meaning_synonyms.length
      && final_synonyms.every((synonym, index) => synonym === wk_item.study_materials.meaning_synonyms[index])) {
      return log(`[${wk_item.object}] ${wk_item.data.slug} has the same french synonyms as before.`);
    }

    // Update the synonyms in the WaniKani item by doing a PUT request to the API
    // using a JQuery AJAX request. (TODO: Finding a way to do this without using JQuery.)
    const data = {
      'study_material': {
        'subject_type': wk_item.object,
        'subject_id': wk_item.id,
        'meaning_synonyms': final_synonyms
      }
    };

    // Log the number of requests made.
    number_of_requests++;
    log(`Requests number ${number_of_requests} (of ${RATE_LIMIT}).`);

    return $.ajax({
      type: 'put',
      url: `/study_materials/${wk_item.id}`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
    }).done(() => {
      log(`[${wk_item.object}] ${wk_item.data.slug} synonyms updated.`);
      return Promise.resolve();
    }).fail((jqXHR, textStatus, errorThrown) => {
      log(`[${wk_item.object}] ${wk_item.data.slug} synonyms update failed.`);
      return Promise.reject(errorThrown);
    }).always(() => {
      return Promise.resolve();
    }).promise();

  };

  log('[wkof] Synchronizing french synonyms...');

    // Synchronize radicals
    // --------------------------------------------------------------------------
    // For each radical in WaniKani, check if it has a french synonym. If it
    // does, update the radical's meaning with the french synonym.
    // --------------------------------------------------------------------------
    for (const wk_radical of wk_radicals) {
      await update_synonyms(wk_radical);
    }

    // Synchronize kanji
    // --------------------------------------------------------------------------
    // For each kanji in WaniKani, check if it has a french synonym. If it
    // does, update the kanji's meaning with the french synonym.
    // --------------------------------------------------------------------------
    for (const wk_kanji of wk_kanjis) {
      await update_synonyms(wk_kanji);
    }

    // Synchronize words
    // --------------------------------------------------------------------------
    // For each word in WaniKani, check if it has a french synonym. If it
    // does, update the word's meaning with the french synonym.
    // --------------------------------------------------------------------------
    for (const wk_word of wk_vocabulary) {
      await update_synonyms(wk_word);
    }

  log('[wkof] Synchronization complete.');
  log(`[wkof] Requests made: ${number_of_requests} (of ${RATE_LIMIT}).`);

  // ===========================================================================

};

(function () {
  'use strict';

  const SCRIPT_NAME = 'WaniKani French Synonyms';
  const SCRIPT_VERSION = '1.0.0';

  console.log(`%c[${SCRIPT_NAME}] %cv${SCRIPT_VERSION} %c| %cLoading...`,
    'color: rgb(239, 68, 68); font-weight:800;',
    'color: rgb(255, 0, 0)',
    'color: rgb(115, 115, 115)',
    'color: rgb(132, 204, 22)'
  );

  // ===========================================================================
  // Check if WaniKani Open Framework is installed and at                     ==
  // the required version. If not, redirect to the install page.              ==
  // ===========================================================================

  if (!wkof) {
    log('WaniKani Open Framework is not installed');

    if (confirm('WaniKani Open Framework is not installed.\n\nDo you want to install it?')) {
      window.location.href = 'https://greasyfork.org/en/scripts/38582-wanikani-open-framework';
    } else {
      log('User doesn\'t want to install WaniKani Open Framework.');
    }
  }

  const WKOF_VERSION_NEEDED = '1.0.58';

  if (!wkof.version || wkof.version.compare_to(WKOF_VERSION_NEEDED) === 'older') {
    log('WaniKani Open Framework is not at the required version.');

    if (confirm('WaniKani Open Framework is not at the required version.\n\nDo you want to update it?')) {
      window.location.href = 'https://greasyfork.org/en/scripts/38582-wanikani-open-framework';
    } else {
      log('User doesn\'t want to update WaniKani Open Framework.');
    }
  }

  log('WaniKani Open Framework is installed and at the required version.');

  wkof.include('ItemData,Menu,Settings');

  // ===========================================================================

  wkof.ready('ItemData,Menu,Settings').then(() => {
    log('[WKOF] ItemData included.');

    if (!wkof.user) {
      return log('[WKOF] User is undefined.');
    }

    wkFrenchSynonyms();
  });

})();