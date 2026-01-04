// ==UserScript==
// @name         pepper.pl,mydealz.de,hotukdeals.com kafelki
// @namespace    http://pepper.pl/
// @version      0.27
// @description  przywraca stary widok dla peppera + mydealz.de + hotukdeals.com. Wszystkie serwisy pracują na tym samym systemie, więc dodanie obsługi nie było skomplikowane.
// @author       me__
// @license MIT
// @match        https://www.pepper.pl/*
// @include      https://www.hotukdeals.com/*
// @exclude      https://www.hotukdeals.com/vouchers*
// @exclude      https://www.hotukdeals.com/discussions*
// @exclude      https://www.hotukdeals.com/profile*
// @exclude      https://www.hotukdeals.com/submission*
// @include      https://www.mydealz.de/*
// @exclude      https://www.mydealz.de/diskussion*
// @exclude      https://www.mydealz.de/gutscheine*
// @exclude      https://www.mydealz.de/profile*
// @exclude      https://www.mydealz.de/submission*
// @exclude      https://www.pepper.pl/dyskusji*
// @exclude      https://www.pepper.pl/grupa
// @exclude      https://www.pepper.pl/kupony*
// @exclude      https://www.pepper.pl/profile*
// @exclude      https://www.pepper.pl/submission*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413051/pepperpl%2Cmydealzde%2Chotukdealscom%20kafelki.user.js
// @updateURL https://update.greasyfork.org/scripts/413051/pepperpl%2Cmydealzde%2Chotukdealscom%20kafelki.meta.js
// ==/UserScript==

