// ==UserScript==
// @name         DOI, SCImago Journal Rank and JIF for Google Scholar
// @namespace    https://greasyfork.org/
// @version      1.8
// @description  Show DOI, journal name, ISSN, publisher, SJR, H-Index, and JIF on Google Scholar search results
// @author       Bui Quoc Dung
// @match        https://scholar.google.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.crossref.org
// @connect      www.scimagojr.com
// @connect      wos-journal.info
// @connect      *
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/536204/DOI%2C%20SCImago%20Journal%20Rank%20and%20JIF%20for%20Google%20Scholar.user.js
// @updateURL https://update.greasyfork.org/scripts/536204/DOI%2C%20SCImago%20Journal%20Rank%20and%20JIF%20for%20Google%20Scholar.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CROSSREF_API = 'https://api.crossref.org/works';
  const SJR_SEARCH_URL = 'https://www.scimagojr.com/journalsearch.php?q=';
  const SJR_BASE_URL = 'https://www.scimagojr.com/';
  const WOS_JOURNAL_URL = 'https://wos-journal.info/?jsearch=';
  const DOI_REGEX = /\b(10\.\d{4,}(?:\.\d+)*\/(?:(?!["&'<>])\S)+)\b/gi;
  const MAX_SINGLE_LINE_LENGTH = 80;

  const ICONS = {
    CrossRef: 'https://www.crossref.org/favicon.ico',
    SJR: 'https://www.scimagojr.com/favicon.ico',
    Clarivate: 'https://www.google.com/s2/favicons?sz=64&domain=clarivate.com.cn',
    Journal: 'https://www.crossref.org/favicon.ico'
  };

  function createFaviconIcon(url, alt) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = alt;
    img.title = alt;
    img.style.width = '16px';
    img.style.height = '16px';
    img.style.verticalAlign = 'text-bottom';
    img.style.marginRight = '4px';
    return img;
  }

  function getFaviconFromUrl(url) {
    try {
      const u = new URL(url);
      return `https://www.google.com/s2/favicons?sz=64&domain=${u.hostname}`;
    } catch {
      return null;
    }
  }

  function shouldBreakIntoTwoLines(doi1, doi2) {
    const totalLength = (doi1 ? doi1.length : 0) + (doi2 ? doi2.length : 0);
    return totalLength > MAX_SINGLE_LINE_LENGTH;
  }

  function fetchDOI(titleLink, callback) {
    if (!titleLink) return callback(null, null);

    GM_xmlhttpRequest({
      method: 'GET',
      url: titleLink.href,
      onload: res => {
        const matches = res.responseText.match(DOI_REGEX);
        const doi1 = matches?.[0]?.replace(/\/(full|pdf|epdf|abs|abstract)(\/.*)?$/i, '') || null;
        const title = encodeURIComponent(titleLink.textContent.trim());
        const crossrefUrl = `${CROSSREF_API}?query.title=${title}&rows=1`;

        GM_xmlhttpRequest({
          method: 'GET',
          url: crossrefUrl,
          onload: crRes => {
            try {
              const data = JSON.parse(crRes.responseText);
              const doi2 = data.message.items?.[0]?.DOI || null;
              callback(doi1, doi2);
            } catch {
              callback(doi1, null);
            }
          },
          onerror: () => callback(doi1, null)
        });
      },
      onerror: () => callback(null, null)
    });
  }

  function queryCrossRef(title, callback) {
    const url = `${CROSSREF_API}?query.title=${encodeURIComponent(title)}&rows=1`;
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function (res) {
        try {
          const data = JSON.parse(res.responseText);
          const item = data.message.items?.[0];
          if (!item) return callback(null);
          const journal = item['container-title']?.[0] || null;
          const issn = item.ISSN?.[0] || null;
          const publisher = item.publisher || null;
          callback({ journal, issn, publisher });
        } catch (e) {
          callback(null);
        }
      },
      onerror: () => callback(null)
    });
  }

  function querySJRByISSN(issn, callback) {
    if (!issn) return callback(null);
    const searchUrl = `${SJR_SEARCH_URL}${encodeURIComponent(issn)}`;
    GM_xmlhttpRequest({
      method: 'GET',
      url: searchUrl,
      onload: function (res) {
        const doc = new DOMParser().parseFromString(res.responseText, "text/html");
        const firstLink = doc.querySelector('.search_results a');
        if (!firstLink) return callback(null);
        const href = firstLink.getAttribute('href');
        if (!href) return callback(null);
        const journalUrl = SJR_BASE_URL + href;
        GM_xmlhttpRequest({
          method: 'GET',
          url: journalUrl,
          onload: function (res2) {
            const doc2 = new DOMParser().parseFromString(res2.responseText, "text/html");
            const container = doc2.querySelector('div.journalgrid');
            if (!container) return callback(null);
            const sjrPs = container.querySelectorAll('p.hindexnumber');
            let sjrValue = null;
            let quartile = null;
            let hIndex = null;
            if (sjrPs.length >= 2) {
              sjrValue = sjrPs[0].childNodes[0]?.textContent.trim();
              quartile = sjrPs[0].querySelector('span')?.textContent.trim();
              hIndex = sjrPs[1].textContent.trim();
            }
            let sjrText = '';
            if (sjrValue && quartile) sjrText += `SJR ${quartile}; ${sjrValue}`;
            else if (sjrValue) sjrText += `SJR ${sjrValue}`;
            if (hIndex) sjrText += ` | H-Index: ${hIndex}`;
            callback({ text: sjrText, link: journalUrl });
          },
          onerror: () => callback(null)
        });
      },
      onerror: () => callback(null)
    });
  }

  function queryJIFByISSN(issn, callback) {
    if (!issn) return callback(null);
    const url = `${WOS_JOURNAL_URL}${encodeURIComponent(issn)}`;
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload: res => {
        const doc = new DOMParser().parseFromString(res.responseText, "text/html");
        const titleElems = doc.querySelectorAll('.title.col-4.col-md-3');
        const contentElems = doc.querySelectorAll('.content.col-8.col-md-9');
        if (!titleElems.length || !contentElems.length || titleElems.length !== contentElems.length) {
          return callback(null);
        }
        let jifValue = null;
        for (let i = 0; i < titleElems.length; i++) {
          const titleText = titleElems[i].textContent.trim();
          if (titleText === 'Journal Impact Factor (JIF):') {
            jifValue = contentElems[i].textContent.trim();
            break;
          }
        }
        if (jifValue && !isNaN(jifValue)) {
          callback({ value: jifValue, link: url });
        } else {
          callback(null);
        }
      },
      onerror: () => callback(null)
    });
  }

  function processEntry(entry) {
    if (entry.querySelector('.sjr-crossref-info')) return;
    const titleLink = entry.querySelector('.gs_rt a');
    const titleText = titleLink?.textContent.trim();
    if (!titleText) return;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'sjr-crossref-info';
    infoDiv.style.marginTop = '4px';
    entry.appendChild(infoDiv);

    const line1 = document.createElement('div');
    line1.textContent = 'Loading DOI...';
    infoDiv.appendChild(line1);

    const line2 = document.createElement('div');
    line2.textContent = 'Loading Journal...';
    infoDiv.appendChild(line2);

    const line3 = document.createElement('div');
    line3.textContent = 'Loading SJR and JIF...';
    infoDiv.appendChild(line3);

    fetchDOI(titleLink, (doi1, doi2) => {
      const doiHref1 = doi1 ? `https://doi.org/${doi1}` : null;
      const doiHref2 = doi2 ? `https://doi.org/${doi2}` : null;
      line1.innerHTML = '';

      if (doi1 && doi2 && doi1.toLowerCase() !== doi2.toLowerCase()) {
        const useTwoLines = shouldBreakIntoTwoLines(doi1, doi2);
        if (useTwoLines) {
          const line1a = document.createElement('div');
          const fav1 = createFaviconIcon(getFaviconFromUrl(titleLink.href), 'Source');
          line1a.appendChild(fav1);
          line1a.innerHTML += `DOI: <a href="${doiHref1}" target="_blank">${doi1}</a>`;
          infoDiv.insertBefore(line1a, line2);
          const fav2 = createFaviconIcon(ICONS.CrossRef, 'CrossRef');
          line1.appendChild(fav2);
          line1.innerHTML += `CrossRef: <a href="${doiHref2}" target="_blank">${doi2}</a>`;
        } else {
          const fav1 = createFaviconIcon(getFaviconFromUrl(titleLink.href), 'Source');
          line1.appendChild(fav1);
          line1.innerHTML += `DOI: <a href="${doiHref1}" target="_blank">${doi1}</a> | `;
          const fav2 = createFaviconIcon(ICONS.CrossRef, 'CrossRef');
          line1.appendChild(fav2);
          line1.innerHTML += `CrossRef: <a href="${doiHref2}" target="_blank">${doi2}</a>`;
        }
      } else if (doi1 || doi2) {
        const doi = doi1 || doi2;
        const href = `https://doi.org/${doi}`;
        const fav = doi1 ? createFaviconIcon(getFaviconFromUrl(titleLink.href), 'Source') : createFaviconIcon(ICONS.CrossRef, 'CrossRef');
        line1.appendChild(fav);
        line1.innerHTML += `DOI: <a href="${href}" target="_blank">${doi}</a>`;
      } else {
        line1.textContent = 'DOI: Not found';
      }

      queryCrossRef(titleText, result => {
        line2.innerHTML = '';
        if (!result) {
          line2.appendChild(createFaviconIcon(ICONS.Journal, 'Journal'));
          line2.appendChild(document.createTextNode('Journal info: Not found'));
          line3.innerHTML = '';
          line3.appendChild(createFaviconIcon(ICONS.SJR, 'SJR'));
          line3.appendChild(document.createTextNode('SJR info: Not found'));
          return;
        }

        const { journal, issn, publisher } = result;
        line2.appendChild(createFaviconIcon(ICONS.Journal, 'Journal'));

        let line2Text = journal || 'Journal unknown';
        if (issn) line2Text += ` (ISSN: ${issn})`;
        if (publisher) line2Text += ` | Publisher: ${publisher}`;
        line2.appendChild(document.createTextNode(line2Text));

        querySJRByISSN(issn, sjr => {
          line3.innerHTML = '';
          line3.appendChild(createFaviconIcon(ICONS.SJR, 'SJR'));
          if (sjr) {
            const sjrLink = document.createElement('a');
            sjrLink.href = sjr.link;
            sjrLink.target = '_blank';
            sjrLink.textContent = sjr.text;
            line3.appendChild(sjrLink);
          } else {
            line3.appendChild(document.createTextNode('SJR info: Not found'));
          }

          queryJIFByISSN(issn, jif => {
            if (jif) {
              line3.appendChild(document.createTextNode(' | '));
              line3.appendChild(createFaviconIcon(ICONS.Clarivate, 'Clarivate'));
              const jifLink = document.createElement('a');
              jifLink.href = jif.link;
              jifLink.target = '_blank';
              jifLink.textContent = `JIF: ${jif.value}`;
              line3.appendChild(jifLink);
            }
          });
        });
      });
    });
  }

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        const entries = node.matches('.gs_ri') ? [node] : node.querySelectorAll?.('.gs_ri') || [];
        entries.forEach(entry => processEntry(entry));
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  document.querySelectorAll('.gs_ri').forEach(entry => processEntry(entry));
})();
