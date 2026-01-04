// ==UserScript==
// @name        ReadM Larger Thumbnails by Sapioit
// @namespace   Sapioit
// @copyright   Sapioit, 2020 - Present
// @author      sapioitgmail.com
// @license     GPL-2.0-only; http://www.gnu.org/licenses/gpl-2.0.txt
// @match       https://readm.org/
// @match       https://readm.org/latest-releases
// @match       https://readm.org/latest-releases/
// @match       https://readm.org/latest-releases/*
// @match       https://readm.org/manga
// @match       https://readm.org/manga/
// @match       https://readm.org/manga/*
// @match       https://readm.org/category
// @match       https://readm.org/category/
// @match       https://readm.org/category/*
// @match       https://www.readm.org/
// @match       https://www.readm.org/latest-releases
// @match       https://www.readm.org/latest-releases/
// @match       https://www.readm.org/latest-releases/*
// @match       https://www.readm.org/manga
// @match       https://www.readm.org/manga/
// @match       https://www.readm.org/manga/*
// @match       https://www.readm.org/category
// @match       https://www.readm.org/category/
// @match       https://www.readm.org/category/*
// @description Makes the thumbnails more visible by making them bigger, the text selectable, adds the code all-pages to most links, and improves/replaces the pagination.
// @version     1.9.0.03
// @icon        https://readm.org/favicon.ico
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue


// @downloadURL https://update.greasyfork.org/scripts/418848/ReadM%20Larger%20Thumbnails%20by%20Sapioit.user.js
// @updateURL https://update.greasyfork.org/scripts/418848/ReadM%20Larger%20Thumbnails%20by%20Sapioit.meta.js
// ==/UserScript==
// @downloadURL https://greasyfork.org/scripts/418848-readmg-larger-thumbnails-by-sapioit/code/ReadMG%20Larger%20Thumbnails%20by%20Sapioit.user.js
// @updateURL   https://openuserjs.org/install/sapioitgmail.com/ReadMG_Larger_Thumbnails_by_Sapioit.user.js
/*
CHANGELOG

v1.9.0.00
- Mobile-friendly style optimized to show multiple manga per row.

v1.8.4.0
- Fixed broken links (broken by the website admin) to manga.

v1.8.0.0
- Fixed broken images (broken by the website admin), and the pagination if you are logged in (which is now required to view the links to each chapter).

v1.7.1.0
- Added a special character link before each manga link, for the manga links which don't like having /all-pages at the end.


*/

/*GM_setValue(widemode,0);
GM_getValue(widemode,0);*/
GM_registerMenuCommand('Toggle Wide Mode', function() {
  GM_setValue(`widemode`,!GM_getValue(`widemode`,0));
  GM_addStyle('@media (max-width: 1000px) { .dark-segment>ul .segment-poster-sm { width: 300px !important; display: inline-block; float: left; } }');
  GM_addStyle('.dark-segment>ul .segment-poster-sm { width: 33%; }');
  GM_addStyle('#wrapper { max-width: 1280px !important; }');
  if(GM_getValue(`widemode`,0)){
    GM_addStyle('@media (max-width: 1000px) { .dark-segment>ul .segment-poster-sm { width: 300px !important; display: inline-block; float: left; } }');
    GM_addStyle('.dark-segment>ul .segment-poster-sm { width: 24%; }');
    GM_addStyle('#wrapper { max-width: 1600px !important; }');
  }
});

GM_registerMenuCommand('Toggle Max-Width', function() {
  GM_setValue(`maxwidth`,!GM_getValue(`maxwidth`,0));
  GM_addStyle('.chapter a img, .chapter img { max-width: 100% !important; }');
  if(GM_getValue(`maxwidth`,0)){
    GM_addStyle('.chapter a img, .chapter img { max-width: none !important; }');
  }
});

GM_registerMenuCommand('Refresh Thumbnails', reset_thumbnails());

function reset_thumbnails(){
  if (!(window.location.href.includes('readm.org/manga/'))) { return; }
  // Select all the elements with the CSS query
  let elements = document.querySelectorAll('.poster.poster-xs img');
  // Loop through each element
  elements.forEach((element) => {
    // Copy the 'data-src' attribute to the 'src' attribute
    element.src = element.dataset.src;
  });
}

