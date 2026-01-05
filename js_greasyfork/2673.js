// ==UserScript==
// @name        Toggl-Button
// @namespace   https://gitlab.paragon-es.de/toggl-button
// @version     1.2
// @include     *
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @grant       GM_registerMenuCommand
// @require     https://greasyfork.org/scripts/2670-toggllibrary/code/TogglLibrary.js
// @resource    togglStyle https://gitlab.paragon-es.de/toggl-button/core/raw/master/TogglLibrary.css
// @description A general Toggl button script displaying active time entry on all tabs of your browser
// @downloadURL https://update.greasyfork.org/scripts/2673/Toggl-Button.user.js
// @updateURL https://update.greasyfork.org/scripts/2673/Toggl-Button.meta.js
// ==/UserScript==

if (self == top) {
  new TogglButtonGM('body', function (elem) {
    return {
      generalMode: true
    };
  });
}
