// ==UserScript==
// @name         JSON Response Formatter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle between beautified and raw JSON display at top of the page, with copy functionality.
// @author       taky@taky.com
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507516/JSON%20Response%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/507516/JSON%20Response%20Formatter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Set to false if you don't want to beautify JSON by default
  const autoBeautify = true;

  function createLink(textContent, active, onclickHandler) {
    let link = document.createElement('a');
    link.style.fontFamily = 'monospace';
    link.style.color = 'blue';
    link.style.textDecoration = active ? 'underline' : 'none';
    link.style.cursor = 'pointer';
    link.style.display = 'inline';
    link.style.marginRight = '10px';
    link.textContent = textContent.toLowerCase();
    link.href = '#';
    link.onclick = onclickHandler;
    return link;
  }

  function initializeJsonFormatter() {
    let content = document.body.innerText.trim();
    let firstChar = content.charAt(0);

    if (firstChar === '{' || firstChar === '[') {
      try {
        let json = JSON.parse(content);

        let rawPre = document.createElement('pre');
        let beautifiedPre = document.createElement('pre');

        rawPre.style.fontFamily = 'monospace';
        rawPre.style.margin = '0';
        rawPre.style.padding = '0';
        rawPre.textContent = content;

        beautifiedPre.style.fontFamily = 'monospace';
        beautifiedPre.style.margin = '0';
        beautifiedPre.style.padding = '0';
        beautifiedPre.textContent = JSON.stringify(json, null, 2);

        if (!autoBeautify) {
          beautifiedPre.style.display = 'none';
        } else {
          rawPre.style.display = 'none';
        }

        let toggleRaw = function(e) {
          e.preventDefault();
          beautifiedPre.style.display = 'none';
          rawPre.style.display = 'block';
          rawLink.style.textDecoration = 'underline';
          beautifiedLink.style.textDecoration = 'none';
        };

        let toggleBeautified = function(e) {
          e.preventDefault();
          beautifiedPre.style.display = 'block';
          rawPre.style.display = 'none';
          rawLink.style.textDecoration = 'none';
          beautifiedLink.style.textDecoration = 'underline';
        };

        let copyVisibleContent = function(e) {
          e.preventDefault();
          let contentToCopy = beautifiedPre.style.display === 'block' ? beautifiedPre.textContent : rawPre.textContent;
          navigator.clipboard.writeText(contentToCopy).then(function() {
            copyLink.textContent = 'copied';
            setTimeout(function() {
              copyLink.textContent = 'copy';
            }, 1000);
          }, function(err) {
            copyLink.textContent = 'failed to copy';
            setTimeout(function() {
              copyLink.textContent = 'copy';
            }, 1000);
            console.error('Could not copy text: ', err);
          });
        };

        let rawLink = createLink('Raw', !autoBeautify, toggleRaw);
        let beautifiedLink = createLink('Beautified', autoBeautify, toggleBeautified);
        let copyLink = createLink('Copy', false, copyVisibleContent);

        let linksContainer = document.createElement('div');
        linksContainer.style.marginBottom = '10px';
        linksContainer.appendChild(rawLink);
        linksContainer.appendChild(beautifiedLink);
        linksContainer.appendChild(copyLink);

        document.body.innerHTML = '';
        document.body.appendChild(linksContainer);
        document.body.appendChild(rawPre);
        document.body.appendChild(beautifiedPre);
      } catch (e) {
        // console.error('Document is not pure JSON: ', e);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeJsonFormatter);
  } else {
    initializeJsonFormatter();
  }
})();