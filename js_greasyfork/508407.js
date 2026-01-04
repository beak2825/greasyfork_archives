// ==UserScript==
// @name            IMDb with additional ratings
// @description     Adds additional ratings (TMDB, Douban, Metacritic, Rotten Tomatoes, MyAnimeList) to imdb.com for movies and series. These can be activated or deactivated individually in the extension's configuration menu, which is accessible via the Tampermonkey menu. The extension also allows you to copy movie metadata by simply clicking on the runtime below the movie title.
// @version         20251123
// @author          mykarean
// @icon            http://imdb.com/favicon.ico
// @match           https://*.imdb.com/title/*
// @match           https://*.imdb.com/*/title/*
// @connect         api.douban.com
// @connect         wikidata.org
// @connect         metacritic.com
// @connect         rottentomatoes.com
// @connect         jikan.moe
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @run-at          document-start
// @compatible      chrome
// @license         GPL3
// @namespace https://greasyfork.org/users/1367334
// @downloadURL https://update.greasyfork.org/scripts/508407/IMDb%20with%20additional%20ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/508407/IMDb%20with%20additional%20ratings.meta.js
// ==/UserScript==

"use strict";

// -----------------------------------------------------------------------------------------------------
// Config/Requirements
// -----------------------------------------------------------------------------------------------------

