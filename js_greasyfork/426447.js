// ==UserScript==
// @name     Redirect_FFXI_In_Wings_Era
// @author      Kyruski
// @version     2021.05.13
// @match        https://ffxiclopedia.fandom.com/*
// @description     Auto Redirect the FFXI Wikia to an in era edit for Wings of the Goddess
// @run-at      document-end
// @namespace https://greasyfork.org/users/771886
// @downloadURL https://update.greasyfork.org/scripts/426447/Redirect_FFXI_In_Wings_Era.user.js
// @updateURL https://update.greasyfork.org/scripts/426447/Redirect_FFXI_In_Wings_Era.meta.js
// ==/UserScript==
(async function () {
  const historyLinkClass = "mw-changeslist-date";
  const cutOffDate = new Date(2010, 02, 23);

  const months = {
    'January': 00,
    'February': 01,
    'March': 02,
    'April': 03,
    "May,": 04,
    'June': 05,
    'July': 06,
    'August': 07,
    'September': 08,
    'October': 09,
    'November': 10,
    'December': 11,
  }

  //grabs the DOM for the desired page
  const grabDOM = async (url) => {
    const response = await fetch(url);
    const text = await response.text();
    return await new DOMParser().parseFromString(text, 'text/html');
  }

  const currentURL = window.location.href //define current URL
  if (!currentURL.includes('oldid=') && !currentURL.includes('action=history') && !currentURL.includes('Main_Page')) { //only run if the current page isn't old, isn't the history page, or the main page
    const pageDom = await grabDOM(currentURL + '?offset=&limit=500&action=history') //grab history w/ 500 results
    const historyList = pageDom.getElementsByClassName(historyLinkClass); //select the history links
    for (let el of historyList) { //for each link
      let pageDate = el.innerHTML.replace(',', '').replace(':', ' ').split(' '); //take the date and split it into [Hour, Minute, Day, Month, Year]
      let compareDate = new Date(pageDate[4], months[pageDate[3]], pageDate[2], pageDate[0], pageDate[1]); //parse into javascript Date object
      if (cutOffDate > compareDate) { //compare if date is older than cut off date
        window.location.href = el.href; //if older, set window to that url
        break; //stop the function running
      }
    }
  }
 //redirect URL if the current page is the ffxi Wikia and it has an in-era page
})();