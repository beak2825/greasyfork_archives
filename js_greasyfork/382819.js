// ==UserScript==
// @name         Powerfap
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds full screen lightbox feature (with preloading) for imagefap galleries. Just click on image thumbnail from the category or homepage.
// @author       Alekc
// @license      MIT
// @copyright    2019, alekc (https://openuserjs.org/users/alekc)
// @match        https://www.imagefap.com/*
// @require      https://cdn.jsdelivr.net/npm/lightgallery.js@1.1.3/dist/js/lightgallery.js
// @require      https://cdn.jsdelivr.net/npm/lg-thumbnail.js@1.1.0/dist/lg-thumbnail.min.js
// @require      https://cdn.jsdelivr.net/npm/lg-zoom.js@1.0.1/dist/lg-zoom.min.js
// @require      https://cdn.jsdelivr.net/npm/lg-autoplay.js@1.0.0/dist/lg-autoplay.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382819/Powerfap.user.js
// @updateURL https://update.greasyfork.org/scripts/382819/Powerfap.meta.js
// ==/UserScript==

const head_inject = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sachinchoolur/lightgallery.js@master/dist/css/lightgallery.css">
<style>
#overlay {
position: fixed;
top: 0;
right: 0;
bottom: 0;
left: 0;
overflow: hidden;
z-index: 2000;
background-color: #000;
opacity: 0.7;
-webkit-animation: slbOverlay 0.5s;
-moz-animation: slbOverlay 0.5s;
animation: slbOverlay 0.5s;
}
.lds-ellipsis {
display: inline-block;
position: relative;
width: 64px;
height: 64px;
}
.lds-ellipsis div {
position: absolute;
top: 27px;
width: 11px;
height: 11px;
border-radius: 50%;
background: #fff;
animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
left: 6px;
animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
left: 6px;
animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
left: 26px;
animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
left: 45px;
animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
0% {
transform: scale(0);
}
100% {
transform: scale(1);
}
}
@keyframes lds-ellipsis3 {
0% {
transform: scale(1);
}
100% {
transform: scale(0);
}
}
@keyframes lds-ellipsis2 {
0% {
transform: translate(0, 0);
}
100% {
transform: translate(19px, 0);
}
}
#overlay {

display:none;
}
#overlay .lds-ellipsis {
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}
</style>
`;

const body_inject = `
<div id="fap-gal" style=""></div>
<div id='overlay'><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>
`;

var $ = window.$;
const galRegex = /\/photo\/(\d+)/m;
const homeRegex = /image\.php\?id=(\d+)/m;

var preloadedImages = [];
var resultCache = [];
var lightBox;
(function () {
  'use strict';

  //prepare requirements
  $("head").append(head_inject);
  $("body").append(body_inject);

  //link from category page
  $("img.gal_thumb").parent("a").click(function () {
    event.preventDefault();
    showOverlay();
    var match = galRegex.exec($(this).attr("href"));
    if (match === null) {
      alert("can't find photo id");
      return;
    }

    var galId = $(this).closest("tr[valign='top']").prev().attr("id");
    var photoId = match[1];
    preRun(photoId, galId);
  });

  $('a[href*="image.php?id="]').click(function () {
    event.preventDefault();
    showOverlay();
    var match = homeRegex.exec($(this).attr("href"));
    if (match === null) {
      alert("can't find photo id");
      return;
    }

    var galId = $(this).closest("tr:not([bgcolor])").prev().attr("id");
    var photoId = match[1];
    preRun(photoId, galId);
  });
  //
})();

function showOverlay() {
  $("#overlay").show();
}

function hideOverlay() {
  $("#overlay").hide();
}

function preRun(photoId, galId) {
  var key = calculateCacheKey(photoId, galId);
  if (typeof (resultCache[key]) !== "undefined") {
    showGallery(resultCache[key]);
    return;
  }
  run(photoId, galId, []);
}

function calculateCacheKey(photoId, galId) {
  return galId;
}

function run(photoId, galId, result) {
  var url = "https://www.imagefap.com/photo/" + photoId + "/?gid=" + galId + "&idx=" + result.length + "&partial=true";
  console.log(url);
  $.ajax({
    url: url,
    type: "GET",
    dataType: "html",
    success: function (data) {
      var newLinks = [];
      $(data).find("a").each(function () {
        var href = $(this).attr("href");
        var thumb = $(this).find("img").attr("src");
        newLinks.push({
          src: href,
          thumb: thumb
        });
      });
      result = result.concat(newLinks);
      if (newLinks.length === 0 || newLinks.length < 24) {
        resultCache[calculateCacheKey(photoId, galId)] = result;
        showGallery(result);
        return;
      }
      run(photoId, galId, result);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Error: " + textStatus + " (" + errorThrown + ")");
      hideOverlay();
    }
  });
}

function preloadImage(href) {
  if (href === 'undefined' || typeof (preloadedImages[href]) !== 'undefined') {
    return;
  }
  preloadedImages[href] = new Image();
  preloadedImages[href].src = href;
}

function showGallery(items) {
  hideOverlay();
  var el = document.getElementById("fap-gal");
  //destroy on closure
  el.addEventListener('onCloseAfter', function (e) {
    window.lgData[$(this).attr('lg-uid')].destroy(true);
  }, false);

  //slide change
  /*
   el.addEventListener('onAfterSlide', function(event){
       items = window.lgData[$(this).attr('lg-uid')].items;
       for (var i = event.detail.index + 1; i<items.length && i < event.detail.index + 6; i++){
           preloadImage(items[i].src);
       }
      //event.detail.index
  }, false);
  */

  lightGallery(el, {
    dynamic: true,
    dynamicEl: items,
    preload: 3,
  });
}

function injectJs(link) {
  var scr = document.createElement('script');
  scr.type = "text/javascript";
  scr.src = link;
  document.getElementsByTagName('head')[0].appendChild(scr)
}
