// ==UserScript==
// @name         Youtube Save To Playlist Hotkey And Filter
// @namespace    https://gist.github.com/f-steff
// @version      1.2
// @description  Adds a P hotkey to Youtube, to bring up the Save to Playlist dialog. Playlists will be displayed alfabetically sorted, any any playlist the current video belongs to, will be shown at the top. Also adds a focuced filter input field. If nothing is written into the filter input, all playlists will be shown, alternatively only the playlists where the name containes the sequence of letters typed in the input field, will be displayed. Press escape to exit the dialog.
// @author       Flemming Steffensen
// @license MIT
// @match        http://www.youtube.com/*
// @match        https://www.youtube.com/*
// @include      http://www.youtube.com/*
// @include      https://www.youtube.com/*
// @grant        none
// @homepageURL  https://gist.github.com/f-steff/4d765eef037e9b751c58d43490ebad62
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522448/Youtube%20Save%20To%20Playlist%20Hotkey%20And%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/522448/Youtube%20Save%20To%20Playlist%20Hotkey%20And%20Filter.meta.js
// ==/UserScript==

(function (d) {

  /**
   * Pressing 'p' simulates a click on YouTube's "Save" button to open the dialog.
   */
  function openSaveToPlaylistDialog() {
    // Commonly, there's a button with aria-label="Save" or aria-label^="Save"
    // near the Like/Dislike/Share row on the watch page.
    const saveButton = d.querySelector('button[aria-label^="Save"]');
    if (saveButton) {
      saveButton.click();
    } else {
      console.log("Could not find 'Save' button. Adjust the selector if needed.");
    }
  }
  
 // Listen for the 'p' key at the document level
d.addEventListener('keydown', evt => {
  // Avoid capturing if user holds Ctrl/Alt/Meta, or if in a text field, etc.
  if (
      evt.key === 'p' &&
      !evt.ctrlKey &&
      !evt.altKey &&
      !evt.metaKey &&
      evt.target.tagName !== 'INPUT' &&
      evt.target.tagName !== 'TEXTAREA' && evt.target.contentEditable !== "true"
  ) {
      // Prevent YouTube from interpreting 'p' in any other way
      evt.preventDefault();
      evt.stopPropagation();

      // Attempt to open the "Save to playlist" dialog
      openSaveToPlaylistDialog();
  }
}, true);

  /**
   * Sort playlists such that:
   *   - checked items (aria-checked="true") come first,
   *   - then everything else in alphabetical (0-9,A→Z).
   */
  function sortPlaylist(playlist) {
    let options = query(playlist, 'ytd-playlist-add-to-option-renderer');
    let optionsMap = new Map();

    // Collect items by playlist title
    options.forEach(op => {
      let formattedString = query(op, 'yt-formatted-string')[0];
      let title = formattedString?.getAttribute('title') || '';
      if (!optionsMap.has(title)) {
        optionsMap.set(title, []);
      }
      optionsMap.get(title).push(op);
    });

    // Sort so "checked" groups come first, then A→Z
    let sortedEntries = [...optionsMap.entries()].sort(([titleA, groupA], [titleB, groupB]) => {
      const checkedA = groupA.some(
        op => query(op, 'tp-yt-paper-checkbox[aria-checked="true"]').length
      );
      const checkedB = groupB.some(
        op => query(op, 'tp-yt-paper-checkbox[aria-checked="true"]').length
      );

      if (checkedA && !checkedB) return -1;
      if (checkedB && !checkedA) return 1;

      // Otherwise alphabetical
      const upA = titleA.toUpperCase();
      const upB = titleB.toUpperCase();
      if (upA < upB) return -1;
      if (upA > upB) return 1;
      return 0;
    });

    // Re-insert items in sorted order
    for (const [, group] of sortedEntries) {
      for (const opNode of group) {
        playlist.appendChild(opNode);
      }
    }
  }

  /**
   * Filter all playlist entries based on user-typed substring.
   * If the filter is blank, show everything; otherwise hide non-matches.
   */
  function filterPlaylist(playlist, filterText) {
    let options = query(playlist, 'ytd-playlist-add-to-option-renderer');
    const text = filterText.trim().toLowerCase();

    options.forEach(op => {
      let formattedString = query(op, 'yt-formatted-string')[0];
      let title = (formattedString?.getAttribute('title') || '').toLowerCase();
      op.style.display = (text && !title.includes(text)) ? 'none' : 'block';
    });
  }

  /**
   * When the dialog closes, re-attach the observer so we see the next open event.
   */
  function observePaperDialogClose(paperDialog, onCloseDialog) {
    let ob = new MutationObserver((mutations, me) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
          me.disconnect();
          onCloseDialog();
        }
      });
    });
    ob.observe(paperDialog, { attributes: true });
  }

  /**
   * Main logic: watch for the "Add to Playlist" dialog, then
   * Insert input, sort once, filter, focus the input, etc.
   * Added a small setTimeout to avoid first-time invocation timing issues.
   */
  function handlePopupContainer(popupContainer) {
    let currentFilter = '';
    const popupObserverConfig = { subtree: true, childList: true };

    const popupContainerObserver = new MutationObserver(function (mut, me) {
      // Defer so the DOM has time to settle on first invocation
      setTimeout(() => {
        const paperDialog = query(popupContainer, 'tp-yt-paper-dialog')[0];
        if (paperDialog) {
          // Sort/insert only once per open
          me.disconnect();

          // Re-attach after closing
          observePaperDialogClose(paperDialog, function () {
            popupContainerObserver.observe(popupContainer, popupObserverConfig);
          });

          // Look for "Save video to..."
          const headingSpan = query(
            paperDialog,
            'span.yt-core-attributed-string[role="text"]'
          ).find(el => el.textContent.trim() === 'Save video to...');

          // Grab #playlists container
          const playlistContainer = query(paperDialog, '#playlists')[0];

          if (headingSpan && playlistContainer) {
            // If we haven't inserted our input yet, do it now
            const existingFilterInput = d.getElementById('filterText');
            if (!existingFilterInput) {
              // Create <input> and <br>
              const filterInput = d.createElement('input');
              filterInput.id = 'filterText';
              filterInput.type = 'text';
              filterInput.placeholder = 'Filter';

              const br = d.createElement('br');

              headingSpan.parentNode.appendChild(filterInput);
              headingSpan.parentNode.appendChild(br);

              // On typing => filter
              filterInput.addEventListener('input', evt => {
                currentFilter = evt.target.value;
                filterPlaylist(playlistContainer, currentFilter);
              });
            }

            // Sort once for this session
            sortPlaylist(playlistContainer);

            // Re-apply current filter (if any)
            filterPlaylist(playlistContainer, currentFilter);

            // Focus
            const input = d.getElementById('filterText');
            if (input) {
              input.focus();
            }
          }
        }
      }, 10); // 10ms delay
    });

    // Start observing
    popupContainerObserver.observe(popupContainer, popupObserverConfig);
  }

  /**
   * A top-level observer that waits for <ytd-popup-container> to show up,
   * then calls handlePopupContainer() exactly once.
   */
  const documentObserver = new MutationObserver(function (mutations, me) {
    const popupContainer = query(d, 'ytd-popup-container')[0];
    if (popupContainer) {
      console.log("Found ytd-popup-container");
      handlePopupContainer(popupContainer);
      me.disconnect(); // stop once found
    }
  });
  documentObserver.observe(d, { childList: true, subtree: true });

  /**
   * Helper: safely do querySelectorAll, returns an Array
   */
  function query(startNode, selector) {
    try {
      return Array.prototype.slice.call(startNode.querySelectorAll(selector));
    } catch (e) {
      return [];
    }
  }

})(document);