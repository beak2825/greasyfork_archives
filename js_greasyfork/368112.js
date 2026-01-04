// ==UserScript==
// @name        CSE Helper
// @description Adds 2 helper buttons to Google's CSE
// @namespace   azk
// @include     https://cse.google.com*
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/368112/CSE%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/368112/CSE%20Helper.meta.js
// ==/UserScript==

(function() {
  var buttonCss = {
  	'font-size': "1em",
    'width': "192px",
    'text-align': "center",
    'margin': "16px 8px",
    'padding': "10px",
    'display': "inline-block",
  };
  
  var openButton = $("<div/>").addClass("gsc-search-button gsc-search-button-v2").text("Open in tabs").css(buttonCss).on("click", function() {
    var links = $(".gsc-thumbnail-inside a.gs-title"); // .gsc-thumbnail-inside is a messy fix to avoid selecting duplicate links on the thumbnail images
    
    if(links.length) {
      var maxLinks = links.length < 6 ? links.length : 6;
      
      for(var i = 0; i < maxLinks; i++) {
        links[i].click();
      }
    }
  });
  
  var videoButton = $("<div/>").addClass("gsc-search-button gsc-search-button-v2").text("Search videos").css(buttonCss).on("click", function() {
    console.log("video clicked");
    var searchBar = $("#gsc-i-id1");
    console.log(searchBar.length);
    console.log(searchBar[0].value);
    if(searchBar.length && searchBar[0].value) {
      console.log("valid");
      window.open("https://www.google.com/search?q=" + encodeURI(searchBar[0].value) + "&tbm=vid&tbs=cc:1");
    }
  });
  
  $(".kd-appbar").after(openButton, videoButton);
})();