GM_addStyle('@media (max-width: 1000px) { .dark-segment>ul .segment-poster-sm { width: 300px !important; display: inline-block; float: left; } }');
GM_addStyle('.dark-segment>ul .segment-poster-sm { width: 33%; }');
GM_addStyle('#wrapper { max-width: 1280px !important; }');
if(GM_getValue(`widemode`,0)){
  GM_addStyle('@media (max-width: 1000px) { .dark-segment>ul .segment-poster-sm { width: 300px !important; display: inline-block; float: left; } }');
  GM_addStyle('.dark-segment>ul .segment-poster-sm { width: 24%; }');
  GM_addStyle('#wrapper { max-width: 1600px !important; }');
}

GM_addStyle('#wrapper { max-width: 1280px !important; }');
if(GM_getValue(`widemode`,0)){
  GM_addStyle('@media (max-width: 1000px) { .dark-segment>ul .segment-poster-sm { width: 300px !important; display: inline-block; float: left; } }');
  GM_addStyle('.dark-segment>ul .segment-poster-sm { width: 24%; }');
  GM_addStyle('#wrapper { max-width: 1600px !important; }');
}

GM_addStyle('@media (max-width: 1000px) { .dark-segment>ul .segment-poster-sm { width: 300px !important; display: inline-block; float: left; } }');
GM_addStyle('.poster.poster-xs img { max-width: 150px !important; min-width: 150px !important; height: 212px !important; margin: 0 !important; }');
GM_addStyle('.latest-updates .poster.poster-xs { height: 212px !important; }');
GM_addStyle('.truncate { white-space: normal !important; }');
GM_addStyle('.ui.pagination.menu .item, .ui.menu .item { margin: 0 !important; padding 10px !important; }');
GM_addStyle('.poster.poster-xs a:link { color: #fff !important; }');
GM_addStyle('.poster.poster-xs a:visited { color: #f6c6c6 !important; font-style: italic !important; }');
GM_addStyle('ul.chapters li a:visited { color: #f6c6c6 !important; font-style: italic !important; }');
GM_addStyle('ul.chapters li a:visited { color: #fcc !important; font-style: italic !important;  }');
GM_addStyle('a:visited { color: #fcc !important; font-style: italic !important; }');
GM_addStyle('.inner-content { padding-left:0 !important; padding-right:0 !important; }');
GM_addStyle('.mt-0, #series-tabs, .pb-0 { padding-left: 30px !important; padding-right: 30px !important; }');
GM_addStyle('li.item { padding: 0 !important; }');
GM_addStyle('li.item a { padding: .92857143em 1.14285714em !important; }');
GM_addStyle('li.item a:visited { color: #fcc !important; font-style: italic !important;  }');
GM_addStyle('#podium-spot { display:none !important; }');
GM_addStyle('body > iframe { display:none !important; }');
GM_addStyle('#router-view center { display: none !important; }');
GM_addStyle('#router-view div center { display: block !important; }');
GM_addStyle('#router-view div[data-onpage="true"] { display: none !important; }');
GM_addStyle('#gpt_unit_/30438525/Readm/ReadM_Interstitial_0 { display: none !important; }'); /*google interstitial ads*/
GM_addStyle('#aniBox { display: none !important; }');
GM_addStyle('.chapter center { display: none !important; }');
GM_addStyle('#series-tabs > p > span[style] { color: white !important; background: #14161d !important;}');
GM_addStyle('.wider-text { transform: scaleX(1.2); -webkit-transform: scaleX(1.2); -moz-transform: scaleX(1.2); -ms-transform: scaleX(1.2); }');
GM_addStyle('.wider-text { transform: scaleX(2); -webkit-transform: scaleX(2); -moz-transform: scaleX(2); -ms-transform: scaleX(2); letter-spacing: -4px; }');
GM_addStyle('.wider-text { padding-right: 8px; }');
GM_addStyle('body::-webkit-scrollbar { width: 15px; }');
GM_addStyle('body { scrollbar-width: auto; }');


