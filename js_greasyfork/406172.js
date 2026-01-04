// ==UserScript==
// @name     Imgur Noscript Fix
// @description Fixes viewing single-image non-video imgur posts when JS is disabled.
// @version  1
// @grant    none
// @match        https://imgur.com/*
// @namespace https://greasyfork.org/users/542272
// @downloadURL https://update.greasyfork.org/scripts/406172/Imgur%20Noscript%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/406172/Imgur%20Noscript%20Fix.meta.js
// ==/UserScript==

try
{
tags = document.getElementsByTagName("link");

for(let i = 0; i < tags.length; i++)
{
  if(tags[i].attributes['rel'].nodeValue == "image_src")
  {
    let newImage = document.createElement("img");
    newImage.src = tags[i].attributes['href'].nodeValue;
    document.getElementsByClassName("post-image")[0].appendChild(newImage);
    break;
  }
}
}
catch(e)
{
  console.log(e)
}