// ==UserScript==
// @name         arrayOfWordsToMatch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://greasyfork.org/en/script_versions/new
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @include     *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/394274/arrayOfWordsToMatch.user.js
// @updateURL https://update.greasyfork.org/scripts/394274/arrayOfWordsToMatch.meta.js
// ==/UserScript==

(function() {
    'use strict';

   // sessionStorage.clear();

   var arrayOfWords = [['Anställningsvillkor','Nyheter i ditt kollektivavtal', 'Unionen','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Köpa hus','Känner du till Hemnet?', 'Hemnet','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Rekrytering','Nya digitala verktyg', 'Arbetsförmedlingen','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Bredband','Rabatt på bredband', 'Mecenat','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Barnvagn','Bäst pris på barnvagnar', 'Babycard','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Hyra lägenhet','Tänk på det här innan du skriver på kontraktet', 'Hyresgästföreningen','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Pink Lady','Äpplen som sponsrar krig', 'Röda Korset','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Fläskfilé','59 kr / kg för plusmedlemmar', 'Willys','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Högtalare','Rea på bluetooth högtalare', 'Kjell & Company','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Crosstrainer','vilken blev bäst i test?', 'Träningsmaskiner','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Robert Deniro','är med i kritikerosande The Irishman', 'HBO','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Zlatan','Ny dokumentär på', 'SVT play','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Donald Trump','Ny trendande tweet på', 'Twitter','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Köping','här hittar du nyheter om Köping', 'MittMedia','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Hotell Barcelona','bäst pris på hotell i Barcelona', 'Hotels.com','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Tesla','boka provkörning av Model 3 här', 'Tesla Sweden','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Homo Deus','registrera dig gratis och lyssna på ljudboken', 'Bookbeat','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Salami','Undvik när du är gravid', 'Livsmedelsverket','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/'],
                       ['Gorgonzola','Undvik när du är gravid', 'Livsmedelsverket','https://www.livsmedelsverket.se/matvanor-halsa--miljo/kostrad-och-matvanor/ammande/']]

   var itemCount = Number(sessionStorage.getItem('itemCount'))

   console.log('Försöker placera ' + arrayOfWords.length + ' ord i session storage')
   //console.log('Finns en lista med ' + itemCount.length() + ' ord i sessions storage')


for (var x of arrayOfWords) {

    // console.log('session storage length =' + sessionStorage.getItem('itemCount'))

    var alreadyInSession = 0;
    //check if a word already exist in session storage
  if (itemCount !== 0) {
      for (var i = 0; i <= itemCount; i++) {
           if (x === sessionStorage.getItem(i)) {
              alreadyInSession = alreadyInSession + 1;
           }
      }

      if (alreadyInSession === 0) {
          console.log(x + ' finns INTE i session storage')
          sessionStorage.setItem('itemCount', itemCount);


          sessionStorage.setItem(itemCount, JSON.stringify(x))
          //sessionStorage.setItem(itemCount, x)


          console.log('itemCount =' + itemCount)
          itemCount = itemCount + 1
      } else {
        console.log(x + ' finns redan i session storage')
      }
  } else {
      sessionStorage.setItem('itemCount', itemCount);


      sessionStorage.setItem(itemCount, JSON.stringify(x))
      //sessionStorage.setItem(itemCount, x)


      console.log(x + ' finns INTE i session storage, första i session storage')
      console.log('itemCount =' + itemCount)
      itemCount = 1;

}
}

})();