// ==UserScript==
// @name         Fetch MalSync Search Helper - MAL
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
// @downloadURL https://update.greasyfork.org/scripts/465979/Fetch%20MalSync%20Search%20Helper%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/465979/Fetch%20MalSync%20Search%20Helper%20-%20MAL.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  var URLs = [] //Creates a new blank array
  var Imgs = []; //Creates a new blank array
  var titles = []; //Creates a new blank array
  var Addedname = []; //Creates a new blank array
  var AddedFavIcon = []; //Creates a new blank array
  var AddedsearchUrl = []; //Creates a new blank array
  var RemovedLinksArray = []; //Creates a new blank array
  const title = document.querySelector('meta[property="og:title"]').content.trim().match(/(?:Watch )?(.*)/)[1]; //Get the entry title
  const titleEncoded = encodeURI(title); //Encode the entry title
  const EntryType = location.pathname.split('/')[1]; //Store the Entry type
  var AnimeorLiterature = '1_0'; //Define the variable to search for animes
  const GFav = 'https://www.google.com/s2/favicons?domain='; //Creates a new variable
  var Infoh2Elem = document.querySelectorAll("h2")[2]; //Save the Infomation h2 element to a variable If the entry is on the user list

  GM_listValues().forEach(function(a) { //ForEach stored data on tampermonkey
    if (a.match(/name|FavIcon|searchUrl/) === null) //If the stored data isn't an added name/favIcon/searchURL
    { //Starts the if condition
      RemovedLinksArray.push('^' + a); //Add the user choice to hide a link on an array
    } //Finishes the if condition
    if (a.match('name') !== null) //If the stored data is an added name
    { //Starts the if condition
      Addedname.push(GM_getValue(a)); //Add the new stored data to an array
    } //Finishes the if condition
    if (a.match('FavIcon') !== null) //If the stored data is an added favIcon
    { //Starts the if condition
      AddedFavIcon.push(GM_getValue(a)); //Add the new stored data to an array
    } //Finishes the if condition
    if (a.match('searchUrl') !== null) //If the stored data is an added searchURL
    { //Starts the if condition
      AddedsearchUrl.push(GM_getValue(a).split('addtitlehere')[0] + titleEncoded + GM_getValue(a).split('addtitlehere')[1]); //Add the new stored data to an array
    } //Finishes the if condition
  }); //Add all removed links on tampermonkey to the array

  const RemovedLinksArrayRegex = new RegExp(RemovedLinksArray.join('$|')); //Create a new variable and regex containing all the removed links saved on tampermonkey and replace the , separator with the or $| regex symbols

  if (EntryType === 'manga') //If the entry type is manga
  { //Start the if conditon
    AnimeorLiterature = '3_0'; //Define the variable to search for Literatures
  } //Finishes the if conditon

  if (document.querySelector("#broadcast-block > a") !== null) //If the user is on MAL Mobile
  { //Starts the if condition
    setTimeout(() => { //Starts the setTimeout
      document.querySelector("#broadcast-block > a").click(); //Open the Watch Episodes list
      document.querySelector(".mal-modal").click(); //Closes the Watch Episodes list
    }, 0); //Finishes the setTimeout
  } //Finishes the if condition

  const response = await (await fetch(`https://api.allorigins.win/raw?url=https://github.com/MALSync/MALSync/blob/master/pages.md`)).text(); //Finishes the fetch
  const MALSyncDoc = new DOMParser().parseFromString(response, 'text/html'); //Parses the fetch response
  titles.push('ㅤㅤ■■■■■■MalSync Anime■■■■■■'); //Add a title above all MalSync Anime
  URLs.push('javascript:;'); //Make the title not clickable
  Imgs.push('data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='); //Add a transparent img to the title
  MALSyncDoc.querySelectorAll("table:nth-child(2) > tbody > tr > td:nth-child(1) > a").forEach(name => titles.push(name.innerText.trim())); //Add all MalSync anime website names to the titles array
  MALSyncDoc.querySelectorAll("table:nth-child(2) > tbody > tr > td:nth-child(1) > a > img").forEach(img => Imgs.push(img.src)); //Add all MalSync Icons anime website names to the titles array
  MALSyncDoc.querySelectorAll("table:nth-child(2) > tbody > tr > td:nth-child(1) > a").forEach(link => URLs.push(link.href)); //Add all MalSync anime link to the URLs array
  titles.push('ㅤㅤ■■■■■■MalSync Manga■■■■■■'); //Add a title above all MalSync Manga
  URLs.push('javascript:;'); //Make the title not clickable
  Imgs.push('data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='); //Add a transparent img to the title
  MALSyncDoc.querySelectorAll("table:nth-child(4) > tbody > tr > td:nth-child(1) > a").forEach(name => titles.push(name.innerText.trim())); //Add all MalSync manga website names to the titles array
  MALSyncDoc.querySelectorAll("table:nth-child(4) > tbody > tr > td:nth-child(1) > a > img").forEach(img => Imgs.push(img.src)); //Add all MalSync Icons manga website names to the titles array
  MALSyncDoc.querySelectorAll("table:nth-child(4) > tbody > tr > td:nth-child(1) > a").forEach(link => URLs.push(link.href)); //Add all MalSync manga link to the URLs array

  const names = ['Crunchyroll', 'AnimesHouse', 'Funimation', 'AnimeFire', '9Anime', 'Zoro', 'Nyaa', 'Gogoanime', 'AnimeFreak', 'Youtube', 'Jkanime', 'AnimeFLV', 'AnimeFlix', 'AniList', 'aniDB', 'Kitsu', 'Anime-Planet', 'AnimeNewsNetwork', 'AnimeOwl', 'AniSearch', 'Annict', 'Netflix', 'Hidive', 'LiveChart', 'Notify', 'Proxer', 'Shikimori', 'Simkl', 'Trakt', 'TurkAnime', 'LNDB', 'Mangadex', 'Mangaupdates', 'Novel Updates', 'VIZ', 'MangaPlus']; //Add the default website names to an array
  const Allnames = Addedname.concat(names, titles); //Add the default and added website names to an array

  const searchUrl = AddedsearchUrl.concat([`https://www.crunchyroll.com/search?q=${titleEncoded}`, `https://animeshouse.net/?s=${titleEncoded}`, `https://www.funimation.com/search/?q=${titleEncoded}`, `https://www.google.com/search?q=${titleEncoded} site:https://animefire.net`, `https://9anime.id`, `https://zoro.to/search?keyword=${titleEncoded}`, `https://nyaa.si/?f=0&c=${AnimeorLiterature}&q=${titleEncoded}`, `https://gogoanime.llc/search.html?keyword=${titleEncoded}`, `https://animefreak.site/search?keyword=${titleEncoded}`, `https://www.youtube.com/results?search_query=${titleEncoded}`, `https://jkanime.net/buscar/${titleEncoded}/1/`, `https://animeflv.net/browse?q=${titleEncoded}`, `https://animeflix.live/search/${titleEncoded}`, `https://anilist.co/search/${EntryType}?search=` + titleEncoded, `https://anidb.net/anime/?do.search=1&adb.search=${titleEncoded}`, `https://kitsu.io/${EntryType}?text=${titleEncoded}`, `https://www.anime-planet.com/${EntryType}/all?name=${titleEncoded}`, `https://www.animenewsnetwork.com/encyclopedia/search/name?only=${EntryType}&q=${titleEncoded}`, `https://animeowl.net/?s=${titleEncoded}`, `https://www.anisearch.com/${EntryType}/index?text=${titleEncoded}`, `https://annict.com/search?q=${titleEncoded}`, `https://www.netflix.com/search?q=${titleEncoded}`, `https://www.hidive.com/search?q=${titleEncoded}`, `https://www.livechart.me/search?q=${titleEncoded}`, `https://notify.moe/search/${titleEncoded}`, `https://proxer.me/search?s=search&name=${titleEncoded}typ=all-${EntryType}&tags=&notags=#top`, `https://shikimori.org/${EntryType}s?search=${titleEncoded}`, `https://simkl.com/search/?type=anime&q=${titleEncoded}`, `https://trakt.tv/search?query=${titleEncoded}`, `https://www.google.com/search?q=${titleEncoded} site:turkanime.tv/anime/ OR site:turkanime.net/anime/`, `https://lndb.info/search?text=${titleEncoded}`, `https://mangadex.org/titles?q=${titleEncoded}`, `https://www.mangaupdates.com/search.html?search=${titleEncoded}`, `https://www.novelupdates.com/?s=${titleEncoded}`, `https://www.viz.com/search?search=${titleEncoded}`, `https://mangaplus.shueisha.co.jp/search_result?keyword=${titleEncoded}`], URLs); //Add the default and added website search urls to an array

  const FavIcon = AddedFavIcon.concat([`${GFav}crunchyroll.com`, `${GFav}animeshouse.net`, `${GFav}funimation.com`, `${GFav}animefire.net`, `${GFav}9anime.id`, `${GFav}zoro.to`, `${GFav}nyaa.si`, `${GFav}gogoanime.llc`,`${GFav}animefreak.site`, `${GFav}youtube.com`, `${GFav}jkanime.net`, `${GFav}animeflv.net`, `${GFav}animeflix.live`, `${GFav}anilist.co`, `${GFav}anidb.net`, `${GFav}litsu.io`, `${GFav}anime-planet.com`, `${GFav}animenewsnetwork.com`, `${GFav}animeowl.net`, `${GFav}anisearch.com`, `${GFav}annict.com`, `${GFav}netflix.com`, `${GFav}hidive.com`, `${GFav}livechart.me`, `${GFav}notify.moe`, `${GFav}proxer.me`, `${GFav}shikimori.org`, `${GFav}simkl.com`, `${GFav}trakt.tv`, `${GFav}turkanime.net`, `${GFav}lndb.info`, `${GFav}mangadex.org`,`${GFav}mangaupdates.com`, `${GFav}novelupdates.com`, `${GFav}viz.com`, `${GFav}mangaplus.shueisha.co.jp`], Imgs); //Add the default and added website fav icons to an array

  if (document.querySelectorAll("h2")[2].innerText !== 'Information') //If the entry is not on the user list
  { //Starts the if condition
    Infoh2Elem = document.querySelectorAll("h2")[1]; //Save the Infomation h2 element to a variable
  } //Finishes the if condition

  Infoh2Elem.insertAdjacentHTML('beforebegin', `<h2 style="cursor: pointer;" class="${document.querySelector("h2").className} MAL_SearchHelper">Search</h2><br><div class="MAL_SearchHelperBTN" style="cursor: pointer; color: #1d439b;font-size: larger;">[Show]</div><div class="mal_links" style="display: none;"></div><br>`); //Add the [Show] button on the page

  Allnames.forEach(function(name, i) { //For each website name
    if (name.match(RemovedLinksArrayRegex) === null || RemovedLinksArrayRegex.toLocaleString() === '/(?:)/') //If the website doesn't match an removed link,or if there are 0 links removed
    { //Starts the if condition
      document.querySelector(".mal_links").insertAdjacentHTML('beforeend', `<div id="${name}+Search" style="padding: 1px 0;"><a target="_blank" title="Search on ${name}" href="${searchUrl[i]}"><img style="position: relative; top: 4px;" src="${FavIcon[i]}" /> ${name}</a><span onmouseout="this.parentElement.style.backgroundColor = ''" onmouseover="this.parentElement.style.backgroundColor = '#d6e3ff'" title="Remove ${name}?" id="${name}" class="remove-link" style="z-index: 999999; position: sticky; left: calc(100% - 4%); line-height: 2;cursor: pointer;color: grey;">X</span></div>`);
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
    GM_setValue("FavIcon" + WebsiteName, prompt("\n*Optional\nPlease enter the website FavIcon URL.\n*If you don't know the website FavIcon URL click on ok!", "https://www.google.com/s2/favicons?domain=bing.com")); //Ask the user to enter the website FavIcon
    GM_setValue("searchUrl" + WebsiteName, prompt("Please enter the website search URL.\n*Add the text addtitlehere in the place you want the script to add the entry title on the link.\n*Example: https://9anime.to/?s=addtitlehere")); //Ask the user to enter the website search URL
  }; //Finishes the onclick event listener

  document.querySelectorAll("span.remove-link").forEach(function(el) { //For each remove button
    el.onclick = function() //Add a click event listener to the remove btn
    { //Starts the onclick function
      this.parentElement.remove(); //Remove the correspondent website of the search list
      if (names.includes(this.id.split('+')[0]) === true) //If the website removed as a default website
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

  document.querySelector("#ㅤㅤ■■■■■■MalSync\\ Anime■■■■■■\\+Search").onclick = function(e){ e.preventDefault(); } //Prevent a new tab from opening
  document.querySelector("#ㅤㅤ■■■■■■MalSync\\ Manga■■■■■■\\+Search").onclick = function(e){ e.preventDefault(); } //Prevent a new tab from opening

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