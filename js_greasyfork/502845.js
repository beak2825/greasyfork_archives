// ==UserScript==
// @name         Google Scholar Sci-hub Link
// @namespace    http://tampermonkey.net/
// @version      2024-08-07
// @description  Display sci-hub link if the paper is available on sci-hub.
// @author       Zhenyu He
// @match        *://scholar.google.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @icon         data:image/png;base64,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
// @connect      sci-hub.se
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/502845/Google%20Scholar%20Sci-hub%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/502845/Google%20Scholar%20Sci-hub%20Link.meta.js
// ==/UserScript==

const SCI_HUB_DOMAIN = "sci-hub.se";
const SCI_HUB_URL = `https://${SCI_HUB_DOMAIN}`;

function gm_fetch(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function({ status, responseText }) {
        if (status < 200 || status >= 300) return reject();
        resolve(responseText);
      },
      onerror: function() { reject(); },
    });
  });
}


async function getDownloadLink(link) {
  try {
    const current_url = `${SCI_HUB_URL}/${link}`;
    const scihubPageHtml = await gm_fetch(current_url);
    const parser = new DOMParser();
    const scihubPageDocument = parser.parseFromString(scihubPageHtml, "text/html");
    const doilink = scihubPageDocument.querySelector(`div [id="doi"]`).textContent.replace(/\s+/g,"");
    return doilink;
  } catch (e) {
    return null;
  }
}

function buildDownloadButton(downloadLink) {
  const result = document.createElement('div');
  result.classList.add("gs_ggs");
  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add("gs_ggsd");
  const button = document.createElement('div');
  button.classList.add("gs_or_ggsm");
  const link = document.createElement('a');
  link.classList.add("gs_or_ggsm");
  link.textContent = ` ${SCI_HUB_DOMAIN}`;
  link.href = `${SCI_HUB_URL}/${downloadLink}`
  link.download = true;
  link.style = `color: blue`;
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
    if (node.querySelector('.gs_ggs')) {
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
