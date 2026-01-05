// ==UserScript==
// @name         Greasy Fork - Auto Enable Syntax-Highlighting Source Editor
// @namespace    https://greasyfork.org/users/649
// @version      1.1.5
// @description  Auto enables greasy fork's syntax-highlighting source editor
// @author       Adrien Pyke
// @match        *://greasyfork.org/*/script_versions/new*
// @match        *://greasyfork.org/*/scripts/*/versions/new*
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22223/Greasy%20Fork%20-%20Auto%20Enable%20Syntax-Highlighting%20Source%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/22223/Greasy%20Fork%20-%20Auto%20Enable%20Syntax-Highlighting%20Source%20Editor.meta.js
// ==/UserScript==

(() => {
  'use strict';

  waitForElems({
    sel: '#enable-source-editor-code',
    stop: true,
    onmatch(checkbox) {
      checkbox.click();
    }
  });
})();
