// ==UserScript==
// @name        Return to old KYM (KnowYourMeme) design
// @namespace   https://greasyfork.org/en/users/1436613-gosha305
// @match       https://knowyourmeme.com/*
// @version     1.2
// @author      gosha305
// @license     MIT
// @description Removes the KnowYourMeme redesign
// @downloadURL https://update.greasyfork.org/scripts/528491/Return%20to%20old%20KYM%20%28KnowYourMeme%29%20design.user.js
// @updateURL https://update.greasyfork.org/scripts/528491/Return%20to%20old%20KYM%20%28KnowYourMeme%29%20design.meta.js
// ==/UserScript==

if (!document.cookie.includes("old_design=true")){
  document.cookie = "old_design=true; path=/; domain=.knowyourmeme.com; expires=Fri, 31 Dec 9999 23:59:59 GMT";
  location.reload();
}

//fix for main page feed images covering other elements
const imageFix = document.createElement("style");
imageFix.innerHTML = ".newsfeed_photo { width: 100%;}";
document.head.appendChild(imageFix);

//fix for NSFW image pages showing a buggy version of the NSFW warning cover instead of the actual image
const img = document.querySelector(".centered_photo.nsfw-img");
if (img){
  img.setAttribute("src",img.parentElement.parentElement.href);
}