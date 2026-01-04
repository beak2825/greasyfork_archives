// ==UserScript==
// @name         Amazon Book Metadata with Multiple AI Options
// @namespace    https://greasyfork.org/en/scripts/513462
// @version      1.0.3
// @license      MIT
// @description  Copies Amazon book metadata to JSON for both physical and ebooks, with multiple AI-powered category selection options
// @author       SnowmanNurse
// @match        https://www.amazon.com/*
// @match        https://www.amazon.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513462/Amazon%20Book%20Metadata%20with%20Multiple%20AI%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/513462/Amazon%20Book%20Metadata%20with%20Multiple%20AI%20Options.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const CATEGORY_SELECTION_METHOD = 2; // 1 for direct mapping, 2 for scoring method, 3 for AI-based selection

    // AI model selection (only used if CATEGORY_SELECTION_METHOD is 3)
    // 0: None (fall back to direct mapping), 1: ChatGPT (OpenAI), 2: Meta Llama, 3: Google Gemini 128K,
    // 4: Mistral AI, 5: Google Gemini 1M, 6: Anthropic Claude 3
    const AI_MODEL = 1;

    // API keys for different AI models (Replace with your actual API keys)
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

    const AMAZON_TO_MAM_CATEGORY_MAP = {
        "Arts & Photography": "Ebooks - Art",
        "Biographies & Memoirs": "Ebooks - Biographical",
        "Business & Money": "Ebooks - Business",
        "Computers & Technology": "Ebooks - Computers",
        "Cookbooks, Food & Wine": "Ebooks - Cooking",
        "Crafts, Hobbies & Home": "Ebooks - Crafts",
        "Science Fiction & Fantasy": "Ebooks - Fantasy",
        "Literature & Fiction": "Ebooks - Fiction",
        "Health, Fitness & Dieting": "Ebooks - Health",
        "History": "Ebooks - History",
        "Horror": "Ebooks - Horror",
        "Humor & Entertainment": "Ebooks - Humor",
        "Children's Books": "Ebooks - Juvenile",
        "Reference": "Ebooks - Reference",
        "Romance": "Ebooks - Romance",
        "Science & Math": "Ebooks - Science",
        "Self-Help": "Ebooks - Self-Help",
        "Sports & Outdoors": "Ebooks - Sports",
        "Teen & Young Adult": "Ebooks - Young Adult"
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
            "EdD", "PsyD", "ThD", "DO", "PharmD", "DSc", "DBA", "RN", "CPA", "Esq.", "LCSW", "PE", "AIA", "FAIA",
            "CSP", "CFP", "Jr.", "Sr.", "I", "II", "III", "IV", "Dr.", "Mr.", "Mrs.", "Ms.", "Prof.", "Rev.", "Fr.",
            "Sr.", "Capt.", "Col.", "Gen.", "Lt.", "Cmdr.", "Adm.", "Sir", "Dame", "Hon.", "Amb.", "Gov.", "Sen.",
            "Rep.", "BSN", "MSN", "RN", "MS", "MN", "CNE", "CNEcl", "ANEF", "FAADN", "COI", "DNP"
        ];

        let cleanedName = name.trim();

        titlesToRemove.forEach(title => {
            const regexBefore = new RegExp(`^${title}\\b`, 'i');
            const regexAfter = new RegExp(`\\b${title}$`, 'i');
            cleanedName = cleanedName.replace(regexBefore, '').replace(regexAfter, '');
        });

        titlesToRemove.forEach(title => {
            const regexMiddle = new RegExp(`\\s${title}\\s`, 'gi');
            cleanedName = cleanedName.replace(regexMiddle, ' ');
        });

        cleanedName = cleanedName.replace(/,\s*([A-Z]+\s*)+$/, '');
        cleanedName = cleanedName.replace(/\s+/g, ' ').trim();

        return cleanedName;
    }

    function cleanText(text) {
        return text
            .replace(/‎/g, '') // Remove special characters
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/›.*$/g, '') // Remove everything after '›' character
            .replace(/‹.*$/g, '') // Remove everything after '‹' character
            .replace(/Back to results.*$/i, '') // Remove "Back to results" text
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

        // Show GIF if AI model is selected
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
        let authorElements = document.querySelectorAll('#bylineInfo .author .a-link-normal');
        let authors = [];
        for (let element of authorElements) {
            if (element) {
                let authorName = element.textContent.trim();
                authorName = cleanName(authorName);
                if (authorName && !authors.includes(authorName)) {
                    authors.push(authorName);
                }
            }
        }
        return authors;
    }

    function getTitle() {
        let titleElement = document.getElementById("productTitle");
        return titleElement ? titleElement.textContent.trim() : "";
    }

    function getDescription() {
        let descriptionElement = document.querySelector('#bookDescription_feature_div .a-expander-content');
        return descriptionElement ? descriptionElement.innerHTML.trim() : "No description available";
    }

    function getThumbnail() {
        // First try for normal book layout
        var thumbnailElement = document.querySelector("#imgBlkFront");
        if (!thumbnailElement) {
            // Try for ebook layout
            thumbnailElement = document.querySelector("#ebooksImgBlkFront");
        }
        if (!thumbnailElement) {
            // Try for alternate layout
            thumbnailElement = document.querySelector("#imgTagWrapperId img");
        }

        if (thumbnailElement) {
            // Try to get the high-resolution version first
            var thumbnail = thumbnailElement.getAttribute("data-a-dynamic-image");
            if (thumbnail) {
                try {
                    // Get the first URL from the dynamic image JSON
                    var dynamicImageData = JSON.parse(thumbnail);
                    return Object.keys(dynamicImageData)[0];
                } catch (e) {
                    console.error('Error parsing dynamic image data:', e);
                }
            }

            // Fallback to data-old-hires or src
            return thumbnailElement.getAttribute("data-old-hires") || thumbnailElement.src;
        }

        return "";
    }

    function getLanguage() {
        let languageElement = document.querySelector("#rpi-attribute-language .rpi-attribute-value span");
        return languageElement ? languageElement.textContent.trim() : "Unknown";
    }

    function getSeriesInfo() {
        let seriesElement = document.querySelector("#seriesBulletWidget_feature_div");
        let seriesInfo = [];

        if (seriesElement) {
            let seriesLink = seriesElement.querySelector("a");
            if (seriesLink) {
                let seriesName = seriesLink.textContent.trim();
                let bookNumberMatch = seriesElement.textContent.match(/Book\s*?(\d+\.?\d*-?\d*\.?\d*)/);
                let bookNumber = bookNumberMatch ? bookNumberMatch[1] : "";

                seriesInfo.push({ name: seriesName, number: bookNumber });
            }
        }

        return seriesInfo;
    }

    function getEdition() {
        let detailsElement = document.querySelector('#detailBullets_feature_div');
        if (detailsElement) {
            let items = detailsElement.querySelectorAll('li');
            for (let item of items) {
                if (item.textContent.includes('Publisher')) {
                    let editionMatch = item.textContent.match(/;\s*(\d+(?:st|nd|rd|th)\s+edition)/i);
                    if (editionMatch) {
                        return cleanText(editionMatch[1]);
                    }
                }
            }
        }
        return "";
    }

    function getPageCount() {
        let detailsElement = document.querySelector('#detailBullets_feature_div');
        if (detailsElement) {
            let items = detailsElement.querySelectorAll('li');
            for (let item of items) {
                if (item.textContent.includes('pages')) {
                    let pageCount = item.textContent.match(/(\d+)\s*pages/);
                    return pageCount ? pageCount[1] : "Unknown";
                }
            }
        }

        // Try alternate location
        let printLengthElement = document.querySelector('#rpi-attribute-book_details-fiona_pages .rpi-attribute-value span');
        if (printLengthElement) {
            let pageCount = printLengthElement.textContent.match(/(\d+)/);
            return pageCount ? pageCount[1] : "Unknown";
        }

        return "Unknown";
    }

    function getPublicationDate() {
        let detailsElement = document.querySelector('#detailBullets_feature_div');
        if (detailsElement) {
            let items = detailsElement.querySelectorAll('li');
            for (let item of items) {
                if (item.textContent.includes('Publisher') || item.textContent.includes('Publication date')) {
                    let dateMatch = item.textContent.match(/\((.*?)\)/);
                    return dateMatch ? cleanText(dateMatch[1]) : "";
                }
            }
        }

        // Try alternate location
        let pubDateElement = document.querySelector('#rpi-attribute-book_details-publication_date .rpi-attribute-value span');
        if (pubDateElement) {
            return cleanText(pubDateElement.textContent);
        }

        return "";
    }

    function getPublisher() {
        let detailsElement = document.querySelector('#detailBullets_feature_div');
        if (detailsElement) {
            let items = detailsElement.querySelectorAll('li');
            for (let item of items) {
                if (item.textContent.includes('Publisher')) {
                    let publisherText = item.textContent.split(':')[1];
                    if (publisherText) {
                        let publisher = publisherText.split('(')[0];
                        return cleanText(publisher).replace(/;\s*\d+(?:st|nd|rd|th)\s+edition/i, '');
                    }
                }
            }
        }

        // Try alternate location
        let publisherElement = document.querySelector('#rpi-attribute-book_details-publisher .rpi-attribute-value span');
        if (publisherElement) {
            return cleanText(publisherElement.textContent).replace(/;\s*\d+(?:st|nd|rd|th)\s+edition/i, '');
        }

        return "Unknown Publisher";
    }

    function getAmazonCategory() {
        let categoryElement = document.querySelector("#wayfinding-breadcrumbs_feature_div");
        if (categoryElement) {
            let categories = categoryElement.textContent.trim().split("›");
            // Get the last category but make sure it's not a navigation element
            let lastCategory = categories[categories.length - 1];
            if (lastCategory && !lastCategory.toLowerCase().includes('back to')) {
                return cleanText(lastCategory);
            }
            // If the last item is navigation, try the second to last
            if (categories.length > 1) {
                return cleanText(categories[categories.length - 2]);
            }
        }
        return "";
    }

    function getISBN() {
        let isbn10Element = document.querySelector('#rpi-attribute-book_details-isbn10 .rpi-attribute-value span');
        let isbn10 = isbn10Element ? isbn10Element.textContent.trim() : '';
        let isbn13Element = document.querySelector('#rpi-attribute-book_details-isbn13 .rpi-attribute-value span');
        let isbn13 = isbn13Element ? isbn13Element.textContent.trim() : '';

        if (!isbn10 || !isbn13) {
            let detailsElement = document.querySelector('#detailBullets_feature_div');
            if (detailsElement) {
                let items = detailsElement.querySelectorAll('li');
                items.forEach(function(item) {
                    let text = item.textContent;
                    if (text.includes('ISBN-10')) {
                        isbn10 = text.split(':')[1].trim();
                    } else if (text.includes('ISBN-13')) {
                        isbn13 = text.split(':')[1].trim();
                    }
                });
            }
        }

        return { isbn10, isbn13 };
    }

    function getASIN() {
        let asinElement = document.querySelector("#detailsRichBullets_feature_div");
        if (asinElement) {
            let asinText = asinElement.textContent.trim();
            let match = asinText.match(/ASIN\s*:\s*([\w\d]+)/);
            return match ? match[1] : "";
        }
        return "";
    }

    function getTags() {
        let tags = [];
        let edition = getEdition();
        let pageCount = getPageCount();
        let publicationDate = getPublicationDate();
        let publisher = getPublisher();
        let amazonCategory = getAmazonCategory();

        // Add edition first if it exists
        if (edition) tags.push(edition);
        if (pageCount && pageCount !== "Unknown") tags.push(`Pages: ${pageCount}`);
        if (publicationDate) tags.push(`Published: ${publicationDate}`);
        if (publisher && publisher !== "Unknown Publisher") tags.push(`Publisher: ${publisher}`);
        if (amazonCategory) {
            let cleanCategory = cleanText(amazonCategory);
            if (cleanCategory) tags.push(cleanCategory);
        }

        return tags.filter(tag => tag && tag.trim()).join(" | ");
    }

    async function getMAMCategory(title, description, amazonCategory) {
        switch (CATEGORY_SELECTION_METHOD) {
            case 1: // Direct mapping
                return AMAZON_TO_MAM_CATEGORY_MAP[amazonCategory] || "";
            case 2: // Scoring method
                return smartCategoryMatcher(amazonCategory, title, description);
            case 3: // AI-based selection
                return await getCategoryFromAI(title, description, amazonCategory);
            default:
                return "";
        }
    }

    async function getCategoryFromAI(title, description, amazonCategory) {
        const prompt = `Given the following book information, select the most appropriate category from this list: ${AVAILABLE_CATEGORIES.join(", ")}

Title: ${title}
Description: ${description}
Amazon Category: ${amazonCategory}

Please respond with only the category name, nothing else.`;

        switch (AI_MODEL) {
            case 1: return await getCategoryFromChatGPT(prompt);
            case 2: return await getCategoryFromMetaLlama(prompt);
            case 3: return await getCategoryFromGoogleGemini(prompt, false);
            case 4: return await getCategoryFromMistralAI(prompt);
            case 5: return await getCategoryFromGoogleGemini(prompt, true);
            case 6: return await getCategoryFromAnthropicClaude(prompt);
            default: return null;
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

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Copied to clipboard successfully!');
            window.open("https://www.myanonamouse.net/tor/upload.php", "_blank");
        } catch (err) {
            console.error('Failed to copy: ', err);
        } finally {
            hideOverlay();
        }
    }

    async function generateJson() {
        try {
            var title = getTitle();
            var authors = getAuthors();
            var description = getDescription();
            var thumbnail = getThumbnail();
            var language = getLanguage();
            var seriesInfo = getSeriesInfo();
            var amazonCategory = getAmazonCategory();
            var mamCategory = await getMAMCategory(title, description, amazonCategory);
            var tags = getTags();
            var { isbn10, isbn13 } = getISBN();
            var asin = getASIN();

            // Append ISBNs to the description
            if (isbn10 || isbn13) {
                description += '<br><br>';
                if (isbn13) description += `ISBN-13: ${isbn13}<br>`;
                if (isbn10) description += `ISBN-10: ${isbn10}`;
            }

            var json = {
                "authors": authors,
                "description": description,
                "tags": tags,
                "thumbnail": thumbnail,
                "title": title,
                "language": language,
                "series": seriesInfo,
                "category": mamCategory,
                "isbn": isbn13 || isbn10 || asin || ''
            };

            var strJson = JSON.stringify(json, null, 2);
            await copyToClipboard(strJson);
        } catch (error) {
            console.error('Error generating JSON:', error);
            hideOverlay();
        }
    }

    function addButtonAndLogo() {
        // Determine button text based on AI settings
        const isAISelected = CATEGORY_SELECTION_METHOD === 3 && AI_MODEL !== 0;
        const buttonText = isAISelected ? "Copy Book info to JSON with AI" : "Copy Book info to JSON";

        let container = document.createElement("div");
        container.innerHTML = `
            <div id="metadataButtonContainer" style="position:fixed;bottom:10px;right:10px;z-index:9999;display:flex;align-items:center;">
                <div style="width:30px;height:30px;margin-right:10px;">${svgLogo}</div>
                <button id="copyMetadataButton" style="padding:10px;background-color:#008CBA;color:white;border:none;border-radius:5px;font-size:14px;">
                    ${buttonText}
                </button>
            </div>`;
        document.body.appendChild(container);

        document.getElementById("copyMetadataButton").addEventListener("click", async function(event) {
            event.preventDefault();
            showOverlay();
            await generateJson();
        });
    }

    function main() {
        if (document.querySelector('#productTitle')) {
            console.log("Amazon Book Metadata script is running on a book page.");
            addButtonAndLogo();
        } else {
            console.log("Not a book page. Amazon Book Metadata script will not run.");
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