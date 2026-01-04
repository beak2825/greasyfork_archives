// ==UserScript==
// @name            Youtube Music Genius Lyrics
// @description     Shows lyrics/songtexts from genius.com on Youtube music next to music videos
// @description:es  Mostra la letra de genius.com de las canciones en Youtube Music
// @description:de  Zeigt den Songtext von genius.com auf Youtube Music an
// @description:fr  Présente les paroles de chansons de genius.com sur Youtube Music
// @description:pl  Pokazuje teksty piosenek z genius.com na Youtube Music
// @description:pt  Mostra letras de genius.com no Youtube Music
// @description:it  Mostra i testi delle canzoni di genius.com su Youtube Music
// @description:ja  YouTube Music（ユーチューブ ミュージック）プレーヤーで、スクリプトが genius.com の歌詞を表示する
// @license         GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright       2020, cuzi (https://github.com/cvzi)
// @author          cuzi
// @icon            https://music.youtube.com/img/favicon_144.png
// @supportURL      https://github.com/cvzi/Youtube-Music-Genius-Lyrics-userscript/issues
// @version         4.0.33
// @require         https://greasyfork.org/scripts/406698-geniuslyrics/code/GeniusLyrics.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js
// @grant           GM.xmlHttpRequest
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM.registerMenuCommand
// @grant           GM_addValueChangeListener
// @connect         genius.com
// @match           https://music.youtube.com/*
// @namespace https://greasyfork.org/users/20068
// @downloadURL https://update.greasyfork.org/scripts/406892/Youtube%20Music%20Genius%20Lyrics.user.js
// @updateURL https://update.greasyfork.org/scripts/406892/Youtube%20Music%20Genius%20Lyrics.meta.js
// ==/UserScript==

/*
    Copyright (C) 2020 cuzi (cuzi@openmail.cc)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/* global GM, genius, geniusLyrics, GM_addValueChangeListener, HTMLMediaElement, MutationObserver */ // eslint-disable-line no-unused-vars
/* jshint asi: true, esversion: 8 */

'use strict'

const SCRIPT_NAME = 'Youtube Music Genius Lyrics'
let lyricsDisplayState = 'hidden'
let lyricsWidth = '40%'

const elmBuild = (tag, ...contents) => {
  /** @type {HTMLElement} */
  const elm = typeof tag === 'string' ? document.createElement(tag) : tag
  for (const content of contents) {
    if (!content || typeof content !== 'object' || (content instanceof Node)) { // eslint-disable-line no-undef
      elm.append(content)
    } else if (content.length > 0) {
      elm.appendChild(elmBuild(...content))
    } else if (content.style) {
      Object.assign(elm.style, content.style)
    } else if (content.classList) {
      elm.classList.add(...content.classList)
    } else if (content.attr) {
      for (const [attr, val] of Object.entries(content.attr)) elm.setAttribute(attr, val)
    } else {
      Object.assign(elm, content)
    }
  }
  return elm
}

function addCss () {
  // Spotify
  const style = document.createElement('style')
  style.id = 'youtube-music-genius-lyrics-style'
  style.textContent = `
  #lyricscontainer {
    position:fixed;
    right:0px;
    margin:0px;
    padding:0px;
    background:#000;
    color:#fff;
    z-index:101;
    font-size:1.4rem;
    border:none;
    border-radius:none;
  }
  .lyricsiframe {
    opacity:0.1;
    transition:opacity 2s;
    margin:0px;
    padding:0px;
  }
  .lyricsnavbar {
    font-size : 0.7em;
    text-align:right;
    padding-right:10px;
    background:#212121;
   }
  .lyricsnavbar span,.lyricsnavbar a:link,.lyricsnavbar a:visited  {
    color:#d5d5d5;
    text-decoration:none;
    transition:color 400ms;
   }
  .lyricsnavbar a:hover,.lyricsnavbar span:hover {
    color:#fff;
    text-decoration:none;
  }
  .loadingspinner {
      color:white;
      font-size:1em;
      line-height:2.5em;
  }
  .loadingspinnerholder {
    z-index:101;
    background-color:transparent;
    position:absolute;
    top:120px;
    right:100px;
    cursor:progress
  }
  .lorem {padding:10px 0px 0px 15px; font-size: 1.4rem;line-height: 2.2rem;letter-spacing: 0.3rem;}
  .lorem .white {background:black;color:black}
  .lorem .gray {background:#7f7f7f;color:#7f7f7f}
  #lyricscontainer.geniusSearch {
    background:#212121;
  }
  #lyricscontainer.geniusSearch a:link, #lyricscontainer.geniusSearch a:visited {
    color:#909090;
    transition:color 300ms;
    text-decoration:none;
    font-size:16px
  }
  #lyricscontainer.geniusSearch a:hover{
    color:white;
  }
  .geniussearchinput {
    background-color:#212121;
    color:white;
    border:1px solid #333;
    font-size:17px;
    padding:7px;
    min-width: 60%;
  }
  input.geniussearchinput:focus {
    outline:0;
  }
  `
  document.head.appendChild(style)
}

