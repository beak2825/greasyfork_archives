// ==UserScript==
// @name         DOI & BibTeX & PDF Plugin
// @name:zh-CN   DOI和BibTeX和PDF下载插件
// @description  Adds buttons to copy DOI, fetch BibTeX citation, and download PDF from literature pages
// @description:zh-CN 添加按钮来复制DOI、获取文献的BibTeX引用格式并下载PDF
// @version      0.2 // Incremented version to reflect styling changes
// @author       Yul
// @license      MIT License
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-end
// @match        *://www.astm.org/*
// @match        *://www.scirp.org/journal/*
// @match        *://direct.mit.edu/neco/*
// @match        *://ieeexplore.ieee.org/*document/*
// @match        *://ascelibrary.org/doi/*
// @match        *://nhess.copernicus.org/articles/*
// @match        *://www.cambridge.org/core/journals/*
// @match        *://www.mdpi.com/*
// @match        *://en.cgsjournals.com/article/doi/*
// @match        *://adgeo.copernicus.org/articles/*
// @match        *://papers.ssrn.com/*
// @match        *://www.sciencedirect.com/science/article/*
// @match        *://onlinelibrary.wiley.com/doi/*
// @match        *://*.onlinelibrary.wiley.com/doi/*
// @match        *://pubs.acs.org/doi/*
// @match        *://www.tandfonline.com/doi/*
// @match        *://www.beilstein-journals.org/*
// @match        *://www.eurekaselect.com/*/article*
// @match        *://*.springeropen.com/article*
// @match        *://aip.scitation.org/doi/*
// @match        *://www.nature.com/articles*
// @match        *://*.sciencemag.org/content*
// @match        *://journals.aps.org/*/abstract/10*
// @match        *://www.nrcresearchpress.com/doi/10*
// @match        *://iopscience.iop.org/article/10*
// @match        *://www.cell.com/*/fulltext/*
// @match        *://journals.lww.com/*
// @match        *://*.biomedcentral.com/articles/*
// @match        *://journals.sagepub.com/doi/*
// @match        *://academic.oup.com/*/article/*
// @match        *://www.karger.com/Article/*
// @match        *://www.cambridge.org/core/journals/*/article/*
// @match        *://www.annualreviews.org/doi/*
// @match        *://www.jstage.jst.go.jp/article/*
// @match        *://www.hindawi.com/journals/*
// @match        *://www.cardiology.theclinics.com/article/*
// @match        *://www.liebertpub.com/doi/*
// @match        *://thorax.bmj.com/content/*
// @match        *://journals.physiology.org/doi/*
// @match        *://www.ahajournals.org/doi/*
// @match        *://dl.acm.org/doi/*
// @match        *://*.asm.org/content/*
// @match        *://content.apa.org/*
// @match        *://www.thelancet.com/journals/*/article/*
// @match        *://jamanetwork.com/journals/*
// @match        *://*.aacrjournals.org/content/*
// @match        *://royalsocietypublishing.org/doi/*
// @match        *://journals.plos.org/*/article*
// @match        *://*.psychiatryonline.org/doi/*
// @match        *://www.osapublishing.org/*/abstract.cfm*
// @match        *://www.thieme-connect.de/products/ejournals/*
// @match        *://journals.ametsoc.org/*/article/*
// @match        *://www.frontiersin.org/articles/*
// @match        *://www.worldscientific.com/doi/*
// @match        *://www.nejm.org/doi/*
// @match        *://ascopubs.org/doi/*
// @match        *://www.jto.org/article/*
// @match        *://www.jci.org/articles/*
// @match        *://pubmed.ncbi.nlm.nih.gov/*
// @match        *://www.spiedigitallibrary.org/conference-*
// @match        *://www.ingentaconnect.com/content/*
// @match        *://www.taylorfrancis.com/*
// @match        *://www.science.org/doi/*
// @match        *://www.scinapse.io/papers/*
// @match        *://www.semanticscholar.org/paper/*
// @match        *://www.researchgate.net/publication/*
// @match        *://www.earthdoc.org/content/papers/*
// @match        *://era.library.ualberta.ca/items*
// @match        *://arxiv.org/abs/*
// @match        *://asmedigitalcollection.asme.org/IPC*
// @match        *://open.library.ubc.ca/soa/cIRcle/collections/*
// @match        *://pubs.geoscienceworld.org/aeg/eeg/article/*
// @match        *://othes.univie.ac.at/*
// @match        *://www.atlantis-press.com/journals/*
// @match        *://www.koreascience.or.kr/article/*
// @match        *://www.geenmedical.com/article*
// @match        *://www.ncbi.nlm.nih.gov/pmc/articles/*
// @match        *://qjegh.lyellcollection.org/content/*
// @match        *://cdnsciencepub.com/doi/*
// @match        *://ojs.aaai.org//index.php/AAAI/article/*
// @match        *://www.ijcai.org/proceedings/*
// @match        *://www.scopus.com/record/display.uri*
// @match        *://avs.scitation.org/doi/*
// @match        *://pubs.rsc.org/*/content/*
// @match        *://*.copernicus.org/articles/*
// @match        *://europepmc.org/article/*
// @match        *://www.futuremedicine.com/doi/*
// @include      /^http[s]?:\/\/[\S\s]*webofscience[\S\s]+$/
// @include      /^http[s]?:\/\/[\S\s]*springer[\S\s]*/(article|chapter)/
// @include      /^http[s]?:\/\/[\S\s]*onepetro.org/[\S\s]+/(article|proceedings)/
// @namespace https://greasyfork.org/users/1479737
// @downloadURL https://update.greasyfork.org/scripts/538531/DOI%20%20BibTeX%20%20PDF%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/538531/DOI%20%20BibTeX%20%20PDF%20Plugin.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Configuration Constants
    const CONFIG = {
        MAX_RETRY: 15,
        RETRY_INTERVAL: 300,
        FEEDBACK_DURATION: 2000,
        BIBTEX_TIMEOUT: 10000,
        PDF_TIMEOUT: 15000, // For PDF access checks and other PDF operations
    };

    // BibTeX API Services
    const BIBTEX_APIS = [
        {
            name: 'CrossRef',
            url: (doi) => `https://api.crossref.org/works/${doi}/transform/application/x-bibtex`,
            headers: {'Accept': 'application/x-bibtex'}
        },
        {
            name: 'DOI.org',
            url: (doi) => `https://doi.org/${doi}`,
            headers: {'Accept': 'application/x-bibtex'}
        },
        {
            name: 'Crosscite',
            url: (doi) => `https://citation.crosscite.org/format?doi=${doi}&style=bibtex&lang=en-US`,
            headers: {'Accept': 'text/plain'}
        }
    ];

    // PDF Download Link Selectors (prioritized)
    const PDF_SELECTORS = {
        'generic': [
            'a[href$=".pdf"]', 'a[href*="/pdf/"]', 'a[href*="pdf"]',
            'a[title*="PDF" i]', 'a[title*="Download" i]',
            '.pdf-download a', '.download-pdf a', '.full-text-pdf a'
        ],
        'specific': {
            'www.nature.com': ['a[data-track-action="download pdf"]', 'a[href*="/pdf/"]', '.c-pdf-download__link'],
            'ieeexplore.ieee.org': ['a[href*="stamp.jsp"]', '.pdf-btn a', 'a[href*="arnumber"][href*="pdf"]'],
            'www.sciencedirect.com': ['a[pdfurl]', '.PdfDownloadButton', 'a[href*="pdfft"]', 'a[data-testid="pdf-link"]'],
            'onlinelibrary.wiley.com': ['a[href*="pdf"]', '.doi-access a', '.pdf-download-btn', 'a[title*="PDF" i]'],
            'link.springer.com': ['a[href*="pdf"]', '.pdf-link', '.c-pdf-download__link', 'a[data-track="click_pdf"]'],
            'journals.plos.org': ['a[id*="downloadPdf"]', '.download a[href*="pdf"]', 'a[href*="article/file"]'],
            'www.ncbi.nlm.nih.gov': ['a[href*="/pmc/articles/"][href*="/pdf/"]', '.pdf-link', 'a[title*="PDF" i]'],
            'pubmed.ncbi.nlm.nih.gov': ['.full-text-links a[href*="pdf"]', 'a[data-ga-action="full_text"]'],
            'journals.aps.org': ['a[href*="/pdf/"]', '.article-nav a[href*="pdf"]'],
            'iopscience.iop.org': ['a[href*="/pdf/"]', '.pdf-download a'],
            'www.tandfonline.com': ['a[href*="pdf"]', '.show-pdf a'],
            'pubs.acs.org': ['a[href*="pdf"]', '.article-pdfLink'],
            'academic.oup.com': ['a[href*="pdf"]', '.al-link-pdf'],
            'www.mdpi.com': ['a[href*="pdf"]', '.download-pdf a'],
            'www.frontiersin.org': ['a[href*="pdf"]', '.download-files a[href*="pdf"]']
        }
    };

    // Site-Specific PDF URL Smart Extractors
    const SITE_SPECIFIC_PDF_EXTRACTORS = {
        'arxiv.org': () => window.location.pathname.match(/\/abs\/(.+)/) ? `https://arxiv.org/pdf/${window.location.pathname.match(/\/abs\/(.+)/)[1]}.pdf` : null,
        'www.nature.com': () => {
            const pdfLink = document.querySelector('a[data-track-action="download pdf"]');
            if (pdfLink) return pdfLink.href;
            const articleMatch = window.location.pathname.match(/\/articles\/([^\/]+)/);
            return articleMatch ? `https://www.nature.com/articles/${articleMatch[1]}.pdf` : null;
        },
        'www.sciencedirect.com': () => {
            const pdfBtn = document.querySelector('a[pdfurl]');
            if (pdfBtn) return pdfBtn.getAttribute('pdfurl');
            const scripts = document.querySelectorAll('script[type="application/json"]');
            for (const script of scripts) {
                try { if (JSON.parse(script.textContent)?.article?.pdfUrl) return JSON.parse(script.textContent).article.pdfUrl; } catch (e) { continue; }
            }
            return null;
        },
        'ieeexplore.ieee.org': () => {
            const stampLink = document.querySelector('a[href*="stamp.jsp"]');
            if (stampLink) return stampLink.href;
            const arnumberMatch = window.location.search.match(/arnumber=(\d+)/);
            return arnumberMatch ? `https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=${arnumberMatch[1]}` : null;
        },
        'onlinelibrary.wiley.com': () => {
            const pdfLink = document.querySelector('a[href*="pdf"][title*="PDF"]'); // More specific
            if (pdfLink) return pdfLink.href;
            const doiMatch = window.location.pathname.match(/\/doi\/(10\..+)/);
            return doiMatch ? `https://onlinelibrary.wiley.com/doi/pdf/${doiMatch[1]}` : null;
        },
        'www.ncbi.nlm.nih.gov': () => {
            if (window.location.pathname.includes('/pmc/articles/')) {
                const pmcMatch = window.location.pathname.match(/(PMC\d+)/);
                return pmcMatch ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcMatch[1]}/pdf/` : null;
            }
            return null;
        },
        'journals.plos.org': () => {
            const pdfLink = document.querySelector('a[id*="downloadPdf"]');
            if (pdfLink) return pdfLink.href;
            const doiMatch = window.location.search.match(/id=(10\..+)/); // Assuming ID is DOI
            return doiMatch ? `https://journals.plos.org/plosone/article/file?id=${doiMatch[1]}&type=printable` : null;
        },
        'link.springer.com': () => {
            const pdfLink = document.querySelector('a.c-pdf-download__link, a[data-track="click_pdf"][href*="pdf"]');
            if (pdfLink) return pdfLink.href;
            const doiMatch = window.location.pathname.match(/\/(10\.[^/]+\/[^/]+)/);
            return doiMatch ? `https://link.springer.com/content/pdf/${doiMatch[1]}.pdf` : null;
        }
    };

    // State Management
    let state = {
        timer: null,
        retryCount: 0,
        currentDOI: null,
        currentPDFUrl: null,
        widget: null,
        bibtexCache: new Map(),
        pdfCache: new Map()
    };

    // DOI Extraction Rules
    const DOI_SELECTORS = [
        'meta[name="citation_doi"]', 'meta[name="dc.identifier"][scheme="DOI"]',
        'meta[name="dc.Identifier"][scheme="DOI"]', 'meta[name="DC.identifier"][scheme="DOI"]',
        'meta[name="dc.identifier"]', 'meta[name="dc.Identifier"]', 'meta[name="DC.identifier"]',
        'meta[property="og:url"]'
    ];
    const SITE_SPECIFIC_EXTRACTORS = { // For DOI
        'ieeexplore.ieee.org': () => document.querySelector('div.stats-document-abstract-doi a')?.textContent,
        'www.sciencedirect.com': () => {
            const script = document.querySelector('script[type="application/json"][data-iso-key="_0"]');
            if (script?.textContent) { try { return JSON.parse(script.textContent)?.article?.doi; } catch (e) { console.warn('Failed to parse ScienceDirect JSON for DOI:', e); } }
        },
        'www.researchgate.net': () => document.querySelector("div.research-detail-meta-item a[href*='doi.org/10.'], div.js-publication-details a[href*='doi.org/10.']")?.href,
        'www.webofscience.com': () => document.querySelector('#FullRTa-DOI, app-full-record-summary-item[data-test-id="summary-DOI"] .value')?.textContent,
        'pubmed.ncbi.nlm.nih.gov': () => document.querySelector('span.citation-doi a, a.id-link[data-ga-action="DOI"]')?.textContent,
        'www.ncbi.nlm.nih.gov': () => window.location.pathname.includes('/pmc/articles/') ? document.querySelector('td.doi a, span.doi a')?.textContent : null,
        'arxiv.org': () => document.querySelector('td.tablecell.doi a, div.submission-history dt:contains("DOI:") + dd, div.extra-services div.full-text ul li a[href*="doi.org/10."]')?.textContent || document.querySelector('div.extra-services div.full-text ul li a[href*="doi.org/10."]')?.href,
        'www.semanticscholar.org': () => document.querySelector('span[data-test-id="paper-doi"] a')?.href || document.querySelector('[data-test-id="paper-meta-item"] a[href*="doi.org"]')?.textContent
    };

    // Utility Functions
    const utils = {
        normalizeHostname: (hostname) => {
            if (hostname.includes('webofscience')) return 'www.webofscience.com';
            if (hostname.includes('springer.com') || hostname.includes('springerlink.com')) return 'link.springer.com';
            if (hostname.includes('onlinelibrary.wiley.com')) return 'onlinelibrary.wiley.com';
            return hostname;
        },
        normalizeDOI: (doi) => {
            if (!doi) return null;
            let normalized = decodeURIComponent(doi.toString().trim()).replace(/^doi:\s*/i, '').replace(/^https?:\/\/doi\.org\//i, '');
            const strictMatch = normalized.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i);
            if (strictMatch) return strictMatch[0];
            const looseMatch = normalized.match(/10\.[^\s]+/);
            return looseMatch && normalized.startsWith("10.") ? looseMatch[0] : null;
        },
        debounce: (func, delay) => {
            let timeoutId;
            return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => func.apply(null, args), delay); };
        },
        cleanBibTeX: (bibtex) => {
            if (!bibtex) return null;
            return bibtex.replace(/^\s+|\s+$/g, '').replace(/\n\s*\n/g, '\n').replace(/\s+/g, ' ').replace(/,\s*}/g, '\n}').replace(/,\s*([a-zA-Z])/g, ',\n  $1');
        },
        generatePDFFilename: (doi, title) => {
            let filename = '';
            if (title) { filename = title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').substring(0, 50); }
            else if (doi) { filename = doi.replace(/[/\\:*?"<>|]/g, '_'); }
            else { filename = `paper_${Date.now()}`; }
            return `${filename}.pdf`;
        },
        isValidPDFUrl: (url) => {
            if (!url) return false;
            try { new URL(url, window.location.href); } catch { return false; }
            const excludePatterns = [/\.(jpg|jpeg|png|gif|svg|css|js|html)$/i, /javascript:/i, /mailto:/i, /#$/];
            return !excludePatterns.some(pattern => pattern.test(url));
        },
        checkPDFAccess: async (url) => {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'HEAD', url: url, timeout: CONFIG.PDF_TIMEOUT / 3, // Shorter timeout for HEAD
                    onload: (response) => {
                        const isAccessible = response.status === 200 || response.status === 302;
                        const contentType = response.responseHeaders?.toLowerCase() || "";
                        const isPDF = contentType.includes('application/pdf') || url.toLowerCase().endsWith('.pdf');
                        resolve(isAccessible && isPDF);
                    },
                    onerror: () => resolve(false), ontimeout: () => resolve(false)
                });
            });
        }
    };

    // DOI Extractor
    const extractDOI = () => {
        const hostname = utils.normalizeHostname(window.location.hostname);
        const siteExtractor = SITE_SPECIFIC_EXTRACTORS[hostname];
        if (siteExtractor) { const doi = siteExtractor(); if (doi) return utils.normalizeDOI(doi); }
        for (const selector of DOI_SELECTORS) {
            const element = document.querySelector(selector);
            if (element?.content) { const doi = utils.normalizeDOI(element.content); if (doi) return doi; }
        }
        const doiLink = document.querySelector('a[href*="doi.org/10."]');
        if (doiLink?.href) return utils.normalizeDOI(doiLink.href);
        return null;
    };

    // BibTeX Fetching
    const fetchBibTeX = async (doi) => {
        if (state.bibtexCache.has(doi)) return state.bibtexCache.get(doi);
        for (const api of BIBTEX_APIS) {
            try {
                const result = await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => reject(new Error('Timeout')), CONFIG.BIBTEX_TIMEOUT);
                    GM_xmlhttpRequest({
                        method: 'GET', url: api.url(doi), headers: api.headers, timeout: CONFIG.BIBTEX_TIMEOUT,
                        onload: (response) => {
                            clearTimeout(timeout);
                            if (response.status === 200 && response.responseText) {
                                const cleaned = utils.cleanBibTeX(response.responseText);
                                if (cleaned && cleaned.includes('@')) resolve(cleaned); else reject(new Error('Invalid BibTeX format'));
                            } else reject(new Error(`HTTP ${response.status}`));
                        },
                        onerror: (error) => { clearTimeout(timeout); reject(error); },
                        ontimeout: () => { clearTimeout(timeout); reject(new Error('Request timeout')); }
                    });
                });
                state.bibtexCache.set(doi, result); console.log(`BibTeX fetched successfully from ${api.name}`); return result;
            } catch (error) { console.warn(`${api.name} failed:`, error.message); continue; }
        }
        throw new Error('All BibTeX APIs failed');
    };

    // --- PDF Specific Functions ---
    const findBestPDFUrl = async () => {
        const hostname = utils.normalizeHostname(window.location.hostname);
        const candidates = [];

        const sitePdfExtractor = SITE_SPECIFIC_PDF_EXTRACTORS[hostname];
        if (sitePdfExtractor) { const url = sitePdfExtractor(); if (url && utils.isValidPDFUrl(url)) candidates.push({ url, priority: 10, source: 'site-specific-extractor' });}

        const siteSelectors = PDF_SELECTORS.specific[hostname];
        if (siteSelectors) {
            for (let i = 0; i < siteSelectors.length; i++) {
                try {
                    document.querySelectorAll(siteSelectors[i]).forEach(el => {
                        const url = el.href || el.getAttribute('pdfurl') || el.getAttribute('data-pdf-url');
                        if (url && utils.isValidPDFUrl(url)) candidates.push({ url, priority: 9 - i, source: `site-selector: ${siteSelectors[i]}`});
                    });
                } catch (e) { console.warn(`PDF selector failed: ${siteSelectors[i]}`, e); }
            }
        }

        PDF_SELECTORS.generic.forEach((selector, index) => {
            try {
                document.querySelectorAll(selector).forEach(el => {
                    const url = el.href || el.getAttribute('pdfurl');
                    if (url && utils.isValidPDFUrl(url)) {
                        let priority = 6 - index;
                        if (url.toLowerCase().includes('pdf') || url.endsWith('.pdf')) priority += 2;
                        const text = el.textContent?.toLowerCase() || '';
                        if (text.includes('pdf') || text.includes('download')) priority += 1;
                        candidates.push({ url, priority, source: `generic: ${selector}`});
                    }
                });
            } catch (e) { console.warn(`Generic PDF selector failed: ${selector}`, e); }
        });

        if (state.currentDOI) {
            generateDOIBasedPDFUrls(state.currentDOI).forEach(url => candidates.push({ url, priority: 3, source: 'doi-based' }));
        }

        candidates.sort((a, b) => b.priority - a.priority);
        const uniqueCandidates = Array.from(new Map(candidates.map(c => [c.url, c])).values());
        console.log('PDF candidates found:', uniqueCandidates.map(c => `${c.url} (P:${c.priority}, S:${c.source})`));

        for (const candidate of uniqueCandidates.slice(0, 5)) { // Check top 5
            if (await utils.checkPDFAccess(candidate.url)) { console.log(`Best PDF URL selected (accessible): ${candidate.url} (${candidate.source})`); return candidate.url; }
        }
        return uniqueCandidates.length > 0 ? uniqueCandidates[0].url : null; // Fallback to highest priority if none are confirmed accessible
    };

    const generateDOIBasedPDFUrls = (doi) => { // Simplified
        if (!doi) return [];
        const doiParts = doi.split('/');
        const suffix = doiParts.length > 1 ? doiParts[1] : doi;
        return [
            `https://www.nature.com/articles/${suffix}.pdf`,
            `https://link.springer.com/content/pdf/${doi}.pdf`,
            `https://onlinelibrary.wiley.com/doi/pdf/${doi}`
            // Add more patterns if known and reliable
        ].filter(url => utils.isValidPDFUrl(url));
    };

    const deepScanForPDF = () => {
        const potentialLinks = [];
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.href.toLowerCase(); const text = link.textContent.toLowerCase();
            const pdfKeywords = ['pdf', 'download', 'full text', 'full-text', 'view pdf', 'get pdf'];
            if (pdfKeywords.some(k => href.includes(k) || text.includes(k)) && utils.isValidPDFUrl(link.href)) {
                let score = 1;
                if (href.endsWith('.pdf')) score += 5; if (href.includes('/pdf/')) score += 3;
                if (text.includes('pdf')) score += 2; if (text.includes('download')) score += 2;
                if (link.download) score += 3;
                potentialLinks.push({ url: link.href, score });
            }
        });
        potentialLinks.sort((a, b) => b.score - a.score);
        return potentialLinks.length > 0 ? potentialLinks[0].url : null;
    };

    const heuristicPDFSearch = async () => {
        const embeds = document.querySelectorAll('embed[src*="pdf"], object[data*="pdf"], iframe[src*="pdf"]');
        for (const embed of embeds) { const src = embed.src || embed.data; if (src && utils.isValidPDFUrl(src)) return src; }
        const scripts = document.querySelectorAll('script:not([src])');
        for (const script of scripts) {
            const text = script.textContent; const pdfMatches = text.match(/["'](https?:\/\/[^"']*\.pdf[^"']*?)["']/gi);
            if (pdfMatches) { for (const match of pdfMatches) { const url = match.slice(1, -1); if (utils.isValidPDFUrl(url)) return url; } }
        }
        const dataElements = document.querySelectorAll('[data-pdf-url], [data-download-url], [data-file-url]');
        for (const el of dataElements) { const url = el.dataset.pdfUrl || el.dataset.downloadUrl || el.dataset.fileUrl; if (url && utils.isValidPDFUrl(url)) return url; }
        return null;
    };

    const downloadPDF = async (pdfUrl, button) => {
        if (!pdfUrl) { showCopyFeedback(button, '无PDF链接', true); return; }
        try {
            const title = document.querySelector('meta[name="citation_title"]')?.content || document.querySelector('h1')?.textContent || document.title;
            const filename = utils.generatePDFFilename(state.currentDOI, title);
            if (typeof GM_download !== 'undefined') {
                GM_download({ url: pdfUrl, name: filename, saveAs: true }); // saveAs: true to prompt user
                showCopyFeedback(button, '下载中...', false); console.log(`Downloading PDF: ${pdfUrl} as ${filename}`); return;
            }
            const link = document.createElement('a'); link.href = pdfUrl; link.download = filename; link.target = '_blank';
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            showCopyFeedback(button, '已启动下载', false); console.log(`PDF download initiated: ${pdfUrl}`);
        } catch (error) { console.error('PDF download failed:', error); showCopyFeedback(button, '下载失败', true); }
    };

    const enhancedDownloadPDF = async (button) => {
        const originalText = button.textContent;
        button.textContent = 'PDF'; button.disabled = true;
        try {
            let pdfUrl = state.currentPDFUrl || state.pdfCache.get(window.location.href);
            if (!pdfUrl) pdfUrl = await findBestPDFUrl();
            if (!pdfUrl) pdfUrl = deepScanForPDF();
            if (!pdfUrl) pdfUrl = await heuristicPDFSearch();

            if (pdfUrl) {
                state.currentPDFUrl = pdfUrl; state.pdfCache.set(window.location.href, pdfUrl);
                await downloadPDF(pdfUrl, button); // This will call showCopyFeedback
            } else {
                showCopyFeedback(button, '未找到PDF', true); // This restores button
            }
        } catch (error) {
            console.error('Enhanced PDF download failed:', error);
            showCopyFeedback(button, 'PDF错误', true); // This restores button
        }
        // If showCopyFeedback was called, button state is handled.
        // If an error occurred before showCopyFeedback, or if it didn't restore for some reason:
        if (button.textContent === 'PDF') { // Check if it's still in intermediate state
             button.textContent = originalText;
             button.disabled = false;
        }
    };
    // --- End PDF Specific Functions ---

    // Clipboard Operations
    const copyToClipboard = async (text, button, successMsg = 'Copied') => {
        try {
            if (typeof GM_setClipboard !== 'undefined') { GM_setClipboard(text); showCopyFeedback(button, successMsg); return; }
            if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); showCopyFeedback(button, successMsg); return; }
            throw new Error('No clipboard API available');
        } catch (error) { console.error('Failed to copy:', error); showCopyFeedback(button, '复制失败', true); }
    };

    // Feedback Display
    const showCopyFeedback = (button, message, isError = false) => {
        if (!button) return;
        const originalText = button.dataset.originalText || button.textContent; // Store original text if not already
        if (!button.dataset.originalText) button.dataset.originalText = button.textContent;

        button.textContent = message;
        const baseClass = button.className.replace(/ copied-feedback| error-feedback/g, '');
        button.className = baseClass + (isError ? ' error-feedback' : ' copied-feedback');
        button.disabled = true;

        setTimeout(() => {
            button.textContent = originalText;
            button.className = baseClass;
            button.disabled = false;
            delete button.dataset.originalText; // Clean up
        }, CONFIG.FEEDBACK_DURATION);
    };

    // BibTeX Button Click Handler
    const handleBibTeXClick = async (button) => {
        if (!state.currentDOI) { showCopyFeedback(button, '无DOI', true); return; }

        const originalText = button.textContent;
        button.textContent = 'BibTeX';
        button.disabled = true;

        try {
            const bibtex = await fetchBibTeX(state.currentDOI);
            await copyToClipboard(bibtex, button, 'BibTeX已复制'); // copyToClipboard calls showCopyFeedback
        } catch (error) {
            console.error('Failed to fetch BibTeX:', error);
            showCopyFeedback(button, '获取失败', true); // This will restore button
        }
        // If button text is still "获取BibTeX...", restore it (e.g. if copyToClipboard failed silently before its own showCopyFeedback)
        if (button.textContent === 'BibTeX') {
            button.textContent = originalText;
            button.disabled = false;
        }
    };

    // UI Styling
    const createStyles = () => {
        GM_addStyle(`
            #doi-widget-container {
                position: fixed; bottom: 20px; right: 20px;
                background-color: #0C344E; border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 2147483647;
                display: none; overflow: hidden; text-align: center; color: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                min-width: 100px; /* Adjusted min-width for potentially longer text */
            }
            .widget-button {
                display: block; width: 100%; padding: 10px 15px;
                font-size: 14px; font-weight: 600; color: white;
                border: none; cursor: pointer; transition: all 0.2s ease;
                outline: none; border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .widget-button:last-of-type { border-bottom: none; } /* Applies to last button before copyright */
            #doi-widget-button { background-color: #118ab2; border-radius: 12px 12px 0 0; }
            #doi-widget-button:hover { background-color: #0f7ea1; transform: translateY(-1px); }
            #bibtex-widget-button { background-color: #06d6a0; border-radius: 0; }
            #bibtex-widget-button:hover { background-color: #05c290; transform: translateY(-1px); }
            #pdf-widget-button { background-color: #ff9f1c; border-radius: 0; } /* Orange for PDF */
            #pdf-widget-button:hover { background-color: #e68a00; transform: translateY(-1px); } /* Darker orange */
            .widget-button:active { transform: scale(0.98); }
            .widget-button:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
            .widget-button.copied-feedback { background-color: #28a745 !important; }
            .widget-button.error-feedback { background-color: #dc3545 !important; }
            #doi-widget-copyright {
                padding: 8px 12px; font-size: 11px; background-color: #0C344E;
                color: #a0d8ef; border-radius: 0 0 12px 12px;
            }
            @media (max-width: 768px) {
                #doi-widget-container { bottom: 15px; right: 15px; min-width: 90px; }
                .widget-button { padding: 10px 12px; font-size: 13px; }
            }
        `);
    };

    // UI Widget Creation
    const createWidget = () => {
        if (document.getElementById('doi-widget-container')) return;
        const container = document.createElement('div'); container.id = 'doi-widget-container';

        const doiButton = document.createElement('button');
        doiButton.id = 'doi-widget-button'; doiButton.className = 'widget-button';
        doiButton.textContent = 'DOI'; doiButton.title = '点击复制 DOI';
        doiButton.addEventListener('click', () => { if (state.currentDOI) copyToClipboard(state.currentDOI, doiButton, 'DOI已复制'); else showCopyFeedback(doiButton, '无DOI', true); });

        const bibtexButton = document.createElement('button');
        bibtexButton.id = 'bibtex-widget-button'; bibtexButton.className = 'widget-button';
        bibtexButton.textContent = 'BibTeX'; bibtexButton.title = '点击获取并复制 BibTeX';
        bibtexButton.addEventListener('click', () => handleBibTeXClick(bibtexButton));

        const pdfButton = document.createElement('button');
        pdfButton.id = 'pdf-widget-button'; pdfButton.className = 'widget-button';
        pdfButton.textContent = 'PDF'; pdfButton.title = '点击下载 PDF';
        pdfButton.addEventListener('click', () => enhancedDownloadPDF(pdfButton));

        const copyright = document.createElement('div');
        copyright.id = 'doi-widget-copyright'; copyright.textContent = `Yul © ${new Date().getFullYear()}`;

        container.appendChild(doiButton); container.appendChild(bibtexButton); container.appendChild(pdfButton);
        container.appendChild(copyright);
        document.body.appendChild(container);
        state.widget = container;
    };

    // Widget Visibility Control
    const showWidget = () => { if (state.widget) state.widget.style.display = 'block'; };
    const hideWidget = () => { if (state.widget) state.widget.style.display = 'none'; };

    // DOI Detection and Widget Activation
    const attemptExtractDOI = () => {
        state.retryCount++; const doi = extractDOI();
        if (doi) {
            clearInterval(state.timer); state.currentDOI = doi; console.log('DOI found:', doi);
            // Pre-fetch PDF URL in background if DOI is found
            findBestPDFUrl().then(pdfUrl => { if (pdfUrl) { state.currentPDFUrl = pdfUrl; state.pdfCache.set(window.location.href, pdfUrl); console.log('PDF URL pre-extracted:', pdfUrl);}});
            showWidget();
        } else if (state.retryCount >= CONFIG.MAX_RETRY) {
            clearInterval(state.timer); console.log('DOI not found after', CONFIG.MAX_RETRY, 'attempts');
            // Optionally show widget even if DOI not found, for PDF download attempts
            // For now, keeping original behavior: hide if no DOI. PDF button will rely on page scan.
            // To enable PDF button even without DOI, call showWidget() here or make it always visible.
            // For this modification, let's keep it tied to DOI presence for consistency with original style.
            // If you want PDF to always be available, remove hideWidget() or call showWidget()
             hideWidget(); // Original behavior
        }
    };
    const resetAndStart = utils.debounce(() => {
        console.log('DOI & BibTeX & PDF Plugin: Initializing/Resetting...');
        if (state.timer) clearInterval(state.timer);
        state.retryCount = 0; state.currentDOI = null; state.currentPDFUrl = null; // Reset PDF URL too
        // Do not hide widget immediately, attemptExtractDOI will manage visibility
        // hideWidget(); // This would hide it on SPA navigation before DOI is found
        state.timer = setInterval(attemptExtractDOI, CONFIG.RETRY_INTERVAL);
        attemptExtractDOI(); // Try once immediately
    }, 250); // Slightly shorter debounce for SPA

    // Navigation and Mutation Observer
    const setupNavigationListener = () => {
        const originalPushState = history.pushState; const originalReplaceState = history.replaceState;
        history.pushState = function(...args) { originalPushState.apply(this, args); resetAndStart(); };
        history.replaceState = function(...args) { originalReplaceState.apply(this, args); resetAndStart(); };
        window.addEventListener('popstate', resetAndStart);
        if (window.MutationObserver) {
            const observer = new MutationObserver(utils.debounce(() => {
                // Only reset if DOI is not found or URL changed significantly
                // This prevents excessive resets on minor DOM changes
                if (!state.currentDOI || state.lastObservedURL !== window.location.href) {
                    state.lastObservedURL = window.location.href;
                    resetAndStart();
                }
            }, 1000));
            observer.observe(document.body, { childList: true, subtree: true });
            state.lastObservedURL = window.location.href; // Initialize
        }
    };

    // Initialization
    const init = () => {
        createStyles();
        createWidget(); // Creates the widget but it's hidden by default CSS
        setupNavigationListener();
        resetAndStart(); // This will attempt to find DOI and show/hide widget
    };

    // Script Execution Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();