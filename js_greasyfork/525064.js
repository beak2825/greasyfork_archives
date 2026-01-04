// ==UserScript==
// @name         Google Scholar to free PDFs
// @namespace    ScholarToSciHub
// @version      1.33
// @description  Adds Sci-Hub, LibGen, Anna's Archive, Sci-net, Semantic Scholar, Unpaywall, CORE, and EuropePMC to Google Scholar results
// @author       Bui Quoc Dung
// @match        https://scholar.google.*/*
// @license      AGPL-3.0-or-later
// @grant        GM.xmlHttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/525064/Google%20Scholar%20to%20free%20PDFs.user.js
// @updateURL https://update.greasyfork.org/scripts/525064/Google%20Scholar%20to%20free%20PDFs.meta.js
// ==/UserScript==

const SCIHUB_URL        = 'https://tesble.com/';
const LIBGEN_URL        = 'https://libgen.la/';
const LIBGEN_SEARCH_URL = LIBGEN_URL + 'index.php?req=';
const ANNA_URL          = 'https://annas-archive.org';
const ANNA_SCIDB_URL    = ANNA_URL + '/scidb/';
const ANNA_CHECK_URL    = ANNA_URL + '/search?index=journals&q=';
const SCINET_URL        = 'https://sci-net.xyz/';
const CROSSREF_URL      = 'https://api.crossref.org/works?query.title=';
const SEMANTIC_API_SEARCH_BASE = 'https://api.semanticscholar.org/graph/v1/paper/search';
const SEMANTIC_API_SEARCH_QS   = '?fields=title,url,openAccessPdf&limit=1&query=';
const SEMANTIC_API_DOI_BASE    = 'https://api.semanticscholar.org/graph/v1/paper/DOI:';
const SEMANTIC_API_DOI_QS      = '?fields=title,url,openAccessPdf';
const SEMANTIC_FALLBACK        = 'https://www.semanticscholar.org/search?q=';
const UNPAYWALL_API_BASE = 'https://api.unpaywall.org/v2/';
const UNPAYWALL_API_QS   = '?email=';
const UNPAYWALL_EMAIL    = 'support@unpaywall.org';
const UNPAYWALL_FALLBACK = 'https://unpaywall.org/';
const CORE_API_SEARCH_BASE = 'https://api.core.ac.uk/v3/search/works/';
const CORE_API_SEARCH_QS   = '?q=doi:';
const CORE_FALLBACK        = 'https://core.ac.uk/search/?q=';
const EUROPEPMC_API_BASE   = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search';
const EUROPEPMC_API_QS     = '?query=DOI:';
const EUROPEPMC_API_FMT    = '&format=json';
const EUROPEPMC_SEARCH     = 'https://europepmc.org/search?query=';
const DOI_REGEX = /\b(10\.\d{4,}(?:\.\d+)*\/(?:(?!["&'<>])\S)+)\b/gi;

function httpRequest(details) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            ...details,
            onload: resolve,
            onerror: reject
        });
    });
}

function updateLink(span, text, href, isNo = false) {
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.fontSize = '15px';
    if (isNo) link.style.color = 'gray';
    link.innerHTML = text.replace('[PDF]', '<b>[PDF]</b>').replace('[Maybe]', '<b>[Maybe]</b>');
    span.replaceWith(link);
}

function addLoadingIndicator(container) {
    const span = document.createElement('div');
    span.textContent = 'Loading...';
    span.style.marginBottom = '4px';
    span.style.color = 'gray';
    span.style.fontSize = '15px';
    container.appendChild(span);
    return span;
}

async function titleToDOI(title) {
    const encodedTitle = encodeURIComponent(title.trim());
    try {
        const crRes = await httpRequest({
            method: 'GET',
            url: `${CROSSREF_URL}${encodedTitle}&rows=1`
        });
        const data = JSON.parse(crRes.responseText);
        return data.message.items?.[0]?.DOI || null;
    } catch (err) {
        console.warn('titleToDOI error:', err);
        return null;
    }
}