function calcContainerWidthTop () {
  const playerBar = document.querySelector('ytmusic-nav-bar')
  const playerPage = document.querySelector('ytmusic-player-page#player-page')
  const lyricsBar = document.querySelector('#lyricscontainer .lyricsnavbar')
  const playerPageDim = playerPage.getBoundingClientRect()
  const playerBarDim = playerBar.getBoundingClientRect()

  const left = playerPageDim.left + playerPageDim.width
  const top = playerBarDim.height - (lyricsBar ? lyricsBar.getBoundingClientRect().height : 11)
  return [left, top]
}

function setFrameDimensions (container, iframe) {
  const bar = container.querySelector('.lyricsnavbar')
  const ytmusicPlayerBarDim = document.querySelector('ytmusic-player-bar').getBoundingClientRect()
  const progressContainer = document.getElementById('progressContainer')
  const width = iframe.style.width = container.clientWidth - 1 + 'px'
  const height = iframe.style.height = window.innerHeight - 2 -
  (bar ? bar.getBoundingClientRect().height : 11) -
  container.getBoundingClientRect().top -
  (progressContainer ? progressContainer.getBoundingClientRect().height : 3) -
  ytmusicPlayerBarDim.height + 'px'

  if (genius.option.themeKey === 'spotify') {
    iframe.style.backgroundColor = 'black'
  } else {
    iframe.style.backgroundColor = ''
  }

  return [width, height]
}

function onResize () {
  window.setTimeout(function () {
    document.body.dispatchEvent(new CustomEvent('genius-resize-requested'))
  }, 200)
}

function resize () {
  const container = document.getElementById('lyricscontainer')
  const iframe = document.getElementById('lyricsiframe')

  if (!container) {
    return
  }

  const [left, top] = calcContainerWidthTop()

  container.style.top = top + 'px'
  container.style.left = left + 'px'

  if (iframe) {
    setFrameDimensions(container, iframe)
  }
}

function getCleanLyricsContainer () {
  let container

  const playerPage = document.querySelector('ytmusic-player-page#player-page')
  const playerPageDiv = playerPage.querySelector('.ytmusic-player-page')
  playerPage.style.width = `calc(100% - ${lyricsWidth})`

  playerPageDiv.dataset.paddingRight = window.getComputedStyle(playerPageDiv).paddingRight
  playerPageDiv.style.paddingRight = '0px'

  const [left, top] = calcContainerWidthTop()

  if (!document.getElementById('lyricscontainer')) {
    container = document.createElement('div')
    container.id = 'lyricscontainer'
    document.body.appendChild(container)
  } else {
    container = document.getElementById('lyricscontainer')
    container.textContent = ''
  }
  container.style = ''
  container.style.top = top + 'px'
  container.style.left = left + 'px'
  container.className = ''

  return document.getElementById('lyricscontainer')
}

