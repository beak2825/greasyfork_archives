// ==UserScript==
// @name         TheTwitter
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try!
// @author       You
// @match        *://twitter.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436838/TheTwitter.user.js
// @updateURL https://update.greasyfork.org/scripts/436838/TheTwitter.meta.js
// ==/UserScript==

let i = 1;
function myLoop () {
   setTimeout(function () {
       try{
  let select = document.getElementsByClassName("css-1dbjc4n r-z6ln5t r-14lw9ot r-1867qdf r-1jgb5lz r-pm9dpa r-1ye8kvj r-1rnoaur r-494qqr r-13qz1uu")[0]
  select.getElementsByClassName("css-901oao r-1awozwy r-jwli3a r-6koalj r-18u37iz r-16y2uox r-37j5jr r-a023e6 r-b88u0q r-1777fci r-rjixqe r-bcqeeo r-q4m81j r-qvutc0")[0].click();
       }catch{};
      i++;
      if (i < 30) {
         myLoop();
      }
   }, 1000)
}

myLoop();