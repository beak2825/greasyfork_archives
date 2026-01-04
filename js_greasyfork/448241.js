// ==UserScript==
// @name         Google Scholar Bib Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Copy BibTeX records quickly within search results.
// @author       yusanshi
// @license      MIT
// @match        https://scholar.google.com/scholar?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scholar.google.com
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @grant        GM.xmlHttpRequest
// @connect      scholar.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/448241/Google%20Scholar%20Bib%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/448241/Google%20Scholar%20Bib%20Helper.meta.js
// ==/UserScript==

function toggleShowHide(div) {
  if (div.style.display !== 'none') {
    div.style.display = 'none';
  } else {
    div.style.display = 'block';
  }
}

(function () {
  'use strict';

  document.arrive(
    '#gs_res_ccl_mid > div.gs_r.gs_or.gs_scl',
    { existing: true },
    function () {
      const url = new URL('https://dblp.org/search');
      const title = this.querySelector('h3.gs_rt > a').innerText;
      url.searchParams.set('q', title);
      url.searchParams.set('clean', 'true');
      this.querySelector('div.gs_ri div.gs_fl').insertAdjacentHTML(
        'beforeend',
        `<button class="google-bib-button" type="button" style="height:22px">Show Bib</button> <button class="dblp-iframe-button" type="button" style="height:22px;margin-left:8px;">Search DBLP</button>`
      );
      this.insertAdjacentHTML(
        'beforeend',
        `<div class="google-bib-container"></div> <div class="dblp-iframe-container"></div>`
      );

      this.querySelector('.google-bib-button').addEventListener('click', () => {
        const container = this.querySelector('.google-bib-container');
        if (container.hasChildNodes()) {
          toggleShowHide(container);
        } else {
          container.innerHTML = `<textarea rows="8" class="bib-textarea" style="font-size:11px;margin-top:8px;border-color:rgb(220,220,220);border-radius:5px;outline:none;width:100%;color:gray;" onclick="this.select()">Fetching BibTeX record...</textarea>`;

          const bibTextArea = this.querySelector('.bib-textarea');
          document.arrive('#gs_citi', { onceOnly: true }, async () => {
            let bibURL;
            try {
              const bibAnchor = Array.from(
                document.querySelectorAll('#gs_citi a')
              ).filter((e) => e.textContent === 'BibTeX')[0];
              bibURL = bibAnchor.href;
              document.querySelector('#gs_cit-x').click();
            } catch (error) {
              bibTextArea.value = 'BibTeX entry not found!';
              document.querySelector('#gs_cit-x').click();
              return;
            }
            try {
              const bibText = (await GM.xmlHttpRequest({ url: bibURL }))
                .responseText;
              bibTextArea.value = bibText;
            } catch (error) {
              console.log(error);
              bibTextArea.value = `Error while fetching ${bibURL}.\n\nPlease see the console for the error message.`;
            }
          });
          Array.from(this.querySelectorAll('div.gs_ri div.gs_fl > a'))
            .filter((e) => e.textContent === 'Cite')[0]
            .click();
        }
      });
      this.querySelector('.dblp-iframe-button').addEventListener(
        'click',
        () => {
          const container = this.querySelector('.dblp-iframe-container');
          if (container.hasChildNodes()) {
            toggleShowHide(container);
          } else {
            container.innerHTML = `<iframe width="100%" height="400" style="margin-top:8px;border:1px solid rgb(220, 220, 220);border-radius:5px;" src="${url.href}"></iframe>`;
          }
        }
      );
    }
  );
})();