function getSongInfoNodes () {
  let playerBars = [...document.querySelectorAll('ytmusic-player-bar.ytmusic-app')].filter(e => !e.closest('[hidden]') && !e.closest('[disabled]'))
  if (playerBars.length === 0) playerBars = [...document.querySelectorAll('ytmusic-player-bar')].filter(e => !e.closest('[hidden]') && !e.closest('[disabled]'))
  let titleNode = null
  let artistNodes = []
  if (playerBars.length === 1) {
    const playerBar = playerBars[0]
    const key = '__shady_native_querySelector' in playerBar && typeof playerBar.__shady_native_querySelector === 'function' && typeof playerBar.__shady_native_querySelectorAll === 'function' ? '__shady_native_querySelector' : 'querySelector'
    titleNode = playerBar[key]('.title.ytmusic-player-bar')
    artistNodes = [...playerBar[`${key}All`]('.ytmusic-player-bar.subtitle a[href*="channel/"]')]
  }
  return {
    titleNode,
    artistNodes,
    isSongQueuedOrPlaying: artistNodes.length > 0 && artistNodes[0].textContent.trim() && titleNode && titleNode.textContent.trim()
  }
}

function hideLyrics () {
  document.querySelectorAll('.loadingspinner').forEach((spinner) => spinner.remove())
  if (document.getElementById('lyricscontainer')) {
    document.getElementById('lyricscontainer').remove()
  }

  const playerPage = document.querySelector('ytmusic-player-page#player-page')
  const playerPageDiv = playerPage.querySelector('.ytmusic-player-page')

  playerPage.style.width = ''
  playerPageDiv.style.paddingRight = playerPageDiv.dataset.paddingRight

  addLyricsButton()
}

function addLyricsButton () {
  if (document.getElementById('showlyricsbutton')) {
    return
  }
  const b = document.body.appendChild(document.createElement('div'))
  b.setAttribute('id', 'showlyricsbutton')
  b.setAttribute('style', 'position: absolute; min-width: 22px; top: 1px; right: 0px; cursor: pointer; z-index: 3000; background: transparent; text-align: right;')
  b.setAttribute('title', 'Load lyrics from genius.com')
  b.addEventListener('click', function onShowLyricsButtonClick () {
    genius.option.autoShow = true // Temporarily enable showing lyrics automatically on song change
    window.clearInterval(genius.iv.main)
    genius.iv.main = window.setInterval(main, 2000)
    b.remove()
    addLyrics(true)
  })
  const g = b.appendChild(document.createElement('span'))
  g.setAttribute('style', 'display:inline; color: #ffff64; background: black; border-radius: 50%; margin: auto; font-size: 15px; line-height: 15px;padding: 0px 2px;')
  g.appendChild(document.createTextNode('🅖'))
  if (g.getBoundingClientRect().width < 10) { // in case the font doesn't have "🅖" symbol
    g.setAttribute('style', 'border: 2px solid #ffff64; border-radius: 100%; padding: 0px 3px; font-size: 11px; background-color: black; color: #ffff64; font-weight: 700;')
    g.textContent = 'G'
  }
}

let lastSong = null
function addLyrics (force, beLessSpecific) {
  const { titleNode, artistNodes, isSongQueuedOrPlaying } = getSongInfoNodes()
  if (!isSongQueuedOrPlaying) {
    // No song is playing
    lastSong = null
    hideLyrics()
    return
  }

  let songTitle = titleNode.textContent
  const songArtistsArr = Array.from(artistNodes).map(e => e.textContent)

  const song = `${songArtistsArr.join(', ')}-${songTitle}#${genius.option.themeKey}@${genius.option.fontSize}@${lyricsWidth}`

  if (lastSong === song && document.getElementById('lyricscontainer')) {
    // Same video id and same theme and lyrics are showing -> stop here
    return
  } else {
    lastSong = song
  }

  songTitle = songTitle.replace(/[([]\w+\s*\w*\s*video[)\]]/i, '').trim()
  songTitle = songTitle.replace(/[([]\w*\s*audio[)\]]/i, '').trim()
  songTitle = genius.f.cleanUpSongTitle(songTitle)

  const video = getYoutubeMainVideo()
  console.log('debug: Youtube Music Genius Lyrics - getYoutubeMainVideo()', video)
  genius.f.loadLyrics(force, beLessSpecific, songTitle, songArtistsArr, true)
}

