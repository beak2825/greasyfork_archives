// ==UserScript==
// @name        	Kamikaze' Script Utils
// @namespace    	https://greasyfork.org/users/928242
// @description  	Custom Functions for Kamikaze's Scripts
// @version    		1.1.13
// @author       	Kamikaze (https://github.com/Kamiikaze)
// @license     	MIT
// ==/UserScript==

/* jshint esversion: 11 */

/* global Toastify */

// https://stackoverflow.com/questions/61964265/getting-error-this-document-requires-trustedhtml-assignment-in-chrome
if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
    window.trustedTypes.createPolicy('default', {
        createHTML: string => string
        // Optional, only needed for script (url) tags
        //,createScriptURL: string => string
        //,createScript: string => string,
    });
}

/**
 * @description Custom Logger
 */
class Logger {

    /**
     * @param {string} prefix - Prefix for the log output
     * @param {number} logLevel - 0: disable, 1: info, 2: debug, 3: warn, 4: all
     */
    constructor(prefix, logLevel = 1) {
        this.prefix = prefix; // Name of Script
        this.logLevel = logLevel;
        this.defaultStyle = "background: #44adf3; color: #000; font-weight: bold; padding: 5px 15px; border-radius: 10px"
        this.resetStyle = "background: unset; color: unest"
        this.prefixStyle = this.setPrefixStyle(prefix);

        this.info(`Logger initialized with prefix "${prefix}" and logLevel ${logLevel}`)
    }

    /*
     * @param {number} logLevel - 0: disable, 1: info, 2: debug, 3: warn, 4: all
     */
    setLogLevel(logLevel) {
        this.logLevel = logLevel
    }

    setPrefixStyle(prefix) {
        switch (prefix) {
            case "sto":
                return "background: #000; color: #fff"
            default:
                return this.defaultStyle
        }
    }

    formattedOutput(...args) {
        const argsArray = Array.from(args).map(arg => {
            if (typeof arg === "object") return JSON.stringify(arg, null, 4)
            return arg
        })
        return `%c${this.prefix}%c ` + argsArray.join(", ")
    }

    info(...args) {
        if (this.logLevel >= 1) console.info(this.formattedOutput(...args), this.prefixStyle, this.resetStyle)
    }

    debug(...args) {
        if (this.logLevel >= 2) console.debug(this.formattedOutput(...args), this.prefixStyle, this.resetStyle)
    }

    warn(...args) {
        if (this.logLevel >= 3) console.warn(this.formattedOutput(...args), this.prefixStyle, this.resetStyle)
    }

    error(...args) {
        if (this.logLevel > 0) console.error(this.formattedOutput(...args), this.prefixStyle, this.resetStyle)
    }

}

/**
 * @param {string} text - Notification Text
 * @param {number} [duration=5000] - Duration for which the toast should be displayed.
 * -1 for permanent toast
 * @param {string} [type="default"] - Classname for Notification type
 * @description Sending Toast Notification
 */
function notify(text, duration = 5000, type = "default") {
    Toastify({
        text: text,
        duration: duration,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        offset: {
            x: 0, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: 70 // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        className: type,
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            borderRadius: "50px",
            boxShadow: "0px 0px 20px 0px #0f1620",
        }
    }).showToast();
}

/**
 * @param {string} css - CSS String
 * @param {boolean} important - Add !important to all rules
 * @description Adds CSS to the head of the document
 */
function addGlobalStyle(css, important = true) {
    let head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) return;
    style = document.createElement('style');
    (important) ? style.innerHTML = css.replace(/;/g, ' !important;') : style.innerHTML = css;
    head.appendChild(style);
}

/**
 * @param {string} selector - CSS Selector
 * @param {HTMLElement|Document} parent - Parent Element
 * @description Waits for an element to be present in the DOM
 * @returns {Element | null}
 */
function waitForElm(selector, parent = document) {
    return new Promise((resolve) => {
        if (parent.querySelector(selector)) {
            log.debug("Element found", selector)
            return resolve(parent.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (parent.querySelector(selector)) {
                log.debug("Element found", selector)
                resolve(parent.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            console.error("Element not found", selector)
            return resolve(null)
        }, 1000)
    });
}

/**
 * @description Get current Hostname, Season and Episode
 * @returns {{host: string, season: (string|number), episode: (string|number)}}
 */
function getStreamPageLocation() {
    const url = window.location;
    const host = url.host;
    const path = url.pathname.split("/").slice(3);

    return {
        host: host,
        season: path[1]?.split("-")[1] || 0,
        episode: path[2]?.split("-")[1] || 0,
    }
}

/**
 * @param {HTMLElement} seasonListEl - Season List Element
 * @description Check if the Stream has Movies
 * @returns {boolean} - True if the list contains a "Filme" entry
 */
function checkHasMovies(seasonListEl) {
    if (!seasonListEl) return false
    const seasonList = seasonListEl.children
    for (let i = 0; i < seasonList.length; i++)
        if (seasonList[i].textContent.trim() === "Filme") {
            log.debug("Found Movies")
            return true
        }
    return false
}

/**
 * @description Get Stream Details from the Stream Page
 * @returns {Promise<{seasonsCount: number, hasMovies: boolean, episodesCount: number, episodeTitle: {de: string, en: string}, title: string}>}
 */
async function getStreamDetails() {
    const titleEl = await waitForElm(".series-title > h1 > span")
    const seasonListEl = await waitForElm("#stream > ul:nth-child(1)")
    const episodeListEl = await waitForElm("#stream > ul:nth-child(4)")
    const episodeTitleEl = await waitForElm(".hosterSiteTitle h2")
    const episodeTitle = getEpisodeTitle(episodeTitleEl)

    const hasMovies = checkHasMovies(seasonListEl)

    const seasonsCount = seasonListEl?.childElementCount - 1 - (hasMovies ? 1 : 0) || 0
    const episodesCount = episodeListEl?.childElementCount - 1 || 0

    log.debug("Elements", titleEl, seasonListEl, episodeListEl)
    log.debug("Count", seasonsCount, episodesCount)

    return {
        title: titleEl?.textContent.trim() || "",
        seasonsCount: seasonsCount,
        episodesCount: episodesCount,
        episodeTitle: {
            de: episodeTitle.de,
            en: episodeTitle.en,
        },
        hasMovies: hasMovies,
    }
}

/**
 * @description Parsing title for both languages
 * @returns {{de: string, en: string}}
 */
function getEpisodeTitle(episodeTitleEl) {
    let titleDE = ""
    let titleEN = ""
    if (episodeTitleEl) {
        const [episodeTitleDE, episodeTitleEN] = episodeTitleEl.children
        titleDE = episodeTitleDE.textContent.trim()
        titleEN = episodeTitleEN?.textContent.trim() || ""
    }

    return {de: titleDE, en: titleEN}
}

/**
 * @description Return Stream Data from the Stream Page
 * @returns {Promise<{seasonsCount: number, currentSeason: number, host: string, hasMovies: boolean, episodesCount: number, title: string, currentEpisode: number}>}
 */
async function getStreamData() {
    const streamLocation = getStreamPageLocation()
    const streamDetails = await getStreamDetails()

    const data = {
        host: streamLocation.host,
        title: streamDetails.title,
        currentSeason: parseInt(streamLocation.season),
        seasonsCount: parseInt(streamDetails.seasonsCount),
        currentEpisode: parseInt(streamLocation.episode),
        episodesCount: parseInt(streamDetails.episodesCount),
        episodeTitle: streamDetails.episodeTitle,
        hasMovies: streamDetails.hasMovies,
    }

    log.debug("StreamData", data)

    return data
}