(function() {
    'use strict';
  addGlobalStyle(`/*ustawia widok 2,3,4,5,6,7 kolumn*/@media (max-width: 800px){article.thread,div.js-banner,a.cept-event-banner,.cept-widget-list,.discussionHorizontalWidget,section.thread,div[id^="customBannerList"],div[id^="eventBannerPortal"] {width:49.6%;margin:.2%;overflow:hidden;float:left;height:500px;zoom:0.8;padding:5px;}.listLayout-side{width:100%;margin:5px} }
  @media (min-width: 801px){article.thread,div.js-banner,a.cept-event-banner,.cept-widget-list,.discussionHorizontalWidget,section.thread,div[id^="customBannerList"],div[id^="eventBannerPortal"] {width:32.9%;margin:.2%;overflow:hidden;float:left;height:500px;zoom:0.8;padding:5px;}.listLayout-side{width:100%;margin:5px} }
  @media (min-width: 1024px){article.thread,div.js-banner,.cept-widget-list,a.cept-event-banner,section.thread,div[id^="customBannerList"],div[id^="eventBannerPortal"]  {width:24.3%;margin:0 .2% .4% .2%;overflow:hidden;float:left;height:500px;zoom:0.8;padding:5px;}.listLayout-side{width:24%;}.listLayout-main{width:80%;margin-top:.57143em} .listLayout-mainItem {margin-bottom:.57143em}}
  @media (min-width: 1600px){article.thread,div.js-banner,.cept-widget-list,a.cept-event-banner,section.thread,div[id^="customBannerList"],div[id^="eventBannerPortal"]  {width:19.5%;}.listLayout-side{width:20%;}.listLayout-main{width:80%;} .page2-center {max-width:100%}}
  @media (min-width: 2000px){article.thread,div.js-banner,.cept-widget-list,a.cept-event-banner,section.thread,div[id^="customBannerList"],div[id^="eventBannerPortal"]  {width:16%;}.listLayout-side{width:14.5%;} .listLayout-main{width:85.5%} }
  @media (min-width: 2400px){article.thread,div.js-banner,.cept-widget-list,a.cept-event-banner,section.thread,div[id^="customBannerList"],div[id^="eventBannerPortal"] {width:12%;}.listLayout-side{width:12.0%;} .listLayout-main{width:88.0%} }
  /*ukrywa niepotrzebne rzeczy */
  div[id^="eventBannerPortal"] .space--mt-2,  div[id^="eventBannerPortal"]{margin-top: 0px !important;padding:0px;}
  .thread-title--list {font-size:.9rem!important;line-height:1.2rem !important} .vote-temp {font-size:.9rem !important; } .hide--toW3{font-size:.9rem}');
  div.threadGrid-title + div {margin-top:0px !important;}
  .cept-description-container{overflow:auto;text-overflow: ellipsis;}
  .footerMeta-infoSlot {position:relative !important;}
  /*usuwa boczne marginesy*/
  .listLayout{max-width:100%;}
  .threadGrid-headerMeta,.threadListCard-header {grid-column-start:1 !important;grid-column-end:1 !important;grid-row:1 !important}
  .threadListCard-header,.threadListCard-footer{padding:0px; background-color: var(--bgBaseSecondary);}
  /*stare ukrywanie elementów zbędnych*/
  .threadListCard:not(.threadListCard--noImage)::before{background-color:transparent}
  .threadListCard-body > div > span > span.thread-divider.hide--toW3.space--mh-0 {display:none;}
  /*usuwa "dodane przez" razem z nazwa użytkownika i avatarem*/
  .threadListCard-body > .box--contents >div> span >span:nth-child(2) >span:nth-child(2) {display:none;}
  .threadListCard-body > .box--contents >div> span >span:nth-child(1) >span:nth-child(2) {display:none;}
  /*ukrywa kreskę przed nazwą sklepu */
  .threadListCard-body > .box--contents >div> span>span.thread-divider{display:none;}
  /*dodaje ikone koszyka przed dostawca i ukrywa "dostepne przez"*/
  .threadListCard-body > .box--contents >div> span> span:nth-child(2) >span{font-size:.1px}
  .threadListCard-body > .box--contents >div> span >span:nth-child(2) >span a,.threadListCard-body > .box--contents >div> span >span:nth-child(2) >span span{font-size:14px;width:100%;}
  .threadListCard-body > .box--contents >div> span >span:nth-child(2) >span a::before,.threadListCard-body > .box--contents >div> span >span:nth-child(2) >span span::before{content:"🛒 ";}
  /*przenosi nazwę sklepu do nowej linii */
   .threadListCard-body > .box--contents >div {flex-direction:column;align-items:baseline;}
   /*zastepuje darmowa dostawa */
  .threadListCard-body > .box--contents >div> div>span:nth-child(2) >span:nth-child(2) {display:none}
   /*widok alertow */
   .tabbedInterface .page-content {max-width:100%;}
   .page-center{margin-left:0px;}
    .listLayout-main{width:100vw}


  .threadGrid-title,.thread-title  {grid-column-start:1 !important;grid-column-end:1 !important;grid-row:3 !important}
  .threadGrid-body,.threadListCard-body {grid-column-start:1 !important;grid-column-end:1 !important;grid-row:4 !important;overflow:hidden;align-self:start;margin-top:0px;} .threadGrid-body:hover {overflow:auto;}
  .threadGrid-footerMeta,.threadListCard-footer {grid-column-start:1 !important;grid-column-end:1 !important;grid-row:5 !important}
  .threadGrid-image,.threadListCard-image {grid-column-start:1 !important;grid-column-end:1 !important;grid-row:2 !important;max-height:100%;}
  .thread-listImgCell,img.thread-image{max-height:100%;max-width:100%;object-fit:cover;margin:0 auto;}
  .threadListCard::before{background:transparent;}
  .chip--type-default{background:var(--bgBaseSecondary)}
  .imgFrame:not(.bg--main){height:200px;padding-top:0px;}
  .threadGrid,.threadListCard{grid-template-columns:100% auto;grid-template-rows:auto auto auto 1fr auto;height:100%;padding:0}
  article.cept-thread-item + div {display:none;}`);

})();
(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
    if(document.querySelector('#mySelector')) {
        observer.disconnect();
        // actions to perform after #mySelector is found
    }
}
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}