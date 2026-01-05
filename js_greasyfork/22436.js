// ==UserScript==
// @name        Toggl-Button Jira
// @namespace   https://gitlab.paragon-es.de/toggl-button
// @version     0.9
// @include     http*://*.atlassian.com/browse/*
// @include     http*://*.atlassian.net/browse/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @grant       GM_registerMenuCommand
// @require     https://greasyfork.org/scripts/2670-toggllibrary/code/TogglLibrary.js
// @resource    togglStyle https://gitlab.paragon-es.de/toggl-button/core/raw/master/TogglLibrary.css
// @description Toggle button for Jira
// @downloadURL https://update.greasyfork.org/scripts/22436/Toggl-Button%20Jira.user.js
// @updateURL https://update.greasyfork.org/scripts/22436/Toggl-Button%20Jira.meta.js
// ==/UserScript==

new TogglButtonGM('.issue-header-content', function (elem) {
  var description, projectIds = [],
    id = elem.querySelector('#key-val'),
    titleElem = elem.querySelector('#summary-val'),
    projectElem = elem.querySelector('#project-name-val'),
    tagsElem = document.querySelector('.labels-wrap-value span'),
    tags = [];

  description = titleElem.textContent.trim();
  if (id !== null) {
    description = id.textContent.trim() + " " + description;
  }

  if (projectElem !== null) {
    projectIds.push(projectElem.textContent.trim());
  }

  if (tagsElem !== null) {
    for (var i = 0, element; elements = tagsElem[i]; i++) {
      var text = element.textContent.trim();
      if (text != 'None') {
        tags.push(text);
      }
    }
  }

  return {
    className: 'jira',
    description: description,
    projectIds: projectIds,
    tags: tags
  };
});
