// ==UserScript==
// @name         Generate a List With The Animes/Mangas Titles that were Re-Watched/Re-Read
// @namespace    MAL Automatic Anime/Manga List Generator
// @version      23
// @description  Easily and quickly generate a list with all ReWatched/ReRead entries and how many times.
// @author       hacker09
// @match        https://myanimelist.net/profile/*
// @exclude      https://myanimelist.net/profile/*/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @grant        GM.xmlHttpRequest
// @connect      anime.jhiday.net
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/407957/Generate%20a%20List%20With%20The%20AnimesMangas%20Titles%20that%20were%20Re-WatchedRe-Read.user.js
// @updateURL https://update.greasyfork.org/scripts/407957/Generate%20a%20List%20With%20The%20AnimesMangas%20Titles%20that%20were%20Re-WatchedRe-Read.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var HomeresponseText, TotalCompletedEntries, HTMLresponse, AccExists, type, text, FinalHTML = '<a id="dwnldLnk"</a>', CompleteJSONList = [], progress = 1, nextpagenum = 0, increaseby = 300; //Make these variables global

  GM.xmlHttpRequest({ //Start a new xmlHttpRequest to get the last update info and check whether the account exists
    url: `https://anime.jhiday.net/hof/user/${location.pathname.split('/')[2]}`,
    onload: ({ responseText }) => { //When the xmlHttpRequest is completed
      HomeresponseText = responseText; //Create a new const
      if (new DOMParser().parseFromString(HomeresponseText, "text/html").body.innerText.search("Not Found") > -1) //If the account doesn't exist
      { //Starts the if condition
        AccExists = false; //Creates a new variable
        GM.xmlHttpRequest({ //Start a new xmlHttpRequest to create an account
          method: "GET",
          url: "https://anime.jhiday.net/auth/redirect",
          onload: ({ responseText }) => { //When the xmlHttpRequest is completed
            grecaptcha.execute(new DOMParser().parseFromString(responseText, "text/html").querySelector('meta[name="recaptcha_site_key"]').content, { action: "submit" }).then((recaptchaResponse) => { //ByPass the Google Recaptcha
              GM.xmlHttpRequest({ //Start a new xmlHttpRequest to create an account
                method: "POST",
                url: "https://myanimelist.net/submission/authorization",
                headers: { "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7", "content-type": "application/x-www-form-urlencoded" },
                data: `action_type=approve_authz&csrf_token=${new DOMParser().parseFromString(responseText, "text/html").querySelector('meta[name="csrf_token"]').content}&g-recaptcha-response=${recaptchaResponse}`
         });}); //Finishes the xmlHttpRequest
          } //Finishes the onload function
        }); //Finishes the xmlHttpRequest function
      } //Finishes the if condition
      else //If the account already exists
      { //Starts the else condition
        AccExists = true; //Creates a new variable
        GM.xmlHttpRequest({ method: 'POST', url: `https://anime.jhiday.net/hof/ajax/update-user/${location.pathname.split('/')[2]}` }); //Update the user stats
      } //Finishes the else condition
    } //Finishes the onload function
  }); //Finishes the xmlHttpRequest function

  document.querySelectorAll("li.clearfix.mb12 > span")[7].outerHTML = `<span title="Click to generate the Rewatched Anime List" class="di-ib fl-l fn-grey2" style="color: ${document.querySelector(".dark-mode") !== null ? '#abc4ed' : 'blue'} !important; cursor: pointer;">Rewatched</span>`; //The CSS for the ReWatched "button"
  document.querySelectorAll("li.clearfix.mb12")[6].onclick = function() //When the ReWatched text is clicked
  { //Starts the onclick event listener
    type = 'anime'; //Change the variable type
    text = 'ReWatched Anime'; //Change the variable type

    if (AccExists && confirm(`OK = Instantly shows the ${text} list.\n\nCancel = Gets the most recent ${text} list.\n(This process will take ${new Date(parseInt(document.querySelectorAll("span.di-ib.fl-r.lh10")[1].innerText.replace(',', '')) * 200).toLocaleTimeString([], { minute: "numeric", second: "2-digit", })} minutes to complete)`)) //Show the confirmation alert box text if the acc exists
    { //Starts the if condition
      GM.xmlHttpRequest({ //Start a new xmlHttpRequest to get the user ReWatches
        url: `https://anime.jhiday.net/hof/ajax/rewatches/${location.pathname.split('/')[2]}`,
        onload: ({ responseText }) => { //When the xmlHttpRequest is completed
          document.documentElement.innerHTML = `<title>Done! List Generated!</title><style>img.malIcon {display: none;}</style><div style='max-width:650px; font-size: 18px; margin:0px auto; white-space: nowrap;'><a style='position: absolute; left:10px;'>Last Updated ${new DOMParser().parseFromString(HomeresponseText, "text/html").querySelector("#updateBlock > p > i").innerText}</a><a href='https://myanimelist.net/profile/${location.pathname.split('/')[2]}' style='margin-inline-start: 226px;'>Return To User Profile</a><a id='dwnldLnk' style='margin-left: 910px !important; white-space: nowrap; margin-top: -21px !important; float: left;' download='${location.pathname.split('/')[2]} ${text} List!.html' title='${location.pathname.split('/')[2]} ${text} List!.html'>Download List</a><h1> ${location.pathname.split('/')[2]} ${text} List</h1><h3><em>List of Entries that ${location.pathname.split('/')[2]} has ReWatched/ReRead:</em></h3><ul>${new DOMParser().parseFromString(responseText, "text/html").querySelector("body > ul:nth-child(4)").innerHTML.replaceAll('/hof', '')}</ul></div>`; //Add the ReWatched/ReRead list on the page
          document.getElementById('dwnldLnk').href = `data:text/css;charset=utf-8,${encodeURIComponent(document.documentElement.innerHTML.replace('Download List', ' '))}`; //Adds the scrapped results as a link on the a element
          scrollTo({ top: 0, behavior: "smooth" }); //Scroll the page to the top
        } //Finishes the onload function
      }); //Finishes the xmlHttpRequest function
    } //Finishes the if condition
    else //If the user chose Cancel or the Account doesn't exist
    { //Starts the else condition
      AccExists === false && parseInt(document.querySelectorAll(".fl-r > li > .fl-r")[1].innerText.replace(',', '')) !== 0 ? alert(`This process will take ${new Date(parseInt(document.querySelectorAll("span.di-ib.fl-r.lh10")[1].innerText.replace(',', '')) * 200).toLocaleTimeString([], { minute: "numeric", second: "2-digit", })} minutes to complete`) : ''; //Displays a message
      NETscrape(); //Start the NETscrape function
    } //Finishes the else condition
  }; //Finishes the onclick event listener

  document.querySelectorAll("li.clearfix.mb12 > span")[18] === undefined ? '' : document.querySelectorAll("li.clearfix.mb12 > span")[18].outerHTML = `<span title="Click to generate the Reread Manga List" class="di-ib fl-l fn-grey2" style="color: ${document.querySelector(".dark-mode") !== null ? '#abc4ed' : 'blue'} !important; cursor: pointer;">Reread</span>`; //The CSS for the ReRead "button"
  document.querySelectorAll("li.clearfix.mb12")[14] === undefined ? '' : document.querySelectorAll("li.clearfix.mb12")[14].onclick = function() //When the ReRead text is clicked
  { //Starts the onclick event listener
    type = 'manga'; //Change the variable type
    text = 'ReRead Manga'; //Change the variable type
    parseInt(document.querySelectorAll(".fl-r > li > .fl-r")[4].innerText.replace(',', '')) !== 0 ? alert(`This process will take ${new Date(parseInt(document.querySelectorAll("span.di-ib.fl-r.lh10")[6].innerText.replace(',', '')) * 200).toLocaleTimeString([], { minute: "numeric", second: "2-digit", })} minutes to complete`) : ''; //Displays a message
    NETscrape(); //Start the NETscrape function
  }; //Finishes the onclick event listener

  async function NETscrape() { //Starts the NETscrape function
    if ((type === 'anime' && parseInt(document.querySelectorAll(".fl-r > li > .fl-r")[1].innerText.replace(',', '')) === 0) || (type === 'manga' && parseInt(document.querySelectorAll(".fl-r > li > .fl-r")[4].innerText.replace(',', '')) === 0)) //If the user haven't ReWatched or ReRead anything
    { //Starts the if condition
      alert(`${location.pathname.split('/')[2]} doesn\'t have any ${text}!`); //Displays a message
      throw (`${location.pathname.split('/')[2]} doesn\'t have any ${text}!`); //Stops the script
    } //Finishes the if condition

    document.body.insertAdjacentHTML('beforeEnd', '<div id="loadingScreen" style="position: fixed;width: 100%;height: 100%;background-color: #00000054;top: 0;z-index: 1000;background-image: url(https://i.imgur.com/ka06oyE.gif);background-repeat: no-repeat;background-position: center;"></div>'); //Show the loading screen

    while (true) { //Starts the while condition to get the Total Number of Entries on the user-completed list
      document.title = 'Getting all completed entries...'; //Shows the current process on the tab title
      const ListJSON = await (await fetch(`https://myanimelist.net/${type}list/${location.pathname.split('/')[2]}/load.json?status=2&offset=${nextpagenum}`)).json(); //Fetch
      nextpagenum += increaseby; //Increase the next page number
      var totalanimestwo = ListJSON.length; //Store the Total Completed Entries Number
      ListJSON.forEach(el => CompleteJSONList.push(el)); //Save the current page json entries on the CompleteJSONList variable
      TotalCompletedEntries += totalanimestwo; //Sum the Total Completed Entries Number and add the result to the variable TotalCompletedEntries
      if (totalanimestwo !== 300) //If the next page has less than 300 completed entries stop the while condition
      { //Starts the if condition
        for (const el of CompleteJSONList) { //Starts a for loop for every single entry JSON response
          document.title = `Processing entry ${progress++} of ${CompleteJSONList.length}`; //Shows the current process on the tab title
          HTMLresponse = await (await fetch("https://myanimelist.net/includes/ajax-no-auth.inc.php?t=6", { //Fetch the more info btn HTML codes for every single entry JSON response
            "headers": {
              "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "body": `color=1&id=${type === 'anime' ? el.anime_id : el.manga_id}&memId=${document.querySelector('input[name="profileMemId"]') === null ? document.querySelector(".mr0").href.match(/\d+/) : document.querySelector('input[name="profileMemId"]').value}&type=${type}&csrf_token=${document.head.querySelector("[name='csrf_token']").content}`,
            "method": "POST"
          })).text(); //Finishes the fetch

          const newDocument = new DOMParser().parseFromString(HTMLresponse, 'text/html'); //Parses the fetch response

          if ((type === 'anime' && parseInt(newDocument.querySelector('body > table > tbody > tr > td > div > a > strong').innerText.split('<')[0]) >= 1) || (type === 'manga' && parseInt(newDocument.body.textContent.match(/(?<=Times Read: )[0-9]+/)[0]) >= 1)) { //If the current entry has been ReWatched/ReRead at least once
            FinalHTML += `<li>${(type === 'anime' && parseInt(newDocument.querySelector('body > table > tbody > tr > td > div > a > strong').innerText.split('<')[0]) > 1) || (type === 'manga' && parseInt(newDocument.body.textContent.match(/(?<=Times Read: )[0-9]+/)[0]) >= 1) ? `<b>[x${type === 'anime' ? newDocument.querySelector('body > table > tbody > tr > td > div > a > strong').innerText.split('<')[0] : parseInt(newDocument.body.textContent.match(/(?<=Times Read: )[0-9]+/)[0])}] </b>` : ''}<a href='https://myanimelist.net${type === 'anime' ? el.anime_url : el.manga_url}'>${type === 'anime' ? el.anime_title : el.manga_title}</a></li>`; //Add the entry info on the Final HTML codes result
          } //Finishes the if condition
        } //Finishes the for loop

        document.documentElement.innerHTML = FinalHTML === '<a id="dwnldLnk"</a>' ? `The Rewatched/ReRead entries number shown on the user ${location.pathname.split('/')[2]} profile page is wrong and outdated!<br><br>${location.pathname.split('/')[2]} currently has no Rewatched/ReRead entries!` : `<title>Done! List Generated!</title><div style='max-width:650px; font-size: 18px; margin:0px auto; white-space: nowrap;'><a href='https://myanimelist.net/profile/${location.pathname.split('/')[2]}' style='margin-inline-start: 226px;'>Return To User Profile</a><a id='dwnldLnk' style='margin-left: 910px !important; white-space: nowrap; margin-top: -21px !important; float: left;' download='${location.pathname.split('/')[2]} ${text} List!.html' title='${location.pathname.split('/')[2]} ${text} List!.html'>Download List</a><h1> ${location.pathname.split('/')[2]} ${text} List</h1><h3><em>List of Entries that ${location.pathname.split('/')[2]} has ReWatched/ReRead:</em></h3><ul>${FinalHTML}</ul></div>`; //Add the ReWatched/ReRead list on the page

        [...document.querySelectorAll("ul > li")].sort((a, b) => { //Sorts the list
          return ((b.textContent.match(/\[x(\d+)\]/) ? parseInt(b.textContent.match(/\[x(\d+)\]/)[1]) : -1) - (a.textContent.match(/\[x(\d+)\]/) ? parseInt(a.textContent.match(/\[x(\d+)\]/)[1]) : -1)) || a.textContent.localeCompare(b.textContent);}).forEach(item => document.querySelector("ul").appendChild(item)); //Sort by the amount of ReWatches/ReReads first, then alphabetically

        document.querySelector("#dwnldLnk").href = `data:text/css;charset=utf-8,${encodeURIComponent(document.documentElement.innerHTML.replace('Download List', ''))}`; //Adds the scrapped results as a link on the a element

        scrollTo({ top: 0, behavior: "smooth" }); //Scroll the page to the top
        return; //Stops the while condition
      } //Finishes the if condition
    } //Finishes the while condition
  } //Finishes the NETscrape function
})();