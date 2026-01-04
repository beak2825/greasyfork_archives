// ==UserScript==
// @name                 Spotify Copy
// @author               Coeur discord.gg/salve
// @description          Add an entry in the context menu here copies the name of the song and the artist examined to the clipboard
// @namespace            no site
// @icon                 https://open.spotify.com/favicon.ico
// @version              1.0
// @license              MIT
// @require              https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant                GM.setClipboard
// @include              https://open.spotify.com/*
// @downloadURL https://update.greasyfork.org/scripts/424903/Spotify%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/424903/Spotify%20Copy.meta.js
// ==/UserScript==

/* globals $, GM, GM_setClipboard */

'use strict';

(function () {
  const translations = {
    en: ['Copy track info', 'Copied: %s'],
    fr: ['Copier les informations de titre', '%s copié'],
  }
  let [menuString, copiedString] = translations.en
  for (const lang in translations) {
    if (navigator.language.startsWith(lang)) {
      [menuString, copiedString] = translations[lang]
      // console.log(lang + ' <- ' + navigator.language)
      break
    }
  }

  let showInfoID
  const showInfo = function (str) {
    window.clearTimeout(showInfoID)
    if (!document.getElementById('copied_song_info_outer')) {
      document.head.appendChild(document.createElement('style')).innerHTML = '#copied_song_info_outer {z-index: 20000;height:0;margin: -62px auto 0;padding-bottom: 62px;pointer-events: none;display: inline-block;}#copied_song_info_inner {max-width: none;display: inline-block;background: #2e77d0;border-radius: 8px;box-shadow: 0 4px 12px 4px rgba(0,0,0,.5);color: #fff;font-size: 16px;line-height: 20px;max-width: 450px;opacity: 1;padding: 12px 36px;text-align: center;transition: none .5s cubic-bezier(.3,0,.4,1);transition-property: opacity;}'
      $('<div id="copied_song_info_outer"><div id="copied_song_info_inner"></div></div>').appendTo('.Root__main-view')
    }
    const copiedSongInfoOuter = $('#copied_song_info_outer')
    const copiedSongInfoInner = $('#copied_song_info_inner')

    copiedSongInfoOuter.css('display', 'inline-block')
    copiedSongInfoInner.css('opacity', 1)
    copiedSongInfoInner.html(str.replace('\n', '<br>\n'))

    showInfoID = window.setTimeout(function () {
      copiedSongInfoInner.css('opacity', 0)
      showInfoID = window.setTimeout(function () {
        copiedSongInfoOuter.css('display', 'none')
      }, 700)
    }, 4000)
  }

  const getSongTitle = function ($titlenodes) {
    let titleText

    if ($titlenodes && $titlenodes.length > 0) {
      titleText = $titlenodes.text()
      if (titleText && titleText.trim()) {
        return titleText.trim()
      }
    }

    if ($('.track-info__name').length > 0) {
      titleText = $('.track-info__name')[0].innerText
      if (titleText && titleText.trim()) {
        return titleText.trim()
      }
    }

    return ''
  }

  const getArtistName = function ($artistnodes) {
    let artistText

    if (typeof $artistnodes === 'string') {
      return $artistnodes.trim()
    }

    if ($artistnodes) {
      const artistTextNodes = $artistnodes.not((i, e) => e.className)
      if (artistTextNodes.length === 1) {
        artistText = artistTextNodes.text()
        if (artistText && artistText.trim()) {
          return artistText.trim()
        }
      } else if (artistTextNodes.length > 1) {
        artistText = artistTextNodes.map((i, e) => e.textContent.trim()).get()
        artistText = artistText.join(', ')
        return artistText.trim()
      }

      // In playlist:
      if ($artistnodes.find('.ellipsis-one-line').length > 0) {
        artistText = $artistnodes.find('.ellipsis-one-line')[0].innerText
        if (artistText && artistText.trim()) {
          return artistText.trim()
        }
      }
      if ($artistnodes.find('.standalone-ellipsis-one-line').length > 0) {
        artistText = $artistnodes.find('.standalone-ellipsis-one-line')[0].innerText
        if (artistText && artistText.trim()) {
          return artistText.trim()
        }
      }

      // Something else, just accumulate all artist links: <a href="/artist/ARTISTID">Artistname</a>
      if ($artistnodes.find('a[href^="/artist/"]').length > 0) {
        return $.map($artistnodes.find('a[href^="/artist/"]'), (element) => $(element).text().trim()).join(', ')
      }
    }

    if (document.location.pathname.startsWith('/artist/')) {
      if ($('.content.artist>div h1').length > 0) {
        artistText = $('.content.artist>div h1')[0].textContent
        if (artistText && artistText.trim()) {
          return artistText.trim()
        }
      } else {
        if ($('.Root__main-view h1').length > 0) {
          artistText = $('.Root__main-view h1')[0].textContent
          if (artistText && artistText.trim()) {
            return artistText.trim()
          }
        }
      }
    }

    if (document.location.pathname.startsWith('/album/')) {
      artistText = document.querySelector('.os-content h1').textContent
      if (artistText && artistText.trim()) {
        return artistText.trim()
      }
    }

    if ($('.track-info__artists').length > 0) {
      artistText = $('.track-info__artists')[0].innerText
      if (artistText && artistText.trim()) {
        return artistText.trim()
      }
    }

    return ''
  }

  const populateContextMenu = function (ev) {
    let $this = $(this)

    let menu = $('.react-contextmenu--visible')
    if (!menu[0]) {
      menu = $('#context-menu-root')
    }
    let title = $this.find('.tracklist-name')
    if (title.length === 0) {
      title = $this.find('div[data-testid="tracklist-row"] .standalone-ellipsis-one-line')
    }
    if (title.length === 0) {
      title = $this.find('div[role="gridcell"] img').parent().find('.standalone-ellipsis-one-line')
    }
    if (title.length === 0 && $this.hasClass('now-playing')) {
      title = $this.find('.ellipsis-one-line>.ellipsis-one-line').eq(0)
    }

    let artist = $this.find('.artists-album span')
    if (artist.length === 0 && $this.hasClass('now-playing')) {
      artist = $this.find('.ellipsis-one-line>.ellipsis-one-line').eq(1)
    }
    if (artist.length === 0) {
      if ($this.find('.second-line').length !== 0) {
        artist = $this.find('.second-line') // in playlist
      }
      if ($this.parents('.now-playing').length !== 0) {
        // Now playing bar
        $this = $($this.parents('.now-playing')[0])
        if ($this.find('.ellipsis-one-line a[href^="/artist/"]').length !== 0) {
          artist = $this.find('.ellipsis-one-line a[href^="/artist/"]')
          title = $this.find('a[data-testid="nowplaying-track-link"]')
        }
      }
      const artistGridCell = $this.find('*[role="gridcell"] a[href^="/artist/"]')
      if (artistGridCell.length > 0) {
        // New playlist design
        artist = artistGridCell.parent()
        title = $(artistGridCell.parent().parent().find('span')[0])
        if (artist.has(title)) {
          // title is child of artist, so it's the same node, the real title is somewhere else
          // This happens on album page
          if (artist.parent().parent().find('div.standalone-ellipsis-one-line').length) {
            title = $(artist.parent().parent().find('div.standalone-ellipsis-one-line')[0])
          }
        }
      }

      const artistContent = $('.content.artist>div h1')
      if (artistContent.length > 0) {
        // Artist page
        artist = artistContent[0].textContent
      }
    }

    if (title && artist && menu[0]) {
      const titleText = getSongTitle(title)
      const artistText = getArtistName(artist)
      if (!titleText || !artistText) {
        return
      }

      // Create context menu entry
      if (menu.attr('id') === 'context-menu-root') {
        // new design (Nov 2020)
        let entry = menu.find('.gmcopytrackinfo')
        if (entry.length === 0 || !entry[0]) {
          let li = menu.find('li')
          if (li.length > 4) {
            li = $(li[4])
          } else {
            li = $(li[0])
          }
          entry = $('<li role="presentation"><button role="menuitem" tabindex="-1"><span as="span" dir="auto">' + menuString + '</span></button></li>')
            .appendTo(li)
            .click(function (ev) {
              // Copy string to clipboard
              const s = entry.data('gmcopy')
              if (typeof GM_setClipboard !== 'undefined') { // eslint-disable-line camelcase
                GM_setClipboard(s)
              } else if (GM.setClipboard) {
                GM.setClipboard(s)
              } else {
                navigator.clipboard.writeText(s)
              }
              showInfo(copiedString.replace('%s', s))
              menu.parent().remove()
            })
            // Copy classes from an existing entry
          entry.addClass('gmcopytrackinfo')
          entry.addClass(li.attr('class'))
          entry.find('button').addClass(li.find('button').attr('class'))
          entry.find('button span').addClass(li.find('button span').attr('class'))
        }
        entry.data('gmcopy', artistText + ' - ' + titleText)
      } else {
        // old design
        let entry = menu.find('.gmcopytrackinfo')
        if (entry.length === 0 || !entry[0]) {
          entry = $('<div class="react-contextmenu-item gmcopytrackinfo" role="menuitem" tabindex="-1" aria-disabled="false">' + menuString + '</div>').appendTo(menu).click(function (ev) {
            // Copy string to clipboard
            const s = entry.data('gmcopy')
            if (typeof GM_setClipboard !== 'undefined') { // eslint-disable-line camelcase
              GM_setClipboard(s)
            } else if (GM.setClipboard) {
              GM.setClipboard(s)
            } else {
              navigator.clipboard.writeText(s)
            }
            showInfo(copiedString.replace('%s', s))
            window.dispatchEvent(new window.CustomEvent('REACT_CONTEXTMENU_HIDE'))
          })
        }
        entry.data('gmcopy', artistText + ' - ' + titleText)
      }
    }
  }

  const onContextMenu = function (ev) {
    // Wait for the React context menu to open
    const t = this
    window.setTimeout(function () {
      populateContextMenu.call(t, ev)
    }, 200)
  }

  const bindEvents = function () {
    // Remove all events and then reattach them
    if ($('.react-contextmenu-wrapper').length > 0) {
      // old design
      $('.react-contextmenu-wrapper').unbind('.gmcopytrackinfo').bind('contextmenu.gmcopytrackinfo', onContextMenu)
    } else {
      // new design (Nov 2020)
      $('*[data-testid="tracklist-row"],.now-playing').unbind('.gmcopytrackinfo').bind('contextmenu.gmcopytrackinfo', onContextMenu)
    }
  }

  window.setTimeout(bindEvents, 500)

  window.setInterval(bindEvents, 1000)
})()