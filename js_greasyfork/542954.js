// ==UserScript==
// @name          Scholar's Toolkit
// @namespace     greasyfork.org
// @version       5.0
// @description   Checks for free PDFs from Google Scholar, Sci-Hub, LibGen, Anna's Archive, Sci-net, Semantic Scholar, Unpaywall, OpenAlex, Openrxiv (medRxiv/bioRxiv), and ArXiv. When hovering a DOI, it also displays journal name, ISSN, publisher, metrics (SJR, H-Index, JIF, CiteScore), citation count, and integrity status (PubPeer, Retraction Database, Beall's Predatory List).
// @author        Bui Quoc Dung
// @match         *://*/*
// @resource      SJR_CSV https://raw.githubusercontent.com/BuiQuocDung1991/Userscript/main/Data/scimagojr%202024.csv
// @grant         GM_getResourceText
// @grant         GM_xmlhttpRequest
// @require       https://cdn.jsdelivr.net/npm/he@1.2.0/he.min.js
// @connect       *
// @license       AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/542954/Scholar%27s%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/542954/Scholar%27s%20Toolkit.meta.js
// ==/UserScript==

(function () {
'use strict';

const styles = `
.doi-enhancer-popup { position: absolute; z-index: 9999; background-color: white;
border: 1px solid #ccc; border-radius: 6px; padding: 6px;
box-shadow: 0 4px 8px rgba(0,0,0,0.2); font-family: sans-serif; font-size: 14px; max-width: 600px; }
.doi-enhancer-popup .doi-header { margin-bottom: 6px; word-break: break-word; padding-left: 7px; display: flex; align-items: center; gap: 8px;}
.doi-enhancer-popup .doi-title-style {display: block; }
.doi-enhancer-popup .doi-title-style .text-content { display: inline;}
.doi-enhancer-popup .doi-title-style .copy-btn { display: inline-block; margin-left: 8px; vertical-align: middle;}
.doi-enhancer-popup table { border-collapse: collapse; width: 100%; margin-top: 6px; }
.doi-enhancer-popup td { padding: 4px 6px; text-align: center; border-right: 1px solid #eee; white-space: nowrap; }
.doi-enhancer-popup td:last-child { border-right: none; }
.doi-enhancer-popup a { color: #007bff; text-decoration: none; }
.doi-enhancer-popup a:hover { text-decoration: underline; }
.doi-enhancer-popup .status-no, .doi-enhancer-popup .status-no a { color: #888; }
.doi-enhancer-popup .status-yes { color: initial; }
.doi-enhancer-popup .status-checking { color: #999; }
.doi-enhancer-popup .copy-btn {
    cursor: pointer; font-size: 11px;
    border: none; background: none; padding: 0;
    user-select: none;
}
`;
const styleEl = document.createElement('style');
styleEl.textContent = styles;
document.head.appendChild(styleEl);

let currentPopup = null;
let hideTimeout = null;

function httpRequest(details) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            ...details,
            timeout: 15000,
            onload: resolve,
            onerror: reject,
            ontimeout: reject,
        });
    });
}

async function httpGet(url) {
    return await httpRequest({ method: 'GET', url });
}

function updateLink(cell, text, href, isNo = false) {
    cell.innerHTML = '';
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerHTML = text.replace(/\[(PDF|Maybe|YES)\]/g, '<b>$&</b>');
    cell.className = isNo ? 'status-no' : 'status-yes';
    cell.appendChild(link);
}

async function fetchCrossref(doi) {
    try {
        const r = await httpGet(`https://api.crossref.org/works/${doi}`);
        const js = JSON.parse(r.responseText).message;
        const decodeAndStrip = (text) => {
            if (!text) return "";
            const decoded = he.decode(text);
            const temp = document.createElement('div');
            temp.innerHTML = decoded;
            return temp.textContent || temp.innerText || '';
        };

        return {
            success: true,
            title: decodeAndStrip(js.title?.[0] || ""),
            journal: decodeAndStrip(js["container-title"]?.[0] || ""),
            publisher: decodeAndStrip(js.publisher || ""),
            issn: js.ISSN?.[0] || "",
            citationCount: js['is-referenced-by-count'],
            crossrefData: js,
        };
    } catch (e) {
        return { success: false };
    }
}

