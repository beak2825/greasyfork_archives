// ==UserScript==
// @name         OC's 2.0 Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reorder OC's and show a list of slackers in Torn
// @author       Apollyon
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/523387/OC%27s%2020%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/523387/OC%27s%2020%20Enhancer.meta.js
// ==/UserScript==


(function () {
  'use strict';

  const API_KEY = "APIKEYHERE";
  const INACTIVE_TIME_LIMIT = 3; // Days of inactivity to filter
  let isProcessing = false;
  let inactiveFilter = false;

  function isCrimesTab() {
    return location.href.indexOf("tab=crimes") !== -1;
  }

  // Faction Slackers Panel Creation
  const factionTabs = document.querySelector('.faction-tabs.ui-tabs-nav.ui-helper-reset.ui-helper-clearfix.ui-widget-header.ui-corner-all');

  function createSlackersPanel() {
    if (document.querySelector('#Slackers')) return;

    const panelWrapper = document.createElement('div');
    panelWrapper.id = 'Slackers';
    panelWrapper.className = 'border-round';
    panelWrapper.setAttribute('role', 'heading');
    panelWrapper.setAttribute('aria-level', '6');

    // Add custom styling for panel
    const style = document.createElement('style');
    style.innerHTML = `
      .active.title-toggle .arrow {
        background-position: 0 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #999;
        margin-top: 13px;
        margin-right: 12px;
      }
      .active.title-toggle:hover .arrow {
        background-position: 0 -14px;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #ddd;
        border-top-color: var(--panel-divider-outer-side-color);
        margin-top: 13px;
        margin-right: 12px;
      }
      .title-toggle .arrow {
        background-position: -14px 0;
        border-left: 5px solid #999;
        border-bottom: 5px solid transparent;
        border-top: 5px solid transparent;
        margin-top: 10px;
        margin-right: 14px;
      }
      .title-toggle:hover .arrow {
        background-position: -14px -14px;
        border-left: 5px solid #ddd;
        border-left-color: var(--panel-divider-outer-side-color);
        margin-top: 10px;
        margin-right: 14px;
      }
      .arrow {
        height: 14px;
        width: 14px;
        float: right;
        margin-top: 8px;
        margin-right: 10px;
        background: url(/images/v2/forums/dropdown/arrows.png) 0 0 no-repeat;
        cursor: pointer;
        width: 0px;
        height: 0px;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #999;
        margin-top: 13px;
      }
    `;
    document.head.appendChild(style);

    const panelTitle = createPanelTitle();
    const membersList = createMembersList();
    membersList.style.display = 'none'; // Initially collapse the members list

    panelWrapper.appendChild(panelTitle);
    panelWrapper.appendChild(membersList);

    if (factionTabs && factionTabs.parentNode) {
      factionTabs.parentNode.insertBefore(panelWrapper, factionTabs.nextSibling);
    }

    addPanelToggleFunctionality(panelWrapper);
  }

  // Create title for the panel
  function createPanelTitle() {
    const titleDiv = document.createElement('div');
    titleDiv.className = 'border-round m-top10 title-black title-toggle'; // Removed 'active'
    titleDiv.setAttribute('role', 'button');
    titleDiv.setAttribute('aria-expanded', 'false');
    titleDiv.innerHTML = `
      <i class="arrow"></i>
      Slackers
    `;
    return titleDiv;
  }

  // Create the members list
  function createMembersList() {
    const panelUl = document.createElement('ul');
    panelUl.className = 'panel fm-list cont-gray bottom-round';

    const listItem = document.createElement('li');
    listItem.className = 'rating w2';
    listItem.style.height = 'auto';
    listItem.style.padding = '10px';

    const membersUl = document.createElement('ul');
    membersUl.style.display = 'grid';
    membersUl.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
    membersUl.style.gap = '10px';
    membersUl.style.listStyleType = 'none';
    membersUl.style.padding = '0';
    membersUl.style.margin = '0';

    listItem.appendChild(membersUl);
    panelUl.appendChild(listItem);

    return panelUl;
  }

  // Add the toggle functionality for the panel
  function addPanelToggleFunctionality(panelWrapper) {
    panelWrapper.addEventListener('click', function (event) {
      if (event.target.classList.contains('title-toggle')) {
        event.target.classList.toggle('active');
        const nextElement = event.target.nextElementSibling;
        if (nextElement) {
          nextElement.style.display = nextElement.style.display === 'none' ? '' : 'none';
        }
      }
    });
  }

  // Fetch and process the member data
  async function loadMemberData() {
    if (isProcessing || document.querySelector('.wrapper')) return;
    isProcessing = true;

    const members = await getFilteredMembers();
    const membersUl = document.querySelector('#Slackers .rating ul');

    // Clear and append new members
    membersUl.innerHTML = '';
    Object.entries(members).forEach(([id, name]) => {
      const memberLi = createMemberListItem(id, name);
      membersUl.appendChild(memberLi);
    });

    isProcessing = false;
  }

  // Create list item for each member
  function createMemberListItem(id, name) {
    const li = document.createElement('li');
    li.style.padding = '8px';
    li.style.border = '1px solid #ccc';
    li.style.borderRadius = '6px';
    li.style.textAlign = 'center';
    li.style.color = 'inherit';
    li.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    li.style.transition = 'background-color 0.2s, box-shadow 0.2s'; // Hover effects

    const link = document.createElement('a');
    link.href = `https://www.torn.com/profiles.php?XID=${id}`;
    link.textContent = `[${id}] ${name}`;
    link.target = '_blank';
    link.style.textDecoration = 'none';
    link.style.color = 'inherit';

    li.appendChild(link);
    return li;
  }

  async function getFilteredMembers() {
    try {
      const unixTimestamp = Math.floor(Date.now() / 1000);
      const excludedUserIDs = new Set();

      const response = await fetch(`https://api.torn.com/v2/faction/members,crimes?key=${API_KEY}&cat=available&offset=0`);
      const data = await response.json();

      const members = data.members.reduce((acc, member) => {
        if (member.position !== 'Recruit') {
          if (inactiveFilter) {
            if (unixTimestamp - member.last_action.timestamp <= (INACTIVE_TIME_LIMIT * 86400)) {
              acc[member.id] = member.name;
            }
          } else {
            acc[member.id] = member.name;
          }
        }
        return acc;
      }, {});

      data.crimes.forEach(crime => {
        crime.slots.forEach(slot => {
          if (slot.user_id) excludedUserIDs.add(slot.user_id);
        });
      });

      return Object.fromEntries(
        Object.entries(members).filter(([userID]) => !excludedUserIDs.has(Number(userID)))
      );

    } catch {
      return [];
    }
  }

  function reorderOCs() {
    const spans = document.querySelectorAll('span[class^="levelValue_"]');

    function getNthParent(element, n) {
      let current = element;
      for (let i = 0; i < n; i++) {
        if (current.parentElement) {
          current = current.parentElement;
        } else {
          return null;
        }
      }
      return current;
    }

    const parents = Array.from(spans).map(span => getNthParent(span, 7)).filter(Boolean);
    const uniqueParents = [...new Set(parents)];

    uniqueParents.sort((a, b) => {
      const valueA = a.querySelector('span[class^="levelValue_"]').textContent;
      const valueB = b.querySelector('span[class^="levelValue_"]').textContent;
      return valueB.localeCompare(valueA);
    });

    if (uniqueParents.length > 0) {
      const parentContainer = uniqueParents[0].parentElement;
      uniqueParents.forEach(parent => {
        parentContainer.appendChild(parent);
      });
    }
  }

  function startPeriodicCheck() {
    setInterval(() => {
      if (isCrimesTab()) {
        reorderOCs();
      }
    }, 100); // Check every 5 seconds
  }

  function checkFactionTab() {
    if (isCrimesTab()) {
      createSlackersPanel();
      loadMemberData();
      reorderOCs();
    }
  }

  function init() {
    if (isCrimesTab()) {
      setTimeout(() => {
        reorderOCs(); // Initial reorder
      }, 2000);
      startPeriodicCheck(); // Start the periodic check
    }
  }

  init();
  window.addEventListener('hashchange', () => {
    init();
    checkFactionTab();
  });
})();
