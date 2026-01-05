// ==UserScript==
// @name        Toggl-Button YouTrack
// @namespace   https://gitlab.paragon-es.de/toggl-button
// @version     1.4
// @include     http*://youtrack.*/*
// @include     http*://*/youtrack/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @grant       GM_registerMenuCommand
// @require     https://greasyfork.org/scripts/2670-toggllibrary/code/TogglLibrary.js
// @resource    togglStyle https://gitlab.paragon-es.de/toggl-button/core/raw/master/TogglLibrary.css
// @description Toggle button for YouTrack
// @downloadURL https://update.greasyfork.org/scripts/2675/Toggl-Button%20YouTrack.user.js
// @updateURL https://update.greasyfork.org/scripts/2675/Toggl-Button%20YouTrack.meta.js
// ==/UserScript==

new TogglButtonGM('.fsi-layout.container .content_fsi', function (elem) {
  var description, projectIds = [],
    numElem = elem.querySelector('.issueId', elem),
    titleElem = elem.querySelector('.issue-summary', elem),
    projectElem = document.querySelector('.fsi-properties .fsi-property .regCC a'),
    linkElem = document.querySelector('.issueContainer .links-panel .links .link'),
    stopCallback = null;

  description = titleElem.textContent.trim();
  if (numElem !== null) {
    description = numElem.textContent.trim() + " " + description;
    stopCallback = function(date, duration) {
      var parts = numElem.textContent.trim().split('-');
      GM_xmlhttpRequest({
        method: "GET",
        url: document.location.origin + "/rest/admin/project/" + parts[0] + "/timetracking",
        onload: function (result) {
          if (result.status === 200) {
            if (result.responseText.indexOf('<settings enabled="true">') > 0) {
              GM_xmlhttpRequest({
                method: "POST",
                url: document.location.origin + "/rest/issue/" + numElem.textContent.trim() + "/timetracking/workitem",
                headers: {
                  "Content-Type": "application/xml"
                },
                dataType: 'xml',
                data: '<workItem><date>'+date+'</date><duration>'+Math.floor(duration / 60)+'</duration><description>automatic</description></workItem>'
              });
            }
          }
        }
      });
    }
  }

  if (projectElem !== null) {
    projectIds.push(projectElem.textContent.trim());
  }
  if (linkElem !== null) {
    projectIds.push(linkElem.textContent.trim());
  }

  return {
    className: 'youtrack',
    description: description,
    projectIds: projectIds,
    stopCallback: stopCallback
  };
});
