// ==UserScript==
// @name         Goodreads Book Metadata with Multiple AI Options
// @namespace    https://greasyfork.org/en/scripts/513471
// @version      1.0.1
// @license      MIT
// @description  Copies Goodreads book metadata to JSON format with multiple AI-powered category selection options
// @author       SnowmanNurse
// @match        https://www.goodreads.com/book/show/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513471/Goodreads%20Book%20Metadata%20with%20Multiple%20AI%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/513471/Goodreads%20Book%20Metadata%20with%20Multiple%20AI%20Options.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CATEGORY_SELECTION_METHOD = 3; // 1 for direct mapping, 2 for scoring method, 3 for AI-based selection

    // AI model selection (only used if CATEGORY_SELECTION_METHOD is 3)
    // 0: None (fall back to direct mapping), 1: ChatGPT (OpenAI), 2: Meta Llama, 3: Google Gemini 128K,
    // 4: Mistral AI, 5: Google Gemini 1M, 6: Anthropic Claude 3
    const AI_MODEL = 1;

    // API keys (Replace with your actual API keys)
    const CHATGPT_API_KEY = "your_chatgpt_api_key_here";
    const META_API_KEY = "your_meta_api_key_here";
    const GOOGLE_API_KEY = "your_google_api_key_here";
    const MISTRAL_API_KEY = "your_mistral_api_key_here";
    const ANTHROPIC_API_KEY = "your_anthropic_api_key_here";

    const AVAILABLE_CATEGORIES = [
        "Ebooks - Art", "Ebooks - Biographical", "Ebooks - Business", "Ebooks - Computers",
        "Ebooks - Cooking", "Ebooks - Crafts", "Ebooks - Fantasy", "Ebooks - Fiction",
        "Ebooks - Health", "Ebooks - History", "Ebooks - Home & Garden", "Ebooks - Horror",
        "Ebooks - Humor", "Ebooks - Juvenile", "Ebooks - Language", "Ebooks - Literature",
        "Ebooks - Mathematics", "Ebooks - Medical", "Ebooks - Mystery", "Ebooks - Nature",
        "Ebooks - Philosophy", "Ebooks - Politics", "Ebooks - Reference", "Ebooks - Religion",
        "Ebooks - Romance", "Ebooks - Science", "Ebooks - Science Fiction", "Ebooks - Self-Help",
        "Ebooks - Social Science", "Ebooks - Sports", "Ebooks - Technology", "Ebooks - Travel",
        "Ebooks - True Crime", "Ebooks - Young Adult"
    ];

    // Mapping from Goodreads shelves to categories
    const GOODREADS_TO_MAM_CATEGORY_MAP = {
        "Art": "Ebooks - Art",
        "Biography": "Ebooks - Biographical",
        "Business": "Ebooks - Business",
        "Computer Science": "Ebooks - Computers",
        "Cooking": "Ebooks - Cooking",
        "Crafts": "Ebooks - Crafts",
        "Fantasy": "Ebooks - Fantasy",
        "Fiction": "Ebooks - Fiction",
        "Health": "Ebooks - Health",
        "History": "Ebooks - History",
        "Horror": "Ebooks - Horror",
        "Humor": "Ebooks - Humor",
        "Children's": "Ebooks - Juvenile",
        "Reference": "Ebooks - Reference",
        "Romance": "Ebooks - Romance",
        "Science": "Ebooks - Science",
        "Self Help": "Ebooks - Self-Help",
        "Sports": "Ebooks - Sports",
        "Young Adult": "Ebooks - Young Adult"
    };

    // SVG logo
    const svgLogo = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 59.16 69.57'>
        <g transform='translate(-110.73,-61.49)'>
            <path d='m 130.15,99.28 c 2.9,-1.3 4.93,-4.22 4.94,-7.6 0,-4.61 -3.74,-8.35 -8.35,-8.35 -4.61,0 -8.35,3.74 -8.35,8.35 0,4.6 3.74,8.34 8.35,8.34 0.72,0 1.41,-0.1 2.08,-0.27 0.41,-0.18 0.85,-0.33 1.32,-0.46 z m -7.55,-6.13 c 0,-2.3 1.87,-4.17 4.18,-4.17 0.58,0 1.15,0.12 1.65,0.34 -0.11,0.31 -0.18,0.65 -0.18,1.0 0,1.53 1.19,2.79 2.7,2.91 -0.04,2.26 -1.89,4.09 -4.17,4.09 -2.3,0 -4.18,-1.87 -4.18,-4.17' style='fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.03' />
            <path d='m 146.01,83.31 c -4.61,0 -8.35,3.74 -8.35,8.35 0,3.35 1.97,6.23 4.82,7.56 0.55,0.14 1.08,0.32 1.56,0.54 0.63,0.15 1.28,0.24 1.96,0.24 4.6,0 8.34,-3.74 8.35,-8.35 0,-4.61 -3.74,-8.35 -8.35,-8.35 z m 0.04,14.01 c -2.3,0 -4.17,-1.87 -4.17,-4.17 0,-2.3 1.87,-4.17 4.17,-4.17 0.51,0 1.01,0.09 1.46,0.26 -0.13,0.33 -0.21,0.7 -0.21,1.08 0,1.61 1.3,2.92 2.92,2.92 -0.05,2.26 -1.9,4.08 -4.17,4.08' style='fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.03' />
        </g>
    </svg>`;

function cleanName(name) {
        const titlesToRemove = [
            "PhD", "MD", "JD", "MBA", "MA", "MS", "MSc", "MFA", "MEd", "ScD", "DrPH", "MPH", "LLM", "DDS", "DVM",
            "EdD", "PsyD", "ThD", "DO", "PharmD", "DSc", "DBA", "RN", "CPA", "Esq\\.", "LCSW", "PE", "AIA", "FAIA",
            "CSP", "CFP", "Jr\\.", "Sr\\.", "I", "II", "III", "IV", "Dr\\.", "Mr\\.", "Mrs\\.", "Ms\\.", "Prof\\.", "Rev\\.", "Fr\\.",
            "Sr\\.", "Capt\\.", "Col\\.", "Gen\\.", "Lt\\.", "Cmdr\\.", "Adm\\.", "Sir", "Dame", "Hon\\.", "Amb\\.", "Gov\\.", "Sen\\.",
            "Rep\\.", "BSN", "MSN", "DNP", "CNE", "CNEcl", "ANEF", "FAADN", "COI"
        ];

        // Start with the original name
        let cleanedName = name.trim();

        // First remove credentials after commas
        cleanedName = cleanedName.split(',')[0].trim();

        // Create pattern for space-separated credentials
        const credentialPattern = `\\s+(${titlesToRemove.join('|')})\\b`;
        const credentialRegex = new RegExp(credentialPattern, 'g');

        // Remove space-separated credentials
        cleanedName = cleanedName.replace(credentialRegex, '');

        // Final cleanup of any extra spaces while preserving internal spaces
        cleanedName = cleanedName.replace(/\s+/g, ' ').trim();

        return cleanedName;
    }
    function cleanText(text) {
        return text
            .replace(/\u200E/g, '') // Remove LTR mark
            .replace(/\s+/g, ' ')
            .replace(/›.*$/g, '')
            .replace(/‹.*$/g, '')
            .trim();
    }

    function cleanDescription(description) {
        return description
            .replace(/<div>/gi, '')
            .replace(/<\/div>/gi, '')
            .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<i>/gi, '[i]')
            .replace(/<\/i>/gi, '[/i]')
            .replace(/<b>/gi, '[b]')
            .replace(/<\/b>/gi, '[/b]')
            .replace(/<em>/gi, '[i]')
            .replace(/<\/em>/gi, '[/i]')
            .replace(/<strong>/gi, '[b]')
            .replace(/<\/strong>/gi, '[/b]')
            .replace(/\n\s*\n/g, '\n\n')
            .trim();
    }

    function showOverlay() {
        const overlayHtml = `
            <div id="mam-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 9999;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 5px; text-align: center;">
                    <p style="font-size: 18px; margin: 0;">Processing JSON data...</p>
                    <p style="font-size: 16px; margin: 10px 0 0;">Please wait...</p>
                    <div id="ai-gif" style="display: none; margin-top: 20px;">
                        <img src="https://c.tenor.com/JDV9WN1QC3kAAAAC/tenor.gif" alt="AI Processing" style="max-width: 200px;">
                    </div>
                </div>
            </div>`;

        if (!document.getElementById('mam-overlay')) {
            document.body.insertAdjacentHTML('beforeend', overlayHtml);
        }
        document.getElementById("mam-overlay").style.display = "block";

        if (CATEGORY_SELECTION_METHOD === 3 && AI_MODEL !== 0) {
            document.getElementById("ai-gif").style.display = "block";
        }
    }

    function hideOverlay() {
        const overlay = document.getElementById("mam-overlay");
        if (overlay) {
            overlay.style.display = "none";
            const aiGif = document.getElementById("ai-gif");
            if (aiGif) {
                aiGif.style.display = "none";
            }
        }
    }

    function getAuthors() {
        let authorElements = document.querySelectorAll('.ContributorLink__name');
        let authors = [];

        authorElements.forEach(element => {
            if (element) {
                let authorName = element.textContent.trim();
                authorName = cleanName(authorName);
                if (authorName && !authors.includes(authorName)) {
                    authors.push(authorName);
                }
            }
        });

        return authors;
    }

    function getTitle() {
        let titleElement = document.querySelector('.Text.Text__title1');
        let title = titleElement ? titleElement.textContent.trim() : "";

        return title;
    }

    function getDescription() {
        let descriptionElement = document.querySelector('.DetailsLayoutRightParagraph__widthConstrained .Formatted');
        if (!descriptionElement) return "No description available";

        return cleanDescription(descriptionElement.innerHTML);
    }

    function getThumbnail() {
        let imgElement = document.querySelector('.BookCover__image .ResponsiveImage');
        return imgElement ? imgElement.getAttribute('src') : "";
    }

    function getLanguage() {
        let languageElement = document.querySelector('div.BookDetails [data-testid*="language"]');
        if (languageElement) {
            return languageElement.textContent.replace('Language:', '').trim();
        }
        return "English";
    }

function getTags() {
        let tags = [];

        // Get publication info
        let publisherInfo = document.querySelector('div.BookDetails [data-testid*="publisher"]');
        if (publisherInfo) {
            const publisherText = publisherInfo.textContent
                .replace('Publisher:', '')
                .split('(')[0]  // Remove anything in parentheses
                .trim();
            if (publisherText) {
                tags.push(`Publisher: ${publisherText}`);
            }
        }

        // Get publication date
        let dateElement = document.querySelector('div.BookDetails [data-testid*="publicationInfo"]');
        if (dateElement) {
            const dateText = dateElement.textContent
                .replace('Published', '')
                .replace(':', '')
                .trim();
            if (dateText) {
                tags.push(`Published: ${dateText}`);
            }
        }

        // Get page count
        let pagesElement = document.querySelector('div.BookDetails [data-testid*="pagesFormat"]');
        if (pagesElement) {
            const pagesMatch = pagesElement.textContent.match(/(\d+)\s*pages/);
            if (pagesMatch) {
                tags.push(`Pages: ${pagesMatch[1]}`);
            }
        }

        // Get formats
        let formatElement = document.querySelector('div.BookDetails [data-testid*="format"]');
        if (formatElement) {
            const format = formatElement.textContent.replace('Format:', '').trim();
            if (format) {
                tags.push(format);
            }
        }

        // Get genres/shelves
        let genreElements = document.querySelectorAll('.BookPageMetadataSection__genres a');
        genreElements.forEach(element => {
            const genre = element.textContent.trim();
            if (genre) {
                tags.push(genre);
            }
        });

        // Get series info for tags if exists
        const seriesElement = document.querySelector('.BookPageTitleSection__title .Text__subdued');
        if (seriesElement) {
            const seriesText = seriesElement.textContent.trim();
            if (seriesText) {
                tags.push(seriesText);
            }
        }

        // Clean and format tags
        let cleanedTags = tags
            .filter(tag => tag && tag.trim())  // Remove empty tags
            .map(tag => tag.replace(/\s+/g, ' ').trim())  // Clean up whitespace
            .filter((tag, index, self) => self.indexOf(tag) === index);  // Remove duplicates

        return cleanedTags.join(" | ");
    }
    function getSeriesInfo() {
        let seriesInfo = [];
        const seriesElement = document.querySelector('.BookPageTitleSection__title .Text__subdued');

        if (seriesElement) {
            let seriesText = seriesElement.textContent.trim();
            const seriesMatch = seriesText.match(/(.*?)(?:\s*#(\d+))?$/);

            if (seriesMatch) {
                seriesInfo.push({
                    name: seriesMatch[1].trim(),
                    number: seriesMatch[2] || ""
                });
            }
        }

        return seriesInfo;
    }

    function getBookData() {
        const script = document.querySelector("script[id=__NEXT_DATA__]");
        const json = JSON.parse(script.textContent);
        return json.props.pageProps.apolloState;
    }


function getISBN() {
        const bookData = getBookData();
        for (const key in bookData) {
            if (key.startsWith("Book:") && bookData[key].hasOwnProperty("details")) {
                const details = bookData[key].details;
                return details.isbn13 || details.isbn10 || details.asin || "";
            }
        }
        return "";
    }

    async function getCategoryFromAI(title, description, goodreadsShelf) {
        const prompt = `Given the following book information, select the most appropriate category from this list: ${AVAILABLE_CATEGORIES.join(", ")}

