// ==UserScript==
// @name           Sci-Hub downloader
// @namespace      https://openuserjs.org/users/clemente
// @match          *://*/*
// @grant          GM_xmlhttpRequest
// @version        1.10
// @author         clemente
// @license        MIT
// @description    Display a banner to download the article on Sci-Hub if available
// @description:de Zeigen Sie ein Banner an, um den Artikel über Sci-Hub herunterzuladen, falls verfügbar
// @description:es Despliegue un banner para descargar el artículo sobre Sci-Hub si está disponible
// @description:fr Affiche une bannière pour télécharger l'article sur Sci-Hub si disponible
// @description:it Mostra un banner per scaricare l'articolo su Sci-Hub, se disponibile
// @icon           https://sci-hub.do/favicon.ico
// @connect        sci-hub.do
// @inject-into    content
// @noframes
// @homepageURL    https://openuserjs.org/scripts/clemente/Sci-Hub_downloader
// @supportURL     https://openuserjs.org/scripts/clemente/Sci-Hub_downloader/issues
// @downloadURL https://update.greasyfork.org/scripts/398689/Sci-Hub%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/398689/Sci-Hub%20downloader.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const SCI_HUB_URL = "https://sci-hub.do";

function getUserLanguage() {
  const language = (navigator.language || 'en').slice(0, 2);
  return ['de', 'en', 'es', 'fr', 'it'].includes(language) ? language : 'en';
}

const downloadMessages = {
  de: 'Herunterladen von Sci-Hub',
  en: 'Download from Sci-Hub',
  es: 'Descargar desde Sci-Hub',
  fr: 'Télécharger sur Sci-Hub',
  it: 'Scarica da Sci-Hub',
};

const errorMessages = {
  de: 'Es gibt einen Fehler bei der Verbindung zu Sci-Hub. Sie sollten die Sci-Hub-Adresse und Ihr Netzwerk überprüfen.',
  en: 'There is an error connecting to Sci-Hub. You should check the Sci-Hub address and your network.',
  es: 'Hay un error de conexión con Sci-Hub. Deberías comprobar la dirección de Sci-Hub y tu red.',
  fr: 'Il y a une erreur de connexion à Sci-Hub. Vous devez vérifier l’adresse de Sci-Hub et votre réseau.',
  it: 'C\'è un errore di connessione a Sci-Hub. Dovresti controllare l\'indirizzo di Sci-Hub e la tua rete.',
};

function getDoiReference() {
  const detectedDoiMeta = document.querySelector('meta[name="citation_doi"], meta[name="dc.Identifier"][scheme="doi"]');
  if (detectedDoiMeta) return detectedDoiMeta.content;
  return null;
}

class NetworkError extends Error {
  constructor(status, ...params) {
    super(...params);
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
    this.name = 'NetworkError';
    if (status) {
      this.message = `Website responded with status ${status}.`;
    } else {
      this.message = "Unknown error.";
    }
  }
}

function gm_fetch(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function({ status, responseText }) {
        if (status < 200 && status >= 300) return reject(new NetworkError(status));
        resolve(responseText);
      },
      onerror: function() { reject(new NetworkError()); },
    });
  });
}

async function getDownloadLink(doiReference) {
  try {
    const scihubPageHtml = await gm_fetch(`${SCI_HUB_URL}/${doiReference}`);
    const parser = new DOMParser();
    const scihubPageDocument = parser.parseFromString(scihubPageHtml, "text/html");
    const pdfDownloadLink = scihubPageDocument.querySelector(`a[onclick$="?download=true'"]`);
    const match = pdfDownloadLink.getAttribute("onclick").match(/^location\.href='(.*)'$/);
    const downloadLink = match[1];
    return downloadLink; 
  } catch (e) {
    if (e instanceof NetworkError) {
      // If this is a network error, Sci-Hub is probably not working and it should be noted to the user
      console.error(e);
      return null;
    }
    const fallbackLink = `${SCI_HUB_URL}/${doiLink}`;
    return fallbackLink;
  }
}

function buildBanner(isDownloadAvailable) {
  const bannerElement = document.createElement('div');
  bannerElement.style = `
    background-color: ${isDownloadAvailable ? 'orange' : 'red'};
    min-height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 2147483647;
  `;
  
  return bannerElement;
}

function buildBannerContent(downloadLink) {
  const language = getUserLanguage();

  if (!downloadLink) {
    const errorMessage = document.createElement('span');
    errorMessage.textContent = errorMessages[language];
    errorMessage.style = `
      color: white;
      font-size: 16px;
      font-family: arial;
    `;
    
    return errorMessage;
  }
  
  const downloadLinkElement = document.createElement('a');
  downloadLinkElement.textContent = downloadMessages[language];
  downloadLinkElement.href = downloadLink;
  downloadLinkElement.download = true;
  downloadLinkElement.style = `
    color: white;
    font-size: 16px;
    font-family: arial;
  `;
  
  return downloadLinkElement;
}

async function displayBannerWhenDoiIsDetected() {
  const doiReference = getDoiReference();
  if (!doiReference) return;
  
  console.log("DOI detected:", doiReference);
  
  const downloadLink = await getDownloadLink(doiReference);
  
  if (!downloadLink) {
    console.log("No download link found.");
  } else {
    console.log("Download link retrieved:", downloadLink);
  }

  const banner = buildBanner(downloadLink);
  const bannerContent = buildBannerContent(downloadLink);

  banner.append(bannerContent);
  document.body.prepend(banner);
}

displayBannerWhenDoiIsDetected();
