// ==UserScript==
// @name         Audible to MAM JSON Converter (Full API Version)
// @namespace    https://greasyfork.org/en/scripts/511491
// @version      2.1.5
// @license      MIT
// @description  Complete API-based solution with full metadata cleaning, category mapping, and MAM search
// @author       SnowmanNurse (Special thanks to Dr.Blank, DeepSpaceDark, BareMetal, and Audnexus for their contributions)
// @include      https://www.audible.*/pd/*
// @include      https://www.audible.*/ac/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      api.audnex.us
// @downloadURL https://update.greasyfork.org/scripts/511491/Audible%20to%20MAM%20JSON%20Converter%20%28Full%20API%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511491/Audible%20to%20MAM%20JSON%20Converter%20%28Full%20API%20Version%29.meta.js
// ==/UserScript==

// Configuration Constants
const RIPPER = "MusicFab";
const CHAPTERIZED = true;
const CATEGORY_SELECTION_METHOD = 2;
const CHATGPT_API_KEY = "your-api-key-here";
const ENABLE_SEARCH_BUTTONS = true;
const MAM_AUDIOBOOK_CATEGORIES = [
    39, 49, 50, 83, 51, 97, 40, 41, 106, 42, 52, 98, 54, 55, 43, 99, 84, 44,
    56, 45, 57, 85, 87, 119, 88, 58, 59, 46, 47, 53, 89, 100, 108, 48, 111, 0
];

const AVAILABLE_CATEGORIES = [
    "Audiobooks - Art", "Audiobooks - Biographical", "Audiobooks - Business", "Audiobooks - Crafts",
    "Audiobooks - Fantasy", "Audiobooks - Food", "Audiobooks - History", "Audiobooks - Horror",
    "Audiobooks - Humor", "Audiobooks - Instructional", "Audiobooks - Juvenile", "Audiobooks - Language",
    "Audiobooks - Medical", "Audiobooks - Mystery", "Audiobooks - Nature", "Audiobooks - Philosophy",
    "Audiobooks - Recreation", "Audiobooks - Romance", "Audiobooks - Self-Help", "Audiobooks - Western",
    "Audiobooks - Young Adult", "Audiobooks - Historical Fiction", "Audiobooks - Literary Classics",
    "Audiobooks - Science Fiction", "Audiobooks - True Crime", "Audiobooks - Urban Fantasy",
    "Audiobooks - Action/Adventure", "Audiobooks - Computer/Internet", "Audiobooks - Crime/Thriller",
    "Audiobooks - Home/Garden", "Audiobooks - Math/Science/Tech", "Audiobooks - Travel/Adventure",
    "Audiobooks - Pol/Soc/Relig", "Audiobooks - General Fiction", "Audiobooks - General Non-Fic"
];

const AUDIBLE_TO_MAM_CATEGORY_MAP = {
    "Arts & Entertainment": "Audiobooks - Art",
    "Biographies & Memoirs": "Audiobooks - Biographical",
    "Business & Careers": "Audiobooks - Business",
    "Children's Audiobooks": "Audiobooks - Juvenile",
    "Comedy & Humor": "Audiobooks - Humor",
    "Computers & Technology": "Audiobooks - Computer/Internet",
    "Education & Learning": "Audiobooks - Instructional",
    "Erotica": "Audiobooks - Romance",
    "Health & Wellness": "Audiobooks - Medical",
    "History": "Audiobooks - History",
    "Home & Garden": "Audiobooks - Home/Garden",
    "LGBTQ+": "Audiobooks - General Fiction",
    "Literature & Fiction": "Audiobooks - General Fiction",
    "Money & Finance": "Audiobooks - Business",
    "Mystery, Thriller & Suspense": "Audiobooks - Mystery",
    "Politics & Social Sciences": "Audiobooks - Pol/Soc/Relig",
    "Relationships, Parenting & Personal Development": "Audiobooks - Self-Help",
    "Religion & Spirituality": "Audiobooks - Pol/Soc/Relig",
    "Romance": "Audiobooks - Romance",
    "Science & Engineering": "Audiobooks - Math/Science/Tech",
    "Science Fiction & Fantasy": "Audiobooks - Science Fiction",
    "Sports & Outdoors": "Audiobooks - Recreation",
    "Teen & Young Adult": "Audiobooks - Young Adult",
    "Travel & Tourism": "Audiobooks - Travel/Adventure"
};

