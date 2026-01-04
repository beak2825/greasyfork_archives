
// ==UserScript==
// @name        Aetna Bulletin Search Script
// @namespace   policyreporter-userscripts
// @description This is a userscript.
// @match       https://www.aetna.com/health-care-professionals/clinical-policy-bulletins/pharmacy-clinical-policy-bulletins/pharmacy-clinical-policy-bulletins-search-results.html
// @version     1.0.0
// @author      Policy Reporter
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/445644/Aetna%20Bulletin%20Search%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/445644/Aetna%20Bulletin%20Search%20Script.meta.js
// ==/UserScript==

(function () {
'use strict';

/* eslint-disable no-constant-condition */
const script = async () => {
  console.log('Starting script');
  const searchTerm = 'policy';
  const cfg = document.querySelector('div.searchresults > div').getAttribute('data-site');
  const curYear = new Date().getFullYear();
  const prevYear = curYear - 1;
  const parser = new DOMParser();
  const results = [];
  let offset = 0;
  document.open();
  document.write('<p>Working...<p>');

  while (true) {
    const url = `https://www.aetna.com/search/results.aspx?cfg=${cfg}&query=${searchTerm}&offset=${offset}&YearSelect=${curYear}&years=${prevYear}-${curYear}&`;
    const resp = await fetch(url, {
      method: 'GET'
    }).then(r => r.text());
    const xmlDoc = parser.parseFromString(resp, 'text/xml');
    xmlDoc.querySelectorAll('Result').forEach(e => {
      const title = e.querySelector('ResultField[Name=title] > Value').childNodes[1].data;
      const url = e.querySelector('ResultField[Name=url] > Value').childNodes[1].data;
      results.push(`<a href='${url}'>${title}</a>`);
    });
    const next = xmlDoc.querySelector('PagingField[Name=Next]');

    if (!next) {
      break;
    } else {
      offset = parseInt(next.getAttribute('Offset'));
    }
  }

  document.open();
  results.forEach(e => {
    document.write(e);
    document.write('<br>');
  });
  console.log('Finished script');
};

GM_registerMenuCommand('Run Script', script, 's');

})();
