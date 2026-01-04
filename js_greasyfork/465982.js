// ==UserScript==
// @name         joined array Search Helper - MAL
// @namespace    SearchHelper
// @version      22
// @description  Quickly search for the anime/manga title on any websites of your choice.
// @author       hacker09
// @include      /^https:\/\/myanimelist\.net\/((anime|manga)(id=)?(\.php\?id=)?)(\/)?([\d]+)/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://myanimelist.net&size=64
// @run-at       document-end
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/465982/joined%20array%20Search%20Helper%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/465982/joined%20array%20Search%20Helper%20-%20MAL.meta.js
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

  if (document.querySelector("#broadcast-block > a") !== null) //If the user is on MAL Mobile
  { //Starts the if condition
    setTimeout(() => { //Starts the setTimeout
      document.querySelector("#broadcast-block > a").click(); //Open the Watch Episodes list
      document.querySelector(".mal-modal").click(); //Closes the Watch Episodes list
    }, 0); //Finishes the setTimeout
  } //Finishes the if condition

  const names = [ 'Crunchyroll', 'https://www.google.com/s2/favicons?domain=crunchyroll.com', `https://crunchyroll.com/search?q=${titleEncoded}`,
                 'AnimesHouse', 'https://www.google.com/s2/favicons?domain=animeshouse.net', `https://animeshouse.net/?s=${titleEncoded}`,
                 'Funimation', 'https://www.google.com/s2/favicons?domain=funimation.com', `https://funimation.com/search/?q=${titleEncoded}`,
                 'AnimeFire', 'https://www.google.com/s2/favicons?domain=animefire.net', `https://animefire.net/pesquisar/${title.replace(/ *[^\w\s] */g, ' ').replace(/ +$/gm, '').replace(/^ /g, '').replaceAll(' ','-').toLowerCase()}`,
                 '9Anime', 'https://www.google.com/s2/favicons?domain=9anime.id', `https://9anime.id/`,
                 'Zoro', 'https://www.google.com/s2/favicons?domain=zoro.to', `https://zoro.to/search?keyword=${titleEncoded}`,
                 'Nyaa', 'https://www.google.com/s2/favicons?domain=nyaa.si', `https://nyaa.si/?f=0&c=${EntryType === 'manga' ? '3_0' : '1_0'}&q=${titleEncoded}`,
                 'Gogoanime', 'https://www.google.com/s2/favicons?domain=gogoanime.llc', `https://gogoanime.llc/search.html?keyword=${titleEncoded}`,
                 'AnimeFreak', 'https://www.google.com/s2/favicons?domain=animefreak.site', `https://animefreak.site/search?keyword=${titleEncoded}`,
                 'Youtube', 'https://www.google.com/s2/favicons?domain=youtube.com', `https://youtube.com/results?search_query=${titleEncoded}`,
                 'Jkanime', 'https://www.google.com/s2/favicons?domain=jkanime.net', `https://jkanime.net/buscar/${titleEncoded}/1/`,
                 'AnimeFLV', 'https://www.google.com/s2/favicons?domain=animeflv.net', `https://animeflv.net/browse?q=${titleEncoded}`,
                 'AnimeFlix', 'https://www.google.com/s2/favicons?domain=animeflix.live', `https://animeflix.live/search/${titleEncoded}`,
                 'AniList', 'https://www.google.com/s2/favicons?domain=anilist.co', `https://anilist.co/search/${EntryType}?search=`+titleEncoded,
                 'aniDB', 'https://www.google.com/s2/favicons?domain=anidb.net', `https://anidb.net/anime/?do.search=1&adb.search=${titleEncoded}`,
                 'Kitsu', 'https://www.google.com/s2/favicons?domain=kitsu.io', `https://kitsu.io/${EntryType}?text=${titleEncoded}`,
                 'Anime-Planet', 'https://www.google.com/s2/favicons?domain=anime-planet.com', `https://anime-planet.com/${EntryType}/all?name=${titleEncoded}`,
                 'AnimeNewsNetwork', 'https://www.google.com/s2/favicons?domain=animenewsnetwork.com', `https://animenewsnetwork.com/encyclopedia/search/name?only=${EntryType}&q=${titleEncoded}`,
                 'AnimeOwl', 'https://www.google.com/s2/favicons?domain=animeowl.net', `https://animeowl.net/?s=${titleEncoded}`,
                 'AniSearch', 'https://www.google.com/s2/favicons?domain=anisearch.com', `https://anisearch.com/${EntryType}/index?text=${titleEncoded}`,
                 'Annict', 'https://www.google.com/s2/favicons?domain=annict.com', `https://annict.com/search?q=${titleEncoded}`,
                 'Netflix', 'https://www.google.com/s2/favicons?domain=netflix.com', `https://netflix.com/search?q=${titleEncoded}`,
                 'Hidive', 'https://www.google.com/s2/favicons?domain=hidive.com', `https://hidive.com/search?q=${titleEncoded}`,
                 'LiveChart', 'https://www.google.com/s2/favicons?domain=livechart.me', `https://livechart.me/search?q=${titleEncoded}`,
                 'Notify', 'https://www.google.com/s2/favicons?domain=notify.moe', `https://notify.moe/search/${titleEncoded}`,
                 'Proxer', 'https://www.google.com/s2/favicons?domain=proxer.me', `https://proxer.me/search?s=search&name=${titleEncoded}typ=all-${EntryType}&tags=&notags=#top`,
                 'Shikimori', 'https://www.google.com/s2/favicons?domain=shikimori.org', `https://shikimori.org/${EntryType}s?search=${titleEncoded}`,
                 'Simkl', 'https://www.google.com/s2/favicons?domain=simkl.com', `https://simkl.com/search/?type=anime&q=${titleEncoded}`,
                 'Trakt', 'https://www.google.com/s2/favicons?domain=trakt.tv', `https://trakt.tv/search?query=${titleEncoded}`,
                 'TurkAnime', 'https://www.google.com/s2/favicons?domain=google.com', `https://google.com/search?q=${titleEncoded}site:turkanime.co`,
                 'LNDB', 'https://www.google.com/s2/favicons?domain=lndb.info', `https://lndb.info/search?text=${titleEncoded}`,
                 'Mangadex', 'https://www.google.com/s2/favicons?domain=mangadex.org', `https://mangadex.org/titles?q=${titleEncoded}`,
                 'Mangaupdates', 'https://www.google.com/s2/favicons?domain=mangaupdates.com', `https://mangaupdates.com/search.html?search=${titleEncoded}`,
                 'NovelUpdates', 'https://www.google.com/s2/favicons?domain=novelupdates.com', `https://novelupdates.com/?s=${titleEncoded}`,
                 'VIZ', 'https://www.google.com/s2/favicons?domain=viz.com', `https://viz.com/search?search=${titleEncoded}`,
                 'MangaPlus', 'https://www.google.com/s2/favicons?domain=mangaplus.shueisha.co.jp', `https://mangaplus.shueisha.co.jp/search_result?keyword=${titleEncoded}`,
                 'ADKami', 'https://www.google.com/s2/favicons?domain=adkami.com', `https://adkami.com/video?search=${titleEncoded}`,
                 'ADN', 'https://www.google.com/s2/favicons?domain=animationdigitalnetwork.fr', `https://animationdigitalnetwork.fr/video?search=${titleEncoded}`,
                 'An1me', 'https://www.google.com/s2/favicons?domain=an1me.to', `https://an1me.to/?s=${titleEncoded}`,
                 'AnimeDao', 'https://www.google.com/s2/favicons?domain=animedao.to', `https://animedao.to/search/?search=${titleEncoded}`,
                 'AnimeId', 'https://www.google.com/s2/favicons?domain=animeid.tv', `https://animeid.tv/buscar?q=${titleEncoded}`,
                 'Animelon', 'https://www.google.com/s2/favicons?domain=animelon.com', `https://animelon.com/search?searchTerm=${titleEncoded}`,
                 'AnimeOdcinki', 'https://www.google.com/s2/favicons?domain=anime-odcinki.pl', `https://anime-odcinki.pl/szukaj/${titleEncoded}`,
                 'AnimeOnsen', 'https://www.google.com/s2/favicons?domain=animeonsen.xyz', `https://animeonsen.xyz/search/${titleEncoded}`,
                 'animepahe', 'https://www.google.com/s2/favicons?domain=animepahe.ru', `https://animepahe.ru/api?m=search&q=${titleEncoded}`,
                 'AnimeSuge', 'https://www.google.com/s2/favicons?domain=animesuge.to', `https://animesuge.to/filter?keyword=${titleEncoded}`,
                 'Animetoast', 'https://www.google.com/s2/favicons?domain=animetoast.cc', `https://animetoast.cc/?s=${titleEncoded}`,
                 'Animeworld', 'https://www.google.com/s2/favicons?domain=animeworld.tv', `https://animeworld.tv/search?keyword=${titleEncoded}`,
                 'AnimeXin', 'https://www.google.com/s2/favicons?domain=animexin.vip', `https://animexin.vip/?s=${titleEncoded}`,
                 'AnimeZone', 'https://www.google.com/s2/favicons?domain=animezone.pl', `https://animezone.pl/szukaj?q=${titleEncoded}`,
                 'Aniworld', 'https://www.google.com/s2/favicons?domain=aniworld.to', `https://aniworld.to/search?q=${titleEncoded}`,
                 'DesuOnline', 'https://www.google.com/s2/favicons?domain=desu-online.pl', `https://desu-online.pl/?s=${titleEncoded}`,
                 'FRAnime', 'https://www.google.com/s2/favicons?domain=franime.fr', `https://franime.fr/recherche?search=${titleEncoded}&type=TOUT&format=TOUT&status=TOUT&ordre=Ressemblance&themes=TOUT&algorithme=Normal&page=0`,
                 'FrixySubs', 'https://www.google.com/s2/favicons?domain=frixysubs.pl', `https://frixysubs.pl/anime-list?search=${titleEncoded}&order_by=title&order=asc`,
                 'Hdrezka', 'https://www.google.com/s2/favicons?domain=hdrezka.ag', `https://hdrezka.ag/search/?do=search&subaction=search&q=${titleEncoded}`,
                 'KickAssAnime', 'https://www.google.com/s2/favicons?domain=kaas.am', `https://kaas.am/search?q=${titleEncoded}`,
                 'Kitsune', 'https://www.google.com/s2/favicons?domain=beta.kitsune.tv', `https://beta.kitsune.tv/shows?q=${titleEncoded}`,
                 'moeclip', 'https://www.google.com/s2/favicons?domain=moeclip.com', `https://moeclip.com/search/${titleEncoded}`,
                 'MonosChinos', 'https://www.google.com/s2/favicons?domain=monoschinos2.com', `https://monoschinos2.com/buscar?q=${titleEncoded}`,
                 'OtakuFR', 'https://www.google.com/s2/favicons?domain=otakufr.co', `https://otakufr.co/toute-la-liste-affiches/?q=${titleEncoded}`,
                 'Otakustv', 'https://www.google.com/s2/favicons?domain=www1.otakustv.com', `https://www1.otakustv.com/buscador?q=${titleEncoded}`,
                 'Pactedanime', 'https://www.google.com/s2/favicons?domain=pactedanime.com', `https://pactedanime.com/?s=${titleEncoded}`,
                 'Shinden', 'https://www.google.com/s2/favicons?domain=shinden.pl', `https://shinden.pl/series?search=${titleEncoded}`,
                 'tioanime', 'https://www.google.com/s2/favicons?domain=tioanime.com', `https://tioanime.com/directorio?q=${titleEncoded}`,
                 'ToonAnime', 'https://www.google.com/s2/favicons?domain=toonanime.tv', `https://toonanime.tv/?story=${titleEncoded}&do=search&subaction=search#`,
                 'TRanimeizle', 'https://www.google.com/s2/favicons?domain=tranimeizle.co', `https://tranimeizle.co/arama/${titleEncoded}`,
                 'YugenAnime', 'https://www.google.com/s2/favicons?domain=yugen.to', `https://yugen.to/discover/?q=${titleEncoded}`,
                 'AsuraScans', 'https://www.google.com/s2/favicons?domain=asurascans.com', `https://asurascans.com/?s=${titleEncoded}`,
                 'bato', 'https://www.google.com/s2/favicons?domain=bato.to', `https://bato.to/search?word=${titleEncoded}`,
                 'BilibiliComics', 'https://www.google.com/s2/favicons?domain=bilibilicomics.com', `https://bilibilicomics.com/search?keyword=${titleEncoded}`,
                 'ComicK', 'https://www.google.com/s2/favicons?domain=comick.app', `https://comick.app/search?q=${titleEncoded}`,
                 'DisasterScans', 'https://www.google.com/s2/favicons?domain=disasterscans.com', `https://disasterscans.com/?s=${titleEncoded}&post_type=wp-manga`,
                 'DynastyScans', 'https://www.google.com/s2/favicons?domain=dynasty-scans.com', `https://dynasty-scans.com/search?q=${titleEncoded}`,
                 'FlameScans', 'https://www.google.com/s2/favicons?domain=flamescans.org', `https://flamescans.org/?s=${titleEncoded}`,
                 'ImmortalUpdates', 'https://www.google.com/s2/favicons?domain=immortalupdates.com', `https://immortalupdates.com/?s=${titleEncoded}&post_type=wp-manga`,
                 'BentoManga', 'https://www.google.com/s2/favicons?domain=bentomanga.com', `https://bentomanga.com/manga_list?search=${titleEncoded}`,
                 'LeviatanScans', 'https://www.google.com/s2/favicons?domain=en.leviatanscans.com', `https://en.leviatanscans.com/?s=${titleEncoded}&post_type=wp-manga`,
                 'LHTranslation', 'https://www.google.com/s2/favicons?domain=lhtranslation.net', `https://lhtranslation.net/?s=${titleEncoded}&post_type=wp-manga`,
                 'LuminousScans', 'https://www.google.com/s2/favicons?domain=luminousscans.com', `https://luminousscans.com/?s=${titleEncoded}`,
                 'manga4life', 'https://www.google.com/s2/favicons?domain=manga4life.com', `https://manga4life.com/search/?name=${titleEncoded}`,
                 'MangaBuddy', 'https://www.google.com/s2/favicons?domain=mangabuddy.com', `https://mangabuddy.com/search?q=${titleEncoded}`,
                 'MangaFire', 'https://www.google.com/s2/favicons?domain=mangafire.to', `https://mangafire.to/filter?keyword=${titleEncoded}`,
                 'MangaFox', 'https://www.google.com/s2/favicons?domain=fanfox.net', `https://fanfox.net/search?title=${titleEncoded}`,
                 'MangaHere', 'https://www.google.com/s2/favicons?domain=mangahere.cc', `https://mangahere.cc/search?title=${titleEncoded}`,
                 'MangaHub', 'https://www.google.com/s2/favicons?domain=mangahub.io', `https://mangahub.io/search?q=${titleEncoded}`,
                 'MangaJar', 'https://www.google.com/s2/favicons?domain=mangajar.com', `https://mangajar.com/search?q=${titleEncoded}`,
                 'MangaKatana', 'https://www.google.com/s2/favicons?domain=mangakatana.com', `https://mangakatana.com/?search=${titleEncoded}&search_by=book_name`,
                 'MangaNato', 'https://www.google.com/s2/favicons?domain=manganato.com', `https://manganato.com/search/story/${titleEncoded}`,
                 'MangaPark', 'https://www.google.com/s2/favicons?domain=mangapark.net', `https://mangapark.net/v5x-search?word=${titleEncoded}`,
                 'MangaReader', 'https://www.google.com/s2/favicons?domain=mangareader.to', `https://mangareader.to/search?keyword=${titleEncoded}`,
                 'MangaSee', 'https://www.google.com/s2/favicons?domain=mangasee123.com', `https://mangasee123.com/search/?name=${titleEncoded}`,
                 'mangatx', 'https://www.google.com/s2/favicons?domain=mangatx.com', `https://mangatx.com/?s=${titleEncoded}&post_type=wp-manga`,
                 'manhuafast', 'https://www.google.com/s2/favicons?domain=manhuafast.com', `https://manhuafast.com/?s=${titleEncoded}&post_type=wp-manga&post_type=wp-manga`,
                 'ManhuaPlus', 'https://www.google.com/s2/favicons?domain=manhuaplus.com', `https://manhuaplus.com/?s=${titleEncoded}&post_type=wp-manga`,
                 'MuitoMangá', 'https://www.google.com/s2/favicons?domain=muitomanga.com', `https://muitomanga.com/buscar?q=${titleEncoded}`,
                 'projectsuki', 'https://www.google.com/s2/favicons?domain=projectsuki.com', `https://projectsuki.com/search?q=${titleEncoded}`,
                 'ReadManhua', 'https://www.google.com/s2/favicons?domain=readmanhua.net', `https://readmanhua.net/?s=${titleEncoded}&post_type=wp-manga&op=&author=&artist=&release=&adult=`,
                 'RealmScans', 'https://www.google.com/s2/favicons?domain=realmscans.com', `https://realmscans.com/?s=${titleEncoded}`,
                 'serimanga', 'https://www.google.com/s2/favicons?domain=serimanga.com', `https://serimanga.com/mangalar?search=${titleEncoded}`,
                 'SKScans', 'https://www.google.com/s2/favicons?domain=skscans.com', `https://skscans.com/?s=${titleEncoded}&post_type=wp-manga`,
                 'tmofans', 'https://www.google.com/s2/favicons?domain=lectortmo.com', `https://lectortmo.com/library?_pg=1&title=${titleEncoded}`,
                 'Toonily', 'https://www.google.com/s2/favicons?domain=toonily.net', `https://toonily.net/?s=${titleEncoded}&post_type=wp-manga`,
                 'TritiniaScans', 'https://www.google.com/s2/favicons?domain=tritinia.org', `https://tritinia.org/?s=${titleEncoded}&post_type=wp-manga`,
                 'VoidScans', 'https://www.google.com/s2/favicons?domain=void-scans.com', `https://void-scans.com/?s=${titleEncoded}`,
                 'WuxiaWorld', 'https://www.google.com/s2/favicons?domain=wuxiaworld.site', `https://wuxiaworld.site/?s=${titleEncoded}&post_type=wp-manga` ]; //Add the default website names to an array
  const Allnames = Addedname.concat(names,AddedsearchUrl); //Add the default and added website names to an array

  //const searchUrl = AddedsearchUrl.concat()

  //const FavIcon = AddedFavIcon.concat([`${GFav}crunchyroll.com`, `${GFav}animeshouse.net`, `${GFav}funimation.com`, `${GFav}animefire.net`, `${GFav}9anime.id`, `${GFav}zoro.to`, `${GFav}nyaa.si`, `${GFav}gogoanime.llc`,`${GFav}animefreak.site`, `${GFav}youtube.com`, `${GFav}jkanime.net`, `${GFav}animeflv.net`, `${GFav}animeflix.live`, `${GFav}anilist.co`, `${GFav}anidb.net`, `${GFav}litsu.io`, `${GFav}anime-planet.com`, `${GFav}animenewsnetwork.com`, `${GFav}animeowl.net`, `${GFav}anisearch.com`, `${GFav}annict.com`, `${GFav}netflix.com`, `${GFav}hidive.com`, `${GFav}livechart.me`, `${GFav}notify.moe`, `${GFav}proxer.me`, `${GFav}shikimori.org`, `${GFav}simkl.com`, `${GFav}trakt.tv`, `${GFav}turkanime.net`, `${GFav}lndb.info`, `${GFav}mangadex.org`,`${GFav}mangaupdates.com`, `${GFav}novelupdates.com`, `${GFav}viz.com`, `${GFav}mangaplus.shueisha.co.jp`]); //Add the default and added website fav icons to an array

  document.querySelectorAll("h2")[2].innerText !== 'Information' ? document.querySelectorAll("h2")[1] : document.querySelectorAll("h2")[2].insertAdjacentHTML('beforebegin', `<h2 style="cursor: pointer;" class="${document.querySelector("h2").className} MAL_SearchHelper">Search</h2><br><div class="MAL_SearchHelperBTN" style="cursor: pointer; color: #1d439b;font-size: larger;">[Show]</div><div class="mal_links" style="display: none;"></div><br>`); //Add the [Show] button on the page

  Allnames.forEach(function(name, i) { //For each website name
    if (name.match(RemovedLinksArrayRegex) === null || RemovedLinksArrayRegex.toLocaleString() === '/(?:)/') //If the website doesn't match an removed link,or if there are 0 links removed
    { //Starts the if condition
      document.querySelector(".mal_links").insertAdjacentHTML('beforeend', `<div id="${name}+Search" style="padding: 1px 0;"><a target="_blank" title="Search on ${name}" href="${name[i]}"><img style="position: relative; top: 4px;" src="${name[i*2]}" /> ${name}</a><span onmouseout="this.parentElement.style.backgroundColor = ''" onmouseover="this.parentElement.style.backgroundColor = '#d6e3ff'" title="Remove ${name}?" id="${name}" class="remove-link" style="z-index: 999999; position: sticky; left: calc(100% - 4%); line-height: 2;cursor: pointer;color: grey;">X</span></div>`);
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
    GM_setValue("searchUrl" + WebsiteName, prompt("Please enter the website search URL.\n*Add the text addtitlehere in the place you want the script to add the entry title on the link.\n*Example: https://9anime.to/?s=addtitlehere")); //Ask the user to enter the website search URL
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
          if (a.match(el.id.split('+')[0]) !== null) //If the stored data that has the specified name/favIcon/searchURL website name
          { //Starts the if condition
            GM_deleteValue(a); //Erase the stored name/favIcon/searchURL for the specific website
          } //Finishes the if condition
        }); //Finishes the for each condition
      } //Finishes the else condition
    }; //Finishes the onclick function
  }); //Finishes the for each condition

  if (document.querySelector("#Kitsu\\+Search") !== null) //If the Kitsu btn exists
  { //Start the if conditon
    document.querySelector("#Kitsu\\+Search").onclick = async function(e) { //When the Kitsu search btn is clicked
      e.preventDefault(); //Prevent the default context menu from being opened
      const response = await (await fetch(`https://kitsu.io/api/edge/mappings?filter[externalSite]=myanimelist%2F${EntryType}&filter[externalId]=${location.href.split('/')[4]}&include=item`)).json();
      open('https://kitsu.io/anime/' + response.included[0].id, '_blank'); //Open the kitsu website on a new tab
    }; //Finishes the onclick event listener
  } //Finishes the if conditon

  if (document.querySelectorAll("#Crunchyroll\\+Search, #Funimation\\+Search") !== null) //If the Crunchyroll or Funimation btn exists
  { //Start the if conditon
    document.querySelectorAll("#Crunchyroll\\+Search, #Funimation\\+Search").forEach(function(el) { //For the Crunchyroll and Funimation buttons
      el.onclick = async function(e) { //When the the Crunchyroll or the Funimation search btns are clicked
        e.preventDefault(); //Prevent the default context menu from being opened
        el.innerText === ' CrunchyrollX' ? open(document.querySelector("[href*='crunchyroll.com/series']") !== null ? document.querySelector("[href*='crunchyroll.com/series']").href : this.querySelector("a").href) : open(document.querySelector("[href*='funimation.com/shows']") !== null ? document.querySelector("[href*='funimation.com/shows']").href : this.querySelector("a").href); //Open the direct Crunchyroll or the Funimation links if they exist
      }; //Finishes the async function
    }); //Finishes the onclick event listener
  } //Finishes the if conditon

  if (document.querySelector("#\\39 Anime\\+Search") !== null) //If the 9Anime btn exists
  { //Start the if conditon
    document.querySelector("#\\39 Anime\\+Search").onclick = function(e) { //When the 9anime search btn is clicked
      e.preventDefault(); //Prevent the default context menu from being opened
      navigator.clipboard.writeText(document.querySelector("[itemprop*='name']").innerText.split('\n')[0]); //Copy the entry romaji title text
      setTimeout(() => { //After the entry title was copied
        open('https://9anime.id', '_blank'); //Open the 9anime website on a new tab
      }, 0); //Open the 9anime website on a new tab
    }; //Finishes the onclick event listener
  } //Finishes the if conditon
})();