const KEYWORD_TO_MAM_CATEGORY_MAP = {
    "science fiction": "Audiobooks - Science Fiction",
    "sci-fi": "Audiobooks - Science Fiction",
    "fantasy": "Audiobooks - Fantasy",
    "magic": "Audiobooks - Fantasy",
    "mystery": "Audiobooks - Mystery",
    "detective": "Audiobooks - Mystery",
    "crime": "Audiobooks - Crime/Thriller",
    "thriller": "Audiobooks - Crime/Thriller",
    "suspense": "Audiobooks - Crime/Thriller",
    "horror": "Audiobooks - Horror",
    "romance": "Audiobooks - Romance",
    "love story": "Audiobooks - Romance",
    "historical": "Audiobooks - Historical Fiction",
    "history": "Audiobooks - History",
    "biography": "Audiobooks - Biographical",
    "memoir": "Audiobooks - Biographical",
    "business": "Audiobooks - Business",
    "finance": "Audiobooks - Business",
    "self-help": "Audiobooks - Self-Help",
    "personal development": "Audiobooks - Self-Help",
    "science": "Audiobooks - Math/Science/Tech",
    "technology": "Audiobooks - Math/Science/Tech",
    "computer": "Audiobooks - Computer/Internet",
    "programming": "Audiobooks - Computer/Internet",
    "travel": "Audiobooks - Travel/Adventure",
    "adventure": "Audiobooks - Travel/Adventure",
    "cooking": "Audiobooks - Food",
    "recipe": "Audiobooks - Food",
    "health": "Audiobooks - Medical",
    "wellness": "Audiobooks - Medical",
    "fitness": "Audiobooks - Medical",
    "sports": "Audiobooks - Recreation",
    "outdoor": "Audiobooks - Recreation",
    "philosophy": "Audiobooks - Philosophy",
    "religion": "Audiobooks - Pol/Soc/Relig",
    "spirituality": "Audiobooks - Pol/Soc/Relig",
    "politics": "Audiobooks - Pol/Soc/Relig",
    "social science": "Audiobooks - Pol/Soc/Relig"
};

function isAllCaps(str) {
    return str === str.toUpperCase() && /[A-Z]/.test(str);
}

function toTitleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// Cached data variables
let cachedApiData = null;
let currentASIN = null;

