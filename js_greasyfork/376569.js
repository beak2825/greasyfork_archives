// ==UserScript==
// @name         Trello Cards Hyperlinks
// @namespace    https://github.com/micalevisk/GM_scripts
// @supportURL   https://github.com/micalevisk/GM_scripts/tree/master/Trello_Cards_Hyperlinks
// @version      2.0
// @description  Adds support for clickable hyperlinks in your Trello card titles.
// @author       Micael Levi
// @copyright    2019, micalevisk (https://openuserjs.org//users/micalevisk)
// @license      MIT
// @match        *://trello.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/376569/Trello%20Cards%20Hyperlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/376569/Trello%20Cards%20Hyperlinks.meta.js
// ==/UserScript==

(function($) {

  // Visualize this expression here: https://bit.ly/2FpWz2V
  const REGEX_URL = /\b(?:(https?:\/\/(?:www\.)?)|(www\.))([-a-z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-z0-9@:%_\+.~#?&\/\/=]*))/ig;
  const REGEX_LINK_LABEL = /^\s+\(([^\)]+)\)/;

  window.document.addEventListener('load', dispatchRender, true);
  window.document.addEventListener('blur', dispatchRender, true);

  function dispatchRender() {
    window.setTimeout(renderCardLinks, 0);
    // requestAnimationFrame(renderCardLinks);
  }

  const makeLinkMarkup = (href, title, label = title) => `<a class='tcards-title-link' onclick='event.stopPropagation();' href='${href}' title='${title}' target='_blank' rel='noopener'>${label}</a>`;

  function parseNode(nodeElement, placeholdersLookupRef) {
    if (nodeElement.nodeType !== 3) return; // only text nodes

    const text = nodeElement.data;
    const textWithPlaceholders = text.replace(REGEX_URL, (match, protocol, www, rest, startIndex) => {
      const url = (protocol || '//' + www) + rest;
      const placeholder = `§${Date.now() - startIndex}§`;

      placeholdersLookupRef.push({
        placeholder,
        makeNewMarkup: makeLinkMarkup.bind(null, url, match) // Using partial application
      });

      return placeholder;
    });

    nodeElement.textContent = textWithPlaceholders;
  }

  function updateNode(nodeElement) {
    const placeholdersLookup = [];

    for (const child of nodeElement.childNodes) parseNode(child, placeholdersLookup);
    if (!placeholdersLookup.length) return;

    nodeElement.innerHTML = placeholdersLookup.reduce(
      (withLinks, {placeholder, makeNewMarkup}) => {

        const placeholderStartIdx = withLinks.search(placeholder);
        const contentAfterPlaceholder = withLinks.substr(placeholderStartIdx + placeholder.length);

        const matchLabel = contentAfterPlaceholder.match(REGEX_LINK_LABEL);
        if (matchLabel) {
          return withLinks.substr(0, placeholderStartIdx) +
                 makeNewMarkup(matchLabel[1]) + // Usando a label definida pelo usuário
                 withLinks.substr(placeholderStartIdx + placeholder.length + matchLabel[0].length);
        }

        return withLinks.substr(0, placeholderStartIdx) +
               makeNewMarkup() + // Usando a própria URL como label
               contentAfterPlaceholder;

      },
      nodeElement.innerHTML);
  }

  function renderCardLinks() {
    $('.list-card-title:not( :has(> .tcards-title-link) )').each((_, e) => updateNode(e));
  }

})(jQuery || unsafeWindow.jQuery);