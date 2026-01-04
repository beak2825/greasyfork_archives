// ==UserScript==
// @name         DuckDuckGo - Restore "home" "end"
// @namespace    https://github.com/Procyon-b
// @version      1.0.1
// @description  Restore the conventional usage of the "home" & "end" keys in the search field
// @author       Achernar
// @match        https://duckduckgo.com/*
// @match        https://noai.duckduckgo.com/*
// @match        https://start.duckduckgo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542578/DuckDuckGo%20-%20Restore%20%22home%22%20%22end%22.user.js
// @updateURL https://update.greasyfork.org/scripts/542578/DuckDuckGo%20-%20Restore%20%22home%22%20%22end%22.meta.js
// ==/UserScript==

(function() {

document.addEventListener('keydown', function(ev) {
  if (ev.target.nodeName == 'INPUT' && ev.target.id.startsWith('search') && ['Home', 'End'].includes(ev.key) ) {
    ev.stopPropagation();
    }
  }, true);

})();