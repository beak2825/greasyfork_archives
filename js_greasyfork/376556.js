// ==UserScript==
// @name Better PTP Ratings
// @description Omit erroneous user ratings
// @version 1
// @require https://code.jquery.com/jquery-latest.min.js
// @match http://passthepopcorn.me/torrents.php?id=*
// @match https://passthepopcorn.me/torrents.php?id=*
// @namespace https://greasyfork.org/users/238682
// @downloadURL https://update.greasyfork.org/scripts/376556/Better%20PTP%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/376556/Better%20PTP%20Ratings.meta.js
// ==/UserScript==

// Please change the below values at will; if you wish to
// disable a particular filter, you may pass in 'undefined'
// eg: const mustBeLowerThan = undefined
const mustBeGreaterThan = 1
const mustBeLowerThan = undefined

// Grab the torrent ID
const id = window.location.href
  .split('id=')[1]
  .split('&')[0]

// Construct ratings URL
const ratingsUrl = `https://passthepopcorn.me/torrents.php?action=ratings&id=${id}`

// Fetch ratings HTML and parse for relevant data; update the DOM accordingly
$.get(ratingsUrl, html => {
  const scores = Array.from(
		$($.parseHTML(html)).find('.star-rating__inline-rating-display')
  )

  const filteredScores = scores
  	.map(score => Number($(score).attr('hiddentitle')))
    .filter(score => mustBeGreaterThan ? (score > mustBeGreaterThan) : true)
    .filter(score => mustBeLowerThan ? (score < mustBeLowerThan) : true)

  const newAverage = Math.round(filteredScores.reduce((a, x) => a + x, 0) / filteredScores.length)

  $('#user_rating').text(`${newAverage}%`)
  $('#user_total').text(`${filteredScores.length} votes`)
  $('.star-rating__site').css('width', `${(newAverage / 100) * 170}px`)
})
