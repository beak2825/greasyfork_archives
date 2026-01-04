// ==UserScript==
// @name         Youtube - Hide default playlists
// @description  Hide the default playlists in the navigation on the left side of Youtube
// @version      1.9
// @namespace    https://openuserjs.org/users/cuzi
// @author       cuzi
// @copyright    2020, cuzi (https://openuserjs.org/users/cuzi)
// @icon         https://www.youtube.com/s/desktop/b4620429/img/favicon_144.png
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        GM.registerMenuCommand
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/412755/Youtube%20-%20Hide%20default%20playlists.user.js
// @updateURL https://update.greasyfork.org/scripts/412755/Youtube%20-%20Hide%20default%20playlists.meta.js
// ==/UserScript==

/* globals GM  */
(function () {
  'use strict'

  let hide = ['history', 'your_videos', 'your_movies', 'watch_later', 'liked_videos']
  let alwaysShowMore = false
  let sortingEnabled = false
  const icons = {
    library: ['m11763-63V7zm713H4V6H3v15h15v-1zm3-2H6V3h15v15zM717h13V4H7v13z'],
    history: ['/feed/history', 'M14.951013V7h2v5l4.49-1.7zM2212c05-4-1010S217h1c04.04999', 'M14,16L10,13V7h2v5l4,2L14,16zM22,12c0,5-4,10-10,10S2,17,2,12h1c'],
    your_channel: ['/channel/', 'M3,3v18h18V3H3zM4,20c0-2,2-5,7-5s6,2,7,5H4zM9,10c0-1,1-3,3-3s3,1,3,3c0'],
    your_videos: ['https://studio.youtube.com/channel/', 'm10864-64V8zm11-5v18H3V3h18zm-11H4v16h16V4', 'M10,8l6,4l-6,4V8L10,8zM21,3v18H3V3H21zM20,4H4v16h'],
    your_movies: ['/feed/storefront?bp=', 'm10864-64V8zm11-5v18H3V3h18zm-11H4v16h16V4z', 'M22,4l-0-2L1,5L2,8v13h20V8H3L22,4zM5,9l1,3h3L8,9h2l1,3'],
    watch_later: ['/playlist?list=WL', 'M14.951013V7h2v5l4.49-1.7zM123c-4-94-99s4-4-9-4-9-9-9m0-1c5', 'M14,16L10,13V7h2v5l4,2L14,16zM12,3c-4,0-9,4-9,9s4,9,9,9'],
    download: ['/feed/downloads', 'M1718v1H6v-1h11zm-.5-6-.7-.7-3.7V4h-1v10l-3-3-.7-4z', 'M1718V19H6V18H17ZM16.4L15.7L1214V4H11V14L7.6L6.3L11.3L16.4Z'],
    liked_videos: ['M18,11h-4l1-4C16,5,15,4,14,4c-0,0-1,0-1,0L7,11H3v10h4h1h9c1'],
    show_more: ['m189-6.35-6-6.72-.715.655-5z', 'M12,15L5,9l0-0l5,5l5-5l0,0L12,15z'],
    show_less: ['M18.6128l-6.3.8L129l5.7z', '18,14,8.6,14.4,15,9.6,15'],
    custom_playlist: ['M227H2v1h20V7zm-95H2v-1h11v1zm04H2v-1h11v1zm23v-8l74-74z', 'M22,7H2v1h20V7zM13,12H2v-1h11V']
  }
  const allAvailable = ['library', 'history', 'your_channel', 'your_videos', 'your_movies', 'watch_later', 'liked_videos', 'download']
  const titles = { library: 'Library' }
  let showReloadAlready = false
  let firstRun = true
  let firstRunSorting = true

  function getPlaylistType (icon) {
    if (icon.querySelector('a[href]')) {
      const a = icon.querySelector('a[href]')
      for (const key in icons) {
        for (let i = 0; i < icons[key].length; i++) {
          if (a.href.indexOf(icons[key][i]) !== -1) {
            return key
          }
        }
      }
    }
    if (icon.querySelector('path')) {
      const s = icon.querySelector('path').getAttribute('d').replace(/\s+/g, '').replace(/(\d+)\.\d+/g, '$1')
      for (const key in icons) {
        for (let i = 0; i < icons[key].length; i++) {
          if (s.startsWith(icons[key][i])) {
            return key
          }
        }
      }
      return 'custom_unknown_playlist:' + s
    } else if (icon.querySelector('polygon')) {
      const s = icon.querySelector('polygon').getAttribute('points').replace(/\s+/g, '').replace(/(\d+)\.\d+/g, '$1')
      for (const key in icons) {
        for (let i = 0; i < icons[key].length; i++) {
          if (s.startsWith(icons[key][i])) {
            return key
          }
        }
      }
      return 'custom_unknown_playlist:' + s
    }
    return 'unexpanded_section'
  }

  function loadHide () {
    return Promise.all([
      GM.getValue('hide', hide.join(',')),
      GM.getValue('alwaysShowMore', alwaysShowMore),
      GM.getValue('sortingEnabled', sortingEnabled)
    ]).then(function allPromisesLoaded (values) {
      hide = values[0].split(',')
      alwaysShowMore = values[1]
      sortingEnabled = values[2]
    })
  }

  function toggleHidePlaylist (type, yes) {
    return loadHide().then(function () {
      if (yes && hide.indexOf(type) === -1) {
        hide.push(type)
      } else if (!yes) {
        hide = hide.filter(t => t !== type)
      }
      return GM.setValue('hide', hide.join(','))
    })
  }

  function toggleAlwaysShowMore (yes) {
    alwaysShowMore = !!yes
    return GM.setValue('alwaysShowMore', alwaysShowMore)
  }

  function toggleSorting (yes) {
    sortingEnabled = !!yes
    return GM.setValue('sortingEnabled', sortingEnabled)
  }

  function showReload () {
    if (showReloadAlready) {
      return
    }
    showReloadAlready = true
    GM.registerMenuCommand('\uD83D\uDD04 Reload to see changes', () => document.location.reload())
  }

  function hidePlaylists () {
    document.querySelectorAll('#section-items ytd-guide-entry-renderer').forEach(function (entryRenderer) {
      const type = getPlaylistType(entryRenderer)
      if (!(type in titles)) {
        titles[type] = entryRenderer.textContent.trim()
      }
      if (hide.indexOf(type) !== -1) {
        entryRenderer.remove()
      }
      if ((type === 'show_more' || type === 'show_less') && !('addedClick' in entryRenderer.dataset)) {
        entryRenderer.dataset.addedClick = 'yes'
        entryRenderer.addEventListener('click', function () {
          window.setTimeout(hidePlaylists, 50)
          window.setTimeout(hidePlaylists, 250)
          window.setTimeout(hidePlaylists, 500)
        })
      }
      if (type === 'show_more' && alwaysShowMore && !('alwaysOpened' in entryRenderer.dataset)) {
        entryRenderer.dataset.alwaysOpened = 'yes'
        entryRenderer.click()
      }
    })
    if (firstRun && document.querySelectorAll('#section-items ytd-guide-entry-renderer').length > 0) {
      // Show config
      firstRun = false
      for (let i = 0; i < allAvailable.length; i++) {
        const type = allAvailable[i]
        if (type.startsWith('custom_') || type.startsWith('show_')) {
          continue
        }
        const title = type in titles ? titles[type] : type
        if (hide.indexOf(type) === -1) {
          GM.registerMenuCommand('Hide: ' + title, () => toggleHidePlaylist(type, true).then(showReload))
        } else {
          GM.registerMenuCommand('Show: ' + title, () => toggleHidePlaylist(type, false).then(showReload))
        }
      }
      if (alwaysShowMore) {
        GM.registerMenuCommand('Disable "Always show more"', () => toggleAlwaysShowMore(false).then(showReload))
      } else {
        GM.registerMenuCommand('Enable "Always show more"', () => toggleAlwaysShowMore(true).then(showReload))
      }
    }
  }

  function sortPlaylists () {
    if (document.hidden) {
      return
    }

    if (firstRunSorting) {
      firstRunSorting = false
      if (sortingEnabled) {
        GM.registerMenuCommand('Disable "Sort playlists"', () => toggleSorting(false).then(showReload))
      } else {
        GM.registerMenuCommand('Enable "Sort playlists"', () => toggleSorting(true).then(showReload))
        return
      }
    }

    const guideEntries = []
    let showMore = null
    document.querySelectorAll('#section-items ytd-guide-entry-renderer').forEach(function (entryRenderer) {
      const type = getPlaylistType(entryRenderer)
      if (type.startsWith('custom_')) {
        const titleNode = entryRenderer.querySelector('.title')
        if (titleNode && titleNode.textContent) {
          const title = titleNode.textContent.toLowerCase().replace(/\d+/gm, s => s.padStart(10, '0'))
          guideEntries.push({ entryRenderer, title })
        }
      } else if (type === 'show_more') {
        showMore = entryRenderer
      }
    })
    guideEntries.sort((a, b) => a.title.localeCompare(b.title))
    guideEntries.forEach(function (entry) {
      guideEntries[0].entryRenderer.parentNode.appendChild(entry.entryRenderer)
    })
    if (showMore) {
      showMore.parentNode.parentNode.appendChild(showMore.parentNode)
    }

    if (document.querySelector('ytd-add-to-playlist-renderer ytd-playlist-add-to-option-renderer')) {
      const addToPlaylistEntries = []
      document.querySelectorAll('ytd-add-to-playlist-renderer ytd-playlist-add-to-option-renderer').forEach(function (renderer) {
        const title = renderer.querySelector('yt-formatted-string').textContent.toLowerCase().replace(/\d+/gm, s => s.padStart(10, '0'))
        addToPlaylistEntries.push({ entryRenderer: renderer, title })
      })
      addToPlaylistEntries.sort((a, b) => a.title.localeCompare(b.title))
      addToPlaylistEntries.forEach(function (entry) {
        addToPlaylistEntries[0].entryRenderer.parentNode.appendChild(entry.entryRenderer)
      })
    }
  }

  loadHide().then(function () {
    window.setInterval(hidePlaylists, 1000)

    sortPlaylists()
    if (sortingEnabled) {
      window.setInterval(sortPlaylists, 2000)
    } else {
      window.setInterval(sortPlaylists, 30000)
    }
  })
})()