function getYoutubeMainVideo () {
  const activeMedia_ = activeMedia
  if (activeMedia_) {
    const moviePlayer = activeMedia_.closest('#movie_player')
    const mediaList = moviePlayer ? moviePlayer.querySelectorAll('audio, video') : null
    if (mediaList && mediaList.length === 1 && mediaList[0] === activeMedia_) {
      return activeMedia_
    }
    if (activeMedia_.classList.contains('html5-main-video')) {
      return activeMedia_
    }
  }
  let video = document.querySelector('#movie_player video[src]')
  if (video !== null) {
    return video
  }
  video = document.querySelector('video[src]')
  if (video !== null) {
    return video
  }
  return null
}

let lastPos = null
function updateAutoScroll (video, force) { // eslint-disable-line no-unused-vars
  let pos = null
  if (!video) {
    video = getYoutubeMainVideo()
  }
  if (video) {
    pos = video.currentTime / video.duration
  }
  if (pos !== null && pos >= 0 && `${lastPos}` !== `${pos}`) {
    lastPos = pos
    genius.f.scrollLyrics(pos)
  }
}

function showSearchField (query) {
  const b = getCleanLyricsContainer()

  b.style.border = '1px solid black'
  b.style.borderRadius = '3px'
  b.style.padding = '5px'

  b.appendChild(document.createTextNode('Search genius.com: '))
  b.style.paddingRight = '15px'
  const input = b.appendChild(document.createElement('input'))
  input.className = 'geniussearchinput'
  input.placeholder = 'Search genius.com...'

  const span = b.appendChild(document.createElement('span'))
  span.style = 'cursor:pointer'
  span.appendChild(document.createTextNode(' \uD83D\uDD0D'))

  // Hide button
  const hideButton = b.appendChild(document.createElement('span'))
  hideButton.style = 'cursor:pointer;opacity: 0.8;padding-left: 10px;color: white;font-size: larger;vertical-align: top;'
  hideButton.title = 'Hide'
  hideButton.appendChild(document.createTextNode('\uD83C\uDD87'))
  hideButton.addEventListener('click', function hideButtonClick (ev) {
    ev.preventDefault()
    hideLyrics()
  })

  if (query) {
    input.value = query
  } else if (genius.current.compoundTitle) {
    input.value = genius.current.compoundTitle.replace('\t', ' ')
  } else if (genius.current.artists && genius.current.title) {
    input.value = genius.current.artists + ' ' + genius.current.title
  } else if (genius.current.artists) {
    input.value = genius.current.artists
  }
  input.addEventListener('change', function onSearchLyricsButtonClick () {
    if (input.value) {
      genius.f.searchByQuery(input.value, b)
    }
  })
  input.addEventListener('keyup', function onSearchLyricsKeyUp (ev) {
    if (ev.code === 'Enter' || ev.code === 'NumpadEnter') {
      ev.preventDefault()
      if (input.value) {
        genius.f.searchByQuery(input.value, b)
      }
    }
  })
  span.addEventListener('click', function onSearchLyricsKeyUp (ev) {
    if (input.value) {
      genius.f.searchByQuery(input.value, b)
    }
  })

  document.body.appendChild(b)
  input.focus()
}

