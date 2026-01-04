// ==UserScript==
// @name        Show Rottentomatoes meter
// @description Show Rotten Tomatoes score on imdb.com, metacritic.com, letterboxd.com, BoxOfficeMojo, serienjunkies.de, Amazon, Google Play, allmovie.com, Wikipedia, themoviedb.org, movies.com, tvmaze.com, tvguide.com, followshows.com, thetvdb.com, tvnfo.com, save.tv
// @namespace   cuzi
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @icon        https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/72x72/1F345.png
// @version     48
// @connect     www.rottentomatoes.com
// @connect     algolia.net
// @connect     flixster.com
// @connect     imdb.com
// @match       https://www.rottentomatoes.com/
// @match       https://play.google.com/store/movies/details/*
// @match       https://www.amazon.ca/*
// @match       https://www.amazon.co.jp/*
// @match       https://www.amazon.co.uk/*
// @match       https://smile.amazon.co.uk/*
// @match       https://www.amazon.com.au/*
// @match       https://www.amazon.com.mx/*
// @match       https://www.amazon.com/*
// @match       https://smile.amazon.com/*
// @match       https://www.amazon.de/*
// @match       https://smile.amazon.de/*
// @match       https://www.amazon.es/*
// @match       https://www.amazon.fr/*
// @match       https://www.amazon.in/*
// @match       https://www.amazon.it/*
// @match       https://www.imdb.com/title/*
// @match       https://www.serienjunkies.de/*
// @match       http://www.serienjunkies.de/*
// @match       https://www.boxofficemojo.com/movies/*
// @match       https://www.boxofficemojo.com/release/*
// @match       https://www.allmovie.com/movie/*
// @match       https://en.wikipedia.org/*
// @match       https://www.fandango.com/*
// @match       https://www.themoviedb.org/movie/*
// @match       https://www.themoviedb.org/tv/*
// @match       https://letterboxd.com/film/*
// @match       https://letterboxd.com/film/*/image*
// @match       https://www.tvmaze.com/shows/*
// @match       https://www.tvguide.com/tvshows/*
// @match       https://followshows.com/show/*
// @match       https://thetvdb.com/series/*
// @match       https://thetvdb.com/movies/*
// @match       https://tvnfo.com/tv/*
// @match       https://www.metacritic.com/movie/*
// @match       https://www.metacritic.com/tv/*
// @match       https://www.nme.com/reviews/*
// @match       https://itunes.apple.com/*
// @match       https://epguides.com/*
// @match       https://www.epguides.com/*
// @match       https://www.cc.com/*
// @match       https://www.amc.com/*
// @match       https://www.amcplus.com/*
// @match       https://rlsbb.ru/*/
// @match       https://www.sho.com/*
// @match       https://www.gog.com/*
// @match       https://psa.wf/*
// @match       https://www.save.tv/*
// @match       https://www.wikiwand.com/*
// @match       https://trakt.tv/*
// @downloadURL https://update.greasyfork.org/scripts/35443/Show%20Rottentomatoes%20meter.user.js
// @updateURL https://update.greasyfork.org/scripts/35443/Show%20Rottentomatoes%20meter.meta.js
// ==/UserScript==

/* global GM, $, unsafeWindow */
/* jshint asi: true, esversion: 8 */

const scriptName = 'Show Rottentomatoes meter'
const baseURL = 'https://www.rottentomatoes.com'
const baseURLOpenTab = baseURL + '/search/?search={query}'
const algoliaURL = 'https://{domain}-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent={agent}&x-algolia-api-key={sId}&x-algolia-application-id={aId}'
const algoliaAgent = 'Algolia for JavaScript (4.12.0); Browser (lite)'
const flixsterEMSURL = 'https://flixster.com/api/ems/v2/emsId/{emsId}'
const cacheExpireAfterHours = 4
const emojiTomato = String.fromCodePoint(0x1F345)
const emojiGreenApple = String.fromCodePoint(0x1F34F)
const emojiStrawberry = String.fromCodePoint(0x1F353)

const emojiPopcorn = '\uD83C\uDF7F'
const emojiGreenSalad = '\uD83E\uDD57'
const emojiNauseated = '\uD83E\uDD22'

// Detect dark theme of darkreader.org extension or normal css dark theme from browser
const darkTheme = ('darkreaderScheme' in document.documentElement.dataset && document.documentElement.dataset.darkreaderScheme) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)

function minutesSince (time) {
  const seconds = ((new Date()).getTime() - time.getTime()) / 1000
  return seconds > 60 ? parseInt(seconds / 60) + ' min ago' : 'now'
}

function intersection (setA, setB) {
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
  const _intersection = new Set()
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem)
    }
  }
  return _intersection
}

function asyncRequest (data) { // No cache (unlike in the Metacritic userscript)
  return new Promise(function (resolve, reject) {
    const defaultHeaders = {
      Referer: data.url,
      'User-Agent': navigator.userAgent
    }
    const defaultData = {
      method: 'GET',
      onload: (response) => resolve(response),
      onerror: (response) => reject(response)
    }
    if ('headers' in data) {
      data.headers = Object.assign(defaultHeaders, data.headers)
    } else {
      data.headers = defaultHeaders
    }
    data = Object.assign(defaultData, data)
    console.debug(`${scriptName}: GM.xmlHttpRequest`, data)
    GM.xmlHttpRequest(data)
  })
}