//document.getElementById("podium-spot").outerHTML = "";


window.onload = function() {
  var lnks = document.querySelectorAll('.poster-xs a');
  console.log(lnks);
  for (var k = 0; k < lnks.length; k++) {
    if(!(lnks[k].href.includes("/all-pages"))){
      lnks[k].href = lnks[k].href;
      lnks[k].className = "manga-link";
      lnks[k].classList.add("manga-link");
    }
  }
  var lnks2 = document.querySelectorAll('.poster-xs .truncate a');
  console.log(lnks2);
  /*for (k = 0; k < lnks.length; k++) {
        if(!lnks[k].parentElement.parentElement.classList.contains('chapters')){
            lnks[k].outerHTML = "<a href=\"" + lnks[k].href.replace("/all-pages","") + "\">&#10151; </a>" + lnks[k].outerHTML;*/
  for (k = 0; k < lnks2.length; k++) {
    if(!lnks2[k].parentElement.parentElement.classList.contains('chapters')){
      lnks2[k].outerHTML = "<a href=\"" + lnks2[k].href + "/all-pages" + "\" class=\"wider-text\">&#10151;&#10151; </a>" + lnks2[k].outerHTML;
      console.log(lnks2[k].outerHTML+'<br/>\n');
      /* &#9686; &#10148; &#10151; */
      /* https://html-css-js.com/html/character-codes/arrows */
    }
  }
  var lnks3 = document.querySelectorAll('.poster-subject .chapters a:link');
  console.log(lnks);
  for (var l = 0; l < lnks3.length; l++) {
    if(!(lnks3[l].href.includes("/all-pages"))){
      lnks3[l].href = lnks3[l].href + "/all-pages";
      lnks3[l].className = "manga-chapter-link";
      lnks3[l].classList.add("manga-chapter-link");
    }
  }
  setTimeout(function() {
    var lnks3 = document.querySelectorAll('img.lazy-wide');
    //for (var h = 0; h < lnks2.length; h++) {
    for (var h = 0, k; h < lnks3.length; h++) {
      //console.log(lnks2[h].src);
      //lnks2[h].src=(lnks2[h].src).replace("_30x0","_198x0");
      //lnks2[h].setAttribute('data-src', (lnks2[h].getAttribute('data-src')).replace("_30x0","_198x0"));
      //lnks3[h].setAttribute('data-src', (lnks3[h].getAttribute('data-src')).replace("_30x0","_198x0"));
      //lnks3[h].setAttribute('src', (lnks3[h].getAttribute('src')).replace("_30x0","_198x0"));
      k = (lnks3[h].getAttribute('src'));
      //alert( k.includes("_30x0.") + '\n' + k.includes("_198x0.") + '\n' + (!(k.includes("_30x0.")) && !(k.includes("_198x0."))) );
      //if (h>1) break;
      if ( !(k.includes(".disquscdn.com/")) ) {
        //if ( !(k.includes("_30x0.")) && !(k.includes("_198x0.")) ) {
        //  k = (lnks3[h].getAttribute('src')).split('.');
        //  lnks3[h].setAttribute('src', k[0] + "_198x0." + k[1]);
        //  k = (lnks3[h].getAttribute('data-src')).split('.');
        //  //lnks3[h].setAttribute('data-src', k[0] + "_30x0." + k[1]);
        //  lnks3[h].setAttribute('data-src', lnks3[h].getAttribute('data-src')[0] + "_30x0." + k[1]);
        //  lnks3[h].setAttribute('class', "lazy-wide loaded");
        //}
        lnks3[h].setAttribute('data-src', (lnks3[h].getAttribute('data-src')).replace("_30x0","_198x0"));
        lnks3[h].setAttribute('src', (lnks3[h].getAttribute('src')).replace("_30x0","_198x0"));
        lnks3[h].setAttribute('data-src', (lnks3[h].getAttribute('data-src')).replace("_198x0_30x0","_198x0"));
        lnks3[h].setAttribute('src', (lnks3[h].getAttribute('src')).replace("_198x0_30x0","_198x0"));
        lnks3[h].setAttribute('data-src', (lnks3[h].getAttribute('data-src')).replace("_30x0_198x0","_198x0"));
        lnks3[h].setAttribute('src', (lnks3[h].getAttribute('src')).replace("_30x0_198x0","_198x0"));
        lnks3[h].setAttribute('data-src', (lnks3[h].getAttribute('data-src')).replace("_30x0_30x0","_198x0"));
        lnks3[h].setAttribute('src', (lnks3[h].getAttribute('src')).replace("_30x0_30x0","_198x0"));
        lnks3[h].setAttribute('data-src', (lnks3[h].getAttribute('data-src')).replace("_198x0_198x0","_198x0"));
        lnks3[h].setAttribute('src', (lnks3[h].getAttribute('src')).replace("_198x0_198x0","_198x0"));
      }
      k = lnks3[h];
      if (k.classList.contains('error')) {
        k.classList.remove('error');
        k.classList.add('loaded');
      }
      //console.log(lnks2[h].src);
      //console.log(lnks2[h].getAttribute('data-src'));
      //console.log(lnks2);
      console.log(lnks3);
    }
  }, 2*1000); // 2 second will elapse and Code will execute.
}

