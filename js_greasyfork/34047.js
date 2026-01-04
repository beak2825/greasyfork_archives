// ==UserScript==
// @name        MMH and GHF Better Page Titles
// @namespace   nerevar009
// @include     http://mw.modhistory.com/*
// @include     http://download.fliggerty.com/*
// @description On Morrowind Modding History and Great House Fliggerty, this adds the mod name or sub-category name to the page title for better bookmarking. Also, sometimes mod pages are blank except the header and footer and the mod isn't downloadable, this adds a download link to the page when that happens.
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34047/MMH%20and%20GHF%20Better%20Page%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/34047/MMH%20and%20GHF%20Better%20Page%20Titles.meta.js
// ==/UserScript==

var contents = document.getElementById("contents");

// page type; 1 = mod page, 2 = sub-category page, 0 = any other page
var pagetype = 0;
if(/^\/download-\d+-\d+$/.test(location.pathname))
  pagetype = 1;
else if(/^\/download-\d+$|^\/download-p\d+-i.*-\d+$/.test(location.pathname))
  pagetype = 2;


// check if page content have loaded, if not, add download link in contents div in case it never loads
// and create a mutation observer to watch for it being loaded and run the addInfoToPageTitle function.
// if page content has loaded, just run the addInfoToPageTitle function
if(contents.childNodes.length == 1) {
  if(pagetype == 1) {
    var download = document.createElement("img");
    download.setAttribute("src", "images/download_button.png");
    download.setAttribute("alt", "Download");
    download.setAttribute("style", "float: right;");
    download.addEventListener("click", function(e) {
      e.preventDefault();
      location.href = "file.php?id=" + location.pathname.match(/^\/download-\d+-(\d+)$/)[1];
    })
    contents.appendChild(download);
  }

  var observer = new MutationObserver(function() {
    observer.disconnect();
    addInfoToPageTitle();
  });
  observer.observe(contents, {childList: true});

}
else addInfoToPageTitle();


// add mod name or sub-category name to page title
function addInfoToPageTitle() {
  var title = document.getElementsByClassName("cattitle");

  if(pagetype == 1)
    document.title = title[0].childNodes[0].nodeValue + " - " + document.title;
  else if(pagetype == 2)
    document.title = "Sub-Category: " + title[0].childNodes[1].nodeValue.trim() + " - " + document.title;
}

