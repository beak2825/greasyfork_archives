// ==UserScript==
// @name        Image Popup - humaniplex.com
// @namespace   Violentmonkey Scripts
// @match       https://www.humaniplex.com/*
// @match       https://rentry.org/hxx
// @match       https://rentry.co/hxx
// @grant       none
// @version     1.0.7
// @author      -
// @description View images on HX in a glightbox popup
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/419673/Image%20Popup%20-%20humaniplexcom.user.js
// @updateURL https://update.greasyfork.org/scripts/419673/Image%20Popup%20-%20humaniplexcom.meta.js
// ==/UserScript==

let $head = document.querySelector('head')
let $link = document.createElement('link')
$link.rel = 'stylesheet'
$link.href = '//cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css'
let $script = document.createElement('script')
$script.type = 'text/javascript'
$head.append($link)
$head.append($script)
$script.onload = () => {
  // images in gallery
  document.querySelectorAll('.ph_cont .ph a').forEach((a) => {
    a.className += ' glightbox'
  })

  // images in /photos
  if (location.pathname.match(/^\/photos\/$/)) {
    document.querySelectorAll('table[align=center] td a').forEach((a) => {
      a.className += ' glightbox'
    })
  }

  // add blank profile pic if missing in /profiles/:user
  if (location.pathname.match(/^\/profiles\/.+$/)) {
    let $td = document.querySelector('tbody tbody tr[valign=top] td')
    if ($td && $td.innerText == "") {
      let $b = document.querySelector('tbody tbody tr[valign=top] td+td font b')
      let name = $b.innerText
      $td.innerHTML = `<div class="photo"><a href="/photos/`+name+`"><img style="width:120px;" src="/images/icons/icon_60x60_chick.gif"/></a></div>`
    }
  }

  // images in /classifieds/*
  if (location.pathname.match(/^\/classifieds\/.+$/)) {
    document.querySelectorAll('table.outline a img').forEach(($img) => {
      $img.removeAttribute('onclick')
      $img.parentNode.className += ' glightbox'
    })
  }

  // add link to own profile when logged in
  let $b = document.querySelector("form[action='https://www.humaniplex.com/login.html'] td[align=center] b")
  if ($b) {
    let name = $b.innerText
    let profileLink = '<a href="/profiles/' + name + '">' + name + '</a>'
    $b.innerHTML = profileLink
  }

  // init lightbox
  let lightbox = GLightbox({})
}
$script.src = '//cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js'


// Add CSS tweaks for https://rentry.org/hxx
  let css = `
.ntable th:nth-child(1) {
  width: 20%;
}

.ntable th:nth-child(3) {
  width: 20%;
}
`
if (location.hostname == 'rentry.org' || location.hostname == 'rentry.co') {
  let style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}
