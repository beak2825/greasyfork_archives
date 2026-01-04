// ==UserScript==
// @name        rym - charts helper
// @namespace   conquerist2@gmail.com
// @include     https://rateyourmusic.com/*
// @description prepare rym charts for copy and paste
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/404450/rym%20-%20charts%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/404450/rym%20-%20charts%20helper.meta.js
// ==/UserScript==
// 2020 06 01 v1.0 initial version


var releases = document.querySelectorAll('table.mbgen tbody tr');
var numReleases = releases.length;
console.log('hi!' + numReleases);
// Gesamtpreise im Ergebnis
for (var i = 0; i < numReleases; i++)
{
  secGenres = releases[i].querySelector('div.extra_metadata_sec_genres');
  if(!secGenres.innerHTML){
   console.log(i + ':  no sec genres'); 
   secGenres.innerHTML = '-';
  }
  
  descriptors = releases[i].querySelector('div.extra_metadata_descriptors');
  if(!descriptors.innerHTML){
   console.log(i + ':  no descriptors'); 
   descriptors.innerHTML = '-';
  }
  
  releaseTypeDiv = document.createElement('div');
  releaseTypeDiv.class = 'extra_metadata';
  releaseTypeDiv.innerHTML = releases[i].querySelector('div.chart_stats a').href.match(/\/release\/([A-Za-z]+)\//)[1];
  releases[i].querySelector('div.chart_detail_line3').prepend(releaseTypeDiv);
}