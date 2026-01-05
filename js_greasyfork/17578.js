// ==UserScript==
// @name                WME Resource Links PA
// @namespace           https://greasyfork.org/users/32336
// @description         Adds links in WME to GIS resources which will open to the current WME view.
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             0.1
// @grant               none
// @copyright           2016 Joyriding
// @downloadURL https://update.greasyfork.org/scripts/17578/WME%20Resource%20Links%20PA.user.js
// @updateURL https://update.greasyfork.org/scripts/17578/WME%20Resource%20Links%20PA.meta.js
// ==/UserScript==

function  open_SL(server) {
    var center_lonlat=new OpenLayers.LonLat(Waze.map.center.lon,Waze.map.center.lat);
    center_lonlat.transform(new OpenLayers.Projection('EPSG:900913'),new OpenLayers.Projection('EPSG:4326'));
        
    var URL='https://www.arcgis.com/home/webmap/viewer.html?webmap=a271fc7b35ba4d9fb9ae1abf22125e57&center='+center_lonlat.lon+','+center_lonlat.lat+'&level='+((Waze.map.zoom)+12);
    
    window.open(URL,"_blank");
}
 
var WazePermalinkSL;
setTimeout(function() {
 
    WazePermalinkSL = document.getElementsByClassName('WazeControlPermalink')[0];
    var map_links = document.createElement('span');
 
    map_links.innerHTML = '<img src="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAASCAYAAACEnoQPAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAADKIAAAyiAHzzxfXAAAAB3RJTUUH4AMBEhAyuDuYWAAAAwtJREFUOMuV0MtLcnsUxvGv7i0ZdiGCnV2Jblsz2NDEslkRRDULahQ07Q+IoAiOTaMGDRo0bmYZ1qAIgqKBp8skOJWYJYegGxpSqBvN3+8dSL7nHZ41XPB5FuuxbGxsRDVN6+R/jBCCZDL5L9vb2/K/UygUZKFQkEKIP3ZSytIum83K3d1dqUopOTg4wDRNnE4noVAITdNwOBw0NTXR2trK1tYWAwMDfHx8UFtbi2ma2O12rADt7e2Ypkkmk8Fut6PrOna7HUVRKCsrQ1VVysvLqaqqYnBwkGw2C4AyOTn5l6ZpfH9/09zcTE9PDz6fj+/vb4QQVFZWYrFYqKiooKamhlgshq7rJBIJCAQCUkopM5lM6b+vry+ZTCallFK+vb1J0zRlLpeTiURC5vN5mc/nZTAYlNafBgOBAACxWIzj42OWlpZIJpP4/X6CwSA3Nzesra1xf3+PlBKAEs5kMry/v5PNZhFCUF1dzf7+Pm63GyklhmHQ3d2N2+2mUCgAoP7gzs5OotEo9fX1GIaBy+Xi7u4OwzCw2WxYLBYMwygiVf0TDw0NAfD8/Mz19TV9fX243W4ALi8vOTo6QlEUXl5eaGxsRFGU3xjg/f2d2dlZDg8PCYVCjIyM8PHxwdTUFE6nk7q6OlRVZWxsDE3TfuN0Os38/Dzn5+cIIUqBt7e3xONxfD4fHo8HXdfxer1cXV0VCysUCiwvLxOJRFhcXERKSVlZGQDhcBhFUXA4HESjUXZ2dojH41it1uLl9fV1VlZWmJubI5VKIYTg9PSUrq4uRkdHaWtro6WlhdfXV2ZmZnh5eWFhYaGII5EI/f39JBIJLi4ukFISDocZHh7m8fGRt7c3JiYmSKVSqKpKKpXCYrEU8dzcHOl0mnw+z9nZGScnJ4yPj+NyuXh4eGB1dZW9vT2EEDQ0NOD3+zFNs4g7OjpKBXk8Hnp7e/F6vdjtdqanp3G5XDw9PaGqKi6XC13XCYVCWDY3N/+uqqry/mBFUbDZbORyOYQQWK1WbDZbKVxKSS6XE5+fn//8AoPek0PhiDLQAAAAAElFTkSuQmCC" alt="PA SL" width="15" height="18" id="PA_SL_PL" title="PA SL Permalink" style="cursor: pointer; float: left; display: inline-block; margin: 2px 5px 0 3px;"> ';
    map_links.innerHTML += '<style>.olControlAttribution {display: none;}</style>';
 
    WazePermalinkSL.appendChild(map_links);
 
    document.getElementById("PA_SL_PL")
        .addEventListener("click", open_SL, false);
 
}, 5000);