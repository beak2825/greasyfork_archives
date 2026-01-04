// ==UserScript==
// @name         Links to titles - MAL
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      9
// @description  Shows entry and topic titles instead of full link urls.
// @author       hacker09
// @match        https://myanimelist.net/news/*
// @match        https://myanimelist.net/people/*
// @match        https://myanimelist.net/profile/*
// @match        https://myanimelist.net/clubs.php*
// @match        https://myanimelist.net/myblog.php*
// @match        https://myanimelist.net/forum/?topicid=*
// @match        https://myanimelist.net/comments.php?id*
// @match        https://myanimelist.net/stacks/add?type=*
// @match        https://myanimelist.net/comtocom.php?id1=*
// @match        https://myanimelist.net/mymessages.php?go=*
// @match        https://myanimelist.net/myrecommendations.php*
// @match        https://myanimelist.net/clubs.php?id=*&action=view&t=comments&show=*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @connect      api.myanimelist.net
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/448650/Links%20to%20titles%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/448650/Links%20to%20titles%20-%20MAL.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.onkeyup = async function() { //Detect when the user is writting
    if (document.activeElement.value !== undefined && document.activeElement.value.match(`jpe?g|png|gif|youtu.?be`) !== null) //If the focused element is not = undefined and contains an image/YT text
    { //Starts the if condition
      document.activeElement.value = document.activeElement.value.replaceAll(/(?<!\[img])(https:\/\/\S+\.(?:jpe?g|png|gif))(?!\[\/img])/gm, '[img]$1[/img]'); //For every image url BBCodefy the url
      document.activeElement.value = document.activeElement.value.replaceAll(/(?:https:\/\/\S+\/|https:\/\/\S+\/watch\?v=)([\w-]{11})(?=\W)(\?\w+=\d+(&[^\s?"]+)?|&\w=\w+)?/gm, '[yt]$1[/yt]'); //For every YT url BBCodefy the url
    } //Finishes the if condition

    if (document.activeElement.value !== undefined && document.activeElement.value.match(`myanimelist.net/(anime|manga|forum)/`) !== null) //If the focused element is not = undefined and contains an entry/forum text
    { //Starts the if condition
      document.activeElement.value = document.activeElement.value.replaceAll(/(https:\/\/myanimelist\.net\/(?:anime|manga)\/\d+)\/(?!.*?\/)([^/\s?]+)\S*/gm, '[url=$1]$2[/url]'); //For each entry with title and no subpage BBCodefy the url
      document.activeElement.value = document.activeElement.value.replaceAll(/(?<!\[[^\[\]]*)(https:\/\/myanimelist\.net\/(?:anime|manga)\/\d+\/)([^\s/]+?)(?:__[^\s/]*)?\b(?:\/(\w+))?/gm, '[url=$1$2/$3]$2 ($3)[/url]'); //For each entry with title and subpage BBCodefy the url
      document.activeElement.value = document.activeElement.value.replaceAll(/(?<=\][^\[]*)_/gm, ' '); //For each entry replace _ with spaces for the title

      [...document.activeElement.value.matchAll(/(https:\/\/myanimelist\.net\/(anime|manga)\/(\d+))(?![^\[]*\])/gm)].forEach(async function(el) { //For each entry without any titles
        const EntryTitle = await new Promise((resolve) => GM.xmlHttpRequest({ //Starts the xmlHttpRequest
          responseType: 'json',
          url: `https://api.myanimelist.net/v2/${el[2]}/${el[3]}?fields=title`,
          headers: {
            "x-mal-client-id": "8ef0267fd86a187d479e6fcd7e1bb42a"
          },
          onload: r => resolve(r.response.title)
        })); //Finishes the xmlHttpRequest
        document.activeElement.value = document.activeElement.value.replaceAll(new RegExp(`(${el[0]})(?![^\[]*\])`, 'gm'), `[url=$1]${EntryTitle}[/url]`); //BBCodefy the url
      }); //Finishes the for each condition

      [...document.activeElement.value.matchAll(/(https:\/\/myanimelist\.net\/forum\/\?topicid=(\d+))(?:&show=)?(\d+)?(?:#msg(\d+))?(?![^\[]*\])/gm)].forEach(async function(el, index) { //For each forum link
        var PostId = ''; //Creates a new global variable
        const Set = el[3] !== undefined ? el[3] : 0; //Get the offset
        const Topic = await new Promise((resolve) => GM.xmlHttpRequest({ //Starts the xmlHttpRequest
          responseType: 'json',
          url: `https://api.myanimelist.net/v2/forum/topic/${el[2]}?offset=${Set}&limit=100`,
          headers: {
            "x-mal-client-id": "8ef0267fd86a187d479e6fcd7e1bb42a"
          },
          onload: r => resolve(r.response)
        })); //Finishes the xmlHttpRequest
        Topic.data.posts.forEach(Mid => Mid.id === parseInt(el[0].match(/\d+/g).pop()) ? PostId = ` (#${Mid.number})` : ''); //Get the post ID
        document.activeElement.value = document.activeElement.value.replaceAll(new RegExp(`(${el[0].replace('?','\\?')})(?![^\[]*\])`, 'gm'), `[url=$1]${Topic.data.title}${PostId}[/url]`); //BBCodefy the url
      }); //Finishes the for each condition
    } //Finishes the if condition
  }; //Finishes the onkeyup event listener

  const ParsedURLsList = []; //Creates a array to later add all non-dup mal links on the page
  [...document.querySelectorAll('a')].filter(a => a.innerText.match(`myanimelist.net/(anime|manga|forum)/`)).forEach(async function(el, index) { //For each entry/forum url on the page
    if (!ParsedURLsList.includes(el.href)) { //If the url isn't already on the array
      ParsedURLsList.push(el.href); //Add the url on the array

      if (el.href.match(/(?<=\d+\/)[^\/".]+/) !== null && el.href.match(`/forum/`) === null) //If the link already has the entry name on it
      { //Starts the if condition
        [...document.querySelectorAll('a')].filter(a => a.innerText.match(new RegExp('^' + el.innerText.replace('?', '\\?') + '$'))).forEach(a => a.innerText = `${a.innerText.match(/(?<=\d+\/)[^\/."?]+/)[0].replaceAll('_', ' ')}${a.innerText.match(/(?<=\d+\/)[^\/."?]+[\/]?(\w+)?/)[1] !== undefined ? ` (${a.innerText.match(/(?<=\d+\/)[^\/."?]+[\/]?(\w+)?/)[1]})` : ''}`); //BBCodefy the url
      } //Finishes the if condition

      if (el.href.match(/(?<=\d+\/)[^\/".]+/) === null && el.href.match(`/forum/`) === null) //If the link doesn't have the entry name on it
      { //Starts the if condition
        const EntryTitle = await new Promise((resolve) => GM.xmlHttpRequest({ //Starts the xmlHttpRequest
          responseType: 'json',
          url: `https://api.myanimelist.net/v2/${el.href.split('/')[3]}/${el.href.match(/\d+/)[0]}?fields=title`,
          headers: {
            "x-mal-client-id": "8ef0267fd86a187d479e6fcd7e1bb42a"
          },
          onload: r => resolve(r.response.title)
        })); //Finishes the xmlHttpRequest
        [...document.querySelectorAll('a')].filter(a => a.href.match(new RegExp('^' + el.innerText + '$'))).forEach(a => a.innerText = EntryTitle); //BBCodefy the url
      } //Finishes the if condition

      if (el.href.match(`/forum/`) !== null) //If it's a forum link
      { //Starts the if condition
        var PostId = ''; //Creates a new global variable
        const Set = el.href.match(/show=(\d+)/) !== null ? el.href.match(/show=(\d+)/)[1] : 0; //Gets the offset
        const Topic = await new Promise((resolve) => GM.xmlHttpRequest({ //Starts the xmlHttpRequest
          responseType: 'json',
          url: `https://api.myanimelist.net/v2/forum/topic/${el.href.match(/\d+/)[0]}?offset=${Set}&limit=100`,
          headers: {
            "x-mal-client-id": "8ef0267fd86a187d479e6fcd7e1bb42a"
          },
          onload: r => resolve(r.response)
        })); //Finishes the xmlHttpRequest
        Topic.data.posts.forEach(Mid => Mid.id === parseInt(el.href.match(/\d+/g).pop()) ? PostId = ` (#${Mid.number})` : ''); //Get the post ID
        [...document.querySelectorAll('a')].filter(a => a.href.replaceAll('?', '').match(new RegExp('^' + el.innerText.replaceAll('?', '') + '$'))).forEach(a => a.innerText = Topic.data.title + PostId); //BBCodefy the url
      } //Finishes the if condition
    } //Finishes the if condition
  }); //Finishes the for each condition
})();