GM_addStyle('.click-right.pageskin-click-div, .click-left.pageskin-click-div { display:none !important; }');
GM_addStyle('body { background: url() #111216 !important; }');

function updatestylesbysapioit(){
  GM_addStyle('@media (max-width: 1000px) { .dark-segment>ul .segment-poster-sm { width: 300px !important; display: inline-block; float: left; } }');
  GM_addStyle('.dark-segment>ul .segment-poster-sm { width: 33%; }');
  GM_addStyle('#wrapper { max-width: 1280px !important; }');
  if(GM_getValue(`widemode`,0)){
    GM_addStyle('.dark-segment>ul .segment-poster-sm { width: 24%; }');
    GM_addStyle('#wrapper { max-width: 1600px !important; }');
  }
  GM_addStyle('.poster.poster-xs img { max-width: 150px !important; min-width: 150px !important; height: 212px !important; margin: 0 !important; }');
  GM_addStyle('.latest-updates .poster.poster-xs { height: 212px !important; }');
  GM_addStyle('.truncate { white-space: normal !important; }');
  GM_addStyle('.ui.pagination.menu .item, .ui.menu .item { margin: 0 !important; padding 10px !important; }');
  GM_addStyle('.poster.poster-xs a:link { color: #fff !important; }');
  GM_addStyle('.poster.poster-xs a:visited { color: #f6c6c6 !important; font-style: italic !important; }');
  GM_addStyle('ul.chapters li a:visited { color: #f6bf6c6c66b6 !important; font-style: italic !important; }');
  GM_addStyle('a:visited { color: #fcc !important; font-style: italic !important; }');
  GM_addStyle('.inner-content { padding-left:0 !important; padding-right:0 !important; }');
  GM_addStyle('.mt-0, #series-tabs, .pb-0 { padding-left: 30px !important; padding-right: 30px !important; }');
  //GM_addStyle('#material .scroll { overflow-y: auto; max-height: 30vh !important; }'); // MAL-Sync
  GM_addStyle('#podium-spot { display:none !important; }');
  GM_addStyle('body > iframe { display:none !important; }');
  //GM_addStyle('#router-view center { display: none; }');
  GM_addStyle('#gpt_unit_ { display:none !important; }'); /*google ads*/
  if(typeof document.getElementById("podium-spot") != "undefined" && document.getElementById("podium-spot") != null){
    document.getElementById("podium-spot").outerHTML = "";
  }
  console.log("Sapioit: updatestylesbysapioit");
}

setTimeout(function() {
  updatestylesbysapioit();
}, 5*1000); // 5 seconds will elapse and Code will execute.

setTimeout(function() {
  updatestylesbysapioit();
}, 10*1000); // 10 seconds will elapse and Code will execute.

setTimeout(function() {
  updatestylesbysapioit();
}, 15*1000); // 15 seconds will elapse and Code will execute.



