// ==UserScript==
// @name        spiegel.de: entferne störende Elemente
// @description Entfernt ausgewählte Elemente von Spiegel Online
// @namespace   https://greasyfork.org/de/users/541444-critias
// @match       https://www.spiegel.de/
// @match       https://www.spiegel.de/*
// @version     5.16
// @author      Critias
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/401979/spiegelde%3A%20entferne%20st%C3%B6rende%20Elemente.user.js
// @updateURL https://update.greasyfork.org/scripts/401979/spiegelde%3A%20entferne%20st%C3%B6rende%20Elemente.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hauptteil = document.querySelector('.lg\\:pt-8');

    var candidateSelectors = [
        'div.polygon-swiper',
        'article.py-16',
        'div [data-area^="article_teaser"]',
        'li.py-16',
        'article > article.lg\\:py-24',
        'div.sm\\:-mt-16',
        'ul > li',
        'div.mb-16',
        'div.z-10',
        'a.swiper-slide',
        'a.polygon-swiper-slide',
        'div.mb-4',
        'section[data-area="contentbox"] > section.flow-root',
    ];

    //Liste mit Elementen, die entfernt werden
    var unnuetzes = [
        '[data-flag-name="Spplus-paid"]', //Spiegel Plus Artikel
        '[data-flag-name="plus-paid"]', //Spiegel Plus Artikel
        '[data-flag-name="Spaudio-paid"]', //Spiegel Plus Podcasts
        '[data-flag-name="Elfclub-paid"]', //Kostenpflichtige "CLUB" Artikel
        '[data-flag-name="elf"]',//11 Freunde Artikel
        '[data-flag-name="effi"]',//effilee.de Artikel
        '[data-contains-flags="elf gallery"]',//11 Freunde Artikel
        '[data-target-id="content-marketing"]', //Werbung für Eigenprodukte
        'div [aria-label^=Anzeige]', //Werbung, die der Adblocker nicht erkennt
        'div [aria-label="Die Bilder des Tages"]', //Bilder des Tages
        'div [data-target-id="digital-abo-ew"]', //Newsletter Angebote
        'div[data-settings*="https://sportdaten.spiegel.de\"]', //Sportdaten / Spielergebnisse
        'path[d^="M7.103 4.003c1.144 0 1.776.816"]', //manager magazin Artikel
        'a[href^=\'https://www.spiegel.de/tests\']', //Testbericht-"Artikel" (also eigentlich Produktwerbung)
        'a[href^=\'https://www.spiegel.de/thema/test_und_produkte\']', //Testbericht-"Artikel" (also eigentlich Produktwerbung)
        'a[href^=\'https://www.spiegel.de/fotostrecke/bilder-des-tages\']', //Bilder des Tages
        'a[href^=\'https://www.spiegel.de/deinspiegel/\']', //Dein SPIEGEL Artikel für Kinder
        'a[href^=\'https://lotto.spiegel.de/eurojackpot/alle-artikel/\']', //Lotto Werbung
        'a[href^=\'https://www.manager-magazin.de\']', //manager magazin Artikel
        'section[data-area="block>video"] > div.flex > div.relative > div.polygon-swiper > div.polygon-swiper-wrapper > div.polygon-swiper-slide > a[href^="https://www.spiegel.de/thema/"]', //Menü unterhalb der Video-Sektion
    ];

    var links55 = document.querySelectorAll(unnuetzes);
    for (var link0 of links55) {
        var containerElement55 = link0.closest(candidateSelectors);
        if (containerElement55) {
            containerElement55.classList.add("markiert");
        }
    }

    // behebt einen Fehler, der oft dazu führt, dass kleine Icons und Buttons, wie z.B. der Playbutton bei Videos, nicht sichtbar sind.
    var svgs = [
        document.querySelector('svg[id="spon-play-f-m"]'),
        document.querySelector('svg[id="spon-chevron-right-l"]'),
        document.querySelector('svg[id="spon-chevron-left-l"]'),
        document.querySelector('svg[id="spon-gallery-flag-m"]'),
        document.querySelector('svg[id="spon-gallery-f-m"]'),
        document.querySelector('svg[id="spon-video-flag-m"]'),
        document.querySelector('svg[id="spon-audio-flag-m"]')
    ];
    var knoten3 = document.createElement("div");
    knoten3.style.visibility = 'hidden';
    knoten3.style.height = '0px';
    if (hauptteil){
        hauptteil.appendChild(knoten3);
        for (var original_svg1 of svgs){
            if (original_svg1 && original_svg1.parentElement) {
                var cloned_knoten = original_svg1.cloneNode(true);
                var knoten5 = document.createElement("div");
                knoten3.appendChild(knoten5);
                original_svg1.parentElement.insertBefore(cloned_knoten, original_svg1.parentElement.children[0]);
                knoten5.replaceWith(original_svg1);
            }
        }
    };

