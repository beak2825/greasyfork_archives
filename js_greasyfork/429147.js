// ==UserScript==
// @name         File Pursuit - Directory openy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Opens current directory, in new tab when click on open page
// @author       You
// @match        https://filepursuit.com/*
// @icon         https://www.google.com/s2/favicons?domain=filepursuit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429147/File%20Pursuit%20-%20Directory%20openy.user.js
// @updateURL https://update.greasyfork.org/scripts/429147/File%20Pursuit%20-%20Directory%20openy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let curUrl = document.location.href;
    const start = (curUrl.indexOf("link=") + 5);


  let link = ( curUrl.substr(start,curUrl.length))

  console.log(link)


    const originalText =document.querySelector("h3")




    addEl(originalText,`<span  class="rounded  py-2 px-3" style="margin:10px;"> <a href="${link}" target="_blank">Go to page!</a></span>`)


    function addEl(loc, ele) {
  loc.insertAdjacentHTML("afterend", ele);
}

})();