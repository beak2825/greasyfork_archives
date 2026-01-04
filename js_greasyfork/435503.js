// ==UserScript==
// @name         imdb.com — Ratings from other websites
// @description  Show ratings on the imdb.com movie page from Filmweb, Rotten Tomatoes and Metacritic.
// @author       Rafal Enden
// @namespace    https://github.com/rafenden
// @homepageURL  https://github.com/rafenden/userscripts/blob/master/imdb-ratings-from-other-websites
// @supportURL   https://github.com/rafenden/userscripts/issues
// @license      MIT
// @version      1.1
// @match        https://www.imdb.com/title/*
// @connect      www.filmweb.pl
// @connect      www.omdbapi.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/435503/imdbcom%20%E2%80%94%20Ratings%20from%20other%20websites.user.js
// @updateURL https://update.greasyfork.org/scripts/435503/imdbcom%20%E2%80%94%20Ratings%20from%20other%20websites.meta.js
// ==/UserScript==

function getMovieDetails() {
  const scriptTag = document.querySelector('script[type="application/ld+json"]')

  try {
    const movieDetails = JSON.parse(scriptTag.textContent)
    return {
      title: movieDetails.name,
      releaseYear: movieDetails.datePublished.split('-')[0],
      imdbID: movieDetails.url.split('/')[2]
    }
  } catch (error) {
      console.error('Error parsing JSON-LD script', error)
  }
}

function addRating(siteName, url, rating, count) {
  const ratingItem = document.querySelector('[data-testid="hero-rating-bar__aggregate-rating"]')

  const newRatingItem = ratingItem.cloneNode(true)
  newRatingItem.firstElementChild.innerText = siteName
  newRatingItem.querySelector('[aria-label="View User Ratings"]').setAttribute('href', url)
  newRatingItem.querySelector('[data-testid="hero-rating-bar__aggregate-rating__score"]').firstElementChild.innerText = rating
  newRatingItem.querySelector('.sc-bde20123-3.bjjENQ').innerText = count || ''

  ratingItem.parentElement.prepend(newRatingItem)
}

function showFilmwebRating(title, releaseYear) {
  GM_xmlhttpRequest({
    method: 'GET',
    url: `https://www.filmweb.pl/search?q=${title}+${releaseYear}`,
    onload: (response) => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(response.responseText, 'text/html')

      const rating = doc.querySelector('.communityRatings__value').textContent
      const count = doc.querySelector('.communityRatings__description > span').textContent
      const url = doc.querySelector('.preview__link').getAttribute('href')

      addRating('Filmweb', `https://www.filmweb.pl${url}`, rating, count)
    },
  })
}

function showOtherRatings(imdbID) {
  const OMDBAPI_API_KEY = '6be019fc'
  GM_xmlhttpRequest({
    method: 'GET',
    url: `http://www.omdbapi.com/?apikey=${OMDBAPI_API_KEY}&tomatoes=true&i=${imdbID}`,
    onload: (response) => {
      const json = JSON.parse(response.responseText)
      console.log(json)
      if (json) {
        if (json.Error) {
          console.error(`Error: ${json.Error}`)
        }
        else {
          json.Ratings.forEach((rating) => {
            if (rating.Source === 'Rotten Tomatoes' && json.tomatoURL && json.tomatoURL !== 'N/A') {
              addRating('Rotten Tomatoes', json.tomatoURL, rating.Value)
            }
            else if (rating.Source === 'Metacritic') {
              addRating('Metacritic', `https://www.metacritic.com/search/all/${json.Title}/results`, rating.Value)
            }
          })
        }
      }
      else {
        console.error('Unknown error')
      }
    }
  })
}

const { title, releaseYear, imdbID } = getMovieDetails()

//showFilmwebRating(title, releaseYear) // TODO: Fix integration
showOtherRatings(imdbID)

document.querySelectorAll('[data-testid="hero-rating-bar__aggregate-rating__score"]').forEach((element) => {
  element.lastElementChild.remove()
})
