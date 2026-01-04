// ==UserScript==
// @namespace    https://github.com/1LineAtaTime/TamperMonkey-Scripts
// @name         IndeedJunkFilter
// @version      2.0
// @description  Removes customizable job offers from Indeed by automatically hiding any job element that has any keywords from the filterList. Fork from https://greasyfork.org/en/scripts/465779-linkedinjunkfilter
// @author       1LineAtaTime
// @match        https://*.indeed.com/jobs*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=indeed.com
// @license      GPL-3.0

// @downloadURL https://update.greasyfork.org/scripts/498307/IndeedJunkFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/498307/IndeedJunkFilter.meta.js
// ==/UserScript==

// Customize this list. Job offers, where the preview contains one of these Strings will be removed.
const filterList = ["Visited", "Applied"] // "Cybercoders", "Actalent", "Microsoft"]

let $ = this.jQuery = jQuery.noConflict(true);

// case insensitive contains
// https://stackoverflow.com/a/8747204/9205894
$.expr[':'].icontains = function(a, i, m) {
  return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
};

function removeLi(str) {
    let list = $(`li.css-1ac2h1w:icontains('${str}')`)
    for (let li of list)
    {
        if (li.hidden == false)
        {
            console.log( "IndeedJunkFilter; filtered out: \t" + li.querySelector("h2.jobTitle").textContent + " - " + str) //li.querySelector(".jobTitle css-198pbd eu4oa1w0").text.trim() )
            li.hidden = true
        }
    }

    setTimeout(function() {
        removeLi(str);
    }, 100);
}

function removeLiTimer() {
    setTimeout(function() {
        for (let filter of filterList)
            removeLi(filter);
    }, 300);
}

removeLiTimer();