//Sorgt für eine gute Reihenfolge / schließt Lücken, die von entfernten Elementen zurückgelassen würden
var linksll = document.querySelectorAll(unnuetzes);
for(var linkl of linksll) {
  var containerElement = linkl.closest(candidateSelectors);
  var areal = linkl.closest('[data-area^="block>topic"]');
  if (areal) {
  if(containerElement && containerElement.parentElement){
    var vierzwoelf = areal.querySelectorAll('.lg\\:w-4\\/12:not([data-area="article_teaser>news-s"]):not([data-area^="article_teaser>external"]):not(.markiert):not(.md\\:pl-24):not(.md\\:px-24):not(.lg\\:p-24):not(.lg\\:pl-24):not(.z-40)');
    var sechszwoelf = areal.querySelectorAll('.lg\\:w-6\\/12:not([data-area="article_teaser>news-s"]):not(.markiert):not(.md\\:pl-24):not(.md\\:px-24)');
    var achtzwoelf = areal.querySelectorAll('.lg\\:w-8\\/12:not(.md\\:pl-24):not(.md\\:px-24)');
      if (containerElement.classList.contains("lg:w-8/12")){
      if (vierzwoelf && achtzwoelf){
      if (vierzwoelf.length > 1) {
      containerElement.classList.add("markiert2");
      vierzwoelf[vierzwoelf.length- 1].classList.add("markiert2");
      vierzwoelf[vierzwoelf.length- 2].classList.add("markiert2");
      var erster2 = areal.querySelectorAll('.markiert2');
      if (erster2[0] === containerElement) {
      var container_hat_Linie2 = containerElement.querySelector('.border-separator-r');
      var vierzwoelf_hat_Linie2 = vierzwoelf[vierzwoelf.length- 2].querySelector('.border-separator-r');
      var vierzwoelf_hat_Linie3 = vierzwoelf[vierzwoelf.length- 1].querySelector('.border-separator-r');
      var linie_linie = areal.querySelector('.border-separator-r');
      if (!container_hat_Linie2 && vierzwoelf_hat_Linie2 && vierzwoelf_hat_Linie2.parentElement){
          vierzwoelf_hat_Linie2.parentElement.removeChild(vierzwoelf_hat_Linie2);
      }
      if (!vierzwoelf_hat_Linie3) {
          var cloned_linie = linie_linie.cloneNode(true);
          vierzwoelf[vierzwoelf.length- 1].appendChild(cloned_linie);
      }
      if (container_hat_Linie2 && !vierzwoelf_hat_Linie2){
          let knoten2 = document.createElement("div");
          vierzwoelf[vierzwoelf.length- 2].appendChild(knoten2);
          knoten2.replaceWith(container_hat_Linie2);
      }
      containerElement.replaceWith(vierzwoelf[vierzwoelf.length- 1]);
      swapElements(vierzwoelf[vierzwoelf.length- 1],vierzwoelf[vierzwoelf.length- 2]);
      }
      if (erster2[1] === containerElement) {
      var container_hat_Linie1 = containerElement.querySelector('.border-separator-r');
      var vierzwoelf_hat_Linie1 = vierzwoelf[vierzwoelf.length- 1].querySelector('.border-separator-r');
      if (!container_hat_Linie1 && vierzwoelf_hat_Linie1 && vierzwoelf_hat_Linie1.parentElement){
          vierzwoelf_hat_Linie1.parentElement.removeChild(vierzwoelf_hat_Linie1);
      }
      if (container_hat_Linie1 && !vierzwoelf_hat_Linie1){
          var vierzwoelf_last1 = vierzwoelf[vierzwoelf.length- 1].lastElementChild;
          let knoten1 = document.createElement("div");
          vierzwoelf[vierzwoelf.length- 1].insertBefore(knoten1, vierzwoelf_last1.nextElement);
          knoten1.replaceWith(container_hat_Linie1);
      }
      containerElement.replaceWith(vierzwoelf[vierzwoelf.length- 1]);
      }
          if (containerElement) {
          containerElement.classList.remove("markiert2");
          }
          vierzwoelf[vierzwoelf.length- 1].classList.remove("markiert2");
          vierzwoelf[vierzwoelf.length- 2].classList.remove("markiert2");
      }}}
      if (containerElement.classList.contains("lg:w-4/12")){
      if (!(containerElement.getAttribute("data-area") === 'article_teaser>news-s')){
      if (vierzwoelf){
      if (vierzwoelf.length > 0) {
      containerElement.classList.add("markiert2");
      vierzwoelf[vierzwoelf.length- 1].classList.add("markiert2");
      var erster = areal.querySelectorAll('.markiert2');
      if (erster[0] === containerElement) {
      var container_hat_Linie = containerElement.querySelector('.border-separator-r');
      var vierzwoelf_hat_Linie = vierzwoelf[vierzwoelf.length- 1].querySelector('.border-separator-r');
      if (!container_hat_Linie && vierzwoelf_hat_Linie && vierzwoelf_hat_Linie.parentElement){
          vierzwoelf_hat_Linie.parentElement.removeChild(vierzwoelf_hat_Linie);
      }
      if (container_hat_Linie && (!vierzwoelf_hat_Linie || vierzwoelf_hat_Linie && vierzwoelf_hat_Linie.classList.contains("lg:hidden"))){
          var vierzwoelf_last = vierzwoelf[vierzwoelf.length- 1].lastElementChild;
          let knoten = document.createElement("div");
          vierzwoelf[vierzwoelf.length- 1].insertBefore(knoten, vierzwoelf_last.nextElement);
          knoten.replaceWith(container_hat_Linie);
      }
      containerElement.replaceWith(vierzwoelf[vierzwoelf.length- 1]);
      }
          if (containerElement) {
          containerElement.classList.remove("markiert2");
          }
          vierzwoelf[vierzwoelf.length- 1].classList.remove("markiert2");
      }}}}
      if (containerElement.classList.contains("lg:w-6/12")){
      if (!(containerElement.getAttribute("data-area") === 'article_teaser>news-s')){
      if (sechszwoelf){
      if (sechszwoelf.length > 0) {
      containerElement.classList.add("markiert2");
      sechszwoelf[sechszwoelf.length- 1].classList.add("markiert2");
      var erster1 = areal.querySelectorAll('.markiert2');
      if (erster1[0] === containerElement) {
      var container_hat_Linie4 = containerElement.querySelector('.border-separator-r');
      var sechszwoelf_hat_Linie4 = sechszwoelf[sechszwoelf.length- 1].querySelector('.border-separator-r');
      if (!container_hat_Linie4 && sechszwoelf_hat_Linie4 && sechszwoelf_hat_Linie4.parentElement){
          sechszwoelf_hat_Linie4.parentElement.removeChild(sechszwoelf_hat_Linie4);
      }
      if (container_hat_Linie4 && !sechszwoelf_hat_Linie4){
          var sechszwoelf_last4 = sechszwoelf[sechszwoelf.length- 1].lastElementChild;
          let knoten4 = document.createElement("div");
          sechszwoelf[sechszwoelf.length- 1].insertBefore(knoten4, sechszwoelf_last4.nextElement);
          knoten4.replaceWith(container_hat_Linie4);
      }
      containerElement.replaceWith(sechszwoelf[sechszwoelf.length- 1]);
      }
          if (containerElement) {
          containerElement.classList.remove("markiert2");
          }
          sechszwoelf[sechszwoelf.length- 1].classList.remove("markiert2");
      }}}}
  }}
}