const ratingSourceOptions = ["TMDB", "Douban", "Metacritic", "Rotten Tomatoes", "My Anime List"];
const imdbId = window.location.pathname.match(/title\/(tt\d+)\//)[1];
const USER_AGENT = "Mozilla/5.0 (x64; rv) Gecko Firefox";
const undefinedValue = "X";
const initialValue = 0;
let local;

function getTitleElement() {
    return document.querySelector('[data-testid="hero__pageTitle"]');
}
function getMainTitle() {
    return getTitleElement()?.textContent;
}
function getOriginalTitle() {
    let originalTitle = document.querySelector('[data-testid="hero__pageTitle"] ~ div')?.textContent?.match(/^.*:\ (.*)/)?.[1];
    // Unicode normalisation and removal of diacritical characters to improve search on other pages
    return originalTitle?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function getAlsoKnownAsTitle() {
    let alsoKnownAsTitle = document.querySelector("section[data-testid=Details] li[data-testid=title-details-akas] > div");
    return alsoKnownAsTitle?.textContent;
}

GM_registerMenuCommand("Configuration", configurationMenu, "c");

// -----------------------------------------------------------------------------------------------------
// General Functions
// -----------------------------------------------------------------------------------------------------

async function addCss() {
    if (!document.getElementById("custom-css-style")) {
        GM_addStyle(`
            /* all Badges */
            .rating-bar__base-button {
                margin-right: 0 !important;
            }

            /* added Badges */
            span[data-testid="hero-rating-bar__aggregate-rating"],
            .rating-bar__base-button > .ipc-btn {
                padding: 2px 3px;
                border-radius: 5px !important;
            }
            span[data-testid=hero-rating-bar__aggregate-rating] {
                margin: 0 3px;
                background-color: rgba(255, 255, 255, 0.08);
            }
            /* format rating content */
            span[data-testid=hero-rating-bar__aggregate-rating] .ipc-btn__text > div > div {
                 align-items: center;
                 padding-right: 0;
            }
            span[data-testid=hero-rating-bar__aggregate-rating] div[data-testid=hero-rating-bar__aggregate-rating__score] > span:nth-child(1) {
                padding-right: 0;
            }
            [data-testid=hero-rating-bar__aggregate-rating] div[data-testid=hero-rating-bar__aggregate-rating__score] > span:nth-child(1) {
                letter-spacing: -0.4px;
            }
            /* remove /10 */
            span[data-testid=hero-rating-bar__aggregate-rating] div[data-testid=hero-rating-bar__aggregate-rating__score] > span:nth-child(2) {
                display: none;
            }
            /* vote count */
            span[data-testid=hero-rating-bar__aggregate-rating] .ipc-btn__text > div > div > div {
                letter-spacing: -0.2px;
            }

            /* IMDb Badges */
            [data-testid="hero-rating-bar__popularity"],
            [data-testid="hero-rating-bar__user-rating"] {
                padding-left: 0 !important;
                padding-right: 0 !important;
            }
            [data-testid="hero-rating-bar__popularity__score"] {
                letter-spacing: -0.3px !important;
            }

            /* Badge Header */
            .rating-bar__base-button > div {
                letter-spacing: unset;
            }
            span.rating-bar__base-button[myanimelist] > div,
            span.rating-bar__base-button[rottentomatoes] > div {
                letter-spacing: -0.5px;
            }
            
            /* for badges without rating data */
            .disabled-anchor {
                cursor: default !important;
            }
            .disabled-anchor:before {
                background: unset !important;
            }

            /* title if line break */
            span.hero__primary-text {
                line-height: 40px;
                display: block;
            }
        `).setAttribute("id", "custom-css-style");
    }
    const imdbRatingName = document.querySelector('div[data-testid="hero-rating-bar__aggregate-rating"] > div');
    if (imdbRatingName && imdbRatingName.textContent !== "IMDb") {
        imdbRatingName.textContent = "IMDb";
    }

    const authorsMode = await GM_getValue("authorsMode2", false);
    if (authorsMode) {
        if (!document.getElementById("authors-custom-css-style")) {
            GM_addStyle(`
                /* remove star */
                div[data-testid=hero-rating-bar__aggregate-rating] .ipc-btn__text > div > div:first-child {
                    display: none;
                }
                /* center rating */
                div[data-testid=hero-rating-bar__aggregate-rating] div[data-testid=hero-rating-bar__aggregate-rating__score] {
                    align-self: center;
                }
                /* remove /10 */
                div[data-testid=hero-rating-bar__aggregate-rating] div[data-testid=hero-rating-bar__aggregate-rating__score] > span:nth-child(2) {
                    display: none;
                }
            `).setAttribute("id", "authors-custom-css-style");
        }
    }
}

// create the initial rating template
function createRatingBadge(ratingSource) {
    const ratingElementImdb = document.querySelector('div[data-testid="hero-rating-bar__aggregate-rating"]');

    // ignore if the rating badge has already been created
    if (!ratingElementImdb || document.querySelector(`span.rating-bar__base-button[${ratingSource}]`)) return null;

    function updateRatingElement(element, rating, voteCount) {
        let ratingElement = element.querySelector("div[data-testid=hero-rating-bar__aggregate-rating__score]");
        if (ratingElement) {
            ratingElement.querySelector("span").innerText = rating;
            ratingElement.nextSibling.nextSibling.innerText = voteCount;
        }
    }

    let clonedRatingBadge = ratingElementImdb.cloneNode(true);
    clonedRatingBadge.setAttribute(ratingSource, "");
    clonedRatingBadge.childNodes[0].innerText = ratingSource;

    // disable link per default
    clonedRatingBadge.querySelector("a").removeAttribute("href");
    clonedRatingBadge.querySelector("a").classList.add("disabled-anchor");

    if (ratingSource === "Metacritic" || ratingSource === "RottenTomatoes") {
        const criticRatingElement = clonedRatingBadge.querySelector(
            "div[data-testid=hero-rating-bar__aggregate-rating__score]"
        )?.parentElement;

        if (!criticRatingElement) {
            console.error("Critic rating element not found");
            return;
        }

        // Critic rating: replace star svg element with critic rating by cloning the rating element
        let criticRating = clonedRatingBadge
            .querySelector("div[data-testid=hero-rating-bar__aggregate-rating__score]")
            .parentElement.cloneNode(true);
        criticRating.classList.add("critic-rating");
        clonedRatingBadge
            .querySelector("div[data-testid=hero-rating-bar__aggregate-rating__score]")
            .parentElement.classList.add("user-rating");

        //  critic rating
        updateRatingElement(criticRating, initialValue, initialValue);
        criticRating.title = "Critics Rating";
        criticRating.style.cssText = `
        background-color: rgba(255, 255, 255, 0.1);
        padding-left: 2px;
        padding-right: 2px;
        margin-right: 4px;
        border-radius: 5px;
        `;
        clonedRatingBadge.querySelector("a > span > div > div").outerHTML = criticRating.outerHTML;

        // user rating
        updateRatingElement(clonedRatingBadge.querySelector(".user-rating"), initialValue, initialValue);
        clonedRatingBadge.querySelector(".user-rating").title = "User Rating";
    } else {
        updateRatingElement(clonedRatingBadge, initialValue, initialValue);
        clonedRatingBadge.querySelector("a > span > div > div").remove();
    }

    // convert div to span element, otherwise it will be removed from IMDb scripts
    const ratingElement = document.createElement("span");
    // Transfer all attributes from the cloned div element to the new span element
    for (let attr of clonedRatingBadge.attributes) {
        ratingElement.setAttribute(attr.name, attr.value);
    }
    // transfer the content of the cloned IMDb rating element to the new span element
    ratingElement.innerHTML = clonedRatingBadge.innerHTML;

    ratingElementImdb.insertAdjacentElement("beforebegin", ratingElement);

    fitTitleToSingleLine();

    return ratingElement;
}

// update the rating template with actual data
function updateRatingBadge(newRatingBadge, ratingData) {
    if (!newRatingBadge || !ratingData) return;

    const selectors = {
        url: "a",
        generalRating: "div[data-testid=hero-rating-bar__aggregate-rating__score] > span",
        generalVoteCount: "div[data-testid=hero-rating-bar__aggregate-rating__score] + * + *",
        criticRating: ".critic-rating div[data-testid=hero-rating-bar__aggregate-rating__score] > span",
        criticVoteCount: ".critic-rating div[data-testid=hero-rating-bar__aggregate-rating__score] + * + *",
        userRating: ".user-rating div[data-testid=hero-rating-bar__aggregate-rating__score] > span",
        userVoteCount: ".user-rating div[data-testid=hero-rating-bar__aggregate-rating__score] + * + *",
    };

    function updateElement(selector, value, voteCount = 0) {
        const element = newRatingBadge.querySelector(selector);

        if (!voteCount) {
            element.textContent = value !== undefined && value !== 0 ? value : undefinedValue;
        } else {
            element.textContent = value !== undefined && value !== 0 ? value : undefinedValue.toLowerCase();
        }
    }

    newRatingBadge.querySelector(selectors.url).href = ratingData.url;
    newRatingBadge.querySelector(selectors.url).classList.remove("disabled-anchor");

    if (ratingData.criticRating !== undefined || ratingData.userRating !== undefined) {
        updateElement(selectors.criticRating, ratingData.criticRating);
        updateElement(selectors.userRating, ratingData.userRating);
        updateElement(selectors.criticVoteCount, ratingData.criticVoteCount, 1);
        updateElement(selectors.userVoteCount, ratingData.userVoteCount, 1);
    } else {
        updateElement(selectors.generalRating, ratingData.rating);
        updateElement(selectors.generalVoteCount, ratingData.voteCount, 1);
    }

    fitTitleToSingleLine();
}

// reduce titles font size to avoid line breaks
function fitTitleToSingleLine() {
    const element = document.querySelector('h1[data-testid="hero__pageTitle"] > span');
    let fontSize = parseFloat(window.getComputedStyle(element).fontSize);

    // if (element.offsetHeight < 68) {
    //     while (element.offsetHeight < 68 && fontSize < 48) {
    //         fontSize += 1;
    //         element.style.fontSize = fontSize + "px";
    //         if (element.offsetHeight >= 68) {
    //             fontSize -= 1;
    //             element.style.fontSize = fontSize + "px";
    //             break;
    //         }
    //     }
    // } else {
    while (element.offsetHeight >= 58 && fontSize >= 26) {
        fontSize -= 1;
        element.style.fontSize = fontSize + "px";
    }
    // }
}

// -----------------------------------------------------------------------------------------------------
// TMDB
// -----------------------------------------------------------------------------------------------------

let tmdbDataPromise = null;
async function getTmdbData() {
    const configured = await GM_getValue("TMDB", true);
    if (!configured) return;

    if (tmdbDataPromise) return tmdbDataPromise;

    if (!imdbId) {
        throw new Error("IMDb ID not found in URL.");
    }

    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzc1ZGIzOTYwYWVhMWI1OTA1NWMwZmM3ZDcwYjYwZiIsInN1YiI6IjYwYmNhZTk0NGE0YmY2MDA1OWJhNWE1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DU51juQWlAIIfZ2lK99b3zi-c5vgc4jAwVz5h2WjOP8",
        },
    };

    tmdbDataPromise = fetch(`https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id`, options)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const result = data.movie_results[0] || data.tv_results[0];
            if (!result) {
                throw new Error("No data found for the provided IMDb ID.");
            }

            console.log("TMDB: ", result);
            return {
                source: "TMDB",
                rating: (Math.round(result.vote_average * 10) / 10).toLocaleString(local, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                }),
                voteCount: result.vote_count?.toLocaleString(local),
                url: `https://www.themoviedb.org/${result.media_type}/${result.id}`,
            };
        })
        .catch((error) => {
            console.error("Error fetching TMDb data:", error);
            return Promise.resolve({
                source: "TMDB",
                rating: initialValue,
                voteCount: initialValue,
                url: null,
            });
        });

    return tmdbDataPromise;
}

