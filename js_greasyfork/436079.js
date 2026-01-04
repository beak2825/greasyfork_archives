// ==UserScript==
// @name        replace_directly_link
// @namespace   Violentmonkey Scripts
// @match       *://*oschina*/*
// @grant       none
// @version     1.0
// @author      -
// @description 11/19/2021, 9:05:58 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436079/replace_directly_link.user.js
// @updateURL https://update.greasyfork.org/scripts/436079/replace_directly_link.meta.js
// ==/UserScript==

(async () => {
  console.info(`oschina_replace_directly_link`);
  let count = 0;
  for(const link of document.querySelectorAll('a')) {
    if(link.href.startsWith('https://www.oschina.net/action/GoToLink?url=')) {
      count ++;
      link.href=new URL(link).searchParams.get('url') 
    } 
  }
  console.info(`oschina_replace_directly_link processed ${count} links`);
})()