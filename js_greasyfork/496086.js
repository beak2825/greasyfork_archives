// ==UserScript==
// @name Netzflix view
// @description declutters netzkino.de
// @namespace Violentmonkey Scripts
// @version 3
// @include https://www.netzkino.de/*
// @exclude https://www.netzkino.de/details*
// @exclude https://www.netzkino.de/search*
// @exclude https://www.netzkino.de/filme*
// @exclude https://www.netzkino.de/watch*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/496086/Netzflix%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/496086/Netzflix%20view.meta.js
// ==/UserScript==

// adjust this to your needs:
// 2-3: default, for smaller resolutions
// 4 and 5: 1920x1080/full screen
// 6: ...
var columns = 5;
// 

// from https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitforit(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    var observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

waitforit('.webSlider').then((elm) => {


$   = function(_) {return document.getElementById(_)}
$tn = function(_) {return document.getElementsByTagName(_)}
$cn = function(_) {return document.getElementsByClassName(_)}
$qa = function(_) {return document.querySelectorAll(_)}
$qs = function(_) {return document.querySelector(_)}


//if (!($qs(".css-175oi2r.r-1awozwy.r-18u37iz.r-1qhn6m8.r-i023vh")) {
$tn("body")[0].style.display = "none";
$tn("body")[0].style.visibility = "hidden";
//}


  
    var scriptname = "Netzflix view";
      
      var nfsvg = '<span><svg height="64" width="256" viewBox="0 0 512 128"><path d="m17.4 9.4v100.8c10.9-3.1 22.5-6 34.7-8.6 0-.1.1-.2.3-.4.4-.4 1-.4 1.2-.4.3.1.4.1.5.2s.2.1.3.2c52.9-11.1 117.4-17.6 187-17.6 23.4 0 46.2.7 68.1 2.1.3-4.2.1-8.7.5-13 0-.1-.1-.1.1-.4.3-.9.8-1 1.2-1 2.9-.2 6.9-1 9.3.6 1.6 4.7-.4 9.8 1.5 14.7 48.5 3.7 92.7 10.6 129.9 20 0-.1.1-.1.1-.2.1-.1.1-.2.3-.3.1-.1.3-.3 1-.3.6 0 .8.2 1 .4.2.1.3.3.4.4.2.2.4.5.5.8 15.2 4 29.2 8.3 41.7 13l-27-60.2 23-46.9-4-3.9h-35.1c-.1.3-.2.4-.3.7-.5 1-.9 1.8-1.2 2.3-.2.3-.3.6-.6.8-.2.2-.4.6-1.3.6-.5 0-.6-.1-.7-.1-.1-.1-.2-.2-.2-.2-.2-.1-.3-.2-.4-.3-.3-.3-.7-.6-1.1-.9-.8-.8-1.9-1.8-3-2.9h-65.7c-.1.5-.1 1.1-.2 1.9-.2 3.5-.2 10.5-.2 25.5-.1 11.1-.1 17.8-.2 21.8v4.1c-.1.4-.1.7-.1.9-.1.2-.1.3-.2.5s-.1.3-.4.6c-.3.2-1 .4-1.4.2-.1 0-.1 0-.1 0-.1 0-.4-.1-.6-.1-.5-.1-1.1-.1-1.8-.2-2.7-.3-5.9-.7-8.2-.9-.4-.1-.9-.1-1.2-.3-.2 0-.4-.1-.6-.2s-.3-.2-.4-.4c-.2-.1-.5-.5-.5-1 0-.1 0-2.6 0-6.6s0-9.6 0-15.6c-.1-11.8-.1-17.7-.3-20.8 0-1.6-.2-2.4-.3-2.9s-.2-.6-.5-1.1c-.1-.1-.3-.3-.5-.5-.3-.3-.6-.7-1.1-1.2-.9-.9-2.1-2.1-3.3-3.3-.1-.1-.3-.2-.4-.4h-294.2c-.6 2.3 0 5.4-1.9 6.8-3.1-1.1-4.9-4.4-7.3-6.8zm141.9 30.6c4.4 2.1 5.6 30.4 2.3 33.3-.8.8-1.8 1.3-2.7 1.6-1.9-.3-8.7-6.5-8.2-9.2 7.1-2.9 4-24.1 8.6-25.7zm55.4 1.1c1.9-.1 3.6.2 4.8 1.3-.1 3.4-12.5 21.3-16 22-5.1-5.6-2.8-14.5-2-21.5 3.6.6 8.9-1.5 13.2-1.8zm208.1 5.4h.1c.7.1.8.3 1 .4.4.3.5.5.6.7.2.2.4.5.6.8.3.7.7 1.5 1.2 2.3.4.8.7 1.6 1 2.2.2.4.3.7.4 1s.2.4.2.9-.1.7-.1.9c-.1.2-.2.5-.4.7-.2.5-.5 1.1-.9 1.7-.3.5-.6 1-.9 1.5-.2.3-.4.8-.3.7-.3.8-.7 1.2-1.4 1.6l-.6.4-1.9 1.3-.2-2.3-.2-1.5c-.2-2.2-.2-7.4 0-10.1.1-1 .1-1.4.3-2.1.1-.2.2-.5.5-.7.2-.3.6-.4 1-.4zm-156.6 3.1c2.3 0 4.2 2.9 4.2 6.5v.1c0 3.6-1.9 6.6-4.2 6.6s-4.1-3-4.1-6.6 1.8-6.6 4.1-6.6z" fill="#ee5a29"/><path d="m490 125.3c-.3-.1-2.5-.5-4.9-1-2.3-.5-5.7-1.1-7.6-1.5-6.4-1.2-10.5-2.1-11.5-2.6-.6-.3-3.1-2.6-5.8-5.3-3.7-3.7-4.9-5-5.5-6.2-.4-.8-.7-1.6-.7-1.7 0-.2-.6-.6-.9-.6-.1 0-.5.9-1 2-1.2 2.6-2.9 5.1-4 5.9-1.9 1.5-4.8 2-7.8 1.4-.6-.1-5.3-1-10.4-1.9-6.5-1.2-10-1.9-11.9-2.5-2.1-.8-2.7-.9-3.8-.7-1 .1-3-.2-7.6-.9-14.9-2.4-16.2-2.7-17.9-4.2-1.2-1-1.6-1-3.7-.2-1.2.5-3.5.4-6.9-.1-.8-.1-3.2-.5-5.2-.8-2.1-.2-5-.6-6.5-.8-3.1-.5-18.2-2.4-24.9-3.2-9.3-1.1-8.5-.7-14.7-6.8-3.7-3.7-5.2-5.4-5.7-6.3-.8-1.6-1.2-5.3-1-10.5 0-2.6-.1-4.2-.2-4.4-.3-.2-8.5-.4-8.8-.2-.1.1-.2 3.7-.3 7.9 0 4.2-.2 8.4-.3 9.2-.5 2.9-2.5 5.6-5.1 6.7-1.4.5-1.9.6-5.6.5-4.8 0-14.1-.5-17.4-.9-1.3-.1-2.7-.4-3.2-.7-1.1-.6-1.8-.6-3.1-.1-1.3.6-9.8.8-37.7.9-23.4.1-23.1.1-24.9-1-.9-.5-5.7-5.3-7.2-7-1.6-1.9-1.9-1.8-2.3 1s-.9 4-2.4 5.7c-1.4 1.5-2.7 2.2-5.4 2.6-1.7.3-10 1.1-18.8 1.8-1.8.1-4.3-.3-5.4-.9-1-.6-9.1-8.6-10.3-10.2-.4-.5-.9-1-1-1s-.2 1.8-.2 4.1c-.1 4-.1 4.1-.9 5.7-.9 1.7-2.2 3.1-3.9 4-1.7.8-3.3 1.1-21.8 3.7-5 .7-11.8 1.7-15.1 2.1-9.6 1.4-12 1.3-14.6-.8-1.3-1-1.8-1-2.2 0-.2.4-.9 1.4-1.7 2.1-2.1 2-1.8 1.9-20 5.1-11.2 2-12.4 2-14.7 1-1.7-.9-10.4-9.6-11.1-11.2-.4-1-1.1-1.6-1.4-1.2-.1 0-.2 2.7-.3 5.8-.2 5.4-.2 5.8-.8 6.9-1.3 2.7-3.4 4.3-6.4 5-2 .5-9.4 2-13.9 2.8-4.3.7-5.6.8-7.5.2-1.2-.3-1.8-.8-6.3-5.3-6.1-5.9-6.6-6.6-6.9-10.5-.2-3.1-.2-84 0-91.8.2-6.1.3-6.7 2.6-9 2.6-2.6 3-2.7 18.9-2.7 13.2 0 14.9.1 16.5 1.1 1.6.9 9.8 9.3 10.6 10.8.4.8.9 1.4 1 1.4.4.1.6-1 .6-3.2.1-2.9.4-4.4 1.6-6.1 1.3-1.9 3.1-3.2 5.3-3.6 2.5-.6 18.3-.6 20.7-.1 2.1.5 4.2 1.8 5 3.1.3.4.6.8.8.8.1 0 .7-.5 1.2-1.1 1.4-1.6 2.6-2.3 4.6-2.8 1.4-.3 4.6-.3 23.7-.2 12.1.1 22.7.1 23.5.1.9 0 27.5 0 59.3-.1 62.2-.1 60.7-.1 62.3 1.1.8.7.9.7 2.3-.1 2.1-1.1 3.2-1.1 25.1-1.1 22.6 0 23.6.1 25.2 1.3 1.1.8 1.6.8 2.8 0 1.8-1.2 3.1-1.3 14.2-1.3 10.8 0 11.7.1 13.7 1.3 1.3.7 9.5 8.8 10.5 10.3.4.6.8 1.3.9 1.8.1.4.3 10.9.3 23.4.2 19.9.2 22.8.6 22.9.3.2 2.1.4 10.2 1.3 1.4.2 2.6.2 2.7.2 0-.1.1-12.2.1-26.9.1-29.8 0-28.1 1.8-30.5.6-.7 1.5-1.7 2.1-2.1 2.1-1.5 2.4-1.6 13.7-1.7 10.4 0 12.8.1 14.4.9.6.3.8.3 1.4 0 1.6-.8 3.3-.9 14.3-.9 11.6 0 13.7.1 15.3 1.2.7.4 2.8 2.4 7.6 7.3 1.1 1.1 2.1 2 2.3 1.9.2 0 .9-1.2 1.5-2.7 2-4.7 4.1-6.9 7.1-7.4 2.5-.5 23.8-.3 25.7 0 1.8.5 3.5 1.4 4.6 2.6.4.4 2.5 2.5 4.6 4.6 2 2.1 3.9 4.2 4.1 4.6 1 2 1.3 5 .6 6.9-.4 1.3-2.3 5.5-4 9-.6 1.3-1.5 3.2-2 4.2-2.3 5.1-4.1 8.9-5.5 11.9-.7 1.4-1.6 3.3-2 4.3-.5.9-1.7 3.5-2.8 5.7-3.1 6.5-4.3 9.2-4.3 9.5s1.4 3.4 5.2 11.2c1.4 2.9 2.5 5.3 2.5 5.3s1.3 2.7 2.9 6 3.7 7.6 4.6 9.6 2.6 5.5 3.6 7.7c3.8 7.7 4.4 9.7 3.9 11.9-.4 1.9-1.2 3.4-2.6 4.8-1.9 1.8-3.3 2.5-5.8 2.5-1.1.1-2.2 0-2.6 0zm-5.7-16.8c-6.3-14-13.5-29-19.9-41.8-2.6-5.3-3.2-6.9-3.2-7.6 5.1-14.6 16.1-30.5 21.6-46.9v-.5h-10.5c-5.8 0-10.7 0-10.9.1-4 8.6-7.8 18-11.5 26.2-.3.8-.7 1.4-.9 1.4-.3 0-.6-.7-2.4-4.8-.6-1.6-1.5-3.5-1.8-4.3-.9-1.8-3.4-7.4-3.9-8.5-.2-.4-1.1-2.3-2-4.3-.8-1.9-1.7-3.9-1.9-4.4-.1-.5-.5-1.1-.7-1.2-.4-.3-2.8-.3-10.6-.3-8.8.1-10.2.1-10.2.5 0 .2.9 1.9 1.9 3.8 2 3.7 10.7 20.9 16.3 32.1 2.4 4.8 3.3 6.9 3.2 7.3-.1.3-1.2 2.4-2.5 4.6-5.7 10.3-11.9 21-17.7 30.8-2.8 4.7-2.8 4.7-2.4 5.1 6.6 1.4 13.1 2.3 19.8 3.6 1.2.3 1.5.1 2.3-1.5.3-.6 2.2-4.2 4.2-8 2.1-3.8 4.7-8.8 5.9-11.1s2.3-4.2 2.5-4.2 1.2 1.9 2.4 4.6c4.3 8.8 7 17.2 11.6 25.5.3.2 1 .5 1.6.6s2.1.4 3.4.6c1.3.3 3.6.7 5.1 1s4.2.8 5.9 1.1c3.2.7 5.3.8 5.3.5zm-448-5.5c2-18.8-.9-36.5-.4-63 .2-.9.7-.4 1.6 1.9 7 16.5 14.7 34.1 21.5 49.6 3.3 7.3 2.6 6.7 6.3 6 6.9-1.4 14.1-2.1 21.1-3.6.5-.2.5-.4.5-41.1 0-22.4-.1-40.9-.2-41-5.8-.2-10.4-.1-16.5-.1-.1 0-.2 9.5-.2 21 0 19.4.2 29 .7 35.3.1 1.8.1 2.4-.2 2.4-4.9-9.6-8.7-18.9-13.2-29.2-2.6-5.8-10.1-23.4-11.7-27.4-.3-.8-.7-1.6-.9-1.8-.2-.3-2.3-.3-12.5-.3-6.9 0-12.2.1-12.3.2-.2.3-.2 93.4 0 93.7 4.2-.1 10.4-1.4 16.4-2.6zm369.4-8.9c.2-.3.1-82.3-.1-82.4-.1-.1-4.4-.1-9.6 0l-9.3.1v39.5c.1 21.7.1 39.6.2 39.8s.5.3 1 .3 3.2.4 6 .9c2.9.5 6 1 6.9 1.2.9.1 2.2.3 3 .5 1.8.5 1.7.5 1.9.1zm-295.1-4.2c11.6-1.8 21.8-2.9 33.1-4.6l.6-.1v-7.6c0-5.7-.1-7.7-.4-8-.2-.3-.6-.3-3.1 0-5.6.6-10.6 1-16.2 1.7-1.5.2-2.8.3-2.9.2s-.2-3.2-.2-7.1v-7l.6-.2c.4-.2 1.4-.3 2.2-.3 5.5-.1 10.1-.9 15.7-1 2.7 0 2.5.8 2.5-8 0-4.2-.1-7.7-.2-7.8-7.2 0-12.9.7-20.6.6-.1-.1-.2-2.8-.1-5.9v-5.7c7.7-.4 14.9-.5 22.5-.5v-8.4-8.4h-21-21l.1 1.8v39.5l.1 37.8h.8c.4 0 3.8-.4 7.5-1zm264.8-8.7c.1-4.5 0-8.2-.1-8.3-.2-.3-3.6-.7-13.9-1.7-1.4-.2-4.1-.4-6.1-.7-2-.2-4.4-.5-5.3-.5l-1.6-.2-.1-29c-.1-15.9-.2-29-.2-29.1-.1 0-4.3 0-9.5 0l-9.5.1v35.7l-.1 35.7.6.2c.3.1 3.2.5 6.4.9 11.8 1.3 19.4 2.3 27.9 3.5 1.4.2 3.6.5 4.9.6 1.3.2 3.2.5 4.2.6 1 .2 2 .4 2.1.3.2 0 .3-3 .3-8.1zm-198.3.6c3.1-.2 6.7-.5 8.1-.7l2.6-.3v-25.9c0-17.8 0-26.1.2-26.5 5.6-1.1 8.8-.2 16.4-.6l.6-.2v-7.6c0-4.2-.1-7.8-.2-8-.2-.3-5.7-.3-26.8-.3l-26.6.1.1 8.3c0 4.5.1 8.3.2 8.4 5.9.2 10.5-.3 16.7-.1.3.1.4 5.3.4 27.1v27l1.4-.1c.8-.1 3.9-.3 6.9-.6zm117.4-14 .1-12.5 3.2.1c1.7 0 6.3.2 10.1.3 3.9.2 7.3.2 7.5.1.3-.1.4-1 .3-7.3l-.1-7.2-1.7-.2c-1-.1-5.7-.3-10.5-.4l-8.8-.1v-6.5l-.1-6.4 10.6.1c5.8.1 11 .1 11.5 0l.9-.1v-7.6c0-4.2-.1-7.8-.1-8-.2-.4-2.2-.4-20.6-.4-11.3 0-20.7 0-20.8.1-.3.1-.4 6-.3 33.8 0 18.8.1 33.7.2 33.8s4 .3 8.6.5 8.4.4 8.5.4c.1.1.4.1.7.1l.7-.1zm-63.5 11.4c4.6-.2 14.3-.3 21.4-.3h13.1v-6.8c0-3.7-.1-6.9-.2-7.1-.2-.3-3.5-.3-15.4-.3s-15.1-.1-15.1-.3c0-.5.9-1.8 3.7-5.5 1.3-1.6 3.3-4.2 4.4-5.7 4.3-5.8 5.3-7.1 6.3-8.4 1.1-1.4 8-10.5 10.4-13.7.8-1.1 2.1-2.9 3-4 2.2-2.9 2.2-2.8 2.2-9.1 0-3.1-.1-5.7-.2-5.9-.1-.4-2.7-.4-26.6-.4-17.6 0-26.5.1-26.6.2-.3.3-.2 15 .1 15.4.2.2 27.2.2 27.5 0s1.8.2 1.7.5c0 .1-.9 1.4-2 2.9-3.4 4.4-10.5 13.9-13.3 17.7-3.8 5.2-5.4 7.4-6.6 9-3.6 4.6-6.8 9-7.5 10.1l-.8 1.3v5.3c0 3.3.1 5.3.3 5.4.4.1 11.2-.1 20.2-.3zm-71-16.3c.1-5.2.1-11.2 0-13.5-.1-3.8-.2-4.1-.6-4.1s-.4.4-.5 9.1c-.1 10-.3 11.8-1.5 13.4-.7 1-.6 1.7.3 2.6.4.4.9 1 1.3 1.4.3.3.6.6.7.5.1 0 .3-4.3.3-9.4zm264.4-3.1c.9-1.7 1.9-3.5 2.2-4l.5-1.1-1-2c-.6-1.1-1.5-3-2.1-4.3-1.2-2.7-1.4-3-1.8-2.5-.2.4-.2 16.4 0 16.9.3.4.7-.2 2.2-3zm-219 .9c1.1-1.6 7.4-10.1 9.5-12.9 1.1-1.4 2.2-2.9 2.4-3.3.5-.8.5-.8.1-1-.3-.1-1.3 0-2.2.1-1 .2-3.8.4-6.3.5-4.4.2-4.4.2-4.7.8-.1.3-.2 4.2-.2 8.7 0 8.9 0 9.1 1.4 7.1zm61.6-5.7c0-.7-.2-.8-.8-.6-.4.3-.6 1-.3 1.4.3.2 1.1-.4 1.1-.8z" fill="#000100"/><path d="m370-96.6h2.1v.4h-2.1z" fill="#800000"/></svg></span>';
      // var favicon = 'data:image/svg+xml,%3Csvg width="32" height="32" version="1.1" xmlns="http://www.w3.org/2000/svg" desc="Created with imagetracer.js version 1.2.6" %3E%3Cpath fill="rgb(0,0,0)" stroke="rgb(0,0,0)" stroke-width="1" opacity="1" d="M 0 0 L 32 0 L 32 32 L 0 32 L 0 0 Z M 6 3 L 3 6 L 3 27 L 6 29 L 26 29 L 28 28 L 29 26 L 29 6 L 27 3 L 6 3 Z " /%3E%3Cpath fill="rgb(127,0,0)" stroke="rgb(127,0,0)" stroke-width="1" opacity="1" d="M 5.5 3 L 26.5 3 L 29 5.5 L 29 25.5 L 28 28 L 25.5 29 L 5.5 29 L 3 26.5 L 3 5.5 L 5.5 3 Z M 16 10 L 12 12 L 12 14 L 15 15 L 15 23 L 18 23 L 18 11 L 16 10 Z " /%3E%3Cpath fill="rgb(127,127,127)" stroke="rgb(127,127,127)" stroke-width="1" opacity="1" d="M 15.5 10 L 14.5 12 L 15.5 10 Z " /%3E%3Cpath fill="rgb(127,127,127)" stroke="rgb(127,127,127)" stroke-width="1" opacity="1" d="M 17.5 10 L 18 23 L 15 22.5 L 17 22 L 17.5 10 Z " /%3E%3Cpath fill="rgb(127,127,127)" stroke="rgb(127,127,127)" stroke-width="1" opacity="1" d="M 12.5 12 L 15 13.5 L 12 14 L 12.5 12 Z " /%3E%3Cpath fill="rgb(127,127,127)" stroke="rgb(127,127,127)" stroke-width="1" opacity="1" d="M 2.5 28 L 3.5 30 L 2.5 28 Z " /%3E%3Cpath fill="rgb(254,254,254)" stroke="rgb(254,254,254)" stroke-width="1" opacity="1" d="M 16.5 10 L 17 22 L 15 22 L 15 13.5 L 13.5 13 L 13.5 12 L 16.5 10 Z " /%3E%3C/svg%3E';
     //  var favicon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='16' width='16'%3E%3Crect fill='%23800000' height='14' ry='1' width='14' x='1' y='1'/%3E%3Cpath d='m9.58 11.32h-1.17v-4.39c-.42.4-.92.69-1.5.88v-1.05c.31-.1.63-.29.99-.57s.6-.6.73-.97h.95z' fill='%237f7f7f'/%3E%3Cpath d='m9.08 10.82h-1.17v-4.39c-.42.4-.92.69-1.5.88v-1.05c.31-.1.63-.29.99-.57s.6-.6.73-.97h.95z' fill='%23fff'/%3E%3C/svg%3E%0A"; 
      var favicon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='16' width='16'%3E%3Crect fill='%237f0000' height='14' ry='1' stroke='%23fff' stroke-width='.2' width='14' x='1' y='1'/%3E%3Cpath d='m9.2 10.8h-1.2v-4.4c-.4.4-.9.7-1.5.9v-1c.3-.1.6-.3 1-.6s.6-.6.7-1h1z' fill='%23fff' stroke='%23000' stroke-width='.2'/%3E%3Cpath d='m13.5 8c0 3-2.5 5.5-5.5 5.5s-5.5-2.5-5.5-5.5 2.5-5.5 5.5-5.5 5.5 2.5 5.5 5.5z' fill='none' stroke='%237f7f7f' stroke-width='.3'/%3E%3C/svg%3E";
      var imdbsvg = '<span><svg height="20" width="32" viewBox="0 5 64 16"><rect fill="#f5c518" height="32" rx="4" width="64"/><path d="m8 7v18h5v-18zm7 0v18h4.25v-11.875l1.78125 11.875h3.03125l1.6875-12.15625.03125 12.15625h4.21875v-18h-6.3125l-1.125 8.40625-.71875-4.5625c-.2015908-1.46493163-.3773656-2.75199879-.5625-3.84375zm17 0v18h7.8125c1.7671031 0 3.1875-1.43311 3.1875-3.1875v-11.625c0-1.75666009-1.4227064-3.1875-3.1875-3.1875zm13 0v17.78125h4.46875l.3125-1.125c.5884049.8053879 1.5578038 1.34375 2.65625 1.34375h.3125c1.7956636 0 3.25-1.3919253 3.25-3.125v-7.21875c0-1.73219176-1.4548082-3.15625-3.25-3.15625h-.3125c-1.0747565 0-2.0380781.51087183-2.65625 1.28125v-5.78125zm-8.3125 3.09375c.5518634 0 .957924.04905988 1.15625.15625.2026373.10719012.3189514.26973974.375.5s.09375.74864909.09375 1.5625v6.96875c0 1.1989413-.0818541 1.9487897-.25 2.21875-.1681459.2739303-.6463678.40625-1.375.40625zm13.84375 4.1875c.2639059 0 .6557478.1308602.75.34375.0942522.21288983.125.70151132.125 1.40625v4.25c0 .8038426-.0420582 1.3220307-.125 1.53125-.0829419.2092193-.4785537.3125-.75.3125-.2714464 0-.6595179-.1069512-.75-.3125v-1.40625-4.375-1.4375c.0791718-.18719623.4860938-.3125.75-.3125z"/></svg></span>',
      imdbprefix = '<a href="https://www.imdb.com/find/?q=',
      imdbsuffix = '" target="somenewwindow">' + imdbsvg + '</a> ';
      
      var free = 0;
      var exclude = new Array();
      
      /*
      for (var i = 0, l = document.getElementsByClassName("css-175oi2r").length; i < l; ++i) {

        if (document.getElementsByClassName("css-175oi2r")[i].href != undefined) {
          if (document.getElementsByClassName("css-175oi2r")[i].getElementsByClassName("r-fdjqy7")[0]) {
            exclude[i] = document.getElementsByClassName("css-175oi2r")[i].href;
            //console.log("excluding: " + exclude[i])
          }
          
        }

      }
      
      var filtered = exclude.filter(function (el) {
        return el != null;
      });
      
      exclude = filtered;
      
      //console.log(exclude.length)

      */

      var debug = 1;

      var mediathek, mode = "";

      if (debug != 1) {
        console.log = function() {};
        console.warn = function() {};
        console.err = function() {};
      }


      function writetable(preparing) {
        var allrows = "";
        var previouslink = "";
        var mynewctr = 0;
        
        for (var i = 0, l = preparing.length; i < l; ++i) {
          
        /*
        preparing[i].fulltitle = fulltitle;
        preparing[i].link = "https://www.netzkino.de/filme/" + slug;
        preparing[i].img = widescreen;
        preparing[i].runtime = runtimeInSeconds;
        preparing[i].relyear = productionYear;
        preparing[i].director = director;
        preparing[i].plusorwhat = plusorwhat;
        
        */
          
          // fulltitle + "|https://www.netzkino.de/filme/" + slug + "|" + widescreen + "|" + runtimeInSeconds + "|" + productionYear + "|" + director + "|" + plusorwhat;

          //if (prepared[i].indexOf("NICHTKOSTENLOS") == -1) {
            
            // var filmset = prepared[i].split("|");
            
            free++;
            // name + "|" + url + "|" + image + "|" + duration + "|" + director;

            var link = '<a href="' + preparing[i].link + '">';
            var durationdisplay, releaseyear = "";
          /*
            // console.log("|"+preparing[i].plusorwhat+"|");
            if (preparing[i].plusorwhat == "plus") {
              plusstate = " [+] ";
            }
          

          
            if (preparing[i].director != "-") {
              directordisplay = preparing[i].director;
            }
          */
          
            if  ((preparing[i].relyear == 0) || (preparing[i].relyear == null)) {
              releaseyear = "2005 (geschätzt), ";
            } else { // preparing[0].relyear
              releaseyear = preparing[i].relyear + ", ";
            }
            
            if (preparing[i].runtime == null) {
              durationdisplay =  "90 Min. (geschätzt)";
            } else  {
              durationdisplay = Math.floor(preparing[i].runtime / 60) + " Min.";
              // durationdisplay = preparing[i].runtime + " Min., ";
            }

            // var ctr = i + 1; // '<br />' + ctr +
            
           if ( preparing[i].fulltitle.indexOf(" (Dt.") != -1) {
             var filmtitle = preparing[i].fulltitle.split(" (Dt.")
             var origtitle = filmtitle[0];
             var displaytitle = preparing[i].fulltitle.replace(" (Dt.: ", "</a><br />(");
             var imdbtitle = origtitle;
           } else {
             var origtitle = "";
             var displaytitle = preparing[i].fulltitle;
             var imdbtitle = displaytitle;
           }
            var imdb = imdbprefix + encodeURIComponent(imdbtitle) + imdbsuffix;
          
          if (link != previouslink) {
            allrows += '<div>' + link + '<img src="' + preparing[i].img + '" /></a><br />' + link + displaytitle + "</a> " + "<br />" + imdb + releaseyear + durationdisplay + '<br /></div>' + "\n";
            
            mynewctr++;
            
          }
          
          previouslink = link;
          
          //}

        }
        return allrows;
      }



      if (debug != 0) {
        var skip = 0;
      }

      //                   "@type": "Movie",
      //                   "image": "https://d3owf1x34yi7gd.cloudfront.net/image/images/uploaded/57f558c1-4dd1-4abd-934c-c58e32fa4339/Toedliche_Fragen_cover.jpg",
      //                   "name": "Tödliche Fragen",
      //                   "url": "https://www.netzkino.de/filme/q-and-a",
      //                   "duration": "2H12M",
      //                   "director": "Sidney Lumet"

var scriptEl = $("__NEXT_DATA__");
var schemaObj = JSON.parse(scriptEl.innerHTML);
// var allkeys = Object.values(schemaObj.props.__dehydratedState.queries[2].state.data.data.parentCategory.subcategories.nodes[0].content.nodes).length;
var preparing = new Array();
var myindex = 0;
      
      // var allkeys = Object.values(schemaObj.props.__dehydratedState.queries[2].state.data.data.parentCategory.subcategories.nodes[0].content.nodes).length;
      // schemaObj.props.__dehydratedState.queries[2].state.data.data.parentCategory.subcategories.nodes[0].content.nodes[0].contentMovie
      // /                                                                                               ^29!!!
      //                                                                                                   objekt basteln und DANN dort durchloopen
      //  schemaObj.props.__dehydratedState.queries[2].state.data.data.parentCategory.subcategories.nodes[0].content.nodes[0].contentMovie usw
      
      
      
function film(fulltitle, link, img, runtime, relyear, genre) {
  this.fulltitle = fulltitle;
  this.link = link;
  this.img = img;
  this.runtime = runtime;
  this.relyear = relyear;
  this.genre = genre;
}

var movies = "";
      var previousslug = "";     
      
      var category = "";
      var moviesobj = "";
      
      

      
            if (schemaObj.props.pageProps.slug) {

        // schemaObj.props.__dehydratedState.queries[3].state.data.data.category.content.nodes ?
        moviesobj = schemaObj.props.__dehydratedState.queries[3].state.data.data.category;


          for (var j = 0, k = moviesobj.content.nodes.length; j < k; ++j) { // moviesobj.nodes[i].content.nodes.length
    // build array here, then loop through it
    var moviesobjitem = moviesobj.content.nodes[j].contentMovie;
    var slug = moviesobj.content.nodes[j].contentMovie.slug;
   // var movielogo = "";
  //  if (moviesobjitem.logo) {
//      movielogo = moviesobjitem.logo.masterUrl;
    //} else {
      var movielogo = moviesobjitem.widescreenImage.masterUrl;  // coverImage 
    // }
    
        var dttitle = moviesobjitem.title.replace(/\u2013|\u2014/g, "-");
    // console.log(dttitle + " - - - " +  slug);
    
        var origtitle = "";
        
        if (moviesobjitem.originalTitle) {
          origtitle = moviesobjitem.originalTitle.replace(/\u2013|\u2014/g, "-");
        } else {
          
          if (slug == null) {
            console.log(dttitle)
            slug = "#";
          } else {
            origtitle = slug.replace(/-/g, " ").replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
          }
          //origtitle = moviesobjitem.slug;
          
            // moviesobjitem.slug.replace(/-/g, " ").replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        }

        
        var checkorigtitle = origtitle.toLowerCase();
        var checkdttitle = dttitle.toLowerCase();
//console.log("checkdttitle "+checkdttitle+"\n"+"checkorigtitle "+checkorigtitle);
        var myregex = new RegExp(" – .*", "gi");
        checkdttitle = checkdttitle.replace(myregex, "");
        checkorigtitle = checkorigtitle.replace(myregex, "");
        myregex = new RegExp(" - .*", "gi");
        checkdttitle = checkdttitle.replace(myregex, "");
        checkorigtitle = checkorigtitle.replace(myregex, "");
        myregex = new RegExp(": .*", "gi");
        checkdttitle = checkdttitle.replace(myregex, "");
        checkorigtitle = checkorigtitle.replace(myregex, "");
        // console.log("checkdttitle "+checkdttitle+"\n"+"checkorigtitle "+checkorigtitle);
        checkdttitle = checkdttitle
          .replace(/-/g, " ")
          .replace(/  /g, " ")
          .replace(/ä/g, "a")
          .replace(/ü/g, "u")
          .replace(/ö/g, "o")
          .replace(/ß/g, "ss")
          .replace(/é/g, "e")
          .replace(/ñ/g, "n")
          .replace(/the | uncut| hd| 3d| 4k|\!|\&|\.|\,|\:|\;|\'|\"/g, "");
        /*
          .replace(/-/g, " ")
          .replace(/ä/g, "a")
          .replace(/ü/g, "u")
          .replace(/ö/g, "o")
          .replace(/ö/g, "ß")
          .replace(/é/g, "e")
          .replace(/ñ/g, "n")
          .replace(/the /g, "")
          .replace(/ uncut/g, "")
          .replace(/ hd/g, "")
          .replace(/ 3d/g, "")
          .replace(/\!/g, "")
          .replace(/\&/g, "")
          .replace(/\./g, "")
          .replace(/\,/g, "")
          .replace(/\:/g, "")
          .replace(/\;/g, "")
          .replace(/  /g, " ")
          .replace(/\'/g, "")
          .replace(/\"/g, "");
        */
        checkorigtitle = checkorigtitle
          .replace(/-/g, " ")
          .replace(/  /g, " ")
          .replace(/ä/g, "a")
          .replace(/ü/g, "u")
          .replace(/ö/g, "o")
          .replace(/ß/g, "ss")
          .replace(/é/g, "e")
          .replace(/ñ/g, "n")
          .replace(/the | uncut| hd| 3d| 4k|\!|\&|\.|\,|\:|\;|\'|\"/g, "");
          
                     //   console.log("checkdttitle "+checkdttitle+"\n"+"checkorigtitle "+checkorigtitle);

        var fulltitle, temptitle = "";
        
        if (checkdttitle == checkorigtitle) {
          if (dttitle.indexOf(" - ") == -1) {
          fulltitle = dttitle;
          } else {
          fulltitle = origtitle;
          }
          
        } else {
          
            if (dttitle.indexOf(" - ") != -1) {
              temptitle = dttitle.split(" - ");
              fulltitle = temptitle[0];

            } else if (dttitle.indexOf(": ") != -1) {
              temptitle = dttitle.split(": ");
              fulltitle = temptitle[0];

            } else {
              fulltitle = origtitle + " (Dt.: " + dttitle + ")";
            }
          
        }
    
    // ?

    console.log ("slug: " + slug +", previousslug: " + previousslug);
    if (slug != previousslug) {
    preparing[myindex] = new film(fulltitle, "https://www.netzkino.de/details/" + slug, movielogo, moviesobjitem.runtimeInSeconds, moviesobjitem.productionYear, moviegenre);

    myindex++;
      
      
    }
    
     previousslug = slug;

  }
        
        
      }
      

      
      else {

        moviesobj = schemaObj.props.__dehydratedState.queries[2].state.data.data.parentCategory.subcategories;

for (var i = 0, l = moviesobj.nodes.length; i < l; ++i) {
  


  for (var j = 0, k = moviesobj.nodes[i].content.nodes.length; j < k; ++j) { // moviesobj.nodes[i].content.nodes.length
    // build array here, then loop through it
    var moviesobjitem = moviesobj.nodes[i].content.nodes[j].contentMovie;
    var slug = moviesobj.nodes[i].content.nodes[j].contentMovie.slug;
   // var movielogo = "";
  //  if (moviesobjitem.logo) {
//      movielogo = moviesobjitem.logo.masterUrl;
    //} else {
      var movielogo = moviesobjitem.widescreenImage.masterUrl;  // coverImage 
    // }
    var moviegenre = "";
    if (moviesobjitem.genres.nodes[0]) {
      moviegenre = moviesobjitem.genres.nodes[0].category.title;
    }
    
        var dttitle = moviesobjitem.title.replace(/\u2013|\u2014/g, "-");
    // console.log(dttitle + " - - - " +  slug);
    
        var origtitle = "";
        
        if (moviesobjitem.originalTitle) {
          origtitle = moviesobjitem.originalTitle.replace(/\u2013|\u2014/g, "-");
        } else {
          
          if (slug == null) {
            console.log(dttitle)
            slug = "#";
          } else {
            origtitle = slug.replace(/-/g, " ").replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
          }
          //origtitle = moviesobjitem.slug;
          
            // moviesobjitem.slug.replace(/-/g, " ").replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        }

        
        var checkorigtitle = origtitle.toLowerCase();
        var checkdttitle = dttitle.toLowerCase();
//console.log("checkdttitle "+checkdttitle+"\n"+"checkorigtitle "+checkorigtitle);
        var myregex = new RegExp(" – .*", "gi");
        checkdttitle = checkdttitle.replace(myregex, "");
        checkorigtitle = checkorigtitle.replace(myregex, "");
        myregex = new RegExp(" - .*", "gi");
        checkdttitle = checkdttitle.replace(myregex, "");
        checkorigtitle = checkorigtitle.replace(myregex, "");
        myregex = new RegExp(": .*", "gi");
        checkdttitle = checkdttitle.replace(myregex, "");
        checkorigtitle = checkorigtitle.replace(myregex, "");
        // console.log("checkdttitle "+checkdttitle+"\n"+"checkorigtitle "+checkorigtitle);
        checkdttitle = checkdttitle
          .replace(/-/g, " ")
          .replace(/  /g, " ")
          .replace(/ä/g, "a")
          .replace(/ü/g, "u")
          .replace(/ö/g, "o")
          .replace(/ß/g, "ss")
          .replace(/é/g, "e")
          .replace(/ñ/g, "n")
          .replace(/the | uncut| hd| 3d| 4k|\!|\&|\.|\,|\:|\;|\'|\"/g, "");
        /*
          .replace(/-/g, " ")
          .replace(/ä/g, "a")
          .replace(/ü/g, "u")
          .replace(/ö/g, "o")
          .replace(/ö/g, "ß")
          .replace(/é/g, "e")
          .replace(/ñ/g, "n")
          .replace(/the /g, "")
          .replace(/ uncut/g, "")
          .replace(/ hd/g, "")
          .replace(/ 3d/g, "")
          .replace(/\!/g, "")
          .replace(/\&/g, "")
          .replace(/\./g, "")
          .replace(/\,/g, "")
          .replace(/\:/g, "")
          .replace(/\;/g, "")
          .replace(/  /g, " ")
          .replace(/\'/g, "")
          .replace(/\"/g, "");
        */
        checkorigtitle = checkorigtitle
          .replace(/-/g, " ")
          .replace(/  /g, " ")
          .replace(/ä/g, "a")
          .replace(/ü/g, "u")
          .replace(/ö/g, "o")
          .replace(/ß/g, "ss")
          .replace(/é/g, "e")
          .replace(/ñ/g, "n")
          .replace(/the | uncut| hd| 3d| 4k|\!|\&|\.|\,|\:|\;|\'|\"/g, "");
          
                     //   console.log("checkdttitle "+checkdttitle+"\n"+"checkorigtitle "+checkorigtitle);

        var fulltitle, temptitle = "";
        
        if (checkdttitle == checkorigtitle) {
          if (dttitle.indexOf(" - ") == -1) {
          fulltitle = dttitle;
          } else {
          fulltitle = origtitle;
          }
          
        } else {
          
            if (dttitle.indexOf(" - ") != -1) {
              temptitle = dttitle.split(" - ");
              fulltitle = temptitle[0];

            } else if (dttitle.indexOf(": ") != -1) {
              temptitle = dttitle.split(": ");
              fulltitle = temptitle[0];

            } else {
              fulltitle = origtitle + " (Dt.: " + dttitle + ")";
            }
          
        }
    
    // ?

    console.log ("slug: " + slug +", previousslug: " + previousslug);
    if (slug != previousslug) {
    preparing[myindex] = new film(fulltitle, "https://www.netzkino.de/details/" + slug, movielogo, moviesobjitem.runtimeInSeconds, moviesobjitem.productionYear, moviegenre);

    myindex++;
      
      
    }
    
     previousslug = slug;

  }


  
}
        
      }
      
      

      

      

      

      
      /*
      
schemaObj.props.__dehydratedState.queries[2].state.data.data.parentCategory.subcategories.nodes[0].content.nodes[0].contentMovie:



title.regex( -.*)
slug
logo.masterUrl
runtimeInSeconds
logo.masterUrl.productionYear
genres.nodes.category.title <- genre
      
      */

      // prepared = preparing;
      
      preparing = preparing.sort();
      var prepared = [...new Set(preparing)];
      prepared = prepared.sort();
      
      
      
      
      //alert(preparing.length);
      //alert(prepared.length);

      /*
      if ( getParameterByName('sort') == "az") {
        prepared = preparing.sort((a, b) => a.fulltitle.localeCompare(b.fulltitle));


        mode = ": a-z";
      } else if ( getParameterByName('sort') == "za") {
        prepared = preparing.sort((a, b) => b.fulltitle.localeCompare(a.fulltitle));

        mode = ": z-a";
       } else if ( getParameterByName('sort') == "09") {
        prepared = preparing.sort((a, b) => a.relyear - b.relyear);
        mode = ": 1990-2050";
      } else if ( getParameterByName('sort') == "90") {
        prepared = preparing.sort((a, b) => b.relyear - a.relyear);
        mode = ": 2050-1990";
        
      } else if ( getParameterByName('sort') == "min") {
        prepared = preparing.sort((a, b) => a.runtime - b.runtime);
        mode = ": runtime";
        
      } else if ( getParameterByName('sort') == "nim") {
        prepared = preparing.sort((a, b) => b.runtime - a.runtime);
        mode = ": runtime";
        
      }
      */
      

      var screenwidth = window.innerWidth;
      var imgsize = Math.floor(screenwidth / 3 - 250);
      var cssimg = imgsize.toString();
      var padcss = Math.floor(imgsize / 3).toString();
      var marcss = Math.floor(imgsize).toString();
      var mediathek, dvdx, colcount = "";
      var dvdr = '<div class="box"></div>\n';
      
        if (columns == 6) {
        colcount = "16% 16% 16% 16% 16% 16";
        dvdx = dvdr;
      }  else if (columns == 5) {
        colcount = "19% 19% 19% 19% 19";
        dvdx = dvdr;
      } else if (columns == 4) {
        colcount = "25% 25% 25% 25";
        dvdx = dvdr;
      } else {
        colcount = "33% 33% 33";
      }
      
            var mdash = " &bull; ";
      
      var genres = '';
      var categories = 'Kategorien: ';

      var genresArr = new Array();
      var categoriesArr = new Array();
      
      for (var i = 0, l = document.querySelectorAll('.css-1rynq56.r-1e5kcd1.r-13uqrnb.r-aruset.r-1loqt21.r-173mn98.r-1ow6zhx').length; i < l; ++i) {
        genresArr[i] = '<a href="' + document.querySelectorAll('.css-1rynq56.r-1e5kcd1.r-13uqrnb.r-aruset.r-1loqt21.r-173mn98.r-1ow6zhx')[i].href + '">' + document.querySelectorAll('.css-1rynq56.r-1e5kcd1.r-13uqrnb.r-aruset.r-1loqt21.r-173mn98.r-1ow6zhx')[i].title.replace("Mehr Inhalte aus der Kategorie ","") + '</a> ';

      }
      
      /*
      for (var i = 0, l = $cn("r-157gdtw").length; i < l; ++i) {
        //if (document.getElementsByClassName("r-157gdtw")[i].getElementsByTagName("a")[0].href.indexOf("netzkinoplus") == -1) {
          categoriesArr[i] = '<a href="' + $cn("r-157gdtw")[i].getElementsByTagName("a")[0].href + '">' + $cn("r-157gdtw")[i].getElementsByTagName("h1")[0].innerText.replace("kino","").replace("Neu bei Netz","Neuheiten") + '</a> ';
        //}
      }
      
      categoriesArr = categoriesArr.sort();
      */
      genresArr = genresArr.sort();
      
      /*
      for (var i = 0, l = categoriesArr.length; i < l; ++i) {
        categories += categoriesArr[i];
        if (i != categoriesArr.length-1) {
          categories += mdash;
        }
      }
      
      */     
      
      for (var i = 0, l = genresArr.length; i < l; ++i) {
        genres += genresArr[i];
        if (i != genresArr.length-1) {
          genres += mdash;
        }
      }

      

           
      /*
      for (var i = 0, l = document.getElementsByClassName("r-m611by").length; i < l; ++i) {
        genres += '<a href="' + document.getElementsByClassName("r-m611by")[i].href + '">' + document.getElementsByClassName("r-m611by")[i].getAttribute("aria-label") + '</a> ';
        if (i != document.getElementsByClassName("r-m611by").length-1) {
          genres += mdash;
        }
      }
      for (var i = 0, l = document.getElementsByClassName("r-157gdtw").length; i < l; ++i) {
        if (document.getElementsByClassName("r-157gdtw")[i].getElementsByTagName("a")[0].href.indexOf("netzkinoplus") == -1) {
          categories += '<a href="' + document.getElementsByClassName("r-157gdtw")[i].getElementsByTagName("a")[0].href + '">' + document.getElementsByClassName("r-157gdtw")[i].getElementsByTagName("h1")[0].innerText + '</a> ';
          if (i != document.getElementsByClassName("r-157gdtw").length-1) {
            categories += mdash;
          }
        }
      }
      */
      

      var newtitle = document.title;
      var myregex = new RegExp(" – .*", "gi");
      newtitle = newtitle.replace(myregex, "");
      myregex = new RegExp(" - .*", "gi");
      newtitle = newtitle.replace(myregex, "");
      newtitle = newtitle.replace("Netzkino","");
      newtitle = newtitle.replace("kino","");
      newtitle = newtitle.replace(" |","");
      var dp = "";
      if (newtitle != "") {
        dp = ": ";
      }
      mediathek += '<html><head><title>' + scriptname + dp + newtitle + '</title><base href="https://www.netzkino.de/"><meta charset="utf-8">\n';
      mediathek += '<link rel=\'icon\' type=\'image/svg+xml\' href=\''+ favicon +'\' />';
      mediathek += '<link rel="icon" type="image/svg+xml" href="'+ favicon +'" />';
      mediathek += '<style>body { margin: 10px; font-family: Arial; overflow-x: hidden; } img {width: 255px; height: 145px; text-decoration:none;border:none;} div {display: inline}\n';
      mediathek += 'rect.imdb, svg.imdb, img.imdb {width: auto; height: auto;} .wrapper { display: grid; grid-gap: 10px; grid-template-columns: ' + colcount + '%; background-color: #fff; color: #444; }\n';
      mediathek += '.sortlink {text-decoration: underline} .sortlink:hover {text-decoration: none} .box { background-color: #444; color: #fff; border-radius: 5px; padding: 10px; font-size: 100%; }\n';
      mediathek += '.bottom {margin-top: ' + marcss + 'px;margin-bottom: ' + padcss + 'px;}  .top {margin-top: ' + padcss + 'px;} .links {line-height: 1.35em}</style>\n</head><body>\n';
      mediathek += '<span class="links"><a href="https://www.netzkino.de/">' + nfsvg +'</a> <br /> ' + newtitle;
      
      
      if (newtitle != "") {
        mediathek += ": ";
      }
      
      
      mediathek += prepared.length + " Titel " + mdash;
      /*if (location.hash == "#az") {
        mediathek += 'Sortierung: <a href="' + location.protocol+'//'+location.host+location.pathname + '#view" target="_new">standard</a> (&ouml;ffnet im neuen Tab) | alphabetisch';
      } else { */
      mediathek += '<a href="/search">Suchen?</a>' + mdash + 'Sortierung: Titel <a id="sortaz" class="sortlink">A-Z</a> / <a id="sortza" class="sortlink">Z-A</a> | Jahr <a id="sort09" class="sortlink">1940-2040</a> / <a id="sort90" class="sortlink">2040-1940</a> | L&auml;nge <a id="sortmin" class="sortlink">&lt;&lt;&lt; (kurz)</a> / <a id="sortnim" class="sortlink">(lang) &gt;&gt;&gt;</a>';
      if (!(schemaObj.props.pageProps.slug)) {
              mediathek += '\n<br />' + '<a href="/genres">"Genres"</a>' + mdash + '<a href="/themenkino">"Themenkino"</a>' + mdash + genres + '<br />';
      }


      //}
      // mediathek += 'Startseite: <a href="https://www.netzkino.de/">Netzkino</a> ' + mdash  + "Sortierung: " + '<a href="#" onclick="location.hash=\"#view\";window.location.reload();">standard</a>' + " | " + '<a href="' + location.protocol+'//'+location.host+location.pathname + "#az" + '">alphabetisch</a>';
      // mediathek += " " + mdash + " " + newtitle;


      /*
      if (categoriesArr.length > 1) {
        mediathek += "<br />" +  categories;
      }
      */
      mediathek += "</span><br /><br /><br />"; 
      mediathek += '<div class="wrapper" id="nfct">';
      // <div class="box">' + dvdr + dvdr + dvdx
      // mediathek += writetable(prepared);
      //mediathek += '</div></body></html>';
      mediathek += '</div><script type="application/ld+json" id="netzflix">var prepared =' + JSON.stringify(preparing) + ';</script></body></html>';
      /*
      document.getElementById("sortstd").onclick = function() {
        location.hash=\"#view\";
        window.location.reload();
      } 
      
        var irgendwas = document.getElementById("netzflix");

        var schemaObjnew = JSON.parse(irgendwas.innerHTML);
      
      */

      // fix for some weird throw of undefined in the generated markup
      // document.write(mediathek.replace(/undefined/g, ""));
      
      
      $tn("html")[0].innerHTML = mediathek.replace(/undefined/g, "");
      
      var presorted = prepared.filter((o, index, arr) =>
        arr.findIndex(item => JSON.stringify(item) === JSON.stringify(o)) === index
      );
      
      var newlysorted = presorted.sort((a, b) => b.relyear - a.relyear);

      $("nfct").innerHTML = writetable(presorted).replace(/undefined/g, "");
      
      $tn("body")[0].style.display = "block";
      $tn("body")[0].style.visibility = "visible";
      
      $("sortaz").onclick = function() {
        var newlysorted = prepared.sort((a, b) => a.fulltitle.localeCompare(b.fulltitle));
        $("nfct").innerHTML = writetable(newlysorted).replace(/undefined/g, "");
      }
      $("sortza").onclick = function() {
        var newlysorted = prepared.sort((a, b) => b.fulltitle.localeCompare(a.fulltitle));
        $("nfct").innerHTML = writetable(newlysorted).replace(/undefined/g, "");
      }
      $("sortmin").onclick = function() {
        var newlysorted = prepared.sort((a, b) => a.runtime - b.runtime);
        $("nfct").innerHTML = writetable(newlysorted).replace(/undefined/g, "");
      }
      $("sortnim").onclick = function() {
        var newlysorted = prepared.sort((a, b) => b.runtime - a.runtime);
        $("nfct").innerHTML = writetable(newlysorted).replace(/undefined/g, "");
      }
      $("sort09").onclick = function() {
        var newlysorted = prepared.sort((a, b) => a.relyear - b.relyear);
        $("nfct").innerHTML = writetable(newlysorted).replace(/undefined/g, "");
      }
      document.getElementById("sort90").onclick = function() {
        var newlysorted = prepared.sort((a, b) => b.relyear - a.relyear);
        $("nfct").innerHTML = writetable(newlysorted).replace(/undefined/g, "");
      }
      
      if (schemaObj.props.pageProps.slug) {
      setInterval(function () {document.title = scriptname + ": " + newtitle; console.log("title fixed") }, 29000);
      } else {
      setInterval(function () {document.title = scriptname; console.log("title fixed") }, 29000);
      }

});
