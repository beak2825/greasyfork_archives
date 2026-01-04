// ==UserScript==
// @name         GGn Advanced Torrent Filters
// @namespace   http://tampermonkey.net/
// @version      1.0
// @description  Adds a filter for snatched/seeded/external linked torrents in ggn's torrent browse.
// @author       Animaker
// @icon         https://icons.duckduckgo.com/ip3/gazellegames.net.ico
// @match        https://gazellegames.net/torrents.php*
// @exclude      https://gazellegames.net/torrents.php*id=*
// @exclude      https://gazellegames.net/torrents.php*action=basic*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526624/GGn%20Advanced%20Torrent%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/526624/GGn%20Advanced%20Torrent%20Filters.meta.js
// ==/UserScript==

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const TOGGLE_IDS = ['toggle_color_snatched', 'toggle_color_seeding', 'toggle_hide_external_links'];

    const saveToggleStates = () => {
      const toggleStates = {};
      TOGGLE_IDS.forEach(id => {
        const toggle = document.querySelector(`#${id}`);
        if (toggle) {
          toggleStates[id] = toggle.checked;
        }
      });
      localStorage.setItem('filterToggleStates', JSON.stringify(toggleStates));
    };

    const loadToggleStates = () => {
      const toggleStates = JSON.parse(localStorage.getItem('filterToggleStates') || '{}');
      TOGGLE_IDS.forEach(id => {
        const toggle = document.querySelector(`#${id}`);
        if (toggle && toggleStates[id] !== undefined) {
          toggle.checked = toggleStates[id];
        }
      });
    };

    const addFilterToggles = () => {
      const referenceRow = document.querySelector('tr#edition_title');
      if (!referenceRow) return;

      if (document.querySelector(`#${TOGGLE_IDS[0]}`)) return;

      const filterRow = document.createElement('tr');
      filterRow.innerHTML = `
        <td class="label">Filter Options:</td>
        <td colspan="7">
          <label for="toggle_color_snatched">Hide Snatched</label>
          <input type="checkbox" id="toggle_color_snatched">
          <label for="toggle_color_seeding">Hide Seeding</label>
          <input type="checkbox" id="toggle_color_seeding">
          <label for="toggle_hide_external_links">Hide External Links</label>
          <input type="checkbox" id="toggle_hide_external_links">
          <input type="submit" name="setdefault" value="Make Default" id="make_default_button">
        </td>
      `;
      referenceRow.parentNode.insertBefore(filterRow, referenceRow.nextSibling);
    };

    const applyFiltersToPage = () => {
      const hideSnatched = document.querySelector('#toggle_color_snatched')?.checked || false;
      const hideSeeding = document.querySelector('#toggle_color_seeding')?.checked || false;
      const hideExternalLinks = document.querySelector('#toggle_hide_external_links')?.checked || false;

      document.querySelectorAll('tr[class*="groupid_"][class*="edition_"]').forEach(row => {
        let shouldHide = false;
        const colorElement = row.querySelector('a>#color_snatched, a>#color_seeding');
        if ((hideSnatched && colorElement?.id === 'color_snatched') ||
            (hideSeeding && colorElement?.id === 'color_seeding')) {
          shouldHide = true;
        }

        if (hideExternalLinks && row.querySelector('a[title="External Link"]')) {
          shouldHide = true;
        }

        row.style.display = shouldHide ? 'none' : '';
      });
    };

    const observeAndHandleMutations = () => {
      const observer = new MutationObserver(() => {
        addFilterToggles();
        applyFiltersToPage();
      });
      observer.observe(document, { childList: true, subtree: true });
    };

    addFilterToggles();
    loadToggleStates();
    applyFiltersToPage();
    observeAndHandleMutations();

    document.addEventListener('change', event => {
      if (TOGGLE_IDS.includes(event.target.id)) {
        applyFiltersToPage();
      }
    });

    document.addEventListener('click', event => {
      if (event.target.id === 'make_default_button') {
        saveToggleStates();
        alert('Filter states have been saved as default!');
      }
    });
  });
})();