// ==UserScript==
// @name     Letamaio anime nospoiler hosted
// @version  1.0.7
// @grant    none
// @description letamaio redirect
// @namespace bladho
// @license MIT
// @include https://anime.everyeye.it/notizie/*
// @downloadURL https://update.greasyfork.org/scripts/490529/Letamaio%20anime%20nospoiler%20hosted.user.js
// @updateURL https://update.greasyfork.org/scripts/490529/Letamaio%20anime%20nospoiler%20hosted.meta.js
// ==/UserScript==


const eliminaNotizia = notizia => {
        if(notizia.parentElement) {
          notizia.parentElement.removeChild(notizia);
        }
}
const spoiler = [
  /dragon ball/i,
  /spoiler/i,
  /boruto/i,
  /one piece/i,
  /Dandadan/i,
  /Solo Leveling/i,
  /vinland/i,
  /hunter x hunter/i,
  /epilogo/i,
]

const giochi = [
  /cosplay/i,
  /modella/i,
  /fan art/i,
  /art ?work/i,
  /illustrazione/i,
  /\bfan\b/,
  /da [0-9]+ euro/i,
  /chi vincerebbe in uno scontro/i,
  /\bfigure\b/i,
  /fanmade/i,
  /sapevate che/i,
  /10/i,
  /tre/i,
  /tutt.+spiegat/i,
  /isekai/i,
  /\d.+(anime|personaggi|film)/i,
  /scopri/i,
  /qual+\?/i,
  /doppiat/i,
  /ricordate.+?/i,
  /fanart/i,
  /ispirat/i,
  /cerchiamo/i,
  /my hero academia/i,
  /lo sapevate/i,
  ]
const streamers = [
]

const aziende = [
]

const  bannedTitle = [
].concat(giochi).concat(streamers).concat(aziende)


const bannedMini = [
      /curiosità/i,
      
].concat(giochi).concat(streamers).concat(aziende)

const bannedSpanTag = [
  /marvel/i,
].concat(giochi).concat(streamers).concat(aziende)
const nascosti = []
let nSpoiler = 0
const arrNotizie = Array.from(document.querySelectorAll('article'))
const sizeIniziale = arrNotizie.length
 
arrNotizie.forEach(notizia => {
  let eliminato = false
  const testiNotizia = notizia.querySelector('.testi_notizia')
  const aNotizia = notizia.querySelector('a')
  const spanTipoNotizia = testiNotizia.querySelector('span')
  const mini = spanTipoNotizia.firstChild.innerText; //dove appare scritto mini guida e merda
  const h2 = testiNotizia.querySelector('h2');
  const a = testiNotizia.querySelector('a');
  //testi 
  const spanTag = aNotizia.querySelector('span')?.innerText // dove appare scritto il nome del gioco o altro, in arancione
  const miniText = spanTipoNotizia.firstChild.textContent //dove appare scritto mini guida e merda
  const titolo = testiNotizia.querySelector('h2').innerText; 
  const testi = [spanTag, miniText, titolo]

 	let isSpoiler = notizia.querySelector('.spoilerx')
  if (!isSpoiler) {
    isSpoiler = spoiler.map(ele => {
    return testi.map(testo => ele.test(testo)).reduce((acc, ele) => (acc || ele), false)
  }).reduce((acc, ele) => (acc || ele), false)
  }
  


  if (isSpoiler) {
    nSpoiler++
    eliminaNotizia(notizia)
  }
  if (!isSpoiler) {
    eliminato = bannedTitle.map(ele => ele.test(titolo)).reduce((acc, ele) => (acc || ele), false)
  
    if (!eliminato) {
      eliminato = bannedMini.map(ele => ele.test(miniText)).reduce((acc, ele) => (acc || ele), false)
    }
  
    if (!eliminato) {
      eliminato = bannedSpanTag.map(ele => ele.test(spanTag)).reduce((acc, ele) => (acc || ele), false)
    }
    
    if(eliminato) {
      nascosti.push(a)
      eliminaNotizia(notizia)
    }
  }

})

if (!document.querySelector('#area-peto')) {
  const sizeFinale = document.querySelectorAll('article').length
  const div = document.createElement('div')
  div.id = 'area-peto'
  div.style.marginBottom = '2rem'
  const cima = document.querySelector('.parte-sinistra')
  const h1 = document.createElement('h1')
  h1.innerHTML = sizeFinale+'/'+sizeIniziale+' notizie rimaste di cui '+ nSpoiler+ ' spoiler'
  div.prepend(h1)
  const button = document.createElement('button')
  button.style.backgroundColor = 'lightgray'
  button.style.margin = '2rem'
  button.style.padding = '0.5rem'
  button.style.border = '1px solid black'
  button.style.borderRadius = '4px'
  button.innerHTML = 'Mostra Merda'
  div.prepend(button)
 
  cima.prepend(div)
  button.addEventListener('click', evt =>{
    nascosti.forEach(ele => {
      ele.style.fontSize = '20px'
      cima.prepend(ele)
    })
  });
 
  button.addEventListener('mouseover', evt =>{
    button.style.backgroundColor = '#dddddd'
  });
  button.addEventListener('mouseleave', evt =>{
  button.style.backgroundColor = 'lightgray'
  });
}

