// ==UserScript==
// @name         VGMdb Metadata copy
// @namespace    https://vgmdb.net/
// @version      1.8
// @description  Adds copy buttons to the VGMdb album pages to easily copy metadata.
// @author       kahpaibe
// @match        https://vgmdb.net/album/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532969/VGMdb%20Metadata%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/532969/VGMdb%20Metadata%20copy.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const PREFIX = '';
  const SUFFIX = '';

  // Helper function to style buttons consistently
  const styleButton = (button) => {
    button.title = 'Copy this text to clipboard';
    button.style.marginLeft = '8px';
    button.style.padding = '1px 6px';
    button.style.fontSize = '0.75em';
    button.style.color = '#CEFFFF';
    button.style.background = 'transparent';
    button.style.border = '1px solid #CEFFFF';
    button.style.cursor = 'pointer';
    button.style.transition = 'background 0.3s, color 0.3s';
    button.style.verticalAlign = 'middle';
  };

  // Helper function to create and append a "COPY" button next to a field
  const addCopyButton = (innerText, labelText, selector, tooltipText, fieldValue) => {
    const rows = document.querySelectorAll('#album_infobit_large tr');

    rows.forEach(row => {
      const labelCell = row.querySelector('td span.label b');
      if (labelCell && labelCell.textContent.trim() === labelText) {
        const valueCell = row.cells[1];
        let field = fieldValue || valueCell.textContent.trim();
        if (selector) {
          const link = valueCell.querySelector(selector);
          if (link) {
            field = link.textContent.trim();
          }
        }

        const button = document.createElement('span');
        button.innerText = innerText;  // Set innerText here
        button.title = tooltipText;
        styleButton(button);

        button.onclick = () => {
          navigator.clipboard.writeText(field).then(() => {
            const original = button.innerText;
            button.innerText = '✔ COPIED';
            setTimeout(() => button.innerText = original, 1500);
          });
        };

        labelCell.parentElement.appendChild(button);
      }
    });
  };

  // Function to handle Release Date buttons
  const addReleaseDateButtons = () => {
    const rows = document.querySelectorAll('#album_infobit_large tr');
    const releaseDateRow = Array.from(rows).find(row => {
      const labelCell = row.querySelector('td span.label b');
      return labelCell && labelCell.textContent.trim() === 'Release Date';
    });

    if (!releaseDateRow) return;

    const valueCell = releaseDateRow.cells[1];
    const dateLink = valueCell.querySelector('a[title^="View albums released on"]');
    const eventLink = valueCell.querySelector('a.link_event');

    let formattedDate = '';
    if (dateLink) {
      const releaseDateStr = dateLink.textContent.trim();
      const dateObj = new Date(releaseDateStr);
      formattedDate = `${dateObj.getFullYear()}.${('0' + (dateObj.getMonth() + 1)).slice(-2)}.${('0' + dateObj.getDate()).slice(-2)}`;
      addCopyButton('⎘', 'Release Date', null, 'Copy Release Date to clipboard', formattedDate);
    }

    let event = '';
    if (eventLink) {
      event = eventLink.textContent.trim();
      addCopyButton('⎘', 'Release Date', null, 'Copy Event to clipboard', event);
    }

    if (dateLink) {
      const combined = event ? `[${formattedDate}][${event}]` : `[${formattedDate}]`;
      addCopyButton('⎘', 'Release Date', null, 'Copy formatted release date to clipboard', combined);
    }
  };

  const addTitleCopyButtons = () => {
    const visibleTitles = document.querySelectorAll('.albumtitle');

    visibleTitles.forEach(span => {
      const computedStyle = window.getComputedStyle(span);
      if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
        return;
      }

      // Skip titles inside <a> tags (like in the album thumb list)
      if (span.closest('a')) {
        return;
      }

      const fragments = [];
      let currentText = '';

      // Break apart the nodes and <br> inside this span
      span.childNodes.forEach(node => {
        if (node.nodeName === 'BR') {
          if (currentText.trim()) fragments.push(currentText.trim());
          fragments.push('<br>');
          currentText = '';
        } else if (node.nodeType === Node.TEXT_NODE) {
          currentText += node.textContent;
        } else {
          currentText += node.outerHTML || node.textContent;
        }
      });

      if (currentText.trim()) {
        fragments.push(currentText.trim());
      }

      // Clear the span and re-inject each line with its own copy button
      span.innerHTML = '';

      fragments.forEach(fragment => {
        if (fragment === '<br>') {
          span.appendChild(document.createElement('br'));
          return;
        }

        const lineSpan = document.createElement('span');
        lineSpan.textContent = fragment;

        const button = document.createElement('button');
        styleButton(button);
        button.innerText = '⎘';  // Ensure button has text
        button.title = 'Copy this title to clipboard';

        button.addEventListener('click', () => {
          navigator.clipboard.writeText(fragment).then(() => {
            const original = button.innerText;
            button.innerText = '✔ COPIED!';
            setTimeout(() => button.innerText = original, 1000);
          });
        });

        span.appendChild(lineSpan);
        span.appendChild(button);

        // Add a second button for copying formatted string
        const formattedStringButton = document.createElement('button');
        styleButton(formattedStringButton);
        formattedStringButton.innerText = '⎘'; // Same button style
        formattedStringButton.title = 'Copy formatted album info to clipboard';

        // Fetch Publisher and Catalog Number dynamically within the context
        const publisherCell = Array.from(document.querySelectorAll('td span.label b')).find(b => b.textContent.trim() === 'Publisher');
        const publisher = publisherCell ? publisherCell.closest('tr').querySelector('td:nth-child(2)').textContent.trim() : '';

        const catalogNumberCell = Array.from(document.querySelectorAll('td span.label b')).find(b => b.textContent.trim() === 'Catalog Number');
        const catalogNumber = catalogNumberCell ? catalogNumberCell.closest('tr').querySelector('td:nth-child(2)').textContent.trim() : '';


        // Re-fetch Release Date and Event here to avoid assumptions
        const rows = document.querySelectorAll('#album_infobit_large tr');
        let formattedDate = '';
        let event = '';

        rows.forEach(row => {
          const labelCell = row.querySelector('td span.label b');
          if (labelCell && labelCell.textContent.trim() === 'Release Date') {
            const valueCell = row.cells[1];
            const dateLink = valueCell.querySelector('a[title^="View albums released on"]');
            const eventLink = valueCell.querySelector('a.link_event');

            if (dateLink) {
              const releaseDateStr = dateLink.textContent.trim();
              const dateObj = new Date(releaseDateStr);
              formattedDate = `${dateObj.getFullYear()}.${('0' + (dateObj.getMonth() + 1)).slice(-2)}.${('0' + dateObj.getDate()).slice(-2)}`;
            }

            if (eventLink) {
              event = eventLink.textContent.trim();
            }
          }
        });

        // Construct the formatted string
        let formattedString = PREFIX;
        formattedString += `[${formattedDate}]`;
        if (event) {
          formattedString += `[${event}]`;
        }
        if (publisher) {
          formattedString += ` ${publisher} -`;
        }
        formattedString += ` ${fragment}`;
        if (catalogNumber) {
          formattedString += ` {${catalogNumber}}`;
        } else {
          formattedString += ' {nocat#}';
        }
        formattedString += SUFFIX;


        formattedStringButton.addEventListener('click', () => {
          navigator.clipboard.writeText(formattedString).then(() => {
            const original = formattedStringButton.innerText;
            formattedStringButton.innerText = '✔ COPIED!';
            setTimeout(() => formattedStringButton.innerText = original, 1000);
          });
        });

        // Append button to the DOM (you can adjust where this button goes)
        document.body.appendChild(formattedStringButton);

        span.appendChild(formattedStringButton);

      });
    });
  };


  // Main function to initialize the copy buttons
  const initializeCopyButtons = () => {
    // Add metadata buttons
    addCopyButton('⎘', 'Catalog Number', null, 'Copy Catalog Number to clipboard');
    addCopyButton('⎘', 'Publisher', '.productname', 'Copy Publisher to clipboard');
    addReleaseDateButtons();  // Add the buttons for Release Date, Event, and Date+Event

    // Add inline copy buttons for album titles and secondary names
    addTitleCopyButtons();
  };

  // Initialize the script
  initializeCopyButtons();

})();
