// ==UserScript==
// @name         Show More Info on the Anime/Manga page
// @namespace    MoreInfoMAL
// @version      19
// @description  Display the More Info button text contents after the synopsis only when an anime/manga has the More Info button. Don't worry about needing to open the More Info button anymore!
// @author       hacker09
// @include      /^https:\/\/myanimelist\.net\/(anime|manga)(id=)?(\.php\?id=)?\/?\d+\/?(?!.*\/).*(\?q=.*&cat=anime|manga)?$/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410450/Show%20More%20Info%20on%20the%20AnimeManga%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/410450/Show%20More%20Info%20on%20the%20AnimeManga%20page.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  if (document.querySelector('.footer-desktop-button') !== null || document.querySelector("a[href*='moreinfo']") !== null && document.querySelector("[itemprop*='description'],.lh18") !== null) //If it's the mobile website or if entry has the more info tab and also has the Synopsis section
  { //Starts the if condition

    var style = ''; //Creates a new global variable
    var Class = ''; //Creates a new global variable

    if (document.querySelector('.footer-desktop-button') !== null) //If it's the mobile website
    { //Starts the if condition
      Class = 'header3 fs16 pb0'; //Change the class name
      style = 'line-height: 2.2rem!important;font-size: 1.6rem!important;'; //Change the div style
    } //Finishes the if condition

    const response = await (await fetch('https://api.jikan.moe/v4/' + location.href.split('/')[3] + '/' + location.pathname.match(/\d+/)[0] + '/moreinfo')).json(); //Fetch
    if (response.data.moreinfo !== null) //If the entry has any more info text
    { //Starts the if condition
      document.querySelector("[itemprop*='description'],.lh18").insertAdjacentHTML('afterend', `<div id="CallFunctionFormatMoreInfoText" style="${style}"><h2 class="${Class}" style="cursor: pointer;">More Info</h2>${response.data.moreinfo}</div>`); //Append the more info below the synopsis

      setTimeout(function() { //Creates a settimeout function
        document.querySelector("#CallFunctionFormatMoreInfoText > h2").onclick = async function() //When the More Info tab is clicked
        { //Starts the function
          const response = await fetch(document.querySelectorAll("a[itemprop='item']")[2].href + '/moreinfo'); //Fetch
          const html = await response.text(); //Gets the fetch response
          const newDocument = new DOMParser().parseFromString(html, 'text/html'); //Parses the fetch response
          const MoreInfoContent = newDocument.querySelector("div.js-scrollfix-bottom-rel"); //Creates a variable to hold the whole more info tab
          MoreInfoContent.querySelector("div.mal-ad-unit") !== null ? MoreInfoContent.querySelector("div.mal-ad-unit").remove() : ''; //Remove needless ads of the more info tab content
          MoreInfoContent.querySelector("div.breadcrumb").remove(); //Remove needless stuff of the more info tab content
          MoreInfoContent.querySelector("#horiznav_nav").remove(); //Remove needless stuff of the more info tab content
          document.querySelector("#CallFunctionFormatMoreInfoText").innerHTML = MoreInfoContent.innerHTML; //append the more info tab text content below the entry synopsis
          document.querySelector(".mb8").setAttribute("style", "margin-top: 15px;font-weight: 700;border-bottom: #e5e5e5 1px solid;"); //Add a line break between the synopis txt content and the More Info content
        }; //Finishes the function
      }, 2000); //Run the setimeout function after 2 secs that the page loaded
    } //Finishes the if condition
  } //Finishes the if condition
})();