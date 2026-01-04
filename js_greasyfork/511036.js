// ==UserScript==
// @name          Opensubtitles search with english subs
// @description   Redirects to english sub page so you won't get the error "You're trying to download all languages". Also sorts by ??? and focuses out of the search box.
// @namespace     opensubtitles_search_with_english_subs
// @license       Unlicense; http://unlicense.org/
// @version       1.3
// @grant         none
// @include       https://www.opensubtitles.org/en/ssearch/*
// @include       https://www.opensubtitles.org/en/ssearch/sublanguageid-all/*
// @icon          https://www.opensubtitles.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/511036/Opensubtitles%20search%20with%20english%20subs.user.js
// @updateURL https://update.greasyfork.org/scripts/511036/Opensubtitles%20search%20with%20english%20subs.meta.js
// ==/UserScript==

console.log("cur url: " + document.location)
let cur_url = document.location.toString()

let replaced = cur_url.replace("sublanguageid-all", 'sublanguageid-eng')
if (!replaced.match('sort-[0-9]+/asc-[0-9]+')) {
  replaced += "/sort-7/asc-0"
}

// https://www.opensubtitles.org/en/ssearch/sublanguageid-eng/idmovie-7533/sort-7/asc-0

console.log("cur url: " + cur_url.length + " " + cur_url)
console.log("replaced: " + replaced.length + " " + replaced)

if (cur_url != replaced) {
//  document.location = replaced
} else {
  console.log("tried to focus on first link")
  let links = document.getElementsByTagName('a')
  links[0].focus()
}