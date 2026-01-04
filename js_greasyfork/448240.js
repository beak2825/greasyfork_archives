// ==UserScript==
// @name         DBLP Bib Helper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Copy BibTeX records quickly within search results.
// @author       yusanshi
// @license      MIT
// @match        https://dblp.org/*
// @match        https://dblp.uni-trier.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dblp.org
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @require      https://cdn.jsdelivr.net/gh/ORCID/bibtexParseJs@b55dc9e4015f9dec67921f56f8f23dadb71697ad/bibtexParse.min.js
// @require      https://cdn.jsdelivr.net/npm/lozad@1.16.0/dist/lozad.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448240/DBLP%20Bib%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/448240/DBLP%20Bib%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (new URL(document.location).searchParams.get('clean') === 'true') {
    // https://stackoverflow.com/questions/4277792/hide-all-elements-except-one-div-and-its-child-element
    // DBLP has loaded jquery 3.x itself, no need to @require it.
    $('#completesearch-publs')
      .show()
      .parentsUntil('body')
      .addBack()
      .siblings()
      .hide();
    // why $('#completesearch-facets').hide() not working
    GM_addStyle('#completesearch-facets {display:none!important}');
  }

  const entrySelector = '#completesearch-publs li.entry';

  document.arrive(entrySelector, { existing: true }, function () {
    this.querySelector('cite').insertAdjacentHTML(
      'beforeend',
      '<br><textarea rows="10" class="bib-textarea" style="font-size:11px;margin-top:6px;border-color:rgb(220,220,220);border-radius:5px;outline:none;width:100%;color:gray;" onclick="this.select()">Fetching BibTeX record...</textarea>'
    );

    const bibTextArea = this.querySelector('.bib-textarea');
    const observer = lozad(bibTextArea, {
      load: async () => {
        const bibURL = this.querySelector(
          'nav.publ > ul > li:nth-child(2) > div.head > a'
        ).href.replace('.html', '.bib');
        const bibText = await fetch(bibURL).then((e) => e.text());
        const bibJSON = bibtexParse.toJSON(bibText);
        bibJSON[0].citationKey = bibJSON[0].citationKey.replace(
          /[^a-zA-Z0-9]+/g,
          '_'
        );
        bibTextArea.value = bibtexParse.toBibtex(bibJSON, false);
      },
    });
    observer.observe();
  });
})();
