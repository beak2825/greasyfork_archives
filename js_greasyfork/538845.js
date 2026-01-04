// ==UserScript==
// @name        Affiche Rottentomatoes meter sur WaWaCity
// @description Affiche les scores de Rotten Tomatoes sur wawacity pour les films et les séries
// @namespace   ConnorMcLeod
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @icon        https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/72x72/1F345.png
// @version     1.1
// @connect     www.rottentomatoes.com
// @connect     algolia.net
// @connect     flixster.com
// @match       https://www.rottentomatoes.com/
// @include     /^https:\/\/www\.wawacity\.[^\/]+\/\?p=film&id=.*/
// @include     /^https:\/\/www\.wawacity\.[^\/]+\/\?p=serie&id=.*/
// @downloadURL https://update.greasyfork.org/scripts/538845/Affiche%20Rottentomatoes%20meter%20sur%20WaWaCity.user.js
// @updateURL https://update.greasyfork.org/scripts/538845/Affiche%20Rottentomatoes%20meter%20sur%20WaWaCity.meta.js
// ==/UserScript==

/*
 * This script is a simplified version of the original "Show Rottentomatoes meter" 
 * by cuzi, modified to work on and only on WaWaCity website.
 * 
 * Original script: https://greasyfork.org/en/scripts/35443-show-rottentomatoes-meter
 * Modifications: Removed support for all sites except WaWaCity, added comments, integrated display
 */

/* global GM, $, unsafeWindow */

// Configuration constants
const SCRIPT_NAME = 'Show Rottentomatoes meter'
const BASE_URL = 'https://www.rottentomatoes.com'
const ALGOLIA_URL = 'https://{domain}-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent={agent}&x-algolia-api-key={sId}&x-algolia-application-id={aId}'
const ALGOLIA_AGENT = 'Algolia for JavaScript (4.12.0); Browser (lite)'
const FLIXSTER_EMS_URL = 'https://flixster.com/api/ems/v2/emsId/{emsId}'
const CACHE_EXPIRE_HOURS = 4

// Emoji constants for visual indicators
const EMOJI_TOMATO = String.fromCodePoint(0x1F345)
const EMOJI_GREEN_APPLE = String.fromCodePoint(0x1F34F)
const EMOJI_STRAWBERRY = String.fromCodePoint(0x1F353)
const EMOJI_POPCORN = '\uD83C\uDF7F'
const EMOJI_GREEN_SALAD = '\uD83E\uDD57'
const EMOJI_NAUSEATED = '\uD83E\uDD22'

// Current search context
const current = {
    type: null,
    query: null,
    year: null,
    fallbackTitles: null,
    fallbackIndex: 0
}

/**
 * Add CSS styles for integrated ratings display
 */
function addStyles() {
    if (document.getElementById('rt-wawacity-styles')) return;

    const style = document.createElement('style');
    style.id = 'rt-wawacity-styles';
    style.textContent = `
    .rt-ratings-container {
      margin: 5px 0;
    }
    
    .rt-ratings {
      display: flex;
      gap: 15px;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .rt-score-badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      color: white;
      text-decoration: none;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      cursor: pointer;
      min-width: 70px;
      justify-content: center;
    }
    
    .rt-score-badge:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      text-decoration: none;
      color: white;
    }
    
    .rt-critics.fresh {
      background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    }
    
    .rt-critics.certified-fresh {
      background: linear-gradient(45deg, #ff6b6b, #c0392b);
      position: relative;
    }
    
    .rt-critics.certified-fresh::before {
      content: "✓";
      position: absolute;
      top: -2px;
      right: 2px;
      font-size: 10px;
      color: #f1c40f;
    }
    
    .rt-critics.rotten {
      background: linear-gradient(45deg, #27ae60, #2ecc71);
    }
    
    .rt-critics.no-score {
      background: linear-gradient(45deg, #7f8c8d, #95a5a6);
    }
    
    .rt-audience.good {
      background: linear-gradient(45deg, #3498db, #2980b9);
    }
    
    .rt-audience.bad {
      background: linear-gradient(45deg, #e67e22, #d35400);
    }
    
    .rt-audience.no-score {
      background: linear-gradient(45deg, #7f8c8d, #95a5a6);
    }
    
    .rt-score-emoji {
      margin-right: 5px;
      font-size: 14px;
    }
    
    .rt-score-text {
      font-size: 12px;
      font-weight: 500;
      color: #2c3e50 !important;
    }
    
    .rt-link {
      color: #3498db !important;
      text-decoration: none;
      font-size: 11px;
      margin-left: 10px;
      opacity: 0.8;
      transition: opacity 0.3s ease;
    }
    
    .rt-link:hover {
      opacity: 1;
      text-decoration: none;
      color: #2980b9 !important;
    }
    
    @media (max-width: 768px) {
      .rt-ratings {
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
      }
      
      .rt-score-badge {
        min-width: 120px;
      }
    }
  `;
    document.head.appendChild(style);
}