function checkCiteBy(cell, citationCount) {
    if (typeof citationCount === 'number' && citationCount >= 0) {
        cell.textContent = `Cited by: ${citationCount}`;
        cell.className = citationCount === 0 ? 'status-no' : 'status-yes';
    } else {
        cell.textContent = '[No] Cite';
        cell.className = 'status-no';
    }
}


function checkRIS(cell, doi, isSuccess) {
    if (isSuccess) {
        const risUrl = `https://api.crossref.org/works/${encodeURIComponent(doi)}/transform/application/x-research-info-systems`;
        cell.innerHTML = '';
        const link = document.createElement('a');
        link.innerHTML = 'RIS';
        link.href = 'javascript:void(0)';
        link.style.cursor = 'pointer';

        link.onclick = async (e) => {
            e.preventDefault();
            const originalText = link.innerHTML;
            link.textContent = '...';

            try {
                const response = await httpRequest({ method: 'GET', url: risUrl });
                const blob = new Blob([response.responseText], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'Reference.ris';
                document.body.appendChild(a);
                a.click();

                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                link.innerHTML = originalText;
            } catch (err) {
                console.error('Download failed', err);
                link.textContent = 'Err';
                setTimeout(() => {
                    window.open(risUrl, '_blank');
                    link.innerHTML = originalText;
                }, 1000);
            }
        };

        cell.className = 'status-yes';
        cell.appendChild(link);
    } else {
        const fallbackUrl = `https://crossref.org/work-retriever?dois=${encodeURIComponent(doi)}`;
        updateLink(cell, '[No] RIS', fallbackUrl, true);
    }
}


function checkSJR(issn, sjrCell, hIndexCell) {
    const SJR_SEARCH_URL = 'https://www.scimagojr.com/journalsearch.php?q=';

    const normalizeISSN = s =>
        s ? s.replace(/[^0-9X]/gi, '').toUpperCase() : '';

    const key = normalizeISSN(issn);
    const failUrl = SJR_SEARCH_URL + (issn ? encodeURIComponent(issn) : '');

    const updateFail = () => {
        updateLink(sjrCell, '[No] SJR', failUrl, true);
        updateLink(hIndexCell, '[No] H-index', failUrl, true);
    };

    if (!key) return updateFail();

    try {
        const csv = GM_getResourceText('SJR_CSV');
        if (!csv) return updateFail();

        let lineStart = 0;
        let lineEnd = csv.indexOf('\n');
        const headerLine = csv.slice(0, lineEnd).trim();
        const headers = headerLine.split(';').map(h => h.toLowerCase());

        const idxSourceId = headers.indexOf('sourceid');
        const idxISSN = headers.indexOf('issn');
        const idxSJR = headers.indexOf('sjr');
        const idxQuart = headers.findIndex(h => h.includes('best quartile'));
        const idxH = headers.indexOf('h index');

        lineStart = lineEnd + 1;

        while (lineStart < csv.length) {
            lineEnd = csv.indexOf('\n', lineStart);
            if (lineEnd === -1) lineEnd = csv.length;

            const line = csv.slice(lineStart, lineEnd);
            lineStart = lineEnd + 1;

            if (!line) continue;

            const cols = line.split(';');
            const issnCell = cols[idxISSN];
            if (!issnCell) continue;

            const issns = issnCell
                .replace(/"/g, '')
                .split(',')
                .map(normalizeISSN);

            if (!issns.includes(key)) continue;
            const sourceId = cols[idxSourceId]?.trim();
            const sjr = cols[idxSJR]?.trim();
            const quart = cols[idxQuart]?.trim();
            const hindex = cols[idxH]?.trim();

            const resultUrl = sourceId
                ? `${SJR_SEARCH_URL}${encodeURIComponent(sourceId)}&tip=sid&clean=0`
                : failUrl;
            if (sjr) {
                let txt = `SJR: ${sjr}`;
                if (quart) txt += ` (${quart})`;
                updateLink(sjrCell, txt, resultUrl, false);
            } else {
                updateLink(sjrCell, '[No] SJR', resultUrl, true);
            }

            if (hindex) {
                updateLink(hIndexCell, `H-index: ${hindex}`, resultUrl, false);
            } else {
                updateLink(hIndexCell, '[No] H-index', resultUrl, true);
            }
            return;
        }

        updateFail();

    } catch (e) {
        console.error('checkSJR stream error:', e);
        updateFail();
    }
}


async function checkJIF(issn, cell) {
    const base = 'https://wos-journal.info/?jsearch=';
    const url = base + encodeURIComponent(issn || '');
    if (!issn) return updateLink(cell, '[No] JIF', url, true);

    try {
        const res = await httpGet(url);
        const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
        const labels = doc.querySelectorAll('.title');
        const values = doc.querySelectorAll('.content');

        for (let i = 0; i < labels.length; i++) {
            if (labels[i].textContent.includes('Impact Factor')) {
                return updateLink(cell, `JIF: ${values[i].textContent.trim()}`, url);
            }
        }
        updateLink(cell, '[No] JIF', url, true);
    } catch {
        updateLink(cell, '[No] JIF', url, true);
    }
}

async function checkCiteScore(issn, citeScoreCell) {
    const API_KEY = ""; // in https://dev.elsevier.com/apikey/manage
    const API_URL = `https://api.elsevier.com/content/serial/title/issn/${issn}?apiKey=${API_KEY}`;
    const failUrl = `https://www.scopus.com/sources.uri?issn=${issn}`;
    const updateFail = () => updateLink(citeScoreCell, '[No] CiteScore', failUrl, true);

    if (!issn) return updateFail();

    try {
        const res = await httpRequest({
            method: "GET",
            url: API_URL,
            headers: { "Accept": "application/xml" }
        });
        const xml = res.responseText;
        const dom = new DOMParser().parseFromString(xml, "application/xml");
        const citeScore = dom.querySelector("citeScoreCurrentMetric")?.textContent || null;
        const sourceId = dom.querySelector("source-id")?.textContent || "";
        const sourceLink = sourceId ? `https://www.scopus.com/source/sourceInfo.url?sourceId=${sourceId}` : API_URL;

        if (citeScore) updateLink(citeScoreCell, `CiteScore: ${citeScore}`, sourceLink, false);
        else updateLink(citeScoreCell, '[No] CiteScore', failUrl, true);
    } catch (err) {
        updateFail();
    }
}


async function checkBeallsList(journalName, publisherName, cell) {
    const mainUrl = 'https://beallslist.net/';
    if (!journalName && !publisherName) return updateLink(cell, '[No] Beall', mainUrl, true);

    const getList = async (url, cacheKey, selector = ".entry-content ul li") => {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) return new Set(JSON.parse(cached));
        const response = await httpRequest({ method: 'GET', url });
        const doc = new DOMParser().parseFromString(response.responseText, "text/html");
        const items = doc.querySelectorAll(selector);
        const itemSet = new Set();
        items.forEach(item => {
            const text = item.textContent.trim().toLowerCase();
            if (text) itemSet.add(text);
        });
        sessionStorage.setItem(cacheKey, JSON.stringify(Array.from(itemSet)));
        return itemSet;
    };

    try {
        const [journalSet, publisherSet] = await Promise.all([
            getList('https://beallslist.net/standalone-journals/', 'beallsListJournals'),
            getList('https://beallslist.net/', 'beallsListPublishers')
        ]);

        const lowerJournal = journalName ? journalName.toLowerCase() : '';
        if (lowerJournal && journalSet.has(lowerJournal)) {
            return updateLink(cell, '[YES] Beall (Journal)', mainUrl, false);
        }

        const lowerPublisher = publisherName ? publisherName.toLowerCase() : '';
        if (lowerPublisher) {
            for (const predatoryPublisher of publisherSet) {
                if (predatoryPublisher.includes(lowerPublisher) || lowerPublisher.includes(predatoryPublisher)) {
                    return updateLink(cell, '[YES] Beall (Publisher)', mainUrl, false);
                }
            }
        }
        updateLink(cell, '[No] Beall', mainUrl, true);
    } catch (error) {
        updateLink(cell, '[No] Beall', mainUrl, true);
    }
}


async function checkPubPeer(doi, cell) {
    const encodedDoi = encodeURIComponent(doi);
    const pubpeerUrl = `https://pubpeer.com/search?q=${encodedDoi}`;
    const updateFail = () => updateLink(cell, '[No]PubPeer', pubpeerUrl, true);

    try {
        const response = await httpGet(pubpeerUrl);
        const doc = new DOMParser().parseFromString(response.responseText, "text/html");
        const metaTag = doc.querySelector('meta[name="csrf-token"]');
        if (!metaTag) return updateFail();

        const token = metaTag.getAttribute('content');
        const apiUrl = `https://pubpeer.com/api/search/?q=${encodedDoi}&token=${token}`;

        const apiResponse = await httpRequest({ method: 'GET', url: apiUrl, responseType: 'json' });
        const data = apiResponse.response;

        if (data && data.publications && data.publications.length > 0) {
            const commentCount = data.publications[0].comments_total;
            const result = commentCount > 0 ? `[YES] PubPeer (${commentCount})` : '[No] PubPeer';
            updateLink(cell, result, pubpeerUrl, commentCount === 0);
        } else {
            updateFail();
        }
    } catch (e) {
        updateFail();
    }
}

function checkRetraction(doi, cell, crossrefData) {
    const rwdUrl = 'https://retractiondatabase.org/RetractionSearch.aspx#doi=' + encodeURIComponent(doi);

    if (!crossrefData) return updateLink(cell, '[No] RWD', rwdUrl, true);
    try {
        const isRetracted = (crossrefData['updated-by'] || []).some(u => u.type === 'retraction');
        if (isRetracted) updateLink(cell, '[YES] RWD', rwdUrl, false);
        else updateLink(cell, '[No] RWD', rwdUrl, true);
    } catch (e) {
        updateLink(cell, '[No] RWD', rwdUrl, true);
    }
}

function autoFillAndSubmitRWD() {

    if (location.hostname.includes('retractiondatabase.org') && location.hash.includes('#doi=')) {
        const doi = decodeURIComponent(location.hash.split('#doi=')[1]);
        const attemptFill = setInterval(() => {
            const input = document.getElementById('txtOriginalDOI');
            const btn = document.getElementById('btnSearch');

            if (input && btn) {
                clearInterval(attemptFill);
                input.value = doi;
                input.dispatchEvent(new Event('blur'));
                btn.click();
            }
        }, 500);
        setTimeout(() => clearInterval(attemptFill), 5000);
    }
}

autoFillAndSubmitRWD();

async function checkGoogleScholar(doi, cell) {
    const url = 'https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=' + encodeURIComponent(doi);
    try {
        const res = await httpRequest({ method: 'GET', url });
        const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
        const gsLink = doc.querySelector('.gs_or_ggsm a');
        if (gsLink) updateLink(cell, '[PDF] Google', gsLink.href);
        else updateLink(cell, '[No] Google', url, true);
    } catch { updateLink(cell, '[No] Google', url, true); }
}

async function checkSciHub(doi, cell) {
    const url = `https://tesble.com/${doi}`;
    try {
        const res = await httpGet(url);
        const ok = /iframe|embed/.test(res.responseText);
        updateLink(cell, ok ? '[PDF] Sci-Hub' : '[No] Sci-Hub', url, !ok);
    } catch {
        updateLink(cell, '[No] Sci-Hub', url, true);
    }
}

async function checkLibgen(doi, cell) {
    const LIBGEN_URL = 'https://libgen.bz/';
    const url = LIBGEN_URL + 'index.php?req=' + encodeURIComponent(doi);
    try {
        const res = await httpRequest({ method: 'GET', url });
        const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
        const linkEl = doc.querySelector('.table.table-striped a[href^="edition.php?id="]');
        if (linkEl) {
            const detailRes = await httpRequest({ method: 'GET', url: LIBGEN_URL + linkEl.getAttribute('href') });
            const hasPDF = !!new DOMParser().parseFromString(detailRes.responseText, 'text/html').querySelector('table');
            updateLink(cell, hasPDF ? '[PDF] LibGen' : '[No] LibGen', url, !hasPDF);
        } else updateLink(cell, '[No] LibGen', url, true);
    } catch { updateLink(cell, '[No] LibGen', url, true); }
}

async function checkAnna(doi, cell, retry = 0) {
    const ANNA_URL = 'https://annas-archive.org';
    const checkUrl = ANNA_URL + '/search?index=journals&q=' + encodeURIComponent(doi);
    const directUrl = ANNA_URL + '/scidb/' + doi;
    try {
        const res = await httpRequest({ method: 'GET', url: checkUrl });
        if (res.responseText.includes("Rate limited") && retry < 10) {
            return setTimeout(() => checkAnna(doi, cell, retry + 1), 5000);
        }
        const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
        const found = doc.querySelector('.mt-4.uppercase.text-xs.text-gray-500') ||
                      [...doc.querySelectorAll('div.text-gray-500')].some(div => div.textContent.includes(doi));
        if (found) {
            const res2 = await httpRequest({ method: 'GET', url: directUrl });
            const hasPDF = new DOMParser().parseFromString(res2.responseText, 'text/html').querySelector('.pdfViewer, #viewerContainer, iframe[src*="viewer.html?file="]');
            updateLink(cell, hasPDF ? '[PDF] Anna' : '[Maybe] Anna', directUrl);
        } else updateLink(cell, '[No] Anna', checkUrl, true);
    } catch { updateLink(cell, '[No] Anna', checkUrl, true); }
}

async function checkSciNet(doi, cell) {
    const url = 'https://sci-net.xyz/' + doi;
    try {
        const res = await httpRequest({ method: 'GET', url });
        const hasPDF = /iframe|pdf|embed/.test(res.responseText);
        updateLink(cell, hasPDF ? '[PDF] Sci-net' : '[No] Sci-net', url, !hasPDF);
    } catch { updateLink(cell, '[No] Sci-net', url, true); }
}

async function checkSemanticScholar(doi, cell) {
    const apiUrl = `https://api.semanticscholar.org/graph/v1/paper/${encodeURIComponent(doi)}?fields=title,openAccessPdf`;
    try {
        const res = await httpRequest({ method: 'GET', url: apiUrl });
        const data = JSON.parse(res.responseText);
        if (data?.openAccessPdf?.url) {
            const readerUrl = `https://www.semanticscholar.org/reader/${data.paperId}`;
            const readerRes = await httpRequest({ method: 'GET', url: readerUrl });
            const doc = new DOMParser().parseFromString(readerRes.responseText, 'text/html');
            const btn = doc.querySelector('a[href][download] button[data-heap-id="reader_download_button"]');
            const pdfLink = btn?.closest('a')?.href;

            if (pdfLink) {
                updateLink(cell, '[PDF] Semantic', pdfLink);
            } else {
                updateLink(cell, '[PDF] Semantic', readerUrl);
            }
        } else {
            updateLink(cell, '[No] Semantic', `https://www.semanticscholar.org/search?q=${encodeURIComponent(doi)}`, true);
        }
    } catch (err) {
        console.error(err);
        updateLink(cell, '[No] Semantic', `https://www.semanticscholar.org/search?q=${encodeURIComponent(doi)}`, true);
    }
}

async function checkUnpaywall(doi, cell) {
    const url = `https://api.unpaywall.org/v2/${encodeURIComponent(doi)}?email=support@unpaywall.org`;
    try {
        const res = await httpRequest({ method: 'GET', url });
        const data = JSON.parse(res.responseText);
        if (data?.is_oa && data.best_oa_location?.url) updateLink(cell, '[PDF] Unpaywall', data.best_oa_location.url);
        else updateLink(cell, '[No] Unpaywall', `https://unpaywall.org/`, true);
    } catch { updateLink(cell, '[No] Unpaywall', `https://unpaywall.org/`, true); }
}

async function checkOpenRxiv(doi, cell) {
    const doiUrl = `https://doi.org/${doi}`;
    try {
        const res = await httpRequest({ method: 'GET', url: doiUrl, redirect: 'follow' });
        if (res.finalUrl) {
            const final = res.finalUrl;
            if (final.includes('biorxiv.org')) return updateLink(cell, '[PDF] BioRxiv', final.replace(/\/$/, '') + '.full.pdf');
            if (final.includes('medrxiv.org')) return updateLink(cell, '[PDF] MedRxiv', final.replace(/\/$/, '') + '.full.pdf');
        }
    } catch (e) {}
    updateLink(cell, '[No]', `https://doi.org/${doi}`, true);
    cell.innerHTML += `<a href="https://www.biorxiv.org/content/${doi}" target="_blank">BioRxiv</a><a href="https://www.medrxiv.org/content/${doi}" target="_blank">MedRxiv</a>`;
}

async function checkArxiv(doi, cell) {
    const searchUrl = `https://arxiv.org/search/?query=${encodeURIComponent(doi)}&searchtype=all`;
    if (!doi.includes('10.48550/arXiv.')) return updateLink(cell, '[No] ArXiv', searchUrl, true);
    const pdfUrl = `https://arxiv.org/pdf/${doi.replace(/^10\.48550\/arXiv\./i, '')}.pdf`;
    try {
        const { status } = await httpRequest({ method: 'HEAD', url: pdfUrl });
        updateLink(cell, status === 200 ? '[PDF] ArXiv' : '[No] ArXiv', status === 200 ? pdfUrl : searchUrl, status !== 200);
    } catch { updateLink(cell, '[No] ArXiv', searchUrl, true); }
}

async function checkOpenAlex(doi, cell) {
    const fallbackUrl = `https://openalex.org/works/https://doi.org/${encodeURIComponent(doi)}`;
    try {
        const res = await httpRequest({ method: 'GET', url: `https://api.openalex.org/works/https://doi.org/${encodeURIComponent(doi)}` });
        const data = JSON.parse(res.responseText);
        if (data?.primary_location?.pdf_url) updateLink(cell, '[PDF] OpenAlex', data.primary_location.pdf_url);
        else updateLink(cell, '[No] OpenAlex', data?.id || fallbackUrl, true);
    } catch { updateLink(cell, '[No] OpenAlex', fallbackUrl, true); }
}


function removeCurrentPopup() {
    if (currentPopup) { currentPopup.remove(); currentPopup = null; }
}

async function getDoiFromLink(linkElement) {
    const DOI_REGEX = /\b(10\.\d{4,}(?:\.\d+)*\/[^\s?#"&]+)/i;
    if (linkElement.dataset.doi) return linkElement.dataset.doi;
    if (linkElement.dataset.doiFailed) return null;
    const url = linkElement.href.toLowerCase();
    const keywords = ['doi','article','journal','paper', 'abstract','abs','content','document','fulltext','research','semanticscholar', 'mdpi','springer', 'pubmed'];
    if (!keywords.some(k => url.includes(k))) {
        linkElement.dataset.doiFailed = 'true';
        return null;
    }
    const cleanDOI = doi => (doi.match(DOI_REGEX)?.[1]?.trim() ?? doi.trim()).replace(/\/(meta|full|abs|pdf)\/?$/i, "").replace(/%e2%81%a9/gi, '').replace(/[.,)]+$/, '').replace(/\/[a-zA-Z0-9-]{26,}\/?$/i, '');
    let doi = url.match(DOI_REGEX)?.[1];
    if (!doi) {
        try {
            const res = await httpRequest({ method: 'GET', url: linkElement.href });
            doi = res.responseText.match(DOI_REGEX)?.[1];
        } catch {}
    }
    if (doi) {
        const final = cleanDOI(doi);
        linkElement.dataset.doi = final;
        return final;
    } else {
        linkElement.dataset.doiFailed = 'true';
        return null;
    }
}

async function checkJournalISSN(doi, cellRefs, journalLine, titleTextNode) {
    const data = await fetchCrossref(doi);
    const isSuccess = data.success;
    if(titleTextNode) {
        titleTextNode.textContent = isSuccess ? (data.title || 'No Title Found') : 'Title not found';
    }

    journalLine.textContent = isSuccess
        ? `${data.journal || 'N/A'} | ISSN: ${data.issn || 'N/A'} | Publisher: ${data.publisher || 'N/A'}`
        : 'Journal info not found';

    checkCiteBy(cellRefs.Cite, data.citationCount);
    checkRIS(cellRefs.RIS, doi, isSuccess);
    checkRetraction(doi, cellRefs.RWD, data.crossrefData);

    if (isSuccess) {
        if (cellRefs.Beall) checkBeallsList(data.journal, data.publisher, cellRefs.Beall);
        checkSJR(data.issn, cellRefs.SJR, cellRefs['H-index']);
        checkJIF(data.issn, cellRefs.JIF);
        checkCiteScore(data.issn, cellRefs.CiteScore);
    } else {
        if (cellRefs.Beall) checkBeallsList(null, null, cellRefs.Beall);
        checkSJR(null, cellRefs.SJR, cellRefs['H-index']);
        checkJIF(null, cellRefs.JIF);
        checkCiteScore(null, cellRefs.CiteScore);
    }
}

function createHeaderRow(text, isCopyable = true, customClass = '') {
    const header = document.createElement('div');
    header.className = 'doi-header ' + customClass;

    const contentSpan = document.createElement('span');
    contentSpan.className = 'text-content';
    contentSpan.textContent = text;
    header.appendChild(contentSpan);

    if (isCopyable) {
        const copyBtn = document.createElement('span');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.title = 'Copy content to clipboard';
        copyBtn.onclick = (e) => {
            e.stopPropagation();
            const textToCopy = contentSpan.textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyBtn.textContent = 'Copied';
                setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
            });
        };
        header.appendChild(copyBtn);
    }
    return { header, contentSpan };
}

