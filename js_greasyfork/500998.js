// ==UserScript==
// @name          Araigoshi's Wanikani Stage Breakdown
// @namespace     https://www.wanikani.com
// @description   Show SRS and leech breakdown on dashboard, with ability to expand and view detailed lists.
// @author        araigoshi
// @version       2.1.0
// @match         https://www.wanikani.com/*
// @license       MIT
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/500998/Araigoshi%27s%20Wanikani%20Stage%20Breakdown.user.js
// @updateURL https://update.greasyfork.org/scripts/500998/Araigoshi%27s%20Wanikani%20Stage%20Breakdown.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  /* global wkof */

  if (!window.wkof) {
    let response = confirm('Dashboard Stage Breakdown requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

    if (response) {
      window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
    }

    return;
  }

  const SCRIPT_ID = 'araistages';
  const STAGE_NAMES = {
    0: 'Unlearned',
    1: 'Apprentice I',
    2: 'Apprentice II',
    3: 'Apprentice III',
    4: 'Apprentice IV',
    5: 'Guru I',
    6: 'Guru II',
    7: 'Master',
    8: 'Enlightened',
    9: 'Burned',
  };

  const SECTIONS = [
    'apprentice',
    'guru',
    'master',
    'enlightened',
    'burned'
  ];

  const SECTION_LABELS = {
    'apprentice': 'Apprentice',
    'guru': 'Guru',
    'master': 'Master',
    'enlightened': 'Enlightened',
    'burned': 'Burned',
  };

  const SECTION_ITEM_NAMES = {
    'apprentice': '#wk-icon__srs-apprentice1',
    'guru': '#wk-icon__srs-guru5',
    'master': '#wk-icon__srs-master',
    'enlightened': '#wk-icon__srs-enlightened',
    'burned': '#wk-icon__srs-burned',
  };

  const TYPE_LABELS = {
    'radical': 'Radical',
    'kanji': 'Kanji',
    'vocabulary': 'Vocab',
    'kana_vocabulary': 'Vocab'
  };

  const ROMAN_NUMERALS = [0, 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  const CSS_TEXT =
    `
        .item-spread-table-row--collapsable {
          pointer-events: auto !important;
        }

        .item-spread-table-widget:has(.araistages-container) .item-spread-table-widget__rows {
          display: none !important;
        }

        .item-spread-table-widget .araistages-container {
          display: grid;
          grid-template-columns: auto auto auto 1fr auto;
          grid-row-gap: var(--spacing-xxtight);
          padding-top: var(--spacing-normal);

          .araistages-row > .section-total {
            display: none;
          }

          .araistages-row {
            display: grid;
            grid-template-columns: subgrid;
            grid-column: 1/6;
            grid-row-gap: var(--spacing-xxtight);
            grid-column-gap: var(--spacing-xtight);

            align-items: center;
            justify-items: start;
            justify-content: space-between;

            background: var(--color-item-spread-row-background);
            padding: var(--spacing-xxtight) var(--spacing-xtight);
            border-radius: var(--border-radius-normal);
            border: 1px solid var(--color-item-spread-row-border);

            &:hover {
              background: var(--color-item-spread-row-hover-background);

              .leeches {
                display: inline !important;
              }

              .count {
                display: none !important;
              }
            }

            .wk-icon {
              grid-row: 1/3;
              grid-column: 1;
              --icon-height: 20px;
              color: var(--color-item-spread-row-icon);
            }

            h1 {
              grid-row: 1/3;
              grid-column: 2;
            }

            .type-counts {
              grid-column: 3;
              display: flex;

              .type-total-radical {
                color: var(--color-item-spread-row-count);
                background: var(--color-blue);
                border-color: var(--color-blue-dark);
              }
              .type-total-kanji {
                color: var(--color-item-spread-row-count);
                background: var(--color-pink);
                border-color: var(--color-pink-dark);
              }
              .type-total-vocabulary {
                color: var(--color-item-spread-row-count);
                background: var(--color-purple);
                border-color: var(--color-purple-dark);
              }
            }

            .stage-counts {
              grid-row: 2;
              grid-column: 3;
              display: flex;
            }

            .section-total {
              font-weight: 700;
            }

            .araistages-count-block {
              border: 1px solid;
              border-radius: var(--border-radius-pill);
              border-color: var(--color-item-spread-total-border);
              background: var(--color-item-spread-total-background);
              width: 50px;
              font-weight: var(--font-weight-bold);
              font-size: var(--font-size-xsmall);
              padding: var(--spacing-xxtight) 0;
              text-align: center;
              cursor: pointer;

              .abbrev {
                display: none;
              }

              .leeches {
                display: none;
              }

            }
          }

        }

        .dashboard__widget--two-third .araistages-container, .dashboard__widget--half .araistages-container {
          grid-template-columns: auto auto 1fr auto auto auto;

          .araistages-row > .section-total {
            display: block;
          }

          .type-counts > .section-total {
            display: none;
          }

          .araistages-row {
            grid-column: 1/7;
          }

          h1 {
            grid-row: 1 !important;
          }

          .wk-icon {
            grid-row: 1 !important;
          }

          .stage-counts {
            grid-row: 1 !important;
            grid-column: 4 !important;
          }

          .type-counts {
            grid-column: 5 !important;
          }

          .section-total {
            grid-column: 6;
          } 
        }

        .dashboard__widget--half .araistages-container {
          .araistages-row {
            grid-column-gap: var(--spacing-xxtight);
          }
        }

        .dashboard__widget--two-third .araistages-container {
          .stage-total > .abbrev {
            display: inline !important;
            color: #9a9a9a;
          }

          .stage-counts, .type-counts {
            display: grid;
            gap: var(--spacing-xxtight);
            grid-auto-flow: column;
          }
        }

        .dashboard__widget--full .araistages-container {
          grid-template-rows: auto auto auto;
          grid-template-columns: repeat(5, 1fr);
          grid-column-gap: var(--spacing-xtight);

          .araistages-row > .section-total {
            display: block;
          }

          .type-counts > .section-total {
            display: none;
          }

          h1, .wk-icon {
            grid-row: 1 !important;
          }

          .section-total {
            grid-row: 1;
            grid-column: 4/6;
          }

          .stage-counts {
            grid-row: 3 !important;
            grid-column: 1/6 !important;
            display: grid !important;
            justify-self: center;
            grid-auto-flow: column;
          }

          .type-counts {
            grid-row: 2 !important;
            grid-column: 1/6 !important;
            display: grid !important;
            grid-column-gap: var(--spacing-xxtight);
            justify-items: stretch;
            justify-self: stretch;
            grid-auto-flow: column;

            .araistages-count-block {
              width: auto;
            }
          }

          .araistages-row {
            grid-template-rows: subgrid;
            grid-template-columns: auto auto 1fr auto;
            grid-row: 1 / 4 !important;
            grid-column: auto / auto !important;
          }
        }

        #araistages-info-dialog {
          width: 800px;
          max-height: 80vh;
          flex-direction: column;
          border-radius: var(--border-radius-normal);
          padding: var(--spacing-tight);

          .close-button {
            border-radius: var(--border-radius-normal);
            border-style: solid;
          }

          &[open] {
            display: flex;
          }

          header {
            display: flex;
            gap: 2em;
            align-items: center;
            justify-content: space-between;
            margin: var(--spacing-xtight) 0;

            h2 {
              font-size: var(--font-size-xlarge);
            }

            button {
              border-style: solid;
              border-radius: var(--border-radius-normal);
              font-size: 20px;
              padding: 5px;
              font-weight: bold;
            }
          }

          .table-wrapper {
            flex-grow: 1;
            overflow: auto;
          }

          table {
            width: 100%;
            border-radius: var(--border-radius-normal);

            a {
              color: var(--color-link);
              text-decoration: none;
            }

            thead {
              th {
                background-color: var(--color-character-grid-header-background, #d5d5d5);
              }

              th:first-child {
                border-radius: var(--border-radius-normal) 0 0 0;
              }

              th:last-child {
                border-radius: 0 var(--border-radius-normal) 0 0;
              }
            }

            tbody,
            tbody a {
              color: var(--color-character-text);
            }

            th {
              text-align: left;
              font-variant: small-caps;
            }

            th, td {
              padding: 0.7em 1em;
            }

            wk-character-image {
              width: 14px;
              display: inline-block;
            }

            .row-kanji td {
              background-color: var(--color-kanji);
            }

            .row-kana_vocabulary td, .row-vocabulary td {
              background-color: var(--color-vocabulary);
            }

            .row-radical td {
              background-color: var(--color-radical);
            }

            tbody tr:last-child td:first-child {
              border-radius: 0 0 0 var(--border-radius-normal);
            }

            tbody tr:last-child td:last-child {
              border-radius: 0 0 var(--border-radius-normal) 0;
            }1
          }

          .options {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1em;
            margin: var(--spacing-xtight) 0;

            select, input {
              width: fit-content;
            }

            input[type=number] {
              width: 2.5em;
              outline: 1px solid var(--color-text);
            }

            .option {
              display: flex;
              align-items: baseline;
              gap: 0.5em;
            }
          }
        }`

  const state = {
    dialog: createDialog(),
    itemsBySrs: null,
  };
  window.araistages_state = state;

  const requiredWkofModules = 'Menu,ItemData,Settings';
  wkof.include(requiredWkofModules);
  await wkof.ready(requiredWkofModules);
  wkof.Settings.load(SCRIPT_ID, {
    compactItemTypes: true,
    leechThreshold: 1,
    alwaysShowTotalLeeches: false,
    useRMSForLeechScore: false,
    forceClearCache: false,
    tableSortOrder: 'wanikani',
    tablePageSize: 20,
    tableGroupType: 'all',
    tableGroup: 'all',
    tableItemType: 'all',
    tableMinLevel: 1,
    tableMaxLevel: 60,
  });

  loadStylesheet();
  await loadData();

  document.documentElement.addEventListener("turbo:load", async (evt) => {
    const path = new URL(evt.detail.url).pathname;
    if (shouldLoadOnPage(path)) {
      await loadData(true);
    }
    renderer(path);
  });

  renderer(document.location.pathname);

  function loadStylesheet() {
    if (document.getElementById('araistages-styles') === null) {
      let styleSheet = document.createElement('style');
      styleSheet.id = 'araistages-styles';
      styleSheet.textContent = CSS_TEXT;
      document.body.appendChild(styleSheet);
    }
  }

  function shouldLoadOnPage(path) {
    return path === '/dashboard' || path === '/';
  }

  function renderer(path) {
    if (shouldLoadOnPage(path)) {
      setTimeout(() => updatePage(state.itemsBySrs), 0);
      hookItemSpread();
    }
  }

  function hookItemSpread() {
    const itemSpreadWidgets = document.querySelectorAll('.item-spread-table-widget');

    for(const widget of itemSpreadWidgets) {
      const rows = widget.querySelectorAll('.item-spread-table-row');
      for(const [idx, row] of rows.entries()) {
        const section = SECTIONS[idx];
        console.log(`AWSB: Installing ${section} click listener`);
        row.dataset.section = section;
        row.addEventListener('click', () => {
          console.log(`AWSB: Showing ${section} info`);
          showDialog('section', section, 'all');
        });
        row.addEventListener('keyup', () => {
          console.log(`AWSB: Showing ${section} info`);
          showDialog('section', section, 'all');
        });
      }
    }
  }

  async function loadData(clearCache) {
    if (clearCache && wkof.settings[SCRIPT_ID]?.forceClearCache) {
      wkof.Apiv2.clear_cache();
    }
    const allItems = await wkof.ItemData.get_items({
      wk_items: {
        options: {
          review_statistics: true,
          assignments: true
        }
      }
    });
    const filteredItems = allItems.filter(item => item?.assignments?.srs_stage > 0);
    state.itemsBySrs = mapItemsToSrs(filteredItems);
  }

  function insertMenu() {
    wkof.Menu.insert_script_link({
      name: `${SCRIPT_ID}_settings_open`,
      submenu: 'Settings',
      title: "Araigoshi's Dashboard Stage Breakdown",
      on_click() {
        new wkof.Settings({
          script_id: SCRIPT_ID,
          title: "Araigoshi's Dashboard Stage Breakdown",
          content: {
            alwaysShowTotalLeeches: {
              type: 'checkbox',
              label: 'Always show total leeches',
              hover_tip: 'Display the total leeches as its own row, even for apprentice and guru',
            },
            useRMSForLeechScore: {
              type: 'checkbox',
              label: 'Use the Root-Mean-Square method for getting final leech score',
              hover_tip: 'Takes the Root-Mean-Square of the reading leech score and meaning leech score instead of the maximum',
            },
            forceClearCache: {
              type: 'checkbox',
              label: 'Clear Cache On Navigation',
              html: 'Useful if your review sessions last under a minute'
            },
            leechThreshold: {
              type: 'number',
              label: 'Leech Threshold',
              min: 1,
              hover_tip: 'How high the leech score needs to be to consider an item a leech.'
            },
            leechNote: {
              type: 'html',
              html: 'Note: Leeches will be recalculated after a page refresh.'
            }
          },
          on_save() {
            setStagesClasses();
          }
        }).open()
      }
    });
  }

  const sortFunctions = {
    wanikani(itemA, itemB) {
      const levelSort = itemA.data.level - itemB.data.level;
      return levelSort != 0 ? levelSort : itemA.data.lesson_position - itemB.data.lesson_position;
    },
    nextReview(itemA, itemB) {
      return Date.parse(itemA.assignments.available_at) - Date.parse(itemB.assignments.available_at);
    },
    leechScore(itemA, itemB) {
      return getLeechScore(itemB) - getLeechScore(itemA);
    }
  }

  function mapItemsToSrs(items) {
    const itemsBySrs = [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce((result, srs) => {
      result[srs] = {
        totals: {
          all: 0,
          radical: 0,
          vocabulary: 0,
          kanji: 0,
        },
        leeches: {
          all: 0,
          radical: 0,
          vocabulary: 0,
          kanji: 0,
        },
        items: [],
      };

      return result;
    }, {});

    for (let item of items) {
      const srsStage = item.assignments.srs_stage;
      let subjectType = item.assignments.subject_type;
      if (subjectType === 'kana_vocabulary') {
        subjectType = 'vocabulary'
      }
      itemsBySrs[srsStage].totals[subjectType]++;
      itemsBySrs[srsStage].totals.all++;

      if (isLeech(item)) {
        itemsBySrs[srsStage].leeches[subjectType]++;
        itemsBySrs[srsStage].leeches.all++;
      }
      itemsBySrs[srsStage].items.push(item);
    }

    return itemsBySrs;
  }

  function rmsOfPair(num1, num2) {
    return Math.sqrt((Math.pow(num1, 2) + Math.pow(num2, 2)) / 2);
  }

  function getLeechScore(item) {
    if (item.review_statistics === undefined) {
      return 0;
    }

    const reviewStats = item.review_statistics;
    const meaningScore = calculateLeechScore(reviewStats.meaning_incorrect, reviewStats.meaning_current_streak);
    const readingScore = calculateLeechScore(reviewStats.reading_incorrect, reviewStats.reading_current_streak);

    return wkof.settings[SCRIPT_ID]?.useRMSForLeechScore ? rmsOfPair(meaningScore, readingScore) : Math.max(meaningScore, readingScore);
  }

  function isLeech(item) {
    return getLeechScore(item) > (wkof.settings[SCRIPT_ID]?.leechThreshold || 1);
  }

  function calculateLeechScore(incorrect, currentStreak) {
    return incorrect / Math.pow((currentStreak || 0.5), 1.5);
  }

  function stagesForSection(section) {
    switch (section) {
        case 'apprentice':
            return [1, 2, 3, 4];
        case 'guru':
            return [5, 6];
        case 'master':
            return [7];
        case 'enlightened':
            return [8];
        case 'burned':
            return [9];
    }
  }

  function updatePage(itemsBySrs) {
    insertMenu();

    document.querySelectorAll('.item-spread-table-widget__content').forEach(itemSpreadWidget => {
      const existingContainer = itemSpreadWidget.querySelector('.araistages-container');
      if (existingContainer) {
        itemSpreadWidget.removeChild(existingContainer);
      }

      const container = document.createElement('div');
      container.className = 'araistages-container';
      for (var section of ['apprentice', 'guru', 'master', 'enlightened', 'burned']) {
        container.appendChild(makeItemBlock(section, itemsBySrs));
      }

      itemSpreadWidget.appendChild(container);
    });

  }

  function selectorForSection(srsSectionId) {
    return `.item-spread-table-row[data-section="${srsSectionId}"]`;
  }

  function sumAll(itemsBySrs, srsSectionId, group, field) {
    return stagesForSection(srsSectionId).reduce((n, stage) => n + itemsBySrs[stage][group][field], 0);
  }
    
  function iconViewBoxForSection(srsSectionId) {
    document.querySelector(SECTION_ITEM_NAMES[srsSectionId]).viewBox;
  }

  function makeCountBlock(abbrev, count, leechCount, extraClass, groupType, group, itemType) {
    return `
      <div class="araistages-count-block ${extraClass}" data-group-type="${groupType}" data-group="${group}" data-item-type="${itemType}">
        <span class="abbrev">${abbrev}</span>
        <span class="count">${count}</span>
        <span class="leeches">${leechCount}</span>
      </div>`;
  }

  function makeItemBlock(srsSectionId, itemsBySrs) {
    const typeBlocks = ['radical', 'kanji', 'vocabulary'].map(type => {
      const count = sumAll(itemsBySrs, srsSectionId, 'totals', type);
      const leechCount = sumAll(itemsBySrs, srsSectionId, 'leeches', type);
      const abbrev = type[0].toUpperCase();

      return makeCountBlock(abbrev, count, leechCount, `type-total type-total-${type}`, 'section', srsSectionId, type);
    });

    const stageBlocks = stagesForSection(srsSectionId).map((stageId, i) => {
      const abbrev = ROMAN_NUMERALS[i + 1];
      const count = itemsBySrs[stageId].totals.all;
      const leechCount = itemsBySrs[stageId].leeches.all;

      return makeCountBlock(abbrev, count, leechCount, 'stage-total', 'stage', stageId, 'all');
    });

    const totalBlock = makeCountBlock(
      'T',
      sumAll(itemsBySrs, srsSectionId, 'totals', 'all'),
      sumAll(itemsBySrs, srsSectionId, 'leeches', 'all'),
      'section-total',
      'section',
      srsSectionId,
      'all'
    );

    const hasSubStages = stageBlocks.length > 1;
    
    const row = `
      <svg class="wk-icon" viewBox="${iconViewBoxForSection(srsSectionId)}" aria-hidden="true">
        <use href="${SECTION_ITEM_NAMES[srsSectionId]}">
        </use>
      </svg>
      <h1>${SECTION_LABELS[srsSectionId]}</h1>
      <div class="type-counts">
        ${typeBlocks.join('')}
        ${totalBlock}
      </div>
      <div class="stage-counts ${hasSubStages ? 'with-substages' : 'no-substages'}">
        ${hasSubStages ? stageBlocks.join('') : ''}
      </div>
      ${totalBlock}
    `;

    const rowEl = document.createElement('div');
    rowEl.classList.add('araistages-row', `araistages-row-${srsSectionId}`);
    rowEl.innerHTML = row;
    rowEl.querySelectorAll('.araistages-count-block').forEach(block => block.addEventListener('click', handleGroupClick));

    return rowEl;
  }

  function renderSubject(item) {
    if (item.object !== 'radical') {
      return item.data.characters;
    }
    const primaryMeaning = item.data.meanings.find(meaning => meaning.primary === true).meaning;
    if (item.data.characters !== null) {
      return `${item.data.characters} (${primaryMeaning})`;
    } else {
      const imageUrl = item.data.character_images.find(image => image.content_type === 'image/svg+xml').url;
      return `<wk-character-image class="radical-image" src="${imageUrl}" aria-label=${primaryMeaning} alt="${primaryMeaning} radical"></wk-character-image> (${primaryMeaning})`;
    }
  }

  function rerenderDialogTable(groupType, group, itemType, minLevel, maxLevel) {
    const resolvedGroupType = groupType ?? wkof.settings[SCRIPT_ID].tableGroupType;
    const resolvedGroup = group ?? wkof.settings[SCRIPT_ID].tableGroup;
    const resolvedItemType = itemType ?? wkof.settings[SCRIPT_ID].tableItemType;
    const resolvedMinLevel = minLevel ?? wkof.settings[SCRIPT_ID].tableMinLevel;
    const resolvedMaxLevel = maxLevel ?? wkof.settings[SCRIPT_ID].tableMaxLevel;
    
    const items = getItems(resolvedGroupType, resolvedGroup, resolvedItemType, resolvedMinLevel, resolvedMaxLevel);
    const tableRows = items.map(item => {
      const leechScore = new Intl.NumberFormat().format(getLeechScore(item));
      const assignAvailable = item.assignments.available_at;
      const nextReview = assignAvailable === null ? 'Never' : new Date(item.assignments.available_at)
        .toLocaleString(undefined, {
          dateStyle: 'short',
          timeStyle: 'short'
        });
      const subject = renderSubject(item);
      return `<tr class="row-${item.object}">
        <td><a href="${item.data.document_url}">${subject}</a></td>
        <td>${TYPE_LABELS[item.object]}</td>
        <td>${STAGE_NAMES[item.assignments.srs_stage]}</td>
        <td>${item.data.level}</td>
        <td>${leechScore}</td>
        <td>${nextReview}</td>
      </tr>`;
    });
    state.dialog.querySelector('tbody').innerHTML = tableRows.join('');
  }

  function createDialog() {
    const dialogEl = document.createElement('dialog');
    dialogEl.innerHTML = `
      <header>
        <h2>Item Stage Breakdown</h2>
        <button class="close-button">X</button>
      </header>
      <div class="options">
        <div class="option">
          <label for="araistages-table-group">Stage</label>
          <select id="araistages-table-group">
            <option selected value="all-all">All</option>
            <hr>
            <option value="section-apprentice">Apprentice</option>
            <option value="stage-1">-- Apprentice I</option>
            <option value="stage-2">-- Apprentice II</option>
            <option value="stage-3">-- Apprentice III</option>
            <option value="stage-4">-- Apprentice IV</option>
            <hr>
            <option value="section-guru">Guru</option>
            <option value="stage-5">-- Guru I</option>
            <option value="stage-6">-- Guru II</option>
            <hr>
            <option value="section-master">Master</option>
            <hr>
            <option value="section-enlightened">Enlightened</option>
            <hr>
            <option value="section-burned">Burned</option>
          </select>
        </div>
        <div class="option">
          <label for="araistages-table-type">Type</label>
          <select id="araistages-table-type">
            <option value="all">All</option>
            <option value="radical">- Radicals</option>
            <option value="kanji">- Kanji</option>
            <option value="vocabulary">- Vocab</option>
          </select>
        </div>
        <div class="option">
          <label>Level</label>
          <input type="number" id="araistages-min-level" value="1">
           - 
          <input type="number" id="araistages-max-level" value="60">
        </div>
        <div class="option">
          <label for="araistages-sort-order">Sort</label>
          <select id="araistages-sort-order">
            <option selected value="wanikani">WK Order</option>
            <option value="nextReview">Next Review</option>
            <option value="leechScore">Leech Score</option>
          </select>
        </div>
        <div class="option">
          <label for="araistages-page-size">Max Items</label>
          <select id="araistages-page-size">
            <option selected value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="9999">All</option>
          </select>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>Stage</th>
              <th>Level</th>
              <th>Leech Score</th>
              <th>Next Review</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    `;
    dialogEl.id = 'araistages-info-dialog';
    dialogEl.addEventListener('change', (evt) => {
      console.log(evt);
    });
    dialogEl.querySelector('.close-button').addEventListener('click', () => {
      dialogEl.close();
    });
    dialogEl.querySelector('#araistages-sort-order').addEventListener('change', (evt) => {
      wkof.settings[SCRIPT_ID].tableSortOrder = evt.target.value;
      rerenderDialogTable();
    });
    dialogEl.querySelector('#araistages-page-size').addEventListener('change', (evt) => {
      wkof.settings[SCRIPT_ID].tablePageSize = parseInt(evt.target.value, 10);
      rerenderDialogTable();
    });
    dialogEl.querySelector('#araistages-table-group').addEventListener('change', (evt) => {
      const [groupType, group] = evt.target.value.split('-');
      wkof.settings[SCRIPT_ID].tableGroupType = groupType;
      wkof.settings[SCRIPT_ID].tableGroup = group;
      rerenderDialogTable(groupType, group);
    });
    dialogEl.querySelector('#araistages-table-type').addEventListener('change', (evt) => {
      wkof.settings[SCRIPT_ID].tableItemType = evt.target.value;
      rerenderDialogTable();
    });
    dialogEl.querySelector('#araistages-min-level').addEventListener('change', (evt) => {
      wkof.settings[SCRIPT_ID].tableMinLevel = parseInt(evt.target.value, 10);
      rerenderDialogTable();
    });
    dialogEl.querySelector('#araistages-max-level').addEventListener('change', (evt) => {
      wkof.settings[SCRIPT_ID].tableMaxLevel = parseInt(evt.target.value, 10);
      rerenderDialogTable();
    });
    document.body.appendChild(dialogEl);
    return dialogEl;
  }

  function handleGroupClick(evt) {
    const data = evt.currentTarget.dataset;
    showDialog(data.groupType, data.group, data.itemType);
  }

  function getItems(group, option, itemType, minLevel, maxLevel) {
    let stages = Object.keys(state.itemsBySrs).map(x => parseInt(x, 10));
    if(group === 'stage') {
      stages = [parseInt(option, 10)];
    }
    if(group === 'section') {
      stages = stagesForSection(option);
    }

    let items = [];
    for (const stage of stages) {
      items = items.concat(state.itemsBySrs[stage].items);
    }

    if(itemType !== 'all') {
      items = items.filter(item => item.object === itemType || (itemType === 'vocabulary' && item.object === 'kana_vocabulary'));
    }

    items = items.filter(item => item.data.level >= minLevel && item.data.level <= maxLevel);

    const pageSize = wkof.settings[SCRIPT_ID]?.tablePageSize || 20;
    items.sort(sortFunctions[wkof.settings[SCRIPT_ID].tableSortOrder]);
    return items.slice(0, pageSize);
  }

  function showDialog(groupType, group, itemType) {
    rerenderDialogTable(groupType, group, itemType);
    state.dialog.querySelector('#araistages-table-group').value = `${groupType}-${group}`;
    state.dialog.querySelector('#araistages-table-type').value = itemType;
    wkof.settings[SCRIPT_ID].tableGroupType = groupType;
    wkof.settings[SCRIPT_ID].tableGroup = group;
    wkof.settings[SCRIPT_ID].tableItemType = itemType;
    state.dialog.showModal();
  }
})();
