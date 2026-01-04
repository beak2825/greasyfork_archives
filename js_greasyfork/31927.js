// ==UserScript==
// @name         imgur.com inline gif comments
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Inlines all the gif comments. No more hovering to see the gif!
// @author       AndreTheHunter
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @match        https://imgur.com/gallery/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/31927/imgurcom%20inline%20gif%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/31927/imgurcom%20inline%20gif%20comments.meta.js
// ==/UserScript==
/* jshint esnext: false, esversion: 6, asi: true */

//TODO ignore href query params when filtering

GM_addStyle('.caption { max-height: initial !important } .linkified img,video { max-width: 651px }')

function suffixes (...args) {
  return args
  .map(suffix => `[href$=".${suffix}"]`)
  .join(',')
}

const imgFilter = suffixes('gif', 'png', 'jpeg', 'jpg')
const gifvFilter = suffixes('gifv')
const mp4Filter = suffixes('mp4')

function replaceHrefSuffix (e, newSuffix) {
  return e.href.replace(/\.\w+$/g, '.' + newSuffix)
}

function replaceImg(e) {
  $(e)
    .filter(imgFilter)
    .replaceWith(function() {
      return $('<img>', {src: this.href})
    })
}

function replaceGifv(e) {
  $(e)
    .filter(gifvFilter)
    .replaceWith(function () {
      const source = $('<source>', {
        src: replaceHrefSuffix(this, 'mp4'),
        type: 'video/mp4'
      })
      return $('<video>', {
        poster: replaceHrefSuffix(this, 'jpg'),
        preload: 'auto',
        autoplay: 'autoplay',
        muted: 'muted',
        loop: 'loop'
      }).append(source)
    })
}

function replaceMp4(e) {
  $(e)
    .filter(mp4Filter)
    .replaceWith(function () {
      const source = $('<source>', {
        src: this.href,
        type: 'video/mp4'
      })
      return $('<video>', {
        preload: 'auto',
        autoplay: 'autoplay',
        muted: 'muted',
        loop: 'loop'
      }).append(source)
    })
}

$(document).arrive('#comments .linkified a', (e) => {
  replaceImg(e)
  replaceGifv(e)
  replaceMp4(e)
})