async function addTmdbRatingBadge() {
    const configured = await GM_getValue("TMDB", true);
    if (!configured) return;

    const newRatingBadge = createRatingBadge("TMDB");

    // if the template for the rating badge was not created, it already exists
    if (!newRatingBadge) return;

    const ratingData = await getTmdbData();

    // Copy ratingData to avoid modifying the original object
    let finalRatingData = { ...ratingData };

    // Check if ratingData or ratingData.url is undefined and provide a default value
    if (!ratingData?.url) {
        const searchTitle = getOriginalTitle() ?? getMainTitle();
        const defaultUrl = `https://www.themoviedb.org/search?query=${searchTitle}`;
        finalRatingData.url = defaultUrl;
    }

    updateRatingBadge(newRatingBadge, finalRatingData);
}

// -----------------------------------------------------------------------------------------------------
// Douban
// -----------------------------------------------------------------------------------------------------

let doubanDataPromise = null;
async function getDoubanData() {
    const configured = await GM_getValue("Douban", true);
    if (!configured) return;

    if (doubanDataPromise) return doubanDataPromise;

    if (!imdbId) {
        throw new Error("IMDb ID not found in URL.");
    }

    const fetchFromDouban = (url, method = "GET", data = null) =>
        new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                data,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf8",
                },
                onload: (response) => {
                    if (response.status >= 200 && response.status < 400) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        console.error(`Error getting ${url}:`, response.status, response.statusText, response.responseText);
                        resolve(null);
                    }
                },
                onerror: (error) => {
                    console.error(`Error during GM_xmlhttpRequest to ${url}:`, error.statusText);
                    reject(error);
                },
            });
        });

    const getDoubanInfo = async (imdbId) => {
        const data = await fetchFromDouban(
            `https://api.douban.com/v2/movie/imdb/${imdbId}`,
            "POST",
            "apikey=0ac44ae016490db2204ce0a042db2916"
        );
        if (data && data.alt && data.alt !== "N/A") {
            const url = data.alt.replace("/movie/", "/subject/") + "/";
            return { url, rating: data.rating, title: data.title };
        }
    };

    doubanDataPromise = (async function () {
        try {
            const result = await getDoubanInfo(imdbId);
            if (!result) {
                throw new Error("No data found for the provided IMDb ID.");
            }

            let ratingRaw = result.rating.average;
            let rating =
                !isNaN(ratingRaw) && ratingRaw !== ""
                    ? Number(ratingRaw).toLocaleString(local, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
                    : 0;
            let voteCountRaw = result.rating.numRaters;
            let voteCount = !isNaN(voteCountRaw) && voteCountRaw !== 0 ? Number(voteCountRaw).toLocaleString(local) : 0;

            console.log("Douban: ", result);
            return {
                source: "Douban",
                rating: rating,
                voteCount: voteCount,
                url: result.url,
            };
        } catch (error) {
            console.error("Error fetching Douban data:", error);
            return Promise.resolve({
                source: "Douban",
                rating: initialValue,
                voteCount: initialValue,
                url: null,
            });
        }
    })();

    return doubanDataPromise;
}