function swapElements(elm1, elm2) {
    var parent1, next1;
    parent1 = elm1.parentNode;
    next1 = elm1.nextElementSibling;
    parent1.insertBefore(elm2, next1);
}

//Sorgt dafür, dass die Suche-Funktion weiterhin funktioniert
if(window.location.href.indexOf("https://www.spiegel.de/suche/")== -1){
    cleaner();
}else{
function suche_cleaner() {
var artikel7 = document.querySelectorAll('.lg\\:py-24');
let index = 0;
for( index=0; index < artikel7.length; index++ ) {
var test1 = artikel7[index].querySelector(unnuetzes);
        if (test1){
            if (artikel7[index]){
                var artikel7_next = artikel7[index].nextElementSibling;
                var artikel7_prev = artikel7[index].previousElementSibling;
                if(artikel7_next){
                    var artikel7_separator = artikel7_next.querySelector('.border-separator-b');
                    if(artikel7_separator && artikel7_separator.parentElement){
                        artikel7_separator.parentElement.remove();
                    }
                }else if(artikel7_prev){
                    var artikel7_separator2 = artikel7_prev.querySelector('.border-separator-b');
                    if(artikel7_separator2 && artikel7_separator2.parentElement){
                        artikel7_separator2.parentElement.remove();
                    }
                }
                artikel7[index].remove();
            }
        }
}
}
    setTimeout(suche_cleaner, 800);

history.pushState = ( f => function pushState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.pushState);

history.replaceState = ( f => function replaceState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.replaceState);

window.addEventListener('popstate',()=>{
    window.dispatchEvent(new Event('locationchange'))
});

window.addEventListener('locationchange', function(){
    setTimeout(suche_cleaner, 600);
    setTimeout(suche_cleaner, 1500);
})
}

