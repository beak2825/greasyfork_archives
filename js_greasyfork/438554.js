// ==UserScript==
// @name         Bedre Tabloid
// @namespace    greasyshark
// @version      1.1.4
// @description  Lader dig se links inden du klikker og fjerner uønskede elementer.
// @author       Greasy Shark
// @match        https://www.bt.dk/*
// @match        https://www.seoghoer.dk/*
// @match        https://ekstrabladet.dk/*
// @match        https://www.billedbladet.dk/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        GM_addStyle
// @license      GNU GPLv3

// @downloadURL https://update.greasyfork.org/scripts/438554/Bedre%20Tabloid.user.js
// @updateURL https://update.greasyfork.org/scripts/438554/Bedre%20Tabloid.meta.js
// ==/UserScript==

const delay = t => new Promise(resolve => setTimeout(resolve, t));

GM_addStyle(`
  .showlinks {
    padding: 10px 10px 10px 0;
    font-size: 1rem;
    display: block;
    color: inherit;
  }
  @media (max-width: 769px) {
    .theme-ekstrabladet-v2 .dre-item--sm-half {width: 100%; flex:none; }
  }

  div[data-component='ModalConsentWall'] { display: none }

  .PostConsentModal_modal__TPXf4, article.dre-item--feature-e-commerce, article.dre-item--feature-plus { display: none !important }
`)

/* globals $ */
// Fjern reklamer og betalingsartikler
let ignoreList = "click,network,direct,selected,performance";

//Fjern udkommenteringen herunder hvis du ikke gider læse om sport
ignoreList = ignoreList + "," + "betting,sport,fodbold,transfervinduet,golf,superliga,haa?ndbold,tennis,ishockey,formel-1,oevrig-sport,cykling,tour-de-france,badminton,vinter-ol|atletik"

//Fjern udkommenteringen herunder hvis du ikke gider læse om kendte og kongelige mv.
//ignoreList = ignoreList + "," + "royale,kendte"

// Tilføj evt selv stopord til ovennævnte lister

const re = new RegExp(ignoreList.replace(/,/g, "|"), "i");

(async function() {
   // $("article.dre-item--feature-plus").hide()
   // $("article.dre-item--feature-e-commerce")/*.parents(".dre-group")*/.hide()
   $("a[data-trackname='plus_arkiv_rodgulsort'").hide()
   $(".dre-item__pretitle:contains('Annoncørbetalt')").parents("article").hide()
   $(".premium-dogear").parents("a").hide()
   $(".Softwall__skip").click()

   $("article.dre-item, article.teaser").each((i,e) => {
      let href = $("a:first",e).attr("href").split("?")[0]
      let link = href.replace(/https?:\/\/[^\/]+\//, "")
      if(link.match(re)) {
         $(e).hide()
      }
      else {
         if(location.href.match("seoghoer.dk")) {
            $(e).after(`<a href="${href}">${link}</a>`)
         }
         else if(location.href.match("ekstrabladet.dk")) {
            $("div[class^=dre-item__alt-title--]:visible", e).after(`<a class="showlinks" href="${href}">${link}</a>`)
         }
         else {
            $(e).append(`<a class="showlinks" href="${href}">${link}</a>`)
         }
      }
   });

   // BT
   await delay(1000)
   $("article > a[href*='shoppingtips-med-reklamelinks']").parent("article").hide()


})();


/*OLD:

// ==UserScript==
// @name         Bedre Tabloid
// @namespace    greasyshark
// @version      1.0.7
// @description  Lader dig se links inden du klikker
// @author       Greasy Shark
// @match        https://www.bt.dk/*
// @match        https://www.seoghoer.dk/*
// @match        https://ekstrabladet.dk/*
// @match        https://www.billedbladet.dk/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        GM_addStyle
// @license      GNU GPLv3

// ==/UserScript==

GM_addStyle(`
  .showlinks {
    padding: 10px;
    font-size: 1rem;
    display: block;
    color: inherit;
  }
  @media (max-width: 769px) {
    .theme-ekstrabladet-v2 .dre-item--sm-half {width: 100%; flex:none; }
  }

  div[data-component='ModalConsentWall'] { display: none }
`)

/* globals $ * /
// Fjern reklamer og betalingsartikler
let ignoreList = "click,network,direct,selected";

//Fjern udkommenteringen herunder hvis du ikke gider læse om sport
ignoreList = ignoreList + "," + "sport,fodbold,transfervinduet,golf,superliga,haa?ndbold,tennis,ishockey,formel-1,oevrig-sport,cykling,badminton,vinter-ol|atletik"

//Fjern udkommenteringen herunder hvis du ikke gider læse om kendte og kongelige mv.
//ignoreList = ignoreList + "," + "royale,kendte,performance"

// Tilføj evt selv stopord til ovennævnte lister

const re = new RegExp(ignoreList.replace(/,/g, "|"), "i");

(function() {
   $("article.dre-item--feature-plus").hide()
   $("a[data-trackname='plus_arkiv_rodgulsort'").hide()
   $(".dre-item__pretitle:contains('Annoncørbetalt')").parents("article").hide()
   $("article.dre-item, article.teaser").each((i,e) => {
      let href = $("a:first",e).attr("href")
      let link = href.replace(/https?:\/\/[^\/]+\//, "")
      if(link.match(re)) {
         $(e).hide()
      }
      else {
         if(location.href.match("seoghoer.dk")) {
            $(e).after(`<a href="${href}">${link}</a>`)
         }
         else {
            $(e).append(`<a class="showlinks" href="${href}">${link}</a>`)
         }
      }
   });
})();

*/