async function addDoubanRatingBadge() {
    const configured = await GM_getValue("Douban", true);
    if (!configured) return;

    const newRatingBadge = createRatingBadge("Douban");

    // if the template for the rating badge was not created, it already exists
    if (!newRatingBadge) return;

    const ratingData = await getDoubanData();

    // Copy ratingData to avoid modifying the original object
    let finalRatingData = { ...ratingData };

    // Check if ratingData or ratingData.url is undefined and provide a default value
    if (!ratingData?.url) {
        const searchTitle = getOriginalTitle() ?? getMainTitle();
        const defaultUrl = `https://search.douban.com/movie/subject_search?search_text=${searchTitle}`;
        finalRatingData.url = defaultUrl;
    }

    updateRatingBadge(newRatingBadge, finalRatingData);
}

// -----------------------------------------------------------------------------------------------------
// Metacritic
// -----------------------------------------------------------------------------------------------------
// wikidata solution inspired by IMDb Scout Mod

let metacriticDataPromise = null;
async function getMetacriticData() {
    const configured = await GM_getValue("Metacritic", true);
    if (!configured) return;

    if (metacriticDataPromise) return metacriticDataPromise;

    if (!imdbId) {
        throw new Error("IMDb ID not found in URL.");
    }

    async function getMetacriticId() {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                timeout: 10000,
                headers: { "User-Agent": USER_AGENT },
                url: `https://query.wikidata.org/sparql?format=json&query=SELECT * WHERE {?s wdt:P345 "${imdbId}". OPTIONAL { ?s wdt:P1712 ?Metacritic_ID. }}`,
                onload: function (response) {
                    const result = JSON.parse(response.responseText);
                    const bindings = result.results.bindings[0];
                    const metacriticId = bindings && bindings.Metacritic_ID ? bindings.Metacritic_ID.value : "";
                    resolve(metacriticId);
                },
                onerror: function () {
                    console.error("getMetacriticId: Request Error.");
                    reject("Request Error");
                },
                onabort: function () {
                    console.error("getMetacriticId: Request Aborted.");
                    reject("Request Abort");
                },
                ontimeout: function () {
                    console.error("getMetacriticId: Request Timeout.");
                    reject("Request Timeout");
                },
            });
        });
    }

    function fetchMetacriticData(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: { "User-Agent": USER_AGENT },
                onload: function (response) {
                    const parser = new DOMParser();
                    const result = parser.parseFromString(response.responseText, "text/html");

                    const parseRating = (ratingElement, voteSelector, divideByTen = false) => {
                        if (!ratingElement) return { rating: 0, voteCount: 0 };

                        let ratingText = ratingElement.textContent.trim();
                        let rating = !isNaN(ratingText) ? Number(ratingText) : 0;

                        if (divideByTen) {
                            rating = rating / 10;
                        }

                        // no fractions for 10 and 0
                        if (rating !== 10 && rating !== 0) {
                            rating = rating.toLocaleString(local, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                        }

                        const voteCountText = result.querySelector(voteSelector)?.textContent;
                        const voteCount = voteCountText
                            ? Number(voteCountText.match(/\d{1,3}(?:,\d{3})*/)[0].replace(/,/g, "")).toLocaleString(local)
                            : 0;

                        return { rating, voteCount };
                    };

                    const criticRatingElement = result.querySelector(
                        ".c-siteReviewScore_background-critic_medium .c-siteReviewScore span"
                    );
                    const { rating: criticRating, voteCount: criticVoteCount } = parseRating(
                        criticRatingElement,
                        '.c-productScoreInfo_scoreContent a[href*="critic-reviews"] span',
                        true
                    );

                    const userRatingElement = result.querySelector(".c-siteReviewScore_background-user .c-siteReviewScore span");
                    const { rating: userRating, voteCount: userVoteCount } = parseRating(
                        userRatingElement,
                        '.c-productScoreInfo_scoreContent a[href*="user-reviews"] span',
                        false
                    );

                    console.log(
                        `Critic rating: ${criticRating}, User rating: ${userRating}, Critic vote count: ${criticVoteCount}, User vote count: ${userVoteCount}, URL: ${url}`
                    );

                    resolve({
                        source: "Metacritic",
                        criticRating,
                        userRating,
                        criticVoteCount,
                        userVoteCount,
                        url,
                    });
                },

                onerror: function () {
                    console.log("getMetacriticRatings: Request Error.");
                    reject("Request Error");
                },
                onabort: function () {
                    console.log("getMetacriticRatings: Request is aborted.");
                    reject("Request Aborted");
                },
                ontimeout: function () {
                    console.log("getMetacriticRatings: Request timed out.");
                    reject("Request Timed Out");
                },
            });
        });
    }

    metacriticDataPromise = (async () => {
        const metacriticId = await getMetacriticId();
        const url = encodeURI(`https://www.metacritic.com/${metacriticId}`);

        if (metacriticId !== "") {
            return fetchMetacriticData(url);
        } else {
            return Promise.resolve({
                source: "Metacritic",
                criticRating: initialValue,
                userRating: initialValue,
                criticVoteCount: initialValue,
                userVoteCount: initialValue,
                url: null,
            });
        }
    })();

    return metacriticDataPromise;
}

