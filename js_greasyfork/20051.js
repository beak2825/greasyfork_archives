// ==UserScript==
// @name        Share Bandcamp.com lyrics and songtexts on Genius.com
// @description Adds a link above the lyrics on bandcamp to share lyrics to genius.com. It then automatically copies all the available information (title, artist, release date, ...) to genius.com
// @homepageURL https://openuserjs.org/scripts/cuzi/Share_Bandcamp.com_lyrics_and_songtexts_on_Genius.com
// @namespace   cuzi
// @version     9.4
// @license     GPL-3.0-or-later
// @copyright   2016, cuzi (https://openuserjs.org/users/cuzi)
// @match       https://*.bandcamp.com/*
// @match       https://bandcamp.com/*
// @match       https://genius.com/new
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM_openInTab
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM.openInTab
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/20051/Share%20Bandcampcom%20lyrics%20and%20songtexts%20on%20Geniuscom.user.js
// @updateURL https://update.greasyfork.org/scripts/20051/Share%20Bandcampcom%20lyrics%20and%20songtexts%20on%20Geniuscom.meta.js
// ==/UserScript==

/* globals $, GM, TralbumData, KeyboardEvent */

(async function () {
  'use strict'

  let sid = 0
  let licenseShown = false

  function fixRelativeLinks (html) {
    return html.replace('href="/', 'target="_blank" href="' + document.location.origin + '/')
  }

  function bandcampStart () {
  // Add links to lyrics info
    const lyricsdiv = document.querySelectorAll('.lyricsText,.lyricsRow>td>div,.tralbumData.tralbum-about')
    for (let i = 0; i < lyricsdiv.length; i++) {
      $('<div><a href="#genius">Share on genius.com</a></div>').click(bandcampOpenGenius).insertBefore(lyricsdiv[i])
    }
  }

  async function bandcampOpenGenius (ev) {
    // License
    if (!licenseShown && $('#license')) {
      const more = $('#license a').attr('href') ? ('More info here:\n' + $('#license a').attr('href') + '\n\n') : ''
      if (!window.confirm('You need to respect the license of this work.\nIf in doubt, ask the copyright proprietor.\nShort version of the license:\n\n' + $.trim($('#license').text()) + '\n\n' + more + 'Ok?')) {
        return
      }
      licenseShown = true
    }

    // Identify song
    const trLyrics = $(this.nextElementSibling)

    // Initiate handshake
    await GM.setValue('g_acknowledgement', 0) // Receive acknowledgement here
    await GM.setValue('bc_waiting', true) // Request acknowledgement

    // Open tab
    GM.openInTab('http://genius.com/new', false)

    // Wait for acknowledgement of handshake:
    const iv = window.setInterval(async function () {
      sid = await GM.getValue('g_acknowledgement', 0)
      if (sid) {
        clearInterval(iv)
        bandcampSendData(trLyrics)
        // Clean up:
        GM.setValue('g_acknowledgement', 0)
      }
    }, 100)
  }

  function bandcampSendData (trLyrics) {
  // Collect data and send to genius window
    const releaseDate = new Date(TralbumData.album_release_date || TralbumData.current.release_date)
    let songTitle = ''
    if (trLyrics[0].classList.contains('lyricsText')) {
      // track page
      songTitle = $.trim($('#name-section .trackTitle').text())
    } else {
      // album page
      songTitle = $.trim($(trLyrics[0].parentNode.parentNode).prev('tr').find('.track-title').text())
    }
    if (!songTitle) {
      songTitle = $.trim($('#name-section .trackTitle').text())
    }

    const direct = {
      song_primary_artists__name: TralbumData.artist,
      song_title: songTitle,
      song_lyrics: $.trim(trLyrics.text().replace(/ +$/gm, '').replace(/[´‘’‛❛❜՚ߴߵ＇]([dlmrstv])/g, "'$1")),
      song_featured_artists: '',
      song_producer_artists: '',
      song_writer_artists: '',
      song_release_date_1i: releaseDate.getFullYear(),
      song_release_date_2i: releaseDate.getMonth() + 1,
      song_release_date_3i: releaseDate.getDate()
    }
    const other = {
      album_name: TralbumData.current.title,
      about: fixRelativeLinks($('.tralbumData.tralbum-about').html() || ''),
      credits: fixRelativeLinks($('.tralbumData.tralbum-credits').html() || ''),
      tags: Array.prototype.map.call($('.tralbumData.tralbum-tags a'), e => e.text).join(', ') || '',
      albumart: $('.popupImage').get(0).href
    }

    GM.setValue('bc_data', JSON.stringify({
      sid: sid,
      direct: direct,
      other: other
    }))
  }

  async function geniusStart () {
  // Wait for a first message/handshake from bandcamp
    if (await GM.getValue('bc_waiting', false)) {
      sid = 1 + Math.random()
      await GM.setValue('bc_waiting', false) // Clean up
      await GM.setValue('g_acknowledgement', sid) // Send acknowledgement
      // Start receiving data
      geniusReceiveData()
    }
  }

  function geniusReceiveData () {
  // Wait for the data from bandcamp
    const iv = window.setInterval(async function () {
      const response = JSON.parse(await GM.getValue('bc_data', '{}'))
      if ('sid' in response && response.sid === sid) {
        clearInterval(iv)

        geniusFillForm(response)

        // Clean up
        GM.setValue('bc_data', '{}')
      }
    }, 100)

    // Click on "Add album" to generate a new album input field
    const evt = document.createEvent('MouseEvents')
    evt.initEvent('click', true, true)
    document.getElementById('add_album_name').dispatchEvent(evt)
  }

  function geniusFillForm (rsp) {
  // Directly enter data by id
    for (const id in rsp.direct) {
      $(document.getElementById(id)).val(rsp.direct[id])
    }

    // Create keyup event on song name, to generate the warning about duplicates
    const evt = new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: 'e', char: 'e' })
    document.getElementById('song_primary_artists__name').dispatchEvent(evt)

    // Album name
    $('.album_name.add_album input').first().val(rsp.other.album_name)

    // Tags
    $('<div><b>Tags:</b><br>' + rsp.other.tags + '<div style="position:absolute;font-size:xx-small;color:green;top:-5px; right:0px;">bandcamp info</div></div>').css({
      position: 'absolute',
      left: 0,
      top: $('.primary_tag_chooser').offset().top,
      maxWidth: (($(document.body).width() - $('#container').width() - 15) / 2),
      background: '#DDB',
      color: 'black',
      padding: '5px'
    }).appendTo(document.body)

    // Credits & About & Song title
    const credits = $('<div><b>Title:</b><br>' + rsp.direct.song_title + '<br><b>Credits:</b><div>' + rsp.other.credits + '</div><b>About:</b><div>' + rsp.other.about + '</div><b>Tags:</b><br>' + rsp.other.tags + '<div style="position:absolute;font-size:xx-small;color:green;top:-5px; right:0px;">bandcamp info</div></div>').css({
      position: 'absolute',
      left: 0,
      top: $(".add_song_page-header:contains('Meta')").offset().top,
      maxWidth: (($(document.body).width() - $('#container').width() - 30) / 2),
      maxHeight: 500,
      overflow: 'auto',
      background: '#DDB',
      color: 'black',
      padding: '5px'
    }).appendTo(document.body)

    // Reposition credits on lyrics change
    const $songLyrics = $('#song_lyrics')
    let oldheight = $songLyrics.height()
    $songLyrics.change(function () {
      if ($songLyrics.height() !== oldheight) {
        oldheight = $songLyrics.height()
        credits.css('top', $(".add_song_page-header:contains('Meta')").offset().top)
      }
    })
  }

  if (document.location.href.endsWith('genius.com/new')) {
    window.setTimeout(geniusStart, 500)
  } else if (typeof TralbumData !== 'undefined') {
    window.setTimeout(bandcampStart, 500)
  }
})()
