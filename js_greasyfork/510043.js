// ==UserScript==
// @name         MAM Search Sites
// @namespace    https://greasyfork.org/en/users/1370284
// @version      0.0.1
// @license      MIT
// @description  Add Audible and ABB search links to MAM titles
// @match        https://*.myanonamouse.net/t/*
// @downloadURL https://update.greasyfork.org/scripts/510043/MAM%20Search%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/510043/MAM%20Search%20Sites.meta.js
// ==/UserScript==

const searchConfig = {
    audible: {
        enabled: true,
        getLink: (title, author, narrator) => {
            const searchUrl = new URL(`https://www.audible.com/search`);
            searchUrl.searchParams.set('keywords', `${title} ${author} ${narrator}`);
            return searchUrl.href;
        }
    },
    abb: {
        enabled: true,
        getLink: (title, author) => {
            const searchUrl = new URL('https://audiobookbay.lu');
            searchUrl.searchParams.set('s', `${title} ${author}`.toLowerCase());
            return searchUrl.href;
        }
    }
};

const parser = new DOMParser();
function decodeHtmlEntities(str) {
    if (str == null) return '';
    const domParser = parser || new DOMParser();
    const doc = domParser.parseFromString(str, 'text/html');
    return doc.documentElement.textContent;
}

function cleanQuery(str) {
    const decoded = decodeHtmlEntities(str);
    return decoded.replace(/[?!:\-+~]/g, '');
}

function removePersonTitles(str) {
    return str
        ?.replace(/\b(Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Prof\.?|M\.?D\.?|Ph\.?D\.?|D\.?O\.?|D\.?C\.?|D\.?D\.?S\.?|D\.?M\.?D\.?|D\.?Sc\.?|Ed\.?D\.?|LLB|JD|Esq\.?)\b\.?/gi, '') // Remove common author-related titles
        .replace(/\b\w{1,2}\.\s*/g, '')  // Remove any 1 or 2 letter abbreviations followed by a dot
        .replace(/\s+/g, ' ')            // Condense multiple spaces into one
        .trim();                         // Trim any extra spaces at the start or end
}

function parseData() {
    const titleEl = document.querySelector('.TorrentTitle');
    const authorEl = document.querySelector('.torAuthors a');
    const narratorEl = document.querySelector('#Narrator a');

    const title = cleanQuery(titleEl?.textContent.trim() || '')
    const author = removePersonTitles(cleanQuery(authorEl?.textContent.trim() || ''))
    const narrator = removePersonTitles(cleanQuery(narratorEl?.textContent.trim() || ''))

    return {
      title,
      author,
      narrator
    };
}

function createLinkElement(href, text) {
    const linkElement = document.createElement('a');
    linkElement.href = href;
    linkElement.target = '_blank';
    linkElement.innerText = text;
    linkElement.style.marginLeft = '12px';
    return linkElement;
}

function addSearchLinkToSubmitInfo() {
    const { title, author, narrator } = parseData();

    const submitInfoElement = document.querySelector('#submitInfo .flex');
    if (!submitInfoElement) return;

    if (searchConfig.audible.enabled) {
        const audibleLink = searchConfig.audible.getLink(title, author, narrator);
        const audibleLinkElement = createLinkElement(audibleLink, '🟠 audible');
        submitInfoElement.appendChild(audibleLinkElement);
    }

    if (searchConfig.abb.enabled) {
        const audiobookbayLink = searchConfig.abb.getLink(title, author);
        const audiobookbayLinkElement = createLinkElement(audiobookbayLink, '🎧 ABB');
        submitInfoElement.appendChild(audiobookbayLinkElement);
    }
}


addSearchLinkToSubmitInfo();