// ==UserScript==
// @namespace       https://greasyfork.org/fr/users/868328-invincible812
// @name            The Journal Downloader - l'Avenir
// @match           https://kiosque.lavenir.net/data/*/reader/reader.html*
// @grant           GM_getValue
// @grant           GM_setValue
// @compatible      firefox Violentmonkey
// @compatible      chrome Violentmonkey
// @compatible      brave Violentmonkey
// @compatible      opera Violentmonkey
// @author          Invincible812
// @license         Free
// @version         1.0
// @description     Télécharger les pages du journal l'Avenir en PDF en un clique
// @run-at          document-end
// @require         https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js
// @downloadURL https://update.greasyfork.org/scripts/492108/The%20Journal%20Downloader%20-%20l%27Avenir.user.js
// @updateURL https://update.greasyfork.org/scripts/492108/The%20Journal%20Downloader%20-%20l%27Avenir.meta.js
// ==/UserScript==

(function() {
    'use strict';

const createFetchResponseInterceptor = onResponse => {
    const fetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async (url, config) => {
        const response = await fetch(url, config);
        [
            'arrayBuffer',
            'blob',
            'formData',
            'json',
            'text'
        ].forEach(type => response[type] = async () => {
            const data = await response.clone()[type]();
            onResponse({
                url,
                type,
                data
            });
            return data;
        });
        return response;
    };
};

const waitForSelector = (selector, all, callback) => new Promise(resolve => {
    let result;
    const getResult = () => {
        result = document[all ? 'querySelectorAll' : 'querySelector'](selector);
        return all ? result.length : !!result;
    };

    if(getResult())
        return resolve(result);

    const observer = new MutationObserver(() => {
        if(getResult()){
            if(callback){
                if(callback(result) === true)
                    observer.disconnect();
            }
            else {
                observer.disconnect();
                resolve(result);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

function getIds() {
  const idsDesPages = [];
  const slides = document.getElementsByClassName('slide-thumb');
  for (let i = 0; i < slides.length; i++) {
      const attributSrc = slides[i].attributes[2].textContent;
      const match = attributSrc.match(/-([\d]+)\.jpg/);
      if (match && match[1]) {
          idsDesPages.push(match[1]);
      }
  }
  return idsDesPages;
}

async function assemblePDF(idsDesPages, template) {
    const pdf = await PDFLib.PDFDocument.create();

    for (let i = 0; i < idsDesPages.length; i++) {

        document.getElementById('button-dl').textContent = `En cours ${i + 1}/${idsDesPages.length}`;

        const pageId = idsDesPages[i];
        const pageURL = template.replace(`%PUBPAGE_ID%`, pageId);
        const response = await fetch(pageURL);
        const pdfData = await response.arrayBuffer();

        const externalPdf = await PDFLib.PDFDocument.load(pdfData);
        const [firstPage] = await pdf.copyPages(externalPdf, [0]);
        pdf.addPage(firstPage);
    }

    return await pdf.save();
}

createFetchResponseInterceptor(async ({
    url,
    type,
    data
}) => {
    if(url.startsWith('https://tec-eda-production-api.twipecloud.net/GetDownloadCredentials')){
      data = data.PdfPattern;
      //console.log(data)
        const buttonElement = document.createElement('button'),
            buttonContainerElement = document.createElement('div'),
            toolbarElement = await waitForSelector('#reader-previous', false);

        buttonElement.textContent = 'Télécharger';
        buttonElement.style['z-index'] = '51';
        buttonElement.id = 'button-dl';

        buttonContainerElement.appendChild(buttonElement);
        buttonContainerElement.style['width'] = '100%';
        buttonContainerElement.style['height'] = '100%';
        buttonContainerElement.style['display'] = 'flex';
        buttonContainerElement.style['align-items'] = 'center';
        buttonContainerElement.style['justify-content'] = 'center';

        const buttonHTML = `<div bis_skin_checked="1">${buttonContainerElement.outerHTML}</div>`;

        document.getElementsByClassName('top-bar-item top-bar-outer top-bar-access')[0].children[0].insertAdjacentHTML('afterend', buttonHTML);

        document.getElementById('button-dl').addEventListener('click', async () => {
          document.getElementById('button-dl').disabled = true;
          document.getElementById('button-dl').textContent = 'Téléchargement...';

          const ids = getIds();
          //console.log(ids)
          const pdf = await assemblePDF(ids, data);

          const pdfBlob = new Blob([pdf], { type: 'application/pdf' });
          const pdfURL = URL.createObjectURL(pdfBlob);

          const downloadLink = document.createElement('a');
          downloadLink.href = pdfURL;
          downloadLink.download = GM_getValue("name");
          document.body.appendChild(downloadLink);

          downloadLink.click();

          document.body.removeChild(downloadLink);
          document.getElementById('button-dl').disabled = false;
          document.getElementById('button-dl').textContent = 'Téléchargement fini !';
        });
    }
  if (url.startsWith('https://tec-eda-production-api.twipecloud.net/Data/DataService.svc/GetContentPackageInfo')) {
        console.log(data)
        const timestamp = data.PublicationDate.match(/\/Date\((\d+)\+\d+\)\//)[1]

        const date = new Date(Number(timestamp));
        const region = data.ContentPackageName;

        const formattedDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
        //console.log(`l.Avenir_${region}_${formattedDate}`)
        GM_setValue('name', `l.Avenir_${region}_${formattedDate}.pdf`);
      }
  });
})();
