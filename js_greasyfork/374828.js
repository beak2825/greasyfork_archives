// ==UserScript==
// @name Hellfest.fr 2019 - Liens vers YouTube/Metal Archives 
// @version 1
// @namespace fdjgksfdkgjhjvdf
// @author Rosé Lui Zoumparterre
// @license WTFPL (aka LPRAB)
// @match https://www.hellfest.fr/programmation/*
// @grant none
// @description Ajoute des liens vers YouTube et Metal Archives pour les groupes sur la programmation.
// @downloadURL https://update.greasyfork.org/scripts/374828/Hellfestfr%202019%20-%20Liens%20vers%20YouTubeMetal%20Archives.user.js
// @updateURL https://update.greasyfork.org/scripts/374828/Hellfestfr%202019%20-%20Liens%20vers%20YouTubeMetal%20Archives.meta.js
// ==/UserScript==

function addStyle(css) {
    var head, style
    head = document.getElementsByTagName('head')[0]
    if (!head) { return }
    style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = css
    head.appendChild(style)
}

addStyle(`
  .card__text a {
    color: inherit;
  }
`)

const titles = document.querySelectorAll('h3.card__title')

titles.forEach(t => {
  const name = t.innerText
  
  const yt = document.createElement('a')
  yt.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(name)}`
  yt.target = '_blank'
  yt.title = `${name} sur YouTube`
  yt.appendChild(document.createTextNode("yt"));
  
  const ma = document.createElement('a')
  ma.href = `https://www.metal-archives.com/search?searchString=${encodeURIComponent(name)}&type=band_name`
  ma.target = '_blank'
  ma.title = `${name} sur Metal Archives`
  ma.appendChild(document.createTextNode("ma"));
  
  const links = document.createElement('div')
  links.appendChild(yt)
  links.appendChild(document.createTextNode(" - "))
  links.appendChild(ma)
  t.parentElement.appendChild(links)
})