/**
 * Calculate time elapsed since a given date
 * @param {Date} time - The time to compare with current time
 * @returns {string} Human readable time difference
 */
function minutesSince(time) {
    const seconds = ((new Date()).getTime() - time.getTime()) / 1000
    return seconds > 60 ? parseInt(seconds / 60) + ' min ago' : 'now'
}

/**
 * Update Algolia search credentials from RottenTomatoes website
 * This function extracts API keys needed for search functionality
 */
function updateAlgolia() {
    const algoliaSearch = {
        aId: null,
        sId: null
    }

    // Extract algolia credentials from RottenTomatoes global object
    if (unsafeWindow.RottenTomatoes &&
        'thirdParty' in unsafeWindow.RottenTomatoes &&
        'algoliaSearch' in unsafeWindow.RottenTomatoes.thirdParty) {
        if (typeof(unsafeWindow.RottenTomatoes.thirdParty.algoliaSearch.aId) === 'string' &&
            typeof(unsafeWindow.RottenTomatoes.thirdParty.algoliaSearch.sId) === 'string') {
            algoliaSearch.aId = unsafeWindow.RottenTomatoes.thirdParty.algoliaSearch.aId
            algoliaSearch.sId = unsafeWindow.RottenTomatoes.thirdParty.algoliaSearch.sId
        }
    }

    // Save credentials to storage
    if (algoliaSearch.aId) {
        GM.setValue('algoliaSearch', JSON.stringify(algoliaSearch))
    }
}

/**
 * Request additional movie/TV show data from Flixster EMS API
 * @param {string} emsId - The EMS ID for the content
 * @returns {Promise} Promise resolving to enhanced data
 */
function askFlixsterEMS(emsId) {
    return new Promise(function(resolve) {
        GM.getValue('flixsterEmsCache', '{}').then(function(s) {
            const flixsterEmsCache = JSON.parse(s)

            // Clean expired cache entries
            for (const prop in flixsterEmsCache) {
                const hoursDiff = ((new Date()).getTime() - (new Date(flixsterEmsCache[prop].time)).getTime()) / (1000 * 60 * 60)
                if (hoursDiff > CACHE_EXPIRE_HOURS) {
                    delete flixsterEmsCache[prop]
                }
            }

            // Return cached data if available
            if (emsId in flixsterEmsCache) {
                return resolve(flixsterEmsCache[emsId])
            }

            // Make API request for new data
            const url = FLIXSTER_EMS_URL.replace('{emsId}', encodeURIComponent(emsId))
            GM.xmlHttpRequest({
                method: 'GET',
                url,
                onload: function(response) {
                    let data = {}
                    try {
                        data = JSON.parse(response.responseText)
                    } catch (e) {
                        // Silent error handling
                    }

                    // Save to cache with timestamp
                    data.time = (new Date()).toJSON()
                    flixsterEmsCache[emsId] = data
                    GM.setValue('flixsterEmsCache', JSON.stringify(flixsterEmsCache))
                    resolve(data)
                },
                onerror: function(response) {
                    resolve(null)
                }
            })
        })
    })
}

/**
 * Enhance original data with additional Flixster information
 * @param {Object} orgData - Original movie/show data
 * @returns {Promise<Object>} Enhanced data object
 */