async function addMetacriticRatingBadge() {
    const configured = await GM_getValue("Metacritic", true);
    if (!configured) return;

    const newRatingBadge = createRatingBadge("Metacritic");

    // if the template for the rating badge was not created, it already exists
    if (!newRatingBadge) return;

    const ratingData = await getMetacriticData();

    // Copy ratingData to avoid modifying the original object
    let finalRatingData = { ...ratingData };

    // Check if ratingData or ratingData.url is undefined and provide a default value
    if (!ratingData?.url) {
        const searchTitle = getOriginalTitle() ?? getMainTitle();
        const defaultUrl = `https://www.metacritic.com/search/${searchTitle}`;
        finalRatingData.url = defaultUrl;
    }

    updateRatingBadge(newRatingBadge, finalRatingData);
}

// -----------------------------------------------------------------------------------------------------
// Rotten Tomatoes
// -----------------------------------------------------------------------------------------------------
// wikidata solution inspired by IMDb Scout Mod

let rottenTomatoesDataPromise = null;
async function getRottenTomatoesData() {
    const configured = await GM_getValue("RottenTomatoes", true);
    if (!configured) return;

    if (rottenTomatoesDataPromise) return rottenTomatoesDataPromise;

    if (!imdbId) {
        throw new Error("IMDb ID not found in URL.");
    }

    async function getRottenTomatoesId() {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                timeout: 10000,
                headers: { "User-Agent": USER_AGENT },
                url: `https://query.wikidata.org/sparql?format=json&query=SELECT * WHERE {?s wdt:P345 "${imdbId}". OPTIONAL { ?s wdt:P1258 ?RottenTomatoes_ID. }}`,
                onload: function (response) {
                    const result = JSON.parse(response.responseText);
                    const bindings = result.results.bindings[0];
                    const rottenTomatoesId = bindings && bindings.RottenTomatoes_ID ? bindings.RottenTomatoes_ID.value : "";
                    resolve(rottenTomatoesId);
                },
                onerror: function () {
                    console.error("getRottenTomatoesId: Request Error.");
                    reject("Request Error");
                },
                onabort: function () {
                    console.error("getRottenTomatoesId: Request Aborted.");
                    reject("Request Abort");
                },
                ontimeout: function () {
                    console.error("getRottenTomatoesId: Request Timeout.");
                    reject("Request Timeout");
                },
            });
        });
    }

    function fetchRottenTomatoesData(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: { "User-Agent": USER_AGENT },
                onload: function (response) {
                    const parser = new DOMParser();
                    const result = parser.parseFromString(response.responseText, "text/html");

                    const ratingDataElement = result.getElementById("media-scorecard-json");
                    const ratingData = JSON.parse(ratingDataElement.textContent);

                    const formatRating = (rawRating) => {
                        const rating = !isNaN(rawRating) ? Number(rawRating) / 10 : 0;
                        // no fractions for 10 and 0
                        return rating === 10 || rating === 0
                            ? rating
                            : rating.toLocaleString(local, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    };

                    const formatVoteCount = (rawCount) => {
                        if (!rawCount) return 0;
                        const formattedCount = Number(String(rawCount).replace(/[^\d]/g, "")).toLocaleString(local);
                        return String(rawCount).includes("+") ? `${formattedCount}+` : formattedCount;
                    };

                    const criticRating = formatRating(ratingData.criticsScore.score);
                    const userRating = formatRating(ratingData.audienceScore.score);
                    const criticVoteCount = criticRating !== 0 ? formatVoteCount(ratingData.criticsScore.ratingCount) : 0;
                    const userVoteCount = userRating !== 0 ? formatVoteCount(ratingData.audienceScore.bandedRatingCount) : 0;

                    console.log(
                        "Critic rating: " +
                            criticRating +
                            ", User rating: " +
                            userRating +
                            ", criticVoteCount: " +
                            criticVoteCount +
                            ", userVoteCount: " +
                            userVoteCount +
                            ", Url: " +
                            url
                    );

                    resolve({
                        source: "RottenTomatoes",
                        criticRating,
                        userRating,
                        criticVoteCount,
                        userVoteCount,
                        url,
                    });
                },
                onerror: function () {
                    console.log("getRottenTomatoesRatings: Request Error.");
                    reject("Request Error");
                },
                onabort: function () {
                    console.log("getRottenTomatoesRatings: Request is aborted.");
                    reject("Request Aborted");
                },
                ontimeout: function () {
                    console.log("getRottenTomatoesRatings: Request timed out.");
                    reject("Request Timed Out");
                },
            });
        });
    }

    rottenTomatoesDataPromise = (async () => {
        const rottenTomatoesId = await getRottenTomatoesId();
        const url = encodeURI(`https://www.rottentomatoes.com/${rottenTomatoesId}`);

        if (rottenTomatoesId !== "") {
            return fetchRottenTomatoesData(url);
        } else {
            return Promise.resolve({
                source: "RottenTomatoes",
                criticRating: initialValue,
                userRating: initialValue,
                criticVoteCount: initialValue,
                userVoteCount: initialValue,
                url: null,
            });
        }
    })();

    return rottenTomatoesDataPromise;
}

async function addRottenTomatoesRatingBadge() {
    const configured = await GM_getValue("RottenTomatoes", true);
    if (!configured) return;

    const newRatingBadge = createRatingBadge("RottenTomatoes");

    // if the template for the rating badge was not created, it already exists
    if (!newRatingBadge) return;

    const ratingData = await getRottenTomatoesData();

    // Copy ratingData to avoid modifying the original object
    let finalRatingData = { ...ratingData };

    // Check if ratingData or ratingData.url is undefined and provide a default value
    if (!ratingData?.url) {
        const searchTitle = getOriginalTitle() ?? getMainTitle();
        const defaultUrl = `https://www.rottentomatoes.com/search?search=${searchTitle}`;
        finalRatingData.url = defaultUrl;
    }

    updateRatingBadge(newRatingBadge, finalRatingData);
}

