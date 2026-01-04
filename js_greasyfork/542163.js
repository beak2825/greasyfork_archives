// ==UserScript==
// @name         Amazon Book Metadata with author check & new title cap rules
// @namespace    Credit
// @version      1.0.9
// @license      MIT
// @description  Copies Amazon book metadata to JSON, with multiple AI-powered category selection options, checks title capitalization, and forbidden author check.
// @author       markie (based on the original script by SnowmanNurse)
// @match        https://www.amazon.com/*
// @match        https://www.amazon.in/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.com.au/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542163/Amazon%20Book%20Metadata%20with%20author%20check%20%20new%20title%20cap%20rules.user.js
// @updateURL https://update.greasyfork.org/scripts/542163/Amazon%20Book%20Metadata%20with%20author%20check%20%20new%20title%20cap%20rules.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
(function() {
    'use strict';

    const CATEGORY_SELECTION_METHOD = 3; // 1 for direct mapping, 2 for scoring method, 3 for AI-based selection
    const AI_MODEL = 5; // 0: None, 1: ChatGPT, 2: Meta Llama, 3: Google Gemini 128K, 4: Mistral AI, 5: Google Gemini 1M, 6: Anthropic Claude 3

    // API keys for different AI models (Replace with your actual API keys)
    const API_KEYS = {
        chatgpt: "your_chatgpt_api_key_here",
        meta: "your_meta_api_key_here",
        google: "your_google_api_key_here",
        mistral: "your_mistral_api_key_here",
        anthropic: "your_anthropic_api_key_here"
    };

    const FORBIDDEN_AUTHORS = [
        "j.r.r. tolkien", "anne perry", "simon scarrow", "sara gruen", "joan elliott",
        "alan dart", "chris mead", "paul moore & gavin jones", "noah k sturdevant",
        "benedict brown", "erika t wurth", "randolph lalonde"
    ];

    const AVAILABLE_CATEGORIES = [
        "Ebooks - Art", "Ebooks - Biographical", "Ebooks - Business", "Ebooks - Comics/Graphic novels","Ebooks - Computer/Internet",
        "Ebooks - Food", "Ebooks - Crafts", "Ebooks - Fantasy", "Ebooks - General Fiction",
        "Ebooks - Historical Fiction","Ebooks - Health", "Ebooks - History", "Ebooks - Home & Garden",
        "Ebooks - Horror", "Ebooks - Humor", "Ebooks - Juvenile", "Ebooks - Language",
        "Ebooks - Literature", "Ebooks - Mathematics", "Ebooks - Medical", "Ebooks - Mystery",
        "Ebooks - Nature", "Ebooks - Philosophy", "Ebooks - Pol/Soc/Relig", "Ebooks - Reference", "Ebooks - Religion",
        "Ebooks - Romance", "Ebooks - Math/Science/Tech", "Ebooks - Science Fiction", "Ebooks - Self-Help",
        "Ebooks - Social Science", "Ebooks - Sports", "Ebooks - Travel",
        "Ebooks - True Crime", "Ebooks - Young Adult"
    ];

    const AMAZON_TO_MAM_CATEGORY_MAP = {
        "Arts & Photography": "Ebooks - Art",
        "Biographies & Memoirs": "Ebooks - Biographical",
        "Business & Money": "Ebooks - Business",
        "Comics & Graphic Novels": "Ebooks - Comics/Graphic novels",
        "Computers & Technology": "Ebooks - Computer/Internet",
        "Cookbooks, Food & Wine": "Ebooks - Food",
        "Crafts, Hobbies & Home": "Ebooks - Crafts",
        "Science Fiction & Fantasy": "Ebooks - Fantasy",
        "Literature & Fiction": "Ebooks - General Fiction",
        "Historical Fiction": "Ebooks - Historical Fiction",
        "Health, Fitness & Dieting": "Ebooks - Health",
        "History": "Ebooks - History",
        "Horror": "Ebooks - Horror",
        "Humor & Entertainment": "Ebooks - Humor",
        "Children's Books": "Ebooks - Juvenile",
        "Medical Books": "Ebooks - Medical",
        "Medicine & Health Sciences": "Ebooks - Medical",
        "Politics & Social Sciences": "Ebooks - Pol/Soc/Relig",
        "Religion & Spirituality": "Ebooks - Pol/Soc/Relig",
        "Christian Books & Bibles": "Ebooks - Pol/Soc/Relig",
        "Parenting & Relationships": "Ebooks - Self-Help",
        "Reference": "Ebooks - Reference",
        "Romance": "Ebooks - Romance",
        "Science & Math": "Ebooks - Math/Science/Tech",
        "Engineering & Transportation": "Ebooks - Math/Science/Tech",
        "Self-Help": "Ebooks - Self-Help",
        "Sports & Outdoors": "Ebooks - Sports",
        "Teen & Young Adult": "Ebooks - Young Adult",
        "Travel": "Ebooks - Travel"
    };

    // SVG logo (minified)
    const svgLogo = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 59.16 69.57'><g transform='translate(-110.73,-61.49)'><path d='m 130.15,99.28 c 2.9,-1.3 4.93,-4.22 4.94,-7.6 0,-4.61 -3.74,-8.35 -8.35,-8.35 -4.61,0 -8.35,3.74 -8.35,8.35 0,4.6 3.74,8.34 8.35,8.34 0.72,0 1.41,-0.1 2.08,-0.27 0.41,-0.18 0.85,-0.33 1.32,-0.46 z m -7.55,-6.13 c 0,-2.3 1.87,-4.17 4.18,-4.17 0.58,0 1.15,0.12 1.65,0.34 -0.11,0.31 -0.18,0.65 -0.18,1.0 0,1.53 1.19,2.79 2.7,2.91 -0.04,2.26 -1.89,4.09 -4.17,4.09 -2.3,0 -4.18,-1.87 -4.18,-4.17' style='fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.03'/><path d='m 146.01,83.31 c -4.61,0 -8.35,3.74 -8.35,8.35 0,3.35 1.97,6.23 4.82,7.56 0.55,0.14 1.08,0.32 1.56,0.54 0.63,0.15 1.28,0.24 1.96,0.24 4.6,0 8.34,-3.74 8.35,-8.35 0,-4.61 -3.74,-8.35 -8.35,-8.35 z m 0.04,14.01 c -2.3,0 -4.17,-1.87 -4.17,-4.17 0,-2.3 1.87,-4.17 4.17,-4.17 0.51,0 1.01,0.09 1.46,0.26 -0.13,0.33 -0.21,0.7 -0.21,1.08 0,1.61 1.3,2.92 2.92,2.92 -0.05,2.26 -1.9,4.08 -4.17,4.08' style='fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.03'/></g></svg>`;

    // MLA title capitalization constants (combined into Set for O(1) lookup)
    const MLA_LOWERCASE_WORDS = new Set([
        'a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'so', 'yet',
        'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'around', 'as', 'at', 'atop',
        'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'by',
        'concerning', 'despite', 'down', 'during', 'except', 'from',
        'in', 'inside', 'into', 'like', 'near', 'of', 'off', 'on', 'onto', 'out', 'outside', 'over',
        'past', 'per', 'regarding', 'round', 'since', 'through', 'throughout', 'till', 'to', 'toward',
        'under', 'underneath', 'unlike', 'until', 'unto', 'up', 'upon',
        'versus', 'via', 'with', 'within', 'without'
    ]);

    // Utility functions
    const capitalizeWord = word => word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : "";
    const cleanText = text => text.replace(/‎/g, '').replace(/\s+/g, ' ').replace(/›.*$/g, '').replace(/‹.*$/g, '').replace(/Back to results.*$/i, '').trim();
    const $ = sel => document.querySelector(sel);
    const $$ = sel => document.querySelectorAll(sel);

    function formatTitleCaseMLA(titleStr) {
        if (!titleStr || typeof titleStr !== 'string') return "";

        return titleStr.split(/(\s*:\s*)/).map((part, i) => {
            if (i % 2 === 1) return part; // delimiter part

            const words = part.split(' ').filter(w => w.length > 0);
            if (!words.length) return part;

            return words.map((word, j) => {
                const lowerWord = word.toLowerCase();
                const isFirst = j === 0;
                const isLast = j === words.length - 1;

                if (word.includes('-')) {
                    return word.split('-').map((segment, sIdx) => {
                        if (!segment) return "";
                        const lowerSegment = segment.toLowerCase();
                        if (sIdx === 0 || (isLast && sIdx === word.split('-').length - 1) || !MLA_LOWERCASE_WORDS.has(lowerSegment)) {
                            return capitalizeWord(segment);
                        }
                        return lowerSegment;
                    }).join('-');
                } else {
                    if (isFirst || isLast || !MLA_LOWERCASE_WORDS.has(lowerWord)) {
                        return capitalizeWord(lowerWord);
                    }
                    return lowerWord;
                }
            }).join(' ');
        }).join('');
    }

    function cleanName(name) {
        const titles = /(?:^|\s)(?:PhD|MD|JD|MBA|MA|MS|MSc|MFA|MEd|ScD|DrPH|MPH|LLM|DDS|DVM|EdD|PsyD|ThD|DO|PharmD|DSc|DBA|RN|CPA|Esq\.|LCSW|PE|AIA|FAIA|CSP|CFP|Jr\.|Sr\.|Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.|Rev\.|Fr\.|Capt\.|Col\.|Gen\.|Lt\.|Cmdr\.|Adm\.|Sir|Dame|Hon\.|Amb\.|Gov\.|Sen\.|Rep\.|BSN|MSN|CNE|CNEcl|ANEF|FAADN|COI|DNP|[IVX]+)(?:\s|$)/gi;
        return name.trim().replace(titles, ' ').replace(/,\s*([A-Z]+\s*)+$/, '').replace(/\s+/g, ' ').trim();
    }

    function showOverlay() {
        if ($('#mam-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'mam-overlay';
        overlay.style.cssText = 'display:block;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);backdrop-filter:blur(5px);z-index:9999;';
        overlay.innerHTML = `
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:5px;text-align:center;">
                <p style="font-size:18px;margin:0;">Processing JSON data...</p>
                <p style="font-size:16px;margin:10px 0 0;">Please wait...</p>
                ${CATEGORY_SELECTION_METHOD === 3 && AI_MODEL !== 0 ? '<div style="margin-top:20px;"><img src="https://c.tenor.com/JDV9WN1QC3kAAAAC/tenor.gif" alt="AI Processing" style="max-width:200px;"></div>' : ''}
            </div>`;
        document.body.appendChild(overlay);
    }

    const hideOverlay = () => $('#mam-overlay')?.remove();

    function getAuthors() {
        console.log("Amazon Book Metadata: [V3 DEBUG] Attempting to get authors for URL:", window.location.href);
        const authors = [];
        let foundAuthors = false;

        // Strategy 1: #bylineInfo
        console.log("[V3 DEBUG] --- Strategy 1: #bylineInfo ---");
        const bylineInfo = $('#bylineInfo');
        if (bylineInfo) {
            console.log("[V3 DEBUG] Strategy 1: Found #bylineInfo element. InnerHTML snippet (first 300 chars):", bylineInfo.innerHTML.substring(0, 300) + "...");

            $$('#bylineInfo span.author').forEach((authorSpan, i) => {
                console.log(`[V3 DEBUG] Strategy 1, span.author[${i}] OuterHTML:`, authorSpan.outerHTML.substring(0,200) + "...");
                const link = authorSpan.querySelector('a');

                if (link) {
                    console.log(`[V3 DEBUG] Strategy 1, span.author[${i}]: Found linkElement:`, link.outerHTML.substring(0,150)+"...");
                    let authorName = link.textContent.trim().replace(/\s*\(Author\)$/i, '');
                    console.log(`[V3 DEBUG] Strategy 1, Link in span.author[${i}]: Raw text = '${authorName}'`);

                    const contribution = authorSpan.querySelector('span.contribution');
                    const isConfirmedAuthor = 
                        (contribution && contribution.textContent.toLowerCase().includes('(author)')) ||
                        (!contribution && authorSpan.textContent.toLowerCase().includes(authorName.toLowerCase() + " (author)")) ||
                        (!contribution && link.href && (link.href.includes('/e/') || link.href.includes('field-author')));

                    if (isConfirmedAuthor) {
                        const cleanedName = cleanName(authorName);
                        if (cleanedName && !authors.includes(cleanedName)) {
                            authors.push(cleanedName);
                            console.log(`[V3 DEBUG] Strategy 1: Added author: '${cleanedName}'`);
                            foundAuthors = true;
                        }
                    }
                }
            });
        }

        // Strategy 2: #booksAuthorsInsidePitch-contributorArea
        if (!foundAuthors) {
            console.log("[V3 DEBUG] --- Strategy 2: #booksAuthorsInsidePitch-contributorArea ---");
            const contributorArea = $('#booksAuthorsInsidePitch-contributorArea');
            if (contributorArea) {
                $$('#booksAuthorsInsidePitch-contributorArea span.author a').forEach((link, i) => {
                    let authorName = link.textContent.trim().replace(/\s*\(Author\)$/i, '');
                    const parentSpan = link.closest('span.author');
                    if (parentSpan) {
                        const contribution = parentSpan.querySelector('span.contribution');
                        const isConfirmedAuthor = 
                            (contribution && contribution.textContent.toLowerCase().includes('(author)')) ||
                            (!contribution && parentSpan.textContent.toLowerCase().includes(authorName.toLowerCase() + " (author)")) ||
                            (!contribution && link.href && (link.href.includes('/e/') || link.href.includes('field-author')));

                        if (isConfirmedAuthor) {
                            const cleanedName = cleanName(authorName);
                            if (cleanedName && !authors.includes(cleanedName)) {
                                authors.push(cleanedName);
                                foundAuthors = true;
                            }
                        }
                    }
                });
            }
        }

        // Strategy 3: Fallback 'by Author Name' pattern
        if (!foundAuthors) {
            console.log("[V3 DEBUG] --- Strategy 3: Fallback looking for 'by Author Name' pattern ---");
            const container = $('#bylineInfo_feature_div') || $('#bylineInfo');
            if (container) {
                const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
                let node;

                while (node = walker.nextNode()) {
                    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().toLowerCase() === "by") {
                        const nextElement = node.nextElementSibling;
                        if (nextElement) {
                            const authorLink = nextElement.tagName === 'A' && (nextElement.href.includes('/e/') || nextElement.href.includes('field-author'))
                                ? nextElement
                                : nextElement.querySelector('a[href*="/e/"], a[href*="field-author"]');

                            if (authorLink) {
                                const authorName = authorLink.textContent.trim().replace(/\s*\(Author\)$/i, '');
                                const cleanedName = cleanName(authorName);
                                if (cleanedName && !authors.includes(cleanedName)) {
                                    authors.push(cleanedName);
                                    foundAuthors = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (!authors.length) {
            console.warn("Amazon Book Metadata: [V3 DEBUG] CRITICAL - FAILED TO EXTRACT AUTHORS");
        } else {
            console.log("Amazon Book Metadata: [V3 DEBUG] Final authors found:", authors);
        }
        return authors;
    }

    // Optimized getter functions with cached selectors and combined logic
    const getTitle = () => {
        const titleEl = $('#productTitle');
        return titleEl ? formatTitleCaseMLA(titleEl.textContent.trim()) : "";
    };

    const getDescription = () => {
        const descEl = $('#bookDescription_feature_div .a-expander-content');
        return descEl ? descEl.innerHTML.trim() : "No description available";
    };

    const getThumbnail = () => {
        const thumbEl = $('#imgBlkFront') || $('#ebooksImgBlkFront') || $('#imgTagWrapperId img');
        if (!thumbEl) return "";

        const dynamicImage = thumbEl.getAttribute("data-a-dynamic-image");
        if (dynamicImage) {
            try {
                return Object.keys(JSON.parse(dynamicImage))[0];
            } catch (e) {
                console.error('Error parsing dynamic image data:', e);
            }
        }
        return thumbEl.getAttribute("data-old-hires") || thumbEl.src || "";
    };

    const getLanguage = () => {
        const langEl = $('#rpi-attribute-language .rpi-attribute-value span');
        return langEl ? langEl.textContent.trim() : "Unknown";
    };

    const getSeriesInfo = () => {
        const seriesEl = $('#seriesBulletWidget_feature_div');
        if (!seriesEl) return [];

        const seriesLink = seriesEl.querySelector("a");
        if (!seriesLink) return [];

        const fullSeriesText = seriesLink.textContent.trim();
        const parts = fullSeriesText.split(':');

        // If the text starts with a "Book X:" pattern, extract the part after the first colon as the series name.
        // This prevents incorrect splitting for series names that legitimately contain a colon (e.g., "Topic: A History").
        const seriesName = (parts.length > 1 && parts[0].toLowerCase().includes('book'))
            ? parts.slice(1).join(':').trim()
            : fullSeriesText;

        const bookNumberMatch = seriesEl.textContent.match(/Book\s*?(\d+\.?\d*-?\d*\.?\d*)/);
        return [{ name: seriesName, number: bookNumberMatch ? bookNumberMatch[1] : "" }];
    };


    const getEdition = () => {
        const details = $('#detailBullets_feature_div');
        if (!details) return "";

        for (const item of details.querySelectorAll('li')) {
            if (item.textContent.includes('Publisher')) {
                const editionMatch = item.textContent.match(/;\s*(\d+(?:st|nd|rd|th)\s+edition)/i);
                if (editionMatch) return cleanText(editionMatch[1]);
            }
        }
        return "";
    };

    const getPageCount = () => {
        const details = $('#detailBullets_feature_div');
        if (details) {
            for (const item of details.querySelectorAll('li')) {
                if (item.textContent.includes('pages')) {
                    const pageMatch = item.textContent.match(/(\d+)\s*pages/);
                    if (pageMatch) return pageMatch[1];
                }
            }
        }

        const printLengthEl = $('#rpi-attribute-book_details-fiona_pages .rpi-attribute-value span');
        if (printLengthEl) {
            const pageMatch = printLengthEl.textContent.match(/(\d+)/);
            if (pageMatch) return pageMatch[1];
        }
        return "Unknown";
    };

    const getPublicationDate = () => {
        // Strategy 1: #productSubtitle
        const productSubtitle = $('#productSubtitle');
        if (productSubtitle) {
            const dateMatch = productSubtitle.textContent.match(/–\s*([A-Za-z]+\s+\d{1,2},\s+\d{4}|\d{1,2}\s+[A-Za-z]+\s+\d{4}|[A-Za-z]+\s+\d{4})/);
            if (dateMatch?.[1]) {
                const dateStr = cleanText(dateMatch[1]);
                if (dateStr && /\d{4}/.test(dateStr)) return dateStr;
            }
        }

        // Strategy 2: RPI attribute
        const rpiDate = $('#rpi-attribute-book_details-publication_date .rpi-attribute-value span');
        if (rpiDate?.textContent.trim()) {
            const dateStr = cleanText(rpiDate.textContent.trim());
            if (dateStr && /\d{4}/.test(dateStr)) return dateStr;
        }

        // Strategy 3: Detail bullets
        const details = $('#detailBullets_feature_div');
        if (details) {
            for (const item of details.querySelectorAll('li')) {
                const text = item.textContent;
                let dateMatch = text.match(/(?:Publication date|Date)\s*[:\s]*\s*([A-Za-z]+\s+\d{1,2},\s+\d{4}|\d{1,2}\s+[A-Za-z]+\s+\d{4}|[A-Za-z]+\s+\d{4})/i);
                if (!dateMatch) {
                    const publisherMatch = text.match(/Publisher\s*[:\s]*.*?\(([^()]*\d{4}[^()]*)\)/i);
                    if (publisherMatch?.[1] && (/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i.test(publisherMatch[1]) || publisherMatch[1].length > 5)) {
                        dateMatch = [null, publisherMatch[1]];
                    }
                }

                if (dateMatch?.[1]) {
                    const dateStr = cleanText(dateMatch[1]);
                    if (dateStr && /\d{4}/.test(dateStr)) return dateStr;
                }
            }
        }

        // Strategy 4: Generic search
        for (const label of $$('span, div, dt, th, p')) {
            if (label.textContent.toLowerCase().includes("publication date")) {
                const valueEl = label.nextElementSibling || 
                              label.parentElement?.nextElementSibling || 
                              (label.tagName === 'DT' && label.nextElementSibling?.tagName === 'DD' ? label.nextElementSibling : null) ||
                              (label.textContent.length > "publication date".length + 3 ? label : null);

                if (valueEl) {
                    const dateMatch = valueEl.textContent.match(/\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},\s+\d{4}\b|\b\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}\b|\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}\b/i);
                    if (dateMatch?.[0]) {
                        const dateStr = cleanText(dateMatch[0]);
                        if (dateStr && /\d{4}/.test(dateStr)) return dateStr;
                    }
                }
            }
        }
        return "";
    };

    const getPublisher = () => {
        const details = $('#detailBullets_feature_div');
        if (details) {
            for (const item of details.querySelectorAll('li')) {
                if (item.textContent.includes('Publisher')) {
                    const publisherText = item.textContent.split(':')[1];
                    if (publisherText) {
                        return cleanText(publisherText.split('(')[0]).replace(/;\s*\d+(?:st|nd|rd|th)\s+edition/i, '');
                    }
                }
            }
        }

        const publisherEl = $('#rpi-attribute-book_details-publisher .rpi-attribute-value span');
        return publisherEl ?
            cleanText(publisherEl.textContent).replace(/;\s*\d+(?:st|nd|rd|th)\s+edition/i, '') :
            "Unknown Publisher";
    };

    const getAmazonCategory = () => {
        const categoryEl = $('#wayfinding-breadcrumbs_feature_div');
        if (!categoryEl) return "";

        const categories = categoryEl.textContent.trim().split("›");
        const lastCategory = categories[categories.length - 1];
        if (lastCategory && !lastCategory.toLowerCase().includes('back to')) {
            return cleanText(lastCategory);
        }
        return categories.length > 1 ? cleanText(categories[categories.length - 2]) : "";
    };

    const getISBN = () => {
        const clean = str => (str || "").trim().replace(/^\D+/, '');
        let isbn10 = clean($('#rpi-attribute-book_details-isbn10 .rpi-attribute-value span')?.textContent);
        let isbn13 = clean($('#rpi-attribute-book_details-isbn13 .rpi-attribute-value span')?.textContent);

        if (!isbn10 || !isbn13) {
            const details = $('#detailBullets_feature_div');
            if (details) {
                for (const item of details.querySelectorAll('li')) {
                    const text = item.textContent || "";
                    if (!isbn10 && text.includes('ISBN-10')) {
                        const potential = text.split(':')[1];
                        if (potential) isbn10 = clean(potential);
                    } else if (!isbn13 && text.includes('ISBN-13')) {
                        const potential = text.split(':')[1];
                        if (potential) isbn13 = clean(potential);
                    }
                }
            }
        }
        return { isbn10, isbn13 };
    };

    const getASIN = () => {
        const asinEl = $('#detailsRichBullets_feature_div');
        if (!asinEl) return "";
        const match = asinEl.textContent.match(/ASIN\s*:\s*([\w\d]+)/);
        return match ? match[1] : "";
    };

    const getTags = () => {
        const tags = [];
        const edition = getEdition();
        const pageCount = getPageCount();
        const publicationDate = getPublicationDate();
        const publisher = getPublisher();
        const amazonCategory = getAmazonCategory();

        if (edition) tags.push(edition);
        if (pageCount !== "Unknown") tags.push(`Pages: ${pageCount}`);
        if (publicationDate) tags.push(`Published: ${publicationDate}`);
        if (publisher !== "Unknown Publisher") tags.push(`Publisher: ${publisher}`);
        if (amazonCategory) tags.push(cleanText(amazonCategory));

        return tags.filter(tag => tag?.trim()).join(" | ");
    };

    // AI API functions (optimized with early returns and error handling)
    const createAPICall = async (url, options, parser) => {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`API error: ${response.statusText}`);
            const data = await response.json();
            return parser(data);
        } catch (error) {
            console.error("API call failed:", error);
            return null;
        }
    };

    const getCategoryFromAI = {
        1: async (prompt) => { // ChatGPT
            if (!API_KEYS.chatgpt || API_KEYS.chatgpt === "your_chatgpt_api_key_here") return null;
            return createAPICall("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEYS.chatgpt}` },
                body: JSON.stringify({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: 50 })
            }, data => data.choices[0].message.content.trim());
        },

        2: async (prompt) => { // Meta Llama
            if (!API_KEYS.meta || API_KEYS.meta === "your_meta_api_key_here") return null;
            return createAPICall("https://api.meta.com/v1/text/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEYS.meta}` },
                body: JSON.stringify({ model: "llama-2-13b-chat", prompt: prompt, max_tokens: 50 })
            }, data => data.choices[0].text.trim());
        },

        3: async (prompt) => { // Google Gemini 128K
            return getCategoryFromAI[5](prompt); // Use same implementation as Gemini 1M
        },

        4: async (prompt) => { // Mistral AI
            if (!API_KEYS.mistral || API_KEYS.mistral === "your_mistral_api_key_here") return null;
            return createAPICall("https://api.mistral.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEYS.mistral}` },
                body: JSON.stringify({ model: "mistral-large-latest", messages: [{ role: "user", content: prompt }], max_tokens: 50 })
            }, data => data.choices[0].message.content.trim());
        },

        5: async (prompt) => { // Google Gemini 1M
            if (!API_KEYS.google || (API_KEYS.google.startsWith("AIzaSy") && API_KEYS.google.length === 39 && API_KEYS.google.includes("your_"))) return null;
            return createAPICall(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEYS.google}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            }, data => {
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return data.candidates[0].content.parts[0].text.trim();
                }
                console.error("Unexpected response structure from Google Gemini:", data);
                return null;
            });
        },

        6: async (prompt) => { // Anthropic Claude
            if (!API_KEYS.anthropic || API_KEYS.anthropic === "your_anthropic_api_key_here") return null;
            return createAPICall("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEYS.anthropic, "anthropic-version": "2023-06-01" },
                body: JSON.stringify({ model: "claude-3-haiku-20240307", max_tokens: 50, messages: [{ role: "user", content: prompt }] })
            }, data => data.content[0].text.trim());
        }
    };

