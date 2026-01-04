// ==UserScript==
// @name     Letamaio notizie page hosted
// @version  1.0.1
// @grant    none
// @namespace bladho
// @license MIT
// @description lnd
// @include https://*.everyeye.it/notizie/*
// @downloadURL https://update.greasyfork.org/scripts/490527/Letamaio%20notizie%20page%20hosted.user.js
// @updateURL https://update.greasyfork.org/scripts/490527/Letamaio%20notizie%20page%20hosted.meta.js
// ==/UserScript==


const parteSinistra = document.querySelector('.parte-sinistra')
if (parteSinistra) {
  parteSinistra.style.width = '100%'
  parteSinistra.style.maxWidth = '100%'
  const mid =  document.querySelector('.cont_all');
  mid.style.minWidth = '1rem';
  mid.style.width = '50%';
}

const rimuoviDiv = selectors => {
	selectors.forEach(selector => {
  	const div = document.querySelector(selector)
    if (!div) {
      return;
    }
    console.log(div)
    div.parentElement.removeChild(div)
  })
}

rimuoviDiv([
  '.masted',
  '.parte-destra',
    '.hypecombo',
  '.p-dealLink',
  '.p-eticlabel',
  '#speakup-player',
  ])