Title: ${title}
Description: ${description}
Goodreads Shelf: ${goodreadsShelf}

Please respond with only the category name, nothing else.`;

        switch (AI_MODEL) {
            case 1: return await getCategoryFromChatGPT(prompt);
            case 2: return await getCategoryFromMetaLlama(prompt);
            case 3: return await getCategoryFromGoogleGemini(prompt, false);
            case 4: return await getCategoryFromMistralAI(prompt);
            case 5: return await getCategoryFromGoogleGemini(prompt, true);
            case 6: return await getCategoryFromAnthropicClaude(prompt);
            default:
                // Fallback to direct mapping if AI fails or is not configured
                return GOODREADS_TO_MAM_CATEGORY_MAP[goodreadsShelf] || "Ebooks - Fiction";
        }
    }

    async function getMAMCategory(title, description, goodreadsShelf) {
        switch (CATEGORY_SELECTION_METHOD) {
            case 1: // Direct mapping
                return GOODREADS_TO_MAM_CATEGORY_MAP[goodreadsShelf] || "";
            case 2: // Scoring method
                return smartCategoryMatcher(goodreadsShelf, title, description);
            case 3: // AI-based selection
                return await getCategoryFromAI(title, description, goodreadsShelf);
            default:
                return "";
        }
    }

    async function getCategoryFromChatGPT(prompt) {
        if (!CHATGPT_API_KEY) return null;
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CHATGPT_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 50
            })
        });
        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    async function getCategoryFromMetaLlama(prompt) {
        if (!META_API_KEY) return null;
        const response = await fetch("https://api.meta.com/v1/text/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${META_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-2-13b-chat",
                prompt: prompt,
                max_tokens: 50
            })
        });
        const data = await response.json();
        return data.choices[0].text.trim();
    }

    async function getCategoryFromGoogleGemini(prompt, isLargeModel) {
        if (!GOOGLE_API_KEY) return null;
        const model = isLargeModel ? "gemini-1.5-flash-1m" : "gemini-1.5-flash";
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    }

    async function getCategoryFromMistralAI(prompt) {
        if (!MISTRAL_API_KEY) return null;
        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: "mistral-large-latest",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 50
            })
        });
        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    async function getCategoryFromAnthropicClaude(prompt) {
        if (!ANTHROPIC_API_KEY) return null;
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY
            },
            body: JSON.stringify({
                model: "claude-3-haiku-20240307",
                max_tokens: 50,
                messages: [{ role: "user", content: prompt }]
            })
        });
        const data = await response.json();
        return data.content[0].text.trim();
    }

    function smartCategoryMatcher(goodreadsShelf, title, description) {
        let scores = {};
        AVAILABLE_CATEGORIES.forEach(category => {
            scores[category] = 0;

            // Check title
            if (title.toLowerCase().includes(category.toLowerCase().replace("Ebooks - ", ""))) {
                scores[category] += 2;
            }

            // Check description
            if (description.toLowerCase().includes(category.toLowerCase().replace("Ebooks - ", ""))) {
                scores[category] += 1;
            }

            // Check Goodreads shelf match
            if (GOODREADS_TO_MAM_CATEGORY_MAP[goodreadsShelf] === category) {
                scores[category] += 3;
            }
        });

        return Object.entries(scores).reduce((a, b) => b[1] > a[1] ? b : a)[0];
    }

    async function generateJson() {
        try {
            showOverlay();

            const title = getTitle();
            const authors = getAuthors();
            const description = getDescription();
            const thumbnail = getThumbnail();
            const isbn = getISBN();
            const language = getLanguage();
            const tags = getTags();
            const seriesInfo = getSeriesInfo();

            // Get the first shelf as category
            const shelfElement = document.querySelector('.BookPageMetadataSection__genres a');
            const goodreadsShelf = shelfElement ? shelfElement.textContent.trim() : "";

            const mamCategory = await getMAMCategory(title, description, goodreadsShelf);

            const json = {
                "authors": authors,
                "description": description,
                "tags": tags,
                "thumbnail": thumbnail,
                "title": title,
                "language": language,
                "series": seriesInfo,
                "category": mamCategory,
                "isbn": isbn
            };

            await navigator.clipboard.writeText(JSON.stringify(json, null, 2));
            console.log('Copied to clipboard successfully!');
            window.open("https://www.myanonamouse.net/tor/upload.php", "_blank");
        } catch (error) {
            console.error('Error generating JSON:', error);
        } finally {
            hideOverlay();
        }
    }

    function addButtonAndLogo() {
        const isAISelected = CATEGORY_SELECTION_METHOD === 3 && AI_MODEL !== 0;
        const buttonText = isAISelected ? "Copy Book info to JSON with AI" : "Copy Book info to JSON";

        let container = document.createElement("div");
        container.innerHTML = `
            <div id="metadataButtonContainer" style="position:fixed;bottom:10px;right:10px;z-index:9999;display:flex;align-items:center;">
                <div style="width:30px;height:30px;margin-right:10px;background-color:#027A48;border-radius:5px;padding:5px;">${svgLogo}</div>
                <button id="copyMetadataButton" style="padding:10px;background-color:#027A48;color:white;border:none;border-radius:5px;font-size:14px;cursor:pointer;transition:background-color 0.2s;">
                    ${buttonText}
                </button>
            </div>`;
        document.body.appendChild(container);

        // Add hover effect
        const button = document.getElementById("copyMetadataButton");
        button.addEventListener("mouseover", function() {
            this.style.backgroundColor = "#025C36";
        });
        button.addEventListener("mouseout", function() {
            this.style.backgroundColor = "#027A48";
        });

        // Add click handler
        button.addEventListener("click", async function(event) {
            event.preventDefault();
            await generateJson();
        });
    }

    function main() {
        // Only run on book pages
        if (window.location.pathname.includes('/book/show/')) {
            console.log("Goodreads Book Metadata script is running on a book page.");
            addButtonAndLogo();
        } else {
            console.log("Not a book page. Goodreads Book Metadata script will not run.");
        }
    }

    // Run the script
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(main, 1000);  // Delay execution by 1 second
    } else {
        window.addEventListener("DOMContentLoaded", function() {
            setTimeout(main, 1000);  // Delay execution by 1 second
        });
    }
})();