const getMAMCategory = async (title, description, amazonCategory) => {
        switch (CATEGORY_SELECTION_METHOD) {
            case 1:
                return AMAZON_TO_MAM_CATEGORY_MAP[amazonCategory] || "";
            case 2:
                console.warn("Scoring method not implemented. Falling back to direct mapping or AI.");
                return AMAZON_TO_MAM_CATEGORY_MAP[amazonCategory] || "";
            case 3: {
                if (AI_MODEL === 0 || !getCategoryFromAI[AI_MODEL]) {
                    return AMAZON_TO_MAM_CATEGORY_MAP[amazonCategory] || "";
                }
                const prompt = `Given the following book information, select the most appropriate category from this list: ${AVAILABLE_CATEGORIES.join(", ")}

Title: ${title}
Description: ${description}
Amazon Category: ${amazonCategory}

Please respond with only the category name, nothing else.`;
                return await getCategoryFromAI[AI_MODEL](prompt);
            }
            default:
                return "";
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Copied to clipboard successfully!');
            window.open("https://www.myanonamouse.net/tor/upload.php", "_blank");
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy metadata to clipboard. See console for details.');
        } finally {
            hideOverlay();
        }
    };

    const generateJson = async () => {
        try {
            const authors = getAuthors();

            // Check for forbidden authors (optimized with single loop)
            for (const author of authors) {
                if (FORBIDDEN_AUTHORS.includes(author.toLowerCase())) {
                    const originalAuthor = FORBIDDEN_AUTHORS.find(fa => fa === author.toLowerCase());
                    alert(`This book is by a forbidden author: ${originalAuthor}.\nMetadata will not be copied.`);
                    hideOverlay();
                    return;
                }
            }

            const title = getTitle();
            const description = getDescription();
            const amazonCategory = getAmazonCategory();
            let mamCategory = await getMAMCategory(title, description, amazonCategory);

            // Fallback to direct mapping if AI fails
            if (!mamCategory && (CATEGORY_SELECTION_METHOD === 3 || AI_MODEL === 0)) {
                mamCategory = AMAZON_TO_MAM_CATEGORY_MAP[amazonCategory] || "";
                if (mamCategory) console.log("Fell back to direct mapping for category.");
            }
            if (!mamCategory) {
                console.warn("Could not determine MAM category. Leaving it blank.");
                mamCategory = "";
            }

            const { isbn10, isbn13 } = getISBN();
            let finalDescription = description;

            if (isbn10 || isbn13) {
                finalDescription += '<br><br>';
                if (isbn13) finalDescription += `ISBN-13: ${isbn13}<br>`;
                if (isbn10) finalDescription += `ISBN-10: ${isbn10}`;
            }

            const json = {
                "authors": authors,
                "description": finalDescription,
                "tags": getTags(),
                "thumbnail": getThumbnail(),
                "title": title,
                "language": getLanguage(),
                "series": getSeriesInfo(),
                "category": mamCategory,
                "isbn": isbn13 || isbn10 || getASIN() || ''
            };

            await copyToClipboard(JSON.stringify(json, null, 2));
        } catch (error) {
            console.error('Error generating JSON:', error);
            alert('Error generating JSON. See console for details.');
            hideOverlay();
        }
    };

    const addButtonAndLogo = () => {
        const isAISelected = CATEGORY_SELECTION_METHOD === 3 && AI_MODEL !== 0;
        const buttonText = isAISelected ? "Copy Book info to JSON with AI" : "Copy Book info to JSON";

        const container = document.createElement("div");
        container.id = "metadataButtonContainer";
        container.style.cssText = "position:fixed;bottom:10px;right:10px;z-index:9999;display:flex;align-items:center;";
        container.innerHTML = `
            <div style="width:30px;height:30px;margin-right:10px;">${svgLogo}</div>
            <button id="copyMetadataButton" style="padding:10px;background-color:#008CBA;color:white;border:none;border-radius:5px;font-size:14px;cursor:pointer;">
                ${buttonText}
            </button>`;

        document.body.appendChild(container);

        $('#copyMetadataButton').addEventListener("click", async (event) => {
            event.preventDefault();
            showOverlay();
            await generateJson();
        });
    };

    const main = () => {
        if ($('#productTitle')) {
            console.log("Amazon Book Metadata script is running on a book page.");
            addButtonAndLogo();
        } else {
            console.log("Not a book page. Amazon Book Metadata script will not run.");
        }
    };

    // Initialize script
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(main, 1000);
    } else {
        window.addEventListener("DOMContentLoaded", () => setTimeout(main, 1000));
    }
})();