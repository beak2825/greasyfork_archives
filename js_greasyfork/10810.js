// ==UserScript==
// @name        Toggl-Button Gitlab
// @namespace   https://gitlab.paragon-es.de/toggl-button
// @version     1.3
// @include     http*://gitlab.com/*
// @include     http*://gitlab.*/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @grant       GM_registerMenuCommand
// @require     https://greasyfork.org/scripts/2670-toggllibrary/code/TogglLibrary.js
// @resource    togglStyle https://gitlab.paragon-es.de/toggl-button/core/raw/master/TogglLibrary.css
// @description Toggle button for Gitlab
// @downloadURL https://update.greasyfork.org/scripts/10810/Toggl-Button%20Gitlab.user.js
// @updateURL https://update.greasyfork.org/scripts/10810/Toggl-Button%20Gitlab.meta.js
// ==/UserScript==

new TogglButtonGM('.issue-details', function (elem) {
  var description, projectIds = [],
    id = document.querySelector('.detail-page-header .identifier'),
    titleElem = elem.querySelector('.issue-details h2.title'),
    projectElem = document.querySelector('h1.title'),
    tagsElem = document.querySelector('.block.labels .has-labels'),
    tags = [];

  description = titleElem.textContent.trim();
  if (id !== null) {
    description = id.textContent.trim() + " " + description;
  }

  if (projectElem !== null) {
    projectIds.push(projectElem.textContent.trim());
  }

  if (tagsElem !== null) {
    var elements = tagsElem.querySelectorAll('a span');
    for (var i = 0, element; element = elements[i]; i++) {
      tags.push(element.textContent.trim());
    }
  }

  return {
    className: 'gitlab',
    description: description,
    projectIds: projectIds,
    tags: tags
  };
});