// -----------------------------------------------------------------------------------------------------
// MyAnimeList
// -----------------------------------------------------------------------------------------------------
// wikidata solution inspired by IMDb Scout Mod

let myAnimeListDataByImdbIdPromise = null;
async function getMyAnimeListDataByImdbId() {
    // to execute only once
    if (myAnimeListDataByImdbIdPromise) return myAnimeListDataByImdbIdPromise;

    // only if genre is anime
    const genreAnime = document.querySelector(".ipc-chip-list__scroller")?.textContent.includes("Anime");
    if (!genreAnime) return Promise.resolve(null);

    // only if enabled in settings
    const configured = await GM_getValue("MyAnimeList", true);
    if (!configured) return Promise.resolve(null);

    function getAnimeID() {
        const url = `https://query.wikidata.org/sparql?format=json&query=SELECT * WHERE {?s wdt:P345 "${imdbId}". OPTIONAL {?s wdt:P4086 ?MyAnimeList_ID.} OPTIONAL {?s wdt:P8729 ?AniList_ID.}}`;

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                timeout: 10000,
                url: url,
                headers: { "User-Agent": USER_AGENT },
                onload: function (response) {
                    const result = JSON.parse(response.responseText);
                    let myAnimeListId = "";
                    let aniListId = "";

                    if (result.results.bindings[0] !== undefined) {
                        if (result.results.bindings[0].MyAnimeList_ID !== undefined) {
                            myAnimeListId = result.results.bindings[0].MyAnimeList_ID.value;
                        } else {
                            console.log("getMyAnimeListDataByImdbId: No MyAnimeList_ID found on wikidata.org");
                        }
                        if (result.results.bindings[0].AniList_ID !== undefined) {
                            aniListId = result.results.bindings[0].AniList_ID.value;
                        }
                        // console.log("getMyAnimeListDataByImdbId: ", result.results);
                        resolve([myAnimeListId, aniListId]);
                    } else {
                        console.log("getMyAnimeListDataByImdbId: No results found on wikidata.org");
                        resolve([myAnimeListId, aniListId]);
                    }
                },
                onerror: function () {
                    console.log("getMyAnimeListDataByImdbId: Request Error.");
                    reject("Request Error");
                },
                onabort: function () {
                    console.log("getMyAnimeListDataByImdbId: Request Abort.");
                    reject("Request Abort");
                },
                ontimeout: function () {
                    console.log("getMyAnimeListDataByImdbId: Request Timeout.");
                    reject("Request Timeout");
                },
            });
        });
    }

    function fetchMyAnimeListData(myAnimeListId) {
        return new Promise((resolve, reject) => {
            const url = "https://api.jikan.moe/v4/anime/" + myAnimeListId;
            GM_xmlhttpRequest({
                method: "GET",
                timeout: 10000,
                url: url,
                headers: { "User-Agent": USER_AGENT },
                onload: function (response) {
                    if (response.status === 200) {
                        const result = JSON.parse(response.responseText);
                        const rating = result.data.score;
                        if (!isNaN(rating) && rating > 0) {
                            console.log("getMyAnimeListDataByImdbId: ", result.data.mal_id, result);

                            resolve({
                                source: "MyAnimeList",
                                rating: Number(rating).toLocaleString(local, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
                                voteCount: result.data.scored_by?.toLocaleString(local),
                                url: result.data.url,
                            });
                        } else {
                            reject("Invalid rating");
                        }
                    } else {
                        console.log("MyAnimeList: HTTP Error: " + response.status);
                        reject("HTTP Error");
                    }
                },
                onerror: function () {
                    console.log("MyAnimeList: Request Error.");
                    reject("Request Error");
                },
                onabort: function () {
                    console.log("MyAnimeList: Request is aborted.");
                    reject("Request Aborted");
                },
                ontimeout: function () {
                    console.log("MyAnimeList: Request timed out.");
                    reject("Request Timeout");
                },
            });
        });
    }

    myAnimeListDataByImdbIdPromise = (async () => {
        const id = await getAnimeID();
        const myAnimeListId = id[0];
        const aniListId = id[1];

        if (myAnimeListId !== "") {
            return fetchMyAnimeListData(myAnimeListId);
        } else {
            return null;
        }
    })();

    return myAnimeListDataByImdbIdPromise;
}