function cleanDOI(doi) {
    const match = doi.match(/^10\.\d{4,}(?:\.\d+)*\/[^\s\/?#<>]+/);
    return match ? match[0] : doi.trim();
}

async function fetchDOI(titleLink) {
    const url = titleLink.href;
    const title = titleLink.textContent;

    if (url.toLowerCase().match(/\.pdf($|\?)/i)) {
        return await titleToDOI(title);
    }

    const urlDOIMatch = url.match(DOI_REGEX);
    if (urlDOIMatch) {
        return cleanDOI(urlDOIMatch[0]);
    }

    try {
        const res = await httpRequest({ method: 'GET', url });
        const html = res.responseText;

        const linkMatch = html.match(/<a[^>]+href=["']([^"']*doi\.org\/10\.[^"']+)["'][^>]*>/i);
        if (linkMatch) {
            const href = linkMatch[1];
            const doi = href.match(DOI_REGEX)?.[0];
            if (doi) return cleanDOI(doi);
        }

        const doiMatch = html.match(DOI_REGEX);
        if (doiMatch) return cleanDOI(doiMatch[0]);
        return await titleToDOI(title);

    } catch (err) {
        console.warn('fetchDOI error:', err);
        return null;
    }
}

// ==== Sources ====
async function checkLibgen(title, doi, span) {
    const trySearch = async (query) => {
        try {
            const res = await httpRequest({ method: 'GET', url: LIBGEN_SEARCH_URL + query });
            const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
            const table = doc.querySelector('.table.table-striped');
            const firstRow = table?.querySelector('tbody > tr');
            const secondTd = firstRow?.querySelectorAll('td')?.[1];
            const linkEl = secondTd?.querySelector('a[href^="edition.php?id="]');
            if (linkEl) {
                const href = linkEl.getAttribute('href');
                const detailUrl = LIBGEN_URL + href;
                const detailRes = await httpRequest({ method: 'GET', url: detailUrl });
                const detailDoc = new DOMParser().parseFromString(detailRes.responseText, 'text/html');
                const hasPDF = !!detailDoc.querySelector('table');
                if (hasPDF) {
                    updateLink(span, '[PDF] LibGen', LIBGEN_SEARCH_URL + query);
                    return true;
                }
            }
        } catch {}
        return false;
    };

    const encTitle = encodeURIComponent(title);
    if (!(await trySearch(encTitle)) && doi) {
        const encDOI = encodeURIComponent(doi);
        if (!(await trySearch(encDOI))) {
            updateLink(span, '[No] LibGen', LIBGEN_SEARCH_URL + encDOI, true);
        }
    } else if (!doi) {
        updateLink(span, '[No] LibGen', LIBGEN_SEARCH_URL + encTitle, true);
    }
}

async function checkSciHub(href, doi, span) {
    const tryURL = async (url) => {
        try {
            const res = await httpRequest({ method: 'GET', url });
            if (/iframe|embed/.test(res.responseText)) {
                updateLink(span, '[PDF] Sci-Hub', url);
                return true;
            }
        } catch {}
        return false;
    };

    if (!(await tryURL(SCIHUB_URL + href)) && doi) {
        if (!(await tryURL(SCIHUB_URL + doi))) {
            updateLink(span, '[No] Sci-Hub', SCIHUB_URL + doi, true);
        }
    } else if (!doi) updateLink(span, '[No] Sci-Hub', SCIHUB_URL + href, true);
}

async function checkAnna(doi, span, retry = 0) {
    const checkUrl = ANNA_CHECK_URL + encodeURIComponent(doi);
    const directUrl = ANNA_SCIDB_URL + doi;
    try {
        const res = await httpRequest({ method: 'GET', url: checkUrl });
        const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
        const bodyText = doc.body.textContent;
        if (bodyText.includes("Rate limited") && retry < 10) {
            setTimeout(() => checkAnna(doi, span, retry + 1), 5000);
            return;
        }
        const found = doc.querySelector('.mt-4.uppercase.text-xs.text-gray-500') ||
            [...doc.querySelectorAll('div.text-gray-500')].some(div => div.textContent.includes(doi));
        if (found) {
            const res2 = await httpRequest({ method: 'GET', url: directUrl });
            const doc2 = new DOMParser().parseFromString(res2.responseText, 'text/html');
            const hasPDF = doc2.querySelector('.pdfViewer, #viewerContainer, iframe[src*="viewer.html?file="]');
            updateLink(span, hasPDF ? '[PDF] Anna' : '[Maybe] Anna', directUrl);
        } else {
            updateLink(span, '[No] Anna', checkUrl, true);
        }
    } catch {
        updateLink(span, '[No] Anna', checkUrl, true);
    }
}

async function checkSciNet(doi, span) {
    try {
        const res = await httpRequest({ method: 'GET', url: SCINET_URL + doi });
        updateLink(span, /iframe|pdf|embed/.test(res.responseText) ? '[PDF] Sci-net' : '[No] Sci-net', SCINET_URL + doi, !/pdf/.test(res.responseText));
    } catch {
        updateLink(span, '[No] Sci-net', SCINET_URL + doi, true);
    }
}

async function checkSemanticScholar(title, span, doi = null) {
    const titleQuery = `${SEMANTIC_API_SEARCH_BASE}${SEMANTIC_API_SEARCH_QS}${encodeURIComponent(title)}`;
    try {
        const res = await httpRequest({ method: 'GET', url: titleQuery });
        const data = JSON.parse(res.responseText);
        const paper = data?.data?.[0];
        const pdfUrl = paper?.openAccessPdf?.url;
        if (pdfUrl) {
            updateLink(span, '[PDF] Semantic', pdfUrl);
            return;
        }
    } catch {}

    if (doi) {
        const doiQuery = `${SEMANTIC_API_DOI_BASE}${encodeURIComponent(doi)}${SEMANTIC_API_DOI_QS}`;
        try {
            const res = await httpRequest({ method: 'GET', url: doiQuery });
            const data = JSON.parse(res.responseText);
            const pdfUrl = data?.openAccessPdf?.url;
            if (pdfUrl) {
                updateLink(span, '[PDF] Semantic', pdfUrl);
                return;
            }
        } catch {}
    }

    const fallbackUrl = `${SEMANTIC_FALLBACK}${encodeURIComponent(doi || title)}`;
    updateLink(span, '[No] Semantic', fallbackUrl, true);
}

async function checkUnpaywall(doi, span) {
    const url = `${UNPAYWALL_API_BASE}${encodeURIComponent(doi)}${UNPAYWALL_API_QS}${encodeURIComponent(UNPAYWALL_EMAIL)}`;
    try {
        const res = await httpRequest({ method: 'GET', url });
        const data = JSON.parse(res.responseText);
        if (data?.is_oa && data.best_oa_location?.url) {
            updateLink(span, '[PDF] Unpaywall', data.best_oa_location.url);
        } else {
            updateLink(span, '[No] Unpaywall', UNPAYWALL_FALLBACK, true);
        }
    } catch {
        updateLink(span, '[No] Unpaywall', UNPAYWALL_FALLBACK, true);
    }
}

async function checkCore(doi, span) {
    const searchUrl = `${CORE_API_SEARCH_BASE}${CORE_API_SEARCH_QS}${encodeURIComponent(doi)}`;
    try {
        const res = await httpRequest({
            method: 'GET',
            url: searchUrl,
            headers: { accept: 'application/json' }
        });
        const data = JSON.parse(res.responseText);

        const result = data?.results?.find(r => r?.doi?.toLowerCase() === doi.toLowerCase());
        const pdfUrl = result?.downloadUrl;

        if (pdfUrl) {
            updateLink(span, '[PDF] Core', pdfUrl);
        } else {
            updateLink(span, '[No] Core', `${CORE_FALLBACK}${encodeURIComponent(doi)}`, true);
        }
    } catch {
        updateLink(span, '[No] Core', `${CORE_FALLBACK}${encodeURIComponent(doi)}`, true);
    }
}

async function checkEuropePMC(doi, span) {
    const apiUrl = `${EUROPEPMC_API_BASE}${EUROPEPMC_API_QS}${encodeURIComponent(doi)}${EUROPEPMC_API_FMT}`;
    try {
        const res = await httpRequest({ method: 'GET', url: apiUrl });
        const data = JSON.parse(res.responseText);
        const results = data?.resultList?.result || [];
        const result = results.find(r => r.doi?.toLowerCase() === doi.toLowerCase());

        if (result && result.isOpenAccess === 'Y' && result.fullTextIdList?.fullTextId?.length) {
            const accid = result.fullTextIdList.fullTextId[0];
            const pdfUrl = `https://europepmc.org/backend/ptpmcrender.fcgi?accid=${accid}&blobtype=pdf`;
            updateLink(span, '[PDF] EuropePMC', pdfUrl);
            return;
        }

        const fullTextObjs = result?.fullTextIdList?.fullTextId;
        if (Array.isArray(fullTextObjs)) {
            const pdfObj = fullTextObjs.find(obj => obj.documentStyle === 'pdf' && obj.url);
            if (pdfObj?.url) {
                updateLink(span, '[PDF] EuropePMC', pdfObj.url);
                return;
            }
        }

        updateLink(span, '[No] EuropePMC', `${EUROPEPMC_SEARCH}${encodeURIComponent(doi)}`, true);
    } catch {
        updateLink(span, '[No] EuropePMC', `${EUROPEPMC_SEARCH}${encodeURIComponent(doi)}`, true);
    }
}

async function processEntry(result) {
    const titleLink = result.querySelector('.gs_rt a');
    if (!titleLink) return;

    let buttonContainer = result.querySelector('.gs_or_ggsm');
    if (!buttonContainer) {
        const div = document.createElement('div');
        div.className = 'gs_ggs gs_fl';
        div.innerHTML = '<div class="gs_ggsd"><div class="gs_or_ggsm"></div></div>';
        result.insertBefore(div, result.firstChild);
        buttonContainer = div.querySelector('.gs_or_ggsm');
    }
    if (buttonContainer.classList.contains('scihub-processed')) return;
    buttonContainer.classList.add('scihub-processed');

    const findBtn = document.createElement('button');
    findBtn.textContent = 'Find PDFs';
    findBtn.style.color = 'black';
    findBtn.style.fontSize = '14px';
    buttonContainer.appendChild(findBtn);

    findBtn.addEventListener('click', async () => {
        findBtn.remove();
        const row1 = document.createElement('span'); row1.style.display = 'inline-flex'; row1.style.gap = '6px';
        const scihubSpan = addLoadingIndicator(row1);
        const libgenSpan = addLoadingIndicator(row1);

        const row2 = document.createElement('span'); row2.style.display = 'inline-flex'; row2.style.gap = '6px';
        const annaSpan = addLoadingIndicator(row2);
        const scinetSpan = addLoadingIndicator(row2);

        const row3 = document.createElement('span'); row3.style.display = 'inline-flex'; row3.style.gap = '6px';
        const semanticSpan = addLoadingIndicator(row3);
        const unpaywallSpan = addLoadingIndicator(row3);

        const row4 = document.createElement('span'); row4.style.display = 'inline-flex'; row4.style.gap = '6px';
        const coreSpan = addLoadingIndicator(row4);
        const europepmcSpan = addLoadingIndicator(row4);

        [row1, row2, row3, row4].forEach(r => buttonContainer.appendChild(r));

        const doi = await fetchDOI(titleLink);

        checkLibgen(titleLink.textContent, doi, libgenSpan);
        checkSciHub(titleLink.href, doi, scihubSpan);
        checkSemanticScholar(titleLink.textContent, semanticSpan, doi);

        if (doi) {
            checkAnna(doi, annaSpan);
            checkSciNet(doi, scinetSpan);
            checkUnpaywall(doi, unpaywallSpan);
            checkCore(doi, coreSpan);
            checkEuropePMC(doi, europepmcSpan);
        } else {
            [annaSpan, scinetSpan, unpaywallSpan, coreSpan, europepmcSpan].forEach(span =>
                updateLink(span, '[No] Source', '#', true));
        }
    });
}

async function addButtons() {
    const results = document.querySelectorAll('#gs_res_ccl_mid .gs_r.gs_or.gs_scl');
    for (const result of results) await processEntry(result);
}

addButtons();
new MutationObserver(() => addButtons()).observe(document.body, { childList: true, subtree: true });
