// ==UserScript==
// @name         LinkedInJunkFilter
// @namespace    dakes.de
// @version      1.0
// @description  Removes customizable job offers from LinkedIn
// @author       Daniel Ostertag
// @match        https://*.linkedin.com/jobs/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/465779/LinkedInJunkFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/465779/LinkedInJunkFilter.meta.js
// ==/UserScript==

// Customize this list. Job offers, where the preview contains one of these Strings will be removed.
const filterList = ["Promoted", ".NET", " Java ", "Java S", "Java-Entwickler", "Java Entwickler", "Java Dev", "Java/Kotlin", "CHECK24", "PHP", "Microsoft"]

let $ = this.jQuery = jQuery.noConflict(true);

// case insensitive contains
// https://stackoverflow.com/a/8747204/9205894
$.expr[':'].icontains = function(a, i, m) {
  return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
};

function removeLi(str) {
    let list = $(`li.ember-view:icontains('${str}')`)
    for (let li of list)
    {
        if (li.hidden == false)
        {
            console.log( "LinkedInJunkFilter; filtered out: \t" + li.querySelector(".job-card-list__title").text.trim() )
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