//Funktion zum Entfernen störender Elemente
function cleaner() {
var links = document.querySelectorAll(unnuetzes);
for(var link of links) {
  var videoContainerElement = link.closest('section[data-area="block>video"]');
  var polygonContainerElement = link.closest('.polygon-swiper');
  var containerElement = link.closest(candidateSelectors);
  if(!polygonContainerElement && videoContainerElement && link.getAttribute('data-flag-name') === "Spplus-paid"){
      var spplus_vid_parent = link.closest('div[data-area="article_teaser>news_xl"]');
      if(spplus_vid_parent){
          var spplus_vid_parent_separator = spplus_vid_parent.nextElementSibling;
          spplus_vid_parent_separator = skipHiddenElements(spplus_vid_parent_separator, 'nextElementSibling');
          if(spplus_vid_parent_separator && spplus_vid_parent_separator.classList.contains("border-separator-b")){
              entfernen(spplus_vid_parent_separator);
          }
          entfernen(spplus_vid_parent);
      }
  }else if(containerElement && containerElement.parentElement){
    var nextS = containerElement.nextElementSibling;
    nextS = skipHiddenElements(nextS, 'nextElementSibling');
    var previousS = containerElement.previousElementSibling;
    previousS = skipHiddenElements(previousS, 'previousElementSibling');
      if(window.location.href === "https://www.spiegel.de/"){
      if (nextS && nextS.parentElement){
       if ((nextS.classList.contains("border-separator-b")|| nextS.classList.contains("border-separator-r"))&&!(!containerElement.classList.contains("w-full")&& !containerElement.classList.contains("lg:w-full")&& nextS.classList.contains("w-full"))) {
       nextS.parentElement.removeChild(nextS);
       var deleted = 1;
       }
      }
      if (!deleted) {
       if (previousS && previousS.parentElement){
        if ((previousS.classList.contains("border-separator-b")|| previousS.classList.contains("border-separator-r"))&&!(!containerElement.classList.contains("w-full")&& !containerElement.classList.contains("lg:w-full")&& previousS.classList.contains("w-full"))) {
              previousS.parentElement.removeChild(previousS);
              var deleted1 = 1;
        }
      }}
      if (!deleted && !deleted1) {
          var parent1 = containerElement.parentElement;
          var parent1S = parent1.previousElementSibling;
          parent1S = skipHiddenElements(parent1S, 'previousElementSibling');
          if (parent1S && parent1S.parentElement){
              if ((parent1S.classList.contains("border-separator-b")|| parent1S.classList.contains("border-separator-r"))&& !containerElement.classList.contains("border-separator-b")) {
              parent1S.parentElement.removeChild(parent1S);
              var deleted2 = 1;
      }}}
      if (!deleted && !deleted1 && !deleted2) {
          var parent1N = parent1.nextElementSibling;
          parent1N = skipHiddenElements(parent1N, 'nextElementSibling');
          if (parent1N && parent1N.parentElement){
              if (parent1N.classList.contains("border-separator-b")|| parent1N.classList.contains("border-separator-r")) {
              parent1N.parentElement.removeChild(parent1N);
      }}}
      deleted = null;
      deleted1 = null;
      deleted2 = null;
      }else{
          if (nextS && nextS.parentElement){
       if ((nextS.classList.contains("border-separator-b")&& !nextS.classList.contains("py-16")&& !nextS.classList.contains("pb-16"))&&!(!containerElement.classList.contains("w-full")&& !containerElement.classList.contains("lg:w-full")&& nextS.classList.contains("w-full"))) {
       nextS.parentElement.removeChild(nextS);
       var deleted3 = 1;
       }
      }
      if (!deleted3) {
       if (previousS && previousS.parentElement){
        if ((previousS.classList.contains("border-separator-b")&& !previousS.classList.contains("py-16")&& !previousS.classList.contains("pb-16"))&&!(!containerElement.classList.contains("w-full")&& !containerElement.classList.contains("lg:w-full")&& previousS.classList.contains("w-full"))) {
              previousS.parentElement.removeChild(previousS);
        }
      }}
      }
    deleted3 = null;
    containerElement.parentElement.removeChild(containerElement);
  }
}
}

