// ==UserScript==
// @name         Remove Anything Related To Manga On MAL And On Anime.Plus
// @namespace    Remove Anything Related To Manga On MAL And On Anime.Plus,
// @description  Removes Anything Related To Manga On MAL And On Anime.Plus
// @version      20
// @author       hacker09
// @match        https://anime.plus/*
// @match        https://myanimelist.net/*
// @exclude      *myanimelist.net/mangalist/*
// @exclude      *anime.plus/s/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @require      https://update.greasyfork.org/scripts/519092/arrivejs%20%28Latest%29.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/407732/Remove%20Anything%20Related%20To%20Manga%20On%20MAL%20And%20On%20AnimePlus.user.js
// @updateURL https://update.greasyfork.org/scripts/407732/Remove%20Anything%20Related%20To%20Manga%20On%20MAL%20And%20On%20AnimePlus.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (location.host === 'myanimelist.net' && location.pathname.split('/')[1] !== 'animelist') //If the user is on MAL and not on an anime list
  { //Starts the if condition
    setTimeout(function() { //Starts the settimeout function
      document.querySelectorAll("a[href*='/manga/']").forEach(el => el.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'); //Change manga links background to Yellow
      document.querySelector(".dark.ga-click.ga-impression") !== null ? document.querySelector(".dark.ga-click.ga-impression").remove() : ''; //Remove the "buy manga on amazon button" if it exists
    }, 500); //Finishes the settimeout function

    document.getElementById('topSearchValue').selectedIndex = "1"; //Make The Search Bar Find Only For Animes By Default (You're Still Able To Change To Other Options)
    document.getElementsByClassName('non-link')[1].remove(); //Removes The Manga Button From The Blue Top Main Menu
    document.getElementsByClassName('non-link')[4].remove(); //Removes The Read Button From The Blue Top Main Menu
    document.querySelector("#footer-block > div.footer-link-icon-block > div.footer-recommended.ac > a.icon-recommended.icon-manga-store").remove(); //Removes The Manga Store Button From The Footer Menu
    document.querySelector("#topSearchValue")[2].remove(); //Removes The Manga Search Option From The Search Bar
    document.querySelector("#topSearchValue")[4].remove(); //Removes The Manga Store Search option From The Search Bar
    document.querySelector(".inputtext.fl-l").placeholder = "Search for Animes and more..."; //Removes The Word Manga From Inside The Search Bar
    document.querySelector('[href="https://myanimelist.net/store/bookshelf"]').remove(); //Disables The BookShelf Button Option When You Click On Your UserName (Right Top Of Screen)
    document.querySelector('.arrow_box.header-list-dropdown.header-menu-dropdown > ul > li:nth-of-type(2)').remove(); //Removes The Manga List Button From The Right Top Menu (Close To Your UserName)
    document.head.insertAdjacentHTML('beforeend', '<style>#cat2 {display: none;}</style>'); //Remove The Manga Tag Button On Any https://myanimelist.net/news?p=  Pages
  } //Finishes the if condition
  if (location.href === "https://myanimelist.net/") //If the user is on MAL's index page
  { //Starts the if condition
    document.head.insertAdjacentHTML('beforeend', '<style>.widget.manga_suggestions.left, {display: none;}</style>'); //Removes The "Manga Suggestions" Widget From The Homepage (If You Didn't Disable It On Your Settings)
    document.head.insertAdjacentHTML('beforeend', '<style>div.widget-content > table > tbody > tr:nth-child(2) {display: none;}</style>'); //Removes The "Manga Entries" Text And It's Values Of The Homepage Widget "My Statistics" (If You Didn't Disable It On Your Settings)
    document.head.insertAdjacentHTML('beforeend', '<style>div.widget-content > table > tbody > tr:nth-child(4) {display: none;}</style>'); //Removes The "MangaList Views" Text And It's Values Of The Homepage Widget "My Statistics" (If You Didn't Disable It On Your Settings)
  } //Finishes the if condition
  if (location.href.match(/https:\/\/myanimelist\.net\/profile\/[^\/]+(\/)?$/) !== null) //If the user is on a profile page
  { //Starts the if condition
    if (document.querySelectorAll("div.user-profile-sns > a.di-ib.mb8")[2] !== undefined && document.querySelectorAll("div.user-profile-sns > a.di-ib.mb8")[2].innerText === "Recent Manga") { //If The Button "Recent Manga" Of The RSS Feed exists
      document.querySelectorAll("div.user-profile-sns > a.di-ib.mb8")[2].remove(); //Removes The Button "Recent Manga" Of The RSS Feeds Of any user profile
      document.querySelectorAll("div.user-profile-sns > a.di-ib.mb8")[2].nextSibling.remove(); //Removes The Button "Recent Manga" Of The RSS Feeds Of any user profile
    } //Finishes the if condition
    if (document.querySelectorAll("div.user-profile-sns > a.di-ib.mb8")[2] !== undefined && document.querySelectorAll("div.user-profile-sns > a.di-ib.mb8")[2].innerText === "Recent Manga by Chapter") { //If The Button "Recent Manga by Chapter" Of The RSS Feed exists
      document.querySelectorAll("div.user-profile-sns > a.di-ib.mb8")[2].remove(); //Removes the Button "Recent Manga by Chapter" Of The RSS Feeds Of any user profile
      document.querySelectorAll("div.user-profile-sns > a.di-ib.mb8")[2].nextSibling.remove(); //Removes the Button "Recent Manga by Chapter" Of The RSS Feeds Of any user profile
    } //Finishes the if condition
    if (document.querySelector("#manga_favorites") !== null) { //If the manga fav section exists
      document.querySelector("#manga_favorites").remove(); //Removes The "Manga Section" On The Profile Of Any User Favorites List
      setTimeout(function() { //Starts the settimeout function
        [...document.querySelectorAll("h5")].find(h5 => h5.innerText.includes('Manga')).remove(); //Removes The "Manga h5 header" On The Profile Of Any User Favorites List

        if (document.head.innerHTML.match(/styles\/(221397|221398|221276|221277).css/) !== null) //If the script "Better MAL Favs" is installed
        { //Starts the if condition
          document.head.insertAdjacentHTML('beforeend', '<style>#content > div > div.container-right > div.favmore > h5 {left: 650px;}</style>'); //Make the people h5 element be on the right place
          if (document.head.innerHTML.match('#company_favorites { position: absolute !important;') !== null) //If the script "Better MAL Favs" is not using option "2 Show the companies table below all other tables"
          { //Starts the if condition
            document.head.insertAdjacentHTML('beforeend', '<style>#company_favorites, #content > div > div.container-right > div.favmore > h5:nth-child(3) {left: 830px;}</style>'); //Make the company h5 element text, and all companies be on the right place
          } //Finishes the if condition

        } //Finishes the if condition

      }, 0); //Finishes the settimeout function
    } //Finishes the if condition

    document.querySelectorAll("div.user-statistics-stats.mt16")[1].remove(); //Removes The "Last Manga Updates Section" And The "Manga Stats" On The Profile Of Any User Profile
  } //Finishes the if condition
  if (location.pathname.split('/')[2] === 'all') //If Tthe user is on https://myanimelist.net/search/all?q=
  { //Starts the if condition
    document.head.insertAdjacentHTML('beforeend', '<style>div.link-content-jump.ml12.mb24 > a:nth-child(3),div.content-left > div > article:nth-child(6),#manga {display: none;}</style>'); //Removes Jump To: Manga, The Whole Manga Section Content and The h2 Title Of The Manga Section
  } //Finishes the if condition
  if (location.href.split('/')[3] === 'editprofile.php?go=favorites') //If the user is on https://myanimelist.net/editprofile.php?go=favorites
  { //Starts the if condition
    document.querySelector("tbody > tr:nth-child(2) > td").remove(); //Removes the Search Manga section
    document.querySelector("tbody > tr:nth-child(2) > td").remove(); //Removes My Favorite Manga section
  } //Finishes the if condition
  if (location.href.split('/')[3] === 'editprofile.php?go=listpreferences') //If the user is on https://myanimelist.net/editprofile.php?go=listpreferences
  { //Starts the if condition
    for (var i = 0; i < 7; i++) { //Starts a for loop
      document.querySelector("tbody > tr:nth-child(13)").remove(); //Removes The "Manga List Settings" Title, The Default Status Selected For The Manga List, The Ask to Discuss? For The Manga List, The Privacy For The Manga List, The Show Columns For The Manga List, The SNS Post For The Manga List and removes a White Space Below The Manga List
    } //Finishes the for loop
  } //Finishes the if condition
  if (location.pathname.split('/')[1] === 'animelist') //If the user is on an anime list
  { //Starts the if condition
    document.querySelector('a.icon-menu.manga-list').remove(); //Removes The Manga List Button Of The Left Floating Menu
    document.head.insertAdjacentHTML('beforeend', '<style>#v-auto-recommendation-personalized_manga {display: none;}</style>'); //Removes The Whole "Your Manga Suggestions" Section
    document.querySelector('a.icon-menu.quick-add.List_LightBox').href = "https://myanimelist.net/addtolist.php"; //Removes ?hidenav=1 on the link https://myanimelist.net/addtolist.php On The Quick Add Button, So That The Whole "Your Manga Suggestions" Section Can Be Hidden
  } //Finishes the if condition
  if (location.pathname.split('/')[1] === 'addtolist.php') //If the user is on https://myanimelist.net/addtolist.php
  { //Starts the if condition
    document.querySelector('#v-auto-recommendation-personalized_manga').remove(); //Removes The Whole "Your Manga Suggestions" Section
    document.arrive("div.quickAdd-manga-result", (function() { //Detect when the manga result is displayed
      document.querySelector("div.quickAdd-manga-result").remove(); //Remove the Mangas Results
    })); //Termina e executa a funcao arrive
  } //Finishes the if condition
  if (location.href === 'https://myanimelist.net/panel.php?go=export') //If the user is on https://myanimelist.net/panel.php?go=export
  { //Starts the if condition
    document.querySelectorAll("td > form > div > select")[0][1].remove(); //Remove The DropDown Option To Export Manga
  } //Finishes the if condition
  if (location.href === 'https://myanimelist.net/news/tag') //If the user is on https://myanimelist.net/news/tag
  { //Starts the if condition
    document.querySelector("li.btn-category.tag-color2").remove(); //Remove The Manga Tag Button On https://myanimelist.net/news/tag
    document.querySelector('div.pr8.pb24.pt16:nth-of-type(3)').remove(); //Remove The Manga Tag Section On https://myanimelist.net/news/tag
  } //Finishes the if condition
  if (location.href.match(/^https:\/\/myanimelist\.net\/(anime(id=)?(\.php\?id=)?)(\/)?([\d]+)(\/)?(\w+)?$/) !== null) //If the user is on an anime entry
  { //Starts the if condition
    document.head.insertAdjacentHTML('beforeend', '<style>div.di-b.mt4.mb16.ac,a.btn-affiliate.manga-store.js-shop-anime.icon-shop-default {display: none;}</style>'); //Remove the Buy manga btn below the anime image, the buy manga btn above the anime stats
    if (document.querySelector("td.pb24").innerText.match('Manga Store') !== null) //If the element manga store exists
    { //Starts the if condition
      document.querySelector("td.pb24").remove(); //Remove the manga store suggestions in the middle of the page
    } //Finishes the if condition
  } //Finishes the if condition
  if (location.pathname.split('/')[1] === 'topanime.php') //If the user is on https://myanimelist.net/topanime.php
  { //Starts the if condition
    window.onscroll = async function() { //Starts the onscroll event listener
      var BodyoffsetHeight = document.querySelector('body').offsetHeight;
      if (window.scrollY * 1.2 >= BodyoffsetHeight - window.innerHeight) { //If the user almost scrolled the whole page down
        setTimeout(function() { //Starts the set timeout function
          document.querySelectorAll("div.manga-store-information").forEach(a => a.remove()); //Remove the Manga Store Volume suggestions when the page is scrolled down in case the script "Endless MAL" is being used
        }, 700); //Finishes the set timeout function
      } //Finishes the if condition
    }; //Finishes the onscroll event listener
    document.querySelectorAll("div.manga-store-information").forEach(a => a.remove()); //Remove the Manga Store Volume suggestions when the page is loaded for the first time
  } //Finishes the if condition
  if (location.href.match('topicid') !== null) //If the user is on any forum topic
  { //Starts the if condition
    document.head.insertAdjacentHTML('beforeend', '<style>a.btn-forum-manga-store,div.pt24.pb24.mt24.mb24 {display: none;}</style>'); //Remove the manga store button on the right side top on the page on forum topics and the manga store suggestions on the bottom of the page on forum topics
  } //Finishes the if condition
  if (top.location.host === 'anime.plus') //If the user is on anime.plus
  { //Starts the if condition
    document.querySelector("nav.manga").remove(); //Excludes Everything Related To Manga From The Left Menu Bar On anime.plus
    document.querySelector("div.section.manga-summary").remove(); //Excludes Everything Related To Manga Summary On anime.plus
    document.querySelector("div.mal-links > a:nth-child(5)").remove(); //Excludes The Manga list On MAL Button On anime.plus
  } //Finishes the if condition
})();