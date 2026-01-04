// ==UserScript==
// @name Streaming - DuckDuckGo - Streaming Helper (USw) (Organic) v.54
// @namespace greasyfork
// @version 54.001
// @description Pour ne pas perdre du temps avec des sites de streaming qui ne marche pas (Vert: c'est Bon / Gris: c'est Bof, Bof / Rouge: Méfiance...)
// @author decembre
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.duckduckgo.com/*
// @downloadURL https://update.greasyfork.org/scripts/438319/Streaming%20-%20DuckDuckGo%20-%20Streaming%20Helper%20%28USw%29%20%28Organic%29%20v54.user.js
// @updateURL https://update.greasyfork.org/scripts/438319/Streaming%20-%20DuckDuckGo%20-%20Streaming%20Helper%20%28USw%29%20%28Organic%29%20v54.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "duckduckgo.com" || location.hostname.endsWith(".duckduckgo.com"))) {
  css += `

  /* === 0- Stream - DuckDuckGo - Streaming Helper (USw) v.54 (new54)  (Organic) ===*/

  /* LAST VERSION AUTO UPDATE - 20230727.18.25 */
  /* NEW VERSION USW - 20230807.16.54 */


  .result__icon {
    background: #747171 !important;
  }

  /* VISITED */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a:first-of-type:visited {
      color: tomato !important;
  } 

  `;
}
if ((location.hostname === "duckduckgo.com" || location.hostname.endsWith(".duckduckgo.com"))) {
  css += `
  /* GOOD++ - TOLBECK LIKE */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ralzom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ralzom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ralzom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ralzom.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kanrak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.kanrak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kanrak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://kanrak.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zinzov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zinzov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zinzov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zinzov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bradza.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.bradza.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bradza.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://bradza.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dipdri.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dipdri.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dipdri.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dipdri.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ipdro.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ipdro.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ipdro.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ipdro.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.nodrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.nodrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nodrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://nodrav.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tosnov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.tosnov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tosnov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://tosnov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.robrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.robrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://robrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://robrov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.albrad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.albrad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://albrad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://albrad.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.xerov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.xerov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://xerov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://xerov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.moovtop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.moovtop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://moovtop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://moovtop.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zavzip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zavzip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zavzip.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://gomdax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.gomdax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.gomdax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://gomdax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://gomdax.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.govioz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.govioz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://govioz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://govioz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fonzir.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.fonzir.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fonzir.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://fonzir.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tokrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.tokrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tokrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://tokrav.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zakmav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zakmav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zakmav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zakmav.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.soponov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.soponov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://soponov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://soponov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rodorm.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.rodorm.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rodorm.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://rodorm.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.padolmi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.padolmi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://padolmi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://padolmi.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.niztal.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.niztal.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://niztal.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://niztal.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ilmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ilmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ilmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ilmiv.com/"] ,




  /* GOOD++ - TOLBECK LIKE */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vorviz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.vorviz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vorviz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://vorviz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ritrom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ritrom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ritrom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ritrom.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.brozlo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.brozlo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://brozlo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://brozlo.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.pilkol.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.pilkol.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://pilkol.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://pilkol.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.adivak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.adivak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://adivak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://adivak.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.epzir.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.epzir.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://epzir.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://epzir.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.brimav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.brimav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://brimav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://brimav.com/"] ,

  /* GOOD++ - TOLBECK LIKE */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.seyav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.seyav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://seyav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://seyav.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kidraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.kidraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kidraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://kidraz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kolrag.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.kolrag.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kolrag.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://kolrag.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.folmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.folmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://folmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://folmiv.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.savrod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.savrod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://savrod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://savrod.com/"] ,

  /* GOOD++ - TOLBECK LIKE */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fusov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.fusov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fusov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://fusov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fimior.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.fimior.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fimior.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://fimior.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lajma.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.lajma.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://lajma.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://lajma.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.morzid.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.morzid.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://morzid.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://morzid.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dozbob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dozbob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dozbob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dozbob.com/"] ,

  /* GOOD++ - TOLBECK LIKE */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.trifak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.trifak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://trifak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://trifak.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dapwop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dapwop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dapwop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dapwop.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.okmaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.okmaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://okmaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://okmaz.com/"] ,


  /* GOOD++ - TOLBECK LIKE */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wifrad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.wifrad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wifrad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://wifrad.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vogfo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.vogfo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vogfo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://vogfo.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kobiom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.kobiom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kobiom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://kobiom.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.frimiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.frimiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://frimiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://frimiv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.iramiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.iramiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://iramiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://iramiv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bramtiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.bramtiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bramtiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://bramtiv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.gofram.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.gofram.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://gofram.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://gofram.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dopriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dopriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dopriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dopriv.com/"] ,

  /* GOOD++ - TOLBECK LIKE */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rogzov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.rogzov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rogzov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://rogzov.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.prokiz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.prokiz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://prokiz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://prokiz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.noprak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.noprak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://noprak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://noprak.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.madroy.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.madroy.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://madroy.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://madroy.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.batiav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.batiav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://batiav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://batiav.com/"] ,

  /* GOOD++ - TOLBECK LIKE */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lakrof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.lakrof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://lakrof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://lakrof.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zorbov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zorbov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zorbov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zorbov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.valdap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.valdap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://valdap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://valdap.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.gabanov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.gabanov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://gabanov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://gabanov.com/"] ,






  /* GOOD++ - TOLBECK LIKE */


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sibrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.sibrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sibrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://sibrav.com/"] ,





  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.votark.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.votark.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://votark.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://votark.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ikfroz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ikfroz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ikfroz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ikfroz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vizvop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.vizvop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vizvop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://vizvop.com/"] ,

  /* GOOD++ - TOLBECK LIKE */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sapraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.sapraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sapraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://sapraz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.titrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.titrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://titrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://titrov.com/"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.prifaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.prifaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://prifaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://prifaz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.movpom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.movpom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://movpom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://movpom.com/"] ,


  /* GOOD++ - TOLBECK LIKE */


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.awdrip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.awdrip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://awdrip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://awdrip.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.pimtip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.pimtip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://pimtip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://pimtip.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kambad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.kambad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kambad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://kambad.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.biapoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.biapoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://biapoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://biapoz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vredap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.vredap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vredap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://vredap.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lomiox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.lomiox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://lomiox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://lomiox.com/"] ,

  /* GOOD++ - TOLBECK LIKE */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.edmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.edmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://edmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://edmiv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.deksov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.deksov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://deksov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://deksov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.idvram.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.idvram.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://idvram.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://idvram.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.malgrim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.malgrim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://malgrim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://malgrim.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.nozgap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.nozgap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nozgap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://nozgap.com/"] ,


  /* GOOD++ - TOLBECK LIKE */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.domgrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.domgrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://domgrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://domgrav.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.faljam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.faljam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://faljam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://faljam.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.farliz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.farliz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://farliz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://farliz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.urmaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.urmaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://urmaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://urmaz.com/"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.apirv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.apirv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://apirv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://apirv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rodkov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.rodkov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rodkov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://rodkov.com/"] ,

  /* GOOD++ - TOLBECK LIKE */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kedarp.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.kedarp.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kedarp.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://kedarp.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.topkiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.topkiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://topkiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://topkiv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.edkoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.edkoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://edkoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://edkoz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.padlim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.padlim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://padlim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://padlim.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.eyobim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.eyobim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://eyobim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://eyobim.com/"] ,

  /* GOOD++ - TOLBECK LIKE */


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tiviob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.tiviob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tiviob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://tiviob.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.brafzo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.brafzo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://brafzo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://brafzo.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.krosvov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.krosvov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://krosvov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://krosvov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.movbor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.movbor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://movbor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://movbor.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lekrom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.lekrom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://lekrom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://lekrom.com/"] ,


  /* GooD++ - TOLBECK LIKE */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"]  {
      color: white !important;
      filter: grayscale(0.7);
  /*     background: linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 60%) repeat scroll 0 0%, -moz-repeating-linear-gradient(-45deg, #F0B500, #F0B500 7px, #FFD000 7px, #FFD000 14px) repeat scroll 0 0 transparent; */
  background: #138B12 !important;
  }

  `;
}
if ((location.hostname === "duckduckgo.com" || location.hostname.endsWith(".duckduckgo.com"))) {
  css += `
  /* GOOD BUT... - TOLBECK LIKE - DEVIENT */

  /* === ACTIF ENCORE MAIS MESSAGE  */



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.brodok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.brodok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://brodok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://brodok.com/"] ,



  /* =================== */


  /* GooD - TOLBECK LIKE - DEVIENT */


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.xakraf.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.xakraf.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://xakraf.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://xakraf.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.akroov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.akroov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://akroov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://akroov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.okrami.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.okrami.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://okrami.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://okrami.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wodioz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.wodioz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wodioz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://wodioz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yostav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.yostav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yostav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://yostav.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.eyozi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.eyozi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://eyozi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://eyozi.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.doksov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.doksov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://doksov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://doksov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kibriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.kibriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kibriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://kibriv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.matzam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.matzam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://matzam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://matzam.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.badzap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.badzap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://badzap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://badzap.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rodzop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.rodzop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rodzop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://rodzop.com/"] ,

   
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vadbak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.vadbak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vadbak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://vadbak.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yarkam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.yarkam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yarkam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://yarkam.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.alrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.alrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://alrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://alrav.com/"] , 

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.mobzax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.mobzax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://mobzax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://mobzax.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.pigraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.pigraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://pigraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://pigraz.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.uzrik.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.uzrik.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://uzrik.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://uzrik.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yortom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.yortom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yortom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://yortom.com/"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dubraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dubraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dubraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dubraz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.smitav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.smitav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://smitav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://smitav.com/"] ,




  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.droskop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.droskop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://droskop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://droskop.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.azmip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.azmip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://azmip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://azmip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://azmip.life/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.azmip.fr"] ,







  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.veksab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.veksab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://veksab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://veksab.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.pokoli.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.pokoli.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://pokoli.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://pokoli.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.govrad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.govrad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://govrad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://govrad.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dolorv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dolorv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dolorv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dolorv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.gramlap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.gramlap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://gramlap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://gramlap.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.norbaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.norbaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://norbaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://norbaz.com/"] ,




  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sakmiz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.sakmiz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sakmiz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://sakmiz.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lotriz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.lotriz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://lotriz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://lotriz.com/"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bremob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.bremob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bremob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://bremob.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dokral.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dokral.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dokral.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dokral.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wavob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.wavob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wavob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://wavob.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.pasiav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.pasiav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://pasiav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://pasiav.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.redziv.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.redziv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://redziv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://redziv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fianzax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.fianzax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fianzax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://fianzax.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.skimox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.skimox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://skimox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://skimox.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kradax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.kradax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kradax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://kradax.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.mokrof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.mokrof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://mokrof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://mokrof.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dridak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dridak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dridak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dridak.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kafrad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.kafrad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kafrad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://kafrad.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bapzor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.bapzor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bapzor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://bapzor.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.alkiom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.alkiom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://alkiom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://alkiom.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zambod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zambod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zambod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zambod.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.batkip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.batkip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://batkip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://batkip.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.brikoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.brikoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://brikoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://brikoz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.waymav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.waymav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://waymav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://waymav.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ravkom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ravkom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ravkom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ravkom.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sopror.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.sopror.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sopror.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://sopror.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.widrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.widrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://widrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://widrav.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kalorp.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.kalorp.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kalorp.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://kalorp.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.flandoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.flandoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://flandoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://flandoz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lofroz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.lofroz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://lofroz.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tivrod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.tivrod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tivrod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://tivrod.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vazpaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.vazpaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vazpaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://vazpaz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.daklom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.daklom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://daklom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://daklom.com/"] ,




  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.mivpak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.mivpak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://mivpak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://mivpak.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yavdi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.yavdi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yavdi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://yavdi.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.brikstok.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://brikstok.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://brikstok.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.brikstok.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.takpok.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://takpok.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://takpok.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.takpok.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voplav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.voplav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voplav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://voplav.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tobrok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.tobrok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tobrok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://tobrok.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.nopliv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.nopliv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nopliv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://nopliv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.katrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.katrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://katrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://katrov.com/"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dibrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dibrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dibrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dibrav.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.choupox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.choupox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://choupox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://choupox.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.nokrom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.nokrom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nokrom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://nokrom.com/"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tardok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.tardok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tardok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://tardok.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vokorn.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.vokorn.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vokorn.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://vokorn.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ovgap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ovgap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ovgap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ovgap.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.morvoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.morvoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://morvoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://morvoz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.champiov.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.champiov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.champiov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://champiov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://champiov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.pavdo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.pavdo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://pavdo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://pavdo.com/"] ,

  /* GooD - TOLBECK LIKE - DEVIENT */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.badrip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.badrip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://badrip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://badrip.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.komrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.komrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://komrav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://komrav.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.difiam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.difiam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://difiam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://difiam.com/"] ,




  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rikmod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.rikmod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rikmod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://rikmod.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.poblom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.poblom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://poblom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://poblom.com/"] ,

  /* GooD - TOLBECK LIKE - DEVIENT */



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voldim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.voldim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voldim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://voldim.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fridmax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.fridmax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fridmax.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://fridmax.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wavob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.wavob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wavob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://wavob.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.nofza.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.nofza.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nofza.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://nofza.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.grebak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.grebak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://grebak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://grebak.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zinroz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zinroz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zinroz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zinroz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.viabak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.viabak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://viabak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://viabak.com/"] ,

  /* GooD - TOLBECK LIKE - DEVIENT */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wavmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.wavmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wavmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://wavmiv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.blorog.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.blorog.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://blorog.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://blorog.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vadrom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.vadrom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vadrom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://vadrom.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rivbip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.rivbip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rivbip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://rivbip.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.toswi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.toswi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://toswi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://toswi.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lamdop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.lamdop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://lamdop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://lamdop.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lizdi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.lizdi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://lizdi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://lizdi.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.imzod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.imzod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://imzod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://imzod.com/"] ,

  /* GooD - TOLBECK LIKE - DEVIENT */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.nakrab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.nakrab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nakrab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://nakrab.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.saftim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.saftim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://saftim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://saftim.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.plokim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.plokim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://plokim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://plokim.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.maxtrab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.maxtrab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://maxtrab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://maxtrab.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.roplim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.roplim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://roplim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://roplim.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ziprov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ziprov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ziprov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ziprov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ofziv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ofziv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ofziv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ofziv.com/"] ,


  /* GooD - TOLBECK LIKE - DEVIENT */


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.quepom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.quepom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://quepom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://quepom.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tartog.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.tartog.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tartog.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://tartog.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kejrop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.kejrop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kejrop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://kejrop.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.drovoo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.drovoo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://drovoo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://drovoo.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dorcho.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dorcho.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dorcho.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dorcho.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.borbok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.borbok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://borbok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://borbok.com/"] ,

  /* GooD - TOLBECK LIKE - DEVIENT */



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.izorp.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.izorp.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://izorp.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://izorp.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fevloz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.fevloz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fevloz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://fevloz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zaviak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zaviak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zaviak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zaviak.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sabtam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.sabtam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sabtam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://sabtam.com/"] ,



  /* GooD - TOLBECK LIKE - DEVIENT */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ladrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ladrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ladrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ladrov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.baflox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.baflox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://baflox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://baflox.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.avbip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.avbip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://avbip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://avbip.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.slatok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.slatok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://slatok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://slatok.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vistrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.vistrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vistrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://vistrov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.narmid.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.narmid.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://narmid.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://narmid.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zibroz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zibroz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zibroz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zibroz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.evdod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.evdod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://evdod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://evdod.com/"] ,


  /* GooDTT - TOLBECK LIKE - DEVIENT */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] {
      color: gold !important;
  /*     filter: grayscale(0.7); */
  /*     background: linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 60%) repeat scroll 0 0%, -moz-repeating-linear-gradient(-45deg, #F0B500, #F0B500 7px, #FFD000 7px, #FFD000 14px) repeat scroll 0 0 transparent; */
  background: olive !important;
  }

  /* END ===================== GOOD- - TOLBECK LIKE - DEVIENT */
  `;
}
if ((location.hostname === "duckduckgo.com" || location.hostname.endsWith(".duckduckgo.com"))) {
  css += `
  /* BAD - TOLBLEK LIKE DELETED + FAUX */

  /* BAD REDIRECTOR - GENERIC - TEST */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww7."] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww12."] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href*=".php?option=com_content&view"] ,



  /* TOLBLEK LIKE DELETED + FAUX */


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.azrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.azrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://azrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://azrov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rolbob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.rolbob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rolbob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://rolbob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rolbob.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://robrov.pages.dev/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://robrov.cfd/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.instov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.instov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://instov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://instov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.grogab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.grogab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://grogab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://grogab.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sevrim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.sevrim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sevrim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://sevrim.com/"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.votrob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.votrob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://votrob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://votrob.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww99.flazto.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.flazto.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.flazto.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://flazto.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://flazto.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.flazto.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.modvoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.modvoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://modvoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://modvoz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fedzak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.fedzak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fedzak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://fedzak.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fakoda.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.fakoda.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fakoda.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://fakoda.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vomzor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.vomzor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vomzor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://vomzor.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yakwad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.yakwad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yakwad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://yakwad.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://loknoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.loknoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.loknoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://loknoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://loknoz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.noklav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.noklav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://noklav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://noklav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://noklav.pages.dev/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.staklam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.staklam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://staklam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://staklam.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.xabriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.xabriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://xabriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://xabriv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.odvib.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.odvib.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://odvib.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://odvib.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.driviv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.driviv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://driviv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://driviv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yepmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.yepmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yepmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://yepmiv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yepmiv.pages.dev/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.abokav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.abokav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://abokav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://abokav.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.toktav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.toktav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://toktav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://toktav.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.flokta.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.flokta.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://flokta.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://flokta.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.didraf.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.didraf.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://didraf.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://didraf.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.trodak.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.trodak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.trodak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://trodak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://trodak.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.udriz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.udriz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://udriz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://udriz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yakriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.yakriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yakriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://yakriv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.obivap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.obivap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://obivap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://obivap.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dostof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dostof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dostof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dostof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dostof.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fonzir.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.fonzir.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fonzir.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://fonzir.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fonzir.my/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ivrab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ivrab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ivrab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ivrab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ivrab.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fotrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.fotrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fotrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://fotrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fotrov.fr/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://bovmi.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bovmi.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bovmi.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww99.bovmi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bovmi.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://galtro.site-de-streaming.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.galtro.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://galtro.xyz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.galtro.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wafdo.com.im/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wafdo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.wafdo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wafdo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://wafdo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wafdo.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zidixo.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zidixo.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ww12.zidixo.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kempox.info"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kremok.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.kremok.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vavozi.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://vavozi.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ooviv.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ooviv.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ooviv.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zotriv.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zotriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zotriv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://komiav.eu/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.komiav.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://komiav.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://pifdi.xyz/"]:not([href^="https://pifdi.xyz/sites/?article"]):not([href^="https://pifdi.xyz/tag/"]):not([href^="https://pifdi.xyz/movies-streaming/"]) ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.pifdi.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://pifdi.info"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ww7.tratov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ww12.tratov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://tratov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tratov.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.tratov.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tratov.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fovri.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.saypap.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.saypap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.saypap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://saypap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://saypap.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.friloz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.friloz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://friloz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://friloz.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zivbod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zivbod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zivbod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zivbod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zivbod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zivbod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zivbod.com.im/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.grizox.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ww12.grizox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://grizox.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://grizox.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://grizox.xyz"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ww7.ovtok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ovtok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ovtok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ovtok.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.karvaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.karvaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://karvaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://karvaz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lokarn.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.lokarn.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://lokarn.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://lokarn.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dromoy.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dromoy.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dromoy.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dromoy.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zostaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zostaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zostaz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.idivov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.idivov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://idivov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://idivov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dofroz.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dofroz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dofroz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dofroz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dofroz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zaltav.com.im/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zaltav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zaltav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zaltav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zaltav.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zaltav.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://soponov.pages.dev/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.soponov.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://soponov.com.im/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://soponov-"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://soponov-fr"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bazrof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.bazrof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bazrof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://bazrof.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zifub.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zifub.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zifub.click"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zifub.xyz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zifub.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zifub.rip/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zifub.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zifub.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zifub.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zifub.fr"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vrewal.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.vrewal.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vrewal.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://vrewal.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vrewal.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zodrok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zodrok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zodrok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zodrok.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zodrok.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zodrok.fr/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tofrak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.tofrak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tofrak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://tofrak.com/"] ,

  /* TOLBLEK LIKE DELETED + FAUX */


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.apmoov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.apmoov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://apmoov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://apmoov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.todrak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.todrak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://todrak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://todrak.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zirkad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zirkad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zirkad.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zirkad.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bigbov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.bigbov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bigbov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://bigbov.com/"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.trabam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.trabam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://trabam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://trabam.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dokral.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dokral.net"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.aksolv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.aksolv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://aksolv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://aksolv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.aksolv.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vifip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.vifip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vifip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://vifip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vifip.fr/"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.xodop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.xodop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://xodop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://xodop.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ozpov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ozpov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ozpov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ozpov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ozpov.fr/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voplav.one"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voplav.xyz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voplav.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.brorov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.brorov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://brorov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://brorov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://brorov.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.brorov.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww25.brorov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.matror.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.matror.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://matror.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://matror.com/"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.podvix.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.podvix.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://podvix.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://podvix.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.podvix.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tiblor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.tiblor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tiblor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://tiblor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href="http://tiblor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tiblor.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tiblor.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://tiblor.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zodrop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zodrop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zodrop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zodrop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zodrop.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wizkab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.wizkab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wizkab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://wizkab.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.azkov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.azkov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://azkov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://azkov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.faskap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.faskap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://faskap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://faskap.com/"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ovoob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ovoob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ovoob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ovoob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ovoob.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ovoob.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wariom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.wariom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wariom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://wariom.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.grozov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.grozov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://grozov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://grozov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fosrak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.fosrak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fosrak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://fosrak.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.opkap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.opkap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://opkap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://opkap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.opkap.fr/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.votrob.fr"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://choupox.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://choupox.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.choupox.fr"] ,

  /* TOLBLEK LIKE DELETED + FAUX */


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.grogab.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://grogab-streaming.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.balvoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.balvoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://balvoz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://balvoz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.trochox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.trochox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://trochox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://trochox.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vadraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.vadraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vadraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://vadraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vadraz-films.ovh/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vadraz.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dabzov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dabzov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dabzov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dabzov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dabzov.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.krosov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.krosov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://krosov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://krosov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rizlov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.rizlov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rizlov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://rizlov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rizlov.fr/"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bozrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.bozrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bozrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://bozrov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.parlif.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.parlif.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://parlif.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://parlif.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.parlif.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bomiox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.bomiox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bomiox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://bomiox.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.katrov.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://katrov.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kikraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.kikraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kikraz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://kikraz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tetriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.tetriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tetriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://tetriv.com/"] ,




  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.chotrom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.chotrom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://chotrom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://chotrom.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zadriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zadriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zadriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zadriv.com/"] ,

  /* TOLBLEK LIKE DELETED + FAUX */


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nopliv.fun/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nopliv.website"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nopliv.space/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://nopliv.online/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nopliv.online/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.nopliv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.nopliv.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.nopliv.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nopliv.eu"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sopror.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sopror.fr/"] ,


  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.brikoz.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.brikoz.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sodpak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.sodpak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sodpak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://sodpak.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.skimox.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rolrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.rolrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rolrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://rolrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://rolrov.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rolrov.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sorbod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.sorbod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sorbod.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://sorbod.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yalkaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.yalkaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yalkaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://yalkaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww01.yalkaz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.xadrop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.xadrop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://xadrop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://xadrop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww01.xadrop.com/"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.xadrop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.xadrop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://xadrop.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://xadrop.com/"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.diprak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.diprak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://diprak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://diprak.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww01.diprak.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zadrip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zadrip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zadrip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zadrip.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.toblek.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://toblek.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://toblek.eu/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.toblek.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.fervap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fervap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://fervap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fervap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww7.fervap.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fervap.fr/"] ,

  /* TOLBLEK LIKE DELETED + FAUX */


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ivmox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ww12.ivmox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ww7.ivmox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ivmox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ivmox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ivmox.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww1.ivmox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ivmox.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://naxpom.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://naxpom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.naxpom.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://naxpom.com/"] , 
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://naxpom.top"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.naxpom.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://naxpom.com/"] , 
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://naxpom.top"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wanveo.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ww7.wanveo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wanveo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.wanveo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww7.wanveo.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zawox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zawox.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zawox.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zawox.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww7.zawox.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://vagdi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.vagdi.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vagdi.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vagdi.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vagdi.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.motezi.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://motezi.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://motezi.eu/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://motezi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.motezi.space/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ww12.zavrol.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zavrol.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww7.zavrol.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zavrol.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zavrol.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zavrol.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zavrol.com"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://bofiaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ww12.bofiaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bofiaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.bofiaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww1.bofiaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.bofiaz.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bofiaz.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ridzov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww1.ridzov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ridzov.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ridzov.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ridzov.xyz/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://rigrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.rigrov.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://rigrov.xyz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rigrov.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rigrov.fr"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.redzor.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.redzor.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://redzor.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.redzor.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://redzor.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ditroz.info"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ditroz.info"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ditroz.fr"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.takpok.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://takpok.fr"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://brikstok.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://brikstok.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.brikstok.net"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tivrod.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tivrod.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sardip.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sardip.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://sardip.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.sardip.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.sardip.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://sardip.xyz"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zaniob.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://zaniob.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zaniob.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zaniob.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nofza.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nofza.xyz/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.nofza.net"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tobrok.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tobrok.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.framib.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://framib.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://framib.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.framib.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.flozor.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.flozor.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.flozor.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.netdov.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://netdov.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://netdov.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://bovrom.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bovrom.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bovrom.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bovrom.fr"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://pijpa.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.pijpa.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.pijpa.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww7.pijpa.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.pijpa.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://xoperi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.xoperi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.xoperi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.xoperi.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww7.xoperi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.xoperi.space/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.xoperi.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.peralga.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://peralga.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://peralga.eu/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.diagrim.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.diagrim.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://diagrim.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://diagrim.com/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.trozam.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.trozam.org/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.trozam.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.trozam.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://trozam.com/"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.bokigo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bokigo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://bokigo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww7.bokigo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bokigo.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.buloxi.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.buloxi.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww7.buloxi.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://justdaz.org/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://justdaz.xyz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.justdaz.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.justdaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.justdaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://justdaz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://justdaz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://poblom.xyz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.poblom.xyz/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.poblom.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.lamtipo.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lamtipo.net/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://jexoom.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.jexoom.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.pirkip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.pirkip.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.itzor.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://itzor.eu"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wivero.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wivero.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://grebak.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.grebak.net"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://amopio.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.amopio.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.clavior.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://clavior.eu"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nirbom.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://nirbom.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.sajbo.space/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sajbo.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://nimvon.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nimvon.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wavob.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wavob.click"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://crebya.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.crebya.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://eyobim.eu/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://eyobim.eu"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.badrip.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://badrip.xyz/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.maxtrab.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rodroz.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lofroz.fr/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voldim.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://roplim.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.roplim.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://evdod.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.evdod.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sabtam.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sabtam.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yinedo.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zinbax.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zinbax.eu"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.davrip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://davrip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://davrip.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.davrip.fr/"] ,

  /* TOLBLEK LIKE DELETED + FAUX */


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.uquaz.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://wonior.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.wonior.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wonior.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ibogiv.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ibogiv.fr/"] ,




  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ipazor.dendrofn.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ww12.ipazor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ipazor.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ipazor.com"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.topulor.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://topulor.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.topulor.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://topulor.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filriv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filriv.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.jomvu.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.jomvu.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.piopar.fr/"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.xitof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://xitof.eu"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://xitof.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://xitof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.xitof.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.xitof.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.nidroy.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://nidroy.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.nidroy.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dradab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dradab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ww7.dradab.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dradab.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dradab.com/"]  {
      color: red !important;
      background: grey !important;
  }



  /* ================= END ================ TOLBLEK LIKE DELETED + FAUX */
  `;
}
if ((location.hostname === "duckduckgo.com" || location.hostname.endsWith(".duckduckgo.com"))) {
  css += `
  /* BAD = TOLBLEK LIKE DELETED + FAUX = SINGLE */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="DELETED + FAUX = SINGLE"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="DELETED + FAUX = SINGLE"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="DELETED + FAUX = SINGLE"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="DELETED + FAUX = SINGLE"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="DELETED + FAUX = SINGLE"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="DELETED + FAUX = SINGLE"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="DELETED + FAUX = SINGLE"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="DELETED + FAUX = SINGLE"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="DELETED + FAUX = SINGLE"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="DELETED + FAUX = SINGLE"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.gomdax.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dopriv.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dopriv.it.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dopriv.com.im/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dopriv.cv/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://bradza.click/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bradza.click/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://bradza.click//"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kanrak.com.im/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vevor.fr/s/kanrak-streaming-gratuit/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vevor.fr/s/ipdro-film-streaming/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://rogzov.online/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rogzov-vf.pages.dev/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rogzov.cv/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rogzov-fr.eu/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rogzov.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dopriv-"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nozgap-"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://titrov-"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.malgrim.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://malgrim-"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rodkov.site/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://w1-domgrav.s3.amazonaws.com/index.html"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://domgrav-"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://domgrav-official.pages.dev/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://domgrav.online/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://domgrav-official.pages.dev//"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://domgrav-v2.storage.googleapis.com/index.html"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.domgrav.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://domgrav.co.in/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://official-ipdro.pages.dev/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ipdro.com.im/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://xakrafstream.notepin.co/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://xakraf.stream/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://official-domgrav.pages.dev/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://akroov.pages.dev/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ozzak.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://batiav.online/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://batiav.pages.dev/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.batiav.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://brimav.pages.dev/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://brimav.online/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.brimav.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://brimav.com.im/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.sharecloudy.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://moovtop.guru/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://moovtop.it.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://moovtop.guru/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.moovtop.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://moovtop.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://doksov.com/nt30eo/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.topkiv.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://idvram.guru/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://idvram-fr.eu/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://gomax.com.ec/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://mostorv.pages.dev"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rovodi.com/"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.difiam.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rikmod.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://robluv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kurvaz.com/stores/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tofrak.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.mamahd.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.grorov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bomiox.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dapiax.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fridmax.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yarkam.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vazpaz.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.norbaz.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.matror.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fakoda.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sevrim.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zetmir.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.abokav.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.movbor.fr/"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sakmiz.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.getimov.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.gabanov.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://gabanov.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.drovoo.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://alrav.pages.dev/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://alrav.com.im/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://alrav-official.pages.dev/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.alrav.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kuzutv.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kuzutv.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.pimtip.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lekrom.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.druvaz.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.droskop.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dubraz.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lotriz.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lotriz.fr/films"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sibrav.net.im/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sibrav-official.pages.dev/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sibrav.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sibrav.net/films"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rivbip.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ivrab.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wiflix.bet/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.irdoz.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://volplav.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://mirloz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wonior.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://jomvu.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.govrad.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://govradar.net/en/about-us/"] ,


  /* TOLBLEK LIKE DELETED + FAUX */




  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lokarn.net/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.darkino.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tapok.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.morvoz.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.komrav.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.brodok.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.pirkip.net/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tamdor.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.xevdaz.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.afzor.fr/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.nidoron.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://nidoron.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zadiro.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.dolindo.org/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.teforo.fr/"] ,




  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.todrak.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.didraf.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zaviak.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dapiax.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.daklom.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.quepom.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vadrom.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.plokim.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zibro.fr"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://obniv.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kempox.com"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bambip.com"] ,




  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://waklov.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://abdov.com"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yobliv.info"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.okvop.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://irumax.eu"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dakva.info"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://yedib.info"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yedib.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://pilmov.com"] ,




  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://abdov.com"] ,

  /* TOLBLEK LIKE DELETED + FAUX */



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://apnob.info"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yisera.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yedib.info"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dakva.info"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://kempox.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sowdrip.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://mildip.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.mildip.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.mildip.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://mildip.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ivrom.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bambip.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dadroz.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dadroz.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://dadroz.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://flozor.xyz"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.okvop.fr"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://waklov.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.waklov.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.ivrom.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://obniv.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.obniv.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://flozor.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fovri.info"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://madzim.info"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rotwi.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yesdigi.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.grorov.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.pilmov.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.baflox.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.nakrab.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zinroz.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wavmiv.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.avbip.fr"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zibroz.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vistrov.net/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://laton.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.soprophar.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ladrov.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.toswi.net"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vokorn.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.slatok.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.narmid.fr"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zobdo.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.abdov.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://parmiv.eu/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.parmiv.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dirmox.fr"] ,


  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.lakmoa.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.drodop.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://binmir.xyz/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yisera.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://nimvon.eu/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://hkg500.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.mirvoy.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://mirvoy.eu/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://binmir.info/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.xepam.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://xepam.eu/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.barlox.fr/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wobno.eu/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.apolma.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yisera.eu/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://getimov.eu/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://plamino.eu/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.rawdid.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rawdid.eu/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://okvop.com"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.madzim.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://drodop.info"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://madzim.info"] ,




  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ivrom.com"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zetmir.eu"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yapeol.eu"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kremok.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://lakmoa.com"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.gupy.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.pirvox.net"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dirmox.eu"] ,

  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://pilmov.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.badioz.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://radego.over-blog.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fazdor.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.bipvo.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zambod.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.batkip.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dibrav.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.redziv.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.porevi.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.kempox.fr"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vimeonk.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.lakmoa.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.buloxi.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.onippam.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dolbri.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dolbri.eu/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zustream.fr/"] ,



  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.tiwzen.space/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.epiog.space/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.wobno.space/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.rodroz.space/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.kanmav.space/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wobno.net/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.atfut.space/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.hdss.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.quepaf.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.sowdrip.space/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.lakmoa.space/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.abiov.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.abiov.space"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.botidou.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://galtro.xyz/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sowdrip.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://sowdrip.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://xepam.com/"] ,


  /* TOLBLEK LIKE DELETED + FAUX */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.urmoon.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.abiov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://getimov.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zetmir.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.abiov.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.wobno.com/"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wobno.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://rodroz.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.nirbom.space/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://galtro.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.yeswani.space/"]  {
      color: red !important;
      background: grey !important;
  }



  /* END ==== BADT == SINGLE ========================== */
  `;
}
if ((location.hostname === "duckduckgo.com" || location.hostname.endsWith(".duckduckgo.com"))) {
  css += `
  /* GOOD - TORRENT = OTHERS */


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,

  /* GOOD - TORRENT - PIRATEBAY - https://thepiratebay.org/ - 2024.03 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://thepiratebay.org"]  ,

  /* GOOD - TORRENT - torrent411.to/ - 2023.11 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.torrent411.to/"] ,

  /* GOOD - TORRENT - https://torrent9.to - PB WATERFOW - 2023.11 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent9.to/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent9.app/"] ,

  /* GOOD - TORRENT - yggtorrent.fm - 2023.11 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yggtorrent.fm/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww1.yggtorrent.fm"] ,

  /* GOOD - TORRENT - torrentgalaxy.to - films, série - OK - 02.2023 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrentgalaxy.to/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.torrent911.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www5.yggtorrent.la/"] ,

  /* GOOD - TORRENT - torrentdownloads.pro - films, série - OK - 02.2023 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.torrentdownloads.pro/"] ,

  /* GOOD - TORRENT - cocostream.rip - films, série - OK - 02.2023 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wwvv.cocostream.rip"] ,

  /* GOOD - TORRENT - torrent911.ws - films, série - OK - 02.2023 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent911.ws/"] ,

  /* GOOD - TORRENT - yggtorrent.fi - films, série - OK - 02.2023 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www-yggtorrent.fi/"] ,

  /* GOOD - TORRENT - TORRENT9-11.fr - films, série - OK - 02.2023 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent9-11.fr"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrentz2fr.xyz/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://oxtorrent.buzz/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent9t.fr/"]  {
      color: white !important;
      filter: grayscale(0.7);
  /*     background: linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 60%) repeat scroll 0 0%, -moz-repeating-linear-gradient(-45deg, #F0B500, #F0B500 7px, #FFD000 7px, #FFD000 14px) repeat scroll 0 0 transparent; */
  background: #138B12 !important;
  }



  /* END ==== GOODTORRENT == GOOD TORRENT === OTHERS ================================= */


  `;
}
if ((location.hostname === "duckduckgo.com" || location.hostname.endsWith(".duckduckgo.com"))) {
  css += `
  /* GOOD -  OTHERS STREAM  */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://movieswatch.store/filmstreaming/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://megastreaming.ink/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://papadustream.com.im/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www3.zoechip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www2.movieorca.com/"] ,






  /* GOOD - SITE FREEBOX */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://chezlesducs.free.fr/films.php"] ,


  /* GOOD - sadisflix.cc / .wft / .ws GOOD - 2023.04 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sadisflix.vip/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sadisflix.cx"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sadisflix.wtf"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sadisflix.ws"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sadisflix.cc"] ,

  /* GOOD - fmoviesto.site - ONLY STREAMING - films, série - OK - 02.2023 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fmoviesto.site"] ,


  /* GOOD - papystreamings.biz - films, série - OK - 02.2023 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vvww.papystreamings.biz"] ,

  /* GOOD - PapyStreamings - OK- 2022.06 - Films/Series */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wwvv.papystreamings.biz"] ,

  /* GOOD - PapyStreamings - OTHERS */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www3.papstream.me"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wwv.papstream.cc"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.papstream.cc"] ,


  /* GOOD - yts-movie.cc/ - films, série - OK - 02.2023 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yts-movie.cc/"] ,

  /* GOOD - yts.mx/ - films, série - OK - 02.2023 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yts.mx/"] ,


  /* GOOD - Cpasmieux - films, série - OK - 06.2022 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.cpasmieux.land/"] ,
  /* GOOD - Cpasmieux - OTHERS */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.cpasmieux.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.cpasfini.me/"] ,


  /* OTHERS */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://thepiratebay.cx/"] ,





  /* GOOD - OK- 2022.01 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.extreme-down.plus/"] ,

  /* GOOD - FREE - FILMS OLD - OK- 2021.12 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://mes.saves.free.fr/"] ,

  /* GOOD - 9 DOCU - Strea Doc - OK- 2021.12 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://idahomesrealestaterenters.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://documentarylovers.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.extreme-down.link/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zone-telechargement.video"] ,


  /* GOOD - Flashgot - 2021.12 - FILMS / SERIES - STY */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.cocostream.rip/"] ,

  /* GOOD - Flashgot - 2021.06 - FILMS / SERIES */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www3.mystream.zone"] ,

  /* GOOD - Flashgot - 2021.02 - FILMS */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.stream-complet.biz"] ,


  /* GOOD - Flashgot - 2021.02 - SERIE */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vostfrserie.ws"] ,

  /* GOOD - Flashgot - 2021.02 - FILMS/SERIE */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wnw.hds-streaming.tv/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://s3.hds-streaming.tv/"] ,

  /* GOOD - Cinemay - http://cinemay.in/ - OK (film) - 2019.07 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://cinemay.in/"] ,

  /* GOOD - Cinemay - http://cinemay.tv/ - OK (film) - 2019.07 */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://cinemay.tv/"] ,


  /* GOOD - DIVERS */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sadisflix.cc"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.serie-streaming.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://hd4fun.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.limetorrents.lol/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rarelust.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://worldscinema.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rarbgaccessed.org/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://rarefilm.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rarefilmm.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voir-films.club/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://stream-complet.icu/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wvv.voirfilms.club/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wwv.seriestreaming.fun/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wvvw.voirfilm.pw/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamay.in"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dpstream.torostreaming.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wuw.wiflix.net/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wwvv.filmstoon.xyz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://w5.dpstream.info"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://libertyvf.tv/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamings-vf.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vostfrserie.biz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.seriestream.ws"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming.voir-films-series.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.extreme-down.ninja/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww2.emule-island.co/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww1.enstream.co/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vkstream.org/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamcomplet.vin"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www8.french-streaming.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streamcomplet.vin"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmzenstream.online/"] ,


  /* GOOD - DIVERS */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sokrostream.life/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vfstream.tv"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamings-vf.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamiiing.co"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://papstream.site/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.papstream.site/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dpstreaming.live"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingfilm.cc/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://french-stream.cc/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://voir.streamelite.net/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tfarjo.cc"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tfarjo.cc"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.gratflix.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmenfr.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://serie-streaming.watch"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://serie-streaming.watch/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streaminggratuitvf.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://french-stream.top/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.planet-streaming.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-films.tv"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streaming-series.watch/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ocine.tv/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr.serie-streaming.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://hdsto.to/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vf-stream.ws/"] ,



  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://cinemay.biz/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.skstream.tv/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://streamingcomplet.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamiz.ws/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kstreaming.xyz/"] ,



  /* CAPTCHA but good) OR Ublock Origin */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://1337x.to//"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.pap-stream.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.serie-streaminghd.org/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.serie-streaminghd.org/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voirfilm.me"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streamcomplet.is"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.stream-complet.to/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sakstream.tv/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voirfilms.ec"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming.voir-films-series.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww1.films.cafe/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.films.cafe/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww2.k-streaming.tv/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww3.k-streaming.tv/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://daylimovies.cz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://123movie.cx/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voir-films.co"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.planet-streaming.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww2.french-stream.top/"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tantifilm.eu/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ilgeniodellostreaming.eu/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://123movie.cx/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://paripartners629.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://stream-film-vf.me/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.dpstream.info/"] {
      color: white !important;
      filter: grayscale(0.7);
  /*     background: linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 60%) repeat scroll 0 0%, -moz-repeating-linear-gradient(-45deg, #F0B500, #F0B500 7px, #FFD000 7px, #FFD000 14px) repeat scroll 0 0 transparent; */
  background: #138B12 !important;
  }

  `;
}
if ((location.hostname === "duckduckgo.com" || location.hostname.endsWith(".duckduckgo.com"))) {
  css += `
  /* BAD - DIVERS ========================= */


  /* START == BAD == STREAM = STREAMBAD == TORRENT = TORRENTBAD  == GENERIC  */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dpstream.com.im/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://opendata-manche.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://papstreamvostfr.lat/"] ,



  /* BAD - TORRENT - yggtorrent - NEED LOGIN */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yggtorrent.wtf/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www3.yggtorrent.wtf/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www3.yggtorrent.wtf/engine/domains"] ,

  /* BAD - TORRENT - yggtorrent */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yggtorrent.cf/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.yggtorrent.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yggtorrent.cyou/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.yggtorrent.org/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yggtorrent.pro/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yggtorrent.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://yggtorrent.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yggtorrent.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://yggtorrent.do/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www-yggtorrent.fi/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www5.yggtorrents.fi"] ,


  /* BAD - TORRENT - META SEARCH - btsearch.to - REDIRECT TO LOGIN VERSION  */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.btsearch.top/"] ,

  /* BAD - TORRENT - GENERIC  */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://pasvupaslumagazine.fr/torrent9-cz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zetorrents.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.oxtorrent.sk"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zetorrents.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zone-telechargements.si"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent911w.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent9vf-site3.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://oxtorrent-film.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.torrent9.fm"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.torrent9.mx"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent99.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent9biz.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent9-film.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vww.torrent9-zone.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://9torrent.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent9cz.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent9x.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent9-site.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://torrent9.wf"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://xwww.torrent9t.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www3.yggtorrent.re"] ,


  /* BAD - PirateBay */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://pirate-bays.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://pirate-bays.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://thepiratebay.rip"] ,
  /* PirateBay */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://thepiratebay10.org"] ,

  /* BAD - CPASBIEN / CPASMIEUX*/

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www1.torrent9-cpasbien.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://cpasbiens911.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://cpasbien-si.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.cpasbien-films.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.cpasmieux.land/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww1.cpasbien-telechargement.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww5.cpasbien9.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://cpasbien2022.com"] ,


  /* BAD - PapyStreaming */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://papystream.me"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.papy-streaming.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://w7.papystreaming.bz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://papystreaming.wiki"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://papystreaming.red"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.pap-stream.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://papystreaming-hd.co"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://papystreaming.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://papystreaming.wiki"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://papystreaming.vip"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://papystreaming.blue"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wwv.papystreaming.stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://papystreaming.bz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://papystreaming-fr.com"] ,


  /* BAD - VF FILMS / VOIR FILMS */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voirfilms.al"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voirfilms.media/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voirfilms1.ws"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voirfilms.one/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voirfilms.mx/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vf-film.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voirfilms.vip/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://voirseries.tv/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voirstream.xyz/film-en-streamings"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voirfilms.al/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voir-film.online/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voirfilm.video/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vfcompletstreaming.voirstreamingvf.network/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww7.voirfilms.ws/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voirfilm.media/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voirfilms.ac/"] ,


  /* BAD - LIBERTY */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://libertyland.one/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="www.libertyland.al"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.libertyland.al/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.libertyvf.in"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.libertyvf.one/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.films4you.ovh/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.football-live.ovh/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.libertyland.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://libertyland.cc/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://libertyvf.co/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.libertyland.al/"] ,


  /* BAD - HDSS */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wmw.hds-stream.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww1.hdss.run/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://hdss.run"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.hdss.co/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://1hdss.co"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://hdss.to/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://hdss.watch"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://hdss.pro/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww1.hdss.pro"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www1.hdss.pro"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://hdss.me"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://golegal-hdss.bar"] ,




  /* BAD - CINEMAY */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://cinemay.ws"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://cinemey.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.cinemay.li"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://cinemay.site"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://cinemay.io/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://cinemay.online"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr.cinemay.co/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://cinemay.me/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://film-serie-cinemay.fr.msmvps.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://cinemay.voirstreamingcomplet.network/seriestv/"] ,


  /* BAD - filmstreaming */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.film-streaming.top"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wvw.filmstreaming.site"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://w11.filmstreaming.plus"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmstreaming1.live"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmstreaming1.plus/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmze-streaming.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmzenstream.online"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://film-streaming-vk.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmstreaming-vf.voirfilmvf.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmstreaming.streamingcompletvfr.shop"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wwwv4.filmstreaming1.top"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wwwv5.filmstreaming1.top"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmstreaminggratuit.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmstreamingvostfr.zone"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmstreaming-vf.voirfilmvf.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmstreaming.pro"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmstreaming1.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmstreamingvf.cloud"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://regarder-francais.filmstreamingvf.email"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmsstreaming.club"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streamingcomplet.filmstreamingvf.zone"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmstreamingvfhd.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmstreaming.pro"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.film-streaming1.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www1.filmstreaming.to/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://injusticeagainstfamilies.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmstreaming-vf.zone"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://7filmstreaming.com"] ,



  /* BAD - STREAM COMPLET - streamcomplet */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingfilmcomplet.co"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vffilm.streaming-complet.rocks/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vf-film-complet.streamingcompletvostfr.shop"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voir-dpcomplet-films.streaming-complet.rocks/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingcompetvf.network"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr.films.streamingcompletvostfr.shop"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming.vfstreamingfilm.schule/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vfstreaming.webnode.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voirstreamingvf-francais.lyceensaucinemalr.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vfcomplet.lyceensaucinemalr.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmcompletstreaming.zone"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmcompletstreaming.network"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://film-rechasser.streamingcompletvostfr.shop"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamfilmhd.completstreamingvf.rocks"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming4k.completstreamingvf.rocks"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.opemmath.org/streaming-complet"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamcompletgratuit.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.skstreamcomplet.stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingcompletvf.shop"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://complet.streamingfilmcomplet.wiki"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingcompletvf.ioch.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streamcomplet.film"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streamingcomplet.biz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fullstreaminghd.shop"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voirflm.streamingcompletvfr.shop"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingcomplet.video"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmhd.streamingvfcomplet.rocks"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://films.vfstreamingcomplet.rocks"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingcomplet.zone"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voirstreamingfilm.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://series-streamings.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.torostreaming.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voirseriestreaming.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://completstreamingvf.voirfilmvf.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingcompletvf.voirstreamingvf.network"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streamingcompletvf.voirstreamingvf.network/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingcompletvf.streaminggratuitvf.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://w26.stream-complet.org"] ,

  /* BAD - STREAM COMPLET - streamcomplet */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.stream-complet.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://completenstreaming.voirfilmvf.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streamingcompletvf.ioch.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://completstreaming.shop"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streamingfilm-completenvf.voirstreamingvf.network"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.film-vf.voirstreamingvf.network"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmcompletstreaming.ink"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmcompletstreaming.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingcompletvf.media"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingcompletvffilm.zone"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streamingcomplet.streamingfilmvf.email"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streamingcomplet.salvemoscabopulmo.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streamingcompletvf.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://film-complet.streamingfilmvf.email"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.streamingcompletvf.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://films-vf.streamingcompletvostfr.shop"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vf-films.streamingcompletvostfr.shop"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamcomplet.cramersposiepatch.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr.film-complet.streamstreamingvf.co/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://w28.stream-complet.org/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://stjohnelementary.com/streaming-complet-vf/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmcompletvostfr.co"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww1.stream-complet.ws"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingcompletvf.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingcomplet.email/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingcompletfilm.streamingvfhd.zone/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmcompletstreaming.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vfstreamingcomplet.co/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streamingcompletvf.tools"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmvfcomplet.streamfilmer01.rocks"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vfstreamingcomplet.co"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmcompletstreaming.fr"] ,


  /* BAD+ - STREAMING - GENERIC */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.01series.mom/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,


  /* BAD - STREAMING - GENERIC */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vitmox.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.ridrak.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vustream.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.sadisflix.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://congowebmaster.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://trouver-son-site.com/ragibo/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.streaming-world.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://streaming-francais.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fr..stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmzstream.cc/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://film.vfstreaming.shop"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kstreaming.vfstreamingfilm.schule"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingvf.watch/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamdivx.pro"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vf.stjohnelementary.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamgratuit.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vfstreaminghd.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingseriecc.blogspot.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.vf-streaming.fr"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streamingvost.voirstreamingvf.network"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://regarderfilm.voirstreamingvf.network"] ,


  /* BAD - STREAMING - GENERIC */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.zone-streaming.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://serie-streamings.co"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://hd.vfstreamingfilm.schule"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kstreaming.streamingvfhd.zone"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://films.voirstreamingvf.network"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.streaming-hd.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://frstream.streamingvfhd.zone"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamla.webnode.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww1.full-stream.co/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.01streamingvf.co/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamfilmer01.rocks"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww1.streaminga.net"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmsenfrance.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmstreamvf.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmz-streaming.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://hd.streamingdivx.ch"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-4k.com"] ,

  /* BAD - STREAMING - GENERIC */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voirfilm.completstreamingvf.fr"] ,


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.gotstreaming.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.libertyland.al"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dustreaming.co"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dpstreaming.to"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamog.co"] ,




  /* BAD - TELECHARGER - GENERIC  */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww5.telecharger-film.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.telecharger-film.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://film.telechargementgratuits.com"] ,




  /* BAD - BLOGSPOT - GENERIC */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bookszzswpm.blogspot.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://repelisjlihoi.blogspot.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmvhbypdt.blogspot.com"] ,



  /* BAD - GOOGLE - GENERIC */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sites.google.com/site/jczzphupix"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sites.google.com/site/aefohdkdxk"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sites.google.com/site/sxnxcymej4"] ,


  /* BAD - START / END - GENERIC */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://m9meflv"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href$=".statuspage.io"] ,


  /* BAD - DIVERS From IMDB SCOUT */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://pahe.sbs"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://veehd.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://irumax.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww12.obniv.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://club-classic.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.vintageclassix.com"] ,



  /* BAD - DIVERS - A TRIER */


  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-vod.fr/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ATRIER"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ATRIER"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ATRIER"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ATRIER"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ATRIER"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ATRIER"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ATRIER"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ATRIER"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ATRIER"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ATRIER"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ATRIER"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ATRIER"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ATRIER"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.papflix.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wiflixfr.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voir-films.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.gupy.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.extrabb.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.gupy.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.dpstream.movie"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dpstreamhd.com"] ,

  /* BAD - DIVERS - A TRIER */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://wawa-stream.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kristineichorn.blogspot.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://disc1.filmdownload.stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kristineichorn.blogspot.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.annuaire-telechargement.al"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://telechargerfilmsgratuitsenligne.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmcomplet.biz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voirfs.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://film.voirfilms.ws"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.mes-films-streaming.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://papstream.pro"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dienlanhsaving.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.cordylink.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://majortuto.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wvw.cheminotsimulator.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.blogues.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmsewcdx.blogspot.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://6600828.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww1.jmto.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www1.karinegonzalez.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://moulins-de-flandre.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www1.ronantanguy.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://stjohnelementary.com"] ,

  /* BAD - DIVERS - A TRIER */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://nebyywe.buzz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://evshortage30.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://frap6.com/old-2021"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.downloadhelper.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://4kgratuit.homeagaincentralma.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fetesetevenements.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.biddulphsberg.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://brightonmontessori.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://webxtrakt.fr/lakmoa.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yesflicks.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://putlockers9.us"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://iomovieztv.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rucksystems.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://repelisplus.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.leelastyle.co"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://wiflix.pro"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.baltimorecitycjcc.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.film2kstream.co"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.pirvox.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://studiocean9.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www1.clic-bassindevieniortais.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.play-on.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://luvein.blogspot.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://c306x.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://kolibka.eu"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww1.hdsvf.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww6.je-ddl.com"] ,

  /* BAD - DIVERS - A TRIER */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://breastimplantcentersandiego.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.betaseries.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://frenchstream.cc/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tittislilleverden.blogspot.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://w22.seriecomplete.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://cinemax.website"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zone-telechargement.ninja"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wawacity.ninja"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voirseries.co/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.muhammedbiral.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmcompletvf.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.laminelezghad.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.cinebloom.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmze.stream"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://video.ibm.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://works.bepress.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://1mbed.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://twentyplay.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bernardiensternheim.nl"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://gittie-manis.blogspot.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://play-strm.me/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://steemit.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://myfilmbiznetwork.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://apextrainingafrica.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.eurekafliudfilm.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmsidene.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://pittotfilms.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bwmfilms.com/film"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://bruiter.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://faithsolace.com"] ,

  /* BAD - DIVERS - A TRIER */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://version-francaise.lefilmenfrancais.coffee/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.horrorclassicfilms.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://onmyblockfilms.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.premiere.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://jomovie.siteonline.stream/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://shoutengine.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://filmhdgratuit.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://tfarjo.me/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.frenchtvmovies.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.fr.universcine.be/f"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.justwatch.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://weight.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.stan.com.au/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww1.youwatch-series.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voirfilmshd.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://airbnbvoucher.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.planetfilmtvcomplet-fr.msmvps.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.tvshow.cc"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.yidio.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://megaseries.biz/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.tfarjo.pro/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.universcine.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://cmovieshd.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.filmotv.fr/"] ,


  /* BAD - DIVERS - A TRIER */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://medianplay.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://floridafilmfestival.org/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://imastlouis.org/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://cinefra.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://morahdubai.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://flixfr.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://desfilm.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://alostreaming.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://oomoviz.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://cinstreaming.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamlook.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://worldmetalalliance.org/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.mazonetelechargement.fr/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://hitsfilms.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://mubi.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://themes.doitmax.de/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sustainabilityma.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://unitedcitizensofblackamerica.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.captainwatch.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.filmuptobox.top/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://filmtelecharger.la/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://sangroupeducation.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.wanted-lefilm.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zone-telechargement.al"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://fear-and-loathing.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voirfilms.it"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.peap.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://zinebi.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.cheri-lefilm.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://filmstream.pro"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.cmoset.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://deeperstateketo.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streamizfilm.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://ww7.hitsfilm.com"] ,

  /* BAD - DIVERS - A TRIER */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voirfilms.enstreaming.info/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.enstreaming.ws/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dpstream-filmze.xyz/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vf.dpstream.site/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://w1.seriestreaming.site/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://filmbdrip.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming-home.co/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://openload.ag/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://impacthomecare.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://dpstream-filmze.xyz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vf.dpstream.site"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://voirfilms.voir.film"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://filmbdrip.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://crimemovie20.blogspot.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streaming.vfstreamingfilm.schule"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.streamingmobile.org/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="http://www.mavanimes.co"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww10.skstream.site"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww12.dpstream.info"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://jeouzal.org//"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.streamingfilmvf.email/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://liquidvisionfilms.com/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wvmushroomclub.org/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voirfilm.cc/"] ,

  /* BAD - DIVERS - A TRIER */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://cinemay.net/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ww7.dpstream.info/"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://frmovies.cc/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://rmovi.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamkiste.tv"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://op-streaming.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.french-stream.fun/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://chichiswag.blogspot.com/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://anecgardenofsuccess.org"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://arimnet.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.regarder-films.net/"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://lefemi.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://monastreaming.com"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://apextrainingafrica.org/streaming-vf"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.espace-streaming.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingcompletvf.fr"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.wvmushroomclub.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://jeouzal.org"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://liquidvisionfilms.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://mediaplay.net"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://liquidvisionfilms.com"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voirstream.xyz"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voirfilm.cc"] ,

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingvfhd.zone"] ,
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://streamingfilmvf.email/"] {
      color: red !important;
      filter: grayscale(0.7);
      background: linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 60%) repeat scroll 0 0%, -moz-repeating-linear-gradient(-45deg, #F0B500, #F0B500 7px, #FFD000 7px, #FFD000 14px) repeat scroll 0 0 transparent;
  /*     background: tomato !important; */
  }
  `;
}
if ((location.hostname === "duckduckgo.com" || location.hostname.endsWith(".duckduckgo.com"))) {
  css += `
  /* GOOD (but CAUTION) - Need STY ANTI NAG */


  /* GOOD but CAUTION (want instal exe) + need STY ANTI NAG - Flashgot - 2021.01 - FILMS/SERIE */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voir-films.info"] {
  background: violet !important;
  }

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.voir-films.info"]:before{
  content: "Need STY ANTI NAG" !important;
  position: absolute ;
  margin-top: -14px !important;
  padding: 2px !important;
  border-radius: 3px 3px 0 0 !important;
  font-size: 10px !important;
      color: green !important;
  background: gold !important;
  }

  `;
}
if ((location.hostname === "duckduckgo.com" || location.hostname.endsWith(".duckduckgo.com"))) {
  css += `
  /* VERY BAD - VIRUS - WANT INSTALL BITcoin log or OTHERS  */
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.info/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.info/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.info/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.info/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.info/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.info/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.info/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.info/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.info/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.info/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.info/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.info/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.info/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.info/"],

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.zudbo.com/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://denetsuk.com/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://ivube.net"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.series-streaming1.com/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://french-streams.com/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://www.papergeek.fr/"],
  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://vkstreaming.info/"] {
      color: gray !important;
  background: red !important;
  }
  `;
}
if ((location.hostname === "duckduckgo.com" || location.hostname.endsWith(".duckduckgo.com"))) {
  css += `
  /* Neeed Ublock Origin */

  #react-layout > div > div section ol.react-results--main li[data-layout="organic"]  a[href^="https://french-streams.com/"]:before{
  content: "Neeed Ublock Origin" !important;
  position: absolute ;
  margin-top: -14px !important;
  padding: 2px !important;
  border-radius: 3px 3px 0 0 !important;
  font-size: 10px !important;
      color: green !important;
  background: gold !important;
  }

  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
