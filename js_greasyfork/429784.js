// ==UserScript==
// @name         Search Helper - MAL
// @namespace    SearchHelper
// @version      28
// @description  Quickly search for the anime/manga title on any websites of your choice.
// @author       hacker09
// @include      /^https:\/\/myanimelist\.net\/((anime|manga)(id=)?(\.php\?id=)?)(\/)?([\d]+)/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://myanimelist.net&size=64
// @run-at       document-end
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/429784/Search%20Helper%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/429784/Search%20Helper%20-%20MAL.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var Addedname = []; //Creates a new blank array
  var AddedsearchUrl = []; //Creates a new blank array
  var RemovedLinksArray = []; //Creates a new blank array
  const title = document.querySelector('meta[property="og:title"]').content.trim().match(/(?:Watch )?(.*)/)[1].toLowerCase(); //Get the entry title
  const titleEncoded = encodeURI(title); //Encode the entry title
  const EntryType = location.pathname.split('/')[1]; //Store the Entry type

  GM_listValues().forEach(function(a) { //ForEach stored data on tampermonkey
    if (a.match(/name|FavIcon|searchUrl/) === null) //If the stored data isn't an added name/favIcon/searchURL
    { //Starts the if condition
      RemovedLinksArray.push('^' + a); //Add the user choice to hide a link on an array
    } //Finishes the if condition
    if (a.match('name') !== null) //If the stored data is an added name
    { //Starts the if condition
      Addedname.push(GM_getValue(a)); //Add the new stored data to an array
    } //Finishes the if condition
    if (a.match('searchUrl') !== null) //If the stored data is an added searchURL
    { //Starts the if condition
      AddedsearchUrl.push(GM_getValue(a).split('addtitlehere')[0] + titleEncoded + GM_getValue(a).split('addtitlehere')[1]); //Add the new stored data to an array
    } //Finishes the if condition
  }); //Add all removed links on tampermonkey to the array

  const RemovedLinksArrayRegex = new RegExp(RemovedLinksArray.join('$|')); //Create a new variable and regex containing all the removed links saved on tampermonkey and replace the , separator with the or $| regex symbols

  const names = ['Crunchyroll', 'AnimeFire', 'AniWave', 'Nyaa', 'Gogoanime', 'Youtube', 'Jkanime', 'AnimeFLV', 'AnimeFlix', 'AniList', 'aniDB', 'Kitsu', 'Anime-Planet', 'AnimeNewsNetwork', 'AnimeOwl', 'AniSearch', 'Annict', 'Netflix', 'Hidive', 'LiveChart', 'Notify', 'Proxer', 'Shikimori', 'Simkl', 'Trakt', 'TurkAnime', 'LNDB', 'Mangadex', 'Mangaupdates', 'Novel Updates', 'VIZ', 'MangaPlus', 'ADKami', 'ADN', 'An1me', 'AnimeId', 'Animelon', 'AnimeOdcinki', 'AnimeOnsen', 'AnimeSuge', 'Animetoast', 'Animeworld', 'AnimeXin', 'AnimeZone', 'Aniworld', 'DesuOnline', 'FrixySubs', 'Hdrezka', 'KickAssAnime', 'Kitsune', 'moeclip', 'MonosChinos', 'OtakuFR', 'Otakustv', 'Shinden', 'tioanime', 'ToonAnime', 'TRanimeizle', 'YugenAnime', 'AsuraToon', 'bato', 'ComicK', 'DisasterScans', 'DynastyScans', 'FlameScans', 'ImmortalUpdates', 'BentoManga', 'LsComics', 'LHTranslation', 'LumiToon', 'manga4life', 'MangaBuddy', 'MangaFire', 'MangaFox', 'MangaHere', 'MangaHub', 'MangaJar', 'MangaKatana', 'MangaNato', 'MangaPark', 'MangaReader', 'MangaSee', 'mangatx', 'manhuafast', 'ManhuaPlus', 'MuitoMangá', 'projectsuki', 'ReadManhua', 'Manga4', 'serimangas', 'SKScans', 'Visortmo', 'Toonily', 'TritiniaScans', 'HiveScans', 'WuxiaWorld', ]; //Add the default website names to an array
  const Allnames = Addedname.concat(names); //Add the default and added website names to an array

  const searchUrl = AddedsearchUrl.concat([document.querySelector("[href*='crunchyroll.com/series']") !== null ? document.querySelector("[href*='crunchyroll.com/series']").href : `https://crunchyroll.com/search?q=${titleEncoded}`, `https://animefire.plus/pesquisar/${title.replace(/ *[^\w\s] */g, ' ').replace(/ +$/gm, '').replace(/^ /g, '').replaceAll(' ','-').toLowerCase()}`, `https://aniwave.best/filter?keyword=${titleEncoded}`, `https://nyaa.si/?f=0&c=${EntryType === 'manga' ? '3_0' : '1_0'}&q=${titleEncoded}`, `https://gogoanimes.fi/search.html?keyword=${titleEncoded}`, `https://youtube.com/results?search_query=${titleEncoded}`, `https://jkanime.net/buscar/${titleEncoded}/1/`, `https://animeflv.net/browse?q=${titleEncoded}`, `https://animeflix.live/search/${titleEncoded}`, `https://anilist.co/search/${EntryType}?search=` + titleEncoded, `https://anidb.net/anime/?do.search=1&adb.search=${titleEncoded}`, `https://kitsu.io/${EntryType}?text=${titleEncoded}`, `https://anime-planet.com/${EntryType}/all?name=${titleEncoded}`, `https://animenewsnetwork.com/encyclopedia/search/name?only=${EntryType}&q=${titleEncoded}`, `https://animeowl.us/search/${titleEncoded}`, `https://anisearch.com/${EntryType}/index?text=${titleEncoded}`, `https://annict.com/search?q=${titleEncoded}`, `https://netflix.com/search?q=${titleEncoded}`, `https://hidive.com/search?q=${titleEncoded}`, `https://livechart.me/search?q=${titleEncoded}`, `https://notify.moe/search/${titleEncoded}`, `https://proxer.me/search?s=search&name=${titleEncoded}typ=all-${EntryType}&tags=&notags=#top`, `https://shikimori.org/${EntryType}s?search=${titleEncoded}`, `https://simkl.com/search/?type=anime&q=${titleEncoded}`, `https://trakt.tv/search?query=${titleEncoded}`, `https://www.turkanime.co/arama?arama=${titleEncoded}`, `https://lndb.info/search?text=${titleEncoded}`, `https://mangadex.org/titles?q=${titleEncoded}`, `https://mangaupdates.com/search.html?search=${titleEncoded}`, `https://novelupdates.com/?s=${titleEncoded}`, `https://viz.com/search?search=${titleEncoded}`, `https://mangaplus.shueisha.co.jp/search_result?keyword=${titleEncoded}`, `https://adkami.com/video?search=${titleEncoded}`, `https://animationdigitalnetwork.fr/video?search=${titleEncoded}`, `https://an1me.to/?s=${titleEncoded}`, `https://animeid.tv/buscar?q=${titleEncoded}`, `https://animelon.com/search?searchTerm=${titleEncoded}`, `https://anime-odcinki.pl/szukaj/${titleEncoded}`, `https://animeonsen.xyz/search/${titleEncoded}`, `https://animesuge.to/filter?keyword=${titleEncoded}`, `https://animetoast.cc/?s=${titleEncoded}`, `https://animeworld.tv/search?keyword=${titleEncoded}`, `https://animexin.vip/?s=${titleEncoded}`, `https://animezone.pl/szukaj?q=${titleEncoded}`, `https://aniworld.to/search?q=${titleEncoded}`, `https://desu-online.pl/?s=${titleEncoded}`, `https://frixysubs.pl/anime-list?search=${titleEncoded}&order_by=title&order=asc`, `https://hdrezka.ag/search/?do=search&subaction=search&q=${titleEncoded}`, `https://kickassanime.mx/search?q=${titleEncoded}`, `https://beta.kitsune.tv/shows?q=${titleEncoded}`, `https://moeclip.com/search/${titleEncoded}`, `https://monoschinos2.com/buscar?q=${titleEncoded}`, `https://otakufr.co/toute-la-liste-affiches/?q=${titleEncoded}`, `https://www1.otakustv.com/buscador?q=${titleEncoded}`, `https://shinden.pl/series?search=${titleEncoded}`, `https://tioanime.com/directorio?q=${titleEncoded}`, `https://toonanime.tv/?story=${titleEncoded}&do=search&subaction=search#`, `https://tranimeizle.co/arama/${titleEncoded}`, `https://yugen.to/discover/?q=${titleEncoded}`, `https://asuratoon.com/?s=${titleEncoded}`, `https://bato.to/search?word=${titleEncoded}`, `https://comick.app/search?q=${titleEncoded}`, `https://google.com/search?q=${titleEncoded} site:disasterscans.com`, `https://dynasty-scans.com/search?q=${titleEncoded}`, `https://flamescans.org/?s=${titleEncoded}`, `https://immortalupdates.com/?s=${titleEncoded}&post_type=wp-manga`, `https://bentomanga.com/manga_list?search=${titleEncoded}`, `https://lscomic.com/?s=${titleEncoded}&post_type=wp-manga`, `https://lhtranslation.net/?s=${titleEncoded}&post_type=wp-manga`, `https://lumitoon.com/?s=${titleEncoded}`, `https://manga4life.com/search/?name=${titleEncoded}`, `https://mangabuddy.com/search?q=${titleEncoded}`, `https://mangafire.to/filter?keyword=${titleEncoded}`, `https://fanfox.net/search?title=${titleEncoded}`, `https://mangahere.cc/search?title=${titleEncoded}`, `https://mangahub.io/search?q=${titleEncoded}`, `https://mangajar.com/search?q=${titleEncoded}`, `https://mangakatana.com/?search=${titleEncoded}&search_by=book_name`, `https://manganato.com/search/story/${titleEncoded}`, `https://mangapark.net/v5x-search?word=${titleEncoded}`, `https://mangareader.to/search?keyword=${titleEncoded}`, `https://mangasee123.com/search/?name=${titleEncoded}`, `https://mangatx.com/?s=${titleEncoded}&post_type=wp-manga`, `https://manhuafast.com/?s=${titleEncoded}&post_type=wp-manga&post_type=wp-manga`, `https://manhuaplus.com/?s=${titleEncoded}&post_type=wp-manga`, `https://muitomanga.com/buscar?q=${titleEncoded}`, `https://projectsuki.com/search?q=${titleEncoded}`, `https://readmanhua.net/?s=${titleEncoded}&post_type=wp-manga&op=&author=&artist=&release=&adult=`, `https://manga4.org/?s=${titleEncoded}`, `https://serimangas.com/mangalar?search=${titleEncoded}`, `https://skscans.com/?s=${titleEncoded}&post_type=wp-manga`, `https://visortmo.com/library?_pg=1&title=${titleEncoded}`, `https://toonily.net/?s=${titleEncoded}&post_type=wp-manga`, `https://tritinia.org/?s=${titleEncoded}&post_type=wp-manga`, `https://hivescans.com/?s=${titleEncoded}`, `https://wuxiaworld.site/?s=${titleEncoded}&post_type=wp-manga`, ]); //Add the default and added website search urls to an array

  document.querySelectorAll("h2")[2].innerText !== 'Information' ? document.querySelectorAll("h2")[1].insertAdjacentHTML('beforebegin', `<h2 style="cursor: pointer;" class="${document.querySelector("h2").className} MAL_SearchHelper">Search</h2><br><div class="MAL_SearchHelperBTN" style="cursor: pointer; color: #1d439b;font-size: larger;">[Show]</div><div class="mal_links" style="display: none;"></div><br>`) : document.querySelectorAll("h2")[2].insertAdjacentHTML('beforebegin', `<h2 style="cursor: pointer;" class="${document.querySelector("h2").className} MAL_SearchHelper">Search</h2><br><div class="MAL_SearchHelperBTN" style="cursor: pointer; color: #1d439b;font-size: larger;">[Show]</div><div class="mal_links" style="display: none;"></div><br>`); //Add the [Show] button on the page

  Allnames.forEach(function(name, i) { //For each website name
    if (name.match(RemovedLinksArrayRegex) === null || RemovedLinksArrayRegex.toLocaleString() === '/(?:)/') //If the website doesn't match a removed link,or if there are 0 links removed
    { //Starts the if condition
      document.querySelector(".mal_links").insertAdjacentHTML('beforeend', `<div id="${name}+Search" style="padding: 1px 0;"><a target="_blank" title="Search on ${name}" href="${searchUrl[i]}"><img style="position: relative; top: 4px;" src="https://www.google.com/s2/favicons?domain=${searchUrl[i]}" /> ${name}</a><span onmouseout="this.parentElement.style.backgroundColor = ''" onmouseover="this.parentElement.style.backgroundColor = '#d6e3ff'" title="Remove ${name}?" id="${name}" class="remove-link" style="z-index: 999999; position: sticky; left: calc(100% - 4%); line-height: 2;cursor: pointer;color: grey;">X</span></div>`);
    } //Finishes the if condition
  }); //Finishes the foreach condition to add the html to open and search for the entry title or to remove the website of the search list

  document.querySelector(".MAL_SearchHelperBTN").onclick = function() { //When the Search button is clicked
    const element = document.querySelector(".mal_links"); //Save the list of links element in a variable
    if (element.style.display === 'none') { //If the Search list is hidden
      element.style.display = 'block'; //Show the Search List
      this.innerText = "[Hide]"; //Change the Show Search List text to [Hide]
    } else { //If the Search list is being shown
      element.style.display = 'none'; //Hide the Search List
      this.innerText = "[Show]"; //Change the Hide Search List text to [Show]
    } //Finishes the else condition
  }; //Finishes the onclick event listener

  document.querySelector(".MAL_SearchHelper").onclick = function() { //When the Search txt is clicked
    const WebsiteName = prompt("*You CAN'T click on Cancel neither leave the field blank!\nPlease enter the website name."); //Temporarily save the website name
    GM_setValue("name" + WebsiteName, WebsiteName); //Ask the user to enter the website name and permanently save it
    GM_setValue("searchUrl" + WebsiteName, prompt("Please enter the website search URL.\n*Add the text addtitlehere in the place you want the script to add the entry title on the link.\n*Example: https://aniwave.best/filter?keyword=addtitlehere")); //Ask the user to enter the website search URL
  }; //Finishes the onclick event listener

  document.querySelectorAll("span.remove-link").forEach(function(el) { //For each remove button
    el.onclick = function() //Add a click event listener to the remove btn
    { //Starts the onclick function
      this.parentElement.remove(); //Remove the correspondent website of the search list
      if (names.includes(this.id.split('+')[0]) === true) //If the website removed was a default website
      { //Starts the if condition
        GM_setValue(el.id.split('+')[0], "RemovedSite"); //Save the user option
      } //Finishes the if condition
      else //If the website removed was added by the user
      { //Starts the else condition
        GM_listValues().forEach(function(a) { //ForEach stored data on tampermonkey
          if (a.match(el.id.split('+')[0]) !== null) //If it's the stored data that has the specified name/searchURL website name
          { //Starts the if condition
            GM_deleteValue(a); //Erase the stored name/searchURL for the specific website
          } //Finishes the if condition
        }); //Finishes the for each condition
      } //Finishes the else condition
    }; //Finishes the onclick function
  }); //Finishes the for each condition

  if (document.querySelector("#Kitsu\\+Search") !== null) //If the Kitsu btn exists
  { //Start the if condition
    document.querySelector("#Kitsu\\+Search").onclick = async function(e) { //When the Kitsu search btn is clicked
      e.preventDefault(); //Prevent the default context menu from being opened
      const response = await (await fetch(`https://kitsu.io/api/edge/mappings?filter[externalSite]=myanimelist%2F${EntryType}&filter[externalId]=${location.href.split('/')[4]}&include=item`)).json();
      open('https://kitsu.io/anime/' + response.included[0].id, '_blank'); //Open the kitsu website on a new tab
    }; //Finishes the onclick event listener
  } //Finishes the if condition
})();