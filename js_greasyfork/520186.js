// ==UserScript==
// @name        AnimeBytes Music Artists Helper
// @description AnimeBytes Music Artists Helper Script
// @match       https://animebytes.tv/upload.php
// @grant       none
// @version     1.0.3
// @author      Abyraea
// @namespace   Abyraea
// @license     GNU GPLv3
// #created     2024-12-09
// #updated     2024-12-09
// @downloadURL https://update.greasyfork.org/scripts/520186/AnimeBytes%20Music%20Artists%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/520186/AnimeBytes%20Music%20Artists%20Helper.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ---------- CONFIG -------------------
  const CONFIG = Object.freeze({
    secondaryCollapsiblesClosed: true,
    textareaMinHeight: '6em',
  });
  // ---------- CONFIG -------------------


  // ---------- ADVANCED CONFIG -------------------
  // DO NOT EDIT UNLESS YOU KNOW WHAT YOU ARE DOING
  const ADVANCED_CONFIG = Object.freeze({
    importances: Object.freeze(['main', 'guest']),
    roles: Object.freeze(['performer', 'composer', 'arranger']),
    splitBy: Object.freeze(['\n', ';']),
    replaceText: Object.freeze({
      'ā': 'aa',
      'ē': 'ee',
      'ī': 'ii',
      'ō': 'ou',
      'ū': 'uu'
    }),
  });
  // ---------- END ADVANCED CONFIG ---------------


  // ---------- INTERNAL CONFIG ---------------------------------
  // DO NOT EDIT UNLESS YOU REALLY REALLY KNOW WHAT YOU ARE DOING
  // ---------- Selectors
  const ELEMENTS_IDS_PREFIX = 'custom-animebytes-artists-helper-';
  const INTERNAL_CONFIG = Object.freeze({
    selectors: Object.freeze({
      groupForm: '#music_form > #group_information',
      formFieldSetsWrapper: '#artist_names_music',
    }),
    ids: Object.freeze({
      reverseNamesCheckbox: `${ELEMENTS_IDS_PREFIX}reverse-names-checkbox`,
    }),
    misc: Object.freeze({
      splitRegex: new RegExp(ADVANCED_CONFIG.splitBy.join('|')),
    }),
    classes: Object.freeze({
      header: 'head colhead_dark strong',
      body: 'box pad',
      fieldSet: 'nameFieldSet',
      fieldSetInput: 'artist_name standard_fields',
      rowBodyCollapsed: `${ELEMENTS_IDS_PREFIX}rowbody-collapsed`,
    }),
    labels: Object.freeze({
      header: 'Artists Helper',
      collapsibleShow: '(show)',
      collapsibleHide: '(hide)',
      reverseNamesCheckbox: 'Reverse Names',
      reverseNamesCheckboxDescription: 'Check this box to reverse two words lines (only newly added)',
    }),
    styles: Object.freeze({
      capitalize: 'text-transform: capitalize;',
      body: 'margin-bottom: 0;',
      textareaWrapper: 'flex-grow: 1; display: flex; flex-direction: column;',
      textarea: `min-height: ${CONFIG.textareaMinHeight};`,
      artistRowBody: 'display: flex; gap: 8px;',
      flexColumn: 'display: flex; flex-direction: column;',
      artistHeaderCollapsibleAction: 'cursor: pointer; text-decoration: underline;',
      rowBodyCollapsed: 'height: 10px; overflow: hidden; visibility: hidden;',
      rowBodyExpanded: '',
    }),
  });
  let PREVIOUS_ARTISTS = [];
  // ---------- END INTERNAL CONFIG -----------------------------


  function init() {
    const groupFormEl = document.querySelector(INTERNAL_CONFIG.selectors.groupForm);
    groupFormEl.prepend(getHeader(), getBody());
  };


  function getHeader() {
    const headerEl = document.createElement('div');
    headerEl.innerText = INTERNAL_CONFIG.labels.header;
    headerEl.className = INTERNAL_CONFIG.classes.header;
    return headerEl;
  }


  function getBody() {
    function getTextarea(importance, role) {
      const textareaWrapperEl = document.createElement('div');
      textareaWrapperEl.style = INTERNAL_CONFIG.styles.textareaWrapper;

      const textareaHeaderEl = document.createElement('span');
      textareaHeaderEl.style = INTERNAL_CONFIG.styles.capitalize;
      textareaHeaderEl.innerText = role;

      const textareaEl = document.createElement('textarea');
      textareaEl.style = INTERNAL_CONFIG.styles.textarea;
      textareaEl.onkeyup = updateArtistsForm;
      textareaEl.id = `${ELEMENTS_IDS_PREFIX}${importance}-${role}`;

      textareaWrapperEl.append(textareaHeaderEl, textareaEl);
      return textareaWrapperEl;
    }

    const bodyEl = document.createElement('dl');
    bodyEl.className = INTERNAL_CONFIG.classes.body;
    bodyEl.style = INTERNAL_CONFIG.styles.body;

    const artistsRowsEls = ADVANCED_CONFIG.importances.flatMap((importance, index) => {
      const rowBodyEl = document.createElement('div');
      rowBodyEl.style = INTERNAL_CONFIG.styles.artistRowBody;
      rowBodyEl.append(...ADVANCED_CONFIG.roles.map(role => getTextarea(importance, role)));
      return getRow(importance, rowBodyEl, index > 0);
    })

    const checkboxRowBodyEl = document.createElement('div');
    const checkboxEl = document.createElement('input');
    checkboxEl.type = 'checkbox';
    checkboxEl.id = INTERNAL_CONFIG.ids.reverseNamesCheckbox;
    const checkboxLabelEl = document.createElement('span');
    checkboxLabelEl.innerText = INTERNAL_CONFIG.labels.reverseNamesCheckboxDescription;
    checkboxRowBodyEl.append(checkboxEl, getSpacingEl(1), checkboxLabelEl);
    const checkBoxRowEls = getRow(INTERNAL_CONFIG.labels.reverseNamesCheckbox, checkboxRowBodyEl);

    bodyEl.append(...checkBoxRowEls, ...artistsRowsEls);

    return bodyEl;
  }


  function getRow(name, bodyEl, collapsible){
    const rowBodyEl = document.createElement('dd');
    const rowBodyCollapsibleEl = document.createElement('div');
    rowBodyCollapsibleEl.append(bodyEl);
    rowBodyEl.append(rowBodyCollapsibleEl);

    const rowHeaderEl = document.createElement('dt');
    rowHeaderEl.innerText = name;
    rowHeaderEl.style = INTERNAL_CONFIG.styles.capitalize;

    if (collapsible) {
      const rowHeaderWrapperEl = document.createElement('div');
      rowHeaderWrapperEl.style = INTERNAL_CONFIG.styles.flexColumn;
      const rowHeaderTitleEl = document.createElement('span');
      rowHeaderTitleEl.innerText = name;
      const rowHeaderActionEl = document.createElement('span');
      rowHeaderActionEl.innerText = CONFIG.secondaryCollapsiblesClosed
        ? INTERNAL_CONFIG.labels.collapsibleShow
        : INTERNAL_CONFIG.labels.collapsibleHide;
      rowHeaderActionEl.onclick = () => {
        const isCollapsed = rowBodyCollapsibleEl.classList.contains(INTERNAL_CONFIG.classes.rowBodyCollapsed);
        rowBodyCollapsibleEl.classList.toggle(INTERNAL_CONFIG.classes.rowBodyCollapsed);
        if (isCollapsed) {
          rowBodyCollapsibleEl.style = INTERNAL_CONFIG.styles.rowBodyExpanded;
          rowHeaderActionEl.innerText = INTERNAL_CONFIG.labels.collapsibleHide;
        } else {
          rowBodyCollapsibleEl.style = INTERNAL_CONFIG.styles.rowBodyCollapsed;
          rowHeaderActionEl.innerText = INTERNAL_CONFIG.labels.collapsibleShow;
        }
      };
      rowHeaderActionEl.style = INTERNAL_CONFIG.styles.artistHeaderCollapsibleAction;
      rowHeaderWrapperEl.append(rowHeaderTitleEl, rowHeaderActionEl);
      rowHeaderEl.innerHTML = '';
      rowHeaderEl.append(rowHeaderWrapperEl);

      rowBodyCollapsibleEl.style = CONFIG.secondaryCollapsiblesClosed
        ? INTERNAL_CONFIG.styles.rowBodyCollapsed
        : INTERNAL_CONFIG.styles.rowBodyExpanded;
      rowBodyCollapsibleEl.className = CONFIG.secondaryCollapsiblesClosed
        ? INTERNAL_CONFIG.classes.rowBodyCollapsed
        : '';
    }

    return [rowHeaderEl, rowBodyEl];
  }


  function updateArtistsForm(){
    const formFieldSetsWrapperEl = document.querySelector(INTERNAL_CONFIG.selectors.formFieldSetsWrapper);

    const reverseNames = document.querySelector(`#${INTERNAL_CONFIG.ids.reverseNamesCheckbox}`).checked;

    const artists = ADVANCED_CONFIG.importances.flatMap((importance) => {
      return ADVANCED_CONFIG.roles.flatMap((role) => {
        const textareaValue = document.querySelector(`#${ELEMENTS_IDS_PREFIX}${importance}-${role}`).value;
        const splittedValues = textareaValue.split(INTERNAL_CONFIG.misc.splitRegex);
        return [...new Set(splittedValues)].filter((name) => !!name).map((name) => ({
          name: name.trim(),
          importance,
          role,
        }));
      });
    });

    PREVIOUS_ARTISTS = PREVIOUS_ARTISTS.filter(({ name }) => !artists.includes(name));
    const formattedArtists = artists.map((artist) => formatArtist(artist, reverseNames));
    PREVIOUS_ARTISTS = formattedArtists;

    const formFieldSetsEls = artists.length === 0
      ? [getFormFieldSet('', ADVANCED_CONFIG.importances[0], ADVANCED_CONFIG.roles[0], 0)]
      : formattedArtists.map(({ formattedName, importance, role }, index) => getFormFieldSet(formattedName, importance, role, index));

    formFieldSetsWrapperEl.innerHTML = '';
    formFieldSetsWrapperEl.append(...formFieldSetsEls);
  }


  function getFormFieldSet(name, importance, role, index) {
    function getSelect(field, options, value){
      const selectEl = document.createElement('select');
      selectEl.className = `artist_${field}`;
      selectEl.name = `artist_${field}[]`;
      const optionsEls = options.map((option) => {
        const optionEl = document.createElement('option');
        optionEl.value = option;
        optionEl.innerText = capitalizeText(option);
        return optionEl;
      });
      selectEl.append(...optionsEls);
      selectEl.value = value;
      return selectEl;
    }

    const fieldSetEl = document.createElement('div');
    fieldSetEl.className = INTERNAL_CONFIG.classes.fieldSet;

    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = name;
    inputEl.className = INTERNAL_CONFIG.classes.fieldSetInput;
    inputEl.id = `artist_music_${index}`;
    inputEl.name = 'artist_name[]';
    inputEl.size = '35';

    const importanceSelect = getSelect('importance', ADVANCED_CONFIG.importances, importance);
    const roleSelect = getSelect('role', ADVANCED_CONFIG.roles, role);
    fieldSetEl.append(inputEl, getSpacingEl(1), importanceSelect, getSpacingEl(4), roleSelect);

    return fieldSetEl;
  }


  function formatArtist(artist, reverse){
    const formattedName = Object.entries(ADVANCED_CONFIG.replaceText).reduce((text, [search, replace]) => {
      return text.replace(search, replace);
    }, artist.name);
    const splittedName = formattedName.split(' ');

    const previousArtist = PREVIOUS_ARTISTS.find(({name, importance, role}) => artist.name === name && artist.importance === importance && artist.role === role);

    const formattedArtist = {
      ...artist,
      formattedName: previousArtist?.formattedName ?? formattedName,
      reverse: previousArtist?.reverse ?? false,
    };

    if (!reverse || previousArtist?.reverse === false || splittedName.length !== 2) {
      return formattedArtist;
    }

    formattedArtist.formattedName = splittedName.reverse().join(' ');
    formattedArtist.reverse = true;
    return formattedArtist;
  }


  function getSpacingEl(spaces){
    const spacingEl = document.createElement('span');
    spacingEl.innerHTML = '&nbsp;'.repeat(spaces || 1);
    return spacingEl;
  }


  function capitalizeText(text){
    return `${text.substring(0, 1).toUpperCase()}${text.substring(1)}`;
  }


  init();
})();