const parseLDJSONCache = {}
function parseLDJSON (keys, condition) {
  if (document.querySelector('script[type="application/ld+json"]')) {
    const xmlEntitiesElement = document.createElement('div')
    const xmlEntitiesPattern = /&(?:#x[a-f0-9]+|#[0-9]+|[a-z0-9]+);?/ig
    const xmlEntities = function (s) {
      s = s.replace(xmlEntitiesPattern, (m) => {
        xmlEntitiesElement.innerHTML = m
        return xmlEntitiesElement.textContent
      })
      return s
    }
    const decodeXmlEntities = function (jsonObj) {
      // Traverse through object, decoding all strings
      if (jsonObj !== null && typeof jsonObj === 'object') {
        Object.entries(jsonObj).forEach(([key, value]) => {
          // key is either an array index or object key
          jsonObj[key] = decodeXmlEntities(value)
        })
      } else if (typeof jsonObj === 'string') {
        return xmlEntities(jsonObj)
      }
      return jsonObj
    }

    const data = []
    const scripts = document.querySelectorAll('script[type="application/ld+json"]')
    for (let i = 0; i < scripts.length; i++) {
      let jsonld
      if (scripts[i].innerText in parseLDJSONCache) {
        jsonld = parseLDJSONCache[scripts[i].innerText]
      } else {
        try {
          jsonld = JSON.parse(scripts[i].innerText)
          parseLDJSONCache[scripts[i].innerText] = jsonld
        } catch (e) {
          parseLDJSONCache[scripts[i].innerText] = null
          continue
        }
      }
      if (jsonld) {
        if (Array.isArray(jsonld)) {
          data.push(...jsonld)
        } else {
          data.push(jsonld)
        }
      }
    }
    for (let i = 0; i < data.length; i++) {
      try {
        if (data[i] && data[i] && (typeof condition !== 'function' || condition(data[i]))) {
          if (Array.isArray(keys)) {
            const r = []
            for (let j = 0; j < keys.length; j++) {
              r.push(data[i][keys[j]])
            }
            return decodeXmlEntities(r)
          } else if (keys) {
            return decodeXmlEntities(data[i][keys])
          } else if (typeof condition === 'function') {
            return decodeXmlEntities(data[i]) // Return whole object
          }
        }
      } catch (e) {
        continue
      }
    }
    return decodeXmlEntities(data)
  }
  return null
}

function askFlixsterEMS (emsId) {
  return new Promise(function flixsterEMSRequest (resolve) {
    GM.getValue('flixsterEmsCache', '{}').then(function (s) {
      const flixsterEmsCache = JSON.parse(s)

      // Delete algoliaCached values, that are expired
      for (const prop in flixsterEmsCache) {
        if ((new Date()).getTime() - (new Date(flixsterEmsCache[prop].time)).getTime() > cacheExpireAfterHours * 60 * 60 * 1000) {
          delete flixsterEmsCache[prop]
        }
      }

      // Check cache or request new content
      if (emsId in flixsterEmsCache) {
        return resolve(flixsterEmsCache[emsId])
      }
      const url = flixsterEMSURL.replace('{emsId}', encodeURIComponent(emsId))
      GM.xmlHttpRequest({
        method: 'GET',
        url,
        onload: function (response) {
          let data = null
          try {
            data = JSON.parse(response.responseText)
          } catch (e) {
            console.error(`${scriptName}: flixster ems JSON Error\nURL: ${url}`)
            console.error(e)
            data = {}
          }

          // Save to flixsterEmsCache
          data.time = (new Date()).toJSON()

          flixsterEmsCache[emsId] = data

          GM.setValue('flixsterEmsCache', JSON.stringify(flixsterEmsCache))

          resolve(data)
        },
        onerror: function (response) {
          console.error(`${scriptName}: flixster ems GM.xmlHttpRequest Error: ${response.status}\nURL: ${url}\nResponse:\n${response.responseText}`)
          resolve(null)
        }
      })
    })
  })
}
async function addFlixsterEMS (orgData) {
  const flixsterData = await askFlixsterEMS(orgData.emsId)
  if (!flixsterData || !('tomatometer' in flixsterData)) {
    return orgData
  }
  if ('certifiedFresh' in flixsterData.tomatometer && flixsterData.tomatometer.certifiedFresh) {
    orgData.meterClass = 'certified_fresh'
  }
  if ('numReviews' in flixsterData.tomatometer && flixsterData.tomatometer.numReviews) {
    orgData.numReviews = flixsterData.tomatometer.numReviews
    if ('freshCount' in flixsterData.tomatometer && flixsterData.tomatometer.freshCount != null) {
      orgData.freshCount = flixsterData.tomatometer.freshCount
    }
    if ('rottenCount' in flixsterData.tomatometer && flixsterData.tomatometer.rottenCount != null) {
      orgData.rottenCount = flixsterData.tomatometer.rottenCount
    }
  }
  if ('consensus' in flixsterData.tomatometer && flixsterData.tomatometer.consensus) {
    orgData.consensus = flixsterData.tomatometer.consensus
  }
  if ('avgScore' in flixsterData.tomatometer && flixsterData.tomatometer.avgScore != null) {
    orgData.avgScore = flixsterData.tomatometer.avgScore
  }
  if ('userRatingSummary' in flixsterData) {
    if ('scoresCount' in flixsterData.userRatingSummary && flixsterData.userRatingSummary.scoresCount) {
      orgData.audienceCount = flixsterData.userRatingSummary.scoresCount
    } else if ('dtlScoreCount' in flixsterData.userRatingSummary && flixsterData.userRatingSummary.dtlScoreCount) {
      orgData.audienceCount = flixsterData.userRatingSummary.dtlScoreCount
    }
    if ('wtsCount' in flixsterData.userRatingSummary && flixsterData.userRatingSummary.wtsCount) {
      orgData.audienceWantToSee = flixsterData.userRatingSummary.wtsCount
    } else if ('dtlWtsCount' in flixsterData.userRatingSummary && flixsterData.userRatingSummary.dtlWtsCount) {
      orgData.audienceWantToSee = flixsterData.userRatingSummary.dtlWtsCount
    }
    if ('reviewCount' in flixsterData.userRatingSummary && flixsterData.userRatingSummary.reviewCount) {
      orgData.audienceReviewCount = flixsterData.userRatingSummary.reviewCount
    }
    if ('avgScore' in flixsterData.userRatingSummary && flixsterData.userRatingSummary.avgScore) {
      orgData.audienceAvgScore = flixsterData.userRatingSummary.avgScore
    }
  }
  return orgData
}

function updateAlgolia () {
  // Get algolia data from https://www.rottentomatoes.com/
  const algoliaSearch = { aId: null, sId: null }
  if (unsafeWindow.RottenTomatoes && 'thirdParty' in unsafeWindow.RottenTomatoes && 'algoliaSearch' in unsafeWindow.RottenTomatoes.thirdParty) {
    if (typeof (unsafeWindow.RottenTomatoes.thirdParty.algoliaSearch.aId) === 'string' && typeof (unsafeWindow.RottenTomatoes.thirdParty.algoliaSearch.sId) === 'string') {
      algoliaSearch.aId = unsafeWindow.RottenTomatoes.thirdParty.algoliaSearch.aId // x-algolia-application-id
      algoliaSearch.sId = unsafeWindow.RottenTomatoes.thirdParty.algoliaSearch.sId // x-algolia-api-key
    }
  }
  if (algoliaSearch.aId) {
    GM.setValue('algoliaSearch', JSON.stringify(algoliaSearch)).then(function () {
      console.debug(`${scriptName}: Updated algoliaSearch: ${JSON.stringify(algoliaSearch)}`)
    })
  } else {
    console.debug(`${scriptName}: algoliaSearch.aId is ${algoliaSearch.aId}`)
  }
}

function meterBar (data) {
  // Create the "progress" bar with the meter score
  let barColor = 'grey'
  let bgColor = darkTheme ? '#3e3e3e' : '#ECE4B5'
  let color = 'black'
  let width = 0
  let textInside = ''
  let textAfter = ''

  if (data.meterClass === 'certified_fresh') {
    barColor = '#C91B22'
    color = 'yellow'
    textInside = emojiStrawberry + ' ' + data.meterScore.toLocaleString() + '%'
    width = data.meterScore || 0
  } else if (data.meterClass === 'fresh') {
    barColor = '#C91B22'
    color = 'white'
    textInside = emojiTomato + ' ' + data.meterScore.toLocaleString() + '%'
    width = data.meterScore || 0
  } else if (data.meterClass === 'rotten') {
    color = 'gray'
    barColor = '#94B13C'
    if (data.meterScore && data.meterScore > 30) {
      textAfter = '<span style="font-size: 15px;padding-top: 2px;display: inline-block;">' + data.meterScore.toLocaleString() + '%</span>'
      textInside = '<span style="font-size:13px">' + emojiGreenApple + '</span>'
    } else {
      textAfter = data.meterScore.toLocaleString() + '% <span style="font-size:13px">' + emojiGreenApple + '</span>'
    }
    width = data.meterScore || 0
  } else {
    bgColor = barColor = '#787878'
    color = 'silver'
    textInside = 'N/A'
    width = 100
  }

  let title = 'Critics ' + (typeof data.meterScore === 'number' ? data.meterScore.toLocaleString() : 'N/A') + '% ' + data.meterClass
  let avg = ''
  if ('avgScore' in data) {
    const node = document.createElement('span')
    node.innerHTML = data.consensus
    title += '\nAverage score: ' + data.avgScore.toLocaleString() + ' / 10'
    avg = '<span style="font-weight:bolder">' + data.avgScore.toLocaleString() + '</span>/10'
  }
  if ('numReviews' in data && typeof data.numReviews === 'number') {
    title += ' from ' + data.numReviews.toLocaleString() + ' reviews'
    if ('freshCount' in data && data.numReviews > 0) {
      const p = parseInt(100 * parseFloat(data.freshCount) / parseFloat(data.numReviews))
      title += '\n' + data.freshCount.toLocaleString() + '/' + data.numReviews.toLocaleString() + ' ' + p + '% fresh reviews'
    }
    if ('rottenCount' in data) {
      const p = parseInt(100 * parseFloat(data.rottenCount) / parseFloat(data.numReviews))
      title += '\n' + data.rottenCount.toLocaleString() + '/' + data.numReviews.toLocaleString() + ' ' + p + '% rotten reviews'
    }
  }
  if ('consensus' in data) {
    const node = document.createElement('span')
    node.innerHTML = data.consensus
    title += '\n' + node.textContent
  }
  return '<div title="' + title + '" style="cursor:help;">' +
      '<div style="float:left; margin-top:1px; width:100px; overflow: hidden;height: 20px;background-color: ' + bgColor + ';color: ' + color + ';text-align:center; border-radius: 4px;box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">' +
        '<div style="width:' + width + '%; background-color: ' + barColor + '; color: ' + color + '; font-size:14px; font-weight:bold; text-align:center; float:left; height: 100%;line-height: 20px;box-shadow: inset 0 -1px 0 rgba(0,0,0,0.15);transition: width 0.6s ease;">' +
          textInside +
        '</div>' +
        textAfter +
      '</div>' +
      '<div style="float:left; padding: 3px 0px 0px 3px;">' + avg + '</div>' +
      '<div style="clear:left;"></div>' +
    '</div>'
}
function audienceBar (data) {
  // Create the "progress" bar with the audience score
  if (!('audienceScore' in data) || data.audienceScore === null) {
    return ''
  }

  let barColor = 'grey'
  let bgColor = darkTheme ? '#3e3e3e' : '#ECE4B5'
  let color = 'black'
  let width = 0
  let textInside = ''
  let textAfter = ''
  let avg = ''

  if (data.audienceClass === 'red_popcorn') {
    barColor = '#C91B22'
    color = data.audienceScore > 94 ? 'yellow' : 'white'
    textInside = emojiPopcorn + ' ' + data.audienceScore.toLocaleString() + '%'
    width = data.audienceScore
  } else if (data.audienceClass === 'green_popcorn') {
    color = 'gray'
    barColor = '#94B13C'
    if (data.audienceScore > 30) {
      textAfter = '<span style="font-size: 15px;padding-top: 2px;display: inline-block;">' + data.audienceScore.toLocaleString() + '%</span>'
      textInside = '<span style="font-size:13px">' + emojiGreenSalad + '</span>'
    } else {
      textAfter = data.audienceScore.toLocaleString() + '% <span style="font-size:13px">' + emojiNauseated + '</span>'
    }
    width = data.audienceScore
  } else {
    bgColor = barColor = '#787878'
    color = 'silver'
    textInside = 'N/A'
    width = 100
  }

  let title = 'Audience ' + (typeof data.audienceScore === 'number' ? data.audienceScore.toLocaleString() : 'N/A') + '% ' + data.audienceClass
  const titleLine2 = []
  if ('audienceCount' in data && typeof data.audienceCount === 'number') {
    titleLine2.push(data.audienceCount.toLocaleString() + ' Votes')
  }
  if ('audienceReviewCount' in data) {
    titleLine2.push(data.audienceReviewCount.toLocaleString() + ' Reviews')
  }
  if ('audienceAvgScore' in data && typeof data.audienceAvgScore === 'number') {
    titleLine2.push('Average score: ' + data.audienceAvgScore.toLocaleString() + ' / 5 stars')
    avg = '<span style="font-weight:bolder">' + data.audienceAvgScore.toLocaleString() + '</span>/5'
  }
  if ('audienceWantToSee' in data && typeof data.audienceWantToSee === 'number') {
    titleLine2.push(data.audienceWantToSee.toLocaleString() + ' want to see')
  }

  title = title + (titleLine2 ? ('\n' + titleLine2.join('\n')) : '')
  return '<div title="' + title + '" style="cursor:help;">' +
      '<div style="float:left; margin-top:1px; width:100px; overflow: hidden;height: 20px;background-color: ' + bgColor + ';color: ' + color + ';text-align:center; border-radius: 4px;box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">' +
        '<div style="width:' + width + '%; background-color: ' + barColor + '; color: ' + color + '; font-size:14px; font-weight:bold; text-align:center; float:left; height: 100%;line-height: 20px;box-shadow: inset 0 -1px 0 rgba(0,0,0,0.15);transition: width 0.6s ease;">' +
          textInside +
        '</div>' +
        textAfter +
      '</div>' +
      '<div style="float:left; padding: 3px 0px 0px 3px;">' + avg + '</div>' +
      '<div style="clear:left;"></div>' +
    '</div>'
}

const current = {
  type: null,
  query: null,
  year: null
}

async function loadMeter (query, type, year) {
  // Load data from rotten tomatoes search API or from cache

  current.type = type
  current.query = query
  current.year = year

  const algoliaCache = JSON.parse(await GM.getValue('algoliaCache', '{}'))

  // Delete algoliaCached values, that are expired
  for (const prop in algoliaCache) {
    if ((new Date()).getTime() - (new Date(algoliaCache[prop].time)).getTime() > cacheExpireAfterHours * 60 * 60 * 1000) {
      delete algoliaCache[prop]
    }
  }

  const algoliaSearch = JSON.parse(await GM.getValue('algoliaSearch', '{}'))

  // Check cache or request new content
  if (query in algoliaCache) {
    // Use cached response
    console.debug(`${scriptName}: Use cached algolia response`)
    handleAlgoliaResponse(algoliaCache[query])
  } else if ('aId' in algoliaSearch && 'sId' in algoliaSearch) {
    // Use algolia.net API
    const url = algoliaURL.replace('{domain}', algoliaSearch.aId.toLowerCase()).replace('{aId}', encodeURIComponent(algoliaSearch.aId)).replace('{sId}', encodeURIComponent(algoliaSearch.sId)).replace('{agent}', encodeURIComponent(algoliaAgent))
    GM.xmlHttpRequest({
      method: 'POST',
      url,
      data: '{"requests":[{"indexName":"content_rt","query":"' + query.replace('"', '') + '","params":"filters=isEmsSearchable%20%3D%201&hitsPerPage=20"}]}',
      onload: function (response) {
        // Save to algoliaCache
        response.time = (new Date()).toJSON()

        // Chrome fix: Otherwise JSON.stringify(cache) omits responseText
        const newobj = {}
        for (const key in response) {
          newobj[key] = response[key]
        }
        newobj.responseText = response.responseText

        algoliaCache[query] = newobj

        GM.setValue('algoliaCache', JSON.stringify(algoliaCache))

        handleAlgoliaResponse(response)
      },
      onerror: function (response) {
        console.error(`${scriptName}: algoliaSearch GM.xmlHttpRequest Error: ${response.status}\nURL: ${url}\nResponse:\n${response.responseText}`)
      }
    })
  } else {
    console.error(`${scriptName}: algoliaSearch not configured`)
    window.alert(scriptName + ' userscript\n\nYou need to visit www.rottentomatoes.com at least once before the script can work.\n\nThe script needs to read some API keys from the website.')
    showMeter('ALGOLIA_NOT_CONFIGURED', new Date())
  }
}

function matchQuality (title, year, currentSet) {
  if (title === current.query && year === current.year) {
    return 104 + year
  }
  if (title.toLowerCase() === current.query.toLowerCase() && year === current.year) {
    return 103 + year
  }
  if (title === current.query && current.year) {
    return 102 - Math.abs(year - current.year)
  }
  if (title.toLowerCase() === current.query.toLowerCase() && current.year) {
    return 101 - Math.abs(year - current.year)
  }
  if (title.replace(/\(.+\)/, '').trim() === current.query && current.year) {
    return 100 - Math.abs(year - current.year)
  }
  if (title === current.query) {
    return 8
  }
  if (title.replace(/\(.+\)/, '').trim() === current.query) {
    return 7
  }
  if (title.startsWith(current.query)) {
    return 6
  }
  if (current.query.indexOf(title) !== -1) {
    return 5
  }
  if (title.indexOf(current.query) !== -1) {
    return 4
  }
  if (current.query.toLowerCase().indexOf(title.toLowerCase()) !== -1) {
    return 3
  }
  if (title.toLowerCase().indexOf(current.query.toLowerCase()) !== -1) {
    return 2
  }
  const titleSet = new Set(title.replace(/[^a-z ]/gi, ' ').split(' '))
  const score = intersection(titleSet, currentSet).size - 20
  if (year === current.year) {
    return score + 1
  }
  return score
}

async function handleAlgoliaResponse (response) {
  // Handle GM.xmlHttpRequest response
  const rawData = JSON.parse(response.responseText)

  // Filter according to type
  const hits = rawData.results[0].hits.filter(hit => hit.type === current.type)

  // Change data structure
  const arr = []

  hits.forEach(function (hit) {
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
    if ('rottenTomatoes' in hit) {
      if ('criticsIconUrl' in hit.rottenTomatoes) {
        result.meterClass = hit.rottenTomatoes.criticsIconUrl.match(/\/(\w+)\.png/)[1]
      }
      if ('criticsScore' in hit.rottenTomatoes) {
        result.meterScore = hit.rottenTomatoes.criticsScore
      }
      if ('audienceIconUrl' in hit.rottenTomatoes) {
        result.audienceClass = hit.rottenTomatoes.audienceIconUrl.match(/\/(\w+)\.png/)[1]
      }
      if ('audienceScore' in hit.rottenTomatoes) {
        result.audienceScore = hit.rottenTomatoes.audienceScore
      }
      if ('certifiedFresh' in hit.rottenTomatoes && hit.rottenTomatoes.certifiedFresh) {
        result.meterClass = 'certified_fresh'
      }
    }
    arr.push(result)
  })

  // Sort results by closest match
  const currentSet = new Set(current.query.replace(/[^a-z ]/gi, ' ').split(' '))
  arr.sort(function (a, b) {
    if (!Object.prototype.hasOwnProperty.call(a, 'matchQuality')) {
      a.matchQuality = matchQuality(a.name, a.year, currentSet)
    }
    if (!Object.prototype.hasOwnProperty.call(b, 'matchQuality')) {
      b.matchQuality = matchQuality(b.name, b.year, currentSet)
    }

    return b.matchQuality - a.matchQuality
  })

  if (arr.length > 0 && arr[0].meterScore) {
    // Get more details for first result
    arr[0] = await addFlixsterEMS(arr[0])
  }

  if (arr) {
    showMeter(arr, new Date(response.time))
  } else {
    console.debug(`${scriptName}: No results for ${current.query}`)
  }
}

function showMeter (arr, time) {
  // Show a small box in the right lower corner
  $('#mcdiv321rotten').remove()
  let main, div
  div = main = $('<div id="mcdiv321rotten"></div>').appendTo(document.body)
  div.css({
    position: 'fixed',
    bottom: 0,
    right: 0,
    minWidth: 100,
    maxWidth: 400,
    maxHeight: '95%',
    overflow: 'auto',
    backgroundColor: darkTheme ? '#262626' : 'white',
    border: darkTheme ? '2px solid #444' : '2px solid #bbb',
    borderRadius: ' 6px',
    boxShadow: '0 0 3px 3px rgba(100, 100, 100, 0.2)',
    color: darkTheme ? 'white' : 'black',
    padding: ' 3px',
    zIndex: '5010001',
    fontFamily: 'Helvetica,Arial,sans-serif'
  })

  const CSS = `<style>
#mcdiv321rotten {
    transition:bottom 0.7s, height 0.5s;
}
</style>`

  $(CSS).appendTo(div)

  if (arr === 'ALGOLIA_NOT_CONFIGURED') {
    $('<div>You need to visit <a href="https://www.rottentomatoes.com/">www.rottentomatoes.com</a> at least once to enable the script.</div>').appendTo(main)
    return
  }

  // First result
  $('<div class="firstResult"><a style="font-size:small; color:#136CB2; " href="' + baseURL + arr[0].url + '">' + arr[0].name + ' (' + arr[0].year + ')</a>' + meterBar(arr[0]) + audienceBar(arr[0]) + '</div>').appendTo(main)

  // Shall the following results be collapsed by default?
  if ((arr.length > 1 && arr[0].matchQuality > 10) || arr.length > 10) {
    $('<span style="color:gray;font-size: x-small">More results...</span>').appendTo(main).click(function () { more.css('display', 'block'); this.parentNode.removeChild(this) })
    const more = div = $('<div style="display:none"></div>').appendTo(main)
  }

  // More results
  for (let i = 1; i < arr.length; i++) {
    $('<div><a style="font-size:small; color:#136CB2; " href="' + baseURL + arr[i].url + '">' + arr[i].name + ' (' + arr[i].year + ')</a>' + meterBar(arr[i]) + audienceBar(arr[i]) + '</div>').appendTo(div)
  }

  // Footer
  const sub = $('<div></div>').appendTo(main)
  $('<time style="color:#b6b6b6; font-size: 11px;" datetime="' + time + '" title="' + time.toLocaleTimeString() + ' ' + time.toLocaleDateString() + '">' + minutesSince(time) + '</time>').appendTo(sub)
  $('<a style="color:#b6b6b6; font-size: 11px;" target="_blank" href="' + baseURLOpenTab.replace('{query}', encodeURIComponent(current.query)) + '" title="Open Rotten Tomatoes">@rottentomatoes.com</a>').appendTo(sub)
  $('<span title="Hide me" style="cursor:pointer; float:right; color:#b6b6b6; font-size: 11px; padding-left:5px;padding-top:3px">&#10062;</span>').appendTo(sub).click(function () {
    document.body.removeChild(this.parentNode.parentNode)
  })
}

const Always = () => true
const sites = {
  googleplay: {
    host: ['play.google.com'],
    condition: Always,
    products: [
      {
        condition: () => ~document.location.href.indexOf('/movies/details/'),
        type: 'movie',
        data: () => document.querySelector('*[itemprop=name]').textContent
      }
    ]
  },
  imdb: {
    host: ['imdb.com'],
    condition: () => !~document.location.pathname.indexOf('/mediaviewer') && !~document.location.pathname.indexOf('/mediaindex') && !~document.location.pathname.indexOf('/videoplayer'),
    products: [
      {
        condition: function () {
          const e = document.querySelector("meta[property='og:type']")
          if (e && e.content === 'video.movie') {
            return true
          } else if (document.querySelector('[data-testid="hero__pageTitle"]') && !document.querySelector('[data-testid="hero-subnav-bar-left-block"] a[href*="episodes/"]')) {
            return true
          }
          return false
        },
        type: 'movie',
        data: async function () {
          let year = null
          let ld = null
          if (document.querySelector('script[type="application/ld+json"]')) {
            ld = parseLDJSON(['name', 'alternateName', 'datePublished'])
            if (ld.length > 2) {
              year = parseInt(ld[2].match(/\d{4}/)[0])
            }
          }

          const pageNotEnglish = document.querySelector('[for="nav-language-selector"]').textContent.toLowerCase() !== 'en' || !navigator.language.startsWith('en')
          const pageNotMovieHomePage = !document.title.match(/(.+?)\s+(\((\d+)\))? - IMDb/)

          // If the page is not in English or the browser is not in English, request page in English.
          // Then the title in <h1> will be the English title and Metacritic always uses the English title.
          if (pageNotEnglish || pageNotMovieHomePage) {
            // Set language cookie to English, request current page in English, then restore language cookie or expire it if it didn't exist before
            const imdbID = document.location.pathname.match(/\/title\/(\w+)/)[1]
            const homePageUrl = 'https://www.imdb.com/title/' + imdbID + '/?ref_=nv_sr_1'
            const langM = document.cookie.match(/lc-main=([^;]+)/)
            const langBefore = langM ? langM[0] : ';expires=Thu, 01 Jan 1970 00:00:01 GMT'
            document.cookie = 'lc-main=en-US'
            const response = await asyncRequest({
              url: homePageUrl,
              headers: {
                'Accept-Language': 'en-US,en'
              }
            }).catch(function (response) {
              console.warn('ShowRottentomatoes: Error imdb02\nurl=' + homePageUrl + '\nstatus=' + response.status)
            })
            document.cookie = 'lc-main=' + langBefore
            // Extract <h1> title
            const parts = response.responseText.split('</span></h1>')[0].split('>')
            const title = parts[parts.length - 1]
            if (!year) {
              // extract year
              const yearM = response.responseText.match(/href="\/title\/\w+\/releaseinfo.*">(\d{4})<\/a>/)
              if (yearM) {
                year = yearM[1]
              }
            }
            console.debug('ShowRottentomatoes: Movie title from English page:', title, year)
            return [title, year]
          } else if (ld) {
            if (ld.length > 1 && ld[1]) {
              console.debug('ShowRottentomatoes: Movie ld+json alternateName', ld[1], year)
              return [ld[1], year]
            }
            console.debug('ShowRottentomatoes: Movie ld+json name', ld[0], year)
            return [ld[0], year]
          } else {
            const m = document.title.match(/(.+?)\s+(\((\d+)\))? - /)
            console.debug('ShowRottentomatoes: Movie <title>', [m[1], m[3]])
            return [m[1], parseInt(m[3])]
          }
        }
      },
      {
        condition: function () {
          const e = document.querySelector("meta[property='og:type']")
          if (e && e.content === 'video.tv_show') {
            return true
          } else if (document.querySelector('[data-testid="hero-subnav-bar-left-block"] a[href*="episodes/"]')) {
            return true
          }
          return false
        },
        type: 'tv',
        data: async function () {
          let year = null
          let ld = null
          if (document.querySelector('script[type="application/ld+json"]')) {
            ld = parseLDJSON(['name', 'alternateName', 'datePublished'])
            if (ld.length > 2) {
              year = parseInt(ld[2].match(/\d{4}/)[0])
            }
          }

          const pageNotEnglish = document.querySelector('[for="nav-language-selector"]').textContent.toLowerCase() !== 'en' || !navigator.language.startsWith('en')
          const pageNotMovieHomePage = !document.title.match(/(.+?)\s+\(.+(\d{4})–.{0,4}\) - IMDb/)

          // If the page is not in English or the browser is not in English, request page in English.
          // Then the title in <h1> will be the English title and Metacritic always uses the English title.
          if (pageNotEnglish || pageNotMovieHomePage) {
            const imdbID = document.location.pathname.match(/\/title\/(\w+)/)[1]
            const homePageUrl = 'https://www.imdb.com/title/' + imdbID + '/?ref_=nv_sr_1'
            // Set language cookie to English, request current page in English, then restore language cookie or expire it if it didn't exist before
            const langM = document.cookie.match(/lc-main=([^;]+)/)
            const langBefore = langM ? langM[0] : ';expires=Thu, 01 Jan 1970 00:00:01 GMT'
            document.cookie = 'lc-main=en-US'
            const response = await asyncRequest({
              url: homePageUrl,
              headers: {
                'Accept-Language': 'en-US,en'
              }
            }).catch(function (response) {
              console.warn('ShowRottentomatoes: Error imdb03\nurl=' + homePageUrl + '\nstatus=' + response.status)
            })
            document.cookie = 'lc-main=' + langBefore
            // Extract <h1> title
            const parts = response.responseText.split('</span></h1>')[0].split('>')
            const title = parts[parts.length - 1]
            if (!year) {
              // extract year
              const yearM = response.responseText.match(/href="\/title\/\w+\/releaseinfo.*">(\d{4})/)
              if (yearM) {
                year = yearM[1]
              }
            }
            console.debug('ShowRottentomatoes: TV title from English page:', title, year)
            return [title, year]
          } else if (ld) {
            if (ld.length > 1 && ld[1]) {
              console.debug('ShowRottentomatoes: TV ld+json alternateName', ld[1], year)
              return [ld[1], year]
            }
            console.debug('ShowRottentomatoes: TV ld+json name', ld[0], year)
            return [ld[0], year]
          } else {
            const m = document.title.match(/(.+?)\s+\(.+(\d{4}).+/)
            console.debug('ShowRottentomatoes: TV <title>', [m[1], m[2]])
            return [m[1], parseInt(m[2])]
          }
        }
      }
    ]
  },
  'tv.com': {
    host: ['www.tv.com'],
    condition: () => document.querySelector("meta[property='og:type']"),
    products: [{
      condition: () => document.querySelector("meta[property='og:type']").content === 'tv_show' && document.querySelector('h1[data-name]'),
      type: 'tv',
      data: () => document.querySelector('h1[data-name]').dataset.name
    }]
  },
  metacritic: {
    host: ['www.metacritic.com'],
    condition: () => document.querySelector("meta[property='og:type']"),
    products: [{
      condition: () => document.querySelector("meta[property='og:type']").content === 'video.movie',
      type: 'movie',
      data: function () {
        let year = null
        if (document.querySelector('.release_year')) {
          year = parseInt(document.querySelector('.release_year').firstChild.textContent)
        } else if (document.querySelector('.release_data .data')) {
          year = document.querySelector('.release_data .data').textContent.match(/(\d{4})/)[1]
        }

        return [document.querySelector("meta[property='og:title']").content, year]
      }
    },
    {
      condition: () => document.querySelector("meta[property='og:type']").content === 'video.tv_show',
      type: 'tv',
      data: function () {
        let title = document.querySelector("meta[property='og:title']").content
        let year = null
        if (title.match(/\s\(\d{4}\)$/)) {
          year = parseInt(title.match(/\s\((\d{4})\)$/)[1])
          title = title.replace(/\s\(\d{4}\)$/, '') // Remove year
        } else if (document.querySelector('.release_date')) {
          year = document.querySelector('.release_date').textContent.match(/(\d{4})/)[1]
        }

        return [title, year]
      }
    }
    ]
  },
  serienjunkies: {
    host: ['www.serienjunkies.de'],
    condition: Always,
    products: [{
      condition: () => document.getElementById('serienlinksbreit2aktuell'),
      type: 'tv',
      data: () => document.querySelector('h1').textContent.trim()
    },
    {
      condition: () => document.location.pathname.search(/vod\/film\/.{3,}/) !== -1,
      type: 'movie',
      data: () => document.querySelector('h1').textContent.trim()
    }]
  },
  amazon: {
    host: ['amazon.'],
    condition: Always,
    products: [
      {
        condition: () => (document.querySelector('[data-automation-id=title]') && (
          document.getElementsByClassName('av-season-single').length ||
          document.querySelector('[data-automation-id="num-of-seasons-badge"]') ||
          document.getElementById('tab-selector-episodes') ||
          document.getElementById('av-droplist-av-atf-season-selector')
        )),
        type: 'tv',
        data: () => document.querySelector('[data-automation-id=title]').textContent.trim()
      },
      {
        condition: () => ((
          document.getElementsByClassName('av-season-single').length ||
          document.querySelector('[data-automation-id="num-of-seasons-badge"]') ||
          document.getElementById('tab-selector-episodes') ||
          document.getElementById('av-droplist-av-atf-season-selector')
        ) && Array.from(document.querySelectorAll('script[type="text/template"]')).map(e => e.innerHTML.match(/parentTitle"\s*:\s*"(.+?)"/)).some((x) => x != null)),
        type: 'tv',
        data: () => Array.from(document.querySelectorAll('script[type="text/template"]')).map(e => e.innerHTML.match(/parentTitle"\s*:\s*"(.+?)"/)).filter((x) => x != null)[0][1]
      },
      {
        condition: () => document.querySelector('[data-automation-id=title]'),
        type: 'movie',
        data: () => document.querySelector('[data-automation-id=title]').textContent.trim().replace(/\[.{1,8}\]/, '')
      },
      {
        condition: () => document.querySelector('#watchNowContainer a[href*="/gp/video/"]'),
        type: 'movie',
        data: () => document.getElementById('productTitle').textContent.trim()
      }
    ]
  },
  BoxOfficeMojo: {
    host: ['boxofficemojo.com'],
    condition: () => Always,
    products: [
      {
        condition: () => document.location.pathname.startsWith('/release/'),
        type: 'movie',
        data: function () {
          let year = null
          const cells = document.querySelectorAll('#body .mojo-summary-values .a-section span')
          for (let i = 0; i < cells.length; i++) {
            if (~cells[i].innerText.indexOf('Release Date')) {
              year = parseInt(cells[i].nextElementSibling.textContent.match(/\d{4}/)[0])
              break
            }
          }
          return [document.querySelector('meta[name=title]').content, year]
        }
      },
      {
        condition: () => ~document.location.search.indexOf('id=') && document.querySelector('#body table:nth-child(2) tr:first-child b'),
        type: 'movie',
        data: function () {
          let year = null
          try {
            const tds = document.querySelectorAll('#body table:nth-child(2) tr:first-child table table table td')
            for (let i = 0; i < tds.length; i++) {
              if (~tds[i].innerText.indexOf('Release Date')) {
                year = parseInt(tds[i].innerText.match(/\d{4}/)[0])
                break
              }
            }
          } catch (e) { }
          return [document.querySelector('#body table:nth-child(2) tr:first-child b').firstChild.textContent, year]
        }
      }]
  },
  AllMovie: {
    host: ['allmovie.com'],
    condition: () => document.querySelector('h2[itemprop=name].movie-title'),
    products: [{
      condition: () => document.querySelector('h2[itemprop=name].movie-title'),
      type: 'movie',
      data: () => document.querySelector('h2[itemprop=name].movie-title').firstChild.textContent.trim()
    }]
  },
  'en.wikipedia': {
    host: ['en.wikipedia.org'],
    condition: Always,
    products: [{
      condition: function () {
        if (!document.querySelector('.infobox .summary')) {
          return false
        }
        const r = /\d\d\d\d films/
        return $('#catlinks a').filter((i, e) => e.firstChild.textContent.match(r)).length
      },
      type: 'movie',
      data: () => document.querySelector('.infobox .summary').firstChild.textContent
    },
    {
      condition: function () {
        if (!document.querySelector('.infobox .summary')) {
          return false
        }
        const r = /television series/
        return $('#catlinks a').filter((i, e) => e.firstChild.textContent.match(r)).length
      },
      type: 'tv',
      data: () => document.querySelector('.infobox .summary').firstChild.textContent
    }]
  },
  fandango: {
    host: ['fandango.com'],
    condition: () => document.querySelector("meta[property='og:title']"),
    products: [{
      condition: Always,
      type: 'movie',
      data: () => document.querySelector("meta[property='og:title']").content.match(/(.+?)\s+\(\d{4}\)/)[1].trim()
    }]
  },
  themoviedb: {
    host: ['themoviedb.org'],
    condition: () => document.querySelector("meta[property='og:type']"),
    products: [{
      condition: () => document.querySelector("meta[property='og:type']").content === 'movie' ||
        document.querySelector("meta[property='og:type']").content === 'video.movie',
      type: 'movie',
      data: function () {
        let year = null
        try {
          year = parseInt(document.querySelector('.release_date').innerText.match(/\d{4}/)[0])
        } catch (e) {}

        return [document.querySelector("meta[property='og:title']").content, year]
      }
    },
    {
      condition: () => document.querySelector("meta[property='og:type']").content === 'tv' ||
        document.querySelector("meta[property='og:type']").content === 'tv_series' ||
        document.querySelector("meta[property='og:type']").content.indexOf('tv_show') !== -1,
      type: 'tv',
      data: () => document.querySelector("meta[property='og:title']").content
    }]
  },
  letterboxd: {
    host: ['letterboxd.com'],
    condition: () => unsafeWindow.filmData && 'name' in unsafeWindow.filmData,
    products: [{
      condition: Always,
      type: 'movie',
      data: () => [unsafeWindow.filmData.name, unsafeWindow.filmData.releaseYear]
    }]
  },
  TVmaze: {
    host: ['tvmaze.com'],
    condition: () => document.querySelector('h1'),
    products: [{
      condition: Always,
      type: 'tv',
      data: () => document.querySelector('h1').firstChild.textContent
    }]
  },
  TVGuide: {
    host: ['tvguide.com'],
    condition: Always,
    products: [{
      condition: () => document.location.pathname.startsWith('/tvshows/'),
      type: 'tv',
      data: function () {
        if (document.querySelector('meta[itemprop=name]')) {
          return document.querySelector('meta[itemprop=name]').content
        } else {
          return document.querySelector("meta[property='og:title']").content.split('|')[0]
        }
      }
    }]
  },
  followshows: {
    host: ['followshows.com'],
    condition: Always,
    products: [{
      condition: () => document.querySelector("meta[property='og:type']").content === 'video.tv_show',
      type: 'tv',
      data: () => document.querySelector("meta[property='og:title']").content
    }]
  },
  TheTVDB: {
    host: ['thetvdb.com'],
    condition: Always,
    products: [{
      condition: () => document.location.pathname.startsWith('/series/'),
      type: 'tv',
      data: () => document.getElementById('series_title').firstChild.textContent.trim()
    },
    {
      condition: () => document.location.pathname.startsWith('/movies/'),
      type: 'movie',
      data: () => document.getElementById('series_title').firstChild.textContent.trim()
    }]
  },
  TVNfo: {
    host: ['tvnfo.com'],
    condition: () => document.querySelector('#title #name'),
    products: [{
      condition: Always,
      type: 'tv',
      data: function () {
        const years = document.querySelector('#title #years').textContent.trim()
        const title = document.querySelector('#title #name').textContent.replace(years, '').trim()
        let year = null
        if (years) {
          try {
            year = years.match(/\d{4}/)[0]
          } catch (e) {}
        }
        return [title, year]
      }
    }]
  },
  nme: {
    host: ['nme.com'],
    condition: () => document.location.pathname.startsWith('/reviews/'),
    products: [{
      condition: () => document.querySelector('.tdb-breadcrumbs a[href*="/reviews/film-reviews"]'),
      type: 'movie',
      data: function () {
        let year = null
        try {
          year = parseInt(document.querySelector('*[itemprop=datePublished]').content.match(/\d{4}/)[0])
        } catch (e) {}

        try {
          return [document.title.match(/[‘'](.+?)[’']/)[1], year]
        } catch (e) {
          try {
            return [document.querySelector('h1.tdb-title-text').textContent.match(/[‘'](.+?)[’']/)[1], year]
          } catch (e) {
            return [document.querySelector('h1').textContent.match(/:\s*(.+)/)[1].trim(), year]
          }
        }
      }
    },
    {
      condition: () => document.querySelector('.tdb-breadcrumbs a[href*="/reviews/tv-reviews"]'),
      type: 'tv',
      data: () => document.querySelector('h1.tdb-title-text').textContent.match(/‘(.+?)’/)[1]
    }]
  },
  itunes: {
    host: ['itunes.apple.com'],
    condition: Always,
    products: [{
      condition: () => ~document.location.href.indexOf('/movie/'),
      type: 'movie',
      data: () => parseLDJSON('name', (j) => (j['@type'] === 'Movie'))
    },
    {
      condition: () => ~document.location.href.indexOf('/tv-season/'),
      type: 'tv',
      data: function () {
        let name = parseLDJSON('name', (j) => (j['@type'] === 'TVSeries'))
        if (~name.indexOf(', Season')) {
          name = name.split(', Season')[0]
        }
        return name
      }
    }]
  },
  epguides: {
    host: ['epguides.com'],
    condition: () => document.getElementById('eplist'),
    products: [{
      condition: () => document.getElementById('eplist') && document.querySelector('.center.titleblock h2'),
      type: 'tv',
      data: () => document.querySelector('.center.titleblock h2').textContent.trim()
    }]
  },
  ComedyCentral: {
    host: ['cc.com'],
    condition: () => document.location.pathname.startsWith('/shows/'),
    products: [{
      condition: () => document.location.pathname.split('/').length === 3 && document.querySelector("meta[property='og:title']"),
      type: 'tv',
      data: () => document.querySelector("meta[property='og:title']").content.replace('| Comedy Central', '').trim()
    },
    {
      condition: () => document.location.pathname.split('/').length === 3 && document.title.match(/(.+?)\s+-\s+Series/),
      type: 'tv',
      data: () => document.title.match(/(.+?)\s+-\s+Series/)[1]
    }]
  },
  AMC: {
    host: ['amc.com'],
    condition: () => document.location.pathname.startsWith('/shows/'),
    products: [
      {
        condition: () => document.location.pathname.split('/').length === 3 && document.querySelector("meta[property='og:type']") && document.querySelector("meta[property='og:type']").content.indexOf('tv_show') !== -1,
        type: 'tv',
        data: () => document.querySelector('.video-card-description h1').textContent.trim()
      }]
  },
  AMCplus: {
    host: ['amcplus.com'],
    condition: () => Always,
    products: [
      {
        condition: () => document.title.match(/Watch .+? |/),
        type: 'tv',
        data: () => document.title.match(/Watch (.+?) |/)[1].trim()
      }]
  },
  RlsBB: {
    host: ['rlsbb.ru'],
    condition: () => document.querySelectorAll('.post').length === 1,
    products: [
      {
        condition: () => document.querySelector('#post-wrapper .entry-meta a[href*="/category/movies/"]'),
        type: 'movie',
        data: () => document.querySelector('h1.entry-title').textContent.match(/(.+?)\s+\d{4}/)[1].trim()
      },
      {
        condition: () => document.querySelector('#post-wrapper .entry-meta a[href*="/category/tv-shows/"]'),
        type: 'tv',
        data: () => document.querySelector('h1.entry-title').textContent.match(/(.+?)\s+S\d{2}/)[1].trim()
      }]
  },
  showtime: {
    host: ['sho.com'],
    condition: Always,
    products: [
      {
        condition: () => parseLDJSON('@type') === 'Movie',
        type: 'movie',
        data: () => parseLDJSON('name', (j) => (j['@type'] === 'Movie'))
      },
      {
        condition: () => parseLDJSON('@type') === 'TVSeries',
        type: 'tv',
        data: () => parseLDJSON('name', (j) => (j['@type'] === 'TVSeries'))
      }]
  },
  gog: {
    host: ['www.gog.com'],
    condition: () => document.querySelector('.productcard-basics__title'),
    products: [{
      condition: () => document.location.pathname.split('/').length > 2 && (
        document.location.pathname.split('/')[1] === 'movie' ||
        document.location.pathname.split('/')[2] === 'movie'),
      type: 'movie',
      data: () => document.querySelector('.productcard-basics__title').textContent
    }]
  },
  psapm: {
    host: ['psa.wf'],
    condition: Always,
    products: [
      {
        condition: () => document.location.pathname.startsWith('/movie/'),
        type: 'movie',
        data: function () {
          const title = document.querySelector('h1').textContent.trim()
          const m = title.match(/(.+)\((\d+)\)$/)
          if (m) {
            return [m[1].trim(), parseInt(m[2])]
          } else {
            return title
          }
        }
      },
      {
        condition: () => document.location.pathname.startsWith('/tv-show/'),
        type: 'tv',
        data: () => document.querySelector('h1').textContent.trim()
      }
    ]
  },
  'save.tv': {
    host: ['save.tv'],
    condition: () => document.location.pathname.startsWith('/STV/M/obj/archive/'),
    products: [
      {
        condition: () => document.location.pathname.startsWith('/STV/M/obj/archive/'),
        type: 'movie',
        data: function () {
          let title = null
          if (document.querySelector("span[data-bind='text:OrigTitle']")) {
            title = document.querySelector("span[data-bind='text:OrigTitle']").textContent
          } else {
            title = document.querySelector("h2[data-bind='text:Title']").textContent
          }
          let year = null
          if (document.querySelector("span[data-bind='text:ProductionYear']")) {
            year = parseInt(document.querySelector("span[data-bind='text:ProductionYear']").textContent)
          }
          return [title, year]
        }
      }
    ]
  },
  wikiwand: {
    host: ['www.wikiwand.com'],
    condition: Always,
    products: [{
      condition: function () {
        const title = document.querySelector('h1').textContent.toLowerCase()
        const subtitle = document.querySelector('h2[class*="subtitle"]') ? document.querySelector('h2[class*="subtitle"]').textContent.toLowerCase() : ''
        if (title.indexOf('film') === -1 && !subtitle) {
          return false
        }
        return title.indexOf('film') !== -1 ||
          subtitle.indexOf('film') !== -1 ||
          subtitle.indexOf('movie') !== -1
      },
      type: 'movie',
      data: () => document.querySelector('h1').textContent.replace(/\((\d{4} )?film\)/i, '').trim()
    },
    {
      condition: function () {
        const title = document.querySelector('h1').textContent.toLowerCase()
        const subtitle = document.querySelector('h2[class*="subtitle"]') ? document.querySelector('h2[class*="subtitle"]').textContent.toLowerCase() : ''
        if (title.indexOf('tv series') === -1 && !subtitle) {
          return false
        }
        return title.indexOf('tv series') !== -1 ||
          subtitle.indexOf('television') !== -1 ||
          subtitle.indexOf('tv series') !== -1
      },
      type: 'tv',
      data: () => document.querySelector('h1').textContent.replace(/\(tv series\)/i, '').trim()
    }]
  },
  trakt: {
    host: ['trakt.tv'],
    condition: Always,
    products: [
      {
        condition: () => document.location.pathname.startsWith('/movies/'),
        type: 'movie',
        data: function () {
          const title = Array.from(document.querySelector('.summary h1').childNodes).filter(node => node.nodeType === node.TEXT_NODE).map(node => node.textContent).join(' ').trim()
          const year = document.querySelector('.summary h1 .year').textContent
          return [title, year]
        }
      },
      {
        condition: () => document.location.pathname.startsWith('/shows/'),
        type: 'tv',
        data: () => Array.from(document.querySelector('.summary h1').childNodes).filter(node => node.nodeType === node.TEXT_NODE).map(node => node.textContent).join(' ').trim()
      }
    ]
  }
}

async function main () {
  let dataFound = false

  for (const name in sites) {
    const site = sites[name]
    if (site.host.some(function (e) { return ~this.indexOf(e) || e === '*' }, document.location.hostname) && site.condition()) {
      for (let i = 0; i < site.products.length; i++) {
        if (site.products[i].condition()) {
          // Try to retrieve item name from page
          let data
          try {
            data = await site.products[i].data()
          } catch (e) {
            data = false
            console.error(`${scriptName}: Error in data() of site='${name}', type='${site.products[i].type}'`)
            console.error(e)
          }
          if (data) {
            if (Array.isArray(data)) {
              if (data[1]) {
                loadMeter(data[0].trim(), site.products[i].type, parseInt(data[1]))
              } else {
                loadMeter(data[0].trim(), site.products[i].type)
              }
            } else {
              loadMeter(data.trim(), site.products[i].type)
            }
            dataFound = true
          }
          break
        }
      }
      break
    }
  }
  return dataFound
}

async function adaptForMetaScript () {
  // Move this container above the meta container if the meta container is on the right side
  const rottenC = document.getElementById('mcdiv321rotten')
  const metaC = document.getElementById('mcdiv123')

  if (!metaC || !rottenC) {
    return
  }
  const rottenBounds = rottenC.getBoundingClientRect()

  let bottom = 0
  if (metaC) {
    const metaBounds = metaC.getBoundingClientRect()
    if (Math.abs(metaBounds.right - rottenBounds.right) < 20 && metaBounds.top > 20) {
      bottom += metaBounds.height
    }
  }

  if (bottom > 0) {
    rottenC.style.bottom = bottom + 'px'
  }
}

(async function () {
  if (document.location.href === 'https://www.rottentomatoes.com/') {
    updateAlgolia()
  }

  const firstRunResult = await main()
  let lastLoc = document.location.href
  let lastContent = document.body.innerText
  let lastCounter = 0
  async function newpage () {
    if (lastContent === document.body.innerText && lastCounter < 15) {
      window.setTimeout(newpage, 500)
      lastCounter++
    } else {
      lastContent = document.body.innerText
      lastCounter = 0
      const re = await main()
      if (!re) { // No page matched or no data found
        window.setTimeout(newpage, 1000)
      }
    }
  }
  window.setInterval(function () {
    adaptForMetaScript()
    if (document.location.href !== lastLoc) {
      lastLoc = document.location.href
      $('#mcdiv321rotten').remove()

      window.setTimeout(newpage, 1000)
    }
  }, 500)

  if (!firstRunResult) {
    // Initial run had no match, let's try again there may be new content
    window.setTimeout(main, 2000)
  }
})()