function listSongs (hits, container, query) {
  if (!container) {
    container = getCleanLyricsContainer()
  }

  container.classList.add('geniusSearch')

  // Back to search button
  const backToSearchButton = document.createElement('a')
  backToSearchButton.href = '#'
  backToSearchButton.appendChild(document.createTextNode('Back to search'))
  backToSearchButton.addEventListener('click', function backToSearchButtonClick (ev) {
    ev.preventDefault()
    if (query) {
      showSearchField(query)
    } else if (genius.current.compoundTitle) {
      showSearchField(genius.current.compoundTitle.replace('\t', ' '))
    } else if (genius.current.artists && genius.current.title) {
      showSearchField(genius.current.artists + ' ' + genius.current.title)
    } else if (genius.current.artists) {
      showSearchField(genius.current.artists)
    } else {
      showSearchField()
    }
  })

  const separator = document.createElement('span')
  separator.setAttribute('class', 'second-line-separator')
  separator.setAttribute('style', 'padding:0px 3px')
  separator.appendChild(document.createTextNode('•'))

  // Hide button
  const hideButton = document.createElement('a')
  hideButton.href = '#'
  hideButton.appendChild(document.createTextNode('Hide'))
  hideButton.addEventListener('click', function hideButtonClick (ev) {
    ev.preventDefault()
    hideLyrics()
  })

  elmBuild(container, ['ol', { classList: ['tracklist'] }, { style: { width: '99%', fontSize: '1.15em' } }])

  container.style.border = '1px solid black'
  container.style.borderRadius = '3px'

  container.insertBefore(hideButton, container.firstChild)
  container.insertBefore(separator, container.firstChild)
  container.insertBefore(backToSearchButton, container.firstChild)

  const ol = container.querySelector('ol.tracklist')
  ol.style.listStyle = 'none'
  const searchresultsLengths = hits.length
  const compoundTitle = genius.current.compoundTitle
  const onclick = function onclick () {
    genius.f.rememberLyricsSelection(compoundTitle, null, this.dataset.hit)
    genius.f.showLyrics(JSON.parse(this.dataset.hit), searchresultsLengths)
  }
  const mouseover = function onmouseover () {
    this.querySelector('.onhover').style.display = 'block'
    this.querySelector('.onout').style.display = 'none'
    this.style.backgroundColor = '#666'
  }
  const mouseout = function onmouseout () {
    this.querySelector('.onhover').style.display = 'none'
    this.querySelector('.onout').style.display = 'block'
    this.style.backgroundColor = '#333'
  }

  hits.sort(function compareFn (a, b) {
    if (genius.current.compoundTitle) {
      if (genius.current.compoundTitle.toLowerCase() === (a.result.artist_names + '\t' + a.result.title_with_featured).toLowerCase()) {
        return -1
      }
      if (genius.current.compoundTitle.toLowerCase() === (b.result.artist_names + '\t' + b.result.title_with_featured).toLowerCase()) {
        return 1
      }
    } else if (genius.current.artists && genius.current.title) {
      if (genius.current.artists.toLowerCase() === a.result.artist_names.toLowerCase() && genius.current.title.toLowerCase() === a.result.title_with_featured.toLowerCase()) {
        return -1
      }
      if (genius.current.artists.toLowerCase() === b.result.artist_names.toLowerCase() && genius.current.title.toLowerCase() === b.result.title_with_featured.toLowerCase()) {
        return 1
      }
      if (genius.current.title.toLowerCase() === a.result.title_with_featured.toLowerCase()) {
        return -1
      }
      if (genius.current.title.toLowerCase() === b.result.title_with_featured.toLowerCase()) {
        return 1
      }
    }
    return 0
  })

  hits.forEach(function forEachHit (hit) {
    const li = document.createElement('li')
    li.style.cursor = 'pointer'
    li.style.transition = 'background-color 350ms'
    li.style.padding = '3px'
    li.style.margin = '2px'
    li.style.borderRadius = '3px'
    li.style.backgroundColor = '#333'

    elmBuild(li,
      ['div',
        {
          style: {
            float: 'left'
          }
        },
        ['div', { classList: ['onhover'] }, {
          style: {
            marginTop: '-0.25em',
            display: 'none'
          }
        }, ['span', '🅖', {
          style: {
            color: '#222',
            fontSize: '2.0em'
          }
        }]],
        ['div', { classList: ['onout'] }, ['span', '📄', {
          style: {
            fontSize: '1.5em'
          }
        }]]
      ],
      ['div', {
        style: {
          float: 'left',
          marginLeft: '5px'
        }
      },
        `${hit.result.primary_artist.name} • ${hit.result.title_with_featured}`,
        ['br'],
        ['span', { style: { fontSize: '0.7em' } }, `👁 ${genius.f.metricPrefix(hit.result.stats.pageviews, 1)} ${hit.result.lyrics_state}`]
      ],
      ['div', { style: { clear: 'left' } }]
    )

    li.dataset.hit = JSON.stringify(hit)

    li.addEventListener('click', onclick)
    li.addEventListener('mouseover', mouseover)
    li.addEventListener('mouseout', mouseout)
    ol.appendChild(li)
  })
}

