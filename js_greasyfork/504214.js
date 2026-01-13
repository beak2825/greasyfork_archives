// ==UserScript==
// @name         OkCupid better filtering
// @namespace    http://tampermonkey.net/
// @version      20260112.3
// @description  Adds filters to the discover feature
// @author       You
// @match        https://okcupid.com/*
// @match        https://www.okcupid.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=okcupid.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504214/OkCupid%20better%20filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/504214/OkCupid%20better%20filtering.meta.js
// ==/UserScript==

(function () {
  'use strict';

  class OkCupidBetterFiltering {
    constructor() {
      this.consolePrefix = '[user scripts]';
      this.dynamicStylePrefix = `css-${window.crypto.randomUUID()}`;
      this.profileIDTest = /profile\/(.+)\/questions/;
      this.skippedIds = [];
      this.currentProfile = {
        id: null,
        username: null,
        exclusions: [],
      };
      this.filters = {
        filterLocation: [],
        filterBasics: [],
        filterLooks: [],
        filterBackground: [],
        filterLifestyle: [],
        filterFamily: [],
        filterLooking: [],
      };
      this.timeouts = {};
      this.intervals = {};

      const storedFilters = localStorage.getItem('filterList');

      if (storedFilters !== null && storedFilters !== '') {
        this.filters = JSON.parse(storedFilters);
      }

      this.passing = false;
      this.injectStyles();
      this.startWatching();
    }

    static get locationIcon() {
      return `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39" /></svg>`;
    }

    static get basicsIcon() {
      return `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M17.75 12.843a5.454 5.454 0 1 1-.001 10.907 5.454 5.454 0 0 1 0-10.907zm0 1.5a3.953 3.953 0 1 0-.001 7.907 3.953 3.953 0 0 0 0-7.907zM10.431 8.55a.75.75 0 0 1 .75.75v8.885a.75.75 0 0 1-.75.75H1.547a.75.75 0 0 1-.75-.75V9.3a.75.75 0 0 1 .75-.75h8.885zm-.75 1.5H2.297v7.385h7.385V10.05zM11.42.275l9.91 2.656a.75.75 0 0 1 .336 1.255l-7.254 7.254a.75.75 0 0 1-1.255-.337l-2.655-9.91a.75.75 0 0 1 .918-.918zm.867 1.785l1.983 7.4 5.417-5.417-7.4-1.983z" fill="#1A1A1A" fill-rule="nonzero"></path></svg>`;
    }

    static get looksIcon() {
      return `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12.03 7.104a3.552 3.552 0 1 1 3.552-3.543 3.543 3.543 0 0 1-3.552 3.543zm0-5.704a2.16 2.16 0 1 0 2.16 2.161 2.15 2.15 0 0 0-2.16-2.16z" fill="#191919"></path><path d="M14.376 24.01a2.059 2.059 0 0 1-1.984-1.743l-.334-2.57-.38 2.57a2.077 2.077 0 0 1-2.069 1.743 2.225 2.225 0 0 1-1.641-.705 2.207 2.207 0 0 1-.621-1.669l.62-6.946-.416.686a1.957 1.957 0 0 1-2.152.928 1.854 1.854 0 0 1-1.215-1.02 1.8 1.8 0 0 1 0-1.586l2.745-5.25a3.617 3.617 0 0 1 2.68-1.947l1.725-.25a4.48 4.48 0 0 1 1.317 0l1.734.25a3.617 3.617 0 0 1 2.7 1.948l2.726 5.212a1.855 1.855 0 0 1-1.178 2.606 1.957 1.957 0 0 1-2.152-.928l-.417-.686.621 6.918a2.27 2.27 0 0 1-2.262 2.402l-.047.037zm-2.365-9.162a.871.871 0 0 1 .872.77l.835 6.426a.668.668 0 0 0 .658.557.873.873 0 0 0 .64-.27.844.844 0 0 0 .232-.648l-.844-9.47a.788.788 0 0 1 1.465-.481l1.762 2.912a.566.566 0 0 0 .622.25.428.428 0 0 0 .278-.612L15.84 9.07a2.215 2.215 0 0 0-1.65-1.187l-1.725-.232a3.051 3.051 0 0 0-.928 0l-1.725.25A2.216 2.216 0 0 0 8.172 9.09L5.482 14.3a.427.427 0 0 0 .279.613.556.556 0 0 0 .621-.26l1.762-2.903a.788.788 0 0 1 1.465.482l-.853 9.497a.862.862 0 0 0 .533.822c.11.046.229.07.348.068a.668.668 0 0 0 .659-.566l.834-6.417a.927.927 0 0 1 .881-.788z" fill="#191919"></path></svg>`;
    }

    static get backgroundIcon() {
      return `<svg width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M12.155.016L12 .015C18.627.015 24 5.38 24 12c0 6.566-5.287 11.899-11.841 11.984a.769.769 0 0 1-.317-.001l.158.002C5.373 23.985 0 18.619 0 12 0 5.433 5.289.1 11.844.016a.764.764 0 0 1 .311 0zM6.773 12.748l-5.247.001c.344 4.855 3.996 8.797 8.718 9.592a17.025 17.025 0 0 1-3.47-9.593zm15.7.001h-5.246a17.025 17.025 0 0 1-3.47 9.591c4.721-.794 8.373-4.736 8.717-9.591zm-6.748 0h-7.45A15.543 15.543 0 0 0 12 22.13a15.54 15.54 0 0 0 3.725-9.383zm-5.481-11.09l-.191.034c-4.63.867-8.188 4.768-8.527 9.557h5.247a17.027 17.027 0 0 1 3.47-9.591zm1.756.21l-.253.303a15.537 15.537 0 0 0-3.472 9.078h7.45a15.535 15.535 0 0 0-3.472-9.078L12 1.869zm1.755-.21l.137.18a17.022 17.022 0 0 1 3.335 9.411h5.247c-.344-4.855-3.996-8.798-8.719-9.591z" id="Icon/Background/24" fill="#1A1A1A" fill-rule="nonzero"></path></g></svg>`;
    }

    static get lifestyleIcon() {
      return `<svg width="17" height="24" viewBox="0 0 17 24"><g fill="none" fill-rule="evenodd"><path d="M18.617.153c.305.232.383.65.196.973l-.053.078-.568.743h2.054a.75.75 0 0 1 .655 1.12l-.06.09-7.589 9.762V22.5h2.326c.416 0 .753.336.753.75 0 .385-.29.702-.665.745l-.088.005H9.422a.752.752 0 0 1-.753-.75c0-.385.29-.702.665-.745l.088-.005h2.324v-9.582L4.159 3.157a.75.75 0 0 1 .488-1.202l.107-.007L16.3 1.947 17.562.296a.755.755 0 0 1 1.055-.143zm.093 3.294h-1.664l-3.947 5.167a.755.755 0 0 1-1.055.143.748.748 0 0 1-.196-.973l.052-.078 3.253-4.259H6.289l6.21 7.99 6.211-7.99z" transform="translate(-4)" id="Icon/Lifestyle/24" fill="#1A1A1A" fill-rule="nonzero"></path></g></svg>`;
    }

    static get familyIcon() {
      return `<svg width="24" height="20" viewBox="0 0 24 20"><g fill="none" fill-rule="evenodd"><path d="M17.976 2c.229 0 .445.107.587.29l5.274 6.802a.77.77 0 0 1 .164.455L24 9.57v11.66c0 .389-.282.71-.648.761L23.25 22H.75a.757.757 0 0 1-.743-.664L0 21.23V9.571l.001-.041a.79.79 0 0 1 .004-.044L0 9.571c0-.18.06-.344.16-.475l.003-.003 5.268-6.795a.737.737 0 0 1 .35-.258c.003 0 .007 0 .01-.002A.699.699 0 0 1 6.024 2l-.062.003A.736.736 0 0 1 6.014 2h.01zM6.024 4.005L1.5 9.84v10.62h2.063v-6.921c0-.39.282-.712.648-.763l.102-.007h3.375a.76.76 0 0 1 .75.77v6.921h2.111V9.838L6.024 4.005zM22.5 10.34H12.049v10.12H22.5V10.34zM6.938 14.308H5.063v6.152h1.875v-6.152zM20.3 12.769a.76.76 0 0 1 .75.77V17a.76.76 0 0 1-.75.77h-6a.76.76 0 0 1-.75-.77V13.54a.76.76 0 0 1 .75-.77zm-3.776 1.538H15.05v1.924l1.474-.001v-1.923zm3.026 0h-1.526v1.923h1.526v-1.922zm-1.937-10.77H7.578l4.083 5.264h10.033l-4.081-5.263z" transform="translate(0 -2)" id="Icon/Family/24" fill="#1A1A1A" fill-rule="nonzero"></path></g></svg>`;
    }

    static get lookingIcon() {
      return `<svg width="24" height="22" viewBox="0 0 24 22"><g fill="none" fill-rule="evenodd"><path d="M11.994 6.415l.412.007c1.898.059 3.727.552 5.499 1.51.977.524 1.95 1.221 2.932 2.098.5.467.89.858 1.255 1.27l.428.496c.41.492.814 1.052 1.213 1.68a.75.75 0 0 1 0 .804 16.127 16.127 0 0 1-1.207 1.673l-.427.495c-.247.279-.502.545-.798.834l-.476.455c-.97.866-1.943 1.562-2.919 2.086-1.9 1.027-3.864 1.52-5.912 1.517-2.053-.015-4.012-.51-5.899-1.535-.976-.525-1.948-1.22-2.93-2.095a17.247 17.247 0 0 1-1.438-1.473 15.582 15.582 0 0 1-1.459-1.955.75.75 0 0 1 0-.808 15.51 15.51 0 0 1 1.45-1.945c.432-.505.873-.952 1.458-1.494.971-.864 1.943-1.56 2.917-2.083C7.982 6.927 9.94 6.43 11.994 6.415zm.01 1.5l-.387.01c-1.668.069-3.258.504-4.811 1.347-.868.466-1.746 1.094-2.621 1.874-.446.413-.8.765-1.137 1.14l-.41.473c-.28.335-.561.708-.84 1.119.35.514.701.97 1.06 1.373.388.454.788.86 1.315 1.35.887.788 1.765 1.416 2.635 1.884 1.671.907 3.388 1.342 5.193 1.355 1.794.002 3.513-.429 5.194-1.337.868-.467 1.745-1.095 2.618-1.873.47-.44.827-.797 1.168-1.182l.381-.441c.281-.338.562-.714.842-1.13-.28-.415-.562-.793-.848-1.135l-.41-.473a17.134 17.134 0 0 0-1.12-1.131c-.885-.79-1.763-1.419-2.633-1.886-1.559-.843-3.151-1.275-4.807-1.33l-.383-.007zM12 9.162a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 1.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm10.088-7.307a.75.75 0 0 1 1.06 1.06L20.975 6.59a.75.75 0 0 1-1.06-1.06zm-21.236 0a.75.75 0 0 1 1.06 0l2.174 2.173a.75.75 0 0 1-1.061 1.06L.852 4.416a.75.75 0 0 1 0-1.06zM12 0a.75.75 0 0 1 .75.75v3.074a.75.75 0 1 1-1.5 0V.75A.75.75 0 0 1 12 0z" id="lookingfor-eye-Icon/Looking-For/24" fill="#1A1A1A" fill-rule="nonzero"></path></g></svg>`;
    }

    static get filtersSkeleton() {
      return [
        {
          icon: this.locationIcon,
          storageKey: 'filterLocation',
          title: 'Location',
          selector: 'div.card-content-header__location',
        },
        {
          icon: this.basicsIcon,
          storageKey: 'filterBasics',
          title: 'Basics',
          selector: 'div.matchprofile-details-section--basics div.matchprofile-details-text',
        },
        {
          icon: this.looksIcon,
          storageKey: 'filterLooks',
          title: 'Looks',
          selector: 'div.matchprofile-details-section--looks div.matchprofile-details-text',
        },
        {
          icon: this.backgroundIcon,
          storageKey: 'filterBackground',
          title: 'Background',
          selector: 'div.matchprofile-details-section--background div.matchprofile-details-text',
        },
        {
          icon: this.lifestyleIcon,
          storageKey: 'filterLifestyle',
          title: 'Lifestyle',
          selector: 'div.matchprofile-details-section--lifestyle div.matchprofile-details-text',
        },
        {
          icon: this.familyIcon,
          storageKey: 'filterFamily',
          title: 'Family',
          selector: 'div.matchprofile-details-section--family div.matchprofile-details-text',
        },
        {
          icon: this.lookingIcon,
          storageKey: 'filterLooking',
          title: 'Loooking for',
          selector: 'div.matchprofile-details-section--wiw div.matchprofile-details-text',
        },
      ];
    }

    updateStorage() {
      // Remove empty strings.
      Object.keys(this.filters).forEach((storageKey) => {
        this.filters[storageKey] = this.filters[storageKey].filter((term) => term !== '');
      });

      localStorage.setItem('filterList', JSON.stringify(this.filters));
    }

    toggleFeature() {
      const toggleElement = document.getElementById(`${this.dynamicStylePrefix}button-base-root`);
      const toggleTrack = document.getElementById(`${this.dynamicStylePrefix}track`);

      // Local storage saves only strings.
      const filtersEnabled = localStorage.getItem('filtersEnabled') === 'true';

      if (filtersEnabled) {
        // Turn off the filter.
        toggleElement.classList.remove('checked');
        toggleTrack.classList.remove('checked');
      } else {
        // Turn on the filter.
        toggleElement.classList.add('checked');
        toggleTrack.classList.add('checked');
      }

      console.debug(`${this.consolePrefix} Setting the filtersEnabled value to ${!filtersEnabled}.`);

      localStorage.setItem('filtersEnabled', !filtersEnabled);
    }

    bindFilterListItem(el) {
      el.addEventListener('click', () => {
        const value = el.innerText;
        const storageKey = el.getAttribute('data-key');

        console.debug(`${this.consolePrefix} The user wants to remove this value. ${value}`);

        this.filters[storageKey] = this.filters[storageKey].filter((item) => item !== value);

        this.updateStorage();

        el.remove();
      });
    }

    bindFilterItem(el) {
      const inputField = el.querySelector('input');
      const listElement = el.querySelector('ul');
      const storageKey = inputField.getAttribute('data-key');

      inputField.addEventListener('keyup', ({ target, key, keyCode }) => {
        const searchTerm = target.value.trim().toLowerCase();

        if (searchTerm !== '' && (key === 'Enter' || keyCode === 13) && !this.filters[storageKey].includes(searchTerm)) {
          const newListItem = document.createElement('li');

          newListItem.innerHTML = searchTerm;
          newListItem.setAttribute('data-key', storageKey);
          newListItem.setAttribute('data-value', searchTerm);

          this.bindFilterListItem(newListItem);

          listElement.insertAdjacentElement('beforeend', newListItem);

          inputField.value = null;

          this.filters[storageKey].push(searchTerm);

          this.updateStorage();
        }
      });
    }

    buildFilterHTML() {
      const htmlArray = this.constructor.filtersSkeleton.map((filter) => {
        const listElements = this.filters[filter.storageKey].map((el) => {
          return `<li class="${this.dynamicStylePrefix}exclusion" data-key="${filter.storageKey}" data-value="${el}">${el}</li>`;
        }).join(`\n`);

        return `
                  <div class="${this.dynamicStylePrefix}filter-item">
                    <div class="${this.dynamicStylePrefix}filter-addition">
                      <div title="${filter.title}">${filter.icon}</div>
                      <div><input type="text" id="${this.dynamicStylePrefix}${filter.storageKey}" data-key="${filter.storageKey}" /></div>
                    </div>
                    <ul class="${this.dynamicStylePrefix}exclusion-list">
                    ${listElements}
                    </ul>
                  </div>\n`;
      });

      return htmlArray.join(`\n`);
    }

    compileExclusions() {
      // Reset the found exclusions list.
      this.currentProfile.exclusions = [];

      this.constructor.filtersSkeleton.forEach((filter) => {
        // Are there any exclusions set for this category?
        if (this.filters[filter.storageKey].length === 0) {
          return false;
        }

        const detailElement = document.querySelector(filter.selector);

        if (!detailElement) {
          return false;
        }

        detailElement.innerText.split('|').forEach((detail) => {
          const profileDetail = detail.trim().toLowerCase();

          this.filters[filter.storageKey].forEach((filterTerm) => {
            const exclusionListItem = document.querySelector(`li[data-value="${filterTerm}"]`);

            if (exclusionListItem) {
              exclusionListItem.classList.remove('found');

              if (filterTerm !== '' && (profileDetail.includes(filterTerm) || profileDetail === filterTerm)) {
                exclusionListItem.classList.add('found');

                this.currentProfile.exclusions.push(profileDetail);
              }
            }
          });
        });
      });
    }

    getProfileID() {
      let matchButton = document.querySelector('[data-cy="discover.userCardMatchPercentage"]');

      if (matchButton) {
        const { href } = matchButton;
        const matches = href.match(this.profileIDTest);

        if (matches !== null) {
          return matches[1];
        }
      }

      return 'unknown';
    }

    getProfileUsername() {
      const headerElement = document.querySelector('div.card-content-header__name-container h2');

      if (headerElement) {
        return headerElement.innerHTML;
      }

      return 'unknown';
    }

    async pass() {
      const clickEvent = new Event('click');
      const blockButton = document.getElementById('user-script-block');
      const passButton = document.querySelector('button.dt-action-buttons-button.pass');
      const notificationElement = document.getElementById(`${this.dynamicStylePrefix}notification`);

      // The page has not yet loaded enough to have rendered the elements we need.
      if (!passButton || !notificationElement) {
        if (!passButton) {
          console.debug(`${this.consolePrefix} [${this.currentProfile.id}] Waiting for the pass button element.`);
        }

        if (!notificationElement) {
          console.debug(`${this.consolePrefix} [${this.currentProfile.id}] Waiting for the notification element.`);
        }

        this.timeouts.pass = setTimeout(() => this.pass(), 100);

        return;
      }

      const { id } = this.currentProfile;

      if (blockButton) {
        console.debug(`${this.consolePrefix} [${this.currentProfile.id}] Blocking profile.`);

        blockButton.dispatchEvent(clickEvent);
      } else {
        console.debug(`${this.consolePrefix} [${this.currentProfile.id}] Passing on profile.`);

        passButton.dispatchEvent(clickEvent);
      }

      this.skippedIds.push(id);

      this.timeouts.pass = setTimeout(() => {
        // The profile still hasn't changed.
        if (id === this.currentProfile.id) {
          this.pass();
        }
      }, 2000);
    }

    scriptLoaded() {
      const notificationElementExists = document.getElementById(`${this.dynamicStylePrefix}notification`) !== null;
      const blockButtonExists = document.getElementById('user-script-block') !== null;

      if (!notificationElementExists || !blockButtonExists) {
        return false;
      }

      return true;
    }

    checkProfileLoop() {
      clearInterval(this.intervals.profileLoop);

      if (!this.scriptLoaded) {
        this.reset();

        return false;
      }

      const notificationElement = document.getElementById(`${this.dynamicStylePrefix}notification`);

      this.intervals.profileLoop = setInterval(() => {
        const profileId = this.getProfileID();

        if (profileId === 'unknown') {
          return false;
        }

        const username = this.getProfileUsername();

        // Keep checking for exclusions so the profile will be automatically passed if the user adds a new filter that matches.
        this.compileExclusions();

        const hasExclusion = this.currentProfile.exclusions.length > 0;

        // The profile has changed.
        if (profileId !== this.currentProfile.id) {


          console.debug(`${this.consolePrefix} [${profileId}] Found a new profile.`);

          this.passing = false;

          if (hasExclusion) {
            console.debug(`${this.consolePrefix} [${profileId}] This profile contains ${this.currentProfile.exclusions.length} exclusions.`);
          }
        }

        // Update the current profile.
        this.currentProfile.id = profileId;
        this.currentProfile.username = username;

        notificationElement.style.display = hasExclusion ? 'flex' : 'none';

        if (!this.skippedIds.includes(profileId) && hasExclusion) {
          if (localStorage.getItem('filtersEnabled') === 'true') {
            console.debug(`${this.consolePrefix} [${this.currentProfile.id}] Setting this profile to be passed.`);

            this.passing = true;
            this.pass();
          }
        }
      }, 500);
    }

    initialize(detailsTopElement) {
      console.debug(`${this.consolePrefix} Initializing the detail filter.`);

      const containerId = `${this.dynamicStylePrefix}filterContainer`;

      const filterContainerExists = document.getElementById(containerId) !== null;

      if (filterContainerExists) {
        return false;
      }

      const enabled = localStorage.getItem('filtersEnabled') === 'true';
      const filterContainer = document.createElement('div');

      filterContainer.id = containerId;
      filterContainer.classList.add('dt-section');
      filterContainer.innerHTML = `
              <h3 class="dt-section-title">Filters</h3>
              <div class="dt-section-content">
                <div class="${this.dynamicStylePrefix}control-container">
                  <div style="flex-grow: 1;">
                    <span class="${this.dynamicStylePrefix}switch-root" id="${this.dynamicStylePrefix}switch-root">
                      <span class="${this.dynamicStylePrefix}button-base-root ${enabled ? 'checked' : ''}" id="${this.dynamicStylePrefix}button-base-root">
                        <input class="${this.dynamicStylePrefix}input-toggle" />
                        <span class="${this.dynamicStylePrefix}thumb"></span>
                        <span class="${this.dynamicStylePrefix}ripple"></span>
                      </span>
                      <span class="${this.dynamicStylePrefix}track ${enabled ? 'checked' : ''}" id="${this.dynamicStylePrefix}track"></span>
                    </span>
                    <span id="${this.dynamicStylePrefix}toggle-label">Automatically pass</span>
                  </div>
                  <div id="${this.dynamicStylePrefix}notification">This profile contains an exclusion.</div>
                  <div class="${this.dynamicStylePrefix}icon-button" id="${this.dynamicStylePrefix}icon-button">
                    <svg><path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z" /></svg>
                  </div>
                </div>
                <div class="${this.dynamicStylePrefix}filter-container" id="${this.dynamicStylePrefix}filter-container">
                  <p>
                    Profiles containing any of these exclusions will be blocked. All exclusions are case-insensitive.
                  </p>
                  <div class="${this.dynamicStylePrefix}filter-list">
                    ${this.buildFilterHTML()}
                  </div>
                </div>
              </div>`;

      detailsTopElement.insertAdjacentElement('afterend', filterContainer);

      const toggleElement = document.getElementById(`${this.dynamicStylePrefix}switch-root`);

      toggleElement.addEventListener('click', () => {
        this.toggleFeature();
      });

      const showFiltersButton = document.getElementById(`${this.dynamicStylePrefix}icon-button`);
      const filterContainerElement = document.getElementById(`${this.dynamicStylePrefix}filter-container`);

      showFiltersButton.addEventListener('click', () => {
        const display = filterContainerElement.style.display === 'none' || filterContainerElement.style.display === '' ? 'flex' : 'none';

        filterContainerElement.style.display = display;
      });

      [...document.querySelectorAll(`div.${this.dynamicStylePrefix}filter-item`)].forEach((el) => this.bindFilterItem(el));

      // Bind the existing list items that were loaded from local storage.
      [...document.querySelectorAll(`ul.${this.dynamicStylePrefix}exclusion-list li`)].forEach((el) => this.bindFilterListItem(el));
    }

    injectStyles() {
      const sheet = new CSSStyleSheet();

      sheet.replaceSync(this.getStyleString());

      console.debug(`${this.consolePrefix} Injecting new CSS rules.`);

      document.adoptedStyleSheets.push(sheet);
    }

    async waitForElement(selector) {
      return new Promise(resolve => {
        // Resolve immediately if the element exists.
        const existing = document.querySelector(selector);

        if (existing) {
          return resolve(existing);
        }

        const observer = new MutationObserver(() => {
          const el = document.querySelector(selector);

          if (el) {
            observer.disconnect();
            resolve(el);
          }
        });

        observer.observe(document.documentElement, {
          childList: true,
          subtree: true
        });
      });
    }

    // The userId of the currently viewed profile is not saved in the DOM.
    // It's in the React state so we have to manually manipulate the DOM to get the XHR to trigger.
    bindBlockButton(passButton) {
      const blockButtonExists = document.getElementById('user-script-block') !== null;

      if (blockButtonExists) {
        return false;
      }

      console.debug('[user script] Adding a block button.');

      const blockButton = document.createElement('button');

      blockButton.classList.add('dt-action-buttons');
      blockButton.style.cursor = 'pointer';
      blockButton.style.backgroundColor = '#1a1a1a';
      blockButton.style.color = '#fff';
      blockButton.style.display = 'flex';
      blockButton.style.alignItems = 'center';
      blockButton.style.justifyContent = 'center';
      blockButton.style.borderRadius = '50px';
      blockButton.style.height = '50px';
      blockButton.style.padding = '0 10px';
      blockButton.style.marginRight = '10px';
      blockButton.innerHTML = '<span class="dt-action-buttons-button-text" aria-hidden="true">BLOCK</span>';
      blockButton.setAttribute('id', 'user-script-block');

      passButton.closest('div.dt-action-buttons').insertAdjacentElement('afterbegin', blockButton);

      blockButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const clickEvent = new Event('click', { bubbles: true });
        const modalIcon = document.querySelector('i.okicon.i-ellipsis-v');

        if (modalIcon) {
          const modalButton = modalIcon.closest('button');

          // Open the modal dialog.
          modalButton.dispatchEvent(clickEvent);

          // The modal is in the DOM only after clicking the ellipsis button.
          const baseModal = await this.waitForElement('#BaseModal');

          if (baseModal) {
            [...baseModal.querySelectorAll('button')].forEach((el) => {
              if (el.innerText.includes('BLOCK')) {
                el.dispatchEvent(clickEvent);

                this.intervals.blockButton = setInterval(() => {
                  const closeButton = baseModal.querySelector('button[aria-label="Close block confirmation modal"]');

                  if (closeButton) {
                    clearInterval(this.intervals.blockButton);

                    closeButton.dispatchEvent(clickEvent);

                    console.debug('[user script] Successfully blocked.');
                  }
                }, 10);
              }
            });
          } else {
            console.debug('[user script] The base modal is missing.');
          }
        } else {
          console.debug('[user script] The ellipsis icon is missing.');
        }
      });
    }

    reset() {
      console.debug(`${this.consolePrefix} Resetting the script.`);

      Object.values(this.intervals).forEach((i) => clearInterval(i));

      Object.values(this.timeouts).forEach((i) => clearTimeout(i));

      this.startWatching();
    }

    async bindSections() {
      console.debug(`${this.consolePrefix} Binding to the section buttons.`);

      const buttonRecommended = await this.waitForElement('button#stack-menu-item-JUST_FOR_YOU');
      const buttonScam = await this.waitForElement('button#stack-menu-item-STANDOUTS');
      const buttonPenpal = await this.waitForElement('button#stack-menu-item-PENPAL');
      const buttonSuperLikes = await this.waitForElement('button#stack-menu-item-SUPERLIKES');
      const buttonMatchPercent = await this.waitForElement('button#stack-menu-item-MATCH_PERCENTAGE');

      for (const b of [buttonRecommended, buttonScam, buttonPenpal, buttonSuperLikes, buttonMatchPercent]) {
        // Restart this script to make sure all of our elements work and are present.
        b.addEventListener('click', ({ target }) => {
          this.reset();
        });
      }
    }

    async startWatching() {
      await this.bindSections();

      const detailsTopElement = await this.waitForElement('div.desktop-dt-top');

      // The details container now exists. Create our custom elements.
      if (detailsTopElement !== null) {
        console.debug(`${this.consolePrefix} The page check has passed. Initializing the better filtering script.`);

        this.initialize(detailsTopElement);

        this.checkProfileLoop();
      }

      const passButton = await this.waitForElement('button.dt-action-buttons-button.pass');

      if (passButton !== null) {
        console.debug(`${this.consolePrefix} The page check has passed. Initializing the block button.`);

        this.bindBlockButton(passButton);
      }
    }

    getStyleString() {
      return `
        div.${this.dynamicStylePrefix}control-container {
          display: flex;
          alignItems: center;
        }

        span.${this.dynamicStylePrefix}switch-root {
          display: inline-flex;
          width: 58px;
          height: 38px;
          overflow: hidden;
          padding: 12px;
          box-sizing: border-box;
          position: relative;
          flex-shrink: 0;
          z-index: 0;
          vertical-align: middle;
        }

        span.${this.dynamicStylePrefix}button-base-root {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          background-color: transparent;
          outline: 0px;
          border: 0px;
          margin: 0px;
          cursor: pointer;
          user-select: none;
          vertical-align: middle;
          appearance: none;
          text-decoration: none;
          padding: 9px;
          border-radius: 50%;
          position: absolute;
          top: 0px;
          left: 0px;
          z-index: 1;
          color: rgb(255, 255, 255);
          transition: left 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        span.${this.dynamicStylePrefix}button-base-root.checked {
          color: rgb(25, 118, 210);
          transform: translateX(20px);
        }

        span.${this.dynamicStylePrefix}button-base-root:hover {
          background-color: rgba(0, 0, 0, 0.04);
        }

        input.${this.dynamicStylePrefix}input-toggle {
          left: -100%;
          width: 300%;
          cursor: inherit;
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          margin: 0;
          padding: 0;
          z-index: 1;
        }

        span.${this.dynamicStylePrefix}thumb {
          box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
          background-color: currentcolor;
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }

        span.${this.dynamicStylePrefix}ripple {
          overflow: hidden;
          pointer-events: none;
          position: absolute;
          z-index: 0;
          inset: 0px;
          border-radius: inherit;
        }

        span.${this.dynamicStylePrefix}track {
          height: 100%;
          width: 100%;
          border-radius: 7px;
          z-index: -1;
          transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
          background-color: rgb(0, 0, 0);
          opacity: 0.38;
        }

        span.${this.dynamicStylePrefix}track.checked {
          background-color: rgb(25, 118, 210);
        }

        div.${this.dynamicStylePrefix}icon-button {
          width: 32px;
          height: 32px;
          border: 1px solid silver;
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        div.${this.dynamicStylePrefix}icon-button:hover {
          background-color: rgb(246 246 246);
        }

        div.${this.dynamicStylePrefix}icon-button:hover svg {
          fill: rgb(25, 118, 210);
        }

        div.${this.dynamicStylePrefix}icon-button svg {
          width: 24px;
          height: 24px;
        }

        div.${this.dynamicStylePrefix}filter-container {
          display: none;
          flex-direction: column;
          gap: 1em;
          border-top: 1px solid black;
          padding: 1em;
          margin-top: 1em;
        }

        div.${this.dynamicStylePrefix}filter-list {
          display: flex;
          flex-basis: auto;
          justify-content: center;
          gap: 1em;
          flex-wrap: wrap;
        }

        div.${this.dynamicStylePrefix}filter-item {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
          border: 1px solid grey;
          border-radius: 4px;
          width: 260px;
          height: 200px;
          padding: 3px;
        }

        div.${this.dynamicStylePrefix}filter-addition {
          display: flex;
          gap: 2px;
          align-items: center;
          border-bottom: 1px dashed black;
        }

        div.${this.dynamicStylePrefix}filter-addition svg {
          width: 32px;
          height: 32px;
        }

        div.${this.dynamicStylePrefix}filter-addition input {
          width: 100%;
        }

        ul.${this.dynamicStylePrefix}exclusion-list {
          list-style: none;
          overflow: scroll;
        }

        ul.${this.dynamicStylePrefix}exclusion-list li {
          cursor: pointer;
        }

        ul.${this.dynamicStylePrefix}exclusion-list li:hover {
          text-decoration: line-through;
          background-color: rgb(246 246 246);
        }

        div#${this.dynamicStylePrefix}notification {
          display: none;
          flex-grow: 1;
          font-style: italic;
          color: red;
        }

        li.${this.dynamicStylePrefix}exclusion.found {
          color: red;
        }

        .${this.dynamicStylePrefix}hidden {
          display: none !important;
        }`;
    }
  }

  new OkCupidBetterFiltering();
})();