async function showPopup(linkElement, doi, mouseX, mouseY) {
    clearTimeout(hideTimeout);
    removeCurrentPopup();
    const popup = document.createElement('div');
    popup.className = 'doi-enhancer-popup';
    currentPopup = popup;
    const doiRow = createHeaderRow(`DOI: ${doi}`, true);
    popup.appendChild(doiRow.header);
    const titleRow = createHeaderRow('...', true, 'doi-title-style');
    popup.appendChild(titleRow.header);
    const journalRow = createHeaderRow('...', false);
    popup.appendChild(journalRow.header);
    const table = document.createElement('table');
    const rows = [
        ['SJR', 'H-index', 'JIF', 'CiteScore'],
        ['Cite', 'RIS' ],
        ['RWD', 'PubPeer', 'Beall'],
        ['GS', 'Semantic', 'Unpay', 'OA' ],
        ['SH', 'Sci', 'LG', 'Anna' ],
        ['OpenRxiv' , 'Arxiv']
    ];

    const cellRefs = {};
    rows.forEach(rowKeys => {
        const row = table.insertRow();
        rowKeys.forEach(key => {
            const cell = row.insertCell();
            cell.textContent = '...';
            cell.className = 'status-checking';
            cellRefs[key] = cell;
        });
    });
    popup.appendChild(table);
    checkJournalISSN(doi, cellRefs, journalRow.contentSpan, titleRow.contentSpan);

    const checks = {
        PubPeer: checkPubPeer,
        GS: checkGoogleScholar,
        Semantic: checkSemanticScholar,
        Unpay: checkUnpaywall,
        OA: checkOpenAlex,
        SH: checkSciHub,
        Sci: checkSciNet,
        LG: checkLibgen,
        Anna: checkAnna,
        OpenRxiv: checkOpenRxiv,
        Arxiv: checkArxiv
    };

    for (const key in checks) {
        if(cellRefs[key]) {
            checks[key](doi, cellRefs[key]);
        }
    }


    document.body.appendChild(popup);
    popup.style.top = `${mouseY + 10}px`;
    popup.style.left = `${mouseX + 10}px`;
}