function loremIpsum () {
  const random = (x) => 1 + parseInt(Math.random() * x)

  // Create a container for the entire content
  const container = document.createElement('div')

  for (let v = 0; v < Math.max(3, random(5)) + 4; v++) {
    for (let b = 0; b < random(6); b++) {
      const lineContainer = document.createElement('span')
      lineContainer.classList.add('gray')

      for (let l = 0; l < random(9); l++) {
        for (let w = 0; w < 1 + random(10); w++) {
          for (let i = 0; i < 1 + random(7); i++) {
            // Create and append 'x' text node
            const xTextNode = document.createTextNode('x')
            lineContainer.appendChild(xTextNode)
          }

          // Add the whitespace span
          const whiteSpaceSpan = document.createElement('span')
          whiteSpaceSpan.classList.add('white')
          whiteSpaceSpan.textContent = '\u00A0' // Non-breaking space
          lineContainer.appendChild(whiteSpaceSpan)
        }

        // Add line break (br) after each set
        lineContainer.appendChild(document.createElement('br'))
      }

      // Append the line container to the main container
      container.appendChild(lineContainer)

      // Add a line break after each section
      container.appendChild(document.createElement('br'))
    }
  }

  return container // Return the main container with all generated elements
}

function createSpinner (spinnerHolder) {
  const lyricscontainer = document.getElementById('lyricscontainer')

  const rect = lyricscontainer.getBoundingClientRect()
  spinnerHolder.style.left = ''
  spinnerHolder.style.right = '0px'
  spinnerHolder.style.top = (lyricscontainer.style.top ? (parseInt(lyricscontainer.style.top) + 50) + 'px' : 0) || '120px'
  spinnerHolder.style.width = lyricscontainer.style.width || (rect.width - 1 + 'px')
  spinnerHolder.style.maxHeight = (lyricscontainer.getBoundingClientRect().height - 50) + 'px'
  spinnerHolder.style.overflow = 'hidden'

  const spinner = spinnerHolder.appendChild(document.createElement('div'))
  spinner.classList.add('loadingspinner')
  spinner.style.marginLeft = (rect.width / 2) + 'px'

  const lorem = loremIpsum()
  lorem.classList.add('lorem')
  spinnerHolder.appendChild(lorem)

  function resizeSpinner () {
    const spinnerHolder = document.querySelector('.loadingspinnerholder')
    const lyricscontainer = document.getElementById('lyricscontainer')
    if (spinnerHolder && lyricscontainer) {
      const rect = lyricscontainer.getBoundingClientRect()
      spinnerHolder.style.top = (lyricscontainer.style.top ? (parseInt(lyricscontainer.style.top) + 50) + 'px' : 0) || '120px'
      spinnerHolder.style.width = lyricscontainer.style.width || (rect.width - 1 + 'px')
      const loadingSpinner = spinnerHolder.querySelector('.loadingspinner')
      if (loadingSpinner) {
        loadingSpinner.style.marginLeft = (rect.width / 2) + 'px'
      }
    } else {
      window.clearInterval(resizeSpinnerIV)
    }
  }
  const resizeSpinnerIV = window.setInterval(resizeSpinner, 1000)

  return spinner
}

function configLyricsWidth (div) {
  // Input: lyrics width
  const label = div.appendChild(document.createElement('label'))
  label.setAttribute('for', 'input85654')
  label.appendChild(document.createTextNode('Lyrics width: '))

  const input = div.appendChild(document.createElement('input'))
  input.type = 'text'
  input.id = 'input85654'
  input.size = 4
  GM.getValue('lyricswidth', '40%').then(function (v) {
    input.value = v
  })

  const onChange = function onChangeListener () {
    const m = input.value.match(/\d+%/)
    if (m && m[0]) {
      lyricsWidth = m[0]
      GM.setValue('lyricswidth', lyricsWidth).then(function () {
        addLyrics(true)
      })
      input.value = lyricsWidth
    } else {
      window.alert('Please set a percentage e.g. 40%')
    }
  }
  input.addEventListener('change', onChange)
}

