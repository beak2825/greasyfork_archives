// ==UserScript==
// @name         Anime Recommendations - MAL
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      15
// @description  Get new anime recommendations whenever you open your profile page.
// @author       hacker09
// @include      /https:\/\/myanimelist\.net\/profile\/[^\/]+(\/)?$/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/445087/Anime%20Recommendations%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/445087/Anime%20Recommendations%20-%20MAL.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  const $ = jQuery; //Defines That The Symbol $ Is A jQuery

  if (document.head.innerHTML.match(/styles\/(221397|221398|221276|221277).css/) !== null) //If the script "Better MAL Favs" is installed
  { //Starts the if condition
    document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="https://userstyles.org/styles/265535.css"/>`); //Add a CSS fix
  } //Finishes the if condition

  document.querySelector("#statistics").insertAdjacentHTML('AfterEnd', `<h5 id="recs" style="cursor: pointer;">Anime Recommendations (32)</h5><div class="fav-slide-block mb12"><div class="btn-fav-slide-side left" data-hide="true" id="recsArrows" style="display: none; left: 0px; opacity: 1;"><span class="btn-inner"></span></div><div class="btn-fav-slide-side right" data-hide="false" id="recsArrows" style="display: none; right: 0px; opacity: 1;"><span class="btn-inner"></span></div><div id="fix_x_overflow" class="fav-slide-outer" style="overflow-x: hidden; height: 130px;"><ul class="fav-slide" data-slide="10" style="width: max-content;" id="anime_recs"></ul></div></div>`); //Add the base html and arrows

  if (document.querySelector(".updates.anime > p") !== null) //If the user has a private list
  { //Starts the if condition
    document.querySelector("#recs").innerText = `Anime Recommendations (Error! ${location.href.split('/')[4]} has a private anime list!)`; //Show the private list error message of the text "Access to this list has been restricted by the owner." exists
    return false; //Stop the script
  } //Finishes the if condition

  const response = await fetch(`https://api.reko.moe/${location.href.split('/')[4]}/random`); //Fetch
  const json = await response.json(); //Gets the fetch response

  json.data.forEach(function(el) { //Foreach recommendation
    const img = new Image(); //Create an image object
    img.src = el.details.picture; //Give the image object an src

    document.querySelector("#anime_recs").insertAdjacentHTML('Beforeend', `<li class="btn-fav" title="${el.details.title}"><a href="https://myanimelist.net/anime/${el.id}" class="link bg-center"><span class="title fs10" style="overflow-y: hidden;">${el.details.title}</span><span class="users" /${document.head.innerHTML.match(/styles\/221276.css/) === null ? document.head.innerHTML.match(/styles\/221277.css/) === null ? 'style="word-break: unset;"' : 'style="word-break: unset;left: -1px !important;top: 1px !important;"' : 'style="word-break: unset;left: 79px !important;top: 15px !important;"'}>${el.details.airing_date ? el.details.airing_date.split('-')[0] : ''}</span><img style="${img.naturalHeight <= 300 ? 'object-fit: unset;' : ''}" src="${el.details.picture}" width="70" height="110" class="image lazyloaded" alt="${el.details.title}"></a></li>`); //Show all recs
  }); //Finishes adding all recommendations to the page

  document.querySelector("div.fav-slide-block.mb12").onmouseover = function(el) { //When the row is hovered
    document.querySelectorAll("#recsArrows").forEach(el => el.dataset.hide === 'true' ? el.style.display = 'none' : el.style.display = ''); //Show the arrows
  }; //Finishes the onmouseover event listener
  document.querySelector("div.fav-slide-block.mb12").onmouseout = function(el) { //When the mouse leaves the row
    document.querySelectorAll("#recsArrows").forEach(el => el.style.display = 'none'); //Hide the arrows
  }; //Finishes the onmouseout event listener

  document.querySelectorAll("#recsArrows").forEach(function(el) { // Foreach arrow
    var leftClickCount = 0, rightClickCount = 0; //Initialize click counters

    el.onclick = function() { // If the recommendation row arrows are clicked
      var scrollAmount = 0; //Initialize scroll Amount counter
      if (el.className.match('left') !== null) { //If the left arrow is clicked
        if (leftClickCount >= 3) leftClickCount = 0; //Reset the counter if left arrow was clicked 3x
        leftClickCount++; //Increment the left click counter
        scrollAmount = -1 * leftClickCount * 9 * 80; //Calculate scroll amount for the left arrow
        if (leftClickCount === 2) scrollAmount = -1 * leftClickCount * 4 * 80; //If the left arrow was clicked 2x decrease the scroll amount
      } else { //If the right arrow is clicked
        document.querySelector(".btn-fav-slide-side.left").dataset.hide = 'false'; //Show the left arrow after the right arrow is clicked
        if (rightClickCount >= 3) rightClickCount = 0; //Reset the counter if right arrow was clicked 3x
        rightClickCount++; //Increment the right-click counter
        scrollAmount = rightClickCount * 9 * 80; //Calculate scroll amount for the right arrow
        if (rightClickCount === 2) scrollAmount = rightClickCount * 4 * 80; //If the right arrow was clicked 2x decrease the scroll amount
      } //Finishes the if condition

      $("#fix_x_overflow").animate({
        scrollLeft: $("#fix_x_overflow").scrollLeft() + scrollAmount // Scroll to the new position
      }, 1500); //Animate the scrolling behavior
      el.className.match('left') !== null && leftClickCount === 3 ? document.querySelector(".btn-fav-slide-side.left").dataset.hide = 'true' : document.querySelector(".btn-fav-slide-side.left").dataset.hide = 'false'; //If left arrow was clicked 3x hide it, otherwise show it
      el.className.match('right') !== null && rightClickCount === 3 ? document.querySelector(".btn-fav-slide-side.right").dataset.hide = 'true' : document.querySelector(".btn-fav-slide-side.right").dataset.hide = 'false'; //If right arrow was clicked 3x hide it, otherwise show it
    }; //Finishes the onclick event listener
  }); //Finishes the foreach loop
})();