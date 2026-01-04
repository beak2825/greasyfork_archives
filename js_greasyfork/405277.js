// ==UserScript==
// @name         asmhentai next page
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  enhance asmhentai with auto loading
// @author       Lin
// @match        https://asmhentai.com/gallery/*
// @grant        none
// @require https://cdn.staticfile.org/blissfuljs/1.0.6/bliss.min.js
// @downloadURL https://update.greasyfork.org/scripts/405277/asmhentai%20next%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/405277/asmhentai%20next%20page.meta.js
// ==/UserScript==


(function ($) {
  'use strict';
  let body = document.body
  let button = document.createElement('button')
  button.textContent = 'next'
  button.style.position = 'fixed'
  button.style.right = '10px'
  button.style.top = '40%'
  button.style.width = '80px'
  button.style.height = '60px'
  body.appendChild(button)
  let url = location.href
  let num = +url.match(/(\d+?)\/$/)[1] // current page
  button.addEventListener('click', function () {
    location.href = url.replace(/(\d+?)\/$/, ++num)
  })
  let currentImg = $('#fimg').dataset.src || $('#fimg').src
  let container = $('#content .mid_rd')
  // flex-direction
  container.style.flexDirection = 'column'
  let imgUrl = getImgUrl(currentImg)
  let maxPage = getMaxPage()
  function loadImage(page) {
    let el = $.create('img', {
      className: 'lazy no_image',
      src: imgUrl(page),
      title: `page ${page}`,
      events: {
        onload() {
          console(page + 'loaded')
        }
      }
    })
    container.appendChild(el)
  }
  for (let i = 1; i <= 5; i++) {
    loadImage(++num)
  }
  let documentElement = document.documentElement
  let scrollDebounce = debounce(function() {
    if (documentElement.scrollTop + documentElement.clientHeight + 2000 > documentElement.scrollHeight) {
      for (let i = 1; i <= 5; i++) { // todo
        loadImage(++num)
        if (num >= maxPage) {
          return document._.unbind({
            scroll: scrollDebounce
          })
        }
      }
    }
  }, 600)
  document._.bind({
    scroll: scrollDebounce
  })
})(Bliss);


function getImgUrl(url) {
  let arr = url.split(/\d+?\./)
  return function (page) {
    return arr[0] + page + '.' + arr[1]
  }
}
function getMaxPage() {
  let option = $('.btm_rd .tp')
  return option.textContent
}

function debounce(fn, wait) {
  let timer = null;
  return function () {
    let context = this
    let args = arguments
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, wait)
  }
}