async function addFlixsterEMS(orgData) {
    const flixsterData = await askFlixsterEMS(orgData.emsId)
    if (!flixsterData || !('tomatometer' in flixsterData)) {
        return orgData
    }

    // Add certified fresh status
    if ('certifiedFresh' in flixsterData.tomatometer && flixsterData.tomatometer.certifiedFresh) {
        orgData.meterClass = 'certified_fresh'
    }

    // Add review counts and scores
    if ('numReviews' in flixsterData.tomatometer) {
        orgData.numReviews = flixsterData.tomatometer.numReviews
        if ('freshCount' in flixsterData.tomatometer) {
            orgData.freshCount = flixsterData.tomatometer.freshCount
        }
        if ('rottenCount' in flixsterData.tomatometer) {
            orgData.rottenCount = flixsterData.tomatometer.rottenCount
        }
    }

    // Add consensus and average score
    if ('consensus' in flixsterData.tomatometer) {
        orgData.consensus = flixsterData.tomatometer.consensus
    }
    if ('avgScore' in flixsterData.tomatometer) {
        orgData.avgScore = flixsterData.tomatometer.avgScore
    }

    // Add audience data
    if ('userRatingSummary' in flixsterData) {
        const userRating = flixsterData.userRatingSummary
        if ('scoresCount' in userRating) {
            orgData.audienceCount = userRating.scoresCount
        }
        if ('avgScore' in userRating) {
            orgData.audienceAvgScore = userRating.avgScore
        }
    }

    return orgData
}

/**
 * Calculate match quality between search query and result
 * @param {string} title - Movie/show title from search results
 * @param {number} year - Release year
 * @param {Set} currentSet - Set of words from current query
 * @returns {number} Match quality score (higher = better match)
 */
function matchQuality(title, year, currentSet) {
    // Exact matches get highest scores
    if (title === current.query && year === current.year) {
        return 104 + year
    }
    if (title.toLowerCase() === current.query.toLowerCase() && year === current.year) {
        return 103 + year
    }

    // Year-based matching
    if (title === current.query && current.year) {
        return 102 - Math.abs(year - current.year)
    }
    if (title.toLowerCase() === current.query.toLowerCase() && current.year) {
        return 101 - Math.abs(year - current.year)
    }

    // Partial matches
    if (title.startsWith(current.query)) {
        return 6
    }
    if (title.indexOf(current.query) !== -1) {
        return 4
    }
    if (title.toLowerCase().indexOf(current.query.toLowerCase()) !== -1) {
        return 2
    }

    // Word-based matching
    const titleSet = new Set(title.replace(/[^a-z ]/gi, ' ').split(' '))
    const intersectionSize = new Set([...titleSet].filter(x => currentSet.has(x))).size
    return intersectionSize - 20 + (year === current.year ? 1 : 0)
}

/**
 * Create modern badge for critics score
 * @param {Object} data - Movie/show rating data
 * @returns {string} HTML string for the critics badge
 */
function createCriticsBadge(data) {
    let emoji = EMOJI_TOMATO
    let score = '--'
    let className = 'no-score'
    let tooltip = 'Trouvé sur RT mais pas encore noté par les critiques'

    if (typeof data.meterScore === 'number') {
        score = data.meterScore + '%'

        if (data.meterClass === 'certified_fresh') {
            tooltip = `Certified Fresh : ${data.meterScore}% critiques`
        } else if (data.meterClass === 'fresh') {
            tooltip = `Fresh : ${data.meterScore}% critiques`
        } else if (data.meterClass === 'rotten') {
            tooltip = `Rotten : ${data.meterScore}% critiques`
        }

        // Add additional info to tooltip
        if (data.numReviews) {
            tooltip += ` (${data.numReviews} avis)`
        }
        // if (data.consensus) {
        // tooltip += `\n${data.consensus}`
        // }
        if (data.consensus) {
            const node = document.createElement('span')
            node.innerHTML = data.consensus
            tooltip += '\n' + node.textContent
        }

    }

    return `<span class="rt-score-badge rt-critics ${className}" title="${tooltip}">
    <span class="rt-score-emoji">${emoji}</span>
    <span class="rt-score-text">${score}</span>
  </span>`
}

/**
 * Create modern badge for audience score
 * @param {Object} data - Movie/show rating data
 * @returns {string} HTML string for the audience badge
 */
function createAudienceBadge(data) {
    if (!('audienceScore' in data) || data.audienceScore === null) {
        return `<span class="rt-score-badge rt-audience no-score" title="Trouvé sur RT mais pas encore noté par le public">
      <span class="rt-score-emoji">👥</span>
      <span class="rt-score-text">--</span>
    </span>`
    }

    let emoji = EMOJI_POPCORN
    let className = 'good'
    let tooltip = `Public : ${data.audienceScore}%`

    if (data.audienceClass === 'red_popcorn') {
        emoji = EMOJI_POPCORN
        className = 'good'
    } else if (data.audienceClass === 'green_popcorn') {
        emoji = EMOJI_GREEN_SALAD
        className = 'bad'
    }

    // Add additional info to tooltip
    if (data.audienceCount) {
        tooltip += ` (${data.audienceCount.toLocaleString()} votes)`
    }
    if (data.audienceAvgScore) {
        tooltip += `\nMoyenne : ${data.audienceAvgScore}/5 étoiles`
    }

    return `<span class="rt-score-badge rt-audience ${className}" title="${tooltip}">
    <span class="rt-score-emoji">${emoji}</span>
    <span class="rt-score-text">${data.audienceScore}%</span>
  </span>`
}

