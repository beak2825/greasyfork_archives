// ==UserScript==
// @name     Google Maps - GeoTool
// @description    add handy tool to Google Maps to export to GPX / CSV and many other maps (direction route -> markers / POIs)
// @version  1.1
// @grant    none
// @match    https://www.google.com/maps/*
// @match    https://www.google.de/maps/*
// @namespace https://greasyfork.org/users/767993
// @downloadURL https://update.greasyfork.org/scripts/430845/Google%20Maps%20-%20GeoTool.user.js
// @updateURL https://update.greasyfork.org/scripts/430845/Google%20Maps%20-%20GeoTool.meta.js
// ==/UserScript==


console.log("loaded1");

//document.addEventListener("DOMContentLoaded", function(event) { 
  console.log("loaded2");
  setInterval(function(){  // setTimeout
  	console.log("loaded3");
    //alert("Hello");
    document.getElementById("gb").innerHTML = "<a style='padding:1em;margin:0em;background-color:white;border:1px solid;' href=\"javascript:void(window.open('http://geo.klein-computing.de/gpx_tool.html#google:'+btoa(location.href)));\">GeoTool</a>";
  }, 1000); // 3000
//});
