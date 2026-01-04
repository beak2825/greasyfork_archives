// ==UserScript==
// @name            Chaturbate Animate Thumbnail
// @name:de         Chaturbate Miniaturansicht Animieren
// @name:fr         Vignette Animée Chaturbate
// @name:it         Miniatura Animata Chaturbate
// @author          iXXX94
// @namespace       https://sleazyfork.org/users/809625-ixxx94
// @icon            https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// @description     Animated the thumbnail of a Chaturbate room on mouse hover
// @description:de  Animieren die miniaturansicht eines Chaturbate-raums beim maus über
// @description:fr  Anime le vignette d'une salle Chaturbate au survol de la souris
// @description:it  Animata la miniatura di una stanza Chaturbate al passaggio del mouse
// @copyright       2021, iXXX94 (https://sleazyfork.org/users/809625-ixxx94)
// @license         MIT
// @version         2.0.0
// @homepageURL     https://sleazyfork.org/scripts/431581-chaturbate-animate-thumbnail
// @homepage        https://sleazyfork.org/scripts/431581-chaturbate-animate-thumbnail
// @supportURL      https://sleazyfork.org/scripts/431581-chaturbate-animate-thumbnail/feedback
// @require         https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2.1.0/dist/index.min.js
// @require         https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @match           *://*.chaturbate.com/*
// @exclude-match   *://status.chaturbate.com/*
// @exclude-match   *://support.chaturbate.com/*
// @run-at          document-start
// @inject-into     page
// @downloadURL https://update.greasyfork.org/scripts/431581/Chaturbate%20Animate%20Thumbnail.user.js
// @updateURL https://update.greasyfork.org/scripts/431581/Chaturbate%20Animate%20Thumbnail.meta.js
// ==/UserScript==

/* global $, VM */

(() => {
  const addStyle = () => {
    $('#room_list') // to be able to scale, on room list
      .css('display', 'inline-flex')
      .css('overflow', 'visible')
      .css('white-space', 'nowrap')
      .css('align-content', 'flex-start')
      .css('justify-content', 'flex-start')
      .css('align-items', 'flex-start')
      .css('position', 'relative')
      .css('left', '0')
      .css('flex-wrap', 'wrap')
    $('#room_list .room_list_room')
      .css('transition', 'transform .1s ease-in-out')
    $('.isIpad #room_list .room_list_room *, #broadcasters .room_list_room *')
      .css('user-select', 'none')
      .css('-webkit-touch-callout', 'none')
  }

  const scale = (element, on) => {
    if ($(element).parent('#room_list').length > 0) { // only on room list
      if (on) {
        $(element)
          .css('transform-origin', 'center center')
          .css('transform', 'translateX(0px) scale(1.2)')
          .css('z-index', '999')
      } else {
        $(element)
          .css('transform-origin', 'center center')
          .css('transform', 'translateX(0px) scale(1)')
          .css('z-index', '0')
      }
    }
  }

  const setThumbnail = (element) => {
    const name = $(element).find('> a').data('room') ? $(element).find('> a').data('room') : $(element).find('> .user-info > .username > a').text().replace(/^\s/g, '')
    const thumbnail = $(element).find('> a img')

    $(thumbnail)
      .attr('src', `https://cbjpeg.stream.highwebmedia.com/minifwap/${name}.jpg?f=${Date.now()}`)
  }

  VM.observe(document.documentElement || document.body, () => {
    const rooms = $('#discover_root .room_list_room, #room_list .room_list_room, #broadcasters .room_list_room, .followedContainer .roomElement')

    if (rooms.length > 0) { // if rooms exists
      addStyle()
      $(rooms).each((index, element) => { // for each room
        let timer

        $(element).on({
          mouseover: () => { // mouse start
            scale(element, true)
            timer = setInterval(() => setThumbnail(element), 83) // animate thumbnail
          },
          mouseout: () => { // mouse stop
            scale(element, false)
            clearInterval(timer) // stop animate thumbnail
            timer = undefined
          },
          touchstart: () => { // touch start
            scale(element, true)
            timer = setInterval(() => setThumbnail(element), 166) // animate thumbnail
          },
          touchend: () => { // touch stop
            scale(element, false)
            clearInterval(timer) // stop animate thumbnail
            timer = undefined
          }
        })
      })

      // keep observing
      return false
    }
  })
})()