/**
 * Load movie/TV show ratings from Rotten Tomatoes API
 * @param {string} query - Search query (movie/show title)
 * @param {string} type - Content type ('movie' or 'tv')
 * @param {number} year - Release year (optional)
 */
async function loadMeter(query, type, year) {
    current.type = type
    current.query = query
    current.year = year

    // Get cached data
    const algoliaCache = JSON.parse(await GM.getValue('algoliaCache', '{}'))
    const algoliaSearch = JSON.parse(await GM.getValue('algoliaSearch', '{}'))

    // Clean expired cache entries
    for (const prop in algoliaCache) {
        const hoursDiff = ((new Date()).getTime() - (new Date(algoliaCache[prop].time)).getTime()) / (1000 * 60 * 60)
        if (hoursDiff > CACHE_EXPIRE_HOURS) {
            delete algoliaCache[prop]
        }
    }

    // Use cached response if available
    if (query in algoliaCache) {
        handleAlgoliaResponse(algoliaCache[query])
        return
    }

    // Check if API credentials are available
    if (!('aId' in algoliaSearch && 'sId' in algoliaSearch)) {
        integrateRatings('ALGOLIA_NOT_CONFIGURED', new Date())
        return
    }

    // Make API request
    const url = ALGOLIA_URL
        .replace('{domain}', algoliaSearch.aId.toLowerCase())
        .replace('{aId}', encodeURIComponent(algoliaSearch.aId))
        .replace('{sId}', encodeURIComponent(algoliaSearch.sId))
        .replace('{agent}', encodeURIComponent(ALGOLIA_AGENT))

    GM.xmlHttpRequest({
        method: 'POST',
        url,
        data: '{"requests":[{"indexName":"content_rt","query":"' + query.replace('"', '') + '","params":"hitsPerPage=20"}]}',
        onload: function(response) {
            // Cache the response
            response.time = (new Date()).toJSON()
            const newobj = {}
            for (const key in response) {
                newobj[key] = response[key]
            }
            newobj.responseText = response.responseText
            algoliaCache[query] = newobj
            GM.setValue('algoliaCache', JSON.stringify(algoliaCache))

            handleAlgoliaResponse(response)
        },
        onerror: function(response) {
            // Silent error handling
        }
    })
}

/**
 * Process the response from Algolia search API
 * @param {Object} response - API response object
 */
async function handleAlgoliaResponse(response) {
    const rawData = JSON.parse(response.responseText)

    // Filter results by content type
    const hits = rawData.results[0].hits.filter(hit => hit.type === current.type)

    // Convert API response to standardized format
    let results = []
    hits.forEach(function(hit) {
        const result = {
            name: hit.title,
            year: parseInt(hit.releaseYear),
            url: '/' + (current.type === 'tv' ? 'tv' : 'm') + '/' + ('vanity' in hit ? hit.vanity : hit.title.toLowerCase()),
            meterClass: null,
            meterScore: null,
            audienceClass: null,
            audienceScore: null,
            emsId: hit.emsId
        }

        // Extract Rotten Tomatoes ratings from API response
        if ('rottenTomatoes' in hit) {
            const rt = hit.rottenTomatoes
            if ('criticsIconUrl' in rt) {
                result.meterClass = rt.criticsIconUrl.match(/\/(\w+)\.png/)[1]
            }
            if ('criticsScore' in rt) {
                result.meterScore = rt.criticsScore
            }
            if ('audienceIconUrl' in rt) {
                result.audienceClass = rt.audienceIconUrl.match(/\/(\w+)\.png/)[1]
            }
            if ('audienceScore' in rt) {
                result.audienceScore = rt.audienceScore
            }
            if ('certifiedFresh' in rt && rt.certifiedFresh) {
                result.meterClass = 'certified_fresh'
            }
        }
        results.push(result)
    })

    // Calculate match quality for ALL results first
    const currentSet = new Set(current.query.replace(/[^a-z ]/gi, ' ').split(' '))
    results = results.map(result => ({
        ...result,
        matchQuality: matchQuality(result.name, result.year, currentSet)
    }))

    // Then sort by match quality
    results.sort(function(a, b) {
        return b.matchQuality - a.matchQuality
    })

    // Filter out results with very poor match quality
    const MIN_QUALITY_THRESHOLD = 50
    const goodResults = results.filter(result => result.matchQuality >= MIN_QUALITY_THRESHOLD)

    // Use filtered results instead of original results
    const finalResults = goodResults

    // If no results found
    if (finalResults.length === 0) {
        // Try fallback titles if available
        if (current.fallbackTitles && current.fallbackIndex < current.fallbackTitles.length - 1) {
            loadMeterWithFallback(current.fallbackTitles, current.type, current.year, current.fallbackIndex + 1)
            return
        } else {
            // No more fallbacks, show NOT_FOUND
            integrateRatings('NOT_FOUND', new Date(response.time))
            return
        }
    }

    // Enhance first result with additional data if it's highly rated
    if (finalResults.length > 0 && finalResults[0].meterScore && finalResults[0].meterScore >= 70) {
        finalResults[0] = await addFlixsterEMS(finalResults[0])
    }

    if (finalResults.length > 0) {
        integrateRatings(finalResults, new Date(response.time))
    } else {
        integrateRatings('NOT_FOUND', new Date(response.time))
    }
}

