// ==UserScript==
// @name        primewire
// @namespace   manobastardo
// @include     http://www.primewire.ag/*
// @version     1
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description primewire remove sponsored links|click unique search result|click preferred links
// @downloadURL https://update.greasyfork.org/scripts/18404/primewire.user.js
// @updateURL https://update.greasyfork.org/scripts/18404/primewire.meta.js
// ==/UserScript==

// version block
var block = ['sponsor host', "promo host"];

$("table.movie_version").each(function(){
  var sample = $(this).find(".version_host").text().toLowerCase();
  var length = block.length;
  while(length--) {
     if (sample.indexOf(block[length])!=-1) {
       $(this).css("display", "none");
     }
  };  
});

// search result
var items = $(".index_item.index_item_ie");

if (items.length == 1) {
    window.location.assign(items.find("a").attr("href"));
}

// version preferred
var sites = [
    "filenuke",
    "sharesix",
    "bestreams",
    "gorillavid",
    "streamin",
    "vidzi",
    "vodlocker"
];

var versions = $('.movie_version');

for (var g = sites.length; g > 0; g--) {
  var site = sites[g];
  for (var i = versions.length; i > 0; i--) {
    var version = $(versions[i]).find('.version_host').text();
    console.log(version);
    if (version.indexOf(site) > -1) {
      window.location.assign($(versions[i]).find("a").attr("href"));
      i = g = -1;
    }
  }
}