//Liste mit Abschnitten, die entfernt werden
(function() {
    'use strict';
    var abschnitte = [
        'div [data-settings*="newsletter"]', //Newsletter Angebote
        'div [data-component="AffiliateBox"]', //Werbung
        'div [data-area^="block>topic:spiegel-bestseller"]', //Spiegel Bestseller
        'div [data-area^="block>bestsellerslider"]', //Spiegel Bestseller Menü
        'div [data-area^="block>podlove"]', //Podcasts
        'div [data-area="block>audio:podcasts"]', //Podcasts
        'div [data-area="block>stocks"]', //Börse
        'div [data-area="block>topic:produkte_im_test"]', //Testbericht-"Artikel" (also eigentlich Produktwerbung)
        'div [data-area="group:manager_magazin"]', //Manager Magazin Artikel
        'div [data-area*="_spiegel+"]', //Spiegel Plus Artikel
        'div [data-area^="block>podcastbox"]', //Podcast Menü
        'div [data-area^="block>storyslider"]', //Spiegel Stories
        'div [data-area="block>quiz"]', //Spiegel Quiz
        'div [data-area="group:11freunde"]', //"11Freunde" Rubrik
        'div [id="spPlusBanner"]', //Spiegel Plus Abo Angebot
        'section[data-area="block>highlight:bild_des_tages"]', //Bilder des Tages
        'section[data-area^="block>podlove"]', //Podcasts
        'section[data-area="block>DeinSPIEGEL"]', //DEIN SPIEGEL (Spiegel Artikel für Kinder)
        'section[data-area="block>highlight:dein_spiegel"]', //DEIN SPIEGEL (Spiegel Artikel für Kinder)
        'section[data-area="latest-news"]', //Extra Hinweis auf neue Artikel
        'section[data-area="block>marketplace"]', //Leerer WIP Bereich, dessen Inhalt nicht geladen wird (Spiegel, was los?)
        'section[data-area="block>bookmarks"]', //"Für mich" Abschnitt / Aufforderung zum Registrieren (Account erstellen)
        'section[data-area="block>widget>Abovorteile SPIEGEL+"]', //Werbung
        'section[data-area^="block>magletter"]', //Spiegel+ "Spiegel Extra"
        'section[data-area="block>adobe_target"]', //Werbung "Verlagsangebot"
        'section[data-area="block>Effilee"]', //effilee.de Rezepte
        'section[data-advertisement*="mobile"]',//Werbung auf Mobilgeräten
        '[data-area="block>sportdaten"]', //Sportdaten bzw. Spielergebnisse
        '[data-contains-flags^="Spplus-conditional"]', //Spiegel Plus Symbol bei kostenlosen Artikeln
        '[data-area^="block>podcastslider"]', //Podcast Menü
        'div[data-area="group:wirtschaft"] > .border-r', //entfernt eine Linie, mehr nicht
        'div.mt-12', //Lesezeichen und Lesedauer Infoleiste
        'div.mt-8 > .flex', //Lesezeichen und Lesedauer Infoleiste
        '[data-sara-component*="Immer auf dem Laufenden bleiben?"]', //Anleitung zum Aktivieren von "Benachrichtigungen"
        'section[data-area="block>contentbox:"]',//Werbung
    ];
    var badSpans = document.querySelectorAll(abschnitte)
    badSpans.forEach((s) => {
    if(s !== undefined) {
        s.remove()
      }
    })
})();

