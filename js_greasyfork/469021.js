// ==UserScript==
// @name         Sortable Players Table with Persistence and Reset
// @namespace    RyanCane26
// @version      1.0
// @description  Enables sorting and rearranging players in the table on GLB website with persistence across page refreshes, and provides a "Reset" button to restore the original order
// @match        https://glb.warriorgeneral.com/game/home.pl
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/469021/Sortable%20Players%20Table%20with%20Persistence%20and%20Reset.user.js
// @updateURL https://update.greasyfork.org/scripts/469021/Sortable%20Players%20Table%20with%20Persistence%20and%20Reset.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Add jQuery and jQuery UI
  const jqueryUrl = 'https://code.jquery.com/jquery-3.6.0.min.js';
  const jqueryUiUrl = 'https://code.jquery.com/ui/1.12.1/jquery-ui.js';

  function addScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function loadScripts() {
    try {
      await addScript(jqueryUrl);
      await addScript(jqueryUiUrl);
      initSortable();
    } catch (error) {
      console.error('Failed to load scripts:', error);
    }
  }

  // Initialize Sortable functionality
  function initSortable() {
    GM_addStyle(`
      .sortable-table tbody tr {
        cursor: move;
      }
    `);

    const playerTable = $("#playerTable tbody");
    const savedOrder = localStorage.getItem('playerTableOrder');
    if (savedOrder) {
      playerTable.html(savedOrder);
    }

    playerTable.sortable({
      handle: ".list_name",
      cursor: "move",
      placeholder: "ui-state-highlight",
      forcePlaceholderSize: true,
      opacity: 0.6,
      tolerance: "pointer",
      start: function(e, ui) {
        ui.item.addClass("sorting");
      },
      stop: function(e, ui) {
        ui.item.removeClass("sorting");
        saveTableOrder();
      },
    });

    addResetButton();
  }

  function saveTableOrder() {
    const playerTable = $("#playerTable tbody");
    const orderHtml = playerTable.html();
    localStorage.setItem('playerTableOrder', orderHtml);
    updateMessageCount();
  }

  function resetTableOrder() {
    localStorage.removeItem('playerTableOrder');
    location.reload();
  }

  function addResetButton() {
    const toolbar = $("#toolbar");
    const resetButton = $('<a class="toolbar_item">Reset</a>');
    resetButton.on('click', resetTableOrder);
    toolbar.append(resetButton);
  }

  function updateMessageCount() {
    const messageCount = $("#messageCount");
    const count = messageCount.text().match(/\((\d+)\)/);
    if (count) {
      messageCount.text(` (${count[1]})`);
    }
  }

  // Load the required scripts and initialize Sortable
  loadScripts();
})();