const getNodeHTML = (e) => {
  if (e) {
    return e.__shady_native_innerHTML || e.innerHTML || ''
  }
  return ''
}
let activeMedia = null
async function setupMain () {
  let resizeRequested = false
  lyricsWidth = await GM.getValue('lyricswidth', '40%')
  let runid = 0
  let lastNodeString = ''

  const mutationObserver = new MutationObserver(() => {
    const songInfoNodes = getSongInfoNodes()
    const nodeString = `${(getNodeHTML(songInfoNodes?.titleNode) || '')}|${(songInfoNodes?.artistNodes?.map(e => getNodeHTML(e))?.join(',') || '')}`
    if (lastNodeString === nodeString) return
    lastNodeString = nodeString
    if (nodeString.length > 1 && songInfoNodes.isSongQueuedOrPlaying) {
      console.log('debug: Youtube Music Genius Lyrics - Song Info', songInfoNodes, nodeString)
      if (genius.option.autoShow) {
        addLyrics(true)
      } else {
        addLyricsButton()
      }
      if (resizeRequested) {
        resizeRequested = false
        resize()
      }
    }
  })

  const onMediaChanged_ = (runid_) => {
    if (runid_ !== runid) return
    const songInfoNodes = getSongInfoNodes()
    const titleNode = songInfoNodes?.titleNode
    if (titleNode) {
      mutationObserver.observe(titleNode, { attributes: true, childList: true, subtree: true, characterData: true, attributeFilter: ['media-changed-at', 'title'] })
      titleNode.setAttribute('media-changed-at', Date.now())
    } else {
      activeMedia = null
    }
  }

  const onMediaChanged = (evt) => {
    const target = evt?.target
    if (!(target instanceof HTMLMediaElement)) return
    if (runid > 1e9) runid = 9
    const runid_ = ++runid
    activeMedia = target
    Promise.resolve(runid_).then(onMediaChanged_).catch(console.warn)
  }

  const onResizeRequested = (evt) => {
    if (runid > 1e9) runid = 9
    const runid_ = ++runid
    lastNodeString = ''
    resizeRequested = true
    Promise.resolve(runid_).then(onMediaChanged_).catch(console.warn)
  }

  document.addEventListener('durationchange', onMediaChanged, true)
  document.addEventListener('loadedmetadata', onMediaChanged, true)
  document.addEventListener('canplay', onMediaChanged, true)
  document.addEventListener('canplaythrough', onMediaChanged, true)
  document.addEventListener('emptied', onMediaChanged, true)
  document.addEventListener('abort', onMediaChanged, true)
  document.addEventListener('error', onMediaChanged, true)
  document.addEventListener('ended', onMediaChanged, true)
  document.addEventListener('genius-resize-requested', onResizeRequested, true)
  Promise.resolve(++runid).then(onMediaChanged_)
}

function main () {
  // do nothing
}

function styleIframeContent () {
  if (genius.option.themeKey === 'genius') {
    genius.style.enabled = true
    genius.style.setup = () => {
      genius.style.setup = null // run once; set variables to genius.styleProps
      if (genius.option.themeKey !== 'genius') {
        genius.style.enabled = false
        return false
      }

      const ytdApp = document.querySelector('ytmusic-app') || document.body
      if (!ytdApp) return

      const cStyle = window.getComputedStyle(ytdApp)
      let background = cStyle.getPropertyValue('--ytmusic-general-background-c')
      let color = cStyle.getPropertyValue('--ytmusic-text-primary')
      let slbc = cStyle.getPropertyValue('--ytd-searchbox-legacy-button-color')
      const linkColor = cStyle.getPropertyValue('--yt-spec-call-to-action') || cStyle.getPropertyValue('--ytmusic-text-primary')
      const annotatedSpanBgColor = cStyle.getPropertyValue('--yt-spec-static-overlay-icon-inactive') || cStyle.getPropertyValue('--yt-spec-static-overlay-text-secondary') || ''
      const annotatedSpanBgColorActive = cStyle.getPropertyValue('--yt-spec-static-overlay-button-hover') || cStyle.getPropertyValue('--yt-spec-static-overlay-button-primary') || ''

      if (typeof background === 'string' && typeof color === 'string' && background.length > 3 && color.length > 3) {
        // do nothing
      } else {
        background = null
        color = null
      }

      if (typeof slbc === 'string') {
        // do nothing
      } else {
        slbc = null
      }

      Object.assign(genius.styleProps, {
        '--egl-background': (background === null ? '' : `${background}`),
        '--egl-color': (color === null ? '' : `${color}`),
        '--egl-infobox-background': (slbc === null ? '' : `${slbc}`),
        '--egl-link-color': (`${linkColor}`),
        '--egl-annotated-span-bgcolor': (`${annotatedSpanBgColor}`),
        '--egl-annotated-span-bgcolor-active': (`${annotatedSpanBgColorActive}`)
      })
      return true
    }
  } else {
    genius.style.enabled = false
    genius.style.setup = null
  }
}