//entfernt den Abschnitt "Top bei SPIEGEL+"
var elList = document.querySelectorAll("span");
elList.forEach(function(el) {
    if (el.innerHTML.indexOf("Top bei SPIEGEL+") !== -1) {
        var containerElement3 = el.closest('section[data-area="block>topreads"]');
        if(containerElement3 && containerElement3.parentElement){
            containerElement3.parentElement.removeChild(containerElement3);
        }
    }
});

//entfernt Hyperlinks, die auf Spiegel Plus Artikel / HBM Plus Artikel / die generische Thema-Seite verlinken, ohne den Text zu entstellen.
var links4 = document.querySelectorAll(".RichText a");
links4.forEach(function(el) {
    var flagge = el.querySelector('svg');
    if (flagge){
    var external_flagge = flagge.querySelector('[*|href="#spon-external-flag-l"]');
    if (flagge.parentElement && !(flagge.getAttribute("id") === 'spon-external-flag-l') && !external_flagge) {
       flagge.parentElement.removeChild(flagge);
       el.replaceWith(...el.childNodes);
        }}
    if (el.getAttribute("href").indexOf ("www.spiegel.de/thema/")!== -1) {
       el.replaceWith(...el.childNodes);
}
});

//entfernt den "Mehr zum Thema" Abschnitt aus Artikeln, wenn alle vorgeschlagenen Artikel von Spiegel Plus sind. Selbst dann, wenn der Abschnitt irgend einen anderen Namen trägt.
var links5 = document.querySelectorAll("span.leading-tight");
for(var link5 of links5) {
    if ((link5.innerHTML.indexOf("Mehr lesen über") == -1)&&(link5.innerHTML.indexOf("Verwandte Artikel") == -1)&&(link5.innerHTML !== null)) {
         var group = link5.closest(".mx-auto");
         var artikel = group.querySelector(".items-center, .RichText");
         if (!artikel){
             entfernen(group);
            }
    }
};

//entfernt den "Verwandte Artikel" Abschnitt aus Artikeln, wenn alle vorgeschlagenen Artikel von Spiegel Plus sind und daher bereits entfernt wurden.
var links6 = document.querySelectorAll("h3.leading-tight");
for(var link6 of links6) {
    if (link6.innerHTML.indexOf("Verwandte Artikel") !== -1) {
         var group2 = link6.closest(".w-full");
         var artikel2 = group2.querySelector(".pl-12, .pl-6");
             if (!artikel2){
             entfernen(link6);
             }
   }
};

//expandiert "Mehr anzeigen" im Abschnitt "Verwandte Artikel" unter Artikeln, wenn vorhanden, um ein einheitliches Layout wiederherzustellen.
var bttn = document.querySelectorAll('button.border');
for(var bttn1 of bttn){
var mehr = bttn1.querySelectorAll('span.leading-normal');
for(var mehr1 of mehr){
if (mehr1.innerHTML.indexOf("Mehr anzeigen") !== -1) {
    bttn1.click();
    entfernen(bttn1);
}}}

//entfernt Newsletter-Angebote, die als iframe geladen werden
function iframe_removal(){
var newsletter_frame = document.querySelector('iframe[src*="embedded/newsletter/box"]');
if (newsletter_frame) {
    var newsletter_box = newsletter_frame.closest('div [data-area="html-embed"]');
    entfernen(newsletter_box);
    remember_usage = 1;
    }
}
iframe_removal();
var iframe_detection = document.querySelector('div [data-area="html-embed"]');
var remember_usage = '';
if (iframe_detection){
    window.addEventListener("scroll",
                            function() {
        if (remember_usage !== 1){
            iframe_removal();
            setTimeout(iframe_removal, 1000);
}});
}

