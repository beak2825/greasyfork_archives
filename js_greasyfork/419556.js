// ==UserScript==
// @name         [MAL] VA Display Settings
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Show voice actors only in selected languages.
// @author       grin3671
// @match        https://myanimelist.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419556/%5BMAL%5D%20VA%20Display%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/419556/%5BMAL%5D%20VA%20Display%20Settings.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let t0 = performance.now();

  // return Array
  const getUserPreferense = () => {
    let storage = JSON.parse(localStorage.getItem('myVaSetting'));
    return storage ? storage : ['Japanese'];
  }

  // Initial data
  let supportedCategories = ['anime', 'character'],
      supportedLanguages = ['Japanese', 'English', 'Korean', 'Spanish', 'German', 'French', 'Portuguese (BR)', 'Italian', 'Hungarian', 'Hebrew', 'Mandarin'],
      userPreferense = getUserPreferense(),
      settingsElement = null,
      toggleableElements = null,
      settingsLink = '#va_settings',
      currentPage = null,
      pageSettings = {
        anime: {
          langSelector: '.js-anime-character-language',
          castSelector: '.anime-character-container table table tr',
          headerSelector: '.page-common .border_solid',
        },
        character: {
          langSelector: 'small',
          castSelector: '#content > table > tbody > tr > td:last-child > table',
          headerSelector: 'div.normal_header',
        }
  }

  // check Link
  const checkPageSupport = () => {
    let currentURL = location.pathname.substring(1).split('/');
    currentPage = currentURL[0];
    return (supportedCategories.includes(currentURL[0]) && (currentPage == 'anime' ? currentURL[currentURL.length - 1] == 'characters' : currentURL.length <= 3));
  }

  const saveUserPreferense = (data) => {
    localStorage.setItem('myVaSetting', JSON.stringify(data));
    userPreferense = data;
  }

  const openSettings = () => {
    settingsElement.showModal();
  }

  const closeSettings = () => {
    settingsElement.close();
  }

  // toggle Display
  const updateElementList = (elems) => {
    let t1 = performance.now();
    let langSelector = pageSettings[currentPage].langSelector;
    for (let i = 0; i < elems.length; ++i) {
      let lang = elems[i].querySelector(langSelector);
      elems[i].style.display = (userPreferense.includes(lang.textContent.trim())) ? (currentPage == 'anime' ?'table-row' : 'table') : 'none';
    }
    console.info('"VA Display Settings" update performance: ' + (performance.now() - t1) + ' milliseconds.');
  };

  if (checkPageSupport()) {
    // -----------------------------------
    // MAIN PART: Voice Actor's Visibility
    // -----------------------------------
    // Select all VA's Elements
    toggleableElements = document.querySelectorAll(pageSettings[currentPage].castSelector);
    // Update Visibility of Elements
    updateElementList(toggleableElements);

    // ------------------------------------------
    // SECONDARY PART: Control Buttons and Styles
    // ------------------------------------------
    // Functions --------------------------------
    let createSettingsButton = () => {
      let button = document.createElement('a');
      button.id = 'va_settings_button';
      let icon = document.createElement('i');
      button.tabIndex = '-1';
      icon.className = 'fa fa-cog mr4';
      button.append(icon, 'VA Display Settings');
      button.href = settingsLink;
      return button;
    }
    let createSettingsDialog = () => {
      let dialog = document.createElement('dialog');
      dialog.id = 'voice_actors_settings';

      dialog.addEventListener('close', (event) => {
        if (location.hash == settingsLink) history.back();
      });

      let dialogHeader = document.createElement('h2');
      dialogHeader.textContent = 'Voice Actors Display Settings';

      let formHint = document.createElement('p');
      formHint.textContent = 'Choose which languages you want to see in the list.';

      let dialogForm = document.createElement('form');

      let formFieldset = document.createElement('fieldset');

      let fieldsetLegend = document.createElement('legend');
      fieldsetLegend.textContent = 'Choose preferred languages:';
      formFieldset.append(fieldsetLegend);

      //
      let counts = new Array(supportedLanguages.length).fill(0);
      let langSelector = pageSettings[currentPage].langSelector;

      for (let i = 0; i < supportedLanguages.length; ++i) {
        for (let j = 0; j < toggleableElements.length; ++j) {
          if (toggleableElements[j].querySelector(langSelector).textContent.trim() == supportedLanguages[i]) counts[i] += 1;
        }

        let langLabel = document.createElement('label');
        let langCheckbox = document.createElement('input');
        langCheckbox.type = 'checkbox';
        langCheckbox.name = 'Language';
        langCheckbox.value = supportedLanguages[i];
        if (userPreferense.includes(supportedLanguages[i])) langCheckbox.checked = 'checked';
        let langText = document.createElement('span');
        langText.textContent = supportedLanguages[i] + ' (' + counts[i] + ')';
        langLabel.append(langCheckbox, langText);
        formFieldset.append(langLabel);
      }
      dialogForm.onchange = () => {
        let formData = new FormData(dialogForm);
        let userSettings = [];
        for (var [key, value] of formData.entries()) {
          userSettings.push(value);
        }
        saveUserPreferense(userSettings);
        updateElementList(toggleableElements);
      }
      dialogForm.append(formHint, formFieldset);

      let dialogFooter = document.createElement('div');

      let dialogClose = document.createElement('input');
      dialogClose.className = 'inputButton flat';
      dialogClose.type = 'button';
      dialogClose.value = 'Close';
      dialogClose.onclick = () => {
        closeSettings();
      };

      dialogFooter.append(dialogClose);
      dialog.append(dialogHeader, dialogForm, dialogFooter);
      return dialog;
    }
    let createStyles = () => {
      let style = document.createElement('style');
      style.innerHTML = `
        #va_settings_button {
          display: inline-block;
          padding: 4px 8px;
          margin: -4px -4px -4px 6px;
          font-size: 11px;
          font-weight: normal;
        }

        #voice_actors_settings {
          position: fixed;
          top: 0;
          bottom: 0;
          width: 340px;
          padding: 16px;
          border: 2px solid #1d439b;
          outline: 10px solid #e1e7f557;
          text-align: left;
        }

        #voice_actors_settings::backdrop {
          background: rgba(0,0,0,.24);
        }

        #voice_actors_settings fieldset {
          border: 1px solid #bebebe;
          padding: 4px 8px;
          margin: 10px 0;
        }

        #voice_actors_settings legend {
          padding: 0 8px;
        }

        #voice_actors_settings label {
          display: flex;
          align-items: center;
          height: 29px;
          padding: 0 2px;
          margin: 0 2px;
          border-bottom: 1px solid #ebebeb;
          cursor: pointer;
          user-select: none;
        }

        #voice_actors_settings label:hover {
          background: rgba(0,0,0,.04);
        }

        #voice_actors_settings label:last-child {
          border-bottom: 0;
        }

        #voice_actors_settings label span {
          margin-left: 6px;
        }

        #voice_actors_settings div {
          text-align: right;
        }

        #voice_actors_settings .inputButton {
          padding: 4px 8px;
          font-size: 13px;
        }
      `;
      document.head.appendChild(style);
    }
    // ------------------------------------------
    // Find Header where Button will be placed
    let headerElement = document.querySelectorAll(pageSettings[currentPage].headerSelector);
    switch (currentPage) {
      case 'anime':
        if (headerElement[0].querySelector('h2').textContent == 'Characters & Voice Actors') {
          headerElement[0].querySelector('h2').textContent += ' (' + toggleableElements.length + ')';
          headerElement[0].append(createSettingsButton());
        }
        break;
      case 'character':
        if (headerElement[2].textContent == 'Voice Actors') {
          headerElement[2].textContent += ' (' + toggleableElements.length + ')';
          headerElement[2].append(createSettingsButton());
        }
        break;
    }
    // Additionally adds Dialog to Page
    let dialog = createSettingsDialog();
    document.body.append(dialog);
    settingsElement = dialog;
    // Add Main Styles
    createStyles();

    // ------------------------------------------
    // If Page has Hash, open Dialog
    if (location.hash == settingsLink) openSettings();
    // Open/Close Dialog depending on Hash
    window.onpopstate = function (event) {
      if (location.hash == settingsLink) openSettings();
      if (location.hash == '') closeSettings();
    };

    console.info('"VA Display Settings" initial performance: ' + (performance.now() - t0) + ' milliseconds.');
  }
})();