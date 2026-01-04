// ==UserScript==
// @name         OLX Detailed Ratings
// @name:ro      OLX Detalii Ratinguri
// @name:bg      OLX Подробни Оценки
// @name:ua      OLX Детальні Оцінки
// @name:pt      OLX Avaliações Detalhadas
// @name:pl      OLX Szczegółowe Oceny
// @description  Shows detailed ratings for: olx.ro, olx.bg, olx.ua, olx.pt, and olx.pl
// @description:ro Detalii ratinguri pentru: olx.ro, olx.bg, olx.ua, olx.pt și olx.pl
// @description:bg Подробни оценки за: olx.ro, olx.bg, olx.ua, olx.pt и olx.pl
// @description:ua Детальні оцінки для: olx.ro, olx.bg, olx.ua, olx.pt та olx.pl
// @description:pt Mostra avaliações detalhadas para: olx.ro, olx.bg, olx.ua, olx.pt e olx.pl
// @description:pl Pokazuje szczegółowe oceny dla: olx.ro, olx.bg, olx.ua, olx.pt i olx.pl
// @author       NWP
// @namespace    https://greasyfork.org/users/877912
// @version      0.2
// @license      MIT
// @match        *://www.olx.ro/*
// @match        *://www.olx.bg/*
// @match        *://www.olx.ua/*
// @match        *://www.olx.pt/*
// @match        *://www.olx.pl/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/503208/OLX%20Detailed%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/503208/OLX%20Detailed%20Ratings.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let debug = false;

    let globalScore = null;
    let maxScore = null;
    let ratingsCount = null;
    let user_score_data = null;
    let translationRatings = null;
    let lastCapturedTranslations = null;
    let lastCapturedConfig = null;
    let retriesCount = 0;
    const maxRetries = 50;

    // window.__PAGE_TRANSLATIONS is used for product page
    // window.__INIT_CONFIG__ is used for user page

    const isEmptyObject = (obj) => {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    };

    const log = (...args) => {
        if (debug) {
            console.log(...args);
        }
    };

    const captureData = () => {
        try {
            if (window.__PAGE_TRANSLATIONS__ && window.__PAGE_TRANSLATIONS__ !== lastCapturedTranslations) {
                lastCapturedTranslations = window.__PAGE_TRANSLATIONS__;
                log('Captured window.__PAGE_TRANSLATIONS__:', lastCapturedTranslations);
                handleWindowVariable();
            }

            if (window.__INIT_CONFIG__ && window.__INIT_CONFIG__ !== lastCapturedConfig) {
                lastCapturedConfig = window.__INIT_CONFIG__;
                log('Captured window.__INIT_CONFIG__:', lastCapturedConfig);
                handleWindowVariable();
            }

            if (!translationRatings || Object.keys(translationRatings).length === 0) {
                if (retriesCount < maxRetries) {
                    retriesCount++;
                    log(`Translation data not valid yet, retrying... (${retriesCount}/${maxRetries})`);
                    setTimeout(captureData, 100);
                } else {
                    console.error('Max retries reached. Translation data could not be retrieved.');
                }
            }
        } catch (error) {
            console.error('Error in captureData:', error);
        }
    };

    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
        try {
            const requestUrl = args[0];
            log('Making API request with URL:', requestUrl);

            if (requestUrl.startsWith("https://khonor.eu-sharedservices.olxcdn.com/api/olx/") &&
                requestUrl.includes("/score/rating")) {

                try {
                    const response = await originalFetch(...args);
                    log('API response received:', response);

                    const clonedResponse = response.clone();

                    clonedResponse.json().then((rating_data) => {
                        log('Rating data received:', rating_data);
                        user_score_data = rating_data.body[0];
                        globalScore = rating_data.body[0].data.score;
                        maxScore = rating_data.body[0].data.range.max;
                        ratingsCount = rating_data.body[0].data.ratings;
                        checkAndUpdateSentimentText();
                    }).catch((error) => {
                        console.error("Error reading response body:", error);
                    });

                    return response;
                } catch (error) {
                    console.error('Error during fetch interception:', error);
                    return originalFetch(...args);
                }
            } else {
                return originalFetch(...args);
            }
        } catch (error) {
            console.error('Error in custom fetch handling:', error);
            return originalFetch(...args);
        }
    };

    function waitForElement(selector, callback, timeout = 10000) {
        try {
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                try {
                    let element;

                    if (window.location.href.startsWith("https://www.olx.ro/d/oferta")) {
                        const elements = document.querySelectorAll(selector);
                        element = elements.length > 1 ? elements[1] : null;
                    } else if (window.location.href.startsWith("https://www.olx.pl/d/oferta")) {
                        const elements = document.querySelectorAll(selector);
                        element = elements.length > 1 ? elements[1] : null;
                    } else {
                        element = document.querySelector(selector);
                    }

                    if (element) {
                        clearInterval(checkInterval);
                        callback(element);
                    } else if (Date.now() - startTime > timeout) {
                        clearInterval(checkInterval);
                        console.error(`Timeout: Element ${selector} not found within ${timeout}ms`);
                    }
                } catch (error) {
                    console.error('Error in waitForElement interval check:', error);
                    clearInterval(checkInterval);
                }
            }, 100);
        } catch (error) {
            console.error('Error in waitForElement:', error);
        }
    }

    function checkAndUpdateSentimentText() {
        try {
            if (!translationRatings || Object.keys(translationRatings).length === 0) {
                if (retriesCount < maxRetries) {
                    retriesCount++;
                    log(`Translation data not ready yet. Deferring update... (${retriesCount}/${maxRetries})`);
                    setTimeout(checkAndUpdateSentimentText, 100);
                } else {
                    console.error('Max retries reached. Could not update sentiment text.');
                }
                return;
            }
            updateSentimentText();
        } catch (error) {
            console.error('Error in checkAndUpdateSentimentText:', error);
        }
    }

    function updateSentimentText() {
        try {
            const currentUrl = window.location.href;
            let sentimentSpanSelector;

            if (currentUrl.startsWith("https://www.olx.ro/d/oferta/")) {
                sentimentSpanSelector = 'div.css-1k5snlb';
            } else if (currentUrl.startsWith("https://www.olx.ro/oferte/")) {
                sentimentSpanSelector = 'div.css-1k5snlb';
            } else if (currentUrl.startsWith("https://www.olx.pl/d/oferta/")) {
                sentimentSpanSelector = 'p.css-1usyphe';
            } else if (currentUrl.startsWith("https://www.olx.pl/oferty/")) {
                sentimentSpanSelector = 'p.css-1usyphe, p.css-1omjrm';
            } else {
                sentimentSpanSelector = 'span[data-testid="sentiment-title"]';
            }

            waitForElement(sentimentSpanSelector, (sentimentSpan) => {
                try {
                    log('Found sentiment span:', sentimentSpan);

                    if (sentimentSpan && globalScore !== null && sentimentSpan.dataset.scoreUpdated !== "true") {
                        sentimentSpan.style.fontWeight = "bold";
                        sentimentSpan.style.color = "white";
                        sentimentSpan.dataset.scoreUpdated = "true";
                        const score = user_score_data.data.score;
                        const bucketSpec = user_score_data.bucketSpec;
                        const foundRange = bucketSpec.find((bucket) => score >= bucket.range.min && score <= bucket.range.max);
                        if (foundRange) {
                            const scoreContainer = document.createElement("div");
                            scoreContainer.style.display = "flex";
                            scoreContainer.style.flexDirection = "column";
                            scoreContainer.style.alignItems = "flex-start";
                            scoreContainer.style.marginTop = "0.3125rem";

                            if (currentUrl.startsWith("https://www.olx.pl/")) {
                                const oldRatingLabel = document.createElement("span");
                                oldRatingLabel.id = "old_rating";
                                oldRatingLabel.style.fontSize = "0.938rem";
                                oldRatingLabel.style.fontWeight = "bold";
                                oldRatingLabel.style.color = "white";
                                oldRatingLabel.textContent = `Stara ocena: ${translationRatings[user_score_data.data.label]}`;

                                scoreContainer.appendChild(oldRatingLabel);
                            }

                            const inlineContainer = document.createElement("div");
                            inlineContainer.style.display = "flex";
                            inlineContainer.style.alignItems = "center";

                            const fullRangeComparison = `[${foundRange.range.min} - ${score} - ${foundRange.range.max}]`;
                            const scoreText = document.createElement("span");
                            scoreText.id = "score";
                            scoreText.textContent = `[${globalScore}/${maxScore}] ${fullRangeComparison}`;
                            scoreText.style.fontSize = "0.875rem";
                            scoreText.style.fontWeight = "bold";
                            scoreText.style.color = "white";

                            inlineContainer.appendChild(scoreText);

                            appendSVG(inlineContainer);

                            scoreContainer.appendChild(inlineContainer);

                            const totalRatingsElement = document.querySelector('span[data-testid="total-ratings"]');

                            if (totalRatingsElement !== null) {
                                totalRatingsElement.style.fontSize = "0.875rem";
                                totalRatingsElement.style.fontWeight = "bold";
                                totalRatingsElement.style.color = "white";
                            } else {
                                const totalRatingsSpan = document.createElement("span");
                                totalRatingsSpan.id = "total_rating";
                                totalRatingsSpan.style.fontSize = "0.875rem";
                                totalRatingsSpan.style.fontWeight = "bold";
                                totalRatingsSpan.style.color = "white";

                                let language = document.querySelector('meta[http-equiv="content-language"]')?.getAttribute("content");
                                if (language == "pl") {
                                    totalRatingsSpan.textContent = `(${ratingsCount} ${ratingsCount == 1 ? "stara ocena" : "stare oceny"})`;
                                } else if (language == "ro"){
                                    totalRatingsSpan.textContent = `(${ratingsCount} ${ratingsCount == 1 ? "rating vechi" : "ratinguri vechi"})`;
                                } else {
                                    totalRatingsSpan.textContent = `(${ratingsCount} ${ratingsCount == 1 ? "rating" : "ratings"})`;
                                }

                                scoreContainer.appendChild(totalRatingsSpan);
                            }

                            sentimentSpan.after(scoreContainer);
                        }
                    } else {
                        log('Sentiment span not found, globalScore is null, or score already updated');
                    }
                } catch (error) {
                    console.error('Error in waitForElement callback (updateSentimentText):', error);
                }
            });
        } catch (error) {
            console.error('Error in updateSentimentText:', error);
        }
    }

    function appendSVG(inlineContainer) {
        try {
            const svgNamespace = "http://www.w3.org/2000/svg";
            const svgElement = document.createElementNS(svgNamespace, "svg");
            svgElement.setAttribute("width", "1.2rem");
            svgElement.setAttribute("height", "1.2rem");
            svgElement.setAttribute("viewBox", "0 0 24 24");
            svgElement.setAttribute("fill", "currentColor");
            svgElement.id = "rating_legend_tooltip";
            svgElement.style.marginTop = "0.05rem";
            svgElement.style.marginLeft = "0.3125rem";
            svgElement.style.cursor = "pointer";
            svgElement.style.transform = 'rotate(180deg)';

            const path = document.createElementNS(svgNamespace, "path");
            path.setAttribute("d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z");
            svgElement.appendChild(path);

            inlineContainer.appendChild(svgElement);

            const tooltip = document.createElement("div");
            tooltip.className = "tooltip";
            tooltip.style.position = "absolute";
            tooltip.style.display = "none";
            tooltip.style.border = "1px solid #ccc";
            tooltip.style.backgroundColor = "#f9f9f9";
            tooltip.style.padding = "0.625rem";
            tooltip.style.zIndex = "1000";
            document.body.appendChild(tooltip);

            let tooltipVisible = false;

            svgElement.addEventListener("click", (event) => {
                try {
                    event.stopPropagation();
                    tooltipVisible = !tooltipVisible;
                    if (tooltipVisible) {
                        showTooltip(event, tooltip, svgElement);
                    } else {
                        hideTooltip(tooltip);
                    }
                } catch (error) {
                    console.error('Error in SVG click event (appendSVG):', error);
                }
            });

            document.addEventListener("click", (event) => {
                try {
                    if (!svgElement.contains(event.target) && tooltipVisible) {
                        hideTooltip(tooltip);
                        tooltipVisible = false;
                    }
                } catch (error) {
                    console.error('Error in document click event (appendSVG):', error);
                }
            }, true);

            svgElement.style.fill = 'white';

            svgElement.addEventListener('click', function(event) {
                event.preventDefault();
            });

            svgElement.addEventListener('click', function(event) {
                event.stopPropagation();
            });
        } catch (error) {
            console.error('Error in appendSVG:', error);
        }
    }

    function showTooltip(event, tooltip, svgElement) {
        try {
            event.stopPropagation();
            updateTooltipContent(tooltip);
            const svgRect = svgElement.getBoundingClientRect();
            tooltip.style.left = `${svgRect.right + window.scrollX}px`;
            tooltip.style.top = `${svgRect.bottom + window.scrollY}px`;
            tooltip.style.display = "block";
        } catch (error) {
            console.error('Error in showTooltip:', error);
        }
    }

    function updateTooltipContent(tooltip) {
        try {
            let tooltipContent = "";

            if (!translationRatings || Object.keys(translationRatings).length === 0) {
                if (retriesCount < maxRetries) {
                    retriesCount++;
                    log(`Translation data not available, retrying... (${retriesCount}/${maxRetries})`);
                    setTimeout(() => {
                        updateTooltipContent(tooltip);
                    }, 100);
                } else {
                    console.error('Max retries reached. Could not update tooltip content.');
                }
                return;
            }

            user_score_data.bucketSpec.slice().reverse().forEach((bucket) => {
                if (bucket.bucketName !== "none" && bucket.range.min !== null && bucket.range.max !== null) {
                    tooltipContent += `<p style="margin-top: 0.3125rem; margin-bottom: 0.3125rem;"><strong>${translationRatings[bucket.bucketName] || bucket.bucketName}</strong>: ${bucket.range.min} - ${bucket.range.max}</p>`;
                }
            });

            tooltip.innerHTML = tooltipContent;
        } catch (error) {
            console.error('Error in updateTooltipContent:', error);
        }
    }

    function hideTooltip(tooltip) {
        try {
            tooltip.style.display = "none";
        } catch (error) {
            console.error('Error in hideTooltip:', error);
        }
    }

    const handleWindowVariable = () => {
        try {
            let translationsValid = false;

            if (window.__PAGE_TRANSLATIONS__ && !isEmptyObject(window.__PAGE_TRANSLATIONS__)) {
                const ratingDataNames = JSON.parse(window.__PAGE_TRANSLATIONS__);

                if (ratingDataNames.pageTranslations &&
                    ratingDataNames.pageTranslations.adview &&
                    ratingDataNames.pageTranslations.adview["srt.rating.superTitle"] &&
                    ratingDataNames.pageTranslations.adview["srt.rating.goodTitle"] &&
                    ratingDataNames.pageTranslations.adview["srt.rating.fairTitle"] &&
                    ratingDataNames.pageTranslations.adview["srt.rating.poorTitle"]) {

                    translationRatings = {
                        super: ratingDataNames.pageTranslations.adview["srt.rating.superTitle"],
                        good: ratingDataNames.pageTranslations.adview["srt.rating.goodTitle"],
                        fair: ratingDataNames.pageTranslations.adview["srt.rating.fairTitle"],
                        poor: ratingDataNames.pageTranslations.adview["srt.rating.poorTitle"],
                    };
                    log('%cwindow.__PAGE_TRANSLATIONS__ found and valid:', 'color: green;', translationRatings);
                    translationsValid = true;
                } else {
                    console.warn('window.__PAGE_TRANSLATIONS__ found but missing required translation keys.');
                }
            }

            if (!translationsValid && window.__INIT_CONFIG__) {
                const ratingDataNames = JSON.parse(window.__INIT_CONFIG__);
                const locale = ratingDataNames.appConfig.locale;
                translationRatings = {
                    super: ratingDataNames.language.messages[locale]["srt.rating.superTitle"],
                    good: ratingDataNames.language.messages[locale]["srt.rating.goodTitle"],
                    fair: ratingDataNames.language.messages[locale]["srt.rating.fairTitle"],
                    poor: ratingDataNames.language.messages[locale]["srt.rating.poorTitle"],
                };
                log('%cwindow.__INIT_CONFIG__ used as fallback:', 'color: red;', translationRatings);
            }

            checkAndUpdateSentimentText();
        } catch (error) {
            console.error('Error in handleWindowVariable:', error);
        }
    };

    const observer = new MutationObserver((mutationsList, observer) => {
        try {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    try {
                        captureData();
                    } catch (error) {
                        console.error('Error in captureData during MutationObserver:', error);
                    }
                }
            }

            if (translationRatings && Object.keys(translationRatings).length > 0) {
                log('Translation data captured. Disconnecting observer.');
                observer.disconnect();
            }
        } catch (error) {
            console.error('Error in MutationObserver callback:', error);
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true
    });

    document.addEventListener('DOMContentLoaded', () => {
        try {
            captureData();
        } catch (error) {
            console.error('Error on DOMContentLoaded:', error);
        }
    });

    log('OLX Rating Modifier Script Initialized');
})();