let hoveredLink = null;
let lastMouseX = 0;
let lastMouseY = 0;


function showStatusPopup(message, x, y, isError = true) {
    removeCurrentPopup();
    const popup = document.createElement('div');
    popup.className = 'doi-enhancer-popup';
    popup.style.top = `${y + 15}px`;
    popup.style.left = `${x + 10}px`;
    popup.style.padding = '8px 12px';
    popup.style.textAlign = 'center';

    const content = document.createElement('div');
    content.textContent = message;
    popup.appendChild(content);
    document.body.appendChild(popup);
    currentPopup = popup;
}



document.addEventListener('mousemove', (e) => {
    lastMouseX = e.pageX;
    lastMouseY = e.pageY;
    const target = e.target.closest('a');
    if (target) {
        hoveredLink = target;
    } else if (!e.target.closest('.doi-enhancer-popup')) {
        hoveredLink = null;
    }
});


document.addEventListener('keydown', async (e) => {
    if (e.key !== 'Control' || e.repeat) return;
    if (currentPopup) {
        removeCurrentPopup();
        return;
    }

    if (hoveredLink && hoveredLink.href) {
        const originalCursor = document.body.style.cursor;
        document.body.style.cursor = 'wait';

        try {
            const doi = await getDoiFromLink(hoveredLink);

            if (doi) {
                showPopup(hoveredLink, doi, lastMouseX, lastMouseY);
            } else {
                showStatusPopup("Invalid Link / No DOI Found", lastMouseX, lastMouseY, true);
            }
        } catch (err) {
            console.error(err);
            showStatusPopup("Error checking link", lastMouseX, lastMouseY, true);
        } finally {
            document.body.style.cursor = originalCursor;
        }
    }
});

document.addEventListener('click', (e) => {
    if (currentPopup && !e.target.closest('.doi-enhancer-popup')) {
        removeCurrentPopup();
    }
});

})();