setTimeout(function() { // Adds extra pages!
  console.log("Sapioit: pagination start");
  var address = document.location.pathname;
  if(address.startsWith("/latest-releases")){
    var releases_page_number = address;
    if(address == "/latest-releases"){
      releases_page_number = 0;
    } else {
      releases_page_number=address.replace("/latest-releases/", "");
      if (releases_page_number === '')
        releases_page_number = 0;
      releases_page_number=parseInt(releases_page_number);
      console.log("Sapioit: page number: " + releases_page_number);
    }
    var list_of_pages;
    list_of_pages = document.getElementsByClassName("menu").length;
    list_of_pages = document.getElementsByClassName("menu")[list_of_pages-1];
    var current_element_in_list = list_of_pages.getElementsByTagName("li");
    list_of_pages.innerHTML="";
    list_of_pages.innerHTML=list_of_pages.innerHTML + '<li class="item"><a data-navigo="" href="/latest-releases/1">First</a></li>';
    if(releases_page_number>100) {
    } if(releases_page_number>100) {
      list_of_pages.innerHTML=list_of_pages.innerHTML + '<li class="item"><a data-navigo="" href="/latest-releases/'+(releases_page_number-100)+'"><i>'+(releases_page_number-100)+'</i></a></li>';
    } if(releases_page_number>50) {
      list_of_pages.innerHTML=list_of_pages.innerHTML + '<li class="item"><a data-navigo="" href="/latest-releases/'+(releases_page_number-50)+'"><i>'+(releases_page_number-50)+'</i></a></li>';
    } if(releases_page_number>10) {
      list_of_pages.innerHTML=list_of_pages.innerHTML + '<li class="item"><a data-navigo="" href="/latest-releases/'+(releases_page_number-10)+'"><i>'+(releases_page_number-10)+'</i></a></li>';
    }
    list_of_pages.innerHTML=list_of_pages.innerHTML + '<li class="item"><a data-navigo="" href="/latest-releases/'+(releases_page_number-1)+'">«</a></li>';
    for(var i = releases_page_number - 3; i < releases_page_number + 4; i++){
      if(i>-1){
        if(i==releases_page_number){
          list_of_pages.innerHTML=list_of_pages.innerHTML + '<li class="item active"><a data-navigo="" href="/latest-releases/'+i+'">'+i+'</a></li>';
        } else {
          list_of_pages.innerHTML=list_of_pages.innerHTML + '<li class="item"><a data-navigo="" href="/latest-releases/'+i+'">'+i+'</a></li>';
        }
      }
    }
    list_of_pages.innerHTML=list_of_pages.innerHTML + '<li class="item"><a data-navigo="" href="/latest-releases/'+(releases_page_number+1)+'">»</a></li>';
    if (releases_page_number < 7){
      list_of_pages.innerHTML=list_of_pages.innerHTML + '<li class="item"><a data-navigo="" href="/latest-releases/10">Tenth</a></li>';
    }
    list_of_pages.innerHTML=list_of_pages.innerHTML + '<li class="item"><a data-navigo="" href="/latest-releases/'+(releases_page_number+10)+'"><i>'+(releases_page_number+10)+'</i></a></li>';
    list_of_pages.innerHTML=list_of_pages.innerHTML + '<li class="item"><a data-navigo="" href="/latest-releases/'+(releases_page_number+50)+'"><i>'+(releases_page_number+50)+'</i></a></li>';
    list_of_pages.innerHTML=list_of_pages.innerHTML + '<li class="item"><a data-navigo="" href="/latest-releases/'+(releases_page_number+100)+'"><i>'+(releases_page_number+100)+'</i></a></li>';

    console.log('' + list_of_pages + '\n\n\n');
    console.log(list_of_pages.innerHTML);
  }
  console.log("Sapioit: pagination end");
}, 2*1000); // 2 seconds will elapse and Code will execute.



GM_addStyle('* { -webkit-touch-callout: text !important; -webkit-user-select: text !important; -khtml-user-select: text !important; -moz-user-select: text !important; -ms-user-select: text !important; user-select: text !important; }');
/*GM_addStyle ( `
    * {
        -moz-user-select: text !important;
        user-select: text !important;
        -webkit-user-select: text !important;
    }
` );*/



