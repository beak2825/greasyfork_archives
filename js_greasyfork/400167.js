// ==UserScript==
// @name           Download on Google Scholar
// @namespace      https://openuserjs.org/users/clemente
// @match          https://scholar.google.*/*
// @grant          GM_xmlhttpRequest
// @version        1.3
// @author         clemente
// @license        MIT
// @description    Display a download button next to results
// @description:de Eine Download-Schaltfläche neben den Ergebnissen anzeigen
// @description:es Mostra un botón de descarga junto a los resultados
// @description:fr Ajoute un bouton de téléchargement à côté des résultats
// @description:it Visualizzare un pulsante per il download accanto ai risultati
// @icon           https://scholar.google.com/favicon.ico
// @connect        sci-hub.do
// @inject-into    content
// @noframes
// @homepageURL    https://openuserjs.org/scripts/clemente/Download_on_Google_Scholar
// @supportURL     https://openuserjs.org/scripts/clemente/Download_on_Google_Scholar/issues
// @downloadURL https://update.greasyfork.org/scripts/400167/Download%20on%20Google%20Scholar.user.js
// @updateURL https://update.greasyfork.org/scripts/400167/Download%20on%20Google%20Scholar.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const SCI_HUB_DOMAIN = "sci-hub.do";
const SCI_HUB_URL = `https://${SCI_HUB_DOMAIN}`;

function gm_fetch(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function({ status, responseText }) {
        if (status < 200 && status >= 300) return reject();
        resolve(responseText);
      },
      onerror: function() { reject(); },
    });
  });
}

async function getDownloadLink(link) {
  try {
    const scihubPageHtml = await gm_fetch(`${SCI_HUB_URL}/${link}`);
    const parser = new DOMParser();
    const scihubPageDocument = parser.parseFromString(scihubPageHtml, "text/html");
    const pdfDownloadLink = scihubPageDocument.querySelector(`a[onclick$="?download=true'"]`);
    const match = pdfDownloadLink.getAttribute("onclick").match(/^location\.href='(.*)'$/);
    const downloadLink = match[1];
    return downloadLink; 
  } catch (e) {
    // If there is an error, the article is probably not available on Sci-Hub
    return null;
  }
}

function buildDownloadButton(downloadLink) {
  const result = document.createElement('div');
  result.classList.add("gs_ggs"); // gs_fl
  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add("gs_ggsd");
  const button = document.createElement('div');
  button.classList.add("gs_or_ggsm");
  const link = document.createElement('a');
  link.classList.add("gs_or_ggsm");
  link.textContent = ` ${SCI_HUB_DOMAIN}`;
  link.href = downloadLink;
  link.download = true;
  link.style = `color: orange`;
  const extension = document.createElement('span');
  extension.classList.add("gs_ctg2");
  extension.textContent = "[PDF]"

  link.prepend(extension);
  button.prepend(link);
  buttonWrapper.prepend(button);
  result.prepend(buttonWrapper);

  return result;
}

function addDownloadButtonOnResults() {
  document.querySelectorAll('.gs_r.gs_scl').forEach(async node => {
    if (node.querySelector('.gs_ggs')) { // If there is already an available download, do nothing
      return;
    }

    const detectedLink = node.querySelector('.gs_rt a').href;
    const downloadLink = await getDownloadLink(detectedLink);
    
    if (!downloadLink) {
      return;
    }
    
    const downloadButton = buildDownloadButton(downloadLink);
    node.prepend(downloadButton);
  });
}

addDownloadButtonOnResults();