let myAnimeListDataByTitlePromise = null;
async function getMyAnimeListDataByTitle() {
    // to execute only once
    if (myAnimeListDataByTitlePromise) return myAnimeListDataByTitlePromise;

    const titleElement = getTitleElement();
    if (!titleElement) return Promise.resolve(null);

    // only if genre is anime
    const genreAnime = document.querySelector(".ipc-chip-list__scroller")?.textContent.includes("Anime");
    if (!genreAnime) return Promise.resolve(null);

    const mainTitle = getMainTitle();
    const originalTitle = getOriginalTitle();

    // get the year of release
    const metaData = titleElement?.parentElement?.querySelector("ul");
    const metaItems = metaData?.querySelectorAll("li");
    // If the text content type is an integer, it is a tv show, otherwise it is a movie.
    const type = isNaN(metaItems?.[0]?.textContent) ? "tv" : "movie";
    const yearIndex = type === "tv" ? 1 : 0;
    const yearText = metaItems?.[yearIndex]?.textContent;
    // Extract the first number up to the non-number sign and convert it into a integer (2018-2020)
    const year = parseInt(yearText);

    async function fetchAllPages(searchTitle) {
        let currentPage = 1;
        let allResults = [];
        const maxRetries = 3;
        const retryDelay = 1000;
        const normalizeSearchString = (string) => {
            return (
                string
                    .replace(/Ô/g, "oo")
                    .replace(/ô/g, "ou")
                    .toLowerCase()
                    .replace(/û/g, "uu")
                    // Removes all characters that are not letters, numbers or spaces
                    .replace(/[^a-z0-9\s]/g, " ")
                    // Replaces several consecutive spaces with a single space
                    .replace(/\s+/g, " ")
                    .trim()
            );
        };

        async function fetchWithRetry(url, retries = 0) {
            try {
                const response = await fetch(url);
                if (response.status === 429) {
                    if (retries < maxRetries) {
                        console.log(`Rate limited. Retrying in ${retryDelay / 1000} seconds...`);
                        await new Promise((resolve) => setTimeout(resolve, retryDelay));
                        return fetchWithRetry(url, retries + 1);
                    } else {
                        throw new Error("Max retries reached. Please try again later.");
                    }
                }
                return response;
            } catch (error) {
                console.error("Fetch error:", error);
                throw error;
            }
        }

        while (true) {
            try {
                const response = await fetchWithRetry(
                    `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchTitle)}&type=${type}&page=${currentPage}`
                );
                const data = await response.json();
                allResults = allResults.concat(data.data);
                if (!data.pagination.has_next_page) break;
                currentPage++;
            } catch (error) {
                console.error("Error fetching data:", error);
                break;
            }
        }

        // for debug information
        // console.log(searchTitle, year, type, allResults);

        const result = allResults.find((anime, index) => {
            const normalizedSearchTitle = normalizeSearchString(searchTitle);
            const normalizedAnimeTitle = normalizeSearchString(anime.title);
            console.log(`Normalized Search Title: "${normalizedSearchTitle}"`);
            console.log(`Normalized Anime Title: "${normalizedAnimeTitle}"`);

            const titleMatch = normalizedAnimeTitle.includes(normalizedSearchTitle);
            const yearMatch = anime.aired.prop.from.year === year;
            if (titleMatch && yearMatch) {
                console.log(`✅ Title and year match for "${anime.title}"`);
                return true;
            }

            if (!titleMatch && anime.title_english) {
                const normalizedEnglishTitle = normalizeSearchString(anime.title_english);
                const englishTitleMatch = normalizedEnglishTitle.includes(normalizedSearchTitle);
                console.log(`✅ English title match for "${anime.title_english}": ${englishTitleMatch}`);

                if (englishTitleMatch && yearMatch) {
                    console.log(`🎉 English title and year match for "${anime.title_english}"`);
                    return true;
                }
            }

            if (!titleMatch && anime.title_synonyms && anime.title_synonyms.length > 0) {
                console.log(`Checking synonyms for anime[${index}] - ${anime.title}, Synonyms: ${anime.title_synonyms}`);

                const synonymMatch = anime.title_synonyms.some((synonym) =>
                    normalizeSearchString(synonym).includes(normalizedSearchTitle)
                );

                console.log(`✅ Synonym match for anime[${index}] - ${anime.title}: ${synonymMatch}`);

                if (synonymMatch && yearMatch) {
                    console.log(`🎉 Synonym and year match for "${anime.title}"`);
                    return true;
                }
            }
            console.log(`❌ No match found for "${anime.title}"`);

            return false;
        });
        return result;
    }

    async function getAnimeData() {
        try {
            let result = await fetchAllPages(mainTitle);

            if (!result && originalTitle) {
                console.log(
                    `getMyAnimeListDataByTitle: No results found for "${mainTitle}", retrying with originalTitle "${originalTitle}"`
                );
                result = await fetchAllPages(originalTitle);
            }

            if (result) {
                console.log("getMyAnimeListDataByTitle: ", result);
                return result;
            } else {
                console.log("No results found for either title.");
                return null;
            }
        } catch (error) {
            console.error("Error retrieving data:", error);
            return null;
        }
    }

    myAnimeListDataByTitlePromise = (async () => {
        const anime = await getAnimeData();

        if (anime) {
            const data = {
                source: "MyAnimeList",
                rating: Number(anime.score).toLocaleString(local, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
                voteCount: anime.scored_by?.toLocaleString(local),
                url: anime.url,
            };

            // console.log("myAnimeListDataByTitlePromise: ", data);

            return data;
        } else {
            console.log("No anime data found.");
            return Promise.resolve({
                source: "MyAnimeList",
                rating: initialValue,
                voteCount: initialValue,
                url: null,
            });
        }
    })();

    return myAnimeListDataByTitlePromise;
}

async function addMyAnimeListRatingBadge() {
    // only if genre is anime
    const genreAnime = document.querySelector(".ipc-chip-list__scroller")?.textContent.includes("Anime");
    if (!genreAnime) return;

    // only if enabled in settings
    const configured = await GM_getValue("MyAnimeList", true);
    if (!configured) return;

    const newRatingBadge = createRatingBadge("MyAnimeList");

    // if the template for the rating badge was not created, it already exists
    if (!newRatingBadge) return;

    let ratingData = await getMyAnimeListDataByImdbId();
    if (ratingData === null) {
        ratingData = await getMyAnimeListDataByTitle();
    }

    // Copy ratingData to avoid modifying the original object
    let finalRatingData = { ...ratingData };

    // Check if ratingData or ratingData.url is undefined and provide a default value
    if (!ratingData?.url) {
        const searchTitle = getOriginalTitle() ?? getMainTitle();
        const defaultUrl = `https://myanimelist.net/anime.php?q=${searchTitle}`;
        finalRatingData.url = defaultUrl;
    }

    updateRatingBadge(newRatingBadge, finalRatingData);
}

// -----------------------------------------------------------------------------------------------------

let metadataAsText = "";
function collectMetadataForClipboard() {
    let title = document.querySelector("span.hero__primary-text")?.textContent;
    let genres = document.querySelector("div[data-testid='interests'] div.ipc-chip-list__scroller")?.childNodes;
    let additionalMetadataRuntime = document
        .querySelector('[data-testid="hero__pageTitle"]')
        ?.parentElement?.querySelector("ul li:last-of-type");
    let additionalMetadata = document.querySelector('[data-testid="hero__pageTitle"]')?.parentElement?.querySelectorAll("ul > li");

    // if click listener does not exist
    if (!document.querySelector(".collectMetadataForClipboardListener") && title) {
        if (genres && additionalMetadata) {
            if (metadataAsText === "") {
                // add title
                metadataAsText += title + " | ";
                // collect additional metadata
                for (let element of additionalMetadata) metadataAsText += element.textContent + " | ";
                // collect genres
                let iteration = genres?.length;
                for (let genre of genres) {
                    metadataAsText += genre.textContent;

                    // append "," as long as not last iteration
                    if (--iteration) metadataAsText += ", ";
                }
            }

            additionalMetadataRuntime.style.cursor = "pointer";
            additionalMetadataRuntime.addEventListener("click", function () {
                console.log("test");
                navigator.clipboard.writeText(metadataAsText);
            });

            // to know if click listener is still there
            additionalMetadataRuntime.classList.add("collectMetadataForClipboardListener");
        }
    }
}

// Configuration Modal
function configurationMenu() {
    GM_addStyle(`
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.6) !important;
        z-index: 9998;
        transition: background-color 0.5s ease;
    }
    
    .modal {
        font-family: var(--ipt-font-family);
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    .modal-title {
        margin-bottom: 20px;
        font-size: 16px;
        font-weight: bold;
    }
    
    .checkbox-label {
        display: block;
        margin-bottom: 10px;
    }
    
    .close-button {
        display: block;
        margin: 20px auto 0;
    }
    `);

    // Darken background
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
    setTimeout(() => {
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    }, 50);

    // Create modal
    const modal = document.createElement("div");
    modal.className = "modal";
    setTimeout(() => {
        modal.style.opacity = "1";
    }, 50);

    // Title of the modal
    const title = document.createElement("h3");
    title.innerText = "Which ratings should be displayed?";
    title.className = "modal-title";
    modal.appendChild(title);

    // Add checkboxes
    ratingSourceOptions.forEach((ratingSource) => {
        const label = document.createElement("label");
        label.className = "checkbox-label";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = GM_getValue(ratingSource.replace(/\s/g, ""), true);

        checkbox.addEventListener("change", () => {
            GM_setValue(ratingSource.replace(/\s/g, ""), checkbox.checked);
            if (!checkbox.checked) {
                document.querySelector(`span.rating-bar__base-button[${ratingSource.replace(/\s/g, "")}]`).remove();
            } else {
                // trigger observer to add new badges
                const tempElement = document.createElement("div");
                document.body.appendChild(tempElement);
                document.body.removeChild(tempElement);
            }
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${ratingSource}`));
        modal.appendChild(label);
    });

    // Add button to close
    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.className =
        "close-button ipc-btn ipc-btn--half-padding ipc-btn--default-height ipc-btn--core-accent1 ipc-btn--theme-baseAlt ";

    closeButton.addEventListener("click", () => {
        document.body.removeChild(overlay);
        document.body.removeChild(modal);
    });

    modal.appendChild(closeButton);

    // Add modal and overlay to the DOM
    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // Close modal on click outside
    overlay.addEventListener("click", () => {
        document.body.removeChild(overlay);
        document.body.removeChild(modal);
    });
}

// add and keep elements in header container
async function main() {
    // ignore episode view
    if (!document.title.includes('"')) {
        addCss();
        // getTmdbData();
        // getDoubanData();
        // getMetacriticData();
        // getMyAnimeListDataByImdbId();
        // getRottenTomatoesData();

        const observer = new MutationObserver(async () => {
            // ignore video games
            const metadataFirstElement = document
                .querySelector('[data-testid="hero__pageTitle"]')
                ?.parentElement?.querySelector("ul > li");
            if (
                metadataFirstElement &&
                !metadataFirstElement.textContent.toLowerCase().includes("game") &&
                !metadataFirstElement.textContent.includes("Jeu vidéo") &&
                !metadataFirstElement.textContent.includes("Videospiel") &&
                !metadataFirstElement.textContent.includes("Videogioco") &&
                !metadataFirstElement.textContent.includes("Videojuego") &&
                !metadataFirstElement.textContent.includes("वीडियो गेम")
            ) {
                // make sure CSS is not removed from DOM
                addCss();
                await addMyAnimeListRatingBadge();
                await addRottenTomatoesRatingBadge();
                await addMetacriticRatingBadge();
                await addDoubanRatingBadge();
                await addTmdbRatingBadge();

                collectMetadataForClipboard();
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
}

// -----------------------------------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------------------------------

main();
// GM_setValue("authorsMode", true);
