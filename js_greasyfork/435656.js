// ==UserScript==
// @name        TechTweaks
// @namespace   py-mpixel
// @match       https://linustechtips.com/*
// @grant       none
// @version     1.1
// @author      pythonmegapixel
// @description Various tweaks for the linustechtips.com forums
// @license BSD-3-Clause
// @downloadURL https://update.greasyfork.org/scripts/435656/TechTweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/435656/TechTweaks.meta.js
// ==/UserScript==
 
 
const CONF = {
  // How to handle GIF profile pictures.
  // 0 = leave as is
  // 1 = replace with generic "contacts" icon (except on mouseover)
  gifProfilePictures: 0,
  
  // What to do with the "ranking" information:
  // 0 = leave as is
  // 1 = move to where the Member Title used to be
  // 2 = hide altogether
  rankingInformation: 1,
}
 
 
/****************************************************************************
 ***************************************************************************/
 
 
if (CONF.gifProfilePictures==1) {
 
  const replacementImageData =
    `
    <svg xmlns="http://www.w3.org/2000/svg" width="auto" height="auto" fill="white" style="background-color:orange;" class="bi bi-person-square" viewBox="0 0 16 16">
     <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
  </svg>
    `;
 
  document.querySelectorAll('.ipsUserPhoto img, .ipsUserPhoto:is(img)').forEach(function(pfp) { // Loop through every profile image
    if (pfp.src.substr(pfp.src.length - 3) === "gif") {                                         // Does the filename end in gif?
        pfp.style.display = "none";                                                             // If so, hide it
        }                                                                                     
      }
    );
 
  document.querySelectorAll('.ipsUserPhoto').forEach(function(pfpcontainer) {                   // Now loop through every CONTAINER for the profile images
 
      var newImage = document.createElement('span');                                            // Create a new span element
 
      newImage.innerHTML = replacementImageData;                                                // Put the replacement image data in there
 
 
      pfpcontainer.appendChild(newImage);
 
    })
 
  document.querySelectorAll('#elCopyright').forEach(function(thePara) {                                                             
    var newP = document.createElement('p');
    newP.innerHTML = "<a href='https://pythonmegapixel.com' target='_blank'>Modified with a userscript by pythonmegapixel</a>"; // Adds some data to the bottom of the page to show that the userscript worked
    thePara.appendChild(newP);
  }
  );
  
}
 
if (CONF.rankingInformation==1||CONF.rankingInformation==2) {
   document.querySelectorAll('.cAuthorPane').forEach(function(panel) {
     var badge = panel.querySelector(".cAuthorPane_badge--rank");
     badge.style.height = 0;
     badge.removeAttribute("data-ipstooltip");
     
     if (CONF.rankingInformation==1) {
        var stats = panel.querySelector(".cAuthorPane_stats");
        var infolist = panel.querySelector(".cAuthorPane_info");
        var ranktext = document.createElement("li");
        ranktext.innerHTML = badge.getAttribute("title").replace(/\(\d+\/\d+\)/, "").replace(/Title:/, "");
        ranktext.style.color = "#888888"
        infolist.insertBefore(ranktext, stats);
     }
  
   }) 
}