if(window.location.href === "https://www.spiegel.de/"){
// entfernt etwaige Abschnitte von der Hauptseite, wenn alle enthaltenen Artikel von Spiegel Plus sind und daher bereits entfernt wurden.
var links8 = document.querySelectorAll('[data-area^="block>topic"], [data-area^="block>latestarticles:"]');
for(var link8 of links8) {
var artikel4 = link8.querySelector('div [data-area^="article_teaser"]');
      if (!artikel4){
      entfernen(link8);
      }
};
    var zone_header = document.querySelectorAll('[data-area^="block>zoneheader"]');
    for (var zonehead of zone_header){
        var next_up = zonehead.nextElementSibling;
        if(next_up){
            var article_inside = next_up.querySelector('div [data-area^="article_teaser"]');
            while(next_up && !article_inside && !(next_up.hasAttribute('data-area') && next_up.getAttribute('data-area').indexOf('block>zoneheader') !== -1)){
                next_up = next_up.nextElementSibling;
                if (next_up){
                    article_inside = next_up.querySelector('div [data-area^="article_teaser"]');
                }
            }
            if(!next_up || next_up.hasAttribute('data-area') && next_up.getAttribute('data-area').indexOf('block>zoneheader') !== -1){
                entfernen(zonehead);
            }
        }
    }

// entfernt etwaige Rubriken unter "Alle Rubriken", wenn alle enthaltenen Artikel von Spiegel Plus sind und daher bereits entfernt wurden.
var links9 = document.querySelectorAll('div[data-area^="group:"]');
for(var link9 of links9) {
var artikel5 = link9.querySelector(".font-bold");
      if (!artikel5){
      entfernen(link9);
      }
};

// behebt einen kleinen Fehler
var anfang = document.querySelectorAll('.lg\\:top-32');
    if (anfang) {
    for(var anfang1 of anfang) {
    anfang1.classList.remove("lg:top-32");
    }
    }
}

//räumt ein paar übriggebliebene Linien auf
if(window.location.href.indexOf("https://www.spiegel.de/suche/")== -1){
var links13 = document.querySelectorAll("div.border-separator-b");
for(var link13 of links13) {
    if (link13 && link13.parentElement){
    if (link13.classList.contains("w-full")) {
    var prev13 = link13.previousElementSibling;
    prev13 = skipHiddenElements(prev13, 'previousElementSibling');
    var next13 = link13.nextElementSibling;
    next13 = skipHiddenElements(next13, 'nextElementSibling');
    var teaserlist = link13.closest('[data-area="article-teaser-list"]');
    if ((!next13 || !prev13)&& link13.parentElement && !teaserlist) {
    link13.parentElement.removeChild(link13);
    }
        if (link13 && link13.parentElement && prev13 && !teaserlist) {
        if (prev13.classList.contains("z-20")|| prev13.classList.contains("top-0")){
        link13.parentElement.removeChild(link13);
        }
        }
        if (link13 && link13.parentElement && teaserlist) {
            var next_p13 = link13.parentElement.nextElementSibling;
            next_p13 = skipHiddenElements(next_p13, 'nextElementSibling');
            if (!next_p13 || next_p13 && !(next_p13.hasAttribute("data-block-el"))){
                link13.parentElement.removeChild(link13);
            }
        }
        if (link13 && link13.parentElement && prev13 && !teaserlist) {
        if (prev13.classList.contains("border-separator-b")){
        link13.parentElement.removeChild(link13);
        }
        }
        if (link13 && link13.parentElement && next13 && !teaserlist) {
        if (next13.classList.contains("border-separator-b")){
        link13.parentElement.removeChild(link13);
        }
        }
    }
    }
}
}

    function entfernen(el1) {
        if(el1 && el1.parentElement){
            el1.parentElement.removeChild(el1);
        }};

    function skipHiddenElements(skippedElem, skipDirection){
        var limit = 0;
        while(limit < 4 && skippedElem && skippedElem.matches('.lg\\:hidden, .hidden, .lg\\:advertisement-filled\\:w-full, script, [data-advertisement^="pos"]')){
            if (skipDirection.indexOf("nextElementSibling") !== -1) {
                skippedElem = skippedElem.nextElementSibling;
            } else {
                skippedElem = skippedElem.previousElementSibling;
            }
            limit++;
        }
        return skippedElem;
    }

})();