const isRobotsTxt = document.location.href.indexOf('robots.txt') >= 0
const defaultOptions = {
  enableStyleSubstitution: true,
  normalizeClassV2: true,
  cacheHTMLRequest: true
}

const genius = geniusLyrics({
  GM,
  scriptName: SCRIPT_NAME,
  scriptIssuesURL: 'https://github.com/cvzi/Youtube-Music-Genius-Lyrics-userscript/issues',
  scriptIssuesTitle: 'Report problem: github.com/cvzi/Youtube-Music-Genius-Lyrics-userscript/issues',
  domain: 'https://music.youtube.com/',
  emptyURL: 'https://music.youtube.com/robots.txt',
  config: [configLyricsWidth],
  main,
  setupMain,
  addCss,
  listSongs,
  showSearchField,
  addLyrics,
  hideLyrics,
  getCleanLyricsContainer,
  setFrameDimensions,
  onResize,
  createSpinner,
  defaultOptions
})

genius.onThemeChanged.push(styleIframeContent)

if (isRobotsTxt === false) {
  GM.registerMenuCommand(SCRIPT_NAME + ' - Show lyrics', () => addLyrics(true))
  GM.registerMenuCommand(SCRIPT_NAME + ' - Options', () => genius.f.config())

  function videoTimeUpdate (ev) {
    if (genius.f.isScrollLyricsEnabled()) {
      if ((ev || 0).target.nodeName === 'VIDEO') updateAutoScroll()
    }
  }

  window.addEventListener('message', function (e) {
    const data = ((e || 0).data || 0)
    if (data.iAm === SCRIPT_NAME && data.type === 'lyricsDisplayState') {
      let isScrollLyricsEnabled = false
      if (data.visibility === 'loaded' && data.lyricsSuccess === true) {
        isScrollLyricsEnabled = genius.f.isScrollLyricsEnabled()
      }
      lyricsDisplayState = data.visibility
      if (isScrollLyricsEnabled === true) {
        document.addEventListener('timeupdate', videoTimeUpdate, true)
      } else {
        document.removeEventListener('timeupdate', videoTimeUpdate, true)
      }
    }
  })

  function autoscrollenabledChanged () {
    // when value is configurated in any tab, this function will be triggered in all tabs by Userscript Manager
    if (typeof genius.f.updateAutoScrollEnabled !== 'function') return
    window.requestAnimationFrame(() => {
      // not execute for all foreground and background tabs, only execute when the tab is visibile / when the tab shows
      genius.f.updateAutoScrollEnabled().then(() => {
        let isScrollLyricsEnabled = false
        if (lyricsDisplayState === 'loaded') {
          isScrollLyricsEnabled = genius.f.isScrollLyricsEnabled()
        }
        if (isScrollLyricsEnabled === true) {
          document.addEventListener('timeupdate', videoTimeUpdate, true)
        } else {
          document.removeEventListener('timeupdate', videoTimeUpdate, true)
        }
      })
    })
  }

  if (typeof GM_addValueChangeListener === 'function') {
    GM_addValueChangeListener('autoscrollenabled', autoscrollenabledChanged)
  }
}
