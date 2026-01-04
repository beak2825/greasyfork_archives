// ==UserScript==
// @name        Better RARBG search - search by size, descending; add quick search box
// @namespace   Violentmonkey Scripts
// @match       *://rarbg2021.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 2022-01-30, 16:12:23
// @downloadURL https://update.greasyfork.org/scripts/439381/Better%20RARBG%20search%20-%20search%20by%20size%2C%20descending%3B%20add%20quick%20search%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/439381/Better%20RARBG%20search%20-%20search%20by%20size%2C%20descending%3B%20add%20quick%20search%20box.meta.js
// ==/UserScript==



// add quick-search form so you can search from any page

$("form[action='/login']").ready(function () {
  loginTds = $("form[action='/login']").parents("tr").children()
  const quicksearchTd = loginTds[loginTds.length - 1]
  
  const formHtml = `
<form action="/torrents.php" method="get" style="width: 500px" id="quickSearchTorrent">
  <input x-webkit-speech="x-webkit-speech" type="text" name="search" id="quicksearchinput" style="width: 440px;" maxlength="60" value="" autocomplete="on" placeholder="Search Torrents" />
  <input type="hidden" name="order" value="size" />
  <input type="hidden" name="by" value="DESC" />
</form>
  `  
  quicksearchTd.innerHTML = formHtml


  const loc = window.location.toString()

  if(loc.startsWith("https://rarbg2021.org/torrents.php") || loc.startsWith("http://rarbg2021.org/torrents.php")) {
    $("form#searchTorrent").ready(function () {
      // improvements to search form
      $("form#searchTorrent").append("<input type='hidden' name='order' value='size' />") // sort by size
      $("form#searchTorrent").append("<input type='hidden' name='by' value='DESC' />") // sort descending

      // Note that "sort descending" is the default sorting order, so if the "by" variable is not included,
      // that's the sorting order you will get. RARBG actually had to make this broken on purpose with
      // extra code. They did it in order to get more ad revenue. This is such bullshit!!!!

      // showhideadvsearch('hide'); // hide the advanced search (category selection) so you don't have to scroll
      // note if you hide the advanced search, the category selection gets cleared, which SUCKS!
      // I might fix this at some point. RARBG explicitly clears the flags. I have disabled it for now.

      // scroll to the results. This has to happen after the quick search form is added and after the category selection gets hidden.
      $("table.lista2t").ready(function () {
        $("table.lista2t")[0].scrollIntoView()
      })
    })
  }
})