// ==UserScript==
// @name     [AO3 Wrangling] Random page
// @description Adds a button redirecting to a random page in your bins.
// @version  1.1
// @grant    none
// @author   Ebonwing
// @license MIT 
// @match        *://*.archiveofourown.org/tags/*/wrangle?*
// @namespace https://greasyfork.org/users/819864
// @downloadURL https://update.greasyfork.org/scripts/499614/%5BAO3%20Wrangling%5D%20Random%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/499614/%5BAO3%20Wrangling%5D%20Random%20page.meta.js
// ==/UserScript==

  var pagination = document.getElementsByClassName("pagination actions");

function randomPage(){
  var maxPage = pagination[0].children[pagination[0].children.length-2].innerText
  var url = window.location.href
  var urlArray = url.split("&");
  var newUrl = urlArray[0]
  var random = Math.ceil(Math.random() * (maxPage-1));
  newUrl = newUrl + "&page=" + random
  for(var i = 1; i < urlArray.length; i++){
   if(!urlArray[i].includes("page")){
      newUrl = newUrl+ "&" + urlArray[i]
   }
  }
  window.location.replace(newUrl)
}

  //create button
	const button = document.createElement("button")
  //needed so the button doesn't refresh the page
  button.type = "button";
  button.innerText = "Random Page"
  //set function for onlick
  button.addEventListener("click", randomPage); 
	pagination[0].insertBefore(button, pagination[0].firstChild);
