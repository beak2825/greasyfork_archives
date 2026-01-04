// ==UserScript==
// @name         MAM search on Goodreads
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.7.9
// @description  Add "Search Goodreads" button to MAM
// @author       Alistair1231
// @include      https://www.myanonamouse.net/t/*
// @downloadURL https://update.greasyfork.org/scripts/425714/MAM%20search%20on%20Goodreads.user.js
// @updateURL https://update.greasyfork.org/scripts/425714/MAM%20search%20on%20Goodreads.meta.js
// ==/UserScript==

// Thanks for https://greasyfork.org/en/users/78880-slengpung for the inspiration
// https://greasyfork.org/en/scripts/24678-goodreads-plus

var page = window.location.pathname.split('/')[1];

if(page === 't'){
	var bookTitle = document.getElementsByClassName("TorrentTitle")[0].innerHTML.trim();
    var author = document.getElementsByClassName("torDetRight torAuthors")[0].textContent;

    // this new regex matches names like 'A B Name', they have to be changed to 'AB Name'
    // https://regex101.com/r/MtDzfo/1 for more info on how it works
    var regex = /(\s|^)(.*\s)(\w)\s(\w)(\s.*)/gm;
    author = author.replace(regex,"$1$2$3$4$5");

    // thanks for @GardenShade for letting me know these symbols break names. I couldn't find an example so it wasn't tested.
    bookTitle = bookTitle.replace('%', '').replace("'", '%27');

      var mamSearchUrl = "https://www.goodreads.com/search?q=" + bookTitle + " " + author;
//    var dereferedUrl = "http://www.dereferer.org/?"+encodeURIComponent(mamSearchUrl);
//    var dereferedUrl = "http://de-ref.com/?"+mamSearchUrl;
//    var dereferedUrl = "https://url.rw/?"+encodeURIComponent(mamSearchUrl);
      var dereferedUrl = "https://r.mrd.ninja/"+encodeURIComponent(mamSearchUrl);


	// Add 'Search MAM' button
	var buttonUl  = document.getElementById("fInfo").childNodes;
	var mamButton = document.createElement("div");
	mamButton.innerHTML = '<div id="size" class="torDetInnerCon ">'+
        '<div class="torDetInnerTop ">Goodreads </div>'+
        '<div class="torDetInnerBottomSpan "><span>'+
        '<a id="mamLink" href="' + dereferedUrl + '" target="_blank" class="buttonBar"><input type="button" value="Search Goodreads" /></a>'+
        '</span></div>';
	buttonUl[0].appendChild(mamButton);
}