(function() {
    'use strict';

    window.addEventListener('load', () => {
        currentASIN = extractASIN();
        if (currentASIN) {
            createFloatingButton();
            addKeyframeAnimations();
        }
    });

    function createFloatingButton() {
        const container = document.createElement('div');
        container.id = 'mam-button-container';
        Object.assign(container.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        });

        // JSON Copy Button (always visible)
        const jsonBtnText = CATEGORY_SELECTION_METHOD === 3
            ? '📚 Copy MAM JSON with AI'
            : '📚 Copy MAM JSON';
        const jsonBtn = createButton(jsonBtnText, 'mam-json-btn', handleButtonClick);
        container.appendChild(jsonBtn);

        // Conditionally add search buttons
        if (ENABLE_SEARCH_BUTTONS) {
            const searchTitleBtn = createButton('🔍 Search MAM (Title)', 'mam-search-title-btn', () => handleSearchClick(false));
            const searchAuthorBtn = createButton('🔍 Search MAM (Title+Author)', 'mam-search-author-btn', () => handleSearchClick(true));
            container.appendChild(searchTitleBtn);
            container.appendChild(searchAuthorBtn);
        }

        document.body.appendChild(container);
    }

    function createButton(text, id, onClickHandler) {
        const btn = document.createElement('button');
        btn.id = id;
        btn.textContent = text;
        Object.assign(btn.style, {
            padding: '12px 18px',
            backgroundColor: '#FF9900',
            color: '#1a1a1a',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.05)';
            btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        });

        btn.addEventListener('click', onClickHandler);
        return btn;
    }

    async function handleSearchClick(includeAuthor) {
        const btnId = includeAuthor ? 'mam-search-author-btn' : 'mam-search-title-btn';
        const btn = document.getElementById(btnId);
        const originalText = btn.textContent;

        try {
            btn.textContent = '🔍 Searching...';
            btn.style.backgroundColor = '#ff8000';

            const apiData = await fetchAndCacheData(currentASIN);
            const editionData = extractEditionInfo(apiData.title);
            const authors = cleanNames(apiData.authors?.map(a => a.name) || []);
            const title = encodeURIComponent(editionData.title.trim());
            const author = authors.length > 0 ? encodeURIComponent(authors[0].trim()) : '';

            let query = title;
            if (includeAuthor && author) query += `%20${author}`;

            // Build category parameters
            const categoryParams = MAM_AUDIOBOOK_CATEGORIES
                .map(cat => `tor%5Bcat%5D%5B%5D=${cat}`)
                .join('&');

            const searchURL = `https://www.myanonamouse.net/tor/browse.php?` +
                `tor%5Btext%5D=${query}&` +
                `tor%5BsrchIn%5D%5Btitle%5D=true&` +
                `tor%5BsrchIn%5D%5Bdescription%5D=true&` +
                `tor%5BsrchIn%5D%5Btags%5D=true&` +
                `tor%5BsrchIn%5D%5Bauthor%5D=true&` +
                `tor%5BsrchIn%5D%5Bnarrator%5D=true&` +
                `tor%5BsrchIn%5D%5Bseries%5D=true&` +
                `tor%5BsearchType%5D=all&` +
                `tor%5BsearchIn%5D=torrents&` +
                `${categoryParams}&` +
                `tor%5BbrowseFlagsHideVsShow%5D=0&` +
                `tor%5BminSize%5D=0&` +
                `tor%5BmaxSize%5D=0&` +
                `tor%5Bunit%5D=1&` +
                `tor%5BminSeeders%5D=0&` +
                `tor%5BmaxSeeders%5D=0&` +
                `tor%5BminLeechers%5D=0&` +
                `tor%5BmaxLeechers%5D=0&` +
                `tor%5BminSnatched%5D=0&` +
                `tor%5BmaxSnatched%5D=0&` +
                `tor%5BsortType%5D=created&` +
                `tor%5BstartNumber%5D=0`;

            GM_openInTab(searchURL, { active: true });
            showTempAlert('🌐 Searching MAM audiobooks...', '#2196F3');
        } catch (error) {
            showTempAlert(`❌ Error: ${error.message}`, '#f44336');
            console.error('Search Error:', error);
        } finally {
            btn.textContent = originalText;
            btn.style.backgroundColor = '#FF9900';
        }
    }

    async function fetchAndCacheData(asin) {
        if (!cachedApiData) {
            cachedApiData = await fetchBookData(asin);
        }
        return cachedApiData;
    }

    async function handleButtonClick() {
        const btn = document.getElementById('mam-json-btn');
        const originalText = btn.textContent;

        try {
            btn.textContent = '🔄 Processing...';
            btn.style.backgroundColor = '#ff8000';

            const apiData = await fetchAndCacheData(currentASIN);
            const jsonData = await processApiData(apiData);

try {
    await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
} catch (error) {

    // maybe show a dialogue to user
    console.error(error.message);

}
            GM_openInTab('https://www.myanonamouse.net/tor/upload.php', { active: true });
            showTempAlert('✅ JSON copied to clipboard!', '#4CAF50');
        } catch (error) {
            showTempAlert(`❌ Error: ${error.message}`, '#f44336');
            console.error('JSON Error:', error);
        } finally {
            btn.textContent = originalText;
            btn.style.backgroundColor = '#FF9900';
        }
    }

    function extractASIN() {
        const pathMatch = window.location.pathname.match(/\/([A-Z0-9]{10})(?:[\/?]|$)/);
        return pathMatch ? pathMatch[1] : null;
    }

    function fetchBookData(asin) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.audnex.us/books/${asin}`,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error(`API Error: ${response.status}`));
                    }
                },
                onerror: reject
            });
        });
    }

    // Update the processApiData function to process title and subtitle
    async function processApiData(apiData) {
    const editionData = extractEditionInfo(apiData.title);
    
    // Process title for all caps
    let processedTitle = editionData.title;
    if (isAllCaps(processedTitle)) {
        processedTitle = toTitleCase(processedTitle);
    }

    // Process subtitle for all caps
    let processedSubtitle = apiData.subtitle || '';
    if (processedSubtitle && isAllCaps(processedSubtitle)) {
        processedSubtitle = toTitleCase(processedSubtitle);
    }

    return {
        authors: cleanNames(apiData.authors?.map(a => a.name) || []),
        narrators: cleanNames(apiData.narrators?.map(n => n.name) || []),
        title: `${processedTitle}${processedSubtitle ? ": " + processedSubtitle : ""}`,
        description: formatDescription(apiData),
        language: formatLanguage(apiData.language),
        series: processSeries(apiData.seriesPrimary),
        category: await determineCategory(apiData),
        thumbnail: apiData.image,
        tags: await generateTags(apiData, editionData.editionInfo),
        isbn: `ASIN:${apiData.asin}`,
        editionInfo: editionData.editionInfo
    };
   }

    function cleanNames(names) {
        const patterns = {
            prefixes: new RegExp(
                '^\\s*' +
                '(?:Dr|Mr|Mrs|Ms|Miss|Prof|Rev|Hon|Sir|Dame|Lady|Capt|Col|Gen|Lt|Cmdr|Adm|Maj|Sgt)' +
                '[\\s.]*',
                'i'
            ),
            suffixes: new RegExp(
                '[\\s,]+(?:' +
                'Ph\\.?D|M\\.?D|J\\.?D|MBA|MSc|BSc|MS|MA|BA|BS|RN|CPA|Esq|Jr|Sr|I{1,3}|IV|VI?|' +
                '1st|2nd|3rd|4th|FNP|APRN|DNP|PhD\\.?|MD\\.?|JD\\.?' +
                ')(?:\\.|,|$)|' +
                '\\(.*?(?:certified|licensed|registered|chartered).*?\\)',
                'gi'
            )
        };

        return names.map(name => {
            return name.replace(patterns.prefixes, '')
                       .replace(patterns.suffixes, '')
                       .replace(/\s{2,}/g, ' ')
                       .trim();
        }).filter(name => name.length > 1);
    }

    function extractEditionInfo(title) {
        const patterns = [
            /(\d+(?:st|nd|rd|th)?\s*ed(?:ition)?)\b/i,
            /\((?:unabridged|abridged|special edition)\)/i,
            /\[.*(?:edition|version).*\]/i
        ];

        for (const pattern of patterns) {
            const match = title.match(pattern);
            if (match) {
                return {
                    title: title.replace(match[0], '').trim(),
                    editionInfo: match[1] || match[0]
                };
            }
        }
        return {
            title: title.trim(),
            editionInfo: null
        };
    }

    function formatDescription(apiData) {
        let desc = apiData.summary || 'No description available';
        let paragraphs = desc.split(/<\/p>/gi);
        paragraphs = paragraphs.map(p =>
            p.replace(/<p>/gi, '')
             .replace(/<\/?span[^>]*>/gi, '')
             .trim()
        ).filter(p => p.length > 0);

        desc = paragraphs.join('<br><br>');

        if (apiData.translators?.length > 0) {
            desc += `<br><br><strong>Translators:</strong> ${apiData.translators.join(', ')}`;
        }

        return desc;
    }

    function formatLanguage(lang) {
        return lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : 'English';
    }

    function processSeries(seriesData) {
        return seriesData ? [{
            name: seriesData.name,
            number: seriesData.position?.toString() || ""
        }] : [];
    }

    async function determineCategory(apiData) {
        const audibleCategories = apiData.genres?.map(g => g.name) || [];

        switch (CATEGORY_SELECTION_METHOD) {
            case 1:
                for (const category of audibleCategories) {
                    if (AUDIBLE_TO_MAM_CATEGORY_MAP[category]) {
                        return AUDIBLE_TO_MAM_CATEGORY_MAP[category];
                    }
                }
                return '';

            case 2:
                return smartCategoryMatcher(audibleCategories, apiData.title, apiData.summary);

            case 3:
                return await getChatGptCategory(apiData.title, apiData.summary, audibleCategories);

            default:
                return '';
        }
    }

    function smartCategoryMatcher(audibleCategories, title, description) {
        const text = `${title} ${description}`.toLowerCase();
        const scores = {};

        for (const [keyword, category] of Object.entries(KEYWORD_TO_MAM_CATEGORY_MAP)) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            const matches = text.match(regex);
            if (matches) {
                scores[category] = (scores[category] || 0) + matches.length;
            }
        }

        for (const audibleCat of audibleCategories) {
            const mappedCat = AUDIBLE_TO_MAM_CATEGORY_MAP[audibleCat];
            if (mappedCat) {
                scores[mappedCat] = (scores[mappedCat] || 0) + 3;
            }
        }

        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        return sorted[0]?.[0] || '';
    }

    async function getChatGptCategory(title, description, audibleCategories) {
        if (CHATGPT_API_KEY === "your-api-key-here") {
            throw new Error("Please put your ChatGPT API key in the script to use AI functionality or switch to the direct mapping or keyword matching methods.");
        }
        if (!CHATGPT_API_KEY) return '';

        const prompt = `Select the most appropriate category from this list: ${AVAILABLE_CATEGORIES.join(", ")}

        Title: ${title}
        Description: ${description}
        Audible Categories: ${audibleCategories.join(", ")}

        Respond only with the exact category name.`;

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${CHATGPT_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.5,
                    max_tokens: 50
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Invalid ChatGPT API key");
                }
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            const category = data.choices[0].message.content.trim();
            return AVAILABLE_CATEGORIES.includes(category) ? category : '';

        } catch (error) {
            throw new Error(error.message.includes("API key")
                ? "Invalid ChatGPT API key"
                : "AI Category Error");
        }
    }

    async function generateTags(apiData, editionInfo) {
        const tags = [
            `${formatDate(apiData.releaseDate)}`,
            CHAPTERIZED && 'Chapterized',
            RIPPER
        ].filter(Boolean);

        if (CATEGORY_SELECTION_METHOD === 3) {
            const aiTags = await generateAITags(apiData.title, apiData.summary);
            if (aiTags.length > 0) {
                tags.push(...aiTags);
            }
        } else {
            const category = await determineCategory(apiData);
            if (category) {
                const categoryTag = category.replace('Audiobooks - ', '');
                tags.push(categoryTag);
            }
        }

        tags.push(
            `${formatRuntime(apiData.runtimeLengthMin)}`,
            `${apiData.publisherName}`
        );

        if (editionInfo) tags.push(`Edition: ${editionInfo}`);
        return tags.join(' | ');
    }

    async function generateAITags(title, description) {
        const prompt = `For the audiobook with title "${title}" and description "${description}", generate 3-4 relevant descriptive tags.
        Tags should be single words or short phrases that describe the book's themes, setting, or notable elements.
        Avoid generic terms like "fiction", "non-fiction", or basic genre names.
        Respond with just the tags, separated by commas.`;

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${CHATGPT_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7,
                    max_tokens: 50
                })
            });

            if (!response.ok) {
                return [];
            }

            const data = await response.json();
            return data.choices[0].message.content.split(',').map(tag => tag.trim());

        } catch (error) {
            console.error('Error generating AI tags:', error);
            return [];
        }
    }

    function formatRuntime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours} hrs ${mins} mins`;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function showTempAlert(message, color) {
        const alert = document.createElement('div');
        Object.assign(alert.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            backgroundColor: color,
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 10000,
            animation: 'slideIn 0.3s ease-out'
        });
        alert.textContent = message;

        document.body.appendChild(alert);
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    }

    function addKeyframeAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
            @keyframes slideOut {
                from { transform: translateX(0); }
                to { transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
    }
})();