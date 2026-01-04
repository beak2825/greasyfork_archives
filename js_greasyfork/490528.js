// ==UserScript==
// @name     Letamaio redirect hosted
// @version  1.0.1
// @grant    none
// @description letamaio redirect
// @namespace bladho
// @license MIT
// @include https://*.everyeye.it/*
// @downloadURL https://update.greasyfork.org/scripts/490528/Letamaio%20redirect%20hosted.user.js
// @updateURL https://update.greasyfork.org/scripts/490528/Letamaio%20redirect%20hosted.meta.js
// ==/UserScript==

/*
const rimuoviLetame = selector => {
  const letami = Array.from(document.querySelectorAll(selector))
  letami.forEach(letame => letame.parentElement.removeChild(letame))
}

const massRimuoviLetame = letami => {
  letami.forEach(letame => rimuoviLetame(letame))
}

const letami = [
  '.pre-annuncio',
  '#featured',
  '#twitchHomepage',
  '.ffilm',
  '.fserial',
  '.fanime',
  '.cont_articoli_magazine',
  '#annunciTop',
  '.bottoni-home',
  '.contenuti_home .colonna_flex:nth-of-type(2)',
]
massRimuoviLetame(letami)*/


const links = document.querySelectorAll('a')
const regex = /^https:\/\/[a-z]+\.everyeye\.it\/$/i
if (regex.test(window.location.href)) {
	window.location.href += 'notizie/'
}

links.forEach(link => {
	if (regex.test(link.href)) {
      link.href += 'notizie/'
  }
})

setInterval(() => {
  document.querySelector('body').style.overflow = 'scroll'
}, 200)