/**
 * Integrate the ratings directly into the WaWaCity page
 * @param {Array|string} arr - Array of movie/show data or error message
 * @param {Date} time - Timestamp of the data
 */
function integrateRatings(arr, time) {
    // Remove any existing ratings
    $('.rt-ratings-container').remove()

    // Find the detail list container
    const detailList = document.querySelector('.detail-list')
    if (!detailList) {
        return
    }

    // Handle configuration error
    if (arr === 'ALGOLIA_NOT_CONFIGURED') {
        const errorItem = document.createElement('li')
        errorItem.innerHTML = `
      <span>Rotten Tomatoes:</span>
      <b style="color: #e74c3c;">
        Configuration requise - 
        <a href="https://www.rottentomatoes.com/" target="_blank" style="color: #3498db;">
          Visitez RottenTomatoes.com
        </a>
      </b>
    `
        detailList.appendChild(errorItem)
        return
    }


    // Handle not found case
    if (arr === 'NOT_FOUND') {
        const contentType = current.type === 'movie' ? 'Film' : 'Série'
        const notFoundItem = document.createElement('li')
        notFoundItem.innerHTML = `
		<span>Rotten Tomatoes:</span>
		<b style="color: #95a5a6; font-style: italic;">
		  ${contentType} non trouvé${current.type === 'movie' ? '' : 'e'}
		</b>
	  `
        detailList.appendChild(notFoundItem)
        return
    }

    // Create the ratings display element
    const bestMatch = arr[0]
    const ratingsItem = document.createElement('li')
    ratingsItem.className = 'rt-ratings-container'

    const criticsBadge = createCriticsBadge(bestMatch)
    const audienceBadge = createAudienceBadge(bestMatch)
    const rtLink = `${BASE_URL}${bestMatch.url}`

    ratingsItem.innerHTML = `
    <span>Rotten Tomatoes:</span>
    <b>
      <div class="rt-ratings">
        ${criticsBadge}
        ${audienceBadge}
        <a href="${rtLink}" target="_blank" class="rt-link" title="Voir sur Rotten Tomatoes">
          ${bestMatch.name} (${bestMatch.year})
        </a>
      </div>
    </b>
  `

    // Insert after genres or before last item
    const genresItem = Array.from(detailList.children).find(li =>
        li.textContent.includes('Genre') || li.textContent.includes('Genres')
    )

    if (genresItem && genresItem.nextSibling) {
        detailList.insertBefore(ratingsItem, genresItem.nextSibling)
    } else {
        const lastItem = detailList.lastElementChild
        if (lastItem) {
            detailList.insertBefore(ratingsItem, lastItem)
        } else {
            detailList.appendChild(ratingsItem)
        }
    }
}

/**
 * Extract movie/TV show information from WaWaCity page with fallback titles
 * @returns {boolean} True if data was found and processed
 */
