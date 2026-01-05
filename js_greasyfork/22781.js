// ==UserScript==
// @name        Toggl-Button Trello
// @namespace   https://gitlab.paragon-es.de/toggl-button
// @version     0.9
// @include     http*://trello.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @grant       GM_registerMenuCommand
// @require     https://greasyfork.org/scripts/2670-toggllibrary/code/TogglLibrary.js
// @resource    togglStyle https://gitlab.paragon-es.de/toggl-button/core/raw/master/TogglLibrary.css
// @description Toggle button for Trello
// @downloadURL https://update.greasyfork.org/scripts/22781/Toggl-Button%20Trello.user.js
// @updateURL https://update.greasyfork.org/scripts/22781/Toggl-Button%20Trello.meta.js
// ==/UserScript==

new TogglButtonGM('.card-detail-window', function (elem) {
  var description, projectIds = [],
    id = null,
    titleElem = elem.querySelector('h2.card-detail-title-assist'),
    projectElem = elem.querySelector('.window-header-inline-content p a');

  description = titleElem.textContent.trim();
  if (id !== null) {
    description = id.textContent.trim() + " " + description;
  }

  if (projectElem !== null) {
    projectIds.push(projectElem.textContent.trim());
  }
  console.log(description);
  console.log(projectIds);
  return {
    className: 'trello',
    description: description,
    projectIds: projectIds
  };
});