function extractWaWaCityData() {
    // Check if we're on a movie or TV show page
    const isTVShow = document.location.search.startsWith('?p=serie&id=')
    const isMovie = document.location.search.startsWith('?p=film&id=')

    if (!isTVShow && !isMovie) {
        return false
    }

    try {
        // Find the detail list container
        const detailList = document.querySelector('.detail-list')
        if (!detailList) {
            return false
        }

        const listItems = detailList.getElementsByTagName("li")
        let year = null
        let originalTitle = null

        // Extract original title and year from page details
        for (const item of listItems) {
            if (item.textContent.includes('Année:')) {
                const yearMatch = item.textContent.match(/Année:\s*(\d{4})/)
                if (yearMatch) {
                    year = parseInt(yearMatch[1])
                }
            } else if (item.textContent.includes('Titre original:')) {
                const titleMatch = item.textContent.match(/Titre original:\s*(.+)/)
                if (titleMatch) {
                    originalTitle = titleMatch[1].trim()
                }
            }
        }

        // Extract fallback title from page title block
        const titleBlocks = document.querySelectorAll('.wa-sub-block-title')
        let fallbackTitle = null
        for (const titleBlock of titleBlocks) {
            if (titleBlock.textContent.includes(originalTitle) ||
                titleBlock.closest('.wa-sub-block').querySelector('.detail-list')) {

                let blockText = titleBlock.textContent
                    .replace(/^\s*[A-Z]{2}\s+/, '') // Remove flag
                    .split(' - ')[0] // Take first part before any " - "
                    .replace(/\s*\[.*?\].*$/i, '') // Remove quality indicators in brackets
                    .trim()

                if (blockText && blockText !== originalTitle) {
                    fallbackTitle = blockText
                    break
                }
            }
        }

        // Extract fallback title from page title
        let pageTitle = null
        if (document.title) {
            const titleMatch = document.title.match(/Télécharger\s+(.+?)\s+gratuitement/)
            if (titleMatch) {
                let extractedTitle = titleMatch[1]
                    .split(' - ')[0] // Take first part before any " - "
                    .replace(/\s*\[.*?\].*$/i, '') // Remove quality indicators in brackets
                    .trim()

                if (extractedTitle && extractedTitle !== originalTitle && extractedTitle !== fallbackTitle) {
                    pageTitle = extractedTitle
                }
            }
        }

        // Try searches with different titles
        if (originalTitle || fallbackTitle || pageTitle) {
            const contentType = isTVShow ? 'tv' : 'movie'

            // Start with original title, then fallback titles
            const searchTitles = [originalTitle, fallbackTitle, pageTitle].filter(Boolean)

            loadMeterWithFallback(searchTitles, contentType, year, 0)
            return true
        }
    } catch (e) {
        // Silent error handling
    }

    return false
}

/**
 * Load meter with fallback titles if first search fails
 * @param {Array} titles - Array of titles to try
 * @param {string} type - Content type
 * @param {number} year - Release year
 * @param {number} index - Current title index
 */
async function loadMeterWithFallback(titles, type, year, index = 0) {
    if (index >= titles.length) {
        return
    }

    const title = titles[index]

    // Store fallback info for later use
    current.fallbackTitles = titles
    current.fallbackIndex = index

    await loadMeter(title, type, year)
}

/**
 * Main function to initialize the script
 */
function main() {
    // Add CSS styles
    addStyles()

    // Update Algolia credentials if on RottenTomatoes homepage
    if (document.location.href === 'https://www.rottentomatoes.com/') {
        updateAlgolia()
        return false
    }

    // Extract and process WaWaCity data
    if (document.location.hostname.includes('wawacity')) {
        return extractWaWaCityData()
    }

    return false
}

// Initialize script execution
(function() {
    const firstRunResult = main()
    let lastLocation = document.location.href
    let lastContent = document.body.innerText
    let retryCounter = 0

    /**
     * Handle page content changes and new page loads
     */
    function handlePageChange() {
        if (lastContent === document.body.innerText && retryCounter < 15) {
            // Content hasn't changed, retry after delay
            window.setTimeout(handlePageChange, 500)
            retryCounter++
        } else {
            // Content has changed, reset and try extraction
            lastContent = document.body.innerText
            retryCounter = 0
            const result = main()
            if (!result) {
                // No data found, try again later
                window.setTimeout(handlePageChange, 1000)
            }
        }
    }

    // Monitor for location changes (SPA navigation)
    window.setInterval(function() {
        if (document.location.href !== lastLocation) {
            lastLocation = document.location.href
            $('.rt-ratings-container').remove() // Remove existing ratings
            window.setTimeout(handlePageChange, 1000) // Wait for new content to load
        }
    }, 500)

    // Retry initial run if no data was found
    if (!firstRunResult) {
        window.setTimeout(main, 2000)
    }
})()